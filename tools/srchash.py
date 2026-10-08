"""Fingerprint of everything a render depends on: python tools/srchash.py <video_id>
(engine/src *.ts/*.tsx/*.json incl. the timeline, + master.wav). render.mjs stamps it next to the mp4; qa.py compares."""
import hashlib, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def srchash(vid):
    h = hashlib.sha1()
    src = ROOT / "engine" / "src"
    for p in sorted(src.rglob("*"), key=lambda q: q.relative_to(src).as_posix()):
        if p.is_file() and p.suffix in (".ts", ".tsx", ".json"):
            h.update(p.relative_to(src).as_posix().encode()); h.update(p.read_bytes())
    h.update((ROOT / "videos" / vid / "master.wav").read_bytes())
    return h.hexdigest()[:16]

if __name__ == "__main__":
    print(srchash(sys.argv[1]))
