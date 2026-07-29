// lib/selectors.ts — presentation-side corpus queries (v18).
// Data files stay the source of truth; these build the derived indexes the
// redesigned pages need (entity lookup, filtered lists, reverse signal index,
// insight↔participant matching).
import { ALL_INSIGHTS } from '../data/insights';
import { computeAllSignals, evidenceClass } from '../data/signals';
import type { ComputedSignal } from '../data/signals';
import { REAL_VOICES } from '../data/voices';
import type { RealVoice } from '../data/voices';
import { scoreOf } from './score';
import type { Insight } from '../types';
import type { InsightFilter } from './links';

const byId = new Map<string, Insight>(ALL_INSIGHTS.map((i) => [i.id, i]));
export const insightById = (id: string): Insight | undefined => byId.get(id);

let signalsCache: ComputedSignal[] | null = null;
export function allSignals(): ComputedSignal[] {
  if (!signalsCache) signalsCache = computeAllSignals();
  return signalsCache;
}
export const signalById = (id: string): ComputedSignal | undefined =>
  allSignals().find((s) => s.def.id === id);

// Reverse index: insight id → signals it belongs to.
let membershipCache: Map<string, ComputedSignal[]> | null = null;
export function signalsOf(insightId: string): ComputedSignal[] {
  if (!membershipCache) {
    membershipCache = new Map();
    for (const sig of allSignals()) {
      for (const ins of sig.insights) {
        const list = membershipCache.get(ins.id) ?? [];
        list.push(sig);
        membershipCache.set(ins.id, list);
      }
    }
  }
  return membershipCache.get(insightId) ?? [];
}

export function insightsWhere(f: InsightFilter): Insight[] {
  let list: Insight[] = ALL_INSIGHTS;
  if (f.ids?.length) {
    const wanted = new Set(f.ids);
    list = list.filter((i) => wanted.has(i.id));
  }
  if (f.signal) {
    const sig = signalById(f.signal);
    const member = new Set((sig?.insights ?? []).map((i) => i.id));
    list = list.filter((i) => member.has(i.id));
  }
  if (f.product) list = list.filter((i) => i.productIds.includes(f.product as Insight['productIds'][number]));
  if (f.persona) list = list.filter((i) => (i.personaIds ?? []).includes(f.persona as NonNullable<Insight['personaIds']>[number]));
  if (f.severity) list = list.filter((i) => i.severity === f.severity);
  if (f.tag) list = list.filter((i) => (i.tags as string[]).includes(f.tag!));
  if (f.source) {
    const s = f.source.toLowerCase();
    list = list.filter((i) => i.source.toLowerCase().includes(s));
  }
  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter(
      (i) =>
        i.text.toLowerCase().includes(q) ||
        (i.pullQuote ?? '').toLowerCase().includes(q) ||
        (i.soWhat ?? '').toLowerCase().includes(q) ||
        i.source.toLowerCase().includes(q)
    );
  }
  const sorted = [...list];
  if (f.sort === 'newest') sorted.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  else sorted.sort((a, b) => scoreOf(b) - scoreOf(a));
  return sorted;
}

/** Related by shared product + (persona or tag) overlap, scored by overlap size. */
export function relatedInsights(id: string, limit = 5): Insight[] {
  const base = byId.get(id);
  if (!base) return [];
  const scored = ALL_INSIGHTS.filter((i) => i.id !== id)
    .map((i) => {
      let overlap = 0;
      overlap += i.productIds.filter((p) => base.productIds.includes(p)).length;
      overlap += (i.personaIds ?? []).filter((p) => (base.personaIds ?? []).includes(p)).length;
      overlap += (i.tags as string[]).filter((t) => (base.tags as string[]).includes(t)).length * 0.5;
      return { i, overlap };
    })
    .filter((r) => r.overlap >= 2);
  scored.sort((a, b) => b.overlap - a.overlap || scoreOf(b.i) - scoreOf(a.i));
  return scored.slice(0, limit).map((r) => r.i);
}

/** Match an insight to a named participant via pullQuoteSource / source text. */
export function voiceForInsight(ins: Insight): RealVoice | undefined {
  const hay = `${ins.pullQuoteSource ?? ''} ${ins.source}`.toLowerCase();
  return REAL_VOICES.find(
    (v) => hay.includes(v.name.toLowerCase()) || hay.includes(v.institution.toLowerCase())
  );
}

/** Insights plausibly sourced from a participant's sessions. */
export function insightsForVoice(v: RealVoice): Insight[] {
  const name = v.name.toLowerCase();
  const inst = v.institution.toLowerCase();
  const label = v.granolaMeetingLabel.toLowerCase();
  return ALL_INSIGHTS.filter((i) => {
    const hay = `${i.pullQuoteSource ?? ''} ${i.source}`.toLowerCase();
    return hay.includes(name) || hay.includes(inst) || (label && hay.includes(label));
  }).sort((a, b) => scoreOf(b) - scoreOf(a));
}

export { evidenceClass };
