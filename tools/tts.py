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
MODELS = Path(os.environ.get("KOKORO_MODELS", str(Path(__file__).resolve().parents[2] / "voice" / "kokoro-models")))
if "HF_HOME" not in os.environ:
    os.environ["HF_HOME"] = str(Path(__file__).resolve().parents[2] / "voice" / "hf-cache")
if "HF_HUB_OFFLINE" not in os.environ:
    os.environ["HF_HUB_OFFLINE"] = "1"
if "PYTHONIOENCODING" not in os.environ:
    os.environ["PYTHONIOENCODING"] = "utf-8"

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    vids = sorted([p.name for p in (ROOT / "videos").iterdir() if p.is_dir() and not p.name.startswith(("_", "."))])
    print(f"\nAvailable topics:\n  {', '.join(vids)}")
    sys.exit(0)

vid = sys.argv[1]
vdir = ROOT / "videos" / vid
if not vdir.is_dir():
    sys.exit(f"Error: topic '{vid}' not found in videos/. Available: {', '.join(sorted(p.name for p in (ROOT / 'videos').iterdir() if p.is_dir()))}")

# --out <dir>: write somewhere other than videos/<id>/audio (e.g. audio_kokoro for the voice A/B); build.py reads audio/
OUT = sys.argv[sys.argv.index("--out") + 1] if "--out" in sys.argv else "audio"
script = json.loads((vdir / "script.json").read_text(encoding="utf-8"))
voice = script["voice"]["name"]; speed = script["voice"]["speed"]
out = vdir / OUT; out.mkdir(parents=True, exist_ok=True)

SQ = {",": 0.30, ";": 0.30, ":": 0.32, "-": 0.30, ".": 0.50, "?": 0.52, "!": 0.50, "": 0.18}  # max inner silence (s) after a word ending in ...
SQ_V = 2  # v2 (2026-10-11): + per-line level matching
# Owner 2026-10-11: "a human would never say G P T the way it said it". Spaced letters in `say` make Kokoro read each
# letter as its own stressed word. Write names normally; words espeak gets wrong go here as IPA (one word, natural stress).
LEX = {"Blumenthal": "blˈuːmənθˌɔːl", "Kokoro": "kəkˈɔːɹoʊ", "WormGPT": "wˈɜːm ʤˌiːpˌiːtˈiː", "xAI": "ˌɛks ˌeɪˈaɪ", "Ng": "ˈɪŋ"}
LEX_V = 1
SPACED = re.compile(r"\b[A-Z] [A-Z]\b")
TARGET = -20.0  # dBFS RMS of the voiced part of every line (owner: "the voice tone is irregular")
todo = []
for b in script["beats"]:
    if "clip" in b: continue
    text = b.get("say", b["vo"])
    if SPACED.search(text): sys.exit(f"{b['id']}: spaced letters in say ({SPACED.search(text).group()}): write the word, or add it to LEX")
    h = hashlib.sha1(f"{text}|{voice}|{speed}|{LEX_V}".encode()).hexdigest()[:12]
    meta = out / f"{b['id']}.json"
    if meta.exists() and json.loads(meta.read_text())["hash"] == h and (out / f"{b['id']}.words.json").exists():
        if json.loads(meta.read_text()).get("sq") == SQ_V: continue
        todo.append((b, text, h, False)); continue  # cached voice, only squeeze
    todo.append((b, text, h, True))
print(f"{len(todo)} lines to voice")
if not todo: sys.exit(0)

from kokoro_onnx import Kokoro
from faster_whisper import WhisperModel
import ctranslate2
k = Kokoro(str(MODELS / "kokoro-official.onnx"), str(MODELS / "voices-v1.0.bin"))
_dev = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
_comp = "float16" if _dev == "cuda" else "int8"
wm = WhisperModel("small.en", device=_dev, compute_type=_comp)

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

def level(a, sr):
    """Same speech loudness on every line: RMS over the voiced 20 ms frames only (pauses don't count)."""
    n = sr // 50; fr = a[: len(a) // n * n].reshape(-1, n); r = np.sqrt((fr ** 2).mean(1) + 1e-12)
    v = r[r > r.max() * 0.1]
    g = 10 ** ((TARGET - 20 * np.log10(np.sqrt((v ** 2).mean()) + 1e-9)) / 20)
    return np.clip(a * g, -0.99, 0.99)

for b, text, h, voiced in todo:
    wav = out / f"{b['id']}.wav"
    if voiced:
        # Whole beat in one pass for natural prosody; short pause between sentences comes from punctuation.
        if any(w in text for w in LEX):
            parts = re.split("(" + "|".join(map(re.escape, LEX)) + ")", text)
            ph = " ".join(LEX[p] if p in LEX else k.tokenizer.phonemize(p, "en-us") for p in parts if p.strip())
            audio, sr = k.create(ph, voice=voice, speed=speed, is_phonemes=True)
        else:
            audio, sr = k.create(text, voice=voice, speed=speed, lang="en-us")
        audio = trim(np.asarray(audio, dtype=np.float32), sr)
        sf.write(wav, audio, sr)
    audio, sr = sf.read(wav, dtype="float32")
    audio = squeeze(audio, sr, hear(wav))
    audio = level(audio, sr)
    sf.write(wav, audio, sr)
    words = hear(wav)
    (out / f"{b['id']}.words.json").write_text(json.dumps(words))
    (out / f"{b['id']}.json").write_text(json.dumps({"hash": h, "dur": len(audio) / sr, "sr": sr, "sq": SQ_V}))
    heard = " ".join(w["w"] for w in words)
    print(f"{b['id']} {len(audio)/sr:5.2f}s | {heard[:90]}", flush=True)

print("Kokoro TTS complete.", flush=True)
