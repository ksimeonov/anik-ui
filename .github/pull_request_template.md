<!--
PR TITLE must be a Conventional Commit — it becomes the squash-merge commit
message and is what the release tooling reads. commitlint checks it as a
required status.

  feat:  minor   |   fix:  patch   |   BREAKING CHANGE: / !  major
  docs / test / chore / refactor / build / ci  ->  no release
-->

## What & why

<!-- What changes, and which recurring need or bug it addresses. -->

## API impact

- [ ] No change to generated classes
- [ ] Changes generated classes — `api/classes.txt` regenerated (`npm run api:update`)
- [ ] Adds classes — decision recorded in `mvp-plan/DECISIONS.md`: D-___
- [ ] Deprecates/removes a class — deprecation policy followed

## Checklist

- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run format:check` passes
- [ ] `npm run build` succeeds from a clean checkout
- [ ] `npm test` passes (API snapshot, declarations, emission order, size budget)
- [ ] README / CONTRIBUTING updated if public behaviour changed
- [ ] Target branch is `dev`
