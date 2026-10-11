// node tools/cutstills.mjs <video_id> [at=0.8] [beats=a02,a03] [--sheet name]
// One still per CUT (beats with `cuts` hard-cut on cue words), at `at` of the cut's length, plus a numbered contact sheet
// videos/<id>/qa/cuts_<name>.jpg (6 per row, 320 × 180, label = beat/cut and seconds). Look at it before any render.
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

const args = process.argv.slice(2).filter((a, i, all) => !a.startsWith('--') && all[i - 1] !== '--sheet');
const sheetName = process.argv.includes('--sheet') ? process.argv[process.argv.indexOf('--sheet') + 1] : 'all';
const [vid, atArg, onlyArg] = args;
const at = Number(atArg ?? 0.8);
const only = onlyArg ? onlyArg.split(',') : null;
const tl = JSON.parse(fs.readFileSync(path.join(ENGINE, 'src/videos', vid, 'timeline.json'), 'utf8'));
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9$%]/g, '');
const cue = (words, key, fb) => {
  if (typeof key === 'number') return key;
  if (!key) return fb;
  const [k, nth] = String(key).split('#'); let seen = 0;
  for (const w of words) if (norm(w.w).startsWith(norm(k)) && ++seen >= Number(nth ?? 1)) return Math.max(0, w.f - 4);
  return fb;
};
const shots = [];
for (const b of tl.beats) {
  if (only && !only.includes(b.id)) continue;
  const cuts = b.shot && b.shot.cuts;
  if (!cuts) { shots.push({ id: b.id, frame: b.start + Math.min(b.dur - 2, Math.round(b.dur * at)) }); continue; }
  const starts = cuts.map((c, i) => (i === 0 ? 0 : cue(b.words ?? [], c.at, Math.round((b.dur * i) / cuts.length))));
  cuts.forEach((c, i) => {
    const s = starts[i], e = i + 1 < cuts.length ? starts[i + 1] : b.dur;
    if (e > s) shots.push({ id: `${b.id}.${i}`, frame: b.start + s + Math.min(e - s - 2, Math.round((e - s) * at)), len: (e - s) / tl.fps });
  });
}
const dir = path.join(ROOT, 'videos', vid, 'qa', 'cuts');
fs.mkdirSync(dir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(ENGINE, 'src/index.ts'), publicDir: path.join(ENGINE, 'public') });
const composition = await selectComposition({ browserExecutable: process.env.REMOTION_BROWSER || null, serveUrl, id: vid });
const files = [];
for (const s of shots) {
  const out = path.join(dir, `${s.id}.jpg`);
  await renderStill({ browserExecutable: process.env.REMOTION_BROWSER || null, serveUrl, composition, frame: s.frame, output: out, imageFormat: 'jpeg', jpegQuality: 80, scale: 1 / 3 });
  files.push({ out, label: `${s.id}  ${(s.frame / tl.fps).toFixed(1)}s${s.len ? `  (${s.len.toFixed(1)}s)` : ''}` });
  process.stdout.write(`${s.id} `);
}
// contact sheet via python/PIL (labels)
const py = `
import sys, json
from PIL import Image, ImageDraw
fs = json.loads(sys.argv[1]); cols = 6; W, H = 320, 180
S = Image.new('RGB', (cols * W, ((len(fs) + cols - 1) // cols) * (H + 22)), 'black'); d = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    im = Image.open(f['out']).convert('RGB').resize((W, H)); x, y = (i % cols) * W, (i // cols) * (H + 22)
    S.paste(im, (x, y + 22)); d.text((x + 4, y + 5), f['label'], fill=(255, 220, 80))
S.save(sys.argv[2], quality=82)`;
const sheet = path.join(ROOT, 'videos', vid, 'qa', `cuts_${sheetName}.jpg`);
execFileSync('python', ['-c', py, JSON.stringify(files), sheet]);
console.log(`\n${shots.length} shots → ${sheet}`);
