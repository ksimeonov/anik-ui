# Row & Columns API

## Core decision

Use CSS Grid internally, but call the public layout primitive `row`.

Do not expose `grid` as the primary public class name, and do not generate an
`ak-grid` display utility.

## Core classes

```text
ak-row
ak-col-1 ... ak-col-12
ak-col-auto
ak-page
```

## Exact implementation

```css
.ak-row {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--ak-row-gap, 0);
}

.ak-row > * {
  min-width: 0;
}

.ak-col-6 { grid-column: span 6 / span 6; }
.ak-col-auto { grid-column: auto; }
```

Three details here are load-bearing and must not be "simplified" away:

1. **`minmax(0, 1fr)`, not `1fr`.** `1fr` is shorthand for `minmax(auto, 1fr)`, whose
   automatic minimum is the track's min-content size. With plain `1fr`, a long
   unbroken string, a `<pre>`, or a wide `<table>` expands its track and breaks the
   whole row.
2. **`min-width: 0` on the children.** Fixing the *track* is not enough: a grid item
   also has an automatic minimum size of min-content in the inline axis and will
   overflow its own grid area without this. Both rules are required.
3. **`gap: var(--ak-row-gap, 0)`.** `--ak-row-gap` is declared in the token layer and
   defaults to `--ak-space-md`, so a row is spaced out of the box (D-041). The literal
   `0` in the `var()` is only a safety net for a consumer who unsets the token; use
   `ak-gap-0`, or `--ak-row-gap: 0`, for a deliberately flush grid. Routing gap through
   a custom property is what makes responsive gap possible for consumers without
   shipping responsive gap utilities (see
   [`15-class-api-matrix.md`](15-class-api-matrix.md)).

## Page wrapper

`ak-row` distributes columns; it does not constrain page width. `ak-page` is the
centred wrapper:

```css
.ak-page {
  width: 100%;
  max-width: var(--ak-page-max, 75rem);
  margin-inline: auto;
  padding-inline: var(--ak-page-gutter, var(--ak-space-md));
}
```

It is named `ak-page`, not `ak-container`, because "container" now unambiguously means
a **query container** (`ak-cq`) in this system. Overlapping the two meanings would be a
lasting source of confusion.

## Responsive columns

```text
ak-col-sm-1 ... ak-col-sm-12    ak-col-sm-auto
ak-col-md-1 ... ak-col-md-12    ak-col-md-auto
ak-col-lg-1 ... ak-col-lg-12    ak-col-lg-auto
ak-col-xl-1 ... ak-col-xl-12    ak-col-xl-auto
```

## Container-query columns

```text
ak-col-c-sm-1 ... ak-col-c-sm-12    ak-col-c-sm-auto
ak-col-c-md-1 ... ak-col-c-md-12    ak-col-c-md-auto
ak-col-c-lg-1 ... ak-col-c-lg-12    ak-col-c-lg-auto
ak-col-c-xl-1 ... ak-col-c-xl-12    ak-col-c-xl-auto
```

Example:

```html
<div class="ak-page">
  <div class="ak-row ak-gap-md">
    <section class="ak-col-12 ak-col-md-8"></section>
    <aside class="ak-col-12 ak-col-md-4"></aside>
  </div>
</div>
```

## Defined behaviours

These are specified so the implementation and the tests agree:

- **More than 12 columns of children.** Grid auto-placement wraps them onto a new
  implicit row. No clearing utility is needed. This differs from float/flex grid
  systems and is documented in the README.
- **Nested rows.** An `ak-row` inside a column establishes an independent 12-column
  grid. `subgrid` is not used in MVP.
- **Gap and column width.** Because this is Grid, `gap` is subtracted from the track
  sizes automatically. There is no negative-margin or `calc()` gutter hack anywhere in
  the system.
- **`ak-items-*` on a row.** Valid; maps to `align-items` on the grid container.
- **`ak-justify-*` on a row.** Legal but effectively inert on a default `ak-row`,
  because twelve `1fr` tracks leave no free space to distribute. It is intended for
  flex containers. Documented, not blocked.
- **Alignment utilities are display-agnostic.** They are specified in
  [`05-flex-api.md`](05-flex-api.md) for convenience but apply to `ak-row` as well.

## Out of scope for MVP

Only span-based columns. Do not implement:

- grid start/end and column offsets (use `ak-ms-auto` / `ak-me-auto` to push a column)
- row spans
- named areas
- custom column counts
- `subgrid`
- advanced placement
