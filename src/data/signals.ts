// data/signals.ts — Platform signal engine (P2, UX Audit v1)
// The 7 platform signals from SKILL §1, computed live from ALL_INSIGHTS.
// L0 of the drill-down contract: Signal → Evidence Set → Insight Card → Action.
import { ALL_INSIGHTS } from './insights';
import type { Insight, ProductId, PersonaId, SeverityLevel } from '../types';

export interface SignalDef {
  id: string;
  title: string;
  question: string;          // the decision question this signal answers
  color: string;
  products: ProductId[];
  personaFocus: PersonaId | 'all';
  designResponse: string;    // the so-what at signal level
  seedIds: string[];         // hand-confirmed member insights
  keywords: string[];        // text matchers (lowercase)
  special?: 'ai-tag' | 'scce-persona';
}

export const SIGNAL_DEFS: SignalDef[] = [
  {
    id: 'overload',
    title: 'Cognitive overload under constraint',
    question: 'Where does the platform push mental load onto the user instead of absorbing it?',
    color: '#8b7ff5',
    products: ['exam-management', 'faas', 'skills-checklist'],
    personaFocus: 'student',
    designResponse: 'Platform-level status layer from a shared data model. Every student surface shows where I am, what is left, and what happens next.',
    seedIds: ['ins-plat-001', 'ins-em-002', 'ins-sc-001'],
    keywords: ['cognitive', 'overload', 'annotation', 'mental load', 'overwhelm', 'lost in long forms', 'get lost', 'visually overwhelming'],
  },
  {
    id: 'reporting',
    title: 'Reporting deficit',
    question: 'Can a Program Director self-serve an accreditation-ready report today?',
    color: '#e8604a',
    products: ['exam-management', 'faas', 'course-eval'],
    personaFocus: 'program-director',
    designResponse: 'One narrative synthesis and structured reporting layer at platform level. AI narrative generation from aggregate scores is the fastest path.',
    seedIds: ['ins-plat-003', 'ins-faas-001', 'ins-ce-001'],
    keywords: ['accreditation-ready', 'self-serve report', 'monster grid', 'export workflow', 'reporting', 'no dashboards', 'accreditation report'],
  },
  {
    id: 'ai-layer',
    title: 'AI opportunity layer',
    question: 'Which confirmed AI use cases save the most faculty time per Arun\u2019s metric?',
    color: '#2ec4a0',
    products: ['exam-management', 'faas', 'course-eval', 'skills-checklist', 'learning-contracts'],
    personaFocus: 'all',
    designResponse: 'AI everywhere it helps, never in the way. Embedded as natural product behavior, no AI labeling, manual path always available.',
    seedIds: ['ins-plat-002'],
    keywords: [],
    special: 'ai-tag',
  },
  {
    id: 'config-debt',
    title: 'Manual configuration debt',
    question: 'What still requires Excel, a support ticket, or hand-typed tags to configure?',
    color: '#d97706',
    products: ['exam-management', 'faas'],
    personaFocus: 'dce',
    designResponse: 'Unified architecture eliminates the Excel/manual layer: auto ID sync, validated tag dropdowns, template-first form builder, self-service config.',
    seedIds: ['ins-plat-004', 'ins-faas-004', 'ins-em-010', 'ins-em-011'],
    keywords: ['manual', 'manually', 'excel', 'spelling mistake', 'synchronisation', 'synchronization', 'self-service', 'configuration'],
  },
  {
    id: 'multicampus',
    title: 'Multi-campus fragmentation',
    question: 'Can one exam or form serve every campus of a program without email and re-upload?',
    color: '#f5a623',
    products: ['exam-management', 'faas', 'course-eval'],
    personaFocus: 'dce',
    designResponse: 'Flat tagging architecture. First pilot proof point: Touro multi-campus exam sharing case study.',
    seedIds: ['ins-em-001'],
    keywords: ['campus', 'multi-campus', 'cross-campus'],
  },
  {
    id: 'skills-entity',
    title: 'Standalone skills entity gap',
    question: 'Can a student answer "have I done this skill across all rotations?" inside Exxat?',
    color: '#e87ab5',
    products: ['skills-checklist', 'learning-contracts'],
    personaFocus: 'student',
    designResponse: 'Skills become a program-level entity owned by the student, not scoped to a placement. Kills the 80\u201390% external-spreadsheet exodus.',
    seedIds: ['ins-sc-001', 'ins-sc-002', 'ins-lc-001'],
    keywords: ['placement-scoped', 'program-level entity', 'across all rotations', 'external tracking', 'procedure minimum'],
  },
  {
    id: 'scce-underservice',
    title: 'Mobile gap / SCCE underservice',
    question: 'What does an infrequent, external, mobile-first SCCE hit first \u2014 and does it work?',
    color: '#3b82f6',
    products: ['faas', 'skills-checklist', 'learning-contracts'],
    personaFocus: 'scce',
    designResponse: 'Reviewer dashboard with side-by-side comparison, mobile-first evaluation surfaces, zero-relearning flows for the lowest-frequency user.',
    seedIds: ['ins-faas-002', 'ins-faas-008'],
    keywords: ['mobile', 'preceptor', 'reviewer', 'side-by-side', 'relearning'],
    special: 'scce-persona',
  },
];

export interface ComputedSignal {
  def: SignalDef;
  insights: Insight[];               // severity-sorted members
  bySeverity: Record<string, number>;
  byProduct: Partial<Record<ProductId, number>>;
  byPersona: Partial<Record<PersonaId | 'unassigned', Insight[]>>;
  topSeverity: SeverityLevel;
}

const SEV_ORDER: SeverityLevel[] = ['critical', 'high', 'medium', 'low', 'na'];
const sevRank = (s?: SeverityLevel) => { const i = SEV_ORDER.indexOf(s ?? 'na'); return i === -1 ? 4 : i; };

function matches(def: SignalDef, ins: Insight): boolean {
  if (def.seedIds.includes(ins.id)) return true;
  if (def.special === 'ai-tag' && ins.tags.includes('ai')) return true;
  if (def.special === 'scce-persona' && (ins.personaIds ?? []).includes('scce')) return true;
  const text = ins.text.toLowerCase();
  // Word-boundary matching: 'report' must not fire inside 'reported' contexts it does not own,
  // and single-word keys match whole words only. Multi-word phrases match as phrases.
  const hit = def.keywords.some(k => k.includes(' ') || k.includes('-')
    ? text.includes(k)
    : new RegExp(`\\b${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(text));
  if (hit) {
    // keyword matches must also touch the signal's product set, to keep evidence honest
    return ins.productIds.some(p => def.products.includes(p));
  }
  return false;
}

export function computeSignal(def: SignalDef): ComputedSignal {
  const insights = ALL_INSIGHTS.filter(i => matches(def, i))
    .sort((a, b) => sevRank(a.severity) - sevRank(b.severity) || (b.createdAt > a.createdAt ? 1 : -1));
  const bySeverity: Record<string, number> = {};
  const byProduct: Partial<Record<ProductId, number>> = {};
  const byPersona: Partial<Record<PersonaId | 'unassigned', Insight[]>> = {};
  for (const i of insights) {
    const s = i.severity ?? 'na';
    bySeverity[s] = (bySeverity[s] ?? 0) + 1;
    for (const p of i.productIds) byProduct[p] = (byProduct[p] ?? 0) + 1;
    const personas = i.personaIds && i.personaIds.length ? i.personaIds : (['unassigned'] as const);
    for (const pe of personas) { (byPersona[pe] ??= []).push(i); }
  }
  return { def, insights, bySeverity, byProduct, byPersona, topSeverity: insights[0]?.severity ?? 'na' };
}

export const computeAllSignals = (): ComputedSignal[] =>
  SIGNAL_DEFS.map(computeSignal).sort((a, b) =>
    sevRank(a.topSeverity) - sevRank(b.topSeverity) || b.insights.length - a.insights.length);

// Evidence-class labeling (Lens 8/9): what kind of claim is this?
export type EvidenceClass = 'DIRECT QUOTE' | 'SYNTHESIS' | 'HYPOTHESIS';
export function evidenceClass(i: Insight): EvidenceClass {
  if (i.pullQuote) return 'DIRECT QUOTE';
  if (i.confidence === 'inferred') return 'HYPOTHESIS';
  return 'SYNTHESIS';
}
export const EVIDENCE_COLORS: Record<EvidenceClass, string> = {
  'DIRECT QUOTE': '#16a34a',
  'SYNTHESIS': '#6d5ed4',
  'HYPOTHESIS': '#d97706',
};
