# Future Roadmap

## Guiding rule

> If a future project requires custom layout CSS repeatedly, consider turning that pattern into an AniK UI feature.

The library should grow from real recurring needs, not try to reproduce every CSS feature.

## Possible future layout utilities

- advanced container utilities
- aspect ratio
- overflow utilities
- z-index
- grid start/end
- row spans
- additional layout primitives
- more responsive/container variants

## Motion / scroll package

Keep motion and scroll behavior separate from the base package.

Potential future package:

```text
@.../anik-motion
```

It can depend on or complement the base AniK UI package.

Possible capabilities:
- fade
- slide
- scale
- reveal on scroll
- scroll progress
- parallax
- sticky interactions

The base package should stay lightweight and CSS-first.

## Do not compete unnecessarily with mature animation libraries

Libraries such as Motion and GSAP already cover advanced animation/scroll interaction well.

AniK UI should focus on the layout foundation and only add motion features where they provide a clear, cohesive value or developer experience.

## Explicitly deferred from MVP

These were considered during API finalisation and consciously left out. They are
recorded here so they are not re-litigated as "gaps" and not implemented without a
decision:

| Item | Why deferred |
|---|---|
| `ak-truncate`, overflow utilities | Not needed to lay out a page. Reconsidered when sizing shipped (D-039) and deliberately left deferred |
| `ak-w-screen` | `100vw` / `100dvi` includes the scrollbar and causes horizontal overflow; shipping it would be shipping a known bug (D-039) |
| Breakpoint variants on sizing | Would add ~90 classes; the `--ak-viewport-block` and `--ak-row-gap` token pattern covers the real cases (D-024, D-040) |
| z-index scale | Stacking is application policy; a shared scale that mismatches the host app is worse than none |
| aspect-ratio | No recurring need demonstrated yet |
| Responsive spacing utilities | ~1,800 classes; the `--ak-row-gap` token pattern covers it (see `03-spacing-and-tokens.md`) |
| Responsive text alignment | Low frequency; would open the door to variants on every family |
| `justify-around` / `justify-evenly` | Add only when a real need appears |
| `font-medium` / `font-semibold` | Weight ramp deliberately minimal |
| Numeric spacing scale | Rejected as a duplicate of the semantic scale (D-019) |
| Named query containers | Nearest-ancestor resolution is enough for MVP |
| `subgrid` | Nested `ak-row` is sufficient |
| Grid start/end, offsets, row spans | `ak-ms-auto` / `ak-me-auto` cover the common push case |
| `em`-based breakpoints | Would be a breaking change to confirmed D-004 values |
| Visual regression testing | Manual browser checklist for MVP |
| Configurable class prefix | Would destabilise the API snapshot test |
| Dark mode / theming utilities | The token layer already lets consumers retheme |

Anything moved out of this table into MVP scope needs a new entry in `DECISIONS.md`.
