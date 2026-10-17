/**
 * **Well** — a round stone well with a timber windlass, and the water a long way down.
 * The curb is coursed masonry with every stone laid by a loop: four courses, each with its own run of stone widths,
 * joints staggered half a stone from the course below, and every stone shaded by where it sits on the cylinder
 * (light from the upper left, so stones toward the right carry more burin work) with its own chipped highlight and
 * a few grains. The shaft is read as a funnel of receding course-rings that fade to near-black; the bucket and the
 * red water line sit far down in it. The frame is two posts, a tie beam and braces; the windlass has a crank,
 * and the rope is wound round the drum and pays out down the shaft.
 * Motion: the crank turns, the rope pays out, the bucket and the red water line both drop and shrink with depth.
 */
import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../engrave';
import { color } from '../tokens';

const f = (n: number) => n.toFixed(1);
const hash = (i: number, s: number) => { const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453; return x - Math.floor(x); };
const CX = 200, RY0 = 250, RX = 122, RYO = 36; // outer rim ellipse
const RXI = 98, RYI = 29; // inner (mouth) ellipse
const COURSES = 4, CH = 20;
const RINGS = 11;

/** the stone courses: for each, the angles (deg, 0 right → 180 left) at which joints fall */
const joints = (course: number) => {
  const out: number[] = [];
  let th = (course % 2 ? 0 : 7) + hash(course, 4) * 3;
  out.push(0);
  while (th < 180) {
    out.push(th);
    th += 10 + hash(out.length + course * 17, 2) * 9;
  }
  out.push(180);
  return out;
};
const wallX = (deg: number) => CX + RX * Math.cos((deg * Math.PI) / 180);
const wallY = (deg: number, level: number) => level + RYO * Math.sin((deg * Math.PI) / 180);

export const Well: React.FC<{ w: number; h: number; size?: number; at?: string | number; label?: string; labelAt?: string | number; plate?: string }> =
  ({ w, h, size, at, label, labelAt, plate }) => {
    const ids = useIds(RINGS + 4);
    const rings = ids.slice(0, RINGS), [mouth, wall, wood, roofClip] = ids.slice(RINGS);
    return (
      <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} at={at} plate={plate}>
        {(c) => {
          const t = c.at(28, 110); // everything that moves
          const crank = t * 80; // degrees
          // ---- the curb: courses, joints, per-stone shading
          const courseLines: string[] = [];
          const jointLines: string[] = [];
          const shade: string[] = [];
          const hi: string[] = [];
          const grains: React.ReactNode[] = [];
          for (let k = 0; k <= COURSES; k++) {
            const lvl = RY0 + 6 + k * CH;
            const pts: string[] = [];
            for (let d = 0; d <= 180; d += 6) pts.push(`${d ? 'L' : 'M'}${f(wallX(d))} ${f(wallY(d, lvl))}`);
            courseLines.push(pts.join(' '));
          }
          for (let k = 0; k < COURSES; k++) {
            const js = joints(k), l0 = RY0 + 6 + k * CH, l1 = l0 + CH;
            for (let j = 0; j < js.length - 1; j++) {
              const a = js[j], b = js[j + 1];
              if (j > 0) jointLines.push(`M${f(wallX(a))} ${f(wallY(a, l0))} L${f(wallX(a) + (hash(j, k) - 0.5) * 2)} ${f(wallY(a, l1))}`);
              // this stone's tone: right of centre = away from the light
              const mid = (a + b) / 2;
              const dark = 0.12 + 0.88 * ((1 + Math.cos((mid * Math.PI) / 180)) / 2) + k * 0.03;
              const gap = 8 - 5.2 * Math.min(1, dark);
              const nLines = Math.max(1, Math.floor(((b - a) * RX * 0.0175) / gap));
              for (let q = 0; q < nLines; q++) {
                const u = a + (b - a) * ((q + 0.8) / (nLines + 0.9));
                const x0 = wallX(u), y0 = wallY(u, l0) + 2.5, y1 = wallY(u, l1) - 2;
                shade.push(`M${f(x0)} ${f(y0 + (q % 2) * 1.5)} L${f(x0 - 3.4)} ${f(y1 - (q % 2) * 2)}`);
              }
              // a chipped highlight at the upper left of each stone, and its grain
              const ux = wallX(b - 1.2) + 2, uy = wallY(b - 1.2, l0) + 3;
              hi.push(`M${f(ux)} ${f(uy)} Q${f(ux + 2)} ${f(uy + 4)} ${f(ux + 1)} ${f(uy + 8)}`);
              for (let g = 0; g < 3; g++) {
                const uu = a + (b - a) * hash(j * 7 + g, k + 11), yy = wallY(uu, l0 + 5 + hash(g + j, k) * (CH - 10));
                grains.push(<circle key={`${k}-${j}-${g}`} cx={f(wallX(uu))} cy={f(yy)} r={0.9} />);
              }
            }
          }
          // ---- the top of the curb: radial joints in the capstones
          const caps: string[] = [];
          for (let i = 0; i < 26; i++) {
            const a = ((i + hash(i, 3) * 0.4) / 26) * Math.PI * 2;
            caps.push(`M${f(CX + RXI * Math.cos(a))} ${f(RY0 + RYI * Math.sin(a))} L${f(CX + RX * Math.cos(a))} ${f(RY0 + RYO * Math.sin(a))}`);
          }
          // ---- the shaft: receding course-rings, each darker; opacity falls toward the bottom
          const ringEll = (k: number) => {
            const s = Math.pow(0.84, k);
            return { cx: CX, cy: RY0 + k * 2.3, rx: RXI * s, ry: RYI * s };
          };
          const waterK = 8.8 + 1.4 * t, bucketK = 2.6 + 2.6 * t;
          const wEll = ringEll(waterK), bEll = ringEll(bucketK);
          // rope: from the drum down the middle of the funnel to the bucket
          const ropeTop = 120, ropeBot = bEll.cy - 16 * Math.pow(0.84, bucketK) * 1.1;
          const twist: string[] = [];
          for (let y = ropeTop + 3; y < ropeBot; y += 4.6) twist.push(`M${f(CX - 2.2)} ${f(y)} L${f(CX + 2.2)} ${f(y + 3)}`);
          // rope coils on the drum, fewer as it pays out
          const coils: string[] = [];
          const nCoil = Math.round(13 - 4 * t);
          for (let i = 0; i < nCoil; i++) {
            const x = 264 - i * 6.4;
            coils.push(`M${f(x)} 89 Q${f(x + 5)} 104 ${f(x - 1)} 119`);
          }
          const bs = Math.pow(0.84, bucketK);
          const bucket = (s: number, cy: number) => {
            const tr = 15 * s, br = 11 * s, hgt = 24 * s, ty = cy - hgt / 2, by = cy + hgt / 2;
            return { tr, br, ty, by };
          };
          const B = bucket(bs * 1.55, bEll.cy);
          const cr = (34 * Math.cos((crank * Math.PI) / 180));
          return (
            <g style={breathe(c.frame, 1.1, 220)}>
              <Clip id={mouth}><ellipse cx={CX} cy={RY0} rx={RXI} ry={RYI} /></Clip>
              {rings.map((id, k) => { const e = ringEll(k); return <Clip key={id} id={id}><ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} /></Clip>; })}
              <Clip id={wall} d={`M${CX - RX} ${RY0} L${CX - RX} ${RY0 + 6 + COURSES * CH} A${RX} ${RYO} 0 0 0 ${CX + RX} ${RY0 + 6 + COURSES * CH} L${CX + RX} ${RY0} A${RX} ${RYO} 0 0 1 ${CX - RX} ${RY0} Z`} />
              <Clip id={wood}><rect x={77} y={58} width={14} height={198} /><rect x={309} y={58} width={14} height={198} /><rect x={66} y={54} width={268} height={14} /></Clip>

              {/* ground, and the cast shadow of the well on it */}
              <ellipse cx={226} cy={RY0 + 6 + COURSES * CH + 8} rx={150} ry={19} {...ink(c.shade, color.stageDeep, 0.95)} />
              <path d={`M40 ${RY0 + 6 + COURSES * CH + 14} L150 ${RY0 + 6 + COURSES * CH + 14} M64 ${RY0 + 6 + COURSES * CH + 22} L130 ${RY0 + 6 + COURSES * CH + 22} M270 ${RY0 + 6 + COURSES * CH + 18} L372 ${RY0 + 6 + COURSES * CH + 18} M300 ${RY0 + 6 + COURSES * CH + 26} L360 ${RY0 + 6 + COURSES * CH + 26}`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.4} />

              {/* the mouth: a dark funnel; ring opacity and hatch weight fall with depth until it is black */}
              <ellipse cx={CX} cy={RY0} rx={RXI} ry={RYI} {...ink(c.contour, color.stageDeep, 1)} />
              {rings.map((id, k) => {
                if (k === 0) return null;
                const e = ringEll(k), op = Math.max(0.06, 0.85 - k * 0.1);
                return (
                  <g key={id}>
                    <ellipse cx={e.cx} cy={e.cy} rx={e.rx} ry={e.ry} {...cut(c.inner, color.ink, k < 3 ? INNER : DETAIL * 1.3)} opacity={op} />
                    <Hatch clip={id} p={c.shade} angle={34 + k * 4} gap={Math.max(3, 8 - k * 0.5)} op={0.26 * op} box={[CX - RXI, RY0 - RYI, RXI * 2, RYI * 2 + 20]} />
                  </g>
                );
              })}
              {/* joints between the stones of the shaft wall, radial and receding */}
              <path d={Array.from({ length: 22 }, (_, i) => { const a = (i / 22) * Math.PI * 2, e0 = ringEll(0), e1 = ringEll(3.2); return `M${f(e0.cx + e0.rx * Math.cos(a))} ${f(e0.cy + e0.ry * Math.sin(a))} L${f(e1.cx + e1.rx * Math.cos(a))} ${f(e1.cy + e1.ry * Math.sin(a))}`; }).join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.4} />
              <Stipple clip={rings[1]} p={c.detail} n={160} seed={5} r={0.9} op={0.22} box={[CX - RXI, RY0 - RYI, RXI * 2, RYI * 2 + 10]} />
              {/* the water, a long way down and falling: a small red ellipse with its ripple */}
              <ellipse cx={wEll.cx} cy={wEll.cy} rx={wEll.rx} ry={wEll.ry} {...ink(c.accent, color.stageDeep, 1)} />
              <ellipse cx={wEll.cx} cy={wEll.cy} rx={wEll.rx} ry={wEll.ry} {...cut(c.accent, color.red, INNER * 1.1)} />
              <ellipse cx={wEll.cx} cy={wEll.cy} rx={wEll.rx * 0.58} ry={wEll.ry * 0.5} {...cut(c.accent, color.red, DETAIL)} opacity={0.8} />
              <path d={`M${f(wEll.cx - wEll.rx * 0.5)} ${f(wEll.cy + wEll.ry * 0.1)} L${f(wEll.cx + wEll.rx * 0.5)} ${f(wEll.cy + wEll.ry * 0.1)}`} {...cut(c.accent, color.red, DETAIL * 1.1)} opacity={0.8} />
              {/* the rim: outer and inner contours, the capstone joints */}
              <ellipse cx={CX} cy={RY0} rx={RX} ry={RYO} {...cut(c.contour, color.ink, CONTOUR)} />
              <ellipse cx={CX} cy={RY0} rx={RXI} ry={RYI} {...cut(c.inner, color.ink, INNER * 1.2)} />
              <path d={caps.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.75} />
              <ellipse cx={CX} cy={RY0 + 2} rx={RXI + 10} ry={RYI + 4} {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />

              {/* bucket far down: staves, two hoops, bail */}
              <g>
                <ellipse cx={CX} cy={B.ty} rx={B.tr} ry={B.tr * 0.3} {...cut(c.inner, color.ink, DETAIL * 1.5)} />
                <path d={`M${f(CX - B.tr)} ${f(B.ty)} L${f(CX - B.br)} ${f(B.by)} A${f(B.br)} ${f(B.br * 0.3)} 0 0 0 ${f(CX + B.br)} ${f(B.by)} L${f(CX + B.tr)} ${f(B.ty)}`} {...cut(c.contour, color.ink, INNER * 1.2)} />
                <path d={[-0.55, -0.2, 0.2, 0.55].map((u) => `M${f(CX + B.tr * u)} ${f(B.ty + B.tr * 0.3 * Math.sqrt(1 - u * u))} L${f(CX + B.br * u)} ${f(B.by + B.br * 0.3 * Math.sqrt(1 - u * u))}`).join(' ')} {...cut(c.detail, color.ink, DETAIL)} />
                <path d={`M${f(CX - B.tr * 0.93)} ${f(B.ty + B.tr * 0.2 + 1)} Q${CX} ${f(B.ty + B.tr * 0.6)} ${f(CX + B.tr * 0.93)} ${f(B.ty + B.tr * 0.2 + 1)} M${f(CX - B.br * 0.97)} ${f(B.by - B.br * 0.2)} Q${CX} ${f(B.by + B.br * 0.2)} ${f(CX + B.br * 0.97)} ${f(B.by - B.br * 0.2)}`} {...cut(c.inner, color.ink, DETAIL * 1.4)} />
                <path d={`M${f(CX - B.tr)} ${f(B.ty)} Q${CX} ${f(B.ty - B.tr * 1.5)} ${f(CX + B.tr)} ${f(B.ty)}`} {...cut(c.detail, color.ink, DETAIL * 1.3)} />
              </g>

              {/* the curb wall: coursed masonry, every stone shaded by its place on the cylinder */}
              <path d={`M${CX - RX} ${RY0} L${CX - RX} ${RY0 + 6 + COURSES * CH} A${RX} ${RYO} 0 0 0 ${CX + RX} ${RY0 + 6 + COURSES * CH} L${CX + RX} ${RY0}`} {...cut(c.contour, color.ink, CONTOUR)} />
              <path d={courseLines.join(' ')} {...cut(c.inner, color.ink, INNER)} />
              <path d={jointLines.join(' ')} {...cut(c.inner, color.ink, INNER * 0.85)} />
              <path d={shade.join(' ')} {...cut(c.shade, color.ink, DETAIL)} opacity={0.62} />
              <path d={hi.join(' ')} {...cut(c.detail, color.ink, DETAIL * 1.5)} opacity={0.9} />
              <g clipPath={`url(#${wall})`} fill={color.ink} opacity={c.detail * 0.45}>{grains}</g>
              <Hatch clip={wall} p={c.shade} angle={90} gap={11} op={0.1} box={[CX - RX, RY0, RX * 2, 100]} />
              <Hatch clip={wall} p={c.shade} angle={12} gap={3} op={0.25} box={[CX + 50, RY0 + 10, 76, 90]} />

              {/* the frame: posts, tie beam, braces */}
              {[84, 316].map((x) => (
                <g key={x}>
                  <path d={`M${x - 7} 68 L${x - 7} 258 M${x + 7} 68 L${x + 7} 258`} {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
                  <path d={`M${x - 7} 258 L${x + 7} 258`} {...cut(c.inner, color.ink, INNER)} />
                  <path d={`M${x - 2} 70 Q${x - 3} 130 ${x - 2} 190 Q${x - 1} 230 ${x - 3} 256 M${x + 2} 72 Q${x + 3} 140 ${x + 1} 200`} {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
                  <ellipse cx={x} cy={104} rx={11} ry={11} {...cut(c.inner, color.ink, INNER)} />
                  <circle cx={x} cy={104} r={3} {...ink(c.detail, color.ink)} />
                </g>
              ))}
              <Hatch clip={wood} p={c.shade} angle={90} gap={2.8} op={0.34} box={[60, 54, 280, 204]} />
              <path d="M66 54 L334 54 L334 68 L66 68 Z" {...cut(c.contour, color.ink, CONTOUR * 0.8)} />
              <path d="M72 59 L180 59 M200 62 L326 62 M92 65 L150 65" {...cut(c.detail, color.ink, DETAIL)} opacity={0.7} />
              <path d="M91 188 L140 68 M309 188 L260 68" {...cut(c.inner, color.ink, INNER)} />
              <path d="M91 196 L144 70 M309 196 L256 70" {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />


              {/* roof: shingle rows struck parallel to the eave, the right slope in shadow */}
              <Clip id={roofClip} d="M52 54 L200 14 L348 54 Z" />
              <path d="M52 54 L200 14 L348 54 Z" {...cut(c.contour, color.ink, CONTOUR * 0.9)} />
              <path d="M62 54 L200 20 L338 54" {...cut(c.detail, color.ink, DETAIL)} opacity={0.5} />
              <path d={Array.from({ length: 6 }, (_, r) => { const y = 54 - 6.4 * (r + 1); const x0 = 52 + 3.7 * (54 - y), x1 = 348 - 3.7 * (54 - y); return `M${f(x0)} ${f(y)} L${f(x1)} ${f(y)}`; }).join(' ')} {...cut(c.inner, color.ink, INNER * 0.8)} />
              <path d={Array.from({ length: 6 }, (_, r) => { const y0 = 54 - 6.4 * r, y1 = y0 - 6.4; const out: string[] = []; for (let x = 60 + (r % 2) * 7; x < 342; x += 14) { const lo = 52 + 3.7 * (54 - y0), hi2 = 348 - 3.7 * (54 - y0); if (x > lo + 2 && x < hi2 - 2) out.push(`M${f(x)} ${f(y0)} L${f(x)} ${f(y1)}`); } return out.join(' '); }).join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
              <Hatch clip={roofClip} p={c.shade} angle={-70} gap={3.4} op={0.32} box={[200, 12, 150, 44]} />
              <Hatch clip={roofClip} p={c.shade} angle={-70} gap={9} op={0.14} box={[52, 12, 150, 44]} />
              {/* the windlass: drum, rope coils, axle, crank */}
              <path d="M91 89 L309 89 M91 119 L309 119" {...cut(c.contour, color.ink, CONTOUR * 0.7)} />
              <path d="M105 89 L105 119 M295 89 L295 119" {...cut(c.inner, color.ink, INNER)} />
              <path d={coils.join(' ')} {...cut(c.inner, color.ink, INNER * 0.9)} />
              <path d={coils.map((_, i) => { const x = 264 - i * 6.4 - 3; return `M${f(x)} 94 L${f(x + 3)} 99 M${f(x)} 108 L${f(x + 3)} 113`; }).join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.8} />
              <path d="M110 92 L140 92 M112 96 L146 96" {...cut(c.detail, color.ink, DETAIL)} opacity={0.6} />
              <path d="M110 114 L290 114" {...cut(c.shade, color.ink, DETAIL * 1.6)} opacity={0.6} />
              <path d="M321 101 L346 101 M321 107 L346 107 M346 101 Q350 104 346 107" {...cut(c.inner, color.ink, INNER)} />
              <path d={`M340 104 L340 ${f(104 + cr)} M334 104 L334 ${f(104 + cr)}`} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M334 ${f(104 + cr)} Q337 ${f(104 + cr + 3 * Math.sign(cr || 1))} 340 ${f(104 + cr)}`} {...cut(c.inner, color.ink, INNER)} />
              <path d={`M337 ${f(104 + cr)} L${f(352 - 4 * Math.abs(Math.sin((crank * Math.PI) / 180)))} ${f(104 + cr)}`} {...cut(c.contour, color.ink, CONTOUR * 0.9)} />
              <circle cx={352} cy={104 + cr} r={3.4} {...ink(c.detail, color.ink)} />

              {/* the rope down the shaft */}
              <path d={`M${CX - 2.4} ${ropeTop} L${CX - 2.4} ${f(ropeBot)} M${CX + 2.4} ${ropeTop} L${CX + 2.4} ${f(ropeBot)}`} {...cut(c.inner, color.ink, INNER * 0.8)} />
              <path d={twist.join(' ')} {...cut(c.detail, color.ink, DETAIL)} opacity={0.85} />
            </g>
          );
        }}
      </Plate>
    );
  };
