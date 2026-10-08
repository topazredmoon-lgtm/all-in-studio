"""Watch the rendered mp4 like a viewer would (CLAUDE.md Philosophy #6, owner note 2026-10-04: "do u really not check the video?").
  python tools/watch.py <video_id> [mp4]      # default: newest videos/<id>/out/<id>_vN.mp4
Decodes EVERY frame at 160x90 and measures "content": the share of pixels with real edges (text, photos, UI).
FAIL  a stretch >= 0.20 s where the frame is near-empty (only the ambient ground, black) or > 30 % one flat bright area (blank card, white b-roll window).
Also writes videos/<id>/qa/watch.jpg: a timestamped contact sheet at 2 fps, which Claude must LOOK AT before sending anything.
Exit 1 on any FAIL. qa.py --mp4 runs this too."""
import json, re, subprocess, sys
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
vid = sys.argv[1]
out = ROOT / "videos" / vid / "out"
if len(sys.argv) > 2 and not sys.argv[2].startswith("--"):
    mp4 = Path(sys.argv[2])
else:
    vs = sorted(out.glob(f"{vid}_v*.mp4"), key=lambda p: int(re.search(r"_v(\d+)\.mp4$", p.name).group(1)))
    mp4 = vs[-1]
CAL = "--calibrate" in sys.argv
W, H = 160, 90
probe = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate", "-of", "json", str(mp4)]))
num, den = map(int, probe["streams"][0]["r_frame_rate"].split("/")); fps = num / den
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(mp4), "-vf", f"scale={W}:{H},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.float32)

def content(g):
    gx = np.abs(np.diff(g, axis=1))[:-1, :]; gy = np.abs(np.diff(g, axis=0))[:, :-1]
    e = np.maximum(gx, gy)
    return float((e > 22).mean())  # share of strong-edge pixels; the ambient grid/crop marks stay far below 22

def flat_bright(g):
    gx = np.abs(np.diff(g, axis=1))[:-1, :]; gy = np.abs(np.diff(g, axis=0))[:, :-1]
    return float(((np.maximum(gx, gy) < 4) & (g[:-1, :-1] > 170)).mean())  # one big blank card / white b-roll window

c = np.array([content(g) for g in fr]); fb = np.array([flat_bright(g) for g in fr])
tc = lambda i: f"{int(i / fps // 60)}:{i / fps % 60:05.2f}"
if CAL:
    for i in range(0, len(c), int(fps / 4)): print(tc(i), f"{c[i]:.4f}/{fb[i]:.2f}")
    sys.exit(0)

TH, FB, MIN = 0.006, 0.30, round(0.20 * fps)
# frames inside archival clips: a white studio wall is the source's own look, so only the "near-empty" test applies there
tlp = ROOT / "engine" / "src" / "videos" / vid / "timeline.json"
in_clip = np.zeros(len(c), bool)
if tlp.exists():
    for b in json.loads(tlp.read_text(encoding="utf-8"))["beats"]:
        if "clip" in b: in_clip[b["start"]: b["start"] + b["dur"]] = True
fb = np.where(in_clip, 0.0, fb)
fails, run = [], None
for i, v in enumerate(c):
    if v < TH or fb[i] > FB:
        run = run or [i, i]; run[1] = i
    else:
        if run and run[1] - run[0] + 1 >= MIN: fails.append(run)
        run = None
if run and run[1] - run[0] + 1 >= MIN and run[0] < len(c) - fps * 0.5: fails.append(run)  # a fade-out at the very end is fine

# timestamped contact sheet, 2 fps
sheet = ROOT / "videos" / vid / "qa" / "watch.jpg"; sheet.parent.mkdir(parents=True, exist_ok=True)
n = int(len(c) / fps * 2) + 1; cols = 10; rows = (n + cols - 1) // cols
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp4), "-vf", f"fps=2,scale=240:-1,drawtext=text='%{{pts\\:hms}}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black,tile={cols}x{rows}", "-frames:v", "1", str(sheet)], stderr=subprocess.DEVNULL)

for a, b in fails:
    print(f"FAIL [watch] near-empty screen for {(b - a + 1) / fps:.2f}s at {tc(a)}-{tc(b)} (content {c[a:b + 1].min():.4f}, flat-bright {fb[a:b + 1].max():.0%})")
print(f"watched {len(c)} frames of {mp4.name} · {len(fails)} FAIL · sheet: {sheet}")
sys.exit(1 if fails else 0)
