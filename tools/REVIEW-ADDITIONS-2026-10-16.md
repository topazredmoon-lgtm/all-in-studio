# Review-stage additive tools (2026-10-16, mimo-v26-flash-free session)

Copied verbatim from `All-in-keep-reviews/2026-10-16-mimo-v26-flash-free/poc/`.
**Nothing here is wired into `qa.py` or `autonomous_worker.py`** — they are standalone CLI
tools, deliberately not hooked into the pipeline until the owner says the word.

| file | what it does | class |
|---|---|---|
| `tactile_pop_gate.py` | pixel-level Lesson #85 gate (flat dark-on-dark boxes, tiny labels, dim board). `calibrate` / `gate` / `--mp4` | QA, optional |
| `tactile_pop_thresholds.json` | thresholds calibrated on `All-in_captchas_full_v2.mp4` | data |
| `heal_loop.py` | closed loop: run gate -> reason code -> bounded repair -> re-check -> dead-letter. `--plan` / `--no-write` / `--allow-edits` / `--allow-audio` | orchestration, SAFE by default |
| `repo_gate_map.py` | repo-wide read-only gate baseline (writes `tools/results/repo_gate_map.json`) | reporting |
| `proof_sheet.py` | SOUL vs AMATEUR contact sheet with per-frame metrics + reason codes (writes `tools/results/proof_sheet.png`) | reporting |

```powershell
python tools\tactile_pop_gate.py <slug>            # gate one topic (reads qa/cuts)
python tools\tactile_pop_gate.py calibrate         # re-anchor thresholds on the soul
python tools\heal_loop.py <slug> --plan --no-write  # diagnose only, writes nothing
python tools\repo_gate_map.py                       # the 13/20 baseline
```

Safety: `heal_loop` never runs git, never kills a process, never leaves
`videos/<slug>`, `tools/_heal_memory.json`, `.render-tmp/` and its own report;
SOURCE edits (script.json) need `--allow-edits` and take a backup first; AUDIO
repairs (they regenerate every TTS take) need `--allow-audio`; a disk guard holds
any render under 8 GB free on `C:`.
