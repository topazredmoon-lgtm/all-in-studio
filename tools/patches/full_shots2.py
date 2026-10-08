"""captchas-full stills review, round 1 (2026-10-08): shot fixes (long shots split, a cut cued on "The" that fired at 0.3 s,
empty right panels, small flows)."""
from pathlib import Path
p = Path(__file__).resolve().parents[2] / "videos" / "captchas-full" / "gen_script.py"
s = p.read_text(encoding="utf-8")
R = [
    # b06: the 8 s second cut becomes two
    ('''        split(pol(LUIS1, "jarek tuszyński · cc by 4.0", focus="50% 25%", rotate=-3), two(a="Christians", b="xxxxxx", redact=True, twoAt="much"), "*not so much*", at="tells")]},''',
     '''        split(pol(LUIS1, "jarek tuszyński · cc by 4.0", focus="50% 25%", rotate=-3), two(only="a", a="Christians", oneAt="Christians", ok=True, okAt="Harmless"), "the scanned word: *harmless*", at="tells"),
        full(two(a="Christians", b="xxxxxx", redact=True, twoAt="much"), "the other? *not so much*", at="random#2")]},'''),
    # c08r: "The" matched "Here's the secret" (cut at 0.3 s)
    ('"*most people* decide", at="The")', '"*most people* decide", at="right#2")'),
    ('full(row("person", 10, cols=10, every=3, at="most",', 'full(row("person", 10, cols=5, every=3, at="most",'),
    ('full(row("checkbox", 12, cols=6, every=2, at="votes"), "decided *by votes*")', 'full(row("checkbox", 12, cols=4, every=2, at="votes"), "decided *by votes*")'),
    # m02: off the street
    ('''        split(icon("car", label="street view"), {"v": "HouseNumber", "surface": "bare", "n": "1427", "at": "house"}, "blurry *house numbers*", at="first")]},''',
     '''        full(photo("cc_hydrant_miami.jpg", "photo · infrogmation of new orleans · cc by 2.0", focus="50% 40%"), "straight *off the street*", at="first"),
        split(icon("car", label="street view"), {"v": "HouseNumber", "surface": "bare", "n": "1427", "at": "House"}, "blurry *house numbers*", at="Blurry")]},'''),
    # k01: the flow gets the whole width
    ('''    "k01": split(cal("2020"), flow([{"icon": "cloud", "label": "cloudflare"}, {"icon": "checkbox", "label": "recaptcha", "at": "from"}, {"icon": "checkbox2", "label": "hcaptcha", "at": "rival"}], plate="cloudflare blog · april 2020"),
                 "cloudflare *switches*"),''',
     '''    "k01": {"cuts": [
        split(cal("2020"), icon("cloud", at="Cloudflare", label="cloudflare"), "*2020*: cloudflare"),
        full(flow([{"icon": "checkbox", "label": "recaptcha"}, {"icon": "checkbox2", "label": "hcaptcha", "at": "rival"}], plate="cloudflare blog · april 2020"), "switched to *a rival*", at="moved")]},'''),
    # k03: three cuts
    ('''        full(row("person", 6, cols=6, every=4, at="500", tag=tag("500 years a day", "500"), plate="cloudflare · 2021 estimate"), "*500 years* a day"),''',
     '''        split(icon("cloud", label="cloudflare"), icon("cursor", at="clicking", label="clicking"), "cloudflare *did the math*"),
        full(row("person", 6, cols=6, every=4, at="500", tag=tag("500 years a day", "500"), plate="cloudflare · 2021 estimate"), "*500 years* a day", at="Humanity"),'''),
    # u01: two cuts
    ('''    "u01": full(row("worker", 12, cols=6, every=3), "captcha-solving *farms*"),''',
     '''    "u01": {"cuts": [
        full(row("worker", 12, cols=6, every=3), "captcha-solving *farms*"),
        split(icon("robot", label="bots"), icon("worker", mark="ok", markAt="day"), "solving *for bots*, all day", at="bots")]},'''),
    # u02: two cuts
    ('''    "u02": split(row("grid", 40, cols=10, every=1), icon("coin", at="50", tag=tag("$0.50 per 1,000", "50"), plate="anti-captcha.com · 2026"), "*fifty cents* a thousand"),''',
     '''    "u02": {"cuts": [
        split(row("grid", 40, cols=10, every=1), icon("cash", at="50", tag=tag("$0.50 per 1,000", "50"), plate="anti-captcha.com · 2026"), "*fifty cents* a thousand"),
        split(icon("grid", label="one puzzle"), icon("coin", at="20", tag=tag("1/20 of a cent", "20"), plate="our arithmetic"), "*a 20th of a cent*", at="that")]},'''),
    # v03: no puzzle, then the score
    ('''    "v03": split(cal("2018"), {"v": "Score", "surface": "bare", "v1": 0.9, "at": "score"}, "version 3: *a score*"),''',
     '''    "v03": {"cuts": [
        split(cal("2018"), icon("grid", mark="no", markAt="dropped", label="no puzzle"), "version 3: *no puzzle*"),
        full({"v": "Score", "surface": "bare", "v1": 0.9, "at": "watches"}, "it just *returns a score*", at="It")]},'''),
    ('icon("robot", at="bot", mark="?", markAt="bot"), "you look *like a bot*"', 'icon("robot", mark="?", markAt="bot"), "you look *like a bot*"'),
    ('split(icon("person", mark="no", markAt="fail"), icon("robot", at="trained"), "you didn\'t *fail the test*")', 'split(icon("person", mark="no", markAt="fail"), icon("robot"), "you didn\'t *fail the test*")'),
    # r00b: callback to the study's first appearance
    ('''    "r00b": full(row("checkbox", 40, cols=10, every=1, at="512", tag=tag("512 billion+ sessions", "512"), plate="searles, prapty & tsudik · uc irvine"), "*512 billion* sessions"),''',
     '''    "r00b": {"cuts": [
        split(icon("doc", label="uc irvine", plate="uc irvine study · 2023"), {"v": "Checkbox", "surface": "bare"}, "the *uc irvine* study"),
        full(row("checkbox", 40, cols=10, every=1, at="512", tag=tag("512 billion+ sessions", "512"), plate="searles, prapty & tsudik · uc irvine"), "*512 billion* sessions", at="It")]},'''),
    # r03: you decide
    ('''    "r03": split(icon("building", label="google"), bubble("not used for *personalized ads*", at="isn", px=40, by="google · recaptcha about page"), "google says *no ads*"),''',
     '''    "r03": {"cuts": [
        split(icon("building", label="google"), bubble("not used for *personalized ads*", at="isn", px=40, by="google · recaptcha about page"), "google says *no ads*"),
        split(icon("person", mark="?", markAt="decide", label="you"), icon("doc", label="the study"), "*you decide*", at="You")]},'''),
    # c10r: who, then the result
    ('''    "c10r": split(icon("robot", at="bot", mark="ok", markAt="100"), cap4(CROSS, picks=[8, 9, 10, 11, 12, 13, 14, 15], pickAt="solved", every=2, tag=tag("100% solved", "100"), plate="plesner et al. · eth zurich · 2024", enter="bot"),
                  "*100%* of the puzzles", sfx=[{"k": "click", "at": "solved", "plus": 2 * i} for i in range(8)]),''',
     '''    "c10r": {"cuts": [
        split(cal("2024"), icon("robot", at="bot", label="zurich bot"), "*2024*: a bot from zurich"),
        split(icon("robot", mark="ok", markAt="100"), cap4(CROSS, picks=[8, 9, 10, 11, 12, 13, 14, 15], pickAt="solved", every=2, tag=tag("100% solved", "100"), plate="plesner et al. · eth zurich · 2024"),
              "*100%* of the puzzles", at="solved")],
        "sfx": [{"k": "click", "at": "solved", "plus": 2 * i} for i in range(8)]},'''),
]
for a, b in R:
    assert a in s, a[:80]
    s = s.replace(a, b, 1)
p.write_text(s, encoding="utf-8")
print("patched")
