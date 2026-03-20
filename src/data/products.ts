// ─────────────────────────────────────────────
//  data/products.ts
//  Single source of truth for all product metadata.
//  To add a new product: add a ProductId to types/index.ts
//  and add an entry here. Everything else auto-derives.
// ─────────────────────────────────────────────

import type { ProductMeta } from '../types';

export const PRODUCTS: ProductMeta[] = [
{
  id: 'exam-management',
  name: 'Exam Management',
  shortName: 'Exam',
  description:
  'ExamSoft competitor with Canvas-level UX. React front-end confirmed. AI-first roadmap: question gen from slides, Bloom\'s tagging, PANCE predictor, adaptive testing.',
  status: 'active',
  accentColor: '#8b7ff5',
  insightCount: 31,
  criticalGaps: 3,
  pilotDate: 'Jul 2026',
  launchDate: 'Nov–Dec 2026'
},
{
  id: 'faas',
  name: 'FaaS 2.0',
  shortName: 'FaaS',
  description:
  '17,000+ configured forms. 95,000+ annual support tickets. NPS 2/5. Active work: 3-level governance model, Patient Log migration, preceptor intake, CAS compliance.',
  status: 'wip',
  accentColor: '#f5a623',
  nps: 2,
  ticketsPerYear: 95000,
  insightCount: 28,
  criticalGaps: 3
},
{
  id: 'course-eval',
  name: 'Course & Faculty Eval',
  shortName: 'Course Eval',
  description:
  'Strategic recovery module. Touro runs 7 survey types outside Exxat in Blue/Canvas. Dedicated module planned (April workshop). FaaS components embedded.',
  status: 'planned',
  accentColor: '#2ec4a0',
  insightCount: 14,
  criticalGaps: 1
},
{
  id: 'skills-checklist',
  name: 'Skills Checklist',
  shortName: 'Skills',
  description:
  'Standalone student program-level competency entity. Cross-placement aggregation. Student-initiated eval model. Jan 2027 launch. Threat: Typhon, CompetencyAI.',
  status: 'scoped',
  accentColor: '#78aaf5',
  insightCount: 22,
  criticalGaps: 2,
  launchDate: 'Jan 2027'
},
{
  id: 'learning-contracts',
  name: 'Learning Contracts',
  shortName: 'LCs',
  description:
  'Multi-semester social work support, ARC-PA competency evidence, preceptor change mid-placement workflow. Currently placement-scoped — architectural fix needed.',
  status: 'scoped',
  accentColor: '#e87ab5',
  insightCount: 11,
  criticalGaps: 1
}];


export const getProduct = (id: string): ProductMeta | undefined =>
PRODUCTS.find((p) => p.id === id);