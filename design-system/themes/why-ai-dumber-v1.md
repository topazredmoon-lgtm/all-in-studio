# Theme — "why AI models get dumber" (slug `why-ai-dumber`)

> **Superseded by v2 (2026-10-13).** v1 (below) was reviewed by the owner: "the animations were great, but it needs
> NEW designs, much more visual diversity and SMART visual ideas (clever metaphors and devices that explain the
> mechanism, not the same icon grammar repeated)" — plus the voice needed to be clearly better, acronyms read aloud,
> and a real clip tried. What changed, in full: `design-system/VISUALS.md` → "why-ai-dumber v2"; the 3 new kit
> primitives (`Loop`, `Copier`, `FieldCard`) → `design-system/DESIGN.md` "The kit"; the new `spiral` line-art →
> `ds/kit.tsx` `IconName`; the voice switch (Kokoro af_heart → Chatterbox) → `videos/why-ai-dumber/gen_script.py`
> header and `LEARNINGS.md`. This file is kept for v1's own record below.

A topic theme on top of the shared system (`../DESIGN.md`). Nothing here overrides a hard rule; it only names which
parts of the kit this topic leans on and why, so the next session doesn't re-derive it.

## What's inherited, unchanged
Warm-black v23 board, dot grid, corner marks, vignette. Left/right split by default. Hand caption at the bottom,
≤ 6 words, 1–2 red keywords. No lone big text, no music, one accent colour (red). Same narrator: Kokoro `af_heart`,
speed 1.0, pace `{lead .2, gap .45, min_beat 2.4, to_clip .25, after_clip .45, end_pad 1.5}` (matches the live `ai-ban`
topic, so a cut between videos never sounds different).

## What this topic adds
The subject is a process (AI output feeding back into AI training), not a person or a document, so the kit's
object-based grammar (one drawing, one word) needed one small extension rather than a new topic skin:
- **`IconRow decay: true`** (promoted into `ds/kit.tsx` this session, not a one-off): a row of the same icon fades
  toward ~35% opacity left to right. Used for "the same model, run again and again" — shows quality dropping
  without inventing a fake chart. General-purpose: any future topic with a repeated-process decay (battery life,
  signal strength, trust eroding) can reuse it.
- **`Flow` (existing)** carries the core mechanism in one picture: AI writes → it goes online → the next model
  trains on exactly that. Three nodes, not four — the fourth (degraded output) is shown separately as the payoff
  beat, so the mechanism and its consequence don't compete for the same 2–3 s window.
- **`Bars` (existing)** shows the Nature finding's shape (four generations, each shorter) as an **illustration**,
  labelled as such in its plate — not the paper's literal chart, since the paper's own figures weren't reproduced.
  Owner's "our own arithmetic says 'our arithmetic'" rule, extended: an illustration says "illustration."
- Icons used: `robot` (the model), `cloud` (the open internet), `doc` (training data), `brain` (collapse), `laptop`
  / `person` (the viewer's own tools — the stakes beat). All already in `IconName`; no new drawing added.

## Why no real clip in this first pass
The money rule (CC BY/BY-SA/CC0/PD/gov only, on-topic for the exact line) ruled out everything already cached in
`.cc-src/` for this topic: the only "dumber" soundbite found (`llm-hack.opus`, a hacker-conference talk) is a
throwaway joke about a smart-home speaker, not about model collapse — using it would mislabel the picture. Rather
than force an off-topic or borderline clip into a design-system demo, this sample is picture-led only. Flagged to
the owner; sourcing a real CC-licensed clip (a conference talk or interview that actually discusses model collapse,
synthetic-data poisoning or AI-generated web content) is the next step before any full video on this topic.
(v2, 2026-10-13: checked again — media.ccc.de and YouTube, nothing both on-topic and verifiably CC/PD. Still open.)

## Facts used (full row: `../../videos/why-ai-dumber/SOURCES.md`)
Shumailov, I. et al., "AI models collapse when trained on recursively generated data," *Nature* 631, 755–759 (24 Jul
2024), doi:10.1038/s41586-024-07566-y — the only load-bearing fact in the sample; everything else is framing or an
explicitly-labelled illustration.
