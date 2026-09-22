#!/usr/bin/env node
/**
 * Assemble the GitHub Pages site from the built CSS and the playground.
 *
 *   npm run build && npm run build:site     # writes _site/
 *
 * The playground links `../dist/*.css`, so the site keeps the repository layout —
 * `_site/dist/` next to `_site/playground/` — and the root page redirects to the
 * playground. Deployed from `main` by the release workflow (spec 11).
 */
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = resolve(root, '_site');

if (!existsSync(resolve(root, 'dist', 'anik-ui.css'))) {
  console.error('dist/ is missing — run `npm run build` first.');
  process.exit(1);
}

rmSync(site, { recursive: true, force: true });
mkdirSync(site);
cpSync(resolve(root, 'dist'), resolve(site, 'dist'), { recursive: true });
cpSync(resolve(root, 'playground'), resolve(site, 'playground'), {
  recursive: true
});
writeFileSync(
  resolve(site, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>AniK UI</title>
    <meta http-equiv="refresh" content="0; url=playground/" />
    <link rel="canonical" href="playground/" />
  </head>
  <body>
    <a href="playground/">AniK UI playground</a>
  </body>
</html>
`
);

console.log(`Site written to ${site}`);
