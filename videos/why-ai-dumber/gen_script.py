"""Writes script.json for why-ai-dumber v2 (2026-10-13, ~1-min sample).
v1 owner notes: needs new designs / more visual diversity / smart metaphors, not the same icon grammar repeated; voice
needs to be clearly better; read any on-screen acronym aloud; try a real clip if the money rule allows one.
v2 answers each:
  - 3 new kit primitives built for this topic (design-system/themes/why-ai-dumber-v1.md superseded by v2 notes,
    VISUALS.md): `Loop` (a03, the self-feeding mechanism), `Copier` (a05, "a photocopy of a photocopy" — rare facts
    fade first as a picture, not a bar chart), `FieldCard` (a02/a02b, a spec-sheet of what's writing the internet).
  - Voice: Chatterbox (tools/tts_cb.py), not Kokoro af_heart — the owner's own verbatim complaint about af_heart
    ("robot blabla annoying", LEARNINGS 47-48) predates this sample; af_heart was the wrong choice for a v2 the
    owner asked to sound better. Per-beat `ex` varies (quiet beats low, the hook and the reveal higher) so the
    narrator isn't one flat level. a05/a06b/a08 rewritten to drop trailing clauses that made Kokoro's v1 take rise
    like a question on lines that are statements (voice_check.py flagged all three).
  - No real clip: checked media.ccc.de and YouTube for a CC-licensed talk specifically about model collapse / training
    on synthetic data; nothing both on-topic and verifiably CC/PD cleared the money rule (closest hits were either
    off-topic or had no recorded licence). Stays picture-led; flagged for a future pass once a real clip exists.
Edit SHOTS, rerun this file, then `python tools/tts_cb.py why-ai-dumber` and `python tools/build.py why-ai-dumber`."""
import json
from pathlib import Path

HERE = Path(__file__).parent


def split(L, R, cap=None, **kw):
    d = {"layout": "split", "L": L, "R": R, **kw}
    if cap: d["cap"] = cap
    return d


def full(hero, cap=None, **kw):
    d = {"layout": "full", "hero": hero, **kw}
    if cap: d["cap"] = cap
    return d


def icon(name, **kw): return {"v": "LineIcon", "surface": "bare", "name": name, **kw}
def bars(items, **kw): return {"v": "Bars", "surface": "bare", "bars": items, **kw}
def cal(year, **kw): return {"v": "CalendarCard", "surface": "bare", "year": year, **kw}
def loop(nodes, **kw): return {"v": "Loop", "surface": "bare", "nodes": nodes, **kw}
def copier(gens, **kw): return {"v": "Copier", "surface": "bare", "gens": gens, **kw}
def field(rows, **kw): return {"v": "FieldCard", "surface": "bare", "rows": rows, **kw}

NATURE = "nature · shumailov et al. · 24 jul 2024"
ILLUS = "illustration · based on nature, shumailov et al. 2024"

SHOTS = {
    "h00": full(icon("robot", mark="?", markAt="dumber", label="your ai", size=360),
                "your ai, *getting dumber*?"),
    "a01": split(icon("eye", label="you"),
                 icon("doc", mark="ok", markAt="reason", label="study"),
                 "a *real* reason"),
    "a02": full(field([{"label": "the internet", "value": "ai-written", "icon": "robot", "at": "internet"}],
                       kicker="the open web"),
                "ai *writes* the internet"),
    "a02b": full(field([{"label": "blog posts", "value": "ai", "icon": "robot", "at": "posts"},
                        {"label": "reviews", "value": "ai", "icon": "robot", "at": "reviews"},
                        {"label": "comments", "value": "ai", "icon": "robot", "at": "comments"}],
                        kicker="written by"),
                 "written by *ai*, not people"),
    "a03": full(loop([{"icon": "robot", "label": "ai writes"},
                      {"icon": "cloud", "label": "goes online", "at": "hosts"},
                      {"icon": "robot", "label": "trains again", "at": "trains"}],
                      loopAt="it#3"),
                "trained on *itself*"),
    "a04": split(cal("2024", plate=NATURE),
                 icon("doc", label="the experiment", labelAt="experiment"),
                 "the *study*, 2024"),
    "a05": full(copier(4, at="generations", every=22, plate=ILLUS),
                "*rare facts*, faded first"),
    "a06": split(icon("laptop", label="your tools"),
                 icon("person", mark="?", markAt="worse", label="you"),
                 "quietly *gets worse*"),
    "a06b": split(icon("shield", label="no hack"),
                  icon("person", mark="no", markAt="villain", label="no villain"),
                  "no *hack*, no villain"),
    "a07": split(icon("robot"),
                 icon("spiral", mark="no", markAt="collapse", label="model collapse", tAt="tail"),
                 "*model collapse*"),
    "a08": split(icon("robot", mark="?", markAt="worse", label="your ai"),
                 bars([{"v": 3, "t": "before", "c": "red"}, {"v": 1, "t": "now", "c": "red", "at": "worse"}]),
                 "now you know the *reason*"),
}

ACTS = [("01 the feeling", ["h00", "a01"]),
        ("02 the loop", ["a02", "a02b", "a03", "a04"]),
        ("03 the cost", ["a05", "a06", "a06b", "a07", "a08"])]
for act, ids in ACTS:
    for i in ids:
        SHOTS[i]["act"] = act

BEATS = [
    {"id": "h00", "vo": "Ever feel like your AI is getting a little dumber?", "ex": 0.55},
    {"id": "a01", "vo": "You are not imagining it. Researchers found a real reason.", "ex": 0.45},
    {"id": "a02", "vo": "AI itself is now writing huge parts of the internet.",
     "say": "AI itself | is now writing huge parts of the internet.", "ex": 0.5},
    {"id": "a02b", "vo": "Blog posts, product reviews, even comments: a lot of it is written by AI.",
     "say": "Blog posts, product reviews, even comments: || a lot of it is written by AI.", "ex": 0.55},
    {"id": "a03", "vo": "AI writes it, the internet hosts it, and the next model trains on it.", "ex": 0.6},
    {"id": "a04", "vo": "In 2024, Nature ran the experiment: feed a model only AI-made data, again and again.",
     "say": "In twenty twenty four, Nature ran the experiment: | feed a model only AI-made data, again and again.", "ex": 0.5},
    {"id": "a05", "vo": "Within a few generations, it forgot the real world. Rare, true facts were the first to go.",
     "say": "Within a few generations, it forgot the real world. || Rare, true facts were the first to go.", "ex": 0.6},
    {"id": "a06", "vo": "That means the tools you already rely on could quietly get worse, with nobody changing a thing.", "ex": 0.5},
    {"id": "a06b", "vo": "No hack. No villain. It happens on its own.",
     "say": "No hack. | No villain. | It happens on its own.", "ex": 0.5},
    {"id": "a07", "vo": "Scientists call it model collapse: the system quietly eating its own tail.", "ex": 0.65},
    {"id": "a08", "vo": "So the next time your AI feels a little worse, now you know the reason.",
     "say": "So the next time your AI feels a little worse | — now you know the reason.", "ex": 0.6},
]
for b in BEATS:
    b["shot"] = SHOTS[b["id"]]

out = {"id": "why-ai-dumber", "title": "WHY AI MODELS GET DUMBER · design-system v2 sample",
       "voice": {"engine": "chatterbox", "name": "chatterbox-fenrir", "ref": "assets/voice/narrator_ref.wav", "cfg": 0.35},
       "pace": {"lead": 0.15, "gap": 0.35, "min_beat": 2.2, "to_clip": 0.2, "after_clip": 0.3, "end_pad": 1.6},
       "master": "cinema",
       "beats": BEATS}
(HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(BEATS), "beats written")
