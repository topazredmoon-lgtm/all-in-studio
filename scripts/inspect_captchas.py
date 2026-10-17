import json

with open("engine/src/videos/captchas-full/timeline.json") as f:
    tl = json.load(f)

print("Total frames:", tl.get("total"), "FPS:", tl.get("fps"))
for b in tl.get("beats", [])[:25]:
    shot = b.get("shot", {})
    cuts = shot.get("cuts", [])
    cut_desc = ""
    if cuts:
        cut_desc = f"cuts({len(cuts)}): " + ", ".join([c.get("hero", {}).get("v", "") or f"{c.get('L',{}).get('v')}+{c.get('R',{}).get('v')}" for c in cuts])
    L = shot.get("L", {}).get("v")
    R = shot.get("R", {}).get("v")
    hero = shot.get("hero", {}).get("v")
    clip = b.get("clip", {})
    clip_src = clip.get("src") if clip else None
    print(f"{b['id']}: start={b['start']/30:5.1f}s dur={b['dur']/30:4.1f}s layout={shot.get('layout')} L={L} R={R} hero={hero} clip={clip_src} {cut_desc}")
