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


## Archived Iterations (2026-10-11 AI-Ban Samples & Black Markets Rejection)

## EARLIER (2026-10-11 late night): owner rejected the AI black markets full film; live topic = ai-ban
A parallel session (branch `claude/serene-wozniak-ob8jdw`) finished and sent the AI black markets full film. Owner:
"je parlais de loriginal script celui que j'ai copié collé dans un chat. par cette vielle video de merde" (LEARNINGS 71).
AI black markets is DEAD: never build, send or polish it again. "The original script" = `videos/ai-ban/owner_script.txt`.
- This branch (`claude/bold-bell-plohvn`) now carries all the ai-ban work (fast-forwarded to `claude/vigilant-hawking-wj9frh`).
- Re-sent `videos/ai-ban/out/All-in_ai_ban_sample_1min_v4.mp4` (built from the owner's opening lines).
- NEXT: when the owner OKs the sample (or says go), build the full film (8 min+) from `owner_script.txt` scenes 01-17
  in the owner's own voice and punch, claims made true (facts as facts, predictions as "could"). See the sections below.
- Owner then: "sample now! im very upset" (LEARNINGS 72). Built and SENT sample v5: `videos/ai-ban/out/ai-ban_v5.mp4`
  (full quality) → `All-in_ai_ban_sample_v5.mp4` (11 MB, crf 23). ORDER h01 c01 h02 h03 h04 h05 h05b c02 h07, 157 words,
  1:14. The owner's SCENE 01 line by line (made true: "could", "an idea is spreading"; SOURCES 21a-c) + SCENE 04's
  "banking system is on fire" + Altman Fed clip + open loop. DeepSeek/Hawley beats dropped (save them for the film).
  New: `Flag` usa / eu. Lints, voice_check, watch.py all 0 FAIL. Stills `qa/cuts_v5_new.jpg`, `qa/cuts_v5_fix.jpg`.
- Session start rule: `git fetch origin`, find the newest commit on every `claude/*` branch, merge it, read its HANDOVER.

## EARLIER (2026-10-11 night): ai-ban 1-min sample v4 · after the owner rejected the 2-min one
Owner (verbatim in LEARNINGS 67-70): the Senate-hearing hook was "really terrible", "WHO THE F CARES ABOUT THOSE SENATE
HEARINGS OF OLD PEOPLE", "fear of safety" is vague and overdone, a 2023 hearing is stale, "i prefer the original script",
"this time a 1min sample". Rules now in CLAUDE.md / PLAYBOOK: never a hearing as the hook; fresh (2025-26) events first;
keep the owner's own punchy lines (`owner_script.txt`), only make them true.
- Script (`videos/ai-ban/gen_script.py`, ORDER h01 c01 h02 h03 h04 h05 h05b c02 h06 h07, 154 words, 2 clips, 1:12):
  owner's "Take a long look at the AI on your phone. Enjoy it while you still can." → c01 hook: a deepfake (Fraunhofer
  SIT, OWASP Day 2024, CC BY-SA) + presenter's reveal "what you just saw is actually an example of a deepfake" → AI anyone
  can download, governments reach for the off switch → DeepSeek #1 (Jan 2025), Italy blocked it, South Korea pulled it →
  Hawley's S.321: downloading it could mean up to 20 years → owner's "they move fast when the banking system is on fire"
  → Altman warned the Fed (c02, Fed video 22 Jul 2025, PD: "AI has fully defeated that") → owner's twist (the builders
  want the lock) → open loop "who wins when the trap snaps shut. And it isn't you."
- SOURCES rows 20a-20f; LICENCES "New 1-min sample" table (c01 has a celebrity-likeness residual: flagged to the owner).
- New visuals: `AppStore`, `Flag` (italy, south korea; real colours), PhoneChat mode `off`; icons bars, fire, power.
- Clip sources (not in git): `.cc-src/aiban2/` (Fed fireside 2812 s mp4 + official transcript; OWASP Day talk HD).
  Spec `videos/ai-ban/clips3_spec.json`. NOTE: `win_cut.py` re-cuts EVERY spec entry unless names are given, and
  overwrites the zoom crop on `god_deepfake.mp4` (crop=1244:700:338:190 → 1920x1080; redo it after a re-cut).
  `god_deepfake.words.json`: the reveal line was added by hand (Whisper dropped it); `fed_altman2.words.json`: "else."
  per the Fed transcript.
- Full film next (after the owner OKs): rebuild acts from `owner_script.txt` scenes 02-17 in the owner's voice, true.

## EARLIER (2026-10-11, later): ai-ban 2-min SAMPLE (REJECTED by the owner) · built after the owner rejected the 1-min one
Owner notes (verbatim in LEARNINGS 60-66, promoted to PLAYBOOK taste, DESIGN Clips/Voice, CLAUDE.md "Owner's taste, learned"):
clip cuts "amateurish", voice "irregular", "G P T" unnatural, "MUCH MUCH MORE DRAMATIC AND HOOKING", first clip "NO
PURPOSE", "it never asks who you are" IRRELEVANT. What changed:
- **Delivered**: `videos/ai-ban/out/ai-ban_v3.mp4` (full quality), sent as `All-in_ai_ban_sample_2min.mp4` (19.1 MB, 2-pass 1100k + aac 96k). watch.py 0 FAIL, lints 0 FAIL.
- **Script** (`videos/ai-ban/gen_script.py`, ORDER c01 h01 c02 h02 c03 h03 c04 h04 h05 h06 c05 h07 h08 h09, 229 words, 5
  clips, 2:08): cold open = the hearing's AI clone of Sen. Blumenthal's voice while his mouth stays shut → "watch his
  mouth" → his reveal "that voice was not mine" → written by ChatGPT, and the man who runs ChatGPT sat in front of him →
  Altman "my worst fears" → he asked for a licence (clip) → who can afford one (the viewer's stakes) → pull up the ladder
  → Marcus "technocracy combined with oligarchy" (clip) → open loop (pieces). The encryption precedent moved to the film.
- **Clip edits**: `build.py` now adds pre-roll (≤0.45 s) / post-roll (≤0.7 s) from each clip's own silence, qsin fades
  on the room sound, L-cut into the next line; no freeze frame. `Clip` plate = documentary lower third (`plateAt`).
  `lint_clips.py` understands the new semantics (`from`/`to` = first/last word; `roll: false` = old behaviour).
- **Voice**: speed 1.0; `tts.py` refuses spaced letters, has a `LEX` IPA table (Blumenthal), levels every line to
  -20 dBFS voiced RMS (SQ_V 2); new `tools/voice_check.py` (pitch / level / rate outliers, rising ends): 0 flagged.
- **New tool** `tools/win_cut.py` (probe word times in a long .ts, cut with 1.5 s room either side; CLIPS.md).
- Clips: `engine/public/aiban/senate_{clone,notmine,fears,licence2,marcus}.mp4` + stills `senate_{blumenthal_shut,marcus,room}.jpg`,
  all US Senate video (PD), LICENCES.md + SOURCES.md rows 1e-1g. Source `.cc-src/aiban/senate_051623.ts` (1 GB, not in git).
- Root.tsx: ai-ban may use the aibm visuals too (`{...aibm, ...aiban}`; ChatBox used in h02).
- Full film next (owner OK first): acts 2-8 of SCRIPT.md, rewritten to the new taste (drama, so-what test, purposeful
  clips). More PD hearing moments found: Hawley "printing press ... or the atom bomb?" (stream ~1679-1698 s), Altman
  "if this technology goes wrong" (3628), Kennedy/licence Q&A (~7040). Owner: never wait, never ask; subagents for
  mechanical work.

## EARLIER (2026-10-11): "THE COMING AI BAN" (slug `ai-ban`) · 1-min sample DELIVERED · NEXT: owner's notes → full film
- Sample = act 1 of narration v1 (SCRIPT.md), 7 beats + 2 clips, 143 words, 1:06. `videos/ai-ban/gen_script.py`
  (ORDER h00 h01 c01 h02 c02 h03 h04 h05 h06), out `videos/ai-ban/out/ai-ban_v2.mp4`, sent as `All-in_ai_ban_sample.mp4` (16.9 MB, crf 21).
  Lints 0 FAIL, watch.py 0 FAIL (v2 fixed v1's lone 4.5 s padlock and 1 s munitions list). Stills: `videos/ai-ban/qa/sheet_h00_h06.jpg`.
- Clips: the Senate's OWN hearing video (US gov, PD): c01 "I think if this technology goes wrong, it can go quite
  wrong." (hook, at 0:10), c02 "Number one, I would form a new agency that licenses any effort above a certain scale of
  capabilities and can take that license away and ensure compliance with safety standards." `LICENCES.md` has stream
  URL, times, risk (Low). Source `.cc-src/aiban/senate_051623.ts` (1 GB, not in git; re-download: CLIPS.md "US government
  video") + `senate_051623.segments.txt` (tiny.en transcript of the whole hearing: grep it for more Altman lines for act 5).
- New visuals `engine/src/visuals/aiban.tsx`: PhoneChat, Licence, Hearing (PD still + red ring), ListDoc, Pieces; icons
  lock, chip, idcard, brain, missile, tank (VISUALS.md). Real hearing stills `engine/public/aiban/senate_*.jpg`.
- Full film next (after the owner OKs the sample): acts 2-8 of narration v1, ~1,250 words, a clip every 20-40 s.
  Clip ideas: more Senate hearing lines (PD; Marcus/Montgomery too), Fed/FTC/White House video (PD), CC talks in
  `.cc-src/aiban/cands.json`. Owner standing rules: never wait, never ask; subagents for mechanical work.
- Cloud: network is open now; `bash scripts/cloud-setup.sh` then `source .cloud-env.sh` works end to end (av<16 pin added).


--- ARCHIVED FROM HANDOVER.md (2026-10-14) ---
# HANDOVER · All-in · 2026-10-13 · Active Production Studio State

> [!IMPORTANT]
> **HOME IS THE PC (2026-10-13 reset):** `C:\Users\pc\Documents\All-in-keep\`.
> Work branch: `claude/local-home`. Start sessions with `. C:\Users\pc\Documents\All-in-keep\env.ps1`.
> Keep context under ~120k tokens. For older history, see `HANDOVER_archive.md`.

## Active Topic Matrix (2026-10-13)
| Topic | Status | Runtime | Voice Engine | Next Immediate Step |
|---|---|---|---|---|
| **captchas-sample** | **NEW MASTER SAMPLE DELIVERED** | 0:40 (6 beats, 1 clip) | Chatterbox (`ref_female_captchas.wav`) | Delivered `All-in_captchas_deepmind_v4_sample.mp4` to `deliverables/` and `Desktop/p/`. 6/6 QA gates passed. Showcases DeepMind-improved female voice + Register B motion graphics (`DossierDoc`, `Highlighter`, `MetricChart`, `ForensicStamp`). |
| **elon-musk** | **CINEMA SAMPLE DELIVERED** | 2:48 (35 cuts, 0 clips) | Chatterbox (`tts_cb.py`) | Delivered `videos/elon-musk/out/elon-musk_v2.mp4` (and `elon-musk_v2_comp.mp4`). 100% Left/Right split, 7 bespoke topic visuals, 6 graduated kit icons (`radar`, `target`, `crosshair`, `warning`, `globe`, `rocket`). Automated guardrails in `lint_text.py`. |
| **ai-ban** | **FULL FILM DELIVERED** | 12:54 (18 clips) | Kokoro (`tts.py`) | Waiting on owner review of `All-in_ai_ban_full.mp4`. Minor polish open (clip cR2 is German army, not US). |
| **china-ai-underground** | **SAMPLE DELIVERED** | 1:18 (2 clips) | Chatterbox (`tts_cb.py`) | Expand sample into 8-min full film (Exhibit A/B, Supermicro hair-dryer, Anthropic distillation). |
| **why-ai-dumber** | **v2/v3 SAMPLE BUILT** | 2:00 | Chatterbox (`tts_cb.py`) | Owner review of v2/v3 sample featuring woodcut engraving plates (`PLATES.md`) & `ouroboros.tsx`. |
| **captchas-full** | **BENCHMARK COMPLETE** | 11:03 (19 clips) | Kokoro (`tts.py`) | Delivered v3 reference film (`All-in_captchas_full_v3.mp4`). |
| **captchas-3min** | **BENCHMARK COMPLETE** | 2:36 | Kokoro (`tts.py`) | Delivered v6 visual benchmark cut (`All-in_captchas_3min_v6.mp4`). |
| **ai-black-markets** | **DEAD / RETIRED** | 8:15 | Kokoro | Topic killed by owner 2026-10-11. Never polish or build. Usable clips already migrated to `ai-ban`. |

## Milestone (2026-10-14): DeepMind Voice Harmonization & High-End Motion Graphics
- **Voice Standard Harmonized to `captchas_v2`**:
  - Extracted & normalized `assets/voice/ref_female_captchas.wav` (6.65s, F0 median 202.9 Hz) matching `All-in_captchas_full_v2.mp4`.
  - Driven by Chatterbox on CUDA with per-beat dramatic variance (`ex=0.65`, `cfg=0.35`) and natural breath pauses (` | ` and ` || `).
  - Verified 100% word accuracy via Whisper, -18.5 LUFS raw (-14.0 LUFS YouTube master), -1.42 dBFS peak (0 clipping).
  - Presets registered in `tools/tts_cb.py`: `--voice captchas` (captchas female), `kore` (DeepMind Kore), `fenrir` (male).
- **High-End Motion Graphics System (Register B / HyperFrames standard)**:
  - Created `engine/src/ds/evidence.tsx`: `DossierDoc`, `Highlighter` (animated fluorescent sweep), `MetricChart` (glowing area fill + spring easing), `CodeTerminal` (dark OS window chrome + typing reveal), `ForensicStamp` (spring bounce).
  - Re-exported in `engine/src/ds/kit.tsx` and injected `sharedVisuals` into `engine/src/Root.tsx`. Every topic now universally inherits all 22 woodcut plates and editorial motion graphics without boilerplate.
  - Verified `npx tsc --noEmit` passing with 0 errors.
- **Studio Quality Gate**:
  - `python tools/qa.py greyhat-ai` passed **6/6 gates** (`lint_text`, `lint_cues`, `lint_clips`, `voice_check`, `watch`, `listen`). Fixed subprocess encoding and NoneType handling.

## HOME IS THE PC AGAIN (2026-10-13) · cloud setup no longer needed (kept below as a fallback)
- Work folder: `C:\Users\pc\Documents\All-in-keep\All-in` (git clone of the private repo `quartzsaphir-debug/all-in-studio`,
  Git LFS; credentials via Git Credential Manager). Start with `git fetch origin`.
- **MERGED 2026-10-13 (S said yes): branch `claude/local-home` = ai-ban + AI black markets + China AI underground in one
  tree; work here. `main` was left untouched; merge `claude/local-home` into it only when S asks.** Conflicts were only in
  HANDOVER (the China handover is appended at the bottom of "PARALLEL LINE"), .gitignore, LEARNINGS (both kept), Root.tsx
  (all three compositions registered) and cloud-setup.sh (`av<16`). `tsc --noEmit` passes; one still from each of
  `ai-ban`, `ai-black-markets`, `china-ai-underground` rendered. The cloud branches below are now history.
- **Which branch held what** (cloud work happened in three separate lines; the live topic is ai-ban):
  | Branch | Holds | Status |
  |---|---|---|
  | `claude/bold-bell-plohvn` (local `ai-ban`) | **ai-ban full film** 12:54, 18 clips, `All-in_ai_ban_full.mp4` + samples v4/v5; contains the 4 older ai-ban/black-markets branches | **LIVE topic**, newest ai-ban work, waiting on owner notes |
  | `claude/laughing-faraday-edo1rf` | China AI underground 1:17 sample (Chatterbox narrator `tools/tts_cb.py`, cinema layout, Senate PD clips) | newest commit overall (2026-10-11 10:10), 1 commit on `main` |
  | `claude/serene-wozniak-ob8jdw` | AI black markets full film 8:15 (`All-in_ai_black_markets_full.mp4`, 14 clips, Kokoro) | owner REJECTED it: dead, never polish |
  | `claude/lucid-albattani-l6k8ct` | AI black markets full-film WIP 8:18 | superseded by serene, dead |
  | `claude/vigilant-hawking-wj9frh`, `magical-dijkstra-rp02md`, `pensive-knuth-7ush35` | ai-ban samples (1-min v4, 2-min, 1-min) | all contained in `bold-bell` |
  `main` = AI black markets 1:30 sample + captchas (3-min v6, full v3).
- **Where the files are on the PC**: everything is in this folder on branch `claude/local-home` (the temporary
  `branches\` worktrees were removed after the merge). Delivered films: `videos/<slug>/out/All-in_*.mp4`.
- **Delivered files**, all verified present in LFS and probed with ffprobe: `All-in_ai_ban_full.mp4` (775 s),
  `All-in_captchas_full_v3.mp4` (663 s), `All-in_captchas_3min_v6.mp4` (157 s), `All-in_ai_black_markets_sample.mp4` (93 s),
  `All-in_ai_black_markets_full.mp4` (serene branch), `All-in_china_ai_underground_sample.mp4` (laughing-faraday branch).
- **Windows toolchain (verified 2026-10-13)**: Node 24.19 / npm 12 (`engine/`: Remotion 4.0.526, `.remotion/chrome-headless-shell`
  present); default `python` = 3.14.7 with numpy, soundfile, Pillow, faster-whisper 1.2.1 (av 18.1, no pin needed),
  kokoro-onnx; ffmpeg/ffprobe on PATH (Downloads\ffmpeg-2026-08-20 essentials); GPU RTX 4060 Laptop 8 GB, CUDA works for
  `large-v3-turbo` float16 (13 s for load + a 3 s clip). Kokoro models stay outside the repo in
  `C:\Users\pc\Documents\All-in-keep\voice\kokoro-models` (the `tts.py` default). Chatterbox (`tts_cb.py`) is not installed
  here (no `chatterbox` package; only needed for the China sample's narrator).
- **Checked**: `tools/build.py ai-ban` rebuilds master.wav (12:54, 75 beats, 18 clips); `tools/frame.mjs` still renders;
  a 5 s muted render (16 s wall time, 1920x1080 h264 30 fps) + master.wav mux plays with sane levels; `tools/cc_clips.py`
  re-cuts the committed captcha clips byte-identically. Raw talks: all of `.cc-src/` (566 MB) was already on this PC;
  `redownload-sources.sh` skips them; `.cc-src/aibm/new_important.opus` was the only missing one and was fetched.
- **Standing rules (keep)**: subagents on Sonnet/Haiku for mechanical work (downloads, file ops, licence checks,
  transcription, render babysitting); creative decisions and final quality review stay on the main model. Context under
  ~120k tokens, never print whole logs. During a long job (download, render, install) stay in the turn with one
  sleep-and-check loop; never end the turn while it runs. Money rule and owner's taste: see CLAUDE.md.

## NOW: ai-ban FULL FILM (owner OK'd sample v5: "i like it xd now the full video but please do a great job. put urself in
## the boots of the critical mind viewer.") · LEARNINGS 73-74
- `videos/ai-ban/gen_script.py` = the film: 14 acts on the owner's 18 scenes (opening = sample v5 unchanged), 75 beats,
  1,627 words, 18 clips, 12:54. The sample is kept as `gen_sample_v5.py` (writes `script_sample_v5.json`).
- Critical viewer: every line sourced (SOURCES rows 1a-23c; film map under "Full film") or said as a fear; narrator says
  which ("not yet"); generic `stamp: {"t": "real"|"not yet", "at"}` on any visual (`engine/src/ds/layouts.tsx`; a string
  `stamp` stays the visual's own prop). Counter-facts admitted (White House backs open models; EO revoked).
- Clips: c01 deepfake hook, cB/cF/cG/cH/cR reused CC talks from `engine/public/aibm/`, cA/cP/cP2 Senate 2023 (PD,
  evidence only), c02 Fed, 8 new: cD crypto (Camp 2023), cK anonymity (37C3), cM Warren Chip Security Act (Senate Banking
  2026, PD), cN open models (Hacker Hotel 2025), cQ "they stole that from us" (EMF 2026), cR2 drone swarms (39C3), cS EU AI
  Act (GoD 2024), cT run DeepSeek in 4 GB (Hacker Hotel). All in LICENCES.md. Longest narration gap 60 s (the approved opening).
- New: Flag usa / eu / china; tts LEX WormGPT, xAI, Ng. tools/cc_cut.py: optional pad_in / pad_out per clip.
- DELIVERED: render `videos/ai-ban/out/ai-ban_v6.mp4` (full quality, 490 MB, gitignored) → sent as `All-in_ai_ban_full.mp4`
  (19.1 MiB, 2-pass 150k + aac 48k). watch.py 0 FAIL; lints 0 FAIL; one still per new clip checked (`qa/cuts_fix2.jpg`).
- Weak spots to improve after owner notes: no CC clip on WormGPT/smuggled GPUs; cR2 drones is German army, not US.

---
## PARALLEL LINE (branch `claude/laughing-faraday-edo1rf`, merged 2026-10-13): China AI underground sample
Its HANDOVER, kept verbatim below. Files: `videos/china-ai-underground/`, `engine/src/visuals/cnai.tsx`, `tools/tts_cb.py`.

# HANDOVER · All-in · 2026-10-11 · NEW TOPIC "undergrounds of modern Chinese AI": 1-min SAMPLE delivered · NEW VOICE + CINEMA STYLE
Older history: `HANDOVER_archive.md` (read only if needed). Token-lean: S is on Pro (keep a session under ~120k tokens;
grep and small scripts, never print whole transcripts or logs). Never read SCRATCH HOLY or other source projects.

## 2026-10-11: owner notes on the ai-black-markets sample (full text: LEARNINGS 48-53) and what changed
Owner: voice "horrible", clips too short/irrelevant or with weird accent/tonality (skip them), "not dramatic", "no cinema soul",
"robotic voice should not play for too long uninterrupted; bullet-point the BIG claims, hook, make him wonder; not a presentation".
- **Voice**: `tools/tts_cb.py` (Chatterbox, MIT, `.venv-tts` Python 3.11 + torch CPU; ~7 s of compute per 1 s of voice, so a
  1-min sample voices in ~10 min on the 4-core cloud box). Timbre ref `assets/voice/narrator_ref.wav` (synthetic). Per-beat `ex`
  drama; " | " / " || " = written breaks. `script.json` `"master": "cinema"` = new mastering chain in `tools/build.py`.
  Old Kokoro path (`tools/tts.py`) still works for old videos. Set up on a new cloud box: see top of `tts_cb.py`.
- **Style**: new `scene` layout (full-bleed) + `engine/src/visuals/cnai.tsx` (Film, Cctv, LabelSwap, RouteMap, AccountWall) +
  `cnai_map.ts` (Natural Earth PD land outline). Case-file grammar: EXHIBIT A / B, red stamps with thud, RECONSTRUCTION tag
  on anything we drew instead of filmed. Add them to VISUALS.md when the full film is built.
- **Clips**: all US Senate committee webcasts (public domain) cut from senate.gov HLS streams (see LEARNINGS 52; the subagent's
  stream patterns: archive `www-senate-gov-msl3archive.akamaized.net/<comm>/<comm>MMDDYY_1/master.m3u8`, live
  `www-senate-gov-media-srs.akamaized.net/hls/live/<id>/<comm>/<file>/master.m3u8`, ids banking 2036799, commerce 2036779,
  foreign 2036794, judiciary 2036788, armed 2036800; captions are embedded). YouTube downloads are blocked from the cloud box.
- **Sample**: `videos/china-ai-underground/` (gen_script.py, SOURCES.md, LICENCES.md, qa/cuts_all.jpg). 8 beats, 2 clips
  (Sen. Banks hook, Lutnick on DeepSeek), 1:18. Spine: Exhibit A (Blackwell, "not allowed"), Exhibit B (the Supermicro hair-dryer
  label swap, SDNY indictment March 2026, $510 M in weeks), DeepSeek, "smuggled chips, stolen answers, 24,000 fake accounts".
- **Not yet used, ready for the full film** (`.cc-src/cnai/senate/clips/`, local only, re-cut with the stream patterns above):
  Feith "no such thing as smuggling" + "mounting evidence ... indictment" (Banking 2026-06-11), Warren "billions of dollars
  of chips ... diverted", Lutnick x2 on DeepSeek, Sen. Tim Scott "Alibaba executed the largest known distillation attack on
  Anthropic" (Scott has a Carolina accent: owner skips odd accents, judge by ear). Senate Judiciary 2026-04-22 "Stealth
  Stealing" has distillation moments (captions in `.cc-src/cnai/senate/judiciary042226.live.caps.txt`). House committee
  clips (Moolenaar 483XSj_VNaw hair-dryer line, Mast H3SX0JYe2-A "thousands of Blackwell chips", Pottinger mkAYpnqRleM on
  DeepSeek) are US-gov works but YouTube-only: the owner's PC can fetch them with yt-dlp.
- **Full film outline (8 min+)**: Exhibit A chips · the smuggling routes (Singapore/Malaysia/Thailand, rented cloud compute,
  Operation Gatekeeper "Sandkyan" labels Dec 2025) · Exhibit B hair dryer (full case) · DeepSeek and the chips it "shouldn't
  have" · distillation (Anthropic Feb 2026: ~16 M exchanges, ~24 k accounts; Alibaba letter, Senate Banking) · the grey-market
  GPU rental and shell companies · the denial ("no such thing as smuggling") · who profits · what Washington does (Chip
  Security Act, location verification) · what it means for you. Keep narration runs <= ~17 s, a real voice every 20-35 s.
- Open: re-check "banned" claims against the latest BIS rule; read the DOJ/SDNY release; verify Anthropic post.

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

## AI black markets FULL FILM (2026-10-11, cloud session, PR quartzsaphir-debug/all-in-studio#3)
Owner: "the DARK REALITY of grey areas of AI and its practices in the black markets!", "dont make it too hard for the
newbies", "Do a fantastic job". Owner: NEVER wait for them, never ask. Mechanical work → Sonnet/Haiku subagents.
- Built from the 1:30 sample: `videos/ai-black-markets/gen_script.py` = 60 beats, 924 narrated words, 14 clips, 8:15.
  10 acts: grey zone · the shop · the chatbot that says yes · scams for rent · stolen logins · fake faces · fake voices ·
  the fake worker · who cashes in (open loop paid) · how to stay safe (secret word = "the one word that beats a clone"),
  recap montage, flip line + callback to the opening interview. Gates: lint_text / lint_cues / lint_clips 0 FAIL.
  Longest narration gap between clips 38.7 s. Stills reviewed per act (`qa/sheet_*.jpg`, `qa/cuts_all.jpg`, fixes in `cuts_fix*.jpg`).
- Clips (all media.ccc.de, CC BY 4.0 except Wijckmans CC BY-SA 4.0; table + credits in `LICENCES.md`): Wijckmans EMF26
  (hook + laptop mules), Hock & Bernhard 38C3 (shop of shops), Chiao-Lin Yu 39C3 "Vibe Scammers" (scam customer support,
  AI builds the scam, 30 salespeople, AI versus AI), Anykey Hacker Hotel 25 (refusal cut out), Karl Lovink HH25 (phishing
  panel 100 €/week + support), van Duijn & Neelen WHY2025 (AiTM proxy, passkeys), Breedijk WHY2025 ("no need to hack in
  if you can log in"), Bunzel GoD24 (hard to tell real from fake; 5-10 s of audio). Clip specs: `clips_spec*.json`.
  REJECTED (third-party video on the slides): rc3 politician deepfakes, GoD24 face-swap demo (LEARNINGS 48).
- New visuals in `engine/src/visuals/aibm.tsx`: LoginCard, StealerLog, Channel, FaceSwap (logged in VISUALS.md).
- Facts: SOURCES.md rows for WormGPT (€60/month, PCMag/Tom's Hardware), FraudGPT ($200/month, Netenrich), Genesis Market
  (80 M logins), FBI PSA 3 Dec 2024 (secret word), Chapman laptop farm (309 companies, $17 M, 102 months), FBI IC3 2025
  ($20.9 B, AI $893 M; secondary summaries, check the PDF if the owner asks).
- 39 candidate clips more in `.cc-src/aibm/clip_cands.json` (86 total, 12 talks transcribed; audio in `.cc-src/aibm/`,
  not in git; `bash scripts/redownload-sources.sh` or the URLs in `.cc-src/aibm/urls.txt`).
- Render: `node tools/render.mjs ai-black-markets --concurrency=4` (cloud box: ~10 min per 1,500-frame chunk, 10 chunks).
  DONE: render `out/ai-black-markets_v5.mp4` (full quality, not in git; v4 had a 0.2 s empty left panel at 2:05.9, fixed
  in w03 and only that chunk re-rendered by copying the other chunks into the new srchash folder). watch.py 0 FAIL,
  `qa/sample.jpg`. Sent: `out/All-in_ai_black_markets_full.mp4` (18.4 MB, 2-pass 240k video + 48k aac, in git LFS) with LICENCES.md.
- Optional polish if the owner wants more: p03 bar chart labels are small; a 15th clip could go in act 10 (Wijckmans
  1255.8-1263.7 "nobody gets hired without having a coffee").
- Clean-up once the owner OKs: `.cc-src/aibm/` audio (~600 MB), `.render-tmp/ai-black-markets_*`.

## Commands
Always `PYTHONIOENCODING=utf-8`, `HF_HUB_OFFLINE=1` for Whisper. Patch with python scripts, not bash heredoc edits of
quotes. Renders in `.render-tmp/` (~6-8 min per 1,500-frame chunk at --concurrency=3; a full 11-min film ≈ 1.5 h).
A stale `transcribe_src.py` python process from 2026-10-08 23:30 may still be running; stop it if it is.

## NEW TOPIC SCRIPT · 2026-10-14 · AI'S GREY ZONE
- Owner pivoted away from the subsea-repair idea. The rejected draft's files were removed.
- New topic draft: `videos/ai-grey-zone/SCRIPT.md` (about 1,300 narration words; approximately 9–10 minutes including clips).
- A separate SCRIPT-6min.md cut is also present in the topic folder; it was preserved unchanged.
- Focus: the science of context jailbreaks, indirect prompt injection, and training backdoors; distinct from the retired AI black-markets film.
- Research and clip candidates are in `videos/ai-grey-zone/SOURCES.md` and `LICENCES.md`. Script only: clips are not cut/cleared and no build or render has been made.

## GREYHAT-AI 1-MIN SAMPLE (owner: "i like this script. make only a 1min sample") · 2026-10-14
- Scope: `videos/greyhat-ai/` h01-a04 extended (7 beats, 219 words, ~1:20). Full film kept in `script_full.json` (regen via `gen_script.py`); sample writer is `gen_sample_1min.py`. No clips in sample (picture-only proof; full film needs 2-3 CC/PD clips cleared in LICENCES.md first).
- Built in place on `claude/local-home` per owner answer (no worktree). Bespoke plates in `engine/src/visuals/greyhat.tsx` (OneSentence, SameMetal, GreyBlackMap, TokenStream, OnePipe, CrackedGlass, HiddenLine, ZeroClick); registered in `engine/src/Root.tsx`. `tsc --noEmit` passes.
- Fix: h01 R enter was "language" (not spoken → lint_cues FAIL), now "sentence". Voice: Chatterbox cinema (`tts_cb.py`), SOURCES.md/LICENCES.md written for the sample.
- NEXT: voice h01-a04 → `build.py greyhat-ai` (lints must be 0 FAIL) → stills → `render.mjs greyhat-ai` → compress <20MB → owner review. Full film only after sample OK + clips cleared.
- VOICE 2026-10-14: all 7 beats Chatterbox + Whisper-checked. `voice_check` flagged h02/h03/a04 rising ends → reworded to declarative endings (h02 ended on "lock", h03 on "science", a04 split to "...has a name. It is called prompt injection."). h02 needed 3 takes: final `||` split + tail trim. voice_check 0 flagged after making its rise metric octave-jump resistant (median last 12 voiced frames; h02's spoken "lock." falls 130→117 Hz, the +178% was a 40 ms 3x detector jump mid-word).
- BUILD 2026-10-14: `build.py` green (lint_text/cues/clips 0 FAIL), 88.3 s (1:28), timeline + cinema-mastered master.wav. Shots cut from 7 statics to 17 paced cuts after catching R-enter timing failures (late cue words). Stills reviewed (`qa/cuts_all.jpg` + full-size hook/a04 frames); one label-overlap fix (CHAT BOX). Render running.
- DELIVERED 2026-10-14: `videos/greyhat-ai/out/greyhat-ai_v1.mp4` (full quality, 50 MB) + send copy `All-in_greyhat-ai_sample_1min.mp4` (2.2 MB, crf28 + aac 48k, 1080p, 1:28, av verified). watch.py 0 FAIL (2,648 frames), 12 s sample sheet checked. `.render-tmp/greyhat-ai_*` cleaned. Waiting on owner review; full film only after sample OK + 2-3 CC/PD clips cleared.

## NEW TOPIC · THE PRICE OF THE PROMPT (ai-power-bill) · 2-min sample in build (owner 2026-10-14: "new video topic, decide of everything then open first a 2min sample")
- Topic chosen (decided autonomously): AI's electricity bill paid on the viewer's own meter — freshest 2025-26 stakes (EIA Feb 2026 jumps +26.3% VA/+21.9% OH/+19.5% PA; PJM capacity auctions $28.92→$269.92→$329.17→$333.44/MW-day; LBNL 4.4%→6.7-12% by 2028; July 2026 DOE 202(c) orders, data centers ready for diesel within 15 min). 9 beats, 301 words, 16 shots, `gen_sample_2min.py`.
- New register per updated AGENTS.md (outer manifest): woodcut engraving plates in `engine/src/visuals/ai-power-bill.tsx` (MeterDial, ServerHall, ServerRack, SunCity, GridMap, AuctionChart, BackupGen + documents Bill/OrderDoc/HomeAC), no LineIcon grammar; Kore female voice (`assets/voice/ref_female_kore.wav` via tts_cb.py).
- Status: script + visuals done, `tsc --noEmit` clean, `lint_text` 0 FAIL, cue pre-check all pass; Chatterbox voice pass running. NEXT: voice_check → build.py → stills → render → `tools/qa.py ai-power-bill` (adds listen.py loudness/WER gate) → compress <20MB → owner review.
- 2026-10-14 (later): voice green (0 flagged after 4 iterations: b01/b07 endings + b07 pitch), build green (lint_text/cues/clips 0 FAIL), 2:14 / 8 beats / 15 shots after trimming the b02 beat to hit the 2-min brief. Stills reviewed (qa/cuts_all.jpg). Render running.
- DELIVERED 2026-10-14: `videos/ai-power-bill/out/ai-power-bill_v2.mp4` (full quality) + send copy `All-in_ai-power-bill_sample_2min.mp4` (3.3 MB, 1080p, 2:14, av verified). `tools/qa.py ai-power-bill` → **6/6 PASS** (lint_text, lint_cues, lint_clips, voice_check, watch, listen). Two fixes en route: plates now cut in at frame 0 with only the motion on the cue word (PLATES.md "schedule rule"), listen.py trims each beat's window at its last spoken word (Whisper hallucination on the end pad). Old v1 render deleted, `.render-tmp` cleaned. Waiting on owner review; full film (8 min+, 2-3 CC/PD clips per LICENCES plan) only after OK.

## WORKSPACE SKELETON & OMNI-HARNESS OPTIMIZATION · 2026-10-14
- **Omni-Harness Architecture Built**: Studio is now 100% harness-agnostic (Google Antigravity, Claude Code, Cursor, Windsurf, Codex, OpenCode, Aider).
  - Root bridge `allin.ps1`: run any studio tool from `All-in-keep\` (`.\allin.ps1 status`, `build`, `tts`, `tts-cb`, `qa`, `watch`, `listen`, `render`, `check`).
  - Added root & inner `.cursorrules`, root `AGENTS.md`, and root `HARNESS.md`.
  - Self-healing voice runtime: `tools/tts_cb.py` auto-dispatches to Python 3.11 venv with CUDA even if invoked with system Python 3.14.
  - Robust CLI guards: all studio tools (`build.py`, `watch.py`, `lint_*.py`, `tts*.py`, `render.mjs`) have friendly `--help` and topic validation (no crashes or accidental folders).
- **Retrievals from Legacy**:
  - Retrieved `tools/listen.py` from `_legacy/uncommitted/not-so-dark-times/`: audits loudness (-14 LUFS YouTube standard), clipping, dead air >1.8s, voice-vs-SFX balance, and Whisper WER against script. Accelerated with CUDA on RTX 4060.
  - Created unified QA gate `tools/qa.py`: single command executes all 6 gates (`lint_text`, `lint_cues`, `lint_clips`, `voice_check`, `watch`, `listen`). Passed 6/6 on `greyhat-ai`.
- **Skeleton Clean-up**:
  - Purged accidental dummy folder `videos/--help` and abandoned empty folder `videos/subsea-repair`.
  - Added `*.bak` to `.gitignore`.



--- ARCHIVED FROM HANDOVER.md (2026-10-15) ---
# HANDOVER · All-in · 2026-10-14 · Active Production Studio State

> [!IMPORTANT]
> **HOME IS THE PC:** `C:\Users\pc\Documents\All-in-keep\` (Repo: `All-in\`, branch `claude/local-home`).
> Start sessions with `. C:\Users\pc\Documents\All-in-keep\env.ps1` or use `.\allin.ps1 <cmd> <topic>`.
> Keep active context under ~120k tokens. Historical branch & session logs live in `HANDOVER_archive.md`.

## Active Topic Matrix (2026-10-14)
| Topic | Status | Runtime | Voice Engine | Next Immediate Step |
|---|---|---|---|---|
| **new-ai-reasoning** | **THE GHOST ARMY (MASTER DELIVERED)** | 0:55 (55.9s, 5 beats, 10 cuts) | Chatterbox (`kore`, DeepMind Female) | Master documentary sample v5 rendered & verified (8/8 QA pass, -14.9 LUFS, 0.00 WER). Master MP4 delivered to `deliverables/All-in_new_ai_sample.mp4`. 100% Left/Right split shots featuring 10 bespoke woodcut engraving plates on Left (AutonomousChip, GlassBox, CurtainPull, GlobalLaborMap, BoundingBox, Marionette, DeliveryBot, ControlSteering, UndergroundFactory, CleanMonolith) paired with 10 unboxed editorial design prints on Right. Zero literal captchas, zero crude SVG doodles, zero pipe-pause robotic micro-delays. Continuous human documentary narration. Ready for owner review. |
| **microwave-trading** | **MASTER DELIVERED (v8 PRINT REDESIGN)** | 1:58 (7 beats, 14 cuts) | Chatterbox (`captchas`) | Complete master sample rendered & verified (8/8 QA pass). Master MP4 delivered to `deliverables/All-in_microwave-trading_sample.mp4`. Authentic unboxed design print aesthetic (DossierDoc unboxed, zero card boxes), 14 unique bespoke woodcut plates on Left (1 per cut, 0 duplicates), 14 bespoke editorial design prints on Right, zero text/dial/leader collisions verified via still inspection. Ready for owner review. |
| **ai-power-bill** | **2-MIN SAMPLE DELIVERED** | 2:14 (8 beats, 15 shots) | Chatterbox (`kore`) | Waiting on owner review of `All-in_ai-power-bill_sample_2min.mp4` (6/6 QA pass). Expand to 8+ min full film with 2–3 CC/PD clips after OK. |
| **greyhat-ai** | **1-MIN SAMPLE DELIVERED** | 1:28 (7 beats, 17 cuts) | Chatterbox (`captchas`) | Waiting on owner review of `All-in_greyhat-ai_sample_1min.mp4` (6/6 QA pass). Clear 2–3 CC/PD clips in `LICENCES.md` before full film. |
| **elon-musk** | **CINEMA SAMPLE DELIVERED** | 2:48 (35 cuts, 0 clips) | Chatterbox (`tts_cb.py`) | Waiting on owner review of `videos/elon-musk/out/elon-musk_v2.mp4` (100% Left/Right split, 7 bespoke visuals). |
| **ai-ban** | **FULL FILM DELIVERED** | 12:54 (75 beats, 18 clips) | Kokoro (`tts.py`) | Waiting on owner review of `All-in_ai_ban_full.mp4`. Optional polish: replace clip `cR2` (German army drones) with US PD clip. |
| **why-ai-dumber** | **v2/v3 SAMPLE BUILT** | 2:00 | Chatterbox (`tts_cb.py`) | Waiting on owner review of v2/v3 sample featuring woodcut engraving plates (`PLATES.md` / `ouroboros.tsx`). |
| **china-ai-underground** | **SAMPLE DELIVERED** | 1:18 (8 beats, 2 clips) | Chatterbox (`fenrir`) | Ready to expand into 8-min full film (Exhibit A/B, Supermicro hair-dryer, Anthropic distillation; Senate PD clips cached in `.cc-src/cnai/`). |
| **ai-grey-zone** | **SCRIPT DRAFTED** | ~9–10 min (1,300 words) | Not voiced yet | Script in `videos/ai-grey-zone/SCRIPT.md` + `SOURCES.md`. Cut/clear CC clips before building sample. |
| **captchas-full / 3min** | **BENCHMARK COMPLETE** | 11:03 / 2:36 | Kokoro (`tts.py`) | Reference benchmarks (`All-in_captchas_full_v3.mp4` & `All-in_captchas_3min_v6.mp4`). |
| **ai-black-markets** | **DEAD / RETIRED** | — | — | Killed by owner 2026-10-11. **Never build, polish, or send.** |

## Latest Studio Upgrades & Invariants (2026-10-14)
- **Voice & Prosody Pipeline (`tools/tts_cb.py`)**:
  - Default narrator: **DeepMind Kore Female** (`--voice kore`, `assets/voice/ref_female_kore.wav`) or **Captchas v2 Female** (`--voice captchas`, `assets/voice/ref_female_captchas.wav`), plus **Fenrir Male** (`--voice fenrir`).
  - Automatic `-20.0 dBFS` voiced-frame RMS normalization (`level()`) + in-loop `f0_rise` filtering so declarative sentences land with a natural falling cadence (`rise <= 8.5%`) and Whisper runs on CUDA float16.
- **Audio Mastering (`tools/build.py`)**:
  - Narration is mastered across continuous speech segments before timeline placement so 10–15s archival clip gaps never cause EBU R128 `loudnorm` gain pumping.
- **Smart Per-Chunk Caching & Bundle Reuse (`tools/srchash.py`, `tools/render.mjs`, `cutstills.mjs`, `frame.mjs`)**:
  - `srchash.py --chunks=1500` hashes each frame window by its overlapping beats + engine code (excluding `master.wav` and other topics). Editing 1 beat re-renders only that 1,500-frame chunk; audio-only tweaks remux in ~1s without re-rendering video.
  - Webpack bundles are cached in `.render-tmp/bundle_<hash>` and rendered with GPU acceleration (`gl: 'angle'`).
- **7-Gate Quality Assurance (`tools/qa.py <slug>`)**:
  - Runs `lint_text`, `lint_cues`, `lint_clips`, `voice_check`, `render_sync` (verifies MP4 sidecar hash matches current code/timeline/audio), `watch.py` (empty screen + margin clipping check), and `listen.py` (-14 LUFS, clipping, Whisper WER).
  - Tip: Run `python tools/lint_cues.py <slug> --dump` after TTS to inspect exact Whisper word timestamps (`0.00s: word`) before writing shot cues.

## Core Studio Rules (Quick Reference)
1. **Zero Revenue Risk (The Money Rule)**: Only CC BY, CC BY-SA, CC0, or US Federal Government Public Domain clips (`senate.gov` HLS, Wikimedia Commons, `media.ccc.de` CC BY 4.0). Zero commercial news (WSJ, Vox, CNN), zero TED/TEDx, zero stock re-uploads. Log every asset in `LICENCES.md` and `SOURCES.md`.
2. **Visual Grammar**: Mandatory Left/Right `split` default (≥ 60% of shots; Left = subject at frame 0, Right = evidence on cue word within 2.0s). No lone big text/numbers on empty boards (`lint_text.py`). Plate silhouettes cut in at frame 0 (`Plate` without `at`); only internal motion/red accent waits for the cue word (`PLATES.md` schedule rule).
3. **Bespoke Metaphors**: Never reuse another topic's metaphor plates (`MODEL_COLLAPSE_PLATES` belong strictly to `why-ai-dumber`). Build topic-specific visuals in `engine/src/visuals/<slug>.tsx` using `ds/engrave.tsx`, `ds/evidence.tsx`, and `ds/kit.tsx`.

