// Targeted assertions on rules whose exact form is load-bearing (spec 11 §2).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Strip comments first — the header banner names @media/@container widths and
// selectors that would otherwise be mistaken for rules.
const css = readFileSync(
  resolve(import.meta.dirname, '..', 'dist', 'anik-ui.css'),
  'utf8'
).replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Concatenated bodies of every rule whose selector list contains `selector`
 * exactly. Combining them is deliberate: a primitive like `.ak-row` legitimately
 * appears in both the box-sizing list and its own grid rule.
 */
function ruleBody(selector) {
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  const bodies = [];
  while ((m = re.exec(css))) {
    const selectors = m[1].split(',').map((s) => s.trim());
    if (selectors.includes(selector))
      bodies.push(m[2].replace(/\s+/g, ' ').trim());
  }
  return bodies.join(' ; ');
}

test('.ak-row uses repeat(12, minmax(0, 1fr)), not repeat(12, 1fr)', () => {
  const body = ruleBody('.ak-row');
  assert.match(
    body,
    /grid-template-columns:\s*repeat\(12,\s*minmax\(0,\s*1fr\)\)/
  );
  assert.doesNotMatch(body, /repeat\(12,\s*1fr\)/);
});

test('.ak-row > * sets min-width: 0', () => {
  assert.match(ruleBody('.ak-row > *'), /min-width:\s*0/);
});

test('.ak-row gap default resolves to var(--ak-row-gap, 0)', () => {
  assert.match(ruleBody('.ak-row'), /gap:\s*var\(--ak-row-gap,\s*0\)/);
});

test('.ak-cq sets container-type: inline-size', () => {
  assert.match(ruleBody('.ak-cq'), /container-type:\s*inline-size/);
});

test('.ak-page is token-driven and centred', () => {
  const body = ruleBody('.ak-page');
  assert.match(body, /max-width:\s*var\(--ak-page-max,\s*75rem\)/);
  assert.match(body, /margin-inline:\s*auto/);
  assert.match(
    body,
    /padding-inline:\s*var\(--ak-page-gutter,\s*var\(--ak-space-md\)\)/
  );
});

test('every padding utility and layout primitive is in the box-sizing selector list', () => {
  const m = css.match(/([^{}]+)\{\s*box-sizing:\s*border-box;?\s*\}/);
  assert.ok(m, 'box-sizing rule not found');
  const selectors = new Set(m[1].split(',').map((s) => s.trim()));

  for (const s of [
    '.ak-row',
    '.ak-row > *',
    '.ak-page',
    '.ak-cq',
    '.ak-flex',
    '.ak-inline-flex'
  ]) {
    assert.ok(selectors.has(s), `box-sizing list missing ${s}`);
  }

  const steps = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'];
  for (const token of ['p', 'px', 'py', 'pt', 'pb', 'ps', 'pe']) {
    for (const step of steps) {
      assert.ok(
        selectors.has(`.ak-${token}-${step}`),
        `box-sizing list missing .ak-${token}-${step}`
      );
    }
  }
  // Sizing utilities need border-box for the same reason padding does:
  // inline-size: 100% + consumer padding overflows under content-box (D-039).
  for (const name of [
    'w-full',
    'w-auto',
    'w-fit',
    'max-w-full',
    'min-w-0',
    'h-full',
    'h-auto',
    'h-screen',
    'min-h-screen',
    'min-h-0'
  ]) {
    assert.ok(
      selectors.has(`.ak-${name}`),
      `box-sizing list missing .ak-${name}`
    );
  }

  // 6 primitives + 63 padding utilities + 10 sizing utilities, and nothing else.
  assert.equal(selectors.size, 79);
});

test('no !important anywhere in the utilities stylesheet', () => {
  assert.doesNotMatch(css, /!important/);
});

test('the library never sets font-family', () => {
  assert.doesNotMatch(css, /font-family/);
});

test('spacing utilities reference tokens; only margin `auto` is a literal', () => {
  for (const m of css.matchAll(
    /\.ak-(p|px|py|pt|pb|ps|pe|m|mx|my|mt|mb|ms|me|gap|gap-x|gap-y)-([a-z0-9]+)\s*\{([^}]*)\}/g
  )) {
    const [, , step, body] = m;
    if (body.includes('box-sizing')) continue; // trailing selector of the box-sizing list
    if (step === 'auto') {
      assert.match(body, /:\s*auto/);
    } else {
      assert.match(
        body,
        /var\(--ak-space-/,
        `${m[0].split('{')[0]} should use a token`
      );
    }
  }
});

test('typography sizes ship a paired line-height', () => {
  for (const size of ['xs', 'sm', 'md', 'lg', 'xl', '2xl']) {
    const body = ruleBody(`.ak-text-${size}`);
    assert.match(body, /font-size:\s*var\(--ak-font-size-/);
    assert.match(body, /line-height:\s*var\(--ak-line-height-/);
  }
});

// --- Sizing (D-039 / D-040) -------------------------------------------------

test('sizing utilities use logical properties, never width/height', () => {
  const expected = {
    'w-full': /^inline-size:\s*100%;?$/,
    'w-auto': /^inline-size:\s*auto;?$/,
    'w-fit': /^inline-size:\s*fit-content;?$/,
    'max-w-full': /^max-inline-size:\s*100%;?$/,
    'min-w-0': /^min-inline-size:\s*0;?$/,
    'h-full': /^block-size:\s*100%;?$/,
    'h-auto': /^block-size:\s*auto;?$/,
    'h-screen': /^block-size:\s*var\(--ak-viewport-block\);?$/,
    'min-h-screen': /^min-block-size:\s*var\(--ak-viewport-block\);?$/,
    'min-h-0': /^min-block-size:\s*0;?$/
  };

  for (const [name, re] of Object.entries(expected)) {
    const body = ruleBody(`.ak-${name}`)
      .replace(/box-sizing:\s*border-box;?/, '') // also in the box-sizing list
      .replace(/^\s*;\s*/, '')
      .trim();
    assert.match(body, re, `.ak-${name} declaration`);
  }
});

test('full-viewport sizing goes through the token, not a hard-coded unit', () => {
  for (const name of ['h-screen', 'min-h-screen']) {
    const body = ruleBody(`.ak-${name}`);
    assert.match(body, /var\(--ak-viewport-block\)/);
    assert.doesNotMatch(body, /\d+(dvb|svb|lvb|vh|dvh|svh|lvh)/);
  }
});

test('--ak-viewport-block defaults to the dynamic viewport block size', () => {
  assert.match(css, /--ak-viewport-block:\s*100dvb/);
});

test('ak-w-screen is not generated (100dvi includes the scrollbar)', () => {
  assert.doesNotMatch(css, /\.ak-w-screen\b/);
});
