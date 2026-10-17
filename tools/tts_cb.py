"""Narration v2 (Chatterbox): .venv-tts/bin/python tools/tts_cb.py <video_id> [--voice kore|captchas|fenrir]
Owner, 2026-10-11 on the Kokoro af_heart sample: "the voice is horrible this way ... robot blabla annoying".
Chatterbox (Resemble AI, MIT licence, local, monetization-safe) speaks with real emphasis; `ex` (exaggeration 0-1) sets
how dramatic a line is.
Writes the same files as tools/tts.py (videos/<id>/audio/<beat>.wav 24 kHz + .words.json + .json), so build.py is unchanged.

Upgrades (2026-10-14):
- Whisper runs on CUDA float16 when available (3-4x faster take verification).
- Every beat is RMS-normalized over voiced 20 ms frames to -20.0 dBFS (`level()`), matching tts.py so voice_check never flags level drift.
- In-loop prosody check (`f0_rise`): candidate takes for declarative sentence endings are scored on both Whisper word accuracy AND falling pitch contour (`rise <= 0.085`), eliminating most rising-end re-voicing loops.
"""
import difflib, hashlib, json, os, re, sys
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
hf_cache = Path(__file__).resolve().parents[2] / "voice" / "hf-cache"

if "HF_HOME" not in os.environ:
    os.environ["HF_HOME"] = str(hf_cache)
if "HF_HUB_OFFLINE" not in os.environ:
    os.environ["HF_HUB_OFFLINE"] = "1"
if "PYTHONIOENCODING" not in os.environ:
    os.environ["PYTHONIOENCODING"] = "utf-8"

# 1. Immediate Help check (fast, no heavy imports)
if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    vids = sorted([p.name for p in (ROOT / "videos").iterdir() if p.is_dir() and not p.name.startswith(("_", "."))])
    print(f"\nAvailable topics:\n  {', '.join(vids)}")
    sys.exit(0)

# 2. Self-dispatch to voice venv Python (Python 3.11 with torch CUDA)
voice_py = Path(__file__).resolve().parents[2] / "voice" / ".venv-tts" / "Scripts" / "python.exe"
if voice_py.exists() and Path(sys.executable).resolve() != voice_py.resolve():
    import subprocess
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    env["HF_HUB_OFFLINE"] = "1"
    env["HF_HOME"] = str(hf_cache)
    ret = subprocess.run([str(voice_py), str(Path(__file__).resolve()), *sys.argv[1:]], env=env)
    sys.exit(ret.returncode)

vid = sys.argv[1]
vdir = ROOT / "videos" / vid
if not vdir.is_dir():
    sys.exit(f"Error: topic '{vid}' not found in videos/. Available: {', '.join(sorted(p.name for p in (ROOT / 'videos').iterdir() if p.is_dir()))}")

script = json.loads((vdir / "script.json").read_text(encoding="utf-8"))

VOICE_PRESETS = {
    "kore": "assets/voice/ref_female_kore.wav",
    "deepmind": "assets/voice/ref_female_kore.wav",
    "deepmind-female": "assets/voice/ref_female_kore.wav",
    "captchas": "assets/voice/ref_female_captchas.wav",
    "captchas-female": "assets/voice/ref_female_captchas.wav",
    "af_heart": "assets/voice/ref_female_captchas.wav",
    "female": "assets/voice/ref_female_kore.wav",
    "fenrir": "assets/voice/narrator_ref.wav",
    "male": "assets/voice/narrator_ref.wav",
}

script_voice = script.get("voice", {})
voice_arg = sys.argv[sys.argv.index("--voice") + 1] if "--voice" in sys.argv else None

if voice_arg:
    chosen_ref = VOICE_PRESETS.get(voice_arg.lower(), voice_arg)
elif script_voice.get("ref"):
    chosen_ref = script_voice["ref"]
elif script_voice.get("name") in VOICE_PRESETS:
    chosen_ref = VOICE_PRESETS[script_voice["name"]]
elif "kore" in script_voice.get("name", "").lower():
    chosen_ref = "assets/voice/ref_female_kore.wav"
elif "captchas" in script_voice.get("name", "").lower() or "heart" in script_voice.get("name", "").lower():
    chosen_ref = "assets/voice/ref_female_captchas.wav"
else:
    # Default to DeepMind Kore if present, otherwise Captchas female reference
    kore_path = ROOT / "assets/voice/ref_female_kore.wav"
    chosen_ref = "assets/voice/ref_female_kore.wav" if kore_path.exists() else "assets/voice/ref_female_captchas.wav"

V = {"ref": chosen_ref, "ex": 0.65, "cfg": 0.35, "temp": 0.8, **script_voice}
V["ref"] = chosen_ref
voice_label = "DeepMind Kore Female" if "kore" in V["ref"] else ("Captchas v2 Female" if "captchas" in V["ref"] else "Fenrir Male")
print(f"Narrator reference: {V['ref']} ({voice_label})")
out = vdir / "audio"; out.mkdir(parents=True, exist_ok=True)
PAUSE = {"|": 0.45, "||": 0.85}
TARGET = -20.0  # dBFS RMS of voiced frames (matches tts.py)
CB_V = 3  # v3: + per-beat RMS level normalization & in-loop f0 rising-end rejection


def parts_of(text):
    toks = re.split(r"\s+(\|\|?)\s+", text.strip())
    parts, pauses = [toks[0]], []
    for i in range(1, len(toks), 2):
        pauses.append(PAUSE[toks[i]]); parts.append(toks[i + 1])
    return parts, pauses


def norm(s):
    s = s.lower().replace("a.i.", "ai").replace("a i ", "ai ")
    return re.sub(r"[^a-z0-9 ]", " ", s).split()


def level(a, sr):
    """Same speech loudness on every line: RMS over the voiced 20 ms frames only (pauses don't count)."""
    n = sr // 50
    if len(a) < n:
        return a
    fr = a[: len(a) // n * n].reshape(-1, n)
    r = np.sqrt((fr ** 2).mean(1) + 1e-12)
    v = r[r > r.max() * 0.1]
    if len(v) == 0:
        return a
    g = 10 ** ((TARGET - 20 * np.log10(np.sqrt((v ** 2).mean()) + 1e-9)) / 20)
    return np.clip(a * g, -0.99, 0.99).astype(np.float32)


def f0_rise(a, sr, hop=0.01, win=0.04, lo=110, hi=380):
    """Measure end-of-line pitch movement relative to line median (octave-jump resistant over last 12 voiced frames)."""
    n, h = int(win * sr), int(hop * sr)
    if len(a) < n * 2:
        return 0.0
    out_f0 = []
    for i in range(0, len(a) - n, h):
        x = a[i:i + n] - a[i:i + n].mean()
        e = np.sqrt((x ** 2).mean())
        if e < 0.01:
            continue
        c = np.correlate(x, x, "full")[n - 1:]
        l0, l1 = int(sr / hi), int(sr / lo)
        k = l0 + int(np.argmax(c[l0:l1]))
        if c[k] > 0.45 * c[0]:
            out_f0.append(sr / k)
    if len(out_f0) <= 15:
        return 0.0
    v = np.array(out_f0)
    return float(np.median(v[-12:]) / np.median(v) - 1)


todo = []
for b in script["beats"]:
    if "clip" in b: continue
    text = b.get("say", b["vo"])
    ex = b.get("ex", V["ex"])
    # Accept both CB_V=2 and CB_V=3 hashes if already voiced and levelled, or voice fresh with CB_V
    h = hashlib.sha1(f"{text}|{V['ref']}|{ex}|{V['cfg']}|{V['temp']}|cb{CB_V}".encode()).hexdigest()[:12]
    h_legacy = hashlib.sha1(f"{text}|{V['ref']}|{ex}|{V['cfg']}|{V['temp']}|cb2".encode()).hexdigest()[:12]
    meta = out / f"{b['id']}.json"
    if meta.exists() and (out / f"{b['id']}.words.json").exists():
        mdata = json.loads(meta.read_text())
        if mdata.get("hash") in (h, h_legacy):
            if mdata.get("lvl") == 1:
                continue
            # Existing take from cb2: apply RMS level normalization in-place without re-synthesizing
            wav_p = out / f"{b['id']}.wav"
            if wav_p.exists():
                a_old, sr_old = sf.read(wav_p, dtype="float32")
                a_lvl = level(a_old, sr_old)
                sf.write(wav_p, a_lvl, sr_old)
                mdata["lvl"] = 1
                meta.write_text(json.dumps(mdata))
                continue
    todo.append((b, text, ex, h))
print(f"{len(todo)} lines to voice")
if not todo: sys.exit(0)

import torch
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
torch.set_num_threads(os.cpu_count() or 4)
use_cuda = torch.cuda.is_available()
m = ChatterboxTTS.from_pretrained(device="cuda" if use_cuda else "cpu")
try:
    wm = WhisperModel("small.en", device="cuda" if use_cuda else "cpu", compute_type="float16" if use_cuda else "int8")
except Exception:
    wm = WhisperModel("small.en", device="cpu", compute_type="int8")
SR = m.sr


def hear(a):
    tmp = out / "_hear.wav"; sf.write(tmp, a, SR)
    segs, _ = wm.transcribe(str(tmp), word_timestamps=True, language="en")
    return [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segs for w in s.words]


def take(text, ex, seed):
    torch.manual_seed(seed)
    w = m.generate(text, audio_prompt_path=str(ROOT / V["ref"]), exaggeration=ex, cfg_weight=V["cfg"], temperature=V["temp"])
    return w.squeeze(0).numpy().astype(np.float32)


def clean(a, words):
    """Cut leading silence and anything after the last heard word (Chatterbox sometimes adds a breath or a mumble)."""
    if not words: return a
    s = max(0, int((words[0]["s"] - 0.06) * SR)); e = min(len(a), int((words[-1]["e"] + 0.22) * SR))
    a = a[s:e].copy(); f = min(len(a), int(0.04 * SR))
    if f > 0:
        a[-f:] *= np.linspace(1, 0, f)
    return a


for b, text, ex, h in todo:
    parts, pauses = parts_of(text)
    is_beat_question = b.get("vo", text).rstrip().endswith("?")
    pieces = []
    for pi, p in enumerate(parts):
        is_last_part = (pi == len(parts) - 1)
        check_decl_rise = is_last_part and not is_beat_question and not p.rstrip().endswith("?")
        best = None
        for t in range(6):
            a = take(p, ex, 1000 * pi + 17 * t + 3)
            ws = hear(a)
            score = difflib.SequenceMatcher(None, norm(p), norm(" ".join(w["w"] for w in ws))).ratio()
            cleaned = clean(a, ws)
            rise = f0_rise(cleaned, SR) if check_decl_rise else 0.0
            # Penalize declarative takes that rise > +8.5% at the end like a question
            rank = score - (0.12 if (check_decl_rise and rise > 0.085) else 0.0)
            if best is None or rank > best[0]:
                best = (rank, score, rise, cleaned)
            if score >= 0.97 and (not check_decl_rise or rise <= 0.085):
                break
        if best[1] < 0.97:
            print(f"  WARN {b['id']} part {pi}: best word match {best[1]:.2f} for '{p}'")
        if check_decl_rise and best[2] > 0.10:
            print(f"  WARN {b['id']} part {pi}: declarative end still rises ({best[2]:+.0%}); consider rewording last clause")
        pieces.append(best[3])
    gap = [np.zeros(int(s * SR), np.float32) for s in pauses]
    audio = pieces[0]
    for g, pc in zip(gap, pieces[1:]): audio = np.concatenate([audio, g, pc])
    audio = level(audio, SR)
    wav = out / f"{b['id']}.wav"; sf.write(wav, audio, SR)
    words = hear(audio)
    (out / f"{b['id']}.words.json").write_text(json.dumps(words))
    (out / f"{b['id']}.json").write_text(json.dumps({"hash": h, "dur": len(audio) / SR, "sr": SR, "engine": "chatterbox", "lvl": 1}))
    print(f"{b['id']} {len(audio)/SR:5.2f}s | {' '.join(w['w'] for w in words)[:90]}", flush=True)
(out / "_hear.wav").unlink(missing_ok=True)
