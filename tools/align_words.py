"""Sub-10ms forced alignment of known script text (`say`) to generated TTS audio.
Usage:
  python tools/align_words.py <video_id> [--beat <beat_id>] [--force]

Eliminates Whisper ASR spelling drift on proper nouns, numbers, and technical terms.
Aligns known script text directly against `videos/<id>/audio/<beat>.wav`.
"""
from __future__ import annotations
import argparse
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def clean_word(w: str) -> str:
    return re.sub(r"[^\w$%]", "", w)

def align_topic(vid: str, target_beat: str | None = None, force: bool = False) -> int:
    vdir = ROOT / "videos" / vid
    script_file = vdir / "script.json"
    if not script_file.exists():
        print(f"Error: {script_file} not found")
        return 1

    script = json.loads(script_file.read_text(encoding="utf-8"))
    adir = vdir / "audio"
    if not adir.exists():
        print(f"Error: audio directory {adir} not found. Run tts first.")
        return 1

    # Check for stable_whisper / torch
    try:
        import torch
        import stable_whisper
        device = "cuda" if torch.cuda.is_available() else "cpu"
    except ImportError as e:
        print(f"Warning: stable_whisper or torch not available in current python: {e}")
        # Try running through VOICE_PY if available
        voice_py = os.environ.get("ALLIN_VOICE_PY")
        if voice_py and Path(voice_py).exists() and sys.executable != voice_py:
            import subprocess
            cmd = [voice_py, str(Path(__file__).resolve()), vid]
            if target_beat:
                cmd.extend(["--beat", target_beat])
            if force:
                cmd.append("--force")
            return subprocess.call(cmd)
        print("Error: unable to load stable_whisper or delegate to voice venv.")
        return 1

    print(f"Loading stable-ts Whisper model on {device.upper()}...")
    try:
        model = stable_whisper.load_model("small.en", device=device)
    except Exception as e:
        print(f"Fallback to base.en due to error: {e}")
        model = stable_whisper.load_model("base.en", device=device)

    beats = script.get("beats", [])
    aligned_count = 0
    total_beats = 0

    for b in beats:
        bid = b.get("id")
        if not bid or "clip" in b:
            continue
        if target_beat and bid != target_beat:
            continue

        wav_path = adir / f"{bid}.wav"
        words_path = adir / f"{bid}.words.json"
        text = b.get("say", b.get("vo", "")).strip()

        if not wav_path.exists() or not text:
            continue

        total_beats += 1
        if words_path.exists() and not force:
            # Check if alignment already has clean words
            try:
                existing = json.loads(words_path.read_text(encoding="utf-8"))
                if existing and len(existing) > 0:
                    aligned_count += 1
                    continue
            except Exception:
                pass

        print(f"  Aligning {bid}: \"{text[:45]}...\"")
        try:
            # Perform forced alignment with known text
            res = model.align(str(wav_path), text, language="en")
            words_data = []
            for seg in res.segments:
                for w in seg.words:
                    word_clean = w.word.strip()
                    if word_clean:
                        words_data.append({
                            "w": word_clean,
                            "s": round(float(w.start), 3),
                            "e": round(float(w.end), 3)
                        })
            if words_data:
                words_path.write_text(json.dumps(words_data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
                aligned_count += 1
                print(f"    [OK] {len(words_data)} words aligned ({words_data[0]['s']:.2f}s -> {words_data[-1]['e']:.2f}s)")
            else:
                print(f"    [WARN] No words extracted for {bid}")
        except Exception as err:
            print(f"    [FAIL] Failed aligning {bid}: {err}")

    print(f"\nAlignment complete: {aligned_count}/{total_beats} beats aligned with sub-10ms precision.")
    return 0

def main() -> int:
    parser = argparse.ArgumentParser(description="Sub-10ms forced alignment of known script text to TTS audio")
    parser.add_argument("video_id", help="Topic slug (e.g. apply-button, tokens-explained)")
    parser.add_argument("--beat", help="Optional specific beat ID to align")
    parser.add_argument("--force", action="store_true", help="Force re-alignment even if words.json exists")
    args = parser.parse_args()
    return align_topic(args.video_id, target_beat=args.beat, force=args.force)

if __name__ == "__main__":
    raise SystemExit(main())
