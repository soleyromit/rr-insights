# Themes with Segments + Score Tiers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all 420 insights a first-class theme (12 themes, required `themeId`), surface theme-grouped/segmented browsing in the UI, and replace bare opportunity scores with P0–P3 tiers + the visible formula.

**Architecture:** New `src/data/themes.ts` registry + required `themeId` on `Insight` (compile-time coverage guarantee). UI derives all theme groupings live from `ALL_INSIGHTS` (same pattern as signals). Tiers are a presentation mapping over the unchanged score in `lib/score.ts`.

**Tech Stack:** React 19 + TypeScript + Astryx components + react-router. No test framework — verification is `npx tsc --noEmit`, `npm run lint`, and `npx tsx` check scripts.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-29-themes-and-score-tiers-design.md`.
- Astryx rules from CLAUDE.md: no raw `<div>` layout, no `style={{}}`, tokens only. Use existing components (`Token`, `HStack`, `VStack`, `Text`, `StatTile`).
- Scoring factors/weights unchanged; sort order everywhere still uses numeric total.
- Signals (`signals.ts`, SignalsView) unmodified.
- Git identity: soleyromit@gmail.com / Romit Soley. Commit per task.
- Tier colors reuse the severity palette: P0 `#e8604a`, P1 `#f5a623`, P2 `#6d5ed4`, P3 `#8a8580`.

---

### Task 1: Theme registry + optional themeId + score tiers (data layer)

**Files:**
- Create: `src/data/themes.ts`
- Modify: `src/types/index.ts:8-13` (Insight), `src/data/taxonomy.ts`, `src/lib/score.ts`

**Interfaces:**
- Produces: `ThemeId` union, `ThemeDef`, `THEMES: ThemeDef[]`, `getTheme(id): ThemeDef | undefined`, `SCORE_TIERS`, `tierOf(total: number): ScoreTierDef`, `ScoreBreakdown.tier: TierId`.
- `Insight.themeId?: ThemeId` — optional in this task; Task 3 makes it required.

- [ ] **Step 1: Create `src/data/themes.ts`**

```ts
// data/themes.ts — first-class theme taxonomy (spec 2026-07-29).
// Every insight carries exactly one themeId; coverage is enforced by the type
// system, not keyword matching. Signals stay the multi-membership strategic
// layer on top (signals.ts, unchanged).
export type ThemeId =
  | 'reporting-analytics' | 'config-debt' | 'form-experience'
  | 'accessibility' | 'ai-layer' | 'navigation-ia'
  | 'mobile-low-frequency' | 'skills-portability' | 'competitive'
  | 'integration-data' | 'platform-trust' | 'process-strategy';

export interface ThemeDef {
  id: ThemeId;
  title: string;
  description: string;        // one line, decision-oriented
  color: string;
  relatedSignalIds: string[]; // SIGNAL_DEFS ids where the layers overlap
}

export const THEMES: ThemeDef[] = [
  { id: 'reporting-analytics', title: 'Reporting & analytics deficit',
    description: 'Self-serve reports, dashboards, and accreditation-ready exports users cannot produce today.',
    color: '#e8604a', relatedSignalIds: ['reporting'] },
  { id: 'config-debt', title: 'Manual configuration debt',
    description: 'Excel workflows, hand-typed tags, manual ID sync, and support-ticket configuration.',
    color: '#d97706', relatedSignalIds: ['config-debt'] },
  { id: 'form-experience', title: 'Form & survey experience',
    description: 'Form building, validation timing, preview/simulation, question types, and form length.',
    color: '#6d5ed4', relatedSignalIds: [] },
  { id: 'accessibility', title: 'Accessibility & accommodations',
    description: 'WCAG/ADA compliance, accommodation profiles, and assistive-tech support.',
    color: '#2ec4a0', relatedSignalIds: [] },
  { id: 'ai-layer', title: 'AI opportunity layer',
    description: 'Confirmed AI use cases and the everywhere-it-helps-never-in-the-way principle.',
    color: '#16a34a', relatedSignalIds: ['ai-layer'] },
  { id: 'navigation-ia', title: 'Navigation & information architecture',
    description: 'Click depth, inconsistent paths, sidebar/role navigation, and question-bank IA.',
    color: '#3b82f6', relatedSignalIds: [] },
  { id: 'mobile-low-frequency', title: 'Mobile & low-frequency users',
    description: 'One-tap clinical workflows and SCCE/preceptor surfaces that must work without relearning.',
    color: '#0ea5e9', relatedSignalIds: ['scce-underservice'] },
  { id: 'skills-portability', title: 'Skills & competency portability',
    description: 'Program-level skill entities vs placement-scoped records; procedure and competency tracking.',
    color: '#e87ab5', relatedSignalIds: ['skills-entity'] },
  { id: 'competitive', title: 'Competitive positioning',
    description: 'ExamSoft/Canvas/D2L/Blackboard/Watermark gaps, displacement plays, and market strategy.',
    color: '#8b7ff5', relatedSignalIds: ['multicampus'] },
  { id: 'integration-data', title: 'Integration & data flow',
    description: 'LMS/CSV import, cross-system sync, and multi-system fragmentation.',
    color: '#f5a623', relatedSignalIds: [] },
  { id: 'platform-trust', title: 'Platform trust & quality',
    description: 'NPS signals, regressions, false positives, and reliability that erodes user trust.',
    color: '#dc2626', relatedSignalIds: ['overload'] },
  { id: 'process-strategy', title: 'Process & strategy',
    description: 'Roadmaps, team process, tooling, governance, and vision decisions.',
    color: '#8a8580', relatedSignalIds: [] },
];

const byId = new Map(THEMES.map(t => [t.id, t]));
export const getTheme = (id: string): ThemeDef | undefined => byId.get(id as ThemeId);
```

- [ ] **Step 2: Add optional `themeId` to `Insight` in `src/types/index.ts`**

```ts
import type { ThemeId } from '../data/themes';
// in interface Insight:
  themeId?: ThemeId;  // Task 3 removes the `?`
```

(If importing from `../data/themes` into `types/index.ts` creates a cycle —
`themes.ts` must NOT import from `types` — keep `themes.ts` dependency-free as
written above, so the import is safe.)

- [ ] **Step 3: Add `SCORE_TIERS` + `tierOf` to `src/data/taxonomy.ts`**

```ts
// P7 presentation tiers: the score's 11 possible values cluster (65% of the
// corpus lands on 12 or 18), so ranks render as tiers + visible formula, never
// a bare number pretending to be continuous.
export type TierId = 'P0' | 'P1' | 'P2' | 'P3';
export interface ScoreTierDef { tier: TierId; min: number; color: string; meaning: string; }
export const SCORE_TIERS: ScoreTierDef[] = [
  { tier: 'P0', min: 24, color: '#e8604a', meaning: 'Act now — top of the design queue' },
  { tier: 'P1', min: 18, color: '#f5a623', meaning: 'Next — schedule into upcoming sprints' },
  { tier: 'P2', min: 12, color: '#6d5ed4', meaning: 'Backlog — real but bounded value' },
  { tier: 'P3', min: 0,  color: '#8a8580', meaning: 'Watch — no near-term decision attached' },
];
export const tierOf = (total: number): ScoreTierDef =>
  SCORE_TIERS.find(t => total >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1];
```

- [ ] **Step 4: Thread tier through `src/lib/score.ts`**

```ts
import { tierOf } from '../data/taxonomy';
import type { TierId } from '../data/taxonomy';
// ScoreBreakdown gains: tier: TierId;
// in scoreInsight return: tier: tierOf(total).tier,
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean (themeId is still optional, nothing else breaks).

- [ ] **Step 6: Commit**

```bash
git add src/data/themes.ts src/types/index.ts src/data/taxonomy.ts src/lib/score.ts
git commit -m "feat(themes): theme registry, optional themeId, P0-P3 score tiers (data layer)"
```

---

### Task 2: Classify all 420 insights

**Files:**
- Modify: `src/data/insights.ts` (every object in `INSIGHTS` and `NPS_INSIGHTS`)
- Create: `scripts/check-themes.ts`

**Interfaces:**
- Consumes: `ThemeId` from Task 1.
- Produces: every insight literal gains `themeId:'<theme>',` placed immediately after `tags:[...]`.

Classification rubric — read each insight's text/tags/soWhat and apply the
FIRST matching rule (executor judgment resolves genuine ties toward the
insight's primary decision):

1. **accessibility** — WCAG, ADA, accommodation profiles, alt text, magnification, contrast, TTS/narrator, on-screen keyboard, extra time.
2. **ai-layer** — tag `ai`, or the claim is about an AI feature/principle (question gen, predictors, theme extraction, anticipatory AI).
3. **platform-trust** — NPS results/themes, regressions (color-coding loss, V3 click-depth), compliance false positives, satisfaction/trust signals.
4. **skills-portability** — skills entity scoping, procedure minimums, competency vs skill models, student-initiated evaluations.
5. **mobile-low-frequency** — mobile/clock-in UX, preceptor/SCCE surfaces, reviewer dashboards, form-length-discourages-preceptors.
6. **reporting-analytics** — reports, dashboards, analytics layers, historical trending, monster grids, custom reports.
7. **config-debt** — manual/Excel configuration, hand-typed tags, ID sync, self-service config absent, template-first entry (config workflows).
8. **integration-data** — CSV/LMS import, cross-system data flow, three-system fragmentation, API hops, document storage.
9. **form-experience** — form building/validation/preview, question types/layouts, survey/template builder UX, PCE workflow mechanics.
10. **navigation-ia** — navigation, click paths, sidebar/role models, question-bank IA, flat tagging/smart views, dual-axis architecture, versioning IA.
11. **competitive** — competitor comparisons/strategy (ExamSoft, Canvas, D2L, Blackboard, Watermark), market/KKR/TAM, displacement pricing, multi-campus vs competitors.
12. **process-strategy** — roadmap/timeline, sprints, team/governance, tooling (Claude Code), design-system process, PM-hat expectations.

- [ ] **Step 1: Write `scripts/check-themes.ts` (the failing test)**

```ts
// scripts/check-themes.ts — corpus invariants for the theme taxonomy.
// Run: npx tsx scripts/check-themes.ts   (exit 1 on violation)
import { ALL_INSIGHTS } from '../src/data/insights';
import { THEMES, getTheme } from '../src/data/themes';
import { scoreInsight } from '../src/lib/score';

let fail = 0;
const err = (m: string) => { console.error('FAIL:', m); fail = 1; };

const missing = ALL_INSIGHTS.filter(i => !i.themeId || !getTheme(i.themeId));
if (missing.length) err(`${missing.length} insights without a valid themeId: ${missing.slice(0, 10).map(i => i.id).join(', ')}${missing.length > 10 ? ', …' : ''}`);

const counts = new Map<string, number>();
for (const i of ALL_INSIGHTS) counts.set(i.themeId ?? '?', (counts.get(i.themeId ?? '?') ?? 0) + 1);
for (const t of THEMES) {
  const n = counts.get(t.id) ?? 0;
  if (n < 5) err(`theme ${t.id} has only ${n} members (<5)`);
  if (n > ALL_INSIGHTS.length * 0.4) err(`theme ${t.id} has ${n} members (>40% of corpus)`);
}

const tiers = new Map<string, number>();
for (const i of ALL_INSIGHTS) { const t = scoreInsight(i).tier; tiers.set(t, (tiers.get(t) ?? 0) + 1); }
console.log('theme counts:', Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1])));
console.log('tier counts:', Object.fromEntries(tiers));
if (!fail) console.log('OK:', ALL_INSIGHTS.length, 'insights, all themed.');
process.exit(fail);
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx tsx scripts/check-themes.ts`
Expected: FAIL with "420 insights without a valid themeId".

- [ ] **Step 3: Classify — edit `src/data/insights.ts` in batches**

For each insight object, insert `themeId:'<theme>',` immediately after the
`tags:[...]` property, applying the rubric above. Work in batches of ~40
(the file is one insight per line); re-run the check script after each batch
to watch the missing count fall. Keep a consistent property position so the
file stays greppable.

- [ ] **Step 4: Run the check to verify it passes**

Run: `npx tsx scripts/check-themes.ts`
Expected: `OK: 420 insights, all themed.` plus theme/tier count tables. If a
theme lands <5 members, reassign borderline insights per rubric precedence or
flag for the executor to merge judgment — do not delete insights.

- [ ] **Step 5: Commit**

```bash
git add src/data/insights.ts scripts/check-themes.ts
git commit -m "feat(themes): classify all 420 insights into 12 themes"
```

---

### Task 3: Make `themeId` required

**Files:**
- Modify: `src/types/index.ts` (drop the `?`), `.claude/skills/sync-sources/SKILL.md`

**Interfaces:**
- Produces: `Insight.themeId: ThemeId` (required) — the compile-time coverage guarantee later tasks rely on.

- [ ] **Step 1: Remove the `?` from `themeId` in `src/types/index.ts`**

```ts
  themeId: ThemeId;
```

- [ ] **Step 2: Verify the compiler accepts the whole corpus**

Run: `npx tsc --noEmit`
Expected: clean. Any error names an insight literal missed in Task 2 — fix it there.

- [ ] **Step 3: Update `.claude/skills/sync-sources/SKILL.md`**

Add to the insight-synthesis step (wherever new insight objects are authored):

```markdown
- Every new insight MUST include `themeId` chosen from `src/data/themes.ts`
  (12 themes; pick the single primary theme per the rubric in
  docs/superpowers/plans/2026-07-29-themes-and-score-tiers.md, Task 2).
  `npx tsx scripts/check-themes.ts` must pass before publishing.
```

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts .claude/skills/sync-sources/SKILL.md
git commit -m "feat(themes): themeId required on Insight; sync-sources maintains it"
```

---

### Task 4: ScoreTier component + tier rendering in index and doc

**Files:**
- Create: `src/components/ui/ScoreTier.tsx`
- Modify: `src/views/InsightIndexView.tsx:232-241` (Score column), `src/components/insight/InsightDoc.tsx:25,40`

**Interfaces:**
- Consumes: `scoreInsight` (with `.tier`), `SCORE_TIERS`/`tierOf` from Task 1.
- Produces: `<ScoreTier breakdown={ScoreBreakdown} showFormula?: boolean />`.

- [ ] **Step 1: Create `src/components/ui/ScoreTier.tsx`**

```tsx
// components/ui/ScoreTier.tsx — tier + inspectable formula, never a bare number.
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { tierOf } from '../../data/taxonomy';
import type { ScoreBreakdown } from '../../lib/score';

const TIER_TOKEN_COLOR: Record<string, 'red' | 'orange' | 'purple' | 'default'> = {
  P0: 'red', P1: 'orange', P2: 'purple', P3: 'default',
};

export function ScoreTier({ breakdown, showFormula = true }: { breakdown: ScoreBreakdown; showFormula?: boolean }) {
  const def = tierOf(breakdown.total);
  return (
    <HStack gap={1.5} vAlign="center" title={def.meaning}>
      <Token label={breakdown.tier} color={TIER_TOKEN_COLOR[breakdown.tier]} />
      {showFormula && (
        <Text type="supporting" hasTabularNumbers>{breakdown.label}</Text>
      )}
    </HStack>
  );
}
```

(Check `npx astryx component Token` for the exact `color` prop values; if
`red`/`orange`/`purple` are not valid Token colors, use the nearest supported
set and keep the mapping in one place here.)

- [ ] **Step 2: Use it in `InsightIndexView` Score column**

Replace the Score column (`renderCell` currently rendering `{r.score}`) with:

```tsx
{
  key: 'score',
  header: 'Priority',
  width: pixel(130),
  renderCell: (r: Row) => <ScoreTier breakdown={scoreInsight(r.insight)} />,
},
```

Change the `Row` mapping to keep `score: scoreOf(i)` (still used for nothing
else — safe to leave) and import `scoreInsight` + `ScoreTier`. Header text
changes from "Score" to "Priority".

- [ ] **Step 3: Use it in `InsightDoc`**

Where line 40 renders `opportunity {score.label}` replace with:

```tsx
<ScoreTier breakdown={score} />
```

keeping surrounding layout components as they are.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean build.

- [ ] **Step 5: Visual check**

Run: `npm run dev` (background), open `/insights` and one insight document.
Expected: Priority column shows e.g. **P0** `4×3×2 = 36`; sort order unchanged
(still numeric total). Kill the dev server after.

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/ScoreTier.tsx src/views/InsightIndexView.tsx src/components/insight/InsightDoc.tsx
git commit -m "feat(tiers): P0-P3 tier + visible formula replaces bare scores"
```

---

### Task 5: Theme filter in the query contract (links + selectors)

**Files:**
- Modify: `src/lib/links.ts:7-20,30-46,55-68`, `src/lib/selectors.ts:41-76`

**Interfaces:**
- Consumes: `getTheme` from Task 1.
- Produces: `InsightFilter.theme?: string`, honored by `parseInsightFilter`, `hrefInsights`, `insightsWhere`.

- [ ] **Step 1: Add `theme` to the filter contract in `links.ts`**

In `InsightFilter` add `theme?: string;`. In `parseInsightFilter` add
`theme: get('theme'),`. In `hrefInsights` qs add `theme: f.theme,`.

- [ ] **Step 2: Honor it in `selectors.ts` `insightsWhere`**

After the `f.signal` block:

```ts
  if (f.theme) list = list.filter((i) => i.themeId === f.theme);
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/lib/links.ts src/lib/selectors.ts
git commit -m "feat(themes): theme filter in the URL/query contract"
```

---

### Task 6: Insight Index — theme chips + grouped-by-theme view

**Files:**
- Modify: `src/views/InsightIndexView.tsx`

**Interfaces:**
- Consumes: `THEMES`/`getTheme`, `theme` filter (Task 5), `sumScores`, `ScoreTier`.
- Produces: `view` URL param (`flat` default | `themes`).

- [ ] **Step 1: Theme chips in the chip row**

After the `PERSONAS.map` Tokens add:

```tsx
{THEMES.map((t) => (
  <Token
    key={t.id}
    label={t.title}
    color={theme === t.id ? 'teal' : 'default'}
    onClick={() => set('theme', theme === t.id ? undefined : t.id)}
  />
))}
```

with `const { product, persona, severity, signal, tag, theme, since, until } = filter;`.

- [ ] **Step 2: View toggle**

Read `const view = params.get('view') === 'themes' ? 'themes' : 'flat';` and add
next to the Sort control:

```tsx
<SegmentedControl label="View" value={view} onChange={(v) => set('view', v === 'flat' ? undefined : v)} size="sm">
  <SegmentedControlItem value="flat" label="flat" />
  <SegmentedControlItem value="themes" label="by theme" />
</SegmentedControl>
```

- [ ] **Step 3: Grouped rendering**

When `view === 'themes'`, replace the `<Table>` + `<Pagination>` block with a
theme-section list computed from the SAME `filtered` array (so all chips/search
still apply):

```tsx
const themeGroups = useMemo(() => {
  const by = new Map<string, Insight[]>();
  for (const i of filtered) { const l = by.get(i.themeId) ?? []; l.push(i); by.set(i.themeId, l); }
  return THEMES
    .map((t) => ({ theme: t, insights: by.get(t.id) ?? [] }))
    .filter((g) => g.insights.length > 0)
    .sort((a, b) => sumScores(b.insights) - sumScores(a.insights));
}, [filtered]);
```

Each group renders (Astryx components only):

```tsx
<VStack key={g.theme.id} gap={2}>
  <HStack gap={2} vAlign="baseline" hAlign="between" wrap="wrap">
    <HStack gap={2} vAlign="baseline">
      <Text type="heading3">{g.theme.title}</Text>
      <Text type="supporting">{g.insights.length} insights · {g.insights.filter((i) => i.severity === 'critical').length} critical</Text>
    </HStack>
    <Link href={hrefInsights({ ...filter, theme: g.theme.id })}>view all {g.insights.length}</Link>
  </HStack>
  <Text type="supporting">{g.theme.description}</Text>
  {/* segments: per-product counts + persona chips */}
  <HStack gap={1.5} wrap="wrap">
    {PRODUCTS.filter((p) => g.insights.some((i) => i.productIds.includes(p.id))).map((p) => (
      <Token key={p.id} label={`${p.shortName} ${g.insights.filter((i) => i.productIds.includes(p.id)).length}`}
        onClick={() => set('product', p.id)} />
    ))}
    {PERSONAS.filter((pe) => g.insights.some((i) => (i.personaIds ?? []).includes(pe.id))).map((pe) => (
      <Token key={pe.id} label={pe.name} color="purple"
        onClick={() => set('persona', pe.id)} />
    ))}
  </HStack>
  {/* top 5 by score; List/Item pattern, not Cards */}
  {g.insights.slice(0, 5).map((i) => (
    <HStack key={i.id} gap={2} vAlign="center">
      <SevDot severity={i.severity} />
      <Link href={hrefInsight(i.id)}><Text type="body" maxLines={1}>{i.text}</Text></Link>
      <ScoreTier breakdown={scoreInsight(i)} showFormula={false} />
    </HStack>
  ))}
</VStack>
```

`filtered` is already score-sorted by default so `slice(0, 5)` is top-by-score;
the "view all" link carries the current filter plus the theme and lands on the
flat view. Astryx self-check applies: run `npx astryx component List` — if
`List`/`Item` fits better than the `HStack` rows, use it.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Visual check**

`npm run dev`: `/insights?view=themes` shows ordered theme sections with
segment chips; clicking a product chip inside a group filters; "view all"
lands on flat view filtered to the theme; chips + search still compose.

- [ ] **Step 6: Commit**

```bash
git add src/views/InsightIndexView.tsx
git commit -m "feat(themes): grouped-by-theme index view with product/persona segments"
```

---

### Task 7: Per-product theme strip + theme on insight doc

**Files:**
- Create: `src/components/insight/ThemeStrip.tsx`
- Modify: `src/views/products/ProductPage.tsx` (below the `StatTileRow`, ~line 157), `src/components/insight/InsightDoc.tsx`

**Interfaces:**
- Consumes: `THEMES`, `insightsWhere` (with `product` + `theme`), `hrefInsights`, `getTheme`.
- Produces: `<ThemeStrip productId={string} />`.

- [ ] **Step 1: Create `src/components/insight/ThemeStrip.tsx`**

```tsx
// components/insight/ThemeStrip.tsx — "what are the themes in this product",
// computed live, every count links to the query that produces it (link contract).
import { HStack } from '@astryxdesign/core/HStack';
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { THEMES } from '../../data/themes';
import { insightsWhere } from '../../lib/selectors';
import { hrefInsights } from '../../lib/links';

export function ThemeStrip({ productId }: { productId: string }) {
  const groups = THEMES
    .map((t) => ({ t, n: insightsWhere({ product: productId, theme: t.id }).length }))
    .filter((g) => g.n > 0)
    .sort((a, b) => b.n - a.n);
  if (!groups.length) return null;
  return (
    <VStack gap={2}>
      <Text type="heading3">Themes in this product</Text>
      <HStack gap={1.5} wrap="wrap">
        {groups.map(({ t, n }) => (
          <Link key={t.id} href={hrefInsights({ product: productId, theme: t.id })}>
            <Token label={`${t.title} · ${n}`} />
          </Link>
        ))}
      </HStack>
    </VStack>
  );
}
```

- [ ] **Step 2: Drop into `ProductPage` below the StatTileRow**

```tsx
<ThemeStrip productId={productId} />
```

- [ ] **Step 3: Theme token on `InsightDoc`**

Near the evidence/score meta row, add:

```tsx
<Link href={hrefInsights({ theme: insight.themeId })}>
  <Token label={getTheme(insight.themeId)?.title ?? insight.themeId} />
</Link>
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean. Dev-server check: a product page shows the strip; clicking a
theme token lands on `/insights?product=…&theme=…`.

- [ ] **Step 5: Commit**

```bash
git add src/components/insight/ThemeStrip.tsx src/views/products/ProductPage.tsx src/components/insight/InsightDoc.tsx
git commit -m "feat(themes): per-product theme strip + theme token on insight doc"
```

---

### Task 8: Final verification + version bump

**Files:**
- Modify: `src/data/version.ts` (follow its existing entry format — read it first)

- [ ] **Step 1: Full gate**

Run: `npx tsx scripts/check-themes.ts && npx tsc --noEmit && npm run lint && npm run build`
Expected: all clean; check script prints 12 theme counts (each ≥5, none >40%)
and tier counts ≈ P0 75 / P1 124 / P2 164 / P3 57.

- [ ] **Step 2: Bump version**

Add a changelog entry in `src/data/version.ts` in its established shape
describing: 12-theme taxonomy with required themeId (420 classified), grouped
index view with segments, per-product theme strips, P0–P3 tiers with visible
formula.

- [ ] **Step 3: Commit**

```bash
git add src/data/version.ts
git commit -m "feat(v19.3): theme taxonomy with segments + P0-P3 score tiers"
```
