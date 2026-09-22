# AniK UI

A tiny, framework-agnostic CSS layout and utility system: a 12-column CSS Grid
`row`, viewport- and container-query responsive columns, spacing, flexbox,
alignment, typography, sizing and positioning utilities.

- **CSS-first.** No JavaScript runtime in the package.
- **Framework agnostic.** Angular, React, Vue, Svelte, plain HTML.
- **Bounded API.** Exactly 416 generated classes, enumerated and asserted by
  the test suite (`npm test`).
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

Sass source is also shipped. `@use` has to come before any other rule in a file, so
load the utilities **last** with `meta.load-css` to keep the required import order:

```scss
@use 'sass:meta';
@use 'anik-ui/scss/reset'; // optional reset, first

// …your component styles…

@include meta.load-css('anik-ui'); // utilities + layout, last
```

Separate files listed in order work too — for example Angular's `styles` array:
a file with `@use 'anik-ui/scss/reset'`, then your styles, then a file with
`@use 'anik-ui'`. Do **not** put `@use 'anik-ui'` at the top of the file that holds
your component styles: the utilities are then emitted first and lose every tie.

How the specifier resolves depends on the toolchain:

| Toolchain                                      | Write                                   |
| ---------------------------------------------- | --------------------------------------- |
| Vite, Angular (read the package `exports` map) | `anik-ui`, `anik-ui/scss/reset`         |
| Dart Sass CLI or JS API with the Node importer | `pkg:anik-ui`, `pkg:anik-ui/scss/reset` |

For the CLI that means `sass --pkg-importer=node`. Paths into `anik-ui/src/…` are not
part of the public API, and Vite rejects them because they are not exported.

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

## Layout

Three structural classes. Everything else in the library is a utility.

| Class     | What it does                                                   |
| --------- | -------------------------------------------------------------- |
| `ak-page` | Centred page wrapper: capped width, auto margins, side gutters |
| `ak-row`  | The 12-column grid. Children are placed with `ak-col-*`        |
| `ak-cq`   | Establishes a query container, enabling the `-c-*` variants    |

```html
<div class="ak-page">
  <div class="ak-row">
    <main class="ak-col-12 ak-col-md-8">…</main>
    <aside class="ak-col-12 ak-col-md-4">…</aside>
  </div>
</div>
```

The wrapper is called `ak-page`, **not** `ak-container` — in this library
"container" always means a _query_ container (`ak-cq`), and overlapping the two
meanings would be a lasting source of confusion.

### Layout tokens

These three custom properties are the layout API. Override them anywhere — on
`:root`, on a section, or on a single element.

| Token              | Default              | Controls                        |
| ------------------ | -------------------- | ------------------------------- |
| `--ak-row-gap`     | `var(--ak-space-md)` | gutter between `ak-row` columns |
| `--ak-page-max`    | `75rem`              | `ak-page` maximum width         |
| `--ak-page-gutter` | `var(--ak-space-md)` | `ak-page` inline padding        |

**Full-width ("fluid") page.** There is no `ak-page-fluid` class; unset the cap:

```css
.hero {
  --ak-page-max: none; /* full width, gutters kept */
}
```

```html
<div class="ak-page hero">…</div>
```

**Wider or narrower pages.** Same mechanism:

```css
.marketing {
  --ak-page-max: 90rem;
}
```

**Flush grid.** `ak-row` is spaced by default. For an edge-to-edge grid use
`ak-gap-0`, or set `--ak-row-gap: 0`.

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

## Sizing

Ten utilities, no breakpoint variants. The class names keep the familiar `w` / `h`
spelling; the declarations use logical properties, so they are writing-mode
correct like the rest of the library.

| Class             | Declaration                                |
| ----------------- | ------------------------------------------ |
| `ak-w-full`       | `inline-size: 100%`                        |
| `ak-w-auto`       | `inline-size: auto`                        |
| `ak-w-fit`        | `inline-size: fit-content`                 |
| `ak-max-w-full`   | `max-inline-size: 100%`                    |
| `ak-min-w-0`      | `min-inline-size: 0`                       |
| `ak-h-full`       | `block-size: 100%`                         |
| `ak-h-auto`       | `block-size: auto`                         |
| `ak-h-screen`     | `block-size: var(--ak-viewport-block)`     |
| `ak-min-h-screen` | `min-block-size: var(--ak-viewport-block)` |
| `ak-min-h-0`      | `min-block-size: 0`                        |

### Full-viewport sections — reach for `ak-min-h-screen`

`ak-h-screen` sets a fixed height, so content taller than the viewport is
**clipped**. For a hero or a full-page section, `ak-min-h-screen` is almost
always what you want:

```html
<section class="ak-min-h-screen ak-flex ak-items-center ak-justify-center">
  …
</section>
```

Both read `--ak-viewport-block`, which defaults to `100dvb` — the _dynamic_
viewport, so it tracks mobile browser chrome showing and hiding. If you would
rather have a size that never reflows mid-scroll, override it once:

```css
:root {
  --ak-viewport-block: 100svb; /* small viewport: stable, never reflows */
}
```

### `ak-min-w-0` — the flex overflow fix

`ak-row` already sets `min-width: 0` on its children, so long unbroken content
cannot blow out a grid track. Flex containers deliberately do **not** get this
automatically, because it would change flex sizing for every consumer. Apply it
yourself when a flex child holds text, a `<pre>`, or a table that might not wrap:

```html
<div class="ak-flex ak-gap-md">
  <aside class="ak-flex-none">Sidebar</aside>
  <main class="ak-flex-1 ak-min-w-0">…long unbroken content…</main>
</div>
```

`ak-w-screen` is deliberately **not** provided: `100vw` includes the scrollbar
width and causes horizontal overflow.

## Display type and prose

Four fluid display sizes extend the `ak-text-*` scale. Each is a `clamp()` token that
grows with the viewport between a floor and a ceiling, with a paired, tighter
line-height — no breakpoint classes needed.

| Class         | Size (narrow → wide) |
| ------------- | -------------------- |
| `ak-text-3xl` | 36 → 40px            |
| `ak-text-4xl` | 40 → 48px            |
| `ak-text-5xl` | 44 → 60px            |
| `ak-text-6xl` | 48 → 72px            |

`ak-tracking-tight` / `-normal` / `-wide` set letter-spacing (tighten display type,
loosen small caps and labels).

Three prose and rhythm classes:

| Class        | What it does                                       | Token                 |
| ------------ | -------------------------------------------------- | --------------------- |
| `ak-measure` | Caps line length for readable text                 | `--ak-measure` (65ch) |
| `ak-flow`    | Even vertical space between direct children        | `--ak-flow-space`     |
| `ak-section` | Fluid block padding for page sections (64 → 120px) | `--ak-section-space`  |

```html
<section class="ak-section">
  <div class="ak-page">
    <h1 class="ak-text-5xl ak-tracking-tight">Title</h1>
    <div class="ak-flow ak-measure">
      <p>…</p>
      <p>…</p>
    </div>
  </div>
</section>
```

`--ak-flow-space` defaults to `1em`, resolved on each child, so the gap scales with the
text it follows. Spacing utilities override both rhythm classes: `ak-pt-0` on the first
section, or `ak-mt-xl` on a single `ak-flow` child.

## `ak-cq` side effects

`ak-cq` sets `container-type: inline-size`. Per the CSS specification, that applies
style and inline-size containment and makes the element an independent formatting
context. Three consequences are worth knowing:

- **It cannot shrink to fit its content.** With inline-size containment the element's
  width ignores its children. On an `ak-inline-block`, a float, or a flex item sized by
  its content, `ak-cq` collapses the element to the width of its padding. Put `ak-cq`
  on an element whose width comes from its parent — a block, a column, a flex item
  with `ak-flex-1`.
- **Child margins stay inside it.** The new formatting context stops the first and
  last child's block margins collapsing through the container. Because the reset keeps
  the UA's block-end margins, the space under the last paragraph of an `ak-cq` box
  stays inside that box. Use `ak-flow` on the box, or `ak-mb-0` on the last child, when
  that matters.
- **Nested `ak-cq` elements shadow each other.** `-c-*` variants always query the
  nearest `ak-cq` ancestor; there is no way to query one further out.

**`ak-fixed` and `ak-absolute` are not affected.** Early container-query drafts also
applied layout containment, which made the container the containing block for
fixed- and absolute-positioned descendants. The current specification does not, and
current Chrome, Safari and Firefox position an `ak-fixed` element inside `ak-cq`
against the viewport. Browsers at the support floor have not been verified yet; the
playground's containment page is a live test for any browser. If a fixed element is
pinned to its container there, move it outside the `ak-cq`.

## Class reference

The full generated class list lives in
[`api/classes.txt`](api/classes.txt), regenerated from the built CSS and
asserted by `npm test`. The authoritative contract for what is generated is
[`mvp-plan/15-class-api-matrix.md`](mvp-plan/15-class-api-matrix.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Commits follow
[Conventional Commits](https://www.conventionalcommits.org/); because PRs into
`dev` are squash-merged, the **PR title** is the released commit message and is
the enforced gate.

## License

[MIT](LICENSE) © Kristian Simeonov
