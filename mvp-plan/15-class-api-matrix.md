# Public Class API Matrix

> **Status: authoritative.** This file, not the individual spec files, defines the
> complete set of class names the MVP generates. The other specs explain *why* and
> *how*; this one is the contract.
>
> Any class not listed here must not be generated. Any class listed here is public
> API under [`13-license-and-repository.md`](13-license-and-repository.md)'s
> deprecation policy.

## Class grammar

Two shapes, because some families take a value and some are the value.

```text
A.  ak-<property-token>-[<breakpoint-token>-]<value>    valued families
B.  ak-<state-token>[-<breakpoint-token>]               valueless families
```

Shape A covers columns, spacing, flex direction, typography, alignment, position:

```text
ak-col-6        ak-col-md-6        ak-col-c-lg-4
ak-dir-row      ak-dir-md-column   ak-dir-c-md-row
ak-pt-lg        ak-gap-x-md        ak-text-center
```

Shape B covers only the display/visibility family, where the class name *is* the
value and there is nothing to append it to:

```text
ak-hidden       ak-hidden-lg       ak-hidden-c-md
ak-flex         ak-flex-md         ak-inline-flex-c-lg
```

Rules:

1. **Property and state tokens are enumerated**, not derived. The tables below are the
   complete list.
2. **In shape A the breakpoint always precedes the value**, so parsing right-to-left
   always finds the value last. In shape B the breakpoint is the final segment.
3. Viewport breakpoint tokens: `sm` `md` `lg` `xl`.
   Container breakpoint tokens: `c-sm` `c-md` `c-lg` `c-xl`.
4. Only the families marked *Variants: yes* below get breakpoint tokens.

### `ak-flex-*` is not ambiguous

`ak-flex-md` (shape B, display flex from `md`) and `ak-flex-1` / `ak-flex-auto` /
`ak-flex-none` / `ak-flex-wrap` / `ak-flex-nowrap` (shape A, separate enumerated
property tokens with no variants) coexist safely: `md`, `lg`, `sm`, `xl` and `c-*` are
breakpoint tokens and are never flex values. This is a closed set, checked by the API
snapshot test rather than left to convention.

### Token-namespace overlap (deliberate)

Spacing values (`sm`, `md`, `lg`, `xl`) and breakpoint names (`sm`, `md`, `lg`, `xl`)
share spelling. This is safe because rule 2 makes parsing unambiguous
(`ak-p-md` = padding `md`; a hypothetical `ak-p-md-lg` would be padding `lg` at
breakpoint `md`). It is called out here so that any future addition of responsive
spacing does not have to rediscover the rule.

## 1. Layout — row and columns

Spec: [`04-row-and-columns.md`](04-row-and-columns.md)

| Class | Variants | Count |
|---|---|---|
| `ak-row` | no | 1 |
| `ak-page` | no | 1 |
| `ak-col-1` … `ak-col-12` | **yes** | 12 + 48 + 48 = 108 |
| `ak-col-auto` | **yes** | 1 + 4 + 4 = 9 |

Variant examples: `ak-col-md-6`, `ak-col-c-lg-4`, `ak-col-c-sm-auto`.

Subtotal: **119**

## 2. Container query container

Spec: [`02-responsive-system.md`](02-responsive-system.md)

| Class | Variants | Count |
|---|---|---|
| `ak-cq` | no | 1 |

Subtotal: **1**

## 3. Display and visibility

Spec: [`06-typography-position-visibility.md`](06-typography-position-visibility.md)

| Class | Variants | Count |
|---|---|---|
| `ak-hidden` | **yes** | 9 |
| `ak-block` | **yes** | 9 |
| `ak-inline` | **yes** | 9 |
| `ak-inline-block` | **yes** | 9 |
| `ak-flex` | **yes** | 9 |
| `ak-inline-flex` | **yes** | 9 |
| `ak-sr-only` | no | 1 |

`ak-grid` is intentionally **not** generated; `ak-row` is the grid primitive
(see D-003).

Subtotal: **55**

## 4. Flex

Spec: [`05-flex-api.md`](05-flex-api.md)

| Class | Variants | Count |
|---|---|---|
| `ak-dir-row` `ak-dir-column` | **yes** | 2 × 9 = 18 |
| `ak-flex-wrap` `ak-flex-nowrap` | no | 2 |
| `ak-flex-1` `ak-flex-auto` `ak-flex-none` | no | 3 |
| `ak-grow` `ak-grow-0` `ak-shrink` `ak-shrink-0` | no | 4 |

Subtotal: **27**

## 5. Alignment (valid on `ak-row` and `ak-flex` alike)

Spec: [`05-flex-api.md`](05-flex-api.md)

| Class | Variants | Count |
|---|---|---|
| `ak-items-start` `-center` `-end` `-stretch` `-baseline` | no | 5 |
| `ak-justify-start` `-center` `-end` `-between` | no | 4 |
| `ak-self-auto` `-start` `-center` `-end` `-stretch` | no | 5 |

Subtotal: **14**

## 6. Spacing

Spec: [`03-spacing-and-tokens.md`](03-spacing-and-tokens.md)

Scale values: `0` `2xs` `xs` `sm` `md` `lg` `xl` `2xl` `3xl` (9 values).
Margin additionally accepts `auto` (10 values).

| Property tokens | Values | Variants | Count |
|---|---|---|---|
| `ak-p` `ak-px` `ak-py` `ak-pt` `ak-pb` `ak-ps` `ak-pe` | 9 | no | 63 |
| `ak-m` `ak-mx` `ak-my` `ak-mt` `ak-mb` `ak-ms` `ak-me` | 10 | no | 70 |
| `ak-gap` `ak-gap-x` `ak-gap-y` | 9 | no | 27 |

`s` / `e` are **inline-start / inline-end** (RTL-aware). `t` / `b` are
block-start / block-end. See D-020.

Subtotal: **160**

## 7. Typography

Spec: [`06-typography-position-visibility.md`](06-typography-position-visibility.md)

| Class | Variants | Count |
|---|---|---|
| `ak-text-xs` `-sm` `-md` `-lg` `-xl` `-2xl` | no | 6 |
| `ak-text-start` `-center` `-end` | no | 3 |
| `ak-font-bold` `ak-font-normal` | no | 2 |

Subtotal: **11**

## 8. Position

Spec: [`06-typography-position-visibility.md`](06-typography-position-visibility.md)

| Class | Variants | Count |
|---|---|---|
| `ak-relative` `ak-absolute` `ak-fixed` `ak-sticky` | no | 4 |
| `ak-top-0` `ak-bottom-0` `ak-start-0` `ak-end-0` `ak-inset-0` | no | 5 |

Subtotal: **9**

## Totals

| Group | Classes |
|---|---|
| Layout | 119 |
| Container | 1 |
| Display/visibility | 55 |
| Flex | 27 |
| Alignment | 14 |
| Spacing | 160 |
| Typography | 11 |
| Position | 9 |
| **Total** | **396** |

This number is asserted in CI (see [`11-playground-and-testing.md`](11-playground-and-testing.md)).
A change to it is a deliberate API change, not an implementation detail.

## Which families get breakpoint variants, and why

**Variants: yes** — families where the *layout shape* changes across sizes and
there is no reasonable CSS-variable workaround:

- columns (`ak-col-*`)
- flex direction (`ak-dir-*`)
- display/visibility (`ak-hidden`, `ak-block`, …) — required so that anything
  hidden at one size can be restored at another

**Variants: no** — everything else. Spacing in particular is excluded: five
breakpoints × 21 property tokens × 9 values would add ~1,800 classes and directly
violate the "avoid unbounded utility generation" rule in
[`03-spacing-and-tokens.md`](03-spacing-and-tokens.md).

### Escape hatch for responsive spacing

Consumers that need spacing to change across breakpoints use the token layer
(D-010) from their own stylesheet:

```css
.card-grid { --ak-row-gap: var(--ak-space-sm); }

@media (min-width: 768px) {
  .card-grid { --ak-row-gap: var(--ak-space-xl); }
}
```

```html
<div class="ak-row card-grid"> … </div>
```

This is a documented, supported pattern, not a workaround.
