/**
 * Bespoke tactile ELI5 widgets for `tokens-explained` (All-in Studio - Lessons #84, #85, #86 & #87).
 * The 3-Pillar Hybrid Engine:
 * - Layer A: Remotion + Kokoro af_heart 0.95x timeline sync
 * - Layer B: 5/5 HyperFrames Hybrid Mechanics (LiveCornerTicker, AmbientBgMatrix, BottomProgressHairline, DotMatrixCounter, InversionMorphBox)
 * - Layer C: @motionbykrit Game-Feel / "Juice" Physics (useGameFeelPhysics, ImpactBurst, VolumetricGodRays, SpeedLines, FloatingPopScore, DoodleUnderline, Tactile3DBlock)
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
 * 1. StrawberrySlicer:
 * Warm bright tactile card showing 10 bouncing letter tiles `s-t-r-a-w-b-e-r-r-y`.
 * Features HyperFrames <LiveCornerTicker>, <AmbientBgMatrix>, and <BottomProgressHairline>.
 * On slice cue, laser cuts into 3 white acrylic subword bricks: "straw" (#496), "ber" (#675), "ry" (#1553).
 * Pops VolumetricGodRays, ImpactBurst, FloatingPopScore("BLIND TO LETTERS!"), and DoodleUnderline.
 */
export const StrawberrySlicer: React.FC<
  Box & {
    at?: string | number;
    humanAt?: string | number;
    sliceAt?: string | number;
    tokenAt?: string | number;
  }
> = ({ humanAt, sliceAt, tokenAt, at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const hf = useCue(humanAt ?? at, 0);
  const sf = useCue(sliceAt, 20);
  const tf = useCue(tokenAt, 40);

  const humanSp = frame >= hf ? spring({ frame: frame - hf, fps, config: { damping: 14, stiffness: 140 } }) : 0;
  const sliceSp = frame >= sf ? spring({ frame: frame - sf, fps, config: { damping: 14, stiffness: 150 } }) : 0;
  const tokenSp = frame >= tf ? spring({ frame: frame - tf, fps, config: { damping: 14, stiffness: 160 } }) : 0;

  const physics = useGameFeelCue(tokenAt ?? 40, 40, 24);

  const letters = [
    { char: 's', r: false },
    { char: 't', r: false },
    { char: 'r', r: true },
    { char: 'a', r: false },
    { char: 'w', r: false },
    { char: 'b', r: false },
    { char: 'e', r: false },
    { char: 'r', r: true },
    { char: 'r', r: true },
    { char: 'y', r: false },
  ];

  const chunks = [
    { text: 'straw', id: '496' },
    { text: 'ber', id: '675' },
    { text: 'ry', id: '1553' },
  ];

  return (
    <SmoothStage>
      {/* HyperFrames Mechanic 1: Live Corner Stakes Ticker */}
      <LiveCornerTicker label="TOKENS BILLED" ratePerSecond={1840} startVal={1420} unit="TOKENS" climaxAt={tf} />

      {/* HyperFrames Mechanic 2: Ambient Background Matrix */}
      <AmbientBgMatrix cols={11} rows={7} at={tf} waveColor={COLOR_CRIMSON} glyph="[ID]" />

      {/* Volumetric God Rays on Token Split Reveal */}
      <VolumetricGodRays cx={530} cy={270} at={tf} rays={14} color="rgba(230,57,70,0.12)" />

      {/* Speed Lines on Slicing */}
      <SpeedLines direction="vertical" count={14} at={sf} color="rgba(230,57,70,0.3)" />

      <TactileCard
        title={tokenSp > 0.4 ? 'WHAT THE MODEL RECEIVES (TOKENS)' : 'WHAT A HUMAN SEES (CHARACTERS)'}
        badge={tokenSp > 0.4 ? 'cl100k_base' : 'HUMAN VISION'}
        badgeColor={tokenSp > 0.4 ? COLOR_CRIMSON : COLOR_EMERALD}
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
            transform: `translate(${physics.shakeX}px, ${physics.shakeY}px)`,
          }}
        >
          {tokenSp < 0.6 ? (
            /* Human Letter Tiles View */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  alignItems: 'center',
                  position: 'relative',
                  padding: '20px 30px',
                  background: '#FFFFFF',
                  borderRadius: 20,
                  boxShadow: SHADOW_CARD,
                  border: '1.5px solid #E2DDD2',
                }}
              >
                {letters.map((l, i) => {
                  const isR = l.r && humanSp > 0.1;
                  const jump = isR ? Math.sin(frame * 0.25 + i) * 6 : 0;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 58,
                        height: 72,
                        borderRadius: 12,
                        background: isR ? 'rgba(46,159,110,0.14)' : '#F7F4EC',
                        border: isR ? `2.5px solid ${COLOR_EMERALD}` : '1.5px solid #DDD7CC',
                        boxShadow: isR ? '0 8px 18px rgba(46,159,110,0.25)' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transform: `translateY(${jump - (isR ? 6 * humanSp : 0)}px)`,
                      }}
                    >
                      <span style={{ ...mono(38, isR ? COLOR_EMERALD : COLOR_INK), fontWeight: 800 }}>
                        {l.char}
                      </span>
                      {isR && (
                        <span style={{ ...mono(14, COLOR_EMERALD), fontWeight: 800, marginTop: -2 }}>
                          R
                        </span>
                      )}
                    </div>
                  );
                })}

                {/* Slicing Lasers with Glow */}
                {sliceSp > 0 && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: 265,
                        top: -16,
                        bottom: -16,
                        width: 4,
                        background: COLOR_CRIMSON,
                        boxShadow: `0 0 20px 4px ${COLOR_CRIMSON}`,
                        borderRadius: 2,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: 478,
                        top: -16,
                        bottom: -16,
                        width: 4,
                        background: COLOR_CRIMSON,
                        boxShadow: `0 0 20px 4px ${COLOR_CRIMSON}`,
                        borderRadius: 2,
                      }}
                    />
                  </>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <span
                  style={{
                    ...mono(24, COLOR_EMERALD),
                    fontWeight: 800,
                    background: 'rgba(46,159,110,0.14)',
                    padding: '6px 20px',
                    borderRadius: 999,
                    border: `1.5px solid ${COLOR_EMERALD}`,
                  }}
                >
                  3 LETTERS "R" COUNTED
                </span>
              </div>
            </div>
          ) : (
            /* Model Subword Token Bricks View (Juicy 3D Blocks) */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
              <div style={{ display: 'flex', gap: 26, alignItems: 'center' }}>
                {chunks.map((t, idx) => (
                  <Tactile3DBlock
                    key={idx}
                    width={230}
                    height={160}
                    bg="#FFFFFF"
                    lipColor="#D5CEBF"
                    at={tf}
                    elevation={12}
                    style={{
                      border: `3px solid ${COLOR_CRIMSON}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                    }}
                  >
                    <div style={{ ...serif(48, COLOR_INK, 800) }}>"{t.text}"</div>
                    <div
                      style={{
                        ...mono(28, COLOR_CRIMSON),
                        fontWeight: 900,
                        background: 'rgba(230,57,70,0.12)',
                        padding: '4px 18px',
                        borderRadius: 8,
                      }}
                    >
                      ID #{t.id}
                    </div>
                  </Tactile3DBlock>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 10, position: 'relative' }}>
                <span style={{ ...mono(26, COLOR_CRIMSON), fontWeight: 800 }}>
                  LETTERS VANISHED INTO OPAQUE IDS
                </span>
                <DoodleUnderline x={-10} y={32} width={470} at={tf} color={COLOR_CRIMSON} />
              </div>
            </div>
          )}

          {/* Juice Bursts & Score Pills */}
          {tokenSp > 0.5 && (
            <>
              <ImpactBurst cx={530} cy={220} at={tf} color={COLOR_CRIMSON} count={16} radius={220} />
              <FloatingPopScore text="BLIND TO LETTERS!" cx={530} cy={140} at={tf} color={COLOR_CRIMSON} />
            </>
          )}

          {tokenSp > 0.6 && <HandInkCircle cx={530} cy={270} rx={180} ry={65} at={tokenAt} />}
        </div>
      </TactileCard>

      {/* HyperFrames Mechanic 5: Bottom Progress Hairline */}
      <BottomProgressHairline color={COLOR_CRIMSON} height={4} />
    </SmoothStage>
  );
};

/**
 * 2. BlindCounter:
 * The AI input stream: 3 giant tactile 3D number bricks [ 496 ] [ 675 ] [ 1553 ].
 * Features HyperFrames <InversionMorphBox>: "HUMAN STRING" -> "MODEL TOKENS".
 * Pops "AI GUESS: 2 R's" with WRONG stamp, ImpactBurst, FloatingPopScore, and DoodleUnderline.
 */
export const BlindCounter: React.FC<Box & { at?: string | number; guessAt?: string | number }> = ({ at, guessAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cueF = useCue(at, 0);
  const gf = useCue(guessAt, 25);

  const guessSp = frame >= gf ? spring({ frame: frame - gf, fps, config: { damping: 14, stiffness: 150 } }) : 0;
  const physics = useGameFeelCue(guessAt ?? 25, 25, 24);

  return (
    <SmoothStage>
      {/* Horizontal Speed lines on AI guess slam */}
      <SpeedLines direction="horizontal" count={16} at={gf} color="rgba(230,57,70,0.3)" />

      <TactileCard
        title="NEURAL NETWORK INPUT STREAM"
        badge="0 CHARACTERS VISIBLE"
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
            gap: 24,
            transform: `translate(${physics.shakeX}px, ${physics.shakeY}px)`,
          }}
        >
          {/* HyperFrames Mechanic 4: Inversion Morph Box */}
          <InversionMorphBox
            originalText="HUMAN STRING: 'strawberry'"
            invertedText="MODEL TOKENS: [496, 675, 1553]"
            at={gf}
            width={740}
            height={90}
          />

          {/* 3 Giant Tactile 3D Number Bricks */}
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {['#496', '#675', '#1553'].map((b, i) => (
              <Tactile3DBlock
                key={i}
                width={240}
                height={130}
                bg="#FFFFFF"
                lipColor="#D5CEBF"
                at={cueF + i * 4}
                elevation={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <span style={{ ...mono(46, COLOR_INK), fontWeight: 900 }}>{b}</span>
                <span style={{ ...mono(18, COLOR_MUTED), fontWeight: 700 }}>INTEGER TOKEN</span>
              </Tactile3DBlock>
            ))}
          </div>

          {/* Floating score pill for tokens */}
          <FloatingPopScore text="+3 SHARDS!" cx={530} cy={110} at={cueF + 8} color={COLOR_EMERALD} />

          {/* AI Output Guess & WRONG Stamp */}
          {guessSp > 0.05 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 4, position: 'relative' }}>
              <span style={{ ...mono(36, COLOR_INK), fontWeight: 900 }}>
                AI GUESS: "2 R's"
              </span>
              <div
                style={{
                  border: `4px solid ${COLOR_CRIMSON}`,
                  background: 'rgba(230,57,70,0.14)',
                  borderRadius: 12,
                  padding: '6px 22px',
                  ...mono(28, COLOR_CRIMSON),
                  fontWeight: 900,
                  transform: `rotate(-6deg) scale(${1.2 - 0.2 * guessSp})`,
                  boxShadow: '0 8px 20px rgba(230,57,70,0.3)',
                }}
              >
                WRONG
              </div>
              <DoodleUnderline x={-10} y={38} width={220} at={gf} color={COLOR_CRIMSON} />
            </div>
          )}

          {/* Rejection Bursts */}
          {guessSp > 0.1 && (
            <>
              <ImpactBurst cx={640} cy={340} at={gf} color={COLOR_CRIMSON} count={16} radius={180} />
              <FloatingPopScore text="WRONG: 2 R's!" cx={830} cy={340} at={gf} color={COLOR_CRIMSON} />
            </>
          )}

          {guessSp > 0.3 && <HandInkCircle cx={530} cy={350} rx={160} ry={52} at={guessAt} />}
        </div>
      </TactileCard>

      <BottomProgressHairline color={COLOR_CRIMSON} height={4} />
    </SmoothStage>
  );
};

/**
 * 3. VectorObservatory:
 * High-dimensional vector space: 4 glowing coordinate nodes in geometric space.
 * Connectors with cosine distances.
 * Supercharged with VolumetricGodRays, Tactile3DBlock nodes, ImpactBursts, and DoodleUnderline.
 */
export const VectorObservatory: React.FC<Box & { at?: string | number }> = ({ at }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cueF = useCue(at, 0);
  const sp = frame >= cueF ? spring({ frame: frame - cueF, fps, config: { damping: 15, stiffness: 130 } }) : 0;

  const nodes = [
    { label: 'KING', id: '#496', x: 260, y: 160, color: COLOR_INK },
    { label: 'QUEEN', id: '#675', x: 440, y: 140, color: COLOR_CRIMSON },
    { label: 'BERRY', id: '#1553', x: 620, y: 260, color: COLOR_EMERALD },
    { label: 'APPLE', id: '#902', x: 790, y: 240, color: COLOR_INK },
  ];

  return (
    <SmoothStage>
      {/* Majestic Volumetric Rays */}
      <VolumetricGodRays cx={530} cy={220} at={cueF} rays={16} color="rgba(46,159,110,0.12)" />

      <TactileCard
        title="HIGH-DIMENSIONAL EMBEDDING SPACE"
        badge="1536 GEOMETRIC AXES"
        badgeColor={COLOR_EMERALD}
        width={1060}
        height={540}
      >
        <div style={{ position: 'relative', width: '100%', height: 380, overflow: 'hidden' }}>
          {/* Subtle Grid Lines */}
          <svg style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0.25 }}>
            <line x1={150} y1={50} x2={150} y2={350} stroke="#BBB" strokeWidth={1.5} strokeDasharray="4 4" />
            <line x1={530} y1={50} x2={530} y2={350} stroke="#BBB" strokeWidth={1.5} strokeDasharray="4 4" />
            <line x1={910} y1={50} x2={910} y2={350} stroke="#BBB" strokeWidth={1.5} strokeDasharray="4 4" />
            <line x1={100} y1={200} x2={960} y2={200} stroke="#BBB" strokeWidth={1.5} strokeDasharray="4 4" />

            {/* Connecting Vector Lines */}
            <line x1={260} y1={160} x2={440} y2={140} stroke={COLOR_CRIMSON} strokeWidth={3.5} />
            <line x1={620} y1={260} x2={790} y2={240} stroke={COLOR_EMERALD} strokeWidth={3.5} />
          </svg>

          {/* Coordinate Nodes wrapped in 3D Blocks */}
          {nodes.map((n, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: n.x - 75,
                top: n.y - 45,
              }}
            >
              <Tactile3DBlock
                width={150}
                height={88}
                bg="#FFFFFF"
                lipColor="#DDD7CC"
                at={cueF + i * 3}
                elevation={8}
                style={{
                  border: `2.5px solid ${n.color}`,
                  padding: '8px 12px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div style={{ ...serif(22, n.color, 800) }}>{n.label}</div>
                <div style={{ ...mono(16, COLOR_MUTED), fontWeight: 700 }}>ID {n.id}</div>
              </Tactile3DBlock>
            </div>
          ))}

          {/* Distance Metric Callouts */}
          <div
            style={{
              position: 'absolute',
              left: 320,
              top: 105,
              background: 'rgba(230,57,70,0.14)',
              color: COLOR_CRIMSON,
              padding: '6px 12px',
              borderRadius: 8,
              border: `1.5px solid ${COLOR_CRIMSON}`,
              ...mono(16, COLOR_CRIMSON),
              fontWeight: 800,
            }}
          >
            Δ = 0.04
          </div>
          <div
            style={{
              position: 'absolute',
              left: 680,
              top: 205,
              background: 'rgba(46,159,110,0.14)',
              color: COLOR_EMERALD,
              padding: '6px 12px',
              borderRadius: 8,
              border: `1.5px solid ${COLOR_EMERALD}`,
              ...mono(16, COLOR_EMERALD),
              fontWeight: 800,
            }}
          >
            Δ = 0.05
          </div>

          {/* Central Typographic Statement with Double Underline */}
          <div style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ ...serif(34, COLOR_INK, 800) }}>
              Words are coordinates in geometric space
            </span>
            <div style={{ position: 'relative', width: 560 }}>
              <DoodleUnderline x={10} y={10} width={540} at={cueF} color={COLOR_INK} />
            </div>
          </div>

          {/* Particle Bursts on node links */}
          {sp > 0.2 && (
            <>
              <ImpactBurst cx={440} cy={140} at={cueF} color={COLOR_CRIMSON} count={12} radius={140} />
              <ImpactBurst cx={620} cy={260} at={cueF} color={COLOR_EMERALD} count={12} radius={140} />
              <FloatingPopScore text="GEOMETRIC SPACE" cx={530} cy={90} at={cueF} color={COLOR_INK} />
            </>
          )}

          {sp > 0.3 && <HandInkCircle cx={530} cy={350} rx={280} ry={42} at={at} />}
        </div>
      </TactileCard>

      <BottomProgressHairline color={COLOR_EMERALD} height={4} />
    </SmoothStage>
  );
};

/**
 * 4. MemoryBelt:
 * Physical conveyor shelf pushing old instructions off the edge into void.
 * High-contrast 3D cards dashing with SpeedLines, colliding off the cliff with ImpactBurst,
 * and popping FloatingPopScore("EVICTED OFF CLIFF!").
 */
export const MemoryBelt: React.FC<Box & { at?: string | number; pushAt?: string | number }> = ({ at, pushAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pf = useCue(pushAt, 15);
  const pushSp = frame >= pf ? spring({ frame: frame - pf, fps, config: { damping: 15, stiffness: 110 } }) : 0;
  const physics = useGameFeelCue(pushAt ?? 15, 15, 24);

  const shiftX = pushSp * 190;

  const tokens = [
    { title: '🔒 RULE #1', sub: 'Never mention key', dead: true },
    { title: 'SYSTEM PROMPT', sub: 'You are helpful assistant', dead: false },
    { title: 'USER QUERY', sub: 'Summarize report', dead: false },
    { title: 'NEW DOCUMENT', sub: '+12k input tokens', dead: false },
    { title: 'LATEST INPUT', sub: 'Incoming prompt stream', dead: false },
  ];

  return (
    <SmoothStage>
      {/* High-velocity conveyor dash streaks */}
      <SpeedLines direction="horizontal" count={16} at={pf} color="rgba(230,57,70,0.3)" />

      <TactileCard
        title="CONTEXT WINDOW BUFFER (128K TOKENS)"
        badge="FIFO QUEUE"
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
            gap: 36,
            overflow: 'hidden',
            transform: `translate(${physics.shakeX}px, ${physics.shakeY}px)`,
          }}
        >
          {/* Conveyor Shelf */}
          <div
            style={{
              width: '92%',
              height: 190,
              position: 'relative',
              borderBottom: '3.5px solid #D5CEBF',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: 20, transform: `translateX(${-shiftX}px)` }}>
              {tokens.map((tok, i) => {
                const isFalling = i === 0 && pushSp > 0.4;
                return (
                  <div
                    key={i}
                    style={{
                      transform: isFalling ? `translateY(${pushSp * 90}px) rotate(${pushSp * 32}deg)` : 'none',
                      opacity: isFalling ? Math.max(0, 1 - (pushSp - 0.4) * 2.2) : 1,
                    }}
                  >
                    <Tactile3DBlock
                      width={210}
                      height={140}
                      bg={isFalling ? 'rgba(230,57,70,0.08)' : '#FFFFFF'}
                      lipColor={isFalling ? '#E63946' : '#DDD7CC'}
                      at={pf}
                      elevation={10}
                      style={{
                        border: `2px solid ${isFalling ? COLOR_CRIMSON : '#D5CEBF'}`,
                        padding: '16px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ ...mono(20, isFalling ? COLOR_CRIMSON : COLOR_INK), fontWeight: 800 }}>
                          {tok.title}
                        </div>
                        <div style={{ ...serif(16, COLOR_MUTED), marginTop: 4 }}>
                          {tok.sub}
                        </div>
                      </div>
                      <SkeletonBars widths={['80%', '55%']} height={8} gap={6} />
                    </Tactile3DBlock>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Edge Drop Alert with Doodle Underline */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <span style={{ ...mono(26, pushSp > 0.4 ? COLOR_CRIMSON : COLOR_MUTED), fontWeight: 800 }}>
              {pushSp > 0.4 ? '↑ INITIAL INSTRUCTIONS DROPPED BEYOND BUFFER' : 'BUFFER FILLING UP (128K)'}
            </span>
            {pushSp > 0.4 && <DoodleUnderline x={-10} y={32} width={580} at={pf} color={COLOR_CRIMSON} />}
          </div>

          {/* Impact Burst & Pop Score on cliff drop */}
          {pushSp > 0.4 && (
            <>
              <ImpactBurst cx={220} cy={290} at={pf} color={COLOR_CRIMSON} count={16} radius={190} />
              <FloatingPopScore text="EVICTED OFF CLIFF!" cx={360} cy={140} at={pf} color={COLOR_CRIMSON} />
            </>
          )}

          {pushSp > 0.4 && <HandInkCircle cx={530} cy={350} rx={270} ry={46} at={pushAt} />}
        </div>
      </TactileCard>

      <BottomProgressHairline color={COLOR_CRIMSON} height={4} />
    </SmoothStage>
  );
};

/**
 * 5. TokenTaxMeter:
 * English 4 tokens (1x base cost) vs Non-Latin / Multi-byte 18 tokens (4.5x tax).
 * Features HyperFrames <DotMatrixCounter> with 240 glowing dots and rolling counter.
 * Scale-punch counter, chunky 3D blocks, ImpactBurst, FloatingPopScore("4.5× PRICE HIKE!"),
 * and DoodleUnderline.
 */
export const TokenTaxMeter: React.FC<Box & { at?: string | number; compareAt?: string | number }> = ({ at, compareAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cf = useCue(compareAt, 15);
  const p = frame >= cf ? spring({ frame: frame - cf, fps, config: { damping: 14, stiffness: 140 } }) : 0;
  const physics = useGameFeelCue(compareAt ?? 15, 15, 24);

  const foreignTokens = Math.round(4 + 14 * p);

  return (
    <SmoothStage>
      {/* Volumetric god rays behind price comparison */}
      <VolumetricGodRays cx={760} cy={270} at={cf} rays={14} color="rgba(230,57,70,0.12)" />

      <TactileCard
        title="GLOBAL TOKEN PRICING RATIO"
        badge="4.5x LANGUAGE TAX"
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
            gap: 20,
            transform: `translate(${physics.shakeX}px, ${physics.shakeY}px)`,
          }}
        >
          {/* Main Comparison Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 60, width: '100%' }}>
            {/* English Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <span style={{ ...mono(22, COLOR_MUTED), fontWeight: 800 }}>ENGLISH (LATIN)</span>
              <div style={{ ...serif(20, COLOR_INK, 700), fontStyle: 'italic' }}>
                "Hello, how are you?"
              </div>
              <Tactile3DBlock
                width={270}
                height={120}
                bg="#FFFFFF"
                lipColor="#DDD7CC"
                at={cf}
                elevation={10}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <div style={{ ...mono(40, COLOR_INK), fontWeight: 800 }}>4 TOKENS</div>
                <div style={{ ...mono(16, COLOR_EMERALD), fontWeight: 800, marginTop: 4 }}>
                  1.0x BASE COST
                </div>
              </Tactile3DBlock>
            </div>

            {/* Divider */}
            <div style={{ height: 160, width: 2, background: '#D5CEBF' }} />

            {/* Non-Latin Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <span style={{ ...mono(22, COLOR_CRIMSON), fontWeight: 800 }}>NON-LATIN / MULTI-BYTE</span>
              <div style={{ ...serif(20, COLOR_INK, 700), fontStyle: 'italic' }}>
                "مرحبا كيف حالك؟"
              </div>
              <Tactile3DBlock
                width={270}
                height={120}
                bg="#FFFFFF"
                lipColor="#E63946"
                at={cf}
                elevation={12}
                style={{
                  border: `3px solid ${COLOR_CRIMSON}`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    ...mono(42, COLOR_CRIMSON),
                    fontWeight: 900,
                    transform: `scale(${p > 0.1 && p < 0.9 ? 1.15 : 1})`,
                  }}
                >
                  {foreignTokens} TOKENS
                </div>
                <div style={{ ...mono(16, COLOR_CRIMSON), fontWeight: 800, marginTop: 4, position: 'relative' }}>
                  {p > 0.5 ? '4.5x TOKEN TAX' : 'CALCULATING TAX...'}
                  {p > 0.5 && <DoodleUnderline x={-10} y={22} width={160} at={cf} color={COLOR_CRIMSON} />}
                </div>
              </Tactile3DBlock>
            </div>
          </div>

          {/* HyperFrames Mechanic 3: DotMatrixCounter */}
          <div style={{ width: '90%', display: 'flex', justifyContent: 'center' }}>
            <DotMatrixCounter count={144} cols={24} at={at} morphAt={cf} label="50,000 STATISTICAL SUBWORD FRAGMENTS" unit="TOKENS" />
          </div>

          {/* Juice Bursts on 4.5x tax hit */}
          {p > 0.4 && (
            <>
              <ImpactBurst cx={760} cy={270} at={cf} color={COLOR_CRIMSON} count={16} radius={200} />
              <FloatingPopScore text="4.5× PRICE HIKE!" cx={760} cy={120} at={cf} color={COLOR_CRIMSON} />
            </>
          )}

          {p > 0.4 && <HandInkCircle cx={760} cy={270} rx={160} ry={60} at={compareAt} />}
        </div>
      </TactileCard>

      <BottomProgressHairline color={COLOR_CRIMSON} height={4} />
    </SmoothStage>
  );
};
