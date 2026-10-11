# HANDOVER · All-in · 2026-10-11 · "THE COMING AI BAN": 2-min SAMPLE delivered (owner notes on the 1-min learned) · NEXT: owner OK → full film
Older history: `HANDOVER_archive.md` (read only if needed). Token-lean: S is on Pro (keep a session under ~120k tokens;
grep and small scripts, never print whole transcripts or logs). Never read SCRATCH HOLY or other source projects.

## NOW (2026-10-11, later): ai-ban 2-min SAMPLE · built after the owner rejected the 1-min one
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
