"""captchas-full stills review, round 1 (2026-10-08): visual fixes in ds/ and visuals/."""
from pathlib import Path
E = Path(__file__).resolve().parents[2] / "engine" / "src"


def patch(rel, pairs):
    p = E / rel
    s = p.read_text(encoding="utf-8")
    for a, b in pairs:
        assert a in s, (rel, a[:70])
        s = s.replace(a, b, 1)
    p.write_text(s, encoding="utf-8")


patch("ds/kit.tsx", [
    # the banknote read as a camera: a dollar sign in the middle, not a ring
    ("<circle cx={100} cy={101} r={22} {...(S(p, red, 5) as any)} /><path d=\"M44 78 L60 78 M140 124 L156 124\" {...S(p)} />",
     "<path d=\"M112 86 C106 80 90 80 89 90 C88 100 112 100 111 111 C110 122 92 122 87 116 M100 74 L100 128\" {...S(p, red, 6)} /><path d=\"M44 78 L60 78 M140 124 L156 124\" {...S(p)} />"),
    # bar labels sat under the baseline, outside the panel: put them on top of each bar
    ("""          <div style={{ width: bw, height: (ch * b.v / max) * prog(frame, fs[i], 20), background: b.c === 'teal' ? color.teal : color.red, borderRadius: '4px 4px 0 0' }} />
          <div style={{ ...mono(24, color.mute), position: 'relative', top: 50, height: 0, whiteSpace: 'nowrap' }}>{b.t}</div>""",
     """          <div style={{ ...mono(30, b.c === 'teal' ? color.teal : color.red), whiteSpace: 'nowrap', marginBottom: 14, opacity: prog(frame, fs[i] + 10, 10) }}>{b.t}</div>
          <div style={{ width: bw, height: (ch * b.v / max) * prog(frame, fs[i], 20), background: b.c === 'teal' ? color.teal : color.red, borderRadius: '4px 4px 0 0' }} />"""),
    ("const bw = 120, ch = h - 90;", "const bw = 140, ch = h - 120;"),
    # flow drawings were ~150 px: let them fill the slot
    ("const s = Math.min(240, slot * 0.62, h - 90);", "const s = Math.min(320, slot * 0.72, h - 110);"),
])
patch("visuals/captchas2.tsx", [
    ("  const bw = Math.min(w - 40, 520);\n  return (\n    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n      <div style={{ width: bw, background: color.raised,",
     "  const bw = Math.min(w - 20, 640);\n  return (\n    <div style={{ width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>\n      <div style={{ width: bw, background: color.raised,"),
    ("<svg width={110} height={110} viewBox=\"0 0 40 40\"", "<svg width={160} height={160} viewBox=\"0 0 40 40\""),
    ("<div style={{ ...mono(30, color.ink) }}>access denied</div>", "<div style={{ ...mono(40, color.ink) }}>access denied</div>"),
    ("padding: '12px 40px', ...mono(28, color.mute), opacity: 0.6 }}>appeal", "padding: '14px 48px', ...mono(36, color.mute), opacity: 0.7 }}>appeal"),
    ("<svg width={200} height={60} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}><path d=\"M-10 50 L190 6\"", "<svg width={240} height={70} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible' }}><path d=\"M-10 62 L230 6\""),
])
print("ok")
