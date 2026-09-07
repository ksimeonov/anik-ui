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
@use 'anik-ui';                       // resolves via exports / legacy `sass` field
@use 'anik-ui/src/scss/index';        // direct path fallback
```

Sass `pkg:` URLs read the package `exports` map with the `sass` condition, but not every
consumer toolchain implements the `pkg:` importer. Angular's build pipeline is the
specific case to verify, since Angular is in the required consumer matrix.

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
