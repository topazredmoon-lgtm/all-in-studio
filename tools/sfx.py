"""Procedural, copyright-free sound design (no samples, nothing to license).
Used by build.py: sfx_track(timeline, sr) and ambient_bed(total_sec, clip_spans, acts, sr)."""
import numpy as np

rng = np.random.default_rng(7)

def _env(n, a=0.002, sr=48000):
    k = max(1, int(a * sr)); e = np.ones(n); e[:k] = np.linspace(0, 1, k); return e

def click(sr=48000):
    n = int(0.03 * sr); t = np.arange(n) / sr
    s = rng.standard_normal(n) * np.exp(-t * 400) * 0.6 + np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 900) * 0.5
    s2 = np.zeros(int(0.07 * sr)); s2[: n] += s; s2[int(0.04 * sr): int(0.04 * sr) + n] += s * 0.5  # press + release
    return s2 * 0.5

def tick(sr=48000):
    n = int(0.012 * sr); t = np.arange(n) / sr
    return (rng.standard_normal(n) * np.exp(-t * 700) + np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 600) * 0.4) * 0.18

def pop(sr=48000):
    n = int(0.09 * sr); t = np.arange(n) / sr
    f = 520 + 380 * np.exp(-t * 40)
    return np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-t * 45) * 0.22 * _env(n)

def thud(sr=48000):
    n = int(0.5 * sr); t = np.arange(n) / sr
    f = 48 + 70 * np.exp(-t * 30)
    body = np.sin(2 * np.pi * np.cumsum(f) / sr) * np.exp(-t * 9)
    hit = rng.standard_normal(n) * np.exp(-t * 120) * 0.35
    return (body + hit) * 0.55 * _env(n, 0.001)

def whoosh(dur=0.55, sr=48000):
    n = int(dur * sr); t = np.linspace(0, 1, n)
    w = rng.standard_normal(n)
    # crude band sweep: blend of increasingly smoothed noise
    k1, k2 = 6, 40
    a = np.convolve(w, np.ones(k1) / k1, 'same'); b = np.convolve(w, np.ones(k2) / k2, 'same') * 3
    s = a * t + b * (1 - t)
    env = np.sin(np.pi * t) ** 2
    return s * env * 0.16

def add(track, sig, at_sec, sr=48000, gain=1.0):
    i = int(at_sec * sr)
    if i < 0 or i >= len(track): return
    j = min(len(track), i + len(sig)); track[i:j] += sig[: j - i] * gain

def ambient_bed(total, mutes, acts, sr=48000):
    """Low drone: two detuned sine pads per act + filtered air, slow swells. Muted (faded) during clips."""
    n = int(total * sr) + sr; t = np.arange(n) / sr
    bed = np.zeros(n)
    chords = [(55.0, 82.41, 130.81), (49.0, 73.42, 116.54), (43.65, 65.41, 103.83), (51.91, 77.78, 123.47)]
    bounds = [0] + [a for a in acts if 0 < a < total] + [total]
    for k in range(len(bounds) - 1):
        s0, s1 = int(bounds[k] * sr), int(bounds[k + 1] * sr)
        tt = t[s0:s1]; ch = chords[k % len(chords)]
        seg = sum(np.sin(2 * np.pi * f * tt) * 0.5 + np.sin(2 * np.pi * f * 1.003 * tt + 1.3) * 0.5 for f in ch) / len(ch)
        seg *= 0.75 + 0.25 * np.sin(2 * np.pi * tt / 9.0)
        fade = min(len(seg), int(1.5 * sr)); seg[:fade] *= np.linspace(0, 1, fade); seg[-fade:] *= np.linspace(1, 0, fade)
        bed[s0:s1] += seg
    air = np.convolve(rng.standard_normal(n), np.ones(60) / 60, 'same') * 0.6
    bed += air
    gain = np.ones(n)
    for a, b in mutes:
        ia, ib = int(a * sr), int(b * sr); f = int(0.4 * sr)
        gain[max(0, ia - f):ia] = np.minimum(gain[max(0, ia - f):ia], np.linspace(1, 0, ia - max(0, ia - f)))
        gain[ia:ib] = 0
        gain[ib:ib + f] = np.minimum(gain[ib:ib + f], np.linspace(0, 1, len(gain[ib:ib + f])))
    bed *= gain
    bed /= (np.abs(bed).max() + 1e-9)
    return bed[: int(total * sr)] * 0.05  # ≈ -30 dBFS: felt, not heard
