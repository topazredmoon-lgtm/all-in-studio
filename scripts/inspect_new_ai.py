import json

with open("engine/src/videos/new-ai-reasoning/timeline.json") as f:
    tl = json.load(f)

print(f"Total: {tl['total']} frames = {tl['total']/30:.2f}s")
for b in tl["beats"]:
    print(f"{b['id']}: start={b['start']/30:5.2f}s, dur={b['dur']/30:5.2f}s")
