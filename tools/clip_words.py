"""Word timestamps for every clip audio file, so clip in/out points can be checked against real speech.
python tools/clip_words.py <topic> [--force]   -> engine/public/<topic>/<clip>.words.json  ([{w, s, e}], seconds in the clip file)
Whisper adds sentence punctuation (. ? !), which tools/lint_clips.py uses to require sentence-end out-points."""
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
topic = sys.argv[1]
force = "--force" in sys.argv
d = ROOT / "engine" / "public" / topic
todo = [w for w in sorted(d.glob("*.wav")) if force or not w.with_suffix(".words.json").exists()]
print(f"{len(todo)} clip files to transcribe")
if not todo: sys.exit(0)
from faster_whisper import WhisperModel
try:
    wm = WhisperModel("large-v3-turbo", device="cuda", compute_type="float16")
except Exception:
    wm = WhisperModel("small.en", device="cpu", compute_type="int8")
for wav in todo:
    segs, _ = wm.transcribe(str(wav), word_timestamps=True, language="en", vad_filter=False)
    words = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]
    wav.with_suffix(".words.json").write_text(json.dumps(words, ensure_ascii=False), encoding="utf-8")
    print(f"{wav.stem}: {' '.join(w['w'] for w in words)[:160]}")
