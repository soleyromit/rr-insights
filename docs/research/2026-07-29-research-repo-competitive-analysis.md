# Research Repository Market — Competitive Analysis & Feature Opportunities for rr-insights

**Date:** July 29, 2026 · **Method:** 4 parallel web-research passes (product pages, changelogs, G2/Capterra, comparison articles) + self-audit of rr-insights v19.3 (`2026-07-29-rr-insights-audit.md`)

---

## 1. The landscape in one paragraph

The category has split into three camps. **Platform incumbents** (Dovetail, and EnjoyHQ before UserTesting shelved it into maintenance mode) sell governed, taxonomy-heavy repositories to enterprises and are racing to bolt AI on top. **Human-centered analysis tools** (Condens, Aurelius, Looppanel) keep the researcher in the loop and win on ergonomics, price, and a specific analysis model. **AI-native platforms** (Marvin, Notably, Insight7, Great Question, and the AI-moderator cluster led by Strella) collapse collection → analysis → repository into one AI loop. Everyone now has auto-theming and chat-with-your-corpus; the 2026 battleground is *grounding quality* (citations, provenance), *one-click deliverables*, and *agentic access* (MCP, Slack bots, autonomous digest agents).

## 2. What makes each product unique

| Product | The one thing it's known for | Second differentiator | Notable weakness |
|---|---|---|---|
| **Dovetail** | Most complete repository: Projects (episodic) + **Channels** (always-on feedback streams with longitudinal theme tracking) | Magic AI family + **AI Agents** (autonomous watchers/digests), Ask Dovetail in Slack/Teams | Tagging overhead; AI feels bolted-on; Free→Enterprise pricing cliff |
| **Marvin** | Live-call capture: bot joins the call, AI notes in real time, stakeholder observation room | AI-moderated interviews (40+ languages); agentic Ask AI; Salesforce write-back; MCP server | Transcription/speaker-attribution errors; intimidating setup |
| **Condens** | Whiteboard affinity mapping natively wired to highlights/tags | **Artifacts + Insights Magazine**: curated stakeholder hub with engagement analytics; 85+ languages; cheap | Upload-centric (no meeting bot); whiteboard usability |
| **EnjoyHQ** | Two-layer **taxonomy governance** (researcher tags/properties vs. small stakeholder label set) | Feedback-pipeline breadth (tickets, app reviews, NPS) | Effectively maintenance-mode under UserTesting; weak reporting |
| **Notably** | AI-native canvas: highlights as sticky notes, AI clustering by theme/sentiment/journey stage | Posty assistant; custom AI templates (JTBD, personas) | Small vendor; bugs; AI-credit metering; thin integrations |
| **Aurelius** | **Key Insights → Recommendations** chain: every action links to an insight, every insight to evidence | Collections across projects; 180+ language transcription | Best features gated at $199+/mo; tagging UX; small community |
| **Looppanel** | **Notes-by-question grid**: AI notes auto-assigned to your discussion-guide questions | Research Reels (every note = video clip); best-in-class transcription; Insight Wizard | Wrong-question clustering is its top complaint; $395/mo floor |
| **Great Question** | All-in-one research ops: recruiting + scheduling + incentives + repository + AI moderation | **MCP server** (run/analyze studies from Claude/Cursor); Study Synthesis with inline citations | Breadth over depth; you pay for the whole suite |
| **Insight7** | Cheapest bulk interview analysis ($99/mo); auto journey maps | Pivoted toward CX call-scoring — ambiguous for research buyers | AI accuracy complaints; rough visuals |
| **Strella** (adjacent threat) | AI-moderated voice interviews with real-time synthesis — collapses moderation + analysis | $14M Series A; Amazon/Duolingo logos | Usage-priced; new category, unproven long-term |

## 3. Where the bar has moved (2025–2026)

1. **Auto-theming is table stakes; grounded citations are the differentiator.** Winners tie every theme to verbatim quotes (Great Question Study Synthesis) or guide questions (Looppanel); losers ship hallucination-prone clusters.
2. **Chat-with-your-corpus is universal** (Ask Dovetail, Ask AI, Posty, Ask Sev). New axes: corpus scale per query, stakeholder surfaces (Slack/Teams bots), and templated conversations.
3. **The output is a deliverable, not a workspace**: one-click reports, executive summaries, highlight reels, journey maps.
4. **Agentic access is the 2026 frontier**: MCP servers (Great Question, Marvin, Condens), Slack @-mention search, and autonomous agents that watch streams and push digests (Dovetail AI Agents).
5. **Always-on streams** join episodic studies: support tickets, NPS, app reviews with longitudinal theme trending (Dovetail Channels).
6. Multi-language at scale (60–185 languages), enterprise trust (PII redaction, SOC2), and AI moderation converging with analysis.

## 4. Audit: where rr-insights stands

**Genuinely ahead of the commercial tools** (nobody in the market does these):

- **Decision-forced records**: every insight carries `soWhat` (the decision consequence) and a severity graded against a *written rubric in code* — commercial tools grade nothing.
- **Evidence-class honesty**: DIRECT QUOTE / SYNTHESIS / HYPOTHESIS derived from record shape and labeled everywhere. Closest analogue is GQ's citation-grounding, but no tool types the claim strength itself.
- **Opportunity scoring with visible math** (P0–P3 tiers + `4×2×3` formula) — no commercial repo ranks insights at all.
- **Conflict records**: contested facts stored as competing claims with owner + status. Unique in the market.
- **Derived-only counts and the link contract** (every number is a clickable query) — repositories routinely drift; rr-insights cannot.
- **Agent-maintained pipeline**: Claude *is* the synthesis engine — rr-insights is already the "agentic repository" the market is inching toward, at $0/seat vs. $99–$395/user/mo.

**Behind the market** (the real gaps, in rough order of pain):

| Gap | Who sets the bar |
|---|---|
| G1. No highlight-level provenance — insights cite sessions, not spans; one `pullQuote` max | Looppanel (note→clip), GQ (inline citations), Dovetail highlights |
| G2. No ask-the-repository surface for stakeholders | Ask Dovetail, Posty, Ask AI in Slack |
| G3. No recommendations/decision-status layer — `soWhat` is a string, not a trackable object | Aurelius Recommendations |
| G4. No always-on streams — NPS was a one-off import; no ticket/review trending | Dovetail Channels |
| G5. No push/digest — insights wait to be visited | Dovetail AI Agents, Marvin newsletters |
| G6. Search covers 420 synthesized insights, not 76 raw sessions | Everyone (transcript search is baseline) |
| G7. No video/audio clips (Granola is text-first) | Looppanel Reels, Condens reels |
| G8. Single-player: no comments, review states, or access control | All |

## 5. Feature recommendations — what to implement

Filtered for what actually fits rr-insights' architecture (static site + code-as-data + Claude-as-engine). Effort: S ≈ one session, M ≈ 2–3 sessions, L ≈ a project.

### Tier 1 — do these; high leverage, architecture-native

1. **MCP server over the corpus** *(M — closes G2, rides trend #4)*. Expose `insightsWhere`, themes, signals, scores, and conflict records as MCP tools. Anyone with Claude/Cursor gets grounded ask-the-repo Q&A with citations to insight IDs — matching Ask Dovetail without building a chat UI. Great Question proved MCP-as-consumption-surface in Mar 2026; rr-insights' data layer is already pure TypeScript functions, so this is mostly plumbing.
2. **Evidence spans** *(M — closes G1, trend #1)*. Extend `Insight` with `evidence: {excerpt, sessionId, speaker?}[]` — multiple verbatim spans per insight, not one optional pullQuote. `/sync-sources` captures them at synthesis time (the transcripts are already being read). InsightDoc gets an evidence drawer; evidence-class grading gets stronger ground truth. This is the single biggest credibility upgrade.
3. **Recommendations as first-class objects** *(M — closes G3, Aurelius' best idea)*. `recommendations.ts`: id, text, linked insight IDs, owner, status (`proposed → aligned → approved → shipped/rejected`). This also solves an insight already in the corpus — ins-process-001 explicitly asks to track design-decision status (verbal-aligned / Vishaka-approved / in-prototype) to prevent rework. A Decisions view becomes the bridge from research to roadmap.
4. **Weekly digest artifact** *(S — closes G5)*. The Monday sync already computes what changed; emit a `briefings`-style "This week in research" page (new insights by theme/tier, staleness alerts, open conflicts, stale recommendations) and optionally post the link to Slack. Dovetail charges Enterprise for this; here it's a template in the existing pipeline.

### Tier 2 — worth doing after Tier 1

5. **Streams (Channels-lite)** *(M–L — closes G4)*. Recurring imports (NPS waves, support-ticket CSVs, app reviews) as a `streams.ts` layer with theme trending over time — "config-debt mentions per month" style charts. The NPS 2025 one-off import proved the value; make it repeatable.
6. **Taxonomy health view** *(S)*. Surface `check-themes` in the UI: theme sizes/drift, tag orphans, duplicate insight IDs (7 exist today), evidence-class mix per theme. EnjoyHQ's governance lesson at zero cost.
7. **Conflict queue** *(S)*. Generalize `COHERE_LAUNCH` into `conflicts.ts` + an "Open conflicts" view (claim A vs B, owner, age). Doubles down on a genuinely unique differentiator.
8. **Session-level search** *(M — closes G6)*. Index Granola transcripts locally (minisearch) into a **private** search surface — gated or local-only, since the public site must respect the privacy gate.

### Explicitly not recommended

- **Video reels / clip infrastructure** — Granola is text-first; the empathy payoff doesn't justify building media storage into a static site.
- **AI-moderated interviews / recruiting-ops** (Strella/GQ territory) — different product.
- **Multi-user editing, comments, RBAC** — the single-researcher + agent model is the point; revisit only if the team grows.

## 6. Positioning takeaway

rr-insights shouldn't chase Dovetail — it should lean into being what the market is converging toward but can't ship cleanly: an **agent-native, evidence-honest, decision-forcing repository**. The four Tier-1 features (MCP access, evidence spans, recommendation tracking, weekly digest) each extend an existing strength, cost little, and together close the credibility and consumption gaps that actually matter for a solo researcher publishing to stakeholders.

---
*Research agents' raw findings preserved in session transcripts; key sources: dovetail.com/blog (2025 Spring/Fall launches), heymarvin.com (Dec 2025 updates), condens.io/ai, aureliuslab.com/pricing, looppanel.com/release-notes, greatquestion.co changelog, insight7.io, strella.io, G2/Capterra review pages.*
