# HANDOVER · All-in · 2026-10-08 evening · captchas-full v3 IN PROGRESS · then new topic
Older history: `HANDOVER_archive.md` (read only if needed). Token-lean: S is on Pro. Never read SCRATCH HOLY.

## Owner's TOP RULE (2026-10-08, "Never forget this never ever")
No clip may cost revenue: only CC BY / BY-SA / CC0 / PD / gov clips. No news (WSJ, Vox, Big Think), no TED, no re-uploaded
stock. Keep a clip every 20-40 s and a real-clip hook. Written into `design-system/CLIPS.md`, `DESIGN.md`, `PLAYBOOK.md`.

## Done this session (captchas-full)
- Risk table per clip answered in thread + `videos/captchas-full/LICENCES.md` (now moot: news clips are being removed).
- o04 reads CAPTCHA's full name aloud; expansion words appear as spoken (`TwoWords expandEndAt`). m03b rewritten.
- `tools/tts.py`: squeezes inner pauses (comma 0.30 / stop 0.50 / none 0.18 s), Whisper small.en. All lines re-voiced.
- All 19 clip in/out points moved to sentence ends; `tools/clip_words.py` + `tools/lint_clips.py` (runs in build.py).
- c02a min 1.8 (1 s dead air). Build passes all lints; NOT rendered (stopped when the clip rule changed).
- Lessons: LEARNINGS 41-44, DESIGN "Voice", CLIPS "Cutting clips". Memory: `zero-revenue-risk-clips.md`.

## Downloads (in `All-in/.cc-src/`, licences verified; delete unused ones when the cut is final)
- Wikimania 2015 von Ahn talk (Commons, CC BY-SA 3.0, original webm) + `.segments.txt` transcript.
- Google "Introducing reCAPTCHA v3" (Commons, CC BY 3.0) + transcript.
- CCC talks, CC BY 4.0 (licence in mp4 metadata): 34c3-9077 Schmieg "Humans as software extensions" (opus + transcript),
  36c3-10936 "Inside the Fake Like Factories" (opus), 32c3-7324 "Value of anonymous communication" (mp4 sd + opus),
  35c3-chaoswest-32 "Toll of personal privacy in 2018" (opus). Transcribe the last three:
  `python tools/transcribe_src.py .cc-src/<file>` (HF_HUB_OFFLINE=1). Video for a CCC cut: h264-hd URLs in `.cc-src/ccc.txt`
  (ffmpeg -ss <t> -i <url> -t <d>, only the needed seconds).

## Clip plan (times = source seconds from the transcripts; refine with word timings)
| Slot | Replace with | Source time | Script change |
|---|---|---|---|
| c01 hook | WM "How many of you found it really, really annoying? ... I invented that. Sorry." | ~18.4-29.5 | a02 → "He's right to apologize. We've all stared at that corner." |
| w01 (old annoying) | WM Ticketmaster scalpers example | 52.8-63.5 | move slot to after o03 |
| w02 | keep (feelbad) | | |
| c04 | WM "This is 1.1 billion ... about 15% of the world's population." | ~344-356.1 | |
| c02a + c02 (NYT) | no CC clip: restore narrated `c02r` (in NEW, now in DROPPED) | | |
| c03 | WM "It has been very successful. Today ... 2 million books a year ... typing captchas" | ~260-272.5 | |
| w04 | keep (Duolingo free) | | |
| c05 | WM "See, during those 10 seconds ... something that computers cannot yet do." | ~104-114.8 | |
| c13 | Schmieg "captures started as a technique to merely prevent spam ... house numbers and transcribing books." | 949.1-963.8 | restore narrated `c13r` |
| c07 | Schmieg "And then, lately, it's become a means of teaching image recognition to AI software." | 965.1-970.9 | |
| c08 | WM "if we repeat this process to like 10 different people, and they all agree ..." | 250.6-257.8 | m07 opens "Same trick as the books." |
| new, act 05 after k02b | Schmieg: "she claimed that Google operates a highly profitable transcription business built upon free labor ..." | 983.9-995.8 | line before: "In 2015, Gabriella Rojas-Lozano sued Google."; after: judge rejected it (998-1008.9) |
| g14 (cat food, too short) | 36c3 click-farm workers (find in transcript); else v3 cat-food story 88.8-101.8 | | |
| c09 (2014 checkbox) | v3 "The reCAPTCHA I'm not a robot checkbox changed ..." 9.8-17.9, or 35c3cw privacy talk | | |
| c10 (losing battle) / c11 (computers match humans) | search 32c3 / 35c3cw / 36c3 transcripts; else narrate | | |
Facts quoted by new clips need SOURCES.md rows (Rojas-Lozano v. Google 2015, N.D. Cal.).

## Next steps (captchas)
1. Transcribe the 3 remaining CCC files; fill the open slots in the table.
2. Add WM/v3/CCC cuts to `tools/cc_clips.py` (add a CCC source dict; local file folder = `.cc-src`), run it, then
   `tools/clip_words.py captchas`; edit `CLIPS`/`ACTS`/`DROPPED`/`NEW` in `videos/captchas-full/gen_script.py`.
3. Delete the news clip files from `engine/public/captchas/` (clip2_*) so they cannot come back; update LICENCES.md
   (clip table + attribution block: add Sebastian Schmieg / CCC CC BY 4.0 etc.; remove the news rows).
4. `python videos/captchas-full/gen_script.py` → `tools/tts.py captchas-full` → `tools/build.py captchas-full` (3 lints 0 FAIL)
   → check clip gaps ≤ 45 s → `node tools/render.mjs captchas-full --concurrency=3` (~30 min) → sample sheet →
   compress < 20 MB → send as `All-in_captchas_full_v3.mp4`. In the delivery, name any clip that still carries risk.
5. Then the new topic in its own thread: "the DARK REALITY of grey areas of AI and its practices in the black markets!"
   (owner: "dont make it too hard for the newbies watching. Do a fantastic job."). Start from `PLAYBOOK.md`; clips CC only.

## Commands
Always `PYTHONIOENCODING=utf-8`. Patch with python scripts, not bash heredoc edits of quotes. Renders in `.render-tmp/`
(stale `captchas-full_0bdf6a845ed74de0` partial: delete). Disk C: ~38 GB free.

---

# HANDOVER · All-in · 2026-10-08 late · captchas-full v3 (owner notes on v2 fixed) · NEXT: new topic, start cold

## NEXT SESSION: new topic (owner, 2026-10-08): "the DARK REALITY of grey areas of AI and its practices in the black markets!"
- Owner's words: "dont make it too hard for the newbies watching. Do a fantastic job." Runs in its own new thread.
- Start from `PLAYBOOK.md` (whole pipeline + gates), then `design-system/DESIGN.md`, `CLIPS.md`, `LEARNINGS.md` 41-44.
  Copy `videos/captchas-full/gen_script.py` as the template; never read SCRATCH HOLY or the source projects.
- Format the owner approved: ~8-10 min, v23 board + minimal kit, left/right split, many real clips (one every 20-40 s,
  hook clip first, prefer CC; news ≤ 10 s, medium risk; never TED), no music, narrator Kokoro af_heart 0.95.
- New gates from this round: `tools/clip_words.py <topic>` after cutting clips, `lint_clips.py` runs in build
  (sentence-end in/out points); `tools/tts.py` caps pauses; every on-screen acronym is read aloud (`expandEndAt`).
- Downloads: ask the owner before downloading files (state name, source, size); 6:22 clip replacement is waiting on that.

## captchas-full v3 (2026-10-08 late): owner notes on v2
- Notes: risk per clip; read CAPTCHA initials aloud; clips cut off mid-speech ("pretty much all of them"); 6:22 clip too
  short; "Next up, pictures, funny thing," pause. Lessons: LEARNINGS 41-44; rules in DESIGN "Voice" + "Clips", CLIPS.md.
- Risk table (claim / strike / video demonetized, per clip) in `videos/captchas-full/LICENCES.md`; answered in thread.
- Clips: all 19 in/out points moved to sentence ends (`CLIPS` in gen_script, optional 5th field = fadeOut). Cause: out-points
  sat on the last syllable under a 0.12 s fade; c09 ended mid-sentence, g14 mid-word, c07 started mid-word.
- Voice: o04 now says the full CAPTCHA expansion (words appear as spoken); m03b rewritten; `tts.py` squeezes inner
  silences (meta `sq`), Whisper small.en (base.en dropped line-final words); c02a min 1.8 (was 1 s of dead air).
- 6:22 (g14, Google cat-food line, 4 s): out-point fixed but still short. Asked S to OK downloading Google's CC BY
  "Introducing reCAPTCHA v3" (Commons, 5.9 MB) to cut a longer piece. If yes: download, add to `tools/cc_clips.py`,
  `clip_words.py`, swap g14, rebuild, re-render (chunks before 6:19 are reusable).
- Render: `out/captchas-full_v5.mp4` (9:43); send copy `out/All-in_captchas_full_v3.mp4`.

## (previous header) HANDOVER · All-in · 2026-10-08 · captchas-full v2 (clips back) delivered · START HERE (new topic: read PLAYBOOK.md)

## captchas-full v2 (2026-10-08 night): clips back + S's four notes
- Owner notes on v1: clips back (many, hook first, a break every 20-40 s); "a billion … people" pause; show what CAPTCHA
  stands for; cut the Christians/embassy story; the hydrant "sliver" tile showed no sliver. All five done (LEARNINGS 35-40).
- 19 clips, 9:42: 10 WSJ/Vox/Big Think excerpts (medium risk, claims possible) + 8 CC clips (von Ahn at Wikimania 2015,
  CC BY-SA; Google "Introducing reCAPTCHA v3", CC BY) cut by `tools/cc_clips.py` (log `engine/public/captchas/_clips.json`).
  TED dropped (high risk). Per-clip table: `videos/captchas-full/LICENCES.md`. Rules: `design-system/CLIPS.md`.
- gen_script: `CLIPS` dict + `DROPPED` (narrated stand-ins now said by clips) + `MINS` (held beats). `TwoWords expand`
  draws an acronym's expansion. Hydrant crop moved (HYB y 620, x 64): tile 3 = cap-rim sliver, tile 14 = the foot.
- Render: `out/captchas-full_v4.mp4`; send copy `out/All-in_captchas_full_v2.mp4`.
- Disk: deleted superseded renders captchas-3min v1/v2/v3/v5 (sends of v3/v5 kept) and the old captchas-full chunk cache.
- Memory: wrote `many-real-clips.md` in the auto-memory folder; adding its line to MEMORY.md was blocked, so the index
  still needs that one line (S or a later session with permission).

## captchas-full (2026-10-08, the 8-min film; quality bar = 3-min v6) · superseded by v2
- Sent: `videos/captchas-full/out/All-in_captchas_full_v1.mp4` (8:08, 1080p, 18.4 MB, crf 30) = render `captchas-full_v3.mp4` (full quality, 312 MB). Render numbers ≠ owner numbers.
- Folder: `gen_script.py` (81 beats, 1,258 words, 9 acts, ~145 cuts), `SOURCES.md` (new lines), `LICENCES.md` (swaps + description attribution block). No clips, no music; lint_text, lint_cues and watch.py all 0 FAIL.
- New code: 25 line drawings, `IconRow` marks/morph(`morphAt`), `Flow` (ds/kit.tsx); `visuals/captchas2.tsx` (MousePath, Score, HouseNumber, PhotoType, Labels, Outline, Blocked, PageQuote); `TwoWords redact`; `tools/lint_cues.py` (cue spoken, cut order/length, empty board, late panels; `reveal=True` exempts a reveal); crop bounds in `lint_text.py`; `tools/sheet.py` (per-act stills sheets). Photos fetched from Commons with licences (`engine/public/captchas/_commons.json`).
- Lessons: LEARNINGS 27–34, DESIGN "Monetization-safe by default" + "Long films", VISUALS captchas-full table, `PLAYBOOK.md` (new-topic pipeline, gates, bar).
- Fixing after notes: edit `gen_script.py`, rebuild, then reuse unchanged render chunks: copy `c00N_*.mp4` from `.render-tmp/captchas-full_<oldhash>` into the new hash dir for chunks whose beats did not change (timing is unchanged if no line changed), then `node tools/render.mjs captchas-full`. Cache kept: `.render-tmp/captchas-full_d01cd193604256ff`. Disk C: has ~1.8 GB free.
- Before publishing: re-check the Google reCAPTCHA terms quote (v03b) and the 2013 CNN/BuzzFeed source (secondary).

## Sources (where each one really is)
- **disgn systems**: no folder on this PC (it ran in the cloud). Only its published artifact is reachable: "Design System Reels" https://claude.ai/artifact/KtY7VLmHddAf5qHgr95RAK (copies in `research/disgn-systems/`). Its FEATURED design is **"minimal"** (v23's own look: warm black, dot grid, corner brackets, tiny mono act kicker "01 THE LITTLE BOX", mono cards, thin line-art drawings, polaroid with handwritten red arrow notes, handwritten captions). "Signal" (neon glows, yellow blocks, Archivo) was only its earlier take: **do not use Signal**. Asked the owner to have that project publish its rules/components/files if it has more; fold them in when they arrive.
- **joli takeover** = `C:\Users\pc\Documents\antigravity\jolly-bell`, branch `takeover` (v23 engine, theme `src/theme.ts`, caption `src/primitives/Caption.tsx`, `docs/DECISIONS.md`).
- **v23 reference** = `C:\Users\pc\Desktop\captchas_v23_PERFECTED.mp4` (sheets in `research/v23/`); its script: `C:\Users\pc\Desktop\captchas_v22_PERFECTED_SCRIPT.txt`, `jolly-bell/screenplays/captchas_v21.md`.
- **not-so-dark-times** = `C:\Users\pc\Documents\not-so-dark-times` (script the owner likes: `videos/captchas-p2` = the 3-min; `videos/captchas-full/gen_script.py` = 8:29 version; clips in `engine/public/captchas/`).
- **HOLLYSCRATCH** = `SCRATCH HOLY` (top-level notes only).

## Owner notes (2026-10-07)
1. **The look is v23 itself** (`Desktop/captchas_v23_PERFECTED.mp4`), copied from its jolly-bell source, NOT the disgn-systems reels (Signal and "minimal" both rejected; v3 used "minimal" and was rejected).
2. No music. 3. Little text on screen, each text held long enough to read. 4. Keep the left/right split.
5. The design system learns: `design-system/LEARNINGS.md` → rules promoted to `DESIGN.md`.
6. Later, the 8-min film: best script beats of v23 + not-so-dark-times `captchas-full`.
7. (evening, on v4) **Engaging like v23**: its pacing and hooks; far fewer words (the narrator carries it); a correct traffic-light captcha; every left visual on topic; and **use and upgrade the design system artifact** https://claude.ai/artifact/KtY7VLmHddAf5qHgr95RAK (its "minimal" design is now the kit on the v23 board, so note 1's "minimal rejected" is superseded). Work autonomously, self-review, no questions.
8. (late, on v5) **Never big text on an empty screen** (no lone "?", no centred "63 years"). Every shot is led by a picture; numbers are small tags under it. Enforced by `tools/lint_text.py` in `build.py`; rule in DESIGN.md.

## Exact state (2026-10-07 late, owner-facing v6)
- v6 = v5 with every text-led shot rebuilt around a picture (10 shots: lone "?", "63 years", counters, "CAPTCHA", CNN/BuzzFeed names, the "01" chapter card). Numbers are small red handwritten `tag`s under their picture (`ds/layouts.tsx`). `tools/lint_text.py` runs first in `build.py` and fails on any text-led shot: 0 FAIL. 41 shots, 2:37.
- v5 (sent earlier) = the engaging rebuild: shots cut on cue words (`engine/src/Video.tsx` `cuts`), v23 pacing (lead 0.2 / gap 0.45), cold open on the real 4 × 4 traffic-light challenge (`Captcha4`, traffic_1.jpg crop 140/100/800), "that corner" = square 10 (`Square`), the design-system artifact's "minimal" design merged on the v23 board as `engine/src/ds/kit.tsx`. Lessons: `design-system/LEARNINGS.md` items 19–26; rules: DESIGN.md "Hard rule", "Rhythm", "Density", "The kit".
- Output: render `videos/captchas-3min/out/captchas-3min_v8.mp4` → sent as `out/All-in_captchas_3min_v6.mp4` (13 MB, crf 26, attached in the thread; render numbers ≠ owner numbers, v5 = render v7). Keep sends under 20 MB so they attach to the project.
- Review files: `qa/cuts_all.jpg` (one still per shot), `qa/vs23/compare.jpg`, `tools/watch.py` (empty-frame check).
- Disk C: is nearly full (~1 GB free). Delete `.render-tmp/captchas-3min_*` chunk caches once a version is sent.

## Next steps
1. Wait for the owner's notes on v6.
2. Pre-publish blockers (unchanged): licences for traffic_1 and the other grid photos, `luis_talk.jpg` file/licence, primary sources for the CMU spin-off and the 2013 CNN/BuzzFeed deals.
3. Later, the 8-min film: best beats of v23 + not-so-dark-times `captchas-full`, built with the same cuts/kit.

## Commands / gotchas
`python videos/captchas-3min/gen_script.py` → `python tools/tts.py captchas-3min` (new lines only) → `python tools/build.py captchas-3min` → `node tools/cutstills.mjs captchas-3min 0.8 [beats] [--sheet name]` (one still per shot) / `node tools/frame.mjs captchas-3min <s,s>` → `node tools/render.mjs captchas-3min --concurrency=3`. Always `PYTHONIOENCODING=utf-8`. Write patch scripts with the Write tool (bash heredocs mangle backslashes). Renders use `.render-tmp/` (something wipes `%TEMP%\remotion-*`). Out: `videos/captchas-3min/out/` (v1 jolly-bell look, v2 Signal: both superseded).

Stray: `SCRATCH HOLY/videos/captcha-sample/` and `SCRATCH HOLY/jb-media/` were made by an earlier session (2026-10-07 08:31), before All-in existed; the owner asked why work was there. All-in is the only working folder. Offered to move them; awaiting the owner.
