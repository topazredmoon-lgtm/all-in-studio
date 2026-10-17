# New-topic playbook · All-in

How a fresh session takes a new topic to the studio benchmark (`captchas-3min` v6, `captchas-full` v3, `ai-power-bill` v2) without re-learning.
Read this, then `design-system/STYLE_BIBLE.md` (art direction), `design-system/DESIGN.md` (the rules), `design-system/PLATES.md` (woodcut engravings), `design-system/VISUALS.md` (what exists).
**Session start**: read `HANDOVER.md` and work on the active topic requested by the owner. Never build or send a topic the owner killed (`ai-black-markets` is dead).

## The bar (what the owner approved)
- **Critical viewer (LEARNINGS 74)**: write for the sceptic who pauses to fact-check. Sourced facts or clearly-labelled fears only; say which is which out loud; `stamp: {"t": "real"|"not yet", "at": cue}` on the picture; admit the strongest counter-fact; blame named people only for what they said.
- **Look**: v23's board (warm black, dot grid, corner marks, vignette) + two visual registers (`STYLE_BIBLE.md`):
  1. *Woodcut Engraving Plates* (`engine/src/ds/engrave.tsx`, `PLATES.md`): 3 weights (`CONTOUR` 4.6, `INNER` 2.8, `DETAIL` 1.5), directional hatching/stippling, silhouette cut in at frame 0 (`Plate` without `at`), motion/red accent on cue word.
  2. *Editorial Evidence & Motion Graphics* (`engine/src/ds/evidence.tsx` & `ds/kit.tsx`): re-set primary documents with highlighter sweeps, sourced charts, OS code terminals, and structured kit objects (`Loop`, `Copier`, `FieldCard`, `Flow`).
  **Left/right split is mandatory default (<= 45% of shots (max 2 splits in a row; >= 55% full/scene/clip))**: left = subject from frame 0, right = evidence landing on cue words within 2.0 s. Never a lone drawing centered in `full` layout on an empty board.
- **Pacing**: something new every 2–3 s. A beat (1–2 sentences) is cut into `cuts` that hard-cut on cue words. Voice pace lead 0.2 s, gap 0.45 s. Open on the thing everyone recognises, doing something, in frame 0.
- **Hooks**: cold open on a real, recognisable object (the captcha, the utility meter, the map) with a 1-line question; an open loop by 0:35 ("by the end, you'll know who cashed in"); re-hook at each act; pay the loop off in the last act; end on a callback to the opening picture and one line that flips the premise.
- **Words on screen**: the narrator carries the information. Per shot: the caption (≤ 6 words, 1–2 red keywords) + at most one or two words in the picture (a name pill, a tag, a label).
- **Hard rule**: never text as the picture (no lone number, "?", title card, centred big word). A number is a small red `tag` (≤ 24 chars) under its picture.
- **On topic**: say the line, point at the thing it names; if the picture does not contain it, change the picture. **Never reuse metaphor plates from another film** (`MODEL_COLLAPSE_PLATES` belong only to `why-ai-dumber`). New topics get bespoke topic visuals in `engine/src/visuals/<slug>.tsx`.
- **TOP RULE (owner, 2026-10-08, "Never forget this never ever"): no clip may cost revenue.** Only openly licensed clips: CC BY, CC BY-SA, CC0, public domain, US federal government footage (Wikimedia Commons, `media.ccc.de` talks marked CC BY 4.0 in metadata, `senate.gov` HLS webcasts). No news / explainer / TV excerpts at all (WSJ, Vox, Big Think, CNN, DW), no TED/TEDx, no re-uploaded stock. Keep clip density in full films (one every 20–40 s, a real-clip hook first): density and zero risk are both required. Rules and risk table: `design-system/CLIPS.md`.
- **No music. No whooshes.** One-shot procedural SFX (`tools/sfx.py`) only on visible physical clicks/stamps.

## Owner's taste (read before writing a single line)
- **Gripping, not informative.** Dramatic and hooking from the first second, yet friendly and pleasant to watch.
- **Stakes for the viewer ("So what?" test).** Every act says why this touches *you* (your money, your bill, your tools, your freedom, your voice).
- **The narrator has a side.** When something is being done to ordinary people, the narrator says so and says they hate it ("they'll do this to us"), after the facts have earned it, not in the cold open.
- **Explain like a friend.** Every hard word (jargon, acronym, law term) gets a plain one-line explanation with a picture the first time, then the story moves on.
- **Takeaways.** Every act lands one concrete surprise (a date, a precedent, a mechanism).
- **True beats loud.** Predictions are said as predictions; only sourced facts are said as facts.
- **Never a hearing as the hook; no vague "AI safety fear".** Open on what happens to the viewer, with the newest real events (2025–26), not 2023.
- **Sample first.** A new full video starts with a 1–2 min sample (the real opening, full quality) for the owner's OK.

## Pipeline (commands from `All-in/` or via `.\allin.ps1` from `All-in-keep\`)
1. **Folder**: `videos/<slug>/` with `gen_script.py` (or `gen_sample_1min.py` / `gen_sample_2min.py`).
2. **Script**: beats of 1–2 sentences, written to be heard. Whole declarative sentences at the end of beats (avoid short trailing qualifier fragments that cause TTS rising inflections). Every fact gets a row in `SOURCES.md` the same turn.
3. **Clips + licences first**: find CC/PD clips while researching (`design-system/CLIPS.md`). Cut with `tools/cc_cut.py` or `tools/win_cut.py`, run `python tools/clip_words.py <slug>`, and log every clip + photo with risk rating in `videos/<slug>/LICENCES.md`.
4. **Voice**:
   - **Chatterbox CUDA (Primary studio narrator)**: `python tools/tts_cb.py <slug>` (defaults to DeepMind Kore Female `ref_female_kore.wav`; pass `--voice captchas` or `--voice fenrir` as needed). Automatically levels voiced frames to `-20 dBFS` RMS and rejects declarative takes with rising pitch endings.
   - **Kokoro (Legacy / lightweight fallback)**: `python tools/tts.py <slug>`.
   - Run `python tools/voice_check.py <slug>` after every voice pass (must be `0 line(s) flagged`).
5. **Cue Discovery & Shots**:
   - Run `python tools/lint_cues.py <slug> --dump` (or `.\allin.ps1 cues <slug>`) to see the exact words and timestamps Whisper heard (`0.00s:word1  0.38s:word2`).
   - Cue words use exact spoken words or standard inflections; numbers use Whisper's digit form (`"2023"`, `"$200"`, `"15"`). Use `word#2` if a word appears twice in a beat.
   - Plate silhouettes cut in at frame 0 (`Plate` with no `at`); only internal motion/red accents wait for the cue word.
6. **Build**: `python tools/build.py <slug>` runs `lint_text.py`, `lint_cues.py`, and `lint_clips.py` (all must say `0 FAIL`), masters continuous narration without clip-silence pumping, and writes `timeline.json` + `master.wav`.
7. **Register & Typecheck**: Register the timeline and bespoke visuals (`engine/src/visuals/<slug>.tsx`) in `engine/src/Root.tsx`. Run `cd engine && npx tsc --noEmit -p .` (or `.\allin.ps1 check`).
8. **Stills review** (before any render): `node tools/cutstills.mjs <slug> 0.8` (one still per cut) and `python tools/sheet.py <slug> <first_beat> <last_beat>` per act. Full-size spot checks: `node tools/frame.mjs <slug> <s1,s2>`.
9. **Render**: `node tools/render.mjs <slug> --concurrency=3` (uses per-chunk content hashes in `.render-tmp/chunks_<slug>/` and cached Webpack bundle).
10. **Unified QA Audit**: `python tools/qa.py <slug>` (or `.\allin.ps1 qa <slug>`). Must pass **all 7 gates** (`lint_text`, `lint_cues`, `lint_clips`, `voice_check`, `render_sync`, `watch.py`, `listen.py`) and inspect `videos/<slug>/qa/watch.jpg` + `listen.png`.
11. **Send & Learn**: Compress to < 20 MB (`ffmpeg -crf 28 -c:a aac -b:a 48k`), keep full quality in `out/`. Log owner notes verbatim into `design-system/LEARNINGS.md` and update `HANDOVER.md`.
