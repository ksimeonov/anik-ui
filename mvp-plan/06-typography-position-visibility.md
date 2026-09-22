# Typography, Positioning, Display & Visibility

## Typography

No global font family. The library never sets `font-family`.

### Sizes

Each size sets `font-size` **and a paired `line-height`**. Shipping a size utility
without line-height is a known trap: the inherited line-height is tuned for body text
and produces cramped large headings and loose small print.

| Class | font-size | line-height |
|---|---|---|
| `ak-text-xs`  | 0.75rem  | 1.5 |
| `ak-text-sm`  | 0.875rem | 1.5 |
| `ak-text-md`  | 1rem     | 1.5 |
| `ak-text-lg`  | 1.25rem  | 1.4 |
| `ak-text-xl`  | 1.5rem   | 1.3 |
| `ak-text-2xl` | 2rem     | 1.2 |

Values come from `--ak-font-size-*` and `--ak-line-height-*` tokens.

### Weight

```text
ak-font-bold
ak-font-normal
```

`ak-font-normal` is included despite the "no extra weights" rule because it serves a
different purpose from a weight ramp: it is the only way to *undo* inherited boldness
inside a heading, `<strong>`, or `<th>`. Medium and semibold remain excluded.

### Alignment

```text
ak-text-start
ak-text-center
ak-text-end
```

Logical values, matching the spacing utilities (D-020). `left` / `right` are not
generated.

## Display and visibility

One family covers both, which is what makes responsive visibility work:

```text
ak-hidden        display: none
ak-block         display: block
ak-inline        display: inline
ak-inline-block  display: inline-block
ak-flex          display: flex
ak-inline-flex   display: inline-flex
```

All six take viewport and container variants.

### Responsive visibility — resolved

The earlier open question was "what display value do we restore to?". The answer is
that we do not guess: the consumer names it.

```html
<!-- hidden below md, block from md -->
<div class="ak-hidden ak-block-md"></div>

<!-- visible below lg, hidden from lg -->
<nav class="ak-flex ak-hidden-lg"></nav>
```

Because the restoring class is explicit, no utility ever has to invent a display value
for a component, which was the original concern about "unexpectedly overriding
component-specific display values". A single-class `ak-hidden` still does exactly one
thing.

`ak-grid` is deliberately absent — `ak-row` is the grid primitive (D-003).

### Accessible hiding

```text
ak-sr-only
```

`ak-hidden` is `display: none`, which removes content from the accessibility tree.
`ak-sr-only` hides content visually while keeping it available to assistive
technology — the standard clip-rect implementation. A layout library without it forces
every consumer to paste the same snippet.

## Position

```text
ak-relative
ak-absolute
ak-fixed
ak-sticky
```

Offsets:

```text
ak-top-0
ak-bottom-0
ak-start-0     inset-inline-start
ak-end-0       inset-inline-end
ak-inset-0
```

Logical offsets, consistent with spacing and text alignment.

### Two documented interactions

- **`ak-fixed` / `ak-absolute` inside `ak-cq` depend on the browser version.** At the
  support floor the `ak-cq` box captures them (layout containment, original spec);
  current browsers do not (D-048). Keep `ak-fixed` outside `ak-cq`. See
  [`02-responsive-system.md`](02-responsive-system.md).
- **No z-index utilities in MVP.** Stacking is application policy, and a shared
  z-index scale that does not match the consuming app is worse than none. Consumers set
  `z-index` in their own CSS. Listed in [`14-future-roadmap.md`](14-future-roadmap.md).

## Deliberately excluded from MVP

`ak-truncate`, overflow utilities, aspect-ratio, and z-index. All are on the roadmap;
none are needed to lay out a page.
