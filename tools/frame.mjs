// node tools/frame.mjs <video_id> <s1,s2,...> [out.jpg] [scale=1]  -> full-size frames for close review (out_0.jpg, out_1.jpg …)
// Upgrades (2026-10-14): Reuses cached Webpack bundle (`bundle_<bundleHash>`) and enables GPU `gl: 'angle'`.
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = path.join(ROOT, '.render-tmp');
fs.mkdirSync(TMP, { recursive: true });
const ENGINE = path.join(ROOT, 'engine');
const require = createRequire(path.join(ENGINE, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');

const [vid, secs, out = path.join(ROOT, 'videos', vid || '', 'qa', 'frame.jpg'), scale = '1'] = process.argv.slice(2);
if (!vid || !secs || vid === '--help' || vid === '-h') {
  console.log('Usage: node tools/frame.mjs <video_id> <s1,s2,...> [out.jpg] [scale=1]');
  process.exit(0);
}
fs.mkdirSync(path.dirname(out), { recursive: true });

const bundleHash = execFileSync('python', [path.join(ROOT, 'tools', 'srchash.py'), vid, '--bundle']).toString().trim();
const bundleDir = path.join(TMP, `bundle_${bundleHash}`);
const chromiumOptions = { gl: 'angle' };
let serveUrl = bundleDir;
if (!fs.existsSync(path.join(bundleDir, 'index.html'))) {
  serveUrl = await bundle({ entryPoint: path.join(ENGINE, 'src/index.ts'), publicDir: path.join(ENGINE, 'public'), outDir: bundleDir });
}
let composition;
try {
  composition = await selectComposition({ browserExecutable: process.env.REMOTION_BROWSER || null, serveUrl, id: vid, chromiumOptions });
} catch {
  serveUrl = await bundle({ entryPoint: path.join(ENGINE, 'src/index.ts'), publicDir: path.join(ENGINE, 'public'), outDir: bundleDir });
  composition = await selectComposition({ browserExecutable: process.env.REMOTION_BROWSER || null, serveUrl, id: vid, chromiumOptions });
}

for (const [i, s] of secs.split(',').entries()) {
  const o = secs.includes(',') ? out.replace(/\.jpg$/, `_${i}.jpg`) : out;
  await renderStill({ browserExecutable: process.env.REMOTION_BROWSER || null, serveUrl, composition, frame: Math.round(Number(s) * 30), output: o, imageFormat: 'jpeg', jpegQuality: 85, scale: Number(scale), chromiumOptions });
  console.log(o);
}
