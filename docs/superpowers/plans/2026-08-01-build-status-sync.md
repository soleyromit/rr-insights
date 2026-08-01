# Build-Status Sync Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give rr-insights a data layer + UI that records what's actually shipped in `exxat-admin-workspace`, cross-referenced against the research corpus, for exam-management, course-eval (PCE), faas, and portal — then automate keeping it current via a scheduled local sync.

**Architecture:** A new `BUILD_STATUS` cross-reference array (`src/data/buildStatus.ts`) sits alongside the existing `insights.ts`/`products.ts` without mutating either. A new Astryx-based `BuildStatus` component renders it per product (grouped by feature area, filterable by persona); a small `BuildStatusPill` renders per-insight status badges. A new headless-Claude skill (`/sync-build-status`), invoked by a macOS LaunchAgent modeled on the existing `rr-insights-sync` one, keeps the data current by diffing `exxat-admin-workspace` commits and upserting entries.

**Tech Stack:** React 19 + TypeScript, Vite, the Astryx design system (`@astryxdesign/core`), `tsx` for standalone validation scripts (no unit-test framework exists in this repo — see Global Constraints).

**Design spec:** `docs/superpowers/specs/2026-08-01-build-status-sync-design.md` (committed `a49bbed`). Read it before starting if anything below is ambiguous — it has the full rationale.

## Global Constraints

- **No unit-test framework exists in this repo** (no jest/vitest — confirmed via `package.json`). This repo's actual verification convention is `npx tsc --noEmit` + `npm run build` + standalone `tsx` validation scripts (see `scripts/check-themes.ts`). Every task below adapts the "write failing test → see it fail → make it pass" cycle to this reality: for data/schema tasks, the validation script IS the test, proven against a deliberately-broken fixture; for UI tasks, a temporary seeded fixture + manual browser check IS the test, since there's no component test runner.
- Astryx rules apply to all new UI code (per project `CLAUDE.md`): no raw `<div>`/`<span>` layout, components do layout via `VStack`/`HStack`/`Grid`, no hardcoded hex/px, `Badge` only for enumerated states (this feature is exactly that use case).
- `src/data/insights.ts` is **never modified** by any task in this plan — it's the historical research record. All new data lives in `src/data/buildStatus.ts` / `src/data/internalTools.ts`.
- Reuse existing components over inventing new ones: `Token`, `Badge`, `Card`, `TokenFilterRow` (`src/components/ui/TokenFilterRow.tsx`) already exist and cover everything this feature needs — confirmed by reading their real usage in `InsightIndexView.tsx` and `components/ui/sev.tsx` before writing this plan.
- `BUILD_STATUS` in `src/data/buildStatus.ts` starts as an **empty array** and stays that way after this plan — per the design spec, backfilling it is explicitly out of scope; the automation populates it going forward. Any task below that seeds temporary sample data for visual verification must remove that data before its final commit.
- Commits in this plan are local only (`git commit`, never `git push`) — pushing is a separate, explicit action outside this plan's scope.

---

### Task 1: Types

**Files:**
- Modify: `src/types/index.ts`

**Interfaces:**
- Produces: `BuildStatusProductId`, `BuildStatusEvidence`, `BuildStatusEntry`, `InternalToolMeta` — every later task imports these from `../../types` (or `../types` depending on file depth).

- [ ] **Step 1: Add the new types**

Open `src/types/index.ts`. After the existing `PersonaMeta` interface (it ends at line 70, right before `WhiteboardArtifact`), insert:

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
  productId: BuildStatusProductId;
  featureArea: string;              // "Question Bank"
  status: 'built' | 'partial' | 'gap' | 'not-started';
  confidence: 'high' | 'medium' | 'low';
  personaIds: PersonaId[];          // [] for portal entries — no persona taxonomy for an internal tool
  summary: string;
  userFlow: string;
  functionalLogic: string;
  relatedInsightIds: string[];      // [] when net-new (no linked research)
  evidence: BuildStatusEvidence[];
  lastCheckedAt: string;             // ISO date
}

export interface InternalToolMeta {
  id: 'portal';
  name: string;
  description: string;
  status: ProductMeta['status'];
  accentColor: string;
  owner: string;
  users: string;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no new errors (the file has no consumers yet, so this just confirms the types themselves are well-formed — e.g. `ProductMeta['status']` resolves, `PersonaId`/`ProductId` are in scope in the same file already).

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(build-status): add BuildStatusEntry, InternalToolMeta types"
```

---

### Task 2: Data layer

**Files:**
- Create: `src/data/buildStatus.ts`
- Create: `src/data/internalTools.ts`

**Interfaces:**
- Consumes: `BuildStatusEntry`, `InternalToolMeta` from Task 1 (`../types`).
- Produces: `BUILD_STATUS: BuildStatusEntry[]` (empty), `INTERNAL_TOOLS: InternalToolMeta[]` (one entry, portal) — every later task that reads build-status data imports from these two files.

- [ ] **Step 1: Create `src/data/buildStatus.ts`**

```ts
// data/buildStatus.ts — what's actually shipped in exxat-admin-workspace,
// cross-referenced against the research corpus in insights.ts (never
// mutated by this file or its consumers). Populated by the
// build-status-sync automation (.claude/skills/sync-build-status) —
// starts empty; do not hand-backfill (see design spec, "Out of scope").
import type { BuildStatusEntry } from '../types';

export const BUILD_STATUS: BuildStatusEntry[] = [];
```

- [ ] **Step 2: Create `src/data/internalTools.ts`**

```ts
// data/internalTools.ts — lightweight registry for internal tools that have
// no Granola-sourced research corpus (unlike the 5 products in products.ts).
// Portal is Romit's own connector hub, not something Granola sessions cover
// — see docs/superpowers/specs/2026-08-01-build-status-sync-design.md §1.
import type { InternalToolMeta } from '../types';

export const INTERNAL_TOOLS: InternalToolMeta[] = [
  {
    id: 'portal',
    name: 'Workspace Portal',
    description: 'Connector hub for all Exxat products — App Store-style product pages with overview, resources, and what\'s-new tabs. Deployed at exxat-portal.vercel.app.',
    status: 'active',
    accentColor: '#475569',
    owner: 'Romit (PM + dev)',
    users: 'Internal Exxat team',
  },
];
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/data/buildStatus.ts src/data/internalTools.ts
git commit -m "feat(build-status): add empty BUILD_STATUS array and Portal's internal-tools registry"
```

---

### Task 3: Validation script

**Files:**
- Create: `scripts/check-build-status.ts`

**Interfaces:**
- Consumes: `BUILD_STATUS` (Task 2), `ALL_INSIGHTS` (`src/data/insights.ts`, existing), `PRODUCTS` (`src/data/products.ts`, existing), `INTERNAL_TOOLS` (Task 2).
- Produces: an `npx tsx scripts/check-build-status.ts` command, exit code 0/1 — later folded into the build gate (Task 10) and into the `/sync-build-status` skill's own gate (Task 8).

This script is this repo's substitute for a unit test (see Global Constraints) — it catches what TypeScript's structural typing can't: duplicate ids across array elements, dangling references between `BUILD_STATUS` and `insights.ts`, and business rules (evidence required for a "built" claim) that aren't type-level constraints. It's modeled directly on the existing `scripts/check-themes.ts`.

- [ ] **Step 1: Write the script**

```ts
// scripts/check-build-status.ts — corpus invariants for the build-status
// cross-reference layer. Mirrors scripts/check-themes.ts's job.
// Run: npx tsx scripts/check-build-status.ts   (exit 1 on violation)
import { BUILD_STATUS } from '../src/data/buildStatus';
import { ALL_INSIGHTS } from '../src/data/insights';
import { PRODUCTS } from '../src/data/products';
import { INTERNAL_TOOLS } from '../src/data/internalTools';

let fail = 0;
const err = (m: string) => { console.error('FAIL:', m); fail = 1; };

const knownProductIds = new Set<string>([...PRODUCTS.map((p) => p.id), ...INTERNAL_TOOLS.map((t) => t.id)]);
const knownInsightIds = new Set(ALL_INSIGHTS.map((i) => i.id));

// Unique ids: BuildStatusEntry.id must be unique — UI React keys and the
// sync's re-run upsert logic both depend on this.
{
  const seen = new Set<string>();
  for (const b of BUILD_STATUS) {
    if (seen.has(b.id)) err(`duplicate build-status id: ${b.id}`);
    seen.add(b.id);
  }
}

for (const b of BUILD_STATUS) {
  if (!knownProductIds.has(b.productId)) {
    err(`${b.id}: unknown productId "${b.productId}" (not in PRODUCTS or INTERNAL_TOOLS)`);
  }

  const dead = b.relatedInsightIds.filter((id) => !knownInsightIds.has(id));
  if (dead.length) err(`${b.id}: cites missing insights: ${dead.join(', ')}`);

  if ((b.status === 'built' || b.status === 'partial') && b.evidence.length === 0) {
    err(`${b.id}: status "${b.status}" requires at least one evidence entry`);
  }

  if (b.productId === 'portal' && b.personaIds.length > 0) {
    err(`${b.id}: portal entries must have personaIds: [] (no persona taxonomy for an internal tool)`);
  }
}

if (!fail) console.log('OK:', BUILD_STATUS.length, 'build-status entries, all valid.');
process.exit(fail);
```

- [ ] **Step 2: Run it against the current (empty) data — confirm it passes**

Run: `npx tsx scripts/check-build-status.ts`
Expected: `OK: 0 build-status entries, all valid.` and exit code 0.

- [ ] **Step 3: Prove it actually catches problems — temporarily break the data**

Edit `src/data/buildStatus.ts`, temporarily replacing the empty array with:

```ts
export const BUILD_STATUS: BuildStatusEntry[] = [
  {
    id: 'bs-test-dup', productId: 'exam-management', featureArea: 'Test',
    status: 'built', confidence: 'high', personaIds: ['dce'],
    summary: 'temp', userFlow: 'temp', functionalLogic: 'temp',
    relatedInsightIds: ['this-insight-id-does-not-exist'],
    evidence: [], lastCheckedAt: '2026-08-01',
  },
  {
    id: 'bs-test-dup', productId: 'exam-management', featureArea: 'Test',
    status: 'gap', confidence: 'high', personaIds: [],
    summary: 'temp', userFlow: 'temp', functionalLogic: 'temp',
    relatedInsightIds: [], evidence: [], lastCheckedAt: '2026-08-01',
  },
];
```

This deliberately triggers three of the four checks: duplicate `id`, a dangling `relatedInsightIds` reference, and a `'built'` status with no evidence.

- [ ] **Step 4: Run it again — confirm it fails with all three errors**

Run: `npx tsx scripts/check-build-status.ts`
Expected: exit code 1, with these three lines (order may vary):
```
FAIL: duplicate build-status id: bs-test-dup
FAIL: bs-test-dup: cites missing insights: this-insight-id-does-not-exist
FAIL: bs-test-dup: status "built" requires at least one evidence entry
```

- [ ] **Step 5: Revert the temporary fixture**

Edit `src/data/buildStatus.ts` back to:

```ts
export const BUILD_STATUS: BuildStatusEntry[] = [];
```

- [ ] **Step 6: Run it once more — confirm clean pass**

Run: `npx tsx scripts/check-build-status.ts`
Expected: `OK: 0 build-status entries, all valid.`, exit code 0.

- [ ] **Step 7: Commit**

```bash
git add scripts/check-build-status.ts
git commit -m "feat(build-status): add corpus-invariant validation script"
```

(`src/data/buildStatus.ts` should show no diff at this point — it was reverted to its Task 2 state.)

---

### Task 4: Selectors

**Files:**
- Modify: `src/lib/selectors.ts`

**Interfaces:**
- Consumes: `BUILD_STATUS` (Task 2), `BuildStatusEntry`/`BuildStatusProductId` (Task 1).
- Produces: `buildStatusForProduct(productId: BuildStatusProductId): BuildStatusEntry[]`, `buildStatusForInsight(insightId: string): BuildStatusEntry[]` — Task 5 uses the first, Task 7 uses the second.

- [ ] **Step 1: Add the import**

Open `src/lib/selectors.ts`. Add to the existing top-of-file import block (alongside the existing `ALL_INSIGHTS` import):

```ts
import { BUILD_STATUS } from '../data/buildStatus';
import type { BuildStatusEntry, BuildStatusProductId } from '../types';
```

(If `Insight`/other types are already imported via a combined `import type { ... } from '../types'` line, add `BuildStatusEntry, BuildStatusProductId` to that existing line instead of a separate one.)

- [ ] **Step 2: Append the two selectors**

At the end of `src/lib/selectors.ts`, add:

```ts
export function buildStatusForProduct(productId: BuildStatusProductId): BuildStatusEntry[] {
  return BUILD_STATUS.filter((b) => b.productId === productId);
}

export function buildStatusForInsight(insightId: string): BuildStatusEntry[] {
  return BUILD_STATUS.filter((b) => b.relatedInsightIds.includes(insightId));
}
```

- [ ] **Step 3: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Prove the filtering logic is correct**

Temporarily add one entry to `BUILD_STATUS` in `src/data/buildStatus.ts`:

```ts
export const BUILD_STATUS: BuildStatusEntry[] = [
  {
    id: 'bs-test-selector', productId: 'exam-management', featureArea: 'Test',
    status: 'built', confidence: 'high', personaIds: ['dce'],
    summary: 'temp', userFlow: 'temp', functionalLogic: 'temp',
    relatedInsightIds: ['ins-em-001'], evidence: [{ file: 'x', commit: 'abc123', checkedAt: '2026-08-01' }],
    lastCheckedAt: '2026-08-01',
  },
];
```

Run: `npx tsx -e "import { buildStatusForProduct, buildStatusForInsight } from './src/lib/selectors'; console.log(buildStatusForProduct('exam-management').length, buildStatusForProduct('faas').length, buildStatusForInsight('ins-em-001').length, buildStatusForInsight('ins-em-002').length);"`
Expected output: `1 0 1 0` (found for the right product/insight, empty for the wrong ones).

- [ ] **Step 5: Revert the temporary fixture**

Edit `src/data/buildStatus.ts` back to `export const BUILD_STATUS: BuildStatusEntry[] = [];`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/selectors.ts
git commit -m "feat(build-status): add buildStatusForProduct/buildStatusForInsight selectors"
```

---

### Task 5: Build Status UI components, wired into the 3 built product views

**Files:**
- Create: `src/components/build-status/BuildStatusPill.tsx`
- Create: `src/components/build-status/BuildStatus.tsx`
- Modify: `src/views/products/ExamManagementView.tsx`
- Modify: `src/views/products/CourseEvalView.tsx`
- Modify: `src/views/products/FaaSView.tsx`

**Interfaces:**
- Consumes: `buildStatusForProduct` (Task 4), `BuildStatusEntry`/`BuildStatusProductId` (Task 1), `PERSONAS` (`src/data/personas.ts`, existing), `TokenFilterRow` (`src/components/ui/TokenFilterRow.tsx`, existing — confirmed real component/props before writing this plan).
- Produces: `<BuildStatusPill status confidence />`, `<BuildStatus productId />` — Task 6 (Portal) and Task 7 (insight badge) both import from `src/components/build-status/`.

- [ ] **Step 1: Create `BuildStatusPill.tsx`**

```tsx
// components/build-status/BuildStatusPill.tsx — status badge for
// BuildStatusEntry records. Follows the same variant-mapping pattern as
// components/ui/sev.tsx (SevBadge) — status colors are reserved for
// meaning, never reused as decoration.
import { Badge } from '@astryxdesign/core/Badge';
import { Text } from '@astryxdesign/core/Text';
import { HStack } from '@astryxdesign/core/HStack';
import type { BuildStatusEntry } from '../../types';

const STATUS_LABEL: Record<BuildStatusEntry['status'], string> = {
  built: 'Shipped',
  partial: 'Partial',
  gap: 'Still open',
  'not-started': 'Not started',
};

const STATUS_VARIANT: Record<BuildStatusEntry['status'], 'neutral' | 'info' | 'success' | 'warning' | 'error'> = {
  built: 'success',
  partial: 'warning',
  gap: 'error',
  'not-started': 'neutral',
};

export function BuildStatusPill({
  status,
  confidence,
}: {
  status: BuildStatusEntry['status'];
  confidence: BuildStatusEntry['confidence'];
}) {
  return (
    <HStack gap={1.5} vAlign="center">
      <Badge variant={STATUS_VARIANT[status]} label={STATUS_LABEL[status]} />
      {confidence !== 'high' && (
        <Text type="supporting" color="secondary">
          {confidence} confidence
        </Text>
      )}
    </HStack>
  );
}
```

- [ ] **Step 2: Create `BuildStatus.tsx`**

```tsx
// components/build-status/BuildStatus.tsx — per-product Build Status
// section. Renders what exxat-admin-workspace has actually shipped,
// grouped by feature area, filterable by persona. Populated by the
// build-status-sync automation — empty until the first automated run.
import { useState } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { TokenFilterRow } from '../ui/TokenFilterRow';
import { buildStatusForProduct } from '../../lib/selectors';
import { PERSONAS } from '../../data/personas';
import { BuildStatusPill } from './BuildStatusPill';
import type { BuildStatusEntry, BuildStatusProductId, PersonaId } from '../../types';

export function BuildStatus({ productId }: { productId: BuildStatusProductId }) {
  const [personaFilter, setPersonaFilter] = useState<string | undefined>(undefined);
  const entries = buildStatusForProduct(productId);

  if (entries.length === 0) {
    return (
      <Card variant="muted" padding={4}>
        <Text type="body" color="secondary">
          Not yet synced — no build-status data recorded for this product yet.
        </Text>
      </Card>
    );
  }

  const personasPresent = [...new Set(entries.flatMap((e) => e.personaIds))];
  const visible = personaFilter
    ? entries.filter((e) => e.personaIds.includes(personaFilter as PersonaId))
    : entries;

  const grouped = new Map<string, BuildStatusEntry[]>();
  for (const e of visible) {
    const list = grouped.get(e.featureArea) ?? [];
    list.push(e);
    grouped.set(e.featureArea, list);
  }

  return (
    <VStack gap={4}>
      {personasPresent.length > 0 && (
        <TokenFilterRow
          allLabel="All personas"
          value={personaFilter}
          onChange={setPersonaFilter}
          options={personasPresent.map((pid) => ({
            key: pid,
            label: PERSONAS.find((p) => p.id === pid)?.name ?? pid,
          }))}
        />
      )}

      {visible.length === 0 && (
        <Text type="body" color="secondary">
          Nothing built for this persona yet.
        </Text>
      )}

      {[...grouped.entries()].map(([featureArea, featureEntries]) => (
        <VStack key={featureArea} gap={2}>
          <Heading level={3}>{featureArea}</Heading>
          {featureEntries.map((entry) => (
            <Card key={entry.id} padding={4}>
              <VStack gap={2}>
                <HStack gap={2} vAlign="center" wrap="wrap">
                  <BuildStatusPill status={entry.status} confidence={entry.confidence} />
                  {entry.personaIds.map((pid) => (
                    <Token key={pid} label={PERSONAS.find((p) => p.id === pid)?.name ?? pid} color="purple" />
                  ))}
                </HStack>
                <Text type="body" as="p">{entry.summary}</Text>
                <Text type="supporting" color="secondary" as="p">User flow: {entry.userFlow}</Text>
                <Text type="supporting" color="secondary" as="p">Logic: {entry.functionalLogic}</Text>
                {entry.evidence.length > 0 && (
                  <HStack gap={2} wrap="wrap">
                    {entry.evidence.map((ev, idx) => (
                      <Link
                        key={idx}
                        href={`https://github.com/soleyromit/exxat-admin-workspace/blob/${ev.commit}/${ev.file}`}
                        isStandalone
                      >
                        {ev.file} @ {ev.commit.slice(0, 7)}
                      </Link>
                    ))}
                  </HStack>
                )}
                <Text type="supporting" color="secondary">Last checked {entry.lastCheckedAt}</Text>
              </VStack>
            </Card>
          ))}
        </VStack>
      ))}
    </VStack>
  );
}
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Wire into `ExamManagementView.tsx`**

Add the import (alongside the other `./exam/*` imports at the top):

```ts
import { BuildStatus } from '../../components/build-status/BuildStatus';
```

Add to the `SECTIONS` array (after the `'decisions'` entry):

```ts
  { id: 'build-status', label: 'Build Status' },
```

Add the render line (after `{section === 'decisions' && <Decisions />}`):

```tsx
      {section === 'build-status' && <BuildStatus productId={PRODUCT_ID} />}
```

- [ ] **Step 5: Wire into `CourseEvalView.tsx`**

Same pattern — add the import, append `{ id: 'build-status', label: 'Build Status' }` to `SECTIONS` (after the `'build'` entry), and add `{section === 'build-status' && <BuildStatus productId={PRODUCT_ID} />}` after the `{section === 'build' && <Build />}` line. `PRODUCT_ID` here is `'course-eval'`.

- [ ] **Step 6: Wire into `FaaSView.tsx`**

Same pattern — add the import, append `{ id: 'build-status', label: 'Build Status' }` to `SECTIONS` (after the `'decisions'` entry), and add the render line after the existing `{section === 'decisions' && (...)}` block. `PRODUCT_ID` here is `'faas'`.

- [ ] **Step 7: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 8: Visual verification with a temporary fixture**

Temporarily set `src/data/buildStatus.ts` to:

```ts
export const BUILD_STATUS: BuildStatusEntry[] = [
  {
    id: 'bs-em-question-bank-test', productId: 'exam-management', featureArea: 'Question Bank',
    status: 'built', confidence: 'high', personaIds: ['dce', 'program-director'],
    summary: 'Folder tree, bulk actions, filter sheet — feature-complete.',
    userFlow: 'Admin opens Question Bank, browses folder tree, filters by Bloom\'s level, bulk-assigns questions.',
    functionalLogic: 'Bulk move/duplicate/delete/assign all support undo.',
    relatedInsightIds: [], evidence: [{ file: 'apps/exam-management/admin/app/(app)/question-bank/qb-view.tsx', commit: 'abc1234', checkedAt: '2026-08-01' }],
    lastCheckedAt: '2026-08-01',
  },
];
```

Run: `npm run dev`, open the site, navigate to `/products/exam-management/spec`, click the new "Build Status" tab. Confirm: the Question Bank card renders with a green "Shipped" pill, the DCE + Program Director persona tokens, the persona filter row, and the evidence link. Click the persona filter to confirm it narrows the list. Repeat the tab check on `/products/course-eval/spec` and `/products/faas/spec` — confirm both show the "Not yet synced" empty state (since the fixture only targets `exam-management`).

- [ ] **Step 9: Revert the temporary fixture**

Edit `src/data/buildStatus.ts` back to `export const BUILD_STATUS: BuildStatusEntry[] = [];`.

- [ ] **Step 10: Commit**

```bash
git add src/components/build-status/BuildStatusPill.tsx src/components/build-status/BuildStatus.tsx \
  src/views/products/ExamManagementView.tsx src/views/products/CourseEvalView.tsx src/views/products/FaaSView.tsx
git commit -m "feat(build-status): add BuildStatus UI, wire into exam-management/course-eval/faas spec pages"
```

---

### Task 6: Portal page

**Files:**
- Create: `src/views/products/PortalView.tsx`
- Modify: `src/app/routes.tsx`

**Interfaces:**
- Consumes: `BuildStatus` (Task 5), `INTERNAL_TOOLS` (Task 2), `PageHeader` (`src/components/ui/PageHeader.tsx`, existing).
- Produces: route `/products/portal`.

- [ ] **Step 1: Create `PortalView.tsx`**

```tsx
// views/products/PortalView.tsx — Workspace Portal build-status page.
// Portal has no Granola-sourced research (internal tool, not a researched
// product), so this page shows only what's built — no gaps-from-research
// section, unlike the 5 researched products' spec pages.
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { PageHeader } from '../../components/ui/PageHeader';
import { BuildStatus } from '../../components/build-status/BuildStatus';
import { INTERNAL_TOOLS } from '../../data/internalTools';

const TOOL_ID = 'portal';

export function PortalView() {
  const tool = INTERNAL_TOOLS.find((t) => t.id === TOOL_ID);

  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title={tool?.name ?? 'Workspace Portal'}
        lede={tool?.description}
        meta={tool ? `Internal tool — ${tool.owner} · Users: ${tool.users}` : undefined}
      />
      <Text type="supporting" color="secondary" as="p">
        This page tracks what's actually shipped, synced automatically from
        exxat-admin-workspace. Portal has no Granola-sourced research corpus,
        so there's no gaps-from-research section here — just build status.
      </Text>
      <BuildStatus productId={TOOL_ID} />
    </VStack>
  );
}
```

- [ ] **Step 2: Register the route**

Open `src/app/routes.tsx`. Add this line to the `ROUTES` array, directly after the existing `/products/learning-contracts` row (line 43):

```ts
  { path: '/products/portal', label: 'Portal', section: 'products', productId: 'portal', component: v(() => import('../views/products/PortalView'), 'PortalView') },
```

- [ ] **Step 3: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Visual verification with a temporary fixture**

Temporarily set `src/data/buildStatus.ts` to:

```ts
export const BUILD_STATUS: BuildStatusEntry[] = [
  {
    id: 'bs-portal-connector-test', productId: 'portal', featureArea: 'Connector list home',
    status: 'built', confidence: 'high', personaIds: [],
    summary: 'App Store-style hub listing all 6 products with Open Admin CTAs.',
    userFlow: 'User lands on the portal home, sees a bordered card list of all products, clicks through to a product detail page.',
    functionalLogic: 'Per-product color palettes via CSS tokens; product detail pages use DS line-variant tabs (Overview/Resources/What\'s New).',
    relatedInsightIds: [], evidence: [{ file: 'apps/portal/app/page.tsx', commit: 'def5678', checkedAt: '2026-08-01' }],
    lastCheckedAt: '2026-08-01',
  },
];
```

Run: `npm run dev`, navigate to `/products/portal`. Confirm: the page header shows "Workspace Portal" with the internal-tool meta line, the explanatory text renders, and the Connector list home card shows with its green pill. Confirm no persona tokens render on the card (personaIds is `[]`) and no persona filter row appears (since `personasPresent` is empty for this fixture).

- [ ] **Step 5: Revert the temporary fixture**

Edit `src/data/buildStatus.ts` back to `export const BUILD_STATUS: BuildStatusEntry[] = [];`.

- [ ] **Step 6: Commit**

```bash
git add src/views/products/PortalView.tsx src/app/routes.tsx
git commit -m "feat(build-status): add Portal page at /products/portal"
```

---

### Task 7: Insight-level badge

**Files:**
- Modify: `src/components/insight/InsightDoc.tsx`

**Interfaces:**
- Consumes: `buildStatusForInsight` (Task 4), `BuildStatusPill` (Task 5).

- [ ] **Step 1: Add imports**

In `src/components/insight/InsightDoc.tsx`, add to the existing import block:

```ts
import { buildStatusForInsight } from '../../lib/selectors';
import { BuildStatusPill } from '../build-status/BuildStatusPill';
```

- [ ] **Step 2: Compute the matching entries**

In the `InsightDoc` function body, alongside the existing `const score = ...`, `const personas = ...` lines, add:

```ts
  const shipped = buildStatusForInsight(insight.id);
```

- [ ] **Step 3: Render the pills**

In the top `HStack` (currently `<SevBadge severity={insight.severity} /><ScoreTier breakdown={score} />`), add the pills after `ScoreTier`:

```tsx
          <HStack gap={2} vAlign="center" wrap="wrap">
            <SevBadge severity={insight.severity} />
            <ScoreTier breakdown={score} />
            {shipped.map((b) => (
              <BuildStatusPill key={b.id} status={b.status} confidence={b.confidence} />
            ))}
          </HStack>
```

(This replaces the existing `<HStack gap={2} vAlign="center">` opening tag with one that adds `wrap="wrap"`, since there can now be more badges than fit on one line.)

- [ ] **Step 4: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Visual verification with a temporary fixture**

Temporarily set `src/data/buildStatus.ts` to an entry with `relatedInsightIds: ['ins-em-001']` (reuse the Task 5 Step 8 fixture shape, changing `relatedInsightIds` to `['ins-em-001']`). Run `npm run dev`, navigate to `/insights/ins-em-001` (the multi-campus question sharing insight). Confirm the green "Shipped" pill renders next to the severity badge and score tier. Navigate to a different insight (e.g. `/insights/ins-em-002`) and confirm no pill renders there.

- [ ] **Step 6: Revert the temporary fixture**

Edit `src/data/buildStatus.ts` back to `export const BUILD_STATUS: BuildStatusEntry[] = [];`.

- [ ] **Step 7: Commit**

```bash
git add src/components/insight/InsightDoc.tsx
git commit -m "feat(build-status): show shipped/partial/gap pill on matching insights"
```

---

### Task 8: Sync skill

**Files:**
- Create: `.claude/skills/sync-build-status/SKILL.md`

**Interfaces:**
- Consumes: everything from Tasks 1–7 (this skill is the procedure that populates `BUILD_STATUS` going forward).

- [ ] **Step 1: Write the skill file**

```markdown
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
```

- [ ] **Step 2: Self-review against the design spec**

Read `docs/superpowers/specs/2026-08-01-build-status-sync-design.md` §2 side-by-side with the new `SKILL.md`. Confirm every procedural point in the spec (sync window, read-only fetch, product map incl. patient-log, persona inference, gate order, commit message format, `claude-container` push target, notification) has a corresponding line in the skill file. This is a manual read-through, not an automated check — there's no test for prose accuracy.

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/sync-build-status/SKILL.md
git commit -m "feat(build-status): add /sync-build-status skill"
```

---

### Task 9: LaunchAgent

**Files:**
- Create: `docs/build-sync-state.json`
- Create: `scripts/launchd/build-status-sync.sh`
- Create: `scripts/launchd/com.romit.rr-build-status-sync.plist`

**Interfaces:**
- Consumes: the `/sync-build-status` skill (Task 8).

- [ ] **Step 1: Create the initial state file**

```json
{
  "lastCheckedSha": null,
  "lastCheckedAt": null,
  "workspacePath": "/Users/romitsoley/Work"
}
```

Save as `docs/build-sync-state.json`.

- [ ] **Step 2: Create the sync script**

```sh
#!/bin/zsh
# build-status-sync.sh — headless weekday sync of rr-insights' BUILD_STATUS
# from exxat-admin-workspace (live at /Users/romitsoley/Work). Invoked by
# com.romit.rr-build-status-sync.plist, weekdays 10:07am, after the 9:00
# vault pull and 9:37 rr-insights-sync (no-collision offset pattern).
set -e
export PATH="/Users/romitsoley/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="/Users/romitsoley"

cd /Users/romitsoley/rr-insights

echo "── rr-insights build-status sync · $(date) ──"

claude -p "Run /sync-build-status. This is a HEADLESS scheduled run. Follow every rule in the skill exactly, including the read-only constraint on /Users/romitsoley/Work and the gate order before publishing. If nothing matched changed since the last check, make no changes and exit." \
  --permission-mode acceptEdits \
  --allowedTools "Bash(git fetch:*)" "Bash(git log:*)" "Bash(git show:*)" "Bash(git diff:*)" \
    "Bash(git add:*)" "Bash(git commit:*)" "Bash(git push:*)" "Bash(git status:*)" \
    "Bash(npx tsc:*)" "Bash(npx tsx:*)" "Bash(npm run build:*)" "Bash(find:*)" "Bash(grep:*)" "Bash(ls:*)" "Bash(cat:*)" \
  --max-turns 300

echo "── done · $(date) ──"
```

Save as `scripts/launchd/build-status-sync.sh`, then make it executable:

```bash
chmod +x scripts/launchd/build-status-sync.sh
```

- [ ] **Step 3: Syntax-check the script**

Run: `bash -n scripts/launchd/build-status-sync.sh`
Expected: no output, exit code 0 (a bash syntax check, catching typos before the first real scheduled fire).

- [ ] **Step 4: Create the plist**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<!--
  macOS launchd plist — weekday BUILD_STATUS sync from exxat-admin-workspace.

  Install (one-time):
    cp scripts/launchd/com.romit.rr-build-status-sync.plist ~/Library/LaunchAgents/
    launchctl load ~/Library/LaunchAgents/com.romit.rr-build-status-sync.plist

  Verify:   launchctl list | grep rr-build-status-sync
  Unload:   launchctl unload ~/Library/LaunchAgents/com.romit.rr-build-status-sync.plist
  Logs:     tail -f /tmp/rr-build-status-sync.log

  Cadence: weekdays 10:07am local — after the 9:00 exxat-vault-pull and 9:37
  rr-insights-sync (no-collision offset pattern). If the machine is asleep
  at fire time, launchd runs it on next wake.

  What it does: runs Claude Code headless with /sync-build-status — diffs
  exxat-admin-workspace commits since the last check, extracts user flow +
  functional logic for touched features, cross-references research,
  publishes to src/data/buildStatus.ts. Auto-pushes with no review gate
  (explicit design choice — see docs/superpowers/specs/2026-08-01-build-status-sync-design.md).
  Costs Claude API/plan usage on days where there is new material.
-->
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.romit.rr-build-status-sync</string>

    <key>ProgramArguments</key>
    <array>
        <string>/bin/zsh</string>
        <string>/Users/romitsoley/rr-insights/scripts/launchd/build-status-sync.sh</string>
    </array>

    <key>WorkingDirectory</key>
    <string>/Users/romitsoley/rr-insights</string>

    <key>StartCalendarInterval</key>
    <array>
        <dict><key>Weekday</key><integer>1</integer><key>Hour</key><integer>10</integer><key>Minute</key><integer>7</integer></dict>
        <dict><key>Weekday</key><integer>2</integer><key>Hour</key><integer>10</integer><key>Minute</key><integer>7</integer></dict>
        <dict><key>Weekday</key><integer>3</integer><key>Hour</key><integer>10</integer><key>Minute</key><integer>7</integer></dict>
        <dict><key>Weekday</key><integer>4</integer><key>Hour</key><integer>10</integer><key>Minute</key><integer>7</integer></dict>
        <dict><key>Weekday</key><integer>5</integer><key>Hour</key><integer>10</integer><key>Minute</key><integer>7</integer></dict>
    </array>

    <key>RunAtLoad</key>
    <false/>

    <key>StandardOutPath</key>
    <string>/tmp/rr-build-status-sync.log</string>

    <key>StandardErrorPath</key>
    <string>/tmp/rr-build-status-sync.err</string>

    <key>EnvironmentVariables</key>
    <dict>
        <key>PATH</key>
        <string>/Users/romitsoley/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin</string>
        <key>HOME</key>
        <string>/Users/romitsoley</string>
    </dict>
</dict>
</plist>
```

Save as `scripts/launchd/com.romit.rr-build-status-sync.plist`.

- [ ] **Step 5: Validate the plist**

Run: `plutil -lint scripts/launchd/com.romit.rr-build-status-sync.plist`
Expected: `scripts/launchd/com.romit.rr-build-status-sync.plist: OK`

- [ ] **Step 6: Commit**

```bash
git add docs/build-sync-state.json scripts/launchd/build-status-sync.sh scripts/launchd/com.romit.rr-build-status-sync.plist
git commit -m "feat(build-status): add LaunchAgent for weekday build-status sync"
```

(This task does NOT install the LaunchAgent — `launchctl load` is a local machine action for Romit to run himself, listed as a follow-up below, not part of this plan's automated steps.)

---

### Task 10: Final integration + docs

**Files:**
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: everything from Tasks 1–9.

- [ ] **Step 1: Run the full gate**

```bash
npx tsc --noEmit
npx tsx scripts/check-themes.ts
npx tsx scripts/check-build-status.ts
npm run build
```

Expected: all four pass cleanly. `check-themes.ts` passing confirms nothing in Tasks 1–9 accidentally touched `insights.ts`'s invariants; `check-build-status.ts` should report `OK: 0 build-status entries` (still empty, as designed).

- [ ] **Step 2: Update `CLAUDE.md`'s file-locations table**

In the "File locations" table near the top of `CLAUDE.md`, add two rows after the existing "Product registry" row:

```markdown
| Build status (shipped-vs-researched) | `src/data/buildStatus.ts` |
| Internal tools registry (Portal) | `src/data/internalTools.ts` |
```

And in the "How Claude syncs data (the loop)" section, add a line after the existing `/sync-sources` paragraph:

```markdown
**Build status** syncs separately via `/sync-build-status` (`.claude/skills/sync-build-status/`),
on its own weekday LaunchAgent — see `docs/superpowers/specs/2026-08-01-build-status-sync-design.md`.
It cross-references `exxat-admin-workspace` against this corpus for exam-management,
course-eval, faas, and portal; it never touches `insights.ts`.
```

- [ ] **Step 3: Verify the doc change doesn't break anything**

Run: `npx tsc --noEmit` (Markdown changes can't break TypeScript, but this confirms the working tree is otherwise clean before the final commit.)

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document build-status sync in CLAUDE.md"
```

---

## Follow-up (not part of this plan — for Romit, locally, after review)

1. `launchctl load ~/Library/LaunchAgents/com.romit.rr-build-status-sync.plist` (after copying the plist there) to activate the schedule.
2. First real run will use the 30-day bounded lookback (since `lastCheckedSha` starts `null`) — worth watching the first `/tmp/rr-build-status-sync.log` closely.
3. Consider a manual `/sync-build-status <product>` trigger mode later — explicitly out of scope for this plan (see design spec).
