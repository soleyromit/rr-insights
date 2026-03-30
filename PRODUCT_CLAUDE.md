# Product-Level CLAUDE.md - rr-insights Insight System

**Version:** 2.0  
**Last Updated:** March 30, 2026  
**Owner:** Romit Soley, Product Designer II @ Exxat  
**Repo:** github.com/soleyromit/rr-insights  

---

## System Architecture

rr-insights is a multi-perspective research intelligence system that synthesizes Exxat product knowledge through **9 professional lenses**, enabling Romit to communicate with different stakeholder audiences and build a defensible design portfolio.

### The 9 Perspectives

1. **Exxat Product Lens** → Product briefs, roadmaps, success metrics, accreditation impact
2. **Competitor Product Lens** → Feature gap analysis, pricing comparison, win/loss intel
3. **Indirect Competitor Lens** → Market threats, functional alternatives, TCO benchmarking
4. **Primary Persona Lens** → User journey maps, pain points, accessibility requirements
5. **Non-User Persona Lens** → Market expansion opportunities, activation levers
6. **WCAG Accessibility Lens** → WCAG 2.1 AA audit, remediation roadmap, legal risk
7. **Staff Product Designer Lens** → Design system work, complexity indicators, ownership evidence
8. **Staff UX Researcher Lens** → Research inventory, evidence quality, research gaps
9. **Staff Content Strategist Lens** → IA clarity, terminology model, error messaging

**Read:** `/skills/SKILLS_MULTI_POV.md` for full framework.

---

## Product Analysis Template

For each Exxat product, apply this structured template:

### [PRODUCT NAME] Analysis

**Perspective 1: Exxat Product**
- Value proposition
- Target users (personas)
- Accreditation compliance requirements
- Success metrics (NPS, volume, revenue)
- Design system constraints
- Known competitive threats

**Perspective 2: Competitor Products**
- Direct competitors (same category)
- Feature comparison matrix
- Pricing / go-to-market
- User satisfaction (NPS, reviews)
- Win/loss signals

**Perspective 3: Indirect Competitors**
- Functional alternatives (what users do instead)
- DIY / custom-built workarounds
- Market trends threatening category
- Lock-in strength vs alternatives

**Perspective 4: Primary Personas**
- Persona: [Name, Role, Job-to-be-Done]
- Pain points (severity matrix)
- Success metrics (what "done" looks like)
- Accessibility constraints
- Mobile / device requirements
- Design interventions needed

**Perspective 5: Non-User Personas**
- Persona: [Who should be using this]
- Barriers to adoption
- What would activate this persona
- Willingness to pay
- Market size

**Perspective 6: Accessibility (WCAG 2.1 AA)**
- Current compliance status
- Barriers by persona
- Remediation roadmap (effort estimates)
- Legal / regulatory risk
- Success metrics (automated + manual testing)

**Perspective 7: Design (Staff-Level)**
- Design scope (users, institutions, transactions)
- Complexity tier (junior / mid / senior / staff)
- Design system work demonstrated
- Cross-functional collaboration
- Design debt inventory
- Portfolio evidence

**Perspective 8: Research (Staff-Level)**
- Research conducted (type, persona, findings)
- Evidence quality (quotes, video, N size)
- Research gaps (what's missing)
- Implications for next iteration

**Perspective 9: Content Strategy**
- Information architecture clarity
- Terminology model (consistent naming)
- Help content findability
- Error messaging actionability
- Microcopy consistency

---

## Product Deep Dives (Active)

### Exam Management

**Status:** React rebuild (Responsive by April 1, 2026)  
**Key Problem:** Accessibility gaps in lockdown browser (students with disabilities lack in-app accommodations)  
**Design Scope:** 170+ institutions, 50K+ students annually, high-stakes clinical assessment  

**Perspective 1: Product**
- Core value: Equitable assessment delivery within lockdown browser constraints
- Users: Students (diverse accessibility needs), Faculty (exam configuration), Program Directors (compliance)
- Accreditation link: CAPTE, ACOTE, CCNE, ARC-PA mandate accessible assessment
- Success: 95%+ student task success rate, WCAG 2.1 AA, NPS ≥ 7

**Perspective 2: Competitive**
- ExamSoft Respondus: Industry standard, but accessibility gaps (no in-app zoom)
- Blackboard: Integrated but weak assessment
- D2L Brightspace: Strong compliance, poor UX
- Exxat advantage: Accessibility features built-in (zoom, focus mode, navigator)

**Perspective 3: Indirect Competitors**
- Paper exams (regulatory nightmare, no analytics)
- Manual tracking (email + spreadsheet)
- Generic Google Forms (zero compliance)
- Current barrier: Institutions lock into ExamSoft due to sunk cost

**Perspective 4: Primary Personas**

*Student (Clinical Ed)*
- Job: Complete exam, demonstrate clinical knowledge, receive feedback
- Pain: No zoom in lockdown environment, unclear question navigation, time pressure
- Success: Clear navigation, accessible zoom, keyboard navigation
- Accessibility: 15% with documented accommodations; lockdown browser blocks OS-level tools

*Faculty (DCE/Program Director)*
- Job: Configure exam, manage approvals, review results, ensure compliance
- Pain: Manual approval workflow, reporting gaps, accreditation documentation
- Success: One-click publish, approval dashboard, auto-generated reports
- Design intervention: Publish gate (requires checklist), exam template library

*Admin (Exam Coordinator)*
- Job: Manage exam scheduling, proctor coordination, result export
- Pain: Multi-site coordination chaos, manual export, no audit trail
- Success: Calendar view, approval workflow, one-click compliance export

**Perspective 5: Non-User**
- International programs (GDPR, not US-HIPAA focused)
- For-profit higher ed (price-sensitive, high CAC)
- K-12 / corporate training (different accreditation model)
- Activation: Localization, pricing tiers, use-case-specific templates

**Perspective 6: Accessibility (WCAG 2.1 AA)**
- **CRITICAL gaps:** No in-app zoom, no focus mode, no keyboard navigation for question selection
- **HIGH gaps:** Color-only feedback (red/green badges), focus rings missing, mobile untested
- **Remediation:** In-app zoom (120-200%), focus mode (hide exam UI), question navigator (keyboard + click), focus rings (2px teal)
- **Effort:** 40-50 hours (designers 8-12h, engineers 32-40h)
- **Legal risk:** MEDIUM (ADA compliance + accreditation audits)
- **Testing:** Automated WCAG scan + manual screen reader test (NVDA, JAWS)

**Perspective 7: Design (Staff-Level)**
- **Scope:** 170+ institutions, 50K+ students, multi-role admin system, React rebuild
- **Complexity:** Senior+. Accessibility constraints + performance + compliance
- **Design system work:** Component library, accessibility patterns, dark/light modes, responsive grid
- **Collaboration:** Engineering (Nipun, React lead), Accessibility consultant (TBD), Product (Vishaka), Legal (compliance)
- **Evidence:** Design audit framework, accessibility roadmap, component specs, Magic Patterns library

**Perspective 8: Research (Staff-Level)**
- Site visit (Touro PA, Mar 11) → Form complexity cascades to student friction
- Interviews (Harsha FaaS, Mar 20) → Governance framework insights
- Student feedback → Accessibility pain is acute during high-pressure exams
- Gap: Quantified % impact of accessibility barriers; mobile flow untested

**Perspective 9: Content Strategy**
- **IA clarity:** Exam phases (Build → Publish → Live → Score → Close) vs question statuses (Draft → Approved) — terminology model needs audit
- **Terminology:** "Phase" vs "Status", "Questions" vs "Items", "Review Queue" vs "Flagged"
- **Help content:** Inline tooltips for phase gates; accreditation compliance guide missing
- **Error messaging:** Form validation errors lack actionability; gate failures unclear

**April 17 Demo Requirements (Blockers)**
- ✓ Student exam flow with zoom + focus mode + navigator (all devices)
- ✓ Admin dashboard (stat cards with correct padding + dark mode)
- ✓ Faculty approval workflow (publish gate + one-click submit)
- ✓ Accessibility QA (screen reader + keyboard navigation)
- ✓ Mobile device walk-through (iPad + Android phone)

---

### FaaS 2.0 (Forms as a Service)

**Status:** Internship → full-time redesign ownership  
**Key Problem:** 17,000+ configured forms, 95,000+ annual support tickets, NPS 2/5, no governance model  
**Design Scope:** 11 form types, multi-tenant enterprise, HIPAA/FERPA/ADA compliance  

**Perspective 1: Product**
- Core value: Governed form creation at scale without breaking program-specific configs
- Users: Students (form completion), Faculty (form review), Program Directors (template configuration)
- Accreditation link: All major accreditors (CAPTE, ACOTE, CCNE, ARC-PA, CSWE) use FaaS for clinical data
- Success: NPS → 6+, support tickets -40%, form deployment time <10 minutes

**Perspective 2: Competitive**
- Typeform: Consumer-grade, no compliance
- SurveyMonkey: Feature-rich, gaps in HIPAA/FERPA support
- Qualtrics: Expensive, enterprise-grade but overkill for healthcare ed
- Exxat advantage: Vertical-specific (healthcare accreditation) + compliance built-in

**Perspective 3: Indirect Competitors**
- Google Forms (zero compliance, extreme friction)
- Email forms (no audit trail, HIPAA disaster)
- Spreadsheet entry (no validation, no compliance)
- Cost of current: 95K tickets/year × $150/ticket resolution = $14.25M lost productivity

**Perspective 4: Primary Personas**

*Student (Form Completer)*
- Job: Fill clinical evaluation form, submit for supervisor approval
- Pain: Form complexity, unclear required fields, slow submission feedback
- Success: Clear form flow, progress indicator, instant confirmation

*Faculty (Form Manager)*
- Job: Create form templates, configure approval workflows, review submissions
- Pain: Form governance complexity, multi-site config conflicts, no template sharing
- Success: Template library, one-click duplicate, conflict detection, approval dashboard

*Program Director (Compliance Lead)*
- Job: Ensure all forms meet accreditation requirements, track compliance
- Pain: Manual audits, no compliance checklist, export-based reporting
- Success: Auto-compliance check (critical fields, signatures), compliance report one-click

**Perspective 5: Non-User**
- International programs (GDPR variant)
- Nursing schools (CCNE specific requirements)
- Pharmacy schools (new vertical)
- Activation: Localization templates, vertical-specific field packs

**Perspective 6: Accessibility (WCAG 2.1 AA)**
- **HIGH gaps:** Form labels not associated with inputs, error messaging not screen-reader announced
- **MEDIUM gaps:** Radio button groups not properly grouped, rating scales not keyboard navigable
- **Remediation:** Label association fix, ARIA live regions for validation, keyboard nav for all inputs
- **Effort:** 20-25 hours
- **Testing:** Automated scan + manual testing (NVDA)

**Perspective 7: Design (Staff-Level)**
- **Scope:** 17K forms, 11 types, 95K annual support tickets, multi-tenant
- **Complexity:** Staff. Governance framework (3-level risk model), HIPAA/FERPA compliance, form engine architecture
- **Design system:** Form patterns, validation states, approval workflows, status badges
- **Collaboration:** Engineering (form engine), Legal (compliance), PM (governance), Support (patterns from tickets)
- **Evidence:** Governance taxonomy, form type patterns, compliance framework, support ticket analysis

**Perspective 8: Research (Staff-Level)**
- Stakeholder sessions (Mar 3-6 Marriott): Governance model consensus (Critical / Approval / Warning)
- India team FaaS meeting (Mar 5): Multi-region config challenges
- Harsha interview (Mar 20): Form complexity signals from support tickets
- Gap: Quantified impact of form complexity on student experience; mobile form testing

**Perspective 9: Content Strategy**
- **IA clarity:** "Form Type" vs "Form Template", "Critical" vs "Required" vs "Mandatory"
- **Terminology:** "Manager Approval" vs "Needs Review", "Submitted" vs "Completed"
- **Help content:** Compliance requirements guide, template creation tutorial missing
- **Error messaging:** Validation failures don't explain why field is required

---

### Course & Faculty Evaluation (PCE)

**Status:** Discovery phase (first design session Mar 26)  
**Key Problem:** TBD (awaiting stakeholder input)  
**Design Scope:** Faculty performance tracking, course effectiveness, accreditation compliance  

**Analysis Framework (In Progress)**
- Waiting on: Monil stakeholder session (Mar 26), David context, PCE vision docs
- Next: Apply 9-perspective framework once scope is clear
- Timeline: Design exploration (Apr-May), prototype (Jun), usability test (Jul)

---

## Analysis Workflow

**When asked:** "Analyze [Product]"

1. **Run each perspective** (see template above) using the question library
2. **Synthesize into actionable recommendations** (not generic observations)
3. **Prioritize by impact** (user count × severity × frequency)
4. **Format for audience:** Executive (Perspectives 1+3), Designer (1+7), Engineer (4+6+9)
5. **Include blockers & risks** explicitly

**When presenting to stakeholders:**
- **Arun:** Perspectives 1 + 7 (Product + Design ownership evidence)
- **Kunal (COO):** Perspectives 1 + 2 + 3 (Business impact, competitive positioning)
- **Vishaka (PM):** Perspectives 1 + 4 + 8 (Product strategy, user research, next research)
- **Engineering leads:** Perspectives 4 + 6 (User needs, accessibility compliance)
- **Legal / Compliance:** Perspective 6 (WCAG audit, regulatory risk)

---

## Portfolio Building (Staff-Level Positioning)

**What each analysis demonstrates:**
- Exam Management case study → Accessibility systems design under constraints (Staff-level)
- FaaS governance audit → Systems thinking, multi-stakeholder complexity (Staff-level)
- Research synthesis → Evidence-grounded decision making (Staff-level)
- Design system work → Component architecture, scalability (Staff-level)

**Evidence artifacts to maintain:**
- Design audit frameworks (WCAG, design tokens, component parity)
- Accessibility roadmaps with effort estimates
- Persona journey maps (primary + non-users)
- Competitive positioning matrices
- Service blueprints (user + backstage + systems)
- Design system documentation (components, tokens, responsive patterns)

---

## Metrics & Success Indicators

**For each product analysis:**
- ✓ Specific findings (not generic observations)
- ✓ Data sources cited (meetings, analytics, research, audit)
- ✓ Actionable recommendations (effort estimate + impact)
- ✓ Stakeholder alignment (who benefits from this insight)
- ✓ Next research needed (what gap remains)

**For rr-insights project:**
- Exam Management: April 17 demo success (3 flows, 0 accessibility failures)
- FaaS: Governance model locked by Apr 30
- PCE: Design direction validated by user research by Jun 30
- Portfolio: 2-3 case studies polished for recruiter/hiring manager review by Jul 2026

---

## Connecting Back to Magic Patterns + Design System

Every analysis feeds back to design system improvements:

**Exam Management WCAG gaps** → New components (ZoomControl, FocusMode, QuestionNavigator, FocusRing)
**FaaS form patterns** → Compliance template library in Magic Patterns
**PCE content strategy** → Error messaging guidelines + terminology model doc

The design system is not static — it evolves based on real-world insights from each product analysis.

---

## Access & Sharing

- **GitHub:** github.com/soleyromit/rr-insights (skills/, docs/, product analyses)
- **Granola:** All meeting transcripts (indexed by product tag)
- **Magic Patterns:** Component library for each product
- **romitsoley.com:** Portfolio case studies (when polished)

Public link for stakeholder sharing: [will add when rr-insights v1 ships]

