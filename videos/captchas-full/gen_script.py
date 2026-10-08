"""Writes script.json for captchas-full: the 8-min film (2026-10-08). Quality bar: captchas-3min v6 (owner-approved).
Words: the not-so-dark-times captchas-full script (the owner likes it) is the spine, voiced as-is (Kokoro af_heart 0.95),
plus the strongest beats of v23 (captchas_v23_PERFECTED: the solving-farm room, the fingerprint, "proving you are you",
the classroom ending). Clips (2026-10-08, owner: "put clips back, many of them"): 18 real clips break the narration about
every 20-40 s: the original WSJ / Vox / Big Think excerpts (short, commented, credited; Content ID risk accepted, see
design-system/CLIPS.md) and CC clips (von Ahn at Wikimania 2015, Google's own reCAPTCHA v3 video) in place of TED.
Licences and per-clip risk: LICENCES.md.
Pictures: v6 rules. Every shot is a picture; numbers and names are small red tags under it; caption ≤ 5 words;
beats cut on cue words every 2–3 s; left/right split by default; no music.
Edit SHOTS / NEW, rerun, then `python tools/tts.py captchas-full` and `python tools/build.py captchas-full`."""
import json
from pathlib import Path

HERE = Path(__file__).parent
src = json.loads((HERE / "source_nsdt_full_script.json").read_text(encoding="utf-8"))
C = "captchas/"

# ---------------------------------------------------------------- the photos (all logged in LICENCES.md)
# Darwin traffic light, Dietmar Rabich, CC BY-SA 4.0 (= traffic_1.jpg, pixel-identical). One photo cut 4 × 4, as reCAPTCHA does.
TL = {"img": C + "traffic_1.jpg", "iw": 960, "ih": 1536, "crop": {"x": 140, "y": 100, "s": 800}, "target": "traffic lights"}
PICKS = [0, 1, 4, 5, 9, 7, 11]
DONE = {"v": "Captcha4", "surface": "bare", **TL, "picks": PICKS, "pickAt": -60, "every": 0}
BUS = {"img": C + "cc_bus_nyc.jpg", "iw": 1920, "ih": 1440, "crop": {"x": 460, "y": 440, "s": 1000}, "target": "buses"}
CROSS = {"img": C + "cc_cross_sf.jpg", "iw": 1920, "ih": 1440, "crop": {"x": 300, "y": 240, "s": 1200}, "target": "crosswalks"}
HYD = {"img": C + "cc_hydrant_miami.jpg", "iw": 1920, "ih": 1440, "crop": {"x": 480, "y": 380, "s": 1000}, "target": "fire hydrants"}
HYB = {"img": C + "cc_hydrant_bywater.jpg", "iw": 1280, "ih": 1707, "crop": {"x": 64, "y": 620, "s": 800}, "target": "fire hydrants"}  # col 3 starts at the cap rim (sliver in tile 3); row 3 holds only the foot (tile 14)
TL2 = {**TL, "crop": {"x": 0, "y": 0, "s": 900}}
BLOG = {"img": C + "google_blog_2009_top.jpg", "iw": 2560, "ih": 1440}
WIKI = {"img": C + "wiki_duolingo.png", "iw": 2560, "ih": 1600}
LUIS1 = C + "cc_luis_wm1.jpg"      # Jarek Tuszyński, CC BY 4.0
LUIS2 = C + "luis_wikimania_2.jpg"  # Jarek Tuszyński, CC BY 4.0
LUIS3 = C + "cc_luis_case.jpg"      # Daniel Case, CC BY-SA 3.0


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
def cap4(spec, **kw): return {"v": "Captcha4", "surface": "bare", **spec, **kw}
def pol(img, plate, **kw): return {"v": "Polaroid", "surface": "bare", "img": img, "plate": plate, **kw}
def cal(year, **kw): return {"v": "CalendarCard", "surface": "bare", "year": year, **kw}
def bubble(text, **kw): return {"v": "Bubble", "surface": "bare", "text": text, **kw}
def flow(nodes, **kw): return {"v": "Flow", "surface": "bare", "nodes": nodes, **kw}
def tag(t, at=0): return {"t": t, "at": at}


SHOTS = {
    # ================================================================ 01 the little box (v6 shots, clips replaced)
    "h00": {"cuts": [
        full(cap4(TL, picks=PICKS, pickAt="traffic", every=6)),
        full({**DONE, "ring": 10, "ringAt": "right"}, "simple, *right?*", at="Simple")],
        "sfx": [{"k": "click", "at": "traffic", "plus": 6 * i} for i in range(len(PICKS))]},
    "c01r": {"cuts": [
        full(pol(LUIS1, "jarek tuszyński · cc by 4.0", focus="50% 30%", rotate=-2, notes=[{"t": "co-inventor", "at": "invented"}, {"t": "fails them too", "at": "fails"}]),
             "not even *its inventor*"),
        full({**DONE, "ring": 10, "ringAt": "corner"}, "a *tiny corner*", at="never")]},
    "a02": split({**DONE, "ring": 10, "ringAt": -30},
                 {"v": "Square", "surface": "bare", **TL, "tile": 10, "mark": {"x": -0.04, "y": 0.0, "w": 0.2, "h": 0.98}, "at": "corner", "q": "count?", "qAt": "corner", "enter": "stared", "reveal": True},
                 "we've all stared at *that corner*"),
    "a03": {"cuts": [
        split(icon("doc", plate="uc irvine study · 2023"), {"v": "Checkbox", "surface": "bare"}, "researchers *added it up*"),
        split({**DONE, "tag": tag("819 million hours", "819"), "plate": "uc irvine · 2023"},
              icon("hourglass", tAt=0, tDur=150, tag=tag("90,000+ years", "90"), plate="our arithmetic · ÷ 8,766 h a year"), "on *reCAPTCHA* alone", at="819")]},
    "a04": full(photo("ch_v00_hand-on-mouse.jpg", "photo · nenad stojkovic · cc by 2.0", focus="50% 55%"), "someone put it to *work*"),
    "a05": full(photo("ch_b00_ia-book-scanner.jpg", "book scanner · dvortygirl · cc by-sa 4.0", focus="62% 50%", gray=True),
                "the *dark reality* of captchas", sfx=[{"k": "thud", "at": "dark"}]),
    "a05b": split(icon("person", mark="?", markAt="who"), icon("cash", at="cashed", label="cashed in"), "who *cashed in?*"),
    "o01": {"cuts": [
        split(cal("2000"), icon("envelope", at="Yahoo", label="yahoo mail", enter="Yahoo"), "*2000*, yahoo mail"),
        split(row("robot", 12, cols=4, every=3), row("envelope", 12, cols=4, every=3, at="millions"), "millions of *fake accounts*", at="Robots")]},
    "o02": {"cuts": [
        split(photo("ch_o01_cmu-cathedral-view.jpg", "carnegie mellon · dllu · cc by-sa 4.0", focus="50% 60%"), icon("desk", at="student"), "a first-year *phd student*"),
        full(pol(C + "luis_wikimania_2.jpg", "jarek tuszyński · cc by 4.0", name="luis von ahn", focus="50% 30%"), "*luis von ahn*", at="His")]},
    "o03": split(icon("person", mark="ok", markAt="human", label="human"), icon("robot", mark="no", markAt="computer", label="computer", enter="test"), "humans pass, *machines fail*"),
    "o04": split(cal("2003"),
                 {"v": "TwoWords", "surface": "bare", "a": "captcha", "b": "", "only": "a", "enter": "name", "plate": "von ahn, blum, hopper & langford · 2003",
                  "expand": "Completely Automated Public Turing test to tell Computers and Humans Apart", "expandAt": "Completely", "expandEndAt": "Apart"},
                 "it even had *a name*"),
    "o05": {"cuts": [
        split({"v": "Stopwatch", "surface": "bare", "secs": 10, "at": "10"}, {"v": "TwoWords", "surface": "bare", "a": "morning", "b": "upon"}, "*10 seconds* a puzzle"),
        full(row("cursor", 30, cols=10, every=1, tag=tag("200 million a day", "200"), plate="luis von ahn · ted 2011"), "*200 million* puzzles", at="200")],
        "sfx": [{"k": "click", "at": "puzzle"}]},
    "o06": full(row("hourglass", 63, cols=21, every=1, tag=tag("63 years, every day", "63"), plate="our arithmetic · 10 s × 200 million"),
                "of *human time*, every single day", sfx=[{"k": "thud", "at": "63"}]),
    "o06b": split(pol(LUIS3, "daniel case · cc by-sa 3.0", focus="50% 22%", name="on stage", rotate=2),
                  bubble("so then I started *feeling bad*.", at="said", px=44, by="luis von ahn · ted 2011", enter="said"),
                  "it made him *feel bad*"),
    "o07": split(icon("person", mark="?", markAt="dangerous"), bubble("what if it did *real work*?", at="what", px=48), "a *dangerous* question"),
    # ================================================================ 02 the second job
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
    "c02r": {"cuts": [
        split(icon("newspaper", label="nyt archive"), icon("eye", mark="ok", markAt="through"), "even *the new york times*"),
        full(row("newspaper", 24, cols=8, every=2, tag=tag("1 year every 4 days", "four"), plate="vox · why captchas are getting harder"), "*a year* every four days", at="About")]},
    "c02a": split(icon("book", label="books"), icon("newspaper", label="newspapers", enter="just"), "and *not just books*"),
    "c07a": full({"v": "Labels", "surface": "bare", "img": C + "cc_cross_sf.jpg", "iw": 1920, "ih": 1440, "boxes": [
            {"x": 0.44, "y": 0.45, "w": 0.21, "h": 0.12, "t": "bus", "at": "square"},
            {"x": 0.60, "y": 0.52, "w": 0.12, "h": 0.11, "t": "car", "at": "label"},
            {"x": 0.19, "y": 0.47, "w": 0.09, "h": 0.22, "t": "person", "at": "label", "plus": 6}], "plate": "photo · alfred twu · cc0"},
         "every square, *a label*"),
    "b05": {"cuts": [
        split(icon("contract", mark="no", markAt="signed", label="signed up"), icon("coin", mark="no", markAt="paid", label="paid", enter="nobody#2"), "nobody *signed up*. nobody *got paid*."),
        split({"v": "Checkbox", "surface": "bare", "clickAt": "logging"}, icon("person"), "just *logging in*", at="everybody")],
        "sfx": [{"k": "click", "at": "logging"}]},
    "b06": {"cuts": [
        split(two(only="a", a="Christians"), two(only="b", b="xxxxxx", redact=True, enter="random"), "random words, *random pairs*"),
        split(pol(LUIS1, "jarek tuszyński · cc by 4.0", focus="50% 25%", rotate=-3), two(only="a", a="Christians", oneAt="Christians", ok=True, okAt="Harmless"), "the scanned word: *harmless*", at="tells"),
        full(two(a="Christians", b="xxxxxx", redact=True, twoAt="much"), "the other? *not so much*", at="random#2")]},
    "b06b": split(icon("church", label="kingdom of god"), two(a="Christians", b="xxxxxx", redact=True), "on *that* website"),
    # ================================================================ 03 the buyer
    "g01": {"cuts": [
        split(cal("2009"),
              {"v": "PageCrop", "surface": "bare", **BLOG, "crop": {"x": 260, "y": 150, "w": 1400, "h": 620}, "box": {"x": 296, "y": 626, "w": 1250, "h": 70}, "boxAt": "bought", "plate": "official google blog · sept 16, 2009", "enter": "Google"},
              "*2009*: google buys it"),
        full({"v": "PageCrop", "surface": "bare", **BLOG, "crop": {"x": 260, "y": 590, "w": 1460, "h": 700}, "box": {"x": 300, "y": 628, "w": 610, "h": 60}, "boxAt": "improve", "underline": True, "plate": "official google blog · 2009"},
             "*teaching computers* to read", at="words")]},
    "g02": {"cuts": [
        full({"v": "Receipt", "surface": "bare", "title": "reCAPTCHA", "k": "PRICE", "stamp": "undisclosed", "stampAt": "paid"}, "the price? *never said*"),
        split({"v": "PageCrop", "surface": "bare", **BLOG, "crop": {"x": 260, "y": 960, "w": 1460, "h": 420}, "box": {"x": 296, "y": 1234, "w": 640, "h": 56}, "boxAt": 6, "plate": "official google blog · 2009"},
              two(tag=tag("200 million a day"), plate="luis von ahn · ted 2011"), "what *came with it*", at="came")],
        "sfx": [{"k": "thud", "at": "paid", "plus": 8}]},
    "c03r": {"cuts": [
        full(photo("ch_b00_ia-book-scanner.jpg", "book scanner · dvortygirl · cc by-sa 4.0", focus="30% 40%"), "*by luis's count*"),
        full(row("book", 40, cols=10, every=1, tag=tag("2 million books a year", "million"), plate="luis von ahn · big think"), "*two million books* a year", at="2")]},
    "g04": {"cuts": [
        full(pol(LUIS2, "jarek tuszyński · cc by 4.0", focus="50% 22%", rotate=2, notes=[{"t": "same play", "at": "same"}, {"t": "again", "at": "again"}]), "the *same play*, again"),
        split(cal("2011"),
              {"v": "PageCrop", "surface": "bare", **WIKI, "crop": {"x": 1390, "y": 700, "w": 660, "h": 900}, "box": {"x": 1405, "y": 1536, "w": 480, "h": 58}, "boxAt": "founded", "plate": "wikipedia · duolingo", "enter": "co"},
              "*2011*: duolingo", at="2011")]},
    "g05": {"cuts": [
        split(icon("desk"), {"v": "Translate", "surface": "bare", "at": "translated"}, "learners *translated* articles"),
        split({"v": "Translate", "surface": "bare", "at": -60}, icon("coin", tag=tag("CNN · BuzzFeed", "CNN"), plate="2013 deals · social media today"), "*CNN* and *BuzzFeed* paid", at="CNN")]},
    "g03": {"cuts": [
        full(row("book", 6, cols=3, every=3), "books were *only the beginning*"),
        full(photo("ch_r00_streetview-car-googleplex.jpg", "street view car · kowloonese · public domain", focus="40% 55%"), "next: *eyes on the street*", at="Next")]},
    "g05b": split(icon("person", label="students", mark="?", markAt="practicing"), icon("newspaper", at="news", label="the news", reveal=True), "they were *translating the news*"),
    # ================================================================ 04 eyes on the street
    "m01a": split(two(only="a", a="reading", ok=True, okAt="free"), icon("robot", label="ocr", mark="ok", markAt="learning"), "the computers *were learning*"),
    "m01": {"cuts": [
        split(cal("2014"), {"v": "TwoWords", "surface": "bare", "a": "hard", "b": "", "only": "a", "warp": 1.8}, "google's *hardest* text"),
        split(icon("person", label="humans"), {"v": "Bars", "surface": "bare", "bars": [{"v": 33, "t": "humans 33%", "at": "right"}, {"v": 99.8, "t": "ai 99.8%", "at": "AI", "c": "teal"}], "plate": "humans: vox · ai: goodfellow et al. 2014"},
              "the ai: *99.8%*", at="Humans")]},
    "m02": {"cuts": [
        split(two(only="a", ok=False, okAt="go"), icon("robot", mark="ok", markAt="go"), "the words *had to go*"),
        full(photo("cc_hydrant_miami.jpg", "photo · infrogmation of new orleans · cc by 2.0", focus="50% 40%"), "straight *off the street*", at="first"),
        split(icon("car", label="street view"), {"v": "HouseNumber", "surface": "bare", "n": "1427", "at": "House"}, "blurry *house numbers*", at="Blurry")]},
    "m03b": {"cuts": [
        split(pol(LUIS3, "daniel case · cc by-sa 3.0", focus="50% 20%", rotate=-2), icon("camera", at="pictures"), "then came *pictures*"),
        split(icon("person", mark="?", markAt="type"), {"v": "PhotoType", "surface": "bare", "img": C + "cc_bus_nyc.jpg", "focus": "62% 55%", "text": "a bus", "typeAt": "type"}, "type *what you see*", at="Show")]},
    "c13r": split(icon("person", mark="no", markAt="spell"), {"v": "PhotoType", "surface": "bare", "img": C + "cc_bus_nyc.jpg", "focus": "62% 55%", "text": "a buss", "typeAt": -40, "wrongAt": "spell"},
                  "people *couldn't spell*"),
    "m03": {"cuts": [
        full(cap4(BUS, picks=[4, 5, 6, 7], pickAt="click", every=5), "nobody types. *you click*")],
        "sfx": [{"k": "click", "at": "click", "plus": 5 * i} for i in range(8)]},
    "m04": {"cuts": [
        split(cap4(BUS, picks=[4, 5, 6, 7], pickAt=-60, every=0), cap4(CROSS, enter="Crosswalks"), "*buses*. *crosswalks*."),
        split(cap4(TL2), cap4(HYD, enter="Fire"), "*traffic lights*. *hydrants*.", at="Traffic"),
        split(photo("cc_cross_sf.jpg", "photo · alfred twu · cc0", focus="50% 60%"), icon("flag", at="look", label="u.s. streets"), "weirdly *american*", at="Ever")]},
    "m05": {"cuts": [
        split(icon("car"), icon("camera"), "what *a car's camera* sees"),
        split(cal("2007"), photo("ch_r00_streetview-car-googleplex.jpg", "street view car · kowloonese · public domain", focus="70% 40%", enter="Street"), "*street view*, 2007", at="And")]},
    "c07r": {"cuts": [
        full({"v": "Labels", "surface": "bare", "img": C + "cc_cross_sf.jpg", "iw": 1920, "ih": 1440, "boxes": [
            {"x": 0.44, "y": 0.45, "w": 0.21, "h": 0.12, "t": "bus", "at": "square"},
            {"x": 0.60, "y": 0.52, "w": 0.12, "h": 0.11, "t": "car", "at": "label"},
            {"x": 0.19, "y": 0.47, "w": 0.09, "h": 0.22, "t": "person", "at": "label", "plus": 6}], "plate": "photo · alfred twu · cc0"},
             "every square, *a label*"),
        split(icon("car", mark="ok", markAt="looking"), icon("eye", at="camera"), "teaching a car *to see*", at="Labels"),
        split(icon("pin"), icon("map", at="date", plate="vox · why captchas are getting harder"), "and *google maps*", at="And")]},
    "m06": {"cuts": [
        # owner note 2026-10-08: the old crop ringed a tile full of hydrant; now the ringed tiles hold only a sliver
        full(cap4(HYB, picks=[1, 2, 5, 6, 9, 10], pickAt=0, every=5, ring=3, ringAt="hydrant"), "the famous *fire hydrant*"),
        split(cap4(HYB, picks=[1, 2, 5, 6, 9, 10], pickAt=-60, every=0, ring=3, ringAt=-40),
              {"v": "Square", "surface": "bare", **HYB, "tile": 3, "mark": {"x": 0.0, "y": 0.0, "w": 0.42, "h": 0.58}, "at": -20, "q": "this sliver?", "qAt": -10},
              "does *that sliver* count?", at="sliver"),
        split(cap4(HYB, picks=[1, 2, 5, 6, 9, 10], pickAt=-60, every=0, ring=14, ringAt=-40),
              {"v": "Square", "surface": "bare", **HYB, "tile": 14, "mark": {"x": 0.02, "y": 0.0, "w": 0.96, "h": 0.62}, "at": "base", "q": "the base?", "qAt": "base", "enter": "What"},
              "what about *the base?*", at="What")]},
    "c08r": {"cuts": [
        split({"v": "Square", "surface": "bare", **HYB, "tile": 14, "mark": {"x": 0.0, "y": 0.0, "w": 0.6, "h": 0.5}, "at": -30}, icon("doc", mark="?", markAt="no"), "there is *no right answer*"),
        full(row("person", 10, cols=5, every=3, marks=["ok", "ok", "no", "ok", "ok", "ok", "no", "ok", "ok", "ok"], tag=tag("most people decide", "most"), plate="via the wall street journal"),
             "*most people* decide", at="right#2")]},
    "m07": {"cuts": [
        full(row("checkbox", 12, cols=4, every=2), "decided *by votes*"),
        full({"v": "Outline", "surface": "bare", "img": C + "cc_hydrant_bywater.jpg", "iw": 1280, "ih": 1707, "crop": {"x": 60, "y": 420, "s": 1100},
              "box": {"x": 300, "y": 560, "w": 470, "h": 820}, "at": "ends", "plate": "photo · infrogmation of new orleans · cc by 2.0"},
             "where *the hydrant ends*", at="Where")]},
    # ================================================================ 05 the product
    "k00": {"cuts": [
        split({"v": "Checkbox", "surface": "bare"}, icon("box", at="public"), "the model *went public*"),
        split(row("grid", 9, cols=3, every=2), icon("box", at="product", mark="ok", markAt="product"), "your clicks, *a product*", at="Your")]},
    "k01": {"cuts": [
        split(cal("2020"), icon("cloud", at="Cloudflare", label="cloudflare"), "*2020*: cloudflare"),
        full(flow([{"icon": "checkbox", "label": "recaptcha"}, {"icon": "checkbox2", "label": "hcaptcha", "at": "rival"}], plate="cloudflare blog · april 2020"), "switched to *a rival*", at="moved")]},
    "k01b": split(icon("checkbox"), icon("cash", at="buyer", label="new buyer", reveal=True), "same clicks, *new buyer*"),
    "k02": {"cuts": [
        split(icon("building", label="companies"), icon("cash", at="pay", label="pay"), "companies *pay*"),
        split(icon("browser", label="websites"), icon("coin", at="cut", label="a cut"), "websites *get a cut*", at="Websites"),
        split(icon("person", label="you", mark="no", markAt="labeling"), row("grid", 9, cols=3, every=2, at="labeling", plate="cloudflare blog · 2020"), "*you* do the labeling", at="And")]},
    "k02b": split(row("grid", 9, cols=3, every=0), icon("cash", at="pays", label="dataset", reveal=True), "*someone else* pays"),
    "k03": {"cuts": [
        split(icon("cloud", label="cloudflare"), icon("cursor", at="clicking", label="clicking"), "cloudflare *did the math*"),
        full(row("person", 6, cols=6, every=4, tag=tag("500 years a day", "500"), plate="cloudflare · 2021 estimate"), "*500 years* a day", at="Humanity"),
        split(icon("person"), icon("clock", tAt="four", tag=tag("every 4 hours", "four"), plate="our arithmetic"), "*a lifetime* every four hours", at="That")]},
    # ================================================================ 06 the workaround
    "u00": {"cuts": [
        split(icon("robot", mark="no", markAt="lost"), icon("gateShut"), "the bots *never lost*"),
        split(icon("robot"), icon("person", at="Humans", mark="ok", markAt="Humans"), "the workaround: *humans*", at="They")]},
    "u01": {"cuts": [
        full(row("worker", 12, cols=6, every=3), "captcha-solving *farms*"),
        split(icon("robot", label="bots"), icon("worker", mark="ok", markAt="day"), "solving *for bots*, all day", at="bots")]},
    "u01b": {"cuts": [
        full(row("monitor", 18, cols=6, every=2), "picture *the room*"),
        split(cap4(BUS, picks=[4, 5, 6, 7], pickAt="refreshing", every=3), cap4(CROSS, picks=[12, 13, 14, 15], pickAt="refreshing", every=3), "*refreshing* every few seconds", at="Buses"),
        split(icon("worker", mark="?", markAt="tested"), icon("cash", at="paid", reveal=True), "not tested. *paid*.", at="Nobody")]},
    "u02": {"cuts": [
        split(row("grid", 40, cols=10, every=1), icon("cash", at="50", tag=tag("$0.50 per 1,000", "50"), plate="anti-captcha.com · 2026"), "*fifty cents* a thousand"),
        split(icon("grid", label="one puzzle"), icon("coin", at="20", tag=tag("1/20 of a cent", "20"), plate="our arithmetic"), "*a 20th of a cent*", at="that")]},
    "u02b": full(row("checkbox", 30, cols=10, every=1, tag=tag("$5 ≈ 10,000 answers", "few"), plate="our arithmetic · $0.50 per 1,000"), "*thousands* of human answers"),
    "u03": full(flow([{"icon": "robot", "label": "bot", "at": 0}, {"icon": "grid", "label": "puzzle", "at": "forwards"}, {"icon": "worker", "label": "worker", "at": "worker"},
                      {"icon": "gateOpen", "label": "in", "at": "walks"}]), "the bot *walks right in*"),
    # ================================================================ 07 the invisible test
    "v00": split(icon("eye", mark="no", markAt="see"), {"v": "Checkbox", "surface": "bare"}, "you *can't see* the test"),
    "v01": split(cal("2014"), {"v": "Checkbox", "surface": "bare", "clickAt": "click"}, "the click *was never the point*", sfx=[{"k": "click", "at": "click"}]),
    "c09r": {"cuts": [
        full({"v": "MousePath", "surface": "bare", "humanAt": "watches", "pauses": True}, "it *watches* how you get there"),
        split(icon("cursor", label="pause"), icon("clock", at="hesitate", tAt="hesitate"), "how long you *hesitate*", at="Where")]},
    "v02": full({"v": "MousePath", "surface": "bare", "humanAt": -60, "botAt": "bot"}, "human *wobble*, bot *line*"),
    "v03": split(cal("2018"), icon("grid", mark="no", markAt="drop", label="no puzzle"), "version 3: *no puzzle*"),
    "v03b": {"cuts": [
        split(icon("laptop"), {"v": "PageQuote", "surface": "bare", "text": "collecting hardware and *software information*", "at": "hardware", "plate": "google recaptcha terms"}, "google's *own terms*"),
        full(icon("fingerprint"), "a *fingerprint*", at="Put")]},
    "v04": {"cuts": [
        split(icon("shield", label="vpn"), {"v": "Score", "surface": "bare", "v1": 0.9, "v2": 0.3, "at": -30, "dropAt": "VPN"}, "privacy *lowers your score*"),
        split(icon("cookie", at="cookies", label="fresh cookies"), icon("robot", mark="?", markAt="bot"), "you look *like a bot*", at="Fresh")]},
    "v05": split(icon("person", label="you"), {"v": "Blocked", "surface": "bare", "at": "robot", "noAt": "appeal"}, "*no appeal* button"),
    "v05b": full({"v": "Captcha4", "surface": "bare", **TL2, "picks": [0, 4, 8], "pickAt": "clicking", "every": 6, "wrong": 9, "wrongAt": "again", "button": "VERIFY"}, "locked out, *clicking again*"),
    # ================================================================ 08 who cashed in
    "r00": split(icon("person", mark="?", markAt="Remember"), icon("cash", label="who?"), "*who cashed in?*"),
    "r00b": {"cuts": [
        split(icon("doc", label="uc irvine", plate="uc irvine study · 2023"), {"v": "Checkbox", "surface": "bare"}, "the *uc irvine* study"),
        full(row("checkbox", 40, cols=10, every=1, tag=tag("512 billion+ sessions", "512"), plate="searles, prapty & tsudik · uc irvine"), "*512 billion* sessions", at="It")]},
    "r01": {"cuts": [
        split(icon("hourglass", tAt=0, tDur=90, tag=tag("819 million hours", "819")), icon("doc", plate="uc irvine · 2023"), "those *819 million hours*"),
        full(row("cash", 24, cols=8, every=2, tag=tag("$6.1 billion unpaid", "$6"), plate="uc irvine estimate · arxiv 2311.10911"), "*$6.1 billion* of free labor", at="About")]},
    "r02": split(icon("doc", mark="no", markAt="They"), bubble("a tracking cookie farm *for profit*", at="tracking", px=40, by="uc irvine study · 2023"), "their *verdict*"),
    "r03": {"cuts": [
        split(icon("building", label="google"), bubble("not used for *personalized ads*", at="isn", px=40, by="google · recaptcha about page"), "google says *no ads*"),
        split(icon("person", mark="?", markAt="decide", label="you"), icon("doc", label="the study"), "*you decide*", at="You")]},
    "r03b": split(icon("person", label="customer", mark="no", markAt="customer"), icon("box", at="product", label="product", reveal=True), "you were *the product*"),
    "r04": {"cuts": [
        split(icon("robot", mark="ok", markAt="pass"), icon("person", mark="no", markAt="we"), "bots pass *better than we do*"),
        full(cap4(TL2, picks=[0, 1, 4, 5, 8], pickAt="every", every=3), "*every single time*", at="Sometimes")]},
    "c10r": {"cuts": [
        split(cal("2024"), icon("robot", at="researchers", label="zurich bot"), "*2024*: a bot from zurich"),
        split(icon("robot", mark="ok", markAt="100"), cap4(CROSS, picks=[8, 9, 10, 11, 12, 13, 14, 15], pickAt="solved", every=2, tag=tag("100% solved", "100"), plate="plesner et al. · eth zurich · 2024"),
              "*100%* of the puzzles", at="solved")],
        "sfx": [{"k": "click", "at": "solved", "plus": 2 * i} for i in range(8)]},
    # ================================================================ 09 the ending
    "f00": {"cuts": [
        split(icon("key", label="tokens"), icon("laptop", mark="ok", markAt="Device", label="device checks"), "the industry *moves on*"),
        split(icon("face", label="face scans"), icon("iris", at="iris", label="iris scanners"), "*face scans*. *iris scanners*.", at="Face")]},
    "f00b": split(icon("person", label="you"), icon("iris", mark="ok", markAt="you#3"), "proving *you are you*"),
    "f01": split(pol(LUIS1, "jarek tuszyński · cc by 4.0", focus="50% 25%", rotate=2, name="luis von ahn"), icon("doc", label="the ending"), "the man *who started it*"),
    "f01b": {"cuts": [
        split(pol(LUIS3, "daniel case · cc by-sa 3.0", focus="50% 20%", rotate=-2), bubble("computers will do *everything humans can*", at="computers", px=40, by="luis von ahn · vox"), "*everything* humans can"),
        split(icon("person"), icon("robot", at="apart", mark="?", markAt="apart"), "no test *tells us apart*", at="And")]},
    "f02": full({"v": "Checkbox", "surface": "bare", "scale": 1.3}, "look at *that box*"),
    "f02b": {"cuts": [
        full(two(), "two *warped words*"),
        full({"v": "Checkbox", "surface": "bare", "clickAt": "checkbox"}, "one little *checkbox*", at="One"),
        full(cap4(HYD, picks=[5, 9, 13], pickAt="grid", every=4), "a grid of *street corners*", at="A")],
        "sfx": [{"k": "click", "at": "checkbox"}]},
    "f03": {"cuts": [
        split({"v": "Checkbox", "surface": "bare", "clickAt": "robot"}, icon("robot", mark="?", markAt="robot"), "*are you a robot?*"),
        full(row("robot", 8, cols=8, every=4, morphAt="answer", morph=True), "a little *more human*", at="And")],
        "sfx": [{"k": "click", "at": "robot"}]},
    "f03b": split(cap4(TL, picks=PICKS, pickAt=-60, every=0), icon("book", at="classroom", label="classroom", reveal=True), "it was *a classroom*"),
    "f04": {"cuts": [
        split(icon("person", mark="no", markAt="fail"), icon("robot"), "you didn't *fail the test*"),
        split(icon("robot", mark="ok", markAt="passes"), {**DONE}, "you *trained* what passes", at="You#2")]},
    # v3 (CC-only clips): narrated bridges around the new CCC clips
    "k04a": {"cuts": [
        split(icon("book", label="books"), icon("contract", at="sued", label="lawsuit", reveal=True), "she *sued google*"),
        split(icon("person", label="gabriela rojas-lozano"), icon("contract", label="rojas-lozano v. google", tag=tag("2015", "Her")), "*one user* fought back", at="Her")]},
    "k04b": {"cuts": [
        split(icon("contract", mark="no", markAt="threw"), icon("gateShut", plate="rojas-lozano v. google · n.d. cal. 2016"), "case *dismissed*"),
        split(icon("clock", label="a few seconds"), icon("coin", mark="no", markAt="nothing"), "a few seconds *cost nothing*", at="few")]},
    "u01c": {"cuts": [
        split(icon("worker"), icon("coin", at="cents", label="cents"), "clicking *for cents*"),
        full(row("cursor", 18, cols=6, every=2), "*likes* for a living", at="In")]},
}

# NEW lines (not in the nsdt script). Sources: SOURCES.md. `say` = how Kokoro should pronounce it.
NEW = {
    # owner note 2026-10-08b: read the acronym aloud while it is on screen (no silent hold); rephrase the choppy "Next up, pictures. Funny thing,"
    "o04": ("By two thousand three, it even had a name: CAPTCHA, short for Completely Automated Public Turing test to tell Computers and Humans Apart.", None, "o04"),
    "m03b": ("Then came pictures. Funny enough, that was the very first idea Luis had: show people a photo, and have them type what's in it.",
             "Then came pictures. Funny enough, that was the very first idea Louis had: show people a photo, and have them type what's in it.", "m03b"),
    "c02a": ("And it wasn't just books.", None, "c04"),
    "c07a": ("So every square you clicked became a label.", None, "c07"),
    "c01r": ("Not even for the man who invented it. He admits he fails them all the time. He never knows if a tiny corner of a traffic light counts.", None, "h00"),
    "a05b": ("And by the end, you'll know exactly who cashed in.", None, "a05"),
    "c02r": ("Even The New York Times sent its old archive through the box. About a year of newspapers, every four days.", None, "b04"),
    "c03r": ("By Luis's count, it was soon digitizing about two million books a year.", "By Louis's count, it was soon digitizing about two million books a year.", "g02"),
    "c13r": ("It failed for a silly reason. People couldn't spell what they saw.", None, "m03b"),
    "c07r": ("Every square you clicked became a label. Labels like that teach a car's camera what it's looking at. And help keep Google Maps up to date.", None, "m05"),
    "c08r": ("Here's the secret. For squares like that, there is no right answer. The right answer is whatever most people click.", None, "m06"),
    "k02b": ("So the puzzle you solve for free is a dataset someone else pays for.", None, "k02"),
    "u01b": ("Picture the room. Rows of desks. Rows of screens. Buses and crosswalks, refreshing every few seconds. Nobody here is being tested. They're being paid.", None, "u01"),
    "c09r": ("It watches how you get there. How your mouse moves. Where it pauses. How long you hesitate.", None, "v01"),
    "v03b": ("Google's own terms say it collects hardware and software information from your device. Put together, that's a fingerprint.", None, "v03"),
    "v05b": ("You just sit there, locked out, clicking the same squares again.", None, "v05"),
    "r00b": ("Start with the UC Irvine study. It counted at least five hundred twelve billion reCAPTCHA sessions.", "Start with the UC Irvine study. It counted at least five hundred twelve billion re-CAPTCHA sessions.", "r00"),
    "c10r": ("In 2024, researchers in Zurich built a bot that solved one hundred percent of the image puzzles.", "In twenty twenty-four, researchers in Zurich built a bot that solved one hundred percent of the image puzzles.", "r04"),
    "f00b": ("Proving you're human may soon mean proving you are you.", None, "f00"),
    "f01b": ("He believes computers will one day do everything humans can. And then no test will be able to tell us apart.", None, "f01"),
    "f03b": ("The box was never just a test. It was a classroom.", None, "f03"),
    "g05b": ("Students thought they were practicing. They were translating the news.", None, "g05"),
    "m01a": ("Meanwhile, all that free reading had a side effect. The computers were learning too.", None, "m01"),
    "k01b": ("Same puzzles. Same clicks. Just a new buyer.", None, "k01"),
    "u02b": ("For a few dollars, a bot can buy thousands of human answers.", None, "u02"),
    "k04a": ("Back in twenty fifteen, one user had already sued Google over the books. Her name was Gabriela Rojas-Lozano.", None, "k02b"),
    "k04b": ("In twenty sixteen, a judge threw the case out. A few seconds of typing, the court found, cost her nothing.", None, "k02b"),
    "u01c": ("Clicking for cents is a real job now. In Germany, researchers met people who click likes for a living.", None, "u01b"),
    "f02b": ("Two warped words. One little checkbox. A grid of blurry street corners.", None, "f02"),
}
EDIT = {  # nsdt lines rewritten for the new pictures
    "a02": "He's right to apologize. We've all stared at that corner.",  # v3: the hook is now Luis's "I invented that. Sorry."
    "m07": "Same trick as the books. The edge is decided by votes. Where people hesitate, that's where the hydrant ends.",
    "v03": "By twenty eighteen, Google was ready to drop the puzzle completely.",
    "m03": "So this time, nobody types. You just click.",
    "m04": "Buses. Crosswalks. Traffic lights. Fire hydrants. Ever notice they all look weirdly American?",
}

CLIPS = {  # (file, from, to, plate[, fadeOut]); every in/out point sits on a sentence boundary: tools/lint_clips.py (owner note 2026-10-08b)
    # v3: CC BY / BY-SA only, no news outlets, no TED (owner TOP RULE 2026-10-08). Licences: LICENCES.md
    "c01": ("cc_wm15_annoying.mp4", 0.15, 9.26, "Luis von Ahn · CAPTCHA co-inventor · Wikimania 2015"),  # the hook
    "w01": ("cc_wm15_scalpers.mp4", 1.4, 12.1, "Luis von Ahn · Wikimania 2015"),
    "w02": ("cc_wm15_feelbad.mp4", 0.15, 12.5, "Luis von Ahn · Wikimania 2015"),
    "c04": ("cc_wm15_billion.mp4", 1.37, 10.955, "Luis von Ahn · Wikimania 2015", 0.1),
    "c03": ("cc_wm15_books.mp4", 1.85, 14.75, "Luis von Ahn · Wikimania 2015"),
    "w04": ("cc_wm15_free.mp4", 0.15, 7.34, "Luis von Ahn · Wikimania 2015"),
    "c05": ("cc_wm15_brain.mp4", 2.0, 9.15, "Luis von Ahn · Wikimania 2015"),
    "c13": ("cc_s34_history.mp4", 1.2, 16.4, "Sebastian Schmieg · artist · 34C3"),
    "c07": ("cc_s34_history.mp4", 16.4, 23.5, "Sebastian Schmieg · artist · 34C3"),
    "c08": ("cc_wm15_agree.mp4", 0.3, 8.1, "Luis von Ahn · Wikimania 2015"),
    "k04": ("cc_s34_lawsuit.mp4", 0.4, 13.1, "Sebastian Schmieg · on Rojas-Lozano v. Google · 34C3"),
    "g10": ("cc_v3_bots.mp4", 0.15, 9.05, "Google · Introducing reCAPTCHA v3"),
    "g14": ("cc_f36_maria.mp4", 1.35, 18.85, "Inside the Fake Like Factories · 36C3"),
    "g11a": ("cc_v3_checkbox.mp4", 0.0, 8.85, "Google · Introducing reCAPTCHA v3"),
    "g11": ("cc_v3_checkbox.mp4", 8.85, 16.6, "Google · Introducing reCAPTCHA v3"),
    "c09": ("cc_k35_bot.mp4", 0.66, 15.5, "Kirils Solovjovs · privacy researcher · 35C3", 0.15),
    "g13": ("cc_v3_places.mp4", 0.15, 9.38, "Google · Introducing reCAPTCHA v3"),
    "c10": ("cc_s34_unpaid.mp4", 0.4, 11.3, "Sebastian Schmieg · artist · 34C3"),
    "c11": ("cc_s34_unpaid.mp4", 11.3, 23.0, "Sebastian Schmieg · artist · 34C3"),
}
# narrated stand-ins of the clip-free v1, now said by the clips themselves (pictures kept in SHOTS for reference)
DROPPED = {"b06", "c01r", "c03r", "c07r", "c08r", "c09r_old", "o06b", "b04", "b06b", "c10r_old"}  # v3 restores c02r c13r v01 f01b (their news clips are gone)

MINS = {"c02a": 1.8}  # c02a: no 1 s dead air before the NYT clip (min_beat 2.4 > a 1.3 s line). o04 no longer held: the narrator reads the CAPTCHA expansion (owner note 2026-10-08b)

ACTS = [("01 the little box", "h00 c01 a02 a03 a04 a05 a05b o01 o02 o03 w01 o04 o05 w02 o06 o07"),
        ("02 the second job", "b00 b01 b02 b03 c04 c02a c02r b05"),  # b06 + w03 (Christians / embassy) cut: owner note 2026-10-08
        ("03 the buyer", "g01 g02 c03 g04 w04 g05 g05b g03"),
        ("04 eyes on the street", "m01a c05 m01 m02 c13 m03b c13r m03 m04 m05 c07 c07a m06 c08 m07"),
        ("05 the product", "k00 k01 k01b k02 k02b k04a k04 k04b k03 g10"),
        ("06 the workaround", "u00 u01 u01b u01c g14 u02 u02b u03"),
        ("07 the invisible test", "v00 v01 g11a c09r v02 v03 g11 v03b v04 c09 v05 v05b"),
        ("08 who cashed in", "r00 r00b r01 r02 g13 r03 r03b r04 c10r c10"),
        ("09 the ending", "f00 f00b f01 f01b c11 f02 f02b f03 f03b f04")]

nsdt = {b["id"]: b for b in src["beats"] if "clip" not in b}
nsdt["h00"] = {"id": "h00", "vo": "Select all squares with traffic lights. Simple, right?"}
for k, (vo, say, _) in NEW.items():
    nsdt[k] = {"id": k, "vo": vo, **({"say": say} if say else {})}
for k, vo in EDIT.items():
    nsdt[k] = {"id": k, "vo": vo}

beats = []
for act, ids in ACTS:
    for i in ids.split():
        if i in CLIPS:
            f, a, z, plate, *fo = CLIPS[i]  # optional 5th = fadeOut (s), for a sentence end followed closely by the next one
            beats.append({"id": i, "clip": {"src": C + f, "from": a, "to": z, "plate": plate, **({"fadeOut": fo[0]} if fo else {})}})
            continue
        b = {k: v for k, v in nsdt[i].items() if k in ("id", "vo", "say")}
        b["shot"] = {**SHOTS[i], "act": act}
        if i in MINS: b["min"] = MINS[i]
        beats.append(b)
missing = [i for i in SHOTS if i not in {b["id"] for b in beats} | DROPPED]
assert not missing, missing

out = {"id": "captchas-full", "title": "THE DARK REALITY OF CAPTCHAS · full film", "voice": src["voice"],
       "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 2.5},
       "beats": beats}
(HERE / "script.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
words = sum(len(b.get("vo", "").split()) for b in beats)
print(len(beats), "beats,", words, "words narrated,", len(CLIPS), "clips")
