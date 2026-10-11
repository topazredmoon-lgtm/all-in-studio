"""Timeline + master audio: python tools/build.py <video_id>
-> engine/src/videos/<id>/timeline.json  (beats with frame starts, durations, shot spec, word cues in frames)
-> videos/<id>/master.wav                 (48 kHz stereo: mastered narration + clips + one-shot SFX + optional ducked music bed)
Adapted from not-so-dark-times tools/build.py (same pacing model, same narration mastering)."""
import json, re, subprocess, sys
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
import sfx

vid = sys.argv[1]
# owner rule: no text-led shot ever reaches a render (tools/lint_text.py)
if subprocess.run([sys.executable, str(ROOT / "tools" / "lint_text.py"), vid]).returncode: sys.exit("lint_text failed: fix the shots above")
# word sync: every cue word must be spoken in its beat (tools/lint_cues.py)
if subprocess.run([sys.executable, str(ROOT / "tools" / "lint_cues.py"), vid]).returncode: sys.exit("lint_cues failed: fix the cue words above")
# clips start and end on sentence boundaries, never mid-word (owner note 2026-10-08b; tools/lint_clips.py)
if subprocess.run([sys.executable, str(ROOT / "tools" / "lint_clips.py"), vid]).returncode: sys.exit("lint_clips failed: move the clip in/out points above")
FPS, SR = 30, 48000
script = json.loads((ROOT / "videos" / vid / "script.json").read_text(encoding="utf-8"))
P = {"lead": 0.5, "gap": 1.1, "min_beat": 3.6, "to_clip": 0.3, "after_clip": 0.9, "end_pad": 2.5, **script.get("pace", {})}
adir = ROOT / "videos" / vid / "audio"
pub = ROOT / "engine" / "public"
tmp = ROOT / "videos" / vid / "tmp"; tmp.mkdir(exist_ok=True)

def ff(*args):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *args], check=True)

beats, placements = [], []
t = 0.0
for i, b in enumerate(script["beats"]):
    nxt = script["beats"][i + 1] if i + 1 < len(script["beats"]) else None
    if "clip" in b:
        c = b["clip"]
        seg = tmp / f"{b['id']}.wav"
        stem = pub / c["src"].rsplit(".", 1)[0]
        if c.get("roll", True) and stem.with_suffix(".words.json").exists():
            # Owner 2026-10-11: word-tight chops + a frozen last frame looked "amateurish". Let the speaker breathe:
            # picture and room sound start up to 0.45 s before the first word and run up to 0.7 s after the last one,
            # never into a neighbouring word; sound fades in/out over those rolls; the next line starts in the fade-out.
            ws = json.loads(stem.with_suffix(".words.json").read_text(encoding="utf-8"))
            fdur = sf.info(str(stem.with_suffix(".wav"))).duration
            ws = [w for w in ws if w["e"] - w["s"] >= 0.01]  # drop Whisper's zero-length stamps
            prev_e = max([w["e"] for w in ws if w["e"] <= c["from"] + 0.02], default=0.0)
            next_s = min([w["s"] for w in ws if w["s"] >= c["to"] - 0.02], default=fdur)
            pre = max(0.0, min(0.45, c["from"] - prev_e - 0.12))
            post = max(0.06, min(0.7, next_s - c["to"] - 0.12, fdur - c["to"] - 0.05))
        else:
            pre, post = 0.0, float(c.get("fadeOut", 0.12))
        a0, a1 = c["from"] - pre, c["to"] + post
        d = a1 - a0
        ff("-ss", f"{a0:.3f}", "-to", f"{a1:.3f}", "-i", str(stem.with_suffix(".wav")), "-af",
           f"loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000,afade=t=in:curve=qsin:d={max(0.03, pre):.3f},"
           f"afade=t=out:curve=qsin:st={d - post:.3f}:d={post:.3f}", "-ac", "2", str(seg))
        overlap = min(0.25, post * 0.5) if nxt else 0.0  # L-cut: the board (and the next line) comes in as the room sound fades
        dur = d - overlap + (0.0 if nxt else 0.3)
        placements.append(("clip", seg, t))
        beats.append({"id": b["id"], "start": round(t * FPS), "dur": round(dur * FPS), "clip": {**c, "from": round(a0, 3), "to": round(a1, 3), "speechAt": round(pre, 3)}})
        print(f"{b['id']}: pre-roll {pre:.2f}s, post-roll {post:.2f}s, {d:.1f}s on screen")
    else:
        meta = json.loads((adir / f"{b['id']}.json").read_text())
        words = json.loads((adir / f"{b['id']}.words.json").read_text())
        gap = P["to_clip"] if (nxt and "clip" in nxt) else (P["gap"] if nxt else P["end_pad"])
        if nxt and "gap" in b: gap = float(b["gap"])
        dur = max(float(b.get("min", P["min_beat"])), P["lead"] + meta["dur"] + gap)
        placements.append(("vo", adir / f"{b['id']}.wav", t + P["lead"]))
        beats.append({"id": b["id"], "start": round(t * FPS), "dur": round(dur * FPS), "shot": b["shot"],
                      "words": [{"w": w["w"], "f": round((P["lead"] + w["s"]) * FPS)} for w in words]})
    t += dur

total = round(t * FPS)
for a, b in zip(beats, beats[1:]):
    a["dur"] = b["start"] - a["start"]
beats[-1]["dur"] = total - beats[-1]["start"]

# --- narration (24k mono) -> mastered 48k stereo (v23 / nsdt chain)
n24 = np.zeros(int(t * 24000) + 24000, dtype=np.float32)
for kind, path, start in placements:
    if kind != "vo": continue
    a, sr = sf.read(path, dtype="float32"); s = int(start * sr); n24[s:s + len(a)] += a
sf.write(tmp / "narr_raw.wav", n24, 24000)
ff("-i", str(tmp / "narr_raw.wav"), "-af",
   "highpass=f=75,equalizer=f=220:t=q:w=1.0:g=1.6,equalizer=f=3800:t=q:w=0.9:g=1.2,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000",
   "-ac", "2", str(tmp / "narr.wav"))
mix, _ = sf.read(tmp / "narr.wav", dtype="float32")
need = int(t * SR) + SR
if len(mix) < need: mix = np.vstack([mix, np.zeros((need - len(mix), 2), dtype=np.float32)])
narr_env = np.abs(mix[:, 0]).copy()
for kind, path, start in placements:
    if kind != "clip": continue
    a, _ = sf.read(path, dtype="float32")
    if a.ndim == 1: a = np.stack([a, a], 1)
    s = int(start * SR); mix[s:s + len(a)] += a[: len(mix) - s]
mix = mix[: int(t * SR)]; narr_env = narr_env[: len(mix)]

# --- one-shot SFX, only on a visible physical action (owner: no whooshes, no drones). shot.sfx = [{"k": "thud|click|tick", "at": "word"}]
def cue(b, key, fb):
    if isinstance(key, (int, float)): return key
    if not key: return fb
    k, _, nth = str(key).partition("#"); k = re.sub(r"[^a-z0-9$%]", "", k.lower()); seen = 0
    for w in b.get("words", []):
        if re.sub(r"[^a-z0-9$%]", "", w["w"].lower()).startswith(k):
            seen += 1
            if seen >= int(nth or 1): return max(0, w["f"] - 4)
    return fb

fx = np.zeros(len(mix)); mutes = []
GAIN = {"thud": 0.14, "click": 0.10, "tick": 0.35}
for b in beats:
    t0 = b["start"] / FPS
    if "clip" in b: mutes.append((t0, t0 + b["dur"] / FPS)); continue
    for s in b["shot"].get("sfx", []):
        f = cue(b, s.get("at"), 20) + s.get("plus", 0)
        sfx.add(fx, getattr(sfx, s["k"])(), t0 + f / FPS, gain=GAIN.get(s["k"], 0.1))
sf.write(tmp / "fx_stem.wav", fx.astype(np.float32), SR)
mix[:, 0] += fx; mix[:, 1] += fx

# --- music bed (HOLLYSCRATCH practice: generated, licence-free, ducked under the voice, silent during clips)
music = script.get("music")
if music:
    src = ROOT / music["file"]
    ff("-i", str(src), "-ar", str(SR), "-ac", "2", str(tmp / "music48.wav"))
    m, _ = sf.read(tmp / "music48.wav", dtype="float32")
    n = len(mix); xf = int(2.0 * SR); ramp = np.linspace(0, 1, xf)[:, None]; bed = m.copy()
    while len(bed) < n:  # loop with a 2 s crossfade at every seam (a hard repeat clicks)
        bed = np.vstack([bed[:-xf], bed[-xf:] * (1 - ramp) + m[:xf] * ramp, m[xf:]])
    bed = bed[:n]
    k = int(0.3 * SR); cs = np.concatenate([[0.0], np.cumsum(narr_env, dtype=np.float64)])  # moving average via cumsum (np.convolve here took minutes)
    idx = np.arange(len(narr_env)); lo = np.clip(idx - k // 2, 0, len(narr_env)); hi = np.clip(idx + k // 2, 0, len(narr_env))
    env = (cs[hi] - cs[lo]) / k; env = np.clip(env / (np.percentile(env, 95) + 1e-9), 0, 1)
    duck = 10 ** (-music.get("duck", 8) / 20)
    g = 10 ** (music.get("db", -24) / 20) * (1 - env * (1 - duck))
    for a, b2 in mutes:
        ia, ib, fl = int(a * SR), int(b2 * SR), int(0.5 * SR)
        g[max(0, ia - fl):ia] *= np.linspace(1, 0, ia - max(0, ia - fl)); g[ia:ib] = 0
        g[ib:ib + fl] *= np.linspace(0, 1, len(g[ib:ib + fl]))
    fl = int(1.5 * SR); g[:fl] *= np.linspace(0, 1, fl); tail = int(2.5 * SR); g[-tail:] *= np.linspace(1, 0, tail)
    rms = np.sqrt(np.mean(bed ** 2)) + 1e-9; bed = bed / rms * 0.1  # bed normalised to -20 dBFS RMS, then music.db
    mix += (bed * g[:, None]).astype(np.float32)
mix = np.clip(mix, -0.98, 0.98)
sf.write(ROOT / "videos" / vid / "master.wav", mix, SR)

out = ROOT / "engine" / "src" / "videos" / vid / "timeline.json"; out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps({"fps": FPS, "total": total, "beats": beats}, ensure_ascii=False), encoding="utf-8")
print(f"total {t:.1f}s ({int(t//60)}:{int(t%60):02d}) · {len(beats)} beats · {sum('clip' in b for b in beats)} clips")
