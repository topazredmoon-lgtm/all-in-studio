// node tools/stills.mjs <video_id> [at=0.85] [beats=a02,a03]  -> videos/<id>/qa/stills/<beat>.jpg + qa/sheet.jpg
// One still per beat at `at` of its length (default: late, after every cue has landed). Look at the sheet before any render.
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENGINE = path.join(ROOT, 'engine');
const require = createRequire(path.join(ENGINE, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { renderStill, selectComposition } = require('@remotion/renderer');

const vid = process.argv[2];
const at = Number(process.argv[3] ?? 0.85);
const only = process.argv[4] ? process.argv[4].split(',') : null;
const tl = JSON.parse(fs.readFileSync(path.join(ENGINE, 'src/videos', vid, 'timeline.json'), 'utf8'));
const dir = path.join(ROOT, 'videos', vid, 'qa', 'stills');
fs.mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(ENGINE, 'src/index.ts'), publicDir: path.join(ENGINE, 'public') });
const composition = await selectComposition({ browserExecutable: process.env.REMOTION_BROWSER || null, serveUrl, id: vid });
const files = [];
for (const b of tl.beats) {
  if (only && !only.includes(b.id)) continue;
  const frame = b.start + Math.min(b.dur - 2, Math.round(b.dur * at));
  const out = path.join(dir, `${b.id}.jpg`);
  await renderStill({ browserExecutable: process.env.REMOTION_BROWSER || null, serveUrl, composition, frame, output: out, imageFormat: 'jpeg', jpegQuality: 85, scale: 0.5 });
  files.push(out);
  process.stdout.write(`${b.id} `);
}
if (!only) {
  const cols = 4;
  execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-pattern_type', 'none', ...files.flatMap((f) => ['-i', f]), '-filter_complex',
    files.map((_, i) => `[${i}:v]scale=480:270[v${i}]`).join(';') + ';' + files.map((_, i) => `[v${i}]`).join('') +
    `xstack=inputs=${files.length}:layout=${files.map((_, i) => `${(i % cols) * 480}_${Math.floor(i / cols) * 270}`).join('|')}:fill=black[o]`,
    '-map', '[o]', '-frames:v', '1', path.join(ROOT, 'videos', vid, 'qa', `sheet_${Math.round(at * 100)}.jpg`)]);
}
console.log('\ndone');
