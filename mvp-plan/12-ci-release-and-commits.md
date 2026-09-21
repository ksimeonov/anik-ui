# CI, Release & Commit Convention

## Branching

```text
dev    primary development branch
main   stable release branch
```

Normal work goes to `dev`. Changes reach `main` through a PR.

## Merge policy

**Squash merge into `dev`; merge commit from `dev` into `main`** (D-044).

- PRs into `dev` are squash-merged, so each change lands as one commit whose message is
  the **PR title**.
- The release PR from `dev` into `main` is a merge commit — the only method the `main`
  ruleset allows. Every conventional commit on `dev` stays reachable from `main`, so
  `semantic-release` sees each one individually, and `dev` never diverges from `main`.
- Give the release PR a no-release title (`chore(release): …`); the merge commit takes
  it as its title.

The consequence matters: the commits on `dev` are what the release tooling reads, and
for squash-merged PRs those are the PR titles. Enforcement therefore targets the PR
title, backed by the local hook for direct commits to `dev`.

## Conventional Commits

```text
feat: add container query columns
fix: correct md column behavior
docs: improve grid examples
refactor: simplify token generation
test: add responsive column coverage
chore: update tooling
```

Release semantics:

```text
feat                    → minor
fix                     → patch
BREAKING CHANGE  /  !   → major
docs/test/chore/refactor → no release
```

### Enforcement

Guidance alone is not enough — automated versioning is only as reliable as the messages
it reads.

- **`commitlint` on the PR title**, as a required PR check. This is the authoritative
  gate, because the title is what survives a squash merge into `dev`.
- **`husky` + `commitlint` on local commits**, as a convenience so contributors catch
  mistakes early. Not authoritative.
- A `commit-convention` section in `CONTRIBUTING.md`.

## Versioning

Use `semantic-release`. Do not hand-roll versioning logic.

### First release

`semantic-release` produces `1.0.0` for a first release by default, which conflicts with
the intent to ship `0.1.0`. Resolution: **seed an annotated `v0.0.0` tag on `main`
before the first pipeline run.** With that tag present, accumulated `feat:` commits
compute `0.1.0` as intended.

### 0.x and the road to 1.0

While in `0.x`, `semantic-release` promotes a breaking change to `1.0.0` rather than
bumping `0.x` — the tool's default, and the right behaviour here. It is written down so
the first breaking change is a conscious decision to declare the class API stable, not
a surprise. Until then, `0.x` signals that class names may still move.

This interacts directly with the deprecation policy in
[`13-license-and-repository.md`](13-license-and-repository.md).

## Release pipeline

```text
push/merge to main
  ↓
npm ci
  ↓
lint  (stylelint)
  ↓
format check  (prettier --check)
  ↓
build
  ↓
tests  (API snapshot, declarations, emission order, size budget, npm pack)
  ↓
determine release  (semantic-release)
  ↓
version + CHANGELOG.md
  ↓
git tag + GitHub release
  ↓
npm publish  (with provenance)
  ↓
deploy playground to GitHub Pages
```

Publishing only happens after every validation step succeeds.

### Workflow configuration

- **Node**: current LTS, pinned in both `engines` and the workflow.
- **Concurrency**: a `concurrency` group keyed on `main`, so two quick merges cannot
  race two releases.
- **Permissions**: `contents: write`, `id-token: write`, `issues: write`,
  `pull-requests: write`.

### Publishing credentials

Prefer npm **trusted publishing (OIDC)**: no long-lived token, and provenance is
attached automatically. Requirements: npm CLI ≥ 11.5.1 in the runner, `id-token: write`,
and a trusted publisher configured on the npm package pointing at this repository and
workflow file.

**Verify that the release tool's npm step actually performs the OIDC exchange before
relying on it.** If it does not, the fallback is a granular automation token stored in a
GitHub Environment with required reviewers, plus `--provenance`. Never commit a token.

### Changelog

`@semantic-release/changelog` generates `CHANGELOG.md`; `@semantic-release/git` commits
it back to `main` along with the version bump. Branch protection on `main` must allow
that bot commit — resolved by D-045: semantic-release pushes over SSH with a write
deploy key, deploy keys are the only bypass actor on the `main` ruleset, and the key
lives only in the `release` environment, which only `main` can deploy to.

After releasing, the workflow merges `main` back into `dev` so `dev` carries the version
and CHANGELOG commit. If that merge conflicts, the release has already shipped; merge
`main` into `dev` by hand.

## PR checks (required)

```text
lint · format check · build · tests · npm pack --dry-run · commitlint (PR title)
```
