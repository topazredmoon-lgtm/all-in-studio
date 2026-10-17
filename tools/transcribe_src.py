"""Transcribe long source recordings (talks) to find clip candidates.
python tools/transcribe_src.py <file> [<file> ...]  -> <file>.segments.txt ("[start-end] text" per Whisper segment)
Word timing for the final cut comes later from tools/clip_words.py on the cut clip."""
import os, sys
from pathlib import Path

if "HF_HOME" not in os.environ:
    os.environ["HF_HOME"] = str(Path(__file__).resolve().parents[2] / "voice" / "hf-cache")
if "HF_HUB_OFFLINE" not in os.environ:
    os.environ["HF_HUB_OFFLINE"] = "1"

from faster_whisper import WhisperModel

try:
    wm = WhisperModel("large-v3-turbo", device="cuda", compute_type="float16")
except Exception:
    wm = WhisperModel("small.en", device="cpu", compute_type="int8")
for f in map(Path, sys.argv[1:]):
    out = f.with_suffix(f.suffix + ".segments.txt")
    if out.exists(): print("skip", f.name); continue
    segs, _ = wm.transcribe(str(f), language="en", vad_filter=True)
    lines = [f"[{s.start:7.1f}-{s.end:7.1f}] {s.text.strip()}" for s in segs]
    out.write_text("\n".join(lines), encoding="utf-8")
    print(f.name, len(lines), "segments")
