/**
 * Bespoke tactile UI & mechanism widgets for `apply-button` (All-in Studio - Lessons #84, #85, #86 & #87).
 * The 3-Pillar Hybrid Engine:
 * - Layer A: Remotion + Kokoro af_heart 0.95x timeline sync
 * - Layer B: 5/5 HyperFrames Hybrid Mechanics (LiveCornerTicker, AmbientBgMatrix, BottomProgressHairline, DotMatrixCounter, InversionMorphBox)
 * - Layer C: @motionbykrit Game-Feel / "Juice" Physics (useGameFeelPhysics, ImpactBurst, VolumetricGodRays, SpeedLines, FloatingPopScore, DoodleUnderline, Tactile3DBlock)
 * Widgets: ATSScanner, FourFifthsDial, FunnelSieve, ComptrollerDocket.
 */
import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { mono, hand, serif, useCue } from '../ds/core';
import { color } from '../ds/tokens';
import {
  SmoothStage,
  TactileCard,
  SkeletonBars,
  HandInkCircle,
  TactileCursor,
  SHADOW_CARD,
  SHADOW_DEEP,
  COLOR_IVORY,
  COLOR_CRIMSON,
  COLOR_EMERALD,
  COLOR_INK,
  COLOR_MUTED,
  COLOR_SKELETON,
} from '../ds/psychology';
import {
  ImpactBurst,
  VolumetricGodRays,
  SpeedLines,
  FloatingPopScore,
  DoodleUnderline,
  Tactile3DBlock,
  SpecularSheen,
  useGameFeelCue,
} from '../ds/juice';
import {
  LiveCornerTicker,
  AmbientBgMatrix,
  BottomProgressHairline,
  DotMatrixCounter,
  InversionMorphBox,
} from '../ds/hyperframes_bridge';

type Box = { w?: number; h?: number };

/**
 * 1. ATSScanner:
 * Authentic candidate resume scanned by an automated algorithmic laser line.
 * Features HyperFrames <LiveCornerTicker>, <AmbientBgMatrix>, <InversionMorphBox>, and <BottomProgressHairline>.
 * Pops VolumetricGodRays, ImpactBurst, FloatingPopScore("0.2s TRASHED!"), and DoodleUnderline.
 */
export const ATSScanner: React.FC<
  Box & {
    at?: string | number;
    scanAt?: string | number;
    rejectAt?: string | number;
    passMode?: boolean;
  }
> = ({ at, scanAt, rejectAt, passMode = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sf = useCue(scanAt ?? at, 0);
  const rf = useCue(rejectAt, 30);

  const scanSp = frame >= sf ? spring({ frame: frame - sf, fps, config: { damping: 16, stiffness: 100 } }) : 0;
  const rejectSp = frame >= rf ? spring({ frame: frame - rf, fps, config: { damping: 14, stiffness: 160 } }) : 0;
  const physics = useGameFeelCue(rejectAt ?? 30, 30, 24);

  const laserY = 20 + 260 * Math.min(1, scanSp);

  return (
    <SmoothStage>
      {/* HyperFrames Mechanic 1: Live Corner Stakes Ticker */}
      <LiveCornerTicker label="RESUMES AUTO-TRASHED" ratePerSecond={18} startVal={248} unit="RESUMES" climaxAt={rf} />

      {/* HyperFrames Mechanic 2: Ambient Background Matrix */}
      <AmbientBgMatrix cols={11} rows={7} at={rf} waveColor={COLOR_CRIMSON} glyph="[✓]" />

      {/* Laser Scanning Velocity Streaks */}
      <SpeedLines direction="vertical" count={14} at={sf} color="rgba(230,57,70,0.25)" />

      {/* Volumetric God Rays on rejection slam */}
      <VolumetricGodRays cx={810} cy={270} at={rf} rays={14} color="rgba(230,57,70,0.12)" />

      <TactileCard
        title="ENTERPRISE TALENT ACQUISITION"
        badge={passMode || rejectSp < 0.2 ? 'PARSER ACTIVE' : '0.2s SIEVE FILTER'}
        badgeColor={passMode ? COLOR_EMERALD : COLOR_CRIMSON}
        width={1060}
        height={540}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 20,
            transform: `translate(${physics.shakeX}px, ${physics.shakeY}px)`,
          }}
        >
          {/* HyperFrames Mechanic 4: Inversion Morph Box */}
          <InversionMorphBox
            originalText="APPLICATION STATUS: SUBMITTED"
            invertedText="AUTO-TRASHED IN 0.2s · 0 HUMAN VIEWS"
            at={rf}
            width={760}
            height={74}
          />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, width: '100%' }}>
            {/* Resume Paper Sheet with Tactile 3D Block Elevation */}
            <Tactile3DBlock
              width={480}
              height={330}
              bg="#FFFFFF"
              lipColor="#D5CEBF"
              at={sf}
              elevation={11}
              style={{
                padding: '22px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {/* Header */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '2px solid #EFECE6',
                    paddingBottom: 10,
                  }}
                >
                  <div>
                    <div style={{ ...serif(22, COLOR_INK, 800) }}>Candidate Resume</div>
                    <div style={{ ...mono(14, COLOR_MUTED), marginTop: 2, fontWeight: 700 }}>
                      SENIOR SYSTEMS ENGINEER
                    </div>
                  </div>
                  <span
                    style={{
                      ...mono(14, COLOR_EMERALD),
                      fontWeight: 800,
                      background: 'rgba(46,159,110,0.14)',
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: `1.5px solid ${COLOR_EMERALD}`,
                    }}
                  >
                    PDF UPLOADED
                  </span>
                </div>

                {/* Contextual Skeleton Bars */}
                <div style={{ marginTop: 18, opacity: 1 - 0.3 * scanSp }}>
                  <SkeletonBars widths={['95%', '80%', '88%', '65%', '90%', '75%']} height={9} gap={12} />
                </div>
              </div>

              {/* Red Laser Scanning Beam */}
              {scanSp > 0.05 && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: laserY,
                    height: 4,
                    background: COLOR_CRIMSON,
                    boxShadow: `0 0 18px 4px ${COLOR_CRIMSON}`,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Footer Tag */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1.5px solid #EFECE6',
                  paddingTop: 8,
                }}
              >
                <span style={{ ...mono(14, COLOR_MUTED) }}>128 KEYWORDS INDEXED</span>
                <span style={{ ...mono(14, scanSp > 0.8 ? COLOR_CRIMSON : COLOR_MUTED), fontWeight: 700 }}>
                  {scanSp > 0.8 ? 'PARSER TIME: 0.2s' : 'SCANNING FILE...'}
                </span>
              </div>

              <TactileCursor x={340} y={160} clickFrame={Math.max(6, typeof sf === 'number' ? sf : 12)} />
            </Tactile3DBlock>

            {/* Right Verdict Panel */}
            <div
              style={{
                width: 380,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
                textAlign: 'center',
              }}
            >
              {rejectSp > 0.1 ? (
                <Tactile3DBlock
                  width={360}
                  height={190}
                  bg="#FFFFFF"
                  lipColor="#E63946"
                  at={rf}
                  elevation={12}
                  style={{
                    border: `3.5px solid ${COLOR_CRIMSON}`,
                    padding: '20px 26px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transform: 'rotate(-3deg)',
                  }}
                >
                  <div style={{ ...mono(44, COLOR_CRIMSON), fontWeight: 900 }}>MATCH: 42%</div>
                  <div
                    style={{
                      ...mono(18, COLOR_CRIMSON),
                      fontWeight: 900,
                      letterSpacing: 1.5,
                      background: 'rgba(230,57,70,0.14)',
                      padding: '4px 14px',
                      borderRadius: 8,
                      position: 'relative',
                    }}
                  >
                    AUTO-DISCARDED (0.2s)
                    <DoodleUnderline x={-10} y={28} width={240} at={rf} color={COLOR_CRIMSON} />
                  </div>
                  <div style={{ ...serif(16, COLOR_MUTED), marginTop: 2 }}>0 human eyes opened file</div>
                </Tactile3DBlock>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                  <span style={{ ...mono(20, COLOR_MUTED), fontWeight: 700 }}>ALGORITHMIC AUDIT ENGINE</span>
                  <span style={{ ...serif(26, COLOR_INK, 700) }}>
                    {scanSp > 0.5 ? 'Parsing text hierarchy...' : 'Awaiting applicant file...'}
                  </span>
                </div>
              )}

              {/* Juice Impact Bursts & Floating Score */}
              {rejectSp > 0.15 && (
                <>
                  <ImpactBurst cx={810} cy={270} at={rf} color={COLOR_CRIMSON} count={16} radius={210} />
                  <FloatingPopScore text="0.2s TRASHED!" cx={810} cy={130} at={rf} color={COLOR_CRIMSON} />
                </>
              )}

              {rejectSp > 0.4 && <HandInkCircle cx={810} cy={270} rx={160} ry={70} at={rejectAt} />}
            </div>
          </div>
        </div>
      </TactileCard>

      {/* HyperFrames Mechanic 5: Bottom Progress Hairline */}
      <BottomProgressHairline color={COLOR_CRIMSON} height={4} />
    </SmoothStage>
  );
};

/**
 * 2. FunnelSieve:
 * 200 illuminated candidate dots dropping into a statistical filter.
 * Features HyperFrames <DotMatrixCounter> with 200 dots and rolling counter.
 * Supercharged with ImpactBurst, FloatingPopScore("-150 CUT!"), and Tactile3DBlock stages.
 */
export const FunnelSieve: React.FC<
  Box & { at?: string | number; sieveAt?: string | number; passAt?: string | number }
> = ({ at, sieveAt, passAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sf = useCue(sieveAt ?? at, 0);
  const pf = useCue(passAt, 30);

  const sieveSp = frame >= sf ? spring({ frame: frame - sf, fps, config: { damping: 14, stiffness: 120 } }) : 0;
  const passSp = frame >= pf ? spring({ frame: frame - pf, fps, config: { damping: 14, stiffness: 140 } }) : 0;
  const physics = useGameFeelCue(sieveAt ?? at, 0, 24);

  return (
    <SmoothStage>
      {/* Sieve Cut Speed Lines */}
      <SpeedLines direction="horizontal" count={14} at={sf} color="rgba(230,57,70,0.25)" />

      <TactileCard
        title="APPLICANT CONVERSION FUNNEL"
        badge="0.5% PASS RATE"
        badgeColor={COLOR_CRIMSON}
        width={1060}
        height={540}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            transform: `translate(${physics.shakeX}px, ${physics.shakeY}px)`,
          }}
        >
          {/* Left Column: HyperFrames DotMatrixCounter */}
          <div style={{ width: 520, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DotMatrixCounter count={200} cols={20} at={at} morphAt={sf} label="APPLICANT BATCH SIEVE" unit="APPLICANTS" />
          </div>

          {/* Right Metrics Column wrapped in Tactile 3D Blocks */}
          <div style={{ width: 380, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Tactile3DBlock
              width={360}
              height={78}
              bg="#FFFFFF"
              lipColor="#DDD7CC"
              at={sf}
              elevation={8}
              style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
              <div style={{ ...mono(14, COLOR_MUTED), fontWeight: 700 }}>STAGE 1 SUBMISSION</div>
              <div style={{ ...mono(28, COLOR_INK), fontWeight: 800 }}>200 SUBMITTED</div>
            </Tactile3DBlock>

            <Tactile3DBlock
              width={360}
              height={100}
              bg="#FFFFFF"
              lipColor="#E63946"
              at={sf}
              elevation={10}
              style={{
                border: `2.5px solid ${COLOR_CRIMSON}`,
                padding: '12px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div style={{ ...mono(14, COLOR_CRIMSON), fontWeight: 800 }}>STAGE 2 SIEVE FILTER</div>
              <div style={{ ...mono(28, COLOR_CRIMSON), fontWeight: 900 }}>75% DISCARDED</div>
              <div style={{ ...serif(15, COLOR_MUTED), marginTop: 2 }}>Never seen by human eye</div>
              {sieveSp > 0.4 && <DoodleUnderline x={10} y={64} width={220} at={sf} color={COLOR_CRIMSON} />}
            </Tactile3DBlock>

            <Tactile3DBlock
              width={360}
              height={78}
              bg="#FFFFFF"
              lipColor="#2E9F6E"
              at={pf}
              elevation={8}
              style={{
                border: `2px solid ${COLOR_EMERALD}`,
                padding: '12px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ ...mono(14, COLOR_EMERALD), fontWeight: 800 }}>STAGE 3 INTERVIEW</div>
              <div style={{ ...mono(28, COLOR_EMERALD), fontWeight: 800 }}>1 CANDIDATE</div>
            </Tactile3DBlock>
          </div>

          {/* Sieve Impact & Pop Scores */}
          {sieveSp > 0.3 && (
            <>
              <ImpactBurst cx={320} cy={180} at={sf} color={COLOR_CRIMSON} count={16} radius={180} />
              <FloatingPopScore text="-150 CUT!" cx={320} cy={120} at={sf} color={COLOR_CRIMSON} />
            </>
          )}

          {passSp > 0.3 && (
            <>
              <ImpactBurst cx={320} cy={260} at={pf} color={COLOR_EMERALD} count={14} radius={140} />
              <FloatingPopScore text="1 INTERVIEW!" cx={320} cy={300} at={pf} color={COLOR_EMERALD} />
            </>
          )}

          {sieveSp > 0.4 && <HandInkCircle cx={860} cy={190} rx={160} ry={55} at={sieveAt} />}
        </div>
      </TactileCard>

      <BottomProgressHairline color={COLOR_CRIMSON} height={4} />
    </SmoothStage>
  );
};

/**
 * 3. FourFifthsDial:
 * Precision mechanical adverse impact ratio gauge.
 * 0.80 legal threshold marked in green; needle drops to 0.54 into red violation zone.
 * Pops VolumetricGodRays, ImpactBurst, FloatingPopScore("ILLEGAL BIAS!"), and DoodleUnderline.
 */
export const FourFifthsDial: React.FC<
  Box & { at?: string | number; dropAt?: string | number; score?: number }
> = ({ at, dropAt, score = 0.54 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const df = useCue(dropAt ?? at, 0);
  const p = frame >= df ? spring({ frame: frame - df, fps, config: { damping: 14, stiffness: 130 } }) : 0;
  const physics = useGameFeelCue(dropAt ?? at, 0, 24);

  const currentVal = 0.85 - (0.85 - score) * p;

  const R = 170;
  const cx = 320;
  const cy = 240;

  // Map value 0.0 .. 1.0 to angle -180 deg (left) to 0 deg (right)
  const angleDeg = -180 + currentVal * 180;
  const rad = (angleDeg * Math.PI) / 180;
  const needleLen = R * 0.86;
  const nx = cx + needleLen * Math.cos(rad);
  const ny = cy + needleLen * Math.sin(rad);

  return (
    <SmoothStage>
      {/* Volumetric God Rays on Dial Center */}
      <VolumetricGodRays cx={cx} cy={cy} at={df} rays={16} color="rgba(230,57,70,0.12)" />

      <TactileCard
        title="ADVERSE IMPACT RATIO GAUGE"
        badge={p > 0.5 ? 'ILLEGAL BIAS DETECTED' : 'EVALUATING AUDIT'}
        badgeColor={p > 0.5 ? COLOR_CRIMSON : COLOR_EMERALD}
        width={1060}
        height={540}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 380,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            transform: `translate(${physics.shakeX}px, ${physics.shakeY}px)`,
          }}
        >
          {/* Dial Canvas */}
          <div style={{ position: 'relative', width: 560, height: 340, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={560} height={340} style={{ overflow: 'visible' }}>
              {/* Crimson Violation Arch (0.0 .. 0.8) */}
              <path
                d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R * Math.cos(-0.2 * Math.PI)} ${cy + R * Math.sin(-0.2 * Math.PI)}`}
                fill="none"
                stroke={COLOR_CRIMSON}
                strokeWidth={18}
                strokeLinecap="round"
              />
              {/* Emerald Legal Arch (0.8 .. 1.0) */}
              <path
                d={`M ${cx + R * Math.cos(-0.2 * Math.PI)} ${cy + R * Math.sin(-0.2 * Math.PI)} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
                fill="none"
                stroke={COLOR_EMERALD}
                strokeWidth={18}
                strokeLinecap="round"
              />

              {/* 0.80 Legal Threshold Tick */}
              <circle cx={cx + R * Math.cos(-0.2 * Math.PI)} cy={cy + R * Math.sin(-0.2 * Math.PI)} r={8} fill="#FFFFFF" stroke="#333" strokeWidth={2} />
              <text
                x={cx + (R + 34) * Math.cos(-0.2 * Math.PI)}
                y={cy + (R + 34) * Math.sin(-0.2 * Math.PI)}
                textAnchor="middle"
                fill={COLOR_EMERALD}
                style={{ ...mono(18, COLOR_EMERALD), fontWeight: 800 }}
              >
                0.80 FLOOR
              </text>

              {/* Center Pivot */}
              <circle cx={cx} cy={cy} r={20} fill="#FFFFFF" stroke="#D5CEBF" strokeWidth={3} />
              <circle cx={cx} cy={cy} r={8} fill={COLOR_INK} />

              {/* Needle with dynamic tremor */}
              <line
                x1={cx}
                y1={cy}
                x2={nx + physics.rattleX}
                y2={ny + physics.rattleY}
                stroke={COLOR_CRIMSON}
                strokeWidth={6.5}
                strokeLinecap="round"
              />
              <circle cx={nx + physics.rattleX} cy={ny + physics.rattleY} r={6.5} fill={COLOR_CRIMSON} />
            </svg>
          </div>

          {/* Right Digital Metric Readout wrapped in Tactile 3D Block */}
          <div style={{ width: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <Tactile3DBlock
              width={390}
              height={190}
              bg="#FFFFFF"
              lipColor="#E63946"
              at={df}
              elevation={12}
              style={{
                border: `3px solid ${COLOR_CRIMSON}`,
                padding: '24px 34px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div style={{ ...mono(56, COLOR_CRIMSON), fontWeight: 900 }}>{currentVal.toFixed(2)} RATIO</div>
              <div
                style={{
                  ...mono(20, COLOR_CRIMSON),
                  fontWeight: 800,
                  marginTop: 8,
                  background: 'rgba(230,57,70,0.14)',
                  padding: '6px 16px',
                  borderRadius: 8,
                  position: 'relative',
                }}
              >
                {p > 0.5 ? 'VIOLATION · LOCAL LAW 144' : 'EVALUATING APPLICANT RATIO'}
                {p > 0.5 && <DoodleUnderline x={-10} y={32} width={340} at={df} color={COLOR_CRIMSON} />}
              </div>
            </Tactile3DBlock>

            <span style={{ ...serif(22, COLOR_MUTED), textAlign: 'center' }}>
              Federal 4/5ths Rule threshold: 0.80
            </span>

            {/* Juice Burst & Floating Score */}
            {p > 0.35 && (
              <>
                <ImpactBurst cx={780} cy={170} at={df} color={COLOR_CRIMSON} count={16} radius={210} />
                <FloatingPopScore text="ILLEGAL BIAS!" cx={780} cy={70} at={df} color={COLOR_CRIMSON} />
              </>
            )}

            {p > 0.4 && <HandInkCircle cx={780} cy={165} rx={160} ry={60} at={dropAt} />}
          </div>
        </div>
      </TactileCard>

      <BottomProgressHairline color={COLOR_CRIMSON} height={4} />
    </SmoothStage>
  );
};

/**
 * 4. ComptrollerDocket:
 * Warm paper card with Albany NY Comptroller header, SkeletonBars,
 * and highlighted finding: "17 of 32 audited tools missed bias violations".
 */
export const ComptrollerDocket: React.FC<Box & { at?: string | number; markAt?: string | number }> = ({
  at,
  markAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cueF = useCue(markAt ?? at, 10);
  const markSp = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 14, stiffness: 140 } }) : 0;

  return (
    <SmoothStage>
      <TactileCard
        title="OFFICE OF THE STATE COMPTROLLER"
        badge="AUDIT REPORT #2025-S-14"
        badgeColor={COLOR_CRIMSON}
        width={1060}
        height={540}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            padding: '10px 40px',
          }}
        >
          {/* Header */}
          <div
            style={{
              width: '100%',
              borderBottom: '2px solid #D5CEBF',
              paddingBottom: 14,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ ...serif(22, COLOR_INK, 700) }}>
              Albany Audit Division · Local Law 144 Oversight
            </span>
            <span style={{ ...mono(16, COLOR_MUTED), fontWeight: 700 }}>DECEMBER 2025</span>
          </div>

          <SkeletonBars widths={['90%', '75%']} height={10} gap={10} />

          {/* Highlighted finding box */}
          <Tactile3DBlock
            width={940}
            height={130}
            bg="#FFFFFF"
            lipColor="#E63946"
            at={cueF}
            elevation={10}
            style={{
              border: `2.5px solid ${COLOR_CRIMSON}`,
              padding: '20px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ ...mono(18, COLOR_CRIMSON), fontWeight: 800 }}>KEY AUDIT FINDING</span>
            <span style={{ ...serif(36, COLOR_INK, 800), lineHeight: 1.25 }}>
              "17 of 32 audited screening tools missed legal bias violations"
            </span>
          </Tactile3DBlock>

          <SkeletonBars widths={['85%', '60%']} height={10} gap={10} />

          {markSp > 0.3 && <HandInkCircle cx={530} cy={270} rx={360} ry={52} at={markAt} />}
        </div>
      </TactileCard>

      <BottomProgressHairline color={COLOR_CRIMSON} height={4} />
    </SmoothStage>
  );
};
