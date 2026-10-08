"""Word-sync gate: python tools/lint_cues.py <video_id>   (build.py runs it after lint_text and stops on FAIL)
Every cue word in a shot (`at`, `enter`, any `…At`, tags, notes, flow nodes, label boxes, bars, sfx) must be a word the
narrator actually says in that beat, as Whisper heard it (videos/<id>/audio/<beat>.words.json). A cue that is not found
silently falls back to a default frame, which is how a number ends up on screen before it is said. Whisper writes most
numbers as digits ("819", "2014", "$6.1"), so cue a number by its digits. Also checks that cuts start in spoken order.
Lesson from captchas-full (2026-10-08): the script's spelled-out numbers ("eight hundred nineteen") never match."""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
vid = sys.argv[1]
script = json.loads((ROOT / "videos" / vid / "script.json").read_text(encoding="utf-8"))
adir = ROOT / "videos" / vid / "audio"
norm = lambda s: re.sub(r"[^a-z0-9$%]", "", str(s).lower())
fails = []


def find(words, key):
    k, _, nth = str(key).partition("#")
    k = norm(k); seen = 0
    for i, w in enumerate(words):
        if norm(w["w"]).startswith(k):
            seen += 1
            if seen >= int(nth or 1): return i
    return None


def cues(o, path=""):
    if isinstance(o, dict):
        for k, v in o.items():
            if isinstance(v, str) and (k in ("at", "enter") or (k.endswith("At") and k != "plateAt")):
                yield f"{path}.{k}", v
            elif isinstance(v, (dict, list)):
                yield from cues(v, f"{path}.{k}")
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from cues(v, f"{path}[{i}]")


for b in script["beats"]:
    if "clip" in b: continue
    wf = adir / f"{b['id']}.words.json"
    if not wf.exists():
        fails.append(f"{b['id']}: no words.json (run tools/tts.py)"); continue
    words = json.loads(wf.read_text())
    for path, key in cues(b["shot"]):
        if find(words, key) is None:
            heard = " ".join(w["w"] for w in words)
            fails.append(f"{b['id']}{path} = '{key}' not spoken. Heard: {heard[:140]}")
    cuts = b["shot"].get("cuts")
    if cuts:
        idx = [find(words, c["at"]) if isinstance(c.get("at"), str) else None for c in cuts[1:]]
        idx = [i for i in idx if i is not None]
        if idx != sorted(idx):
            fails.append(f"{b['id']}: cuts are not in spoken order ({idx})")
        # a cut cued on a common word ("The", "And") can fire on its first, much earlier occurrence: no cut under 0.9 s
        dur = json.loads((adir / f"{b['id']}.json").read_text())["dur"] + 0.45
        t = [0.0] + [words[i]["s"] for i in idx] + [dur]
        for k in range(len(t) - 1):
            if t[k + 1] - t[k] < 0.9:  # v6 opening "simple, right?" is 1.0 s by design
                fails.append(f"{b['id']}: cut {k} lasts {t[k + 1] - t[k]:.1f} s (min 0.9); its cue word may match an earlier word, use word#2")

    # empty board at a cut: every object of the cut waits for a later word (drawings cued with `at`, panels with `enter`).
    # captchas-full v1 had 9 such 0.2–0.4 s blanks (tools/watch.py). The first object of a cut is on screen at its frame 0.
    for c in (cuts or [b["shot"]]):
        vis = [c["hero"]] if c.get("layout") == "full" else [c.get("L"), c.get("R")]
        waits = [isinstance(v.get("enter"), str) or (v.get("v") in ("LineIcon", "IconRow") and isinstance(v.get("at"), str)) for v in vis if v]
        if waits and all(waits):
            fails.append(f"{b['id']}: cut at '{c.get('at', 0)}' opens on an empty board (every object waits for a word); draw one at frame 0")
        # v6 rule: in a split the left object is there from frame 0; the right one lands within 2 s of the cut unless it is the reveal
        if c.get("layout") == "split":
            c0 = 0.0
            if isinstance(c.get("at"), str) and find(words, c["at"]) is not None: c0 = words[find(words, c["at"])]["s"]
            for side in ("L", "R"):
                v = c[side]; key = v.get("enter") if isinstance(v.get("enter"), str) else (v.get("at") if v.get("v") in ("LineIcon", "IconRow") and isinstance(v.get("at"), str) else None)
                if key is None or find(words, key) is None: continue
                d = words[find(words, key)]["s"] - c0
                if side == "L" and d > 0.5:
                    fails.append(f"{b['id']}: left object waits {d:.1f} s for '{key}' (left is on screen from the cut)")
                if side == "R" and d > 2.0 and not v.get("reveal"):
                    fails.append(f"{b['id']}: right object waits {d:.1f} s for '{key}' (max 2 s unless reveal=True)")

for f in fails:
    print("FAIL [cue]", f)
print(f"lint_cues {vid}: {len(fails)} FAIL")
sys.exit(1 if fails else 0)
