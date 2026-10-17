// node render_pw.mjs [chunkFrames]  resumable chunked render of poisoned-well -> .render-tmp/pw_chunks/c###.mp4
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve('engine/package.json'));
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const CH = Number(process.argv[2] ?? 450);
const dir = path.resolve('.render-tmp/pw_chunks'); fs.mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('engine/src/index.ts'), publicDir: path.resolve('engine/public'), outDir: path.resolve('.render-tmp/bundle_full') });
const comp = await selectComposition({ browserExecutable, serveUrl, id: 'poisoned-well' });
const total = comp.durationInFrames; console.log('total', total);
for (let a = 0, i = 0; a < total; a += CH, i++) {
  const b = Math.min(total - 1, a + CH - 1);
  const out = path.join(dir, `c${String(i).padStart(3, '0')}.mp4`);
  if (fs.existsSync(out)) { console.log('skip', out); continue; }
  const t0 = Date.now();
  await renderMedia({ composition: comp, serveUrl, codec: 'h264', crf: 16, pixelFormat: 'yuv420p', outputLocation: out + '.part.mp4', frameRange: [a, b], concurrency: 2, browserExecutable, muted: true });
  fs.renameSync(out + '.part.mp4', out);
  console.log('done', out, a, b, Math.round((Date.now() - t0) / 1000), 's');
}
console.log('ALL DONE');
