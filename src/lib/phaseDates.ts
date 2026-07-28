// lib/phaseDates.ts — derive phase state from dates, never from array position.
// Data-integrity rule (v15.1): if a phase name carries no parseable month+year, its state is
// 'unscheduled' and the UI must not claim done/active for it.
const MONTHS: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

export function parsePhaseDate(label: string): Date | null {
  // "Sep 2026 Cohere", "Mar 2027 LA", "Jun 2027 GA" → month + explicit year required.
  const m = label.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(?:(\d{1,2}),?\s+)?(20\d{2})\b/i);
  if (!m) return null;
  return new Date(Number(m[3]), MONTHS[m[1].slice(0, 3).toLowerCase()], m[2] ? Number(m[2]) : 1);
}

export type PhaseState = 'passed' | 'next' | 'later' | 'unscheduled';

export function computePhaseStates(labels: string[], today = new Date()): { date: Date | null; state: PhaseState }[] {
  const parsed = labels.map(l => parsePhaseDate(l));
  const futureDates = parsed.filter((d): d is Date => !!d && d >= today);
  const next = futureDates.length ? new Date(Math.min(...futureDates.map(d => d.getTime()))) : null;
  return parsed.map(d => ({
    date: d,
    state: !d ? 'unscheduled' : d < today ? 'passed' : next && d.getTime() === next.getTime() ? 'next' : 'later',
  }));
}
