"""Cut CC talk excerpts (media.ccc.de) for a topic, with the opus->mp4 offset found automatically.
python tools/cc_cut.py <topic> <clips.json>
clips.json: {"name": {"mp4": url, "audio": local transcript audio, "t0": s, "t1": s (times in the transcript audio),
             "title", "author", "licence", "page", "words"}}
Offset: cross-correlates the loudness envelope of the first 240 s of the mp4 with the transcript audio (the h264 mp4 runs
15-18 s later than the opus on CCC congress talks; other events differ, hence the measurement).
Writes engine/public/<topic>/<name>.mp4 (1080p30 H.264) + .wav (48 kHz) with PAD s either side and logs _clips.json."""
import json, subprocess, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
topic, spec = sys.argv[1], json.loads(Path(sys.argv[2]).read_text(encoding="utf-8"))
OUT = ROOT / "engine" / "public" / topic
OUT.mkdir(parents=True, exist_ok=True)
PAD = 0.6
SR = 8000


def pcm(src, t=None, ss=0.0):
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{ss:.2f}", "-i", src, *(["-t", str(t)] if t else []), "-vn", "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"]
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.int16).astype(np.float32)


def env(x, hop=80):  # 100 Hz loudness envelope
    n = len(x) // hop
    e = np.log1p(np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1)))
    return (e - e.mean()) / (e.std() + 1e-6)


offsets = {}
log_path = OUT / "_clips.json"
log = json.loads(log_path.read_text(encoding="utf-8")) if log_path.exists() else {}
for name, c in spec.items():
    mp4, wav = OUT / f"{name}.mp4", OUT / f"{name}.wav"
    key = c["mp4"]
    if key not in offsets:
        if c.get("offset") is not None:
            offsets[key] = c["offset"]
        else:
            # compare a 60 s window of the transcript audio around t0 with 140 s of the mp4 starting 30 s earlier
            a = env(pcm(c["audio"], 60, max(0, c["t0"] - 30)))
            b = env(pcm(c["mp4"], 140, max(0, c["t0"] - 60)))
            cor = np.correlate(b, a, "valid")
            lag = int(np.argmax(cor)) / 100.0
            offsets[key] = round((max(0, c["t0"] - 60) + lag) - max(0, c["t0"] - 30), 2)
            print(f"{name}: offset {offsets[key]:+.2f} s (peak {cor.max() / len(a):.2f})")
    off = offsets[key]
    s, d = max(0.0, c["t0"] + off - PAD), (c["t1"] - c["t0"]) + 2 * PAD
    if not mp4.exists():
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{s:.2f}", "-i", c["mp4"], "-t", f"{d:.2f}",
                        "-vf", "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30",
                        "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", str(mp4)], check=True)
    if not wav.exists():
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(mp4), "-vn", "-ar", "48000", "-ac", "2", str(wav)], check=True)
    log[name] = {**{k: c[k] for k in ("title", "author", "licence", "page")}, "source_from": round(s, 2), "source_to": round(s + d, 2),
                 "offset": off, "speech_from": PAD, "speech_to": round(PAD + c["t1"] - c["t0"], 2), "words": c["words"]}
    print("ok", name, f"{d:.1f}s")
log_path.write_text(json.dumps(log, ensure_ascii=False, indent=1), encoding="utf-8")
