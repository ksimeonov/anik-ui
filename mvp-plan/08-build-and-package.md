# Build & Package

## Build philosophy

Keep the build small: Node.js, npm, Sass. No JavaScript bundler. **No PostCSS and no
autoprefixer** — every property used is unprefixed at the support floor in
[`16-cascade-and-browser-support.md`](16-cascade-and-browser-support.md), so there is
no `browserslist` key either.

Quality tooling: Stylelint for CSS/SCSS correctness, Prettier for formatting. Different
jobs; both are appropriate.

## Source and output

```text
src/scss/index.scss     utilities + layout entrypoint
src/scss/reset.scss     optional reset entrypoint
```

```text
dist/anik-ui.css          + .map
dist/anik-ui.min.css      + .map
dist/anik-reset.css       + .map
dist/anik-reset.min.css   + .map
```

Minified builds and source maps are both shipped: the plain-HTML and CDN consumers in
the target matrix want the minified file, and source maps make the compiled output
debuggable in devtools.

`dist/` is **built in CI, not committed**. It is in `.gitignore`. npm is the
distribution channel; installing from a git URL is not supported.

## Emission order

The build must emit rules in the exact order specified in
[`16-cascade-and-browser-support.md`](16-cascade-and-browser-support.md). Mobile-first
resolution and container-over-viewport precedence both depend on it, so partial import
order in `index.scss` is load-bearing and is asserted by a test.

## package.json

```jsonc
{
  "name": "<decided per 01-product-and-naming.md>",
  "version": "0.0.0-managed-by-semantic-release",
  "description": "…",
  "keywords": ["css", "scss", "layout", "grid", "flexbox", "container-queries", "utilities"],
  "license": "MIT",
  "repository": { "type": "git", "url": "…" },
  "homepage": "…",
  "bugs": "…",
  "sideEffects": ["*.css", "*.scss"],
  "style": "./dist/anik-ui.css",
  "sass": "./src/scss/index.scss",
  "files": ["dist", "src/scss", "README.md", "LICENSE", "CHANGELOG.md"],
  "exports": {
    ".": {
      "sass": "./src/scss/index.scss",
      "style": "./dist/anik-ui.css",
      "default": "./dist/anik-ui.css"
    },
    "./css": "./dist/anik-ui.css",
    "./css/min": "./dist/anik-ui.min.css",
    "./reset": "./dist/anik-reset.css",
    "./reset/min": "./dist/anik-reset.min.css",
    "./scss": "./src/scss/index.scss",
    "./scss/reset": "./src/scss/reset.scss",
    "./scss/*": "./src/scss/*",
    "./package.json": "./package.json"
  }
}
```

Notes on fields that are easy to get wrong:

- **`sideEffects`.** Without it, bundlers may tree-shake away a bare `import
  'anik-ui/css'` and ship a page with no styles.
- **`style` and `sass` alongside `exports`.** `exports` is correct and modern, but a
  number of Sass toolchains still resolve via these legacy fields. Both are cheap.
- **`./scss/*`.** Sass `pkg:` URLs read `exports` with the `sass` condition, but not
  every consumer toolchain implements the `pkg:` importer. The wildcard subpath keeps
  the direct-path form (`@use 'anik-ui/src/scss/index'`) working as a fallback. **Both
  forms must be tested** against a real Angular project — this is the single most
  likely packaging failure and is an explicit Phase 3 gate.
- **`version`.** Managed by the release pipeline; never edited by hand.
- **`files`, not `.npmignore`.** `files` wins when both exist; do not create an
  `.npmignore`.

## Never publish

```text
node_modules/   .env   credentials   IDE data (.idea/, .vscode/)
local test artifacts   .git/   playground sources   tests
```

Validate with `npm pack --dry-run` and review the file list before the first release.

## Repository bootstrap requirements

- committed `package-lock.json` — CI uses `npm ci`
- `.gitignore` covering `node_modules/`, `dist/`, `.idea/`, `*.tgz`
- no `engines` field: it binds every consumer. The repo's Node range is `devEngines.runtime`, and CI reads `.nvmrc` (D-047)
