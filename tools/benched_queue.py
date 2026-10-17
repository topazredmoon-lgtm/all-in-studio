#!/usr/bin/env python3
"""Benched Queue — one-click owner review console (T-R2C; implements UPG-R4 + UPG-L5).

"the only effort the will do is reviewing" (owner, conversation_full.json) -> review
must be ONE glance + ONE click, in one place, with the render's own stills next to it.

What it does:
  * python tools/benched_queue.py scan [--deep]
        Aggregates every videos/<topic> into studio/bench/bench.json: latest render +
        srchash freshness, timeline.json existence (UPG-N4 cannot-render guard), QA
        stills list, latest owner verdict, and a 3-bullet owner checklist.
        --deep also runs tools/qa.py <topic> --skip-media (script/cue/voice lints).
  * python tools/benched_queue.py serve [--port 4531] [--open]
        Local zero-dependency web console (std-lib http.server). Cards per topic with
        the latest QA still, three verdict buttons YES / HOLD / RED, a note field.
        Verdicts append to videos/<topic>/verdicts.jsonl (UPG-L5 contract, append-only).
  * python tools/benched_queue.py verdict <topic> <approve|hold|reject> [--note ...]
        Same verdict write from a CLI (for daemons/agent loops; by-agent provenance).
  * python tools/benched_queue.py gate-ready <topic>
        UPG-L5 ship gate check: exit 0 only when an approved verdict is newer than
        the newest render stamp. Prints a FAIL/READY line compatible with qa.py wiring.

This tool READS the studio; the only files it writes are studio/bench/bench.json and
videos/<topic>/verdicts.jsonl. It never touches timelines, scripts or renders.
"""
import argparse
import datetime as _dt
import json
import mimetypes
import subprocess
import sys
import threading
import urllib.parse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BENCH_DIR = ROOT / "studio" / "bench"
BENCH_FILE = BENCH_DIR / "bench.json"
GATE_CONTRACT = "benched_queue"


def now_iso() -> str:
    return _dt.datetime.now(_dt.timezone.utc).isoformat(timespec="seconds")


def list_topics() -> list:
    vs = ROOT / "videos"
    return sorted(p.name for p in vs.iterdir() if p.is_dir() and not p.name.startswith(("_", "."))) if vs.exists() else []


def read_stamp(mp4: Path) -> dict | None:
    js = mp4.with_suffix(".json") if mp4.suffix == ".mp4" else None
    if js and js.exists():
        try:
            return json.loads(js.read_text(encoding="utf-8"))
        except Exception:
            return None
    return None


def fresh_stamp(vid: str, stamp: dict | None) -> bool | None:
    """Same two-condition contract qa.py uses: full srchash match OR legacy video hash."""
    if not stamp:
        return None
    try:
        sys.path.insert(0, str(ROOT / "tools"))
        import srchash as sh
        cur = sh.srchash(vid)
        cur_vid = sh.video_hash(vid)
        ok = (stamp.get("src") == cur) or (stamp.get("video") is not None and stamp.get("video") == cur_vid)
        return bool(ok)
    except Exception:
        return None


def qa_stills(vid: str, limit: int = 10) -> list:
    qa = ROOT / "videos" / vid / "qa"
    if not qa.exists():
        return []
    files = [p for p in qa.iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png")]
    files.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    return [p.name for p in files[:limit]]


def latest_mp4(vid: str) -> Path | None:
    out = ROOT / "videos" / vid / "out"
    if not out.exists():
        return None
    cands = []
    for p in out.glob("*.mp4"):
        import re
        m = re.search(r"_v(\d+)\.mp4$", p.name)
        cands.append(((int(m.group(1)) if m else 0), p.stat().st_mtime, p))
    if not cands:
        return None
    cands.sort(key=lambda x: (x[0], x[1]))
    return cands[-1][2]


def verdicts_of(vid: str) -> list:
    f = ROOT / "videos" / vid / "verdicts.jsonl"
    if not f.exists():
        return []
    out = []
    for line in f.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line:
            try:
                out.append(json.loads(line))
            except Exception:
                pass
    return out


def bullets_for(vid: str, has_timeline: bool, stamp_f: bool | None, mp4: Path | None, ver_list: list) -> list:
    out = []
    if mp4 is None:
        out.append("NO RENDER YET - this topic is benched, not shipped-able")
    else:
        age = _dt.datetime.fromtimestamp(mp4.stat().st_mtime, _dt.timezone.utc)
        age_s = (ver_now() - age).total_seconds() / 3600.0
        state = "stamp FRESH" if stamp_f else ("stamp STALE (sources changed after render)" if stamp_f is False else "stamp unreadable")
        out.append(f"{mp4.name} - {state} - rendered {age_s:.0f}h ago")
    if has_timeline:
        out.append("timeline.json present - can render")
    else:
        out.append("NO timeline.json - cannot render (UPG-N4 class); needs build or de-register")
    if ver_list:
        last = ver_list[-1]
        out.append(f"last verdict: {last.get('verdict', '?')} by {last.get('by', '?')} - \"{(last.get('note') or '')[:60]}\"")
    else:
        out.append("awaiting owner verdict (YES / HOLD / RED)")
    return out


def ver_now() -> _dt.datetime:
    return _dt.datetime.now(_dt.timezone.utc)


def append_verdict(vid: str, verdict: str, note: str, by: str) -> dict:
    if verdict not in ("approve", "hold", "reject"):
        raise ValueError(f"verdict must be approve|hold|reject, got {verdict!r}")
    rec = {"ts": now_iso(), "verdict": verdict, "note": note, "by": by}
    f = ROOT / "videos" / vid / "verdicts.jsonl"
    f.parent.mkdir(parents=True, exist_ok=True)
    with f.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(rec) + "\n")
    return rec


def cmd_scan(deep: bool) -> int:
    BENCH_DIR.mkdir(parents=True, exist_ok=True)
    rows = []
    for vid in list_topics():
        mp4 = latest_mp4(vid)
        stamp = read_stamp(mp4) if mp4 else None
        stamp_f = fresh_stamp(vid, stamp) if stamp else None
        vdir = ROOT / "videos" / vid
        has_tl = (ROOT / "engine" / "src" / "videos" / vid / "timeline.json").exists()
        ver_list = verdicts_of(vid)
        row = {
            "id": vid,
            "mp4": str(mp4) if mp4 else None,
            "mp4_mtime": _dt.datetime.fromtimestamp(mp4.stat().st_mtime).isoformat(timespec="seconds") if mp4 else None,
            "stamp": bool(stamp),
            "stamp_fresh": stamp_f,
            "timeline": has_tl,
            "stills": qa_stills(vid),
            "verdicts": ver_list[-5:],
            "n_verdicts": len(ver_list),
            "bullets": bullets_for(vid, has_tl, stamp_f, mp4, ver_list),
            "gate_summary": None,
        }
        if deep and (vdir / "script.json").exists():
            try:
                p = subprocess.run(
                    [sys.executable, str(ROOT / "tools" / "qa.py"), vid, "--skip-media"],
                    capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=240,
                )
                lines = (p.stdout or "").splitlines()
                g = [ln.strip() for ln in lines if ln.strip().startswith("[PASS]") or ln.strip().startswith("[FAIL]") or "SUMMARY" in ln]
                row["gate_summary"] = g or [(p.stderr or "").strip()[:200]]
            except Exception as ex:
                row["gate_summary"] = [f"qa run error: {ex!r}"[:200]]
        rows.append(row)
    doc = {"generated": now_iso(), "topics": rows, "contract": GATE_CONTRACT}
    BENCH_FILE.write_text(json.dumps(doc, indent=1), encoding="utf-8")
    n_ok = sum(1 for r in rows if r["mp4"])
    n_fresh = sum(1 for r in rows if r["stamp_fresh"] is True)
    n_unverdicted = sum(1 for r in rows if r["n_verdicts"] == 0 and r["mp4"])
    n_cannot = sum(1 for r in rows if not r["timeline"])
    print(f"benched {len(rows)} topics -> {BENCH_FILE}")
    print(f"  rendered: {n_ok} | stamp-fresh: {n_fresh} | never-verdicted w/ render: {n_unverdicted} | cannot-render (no timeline): {n_cannot}")
    for r in rows:
        flag = "***"
        if r["mp4"] and not r["verdicts"]:
            flag = " >>> awaiting verdict:"
        elif r["mp4"] and r["stamp_fresh"] is False:
            flag = " >>> stale render:"
        print(f"  {r['id']:<26} {flag} {r['mp4'] and Path(r['mp4']).name or 'NO RENDER'}")
    return 0


# ---------------- local console (stdlib http only) ----------------

PAGE = """<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BENCHED QUEUE - All-in</title>
<style>
:root { --stage:#0E0C0B; --ink:#F4F1EA; --mute:#8A8F98; --red:#E63946; --paper:#EEE8DC; --hair:rgba(233,227,211,0.16); }
* { box-sizing:border-box; margin:0; padding:0; }
body { background:var(--stage); color:var(--ink); font:15px/1.45 "Segoe UI", Arial, sans-serif; }
header { padding:22px 28px; border-bottom:1px solid var(--hair); display:flex; align-items:baseline; gap:14px; flex-wrap:wrap;}
h1 { font:700 24px/1 monospace; letter-spacing:.02em; }
h1 .q { color:var(--red); }
#stamp { color:var(--mute); font-size:12.5px; font-family:Consolas,monospace; }
main { display:grid; grid-template-columns:repeat(auto-fill, minmax(430px, 1fr)); gap:18px; padding:22px; }
.card { border:1px solid var(--hair); border-radius:14px; overflow:hidden; background:#12100E; }
.card.awaiting { border-color:rgba(230,57,70,0.55); }
.thumb { height:190px; background:#000 center/cover no-repeat; cursor:pointer; position:relative;}
.thumb .tag { position:absolute; left:10px; top:10px; font:600 11px Consolas,monospace; color:#fff; background:rgba(14,12,11,.75); padding:3px 8px; border-radius:6px; letter-spacing:.08em;}
.body { padding:14px 16px 16px; }
.top { display:flex; justify-content:space-between; align-items:center; gap:10px; }
.tid { font:700 17px Consolas,monospace; }
.vtag { font:700 11px Consolas,monospace; padding:3px 9px; border-radius:999px; letter-spacing:.1em;}
.vtag.none { background:#221E1B; color:var(--mute);}
.vtag.approve { background:rgba(79,178,134,0.18); color:#7BD4A8; }
.vtag.hold { background:rgba(233,227,211,0.15); color:var(--ink);}
.vtag.reject { background:rgba(230,57,70,0.2); color:#F0868F;}
ul { list-style:none; margin:10px 0 12px; color:var(--mute); font-size:13px; }
li { padding:2px 0 2px 18px; position:relative; }
li:before { content:"-"; position:absolute; left:4px; color:var(--red); font:700 13px monospace;}
.row { display:flex; gap:8px; }
button { flex:0 0 auto; font:700 13px Consolas,monospace; padding:9px 18px; border-radius:9px; border:1px solid var(--hair); background:#1B1815; color:var(--ink); cursor:pointer;}
button:hover { filter:brightness(1.25); }
button.yes { border-color:rgba(79,178,134,.6); }
button.abstain { }
button.red { border-color:rgba(230,57,70,.6); }
input.note { flex:1 1 auto; background:#0B0A09; border:1px solid var(--hair); border-radius:9px; color:var(--ink); padding:9px 12px; font:13px Consolas,monospace;}
input.note::placeholder { color:#5E564E; }
.bullets3 { font:12px Consolas,monospace; color:var(--mute); margin-top:6px;}
.msg { position:fixed; right:18px; bottom:18px; background:#1B1815; border:1px solid var(--hair); border-radius:10px; padding:10px 16px; font:13px Consolas,monospace; opacity:0; transition:opacity .25s; z-index:9;}
.msg.show { opacity:1; }
</style></head><body>
<header><h1>BENCHED&nbsp;QUEUE<span class="q">.</span></h1><span id="stamp"></span></header>
<main id="cards"></main><div id="msg" class="msg"></div>
<script>
async function boot(){
  const r = await fetch('/data'); const j = await r.json();
  document.getElementById('stamp').textContent = 'compiled ' + j.generated + ' - verdicts write videos/<id>/verdicts.jsonl';
  const c = document.getElementById('cards'); c.innerHTML='';
  for (const t of j.topics){
    if (!t.mp4 && !t.bullets.length) continue;
    const latest = (t.verdicts && t.verdicts.length) ? t.verdicts[t.verdicts.length-1].verdict : 'none';
    const awaits = t.mp4 && latest==='none';
    const div = document.createElement('div'); div.className='card'+(awaits?' awaiting':'');
    const still = t.stills && t.stills.length ? '/thumb?id='+encodeURIComponent(t.id)+'&file='+encodeURIComponent(t.stills[0]) : '';
    div.innerHTML = `
      <div class="thumb" style="${still?'(background)':''}" x="${still}">
        <span class="tag">${t.mp4 ? t.mp4.split(/[\\\\/]/).pop() : 'no render'}</span>
      </div>
      <div class="body">
        <div class="top"><span class="tid">${t.id}</span><span class="vtag ${latest==='none'?'none':latest}">${latest==='none'?'awaiting':latest.toUpperCase()}</span></div>
        <ul>${t.bullets.map(b=>'<li>'+b+'</li>').join('')}</ul>
        ${t.gate_summary?'<div class="bullets3">'+t.gate_summary.map(x=>x.replaceAll('<','&lt;')).join('<br>')+'</div>':''}
        <div class="row">
          <button class="yes" data-v="approve"><span>&#10003;</span> YES</button>
          <button class="abstain" data-v="hold">HOLD</button>
          <button class="red" data-v="reject">&#10007; RED</button>
          <input class="note" placeholder="note (optional) - one line why">
        </div>
      </div>`;
    const still_el = div.querySelector('.thumb');
    if (still) { still_el.style.backgroundImage = `url('${still}')`; }
    div.querySelectorAll('button').forEach(btn=>btn.addEventListener('click', async ()=>{
      const note = div.querySelector('input.note').value.trim();
      const res = await (await fetch('/verdict', {method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({id:t.id, verdict:btn.dataset.v, note})})).json();
      flash(res.ok ? (t.id+': '+(note?'(note) ':'')+btn.dataset.v+' recorded') : ('error: '+(res.error||'?')));
      boot();
    }));
    c.appendChild(div);
  }
}
function flash(t){ const m=document.getElementById('msg'); m.textContent=t; m.classList.add('show'); setTimeout(()=>m.classList.remove('show'), 2600); }
boot();
</script></body></html>"""


class Handler(BaseHTTPRequestHandler):
    scan_lock = threading.Lock()

    def _data(self) -> dict:
        with Handler.scan_lock:
            if not BENCH_FILE.exists():
                cmd_scan(deep=False)
            try:
                age = _dt.datetime.fromtimestamp(BENCH_FILE.stat().st_mtime, _dt.timezone.utc)
                if (ver_now() - age).total_seconds() > 25:
                    cmd_scan(deep=False)
            except Exception:
                pass
            return json.loads(BENCH_FILE.read_text(encoding="utf-8"))

    def do_GET(self):
        u = urllib.parse.urlparse(self.path)
        if u.path == "/":
            body = PAGE.encode("utf-8")
            self.send_response(200);
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers(); self.wfile.write(body)
        elif u.path == "/data":
            doc = self._data()
            body = json.dumps(doc).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers(); self.wfile.write(body)
        elif u.path == "/thumb":
            q = urllib.parse.parse_qs(u.query)
            vid = (q.get("id") or [""])[0]
            fname = (q.get("file") or [""])[0]
            p = (ROOT / "videos" / vid / "qa" / fname).resolve()
            ok = (
                vid and "/" not in vid and "\\" not in vid and ".." not in vid
                and fname and "/" not in fname and "\\" not in fname and ".." not in fname
                and p.exists() and p.suffix.lower() in (".jpg", ".jpeg", ".png")
                and str(p).lower().startswith(str((ROOT / "videos").resolve()).lower())
            )
            if not ok:
                self.send_response(404); self.end_headers(); return
            mime = mimetypes.guess_type(str(p))[0] or "image/jpeg"
            body = p.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", mime)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers(); self.wfile.write(body)
        else:
            self.send_response(404); self.end_headers()

    def do_POST(self):
        if self.path != "/verdict":
            self.send_response(404); self.end_headers(); return
        try:
            ln = int(self.headers.get("Content-Length", 0))
            doc = json.loads(self.rfile.read(ln).decode("utf-8"))
            rec = append_verdict(doc["id"], doc["verdict"], doc.get("note", ""), by="owner-ui")
            self._json({"ok": True, "recorded": rec})
        except Exception as ex:
            self._json({"ok": False, "error": repr(ex)[:160]})
        finally:
            with Handler.scan_lock:
                try:
                    cmd_scan(deep=False)
                except Exception:
                    pass

    def _json(self, doc):
        body = json.dumps(doc).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers(); self.wfile.write(body)

    def log_message(self, fmt, *args):
        pass


def cmd_serve(port: int, open_browser: bool) -> int:
    cmd_scan(deep=False)
    httpd = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    url = f"http://127.0.0.1:{port}"
    print(f"Benched Queue console: {url}  (Ctrl+C to stop)")
    if open_browser:
        import webbrowser
        webbrowser.open(url)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("bye")
    return 0


def cmd_gate_ready(vid: str) -> int:
    """UPG-L5: ship requires an approved verdict newer than the newest render stamp."""
    ver_list = verdicts_of(vid)
    mp4 = latest_mp4(vid)
    if mp4 is None:
        print(f"FAIL [ship_gate] {vid}: no render found")
        return 1
    apr = [v for v in ver_list if v.get("verdict") == "approve"]
    rej = [v for v in ver_list if v.get("verdict") == "reject"]
    if not ver_list:
        print(f"FAIL [ship_gate] {vid}: no owner verdicts yet - benched for review (UPG-L5 first-contact hold)")
        return 1
    if rej and (not apr or apr[-1]["ts"] < rej[-1]["ts"]):
        print(f"FAIL [ship_gate] {vid}: latest verdict is REJECT ({rej[-1].get('note') or 'no note'})")
        return 1
    if not apr:
        print(f"FAIL [ship_gate] {vid}: no approve verdict on record")
        return 1
    mp4_mtime = _dt.datetime.fromtimestamp(mp4.stat().st_mtime, _dt.timezone.utc)
    try:
        apr_ts = _dt.datetime.fromisoformat(apr[-1]["ts"])
    except Exception:
        print(f"FAIL [ship_gate] {vid}: unreadable verdict timestamp")
        return 1
    if apr_ts < mp4_mtime:
        print(f"FAIL [ship_gate] {vid}: approve is OLDER than render {mp4.name} - ship needs a fresh owner pass")
        return 1
    print(f"READY [ship_gate] {vid}: approved by operator on {apr[-1]['ts']} >= render {mp4.name}")
    return 0


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    s1 = sub.add_parser("scan"); s1.add_argument("--deep", action="store_true")
    s2 = sub.add_parser("serve"); s2.add_argument("--port", type=int, default=4531); s2.add_argument("--open", action="store_true")
    s3 = sub.add_parser("verdict"); s3.add_argument("topic"); s3.add_argument("verdict"); s3.add_argument("--note", default=""); s3.add_argument("--by", default="agent")
    s4 = sub.add_parser("gate-ready"); s4.add_argument("topic")
    args = ap.parse_args()
    if args.cmd == "scan":
        sys.exit(cmd_scan(args.deep))
    elif args.cmd == "serve":
        sys.exit(cmd_serve(args.port, args.open))
    elif args.cmd == "verdict":
        rec = append_verdict(args.topic, args.verdict, args.note, args.by)
        print(json.dumps(rec)); sys.exit(0)
    else:
        sys.exit(cmd_gate_ready(args.topic))


if __name__ == "__main__":
    main()
