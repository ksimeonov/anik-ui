# Flex API

Flexbox utilities are a core MVP feature: the smallest set that covers real horizontal
and vertical layout work, not a mapping of the whole Flexbox specification.

## Display

Display utilities are shared with the visibility system and are listed in
[`06-typography-position-visibility.md`](06-typography-position-visibility.md):

```text
ak-flex
ak-inline-flex
```

Both take viewport and container variants (`ak-flex-md`, `ak-inline-flex-c-lg`).

## Direction

```text
ak-dir-row
ak-dir-column
```

Responsive and container variants:

```text
ak-dir-md-column
ak-dir-c-md-row
```

### Why `ak-dir-*` and not `ak-flex-row`

With the breakpoint in the middle of the class name, `ak-flex-*` would carry two
different meanings that read almost identically: `ak-flex-md` (display flex from `md`)
versus `ak-flex-md-row` (direction row from `md`). The grammar parses both correctly,
but a reader scanning HTML should not have to. `ak-dir-*` removes the collision and is
shorter. Recorded as D-021.

## Cross-axis alignment

```text
ak-items-start
ak-items-center
ak-items-end
ak-items-stretch
ak-items-baseline
```

`baseline` is included because aligning a label against differently-sized text is a
genuine recurring need that has no one-class alternative.

## Main-axis alignment

```text
ak-justify-start
ak-justify-center
ak-justify-end
ak-justify-between
```

`space-around` / `space-evenly` remain excluded until a real need appears.

## Per-item alignment

```text
ak-self-auto
ak-self-start
ak-self-center
ak-self-end
ak-self-stretch
```

## Sizing

```text
ak-flex-1       flex: 1 1 0%
ak-flex-auto    flex: 1 1 auto
ak-flex-none    flex: 0 0 auto

ak-grow         flex-grow: 1
ak-grow-0       flex-grow: 0
ak-shrink       flex-shrink: 1
ak-shrink-0     flex-shrink: 0
```

These are not optional extras. Without a grow utility the single most common flex
composition — a fixed sidebar next to a region that fills the remaining space — cannot
be expressed at all, and every consumer writes custom CSS on day one.

`ak-flex-1` uses `flex-basis: 0%`, which makes siblings equal-width regardless of
content; `ak-flex-auto` keeps content-based basis. Both are needed and the difference
is documented in the README.

## Wrapping

```text
ak-flex-wrap
ak-flex-nowrap
```

## Alignment utilities are display-agnostic

`ak-items-*`, `ak-justify-*` and `ak-self-*` are box-alignment properties and apply to
`ak-row` as well as `ak-flex`. They are documented here only because flex is where they
are used most. See [`04-row-and-columns.md`](04-row-and-columns.md) for the one caveat:
`ak-justify-*` has no visible effect on a default `ak-row`, whose twelve `1fr` tracks
leave no free space to distribute.

## Gap

Use the shared spacing utilities — `ak-gap-md`, `ak-gap-x-lg`, `ak-gap-y-sm`. There are
no flex-specific gap classes.

## Target compositions

The MVP must make these easy, and the playground must demonstrate each:

```text
horizontal alignment
vertical alignment
centred content
space-between bar
fixed sidebar + filling main region
stacking
responsive row/column changes
```
