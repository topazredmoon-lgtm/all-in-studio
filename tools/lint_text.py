"""No big text on an empty screen: python tools/lint_text.py <video_id>   (build.py runs it first and stops on FAIL)
Owner, 2026-10-07: "i dont want big text in an emptu screen … especially not centered like … a question mark alone …
or a '63years' alone written in big centered in empty screen". Every shot must be led by a picture.
FAIL when:
  - a shot uses a text-led visual (Count, Word, Payer) or a chapter card (big title on an empty board);
  - a full-screen shot's only object is a word object (Bubble, CalendarCard): it needs a picture beside it (use the split);
  - both sides of a split are word objects;
  - a tag (the small label under a picture) is longer than 24 characters, or a caption longer than 6 words;
  - a square crop (Captcha4, Square) runs off its photo."""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
vid = sys.argv[1]
script = json.loads((ROOT / "videos" / vid / "script.json").read_text(encoding="utf-8"))
TEXT_LED = {"Count", "Word", "Payer"}
WORDY = {"Bubble", "CalendarCard", "PageQuote"}
fails = []


def shots(b):
    s = b.get("shot")
    if not s: return []
    return [(f"{b['id']}.{i}", c) for i, c in enumerate(s["cuts"])] if "cuts" in s else [(b["id"], s)]


for b in script["beats"]:
    for sid, s in shots(b):
        lay = s.get("layout")
        if lay == "chapter":
            fails.append(f"{sid}: chapter card = big title on an empty board; put the act over a picture instead")
            continue
        vis = [s["hero"]] if lay in ("full", "scene") else [s["L"], s["R"]]
        for v in vis:
            if v["v"] in TEXT_LED:
                fails.append(f"{sid}: {v['v']} makes text the picture; show a picture and put the number/name in a small `tag`")
            t = (v.get("tag") or {}).get("t", "")
            if len(t) > 24:
                fails.append(f"{sid}: tag '{t}' is {len(t)} characters (max 24)")
        if lay == "full" and vis[0]["v"] in WORDY:
            fails.append(f"{sid}: {vis[0]['v']} alone on the screen; pair it with a picture in a split")
        if lay == "split" and all(v["v"] in WORDY for v in vis):
            fails.append(f"{sid}: both sides are word objects; one side must be a picture")
        for v in vis:  # a crop that runs off its photo shows white squares (captchas-full v2 bus grid)
            c = v.get("crop")
            if isinstance(c, dict) and "s" in c and "iw" in v and (c["x"] < 0 or c["y"] < 0 or c["x"] + c["s"] > v["iw"] or c["y"] + c["s"] > v["ih"]):
                fails.append(f"{sid}: {v['v']} crop {c} runs off its {v['iw']}x{v['ih']} photo")
        cap = re.sub(r"[*=~]", "", s.get("cap") or "")
        if len(cap.split()) > 6:
            fails.append(f"{sid}: caption '{cap}' has {len(cap.split())} words (max 6)")

for f in fails:
    print("FAIL [text]", f)
print(f"lint_text {vid}: {len(fails)} FAIL")
sys.exit(1 if fails else 0)
