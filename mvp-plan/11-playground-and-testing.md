# Playground & Testing

## Playground

Plain HTML/CSS, with JavaScript only where a demo genuinely needs it. Do not introduce
Angular Material or any component framework to make the playground look professional.

Use ordinary elements — `a`, `button`, `table`, `ul`, `aside`, `section`, `article`,
`div` — with a small `demo.css` for presentation. `demo.css` must not be published.

The playground is deployed to GitHub Pages from CI on `main`, so the README can link a
live demo.

### Must demonstrate

- row/columns, including **nested rows** and **more than 12 columns of children**
- responsive layout
- container queries, including **`ak-cq` and `ak-row` on the same element**
- a live test of `ak-fixed` inside `ak-cq` (D-046), with a `contain: layout` control
- spacing and the `--ak-row-gap` responsive-spacing escape hatch
- flex, including **fixed sidebar + filling main region** (`ak-flex-1`)
- alignment
- typography
- positioning
- visibility, including hide-at-one-size / restore-at-another
- `ak-sr-only`
- reset on vs. off, side by side

## Testing

Priority order for MVP validation:

1. correct CSS generation
2. responsive behaviour
3. packaged artifact integrity
4. practical use in consumer projects

Runner: `node --test`. Tests read the built CSS from `dist/` and assert against it — no
browser automation, no PostCSS dependency.

### 1. API snapshot — the contract test

```text
scripts/extract-api.mjs   → sorted unique .ak-* selectors from dist/anik-ui.css
api/classes.txt           → checked into git
npm run test:api          → regenerate, diff against the committed file, fail on drift
```

This is the most important test in the project. The strongest stated principle is that
public class names are API; until now nothing enforced it. A diff in `api/classes.txt`
turns any accidental rename, addition, or removal into a failing check and a visible
line in code review. The file doubles as the generated API reference for the README.

The class count in [`15-class-api-matrix.md`](15-class-api-matrix.md) is asserted
against the same extraction.

### 2. Declaration tests

Targeted assertions on rules whose exact form is load-bearing:

- `.ak-row` uses `repeat(12, minmax(0, 1fr))`, not `repeat(12, 1fr)`
- `.ak-row > *` sets `min-width: 0`
- `.ak-row` gap default resolves to `0`
- every padding utility and layout primitive appears in the `box-sizing` selector list
- `.ak-cq` sets `container-type: inline-size`
- no `!important` outside the reset's `prefers-reduced-motion` block
- the reset sets no `color`, `background`, `font-family`, or `outline`

### 3. Emission-order test

Parse the built CSS and assert:

- `@media (min-width: …)` blocks appear in ascending order
- all `@container` blocks appear after all `@media` blocks

Mobile-first behaviour and container-over-viewport precedence are both consequences of
source order, so they are testable without a browser.

### 4. Size budget

```text
dist/anik-ui.min.css     ≤ 25 KB gzipped
dist/anik-reset.min.css  ≤  2 KB gzipped
```

Fail CI over budget. A framework whose selling point is "tiny" needs a number, not an
adjective.

### 5. Packaging test

`npm pack --dry-run` in CI, asserting that the tarball contains `dist/`, `src/scss/`,
`README.md`, `LICENSE`, `CHANGELOG.md` and nothing else.

### 6. Manual browser checklist

Explicitly manual for MVP, run against the deployed playground before a release:
latest Chrome, Firefox and Safari, plus one iOS Safari at the support floor. Checklist
lives in `docs/browser-checklist.md`. Visual regression testing is post-MVP.
