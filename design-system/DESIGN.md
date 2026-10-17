# All-in design system

One system, merged from three projects, that keeps learning. Code is the source of truth (`engine/src/ds/`); this file is the spec.
Every video adds to `VISUALS.md` (what it invented) and `LEARNINGS.md` (what review taught). Read all three before building a video.

## Where each part came from

| Part | Source | What was taken |
|---|---|---|
| **The kit: Design System Reels "minimal"** (owner, 2026-10-07 on v4: "the beautiful design system … u did not even use it nor upgraded it") | Featured design "minimal" (local copies `research/disgn-systems/`; online artifact: https://claude.ai/artifact/KtY7VLmHddAf5qHgr95RAK) | Its pacing (a new picture every 1–3 s), thin line-art drawings that draw on at their word (person, robot, gate, desk, eye, book, envelope, doc), the tiny act kicker top-left (red number), single objects centred on the board, almost no words. Merged on top of v23 (it was built from v23's look, so both agree). Code: `engine/src/ds/kit.tsx`. |
| **The base system: v23 itself** | `Desktop/captchas_v23_PERFECTED.mp4`, rendered by jolly-bell (`takeover` branch: `src/theme.ts`, `src/AmbientLayer.tsx`, `src/primitives/Caption.tsx`, `ChapterCard.tsx`, `domains/mockups/VideoEmbed.tsx`); frames in `research/v23/` | Owner, 2026-10-07: "the designs and style copied from captchas_v23_PERFECTED.mp4". "Signal" stays retired. Since v5 (owner, 2026-10-07 evening) the reels' featured "minimal" design is merged on top as the kit (next row). |
| The board and the split | v23 (measured on its frames) | Warm black board, 96 px dot grid at 10 %, rounded registration corners, vignette; two objects with wide air, centres x 520 / 1400, y 450, about 575 px wide; hand caption at the bottom (bottom 75 px) with one red keyword; real artefacts over drawings |
| Tokens and type | jolly-bell takeover, v3 design system (`src/design/`, DECISIONS T002–T004, T013) | "Newsprint at night" palette (stage, raised, paper, one red); Source Serif 4 / Archivo / IBM Plex Mono; 24 px floor; paper only for physical evidence; caption set in Archivo, never a hand font; honesty plates; hard cuts |
| Modes, plates, sync, pacing | not-so-dark-times grammar v4 (`DESIGN.md`, `PREFERENCES.md`) | Hook / explain / evidence / human modes; teal only for "verified/correct"; source plate on every number; cue-word entrances; voice and breath pacing (lead 0.5 s, gap 1.1 s); clips freeze at the cut; no whooshes, no drone |
| Process | HOLLYSCRATCH (`SCRATCH HOLY`, top-level notes only) | Review stills (contact sheet) before any render; decisions logged. **No music** (owner, 2026-10-07). |

## Hard rule: no big text on an empty screen (owner, 2026-10-07, v5 → v6)

Owner's words: "i dont want big text in an emptu screen … especially not centered like … a question mark alone … or a '63years' alone written in big centered in empty screen".
- Every shot is led by a picture: a photo, a real page, real UI, a line drawing, a group of drawings. Text, a number or a symbol is never the picture.
- Numbers and names are a small handwritten red `tag` (46 px, ≤ 24 characters, a little arrow up) under the picture they belong to, landing on their word: "819 million hours" under the captcha, "63 years, every day" under 63 hourglasses.
- Word objects (speech bubble, calendar card) always sit beside a picture in the split, never alone.
- No chapter cards (big title on an empty board); an act opens on a picture with the caption.
- `Count`, `Word` and `Payer` stay in code for reference but are banned in shots. `tools/lint_text.py` (run by `build.py` before anything else) fails the build on any of the above, on tags over 24 characters and on captions over 6 words.

## Clips (owner, 2026-10-08; replaces "Monetization-safe by default")

- Real clips with their own voice break the narration every 20–40 s; the hook is a clip in the first seconds. 4–12 s
  each, set up before and commented after, named by the plate. Never two clips back to back.
- **Zero revenue risk (owner's top rule, 2026-10-08):** only openly licensed clips (CC BY / BY-SA / CC0 / PD / gov,
  Commons, media.ccc.de CC BY 4.0, creators' CC BY uploads). No news excerpts, no TED, no re-uploaded stock. Every clip
  gets a risk row in LICENCES.md; any clip above "near zero" must be named in the delivery.
  Details: `design-system/CLIPS.md`.
- Clip in/out points sit on sentence boundaries, never on the last syllable: out = last word end + 0.15-0.4 s, in the
  energy dip. `tools/clip_words.py` + `tools/lint_clips.py` (in build) enforce it. A clip lands one complete point (≥ ~6 s).
- **Clip edit (owner, 2026-10-11: "amateurish, not natural at all").** `from`/`to` mark the first and last spoken word;
  `build.py` adds a pre-roll (≤ 0.45 s) and post-roll (≤ 0.7 s) taken from the clip's own silence (never into another
  word), fades the room sound in/out over them, and the narrator's next line starts during the fade. The picture plays
  through the post-roll (no freeze). Name plate = a documentary lower third (name, who they are), 3 s.
- **Every clip has a purpose** (owner, 2026-10-11): it shows a reveal, a confession or the stakes in a real voice.
- Photos only with a recorded licence: Commons/Openverse CC0, public domain, CC BY, CC BY-SA, fetched with the API (author/licence logged).
- No music; SFX procedural (`tools/sfx.py`); voice Kokoro (Apache-2.0). Mark synthetic voice in YouTube Studio when asked.

## Voice (owner, 2026-10-08 late)

- Every acronym or initialism on screen is read aloud while it is on screen (CAPTCHA → "Completely Automated ..."); its
  expansion appears word by word as it is said (`expandAt` / `expandEndAt`). No silent holds for reading.
- No unnatural pauses: `tools/tts.py` caps inner silences (comma 0.30 s, stop 0.50 s, mid-phrase 0.18 s). Write whole
  spoken sentences; avoid chains of 2-word fragments, which Kokoro reads with long gaps.
- **Pronunciation (owner, 2026-10-11: "a human would never say G P T the way it said it").** Never spaced letters in
  `say`. Names and initialisms are in the `LEX` table of `tools/tts.py` (IPA, one word, natural stress). Add new names
  there and check them with Whisper + `tools/voice_check.py`.
- **Even tone.** `tts.py` levels every line to the same loudness; `voice_check.py` flags lines whose pitch or level is an
  outlier; rewrite or re-voice them before building.
- After every voice pass, list gaps ≥ 0.5 s inside lines and silences ≥ 1.2 s between lines (outside clips) and fix them.

## Long films (8 min+, captchas-full)

- Acts of 45–70 s, each with a kicker ("04 eyes on the street") and an opening re-hook line ("books were only the beginning").
- One open loop planted in the first 40 s ("by the end, you'll know who cashed in") and paid off in the second-to-last act.
- Near the end, a 3-cut recap montage of the film's key objects (warped words, the checkbox, the grid), then the flip line.
- Length comes from beats, not from slower pacing: same lead 0.2 / gap 0.45, same 2–4 s cuts; ≈ 1,250 narrated words for 8:00.
- `tools/lint_cues.py` runs in `build.py` with `lint_text.py`: cue words must be spoken (digits for numbers), cuts in order, no cut under 0.9 s, no cut that opens on an empty board, left object on screen from the cut, right object within 2 s unless `reveal=True`.

## The shots (`ds/layouts.tsx`)

| layout | use it for | rules |
|---|---|---|
| `full` | **the hero standard** (≥ 55% with `scene` & `clip`) | One strong, beautifully centered visual on the v23 board with wide breathing room (authentic UI widget, flow, bars, proof document, or account wall). Never a lone LineIcon. |
| `scene` | **documentary immersion** | Full-frame authentic CC/PD photography (`Film` with slow subtle drift, `Hearing`, `Cctv`, `RouteMap`) with archival metadata stamp ("EXHIBIT", date, location). |
| `split` | side-by-side comparison (**capped at ≤ 45%**, max 2 consecutive) | Left = the subject, on screen from frame 0. Right = the evidence, landing on cue (`enter`). Panels at 700 × 540, centred at x 520 / 1400. Never L: LineIcon + R: LineIcon. |
| `clip` | archival footage | Full frame, v23 broadcast plate at the top ("● SPEAKER // SOURCE" … "HISTORICAL RECORD // 1080P"), no caption, frozen at the cut. |
| `chapter` | **banned since v6** (text on an empty board) | Open an act on a picture with its caption; the act kicker top-left names it. |

Rhythm (2026-10-15 standard): **something new on screen every 2–3 s**. A beat (one or two spoken sentences) is cut into `cuts` that hard-cut on their cue words; each cut is one idea, one picture, one caption. Layout cadence: **≥ 55% full/scene/clip, ≤ 45% split (max 2 consecutive splits)**. Whenever narration names a real case, person, court, city, university, company, or date, it must show **WHO AND WHAT** (real CC/PD photos from Wikimedia Commons in `engine/public/<slug>/` + authentic UI receipts, with `LineIcon` strictly capped at ≤ 25%).


## Word sync (the core rule)

What is on screen changes with what is said. Every visual takes cue words:
- `enter` on a panel: the panel lands 4 frames before that word (right panels; left panels are there from frame 0 so a cut never shows an empty board).
- `at`, `ringAt`, `nameAt`, `figAt`, `clickAt`…: the performing motion inside the visual (a counter rolls, a ring draws, a stamp slams, a row appears) lands on its word.
- Cue words come from Whisper word timings of the voiced line (`videos/<id>/audio/<beat>.words.json`), so they are exact, not guessed.
- Pick the cue word as the word that *names* the thing: "Carnegie" for the school row, "Louis" for the name, "30" for the percentage.
- The first element of every visual is on screen at frame 0; only later elements wait for their words. A number is never shown before it is said (no "0" waiting).
- A right panel enters on the first word that belongs to it, no later than about 2 s into the beat unless that panel is the reveal.
- Inside flex boxes, wrap `<Accent>` in a `<span>` (flex items drop the spaces between words).

## Tokens (`ds/tokens.ts`, values from jolly-bell `src/theme.ts`)

Colour (v23): stage `#0E0C0B`, card `#161411`, ink `#F4F1EA` (caption `#FAF6EE`), mute `#8A8F98`, accent red `#E63946`, card border cream chalk `rgba(233,227,211,0.28)`, go green `#4FB286` only for pass ticks. Paper `#EEE8DC` only for physical documents. Re-created third-party UI keeps its own colours.
Type (v23): Shantell Sans for captions and hooks; IBM Plex Mono for everything inside cards, numbers, titles, plates; Source Serif 4 only for quotes and documents.
Caption (v23 `Caption.tsx`): Shantell 600, 54 px, `#FAF6EE`, keyword red 800, bottom 75 px, 18-frame fade, held to the cut, ≤ ~6 words.
Ground (v23 `AmbientLayer.tsx`): stage + 96 px dot grid (r 2, 10 %) + four rounded corner marks at 54 px (22 %) + vignette. No act label, no glows.
Card (v23): `#161411`, 1.5 px chalk border, radius 10, deep shadow; title in mono caps 20 px inside top-left; source under the card in mono 22 px.
Polaroid (v23 PhotoEmbed): dark frame with chalk border, black-and-white photo, name in a bordered mono pill.
Density (owner, 2026-10-07, twice): **the narrator carries the information; the screen shows pictures.** Per shot: the caption (≤ 5 words, one or two red keywords) + at most one or two words inside the picture (a name pill, a unit, "count?"). No kickers, no card titles, no sentences in panels, no explanatory labels; a source is one quiet mono line under the object, only where a number or a quote is shown.
Motion: fade-only entrances, cue lead 4 frames, counters 40 frames, stamps 6 frames; photos drift ≤ 4 %; hard cuts. No music.

## Primitives (`ds/core.tsx`)

`Panel` (kicker + surface card/paper/bare + footer plate) · `Sticker` (retired with Signal) · `Print` (photo with cream border and printed credit) · `AnnotatedPrint` (polaroid + handwritten red arrow notes) · `Ring` (draws on around a target) · `Sweep` (underline or highlighter) · `Stamp` · `Check` · `Accent` (red keyword markup) · `useCue` / `useCount` / `enterStyle`.

## Hard rules (carried from the owner's notes in all three projects)

- Every visual matches the words at that moment. If you cannot say what the narrator is saying while it is on screen, delete it.
- Nothing overlaps, nothing is clipped, nothing outlives its beat, no empty or all-black frame.
- Real things first: the real captcha, the real photo of a person when they are named, the real page as proof. Drawings are the fallback and say "Illustration".
- Every number carries its source on screen (panel plate). Our own arithmetic says "our arithmetic".
- Never the same visual twice in a video; never recycle a past video's topic visuals as filler (the system recurs, the props do not).
- Hand font only for captions, hooks and notes (minimal print); no comic fonts, no push-in on documents or UI, no music, no whooshes, no drones, no talking down to the viewer.

## How the system evolves

1. A new topic gets new visuals in `engine/src/visuals/<topic>.tsx`, built only from `ds/` primitives and tokens.
2. Each one is logged in `VISUALS.md` with the line it served and its cue word.
3. After review (owner notes or our own stills), the lesson goes into `LEARNINGS.md`. If it is general, it is promoted into this file or into `ds/` code in the same turn.
4. A visual that works across topics (a counter, a timeline, a quote slip) graduates from `visuals/<topic>.tsx` into `ds/` so the next video can use the pattern with new content.



### Engraving Plates (`engine/src/ds/engrave.tsx`, added 2026-10-13)
The high-craft artistic register when `LineIcon` pictograms are too simplistic for serious metaphors.
Full specification, rules, cutting schedules, and reference cut (`ouroboros.tsx`): see `PLATES.md`.
- Three weights (`CONTOUR` 4.6, `INNER` 2.8, `DETAIL` 1.5).
- Volume drawn through `<Hatch>` and `<Stipple>`, light from upper left.
- Inked on along its length via `useCutIn`/`Plate`.

## The kit (`ds/kit.tsx`, v5) — minimal print merged with v23's objects

| Object | Use it for | Rules |
|---|---|---|
| `LineIcon` | a person, a robot, a gate, a desk, an eye, a book, a doc, an envelope, a coin, a contract, an hourglass | Drawn on in 16 frames at its word; ~5 px pen whatever the size; ≤ 400 px; ink with one red detail; optional ✓ / ✗ / ? badge on its own word; label ≤ 2 words in mono. |
| `IconRow` | many of one thing (robots signing up, strangers agreeing, a pile of books) | Items pop in one after another (every 2–5 frames); fixed columns. `decay: true` (added why-ai-dumber, 2026-10-13) fades each later item toward 35% opacity — a quality/signal dropping across repeats or generations, without a fake chart. |
| `Count` | **banned in shots (v6)** | A number is a `tag` under its picture. |
| `CalendarCard` | a year | v23 card; always beside a picture in the split, never alone. |
| `Bubble` | a quote or a question someone asked | v23 speech bubble, typed on its word; always beside the person who says it (photo or drawing), never alone. |
| `Polaroid` | a named person | B&W photo, dark frame, name pill; up to two handwritten red notes with arrows on their words. |
| `Word` | **banned in shots (v6)** | Show the thing (a warped "captcha") and tag its name. |
| `Bars` | two or three quantities | v23 red/teal bars rising on their words; label with the number sits on top of each bar (captchas-full). |
| `Flow` | a process in steps (a bot relays a puzzle to a worker) | 2–4 drawings joined by arrows drawing on at each node's word, a red dot runs along; labels ≤ 2 words; full width. |
| `IconRow marks` / `morph` | votes (mixed ✓/✗); one thing becoming another | per-item marks; `morph` turns each drawing into a person in turn. |
| `Loop` (added why-ai-dumber v2, 2026-10-13) | a process that feeds itself (a system trained on its own output, an echo chamber, a feedback loop) | 2–4 drawings around a ring, arrows draw on at each node's word; the arrow that closes the ring (last node back to the first) is red — that is the one the line is about. `Flow` only runs one way; use `Loop` whenever the line says the output becomes the next input. |
| `Copier` (added why-ai-dumber v2, 2026-10-13) | generation loss (a model retrained on its own generations, a rumour retold, a signal re-encoded) | "A photocopy of a photocopy": the same page re-scanned `gens` times, one popping in per cue; a bold headline survives, the fine print (the rare, specific detail) blurs and fades first — shows "the rare stuff disappears first" as a picture instead of a declining bar chart. Plate it `illustration` like any invented chart. |
| `FieldCard` (added why-ai-dumber v2, 2026-10-13) | a short list read out loud (what changed, what's inside, what passed) | A quiet spec-sheet card: label → value rows filling in on their words, each with a small drawing or a ✓/✗. Use instead of repeating `IconRow` for "three things, one after another" — the card reads as one object, not a repeated drawing. |

Third-party UI is re-created at its true look and checked against real footage (v5 opening: reCAPTCHA's 4 × 4 "squares" challenge is ONE photo cut into 16 squares, header "Select all squares with / traffic lights / If there are none, click skip", blue round checks on picked squares that shrink inside a white border, reload / audio / info icons, blue VERIFY; compared frame by frame with the WSJ clip). The 3 × 3 variant ("Select all images with") uses 9 separate photos; never mix the two.
| `tag` (any visual, `ds/layouts.tsx`) | a number or name that belongs to a picture | Handwritten red, 46 px, ≤ 24 characters, small arrow up, lands on its word. |

## Haute-Couture Tactile Kit (`ds/tactile.tsx`, Lesson #85 · 2026-10-16)

The definitive professional tactile visual kit replacing amateur programmer-art (no dark-on-dark `#161411` on `#0E0C0B` boxes, no walls of small text, no crude wireframes):

| Component | Visual Surface & Contrast | Motion & Interactive Physics |
|---|---|---|
| `TactileCursor` | Realistic SVG cursor (`#FFFFFF`, stroke `#111111`) with deep shadow | Natural mass/damping spring curve; expands red click ripple ring (`#E63946`) on cue word. |
| `JobPortalCard` | Crisp white card (`#FFFFFF`) with vivid blue header (`#0A66C2`) and `SHADOW_DEEP` | Resume PDF skeleton line with live keyword score, interactive action button flipping to auto-rejection on mouse click. |
| `StrawberrySlicer` | Crisp white card (`#FFFFFF`) with `cl100k_base` tokenizer tag | Letters split into 3 tactile numbered token bricks (`interpolate([0, 1], [0, 26])`) turning dark with red border and token IDs. |
| `UtilityBillCard` | Warm parchment `#F6F2E8` rotated `-0.8deg` with `SHADOW_DEEP` | Monthly statement with skeleton delivery rows and animated red gradient highlighter sweep across capacity surcharge. |

## Neuro-Perceptual Psychology Kit (`ds/psychology.tsx`, Lesson #86 · 2026-10-17)

Eliminates viewer cognitive effort, phonological loop overload, and ocular strain:

| Component | Psychological Principle | Implementation |
|---|---|---|
| `SmoothStage` | Continuous Tracking & Pre-Attentive Spotlight | 0.35Hz 3D micro-float + gentle breathing so visual pixels never habituate or freeze. |
| `TactileCard` | Figure-Ground Segregation | Warm ivory `#F7F3EA` / crisp white `#FFFFFF` (1060×540) floating with `SHADOW_DEEP`. Permanently bans dark-on-dark `#161411` boxes. |
| `SkeletonBars` | Mayer's Split-Attention & Redundancy Prevention | Soft `#E2DDD2` rounded bars replace secondary paragraphs so eyes do not fight voice narration. |
| `HandInkCircle` | Posner Spatial Cueing | Hand-drawn pressure-sensitive crimson ink circle (perfect-freehand) circling focal metrics/words on cue. |
| `TactileCursor` | Interactive Intent & Causality | Spring-mass cursor with red click ripples (`#E63946`) explaining why actions happen. |

## Game-Feel "Juice" Motion Physics Kit (`ds/juice.tsx`, Lesson #87 · 2026-10-17)

Infuses @motionbykrit's signature Game-Feel / "Juice" Motion Physics into every cut:

| Primitive | Physics Principle | Visual & Mechanical Behavior |
|---|---|---|
| `useGameFeelPhysics` | Anticipation Wind-Up & Rebound Shake | 6-frame sinusoidal rattle (`rattleX, rattleY`), squash & stretch (`scaleX: 1.28, scaleY: 0.76` -> `0.88 / 1.15`), and decaying camera shake (`shakeX, shakeY`). |
| `ImpactBurst` | Radial Particle Dispersion & Shockwaves | 14 radial diamond particles + 2 expanding shockwave rings with thinning & opacity decay. |
| `VolumetricGodRays` | Epic Rotating Light Reveal | Rotating conic/linear gradient beams bursting from behind focal cards on cue. |
| `SpeedLines` | Velocity Dash Streaks | High-velocity directional streak lines running in direction of dash/cut motion. |
| `FloatingPopScore` | HUD Score Punch & Floating Drift | Spring-mass popup badge (`+3 SHARDS!`, `0.2s TRASHED!`, `4.5× PRICE HIKE!`) with `-3deg` tilt, scale-punch (`1.32 -> 1.0`), and upward drift (`translateY(-24px)`). |
| `DoodleUnderline` | Editorial Double-Marker Emphasis | Hand-drawn pressure-sensitive double-stroke underline (perfect-freehand) curving under key focal phrases. |
| `Tactile3DBlock` | Chunky Toy Depth & Impact Flash | Chunky card with 11px 3D bottom lip, press-down hit recoil, animated diagonal `SpecularSheen` sweep, and white impact flash. |


