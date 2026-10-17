"""Word timestamps for every clip audio file, so clip in/out points can be checked against real speech.
python tools/clip_words.py <topic> [--force]   -> engine/public/<topic>/<clip>.words.json  ([{w, s, e}], seconds in the clip file)
Whisper adds sentence punctuation (. ? !), which tools/lint_clips.py uses to require sentence-end out-points."""
import json, os, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

if "HF_HOME" not in os.environ:
    os.environ["HF_HOME"] = str(Path(__file__).resolve().parents[2] / "voice" / "hf-cache")
if "HF_HUB_OFFLINE" not in os.environ:
    os.environ["HF_HUB_OFFLINE"] = "1"

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    sys.exit(0)

topic = sys.argv[1]
force = "--force" in sys.argv
d = ROOT / "engine" / "public" / topic
if not d.exists():
    print(f"No engine/public/{topic} directory found (0 clips).")
    sys.exit(0)

todo = [w for w in sorted(d.glob("*.wav")) if force or not w.with_suffix(".words.json").exists()]
print(f"{len(todo)} clip files to transcribe")
if not todo:
    sys.exit(0)

from faster_whisper import WhisperModel
try:
    wm = WhisperModel("large-v3-turbo", device="cuda", compute_type="float16")
except Exception:
    try:
        wm = WhisperModel("small.en", device="cuda", compute_type="float16")
    except Exception:
        wm = WhisperModel("small.en", device="cpu", compute_type="int8")

for wav in todo:
    segs, _ = wm.transcribe(str(wav), word_timestamps=True, language="en", vad_filter=False)
    words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
    wav.with_suffix(".words.json").write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
    print(f"{wav.stem}: {' '.join(w['w'] for w in words)[:160]}")
