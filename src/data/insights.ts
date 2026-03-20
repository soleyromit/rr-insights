// ─────────────────────────────────────────────
//  data/insights.ts
//  All cross-product insights, tagged and sourced.
//  Feed new Granola sessions here — the UI auto-reflects.
// ─────────────────────────────────────────────

import type { Insight } from '../types';

export const INSIGHTS: Insight[] = [
// ── Exam Management ──
{
  id: 'ins-em-001',
  text: 'Multi-campus exam sharing is Touro\'s #1 pain. Faculty print questions → email → re-upload per campus. California campus runs a different ExamSoft version entirely.',
  tags: ['gap', 'platform', 'new'],
  source: 'Touro ExamSoft meeting · Mar 11',
  severity: 'critical',
  productIds: ['exam-management'],
  personaIds: ['dce'],
  createdAt: '2026-03-11'
},
{
  id: 'ins-em-002',
  text: 'Accessibility V1 is the hard blocker for UNF pilot. Magnification, high contrast, on-screen keyboard, keyboard-only nav, extra time accommodations — all absent. Must follow Pearson model (GRE/SAT/TOEFL): platform-embedded, no 3rd-party tools.',
  tags: ['gap'],
  source: 'Accessibility session · Mar 16 · Romit<>Nipun · Mar 11',
  severity: 'critical',
  productIds: ['exam-management'],
  personaIds: ['student'],
  createdAt: '2026-03-16'
},
{
  id: 'ins-em-003',
  text: 'Blueprint-based question assembly: AI picks questions satisfying all NCCPA blueprint cells. Touro called it a "lifesaver." Must be live before Cohere Aug 2026.',
  tags: ['opportunity', 'ai', 'new'],
  source: 'Touro ExamSoft meeting · Mar 11 (private notes)',
  severity: 'high',
  productIds: ['exam-management'],
  personaIds: ['dce', 'program-director'],
  createdAt: '2026-03-11'
},
{
  id: 'ins-em-004',
  text: 'Faculty split confirmed: power users want Bloom\'s taxonomy + LO cross-referencing. Research-first faculty want zero overhead. Progressive disclosure is the architectural answer.',
  tags: ['theme', 'architecture'],
  source: 'Exam platform strategy · Mar 4 · Q-Bank architecture · Mar 12',
  severity: 'high',
  productIds: ['exam-management', 'faas'],
  personaIds: ['dce'],
  createdAt: '2026-03-04'
},
{
  id: 'ins-em-005',
  text: 'AI personalized remediation: based on EOR topic / PACRAT domain failures → generate 30-question PAEA-format PDF per student. Every remediation path is different.',
  tags: ['opportunity', 'ai', 'new'],
  source: 'Touro ExamSoft meeting · Mar 11',
  severity: 'high',
  productIds: ['exam-management'],
  personaIds: ['student', 'dce'],
  createdAt: '2026-03-11'
},
{
  id: 'ins-em-006',
  text: 'D2L BrightSpace demo revealed: LMS encroaching on exam management. Key gap vs D2L: bulk accommodation assignment (D2L = per student per quiz manually), clinical education differentiation, AI-driven analytics.',
  tags: ['gap', 'new'],
  source: 'D2L BrightSpace demo · Mar 4',
  severity: 'high',
  productIds: ['exam-management'],
  personaIds: ['dce', 'program-director'],
  createdAt: '2026-03-04'
},
// ── FaaS ──
{
  id: 'ins-faas-001',
  text: 'PDF split is a critical accreditation blocker: FaaS covers step 2 of a 3-step site assessment doc. Accreditors need unified single document. Clients build it manually.',
  tags: ['gap', 'new'],
  source: 'Pratiksha<>Romit FaaS site assessment · Mar 18',
  severity: 'critical',
  productIds: ['faas'],
  personaIds: ['program-director'],
  createdAt: '2026-03-18'
},
{
  id: 'ins-faas-002',
  text: 'Preceptor intake form now being built in FaaS: standardized fields (credentials, licenses, certifications) mapped to global preceptor DB. Custom sections per program. High-stakes new SCCE surface.',
  tags: ['opportunity', 'new'],
  source: 'Pratiksha<>Romit FaaS site assessment · Mar 18',
  severity: 'high',
  productIds: ['faas'],
  personaIds: ['scce'],
  createdAt: '2026-03-18'
},
{
  id: 'ins-faas-003',
  text: 'Low client self-service despite front-end availability. Most clients still ticket the config team. Reasons: interface complexity, low tech literacy, satisfaction with standard forms.',
  tags: ['theme'],
  source: 'Pratiksha<>Romit FaaS site assessment · Mar 18',
  severity: 'high',
  productIds: ['faas'],
  personaIds: ['dce', 'program-director'],
  createdAt: '2026-03-18'
},
// ── Course Eval ──
{
  id: 'ins-ce-001',
  text: 'Touro runs 7 survey types outside Exxat in Blue/Canvas: faculty peer review, didactic eval, orientation, end-of-didactic, clinical eval, exit survey, grad survey.',
  tags: ['gap', 'new'],
  source: 'Touro ExamSoft meeting · Mar 11',
  severity: 'critical',
  productIds: ['course-eval'],
  personaIds: ['program-director'],
  createdAt: '2026-03-11'
},
{
  id: 'ins-ce-002',
  text: 'AI theme extraction from open-ended responses: Touro said "saves hours and hours." High feasibility, low design risk. Single highest-ROI AI feature for Course Eval.',
  tags: ['opportunity', 'ai', 'new'],
  source: 'Touro ExamSoft meeting · Mar 11',
  severity: 'high',
  productIds: ['course-eval'],
  personaIds: ['program-director', 'dce'],
  createdAt: '2026-03-11'
},
// ── Skills Checklist ──
{
  id: 'ins-sc-001',
  text: 'Skills must be a student program-level entity — not placement-scoped. "Have I done this skill across all rotations?" is currently unanswerable. 80-90% of students build external tracking docs.',
  tags: ['gap', 'architecture', 'platform', 'new'],
  source: 'Day 4 Marriott — Skills & LC · Mar 5',
  severity: 'critical',
  productIds: ['skills-checklist'],
  personaIds: ['student'],
  createdAt: '2026-03-05'
},
{
  id: 'ins-sc-002',
  text: 'Procedure minimum tracking: 3x per procedure type required by ARC-PA. "Just show me the reds" — filter to deficient students only. Overflow catch-up rotation for missed procedures.',
  tags: ['gap', 'new'],
  source: 'Dr. T Clinical Team — Touro · Mar 11',
  severity: 'high',
  productIds: ['skills-checklist'],
  personaIds: ['program-director'],
  createdAt: '2026-03-11'
},
// ── Learning Contracts ──
{
  id: 'ins-lc-001',
  text: 'Social work placements span 6+ months across multiple sites with one contract. Current placement-scoped system breaks this. Preceptor change mid-placement = no workflow support.',
  tags: ['gap', 'new'],
  source: 'Day 4 Marriott — Skills & LC · Mar 5',
  severity: 'critical',
  productIds: ['learning-contracts'],
  personaIds: ['scce', 'student'],
  createdAt: '2026-03-05'
},
// ── Platform-level ──
{
  id: 'ins-plat-001',
  text: 'Cognitive overload under constraint: annotation gap (Exam) + form complexity (FaaS) + placement-scoped skills (Skills) all represent the same unmet student need across three surfaces.',
  tags: ['theme', 'platform'],
  source: 'Synthesized across Granola sessions · Mar 2026',
  severity: 'critical',
  productIds: ['exam-management', 'faas', 'skills-checklist'],
  personaIds: ['student'],
  createdAt: '2026-03-19'
},
{
  id: 'ins-plat-002',
  text: 'AI opportunity layer confirmed across all 5 products from Granola. Specific confirmed use cases: question gen, PANCE predictor, theme extraction, smart scheduling, graduation risk, compliance approval.',
  tags: ['opportunity', 'ai', 'platform', 'new'],
  source: 'Synthesized from 9 Granola sessions · Mar 2026',
  severity: 'high',
  productIds: ['exam-management', 'faas', 'course-eval', 'skills-checklist', 'learning-contracts'],
  createdAt: '2026-03-19'
},
{
  id: 'ins-plat-003',
  text: 'Reporting deficit: Program Directors cannot self-serve accreditation-ready reports from Exam Management, FaaS, or Course Eval. One missing platform capability — narrative synthesis and structured reporting.',
  tags: ['theme', 'platform'],
  source: 'Synthesized across Granola sessions · Mar 2026',
  severity: 'critical',
  productIds: ['exam-management', 'faas', 'course-eval'],
  personaIds: ['program-director'],
  createdAt: '2026-03-19'
}];


export const getInsightsByProduct = (productId: string): Insight[] =>
INSIGHTS.filter((i) => i.productIds.includes(productId as never));

export const getInsightsByPersona = (personaId: string): Insight[] =>
INSIGHTS.filter((i) => i.personaIds?.includes(personaId as never));

export const getPlatformSignals = (): Insight[] =>
INSIGHTS.filter((i) => i.tags.includes('platform'));