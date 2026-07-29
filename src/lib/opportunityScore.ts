// @ts-nocheck
// lib/opportunityScore.ts — TheyDo-pattern opportunity scoring (Benchmark D6).
// Rank is computed, never positional or recency-based, and the formula is inspectable in the UI.
// score(insight) = severityWeight × max(personaPriority of tagged personas)
// score(signal)  = Σ score(insight) over its evidence set
// Persona priorities follow the skill's registry: DCE very high, Student/SCCE high, PD medium-high.

export const SEVERITY_WEIGHT = { critical: 3, high: 2, medium: 1, low: 0.5, na: 0.25 };
export const PERSONA_PRIORITY = { dce: 1.0, student: 0.9, scce: 0.9, 'program-director': 0.8 };
const DEFAULT_PERSONA = 0.7;

export const FORMULA = 'score = severity weight (critical 3 / high 2 / medium 1 / low 0.5) × persona priority (DCE 1.0, Student/SCCE 0.9, PD 0.8, untagged 0.7); signal score sums its evidence';

export function insightScore(i) {
  const sev = SEVERITY_WEIGHT[i.severity ?? 'na'] ?? 0.25;
  const personas = i.personaIds ?? [];
  const pri = personas.length ? Math.max(...personas.map(p => PERSONA_PRIORITY[p] ?? DEFAULT_PERSONA)) : DEFAULT_PERSONA;
  return Math.round(sev * pri * 10) / 10;
}

export function signalScore(computedSignal) {
  return Math.round(computedSignal.insights.reduce((n, i) => n + insightScore(i), 0));
}
