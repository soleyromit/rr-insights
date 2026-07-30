// data/themes.ts — first-class theme taxonomy (spec 2026-07-29).
// Every insight carries exactly one themeId; coverage is enforced by the type
// system, not keyword matching. Signals stay the multi-membership strategic
// layer on top (signals.ts, unchanged).
export type ThemeId =
  | 'reporting-analytics' | 'config-debt' | 'form-experience'
  | 'accessibility' | 'ai-layer' | 'navigation-ia'
  | 'mobile-low-frequency' | 'skills-portability' | 'competitive'
  | 'integration-data' | 'platform-trust' | 'process-strategy';

export interface ThemeDef {
  id: ThemeId;
  title: string;
  description: string;        // one line, decision-oriented
  color: string;
  relatedSignalIds: string[]; // SIGNAL_DEFS ids where the layers overlap
}

export const THEMES: ThemeDef[] = [
  { id: 'reporting-analytics', title: 'Reporting & analytics deficit',
    description: 'Self-serve reports, dashboards, and accreditation-ready exports users cannot produce today.',
    color: '#e8604a', relatedSignalIds: ['reporting'] },
  { id: 'config-debt', title: 'Manual configuration debt',
    description: 'Excel workflows, hand-typed tags, manual ID sync, and support-ticket configuration.',
    color: '#d97706', relatedSignalIds: ['config-debt'] },
  { id: 'form-experience', title: 'Form & survey experience',
    description: 'Form building, validation timing, preview/simulation, question types, and form length.',
    color: '#6d5ed4', relatedSignalIds: [] },
  { id: 'accessibility', title: 'Accessibility & accommodations',
    description: 'WCAG/ADA compliance, accommodation profiles, and assistive-tech support.',
    color: '#2ec4a0', relatedSignalIds: [] },
  { id: 'ai-layer', title: 'AI opportunity layer',
    description: 'Confirmed AI use cases and the everywhere-it-helps-never-in-the-way principle.',
    color: '#16a34a', relatedSignalIds: ['ai-layer'] },
  { id: 'navigation-ia', title: 'Navigation & information architecture',
    description: 'Click depth, inconsistent paths, sidebar/role navigation, and question-bank IA.',
    color: '#3b82f6', relatedSignalIds: [] },
  { id: 'mobile-low-frequency', title: 'Mobile & low-frequency users',
    description: 'One-tap clinical workflows and SCCE/preceptor surfaces that must work without relearning.',
    color: '#0ea5e9', relatedSignalIds: ['scce-underservice'] },
  { id: 'skills-portability', title: 'Skills & competency portability',
    description: 'Program-level skill entities vs placement-scoped records; procedure and competency tracking.',
    color: '#e87ab5', relatedSignalIds: ['skills-entity'] },
  { id: 'competitive', title: 'Competitive positioning',
    description: 'ExamSoft/Canvas/D2L/Blackboard/Watermark gaps, displacement plays, and market strategy.',
    color: '#8b7ff5', relatedSignalIds: ['multicampus'] },
  { id: 'integration-data', title: 'Integration & data flow',
    description: 'LMS/CSV import, cross-system sync, and multi-system fragmentation.',
    color: '#f5a623', relatedSignalIds: [] },
  { id: 'platform-trust', title: 'Platform trust & quality',
    description: 'NPS signals, regressions, false positives, and reliability that erodes user trust.',
    color: '#dc2626', relatedSignalIds: ['overload'] },
  { id: 'process-strategy', title: 'Process & strategy',
    description: 'Roadmaps, team process, tooling, governance, and vision decisions.',
    color: '#8a8580', relatedSignalIds: [] },
];

const byId = new Map(THEMES.map(t => [t.id, t]));
export const getTheme = (id: string): ThemeDef | undefined => byId.get(id as ThemeId);
