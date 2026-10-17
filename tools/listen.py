"""Listen to the deliverable like a viewer (owner 2026-10-04: "a full complete visualisation AND HEARING of the video").
  python tools/listen.py <video_id> [mp4] [--fast]   # default: newest videos/<id>/out/<id>_vN.mp4
Checks the mixed audio of the mp4:
  FAIL  clipping (peak > -0.5 dBFS) · dead air > 1.8 s mid-video (with beat ID) · a narrated beat whose words don't match the script (WER > 0.25)
        · a sound effect within 3 dB of the narration around it · any continuous bed/drone under the voice (effects are one-shots)
  INFO  integrated loudness (YouTube normalises to about -14 LUFS; aim for -16 to -13)
Writes videos/<id>/qa/listen.png (spectrogram + waveform) and listen.md. Cleans up temporary _listen.wav. Exit 1 on any FAIL.
"""
import json, os, re, subprocess, sys
from pathlib import Path
import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent

if "HF_HOME" not in os.environ:
    os.environ["HF_HOME"] = str(Path(__file__).resolve().parents[2] / "voice" / "hf-cache")
if "HF_HUB_OFFLINE" not in os.environ:
    os.environ["HF_HUB_OFFLINE"] = "1"

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    vids = sorted([p.name for p in (ROOT / "videos").iterdir() if p.is_dir() and not p.name.startswith(("_", "."))])
    print(f"\nAvailable topics:\n  {', '.join(vids)}")
    sys.exit(0)

vid = sys.argv[1]
fast_mode = "--fast" in sys.argv
vdir = ROOT / "videos" / vid
if not vdir.is_dir():
    sys.exit(f"Error: topic '{vid}' not found in videos/. Available: {', '.join(sorted(p.name for p in (ROOT / 'videos').iterdir() if p.is_dir()))}")

out = vdir / "out"
QA = vdir / "qa"
QA.mkdir(parents=True, exist_ok=True)

pos_args = [x for x in sys.argv[2:] if not x.startswith("--")]
if pos_args:
    mp4 = Path(pos_args[0])
else:
    candidates = [
        (int(m.group(1)), p)
        for p in out.glob(f"{vid}_v*.mp4")
        if (m := re.search(r"_v(\d+)\.mp4$", p.name))
    ]
    if not candidates:
        alt_mp4s = sorted(out.glob("*.mp4"), key=lambda p: p.stat().st_mtime)
        if alt_mp4s:
            mp4 = alt_mp4s[-1]
        else:
            print(f"No rendered mp4 found in {out}")
            sys.exit(1)
    else:
        mp4 = sorted(candidates, key=lambda x: x[0])[-1][1]

tl_path = ROOT / "engine" / "src" / "videos" / vid / "timeline.json"
script_path = vdir / "script.json"

if not tl_path.exists() or not script_path.exists():
    print(f"Warning: timeline.json or script.json missing for {vid}. Audio checks will be limited to clipping and loudness.")
    tl = {"fps": 30, "beats": []}
    script = {"beats": []}
else:
    tl = json.loads(tl_path.read_text(encoding="utf-8"))
    script = json.loads(script_path.read_text(encoding="utf-8"))

FPS = tl.get("fps", 30)
SR = 16000
fails, info = [], []
FAIL = lambda m: fails.append(f"FAIL [listen] {m}")
tc = lambda s: f"{int(s // 60)}:{s % 60:05.2f}"


def beat_at(sec: float) -> str:
    f = sec * FPS
    for b in tl.get("beats", []):
        if b["start"] <= f < b["start"] + b["dur"]:
            return b["id"]
    return "unknown"


wav = QA / "_listen.wav"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-vn", "-ac", "1", "-ar", str(SR), str(wav)], check=True)
a, _ = sf.read(str(wav))
a = a.astype(np.float32)
db = lambda x: 20 * np.log10(max(float(x), 1e-9))

# 1. clipping (on the full-rate stereo stream)
peak_proc = subprocess.run(
    ["ffmpeg", "-v", "info", "-i", str(mp4), "-vn", "-af", "astats=measure_overall=Peak_level:measure_perchannel=none", "-f", "null", "-"],
    capture_output=True, text=True
)
try:
    peak = float(peak_proc.stderr.rsplit("Peak level dB:", 1)[-1].split()[0])
    if peak > -0.5:
        FAIL(f"clipping: peak {peak:.1f} dBFS")
except Exception:
    peak = 0.0

# 2. loudness
eb_proc = subprocess.run(
    ["ffmpeg", "-v", "info", "-i", str(mp4), "-vn", "-af", "ebur128", "-f", "null", "-"],
    capture_output=True, text=True
)
try:
    lufs = float(eb_proc.stderr.rsplit("I:", 1)[-1].split()[0])
    info.append(f"integrated loudness {lufs:.1f} LUFS, peak {peak:.1f} dBFS")
    if not -17 <= lufs <= -12:
        info.append("loudness outside -17..-12 LUFS: YouTube will adjust volume; aim for -16 to -13")
except Exception:
    lufs = -16.0

# 3. dead air (100 ms windows below -50 dBFS)
win = SR // 10
rms = np.array([np.sqrt(np.mean(a[i:i + win] ** 2)) for i in range(0, len(a) - win, win)])
quiet = rms < 10 ** (-50 / 20)
run = 0
for i, q in enumerate(quiet):
    run = run + 1 if q else 0
    if run == 18 and (i + 1) * 0.1 < len(a) / SR - 2.5:
        t_dead = (i - 17) * 0.1
        FAIL(f"dead air (silence > 1.8 s) at {tc(t_dead)} (beat {beat_at(t_dead)})")

# 4. effects vs narration, and low drone, using the fx stem build.py wrote
fxp = vdir / "tmp" / "fx_stem.wav"
if fxp.exists():
    fx, fsr = sf.read(str(fxp))
    fx = fx if fx.ndim == 1 else fx.mean(1)
    fx = np.interp(np.arange(len(a)) / SR, np.arange(len(fx)) / fsr, fx).astype(np.float32)
    voice = a - fx
    for b in tl.get("beats", []):
        if "clip" in b:
            continue
        s0, s1 = int(b["start"] / FPS * SR), int((b["start"] + b["dur"]) / FPS * SR)
        v = voice[s0:s1]
        e = fx[s0:s1]
        vr = np.percentile(np.abs(v), 99) if len(v) else 0
        er = np.abs(e).max() if len(e) else 0
        if er > 0 and db(er) > db(vr) - 3:
            FAIL(f"{b['id']}: sound effect ({db(er):.0f} dB) as loud as narration ({db(vr):.0f} dB): duck it")
        er_win = np.array([np.sqrt(np.mean(e[i:i + win] ** 2)) for i in range(0, max(1, len(e) - win), win)])
        if len(er_win) and db(np.median(er_win)) > -55:
            FAIL(f"{b['id']}: continuous bed/drone under voice ({db(np.median(er_win)):.0f} dBFS median); effects must be one-shots")
else:
    info.append("no fx stem found: effect/drone ratio checks skipped")

# 5. words: what a viewer actually hears vs the script
if not fast_mode:
    try:
        from faster_whisper import WhisperModel
        import jiwer
        try:
            m = WhisperModel("large-v3-turbo", device="cuda", compute_type="float16")
        except Exception:
            try:
                m = WhisperModel("small.en", device="cuda", compute_type="float16")
            except Exception:
                m = WhisperModel("small.en", device="cpu", compute_type="int8")
        words = [w for s in m.transcribe(str(wav), word_timestamps=True, vad_filter=False)[0] for w in s.words]

        ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
        TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()

        def say(n):
            if n < 20: return ONES[n]
            if n < 100: return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
            if n < 1000: return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + say(n % 100))
            for k, w in ((10 ** 9, "billion"), (10 ** 6, "million"), (1000, "thousand")):
                if n >= k: return say(n // k) + " " + w + ("" if n % k == 0 else " " + say(n % k))
            return str(n)

        def year(n): return say(n // 100) + " " + (say(n % 100) if n % 100 >= 10 else ("oh " + ONES[n % 100] if n % 100 else "hundred"))
        def ordinal(n):
            w = say(n)
            return w[:-1] + "ieth" if w.endswith("y") else w + "th"

        def norm(t):
            t = t.lower().replace("-", " ").replace("'", "").replace("’", "")
            t = re.sub(r"\$\s*0?\s*\.(\d\d)", lambda m: " " + say(int(m.group(1))) + " cents ", t)
            t = re.sub(r"(\d+)\s*\.(\d)(?!\d)", lambda m: " " + say(int(m.group(1))) + " point " + ONES[int(m.group(2))] + " ", t)
            t = re.sub(r"(\d+)\s*%", lambda m: m.group(1) + " percent ", t)
            t = re.sub(r"(\d+)(?:st|nd|rd|th)\b", lambda m: " " + ordinal(int(m.group(1))) + " ", t)
            t = re.sub(r"(?<![\d,])(1[1-9]\d\d|20[1-9]\d)(?!\d|,\d)", lambda m: " " + year(int(m.group(1))) + " ", t)
            t = re.sub(r"(\d)\s*,\s*(\d{3})", lambda m: m.group(1) + m.group(2), t)
            t = re.sub(r"\d+", lambda m: " " + say(int(m.group())) + " ", t)
            t = re.sub(r"captchas\b", "captcha", t)
            return re.sub(r"[^a-z ]", " ", t)

        sb = {b["id"]: b for b in script.get("beats", [])}
        for b in tl.get("beats", []):
            if "clip" in b or b["id"] not in sb:
                continue
            t0, t1 = b["start"] / FPS, (b["start"] + b["dur"]) / FPS
            ws = b.get("words") or []
            last_spoken = max((w["f"] for w in ws), default=0) / FPS if ws else t1
            t_end = min(t1, t0 + last_spoken + 0.25)
            heard = " ".join(w.word for w in words if t0 - 0.1 <= w.start < t_end)
            ref = sb[b["id"]].get("vo", "") or sb[b["id"]].get("say", "")
            if not ref.strip():
                continue
            hw, rw = norm(heard).split(), norm(ref).split()
            beats_list = list(sb)
            b_idx = beats_list.index(b["id"])
            nxt = next((x for x in script["beats"][b_idx + 1:][:1] if x.get("vo") or x.get("say")), None)
            if nxt:
                nxt_ref = nxt.get("vo", "") or nxt.get("say", "")
                if len(hw) > len(rw) and hw[-1:] == norm(nxt_ref).split()[:1] and rw[-1:] != hw[-1:]:
                    hw = hw[:-1]
            elif len(hw) > len(rw):
                # Learning #82: Whisper tail hallucination on end pad silence
                if jiwer.wer(" ".join(rw), " ".join(hw[:len(rw)])) <= 0.15:
                    hw = hw[:len(rw)]
            w_err = jiwer.wer(" ".join(rw), " ".join(hw) or "_")
            info.append(f"{b['id']} WER {w_err:.2f} · heard: {heard.strip()}")
            if w_err > 0.25:
                FAIL(f"{b['id']}: narration doesn't match script (WER {w_err:.2f}); heard '{heard.strip()}'")
    except Exception as ex:
        info.append(f"Whisper WER verification skipped: {ex}")

# 6. spectrogram + waveform to LOOK at
try:
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-lavfi", "showspectrumpic=s=1600x400:legend=1:scale=log:stop=8000", str(QA / "listen.png")],
        check=True
    )
except Exception:
    pass
finally:
    wav.unlink(missing_ok=True)

lines = [f"# listen {vid} · {mp4.name}", ""] + fails + [""] + ["- " + i for i in info]
(QA / "listen.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
print("\n".join(fails + info[:2]))
print(f"listened to {len(a) / SR:.1f}s of {mp4.name} · {len(fails)} FAIL · report: {QA / 'listen.md'}")
sys.exit(1 if fails else 0)
