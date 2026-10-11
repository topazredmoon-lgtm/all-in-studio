# All-in studio · rules for every session (local or cloud)

Explainer-video studio: topic → researched script → Kokoro voice → Remotion picture → upload-ready MP4.
Owner: S. Start every session by reading `HANDOVER.md`, then `PLAYBOOK.md`. Open `design-system/DESIGN.md`,
`CLIPS.md`, `VISUALS.md` and `LEARNINGS.md` only for the item you need. Cloud setup: `bash scripts/cloud-setup.sh`.

## MONEY RULE (owner's top rule: "Never forget this never ever")
- No clip may cost revenue. Only **CC BY / CC BY-SA / CC0 / public domain / US government** clips.
- Never news (WSJ, Vox, Big Think, …), never TED, never re-uploaded stock, never fair-use bets,
  never a YouTube clip without an explicit CC BY mark. Verify every licence at the source before use.
- Every clip used goes in `videos/<slug>/LICENCES.md` the same turn: source URL, in/out timestamps, licence,
  attribution, risk rating. Every fact gets a `SOURCES.md` row the same turn.

## What a video must be
- **Length**: at least 8 minutes for a full video (samples and Shorts are the exception the owner asks for).
- **Real clips**: a real clip with its own voice every 20–40 s; the **first one is a real-clip hook** in the
  opening seconds. Clips start and end on a sentence end, never mid-sentence.
- **Initials**: the narrator reads every acronym in full while it is on screen (CAPTCHA → "Completely Automated …").
- **Picture-led**: the picture carries the idea; text supports it. **No lone big text**: no centred word, number,
  "?" or title card on an empty screen. A number is a small red tag under its picture.
- **Left/right split** is the default layout: left = the subject (on screen from frame 0), right = the evidence,
  landing on its word. Something new on screen every 2–3 s.
- **No music bed.** No whooshes or drones. One-shot SFX only on visible clicks or stamps.
- Newbie-friendly: plain words, every term explained the first time with a picture.
- **Quality bar** = the captchas 3-minute **v6** cut (`videos/captchas-3min/out/All-in_captchas_3min_v6.mp4`).
  Nothing goes to the owner below it. QA gates in `PLAYBOOK.md` must all pass first.

## Owner's taste, learned (every session, local or cloud; full list: PLAYBOOK "Owner's taste", verbatim notes: LEARNINGS)
- **MUCH more dramatic and hooking than neutral.** Open on a real shock on screen, a twist, an open question. No calm set-up.
- **The "so what?" test**: every line touches the viewer's own stakes; a premise they don't care about is cut.
- **Every clip has a purpose** (reveal, confession, stakes), 6-12 s; the first clip is the strongest one.
- **Pro clip edits**: breathe in/out on the speaker's own room sound, never word-tight, never a freeze frame.
- **Human voice**: no spaced letters ("G P T"); names via the tts lexicon; even level and tune; no fragment chains.
- **Never a Senate/Congress hearing as the hook**, never the vague "AI safety fear" angle, never a stale (2023) event up
  front. Hook = a concrete, fresh (2025-26) thing that hits the viewer. Keep the owner's own script lines and punch.
- Narrator has a side; explain jargon like a friend; leave real takeaways; true facts only, predictions as "if".
- Every new owner note: verbatim into LEARNINGS.md the same turn, then into PLAYBOOK/DESIGN/code and here if it is a top rule.

## Token rules (S is on Pro)
- Keep a session under ~120k tokens of context. Write `HANDOVER.md` at milestones and before stopping.
- Read summaries, headings and grep hits, not big files; never print whole transcripts, logs or JSON.
- Check pictures with stills and contact sheets (`tools/stills.mjs`, `tools/sheet.py`), not by re-watching renders.
- Use Sonnet or Haiku subagents for mechanical work (sizing, grepping, transcribing, licence checks, batch edits);
  keep judgement (script, picture choices, owner notes) in the main session.

## Working habits
- Always `PYTHONIOENCODING=utf-8`; `HF_HUB_OFFLINE=1` for Whisper once its model is cached.
- Patch files with small Python scripts or the Edit tool, not bash heredoc edits of quoted text.
- Renders go in `.render-tmp/` (gitignored). A full 11-minute film is ~1.5 h on the owner's PC.
- Media lives in Git LFS. Raw source talks (`.cc-src/`) are not in git: re-download them with
  `bash scripts/redownload-sources.sh` (or the URLs in each `LICENCES.md`) before cutting new clips.
- Never commit secrets, API keys, `.env` files or the news clips removed under the money rule.
