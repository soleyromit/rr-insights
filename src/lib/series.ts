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
