#!/usr/bin/env python3
"""sync_audit.py — word-sync integrity: measure Whisper-transcript drift against forced alignment, and fix it.

Why this exists
  Every cue timing in the studio comes from `audio/<beat>.words.json`, and that file is
  written by tts.py from *Whisper transcription* word timestamps, which LEARNINGS #42
  measures as running early by up to 0.1 s. tools/align_words.py (forced alignment to the
  known script text) exists but is a no-op on any already-voiced line: it skips whenever
  words.json exists, and tts.py always writes words.json. So in practice the studio still
  cues on transcription timestamps, never on forced alignment.

What this tool does
  For every narrated beat it force-aligns the known script text to the line's wav and
  compares the result, word by word, against words.json:

    p50 / p90 / max |Δstart|   per line and per topic (the real cue error, in ms)
    dropped words              script words that never show up in words.json (TTS dropout)
    extra words                words.json tokens not in the script (drift noise)

  --fix rewrites words.json timestamps with the forced-alignment values (spelling is kept
  as-is so every existing gate sees the same tokens), with a backup. Re-run tools/build.py
  after --fix to propagate timings into timeline.json.

Backends
  stable  (default) stable-ts align() on small.en — offline, already cached for tts.py.
  mms     (opt-in)  torchaudio MMS_FA CTC forced alignment — a truly independent model —
                    needs a one-time ~1.2 GB download; set TORCH_HOME to E:/torch-cache to keep C: clean:
                      set TORCH_HOME=E:/torch-cache   (then: --backend mms)
  auto              mms if its checkpoint is already cached, else stable.

Usage
  python tools/sync_audit.py <slug> [--beat a02] [--threshold 0.08] [--fix] [--warn-only]
                              [--backend stable|mms|auto] [--limit N] [--report DIR]

Exit: 0 clean · 1 drift/dropout FAIL · 2 cannot run.
Runs happily under the system interpreter (delegates to ALLIN_VOICE_PY when torch is missing).
"""
from __future__ import annotations

import argparse
import datetime as dt
import difflib
import json
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NORM_RE = re.compile(r"[^a-z0-9]")
ALLOWED_SUFFIXES = {"s", "es", "d", "ed", "ing", "er", "ers", "ly"}


def norm(w: str) -> str:
    return NORM_RE.sub("", str(w).lower())


def prefix_match(script_word: str, heard: str) -> bool:
    a, b = norm(script_word), norm(heard)
    if not a or not b:
        return False
    if a == b:
        return True
    if a.startswith(b) or b.startswith(a):
        return True
    return False


# ------------------------------------------------------------------ backends
def _ensure_torch() -> bool:
    try:
        import torch  # noqa: F401
        return True
    except ImportError:
        return False


def delegate_to_voice_py(argv: list[str]) -> int:
    voice_py = os.environ.get("ALLIN_VOICE_PY")
    if voice_py and Path(voice_py).exists() and Path(voice_py) != Path(sys.executable):
        return subprocess.call([voice_py, str(Path(__file__).resolve()), *argv])
    print("FAIL [sync_audit] torch/stable-whisper not importable and ALLIN_VOICE_PY is not set")
    return 2


_MODEL = {}


def align_stable(wav: Path, text: str):
    import stable_whisper
    if "m" not in _MODEL:
        _MODEL["m"] = stable_whisper.load_model("small.en", device="cuda")
    res = _MODEL["m"].align(str(wav), text, language="en")
    words = []
    for seg in res.segments:
        for w in (seg.words or []):
            tok = (w.word or "").strip()
            if tok:
                words.append({"w": tok, "s": float(w.start), "e": float(w.end)})
    return words


def mms_available() -> bool:
    cands = [os.environ.get("TORCH_HOME"), r"E:/torch-cache", str(Path.home() / ".cache" / "torch")]
    for c in cands:
        if not c:
            continue
        p = Path(c) / "hub" / "checkpoints"
        if p.is_dir() and any(f.name.startswith("model") and f.suffix == ".pt" for f in p.glob("*.pt")):
            return True
    return False


def align_mms(wav: Path, text: str):
    import soundfile as sf
    import torch
    import torchaudio
    bundle = torchaudio.pipelines.MMS_FA
    model = _MODEL.get("mms")
    if model is None:
        model = bundle.get_model()
        model.eval()
        _MODEL["mms"] = model
    tokenizer = bundle.get_tokenizer()
    aligner = bundle.get_aligner()

    words = re.findall(r"[A-Za-z']+|\d[\d.,]*", text)  # digits matter: years/prices must align too
    flat, spans = [], []
    for w in words:
        try:
            toks = tokenizer(re.sub(r"[^a-z0-9]", "", w.lower()))
        except Exception:  # noqa: BLE001 — never let one odd token kill the backend
            toks = []
        spans.append((len(flat), len(flat) + len(toks)))
        flat += toks
    if not flat:
        return []

    data, sr = sf.read(str(wav), dtype="float32")
    if data.ndim > 1:
        data = data.mean(1)
    wav_t = torch.from_numpy(data).unsqueeze(0)
    if sr != bundle.sample_rate:
        wav_t = torchaudio.functional.resample(wav_t, sr, bundle.sample_rate)
    with torch.inference_mode():
        emissions, _ = model(wav_t)
    token_spans = aligner(emissions[0], flat)  # List[List[TokenSpan]] — one list per token
    ratio = wav_t.shape[1] / emissions.shape[1] / bundle.sample_rate  # seconds per emission frame
    out = []
    for w, (a, b) in zip(words, spans):
        if a >= len(token_spans) or b - 1 >= len(token_spans):
            continue
        first, last = token_spans[a], token_spans[b - 1]
        if not first or not last:
            continue
        s0 = first[0].start if hasattr(first[0], "start") else first[0][0]
        e0 = last[-1].end if hasattr(last[-1], "end") else last[-1][1]
        out.append({"w": w, "s": float(s0) * ratio, "e": float(e0) * ratio})
    return out


# ------------------------------------------------------------------ compare
UNITS = {"zero": 0, "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8,
         "nine": 9, "ten": 10, "eleven": 11, "twelve": 12, "thirteen": 13, "fourteen": 14, "fifteen": 15,
         "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19, "twenty": 20, "thirty": 30,
         "forty": 40, "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90}
SCALES = {"hundred": 100, "thousand": 1000, "million": 1000000, "billion": 1000000000, "trillion": 1000000000000}
FILLERS = {"dollar", "dollars", "cent", "cents", "percent", "pct"}


def _digit_value(tok: str):
    t = re.sub(r"[$,%£€]", "", str(tok)).replace(",", "").strip(".")
    if re.fullmatch(r"\d+(\.\d+)?", t or ""):
        return int(float(t))
    return None


def _run_value(vals: list[int]):
    """[30, 1000000000] -> 30e9; [2,100,60,9] -> 269; [19,70,6] -> 1976 (year)."""
    if not vals:
        return None
    total, current = 0, 0
    for v in vals:
        if v == 100:
            current = (current or 1) * 100
        elif v >= 1000:
            total += (current or 1) * v
            current = 0
        else:
            current += v
    naive = total + current
    if len(vals) >= 2 and 10 <= vals[0] <= 99:
        rest = 0
        ok = True
        for v in vals[1:]:
            if v == 100:
                rest = (rest or 1) * 100
            elif v >= 1000:
                ok = False
                break
            else:
                rest += v
        if ok and 10 <= rest <= 99 and (vals[0] % 10 == 0 or vals[0] <= 19):
            year = vals[0] * 100 + rest
            if len(vals[1:]) <= 2 or vals[0] <= 19:
                return year
    return naive


def canonical_units(words: list[str]) -> list[dict]:
    """Word list -> matched units: [{c: canonical, a: first_idx, b: last_idx, words: [raw]}].

    Number phrases are canonicalized on BOTH sides so `$30 billion`, `thirty billion` and
    `thirty-billion-dollar` all become '#30000000000': currency/percent words are fillers,
    hyphenated compounds are split, digit and word forms parse to the same value.
    """
    # stitch digit-group fragments split across tokens ("90" + ",000" -> "90,000"); keep original spans
    adj: list[tuple[str, int, int]] = []
    for i, w in enumerate(words):
        sw = str(w)
        if re.fullmatch(r"[.,]\d{3}", sw) and adj and re.fullmatch(r"[\d,.]*\d", adj[-1][0]):
            t, a0, _ = adj[-1]
            adj[-1] = (t + sw, a0, i)
        else:
            adj.append((sw, i, i))

    pieces = []  # (kind, value, token_id_into_adj)
    for j, (wtxt, _, _) in enumerate(adj):
        for piece in re.split(r"[^A-Za-z0-9$.,%]+", wtxt):
            if not piece:
                continue
            d = _digit_value(piece)
            lp = re.sub(r"[^a-z]", "", piece.lower())
            if "%" in piece:
                if d is not None:
                    pieces.append(("num", d, j))
                pieces.append(("filler", "percent", j))
            elif d is not None:
                pieces.append(("num", d, j))
            elif lp in UNITS:
                pieces.append(("num", UNITS[lp], j))
            elif lp in SCALES:
                pieces.append(("scale", SCALES[lp], j))
            elif lp in FILLERS:
                pieces.append(("filler", lp, j))
            else:
                pieces.append(("word", lp, j))

    units, i, N = [], 0, len(pieces)
    while i < N:
        kind, val, tok = pieces[i]
        starts_run = kind in ("num", "scale") or (kind == "filler" and val in ("percent", "pct"))
        if starts_run:
            j = i
            while j < N and pieces[j][0] in ("num", "scale", "filler"):
                j += 1
            run = pieces[i:j]
            vals = [p[1] for p in run if p[0] != "filler"]
            if any(p[0] != "filler" for p in run):
                v = _run_value(vals)
                if v is not None:
                    ordered = list(dict.fromkeys(p[2] for p in run))
                    units.append({"c": "#" + str(v),
                                  "a": adj[ordered[0]][1], "b": adj[ordered[-1]][2],
                                  "words": [adj[k][0] for k in ordered]})
                    i = j
                    continue
        a0, b0 = adj[tok][1], adj[tok][2]
        code = ("w:" + val) if kind in ("word", "filler") else ("#" + str(val))
        units.append({"c": code, "a": a0, "b": b0, "words": [adj[tok][0]]})
        i += 1
    return units


def compare(whisper_words: list[dict], aligned_words: list[dict]) -> dict:
    hw = [w.get("w", "") for w in whisper_words]
    aw = [w.get("w", "") for w in aligned_words]
    hu = canonical_units(hw)
    au = canonical_units(aw)
    sm = difflib.SequenceMatcher(None, [u["c"] for u in hu], [u["c"] for u in au], autojunk=False)
    diffs, dropped = [], []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                h, a = hu[i1 + k], au[j1 + k]
                ww = whisper_words[h["a"]]
                we_h = whisper_words[h["b"]]
                aw_s = aligned_words[a["a"]]
                aw_e = aligned_words[a["b"]]
                diffs.append({
                    "word": " ".join(h["words"]),
                    "whisper_s": round(float(ww["s"]), 3), "whisper_e": round(float(we_h["e"]), 3),
                    "align_s": round(float(aw_s["s"]), 3), "align_e": round(float(aw_e["e"]), 3),
                    "ds": round(float(aw_s["s"]) - float(ww["s"]), 3),
                    "de": round(float(aw_e["e"]) - float(we_h["e"]), 3),
                })
        elif tag in ("delete", "replace"):
            for k in range(i1, i2):
                dropped.append(" ".join(hu[k]["words"]))
    extra = [" ".join(au[j]["words"]) for tag, i1, i2, j1, j2 in sm.get_opcodes()
             if tag in ("insert", "replace") for j in range(j1, j2)]
    return {"diffs": diffs, "dropped": dropped, "extra": extra}


def audit_line(wav: Path, script_text: str, whisper_words: list[dict], backend: str):
    aligned = None
    used = None
    err = None
    try:
        if backend == "stable":
            aligned = align_stable(wav, script_text)
            used = "stable"
        elif backend == "mms":
            try:
                aligned = align_mms(wav, script_text)
                used = "mms"
            except Exception as e:  # noqa: BLE001
                err = f"mms failed ({e}); fell back to stable"
                aligned = align_stable(wav, script_text)
                used = "stable"
    except Exception as e:  # noqa: BLE001
        return {"error": str(e)[:200]}
    if not aligned:
        return {"error": "no aligned words"}
    cmp = compare(whisper_words, aligned)
    ds = [abs(d["ds"]) for d in cmp["diffs"]]
    de = [abs(d["de"]) for d in cmp["diffs"]]
    import numpy as _np
    return {
        "backend": used, "note": err,
        "n": len(cmp["diffs"]),
        "p50_ds": round(float(_np.percentile(ds, 50)), 3) if ds else None,
        "p90_ds": round(float(_np.percentile(ds, 90)), 3) if ds else None,
        "max_ds": round(float(max(ds)), 3) if ds else None,
        "p50_de": round(float(_np.percentile(de, 50)), 3) if de else None,
        "max_de": round(float(max(de)), 3) if de else None,
        "bias_ds": round(float(_np.mean([d["ds"] for d in cmp["diffs"]])), 3) if ds else None,
        "dropped": cmp["dropped"], "extra": cmp["extra"],
        "worst": sorted(cmp["diffs"], key=lambda d: -abs(d["ds"]))[:3],
        "diffs": cmp["diffs"], "aligned": aligned,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("slug")
    ap.add_argument("--beat", help="single beat id")
    ap.add_argument("--threshold", type=float, default=0.08, help="max |Δstart| tolerated, seconds (default 0.08)")
    ap.add_argument("--fix", action="store_true", help="rewrite words.json timings from the forced alignment (backup kept)")
    ap.add_argument("--warn-only", action="store_true")
    ap.add_argument("--backend", choices=["stable", "mms", "auto"], default="auto")
    ap.add_argument("--limit", type=int, help="audit at most N lines (test mode)")
    ap.add_argument("--report", default=str(ROOT / "research" / "sync_audit"))
    args = ap.parse_args()

    if not _ensure_torch():
        return delegate_to_voice_py([a for a in sys.argv[1:]])

    backend = args.backend
    if backend == "auto":
        backend = "mms" if mms_available() else "stable"
    print(f"[sync_audit] backend={backend} (set TORCH_HOME=E:\\torch-cache + --backend mms for the independent model)")

    vid = args.slug
    vdir = ROOT / "videos" / vid
    script_f = vdir / "script.json"
    if not script_f.exists():
        print(f"FAIL [sync_audit] no script.json for '{vid}'")
        return 2
    script = json.loads(script_f.read_text(encoding="utf-8"))
    adir = vdir / "audio"
    if not adir.is_dir():
        print(f"FAIL [sync_audit] no audio/ for '{vid}' — run tts first")
        return 2

    rows, fails, total_over, total_dropped, total_missing = [], [], 0, 0, 0
    done = 0
    for b in script.get("beats", []):
        if "clip" in b:
            continue
        if args.beat and b["id"] != args.beat:
            continue
        if args.limit and done >= args.limit:
            break
        wav = adir / f"{b['id']}.wav"
        wfile = adir / f"{b['id']}.words.json"
        if not wav.exists() or not wfile.exists():
            continue
        text = b.get("say", b.get("vo", "")).strip()
        if not text:
            continue
        done += 1
        whisper_words = json.loads(wfile.read_text(encoding="utf-8"))
        res = audit_line(wav, text, whisper_words, backend)
        row = {"beat": b["id"], "words": len(whisper_words), **res}
        rows.append(row)
        if "error" in res:
            print(f"  {b['id']:<6} ERROR {res['error']}")
            continue
        over = [d for d in res["diffs"] if abs(d["ds"]) > args.threshold]
        total_over += len(over)
        total_dropped += len(res["dropped"])
        total_missing += len(res.get("extra") or [])
        status = ""
        if over:
            w = over[0]
            fails.append(f"FAIL [sync_audit] {b['id']}: {len(over)} word(s) drift > {int(args.threshold*1000)}ms, worst \"{w['word']}\" {int(w['whisper_s']*1000)}->{int(w['align_s']*1000)}ms (Δ{int(w['ds']*1000)}ms)")
            status = f" ! {len(over)} over"
        if res["dropped"]:
            fails.append(f"FAIL [sync_audit] {b['id']}: heard word(s) not in script (whisper mishear/extra): {', '.join(map(str, res['dropped'][:4]))}")
            status += f" ! heard-extra {len(res['dropped'])}"
        if res.get("extra"):
            fails.append(f"FAIL [sync_audit] {b['id']}: script word(s) not heard (possible TTS dropout): {', '.join(map(str, res['extra'][:4]))}")
            status += f" ! script-missing {len(res['extra'])}"
        print(f"  {b['id']:<6} n={row['n']:<3} p50={int((row['p50_ds'] or 0)*1000):>4}ms p90={int((row['p90_ds'] or 0)*1000):>4}ms max={int((row['max_ds'] or 0)*1000):>4}ms bias={int((row['bias_ds'] or 0)*1000):>4}ms{status}")

        if args.fix and res.get("diffs"):
            bak = wp.parent / (wp.name + ".prealign.bak")
            if not bak.exists():
                bak.write_text(wfile.read_text(encoding="utf-8"), encoding="utf-8")
            fixed = []
            by_word_idx = {}
            # map aligned times onto the original tokens by identity of (w) order of diffs
            diff_iter = iter(res["diffs"])
            for w in whisper_words:
                cand = None
                for d in res["diffs"]:
                    if d["word"] == w.get("w") and d["whisper_s"] == round(float(w["s"]), 3):
                        cand = d
                        break
                if cand:
                    w2 = dict(w)
                    w2["s"], w2["e"] = cand["align_s"], cand["align_e"]
                    fixed.append(w2)
                else:
                    fixed.append(w)
            fixed.sort(key=lambda w: w["s"])
            wfile.write_text(json.dumps(fixed, ensure_ascii=False), encoding="utf-8")
            (adir / f"{b['id']}.align.json").write_text(json.dumps({
                "backend": res["backend"], "when": dt.datetime.now().isoformat(timespec="seconds"),
                "note": "timings forced-aligned; re-run tools/build.py to propagate",
            }, indent=1), encoding="utf-8")

    if not rows:
        print("sync_audit: no narrated lines found")
        return 0
    md = [r for r in rows if "error" not in r]
    import numpy as _np
    p90s = [r["p90_ds"] for r in md if r.get("p90_ds") is not None]
    summary = {
        "tool": "sync_audit", "topic": vid, "generated": dt.datetime.now().isoformat(timespec="seconds"),
        "backend": backend, "threshold_s": args.threshold, "lines": len(rows),
        "lines_with_drift": len([r for r in rows if any(abs(d["ds"]) > args.threshold for d in r.get("diffs", []))]),
        "words_over_threshold": total_over, "dropped_words": total_dropped,
        "script_missing_words": total_missing,
        "topic_p90_ds": round(float(_np.percentile(p90s, 50)), 3) if p90s else None,
        "fixed": bool(args.fix), "rows": rows,
    }
    outdir = Path(args.report); outdir.mkdir(parents=True, exist_ok=True)
    (outdir / f"{vid}.json").write_text(json.dumps(summary, indent=1), encoding="utf-8")
    print(f"\n{vid}: {summary['lines']} lines · {summary['lines_with_drift']} with drift > {int(args.threshold*1000)}ms · "
          f"{total_over} words over · {total_dropped} heard-not-in-script · {total_missing} script-not-heard · "
          f"median line p90 {int((summary['topic_p90_ds'] or 0)*1000)}ms")
    for f in fails:
        print(f)
    if args.fix:
        print("timings rewritten (backup: *.words.json.prealign.bak) — re-run tools/build.py <topic> now")
    print(f"wrote {outdir / (vid + '.json')}")
    return 0 if (not fails or args.warn_only) else 1


if __name__ == "__main__":
    raise SystemExit(main())
