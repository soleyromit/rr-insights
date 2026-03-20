// ─────────────────────────────────────────────
//  types/index.ts  —  shared data contracts
//  Adding a new product = add to ProductId union
// ─────────────────────────────────────────────

export type ProductId =
'exam-management' |
'faas' |
'course-eval' |
'skills-checklist' |
'learning-contracts';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'na';

export type InsightTag =
'theme' |
'gap' |
'opportunity' |
'persona' |
'platform' |
'ai' |
'new' |
'architecture';

export type PersonaId = 'student' | 'dce' | 'scce' | 'program-director';

export interface Insight {
  id: string;
  text: string;
  tags: InsightTag[];
  source: string;
  severity?: SeverityLevel;
  productIds: ProductId[];
  personaIds?: PersonaId[];
  createdAt: string; // ISO date
}

export interface ProductMeta {
  id: ProductId;
  name: string;
  shortName: string;
  description: string;
  status: 'active' | 'wip' | 'scoped' | 'planned';
  accentColor: string;
  nps?: number;
  ticketsPerYear?: number;
  insightCount: number;
  criticalGaps: number;
  pilotDate?: string;
  launchDate?: string;
}

export interface NavItem {
  id: string;
  label: string;
  section: 'workspace' | 'products' | 'intelligence' | 'portfolio';
  badge?: string;
  badgeVariant?: 'green' | 'amber' | 'coral' | 'blue' | 'teal' | 'accent';
  productId?: ProductId;
}

export interface PersonaMeta {
  id: PersonaId;
  name: string;
  role: string;
  avatarInitials: string;
  avatarColor: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimelineItem {
  title: string;
  date: string;
  description: string;
  color: string;
  status: 'done' | 'active' | 'upcoming';
}