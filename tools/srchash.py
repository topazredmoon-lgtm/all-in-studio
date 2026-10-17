"""Fingerprint of everything a render depends on: python tools/srchash.py <video_id> [--video | --bundle | --chunks=1500]
Modes:
  (default)       16-char full deliverable hash (topic engine code + timeline.json + master.wav). Used by qa.py.
  --video         16-char muted video hash (topic engine code + timeline.json, excluding master.wav and other topics).
  --bundle        16-char Webpack bundle hash (engine/src code + timeline.json + public/<vid> asset manifest).
  --chunks=<N>    JSON object with full, video, bundle hashes and per-chunk hashes for frame windows of size N.
"""
import hashlib, json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def _iter_engine_code_files(vid: str):
    """Yield engine/src files that affect `vid`, ignoring timelines of unrelated topics."""
    src = ROOT / "engine" / "src"
    if not src.exists():
        return
    videos_dir = src / "videos"
    for p in sorted(src.rglob("*"), key=lambda q: q.relative_to(src).as_posix()):
        if not p.is_file() or p.suffix not in (".ts", ".tsx", ".json", ".css"):
            continue
        # Ignore timeline.json or other files inside engine/src/videos/<other_topic>/
        if videos_dir in p.parents:
            rel_parts = p.relative_to(videos_dir).parts
            if rel_parts and rel_parts[0] != vid:
                continue
        yield src, p


def code_only_hash(vid: str) -> str:
    """Hash of engine/src TypeScript/React code excluding timeline.json (used as base for chunk hashes)."""
    h = hashlib.sha1()
    for src, p in _iter_engine_code_files(vid):
        if p.name == "timeline.json":
            continue
        h.update(p.relative_to(src).as_posix().encode("utf-8"))
        h.update(p.read_bytes())
    # Also include public/<vid> asset filenames & sizes so replacing a clip/photo invalidates affected renders
    pub_vid = ROOT / "engine" / "public" / vid
    if pub_vid.is_dir():
        for p in sorted(pub_vid.rglob("*"), key=lambda q: q.relative_to(pub_vid).as_posix()):
            if p.is_file() and not p.name.endswith(".words.json"):
                st = p.stat()
                h.update(f"{p.relative_to(pub_vid).as_posix()}:{st.st_size}:{int(st.st_mtime)}".encode("utf-8"))
    return h.hexdigest()[:16]


def video_hash(vid: str) -> str:
    """Hash of everything the muted video depends on (engine code + topic timeline.json, NO master.wav)."""
    h = hashlib.sha1()
    h.update(code_only_hash(vid).encode("utf-8"))
    tl_path = ROOT / "engine" / "src" / "videos" / vid / "timeline.json"
    if tl_path.exists():
        h.update(tl_path.read_bytes())
    return h.hexdigest()[:16]


def bundle_hash(vid: str) -> str:
    """Hash for caching the Remotion Webpack bundle across cutstills/frame/render."""
    return video_hash(vid)


def srchash(vid: str) -> str:
    """Full deliverable hash (video_hash + master.wav). Stamped into <vid>_vN.json and checked by qa.py."""
    h = hashlib.sha1()
    h.update(video_hash(vid).encode("utf-8"))
    master_wav = ROOT / "videos" / vid / "master.wav"
    if master_wav.exists():
        h.update(master_wav.read_bytes())
    return h.hexdigest()[:16]


def chunk_hashes(vid: str, chunk_size: int = 1500) -> dict:
    """Compute per-chunk hashes so modifying 1 beat only re-renders the chunk(s) overlapping that beat."""
    base_code = code_only_hash(vid)
    tl_path = ROOT / "engine" / "src" / "videos" / vid / "timeline.json"
    if not tl_path.exists():
        return {"full": srchash(vid), "video": video_hash(vid), "bundle": bundle_hash(vid), "chunks": []}

    tl = json.loads(tl_path.read_text(encoding="utf-8"))
    total = int(tl.get("total", 0))
    beats = tl.get("beats", [])
    chunks = []
    for s in range(0, total, chunk_size):
        e = min(total - 1, s + chunk_size - 1)
        overlapping = [
            b for b in beats
            if b.get("start", 0) <= e and (b.get("start", 0) + b.get("dur", 0)) > s
        ]
        ch = hashlib.sha1()
        ch.update(base_code.encode("utf-8"))
        ch.update(f"{s}:{e}:{tl.get('fps', 30)}".encode("utf-8"))
        ch.update(json.dumps(overlapping, sort_keys=True, ensure_ascii=False).encode("utf-8"))
        chunks.append(ch.hexdigest()[:16])

    return {
        "full": srchash(vid),
        "video": video_hash(vid),
        "bundle": bundle_hash(vid),
        "chunks": chunks,
    }


if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] in ("--help", "-h", "help"):
        print(__doc__.strip())
        sys.exit(0)
    vid = sys.argv[1]
    flags = sys.argv[2:]
    if "--video" in flags:
        print(video_hash(vid))
    elif "--bundle" in flags:
        print(bundle_hash(vid))
    elif any(f.startswith("--chunks") for f in flags):
        c_arg = next(f for f in flags if f.startswith("--chunks"))
        c_size = int(c_arg.split("=", 1)[1]) if "=" in c_arg else 1500
        print(json.dumps(chunk_hashes(vid, c_size)))
    else:
        print(srchash(vid))
