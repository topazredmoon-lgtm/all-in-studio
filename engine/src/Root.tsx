import React from 'react';
import { Composition } from 'remotion';
import { makeVideo, Timeline } from './Video';
import { PlateSheet } from './PlateSheet';
import * as captchas from './visuals/captchas';
import * as captchas2 from './visuals/captchas2';
import * as aibm from './visuals/aibm';
import * as aiban from './visuals/aiban';
import * as cnai from './visuals/cnai';
import * as aidumber from './visuals/aidumber';
import * as musk from './visuals/musk';
import * as greyhat from './visuals/greyhat';
import * as powerbill from './visuals/ai-power-bill';
import * as pricing from './visuals/pricing';
import * as microwave from './visuals/microwave-trading';
import * as newai from './visuals/new-ai-reasoning';
import * as pw from './visuals/poisoned-well';
import { AI_GREY_ZONE_VISUALS } from './visuals/ai-grey-zone';
import * as applyButtonVisuals from './visuals/apply-button';
import * as tokensExplainedVisuals from './visuals/tokens-explained';
import captchas3minTl from './videos/captchas-3min/timeline.json';
import captchasFullTl from './videos/captchas-full/timeline.json';
import captchasSampleTl from './videos/captchas-sample/timeline.json';
import aibmTl from './videos/ai-black-markets/timeline.json';
import aibanTl from './videos/ai-ban/timeline.json';
import cnaiTl from './videos/china-ai-underground/timeline.json';
import aidumberTl from './videos/why-ai-dumber/timeline.json';
import elonMuskTl from './videos/elon-musk/timeline.json';
import greyhatTl from './videos/greyhat-ai/timeline.json';
import powerbillTl from './videos/ai-power-bill/timeline.json';
import surveillancePricingTl from './videos/surveillance-pricing/timeline.json';
import microwaveTl from './videos/microwave-trading/timeline.json';
import newAiTl from './videos/new-ai-reasoning/timeline.json';
import poisonedWellTl from './videos/poisoned-well/timeline.json';
import aiGreyZoneTl from './videos/ai-grey-zone/timeline.json';
import theAiCastTl from './videos/the-ai-cast/timeline.json';
import tokensExplainedTl from './videos/tokens-explained/timeline.json';
import applyButtonTl from './videos/apply-button/timeline.json';
import * as core from './ds/core';
import * as kit from './ds/kit';
import * as plates from './ds/plates';
import * as evidence from './ds/evidence';
import * as tactile from './ds/tactile';

const { SHADOW_DEEP, SHADOW_PAPER, ...tactileVisuals } = tactile;

// Shared visual registry: every video inherits all kit items, authentic UI widgets, and visuals
const sharedVisuals: Record<string, any> = {
  Print: core.Print,
  ...kit,
  ...tactileVisuals,
  ...captchas,
  ...captchas2,
  ...aibm,
  ...aiban,
  ...cnai,
  ...plates,
  ...evidence,
  ...AI_GREY_ZONE_VISUALS,
  ...applyButtonVisuals,
  ...tokensExplainedVisuals,
  ...powerbill,
};

// One entry per video: its timeline (tools/build.py) + the topic visuals it may use (on top of the shared ds/).
const videos: { id: string; tl: Timeline; visuals: Record<string, any> }[] = [
  { id: 'captchas-sample', tl: captchasSampleTl as unknown as Timeline, visuals: { ...captchas, ...captchas2 } },
  { id: 'captchas-3min', tl: captchas3minTl as unknown as Timeline, visuals: captchas },
  { id: 'captchas-full', tl: captchasFullTl as unknown as Timeline, visuals: { ...captchas, ...captchas2 } },
  { id: 'ai-black-markets', tl: aibmTl as unknown as Timeline, visuals: aibm },
  { id: 'ai-ban', tl: aibanTl as unknown as Timeline, visuals: { ...aibm, ...aiban } },
  { id: 'china-ai-underground', tl: cnaiTl as unknown as Timeline, visuals: cnai },
  { id: 'why-ai-dumber', tl: aidumberTl as unknown as Timeline, visuals: aidumber },
  { id: 'elon-musk', tl: elonMuskTl as unknown as Timeline, visuals: musk },
  { id: 'greyhat-ai', tl: greyhatTl as unknown as Timeline, visuals: greyhat },
  { id: 'ai-power-bill', tl: powerbillTl as unknown as Timeline, visuals: powerbill },
  { id: 'surveillance-pricing', tl: surveillancePricingTl as unknown as Timeline, visuals: pricing },
  { id: 'microwave-trading', tl: microwaveTl as unknown as Timeline, visuals: microwave },
  { id: 'new-ai-reasoning', tl: newAiTl as unknown as Timeline, visuals: newai },
  { id: 'poisoned-well', tl: poisonedWellTl as unknown as Timeline, visuals: pw },
  { id: 'ai-grey-zone', tl: aiGreyZoneTl as unknown as Timeline, visuals: AI_GREY_ZONE_VISUALS },
  { id: 'the-ai-cast', tl: theAiCastTl as unknown as Timeline, visuals: {} },
  { id: 'tokens-explained', tl: tokensExplainedTl as unknown as Timeline, visuals: tokensExplainedVisuals },
  { id: 'apply-button', tl: applyButtonTl as unknown as Timeline, visuals: applyButtonVisuals },
];

export const Root: React.FC = () => (
  <>
    <Composition id="plate-sheet" component={PlateSheet} durationInFrames={150} fps={30} width={2400} height={2400} />
    {videos.map((v) => (
      <Composition key={v.id} id={v.id} component={makeVideo(v.tl, { ...sharedVisuals, ...v.visuals })} durationInFrames={Math.max(1, v.tl.total)} fps={v.tl.fps} width={1920} height={1080} />
    ))}
  </>
);
