#!/usr/bin/env python
import json, os, sys, subprocess, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

VIDEOS = {
 "ai-ban": {
   "file": "videos/ai-ban/out/All-in_ai_ban_full.mp4",
   "title": "The Coming AI Ban — Why Your Phone's AI May Not Last",
   "tags": "AI, artificial intelligence, AI ban, deepfakes, regulation, ChatGPT, Sam Altman, Sam Altman Fed, DeepSeek, Hayley Senate, AI safety, explainer, documentary",
   "playlist": "AI Explainers",
   "thumbnail_hint": "videos/ai-ban/qa/cuts_fix2.jpg (frame of c01 deepfake hook) — use a 1280x720 crop, red accent, 3-word text max",
 },
 "captchas-full": {
   "file": "videos/captchas-full/out/All-in_captchas_full_v3.mp4",
   "title": "CAPTCHAs Explained: How Bots Beat the 'I'm Not a Robot' Test",
   "tags": "CAPTCHA, reCAPTCHA, bots, automation, cybersecurity, click farms, image recognition, web security, AI, explainer",
   "playlist": "Explainers",
   "thumbnail_hint": "first-clip deepfake/hook frame; reuse v6 3-min cut as a Short teaser (clip the best 45-60s)",
 },
 "captchas-3min": {
   "file": "videos/captchas-3min/out/All-in_captchas_3min_v6.mp4",
   "title": "CAPTCHAs in 3 Minutes — The One Trick That Actually Works",
   "tags": "CAPTCHA, reCAPTCHA, bots, cybersecurity, quick explainer, Short",
   "playlist": "Shorts",
   "thumbnail_hint": "use as YouTube Short (vertical crop) + chapter teaser for the full film",
 },
 "china-ai-underground": {
   "file": "videos/china-ai-underground/out/All-in_china_ai_underground_sample.mp4",
   "title": "Inside China's AI Underground — Smuggled Chips, Stolen Answers",
   "tags": "China AI, DeepSeek, Blackwell, chip smuggling, AI distillation, Anthropic, BIS, explainer",
   "playlist": "AI Explainers",
   "thumbnail_hint": "case-file frame with EXHIBIT A/B red stamp; expand to full 8-min film next",
 },
}

def dur_sec(path):
    p = os.path.join(ROOT, path)
    if not os.path.exists(p): return None
    try:
        r = subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",p], text=True).strip()
        return float(r)
    except Exception: return None

def ts(seconds):
    s=int(seconds); h=s//3600; m=(s%3600)//60; sec=s%60
    return f"{h}:{m:02d}:{sec:02d}" if h else f"{m}:{sec:02d}"

def build(vid):
    info = VIDEOS[vid]
    tl = json.load(open(os.path.join(ROOT,"engine/src/videos",vid,"timeline.json")))
    fps = tl["fps"]; total = tl["total"]/fps
    beats = tl["beats"]
    script = json.load(open(os.path.join(ROOT,"videos",vid,"script.json")))
    # chapters = first beat per act, in order
    chapters = []
    last_act=None
    for b in beats:
        act = (b.get("shot") or {}).get("act") or b.get("act")
        if act and act != last_act:
            chapters.append((b["start"]/fps, act)); last_act=act
    # narration sample (first 3 narrated beats)
    sbeats = script["beats"]
    hooks = [b.get("vo") for b in sbeats if b.get("vo")][:3]
    out = os.path.join(ROOT,"publish",f"{vid}.md")
    lines=[]
    lines.append(f"# YouTube publish kit · {vid}")
    lines.append("")
    lines.append(f"**Delivered file:** `{info['file']}`  ({dur_sec(info['file']):.0f}s / {ts(dur_sec(info['file']))})" if dur_sec(info['file']) else f"**Delivered file:** `{info['file']}`")
    lines.append(f"**Playlist:** {info['playlist']}")
    lines.append(f"**Suggested title:** {info['title']}")
    lines.append(f"**Thumbnail:** {info['thumbnail_hint']}")
    lines.append("")
    lines.append("## Description (paste)")
    lines.append("")
    lines.append(f"{hooks[0] if hooks else ''}")
    lines.append("")
    lines.append("A money-rule build: every clip is CC BY / CC BY-SA / CC0 / public domain / US-government video. "
                 "No news clips, no TED, no re-uploaded stock. Sources and licences are listed in the repo "
                 "(videos/"+vid+"/SOURCES.md and LICENCES.md).")
    lines.append("")
    if chapters:
        lines.append("## Chapters")
        lines.append("")
        for t,act in chapters:
            lines.append(f"{ts(t)} {act}")
        lines.append("")
    lines.append("## Tags")
    lines.append("")
    lines.append(info["tags"])
    lines.append("")
    lines.append("## Pinned comment")
    lines.append("")
    lines.append("Which part hit hardest? Reply and I'll pull the receipts (sources + licences) in the next video. "
                 "Vote on the next topic in the community tab.")
    lines.append("")
    lines.append("## Checklist")
    lines.append("- [ ] Upload the delivered MP4 (not the full-quality render if size > 2 GB)")
    lines.append("- [ ] Add end screen at last 20 s (subscribe + next video)")
    lines.append("- [ ] Add cards at each chapter start")
    lines.append("- [ ] Subtitles: upload the voiced word timings (tools/build.py output) as SRT")
    lines.append("- [ ] Schedule for Tue/Thu 14:00 UTC for first 48 h of traffic")
    lines.append("- [ ] Post 3 Short teasers cut from the strongest 30-45 s")
    open(out,"w",encoding="utf-8").write("\n".join(lines))
    print("wrote",out)

if __name__=="__main__":
    vids = sys.argv[1:] or list(VIDEOS)
    for v in vids: build(v)
