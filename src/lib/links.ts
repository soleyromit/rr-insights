// lib/links.ts — the link contract (v18).
// Canonical rule: anything that names an entity links to that entity; any
// aggregate number links to the query that produces it. All URL construction
// goes through these builders so the contract is enforced in one place.
import type { SeverityLevel } from '../types';

export interface InsightFilter {
  q?: string;
  tag?: string;
  severity?: SeverityLevel;
  product?: string;
  persona?: string;
  signal?: string;
  source?: string;
  /** Inclusive ISO-day bounds on createdAt; lexicographic compare is safe on ISO. */
  since?: string;
  until?: string;
  sort?: 'score' | 'newest';
  ids?: string[];
}

/** Inclusive day bounds for a 'YYYY-MM' month, for chart marks that open their month. */
export function monthRange(month: string): { since: string; until: string } {
  const [y, m] = month.split('-').map(Number);
  const last = new Date(y, m, 0).getDate();
  return { since: `${month}-01`, until: `${month}-${String(last).padStart(2, '0')}` };
}

/** Inverse of hrefInsights — one parser so every page reads filters identically. */
export function parseInsightFilter(params: URLSearchParams): InsightFilter {
  const get = (k: string) => params.get(k) ?? undefined;
  const ids = get('ids');
  return {
    q: get('q'),
    tag: get('tag'),
    severity: get('severity') as SeverityLevel | undefined,
    product: get('product'),
    persona: get('persona'),
    signal: get('signal'),
    source: get('source'),
    since: get('since'),
    until: get('until'),
    sort: get('sort') as InsightFilter['sort'],
    ids: ids ? ids.split(',').filter(Boolean) : undefined,
  };
}

function qs(params: Record<string, string | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) p.set(k, v);
  const s = p.toString();
  return s ? `?${s}` : '';
}

export const hrefInsights = (f: InsightFilter = {}) =>
  `/insights${qs({
    q: f.q,
    tag: f.tag,
    severity: f.severity,
    product: f.product,
    persona: f.persona,
    signal: f.signal,
    source: f.source,
    since: f.since,
    until: f.until,
    sort: f.sort,
    ids: f.ids?.join(','),
  })}`;

export const hrefInsight = (id: string, from?: string) =>
  `/insights/${id}${qs({ from })}`;

export const hrefSignals = () => '/signals';
export const hrefSignal = (id: string, ctx: { persona?: string; insight?: string } = {}) =>
  `/signals/${id}${qs({ persona: ctx.persona, insight: ctx.insight })}`;

export const hrefPersonas = () => '/personas';
export const hrefPersona = (id: string) => `/personas/${id}`;

export const hrefParticipants = () => '/participants';
export const hrefParticipant = (id: string) => `/participants/${id}`;

export const hrefProduct = (id: string) => `/products/${id}`;
export const hrefProductSpec = (id: string, section?: string) =>
  section ? `/products/${id}/spec/${section}` : `/products/${id}/spec`;

export const hrefHighlights = (product?: string) => `/highlights${qs({ product })}`;
export const hrefCharts = (dim?: string, viz?: 'ranked' | 'severity' | 'volume') =>
  `/charts${qs({ dim, viz })}`;
export const hrefCompetitive = (product?: string) => `/competitive${qs({ product })}`;
export const hrefBriefings = (audience?: string) => `/briefings${qs({ audience })}`;
export const hrefSources = (session?: string) => `/sources${qs({ session })}`;
export const hrefRoadmap = () => '/roadmap';
export const hrefStory = () => '/story';
export const hrefPortfolio = () => '/portfolio';
export const hrefGraph = () => '/graph';
