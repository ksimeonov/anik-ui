# Contributing to AniK UI

Thanks for your interest. AniK UI is deliberately small — a bounded utility API,
not a growing framework. Please read this before opening a PR.

## Scope

The MVP scope and the deferred list are fixed in
[`mvp-plan/PLAN.md`](mvp-plan/PLAN.md) and
[`mvp-plan/14-future-roadmap.md`](mvp-plan/14-future-roadmap.md). New utilities
outside [`mvp-plan/15-class-api-matrix.md`](mvp-plan/15-class-api-matrix.md) will
not be merged without a prior decision recorded in
[`mvp-plan/DECISIONS.md`](mvp-plan/DECISIONS.md).

## Branching

```text
dev    primary development branch — open PRs against this
main   stable release branch — release automation only
```

Normal work: branch off `dev`, open a PR back into `dev`.

## Commit convention

Commits and — more importantly — **PR titles** follow
[Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add container query columns
fix: correct md column behavior
docs: improve grid examples
refactor: simplify token generation
test: add responsive column coverage
chore: update tooling
```

Release semantics:

| Type                                               | Effect        |
| -------------------------------------------------- | ------------- |
| `feat`                                             | minor release |
| `fix`                                              | patch release |
| `BREAKING CHANGE:` footer or `!`                   | major release |
| `docs`, `test`, `chore`, `refactor`, `build`, `ci` | no release    |

### Why the PR title matters

Merges are **squash-only**, so the PR title becomes the commit message on the
target branch and is what the release tooling reads. `commitlint` runs on the PR
title as a **required check** — this is the authoritative gate. The local
`husky` + `commitlint` hook on your own commits is a convenience so you catch
mistakes early; it is not authoritative.

## Local setup

```bash
npm ci
npm run build         # sass -> dist/
npm run lint          # stylelint
npm run format:check  # prettier
npm test              # node --test
```

`npm run api:update` regenerates `api/classes.txt` after an intentional API
change. CI fails on any undocumented drift.

## Deprecation policy

Public class names are API. Retiring one follows the process in
[`mvp-plan/01-product-and-naming.md`](mvp-plan/01-product-and-naming.md):

1. The replacement ships first; both classes work.
2. The old class is marked deprecated in `CHANGELOG.md`, the README, and a source
   comment.
3. It stays for at least one minor release.
4. Removal happens only in a major release, with a `BREAKING CHANGE:` footer.

## Code of conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md).
