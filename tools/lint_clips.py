"""Clip in/out points & Money Rule licence audit: python tools/lint_clips.py <video_id>
Owner note 2026-10-08b: "the clip got cut off at the end while it was still talking ... pretty much all of them".
Owner TOP RULE 2026-10-08: "No clip may cost revenue: only CC BY / BY-SA / CC0 / PD / government clips."
Every clip beat must start and end on a sentence boundary, never inside a word, end in real silence, and pass licence checks:
  - LICENCES.md must exist in videos/<topic>/ when any clip beat is present
  - no banned commercial/news/TED sources in _clips.json or LICENCES.md (WSJ, Vox, CNN, MSNBC, TED, Big Think, etc.)
  - no word straddles `from` or `to` (words from engine/public/<topic>/<clip>.words.json, made by tools/clip_words.py)
  - the last word before `to` ends a sentence (. ? !) and finishes >= fadeOut + 0.03 s before `to`
  - the word before `from` (if any) ends a sentence or is followed by >= 0.25 s of silence
  - (WARN) the last 0.1 s before `to` is loud (> -20 dB of the clip's peak): music beds and laughter are fine, speech is not
Prints each clip's last heard words so a reviewer can read the ending without playing it."""
import json, re, sys, wave
from pathlib import Path
import numpy as np


def _read_wav(path: str):
    try:
        import soundfile as sf
        return sf.read(path, dtype="float32")
    except ImportError:
        with wave.open(path, "rb") as wf:
            sr = wf.getframerate()
            nch = wf.getnchannels()
            raw = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
            if nch > 1:
                raw = raw.reshape(-1, nch)
            return raw, sr


ROOT = Path(__file__).resolve().parents[1]

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    vids = sorted([p.name for p in (ROOT / "videos").iterdir() if p.is_dir() and not p.name.startswith(("_", "."))])
    print(f"\nAvailable topics:\n  {', '.join(vids)}")
    sys.exit(0)

vid = sys.argv[1]
vdir = ROOT / "videos" / vid
if not vdir.is_dir() or not (vdir / "script.json").exists():
    sys.exit(f"Error: script.json not found for topic '{vid}'. Available topics: {', '.join(sorted(p.name for p in (ROOT / 'videos').iterdir() if (p / 'script.json').exists()))}")

script = json.loads((vdir / "script.json").read_text(encoding="utf-8"))
pub = ROOT / "engine" / "public"
END = ".?!"
BANNED_SOURCES = re.compile(r"\b(wsj|wall street journal|vox|big think|tedx?|cnn|msnbc|cnbc|fox news|bbc news|bloomberg)\b", re.IGNORECASE)
fails, warns = [], []

clip_beats = [b for b in script.get("beats", []) if "clip" in b]
if clip_beats:
    lic_file = vdir / "LICENCES.md"
    if not lic_file.exists():
        fails.append(f"{vid}: {len(clip_beats)} clip(s) used but videos/{vid}/LICENCES.md is missing (Money Rule)")
    clips_meta_path = pub / vid / "_clips.json"
    clips_meta = json.loads(clips_meta_path.read_text(encoding="utf-8")) if clips_meta_path.exists() else {}
    for name, meta in clips_meta.items():
        combined = f"{meta.get('title', '')} {meta.get('author', '')} {meta.get('licence', '')} {meta.get('page', '')}"
        m = BANNED_SOURCES.search(combined)
        if m:
            fails.append(f"clip '{name}' in _clips.json matches banned source '{m.group(0)}' (Money Rule: CC/PD/Gov only)")

for b in clip_beats:
    c = b["clip"]
    base = pub / c["src"].rsplit(".", 1)[0]
    a, z = float(c["from"]), float(c["to"])
    fo = float(c.get("fadeOut", 0.12))
    wj = base.with_suffix(".words.json")
    wav_path = base.with_suffix(".wav")
    if not wj.exists():
        fails.append(f"{b['id']}: no {wj.name} (run: python tools/clip_words.py {vid})")
        continue
    if not wav_path.exists():
        fails.append(f"{b['id']}: clip audio {wav_path.name} missing in engine/public/{vid}/")
        continue
    words = json.loads(wj.read_text(encoding="utf-8"))
    inside = [w for w in words if w["s"] >= a - 0.02 and w["e"] <= z + 0.02]
    for w in words:
        if w["s"] < z - 0.02 and w["e"] > z + 0.02:
            fails.append(f"{b['id']}: out-point {z} cuts the word '{w['w']}' ({w['s']}-{w['e']})")
        if 0.02 < w["s"] < a - 0.02 and w["e"] > a + 0.02:
            fails.append(f"{b['id']}: in-point {a} cuts the word '{w['w']}' ({w['s']}-{w['e']})")
    after = [w for w in words if w["s"] >= z - 0.02]
    if not inside:
        fails.append(f"{b['id']}: no speech between {a} and {z}")
        continue
    last = inside[-1]
    if last["w"][-1:] not in END and after:
        fails.append(f"{b['id']}: ends mid-sentence on '{last['w']}', next heard: '{' '.join(w['w'] for w in after[:6])}'")
    roll = c.get("roll", True)
    nxt = [w for w in after if w["s"] > last["e"] + 0.01]
    if roll:
        if last["e"] > z + 0.05:
            fails.append(f"{b['id']}: last word '{last['w']}' ends at {last['e']}, after the out-point {z}")
        if nxt and nxt[0]["s"] - z < 0.15:
            warns.append(f"{b['id']}: only {nxt[0]['s'] - z:.2f}s before '{nxt[0]['w']}': the post-roll will be tiny")
    elif last["e"] > z - fo - 0.03:
        fails.append(f"{b['id']}: last word '{last['w']}' ends at {last['e']}, inside the {fo}s fade before {z}")
    before = [w for w in words if w["e"] <= a + 0.02]
    if before and before[-1]["e"] - before[-1]["s"] < 0.01 and before[-1]["s"] >= a - 0.1:
        before = before[:-1]
    if before and before[-1]["w"][-1:] not in END and inside[0]["s"] - before[-1]["e"] < 0.25:
        fails.append(f"{b['id']}: starts mid-sentence after '{before[-1]['w']}'")
    snd, sr = _read_wav(str(wav_path))
    if snd.ndim > 1:
        snd = snd.mean(1)
    seg = snd[int(a * sr):int(z * sr)]
    speech = np.percentile(np.abs(seg), 99) + 1e-9 if len(seg) > 0 else 1e-9
    if roll and int((z + 0.05) * sr) < len(snd):
        tail = snd[int((z + 0.05) * sr):min(len(snd), int((z + 0.2) * sr))]
    else:
        tail = snd[max(0, int((z - 0.1) * sr)):int(z * sr)]
    rms = np.sqrt(np.mean(tail ** 2)) if len(tail) > 0 else 1e-9
    db = 20 * np.log10(rms / speech + 1e-9)
    if db > -20:
        warns.append(f"{b['id']}: loud at the out-point ({db:.0f} dB vs peak): listen to the last second")
    print(f"{b['id']:5} {z - a:5.1f}s  ...{' '.join(w['w'] for w in inside[-7:])}   | tail {db:.0f} dB")

for f in warns:
    print("WARN [clips]", f)
for f in fails:
    print("FAIL [clips]", f)
print(f"lint_clips: {len(fails)} FAIL ({len(warns)} WARN)")
sys.exit(1 if fails else 0)
