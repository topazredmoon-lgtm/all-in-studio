import React from 'react';
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion';
import { BeatCtx, Fonts, Grain, Ground, Word, cueFrame, useBeat } from './ds/core';
import { Chapter, Clip, Full, Registry, Split, VisualSpec } from './ds/layouts';
import { color } from './ds/tokens';

type One =
  | { layout: 'split'; L: VisualSpec; R: VisualSpec; cap?: string; act?: string }
  | { layout: 'full'; hero: VisualSpec; cap?: string; glow?: 'red' | 'warm'; bg?: string; bgFocus?: string; act?: string }
  | { layout: 'chapter'; no: string; title: string; img?: string; credit?: string; focus?: string; at?: string };
/** A beat is one shot, or several `cuts` that hard-cut on their cue words (v23 / minimal pacing: something new every 2–3 s). */
export type Shot = (One | { cuts: (One & { at?: string | number })[]; act?: string }) & { sfx?: unknown[]; act?: string };
export type Beat = { id: string; start: number; dur: number; words?: Word[]; shot?: Shot; clip?: { src: string; from: number; to: number; plate?: string; plateAt?: number; hold?: number } };
export type Timeline = { fps: number; total: number; beats: Beat[] };

const renderOne = (reg: Registry, s: One, act?: string) => {
  if (s.layout === 'split') return <Split reg={reg} L={s.L} R={s.R} cap={s.cap} act={s.act ?? act} />;
  if (s.layout === 'full') return <Full reg={reg} hero={s.hero} cap={s.cap} glow={s.glow} bg={s.bg} bgFocus={s.bgFocus} act={s.act ?? act} />;
  return <Chapter {...s} />;
};

/** A cut after the first one fades up from 40 % over 7 frames (the ground stays put underneath), so the change reads as a beat, never as an empty board. */
const Punch: React.FC<{ children: React.ReactNode; on: boolean }> = ({ children, on }) => {
  const frame = useCurrentFrame();
  if (!on) return <>{children}</>;
  const p = interpolate(frame, [0, 7], [0, 1], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: 0.4 + 0.6 * p }}>{children}</AbsoluteFill>;
};

const Cuts: React.FC<{ reg: Registry; cuts: (One & { at?: string | number })[]; act?: string }> = ({ reg, cuts, act }) => {
  const { words, dur } = useBeat();
  const starts = cuts.map((c, i) => (i === 0 ? 0 : cueFrame(words, c.at, Math.round((dur * i) / cuts.length))));
  return (
    <>
      <Ground act={act} />
      {cuts.map((c, i) => {
        const from = starts[i];
        const to = i + 1 < cuts.length ? starts[i + 1] : dur;
        if (to <= from) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={to - from} name={`cut${i}`}>
            <BeatCtx.Provider value={{ words: words.map((w) => ({ ...w, f: w.f - from })), dur: to - from }}>
              <Punch on={i > 0}>{renderOne(reg, c, act)}</Punch>
            </BeatCtx.Provider>
          </Sequence>
        );
      })}
    </>
  );
};

export const makeVideo = (tl: Timeline, visuals: Registry) => {
  const V: React.FC = () => (
    <AbsoluteFill style={{ background: color.stage }}>
      <Fonts />
      {tl.beats.map((b) => (
        <Sequence key={b.id} from={b.start} durationInFrames={b.dur} name={b.id}>
          <BeatCtx.Provider value={{ words: b.words ?? [], dur: b.dur }}>
            {b.clip ? <Clip {...b.clip} fps={tl.fps} /> : 'cuts' in (b.shot as Shot) ? <Cuts reg={visuals} cuts={(b.shot as any).cuts} act={b.shot?.act} /> : renderOne(visuals, b.shot as One)}
          </BeatCtx.Provider>
        </Sequence>
      ))}
      <Grain />
    </AbsoluteFill>
  );
  return V;
};
