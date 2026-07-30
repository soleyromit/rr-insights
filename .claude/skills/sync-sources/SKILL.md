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
  - `themeId` REQUIRED (compile fails without it): the single primary theme from
    `src/data/themes.ts` (12 themes). Pick by the insight's primary decision, not
    keyword surface — e.g. an AI feature → `ai-layer`, a dashboard spec →
    `reporting-analytics`, a competitor gap → `competitive`. After appending,
    `npx tsx scripts/check-themes.ts` must pass before publishing.
  - `soWhat` + `confidence` whenever the note supports them; `pullQuote` only
    for true verbatim quotes with `pullQuoteSource`.
  - `sentiment`: grade `'positive' | 'negative' | 'mixed'` from the source
    material's tone about the product (not the meeting mood); omit when unclear.
    Powers the valence trend in Analytics.
  - `evidence`: capture 1–3 VERBATIM spans per insight as
    `evidence:[{excerpt:'…', source:'Speaker · session'}]` while the transcript
    is in context — this is highlight-level provenance and upgrades the
    insight's evidence class to DIRECT QUOTE. Never paraphrase into an excerpt;
    if no verbatim span exists, omit the field.
- NO fabrication. If two sources conflict, add an entry to
  `src/data/conflicts.ts` (both claims, owner, what it blocks, evidence
  insightIds) instead of picking a side silently. Resolve entries by setting
  `status:'resolved'` + `resolution` — never delete them.
- BACKFILL while you're there: whenever a session transcript is loaded for
  synthesis, also add `evidence` spans to EXISTING insights from that same
  session that lack them (grep insights.ts for the session id). This is how the
  evidence-debt floors in Analytics rise over time.
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

**Automated**: `com.romit.rr-insights-sync` LaunchAgent (installed from
`scripts/launchd/`) runs this skill headless every Monday 9:37am, after the
9:00 vault pull refreshes the Obsidian mirror. Headless runs are VAULT-ONLY
(no interactive Granola connector) and skip the Chrome visual check — tsc +
build are the gate. Logs: `/tmp/rr-insights-sync.log`.

**Manual**: run `/sync-sources` in any local session — with Granola MCP
connected you also get transcripts for verbatim quotes, which the headless
run can't fetch; prefer a manual run after important Arun 1:1s.
