// Emission-order test (spec 11 §3 / D-028). Mobile-first resolution and
// container-over-viewport precedence are pure source-order effects, so they are
// testable without a browser.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Strip comments: the header banner lists every @media/@container width in a
// fixed order and would defeat the ascending-order checks below.
const css = readFileSync(
  resolve(import.meta.dirname, '..', 'dist', 'anik-ui.css'),
  'utf8'
).replace(/\/\*[\s\S]*?\*\//g, '');

const mediaWidths = [...css.matchAll(/@media \(min-width:\s*(\d+)px\)/g)].map(
  (m) => Number(m[1])
);
const containerWidths = [
  ...css.matchAll(/@container \(min-width:\s*(\d+)px\)/g)
].map((m) => Number(m[1]));

test('@media blocks appear in strictly ascending min-width order', () => {
  assert.deepEqual(mediaWidths, [576, 768, 992, 1200]);
});

test('@container blocks appear in strictly ascending min-width order', () => {
  assert.deepEqual(containerWidths, [320, 480, 640, 800]);
});

test('every @media block precedes every @container block', () => {
  const firstContainer = css.indexOf('@container');
  const lastMedia = css.lastIndexOf('@media');
  assert.ok(firstContainer > -1 && lastMedia > -1);
  assert.ok(
    lastMedia < firstContainer,
    'a container variant must beat a viewport variant at the same breakpoint'
  );
});

test('the box-sizing rule is emitted before the first base rule', () => {
  const boxSizing = css.search(/box-sizing:\s*border-box/);
  const firstRow = css.search(/\.ak-row\s*>\s*\*\s*\{/); // a base rule, not the box-sizing list
  assert.ok(boxSizing > -1 && firstRow > -1);
  assert.ok(boxSizing < firstRow, 'box-sizing must come first');
});

test('unprefixed utilities precede the first @media block', () => {
  const firstMedia = css.indexOf('@media');
  assert.ok(css.search(/\.ak-p-md\s*\{/) < firstMedia);
  assert.ok(css.search(/\.ak-dir-row\s*\{/) < firstMedia);
  assert.ok(css.search(/\.ak-hidden\s*\{/) < firstMedia);
});

test('ak-flow and ak-section precede the spacing utilities they must yield to', () => {
  const firstSpacing = css.search(/\.ak-mt-0\s*\{/);
  assert.ok(firstSpacing > -1);
  assert.ok(css.search(/\.ak-flow > \* \+ \*\s*\{/) < firstSpacing);
  assert.ok(css.search(/\.ak-section\s*\{/) < firstSpacing);
});
