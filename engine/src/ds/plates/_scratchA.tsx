import React from 'react';
import { AbsoluteFill, Composition, registerRoot } from 'remotion';
import { color } from '../tokens';
import * as P from './index';

const names = ['Alembic', 'BellJar', 'CopyStack', 'JugCup', 'PaperRiver', 'PressStack', 'TwoHands'];
const Root: React.FC = () => (
  <>
    {names.map((n) => {
      const C = (P as Record<string, React.FC<any>>)[n];
      const Comp: React.FC = () => (
        <AbsoluteFill style={{ background: color.stage }}>
          <C w={1000} h={1000} size={980} />
        </AbsoluteFill>
      );
      return <Composition key={n} id={n} component={Comp} durationInFrames={240} fps={30} width={1000} height={1000} />;
    })}
  </>
);
registerRoot(Root);
