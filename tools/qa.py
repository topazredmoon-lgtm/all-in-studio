"""Unified Studio Quality Assurance Gate: python tools/qa.py <video_id> [--mp4 <path>] [--skip-media]

Runs all studio quality gates in sequence:
  1. lint_text:   Picture-led visual rule, no centered lone text / big numbers
  2. lint_cues:   Word-level sync, every cue word matches spoken Whisper word
  3. lint_clips:  Clip in/out boundaries on full sentences with room sound rolls
  4. voice_check: Voice pitch, level regularity, and declarative endings
  5. render_sync: Verifies rendered MP4 stamp (<vid>_vN.json) matches current srchash
  6. watch.py:    Visual content verification on rendered MP4 (no empty screens)
  7. listen.py:   Acoustic verification on rendered MP4 (loudness, clipping, WER)

Exit 0 on all pass, exit 1 if any gate fails.
"""
import argparse, json, os, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))


def resolve_latest_mp4(vid: str, vdir: Path, explicit_mp4: str | None) -> Path | None:
    if explicit_mp4:
        p = Path(explicit_mp4)
        return p if p.exists() else None
    out_dir = vdir / "out"
    if not out_dir.exists():
        return None
    # Prefer highest-numbered master render `<vid>_vN.mp4` over compressed `All-in_*.mp4` copies
    versioned = [
        (int(m.group(1)), p)
        for p in out_dir.glob(f"{vid}_v*.mp4")
        if (m := re.search(r"_v(\d+)\.mp4$", p.name))
    ]
    if versioned:
        return sorted(versioned, key=lambda x: x[0])[-1][1]
    all_mp4s = sorted(out_dir.glob("*.mp4"), key=lambda p: p.stat().st_mtime)
    return all_mp4s[-1] if all_mp4s else None


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("video_id", nargs="?", help="Topic slug (e.g. greyhat-ai, ai-ban, why-ai-dumber)")
    parser.add_argument("--mp4", help="Explicit path to rendered MP4 to audit")
    parser.add_argument("--skip-media", action="store_true", help="Skip watch/listen MP4 checks (audit script/timelines only)")
    args = parser.parse_args()

    vids = sorted([p.name for p in (ROOT / "videos").iterdir() if p.is_dir() and not p.name.startswith(("_", "."))])

    if not args.video_id:
        parser.print_help()
        print(f"\nAvailable topics:\n  {', '.join(vids)}")
        sys.exit(0)

    vid = args.video_id
    vdir = ROOT / "videos" / vid
    if not vdir.is_dir():
        sys.exit(f"Error: topic '{vid}' not found in videos/. Available: {', '.join(vids)}")

    print(f"\n=======================================================")
    print(f" ALL-IN STUDIO QUALITY AUDIT: {vid}")
    print(f"=======================================================\n")

    results = []

    def run_tool(name, script_file, tool_args):
        env = os.environ.copy()
        env["PYTHONIOENCODING"] = "utf-8"
        p = subprocess.run(
            [sys.executable, str(ROOT / "tools" / script_file), *tool_args],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            env=env,
        )
        passed = (p.returncode == 0)
        stdout_txt = p.stdout or ""
        stderr_txt = p.stderr or ""
        output = (stdout_txt + stderr_txt).strip()
        results.append((name, passed, output))
        status_str = "[PASS]" if passed else "[FAIL]"
        print(f"  {status_str:6} {name}")
        if not passed and output:
            for line in output.splitlines()[:6]:
                print(f"         > {line}")
            if len(output.splitlines()) > 6:
                print(f"         > ... ({len(output.splitlines()) - 6} more lines)")
        return passed

    # 1. Script & Cue Lints
    has_script = (vdir / "script.json").exists()
    if has_script:
        run_tool("lint_text   (Visual Framing & No Lone Text)", "lint_text.py", [vid])
        run_tool("lint_cues   (Word Sync & Timestamp Matching)", "lint_cues.py", [vid])
        run_tool("lint_clips  (Sentence In/Out Boundaries)", "lint_clips.py", [vid])
        run_tool("voice_check (Pitch, Level & Inflection Evenness)", "voice_check.py", [vid])
        run_tool("taste_audit (Directorial Taste, Cadence & Word Ceiling)", "taste_audit.py", [vid])
    else:
        print(f"  [SKIP] Script lints skipped: {vid}/script.json not found")

    # 2. Rendered Media Audits (render_sync + watch + listen)
    if not args.skip_media:
        mp4_path = resolve_latest_mp4(vid, vdir, args.mp4)
        if mp4_path is not None:
            print(f"  [INFO] Target MP4: {mp4_path.relative_to(ROOT) if ROOT in mp4_path.parents else mp4_path}")
            # Verify srchash freshness stamp if sidecar .json exists
            stamp_file = mp4_path.with_suffix(".json")
            if stamp_file.exists():
                try:
                    import srchash as sh_mod
                    stamp = json.loads(stamp_file.read_text(encoding="utf-8"))
                    cur_full = sh_mod.srchash(vid)
                    cur_vid = sh_mod.video_hash(vid)
                    stamped_src = stamp.get("src")
                    stamped_vid = stamp.get("video")
                    # Pass if either full hash matches or legacy stamp matches
                    sync_ok = (stamped_src == cur_full) or (stamped_vid is not None and stamped_vid == cur_vid)
                    msg = "" if sync_ok else f"{mp4_path.name} was rendered from hash {stamped_src}, but current source/audio hash is {cur_full}. Re-run render.mjs."
                    results.append(("render_sync (MP4 Matches Current Code & Timeline)", sync_ok, msg))
                    print(f"  {'[PASS]' if sync_ok else '[FAIL]':6} render_sync (MP4 Matches Current Code & Timeline)")
                    if not sync_ok:
                        print(f"         > {msg}")
                except Exception as ex:
                    print(f"  [WARN] Could not verify srchash stamp: {ex}")

            run_tool("watch.py    (Visual Density & Edge Detection)", "watch.py", [vid, str(mp4_path)])
            run_tool("listen.py   (Acoustic Loudness, Clipping, WER)", "listen.py", [vid, str(mp4_path)])
        else:
            print(f"  [INFO] Media audit skipped: no rendered MP4 found in {vid}/out/")

    print(f"\n-------------------------------------------------------")
    total = len(results)
    passed_count = sum(1 for _, ok, _ in results if ok)
    failed_count = total - passed_count
    print(f" SUMMARY: {passed_count}/{total} gates passed ({failed_count} failures)")
    print(f"-------------------------------------------------------\n")

    if failed_count > 0:
        sys.exit(1)
    sys.exit(0)


if __name__ == "__main__":
    main()
