#!/usr/bin/env python3
"""Repo-wide gate map: for every topic, run each diagnostic gate from cwd=All-in
(the way the tools are actually invoked), record exit code + `FAIL [..]` line count,
and classify every failure into a heal_loop reason code.

Produces results/repo_gate_map.json and a terminal table. Read-only.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import heal_loop as H

ROOT = H.ROOT
GATES = ["lint_text.py", "taste_audit.py", "lint_cues.py", "voice_check.py", "lint_clips.py"]
env = dict(os.environ, PYTHONIOENCODING="utf-8")

slugs = sorted(p.name for p in (ROOT / "videos").iterdir()
               if p.is_dir() and not p.name.startswith(("_", ".")) and (p / "script.json").exists())

rows, code_totals = {}, {}
for s in slugs:
    row = {"gates": {}}
    for g in GATES:
        tool = ROOT / "tools" / g
        if not tool.exists():
            continue
        try:
            p = subprocess.run([sys.executable, str(tool), s], cwd=str(ROOT),
                               capture_output=True, text=True, encoding="utf-8",
                               errors="replace", env=env, timeout=300)
            out = (p.stdout or "") + (p.stderr or "")
            rc = p.returncode
        except Exception as e:
            out, rc = f"{type(e).__name__}: {e}", 1
        fail_lines = [ln.strip() for ln in out.splitlines() if ln.strip().startswith("FAIL [")]
        failed = H._step_failed(rc, out)
        codes = [f["code"] for f in H.diagnose(out, g.replace(".py", ""))] if failed else []
        row["gates"][g.replace(".py", "")] = {
            "rc": rc, "fail_lines": len(fail_lines), "failed": failed, "codes": codes,
        }
        for c in codes:
            code_totals[c] = code_totals.get(c, 0) + 1
    row["clean"] = not any(v["failed"] for v in row["gates"].values())
    rows[s] = row

W = max(len(s) for s in rows)
print("topic".ljust(W), "  ".join(g.replace(".py", "")[:11].ljust(11) for g in GATES))
print("-" * (W + 11 * len(GATES)))
for s, row in rows.items():
    cells = []
    for g in GATES:
        k = g.replace(".py", "")
        v = row["gates"].get(k)
        if v is None:
            cells.append("-".ljust(11))
        elif v["failed"]:
            cells.append(f"FAIL/{len(v['codes'])}c".ljust(11))
        else:
            cells.append(".".ljust(11))
    print(s.ljust(W), "  ".join(cells), "" if row["clean"] else "  <-- failing")

clean = [s for s, r in rows.items() if r["clean"]]
print(f"\nCLEAN   {len(clean)}/{len(rows)}: {', '.join(clean)}")
print(f"FAILING {len(rows)-len(clean)}/{len(rows)}: {', '.join(s for s, r in rows.items() if not r['clean'])}")

print("\nREASON CODE FREQUENCY (how often each diagnosis fires across the repo)")
for c, n in sorted(code_totals.items(), key=lambda kv: -kv[1]):
    print(f"  {n:>3}  {c}")

out = HERE / "results" / "repo_gate_map.json"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(json.dumps({"topics": rows, "code_totals": code_totals}, indent=2),
               encoding="utf-8")
print(f"\nwrote {out}")
