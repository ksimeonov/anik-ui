// Source maps ship for every built stylesheet (D-036). The minified maps went
// missing once without any test noticing, so each file's sourceMappingURL must
// resolve, relative to the CSS file, to a map whose sources resolve too.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist');

for (const file of [
  'anik-ui.css',
  'anik-ui.min.css',
  'anik-reset.css',
  'anik-reset.min.css'
]) {
  test(`${file} links a source map that resolves`, () => {
    const css = readFileSync(resolve(dist, file), 'utf8');
    const url = css.match(/sourceMappingURL=([^\s*]+)/)?.[1];
    assert.ok(url, `${file} has no sourceMappingURL comment`);

    const mapPath = resolve(dist, url);
    assert.ok(existsSync(mapPath), `${file} points at missing ${url}`);

    const map = JSON.parse(readFileSync(mapPath, 'utf8'));
    for (const source of map.sources) {
      const sourcePath = resolve(
        dirname(mapPath),
        map.sourceRoot ?? '',
        source
      );
      assert.ok(
        existsSync(sourcePath),
        `${url} lists missing source ${source}`
      );
    }
  });
}
