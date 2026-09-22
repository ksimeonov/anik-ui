# Responsive System

## Viewport breakpoints

Mobile-first. Default styles apply below `sm`; variants apply at `min-width`.

```text
sm = 576px
md = 768px
lg = 992px
xl = 1200px
```

```html
<div class="ak-col-12 ak-col-md-6 ak-col-lg-4">
```

12 columns by default, 6 from `md`, 4 from `lg`.

## Container query breakpoints

Container-responsive utilities are required because a component often needs to respond
to its parent's width rather than the viewport's.

```text
c-sm = 320px
c-md = 480px
c-lg = 640px
c-xl = 800px
```

**Container thresholds deliberately do not reuse the viewport values.** Containers are
usually far narrower than the viewport — a card in a sidebar is 300–400px wide — so a
`c-lg` set at 992px would essentially never match, and the system would ship 48 column
classes that do nothing. The names are shared with the viewport scale because they
describe relative size, not absolute pixels; the values are independent.

## Naming convention

```text
ak-cq                  establishes a query container
ak-col-c-md-6          6 columns once the container is ≥ 480px
ak-dir-c-md-row        flex direction row once the container is ≥ 480px
```

`c` immediately before the breakpoint marks a container-query variant. The breakpoint
token always precedes the value; see the grammar in
[`15-class-api-matrix.md`](15-class-api-matrix.md).

```html
<div class="ak-cq">
  <div class="ak-row">
    <div class="ak-col-12 ak-col-c-md-6"></div>
  </div>
</div>
```

## Implementation

```css
.ak-cq { container-type: inline-size; }
```

## Containment side effects — read before using `ak-cq`

`container-type: inline-size` applies **style and inline-size containment** and
establishes an **independent formatting context** (CSS Conditional 5, `container-type`).
It does **not** apply layout containment — but browsers at the support floor still do,
following the original specification (D-048). Four consequences are real and must be
documented in the README, because the MVP ships utilities that collide with each of
them:

1. **An `ak-cq` element can no longer be sized by its contents in the inline axis.**
   Do not put `ak-cq` on something that is meant to shrink-to-fit — an inline-block, a
   float, or a `width: auto` flex item that should size to its content. It will
   collapse to its padding. Put it on an element whose width comes from its own parent.
2. **Child block margins do not collapse through an `ak-cq` element.** The independent
   formatting context keeps the first and last child's margins inside the container.
   Since the reset keeps UA block-end margins (D-042), the last paragraph's margin adds
   space inside an `ak-cq` box. `ak-flow` or `ak-mb-0` on the last child removes it.
3. **`@container` resolves against the nearest ancestor container.** Nested `ak-cq`
   shadows the outer one. Named containers are not part of MVP, so there is no way to
   query past the nearest ancestor. If a component needs that, it is a roadmap item.

**4. Positioned descendants — version-dependent (D-048).** The original
container-query specification applied layout containment too, making the container the
containing block for fixed- **and** absolute-positioned descendants. The revised
specification (CSS Conditional 5) does not. Browsers at the support floor follow the
original; current browsers follow the revision. D-046 briefly withdrew this caveat on
the strength of current browsers alone; the floor measurements below restore it.

Measured 2026-09-22 with Playwright builds (WebKit stands in for Safari):

| Check                                              | Chrome 111 · Firefox 113 · WebKit 16.4 | Chromium 151 · Firefox 153 · WebKit 26.5 |
| -------------------------------------------------- | -------------------------------------- | ---------------------------------------- |
| `ak-fixed` inside `ak-cq`                          | **captured by the `ak-cq` box**        | positioned against the viewport          |
| `ak-absolute` inside `ak-cq`, `ak-relative` above  | **captured by the `ak-cq` box**        | positioned against the outer box         |
| `contain: layout` control, same markup             | captures the fixed element             | captures the fixed element               |
| `ak-cq ak-inline-block` with text                  | collapses to its padding (8px)         | collapses to its padding (8px)           |
| `ak-cq` parent, child with 40px block margins      | margins kept inside                    | margins kept inside                      |

Portable rule, documented in the README: keep `ak-fixed` outside every `ak-cq`, and
anchor `ak-absolute` children to an `ak-relative` element inside the `ak-cq`. The
version where each engine switched is not pinned down. `playground/containment.html`
is the live test.

**`ak-cq` and `ak-row` on the same element is supported** and must be covered by the
playground and the browser checklist — it is the common "grid that responds to its own
width" case.

## Fallback behaviour

Browsers below the support floor ignore `@container` entirely and keep the default
(smallest) layout. Viewport variants still apply. See
[`16-cascade-and-browser-support.md`](16-cascade-and-browser-support.md).

## Precedence

Container variants beat viewport variants at equal specificity, because `@container`
blocks are emitted after all `@media` blocks. The full emission order is specified in
[`16-cascade-and-browser-support.md`](16-cascade-and-browser-support.md) and asserted
in CI.
