"""Cut clips out of a long source (HLS .ts, mp4) with real breathing room, timed by Whisper on the source itself.
  python tools/win_cut.py <topic> <spec.json> --probe   prints word times (source seconds) around each clip's t0..t1
  python tools/win_cut.py <topic> <spec.json>           cuts engine/public/<topic>/<name>.mp4 + .wav, logs _clips.json
Spec entry: {"src", "t0", "t1", "title", "author", "licence", "page", "words"}; t0/t1 = first word start / last word end
in SOURCE (video) time, read from --probe. Seeking the .ts by timestamp keeps picture and sound in sync (LEARNINGS 56).
The clip file keeps PAD s of real room sound either side, so build.py can let the speaker breathe in and out (LEARNINGS 60)."""
import json, os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

if "HF_HOME" not in os.environ:
    os.environ["HF_HOME"] = str(Path(__file__).resolve().parents[2] / "voice" / "hf-cache")
if "HF_HUB_OFFLINE" not in os.environ:
    os.environ["HF_HUB_OFFLINE"] = "1"

if len(sys.argv) < 3 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    sys.exit(0)

topic, spec = sys.argv[1], json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
OUT = ROOT / "engine" / "public" / topic
OUT.mkdir(parents=True, exist_ok=True)
PAD = 1.5

if "--probe" in sys.argv:
    import tempfile
    from faster_whisper import WhisperModel
    try:
        wm = WhisperModel("large-v3-turbo", device="cuda", compute_type="float16")
    except Exception:
        try:
            wm = WhisperModel("small.en", device="cuda", compute_type="float16")
        except Exception:
            wm = WhisperModel("small.en", device="cpu", compute_type="int8")
    for name, c in spec.items():
        if len(sys.argv) > 4 and name not in sys.argv[4:]:
            continue
        s = max(0.0, c["t0"] - 6)
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
            tmp_wav = Path(f.name)
        try:
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.2f}", "-i", str(ROOT / c["src"]), "-t", f"{c['t1'] - c['t0'] + 12:.2f}",
                            "-vn", "-ac", "1", "-ar", "16000", str(tmp_wav)], check=True)
            segs, _ = wm.transcribe(str(tmp_wav), word_timestamps=True, language="en", vad_filter=False)
            ws = [w for sg in segs for w in sg.words]
        finally:
            tmp_wav.unlink(missing_ok=True)
        print(f"== {name}")
        print(" ".join(f"{w.word.strip()}[{s + w.start:.2f}-{s + w.end:.2f}]" for w in ws))
    sys.exit(0)

log_path = OUT / "_clips.json"
log = json.loads(log_path.read_text(encoding="utf-8")) if log_path.exists() else {}
for name, c in spec.items():
    mp4, wav = OUT / f"{name}.mp4", OUT / f"{name}.wav"
    s, d = max(0.0, c["t0"] - PAD), (c["t1"] - c["t0"]) + 2 * PAD
    if not mp4.exists():
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{s:.2f}", "-i", str(ROOT / c["src"]), "-t", f"{d:.2f}",
                        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30",
                        "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", str(mp4)], check=True)
    if not wav.exists():
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(mp4), "-vn", "-ar", "48000", "-ac", "2", str(wav)], check=True)
    log[name] = {**{k: c[k] for k in ("title", "author", "licence", "page")}, "source_from": round(s, 2), "source_to": round(s + d, 2),
                 "speech_from": round(c["t0"] - s, 2), "speech_to": round(c["t1"] - s, 2), "dur": round(d, 2), "words": c["words"]}
    print("ok", name, f"{d:.1f}s")
log_path.write_text(json.dumps(log, ensure_ascii=False, indent=1), encoding="utf-8")
