// data/conflicts.ts — the open-conflicts registry (v19.7).
// Generalizes the COHERE_LAUNCH pattern: when two sources disagree, the
// repository records BOTH claims, who owns the resolution, and what is blocked
// — instead of silently picking a side. Resolved conflicts stay for the record.
import type { ProductId } from '../types';

export interface ConflictClaim {
  claim: string;
  source: string;
}

export interface Conflict {
  id: string;
  fact: string; // what is contested, phrased as the question
  claims: ConflictClaim[];
  /** conservative value the UI renders while unresolved, if any */
  rendered?: string;
  status: 'open' | 'resolved';
  resolution?: string; // filled when status = resolved
  owner: string;
  blocks: string; // what cannot proceed until this resolves
  productIds: ProductId[];
  insightIds: string[]; // evidence for the conflict itself
  raisedAt: string; // ISO day
}

export const CONFLICTS: Conflict[] = [
  {
    id: 'conf-cohere-date',
    fact: 'When is the Cohere launch gate — August or September 2026?',
    claims: [
      { claim: 'Aug 2026', source: 'Milestones data + whiteboard (Mar 2026)' },
      { claim: 'Sep 2026', source: 'Product plan: pilotDate, roadmap phases, v11 notes' },
    ],
    rendered: 'Aug 2026',
    status: 'open',
    owner: 'Arun',
    blocks: 'Deadline-pressure math sitewide renders the conservative Aug date; every countdown is only as honest as this fact.',
    productIds: ['exam-management', 'course-eval'],
    insightIds: ['ins-platform-002'],
    raisedAt: '2026-07-29',
  },
  {
    id: 'conf-comm-rules',
    fact: 'Do survey communication rules live per-survey or in centralized settings?',
    claims: [
      { claim: 'Per-survey with cross-survey visibility; Settings only seeds new pushes', source: 'Vault decision note · Jul 27 (status: accepted)' },
      { claim: 'Centralized settings, not per-survey — "decision made this morning"', source: 'Course Eval sync summary · Jul 28 (bfaa2076)' },
    ],
    status: 'open',
    owner: 'Romit',
    blocks: 'The communication step of the survey push wizard cannot be designed against either model until reconciled.',
    productIds: ['course-eval'],
    insightIds: ['ins-ce-jul28-01', 'ins-ce-jun-05'],
    raisedAt: '2026-07-28',
  },
  {
    id: 'conf-offline-download',
    fact: 'Is offline exam download in scope for the January MVP?',
    claims: [
      { claim: 'Mandatory Phase 1 — "Universities will face a lot of backlash"', source: 'Aarti · May 19' },
      { claim: 'Defer — stay online for launch, assess post-launch; March LA adds offline', source: 'Team decision · May 28 + weekly call · Jul 23' },
    ],
    status: 'open',
    owner: 'Romit',
    blocks: 'MVP scope lock and the student exam-day flow: the download sub-step is designed but its phase is undecided.',
    productIds: ['exam-management'],
    insightIds: ['ins-em-may-05', 'ins-em-may-09', 'ins-em-jul-04'],
    raisedAt: '2026-05-28',
  },
  {
    id: 'conf-duplicate-mode',
    fact: 'Is duplicate evaluatee/aspect detection on the Step 2 survey screen a soft warning (overridable) or a hard block (auto-deselect)?',
    claims: [
      { claim: 'Soft warning: renders in step 2, admin can uncheck or accept the duplicate, review step re-confirms — chosen over a hard block to avoid P0 support tickets from legitimate re-evaluation', source: 'Survey workflow session · Jul 24 (10d48960)' },
      { claim: 'Hard block: system auto-deselects the duplicate course-content aspect and routes the admin back to edit the existing template instead of allowing an override', source: 'Step two design note · Aug 4 (5f6c8679)' },
    ],
    status: 'open',
    owner: 'Romit',
    blocks: 'The Step 2 duplicate-handling UI cannot be finalized until it is clear whether faculty-role duplicates and course-content-aspect duplicates get the same treatment, or the Jul 24 soft-warning decision was superseded.',
    productIds: ['course-eval'],
    insightIds: ['ins-ce-jul24-03', 'ins-ce-aug04-02'],
    raisedAt: '2026-08-04',
  },
];

export const openConflicts = () => CONFLICTS.filter((c) => c.status === 'open');
