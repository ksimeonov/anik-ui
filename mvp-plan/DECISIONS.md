# AniK UI — Decision Log

## Confirmed

### D-001 — Project name
**AniK UI**

Reason: broader than "grid" and suitable for future utility modules.

### D-002 — CSS prefix
**`ak-`**

Reason: short, readable, and consistently identifiable.

### D-003 — Grid primitive name
**`row`**

Reason: preserve familiar layout language while keeping the implementation based on CSS Grid.

### D-004 — Responsive breakpoints
**sm / md / lg / xl**

Values:
- sm 576px
- md 768px
- lg 992px
- xl 1200px

### D-005 — Container queries
Required in MVP.

Convention uses `-c-` before the breakpoint.

> **Amended by D-023.** Container thresholds use their own scale
> (320/480/640/800px), not the viewport values.

### D-006 — Spacing
Semantic `xs / sm / md / lg / xl` plus numeric token utilities where approved.

> **Amended by D-019.** The numeric scale was not approved; the semantic scale was
> extended to `0 2xs xs sm md lg xl 2xl 3xl` (+ `auto` for margin).

### D-007 — Flex
Core MVP feature.

> **Amended by D-021 and D-029.** Direction is `ak-dir-*`; sizing and per-item
> alignment utilities added.

### D-008 — Typography weights
Only `ak-font-bold` initially.

> **Amended by D-031.** `ak-font-normal` added — it undoes inherited boldness, a
> different job from a weight ramp. Sizes ship paired line-heights.

### D-009 — Positioning and visibility
Basic utilities included.

> **Amended by D-030.** Visibility is served by the full display family plus
> `ak-sr-only`; offsets use logical `start`/`end` (D-020).

### D-010 — Runtime tokens
CSS custom properties.

### D-011 — Build
Small Sass-based build.

### D-012 — Quality tooling
Use Stylelint + Prettier.

### D-013 — Registry
Public npm, not company Nexus.

### D-014 — Reset
Explicitly importable, not implicitly enabled.

### D-015 — Playground
Plain HTML/CSS.

### D-016 — License
MIT.

### D-017 — Release model
dev → main, Conventional Commits, automated release on main.

### D-018 — npm package name
Decision **rule** confirmed. **Lookup done 2026-09-07:** `anik-ui` (unscoped) is
**available** on the public registry — `GET https://registry.npmjs.org/anik-ui` → 404
`{"error":"Not found"}`, cross-checked against `react` (200) and `anik` (200). The
scoped fallback is therefore not needed.

Name is **not yet reserved** — reservation requires an authenticated `npm publish` and
this machine is not logged in. A ready-to-publish placeholder package is staged at
`reserve/` (`anik-ui@0.0.1`, `publishConfig.access = public`). The maintainer runs:

```bash
cd reserve && npm login && npm publish
```

Do this before the Phase 4 first release so branding and the `ak-` prefix cannot be
invalidated. Trademark sanity check on "AniK" and a scan for confusingly similar
packages still outstanding (D-018 rule step 4).

Reason: renaming a published package is disruptive, and the prefix decision depends on it.

### D-019 — One spacing scale, semantic only
Scale: `0 2xs xs sm md lg xl 2xl 3xl`, plus `auto` for margin.

Rejected: a parallel numeric scale (`ak-p-t-4`). With `md == 4 == 1rem`, two class names
would compile to the same declaration — double the stylesheet and double the public API
for no expressive gain, which is exactly the unbounded generation the spec forbids.

### D-020 — Logical properties, not physical
`s` / `e` mean inline-start / inline-end; `t` / `b` map to block-start / block-end.
Text alignment is `start` / `center` / `end`. Position offsets are `ak-start-0` /
`ak-end-0`.

Reason: RTL-correct by default. Physical `l` / `r` names would have made RTL support a
breaking rename later, and class names are API. `t` / `b` spelling is retained because
vertical writing modes are rare enough that the abstraction would cost more readability
than it returns.

### D-021 — Flex direction is `ak-dir-*`
`ak-dir-row` / `ak-dir-column`, not `ak-flex-row` / `ak-flex-column`.

Reason: with the breakpoint infixed, `ak-flex-md` (display) and `ak-flex-md-row`
(direction) read almost identically while meaning different things. `ak-dir-*` removes
the collision and is shorter.

### D-022 — Page wrapper is `ak-page`
A centred, token-driven max-width wrapper is in MVP scope.

Named `ak-page`, never `ak-container`, because "container" means a **query** container
in this system. Reason for inclusion: without it every consumer writes `max-width` CSS
on day one.

### D-023 — Container-query thresholds are their own scale
`c-sm 320px`, `c-md 480px`, `c-lg 640px`, `c-xl 800px`.

Reason: containers are far narrower than viewports. Reusing the viewport values would
make `c-lg` / `c-xl` effectively unreachable and ship ~48 no-op classes.

### D-024 — Variant matrix is bounded
Viewport and container variants are generated **only** for columns, flex direction, and
display/visibility. Everything else — spacing, alignment, typography, position — has no
variants. Responsive spacing is served by the `--ak-row-gap` token pattern.

Total generated classes: **406** (396 at MVP definition, plus the ten sizing utilities
added by D-039), enumerated in `15-class-api-matrix.md` and asserted in CI.

### D-025 — `box-sizing` ships in the core stylesheet
Emitted as one generated selector list covering every padding utility and layout
primitive, scoped to `ak-` classes — not left to the optional reset, and not applied to `*`.

Reason: the utilities must behave identically whether or not the optional reset is
imported. Scoping keeps the "no unexpected global styles" promise.

### D-026 — Reset is layered; utilities are not
Reset is wrapped in `@layer ak.reset`; utilities and layout are emitted unlayered.
No `!important` anywhere except the reset's `prefers-reduced-motion` block.

Reason: unlayered beats layered, so consumer CSS wins over the reset for free, while
utilities keep the ability to override component CSS via documented import order.

### D-027 — Browser support floor
Chrome/Edge 111, Firefox 113, Safari 16.4. No PostCSS, no autoprefixer, no browserslist.

Reason: container queries are the binding constraint; everything else used is unprefixed
well below that floor.

### D-028 — Emission order is specified and tested
box-sizing → base → utilities → `@media` ascending → `@container` ascending.

Consequence: mobile-first resolves correctly, and container variants beat viewport
variants at equal breakpoints. Asserted by a test, because both behaviours are pure
source-order effects.

### D-029 — Missing flex primitives added
`ak-flex-1` / `ak-flex-auto` / `ak-flex-none`, `ak-grow(-0)`, `ak-shrink(-0)`,
`ak-self-*`, `ak-items-baseline`.

Reason: "fixed sidebar + filling main region" is the most common flex composition and
was previously inexpressible.

### D-030 — Display family covers responsive visibility
`ak-hidden ak-block ak-inline ak-inline-block ak-flex ak-inline-flex`, all with
variants. `ak-sr-only` added for accessible hiding. `ak-grid` deliberately not generated.

Reason: the open "what display do we restore to?" question is answered by making the
consumer name it explicitly, so no utility ever guesses a component's display value.

### D-031 — Typography sizes ship paired line-heights
Plus `ak-font-normal`, which exists to undo inherited boldness — a different job from a
weight ramp. Medium/semibold stay excluded.

### D-032 — First release is 0.1.0 via a seeded `v0.0.0` tag
`semantic-release` otherwise emits `1.0.0` for a first release. While in `0.x`, a
breaking change promotes to `1.0.0` — the tool default, accepted deliberately as the
moment the class API is declared stable.

### D-033 — Squash merge only; commitlint gates the PR title
Because a squash merge turns the PR title into the commit message, the PR title is what
the release tooling reads. Local `husky` hooks are a convenience, not the gate.

### D-034 — API snapshot test is the contract
`api/classes.txt` is generated from built CSS and committed. CI fails on any drift.

Reason: "public class names are API" was the project's strongest principle and nothing
enforced it. The file doubles as the generated API reference.

### D-035 — Size budget
`anik-ui.min.css` ≤ 25 KB gzipped; `anik-reset.min.css` ≤ 2 KB gzipped. Enforced in CI.

### D-036 — dist/ is built in CI, not committed
npm is the only supported distribution channel; git-URL installs are unsupported.
Minified builds and source maps ship for both entrypoints.

### D-037 — Deprecation policy
Replacement ships first, old class marked deprecated in CHANGELOG/README/source, kept
for at least one minor, removed only in a major with a `BREAKING CHANGE:` footer.

### D-038 — Repository host (OPEN)
The specs assume GitHub throughout — `.github/` templates, GitHub Actions release
pipeline, GitHub Pages playground deploy, npm trusted publishing via GitHub OIDC
(`id-token: write`). The actual `origin` remote is **GitLab**
(`https://gitlab.com/kristian90s/ui.git`).

Phase 1 landed the host-neutral work and wrote the issue/PR templates in `.github/`
form per the written spec. Not yet decided, and **blocking Phase 4**:

- **Option A — move/mirror to GitHub.** `.github/` templates, Actions, Pages and OIDC
  all work as specified; least rework.
- **Option B — stay on GitLab.** Rework needed: templates → `.gitlab/issue_templates/`
  + `.gitlab/merge_request_templates/`; release pipeline → `.gitlab-ci.yml` with
  `semantic-release` + `@semantic-release/gitlab`; playground → GitLab Pages; publishing
  → GitLab CI/CD OIDC to npm, or a granular npm automation token in a protected CI
  variable. D-017's dev→main model and D-033's squash-only + PR/MR-title gate are
  host-independent and unaffected.

Does not block Phases 1–3. Must be resolved before the release workflow is configured.

### D-039 — Sizing utilities added to MVP
Ten new classes, no breakpoint variants. Total API 396 → **406**.

```text
ak-w-full  ak-w-auto  ak-w-fit  ak-max-w-full  ak-min-w-0
ak-h-full  ak-h-auto  ak-h-screen  ak-min-h-screen  ak-min-h-0
```

Reason for inclusion: the library shipped **no** width or height utilities at all, so
"make this full-width" and "make this hero fill the viewport" were inexpressible and
every consumer wrote custom CSS on day one — the same failure mode D-029 cites for flex
sizing. Sizing was never in the `14-future-roadmap.md` deferred table, so this adds a
capability rather than reversing a decision.

Two members earn their place by closing specific traps:

- **`ak-min-h-screen`.** `block-size: 100dvb` *clips* a hero taller than the viewport.
  A minimum is what is almost always wanted, so both ship and the README points at the
  min variant first.
- **`ak-min-w-0`.** `.ak-row > *` gets `min-width: 0` automatically (spec 04), but
  `ak-flex` children deliberately do not — long unbroken content still blows out a flex
  row and there was no class-level fix. Making it opt-in rather than applying
  `.ak-flex > *` avoids silently changing flex behaviour for every consumer.

**Naming: `ak-w-*` / `ak-h-*`, emitting `inline-size` / `block-size`.** Familiar
spelling, logical property underneath — exactly the `ak-pt-md` → `padding-block-start`
precedent, and D-020's reasoning for keeping the `t`/`b` spelling applies verbatim. A
logical class spelling is in any case unavailable: `ak-inline`, `ak-inline-block` and
`ak-inline-flex` are display classes *with breakpoint variants*, so any `ak-inline-*`
sizing token would collide.

**No breakpoint variants**, consistent with D-024. Responsive sizing uses the token
layer, like responsive spacing.

**Included in the generated `box-sizing` list** (69 → 79 selectors). `inline-size: 100%`
plus consumer padding overflows its parent under `content-box`, so the D-025
self-sufficiency argument applies unchanged. Generated from the whole family rather than
hand-picking the definite-size members, so it stays mechanical and cannot drift.

**Rejected: `ak-w-screen`.** `100vw` / `100dvi` includes the scrollbar and causes
horizontal overflow — the classic full-bleed footgun. Recorded in
`14-future-roadmap.md` so it is not re-litigated as a gap.

### D-040 — Full-viewport height is a token defaulting to `100dvb`
```css
:root { --ak-viewport-block: 100dvb; }
.ak-h-screen     { block-size: var(--ak-viewport-block); }
.ak-min-h-screen { min-block-size: var(--ak-viewport-block); }
```

**Logical unit.** `dvb` is the block-axis counterpart of `dvh`, consistent with D-020
and with the reset, which already uses `min-block-size: 100svb`. Support is identical to
the physical units — Chrome/Edge 108+, Firefox 101+, Safari and iOS Safari 15.4+;
Baseline Widely Available since June 2025 — comfortably under the D-027 floor of
Chrome 111 / Firefox 113 / Safari 16.4.

**Dynamic by default.** `dvb` tracks mobile browser chrome showing and hiding, which is
what authors mean when they write `100vh`. The trade-off is real: `dvb` can reflow
mid-scroll on mobile, where `svb` is stable but leaves a gap once the chrome retracts.
Routing it through a token makes that a one-line consumer override
(`--ak-viewport-block: 100svb`) instead of a library-imposed choice, matching the
`--ak-row-gap` / `--ak-page-max` pattern (D-010) rather than shipping two class
variants.

### D-041 — Layout knobs are declared tokens; no `ak-page-fluid`
`--ak-row-gap`, `--ak-page-max` and `--ak-page-gutter` were fallback-only values living
inside `var()` calls in `_base.scss`. They are now declared in `:root` alongside the
rest of the token layer, and `--ak-row-gap` defaults to `--ak-space-md` rather than `0`.

Two reasons. **Discoverability:** an undeclared custom property does not appear in
devtools' computed panel and cannot be found by anyone who has not read the Sass, so it
was documented API in name only. **A bare `ak-row` looked broken:** a zero default meant
the 12-column grid shipped flush, and the first thing every consumer did was add a gap.

A full-width `ak-page-fluid` twin class was considered and rejected. `--ak-page-max: none`
already expresses it, and D-040 settled this exact shape — a token override rather than
two class variants. The API stays at **406** classes.

### D-042 — The reset zeroes block-start margins only
`h1`–`h6`, `p`, `figure`, `blockquote`, `dl`, `dd` get `margin-block-start: 0` and
`margin-inline: 0`, not `margin: 0`.

Removing the block-end margin too is a net-negative trade: it deletes the UA's vertical
rhythm and hands the work back to the consumer, which is the opposite of what a reset is
for. The block-start margin is the one worth removing — it collapses out through a
parent when the element is a first child, which is a real and surprising bug.
`margin-inline: 0` is kept because the UA's 40px indents on `figure` and `dd` are not
rhythm.

Consequence: the reset is no longer fully "flattening". Consumers who want the old
behaviour write `:where(h1,h2,h3,h4,h5,h6,p) { margin-block-end: 0 }` in their own CSS,
which wins over `@layer ak.reset` without a specificity fight (D-026).

## Unresolved

- [ ] **Reserve the npm name** — availability confirmed (D-018, 2026-09-07: `anik-ui`
      is free). Placeholder staged at `reserve/`; needs an authenticated `npm publish`
      by the maintainer. No longer blocks Phase 1; must be done before the Phase 4
      first release.
- [ ] **Repository host** (D-038) — GitHub vs GitLab. Blocks Phase 4 release
      automation only; Phases 1–3 proceed regardless.
- [ ] **"AniK" trademark sanity check + similar-package scan** — D-018 rule step 4,
      still outstanding.

All other previously-unresolved items are now decided:
`~~exact numeric spacing token values~~` (D-019 — numeric scale rejected),
`~~exact semantic size values~~` (D-019),
`~~exact column/gap implementation details~~` (D-024, `04-row-and-columns.md`),
`~~exact Flex class matrix~~` (D-021, D-029, `15-class-api-matrix.md`),
`~~exact reset rules~~` (D-025, D-026, `07-reset-and-global-css.md`),
`~~exact package exports~~` (D-036, `08-build-and-package.md`),
`~~exact release tool/configuration~~` (D-032, D-033, `12-ci-release-and-commits.md`).
