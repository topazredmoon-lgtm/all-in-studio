"""YouTube Ship Package & Thumbnail Generator: python tools/ship_package.py <video_id>
Generates for any topic in `videos/<slug>/out/`:
  - `metadata_FINAL.txt` (copy-paste ready Title, Description with Spine + Chapters + Sources + CC Attributions + Business Email, Tags, Pinned Comment)
  - `ship_<slug>.md` (full markdown ship sheet with thumbnail strategy & legal safety notes)
  - `thumb_1.png`, `thumb_2.png`, `thumb_3.png` (3 high-contrast 1280x720 YouTube thumbnails in `Not so DARK TIMES!` house style: dark stage #0E0C0B, dot-grid, case-file graphic, massive Cream #FAF6EE text with single #E63946 Red punch word)
"""
import json, math, re, sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent

if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
    print(__doc__.strip())
    vids_dir = ROOT / "videos"
    vids = sorted([p.name for p in vids_dir.iterdir() if p.is_dir() and not p.name.startswith(("_", "."))]) if vids_dir.exists() else []
    print(f"\nAvailable topics:\n  {', '.join(vids)}")
    sys.exit(0)

vid = sys.argv[1]
vdir = ROOT / "videos" / vid
if not vdir.is_dir() or not (vdir / "script.json").exists():
    sys.exit(f"Error: script.json not found for topic '{vid}'.")

out_dir = vdir / "out"
out_dir.mkdir(parents=True, exist_ok=True)

script = json.loads((vdir / "script.json").read_text(encoding="utf-8"))
meta = script.get("meta", {})

# Load timeline if built, otherwise estimate durations from beats
tl_path = ROOT / "engine" / "src" / "videos" / vid / "timeline.json"
FPS = 30
beat_starts = {}
total_sec = 0.0
if tl_path.exists():
    tl = json.loads(tl_path.read_text(encoding="utf-8"))
    FPS = tl.get("fps", 30)
    for b in tl.get("beats", []):
        beat_starts[b["id"]] = b["start"] / FPS
    total_sec = tl.get("total", 0) / FPS
else:
    t_cur = 0.0
    for b in script.get("beats", []):
        beat_starts[b["id"]] = t_cur
        if "clip" in b:
            c = b["clip"]
            t_cur += max(4.0, float(c.get("to", 8.0)) - float(c.get("from", 0.0)))
        else:
            words_n = len((b.get("vo") or "").split())
            t_cur += max(3.6, words_n / 2.75 + 0.65)
    total_sec = t_cur

def fmt_ts(sec: float) -> str:
    sec = max(0, int(round(sec)))
    m, s = divmod(sec, 60)
    return f"{m:02d}:{s:02d}"

# Compute chapters from beat chapter markers or automatic act groupings
chapters = []
for b in script.get("beats", []):
    ch = b.get("chapter")
    if ch:
        chapters.append((beat_starts.get(b["id"], 0.0), ch.lower()))

if not chapters:
    beats_list = script.get("beats", [])
    n = len(beats_list)
    default_labels = ["the hook", "the hidden mechanism", "the paper trail", "who cashes in", "how to beat it"]
    step = max(1, n // len(default_labels))
    for idx, lbl in enumerate(default_labels):
        b_idx = min(n - 1, idx * step)
        if b_idx < n:
            ts = 0.0 if idx == 0 else beat_starts.get(beats_list[b_idx]["id"], idx * 30.0)
            if not chapters or ts > chapters[-1][0]:
                chapters.append((ts, lbl))

if chapters and chapters[0][0] > 0:
    chapters[0] = (0.0, chapters[0][1])

chapters_str = "\n".join(f"{fmt_ts(ts)} {lbl}" for ts, lbl in chapters)

# Extract sources from SOURCES.md if present
sources_path = vdir / "SOURCES.md"
sources_summary = meta.get("sources_line", "")
if not sources_summary and sources_path.exists():
    src_lines = []
    for line in sources_path.read_text(encoding="utf-8").splitlines():
        if line.startswith("|") and not line.startswith("|---") and "Claim" not in line and "Beat" not in line:
            cols = [c.strip() for c in line.strip("|").split("|")]
            if len(cols) >= 3 and cols[2]:
                src_lines.append(cols[2])
    if src_lines:
        seen_s = []
        for s in src_lines:
            if s not in seen_s:
                seen_s.append(s)
        sources_summary = " · ".join(seen_s[:8])
if not sources_summary:
    sources_summary = "Primary court filings, official technical documentation, and peer-reviewed studies (see SOURCES.md)."

# Extract CC attributions from LICENCES.md if present
lic_path = vdir / "LICENCES.md"
lic_block = ""
if lic_path.exists():
    lic_text = lic_path.read_text(encoding="utf-8")
    m_attr = re.search(r"```text\s*(.*?)```", lic_text, re.DOTALL)
    if m_attr:
        lic_block = "\n\nclip & image credits (CC / PD):\n" + m_attr.group(1).strip()

title_main = meta.get("title", f"the dark reality of {vid.replace('-', ' ')}")
title_alt1 = meta.get("title_alt1", f"why {vid.replace('-', ' ')} is a trap")
title_alt2 = meta.get("title_alt2", f"the hidden machine behind {vid.replace('-', ' ')}")
spine = meta.get("spine", "the system was never built for you. it was built to use you.")
desc_body = meta.get(
    "description",
    f"every time you interact with {vid.replace('-', ' ')}, an invisible mechanism runs in the background. "
    f"here is the paper trail, the numbers, and the 3 moves that flip the script back in your favor."
)
tags = meta.get(
    "tags",
    f"{vid.replace('-', ' ')}, dark reality, not so dark times, tech documentary, ai investigation, hidden mechanisms, digital privacy, consumer traps, investigative essay, dark times"
)
pinned = meta.get(
    "pinned_comment",
    "what was the exact moment you realized this system wasn't working for you? drop your story below ↓"
)

thumbs_spec = meta.get("thumbnails", [
    {"file": "thumb_1.png", "text": "IT WAS USING YOU", "red": "YOU", "badge": "EXHIBIT A // THE TRAP", "motif": "gate"},
    {"file": "thumb_2.png", "text": "THE HIDDEN MACHINE", "red": "HIDDEN", "badge": "CLASSIFIED // RECEIPTS", "motif": "dossier"},
    {"file": "thumb_3.png", "text": "NEVER FREE", "red": "NEVER", "badge": "AUDIT // 100% VERIFIED", "motif": "meter"},
])

metadata_txt = f"""CHANNEL: Not so DARK TIMES! (@notsodarktimes)
RUNTIME: {fmt_ts(total_sec)} ({total_sec:.1f}s)

=== TITLE OPTIONS ===
1. {title_main}
2. {title_alt1}
3. {title_alt2}

=== DESCRIPTION (Copy-Paste Ready) ===
{spine}

{desc_body}

chapters:
{chapters_str}

sources: {sources_summary}{lic_block}

business: notsodarktimes.business@gmail.com
part of Not so DARK TIMES! — the dark reality of everything.
#{vid.replace('-', '')} #ai #notsodarktimes

=== TAGS (Comma-Separated) ===
{tags}

=== PINNED COMMENT ===
{pinned}
"""

(out_dir / "metadata_FINAL.txt").write_text(metadata_txt, encoding="utf-8")
(out_dir / f"ship_{vid}.md").write_text(f"# Ship Package · `{vid}`\n\n```text\n{metadata_txt}```\n", encoding="utf-8")

# Render 3 thumbnails (1280x720) in house style
def load_font(size: int, mono: bool = False):
    candidates = (
        [
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
        ]
        if mono
        else [
            str(ROOT / "engine/public/fonts/ShantellSans-700.ttf"),
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
            "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        ]
    )
    for c in candidates:
        if Path(c).exists():
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()

W, H = 1280, 720
BG = (14, 12, 11)
CARD_BG = (22, 20, 17)
CREAM = (250, 246, 238)
MUTED = (138, 143, 152)
RED = (230, 57, 70)

for idx, tspec in enumerate(thumbs_spec[:3]):
    img = Image.new("RGBA", (W, H), (*BG, 255))
    draw = ImageDraw.Draw(img)

    # 1. Dot grid (64px)
    for x in range(48, W - 32, 64):
        for y in range(48, H - 32, 64):
            draw.ellipse((x - 2, y - 2, x + 2, y + 2), fill=(42, 38, 34, 255))

    # 2. Subtle red glow on the right subject zone
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse((680, 80, 1240, 640), fill=(230, 57, 70, 55))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=65))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # 3. Corner registration marks
    c_len = 28
    for cx, cy, dx, dy in [(36, 36, 1, 1), (W - 36, 36, -1, 1), (36, H - 36, 1, -1), (W - 36, H - 36, -1, -1)]:
        draw.line((cx, cy, cx + dx * c_len, cy), fill=(138, 143, 152, 120), width=3)
        draw.line((cx, cy, cx, cy + dy * c_len), fill=(138, 143, 152, 120), width=3)

    # 4. Right-side high-contrast case-file graphic
    rx0, ry0, rx1, ry1 = 760, 130, 1190, 590
    draw.rounded_rectangle((rx0 + 10, ry0 + 14, rx1 + 10, ry1 + 14), radius=18, fill=(0, 0, 0, 160))
    draw.rounded_rectangle((rx0, ry0, rx1, ry1), radius=18, fill=(*CARD_BG, 255), outline=(233, 227, 211, 95), width=3)

    f_mono_sm = load_font(22, mono=True)
    f_mono_md = load_font(28, mono=True)
    f_stamp = load_font(34, mono=True)

    # Header inside right evidence card
    draw.text((rx0 + 28, ry0 + 24), tspec.get("badge", "EXHIBIT A // VERIFIED"), font=f_mono_sm, fill=RED)
    draw.line((rx0 + 28, ry0 + 62, rx1 - 28, ry0 + 62), fill=(233, 227, 211, 60), width=2)

    motif = tspec.get("motif", "dossier")
    if motif == "gate":
        # Draw a crisp checkbox / gate lock with red tick (fitted cleanly inside card)
        bx0, by0, bx1, by1 = rx0 + 36, ry0 + 110, rx0 + 146, ry0 + 220
        draw.rounded_rectangle((bx0, by0, bx1, by1), radius=12, outline=CREAM, width=5)
        draw.line((bx0 + 22, by0 + 58, bx0 + 48, by0 + 84, bx0 + 90, by0 + 26), fill=RED, width=8)
        draw.text((bx1 + 20, by0 + 24), "I'm not a robot", font=f_mono_sm, fill=CREAM)
        draw.text((bx1 + 20, by0 + 62), "STATUS: FLAGGED", font=f_mono_sm, fill=RED)
        for row_i in range(3):
            ry = ry0 + 260 + row_i * 38
            draw.rounded_rectangle((rx0 + 36, ry, rx1 - 36, ry + 18), radius=5, fill=(48, 44, 39, 255))
    elif motif == "meter":
        # Draw a big gauge / dial with red danger zone
        cx_m, cy_m, r_m = (rx0 + rx1) // 2, ry0 + 240, 125
        draw.arc((cx_m - r_m, cy_m - r_m, cx_m + r_m, cy_m + r_m), start=180, end=360, fill=CREAM, width=10)
        draw.arc((cx_m - r_m, cy_m - r_m, cx_m + r_m, cy_m + r_m), start=300, end=360, fill=RED, width=14)
        draw.line((cx_m, cy_m, cx_m + 90, cy_m - 70), fill=RED, width=8)
        draw.ellipse((cx_m - 12, cy_m - 12, cx_m + 12, cy_m + 12), fill=CREAM)
        draw.text((cx_m - 92, cy_m + 32), "CRITICAL LOAD", font=f_mono_sm, fill=RED)
    else:
        # Dossier document with red highlighter sweep
        dx0, dy0, dx1, dy1 = rx0 + 42, ry0 + 92, rx1 - 42, ry1 - 102
        draw.rounded_rectangle((dx0, dy0, dx1, dy1), radius=10, fill=(248, 245, 238, 255), outline=(216, 209, 194, 255), width=3)
        for row_i in range(5):
            ly = dy0 + 32 + row_i * 44
            if row_i == 2:
                draw.rounded_rectangle((dx0 + 18, ly - 5, dx1 - 18, ly + 26), radius=4, fill=(230, 57, 70, 65))
                draw.rounded_rectangle((dx0 + 26, ly + 4, dx1 - 42, ly + 17), radius=4, fill=RED)
            else:
                draw.rounded_rectangle((dx0 + 26, ly + 4, dx1 - (65 if row_i % 2 else 32), ly + 17), radius=4, fill=(40, 36, 32, 180))

    # Red stamp at bottom of card (centered cleanly with padding)
    sx0, sy0, sx1, sy1 = rx0 + 52, ry1 - 88, rx1 - 52, ry1 - 28
    draw.rounded_rectangle((sx0, sy0, sx1, sy1), radius=8, outline=RED, width=4)
    f_stamp_fit = load_font(26, mono=True)
    st_txt = "RECEIPTS INSIDE"
    st_bb = draw.textbbox((0, 0), st_txt, font=f_stamp_fit)
    st_w, st_h = st_bb[2] - st_bb[0], st_bb[3] - st_bb[1]
    draw.text((sx0 + (sx1 - sx0 - st_w) // 2, sy0 + (sy1 - sy0 - st_h) // 2 - 2), st_txt, font=f_stamp_fit, fill=RED)

    # 5. Top-left brand badge
    draw.rounded_rectangle((68, 62, 430, 108), radius=8, fill=(26, 23, 20, 255), outline=(230, 57, 70, 180), width=2)
    draw.text((86, 73), "● NOT SO DARK TIMES!", font=f_mono_sm, fill=CREAM)

    # 6. Massive Left-Side Hook Text (guaranteed zero overlap with right card at rx0=760)
    words = tspec.get("text", "THE DARK REALITY").upper().split()
    red_word = tspec.get("red", words[-1]).upper()

    # Group into 2 or 3 impactful lines (1-2 words per line, max 11 chars per line)
    lines = []
    cur = []
    for w in words:
        if cur and (len(" ".join(cur + [w])) > 11 or len(cur) >= 2):
            lines.append(cur)
            cur = [w]
        else:
            cur.append(w)
    if cur:
        lines.append(cur)

    # Auto-fit hero font size so widest line stays <= 630px (leaves >= 58px gap before rx0=760)
    hero_sz = 88
    f_hero = load_font(hero_sz, mono=False)
    while hero_sz > 58:
        f_hero = load_font(hero_sz, mono=False)
        max_lw = max(draw.textbbox((0, 0), " ".join(lw), font=f_hero)[2] for lw in lines)
        if max_lw <= 630:
            break
        hero_sz -= 4

    start_y = 185 if len(lines) <= 3 else 145
    line_h = 118
    for l_idx, l_words in enumerate(lines):
        cur_x = 72
        cur_y = start_y + l_idx * line_h
        for w in l_words:
            clean_w = re.sub(r"[^A-Z0-9$%?]", "", w)
            is_red = (clean_w == re.sub(r"[^A-Z0-9$%?]", "", red_word))
            w_color = RED if is_red else CREAM
            # Drop shadow
            draw.text((cur_x + 5, cur_y + 6), w, font=f_hero, fill=(0, 0, 0, 220))
            draw.text((cur_x, cur_y), w, font=f_hero, fill=w_color)
            if is_red:
                bbox = draw.textbbox((cur_x, cur_y), w, font=f_hero)
                draw.rounded_rectangle((bbox[0], bbox[3] + 4, bbox[2], bbox[3] + 14), radius=4, fill=RED)
            bbox = draw.textbbox((cur_x, cur_y), w + " ", font=f_hero)
            cur_x = bbox[2]

    # Bottom red progress bar accent
    draw.rectangle((0, H - 10, W, H), fill=RED)

    thumb_out = out_dir / tspec.get("file", f"thumb_{idx+1}.png")
    img.convert("RGB").save(thumb_out, "PNG")

print(f"ship_package {vid}: wrote metadata_FINAL.txt, ship_{vid}.md, and 3 thumbnails in {out_dir}")
