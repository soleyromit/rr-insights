# PRODUCT.md — rr-insights (Insight Hub)

Durable product truth for design work. Read by Impeccable commands and any AI session working on this repo. Visual world lives in DESIGN.md.

## What this is

An internal research intelligence platform for Romit Soley, sole Product Designer across 5 Exxat products (Exam Management, FaaS 2.0, PCE/Course Eval, Skills Checklist, Learning Contracts). It synthesizes 73+ Granola sessions, stakeholder interviews, whiteboards, and NPS data into platform signals, persona evidence, and design briefs. Deployed at soleyromit.github.io/rr-insights.

## Users and jobs

1. **Romit (daily)** — open the repo, know what to design next and why, exit into Magic Patterns with an evidence-backed brief. Success: open → actionable brief in ≤3 clicks.
2. **Exxat stakeholders (Arun, Vishaka, Kunal, Aarti; ~5 min)** — scan the defended arguments, verify evidence, leave with a briefing. Aarti's format: 3 sentences maximum.
3. **Recruiters / hiring managers (8 sec → 2 min)** — scale signals and systems-thinking proof, exit to a portfolio case study.

## Position and mechanism

Not a dashboard, not a wiki: a research narrative. The differentiator is the drill-down contract (Signal → Evidence Set → Insight Card → Action) computed live from a structured insight corpus (`src/data/insights.ts`: tags, severity, products, personas, confidence, sources). Connections are computed, never hand-written prose.

## Durable constraints

- **Evidence-first**: every claim carries a source (session + date) and an evidence class (DIRECT QUOTE / SYNTHESIS / HYPOTHESIS). Never invent evidence.
- **Domain vocabulary is verbatim**: CAPTE, ACOTE, CCNE, ARC-PA, CSWE, CAAHEP, CPI, FWPE, DCE, SCCE. The UI uses the users' words.
- **Chart discipline**: every chart states the decision it supports in its caption; a chart that cannot is cut.
- **Writing rules**: no em dashes anywhere; never "straightforward", "genuinely", "honestly".
- **Non-AI-looking**: the product must not read as AI-generated. Impeccable detector runs on changed files before every push.
- Personal/portfolio content (Arun Performance, case studies) stays in the Outputs layer, never in stakeholder paths.

## Platform

web (desktop-first; Vite + React SPA on GitHub Pages, base `/rr-insights/`). Deploy: push to main → GitHub Actions → live in ~60s. Build must pass `npm run build` locally before push.

## Information architecture (UX Audit v1, Jul 2026)

Four layers: The Story (Command Center, Connect the Dots) → Evidence (Signals, Persona Atlas, Competitive Parity, Source Library) → Products (5) → Outputs (Briefings, Portfolio + Deliverables). Migration phases P3–P6 shipped (v14.0–v16.0); P7 shipped v17.0 (scoring engine, insight-as-document, live briefings); P8–P9 remain on the Benchmark backlog. Pre-audit deep specs live on -spec routes and in the collapsed Archive.

## Data integrity rules (v15.1, extended v17.0)

- **Severity is graded against a written rubric** (`src/data/taxonomy.ts`): four levels with testable definitions. v17.0 regraded 195 insights; a grade that cannot cite its rubric line reverts.
- **Priority is a scored matrix, not a sorted list**: opportunity score = severity × evidence class × persona priority (`src/lib/score.ts`), formula rendered wherever it ranks.

- **State is derived, never positional**: phase/milestone state comes from parseable dates compared to today; undated items render as unscheduled and claim nothing.
- **No invented numbers**: a percentage or progress value must trace to data or be removed; estimates are labeled as estimates in the UI.
- **Conflicts are surfaced, not resolved silently**: when two sources disagree (see Cohere below), the UI shows both and names the confirmation owner.
- **Single source of truth per fact**: dates, counts, and statuses live once in `src/data` and are computed everywhere else. Hand-copied constants caused the v15.0 misinterpretations.

## Open decisions

- ExxatOne: register as a sixth product or fold into platform signals.
- **Cohere date conflict**: milestones data says Aug 2026 (hard deadline); product plan (pilotDate, roadmap phases, v11 notes) says Sep 2026. Both claims now live once in `COHERE_LAUNCH` (`src/data/taxonomy.ts`); the UI renders Aug conservatively and flags the conflict. Confirm with Arun and correct the constant.
- Product `daysToDeadline` (176d) tracks planned launch Jan 20, 2027, not the next hard deadline; labels now say so.
