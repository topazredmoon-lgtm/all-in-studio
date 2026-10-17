# STYLE BIBLE · Canonical Directorial & Visual Standard (`All-in` Studio)

> **CROSS-HARNESS PERMANENT MEMORY RULE**:
> Every owner review or correction—whether given in Antigravity, Claude Code, Cursor, Windsurf, or any future harness—is permanently recorded in `design-system/LEARNINGS.md`, reflected in this `STYLE_BIBLE.md` and `DESIGN.md`, and mechanically enforced by `tools/lint_text.py` before any render can run.

---

## 1. Layout & Flow Architecture: NO PERMANENT LEFT/RIGHT BI-SCREEN (Lessons #80 & #84)

> **Owner Mandates (2026-10-15 & 2026-10-16)**:
> *"i dont like the bi-screen left and right kinda permanent format. IT MUST BE MORE PLEASANT AND PREMIUM PRO TO WATCH PLEASE"*
> *"i want real quality videos worked and refined with human-like taste and auto check and review every single detail and innovate classy and neat stuff. just a fix, but keep working for hours autonomous and take initiatives."*

- **The Bi-Screen Trap (Banned)**: Dividing the screen into a 50/50 Left-Right `split` for the entire video is exhausting, mechanical, and feels like a two-column slide deck rather than a premium documentary film.
- **The Dynamic Layout Ratio (Enforced by `tools/lint_text.py` & `tools/taste_audit.py`)**:
  1. **`layout: "full"` + `layout: "scene"` + `clip` MUST represent >= 60% of cuts** (`split` strictly capped at **<= 40%**).
  2. **Maximum ONE consecutive `split` cut** (`max_consecutive_splits <= 1`). After 1 split, the screen MUST open up to a centered full-stage hero visual (`layout: "full"`), a full-bleed documentary photo (`layout: "scene"`), or a full-screen `clip`.
  3. **On-Screen Word Ceiling**: Maximum **12 words displayed on screen** per cut across all widgets/tags/quotes (excluding `cap`). The picture shows physical mechanisms; the voice tells the story!
  4. **Motion Liveness**: Every cut must exhibit noticeable visual progression between `t = 15%` and `t = 85%` of its duration (curseur, laser, aiguille, surlignage, découpe, compteur). Zero static PowerPoint slides.
  5. **`layout: "full"` (Centered Full-Stage Composition — 45% to 60% of cuts)**:
     - A single rich, self-contained hero visual (`hero: {...}`) commands the 1920×1080 `v23` stage with wide open air (>= 80px border margins):
       - Authentic interactive UI & tactile physical widgets (`Captcha4`, `ATSScanner`, `FourFifthsDial`, `FunnelSieve`, `StrawberrySlicer`, `BlindCounter`, `MemoryBelt`, `TokenTaxMeter`, `PhoneChat`, `PhoneCall`, `CallGrid`, `LoginCard`, `Score`, `Blocked`, `MousePath`),
       - Framed archival photographs and real documents (`Print`, `Polaroid` with handwritten red arrow notes, `AnnotatedPrint`, `BlogProof`, `ListDoc`),
       - Full-width process pipelines (`Flow` with 3–4 nodes and a running red dot, `Loop`),
       - Full-stage crowd/scale grids (`IconRow` with `↑ red tag`), or rising comparison `Bars`.
     - **Never** put a lone word object (`Bubble`, `CalendarCard`, `PageQuote`) or a lone bare `LineIcon` in `layout: "full"`.
  6. **`layout: "scene"` (Full-Bleed Documentary / Archival Frame — 15% to 30% of cuts)**:
     - Full-bleed graded real photography (`Film` with slow subtle 4% drift/push-in, date/location stamp, EXHIBIT badge, and red ring around the subject; `Hearing` archival still; `Cctv` reconstruction; `RouteMap` geographical map).
  7. **`clip` (Full-Screen Real Archival Video Clip — every 20–40s in full films)**:
     - Real human speaker breaking up the narrator's voice, with the `v23` top broadcast bar (`● SPEAKER // SOURCE`) for 3s and natural pre/post-roll room sound fades.
  8. **`layout: "split"` (Targeted Side-by-Side Comparison — Strictly `<= 40%` of cuts, MAX 1 in a row!)**:
     - Use `split` **ONLY** when two distinct objects genuinely need to sit side-by-side:
       - A named person's `Polaroid` on the Left + their typed `Bubble` question or `PageQuote` on the Right;
       - A `CalendarCard` year on the Left + the real photo/headline (`Print` / `BlogProof`) of what happened that year on the Right;
       - A direct A-vs-B contrast (`Captcha4` on Left + zoomed `Square` on Right).
     - **Hard Bans**: Never two line icons side-by-side (`L: LineIcon` + `R: LineIcon` is banned). Never two consecutive splits.

---

## 2. "SHOW WHO AND WHAT" — Real Photos & Concrete UI Evidence Over Stray Icon Slop (Lesson #81 · 2026-10-15)

> **Owner Mandate (2026-10-15)**: *"for example : the woman in the courtroom mentioned, should obviously show WHO AND WHAT, with images etc i guess, not just a random stray slop and what not"*

- **Zero Abstract Parables or Stray Icon Slop**:
  - When a line mentions a real-world courtroom case, a person, a company, a university, a city, or a dated incident, you must **NEVER** illustrate it with generic stick-figure `LineIcon`s (like a generic phone icon + a generic stick person)!
  - **Always name and show WHO and WHAT**:
    1. **WHO & WHERE (Real Photographs from Wikimedia Commons)**:
       - Fetch real CC0 / CC-BY / CC-BY-SA / Public Domain photographs via the Wikimedia Commons API into `engine/public/<slug>/` (and log author/licence/URL in `_commons.json` & `LICENCES.md`).
       - Display the real person (`Polaroid` / `AnnotatedPrint` with their real photo, name pill, and red handwritten arrow notes), the real place/courthouse/campus (`Film` in `layout: "scene"` or `Print` in `layout: "full"`), or the real news/court/study headline (`BlogProof` with a red box on the headline + verbatim quote slip).
    2. **WHAT (The Exact Evidence Artifact)**:
       - Show the concrete digital or physical evidence named by the narrator:
         - If the line mentions fake text messages or a chat trap -> show **`PhoneChat`** displaying the actual fabricated messages on screen.
         - If the line mentions a cloned voice recording or kidnapping call -> show **`PhoneCall`** with the caller ID and the voice waveform turning red (`"ai voice"`).
         - If the line mentions the $25.6M Hong Kong deepfake video call -> show **`CallGrid`** (2×2 video call where red scan boxes flag the fake faces).
         - If the line mentions a court filing, FBI report, or Terms of Service clause -> show **`BlogProof`**, **`ListDoc`**, or **`PageQuote`** (cream paper slip with red highlighter sweep on the exact 4–8 words).
  - **Hard Cap on `LineIcon` (Enforced by `tools/lint_text.py`)**:
    - `LineIcon` is capped at **max 25% of visual objects** across a video.
    - Putting `LineIcon` on both sides of a `split` (`L: LineIcon` + `R: LineIcon`) is **strictly banned**.
    - Any beat whose narration mentions a real-world person, court, place, institution, or year (2000–2026) **FAILS `lint_text.py`** if it does not include at least one real photo (`Film`, `Print`, `Polaroid`, `AnnotatedPrint`, `Hearing`) or concrete UI/document evidence (`BlogProof`, `PageQuote`, `PhoneChat`, `PhoneCall`, `CallGrid`, `Captcha4`, `Score`, `Blocked`, etc.).

---

## 3. Voice & Base Kit (`All-in_captchas_full_v2.mp4` Standard · Lesson #79)

- **Voice Engine**: **`python tools/tts.py <slug>`** (`.llin.ps1 tts <slug>`) — **Kokoro `af_heart` at `speed: 0.95`**, `"master": "v23"`, `"pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 2.0}`.
- **Retired & Banned Components**:
  - `ds/evidence.tsx` boxy cards (`DossierDoc`, `ForensicStamp`, `FieldCard`, `CodeTerminal`, `MetricChart`, `Highlighter`) are **banned**.
  - `ds/engrave.tsx` woodcut plates (`Ouroboros`, `Balance`, `GuardrailGate`, etc.) are **banned**.

---

## 4. Haute-Couture Tactile Design & End of Programmer-Art (Lesson #85 · 2026-10-16)

> **Owner Mandate (2026-10-16)**:
> *"ive looked at some vids, the designs must feel better and pleasing to look at, and less amateur"*

- **The Programmer-Art Sins (Permanently Outlawed)**:
  1. **Dark-on-Dark Boxes (`#161411` on `#0E0C0B`)**: Low contrast, dull, feels like an uninspired developer terminal or flat dashboard.
  2. **Wall of Small Text**: Putting 10+ lines of small text inside a card. Use skeleton bars for secondary context and ONE massive readable headline.
  3. **Crude Geometric Wireframes**: Thin gray borders on raw SVG shapes.
  4. **Stiff Linear Animations**: Elements popping in without organic easing, spring physics, or human interaction.
- **The Haute-Couture Standard (`All-in_captchas_full_v2.mp4` & Vox/Harris Standard)**:
  - **High-Contrast Physical Surfaces**: Pure white cards (`#FFFFFF`) with bold colored headers or warm slanted parchment (`#F6F2E8` / `#EEE8DC`) floating with `SHADOW_DEEP = "0 30px 70px rgba(0,0,0,0.82), 0 8px 22px rgba(0,0,0,0.55)"`.
  - **Focal Point Typography (36px–64px)**: One central typographic line dominates the visual hierarchy, backed by subtle `#E2DDD2` skeleton bars.
  - **Interactive Cursor Physics**: Use `TactileCursor` with realistic spring movement, scale-on-click, and animated red click ripples (`#E63946`).
  - **Universal Shared Tactile Components (`engine/src/ds/tactile.tsx`)**:
    - `JobPortalCard`: Authentic job portal with applicant counter, resume score, and animated rejection trigger.
    - `StrawberrySlicer`: Physical subword tokenizer splitting letters into numbered token bricks.
    - `UtilityBillCard`: Rotated cream parchment electric statement with animated surcharge highlighter.

---

## 5. Neuro-Perceptual Smoothness & Zero-Brain-Strain Visuals (Lesson #86 · 2026-10-17)

> **Owner Mandate (2026-10-17)**:
> *"i saw a new sample, it does not feel pleasant for the eyes enough. the viewer should not have to make his brain do effort to watch the video. it should be really smooth and catchy all the way everywhere. use psychology to design and change everything please"*

- **The 4 Neuro-Perceptual Laws (`engine/src/ds/psychology.tsx`)**:
  1. **Figure-Ground Segregation (`SmoothStage` + `TactileCard`)**:
     - Never place `#161411` cards on the `#0E0C0B` stage. High-contrast ivory (`#F7F3EA`) or crisp white (`#FFFFFF`) floating cards with `SHADOW_DEEP` ensure zero ocular strain. A subtle 0.35Hz camera float + warm spotlight keeps the stage alive.
  2. **Eliminate Mayer's Split-Attention & Redundancy (`SkeletonBars`)**:
     - Do not force the viewer's eyes to read paragraphs while listening to narration. Replace secondary text with soft `#E2DDD2` rounded skeleton bars. One massive statement (36px–72px) provides immediate visual orientation.
  3. **Zero Stray Icon + Bubble Slop**:
     - `LineIcon + Bubble` pairs are permanently outlawed. Replace with bespoke tangible mechanisms (`StrawberrySlicer`, `BlindCounter`, `MemoryBelt`, `TokenTaxMeter`, `ATSScanner`, `FourFifthsDial`, `FunnelSieve`).
  4. **Dynamic Cueing & Pre-Attentive Focus (`HandInkCircle` & `TactileCursor`)**:
     - Guide the eye with Posner spatial cueing: hand-drawn pressure-sensitive crimson ink circles and realistic spring-mass cursors that click on exact spoken words.

---

## 6. Game-Feel Motion Physics & "Juice" (@motionbykrit Standard · Lesson #87 · 2026-10-17)

- **The Game-Feel Mandate (`engine/src/ds/juice.tsx`)**:
  - Never slide objects linearly without mass or deceleration!
  - Every high-impact visual interaction implements the 3 signature cycles from `@motionbykrit`:
    1. **Dash Physics**:
       - 6-frame anticipation wind-up (`useGameFeelPhysics`, `scaleX/Y: 0.94`, sinusoidal tremble `rattleX, rattleY`).
       - Impact squash & stretch (`scaleX: 1.28, scaleY: 0.76` on hit -> `scaleX: 0.88, scaleY: 1.15` rebound).
       - Streaky dash velocity lines (`<SpeedLines direction="horizontal"|"vertical">`).
    2. **Satisfying Pickups & Counters**:
       - Radial particle bursts (14 diamond/star particles) + 2 expanding shockwave rings (`<ImpactBurst>`).
       - Spring-mass popup badges (`<FloatingPopScore text="+3 SHARDS!" />`, `<FloatingPopScore text="0.2s TRASHED!" />`, `<FloatingPopScore text="4.5× PRICE HIKE!" />`) with `-3deg` tilt, scale-punch (`1.32 -> 1.0`), and floating upward drift.
       - Screen camera shake (`shakeX, shakeY`) with rapid spring decay.
    3. **Epic Reveal Physics**:
       - Rotating volumetric god-rays (`<VolumetricGodRays>`) bursting from behind focal cards.
       - 3D toy-like extruded block depth (`<Tactile3DBlock>` with 11px bottom lip + animated diagonal `<SpecularSheen>` sweep).
       - Double-stroke hand-drawn marker emphasis (`<DoodleUnderline>`) under focal text phrases.
- **Automated Gatekeeper**:
  - `tools/taste_audit.py` enforces Gate 8: `>= 4/8` active Juice primitives in bespoke visual files.

