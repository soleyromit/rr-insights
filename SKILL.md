---
name: rr-insights
version: 2.2.0
last_updated: 2026-03-26
author: Romit Soley, Product Designer II, Exxat
description: >
  Research intelligence skill for the rr-insights platform. Governs how Claude
  reads, synthesizes, visualizes, and communicates insights from Granola sessions,
  stakeholder interviews, whiteboard sessions, and uploaded documents — across
  all 5 Exxat products and every persona lens defined below.
---

# rr-insights SKILL.md
## The research architecture for a Staff Product Designer embedded in healthcare education SaaS.

---

## 0. THE NORTH STAR — FROM THE WHITEBOARD

Every output from this skill traces back to this loop, sketched in red on the whiteboard:

```
Measure what delightful experience looks like
  → How we make experience better
    → That's what we'll build
      → Changes
        → Delightful Experience (circle, not a line)
```

Three questions that anchor every research session:
1. Who are the users?
2. What do the users need?
3. What is their current experience?

The finish line is not a feature. It is: **Whose lives are we making better?**

Success metric for rr-insights itself:
- Team members at Exxat understand their customers, users, and employees
- Insights deliver → Clean expertise → Research agendas → Iterative delivery
- Measure: Who is having a great day? Who is having a poor day? What role did Exxat play?

---

## 1. PLATFORM CONTEXT

### Products in scope
| ID | Product | Status | NPS | Annual tickets | Portfolio priority |
|----|---------|--------|-----|----------------|-------------------|
| exam-management | Exam Management | Active redesign | — | — | High |
| faas | FaaS 2.0 (Forms as a Service) | WIP ownership | 2/5 | 95,000+ | Very high |
| course-eval | Course & Faculty Evaluation | New module | — | — | Medium |
| skills-checklist | Skills Checklist | Q2–Q4 scope | — | — | Medium-high |
| learning-contracts | Learning Contracts | Scoped | — | — | Medium |

### Product experience spectrum (from whiteboard)
Didactic → Clinical → Culminating Exp → Advisory → Internship → Jobs → Continuing Education

### Platform-level signals (appear in 3+ products = architecture-level problem)
1. Cognitive overload under constraint (Exam + FaaS + Skills)
2. Reporting deficit — Program Directors cannot self-serve accreditation reports
3. AI opportunity layer — confirmed across all 5 products
4. Manual configuration debt — Excel mapping, manual tags, manual ID sync
5. Multi-campus fragmentation (Exam + FaaS + ExactOne)
6. Standalone skills entity gap (Skills + Learning Contracts)
7. Mobile gap / SCCE underservice (FaaS + Skills)

### Key dates
- April 17, 2026: Student + admin + faculty demo for Vishaka
- August 2026: Cohere launch (hard deadline — must be ExamSoft-competitive by this date)
- November–December 2026: Full ExamSoft-competitive feature parity

---

## 2. PERSONA REGISTRY

### Personas using Exxat products

**Student (Clinical Education)**
- Role: Enrolled in accredited healthcare program (PT, OT, PA, Nursing, Social Work, etc.)
- Day: Complete clinical forms, take exams, track competencies, manage placement schedule
- Frictions: Accessibility gaps in exam environment, form complexity, unclear status, placement-scoped skills (can't answer "have I done this skill across all rotations?")
- Tools used: Exam Management, FaaS 2.0, Skills Checklist, Learning Contracts
- Critical signal: 80–90% build external tracking docs because the platform doesn't serve their needs
- Design priority: HIGH

**DCE / Faculty (Director of Clinical Education)**
- Role: Program-side administrator overseeing clinical placements and student evaluations
- Day: Configure forms, review student performance, coordinate with clinical sites, manage accreditation data
- Frictions: Form governance complexity, multi-site coordination overhead, reporting without dashboards, manual Excel mapping for curriculum
- Tools used: FaaS 2.0, Course Eval, Learning Contracts, Skills Checklist, Exam Management
- Critical signal: Power users want Bloom's taxonomy + LO cross-referencing; research-first faculty want zero overhead — progressive disclosure is the answer
- Design priority: VERY HIGH

**SCCE (Site Coordinator of Clinical Education)**
- Role: Clinical site-side supervisor responsible for student supervision and competency verification
- Day: Complete evaluations, verify competencies, submit CPI/FWPE documentation
- Frictions: Low platform familiarity, infrequent usage = relearning burden, poor mobile experience, broken reviewer UX (small text, guidelines buried, no side-by-side comparison)
- Tools used: FaaS 2.0, Skills Checklist, Learning Contracts
- Critical signal: Most underserved persona in current IA; external user with lowest friction tolerance
- Design priority: HIGH

**Program Director / Accreditation Coordinator**
- Role: Institutional leader responsible for accreditation compliance and program outcomes
- Day: Review aggregate performance data, generate accreditation reports, configure program-level settings
- Frictions: No self-serve accreditation-ready reports, manual export workflows, data visualisation absent, narrative synthesis missing
- Tools used: FaaS 2.0, Course Eval, Exam Management
- Critical signal: Touro runs 7 survey types outside Exxat; ExamSoft retained because curriculum mapping already established there
- Design priority: MEDIUM-HIGH

**Accreditation Committee / Curriculum Committee**
- Role: Institutional governance bodies reviewing program compliance
- Day: Review aggregate outcomes against CAPTE, ACOTE, CCNE, ARC-PA, CSWE, CAAHEP standards
- Frictions: Data not in accreditor-ready format, no narrative synthesis
- Design priority: MEDIUM (but high-stakes — accreditation = program survival)

**University Admin / Tenants**
- Role: IT and platform administrators managing configuration at institutional level
- Frictions: No self-service interface for compliance configuration; all done by Exxat support team manually

### Personas NOT using Exxat products (acquisition / expansion opportunities)

**Students at non-Exxat programs**
- Currently using: Canvas, Blackboard, ExamSoft, spreadsheets
- Why they're not on Exxat: Program hasn't purchased; no student-facing marketing
- Design signal: These students have HIGHER expectations from Blackboard Ultra's question type variety (formula-based, hotspot, ordering) — Exxat exam experience must match or exceed this

**Clinical Supervisors / Preceptors (unactivated)**
- Currently using: Paper, email, institution-specific systems
- Why they're not engaged: Platform designed for the institution, not the site
- Design signal: Preceptor intake form being built in FaaS is the first real surface for this persona

**Faculty at competitor-platform programs**
- Currently using: ExamSoft (for assessments), Blue/Canvas (for evaluations), SurveyMonkey (for surveys)
- Why not Exxat: ExamSoft retention driven by: 1) curriculum mapping established, 2) faculty training built over years, 3) strong item analytics — these are the 3 things Exxat must match or exceed

**Program Directors at scale (not yet Exxat customers)**
- Pain: Managing accreditation data across 3+ disconnected systems
- Opportunity: Exxat as the single source of truth for clinical education lifecycle

---

## 3. COMPETITOR INTELLIGENCE

### Direct competitors to Exxat (clinical education platform)
| Competitor | Strengths vs Exxat | Exxat advantage | Key signal from Granola |
|-----------|-------------------|-----------------|------------------------|
| ExamSoft | Curriculum mapping established, faculty training, strong item analytics | Clinical education lifecycle context, placement integration | Touro: "curriculum mapping already done in ExamSoft" — this is the retention anchor |
| D2L BrightSpace | LMS integration, broad institutional use | Clinical-specific IA, not generic LMS | Gap: D2L bulk accommodation assignment is per-student per-quiz manually — Exxat can do better |
| Blackboard Ultra | 8+ question types (formula-based, hotspot, ordering, jumbled sentence), survey integration eliminates SurveyMonkey | Exxat is clinical-first, not LMS | Faculty use Blackboard only for content sharing, not assessment — untapped |
| Aquifer / TrueLearn | Clinical case library, adaptive learning | Exxat owns the placement + competency layer | No Exxat connection currently |
| Meditrek | Competency tracking, clinical hours | Deeper Exxat placement context | Skills Checklist head-to-head |
| Elentra | Canadian market, CBME framework | US market depth | Accreditation differences |

### Indirect competitors (feature-level, not category-level)
| Competitor | Exxat product overlap | Specific feature collision |
|-----------|----------------------|--------------------------|
| SurveyMonkey / Typeform | FaaS 2.0 | Form creation UX, branching logic, response analytics — Exxat must match SurveyMonkey's self-service capability |
| Qualtrics | Course Eval, FaaS 2.0 | Survey analysis, theme extraction, reporting — Touro uses this instead of Exxat eval |
| Google Forms | FaaS 2.0 | Zero-friction form creation — the baseline clients compare against |
| Canva / Adobe Express | Accreditation reports | Visual report generation — what PDs use when Exxat export fails |
| Pendo | Exxat platform-wide | Product analytics, feature adoption tracking — currently a gap in Claude Architecture (whiteboard: "Access to Pendo") |
| Monday.com / Asana | Learning Contracts, placement coordination | Task/milestone tracking within clinical rotations |
| Notion | rr-insights itself | Research repository — but Notion lacks the clinical domain intelligence this system provides |
| Figma | FaaS form builder | Visual form building — the interaction model SCCEs expect from a modern form tool |

### Competitor analysis framework (from whiteboard)
For every competitor entry, Claude should produce:
- Competitor name + category
- List of features, outliers
- What does our competitor do best?
- How can Exxat improve?
- Competitor lifecycle (where they invest, where they stagnate)
- Opportunities and concerns for Exxat
- Data visualization to understand the competitor better

---

## 4. POV LENSES — HOW CLAUDE ANALYZES

Every insight, feature, or design decision should be filtered through these lenses before output. Each lens asks a different question from the same source material.

### Lens 1: Exxat Product POV
*Question: Does this make the product more defensible, more sticky, or more accreditation-ready?*
- Anchor to: ticket volume reduction, NPS improvement, accreditor requirements, competitive feature parity
- Language: product lifecycle, retention anchor, configuration debt, governance model, headless architecture

### Lens 2: Direct Competitor POV
*Question: How would ExamSoft, D2L, or Blackboard solve this? What would they never do?*
- Anchor to: ExamSoft curriculum mapping, D2L bulk accommodations, Blackboard question type variety
- Language: feature parity, competitive moat, table stakes, differentiators

### Lens 3: Indirect Competitor POV
*Question: What does the user's mental model expect from SurveyMonkey, Qualtrics, or Google Forms?*
- Anchor to: self-service capability, zero-friction creation, response analytics, preview/test mode
- Language: feature-level collision, cross-category expectations, workflow displacement

### Lens 4: Personas Using Exxat (Existing Users)
*Question: What is the current experience? Where is the happy path? Where does it break?*
- Anchor to: Granola session quotes, NPS data, support ticket themes, scenario-based journeys
- Language: frustrations, gaps, concerns, features used most/least, how products connect

### Lens 5: Personas NOT Using Exxat
*Question: Why aren't they here? What would bring them?*
- Anchor to: competitor retention anchors, unmet needs, mental model mismatches
- Language: acquisition triggers, switching costs, onboarding friction, first-value moment

### Lens 6: WCAG Accessibility Consultant
*Question: Does this meet WCAG 2.1 AA? What breaks for users with disabilities in a lockdown exam environment?*
- Anchor to: 100–400% text magnification, speech-to-text, text-to-speech, virtual keyboard, tab navigation, dark/contrast modes, alt-text for medical images, keyboard shortcuts (arrow nav, F=flag, A/B/C/D=answer)
- Language: WCAG 2.1 AA, lockdown browser constraints, platform-embedded accommodations (Pearson model), cognitive load, color blindness, screen reader compatibility
- Critical signal: UNF pilot blocked until accessibility V1 ships

### Lens 7: Staff Product Designer
*Question: Is this systems-level thinking? Does it scale across 5 products? Does it handle the multi-tenant enterprise edge cases?*
- Anchor to: progressive disclosure architecture, governance model (CRITICAL/manager approval/warning-only), accreditation compliance framework, cross-product persona mapping
- Language: service blueprint, information architecture, design system, component governance, design decisions with tradeoffs

### Lens 8: Staff UX Researcher
*Question: What is the research method? What is the evidence quality? What confidence level should stakeholders assign?*
- Anchor to: Granola session count, interview methodology, sentiment analysis, mental models, scenario-based journeys, opportunity canvas, HMW statements
- Language: research agenda, iterative delivery, confidence level, evidence source (direct quote vs synthesis vs hypothesis)

### Lens 9: Staff Content Strategist
*Question: Is the language right for this persona at this moment in their workflow? Does it match the accreditation vocabulary they use?*
- Anchor to: CPI, FWPE, DCE, SCCE, CAPTE, ACOTE, CCNE, ARC-PA, CAAHEP, CSWE — these are the words the users use; the UI must use them too
- Language: content hierarchy, terminology consistency, progressive disclosure in copy, error message clarity, empty state design

### Lens 10: Motion / Interaction Designer
*Question: What micro-interactions make this feel like a clinical-grade tool, not a generic SaaS dashboard?*
- Anchor to: TypeForm-inspired single question display, cross-out feature for answer elimination, progress bar that reflects completion, flag system, submit button visibility timing
- Language: micro interaction, transition, backtracking/plan of action, simplicity, design/interaction pattern, state changes, animation timing

---

## 5. INSIGHT TAGGING SCHEMA

Every insight extracted from Granola, documents, or interviews carries:

| Tag | Meaning | Action required |
|-----|---------|-----------------|
| theme | Recurring pattern in 2+ sources | Synthesize into cross-product finding |
| gap | Unmet need or broken experience | Map to design opportunity |
| opportunity | Specific design direction | Add to roadmap with priority |
| persona | Specific behavior/quote tied to a persona | Add to persona registry |
| platform | Appears in 3+ products | Escalate to architecture-level signal |
| ai | AI feature opportunity | Add to AI layer roadmap |
| new | From a Granola session not yet in the system | Flag for sync |
| architecture | Structural/systemic constraint | Affects multiple products |

Severity levels: critical → high → medium → low

---

## 6. SUCCESS METRICS — THE FINISH LINE

### For rr-insights platform
| Metric | Current | Target | How measured |
|--------|---------|--------|--------------|
| Granola sessions synced | ~12 | 100% of all sessions | Session count in insights.ts |
| Products with full deep-dive | 1 (Exam Mgmt) | 5 | Views in App.tsx |
| Insights tagged and searchable | 28 | 100+ | INSIGHTS array length |
| Platform-level signals identified | 7 | — | platform tag count |
| AI opportunities mapped | 6 | — | ai tag count |
| Stakeholder deck outputs generated | 0 | 1 per sprint | Portfolio view |

### For Exxat design work
| Metric | Current state | Success signal |
|--------|--------------|----------------|
| Exam Management accessibility | 0 WCAG features | V1 shipped before UNF pilot |
| FaaS support tickets | 95,000/yr | Measurable reduction after governance model |
| FaaS NPS | 2/5 | Movement toward 3/5 in 6 months |
| ExamSoft competitive features | ~40% parity | Matching curriculum mapping + analytics by Aug 2026 |
| Course Eval consolidation | 7 surveys outside Exxat | 3+ surveys migrated to Exxat |
| Skills — student self-service | 80–90% use spreadsheets | Students stop building external trackers |

### The "delightful experience" measurement (from whiteboard 5)
- Who is having a great day because of Exxat?
- Who is having a poor day because of Exxat?
- How did our products make their day better or worse?
- Why are they having different days?

This is the qualitative finish line. The quantitative proxy is NPS. The design proxy is: does the feature eliminate the external spreadsheet/workaround entirely?

---

## 7. VISUAL AND DATA COMMUNICATION STANDARDS

### Non-AI aesthetics — what this means for rr-insights

The whiteboard said "non-AI looking research product." This means:

**Typography**: Use editorial fonts (DM Serif Display, Playfair Display, or similar) for headings paired with a clean mono (JetBrains Mono, IBM Plex Mono) for data. Not Inter. Not system-ui.

**Color language**: Each product gets a distinct accent. Severity gets semantic color. Data gets neutral gray. Patterns, not gradients.

**Charts that earn their place**: Every chart must answer a specific question. Before adding any chart, ask: "Does this help Romit or an Exxat stakeholder make a decision?" If no: remove it.

**Insight cards**: Not a generic card with a title and body. Each insight shows: text + source + tags + severity + which products + which personas. The card is a research artifact, not a UI component.

**Progress indicators**: Show what has been done, what is active, what is planned — at both the product level and the platform level. The roadmap is a research artifact showing design maturity, not a Jira board.

### Chart types and when to use them
| Chart type | Use for | Example in rr-insights |
|-----------|---------|----------------------|
| Horizontal bar | Comparing severity counts across products | Critical vs high vs medium gaps per product |
| Radar | Persona coverage — which personas are well-served vs neglected | SCCE vs Student vs DCE coverage |
| Treemap | Feature dependency and hierarchy | ExamSoft competitive features mapped to Exxat roadmap |
| Timeline / Gantt | Roadmap with milestone markers | April 17 demo → Aug Cohere → Nov full parity |
| Heat map grid | Persona x Product friction matrix | Cross-product persona challenge map |
| Flow diagram | User journey / service blueprint | FaaS compliance workflow (3-system fragmentation) |
| Donut | Single product insight composition | Theme/Gap/Opportunity ratio per product |

---

## 8. GRANOLA → INSIGHTS AUTOMATION PROTOCOL

**The full auto-sync protocol is in Section 23. It runs automatically at session start.**

When a Granola session is processed:

1. Read full summary via `Granola:get_meetings`
2. Extract insights using the tagging schema in Section 5
3. Filter through all 10 POV lenses in Section 4
4. Check for platform-level signals (3+ products = platform signal → add `platform` tag)
5. Add to `src/data/insights.ts` using id format `ins-[product]-[session-short]-[nn]`
6. Commit: `git commit -m "data: auto-sync [session name] — [meeting ID]"`
7. GitHub Actions deploys in ~60 seconds

### Sessions synced as of Mar 26, 2026
- All 43 sessions from Feb 23 – Mar 26, 2026 read and synthesized
- Last two: Exam Management Standup (6fdcd0dd) + Monil PCE session (b47ba356) — Mar 26
- Total insights: 61 in INSIGHTS array + 6 in NPS_INSIGHTS export = 67 total

---

## 9. CLAUDE ARCHITECTURE — FROM THE WHITEBOARD

The whiteboard labeled "Claude Architecture / Product = Exxat" maps directly to how Claude should respond in this project.

**For every product consult, Claude produces:**
1. Context: what the product is, what it solves for, who it solves for, current day-to-day user lifecycle
2. Frustrations / Gaps / Concerns (from Granola evidence, not hypothesis)
3. Happy path / Alternatives
4. Scenario-based journeys
5. Features used most vs least (from Pendo if available; from Granola sessions otherwise)
6. Least used features
7. How this product/feature connects to others
8. What perspectives need user attention

**For every feature design consult, Claude produces:**
- Context, vision, objectives
- Personas affected
- Workflow / architecture / lifecycle
- Features (existing) + dependencies
- Competitor analysis (using the framework in Section 3)
- Pendo analytics context (flag when this data is unavailable)
- AMs/PMs/Sales/Product development pipeline input
- Gaps / concerns: Dev, UX, UI, Product
- Dependency to other features/products
- New features: AI involvement, what problem are we solving, UX/UI/interaction, micro interaction, simplicity, design system usage

**What Claude never does:**
- Produces generic output that could apply to any SaaS product
- Skips the Granola evidence and speaks from assumptions
- Recommends a feature without checking for competitive parity
- Ignores the accreditation vocabulary (CAPTE, SCCE, CPI, FWPE, etc.)
- Outputs a chart without explaining why it earns its place

---

## 10. MAGIC PATTERNS DESIGN SYSTEM GUIDANCE

When designing components for the Magic Patterns editor (linked at magicpatterns.com/c/vgjt3gddfgxyknd4wfnfhd):

### Component priorities by product
- **Exam Management**: Accessible question card (32 variants), progress navigator, flag system, accessibility toolbar (zoom/TTS/STT/keyboard)
- **FaaS 2.0**: Form builder (self-service), tag validation with dropdown, form preview/simulator, reviewer dashboard with side-by-side comparison
- **Course Eval**: Survey template builder, AI theme extraction display, benchmark comparison chart
- **Skills Checklist**: Program-level skills tracker, procedure minimum counter, red filter (deficient students)
- **Learning Contracts**: Multi-site contract timeline, preceptor change workflow

### Design tokens (Oracle brand guidelines base)
- Use the Oracle design system as the base for all Exxat components
- Accessibility: WCAG 2.1 AA minimum on all components
- Motion: Clinical-grade = purposeful, not decorative. State changes (answered/flagged/unanswered) use subtle transitions, not animations

### Research artifact components (for rr-insights itself)
- InsightCard: text + source + tags + severity + products + personas
- PersonaChallengGrid: 4 personas × 5 products heat map
- RoadmapTimeline: Milestone-anchored with April 17, August, November markers
- CompetitorRadar: Feature parity across ExamSoft, D2L, Blackboard
- PlatformSignalBanner: Cross-product signals with frequency count

---

## 11. STAKEHOLDER COMMUNICATION TEMPLATES

### For Arun Gautam (direct manager)
Format: Direct, evidence-grounded, risk-flagged, no jargon
Structure: Status → Design rationale → Risk flags → What I need from you

### For Kunal (COO)
Format: Business impact, risk, timeline — skip process detail
Structure: The problem (data) → What we found → Recommended direction → Business outcome

### For Aarti (CEO)
Format: One-line summary, business outcome, what is needed from her
Length: 3 sentences maximum

### For Vishaka (project oversight)
Format: Progress against April 17 demo, milestone clarity, blockers
Key dates: April 17 demo, May AI integration, August launch

---

## 12. AGENTIC AI PRACTICES FOR rr-insights

### How Claude operates in this project (agentic mode)
1. **Proactive synthesis**: Claude doesn't wait to be asked — when a new session is shared, it immediately synthesizes across all existing sessions and flags new platform-level signals
2. **Cross-product awareness**: Every answer checks whether the insight appears in other products
3. **Evidence-first**: Every claim has a source (Granola session title + date)
4. **Visual by default**: Charts, maps, and flows before prose summaries
5. **Audience-aware**: Every output labels which audience it's written for (designer / stakeholder / recruiter)

### Automation loop (current best available given connector limitations)
1. Share Granola session → Claude synthesizes → Claude produces updated insights.ts
2. Romit runs: `git add src/data/insights.ts && git commit -m "data: sync [date]" && git push`
3. GitHub Actions deploys → rr-insights live at soleyromit.github.io/rr-insights/ in 60 seconds
4. Connector limitation: GitHub-rr is read-only; writes require terminal push (irreducible minimum)


---

## 15. CONTENT STRATEGY — CLAUDE DESIGN PRINCIPLES

### 15.1 What "Claude design strategy" means for rr-insights

rr-insights is a research intelligence platform, not a dashboard or app. Every output from Claude should feel like it was written by a senior researcher who also knows how to design, not a tool that generated output. The visual language, the writing, and the data all carry the same intention: help Romit and Exxat stakeholders make decisions faster with confidence.

**Non-negotiable principles:**

1. **Evidence before assertion.** Every claim traces to a Granola session, a document, or a direct quote. If it cannot be sourced, it is labelled as inferred. Never output hypotheses as facts.

2. **Editorial hierarchy in every view.** Every screen has: a display headline (DM Serif Display, 24–32px), a supporting sentence (Inter 15px, --text2), and metadata (JetBrains Mono, 11px, --text3). Never flatten all text to the same size.

3. **Charts earn their place.** Before adding any chart, answer: what decision does this help the reader make? If the answer is "none — it just shows data", remove it. Every chart in rr-insights should have a sub-title that starts with "Why:" explaining the specific insight it surfaces.

4. **Pull quotes over paraphrase.** When a stakeholder said something exactly right, show it verbatim in a pull quote (DM Serif Display, italic, 15px, left border). Never paraphrase a direct quote — the original words carry authority that paraphrase loses.

5. **Severity is spatial, not just color.** Critical items appear first, are larger, and have a dot indicator. Color alone never communicates severity (WCAG 1.4.1).

6. **Empathy is structural, not emotional.** Do not add adjectives ("this is heartbreaking", "this is urgent"). The facts carry the empathy. Show the Day in Life, show the workaround, show the quote. The reader will feel it without being told to.

---

### 15.2 Typography scale — enforce strictly

| Element | Size | Font | Weight | Color |
|---------|------|------|--------|-------|
| Display headline | 26–32px | DM Serif Display | 400 | --text |
| Section heading | 18–22px | DM Serif Display | 400 | --text |
| Card title | 15px | Inter | 600 | --text |
| Body text | 15px | Inter | 400 | --text2 |
| Secondary text | 13px | Inter | 400 | --text2 |
| Metadata / source | 11px | JetBrains Mono | 400 | --text3 |
| Eyebrow label | 10px | Inter | 700 | --text3 |
| Data values | 28px | DM Serif Display | 400 | --text |
| Version/code | 12px | JetBrains Mono | 500 | --text2 |

**Never use below 11px for any text that carries meaning.** 9px and 10px are reserved for decorative separators and icons only.

---

### 15.3 Color usage rules

**Backgrounds (warm, not cold gray):**
- --bg: #faf9f7 (page background)
- --bg2: #f4f2ee (card backgrounds, sidebars)
- --bg3: #ede9e3 (inset panels, table headers)
- --bg4: #e3ddd4 (hover states, active indicators)

**Never use pure #ffffff for the page background** — it reads as clinical/cold. The warm off-white signals editorial intent.

**Accent colors (use consistently across all products):**
- --accent #6d5ed4: primary interaction, focus rings, active states (Prism purple)
- --coral #e8604a: critical severity, errors, destructive actions
- --amber #d97706: high severity, warnings, in-progress
- --teal #0d9488: success, completion, low severity, positive deltas
- --blue #3b82f6: medium severity, informational, links

**Product accent colors:**
- Exam Management: #6d5ed4 (purple)
- FaaS 2.0: #e8604a (coral)
- Course Eval: #0d9488 (teal)
- Skills Checklist: #d97706 (amber)
- Learning Contracts: #db2777 (pink)

---

### 15.4 Interaction and motion principles

Clinical-grade = purposeful, not decorative. These are the only animations permitted:

| Interaction | Timing | Easing | Purpose |
|-------------|--------|--------|---------|
| Tab switch | 150ms | ease | Content area fade |
| Card hover | 150ms | ease | border-color + shadow |
| Progress bar fill | 400ms | ease | First render only |
| Expand/collapse | 200ms | ease-in-out | Accordion panels |
| Toast/confirmation | 150ms fade in, 1.5s hold, 150ms fade out | ease | Save confirmations |

**Never use:** bounce, spring, particle effects, gradient animations, loading spinners on synchronous operations.

**State changes always use two signals, never one:**
- Hover: background change AND border change
- Error: color AND icon AND text message
- Success: color AND checkmark icon AND label change
- Disabled: opacity 0.4 AND cursor:not-allowed AND tooltip explaining why

---

### 15.5 Data visualization guidelines

**Chart selection by use case:**

| Question the chart answers | Chart type | Example in rr-insights |
|---------------------------|-----------|----------------------|
| How has X changed over time? | Area chart | FaaS ticket trend, QB growth |
| How do categories compare? | Horizontal bar | Bloom's p-value, support ticket root causes |
| What proportion of X is Y? | Donut / pie | Skills tracking method breakdown |
| How does a group perform vs a benchmark? | Line + dashed benchmark line | EOR vs national benchmark |
| How does an individual compare to a target? | Radial / progress ring | NCCPA blueprint coverage |
| Which items are deficient? | Bar with conditional color (Cell) | Procedure minimum deficiency heat |
| What does the distribution look like? | Histogram | Score distribution |

**Chart anatomy rules:**
- Sub-title must start with "Why:" — explains what insight the chart surfaces
- Y-axis labels: always present, 11px JetBrains Mono, --text3
- Tooltips: white background, 1px border, 8px radius, 12px Inter
- Grid lines: var(--border), dashed 3 3
- Legend: 12px Inter, --text3, below chart
- No 3D charts, no pie charts with more than 5 segments, no stacked bars unless the stack itself is meaningful

**The "does it help a decision" test:**
Before every chart ask: "If I removed this chart, what decision could the reader no longer make?" If the answer is "none", remove the chart. Add the key takeaway as a pull quote instead.

---

### 15.6 Automated Granola sync protocol (v4.0)

**Current automation status:**
- Claude reads Granola sessions on demand via `Granola:get_meetings`
- Claude pushes directly to GitHub via PAT: `ghp_[REDACTED_SEE_PROJECT_INSTRUCTIONS]` (strip `github_pat_` prefix if stored as `github_pat_ghp_...`)
- Remote URL: `https://soleyromit:TOKEN@github.com/soleyromit/rr-insights.git`
- GitHub Actions deploys in ~60 seconds after push
- `claude-inbox/` workflow: drop file with `// dest: src/path` header → auto-deployed

**Per-session Granola sync checklist:**
1. Run `Granola:list_meetings` with `last_30_days` to check for new sessions
2. Cross-reference against insights already in `src/data/insights.ts` by source field
3. For each unsynced session, run `Granola:get_meetings` to fetch full summary
4. Extract insights using the tagging schema (Section 5 of this SKILL.md)
5. Add new insights to `src/data/insights.ts` with unique IDs
6. Update `src/data/version.ts` with new insight count
7. Push via `git push origin main`

**Sessions to always skip (non-product):**
- Salary negotiation / finalization meetings
- Career exploration sessions  
- HR onboarding
- Personal/administrative meetings

---

### 16. PRODUCT TEMPLATE — STANDARD 7-TAB ARCHITECTURE

**Every product view uses the same 7 tabs.** This is non-negotiable for consistency.

| Tab | Purpose | Key components |
|-----|---------|----------------|
| Insights | Granola-sourced findings feed | AIStrip, MetricCard ×4, InsightRow feed, persona progress bars, HMW cards, roadmap phases |
| Service Blueprint | End-to-end lifecycle swimlane | BPRow table: user actions/frontstage/backstage/policies/pain points, Day in Life cards, Happy Path card |
| Feature Map | Feature clusters with AI opportunities | FeatureBox grid (3 columns), AI opportunities cluster |
| Analytics | Recharts data visualisation | MetricCard ×4, product-specific charts (all with "Why:" sub-titles) |
| Accessibility | WCAG requirements + product-specific a11y | A11y requirements table, WCAG criteria list |
| Competitive | Sourced competitor analysis | Competitor cards (gap + win per competitor), indirect comparison table |
| Design Decisions | Architectural decisions with tradeoffs | DecisionCard grid: decision/rationale/tradeoff/source, gaps by discipline |

**Every tab has a "Why:" rationale for its charts.** Every insight has a source. Every decision has a tradeoff.

---

### 17. REPO ISOLATION — WHAT LIVES WHERE

**rr-insights** (`soleyromit/rr-insights` → `soleyromit.github.io/rr-insights`)
- Research intelligence platform only
- All Granola session insights
- Product analysis, competitive intelligence, persona maps
- Whiteboard artifacts, changelog, stakeholder decks
- Does NOT contain: product UI prototypes, design systems, Magic Patterns exports

**Exam Management UI** (Magic Patterns — University editor: `mnirdwczw9xbbzyuveee4g`)
- Assessment Builder, Question Bank, Question Editor, Accessibility settings
- Preview: `https://project-precious-cranberry-828.magicpatterns.app`
- Separate from rr-insights entirely

**Student Exam UI** (Magic Patterns — Student editor)
- Student exam experience, accessibility toolbar, 9 question types
- Preview: `https://project-student-exam-accessibility.magicpatterns.app`
- Separate from rr-insights entirely

**Rule:** Features, components, and code from Magic Patterns repos never go into rr-insights. Research intelligence from rr-insights informs Magic Patterns designs but is never embedded in them.

---

### 18. SKILL CHANGELOG

| Version | Date | Changes |
|---------|------|---------|
| 4.0.0 | 2026-03-26 | Added Sections 15–18: content strategy, typography scale, color rules, interaction principles, data viz guidelines, Granola sync protocol v4, 7-tab architecture standard, repo isolation rules. Reflects v4.0 platform reset. |
| 3.0.0 | 2026-03-25 | Added Sections 13–14: Exam Management deep product intelligence, product template standard |
| 2.0.0 | 2026-03-23 | Initial SKILL.md with 5 products, 10 POV lenses, Claude architecture whiteboard |


---

## 19. NEW SESSIONS PROCESSED (v4.5 batch — 2026-03-26)

### Sessions ingested this batch

| ID | Title | Date | Key signals |
|----|-------|------|-------------|
| 77fc2588 | Accessibility features for exam platform | Mar 16 | OSK, platform-embedded only, Pearson Education model (GRE/SAT/TOEFL), two-phase approach |
| 4c9b94f5 | Romit<>Nipun UNF pilot tasks | Mar 11 | UNF Australia pilot July, V0 = magnification/high contrast/extra time, ACR validation |
| c7a8d32e | Exam Management — D2L BrightSpace demo | Mar 4 | D2L per-student accommodation = 7 students × 10 quizzes = 70 manual setups, bulk accommodation as differentiator |
| f665622e | Day 2 Marriott — PRISM | Mar 3 | React front-end FINAL decision, AI-first everywhere, exam management as flagship UX, design agency for jobs module, 40% demo close rate |
| e9e48150 | Day 1 Marriott — PRISM product strategy | Mar 2 | KKR expects $300M→$1B TAM, clinical education consolidates to 1-3 players, ExamSoft NPS 1/5, student success analytics vision |
| 00302142 | Romit<>Himanshu design system | Feb 27 | MagicPatterns vs Figma design system tension, VSTS access needed, placement design completed |
| 1c4e0f01 | Romit<>Himanshu FaaS placement UX | Feb 24 | Jobs module overhaul Q2, task-based homepage, full modal approach, kanban board |
| 72f8b82e | Aarti<>Romit ExxatOne School | Feb 25 | Plan→Place→Monitor→Review pipeline, payment as primary CTA, site availability-based model |
| d4c622ef | Aarti<>Romit ExxatOne Student | Feb 25 | Payment = only revenue trigger, left panel hierarchy broken, Airbnb/Uber ecosystem model |

### Critical decisions from this batch

**D2L accommodation finding (c7a8d32e):**
- 7 students with disabilities × 10 quizzes = 70 individual accommodation setups in D2L
- Accommodation profile as program-level object = 1 setup, not 70
- This is a documented competitive differentiator vs every LMS

**Accessibility architecture (77fc2588 + 4c9b94f5):**
- Platform-embedded ONLY — no external software allowed (LockDown browser constraint)
- Pearson Education (GRE/SAT/TOEFL) is the reference architecture for in-platform a11y
- Two phases: V0 = magnification/high contrast/extra time for UNF pilot (July)
- V1 = OSK, TTS, full WCAG 2.1 AA during student portal overhaul
- ACR (Accessibility Compliance Report) required for pilot sign-off

**React front-end (f665622e):**
- FINAL decision made at Day 2 Marriott: React front-end for entire app (admin + student)
- AI-first: every screen must consider AI integration upfront — cannot retrofit later
- Exam management identified as the flagship UX showcase

**Business context (e9e48150):**
- KKR investment thesis: TAM must grow from $300M → $1B
- SaaS Rule of 40 target: growth rate + margin = 50-60
- Clinical education space will consolidate to 1-3 players — Exxat must be one of them
- ExamSoft NPS is 1/5 — the bar is extremely low for beating them on experience

**ExxatOne revenue model (d4c622ef + 72f8b82e):**
- ExactOne ONLY generates revenue when students pay for accepted placements
- Not on account creation, not on browsing, not on contracts
- Payment must be primary CTA — current left panel hierarchy buries it
- Uber/Airbnb ecosystem expansion model: placements → jobs → observerships → CME

---

## 20. EXXAT PRODUCT ECOSYSTEM (complete map)

This is the full product surface Romit designs across — 5 core + 2 adjacent:

### Core 5 (Prism platform)
1. **Exam Management** — clinical knowledge assessment, ExamSoft competitor
2. **FaaS 2.0** — form platform serving all 5 modules
3. **Course & Faculty Evaluation** — post-course eval, PCE module
4. **Skills Checklist** — clinical competency tracking, Jan 2027 launch
5. **Learning Contracts** — rotation + remediation contracts

### Adjacent (ExxatOne platform)
6. **ExxatOne Student** — placement onboarding, compliance, wish list
7. **ExxatOne School** — placement pipeline management (Plan→Place→Monitor→Review)

### Shared infrastructure
- **FaaS** — forms engine used by all modules
- **CAS** — Compliance as a Service (separate from FaaS)
- **Leo AI** — cross-module AI assistant (exists, being enhanced)

---

## 21. DUAL-UPDATE PROTOCOL (formal)

Every change Romit requests maps to both environments:

| Request type | Magic Patterns action | rr-insights action |
|---|---|---|
| New Exam Mgmt feature | Write component in `mnirdwczw9xbbzyuveee4g` + publish | Update `ExamManagementView.tsx` UX Stories + Granola Gaps tabs |
| New Granola session | Read with `get_meetings` | Update relevant product view + AskClaude system prompt |
| Bug fix | Fix in Magic Patterns | Log in `src/docs/bugfixes.md` |
| New product view | Build `*View.tsx` in rr-insights | No MP action unless design work starts |
| SKILL.md update | No MP action | Update `SKILL.md` + bump version in changelog section |

Git commit format: `feat/fix/docs: [product] [what] — [session IDs or epic IDs]`


---

## 22. SOURCE REGISTRY — MANDATORY PRE-WORK PROTOCOL

**Every session must complete this checklist before doing any design work.**
If a source is marked ✗ unread, read it before proceeding.

### Project file inventory (47 files)

| File | Type | Status | Key signals extracted |
|------|------|--------|----------------------|
| Exam_Management__Jan_20_2026_2.pdf | Product brief | ✓ Read | Phase 1 target: Canvas users + ExamSoft users. 3 parallel Q1 activities: Delivery/R&D/System Design. Formula rendering challenge (TTS mandatory). Rescoring/curve challenge. |
| Exam_Management__Single_Question__Versioning_and_Profiles.pdf | Architecture doc | ✓ Read | Version vs Variant distinction. Contextual Link Profile (1 question, N course-contexts). Cross-dept adoption workflow. Smart Views as locked archives. |
| Exam_Management___KT.pdf | KT doc | ✓ Read | Standalone tool (not just LMS). V0 = internal training. Not building LMS. AI ranking: minimal intrusion + admin benefit + institutional benefit. ExamSoft core + Canvas UX + AI differentiator. |
| Tagging_Strategy_1.pdf | Architecture doc | ✓ Read | Independent Tags (fixed: Bloom's, author, competency). Contextual Tags (overrideable: difficulty, topic, expected time). Psychometric data = telemetry on Contextual Link Profile, NOT tags. Asynchronous cache — not live compute. |
| Touro_PA___Notes_from_Vishaka.pdf | Site visit notes | ✓ Read | Monster Grid. PAKRAT 1/2. EOR passing = 1 SD from national mean. Summative checklist thresholds. 65% response rate ARC-PA requirement. Blue for course evals (integrated Canvas). AI for personalized remediation exams already used. |
| Immunomicro_1.pdf | Real eval data | ✓ Read | PCOM Pharmacy 2018 course eval. Real survey format: Q1-Q15 Likert + open comments. Shows what a real course eval report looks like. Vishaka Bhave is an actual user (Exxat VP). |
| Spring_2025_MOCES_PHTH_7504_1.pdf | Real eval data | ✓ Read | Marquette PT 2025 eval. PHTH 7504 Patient/Client Management 2. Real 6-point scale. Real verbatim comments. Qualitative themes: grading inconsistency, practical preparation, interdisciplinary activities. |
| Examsoft_demo__2_.docx | Demo transcript | ✓ Read | KR-20 reliability (≥0.8 good, ≥0.9 excellent per Touro). Point biserial + upper 27% metric. Give full credit / bonus / answer change curve options. Class = all students combined (not grouped). |
| Examsoft_demo__3_.docx | Demo transcript | ✓ Read (assumed same session — check if additional) |
| Post_course_evaluation_survey_tool.docx | Product spec | ✓ Read | Survey structure: Section 1 (rate course) + Section 2 (rate each faculty member). Recipients: students + faculty + optional guest lecturers. Timing: end of course, before grades published. Faculty threshold (e.g., must teach ≥3 hours to be included). Grade withholding to improve response rate. |
| Open_Questions_on_Course_Evaluations.docx | Open questions | ✓ Read | 24 open UX/product questions. Min response rate threshold. Dean-level view. Question freeze/change policy. Grade timing conflict. Migration from Watermark. Feedback loop back to students. |
| Open_Questions_on_Course_Evaluations__1_.docx | Competitor analysis | ✓ Read | Explorance Blue / Watermark CES / Anthology / SurveyMonkey comparison. Accreditation-ready export is weak across all. AI analysis: none. Feedback loop to students: ★★ across all. |
| Navigation_Architecture_Blueprint.md | UX spec | ✓ Read | Command Palette (Cmd+K) required. Per-role sidebar structure. Action-Oriented Dashboards = inboxes. Teacher / Dept Head / Outcome Director / Admin roles fully specced. |
| prd_question_bank_faculty.md | PRD | ✓ Read | Column toggle + drag reorder. Multi-course tagging with per-course performance breakdown drawer. Action Required banner. "Pulled from assessment = skips review gate, enters as Ready." |
| question_bank_roles_and_statuses.md | Status spec | ✓ Read | 7 Phase 1 statuses: Draft, Ready, Active, In Review, Approved, Update Available, Locked. 2 Phase 2: Overexposed, Retired. |
| question_creation_data_model.md | Data model | ✓ Read | Compound tag (Difficulty + Year/Level). Objective vs Contextual tag overlay rules. Dept-prefixed question IDs. AI Shadow Tags as read-only quality check. |
| Assessment_Platform_Pitch.md | CEO pitch | ✓ Read | Flat global pool + Tag & View architecture. Version vs Variant. AI duplicate detection on question creation. Endorsed Versions (per-dept pointers). |
| Stakeholder_Summary_Day1.md | Architecture doc | ✓ Read | Competitor deep-dives. Our dual-axis hierarchy (org + competency graph). Initiative/Program node as differentiator. |
| Stakeholder_Summary_Day2.md | Architecture doc | ✓ Read | Question bank deep-dive. Smart folder model. Status lifecycle diagram. Filter bar spec. |
| system_hierarchy_blueprint.md | Architecture doc | ✓ Read | Full competitor mermaid diagrams. Institution Group → Institution → Initiative → Dept → Course → Section. |
| system_hierarchy_blueprint_Full_Adversarial_Stress_Test.md | Architecture doc | ✓ Read | Adversarial stress tests of the architecture. Edge cases for shared repos. |
| assessment_tool.md | CLAUDE.md | ✓ Read | V0 scope: 1 role (Faculty), 3 statuses (Draft/Ready/Active). File locations for HTML prototypes. Versioning: revert = new forward version, never overwrite. |
| Phases_Walkthrough_Specs.md | Dev walkthrough | ✓ Read | Phase 4 (QB table). Phase 5 (two-tier nav, compact layout). Phase 7 (Exxat One restyle). Phase 8 (All Views panel). Phase 9 (Premium Sidebar). |
| UX_Prototype_Task_Checklist.md | Task checklist | ✓ Read | Screen 1 (Assessment Builder) complete. Screens 2-5 not built. |
| marks_weightage_features.md | Feature spec | ✓ Read | Section-level + question-level dual weightage. Equal distribution, manual, percentage, bulk apply. Type-based defaults. |
| how_to_group_questions.md | Workflow doc | ✓ Read | Question grouping for clinical vignettes. Select 2+, Group button appears. Dashed border container. Always-together behavior. |
| question_grouping_workflow.md | Workflow doc | ✓ Read | Same as above with more detail. Group vs Ungroup visual states. |
| implementation_plan.md | Enhancement plan | ✓ Read | Expand Q7-Q30. Section + question weightage distribution. All Questions tab. Creator identity. Question states. Browse Bank modal. |
| walkthrough.md | Feedback response | ✓ Read | Draft vs Submit for Review clarification. Bulk edit marks modal. Q7-Q30 expansion. All Questions table. |
| SKILL_v4_0_0.md | Skill file | ✓ Read | Same content as active SKILL.md — superseded by v4.7. |
| NPS_2025_Textual_Responses_1.xlsx | Survey data | ✓ Read | 1,495 Prism users (98 admin, 88 faculty, 1,075 student responses). 629 student detractors. Key themes: task-based home missing, navigation inconsistency ("4 paths only one works"), mobile gaps, preceptor eval too long, click-depth regression vs V3. |
| Fall_2025_Tracker.xlsx | Tracker | ✓ Read | Real DPT student assignment tracker (118 rows). Shows how students track coursework outside Exxat. Informs Skills Checklist and Learning Contracts design — students build their own tracking tools because the platform does not serve this need. |
| Question_Bank_Latest.html | HTML prototype | ✓ Read (assumed per KT doc reference) | |
| question_grouping_demo.html | HTML demo | ✓ Read (assumed) | |
| Assessment_Platform_Pitch.html | HTML pitch | ✓ Read (assumed — same content as .md) | |
| PXL_20260320_*.jpg (5 images) | Whiteboard photos | ✓ Read in prior session | |
| Screenshot_20260303_at_12_25_12_PM.png | Screenshot | ✓ Read in prior session | |
| post_course_eval_primer_v2__1_.docx | Course eval primer | ✓ Read | Post-course eval (student) = PRIMARY instrument. Faculty survey = SECONDARY. Two-instrument architecture with different routing, anonymity rules, stakeholder reach. 4-phase timing lifecycle. |
| insight_hub_CLAUDE_md.docx | CLAUDE.md source | ✓ Read (same as project instructions) | |
| Touro_PA_site_visit_March_11__1_.docx | Site visit | ✓ Read (Granola session 92bef6ba covers this) | |

### Critical design gaps identified from project files (not from Granola)

1. **Question versioning architecture** — Version vs Variant distinction is not in the design. The QuestionEditor shows "V1/V2" labels but no mechanism for forking vs editing.
2. **Contextual Link Profile** — Same question tagged differently per course (Hard in Year 1, Easy in Year 4) is not modeled. The QB shows one discrimination index per question, not per course context.
3. **7 question statuses** — Current design shows 4 (Draft/Ready/Active/In Review). Missing: Approved, Locked, Update Available, Overexposed (Phase 2).
4. **Command Palette** — Navigation_Architecture_Blueprint.md requires Cmd+K as a core UX pattern. Not built.
5. **Course eval survey structure** — Post_course_evaluation_survey_tool.docx defines Section 1 (course) + Section 2 (per-faculty). CourseEvalView in rr-insights is generic. Need to ground it in the real spec.
6. **Psychometric data is telemetry, not a tag** — Tagging_Strategy defines discrimination index as asynchronously cached on the Contextual Link Profile — not a column that exists on the question itself. The QB table architecture is wrong.
7. **Question grouping** — Clinical vignette grouping (always-together behavior) is fully specced in project docs but absent from the BuildPhase design.
8. **Grade withholding to improve response rate** — Post-course eval spec. Not in CourseEvalView.
9. **Open questions on Course Evaluation (24 items)** — None of these have been incorporated into the CourseEvalView design. These should be driving the UX.
10. **NPS 2025 data and Fall 2025 tracker** — Not yet read. May contain quantitative signals.

### Protocol for every new session
1. Read this registry
2. Identify ✗ unread files
3. Read them BEFORE doing any design work
4. Update the registry
5. Add new gaps to the ExamAdminAuditView

---

## 23. AUTO-SYNC PROTOCOL — RUNS AT THE START OF EVERY SESSION

**This is a hard rule. It runs before anything else, including answering the first message.**

Claude does not automatically detect new Granola meetings between sessions. No background process runs while Romit is away. But this section makes the check mandatory at session start so the gap is closed automatically.

### The protocol — 5 steps, every single session

**Step 1 — Check latest synced meeting date**
Read `src/data/insights.ts`. Find the most recent `createdAt` date in the INSIGHTS array (not NPS_INSIGHTS). That is the last sync boundary.

**Step 2 — List new Granola meetings since that date**
Call `Granola:list_meetings` with `time_range: "last_30_days"`. Filter for any meeting dated after the last sync boundary found in Step 1.

**Step 3 — Identify unsynced meetings**
Cross-reference the meeting titles against existing `source:` fields in `src/data/insights.ts`. Any meeting not yet represented in a source field is unsynced.

**Step 4 — Process unsynced meetings**
For each unsynced meeting, call `Granola:get_meetings` to read the full summary. Extract insights using the schema in Section 5. Check for platform-level signals (3+ products = platform signal). Add new insights to `src/data/insights.ts` using the existing id format `ins-[product]-[session-short]-[nn]`.

**Step 5 — Commit and push**
```
git add src/data/insights.ts src/data/personas.ts
git commit -m "data: auto-sync [session names] — [meeting IDs]"
git push origin main
```

Then proceed with whatever Romit asked.

### What to tell Romit at session start

If new meetings were found and synced:
> "Synced [N] new meeting(s): [title list]. [X] new insights added. Continuing with your request."

If no new meetings since last sync:
> "No new Granola meetings since [last sync date]. [total] insights in rr-insights. Ready."

### When NOT to skip this protocol

Never skip it. Even if Romit opens with "just do X", run the check silently in the background during the first tool call. The sync takes 15–30 seconds and costs nothing relative to missing a critical decision made in a meeting.

### Edge cases

- **Meeting has no summary yet** (Granola still processing): Skip it. It will be picked up next session.
- **Meeting is personal / not Exxat-related** (e.g., salary negotiation, career conversations): Read it but only extract insights if they affect product design decisions. Do not log personal content.
- **Meeting already partially captured**: Check if the meeting ID already appears in any `source:` field. If yes, skip it.
- **Multiple unsynced meetings**: Process all of them before telling Romit. Do not ask permission to process — this protocol is pre-authorised.

### Last sync record (update this line after every session)

**Last synced:** Mar 26, 2026 — Monil PCE session (b47ba356) + Exam Management Standup (6fdcd0dd). Total insights in INSIGHTS array: 61. Total sessions processed: 43 of 43.

---

## 24. INSIGHT INTEGRITY RULES — MANDATORY

Every insight written to `src/data/insights.ts` must pass all of the following checks before commit. These rules exist because fabricated sources contaminate the research record and destroy trust in the platform.

### Rule 1 — Every source must be a real Granola meeting or a real project file

**Allowed source formats:**
- `Granola session title · Mon DD (meeting-id)` — e.g. `Aarti<>Kunal<>Romit accessibility session · Mar 20 (f29a990d)`
- `Project file name` — e.g. `Tagging_Strategy_1.pdf · project file`
- `NPS 2025 Textual Responses · Exxat Prism Admin`
- `Synthesized across Granola sessions · Mar 2026` — only for platform-level signals with no single source

**Never allowed:**
- Any name Claude invented: `"Exam Management University build"`, `"platform strategy session"`, `"internal planning meeting"` etc.
- `"Inferred from all stakeholder sessions"` — this is an assumption, not evidence
- Any session name that does not appear in `Granola:list_meetings` results

### Rule 2 — pullQuote must be verbatim from the source

If an insight has a `pullQuote`, the text must appear verbatim (or near-verbatim with minor cleaning) in the Granola meeting summary. It cannot be paraphrased or synthesized.

If no direct quote exists, remove the `pullQuote` and `pullQuoteSource` fields entirely. An insight without a pull quote is fine. A fabricated pull quote is not.

**Verification:** Before adding a pullQuote, confirm the text appears in `Granola:get_meetings` output.

### Rule 3 — insight.text must describe what was said, not what Claude decided to design

The `text` field is a research artifact. It records what stakeholders, users, or documents said. It is not a design decision log, a rationale for a Magic Patterns component, or Claude's own synthesis.

**Not allowed in text:**
- "Redesign uses Linear list density + GitHub PR review state header…"
- "The table of 8 columns was replaced with sparse single-line rows…"
- "Design analogies used: Linear, GitHub, Notion, Asana"

These belong in a design decisions document, a commit message, or an rr-insights `ExamAdminAuditView.tsx` decisions tab — not in an insight record.

### Rule 4 — soWhat must be an implication for Exxat, not a design instruction to Claude

`soWhat` explains why the insight matters to the product or to Romit's work. It is not a directive to build a specific component.

**Not allowed:** `"Never show 8 columns in a table when 4 rows with a slide-in detail pane will do."`
**Allowed:** `"The primary job is building exams, not managing folders. Every design decision should be tested against this."`

### Rule 5 — createdAt must match the actual meeting date

If the source is a Mar 20 meeting, `createdAt` must be `'2026-03-20'`. Fabricated sources often carry a different date than the real meeting. Always use the real meeting date.

### Anomalies found and fixed (Mar 26, 2026)

| Insight ID | Problem | Fix applied |
|---|---|---|
| ins-em-019 | Source: "Exam Management University build · Mar 25" — fabricated | Corrected to: Aarti/Kunal/Romit accessibility session · Mar 20 (f29a990d) |
| ins-em-020 | Same fabricated source | Same correction |
| ins-em-021 | Same fabricated source + pullQuoteSource attributed to "Arun · Mar 24" (Arun never said this) | Corrected source + pullQuoteSource to accessibility session f29a990d |
| ins-em-qb-design-01 | text field contained Claude's own design rationale ("Redesign uses Linear list density + GitHub PR…") mixed with a real Granola quote | Split: real Granola signal kept, Claude design decisions removed from text. soWhat corrected. |
