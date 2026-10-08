"""Contact sheet of cut stills in timeline order: python tools/sheet.py <video_id> <first_beat> <last_beat> [cols=4] [w=480]
Reads videos/<id>/qa/cuts/<beat>[.<cut>].jpg (made by tools/cutstills.mjs) and writes videos/<id>/qa/sheet_<first>_<last>.jpg,
each still labelled with its beat/cut and caption. Smaller sheets per act read better than one 200-still sheet."""
import json, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
vid, a, b = sys.argv[1:4]
cols = int(sys.argv[4]) if len(sys.argv) > 4 else 4
W = int(sys.argv[5]) if len(sys.argv) > 5 else 480
H = W * 9 // 16
script = json.loads((ROOT / "videos" / vid / "script.json").read_text(encoding="utf-8"))
ids = [x["id"] for x in script["beats"]]
ids = ids[ids.index(a): ids.index(b) + 1]
cdir = ROOT / "videos" / vid / "qa" / "cuts"
tiles = []
for i in ids:
    for f in sorted(cdir.glob(f"{i}.jpg")) + sorted(cdir.glob(f"{i}.[0-9]*.jpg"), key=lambda p: int(p.stem.split(".")[1])):
        tiles.append(f)
try: font = ImageFont.truetype("arial.ttf", 16)
except OSError: font = ImageFont.load_default()
rows = (len(tiles) + cols - 1) // cols
sheet = Image.new("RGB", (cols * W, rows * (H + 22)), "black")
d = ImageDraw.Draw(sheet)
for k, f in enumerate(tiles):
    im = Image.open(f).convert("RGB").resize((W, H))
    x, y = (k % cols) * W, (k // cols) * (H + 22)
    sheet.paste(im, (x, y + 22)); d.text((x + 4, y + 3), f.stem, fill="yellow", font=font)
out = ROOT / "videos" / vid / "qa" / f"sheet_{a}_{b}.jpg"
sheet.save(out, quality=85)
print(out, len(tiles), "stills")
