#!/usr/bin/env python3
"""Build a labelled proof sheet: SOUL frames vs AMATEUR frames, with gate verdicts.
Output: poc/results/proof_sheet.png"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import tactile_pop_gate as G

OUT = HERE / "results"
OUT.mkdir(parents=True, exist_ok=True)
ROOT = G.ROOT

CASES = [
    ("SOUL", "captchas-full", "All-in_captchas_full_v2 standard"),
    ("AMATEUR", "tokens-explained", "flat dark boxes + tiny labels"),
    ("AMATEUR", "elon-musk", "hairline art, no physical object"),
    ("AMATEUR", "the-ai-cast", "25% flat dark-on-dark slop"),
]


def pick(slug, want_state, n=4, skip_low_content=True):
    d = ROOT / "videos" / slug / "qa" / "cuts"
    thr = G.load_thresholds()
    out = []
    for f in sorted(d.glob("*.jpg")):
        try:
            m = G.frame_metrics(G.load_rgb(f))
        except Exception:
            continue
        if skip_low_content and m["content_frac"] < G.TRANSITION_CONTENT:
            continue
        _, state, fails = G.judge(m, thr, strict_empty=True)
        if state == want_state:
            out.append((f, m, G._score(m, thr), fails))
        if len(out) >= n:
            break
    return out


def font(sz):
    for p in (r"C:\Windows\Fonts\consola.ttf", r"C:\Windows\Fonts\arialbd.ttf",
              r"C:\Windows\Fonts\arial.ttf"):
        if Path(p).exists():
            try:
                return ImageFont.truetype(p, sz)
            except OSError:
                pass
    return ImageFont.load_default()


TILE_W, TILE_H = 480, 270
PAD, LABEL_H, HEAD_H = 10, 26, 34
rows = []
for tag, slug, note in CASES:
    want = "PASS" if tag == "SOUL" else "FAIL"
    frames = pick(slug, want, n=4)
    rows.append((tag, slug, note, frames))

W = PAD + 4 * (TILE_W + PAD)
H = HEAD_H + sum(LABEL_H + TILE_H + PAD + 34 for _, _, _, fr in rows if fr)
sheet = Image.new("RGB", (W, H), (18, 18, 20))
dr = ImageDraw.Draw(sheet)
f_head, f_lab, f_sm = font(20), font(15), font(13)

dr.text((PAD, 8), "TACTILE-POP GATE proof sheet  -  board-only metrics, thresholds calibrated on "
                  "All-in_captchas_full_v2.mp4", font=f_head, fill=(240, 240, 240))

y = HEAD_H
for tag, slug, note, frames in rows:
    if not frames:
        continue
    col = (120, 230, 150) if tag == "SOUL" else (255, 110, 110)
    dr.text((PAD, y), f"{tag}   {slug}   — {note}", font=f_lab, fill=col)
    y += LABEL_H
    for i, (f, m, sc, fails) in enumerate(frames):
        img = Image.open(f).convert("RGB").resize((TILE_W, TILE_H), Image.LANCZOS)
        x = PAD + i * (TILE_W + PAD)
        sheet.paste(img, (x, y))
        codes = "+".join(fl["code"].split("_")[0] for fl in fails[:4]) or "clean"
        # keep each caption inside its tile: 480px at ~7.3px/char consola 13 => ~64 chars
        line1 = f"{f.stem} score {sc:.0f} {tag}"
        line2 = (f"lit {m['light_frac']*100:.1f}% con {m['board_contrast']:.0f} "
                 f"slop {m['flat_slop_frac']*100:.0f}% tiny {m['tiny_label_pct']:.0f}%")
        line3 = codes
        dr.text((x + 4, y + TILE_H + 3), line1[:64], font=f_sm, fill=col)
        dr.text((x + 4, y + TILE_H + 15), line2[:64], font=f_sm, fill=(190, 190, 190))
        dr.text((x + 4, y + TILE_H + 27), line3[:64], font=f_sm, fill=col)
    y += TILE_H + PAD + 34

sheet.save(OUT / "proof_sheet.png")
print(f"wrote {OUT / 'proof_sheet.png'}  {sheet.size}")
