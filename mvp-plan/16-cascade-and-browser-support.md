# Cascade, Specificity & Browser Support

## Browser support floor

"Modern browsers only" is now a concrete, testable statement:

| Browser | Minimum |
|---|---|
| Chrome / Edge | 111 |
| Firefox | 113 |
| Safari / iOS Safari | 16.4 |

Roughly March–May 2023. The floor is set by the newest feature the MVP depends on;
container queries (Chrome 105 / Safari 16 / Firefox 110) are the binding constraint,
and the floor is rounded up so that cascade layers, logical properties, `:focus-visible`
and container query units are all comfortably inside it.

This table belongs in the README.

### Graceful degradation

Below the floor, `@container` blocks are ignored by the parser. Because the system is
mobile-first, an unsupported browser keeps the **default (smallest) layout** rather than
breaking. Viewport `@media` variants still apply. This is the documented behaviour, not
an accident — do not add a JavaScript polyfill.

### No autoprefixer, no PostCSS

Every property used by the MVP is unprefixed at the support floor. The MVP build is
Sass → CSS only, with no PostCSS step and no `browserslist` key. Revisit only if a
future feature actually needs prefixing.

## Cascade layers

```css
@layer ak.reset;   /* reset.css only */
/* utilities and layout are emitted UNLAYERED */
```

**The reset is layered. The utilities are not.** This asymmetry is deliberate:

- Unlayered styles always beat layered styles, regardless of specificity. Putting the
  reset in `@layer ak.reset` means *any* consumer rule beats the reset without a
  specificity fight — exactly what a reset should do.
- Putting the *utilities* in a layer would have the opposite, unwanted effect: every
  consumer component rule would beat `ak-mt-0`, making the utilities useless for their
  main job.

## Specificity and `!important`

Every utility is a single class selector, `(0,1,0)`. The MVP ships **no `!important`**.
`!important` cannot be escaped by consumers and is a recurring complaint against
utility frameworks; source order is the supported mechanism instead.

### Required import order

Documented in the README as a hard requirement:

```text
1. anik-ui reset  (optional)
2. consumer / framework component styles
3. anik-ui utilities
```

A consumer who imports the utilities before their own component CSS will find that
component CSS wins ties. This is expected and documented.

## Emission order inside the stylesheet

The build must emit rules in this exact order. Several behaviours depend on it, and it
is asserted in CI:

```text
1. box-sizing rule for layout + padding utilities
2. base/structural classes   (ak-row, ak-page, ak-cq)
3. unprefixed utilities      (all families, default values)
4. @media (min-width: 576px)   — sm
5. @media (min-width: 768px)   — md
6. @media (min-width: 992px)   — lg
7. @media (min-width: 1200px)  — xl
8. @container (min-width: 320px)  — c-sm
9. @container (min-width: 480px)  — c-md
10. @container (min-width: 640px) — c-lg
11. @container (min-width: 800px) — c-xl
```

Consequences, all intentional:

- **Mobile-first works.** `ak-col-12 ak-col-md-6` resolves to 6 at ≥768px because the
  `md` block comes later in source order at equal specificity.
- **Container variants beat viewport variants at the same breakpoint.** If an element
  carries both `ak-col-md-6` and `ak-col-c-md-4`, the container rule wins because
  `@container` blocks are emitted after all `@media` blocks. An element that is inside
  an `ak-cq` and opts into a container variant is asking to be laid out by its
  container, so the container should be the tiebreaker.

Mixing the two variant kinds on one element is legal but discouraged; the README
recommends picking one axis per component.

## Media query units

Breakpoints use `px` (D-004, confirmed). The known trade-off: `px` media queries do not
respond to the user's browser font-size setting the way `em` queries do. This is
accepted for MVP consistency with the confirmed breakpoint values and recorded here so
the trade-off is not rediscovered later. A move to `em` would be a breaking change and
must go through the deprecation policy.
