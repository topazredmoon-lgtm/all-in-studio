"""captchas-full render v1 spot-check: panels that waited 2–4 s for their word (new lint in lint_cues.py).
Drawings now sit on screen from the cut (their marks still land on the word); five true reveals are marked reveal=True."""
from pathlib import Path
root = Path(__file__).resolve().parents[2]
p = root / "videos" / "captchas-full" / "gen_script.py"
s = p.read_text(encoding="utf-8")
R = [
    ('icon("newspaper", at="Times", label="nyt archive")', 'icon("newspaper", label="nyt archive")'),
    ('icon("church", at="Embassy", label="kingdom of god")', 'icon("church", label="kingdom of god")'),
    ('icon("newspaper", at="news", label="the news")', 'icon("newspaper", at="news", label="the news", reveal=True)'),
    ('split(icon("car"), icon("camera", at="camera"),', 'split(icon("car"), icon("camera"),'),
    ('icon("cash", at="buyer", label="new buyer")', 'icon("cash", at="buyer", label="new buyer", reveal=True)'),
    ('icon("cash", at="pays", label="dataset")', 'icon("cash", at="pays", label="dataset", reveal=True)'),
    ('icon("cash", at="paid"), "not tested. *paid*."', 'icon("cash", at="paid", reveal=True), "not tested. *paid*."'),
    ('icon("eye", at="see", mark="no", markAt="see")', 'icon("eye", mark="no", markAt="see")'),
    ('split(icon("laptop", at="device"),', 'split(icon("laptop"),'),
    ('icon("shield", label="vpn", at="VPN")', 'icon("shield", label="vpn")'),
    ('icon("cash", at="cashed", label="who?")', 'icon("cash", label="who?")'),
    ('icon("box", at="product", label="product")', 'icon("box", at="product", label="product", reveal=True)'),
    ('icon("laptop", at="Device", mark="ok", markAt="Device", label="device checks")', 'icon("laptop", mark="ok", markAt="Device", label="device checks")'),
    ('icon("iris", at="you#3", mark="ok", markAt="you#3")', 'icon("iris", mark="ok", markAt="you#3")'),
    ('icon("doc", at="ending", label="the ending")', 'icon("doc", label="the ending")'),
    ('icon("robot", at="robot", mark="?", markAt="robot")', 'icon("robot", mark="?", markAt="robot")'),
    ('icon("book", at="classroom", label="classroom")', 'icon("book", at="classroom", label="classroom", reveal=True)'),
    ('two(only="b", twoAt="book", enter="other")', 'two(only="b", twoAt="book", enter="other", reveal=True)'),
]
for a, b in R:
    assert a in s, a[:80]
    s = s.replace(a, b, 1)
p.write_text(s, encoding="utf-8")
# the approved 3-min has the same b01 reveal
p3 = root / "videos" / "captchas-3min" / "gen_script.py"
s3 = p3.read_text(encoding="utf-8")
a = 'two(only="b", twoAt="book", enter="other")'
if a in s3: p3.write_text(s3.replace(a, 'two(only="b", twoAt="book", enter="other", reveal=True)'), encoding="utf-8")
print("patched")
