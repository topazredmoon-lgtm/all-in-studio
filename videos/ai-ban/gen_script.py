"""Writes script.json for ai-ban ("THE COMING AI BAN"): the 2-min SAMPLE (owner 2026-10-11, after the 1-min sample:
"MUCH MUCH MORE DRAMATIC AND HOOKING", the first clip had "NO PURPOSE", "it never asks who you are" was IRRELEVANT).
Cold open = the most dramatic real moment of the 16 May 2023 Senate hearing (the Senate's own video, US gov work, PD):
the chairman opens with an AI clone of his own voice while his mouth stays shut, then reveals it. Then the twist (the man
who runs ChatGPT asks for a licence), the viewer's stakes (who can afford one), a witness naming the danger, the open loop.
Rules: LEARNINGS 60-66 (pro clip edits via build.py rolls, purposeful clips, no spaced letters, so-what test).
Edit SHOTS / VO / CLIPS, rerun, then `python tools/tts.py ai-ban`, `python tools/voice_check.py ai-ban`, `python tools/build.py ai-ban`."""
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
SENATE = "us senate video · public domain"
ALTMAN = {"x": 37, "y": 4, "w": 26, "h": 50}  # ring around Altman in senate_altman.jpg (% of the frame)

VO = {  # id: (vo, say or None)
    "h01": ("That's a United States senator, opening a hearing on AI in 2023. But watch his mouth. It isn't moving.",
            "That's a United States senator, opening a hearing on AI in twenty twenty-three. But watch his mouth. It isn't moving."),
    "h02": ("His voice was cloned from his old speeches, and the words were written by ChatGPT. And the man who runs ChatGPT was sitting right in front of him.", None),
    "h03": ("That's Sam Altman, the boss of OpenAI. You'd expect him to fight any new rules. Instead, he asked the Senate for this.", None),
    "h04": ("A licence to build powerful AI. It sounds responsible, until you ask who can afford one. You'd need lawyers, audits, and the blessing of an office that can take it away.", None),
    "h05": ("OpenAI could pay for all of that. A small startup couldn't. And neither could the people who give away free AI that anyone can download.", None),
    "h06": ("A rule like that wouldn't slow the giants down. It would pull up the ladder behind them. And one scientist at that same table said out loud where that leads.", None),
    "h07": ("Technocracy and oligarchy are big words for a simple fear: a few companies deciding what the AI in your pocket is allowed to tell you.", None),
    "h08": ("Nobody has banned AI, not yet. But almost every piece you'd need to lock it away has already been built, or tried.", None),
    "h09": ("By the end of this video, you'll know each piece, who gets rich if they snap together, and how ordinary people beat this exact plan once before.", None),
}

BLUM = {"x": 41, "y": 36, "w": 16, "h": 20}  # ring on the senator's shut mouth in senate_blumenthal_shut.jpg (% of the frame)
SHOTS = {
    "h01": {"cuts": [
        full(hearing("senate_blumenthal_shut.jpg", pill="sen. richard blumenthal"), "a *US senator*"),
        split(hearing("senate_blumenthal_shut.jpg", pill="sen. richard blumenthal"), hearing("senate_room.jpg", pill="us senate · hearing on ai", focus="50% 45%", tag=tag("16 may 2023")), "a hearing on *AI*", at="hearing"),
        full(hearing("senate_blumenthal_shut.jpg", ring=BLUM, ringAt="mouth"), "watch *his mouth*", at="watch")]},
    "h02": {"cuts": [
        split(hearing("senate_blumenthal_shut.jpg", pill="the real senator"), flow([{"icon": "doc", "label": "old speeches"}, {"icon": "robot", "label": "ai", "at": "cloned"}, {"icon": "face", "label": "fake voice", "at": "speeches"}], enter="cloned"), "a *cloned* voice"),
        split(hearing("senate_blumenthal_shut.jpg", pill="the real senator"), chat("open my senate hearing", "comply", name="chatgpt", replyAt="written", enter="words"), "words by *ChatGPT*", at="words"),
        full(hearing("senate_altman.jpg", ring=ALTMAN, ringAt="front", pill="sitting right there"), "the man who *runs ChatGPT*", at="man")]},
    "h03": {"cuts": [
        full(hearing("senate_altman.jpg", pill="sam altman · openai"), "the boss of *OpenAI*"),
        split(hearing("senate_altman.jpg", pill="sam altman · openai"), icon("contract", label="new rules", mark="no", markAt="fight"), "you'd expect *a fight*", at="expect"),
        split(hearing("senate_altman.jpg", pill="sam altman · openai"), licence("blank", title="licence", at="asked"), "he *asked* for rules", at="Instead")]},
    "h04": {"cuts": [
        full(licence("brain", title="ai licence", stamp="approved", stampAt="responsible"), "a licence to *build AI*"),
        split(licence("brain", title="ai licence"), row("cash", 12, cols=4, every=2, enter="afford"), "who can *afford* one?", at="until"),
        split(icon("contract", label="lawyers & audits", at="lawyers"), licence("brain", title="ai licence", stamp="revoked", stampAt="away"), "they can *take it away*", at="need")]},
    "h05": {"cuts": [
        full(icon("building", label="openai", mark="ok", markAt="pay"), "OpenAI *could pay*"),
        split(icon("building", label="openai", mark="ok", markAt=0), icon("laptop", label="small startup", mark="no", markAt="couldn't"), "a startup *couldn't*", at="small"),
        split(icon("laptop", label="small startup", mark="no", markAt=0), icon("brain", label="free download", mark="no", markAt="download", enter="free"), "nor the *free AI*", at="neither")]},
    "h06": {"cuts": [
        full(row("building", 3, label="the giants"), "it won't slow *the giants*"),
        split(row("building", 3, label="the giants"), icon("gateShut", label="everyone else"), "pull up *the ladder*", at="pull"),
        full(hearing("senate_marcus.jpg", pill="gary marcus · ai scientist", focus="55% 35%"), "a scientist *at the table*", at="scientist")]},
    "h07": {"cuts": [
        split(icon("chip", label="technocracy"), icon("building", label="oligarchy", enter="oligarchy"), "two *big words*"),
        split(row("building", 3, label="a few companies"), phone("open", ask="is this news true?", askAt="pocket", replyAt="allowed"), "what your AI may *tell you*", at="few")]},
    "h08": {"cuts": [
        full(pieces([None, "yet", "piece", "built", "tried"]), "nobody has *banned* it. yet.")]},
    "h09": {"cuts": [
        full(pieces([None] * 5, snapAt="snap"), "who gets rich if they *snap*"),
        split(pieces([None] * 5, snapped=True), icon("people", mark="ok", markAt="beat", label="ordinary people", enter="ordinary"), "how people *won* before", at="ordinary")]},
}

LT = "US Senate, 16 May 2023"
CLIPS = {  # (file, from, to, plate[, plateAt]); from/to = first word start / last word end in the clip file. build.py adds the breathing room.
    "c01": ("senate_clone.mp4", 1.45, 6.02, f"An AI clone of Sen. Blumenthal's voice · {LT}", 0.6),
    "c02": ("senate_notmine.mp4", 1.48, 15.78, f"Sen. Richard Blumenthal · chair of the hearing · {LT}", 0.4),
    "c03": ("senate_fears.mp4", 1.36, 8.34, f"Sam Altman · head of OpenAI, maker of ChatGPT · {LT}", 0.3),
    "c04": ("senate_licence2.mp4", 2.12, 10.08, f"Sam Altman · asked how he would regulate AI · {LT}", 0.5),
    "c05": ("senate_marcus.mp4", 1.56, 10.96, f"Gary Marcus · AI scientist, New York University · {LT}", 3.9),
}

ORDER = "c01 h01 c02 h02 c03 h03 c04 h04 h05 h06 c05 h07 h08 h09"
ACTS = {"c01": "01 the ban"}

if __name__ == "__main__":
    beats, act = [], "01 the ban"
    for i in ORDER.split():
        act = ACTS.get(i, act)
        if i in CLIPS:
            f, a, z, plate, pa = CLIPS[i]
            beats.append({"id": i, "clip": {"src": A + f, "from": a, "to": z, "plate": plate, "plateAt": pa}})
            continue
        vo, say = VO[i]
        beats.append({"id": i, "vo": vo, **({"say": say} if say else {}), "shot": {**SHOTS[i], "act": act}})

    out = {"id": "ai-ban", "title": "THE COMING AI BAN · 2-min sample",
           "voice": {"engine": "kokoro", "name": "af_heart", "speed": 1.0},
           "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
           "beats": beats}
    (HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    words = sum(len(b.get("vo", "").split()) for b in beats)
    print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")
