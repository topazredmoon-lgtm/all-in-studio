"""Writes script.json for ai-ban ("THE COMING AI BAN"): the new 1-min SAMPLE (owner 2026-10-11 night, on the 2-min one:
"WHO THE F CARES ABOUT THOSE SENATE HEARINGS OF OLD PEOPLE", "WHO CARES ABT THE FEAR OF SAFETY", "i think i prefer the
original script", "this time a 1min sample"). So: the owner's own opening lines, no hearing anywhere, the newest real
events (2025), the viewer's own stakes (the AI on their phone, prison for a download, their bank), then the owner's twist.
Rules: LEARNINGS 60-70. Edit SHOTS / VO / CLIPS, rerun, then `python tools/tts.py ai-ban`, `python tools/voice_check.py
ai-ban`, `python tools/build.py ai-ban`."""
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
def flow(nodes, **kw): return {"v": "Flow", "surface": "bare", "nodes": nodes, **kw}
def chat(ask, mode, **kw): return {"v": "ChatBox", "surface": "bare", "ask": ask, "mode": mode, **kw}
def tag(t, at=0): return {"t": t, "at": at}
def flag(country, label, **kw): return {"v": "Flag", "surface": "bare", "country": country, "label": label, **kw}


PIECES = ["idcard", "chip", "brain", "contract", "lock"]  # the five pieces of the film: your name, the chips, the weights, the licence, the lock
def store(**kw): return {"v": "AppStore", "surface": "bare", "name": "deepseek", **kw}
def bill(**kw): return {"v": "ListDoc", "surface": "bare", "title": "us senate bill", "rows": [{"t": "chinese ai"}, {"t": "import ban", "at": "law"}, {"t": "penalties", "at": "downloading"}], **kw}

VO = {  # id: (vo, say or None)
    "h01": ("Take a long look at the AI on your phone. Enjoy it while you still can.", "Take a long look at the AI on your phone. Enjoy it, while you still can."),
    "h02": ("Fake faces and voices, made with AI anyone can download. And in Washington and Brussels, a quiet idea is spreading: the public was never supposed to have this kind of power.", None),
    "h03": ("If it wins, open access to AI for ordinary people could be outlawed within a few years. No more free prompts. No more AI running privately on your own computer.", None),
    "h04": ("The golden age of consumer AI could be about to end. And the trap is being set by the very companies that built it.", None),
    "h05": ("Governments don't move fast for ethical debates. They move fast when the banking system is on fire.", None),
    "h05b": ("Even Sam Altman, who runs ChatGPT, warned America's central bank: some banks let you move money with just your voice.", "Even Sam Altman, who runs ChatGPT, warned America's central bank. Some banks let you move money using nothing but your voice."),
    "h06": ("Here's the twist: some of the loudest voices asking to lock AI down are the companies that built it.", None),
    "h07": ("By the end of this video, you'll see who wins when the trap snaps shut. And it isn't you.", None),
}

SHOTS = {
    "h01": {"cuts": [
        full(phone("open", ask="plan my trip to rome", askAt=0, replyAt="phone"), "the AI on *your phone*"),
        full(phone("off", gateAt="still"), "while you *still can*", at="Enjoy")]},
    "h02": {"cuts": [
        full(hearing("fake_face.jpg", pill="not a real person"), "a *fake* face and voice"),
        split(hearing("fake_face.jpg", pill="not a real person"), icon("laptop", label="free download"), "AI *anyone* can download", at="made"),
        split(flag("usa", "washington"), flag("eu", "brussels", enter="Brussels"), "a *quiet* idea", at="Washington"),
        split(icon("people", label="the public"), phone("open", ask="plan my trip to rome", askAt=0, replyAt="power"), "never meant to have *this power*", at="public")]},
    "h03": {"cuts": [
        split(icon("people", label="ordinary people"), phone("off", gateAt="outlawed", enter="open"), "*outlawed* for ordinary people"),
        split(phone("off", gateAt=0), icon("clock", label="a few years", enter="within"), "within *a few years*", at="within"),
        split(icon("clock", label="a few years"), chat("help me write my cv", "refuse", refusal="Licence required.", askAt=0, replyAt="prompts"), "no more *free* prompts", at="No"),
        split(chat("help me write my cv", "refuse", refusal="Licence required.", replyAt=0), icon("laptop", label="your computer", mark="no", markAt="computer", enter="privately"), "not even on *your own* computer", at="privately")]},
    "h04": {"cuts": [
        split(phone("open", ask="plan my trip to rome", askAt=0, replyAt=0), icon("power", label="switched off", enter="consumer"), "the *golden age* could end"),
        split(row("building", 3, label="ai companies"), icon("lock", label="the trap", enter="trap"), "set by *the builders*", at="trap")]},
    "h05": {"cuts": [
        split(icon("flag", label="governments"), icon("people", label="ethics debates", mark="no", markAt="ethical", enter="ethical"), "not for *ethics*"),
        split(icon("building", label="the banks"), icon("fire", enter="fire"), "when *the banks* burn", at="banking")]},
    "h05b": {"cuts": [
        full(hearing("fed_altman.jpg", pill="sam altman · openai"), "the man who *runs ChatGPT*"),
        split(hearing("fed_altman.jpg", pill="sam altman · openai"), icon("building", label="central bank"), "warned *the central bank*", at="central"),
        split({"v": "PhoneCall", "surface": "bare", "name": "your bank"}, icon("cash", label="moved by voice", enter="money"), "money moved by *your voice*", at="some")]},
    "h06": {"cuts": [
        full(row("building", 3, label="ai companies"), "here's *the twist*"),
        split(row("building", 3, label="ai companies"), icon("lock", label="lock it down", enter="lock"), "the builders want *the lock*", at="loudest")]},
    "h07": {"cuts": [
        full(pieces([None] * 5, snapAt="snaps"), "when *the trap* snaps shut"),
        split(pieces([None] * 5, snapped=True), icon("person", label="you", mark="no", markAt="isn't", enter="you"), "and it *isn't you*", at="isn't")]},
}

CLIPS = {  # (file, from, to, plate[, plateAt]); from/to = first word start / last word end in the clip file. build.py adds the breathing room.
    "c01": ("god_deepfake.mp4", 6.1, 15.9, "Deepfake shown by Fraunhofer SIT researchers · OWASP Day 2024 · CC BY-SA 4.0", 6.4),
    "c02": ("fed_altman2.mp4", 1.48, 8.1, "Sam Altman · head of OpenAI · US Federal Reserve, 22 July 2025", 0.3),
}

ORDER = "h01 c01 h02 h03 h04 h05 h05b c02 h07"
ACTS = {"h01": "01 the ban"}

if __name__ == "__main__":
    beats, act = [], "01 the ban"
    for i in ORDER.split():
        act = ACTS.get(i, act)
        if i in CLIPS:
            if CLIPS[i] is None: continue  # not cut yet
            f, a, z, plate, pa = CLIPS[i]
            beats.append({"id": i, "clip": {"src": A + f, "from": a, "to": z, "plate": plate, "plateAt": pa}})
            continue
        vo, say = VO[i]
        beats.append({"id": i, "vo": vo, **({"say": say} if say else {}), "shot": {**SHOTS[i], "act": act}})

    out = {"id": "ai-ban", "title": "THE COMING AI BAN · 1-min sample v5 (owner's SCENE 01, as written)",
           "voice": {"engine": "kokoro", "name": "af_heart", "speed": 1.0},
           "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
           "beats": beats}
    (HERE / "script_sample_v5.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(b.get("vo", "").split()) for b in beats)
    print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")
