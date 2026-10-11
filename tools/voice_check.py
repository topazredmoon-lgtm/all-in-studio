"""Voice evenness check: python tools/voice_check.py <video_id>
Owner 2026-10-11: "the voice tone is irregular". After every voice pass this prints, per narrated line: median pitch,
pitch spread, loudness of the voiced part, speaking rate, and the pitch move on the last word. It flags (!) a line that
stands out from the others (|z| > 2 on pitch, level or rate) and a statement whose last word rises like a question.
Fix a flagged line by rewording it (whole flowing sentence, no fragment) and re-voicing; never ship one blind."""
import json, sys
from pathlib import Path
import numpy as np, soundfile as sf

ROOT = Path(__file__).resolve().parents[1]
vid = sys.argv[1]
adir = ROOT / "videos" / vid / "audio"
script = json.loads((ROOT / "videos" / vid / "script.json").read_text(encoding="utf-8"))


def f0_track(a, sr, hop=0.01, win=0.04, lo=110, hi=380):
    n, h = int(win * sr), int(hop * sr)
    out = []
    for i in range(0, len(a) - n, h):
        x = a[i:i + n] - a[i:i + n].mean()
        e = np.sqrt((x ** 2).mean())
        if e < 0.01: out.append(np.nan); continue
        c = np.correlate(x, x, "full")[n - 1:]
        l0, l1 = int(sr / hi), int(sr / lo)
        k = l0 + int(np.argmax(c[l0:l1]))
        out.append(sr / k if c[k] > 0.45 * c[0] else np.nan)
    return np.array(out)


rows = []
for b in script["beats"]:
    if "clip" in b: continue
    a, sr = sf.read(adir / f"{b['id']}.wav", dtype="float32")
    words = json.loads((adir / f"{b['id']}.words.json").read_text())
    f = f0_track(a, sr)
    v = f[~np.isnan(f)]
    n = sr // 50; fr = a[: len(a) // n * n].reshape(-1, n); r = np.sqrt((fr ** 2).mean(1))
    lvl = 20 * np.log10(np.sqrt((r[r > r.max() * 0.1] ** 2).mean()) + 1e-9)
    talk = sum(w["e"] - w["s"] for w in words) or 1
    last = words[-1] if words else None
    rise = 0.0  # end of the line vs the line's own median: a statement ends at or below it, a question ends above it
    if len(v) > 10: rise = float(np.median(v[-5:]) / np.median(v) - 1)
    rows.append({"id": b["id"], "f0": float(np.median(v)) if len(v) else 0, "spread": float(np.percentile(v, 90) - np.percentile(v, 10)) if len(v) else 0,
                 "lvl": float(lvl), "rate": len(words) / talk, "rise": rise, "q": b.get("vo", "").rstrip().endswith("?")})

flags = 0
for key in ("f0", "spread", "lvl", "rate"):
    x = np.array([r[key] for r in rows]); m, s = x.mean(), x.std() + 1e-9
    for r in rows: r["z_" + key] = (r[key] - m) / s
print(f"{'line':6} {'pitch':>6} {'spread':>6} {'level':>6} {'w/s':>5} {'end':>6}")
for r in rows:
    med = {k: np.median([x[k] for x in rows]) for k in ("f0", "spread", "lvl", "rate")}
    big = {"f0": abs(r["f0"] / med["f0"] - 1) > 0.06, "spread": abs(r["spread"] / med["spread"] - 1) > 0.35,
           "lvl": abs(r["lvl"] - med["lvl"]) > 2, "rate": abs(r["rate"] / med["rate"] - 1) > 0.15}  # z alone over-flags a tight set
    bad = [k for k in ("f0", "spread", "lvl", "rate") if abs(r["z_" + k]) > 2 and big[k]]
    if r["rise"] > 0.10 and not r["q"]: bad.append("rising end")
    flags += bool(bad)
    print(f"{r['id']:6} {r['f0']:6.0f} {r['spread']:6.0f} {r['lvl']:6.1f} {r['rate']:5.2f} {r['rise']:+6.0%}" + (f"  ! {', '.join(bad)}" if bad else ""))
print(f"{flags} line(s) flagged")
