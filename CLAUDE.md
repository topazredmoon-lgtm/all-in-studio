# AGENTS.md · Universal Multi-Harness Instructions (Antigravity, Claude Code, Cursor, Windsurf, Gemini, Codex)

> **READ THIS FIRST ON EVERY SESSION IN ANY HARNESS**:
> Before writing or editing any script, visual, or tool in this repository, you MUST read:
> 1. `All-in/design-system/LEARNINGS.md` (especially Lessons #79–#84 from 2026-10-15 and 2026-10-16)
> 2. `All-in/design-system/STYLE_BIBLE.md` & `All-in/design-system/DESIGN.md`
> 3. `All-in/PLAYBOOK.md` & `All-in/HANDOVER.md`

## Permanent Owner Laws (Enforced Automatically by `tools/lint_text.py` & `tools/taste_audit.py` in `build.py` & `qa.py`)

1. **Every Owner Input Must Make the Project Learn Forever (Lesson #82)**:
   - Whenever the owner gives feedback or reviews a sample/video, you MUST in the exact same turn:
     1. Append the verbatim note and numbered lesson at the top of `All-in/design-system/LEARNINGS.md`;
     2. Update `All-in/design-system/STYLE_BIBLE.md` and `All-in/design-system/DESIGN.md`;
     3. Add an automated check in `All-in/tools/lint_text.py` (or `taste_audit.py` / `lint_cues.py` / `lint_clips.py` / `voice_check.py`) so no future video in any harness can ever repeat that mistake.

2. **No Permanent Left/Right Bi-Screen Format (Lessons #80 & #84)**:
   - Owner: *"i dont like the bi-screen left and right kinda permanent format. IT MUST BE MORE PLEASANT AND PREMIUM PRO TO WATCH PLEASE"*
   - **Rule**: `layout: "split"` is **capped at <= 40% of cuts**, and **never more than 1 `split` cut in a row (`max_consecutive_splits <= 1`)**!
   - **At least 60% of cuts MUST use `layout: "full"` (centered full-stage hero visual), `layout: "scene"` (full-bleed documentary photograph/frame), or `clip` (full-screen archival video clip)**.

3. **Show "WHO and WHAT" with Real Images & Concrete UI Evidence — Zero Stray Icon Slop (Lesson #81 · 2026-10-15)**:
   - Owner: *"the woman in the courtroom mentioned, should obviously show WHO AND WHAT, with images etc i guess, not just a random stray slop and what not"*
   - **Rule**: Whenever narration mentions a real-world person, courtroom case, place, university, agency, company, or dated event, you MUST:
     1. Name the real case/person/institution in the script;
     2. Download real CC0/CC-BY/PD photographs from Wikimedia Commons into `All-in/engine/public/<slug>/` (logged in `_commons.json` & `LICENCES.md`) and display them via `Film` (`layout: "scene"`), `Print`, `Polaroid`, `AnnotatedPrint`, `Hearing`, or `BlogProof`;
     3. Show the specific evidence ("WHAT") via authentic UI/document widgets (`PhoneChat`, `PhoneCall`, `CallGrid`, `LoginCard`, `Captcha4`, `Square`, `Score`, `Blocked`, `BlogProof`, `PageQuote`).
   - Generic `LineIcon`s are capped at **<= 25% of visual objects**, are **banned on both sides of a `split` (`L: LineIcon` + `R: LineIcon`)**, and are **banned as the sole visual of `layout: "full"`**.

4. **Canonical Voice & Visual Kit (`All-in_captchas_full_v2.mp4` Standard · Lesson #79)**:
   - **Voice**: Always use `python All-in/tools/tts.py <slug>` (`. llin.ps1 tts <slug>`) — **Kokoro `af_heart` at `speed: 0.95`**, `"master": "v23"`, `"pace": {"lead": 0.2, "gap": 0.45, "min_beat": 2.4, "to_clip": 0.25, "after_clip": 0.45, "end_pad": 2.0}`.
   - **Banned Visuals**: `ds/evidence.tsx` boxy cards (`DossierDoc`, `ForensicStamp`, `FieldCard`, `CodeTerminal`, `MetricChart`, `Highlighter`) and `ds/engrave.tsx` woodcut plates (`Ouroboros`, `Balance`, `GuardrailGate`, etc.) are permanently banned.

5. **Studio OS Dashboard Contract (index.html & tools/autonomous_studio.py · Lesson #83)**:
   - *Never overwrite the HTML/CSS/JS design of index.html. To update studio telemetry, topics, dossiers, or incubator items from any harness or model, update ONLY the JSON block between /* __STUDIO_DATA_START__ */ and /* __STUDIO_DATA_END__ */ (or run python tools/autonomous_studio.py).*
   - All telemetry and topic updates (MANIFEST, DOSSIERS, INCUBATOR, TELEMETRY, STAGE_PREVIEWS) live strictly between /* __STUDIO_DATA_START__ */ and /* __STUDIO_DATA_END__ */ inside index.html and are synced to studio_data.json.

6. **Autonomous Initiative, Motion Liveness & On-Screen Word Ceiling <= 12 Words (Lesson #84 · 2026-10-16)**:
   - Owner: *"i am not happy with how the project is going. it must be much much smarter and autonomous. i want real quality videos worked and refined with human-like taste and auto check and review every single detail and innovate classy and neat stuff. just a fix, but keep working for hours autonomous and take initiatives."*
   - **Autonomous Worker**: The studio daemon runs autonomously for hours to proactively advance topics, refine scripts, download CC/PD photos, compile timelines, render stills, audit taste, and render MP4s.
   - **On-Screen Word Ceiling**: Maximum **12 words displayed on screen** per cut (excluding `cap`).
   - **Motion Liveness**: Every cut must exhibit noticeable visual progression between `t = 15%` and `t = 85%` of its duration (`np.mean(np.abs(f85 - f15)) >= threshold`).
   - **Tactile Widgets**: Complex mechanisms use intuitive physical/UI widgets (`StrawberrySlicer`, `BlindCounter`, `MemoryBelt`, `TokenTaxMeter`, `ATSScanner`, `FourFifthsDial`, `FunnelSieve`, `UtilityStatement`, `PJMGridSurge`). Zero fake text boxes (`ComptrollerDocket`, `FERCDocket`, etc. are banned).

7. **Haute-Couture Tactile Kit & End of Programmer-Art (Lesson #85 · 2026-10-16)**:
   - Owner: *"ive looked at some vids, the designs must feel better and pleasing to look at, and less amateur"*
   - **Rule**:
     1. **Zero Dark-on-Dark Boxes**: Never place low-contrast `#161411` cards on the `#0E0C0B` board. Tangible objects must be high-contrast crisp white (`#FFFFFF`) or warm parchment (`#F6F2E8` / `#EEE8DC`) floating with `SHADOW_DEEP = "0 30px 70px rgba(0,0,0,0.82), 0 8px 22px rgba(0,0,0,0.55)"`.
     2. **Skeleton Context + Giant Focal Typography**: Use soft `#E2DDD2` skeleton bars for secondary context and ONE massive typographic statement (36px–64px). Never 10+ lines of small text.
     3. **Organic Physics & Cursor Interaction**: Use `TactileCursor` with realistic mass/damping spring motion and animated red click ripples (`#E63946`).
     4. **Universal Tactile Components (`engine/src/ds/tactile.tsx`)**: Use `JobPortalCard`, `StrawberrySlicer`, `UtilityBillCard`. Banned amateur names: `VectorSpace`, `LanguageTax`, `TokenSieve`, `RawSvgBox`, `FlatDashboard`.