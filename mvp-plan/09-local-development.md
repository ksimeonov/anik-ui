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

## Sass entrypoint resolution — test both forms

The most likely packaging failure is a Sass consumer that cannot resolve the package.
Two forms must both work from the installed tarball, and both must be checked before
release:

```scss
@use 'anik-ui';                       // resolves via exports `sass` condition
@use 'anik-ui/src/scss/index';        // direct path fallback
```

Sass `pkg:` URLs read the package `exports` map with the `sass` condition, but not every
consumer toolchain implements the `pkg:` importer. Angular's build pipeline is the
specific case to verify, since Angular is in the required consumer matrix.

> **Verified against a local-registry install (Verdaccio):** the *bare* form
> `@use 'anik-ui'` only resolves in toolchains that layer Node resolution onto
> Sass — webpack `sass-loader`, Vite, Angular's builder. The plain Dart Sass CLI
> needs the explicit scheme: `@use 'pkg:anik-ui'` (with `--pkg-importer=node`),
> `@use 'pkg:anik-ui/css'`, `@use 'pkg:anik-ui/scss/reset'`. The
> `@use 'anik-ui/src/scss/index'` direct-path fallback works everywhere with
> `--load-path=node_modules`. All three resolved correctly from the packaged
> tarball; this is the check the Angular consumer must repeat.

Also verify the compiled-CSS paths from a real install:

```scss
@use 'anik-ui/css';
@use 'anik-ui/reset';
```

```html
<link rel="stylesheet" href="node_modules/anik-ui/dist/anik-ui.min.css">
```

## Verify import order

The consumer test apps must import in the documented order — reset, then component
styles, then utilities — and one of them should deliberately verify that a utility
overrides a component rule. See
[`16-cascade-and-browser-support.md`](16-cascade-and-browser-support.md).
