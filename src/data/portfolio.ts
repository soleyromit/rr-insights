// data/portfolio.ts — staff-positioning dimensions, anchor claims, and case-study pipeline.
// Extracted verbatim from PortfolioView v12; rendered by Portfolio + Deliverables.

export const DIMENSIONS = [
{ label: 'Systems thinking', value: 92, color: '#8b7ff5', note: 'Service blueprints, governance models, cross-product architecture' },
{ label: 'Cross-product ownership', value: 97, color: '#2ec4a0', note: 'Sole designer across 5 enterprise SaaS products' },
{ label: 'Accessibility leadership', value: 82, color: '#f5a623', note: 'WCAG 2.1 AA within lockdown constraints — senior design challenge' },
{ label: 'Published research', value: 94, color: '#8b7ff5', note: 'ACM SIGDOC 2024 · IEEE · UXPA Journal' },
{ label: 'Domain expertise', value: 96, color: '#2ec4a0', note: 'CAPTE, ACOTE, CCNE, ARC-PA, CSWE, CAAHEP — 12 years' },
{ label: 'Measurable outcomes', value: 62, color: '#e8604a', note: '⚠ Gap — needs case studies with before/after metrics' },
{ label: 'Stakeholder communication', value: 78, color: '#f5a623', note: 'Building evidence — Touro, PRISM, Marriott sessions documented' },
{ label: 'AI-product thinking', value: 74, color: '#2ec4a0', note: 'Growing — 6 confirmed AI use cases from Granola sessions' }];

export const ANCHORS = [
{
  label: 'Anchor 1',
  text: 'Sole designer with cross-product ownership across 5 enterprise SaaS products serving 170+ accredited healthcare programmes.'
},
{
  label: 'Anchor 2',
  text: 'Redesigned FaaS governance framework covering 17,000+ configured forms and 95,000+ annual support tickets (NPS 2/5 baseline).'
},
{
  label: 'Anchor 3',
  text: 'Published researcher in HCI: Vector Personas framework (ACM SIGDOC 2024) applied directly to enterprise design practice.'
},
{
  label: 'Anchor 4',
  text: 'Deep accreditation domain expertise: CAPTE, ACOTE, CCNE, ARC-PA, CSWE, CAAHEP. Designing for compliance, not just usability.'
},
{
  label: 'Anchor 5',
  text: 'Founder-level institutional knowledge: original Exxat designer from 2014, returning with graduate research lens. 12-year product context.'
}];

export const GAPS = [
{
  priority: 'P1',
  title: 'FaaS 2.0 governance case study',
  desc: 'Problem scale (95k tickets, NPS 2/5) + design decisions (3-level governance) + measurable outcomes. Highest-priority case study.',
  color: '#e8604a'
},
{
  priority: 'P2',
  title: 'Exam accessibility case study',
  desc: 'Systems thinking under constraint: building WCAG 2.1 AA within lockdown browser. Staff-level challenge framing.',
  color: '#f5a623'
},
{
  priority: 'P3',
  title: 'Skills Checklist architectural case study',
  desc: 'Platform-level architecture decision: standalone entity, multi-domain (nursing, PA, social work, rad tech). January 2027 launch.',
  color: '#78aaf5'
}];
