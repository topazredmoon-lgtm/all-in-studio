#!/usr/bin/env python3
"""board_forensics.py — the missing bridge between the pixel gate and the code.

tactile_pop_gate.py (UPG-M1) says *that* a frame looks amateur. This tool says
*who* made it: it attributes every sampled frame to

    frame -> beat -> cut -> visual component(s) -> source file

so a healer (or a human) can go straight to `visuals/<topic>.tsx` line N instead
of re-watching a 15-minute render. It reuses tactile_pop_gate's metrics, thresholds
and judge() — one source of truth, no re-calibration — and adds:

  * exact CFR frame sampling (select=not(mod(n,STEP))) so t = n/fps is exact;
  * the same cueFrame cut mapping as Video.tsx / cutstills.mjs, so cut indices
    match the render 1:1;
  * per-visual and per-file aggregation: which component farms TP2/TP3/TP4;
  * worst-frame contact sheet with labels for one-glance review;
  * --all: a studio-wide ranking across every topic that has a render.

Outputs (default under research/board_forensics/, override with --out):
  <out>/<slug>.json            per-topic forensics
  <out>/forensics_all.json     studio-wide ranking (--all)
  <out>/<slug>_worst.jpg       worst-frame sheet (--sheet)

Usage
  python tools/board_forensics.py <slug> [--mp4 PATH] [--every 2.0] [--beats a02,a03]
                                  [--sheet] [--out DIR] [--include-clips]
  python tools/board_forensics.py --all [--every 4.0] [--sheet] [--out DIR]

Exit code: 0 always (analysis tool), 2 if it cannot run at all.
Pure numpy/Pillow/opencv + ffmpeg. Zero network.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import tactile_pop_gate as tpg  # noqa: E402  (metrics, thresholds, judge)

try:
    from PIL import Image, ImageDraw
except ImportError:  # pragma: no cover
    Image = None

ROOT = tpg.ROOT
NORM_RE = re.compile(r"[^a-z0-9$%]")
ALLOWED_SUFFIXES = {"s", "es", "d", "ed", "ing", "er", "ers", "ly"}


# --------------------------------------------------------------- timeline map
def norm(s: str) -> str:
    return NORM_RE.sub("", str(s).lower())


def match_word(wn: str, kn: str) -> bool:
    return wn == kn or (len(kn) >= 4 and wn.startswith(kn) and wn[len(kn):] in ALLOWED_SUFFIXES)


def cue_frame(words: list[dict], key, fallback: int) -> int:
    """Port of Video.tsx / cutstills.mjs cueFrame: exact same cut boundaries as the render."""
    if isinstance(key, (int, float)):
        return int(key)
    if not key:
        return fallback
    k_raw, _, nth = str(key).partition("#")
    k = norm(k_raw)
    target_n = int(nth or 1)
    seen = 0
    for w in words:
        if match_word(norm(w.get("w", "")), k):
            seen += 1
            if seen >= target_n:
                return max(0, w.get("f", 0) - 4)
    seen = 0
    for w in words:
        if norm(w.get("w", "")).startswith(k):
            seen += 1
            if seen >= target_n:
                return max(0, w.get("f", 0) - 4)
    return fallback


def beat_cut_starts(beat: dict) -> list[int]:
    """Frame offsets (within the beat) where each cut starts; [] when the beat is one shot."""
    shot = beat.get("shot") or {}
    cuts = shot.get("cuts")
    if not cuts:
        return []
    words = beat.get("words") or []
    return [0 if i == 0 else cue_frame(words, c.get("at"), round(beat["dur"] * i / len(cuts)))
            for i, c in enumerate(cuts)]


def visuals_of_one(one: dict) -> dict:
    """Extract {components, img, layout} from a single `One` shot spec (Video.tsx types)."""
    layout = one.get("layout", "?")
    comps: list[str] = []
    img = None
    if layout == "split":
        for side in ("L", "R"):
            spec = one.get(side) or {}
            if spec.get("v"):
                comps.append(str(spec["v"]))
            if spec.get("img"):
                img = str(spec["img"])
    elif layout in ("full", "scene"):
        hero = one.get("hero") or {}
        if hero.get("v"):
            comps.append(str(hero["v"]))
        if hero.get("img"):
            img = str(hero["img"])
    elif layout == "chapter":
        comps.append("Chapter")
        if one.get("img"):
            img = str(one["img"])
    return {"layout": layout, "components": comps, "img": img}


def attribute_frame(tl: dict, f: int) -> dict | None:
    """frame number -> {beat, cut, layout, components, img, kind}."""
    for b in tl["beats"]:
        if b["start"] <= f < b["start"] + b["dur"]:
            if "clip" in b:
                return {"beat": b["id"], "cut": None, "layout": "clip",
                        "components": [b["clip"].get("plate") or "Clip"],
                        "img": b["clip"].get("src"), "kind": "clip"}
            starts = beat_cut_starts(b)
            shot = b.get("shot") or {}
            if not starts:
                info = visuals_of_one(shot)
                return {"beat": b["id"], "cut": None, "kind": "board", **info}
            off = f - b["start"]
            idx = 0
            for i, s in enumerate(starts):
                nxt = starts[i + 1] if i + 1 < len(starts) else b["dur"]
                if s <= off < nxt:
                    idx = i
                    break
            info = visuals_of_one(shot["cuts"][idx])
            return {"beat": b["id"], "cut": idx, "kind": "board", **info}
    return None


# ------------------------------------------------------- component -> source file
_INDEX_CACHE: dict[str, list[str]] = {}


def component_index() -> dict[str, list[str]]:
    """name -> [source files] for every exported component in engine/src."""
    if _INDEX_CACHE:
        return _INDEX_CACHE
    src = ROOT / "engine" / "src"
    pat = re.compile(r"export\s+(?:const|function|class)\s+([A-Za-z_][\w]*)")
    if src.is_dir():
        for f in sorted(src.rglob("*.tsx")):
            try:
                text = f.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for m in pat.finditer(text):
                rel = str(f.relative_to(ROOT)).replace("\\", "/")
                _INDEX_CACHE.setdefault(m.group(1), []).append(rel)
    return _INDEX_CACHE


# ------------------------------------------------------------------ extraction
def probe_fps(mp4: Path, ff: str) -> float:
    try:
        out = subprocess.run([ff.replace("ffmpeg", "ffprobe"), "-v", "error", "-select_streams", "v:0",
                              "-show_entries", "stream=r_frame_rate", "-of", "csv=p=0", str(mp4)],
                             capture_output=True, text=True, check=True).stdout.strip()
        if "/" in out:
            num, den = out.split("/")
            v = float(num) / float(den or 1)
            return v if v > 0 else 30.0
        return float(out) or 30.0
    except Exception:
        return 30.0


def extract_frames(mp4: Path, ff: str, step: int, outdir: Path) -> list[tuple[int, Path]]:
    outdir.mkdir(parents=True, exist_ok=True)
    vf = f"select='not(mod(n\\,{step}))',scale=960:-1"
    cmd = [ff, "-hide_banner", "-loglevel", "error", "-i", str(mp4), "-vf", vf,
           "-fps_mode", "vfr", str(outdir / "f_%05d.png"), "-y"]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:  # older ffmpeg without -fps_mode
        cmd = [ff, "-hide_banner", "-loglevel", "error", "-i", str(mp4), "-vf", vf,
               "-vsync", "vfr", str(outdir / "f_%05d.png"), "-y"]
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0:
            raise RuntimeError(f"ffmpeg frame extraction failed: {r.stderr[:400]}")
    files = sorted(outdir.glob("f_*.png"))
    return [(i * step, p) for i, p in enumerate(files)]


# ------------------------------------------------------------------ analysis
def analyse_topic(slug: str, mp4: Path | None = None, every: float = 2.0,
                  only_beats: set[str] | None = None, include_clips: bool = False) -> dict:
    tl_p = ROOT / "engine" / "src" / "videos" / slug / "timeline.json"
    if not tl_p.exists():
        return {"topic": slug, "error": f"no timeline.json at {tl_p}"}
    tl = json.loads(tl_p.read_text(encoding="utf-8"))
    if mp4 is None:
        mp4 = pick_render(slug)
    if mp4 is None or not Path(mp4).exists():
        return {"topic": slug, "error": "no render found (videos/<slug>/out/*.mp4)"}
    mp4 = Path(mp4)
    ff = tpg._ffmpeg()
    if not ff:
        return {"topic": slug, "error": "ffmpeg not found"}
    fps = probe_fps(mp4, ff)
    step = max(1, round(fps * every))
    thr = tpg.load_thresholds()
    tmp = Path(tempfile.mkdtemp(prefix=f"bf_{slug}_"))
    pairs = extract_frames(mp4, ff, step, tmp)

    idx = component_index()
    frames = []
    for n, png in pairs:
        f = n  # frame number in the source video (CFR)
        t = f / fps
        att = attribute_frame(tl, f)
        if att is None:
            continue
        if att["beat"] and only_beats and att["beat"] not in only_beats:
            continue
        m = tpg.frame_metrics(tpg.load_rgb(png))
        ok, state, codes = tpg.judge(m, thr)
        score = tpg._score(m, thr)
        row = {
            "n": f, "t": round(t, 2), "score": score, "state": state,
            "codes": [c["code"] for c in codes],
            "why": [f"{c['code']}:{c['metric']}={c['value']}({c['dir']}{c['limit']})" for c in codes[:3]],
            "beat": att["beat"], "cut": att["cut"], "kind": att["kind"],
            "layout": att["layout"], "visuals": att["components"], "img": att["img"],
            "metrics": m,
        }
        if att["kind"] == "board" or include_clips:
            frames.append(row)

    by_visual: dict[str, dict] = {}
    by_file: dict[str, dict] = {}
    for r in frames:
        if r["state"] == "TRANSITION":
            continue
        for v in (r["visuals"] or ["(unknown)"]):
            d = by_visual.setdefault(v, {"visual": v, "frames": 0, "pass": 0, "warn": 0, "fail": 0,
                                         "worst_score": 101.0, "codes": {}, "files": sorted(set(idx.get(v, [])))})
            d["frames"] += 1
            if r["state"] in ("PASS", "WARN", "FAIL"):
                d[r["state"].lower()] += 1
            d["worst_score"] = min(d["worst_score"], r["score"])
            for c in r["codes"]:
                d["codes"][c] = d["codes"].get(c, 0) + 1
        for v in (r["visuals"] or []):
            for fl in idx.get(v, []) or ["(unresolved)"]:
                d = by_file.setdefault(fl, {"file": fl, "frames": 0, "fail": 0, "warn": 0, "worst_score": 101.0})
                d["frames"] += 1
                d["fail"] += r["state"] == "FAIL"
                d["warn"] += r["state"] == "WARN"
                d["worst_score"] = min(d["worst_score"], r["score"])

    states = [r["state"] for r in frames]
    n_fail, n_warn, n_pass = states.count("FAIL"), states.count("WARN"), states.count("PASS")
    n_judged = max(1, n_fail + n_warn + n_pass)
    worst = sorted([r for r in frames if r["state"] in ("FAIL", "WARN")], key=lambda r: r["score"])[:14]
    out = {
        "tool": "board_forensics", "version": 1,
        "generated": dt.datetime.now().isoformat(timespec="seconds"),
        "topic": slug, "mp4": str(mp4), "fps": fps, "every_s": every, "frames_measured": len(frames),
        "summary": {
            "pass": n_pass, "warn": n_warn, "fail": n_fail,
            "pass_rate": round(n_pass / n_judged, 4),
            "no_fail_rate": round((n_pass + n_warn) / n_judged, 4),
            "median_score": round(float(np.median([r["score"] for r in frames])) if frames else 0.0, 1),
            "score_min_floor": thr.get("score_min"),
        },
        "by_visual": sorted(by_visual.values(), key=lambda d: (-d["fail"], d["worst_score"])),
        "by_file": sorted([d for d in by_file.values() if d["fail"] or d["warn"]], key=lambda d: (-d["fail"], d["worst_score"])),
        "worst": worst,
        "frames": frames,
    }
    return out


def pick_render(slug: str) -> Path | None:
    out = ROOT / "videos" / slug / "out"
    if not out.is_dir():
        return None
    cands = [p for p in out.glob("*.mp4") if p.stat().st_size > 3_000_000]
    if not cands:
        cands = list(out.glob("*.mp4"))
    if not cands:
        return None
    return max(cands, key=lambda p: p.stat().st_mtime)


# ------------------------------------------------------------------ reporting
def print_report(res: dict) -> None:
    if "error" in res:
        print(f"board_forensics: {res['topic']}: {res['error']}")
        return
    s = res["summary"]
    print(f"\n================ BOARD FORENSICS · {res['topic']} ================")
    print(f" render : {Path(res['mp4']).name}   every {res['every_s']}s   {res['frames_measured']} board frames")
    print(f" verdict: {s['pass']} PASS / {s['warn']} WARN / {s['fail']} FAIL   strict pass {100*s['pass_rate']:.1f}%   no-fail {100*s.get('no_fail_rate', 0):.1f}%   median score {s['median_score']}")
    offenders = [d for d in res["by_visual"] if d["fail"] or d["warn"]][:10]
    if offenders:
        print(" by visual (who to fix):")
        for d in offenders:
            codes = " ".join(f"{c}x{n}" for c, n in sorted(d["codes"].items(), key=lambda kv: -kv[1])[:4])
            files = ", ".join(d["files"][:2]) or "(unresolved)"
            print(f"   {d['visual']:<22} fail {d['fail']:>2}/{d['frames']:<3} worst {d['worst_score']:>5}  {codes}   {files}")
    bf = res["by_file"][:6]
    if bf:
        print(" by file:")
        for d in bf:
            print(f"   {d['file']:<55} fail {d['fail']:>2} warn {d['warn']:>2} worst {d['worst_score']}")
    if res["worst"]:
        print(" worst frames:")
        for r in res["worst"][:8]:
            cut = f".c{r['cut']}" if r["cut"] is not None else ""
            print(f"   t={r['t']:>7.2f}s {r['beat']}{cut:<4} {','.join(r['visuals'])[:42]:<42} score {r['score']:>5}  {','.join(r['codes'])}")
    print("===================================================================")


def worst_sheet(res: dict, out_path: Path, tmpdir: Path, n: int = 18, title: str | None = None) -> Path | None:
    if Image is None or not res.get("worst"):
        return None
    ff = tpg._ffmpeg()
    rows = res["worst"][:n]
    thumbs = []
    for r in rows:
        p = tmpdir / f"{res['topic']}_{r['n']:06d}.png"
        if not p.exists():
            subprocess.run([ff, "-hide_banner", "-loglevel", "error", "-i", res["mp4"],
                            "-vf", f"select='eq(n\\,{r['n']})',scale=480:-1", "-frames:v", "1", str(p), "-y"],
                           capture_output=True)
        if p.exists():
            thumbs.append((Image.open(p).convert("RGB"), r))
    if not thumbs:
        return None
    tw, th = 480, 270
    cols = 3
    rows_n = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw, rows_n * (th + 26) + 30), (14, 12, 11))
    d = ImageDraw.Draw(sheet)
    d.text((8, 8), title or f"board_forensics · {res['topic']} · worst {len(thumbs)} frames (gate FAIL/WARN)", fill=(238, 232, 220))
    for i, (img, r) in enumerate(thumbs):
        cx, cy = (i % cols) * tw, 30 + (i // cols) * (th + 26)
        sheet.paste(img.resize((tw, th)), (cx, cy))
        cut = f".c{r['cut']}" if r["cut"] is not None else ""
        label = f"t={r['t']:.1f}s {r['beat']}{cut} {','.join(r['visuals'])[:34]} {r['score']:.0f} {','.join(c[:12] for c in r['codes'][:2])}"
        d.text((cx + 4, cy + th + 5), label, fill=(230, 224, 212))
    out_path.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(out_path, quality=88)
    return out_path


def main() -> int:
    ap = argparse.ArgumentParser(description="Attribute pixel-gate failures to cuts, components and source files")
    ap.add_argument("slug", nargs="?", help="topic slug")
    ap.add_argument("--all", action="store_true", help="scan every topic that has a render + timeline")
    ap.add_argument("--mp4", help="explicit mp4 (default: newest >3MB in videos/<slug>/out)")
    ap.add_argument("--every", type=float, default=2.0, help="sample period in seconds (default 2.0)")
    ap.add_argument("--beats", help="comma-separated beat ids to restrict to")
    ap.add_argument("--include-clips", action="store_true")
    ap.add_argument("--sheet", action="store_true", help="also write a worst-frame contact sheet")
    ap.add_argument("--out", default=str(ROOT / "research" / "board_forensics"))
    args = ap.parse_args()

    outdir = Path(args.out)
    outdir.mkdir(parents=True, exist_ok=True)
    only_beats = set(args.beats.split(",")) if args.beats else None

    if args.all:
        topics = sorted(p.name for p in (ROOT / "videos").iterdir()
                        if p.is_dir() and not p.name.startswith(("_", "."))
                        and (ROOT / "engine" / "src" / "videos" / p.name / "timeline.json").exists())
        results, all_worst, agg_visual, agg_file = [], [], {}, {}
        for t in topics:
            print(f"[forensics] {t} ...", flush=True)
            res = analyse_topic(t, every=args.every)
            if "error" in res:
                print(f"   skip: {res['error']}")
                continue
            print_report(res)
            (outdir / f"{t}.json").write_text(json.dumps(res, indent=1), encoding="utf-8")
            results.append({"topic": t, **{k: res[k] for k in ("mp4", "summary")}})
            all_worst += [{**r, "topic": t} for r in res["worst"]]
            for d in res["by_visual"]:
                a = agg_visual.setdefault(d["visual"], {"visual": d["visual"], "frames": 0, "fail": 0, "warn": 0,
                                                        "worst_score": 101.0, "codes": {}, "files": set(), "topics": set()})
                for k in ("frames", "fail", "warn"):
                    a[k] += d[k]
                a["worst_score"] = min(a["worst_score"], d["worst_score"])
                for c, n in d["codes"].items():
                    a["codes"][c] = a["codes"].get(c, 0) + n
                a["files"].update(d["files"])
                a["topics"].add(t)
            for d in res["by_file"]:
                a = agg_file.setdefault(d["file"], {"file": d["file"], "frames": 0, "fail": 0, "warn": 0, "worst_score": 101.0})
                for k in ("frames", "fail", "warn"):
                    a[k] += d[k]
                a["worst_score"] = min(a["worst_score"], d["worst_score"])
        for a in list(agg_visual.values()):
            a["files"] = sorted(a["files"]); a["topics"] = sorted(a["topics"])
        combined = {
            "tool": "board_forensics", "mode": "all", "generated": dt.datetime.now().isoformat(timespec="seconds"),
            "topics": results,
            "ranking_by_visual": sorted(agg_visual.values(), key=lambda d: (-d["fail"], d["worst_score"])),
            "ranking_by_file": sorted(agg_file.values(), key=lambda d: (-d["fail"], d["worst_score"])),
            "worst_frames": sorted(all_worst, key=lambda r: r["score"])[:40],
        }
        (outdir / "forensics_all.json").write_text(json.dumps(combined, indent=1), encoding="utf-8")
        print("\n=== STUDIO RANKING — components by FAIL count (all topics) ===")
        for d in combined["ranking_by_visual"][:15]:
            codes = " ".join(f"{c}x{n}" for c, n in sorted(d["codes"].items(), key=lambda kv: -kv[1])[:3])
            print(f"  {d['visual']:<24} fail {d['fail']:>4}/{d['frames']:<4} worst {d['worst_score']:>6}  {codes}  [{','.join(d['files'][:1])}]")
        print("\n=== STUDIO RANKING — files ===")
        for d in combined["ranking_by_file"][:12]:
            print(f"  {d['file']:<58} fail {d['fail']:>4} warn {d['warn']:>4} worst {d['worst_score']}")
        (outdir / "STUDIO-RANKING.md").write_text(ranking_md(combined), encoding="utf-8")
        print(f"\nwrote {outdir / 'forensics_all.json'} + STUDIO-RANKING.md")
        return 0

    if not args.slug:
        ap.print_help()
        return 2
    res = analyse_topic(args.slug, Path(args.mp4) if args.mp4 else None, every=args.every,
                        only_beats=only_beats, include_clips=args.include_clips)
    print_report(res)
    if "error" in res:
        return 0
    jp = outdir / f"{args.slug}.json"
    jp.write_text(json.dumps(res, indent=1), encoding="utf-8")
    print(f"wrote {jp}")
    if args.sheet:
        tmp = Path(tempfile.mkdtemp(prefix="bf_sheet_"))
        sp = worst_sheet(res, outdir / f"{args.slug}_worst.jpg", tmp)
        if sp:
            print(f"wrote {sp}")
    return 0


def ranking_md(c: dict) -> str:
    L = ["# Studio board-forensics ranking", "", f"generated {c['generated']} · tool board_forensics.py (pixel gate: tactile_pop_gate)", ""]
    L += ["## Components ranked by gate FAILs", "", "| visual | fail/frames | worst | codes | file |", "|---|---|---|---|---|"]
    for d in c["ranking_by_visual"][:30]:
        codes = " ".join(f"{k}x{v}" for k, v in sorted(d["codes"].items(), key=lambda kv: -kv[1])[:4])
        L.append(f"| {d['visual']} | {d['fail']}/{d['frames']} | {d['worst_score']} | {codes} | {', '.join(d['files'][:1])} |")
    L += ["", "## Files", "", "| file | fail | warn | worst |", "|---|---|---|---|"]
    for d in c["ranking_by_file"][:30]:
        L.append(f"| {d['file']} | {d['fail']} | {d['warn']} | {d['worst_score']} |")
    L += ["", "## Worst frames", "", "| topic | t | beat.cut | visuals | score | codes |", "|---|---|---|---|---|---|"]
    for r in c["worst_frames"][:30]:
        cut = f".c{r['cut']}" if r.get("cut") is not None else ""
        L.append(f"| {r['topic']} | {r['t']} | {r['beat']}{cut} | {','.join(r['visuals'])} | {r['score']} | {','.join(r['codes'])} |")
    L += ["", "## Per-topic summary", "", "| topic | render | pass/warn/fail | pass% | median |", "|---|---|---|---|---|"]
    for t in c["topics"]:
        s = t["summary"]
        L.append(f"| {t['topic']} | {Path(t['mp4']).name} | {s['pass']}/{s['warn']}/{s['fail']} | {100*s['pass_rate']:.1f} | {s['median_score']} |")
    return "\n".join(L) + "\n"


if __name__ == "__main__":
    raise SystemExit(main())
