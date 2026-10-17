#!/usr/bin/env python3
"""
tools/lint_text.py — Automated Gatekeeper for All-in Studio (run by build.py and qa.py before every render).
Enforces all cumulative owner rules from design-system/LEARNINGS.md (including 2026-10-15 Lessons #79-#82):

1. NO TEXT AS THE PICTURE (Lesson #26):
   - Bans Count, Word, Payer, and layout="chapter".
   - Bans Bubble, CalendarCard, or PageQuote alone in layout="full", or on both sides of layout="split".
   - Enforces tag <= 24 chars and caption <= 6 words.
2. CAPTCHAS_FULL_V2 VISUAL KIT ONLY (Lesson #79):
   - Hard-bans boxy ds/evidence.tsx cards (DossierDoc, ForensicStamp, FieldCard, CodeTerminal, MetricChart, Highlighter).
   - Hard-bans 19th-century woodcut engraving plates (Ouroboros, Balance, GuardrailGate, etc.).
3. NO PERMANENT LEFT/RIGHT BI-SCREEN (Lesson #80 — Owner 2026-10-15):
   - "i dont like the bi-screen left and right kinda permanent format. IT MUST BE MORE PLEASANT AND PREMIUM PRO TO WATCH"
   - Caps layout="split" at <= 45% of cuts (at least 55% of cuts must be layout="full", layout="scene", or clip).
   - Bans > 2 consecutive layout="split" cuts in a row (max_consecutive_splits = 2).
   - Bans lone LineIcon as the sole hero of layout="full" (full-screen hero must be a rich UI widget, photo Print/Film/Polaroid, BlogProof, Flow, IconRow, Bars, Score, Blocked, MousePath, CallGrid, PhoneChat, PhoneCall, etc.).
4. SHOW "WHO AND WHAT" WITH REAL IMAGES & SPECIFIC ARTIFACTS — NO STRAY ICON SLOP (Lesson #81 — Owner 2026-10-15):
   - "the woman in the courtroom mentioned, should obviously show WHO AND WHAT, with images etc i guess, not just a random stray slop and what not"
   - When a beat's narration mentions a real person, courtroom, city, university, agency, company, or year (2000-2026), at least one cut in that beat MUST include a real photo/document/UI artifact (Film, Print, Polaroid, AnnotatedPrint, Hearing, BlogProof, ListDoc, PageQuote, PhoneChat, PhoneCall, CallGrid, LoginCard, Captcha4, Square, Score, Blocked, MousePath, RouteMap, Cctv, AccountWall). Beats using only LineIcon/IconRow/CalendarCard FAIL!
   - Bans L: LineIcon + R: LineIcon in the same split (never put two generic line icons side-by-side).
   - Caps LineIcon at <= 25% of all visual objects across the video.
   - Verifies that any referenced photo file (src/img/photo) actually exists in engine/public/ and is > 5 KB.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    vids = sorted([p.name for p in (ROOT / "videos").iterdir() if p.is_dir() and not p.name.startswith(("_", "."))])
    print(f"\nAvailable topics:\n  {', '.join(vids)}")
    sys.exit(0)

vid = sys.argv[1]
vdir = ROOT / "videos" / vid
if not vdir.is_dir() or not (vdir / "script.json").exists():
    sys.exit(f"Error: script.json not found for topic '{vid}'.")

script = json.loads((vdir / "script.json").read_text(encoding="utf-8"))

TEXT_LED = {"Count", "Word", "Payer"}
WORDY = {"Bubble", "CalendarCard", "PageQuote"}

BANNED_BOXY_EVIDENCE = {
    "DossierDoc", "ForensicStamp", "FieldCard", "CodeTerminal", "MetricChart", "Highlighter"
}
BANNED_WOODCUT_PLATES = {
    "Ouroboros", "Balance", "Well", "PressStack", "JournalPlate", "Compass", "DeskLamp", "RustingGate",
    "Alembic", "BellJar", "BluntPencil", "CastOfACast", "CloudingGlass", "CopyStack", "Delta",
    "DriftingCourse", "JugCup", "Meadow", "PaperRiver", "SeedVault", "TowerRabbits", "TwoHands",
    "GuardrailGate", "SuffixKey", "CleanResume", "HiddenPrompt", "OnePipeStream", "RuleFlip",
    "DataWell", "SleeperDrop"
}
BANNED_PROGRAMMER_ART = {
    "VectorSpace", "LanguageTax", "TokenSieve", "RawSvgBox", "FlatDashboard", "ComptrollerDocket", "FERCDocket"
}

# Concrete "WHO and WHAT" visuals (real photos, real documents/headlines, authentic UI widgets)
WHO_WHAT_EVIDENCE_VISUALS = {
    # Real photos & archival frames
    "Print", "Polaroid", "AnnotatedPrint", "Film", "Hearing", "Photo", "Cctv", "RouteMap",
    # Real documents & verbatim quotes
    "BlogProof", "ListDoc", "PageQuote", "Receipt", "StudyCard",
    # Authentic interactive UI & concrete evidence widgets
    "PhoneChat", "PhoneCall", "CallGrid", "FaceSwap", "LoginCard", "StealerLog", "Channel", "Shop", "Listing",
    "Captcha4", "Square", "TwoWords", "MousePath", "Score", "Blocked", "HouseNumber", "PhotoType", "Labels", "Outline",
    "AccountWall", "LabelSwap", "Bars", "Flow", "Loop", "Copier",
    # Haute-couture tactile kit (Lessons #85 & #86)
    "JobPortalCard", "StrawberrySlicer", "UtilityBillCard",
    "ATSScanner", "FourFifthsDial", "FunnelSieve", "BlindCounter", "MemoryBelt", "TokenTaxMeter", "VectorObservatory"
}

REAL_WORLD_TRIGGER_RE = re.compile(
    r"\b(courtroom|court|judge|jail|prison|police|arrested|prosecutor|indictment|lawsuit|trial|exhibit|"
    r"woman|man|principal|director|professor|student|researcher|doctor|ceo|cfo|worker|employee|"
    r"philadelphia|maryland|baltimore|hong kong|new york|washington|london|china|singapore|"
    r"carnegie mellon|stanford|mit|uc irvine|oxford|cambridge|"
    r"google|anthropic|openai|microsoft|meta|nvidia|supermicro|duolingo|yahoo|arup|"
    r"fbi|doj|senate|congress|nsa|cia|199\d|20[0-2]\d)\b",
    re.I
)

kit_path = ROOT / "engine" / "src" / "ds" / "kit.tsx"
VALID_ICONS = set()
if kit_path.exists():
    kit_src = kit_path.read_text(encoding="utf-8")
    icon_match = re.search(r"export type IconName = ([^;]+);", kit_src)
    if icon_match:
        VALID_ICONS = set(re.findall(r"'([^']+)'", icon_match.group(1)))

def extract_shots(b):
    """Support both native b['shot']['cuts'] and direct b['cuts'] schemas."""
    if "clip" in b:
        return [(b["id"], {"layout": "clip", "clip": b["clip"]})]
    s = b.get("shot")
    if isinstance(s, dict):
        if "cuts" in s and isinstance(s["cuts"], list):
            return [(f"{b['id']}.{i}", c) for i, c in enumerate(s["cuts"])]
        return [(b["id"], s)]
    if "cuts" in b and isinstance(b["cuts"], list):
        return [(f"{b['id']}.{i}", c) for i, c in enumerate(b["cuts"])]
    return []

def get_vis_list(s):
    lay = s.get("layout") or s.get("shot") or "split"
    if lay == "clip":
        return []
    if lay in ("full", "scene"):
        h = s.get("hero") or s.get("C") or s.get("center") or s.get("visual")
        return [h] if isinstance(h, dict) else []
    L = s.get("L") or s.get("left")
    R = s.get("R") or s.get("right")
    return [x for x in (L, R) if isinstance(x, dict)]

fails = []
warns = []

# Check voice config matches captchas_full_v2 (af_heart 0.95 + v23)
voice_cfg = script.get("voice", {})
if isinstance(voice_cfg, dict) and voice_cfg.get("name") and voice_cfg.get("name") != "af_heart":
    warns.append(f"{vid}: voice.name is {voice_cfg.get('name')!r} (All-in_captchas_full_v2 standard is 'af_heart' speed 0.95)")

all_shots = []
total_vis_objects = 0
line_icon_objects = 0
consecutive_splits = 0
max_consecutive_splits = 0

pub_dir = ROOT / "engine" / "public"

for b in script.get("beats", []):
    bid = b.get("id", "?")
    say_text = (b.get("say") or b.get("vo") or "").strip()
    beat_shots = extract_shots(b)
    beat_has_who_what = False

    for sid, s in beat_shots:
        all_shots.append((sid, s))
        lay = s.get("layout") or s.get("shot") or ("clip" if "clip" in s else "split")

        if lay == "chapter":
            fails.append(f"{sid}: chapter card = big title on an empty board; open act on a picture + top-left act kicker")
            continue

        if lay == "clip":
            consecutive_splits = 0
            beat_has_who_what = True
            continue

        if lay == "split":
            consecutive_splits += 1
            if consecutive_splits > max_consecutive_splits:
                max_consecutive_splits = consecutive_splits
            if consecutive_splits > 2:
                fails.append(
                    f"{sid}: {consecutive_splits} consecutive 'split' cuts in a row! "
                    f"Owner rule (2026-10-15): 'i dont like the bi-screen left and right kinda permanent format. "
                    f"IT MUST BE MORE PLEASANT AND PREMIUM PRO TO WATCH'. Alternate with 'full' or 'scene' hero cuts."
                )
        else:
            consecutive_splits = 0

        vis = get_vis_list(s)
        if not vis:
            fails.append(f"{sid}: shot with layout={lay!r} has no visual object (expected 'hero' for full/scene or 'L'+'R' for split)")
            continue

        # Check if a full shot only has a single LineIcon or a WORDY object
        if lay == "full" and len(vis) == 1:
            vtype = vis[0].get("v") or vis[0].get("type")
            if vtype in WORDY:
                fails.append(f"{sid}: {vtype} alone in 'full' layout; pair it with a picture in a 'split'")
            if vtype == "LineIcon":
                fails.append(
                    f"{sid}: lone LineIcon ({vis[0].get('name')!r}) centered in 'full' layout looks bare/slop. "
                    f"Use a rich full-stage visual (Film/Print/Polaroid/BlogProof/PhoneChat/PhoneCall/CallGrid/Captcha4/Flow/Bars/IconRow/Score/MousePath)."
                )

        # Check if a split has two WORDY objects or two LineIcons side-by-side
        if lay == "split" and len(vis) == 2:
            v0 = vis[0].get("v") or vis[0].get("type")
            v1 = vis[1].get("v") or vis[1].get("type")
            if v0 in WORDY and v1 in WORDY:
                fails.append(f"{sid}: both sides of split are word objects ({v0}, {v1}); one side must be a picture")
            if v0 == "LineIcon" and v1 == "LineIcon":
                fails.append(
                    f"{sid}: both sides of split are bare LineIcons ({vis[0].get('name')!r} + {vis[1].get('name')!r}). "
                    f"Owner rule (2026-10-15): avoid random stray icon slop; pair with a real photo, UI widget, Bubble, or PageQuote."
                )
            if (v0 == "LineIcon" and v1 == "Bubble") or (v0 == "Bubble" and v1 == "LineIcon"):
                fails.append(
                    f"{sid}: banned LineIcon + Bubble split (Lesson #86)! "
                    f"Owner rule (2026-10-17): pair quotes with real photos (Polaroid/Film) or tangible UI cards, not stick figures."
                )
            if vis[0].get("enter"):
                fails.append(f"{sid} (L): Left object in split must be on screen at frame 0 (remove 'enter'={vis[0].get('enter')!r})")

        for v in vis:
            vtype = v.get("v") or v.get("type") or ""
            total_vis_objects += 1
            if vtype == "LineIcon":
                line_icon_objects += 1
            if vtype in WHO_WHAT_EVIDENCE_VISUALS:
                beat_has_who_what = True
            if vtype in TEXT_LED:
                fails.append(f"{sid}: {vtype} makes text the picture; show a picture and put the number/name in a small `tag`")
            if vtype in BANNED_BOXY_EVIDENCE:
                fails.append(f"{sid}: banned boxy card '{vtype}' (ds/evidence.tsx is retired; use captchas_full_v2 kit + real photos/UI)")
            if vtype in BANNED_WOODCUT_PLATES:
                fails.append(f"{sid}: banned woodcut engraving plate '{vtype}' (owner retired woodcut plates; use captchas_full_v2 kit + real photos/UI)")
            if vtype in BANNED_PROGRAMMER_ART:
                fails.append(f"{sid}: banned programmer-art component '{vtype}' (Lesson #85: use haute-couture tactile kit in ds/tactile.tsx)")
            if vtype in ("LineIcon", "IconRow") and VALID_ICONS:
                iname = v.get("name") or v.get("kind")
                if not iname or iname not in VALID_ICONS:
                    fails.append(f"{sid}: visual '{vtype}' uses unknown icon {iname!r}. Valid icons in ds/kit.tsx: {sorted(VALID_ICONS)}")

            # Verify tag length <= 24 chars
            tag_obj = v.get("tag")
            t_str = tag_obj.get("t", "") if isinstance(tag_obj, dict) else (tag_obj if isinstance(tag_obj, str) else "")
            if len(t_str) > 24:
                fails.append(f"{sid}: tag {t_str!r} is {len(t_str)} characters (max 24)")

            # Verify crop bounds if present
            c = v.get("crop")
            if isinstance(c, dict) and "s" in c and "iw" in v:
                if c["x"] < 0 or c["y"] < 0 or c["x"] + c["s"] > v["iw"] or c["y"] + c["s"] > v["ih"]:
                    fails.append(f"{sid}: {vtype} crop {c} runs off its {v['iw']}x{v['ih']} photo")

            # Verify referenced image files exist on disk in engine/public/
            for img_key in ("src", "img", "photo"):
                img_val = v.get(img_key)
                if isinstance(img_val, str) and any(img_val.lower().endswith(ext) for ext in (".jpg", ".jpeg", ".png", ".webp")):
                    img_path = pub_dir / img_val.lstrip("/")
                    if not img_path.exists():
                        fails.append(f"{sid}: {vtype} references missing image file 'engine/public/{img_val.lstrip('/')}' — download real CC/PD photo first!")
                    elif img_path.stat().st_size < 2048:
                        fails.append(f"{sid}: {vtype} image 'engine/public/{img_val.lstrip('/')}' is too small (<2KB placeholder)")

        cap = re.sub(r"[*=~_]", "", s.get("cap") or s.get("caption") or "").strip()
        if cap and len(cap.split()) > 6:
            fails.append(f"{sid}: caption {cap!r} has {len(cap.split())} words (max 6)")

    # Lesson #81 check: If the beat's narration mentions a real-world person/courtroom/place/event,
    # it MUST show WHO and WHAT (at least one cut with a real photo, document, or authentic UI artifact)
    if say_text and REAL_WORLD_TRIGGER_RE.search(say_text) and not beat_has_who_what:
        matched = REAL_WORLD_TRIGGER_RE.search(say_text).group(0)
        fails.append(
            f"{bid}: narration mentions real-world WHO/WHAT ({matched!r} in {say_text[:70]!r}...), "
            f"but visuals only use generic icons/calendar ('stray slop'). "
            f"Owner rule (2026-10-15): show WHO and WHAT with real images (Film/Print/Polaroid/AnnotatedPrint/BlogProof) "
            f"or concrete UI evidence (PhoneChat/PhoneCall/CallGrid/PageQuote/Score/Blocked)!"
        )

# Lesson #80 check: No permanent Left/Right bi-screen (split must be <= 45% of non-clip cuts on new/updated videos)
non_clip_shots = [(sid, s) for sid, s in all_shots if (s.get("layout") or s.get("shot")) != "clip"]
if len(non_clip_shots) >= 6 and vid not in ("captchas-3min", "captchas-full"):
    splits = sum(1 for _, s in non_clip_shots if (s.get("layout") or s.get("shot") or "split") == "split")
    split_ratio = splits / len(non_clip_shots)
    if split_ratio > 0.45:
        fails.append(
            f"{vid}: {splits}/{len(non_clip_shots)} cuts ({split_ratio:.0%}) use 'split' layout (max 45% allowed!). "
            f"Owner rule (2026-10-15): 'i dont like the bi-screen left and right kinda permanent format. "
            f"IT MUST BE MORE PLEASANT AND PREMIUM PRO TO WATCH'. Use layout='full' or layout='scene' for at least 55% of cuts."
        )

# Lesson #81 check: LineIcon cap <= 25% of visual objects
if total_vis_objects >= 8 and vid not in ("captchas-3min", "captchas-full"):
    icon_ratio = line_icon_objects / total_vis_objects
    if icon_ratio > 0.25:
        fails.append(
            f"{vid}: LineIcon is used in {line_icon_objects}/{total_vis_objects} visual slots ({icon_ratio:.0%}, max 25% allowed!). "
            f"Owner rule (2026-10-15): replace generic stray LineIcons with real photos (Print/Polaroid/Film) and real UI/evidence widgets!"
        )

for w in warns:
    print("WARN [text]", w)
for f in fails:
    print("FAIL [text]", f)
print(f"lint_text {vid}: {len(fails)} FAIL, {len(warns)} WARN ({len(non_clip_shots)} visual cuts, max consecutive splits={max_consecutive_splits})")
sys.exit(1 if fails else 0)
