# HANDOVER · All-in · 2026-10-09 · captchas-full v3 DELIVERED · NEXT: AI black markets (own thread)
Older history: `HANDOVER_archive.md` (read only if needed). Token-lean: S is on Pro (keep a session under ~120k tokens;
grep and small scripts, never print whole transcripts or logs). Never read SCRATCH HOLY or other source projects.

## Owner's TOP RULE (2026-10-08, "Never forget this never ever")
No clip may cost revenue: only CC BY / BY-SA / CC0 / PD / government clips. No news (WSJ, Vox, Big Think), no TED, no
re-uploaded stock, no fair-use bets. A real clip every 20-40 s, the first one a real-clip hook in the opening seconds.
Every clip starts and ends on a sentence end. Written into `design-system/CLIPS.md`, `DESIGN.md`, `PLAYBOOK.md`.

## DONE 2026-10-09 02:20: captchas-full v3 delivered
Render `videos/captchas-full/out/captchas-full_v5.mp4` (full quality), sent as `All-in_captchas_full_v3.mp4` (19.7 MB,
2-pass 185k video + 48k aac) with LICENCES.md. watch.py: 0 FAIL. Whisper check: the CAPTCHA expansion is spoken at 1:06.
Waiting on the owner's notes. Optional polish still open: k04b `gateShut` → `building` + label "court".
Clean-up once the owner OKs the cut: `.cc-src/`, `.render-tmp/captchas-full_*`, `out/x264_2pass.log*`.

## captchas-full v3 (built this session)
- 19 clips, all CC: Wikimania 2015 von Ahn (CC BY-SA 3.0), Google "Introducing reCAPTCHA v3" (CC BY 3.0), CCC talks
  (CC BY 4.0): Schmieg 34C3, "Inside the Fake Like Factories" 36C3, Solovjovs 35C3 Chaos West. Longest narration gap 42 s.
- Owner notes fixed: CAPTCHA expansion read aloud (o04); the weak 6:22 cat-food clip is now the 36C3 click-worker clip
  (g14, "she earns between two cents and six cents per like"); no fragment pauses (m03b rewritten, tts.py squeezes pauses).
- News clip files moved to `.removed-news-clips/` (not in the render folder). `LICENCES.md` = per-clip licence + risk
  table (all Low; most residual = the 4 Google v3 clips). Narration restored where no CC clip exists (c02r, c13r, v01, f01b).
- Out: `videos/captchas-full/out/` (see the newest `captchas-full_v*.mp4`; sent as `All-in_captchas_full_v3.mp4`).
- Clean-up still open: `.cc-src/` (~480 MB of source talks; keep until the owner OKs the cut, then delete),
  `.render-tmp/captchas-full_*` chunks once the owner OKs it. Lessons: LEARNINGS 45-47, CLIPS.md "media.ccc.de".

## NEXT: new topic (owner, 2026-10-08), in its own thread
"the DARK REALITY of grey areas of AI and its practices in the black markets!"
Owner: "dont make it too hard for the newbies watching. Do a fantastic job."
1. Read `PLAYBOOK.md` (pipeline + QA gates), then `design-system/DESIGN.md`, `CLIPS.md`. Open `LEARNINGS.md` only by item.
2. Slug suggestion: `ai-black-markets`. Copy `videos/captchas-full/gen_script.py` for the helpers; new visuals go in
   `engine/src/visuals/<topic>.tsx` built from `engine/src/ds/` (39 line drawings in `kit.tsx` `IconName`).
3. Research + clips together. Candidate open sources (verify each licence before use):
   - media.ccc.de talks (CC BY 4.0, licence in mp4 tags): search the API for deepfake, voice cloning, scam, fraud,
     darknet market, stolen accounts, AI phishing, jailbreak, model theft, data labeling. Transcribe the opus with
     `tools/transcribe_src.py`, then mind the opus→mp4 offset (CLIPS.md) before `tools/cc_clips.py`.
   - Wikimedia Commons video (search recipe in CLIPS.md); US government video is public domain (FBI, FTC, CISA, DoJ,
     Europol is not PD: check). FTC/FBI PSAs on voice-clone and deepfake scams are good real-clip hooks.
   - No news clips, no TED, no YouTube clips without an explicit CC BY mark.
4. Newbie-friendly: one idea per act, plain words, every term (LLM, deepfake, dark web, crypto mixer) explained the first
   time with a picture. Likely acts (draft, research decides): the hook (a cloned voice call) · what "grey area" means ·
   stolen data and accounts for sale · jailbroken chatbots for crime (WormGPT-style tools) · deepfake and voice-clone
   scams · fake reviews/likes and click farms (36C3 clip already cut: `engine/public/captchas/cc_f36_maria.mp4`) ·
   who profits · how to protect yourself. Every fact gets a SOURCES.md row the same turn.
5. Gates before the owner sees anything: lints in `build.py` (text, cues, clips), clip gaps ≤ ~40 s, stills sheet per act,
   LICENCES.md with a risk column, compress < 20 MB for the thread.

## Commands
Always `PYTHONIOENCODING=utf-8`, `HF_HUB_OFFLINE=1` for Whisper. Patch with python scripts, not bash heredoc edits of
quotes. Renders in `.render-tmp/` (~6-8 min per 1,500-frame chunk at --concurrency=3; a full 11-min film ≈ 1.5 h).
A stale `transcribe_src.py` python process from 2026-10-08 23:30 may still be running; stop it if it is.
