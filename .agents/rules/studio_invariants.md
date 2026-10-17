---
description: Core studio invariants, directorial taste, and topic isolation rules for All-in video production
globs: "**/*"
---

# All-in Studio Invariants & Directorial Rules

## 1. Topic Isolation (Anti-Pollution Invariant)
- **Topics are strictly isolated**: Every new video topic must be developed in its own `videos/<slug>/` folder, scaffolded exclusively from `videos/_template`.
- **Never cross-import past topic code**: A new topic visual or script must NEVER import or depend on visuals or scripts from peer topic folders (e.g. do not import from `visuals/aibm.tsx` into a new topic).
- **Source inspiration from the shared substrate only**: New topics draw their rules, pacing, taste, prompts, and art direction exclusively from `design-system/STYLE_BIBLE.md`, `design-system/DESIGN.md`, and shared primitives in `engine/src/ds/`.

## 2. The Money Rule (Zero Revenue Risk)
- **Never use commercial news clips**: WSJ, Vox, Big Think, CNN, DW, MSNBC, etc. are strictly banned. A Content ID claim forfeits the video's ad revenue.
- **Never use TED/TEDx talks**: Licensed under CC BY-NC-ND (non-commercial only; prohibits ad-supported YouTube channels).
- **Never use re-uploaded stock**: Pexels/Pixabay clips frequently trigger false claims by bad-faith claimants.
- **Only openly licensed or US Gov footage**: CC BY, CC BY-SA, CC0, or US Federal Government public domain (e.g. Senate committee webcasts from senate.gov).
- Every clip must be logged in `videos/<slug>/LICENCES.md` and `SOURCES.md` before being used in a cut.

## 3. Directorial Taste & Dramatic Pacing
- **The "So What?" Test**: Every single line must touch the viewer's own stakes (their money, their tools, their freedoms). If the honest answer to "why do I care?" is "I wouldn't", the line is cut.
- **Cold Open Shock**: Never open with calm setup, generic definitions, or old politicians at a dais. Open with a fresh (2025-2026) concrete shock, twist, or open question within the first 15 seconds.
- **Real Clips with Voice**: Insert a real clip with its own voice every 20–40 seconds. The first real clip is the hook in the opening seconds. Edit clips with room to breathe (pre-roll ≤0.45s, post-roll ≤0.7s), never word-tight chops or freeze frames.
- **Critical Viewer Rigor**: Label facts as facts, fears as fears. Use on-screen stamps (`REAL` / `NOT YET`). Admit the strongest counter-fact.

## 4. Visual Craft (No Lone Text & Plates over Slop)
- **No Lone Big Text**: Never center a number, word, "?", or title card on an empty board. A number is a small red `tag` under its picture. The picture leads; text only supports.
- **Banned: Amateur SVG Doodling**: Never generate primitive `<rect>` and `<circle>` shapes with label tags (like toy robots labeled "BIG MACHINE"). Visuals must belong strictly to one of two high-craft registers:
  1. *Woodcut Engraving Plates* (`engine/src/ds/engrave.tsx`, `PLATES.md`): 3 line weights, directional hatching/stippling, and parametric motion (`ouroboros.tsx`).
  2. *Editorial Evidence & Motion Graphics* (HyperFrames/GSAP style): Re-set primary documents with animated highlighter sweeps, real data charts with spring easing, syntax-highlighted code terminals, and framed archival dossiers.
- **Rhythm**: Something new enters or animates on screen every 2–3 seconds. Left/right split is the default layout.

## 5. Voice & Acoustic Engineering
- **DeepMind Kore Female Voice** (`tools/tts_cb.py` with `assets/voice/ref_female_kore.wav`): **The premier studio voice for videos.** Ultra-natural, human, expressive timbre with per-beat dramatic variance (`ex` 0.5–0.75) and written breath pauses (` | ` and ` || `). Always default to this voice for new topics.
- **Chatterbox Male** (`assets/voice/narrator_ref.wav`): Investigative, deep male voice (Fenrir timbre).
- **Kokoro** (`tools/tts.py`, System Python 3.14): Clean, neutral explainer voice (`af_heart`, speed 1.0).
- **No music beds**: Pure, clean narration without drones, whooshes, or background score. Procedural SFX only on visible clicks or stamps.
- Read acronyms in full on screen as spoken. Check pitch/level outliers with `tools/voice_check.py`.

## 6. Quota Guardrails (Token Discipline)
- Maximum **2 concurrent subagents**.
- Subagents must report in ≤200 words without image dumps.
- Keep main sessions under ~120k tokens. Write `HANDOVER.md` and stop before hitting limits.
- Never resume a session past ~150k tokens; start fresh from `HANDOVER.md`.
