"""Voice evenness & prosody gate: python tools/voice_check.py <video_id> [--warn-only]
Owner 2026-10-11: "the voice tone is irregular". After every voice pass this prints, per narrated line: median pitch,
pitch spread, loudness of the voiced part, speaking rate, and the pitch move on the last word. It flags (!) a line that
stands out from the others (|z| > 2 on pitch, level or rate) and a statement whose last word rises like a question.
Exits with code 1 if any line is flagged (unless --warn-only is passed) so qa.py enforces prosody quality."""
import json, sys, wave
from pathlib import Path
import numpy as np


def _read_wav(path: str):
    try:
        import soundfile as sf
        return sf.read(path, dtype="float32")
    except ImportError:
        with wave.open(path, "rb") as wf:
            sr = wf.getframerate()
            nch = wf.getnchannels()
            raw = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16).astype(np.float32) / 32768.0
            if nch > 1:
                raw = raw.reshape(-1, nch)
            return raw, sr


ROOT = Path(__file__).resolve().parents[1]

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    vids = sorted([p.name for p in (ROOT / "videos").iterdir() if p.is_dir() and not p.name.startswith(("_", "."))])
    print(f"\nAvailable topics:\n  {', '.join(vids)}")
    sys.exit(0)

vid = sys.argv[1]
warn_only = "--warn-only" in sys.argv
vdir = ROOT / "videos" / vid
if not vdir.is_dir() or not (vdir / "script.json").exists():
    sys.exit(f"Error: script.json not found for topic '{vid}'. Available topics: {', '.join(sorted(p.name for p in (ROOT / 'videos').iterdir() if (p / 'script.json').exists()))}")

adir = vdir / "audio"
script = json.loads((vdir / "script.json").read_text(encoding="utf-8"))


def f0_track(a, sr, hop=0.01, win=0.04, lo=75, hi=380):
    n, h = int(win * sr), int(hop * sr)
    out = []
    for i in range(0, len(a) - n, h):
        x = a[i:i + n] - a[i:i + n].mean()
        e = np.sqrt((x ** 2).mean())
        if e < 0.01:
            out.append(np.nan)
            continue
        c = np.correlate(x, x, "full")[n - 1:]
        l0, l1 = int(sr / hi), int(sr / lo)
        k = l0 + int(np.argmax(c[l0:l1]))
        out.append(sr / k if c[k] > 0.45 * c[0] else np.nan)
    return np.array(out)


rows = []
missing = []
for b in script.get("beats", []):
    if "clip" in b:
        continue
    wav_p = adir / f"{b['id']}.wav"
    words_p = adir / f"{b['id']}.words.json"
    if not wav_p.exists() or not words_p.exists():
        missing.append(b["id"])
        continue
    a, sr = _read_wav(str(wav_p))
    if a.ndim > 1:
        a = a.mean(1)
    words = json.loads(words_p.read_text(encoding="utf-8"))
    f = f0_track(a, sr)
    v = f[~np.isnan(f)]
    n = sr // 50
    fr = a[: len(a) // n * n].reshape(-1, n)
    r = np.sqrt((fr ** 2).mean(1))
    voiced_r = r[r > r.max() * 0.1] if len(r) and r.max() > 0 else r
    lvl = 20 * np.log10(np.sqrt((voiced_r ** 2).mean()) + 1e-9) if len(voiced_r) else -60.0
    talk = sum(w["e"] - w["s"] for w in words) or 1.0
    rise = 0.0
    # Median over the last 12 voiced frames (octave-jump resistant) vs full line median
    if len(v) > 15:
        rise = float(np.median(v[-12:]) / np.median(v) - 1)
    vo_text = (b.get("vo") or b.get("say") or "").rstrip()
    rows.append({
        "id": b["id"],
        "f0": float(np.median(v)) if len(v) else 0.0,
        "spread": float(np.percentile(v, 90) - np.percentile(v, 10)) if len(v) else 0.0,
        "lvl": float(lvl),
        "rate": len(words) / talk,
        "rise": rise,
        "q": vo_text.endswith("?"),
    })

if missing:
    print(f"FAIL [voice_check] Missing voiced audio/words for beat(s): {', '.join(missing)}")
    sys.exit(1)

if not rows:
    print("voice_check: 0 narrated beats to check")
    sys.exit(0)

flags = 0
for key in ("f0", "spread", "lvl", "rate"):
    x = np.array([r[key] for r in rows])
    m, s = x.mean(), x.std() + 1e-9
    for r in rows:
        r["z_" + key] = (r[key] - m) / s

print(f"{'line':6} {'pitch':>6} {'spread':>6} {'level':>6} {'w/s':>5} {'end':>6}")
med = {k: float(np.median([x[k] for x in rows])) + 1e-9 for k in ("f0", "spread", "lvl", "rate")}
for r in rows:
    big = {
        "f0": abs(r["f0"] / med["f0"] - 1) > 0.06,
        "spread": abs(r["spread"] / med["spread"] - 1) > 0.35,
        "lvl": abs(r["lvl"] - med["lvl"]) > 2.0,
        "rate": abs(r["rate"] / med["rate"] - 1) > 0.15,
    }
    bad = [k for k in ("f0", "spread", "lvl", "rate") if abs(r["z_" + k]) > 2 and big[k]]
    if r["rise"] > 0.10 and not r["q"]:
        bad.append("rising end")
    flags += bool(bad)
    print(f"{r['id']:6} {r['f0']:6.0f} {r['spread']:6.0f} {r['lvl']:6.1f} {r['rate']:5.2f} {r['rise']:+6.0%}" + (f"  ! {', '.join(bad)}" if bad else ""))

print(f"{flags} line(s) flagged")
sys.exit(0 if (flags == 0 or warn_only) else 1)
