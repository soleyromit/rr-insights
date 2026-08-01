// data/internalTools.ts — lightweight registry for internal tools that have
// no Granola-sourced research corpus (unlike the 5 products in products.ts).
// Portal is Romit's own connector hub, not something Granola sessions cover
// — see docs/superpowers/specs/2026-08-01-build-status-sync-design.md §1.
import type { InternalToolMeta } from '../types';

export const INTERNAL_TOOLS: InternalToolMeta[] = [
  {
    id: 'portal',
    name: 'Workspace Portal',
    description: 'Connector hub for all Exxat products — App Store-style product pages with overview, resources, and what\'s-new tabs. Deployed at exxat-portal.vercel.app.',
    status: 'active',
    accentColor: '#475569',
    owner: 'Romit (PM + dev)',
    users: 'Internal Exxat team',
  },
];
