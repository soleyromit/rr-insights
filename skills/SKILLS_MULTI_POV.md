# rr-insights Skills Framework - Multi-POV Architecture

**Version:** 2.0  
**Last Updated:** March 30, 2026  
**Owner:** Romit Soley, Product Designer II @ Exxat  

---

## Overview

This skills framework enables rr-insights to analyze Exxat products through **9 distinct professional perspectives**, ensuring comprehensive insight synthesis that serves multiple stakeholders (designers, researchers, strategists, competitors, users, accessibility experts).

Each perspective has a dedicated analysis engine, question library, and visualization strategy.

---

## Perspective 1: Exxat Product Lens

**Role:** Product Manager, Design Lead, Executive  
**Question Framework:**
- What is the core value proposition?
- What are the user outcomes we're optimizing for?
- What are the accreditation compliance requirements?
- What are the design system constraints?
- What metrics indicate success?

**Analysis Output:**
- Product brief (problem, scope, users, constraints)
- Success metrics dashboard
- Feature prioritization matrix
- Roadmap alignment assessment
- Design debt inventory

**Data Sources:**
- Granola meeting transcripts (strategic, kickoff, vision sessions)
- Magic Patterns design system
- GitHub issue tracking
- NPS feedback
- Usage telemetry

**Example Insight (Exam Management):**
"Exam Management serves 170+ accredited healthcare programs with high stakes assessment requirements. Core problem: accessibility gaps in lockdown browser environment block 15%+ of students with documented accommodations. Design intervention: in-app zoom + focus mode + question navigator (WCAG 2.1 AA compliant)."

---

## Perspective 2: Competitor Product Lens

**Role:** Competitive Strategist, Product Analyst  
**Question Framework:**
- What are direct competitors (same product category)?
- What are they doing better/worse?
- What features do they have that we lack?
- What's their pricing/go-to-market strategy?
- What are their documented user pain points?

**Competitors to Exxat Products:**

### Exam Management Competitors:
- **ExamSoft Respondus** (industry standard, lockdown browser constraint)
- **Blackboard LMS** (integrated but feature-limited)
- **Canvas** (generic LMS, weak assessment)
- **D2L Brightspace** (strong compliance, weak UX)

### FaaS Competitors:
- **Typeform** (consumer-grade, not enterprise)
- **SurveyMonkey** (feature-rich but compliance gaps)
- **Qualtrics** (expensive, enterprise-grade)
- **Jotform** (customizable, limited HIPAA support)

### Skills Checklist Competitors:
- **Case Western competency tracking** (academic only)
- **APTA CPI** (assessment-only, not tracking)
- **Clinical education platforms** (vertical-specific)

**Analysis Output:**
- Competitive positioning matrix (features vs. compliance vs. UX)
- Feature gap analysis
- Pricing comparison
- Market sizing by competitor
- Win/loss analysis

---

## Perspective 3: Indirect Competitor Lens

**Role:** Market Strategist, Investor  
**Question Framework:**
- What functional alternatives exist?
- What are users doing instead of using Exxat?
- What adjacent markets could disrupt us?
- What trends threaten our category?

**Indirect Competitors to Exxat:**
- **Generic Google Forms** (zero compliance, extreme friction)
- **Email-based workflows** (no audit trail, no compliance)
- **Spreadsheet tracking** (CPI data entry in Excel)
- **Paper forms** (regulatory nightmare, no analytics)
- **Manual clinical site coordination** (phone/email)
- **Custom-built systems** at individual institutions (high TCO, maintenance burden)

**Analysis Output:**
- Threat assessment by persona
- TCO comparison (Exxat vs. custom vs. manual)
- Switch costs / lock-in analysis
- Market trend assessment

---

## Perspective 4: Primary User Persona Lens

**Role:** UX Researcher, User Advocate, Customer Success  
**Question Framework:**
- Who is this persona?
- What is their primary job to be done?
- What are their key pain points with current solution?
- What does success look like for them?
- What accessibility/mobile/complexity constraints apply?

**Personas Using Exxat:**

### Student (Clinical Education)
- Job: Complete clinical forms, take assessments, track competencies
- Pain: Accessibility gaps in exam environment, form complexity, unclear status
- Success: Quick form completion, accessible assessment, clear feedback
- Constraints: Low platform familiarity, mobile usage, disability accommodations

### DCE / Faculty
- Job: Configure forms, review student performance, manage clinical sites, ensure compliance
- Pain: Form governance complexity, multi-site coordination, reporting gaps
- Success: One-click form deployment, compliance confidence, real-time dashboards
- Constraints: Time-poor, high stakes (accreditation), multiple roles

### SCCE / Clinical Supervisor
- Job: Evaluate students, verify competencies, submit CPI/FWPE
- Pain: Low platform familiarity, infrequent usage, poor mobile experience
- Success: Guided workflows, offline capability, auto-calculations
- Constraints: External user, low tolerance for friction, device heterogeneity

### Program Director / Accreditation Coordinator
- Job: Ensure compliance, track aggregate outcomes, generate reports
- Pain: Limited data viz, no narrative synthesis, manual export
- Success: Executive dashboard, one-click accreditation reports, trend visibility
- Constraints: Limited tech skills, needs human-readable insights

**Analysis Output:**
- Persona journey maps (end-to-end workflows)
- Pain point severity matrix
- Accessibility audit (WCAG 2.1 AA compliance)
- Mobile usability assessment
- Task success rate benchmarking

---

## Perspective 5: Non-User Persona Lens

**Role:** Market Expansion, GTM  
**Question Framework:**
- Who should be using Exxat but isn't?
- What barriers prevent adoption?
- What would activate this persona?
- What's their willingness to pay?

**Non-User Personas:**

### Other Accreditation Bodies (CCNE, CSWE, ARC-PA)
- Barrier: Designed for CAPTE/ACOTE-heavy workflow
- Activation: Vertical-specific configuration templates
- WTP: High (regulatory mandate)

### International Programs
- Barrier: US-centric compliance (HIPAA, FERPA)
- Activation: GDPR support, international form versioning
- WTP: Medium (lower volume, high CAC)

### For-Profit Higher Education
- Barrier: Scale / cost concerns
- Activation: Freemium tier, usage-based pricing
- WTP: Medium (price-sensitive)

---

## Perspective 6: WCAG Accessibility Expert Lens

**Role:** Accessibility Consultant, Compliance Officer, DEI Lead  
**Question Framework:**
- Is the product WCAG 2.1 AA compliant?
- What accessibility barriers exist for each persona?
- What assistive technology conflicts occur?
- What would full accessibility require?
- What's the accessibility debt?

**Exam Management Accessibility Gaps:**
- **Lockdown browser blocks OS-level zoom** → need in-app zoom
- **Focus order unclear in exam interface** → need focus mode + visible focus ring
- **No keyboard navigation for question selection** → need question navigator
- **Color-only feedback (red/green badges)** → need text labels
- **Mobile accessibility untested** → need responsive exam flow

**Course Eval Accessibility Gaps:**
- Form labels not connected to inputs (label association)
- Rating scales not keyboard navigable
- Error messages not announced to screen readers

**Analysis Output:**
- WCAG 2.1 AA audit report
- Barrier severity matrix (critical → minor)
- Remediation roadmap with effort estimates
- Testing approach (automated + manual + user testing)
- Legal/regulatory risk assessment

---

## Perspective 7: Staff Product Designer Lens

**Role:** Design Lead, Design System Owner, Hiring Manager  
**Question Framework:**
- What design challenges does this product solve?
- What's the complexity tier (junior / mid / senior / staff)?
- What design systems work is demonstrated?
- What cross-functional collaboration happened?
- What design debt exists?

**Staff-Level Design Scope Indicators:**

### Exam Management (STAFF-LEVEL)
- **Scope:** Enterprise SaaS, 170+ institutions, high-stakes assessment
- **Complexity:** Multi-role (admin/student/faculty), accessibility constraints, performance at scale
- **Design System:** Component library, dark/light modes, responsive design
- **Collaboration:** Engineering (React rebuild), Accessibility (WCAG), Product (accreditation)
- **Evidence:** Design audit framework, accessibility remediation plan, component specs

### FaaS 2.0 (STAFF-LEVEL)
- **Scope:** 17,000+ configured forms, 95K annual support tickets, NPS 2/5 baseline
- **Complexity:** Governance framework (3-level risk model), multi-tenant architecture, HIPAA/FERPA compliance
- **Design System:** Form patterns, approval workflows, data validation
- **Collaboration:** Legal (compliance), Engineering (form engine), Product (governance)
- **Evidence:** Governance taxonomy, form type patterns, compliance framework

---

## Perspective 8: Staff UX Researcher Lens

**Role:** Research Lead, User Research Operations, Insights  
**Question Framework:**
- What research has been conducted?
- What are the key findings by persona?
- What research gaps exist?
- What's the evidence quality?
- What research should happen next?

**Research Inventory Template:**

| Research Type | Persona | Findings | Evidence Quality | Gaps |
|---|---|---|---|---|
| Site Visit | DCE, SCCE | Form complexity, multi-site chaos | High (video, quotes) | Comparative (what's better?) |
| Interview | Student | Accessibility frustration, time pressure | Medium (quotes only) | Quantification (% affected) |
| Survey | Faculty | NPS signals, feature prioritization | High (N=200+) | Causal (why these patterns?) |
| Usage Analytics | All | Feature adoption, time-to-completion | High (telemetry) | Qualitative (why abandoned?) |

---

## Perspective 9: Staff Content Strategist Lens

**Role:** Content Design, Information Architecture, Wayfinding  
**Question Framework:**
- Is the information architecture clear?
- Are labels and microcopy consistent?
- Is help content available and findable?
- What's the terminology model?
- Are error messages actionable?

**Content Strategy Audit:**

### Exam Management Terminology Model
- "Phase" (Build → Publish → Live → Score → Close) vs. "Status" (Draft → Scheduled → In Progress → Completed)
- "Questions" vs. "Items" vs. "Test Questions"
- "Review Queue" (where?) vs. "Flagged" (why?)

### Form Terminology (FaaS)
- "Form Type" vs. "Form Template"
- "Critical" vs. "Required" vs. "Mandatory"
- "Manager Approval" vs. "Needs Review"

---

## Perspective 10: Motion & Interaction Designer Lens

**Role:** Interaction Design Lead, Animation Specialist  
**Question Framework:**
- What micro-interactions enhance or confuse?
- What transitions are jarring?
- What loading states are missing?
- What gestures are intuitive?
- What accessibility issues exist in interactions?

**Interaction Audit (Exam Management):**
- Tab switching (All → Building → Scheduled → Live → Scored) - instantaneous or animated?
- Exam status badge color change - does it announce?
- Question reveal (as student reads) - progressive or all-at-once?
- Submit button disabled state - is it visible?

---

## How to Use This Framework

### For Product Analysis
1. **Select a product** (Exam Mgmt, FaaS 2.0, etc.)
2. **Run each perspective** using the question library
3. **Synthesize findings** into actionable recommendations
4. **Prioritize by impact** (impact matrix: user # × severity × frequency)

### For Stakeholder Communication
- **Executive:** Perspective 1 (Product) + 3 (Market)
- **Arun:** Perspective 1 + 7 (Design)
- **Kunal:** Perspective 1 + 2 (Competitive)
- **Engineering:** Perspective 4 (User) + 9 (Interaction)
- **Legal/Compliance:** Perspective 6 (Accessibility) + 8 (Research)

### For Portfolio Building
- **Staff Designer argument:** Perspectives 1 + 2 + 6 + 7
- **Evidence:** Case study, audit frameworks, accessibility roadmaps

---

## Success Metrics

Each perspective should produce:
- ✓ Concrete findings (not generic observations)
- ✓ Data sources cited (transcripts, analytics, research)
- ✓ Actionable recommendations (not "nice to haves")
- ✓ Effort estimates (hours to implement)
- ✓ Success metrics (how will we measure impact?)

---

## Next Steps

1. Apply this framework to **Exam Management v1 analysis**
2. Create visual dashboards for each perspective
3. Publish findings to rr-insights
4. Update Magic Patterns design system based on accessibility findings
5. Present to Arun + Kunal with clear prioritization

