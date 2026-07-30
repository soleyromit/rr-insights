// data/journeys.ts — the workflow-journey stage map (v19.5).
// Curated stage definitions, computed membership (same pattern as signals):
// each stage names the themes that constitute it, and the UI derives counts
// live from ALL_INSIGHTS. Cross-cutting themes (ai-layer, competitive,
// process-strategy) are deliberately excluded — they are not journey stages.
import type { ThemeId } from './themes';

export interface JourneyStage {
  id: string;
  title: string;
  description: string;
  themeIds: ThemeId[];
}

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'setup',
    title: 'Set up & configure',
    description: 'Getting programs, forms, and integrations configured — today the Excel/support-ticket layer.',
    themeIds: ['config-debt', 'integration-data'],
  },
  {
    id: 'build',
    title: 'Build & author',
    description: 'Creating forms, surveys, questions, and assessments.',
    themeIds: ['form-experience'],
  },
  {
    id: 'navigate',
    title: 'Navigate & find',
    description: 'Finding the right place and thing — IA, click depth, question banks.',
    themeIds: ['navigation-ia'],
  },
  {
    id: 'execute',
    title: 'Execute & capture',
    description: 'Taking exams, logging in clinic, completing evaluations — including assistive and mobile contexts.',
    themeIds: ['accessibility', 'mobile-low-frequency'],
  },
  {
    id: 'track',
    title: 'Track progress',
    description: 'Answering "where do I stand" across rotations, skills, and requirements.',
    themeIds: ['skills-portability'],
  },
  {
    id: 'report',
    title: 'Review & report',
    description: 'Self-serve reports, dashboards, and accreditation evidence.',
    themeIds: ['reporting-analytics'],
  },
  {
    id: 'trust',
    title: 'Trust & adopt',
    description: 'Reliability, regressions, and NPS — whether users believe the platform.',
    themeIds: ['platform-trust'],
  },
];
