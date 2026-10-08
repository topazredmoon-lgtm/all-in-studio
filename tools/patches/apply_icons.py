"""One-off patch (2026-10-08): adds the captchas-full line art to engine/src/ds/kit.tsx."""
from pathlib import Path
here = Path(__file__).parent
p = here.parent.parent / "engine" / "src" / "ds" / "kit.tsx"
s = p.read_text(encoding="utf-8")
if "case 'cash'" not in s:
    ins = (here / "icons_full.txt").read_text(encoding="utf-8")
    i = s.index("    case 'cursor':"); j = s.index("\n", i) + 1
    s = s[:j] + ins + s[j:]
    s = s.replace("| 'cursor' | 'people';", "| 'cursor' | 'people'\n  | 'cash' | 'church' | 'car' | 'camera' | 'flag' | 'pin' | 'map' | 'box' | 'grid' | 'checkbox' | 'checkbox2' | 'cloud' | 'building' | 'browser' | 'clock'\n  | 'worker' | 'monitor' | 'laptop' | 'fingerprint' | 'shield' | 'cookie' | 'key' | 'face' | 'iris' | 'newspaper';")
    p.write_text(s, encoding="utf-8")
print("icons:", s.count("case '"))
