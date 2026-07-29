// lib/search.ts — one search index for the command palette (v18).
// Routes, signals, personas, products, participants, and the full insight
// corpus, each carrying the href the palette navigates to on select.
import type { SearchableItem } from '@astryxdesign/core/Typeahead';
import { ROUTES } from '../app/routes';
import { PRODUCTS } from '../data/products';
import { PERSONAS } from '../data/personas';
import { REAL_VOICES } from '../data/voices';
import { ALL_INSIGHTS } from '../data/insights';
import { allSignals } from './selectors';
import {
  hrefInsight,
  hrefParticipant,
  hrefPersona,
  hrefProduct,
  hrefSignal,
} from './links';

export type PaletteItem = SearchableItem<{
  group: string;
  href: string;
  hint?: string;
}>;

let cache: PaletteItem[] | null = null;

export function paletteItems(): PaletteItem[] {
  if (cache) return cache;
  const items: PaletteItem[] = [];

  for (const r of ROUTES) {
    if (!r.section) continue;
    items.push({
      id: `page:${r.path}`,
      label: r.label,
      auxiliaryData: { group: 'Pages', href: r.path },
    });
  }
  for (const s of allSignals()) {
    items.push({
      id: `signal:${s.def.id}`,
      label: s.def.title,
      auxiliaryData: { group: 'Signals', href: hrefSignal(s.def.id), hint: `${s.insights.length} insights` },
    });
  }
  for (const p of PRODUCTS) {
    items.push({
      id: `product:${p.id}`,
      label: p.name,
      auxiliaryData: { group: 'Products', href: hrefProduct(p.id) },
    });
  }
  for (const p of PERSONAS) {
    items.push({
      id: `persona:${p.id}`,
      label: `${p.name} — ${p.role}`,
      auxiliaryData: { group: 'Personas', href: hrefPersona(p.id) },
    });
  }
  for (const v of REAL_VOICES) {
    items.push({
      id: `voice:${v.id}`,
      label: `${v.name} · ${v.institution}`,
      auxiliaryData: { group: 'Participants', href: hrefParticipant(v.id) },
    });
  }
  for (const i of ALL_INSIGHTS) {
    items.push({
      id: `insight:${i.id}`,
      label: i.text.length > 110 ? `${i.text.slice(0, 110)}…` : i.text,
      auxiliaryData: { group: 'Insights', href: hrefInsight(i.id), hint: i.severity },
    });
  }

  cache = items;
  return items;
}
