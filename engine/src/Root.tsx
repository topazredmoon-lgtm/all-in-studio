import React from 'react';
import { Composition } from 'remotion';
import { makeVideo, Timeline } from './Video';
import * as captchas from './visuals/captchas';
import * as captchas2 from './visuals/captchas2';
import * as aibm from './visuals/aibm';
import * as aiban from './visuals/aiban';
import captchas3minTl from './videos/captchas-3min/timeline.json';
import captchasFullTl from './videos/captchas-full/timeline.json';
import aibmTl from './videos/ai-black-markets/timeline.json';
import aibanTl from './videos/ai-ban/timeline.json';

// One entry per video: its timeline (tools/build.py) + the topic visuals it may use (on top of the shared ds/).
const videos: { id: string; tl: Timeline; visuals: Record<string, React.FC<any>> }[] = [
  { id: 'captchas-3min', tl: captchas3minTl as unknown as Timeline, visuals: captchas },
  { id: 'captchas-full', tl: captchasFullTl as unknown as Timeline, visuals: { ...captchas, ...captchas2 } },
  { id: 'ai-black-markets', tl: aibmTl as unknown as Timeline, visuals: aibm },
  { id: 'ai-ban', tl: aibanTl as unknown as Timeline, visuals: { ...aibm, ...aiban } },
];

export const Root: React.FC = () => (
  <>
    {videos.map((v) => (
      <Composition key={v.id} id={v.id} component={makeVideo(v.tl, v.visuals)} durationInFrames={Math.max(1, v.tl.total)} fps={v.tl.fps} width={1920} height={1080} />
    ))}
  </>
);
