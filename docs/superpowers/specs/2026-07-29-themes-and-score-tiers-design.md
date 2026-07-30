# Themes with Segments + Score Tiers — Design

**Date:** 2026-07-29
**Status:** Approved by Romit (in-session)

## Problem

1. The corpus has grown to 420 insights but the only thematic layer is the 7
   hand-seeded signals in `src/data/signals.ts`, which cover just 124 insights
   (30%) via seed IDs + fragile keyword matching. The Insight Index is an
   undifferentiated wall.
2. The opportunity score (`severity × evidence × persona`, max 36) collapses
   into 11 possible values with 65% of the corpus at 12 or 18. The UI renders
   the bare total (e.g. `24`), implying precision that doesn't exist and
   hiding the formula that would make it legible.

## Decisions (approved)

- **First-class themes**: ~12 curated themes covering the whole corpus, with a
  required `themeId` on every insight. One-time classification pass; future
  inserts maintained by `/sync-sources`.
- **Tiers + visible formula**: no change to scoring factors. Present tier
  (P0–P3) + inspectable breakdown (`4×3×2`) instead of a bare number.

## 1. Theme taxonomy — `src/data/themes.ts` (new)

```ts
export type ThemeId =
  | 'reporting-analytics' | 'config-debt' | 'form-experience'
  | 'accessibility' | 'ai-layer' | 'navigation-ia'
  | 'mobile-low-frequency' | 'skills-portability' | 'competitive'
  | 'integration-data' | 'platform-trust' | 'process-strategy';

export interface ThemeDef {
  id: ThemeId;
  title: string;
  description: string;   // one line, decision-oriented
  color: string;         // hex, follows SEV_COLORS conventions in taxonomy.ts
  relatedSignalIds: string[];  // links to SIGNAL_DEFS where overlap exists
}
export const THEMES: ThemeDef[];
export const getTheme: (id: ThemeId) => ThemeDef;
```

Draft themes (titles may be polished during classification):

| id | title | related signals |
|---|---|---|
| reporting-analytics | Reporting & analytics deficit | reporting |
| config-debt | Manual configuration debt | config-debt |
| form-experience | Form & survey experience | — |
| accessibility | Accessibility & accommodations | — |
| ai-layer | AI opportunity layer | ai-layer |
| navigation-ia | Navigation & information architecture | — |
| mobile-low-frequency | Mobile & low-frequency users | scce-underservice |
| skills-portability | Skills & competency portability | skills-entity |
| competitive | Competitive positioning | multicampus (partial) |
| integration-data | Integration & data flow | — |
| platform-trust | Platform trust & quality | overload (partial) |
| process-strategy | Process & strategy | — |

Rules:
- `Insight.themeId: ThemeId` is **required** (`src/types/index.ts`). TypeScript
  enforces 100% coverage — no keyword matching, no "unthemed" bucket.
- One theme per insight (primary theme). Signals remain the multi-membership
  strategic layer on top; they are not modified.
- Classification pass covers all 420 insights in `src/data/insights.ts`
  (both `INSIGHTS` and `NPS_INSIGHTS` arrays).
- `.claude/skills/sync-sources/SKILL.md` gains a step: every new insight gets a
  `themeId` chosen from `themes.ts`.

## 2. Segments in the UI

**Insight Index (`src/views/InsightIndexView.tsx`)**
- Theme chips join the product/persona chip row; `theme` URL param added to
  `parseInsightFilter`/`insightsWhere` in `src/lib/{links,selectors}.ts`.
- New view toggle: `flat` (current table) ↔ `themes` (grouped). Grouped mode
  renders one section per theme (ordered by summed score): header with count,
  severity mix, segment breakdown (per-product counts + persona chips), then
  the theme's top ~5 insights by score with a "view all N" link that flips to
  the flat view filtered to that theme.

**Product hubs (`src/views/products/`)**
- A "themes in this product" strip on each product view: theme counts scoped
  to that product, clickable through to the filtered Insight Index. Computed
  live from `ALL_INSIGHTS` — answers "what are the signals/themes per product"
  at a glance. Implemented once as a shared component
  (`src/components/insight/ThemeStrip.tsx` or similar) and dropped into the
  product hub layout.

**Insight document (`src/components/insight/InsightDoc.tsx`)**
- Shows its theme as a token linking to the theme-filtered index.

## 3. Score tiers — `src/data/taxonomy.ts` + `src/lib/score.ts`

```ts
// taxonomy.ts
export const SCORE_TIERS = [
  { tier: 'P0', min: 24, color: '#e8604a', meaning: 'Act now — top of the design queue' },
  { tier: 'P1', min: 18, color: '#f5a623', meaning: 'Next — schedule into upcoming sprints' },
  { tier: 'P2', min: 12, color: '#6d5ed4', meaning: 'Backlog — real but bounded value' },
  { tier: 'P3', min: 0,  color: '#8a8580', meaning: 'Watch — no near-term decision attached' },
] as const; // colors reuse the SEV_COLORS palette so severity and tier read as one system
```

- `ScoreBreakdown` gains `tier: 'P0'|'P1'|'P2'|'P3'`.
- Everywhere a bare total renders (InsightIndexView table, InsightDoc,
  SignalsView, OverviewView, StakeholderView, AnalyticsView, pce/Strategy),
  show a colored tier token with the formula beside it: **P0** `4×3×2`.
  A shared `ScoreTier` component avoids re-implementing per view.
- Sorting/ranking still uses the numeric total — order unchanged.
- Current distribution lands: P0 75 (18%), P1 124, P2 164, P3 57.

## 4. Verification

- `npm run build` — tsc fails if any insight lacks a valid `themeId`.
- Spot-check script (tsx, run ad hoc): every theme has ≥5 members; tier
  distribution matches the expected counts above; no theme is >40% of corpus.
- Visual check of grouped index, product strip, and tier tokens via dev server.

## Out of scope

- No changes to scoring factors or weights (no corroboration/breadth factors).
- No new standalone Themes page/route.
- No changes to signal definitions or SignalsView grouping logic.
- No CLAUDE.md corpus-count corrections beyond what this work touches.
