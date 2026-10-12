#!/usr/bin/env python
import json, os, sys, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def srt_time(seconds):
    h=int(seconds//3600); m=int((seconds%3600)//60); s=int(seconds%60); ms=int(round((seconds-int(seconds))*1000))
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def build(vid):
    tl = json.load(open(os.path.join(ROOT,"engine/src/videos",vid,"timeline.json")))
    fps=tl["fps"]
    beats=tl["beats"]
    script=json.load(open(os.path.join(ROOT,"videos",vid,"script.json")))
    vo_by_id={b["id"]:b.get("vo") for b in script["beats"]}
    out=os.path.join(ROOT,"publish",f"{vid}.srt")
    cues=[]; idx=1
    for b in beats:
        vo=vo_by_id.get(b["id"])
        if not vo: continue
        start=b["start"]/fps
        end=(b["start"]+b["dur"])/fps
        cues.append(f"{idx}\n{srt_time(start)} --> {srt_time(end)}\n{vo}\n")
        idx+=1
    open(out,"w",encoding="utf-8").write("\n".join(cues))
    print("wrote",out,"cues=",len(cues))

if __name__=="__main__":
    for v in (sys.argv[1:] or []):
        build(v)
