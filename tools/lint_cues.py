"""Word-sync gate: python tools/lint_cues.py <video_id> [--dump]   (build.py runs it after lint_text and stops on FAIL)
Every cue word in a shot (`at`, `enter`, any `…At`, tags, notes, flow nodes, label boxes, bars, sfx) must be a word the
narrator actually says in that beat, as Whisper heard it (videos/<id>/audio/<beat>.words.json). A cue that is not found
silently falls back to a default frame, which is how a number ends up on screen before it is said. Whisper writes most
numbers as digits ("819", "2014", "$6.1"), so cue a number by its digits. Also checks that cuts start in spoken order.

Upgrades (2026-10-14):
- Strict word/inflection matching: eliminates the prefix trap where `at="you"` falsely matched `"your"` or `at="in"` matched `"inside"`.
- Warns when an earlier word in the same beat shares a prefix with a cue word so authors know when to use `word#2`.
- `--dump` mode prints every beat's Whisper words with timestamps (`0.00s: word`) for zero-guess cue authoring.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    vids = sorted([p.name for p in (ROOT / "videos").iterdir() if p.is_dir() and not p.name.startswith(("_", "."))])
    print(f"\nAvailable topics:\n  {', '.join(vids)}")
    sys.exit(0)

vid = sys.argv[1]
DUMP = "--dump" in sys.argv[2:]
vdir = ROOT / "videos" / vid
if not vdir.is_dir() or not (vdir / "script.json").exists():
    sys.exit(f"Error: script.json not found for topic '{vid}'. Available topics: {', '.join(sorted(p.name for p in (ROOT / 'videos').iterdir() if (p / 'script.json').exists()))}")

script = json.loads((vdir / "script.json").read_text(encoding="utf-8"))
adir = vdir / "audio"
norm = lambda s: re.sub(r"[^a-z0-9$%]", "", str(s).lower())
ALLOWED_SUFFIXES = {"s", "es", "d", "ed", "ing", "er", "ers", "ly"}
fails, warns = [], []


def match_word(w_norm: str, k_norm: str) -> bool:
    """Match exact word or standard grammatical inflection (avoids 'you'->'your' or 'in'->'into' traps)."""
    if not k_norm or not w_norm:
        return False
    if w_norm == k_norm:
        return True
    if len(k_norm) >= 4 and w_norm.startswith(k_norm):
        suf = w_norm[len(k_norm):]
        if suf in ALLOWED_SUFFIXES:
            return True
    return False


def find(words, key, beat_id=None, path=""):
    k_raw, _, nth = str(key).partition("#")
    k = norm(k_raw)
    target_n = int(nth or 1)
    # 1. Strict match (exact or allowed inflection suffix)
    seen = 0
    strict_idx = None
    for i, w in enumerate(words):
        if match_word(norm(w["w"]), k):
            seen += 1
            if seen >= target_n:
                strict_idx = i
                break
    # Check if an earlier word would have matched under legacy startswith(k) (prefix trap warning!)
    if strict_idx is not None and beat_id and not nth:
        for j in range(strict_idx):
            wj = norm(words[j]["w"])
            if wj.startswith(k) and wj != k:
                warns.append(f"{beat_id}{path}: cue '{key}' matched '{words[strict_idx]['w']}' at {words[strict_idx]['s']:.2f}s (ignored earlier prefix '{words[j]['w']}' at {words[j]['s']:.2f}s)")
                break
    if strict_idx is not None:
        return strict_idx

    # 2. Legacy prefix fallback (only if len >= 3, and emits a WARN so existing scripts don't break unexpectedly)
    if len(k) >= 3:
        seen = 0
        for i, w in enumerate(words):
            if norm(w["w"]).startswith(k):
                seen += 1
                if seen >= target_n:
                    if beat_id:
                        warns.append(f"{beat_id}{path}: cue '{key}' only matched '{w['w']}' via loose prefix; prefer exact word '{norm(w['w'])}'")
                    return i
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


if DUMP:
    for b in script["beats"]:
        if "clip" in b:
            print(f"{b['id']:6} [CLIP] {b['clip']['src']} ({b['clip']['from']}s - {b['clip']['to']}s)")
            continue
        wf = adir / f"{b['id']}.words.json"
        if not wf.exists():
            print(f"{b['id']:6} [NO AUDIO WORDS]")
            continue
        words = json.loads(wf.read_text(encoding="utf-8"))
        tokens = "  ".join(f"{w['s']:4.2f}s:{w['w']}" for w in words)
        print(f"{b['id']:6} | {tokens}")
    sys.exit(0)

for b in script["beats"]:
    if "clip" in b: continue
    wf = adir / f"{b['id']}.words.json"
    if not wf.exists():
        fails.append(f"{b['id']}: no words.json (run tools/tts.py or tools/tts_cb.py)"); continue
    words = json.loads(wf.read_text(encoding="utf-8"))
    for path, key in cues(b["shot"]):
        if find(words, key, beat_id=b["id"], path=path) is None:
            heard = " ".join(f"{w['w']}({w['s']:.1f}s)" for w in words)
            fails.append(f"{b['id']}{path} = '{key}' not spoken. Heard: {heard[:160]}")
    cuts = b["shot"].get("cuts")
    if cuts:
        idx = [find(words, c["at"]) if isinstance(c.get("at"), str) else None for c in cuts[1:]]
        idx = [i for i in idx if i is not None]
        if idx != sorted(idx):
            fails.append(f"{b['id']}: cuts are not in spoken order ({idx})")
        # a cut cued on a common word ("The", "And") can fire on its first, much earlier occurrence: no cut under 0.9 s
        dur = json.loads((adir / f"{b['id']}.json").read_text(encoding="utf-8"))["dur"] + 0.45
        t = [0.0] + [words[i]["s"] for i in idx] + [dur]
        for k in range(len(t) - 1):
            if t[k + 1] - t[k] < 0.9:  # v6 opening "simple, right?" is 1.0 s by design
                fails.append(f"{b['id']}: cut {k} lasts {t[k + 1] - t[k]:.1f} s (min 0.9); its cue word may match an earlier word, use word#2")

    # empty board at a cut: every object of the cut waits for a later word (drawings cued with `at`, panels with `enter`).
    for c in (cuts or [b["shot"]]):
        vis = [c["hero"]] if c.get("layout") in ("full", "scene") else [c.get("L"), c.get("R")]
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

for w in warns:
    print("WARN [cue]", w)
for f in fails:
    print("FAIL [cue]", f)
print(f"lint_cues {vid}: {len(fails)} FAIL ({len(warns)} WARN)")
sys.exit(1 if fails else 0)
