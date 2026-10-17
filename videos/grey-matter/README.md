# Video Topic Template Boilerplate

This directory is the canonical starting template for every new video topic in the All-in studio.

## How to Scaffold a New Topic
1. Duplicate this `_template` folder to `videos/<topic-slug>/`.
2. Do **NOT** copy or import from past topic folders (e.g. `captchas`, `ai-ban`, `cnai`).
3. Fill out your topic research in `SOURCES.md` and clip clearances in `LICENCES.md`.
4. Edit `gen_script.py` with your narration beats, shots, and cue words.
5. Generate your script and assets:
   ```powershell
   python videos/<topic-slug>/gen_script.py
   python tools/tts.py <topic-slug>      # (or Chatterbox: tools/tts_cb.py)
   python tools/build.py <topic-slug>
   node tools/stills.mjs <topic-slug> 0.85
   ```
6. Register your timeline and any topic-specific visuals in `engine/src/Root.tsx`.
