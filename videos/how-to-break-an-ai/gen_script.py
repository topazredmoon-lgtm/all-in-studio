"""Writes script.json for <topic-slug>.
Scaffolded from videos/_template. Uses ds/ layouts, primitives, and plates only.
"""
import json
from pathlib import Path

HERE = Path(__file__).parent


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
def plate(name, **kw): return {"v": name, "surface": "bare", **kw}
def tag(t, at=0): return {"t": t, "at": at}
def real(at=0): return {"t": "real", "at": at}
def notyet(at=0): return {"t": "not yet", "at": at}


VO = {
    # 01 COLD OPEN
    "h01": ("Opening line establishing the everyday object in frame zero.", None),
    "a01": ("Second line delivering the twist or high-stakes reveal.", None),
}

# Studio core grammar: Left/Right split (side-to-side).
# Left = subject on screen from frame 0; Right = evidence landing on cue word (enter).
# NEVER place a single plate/drawing centered in full layout as the default.
# NEVER reuse metaphor plates from another film. Build bespoke visuals for this topic in engine/src/visuals/<topic>.tsx.
SHOTS = {
    "h01": split(icon("laptop"), icon("lock", enter="cost"), "the *opening* hook"),
    "a01": split(icon("laptop"), icon("warning", enter="hidden"), "the *hidden* cost"),
}

CLIPS = {
    # "c01": {"src": "topic/clip.mp4", "from": 0.0, "to": 8.0, "plate": "Speaker · Affiliation · Source"}
}

ORDER = ["h01", "a01"]

if __name__ == "__main__":
    beats = []
    for bid in ORDER:
        if bid in CLIPS:
            beats.append({"id": bid, "clip": CLIPS[bid]})
        elif bid in VO:
            vo, say = VO[bid]
            b = {"id": bid, "vo": vo, "shot": SHOTS.get(bid, {})}
            if say: b["say"] = say
            beats.append(b)

    data = {
        "id": HERE.name,
        "title": HERE.name.upper(),
        "voice": {"engine": "kokoro", "name": "af_heart", "speed": 1.0},
        "pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 1.5},
        "beats": beats
    }
    (HERE / "script.json").write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"Wrote script.json for {HERE.name} with {len(beats)} beats")
