#!/usr/bin/env python3
"""prosody_forge.py — measured, line-local prosody repair for voice_check-flagged lines.

The problem
  tools/voice_check.py flags lines whose pitch / spread / level / rate stands out, or whose
  statement still RISES at the end like a question ("rising end"). It says WHAT is wrong but
  not how to fix it, and re-voicing a whole topic to fix one line is unacceptable: the
  narrator's pacing is the film. The studio's own grammar already holds two safe per-line levers:

    Kokoro topics      punctuation of the spoken text (phrasing drives the contour)   — text lever
    Chatterbox topics  the per-beat `ex` exaggeration field (already authored per line) — voice lever

What this tool does
  1. runs voice_check, parses the per-line metrics and the flags  (the queue)
  2. for each targeted line, builds a small candidate set of ONE-FIELD edits
     (kokoro: terminal punctuation / dash→comma / semicolon→period;
      chatterbox: ex -0.30, ex -0.15, ex +0.15)
  3. voices each candidate in a THROWAWAY sandbox topic (videos/_forge_<slug>) whose audio
     dir is a copy of the real one, so only the edited line re-synthesizes — every other
     line stays byte-identical through the engine's own hash cache
  4. re-runs voice_check on the sandbox (same metric code as qa.py) and accepts a candidate
     only if the flagged reason(s) clear while no other metric goes |z| > 2.5
  5. writes research/prosody_forge/<slug>.json with the queue, every candidate measurement
     and the verdict; --apply copies the winning take (plus the script edit, with backups)
     back into the real topic and tells you to re-run tools/build.py

Nothing in the real topic is touched without --apply. Honest by design: if no candidate
clears a flag, the report says "text-level rewrite needed" instead of pretending.

Usage
  python tools/prosody_forge.py <slug> --queue
  python tools/prosody_forge.py <slug> --probe a05,a22 [--candidates N] [--apply] [--clean]
  python tools/prosody_forge.py <slug> --probe a05 --engine kokoro

Run under the system interpreter (tts.py needs it for Kokoro; tts_cb self-dispatches to the
voice venv). Exit 0 always (analysis tool), 2 if it cannot run at all.
"""
from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VOICE_PY = ROOT.parent / "voice" / ".venv-tts" / "Scripts" / "python.exe"
ROW_RE = re.compile(r"^(\S+)\s+(\d+)\s+(\d+)\s+(-?\d+(?:\.\d+)?)\s+(\d+\.\d+)\s+([+-]\d+)%\s*(?:!\s*(.*))?$")
VOICE_PRESETS = {
    "af_heart": "assets/voice/ref_female_captchas.wav",
    "captchas": "assets/voice/ref_female_captchas.wav",
    "kore": "assets/voice/ref_female_kore.wav",
    "fenrir": "assets/voice/narrator_ref.wav",
}


def env() -> dict:
    import os
    e = os.environ.copy()
    e.setdefault("PYTHONIOENCODING", "utf-8")
    e.setdefault("HF_HOME", str(ROOT.parent / "voice" / "hf-cache"))
    e.setdefault("HF_HUB_OFFLINE", "1")
    e.setdefault("ALLIN_VOICE_PY", str(VOICE_PY))
    return e


def run(cmd: list[str], timeout: int = 1800) -> subprocess.CompletedProcess:
    # encoding+errors matter: tts_cb prints UTF-8 progress blocks and the locale codec is cp1252 here
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace",
                          env=env(), timeout=timeout, cwd=str(ROOT))


# ------------------------------------------------------------------ voice_check
def voice_rows(slug: str) -> list[dict]:
    r = run([sys.executable, str(ROOT / "tools" / "voice_check.py"), slug, "--warn-only"], timeout=900)
    rows = []
    for line in (r.stdout or "").splitlines():
        m = ROW_RE.match(line.strip())
        if not m:
            continue
        rows.append({
            "id": m.group(1), "f0": float(m.group(2)), "spread": float(m.group(3)),
            "lvl": float(m.group(4)), "rate": float(m.group(5)), "rise": int(m.group(6)) / 100.0,
            "flags": [s.strip() for s in (m.group(7) or "").split(",") if s.strip()],
        })
    return rows


def medians(rows: list[dict]) -> dict:
    import numpy as np
    med = {}
    for k in ("f0", "spread", "lvl", "rate"):
        med[k] = float(np.median([r[k] for r in rows])) if rows else 0.0
    return med


def z_of(rows: list[dict]) -> list[dict]:
    import numpy as np
    for k in ("f0", "spread", "lvl", "rate"):
        x = np.array([r[k] for r in rows]) if rows else np.array([0.0])
        m, s = x.mean(), x.std() + 1e-9
        for r in rows:
            r["z_" + k] = float((r[k] - m) / s)
    return rows


# ------------------------------------------------------------------ engine detect
def detect_engine(slug: str, script: dict) -> dict:
    """kokoro | chatterbox (+ which reference for chatterbox) by recomputing cache hashes."""
    adir = ROOT / "videos" / slug / "audio"
    voice = script.get("voice", {})
    vname, vspeed = voice.get("name", "af_heart"), voice.get("speed", 0.95)
    V = {"ex": 0.65, "cfg": 0.35, "temp": 0.8, **voice}
    for b in script.get("beats", []):
        if "clip" in b:
            continue
        meta_p = adir / f"{b['id']}.json"
        if not meta_p.exists():
            continue
        try:
            meta = json.loads(meta_p.read_text(encoding="utf-8"))
        except Exception:  # noqa: BLE001
            continue
        h = meta.get("hash", "")
        text = b.get("say", b.get("vo", "")).strip()
        if not text:
            continue
        if meta.get("engine") == "chatterbox" or "lvl" in meta and not meta.get("sq"):
            for ref in set(VOICE_PRESETS.values()) | ({V["ref"]} if V.get("ref") else set()):
                for ex in (b.get("ex", V["ex"]),):
                    for cbv in ("cb3", "cb2"):
                        hh = hashlib.sha1(f"{text}|{ref}|{ex}|{V['cfg']}|{V['temp']}|{cbv}".encode()).hexdigest()[:12]
                        if hh == h:
                            return {"engine": "chatterbox", "ref": ref, "ex": ex, "beat": b["id"], "match": "hash"}
            return {"engine": "chatterbox", "ref": VOICE_PRESETS.get(vname, VOICE_PRESETS["af_heart"]), "ex": b.get("ex", V["ex"]), "beat": b["id"], "match": "engine-field"}
        hh = hashlib.sha1(f"{text}|{vname}|{vspeed}|1".encode()).hexdigest()[:12]
        if hh == h or "sq" in meta:
            return {"engine": "kokoro", "voice": vname, "speed": vspeed, "beat": b["id"], "match": "hash"}
    return {"engine": "unknown"}


# ------------------------------------------------------------------ candidates
def kokoro_candidates(text: str) -> list[dict]:
    out, seen = [], {text}
    t = text.rstrip()
    t1 = re.sub(r"[,;:—–\-…]+$", ".", t)
    if not re.search(r"[.?!]$", t1):
        t1 += "."
    if t1 != text and t1 not in seen:
        out.append({"kind": "terminal-punctuation", "text": t1}); seen.add(t1)
    t2 = re.sub(r"\s+[—–-]+\s+", ", ", t)
    t2 = re.sub(r"[,;:—–\-…]+$", ".", t2)
    if not re.search(r"[.?!]$", t2):
        t2 += "."
    if t2 != text and t2 not in seen:
        out.append({"kind": "dash-to-comma", "text": t2}); seen.add(t2)
    if "; " in t:
        t3 = t.replace("; ", ". ", 1)
        t3 = re.sub(r"(\.\s+)([a-z])", lambda m: m.group(1) + m.group(2).upper(), t3, count=1)
        t3 = re.sub(r"[,;:—–\-…]+$", ".", t3)
        if not re.search(r"[.?!]$", t3):
            t3 += "."
        if t3 not in seen:
            out.append({"kind": "semicolon-to-period", "text": t3}); seen.add(t3)
    # phrasing split: first inner comma (≥2 words in) → sentence break; tests whether the
    # end contour relaxes when the final clause is short. Meaning-preserving punctuation only.
    m = re.search(r",\s+", t)
    if m and len(t.split()) >= 6 and len(t[: m.start()].split()) >= 2:
        head, tail = t[: m.start()].rstrip() + ".", t[m.end():].strip()
        if tail:
            tail = tail[:1].upper() + tail[1:]
            t4 = head + " " + tail
            t4 = re.sub(r"[,;:—–\-…]+$", ".", t4)
            if not re.search(r"[.?!]$", t4):
                t4 += "."
            if t4 not in seen:
                out.append({"kind": "comma-to-period (phrasing)", "text": t4}); seen.add(t4)
    return out[:4]


def chatterbox_candidates(ex: float) -> list[dict]:
    out = []
    for delta in (-0.30, -0.15, 0.15):
        e = round(max(0.02, min(1.0, ex + delta)), 2)
        if abs(e - ex) > 1e-9:
            out.append({"kind": f"ex{delta:+.2f}", "ex": e})
    return out


# ------------------------------------------------------------------ sandbox + voice
def sandbox_paths(slug: str) -> tuple[Path, Path]:
    sb = ROOT / "videos" / f"_forge_{slug}"
    return sb, sb / "audio"


def make_sandbox(slug: str) -> Path:
    sb, adir = sandbox_paths(slug)
    real = ROOT / "videos" / slug
    if sb.exists():
        return sb
    adir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(real / "script.json", sb / "script.json")
    for f in (real / "audio").glob("*"):
        if f.is_file() and not f.name.startswith("_"):
            shutil.copy2(f, adir / f.name)
    return sb


def voice_sandbox(slug: str, engine: str) -> tuple[bool, str]:
    sb, _ = sandbox_paths(slug)
    if engine == "kokoro":
        cmd = [sys.executable, str(ROOT / "tools" / "tts.py"), sb.name]
    else:
        py = str(VOICE_PY) if VOICE_PY.exists() else sys.executable
        cmd = [py, str(ROOT / "tools" / "tts_cb.py"), sb.name]
    r = run(cmd, timeout=3600)
    ok = r.returncode == 0
    tail = (r.stdout or "").strip().splitlines()[-4:] + (r.stderr or "").strip().splitlines()[-2:]
    return ok, " | ".join(tail)


def patch_sandbox_script(slug: str, beat_id: str, cand: dict, base_script: dict, ref: str | None = None) -> None:
    sb, _ = sandbox_paths(slug)
    s = json.loads(json.dumps(base_script))  # deep copy
    if ref:
        s.setdefault("voice", {})["ref"] = ref
    for b in s["beats"]:
        if b.get("id") == beat_id:
            if "text" in cand:
                if "say" in b:
                    b["say"] = cand["text"]
                else:
                    b["vo"] = cand["text"]
            if "ex" in cand:
                b["ex"] = cand["ex"]
            break
    (sb / "script.json").write_text(json.dumps(s, ensure_ascii=False, indent=1), encoding="utf-8")


# ------------------------------------------------------------------ main
def main() -> int:
    ap = argparse.ArgumentParser(description="Measured line-local prosody repair for voice_check-flagged lines")
    ap.add_argument("slug")
    ap.add_argument("--queue", action="store_true", help="only print the flagged-line queue with proposed repair classes")
    ap.add_argument("--probe", help="comma-separated beat ids to repair (shells candidates through the sandbox)")
    ap.add_argument("--candidates", type=int, default=3, help="max candidates per line (default 3)")
    ap.add_argument("--apply", action="store_true", help="copy the winning take + script edit back into the real topic (backups kept)")
    ap.add_argument("--clean", action="store_true", help="delete the sandbox after the run")
    ap.add_argument("--report", default=str(ROOT / "research" / "prosody_forge"))
    args = ap.parse_args()

    vdir = ROOT / "videos" / args.slug
    if not (vdir / "script.json").exists():
        print(f"FAIL [prosody_forge] no script.json for '{args.slug}'")
        return 2
    script = json.loads((vdir / "script.json").read_text(encoding="utf-8"))
    beats = {b["id"]: b for b in script.get("beats", [])}

    rows = voice_rows(args.slug)
    if not rows:
        print(f"prosody_forge: no voiced lines for '{args.slug}'")
        return 0
    med = medians(rows)
    flagged = [r for r in rows if r["flags"]]

    eng = detect_engine(args.slug, script)
    print(f"[prosody_forge] {args.slug}: engine={eng.get('engine')} ({eng.get('match', '?')}) · {len(flagged)} flagged line(s) of {len(rows)}")
    if args.queue or not args.probe:
        for r in flagged:
            b = beats.get(r["id"], {})
            text = (b.get("say") or b.get("vo") or "")[:84]
            print(f"  {r['id']:<6} f0={r['f0']:.0f} spread={r['spread']:.0f} lvl={r['lvl']:.1f} rate={r['rate']:.2f} rise={r['rise']:+.0%}  ! {', '.join(r['flags'])}")
            print(f"         \"{text}\"")
        if args.queue:
            return 0

    targets = [t.strip() for t in args.probe.split(",") if t.strip()]
    report = {
        "tool": "prosody_forge", "topic": args.slug, "generated": dt.datetime.now().isoformat(timespec="seconds"),
        "engine": eng, "medians": med,
        "queue": [{"id": r["id"], "f0": r["f0"], "spread": r["spread"], "lvl": r["lvl"], "rate": r["rate"],
                   "rise": r["rise"], "flags": r["flags"]} for r in flagged],
        "experiments": [],
    }

    sb = make_sandbox(args.slug)
    print(f"[prosody_forge] sandbox: {sb}")

    winners = {}
    for tid in targets:
        orig = next((r for r in rows if r["id"] == tid), None)
        b = beats.get(tid)
        if not orig or not b:
            print(f"  {tid}: not a voiced beat — skipped")
            continue
        if not orig["flags"]:
            print(f"  {tid}: not flagged — skipped")
            continue
        text = (b.get("say") or b.get("vo") or "").strip()
        ex_target = float(b.get("ex", 0.65)) if eng["engine"] == "chatterbox" else 0.0
        cands = chatterbox_candidates(ex_target) if eng["engine"] == "chatterbox" else kokoro_candidates(text)
        cands = cands[: args.candidates]
        print(f"  {tid}: {len(cands)} candidate(s) (ex={ex_target or '-'}) · flags: {', '.join(orig['flags'])}")
        exp = {"beat": tid, "engine": eng["engine"], "original": {"metrics": {k: orig[k] for k in ('f0','spread','lvl','rate','rise')},
                                                                      "flags": orig["flags"]}, "candidates": []}
        best = None
        for ci, cand in enumerate(cands):
            patch_sandbox_script(args.slug, tid, cand, script, ref=eng.get("ref"))
            ok, log = voice_sandbox(args.slug, eng["engine"])
            if not ok:
                exp["candidates"].append({**cand, "error": log[:400]})
                print(f"    [{ci}] {cand.get('kind')}: VOICE FAILED ({log[:120]})")
                continue
            sub_rows = z_of(voice_rows(sb.name))
            got = next((r for r in sub_rows if r["id"] == tid), None)
            if not got:
                exp["candidates"].append({**cand, "error": "line missing after voicing"})
                continue
            cleared = [f for f in orig["flags"] if f not in got["flags"]]
            new_bad = [f for f in got["flags"] if f not in orig["flags"]]
            metric_shift = {k: round(got[k] - orig[k], 3) for k in ("f0", "spread", "lvl", "rate", "rise")}
            score = len(cleared) - 2 * len(new_bad) - (sum(1 for k in ("f0", "spread", "lvl", "rate") if abs(got.get("z_" + k, 0)) > 2.5))
            entry = {**cand, "metrics": {k: got[k] for k in ("f0", "spread", "lvl", "rate", "rise")},
                     "flags_after": got["flags"], "cleared": cleared, "new": new_bad,
                     "shift": metric_shift, "score": score, "log_tail": log[:200]}
            exp["candidates"].append(entry)
            print(f"    [{ci}] {cand.get('kind')}: cleared {cleared or '—'} · new {new_bad or '—'} · Δrise {metric_shift['rise']:+.0%} · score {score}")

            def _better(new_e, old_e):
                if old_e is None:
                    return True
                if new_e["score"] != old_e["score"]:
                    return new_e["score"] > old_e["score"]
                # tie → prefer the take that clears the flagged metric with the safer margin
                for f in new_e["cleared"]:
                    if f == "rising end":
                        return new_e["metrics"]["rise"] < old_e["metrics"]["rise"]
                    if f in ("f0", "rate", "spread"):
                        k = f if f in ("f0", "rate", "spread") else "f0"
                        return abs(new_e["metrics"][k] - med[k]) < abs(old_e["metrics"][k] - med[k])
                return False

            if _better(entry, best[1] if best else None):
                best = (cand, entry)
        if best and best[1]["score"] > 0:
            exp["winner"] = {"kind": best[0].get("kind"), "score": best[1]["score"], "metrics": best[1]["metrics"], "cleared": best[1]["cleared"]}
            winners[tid] = best
            print(f"    winner: {best[0].get('kind')} (score {best[1]['score']})")
        else:
            exp["winner"] = None
            exp["note"] = "no candidate cleared a flag — text-level rewrite needed (hand to the writer, not the TTS)"
            print(f"    no winner for {tid}: text-level rewrite needed")
        report["experiments"].append(exp)

    outdir = Path(args.report); outdir.mkdir(parents=True, exist_ok=True)
    (outdir / f"{args.slug}.json").write_text(json.dumps(report, indent=1), encoding="utf-8")

    if args.apply and winners:
        for tid, (cand, entry) in winners.items():
            src = sb / "audio"
            dst = vdir / "audio"
            for ext in (".wav", ".words.json", ".json"):
                s, d = src / f"{tid}{ext}", dst / f"{tid}{ext}"
                if s.exists():
                    if d.exists():
                        shutil.copy2(d, dst / f"{tid}{ext}.preforge.bak")
                    shutil.copy2(s, d)
            # patch the real script.json
            for bb in script["beats"]:
                if bb.get("id") == tid:
                    if "text" in cand:
                        if "say" in bb:
                            bb["say"] = cand["text"]
                        else:
                            bb["vo"] = cand["text"]
                    if "ex" in cand:
                        bb["ex"] = cand["ex"]
            bak = vdir / "script.json.prosody_forge.bak"
            if not bak.exists():
                shutil.copy2(vdir / "script.json", bak)
            (vdir / "script.json").write_text(json.dumps(script, ensure_ascii=False, indent=1), encoding="utf-8")
            print(f"APPLIED {tid}: take + script edit copied (backups: *.preforge.bak, script.json.prosody_forge.bak)")
        print(f"next: python tools/build.py {args.slug}   # then re-render")
    elif winners:
        print("dry run: re-run with --apply to copy the winning takes into the real topic")

    if args.clean and sb.exists():
        shutil.rmtree(sb, ignore_errors=True)
        print(f"cleaned {sb}")
    print(f"wrote {outdir / (args.slug + '.json')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
