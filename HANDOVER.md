# HANDOVER · All-in · 2026-10-11 · AI black markets FULL FILM (8:15) DELIVERED · waiting on owner notes (it + captchas-full v3)
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
