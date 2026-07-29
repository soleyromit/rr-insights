// data/taxonomy.ts — severity rubric, scoring weights, and single-sourced facts (S1 close-out, v17.0)
// The rubric is the written test every severity grade must pass. Regrades cite the rubric, not taste.
import type { SeverityLevel, PersonaId } from '../types';

export interface SeverityRubricEntry {
  level: Exclude<SeverityLevel, 'na'>;
  definition: string;
  test: string; // the question a grader answers yes to
}

export const SEVERITY_RUBRIC: SeverityRubricEntry[] = [
  {
    level: 'critical',
    definition: 'Blocks a launch gate, compliance requirement, or named pilot; or drives users out of the platform to external tools.',
    test: 'If this stays unfixed, does a launch slip, a compliance line fail, or a user leave the product?',
  },
  {
    level: 'high',
    definition: 'Recurring workflow pain for a primary persona with no workaround inside the product, or a named competitive loss driver.',
    test: 'Does a primary persona hit this repeatedly with no in-product way around it?',
  },
  {
    level: 'medium',
    definition: 'Friction with a workaround, a single-persona annoyance, or an improvement with clear but bounded value.',
    test: 'Is there a workaround, or is the value real but bounded to one persona or moment?',
  },
  {
    level: 'low',
    definition: 'Polish, preference, edge case, or observation with no current decision attached.',
    test: 'Would fixing this change no near-term decision?',
  },
];

// Numeric weights for the P7 opportunity score. Severity is the dominant axis by design.
export const SEVERITY_WEIGHT: Record<SeverityLevel, number> = {
  critical: 4, high: 3, medium: 2, low: 1, na: 0,
};

export const EVIDENCE_WEIGHT = {
  'DIRECT QUOTE': 3, // a named voice said it
  'SYNTHESIS': 2,    // pattern across sessions, no single quote
  'HYPOTHESIS': 1,   // inferred, unconfirmed
} as const;

// Persona priority weights, derived from PERSONAS[].priority (personas.ts stays the source
// of the priority level; this maps level → weight).
export const PERSONA_PRIORITY_WEIGHT: Record<'very-high' | 'high' | 'medium', number> = {
  'very-high': 3, high: 2, medium: 1,
};
// Insights with no persona take the midpoint so unassigned evidence is neither privileged nor buried.
export const UNASSIGNED_PERSONA_WEIGHT = 1.5;

// Severity colors — the one place these hex values live (DESIGN.md color contract).
export const SEV_COLORS: Record<SeverityLevel, string> = {
  critical: '#e8604a', high: '#f5a623', medium: '#6d5ed4', low: '#2ec4a0', na: '#8a8580',
};

// ---- Single-sourced facts (PRODUCT.md: one canonical source per fact; conflicts surfaced) ----

// The Cohere launch date is contested between two source families. Both claims render;
// the UI uses `rendered` (conservative) and names the confirmation owner.
export const COHERE_LAUNCH = {
  claims: [
    { date: 'Aug 2026', source: 'Milestones data + whiteboard (Mar 2026)' },
    { date: 'Sep 2026', source: 'Product plan: pilotDate, roadmap phases, v11 notes' },
  ],
  rendered: 'Aug 2026',
  status: 'unconfirmed' as const,
  owner: 'Arun',
  note: 'Two source families disagree by a month. Vault evidence (Jul 29 read) suggests they name different things: Aug = launch-readiness gate, Sep = conference demo. Unconfirmed; rendered conservatively as Aug 2026 until Arun confirms.',
};

export type PersonaWeightSource = Partial<Record<PersonaId, 'very-high' | 'high' | 'medium'>>;
