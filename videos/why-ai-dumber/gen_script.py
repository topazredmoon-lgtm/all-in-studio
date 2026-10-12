"""Writes script.json for why-ai-dumber (design-system v1 sample, 2026-10-13, 1-min, no real clip yet — see
design-system/themes/why-ai-dumber-v1.md for why). Picture-led, v23 + minimal-kit grammar, same voice/pace as ai-ban.
Every beat is one or two short shots; numbers are tags/plates, never the picture. One sourced fact (SOURCES.md):
Shumailov et al., Nature 2024, "AI models collapse when trained on recursively generated data."
Edit SHOTS, rerun this file, then `python tools/tts.py why-ai-dumber` and `python tools/build.py why-ai-dumber`."""
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
def row(name, n, **kw): return {"v": "IconRow", "surface": "bare", "name": name, "n": n, **kw}
def bars(items, **kw): return {"v": "Bars", "surface": "bare", "bars": items, **kw}
def flow(nodes, **kw): return {"v": "Flow", "surface": "bare", "nodes": nodes, **kw}
def cal(year, **kw): return {"v": "CalendarCard", "surface": "bare", "year": year, **kw}
def tag(t, at=0): return {"t": t, "at": at}


NATURE = "nature · shumailov et al. · 24 jul 2024"
ILLUS = "illustration · based on nature, shumailov et al. 2024"

SHOTS = {
    "h00": split(icon("robot", mark="?", markAt="dumber", label="your ai"),
                 bars([{"v": 3, "t": "before", "c": "red"}, {"v": 1, "t": "now", "c": "red", "at": "dumber"}]),
                 "your ai, *getting dumber*?"),
    "a01": split(icon("eye", label="you"),
                 icon("doc", mark="ok", markAt="reason", label="study"),
                 "a *real* reason"),
    "a02": full(row("robot", 6, cols=6, every=3, tag=tag("more of the web", "internet")),
                "ai *writes* the internet"),
    "a02b": full(row("doc", 5, cols=5, every=3, tag=tag("posts · reviews", "written")),
                 "written by *ai*, not people"),
    "a03": full(flow([{"icon": "robot", "label": "ai writes"},
                      {"icon": "cloud", "label": "goes online", "at": "internet"},
                      {"icon": "robot", "label": "next model", "at": "model"}]),
                "trained on *itself*"),
    "a04": split(cal("2024", plate=NATURE),
                 row("robot", 4, cols=4, every=6, decay=True, at="nature", plate=NATURE),
                 "the *study*, 2024"),
    "a05": full(bars([{"v": 4, "t": "gen 1", "c": "red"}, {"v": 3, "t": "gen 2", "c": "red"},
                      {"v": 1.5, "t": "gen 3", "c": "red"}, {"v": 0.3, "t": "gen 4", "c": "red", "at": "vanished"}],
                      plate=ILLUS),
                "*rare facts*, vanished"),
    "a06": split(icon("laptop", label="your tools"),
                 icon("person", mark="?", markAt="worse", label="you"),
                 "quietly *gets worse*"),
    "a06b": split(icon("shield", label="no hack"),
                  icon("person", label="no one to blame"),
                  "not *anyone's* fault"),
    "a07": split(icon("robot"),
                 icon("brain", mark="no", markAt="collapse", label="model collapse"),
                 "*model collapse*"),
    "a08": split(icon("robot", mark="?", markAt="worse", label="your ai"),
                 bars([{"v": 3, "t": "before", "c": "red"}, {"v": 1, "t": "now", "c": "red", "at": "worse"}]),
                 "*now you know* why"),
}

ACTS = [("01 the feeling", ["h00", "a01"]),
        ("02 the loop", ["a02", "a02b", "a03", "a04"]),
        ("03 the cost", ["a05", "a06", "a06b", "a07", "a08"])]
for act, ids in ACTS:
    for i in ids:
        SHOTS[i]["act"] = act

BEATS = [
    {"id": "h00", "vo": "Ever feel like your AI is getting a little dumber?"},
    {"id": "a01", "vo": "You are not imagining it. Researchers found a real reason."},
    {"id": "a02", "vo": "AI is now writing huge parts of the internet itself."},
    {"id": "a02b", "vo": "Blog posts, product reviews, even comments. A lot of it, written by AI, not people."},
    {"id": "a03", "vo": "AI writes it, the internet hosts it, and the next model trains on it."},
    {"id": "a04", "vo": "In 2024, Nature ran the experiment: feed a model only AI-made data, again and again.",
     "say": "In twenty twenty four, Nature ran the experiment: feed a model only AI-made data, again and again."},
    {"id": "a05", "vo": "Within a few generations, it forgot the real world. Rare, true facts vanished first."},
    {"id": "a06", "vo": "That means the tools you already rely on could quietly get worse, with nobody changing a thing."},
    {"id": "a06b", "vo": "It is not a hack, and it is not anyone's fault on purpose."},
    {"id": "a07", "vo": "Scientists call it model collapse: the system quietly eating its own tail."},
    {"id": "a08", "vo": "So next time your AI feels a little worse, now you know why."},
]
for b in BEATS:
    b["shot"] = SHOTS[b["id"]]

out = {"id": "why-ai-dumber", "title": "WHY AI MODELS GET DUMBER · design-system v1 sample",
       "voice": {"engine": "kokoro", "name": "af_heart", "speed": 1.0},
       "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
       "beats": BEATS}
(HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(BEATS), "beats written")
