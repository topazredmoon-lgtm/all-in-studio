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
