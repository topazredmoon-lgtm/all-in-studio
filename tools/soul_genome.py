#!/usr/bin/env python3
"""Soul Genome — measure the canonical owner-approved films and enforce them (T-R2A).

WHY: every gate so far (tactile_pop_gate UPG-M1, craft_metrics UPG-L1) measures a NEW
render against hand-picked absolute thresholds loaned from one measurement session.
The thresholds drift from what the owner actually approved. This tool measures the
canonical renders themselves — All-in_captchas_full_v2.mp4 (the named soul artifact)
plus captchas_v23/v21_PERFECTED.mp4 — and writes the numbers as a durable artifact:

    studio/genome/soul_genome.json   (machine DNA: palette fractions, cut stats, layout mix)
    studio/genome/genome_card.png    (one-glance human card: palette, cut histogram, bands)

Then `gate` mode scores a candidate MP4's FILM-LEVEL fingerprint against the DNA bands
(WARN by default, `--strict` FAILs on the fatality axes). It does NOT replace per-cut
gates; it closes the film-level axis: "does this still look — and BREATHE — like the soul".

Cut detection: adjacent-frame changed-pixel peaks at 6 fps sampling (ffmpeg's own
`select=gt(scene)` misses sub-30%-pixel changes that dark-board films produce).

Usage:
  python tools/soul_genome.py extract [--fps 6]            # rebuild genome JSON + card
  python tools/soul_genome.py gate <mp4> [--strict] [--json out]
  python tools/soul_genome.py show

Dependencies: numpy + Pillow only. ffmpeg/ffprobe on PATH.
Contract: prints `FAIL [soul_genome] ...` lines only in --strict gate mode (exit 1).
"""
import argparse
import json
import math
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
GENOME_DIR = ROOT / "studio" / "genome"
GENOME_FILE = GENOME_DIR / "soul_genome.json"
CARD_FILE = GENOME_DIR / "genome_card.png"

CANON = {
    "captchas_full_v2": ROOT / "videos" / "captchas-full" / "out" / "All-in_captchas_full_v2.mp4",
    "captchas_v23": Path(r"C:\Users\pc\Music\captchas_v23_PERFECTED.mp4"),
    "captchas_v21": Path(r"C:\Users\pc\Music\captchas_v21_PERFECTED.mp4"),
}

BANNED_FLAT_DARK = (22, 20, 17)  # tokens.ts raised '#161411' — the Lesson #85 signature


def ffprobe_dims(src: Path):
    p = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0",
         "-show_entries", "stream=width,height,r_frame_rate,duration",
         "-of", "json", str(src)],
        capture_output=True, text=True,
    )
    st = json.loads(p.stdout or "{}").get("streams", [{}])[0]
    w = int(st.get("width", 1920)); h = int(st.get("height", 1080))
    dur = float(st.get("duration", 0) or 0)
    fps = 30.0
    try:
        num, den = (st.get("r_frame_rate") or "30/1").split("/")
        if float(den):
            fps = float(num) / float(den)
    except Exception:
        pass
    return w, h, dur, fps


def frame_stream(src: Path, fps: float, width: int = 480):
    """Yield (t_sec, np.uint8 RGB) at a sampling rate, downscaled. ffmpeg rawvideo pipe."""
    w, h, dur, _ = ffprobe_dims(src)
    s_h = max(1, round(width * h / w / 2) * 2)
    cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(src),
           "-vf", f"fps={fps},scale={width}:{s_h}", "-pix_fmt", "rgb24",
           "-f", "rawvideo", "pipe:1"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    nbytes = width * s_h * 3
    step = 1.0 / fps
    idx = 0
    buf = b""
    while True:
        while len(buf) < nbytes:
            if proc.stdout is None:
                break
            chunk = proc.stdout.read(nbytes - len(buf))
            if not chunk:
                break
            buf += chunk
        if len(buf) < nbytes:
            break
        frame = np.frombuffer(buf[:nbytes], dtype=np.uint8).reshape(s_h, width, 3)
        buf = buf[nbytes:]
        yield idx * step, frame
        idx += 1
    proc.wait(timeout=30)


def luma(frame: np.ndarray) -> np.ndarray:
    a = frame.astype(np.float32) / 255.0
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def frame_metrics(frame: np.ndarray, prev_l: np.ndarray | None, width_src: int = 480) -> dict:
    L = luma(frame)
    a = frame.astype(np.float32) / 255.0
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    mx = a.max(-1); mn = a.min(-1)
    sat = mx - mn
    fr: dict = {}
    fr["stage_frac"] = float(((L < 0.055) & (sat < 0.10)).mean())
    flat = (
        (np.abs(r * 255 - BANNED_FLAT_DARK[0]) < 10)
        & (np.abs(g * 255 - BANNED_FLAT_DARK[1]) < 11)
        & (np.abs(b * 255 - BANNED_FLAT_DARK[2]) < 11)
    )
    fr["flat_dark_frac"] = float(flat.mean())
    fr["cream_frac"] = float(((L > 0.60) & (sat < 0.30)).mean())
    fr["hero_white_frac"] = float(((L > 0.82) & (sat < 0.25)).mean())
    fr["red_frac"] = float(((r > g + 0.22) & (r > 0.5) & (g < 0.42) & (b < r)).mean())
    rg = r - g
    yb = 0.5 * (r + g) - b
    fr["colorfulness"] = float(
        math.sqrt(rg.std() ** 2 + yb.std() ** 2)
        + 0.3 * math.sqrt(rg.mean() ** 2 + yb.mean() ** 2)
    )
    img = Image.fromarray(frame).convert("L")
    small = img.resize((img.width // 3, img.height // 3))
    edges = np.asarray(small.filter(ImageFilter.FIND_EDGES), dtype=np.float32) / 255.0
    fr["edge_density"] = float(edges.mean())
    rows = L[int(L.shape[0] * 0.78):, :]
    fr["band_light_frac"] = float((rows > 0.45).mean())
    fr["band_std"] = float(rows.std())
    fr["mean_l"] = float(L.mean())
    fr["p995_l"] = float(np.quantile(L, 0.995))
    fr["lay_left"] = float(L[:, : int(L.shape[1] * 0.3)].mean())
    fr["lay_mid"] = float(L[:, int(L.shape[1] * 0.42): int(L.shape[1] * 0.58)].mean())
    fr["lay_right"] = float(L[:, int(L.shape[1] * 0.7):].mean())
    if prev_l is not None and prev_l.shape == L.shape:
        d = np.abs(L - prev_l)
        fr["frame_diff"] = float(d.mean())
        fr["changed_frac"] = float((d > 0.04).mean())
    else:
        fr["frame_diff"] = 0.0
        fr["changed_frac"] = 0.0
    return fr, L


def find_cuts(ts: list, changed: list) -> list:
    """Changed-pixel-fraction peak detector over sampled frames.

    Calibrated on the canon (v2 @12fps): thr = max(0.06, q90*1.05) => 169 clusters
    / 583 s = 3.45 s mean gap, matching the owner's 2-5 s cadence (Lesson #19).
    A cut is a sample whose changed_frac is a local max within +-1 sample,
    exceeds that threshold, and is >= 0.9 s from the previous accepted cut.
    """
    if len(changed) < 8:
        return []
    arr = np.asarray(changed[1:], dtype=np.float32)  # skip sample 0 (no diff)
    t_arr = np.asarray(ts[1:], dtype=np.float32)
    base = float(np.quantile(arr, 0.90))
    thr = max(0.06, base * 1.05)
    out = []
    for i in range(len(arr)):
        v = arr[i]
        if v < thr:
            continue
        lo = max(0, i - 1); hi = min(len(arr), i + 2)
        if v < arr[lo:hi].max() - 1e-9:
            continue
        t = float(t_arr[i])
        if out and t - out[-1] < 0.9:
            continue
        out.append(round(t, 3))
    return out


def cut_stats(times: list, dur: float) -> dict:
    edges = [0.0] + times + [dur]
    durs = [b - a for a, b in zip(edges, edges[1:])]
    durs = [d for d in durs if d >= 0.3]
    if not durs:
        return {}
    q = np.quantile(durs, [0.10, 0.25, 0.50, 0.75, 0.90, 0.95])
    return {
        "n_cuts": len(durs),
        "mean_s": round(float(np.mean(durs)), 2),
        "median_s": round(float(q[2]), 2),
        "p10_s": round(float(q[0]), 2),
        "p25_s": round(float(q[1]), 2),
        "p75_s": round(float(q[3]), 2),
        "p90_s": round(float(q[4]), 2),
        "p95_s": round(float(q[5]), 2),
        "max_s": round(float(max(durs)), 2),
        "share_under_5s": round(float(np.mean(np.array(durs) < 5.0)), 3),
        "share_under_3s": round(float(np.mean(np.array(durs) < 3.0)), 3),
    }


def script_layout_mix(vid_slug: str, mp4: Path) -> dict | None:
    """Supplemental EXACT layout mix from the topic's script.json — only if the script
    has not been edited after the render (honor drift)."""
    sdir = ROOT / "videos" / vid_slug
    sjson = sdir / "script.json"
    if not sjson.exists():
        return None
    if sjson.stat().st_mtime > mp4.stat().st_mtime:
        return None
    try:
        script = json.loads(sjson.read_text(encoding="utf-8"))
    except Exception:
        return None
    mix: dict = {}
    for b in script.get("beats", []):
        shot = b.get("shot", {}) if isinstance(b.get("shot"), dict) else {}
        cuts = shot.get("cuts") or b.get("cuts") or []
        if isinstance(cuts, dict):
            cuts = [cuts]
        if "clip" in b or shot.get("layout", "") == "clip" or any(
            isinstance(c, dict) and c.get("layout") == "clip" for c in cuts
        ):
            mix["clip"] = mix.get("clip", 0) + 1
            continue
        if isinstance(cuts, list) and cuts:
            okay = [c for c in cuts if isinstance(c, dict)]
            if okay:
                lay = okay[0].get("layout") or "split"
            else:
                lay = "split"
        else:
            lay = shot.get("layout") or "split"
        mix[lay] = mix.get(lay, 0) + 1
    total = sum(mix.values()) or 1
    return {k: {"n": n, "pct": round(100 * n / total, 1)} for k, n in sorted(mix.items(), key=lambda kv: -kv[1])}


def analyze(src: Path, fps: float, layout_slug: str | None = None) -> dict | None:
    if not src.exists():
        print(f"  [MISS] {src} (skipping)")
        return None
    w, h, dur, vfps = ffprobe_dims(src)
    agg: dict = {}
    changed_l: list = []
    ts_l: list = []
    n = 0
    t0 = time.time()
    prev_l = None
    for t, frame in frame_stream(src, fps):
        m, L = frame_metrics(frame, prev_l)
        prev_l = L
        for k, v in m.items():
            agg.setdefault(k, []).append(v)
        ts_l.append(t)
        changed_l.append(m["changed_frac"])
        n += 1
    dt = time.time() - t0
    out = {
        "path": str(src),
        "duration_s": round(dur, 2),
        "frames_sampled": n,
        "sample_fps": fps,
        "seconds_spent": round(dt, 1),
    }
    out["metrics"] = {
        k: {
            "mean": round(float(np.mean(v)), 4),
            "p25": round(float(np.quantile(v, 0.25)), 4),
            "p50": round(float(np.quantile(v, 0.50)), 4),
            "p75": round(float(np.quantile(v, 0.75)), 4),
            "p90": round(float(np.quantile(v, 0.90)), 4),
        } for k, v in agg.items()
    }
    cuts = find_cuts(ts_l, changed_l)
    out["cuts"] = cut_stats(cuts, dur)
    out["cuts"]["times_head"] = cuts[:80]
    out["motion_base_p90"] = round(float(np.quantile(np.asarray(changed_l), 0.90)), 4) if changed_l else 0.0
    if layout_slug:
        mix = script_layout_mix(layout_slug, src)
        if mix:
            out["script_layout_mix_exact"] = mix
    return out


def fused(srcs: list) -> dict:
    mkeys = set()
    for s in srcs:
        mkeys |= set(s["metrics"].keys())
    fm = {}
    for k in sorted(mkeys):
        vals = [s["metrics"][k]["mean"] for s in srcs if k in s["metrics"]]
        if vals:
            fm[k] = round(float(np.mean(vals)), 4)
    cuts = [s["cuts"] for s in srcs if s.get("cuts")]
    fc: dict = {}
    for k in ("mean_s", "median_s", "p10_s", "p25_s", "p75_s", "p90_s", "p95_s"):
        vals = [c[k] for c in cuts if k in c]
        if vals:
            fc[k] = round(float(np.mean(vals)), 2)
    if cuts:
        fc["n_cuts_total"] = sum(c.get("n_cuts", 0) for c in cuts)
        fc["share_under_5s_min"] = min((c.get("share_under_5s", 1) for c in cuts), default=1)
    return {"metrics": fm, "cut": fc}


def bands_for(genome: dict) -> dict:
    """Enforcement bands, derived from the ENFORCEMENT REFERENCE = the render the
    owner named (All-in_captchas_full_v2.mp4; falls back to fused). The other canon
    renders (v23/v21) are advisory blinkers only - MiMo (UPG-M9) proved v23's own
    artifact cards pre-date the Lesson #85 standard as it is read today."""
    ref_metrics = genome["fused"]["metrics"]
    ref_cut = genome["fused"].get("cut") or {}
    sources = genome.get("sources") or []
    ref = next((s["metrics"] for s in sources if s.get("id") == "captchas_full_v2"), None)
    ref_c = next((s.get("cuts") for s in sources if s.get("id") == "captchas_full_v2"), None)
    if ref:
        ref_metrics = {k: ref[k]["mean"] for k in ref}
        ref_cut = ref_c or ref_cut
    fd_ref_p90 = ref_p90(genome, "flat_dark_frac")
    # hero-white uses a MEAN floor, not p25: the canon's bottom quartile is full-bleed
    # photo stretches with zero white text, so a p25 floor is unsatisfiable even by v2
    # itself (the self-test tripped it). At these durations a film-level mean of ~8%+
    # cannot be faked by a single white blast, and means compare cleanly across films.
    hw_ref_mean = ref_metrics.get("hero_white_frac") or 0.0
    med = ref_cut.get("median_s") or 3.0
    return {
        "flat_dark_p90_cap": round(fd_ref_p90 * 1.15, 4),
        "cream_mean_floor": round(max(0.03, ref_metrics["cream_frac"] * 0.55), 4),
        "hero_white_mean_floor": round(hw_ref_mean * 0.55, 4),
        "cut_median_band": [round(med * 0.55, 2), round(med * 1.9, 2)],
        # the canon's own longest hold is legal by definition; only holds BEYOND it
        # (plus the statistical tail rule) count as dead holds
        "cut_max_cap": round(max(
            (ref_cut.get("p95_s") or (ref_cut.get("p90_s") or 8.0) * 1.3) * 2.6,
            (ref_cut.get("max_s") or 30.0) * 1.05,
        ), 2),
        "share_under_5s_floor": round(max(0.35, (ref_cut.get("share_under_5s") or 0.7) * 0.75), 3),
        "reference_source": "captchas_full_v2" if ref else "fused",
    }


def _ref_stat(genome: dict, key: str, stat: str) -> float | None:
    for s in genome.get("sources") or []:
        if s.get("id") == "captchas_full_v2" and key in s.get("metrics", {}):
            return s["metrics"][key].get(stat)
    return None


def ref_p90(genome: dict, key: str) -> float:
    v = _ref_stat(genome, key, "p90")
    if v is None:
        v = genome["fused"]["metrics"].get(key, 0.05)
    return v


def ref_p25(genome: dict, key: str) -> float:
    v = _ref_stat(genome, key, "p25")
    if v is None:
        v = genome["fused"]["metrics"].get(key, 0.0)
    return v


def gate_candidate(mp4: Path, genome: dict, strict: bool, sample_fps: float = 6.0, json_out: str | None = None) -> int:
    print(f"\n=== SOUL GENOME GATE: {mp4.name} ===")
    if mp4 == Path(genome["sources"][0]["path"]) or mp4.name in {Path(s["path"]).name for s in genome["sources"]}:
        print("  [INFO] candidate IS a canonical source; gate is self-referential here.")
    agg: dict = {}
    changed_l: list = []
    ts_l: list = []
    prev_l = None
    n = 0
    for t, frame in frame_stream(mp4, sample_fps):
        m, L = frame_metrics(frame, prev_l)
        prev_l = L
        for k, v in m.items():
            agg.setdefault(k, []).append(v)
        ts_l.append(t)
        changed_l.append(m["changed_frac"])
        n += 1
    if not n:
        print("FAIL [soul_genome] decode: no frames"); return 2
    w, h, dur, _ = ffprobe_dims(mp4)
    cuts = find_cuts(ts_l, changed_l)
    cs = cut_stats(cuts, dur)
    b = bands_for(genome)
    out = {"mp4": str(mp4), "frames": n, "duration_s": round(dur, 2), "cut": cs, "bands": b, "verdicts": []}
    verdicts: list = []

    def add(code, ok, msg, strict_fatal=False):
        verdicts.append({"code": code, "pass": bool(ok), "msg": msg, "strict_fatal": bool(strict_fatal)})
        if ok:
            print(f"  PASS [soul_genome] {code}")
        else:
            tag = "FAIL" if (strict and strict_fatal) else "WARN"
            print(f"  {tag} [soul_genome] {code}: {msg}")

    p90_flat = float(np.quantile(agg["flat_dark_frac"], 0.90))
    add("flat_dark_p90", p90_flat <= b["flat_dark_p90_cap"],
        f"flat-dark-capped p90={p90_flat:.4f} vs cap {b['flat_dark_p90_cap']:.4f} (ref {b['reference_source']})", strict_fatal=True)
    cream_mean = float(np.mean(agg["cream_frac"]))
    add("cream_pop", cream_mean >= b["cream_mean_floor"],
        f"cream/warm-light mean={cream_mean:.4f} vs floor {b['cream_mean_floor']:.4f}", strict_fatal=True)
    white_mean = float(np.mean(agg["hero_white_frac"]))
    add("white_heroes", white_mean >= b["hero_white_mean_floor"],
        f"hero-white mean={white_mean:.4f} vs floor {b['hero_white_mean_floor']:.4f}", strict_fatal=True)
    red_frames = sum(1 for v in agg["red_frac"] if v > 0.006)
    add("red_accent", red_frames >= max(3, int(n * 0.02)),
        f"red-accent frames={red_frames}/{n}", strict_fatal=False)
    med = cs.get("median_s") or 0.0
    band = b["cut_median_band"]
    add("cut_cadence", band[0] <= med <= band[1],
        f"cut median={med}s vs band {band}", strict_fatal=False)
    mx = cs.get("max_s") or 0.0
    add("no_dead_hold", mx <= b["cut_max_cap"],
        f"longest hold={mx}s vs cap {b['cut_max_cap']}s", strict_fatal=False)
    s5 = cs.get("share_under_5s") or 0.0
    add("changes_every_2_5s", s5 >= b["share_under_5s_floor"],
        f"share of cuts under 5s={s5} vs floor {b['share_under_5s_floor']} (Lesson #19)", strict_fatal=False)
    band_std = float(np.mean(agg["band_std"]))
    add("caption_alive", band_std >= 0.012,
        f"caption-band luminance std={band_std:.4f} (dead caption band?)", strict_fatal=False)
    fatal = [v for v in verdicts if (not v["pass"]) and v["strict_fatal"]]
    if strict and fatal:
        print(f"\nFAIL [soul_genome] overall — {len(fatal)} fatal axis outside the canon")
        rc = 1
    elif fatal:
        print(f"\nWARN overall: {len(fatal)} film-level axis outside the canon ({len(verdicts) - len(fatal)} axes inside)")
        rc = 0
    else:
        print("\nPASS overall: film fingerprint is inside the soul's DNA")
        rc = 0
    if json_out:
        out["verdicts"] = verdicts
        Path(json_out).write_text(json.dumps(out, indent=1), encoding="utf-8")
        print(f"  wrote {json_out}")
    return rc


def genome_card(genome: dict, out_png: Path):
    """One-glance card in the studio's own language: warm black, cream, one red."""
    Wc, Hc = 1400, 980
    card = Image.new("RGB", (Wc, Hc), (14, 12, 11))
    d = ImageDraw.Draw(card)
    try:
        title_f = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 40)
        h_f = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 26)
        n_f = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 20)
        s_f = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 16)
    except Exception:
        title_f = h_f = n_f = s_f = ImageFont.load_default()
    d.text((48, 34), "SOUL GENOME", font=title_f, fill=(244, 241, 234))
    d.text((48, 88), "measured from the owner-approved canon - numbers, not prose", font=s_f, fill=(138, 143, 152))
    m = genome["fused"]["metrics"]
    swatches = [
        ("stage #0E0C0B", (14, 12, 11)),
        ("raised BAN #161411", (22, 20, 17)),
        ("ink #F4F1EA", (244, 241, 234)),
        ("paper #EEE8DC", (238, 232, 220)),
        ("red #E63946", (230, 57, 70)),
        ("go #4FB286", (79, 178, 134)),
    ]
    x = 48
    for name, rgb in swatches:
        d.rectangle([x, 140, x + 150, 210], fill=rgb, outline=(80, 74, 70))
        d.text((x + 4, 216), name, font=s_f, fill=(138, 143, 152))
        x += 165
    bars = [
        ("stage_frac (dot-grid board)", m.get("stage_frac", 0)),
        ("flat_dark_frac (BANNED)", m.get("flat_dark_frac", 0)),
        ("cream_frac (paper/cards)", m.get("cream_frac", 0)),
        ("hero_white (cards)", m.get("hero_white_frac", 0)),
        ("red_frac (accent)", m.get("red_frac", 0)),
        ("edge_density (photo-ness)", m.get("edge_density", 0)),
    ]
    y = 270
    for name, val in bars:
        d.text((48, y), f"{name:<32}", font=n_f, fill=(138, 143, 152))
        d.rectangle([420, y + 2, 1040, y + 22], outline=(80, 74, 70))
        w2 = int(min(1.0, val) * 616)
        col = (230, 57, 70) if "BANNED" in name else (244, 241, 234)
        d.rectangle([422, y + 4, 422 + w2, y + 20], fill=col)
        d.text((1060, y), f"{val:.4f}", font=n_f, fill=(244, 241, 234))
        y += 42
    y += 18
    d.text((48, y), "CUT CADENCE (seconds between scene changes)", font=h_f, fill=(244, 241, 234))
    y += 44
    for s in genome["sources"]:
        c = s.get("cuts", {})
        if not c:
            continue
        name = Path(s["path"]).name
        d.text((48, y), f"{name[:44]:<44}", font=s_f, fill=(138, 143, 152))
        xx = 430
        for lbl in ("p10", "p25", "med", "p75", "p90"):
            v = c.get(f"{lbl if lbl != 'med' else 'median'}_s")
            if v is None:
                continue
            bw = int(min(v, 14) * 24)
            d.rectangle([xx, y, xx + max(3, bw), y + 18], fill=(230, 57, 70) if lbl == "med" else (244, 241, 234))
            d.text((xx, y + 22), f"{lbl}{v}", font=s_f, fill=(138, 143, 152))
            xx += bw + 34
        y += 58
    y += 6
    band = bands_for(genome)
    d.text((48, y), "ENFORCEMENT BANDS (fused)", font=h_f, fill=(244, 241, 234))
    y += 40
    for line in [
        f"flat_dark p90 <= {band['flat_dark_p90_cap']:.4f}",
        f"cream_frac mean >= {band['cream_mean_floor']:.4f}",
        f"cut median in [{band['cut_median_band'][0]}s .. {band['cut_median_band'][1]}s]",
        f"longest hold <= {band['cut_max_cap']}s   share<5s >= {band['share_under_5s_floor']}",
    ]:
        d.text((64, y), line, font=n_f, fill=(244, 241, 234))
        y += 30
    d.text((48, Hc - 42), "python tools/soul_genome.py extract|gate|show  -  UPG-R2A, glm-5.3-flash-free round2, 2026-10-17",
           font=s_f, fill=(110, 104, 99))
    out_png.parent.mkdir(parents=True, exist_ok=True)
    card.save(out_png)


def cmd_extract(args):
    GENOME_DIR.mkdir(parents=True, exist_ok=True)
    slug_map = {"captchas_full_v2": "captchas-full", "captchas_v23": None, "captchas_v21": None}
    use = CANON
    if args.src:
        use = {Path(p).stem: Path(p) for p in args.src}
    srcs = []
    for name, p in use.items():
        s = analyze(p, args.fps, slug_map.get(name))
        if s:
            s["id"] = name
            srcs.append(s)
    if not srcs:
        print("No canonical sources found."); return 2
    fu = fused(srcs)
    genome = {
        "schema": "soul_genome/1",
        "generated": datetime.now(timezone.utc).isoformat(),
        "sample_fps": args.fps,
        "sources": srcs,
        "fused": fu,
    }
    genome["bands"] = bands_for(genome)
    GENOME_FILE.write_text(json.dumps(genome, indent=1), encoding="utf-8")
    genome_card(genome, CARD_FILE)
    print(f"\nGenome written: {GENOME_FILE}")
    print(f"Genome card:    {CARD_FILE}")
    cmd_show(None)
    return 0


def cmd_show(_):
    if not GENOME_FILE.exists():
        print("No genome yet: run `python tools/soul_genome.py extract`"); return 2
    g = json.loads(GENOME_FILE.read_text(encoding="utf-8"))
    print("\n=== SOUL GENOME (fused from canonical renders) ===")
    for k, v in g["fused"]["metrics"].items():
        print(f"  {k:<22} {v}")
    print(f"  cut                    {g['fused']['cut']}")
    print(f"\nCanonical sources: {[Path(s['path']).name for s in g['sources']]}")


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    ex = sub.add_parser("extract")
    ex.add_argument("--fps", type=float, default=12.0)
    ex.add_argument("--src", action="append")
    gg = sub.add_parser("gate")
    gg.add_argument("mp4")
    gg.add_argument("--strict", action="store_true")
    gg.add_argument("--json", dest="json_out")
    gg.add_argument("--fps", type=float, default=12.0)
    sub.add_parser("show")
    args = ap.parse_args()
    if args.cmd == "extract":
        sys.exit(cmd_extract(args))
    elif args.cmd == "gate":
        genome = json.loads(GENOME_FILE.read_text(encoding="utf-8")) if GENOME_FILE.exists() else None
        if genome is None:
            print("No genome yet: run `python tools/soul_genome.py extract` first")
            sys.exit(2)
        sys.exit(gate_candidate(Path(args.mp4), genome, strict=args.strict, sample_fps=args.fps, json_out=args.json_out))
    else:
        sys.exit(cmd_show(None))


if __name__ == "__main__":
    main()
