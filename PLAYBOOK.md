# New-topic playbook · All-in

How a fresh session takes a new topic to the captchas level (3-min v6 and the 8-min captchas-full, both 2026-10) without
re-learning. Read this, then `design-system/DESIGN.md` (the rules), `LEARNINGS.md` (why), `VISUALS.md` (what exists).
Never read the source projects (jolly-bell, not-so-dark-times, SCRATCH HOLY) again: what mattered is in `design-system/`.

## The bar (what the owner approved)
- **Look**: v23's board (warm black, dot grid, corner marks, vignette) + the "minimal" kit (thin line art that draws on). Hand caption at the bottom, ≤ 5 words, one or two red keywords. Left/right split by default.
- **Pacing**: something new every 2–3 s. A beat (1–2 sentences) is cut into `cuts` that hard-cut on cue words. Voice pace lead 0.2 s, gap 0.45 s. Open on the thing everyone recognises, doing something, in frame 0.
- **Hooks**: cold open on a real, recognisable object (the captcha) with a 1-line question; an open loop by 0:35 ("by the end, you'll know who cashed in"); re-hook at each act ("books were only the beginning"); pay the loop off in the last act; end on a callback to the opening picture and one line that flips the premise.
- **Words on screen**: the narrator carries the information. Per shot: the caption + at most one or two words in the picture (a name pill, a tag, a label).
- **Hard rule**: never text as the picture (no lone number, "?", title card, centred big word). A number is a small red `tag` under its picture.
- **On topic**: say the line, point at the thing it names; if the picture does not contain it, change the picture.
- **TOP RULE (owner, 2026-10-08, "Never forget this never ever"): no clip may cost revenue.** Owner, verbatim: "i dont wanna get demonitized or lose the money to something else... this is ur job to make sure i don't". Only openly licensed clips: CC BY, CC BY-SA, CC0, public domain, government footage (Wikimedia Commons, media.ccc.de talks marked CC BY 4.0 in the file metadata, creators' own CC BY uploads). No news / explainer / TV excerpts at all (WSJ, Vox, Big Think, CNN, DW ...), not even short ones: a Content ID claim sends the video's revenue to them. No TED. No re-uploaded stock (Pexels/Pixabay clips get false claims). Animation is not a clip. Keep the clip density (one every 20-40 s, a real-clip hook first): density and zero risk are both required.
- **Many real clips (owner, 2026-10-08)**: the narrator alone gets tiring. A clip with its own voice every 20–40 s, the
  first one in the opening seconds (the hook: someone real reacting to the thing). Each clip 4–12 s, set up by the line
  before it and commented by the line after; never two clips back to back. Rules and risk table: `design-system/CLIPS.md`.
- **No music. No whooshes.** One-shot SFX only on visible clicks/stamps.

## Pipeline (commands from `All-in/`, always `PYTHONIOENCODING=utf-8`)
1. **Folder**: `videos/<slug>/` with `gen_script.py` (copy `videos/captchas-full/gen_script.py`: helpers `split/full/icon/row/cap4/pol/cal/bubble/flow/tag`).
2. **Script**: beats of 1–2 sentences, written to be heard. Spell numbers the way the voice should say them in `say`; keep `vo` readable. Every fact gets a row in `SOURCES.md` the same turn. 8-min ≈ 1,250 narrated words at Kokoro af_heart 0.95 (≈ 2.86 words/s + 0.65 s per beat).
3. **Clips + licences first**: find the clips while researching (they shape the script). Prefer CC clips of the real people
   (Commons conference talks, companies' own CC BY videos: `design-system/CLIPS.md` has the search recipe); **never news
   excerpts** (a claim takes the revenue: owner's top rule, see "The bar") and never TED/TEDx.
   Cut CC clips with `tools/cc_clips.py` (logs `_clips.json`), transcribe with faster-whisper to cut on sentence ends,
   and put a risk column for every clip in `LICENCES.md`. A clip beat is `{"id", "clip": {src, from, to, plate}}`;
   `build.py` places it, mutes nothing else and the plate names the source for 3 s. Photos only from Wikimedia Commons/Openverse with CC0/PD/CC BY/BY-SA, fetched with the Commons API so author + licence are logged (`engine/public/<topic>/_commons.json`), and listed in `videos/<slug>/LICENCES.md` with the description attribution block. A file with no recorded licence is not used. Check an inherited photo by pixel-comparing it with the Commons original.
4. **Voice**: `python tools/tts.py <slug>` (Kokoro, cached per line; only changed lines re-voice).
5. **Shots**: in `SHOTS`, one entry per beat. Cue words are words Whisper heard: numbers are digits ("819", "2011", "$6", "100"). Pick the word that names the thing.
6. **Build**: `python tools/build.py <slug>` runs two gates first: `lint_text.py` (no text-led shot, tags ≤ 24 chars, captions ≤ 6 words) and `lint_cues.py` (every cue word is spoken in its beat, cuts in spoken order, no empty board at a cut, left object from frame 0, right object within 2 s unless `reveal=True`). A third gate, `lint_clips.py`, fails any clip that cuts a word or ends off a sentence end (run `tools/clip_words.py <topic>` once after cutting clips). All must say 0 FAIL.
7. **Register** the timeline in `engine/src/Root.tsx`; new topic visuals go in `engine/src/visuals/<topic>.tsx`, built from `ds/` only. Typecheck: `cd engine && npx tsc --noEmit -p .`
8. **Stills review** (before any render): `node tools/cutstills.mjs <slug> 0.8` (one still per cut), then `python tools/sheet.py <slug> <first_beat> <last_beat>` per act. Review against `videos/captchas-3min/qa/cuts_all.jpg` (v6) and `research/v23/sheet_*.jpg`. Full-size checks: `node tools/frame.mjs <slug> <s,s>`.
9. **Render** in chunks: `node tools/render.mjs <slug> --concurrency=3` (resumable 1,500-frame chunks in `.render-tmp/`, ~2.5 min per chunk). Then `python tools/watch.py <slug>` (empty-frame FAILs) and one sampled sheet: `ffmpeg -i out/<slug>_vN.mp4 -vf "fps=1/12,scale=320:-1,tile=7x6" -frames:v 1 qa/sample.jpg`. Not a full re-watch.
10. **Send**: compress to < 20 MB for the thread if possible (ffmpeg crf 26–30, 1080p), keep the full-quality file in `out/`. Delete `.render-tmp/<slug>_*` after sending (disk C: is nearly full).
11. **Learn**: owner notes go verbatim into `design-system/LEARNINGS.md` the same turn; general rules move into `DESIGN.md` or `ds/` code and, where checkable, into a lint.

## QA gates (all must pass before the owner sees anything)
| Gate | How |
|---|---|
| No text-led shot | `lint_text.py` (automatic in build) |
| Word sync | `lint_cues.py` (automatic in build) |
| Every picture on topic | Stills sheet: read each caption, find the thing in its picture |
| No empty / all-black / clipped frame | Stills sheet + `tools/watch.py` on the render |
| Nothing repeated | List the pictures per act; no shot reused (a callback at the end is the one exception) |
| Re-created UI is true | Compare with real footage/screens of that UI before shipping |
| Licences | Every file in the board is in `LICENCES.md` with a risk rating; no TED, no music |
| Clip out-points | `lint_clips.py` (in build): read each clip's printed last words; a full sentence, one point, ≥ ~6 s |
| Voice | Every on-screen acronym is read aloud; no gap ≥ 0.5 s inside a line (`tts.py` caps them); no fragment chains |
| Clip rhythm | Print the narration gap between clips from the timeline: none over ~45 s |
| Facts | Every number on screen has a source line under it and a row in `SOURCES.md` |

## Gotchas
- Write patch scripts with the Write tool, run them with python (bash heredocs mangle backslashes and quotes on this PC).
- Renders use `All-in/.render-tmp/` (something wipes `%TEMP%\remotion-*`).
- `IconRow`/`LineIcon` names: see `IconName` in `engine/src/ds/kit.tsx` (39 drawings). Add a drawing there rather than a one-off SVG.
- Whisper spells the brand "recapture"; cue on another word.
