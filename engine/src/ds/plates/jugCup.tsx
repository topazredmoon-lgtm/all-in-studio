/**
 * **JugCup** — "So the next model learns from pages the last model wrote."
 *
 * An impossible closed pour. A heavy earthenware jug pours from its beak into a small cup; the cup has a spout of its
 * own and pours straight back up and over into the mouth of the jug. Two red streams form one circuit.
 *
 * Both vessels are surfaces of revolution: a radius profile (control points interpolated with a cosine ease) gives the
 * silhouette, the band of zig-zag glaze, the rim ellipses and the highlight lines (all computed from the same profile,
 * so they stay on the form). Handle, beaks and the streams' ribbons are tubes walked along Bezier curves. Glaze
 * highlights sit on the left, hatching on the right (light from the upper left).
 *
 * Motion: the streams are drawn on in order (jug to cup, then cup back to jug), then flow: dashed ticks travel along
 * both centrelines and ripples spread on the surface where each stream lands.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

type P = [number, number];
const f1 = (n: number) => n.toFixed(1);
const poly = (pts: P[], close = false) => 'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join(' L') + (close ? ' Z' : '');

/** radius profile: [y, r] control points, cosine-eased between */
const profile = (pts: [number, number][]) => (y: number) => {
  if (y <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (y <= pts[i][0]) {
      const f = (y - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
      const e = 0.5 - 0.5 * Math.cos(f * Math.PI);
      return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * e;
    }
  }
  return pts[pts.length - 1][1];
};

const JX = 112, JY0 = 130, JY1 = 330;
const jugR = profile([[130, 21], [142, 17], [158, 19], [182, 34], [208, 56], [238, 66], [268, 63], [298, 52], [322, 42], [330, 40]]);
const CX = 288, CY0 = 262, CY1 = 330;
const cupR = profile([[262, 48], [274, 47], [298, 38], [318, 27], [330, 23]]);

const revolve = (cx: number, y0: number, y1: number, r: (y: number) => number) => {
  const left: P[] = [], right: P[] = [];
  for (let y = y0; y <= y1; y += 2) { left.push([cx - r(y), y]); right.push([cx + r(y), y]); }
  const rb = r(y1);
  return poly(left) + ` A${f1(rb)} ${f1(rb * 0.16)} 0 0 0 ${f1(cx + rb)} ${f1(y1)} ` + poly(right.reverse()).replace('M', 'L') + ' Z';
};

const smooth = (pts: P[], n = 6): P[] => {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < n; k++) {
      const t = k / n, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};
const tube = (ctrl: P[], r0: number, r1: number) => {
  const c = smooth(ctrl, 7), n = c.length;
  const nor: P[] = c.map((_, i) => { const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [dy / l, -dx / l]; });
  const r = (i: number) => r0 + (r1 - r0) * (i / (n - 1));
  const left = c.map((p, i) => [p[0] + nor[i][0] * r(i), p[1] + nor[i][1] * r(i)] as P);
  const right = c.map((p, i) => [p[0] - nor[i][0] * r(i), p[1] - nor[i][1] * r(i)] as P);
  const cap = (i: number, from: number, to: number) => {
    const t: P = [-nor[i][1], nor[i][0]];
    const pts: P[] = [];
    for (let k = 1; k < 8; k++) { const a = from + ((to - from) * k) / 8; pts.push([c[i][0] + r(i) * (Math.cos(a) * nor[i][0] + Math.sin(a) * t[0]), c[i][1] + r(i) * (Math.cos(a) * nor[i][1] + Math.sin(a) * t[1])]); }
    return pts;
  };
  return { d: poly([...left, ...cap(n - 1, 0, Math.PI), ...right.slice().reverse(), ...cap(0, Math.PI, Math.PI * 2)], true), c };
};

type Seg = [P, P, P, P];
const sample = (segs: Seg[], per = 28) => {
  const pts: P[] = [];
  segs.forEach((s, si) => {
    for (let i = si === 0 ? 0 : 1; i <= per; i++) {
      const t = i / per, u = 1 - t;
      pts.push([u * u * u * s[0][0] + 3 * u * u * t * s[1][0] + 3 * u * t * t * s[2][0] + t * t * t * s[3][0], u * u * u * s[0][1] + 3 * u * u * t * s[1][1] + 3 * u * t * t * s[2][1] + t * t * t * s[3][1]]);
    }
  });
  return pts;
};
const ribbon = (pts: P[], w0: number, w1: number) => {
  const n = pts.length;
  const L: P[] = [], R: P[] = [];
  pts.forEach((p, i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    const w = (w0 + (w1 - w0) * (i / (n - 1))) / 2;
    L.push([p[0] + (dy / l) * w, p[1] - (dx / l) * w]);
    R.push([p[0] - (dy / l) * w, p[1] + (dx / l) * w]);
  });
  return { L: poly(L), R: poly(R), fill: poly([...L, ...R.slice().reverse()], true), c: poly(pts) };
};

// stream A: jug beak -> cup mouth.  stream B: cup spout -> up and over -> jug mouth.
const A_SEGS: Seg[] = [[[190, 158], [232, 152], [274, 192], [284, 262]]];
const B_SEGS: Seg[] = [[[360, 246], [398, 204], [390, 92], [304, 66]], [[304, 66], [236, 46], [158, 72], [124, 128]]];
const A = ribbon(sample(A_SEGS), 5, 8);
const B = ribbon(sample(B_SEGS, 36), 5, 8);

export const JugCup: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const [jug, cup] = useIds(2);
    const jugD = revolve(JX, JY0, JY1, jugR);
    const cupD = revolve(CX, CY0, CY1, cupR);
    const handle = tube([[JX - 46, 168], [JX - 90, 172], [JX - 98, 226], [JX - 62, 262]], 8, 8);
    const beak = tube([[JX + 34, 196], [JX + 58, 170], [JX + 78, 152]], 10, 5);
    const cupBeak = tube([[CX + 38, 286], [CX + 60, 262], [CX + 76, 246]], 7, 4);
    const cupHandle = tube([[CX - 44, 276], [CX - 72, 282], [CX - 74, 304], [CX - 36, 312]], 5.5, 5.5);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const since = Math.max(0, c.since);
          const a = c.at(36, 26), b = c.at(56, 40);
          const flow = c.at(60, 20);
          const dash = -since * 0.9;
          const ring = (k: number) => { const ph = ((since * 0.025 + k / 3) % 1); return ph; };

          // glaze: zig-zag band on the jug, rim ellipses
          const zig: string[] = [];
          const bandR = jugR(244);
          for (let k = 0; k <= 26; k++) {
            const th = Math.PI * (k / 26);
            const y = (k % 2 ? 232 : 256) + 0.16 * bandR * Math.sin(th);
            zig.push(`${k === 0 ? 'M' : 'L'}${f1(JX - bandR * Math.cos(th))} ${f1(y)}`);
          }
          const arcAt = (y: number, rr: number) => `M${f1(JX - rr)} ${y} A${f1(rr)} ${f1(rr * 0.16)} 0 0 0 ${f1(JX + rr)} ${y}`;
          const hl = (k: number, y0: number, y1: number) => { const pts: P[] = []; for (let y = y0; y <= y1; y += 3) pts.push([JX - jugR(y) * k, y]); return poly(pts); };
          const cupHl = (k: number, y0: number, y1: number) => { const pts: P[] = []; for (let y = y0; y <= y1; y += 3) pts.push([CX - cupR(y) * k, y]); return poly(pts); };
          const foot: string[] = [];
          for (let k = 0; k < 4; k++) foot.push(arcAt(318 + k * 3.3, jugR(318 + k * 3.3) + 0.8));
          return (
            <g style={breathe(c.frame, 1.1, 180)}>
              <Clip id={jug}>
                <path d={jugD} /><path d={handle.d} /><path d={beak.d} />
              </Clip>
              <Clip id={cup}>
                <path d={cupD} /><path d={cupBeak.d} /><path d={cupHandle.d} />
              </Clip>
              {/* ground and cast shadows */}
              <ellipse cx={JX + 36} cy={336} rx={100} ry={9} {...ink(c.shade, color.stageDeep, 1)} />
              <ellipse cx={CX + 14} cy={335} rx={64} ry={7} {...ink(c.shade, color.stageDeep, 1)} />
              <path d="M20 335 H70 M338 335 H380" {...cut(c.detail, color.ink, DETAIL)} opacity={0.55} />

              {/* the jug: handle and beak behind the body */}
              <path d={handle.d} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={handle.d} {...cut(c.contour, color.ink, INNER * 1.15)} />
              <path d={beak.d} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={beak.d} {...cut(c.contour, color.ink, INNER * 1.15)} />
              <path d={jugD} {...ink(c.contour, color.stageDeep, 1)} />
              <ellipse cx={JX} cy={JY0} rx={jugR(JY0)} ry={5.6} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={jugD} {...cut(c.contour, color.ink, CONTOUR)} />
              <ellipse cx={JX} cy={JY0} rx={jugR(JY0)} ry={5.6} {...cut(c.contour, color.ink, INNER)} />
              <ellipse cx={JX} cy={JY0} rx={jugR(JY0) - 4} ry={3.2} {...cut(c.inner, color.ink, DETAIL * 1.3)} />
              {/* neck rings, glaze band, foot rings */}
              <path d={arcAt(150, jugR(150) + 0.4) + ' ' + arcAt(164, jugR(164))} {...cut(c.inner, color.ink, INNER)} />
              <path d={arcAt(228, jugR(228)) + ' ' + arcAt(260, jugR(260))} {...cut(c.inner, color.ink, INNER)} />
              <path d={zig.join(' ').replace(/M/g, 'M')} {...cut(c.detail, color.ink, DETAIL * 1.3)} />
              <path d={foot.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
              <path d={`M${JX - 98} 212 L${JX - 86} 212 M${JX - 100} 226 L${JX - 84} 226`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              <Hatch clip={jug} p={c.shade} angle={64} gap={3.4} op={0.5} box={[JX + 18, 120, 110, 220]} />
              <Hatch clip={jug} p={c.shade} angle={64} gap={7} op={0.26} box={[JX - 60, 120, 190, 220]} />
              <Hatch clip={jug} p={c.detail} angle={-20} gap={5.5} cross op={0.2} box={[JX + 22, 240, 80, 94]} />
              <Stipple clip={jug} p={c.detail} n={360} seed={6} r={0.85} op={0.28} box={[JX - 100, 120, 200, 215]} />
              {/* glaze highlights on the left: broken lines that follow the form */}
              <path d={hl(0.7, 196, 296)} {...cut(c.inner, color.ink, INNER)} strokeDasharray="30 11 12 11 4 11" />
              <path d={hl(0.82, 210, 280)} {...cut(c.detail, color.ink, DETAIL * 1.3)} strokeDasharray="14 9 4 9" />
              <path d={hl(0.6, 150, 176)} {...cut(c.detail, color.ink, DETAIL * 1.5)} />

              {/* the cup */}
              <path d={cupHandle.d} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={cupHandle.d} {...cut(c.contour, color.ink, INNER)} />
              <path d={cupBeak.d} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={cupBeak.d} {...cut(c.contour, color.ink, INNER * 1.1)} />
              <path d={cupD} {...ink(c.contour, color.stageDeep, 1)} />
              <path d={cupD} {...cut(c.contour, color.ink, CONTOUR)} />
              <ellipse cx={CX} cy={CY0} rx={cupR(CY0)} ry={9} {...ink(c.contour, color.stageDeep, 1)} />
              <ellipse cx={CX} cy={CY0} rx={cupR(CY0)} ry={9} {...cut(c.contour, color.ink, INNER)} />
              <ellipse cx={CX} cy={CY0 + 1.5} rx={cupR(CY0) - 6} ry={5.6} {...ink(c.accent, color.red, 0.22)} />
              <path d={`M${CX - 38} ${CY0 + 2} Q${CX} ${CY0 + 10} ${CX + 38} ${CY0 + 2}`} {...cut(c.accent, color.red, DETAIL * 1.4)} />
              <path d={`M${CX - 46} 286 Q${CX} 296 ${CX + 44} 286 M${CX - 38} 298 Q${CX} 306 ${CX + 36} 298`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
              <Hatch clip={cup} p={c.shade} angle={64} gap={3.2} op={0.5} box={[CX + 4, 255, 70, 80]} />
              <Hatch clip={cup} p={c.shade} angle={64} gap={7} op={0.24} box={[CX - 70, 255, 150, 80]} />
              <Stipple clip={cup} p={c.detail} n={150} seed={14} r={0.8} op={0.28} box={[CX - 76, 255, 160, 80]} />
              <path d={cupHl(0.66, 280, 322)} {...cut(c.inner, color.ink, INNER)} strokeDasharray="20 9 7 9" />
              <path d={`M${CX - 20} 330 H${CX + 20}`} {...cut(c.inner, color.ink, INNER)} />

              {/* the two streams: ribbon, edges, travelling ticks */}
              <path d={A.fill} {...ink(a, color.red, 0.2)} />
              <path d={A.L} {...cut(a, color.red, INNER)} />
              <path d={A.R} {...cut(a, color.red, INNER)} />
              <path d={A.c} fill="none" stroke={color.ink} strokeWidth={2.2} strokeLinecap="round" strokeDasharray="1.5 11" strokeDashoffset={dash} opacity={flow * 0.85} />
              <path d={B.fill} {...ink(b, color.red, 0.2)} />
              <path d={B.L} {...cut(b, color.red, INNER)} />
              <path d={B.R} {...cut(b, color.red, INNER)} />
              <path d={B.c} fill="none" stroke={color.ink} strokeWidth={2.2} strokeLinecap="round" strokeDasharray="1.5 11" strokeDashoffset={dash - 5} opacity={flow * 0.85} />
              {[0, 1, 2].map((k) => (
                <g key={k}>
                  <ellipse cx={284} cy={CY0 + 3} rx={6 + ring(k) * 32} ry={1.6 + ring(k) * 6} fill="none" stroke={color.red} strokeWidth={1.6} opacity={flow * (1 - ring(k)) * 0.9} />
                  <ellipse cx={JX + 6} cy={JY0 + 2} rx={3 + ring(k) * 15} ry={1 + ring(k) * 3} fill="none" stroke={color.red} strokeWidth={1.4} opacity={flow * (1 - ring(k)) * 0.9} />
                </g>
              ))}
            </g>
          );
        }}
      </Plate>
    );
  };
