# HANDOVER · All-in · 2026-10-11 · "THE COMING AI BAN": script + sources DONE · NEXT: 1-min sample (needs network)
Older history: `HANDOVER_archive.md` (read only if needed). Token-lean: S is on Pro (keep a session under ~120k tokens;
grep and small scripts, never print whole transcripts or logs). Never read SCRATCH HOLY or other source projects.

## NOW (2026-10-11): "THE COMING AI BAN" (slug `ai-ban`) · script DONE · NEXT: build the 1-min sample (act 1)
- Owner HATED the aibm 1:30 sample ("terrible, unwatchable"): AI black markets is dropped.
- Owner's script: `videos/ai-ban/owner_script.txt`. Owner gave full licence: "free to totally change it", "make
  everything so cool", viewer must leave with takeaways. Taste rules: `PLAYBOOK.md` "Owner's taste" (LEARNINGS 48-54).
- DONE: `videos/ai-ban/SOURCES.md` (45 fact rows, verdicts; the owner script's false lines listed at the bottom),
  `videos/ai-ban/SCRIPT.md` = why it changed + **narration v1** (8 acts, 1,219 words, [row] per fact, [CLIP] slots) +
  the **sample shot plan** (act 1 beats h00-h06, clips c01/c02, 5 new visuals, 6 new icons).
- Spine: "Nobody has banned AI yet, but every piece is on the table" (true, sourced); narrator takes a side in act 5
  ("this is the part I hate"); ending = Crypto Wars won (PGP printed as a book, "source code is speech" 1996).
- NEXT (in order): 1) download clips (Altman Senate 16 May 2023 from judiciary.senate.gov ISVP stream, US gov PD; then
  CC talks in `.cc-src/aiban/cands.json`), transcribe, find "If this technology goes wrong, it can go quite wrong" and
  "I would form a new agency that licenses any effort above a certain scale of capabilities"; LICENCES.md rows.
  2) `videos/ai-ban/gen_script.py` (copy aibm's structure) for act 1 only, title "THE COMING AI BAN · 1-min sample".
  3) `engine/src/visuals/aiban.tsx` + icons in `ds/kit.tsx`, register in `Root.tsx`. 4) tts, build, stills, render,
  watch.py, send < 20 MB. Then wait for the owner's OK before the full film.
- BLOCKER in the cloud: the environment's network policy blocks huggingface.co (Whisper model), media.ccc.de,
  upload/commons.wikimedia.org, senate.gov + its akamaized stream host, archive.org, youtube, whitehouse.gov. The owner
  was told to set Network access to Full (or allow those hosts). Check first: `curl -s -o /dev/null -w '%{http_code}'
  https://media.ccc.de/`. Without it: no clips, no Whisper (tts.py and clip_words.py need it), so no sample.
- Cloud setup fix (this session): Remotion's browser download (remotion.media) is blocked, so `tools/*.mjs` pass
  `browserExecutable: process.env.REMOTION_BROWSER`; `cloud-setup.sh` sets it to the Playwright headless shell.
  Re-run `bash scripts/cloud-setup.sh` once the network is open (it stopped at the Whisper download, so
  `.cloud-env.sh` was never written).
- `.claude/settings.json` allows all tools (owner: "just allow everything by default"). PR
  quartzsaphir-debug/all-in-studio#1 carries this branch's work.

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

## AI black markets (owner topic 2026-10-08): 1:30 SAMPLE delivered 2026-10-09, full film NEXT
Owner: "the DARK REALITY of grey areas of AI and its practices in the black markets!", "dont make it too hard for the
newbies", "Do a fantastic job". Then (quota low): "only a sample", "only 1min30". Owner: NEVER wait for them, never ask.
Owner standing rule: hand mechanical work (clip search, licence checks, transcribing, file ops, render babysitting) to
Sonnet/Haiku subagents; keep script, creative choices and final review yourself.
- Slug `ai-black-markets`; script `videos/ai-black-markets/gen_script.py` (VO / SHOTS / CLIPS / ORDER), SOURCES.md,
  LICENCES.md, qa/cuts_all.jpg. Sample = 13 beats, 163 words, 3 clips, 1:33. Out: `videos/ai-black-markets/out/ai-black-markets_v3.mp4` (sent as `All-in_ai_black_markets_sample.mp4`, 5 MB). watch.py 0 FAIL.
- New visuals `engine/src/visuals/aibm.tsx`: CallGrid (video call, red scan marks fakes), PhoneCall (incoming call,
  waveform turns red + "ai voice"), ChatBox (refuses with ✕ / complies as redacted bars, never real content), Listing
  (black-market shop card, red price, buy click), Shop (grid of listing tiles). Log them in VISUALS.md when the film is built.
- New tool `tools/cc_cut.py <topic> <spec.json>`: cuts media.ccc.de excerpts and MEASURES the opus/mp3 → mp4 offset by
  envelope cross-correlation (all four talks here: 0.0 s). Spec: `videos/ai-black-markets/clips_spec.json`.
- Clips used: c01 hook `cc_nk_ai` (Simon Wijckmans, EMF 2026, CC BY-SA 4.0, "With AI these bad actors became way more
  powerful..."), c02 `cc_id_shops` (Hock & Bernhard 38C3, CC BY 4.0, "a shop of shops", slide matches), c03
  `cc_gai_voice` (Bunzel, GoD 2024, CC BY-SA 4.0, "only five to ten seconds of audio is needed"). Whisper dropped the
  punctuation on c03: restored by hand in its words.json.
- Talks found + licence-checked (all CC BY / BY-SA, in `.cc-src/aibm/cands.json`; transcripts `*.segments.txt` there for
  north-korean, aitm-panels, genai-in-the-battle, identity-theft): AiTM panels and sellers (WHY2025, phishing kits rented
  on Telegram, 250-300 €/month; speech is run-on, cut carefully), NEW IMPORTANT INSTRUCTIONS (37c3, prompt injection),
  Scaling up victim notification (WHY2025, infostealers), criminal view of phishing panels (Hacker Hotel 2025), "But this
  politician said xyz" (rc3, deepfakes), How LLMs work / can you hack them (Hacker Hotel 2025), Skynet Starter Kit (39c3,
  robot jailbreak). Other candidates not yet checked: Light in the Dark(net) 39c3, Ecstasy 10x yellow Twitter 34c3
  (darknet markets), Digital Rights & online gender-based violence (dgwk2025, deepfake abuse), Agentic ProbLLMs 39c3.
- Full film (8 min+, ~1,250 words, 16+ clips) next: extend the sample's acts (grey zone · the shop · stolen accounts ·
  crime chatbots · phishing kits as a subscription · deepfake calls · voice clones · fake job applicants / laptop farms
  · who profits · how to protect yourself), open loop by 0:35, recap montage, flip line. Facts already sourced:
  WormGPT (SlashNext 2023), Arup $25.6 M (HK police / CNN 2024), FBI IC3 2024 $16.6 B. Check the SlashNext post itself.
- Clean-up once the owner OKs: `.cc-src/aibm/` audio (~100 MB), `.render-tmp/ai-black-markets_*`.

## Commands
Always `PYTHONIOENCODING=utf-8`, `HF_HUB_OFFLINE=1` for Whisper. Patch with python scripts, not bash heredoc edits of
quotes. Renders in `.render-tmp/` (~6-8 min per 1,500-frame chunk at --concurrency=3; a full 11-min film ≈ 1.5 h).
A stale `transcribe_src.py` python process from 2026-10-08 23:30 may still be running; stop it if it is.
