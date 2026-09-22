# Spacing & Tokens

## Principle

CSS custom properties are the runtime token layer (D-010). Utilities reference tokens;
they never hard-code literal values.

```css
:root {
  --ak-space-0:   0;
  --ak-space-2xs: 0.125rem;  /*  2px */
  --ak-space-xs:  0.25rem;   /*  4px */
  --ak-space-sm:  0.5rem;    /*  8px */
  --ak-space-md:  1rem;      /* 16px */
  --ak-space-lg:  1.5rem;    /* 24px */
  --ak-space-xl:  2rem;      /* 32px */
  --ak-space-2xl: 3rem;      /* 48px */
  --ak-space-3xl: 4rem;      /* 64px */
}

.ak-p-md { padding: var(--ak-space-md); }
```

Because every utility reads a custom property, a consumer can retheme the whole scale
without rebuilding the Sass.

## One scale, one set of names

The scale is **semantic only**. There is no parallel numeric scale.

```text
0  2xs  xs  sm  md  lg  xl  2xl  3xl
```

Margin utilities additionally accept `auto`.

An earlier draft allowed both `ak-p-md` and `ak-p-t-4`. That is rejected: with
`md == 4 == 1rem`, two class names would compile to the same declaration, doubling both
the stylesheet and the public API for no expressive gain — the exact "unbounded utility
generation" the spec forbids. The nine-step semantic scale covers the granularity the
numeric scale was wanted for. Recorded as D-019.

## Class names

Side and axis are folded into the property token; there is no separate segment for
them. `ak-pt-md`, not `ak-p-t-md` — the most-typed classes in the library should be
short, per the naming principles in
[`01-product-and-naming.md`](01-product-and-naming.md).

| Token | Property |
|---|---|
| `ak-p-*`  | `padding` |
| `ak-px-*` | `padding-inline` |
| `ak-py-*` | `padding-block` |
| `ak-pt-*` | `padding-block-start` |
| `ak-pb-*` | `padding-block-end` |
| `ak-ps-*` | `padding-inline-start` |
| `ak-pe-*` | `padding-inline-end` |
| `ak-m-*`  | `margin` |
| `ak-mx-*` | `margin-inline` |
| `ak-my-*` | `margin-block` |
| `ak-mt-*` | `margin-block-start` |
| `ak-mb-*` | `margin-block-end` |
| `ak-ms-*` | `margin-inline-start` |
| `ak-me-*` | `margin-inline-end` |
| `ak-gap-*`   | `gap` |
| `ak-gap-x-*` | `column-gap` |
| `ak-gap-y-*` | `row-gap` |

Examples:

```text
ak-p-md   ak-px-lg   ak-pt-sm   ak-ps-xs
ak-m-0    ak-my-xl   ak-mb-2xs  ak-me-auto
ak-gap-md ak-gap-x-lg ak-gap-y-sm
```

`ak-gap-*` applies to both `ak-row` and `ak-flex` — `gap` is a shared box-alignment
property, not a grid-only one.

## Logical properties, not physical

`s` and `e` mean **inline-start** and **inline-end**, so they follow writing direction
and are correct in RTL without a separate stylesheet. `t` and `b` map to
`block-start` / `block-end`, which equal top/bottom in the horizontal writing mode
essentially all consumers use.

This is a deliberate, recorded choice (D-020) rather than a default. Physical `l`/`r`
names would have made RTL support a breaking rename later, and class names are API.
The familiar `t`/`b` spelling is kept for the block axis because vertical writing modes
are rare enough that the abstraction would cost more in readability than it returns.

## Responsive spacing

Spacing utilities have **no breakpoint variants**. The supported pattern for spacing
that changes across sizes is the token layer:

```css
.card-grid { --ak-row-gap: var(--ak-space-sm); }
@media (min-width: 768px) { .card-grid { --ak-row-gap: var(--ak-space-xl); } }
```

Rationale and counts: [`15-class-api-matrix.md`](15-class-api-matrix.md).

## box-sizing

Every padding utility and every layout primitive sets `box-sizing: border-box` itself,
via one shared selector list emitted at the top of the stylesheet. The utilities are
therefore correct whether or not the optional reset is imported. See
[`07-reset-and-global-css.md`](07-reset-and-global-css.md) for why this is not left to
the reset.

## Bound on generation

160 spacing classes total, enumerated in
[`15-class-api-matrix.md`](15-class-api-matrix.md) and asserted in CI. Only
combinations listed there are generated.
