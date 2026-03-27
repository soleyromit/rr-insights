---
name: rr-insights
version: 2.0.0
last_updated: 2026-03-23
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

When a new Granola session is shared:

1. Claude reads the full summary via `Granola:get_meetings`
2. Claude extracts insights using the tagging schema in Section 5
3. Claude filters through all 10 POV lenses in Section 4
4. Claude checks for platform-level signals (does this appear in 3+ products?)
5. Claude produces the updated `src/data/insights.ts` file content
6. Claude tells Romit: "X new insights added. Run: `git add src/data/insights.ts && git commit -m 'data: sync [session name]' && git push`"
7. GitHub Actions deploys in ~60 seconds

### Sessions synced as of Mar 23, 2026
- All 40 sessions from Feb 23 – Mar 23, 2026 read and synthesized
- New sessions today: Assessment Creation tool (Mar 23), Exam accessibility (Mar 20), Blackboard competitive (Mar 20), FaaS compliance interview/Harsha (Mar 20), Exam stand-up #1 (Mar 19)
- Pending sync to insights.ts: Mar 23 assessment creation session + Mar 20 exam accessibility session

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
- Claude pushes directly to GitHub via PAT: `ghp_REDACTED_SEE_PROJECT_INSTRUCTIONS` (strip `github_pat_` prefix if stored as `github_pat_ghp_...`)
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

### 19. EXXATLY-NEW-DS — DESIGN SYSTEM EXPECTATIONS & WORKFLOW

**DS Location:** `magicpatterns.com/design-system/ds-712de3ba-b73d-407d-9d94-a149d8f9d481`

#### 19.1 What the DS must always match

The DS is the single source of truth for Exxat's UI tokens, components, and interaction patterns. Every component must:

1. **Match localhost exactly** — extract tokens from live DOM, not from memory or assumption
2. **Support both dark and light modes** — dark is default (School Admin), light is alternate
3. **Use Inter from rsms.me** — NOT Google Fonts CDN. Source: `https://rsms.me/inter/inter.css`
4. **Use Font Awesome 7 Pro** — NOT Lucide. 103 FA icons confirmed in localhost DOM
5. **HEX only in tailwind.config.js** — zero `var(--...)` references (causes token context overflow)

#### 19.2 Token reference (confirmed from localhost DOM — March 2026)

| Mode | Surface | Token |
|------|---------|-------|
| Dark | Page | `#0b0b0e` |
| Dark | Sidebar | `#1a1a21` |
| Dark | Card | `#15161a` |
| Dark | Secondary/Chat AI | `#222137` |
| Dark | Chat User bubble | `#272445` |
| Dark | Nav active | `#28282f` |
| Dark | Deep panel/table header | `#0e111b` |
| Light | Page body | `#f3f3ff` (brand tint) |
| Light | Card | `#ffffff` |
| Light | Sidebar | `#3f3679` (brand-dark purple — NOT white) |
| Light | Sidebar active | `#ebebfd` |
| Light | Border | `#e4e4e6` |
| Both | Brand | `#5f53ae` |
| Both | Brand dark | `#3f3679` |
| Both | Destructive | `#f14d4c` |
| Both | Success | `#33cb91` |

Chart colors (confirmed recharts): `#5794ff` `#33cb91` `#54c6f3` `#f3b100` `#f49500`

#### 19.3 Component creation rules (+ Add Component modal)

**The only way to add components to the DS** is through the `+ Add Component` button in the DS sidebar. There is no batch API. Each component requires:
1. Click `+ Add Component` in sidebar (stable as `ref_39` in find tool)
2. Click textarea at approximately (754, 430)
3. Type the prompt
4. `find "submit arrow button modal"` → get new ref → click it (ref changes every open)
5. Wait for "Generating..." to appear in sidebar before opening the next modal

**Common failure modes to avoid:**
- Clicking `ref_39` when a modal is already open → closes it instead of opening new one
- Using the "Create Component" button (top-right) → navigates away from DS
- Clicking Default Files link (y:455 area) instead of Add Component (y:415 area) — they are adjacent
- JS automation of the textarea → React doesn't register programmatic value changes
- Using `create_design` MCP tool → creates standalone prototypes, NOT DS components

**Naming convention:** Use PascalCase, no spaces: `AnnouncementBanner`, `KPIMetricCard`, `DataTable`

#### 19.4 Complete component inventory — Exxatly-NEW-DS

**Completed (20/20 submitted):**
1. Button — 4 variants, dark + light
2. SidebarNavigation — org switcher, items, badges, user row
3. Topbar — breadcrumb, layout toggle, Ask Leo btn
4. AnnouncementBanner — premium upsell, sparkle icon, dismiss
5. KPIMetricCard + InsightAlertCard
6. DataTable — checkbox, avatar, badge, sort, row actions
7. FilterTabBar — dark + light, + Add view, + Add filter
8. StatusBadge — all 9 variants
9. AreaChartCard — recharts AreaChart, 3 series
10. DonutChartCard — recharts PieChart, legend
11. Avatar — 5 variants, pill + square
12. FormInput — 6 states, dark + light
13. UserMenuDropdown — dark + light, sub-items
14. Checkbox — 5 states, dark + light
15. Tooltip — sidebar context, always dark
16. Stepper — 5-step with section header
17. PageHeader — 3 variants
18. EmptyState — 3 variants
19. NavBadge + RowActionsMenu — combined
20. RowActionsMenu — trigger + dropdown

**Missing — not yet built (Phase 2):**
| # | Component | Where seen | Why missed |
|---|-----------|-----------|------------|
| 21 | Ask Leo Panel | Dashboard, all pages | Full right-side panel, 382px, chat bubbles, suggestion chips, input bar, send btn |
| 22 | Bar Chart Card (Grouped) | Dashboard — Applications by Program | Grouped bar chart, multi-color per group, tooltip hover card |
| 23 | Stacked Bar Chart Card | Dashboard — Monthly Reviews | Stacked segments Approved/Pending/Rejected |
| 24 | Chart Tooltip Hover | Dashboard charts | Floating card: date header + rows of value per series |
| 25 | Collapsed Sidebar | /data-list/new form page | 60px icon-only sidebar, sidebar shrinks when panel opens |
| 26 | Org Switcher Dropdown | Sidebar top | Click on org name opens dropdown with org list + chevron |
| 27 | Search Modal / Command | /search route | Full-screen or overlay search interface |
| 28 | Coach Mark / Spotlight | /settings page | Guided tour spotlight overlay with numbered steps |
| 29 | Rotations Submenu | Sidebar — Rotations with chevron | Expandable submenu within sidebar nav |
| 30 | More Menu / Overflow | Sidebar — ...More item | Collapsed nav items overflow panel |

#### 19.5 Pre-flight checklist before building DS components

Before starting any DS component build session:

**Audit phase (do first, always):**
- [ ] Screenshot every route: `/dashboard`, `/data-list`, `/data-list/new`, `/compliance`, `/team`, `/settings`, `/search`
- [ ] Open every overlay: Ask Leo panel, user menu, org switcher, tooltips, chart hover tooltips
- [ ] Check both themes: toggle dark/light via HTML class
- [ ] Scroll every page fully — charts below the fold are often missed
- [ ] Extract tokens from live DOM — never rely on cached values

**Inventory phase:**
- [ ] List every distinct UI pattern with source route and scroll position
- [ ] Cross-reference against existing DS components — check what's already built
- [ ] Flag duplicates (e.g., DataTable appears 3 times — build once)
- [ ] Categorize: Layout / Data Display / Input / Feedback / Navigation / Charts

**Execution phase:**
- [ ] Write all prompts BEFORE opening any modal
- [ ] Confirm `+ Add Component` button is in viewport (scroll sidebar if needed)
- [ ] One component per modal open — never stack
- [ ] Verify "Generating..." appears in sidebar before proceeding to next
- [ ] Delete any off-plan components immediately (hover → `...` → Delete → confirm)

#### 19.6 Next actions — Phase 2 DS build

Priority order for Phase 2 (10 missing components):

| Priority | Component | Complexity | Key tokens |
|---------|-----------|-----------|------------|
| P0 | Ask Leo Panel | Complex | 382px width, bg #15161a, chat bubbles #222137/#272445, suggestion chips |
| P0 | Bar Chart Card (Grouped) | Complex | recharts BarChart grouped, chart tooltip hover card |
| P0 | Stacked Bar Chart Card | Complex | recharts BarChart stacked, 3-color segments |
| P0 | Chart Tooltip Hover | Medium | bg #15161a border #414247 r:8px, date header + value rows |
| P1 | Collapsed Sidebar | Medium | 60px wide, icon-only, tooltip on hover |
| P1 | Org Switcher Dropdown | Medium | bg #15161a r:12px, org list items h:40px |
| P1 | Coach Mark / Spotlight | Complex | Semi-transparent overlay, spotlight cutout, numbered steps |
| P2 | Search Modal | Medium | Full overlay bg rgba(0,0,0,0.5), search input, results |
| P2 | Rotations Submenu | Simple | Indented nav items under Rotations, collapsible |
| P2 | More Menu Overflow | Simple | bg #15161a panel, remaining nav items |

