---
name: rr-insights
version: 5.5.0
last_updated: 2026-03-28
author: Romit Soley, Product Designer II, Exxat
description: >
  The cohesive intelligence agency for clinical and didactic education product design.
  Governs how Claude operates as data visualizer, UX researcher, content strategist,
  product leader, market analyst, competitor intelligence, accessibility consultant,
  and staff designer mentor across all 5 Exxat products.
---

# rr-insights SKILL.md v5.5
## The intelligence agency for a Staff Product Designer in healthcare education SaaS.

---

## AGENCY MANDATE

This skill is a cohesive operating system. Every session, Claude operates as ALL of these simultaneously:
1. Data visualizer (D3.js, Recharts, Highcharts-level thinking for scalable scenarios)
2. UX researcher (reads every Granola transcript and project attachment before answering)
3. Content strategist (empathetic, story-driven content with clinical vocabulary)
4. Product leader (connects dots across 5 products and the accreditation ecosystem)
5. Market analyst (living competitor intelligence with examples, visuals, use cases)
6. Accessibility consultant (WCAG 2.1 AA, Title II ADA April 24 2026, lockdown browser)
7. Staff designer mentor (identifies gaps between current work and Staff/Principal bar)
8. Information architect (connects content, features, and product ecosystem for leadership)

INFORMATION NETWORK PRIORITY (check all before answering):
1. Project attachments in context (PDFs, markdown, HTML, Excel, DOCX)
2. Granola raw transcripts via get_meeting_transcript (not summaries)
3. rr-insights data (insights.ts, personas.ts, products.ts)
4. SKILL.md accumulated intelligence
5. Web search for competitor intelligence and current trends

Missing a project attachment is a protocol violation, not a knowledge gap.

---

## 0. THE NORTH STAR

Measure what delightful experience looks like
  to How we make experience better
    to That is what we will build
      to Changes
        to Delightful Experience (circle, not a line)

Three questions anchoring every session:
1. Who are the users?
2. What do the users need?
3. What is their current experience?

The finish line: does the feature eliminate the external spreadsheet entirely?

---

## 1. INFORMATION CONNECTION GRAPH

When Claude synthesizes, it connects these nodes:

Raw transcript signal to Granola session to Insight tag to Product view in rr-insights to Magic Patterns component to GitHub commit

Project attachment to Architecture decision to Design system token to Magic Patterns

Competitor feature to Gap analysis to Design opportunity to Feature priority to rr-insights visualization to Stakeholder deck

THE PRASANJIT EXAMPLE (template for how connections work):
Session 13352a23 (Prasanjit): FaaS numeric field has no inline validation.
Student can type any number. Error only appears on submit.

This single observation connects to:
- Gap ins-faas-gap-23 (scroll sync + no field validation)
- WCAG 3.3.1 violation: error identification must be immediate
- Indirect competitor gap: SurveyMonkey, Typeform, Google Forms all validate inline
- FaaS self-service launch blocker
- Magic Patterns: FaaS form controls need validation state variants
- Design fix: inline validation with character/number limits as helper text

Every insight must be connected this way, not stated in isolation.

---

## 2. PROJECT ATTACHMENTS INDEX

These are always in context. Always check them before answering.

Stakeholder_Summary_Day1.md: System hierarchy, competitor analysis, shortcuts-not-copies model, versioning, phased rollout, Canvas two-systems problem
Stakeholder_Summary_Day2.md: QB deep-dive, tagging (4 categories), versioning mechanics, access permissions, sharing model
marks_weightage_features.md: Section/question marks, equal distribution, partial credit, negative marking, Bloom's-based distribution, phase priorities
question_bank_roles_and_statuses.md: All roles (Inst Admin, Dept Head, Initiative Lead, Faculty, Reviewer), all statuses (Draft/Ready/Active/In Review/Approved/Update Available/Locked), V0 simplified model, deletion policy
question_creation_data_model.md: Layer A QB metadata, tag types, compound difficulty+year tag, cross-dept sharing model, AI shadow tags
how_to_group_questions.md: Clinical vignette grouping, always-together logic
Phases_Walkthrough_Specs.md: Phase-by-phase exam management walkthrough
Navigation_Architecture_Blueprint.md: Navigation IA
UX_Prototype_Task_Checklist.md: Prototype QA checklist
marks_weightage_features.md: Full marks feature spec (read before building any marks UI)
assessment_tool.md: Assessment tool spec
system_hierarchy_blueprint.md: Institution to Dept to Course to Section hierarchy
system_hierarchy_blueprint_Full_Adversarial_Stress_Test.md: Edge cases and failure modes
Exam_Management__Jan_20_2026_2.pdf: Jan 20 exam management spec
Exam_Management__Single_Question__Versioning_and_Profiles.pdf: Versioning and profiles deep-dive
Exam_Management___KT.pdf: Knowledge transfer document
Tagging_Strategy_1.pdf: Full tagging strategy
Touro_PA___Notes_from_Vishaka.pdf: Vishaka's Touro PA field notes
Touro_PA_site_visit_March_11__1_.docx: Touro PA site visit notes
Immunomicro_1.pdf: Competitor reference
Spring_2025_MOCES_PHTH_7504_1.pdf: Sample clinical evaluation (PCE reference)
NPS_2025_Textual_Responses_1.xlsx: 2025 NPS textual responses (FaaS NPS data)
Fall_2025_Tracker.xlsx: Fall 2025 tracker
Examsoft_demo__2_.docx, Examsoft_demo__3_.docx: ExamSoft demo session notes
Open_Questions_on_Course_Evaluations.docx: PCE open questions
Post_course_evaluation_survey_tool.docx: PCE survey tool spec
post_course_eval_primer_v2__1_.docx: PCE primer v2
PXL_20260320_*.jpg: Whiteboard photos from Mar 20 accessibility session
SKILL_v4_0_0.md: Previous skill version for reference
weekly-report-2026-03-27.html: Executive NPS + session intelligence weekly report for Aarti (Mar 27, 2026)

---

## 3. DOMAIN EXPERT SIGNAL EXTRACTION

PRIMARY DOMAIN EXPERTS (highest signal density, check raw transcripts):

AARTI (CEO):
- Title II ADA hard legal deadline: April 24, 2026. "Anything we release has to be accessible from day one." (f29a990d)
- FaaS 3-pane builder is inaccessible. "Most competitors have similar layout. But they are not accessible." (f29a990d)
- Do not reduce accessibility scope. "Don't reduce scope from day one." (f29a990d)
- Tagging = post-exam competency analytics. "After the test it tells you: strong in logic, weak in analytical." (f29a990d)
- AI everywhere on admin side. Faculty time reduction is the primary metric. (791334af via Arun)
- Vishaka is day-to-day PM lead for Exam Management. Romit's primary PM partner. (Arun, 791334af)
- Offer letter performance criteria (Kunal Vaishnav, Mar 15 2026) tracked in ArunPerformanceView: requirements alignment, collaboration with PM, prototype delivery by Apr 17, accessibility implementation, design system velocity, stakeholder communication, cross-product thinking.
- Prototypes by Apr 17 demo = highest-risk criterion. Vishaka sync + Thursday weekly are Apr 1 actions.
- Signal type: Executive mandate. Non-negotiable.

KUNAL (COO):
- Submit button: faded/de-emphasized until last question OR last 5 minutes, then primary CTA. Always visible, never hidden. (f29a990d)
- Flag system: 2x2 matrix (answered/unanswered x flagged/unflagged), not three separate buckets. (f29a990d)
- Progress bar = questions answered, not question number. (f29a990d)
- No product chrome in exam window: new browser window, full screen, no Exxat navigation. (f29a990d)
- Signal type: COO-level product decision. Confirmed.

VISHAKA (VP Product / daily authority on Exam Management):
Layer 1 - Terminology (shapes what appears in UI):
- CATEGORIES = school-defined, mandatory, admin-set (not modifiable by faculty)
- TAGS = personal, optional, faculty-owned
- DRAFT = incomplete WIP, cannot be added to any exam even by author
- PRIVATE = complete, intentionally restricted to creator only
- These are two distinct states with visually distinct treatments (Nipun confirmed, 6fdcd0dd)
- Smart Views = Zendesk ticket views: master pool + rule-based filters (Nipun, 6fdcd0dd)
- Course = parent entity (tenant level), not offering (term level) (f59ac2a6)

Layer 2 - Workflow logic:
- QB landing = assessment creation mode front and center (Nipun, f59ac2a6)
- Online approval workflow replaces offline email (8c94698f)
- School-shared Smart Views (admin-created) + personal Smart Views (faculty-created) (6fdcd0dd)
- Course assignment is optional: no forced FK, milestone exams are course-free (Arun to Darshan, 6fdcd0dd)
- Flat pool + scoped views, never folder hierarchy (8c94698f)

Layer 3 - Competitive positioning:
- ExamSoft anti-AI = Exxat open door (Arun, 791334af)
- ExamSoft folder structure = most-complained-about UX in academic assessment
- Flat pool + smart views = what Canvas and Blackboard already do

Layer 4 - Quality standards:
- KR-20 >= 0.80 = good, >= 0.90 = excellent
- Point-biserial negative = remove the question
- Upper 27% / lower 27% analysis is standard
- Z-score methodology for EOR comparison, not raw scores (Ed Razenbach, ca5a709c)

DAVID STOCKER (faculty user, Touro - real user voice, not PM opinion):
- "This is very much a database feel. I think it would be great to have visualization showing what percentage of my questions are hard vs easy." (f59ac2a6)
  -> Difficulty distribution chart is a CONFIRMED user request, not UX inference
- "Is this percentage correct across every time the question has been used? Can I filter that by semester or course offering?" (f59ac2a6)
  -> Contextual Link Profile (question x course x cohort) is a confirmed user need
- Faculty want year-over-year comparison for the same course
  -> Cohort trend line in post-exam analytics is a confirmed UX need

ED RAZENBACH (DCE/PA program director - practitioner expert):
- Predictive success model using slope/intercept with 8 data points including PACRAT z-scores
- AI remediation: per-student personalised question sets on weak competencies
  "Two students failed family medicine but each got completely different question sets from me." (ca5a709c)
- Uses AI currently: "I give it the PACRAT results by topic and it generates questions. A lifesaver." (f5d66e4c)
- KR-20, point-biserial, upper/lower 27% are his standard review tools (ca5a709c)

DR. VICKY MODY (faculty, pharmacy school - real user, Blackboard power user):
- Formula/variable injection questions: "If I have 10 students, 10 students get different x and y. ExamSoft does not have this." (2768ba8d)
- Ordering question type: "ExamSoft does not have ordering. Very important for glycolysis steps." (2768ba8d)
- Course ID sync: registrar generates course IDs before each term, synced to ExamSoft (2768ba8d)
- Uses Blackboard only for uploading notes and content sharing, not assessment (confirmed ExamSoft retention)

NIPUN (junior PM - architecture decisions with Vishaka oversight):
- Per-option rationale is better than shared rationale. "Maybe better if we give different rationales for different options." (4c9b94f5)
- ACR/VPAT report required for every release. "We need to generate an ACR report for whatever design we are trying to make." (4c9b94f5)
- Learning mode vs assessment mode: "If it is just a mock exam, the teacher might want to show the rationale after selecting the answer." (4c9b94f5)
- For July UNF pilot: do not change layout, only add accessibility features. After July: redesign. (4c9b94f5)

HARSHA (PM - FaaS architecture):
- FaaS must be headless. "Looks like an outlier. Should be more like a headless application." (9f1f5f4f)
- No simulator/preview mode: 2-3 month error discovery lag. (9f1f5f4f)
- Free-text tag entry = silent data corruption via spelling mistakes. (9f1f5f4f)

PRASANJIT (PM - FaaS/patient log):
- Section scroll synchronization is broken: moving to a new section does not update the section indicator. (13352a23)
- No inline field validation: numeric fields accept any value, error only on submit. (13352a23)
- Color coding for sections was removed in FaaS migration, making it impossible to distinguish sections. (13352a23)
- ICD code lookup: chips not displaying clearly after selection. (13352a23)

---

## 4. COMPETITOR INTELLIGENCE

### Direct Competitors

EXAMSOFT (primary competition):
What they do best: Deep medical education domain fit, curriculum mapping to USMLE/PAEA, item analytics (KR-20, point-biserial, upper/lower 27%), lockdown browser security, established faculty training over 20+ years.
Retention anchor at Touro: "Curriculum mapping already done in ExamSoft" (Mary, f5d66e4c)
What they never do: AI (publicly anti-AI), online approval workflow (all offline), flat pool architecture (folder silos), formula/variable questions, ordering questions.
Exxat gap to exploit: AI generate from slides, blueprint assembly, AI remediation, flat pool, online approval.

D2L BRIGHTSPACE:
What they do best: LMS integration, broad institutional use, accommodation management.
Gap vs Exxat: Accommodation assignment is manually per-student per-quiz. Exxat can do profile-based once-for-all.

BLACKBOARD ULTRA:
What they do best: 8+ question types including formula-variable injection, ordering, jumbled sentence. AI question generation. Clean redesigned UX.
Confirmed by Dr. Vicky Mody (2768ba8d): faculty use Blackboard only for content sharing, not assessment.
Gap vs Exxat: No medical accreditation reporting, no clinical placement context.

CANVAS LMS:
Two Systems Problem (documented in Stakeholder_Summary_Day1.md): Classic Quizzes questions locked in course + New Quizzes questions instructor-owned and shareable = two separate systems that do not connect. Manual migration required.
This is the exact problem Exxat avoids with flat pool from day one.

SURPASS:
Draft to In Review to Approved publishing pipeline is the industry precedent for Exxat ReviewQueue. This workflow is validated.

MEDITREK:
Competency tracking and clinical hours. Exxat advantage: deeper placement context. Skills Checklist must surpass Meditrek on cross-placement program-scoped tracking.

### Indirect Competitors (feature-level)

SURVEYMONKEY / TYPEFORM (FaaS 2.0 overlap):
- Self-service form creation, branching logic, response analytics
- Both validate inline. Prasanjit gap (13352a23): FaaS has no inline validation.
  This is a WCAG 3.3.1 violation AND fails the basic expectation set by these tools.
- Design fix required: real-time validation with visible limits, inline error messages.

QUALTRICS (Course Eval, FaaS overlap):
- Survey analysis, theme extraction, reporting
- Touro uses Qualtrics instead of Exxat eval. Reporting depth is the retention anchor.
- Fix: AI theme extraction from open-text responses (confirmed by Aarti, Touro meeting).

GOOGLE FORMS (FaaS baseline):
- Zero-friction form creation. This is the baseline clients compare against.
- If FaaS is harder than Google Forms, self-service adoption will never happen.

UWORLD / KAPLAN (Exam Management remediation):
- Ed Razenbach uses these as reference for how AI remediation should work (PAEA-style format)
- AI remediation sets in Exam Management should match UWorld question format.

PENDO (platform-wide):
- Product analytics, feature adoption tracking
- Gap: Exxat has no Pendo. Insights come from Granola + support tickets.
- When Pendo becomes available, integrate into rr-insights analytics views.

---

## 5. PRODUCT REGISTRY WITH CONFIRMED DECISIONS

### Exam Management
Status: Active redesign. Most important project at Exxat (Arun, 6fdcd0dd).
Key dates: April 17 demo, August Cohere launch, Nov-Dec ExamSoft parity.
Resourcing: No cap on hiring (Arun, 6fdcd0dd). Design ambitiously.

Confirmed design decisions (all from raw transcripts, do not override without new session evidence):
1. QB landing = assessment builder mode front and center (Nipun, f59ac2a6)
2. Flat pool + Smart Views, not folder hierarchy (8c94698f)
3. DRAFT = incomplete, unusable even by author / PRIVATE = complete, restricted to creator (Nipun, 6fdcd0dd)
4. CATEGORIES = school-defined mandatory / TAGS = personal optional (Vishaka, 6fdcd0dd)
5. Submit button: faded until last Q or last 5min, then primary CTA (Kunal, f29a990d)
6. Flag: 2x2 matrix, not 3 buckets (Kunal, f29a990d)
7. Section lock: free-nav vs locked GRE model (Kunal/Aarti, f29a990d)
8. Alt text = publish gate blocker, WCAG 1.1.1 (Aarti, f29a990d)
9. Per-option rationale mode + shared rationale mode (Nipun, 4c9b94f5)
10. ACR/VPAT required per release (Nipun, 4c9b94f5)
11. Ordering question type (Dr. Vicky Mody, 2768ba8d)
12. Formula/variable injection questions (Dr. Vicky Mody, 2768ba8d)
13. Course assignment is optional, no forced FK (Arun, 6fdcd0dd)
14. Tagging = competency analytics engine (Aarti, f29a990d)
15. AI everywhere on admin side, never on student exam side (Arun, 791334af)
16. AI generate from lecture slides (Ed Razenbach, f5d66e4c)
17. Blueprint assembly: describe exam, system builds (Arun, 791334af)
18. AI remediation: per-student personalised question sets (Ed Razenbach, ca5a709c)
19. KR-20, point-biserial, upper/lower 27% in post-exam analytics (Mary/Ed, f5d66e4c, ca5a709c)
20. Curve options: full credit / bonus / answer key change (ExamSoft parity, f5d66e4c)
21. Difficulty distribution chart (David Stocker, faculty user, f59ac2a6)
22. Per-cohort performance filtering on questions (David Stocker, f59ac2a6)
23. Design system is NOT mandated by Arun. Speed of delivery > conformity. (791334af)
24. Vishaka is daily authority. Nipun is junior PM. (Arun, 791334af)
25. Marks and weightage system (marks_weightage_features.md full spec)
26. React rebuild confirmed — new frontend architecture (Mar 23-27 sessions)
27. 3-year roadmap locked (Mar 23-27 sessions)
28. QB Architecture: flat pool + Smart Views, 4 roles (Author/Reviewer/Consumer/Admin), status lifecycle (Draft → Ready → Active → In Review → Approved → Update Available → Locked), 7 tag categories — all documented in QB Architecture tab
29. Anticipatory AI pattern confirmed: system pre-generates next likely action before user requests it (Mar 23-27 sessions)

Missing from current design (not yet built):
- Marks and weightage UI (full spec in marks_weightage_features.md)
- Formula question surfaced in question type picker (component exists, not wired)
- LMS course ID sync (Dr. Vicky Mody, 2768ba8d)
- Patient log clone feature (Prasanjit confirmed shipping in current release)

### FaaS 2.0
Status: Q2 scope. Internal users first, then self-service rollout.
NPS baseline: 2/5. 95,000+ annual support tickets.
Q2 strategy: Template-first entry. 80-85% of creation is template clone. (Akshit, 19c032d2)

Critical signals not yet fully designed:
- [CRITICAL] Simulator/preview before publish — 2-3 month error discovery lag is confirmed (Harsha, 9f1f5f4f). Highest-severity FaaS gap.
- Headless architecture: FaaS components must inherit host module visual language (Harsha, 9f1f5f4f)
- Structured dropdown autocomplete for tag types replacing free-text (Harsha, 9f1f5f4f)
- Inline validation on all fields with visible limits (Prasanjit, 13352a23)
- Section color coding restored (Prasanjit, 13352a23)
- 3-pane builder accessibility issue: use linear wizard instead (Aarti, f29a990d)

Q2 Phase 1 scope: internal users only. Self-service rollout after Phase 1 validation. (Akshit, 19c032d2)

### Course & Faculty Evaluation (PCE)
Status: New workstream opened (Mar 2026). PCE lives inside surveys module as premium tile.
Key decision: PCE = special kind of survey (Vishaka, bde86866)
Entry points: (1) surveys module for admins, (2) inside each course for faculty
Separate question sets for didactic vs clinical required (David/Marquette, bde86866)
Architecture: 3-layer model (collection → analysis → reporting)
AI differentiator: theme extraction from open-text responses (confirmed SWOT advantage over Blue/Qualtrics)
Market sizing: $K/yr displacement opportunity per institution replacing external survey tools

### Skills Checklist
Status: Q2-Q4 scope.
Critical signal: Must be program-scoped, not placement-scoped. (Day 4 Marriott, 5890b614)
Students currently build external spreadsheets because the platform ties skills to individual placements.
PA passport model: procedure-based, not competency-based.
Students trigger their own evaluation when ready.

### Learning Contracts
Status: Scoped. Architecture follows after Skills Checklist.

---

## 6. PLATFORM-LEVEL SIGNALS (3+ products)

External spreadsheet dependency: Skills, FaaS, Exam. Every design must answer: does this eliminate the spreadsheet?
Submit-only validation: FaaS patient log, FaaS forms. All form controls need inline validation.
Manual configuration debt: FaaS, Exam LMS sync, ExactOne. Self-service with preview/simulator.
Reporting deficit: All products. Program Directors cannot self-serve accreditation reports.
AI opportunity layer: All products. Admin side only. Faculty time reduction is the metric.
Multi-campus fragmentation: Exam, FaaS, ExactOne. Flat pool is the fix.
Mobile gap / SCCE underservice: FaaS, Skills. Mobile-first review experience.

---

## 7. CLAUDE DESIGN PRINCIPLES FOR EMPATHETIC PRODUCTS

### 7.1 Story over metrics

Every dashboard should tell a story, not display KPI cards.

Anti-pattern:
KPI card: "74% average score"
KPI card: "3 students below threshold"

Story pattern:
"Your class is 3 points below last semester on cardiology. The same gap caused 2 students to need remediation last year. Three students are already at risk. Here is who they are and what they need."

The metrics are present, but they serve the story.

### 7.2 Empathy is structural, not emotional

Do not add adjectives. Show the Day in Life, the workaround, the verbatim quote.
The reader will feel the empathy from the facts, not from being told how to feel.

### 7.3 Pull quotes over paraphrase

When a stakeholder said something exactly right, show it verbatim.
Format: DM Serif Display, italic, 15px, left border in product accent color.
Source line: Name, session date, confidence level.

### 7.4 Severity is spatial

Critical: largest, appears first, color AND icon AND text.
High: second, color AND icon.
Medium: third, color only.
Low: metadata treatment.
Color alone never communicates severity (WCAG 1.4.1).

### 7.5 The decision test (required for every chart)

Before adding any chart:
1. What decision does this enable?
2. What would the reader do differently with vs without this chart?
3. Is the answer specific and actionable?

If not, replace with a pull quote or a single number with context.
Every chart has a sub-title starting with "Why:" explaining the specific insight.

### 7.6 AI is natural, not labeled

Anti-pattern: "AI has detected 3 at-risk students" with AI badge
Pattern: Watch-list surfaces Marcus, David, Elena with threshold violations. Criteria visible. Reasoning transparent. No badge.

Exception: When AI output needs human review before acting, show a review gate with "AI drafted, needs your approval." Transparent, not decorative.

### 7.7 Progressive disclosure for complexity

Always two modes:
- Quick: one click, sensible defaults, most common workflow
- Advanced: full control, revealed on demand

Never force the advanced mode on quick-mode users.
Example: mark distribution. Quick = equal distribution. Advanced = Bloom's-based weighting, partial credit, negative marking.

---

## 8. DATA VISUALIZATION STANDARDS

### 8.1 Chart selection guide

How has X changed over time? Area or line chart. Recharts.
How do categories compare? Horizontal bar. Recharts.
Where are gaps vs benchmark? Line with dashed benchmark. D3.js or Recharts.
How does individual perform vs target? Radial ring. D3.js.
Which items are deficient? Heat bar with conditional color. Recharts.
What is the class distribution? Histogram. D3.js.
How do entities relate? Force-directed graph. D3.js.
What proportion does each category represent? Donut, max 5 segments. Recharts.
How does competency coverage look? Radar/spider. Recharts.
Which questions are most problematic? Scatter with quadrants. D3.js.
How do cohorts compare? Grouped bar. Recharts.

### 8.2 Scalability: 100 to 1000+ students

100 students (default): individual data points visible, student names on hover, full histogram with individual bars.

1000+ students: virtualized table (react-window), aggregated histograms only, heatmap instead of rows, statistical summary (mean, median, SD, percentile bands), filter-first approach.

### 8.3 Chart anatomy (required structure)

Every chart must have:
- Title (Inter 600, 15px)
- Sub-title starting with "Why:" explaining the insight
- Source citation (session ID or data source)
- Tooltip accessible via keyboard
- Benchmark line labeled with source

Never: 3D charts, pie with >5 segments, stacked bar unless stack itself is meaningful.

### 8.4 The information connection graph

Use D3.js force-directed graph to visualize relationships between:
- Nodes: Granola sessions (circles), Project docs (squares), Insights (diamonds), Features (hexagons)
- Edges: source-of, contradicts, confirms, extends, blocks
- Color: by product accent color
- Weight: by evidence strength (verbatim quote > summary > inference)
- Interactive: click node to see source text and connected nodes

---

## 9. ACCESSIBILITY STANDARDS

Hard legal deadline: April 24, 2026. ADA Title II enforcement.
Source: Aarti verbatim (f29a990d): "Title Two is going into law on April 24. Anything we release has to be accessible from day one."

All features must be platform-embedded (lockdown browser = no external tool dependency):

WCAG 1.1.1: Alt text required on all images. Publish gate blocker.
WCAG 1.2.1: Captions on all audio/video. Publish gate blocker.
WCAG 1.3.1: Semantic HTML structure.
WCAG 1.4.3: Contrast minimum 4.5:1 for all body text.
WCAG 1.4.4: Text resizes 100-400% without loss of content.
WCAG 2.1.1: All interactive elements reachable via keyboard. Tab, Arrow, Enter, F=flag, A/B/C/D=answer.
WCAG 2.1.2: No keyboard trap. Lockdown browser context requires in-app equivalents.
WCAG 2.4.3: Tab order follows logical reading order.
WCAG 2.4.7: Focus visible, 2px ring in accent color.
WCAG 3.3.1: Errors identified immediately on field blur, not deferred to submit.
WCAG 4.1.2: ARIA labels on all form controls.

ACR/VPAT report required per release (Nipun, 4c9b94f5).
FaaS 3-pane builder flagged as inaccessible by Aarti. Use linear wizard pattern.

---

## 10. INFORMATION ARCHITECTURE FOR LEADERSHIP ARTIFACTS

When generating an IA artifact for leadership, PM, or engineering:

Layer 1: Product purpose (1 sentence). Who it serves, what job it does, why it exists in the ecosystem.
Layer 2: User journey map. Entry to core workflow to exit/outcome. Persona labels at each step.
Layer 3: Feature map. Group by Foundational (must-have) / Differentiating (ExamSoft gap) / Future (AI layer). Each feature links to: source session, competitive reference, user quote.
Layer 4: Content requirements. Terminology consistency, copy patterns, empty states, error messages.
Layer 5: Dependency map. What depends on what. What blocks what.
Layer 6: Metrics frame. Product metrics, UX metrics, business metrics. Current baseline, target, how measured.

Product ecosystem connections:
Exam Management feeds performance data to PA Dashboard and Outcome Dashboard.
FaaS 2.0 powers clinical evaluations (CPI/FWPE), skills verification, learning contracts, compliance/onboarding, patient log.
Course and Faculty Evaluation aggregates to Program Director dashboard and accreditation reporting.
Skills Checklist tracks program-scoped competency completion and triggers evaluation forms via FaaS.

---

## 11. AUDIT PROTOCOL (8 DIMENSIONS)

When auditing any page or component, check all 8:

1. FUNCTIONALITY: All states (default/hover/active/disabled/error/loading/empty/success)? All actions reversible? Keyboard-only path covers primary workflows?

2. ACCESSIBILITY (WCAG 2.1 AA): Every image has alt text? Color not only means of conveying info? Focus visible? Tab order logical? Error messages immediate (not submit-only)? No text below 11px? Contrast >= 4.5:1?

3. UI: Typography scale adhered to? Color tokens used (no hardcoded hex)? Spacing on 4px grid? Components match design system across similar contexts?

4. UX: Primary action visually dominant? Destructive actions require confirmation? Error messages helpful not technical? Empty states explain why and what to do next? Loading uses skeletons not spinners?

5. INTERACTION / MICROINTERACTION: State changes use two signals? Transitions are purposeful (150ms hover, 200ms expand/collapse, 400ms progress)? No decorative animation?

6. DATA VISUALIZATION: Every chart has "Why:" sub-title? Charts pass the decision test? Benchmarks labeled with source? Interactive tooltips accessible?

7. AI LENS: Does AI help here? Is AI output requiring human review? Is AI invisible (natural) or labeled (intrusive)? Measurable time saved?

8. METRICS: Does this feature move a product metric? Which one? By how much?

Output format for audits:
AUDIT: [component/page]
FINDING: [severity] Description. Evidence. Fix. Effort. Priority.
METRICS IMPACT: [what moves]
MAGIC PATTERNS NEXT STEPS: [specific component to update]

---

## 12. METRICS FRAMEWORK

### Product metrics (what the business tracks)

Exam Management north star: Faculty time to create and publish exam. Target: under 45 minutes (from ~4 hours in ExamSoft).
Supporting: Question reuse rate, first-pass publish rate (% that pass accessibility gate), ExamSoft migration rate.

FaaS 2.0 north star: Support ticket volume. Current: 95,000/yr. Target: measurable reduction after governance model.
Supporting: NPS 2/5 to 3/5, self-service adoption rate, configuration error rate.

### NPS 2025 Intelligence (1,494 responses — full dataset)

Student NPS: -47.5 (1,282 responses, 65% detractors)
Faculty NPS: -49.1
Admin NPS: -4.8 (Admin avg score 6.76 vs Student 4.86)
Sites NPS: +8
Approve NPS: +87.5

Pattern: Bimodal hate-or-tolerate. Not neutral. Students either hate it or tolerate it — no enthusiasm.
Top detractor themes tracked in NPSView (10 themes).
Approve benchmark (+87.5) is the proof that clinical placement module can achieve promoter-majority NPS when the product fits the workflow.
Source: NPS_2025_Textual_Responses_1.xlsx + weekly-report-2026-03-27.html

Course Eval north star: Surveys migrated from external tools. Current: 7 external. Target: 3+ migrated.
Supporting: Response rate, faculty satisfaction, PD time saved on reporting.

Skills Checklist north star: External spreadsheet elimination. Current: 80-90% use spreadsheets. Target: 0%.
Supporting: Program-scope completion rate, student self-trigger rate.

### UX metrics

Task completion rate (usability test): are users completing primary workflows?
Time on task (observation): are they faster than ExamSoft?
Error rate (session recording): how often are validation errors triggered?
Accessibility ACR score: how many WCAG criteria pass vs fail?
Learnability (first-use test): can a DCE use without training?

### Business metrics

ExamSoft migration rate: every UX improvement increases willingness to switch.
NPS movement: FaaS baseline 2/5. Every friction point removed is potential NPS improvement.
Accreditation renewal success: PD self-serve report = less manual work = better renewal preparation.
Multi-campus adoption: flat pool is the prerequisite for Touro 70-campus expansion.
AI feature adoption: percentage of faculty using AI generate = leading indicator of AI ROI.

### Marketing metrics

Exam Management: "First clinical education platform with AI-native assessment" (ExamSoft is publicly anti-AI).
FaaS 2.0: "95,000 support tickets per year made self-service."
Course Eval: "Replace Blue/Qualtrics with embedded clinical evaluation."
Skills Checklist: "End the external spreadsheet."

---

## 13. STAFF DESIGNER GAP ANALYSIS

What is missing for Staff/Principal Product Designer level:

1. PORTFOLIO CASE STUDIES: Work exists but not documented as Staff-level case studies. Format needed: measurable problem scale, constraints, process, key decisions with tradeoffs, outcomes with metrics. Each project must have a number ("95,000 annual support tickets", "17,000 configured forms", "100% PANCE pass rate").

2. VISIBLE DESIGN SYSTEM CONTRIBUTION: Romit owns the clinical education design language but it is not documented as a reusable system. Staff designers publish the system, not just use it. rr-insights SKILL.md is the seed of this system.

3. PUBLISHED RESEARCH CONNECTED TO PRACTICE: ACM SIGDOC 2024 (Vector Personas) should be visibly connected to how it informs FaaS and Exam Management work. The narrative: "I published on vector personas and now I apply that methodology to 17,000 configured forms across 11 form types."

4. STAFF/PRINCIPAL JD BENCHMARKING: Run "Market position" trigger against current Staff Product Designer JDs at: Veeva, Epic, Modernizing Medicine, Phreesia, Arcadia, Salesforce Health Cloud. Gap analysis with talking points.

5. QUANTIFIED IMPACT STATEMENTS:
"FaaS: designed governance model for 95,000 annual support tickets"
"Exam Management: first WCAG 2.1 AA compliant lockdown assessment in clinical education"
"rr-insights: sole product designer synthesizing 43+ stakeholder sessions across 5 products"

How rr-insights accelerates Staff positioning:
Every Granola session processed produces: evidence that work is research-grounded, verbatim quotes demonstrating user understanding, competitive analysis showing systems thinking, design decisions with rationale and tradeoffs. This is the portfolio evidence that hiring managers look for at Staff level.

---

## 14. AGENTIC OPERATING PROTOCOL

### Session-start checklist (run automatically each session):

1. Check Granola for new sessions since last sync via list_meetings
2. Cross-reference against insights.ts by source field
3. For each unsynced session with product content: run get_meeting_transcript for raw signal
4. Extract insights with source, severity, confidence, tags
5. Add to insights.ts with unique IDs
6. Check project attachments for any not yet referenced in current SKILL.md section 2
7. Push to GitHub if any updates made

Current state (as of Mar 28, 2026): 56 sessions synced, 195 insights, 17 views.

### Query processing protocol:

When a query arrives:
1. Identify relevant products, personas, sessions
2. Check ALL information networks in priority order (Section AGENCY MANDATE above)
3. Apply relevant POV lenses (Section 15 below)
4. Default output: visual first, then prose
5. Every claim has a source (session ID, file name, or transcript quote)
6. If query requires Magic Patterns work, create a new artifact immediately without asking

Never: answer from memory when a source exists.
Never: answer from Granola summaries when raw transcript is available.
Never: produce generic output that could apply to any SaaS product.
Always: connect to the specific clinical education domain vocabulary.

### Output routing:

Admin Exam Management design: Magic Patterns editor mnirdwczw9xbbzyuveee4g
Student Exam Management design: Magic Patterns editor nt3rr3hj1s64irx5fydbvz
Research intelligence: GitHub soleyromit/rr-insights (PAT: [GITHUB_PAT_IN_MEMORY_ONLY])
Visualization inline: visualize:show_widget
Architecture diagram: Figma:generate_diagram

GitHub remote: https://soleyromit:[GITHUB_PAT_IN_MEMORY_ONLY]@github.com/soleyromit/rr-insights.git

---

## 15. POV LENSES

Every output is filtered through all relevant lenses:

LENS 1 (Exxat Product): Does this make the product more defensible, sticky, or accreditation-ready?
LENS 2 (Direct Competitor): How would ExamSoft, D2L, or Blackboard solve this? What would they never do?
LENS 3 (Indirect Competitor): What does the user expect from SurveyMonkey, Typeform, Google Forms?
LENS 4 (Existing Users): What is the current experience? Happy path? Where does it break?
LENS 5 (Non-users): Why are they not here? What acquisition trigger exists?
LENS 6 (Accessibility): Does this meet WCAG 2.1 AA in a lockdown browser environment?
LENS 7 (Staff Designer): Is this systems-level? Does it scale? Does it handle multi-tenant edge cases?
LENS 8 (UX Researcher): What is the evidence quality? What confidence level should stakeholders assign?
LENS 9 (Content Strategist): Is the language right? CPI, FWPE, DCE, SCCE, CAPTE, ACOTE, CCNE, ARC-PA, CAAHEP, CSWE, PAEA, NCCPA must appear where users expect them.
LENS 10 (Interaction Designer): What micro-interactions make this feel clinical-grade, not generic SaaS?

---

## 16. INSIGHT TAGGING SCHEMA

theme: Recurring pattern in 2+ sources. Synthesize into cross-product finding.
gap: Unmet need or broken experience. Map to design opportunity.
opportunity: Specific design direction. Add to roadmap with priority.
persona: Behavior/quote tied to a persona. Add to persona registry.
platform: Appears in 3+ products. Escalate to architecture-level signal.
ai: AI feature opportunity. Add to AI layer roadmap.
new: From a session not yet synced. Flag for sync.
architecture: Structural/systemic constraint. Affects multiple products.
decision: Confirmed design decision from leadership. Lock in SKILL.md Section 5.

Severity: critical / high / medium / low
Confidence: high (verbatim quote) / medium (summary) / low (inference)

---

## 17. VISUAL DESIGN STANDARDS

Typography scale:
Display headline: 26-32px, DM Serif Display, 400, --text
Section heading: 18-22px, DM Serif Display, 400, --text
Card title: 15px, Inter, 600, --text
Body text: 15px, Inter, 400, --text2
Secondary text: 13px, Inter, 400, --text2
Metadata/source: 11px, JetBrains Mono, 400, --text3
Eyebrow label: 10px, Inter, 700, --text3
Data values: 28px, DM Serif Display, 400, --text

Never use below 11px for any text that carries meaning.

Color tokens:
--bg: #faf9f7 (warm page background, never pure white)
--bg2: #f4f2ee (cards, sidebars)
--bg3: #ede9e3 (inset panels, table headers)
--bg4: #e3ddd4 (hover, active)
--accent: #6d5ed4 (primary CTA, focus rings)
--coral: #e8604a (critical, errors, destructive)
--amber: #d97706 (high, warnings, in-progress)
--teal: #0d9488 (success, completion, positive)
--blue: #3b82f6 (medium, informational, links)

Product accent colors:
exam-management: #6d5ed4
faas: #e8604a
course-eval: #0d9488
skills-checklist: #d97706
learning-contracts: #db2777

Interaction timing:
Tab switch: 150ms ease
Card hover: 150ms ease (border + shadow)
Progress fill: 400ms ease (first render only)
Expand/collapse: 200ms ease-in-out
Toast: 150ms in / 1.5s hold / 150ms out

Never: bounce, spring, particle effects, gradient animation, spinner on synchronous operations.
State changes always use two signals.

---

## 18. REPO ARCHITECTURE

soleyromit/rr-insights: Research intelligence platform. Granola insights, product analysis, competitive intelligence, persona maps.
Magic Patterns admin: Exam Management admin design. Editor mnirdwczw9xbbzyuveee4g.
Magic Patterns student: Student exam experience. Editor nt3rr3hj1s64irx5fydbvz.

Rule: Magic Patterns and rr-insights are always separate. Research intelligence informs design, never embeds in it.

---

## 19. SUCCESS METRICS FOR rr-insights

Granola sessions synced: 43 of 43, 100% ongoing target
Raw transcripts read: 8 of 43, target 100% for design-decision sessions
Insights tagged: 92, target 150+ by Cohere
Fabricated sources: 0, always 0
Products with full deep-dive: 1 (Exam Mgmt), target 5
Staff designer case studies: 0, target 2 by Cohere
Project attachments indexed: all 30+, ongoing

---

## 20. CHANGELOG

5.0.0 | 2026-03-26 | Full rebuild as cohesive intelligence agency. Added: complete project attachments index (30+ files), domain expert mental models (all 4 layers per expert), D3.js visualization guide, scalable data viz standard (100 to 1000+ students), complete competitor database with use cases, Claude design principles applied to product, 8-dimension audit protocol, full metrics framework (product/UX/business/marketing), Staff designer gap analysis, agentic operating protocol, all confirmed design decisions from raw transcripts.
2.3.0 | 2026-03-26 | Raw transcript protocol, session gap log (26 gaps, 8 sessions)
2.0.0 | 2026-03-23 | Initial SKILL.md with 5 products, 10 POV lenses
