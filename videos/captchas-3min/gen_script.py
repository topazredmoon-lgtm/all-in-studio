"""Writes script.json for captchas-3min (owner-facing v6, 2026-10-07: "engaging like v23", then "no big text in an empty screen").
Words: the not-so-dark-times 3-min pilot (captchas-p2) is the spine, voiced lines reused as-is (Kokoro af_heart 0.95);
one new cold-open line (h00) before the WSJ clip, which plays from its first frame ("This is one of the guys who invented it").
Pictures: every beat is cut into short shots (`cuts`) that change on their cue word, about every 2–3 s like v23.
Every shot is a picture (most in the left/right split). No text, number or symbol is ever the picture: numbers and names are
small handwritten tags under the picture they belong to (`tag`). The caption (≤ 5 words, red keyword) is the only line of text.
`python tools/lint_text.py captchas-3min` fails any text-led shot (build.py runs it first).
Edit SHOTS, rerun this file, then `python tools/tts.py captchas-3min` (new lines only) and `python tools/build.py captchas-3min`."""
import json
from pathlib import Path

HERE = Path(__file__).parent
src = json.loads((HERE / "source_nsdt_p2_script.json").read_text(encoding="utf-8"))
C = "captchas/"

# The real reCAPTCHA "squares" challenge: one street photo cut 4 × 4 (traffic_1.jpg, 960 × 1536, square crop of 800 px).
# Squares with a light: 0 1 4 5 7 9 11. Square 10 holds only the edge of one light and the back of another: "that corner".
TL = {"img": C + "traffic_1.jpg", "iw": 960, "ih": 1536, "crop": {"x": 140, "y": 100, "s": 800}, "target": "traffic lights"}
PICKS = [0, 1, 4, 5, 9, 7, 11]
DONE = {"v": "Captcha4", "surface": "bare", **TL, "picks": PICKS, "pickAt": -60, "every": 0}
BLOG = {"img": C + "google_blog_2009_top.jpg", "iw": 2560, "ih": 1440}
WIKI = {"img": C + "wiki_duolingo.png", "iw": 2560, "ih": 1600}


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
def two(**kw): return {"v": "TwoWords", "surface": "bare", "a": "overlooks", "b": "inquiry", **kw}
def photo(img, plate, **kw): return {"v": "Photo", "surface": "bare", "img": C + img, "plate": plate, **kw}
def tag(t, at=0): return {"t": t, "at": at}


SHOTS = {
    "h00": {"cuts": [
        full({"v": "Captcha4", "surface": "bare", **TL, "picks": PICKS, "pickAt": "traffic", "every": 6}),
        full({**DONE, "ring": 10, "ringAt": "right"}, "simple, *right?*", at="Simple")],
        "sfx": [{"k": "click", "at": "traffic", "plus": 6 * i} for i in range(len(PICKS))]},
    "a02": split({**DONE, "ring": 10, "ringAt": "corner"},
                 {"v": "Square", "surface": "bare", **TL, "tile": 10, "mark": {"x": -0.04, "y": 0.0, "w": 0.2, "h": 0.98}, "at": "corner", "q": "count?", "qAt": "corner", "enter": "stared"},
                 "we've all stared at *that corner*"),
    "a03": {"cuts": [
        split(icon("doc", plate="uc irvine study · 2023"), {"v": "Checkbox", "surface": "bare"}, "researchers *added it up*"),
        split({**DONE, "tag": tag("819 million hours", "819"), "plate": "uc irvine · 2023"},
              icon("hourglass", tAt=0, tDur=150, tag=tag("90,000+ years", "90"), plate="our arithmetic · ÷ 8,766 h a year"), "on *reCAPTCHA* alone", at="819")]},
    "a04": full(photo("ch_v00_hand-on-mouse.jpg", "photo · nenad stojkovic · cc by 2.0", focus="50% 55%"), "someone put it to *work*"),
    "a05": full(photo("ch_b00_ia-book-scanner.jpg", "book scanner · dvortygirl · cc by-sa 4.0", focus="62% 50%", gray=True),
                "the *dark reality* of captchas", sfx=[{"k": "thud", "at": "dark"}]),
    "o01": {"cuts": [
        split({"v": "CalendarCard", "surface": "bare", "year": "2000"}, icon("envelope", at="Yahoo", label="yahoo mail", enter="Yahoo"), "*2000*, yahoo mail"),
        split(row("robot", 12, cols=4, every=3), row("envelope", 12, cols=4, every=3, at="millions"), "millions of *fake accounts*", at="Robots")]},
    "o02": {"cuts": [
        split(photo("ch_o01_cmu-cathedral-view.jpg", "carnegie mellon · dllu · cc by-sa 4.0", focus="50% 60%"), icon("desk", at="student"), "a first-year *phd student*"),
        full({"v": "Polaroid", "surface": "bare", "img": C + "luis_wikimania_2.jpg", "name": "luis von ahn", "focus": "50% 30%", "plate": "jarek tuszyński · cc by 4.0"}, "*luis von ahn*", at="His")]},
    "o03": split(icon("person", mark="ok", markAt="human", label="human"), icon("robot", mark="no", markAt="computer", label="computer", enter="test"), "humans pass, *machines fail*"),
    "o04": split({"v": "CalendarCard", "surface": "bare", "year": "2003"},
                 {"v": "TwoWords", "surface": "bare", "a": "captcha", "b": "", "only": "a", "enter": "name", "tag": tag("CAPTCHA", "CAPTCHA"), "plate": "von ahn, blum, hopper & langford · 2003"},
                 "it even had *a name*"),
    "o05": {"cuts": [
        split({"v": "Stopwatch", "surface": "bare", "secs": 10, "at": "10"}, {"v": "TwoWords", "surface": "bare", "a": "morning", "b": "upon"}, "*10 seconds* a puzzle"),
        full(row("cursor", 30, cols=10, every=1, tag=tag("200 million a day", "200"), plate="luis von ahn · ted 2011"), "*200 million* puzzles", at="200")],
        "sfx": [{"k": "click", "at": "puzzle"}]},
    "o06": full(row("hourglass", 63, cols=21, every=1, tag=tag("63 years, every day", "63"), plate="our arithmetic · 10 s × 200 million"),
                "of *human time*, every single day", sfx=[{"k": "thud", "at": "63"}]),
    "o06b": split({"v": "Polaroid", "surface": "bare", "img": C + "luis_talk.jpg", "focus": "50% 25%", "name": "on stage", "rotate": 2, "plate": "wikimania 2015 · wikimedia commons"},
                  {"v": "Bubble", "surface": "bare", "text": "so then I started *feeling bad*.", "at": "said", "px": 44, "by": "luis von ahn · ted 2011", "enter": "said"},
                  "it made him *feel bad*"),
    "o07": split(icon("person", mark="?", markAt="dangerous"), {"v": "Bubble", "surface": "bare", "text": "what if it did *real work*?", "at": "what", "px": 48}, "a *dangerous* question"),
    "b00": split({"v": "Checkbox", "surface": "bare", "clickAt": "box"}, two(enter="second", tag=tag("job 2", "second")), "the box got a *second job*",
                 sfx=[{"k": "click", "at": "box"}]),
    "b01": split(two(only="a", oneAt="test", ok=True, okAt="test"), two(only="b", twoAt="book", enter="other", reveal=True), "one test, *one book*"),
    "b02": {"cuts": [
        split(icon("robot", mark="?", markAt="missed", label="scanner"), icon("doc", tag=tag("30% missed", "30"), plate="luis von ahn · ted 2011"), "scanners missed *30%*"),
        split(icon("eye", mark="ok", markAt="didn"), two(), "your eyes *didn't*", at="Your")]},
    "b03": {"cuts": [
        split(two(only="a", ok=True, okAt="right"), two(only="b", twoAt="mystery", enter="guess"), "your guess *counts*"),
        full(row("person", 5, every=5, mark="ok"), "strangers *agree*", at="When"),
        split(icon("book"), two(only="b", ok=True, okAt="book"), "the book gets *its word*", at="book")]},
    "b04": full(row("person", 30, cols=10, every=1, tag=tag("1 billion+ people", "billion"), plate="luis von ahn · big think"), "one word *from a book*"),
    "b05": {"cuts": [
        split(icon("contract", mark="no", markAt="signed", label="signed up"), icon("coin", mark="no", markAt="paid", label="paid", enter="nobody#2"), "nobody *signed up*. nobody *got paid*."),
        split({"v": "Checkbox", "surface": "bare", "clickAt": "logging"}, icon("person"), "just *logging in*", at="everybody")],
        "sfx": [{"k": "click", "at": "logging"}]},
    "g01": {"cuts": [
        split({"v": "CalendarCard", "surface": "bare", "year": "2009"},
              {"v": "PageCrop", "surface": "bare", **BLOG, "crop": {"x": 260, "y": 150, "w": 1400, "h": 620}, "box": {"x": 296, "y": 626, "w": 1250, "h": 70}, "boxAt": "bought", "plate": "official google blog · sept 16, 2009", "enter": "Google"},
              "*2009*: google buys it"),
        full({"v": "PageCrop", "surface": "bare", **BLOG, "crop": {"x": 260, "y": 590, "w": 1460, "h": 700}, "box": {"x": 300, "y": 628, "w": 610, "h": 60}, "boxAt": "improve", "underline": True, "plate": "official google blog · 2009"},
             "*teaching computers* to read", at="words")]},
    "g02": {"cuts": [
        full({"v": "Receipt", "surface": "bare", "title": "reCAPTCHA", "k": "PRICE", "stamp": "undisclosed", "stampAt": "paid"}, "the price? *never said*"),
        split({"v": "PageCrop", "surface": "bare", **BLOG, "crop": {"x": 260, "y": 960, "w": 1460, "h": 420}, "box": {"x": 296, "y": 1234, "w": 640, "h": 56}, "boxAt": 6, "plate": "official google blog · 2009"},
              two(tag=tag("200 million a day"), plate="luis von ahn · ted 2011"), "what *came with it*", at="came")],
        "sfx": [{"k": "thud", "at": "paid", "plus": 8}]},
    "g04": {"cuts": [
        full({"v": "Polaroid", "surface": "bare", "img": C + "luis_wikimania_2.jpg", "focus": "50% 22%", "rotate": 2, "notes": [{"t": "same play", "at": "same"}, {"t": "again", "at": "again"}], "plate": "jarek tuszyński · cc by 4.0"}, "the *same play*, again"),
        split({"v": "CalendarCard", "surface": "bare", "year": "2011"},
              {"v": "PageCrop", "surface": "bare", **WIKI, "crop": {"x": 1390, "y": 700, "w": 660, "h": 900}, "box": {"x": 1405, "y": 1536, "w": 480, "h": 58}, "boxAt": "founded", "plate": "wikipedia · duolingo", "enter": "co"},
              "*2011*: duolingo", at="2011")]},
    "g05": {"cuts": [
        split(icon("desk"), {"v": "Translate", "surface": "bare", "at": "translated"}, "learners *translated* articles"),
        split({"v": "Translate", "surface": "bare", "at": -60}, icon("coin", tag=tag("CNN · BuzzFeed", "CNN"), plate="2013 deals · social media today"), "*CNN* and *BuzzFeed* paid", at="CNN")]},
    "g03": {"cuts": [
        full(row("book", 6, cols=3, every=3), "books were *only the beginning*"),
        full(photo("ch_r00_streetview-car-googleplex.jpg", "street view car · kowloonese · public domain", focus="40% 55%"), "next: *eyes on the street*", at="Next")]},
}

ACTS = [("01 the little box", ["h00", "a02", "a03", "a04", "a05", "o01", "o02", "o03", "o04", "o05", "o06", "o06b", "o07"]),
        ("02 the second job", ["b00", "b01", "b02", "b03", "b04", "b05"]),
        ("03 the buyer", ["g01", "g02", "g04", "g05", "g03"])]
for act, ids in ACTS:
    for i in ids:
        SHOTS[i]["act"] = act

beats = [{"id": "h00", "vo": "Select all squares with traffic lights. Simple, right?", "shot": SHOTS["h00"]}]
for b in src["beats"]:
    nb = {k: v for k, v in b.items() if k in ("id", "vo", "say", "clip")}
    if "clip" not in b:
        nb["shot"] = SHOTS[b["id"]]
    beats.append(nb)

beats_by_id = {b["id"]: b for b in beats}
# the WSJ clip cuts to a purple card at 8.8 s
beats_by_id["c01"]["clip"].update({"from": 0.0, "to": 8.78, "hold": 8.72, "plate": "Luis von Ahn · CAPTCHA co-inventor · The Wall Street Journal"})
beats_by_id["c02"]["clip"]["plate"] = "Vox · how reCAPTCHA read The New York Times archive"
beats_by_id["c03"]["clip"].update({"to": 12.4, "plate": "Luis von Ahn · on Google and the books · Big Think"})  # ends on "…all over the internet."

out = {"id": "captchas-3min", "title": "THE DARK REALITY OF CAPTCHAS · 3-min All-in sample", "pilot": True,
       "voice": src["voice"],
       # v23 pacing: no dead air between lines (was lead 0.5 / gap 1.1, about 40 s of silence in 3 min)
       "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 2.0},
       "beats": beats}
(HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
print(len(beats), "beats written")
