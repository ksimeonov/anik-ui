# Agent Handoff

Start by reading:
1. `PLAN.md`
2. `TODO.md`

Then read only the specification file(s) referenced by the current TODO item.

For any implementation work, `15-class-api-matrix.md` is also required reading — it is
the authoritative contract for what gets generated.

Phase 0 is complete except for the npm name lookup (D-018). Do not reopen settled
decisions; `14-future-roadmap.md` lists what was deliberately deferred.

Do not implement unresolved decisions. When an implementation detail needs a product/API decision, add it to `DECISIONS.md` and leave the relevant TODO item unchecked.

After each completed task:
- update `TODO.md`
- add tests where applicable
- keep README/documentation aligned with the public API
- do not add future-roadmap functionality unless explicitly approved

The desired outcome is a small, production-quality npm package, not a large CSS framework.
