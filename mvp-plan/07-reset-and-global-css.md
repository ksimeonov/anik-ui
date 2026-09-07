# Reset & Global CSS

## Decision

A reset is useful, but it must never be enabled implicitly. It ships as a separate
stylesheet with its own entrypoint:

```text
required:  dist/anik-ui.css     utilities + layout
optional:  dist/anik-reset.css  reset
```

A consumer explicitly imports the reset when they want it. A Sass configuration flag is
not an acceptable substitute, because it would not work for the compiled-CSS consumers
who are the primary audience.

## The utilities must not depend on the reset

This is the rule that makes the optional reset safe.

`box-sizing: border-box` is required for padding utilities and layout primitives to
behave as documented. If it lived only in the reset, the layout system would silently
behave differently depending on whether the consumer imported an optional file — a
correctness bug disguised as a preference.

It is therefore emitted **in the core stylesheet**, scoped to the classes that need it,
as a single rule at the top of the file:

```css
.ak-row, .ak-row > *, .ak-page, .ak-cq, .ak-flex, .ak-inline-flex,
.ak-p-0, .ak-p-2xs, /* … every padding utility … */ {
  box-sizing: border-box;
}
```

Scoping to AniK-owned classes rather than `*` keeps the promise of no unexpected global
styles: nothing changes for elements the consumer has not opted in. The rule is
generated, not hand-maintained, so it cannot drift from the padding matrix.

`*, *::before, *::after { box-sizing: border-box }` still appears in the *reset*, for
consumers who want it applied project-wide. The two are consistent; the core rule
simply guarantees the utilities are self-sufficient without it.

## Exact reset contents

```css
@layer ak.reset {
  *, *::before, *::after { box-sizing: border-box; }

  html { -webkit-text-size-adjust: 100%; tab-size: 4; }

  body { margin: 0; min-block-size: 100svb; line-height: 1.5; }

  h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd { margin: 0; }

  h1, h2, h3, h4, h5, h6, p { overflow-wrap: break-word; }

  ul[role="list"], ol[role="list"] { list-style: none; margin: 0; padding: 0; }

  img, picture, video, canvas, svg { display: block; max-inline-size: 100%; }

  input, button, textarea, select { font: inherit; color: inherit; }

  textarea:not([rows]) { min-block-size: 6em; }

  table { border-collapse: collapse; }

  :target { scroll-margin-block: 5ex; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
```

Two details worth stating explicitly:

- **The reset is wrapped in `@layer ak.reset`.** Unlayered styles beat layered ones, so
  any consumer rule wins over the reset without a specificity fight. This is exactly
  the behaviour a reset should have. The *utilities* are deliberately unlayered — see
  [`16-cascade-and-browser-support.md`](16-cascade-and-browser-support.md).
- **`ul[role="list"]`, not `ul`.** Removing list markers unconditionally also removes
  the list semantics some browsers expose. Requiring the explicit role means the author
  opted in.

## The reset must never

- remove or weaken focus indicators (no `outline: 0`, no `:focus { … }`) — this is the
  most common accessibility regression in CSS resets and is prohibited
- set any colour, including `color`, `background`, or `accent-color`
- set `font-family`
- impose a theme or dark-mode behaviour
- style component elements beyond the normalisation above
- use `!important` outside the `prefers-reduced-motion` block above

The reset is capped at roughly 2 KB gzipped, asserted in CI.
