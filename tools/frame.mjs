// node tools/frame.mjs <video_id> <s1,s2,...> [out.jpg] [scale=1]  -> full-size frames for close review (out_0.jpg, out_1.jpg …)
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = path.join(ROOT, 'engine');
const require = createRequire(path.join(ENGINE, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');
const [vid, secs, out = path.join(ROOT, 'videos', vid, 'qa', 'frame.jpg'), scale = '1'] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.join(ENGINE, 'src/index.ts'), publicDir: path.join(ENGINE, 'public') });
const composition = await selectComposition({ serveUrl, id: vid });
for (const [i, s] of secs.split(',').entries()) {
  const o = secs.includes(',') ? out.replace(/\.jpg$/, `_${i}.jpg`) : out;
  await renderStill({ serveUrl, composition, frame: Math.round(Number(s) * 30), output: o, imageFormat: 'jpeg', jpegQuality: 85, scale: Number(scale) });
  console.log(o);
}
