/**
 * `plate-sheet` — the contact sheet for `ds/plates/`. Not part of any film: it is the QA surface for the engraving
 * plates, so a plate can be cut, looked at and fixed without rendering a whole beat. Every plate in `ds/plates/index`
 * gets a cell with its name under it; the sheet is rendered at a frame late enough that all three cutting layers and
 * the plate's own motion have landed (frame 90 ≈ 3 s), which is also the frame a plate is usually *read* at.
 *
 *   npx remotion still src/index.ts plate-sheet ../qa/plates.png --frame=90 --scale=0.5
 */
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Fonts, Grain, Ground, mono } from './ds/core';
import { color } from './ds/tokens';
import * as P from './ds/plates';

const CELL = 470;
const names = Object.keys(P).sort();

export const PlateSheet: React.FC = () => {
  const cols = Math.ceil(Math.sqrt(names.length));
  return (
    <AbsoluteFill style={{ background: color.stage }}>
      <Fonts />
      <Ground />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, alignContent: 'start', padding: 24, gap: 8 }}>
        {names.map((n) => {
          const C = (P as Record<string, React.FC<any>>)[n];
          return (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <C w={CELL} h={CELL} size={CELL * 0.92} />
              <div style={{ ...mono(26, color.red), letterSpacing: 1 }}>{n}</div>
            </div>
          );
        })}
      </div>
      <Grain />
    </AbsoluteFill>
  );
};
