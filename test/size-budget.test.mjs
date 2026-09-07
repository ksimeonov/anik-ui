// Size budget (spec 11 §4 / D-035). A framework whose selling point is "tiny"
// needs a number, not an adjective.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve } from 'node:path';

const gzBytes = (file) =>
  gzipSync(readFileSync(resolve(import.meta.dirname, '..', 'dist', file)))
    .length;

test('anik-ui.min.css is within 25 KB gzipped', () => {
  const bytes = gzBytes('anik-ui.min.css');
  assert.ok(
    bytes <= 25 * 1024,
    `anik-ui.min.css is ${bytes} B gzipped (budget 25600)`
  );
});

test('anik-reset.min.css is within 2 KB gzipped', () => {
  const bytes = gzBytes('anik-reset.min.css');
  assert.ok(
    bytes <= 2 * 1024,
    `anik-reset.min.css is ${bytes} B gzipped (budget 2048)`
  );
});
