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

Total generated classes: **416** (396 at MVP definition, plus the ten sizing utilities
added by D-039 and the ten display-type / tracking / prose classes added by D-043),
enumerated in `15-class-api-matrix.md` and asserted in CI.

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

_Amended by D-044: squash-only now applies to PRs into `dev`; `dev` → `main` release
PRs use a merge commit._

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

### D-038 — Repository host: GitHub

**Decided 2026-09-21: move to GitHub** (`https://github.com/ksimeonov/anik-ui`). The GitLab
project is to be archived, not deleted. Chosen before any npm publish, so no released package
metadata points at the old host. The specs, `.github/` templates, Actions release
pipeline, Pages deploy and npm trusted publishing via GitHub OIDC all apply as written.

The analysis at the time of the decision, kept for the record:

The specs assume GitHub throughout — `.github/` templates, GitHub Actions release
pipeline, GitHub Pages playground deploy, npm trusted publishing via GitHub OIDC
(`id-token: write`). The `origin` remote was then **GitLab**
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

### D-043 — Fluid display type, tracking, and prose/rhythm primitives
Ten new classes, no breakpoint variants. Total API 406 → **416**.

```text
ak-text-3xl  ak-text-4xl  ak-text-5xl  ak-text-6xl
ak-tracking-tight  ak-tracking-normal  ak-tracking-wide
ak-measure  ak-flow  ak-section
```

Upstreamed from a consumer site, where they were written as local candidates. Non-breaking:
`xs`–`2xl` are unchanged.

**Display sizes are fluid `clamp()` tokens** — responsive type without breakpoint
variants, consistent with D-024. The candidate values had `3xl` at a 28px floor, *below*
the fixed 32px `2xl`, so the scale inverted on every viewport under ~800px. The shipped
values all share a `2rem` intercept and grow only in vw slope, floor and ceiling
(36→40, 40→48, 44→60, 48→72px), which makes an inversion impossible at any width; a test
sweeps 280–2560px to keep it that way. The rem intercept keeps them zoom-responsive.

**`ak-flow` and `ak-section` are emitted with the base classes, not the utilities.** At
equal (0,1,0) specificity the later rule wins, so placing them before the spacing
utilities means `ak-pt-0` on the first section or `ak-mt-xl` on one flow child still
works. `ak-flow` zeroes children's block margins first so the UA block-end margins the
reset now keeps (D-042) do not stack on top of the flow space.

**Box-sizing:** `ak-section` pads, so it joins the D-025 list (79 → 80). `ak-measure`
does not: a measure is a character count, and padding should add to it rather than eat
into it.

### D-044 — `dev` → `main` release PRs use a merge commit
Amends D-033. Work still lands on `dev` as one conventional commit per change (squash
merge for PRs into `dev`). The release PR from `dev` into `main` is a **merge commit**,
and `main` accepts nothing else.

Squashing the release PR collapsed every change since the last release into one commit,
so `semantic-release` read a single title: one changelog entry per release, and that one
title alone chose the bump. It also left `main` with a commit `dev` never had, so `dev`
diverged after every release. A merge commit keeps each conventional commit from `dev`
reachable from `main`, which is what the commit analyzer and changelog need, and `dev`
stays an ancestor of `main`.

Consequences:
- `main` history is no longer linear; the `required_linear_history` rule is dropped.
- The merge commit's title is the PR title (repo setting), so the release PR still needs
  a conventional title; use a no-release type such as `chore(release): …` so the merge
  commit itself does not add a changelog entry.
- The gate that matters for versioning moves to the commits on `dev`: PR titles for
  squash-merged PRs into `dev`, and the local `husky` + `commitlint` hook for direct
  commits to `dev`.
- GitHub enforces `merge` only on `main` (ruleset). Squash-only on `dev` is convention
  until `dev` gets its own ruleset — the repo allows both methods.

### D-045 — The release bot pushes to `main` with an environment-scoped deploy key
`@semantic-release/git` commits the version bump and `CHANGELOG.md` straight to `main`,
which the `main` ruleset otherwise rejects (PR required, checks required).

The bot pushes over SSH with a **write deploy key**, and `DeployKey` is the ruleset's only
bypass actor. The private key is the `RELEASE_DEPLOY_KEY` secret of the **`release`
environment**, whose deployments are limited to `main`, so only a workflow already
running on `main` — which got there through a checked PR — can read it. semantic-release
tries the configured `repositoryUrl` (SSH) before any token URL, so the key is what it
pushes with.

Rejected: bypassing for the GitHub Actions app, because every workflow's `GITHUB_TOKEN`
would then be able to push to `main`; a personal access token, because it acts as the
maintainer across every repository and expires; dropping `@semantic-release/git`,
because spec 12 keeps `CHANGELOG.md` in the repository and in the tarball.

The release commit carries `[skip ci]`, so it does not trigger another release run.
After releasing, the same job merges `main` back into `dev`, keeping D-044's "dev is a
descendant of main" true. `HUSKY=0` in the job keeps the local hooks from running on the
bot's commits.

### D-046 — `ak-cq` applies no layout containment; the `ak-fixed` caveat is withdrawn
> **Amended by D-048.** True of current browsers only; the support-floor versions still
> apply layout containment, so the caveat is restored as a version-dependent one.

Spec 02 and the README said `container-type: inline-size` applies layout containment,
so `ak-fixed` / `ak-absolute` inside `ak-cq` would be positioned against the container.
That followed early container-query drafts. The current specification (CSS Conditional
5) applies only **style and inline-size containment** plus an **independent formatting
context**.

Measured 2026-09-22 in Chromium 151, WebKit 26.5 and Firefox 153 (table in spec 02): a
fixed element inside `ak-cq` stays on the viewport and an absolute one uses the outer
positioned ancestor, while a `contain: layout` control on the same markup captures the
fixed element — so the test is sound. The shrink-to-fit collapse still reproduces, and
a previously undocumented effect does too: child margins no longer collapse through the
container, which matters because the reset keeps block-end margins (D-042).

The README section becomes "`ak-cq` side effects": shrink-to-fit, margin collapsing,
nesting, plus a note that positioned descendants are unaffected in current engines. The
support-floor versions (D-027) are unverified; `playground/containment.html` is the
live test, and the README tells consumers what to do if a floor browser does capture.

### D-047 — No `engines` field; source maps for every built stylesheet
**`engines` removed.** It applied to every consumer: npm warns (`EBADENGINE`) on a
Node outside the range and fails the install under `engine-strict`. A CSS-only package
has no runtime Node requirement to state. The Node range the *repository* needs — set
by the release tooling, `^22.22.2 || >=24.15.0` — moves to `devEngines.runtime`
(`onFail: error`), which npm enforces only when working in this repo: verified with
npm 10.9.8 that a dependency declaring an unsatisfiable `devEngines` installs silently,
while one declaring the same `engines` warns, and errors under `--engine-strict`. CI
reads the pinned LTS from `.nvmrc` through `node-version-file`, one place instead of
three workflow files. Supersedes the "`engines` set to the Node LTS used in CI" line of
spec 08 and the Node bullet of spec 12.

**Minified source maps restored.** D-036 promises maps for both entrypoints, but the
switch to lightningcss dropped them for the `.min.css` files. `build:min` now passes
`--sourcemap` and runs from `dist/`, because lightningcss writes the map URL and
sources relative to its working directory. Each minified map points at the expanded
CSS, which maps on to the Sass. `test/source-maps.test.mjs` asserts every stylesheet's
map and its sources resolve, so this cannot regress silently again. Cost: two files
and about 5.6 kB compressed in the tarball.

### D-048 — Positioned descendants of `ak-cq` are version-dependent; keep `ak-fixed` out
Amends D-046. Run at the support floor (D-027) with old Playwright builds — Chromium
111.0.5563, Firefox 113.0 and WebKit 16.4 — `container-type: inline-size` still applies
layout containment: an `ak-fixed` **and** an `ak-absolute` descendant are both
positioned against the `ak-cq` box, matching the original container-query
specification. Chromium 151, Firefox 153 and WebKit 26.5 follow the revised
specification and do not. A `contain: layout` control captured in every version, so
the measurements are sound. Shrink-to-fit collapse and child margins kept inside the
container behave the same in both generations.

The earlier absolute-position measurement in D-046 used a probe whose container margin
collapsed through its positioned parent, which made both outcomes look identical; it
was repeated with the collapse prevented, and the current-browser result held.

Decision: document the difference instead of picking a side, and give the portable
rule — keep `ak-fixed` outside every `ak-cq`; anchor `ak-absolute` children to an
`ak-relative` element inside the `ak-cq`. The versions in which each engine switched
are not pinned down; that would need a bisection across builds and does not change the
advice.

Same run, other Phase 3 gates: the whole playground behaves identically at the floor
and in current engines (overflow, visibility ranges, 1 → 2 → 4 cards, container
thresholds, container-over-viewport precedence, `ak-min-w-0`). Below the floor —
Chromium 104 and Firefox 102, before container queries — `@container` blocks are ignored,
container layouts stay at the default single column, viewport variants still apply,
and nothing overflows or throws: the documented degradation holds.

### D-049 — Keep the `ak-` prefix despite `@yunyoujun/ak-ui`
The similar-package scan (D-018 step 4, 2026-09-22) found `@yunyoujun/ak-ui`, first
published 2026-09-19 as "framework-agnostic CSS primitives", using `.ak-` classes and
`--ak-` custom properties too. No names are identical: 0 of its 271 classes and 0 of
its 151 custom properties match ours, so both can load on one page today. Nothing stops
a future clash, and shared `:root` tokens would silently override each other.

Decided by the maintainer: **keep `ak-`.** It is short, established across the spec
and tests, and renaming 416 classes and every token to avoid a hypothetical clash with
a three-day-old package is not worth it. Adding a class or token now carries one more
check: that the name is not already used by `@yunyoujun/ak-ui`. Other near names on npm
(`anik`, `akui`, `ak-vue3`, …) are unrelated or abandoned.

## Unresolved

- [ ] **"AniK" trademark sanity check** — D-018 rule step 4, maintainer judgment.
Resolved since: the npm name is reserved (`anik-ui@0.0.1`, 2026-09-22); the `ak-`
prefix overlap is accepted (D-049).

All other previously-unresolved items are now decided:
`~~exact numeric spacing token values~~` (D-019 — numeric scale rejected),
`~~exact semantic size values~~` (D-019),
`~~exact column/gap implementation details~~` (D-024, `04-row-and-columns.md`),
`~~exact Flex class matrix~~` (D-021, D-029, `15-class-api-matrix.md`),
`~~exact reset rules~~` (D-025, D-026, `07-reset-and-global-css.md`),
`~~exact package exports~~` (D-036, `08-build-and-package.md`),
`~~exact release tool/configuration~~` (D-032, D-033, `12-ci-release-and-commits.md`),
`~~repository host~~` (D-038 — GitHub).
