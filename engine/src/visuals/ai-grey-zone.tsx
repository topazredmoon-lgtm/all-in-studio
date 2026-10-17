import React from 'react';
import { CONTOUR, Clip, DETAIL, Hatch, INNER, Plate, Stipple, breathe, cut, ink, useIds } from '../ds/engrave';
import { useCue } from '../ds/core';
import { color } from '../ds/tokens';

type PlateProps = {
  w: number;
  h: number;
  size?: number;
  at?: string | number;
  label?: string;
  labelAt?: string | number;
  plate?: string;
  openAt?: string | number;
  turnAt?: string | number;
  sweepAt?: string | number;
  highlightAt?: string | number;
  mergeAt?: string | number;
  flipAt?: string | number;
  dropAt?: string | number;
  wakeAt?: string | number;
};

/** 1. GuardrailGate: Iron fortress portcullis whose latch drops open on `openAt` cue while silhouette cuts at frame 0 */
export const GuardrailGate: React.FC<PlateProps> = ({ w, h, size, label, labelAt, plate, openAt }) => {
  const [archClip] = useIds(1);
  const openProg = useCue(openAt);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} plate={plate}>
      {(c) => {
        const lift = (openAt !== undefined ? openProg : c.at(28, 60)) * 58;
        const arch = 'M 88 340 L 88 140 A 112 112 0 0 1 312 140 L 312 340 Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={archClip} d={arch} />
            <ellipse cx={200} cy={352} rx={124} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d={arch} {...cut(c.contour, color.ink, CONTOUR)} />
            <Hatch clip={archClip} p={c.shade} angle={38} gap={10} op={0.26} box={[200, 120, 130, 220]} />
            <Stipple clip={archClip} p={c.detail} n={220} seed={11} op={0.2} />
            <g transform={`translate(0, ${-lift})`}>
              {[124, 162, 200, 238, 276].map((x, idx) => (
                <path key={idx} d={`M ${x} 110 L ${x} 332`} {...cut(c.inner, color.ink, INNER)} />
              ))}
              <path d="M 104 185 L 296 185 M 104 265 L 296 265" {...cut(c.inner, color.ink, INNER)} />
            </g>
            <circle cx={200} cy={225 - lift} r={14} {...ink(c.accent, color.red, 0.92)} />
          </g>
        );
      }}
    </Plate>
  );
};

/** 2. SuffixKey: Engraved skeleton key carved from jagged mathematical tokens turning in a lock on `turnAt` */
export const SuffixKey: React.FC<PlateProps> = ({ w, h, size, label, labelAt, plate, turnAt }) => {
  const [bowClip] = useIds(1);
  const turnProg = useCue(turnAt);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} plate={plate}>
      {(c) => {
        const deg = (turnAt !== undefined ? turnProg : c.at(24, 65)) * 28;
        const bow = 'M 64 200 A 52 52 0 1 1 168 200 A 52 52 0 1 1 64 200 Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={bowClip} d={bow} />
            <ellipse cx={200} cy={348} rx={132} ry={13} {...ink(c.shade, color.stageDeep, 0.9)} />
            <g transform={`rotate(${deg}, 116, 200)`}>
              <path d={bow} {...cut(c.contour, color.ink, CONTOUR)} />
              <circle cx={116} cy={200} r={22} {...cut(c.inner, color.ink, INNER)} />
              <Hatch clip={bowClip} p={c.shade} angle={42} gap={9} op={0.28} />
              <Stipple clip={bowClip} p={c.detail} n={180} seed={19} op={0.22} />
              <path d="M 168 200 L 344 200" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M 262 200 L 262 248 L 282 248 L 282 222 L 304 222 L 304 256 L 328 256 L 328 200" {...cut(c.inner, color.red, INNER)} />
              <circle cx={316} cy={244} r={7} {...ink(c.accent, color.red)} />
            </g>
          </g>
        );
      }}
    </Plate>
  );
};

/** 3. CleanResume: Engraved dossier sheet with a hidden 1px payload band revealed on `highlightAt` */
export const CleanResume: React.FC<PlateProps> = ({ w, h, size, label, labelAt, plate, highlightAt }) => {
  const [sheetClip] = useIds(1);
  const hlProg = useCue(highlightAt);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} plate={plate}>
      {(c) => {
        const sweep = (highlightAt !== undefined ? hlProg : c.at(25, 60));
        const page = 'M 92 56 L 308 56 L 308 344 L 92 344 Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={sheetClip} d={page} />
            <ellipse cx={200} cy={358} rx={110} ry={12} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d={page} {...cut(c.contour, color.ink, CONTOUR)} />
            <Hatch clip={sheetClip} p={c.shade} angle={35} gap={14} op={0.18} box={[220, 60, 88, 284]} />
            <Stipple clip={sheetClip} p={c.detail} n={210} seed={7} op={0.18} />
            {[104, 136, 168, 200, 290].map((y, idx) => (
              <path key={idx} d={`M 122 ${y} L 278 ${y}`} {...cut(c.inner, color.ink, INNER)} />
            ))}
            <rect x={118} y={232} width={Math.max(8, 164 * sweep)} height={28} rx={4} {...ink(c.accent, color.red, 0.85)} />
            <path d="M 126 246 L 274 246" {...cut(c.detail, color.ink, DETAIL)} />
          </g>
        );
      }}
    </Plate>
  );
};

/** 4. HiddenPrompt: Magnifying lens scanning over an invisible prompt line on `sweepAt` */
export const HiddenPrompt: React.FC<PlateProps> = ({ w, h, size, label, labelAt, plate, sweepAt }) => {
  const [lensClip] = useIds(1);
  const sProg = useCue(sweepAt);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} plate={plate}>
      {(c) => {
        const shift = (sweepAt !== undefined ? sProg : c.at(20, 70)) * 36;
        const lens = 'M 110 185 A 82 82 0 1 1 274 185 A 82 82 0 1 1 110 185 Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={lensClip} d={lens} />
            <ellipse cx={200} cy={352} rx={115} ry={13} {...ink(c.shade, color.stageDeep, 0.9)} />
            {/* Document sheet beneath the magnifying glass */}
            <path d="M 88 64 L 312 64 L 312 336 L 88 336 Z" {...cut(c.contour, color.ink, INNER)} />
            {[98, 128, 158, 260, 290, 316].map((y, idx) => (
              <path key={idx} d={`M 112 ${y} L 288 ${y}`} {...cut(c.inner, color.ink, DETAIL)} />
            ))}
            <g transform={`translate(${shift - 18}, 0)`}>
              <path d={lens} {...cut(c.contour, color.ink, CONTOUR)} />
              <Hatch clip={lensClip} p={c.shade} angle={45} gap={11} op={0.24} />
              <Stipple clip={lensClip} p={c.detail} n={190} seed={23} op={0.22} />
              <path d="M 250 243 L 332 325" {...cut(c.contour, color.ink, CONTOUR)} />
              <path d="M 136 185 L 248 185" {...cut(c.inner, color.red, CONTOUR)} />
              <circle cx={192} cy={185} r={9} {...ink(c.accent, color.red)} />
            </g>
          </g>
        );
      }}
    </Plate>
  );
};

/** 5. OnePipeStream: Two upper funnels (User Command & Untrusted Web Page) merging into one single token pipe on `mergeAt` */
export const OnePipeStream: React.FC<PlateProps> = ({ w, h, size, label, labelAt, plate, mergeAt }) => {
  const [pipeClip] = useIds(1);
  const mProg = useCue(mergeAt);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} plate={plate}>
      {(c) => {
        const flow = (mergeAt !== undefined ? mProg : c.at(20, 70)) * 90;
        const pipe = 'M 84 72 L 154 72 L 184 185 L 216 185 L 246 72 L 316 72 L 244 215 L 244 338 L 156 338 L 156 215 Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={pipeClip} d={pipe} />
            <ellipse cx={200} cy={354} rx={104} ry={13} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d={pipe} {...cut(c.contour, color.ink, CONTOUR)} />
            <Hatch clip={pipeClip} p={c.shade} angle={40} gap={10} op={0.25} box={[195, 72, 120, 266]} />
            <Stipple clip={pipeClip} p={c.detail} n={230} seed={31} op={0.2} />
            <path d="M 120 96 L 188 215 L 188 320" {...cut(c.inner, color.ink, INNER)} />
            <path d="M 280 96 L 212 215 L 212 320" {...cut(c.inner, color.red, INNER)} />
            <circle cx={200} cy={220 + flow} r={11} {...ink(c.accent, color.red)} />
          </g>
        );
      }}
    </Plate>
  );
};

/** 6. RuleFlip: Engraved balance switch flipping from REFUSE to COMPLY on `flipAt` */
export const RuleFlip: React.FC<PlateProps> = ({ w, h, size, label, labelAt, plate, flipAt }) => {
  const [baseClip] = useIds(1);
  const fProg = useCue(flipAt);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} plate={plate}>
      {(c) => {
        const tilt = -18 + (flipAt !== undefined ? fProg : c.at(24, 60)) * 36;
        const pillar = 'M 164 338 L 184 176 L 216 176 L 236 338 Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={baseClip} d={pillar} />
            <ellipse cx={200} cy={350} rx={118} ry={13} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d={pillar} {...cut(c.contour, color.ink, CONTOUR)} />
            <Hatch clip={baseClip} p={c.shade} angle={38} gap={9} op={0.28} />
            <Stipple clip={baseClip} p={c.detail} n={170} seed={14} op={0.22} />
            <g transform={`rotate(${tilt}, 200, 176)`}>
              <path d="M 76 176 L 324 176" {...cut(c.contour, color.ink, CONTOUR)} />
              <circle cx={86} cy={176} r={18} {...cut(c.inner, color.ink, INNER)} />
              <circle cx={314} cy={176} r={20} {...ink(c.accent, color.red, 0.92)} />
            </g>
          </g>
        );
      }}
    </Plate>
  );
};

/** 7. DataWell: Deep masonry training well where a poisoned drop falls on `dropAt` */
export const DataWell: React.FC<PlateProps> = ({ w, h, size, label, labelAt, plate, dropAt }) => {
  const [wellClip] = useIds(1);
  const dProg = useCue(dropAt);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} plate={plate}>
      {(c) => {
        const fall = (dropAt !== undefined ? dProg : c.at(20, 65)) * 120;
        const body = 'M 96 196 L 304 196 L 292 338 L 108 338 Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={wellClip} d={body} />
            <ellipse cx={200} cy={350} rx={120} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d={body} {...cut(c.contour, color.ink, CONTOUR)} />
            <path d="M 116 196 L 116 84 L 284 84 L 284 196" {...cut(c.inner, color.ink, INNER)} />
            <Hatch clip={wellClip} p={c.shade} angle={36} gap={9} op={0.3} box={[190, 196, 114, 142]} />
            <Stipple clip={wellClip} p={c.detail} n={240} seed={41} op={0.22} />
            <circle cx={200} cy={112 + fall} r={11} {...ink(c.accent, color.red)} />
          </g>
        );
      }}
    </Plate>
  );
};

/** 8. SleeperDrop: Dormant mechanical chronometer gear waking on `wakeAt` */
export const SleeperDrop: React.FC<PlateProps> = ({ w, h, size, label, labelAt, plate, wakeAt }) => {
  const [caseClip] = useIds(1);
  const wProg = useCue(wakeAt);
  return (
    <Plate w={w} h={h} size={size} label={label} labelAt={labelAt} plate={plate}>
      {(c) => {
        const handDeg = (wakeAt !== undefined ? wProg : c.at(24, 65)) * 135;
        const shell = 'M 92 200 A 108 108 0 1 1 308 200 A 108 108 0 1 1 92 200 Z';
        return (
          <g style={breathe(c.frame)}>
            <Clip id={caseClip} d={shell} />
            <ellipse cx={200} cy={352} rx={116} ry={14} {...ink(c.shade, color.stageDeep, 0.9)} />
            <path d={shell} {...cut(c.contour, color.ink, CONTOUR)} />
            <circle cx={200} cy={200} r={86} {...cut(c.inner, color.ink, INNER)} />
            <Hatch clip={caseClip} p={c.shade} angle={42} gap={11} op={0.24} box={[200, 160, 110, 150]} />
            <Stipple clip={caseClip} p={c.detail} n={220} seed={53} op={0.2} />
            <g transform={`rotate(${handDeg}, 200, 200)`}>
              <path d="M 200 200 L 200 124" {...cut(c.contour, color.red, CONTOUR)} />
              <circle cx={200} cy={124} r={8} {...ink(c.accent, color.red)} />
            </g>
            <circle cx={200} cy={200} r={9} {...ink(c.inner, color.ink)} />
          </g>
        );
      }}
    </Plate>
  );
};

export const AI_GREY_ZONE_VISUALS = {
  GuardrailGate,
  SuffixKey,
  CleanResume,
  HiddenPrompt,
  OnePipeStream,
  RuleFlip,
  DataWell,
  SleeperDrop,
};
