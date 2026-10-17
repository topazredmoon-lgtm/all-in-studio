#!/usr/bin/env python3
"""
tools/vlm_frame_qa.py  (track V-LOCAL-QA)

Per-frame visual craft QA backed by a local VLM (Qwen3-VL-4B via Ollama on
E:), with a zero-dependency heuristic fallback (open_clip/ImageHash-class
checks are already in the stack; here we use Pillow only).

For each sampled frame of a rendered MP4 it asks:
  "Does this frame look like amateur programmer-art (flat dark boxes,
  tiny labels, stiff linear animation, fake document headers) or like a
  high-craft documentary film (tactile white/cream cards, paper tooth,
  hand-drawn red-ink callouts, real photos, readable focal type, air)?
  Score 1-10 + one-line reason + verdict."

It also runs a cheap sync heuristic over the beat word timings
(dead air / gap between words) so bad sync is surfaced next to bad frames.

Ollama must be running (`ollama serve`, models on E:, e.g.
`ollama pull qwen3-vl:4b`). If Ollama is unreachable the tool degrades to
a Pillou-based heuristic and clearly flags FALLBACK_MODE — no hard failure,
no network, no cloud.

Writes `videos/<slug>/qa/vlm_frame_qa.json` and prints a summary. $0, local-first.

Designed to complement `tools/align_words.py`-style forced alignment
(which fixes sync, not quality) and `listen.py` (prosody/loudness).
"""
import argparse, base64, io, json, os, sys, tempfile
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError

ROOT = Path(__file__).resolve().parent.parent
VIDEOS = ROOT / "videos"
FPS = 30

# Ollama defaults. OLLAMA_MODELS on E: per UPG-R11; host override via --ollama-host.
DEFAULT_HOST = "http://localhost:11434"
DEFAULT_MODEL = "qwen3-vl:4b"
DEFAULT_FRAMES = 10
MAX_EDGE_PX = 768  # resize long edge before sending to the VLM (saves VRAM/time)

VLM_PROMPT = (
    "You are a senior documentary-film editor reviewing a single video frame "
    "from an investigative tech story. The stage is warm-black #0E0C0B with "
    "high-contrast white/cream tactile cards (#FFFFFF / #F6F2E8), paper tooth, "
    "hand-drawn red-ink callouts (#E63946), real archival photos, readable "
    "focal type (36-64px) and plenty of air. Amateur programmer-art is: flat "
    "dark #161411 boxes, tiny labels, stiff linear animation, fake HTML document "
    "headers, repeated generic icons.\n"
    "Rate this frame 1 (pure programmer-art) to 10 (Vox/Johnny Harris/Fern "
    "documentary frame).\n"
    "Answer EXACTLY one line: score: <1-10> | verdict: <PASS/WARN/FAIL> | "
    "reason: <one short sentence>\n"
    "PASS=8-10 tactile/craft. WARN=4-7 flat or empty. FAIL=1-3 programmer-art."
)


def die(msg, code=2):
    print(f"vlm_frame_qa: ERROR: {msg}", file=sys.stderr)
    sys.exit(code)


def ffprobe_duration(path: Path) -> float | None:
    import subprocess
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-of", "csv=p=0", str(path)], capture_output=True, text=True)
    if r.returncode == 0 and r.stdout.strip():
        try:
            return float(r.stdout.strip())
        except ValueError:
            return None
    return None


def extract_frames(mp4: Path, n: int, tmpdir: Path) -> list[Path]:
    """Evenly-sample `n` frames as PNGs via ffmpeg. Returns paths."""
    dur = ffprobe_duration(mp4)
    if not dur or dur <= 0:
        die(f"cannot probe duration of {mp4}")
    tmpdir.mkdir(parents=True, exist_ok=True)
    paths = []
    import subprocess
    for i in range(n):
        t = dur * (i + 0.5) / n
        out = tmpdir / f"frame_{i:02d}.png"
        r = subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t:.3f}", "-i", str(mp4),
                            "-frames:v", "1", "-q:v", "2", str(out)],
                           capture_output=True, text=True)
        if r.returncode != 0 or not out.exists() or out.stat().st_size < 1024:
            print(f"vlm_frame_qa: WARN: could not extract frame at t={t:.2f}s "
                  f"(rc={r.returncode}) err={r.stderr.strip()[:120]}", file=sys.stderr)
            continue
        paths.append(out)
    if not paths:
        die(f"no frames extracted from {mp4}")
    return paths


def resize_for_vlm(path: Path) -> Path:
    from PIL import Image
    im = Image.open(path).convert("RGB")
    w, h = im.size
    scale = min(1.0, MAX_EDGE_PX / max(w, h))
    if scale < 1.0:
        im = im.resize((int(w * scale), int(h * scale)), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="JPEG", quality=85)
    return buf.getvalue()


def ollama_chat_image(host: str, model: str, image_b64: str) -> str | None:
    """Ask Ollama about one image. Returns text or None on any failure."""
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": VLM_PROMPT, "images": [image_b64]}],
        "stream": False,
        "options": {"temperature": 0.2, "num_predict": 120},
    }
    try:
        req = Request(host.rstrip("/") + "/api/chat",
                      data=json.dumps(payload).encode("utf-8"),
                      headers={"Content-Type": "application/json"}, method="POST")
        with urlopen(req, timeout=60) as r:
            data = json.loads(r.read().decode("utf-8"))
        return (data.get("message") or {}).get("content", "")
    except (URLError, HTTPError, OSError, ValueError, KeyError) as e:
        print(f"vlm_frame_qa: WARN: Ollama request failed ({type(e).__name__}: {e})", file=sys.stderr)
        return None


import re
_SCORE_RE = re.compile(r"score:\s*(\d+(?:\.\d+)?)", re.I)
_VERDICT_RE = re.compile(r"verdict:\s*(\w+)", re.I)
_REASON_RE = re.compile(r"reason:\s*(.*)", re.I)


def parse_vlm(text: str) -> dict:
    m = _SCORE_RE.search(text)
    score = float(m.group(1)) if m else None
    mv = _VERDICT_RE.search(text)
    verdict = mv.group(1).upper() if mv else "WARN"
    mr = _REASON_RE.search(text)
    reason = mr.group(1).strip() if mr else (text.strip()[:160] or "no reason returned")
    if score is None:
        verdict = "WARN"
    return {"score": score, "verdict": verdict, "reason": reason, "raw": text.strip()[:300]}


def heuristic_frame_score(path: Path) -> dict:
    """Zero-dependency fallback: darkness, flatness, edge density, colour warmth."""
    from PIL import Image
    import numpy as np
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(np.float32) / 255.0
    h, w, _ = a.shape
    # overall darkness (flat dark boxes read as programmer-art)
    gray = a.mean(axis=2)
    darkness = float((gray < 0.18).mean())
    # low contrast / flatness: std of luminance
    flatness = float(gray.std())
    # edge density: simple gradient magnitude
    gx = np.abs(np.diff(gray, axis=1))[:-1, :]
    gy = np.abs(np.diff(gray, axis=0))[:, :-1]
    edge = float((np.maximum(gx, gy) > 0.06).mean())
    # colour warmth: stage #0E0C0B is warm; neutral/warm is good, cold blue-grey boxes are bad
    rch = a[:, :, 0].mean(); gch = a[:, :, 1].mean(); bch = a[:, :, 2].mean()
    warmth = rch - bch  # positive = warm (good for this studio), negative = cold
    # composite: craft frames are bright-ish (cards/paper), high edge, warm
    score = 10.0
    score -= 4.0 * min(darkness, 1.0)            # very dark = programmer-art
    score -= 3.0 * max(0.0, (0.12 - flatness) / 0.12)  # flat = bad
    score -= 2.0 * max(0.0, (0.04 - edge) / 0.04)   # no edges = empty/flat
    score -= 2.0 * max(0.0, (-0.03 - warmth) / 0.08) # cold tint = bad
    score = max(1.0, min(10.0, score))
    verdict = "PASS" if score >= 7 else ("WARN" if score >= 4 else "FAIL")
    reason = (f"heuristic fallback (Ollama unavailable): darkness={darkness:.2f} "
              f"flatness={flatness:.2f} edge={edge:.2f} warmth={warmth:+.2f}")
    return {"score": round(score, 1), "verdict": verdict, "reason": reason, "raw": "heuristic"}


def sync_heuristic(script: dict, vdir: Path) -> dict:
    """Dead-air / gap scan over per-beat word timings (sync quality proxy)."""
    audio_dir = vdir / "audio"
    issues = []
    max_gap = 0.0; dead_air = 0.0; total_words = 0
    for b in script.get("beats", []):
        bid = b.get("id", "?")
        wf = audio_dir / f"{bid}.words.json"
        if not wf.exists():
            continue
        try:
            words = json.loads(wf.read_text(encoding="utf-8"))
        except Exception:
            continue
        prev_e = None
        for w in words:
            total_words += 1
            s, e = float(w["s"]), float(w["e"])
            if prev_e is not None:
                gap = s - prev_e
                if gap > max_gap:
                    max_gap = gap
                if gap > 1.5:
                    dead_air += gap
                    issues.append({"beat": bid, "gap_s": round(gap, 2),
                                   "around": f"{w.get('w','')!r}"})
            prev_e = e
    return {"max_gap_s": round(max_gap, 2), "dead_air_s": round(dead_air, 2),
            "total_words": total_words, "issues": issues[:20],
            "note": "Prosody (pitch/inflection) is covered by tools/listen.py + TorchSquim; "
                    "this is only the dead-air/sync proxy."}


def main():
    ap = argparse.ArgumentParser(description="Local-VLM visual craft QA on rendered frames.")
    ap.add_argument("slug", help="Topic slug (e.g. ai-power-bill)")
    ap.add_argument("--mp4", default=None, help="Rendered MP4 (default: latest out/<slug>_vN.mp4)")
    ap.add_argument("--frames", type=int, default=DEFAULT_FRAMES, help="Frames to sample")
    ap.add_argument("--ollama-host", default=DEFAULT_HOST, help="Ollama base URL")
    ap.add_argument("--model", default=DEFAULT_MODEL, help="Ollama vision model")
    ap.add_argument("--temp-dir", default=None, help="Frame temp dir (default: system temp)")
    args = ap.parse_args()

    vdir = VIDEOS / args.slug
    if not vdir.is_dir():
        die(f"topic folder not found: {vdir}")
    script_file = vdir / "script.json"
    if not script_file.exists():
        die(f"script.json not found for '{args.slug}'")
    script = json.loads(script_file.read_text(encoding="utf-8"))

    # Pick MP4
    mp4 = Path(args.mp4) if args.mp4 else None
    if mp4 is None:
        cands = sorted((vdir / "out").glob(f"{args.slug}_v*.mp4")) if (vdir / "out").is_dir() else []
        if not cands:
            die(f"no rendered MP4 in {vdir}/out (pass --mp4)")
        mp4 = cands[-1]
    if not mp4.exists():
        die(f"MP4 not found: {mp4}")

    tmpdir = Path(args.temp_dir) if args.temp_dir else Path(tempfile.gettempdir()) / f"vlmqa-{args.slug}"
    frames = extract_frames(mp4, args.frames, tmpdir)

    # Try Ollama once to decide mode
    mode = "vlm"
    test = ollama_chat_image(args.ollama_host, args.model, base64.b64encode(resize_for_vlm(frames[0])).decode("ascii"))
    if test is None:
        mode = "heuristic"

    results = []
    for fp in frames:
        b64 = base64.b64encode(resize_for_vlm(fp)).decode("ascii")
        if mode == "vlm":
            text = ollama_chat_image(args.ollama_host, args.model, b64)
            res = parse_vlm(text) if text else heuristic_frame_score(fp)
            res["mode"] = "vlm" if text else "heuristic-fallback"
        else:
            res = heuristic_frame_score(fp)
            res["mode"] = "heuristic"
        res["frame"] = fp.name
        results.append(res)

    # Cleanup frames
    try:
        for fp in frames:
            fp.unlink(missing_ok=True)
        tmpdir.rmdir()
    except OSError:
        pass

    sync = sync_heuristic(script, vdir)
    verdicts = [r["verdict"] for r in results]
    scores = [r["score"] for r in results if isinstance(r["score"], (int, float))]
    overall = "PASS" if all(v == "PASS" for v in verdicts) and scores and min(scores) >= 7 else \
              ("FAIL" if any(v == "FAIL" for v in verdicts) or (scores and max(scores) < 4) else "WARN")

    report = {
        "slug": args.slug, "mp4": str(mp4), "mode": mode,
        "model": args.model if mode == "vlm" else None,
        "frames": len(results), "overall": overall,
        "min_score": round(min(scores), 1) if scores else None,
        "max_score": round(max(scores), 1) if scores else None,
        "sync": sync,
        "frames_detail": results,
    }
    qa_dir = vdir / "qa"
    qa_dir.mkdir(parents=True, exist_ok=True)
    out = qa_dir / f"vlm_frame_qa.json"
    out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"vlm_frame_qa {args.slug}: {mode} -> overall {overall} "
          f"(min {report['min_score']} / max {report['max_score']}, {len(results)} frames)")
    for r in results:
        print(f"  {r['frame']}: {r['verdict']} score={r['score']} | {r['reason']}")
    if sync["issues"]:
        print(f"  sync: {len(sync['issues'])} gap(s) > 1.5s, max_gap={sync['max_gap_s']}s, dead_air={sync['dead_air_s']}s")
    print(f"  report: {out}")
    sys.exit(0 if overall == "PASS" else 1)


if __name__ == "__main__":
    main()
