// data/recommendations.ts — first-class recommendations (v19.4).
// The decision layer over the corpus: each entry is an action whose evidence
// chain is inspectable (insightIds are real corpus ids, validated by
// scripts/check-themes.ts). Status pipeline mirrors the team's actual process
// per ins-process-001: verbal alignment → Vishaka/leadership approval → build.
import type { Recommendation } from '../types';

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-faas-preview',
    text: 'Build a FaaS form preview / simulator before any new form-builder feature work',
    rationale: 'Configuration errors currently surface 2–3 months later when students submit; a config mistake affects 200 students instead of 1 reviewer.',
    insightIds: ['ins-faas-006', 'ins-faas-gap-21', 'faas-pras-ctrl-001', 'ins-faas-pras-03'],
    productIds: ['faas'],
    owner: 'Romit',
    status: 'aligned',
    statusDate: '2026-03-25',
    createdAt: '2026-03-20',
  },
  {
    id: 'rec-em-accommodation-profiles',
    text: 'Ship program-level accommodation profiles that follow the student across all exams',
    rationale: 'First-in-class vs ExamSoft per-exam setup and D2L’s 70-operation workflow; design confirmed May 5.',
    insightIds: ['ins-em-019', 'ins-em-gap-34', 'ins-em-vish-may04'],
    productIds: ['exam-management'],
    owner: 'Vishaka',
    status: 'approved',
    statusDate: '2026-05-05',
    createdAt: '2026-03-20',
  },
  {
    id: 'rec-em-offline-decision',
    text: 'Re-resolve the offline exam download conflict with Aarti before MVP scope locks',
    rationale: 'Two Aarti positions conflict: May 19 mandates offline for Phase 1, May 28 team decision defers it, Jul 23 notes March LA — unresolved.',
    insightIds: ['ins-em-may-05', 'ins-em-may-09', 'ins-em-jul-04'],
    productIds: ['exam-management'],
    owner: 'Romit',
    status: 'proposed',
    statusDate: '2026-07-23',
    createdAt: '2026-05-21',
  },
  {
    id: 'rec-faas-template-first',
    text: 'Reorder the FaaS form-builder entry point to template-library-first',
    rationale: '80–85% of form changes are incremental and 90% start from templates; the current entry screen buries the dominant workflow.',
    insightIds: ['ins-faas-akshit-01', 'faas-q2-template-001', 'faas-akshit-001'],
    productIds: ['faas'],
    owner: 'Akshit',
    status: 'aligned',
    statusDate: '2026-03-25',
    createdAt: '2026-03-25',
  },
  {
    id: 'rec-em-alt-text-gate',
    text: 'Enforce the accessibility publish gate: alt text and captions required before any exam publishes',
    rationale: 'Errors caught at publish affect zero students; caught post-submit they affect 200. ADA Title II is in force since April 24.',
    insightIds: ['ins-em-020', 'ins-em-021', 'ins-em-gap-06'],
    productIds: ['exam-management'],
    owner: 'Romit',
    status: 'approved',
    statusDate: '2026-03-20',
    createdAt: '2026-03-20',
  },
  {
    id: 'rec-sc-program-scope',
    text: 'Rearchitect Skills as a program-level entity owned by the student, not placement-scoped',
    rationale: '80–90% of students build external spreadsheets because "have I done this skill across all rotations" is unanswerable in-product.',
    insightIds: ['ins-sc-001', 'sc-marriott-001', 'ins-sc-gap-26', 'ins-student-002'],
    productIds: ['skills-checklist'],
    owner: 'Vishakha',
    status: 'aligned',
    statusDate: '2026-03-05',
    createdAt: '2026-03-05',
  },
  {
    id: 'rec-ce-analytics-first',
    text: 'Design the PCE analytics layer first — it is the demo hook and the competitive moat',
    rationale: 'Watermark and Explorance Blue stop at median/mode; SWOT-from-responses and faculty-vs-program comparisons are first-in-class.',
    insightIds: ['ce-pce-ai-diff-001', 'pce-mar30-005', 'ins-ce-jul-01', 'ins-ce-may-06'],
    productIds: ['course-eval'],
    owner: 'Romit',
    status: 'approved',
    statusDate: '2026-04-10',
    createdAt: '2026-03-26',
  },
  {
    id: 'rec-ce-comm-rules',
    text: 'Reconcile the communication-rules conflict (per-survey vs centralized settings) before designing the communication step',
    rationale: 'The Jul 27 vault decision and the Jul 28 sync summary directly contradict each other; designing against either model risks rework.',
    insightIds: ['ins-ce-jul28-01', 'ins-ce-jun-05'],
    productIds: ['course-eval'],
    owner: 'Romit',
    status: 'proposed',
    statusDate: '2026-07-28',
    createdAt: '2026-07-28',
  },
  {
    id: 'rec-faas-restore-colors',
    text: 'Restore FaaS section color coding and indentation — regression fix before new feature work',
    rationale: 'Students get lost in long monochromatic forms; this is a visual regression, not a missing feature.',
    insightIds: ['ins-faas-pras-01', 'pras-f001', 'ins-faas-009'],
    productIds: ['faas'],
    owner: 'Prasanjit',
    status: 'proposed',
    statusDate: '2026-03-25',
    createdAt: '2026-03-25',
  },
  {
    id: 'rec-em-cronbach',
    text: 'Decide Cronbach’s alpha parity: ship reliability metrics or arm account managers with talking points',
    rationale: 'ExamSoft ships it; Exxat MVP ships point-biserial only. Open parity decision flagged Jul 23.',
    insightIds: ['ins-em-jul-03'],
    productIds: ['exam-management'],
    owner: 'Vishal',
    status: 'proposed',
    statusDate: '2026-07-23',
    createdAt: '2026-07-23',
  },
];

const byId = new Map(RECOMMENDATIONS.map((r) => [r.id, r]));
export const getRecommendation = (id: string) => byId.get(id);

export const REC_STATUS_ORDER: Recommendation['status'][] = [
  'proposed', 'aligned', 'approved', 'shipped', 'rejected',
];

export const REC_STATUS_META: Record<Recommendation['status'], { label: string; meaning: string; color: string }> = {
  proposed: { label: 'Proposed', meaning: 'Raised from evidence; not yet verbally aligned', color: '#8a8580' },
  aligned: { label: 'Aligned', meaning: 'Verbal alignment reached; awaiting sign-off', color: '#f5a623' },
  approved: { label: 'Approved', meaning: 'Signed off; in or awaiting build', color: '#2ec4a0' },
  shipped: { label: 'Shipped', meaning: 'Live in product', color: '#16a34a' },
  rejected: { label: 'Rejected', meaning: 'Considered and declined — kept for the record', color: '#e8604a' },
};
