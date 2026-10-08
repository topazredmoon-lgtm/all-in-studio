"""captchas-full render v1 watch: 9 near-empty moments at cut starts where every element of the new cut waited for a later word.
Rule (DESIGN.md word sync): the first element of every visual is on screen at frame 0 of its cut."""
from pathlib import Path
p = Path(__file__).resolve().parents[2] / "videos" / "captchas-full" / "gen_script.py"
s = p.read_text(encoding="utf-8")
R = [
    ('full(row("book", 40, cols=10, every=1, at="million", tag=', 'full(row("book", 40, cols=10, every=1, tag='),
    ('split(icon("car", at="car"), icon("camera", at="camera"), "what *a car\'s camera* sees")', 'split(icon("car"), icon("camera", at="camera"), "what *a car\'s camera* sees")'),
    ('split(icon("pin", at="Maps"), icon("map", at="date"', 'split(icon("pin"), icon("map", at="date"'),
    ('full(row("person", 10, cols=5, every=3, at="most", marks=', 'full(row("person", 10, cols=5, every=3, marks='),
    ('full(row("checkbox", 12, cols=4, every=2, at="votes"), "decided *by votes*")', 'full(row("checkbox", 12, cols=4, every=2), "decided *by votes*")'),
    ('full(row("person", 6, cols=6, every=4, at="500", tag=', 'full(row("person", 6, cols=6, every=4, tag='),
    ('full(icon("fingerprint", at="fingerprint"), "a *fingerprint*", at="Put")', 'full(icon("fingerprint"), "a *fingerprint*", at="Put")'),
    ('full(row("checkbox", 40, cols=10, every=1, at="512", tag=', 'full(row("checkbox", 40, cols=10, every=1, tag='),
    ('full(row("cash", 24, cols=8, every=2, at="$6", tag=', 'full(row("cash", 24, cols=8, every=2, tag='),
]
for a, b in R:
    assert a in s, a[:80]
    s = s.replace(a, b, 1)
p.write_text(s, encoding="utf-8")
print("patched")
