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
- [x] **Verify npm package name availability and reserve it** — decision rule in D-018.
      Availability verified 2026-09-07; **reserved 2026-09-22** by publishing the
      `reserve/` placeholder as `anik-ui@0.0.1` (maintainer `ksimeonov`, 2FA on).
      Trademark / similar-package scan (D-018 step 4) still outstanding.

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
- [x] Playground demos built — every spec 11 demonstration, plus page/layout tokens
      (D-041), display type / tracking / prose (D-043), sizing (D-039) and RTL. No
      JavaScript: resizable frames + CSS-driven threshold labels for container
      queries; `reset-on.html` / `reset-off.html` and `containment.html` in iframes.
      Uses 128 of the 416 classes, all checked against `api/classes.txt`
- [~] Playground verified against the browser checklist — automated pass
      2026-09-22 in current engines only (Playwright: Chromium 151, WebKit / Safari
      26.5, Firefox 153) at 375 / 800 / 1280px: no horizontal overflow, no console
      errors, visibility ranges, `ak-min-w-0` pair. Still needs a human pass and
      the floor versions
- [~] Responsive checks — current Chrome, Firefox, Safari engines pass (above);
      iOS Safari and the D-027 floor versions not yet checked
- [~] Container-query checks, including `ak-cq` + `ak-row` on the same element —
      current engines pass: 1 → 2 (c-md) → 4 (c-lg) per line, container variant
      beats viewport variant, same card stacks/unstacks by container. Floor
      versions not yet checked
- [~] Containment caveat verified: `ak-fixed` inside `ak-cq` behaves as documented
      — the old caveat did **not** reproduce in Chromium 151, WebKit 26.5 or Firefox
      153, and the current spec applies no layout containment. README and specs 02 /
      06 / 11 / 13 reworded as "`ak-cq` side effects" (D-046). Still to do: run
      `playground/containment.html` at the D-027 floor versions and adjust the README
      note if one of them captures
- [ ] Degradation check: below-floor browser keeps the default layout, does not break
- [x] Install the packaged artifact into consumer projects — 2026-09-22 via Verdaccio
      (`anik-ui@0.0.0-local.*`). `local:publish` was broken on npm ≥ 10 (prerelease
      needs an explicit `--tag`); fixed. All `exports` subpaths resolve through Node
- [x] Angular consumer (Angular 22, `@angular/build:application`): compiled CSS via
      the `styles` array, bare Sass specifiers, `pkg:` and the `src/` path all build
      and render. Results table in spec 09
- [x] React consumer (Vite 8 + React 19) and plain HTML consumer: `import
      'anik-ui/css'` and `<link>` to `dist/*.min.css` render correctly at 375 / 1024px.
      **Finding:** Vite rejects `anik-ui/src/scss/index` (not exported) — the spec 09
      "direct path fallback" was wrong; README now documents bare specifiers for
      bundlers and `pkg:` for Dart Sass
- [x] Import-order check — `ak-p-0` beats a component `.card { padding: 40px }` in
      plain HTML, Vite and Angular (Chromium). **Finding:** `@use 'anik-ui'` at the top
      of the component stylesheet loses (verified, Angular); README now shows
      `meta.load-css` last (verified in Vite and Angular) or ordered files
- [ ] Minified builds ship without source maps — D-036 and the Phase 1 note say they
      ship for both entrypoints, but `build:min` (lightningcss) has emitted none since
      the switch. Fix the build (`--sourcemap`) or correct D-036
- [ ] Webpack `sass-loader` outside Angular — not covered by the consumer checks
- [~] RTL spot check: `dir="rtl"` page lays out correctly with `ak-ps-*` / `ak-ms-*`
      — playground `#rtl` renders mirrored in Chromium (padding, `ak-ms-auto`,
      `ak-start-0`, column order); needs a human look in the other engines

## Phase 4 — Release automation

- [x] Decide repository host (D-038) — GitHub, `ksimeonov/anik-ui` (GitLab archive: maintainer)
- [x] Add Conventional Commits guidance to CONTRIBUTING.md — "Commit convention" section
- [x] Configure required PR checks — `.github/workflows/pr-checks.yml` (`checks`: lint,
      format, build, tests, pack; PRs into `dev`/`main` + pushes to `dev`) and
      `pr-title.yml` (`pr-title`: commitlint on the PR title). Node 24 LTS, actions
      pinned by SHA. Title gate verified failing on a non-conventional title (PR #1)
- [x] Merge methods (D-044) — squash into `dev` (title = PR title, body = commit list),
      merge commit from `dev` into `main` (title = PR title, body = PR body); rebase off
- [x] Protect `main` — ruleset `main` (id 23765513, targets `refs/heads/main`): PR
      required (0 approvals), merge-commit only, `checks` + `pr-title` required (GitHub
      Actions only), no force-push/deletion
- [ ] Optional: `dev` ruleset to enforce squash-only there (would also require PRs
      into `dev`, ending direct pushes)
- [x] Configure main-branch release workflow — `.github/workflows/release.yml`: push to
      `main`, `release-main` concurrency group (no cancel), Node 24, `release`
      environment, full check suite before releasing, back-merge `main` → `dev` after
- [x] Seed annotated `v0.0.0` tag on `main` — on `7829609`, pushed 2026-09-21
- [x] Configure semantic-release + changelog + git plugins — `.releaserc.json`,
      `conventionalcommits` preset. Dry run on the branch computed **0.1.0** from 4 `feat`
- [x] Let the release bot's version/CHANGELOG commit through the `main` ruleset (D-045)
      — deploy key 163964288 (write), private half is `RELEASE_DEPLOY_KEY` in the
      `release` environment (deployments limited to `main`); `DeployKey` is the only
      bypass actor on ruleset 23765513
- [ ] Configure npm trusted publishing (OIDC) — package exists (`0.0.1` placeholder).
      **Maintainer:** npmjs.com → `anik-ui` → Settings → Trusted
      publisher → GitHub Actions: `ksimeonov` / `anik-ui` / `release.yml` / environment
      `release`. **Verify the exchange on the first release**; fallback is a granular
      `NPM_TOKEN` secret in the `release` environment. Then set Publishing access to
      "Require two-factor authentication and disallow tokens"
- [x] Enable provenance — automatic with trusted publishing (`id-token: write`)
- [ ] Deploy playground to GitHub Pages from CI
- [ ] Switch the GitHub default branch back to `main` — set to `dev` until the first
      release, because `main` still holds only GitLab's template README. The `main`
      ruleset targets `refs/heads/main` by name, so the switch does not move it
- [ ] Publish first `0.1.0`
- [ ] Verify fresh consumer can install from npm

## Current next action

_Synced 2026-09-22 against `dev` @ `9be8b6a`._

Phases 1 and 2 are committed on `dev`; `main` still holds only the initial commit.
Verified 2026-09-21: `npm test` (31/31, includes build + API check) · `npm run lint` ·
`npm run format:check` · `npm pack --dry-run` (18 files, 21.6 kB). `anik-ui@0.0.1`
placeholder published 2026-09-22.

Post-MVP additions landed since Phase 2: sizing family (D-039), `--ak-viewport-block`
(D-040), declared layout tokens (D-041), block-start-only reset margins (D-042),
lightningcss minification, and fluid display type / tracking / prose primitives
(D-043). API is **416** classes. Overflow utilities remain deliberately deferred.

Repository moved to GitHub (`ksimeonov/anik-ui`, D-038). PR checks, the `main`
ruleset and the release workflow (D-044, D-045) are live; `v0.0.0` is seeded and a
dry run computes `0.1.0`.

### Plan to `0.1.0` (written 2026-09-22)

Ordered by what affects the shipped package first. **Agent** steps are done in this
repo; **Maintainer** steps need npm / GitHub / GitLab access or a human eye.

1. **Agent — consumer checks via Verdaccio** (Phase 3) — **done 2026-09-22**, see Phase 3. Install the packaged
   `anik-ui` into throwaway plain HTML, Angular and React/Vite projects. Every
   `exports` path, both Sass entrypoint forms inside real toolchains, and the
   import-order override. Fix whatever breaks before anything else.
2. **Agent — `engines` scoping** (needs maintainer OK: it changes published
   metadata). `engines.node` applies to every consumer; move the Node requirement to
   `devEngines` / `.nvmrc` so a CSS-only package does not warn or fail on Node 20.
3. **Agent — floor and degradation browsers.** Old Playwright builds for Chromium 111
   and Firefox 113 (containment test, playground) and a pre-container-query Chromium
   (degradation check). Safari 16.4 cannot be reproduced this way.
4. **Agent — docs and hygiene PR:** the 11-gaps minimum-width note in the README;
   stale D-024 count (406 → 416) and README "being implemented" status; playground
   deployed to GitHub Pages from the release workflow, plus the README link; a test
   that fails when the playground uses a class not in `api/classes.txt`;
   similar-package scan on npm (D-018 step 4, name half).
5. **Maintainer:** merge the open PRs; configure the npm trusted publisher and lock
   Publishing access to 2FA-only; archive GitLab and `git remote remove gitlab`;
   install `gh` properly (then delete `.git/gh`, re-run `gh auth setup-git`); trademark
   half of D-018 step 4; human playground pass incl. iOS Safari and Safari 16.4.
6. **First release:** `dev` → `main` PR titled `chore(release): 0.1.0`, merged with a
   merge commit; verify the OIDC publish (fallback: `NPM_TOKEN` in the `release`
   environment); switch the default branch back to `main`; install `0.1.0` from npm
   into a fresh consumer.

Known and accepted: OIDC can only be proven by the first release; squash-only on
`dev` stays convention unless a `dev` ruleset is wanted.
