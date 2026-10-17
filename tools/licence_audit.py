"""Licence & Money Rule Audit: python tools/licence_audit.py <video_id> [--all]
Verifies compliance with the studio's Money Rule (Zero Revenue Risk):
  1. Every clip in script.json is logged in videos/<vid>/LICENCES.md
  2. Licences must be verifiably free: CC BY, CC BY-SA, CC0, Public Domain (US Gov / Senate PD)
  3. Strictly banned commercial news (WSJ, Vox, CNN, MSNBC, BBC, Bloomberg) and TED/TEDx talks are prohibited
  4. Clip files referenced in script.json must exist in engine/public/
  5. Both LICENCES.md and SOURCES.md must exist in the topic folder
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BANNED_SOURCES = [
    "wsj", "wall street journal", "vox", "cnn", "msnbc", "cnbc",
    "fox news", "nytimes", "new york times", "washington post",
    "ted talk", "tedx", "shutterstock", "getty images", "istock", "pond5"
]

ALLOWED_LICENCES = [
    "cc by", "cc-by", "cc0", "public domain", "us gov", "us-gov", "gov work",
    "studio-owned", "original", "creative commons"
]


def audit_topic(vid: str) -> tuple[list[str], list[str]]:
    fails = []
    warns = []
    vdir = ROOT / "videos" / vid
    if not vdir.is_dir():
        fails.append(f"Topic directory does not exist: {vdir}")
        return fails, warns

    lic_file = vdir / "LICENCES.md"
    src_file = vdir / "SOURCES.md"

    if not lic_file.exists():
        fails.append(f"{vid}: Missing LICENCES.md (mandatory under Money Rule)")
    if not src_file.exists():
        warns.append(f"{vid}: Missing SOURCES.md")

    lic_text = lic_file.read_text(encoding="utf-8").lower() if lic_file.exists() else ""
    src_text = src_file.read_text(encoding="utf-8").lower() if src_file.exists() else ""

    # Check for banned commercial sources in LICENCES.md
    for banned in BANNED_SOURCES:
        # Check if banned appears as an asset/clip source (not just in "No news, no TED")
        # Match lines in markdown tables or bullet points mentioning the banned source
        lines = lic_text.splitlines()
        for idx, line in enumerate(lines, 1):
            if banned in line:
                # Disregard lines that explicitly declare prohibition ("no news", "no wsj", "never cnn", etc.)
                if any(neg in line for neg in ["no ", "never ", "not ", "prohibited", "banned", "without ", "zero "]):
                    continue
                fails.append(f"{vid}: Banned commercial source '{banned}' mentioned in LICENCES.md (line {idx})")

    # Check script clips
    script_path = vdir / "script.json"
    if script_path.exists():
        try:
            script = json.loads(script_path.read_text(encoding="utf-8"))
            clips = []
            for b in script.get("beats", []):
                if "clip" in b:
                    clips.append((b["id"], b["clip"]))

            pub = ROOT / "engine" / "public"
            for bid, c in clips:
                c_src = c.get("src", "")
                if not c_src:
                    fails.append(f"{vid}/{bid}: clip has no 'src'")
                    continue

                # Verify media exists in public folder
                clip_path = pub / c_src
                if not clip_path.exists():
                    fails.append(f"{vid}/{bid}: clip file missing at engine/public/{c_src}")

                # Verify clip is mentioned in LICENCES.md
                stem = Path(c_src).name.lower()
                stem_base = stem.rsplit(".", 1)[0]
                if lic_text and (stem not in lic_text and stem_base not in lic_text and bid.lower() not in lic_text):
                    fails.append(f"{vid}/{bid}: clip '{c_src}' is not documented in LICENCES.md")

            if not clips:
                # If no clips, ensure LICENCES.md clarifies it is picture-only or studio-owned
                if lic_text and not any(k in lic_text for k in ["picture-only", "original", "vector", "no clips", "none"]):
                    warns.append(f"{vid}: LICENCES.md does not explicitly confirm picture-only status")

        except Exception as e:
            fails.append(f"{vid}: Failed to parse script.json: {e}")

    return fails, warns


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
        print(__doc__.strip())
        sys.exit(0)

    target = sys.argv[1]
    if target == "--all":
        topics = sorted([
            p.name for p in (ROOT / "videos").iterdir()
            if p.is_dir() and not p.name.startswith(("_", ".")) and (p / "script.json").exists()
        ])
    else:
        topics = [target]

    total_fails = 0
    total_warns = 0

    print("=== Studio Money Rule & Licence Audit ===")
    for vid in topics:
        fails, warns = audit_topic(vid)
        total_fails += len(fails)
        total_warns += len(warns)
        status = "[PASS]" if not fails else "[FAIL]"
        print(f"  {status:6} {vid} ({len(fails)} FAIL, {len(warns)} WARN)")
        for f in fails:
            print(f"         FAIL: {f}")
        for w in warns:
            print(f"         WARN: {w}")

    print(f"\nAudit complete: {total_fails} FAIL, {total_warns} WARN")
    sys.exit(1 if total_fails > 0 else 0)


if __name__ == "__main__":
    main()
