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

Total generated classes: **396**, enumerated in `15-class-api-matrix.md` and asserted
in CI.

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
