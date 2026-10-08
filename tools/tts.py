"""Narration: python tools/tts.py <video_id>
Kokoro (local, Apache-2.0, monetization-safe) -> videos/<id>/audio/<beat>.wav (24 kHz) + <beat>.words.json.
Cached by text+voice+speed hash, so editing one line only re-voices that line.
Pauses are squeezed (owner note 2026-10-08b, "the most unnatural pause I've ever heard"): Kokoro leaves 0.6-1.3 s of
silence at some commas and full stops; every inner silence is capped by the punctuation Whisper hears before it
(SQ below). Lines voiced before the squeeze existed are squeezed from their cached wav without re-voicing."""
import hashlib, json, os, sys, re
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
# Cloud: scripts/cloud-setup.sh downloads to models/kokoro and sets KOKORO_MODELS in .cloud-env.sh
MODELS = Path(os.environ.get("KOKORO_MODELS", r"C:\Users\pc\Documents\antigravity\jolly-bell\models"))
vid = sys.argv[1]
# --out <dir>: write somewhere other than videos/<id>/audio (e.g. audio_kokoro for the voice A/B); build.py reads audio/
OUT = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else "audio"
script = json.loads((ROOT / "videos" / vid / "script.json").read_text(encoding="utf-8"))
voice = script["voice"]["name"]; speed = script["voice"]["speed"]
out = ROOT / "videos" / vid / OUT; out.mkdir(parents=True, exist_ok=True)

SQ = {",": 0.30, ";": 0.30, ":": 0.32, "-": 0.30, ".": 0.50, "?": 0.52, "!": 0.50, "": 0.18}  # max inner silence (s) after a word ending in ...
SQ_V = 1
todo = []
for b in script["beats"]:
    if "clip" in b: continue
    text = b.get("say", b["vo"])
    h = hashlib.sha1(f"{text}|{voice}|{speed}".encode()).hexdigest()[:12]
    meta = out / f"{b['id']}.json"
    if meta.exists() and json.loads(meta.read_text())["hash"] == h and (out / f"{b['id']}.words.json").exists():
        if json.loads(meta.read_text()).get("sq") == SQ_V: continue
        todo.append((b, text, h, False)); continue  # cached voice, only squeeze
    todo.append((b, text, h, True))
print(f"{len(todo)} lines to voice")
if not todo: sys.exit(0)

from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel
k = Kokoro(str(MODELS / "kokoro-official.onnx"), str(MODELS / "voices-v1.0.bin"))
wm = WhisperModel("small.en", device="cpu", compute_type="int8")  # base.en dropped line-final words (u00 "Humans.", k02) after the squeeze

def trim(a, sr, thr=0.008):
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0: return a
    s = max(0, idx[0] - int(0.03 * sr)); e = min(len(a), idx[-1] + int(0.08 * sr))
    return a[s:e]

def hear(wav):
    segs, _ = wm.transcribe(str(wav), word_timestamps=True, language="en")
    return [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]

def squeeze(a, sr, words, thr=0.006, hop=0.01):
    """Cap each silence between words to SQ[punctuation of the word before it]; cut from the middle of the gap."""
    n = int(hop * sr); rms = np.sqrt(np.convolve(a ** 2, np.ones(n) / n, mode="same"))
    quiet = rms < thr; keep = np.ones(len(a), bool)
    i = 0
    while i < len(a):
        if not quiet[i]: i += 1; continue
        j = i
        while j < len(a) and quiet[j]: j += 1
        if i > 0 and j < len(a):  # inner silence only
            t = i / sr; prev = [w for w in words if w["e"] <= t + 0.15]
            p = prev[-1]["w"][-1:] if prev else ""
            cap = SQ.get(p, SQ[""]) if not p.isalnum() else SQ[""]
            extra = (j - i) - int(cap * sr)
            if extra > 0:
                m = i + (j - i) // 2 - extra // 2; keep[m:m + extra] = False
        i = j
    return a[keep]

for b, text, h, voiced in todo:
    wav = out / f"{b['id']}.wav"
    if voiced:
        # Whole beat in one pass for natural prosody; short pause between sentences comes from punctuation.
        audio, sr = k.create(text, voice=voice, speed=speed, lang="en-us")
        audio = trim(np.asarray(audio, dtype=np.float32), sr)
        sf.write(wav, audio, sr)
    audio, sr = sf.read(wav, dtype="float32")
    audio = squeeze(audio, sr, hear(wav))
    sf.write(wav, audio, sr)
    words = hear(wav)
    (out / f"{b['id']}.words.json").write_text(json.dumps(words))
    (out / f"{b['id']}.json").write_text(json.dumps({"hash": h, "dur": len(audio) / sr, "sr": sr, "sq": SQ_V}))
    heard = " ".join(w["w"] for w in words)
    print(f"{b['id']} {len(audio)/sr:5.2f}s | {heard[:90]}")
