# Build-Status Sync — Design

**Date:** 2026-08-01
**Status:** Approved by Romit (in-session) — revised same day to narrow initial
product scope, add persona tagging, and add Portal.

## Problem

rr-insights records what research learned clients need. Nothing in the repo
records what has actually been *built* against that research in
`exxat-admin-workspace` (the separate monorepo where Exam Management, PCE,
and other products are under active development, live locally at
`/Users/romitsoley/Work`, remote `soleyromit/exxat-admin-workspace`).

Today, answering "what's built vs. what we researched" requires an ad hoc,
manual pass — reading both repos side by side (as just done for all 5
products in this session, via 5 parallel agents). That doesn't scale as a
recurring check, and rr-insights currently has no place to *store* the
answer even when the pass is done by hand.

This project adds a recurring, automated sync that watches
`exxat-admin-workspace` for new commits, determines which product(s) and
feature area(s) changed, extracts the actual user flow / functional logic
of what changed, cross-references it against existing research (does this
close a known gap? partially? is it net-new?), and records the result in a
new rr-insights data layer — publishing it to the live site.

## Decisions (approved)

- **Trigger**: automatic, scheduled — not manual, not commit-triggered
  (no webhook infra exists or is being added).
- **Mechanism**: a new macOS LaunchAgent + headless `claude -p` script,
  following the exact pattern already proven by
  `scripts/launchd/weekly-rr-sync.sh` / `com.romit.rr-insights-sync.plist`
  (see `docs/superpowers/specs/2026-07-31-daily-sync-vault-freshness-design.md`).
  This — not a cloud `CronCreate` routine — is the right fit: it runs on
  Romit's own machine, reuses the git push credentials already configured
  there (`sync.sh --setup`), and needs no new auth plumbing.
- **Cadence**: weekdays (Mon–Fri), once/day. Time TBD at implementation —
  default to 10:07am local, after the existing 9:00 vault pull and 9:37
  `rr-insights-sync`, following the established no-collision offset
  pattern.
- **Change detection**: `git fetch` against the live local checkout at
  `/Users/romitsoley/Work` (confirmed to already be
  `soleyromit/exxat-admin-workspace`, `origin`) — **read-only**. The script
  never runs `git pull`/`checkout` there; that working tree carries
  Romit's own uncommitted WIP (confirmed present — `git status --short`
  shows local modifications as of this design). All reads go through
  `git show <ref>:<path>` and `git diff/log` against `origin/main`, never
  touching the working directory or index.
- **Scope per run**: driven entirely by what changed — `git log
  <lastCheckedSha>..origin/main --name-only`, bucketed by `apps/<id>/` path
  prefix, restricted to the 4 watched products below. No fixed sweep; a
  quiet week produces a no-op run.
- **Data model**: new `src/data/buildStatus.ts`, a separate cross-reference
  layer. `src/data/insights.ts` is **never mutated** by this system — it
  stays the historical research record. `buildStatus.ts` entries reference
  insights by id.
- **Publish**: auto-push, no human review gate (explicit choice — Romit
  opted for this over a draft-and-notify flow, aware that a misread diff
  could publish an incorrect status to the public site). The design
  compensates with an evidence trail (file + commit per entry) and a
  `confidence` field so a wrong call is visible and correctable, not
  silently authoritative.
- **UI surfacing**: status badges on matching insights in existing product
  views, plus a per-product Build Status section/tab.
- **Initial product scope**: **exam-management, course-eval (workspace calls
  it `pce`), faas, and portal** — not all products the mechanism could
  theoretically reach. `skills-checklist` and `learning-contracts` are
  deferred (their workspace folders are docs-only placeholders per the
  gap dossier from this session — nothing to cross-reference yet); the
  sync logs any activity there but writes no `BUILD_STATUS` entries for
  them this pass. Easy to add later by extending the product map in §2 —
  no mechanism change required.
- **FaaS's workspace mapping is two folders, not one**: `apps/faas/`
  doesn't exist yet, but Patient-Log-specific research (`ins-faas-pras-*`)
  is tagged under rr-insights' `faas` productId and its groundwork lives
  in `apps/patient-log/`. The sync watches **both** `apps/faas/**` (once
  it exists) and `apps/patient-log/**` for the `faas` product bucket.
- **Persona tagging**: every `BuildStatusEntry` carries `personaIds`
  (reusing the existing `PersonaId` union — `student | dce | scce |
  program-director`), inferred during flow extraction from who the
  feature is actually built for (an admin-only page → `dce`/
  `program-director`; a student-facing route → `student`). Lets the UI
  answer "what's built for students" vs "what's built for program
  directors" per product, and surface personas with nothing built for
  them yet.
- **Portal has no research corpus** (no Granola sessions, no personas, no
  `ProductMeta` entry — it's Romit's internal tool, PM and dev both
  Romit per the workspace's own `PRODUCTS.md`). It gets a **lightweight,
  separate registry** rather than being forced into `ProductMeta`'s
  research-heavy required fields — see §1.

## 1. Data model — `src/data/buildStatus.ts`

New types in `src/types` (alongside `Insight`, `ProductMeta`):

```ts
export type BuildStatusProductId = ProductId | 'portal';

export interface BuildStatusEvidence {
  file: string;        // repo-relative path within exxat-admin-workspace
  commit: string;       // short SHA
  checkedAt: string;    // ISO date
  note?: string;         // one-line "what this file shows"
}

export interface BuildStatusEntry {
  id: string;                       // 'bs-em-question-bank'
  productId: BuildStatusProductId;  // ProductId, or 'portal'
  featureArea: string;              // "Question Bank"
  status: 'built' | 'partial' | 'gap' | 'not-started';
  confidence: 'high' | 'medium' | 'low';
  personaIds: PersonaId[];          // who this feature is actually built for
  summary: string;                   // one-line, human-facing
  userFlow: string;                  // the actual click path, plain language
  functionalLogic: string;           // key rules/behavior implemented
  relatedInsightIds: string[];       // ids into INSIGHTS this resolves/touches — [] for portal (no research corpus)
  evidence: BuildStatusEvidence[];
  lastCheckedAt: string;             // ISO date, updated every run that touches this entry
}

export const BUILD_STATUS: BuildStatusEntry[] = [ /* ... */ ];
```

- `id` is stable and derived (`bs-<product-shortid>-<feature-slug>`) so
  re-runs **upsert** (match on `id`, replace in place) rather than
  duplicate.
- No entry for a feature area means "not yet checked by this system" —
  distinct from an entry with `status: 'gap'`, which means the system
  explicitly confirmed the feature is still unbuilt as of `lastCheckedAt`.
  This distinction matters for UI rendering (see §3).
- `confidence: 'low'` entries exist (the extraction step is inherently
  judgment-heavy) but are never rendered with the same visual certainty as
  `high` — see §3.
- `personaIds` is inferred, not guessed blindly: cross-reference the
  feature's route/audience against `PERSONAS[].products` and the
  product's own `primaryPersonas` (`products.ts`) as a prior, then narrow
  based on what the actual UI does (admin-only screens don't get
  `student`; the Assessment Taker only gets `student`). Portal entries
  get `personaIds: []` — there's no persona taxonomy for an internal
  tool; §3 renders "Internal" instead of a persona chip for it.

### Portal's lightweight registry — `src/data/internalTools.ts` (new)

Portal has no Granola-sourced research, so it doesn't fit `ProductMeta`
(which requires `hmwStatements`, `gapsByDiscipline`, `dayInLife`,
`amPmPipeline`, etc. — all populated from real sessions elsewhere). Rather
than loosen that shared, heavily-used interface, Portal gets its own
minimal type so nothing about the existing 5 products' typing changes:

```ts
export interface InternalToolMeta {
  id: 'portal';
  name: string;              // "Workspace Portal"
  description: string;
  status: ProductMeta['status'];
  accentColor: string;
  owner: string;             // "Romit (PM + dev)"
  users: string;             // "Internal Exxat team"
}

export const INTERNAL_TOOLS: InternalToolMeta[] = [ /* one entry: portal */ ];
```

## 2. Sync procedure — new skill `.claude/skills/sync-build-status/SKILL.md`

Mirrors the structure of the existing `sync-sources` skill.

**Establish the sync window:**
- Read `lastCheckedSha` from `docs/build-sync-state.json` (new file,
  committed in rr-insights — see §4). First run: no prior SHA, treat the
  window as "everything since the workspace's `docs/BUILD-STATUS.md` last
  update" or a bounded lookback (e.g. last 30 days of commits) to avoid an
  unbounded first pass.

**Pull the source (read-only):**
- `git -C /Users/romitsoley/Work fetch origin`
- `git -C /Users/romitsoley/Work log <lastCheckedSha>..origin/main --name-only --pretty=format:'commit:%H'`
- Bucket changed files against this **fixed initial product map** (see
  "Initial product scope" above):

  | rr-insights `productId` | workspace path(s) watched |
  |---|---|
  | `exam-management` | `apps/exam-management/**` |
  | `course-eval` | `apps/pce/**` |
  | `faas` | `apps/faas/**` (once it exists) + `apps/patient-log/**` |
  | `portal` | `apps/portal/**` |

  Changes under `apps/skills-checklist/**` or `apps/learning-contracts/**`
  are logged (visible in the run's notification/log) but produce no
  `BUILD_STATUS` writes this pass — deferred per scope decision, not
  silently dropped.
- Non-app paths (`docs/`, root configs) are logged but don't drive
  product-level entries unless they're a `docs/decisions/*` or
  `docs/BUILD-STATUS.md` change scoped to one of the 4 watched products
  (which can update `functionalLogic`/`summary` text without a code
  change).
- **No matched product changes → exit cleanly, no commit, no push** (same
  pattern as `/sync-sources`' "nothing newer than corpus anchor" case).

**Extract flow & logic, per touched product:**
- For each changed file: `git -C /Users/romitsoley/Work show origin/main:<path>`
  to read content at the new ref without touching the working tree.
- Describe: what the feature/page does, the user's click path through it,
  and the functional rules it implements — the same depth as the 5
  gap-analysis agents produced in this session, but scoped only to what
  actually changed since last run (not a full product re-sweep every
  time).
- Infer `personaIds` from the route/audience (admin app vs. student app
  vs. taker app; cross-check against that product's `primaryPersonas` in
  `products.ts` and each `PersonaMeta.products` as a prior). Portal
  changes always get `personaIds: []`.

**Cross-reference against research:**
- Read that product's entry in `src/data/products.ts`
  (`gapsByDiscipline`, `amPmPipeline.enhancementRequests`,
  `roadmapPhases`) and grep `src/data/insights.ts` for matching
  `productIds`.
- Classify: closes a named gap (link `relatedInsightIds`, `status: 'built'`
  or `'partial'`), or net-new (no linked insights, still recorded so the
  UI reflects reality even where research didn't lead).
- If a previously-`'gap'` entry now looks addressed, update it in place
  rather than leaving a stale duplicate.

**Write, gate, publish:**
- Upsert entries into `BUILD_STATUS` in `src/data/buildStatus.ts`.
- Update `docs/build-sync-state.json` → new `lastCheckedSha` = fetched
  `origin/main` HEAD, `lastCheckedAt` = now.
- `npx tsc --noEmit` + `npm run build` — same gate `/sync-sources` already
  uses; a build failure blocks the commit entirely (this is the one hard
  stop even with no human review).
- Commit message: `chore(build-status): sync N updates from exxat-admin-workspace@<short-sha>`.
- **Push to the `claude-container` remote, not `origin`** — matching the
  existing project convention stated in `CLAUDE.md` §"The push problem."
- macOS notification (`osascript`, same pattern as the vault-freshness
  check) summarizing the run: N entries updated, which products, or "no
  changes" on a quiet day.

## 3. UI surfacing

- **Insight-level badge**: any insight whose id appears in some
  `BuildStatusEntry.relatedInsightIds` gets a small pill next to it in the
  existing product views — ✅ Shipped (built), ◐ Partial, or a muted "still
  open" mark for `gap`. `confidence: 'low'` entries render the pill in a
  visually softer/outlined style rather than solid fill, signaling "system
  believes this but hasn't confirmed with certainty."
- **Per-product Build Status section**: a new tab/section in each of the
  4 watched product views (`ExamManagementView.tsx`, `CourseEvalView.tsx`,
  `FaaSView.tsx`, and a new lightweight Portal page), listing
  `BUILD_STATUS` entries for that product grouped by `featureArea` —
  status pill, persona chips, summary, userFlow, functionalLogic,
  evidence (linked to
  `github.com/soleyromit/exxat-admin-workspace/blob/<commit>/<file>`),
  and `lastCheckedAt`. A persona filter (student / dce / scce /
  program-director) narrows the list to "what's built for this persona."
- **Portal's page is leaner by design**: built-features list only (from
  `BUILD_STATUS` where `productId: 'portal'`) — no "gaps from research"
  section, since there's no research corpus to diff against. A one-line
  "Internal tool — Romit (PM + dev)" note replaces the usual
  persona/competitor framing.
- Products/personas with zero matching `BUILD_STATUS` entries show a
  plain "not yet synced" or "nothing built for this persona yet" state
  rather than implying "nothing exists."

## 4. New state file — `docs/build-sync-state.json`

```json
{
  "lastCheckedSha": "<sha>",
  "lastCheckedAt": "2026-08-01T00:00:00.000Z",
  "workspacePath": "/Users/romitsoley/Work"
}
```

Committed to rr-insights (not gitignored) so state survives across runs
and is visible/diffable like everything else the sync touches.

## 5. LaunchAgent

- New `scripts/launchd/com.romit.rr-build-status-sync.plist` +
  `scripts/launchd/build-status-sync.sh`, modeled directly on the existing
  pair. `StartCalendarInterval` as an array of 5 dicts (Weekday 1–5, Hour
  10, Minute 7) for Mon–Fri.
- `build-status-sync.sh` invokes:
  ```sh
  claude -p "Run /sync-build-status." \
    --permission-mode acceptEdits \
    --allowedTools "Bash(git fetch:*)" "Bash(git log:*)" "Bash(git show:*)" "Bash(git diff:*)" \
      "Bash(git add:*)" "Bash(git commit:*)" "Bash(git push:*)" "Bash(git status:*)" \
      "Bash(npx tsc:*)" "Bash(npm run build:*)" "Bash(find:*)" "Bash(grep:*)" "Bash(ls:*)" "Bash(cat:*)" \
    --max-turns 300
  ```
- Logs to `/tmp/rr-build-status-sync.log` / `.err`, same convention.

## Data flow

```
launchd fires build-status-sync.sh (weekdays, 10:07am)
  → claude -p "/sync-build-status" headless
      → git fetch origin at /Users/romitsoley/Work (read-only)
      → diff lastCheckedSha..origin/main, bucket by apps/<product>/
      → no matched changes? log + exit, no commit
      → else, per touched product:
          read changed files at origin/main via `git show`
          extract user flow + functional logic
          cross-reference src/data/{insights,products}.ts
          upsert src/data/buildStatus.ts entries (evidence + confidence)
      → update docs/build-sync-state.json
      → tsc --noEmit + npm run build gate
      → commit, push to claude-container remote
      → osascript notification: summary of what changed
  → GitHub Actions builds + deploys to GitHub Pages
```

## Error handling

- Build gate failure (`tsc`/`npm run build`) blocks the commit entirely —
  the one non-negotiable stop in an otherwise no-review pipeline.
- `git fetch` failure (network, workspace path missing) logs and exits
  without touching rr-insights — never partial-write.
- Ambiguous product attribution (a changed file outside any `apps/<id>/`
  path) is logged, not silently dropped or guessed into a product.
- Low-confidence classifications are written (not discarded) but flagged
  via `confidence: 'low'` — visible on the public site as softer styling,
  not hidden.

## Verification plan

- Run `build-status-sync.sh` by hand once after implementation, using a
  bounded lookback (e.g. `main~20..main`) against `/Users/romitsoley/Work`
  as a first-run test — confirm entries generated for Exam Management
  and/or PCE (both have recent commit activity) look accurate against
  what's actually in those apps today.
- Confirm a second immediate run is a clean no-op (idempotency check —
  `lastCheckedSha` now equals `origin/main` HEAD).
- `launchctl print gui/$(id -u)/com.romit.rr-build-status-sync` shows the
  installed schedule.
- Spot-check one `BUILD_STATUS` entry's evidence links resolve to real
  commits/files on GitHub.

## Out of scope

- Manual/on-demand invocation (`/sync-build-status <product>` as a
  user-triggered command) — this design is schedule-only per Romit's
  choice; could be added later without conflicting with this design.
- A human review/approval step before publish — explicitly declined.
- Watching any repo other than `exxat-admin-workspace`.
- `skills-checklist` and `learning-contracts` — deferred to a later pass;
  extending the product map in §2 is the only change needed when ready
  (their workspace folders are currently docs-only placeholders anyway,
  per the gap dossier from this session, so there's little to sync yet).
- Retroactively backfilling `BUILD_STATUS` for all pre-existing built
  features in one pass (the 5-agent gap dossier from this session already
  covers that snapshot manually) — first automated run only picks up
  what changes *after* implementation, per the bounded-lookback note in
  §"Establish the sync window."
- Vercel deployment events or GitHub PR-merge triggers as the change
  signal (considered, git commits on `main` chosen instead).
