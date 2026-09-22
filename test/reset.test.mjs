import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = (f) => resolve(import.meta.dirname, '..', 'dist', f);

const builtFiles = [
  'anik-ui.css',
  'anik-ui.css.map',
  'anik-ui.min.css',
  'anik-reset.css',
  'anik-reset.css.map',
  'anik-reset.min.css'
];

test('build produces every dist artifact', () => {
  for (const f of builtFiles) {
    assert.ok(existsSync(dist(f)), `missing dist/${f} — run \`npm run build\``);
  }
});

test('reset is wrapped in @layer ak.reset', () => {
  const css = readFileSync(dist('anik-reset.css'), 'utf8');
  assert.match(css, /@layer ak\.reset\s*\{/);
});

test('reset sets no background, font-family, accent-color, or outline (spec 07)', () => {
  const css = readFileSync(dist('anik-reset.css'), 'utf8').replace(
    /\/\*[\s\S]*?\*\//g,
    ''
  );
  for (const prop of [
    'background:',
    'background-color:',
    'font-family:',
    'accent-color:',
    'outline:'
  ]) {
    assert.ok(!css.includes(prop), `reset must not set \`${prop}\``);
  }
  // `color` may only appear as `color: inherit` on form elements — never a value.
  for (const m of css.matchAll(/(?<!-)color:\s*([^;}]+)/g)) {
    assert.equal(
      m[1].trim(),
      'inherit',
      `reset may only set \`color: inherit\`, found \`color: ${m[1].trim()}\``
    );
  }
});

test('the only !important in the reset is the reduced-motion block', () => {
  const css = readFileSync(dist('anik-reset.css'), 'utf8');
  const importantCount = (css.match(/!important/g) ?? []).length;
  assert.equal(
    importantCount,
    4,
    'expected exactly the 4 reduced-motion !important declarations'
  );
  const reducedMotion = css.slice(css.indexOf('prefers-reduced-motion'));
  assert.equal((reducedMotion.match(/!important/g) ?? []).length, 4);
});
