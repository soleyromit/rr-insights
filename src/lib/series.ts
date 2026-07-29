// lib/series.ts — chart-data shapers (v18).
// Every @astryxdesign/charts usage feeds from here, so the canary chart API is
// isolated behind one seam and the binning/counting logic is testable.
import type { Insight } from '../types';
import { scoreOf } from './score';

export interface MonthPoint {
  month: string; // '2026-01'
  label: string; // 'Jan 26'
  total: number;
  critical: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function monthlyVolume(insights: Insight[]): MonthPoint[] {
  const bins = new Map<string, MonthPoint>();
  for (const i of insights) {
    const m = i.createdAt.slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(m)) continue;
    let b = bins.get(m);
    if (!b) {
      const [y, mo] = m.split('-').map(Number);
      b = { month: m, label: `${MONTHS[mo - 1]} ${String(y).slice(2)}`, total: 0, critical: 0 };
      bins.set(m, b);
    }
    b.total += 1;
    if (i.severity === 'critical') b.critical += 1;
  }
  return [...bins.values()].sort((a, b) => (a.month < b.month ? -1 : 1));
}

export interface SeverityMix {
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export function severityMix(insights: Insight[]): SeverityMix {
  const mix: SeverityMix = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const i of insights) {
    const s = i.severity;
    if (s && s in mix) mix[s as keyof SeverityMix] += 1;
  }
  return mix;
}

export interface RankedRow {
  key: string;
  label: string;
  value: number;
  critical?: number;
  hint?: string;
  href?: string;
}

export const scoreRanked = (insights: Insight[]) =>
  [...insights].sort((a, b) => scoreOf(b) - scoreOf(a));

/** All months from first to last datum, so small multiples share an aligned x-axis. */
export function monthDomain(insights: Insight[]): string[] {
  const months = insights.map((i) => i.createdAt.slice(0, 7)).filter((m) => /^\d{4}-\d{2}$/.test(m));
  if (!months.length) return [];
  let cur = months.reduce((a, b) => (a < b ? a : b));
  const last = months.reduce((a, b) => (a > b ? a : b));
  const out: string[] = [];
  while (cur <= last) {
    out.push(cur);
    const [y, m] = cur.split('-').map(Number);
    cur = m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`;
  }
  return out;
}

/** Zero-fill month points onto a shared domain. */
export function fillMonths(points: MonthPoint[], domain: string[]): MonthPoint[] {
  const have = new Map(points.map((p) => [p.month, p]));
  return domain.map((m) => {
    const [y, mo] = m.split('-').map(Number);
    return have.get(m) ?? { month: m, label: `${MONTHS[mo - 1]} ${String(y).slice(2)}`, total: 0, critical: 0 };
  });
}

/** Per-product monthly volume on a common zero-filled domain — small-multiples ready. */
export function perProductMonthly(
  insights: Insight[],
  productIds: string[]
): { key: string; points: MonthPoint[] }[] {
  const domain = monthDomain(insights);
  return productIds.map((p) => ({
    key: p,
    points: fillMonths(
      monthlyVolume(insights.filter((i) => (i.productIds as string[]).includes(p))),
      domain
    ),
  }));
}

/** Current vs prior rolling window — feeds TrendDelta. */
export function recentCounts(
  insights: Insight[],
  windowDays: number,
  anchorISO: string
): { current: number; prior: number } {
  const ms = 86400000;
  const anchor = new Date(anchorISO).getTime();
  const cut = new Date(anchor - windowDays * ms).toISOString().slice(0, 10);
  const cut2 = new Date(anchor - 2 * windowDays * ms).toISOString().slice(0, 10);
  return {
    current: insights.filter((i) => i.createdAt >= cut).length,
    prior: insights.filter((i) => i.createdAt >= cut2 && i.createdAt < cut).length,
  };
}

/** Severity mix per month, for stacked severity-over-time bars. */
export function severityByMonth(insights: Insight[]): ({ month: string; label: string } & SeverityMix)[] {
  const domain = monthDomain(insights);
  return domain.map((m) => {
    const [y, mo] = m.split('-').map(Number);
    return {
      month: m,
      label: `${MONTHS[mo - 1]} ${String(y).slice(2)}`,
      ...severityMix(insights.filter((i) => i.createdAt.slice(0, 7) === m)),
    };
  });
}

/** Early-vs-late tag movement; 'new' excluded by default (92% of corpus — no signal). */
export function tagTrends(
  insights: Insight[],
  opts: { exclude?: string[]; splitMonth: string }
): { tag: string; early: number; late: number; delta: number }[] {
  const exclude = new Set(opts.exclude ?? ['new']);
  const map = new Map<string, { early: number; late: number }>();
  for (const i of insights) {
    for (const t of i.tags as string[]) {
      if (exclude.has(t)) continue;
      const e = map.get(t) ?? { early: 0, late: 0 };
      if (i.createdAt.slice(0, 7) <= opts.splitMonth) e.early += 1;
      else e.late += 1;
      map.set(t, e);
    }
  }
  return [...map.entries()]
    .map(([tag, { early, late }]) => ({ tag, early, late, delta: late - early }))
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
}

/** Computed persona × product counts — the honest twin of the curated friction grid. */
export function personaProductMatrix(
  insights: Insight[],
  personas: string[],
  products: string[]
): { personas: string[]; products: string[]; counts: number[][] } {
  const counts = personas.map((pe) =>
    products.map(
      (pr) =>
        insights.filter(
          (i) =>
            (i.personaIds as string[] | undefined)?.includes(pe) &&
            (i.productIds as string[]).includes(pr)
        ).length
    )
  );
  return { personas, products, counts };
}

/** Evidence-quality shares (real "evidence debt" meters). */
export function evidenceDebt(insights: Insight[]): { n: number; pullQuoteShare: number; soWhatShare: number } {
  const n = insights.length;
  return {
    n,
    pullQuoteShare: n ? insights.filter((i) => i.pullQuote).length / n : 0,
    soWhatShare: n ? insights.filter((i) => i.soWhat).length / n : 0,
  };
}

/** Counts of insights along one dimension, descending. */
export function dimensionCounts(
  insights: Insight[],
  dim: (i: Insight) => string[] | string | undefined
): { key: string; count: number; critical: number }[] {
  const map = new Map<string, { key: string; count: number; critical: number }>();
  for (const i of insights) {
    const raw = dim(i);
    const keys = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
    for (const k of keys) {
      const e = map.get(k) ?? { key: k, count: 0, critical: 0 };
      e.count += 1;
      if (i.severity === 'critical') e.critical += 1;
      map.set(k, e);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}
