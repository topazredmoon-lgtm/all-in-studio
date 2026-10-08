// node tools/render.mjs <video_id> [--concurrency=6] [--chunk=1500]
// Muted video in resumable chunks (a finished chunk is never re-rendered), then lossless concat + master.wav mux.
// Temp files live in All-in/.render-tmp: the first full render died when something else wiped %TEMP%\remotion-* mid-stitch.
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TMP = path.join(ROOT, '.render-tmp');
fs.mkdirSync(TMP, { recursive: true });
process.env.TEMP = TMP; process.env.TMP = TMP; process.env.TMPDIR = TMP;
const ENGINE = path.join(ROOT, 'engine');
const require = createRequire(path.join(ENGINE, 'package.json'));
const { bundle } = require('@remotion/bundler');
const { renderMedia, selectComposition } = require('@remotion/renderer');

const vid = process.argv[2];
const opt = Object.fromEntries(process.argv.slice(3).map((a) => a.replace(/^--/, '').split('=')));
const CHUNK = Number(opt.chunk ?? 1500);
const outDir = path.join(ROOT, 'videos', vid, 'out');
fs.mkdirSync(outDir, { recursive: true });
const n = Math.max(0, ...fs.readdirSync(outDir).map((f) => +((f.match(/_v(\d+)\.mp4$/) ?? [0, 0])[1]))) + 1; // next free number (counting files once overwrote v5)
const final = path.join(outDir, `${vid}_v${n}.mp4`);
const srcHash = execFileSync('python', [path.join(ROOT, 'tools', 'srchash.py'), vid]).toString().trim();
const chunkDir = path.join(TMP, `${vid}_${srcHash}`);
fs.mkdirSync(chunkDir, { recursive: true });

const serveUrl = await bundle({ entryPoint: path.join(ENGINE, 'src/index.ts'), publicDir: path.join(ENGINE, 'public'), outDir: path.join(TMP, 'bundle') });
const composition = await selectComposition({ serveUrl, id: vid });
const total = composition.durationInFrames;
const parts = [];
for (let s = 0, i = 0; s < total; s += CHUNK, i++) {
  const e = Math.min(total - 1, s + CHUNK - 1);
  const f = path.join(chunkDir, `c${String(i).padStart(3, '0')}_${s}_${e}.mp4`);
  parts.push(f);
  if (fs.existsSync(f)) { console.log(`chunk ${i} cached`); continue; }
  const tmpF = f.replace(/\.mp4$/, '.part.mp4');
  let last = -1;
  await renderMedia({
    serveUrl, composition, codec: 'h264', outputLocation: tmpF, muted: true, crf: 18, frameRange: [s, e],
    concurrency: opt.concurrency ? +opt.concurrency : Math.max(2, Math.floor(os.cpus().length / 2)), imageFormat: 'jpeg', jpegQuality: 92,
    onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p > last) { last = p; process.stdout.write(`c${i}:${p * 10}% `); } },
  });
  fs.renameSync(tmpF, f);
  console.log(`\nchunk ${i} done (${s}-${e})`);
}
const list = path.join(chunkDir, 'list.txt');
fs.writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
const silent = path.join(chunkDir, 'silent.mp4');
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);
const audio = path.join(ROOT, 'videos', vid, 'master.wav');
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', silent, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'apad', '-c:a', 'aac', '-b:a', '320k', '-shortest', '-movflags', '+faststart', final]);
fs.writeFileSync(final.replace(/\.mp4$/, '.json'), JSON.stringify({ src: srcHash, rendered: new Date().toISOString() }));
console.log(`\n${final}`);
