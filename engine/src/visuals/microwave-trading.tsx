/**
 * Topic visuals: THE SPEED OF GREED (The 3-Nanosecond War).
 * The covert microwave towers, mountain tunnels, and nanosecond latency war of Wall Street.
 *
 * 100% UNBOXED DESIGN PRINT AESTHETIC (Captchas v2 / Minimal Print Standard).
 * ZERO BOXED CONTAINERS / ZERO DOSSIERDOC / ZERO LAZY REPETITION.
 * Every single cut (14/14) features a unique, bespoke woodcut engraving plate on the Left
 * paired with a refined, unboxed print typography & technical diagram on the Right.
 *
 * 14 BESPOKE WOODCUT ENGRAVING PLATES (ds/engrave.tsx):
 *   1. FiberCorePlate          - Silica optical fiber cross-section with total internal reflection
 *   2. SnellRefractionPlate    - Snell's Law refraction ray diagram ($n=1.47$ bending & wave compression)
 *   3. AlleghenyTunnelPlate    - Rugged Allegheny mountain cross-section & subterranean rock bore
 *   4. CorridorMapPlate        - Chicago CME to New Jersey NASDAQ 825-mile vector route corridor map
 *   5. MillisecondVernierPlate - Precision mechanical vernier chronometer dial ($\Delta 3.0$ ms shaved)
 *   6. DishAntennaPlate        - Parabolic microwave dish on steel tripod mount with radiating wavefronts
 *   7. ColdWarRadarPlate       - Cold War surveillance radar mast retrofitted with high-frequency dishes
 *   8. RelayChainPlate         - 15-tower line-of-sight microwave relay hops across Midwest farmland
 *   9. MicrowaveDrumPlate      - Close-up 243m communications mast top with cylindrical drum radomes
 *  10. CurvaturePlate          - Earth horizon curvature, 44ft bulge, and line-of-sight tangent ray
 *  11. CabbageFieldPlate       - Belgian cabbage field rival tower duel (+8ft height RF shadow war)
 *  12. StrippedWirePlate       - Twinaxial server cable stripped to bare copper air dielectric (-2.1ns)
 *  13. HollowCorePlate         - Photonic crystal hollow-core fiber cross-section (central vacuum core)
 *  14. LaserTurretPlate        - Rooftop atmospheric optical transceiver turret firing 1550nm laser pulse
 *
 * 14 UNBOXED EDITORIAL DESIGN PRINTS (ds/tokens.ts + ds/core.tsx):
 *   1. SpeedPrint              - Maxwell transmission velocity comparison in silica glass vs air vs vacuum
 *   2. CapitalWarPrint         - $30 Billion latency arms race trigger & physical optical constraints
 *   3. SpreadLedgerPrint       - Spread Networks $300M private right-of-way capital ledger & tunnel specs
 *   4. LatencyCollapsePrint    - Pure vector latency collapse curve (16.5ms down to 13.1ms)
 *   5. MonopolyRentPrint       - 18-Month trading monopoly cash flow ($300k/mo conduit lease economics)
 *   6. MaxwellWavePrint        - Electrodynamic wave equation ($c / n$, 99.9% speed of light in air)
 *   7. CableObsolescencePrint  - $300M fiber asset write-down & 18-month technology obsolescence
 *   8. FCCSpectrumPrint        - FCC Form 601 Private Microwave Radio Service 11.2 GHz authorization
 *   9. EightPointTwoChart      - Latency milestone comparison (13.1ms fiber vs 8.24ms microwave)
 *  10. CurvaturePhysicsPrint   - Planetary line-of-sight geometry ($h = d^2 / 2R$) & tropospheric ducting
 *  11. ZoningWarPrint          - Houtem West Flanders municipal planning dispute & 243m mast obstruction
 *  12. NanosecondHardwarePrint - Server rack internal propagation budget (-2.1ns air + 1.8ns FPGA kernel)
 *  13. HollowCoreSpecsPrint    - Photonic crystal hollow-core specifications ($n = 1.0003$, vacuum latency)
 *  14. OrderBookArbitragePrint - CME matching engine retail 401(k) order front-run by 3 nanoseconds
 *
 * SCHEDULE RULE: Every plate cuts in at frame 0 (contour -> inner -> shade -> detail).
 * Only internal motion (beams, wavefronts, dials, pulses) waits for spoken cue words.
 * BOUNDARY RULE: All annotations & note leader lines stay strictly within [25, 375] in viewBox.
 */
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Note, Plate, Stipple, VB, breathe, cut, ink, useIds } from '../ds/engrave';
import { mono, prog, serif, useCue } from '../ds/core';
import { color, font } from '../ds/tokens';

const C = VB / 2;
const INK = color.ink;

type Box = { w: number; h: number };

// ============================================================================
// 14 BESPOKE WOODCUT ENGRAVING PLATES (LEFT COLUMN)
// ============================================================================

// ---------------------------------------------------------------- 1. FiberCorePlate
/** An engraved longitudinal cross-section of an optical fiber showing internal reflection and the 31% speed penalty. */
export const FiberCorePlate: React.FC<Box & { beamAt?: string | number; plate?: string }> = ({
  w,
  h,
  beamAt,
  plate,
}) => {
  const [cladding, core] = useIds(2);
  const beamF = useCue(beamAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const pulse = prog(c.frame, beamF, 45);
        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 142} rx={140} ry={16} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Outer cladding bounds */}
            <path d="M40 100 L360 100 L360 300 L40 300 Z" {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={cladding} d="M40 100 L360 100 L360 300 L40 300 Z" />

            {/* Glass cladding hatching */}
            <Hatch clip={cladding} p={c.shade} angle={45} gap={14} op={0.2} />
            <Stipple clip={cladding} p={c.detail} n={180} seed={7} op={0.16} />

            {/* Inner silica core channel */}
            <path d="M40 160 L360 160 M40 240 L360 240" {...cut(c.inner, INK, INNER)} />
            <Clip id={core} d="M40 160 L360 160 L360 240 L40 240 Z" />
            <Hatch clip={core} p={c.shade} angle={-45} gap={10} op={0.28} />

            {/* Total internal reflection ray zigzag */}
            <path
              d="M40 200 L100 164 L180 236 L260 164 L340 236 L360 218"
              {...cut(c.contour, INK, INNER, '6 6')}
            />

            {/* Traveling laser beam packet */}
            {pulse > 0 && (
              <g>
                <path
                  d="M40 200 L100 164 L180 236 L260 164 L340 236 L360 218"
                  fill="none"
                  stroke={color.red}
                  strokeWidth={CONTOUR}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="0.25 1"
                  strokeDashoffset={1 - pulse * 1.25}
                />
                <circle
                  cx={40 + pulse * 320}
                  cy={200 + Math.sin(pulse * Math.PI * 4) * 32}
                  r={7}
                  {...ink(1, color.red)}
                />
              </g>
            )}

            {/* Core label and index marker */}
            <text
              x={C}
              y={206}
              textAnchor="middle"
              fill={INK}
              fontFamily="AllinMono, Consolas, monospace"
              fontSize={17}
              letterSpacing="0.16em"
              opacity={c.inner * 0.75}
            >
              SILICA CORE · n = 1.47
            </text>
            <Note x={345} y={70} to={[260, 164]} t="-31% SPEED" p={prog(c.frame, beamF + 15, 12)} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 2. SnellRefractionPlate
/** Snell's Law optical refraction interface: light incident on high-density glass bends toward the normal line. */
export const SnellRefractionPlate: React.FC<Box & { beamAt?: string | number; plate?: string }> = ({
  w,
  h,
  beamAt,
  plate,
}) => {
  const [glassMedium] = useIds(1);
  const beamF = useCue(beamAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const pulse = prog(c.frame, beamF, 45);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 142} rx={138} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Lower glass medium block */}
            <path d="M40 200 L360 200 L360 330 L40 330 Z" {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={glassMedium} d="M40 200 L360 200 L360 330 L40 330 Z" />
            <Hatch clip={glassMedium} p={c.shade} angle={45} gap={12} op={0.24} />
            <Stipple clip={glassMedium} p={c.detail} n={190} seed={11} op={0.16} />

            {/* Normal dashed axis */}
            <line x1={200} y1={60} x2={200} y2={330} {...cut(c.inner, INK, INNER, '6 6')} />

            {/* Boundary interface line */}
            <line x1={36} y1={200} x2={364} y2={200} {...cut(c.contour, INK, CONTOUR)} />

            {/* Incident ray in air (48 deg angle) */}
            <line x1={80} y1={80} x2={200} y2={200} {...cut(c.contour, INK, CONTOUR)} />

            {/* Refracted ray in glass (bent toward normal to 28 deg) */}
            <line x1={200} y1={200} x2={264} y2={325} {...cut(c.contour, INK, CONTOUR)} />

            {/* Incident angle arc theta_1 */}
            <path d="M200 135 A 65 65 0 0 0 154 154" fill="none" stroke={color.mute} strokeWidth={DETAIL} />
            <text x={160} y={142} fill={color.mute} fontFamily={font.mono} fontSize={13}>θ₁=45°</text>

            {/* Refracted angle arc theta_2 */}
            <path d="M200 260 A 60 60 0 0 0 230 252" fill="none" stroke={color.red} strokeWidth={DETAIL} />
            <text x={226} y={276} fill={color.red} fontFamily={font.mono} fontSize={13}>θ₂=29°</text>

            {/* Compressed wavefront lines in glass */}
            {[230, 255, 280, 305].map((y, i) => (
              <line key={i} x1={70} y1={y} x2={160} y2={y} {...cut(c.detail, INK, DETAIL, '3 4')} />
            ))}

            {/* Animated traveling photon packet */}
            {pulse > 0 && (
              <g>
                {pulse < 0.5 ? (
                  <circle
                    cx={80 + pulse * 2 * 120}
                    cy={80 + pulse * 2 * 120}
                    r={6}
                    fill={color.red}
                  />
                ) : (
                  <circle
                    cx={200 + (pulse - 0.5) * 2 * 64}
                    cy={200 + (pulse - 0.5) * 2 * 125}
                    r={6}
                    fill={color.red}
                  />
                )}
              </g>
            )}

            <Note x={65} y={110} to={[140, 140]} t="AIR · n₁ = 1.00" p={c.inner} anchor="start" />
            <Note x={345} y={250} to={[264, 260]} t="SILICA · n₂ = 1.47" p={c.inner} anchor="end" />
            <Note x={345} y={75} to={[200, 200]} t="SNELL'S BEND" p={pulse} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 3. AlleghenyTunnelPlate
/** Geological mountain cross-section: Spread Networks subterranean tunnel bored straight through rock. */
export const AlleghenyTunnelPlate: React.FC<Box & { tunnelAt?: string | number; plate?: string }> = ({
  w,
  h,
  tunnelAt,
  plate,
}) => {
  const [rock] = useIds(1);
  const tunnelF = useCue(tunnelAt, 0);

  const mountainOutline = 'M36 300 L90 280 L150 215 L210 145 L255 175 L305 255 L364 300 L364 330 L36 330 Z';

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const tunnelProg = prog(c.frame, tunnelF, 45);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 144} rx={142} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Mountain rock strata */}
            <path d={mountainOutline} {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={rock} d={mountainOutline} />
            <Hatch clip={rock} p={c.shade} angle={52} gap={11} op={0.25} />
            <Stipple clip={rock} p={c.detail} n={240} seed={9} op={0.2} />

            {/* Geological fissure lines */}
            <path d="M150 215 L170 260 M210 145 L225 240 M255 175 L245 250" {...cut(c.detail, INK, DETAIL)} />

            {/* Subterranean horizontal tunnel bore straight through the rock */}
            <line x1={40} y1={285} x2={360} y2={285} {...cut(c.inner, INK, INNER, '6 6')} />
            <rect x={40} y={280} width={320} height={10} fill="rgba(0,0,0,0.4)" />

            {/* Tunnel boring machine advancement laser in red */}
            {tunnelProg > 0 && (
              <line
                x1={40}
                y1={285}
                x2={40 + tunnelProg * 320}
                y2={285}
                stroke={color.red}
                strokeWidth={CONTOUR}
                strokeLinecap="round"
              />
            )}

            {/* Mountain peak altitude marker */}
            <circle cx={210} cy={145} r={4} {...cut(c.contour, INK, DETAIL)} />
            <line x1={210} y1={145} x2={210} y2={110} {...cut(c.detail, INK, DETAIL, '3 3')} />

            <Note x={210} y={85} to={[210, 145]} t="ALLEGHENY RIDGE · 2,900 FT" p={c.inner} anchor="middle" />
            <Note x={345} y={355} to={[300, 285]} t="825-MILE BORE" p={tunnelProg} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 4. CorridorMapPlate
/** Chicago to New Jersey geographic vector route corridor: curved legacy route vs straight Spread trench. */
export const CorridorMapPlate: React.FC<Box & { routeAt?: string | number; plate?: string }> = ({
  w,
  h,
  routeAt,
  plate,
}) => {
  const routeF = useCue(routeAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const pulse = prog(c.frame, routeF, 45);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 142} rx={140} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Regional border contours (IL, IN, OH, PA, NJ) */}
            <path
              d="M45 130 L110 130 L110 270 L45 270 Z M110 130 L170 130 L170 270 L110 270 M170 130 L240 130 L240 270 L170 270 M240 130 L320 130 L320 270 L240 270 M320 160 L355 160 L355 250 L320 250"
              {...cut(c.inner, INK, INNER, '4 8')}
            />

            {/* Allegheny mountain barrier hatching in PA */}
            <path d="M260 140 Q280 200 270 260" stroke={color.mute} strokeWidth={DETAIL} strokeDasharray="2 4" />
            <path d="M275 140 Q295 200 285 260" stroke={color.mute} strokeWidth={DETAIL} strokeDasharray="2 4" />

            {/* Old legacy rail fiber route (curved & winding around mountains) */}
            <path
              d="M70 200 C110 150, 180 145, 230 155 C270 165, 300 220, 335 200"
              fill="none"
              stroke={color.mute}
              strokeWidth={INNER}
              strokeDasharray="5 5"
            />

            {/* New Spread Networks laser-straight route */}
            <line x1={70} y1={200} x2={335} y2={200} {...cut(c.contour, INK, CONTOUR)} />

            {/* Animated laser transmission along straight route */}
            {pulse > 0 && (
              <line
                x1={70}
                y1={200}
                x2={70 + pulse * 265}
                y2={200}
                stroke={color.red}
                strokeWidth={CONTOUR * 1.2}
                strokeLinecap="round"
              />
            )}

            {/* Chicago CME node */}
            <circle cx={70} cy={200} r={7} {...cut(c.contour, INK, CONTOUR)} />
            <circle cx={70} cy={200} r={4} fill={color.red} />
            <text x={70} y={235} textAnchor="middle" fill={INK} fontFamily={font.mono} fontSize={14}>
              CME
            </text>

            {/* New Jersey NASDAQ node */}
            <circle cx={335} cy={200} r={7} {...cut(c.contour, INK, CONTOUR)} />
            <circle cx={335} cy={200} r={4} fill={color.red} />
            <text x={335} y={235} textAnchor="middle" fill={INK} fontFamily={font.mono} fontSize={14}>
              NASDAQ
            </text>

            <Note x={170} y={85} to={[170, 150]} t="LEGACY: 980 MI" p={c.inner} anchor="middle" />
            <Note x={200} y={305} to={[200, 200]} t="SPREAD: 825 MI (-155 MI)" p={pulse} anchor="middle" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 5. MillisecondVernierPlate
/** Precision mechanical vernier chronometer: circular dial highlighting the 3.00 millisecond advantage. */
export const MillisecondVernierPlate: React.FC<Box & { needleAt?: string | number; plate?: string }> = ({
  w,
  h,
  needleAt,
  plate,
}) => {
  const needleF = useCue(needleAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const sweep = prog(c.frame, needleF, 40);
        const angle = -Math.PI / 2 + sweep * (Math.PI * 0.6); // Rotates from 0ms to 3ms (108 deg)

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 146} rx={135} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Outer chronometer dial bezel */}
            <circle cx={C} cy={C} r={130} {...cut(c.contour, INK, CONTOUR)} />
            <circle cx={C} cy={C} r={122} {...cut(c.inner, INK, INNER)} />
            <circle cx={C} cy={C} r={116} {...cut(c.detail, INK, DETAIL)} />

            {/* Red highlighted 3.0ms sector (0ms to 3ms arc) */}
            <path
              d={`M 200 200 L 200 84 A 116 116 0 0 1 ${200 + 116 * Math.sin(Math.PI * 0.6)} ${200 - 116 * Math.cos(Math.PI * 0.6)} Z`}
              fill="rgba(230, 57, 70, 0.16)"
            />

            {/* Radial calibration ticks (10 major ticks around dial) */}
            {Array.from({ length: 20 }, (_, i) => {
              const a = -Math.PI / 2 + (i / 20) * (2 * Math.PI);
              const r1 = i % 2 === 0 ? 104 : 110;
              const r2 = 116;
              return (
                <line
                  key={i}
                  x1={C + r1 * Math.cos(a)}
                  y1={C + r1 * Math.sin(a)}
                  x2={C + r2 * Math.cos(a)}
                  y2={C + r2 * Math.sin(a)}
                  {...cut(c.inner, INK, i % 2 === 0 ? INNER : DETAIL)}
                />
              );
            })}

            {/* Number markers 0, 1, 2, 3, 5, 8 */}
            <text x={200} y={74} textAnchor="middle" fill={INK} fontFamily={font.mono} fontSize={14}>0</text>
            <text x={256} y={100} textAnchor="middle" fill={color.red} fontFamily={font.mono} fontSize={14} fontWeight={700}>3ms</text>
            <text x={312} y={205} textAnchor="middle" fill={INK} fontFamily={font.mono} fontSize={14}>5</text>
            <text x={200} y={305} textAnchor="middle" fill={INK} fontFamily={font.mono} fontSize={14}>10ms</text>

            {/* Sweep needle pointer */}
            <line
              x1={C}
              y1={C}
              x2={C + 106 * Math.cos(angle)}
              y2={C + 106 * Math.sin(angle)}
              stroke={color.red}
              strokeWidth={CONTOUR}
              strokeLinecap="round"
            />
            <circle cx={C} cy={C} r={10} {...cut(c.contour, INK, CONTOUR)} />
            <circle cx={C} cy={C} r={4} fill={color.red} />

            <Note x={360} y={50} to={[285, 110]} t="Δ 3.00 MS" p={sweep} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 6. DishAntennaPlate
/** Heavy parabolic microwave dish on structural steel tripod gantry with radiating wavefront rings. */
export const DishAntennaPlate: React.FC<Box & { waveAt?: string | number; plate?: string }> = ({
  w,
  h,
  waveAt,
  plate,
}) => {
  const [dish] = useIds(1);
  const waveF = useCue(waveAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const wave = prog(c.frame, waveF, 40);

        return (
          <g style={breathe(c.frame)}>
            {/* Ground shadow */}
            <ellipse cx={C} cy={C + 146} rx={120} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Mast and support tripod */}
            <path d="M120 330 L170 190 L170 140 L230 140 L230 190 L280 330" {...cut(c.contour, INK, CONTOUR)} />
            <path d="M145 260 L255 260 M158 220 L242 220" {...cut(c.inner, INK, INNER)} />
            <path d="M170 190 L230 260 M230 190 L170 260" {...cut(c.detail, INK, DETAIL)} />

            {/* Parabolic dish rim & curve */}
            <path
              d="M100 130 C 130 90, 270 90, 300 130 C 270 240, 130 240, 100 130 Z"
              {...cut(c.contour, INK, CONTOUR)}
            />
            <Clip id={dish} d="M100 130 C 130 90, 270 90, 300 130 C 270 240, 130 240, 100 130 Z" />
            <Hatch clip={dish} p={c.shade} angle={35} gap={11} op={0.25} />
            <Stipple clip={dish} p={c.detail} n={160} seed={4} op={0.18} />

            {/* Inner parabolic bowl rings */}
            <ellipse cx={200} cy={155} rx={74} ry={48} {...cut(c.inner, INK, INNER)} />
            <ellipse cx={200} cy={155} rx={42} ry={26} {...cut(c.detail, INK, DETAIL)} />

            {/* Central feed horn and struts */}
            <line x1={200} y1={155} x2={200} y2={85} {...cut(c.contour, INK, CONTOUR)} />
            <line x1={140} y1={130} x2={200} y2={85} {...cut(c.inner, INK, INNER)} />
            <line x1={260} y1={130} x2={200} y2={85} {...cut(c.inner, INK, INNER)} />
            <circle cx={200} cy={85} r={8} {...cut(c.contour, INK, CONTOUR)} />
            <circle cx={200} cy={85} r={4} {...ink(wave, color.red)} />

            {/* Radiating microwave wavefront arcs */}
            {[30, 56, 82].map((r, i) => (
              <path
                key={i}
                d={`M${200 - r} ${85 - r * 0.4} Q 200 ${85 - r * 0.9} ${200 + r} ${85 - r * 0.4}`}
                fill="none"
                stroke={color.red}
                strokeWidth={DETAIL * 1.2}
                strokeLinecap="round"
                opacity={Math.max(0, wave - i * 0.25)}
              />
            ))}

            <Note x={345} y={35} to={[200, 85]} t="11 GHz BEAM" p={c.inner} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 7. ColdWarRadarPlate
/** Decommissioned Cold War military radar mast retrofitted for high-frequency microwave trading. */
export const ColdWarRadarPlate: React.FC<Box & { dishAt?: string | number; plate?: string }> = ({
  w,
  h,
  dishAt,
  plate,
}) => {
  const [bunker] = useIds(1);
  const dishF = useCue(dishAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const dish = prog(c.frame, dishF, 40);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 146} rx={135} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Reinforced concrete bunker shack at base */}
            <path d="M70 290 L150 290 L150 330 L70 330 Z" {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={bunker} d="M70 290 L150 290 L150 330 L70 330 Z" />
            <Hatch clip={bunker} p={c.shade} angle={45} gap={9} op={0.25} />
            <rect x={95} y={305} width={24} height={25} {...cut(c.inner, INK, INNER)} />

            {/* Heavy steel lattice radar mast */}
            <path d="M140 330 L185 90 L215 90 L260 330" {...cut(c.contour, INK, CONTOUR)} />
            {[130, 180, 230, 280].map((y, i) => (
              <line key={i} x1={150 + i * 8} y1={y} x2={250 - i * 8} y2={y} {...cut(c.inner, INK, INNER)} />
            ))}

            {/* Top surveillance radar curved open-grid scanner */}
            <path
              d="M130 90 Q 200 50 270 90 L 260 98 Q 200 62 140 98 Z"
              {...cut(c.contour, INK, CONTOUR)}
            />
            {/* Radar scanner grid vertical ribs */}
            {[160, 180, 200, 220, 240].map((x, i) => (
              <line key={i} x1={x} y1={72} x2={x} y2={88} {...cut(c.detail, INK, DETAIL)} />
            ))}

            {/* Retrofitted commercial microwave drum dish on mast flank */}
            <ellipse cx={235} cy={160} rx={24} ry={18} {...cut(c.contour, INK, CONTOUR)} />
            <ellipse cx={235} cy={160} rx={14} ry={10} {...cut(c.inner, INK, INNER)} />
            <line x1={200} y1={160} x2={235} y2={160} {...cut(c.inner, INK, INNER)} />

            {/* High-frequency beam shooting eastward from retrofitted dish */}
            {dish > 0 && (
              <line
                x1={259}
                y1={160}
                x2={259 + dish * 85}
                y2={160}
                stroke={color.red}
                strokeWidth={CONTOUR}
                strokeLinecap="round"
              />
            )}

            <Note x={60} y={260} to={[110, 290]} t="USAF SITE 04-A" p={c.inner} anchor="start" />
            <Note x={345} y={80} to={[235, 160]} t="HFT RETROFIT" p={dish} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 8. RelayChainPlate
/** Line-of-sight microwave relay chain: 15 steel masts hopping across Midwest agricultural landscape. */
export const RelayChainPlate: React.FC<Box & { hopAt?: string | number; plate?: string }> = ({
  w,
  h,
  hopAt,
  plate,
}) => {
  const hopF = useCue(hopAt, 0);

  const towers = [
    { x: 55, h: 80, name: 'T1' },
    { x: 125, h: 88, name: 'T2' },
    { x: 200, h: 82, name: 'T3' },
    { x: 275, h: 90, name: 'T4' },
    { x: 345, h: 84, name: 'T5' },
  ];

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const hop = prog(c.frame, hopF, 50);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 144} rx={142} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Rolling farmland terrain profile */}
            <path
              d="M30 300 Q 120 285 200 295 Q 280 305 370 290 L 370 330 L 30 330 Z"
              {...cut(c.contour, INK, CONTOUR)}
            />

            {/* Farm barn and silo silhouette */}
            <path d="M150 290 L170 275 L190 290 Z M150 290 L190 290 L190 310 L150 310 Z" {...cut(c.detail, INK, DETAIL)} />

            {/* 5 Relay towers spanning horizon */}
            {towers.map((t, i) => (
              <g key={i}>
                <line x1={t.x} y1={295} x2={t.x} y2={295 - t.h} {...cut(c.contour, INK, INNER)} />
                <line x1={t.x - 10} y1={295} x2={t.x} y2={295 - t.h} {...cut(c.detail, INK, DETAIL)} />
                <line x1={t.x + 10} y1={295} x2={t.x} y2={295 - t.h} {...cut(c.detail, INK, DETAIL)} />
                <circle cx={t.x} cy={295 - t.h} r={4} {...cut(c.contour, INK, CONTOUR)} />
                <text x={t.x} y={325} textAnchor="middle" fill={color.mute} fontFamily={font.mono} fontSize={12}>
                  {t.name}
                </text>
              </g>
            ))}

            {/* Microwave hops connecting towers in a straight line */}
            <path
              d="M55 215 L125 207 L200 213 L275 205 L345 211"
              fill="none"
              stroke={color.mute}
              strokeWidth={INNER}
              strokeDasharray="4 6"
            />

            {/* Traveling microwave pulse jumping across hops */}
            {hop > 0 && (
              <path
                d="M55 215 L125 207 L200 213 L275 205 L345 211"
                fill="none"
                stroke={color.red}
                strokeWidth={CONTOUR}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="0.2 1"
                strokeDashoffset={1 - hop * 1.2}
              />
            )}

            <Note x={65} y={160} to={[90, 210]} t="30-MILE SPAN" p={c.inner} anchor="start" />
            <Note x={345} y={160} to={[345, 211]} t="15 STEEL MASTS" p={hop} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 9. MicrowaveDrumPlate
/** Close-up architectural engraving of a heavy communications mast top with cylindrical microwave drum antennas. */
export const MicrowaveDrumPlate: React.FC<Box & { beamAt?: string | number; plate?: string }> = ({
  w,
  h,
  beamAt,
  plate,
}) => {
  const [drum1, drum2] = useIds(2);
  const beamF = useCue(beamAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const beam = prog(c.frame, beamF, 40);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 146} rx={130} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Heavy steel lattice mast uprights */}
            <path d="M160 330 L175 60 L225 60 L240 330" {...cut(c.contour, INK, CONTOUR)} />
            {[90, 140, 190, 240, 290].map((y, i) => (
              <line key={i} x1={165 + i * 2} y1={y} x2={235 - i * 2} y2={y} {...cut(c.inner, INK, INNER)} />
            ))}

            {/* Main forward radome microwave drum (Right) */}
            <path d="M225 120 L275 110 L290 125 L290 175 L275 190 L225 180 Z" {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={drum1} d="M225 120 L275 110 L290 125 L290 175 L275 190 L225 180 Z" />
            <Hatch clip={drum1} p={c.shade} angle={40} gap={10} op={0.25} />
            <ellipse cx={290} cy={150} rx={12} ry={25} {...cut(c.inner, INK, INNER)} />

            {/* Secondary backward drum antenna (Left) */}
            <path d="M175 160 L125 150 L110 165 L110 215 L125 230 L175 220 Z" {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={drum2} d="M175 160 L125 150 L110 165 L110 215 L125 230 L175 220 Z" />
            <Hatch clip={drum2} p={c.shade} angle={-40} gap={10} op={0.25} />
            <ellipse cx={110} cy={190} rx={12} ry={25} {...cut(c.inner, INK, INNER)} />

            {/* 1-degree microwave pencil beam shooting forward */}
            {beam > 0 && (
              <g>
                <line
                  x1={302}
                  y1={150}
                  x2={302 + beam * 65}
                  y2={150}
                  stroke={color.red}
                  strokeWidth={CONTOUR}
                  strokeLinecap="round"
                />
                <line
                  x1={302}
                  y1={150}
                  x2={302 + beam * 65}
                  y2={150}
                  stroke="#ffffff"
                  strokeWidth={DETAIL}
                  strokeLinecap="round"
                />
              </g>
            )}

            <Note x={60} y={65} to={[175, 60]} t="243m MAST" p={c.inner} anchor="start" />
            <Note x={345} y={110} to={[290, 150]} t="1° PENCIL BEAM" p={beam} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 10. CurvaturePlate
/** Earth curvature & line-of-sight tangent ray clearing between hilltops. */
export const CurvaturePlate: React.FC<Box & { curveAt?: string | number; plate?: string }> = ({
  w,
  h,
  curveAt,
  plate,
}) => {
  const [earth] = useIds(1);
  const curveF = useCue(curveAt, 0);

  const horizon = 'M24 320 Q 200 240 376 320 L 376 350 L 24 350 Z';

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const pulse = prog(c.frame, curveF, 40);

        return (
          <g style={breathe(c.frame)}>
            {/* Ground shadow */}
            <ellipse cx={C} cy={C + 148} rx={140} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Earth horizon curved crust */}
            <path d={horizon} {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={earth} d={horizon} />
            <Hatch clip={earth} p={c.shade} angle={45} gap={12} op={0.25} />
            <Stipple clip={earth} p={c.detail} n={200} seed={3} op={0.18} />

            {/* Radial planetary curvature reference dashes */}
            <path d="M70 310 L100 260 M200 340 L200 240 M330 310 L300 260" {...cut(c.detail, INK, DETAIL, '4 6')} />

            {/* Hilltop 1 & Tower 1 (West) */}
            <path d="M64 300 L64 210 L76 210 L76 300" {...cut(c.inner, INK, INNER)} />
            <circle cx={70} cy={206} r={5} {...cut(c.contour, INK, CONTOUR)} />

            {/* Hilltop 2 & Tower 2 (East) */}
            <path d="M324 300 L324 210 L336 210 L336 300" {...cut(c.inner, INK, INNER)} />
            <circle cx={330} cy={206} r={5} {...cut(c.contour, INK, CONTOUR)} />

            {/* Line-of-sight tangent ray clearing the earth bulge */}
            <line x1={70} y1={206} x2={330} y2={206} {...cut(c.inner, INK, INNER, '6 6')} />
            {pulse > 0 && (
              <line
                x1={70}
                y1={206}
                x2={70 + pulse * 260}
                y2={206}
                stroke={color.red}
                strokeWidth={CONTOUR}
                strokeLinecap="round"
              />
            )}

            {/* Earth bulge measurement bracket */}
            <line x1={200} y1={206} x2={200} y2={240} {...cut(c.detail, color.red, DETAIL)} />
            <path d="M194 206 L206 206 M194 240 L206 240" {...cut(c.detail, color.red, DETAIL)} />

            <Note x={200} y={160} to={[200, 206]} t="EARTH BULGE · 44 FT" p={c.inner} anchor="middle" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 11. CabbageFieldPlate
/** The Belgian cabbage field tower battle: two rival masts standing in adjacent fields, one +8 feet taller. */
export const CabbageFieldPlate: React.FC<Box & { shadowAt?: string | number; plate?: string }> = ({
  w,
  h,
  shadowAt,
  plate,
}) => {
  const [field] = useIds(1);
  const shadowF = useCue(shadowAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const shadow = prog(c.frame, shadowF, 40);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 146} rx={140} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Furrowed cabbage field landscape in West Flanders */}
            <path d="M30 300 L370 300 L370 335 L30 335 Z" {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={field} d="M30 300 L370 300 L370 335 L30 335 Z" />
            <Hatch clip={field} p={c.shade} angle={25} gap={9} op={0.22} />

            {/* Cabbage crop head rows */}
            {[45, 70, 95, 310, 335, 360].map((x, i) => (
              <circle key={i} cx={x} cy={315} r={5} {...cut(c.detail, INK, DETAIL)} />
            ))}

            {/* Tower A (First mover, 235m) */}
            <path d="M120 300 L140 100 L150 100 L170 300" {...cut(c.inner, INK, INNER)} />
            <ellipse cx={145} cy={115} rx={12} ry={8} {...cut(c.contour, INK, CONTOUR)} />
            <text x={145} y={325} textAnchor="middle" fill={color.mute} fontFamily={font.mono} fontSize={12}>
              FIRM A
            </text>

            {/* Tower B (Competitor, 243m · +8 FEET TALLER!) */}
            <path d="M220 300 L240 76 L250 76 L270 300" {...cut(c.contour, INK, CONTOUR)} />
            <ellipse cx={245} cy={90} rx={14} ry={10} {...cut(c.contour, INK, CONTOUR)} />
            <text x={245} y={325} textAnchor="middle" fill={color.red} fontFamily={font.mono} fontSize={12} fontWeight={700}>
              FIRM B (+8 FT)
            </text>

            {/* Intentional RF shadow / beam occlusion cone */}
            {shadow > 0 && (
              <g>
                <path
                  d="M245 90 L145 115 L145 140 Z"
                  fill="rgba(230, 57, 70, 0.22)"
                  stroke={color.red}
                  strokeWidth={DETAIL}
                  strokeDasharray="4 4"
                />
              </g>
            )}

            <Note x={60} y={60} to={[145, 100]} t="HOUTEM FIELD" p={c.inner} anchor="start" />
            <Note x={275} y={75} to={[245, 76]} t="+8 FT TALL" p={shadow} anchor="start" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 12. StrippedWirePlate
/** Twinaxial server transmission line stripped of plastic jacketing to air dielectric (-2.1ns). */
export const StrippedWirePlate: React.FC<Box & { pulseAt?: string | number; plate?: string }> = ({
  w,
  h,
  pulseAt,
  plate,
}) => {
  const [jacket, shield] = useIds(2);
  const pulseF = useCue(pulseAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const pulse = prog(c.frame, pulseF, 40);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 144} rx={140} ry={15} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Outer PVC jacketing (left section only, cut off) */}
            <path d="M30 160 L140 160 L140 240 L30 240 Z" {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={jacket} d="M30 160 L140 160 L140 240 L30 240 Z" />
            <Hatch clip={jacket} p={c.shade} angle={60} gap={10} op={0.25} />
            <Stipple clip={jacket} p={c.detail} n={150} seed={6} op={0.2} />

            {/* Braided copper shield mesh peeled back */}
            <path d="M140 170 L190 170 L190 230 L140 230 Z" {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={shield} d="M140 170 L190 170 L190 230 L140 230 Z" />
            <Hatch clip={shield} p={c.shade} angle={-45} gap={8} op={0.3} />
            <Hatch clip={shield} p={c.shade} angle={45} gap={8} op={0.3} />

            {/* Twin bare copper conductor wires running naked through air dielectric */}
            <line x1={190} y1={188} x2={370} y2={188} {...cut(c.contour, INK, CONTOUR)} />
            <line x1={190} y1={212} x2={370} y2={212} {...cut(c.contour, INK, CONTOUR)} />

            {/* Stripped wire electric field radiating in open air */}
            {[230, 280, 330].map((x, i) => (
              <g key={i}>
                <line x1={x} y1={172} x2={x} y2={184} {...cut(c.detail, color.red, DETAIL)} />
                <line x1={x} y1={216} x2={x} y2={228} {...cut(c.detail, color.red, DETAIL)} />
              </g>
            ))}

            {/* High-speed signal pulse traveling along the bare copper wire */}
            {pulse > 0 && (
              <g>
                <circle cx={190 + pulse * 180} cy={188} r={6} fill={color.red} />
                <circle cx={190 + pulse * 180} cy={212} r={6} fill={color.red} />
              </g>
            )}

            <Note x={60} y={110} to={[90, 160]} t="PVC JACKET" p={c.inner} anchor="start" />
            <Note x={345} y={280} to={[270, 212]} t="AIR DIELECTRIC · -2.1 ns" p={c.inner} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 13. HollowCorePlate
/** Photonic crystal hollow-core vacuum fiber: microscopic hexagonal honeycomb capillaries with literal vacuum core. */
export const HollowCorePlate: React.FC<Box & { lightAt?: string | number; plate?: string }> = ({
  w,
  h,
  lightAt,
  plate,
}) => {
  const [cladding] = useIds(1);
  const lightF = useCue(lightAt, 0);

  // Hexagonal capillary coordinates around central core
  const capillaries = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * (2 * Math.PI);
    return [200 + 74 * Math.cos(a), 200 + 74 * Math.sin(a)] as const;
  });

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const light = prog(c.frame, lightF, 40);

        return (
          <g style={breathe(c.frame)}>
            {/* Cast shadow */}
            <ellipse cx={C} cy={C + 138} rx={135} ry={12} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Outer glass boundary ring */}
            <circle cx={C} cy={C} r={130} {...cut(c.contour, INK, CONTOUR)} />
            <Clip id={cladding} d="M 70 200 A 130 130 0 1 0 330 200 A 130 130 0 1 0 70 200 Z" />
            <Hatch clip={cladding} p={c.shade} angle={45} gap={14} op={0.18} />

            {/* Inner micro-capillary glass tubes forming photonic bandgap */}
            {capillaries.map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={24} {...cut(c.contour, INK, INNER)} />
                <circle cx={cx} cy={cy} r={18} {...cut(c.detail, INK, DETAIL)} />
              </g>
            ))}

            {/* Central literal vacuum core */}
            <circle cx={C} cy={C} r={50} {...cut(c.contour, INK, CONTOUR)} />
            <circle cx={C} cy={C} r={50} fill="rgba(0,0,0,0.7)" />

            {/* Traveling laser beam in central vacuum at 99.97% c */}
            {light > 0 && (
              <g>
                <circle cx={C} cy={C} r={14} fill={color.red} opacity={light} />
                <circle cx={C} cy={C} r={6} fill="#ffffff" opacity={light} />
                {[20, 36].map((r, i) => (
                  <circle
                    key={i}
                    cx={C}
                    cy={C}
                    r={r}
                    fill="none"
                    stroke={color.red}
                    strokeWidth={DETAIL}
                    opacity={Math.max(0, light - i * 0.3)}
                  />
                ))}
              </g>
            )}

            <text x={C} y={205} textAnchor="middle" fill={INK} fontFamily={font.mono} fontSize={14} letterSpacing="0.1em">
              VACUUM
            </text>

            <Note x={60} y={55} to={[130, 130]} t="HONEYCOMB LATTICE" p={c.inner} anchor="start" />
            <Note x={200} y={375} to={[200, 250]} t="n = 1.0003 · 99.97% c" p={light} anchor="middle" />
          </g>
        );
      }}
    </Plate>
  );
};

// ---------------------------------------------------------------- 14. LaserTurretPlate
/** Rooftop atmospheric optical transceiver turret with coherent laser pulse beam. */
export const LaserTurretPlate: React.FC<Box & { fireAt?: string | number; plate?: string }> = ({
  w,
  h,
  fireAt,
  plate,
}) => {
  const [housing] = useIds(1);
  const fireF = useCue(fireAt, 0);

  return (
    <Plate w={w} h={h} plate={plate}>
      {(c) => {
        const fire = prog(c.frame, fireF, 35);

        return (
          <g style={breathe(c.frame)}>
            {/* Base platform shadow */}
            <ellipse cx={C} cy={C + 142} rx={135} ry={16} {...ink(c.shade, color.stageDeep, 0.9)} />

            {/* Rooftop parapet line */}
            <path d="M40 310 L360 310" {...cut(c.contour, INK, CONTOUR)} />
            <path d="M40 310 L40 340 M360 310 L360 340" {...cut(c.inner, INK, INNER)} />

            {/* Heavy pedestal base */}
            <path d="M140 310 L160 230 L240 230 L260 310 Z" {...cut(c.contour, INK, CONTOUR)} />
            <path d="M150 270 L250 270" {...cut(c.inner, INK, INNER)} />

            {/* Turret gimbal yoke */}
            <path d="M165 230 L165 170 L235 170 L235 230" {...cut(c.contour, INK, CONTOUR)} />
            <circle cx={200} cy={170} r={18} {...cut(c.inner, INK, INNER)} />

            {/* Optical telescope tube assembly */}
            <path
              d="M110 135 L260 135 L285 155 L285 185 L260 205 L110 205 Z"
              {...cut(c.contour, INK, CONTOUR)}
            />
            <Clip id={housing} d="M110 135 L260 135 L285 155 L285 185 L260 205 L110 205 Z" />
            <Hatch clip={housing} p={c.shade} angle={45} gap={10} op={0.25} />
            <Stipple clip={housing} p={c.detail} n={150} seed={8} op={0.16} />

            {/* Aperture lens shroud */}
            <ellipse cx={285} cy={170} rx={14} ry={25} {...cut(c.contour, INK, CONTOUR)} />
            <ellipse cx={285} cy={170} rx={8} ry={16} {...cut(c.inner, INK, INNER)} />
            <circle cx={285} cy={170} r={6} {...ink(fire, color.red)} />

            {/* Horizontal coherent laser pulse beam */}
            {fire > 0 && (
              <g>
                <line
                  x1={295}
                  y1={170}
                  x2={295 + fire * 65}
                  y2={170}
                  stroke={color.red}
                  strokeWidth={CONTOUR * 1.2}
                  strokeLinecap="round"
                />
                <line
                  x1={295}
                  y1={170}
                  x2={295 + fire * 65}
                  y2={170}
                  stroke="#ffffff"
                  strokeWidth={DETAIL}
                  strokeLinecap="round"
                />
              </g>
            )}

            <Note x={60} y={75} to={[160, 135]} t="FREE-SPACE OPTICS" p={c.inner} anchor="start" />
            <Note x={345} y={125} to={[285, 150]} t="1550nm LASER" p={fire} anchor="end" />
          </g>
        );
      }}
    </Plate>
  );
};


// ============================================================================
// 14 UNBOXED EDITORIAL DESIGN PRINTS (RIGHT COLUMN)
// Completely unboxed print typography & diagrams directly on the editorial canvas.
// ============================================================================

// ---------------------------------------------------------------- 1. SpeedPrint
/** Unboxed transmission velocity comparison: glass vs air vs vacuum. */
export const SpeedPrint: React.FC<Box & { sweepAt?: string | number }> = ({ w, h, sweepAt }) => {
  const frame = useCurrentFrame();
  const sf = useCue(sweepAt, 0);
  const p = prog(frame, sf, 20);

  const rows = [
    { medium: 'SILICA GLASS FIBER', speed: '204,190 KM/S', note: 'n = 1.468 (-31.9%)', ratio: 0.681, hot: false },
    { medium: 'ATMOSPHERIC AIR', speed: '299,700 KM/S', note: 'n = 1.000 (+46.8%)', ratio: 0.9997, hot: true },
    { medium: 'VACUUM SPEED OF LIGHT', speed: '299,792 KM/S', note: '100.0% c (MAXWELL)', ratio: 1.0, hot: false },
  ];

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        PHYSICAL TRANSMISSION CONSTANTS // MAXWELL
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 26 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {rows.map((row, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ ...mono(17, color.ink), letterSpacing: '0.06em' }}>{row.medium}</span>
              <span style={{ ...mono(24, row.hot && p > 0 ? color.red : color.ink), fontWeight: 700 }}>
                {row.speed}
              </span>
            </div>
            {/* Sleek gauge line */}
            <div style={{ width: '100%', height: 6, background: 'rgba(233,227,211,0.1)', borderRadius: 3, overflow: 'hidden' }}>
              <div
                style={{
                  width: `${row.ratio * 100}%`,
                  height: '100%',
                  background: row.hot ? color.red : color.ink,
                  borderRadius: 3,
                }}
              />
            </div>
            <div style={{ ...mono(13, color.mute) }}>{row.note}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${color.hair}`, paddingTop: 16 }}>
        <span style={{ ...mono(15, color.mute) }}>PHYSICAL RESTRICTION</span>
        <span style={{ ...mono(22, color.red), fontWeight: 800 }}>-31.9% SPEED IN GLASS</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 2. CapitalWarPrint
/** Unboxed design print: $30 Billion secret latency war triggered by optical refraction. */
export const CapitalWarPrint: React.FC<Box & { revealAt?: string | number }> = ({ w, h, revealAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(revealAt, 0);
  const p = prog(frame, rf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        CORNING SMF-28 SPECIFICATION // OPTICAL PENALTY
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 62, color: color.red, lineHeight: 1.05, letterSpacing: '-0.02em', opacity: p <= 0 ? 0.35 : p }}>
        $30,000,000,000
      </div>
      <div style={{ ...serif(24, color.ink), marginTop: 10, fontWeight: 600 }}>
        The secret latency arms race begins.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>CORE GROUP INDEX (N):</span>
          <span style={{ fontWeight: 700 }}>1.4682 @ 1550nm</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>TRANSMISSION TAX:</span>
          <span style={{ fontWeight: 700, color: color.red }}>+4.89 µs / KILOMETER</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>STAKE:</span>
          <span style={{ fontWeight: 700 }}>GLOBAL ARBITRAGE ARMS RACE</span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 3. SpreadLedgerPrint
/** Unboxed infrastructure capital print: Spread Networks $300M tunnel through the Alleghenies. */
export const SpreadLedgerPrint: React.FC<Box & { stampAt?: string | number }> = ({ w, h, stampAt }) => {
  const frame = useCurrentFrame();
  const sf = useCue(stampAt, 0);
  const p = prog(frame, sf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        SPREAD NETWORKS LLC // PROJECT CARTERET (2010)
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 66, color: color.ink, lineHeight: 1.05 }}>
        $300,000,000
      </div>
      <div style={{ ...serif(23, color.mute), marginTop: 8 }}>
        Private capital expenditure to drill in an unswerving line.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>TERMINALS:</span>
          <span>CME AURORA (IL) → CARTERET (NJ)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>DISTANCE:</span>
          <span>825 MILES DRILLED IN SOLID ROCK</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>SAVINGS:</span>
          <span style={{ color: color.red, fontWeight: 700 }}>3.00 MILLISECONDS SHAVED</span>
        </div>
      </div>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${color.hair}`, paddingTop: 14 }}>
        <span style={{ ...mono(14, color.mute) }}>USEFUL LIFETIME</span>
        <span style={{ ...mono(18, color.red), fontWeight: 700, opacity: p }}>OBSOLETE IN 18 MONTHS</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 4. LatencyCollapsePrint
/** Unboxed latency collapse curve: 16.5ms legacy dropping to 13.1ms Spread tunnel. */
export const LatencyCollapsePrint: React.FC<Box & { barsAt?: string | number }> = ({ w, h, barsAt }) => {
  const frame = useCurrentFrame();
  const bf = useCue(barsAt, 0);
  const p = prog(frame, bf, 24);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 10 }}>
        ROUND-TRIP LATENCY // CME AURORA TO CARTERET
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 20 }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
        <span style={{ ...serif(22, color.ink) }}>Spread Tunnel Epoch</span>
        <span style={{ ...mono(44, color.red), fontWeight: 800 }}>13.1 ms</span>
      </div>

      {/* Vector latency chart */}
      <svg width={w - 80} height={160} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="gradSpread" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color.red} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color.red} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        <line x1={0} y1={30} x2={w - 80} y2={30} stroke={color.hair} strokeDasharray="3 4" />
        <line x1={0} y1={90} x2={w - 80} y2={90} stroke={color.hair} strokeDasharray="3 4" />
        <line x1={0} y1={150} x2={w - 80} y2={150} stroke={color.hair} />

        {/* Shaded area */}
        <path
          d={`M 20 40 L 200 40 L ${(w - 120)} 110 L ${(w - 120)} 150 L 20 150 Z`}
          fill="url(#gradSpread)"
          opacity={p}
        />

        {/* Curve line */}
        <path
          d={`M 20 40 L 200 40 L ${(w - 120)} 110`}
          fill="none"
          stroke={color.red}
          strokeWidth={4}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - p}
        />

        {/* Data points */}
        <circle cx={20} cy={40} r={5} fill={color.ink} />
        <circle cx={w - 120} cy={110} r={6} fill={color.red} opacity={p} />
      </svg>

      <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(13, color.mute), marginTop: 10 }}>
        <span>2009 STANDARD (16.5 ms)</span>
        <span style={{ color: color.red, fontWeight: 700 }}>2010 SPREAD (13.1 ms)</span>
      </div>

      <div style={{ marginTop: 24, ...mono(16, color.ink), borderTop: `1px solid ${color.hair}`, paddingTop: 14 }}>
        MARGINAL ADVANTAGE: <span style={{ color: color.red, fontWeight: 800 }}>-3.4 MILLISECONDS</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 5. MonopolyRentPrint
/** Unboxed financial monopoly print: 18-month exclusivity and $300k/month lease fees. */
export const MonopolyRentPrint: React.FC<Box & { revealAt?: string | number }> = ({ w, h, revealAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(revealAt, 0);
  const p = prog(frame, rf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        THE 18-MONTH EXCLUSIVITY WINDOW // ARBITRAGE
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 58, color: color.red, lineHeight: 1.05 }}>
        $300,000 / MO
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        Per firm lease fee to access the 3-millisecond tunnel.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>EXCLUSIVE TENANTS:</span>
          <span>200 HFT TRADING CONSORTIA</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>MONTHLY CASHFLOW:</span>
          <span style={{ fontWeight: 700 }}>$60,000,000 / MONTH</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>MARKET IMPACT:</span>
          <span style={{ color: color.red, fontWeight: 700 }}>100% OF WINNING QUOTES</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(15, color.mute), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        "If you are 1 millisecond behind, you capture zero percent."
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 6. MaxwellWavePrint
/** Unboxed electrodynamics wave equation print: 99.9% speed of light in atmospheric air. */
export const MaxwellWavePrint: React.FC<Box & { sweepAt?: string | number }> = ({ w, h, sweepAt }) => {
  const frame = useCurrentFrame();
  const sf = useCue(sweepAt, 0);
  const p = prog(frame, sf, 20);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        ELECTRODYNAMICS // MAXWELL WAVE EQUATION
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 62, color: color.red, lineHeight: 1.05 }}>
        99.9% OF c
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        Microwave signals propagate through air at vacuum speed.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>ATMOSPHERIC REFRACTIVE INDEX:</span>
          <span style={{ fontWeight: 700 }}>n = 1.00029 (AIR)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>PROPAGATION VELOCITY:</span>
          <span style={{ fontWeight: 700, color: color.red }}>299,700 KM / SECOND</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>ADVANTAGE OVER GLASS:</span>
          <span style={{ fontWeight: 700 }}>+95,510 KM/S FASTER (+46.8%)</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(15, color.mute), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        v = 1 / √(ε₀ · μ₀) · Free-space wave propagation
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 7. CableObsolescencePrint
/** Unboxed asset write-down print: $300M fiber optic cable rendered obsolete overnight. */
export const CableObsolescencePrint: React.FC<Box & { dropAt?: string | number }> = ({ w, h, dropAt }) => {
  const frame = useCurrentFrame();
  const df = useCue(dropAt, 0);
  const p = prog(frame, df, 20);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        CAPITAL ASSET WRITE-DOWN // 2012 OBSOLESCENCE
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
        <span style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 36, color: color.mute, textDecoration: 'line-through' }}>
          $300,000,000
        </span>
        <span style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 58, color: color.red }}>
          $0
        </span>
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        The three-hundred-million-dollar cable was obsolete.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>ASSET DEPRECIATION:</span>
          <span style={{ fontWeight: 700, color: color.red }}>100% ECONOMIC WRITE-OFF</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>OPERATING DURATION:</span>
          <span>18 MONTHS TOTAL USEFUL LIFE</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>TRAFFIC MIGRATION:</span>
          <span>100% HIGH-FREQUENCY VOLUME TO AIR</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(15, color.mute), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        "The most expensive obsolete ditch in human history."
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 8. FCCSpectrumPrint
/** Unboxed FCC regulatory spectrum print: Form 601 11.2 GHz Private Radio Service. */
export const FCCSpectrumPrint: React.FC<Box & { revealAt?: string | number }> = ({ w, h, revealAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(revealAt, 0);
  const p = prog(frame, rf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        FEDERAL COMMUNICATIONS COMMISSION // PART 101
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 58, color: color.red, lineHeight: 1.05 }}>
        15 STEEL TOWERS
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        Locked in perfect point-to-point line-of-sight.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>FREQUENCY BAND:</span>
          <span style={{ fontWeight: 700 }}>11.2 TO 11.7 GHZ POINT-TO-POINT</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>GEOGRAPHY:</span>
          <span>INDIANA · OHIO · PENNSYLVANIA</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>LICENSE GRANTEES:</span>
          <span style={{ fontWeight: 700 }}>MCKAY BROTHERS / TRADEWORX</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(15, color.mute), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        FORM 601 AUTHORIZATION // COMMON CARRIER FIXED POINT
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 9. EightPointTwoChart
/** Unboxed latency milestone comparison: 13.1ms fiber vs 8.24ms microwave. */
export const EightPointTwoChart: React.FC<Box & { barsAt?: string | number }> = ({ w, h, barsAt }) => {
  const frame = useCurrentFrame();
  const bf = useCue(barsAt, 0);
  const p = prog(frame, bf, 24);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        ROUND-TRIP LATENCY // CHICAGO CME ↔ CARTERET
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 68, color: color.red, lineHeight: 1.05 }}>
        8.24 ms
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        Round-trip latency collapsed from 13.1 to 8.2.
      </div>

      {/* Comparison bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(15, color.mute), marginBottom: 6 }}>
            <span>SPREAD TUNNEL FIBER (2010)</span>
            <span>13.10 ms</span>
          </div>
          <div style={{ width: '100%', height: 8, background: 'rgba(233,227,211,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: color.ink, borderRadius: 4 }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(15, color.mute), marginBottom: 6 }}>
            <span style={{ color: color.red }}>MICROWAVE RELAY AIR (2012)</span>
            <span style={{ color: color.red, fontWeight: 700 }}>8.24 ms</span>
          </div>
          <div style={{ width: '100%', height: 8, background: 'rgba(233,227,211,0.1)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ width: `${(8.24 / 13.10) * 100 * p}%`, height: '100%', background: color.red, borderRadius: 4 }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink), borderTop: `1px solid ${color.hair}`, paddingTop: 14 }}>
        <span style={{ color: color.mute }}>LATENCY CRUSH:</span>
        <span style={{ color: color.red, fontWeight: 800 }}>-4.86 ms (-37.1%)</span>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 10. CurvaturePhysicsPrint
/** Unboxed planetary geometry & atmospheric physics print: earth bulge formula and ducting. */
export const CurvaturePhysicsPrint: React.FC<Box & { revealAt?: string | number }> = ({ w, h, revealAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(revealAt, 0);
  const p = prog(frame, rf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        PROPAGATION BOTTLENECK // PLANETARY PHYSICS
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 58, color: color.red, lineHeight: 1.05 }}>
        44.2 FEET
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        Earth bulge between 30-mile tower hilltops.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>BULGE FORMULA:</span>
          <span style={{ fontWeight: 700 }}>h = d² / (2 · k · R_e)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>REFRACTIVITY GRADIENT:</span>
          <span>dn/dh = -40 N-UNITS / KM</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>ATMOSPHERIC DUCTING:</span>
          <span style={{ color: color.red, fontWeight: 700 }}>THERMAL INVERSION LOSS</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(15, color.mute), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        Speed restricted by the physical curvature of the Earth.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 11. ZoningWarPrint
/** Unboxed Belgian cabbage field tower war print: Houtem municipal planning dispute. */
export const ZoningWarPrint: React.FC<Box & { revealAt?: string | number }> = ({ w, h, revealAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(revealAt, 0);
  const p = prog(frame, rf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        HOUTEM PLANNING DISPUTE // WEST FLANDERS (2016)
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 58, color: color.red, lineHeight: 1.05 }}>
        243 METERS
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        Erecting towers eight feet taller to block competitor beams.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>LOCATION:</span>
          <span>PARCEL 408-A (ADJACENT CABBAGE FIELD)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>CORRIDOR:</span>
          <span>SLOUGH (LSE) ↔ FRANKFURT (DB)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>TACTIC:</span>
          <span style={{ color: color.red, fontWeight: 700 }}>RF SHADOWING & SIGNAL BLOCK</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(15, color.mute), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        Stake: 100% of winning quotes between London and Frankfurt.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 12. NanosecondHardwarePrint
/** Unboxed sub-nanosecond physical layer hardware print: Teflon jacket stripped to air dielectric. */
export const NanosecondHardwarePrint: React.FC<Box & { revealAt?: string | number }> = ({ w, h, revealAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(revealAt, 0);
  const p = prog(frame, rf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        CARTERET SERVER RACK // SUB-NANOSECOND HARDWARE
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 62, color: color.red, lineHeight: 1.05 }}>
        -2.10 ns
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        Plastic jacketing stripped off internal server wiring.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>DIELECTRIC REPLACEMENT:</span>
          <span style={{ fontWeight: 700 }}>TEFLON (ε=2.1) → AIR (ε=1.0)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>FPGA DIRECT MAC INJECTION:</span>
          <span style={{ fontWeight: 700 }}>1.80 ns BYPASS KERNEL</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>TOTAL TICK-TO-TRADE:</span>
          <span style={{ color: color.red, fontWeight: 800 }}>3.90 NANOSECONDS TOTAL</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(15, color.mute), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        Engineers stripping wires down to raw copper to save two nanoseconds.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 13. HollowCoreSpecsPrint
/** Unboxed photonics frontier print: hollow-core vacuum fiber and atmospheric pulse lasers. */
export const HollowCoreSpecsPrint: React.FC<Box & { revealAt?: string | number }> = ({ w, h, revealAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(revealAt, 0);
  const p = prog(frame, rf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        THE OPTICAL FRONTIER // HOLLOW-CORE VACUUM FIBER
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 62, color: color.red, lineHeight: 1.05 }}>
        n = 1.0003
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        Literal vacuum confined inside microscopic glass tubes.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>PROPAGATION DELAY:</span>
          <span style={{ fontWeight: 700, color: color.red }}>3.33 µs / KM (vs 4.89 µs)</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>WAVELENGTH:</span>
          <span>1550nm ATMOSPHERIC PULSE LASER</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', ...mono(16, color.ink) }}>
          <span style={{ color: color.mute }}>DISPERSION:</span>
          <span>ZERO CHROMATIC SPREAD IN VACUUM</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(15, color.mute), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        Paired with free-space optical pulse lasers on city rooftops.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- 14. OrderBookArbitragePrint
/** Unboxed retail order front-running record: CME Central Matching Engine arbitrage by 3 nanoseconds. */
export const OrderBookArbitragePrint: React.FC<Box & { revealAt?: string | number }> = ({ w, h, revealAt }) => {
  const frame = useCurrentFrame();
  const rf = useCue(revealAt, 0);
  const p = prog(frame, rf, 18);

  return (
    <div style={{ width: w, height: h, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 40px', boxSizing: 'border-box' }}>
      <div style={{ ...mono(15, color.mute), letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 12 }}>
        CME MATCHING ENGINE // RETAIL ARBITRAGE TICK LOG
      </div>
      <div style={{ borderBottom: `1px solid ${color.hairStrong}`, marginBottom: 24 }} />

      <div style={{ fontFamily: font.mono, fontWeight: 800, fontSize: 58, color: color.red, lineHeight: 1.05 }}>
        3 NANOSECONDS
      </div>
      <div style={{ ...serif(23, color.ink), marginTop: 8, fontWeight: 600 }}>
        All of this to beat your retirement order to the book.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 32, borderTop: `1px solid ${color.hair}`, paddingTop: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...mono(13, color.mute) }}>YOUR 401(K) PENSION ORDER:</span>
          <span style={{ ...mono(17, color.ink), fontWeight: 700 }}>09:30:00.000 000 003 EST</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ ...mono(13, color.mute) }}>HFT LASER EXECUTION:</span>
          <span style={{ ...mono(17, color.red), fontWeight: 800 }}>09:30:00.000 000 000 EST (-3 ns)</span>
        </div>
      </div>

      <div style={{ marginTop: 28, ...mono(16, color.ink), borderTop: `1px solid ${color.hair}`, paddingTop: 14, opacity: p }}>
        <span style={{ color: color.red, fontWeight: 700 }}>Not to explore the cosmos.</span> Not to cure disease.
      </div>
    </div>
  );
};

// Legacy exports for backward compatibility if ever queried
export {
  FiberCorePlate as FiberPlate,
  DishAntennaPlate as DishPlate,
  MicrowaveDrumPlate as TowerPlate,
  MicrowaveDrumPlate as TelecomTowerPlate,
  SpeedPrint as SpeedCompare,
};

