"""Writes script.json for ai-black-markets: the 1:30 SAMPLE (owner, 2026-10-08: "only 1min30"; quota is low).
Topic (owner): "the DARK REALITY of grey areas of AI and its practices in the black markets!", newbie-friendly.
Bar: captchas-3min v6. Rules: v6 pictures (no text-led shot, caption <= 5 words, tags under pictures), left/right split,
cuts on cue words every 2-3 s, no music, every acronym read aloud, clips CC only (LICENCES.md), one every 20-40 s,
hook clip in the first seconds, each clip ends on a sentence end.
Edit SHOTS / VO / CLIPS, rerun, then `python tools/tts.py ai-black-markets` and `python tools/build.py ai-black-markets`."""
import json
from pathlib import Path

HERE = Path(__file__).parent
A = "aibm/"


def split(L, R, cap=None, at=None, **kw):
    d = {"layout": "split", "L": L, "R": R, **kw}
    if cap: d["cap"] = cap
    if at is not None: d["at"] = at
    return d


def full(hero, cap=None, at=None, **kw):
    d = {"layout": "full", "hero": hero, **kw}
    if cap: d["cap"] = cap
    if at is not None: d["at"] = at
    return d


def icon(name, **kw): return {"v": "LineIcon", "surface": "bare", "name": name, **kw}
def row(name, n, **kw): return {"v": "IconRow", "surface": "bare", "name": name, "n": n, **kw}
def flow(nodes, **kw): return {"v": "Flow", "surface": "bare", "nodes": nodes, **kw}
def call(**kw): return {"v": "CallGrid", "surface": "bare", **kw}
def phone(**kw): return {"v": "PhoneCall", "surface": "bare", **kw}
def chat(ask, mode, **kw): return {"v": "ChatBox", "surface": "bare", "ask": ask, "mode": mode, **kw}
def listing(icon_, name, **kw): return {"v": "Listing", "surface": "bare", "icon": icon_, "name": name, **kw}
def shop(items, **kw): return {"v": "Shop", "surface": "bare", "items": items, **kw}
def tag(t, at=0): return {"t": t, "at": at}


VO = {  # id: (vo, say or None)
    "h00": ("This job interview looks normal. But the person on camera isn't who he says he is.", None),
    "g01": ("Welcome to the grey zone of A.I.", "Welcome to the grey zone of A I."),
    "g02": ("Grey, because the tools are legal. A voice cloner reads audiobooks.", None),
    "g03": ("But the same tools are sold to criminals, in black markets that look like any online shop.", None),
    "w01": ("In twenty twenty-three, a chatbot called WormGPT went on sale on a crime forum, for sixty euros a month.", "In twenty twenty-three, a chatbot called Worm G P T went on sale on a crime forum, for sixty euros a month."),
    "w02": ("Ask a normal chatbot to write a scam email, and it says no. This one was built to say yes.", None),
    "w03": ("And it's not just chatbots. Whole scam kits are rented out like a streaming subscription.", None),
    "d01": ("Now the dark part. Hong Kong, twenty twenty-four. An employee joins a video call with his finance chief.", None),
    "d02": ("A deepfake is a fake video or voice, made by A.I. to copy a real person.", "A deepfake is a fake video or voice, made by A I to copy a real person."),
    "d03": ("Every face on that call was a deepfake. He sent twenty-five million dollars. And a voice is even easier to fake.", None),
    "e01": ("In the full film: who sells these tools, who buys them, and how to keep your voice safe.", None),
}

SHOTS = {
    "h00": {"cuts": [
        full(call(label={"i": 3, "t": "applicant"}), "a normal *job interview*"),
        full(call(label={"i": 3, "t": "applicant"}, fakeAt="person", fakes=[3]), "*not who* he says", at="person")]},
    "g01": {"cuts": [
        split(icon("robot", mark="ok", markAt="gray"), icon("robot", mark="no", markAt="gray", enter="gray"), "the *grey zone* of AI")]},
    "g02": {"cuts": [
        split(icon("robot", label="the tool"), icon("contract", mark="ok", markAt="legal", label="legal", enter="legal"), "the tools are *legal*"),
        split(icon("monitor", label="voice clone"), icon("book", enter="audiobooks", label="audiobook"), "a *voice cloner*", at="voice")]},
    "g03": {"cuts": [
        split(icon("people", label="criminals"), shop(["robot", "face", "envelope", "key", "doc", "cash"], at="sold", enter="sold"), "sold in *black markets*"),
        full(shop(["browser", "fingerprint", "contract", "laptop", "coin", "eye"]), "like any *online shop*", at="online")]},
    "w01": {"cuts": [
        split(icon("browser", label="crime forum"), listing("robot", "wormgpt", enter="chatbot"), "*2023*, a crime forum"),
        full(listing("robot", "wormgpt", price="€60 / month", priceAt="60", buyAt="month",
                     plate="slashnext · july 2023"), "*60 euros* a month", at="60")]},
    "w02": {"cuts": [
        split(chat("write a scam email", "refuse", replyAt="no"), icon("envelope", mark="no", markAt="no", label="scam email", enter="scam"), "a normal chatbot *says no*"),
        split(icon("robot", label="wormgpt"), chat("write a scam email", "comply", name="wormgpt", replyAt="yes"), "built to say *yes*", at="This")]},
    "w03": {"cuts": [
        split(icon("robot", mark="?", markAt="just"), shop(["envelope", "key", "browser"], enter="kits", at="kits"), "whole *scam kits*"),
        split(icon("monitor", label="streaming"), icon("cash", label="per month", enter="subscription"), "rented, like a *subscription*", at="rented")]},
    "d01": {"cuts": [
        split(icon("building", label="hong kong"), {"v": "CalendarCard", "surface": "bare", "year": "2024", "enter": "Hong"}, "*hong kong*, 2024"),
        full(call(label={"i": 0, "t": "finance chief"}, real=3), "a call with *the boss*", at="joins")]},
    "d02": {"cuts": [
        split(icon("face", label="real person"), flow([{"icon": "face", "label": "real"}, {"icon": "robot", "label": "ai", "at": "made"}, {"icon": "face", "label": "copy", "at": "copy"}], enter="fake"),
              "a *deepfake*: an AI copy")]},
    "d03": {"cuts": [
        full(call(label={"i": 0, "t": "finance chief"}, real=3, fakeAt="face"), "every face *was fake*"),
        full(row("cash", 15, cols=5, every=3, tag=tag("$25 million", "million"), plate="hong kong police · cnn, may 2024"), "*$25 million*, gone", at="sent"),
        full(phone(name="mom", cloneAt="voice"), "a voice is *even easier*", at="voice")]},
    "e01": {"cuts": [
        split(icon("worker", label="sellers"), icon("cash", label="buyers", enter="sells"), "who sells, *who buys*"),
        split(icon("shield", mark="ok", markAt="safe"), icon("face", mark="ok", markAt="safe", enter="keep"), "keep *your voice* safe", at="keep")]},
}

CLIPS = {  # (file, from, to, plate[, fadeOut]); from/to in the clip file (speech runs from PAD = 0.6 s)
    "c01": ("cc_nk_ai.mp4", 0.30, 7.40, "Simon Wijckmans · catches fake job applicants · EMF Camp 2026", 0.1),
    "c02": ("cc_id_shops.mp4", 2.20, 10.28, "Alexej Hock & Max Bernhard · fraud researchers · 38C3", 0.08),
    "c03": ("cc_gai_voice.mp4", 0.62, 18.10, "Niklas Bunzel · Fraunhofer SIT · GoD 2024"),
}

ORDER = "h00 c01 g01 g02 g03 c02 w01 w02 d01 d02 d03 c03 e01"
ACTS = {"h00": "01 the grey zone", "w01": "02 the shop", "d01": "03 the dark part"}

beats, act = [], "01 the grey zone"
for i in ORDER.split():
    act = ACTS.get(i, act)
    if i in CLIPS:
        f, a, z, plate, *fo = CLIPS[i]
        beats.append({"id": i, "clip": {"src": A + f, "from": a, "to": z, "plate": plate, **({"fadeOut": fo[0]} if fo else {})}})
        continue
    vo, say = VO[i]
    b = {"id": i, "vo": vo, **({"say": say} if say else {}), "shot": {**SHOTS[i], "act": act}}
    beats.append(b)

out = {"id": "ai-black-markets", "title": "THE DARK REALITY OF AI'S BLACK MARKETS · 1:30 sample",
       "voice": {"engine": "kokoro", "name": "af_heart", "speed": 0.95},
       "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
       "beats": beats}
(HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
words = sum(len(b.get("vo", "").split()) for b in beats)
print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")
