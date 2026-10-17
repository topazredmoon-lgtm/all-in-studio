#!/usr/bin/env python3
"""type_audit — typographic hardening audit (UPG-L2, T-R2B). Completes UPG-N1's font work
by enforcing the OWNS of DEF-L3 as a reproducible check instead of a one-time finding.

Checks (report-only; registration/mismatch classes flip to FAIL under --strict):
  C1 token family with NO registered face (today: font.fraunces -> DEF-L3)
  C2 registered face whose woff2 file is missing on disk (render would stall on delayRender)
  C3 woff2 on disk that no face points at (dead asset)
  C4 fontSize below the 22 px floor (DESIGN.md "nothing readable below 22")
  C5 AllinSerif/font.serif with fontWeight >= 800 (UPG-L2 weight discipline)
  C6 woff2 files without an adjacent .license.txt (licence hygiene for additive fonts)

Usage:  python tools/type_audit.py [--strict]
Contract: PASS/WARN lines; FAIL [type_audit] only in --strict mode (exit 1).
Zero dependencies beyond stdlib + re.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENGINE = ROOT / "engine"
SRCD = ENGINE / "src"

TOKENS = SRCD / "ds" / "tokens.ts"
CORE = SRCD / "ds" / "core.tsx"
FONTS = ENGINE / "public" / "fonts"

SIZE_FLOOR = 22
SERIF_FAM = {"AllinSerif", "font.serif", "fraunces", "AllinFraunces"}


def parse_token_families():
    """font.<name>: 'FamilyName, fallback...' in tokens.ts -> {family: token_key}."""
    if not TOKENS.exists():
        return {}
    text = TOKENS.read_text(encoding="utf-8", errors="replace")
    m = re.search(r"export const font = \{(.*?)\} as const;", text, re.S)
    out = {}
    if not m:
        return out
    for k, v in re.findall(r"(\w+):\s*'([^']*)'", m.group(1)):
        fam = v.split(",")[0].strip()
        out[k] = fam
    return out


def parse_registered():
    """FACES/STATIC arrays in core.tsx -> [(family, woff2_path/style/weight)]."""
    if not CORE.exists():
        return []
    text = CORE.read_text(encoding="utf-8", errors="replace")
    reg = []
    for arr in ("FACES", "STATIC"):
        m = re.search(rf"const {arr}:\s*\[string, string, string\]\[\]\s*=\s*\[(.*?)\];", text, re.S)
        if not m:
            continue
        for fam, woff in re.findall(r"\['([^']+)',\s*'([^']+)'", m.group(1)):
            reg.append((fam, woff))
    return reg


def dir_fonts() -> list:
    return sorted(p.name for p in FONTS.glob("*.woff2")) if FONTS.exists() else []


def scan_usage():
    """For C4/C5: walk engine/src .tsx/.ts, catch raw fontSize literals and
    fontWeight>=800 near serif families."""
    size_hits = []
    weight_hits = []
    if not SRCD.exists():
        return size_hits, weight_hits
    for p in SRCD.rglob("*.tsx"):
        try:
            lines = p.read_text(encoding="utf-8", errors="replace").splitlines()
        except Exception:
            continue
        for i, ln in enumerate(lines):
            for m in re.finditer(r"fontSize:\s*(\d{1,3})\b", ln):
                px = int(m.group(1))
                if px < SIZE_FLOOR:
                    size_hits.append((str(p.relative_to(ROOT)), i + 1, px))
            # C5 approximate: serif family string on nearby lines with fontWeight 800/900
            win = "\n".join(lines[max(0, i - 2): i + 3])
            if re.search(r"(AllinSerif|font\.serif|font\.fraunces|AllinFraunces)", win) and re.search(r"fontWeight:\s*(800|900)\b", win):
                weight_hits.append((str(p.relative_to(ROOT)), i + 1))
    return size_hits, weight_hits


def main():
    strict = "--strict" in sys.argv[1:]
    problems = 0
    fams = parse_token_families()
    reg = parse_registered()
    disk = dir_fonts()
    reg_names = {Path(w).name for _, w in reg}
    fams_now = set(fams.values())
    fams_now_d = set()  # families declared (first token per family key)

    print("=== TYPE AUDIT (tokens <-> faces <-> woff2 <-> usage) ===")
    print(f"  tokens.ts families: {sorted(fams_now)}")
    print(f"  core.tsx registered faces: {sorted(set((f, w) for f, w in reg))}")
    print(f"  engine/public/fonts on disk: {disk}")

    for token_key, fam in sorted(fams.items()):
        fams_now_d.add(fam)
        if fam not in {f for f, _ in reg}:
            print(f"  WARN [type_audit] C1 token font.{token_key} -> '{fam}' has NO registered face (DEF-L3 class: half-implemented font)")
    for f, w in reg:
        if not (FONTS / Path(w).name).exists():
            print(f"  WARN [type_audit] C2 face '{f}' loads '{w}' but the file is NOT on disk (FontFace.load would reject; strict: FAIL)")
            # in strict mode this is real breakage: counts as a problem
            if strict:
                problems += 1
        elif strict:
            pass
    for f in disk:
        if f not in reg_names:
            print(f"  WARN [type_audit] C3 '{f}' on disk but never loaded by core.tsx (dead asset)")
    size_hits, weight_hits = scan_usage()
    for path, line, px in size_hits[:40]:
        print(f"  WARN [type_audit] C4 {path}:{line} fontSize:{px} below the {SIZE_FLOOR}px floor (DESIGN.md)")
    if len(size_hits) > 40:
        print(f"  ... {len(size_hits) - 40} more below-floor hits")
    for path, line in weight_hits[:20]:
        print(f"  WARN [type_audit] C5 {path}:{line} fontWeight>=800 on/around a serif family (UPG-L2 weight discipline)")
    # C6 licence notes for additive fonts
    for f in disk:
        lic = FONTS / (f + ".license.txt")
        if not lic.exists() and not (FONTS / "LICENSES.md").exists():
            print(f"  WARN [type_audit] C6 '{f}' has no licence note (add fonts/LICENSES.md or <file>.license.txt)")

    if size_hits or weight_hits:
        problems += 0  # C4/C5 stay WARN-only by design (report-only law)
    if strict:
        c1 = sum(1 for tok in fams.values() if tok not in {f for f, _ in reg})
        print(f"\n{'FAIL' if (c1 or problems) else 'PASS'} [type_audit] strict: {c1} token-without-face + {problems} broken registrations")
        sys.exit(1 if (c1 or problems) else 0)
    print("\nreport-only mode (add --strict to FAIL on registration breakage)")
    sys.exit(0)


if __name__ == "__main__":
    main()
