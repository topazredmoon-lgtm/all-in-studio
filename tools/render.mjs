// node tools/render.mjs <video_id> [--concurrency=6] [--chunk=1500] [--rebundle]
// Muted video in resumable per-chunk cached segments, then lossless concat + master.wav mux.
// Upgrades (2026-10-14):
// - Per-chunk content hashing (`srchash.py --chunks`): editing 1 beat only re-renders the affected chunk, never the whole film.
// - Remapping audio (`master.wav`) without frame-timing changes reuses 100% of video chunks and remuxes in ~1s.
// - Shared Webpack bundle cache (`bundle_<bundleHash>`) + GPU acceleration (`chromiumOptions: { gl: 'angle' }`).
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
if (!vid || vid === '--help' || vid === '-h') {
  console.log(`Usage: node tools/render.mjs <video_id> [--concurrency=6] [--chunk=1500] [--rebundle]
Muted video in resumable per-chunk cached segments, lossless concat + master.wav mux.

Available topics:`);
  const vids = fs.readdirSync(path.join(ROOT, 'videos')).filter(d => fs.statSync(path.join(ROOT, 'videos', d)).isDirectory() && !d.startsWith('.') && !d.startsWith('_'));
  console.log('  ' + vids.join(', '));
  process.exit(0);
}

const vdir = path.join(ROOT, 'videos', vid);
if (!fs.existsSync(vdir)) {
  console.error(`Error: topic '${vid}' not found in videos/`);
  process.exit(1);
}

const opt = Object.fromEntries(process.argv.slice(3).map((a) => a.replace(/^--/, '').split('=')));
const CHUNK = Number(opt.chunk ?? 1500);
const forceRebundle = 'rebundle' in opt;
const outDir = path.join(vdir, 'out');
fs.mkdirSync(outDir, { recursive: true });
const n = Math.max(0, ...fs.readdirSync(outDir).map((f) => +((f.match(/_v(\d+)\.mp4$/) ?? [0, 0])[1]))) + 1;
const final = path.join(outDir, `${vid}_v${n}.mp4`);

const hashInfo = JSON.parse(
  execFileSync('python', [path.join(ROOT, 'tools', 'srchash.py'), vid, `--chunks=${CHUNK}`]).toString().trim()
);
const srcHash = hashInfo.full;
const videoHash = hashInfo.video;
const bundleHash = hashInfo.bundle;
const chunkHashes = hashInfo.chunks || [];

const chunkCacheDir = path.join(TMP, `chunks_${vid}`);
const legacyChunkDir = path.join(TMP, `${vid}_${srcHash}`);
fs.mkdirSync(chunkCacheDir, { recursive: true });

const bundleDir = path.join(TMP, `bundle_${bundleHash}`);
const chromiumOptions = { gl: 'angle' };
let serveUrl = bundleDir;
if (forceRebundle || !fs.existsSync(path.join(bundleDir, 'index.html'))) {
  serveUrl = await bundle({
    entryPoint: path.join(ENGINE, 'src/index.ts'),
    publicDir: path.join(ENGINE, 'public'),
    outDir: bundleDir,
  });
}

let composition;
try {
  composition = await selectComposition({
    browserExecutable: process.env.REMOTION_BROWSER || null,
    serveUrl,
    id: vid,
    chromiumOptions,
  });
} catch {
  serveUrl = await bundle({
    entryPoint: path.join(ENGINE, 'src/index.ts'),
    publicDir: path.join(ENGINE, 'public'),
    outDir: bundleDir,
  });
  composition = await selectComposition({
    browserExecutable: process.env.REMOTION_BROWSER || null,
    serveUrl,
    id: vid,
    chromiumOptions,
  });
}

const total = composition.durationInFrames;
const parts = [];
for (let s = 0, i = 0; s < total; s += CHUNK, i++) {
  const e = Math.min(total - 1, s + CHUNK - 1);
  const cHash = chunkHashes[i] || `${videoHash}_${i}`;
  const f = path.join(chunkCacheDir, `c${String(i).padStart(3, '0')}_${s}_${e}_${cHash}.mp4`);
  const legacyF = path.join(legacyChunkDir, `c${String(i).padStart(3, '0')}_${s}_${e}.mp4`);
  parts.push(f);
  if (fs.existsSync(f)) {
    console.log(`chunk ${i} cached (${s}-${e})`);
    continue;
  }
  if (fs.existsSync(legacyF)) {
    fs.copyFileSync(legacyF, f);
    console.log(`chunk ${i} migrated from legacy cache (${s}-${e})`);
    continue;
  }
  const tmpF = f.replace(/\.mp4$/, '.part.mp4');
  let last = -1;
  await renderMedia({
    browserExecutable: process.env.REMOTION_BROWSER || null,
    serveUrl,
    composition,
    codec: 'h264',
    outputLocation: tmpF,
    muted: true,
    crf: 18,
    frameRange: [s, e],
    chromiumOptions,
    concurrency: opt.concurrency ? +opt.concurrency : Math.max(2, Math.floor(os.cpus().length / 2)),
    imageFormat: 'jpeg',
    jpegQuality: 92,
    onProgress: ({ progress }) => {
      const p = Math.floor(progress * 10);
      if (p > last) {
        last = p;
        process.stdout.write(`c${i}:${p * 10}% `);
      }
    },
  });
  fs.renameSync(tmpF, f);
  console.log(`\nchunk ${i} done (${s}-${e})`);
}

const list = path.join(chunkCacheDir, `list_${videoHash}.txt`);
fs.writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
const silent = path.join(chunkCacheDir, `silent_${videoHash}.mp4`);
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', silent]);
const audio = path.join(ROOT, 'videos', vid, 'master.wav');
execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', silent, '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', 'apad', '-c:a', 'aac', '-b:a', '320k', '-shortest', '-movflags', '+faststart', final]);
fs.writeFileSync(final.replace(/\.mp4$/, '.json'), JSON.stringify({ src: srcHash, video: videoHash, rendered: new Date().toISOString() }, null, 2));
console.log(`\n${final}`);
