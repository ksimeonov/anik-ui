// The playground is documentation: every `ak-` class it uses must exist in the
// public API (api/classes.txt), so a renamed or removed class cannot leave a demo
// silently showing nothing.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const api = new Set(
  readFileSync(resolve(root, 'api', 'classes.txt'), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
);

const playground = resolve(root, 'playground');
const pages = readdirSync(playground).filter((f) => f.endsWith('.html'));

test('the playground has pages to check', () => {
  assert.ok(pages.length > 0, 'no .html files found in playground/');
});

for (const page of pages) {
  test(`playground/${page} uses only public ak- classes`, () => {
    const html = readFileSync(resolve(playground, page), 'utf8');
    const used = new Set();
    for (const [, value] of html.matchAll(/\bclass="([^"]*)"/g)) {
      for (const token of value.split(/\s+/)) {
        if (token.startsWith('ak-')) used.add(token);
      }
    }
    const unknown = [...used].filter((name) => !api.has(name)).sort();
    assert.deepEqual(unknown, [], `unknown classes in ${page}`);
  });
}
