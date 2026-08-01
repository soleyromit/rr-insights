---
name: sync-build-status
description: Sync rr-insights' BUILD_STATUS data from exxat-admin-workspace — detect which of exam-management/course-eval(pce)/faas/portal changed since the last check, extract user flow + functional logic, cross-reference against research, publish. Scheduled-only (weekday LaunchAgent) — see docs/superpowers/specs/2026-08-01-build-status-sync-design.md for full rationale.
---

# Sync BUILD_STATUS from exxat-admin-workspace

Cross-references what's actually shipped in `exxat-admin-workspace` against
what rr-insights' research corpus says was needed. Writes evidence-backed
entries to `src/data/buildStatus.ts` — never touches `src/data/insights.ts`.

## 0. Establish the sync window

- Read `lastCheckedSha` from `docs/build-sync-state.json`.
- If `lastCheckedSha` is `null` (first run): use a bounded lookback of the
  last 30 days of commits on `exxat-admin-workspace`'s `main`, not the full
  history — this pass is forward-looking only, per the design spec's
  "Out of scope" section (the 5-agent gap dossier already covers the
  pre-existing snapshot manually).

## 1. Pull the source — read-only

The live checkout is `/Users/romitsoley/Work` (confirmed to be
`soleyromit/exxat-admin-workspace`, remote `origin`). It carries Romit's own
uncommitted work — **never** run `git pull`, `git checkout`, or anything
that touches its working tree or index. Every read goes through `git show
<ref>:<path>` or `git log`/`git diff` against `origin/main`.

```bash
git -C /Users/romitsoley/Work fetch origin
git -C /Users/romitsoley/Work log <lastCheckedSha>..origin/main --name-only --pretty=format:'commit:%H'
```

Bucket changed files against this fixed product map:

| rr-insights `productId` | workspace path(s) |
|---|---|
| `exam-management` | `apps/exam-management/**` |
| `course-eval` | `apps/pce/**` |
| `faas` | `apps/faas/**` (once it exists) + `apps/patient-log/**` |
| `portal` | `apps/portal/**` |

Changes under `apps/skills-checklist/**` or `apps/learning-contracts/**` are
logged but produce no writes — deferred, not this pass's scope. Non-app
paths (`docs/decisions/*`, `docs/BUILD-STATUS.md`) count toward one of the
4 watched products only when clearly scoped to it.

**If nothing matched changed: log it, update nothing, exit.** Same
no-op-on-quiet-day behavior as `/sync-sources`.

## 2. Extract flow & logic, per touched product

For each changed file: `git -C /Users/romitsoley/Work show origin/main:<path>`
to read its content at the new ref without touching the working tree.

For each feature area with changes, describe:
- **userFlow** — the actual click path a user takes through it, in plain
  language.
- **functionalLogic** — the key rules/behavior it implements.
- **personaIds** — infer from the route/audience (admin-only screens don't
  get `student`; the Assessment Taker only gets `student`), cross-checked
  against that product's `primaryPersonas` in `products.ts` and each
  `PersonaMeta.products` in `personas.ts` as a prior. Portal changes always
  get `personaIds: []`.

## 3. Cross-reference against research

- Read that product's entry in `src/data/products.ts`
  (`gapsByDiscipline`, `amPmPipeline.enhancementRequests`, `roadmapPhases`)
  and grep `src/data/insights.ts` for matching `productIds`. (Portal has no
  `products.ts` entry — skip this step for portal, `relatedInsightIds: []`
  always.)
- Classify: closes a named gap → link `relatedInsightIds`, `status: 'built'`
  or `'partial'`. Net-new (no linked insights) → still record it, `status:
  'built'`, `relatedInsightIds: []` — the UI should reflect reality even
  where research didn't lead.
- If a previously-written entry for the same `featureArea` now looks
  further along, update it in place (upsert on `id`) rather than leaving a
  stale duplicate.

## 4. Write, gate, publish

- Upsert entries into `BUILD_STATUS` in `src/data/buildStatus.ts`
  (`id: bs-<product-shortid>-<feature-slug>`, e.g. `bs-em-question-bank`).
  Every `built`/`partial` entry must carry at least one `evidence` item —
  the validation script enforces this.
- Update `docs/build-sync-state.json`: `lastCheckedSha` = the fetched
  `origin/main` HEAD, `lastCheckedAt` = now.
- Gate, in order — any failure blocks the commit entirely:
  1. `npx tsc --noEmit`
  2. `npx tsx scripts/check-build-status.ts`
  3. `npm run build`
- Commit message: `chore(build-status): sync N updates from exxat-admin-workspace@<short-sha>`.
- **Push to the `claude-container` remote, not `origin`** — per this
  project's `CLAUDE.md` §"The push problem."
- Fire a macOS notification (`osascript`, same pattern as the
  vault-freshness check in `daily-rr-sync.sh`) summarizing the run: N
  entries updated, which products, or "no changes" on a quiet day.

## Non-negotiables

- Never edit `src/data/insights.ts`.
- Never run a mutating git command against `/Users/romitsoley/Work`
  (`pull`, `checkout`, `reset`, `merge`) — read-only via `fetch`/`show`/`log`/`diff`
  only.
- Never write a `built`/`partial` entry without at least one evidence item.
- No fabrication: if you can't find a file that substantiates a claim,
  don't write the entry.
