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


PIECES = ["idcard", "chip", "brain", "contract", "lock"]  # the five pieces of the film: your name, the chips, the weights, the licence, the lock
def store(**kw): return {"v": "AppStore", "surface": "bare", "name": "deepseek", **kw}
def bill(**kw): return {"v": "ListDoc", "surface": "bare", "title": "us senate bill", "rows": [{"t": "chinese ai"}, {"t": "import ban", "at": "law"}, {"t": "penalties", "at": "downloading"}], **kw}

VO = {  # id: (vo, say or None)
    "h01": ("Take a long look at the AI on your phone. Enjoy it while you still can.", "Take a long look at the AI on your phone. Enjoy it, while you still can."),
    "h02": ("That face was faked live, with AI anyone can download. And governments are reaching for the off switch.", None),
    "h03": ("Last year, DeepSeek, a Chinese AI, hit number one on the app charts. Within days, Italy ordered it blocked. South Korea pulled it from its stores.", None),
    "h04": ("And an American senator proposed a law under which downloading it could mean up to twenty years in prison.", None),
    "h05": ("Governments don't move fast for ethics. They move fast when the banking system is on fire.", None),
    "h06": ("That's Sam Altman, who runs ChatGPT. And here's the twist: the loudest voices asking to lock AI down? Some are the very companies that built it.", None),
    "h07": ("By the end of this video, you'll see who wins when the trap snaps shut. And it isn't you.", None),
}

SHOTS = {
    "h01": {"cuts": [
        full(phone("open", ask="plan my trip to rome", askAt=0, replyAt="phone"), "the AI on *your phone*"),
        full(phone("off", gateAt="still"), "while you *still can*", at="Enjoy")]},
    "h02": {"cuts": [
        split(hearing("fake_face.jpg", pill="faked live"), icon("laptop", label="free download", enter="download"), "faked *live*"),
        split(icon("building", label="governments"), icon("power", label="off switch", enter="off"), "reaching for *the off switch*", at="governments")]},
    "h03": {"cuts": [
        full(store(rankAt="number", tag=tag("jan 2025", "number")), "*number one* on the charts"),
        split(store(rankAt=0), icon("flag", label="italy", mark="no", markAt="blocked", enter="Italy"), "*blocked* in Italy", at="Within"),
        split(store(rankAt=0, pullAt="pulled"), icon("flag", label="south korea", enter="Korea"), "*pulled* from the store", at="South")]},
    "h04": {"cuts": [
        split(bill(hot=2, hotAt="downloading"), icon("bars", label="prison", enter="prison", tag=tag("up to 20 years", "20")), "*prison* for a download?")]},
    "h05": {"cuts": [
        split(icon("building", label="governments"), icon("people", label="ethics debates", mark="no", markAt="ethics", enter="ethics"), "not for *ethics*"),
        split(icon("building", label="the banks"), icon("fire", enter="fire"), "when *the banks* burn", at="banking")]},
    "h06": {"cuts": [
        split(hearing("fed_altman.jpg", pill="sam altman · openai"), icon("building", label="federal reserve"), "the man who *runs ChatGPT*"),
        split(row("building", 3, label="ai companies"), icon("lock", label="lock it down", enter="lock"), "the builders want *the lock*", at="twist")]},
    "h07": {"cuts": [
        full(pieces([None] * 5, snapAt="snaps"), "when *the trap* snaps shut"),
        split(pieces([None] * 5, snapped=True), icon("person", label="you", mark="no", markAt="isn't", enter="you"), "and it *isn't you*", at="isn't")]},
}

CLIPS = {  # (file, from, to, plate[, plateAt]); from/to = first word start / last word end in the clip file. build.py adds the breathing room.
    "c01": None,  # hook: live deepfake demo (CC), filled after the clip search
    "c02": None,  # Sam Altman at the Federal Reserve, 22 Jul 2025 (Fed video, US gov), filled after the clip search
}

ORDER = "h01 c01 h02 h03 h04 h05 c02 h06 h07"
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

    out = {"id": "ai-ban", "title": "THE COMING AI BAN · 1-min sample (owner's opening)",
           "voice": {"engine": "kokoro", "name": "af_heart", "speed": 1.0},
           "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
           "beats": beats}
    (HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(b.get("vo", "").split()) for b in beats)
    print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")
