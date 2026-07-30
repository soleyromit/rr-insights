// Single route registry — the one source of truth for paths, nav labels, and
// sections. Consumed by the router, the sidebar/shell, breadcrumbs, and the
// command palette. Old string ViewIds map through VIEW_PATH so legacy onNav
// callers and pre-router links keep working.
import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';

export type NavSection = 'home' | 'explore' | 'products' | 'story' | 'archive' | 'library';

export interface RouteDef {
  path: string;
  label: string;
  section?: NavSection; // present = shown in side nav
  component: LazyExoticComponent<ComponentType<any>>;
  /** old views still take onNav(viewId) — the shell injects a compat handler */
  needsOnNav?: boolean;
  productId?: string;
}

const v = (loader: () => Promise<Record<string, any>>, name: string) =>
  lazy(() => loader().then((m) => ({ default: m[name] })));

export const ROUTES: RouteDef[] = [
  { path: '/', label: 'Overview', section: 'home', component: v(() => import('../views/OverviewView'), 'OverviewView'), needsOnNav: true },
  { path: '/digest', label: 'This Week', section: 'home', component: v(() => import('../views/DigestView'), 'DigestView') },

  { path: '/insights', label: 'Insight Index', section: 'explore', component: v(() => import('../views/InsightIndexView'), 'InsightIndexView') },
  { path: '/insights/:insightId', label: 'Insight', component: v(() => import('../views/InsightDetailView'), 'InsightDetailView') },
  { path: '/highlights', label: 'Highlights', section: 'explore', component: v(() => import('../views/HighlightsView'), 'HighlightsView') },
  { path: '/signals', label: 'Signals', section: 'explore', component: v(() => import('../views/SignalsView'), 'SignalsView') },
  { path: '/signals/:signalId', label: 'Signal', component: v(() => import('../views/SignalDetailView'), 'SignalDetailView') },
  { path: '/personas', label: 'Persona Atlas', section: 'explore', component: v(() => import('../views/PersonasView'), 'PersonasView') },
  { path: '/personas/:personaId', label: 'Persona', component: v(() => import('../views/PersonaDetailView'), 'PersonaDetailView') },
  { path: '/participants', label: 'Participants', section: 'explore', component: v(() => import('../views/ParticipantsView'), 'ParticipantsView') },
  { path: '/participants/:voiceId', label: 'Participant', component: v(() => import('../views/ParticipantDetailView'), 'ParticipantDetailView') },
  { path: '/graph', label: 'Knowledge Graph', section: 'explore', component: v(() => import('../views/KnowledgeGraphView'), 'KnowledgeGraphView') },

  { path: '/products/exam-management', label: 'Exam', section: 'products', productId: 'exam-management', component: v(() => import('../views/products/ProductPage'), 'ProductPage') },
  { path: '/products/faas', label: 'FaaS', section: 'products', productId: 'faas', component: v(() => import('../views/products/ProductPage'), 'ProductPage') },
  { path: '/products/course-eval', label: 'Course Eval', section: 'products', productId: 'course-eval', component: v(() => import('../views/products/ProductPage'), 'ProductPage') },
  { path: '/products/skills-checklist', label: 'Skills', section: 'products', productId: 'skills-checklist', component: v(() => import('../views/products/ProductPage'), 'ProductPage') },
  { path: '/products/learning-contracts', label: 'LC', section: 'products', productId: 'learning-contracts', component: v(() => import('../views/products/ProductPage'), 'ProductPage') },
  { path: '/products/exam-management/spec', label: 'Exam — Spec', productId: 'exam-management', component: v(() => import('../views/products/ExamManagementView'), 'ExamManagementView') },
  { path: '/products/faas/spec', label: 'FaaS — Spec', productId: 'faas', component: v(() => import('../views/products/FaaSView'), 'FaaSView') },
  { path: '/products/course-eval/spec', label: 'Course Eval — Spec', productId: 'course-eval', component: v(() => import('../views/products/CourseEvalView'), 'CourseEvalView') },
  { path: '/products/skills-checklist/spec', label: 'Skills — Spec', productId: 'skills-checklist', component: v(() => import('../views/products/SkillsChecklistView'), 'SkillsChecklistView') },
  { path: '/products/learning-contracts/spec', label: 'LC — Spec', productId: 'learning-contracts', component: v(() => import('../views/products/LearningContractsView'), 'LearningContractsView') },
  { path: '/products/exam-management/audit', label: 'Exam Admin Audit', section: 'archive', productId: 'exam-management', component: v(() => import('../views/products/ExamAdminAuditView'), 'ExamAdminAuditView') },
  { path: '/products/exam-management/ia', label: 'Nav IA · Apr 1', section: 'archive', productId: 'exam-management', component: v(() => import('../views/products/NavIAView'), 'NavIAView') },
  { path: '/platform', label: 'Platform', section: 'products', component: v(() => import('../views/products/ExxatOneView'), 'ExxatOneView') },

  { path: '/decisions', label: 'Decisions', section: 'story', component: v(() => import('../views/DecisionsView'), 'DecisionsView') },
  { path: '/story', label: 'Connect the Dots', section: 'story', component: v(() => import('../views/NarrativeView'), 'NarrativeView'), needsOnNav: true },
  { path: '/roadmap', label: 'Roadmap', section: 'story', component: v(() => import('../views/RoadmapView'), 'RoadmapView') },
  { path: '/competitive', label: 'Competitive Parity', section: 'story', component: v(() => import('../views/CompetitiveView'), 'CompetitiveView') },
  { path: '/briefings', label: 'Briefings', section: 'story', component: v(() => import('../views/StakeholderView'), 'StakeholderView') },
  { path: '/portfolio', label: 'Portfolio', section: 'story', component: v(() => import('../views/PortfolioView'), 'PortfolioView') },
  { path: '/reports/nps-2025', label: 'NPS Intelligence 2025', section: 'archive', component: v(() => import('../views/NPSView'), 'NPSView') },
  { path: '/performance', label: 'Performance Ledger', section: 'archive', component: v(() => import('../views/ArunPerformanceView'), 'ArunPerformanceView') },
  { path: '/charts', label: 'Charts', section: 'explore', component: v(() => import('../views/ChartsView'), 'ChartsView') },
  { path: '/analytics', label: 'Analytics', section: 'explore', component: v(() => import('../views/AnalyticsView'), 'AnalyticsView') },

  { path: '/sources', label: 'Source Library', section: 'library', component: v(() => import('../views/WhiteboardView'), 'WhiteboardView'), needsOnNav: true },
  { path: '/changelog', label: 'Changelog', section: 'library', component: v(() => import('../views/ChangelogView'), 'ChangelogView') },
];

/** Old ViewId → new path. Feeds legacy onNav compat and pre-router redirects. */
export const VIEW_PATH: Record<string, string> = {
  overview: '/',
  insights: '/insights',
  highlights: '/highlights',
  signals: '/signals',
  themes: '/signals',
  personas: '/personas',
  'knowledge-graph': '/graph',
  'exam-management': '/products/exam-management',
  faas: '/products/faas',
  'course-eval': '/products/course-eval',
  'skills-checklist': '/products/skills-checklist',
  'learning-contracts': '/products/learning-contracts',
  'exam-spec': '/products/exam-management/spec',
  'faas-spec': '/products/faas/spec',
  'course-eval-spec': '/products/course-eval/spec',
  'skills-spec': '/products/skills-checklist/spec',
  'lc-spec': '/products/learning-contracts/spec',
  'exam-audit': '/products/exam-management/audit',
  'nav-ia': '/products/exam-management/ia',
  exactone: '/platform',
  narrative: '/story',
  roadmap: '/roadmap',
  competitive: '/competitive',
  stakeholder: '/briefings',
  portfolio: '/portfolio',
  nps: '/reports/nps-2025',
  'arun-performance': '/performance',
  analytics: '/analytics',
  whiteboard: '/sources',
  changelog: '/changelog',
};

export const SECTION_LABELS: Record<NavSection, string> = {
  home: 'Home',
  explore: 'Explore',
  products: 'Products',
  story: 'Story & Outputs',
  archive: 'Archive',
  library: 'Library',
};

export function routeForPath(pathname: string): RouteDef | undefined {
  return ROUTES.find((r) => r.path === pathname);
}
