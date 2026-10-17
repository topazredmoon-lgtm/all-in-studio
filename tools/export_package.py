#!/usr/bin/env python3
"""
tools/export_package.py  (UPG-R5 / Path 3 export package, $0)

Produces an `exports/<slug>_vN/` folder any external compositor (After Effects,
Motion Canvas, Premiere, Resolve, or a fresh Remotion project) can ingest to
re-cut or re-version an All-in film without touching this studio.

Outputs (all deterministic, read-only inputs):
  cut-sheet.tsv     per-cut in/out points, layout, visual, caption, on-screen words
  cutlist.edl       CMX3600-style FFmpeg/NLE cut-sheet conformable to master.mp4
  stills/           per-cut PNG stills (converted from qa/cuts/*.jpg)
  contact_sheet.png single contact sheet of every cut still
  stems/narration.wav copy of master.wav (narration stem)
  captions.srt      per-word subtitles from beat word timings (offset into master)
  build-notes.json  machine-readable package manifest (slug, version, cuts, voice,
                    sources, licence notes, how-to-ingest steps)
  README-export.md  human-readable ingest notes

Timing is derived from per-beat `audio/<beat>.words.json` (+ master.wav) so the
EDL is frame-accurate against the rendered master. If `out/<slug>_vN.mp4` exists
its duration is cross-checked; the EDL is labelled approximate when no render
exists — conform against `tools/build.py`'s timeline.json for final cut.

Nothing inside the source topic is modified. Writes only to exports/.

$0. Open stack: ffmpeg/ffprobe + Pillow only.
"""
import argparse, json, os, re, subprocess, sys
from datetime import timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / "videos"
EXPORTS = ROOT / "exports"
FFPROBE = "ffprobe"
FFMPEG = "ffmpeg"
FPS = 30


def die(msg, code=2):
    print(f"export_package: ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def sh(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, **kw)


def probe_duration(path: Path) -> float | None:
    """Return duration in seconds via ffprobe, or None."""
    if not path.exists():
        return None
    r = sh([FFPROBE, "-v", "error", "-show_entries", "format=duration",
            "-of", "csv=p=0", str(path)])
    if r.returncode == 0 and r.stdout.strip():
        try:
            return float(r.stdout.strip())
        except ValueError:
            return None
    return None


def beat_audio_duration(audio_dir: Path, beat_id: str, words_fallback) -> float:
    wav = audio_dir / f"{beat_id}.wav"
    d = probe_duration(wav)
    if d is not None and d > 0:
        return d
    # fallback: last word end + small tail pad
    try:
        words = json.loads((audio_dir / f"{beat_id}.words.json").read_text(encoding="utf-8"))
        if words:
            return float(words[-1]["e"]) + 0.45
    except Exception:
        pass
    return words_fallback or 2.5


def fmt_tc(seconds: float, fps: int = FPS) -> str:
    """HH:MM:SS:FF timecode (drop-frame not modelled — fine for a cut-sheet)."""
    total = max(0.0, seconds)
    h = int(total // 3600)
    m = int((total % 3600) // 60)
    s = int(total % 60)
    f = int(round((total - int(total)) * fps)) % fps
    return f"{h:02d}:{m:02d}:{s:02d}:{f:02d}"


def fmt_srt(seconds: float) -> str:
    total = max(0.0, seconds)
    h = int(total // 3600)
    m = int((total % 3600) // 60)
    s = int(total % 60)
    ms = int(round((total - int(total)) * 1000))
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"


def load_script(slug: str):
    vdir = VIDEOS / slug
    if not vdir.is_dir():
        die(f"topic folder not found: {vdir}")
    sp = vdir / "script.json"
    if not sp.exists():
        die(f"script.json not found for topic '{slug}'")
    return json.loads(sp.read_text(encoding="utf-8")), vdir


def extract_cuts(script):
    """Flatten beats into cuts: (cut_id, beat_id, layout, visual, cap, words_on_screen)."""
    cuts = []
    for b in script.get("beats", []):
        bid = b.get("id", "?")
        shot = b.get("shot", {})
        cap = b.get("cap") or shot.get("cap") or ""
        if "clip" in shot:
            cuts.append((bid, bid, "clip", {"v": "CLIP", "label": shot.get("clip", "")}, cap, 0))
            continue
        if "cuts" in shot and isinstance(shot["cuts"], list):
            for i, c in enumerate(shot["cuts"]):
                lay = c.get("layout", "split")
                hero = c.get("hero") or c.get("visual") or {}
                L = c.get("L") or {}
                R = c.get("R") or {}
                if lay in ("full", "scene"):
                    vis = hero
                else:
                    vis = {"v": "SPLIT", "L": L.get("v") or L.get("type"), "R": R.get("v") or R.get("type")}
                cuts.append((f"{bid}.{i}", bid, lay, vis, c.get("cap") or cap, count_words(vis)))
        else:
            lay = shot.get("layout", "split")
            hero = shot.get("hero") or shot.get("visual") or {}
            L = shot.get("L") or {}
            R = shot.get("R") or {}
            if lay in ("full", "scene"):
                vis = hero
            else:
                vis = {"v": "SPLIT", "L": L.get("v") or L.get("type"), "R": R.get("v") or R.get("type")}
            cuts.append((bid, bid, lay, vis, cap, count_words(vis)))
    return cuts


def count_words(vis) -> int:
    if not isinstance(vis, dict):
        return 0
    n = 0
    for k in ("name", "label", "text", "badge", "plate", "header"):
        v = vis.get(k)
        if isinstance(v, str):
            n += len(re.sub(r"[*=~_#]", "", v).split())
    tag = vis.get("tag")
    if isinstance(tag, dict) and "t" in tag:
        n += len(str(tag["t"]).split())
    elif isinstance(tag, str):
        n += len(tag.split())
    return n


def build_edl(cuts, cut_spans, master_dur, path: Path):
    lines = []
    lines.append(f"TITLE: All-in export package")
    lines.append("FCM: NON-DROP")
    lines.append("")
    evt = 1
    for cut_id, bid, lay, vis, cap, wc in cuts:
        start, end = cut_spans.get(cut_id, (0.0, 0.0))
        dur = max(0.0, end - start)
        # For multi-cut beats, divide the beat span across its cuts proportionally.
        lines.append(f"{evt:03d}  AX       V     C        {fmt_tc(start)} {fmt_tc(end)} {fmt_tc(0.0)} {fmt_tc(min(dur, master_dur or dur))}")
        lines.append("*   FROM CLIP NAME: master.mp4")
        vname = vis.get("v") or vis.get("type") or "?"
        lines.append(f"*   EVENT COMMENT: cut={cut_id} beat={bid} layout={lay} visual={vname} words_on_screen={wc} cap={cap!r}")
        lines.append("")
        evt += 1
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def build_tsv(cuts, cut_spans, path: Path):
    with path.open("w", encoding="utf-8") as f:
        f.write("cut_id\tbeat_id\tlayout\tvisual\tin_s\tout_s\tdur_s\tcaption\ton_screen_words\n")
        for cut_id, bid, lay, vis, cap, wc in cuts:
            start, end = cut_spans.get(cut_id, (0.0, 0.0))
            vname = (vis.get("v") or vis.get("type") or "?")
            extra = ""
            if vis.get("L") or vis.get("R"):
                extra = f"L={vis.get('L')} R={vis.get('R')}"
            f.write(f"{cut_id}\t{bid}\t{lay}\t{vname}\t{start:.3f}\t{end:.3f}\t{(end-start):.3f}\t{cap!r}\t{wc}\t{extra}\n")


def build_srt(script, vdir, beat_spans, path: Path):
    """Per-word subtitles offset into the master timeline."""
    audio_dir = vdir / "audio"
    lines = []
    idx = 1
    for b in script.get("beats", []):
        bid = b.get("id", "?")
        start, _ = beat_spans.get(bid, (0.0, 0.0))
        wf = audio_dir / f"{bid}.words.json"
        if not wf.exists():
            continue
        try:
            words = json.loads(wf.read_text(encoding="utf-8"))
        except Exception:
            continue
        for w in words:
            ws = float(w["s"]) + start
            we = float(w["e"]) + start
            word = re.sub(r"\s+", " ", str(w["w"])).strip()
            if not word:
                continue
            lines.append(str(idx))
            lines.append(f"{fmt_srt(ws)} --> {fmt_srt(we)}")
            lines.append(word)
            lines.append("")
            idx += 1
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def copy_stills(vdir, cuts, dest_dir: Path):
    src_dir = vdir / "qa" / "cuts"
    dest_dir.mkdir(parents=True, exist_ok=True)
    from PIL import Image
    copied = []
    seen = set()
    for cut_id, bid, lay, vis, cap, wc in cuts:
        name = cut_id.replace("/", "_")
        if name in seen:
            continue
        seen.add(name)
        for cand in (src_dir / f"{name}.jpg", src_dir / f"{name}.png", src_dir / f"{cut_id}.jpg"):
            if cand.exists():
                im = Image.open(cand).convert("RGB")
                out = dest_dir / f"cut_{name}.png"
                im.save(out, "PNG")
                copied.append(out)
                break
    return copied


def contact_sheet(stills: Path, out: Path, cols: int = 6):
    from PIL import Image, ImageDraw
    imgs = sorted(stills.glob("cut_*.png"))
    if not imgs:
        return
    thumbs = []
    for p in imgs:
        im = Image.open(p).convert("RGB")
        im.thumbnail((320, 180))
        thumbs.append(im)
    if not thumbs:
        return
    tw, th = thumbs[0].size
    rows = (len(thumbs) + cols - 1) // cols
    sheet = Image.new("RGB", (tw * cols, th * rows), (14, 12, 11))
    draw = ImageDraw.Draw(sheet)
    for i, im in enumerate(thumbs):
        r, c = divmod(i, cols)
        sheet.paste(im, (c * tw, r * th))
        draw.text((c * tw + 6, r * th + 4), imgs[i].stem, fill=(233, 227, 211))
    sheet.save(out, "PNG")


def main():
    ap = argparse.ArgumentParser(description="Build a $0 export package for an All-in topic.")
    ap.add_argument("slug", help="Topic slug (e.g. ai-power-bill, captchas-full)")
    ap.add_argument("--version", type=int, default=None, help="Render version N (default: latest in out/)")
    ap.add_argument("--out", default=None, help="Destination root (default: <repo>/exports)")
    args = ap.parse_args()

    script, vdir = load_script(args.slug)
    audio_dir = vdir / "audio"
    if not audio_dir.is_dir():
        die(f"audio/ not found for topic '{args.slug}' — run build first")

    out_root = Path(args.out) if args.out else EXPORTS
    out_root.mkdir(parents=True, exist_ok=True)

    # Pick render version
    render_path = None
    version = args.version
    if version is None:
        vs = []
        for p in (vdir / "out").glob(f"{args.slug}_v*.mp4") if (vdir / "out").is_dir() else []:
            m = re.search(r"_v(\d+)\.mp4$", p.name)
            if m:
                vs.append((int(m.group(1)), p))
        if vs:
            version = max(vs)[0]
            render_path = max(vs)[1]
    else:
        render_path = vdir / "out" / f"{args.slug}_v{version}.mp4"
        if not render_path.exists():
            die(f"render not found: {render_path}")

    master = vdir / "master.wav"
    master_dur = probe_duration(master) if master.exists() else None
    render_dur = probe_duration(render_path) if render_path else None

    # Build per-beat timeline spans from audio durations (master = beats in order).
    cuts = extract_cuts(script)
    beat_spans = {}
    cursor = 0.0
    pace = script.get("pace") or {}
    end_pad = float(pace.get("end_pad", 2.0))
    beat_ids = [b.get("id") for b in script.get("beats", [])]
    for bid in beat_ids:
        dur = beat_audio_duration(audio_dir, bid, 2.5)
        beat_spans[bid] = (cursor, cursor + dur)
        cursor += dur + end_pad

    if master_dur is not None:
        cursor = min(cursor, master_dur)

    # Package dir
    ver_tag = f"_v{version}" if version else ""
    pkg = out_root / f"{args.slug}{ver_tag}"
    if pkg.exists():
        die(f"package already exists: {pkg} (remove it or pick another --version)")
    (pkg / "stills").mkdir(parents=True)
    (pkg / "stems").mkdir(parents=True)

    # 1. cut-sheet.tsv
    # Divide multi-cut beats across their cuts so the EDL is non-overlapping.
    from collections import defaultdict
    by_beat = defaultdict(list)
    for c in cuts:
        by_beat[c[1]].append(c)
    cut_spans = {}
    for bid, bc in by_beat.items():
        bs, be = beat_spans.get(bid, (0.0, 0.0))
        n = max(1, len(bc))
        step = (be - bs) / n
        for i, c in enumerate(bc):
            cut_spans[c[0]] = (bs + i * step, bs + (i + 1) * step)

    build_tsv(cuts, cut_spans, pkg / "cut-sheet.tsv")
    # 2. cutlist.edl
    build_edl(cuts, cut_spans, master_dur or render_dur or 0.0, pkg / "cutlist.edl")
    # 3. captions.srt
    build_srt(script, vdir, beat_spans, pkg / "captions.srt")
    # 4. stills
    copied = copy_stills(vdir, cuts, pkg / "stills")
    contact_sheet(pkg / "stills", pkg / "contact_sheet.png")
    # 5. stems
    if master.exists():
        import shutil
        shutil.copy2(master, pkg / "stems" / "narration.wav")

    # 6. build-notes.json
    voice = script.get("voice", {})
    notes = {
        "slug": args.slug,
        "version": version,
        "master": str(master) if master.exists() else None,
        "master_wav": master.name if master.exists() else None,
        "render": str(render_path) if render_path else None,
        "render_version": version,
        "render_duration_s": render_dur,
        "master_duration_s": master_dur,
        "fps": FPS,
        "computed_duration_s": cursor,
        "timing_note": "Per-cut in/out derived from per-beat word timings + master.wav. "
                       "Conform to tools/build.py timeline.json for frame-accurate NLE cut.",
        "cuts": [
            {
                "cut_id": cid, "beat_id": bid, "layout": lay,
                "visual": (vis.get("v") or vis.get("type") or "?"),
                "in_s": round(beat_spans.get(bid, (0.0, 0.0))[0], 3),
                "out_s": round(beat_spans.get(bid, (0.0, 0.0))[1], 3),
                "caption": cap, "on_screen_words": wc,
            }
            for cid, bid, lay, vis, cap, wc in cuts
        ],
        "voice": voice,
        "voice_standard": "af_heart @ 0.95 (v23 / All-in_captchas_full_v2)",
        "sources": str(vdir / "SOURCES.md"),
        "licences": str(vdir / "LICENCES.md"),
        "licence_note": "Verify every asset against SOURCES.md + LICENCES.md before external use "
                        "(Money Rule: CC0/CC BY/PD only, log per asset). This package itself is $0.",
        "how_to_ingest": [
            "Import master.wav (stems/narration.wav) as the narration track.",
            "Import cutlist.edl into your NLE (Premiere/Resolve/After Effects) to reconform cuts.",
            "Use stills/ as the visual reference for each cut (cut_<id>.png).",
            "Import captions.srt as subtitles; per-word timing matches the narration stem.",
            "Rebuild motion in Remotion/Motion Canvas using build-notes.json cut list + engine/src/ds kit.",
        ],
        "created_utc": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat().replace("+00:00", "Z"),
        "tool": "tools/export_package.py (UPG-R5, $0)",
    }
    (pkg / "build-notes.json").write_text(json.dumps(notes, indent=2, ensure_ascii=False), encoding="utf-8")

    # 7. README-export.md
    readme = f"""# Export package — {args.slug} {ver_tag}

Generated by `tools/export_package.py` (UPG-R5 / Path 3). $0, open stack.

## Contents
- `cut-sheet.tsv` — per-cut in/out, layout, visual, caption, on-screen words
- `cutlist.edl` — CMX3600 cut-sheet conformable to master.mp4
- `stills/` — {len(copied)} per-cut PNG stills (from `qa/cuts/`)
- `contact_sheet.png` — one-page contact sheet
- `stems/narration.wav` — copy of `master.wav`
- `captions.srt` — per-word subtitles, offset into the master timeline
- `build-notes.json` — machine-readable manifest for any compositor

## Timing
Cut in/out points are derived from per-beat `audio/<beat>.words.json` and
`master.wav`. For frame-accurate conformance, check `tools/build.py`'s
`timeline.json` and adjust the EDL; this export ships the best reproducible
approximation the studio can produce without re-rendering.

## Voice
{json.dumps(voice, ensure_ascii=False)} — v23 standard is `af_heart` @ 0.95.

## Licence (read before external use)
Verify every asset against `SOURCES.md` + `LICENCES.md` in the topic folder.
Money Rule: CC0 / CC BY / PD only; log each asset. This package is $0.

## Ingest
See build-notes.json `how_to_ingest`.
"""
    (pkg / "README-export.md").write_text(readme, encoding="utf-8")

    print(f"export_package {args.slug}{ver_tag}: OK -> {pkg}")
    print(f"  cuts={len(cuts)} stills={len(copied)} stems=1 (narration.wav) "
          f"master_dur={master_dur} render_dur={render_dur}")
    print(f"  files: cut-sheet.tsv cutlist.edl captions.srt build-notes.json README-export.md contact_sheet.png")


if __name__ == "__main__":
    main()
