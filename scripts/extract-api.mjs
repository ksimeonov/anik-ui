#!/usr/bin/env node
/**
 * Extract the public class API from the built CSS.
 *
 * Reads dist/anik-ui.css, collects every unique `.ak-*` class selector, sorts
 * them, and either writes api/classes.txt (--write) or diffs against the
 * committed file and exits non-zero on drift (--check).
 *
 * This is the contract test: public class names are API. See
 * mvp-plan/11-playground-and-testing.md and mvp-plan/15-class-api-matrix.md.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const CSS = resolve(root, 'dist/anik-ui.css');
const OUT = resolve(root, 'api/classes.txt');
const EXPECTED_COUNT = 396;

const mode = process.argv.includes('--write')
  ? 'write'
  : process.argv.includes('--check')
    ? 'check'
    : 'print';

if (!existsSync(CSS)) {
  console.error(`extract-api: ${CSS} not found — run \`npm run build\` first.`);
  process.exit(1);
}

const css = readFileSync(CSS, 'utf8');

// Strip comments, then pull class tokens beginning with `ak-` out of every
// selector. A single rule may list many selectors; we only care about the set.
const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
const classes = new Set();
for (const m of withoutComments.matchAll(/\.(ak-[A-Za-z0-9_-]+)/g)) {
  classes.add(m[1]);
}

const sorted = [...classes].sort();
const content = sorted.join('\n') + (sorted.length ? '\n' : '');

if (mode === 'write') {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, content);
  console.log(`extract-api: wrote ${sorted.length} classes to api/classes.txt`);
  process.exit(0);
}

if (mode === 'print') {
  process.stdout.write(content);
  process.exit(0);
}

// --check
let failed = false;

if (!existsSync(OUT)) {
  console.error(
    'extract-api: api/classes.txt is missing. Run `npm run api:update`.'
  );
  process.exit(1);
}

const committed = readFileSync(OUT, 'utf8');
if (committed !== content) {
  console.error(
    'extract-api: class API drift detected (built CSS vs api/classes.txt).'
  );
  const committedSet = new Set(committed.split('\n').filter(Boolean));
  for (const c of sorted) {
    if (!committedSet.has(c)) console.error(`  + ${c}`);
  }
  for (const c of committedSet) {
    if (!classes.has(c)) console.error(`  - ${c}`);
  }
  failed = true;
}

if (sorted.length !== EXPECTED_COUNT) {
  console.error(
    `extract-api: expected exactly ${EXPECTED_COUNT} classes, found ${sorted.length} (see 15-class-api-matrix.md).`
  );
  failed = true;
}

process.exit(failed ? 1 : 0);
