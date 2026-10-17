// node qa.mjs <out_dir> <scale> <frame|beat:sec,...>   renders stills of poisoned-well using the cached bundle
import { createRequire } from 'module';
import fs from 'fs'; import path from 'path';
const require = createRequire(path.resolve('engine/package.json'));
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');
const [outDir, scale, spec] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const tl = JSON.parse(fs.readFileSync('engine/src/videos/poisoned-well/timeline.json', 'utf8'));
const browserExecutable = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const bundleDir = path.resolve('.render-tmp/bundle');
fs.mkdirSync('.render-tmp', { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve('engine/src/index.ts'), publicDir: path.resolve('engine/public'), outDir: bundleDir });
const comp = await selectComposition({ browserExecutable, serveUrl, id: 'poisoned-well', chromiumOptions: {} });
for (const item of spec.split(',')) {
  const [b, ...rest] = item.split(':');
  let frame;
  if (rest.length) { const beat = tl.beats.find((x) => x.id === b); frame = beat.start + Math.round(Number(rest[0]) * 30); } else frame = Number(b);
  const out = path.join(outDir, `${item.replace(':', '_')}.jpg`);
  const t0 = Date.now();
  await renderStill({ browserExecutable, serveUrl, composition: comp, frame, output: out, imageFormat: 'jpeg', jpegQuality: 88, scale: Number(scale), chromiumOptions: {} });
  console.log(out, Date.now() - t0, 'ms');
}
