#!/usr/bin/env python3
"""
tools/make_grain.py  (track V-CRAFT: tactile paper & film-grain textures, $0)

Bakes deterministic, seed-locked paper-tooth and film-grain PNGs into
`engine/public/tex/` for the v23 tactile cards (UtilityBillCard / PageQuote /
receipts-crop frame). Two texture layers:

  film_grain_baked.png   - full-frame 1920x1080 grain, multiply ~6-10% on
                           the stage/clip area, gives the "35mm print" feel
                           of Vox/Fern documentary overlays.
  paper_tooth.png        - subtle fibre/tooth for parchment cards (#F6F2E8 /
                           #EEE8DC), multiply ~6-10%, NEVER on white UI cards
                           (JobPortalCard stays SaaS-crisp) and never on clips.

Deterministic: fixed RNG seed, same output every run. No network, no ambientCG
download (keep C: lean) — the recipe below names the CC0 ambientCG source the
owner can swap in later; this baked fallback ships offline immediately.

Usage:
  python tools/make_grain.py [--out-dir engine/public/tex] [--seed 1337]
                             [--frames 1]

Writes PNGs and a `tex_manifest.json` (dimensions, seed, blend rule) so the
composite is reproducible across renders and auditable in git.
"""
import argparse, json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / "engine" / "public" / "tex"

BLEND_RULE = (
    "Composite rule (keep subtle!): paper texture @ multiply 6-10% opacity on "
    "parchment cards only (PageQuote, UtilityStatement, receipts crop frame, "
    "BillReceipt). NEVER on white UI cards (JobPortalCard stays SaaS-crisp), "
    "never on stage/clip. film_grain @ multiply 6-10% on the full board."
)


def seeded_noise(size, seed, freq=1.0):
    """Band-limited noise: white noise blurred, then re-normalised.
    Reads like film grain / paper fibre, not digital speckle."""
    rng = np.random.default_rng(seed)
    h, w = int(size[1]), int(size[0])
    noise = rng.standard_normal((h, w)).astype(np.float32)
    im = Image.fromarray(((noise - noise.min()) / (noise.max() - noise.min()) * 255).astype(np.uint8))
    # blur to turn speckle into fibre/grain; radius scales with frequency
    im = im.filter(ImageFilter.GaussianBlur(radius=max(0.5, 2.0 / freq)))
    a = np.asarray(im).astype(np.float32) / 255.0
    a = (a - a.mean()) / (a.std() + 1e-6)  # zero mean, unit variance
    return a


def bake_grain(out: Path, seed: int):
    """1920x1080 film grain. Low amplitude so it reads as tooth, not dirt."""
    w, h = 1920, 1080
    g = seeded_noise((w, h), seed, freq=1.0)
    # grain amplitude ~ 4-7% of luma; warm tint (stage is warm-black)
    amp = 0.05
    layer = np.stack([g * amp * 1.05, g * amp * 1.0, g * amp * 0.9], axis=2)
    layer = np.clip(layer, 0, 1)
    im = Image.fromarray((layer * 255).astype(np.uint8))
    im.save(out, "PNG", compress_level=6)
    return im.size


def bake_paper_tooth(out: Path, seed: int):
    """Subtle fibre texture for parchment cards; softer than film grain."""
    w, h = 1920, 1080
    g = seeded_noise((w, h), seed + 1, freq=0.5)
    amp = 0.035
    layer = np.stack([g * amp * 1.02, g * amp * 1.0, g * amp * 0.98], axis=2)
    layer = np.clip(layer, 0, 1)
    im = Image.fromarray((layer * 255).astype(np.uint8))
    im.save(out, "PNG", compress_level=6)
    return im.size


def main():
    ap = argparse.ArgumentParser(description="Bake deterministic paper & film-grain textures.")
    ap.add_argument("--out-dir", default=None, help=f"default: {DEFAULT_OUT}")
    ap.add_argument("--seed", type=int, default=1337, help="RNG seed (locked for determinism)")
    ap.add_argument("--frames", type=int, default=1, help="kept for API compatibility; textures are static")
    args = ap.parse_args()

    out_dir = Path(args.out_dir) if args.out_dir else DEFAULT_OUT
    out_dir.mkdir(parents=True, exist_ok=True)

    grain = out_dir / "film_grain_baked.png"
    paper = out_dir / "paper_tooth.png"
    gs = bake_grain(grain, args.seed)
    ps = bake_paper_tooth(paper, args.seed)

    manifest = {
        "tool": "tools/make_grain.py (track V-CRAFT)",
        "seed": args.seed,
        "blend_rule": BLEND_RULE,
        "preferred_source": "ambientCG Paper001 / Paper005 / CardboardSet001 (CC0) - swap in later, same blend rule",
        "textures": {
            "film_grain_baked.png": {"path": str(grain), "size": list(gs), "blend": "multiply 6-10% on stage/clip"},
            "paper_tooth.png": {"path": str(paper), "size": list(ps), "blend": "multiply 6-10% on parchment cards only"},
        },
        "usage": "engine/src/ds/tokens.ts `color.tex` references these; Remotion <Image> components apply "
                 "mix-blend-mode multiply at 6-10% opacity, pre-baked so render is deterministic and offline.",
    }
    (out_dir / "tex_manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"make_grain: seed={args.seed} -> {grain.name} {gs}  {paper.name} {ps}")
    print(f"  manifest: {out_dir / 'tex_manifest.json'}")
    print(BLEND_RULE)


if __name__ == "__main__":
    main()
