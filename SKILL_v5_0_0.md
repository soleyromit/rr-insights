---
name: rr-insights
version: 5.0.0
last_updated: 2026-07-28
author: Romit Soley, Product Designer II, Exxat
description: >
  Comprehensive research intelligence architecture for Exxat's clinical education platform.
  Built from 8 analytical perspectives: Product, Competitive (Direct/Indirect), Personas 
  (Active/Inactive), Accessibility, Design Leadership, Research, Content Strategy, and Motion Design.
  Governs synthesis of Granola sessions, stakeholder interviews, and research artifacts across 
  all 5 products and every user lens.
---

# rr-insights SKILL.md v5.0
## The strategic intelligence engine for clinical education SaaS assessment.

---

## 0. NORTH STAR & SUCCESS METRICS

### The Loop (from whiteboard)
```
Measure delightful experience
  → How we make it better
    → What we'll build
      → Changes happen
        → Delightful Experience (circle)
```

### Three anchoring questions (every research session)
1. **Who are the users?**
2. **What do they need?**
3. **What is their current experience?**

### Finish line
**Whose lives are we making better?** Not features. Not metrics. Lives.

### Success metrics for rr-insights itself
- **Team understanding**: Exxat leadership understands customers, users, and employees without asking twice
- **Insight velocity**: Insights → Expertise → Research agendas → Shipped features (cycle time)
- **Human impact**: Who is having a great day? Who is having a poor day? What role did Exxat play?

### Progress tracking framework
| Dimension | Q2 Baseline | Q3 Target | Q4 Goal | Measurement |
|-----------|-------------|-----------|---------|------------|
| Exam Management product readiness | 35% | 75% | 100% MVP | Design completeness + Granola consensus |
| Faculty NPS (Exam + PCE combined) | -15 | 0 | +20 | Direct survey + support ticket volume |
| SCCE platform adoption | 40% | 65% | 85% | Login frequency + task completion rate |
| Accreditation-ready reporting capability | 0% | 30% | 70% | Program Director self-serve report count |
| Cross-product AI integration maturity | 0% | 20% | 50% | Feature shipped + user engagement |

---

## 1. PLATFORM CONTEXT — PRODUCTS IN SCOPE

### Product registry with Granola status (as of Jul 28, 2026)

| ID | Product | Phase | MVP Date | Granola sessions | Portfolio signal |
|----|---------|-------|----------|-----------------|-----------------|
| exam-management | Exam Management | QA (QB, Assessment, Student UX) | Jan 20, 2026 | 15+ | HIGH — most detailed requirements |
| course-eval | Post-Course Evaluation (PCE) | Design phase (80% complete) | June 1 dev handoff | 18+ | HIGH — analytics layer differentiation |
| faas | FaaS 2.0 (Forms as a Service) | Ongoing governance | Q3 refresh | 8+ | VERY HIGH — 95K annual tickets, NPS 2/5 |
| skills-checklist | Skills Checklist | Discovery (underpopulated in rr-insights) | Q4 2026 | 3+ | MEDIUM-HIGH |
| learning-contracts | Learning Contracts | Discovery (underpopulated in rr-insights) | Q4 2026 | 2+ | MEDIUM |

### Core product positioning

**Year 1 north star**: Beat LMS free tier (Canvas, D2L)
**Year 2 north star**: Match ExamSoft paid tier
**Year 3 north star**: AI proctoring + surpass ExamSoft

### Experience spectrum (clinical education lifecycle)
```
Didactic Courses → Clinical Placement → Competency Verification → End-of-rotation Summary → Continuing Education
   ↓                    ↓                       ↓                        ↓                         ↓
Exam Mgmt           FaaS + Skills         Learning Contracts          Course Eval            (Future: CEU)
```

### Platform-level signals (appear 3+ products = architecture-level problem)
1. **Cognitive overload under constraint**: Students building external tracking docs; DCEs manually managing multiple systems
2. **Reporting deficit**: Program Directors cannot self-serve accreditation reports; manual Excel compilation standard
3. **AI opportunity layer**: Confirmed across all 5 products; embedded as natural behavior, not labeled "AI"
4. **Manual configuration debt**: Excel mappings, manual tagging, ID sync across systems
5. **Multi-campus fragmentation**: Same program, different configurations; no inheritance/template system
6. **Standalone skills entity gap**: Skills and Learning Contracts lack connection to placement context
7. **Mobile & SCCE underservice**: External user (clinical supervisor) experience significantly behind internal
8. **Accessibility baseline gap**: Exam lockdown prevents standard OS accommodations; must build within-app

---

## 2. EIGHT ANALYTICAL PERSPECTIVES

### Why Eight Perspectives?
No single lens captures the full strategic picture. These perspectives serve different stakeholders and inform different design decisions:

---

## 2A. EXXAT PRODUCT PERSPECTIVE

**Owns**: Product positioning, feature prioritization, go-to-market strategy
**Questions answered**: What are we building? Why? Against whom?

### Exam Management — Product POV

**Strategic positioning**
- Target: Displace ExamSoft at switching moment (accreditation review, budget renewal)
- Parity: Curriculum mapping, item analysis, question bank governance (DONE by Jan)
- Differentiation: Clinical placement context (unique to Exxat), AI-assisted gap detection
- Risk: Offline exam download gap (March vs Jan) — significant parity loss vs ExamSoft

**Feature roadmap (with January MVP scope)**
| Layer | Feature | MVP? | Why |
|-------|---------|------|-----|
| Foundation | Question Bank (folder, versioning, permissions) | ✓ | Core ExamSoft parity |
| Foundation | Assessment Builder (7 question types) | ✓ | Minimum viable |
| Foundation | Student exam UX (basic, no offline) | ✓ | Must-have for launch |
| Foundation | Faculty review (item analysis, scoring adjustments) | ✓ | Accreditation requirement |
| Differentiation | AI question gap detection | ✓ | Unique to Exxat |
| Differentiation | Placement context linking | ✗ | Jan is too aggressive; March likely |
| Parity | Offline exam download | ✗ | Arti says March; hard blocker vs ExamSoft |
| Reporting | Accreditation-ready curriculum map export | ✗ | Year 2 |

**Success metrics (Q1 2027)**
- MVP adoption: 5+ pilot customers running low-stakes exams
- Faculty confidence: "Question bank is easier than ExamSoft" (usability score 7+/10)
- Exam completion: 100+ exams delivered across pilots
- Support overhead: <5 tickets/customer/month (vs ExamSoft 3, D2L 4)

### Course Evaluation (PCE) — Product POV

**Strategic positioning**
- Target: Every accredited healthcare program required by their accreditor to measure quality
- Parity: Template-based surveys, response rate tracking, basic PDF reports
- Differentiation: Intelligent distribution (auto-suggest surveys by academic calendar), narrative synthesis (AI-powered insights), curriculum loop closure

**Feature roadmap (with June 1 dev handoff scope)**
| Layer | Feature | MVP? | Scope |
|-------|---------|------|-------|
| Core | Two-instrument architecture (Student PCE + Faculty Reflection) | ✓ | Unified Surveys nav |
| Core | Role-based routing (Faculty, Program Dir, Dean per response) | ✓ | 3-role access control |
| Core | Distribution workflow (bulk send, calendar reminder, tracking) | ✓ | Highest design investment |
| Analytics | Single survey results (response rate, score trends, open text) | ✓ | Pre-built, no customization |
| Analytics | Multi-survey analytics (by Term, Faculty, Course) | ✓ | Longitud analysis capability |
| AI | Narrative synthesis (auto-summary of open-text themes) | ✗ | Post-MVP, likely Q3 |
| AI | Auto-survey recommendation (which surveys next term?) | ✗ | Agentic workflow, Q3+ |

**Success metrics (Q2 2026 = now)**
- Design completion: 100% (currently 80% ✓)
- Dev handoff confidence: 100% of designs documented, all tradeoffs explained
- Adoption: 3+ pilot programs running full PCE cycle
- Faculty engagement: Response rate ≥50% (vs Anthology PDF 25%)

### FaaS 2.0 — Product POV

**Strategic positioning**
- Current state: 17K configured forms, 95K support tickets/year, NPS 2/5 = crisis
- Target: Reduce support burden by 60% via better governance + UI
- Parity: Form versioning, access control, compliance rules (HIPAA/FERPA/ADA)
- Differentiation: Three-tier governance (CRITICAL auto-reject → manager approval → warning-only), form templates per discipline

**Governance model (core to FaaS redesign)**
| Tier | Strictness | Use case | Example |
|------|-----------|----------|---------|
| CRITICAL | Auto-reject | HIPAA-sensitive fields | "Social Security Number" in form |
| MANAGER REVIEW | Manual approve | Form scope changes | "Add 3 new required fields to mandatory clinical form" |
| WARNING ONLY | Log + alert | Minor field additions | "Add optional comment field" |

**Success metrics (Q3 2026)**
- Support ticket reduction: 95K → 60K/year (-37%)
- Form quality score: Self-service form creation without support = 70% of new forms
- Accreditation compliance: 100% of forms HIPAA/FERPA/ADA tagged

---

## 2B. DIRECT COMPETITOR PERSPECTIVE

**Owns**: Competitive differentiation, parity roadmap, market positioning
**Questions answered**: How do they do it? What are their strengths? Where can we win?

### Competitors by product

#### Exam Management competitive matrix

| Capability | ExamSoft | Canvas LMS | D2L Ultra | Exxat MVP | Exxat Q2 |
|-----------|----------|-----------|-----------|-----------|----------|
| Question Bank | ✓ Excellent | ✓ Basic | ✓ Basic | ✓ MVP | ✓ Excellent |
| Curriculum Mapping | ✓ Built-in | ✗ None | ✓ Basic | ✗ Future | ✓ + Placement context |
| Item Analysis | ✓ Point-biserial, Cronbach alpha | ✗ None | ✓ Point-biserial | ✓ Point-biserial | ✓ + Cronbach alpha |
| Offline Exams | ✓ Lock-in file download | ✓ Via third-party | ✓ Via third-party | ✗ Jan cut | ✓ March add |
| Lockdown Browser | ✓ High-stakes proctoring | Via Respondus | Via Respondus | ✗ Low-stakes only | ✗ TBD Year 2 |
| Accessibility Tools | ✓ In-app zoom, reader | ✓ Basic OS integration | ✓ Basic OS integration | ✓ In-app (MVP target) | ✓ Full WCAG 2.1 AA |
| Score to LMS | ✓ Automated push | ✓ Native | ✓ Native | ✗ Manual CSV | ✓ Canvas API Q2 |

**Exxat winning position (Jan MVP)**
- Placement context: Only Exxat connects exam performance to placement rotation (where it matters clinically)
- AI gap detection: Auto-flag questions not covered by curriculum learning objectives
- Mobile-first: Exam review on phone (students already doing this anyway)

**Exxat risk (Jan MVP)**
- Offline download absence = faculty revolt risk vs ExamSoft customers (mitigation: March sprint confirmed)
- Locked-in data: Question bank does not port to ExamSoft (lock-in risk is OURS, not ExamSoft's)

#### Course Evaluation (PCE) competitive matrix

| Capability | Anthology Survey | SurveyMonkey | ExamSoft Surveys | Exxat MVP |
|-----------|------------------|--------------|-----------------|-----------|
| Template library | ✓ 50+ by discipline | ✓ 1000+ generic | ✗ None | ✓ 12+ accreditor-aligned |
| Multi-role survey routing | ✓ Admin-built workflows | ✗ Basic | ✗ Limited | ✓ 3-tier (Student/Faculty/Director) |
| Longitudinal analytics | ✓ Year-over-year | ✗ Basic | ✗ Limited | ✓ By Term / Faculty / Course |
| Narrative synthesis | ✗ None | ✗ None | ✗ None | ✓ AI-powered themes (Q3) |
| Curriculum loop closure | ✗ Siloed | ✗ Siloed | ✗ Siloed | ✓ Links to exam + placement data |

**Exxat winning position**
- Data integration: Exxat alone connects course eval → exam performance → placement competency verification
- Accreditation narrative: Auto-generate "continuous quality improvement" section from data

#### FaaS competitive matrix

| Capability | Typeform | SurveyMonkey | Qualtrics | Exxat FaaS |
|-----------|----------|--------------|-----------|-----------|
| Form templates | ✓ 50+ UX-focused | ✓ 200+ | ✓ 500+ + AI | ✓ Discipline-specific |
| Conditional logic | ✓ Good UX | ✓ Good UX | ✓ Excellent | ✓ Clinical rules (HIPAA/FERPA) |
| Multi-step forms | ✓ Native | ✓ Native | ✓ Native | ✓ + Placement context |
| Response anonymization | ✓ Standard | ✓ Standard | ✓ Standard | ✓ + Accreditation audit trail |
| Mobile optimization | ✓ Excellent | ✓ Good | ✓ Good | ✓ Critical for SCCE (external user) |
| HIPAA compliance | ✗ Not marketed | ✗ Standard only | ✓ Yes | ✓ Yes + FERPA + ADA |

**Exxat winning position**
- Healthcare compliance: Purpose-built for healthcare + education, not generic
- Accreditation alignment: Forms map to competency outcomes; compliance automatic

---

## 2C. INDIRECT COMPETITOR PERSPECTIVE

**Owns**: Adjacent market threats, expansion blockers, ecosystem risks
**Questions answered**: What if a competitor enters from a different angle?

### Indirect competitors analysis

**Threat 1: LMS (Canvas, D2L) adds better assessment**
- Signal: Canvas adding more question types (formula-based, hotspot, ordering)
- Risk level: MEDIUM — Canvas has institutional lock-in, LMS user doesn't switch for assessment alone
- Exxat response: "Assessment is the differentiator within clinical education; LMS is general education"

**Threat 2: ExamSoft adds placement + competency tracking**
- Signal: ExamSoft expanding into clinical workflow (already owns curriculum mapping)
- Risk level: MEDIUM-HIGH — ExamSoft has faculty training, curriculum investment already done
- Exxat response: Exxat owns placement rotation data that ExamSoft can't easily replicate

**Threat 3: AI-first upstart (OpenAI, Anthropic, other) launches clinical assessment GPT**
- Signal: GPT-4 can generate exam questions; existing AI question generation tools in market (Gradescope, Proctor)
- Risk level: MEDIUM — AI for question generation is necessary, not sufficient (still need curriculum mapping, governance)
- Exxat response: AI embedded as natural product behavior, not a standalone feature

**Threat 4: Healthcare LMS (Moodlerooms, Instructure Elevate) adds clinical assessment**
- Signal: Healthcare IT consolidation trend; vendors adding vertical-specific features
- Risk level: LOW — still need accreditation expertise Exxat has built
- Exxat response: Partner, don't compete; Exxat as the clinical assessment module for healthcare LMS

---

## 2D. PERSONAS ACTIVELY USING EXXAT PRODUCTS

**Owns**: Day-to-day UX, pain point prioritization, feature feedback
**Questions answered**: What is their workflow? What breaks it? What would delight them?

### Student (Clinical Education)

**Role**: Enrolled in accredited healthcare program (PT, OT, PA, Nursing, Social Work, etc.)
**Estimated population**: 170,000+ per Exxat market reach

**Day in the life**
```
7:00 AM  → Login to program portal (via Canvas/Blackboard)
7:15 AM  → Check clinical placement assignment + todo list
7:30 AM  → Review upcoming competency requirements (Skills Checklist tab)
8:00 AM  → Attend didactic lecture; professor mentions "assessment today at 3 PM"
2:45 PM  → Panic — checks where exam is (three clicks deep in LMS)
3:00 PM  → Takes online exam in Exxat (lockdown browser, 50 minutes)
4:30 PM  → Clinical placement (form completion via FaaS)
4:45 PM  → Update personal tracking spreadsheet (80-90% of cohort does this)
6:00 PM  → Check grades → Frustrated: no clear feedback why they scored lower
```

**Critical friction points**
1. **Placement hunting**: "I don't have visibility across all rotations. Am I on track for the X skill?"
   - Current state: Manual spreadsheet
   - Impact: Anxiety + poor learning outcomes
   - Design priority: HIGH
   
2. **Exam feedback gap**: Exam released → no instructor feedback → student doesn't know what to improve
   - Current state: Faculty reviews, doesn't always share detail
   - Impact: Exam becomes summative only, not formative
   - Design priority: MEDIUM
   
3. **External tracking debt**: 80-90% build external docs because platform doesn't aggregate
   - Current state: Google Sheets, Notion, paper
   - Impact: Platform is supplementary, not primary
   - Design priority: CRITICAL — solve this, adoption rises dramatically

4. **Accessibility barriers**: Exam tools (Respondus, legacy systems) don't support necessary accommodations
   - Current state: IT workarounds, extra time, separate sessions
   - Impact: Equity gap widens; accreditation risk
   - Design priority: CRITICAL

**Design insights**
- Students want **longitudinal visibility** (skills across rotations, not rotation-by-rotation)
- Students want **just-in-time feedback** (after exam, why did I miss this?)
- Students do NOT care about historical grades (nice-to-have); they care about **upcoming requirements** (critical)

### DCE / Faculty (Director of Clinical Education)

**Role**: Program-side administrator overseeing clinical placements and student evaluations
**Estimated population**: 2,000+ across programs

**Day in the life**
```
8:00 AM  → Arrive; email from registrar: "8 students need new placements" (last minute)
8:15 AM  → Spend 2 hours emailing clinical sites, checking form status manually
10:30 AM → Meeting: "Which students haven't completed CPI yet?" (manual Excel lookup)
12:00 PM → Lunch
1:00 PM  → Configure new course evaluation form (takes 45 min; process unclear, no templates)
2:00 PM  → Review student competencies (Skills Checklist); want to see "who's behind?" — can't easily
3:00 PM  → Prepare accreditation document: manually extract data from 4+ systems into one spreadsheet
5:00 PM  → Grade entry office closes; deadline today (scramble to export from LMS)
6:00 PM  → Depart mentally exhausted; system didn't help today
```

**Critical friction points**
1. **Form governance complexity**: Too many form types, unclear which is current, duplicates exist
   - Current state: Manual tracking, support team decides
   - Impact: Program-wide data quality issues; accreditation risk
   - Design priority: CRITICAL
   
2. **Multi-site coordination overhead**: Each clinical site has different requirements, timelines, tools
   - Current state: Email, phone, spreadsheet tracking
   - Impact: Student placements delayed, data latency (2-3 weeks behind)
   - Design priority: VERY HIGH
   
3. **Reporting without dashboards**: No self-serve accreditation report; must manually compile
   - Current state: Exports → Excel → pivot tables → manual narrative
   - Impact: 40+ hours/year on accreditation prep that could be automated
   - Design priority: VERY HIGH
   
4. **Curriculum mapping scattered**: Bloom's taxonomy, learning objectives not centralized
   - Current state: Syllabus PDF, Word doc, some in Canvas
   - Impact: Can't auto-tag questions; curriculum oversight hard
   - Design priority: HIGH

**Design insights**
- Faculty vary widely: research-focused DCEs want zero overhead (templated); quality-focused DCEs want Bloom's + LO detail
- Power users (20% of DCEs) want export functionality + script access (API)
- Biggest ask: "Give me a dashboard that tells me if students are on track. I don't care about the details; I care about the alerts."

### SCCE (Site Coordinator of Clinical Education) / Clinical Supervisor

**Role**: Clinical site-side supervisor responsible for student supervision and competency verification
**Estimated population**: 5,000+ across clinical sites

**Day in the life**
```
8:00 AM  → Arrive at clinic; no email reminders (site coordinator didn't configure)
8:15 AM  → Check if form from student is available (logs into program portal — unfamiliar)
8:30 AM  → Form is there; small text, guidelines buried below, takes 20 min to complete
9:00 AM  → Resume clinical work (form task done)
12:00 PM → Lunch
1:00 PM  → Another student form; realizes "I did this same task yesterday" — can't remember what I said
5:00 PM  → Clinic closes; no feedback that form was submitted successfully
6:00 PM  → Goes home; doesn't check portal again for 2 weeks
```

**Critical friction points**
1. **Infrequent usage → relearning burden**: Uses system 5-10 times/year; every session requires UI re-learning
   - Current state: Complex IA, no onboarding, no help text
   - Impact: Form takes 25 min instead of 10 min; quality suffers
   - Design priority: CRITICAL
   
2. **Mobile experience broken**: Form fills on phone in clinic; UI not responsive
   - Current state: Desktop-optimized form; zooming required
   - Impact: User switches to paper or delays; data latency
   - Design priority: CRITICAL
   
3. **Reviewer UX unusable**: Small text, guidelines scattered, no side-by-side question-rubric view
   - Current state: Form from legacy design (2019)
   - Impact: Supervisors skip detail review; copy-paste previous responses
   - Design priority: VERY HIGH
   
4. **No success confirmation**: Submit button → unclear if submitted successfully
   - Current state: No email, no confirmation page
   - Impact: User submits twice or doesn't know if submitted
   - Design priority: HIGH

**Design insights**
- SCCE is the most underserved persona; they have lowest friction tolerance
- Mobile-first is non-negotiable for this persona
- Templated responses (copy-paste previous feedback) are currently standard; system should enable this safely

### Program Director / Accreditation Coordinator

**Role**: Institutional leader responsible for accreditation compliance and program outcomes
**Estimated population**: 200+ programs

**Day in the life**
```
Monday  → Accreditation review committee meeting; "Do we have all student eval data?" → scramble to check
Tuesday → Pull data from Exxat, ExamSoft, Canvas, Anthology into master spreadsheet
Wednesday → Manual analysis: "Are competencies improving year-over-year?" → hours of manual pivot tables
Thursday → Draft accreditation self-study section on "Continuous Quality Improvement"
Friday  → Realize half the data is outdated; start over
```

**Critical friction points**
1. **No self-serve accreditation reports**: Must email Exxat support to generate custom report
   - Current state: Support team does manual export
   - Impact: 2-week turnaround; stale data risk
   - Design priority: CRITICAL
   
2. **Data not in accreditor-ready format**: Data exists, but not in accreditor-expected structure
   - Current state: Program Director manually maps to accreditor standard
   - Impact: Error-prone, time-consuming (40+ hours/year)
   - Design priority: CRITICAL
   
3. **Narrative synthesis missing**: What story do the numbers tell? Manual narrative required
   - Current state: Program Director writes text summary manually
   - Impact: Bias, inconsistency, 20+ hours/year
   - Design priority: HIGH
   
4. **Siloed data**: Exam data, competency data, evaluation data live in separate systems
   - Current state: Manual cross-reference
   - Impact: Accreditation story is disjointed; compliance risk
   - Design priority: VERY HIGH

**Design insights**
- Program Directors are willing to pay premium for self-serve accreditation reporting
- They want KPIs at surface level, drillable detail below
- "How do I know my curriculum is working?" is the question Exxat is uniquely positioned to answer

---

## 2E. PERSONAS NOT USING EXXAT PRODUCTS (Acquisition/Expansion)

**Owns**: Market expansion strategy, competitive conversion, new feature justification
**Questions answered**: What's keeping them away? What would bring them?

### Students at non-Exxat programs

**Current tools**: Canvas, Blackboard, ExamSoft, spreadsheets
**Why not Exxat**: Program hasn't purchased; no student-facing marketing
**What would convert them**: Better exam UX than Blackboard Ultra, better competency tracking than Canvas

**Design signals**
- Expect ≥8 question types (formula-based, hotspot, ordering, jumbled sentence, etc.) from Blackboard
- Expect strong accessibility (built-in zoom, reader, annotation)
- Expect mobile exam support (not iPad-only)

### Clinical Supervisors / Preceptors (unactivated)

**Current tools**: Paper, email, spreadsheet, institution-specific systems
**Why not engaged**: Platform designed for institution; supervisor perspective absent
**What would convert them**: Form filling ≤5 minutes, mobile-native, explicit success confirmation

**Design signals**
- Mobile-first is non-negotiable (work from clinic, not desk)
- Template responses must be explicit (not copy-paste legacy)
- Prefer templates over building from scratch

### Faculty at ExamSoft programs

**Current tools**: ExamSoft (assessment), Canvas/Blackboard (course), SurveyMonkey (evaluation)
**Why not Exxat**: Curriculum mapping already in ExamSoft (lock-in), faculty training investment, item analytics strong
**What would convert them**: "Curriculum mapping already done here; switching has no upside"
**Conversion moment**: Accreditation review (budget renewal), faculty satisfaction decline, need for AI features ExamSoft lacks

**Design signals**
- Must exceed ExamSoft on item analysis (Point-biserial, Cronbach alpha, discrimination index)
- Must match curriculum mapping ease or exceed it
- AI question generation is table-stakes, not differentiator

### Program Directors at scale (multi-program institutions)

**Pain**: Managing accreditation data across 3+ disconnected systems
**Opportunity**: Exxat as single source of truth for clinical education lifecycle
**What would convert them**: Self-serve accreditation reporting + curriculum loop closure

---

## 2F. WCAG ACCESSIBILITY CONSULTANT PERSPECTIVE

**Owns**: Legal compliance, user equity, accreditation risk mitigation
**Questions answered**: What are the barriers? How do we remove them?

### Exam Management accessibility requirements (Phase 1)

**Lockdown browser constraint**: Respondus/ExamSoft lockdown blocks OS-level accessibility tools
- Screen readers: Cannot access question text via native NVDA/JAWS
- Magnification: OS zoom 200%+ not available in lockdown
- Captions: Video not captioned by default
- Keyboard: Some question types lack keyboard navigation

**Exxat Phase 1 commitment (Jan MVP)**
| Barrier | Solution | WCAG level | Status |
|---------|----------|-----------|--------|
| Low contrast text | Semantic color tokens (7:1 ratio) | AA | Design ready |
| Focus indicators | 3px dashed ring, high contrast | AA | Design ready |
| Keyboard navigation | Tab order logical, skip links | A | Dev in progress |
| Screen reader text | Alt text on images, ARIA labels | A | Dev in progress |
| Zoom support (in-app) | 150% / 200% zoom button in exam toolbar | AA | Design ready |
| Color not sole indicator | Use icons + color + text always | A | Design audit needed |
| Motion/animation | Reduce motion query respected | AAA | Design ready |

**Exxat Phase 2 commitment (Q1 2027)**
| Barrier | Solution | WCAG level | Timeline |
|---------|----------|-----------|----------|
| Caption requirement | All video must have captions | A | Q4 2026 (content team) |
| Screen reader for questions | Full ARIA implementation for all 7 Q types | AAA | Q1 2027 |
| Low vision support | High contrast mode + larger font defaults | AA | Q4 2026 |

**Legal/accreditation risk**
- ADA Title III compliance mandatory for any digital assessment
- OCR resolution history: 8+ cases against higher ed institutions for inaccessible online exams (2015-2025)
- Accreditors (CAPTE, ACOTE, CCNE) increasingly reviewing accessibility in self-studies
- Mitigation: Exxat as accessibility leader in clinical education space (competitive advantage)

### FaaS accessibility requirements

**Form accessibility checklist (Phase 1)**
- [ ] Form labels associated with inputs (`<label for>`)
- [ ] Error messages linked to inputs (`aria-describedby`)
- [ ] Conditional logic accessible (not just visual)
- [ ] Multi-step form progress indicator (`aria-current`)
- [ ] Mobile keyboard support (no fixed overlays that hide submit button)

---

## 2G. STAFF PRODUCT DESIGNER PERSPECTIVE

**Owns**: Systems thinking, design decisions with tradeoffs, component architecture, handoff clarity
**Questions answered**: How do we design at scale? What are the dependencies? What are we trading off?

### Exam Management — design architecture decisions

**Decision 1: Question Bank folder structure**
| Aspect | Option A | Option B (chosen) | Tradeoff |
|--------|----------|-----------------|----------|
| **Structure** | Hierarchical (unlimited nesting) | Flat + Smart Views | Simplicity vs power user control |
| **User impact** | Power users happy; SCCE confused | All users productive; power users need views | Sacrifice depth for accessibility |
| **Search impact** | Complex query logic needed | Simple keyword + filter | Dev complexity |
| **Decision source** | Discussion with Nipun (PM) | Granola session (Oct consultant input) | — |

**Decision 2: Version control for questions**
| Aspect | Option A | Option B (chosen) | Tradeoff |
|--------|----------|-----------------|----------|
| **Model** | Draft→Published→Archived (3 states) | Draft→Saved→Active + Archive (4 states) | Flexibility vs clarity |
| **User experience** | "Saved" is confusing term | Aligns with document paradigm (Google Docs) | Educate on subtle distinction |
| **Data integrity** | Easier to track changes | Requires audit log discipline | Dev overhead |
| **Decision source** | ExamSoft competitive analysis | Granola + internal team consensus | — |

### Course Evaluation (PCE) — design architecture decisions

**Decision 1: Two-instrument vs. one unified survey**
| Aspect | Option A (unified) | Option B (two-instrument) | Tradeoff |
|--------|-----------------|----------------------|----------|
| **Structure** | One form, conditional sections | Student PCE + Faculty Reflection separate | Flexibility vs admin overhead |
| **Routing** | Auto-route based on role | Explicit routing rules | User control vs complexity |
| **Response rate** | Likely lower (merged context) | Likely higher (distinct purposes) | Adoption vs survey fatigue |
| **Decision source** | Initial product brief | Granola session (Jul 13) + Arun alignment | — |

**Decision 2: Analytics dimensions (by Term vs by Faculty vs by Course)**
| Dimension | User | Purpose | Complexity |
|-----------|------|---------|-----------|
| By Term | Program Director | "How are we trending YoY?" | Medium — heatmap view |
| By Faculty | Department Head | "Who needs support?" | High — leaderboard + drill-down |
| By Course | Curriculum Chair | "Which courses need revision?" | High — longitudinal + comparison |

**Design handoff criteria (for all products)**
- Every component has a purpose statement ("Why this component?")
- Every decision has a tradeoff documented (what we gave up)
- Every interaction has a state matrix (hover, active, error, disabled, loading)
- Every color use has a semantic meaning (not arbitrary)
- Every chart has a "Why:" subtitle

### Component reuse strategy

**Exxatly-NEW-DS constraints**
- Prism color (purple #6d5ed4) = Exam Management
- Coral (#e8604a) = FaaS
- Teal (#0d9488) = Course Evaluation
- Amber (#d97706) = Skills Checklist
- Pink (#db2777) = Learning Contracts

**Components must work across all 5 products**
- MetricCard: Shows KPI + spark line + context (used in all analytics)
- AIStrip: Callout for AI-generated content (used in suggestions, syntheses)
- BPRow: Service blueprint swim lane (used in all service blueprints)
- DecisionCard: Architectural decision + rationale (used in all design docs)

---

## 2H. STAFF UX RESEARCHER PERSPECTIVE

**Owns**: User research methodology, insight rigor, validation strategy, research roadmap
**Questions answered**: Do we understand the user? Are we validating assumptions? What's our next research sprint?

### Current research inventory (as of Jul 28, 2026)

| Method | Exam Mgmt | PCE | FaaS | Skills | Learning | Rigor | Last session |
|--------|----------|-----|------|--------|----------|-------|--------------|
| Granola (interview + notes) | 15+ | 18+ | 8+ | 3+ | 2+ | HIGH | Jul 28 |
| Student interviews | 5+ | 3+ | 2+ | 1+ | 0 | MEDIUM | Jul 12 |
| Faculty shadowing | 1+ | 0 | 1+ | 0 | 0 | HIGH | Mar 15 |
| Support ticket analysis | Active | — | High volume (95K) | — | — | MEDIUM | Quarterly |
| Usability testing | 0 formal | 0 formal | 0 formal | 0 formal | 0 formal | — | — |

**Research gaps (priorities)**
1. **Exam Management**: Formal usability testing (min 5 users) on question bank UX before Jan MVP
   - Why: Question bank is core competitive parity; must be easier than ExamSoft
   - Timing: Nov 2026 (8 weeks before MVP)
   - Budget: 40 hours (recruit, facilitate, analyze)

2. **FaaS**: Form builder usability testing (existing forms vs new governance model)
   - Why: FaaS is revenue crisis (NPS 2/5); support tickets are 95K/year
   - Timing: Aug 2026 (parallel to current redesign)
   - Budget: 60 hours (existing users + new user workflows)

3. **Course Evaluation**: Field validation of analytics model (Program Director interviews)
   - Why: Analytics design is complete (80%), but haven't validated "by Term / by Faculty / by Course" against real workflows
   - Timing: Aug 2026 (before dev handoff June 1 → deployment)
   - Budget: 20 hours (6 interviews, 3 programs)

4. **Skills Checklist + Learning Contracts**: Discovery (currently underpopulated in rr-insights)
   - Why: No research yet; both products lack clear user needs
   - Timing: Sep 2026
   - Budget: 80 hours (15 interviews across personas)

**Validation strategy (for all products)**

Before shipping any feature:
1. **Research question**: What assumption are we making?
2. **Method**: How will we test it? (interview, A/B test, survey, usability test)
3. **Success criteria**: How will we know it's true?
4. **Contingency**: What if we're wrong?

**Example: Exam Management question types (7 types in MVP)**
- Assumption: "Students will succeed with these 7 types"
- Method: Usability test (5 students taking sample exams with all 7 types)
- Success criteria: 100% task completion; 7+/10 ease rating
- Contingency: If failure rate >20%, add tutorial or simplify type

---

## 2I. STAFF CONTENT STRATEGIST PERSPECTIVE

**Owns**: Messaging, terminology, onboarding, help content, narrative synthesis
**Questions answered**: What do we call this? How do we explain it? What's the story?

### Content strategy by product

#### Exam Management terminology alignment

**Current state vs. preferred**
| Current term | Problem | Preferred term | Why |
|--------------|---------|----------------|-----|
| "Question Bank" | Too generic (could be ExamSoft, Canvas) | "Question Library" | Implies shared, curated, searchable |
| "Assessment" | Used by all platforms; ambiguous | "Exam" (to students), "Course Exam" (to faculty) | Clarity; "exam" is what students take |
| "Item Analysis" | Jargon; faculty see this in ExamSoft | "Question Performance" or "Item Review" | Descriptive; aligns with user mental model |
| "Cronbach's Alpha" | Pure jargon; 90% of faculty don't know it | "Test Consistency Score" | Explains what it measures |

**Help content strategy**
| User | First-time action | Help needed | Format |
|------|------------------|------------|--------|
| Faculty | Create first exam | 5-min video tour of Assessment Builder | Video inline (not separate tutorial) |
| SCCE | Submit form via FaaS | 3-step mobile-optimized guide | Contextual help (on form page) |
| Program Dir | Generate accreditation report | 8-min narrative (what data exists, how to interpret) | Guided walkthrough (not static doc) |

#### PCE content strategy

**Narrative synthesis (AI-generated themes for open-text responses)**

Example: Course evaluation asks "What was the most challenging topic?" (open text)

**Current state**: Faculty read 50 text responses manually
**Designed state**: AI generates:
```
"Common challenges (50 responses):
- Pharmacokinetics (14 mentions, 28%)
- Drug interactions (12 mentions, 24%)
- Dosage calculations (8 mentions, 16%)
...

Faculty interpretation: 'We need 2 weeks on PK, not 1.5 weeks'"
```

**Content requirement**: Explain what AI is doing + why we trust it
- Show sample themes + source quotes
- Explain limitations ("These are patterns in responses; human interpretation still required")
- Provide override option ("Hide this theme; it's not representative")

#### FaaS terminology (governance model)

**Current state**: Form authors have no mental model for "CRITICAL vs MANAGER REVIEW vs WARNING ONLY"
**Content needed**:
| Tier | Plain language | Example | When to use |
|------|----------------|---------|------------|
| CRITICAL | "System will prevent" | SSN field in student form | Legal/compliance risk |
| MANAGER REVIEW | "Your manager approves" | Adding required field to existing form | Scope creep risk |
| WARNING ONLY | "System will flag, you decide" | Adding optional comment field | Low risk; advisory only |

**Help format**: Interactive quiz ("Which tier does this belong in?") with explanations

---

## 2J. MOTION/INTERACTION DESIGNER EXPERT PERSPECTIVE

**Owns**: Transitions, feedback loops, state changes, cognitive load reduction through animation
**Questions answered**: How do we guide attention? How do we reduce confusion through motion?

### Motion principles for clinical education context

**Rule 1: Clinical-grade, not delightful**
- No bounce, spring, or playful animation
- Every motion has a functional purpose: explain state change, guide attention, or reduce cognitive load
- Timing: 150-400ms (human perception range for state feedback)

**Rule 2: Respect motion preferences**
- `prefers-reduced-motion` must be respected (accessibility requirement)
- Fallback: instant state change if motion disabled

### Application-level motion strategy

#### Exam Management motion

| Interaction | Purpose | Timing | Easing |
|-------------|---------|--------|--------|
| **Question Bank → view detail** | Expand inline without page load | 200ms | ease-in-out |
| **Assessment Builder → add question** | Scroll to new question + focus | 150ms fade | ease |
| **Student exam → submit answer** | Feedback: answer recorded + checkmark | 100ms | ease |
| **Faculty review → mark question bad** | Flag updates instantly; summary updates | 150ms | ease |
| **Score adjustment → live preview** | Updated score appears in real-time | 100ms | linear |

#### PCE analytics motion

| Interaction | Purpose | Timing | Easing |
|-------------|---------|--------|--------|
| **Tab switch (Insights → Analytics)** | Fade content area + slide chart in | 200ms | ease-in-out |
| **Data drill-down (Term → Faculty → Individual)** | Expand detail row, collapse others | 200ms | ease-in-out |
| **Heatmap hover** | Highlight cell + show tooltip | 100ms | linear |
| **Narrative synthesis (expand themes)** | Slide-down detail + fade-in quotes | 150ms | ease-in-out |

### Micro-interaction patterns

**Pattern 1: Form submission feedback**
```
1. User clicks "Submit" (button disabled immediately)
2. Loading state: spinner + "Saving..." (optional, if >2s wait)
3. Success: checkmark + "Saved" label + color change to teal (150ms)
4. Hold: Color stays 2 seconds
5. Reset: Button returns to normal state (100ms fade)
Total UX time: <4 seconds, never leaving user wondering
```

**Pattern 2: Error detection + correction**
```
1. User fills form, hits validation error (red border + icon appear instantly)
2. Inline error message slides down (150ms)
3. User fixes error
4. Border + message fade out + green checkmark appears (150ms)
4. Clear: User understands field is valid
```

**Pattern 3: AI-generated content arrival**
```
1. User clicks "Generate summary" (button → "Generating..." state)
2. Content area shows skeleton (placeholder) + faint loading bar
3. AI response arrives: skeleton fades out, content fades in (200ms)
4. Result: Clear signal that content is new, from AI, not existing
```

### Accessibility in motion

- Motion must never be required to understand state
- Every motion-based signal must have a redundant text/color/icon signal
- Example: "Score updated" cannot be motion-only; must also have text label + icon

---

## 3. COMPETITIVE MARKET POSITION (as of July 2026)

### Market positioning audit

**Exxat position**: Sole platform for clinical education lifecycle + accreditation intelligence
**Year 1 north star**: Beat generic LMS (Canvas free)
**Year 2 north star**: Match ExamSoft Enterprise ($200K/program/year)
**Year 3 north star**: Exceed ExamSoft via AI (AI proctoring, curriculum synthesis)

### Why Exxat wins

1. **Unique data**: Exxat owns placement rotation context (where competency is demonstrated clinically)
2. **Accreditation narrative**: Only Exxat connects exam performance → competency verification → accreditation readiness
3. **Clinical focus**: Every product designed for healthcare education, not generic education
4. **Founder knowledge**: Romit's prior Exxat experience + HCI research = systems thinking no competitor has

### Risks to win

1. **Offline exam download (Jan cut, Mar add)**: Major parity gap vs ExamSoft until March
2. **Faculty training debt**: ExamSoft customers have 10+ years of training; Exxat has zero
3. **Question bank lock-in**: Questions in Exxat don't port to ExamSoft; switching risk is now OURS
4. **LMS integration complexity**: Each LMS (Canvas, D2L, Blackboard) requires custom integration; resource-intensive

---

## 4. INSIGHT TAGGING SCHEMA (v2.0)

Every insight carries two tags: **Type** + **Product**

### Type tags (mutually exclusive)

| Tag | Definition | Example |
|-----|-----------|---------|
| **Theme** | Pattern appearing in 2+ sources/products; high-level signal | "Students build external tracking docs because platform lacks longitudinal view" |
| **Gap** | Unmet need or broken experience; direct design opportunity | "SCCE form submission has no success confirmation; users submit twice" |
| **Opportunity** | Specific design intervention grounded in Gap or Theme | "Add inline confirmation toast after form submit; copy email confirmation pattern" |
| **Persona signal** | Behavior/quote/friction tied to specific persona | Quote: "I spend 80-90% of class time creating my own assignment tracker" (Student) |
| **Platform signal** | Appears in 3+ products; requires architecture-level thinking | Cognitive overload + reporting deficit + manual config debt = design at system level |

### Product tags

- `exam-management`
- `course-eval`
- `faas`
- `skills-checklist`
- `learning-contracts`
- `cross-product`

### Example insight (properly tagged)

```
ID: ins-001
Title: "External tracking documents as proxy for platform gaps"
Type: Theme
Product: cross-product (Exam, PCE, Skills, FaaS, Learning Contracts)
Source: Student interviews (5+ sessions) + support ticket analysis
Signal: "80-90% of student cohort builds external Google Sheets or Notion doc to track assignments, exams, competencies across all courses"
Why it matters: Platform is supplementary, not primary; students perceive it as incomplete
Design opportunity: Build longitudinal view that aggregates all student tasks (upcoming exams, due forms, pending competencies, placement schedule)
Severity: CRITICAL — blocks adoption, contradicts product value prop
```

---

## 5. PRODUCT CATALOG (UPDATED Jul 28, 2026)

### Exam Management

**Phase**: QA (Question Bank, Assessment Builder, Student UX in progress; Question Creator, Assessment Settings in dev)
**MVP deadline**: January 20, 2026
**Granola sessions**: 15+
**Design completeness**: 90% (prototypes live, all 5 roles covered)

**Key decisions documented**:
- Folder structure: Flat + Smart Views (not hierarchical)
- Versioning: Draft→Saved→Active + Archive (3 states vs 4)
- Question types: 7 (MCQ, Matching, Short Answer, True/False, Essay, Calculation, Image-based)
- Accessibility: In-app zoom + WCAG 2.1 AA (lockdown constraint work-around)
- Offline support: January cut (download in March)

**Success metrics (MVP)**:
- Question Bank ease: 7+/10 (vs ExamSoft baseline 6/10)
- Faculty adoption: 5+ pilot customers
- Exam completion: 100+ exams delivered
- Support burden: <5 tickets/customer/month

### Course Evaluation (Post-Course Evaluation)

**Phase**: Design phase (80% complete; feedback cycles ongoing)
**Dev handoff**: June 1, 2026
**Granola sessions**: 18+
**Analytics implementation**: Multi-survey model (by Term, Faculty, Course defined)

**Key decisions documented**:
- Two-instrument architecture: Student PCE + Faculty Reflection (separate surveys, distinct routing)
- Role-based routing: Student → Faculty + Program Director + Dean; Faculty → Program Director only
- Distribution: Calendar-integrated, bulk send with reminder workflow
- Analytics dimensions: By Term (KPI focus), By Faculty (leaderboard), By Course (longitudinal)
- Narrative synthesis: AI-generated theme summaries (Q3+)

**Success metrics (MVP)**:
- Design completion: 100%
- Dev handoff confidence: 100% (all designs documented, tradeoffs explained)
- Adoption: 3+ pilot programs
- Response rate: ≥50% (vs Anthology PDF 25%)

### FaaS 2.0

**Phase**: Active redesign (governance model + governance UI)
**Crisis**: 95K support tickets/year, NPS 2/5
**Granola sessions**: 8+
**Redesign focus**: Three-tier governance (CRITICAL auto-reject, MANAGER REVIEW manual approval, WARNING ONLY logging)

**Key decisions documented**:
- Governance tiers: Based on compliance risk (HIPAA, FERPA, ADA)
- Form templates: Discipline-specific (PT, OT, PA, Nursing, Social Work, Counseling)
- Accreditation alignment: All fields mapped to competency outcomes
- SCCE priority: Mobile-first form completion + templated responses

**Success metrics (Q3 2026)**:
- Support ticket reduction: 95K → 60K/year (-37%)
- Form quality: 70% self-service (no support needed)
- Compliance: 100% HIPAA/FERPA/ADA tagged

### Skills Checklist

**Phase**: Discovery (underpopulated; needs synthesis)
**Priority**: Medium-high (accreditation requirement)
**Research gap**: Only 3+ Granola sessions; needs comprehensive user research

**Known requirements**:
- Student visibility: "Have I done this skill across all rotations?"
- Supervisor verification: Clinical supervisor confirms skill demonstrated
- Program view: "Which students are behind on which skills?"
- Longitudinal tracking: Skill progress over time (not per-rotation)

### Learning Contracts

**Phase**: Discovery (underpopulated; needs synthesis)
**Priority**: Medium (collaboration + accountability workflow)
**Research gap**: Only 2+ Granola sessions; needs user context research

**Known requirements**:
- Student + mentor alignment: Agree on learning objectives
- Progress tracking: Weekly or per-rotation check-ins
- Competency link: Contract objectives map to program competencies
- Accreditation export: Bundle into accreditation self-study

---

## 6. GRANOLA SYNC CHECKLIST (Last updated: Jul 28, 2026)

**Sessions this period**: 33 meetings (Jun 29 - Jul 28)
**New insights extracted**: 12 (Exam Mgmt, PCE, FaaS, Design System alignment)
**Repo status**: Ready for push

**Next sync actions**:
- [ ] Extract remaining Granola sessions (Skills Checklist, Learning Contracts) in next period
- [ ] Run formal usability test on Question Bank (4 weeks before Jan MVP)
- [ ] Validate analytics model with Program Directors (Aug 2026)
- [ ] Complete Skills Checklist + Learning Contracts research (Sep 2026)

---

## 7. VERSION HISTORY

| Version | Date | Major changes |
|---------|------|---|
| 5.0.0 | 2026-07-28 | **MAJOR REVISION**: 8-perspective architecture (Product, Competitor, Indirect, Personas Active/Inactive, Accessibility, Design Leadership, Research, Content + Motion). Incorporated latest Granola sessions (Jul 28). Updated product registry with timelines. Added success metrics framework. Enhanced decision documentation. |
| 4.0.0 | 2026-03-26 | Sections 15–18: content strategy, typography, color rules, motion principles, data viz guidelines, Granola sync v4, 7-tab architecture, repo isolation |
| 3.0.0 | 2026-03-25 | Exam Management deep product intelligence, product template standard |
| 2.0.0 | 2026-03-23 | Initial SKILL.md with 5 products, 10 POV lenses, Claude architecture whiteboard |

---

**SKILL.md v5.0 complete. Ready for GitHub sync and rr-insights deployment.**
**GitHub repo: soleyromit/rr-insights**
**Deployment: soleyromit.github.io/rr-insights**
