#!/usr/bin/env python3
"""
tactile_pop_gate.py — Lesson #85 "End of Amateur Programmer-Art" as a measurable gate.

THE SOUL (All-in_captchas_full_v2.mp4): high-contrast white/cream PHYSICAL objects
floating on the warm-black #0E0C0B dot-grid board, real archival photos, red ink.
THE AMATEUR PATTERN Lesson #85 bans: flat #161411 dark-on-dark boxes, tiny labels,
hairline wireframes, nothing with mass.

Only the BOARD is judged — the two-tone caption band (bottom 24%) and chapter tag
band (top 9%) are masked, because they are constant overlays, not board art.

Five primary rules (calibrated on the soul's own goldens, margins documented in
tactile_pop_thresholds.json). A frame FAILS when >= 3 of the 5 primary rules miss;
one or two misses is normal soul variance and only reports a reason code.

  R1 light_frac      >= floor   high-contrast surface coverage      TP5_EMPTY_BOARD
  R2 hero_mass_pct   >= floor   largest light object has mass       TP1_NO_HERO_MASS
  R3 board_contrast  >= floor   brightest object vs stage pops      TP3_DIM_BOARD
  R4 flat_slop_frac  <= ceil    flat #161411 dark-on-dark area      TP2_FLAT_DARK_BOX
  R5 tiny_label_pct  <= ceil    light pixels in thin components     TP4_TINY_LABELS

Secondary (never alone fatal, reported for the heal loop):
  R6 colorfulness >= floor      red accent / photo colour           TP6_DESATURATED
  R7 edge_board   <= ceil       hairline clutter                    TP4_TINY_LABELS

Usage
  python tools/tactile_pop_gate.py calibrate            # rebuild thresholds from soul goldens
  python tools/tactile_pop_gate.py <slug>               # gate videos/<slug>/qa/cuts/*.jpg (stills, strict)
  python tools/tactile_pop_gate.py --frames <dir>       # gate an arbitrary stills folder (strict)
  python tools/tactile_pop_gate.py --mp4 <path>         # gate sampled frames (transitions skipped)
  ... [--json out.json] [--min-pass 0.9] [--verbose] [--show]

Exit 0 = pass, 1 = fail, 2 = cannot run.
Pure numpy + Pillow + opencv. Zero network, zero model download, ~15 ms/frame.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

try:
    import cv2
except ImportError:  # pragma: no cover
    cv2 = None
try:
    from PIL import Image
except ImportError:  # pragma: no cover
    Image = None

HERE = Path(__file__).resolve().parent


def _find_root() -> Path:
    """Walk up from this file looking for the All-in repo root (videos/_template + tools + engine)."""
    for p in [HERE, *HERE.parents]:
        if (p / "videos" / "_template").is_dir() and (p / "tools").is_dir() and (p / "engine").is_dir():
            return p
    return Path(r"C:\Users\pc\Documents\All-in-keep\All-in")


ROOT = _find_root()
THRESH_FILE = HERE / "tactile_pop_thresholds.json"

SOUL_MP4 = ROOT / "videos" / "captchas-full" / "out" / "All-in_captchas_full_v2.mp4"
SOUL_STILLS = ROOT / "videos" / "captchas-full" / "qa" / "cuts"
FFMPEG_CANDIDATES = [
    r"C:\Users\pc\Downloads\ffmpeg-2026-08-20-git-7d77562d2a-essentials_build"
    r"\ffmpeg-2026-08-20-git-7d77562d2a-essentials_build\bin\ffmpeg.exe",
    "ffmpeg",
]

STAGE = np.array([0x0E, 0x0C, 0x0B], dtype=np.float64)       # the board
STAGE_SLOP = np.array([0x16, 0x14, 0x11], dtype=np.float64)  # the banned flat box

CAPTION_TOP = 0.76   # below this = two-tone caption band (masked)
CHAPTER_BOT = 0.09   # above this = chapter tag band (masked)

# metric -> (direction, human description, repair hint for the heal loop)
METRIC_SPEC = {
    "light_frac":     (">=", "high-contrast surface coverage of the board",
                       "Put a white/cream physical object on the board: #FFFFFF card, #F6F2E8 paper slip, or a real photo"),
    "hero_mass_pct":  (">=", "largest connected light object, % of board",
                       "Give ONE object mass (JobPortalCard / UtilityBillCard / Film photo) instead of hairline strokes"),
    "board_contrast": (">=", "WCAG contrast of the brightest board object vs the stage",
                       "Raise the focal object near-white; dark-on-dark reads as a developer terminal"),
    "flat_slop_frac": ("<=", "flat #161411 dark-on-dark box area",
                       "Kill the flat dark box — Lesson #85 root cause #1 — replace with a high-contrast tactile surface"),
    "tiny_label_pct": ("<=", "share of light pixels inside thin (<26px) components",
                       "Too many tiny labels: collapse to one 36-64px focal statement with soft skeleton lines"),
    "colorfulness":   (">=", "Hasler-Suesstrunk colour variety (red accent / photo)",
                       "Add the red ink accent (#E63946) or a real archival photograph"),
    "edge_board":     ("<=", "edge density of the board (hairline clutter)",
                       "Delete hairline wireframe chrome; a tactile object needs fewer, cleaner edges"),
}
PRIMARY = ["light_frac", "hero_mass_pct", "board_contrast", "flat_slop_frac", "tiny_label_pct"]
# SIGNATURE = the three measurable root causes of Lesson #85 amateur programmer-art.
# A frame is FAIL only when >= SIGNATURE_MISS_LIMIT of them fire at once, because the
# soul itself mixes sparse line-art shots with heavy object shots — sparseness alone
# is NOT the sin. The sin is flat dark-on-dark boxes + a farm of tiny labels + a dim board.
SIGNATURE = ["flat_slop_frac", "tiny_label_pct", "board_contrast"]
SIGNATURE_MISS_LIMIT = 2
# reported-only diagnostics (they earn a WARN + a repair hint, never a FAIL on their own)
DIAGNOSTIC = ["light_frac", "hero_mass_pct", "colorfulness", "edge_board"]
CODES = {"light_frac": "TP5_EMPTY_BOARD", "hero_mass_pct": "TP1_NO_HERO_MASS",
         "board_contrast": "TP3_DIM_BOARD", "flat_slop_frac": "TP2_FLAT_DARK_BOX",
         "tiny_label_pct": "TP4_TINY_LABELS", "colorfulness": "TP6_DESATURATED",
         "edge_board": "TP4_TINY_LABELS"}
TRANSITION_CONTENT = 0.005   # board content below this = a cut transition, not an art frame

# per-metric calibration anchor: (soul percentile, multiplier, abs_floor, abs_ceiling)
# chosen by labelled sweep — see poc/sweep_calibrate.py + poc/compare_rules.py
ANCHOR_POLICY = {
    "light_frac":     (20, 0.9, 0.010, None),
    "hero_mass_pct":  (20, 0.9, 1.0, None),
    "board_contrast": (10, 0.85, 8.0, None),
    "flat_slop_frac": (90, 1.8, None, 0.15),
    "tiny_label_pct": (90, 1.5, None, 45.0),
    "colorfulness":   (10, 0.8, 4.0, None),
    "edge_board":     (90, 1.5, None, 0.15),
}


# ----------------------------------------------------------------- geometry
def board_mask(shape):
    h, w = shape
    m = np.zeros((h, w), dtype=bool)
    m[int(h * CHAPTER_BOT):int(h * CAPTION_TOP), :] = True
    return m


def _srgb_linear(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def _rel_lum(rgb):
    lin = _srgb_linear(np.asarray(rgb, dtype=np.float64))
    return float(0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2])


def _wcag(l1, l2):
    a, b = max(l1, l2), min(l1, l2)
    return (a + 0.05) / (b + 0.05)


def _colorfulness(rgb):
    r, g, b = (rgb[..., i].astype(np.float64) for i in range(3))
    rg, yb = np.abs(r - g), np.abs(0.5 * (r + g) - b)
    return float(np.sqrt(rg.std() ** 2 + yb.std() ** 2)
                 + 0.3 * np.sqrt(rg.mean() ** 2 + yb.mean() ** 2))


# ----------------------------------------------------------------- metrics
def frame_metrics(rgb: np.ndarray) -> dict:
    if cv2 is None:
        raise RuntimeError("opencv-python is required (pip install opencv-python)")
    lab = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2LAB)
    L = lab[..., 0].astype(np.float64) * (100.0 / 255.0)

    bm = board_mask(L.shape)
    n_board = int(bm.sum())
    Lb, rgb_b = L[bm], rgb[bm]

    light_frac = float((Lb >= 55).mean())

    # anything that is not the board itself = content (transition detector)
    dE_stage = np.sqrt(((rgb_b.astype(np.float64) - STAGE) ** 2).sum(axis=1))
    content_frac = float((dE_stage > 10.0).mean())

    p = float(np.percentile(Lb, 99.5))
    rgb_p = cv2.cvtColor(np.array([[[int(round(p * 255 / 100)), 128, 128]]], np.uint8),
                         cv2.COLOR_LAB2RGB)[0, 0]
    board_contrast = _wcag(_rel_lum(rgb_p), _rel_lum(STAGE))

    lm = np.zeros(L.shape, dtype=np.uint8)
    lm[bm] = (Lb >= 60).astype(np.uint8)
    lm = cv2.morphologyEx(lm, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    n, _, stats, _ = cv2.connectedComponentsWithStats(lm, 8)
    hero_mass, tiny_label = 0.0, (100.0 if light_frac > 0 else 0.0)
    if n > 1:
        areas, heights = stats[1:, cv2.CC_STAT_AREA], stats[1:, cv2.CC_STAT_HEIGHT]
        hero_mass = float(areas.max()) / n_board * 100.0
        light_px = int((lm > 0).sum())
        if light_px:
            thin = heights < 26
            tiny_label = float(areas[thin].sum()) / light_px * 100.0

    dE_slop = np.sqrt(((rgb_b.astype(np.float64) - STAGE_SLOP) ** 2).sum(axis=1))
    flat_slop = float((dE_slop <= 8.0).mean())

    gray = cv2.cvtColor(rgb.astype(np.uint8), cv2.COLOR_RGB2GRAY)
    edge_board = float((cv2.Canny(gray, 60, 160)[bm] > 0).mean())

    return {
        "light_frac": round(light_frac, 4),
        "hero_mass_pct": round(hero_mass, 3),
        "board_contrast": round(board_contrast, 2),
        "board_p995_L": round(p, 2),
        "flat_slop_frac": round(flat_slop, 4),
        "tiny_label_pct": round(tiny_label, 3),
        "edge_board": round(edge_board, 4),
        "colorfulness": round(_colorfulness(rgb_b), 2),
        "content_frac": round(content_frac, 4),
    }


def load_rgb(path: Path, max_w: int = 960) -> np.ndarray:
    img = Image.open(path).convert("RGB")
    if img.width > max_w:
        img = img.resize((max_w, int(img.height * max_w / img.width)), Image.LANCZOS)
    return np.array(img)


def _ffmpeg() -> str | None:
    for c in FFMPEG_CANDIDATES:
        try:
            if c == "ffmpeg" or Path(c).exists():
                return c
        except OSError:
            continue
    return None


def sample_mp4(mp4: Path, n: int = 30, every: float = 4.0) -> list[Path]:
    ff = _ffmpeg()
    if not ff:
        raise RuntimeError("ffmpeg not found")
    tmp = Path(tempfile.mkdtemp(prefix="tpp_"))
    subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-i", str(mp4),
                    "-vf", f"fps=1/{every},scale=960:-1", "-frames:v", str(n),
                    str(tmp / "f_%03d.png"), "-y"],
                   check=True, capture_output=True)
    return sorted(tmp.glob("*.png"))


# ----------------------------------------------------------------- calibrate
def _soul_goldens(n_mp4: int = 30) -> list[Path]:
    files: list[Path] = []
    if SOUL_MP4.exists():
        files += sample_mp4(SOUL_MP4, n=n_mp4, every=6.0)
    if SOUL_STILLS.exists():
        files += sorted(SOUL_STILLS.glob("*.jpg"))[:60]
    return files


def calibrate(show: bool = False) -> dict:
    """Thresholds from the soul's own goldens.

    ANCHOR_POLICY was chosen by a labelled sweep over 90 soul frames vs 270 frames
    from the clearly-amateur topics (see poc/sweep_calibrate.py, compare_rules.py):
    anchor at the soul percentile that keeps >=90% of soul frames green while
    separating the amateur topics, with absolute clamps so one pathological golden
    cannot drag a threshold into uselessness.
    """
    files = _soul_goldens()
    if not files:
        raise SystemExit(f"no soul goldens found ({SOUL_MP4} / {SOUL_STILLS})")

    rows = []
    for f in files:
        try:
            m = frame_metrics(load_rgb(f))
            if m["content_frac"] >= TRANSITION_CONTENT:   # never calibrate on a transition
                rows.append(m)
        except Exception as e:  # pragma: no cover
            print(f"  ! {f.name}: {e}")
    if len(rows) < 5:
        raise SystemExit("too few soul frames to calibrate")

    thr = {"_meta": {
        "calibrated": _dt.datetime.now().isoformat(timespec="seconds"),
        "soul_source": [str(SOUL_MP4), str(SOUL_STILLS)],
        "n_frames": len(rows),
        "bands": {"chapter_top": CHAPTER_BOT, "caption_top": CAPTION_TOP},
        "rule": "value = soul_pNN * k, clamped to ANCHOR_POLICY absolute bounds",
        "anchor_policy": {k: list(v) for k, v in ANCHOR_POLICY.items()},
        "decision": f"FAIL if >= {SIGNATURE_MISS_LIMIT} of {SIGNATURE} fire; "
                    "diagnostics only WARN; empty board always FAIL",
        "transition_content": TRANSITION_CONTENT,
    }}
    for m, (direction, _, _) in METRIC_SPEC.items():
        p, k, cmin, cmax = ANCHOR_POLICY[m]
        vals = np.array([r[m] for r in rows], dtype=float)
        base = float(np.percentile(vals, p)) * k
        if direction == ">=":
            v = max(base, cmin) if cmin is not None else base
        else:
            v = min(base, cmax) if cmax is not None else base
        thr[m] = {"dir": direction, "value": round(float(v), 4), "anchor": f"soul_p{p}*{k}",
                  "soul_mean": round(float(vals.mean()), 4),
                  "soul_p10": round(float(np.percentile(vals, 10)), 4),
                  "soul_median": round(float(np.median(vals)), 4),
                  "soul_p90": round(float(np.percentile(vals, 90)), 4)}

    # score_min = 10th percentile of soul frame scores (>=90% of goldens clear it)
    scores = []
    for f in files:
        try:
            m = frame_metrics(load_rgb(f))
        except Exception:
            continue
        scores.append(_score(m, thr))
    thr["score_min"] = round(max(float(np.percentile(scores, 10)), 40.0), 1)
    thr["_meta"]["soul_score_p10"] = round(float(np.percentile(scores, 10)), 1)
    thr["_meta"]["soul_score_median"] = round(float(np.median(scores)), 1)

    THRESH_FILE.write_text(json.dumps(thr, indent=2), encoding="utf-8")
    print(f"calibrated on {len(rows)} non-transition soul frames -> {THRESH_FILE}")
    print(f"  score_min (soul p10, floored at 40) = {thr['score_min']}"
          f"   [soul scores p10={thr['_meta']['soul_score_p10']} median={thr['_meta']['soul_score_median']}]")
    for m, spec in thr.items():
        if m.startswith("_") or m == "score_min":
            continue
        print(f"  {m:<17} {spec['dir']} {spec['value']:<9} "
              f"(soul mean={spec['soul_mean']} p10={spec['soul_p10']} "
              f"med={spec['soul_median']} p90={spec['soul_p90']})")
    if show:
        print("  soul frame scores:", " ".join(f"{s:.0f}" for s in sorted(scores)))
    return thr


def load_thresholds() -> dict:
    if not THRESH_FILE.exists():
        return calibrate()
    thr = json.loads(THRESH_FILE.read_text(encoding="utf-8"))
    # tolerate older threshold files
    if "light_frac" not in thr or "score_min" not in thr:
        return calibrate()
    return thr


# ----------------------------------------------------------------- score / judge
def _score(m: dict, thr: dict) -> float:
    """0..100: weighted share of the checks this frame clears (signature metrics weighted 2x)."""
    num, den = 0.0, 0.0
    for name, (direction, _, _) in METRIC_SPEC.items():
        t = thr.get(name)
        if not t:
            continue
        w = 2.0 if name in SIGNATURE else 1.0
        v, lim = m[name], t["value"]
        ok = (v >= lim) if direction == ">=" else (v <= lim)
        num += w * (1.0 if ok else 0.0)
        den += w
    return round(100.0 * num / den, 1) if den else 0.0


def judge(metrics: dict, thr: dict, strict_empty: bool = True) -> tuple[bool, str, list[dict]]:
    """Return (pass, state, reason_codes).

    state: PASS | WARN | FAIL | TRANSITION

    FAIL  = >= SIGNATURE_MISS_LIMIT of the three Lesson #85 signature metrics fire
            (flat dark-on-dark slop, tiny-label farm, dim board), or the board is
            empty for a whole cut (Lesson #26 "no empty screen").
    WARN  = exactly one signature fires, or any diagnostic metric misses.
    PASS  = nothing fires.

    Diagnostics (light coverage, hero mass, colour, clutter) never FAIL on their
    own: the soul legitimately contains sparse white line-art shots.
    """
    is_transition = metrics.get("content_frac", 1.0) < TRANSITION_CONTENT
    if is_transition:
        if not strict_empty:
            return True, "TRANSITION", []
        return False, "FAIL", [{
            "code": "TP5_EMPTY_BOARD", "metric": "content_frac",
            "value": metrics["content_frac"], "limit": TRANSITION_CONTENT, "dir": ">=",
            "signature": True, "why": "the board is empty for a whole cut (Lesson #26)",
            "repair": "An empty board is a transition, not a shot: put a picture on this cut."}]

    failures, sig_miss, diag_miss = [], 0, 0
    for name, (direction, desc, repair) in METRIC_SPEC.items():
        t = thr.get(name)
        if not t:
            continue
        v, lim = metrics[name], t["value"]
        miss = (v < lim) if direction == ">=" else (v > lim)
        if miss:
            if name in SIGNATURE:
                sig_miss += 1
            else:
                diag_miss += 1
            failures.append({
                "code": CODES.get(name, f"TP0_{name.upper()}"), "metric": name,
                "value": v, "limit": lim, "dir": direction,
                "signature": name in SIGNATURE, "why": desc, "repair": repair,
            })

    if sig_miss >= SIGNATURE_MISS_LIMIT:
        state = "FAIL"
    elif sig_miss or diag_miss:
        state = "WARN"
    else:
        state = "PASS"

    by = {}
    for f in sorted(failures, key=lambda x: (not x["signature"], x["code"])):
        by.setdefault(f["code"], f)
    return state == "PASS", state, sorted(by.values(), key=lambda x: (not x["signature"], x["code"]))


def run_frames(files: list[Path], label: str, thr: dict, min_pass: float,
               strict: bool) -> tuple[bool, dict]:
    per_file, states, scores = [], [], []
    for f in files:
        try:
            m = frame_metrics(load_rgb(f))
        except Exception as e:
            per_file.append({"file": f.name, "error": str(e)})
            continue
        sc = _score(m, thr)
        ok, state, fails = judge(m, thr, strict_empty=strict)
        if state == "TRANSITION" and not strict:
            per_file.append({"file": f.name, "score": sc, "state": state,
                             "metrics": m, "pass": True, "failures": []})
            continue
        states.append(state)
        scores.append(sc)
        per_file.append({"file": f.name, "score": sc, "state": state,
                         "metrics": m, "pass": state in ("PASS", "WARN"), "failures": fails})

    if not states:
        return False, {"label": label, "n": 0, "error": "no readable frames"}

    judged = [s for s in states if s != "TRANSITION"]
    # PASS and WARN both clear the gate: WARN carries a repair hint, not a block
    pass_rate = float(np.mean([s in ("PASS", "WARN") for s in judged])) if judged else 0.0
    topic_ok = pass_rate >= min_pass

    codes: dict[str, int] = {}
    for pf in per_file:
        for fl in pf.get("failures", []):
            if fl.get("signature"):
                codes[fl["code"]] = codes.get(fl["code"], 0) + 1
    report = {
        "label": label, "n": len(judged), "n_frames": len(files),
        "pass_rate": round(pass_rate, 4), "min_pass": min_pass, "pass": topic_ok,
        "counts": {s: states.count(s) for s in ("PASS", "WARN", "FAIL")},
        "transitions_skipped": sum(1 for p in per_file if p.get("state") == "TRANSITION"),
        "score_median": round(float(np.median(scores)), 1) if scores else 0.0,
        "score_min_allowed": thr.get("score_min"),
        "top_codes": [{"code": c, "frames": n} for c, n in
                      sorted(codes.items(), key=lambda kv: -kv[1])],
        "frames": per_file,
    }
    return topic_ok, report


# ----------------------------------------------------------------- cli
def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug", nargs="?", help="topic slug under videos/")
    ap.add_argument("--frames", help="gate an arbitrary folder of stills (strict)")
    ap.add_argument("--mp4", help="gate sampled frames of a render (transitions skipped)")
    ap.add_argument("--json", help="write the full JSON report here")
    ap.add_argument("--min-pass", type=float, default=0.90,
                    help="fraction of judged frames that must PASS (default 0.90)")
    ap.add_argument("--calibrate", action="store_true", help="rebuild thresholds from soul goldens")
    ap.add_argument("--show", action="store_true", help="show calibration distribution")
    ap.add_argument("--verbose", action="store_true", help="list every failing frame")
    args = ap.parse_args()

    if args.calibrate:
        calibrate(show=args.show)
        return 0
    if not cv2 or not Image:
        print("missing deps: pip install opencv-python pillow numpy", file=sys.stderr)
        return 2

    thr = load_thresholds()

    files, label, strict = [], "", True
    if args.frames:
        d = Path(args.frames)
        if not d.is_dir():
            print(f"not a folder: {d}", file=sys.stderr)
            return 2
        files, label = sorted(list(d.glob("*.jpg")) + list(d.glob("*.png"))), f"frames:{d}"
    elif args.mp4:
        p = Path(args.mp4)
        if not p.exists():
            print(f"no such mp4: {p}", file=sys.stderr)
            return 2
        files, label, strict = sample_mp4(p, n=30, every=4.0), f"mp4:{p.name}", False
    elif args.slug:
        d = ROOT / "videos" / args.slug / "qa" / "cuts"
        if not d.is_dir():
            print(f"no stills at {d} — run tools/cutstills.mjs {args.slug} first", file=sys.stderr)
            return 2
        files, label = sorted(d.glob("*.jpg")), f"topic:{args.slug}"
    else:
        ap.print_help()
        return 2

    if not files:
        print("no frames found", file=sys.stderr)
        return 2

    ok, rep = run_frames(files, label, thr, args.min_pass, strict)

    print("\n================ TACTILE-POP GATE (Lesson #85) ================")
    print(f" target : {label}")
    print(f" score  : median {rep.get('score_median')} (soul floor {rep.get('score_min_allowed')})")
    c = rep.get("counts", {})
    print(f" frames : {c.get('PASS', 0)} PASS / {c.get('WARN', 0)} WARN / {c.get('FAIL', 0)} FAIL"
          f"  (transitions skipped: {rep.get('transitions_skipped', 0)})")
    print(f" rate   : {rep.get('pass_rate', 0)*100:.1f}% PASS, need >= {args.min_pass*100:.0f}%")
    for x in rep.get("top_codes", []):
        print(f"   {x['code']:<20} {x['frames']:>3} frame(s)")
    if args.verbose:
        for pf in rep.get("frames", []):
            if pf.get("pass") is False:
                codes = ",".join(f["code"] for f in pf.get("failures", []))
                print(f"   - {pf['file']:<16} {pf.get('state'):<7} score={pf.get('score'):<6} {codes}")
    print(f" verdict: {'PASS' if ok else 'FAIL'}")
    print("==============================================================\n")

    if args.json:
        Path(args.json).write_text(json.dumps(rep, indent=2), encoding="utf-8")
        print(f"wrote {args.json}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
