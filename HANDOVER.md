# HANDOVER · All-in · 2026-10-14 · Active Production Studio State

> [!IMPORTANT]
> **HOME IS THE PC:** `C:\Users\pc\Documents\All-in-keep\` (Repo: `All-in\`, branch `claude/local-home`).
> Start sessions with `. C:\Users\pc\Documents\All-in-keep\env.ps1` or use `.\allin.ps1 <cmd> <topic>`.
> Keep active context under ~120k tokens. Historical branch & session logs live in `HANDOVER_archive.md`.

## Active Topic Matrix (2026-10-14)
| Topic | Status | Runtime | Voice Engine | Next Immediate Step |
|---|---|---|---|---|
| **the-ai-cast** | **PRODUCED & SHIPPED (7/7 QA PASS)** | 1:43 (7 beats, 14 cuts) | Kokoro (`af_heart` 0.95) | Master MP4 `videos/the-ai-cast/out/the-ai-cast_v3.mp4`. 79% full/scene, 21% split (max 1 split in a row). 100% WHO & WHAT CC/PD photos (Wikimedia Commons) + authentic UI widgets. 7/7 QA Pass. |
| **tokens-explained** | **1-MIN PROBE + FULL SCRIPT READY** | 1:10 / 8:00 | Kokoro (`af_heart` 0.95) | Rewritten in 100% ELI5 natural sentences (0 nominal fragments). Run `.\allin.ps1 tts tokens-explained` → `build` → `render`. |
| **apply-button** | **1-MIN PROBE + FULL SCRIPT READY** | 1:05 / 8:20 | Kokoro (`af_heart` 0.95) | *"the dark reality of the apply button"* (ATS sieve, NYC Law 144, EU AI Act). Ready to voice & render. |
| **ai-power-bill** | **2-MIN SAMPLE DELIVERED** | 2:14 (8 beats, 15 shots) | Chatterbox (`kore`) | Waiting on owner review of `All-in_ai-power-bill_sample_2min.mp4` (6/6 QA pass). Expand to 8+ min full film with 2–3 CC/PD clips after OK. |
| **greyhat-ai** | **1-MIN SAMPLE DELIVERED** | 1:28 (7 beats, 17 cuts) | Chatterbox (`captchas`) | Waiting on owner review of `All-in_greyhat-ai_sample_1min.mp4` (6/6 QA pass). Clear 2–3 CC/PD clips in `LICENCES.md` before full film. |
| **elon-musk** | **CINEMA SAMPLE DELIVERED** | 2:48 (35 cuts, 0 clips) | Chatterbox (`tts_cb.py`) | Waiting on owner review of `videos/elon-musk/out/elon-musk_v2.mp4` (100% Left/Right split, 7 bespoke visuals). |
| **ai-ban** | **FULL FILM DELIVERED** | 12:54 (75 beats, 18 clips) | Kokoro (`tts.py`) | Waiting on owner review of `All-in_ai_ban_full.mp4`. Optional polish: replace clip `cR2` (German army drones) with US PD clip. |
| **why-ai-dumber** | **v2/v3 SAMPLE BUILT** | 2:00 | Chatterbox (`tts_cb.py`) | Waiting on owner review of v2/v3 sample featuring woodcut engraving plates (`PLATES.md` / `ouroboros.tsx`). |
| **china-ai-underground** | **SAMPLE DELIVERED** | 1:18 (8 beats, 2 clips) | Chatterbox (`fenrir`) | Ready to expand into 8-min full film (Exhibit A/B, Supermicro hair-dryer, Anthropic distillation; Senate PD clips cached in `.cc-src/cnai/`). |
| **ai-grey-zone** | **SCRIPT DRAFTED** | ~9–10 min (1,300 words) | Not voiced yet | Script in `videos/ai-grey-zone/SCRIPT.md` + `SOURCES.md`. Cut/clear CC clips before building sample. |
| **captchas-full / 3min** | **BENCHMARK COMPLETE** | 11:03 / 2:36 | Kokoro (`tts.py`) | Reference benchmarks (`All-in_captchas_full_v3.mp4` & `All-in_captchas_3min_v6.mp4`). |
| **ai-black-markets** | **DEAD / RETIRED** | — | — | Killed by owner 2026-10-11. **Never build, polish, or send.** |

## Latest Studio Upgrades & Invariants (2026-10-15)
- **Autonomous Studio Command Center & Background Daemon**:
  - Rebuilt the entire studio dashboard from scratch into a reactive Studio OS (`All-in/dashboard/` and desktop bundle at `C:\Users\pc\Desktop\All-in Dashboard\index.html`).
  - Integrated with local HTTP / REST server (`tools/dashboard_server.py`) on port 4321 with HTTP 206 Range video streaming (eliminating file:// security restrictions and video seeking locks).
  - Background autonomous engine (`tools/autonomous_studio.py`): deep-scans all 24 topics, audits layout cadence (% full/scene vs % split), maintains rich 5-gate dossiers with real 2025-2026 court dockets, Sourced Numbers, and WHO/WHAT visual blueprints, and runs an autonomous background daemon.
  - Root CLI bridge commands: `.\allin.ps1 dashboard` (launches live server and browser), `.\allin.ps1 daemon` (runs background loop), `.\allin.ps1 auto-research` (runs deep research cycle).
  - Desktop 1-click launchers: `Start-Dashboard.bat` and `Start-Autonomous-Daemon.bat` in `C:\Users\pc\Desktop\All-in Dashboard\`.
- **Voice Engine**: Standard is **Kokoro ONNX (`af_heart` at 0.95 speed, master "v23")** via `tools/tts.py`. Whisper word-level sync on CUDA float16. Level normalized to -20.0 dBFS RMS (-14 LUFS).
- **End of Permanent Bi-Screen**: Layout cadence requires **>= 55% full/scene/clip**, **<= 45% split**, and **max consecutive splits <= 2**. Enforced by `lint_text.py` and visual cadence auditor in the new dashboard.
- **Show WHO & WHAT with Real Photos & UI Receipts**: When naming real people, cases, courts, or dates, download CC/PD photos from Wikimedia Commons to `engine/public/<slug>/` (Film, Print, Polaroid, AnnotatedPrint) and show authentic UI widgets (PhoneChat, PhoneCall, CallGrid, PageQuote, Score, Blocked). `LineIcon` is capped at <= 25% across film.
- **Total Ban on Evidence Boxes & Woodcuts**: `ds/evidence.tsx` boxes (`DossierDoc`, `FieldCard`, etc.) and `ds/engrave.tsx` woodcut plates are permanently banned. Standard is 100% `captchas_full_v2` (bare v23 background `#0E0C0B` + `ds/kit.tsx`).
- **7-Gate Quality Assurance (`tools/qa.py <slug>`)**:
  - Runs `lint_text`, `lint_cues`, `lint_clips`, `voice_check`, `render_sync`, `watch.py`, and `listen.py`. All 7 gates must pass 100%.

## Core Studio Rules (Quick Reference)
1. **Zero Revenue Risk (The Money Rule)**: Only CC BY, CC BY-SA, CC0, or US Federal Government Public Domain clips/photos. Log every asset in `LICENCES.md` and `SOURCES.md`.
2. **Visual Grammar**: Full/scene >= 55%, split <= 45% (max 2 consecutive). Show WHO & WHAT with real CC/PD photos and authentic UI receipts. Zero stray icon slop. LineIcon <= 25%.
3. **Audio Quality**: Kokoro `af_heart` 0.95, Whisper CUDA float16, -14 LUFS / -20 dBFS RMS, natural sentence boundaries with ambient room sound breathing. No background music.
