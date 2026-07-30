# rr-insights self-audit (v19.3) — baseline for competitive analysis

## What it is
A single-researcher, agent-maintained research repository for Exxat product design
research, published as a public static site (GitHub Pages). Claude is the synthesis
engine: the `/sync-sources` pipeline reads Granola meeting notes/transcripts + an
Obsidian vault, synthesizes insights against a codified taxonomy, and publishes.
Weekly automated sync via launchd.

## Data model (strengths)
- **Insight as the atomic unit**: text, optional verbatim `pullQuote` + attributed
  source, session provenance, ISO capture date, `confidence`, and a `soWhat`
  (decision consequence) — every record argues for a decision, not just an observation.
- **Severity rubric codified in code** (`taxonomy.ts`): 4 written tests a grade must
  pass; regrades cite the rubric.
- **Evidence-class honesty**: DIRECT QUOTE / SYNTHESIS / HYPOTHESIS derived from the
  record shape — the UI labels claim strength everywhere.
- **Opportunity scoring** severity × evidence × persona → P0–P3 tiers with the
  formula rendered inline (no fake precision).
- **Three organizing layers**: 12 first-class themes (100% coverage, compiler-enforced),
  7 curated strategic signals (multi-membership, computed live), 5 products × 4 personas.
- **Derived-only counts**: every number in the UI is a live query (productFacts /
  corpusFacts); declared counts were deleted so drift is impossible.
- **Conflict records**: contested facts (e.g. COHERE_LAUNCH date) stored as both
  claims + owner + status instead of silently picking a side.
- **Link contract**: every aggregate number links to the query that produces it;
  every filter state is a shareable URL.

## Views (27)
Command Center (freshness strip, deadline pressure), Insight Index (URL-synced
filters, flat + by-theme grouped views), Signals board, Knowledge Graph, Charts /
Analytics, Personas + persona friction, Participants (real voices), Product hubs
(theme strip, severity mix, evidence feed, spec pages), Roadmap (date-axis
milestones), Competitive parity, Briefings (computed, zero static prose), NPS
deep-dive, Changelog, Arun performance ledger.

## Pipeline
Granola MCP + Obsidian vault → Claude synthesis (taxonomy rules, no-fabrication,
conflict surfacing) → version bump → git push → live in ~60s. Privacy gate for
public publishing.

## Honest gaps (vs. commercial repositories)
1. **No raw-data layer**: transcripts live in Granola, not in the repo; insights
   cite sessions but a reader cannot click through to the source span. No
   highlight-level provenance (time-coded spans), no video/audio clips.
2. **No in-product editing**: the only write path is Claude editing TypeScript.
   Fine for one researcher + agent; excludes collaborators.
3. **Search is insight-only**: full-text over 420 synthesized records, not over
   the underlying 76 sessions.
4. **No ask-the-repository interface**: querying beyond filters means asking
   Claude in a coding session, not a product surface.
5. **No collaboration primitives**: comments, reactions, review states, access
   control, stakeholder follows/subscriptions — none.
6. **No participant/research-ops layer**: no consent tracking, no recruiting, no
   incentive management, no participant CRM (Participants view is display-only).
7. **No video**: the highest-empathy artifact class (clips, reels) is absent.
8. **Single-tenant, public-only**: no private/team spaces.
9. **Duplicate-ID hygiene**: 7 duplicated insight ids exist in the corpus today.
