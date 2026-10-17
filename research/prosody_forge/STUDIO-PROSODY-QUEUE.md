# Studio prosody queue — every voice_check flag, mapped to its repair lever

Built 2026-10-17 (DeepSeek V4.1 track). Source of truth: `tools/voice_check.py <topic> --warn-only`
(the same metric code qa.py enforces). 19 voiced topics swept; **56 flagged lines** out of ~380 voiced takes.
Nothing here was edited — this is the queue + the lever analysis. Per-line repair demos live in
`research/prosody_forge/*.json`.

## How to read a flag

| flag | metric (voice_check) | meaning |
|---|---|---|
| `rising end` | median f0 of last 12 voiced frames vs line median > +10% on a non-question | line ends like a question — the #1 perceptual "TTS tell" |
| `f0` | line median f0, z > 2 and > 6% off | the narrator suddenly sits high (or low) |
| `rate` | words/sec, z > 2 and > 15% off | the line is rushed or dragging vs the topic |
| `spread` | p90−p10 of f0, z > 2 and > 35% off | the line swings flat or theatrical |

## The repair lever per engine (proven 2026-10-17)

- **Kokoro topics** (`tts.py`, af_heart 0.95): lever = **punctuation of the spoken text**
  (terminal punctuation, dash→comma, `;`→`. `). Sandbox demo: `ai-ban d04` (see
  `research/prosody_forge/ai-ban.json`).
- **Chatterbox topics** (`tts_cb.py`): lever = the per-beat **`ex` exaggeration** field that the
  scripts already author line by line. Sandbox demo: `why-ai-dumber a05`, rising end +20% →
  cleared by ex 0.55→0.40 (rise −3%) and ex 0.55→0.25 (rise +6%), at the measured price of
  −11 Hz f0 and −2.3 dB level (see `research/prosody_forge/why-ai-dumber.json`).

Both demos ran in throwaway sandboxes (`videos/_forge_<slug>/`); no real topic audio was touched.

## The queue

| topic | engine | flagged | lines (reason, measured rise) |
|---|---|---|---|
| **captchas-full** (reference) | kokoro | **18** | a04 rising +13% · a05 f0, rising +35% · b00 rising +19% · c02a f0, rate · g02 rising +17% · m01a rising +22% · m02 rising +13% · c13r rising +21% · k00 rising +15% · k04b rising +10% · u01c rising +13% · u02b rising +19% · v03 rising +23% · r00b rising +10% · r03b rate, rising +22% · f01 f0 · f02b rising +12% · f03b f0 |
| ai-black-markets | kokoro | 8 | s04 rising +17% · w03 rate · k06 rising +11% · d03 rising +16% · v03 f0 · p03 rate −56% · p04 f0 · x02 f0, rate |
| captchas-3min | kokoro | 6 | a02 rate · a04 rising +13% · a05 f0, rising +35% · o04 rising +25% · b00 rising +19% · g02 rising +18% |
| ai-ban | kokoro | 5 | h01 rate · a02 rate · d04 rising +12% · k01 rising +13% · t03 rate |
| elon-musk | chatterbox | 4 | a05 rising +21% · a06 spread · a07 spread · a11 rising +16% |
| surveillance-pricing | chatterbox | 4 | a01 rising +28% · a05 rate · a09 rising +49% · a11 rising +39% |
| why-ai-dumber | chatterbox | 4 | a05 rising +20% · a09 f0, rate · a11 spread · a22 rising +33% |
| poisoned-well | chatterbox | 3 | a01 spread · a03 rate · a04 rising +17% |
| china-ai-underground | chatterbox | 2 | n02 f0 · n04 rising +28% |
| greyhat-ai | chatterbox | 2 | a01 rising +17% · a08 rising +38% |
| agent-with-your-card · ai-grey-zone · ai-power-bill · apply-button · captchas-sample · microwave-trading · new-ai-reasoning · the-ai-cast · tokens-explained | — | **0** | clean at the voice layer |

Mix: **34/56 flags are `rising end` (61%)**; rate 11; f0 11; spread 4 (lines can carry two flags).

## The calibration finding (why "rising end" should stay advisory)

The **reference film — the artifact the soul is defined by — carries 18 flags of its own, 13 of them
`rising end`** (up to +35% on a05). The owner approved that take. So a strict "fail on rising end"
gate contradicts the soul: af_heart's forward-leaning sentence endings are part of the delivery the
films were approved with. Recommendation: keep `rising end` as advisory queue input (this file),
never as a build blocker; treat `f0`/`rate`/`spread` as soft signals too. The only true failures at
the voice layer are mechanical (dropped words, clipped takes) — those are caught by
`sync_audit.py --dropped` and the tactile gate, not by contour shape.

## Queue order for a repair pass (worst-first, cheap-first)

1. `captchas-full` a05 (+35%) — hardest rise in the anchor; kokoro punctuation experiment first.
2. `surveillance-pricing` a09 (+49%), a11 (+39%) — chatterbox, two candidates each via the forge.
3. `greyhat-ai` a08 (+38%) — chatterbox.
4. `why-ai-dumber` a22 (+33%) — same one-field `ex` fix as a05; then re-render that film.
5. `ai-black-markets` p03 (rate −56%) — the slowest line in the studio; listen before touching.
