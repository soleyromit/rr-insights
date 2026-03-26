export type ProductId = 'exam-management' | 'faas' | 'course-eval' | 'skills-checklist' | 'learning-contracts';
export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low' | 'na';
export type InsightTag = 'theme' | 'gap' | 'opportunity' | 'persona' | 'platform' | 'ai' | 'new' | 'architecture' | 'decision' | 'persona-signal';
export type PersonaId = 'student' | 'dce' | 'scce' | 'program-director';
export type UrgencyLevel = 'fire' | 'warn' | 'ok';

export interface Insight {
  id: string; text: string; pullQuote?: string; pullQuoteSource?: string;
  tags: InsightTag[]; source: string; severity?: SeverityLevel;
  productIds: ProductId[]; personaIds?: PersonaId[];
  createdAt: string; confidence?: 'high' | 'medium' | 'inferred'; soWhat?: string;
}

export interface GapsByDiscipline { dev: string[]; ux: string[]; ui: string[]; product: string[]; }
export interface AIFeatureOpportunity { feature: string; problem: string; status: string; }
export interface NewFeatureFramework { aiOpportunities: AIFeatureOpportunity[]; designSystemComponents: string[]; microInteractions: string[]; }
export interface EnhancementRequest { request: string; requestedBy: string; priority: 'critical' | 'high' | 'medium' | 'low'; sessions: number; }
export interface AMPMPipeline { enhancementRequests: EnhancementRequest[]; pendingDecisions: string[]; }
export interface ProductDependency { product: ProductId; dependency: string; }

export interface ProductMeta {
  id: ProductId; name: string; shortName: string; description: string;
  status: 'active' | 'wip' | 'scoped' | 'planned'; accentColor: string;
  nps?: number; ticketsPerYear?: number; insightCount: number; criticalGaps: number;
  pilotDate?: string; launchDate?: string; userCount?: string; primaryPersonas: PersonaId[];
  priorityScore: number; daysToDeadline: number | null; urgencyLevel: UrgencyLevel;
  sentimentScore: number; granolaSessions: number; keyQuote: string; keyQuoteSource: string;
  hmwStatements: string[]; dayInLife: Partial<Record<PersonaId, string>>;
  happyPath: string; competitors: string[];
  roadmapPhases: { phase: string; items: string[] }[];
  gapsByDiscipline: GapsByDiscipline; newFeatureFramework: NewFeatureFramework;
  amPmPipeline: AMPMPipeline; productDependencies: ProductDependency[];
}

export interface PersonaMeta {
  id: PersonaId; name: string; role: string; avatarInitials: string; avatarColor: string;
  priority: 'very-high' | 'high' | 'medium'; products: ProductId[]; currentTools: string[];
  greatDay: string; poorDay: string;
  empathyMap: { thinks: string[]; feels: string[]; says: string[]; does: string[]; };
  frictions: string[]; motivations: string[]; povStatement: string;
}

export interface WhiteboardArtifact {
  id: string; title: string; source: string;
  category: 'product-context' | 'persona' | 'competitor' | 'strategic' | 'feature' | 'exam-intel';
  color: string; items: string[];
}

export interface VersionEntry {
  version: string; date: string; summary: string;
  insightCount: number; sessionsAdded: number; changedFiles: string[];
}

export interface Milestone {
  date: string; label: string; status: 'done' | 'active' | 'upcoming';
  productId?: ProductId; description: string; isHardDeadline?: boolean;
}

export interface TimelineItem {
  title: string;
  date: string;
  description: string;
  color: string;
  status: 'done' | 'active' | 'upcoming';
  label?: string;
  isHardDeadline?: boolean;
}
