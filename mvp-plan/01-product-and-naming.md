# Product & Naming

## Product

**AniK UI** is the project/brand name.

The MVP is a tiny, framework-agnostic layout and utility system. The name intentionally
does not contain `grid`, because the project can grow beyond grid/layout.

## CSS prefix

```text
ak-
```

The prefix is fixed and not configurable. A configurable prefix would make the
generated class list — and therefore the API snapshot test — unstable.

## Class grammar

```text
ak-<property-token>[-<breakpoint-token>]-<value>
```

The breakpoint token, when present, always precedes the value; parse right-to-left.
The complete enumerated list of property tokens and generated classes lives in
[`15-class-api-matrix.md`](15-class-api-matrix.md), which is the authoritative contract.

Examples:

```text
ak-row       ak-page      ak-cq
ak-col-6     ak-col-md-4  ak-col-c-lg-3
ak-flex      ak-dir-md-column
ak-gap-md    ak-pt-lg     ak-me-auto
```

## Naming rules

- predictable, enumerated patterns
- short enough for everyday HTML use — side and axis fold into the property token
  (`ak-pt-md`, not `ak-p-t-md`)
- explicit prefix on every class
- consistent modifier ordering
- no generic global names such as `.grid`, `.container`, `.flex`
- logical direction words (`s`/`e`, `start`/`end`) rather than physical (`l`/`r`,
  `left`/`right`) — see D-020
- public class names are API

### Reserved meanings

Two words are load-bearing and must not be reused for anything else:

- **`row`** = the 12-column grid primitive (D-003). Flex direction therefore uses
  `ak-dir-row`, not `ak-flex-row` (D-021).
- **`container`** = a **query** container. The page-width wrapper is `ak-page`, never
  `ak-container` (D-022).

## npm package name

**Unverified — the one remaining external blocker.** Registry access is required to
settle it, and it blocks Phase 1 because a rename after publishing is disruptive.

Decision rule, to be applied once the registry can be reached:

1. Check `anik-ui`. If free, take it.
2. If taken, publish scoped: `@<npm-org>/anik-ui`, where the org is one the maintainer
   owns. A scoped package needs `--access public` on first publish.
3. Either way, **reserve the name before Phase 1 work begins** by publishing a
   placeholder `0.0.1`, so the branding and the `ak-` prefix are not invalidated later.
4. Check for confusingly similar existing packages while there, and do a quick
   trademark sanity check on "AniK".

Recorded as D-018. The decision rule is settled; only the lookup is outstanding.

## Deprecation policy

Because class names are API, retiring one has a defined process:

1. The replacement ships first; both work.
2. The old class is marked deprecated in `CHANGELOG.md`, the README, and a comment in
   the source.
3. It remains for at least one minor release.
4. Removal happens only in a major release, called out as a `BREAKING CHANGE:` footer.

While the package is `0.x`, class names may still move; see
[`12-ci-release-and-commits.md`](12-ci-release-and-commits.md).
