"""Clip in/out points: python tools/lint_clips.py <video_id>   (runs in build.py; exit 1 on any FAIL)
Owner note 2026-10-08b: "the clip got cut off at the end while it was still talking ... pretty much all of them".
Every clip beat must start and end on a sentence boundary, never inside a word, and end in real silence:
  - no word straddles `from` or `to` (words from engine/public/<topic>/<clip>.words.json, made by tools/clip_words.py)
  - the last word before `to` ends a sentence (. ? !) and finishes >= fadeOut + 0.03 s before `to`
  - the word before `from` (if any) ends a sentence or is followed by >= 0.25 s of silence
  - (WARN) the last 0.1 s before `to` is loud (> -20 dB of the clip's peak): music beds and laughter are fine, speech is not
Whisper stamps a file's first word at 0.0 even when speech starts later, so a 0.0 start never counts as a straddle.
Prints each clip's last heard words so a reviewer can read the ending without playing it."""
import json, sys
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
vid = sys.argv[1]
script = json.loads((ROOT / "videos" / vid / "script.json").read_text(encoding="utf-8"))
pub = ROOT / "engine" / "public"
END = ".?!"
fails, warns = [], []
for b in script["beats"]:
    if "clip" not in b: continue
    c = b["clip"]; base = pub / c["src"].rsplit(".", 1)[0]; a, z = float(c["from"]), float(c["to"]); fo = float(c.get("fadeOut", 0.12))
    wj = base.with_suffix(".words.json")
    if not wj.exists():
        fails.append(f"{b['id']}: no {wj.name} (run tools/clip_words.py)"); continue
    words = json.loads(wj.read_text(encoding="utf-8"))
    inside = [w for w in words if w["s"] >= a - 0.02 and w["e"] <= z + 0.02]
    for w in words:
        if w["s"] < z - 0.02 and w["e"] > z + 0.02: fails.append(f"{b['id']}: out-point {z} cuts the word '{w['w']}' ({w['s']}-{w['e']})")
        if 0.02 < w["s"] < a - 0.02 and w["e"] > a + 0.02: fails.append(f"{b['id']}: in-point {a} cuts the word '{w['w']}' ({w['s']}-{w['e']})")
    after = [w for w in words if w["s"] >= z - 0.02]
    if not inside:
        fails.append(f"{b['id']}: no speech between {a} and {z}"); continue
    last = inside[-1]
    if last["w"][-1:] not in END and after:
        fails.append(f"{b['id']}: ends mid-sentence on '{last['w']}', next heard: '{' '.join(w['w'] for w in after[:6])}'")
    roll = c.get("roll", True)  # 2026-10-11: build.py adds pre/post roll; `to` = the last word's end, the fade is after it
    nxt = [w for w in after if w["s"] > last["e"] + 0.01]
    if roll:
        if last["e"] > z + 0.05: fails.append(f"{b['id']}: last word '{last['w']}' ends at {last['e']}, after the out-point {z}")
        if nxt and nxt[0]["s"] - z < 0.15: warns.append(f"{b['id']}: only {nxt[0]['s'] - z:.2f}s before '{nxt[0]['w']}': the post-roll will be tiny")
    elif last["e"] > z - fo - 0.03:
        fails.append(f"{b['id']}: last word '{last['w']}' ends at {last['e']}, inside the {fo}s fade before {z}")
    before = [w for w in words if w["e"] <= a + 0.02]
    if before and before[-1]["e"] - before[-1]["s"] < 0.01 and before[-1]["s"] >= a - 0.1: before = before[:-1]  # Whisper's zero-length stamp of the first word
    if before and before[-1]["w"][-1:] not in END and inside[0]["s"] - before[-1]["e"] < 0.25:
        fails.append(f"{b['id']}: starts mid-sentence after '{before[-1]['w']}'")
    snd, sr = sf.read(str(base.with_suffix(".wav")), dtype="float32")
    if snd.ndim > 1: snd = snd.mean(1)
    seg = snd[int(a * sr):int(z * sr)]
    speech = np.percentile(np.abs(seg), 99) + 1e-9
    tail = snd[int((z + 0.1) * sr):int((z + 0.2) * sr)] if roll else snd[max(0, int((z - 0.1) * sr)):int(z * sr)]
    db = 20 * np.log10(np.sqrt(np.mean(tail ** 2)) / speech + 1e-9)
    if db > -20: warns.append(f"{b['id']}: loud at the out-point ({db:.0f} dB vs peak): listen to the last second")
    print(f"{b['id']:5} {z - a:5.1f}s  ...{' '.join(w['w'] for w in inside[-7:])}   | tail {db:.0f} dB")
for f in warns: print("WARN", f)
for f in fails: print("FAIL", f)
print(f"lint_clips: {len(fails)} FAIL")
sys.exit(1 if fails else 0)
