---
name: sync-sources
description: Sync rr-insights from Granola meetings + the Obsidian vault — find everything newer than the corpus anchor, synthesize insights, refresh the Performance Ledger, publish. Run when the user says "sync", "update from granola/obsidian", or when staleness meters show a product going quiet.
---

# Sync rr-insights from Granola + Obsidian

The corpus is only as good as its last sync. This skill makes the sync
deterministic: same inputs → same procedure → published update.

## 0. Establish the sync window

- Anchor = newest `createdAt` in `src/data/insights.ts` (grep the max, don't trust memory).
- Window = anchor → today. Everything below operates on this window only.

## 1. Pull the sources

**Granola** (MCP tools `mcp__claude_ai_Granola__*`):
- `list_meetings` with `time_range: custom` over the window.
- Work-relevant = Exxat products (Exam Management, Course Eval, FaaS, Skills,
  LC, Prism/platform), Arun 1:1s, design-system sessions, client/user calls.
- SKIP: UX Chats community, job search, portfolio mentoring, dating-app side
  projects, personal/immigration topics — never sync these (public site).
- For kept meetings: `query_granola_meetings` for synthesis; `get_meeting_transcript`
  ONLY when verbatim quotes are needed (Arun 1:1s, user interviews).

**Obsidian vault** at `~/Documents/research-repos`:
- `find ~/Documents/research-repos/{Meetings,Research,Decisions,Products} -name "*.md" -newermt <anchor>`
- Vault notes are the curated layer — prefer their summaries over raw
  transcripts; frontmatter `source: granola:<uuid>` links the two.

## 2. Synthesize new insights (src/data/insights.ts)

- Append to `INSIGHTS` following the existing shape exactly. Conventions:
  - id: `ins-<product-prefix>-<mon><dd>-NN` (see recent `ins-ce-jul28-*`)
  - `source`: `"<Session label> · <Mon DD> (<8-hex granola id>)"`
  - `createdAt`: the MEETING date (ISO), not today.
  - severity per the rubric in `src/data/taxonomy.ts`; personaIds/productIds required.
  - `soWhat` + `confidence` whenever the note supports them; `pullQuote` only
    for true verbatim quotes with `pullQuoteSource`.
- NO fabrication. If two sources conflict, record the conflict (see
  `COHERE_LAUNCH` in taxonomy.ts) instead of picking a side silently.
- Counts are DERIVED everywhere (productFacts/corpusFacts) — never edit
  declared numbers.

## 3. Refresh the Performance Ledger (if any Arun session in window)

`src/views/ArunPerformanceView.tsx`:
- Add a `REVIEW_TIMELINE` row per new Arun session (date, title, signal, note).
- Add verbatim quotes from the raw transcript ONLY — exact words, trimmed with
  ellipses at most; label the source date.
- Re-score criteria only where dated evidence changed; rationale must cite the
  session date. Keep the "self-scored, editorial" captions.
- PRIVACY GATE: this deploys to a public site. Never include immigration,
  visa, salary, or HR-paperwork content. Personal topics stay in the vault.

## 4. Product facts (src/data/products.ts + milestones)

- Update qualitative fields only when a meeting states them (status, launch
  dates, roadmapPhases labels, keyQuote). Milestone status derives from dates —
  never set `status` by hand.

## 5. Ship

1. `npx tsc --noEmit` → zero errors.
2. `npm run build` → green.
3. Visual spot-check in Chrome: the touched pages + Overview freshness strip
   (new insights should move the "last evidence" chips).
4. Bump `src/data/version.ts` (minor for data sync, patch for corrections) +
   add a `VERSION_HISTORY` entry in `src/data/personas.ts` naming sessions synced.
5. Commit on `main`, push to the `claude-container` remote (NOT origin — this
   machine's remote name differs; sync.sh's `git push origin main` will fail).
6. Verify the live bundle serves the new version before reporting done.

## Cadence

Run when asked, or proactively when `corpusFacts().last7d` is 0 while Granola
shows work meetings in the last week. For a standing cadence the user can say
"/loop weekly /sync-sources" in a session where Granola MCP is connected —
cloud/scheduled agents can't reach the local vault or the interactive Granola
connector, so this skill must run in a local session.
