# rr-insights: Multi-Perspective Research Intelligence for Exxat Products

**Status:** v2.0 (March 30, 2026)  
**Owner:** Romit Soley, Product Designer II @ Exxat  
**Purpose:** Synthesize product research, competitive intel, and user insights through 9 professional lenses to inform design decisions and build portfolio evidence for staff-level positioning  

---

## What is rr-insights?

A **structured research intelligence system** that analyzes Exxat products across 9 professional perspectives:

1. **Exxat Product** → Product briefs, roadmaps, accreditation impact
2. **Competitor Products** → Feature gap analysis, pricing, win/loss
3. **Indirect Competitors** → Market threats, functional alternatives
4. **Primary Personas** → User journey maps, pain points, accessibility needs
5. **Non-User Personas** → Market expansion, activation levers
6. **Accessibility Expert** → WCAG 2.1 AA audit, remediation roadmap
7. **Staff Product Designer** → Design system work, complexity indicators
8. **Staff UX Researcher** → Research inventory, evidence quality
9. **Staff Content Strategist** → IA clarity, terminology, error messaging

Every analysis produces **actionable recommendations, specific findings, and portfolio-ready evidence**.

---

## How It Works

### Step 1: Read the Framework
Start with `/skills/SKILLS_MULTI_POV.md` — it explains all 9 perspectives with question libraries and expected outputs.

### Step 2: Pick a Product
Choose from active products:
- **Exam Management** (React rebuild, Apr 17 demo, accessibility-heavy)
- **FaaS 2.0** (Governance framework, support ticket crisis)
- **Course & Faculty Evaluation** (Discovery phase)

### Step 3: Run the Analysis
Use the template in `/PRODUCT_CLAUDE.md` to apply all 9 perspectives.

### Step 4: Synthesize for Your Audience
Different stakeholders need different cuts:
- **Arun (Direct Manager):** Perspectives 1 + 7 (Product + Design ownership)
- **Kunal (COO):** Perspectives 1 + 2 + 3 (Business + Competition)
- **Vishaka (PM Partner):** Perspectives 1 + 4 + 8 (Strategy + Research)
- **Engineers:** Perspectives 4 + 6 (Users + Accessibility)

---

## What's in This Repo

```
/skills/SKILLS_MULTI_POV.md       → Framework explaining all 9 perspectives
/PRODUCT_CLAUDE.md                → Template for analyzing any Exxat product
/CLAUDE.md                        → Main project instructions (legacy)
/src/views/products/              → React views for each product
/src/data/                        → Granola meeting data, research inventory
/src/components/                  → Reusable insight visualizations
```

---

## Current Analyses (Active)

### Exam Management (Priority: April 1 & 17)

**Problem:** Accessibility gaps in lockdown browser + design system token misalignment  
**Scope:** 170+ institutions, 50K+ students, high-stakes clinical assessment  
**Design Gaps:** 10 critical (zoom, focus mode, navigator, padding, color, mobile)  
**April 17 Demo Requirement:** 3 flows (Student/Admin/Faculty), zero WCAG failures  
**Evidence for Portfolio:** Accessibility systems design under constraints (Staff-level)

### FaaS 2.0 (Priority: April 30)

**Problem:** 17,000+ forms, 95K support tickets, NPS 2/5, no governance  
**Scope:** 11 form types, multi-tenant, HIPAA/FERPA/ADA compliance  
**Design Intervention:** 3-level governance model (Critical / Approval / Warning)  
**Stakeholder Consensus:** Mar 3-6 Marriott sessions locked framework  
**Evidence for Portfolio:** Systems thinking under regulatory complexity (Staff-level)

### Course & Faculty Evaluation (Priority: May+)

**Status:** Discovery phase (Monil kickoff Mar 26)  
**Pending:** Stakeholder input, problem definition, scope sizing  
**Placeholder:** Apply 9-perspective framework once vision is clear

---

## Using rr-insights with Claude

### To Analyze a Product
```
"Analyze Exam Management across the 9 perspectives in SKILLS_MULTI_POV.md.
Use the template in PRODUCT_CLAUDE.md. Show me:
- Specific findings (not generic observations)
- Data sources (Granola, site visits, research)
- Actionable recommendations with effort estimates
- Which perspectives are most critical for the April 17 demo"
```

### To Build a Portfolio Case Study
```
"Create a Staff Product Designer case study for Exam Management accessibility work.
Include: Problem scale (15% of students affected), design constraints (lockdown browser),
my role (led accessibility audit, designed remediation roadmap, defined new components),
process (audit framework, stakeholder validation, component spec),
and outcomes (zero WCAG failures by April 17, reusable accessibility patterns).
Frame for hiring managers at design-focused companies (Figma, Stripe, GitHub)."
```

### To Connect with a Specific Stakeholder
```
"Create a brief (one-pager) for Arun summarizing Exam Management status.
Use Perspectives 1 (Product) + 7 (Design).
Include: What's launched, what's blocking April 17 demo, what design system work is needed,
and one direct ask (decision or resource) we need from him."
```

---

## Success Metrics

**For rr-insights itself:**
- ✓ April 17 demo ships (3 flows, zero accessibility failures)
- ✓ FaaS governance locked by Apr 30
- ✓ 2-3 polished case studies ready for recruiter conversations by Jul 2026
- ✓ Each analysis produces actionable recommendations (not observations)

**For each product:**
- Exam Management: NPS ≥ 7, 95%+ student task success, WCAG 2.1 AA
- FaaS 2.0: NPS 6+, support tickets -40%, form deployment time <10 min
- PCE: Design direction validated by user research (target: Jun 2026)

---

## Next Steps (Immediate)

1. **Apply CSS fixes to Magic Patterns** (Card padding, dark mode bg, focus rings) by March 31
2. **Design asset delivery** (Zoom, focus mode, navigator specs) to Nipun + new engineers by April 1
3. **April 17 demo prep** (3 flows, mobile walk-through, accessibility QA)
4. **Connect with Vishaka** (align on product roadmap, PM partnership sync)
5. **Polish Exam Management case study** (scope, constraints, process, outcomes) for portfolio by May 2026

---

## Questions?

- **Framework details:** See `/skills/SKILLS_MULTI_POV.md`
- **Product analysis:** See `/PRODUCT_CLAUDE.md`
- **How to contribute:** Add new insights to `/src/data/` or new product views to `/src/views/products/`
- **Portfolio guidance:** See "Portfolio Building" section in `/PRODUCT_CLAUDE.md`

---

**Last Updated:** March 30, 2026  
**Deployed:** soleyromit.github.io/rr-insights (v5.5)  
**Repository:** github.com/soleyromit/rr-insights

