"""Contact sheet of cut stills in timeline order: python tools/sheet.py <video_id> [first_beat] [last_beat] [cols=4] [w=480]
Reads videos/<id>/qa/cuts/<beat>[.<cut>].jpg (made by tools/cutstills.mjs) and writes videos/<id>/qa/sheet_<first>_<last>.jpg,
each still labelled with its beat/cut and caption. Defaults to all beats if first_beat/last_beat are omitted."""
import json, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    sys.exit(0)

vid = sys.argv[1]
script_path = ROOT / "videos" / vid / "script.json"
if not script_path.exists():
    sys.exit(f"Error: script.json not found for '{vid}'")

script = json.loads(script_path.read_text(encoding="utf-8"))
ids = [x["id"] for x in script.get("beats", [])]
if not ids:
    sys.exit(f"Error: no beats in {script_path}")

a = sys.argv[2] if len(sys.argv) > 2 else ids[0]
b = sys.argv[3] if len(sys.argv) > 3 else ids[-1]
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
W = int(sys.argv[5]) if len(sys.argv) > 5 else 480
H = W * 9 // 16

if a not in ids or b not in ids:
    sys.exit(f"Error: beat range '{a}'..'{b}' not found in {vid}. Available beats: {', '.join(ids)}")

ids = ids[ids.index(a): ids.index(b) + 1]
cdir = ROOT / "videos" / vid / "qa" / "cuts"
tiles = []
for i in ids:
    for f in sorted(cdir.glob(f"{i}.jpg")) + sorted(cdir.glob(f"{i}.[0-9]*.jpg"), key=lambda p: int(p.stem.split(".")[1])):
        tiles.append(f)

if not tiles:
    sys.exit(f"Error: no cut stills found in {cdir} for range {a}..{b}. Run: node tools/cutstills.mjs {vid}")

try:
    font = ImageFont.truetype("arial.ttf", 15)
except OSError:
    font = ImageFont.load_default()

# Map beat/cut ID to caption for fast visual inspection
caps = {}
for beat in script.get("beats", []):
    s = beat.get("shot") or {}
    if "cuts" in s:
        for idx, c in enumerate(s["cuts"]):
            caps[f"{beat['id']}.{idx}"] = c.get("cap", "")
    else:
        caps[beat["id"]] = s.get("cap", "")

rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 24)), "black")
d = ImageDraw.Draw(sheet)
for k, f in enumerate(tiles):
    im = Image.open(f).convert("RGB").resize((W, H))
    x, y = (k % cols) * W, (k // cols) * (H + 24)
    sheet.paste(im, (x, y + 24))
    cap_txt = re.sub(r"[*=~]", "", caps.get(f.stem, "")).strip()
    label = f"{f.stem}  |  {cap_txt}" if cap_txt else f.stem
    d.text((x + 6, y + 4), label[:52], fill="yellow", font=font)

out = ROOT / "videos" / vid / "qa" / f"sheet_{a}_{b}.jpg"
sheet.save(out, quality=85)
print(out, len(tiles), "stills")
