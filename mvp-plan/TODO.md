# AniK UI — MVP TODO

Legend:
- `[ ]` not started
- `[~]` in progress
- `[x]` completed
- `[!]` blocked / decision required

## Phase 0 — Product/API decisions

- [x] Product name: AniK UI
- [x] CSS prefix: `ak-`
- [x] Framework-agnostic architecture
- [x] CSS-first / no JS runtime for MVP
- [x] 12-column CSS Grid model
- [x] `row` naming instead of `grid`
- [x] `sm / md / lg / xl` viewport breakpoints
- [x] Container-query support required
- [x] Container-query threshold scale (D-023)
- [x] Spacing scale — semantic only, numeric rejected (D-019)
- [x] Logical vs physical direction naming (D-020)
- [x] Margin and padding utilities required
- [x] Flex API, including sizing and per-item alignment (D-021, D-029)
- [x] Display/visibility family and `ak-sr-only` (D-030)
- [x] Typography sizes with paired line-heights (D-031)
- [x] `ak-page` wrapper (D-022)
- [x] Basic positioning
- [x] CSS custom properties as runtime tokens
- [x] Explicit optional reset, not automatic
- [x] Reset contents finalised (`07-reset-and-global-css.md`)
- [x] `box-sizing` ships in core, not the reset (D-025)
- [x] Cascade/layer and `!important` strategy (D-026)
- [x] Browser support floor (D-027)
- [x] Emission order specified (D-028)
- [x] Variant matrix bounded (D-024)
- [x] Full public class matrix — 396 classes (`15-class-api-matrix.md`); extended to
      406 by D-039 (sizing family) and 416 by D-043 (display type, tracking, prose)
- [x] Deprecation policy (D-037)
- [x] MIT license
- [x] Public npm registry
- [x] Plain HTML/CSS playground
- [x] dev → main release model
- [x] Conventional Commits + enforcement point (D-033)
- [x] Initial version strategy (D-032)
- [x] publish only from main
- [x] automated versioning/release notes/tagging
- [~] **Verify npm package name availability and reserve it** — decision rule in D-018.
      Availability **verified 2026-09-07**: `anik-ui` (unscoped) is free on the public
      registry. Reservation still pending: placeholder staged at `reserve/`, needs an
      authenticated `npm publish` by the maintainer. No longer blocks Phase 1 (per the
      "Prep placeholder + start Phase 1" decision); must be done before the Phase 4
      first release. See updated D-018.

## Phase 1 — Repository bootstrap

- [x] Create repository — git repo exists; `dev` working branch created
- [x] Add package.json per `08-build-and-package.md`
- [x] Add MIT LICENSE
- [x] Add .gitignore (`node_modules/`, `dist/`, `.idea/`, `*.tgz`)
- [x] Commit `package-lock.json` — committed with the bootstrap (`ca41b0b`)
- [x] Add npm packaging configuration (`files`, `exports`, `sideEffects`, `style`, `sass`)
- [x] Add Sass — `sass` dep + `build` / `build:expanded` / `build:min` scripts (source maps)
- [x] Add Stylelint — `stylelint-config-standard-scss` + `ak-` grammar + `declaration-no-important`; reset.scss overridden per spec 07
- [x] Add Prettier — `.prettierrc.json` + `.prettierignore`; `format` / `format:check`
- [x] Add commitlint + husky — `commitlint.config.js`; `.husky/commit-msg` + `.husky/pre-commit`
- [x] Add README (install, import order, browser support, containment caveat)
- [x] Add CONTRIBUTING.md, CODE_OF_CONDUCT.md, issue/PR templates
      — templates written in `.github/` form per spec; confirmed by D-038 (GitHub)
- [x] Add `src/scss/` with `index.scss` and `reset.scss`
      — `reset.scss` complete (spec 07 verbatim + tests); `index.scss` is the
      emission-order skeleton, Phase 2 partials plug in at the marked `@use` lines
- [x] Add `dist/` build output strategy — `dist/` gitignored; `build:min` emits
      minified + source maps for both entrypoints. CI build wiring is Phase 4 / D-038.
- [x] Add playground — `playground/index.html` + `demo.css` scaffold with every
      required-demonstration section stubbed; content filled in Phase 3

## Phase 2 — Core implementation

All 416 classes now compile — 396 at MVP definition, plus the 10 sizing utilities
added by D-039 and the 10 display-type/tracking/prose classes added by D-043. Source is split into `_tokens` → `_box-sizing` →
`_base` → `_utilities` → `_variants`, `@use`d from `index.scss` in that order
(the emission order). Shared generators (`_generators.scss`) back both the
default classes and the variant blocks, so a viewport variant and its container
counterpart are provably identical apart from the at-rule wrapper.

- [x] Tokens (`--ak-space-*`, `--ak-font-size-*`, `--ak-line-height-*`) — `_tokens.scss`
- [x] Generated `box-sizing` selector list — `_box-sizing.scss`, 80 selectors (6 primitives + 63 padding + 10 sizing + `ak-section`)
- [x] `ak-row` (`repeat(12, minmax(0, 1fr))` + `min-width: 0` on children + `gap: var(--ak-row-gap, 0)`)
- [x] `ak-page`
- [x] `ak-cq`
- [x] column utilities + `ak-col-auto`
- [x] viewport-responsive columns — `@media` sm→xl
- [x] container-query columns — `@container` c-sm→c-xl
- [x] gap (`ak-gap`, `ak-gap-x`, `ak-gap-y`)
- [x] margin (7 tokens × 10 values)
- [x] padding (7 tokens × 9 values)
- [x] display/visibility family + variants
- [x] `ak-sr-only`
- [x] flex direction (`ak-dir-*`) + variants
- [x] flex sizing (`ak-flex-1`, `ak-grow`, `ak-shrink`)
- [x] flex wrap
- [x] alignment utilities (`ak-items-*`, `ak-justify-*`, `ak-self-*`) — `start`/`end` values so they work on `ak-row` and `ak-flex` alike
- [x] typography utilities
- [x] positioning utilities
- [x] optional reset (layered) — completed in Phase 1 (`reset.scss`, spec 07 verbatim)
- [x] sizing utilities (D-039) + `--ak-viewport-block` token (D-040) — `ak-w-*`,
      `ak-h-*`, `ak-max-w-full`, `ak-min-w-0`, `ak-min-h-0`, `ak-h-screen`,
      `ak-min-h-screen`; no breakpoint variants, all in the box-sizing list
- [x] Layout knobs declared as `:root` tokens; `--ak-row-gap` defaults to `md` (D-041)
- [x] Reset keeps UA block-end margins, zeroes block-start only (D-042)
- [x] Minification switched to lightningcss with the D-027 browser targets
- [x] Fluid display type `ak-text-3xl`…`6xl`, `ak-tracking-*`, `ak-measure`,
      `ak-flow`, `ak-section` (D-043) — incl. a 280–2560px no-inversion sweep test

Tests (`node --test`, 31 passing): API snapshot (`api/classes.txt`, 416),
declaration tests (spec 11 §2), emission-order test (§3), reset tests, size-budget
test (§4 — `anik-ui.min.css` 3.3 KB gz / 25 KB, `anik-reset.min.css` 0.5 KB gz / 2 KB;
measured 2026-09-21).

## Phase 3 — Validation

Acceptance gates, not activities. Each has a pass condition.

- [x] Build succeeds from clean checkout (`rm -rf node_modules dist && npm ci && npm run build`)
- [x] Stylelint passes with zero warnings
- [x] `prettier --check` passes
- [x] API snapshot test passes and `api/classes.txt` contains exactly **416** classes
- [x] Declaration tests pass (see `11-playground-and-testing.md` §2)
- [x] Emission-order test passes (`@media` ascending, `@container` last)
- [x] Size budget: `anik-ui.min.css` ≤ 25 KB gz, `anik-reset.min.css` ≤ 2 KB gz
- [x] `npm pack --dry-run` contains only `dist/`, `src/scss/`, README, LICENSE, CHANGELOG
      — CHANGELOG absent until the release pipeline generates it; `files` already lists it
- [~] Playground demos built — only the `ak-min-w-0` demo exists; the other sections
      in `playground/index.html` are still heading-only stubs, and D-041/D-043
      additions (display type, tracking, `ak-measure`/`ak-flow`/`ak-section`) have none
- [ ] Playground manually verified against the browser checklist
- [ ] Responsive checks: Chrome, Firefox, Safari, one iOS Safari at the support floor
- [ ] Container-query checks, including `ak-cq` + `ak-row` on the same element
- [ ] Containment caveat verified: `ak-fixed` inside `ak-cq` behaves as documented
- [ ] Degradation check: below-floor browser keeps the default layout, does not break
- [ ] Install local tarball into sample consumer project — Verdaccio tooling is ready
      (`npm run local:registry` / `npm run local:publish`, spec 09), not yet exercised
- [ ] Angular consumer: compiled CSS **and both Sass entrypoint forms** resolve
- [ ] React or Vue consumer, plus plain HTML consumer
- [ ] Import-order check: a utility overrides a component rule in a real consumer app
- [ ] RTL spot check: `dir="rtl"` page lays out correctly with `ak-ps-*` / `ak-ms-*`

## Phase 4 — Release automation

- [x] Decide repository host (D-038) — GitHub, `ksimeonov/anik-ui`; GitLab project archived
- [x] Add Conventional Commits guidance to CONTRIBUTING.md — "Commit convention" section
- [ ] Configure required PR checks (lint, format, build, tests, pack, commitlint on title)
- [x] Merge methods (D-044) — squash into `dev` (title = PR title, body = commit list),
      merge commit from `dev` into `main` (title = PR title, body = PR body); rebase off
- [~] Protect `main` — ruleset `main` (id 23765513): PR required (0 approvals),
      merge-commit only, no force-push/deletion, no bypass actors. Still to add:
      required status checks once the PR workflow exists
- [ ] Optional: `dev` ruleset to enforce squash-only there (would also require PRs
      into `dev`, ending direct pushes)
- [ ] Configure main-branch release workflow (concurrency group, Node LTS, permissions)
- [ ] Seed annotated `v0.0.0` tag on `main` before the first release run
- [ ] Configure semantic-release + changelog + git plugins
- [ ] Confirm branch protection allows the release bot's version/CHANGELOG commit
- [ ] Configure npm trusted publishing (OIDC) — **verify the exchange actually works**;
      fall back to a granular token in a reviewed GitHub Environment
- [ ] Enable provenance
- [ ] Deploy playground to GitHub Pages from CI
- [ ] Switch the GitHub default branch back to `main` — set to `dev` until the first
      release, because `main` still holds only GitLab's template README. The `main`
      ruleset targets `refs/heads/main` by name, so the switch does not move it
- [ ] Publish first `0.1.0`
- [ ] Verify fresh consumer can install from npm

## Current next action

_Synced 2026-09-21 against `dev` @ `7c1973e`._

Phases 1 and 2 are committed on `dev`; `main` still holds only the initial commit.
Verified today: `npm test` (31/31, includes build + API check) · `npm run lint` ·
`npm run format:check` · `npm pack --dry-run` (18 files, 21.6 kB) · `anik-ui` still
unclaimed on the public registry.

Post-MVP additions landed since Phase 2: sizing family (D-039), `--ak-viewport-block`
(D-040), declared layout tokens (D-041), block-start-only reset margins (D-042),
lightningcss minification, and fluid display type / tracking / prose primitives
(D-043). API is **416** classes. Overflow utilities remain deliberately deferred.

Repository moved to GitHub (`ksimeonov/anik-ui`, D-038); the GitLab project is archived.

Outstanding, in order:
1. Maintainer: `cd reserve && npm login && npm publish` to reserve `anik-ui@0.0.1`;
   trademark / similar-package scan (D-018 step 4).
2. Phase 3 manual gates — fill the playground stubs (spec 11, plus demos for the
   D-041/D-043 additions), browser checklist, Verdaccio consumer checks (plain HTML,
   Angular with both Sass entrypoint forms, React/Vue), import-order and RTL checks.
3. Phase 4 release automation, then merge `dev` → `main` for the first `0.1.0`.
