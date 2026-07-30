// lib/score.ts — P7 opportunity scoring engine (Benchmark D6).
// score = severity × evidence × persona priority. The formula is inspectable: every consumer
// renders the parts, never a bare number. Max 4 × 3 × 3 = 36.
import type { Insight } from '../types';
import { PERSONAS } from '../data/personas';
import { evidenceClass } from '../data/signals';
import {
  SEVERITY_WEIGHT, EVIDENCE_WEIGHT, PERSONA_PRIORITY_WEIGHT, UNASSIGNED_PERSONA_WEIGHT,
  tierOf,
} from '../data/taxonomy';
import type { TierId } from '../data/taxonomy';

export interface ScoreBreakdown {
  total: number;
  severity: number;   // 0–4, from SEVERITY_WEIGHT
  evidence: number;   // 1–3, from EVIDENCE_WEIGHT
  persona: number;    // 1–3 (1.5 when unassigned)
  label: string;      // "4×3×2 = 24" — the inspectable formula
  tier: TierId;       // presentation tier from SCORE_TIERS
}

const personaWeightById = new Map(
  PERSONAS.map(p => [p.id, PERSONA_PRIORITY_WEIGHT[p.priority] ?? 1]),
);

export function scoreInsight(i: Insight): ScoreBreakdown {
  const severity = SEVERITY_WEIGHT[i.severity ?? 'na'];
  const evidence = EVIDENCE_WEIGHT[evidenceClass(i)];
  const personas = i.personaIds ?? [];
  const persona = personas.length
    ? Math.max(...personas.map(p => personaWeightById.get(p) ?? 1))
    : UNASSIGNED_PERSONA_WEIGHT;
  const total = severity * evidence * persona;
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
  return {
    total, severity, evidence, persona,
    label: `${fmt(severity)}×${fmt(evidence)}×${fmt(persona)} = ${fmt(total)}`,
    tier: tierOf(total).tier,
  };
}

export const scoreOf = (i: Insight) => scoreInsight(i).total;

// Summed score across a set — used to rank signals by total opportunity mass.
export const sumScores = (list: Insight[]) =>
  list.reduce((acc, i) => acc + scoreOf(i), 0);
