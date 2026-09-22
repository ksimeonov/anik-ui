# Local Development Before Publishing

The library must be usable in real applications before the first public npm release.

## Preferred method: local tarball

Build:

```bash
npm run build
```

Create package artifact:

```bash
npm pack
```

This produces approximately:

```text
anik-ui-0.1.0.tgz
```

In a test application:

```bash
npm install ../path/to/anik-ui/anik-ui-0.1.0.tgz
```

Then consume the exact package entrypoint documented by the library.

This is preferred for release validation because it tests the packaged artifact rather than only the source tree.

## Alternative: npm link

`npm link` may be used for rapid iteration, but it should not be the final packaging validation method.

## Local registry: Verdaccio

For trying the package in a real consumer project the way it will actually be
installed — `npm install anik-ui`, version resolution, `exports` conditions, the
`npm publish` step itself — run a throwaway local registry. This is also a dry
run of the Phase 4 publish.

### Start it (this repo)

```bash
npm run local:registry     # npx verdaccio on http://localhost:4873, keep it running
```

First run downloads Verdaccio via `npx` (~20 s); it is not a dependency of the
package. Config is `.verdaccio/config.yaml` (tracked); its storage and htpasswd
under `.verdaccio/` are gitignored.

### Publish to it (this repo, second terminal)

```bash
npm run local:publish
```

`scripts/local-publish.mjs` builds, then publishes `anik-ui@0.0.0-local.<timestamp>`
— the real `version` field is a semantic-release placeholder and not valid
semver, so a throwaway prerelease is swapped in for the publish and the manifest
is restored afterwards. Re-run after any change; the timestamp increases so a
consumer can `npm install anik-ui@latest` to pull it.

### Consume it (the other project)

Point the project's registry at Verdaccio. Everything that is not `anik-ui` is
proxied straight through to npmjs, so the rest of the project's dependencies are
unaffected:

```bash
echo 'registry=http://localhost:4873/' > .npmrc
npm install anik-ui
```

To go back to the public registry, delete that `.npmrc` line. `anik-ui` is
unscoped, so a per-package `@scope:registry=` mapping is not possible — the
whole-project registry redirect above is the supported route.

### Tear down

Stop the `local:registry` process. To wipe published versions, delete
`.verdaccio/storage/`.

## Consumer matrix

Before release, validate at least:

- plain HTML/CSS
- Angular
- React or Vue

The library itself must contain no dependency on any of those frameworks.

## Sass entrypoint resolution

The most likely packaging failure is a Sass consumer that cannot resolve the package.
**Verified 2026-09-22** by installing the published tarball from Verdaccio into
throwaway consumers (`anik-ui@0.0.0-local.*`, Dart Sass 1.x):

| `@use` specifier                  | Dart Sass CLI            | Vite 8 (`sass-embedded`) | Angular 22 (`@angular/build`) |
| -------------------------------- | ------------------------ | ------------------------ | ----------------------------- |
| `anik-ui`, `anik-ui/scss`        | fails                    | works                    | works                         |
| `anik-ui/scss/reset`             | fails                    | works                    | works                         |
| `pkg:anik-ui`, `pkg:…/scss/reset` | works (`--pkg-importer=node`) | fails (no importer)   | works                         |
| `anik-ui/src/scss/index`         | works (`--load-path=node_modules`) | **fails: not exported** | works                 |
| `anik-ui/css` (compiled CSS)     | fails                    | works                    | —                             |

Consequences, reflected in the README:

- The documented forms are the bare specifiers for bundlers and `pkg:` for Dart Sass.
  The old "direct path fallback" (`anik-ui/src/scss/index`) is **not** a fallback: Vite
  enforces the `exports` map and `./src/*` is not exported. It is not public API.
- `@use` must precede other rules, so `@use 'anik-ui'` at the top of a file that also
  holds component styles emits the utilities **before** those styles and they lose ties
  (verified in Angular: a `.card { padding: 40px }` rule beat `ak-p-0`). The supported
  patterns are `@include meta.load-css('anik-ui')` after the component styles (verified
  in Vite and Angular), or separate files in order (Angular `styles` array).
- Not yet covered: webpack `sass-loader` outside Angular.

Compiled-CSS paths from a real install — all verified: every `exports` subpath
(`anik-ui`, `/css`, `/css/min`, `/reset`, `/reset/min`, `/scss`, `/scss/reset`,
`/package.json`) resolves through Node; `import 'anik-ui/css'` works in Vite; Angular
accepts `node_modules/anik-ui/dist/*.css` in its `styles` array; plain HTML links to
`node_modules/anik-ui/dist/anik-ui.min.css` work.

## Verify import order

The consumer test apps must import in the documented order — reset, then component
styles, then utilities — and one of them should deliberately verify that a utility
overrides a component rule. See
[`16-cascade-and-browser-support.md`](16-cascade-and-browser-support.md).
