"""Writes script.json for ai-ban ("THE COMING AI BAN"): the ~1-min SAMPLE = act 1 of narration v1 (SCRIPT.md), beats
h00-h06 + clips c01/c02 (Altman at the US Senate, 16 May 2023: the Senate's own video, US government work, public domain).
Bar: captchas-3min v6 and beat it. Rules: picture-led (real hearing frames + line art, no text-led shot, caption <= 5 words),
left/right split, cuts on cue words every 2-3 s, no music, every acronym read aloud (AI, Chat G P T), clips PD/CC only
(LICENCES.md), one every 20-40 s, hook clip in the first seconds, each clip ends on a sentence end.
Edit SHOTS / VO / CLIPS, rerun, then `python tools/tts.py ai-ban` and `python tools/build.py ai-ban`."""
import json
from pathlib import Path

HERE = Path(__file__).parent
A = "aiban/"


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
def phone(mode, **kw): return {"v": "PhoneChat", "surface": "bare", "mode": mode, **kw}
def licence(kind, **kw): return {"v": "Licence", "surface": "bare", "kind": kind, **kw}
def hearing(img, **kw): return {"v": "Hearing", "surface": "bare", "img": A + img, **kw}
def listdoc(rows, **kw): return {"v": "ListDoc", "surface": "bare", "title": "us munitions list", "rows": rows, **kw}
def pieces(ats, **kw):
    return {"v": "Pieces", "surface": "bare", "pieces": [{"icon": i, **({"at": a} if a else {})} for i, a in zip(PIECES, ats)], **kw}
def tag(t, at=0): return {"t": t, "at": at}


PIECES = ["idcard", "chip", "brain", "contract", "lock"]  # the five pieces of the film: your name, the chips, the weights, the licence, the lock
SENATE = "us senate video · public domain"
ALTMAN = {"x": 37, "y": 4, "w": 26, "h": 50}  # ring around Altman in senate_altman.jpg (% of the frame)

VO = {  # id: (vo, say or None)
    "h00": ("Open the AI app on your phone. Ask it anything. It answers, and it never asks who you are.",
            "Open the AI app on your phone. Ask it anything. It answers, and it never asks who you are."),
    "h01": ("Now picture the day it does. Your licence number, or no answer.", None),
    "h02": ("That's Sam Altman, the man who runs ChatGPT, in front of the US Senate. And then he asked for something strange.",
            "That's Sam Altman, the man who runs Chat G P T, in front of the U S Senate. And then he asked for something strange."),
    "h03": ("A licence to build AI. Like a driving licence, but for building a mind. It sounds safe. But we've seen this before.",
            "A licence to build AI. Like a driving licence, but for building a mind. It sounds safe. But we've seen this before."),
    "h04": ("Until 1996, America listed strong encryption, the maths that keeps your messages private, as a munition. On the same list as tanks and missiles.",
            "Until nineteen ninety-six, America listed strong encryption, the maths that keeps your messages private, as a munition. On the same list as tanks and missiles."),
    "h05": ("Nobody has banned AI. Not yet. But almost every piece you'd need to do it has already been built, or tried.",
            "Nobody has banned AI. Not yet. But almost every piece you'd need to do it has already been built, or tried."),
    "h06": ("By the end of this video, you'll know each piece, who wins if they snap together, and how ordinary people beat this once before.", None),
}

SHOTS = {
    "h00": {"cuts": [
        full(phone("open", askAt="Ask", replyAt="anything"), "ask it *anything*"),
        split(phone("open"), icon("idcard", mark="no", markAt="who", label="your name", enter="never"), "it never asks *who you are*", at="never")]},
    "h01": {"cuts": [
        full(phone("gate", gateAt="day"), "the day *it asks*"),
        split(phone("gate"), licence("blank", at="license", stamp="required", stampAt="answer"), "your *licence*, or nothing", at="Your")]},
    "h02": {"cuts": [
        full(hearing("senate_altman.jpg", pill="sam altman", plate=SENATE), "the man who *runs it*"),
        split(hearing("senate_altman.jpg", pill="sam altman"), hearing("senate_dais.jpg", pill="the senate", focus="40% 40%"), "in front of *the senate*", at="front"),
        full(hearing("senate_altman.jpg", ring=ALTMAN, ringAt="strange", tag=tag("16 may 2023"), plate=SENATE), "he asked for *something strange*", at="And")]},
    "h03": {"cuts": [
        split(licence("car", title="driving licence"), licence("brain", title="mind licence", enter="like"), "a *licence* for a mind"),
        split(icon("shield", mark="ok", markAt="safe", label="safe?"), licence("brain", title="mind licence", stamp="approved", stampAt="safe"), "it *sounds* safe", at="sounds"),
        split(licence("brain", title="mind licence"), icon("clock", tAt="seen", label="before"), "we've *seen this* before", at="But#2")]},
    "h04": {"cuts": [
        split(icon("lock", label="encryption", tag=tag("until 1996")), icon("flag", label="america", enter="America"), "*until 1996*, in america"),
        split(icon("lock", label="encryption"), icon("envelope", label="your messages"), "keeps your *messages* private", at="maths"),
        split(icon("lock", label="encryption"), listdoc([{"t": "tanks"}, {"t": "missiles"}, {"t": "warships"}, {"t": "bombs"}, {"t": "encryption"}], hot=4, hotAt="munition",
                                                        plate="22 cfr 121 · cat. xiii · eo 13026, 1996"), "listed as a *weapon*", at="as"),
        split(listdoc([{"t": "tanks"}, {"t": "missiles"}, {"t": "warships"}, {"t": "bombs"}, {"t": "encryption"}], hot=4, hotAt=0), icon("tank", label="tanks", enter="tanks"), "same list as *tanks*", at="same")]},
    "h05": {"cuts": [
        full(pieces([None, "yet", "piece", "built", "tried"]), "nobody has *banned* it. yet."),
    ]},
    "h06": {"cuts": [
        full(pieces([None] * 5, snapAt="snap"), "who wins if they *snap*"),
        split(pieces([None] * 5, snapped=True), icon("people", mark="ok", markAt="beat", label="ordinary people", enter="ordinary"), "how people *won* before", at="ordinary")]},
}

CLIPS = {  # (file, from, to, plate[, fadeOut]); from/to in the clip file (speech runs from PAD = 0.6 s)
    "c01": ("senate_goes_wrong.mp4", 0.50, 4.12, "Sam Altman · head of OpenAI · US Senate, 16 May 2023"),
    "c02": ("senate_licence.mp4", 0.72, 9.42, "Sam Altman · US Senate, 16 May 2023 · public domain", 0.08),
}

ORDER = "h00 h01 c01 h02 c02 h03 h04 h05 h06"
ACTS = {"h00": "01 the ban"}

if __name__ == "__main__":
    clipj = json.loads((HERE.parents[1] / "engine" / "public" / "aiban" / "_clips.json").read_text(encoding="utf-8"))
    beats, act = [], "01 the ban"
    for i in ORDER.split():
        act = ACTS.get(i, act)
        if i in CLIPS:
            f, a, z, plate, *fo = CLIPS[i]
            z = z if z is not None else clipj[f.rsplit(".", 1)[0]]["dur"] - 0.3
            beats.append({"id": i, "clip": {"src": A + f, "from": a, "to": round(z, 2), "plate": plate, **({"fadeOut": fo[0]} if fo else {})}})
            continue
        vo, say = VO[i]
        beats.append({"id": i, "vo": vo, **({"say": say} if say else {}), "shot": {**SHOTS[i], "act": act}})

    out = {"id": "ai-ban", "title": "THE COMING AI BAN · 1-min sample",
           "voice": {"engine": "kokoro", "name": "af_heart", "speed": 0.95},
           "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
           "beats": beats}
    (HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(b.get("vo", "").split()) for b in beats)
    print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")
