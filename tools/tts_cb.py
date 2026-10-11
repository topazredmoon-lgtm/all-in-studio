"""Narration v2 (Chatterbox): .venv-tts/bin/python tools/tts_cb.py <video_id>
Owner, 2026-10-11 on the Kokoro af_heart sample: "the voice is horrible this way ... robot blabla annoying".
Chatterbox (Resemble AI, MIT licence, local, monetization-safe) speaks with real emphasis; `ex` (exaggeration 0-1) sets
how dramatic a line is. The timbre comes from a short reference wav: assets/voice/narrator_ref.wav is itself a Kokoro
am_fenrir line (Apache-2.0, synthetic), so no real person's voice is cloned.
Writes the same files as tools/tts.py (videos/<id>/audio/<beat>.wav 24 kHz + .words.json + .json), so build.py is unchanged.

A beat's `say` may hold dramatic breaks: " | " = 0.45 s pause, " || " = 0.85 s. Each part is voiced on its own (a short
"Gone." gets its own weight) and joined with that silence. Every part is checked by Whisper against its text and
re-voiced (new seed, up to 4 tries) when words are dropped or invented; the best take is kept.
Setup (cloud): uv venv -p 3.11 .venv-tts; uv pip install torch==2.6.0+cpu torchaudio==2.6.0+cpu chatterbox-tts
"setuptools<81" faster-whisper (--extra-index-url https://download.pytorch.org/whl/cpu). ~7 s of CPU per 1 s of voice."""
import difflib, hashlib, json, os, re, sys
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
vid = sys.argv[1]
script = json.loads((ROOT / "videos" / vid / "script.json").read_text(encoding="utf-8"))
V = {"ref": "assets/voice/narrator_ref.wav", "ex": 0.65, "cfg": 0.35, "temp": 0.8, **script["voice"]}
out = ROOT / "videos" / vid / "audio"; out.mkdir(parents=True, exist_ok=True)
PAUSE = {"|": 0.45, "||": 0.85}
CB_V = 2  # bump to re-voice everything after a change in this file


def parts_of(text):
    toks = re.split(r"\s+(\|\|?)\s+", text.strip())
    parts, pauses = [toks[0]], []
    for i in range(1, len(toks), 2):
        pauses.append(PAUSE[toks[i]]); parts.append(toks[i + 1])
    return parts, pauses


def norm(s):
    s = s.lower().replace("a.i.", "ai").replace("a i ", "ai ")
    return re.sub(r"[^a-z0-9 ]", " ", s).split()


todo = []
for b in script["beats"]:
    if "clip" in b: continue
    text = b.get("say", b["vo"])
    ex = b.get("ex", V["ex"])
    h = hashlib.sha1(f"{text}|{V['ref']}|{ex}|{V['cfg']}|{V['temp']}|cb{CB_V}".encode()).hexdigest()[:12]
    meta = out / f"{b['id']}.json"
    if meta.exists() and json.loads(meta.read_text()).get("hash") == h and (out / f"{b['id']}.words.json").exists(): continue
    todo.append((b, text, ex, h))
print(f"{len(todo)} lines to voice")
if not todo: sys.exit(0)

import torch
from chatterbox.tts import ChatterboxTTS
from faster_whisper import WhisperModel
torch.set_num_threads(os.cpu_count() or 4)
m = ChatterboxTTS.from_pretrained(device="cuda" if torch.cuda.is_available() else "cpu")
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
    a = a[s:e].copy(); f = int(0.04 * SR); a[-f:] *= np.linspace(1, 0, f)
    return a


for b, text, ex, h in todo:
    parts, pauses = parts_of(text)
    pieces = []
    for pi, p in enumerate(parts):
        best = None
        for t in range(6):
            a = take(p, ex, 1000 * pi + 17 * t + 3)
            ws = hear(a)
            score = difflib.SequenceMatcher(None, norm(p), norm(" ".join(w["w"] for w in ws))).ratio()
            if best is None or score > best[0]: best = (score, clean(a, ws))
            if score >= 0.97: break
        if best[0] < 0.97: print(f"  WARN {b['id']} part {pi}: best match {best[0]:.2f} for '{p}'")
        pieces.append(best[1])
    gap = [np.zeros(int(s * SR), np.float32) for s in pauses]
    audio = pieces[0]
    for g, pc in zip(gap, pieces[1:]): audio = np.concatenate([audio, g, pc])
    wav = out / f"{b['id']}.wav"; sf.write(wav, audio, SR)
    words = hear(audio)
    (out / f"{b['id']}.words.json").write_text(json.dumps(words))
    (out / f"{b['id']}.json").write_text(json.dumps({"hash": h, "dur": len(audio) / SR, "sr": SR, "engine": "chatterbox"}))
    print(f"{b['id']} {len(audio)/SR:5.2f}s | {' '.join(w['w'] for w in words)[:90]}", flush=True)
(out / "_hear.wav").unlink(missing_ok=True)
