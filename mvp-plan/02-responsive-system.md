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

`container-type: inline-size` applies layout, style and inline-size containment. Three
consequences are real and must be documented in the README, because the MVP ships
utilities that collide with each of them:

1. **`ak-fixed` inside an `ak-cq` does not escape to the viewport.** Layout containment
   makes the element a containing block for both absolutely *and* fixed-positioned
   descendants. A fixed-position overlay, modal, or sticky header inside a query
   container will be positioned against the container. This is the single most
   surprising interaction in the system. Put `ak-cq` below such elements, not above.
2. **An `ak-cq` element can no longer be sized by its contents in the inline axis.**
   Do not put `ak-cq` on something that is meant to shrink-to-fit — an inline-block, a
   float, or a `width: auto` flex item that should size to its content. It will
   collapse. Put it on an element whose width comes from its own parent.
3. **`@container` resolves against the nearest ancestor container.** Nested `ak-cq`
   shadows the outer one. Named containers are not part of MVP, so there is no way to
   query past the nearest ancestor. If a component needs that, it is a roadmap item.

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
