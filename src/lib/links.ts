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
  sort?: 'score' | 'newest';
  ids?: string[];
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
export const hrefCharts = (dim?: string) => `/charts${qs({ dim })}`;
export const hrefCompetitive = (product?: string) => `/competitive${qs({ product })}`;
export const hrefBriefings = (audience?: string) => `/briefings${qs({ audience })}`;
export const hrefSources = (session?: string) => `/sources${qs({ session })}`;
export const hrefRoadmap = () => '/roadmap';
export const hrefStory = () => '/story';
export const hrefPortfolio = () => '/portfolio';
export const hrefGraph = () => '/graph';
