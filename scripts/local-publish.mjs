#!/usr/bin/env node
/**
 * Build AniK UI and publish it to the LOCAL Verdaccio registry, for trying the
 * package out in a real consumer project before the first official release.
 *
 *   Terminal 1:  npm run local:registry     # starts Verdaccio on :4873
 *   Terminal 2:  npm run local:publish      # build + publish from here
 *
 * Then, in the consumer project:
 *
 *   echo 'registry=http://localhost:4873/' > .npmrc
 *   npm install anik-ui
 *
 * `package.json` carries a semantic-release placeholder version that is not
 * valid semver, so this publishes a throwaway `0.0.0-local.<timestamp>`
 * prerelease instead. The timestamp increases every run, so a consumer can pull
 * the latest local build with `npm install anik-ui@latest`.
 *
 * The real package.json is restored before the script exits, even on failure.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(root, 'package.json');
const REGISTRY = 'http://localhost:4873/';

async function registryIsUp() {
  try {
    const res = await fetch(`${REGISTRY}-/ping`, {
      signal: AbortSignal.timeout(2000)
    });
    return res.ok;
  } catch {
    return false;
  }
}

if (!(await registryIsUp())) {
  console.error(
    `\n  No local registry answering at ${REGISTRY}` +
      `\n  Start it in another terminal first:\n\n      npm run local:registry\n`
  );
  process.exit(1);
}

execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });

const original = readFileSync(manifestPath, 'utf8');
const manifest = JSON.parse(original);
const localVersion = `0.0.0-local.${Date.now()}`;

try {
  writeFileSync(
    manifestPath,
    `${JSON.stringify({ ...manifest, version: localVersion }, null, 2)}\n`
  );

  execFileSync('npm', ['publish', '--registry', REGISTRY], {
    cwd: root,
    stdio: 'inherit',
    env: {
      ...process.env,
      // Verdaccio allows anonymous publish for anik-ui, but the npm CLI still
      // wants *some* token for the target registry. Any value works here.
      'npm_config_//localhost:4873/:_authToken': 'local-dev'
    }
  });
} finally {
  writeFileSync(manifestPath, original);
}

console.log(
  `\n  Published  anik-ui@${localVersion}  ->  ${REGISTRY}` +
    `\n  Browse it at ${REGISTRY}` +
    `\n\n  In the consumer project:\n` +
    `\n      echo 'registry=${REGISTRY}' > .npmrc` +
    `\n      npm install anik-ui\n` +
    `\n  Re-run this script after a change, then \`npm install anik-ui@latest\` there.\n`
);
