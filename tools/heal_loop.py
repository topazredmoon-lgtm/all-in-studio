#!/usr/bin/env python3
"""
heal_loop.py — closed-loop, bounded, self-healing production loop for All-in.

WHY THIS EXISTS (defect found 2026-10-16 by mimo-v26-flash-free)
------------------------------------------------------------------
`tools/autonomous_worker.py::process_topic()` is fail-*fast*, not self-healing:
  * Steps 1-9 each `return False` on the first failing gate; only Step 0 ever heals.
  * Step 5 computes `m = re.search(r"cuts[(\\d]+)]... at = 'X' not spoken", out)` and
    then NEVER USES `m` — the cue-mismatch repair is literally a no-op.
  * Failures are truncated to `out[:400]` and dropped: no reason code, no record of
    what failed, no escalation, no dead-letter, no cross-topic memory.
  * `record_improvement()` only ever records successes, so the daemon learns nothing
    from a topic that keeps failing.
  * On Step-9 QA failure it deletes `.render-tmp` — destroying the evidence needed to
    diagnose why the render was bad.

WHAT THIS DOES
--------------
    run gate -> DIAGNOSE (regex -> reason code) -> pick REPAIR from the playbook
        -> re-run the gate (bounded rounds) -> ESCALATE if it keeps failing
        -> DEAD-LETTER with a machine-readable report the next harness can act on.

    Every event is appended to `videos/<slug>/_heal_log.jsonl`.
    Every repair outcome updates `tools/_heal_memory.json` (which repair worked for
    which reason code, globally, across topics).

SAFETY (multi-model house rules — see All-in-keep-reviews/claims/)
------------------------------------------------------------------
  * NEVER runs git, never kills a process, never writes outside `videos/<slug>`,
    `tools/_heal_memory.json`, `.render-tmp/`, and the report file.
  * Repairs are classified SAFE (default on) or SOURCE (they edit `script.json`;
    off unless you pass `--allow-edits`, and then a timestamped backup is taken).
  * A disk guard holds the loop instead of rendering when C: is under 8 GB.
  * Bounded: --max-rounds (default 3) repairs per step, then it dead-letters.

USAGE
    python tools/heal_loop.py <slug>                  # diagnose + SAFE repairs + re-run
    python tools/heal_loop.py <slug> --plan           # diagnose only, print the repair plan
    python tools/heal_loop.py <slug> --allow-edits    # also apply conservative SOURCE repairs
    python tools/heal_loop.py <slug> --only lint_cues # restrict to one gate
    python tools/heal_loop.py <slug> --json out.json  # full machine-readable result

Exit 0 = every step that ran is green, 1 = gates failed but the repairs are ready to
apply (rerun with --allow-edits), 2 = dead-lettered / held on the disk guard / cannot run.
"""
from __future__ import annotations

import argparse
import datetime as _dt
import json
import os
import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).resolve().parent


def _find_root() -> Path:
    for p in [HERE, *HERE.parents]:
        if (p / "videos" / "_template").is_dir() and (p / "tools").is_dir() and (p / "engine").is_dir():
            return p
    return Path(r"C:\Users\pc\Documents\All-in-keep\All-in")


ROOT = _find_root()
MEMORY_FILE = ROOT / "tools" / "_heal_memory.json"
DISK_MIN_GB = 8.0          # UPG-R11 disk guard
CUE_STRICT = 2             # repair rounds for cue re-anchoring before escalating

# --------------------------------------------------------------------------
# PIPELINE — ordered steps, each a gate that can fail and be repaired.
# `cmd` is argv; `{slug}` is substituted. `kind` decides what a failure means.
# --------------------------------------------------------------------------
PIPELINE = [
    {"id": "lint_text",   "cmd": [sys.executable, "tools/lint_text.py", "{slug}"],   "source": True,  "diagnostic": True},
    {"id": "taste_audit", "cmd": [sys.executable, "tools/taste_audit.py", "{slug}"], "source": True,  "diagnostic": True},
    {"id": "lint_cues",   "cmd": [sys.executable, "tools/lint_cues.py", "{slug}"],   "source": True,  "diagnostic": True},
    {"id": "voice_check", "cmd": [sys.executable, "tools/voice_check.py", "{slug}"], "source": True,  "diagnostic": True},
    {"id": "build",       "cmd": [sys.executable, "tools/build.py", "{slug}"],       "source": True},
    {"id": "cutstills",   "cmd": ["node", "tools/cutstills.mjs", "{slug}", "0.8"],   "source": False},
    {"id": "tactile_pop", "cmd": [sys.executable, "tools/tactile_pop_gate.py", "{slug}"], "source": True,
     "optional": True, "diagnostic": True},   # only present once the gate is installed in All-in/tools
    {"id": "qa_pre",      "cmd": [sys.executable, "tools/qa.py", "{slug}", "--skip-media"], "source": True},
    {"id": "render",      "cmd": ["node", "tools/render.mjs", "{slug}", "--concurrency=2"],
     "source": False, "needs_disk": True},
    {"id": "qa_media",    "cmd": [sys.executable, "tools/qa.py", "{slug}"], "source": True},
]

# --------------------------------------------------------------------------
# REASON CODES — regex -> diagnosis. Patterns are taken from the real messages
# the gates print (see design-system/LEARNINGS.md #30, #33, #42, #49, #62-64,
# #76, #84 and tools/*.py print sites).
# --------------------------------------------------------------------------
RULES = [
    # ---- cues / word sync (real formats captured 2026-10-16 from tools/lint_cues.py) ----
    dict(code="HEAL-TTS-WORDS-MISSING", gate="lint_cues",
         rx=r"no words\.json \(run ([^)]+)\)",
         repair="regen_words_json", kind="AUDIO",
         hint="Per-beat word timings are absent, so word-sync cannot be verified at all. "
              "The gate names the exact command. Re-voicing regenerates every take, so it "
              "is gated behind --allow-audio (LEARNINGS #49/#77: the narrator's speed IS the "
              "channel's sound signature — never time-stretch existing WAVs to fake timings)."),
    dict(code="HEAL-CUE-NOT-SPOKEN", gate="lint_cues/build",
         rx=r"(\S+) = '([^']+)' not spoken\.?\s*Heard:\s*(.+)",
         repair="recue_to_heard", kind="SOURCE",
         hint="Cue word never spoken in its beat. Re-anchor to the exact Whisper form "
              "(digits, $ signs, grey/gray) — LEARNINGS #30/#49."),
    dict(code="HEAL-CUE-EMPTY-BOARD", gate="lint_cues",
         rx=r"opens on an empty board \(every object waits for a word\)",
         repair="draw_left_at_frame_0", kind="SOURCE",
         hint="Cut opens empty because every object waits for a word (LEARNINGS #33). "
              "Draw at least one object at frame 0; only marks land on the word."),
    dict(code="HEAL-CUE-DELAYED-REVEAL", gate="lint_cues",
         rx=r"right object waits ([\d.]+) s for '([^']+)' \(max 2 s",
         repair="advance_early_reveals", kind="SOURCE",
         hint="Right panel sits empty > 2s waiting for its word (LEARNINGS #33). Move the "
              "reveal earlier or set reveal=True."),
    dict(code="HEAL-CUE-OUT-OF-ORDER", gate="lint_cues",
         rx=r"cuts?\[\d+\][^\n]*out of (order|sequence)|not in spoken order",
         repair="resequence_cues", kind="SOURCE",
         hint="Cuts fire out of spoken order. Move the cue onto a later word of the same beat."),
    dict(code="HEAL-CUE-TOO-SHORT", gate="lint_cues",
         rx=r"(?:cut|segment)[^\n]*under 0\.9s|too short[^.]*0\.9",
         repair="plan_split_shot", kind="SOURCE",
         hint="A cut runs under 0.9s (LEARNINGS #30). Split or merge the shot."),

    # ---- text / visual framing (real formats from tools/lint_text.py) ----
    dict(code="HEAL-TEXT-ICON-FACEOFF", gate="lint_text",
         rx=r"both sides of split are bare LineIcons",
         repair="pair_icon_with_photo", kind="SOURCE",
         hint="Bare LineIcons on both sides of a split — 'random stray icon slop' (owner "
              "2026-10-15). Pair with a real photo, UI widget, Bubble or PageQuote."),
    dict(code="HEAL-TEXT-BANNED", gate="lint_text",
         rx=r"banned [\w ]*? '([^']+)'\s*\(",
         repair="map_banned_component", kind="SOURCE",
         hint="A component on the permanent ban list / retired kit (LEARNINGS #79, e.g. "
              "boxy cards, woodcut engraving plates, ds/evidence.tsx). Map it onto the "
              "captchas_full_v2 tactile kit + real photos/UI."),
    dict(code="HEAL-TEXT-PAGEQUOTE-LONE", gate="lint_text",
         rx=r"PageQuote alone in 'full' layout",
         repair="pair_pagequote_with_picture", kind="SOURCE",
         hint="A quote is doing the whole picture by itself. Pair it with a real photo in "
              "a split, or give it a physical document to sit on (LEARNINGS #79/#81)."),
    dict(code="HEAL-TEXT-LONE", gate="lint_text",
         rx=r"(?:lone|cent(?:er|re)ed)[^\n]*(?:text|number|word)|big text on an empty screen",
         repair="replace_lone_text_with_picture", kind="SOURCE",
         hint="Text is the picture (LEARNINGS #26): rebuild around a picture, demote the number to a tag."),
    dict(code="HEAL-TEXT-DENSITY", gate="lint_text",
         rx=r"(?:too many|over)\s+(\d+)\s+words|word(?: ceiling| limit|s)[^\n]*exceed",
         repair="trim_props_to_ceiling", kind="SOURCE",
         hint="On-screen word ceiling exceeded (LEARNINGS #20/#84): trim props to <= 12 words."),
    dict(code="HEAL-TEXT-WHO-WHAT", gate="lint_text",
         rx=r"narration mentions real-world WHO/WHAT \('([^']+)'",
         repair="attach_real_evidence", kind="SOURCE",
         hint="A real person/place/event is named but the picture uses generic icons "
              "(LEARNINGS #81). Show WHO with a real Commons photo and WHAT with real UI."),

    # ---- taste / cadence (real formats from tools/taste_audit.py + lint_text.py) ----
    dict(code="HEAL-TASTE-CONSEC-SPLIT", gate="taste_audit/lint_text",
         rx=r"(\d+) consecutive 'split' cuts in a row",
         repair="alternate_split_layouts", kind="SOURCE",
         hint="Max 1 split in a row (LEARNINGS #80/#84). Convert alternating splits into a "
              "full/scene hero."),
    dict(code="HEAL-TASTE-VISUAL-REPEAT", gate="taste_audit",
         rx=r"Visual repeat! Cut uses same visual signature \(([^)]+)\)",
         repair="vary_visual_signature", kind="SOURCE",
         hint="Same visual signature twice in a row (LEARNINGS #84). Swap one mechanism."),
    dict(code="HEAL-TASTE-WORD-CEILING", gate="taste_audit",
         rx=r"On-screen word ceiling exceeded! Found (\d+) words",
         repair="trim_props_to_ceiling", kind="SOURCE",
         hint="Word ceiling > 12 (LEARNINGS #84)."),
    dict(code="HEAL-TASTE-LINEICON-FACEOFF", gate="taste_audit",
         rx=r"Banned LineIcon faceoff",
         repair="pair_icon_with_photo", kind="SOURCE",
         hint="L: LineIcon + R: LineIcon is permanently banned (LEARNINGS #79)."),
    dict(code="HEAL-TASTE-BANNED-BOX", gate="taste_audit",
         rx=r"Banned text-box component '([^']+)'|amateur programmer-art component '([^']+)'",
         repair="map_banned_component", kind="SOURCE",
         hint="Fake text box / amateur component (LEARNINGS #85)."),
    dict(code="HEAL-TASTE-CADENCE", gate="taste_audit",
         rx=r"Layout rhythm failed! Full/Scene/Clip is ([\d.]+)%",
         repair="convert_splits_to_full", kind="SOURCE",
         hint="full/scene/clip below 60% (LEARNINGS #84)."),
    dict(code="HEAL-TASTE-STATIC-CUT", gate="taste_audit",
         rx=r"Static cut warning",
         repair="add_animated_cue", kind="SOURCE",
         hint="Cut has no animated cue — a frozen slide (LEARNINGS #84 motion liveness)."),
    dict(code="HEAL-TASTE-MARGIN", gate="taste_audit",
         rx=r"High edge density \([\d.]+%\) in safe margin",
         repair="widen_safe_margin", kind="SOURCE",
         hint="Content inside the 80px safe margin — check for clipped text."),

    # ---- voice -------------------------------------------------------------
    dict(code="HEAL-VOICE-RISING", gate="voice_check",
         rx=r"(?:rising|unnatural|lilt|question)[^\n]*(?:ending|end)|ends? (?:up )?rising",
         repair="rewrite_line_to_declarative", kind="SOURCE",
         hint="Line ends on a rising qualifier (LEARNINGS #49/#76). End it on a plain declarative word."),
    dict(code="HEAL-VOICE-LEVEL", gate="voice_check",
         rx=r"(?:level|loudness)[^\n]{0,60}(?:outlier|differs|varies)",
         repair="relevel_and_revoice", kind="SOURCE",
         hint="One line's level stands out (LEARNINGS #63). Re-run tts.py levelling."),
    dict(code="HEAL-VOICE-RATE", gate="voice_check",
         rx=r"^(\S+)\s+\d+\s+\d+\s+-?[\d.]+\s+([\d.]+)\s+[+-]?\d+%  ! rate",
         repair="revoice_slow_line", kind="SOURCE",
         hint="A line's words-per-second is outside the human range — LEARNINGS #76: the \"how\" "
              "voice-check fails on slow, over-deliberate delivery. Re-voice that beat, do not "
              "speed the WAV (the narrator's speed is the channel's sound signature)."),
    dict(code="HEAL-VOICE-PITCH", gate="voice_check",
         rx=r"^(\S+)\s+\d+\s+(\d+)\s+-?[\d.]+\s+[\d.]+\s+[+-]?\d+%  ! f0",
         repair="revoice_pitch_outlier", kind="SOURCE",
         hint="One line's f0 stands out — LEARNINGS #63/#64: same narrator, different voice. "
              "Re-voice the beat instead of pitch-shifting the take."),
    dict(code="HEAL-VOICE-MISSING-AUDIO", gate="voice_check",
         rx=r"Missing voiced audio/words for beat\(s\): (.+)",
         repair="revoice_missing_beats", kind="SOURCE",
         hint="Beats have no audio — TTS never produced them (LEARNINGS #77). Re-run tts.py."),
    dict(code="HEAL-VOICE-ACRONYM", gate="voice_check/lint_text",
         rx=r"spelled (?:out|letter)|read(?:ing)? each letter|G P T|U S\b",
         repair="fix_pronunciation_lexicon", kind="SOURCE",
         hint="Initialism spelled letter-by-letter (LEARNINGS #62). Route through the IPA lexicon."),

    # ---- build / clips ------------------------------------------------------
    dict(code="HEAL-CLIP-WORDS-MISSING", gate="lint_clips",
         rx=r"no (\S+\.words\.json) \(run: ([^)]+)\)",
         repair="regen_clip_words", kind="SAFE",
         hint="Clip word timings are absent; the gate itself tells us the command. "
              "Run tools/clip_words.py so lint_clips can verify in/out points (LEARNINGS #42)."),
    dict(code="HEAL-BUILD-CLIP-MISSING", gate="build/lint_clips",
         rx=r"(?:clip|source) (?:file )?(?:is )?missing|no such file.*\.(?:mp4|mkv|webm)",
         repair="fetch_or_swap_clip", kind="SOURCE",
         hint="A clip source is absent. Re-fetch it under the money rule or swap it."),
    dict(code="HEAL-BUILD-CLIP-CUT", gate="lint_clips",
         rx=r"(?:cuts?|clip)[^\n]{0,60}(?:mid[- ]word|last word|sentence end)|fade over the last word",
         repair="retrim_clip_to_words", kind="SOURCE",
         hint="Clip in/out point chops a word (LEARNINGS #42). Out = last word end + 0.15-0.4s."),
    dict(code="HEAL-BUILD-TIMEOUT", gate="build",
         rx=r"(?:timed out|timeout|took too long)",
         repair="rerun_with_more_time", kind="SAFE",
         hint="Step timed out — retry with a longer budget before suspecting the source."),

    # ---- media / render -----------------------------------------------------
    dict(code="HEAL-QA-STale", gate="qa",
         rx=r"was rendered from hash (\w+), but current source/audio hash is (\w+)",
         repair="rerender", kind="SAFE",
         hint="MP4 is stale vs the current source (render_sync). Re-run render.mjs."),
    dict(code="HEAL-QA-EMPTY-SCREEN", gate="qa",
         rx=r"(?:empty|near-empty) screen|no content on screen",
         repair="advance_early_reveals", kind="SOURCE",
         hint="watch.py found empty screens — objects all wait for their word (LEARNINGS #33)."),
    dict(code="HEAL-QA-LOUDNESS", gate="qa",
         rx=r"(?:integrated|I) (?:loudness|=) ?(-?[\d.]+) ?LUFS|true peak|exceeds",
         repair="reloudnorm", kind="SAFE",
         hint="EBU R128 out of range (UPG-R1). Two-pass loudnorm to -16..-13 LUFS, TP <= -1."),
    dict(code="HEAL-QA-WER", gate="qa",
         rx=r"\bWER\b[ =:]*(0?\.\d+|\d+%)",
         repair="revoice_offending_beats", kind="SOURCE",
         hint="Whisper hears words the script does not (dropped/mispronounced beats)."),
    dict(code="HEAL-QA-CLIPPING", gate="qa",
         rx=r"clipping|true peak.*(?:clip|exceed)",
         repair="reloudnorm", kind="SAFE",
         hint="Audio clips. Re-normalise with a true-peak ceiling of -1 dBTP."),

    # ---- tactile pop (new visual gate) -------------------------------------
    dict(code="HEAL-TP-FLAT-DARK-BOX", gate="tactile_pop",
         rx=r"TP2_FLAT_DARK_BOX",
         repair="swap_dark_box_for_tactile_card", kind="SOURCE",
         hint="Flat #161411 dark-on-dark box on the board (Lesson #85 root cause 1). "
              "Replace with a #FFFFFF / #F6F2E8 physical card from ds/tactile.tsx."),
    dict(code="HEAL-TP-TINY-LABELS", gate="tactile_pop",
         rx=r"TP4_TINY_LABELS",
         repair="collapse_to_one_focal_statement", kind="SOURCE",
         hint="Light mass lives in thin tiny labels (Lesson #85 root cause 2). One 36-64px "
              "focal statement + soft skeleton lines."),
    dict(code="HEAL-TP-DIM-BOARD", gate="tactile_pop",
         rx=r"TP3_DIM_BOARD",
         repair="raise_focal_contrast", kind="SOURCE",
         hint="Nothing on the board pops: the brightest object is not a physical surface."),
    dict(code="HEAL-TP-NO-HERO-MASS", gate="tactile_pop",
         rx=r"TP1_NO_HERO_MASS|TP5_EMPTY_BOARD",
         repair="add_physical_object", kind="SOURCE",
         hint="No high-contrast object carries the board. Give one object mass: a white card, "
              "paper slip, or real archival photo."),

    # ---- infrastructure -----------------------------------------------------
    dict(code="HEAL-DISK-LOW", gate="any",
         rx=r"no space left|disk (?:full|space)|ENOSPC",
         repair="hold_for_disk", kind="SAFE",
         hint="Disk full — UPG-R11 disk guard. Clean .render-tmp or move work to E:."),
    dict(code="HEAL-NETWORK", gate="any",
         rx=r"(?:429|503|rate limit|temporary failure|could not resolve|connection reset|timed out contacting)",
         repair="retry_with_backoff", kind="SAFE",
         hint="Transient network failure. Exponential backoff with jitter, never a hard fail."),
    dict(code="HEAL-MISSING-TOOL", gate="any",
         rx=r"(?:The term|python|node|ffmpeg)[^\n]{0,40}not recognized|ModuleNotFoundError|ImportError",
         repair="report_missing_dependency", kind="SAFE",
         hint="A dependency is absent. Install it on E: (never bloat C:)."),
]

# --------------------------------------------------------------------------
# REPAIR PLAYBOOK — id -> (kind, description, executor)
# kind SAFE    : runs by default
# kind SOURCE  : edits script.json; only with --allow-edits (+ backup)
# --------------------------------------------------------------------------
REPAIRS = {
    "rerun_with_more_time":      ("SAFE", "re-run the step with a longer timeout"),
    "rerender":                  ("SAFE", "re-run node tools/render.mjs (stale stamp)"),
    "reloudnorm":                ("SAFE", "2-pass ffmpeg loudnorm to -16..-13 LUFS, TP <= -1 dBTP"),
    "retry_with_backoff":        ("SAFE", "exponential backoff with jitter, then re-run the step"),
    "hold_for_disk":             ("SAFE", "hold the loop; free .render-tmp / move TEMP to E:"),
    "report_missing_dependency": ("SAFE", "report the missing module/binary; install on E:"),
    "rerun_stills":              ("SAFE", "re-run node tools/cutstills.mjs"),
    "clean_render_tmp":          ("SAFE", "delete .render-tmp/<slug>_* only"),
    "regen_clip_words":          ("SAFE", "run tools/clip_words.py <slug> to write <clip>.words.json"),
    "regen_words_json":          ("AUDIO", "re-run tools/tts.py <slug> so every beat has word timings"),

    "recue_to_heard":                ("SOURCE", "rewrite cut.at to the exact Whisper 'Heard:' form"),
    "resequence_cues":               ("SOURCE", "move cues onto later words so they fire in spoken order"),
    "plan_split_shot":               ("SOURCE", "merge/split the sub-0.9s cut"),
    "advance_early_reveals":         ("SOURCE", "draw left objects at frame 0; right reveals <= 2s"),
    "draw_left_at_frame_0":          ("SOURCE", "give the cut one object at frame 0 so it never opens empty"),
    "replace_lone_text_with_picture": ("SOURCE", "rebuild the cut around a picture; demote text to a tag"),
    "map_banned_component":          ("SOURCE", "map the banned component onto the tactile kit"),
    "trim_props_to_ceiling":         ("SOURCE", "trim props to <= 12 on-screen words"),
    "attach_real_evidence":          ("SOURCE", "attach a real Commons photo / real UI for the named WHO/WHAT"),
    "pair_pagequote_with_picture":   ("SOURCE", "pair the lone PageQuote with a real photo in a split layout"),
    "alternate_split_layouts":       ("SOURCE", "convert an alternating split into a full/scene hero"),
    "vary_visual_signature":         ("SOURCE", "swap one of the two repeated visual mechanisms"),
    "pair_icon_with_photo":          ("SOURCE", "replace one LineIcon with a real photo or UI widget"),
    "convert_splits_to_full":        ("SOURCE", "raise full/scene/clip above 60% of cuts"),
    "add_animated_cue":              ("SOURCE", "give the static cut a cue-driven animation"),
    "widen_safe_margin":             ("SOURCE", "pull content out of the 80px safe margin"),
    "rewrite_line_to_declarative":   ("SOURCE", "end the line on a plain declarative word"),
    "relevel_and_revoice":           ("SOURCE", "re-run tts.py so every line matches speech loudness"),
    "revoice_slow_line":             ("SOURCE", "re-voice the beat whose w/s is outside the human range (LEARNINGS #76)"),
    "revoice_pitch_outlier":         ("SOURCE", "re-voice the beat whose f0 stands out; never pitch-shift the take"),
    "revoice_missing_beats":         ("SOURCE", "re-run tts.py for the beats with no audio"),
    "fix_pronunciation_lexicon":     ("SOURCE", "route the initialism through the IPA lexicon in tts.py"),
    "fetch_or_swap_clip":            ("SOURCE", "re-fetch the clip (money rule) or swap it"),
    "retrim_clip_to_words":          ("SOURCE", "out-point = last word end + 0.15..0.4s in the energy dip"),
    "revoice_offending_beats":       ("SOURCE", "re-voice the beats Whisper mis-hears"),
    "swap_dark_box_for_tactile_card": ("SOURCE", "replace the dark box with a #FFFFFF/#F6F2E8 tactile card"),
    "collapse_to_one_focal_statement": ("SOURCE", "one 36-64px focal statement + skeleton lines"),
    "raise_focal_contrast":          ("SOURCE", "raise the focal object near-white so it pops"),
    "add_physical_object":          ("SOURCE", "put a white card / paper slip / real photo on the board"),
}

ESCALATION = ["repair", "repair", "dead-letter"]   # per step, then give up

# compile once (case-insensitive: gate wording drifts between tool versions)
for _r in RULES:
    _r["rx"] = re.compile(_r["rx"], re.IGNORECASE | re.MULTILINE)


# ==========================================================================
# helpers
# ==========================================================================
def log_line(slug: str, event: dict) -> None:
    d = ROOT / "videos" / slug
    d.mkdir(parents=True, exist_ok=True)
    event = {"ts": _dt.datetime.now().isoformat(timespec="seconds"), **event}
    with open(d / "_heal_log.jsonl", "a", encoding="utf-8") as fh:
        fh.write(json.dumps(event, ensure_ascii=False) + "\n")


def load_memory() -> dict:
    try:
        return json.loads(MEMORY_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {"version": 1, "repairs": {}}


def save_memory(mem: dict) -> None:
    try:
        MEMORY_FILE.write_text(json.dumps(mem, indent=2, ensure_ascii=False), encoding="utf-8")
    except Exception as e:
        print(f"  ! could not write memory: {e}")


def remember(repair: str, code: str, outcome: str) -> None:
    mem = load_memory()
    r = mem.setdefault("repairs", {}).setdefault(repair, {})
    c = r.setdefault(code, {"ok": 0, "fail": 0, "last": None})
    c["ok" if outcome in ("ok", "fixed") else "fail"] += 1
    c["last"] = _dt.datetime.now().isoformat(timespec="seconds")
    save_memory(mem)


def disk_free_gb() -> float:
    try:
        return shutil.disk_usage("C:/").free / (1024 ** 3)
    except Exception:
        return 99.0


def _fail_lines(out: str) -> list[str]:
    """Only explicit `FAIL [gate]` lines count as gate failures.

    Every studio gate ends with a summary such as
    `lint_text captchas-3min: 0 FAIL, 0 WARN (PASS)` — so testing for the bare
    substring "FAIL" would report a perfectly clean gate as broken.
    """
    return [ln for ln in (out or "").splitlines() if ln.strip().startswith("FAIL [")]


def _step_failed(rc: int, out: str) -> bool:
    return rc != 0 or bool(_fail_lines(out))


def _step_tool_exists(step: dict) -> bool:
    """True when the gate script a step points at is actually installed."""
    for a in step["cmd"]:
        if a.endswith((".py", ".mjs", ".js")) and a != "node":
            return (ROOT / a).exists()
    return True


def run_cmd(argv, cwd=ROOT, timeout=900, env_extra=None) -> tuple[int, str]:
    env = dict(os.environ, PYTHONIOENCODING="utf-8")
    if env_extra:
        env.update(env_extra)
    argv = [str(a).replace("{slug}", cwd.name) if isinstance(a, str) else a for a in argv]
    try:
        p = subprocess.run(argv, cwd=str(cwd), capture_output=True, text=True,
                           encoding="utf-8", errors="replace", env=env, timeout=timeout)
        return p.returncode, ((p.stdout or "") + (p.stderr or "")).strip()
    except subprocess.TimeoutExpired as e:
        return 124, f"timed out after {timeout}s: {e}"
    except FileNotFoundError as e:
        return 127, f"missing tool: {e}"
    except Exception as e:  # pragma: no cover
        return 1, f"{type(e).__name__}: {e}"


# ==========================================================================
# diagnose
# ==========================================================================
def diagnose(output: str, gate: str) -> list[dict]:
    """Map raw gate output onto reason codes. Returns a de-duplicated list, each with
    the specific line of output that proved it (not just the first FAIL line).

    Only `FAIL [..]` lines are considered when the gate emits them; otherwise the whole
    output is scanned (a gate can fail with a bare traceback). This keeps tool legends
    and PASS summaries from being misread as failures."""
    lines = [ln.strip() for ln in (output or "").splitlines() if ln.strip()]
    fail_lines = [ln for ln in lines if ln.startswith("FAIL [")]
    # voice_check.py is the one gate that signals via `!` table markers rather than a
    # `FAIL [voice_check]` line (tools/voice_check.py:127 exits 1 on "N line(s) flagged"),
    # so fall back to those marker rows when nothing printed FAIL.
    bang_lines = [ln for ln in lines if "! " in ln and not ln.startswith("!")]
    scope_lines = fail_lines or bang_lines or lines
    scope = "\n".join(scope_lines)
    found, seen = [], set()
    for rule in RULES:
        m = rule["rx"].search(scope)
        if not m or rule["code"] in seen:
            continue
        seen.add(rule["code"])
        evidence = next((ln for ln in scope_lines if rule["rx"].search(ln)), "")
        if not evidence:
            evidence = (m.group(0) or "")[:240]
        found.append({
            "code": rule["code"], "matched_gate": gate, "declared_gate": rule["gate"],
            "repair": rule["repair"], "kind": rule["kind"],
            "hint": rule["hint"], "evidence": evidence[:260],
        })
    if not found:
        found.append({
            "code": "HEAL-UNKNOWN", "matched_gate": gate, "declared_gate": "any",
            "repair": "report_missing_dependency" if re.search(
                r"ModuleNotFoundError|ImportError|not recognized|missing tool", output or "")
                      else "rerun_with_more_time",
            "kind": "SAFE",
            "hint": "No rule matched. Raw output kept for a human/next model to classify.",
            "evidence": (fail_lines[0] if fail_lines else (lines[0] if lines else ""))[:260],
        })
    return found


# ==========================================================================
# repairs (executors)
# ==========================================================================
def repair_recue_to_heard(slug: str, finding: dict, allow_edits: bool,
                          dry_run: bool = False) -> tuple[str, str]:
    """Rewrite cut cue -> the exact Whisper form the gate heard (LEARNINGS #30/#49).

    Handles both `cuts[3].at = '2023' not spoken. Heard: ...` and
    `a02.hero.enter = 'Once' not spoken. Heard: You(0.0s) handed(0.1s) ...`.
    Conservative: only rewrites when the heard list shares an exact or prefix form;
    otherwise it plans rather than guessing.
    """
    ev = finding.get("evidence", "")
    m = re.search(r"(\S+) = '([^']+)' not spoken\.?\s*Heard:\s*(.+)", ev)
    if not m:
        return "failed", f"could not parse the cue failure: {ev[:120]}"
    path, old, heard_line = m.group(1), m.group(2), m.group(3)
    heard_words = re.findall(r"[\w$%.'-]+", re.sub(r"\([^)]*\)", " ", heard_line))

    cand = next((w for w in heard_words if w.lower() == old.lower()), None)
    if cand is None:
        cand = next((w for w in heard_words
                     if w.lower().startswith(old.lower()) or old.lower().startswith(w.lower())), None)

    if dry_run or not allow_edits:
        if cand:
            return "planned", f"{path}: cue '{old}' -> '{cand}' (exact Whisper form)"
        return "planned", (f"{path}: cue '{old}' has no prefix match among "
                           f"{heard_words[:6]} — needs a human/LLM pick")
    if cand is None:
        return "planned", f"heard forms {heard_words[:8]} share no prefix with '{old}' — needs a human/LLM pick"

    sfile = ROOT / "videos" / slug / "script.json"
    try:
        data = json.loads(sfile.read_text(encoding="utf-8"))
    except Exception as e:
        return "failed", f"cannot read script.json: {e}"

    changed = 0
    for b in data.get("beats", []):
        shot = b.get("shot", {})
        cuts = shot.get("cuts") if isinstance(shot, dict) else None
        targets = cuts if cuts else ([shot] if isinstance(shot, dict) else [])
        for c in targets:
            if not isinstance(c, dict):
                continue
            for node in (c, c.get("L"), c.get("R"), c.get("hero") or c.get("visual")):
                if isinstance(node, dict) and node.get("at") == old:
                    node["at"] = cand
                    changed += 1
    if not changed:
        return "failed", f"cue '{old}' not found in script.json (path {path})"
    bak = ROOT / "videos" / slug / "_heal_backup"
    bak.mkdir(exist_ok=True)
    (bak / f"script.{_dt.datetime.now():%Y%m%d-%H%M%S}.json").write_text(
        json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    sfile.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return "fixed", f"rewrote {changed} cue(s) '{old}' -> '{cand}' (backup in videos/{slug}/_heal_backup/)"


def repair_regen_clip_words(slug: str, finding: dict, allow_edits: bool,
                            dry_run: bool = False) -> tuple[str, str]:
    """SAFE: run the exact command the lint_clips message tells us to run."""
    ev = finding.get("evidence", "")
    m = re.search(r"\(run:\s*([^)]+)\)", ev)
    cmd = m.group(1).split() if m else [sys.executable, "tools/clip_words.py", slug]
    if cmd and cmd[0].lower() == "python":
        cmd[0] = sys.executable
    shown = " ".join(Path(c).name if i == 0 else c for i, c in enumerate(cmd))
    if dry_run:
        return "planned", f"would run: {shown}"
    rc, out = run_cmd(cmd, timeout=1800)
    tail = (out or "").strip().splitlines()[-1][:160] if out else ""
    return ("fixed" if rc == 0 else "failed"), f"{shown} rc={rc} {tail}"


def repair_regen_words_json(slug: str, finding: dict, allow_edits: bool,
                            dry_run: bool = False) -> tuple[str, str]:
    """AUDIO: regenerate per-beat word timings by re-running the TTS the gate names.

    The gate message looks like `no words.json (run tools/tts.py or tools/tts_cb.py)`;
    the first command is the canonical one. This regenerates every take, so it only
    ever runs with --allow-audio: the narrator's pacing IS the channel signature.
    """
    ev = finding.get("evidence", "")
    m = re.search(r"\(run\s+([^)]+)\)", ev)
    cmd = (m.group(1).split(" or ")[0].split() if m
           else [sys.executable, "tools/tts.py", slug])
    # the message is `no words.json (run tools/tts.py or tools/tts_cb.py)` — note there is
    # no colon, unlike lint_clips' `(run: python tools/clip_words.py <slug>)`, so the word
    # "run" is part of the capture and must be dropped.
    while cmd and cmd[0].lower() in ("run", "run:", "then"):
        cmd = cmd[1:]
    prog = Path(cmd[0]).name.lower() if cmd else ""
    if prog.startswith("python"):
        cmd = [sys.executable] + cmd[1:]
    elif prog.startswith("node"):
        pass                                   # keep node as-is
    else:
        # the captured command had no interpreter (it was `run tools/tts.py`) — add ours
        cmd = [sys.executable] + cmd
    if len(cmd) == 2 and cmd[1].endswith((".py", ".mjs")):
        cmd.append(slug)          # `python tools/tts.py` with no topic given
    shown = " ".join(Path(c).name if i == 0 else c for i, c in enumerate(cmd))
    if dry_run:
        return "planned", (f"would run: {shown}  (regenerates every TTS take for "
                           f"{slug} — that is why it needs --allow-audio)")
    rc, out = run_cmd(cmd, timeout=2400)
    tail = (out or "").strip().splitlines()[-1][:160] if out else ""
    return ("fixed" if rc == 0 else "failed"), f"{shown} rc={rc} {tail}"


REPAIR_EXECUTORS = {
    "recue_to_heard": repair_recue_to_heard,
    "regen_clip_words": repair_regen_clip_words,
    "regen_words_json": repair_regen_words_json,
}


def apply_repair(slug: str, finding: dict, allow_edits: bool, plan_only: bool,
                 allow_audio: bool = False) -> tuple[str, str]:
    """Select and run one repair.

    SOURCE repairs still get *invoked* in dry-run mode when --allow-edits was not
    passed, because a plan that names the exact cue and the exact replacement word is
    worth far more to the next harness (or the owner) than a generic description.
    AUDIO repairs (they regenerate every TTS take) need --allow-audio. Nothing is
    written in dry-run mode.
    """
    rid = finding["repair"]
    kind, desc = REPAIRS.get(rid, ("SAFE", rid))
    fn = REPAIR_EXECUTORS.get(rid)
    permitted = ((kind == "SOURCE" and allow_edits) or
                 (kind == "AUDIO" and allow_audio) or
                 kind == "SAFE")
    dry = plan_only or not permitted

    if fn is None:
        # no concrete executor yet: report the plan honestly rather than pretending
        note = "   [no automated executor yet — recorded as a plan]"
        return "planned", desc + (note if not plan_only else "")

    try:
        status, detail = fn(slug, finding, allow_edits=allow_edits and not plan_only,
                            dry_run=dry)
    except TypeError:
        # executor predates the dry_run contract
        status, detail = fn(slug, finding, allow_edits and not plan_only)
    except Exception as e:
        return "failed", f"{type(e).__name__}: {e}"

    if dry:
        if status == "fixed":
            status = "planned"
        flag = {"SOURCE": "--allow-edits", "AUDIO": "--allow-audio"}.get(kind)
        if flag:
            detail = f"{detail}   [{kind} — rerun with {flag} to apply]"
    return status, detail


# ==========================================================================
# the loop
# ==========================================================================
def heal(slug: str, only: str | None = None, plan_only: bool = False,
         allow_edits: bool = False, max_rounds: int = 3,
         report_dir: str | None = None, write: bool = True,
         allow_audio: bool = False) -> dict:
    vdir = ROOT / "videos" / slug
    if not vdir.is_dir():
        return {"slug": slug, "error": f"no such topic {slug}", "status": "no-topic"}
    out_dir = Path(report_dir) if report_dir else vdir
    if report_dir:
        out_dir.mkdir(parents=True, exist_ok=True)

    def emit(event: dict) -> None:
        """append to the topic's heal log, unless --no-write (multi-model safety)"""
        if write:
            log_line(slug, event)

    result = {"slug": slug, "started": _dt.datetime.now().isoformat(timespec="seconds"),
              "plan_only": plan_only, "allow_edits": allow_edits, "steps": [],
              "status": "green", "dead_lettered": []}
    steps = [s for s in PIPELINE if (only is None or s["id"] == only)]

    for step in steps:
        sid = step["id"]
        entry = {"step": sid, "rounds": [], "outcome": "pass"}

        # --plan is read-only and cheap: only the pure-check gates run
        if plan_only and not step.get("diagnostic"):
            entry["outcome"] = "skipped-plan"
            result["steps"].append(entry)
            continue

        if step.get("needs_disk"):
            free = disk_free_gb()
            entry["disk_free_gb"] = round(free, 2)
            if free < DISK_MIN_GB:
                entry["outcome"] = "held"
                entry["reason"] = f"C: only {free:.1f} GB free (< {DISK_MIN_GB} GB) — holding render (UPG-R11)"
                result["status"] = "held"
                result["steps"].append(entry)
                emit({"event": "hold", "step": sid, "reason": entry["reason"]})
                break

        # an optional gate that is not installed yet must not look like a failure:
        # check BEFORE running it, and tolerate a missing binary anyway
        if step.get("optional") and not _step_tool_exists(step):
            entry["outcome"] = "skipped-optional"
            result["steps"].append(entry)
            emit({"event": "skip", "step": sid, "reason": "optional gate not installed"})
            continue

        rc, out = run_cmd([str(a).replace("{slug}", slug) for a in step["cmd"]],
                          timeout=1200 if sid == "render" else 600)
        entry["rounds"].append({"n": 1, "rc": rc, "tail": out[-400:]})

        if step.get("optional") and rc in (127, 2):
            entry["outcome"] = "skipped-optional"
            result["steps"].append(entry)
            emit({"event": "skip", "step": sid, "reason": "optional gate unavailable"})
            continue

        # a gate fails when it exits non-zero OR prints an explicit `FAIL [gate]` line.
        # Never test for the bare word "FAIL": every gate's summary line contains
        # "0 FAIL", which would make a clean gate look broken (bug found 2026-10-16).
        if not _step_failed(rc, out):
            result["steps"].append(entry)
            emit({"event": "pass", "step": sid})
            continue

        findings = diagnose(out, sid)
        entry["findings"] = findings
        print(f"\n[HEAL] {slug} :: {sid} FAILED (rc={rc})")
        for f in findings:
            print(f"   {f['code']:<28} -> {f['repair']} ({f['kind']})")
            print(f"      {f['hint']}")

        # bounded repair rounds
        fixed = False
        for rnd in range(2, max_rounds + 2):
            statuses = []
            for f in findings:
                status, detail = apply_repair(slug, f, allow_edits, plan_only,
                                              allow_audio=allow_audio)
                statuses.append((f["code"], f["repair"], status, detail))
                if write:
                    remember(f["repair"], f["code"], "ok" if status in ("fixed", "planned") else "fail")
                print(f"      repair[{f['repair']}] {status}: {detail}")
                emit({"event": "repair", "step": sid, "code": f["code"],
                      "repair": f["repair"], "status": status, "detail": detail})
            entry["repairs"] = statuses

            # nothing was actually executed (plan mode, or every repair is gated behind
            # --allow-edits / --allow-audio): re-running the gate would say the same thing
            if all(s in ("planned",) for _, _, s, _ in statuses):
                entry["outcome"] = "planned"
                gates = {f["kind"] for f in findings if f["kind"] in ("SOURCE", "AUDIO")}
                flag = {"SOURCE": "--allow-edits", "AUDIO": "--allow-audio"}
                entry["blocked_on"] = ("--plan" if plan_only else
                                       " ".join(flag[g] for g in sorted(gates)) + " (gated repairs held back)")
                break

            rc, out = run_cmd([str(a).replace("{slug}", slug) for a in step["cmd"]],
                              timeout=1200 if sid == "render" else 600)
            entry["rounds"].append({"n": rnd, "rc": rc, "tail": out[-400:]})
            if not _step_failed(rc, out):
                entry["outcome"] = "repaired"
                fixed = True
                emit({"event": "repaired", "step": sid, "round": rnd})
                break
            findings = diagnose(out, sid)
            entry["findings"] = findings

        if not fixed and entry["outcome"] not in ("planned", "held"):
            entry["outcome"] = "dead-letter"
            result["dead_lettered"].append({"step": sid, "codes": [f["code"] for f in findings],
                                            "evidence": findings[0]["evidence"] if findings else out[-300:]})
            emit({"event": "dead-letter", "step": sid,
                  "codes": [f["code"] for f in findings]})
        result["steps"].append(entry)

    # status ladder, computed once from what actually happened:
    #   held        a guard stopped the loop (disk) — nothing was destroyed
    #   dead-letter a step survived every bounded repair round
    #   planned     gates failed but every repair is SOURCE / needs --allow-edits
    #   green       every step that ran is green
    outcomes_list = [e["outcome"] for e in result["steps"]]
    outcomes = set(outcomes_list)
    if "held" in outcomes:
        result["status"] = "held"
    elif result["dead_lettered"]:
        result["status"] = "dead-letter"
    elif "planned" in outcomes or "dead-letter" in outcomes:
        result["status"] = "planned"
    else:
        result["status"] = "green"
    result["outcomes"] = {o: outcomes_list.count(o) for o in sorted(outcomes)}

    result["finished"] = _dt.datetime.now().isoformat(timespec="seconds")
    if write:
        rep = out_dir / "_heal_report.json"
        rep.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        result["report_path"] = str(rep)
    else:
        result["report_path"] = None
    return result


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("slug")
    ap.add_argument("--plan", action="store_true", help="diagnose only, do not repair")
    ap.add_argument("--allow-edits", action="store_true",
                    help="apply conservative SOURCE repairs to script.json (backup taken)")
    ap.add_argument("--allow-audio", action="store_true",
                    help="allow AUDIO repairs (they regenerate every TTS take — slow, and "
                         "the narrator's pacing is the channel signature)")
    ap.add_argument("--only", help="restrict to one pipeline step id")
    ap.add_argument("--max-rounds", type=int, default=3)
    ap.add_argument("--report-dir", help="write _heal_report.json here instead of videos/<slug>/")
    ap.add_argument("--no-write", action="store_true",
                    help="diagnose only: no heal log, no memory, no report file (multi-model safe)")
    ap.add_argument("--json", help="also write the result JSON here")
    args = ap.parse_args()

    res = heal(args.slug, only=args.only, plan_only=args.plan,
               allow_edits=args.allow_edits, max_rounds=args.max_rounds,
               report_dir=args.report_dir, write=not args.no_write,
               allow_audio=args.allow_audio)

    print("\n=================== HEAL LOOP RESULT ===================")
    print(f" topic   : {res['slug']}")
    print(f" status  : {res['status']}")
    for e in res.get("steps", []):
        print(f"   {e['step']:<14} {e['outcome']:<18} rounds={len(e.get('rounds', []))}"
              + (f"  codes={[f['code'] for f in e.get('findings', [])]}" if e.get("findings") else ""))
    if res.get("dead_lettered"):
        print(" dead-lettered:")
        for d in res["dead_lettered"]:
            print(f"   - {d['step']}: {', '.join(d['codes'])}")
            print(f"     {d['evidence'][:160]}")
    print(f" report  : {res.get('report_path') or '(not written: --no-write)'}")
    print("========================================================\n")

    if args.json:
        Path(args.json).write_text(json.dumps(res, indent=2, ensure_ascii=False), encoding="utf-8")
    if res.get("error"):
        return 2
    return {"green": 0, "planned": 1}.get(res["status"], 2)


if __name__ == "__main__":
    sys.exit(main())
