#!/usr/bin/env node
/*
 * motion_lint — AST static lint for anti-amateur motion tells (UPG-L4; T-R2B).
 * Proposal by ll-alpha-free (report-only per-file cleanliness scan); implemented here
 * with the repo's OWN typescript package (no new dependency) as a real AST walk.
 *
 * Rules:
 *  R1 bare-linear-entrance  `interpolate(...)` inside a style `opacity`/`transform`
 *                           property with NO `easing` in its options object.
 *                           (Lesson #85 motion tell: linear interpolations move like
 *                           a tween, not like an object.)
 *  R2 dead-fade             a style object that animates ONLY `opacity` across
 *                           >= 40 frames (a fade with nothing else moving = a slide).
 *  R3 unsprung-scale        `transform: ...scale(${interpolate(...)}...)` with no
 *                           easing -> scale pops with no physics. (tactile.tsx /
 *                           juice.tsx spring these; that is the house standard.)
 *  R4 Easing.linear         explicit linear entrance easing.
 *
 * Report-only by default (WARN lines, exit 0). Pass --strict to FAIL (exit 1).
 * Usage:  node tools/motion_lint.mjs [--strict] [--json out.json]
 * PASS evidence is printed too: counts of springs/Easing/de-tweens per file shelf.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ENGINE = path.resolve(HERE, '..', 'engine');
const require = createRequire(import.meta.url);

let ts;
try {
  ts = require(path.join(ENGINE, 'node_modules', 'typescript', 'lib', 'typescript.js'));
} catch (e) {
  console.error('FAIL [motion_lint] cannot load engine/node_modules/typescript — run once in engine/ (npm install)');
  process.exit(2);
}

const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const _ji = args.indexOf('--json');
const JSON_OUT = _ji >= 0 ? args[_ji + 1] : null;
let SRC_ARG = null;
for (let i = 0; i < args.length - 1; i++) if (args[i] === '--src') SRC_ARG = args[i + 1];
const SRC = SRC_ARG ? path.resolve(SRC_ARG) : path.join(ENGINE, 'src');

function* walkFiles(dir) {
  for (const p of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, p.name);
    if (p.isDirectory()) yield* walkFiles(full);
    else if (/\.(tsx|ts)$/.test(p.name)) yield full;
  }
}

const findings = [];
const shelf = { files: 0, withSpring: 0, withEasing: 0, withProgHelpers: 0 };

for (const file of walkFiles(SRC)) {
  shelf.files++;
  const sourceText = fs.readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, sourceText, ts.ScriptTarget.ES2020, true, ts.ScriptKind.TSX);
  const rel = path.relative(SRC, file).replace(/\\/g, '/');
  const hasSpring = /spring\(/.test(sourceText);
  const hasEasing = /Easing\./.test(sourceText);
  const hasProg = /prog\(|enterStyle|useGameFeel|useCue\(/.test(sourceText);
  if (hasSpring) shelf.withSpring++;
  if (hasEasing) shelf.withEasing++;
  if (hasProg) shelf.withProgHelpers++;

  function ctxOf(stack) {
    // walk upward: find nearest PropertyAssignment name (style props)
    for (let i = stack.length - 1; i >= 0; i--) {
      const n = stack[i];
      if (ts.isPropertyAssignment(n) && n.name && (ts.isIdentifier(n.name) || ts.isStringLiteral(n.name))) {
        return { name: n.name.text, node: n, stack: stack.slice(0, i) };
      }
      if (ts.isJsxAttribute(n) && n.name) return { name: n.name.text, node: n, stack: stack.slice(0, i) };
    }
    return null;
  }

  function objectAncestor(stack) {
    for (let i = stack.length - 1; i >= 0; i--) {
      if (ts.isObjectLiteralExpression(stack[i])) return stack[i];
    }
    return null;
  }

  function interpolationCalls(root) {
    const out = [];
    (function vis(n) {
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'interpolate') out.push(n);
      n.forEachChild(vis);
    })(root);
    return out;
  }

  const propStack = [];
  (function visit(n) {
    propStack.push(n);
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === 'interpolate') {
      const args = n.arguments;
      const opts = args.length >= 4 ? args[3] : null;
      const optObj = opts && ts.isObjectLiteralExpression(opts) ? opts : null;
      const noEasing = optObj ? !optObj.properties.some((p) =>
        (ts.isPropertyAssignment(p) || ts.isShorthandPropertyAssignment(p)) &&
        (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) && p.name.text === 'easing') : true;
      const ctx = ctxOf(propStack.slice(0, -1));
      if (optObj && noEasing && ctx && ctx.name && ['opacity', 'transform', 'width', 'left', 'right', 'top'].includes(ctx.name)) {
        const { line } = sf.getLineAndCharacterOfPosition(n.getStart(sf));
        const ctxText = ctx.node ? ctx.node.getFullText(sf) : '';
        const isScale = ctx.name === 'transform' && /scale\(/.test(ctxText) ? 'R3' : 'R1';
        // R2: opacity-only long fade — same object has no transform property
        if (ctx.name === 'opacity') {
          const obj = objectAncestor(propStack.slice(0, -1));
          const hasTransformSibling = obj ? obj.properties.some((p) =>
            ts.isPropertyAssignment(p) && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) &&
            p.name.text === 'transform') : false;
          if (!hasTransformSibling) {
            let dur = null;
            try {
              const rng = args[1]; // [a, a+d]
              if (ts.isArrayLiteralExpression(rng) && rng.elements.length === 2) {
                const t2 = rng.elements[1].getText(sf);
                const t1 = rng.elements[0].getText(sf);
                const m2 = /\+\s*(\d+)/.exec(t2);
                if (m2) dur = Number(m2[1]);
                else if (/^\d+$/.test(t1) && /^\d+$/.test(t2)) dur = Number(t2) - Number(t1);
              }
            } catch { }
            if (dur === null || dur >= 40) {
              findings.push({ rule: 'R2', file: rel, line: line + 1, desc: `opacity-only fade${dur ? ` over ${dur}f` : ''}, no transform on the same element (dead-fade slide)` });
            }
          }
        } else if (isScale === 'R3') {
          findings.push({ rule: 'R3', file: rel, line: line + 1, desc: 'scale via interpolate with no easing/spring — pop without physics' });
        } else {
          findings.push({ rule: 'R1', file: rel, line: line + 1, desc: `bare interpolate() drives ${ctx.name} with no easing (linear entrance)` });
        }
      }
    } else if (ts.isPropertyAccessExpression(n) && ts.isIdentifier(n.name) && n.name.text === 'linear' &&
      n.expression && ts.isIdentifier(n.expression) && n.expression.text === 'Easing' &&
      (n.parent && ts.isPropertyAssignment(n.parent)) &&
      n.parent.name && (ts.isIdentifier(n.parent.name)) && n.parent.name.text === 'easing') {
      const { line } = sf.getLineAndCharacterOfPosition(n.getStart(sf));
      findings.push({ rule: 'R4', file: rel, line: line + 1, desc: 'Easing.linear passed as the entrance easing' });
    }
    n.forEachChild(visit);
    propStack.pop();
  })(sf);
}

// dedupe by file+line+rule
const seen = new Set();
const uniq = findings.filter((f) => {
  const k = `${f.rule}|${f.file}|${f.line}`;
  if (seen.has(k)) return false;
  seen.add(k); return true;
});

console.log('=== MOTION LINT (AST via repo typescript) ===');
console.log(`  shelf: ${shelf.files} files scanned | spring() in ${shelf.withSpring} | Easing in ${shelf.withEasing} | prog/enterStyle/useCue helpers in ${shelf.withProgHelpers}`);
const byRule = {};
for (const f of uniq) byRule[f.rule] = (byRule[f.rule] || 0) + 1;
console.log(`  findings: ${uniq.length} (rules: ${JSON.stringify(byRule)})`);
for (const f of uniq.slice(0, 60)) {
  console.log(`  WARN [motion_lint] ${f.rule} ${f.file}:${f.line} — ${f.desc}`);
}
if (uniq.length > 60) console.log(`  ... ${uniq.length - 60} more`);
if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify({ shelf, findings: uniq }, null, 1), 'utf8');
  console.log(`  wrote ${JSON_OUT}`);
}
console.log(uniq.length === 0
  ? 'PASS [motion_lint] no motion tells found'
  : (STRICT ? `FAIL [motion_lint] ${uniq.length} motion tells` : 'report-only (no exit failure; add --strict to enforce)'));
process.exit(uniq.length && STRICT ? 1 : 0);
