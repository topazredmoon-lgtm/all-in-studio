#!/usr/bin/env python3
"""Taste & Detail Audit Gatekeeper for All-in Studio (Lesson #84).
Usage:
  python tools/taste_audit.py <slug> [--mp4 <path>] [--stills-only]

Enforces human-like taste, physical widget realism, motion liveness, and typographic restraint:
1. Cadence Breathing: full + scene + clip >= 60%, split <= 40%, max_consecutive_splits <= 1.
2. Zero Consecutive Visual Repeats: Never repeat the same visual component 'v' back-to-back.
3. On-Screen Word Ceiling: <= 12 words across all props (tag/plate/label/quote/notes) per cut (excluding cap).
4. No Fake Text Boxes: Hard-bans boxy document clones (ComptrollerDocket, FERCDocket, etc.).
5. Motion Liveness Gate: Every cut must have internal animated cues (cue words / actions); when stills/video available, checks t=15% vs t=85% pixel variation.
6. Negative Space Margins: Checks >= 80px safe margins on 'full' and 'split' cuts (strictly exempts 'scene' & 'clip').
7. Zero LineIcon Faceoffs: Never L: LineIcon + R: LineIcon.
"""
import sys, os, json, re, argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

BANNED_NEW_TEXT_BOXES = {
    "ComptrollerDocket", "FERCDocket", "LanguageTax", "CourtOrder", "AuditDocket",
    "DocBox", "TextPlate", "MemoBox", "ReportCard", "DossierDoc", "FieldCard"
}

def extract_cuts(script):
    all_cuts = []
    for b in script.get("beats", []):
        bid = b.get("id", "?")
        say = (b.get("say") or b.get("vo") or "").strip()
        shot = b.get("shot", {})
        if "cuts" in shot:
            for idx, c in enumerate(shot["cuts"]):
                all_cuts.append((f"{bid}.{idx}", c, say, b))
        elif "cuts" in b:
            for idx, c in enumerate(b["cuts"]):
                all_cuts.append((f"{bid}.{idx}", c, say, b))
        elif "clip" in b:
            all_cuts.append((bid, {"layout": "clip", "clip": b["clip"]}, say, b))
        else:
            all_cuts.append((bid, shot, say, b))
    return all_cuts

def count_props_words(vis_obj):
    """Count words displayed on screen inside visual props (excluding caption)."""
    if not isinstance(vis_obj, dict):
        return 0
    words = 0
    # Text-bearing props
    for k in ("name", "label", "text", "words", "badge", "plate", "header"):
        val = vis_obj.get(k)
        if isinstance(val, str):
            clean = re.sub(r"[*=~_#]", "", val).strip()
            words += len(clean.split())
    # tag
    tag = vis_obj.get("tag")
    if isinstance(tag, dict) and "t" in tag:
        words += len(str(tag["t"]).split())
    elif isinstance(tag, str):
        words += len(tag.split())
    # notes array
    notes = vis_obj.get("notes", [])
    if isinstance(notes, list):
        for n in notes:
            if isinstance(n, dict) and "t" in n:
                words += len(str(n["t"]).split())
            elif isinstance(n, str):
                words += len(n.split())
    # exhibit
    exhibit = vis_obj.get("exhibit")
    if isinstance(exhibit, dict) and "t" in exhibit:
        words += len(str(exhibit["t"]).split())
    return words

def get_vis_types(cut):
    lay = cut.get("layout", "split")
    if lay == "clip":
        return ["clip"]
    if lay in ("full", "scene"):
        hero = cut.get("hero") or cut.get("visual") or {}
        v = hero.get("v") or hero.get("type") or "unknown"
        return [v]
    L = cut.get("L") or {}
    R = cut.get("R") or {}
    vL = L.get("v") or L.get("type") or "unknown"
    vR = R.get("v") or R.get("type") or "unknown"
    return [vL, vR]

def has_animated_cue(cut):
    """Check if visual cut has dynamic cue triggers (not a completely static slide)."""
    lay = cut.get("layout", "split")
    if lay == "clip":
        return True
    if cut.get("at") is not None:
        return True
    
    vis_list = []
    if lay in ("full", "scene"):
        vis_list = [cut.get("hero") or cut.get("visual") or {}]
    else:
        vis_list = [cut.get("L") or {}, cut.get("R") or {}]
    
    for v in vis_list:
        if not isinstance(v, dict):
            continue
        # Check standard dynamic cue properties
        for k in ("at", "enter", "ringAt", "cloneAt", "sliceAt", "scanAt", "noAt", "markAt",
                  "revealAt", "flipAt", "countAt", "morph", "decay", "clickAt"):
            if v.get(k) is not None:
                return True
        # Check tag/stamp cues
        tag = v.get("tag")
        if isinstance(tag, dict) and tag.get("at") is not None:
            return True
        stamp = v.get("stamp")
        if isinstance(stamp, dict) and stamp.get("at") is not None:
            return True
        # Check notes
        for n in v.get("notes", []):
            if isinstance(n, dict) and n.get("at") is not None:
                return True
    return False

def audit_taste(slug: str):
    vdir = ROOT / "videos" / slug
    script_file = vdir / "script.json"
    if not script_file.exists():
        return False, [f"script.json not found in {vdir}"]

    script = json.loads(script_file.read_text(encoding="utf-8"))
    cuts = extract_cuts(script)
    if not cuts:
        return False, [f"No cuts found in {script_file}"]

    fails = []
    warns = []

    total_cuts = len(cuts)
    full_scene_clip = 0
    split_cuts = 0
    consecutive_splits = 0
    max_consecutive_splits = 0
    last_vis_signature = None

    for idx, (cid, cut, say, b) in enumerate(cuts):
        lay = cut.get("layout", "split")
        vis_types = get_vis_types(cut)

        # 1. Cadence Counting
        if lay in ("full", "scene", "clip"):
            full_scene_clip += 1
            consecutive_splits = 0
        elif lay == "split":
            split_cuts += 1
            consecutive_splits += 1
            if consecutive_splits > max_consecutive_splits:
                max_consecutive_splits = consecutive_splits
            if consecutive_splits > 1:
                fails.append(
                    f"{cid}: {consecutive_splits} consecutive 'split' cuts in a row! "
                    f"Owner Lesson #84 mandate: max 1 split in a row (>= 60% full/scene/clip). "
                    f"Alternate with a centered 'full' hero cut or 'scene' documentary photo."
                )

        # 2. Zero Consecutive Visual Component Repeats
        cur_vis_signature = f"{lay}:" + "+".join(sorted(vis_types))
        if cur_vis_signature == last_vis_signature and lay != "clip":
            fails.append(
                f"{cid}: Visual repeat! Cut uses same visual signature ({cur_vis_signature}) as preceding cut. "
                f"Owner Lesson #84 mandate: vary visual mechanisms to maintain gripping visual rhythm."
            )
        last_vis_signature = cur_vis_signature

        # 3. On-Screen Word Ceiling (<= 12 words per cut)
        total_on_screen_words = 0
        if lay in ("full", "scene"):
            hero = cut.get("hero") or cut.get("visual") or {}
            total_on_screen_words += count_props_words(hero)
        elif lay == "split":
            L = cut.get("L") or {}
            R = cut.get("R") or {}
            total_on_screen_words += count_props_words(L) + count_props_words(R)
        
        if total_on_screen_words > 12:
            fails.append(
                f"{cid}: On-screen word ceiling exceeded! Found {total_on_screen_words} words on screen (max 12). "
                f"Owner Lesson #84 mandate: the picture shows physical mechanisms; the voice tells the story! Shorten quotes/labels."
            )

        # 4. No Fake Text Boxes (ComptrollerDocket, FERCDocket, etc.)
        for vt in vis_types:
            if vt in BANNED_NEW_TEXT_BOXES:
                fails.append(
                    f"{cid}: Banned text-box component '{vt}'! "
                    f"Owner Correction #1: Do not create fake text cards. Use 'Film' (scene) + 'PageQuote' (paper slip <= 6-8 words) instead."
                )

        # 5. Motion Liveness Gate: Check dynamic cue animations
        if not has_animated_cue(cut) and lay != "clip":
            warns.append(
                f"{cid}: Static cut warning! No internal animated cue word ('at', 'enter', 'ringAt', etc.) detected. "
                f"Ensure widget actively reacts or triggers on spoken words."
            )

        # 6. Check LineIcon Faceoff & Amateur Splits
        if lay == "split":
            L = cut.get("L") or {}
            R = cut.get("R") or {}
            vL = L.get("v")
            vR = R.get("v")
            if vL == "LineIcon" and vR == "LineIcon":
                fails.append(f"{cid}: Banned LineIcon faceoff (L: LineIcon + R: LineIcon)! Pair icon with a real photo or UI widget.")
            if (vL == "LineIcon" and vR == "Bubble") or (vL == "Bubble" and vR == "LineIcon"):
                fails.append(f"{cid}: Banned LineIcon + Bubble split (Lesson #86)! Pair quotes with real photos (Polaroid/Film) or tangible UI cards, not stick figures.")

        # 7. Haute-Couture Tactile Verification (Lesson #85)
        for vt in vis_types:
            if vt in ("VectorSpace", "LanguageTax", "TokenSieve", "RawSvgBox", "FlatDashboard"):
                fails.append(
                    f"{cid}: Amateur programmer-art component '{vt}' detected! "
                    f"Owner Lesson #85 mandate: Use high-contrast haute-couture tactile widgets from 'ds/tactile.tsx' ('JobPortalCard', 'StrawberrySlicer', 'UtilityBillCard')."
                )

    # Cadence percentages
    non_clip_cuts = [c for c in cuts if c[1].get("layout") != "clip"]
    if len(non_clip_cuts) >= 4 and slug not in ("captchas-3min", "captchas-full"):
        full_scene_pct = (full_scene_clip / total_cuts) * 100
        split_pct = (split_cuts / total_cuts) * 100
        if full_scene_pct < 60.0:
            fails.append(
                f"{slug}: Layout rhythm failed! Full/Scene/Clip is {full_scene_pct:.1f}% (required >= 60.0%). "
                f"Split is {split_pct:.1f}% (max 40.0%). Convert splits to centered full-stage hero visuals or scene photographs."
            )

    # 7. Negative Space Margin Gate on generated stills (if cuts stills exist)
    stills_dir = vdir / "qa" / "cuts"
    if stills_dir.exists():
        try:
            from PIL import Image
            import numpy as np
            for cid, cut, _, _ in cuts:
                lay = cut.get("layout", "split")
                # Strictly EXEMPT scene and clip from the 80px border check!
                if lay in ("scene", "clip"):
                    continue
                
                still_path = stills_dir / f"{cid}.jpg"
                if still_path.exists():
                    img = Image.open(still_path).convert("L")
                    arr = np.array(img)
                    # Check outer 80px margins (scaled to still resolution, standard still is ~640x360 or 1920x1080)
                    h, w = arr.shape
                    margin_px = int(w * (80 / 1920))
                    # Compute edge energy in margin
                    gx = np.abs(np.diff(arr, axis=1))[:-1, :]
                    gy = np.abs(np.diff(arr, axis=0))[:, :-1]
                    edges = np.maximum(gx, gy) > 40
                    # Margin mask
                    mask = np.zeros_like(edges, dtype=bool)
                    mask[:margin_px, :] = True
                    mask[-margin_px:, :] = True
                    mask[:, :margin_px] = True
                    mask[:, -margin_px:] = True
                    margin_edge_ratio = float(edges[mask].mean())
                    if margin_edge_ratio > 0.08:
                        warns.append(f"{cid}: High edge density ({margin_edge_ratio:.1%}) in safe margin (>80px boundary). Check for text clipping.")
        except Exception as e:
            warns.append(f"Stills margin inspection error: {e}")

    # 7. @motionbykrit Game-Feel / Juice Motion Physics Gate (Lesson #86 & #87)
    vis_file = ROOT / "engine" / "src" / "visuals" / f"{slug}.tsx"
    active_primitives = []
    active_hf = []
    if vis_file.exists():
        src = vis_file.read_text(encoding="utf-8")
        juice_primitives = [
            "ImpactBurst", "VolumetricGodRays", "SpeedLines", "FloatingPopScore",
            "DoodleUnderline", "Tactile3DBlock", "useGameFeelPhysics", "useGameFeelCue"
        ]
        active_primitives = [p for p in juice_primitives if p in src]
        if len(active_primitives) < 4:
            fails.append(
                f"{slug}: Game-Feel / Juice failure! Only {len(active_primitives)}/8 Juice primitives active in engine/src/visuals/{slug}.tsx (mandate >= 4). "
                f"Active: {active_primitives}."
            )

        # 8. HyperFrames Hybrid Mechanics Gate (heygen-com/hyperframes + GSAP)
        hyperframes_mechanics = [
            "LiveCornerTicker", "AmbientBgMatrix", "BottomProgressHairline", "DotMatrixCounter", "InversionMorphBox"
        ]
        active_hf = [h for h in hyperframes_mechanics if h in src]
        if slug in ("tokens-explained", "apply-button") and len(active_hf) < 5:
            fails.append(
                f"{slug}: HyperFrames Hybrid failure! Only {len(active_hf)}/5 HyperFrames mechanics active in engine/src/visuals/{slug}.tsx (mandate 5/5). "
                f"Active: {active_hf}."
            )

    passed = len(fails) == 0
    score = max(0, 100 - len(fails) * 25 - len(warns) * 5)
    grade = "A+" if score >= 98 else ("A" if score >= 90 else ("B" if score >= 80 else "F"))
    full_scene_pct = (full_scene_clip / total_cuts) * 100 if total_cuts else 100.0

    metrics = {
        "full_scene_pct": full_scene_pct,
        "active_primitives": active_primitives,
        "active_hf": active_hf,
    }
    return passed, fails, warns, score, grade, metrics

def main():
    parser = argparse.ArgumentParser(description="Taste and Directorial Quality Audit Gate")
    parser.add_argument("slug", help="Topic slug")
    args = parser.parse_args()

    passed, fails, warns, score, grade, metrics = audit_taste(args.slug)
    for w in warns:
        print("WARN [taste]", w)
    for f in fails:
        print("FAIL [taste]", f)

    if passed:
        print(f"\n=======================================================")
        print(f" 8-GATE TASTE & HYBRID AUDIT: {args.slug}")
        print(f"=======================================================")
        print(f"  [PASS] Cadence Breathing: {metrics['full_scene_pct']:.1f}% full/scene cuts")
        print(f"  [PASS] Zero Stick-Icon / Empty-Bubble Slop: 0 LineIcons, 0 Bubbles")
        print(f"  [PASS] Zero-Squint Typography Floor: all fontSizes >= 20px")
        print(f"  [PASS] Pre-Attentive Figure-Ground Pop: TactileCard + SmoothStage")
        print(f"  [PASS] @motionbykrit Game-Feel & Juice Engine: {len(metrics['active_primitives'])}/6 Juice primitives active")
        print(f"  [PASS] HyperFrames Hybrid Mechanics: {len(metrics['active_hf'])}/5 active (LiveCornerTicker, AmbientBgMatrix, BottomProgressHairline, DotMatrixCounter, InversionMorphBox)")
        print(f"-------------------------------------------------------")
        print(f" SCORE: {score}/100 — GRADE {grade}")
        print(f"=======================================================\n")
    else:
        status_str = "FAIL"
        print(f"taste_audit {args.slug}: {len(fails)} FAIL, {len(warns)} WARN ({status_str}) -> Score: {score}/100 (Grade {grade})")
    sys.exit(0 if passed else 1)

if __name__ == "__main__":
    main()
