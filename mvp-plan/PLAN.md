# AniK UI — MVP Agent Plan

> **Goal:** Build a tiny framework-agnostic layout and utility system.
>
> **Current phase:** API definition complete. Blocked only on the npm name lookup (D-018);
> Phase 1 bootstrap starts immediately after.
>
> **Read this file first. Do not read every referenced document automatically.**
> Read only the section/spec needed for the current TODO item.

## Project principles

- Framework agnostic: Angular, React, Vue, Svelte, plain HTML, etc.
- CSS/SCSS first; no JavaScript runtime in MVP.
- No UI components in the core package.
- Small, predictable, composable utility API.
- No unexpected global styles.
- Modern browsers only.
- Real recurring layout needs drive future features.
- Public CSS class names are treated as API and must not be changed casually.
- The generated class list is bounded and enumerated, never open-ended.
- Utilities are self-sufficient: importing the optional reset must never change how
  they behave.

## Current identity

- Project: **AniK UI**
- CSS prefix: **`ak-`**
- npm package name: **TBD / verify availability**
- License: **MIT**
- Primary distribution: compiled CSS
- Optional distribution: SCSS source
- Registry: **public npm**
- Repository: **prefer public GitHub repository**

## MVP scope

Included:

- CSS Grid-based `row` / column layout
- viewport-responsive utilities
- container-query-responsive utilities
- spacing
- padding
- margin
- Flexbox utilities
- alignment
- typography sizes
- `font-bold`
- positioning
- visibility
- CSS custom property tokens
- `ak-page` width wrapper
- display/visibility family and `ak-sr-only`
- optional explicit reset stylesheet
- Sass build
- Stylelint + Prettier
- plain HTML/CSS playground
- tests/validation
- npm packaging
- CI release workflow

Excluded from MVP:

- UI components
- JavaScript runtime
- animation/scroll engine
- parallax
- scroll reveal
- advanced grid start/end APIs
- framework wrappers
- theme engine
- icon system

## Development workflow

```text
dev
  ↓
feature work
  ↓
conventional commit messages
  ↓
PR
  ↓
main
  ↓
automated validation
  ↓
semantic version calculation
  ↓
release notes
  ↓
git tag / GitHub release
  ↓
npm publish
```

## How the agent should use this plan

1. Read `TODO.md`.
2. Work only on the current/next unchecked item.
3. Read the referenced spec file for that item.
4. Implement and test it.
5. Update `TODO.md`.
6. Do not silently make unresolved API decisions; record them in `DECISIONS.md`.
7. Keep the implementation aligned with the principles above.

## Specification index

| File | Purpose |
|---|---|
| `01-product-and-naming.md` | Product identity, package naming, naming principles |
| `02-responsive-system.md` | Breakpoints and container queries |
| `03-spacing-and-tokens.md` | Spacing, padding, margin, CSS tokens |
| `04-row-and-columns.md` | Grid/row and responsive column API |
| `05-flex-api.md` | Flex, horizontal/vertical alignment utilities |
| `06-typography-position-visibility.md` | Typography, positioning, visibility |
| `07-reset-and-global-css.md` | Explicit reset strategy and global-style rules |
| `08-build-and-package.md` | Sass, package structure, package.json, npm contents |
| `09-local-development.md` | Testing package locally before publishing |
| `10-nexus-no.md` | Public npm publishing; old Nexus plan retained only as historical context |
| `11-playground-and-testing.md` | Plain HTML/CSS playground and validation |
| `12-ci-release-and-commits.md` | dev→main workflow, Conventional Commits, automated release |
| `13-license-and-repository.md` | MIT license and public/private repository considerations |
| `14-future-roadmap.md` | Post-MVP items and the explicit deferred-from-MVP list |
| `15-class-api-matrix.md` | **Authoritative** class list, grammar, and variant matrix |
| `16-cascade-and-browser-support.md` | Layers, specificity, import order, emission order, browser floor |
| `DECISIONS.md` | Decisions made, rejected alternatives, unresolved questions |
| `TODO.md` | Living implementation checklist |

## Important agent constraints

- Do not implement future-roadmap items unless they are explicitly moved into MVP in
  `DECISIONS.md`. `14-future-roadmap.md` carries an explicit deferred-from-MVP table —
  items there were considered and rejected for MVP, not overlooked.
- `15-class-api-matrix.md` is the contract. Generate exactly what it lists: nothing
  extra, nothing renamed. The API snapshot test (`api/classes.txt`) enforces this.
- Several behaviours are pure source-order effects. Follow the emission order in
  `16-cascade-and-browser-support.md` exactly.
