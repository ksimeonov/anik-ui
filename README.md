# AniK UI

A tiny, framework-agnostic CSS layout and utility system: a 12-column CSS Grid
`row`, viewport- and container-query responsive columns, spacing, flexbox,
alignment, typography and positioning utilities.

- **CSS-first.** No JavaScript runtime in the package.
- **Framework agnostic.** Angular, React, Vue, Svelte, plain HTML.
- **Bounded API.** Exactly 396 generated classes, enumerated and enforced in CI.
- **No unexpected global styles.** The reset is opt-in and never auto-enabled.

> **Status: pre-release.** The class API is being implemented against
> [`mvp-plan/15-class-api-matrix.md`](mvp-plan/15-class-api-matrix.md). The first
> published version will be `0.1.0`. While in `0.x`, class names may still move.

## Install

```bash
npm install anik-ui
```

## Import

Four entry points are published:

| Import              | What it is                   |
| ------------------- | ---------------------------- |
| `anik-ui/css`       | utilities + layout, expanded |
| `anik-ui/css/min`   | utilities + layout, minified |
| `anik-ui/reset`     | optional reset, expanded     |
| `anik-ui/reset/min` | optional reset, minified     |

Sass source is also shipped:

```scss
@use 'anik-ui'; // utilities + layout
@use 'anik-ui/scss/reset'; // optional reset
```

Plain HTML:

```html
<link rel="stylesheet" href="node_modules/anik-ui/dist/anik-ui.min.css" />
```

### Required import order

This order is a hard requirement, not a suggestion:

```text
1. anik-ui reset            (optional)
2. your framework / component styles
3. anik-ui utilities
```

Utilities are emitted **unlayered** and every utility is a single class selector
`(0,1,0)`. They beat component CSS **only** because they come later in source
order. Import them before your component CSS and your component CSS wins ties.
There is no `!important` anywhere outside the reset's `prefers-reduced-motion`
block.

The optional reset is wrapped in `@layer ak.reset`, so any consumer rule beats it
without a specificity fight.

## Browser support

| Browser             | Minimum |
| ------------------- | ------- |
| Chrome / Edge       | 111     |
| Firefox             | 113     |
| Safari / iOS Safari | 16.4    |

Roughly March–May 2023. The floor is set by container queries. No autoprefixer,
no PostCSS, no `browserslist` — every property used is unprefixed at that floor.

### Graceful degradation

Below the floor, `@container` blocks are ignored by the parser. Because the
system is mobile-first, an unsupported browser keeps the **default (smallest)
layout** rather than breaking; viewport `@media` variants still apply. This is
intended behaviour — there is no JavaScript polyfill.

## Responsive spacing escape hatch

Spacing utilities have no breakpoint variants by design. When spacing needs to
change across breakpoints, drive the token from your own stylesheet:

```css
.card-grid {
  --ak-row-gap: var(--ak-space-sm);
}

@media (min-width: 768px) {
  .card-grid {
    --ak-row-gap: var(--ak-space-xl);
  }
}
```

```html
<div class="ak-row card-grid">…</div>
```

## Containment caveat

`ak-cq` sets `container-type: inline-size`, which establishes layout, style and
size containment. A position: fixed descendant (`ak-fixed`) inside an `ak-cq`
element is positioned relative to that container, **not** the viewport. This is a
CSS containment consequence, not an AniK UI bug. Put `ak-fixed` elements outside
any `ak-cq` ancestor.

## Class reference

The full generated class list lives in
[`api/classes.txt`](api/classes.txt), regenerated from the built CSS and
asserted in CI. The authoritative contract for what is generated is
[`mvp-plan/15-class-api-matrix.md`](mvp-plan/15-class-api-matrix.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Commits follow
[Conventional Commits](https://www.conventionalcommits.org/); because merges are
squash-only, the **PR title** is the released commit message and is the enforced
gate.

## License

[MIT](LICENSE) © Kristian Simeonov
