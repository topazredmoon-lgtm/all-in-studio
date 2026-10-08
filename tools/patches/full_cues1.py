"""captchas-full: cue words as Whisper hears them (digits), plus five more lines to reach 8:00 (2026-10-08)."""
from pathlib import Path
p = Path(__file__).resolve().parents[2] / "videos" / "captchas-full" / "gen_script.py"
s = p.read_text(encoding="utf-8")
R = [
    ('"*two million books* a year", at="two")', '"*two million books* a year", at="2")'),
    ('"*2011*: duolingo", at="twenty")', '"*2011*: duolingo", at="2011")'),
    ('at="five", tag=tag("500 years a day", "five")', 'at="500", tag=tag("500 years a day", "500")'),
    ('icon("coin", at="fifty", tag=tag("$0.50 per 1,000", "fifty")', 'icon("coin", at="50", tag=tag("$0.50 per 1,000", "50")'),
    ('at="five", tag=tag("512 billion+ sessions", "five")', 'at="512", tag=tag("512 billion+ sessions", "512")'),
    ('tag=tag("819 million hours", "eight")', 'tag=tag("819 million hours", "819")'),
    ('at="six", tag=tag("$6.1 billion unpaid", "six")', 'at="$6", tag=tag("$6.1 billion unpaid", "$6")'),
    ('markAt="Their"', 'markAt="They"'),
    ('mark="ok", markAt="hundred")', 'mark="ok", markAt="100")'),
    ('tag=tag("100% solved", "hundred")', 'tag=tag("100% solved", "100")'),
    # five more beats (8:00 floor)
    ('    # ================================================================ 04 eyes on the street\n',
     '    "g05b": split(icon("person", label="students", mark="?", markAt="practicing"), icon("newspaper", at="news", label="the news"), "they were *translating the news*"),\n'
     '    # ================================================================ 04 eyes on the street\n'
     '    "m01a": split(two(only="a", a="reading", ok=True, okAt="free"), icon("robot", label="ocr", mark="ok", markAt="learning"), "the computers *were learning*"),\n'),
    ('    "k02": {"cuts": [', '    "k01b": split(icon("checkbox"), icon("cash", at="buyer", label="new buyer"), "same clicks, *new buyer*"),\n    "k02": {"cuts": ['),
    ('    "u03": full(', '    "u02b": full(row("checkbox", 30, cols=10, every=1, at="few", tag=tag("$5 ≈ 10,000 answers", "few"), plate="our arithmetic · $0.50 per 1,000"), "*thousands* of human answers"),\n    "u03": full('),
    ('    "f03": {"cuts": [', '    "f02b": {"cuts": [\n'
     '        full(two(), "two *warped words*"),\n'
     '        full({"v": "Checkbox", "surface": "bare", "clickAt": "checkbox"}, "one little *checkbox*", at="One"),\n'
     '        full(cap4(HYD, picks=[5, 9, 13], pickAt="grid", every=4), "a grid of *street corners*", at="A")],\n'
     '        "sfx": [{"k": "click", "at": "checkbox"}]},\n'
     '    "f03": {"cuts": ['),
    ('    "f03b": ("The box was never just a test. It was a classroom.", None, "f03"),',
     '    "f03b": ("The box was never just a test. It was a classroom.", None, "f03"),\n'
     '    "g05b": ("Students thought they were practicing. They were translating the news.", None, "g05"),\n'
     '    "m01a": ("Meanwhile, all that free reading had a side effect. The computers were learning too.", None, "m01"),\n'
     '    "k01b": ("Same puzzles. Same clicks. Just a new buyer.", None, "k01"),\n'
     '    "u02b": ("For a few dollars, a bot can buy thousands of human answers.", None, "u02"),\n'
     '    "f02b": ("Two warped words. One little checkbox. A grid of blurry street corners.", None, "f02"),'),
    ('"g01 g02 c03r g04 g05 g03"', '"g01 g02 c03r g04 g05 g05b g03"'),
    ('"m01 m02 m03b', '"m01a m01 m02 m03b'),
    ('"k00 k01 k02 k02b k03"', '"k00 k01 k01b k02 k02b k03"'),
    ('"u00 u01 u01b u02 u03"', '"u00 u01 u01b u02 u02b u03"'),
    ('"f00 f00b f01 f01b f02 f03 f03b f04"', '"f00 f00b f01 f01b f02 f02b f03 f03b f04"'),
]
for a, b in R:
    assert a in s, a[:70]
    s = s.replace(a, b, 1)
p.write_text(s, encoding="utf-8")
print("patched")
