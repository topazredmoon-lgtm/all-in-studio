// node bench.mjs <beat> <startSec> <frames> [concurrency] -> renders a muted H.264 chunk and prints seconds per output second
import { createRequire } from 'module'; import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve('engine/package.json'));
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');
const [beat, startSec, frames, conc = '2'] = process.argv.slice(2);
const tl = JSON.parse(fs.readFileSync('engine/src/videos/poisoned-well/timeline.json', 'utf8'));
const b = tl.beats.find((x) => x.id === beat);
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const serveUrl = await bundle({ entryPoint: path.resolve('engine/src/index.ts'), publicDir: path.resolve('engine/public'), outDir: path.resolve('.render-tmp/bundle') });
const composition = await selectComposition({ browserExecutable, serveUrl, id: 'poisoned-well' });
const s = b.start + Math.round(Number(startSec) * 30), e = s + Number(frames) - 1;
const t0 = Date.now();
fs.mkdirSync('qa', { recursive: true });
await renderMedia({ browserExecutable, serveUrl, composition, codec: 'h264', outputLocation: `qa/bench_${beat}.mp4`, muted: true, crf: 18, frameRange: [s, e], concurrency: Number(conc), imageFormat: 'jpeg', jpegQuality: 92 });
const sec = (Date.now() - t0) / 1000;
console.log(`${beat} ${frames} frames in ${sec.toFixed(1)}s => ${(sec / (Number(frames) / 30)).toFixed(1)} render-s per video-s`);
