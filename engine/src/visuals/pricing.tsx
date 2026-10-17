/**
 * Topic visuals: SURVEILLANCE PRICING (The Death of the Price Tag).
 *
 * Core All-in studio grammar:
 * - Left/Right split default (side-to-side evidence rhythm)
 * - Line art & bespoke vector graphics
 * - Zero plate reuse
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { hand, mono, prog, useBeat, useCue } from '../ds/core';
import { color, font } from '../ds/tokens';

export { LineIcon, IconRow, Loop, Copier, FieldCard } from '../ds/kit';

type Box = { w: number; h: number };
type Cue = string | number | undefined;

const INK = color.ink;
const MUTE = color.mute;
const RED = color.red;
