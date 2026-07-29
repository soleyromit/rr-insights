// views/KnowledgeGraphView.tsx — Knowledge Graph (v18 restyle).
// The hand-rolled force simulation and SVG rendering are kept intact; the
// chrome (header, filters, legend, detail panel) moved to Astryx components
// and all colors now come from the chart theme (categorical for node types,
// semantic/structural for edge types). Nodes that map to a routable entity
// navigate on click; everything else stays selection-only with outbound links
// in the detail panel.
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChartColors, ChartLegend } from '@astryxdesign/charts';
import type { LegendItem } from '@astryxdesign/charts';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Token } from '@astryxdesign/core/Token';
import { Button } from '@astryxdesign/core/Button';
import { TextInput } from '@astryxdesign/core/TextInput';
import { PageHeader } from '../components/ui/PageHeader';
import { QueryLink } from '../components/story/QueryLink';
import { getProduct } from '../data/products';
import { PERSONAS } from '../data/personas';
import { ALL_INSIGHTS } from '../data/insights';
import { insightById, insightsWhere, productFacts } from '../lib/selectors';
import { hrefProduct, hrefPersona, hrefInsight, hrefInsights } from '../lib/links';

// ─── Static graph data built from SKILL.md Section 1 ─────────────────────
// Every node = real information source. Every edge = real documented connection.
interface GNode {
  id: string; label: string; type: 'session' | 'doc' | 'insight' | 'feature' | 'persona' | 'pattern';
  product: string; confidence: 'high' | 'medium' | 'low';
  detail: string; speaker?: string; date?: string;
}

interface GEdge {
  source: string; target: string;
  type: 'source-of' | 'confirms' | 'extends' | 'blocks' | 'contradicts';
  label: string;
}

const NODES: GNode[] = [
  // ── Granola sessions ──────────────────────────────────────────────────────
  { id: 's-f29a990d', label: 'Aarti+Kunal Accessibility', type: 'session', product: 'exam-management', confidence: 'high', detail: 'Mar 20 — Title II ADA April 24 deadline, submit button behavior, flag 2×2 matrix, alt text as publish gate, FaaS 3-pane inaccessible.', speaker: 'Aarti, Kunal', date: 'Mar 20' },
  { id: 's-791334af', label: 'Arun Vision 3yr', type: 'session', product: 'exam-management', confidence: 'high', detail: 'Mar 24 — AI everywhere on admin side. Blueprint assembly. Design system not mandated. Vishaka = daily authority. No cap on hiring.', speaker: 'Arun', date: 'Mar 24' },
  { id: 's-6fdcd0dd', label: 'Exam Standup', type: 'session', product: 'exam-management', confidence: 'high', detail: 'Mar 26 — DRAFT≠PRIVATE, CATEGORIES vs TAGS, QB landing = assessment builder, optional FK, online approval workflow.', speaker: 'Nipun, Vishaka', date: 'Mar 26' },
  { id: 's-f59ac2a6', label: 'QB Multi-Campus', type: 'session', product: 'exam-management', confidence: 'high', detail: 'Mar 12 — Flat pool + Smart Views confirmed. David Stocker asks for difficulty visualization. Per-cohort filtering request.', speaker: 'David Stocker, Nipun', date: 'Mar 12' },
  { id: 's-4c9b94f5', label: 'Nipun UNF Pilot', type: 'session', product: 'exam-management', confidence: 'high', detail: 'Mar 11 — Per-option rationale, ACR/VPAT report required, learning mode vs assessment mode, July pilot deadline.', speaker: 'Nipun', date: 'Mar 11' },
  { id: 's-ca5a709c', label: 'Ed Razenbach Day1', type: 'session', product: 'exam-management', confidence: 'high', detail: 'Feb 26 — AI remediation per-student, KR-20+point-biserial+upper-lower 27%, PACRAT z-score methodology, PANCE predictor.', speaker: 'Ed Razenbach', date: 'Feb 26' },
  { id: 's-f5d66e4c', label: 'Touro ExamSoft', type: 'session', product: 'exam-management', confidence: 'high', detail: 'Mar 11 — Curriculum mapping locked in ExamSoft. AI from slides lifesaver. Curve options: full credit/bonus/answer change. Watch-list concept.', speaker: 'Ed, Mary', date: 'Mar 11' },
  { id: 's-2768ba8d', label: 'Dr Vicky Mody', type: 'session', product: 'exam-management', confidence: 'high', detail: 'Mar 20 — Formula/variable injection missing in ExamSoft. Ordering question type missing. LMS course ID sync. Blackboard for content only.', speaker: 'Dr. Vicky Mody', date: 'Mar 20' },
  { id: 's-13352a23', label: 'Prasanjit FaaS+Log', type: 'session', product: 'faas', confidence: 'high', detail: 'Mar 25 — No inline field validation (WCAG 3.3.1 violation). Scroll sync broken. Section color coding lost in migration. ICD chip display issue.', speaker: 'Prasanjit', date: 'Mar 25' },
  { id: 's-9f1f5f4f', label: 'Harsha FaaS', type: 'session', product: 'faas', confidence: 'high', detail: 'Mar 20 — FaaS must be headless. No simulator = 2-3 month error lag. Free-text tags cause silent data corruption.', speaker: 'Harsha', date: 'Mar 20' },
  { id: 's-19c032d2', label: 'Akshit Q2', type: 'session', product: 'faas', confidence: 'high', detail: 'Mar 25 — Q2 strategy: template-first entry. 80-85% of creation is cloning existing template. Internal users before external.', speaker: 'Akshit', date: 'Mar 25' },
  { id: 's-bde86866', label: 'Mohil Vishaka David PCE', type: 'session', product: 'course-eval', confidence: 'high', detail: 'Mar 24 — PCE lives inside surveys as premium tile. Separate didactic vs clinical question sets. Pre-requisite: course offerings in Prism.', speaker: 'Vishaka, David', date: 'Mar 24' },
  { id: 's-5890b614', label: 'Day4 Marriott Skills', type: 'session', product: 'skills-checklist', confidence: 'high', detail: 'Mar 5 — Skills must be program-scoped not placement-scoped. PA passport model. Students trigger own evaluation when ready.', speaker: 'Multiple', date: 'Mar 5' },
  // ── Project documents ─────────────────────────────────────────────────────
  { id: 'd-stakeholder-day1', label: 'Stakeholder Summary Day1', type: 'doc', product: 'exam-management', confidence: 'high', detail: 'System hierarchy, competitor analysis, shortcuts-not-copies model, Canvas Two Systems Problem, phased rollout.', date: 'Feb 2026' },
  { id: 'd-stakeholder-day2', label: 'Stakeholder Summary Day2', type: 'doc', product: 'exam-management', confidence: 'high', detail: 'QB deep-dive, tagging (4 categories), versioning mechanics, access permissions, sharing model, V0→V3 lifecycle.', date: 'Feb 2026' },
  { id: 'd-marks', label: 'Marks Weightage Features', type: 'doc', product: 'exam-management', confidence: 'high', detail: 'Equal distribution, manual per-question, section totals, Bloom\'s-based distribution, partial credit, negative marking. 22 features phased.', date: 'Mar 2026' },
  { id: 'd-roles-statuses', label: 'QB Roles & Statuses', type: 'doc', product: 'exam-management', confidence: 'high', detail: 'All roles: Inst Admin, Dept Head, Initiative Lead, Faculty, Reviewer. All statuses V0-V3. Deletion policy (strict vs flexible).', date: 'Mar 2026' },
  { id: 'd-tagging', label: 'Tagging Strategy PDF', type: 'doc', product: 'exam-management', confidence: 'high', detail: 'Tag types: Subject, Bloom\'s, Difficulty, Competency. Compound difficulty+year tag. AI shadow tags for quality check.', date: 'Mar 2026' },
  { id: 'd-nps', label: 'NPS 2025 Textual', type: 'doc', product: 'faas', confidence: 'high', detail: 'FaaS NPS 2/5. Textual responses surface top friction: form complexity, no preview, no governance, support dependency.', date: '2025' },
  { id: 'd-touro-vishaka', label: 'Touro Vishaka Notes', type: 'doc', product: 'exam-management', confidence: 'high', detail: 'Vishaka\'s field notes from Touro site visit. Curriculum mapping in ExamSoft. Monster grid feedback. Watch-list wishlist.', date: 'Mar 11' },
  // ── Key insights ──────────────────────────────────────────────────────────
  { id: 'i-faas-validation', label: 'FaaS: No inline validation', type: 'insight', product: 'faas', confidence: 'high', detail: 'Numeric fields accept any value. Error only on submit. WCAG 3.3.1 violation AND baseline expectation from SurveyMonkey/Typeform.', speaker: 'Prasanjit' },
  { id: 'i-exam-ai-door', label: 'ExamSoft anti-AI = Exxat door', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'ExamSoft is publicly anti-AI. Arun: "Amazing from our point of view." Every AI feature in Exam Management exploits this gap.', speaker: 'Arun' },
  { id: 'i-formula-gap', label: 'Formula questions gap (ExamSoft)', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'Dr. Vicky Mody confirmed ExamSoft has no formula/variable injection. Anti-cheating by design: 10 students get 10 different problems.', speaker: 'Dr. Vicky Mody' },
  { id: 'i-ordering-gap', label: 'Ordering question type (ExamSoft)', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'ExamSoft missing ordering/sequence question type. Critical for glycolysis steps, pathophysiology sequences.', speaker: 'Dr. Vicky Mody' },
  { id: 'i-watch-list', label: 'Auto watch-list (Touro wish)', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'Mary Touro: "Wouldn\'t it be nice if the computer flagged them automatically." Threshold criteria: GPA<2.67, 2+ EOR fails, 2+ makeups.', speaker: 'Mary Touro' },
  { id: 'i-draft-private', label: 'DRAFT ≠ PRIVATE state gap', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'DRAFT = incomplete WIP, unusable even by author. PRIVATE = complete, restricted to creator. Two states, visually distinct.', speaker: 'Nipun' },
  { id: 'i-cats-tags', label: 'CATEGORIES vs TAGS', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'CATEGORIES = school-defined, mandatory, non-modifiable. TAGS = personal, optional, faculty-owned. Naming and behavior are different.', speaker: 'Vishaka' },
  { id: 'i-3pane-a11y', label: 'FaaS 3-pane inaccessible', type: 'insight', product: 'faas', confidence: 'high', detail: 'Aarti: most competitors have similar layout, none are accessible. Use linear wizard pattern for FaaS instead.', speaker: 'Aarti' },
  { id: 'i-skills-scope', label: 'Skills program-scoped gap', type: 'insight', product: 'skills-checklist', confidence: 'high', detail: '80-90% of students build external spreadsheets because the platform ties skills to individual placements, not program. Must be program-scoped.', speaker: 'Day 4 Marriott' },
  { id: 'i-simulator', label: 'FaaS no simulator = 2-3mo lag', type: 'insight', product: 'faas', confidence: 'high', detail: 'Harsha: without a preview/simulator, configuration errors are only discovered when forms are live. 2-3 month discovery lag.', speaker: 'Harsha' },
  { id: 'i-remediation', label: 'AI remediation per-student', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'Ed: "Two students failed but each got different question sets from me." AI generates personalised remediation targeting weak competencies.', speaker: 'Ed Razenbach' },
  { id: 'i-acr-report', label: 'ACR/VPAT required per release', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'Nipun: "We need to generate an ACR report for whatever design we are trying to make." WCAG 2.1 AA against ADA Title II.', speaker: 'Nipun' },
  { id: 'i-per-option-rationale', label: 'Per-option rationale (not shared)', type: 'insight', product: 'exam-management', confidence: 'high', detail: 'Nipun: "Maybe better if we give different rationales for different options." AI can draft. Better for guided learning mode.', speaker: 'Nipun' },
  // ── Features (design outputs) ─────────────────────────────────────────────
  { id: 'f-formula-editor', label: 'Formula Question Editor', type: 'feature', product: 'exam-management', confidence: 'high', detail: 'Variable injection with min/max/step ranges. Unique values per student. Live preview. Anti-cheating by design. Built in Magic Patterns v14.' },
  { id: 'f-watch-list', label: 'Auto Watch-list Widget', type: 'feature', product: 'exam-management', confidence: 'high', detail: 'Auto-flags students against threshold criteria. Built in ExamDashboard v15. Shows risk level (High/Medium), cohort, and flag reasons.' },
  { id: 'f-review-queue', label: 'Online Review Queue', type: 'feature', product: 'exam-management', confidence: 'high', detail: 'Approve / Request revision / Reject with inline comment. Built in ReviewQueue.tsx. Replaces ExamSoft offline email approval.' },
  { id: 'f-ai-generate', label: 'AI Generate Panel', type: 'feature', product: 'exam-management', confidence: 'high', detail: 'Three entry points: generate from slides, blueprint assembly, ExamSoft import. Built in ExamDashboard v15.' },
  { id: 'f-acr-panel', label: 'ACR Conformance Report', type: 'feature', product: 'exam-management', confidence: 'high', detail: '11 WCAG 2.1 AA criteria with pass/partial/fail. Export VPAT button. Built in PublishPhase v15.' },
  { id: 'f-per-option', label: 'Per-option Rationale Editor', type: 'feature', product: 'exam-management', confidence: 'high', detail: 'Toggle between shared rationale and per-option rationale. AI draft per option. After-submit preview. Built in QuestionEditor v15.' },
  { id: 'f-ordering', label: 'Ordering Question Type', type: 'feature', product: 'exam-management', confidence: 'high', detail: 'Drag-to-sequence question type. Student sees randomised order. Built in QuestionEditor v15. Fills ExamSoft gap confirmed by Dr. Vicky Mody.' },
  { id: 'f-faas-inline-val', label: 'FaaS Inline Validation', type: 'feature', product: 'faas', confidence: 'medium', detail: 'Real-time field validation with visible limits. Inline error on blur. Fixes WCAG 3.3.1 violation identified by Prasanjit. Not yet built.' },
  // ── WCAG / patterns ───────────────────────────────────────────────────────
  { id: 'p-wcag-1.1.1', label: 'WCAG 1.1.1 Alt Text', type: 'pattern', product: 'exam-management', confidence: 'high', detail: 'Non-text content must have alt text. Publish gate blocker. ADA Title II April 24.' },
  { id: 'p-wcag-3.3.1', label: 'WCAG 3.3.1 Error ID', type: 'pattern', product: 'faas', confidence: 'high', detail: 'Error identification must be immediate, not deferred to submit. Applies to FaaS all form controls.' },
  { id: 'p-submit-only', label: 'Submit-only validation antipattern', type: 'pattern', product: 'platform', confidence: 'high', detail: 'Platform-level signal (3+ products). Deferred validation = poor UX + WCAG violation. Fix: inline validation on all inputs.' },
];

const EDGES: GEdge[] = [
  // Prasanjit connection (the template from SKILL.md)
  { source: 's-13352a23', target: 'i-faas-validation', type: 'source-of', label: 'identifies' },
  { source: 'i-faas-validation', target: 'p-wcag-3.3.1', type: 'confirms', label: 'violates' },
  { source: 'i-faas-validation', target: 'p-submit-only', type: 'confirms', label: 'confirms' },
  { source: 'p-wcag-3.3.1', target: 'f-faas-inline-val', type: 'source-of', label: 'requires' },
  { source: 'i-faas-validation', target: 'f-faas-inline-val', type: 'source-of', label: 'drives' },
  // Aarti accessibility chain
  { source: 's-f29a990d', target: 'i-3pane-a11y', type: 'source-of', label: 'identifies' },
  { source: 's-f29a990d', target: 'p-wcag-1.1.1', type: 'source-of', label: 'mandates' },
  { source: 'p-wcag-1.1.1', target: 'f-acr-panel', type: 'source-of', label: 'requires' },
  { source: 's-4c9b94f5', target: 'i-acr-report', type: 'source-of', label: 'identifies' },
  { source: 'i-acr-report', target: 'f-acr-panel', type: 'source-of', label: 'drives' },
  { source: 's-f29a990d', target: 'i-draft-private', type: 'extends', label: 'context' },
  // Nipun decisions
  { source: 's-6fdcd0dd', target: 'i-draft-private', type: 'source-of', label: 'confirms' },
  { source: 's-6fdcd0dd', target: 'i-cats-tags', type: 'source-of', label: 'confirms' },
  { source: 's-4c9b94f5', target: 'i-per-option-rationale', type: 'source-of', label: 'identifies' },
  { source: 'i-per-option-rationale', target: 'f-per-option', type: 'source-of', label: 'drives' },
  // Formula questions
  { source: 's-2768ba8d', target: 'i-formula-gap', type: 'source-of', label: 'identifies' },
  { source: 's-2768ba8d', target: 'i-ordering-gap', type: 'source-of', label: 'identifies' },
  { source: 'i-formula-gap', target: 'f-formula-editor', type: 'source-of', label: 'drives' },
  { source: 'i-ordering-gap', target: 'f-ordering', type: 'source-of', label: 'drives' },
  // ExamSoft AI gap
  { source: 's-791334af', target: 'i-exam-ai-door', type: 'source-of', label: 'confirms' },
  { source: 'i-exam-ai-door', target: 'f-ai-generate', type: 'source-of', label: 'enables' },
  // Watch-list
  { source: 's-f5d66e4c', target: 'i-watch-list', type: 'source-of', label: 'identifies' },
  { source: 'i-watch-list', target: 'f-watch-list', type: 'source-of', label: 'drives' },
  // Review queue
  { source: 's-6fdcd0dd', target: 'f-review-queue', type: 'source-of', label: 'drives' },
  // Ed Razenbach chain
  { source: 's-ca5a709c', target: 'i-remediation', type: 'source-of', label: 'identifies' },
  { source: 'i-remediation', target: 'f-ai-generate', type: 'extends', label: 'extends use case' },
  { source: 's-ca5a709c', target: 's-f5d66e4c', type: 'confirms', label: 'same KR-20 methodology' },
  // Doc connections
  { source: 'd-stakeholder-day2', target: 'i-draft-private', type: 'confirms', label: 'confirms' },
  { source: 'd-stakeholder-day2', target: 'i-cats-tags', type: 'confirms', label: 'confirms' },
  { source: 'd-marks', target: 'f-formula-editor', type: 'extends', label: 'marks spec' },
  { source: 'd-roles-statuses', target: 'i-draft-private', type: 'confirms', label: 'documents' },
  { source: 'd-tagging', target: 'i-cats-tags', type: 'confirms', label: 'documents' },
  { source: 'd-nps', target: 'i-simulator', type: 'confirms', label: 'confirms pain' },
  { source: 's-9f1f5f4f', target: 'i-simulator', type: 'source-of', label: 'identifies' },
  { source: 'd-touro-vishaka', target: 'i-watch-list', type: 'confirms', label: 'field evidence' },
  // PCE
  { source: 's-bde86866', target: 's-ca5a709c', type: 'extends', label: 'evaluation context' },
  // Skills
  { source: 's-5890b614', target: 'i-skills-scope', type: 'source-of', label: 'identifies' },
];

type FilterType = 'all' | 'session' | 'doc' | 'insight' | 'feature' | 'pattern';
type ProductFilter = 'all' | 'exam-management' | 'faas' | 'course-eval' | 'skills-checklist' | 'platform';

const TYPE_FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All types' },
  { id: 'session', label: 'Sessions' },
  { id: 'doc', label: 'Docs' },
  { id: 'insight', label: 'Insights' },
  { id: 'feature', label: 'Features' },
  { id: 'pattern', label: 'Patterns' },
];

const PROD_FILTERS: { id: ProductFilter; label: string }[] = [
  { id: 'all', label: 'All products' },
  { id: 'exam-management', label: 'Exam Mgmt' },
  { id: 'faas', label: 'FaaS' },
  { id: 'course-eval', label: 'Course Eval' },
  { id: 'skills-checklist', label: 'Skills' },
  { id: 'platform', label: 'Platform' },
];

const NODE_LETTER: Record<GNode['type'], string> = { session: 'S', doc: 'D', insight: 'I', feature: 'F', pattern: 'P', persona: 'U' };

/** Canonical route for nodes that map to a routable entity; null = selection-only. */
function routeForNode(n: GNode): string | null {
  if (n.type === 'insight' && insightById(n.id)) return hrefInsight(n.id, 'graph');
  if (n.type === 'persona' && PERSONAS.some((p) => p.id === n.id)) return hrefPersona(n.id);
  return null;
}

/** Corpus query for a session node via source-substring match. Tries the node
 * label, then each named speaker; returns the first fragment that matches. */
function sessionQuery(n: GNode): { href: string; count: number } | null {
  if (n.type !== 'session') return null;
  const candidates = [n.label, ...(n.speaker ? n.speaker.split(',').map((s) => s.trim()) : [])];
  for (const frag of candidates) {
    if (!frag) continue;
    const count = insightsWhere({ source: frag }).length;
    if (count > 0) return { href: hrefInsights({ source: frag }), count };
  }
  return null;
}

export function KnowledgeGraphView() {
  const navigate = useNavigate();
  const colors = useChartColors();
  const cat = colors.categorical(5);
  const NODE_TYPE_COLORS: Record<GNode['type'], string> = {
    session: cat[0], doc: cat[1], insight: cat[2], feature: cat[3], pattern: cat[4], persona: cat[0],
  };
  const EDGE_COLORS: Record<GEdge['type'], string> = {
    'source-of': colors.structural.axis,
    confirms: colors.semantic.positive,
    extends: colors.semantic.warning,
    blocks: colors.semantic.negative,
    contradicts: colors.semantic.negative,
  };

  const [selectedNode, setSelectedNode] = useState<GNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterProduct, setFilterProduct] = useState<ProductFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const animRef = useRef<number | null>(null);
  const posRef = useRef<Record<string, { x: number; y: number; vx: number; vy: number }>>({});
  const W = 900; const H = 560;

  // Initialize positions
  useEffect(() => {
    const initial: Record<string, { x: number; y: number; vx: number; vy: number }> = {};
    NODES.forEach((n, i) => {
      const angle = (i / NODES.length) * 2 * Math.PI;
      const radius = 150 + Math.random() * 120;
      initial[n.id] = {
        x: W / 2 + Math.cos(angle) * radius,
        y: H / 2 + Math.sin(angle) * radius,
        vx: 0, vy: 0,
      };
    });
    posRef.current = initial;
    setPositions(Object.fromEntries(Object.entries(initial).map(([k, v]) => [k, { x: v.x, y: v.y }])));
  }, []);

  // Force simulation
  useEffect(() => {
    let frame = 0;
    const simulate = () => {
      const pos = posRef.current;
      const k = 0.015;
      const repulsion = 1800;
      const damping = 0.88;
      const ids = Object.keys(pos);

      // Repulsion between all nodes
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          const a = pos[ids[i]]; const b = pos[ids[j]];
          const dx = a.x - b.x; const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force; const fy = (dy / dist) * force;
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
        }
      }

      // Attraction along edges
      EDGES.forEach(e => {
        const a = pos[e.source]; const b = pos[e.target];
        if (!a || !b) return;
        const dx = b.x - a.x; const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const ideal = 140;
        const force = k * (dist - ideal);
        const fx = (dx / dist) * force; const fy = (dy / dist) * force;
        a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
      });

      // Center gravity
      ids.forEach(id => {
        const n = pos[id];
        n.vx += (W / 2 - n.x) * 0.003;
        n.vy += (H / 2 - n.y) * 0.003;
        n.vx *= damping; n.vy *= damping;
        n.x = Math.max(40, Math.min(W - 40, n.x + n.vx));
        n.y = Math.max(40, Math.min(H - 40, n.y + n.vy));
      });

      if (frame % 3 === 0) {
        setPositions(Object.fromEntries(ids.map(id => [id, { x: pos[id].x, y: pos[id].y }])));
      }
      frame++;
      animRef.current = requestAnimationFrame(simulate);
    };
    animRef.current = requestAnimationFrame(simulate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, []);

  const filteredNodeIds = new Set(
    NODES.filter(n => {
      const typeOk = filterType === 'all' || n.type === filterType;
      const prodOk = filterProduct === 'all' || n.product === filterProduct;
      const searchOk = !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (n.speaker || '').toLowerCase().includes(searchQuery.toLowerCase());
      return typeOk && prodOk && searchOk;
    }).map(n => n.id)
  );

  const connectedToSelected = selectedNode
    ? new Set(EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
        .flatMap(e => [e.source, e.target]))
    : null;

  const getNodeOpacity = (id: string) => {
    if (selectedNode) return connectedToSelected?.has(id) ? 1 : 0.15;
    if (!filteredNodeIds.has(id)) return 0.08;
    if (hoveredNode) return id === hoveredNode ? 1 : 0.35;
    return 1;
  };

  const getEdgeOpacity = (e: GEdge) => {
    if (!filteredNodeIds.has(e.source) || !filteredNodeIds.has(e.target)) return 0;
    if (selectedNode) return (e.source === selectedNode.id || e.target === selectedNode.id) ? 0.85 : 0.05;
    if (hoveredNode) return (e.source === hoveredNode || e.target === hoveredNode) ? 0.8 : 0.08;
    return 0.3;
  };

  const nodeRadius = (n: GNode) => n.type === 'session' ? 11 : n.type === 'feature' ? 10 : 8;

  const handleNodeClick = (n: GNode) => {
    const route = routeForNode(n);
    if (route) {
      navigate(route);
      return;
    }
    setSelectedNode(prev => (prev?.id === n.id ? null : n));
  };

  const selectedProduct = selectedNode ? getProduct(selectedNode.product) : undefined;

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Knowledge Graph"
        lede="Every Granola session, project doc, insight, and feature — connected by evidence. Click any node to trace its information lineage."
        meta={`${NODES.length} curated nodes · ${EDGES.length} edges — a hand-built subset tracing key chains, not auto-derived from the ${ALL_INSIGHTS.length}-insight corpus · edge direction = information flow`}
      />

      <HStack gap={3} vAlign="center" wrap="wrap">
        <TextInput
          label="Search nodes"
          isLabelHidden
          value={searchQuery}
          onChange={(v) => setSearchQuery(v)}
          placeholder="Search nodes, speakers…"
          hasClear
        />
        <HStack gap={1.5} wrap="wrap">
          {TYPE_FILTERS.map((f) => (
            <Token key={f.id} label={f.label} color={filterType === f.id ? 'blue' : 'default'} onClick={() => setFilterType(f.id)} />
          ))}
        </HStack>
        <HStack gap={1.5} wrap="wrap">
          {PROD_FILTERS.map((f) => (
            <Token key={f.id} label={f.label} color={filterProduct === f.id ? 'purple' : 'default'} onClick={() => setFilterProduct(f.id)} />
          ))}
        </HStack>
        {selectedNode && <Button label="Clear selection" variant="ghost" size="sm" onClick={() => setSelectedNode(null)} />}
      </HStack>

      <HStack gap={4} vAlign="start" wrap="wrap">
        <VStack gap={2}>
          <Card padding={2}>
            {/* Style bridge: the force-directed canvas itself stays hand-rolled SVG. */}
            <div style={{ overflowX: 'auto' }}>
              <svg width={W} height={H} style={{ display: 'block' }} role="img" aria-label="Force-directed knowledge graph">
                <defs>
                  {(Object.entries(EDGE_COLORS) as [GEdge['type'], string][]).map(([type, color]) => (
                    <marker key={type} id={`arrow-${type}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L6,3 z" fill={color} opacity={0.7} />
                    </marker>
                  ))}
                </defs>

                {/* Edges */}
                {EDGES.map((e, i) => {
                  const a = positions[e.source]; const b = positions[e.target];
                  if (!a || !b) return null;
                  const opacity = getEdgeOpacity(e);
                  const color = EDGE_COLORS[e.type];
                  const mx = (a.x + b.x) / 2 + (b.y - a.y) * 0.08;
                  const my = (a.y + b.y) / 2 - (b.x - a.x) * 0.08;
                  return (
                    <g key={i} opacity={opacity}>
                      <path
                        d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
                        fill="none" stroke={color} strokeWidth={1.5}
                        markerEnd={`url(#arrow-${e.type})`}
                        strokeDasharray={e.type === 'contradicts' ? '4,3' : 'none'}
                      />
                      {opacity > 0.5 && (
                        <text x={mx} y={my - 4} fontSize={10} fill={colors.structural.label} textAnchor="middle" style={{ pointerEvents: 'none' }}>
                          {e.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {NODES.map(n => {
                  const pos = positions[n.id];
                  if (!pos) return null;
                  const opacity = getNodeOpacity(n.id);
                  const color = NODE_TYPE_COLORS[n.type];
                  const r = nodeRadius(n);
                  const isSelected = selectedNode?.id === n.id;
                  return (
                    <g key={n.id} transform={`translate(${pos.x},${pos.y})`} opacity={opacity}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleNodeClick(n)}
                      onMouseEnter={() => setHoveredNode(n.id)}
                      onMouseLeave={() => setHoveredNode(null)}>
                      <circle r={r + (isSelected ? 4 : 0)} fill={color}
                        stroke={isSelected ? '#ffffff' : colors.alpha(color, 0.35)} strokeWidth={isSelected ? 2.5 : 1}
                        opacity={0.9} />
                      <text fontSize={10} fill="#ffffff" textAnchor="middle" dy={3} fontWeight={700}
                        style={{ pointerEvents: 'none' }}>
                        {NODE_LETTER[n.type]}
                      </text>
                      {(isSelected || hoveredNode === n.id) && (
                        <text fontSize={11} fill={colors.structural.label} textAnchor="middle" dy={r + 14} fontWeight={600}
                          style={{ pointerEvents: 'none' }}>
                          {n.label.length > 24 ? n.label.slice(0, 24) + '…' : n.label}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </Card>

          <ChartLegend
            items={[
              ...(Object.keys(NODE_LETTER) as GNode['type'][])
                .filter((t) => t !== 'persona')
                .map((type): LegendItem => ({ label: type, color: NODE_TYPE_COLORS[type], type: 'bar' })),
              ...(Object.entries(EDGE_COLORS) as [GEdge['type'], string][]).map(
                ([type, color]): LegendItem => ({ label: type.replace('-', ' '), color, type: 'line' })
              ),
            ]}
          />
        </VStack>

        <VStack gap={3} maxWidth={300}>
          {selectedNode ? (
            <Card padding={4}>
              <VStack gap={3}>
                <VStack gap={1}>
                  <HStack gap={2} vAlign="center" hAlign="between">
                    <Badge label={selectedNode.type} />
                    <Text type="supporting">{selectedNode.confidence} confidence</Text>
                  </HStack>
                  <Text type="body" weight="semibold" textWrap="balance">
                    {selectedNode.label}
                  </Text>
                  {selectedNode.speaker && (
                    <Text type="supporting">
                      {selectedNode.speaker}
                      {selectedNode.date ? ` · ${selectedNode.date}` : ''}
                    </Text>
                  )}
                </VStack>
                <Text type="supporting" as="p" textWrap="pretty">
                  {selectedNode.detail}
                </Text>
                {(() => {
                  const sq = sessionQuery(selectedNode);
                  return sq ? <QueryLink href={sq.href} count={sq.count} label="insights from this session" /> : null;
                })()}
                {selectedProduct && (
                  <QueryLink
                    href={hrefProduct(selectedProduct.id)}
                    count={productFacts(selectedProduct.id).n}
                    label={`insights · ${selectedProduct.name} hub`}
                  />
                )}
                <VStack gap={2}>
                  <Text type="label" color="secondary">
                    Connected
                  </Text>
                  {EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map((e, i) => {
                    const isOut = e.source === selectedNode.id;
                    const otherId = isOut ? e.target : e.source;
                    const other = NODES.find(n => n.id === otherId);
                    if (!other) return null;
                    return (
                      <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        label={`${isOut ? '→' : '←'} ${e.label} · ${other.label}`}
                        onClick={() => setSelectedNode(other)}
                      />
                    );
                  })}
                </VStack>
              </VStack>
            </Card>
          ) : (
            <Card padding={4}>
              <VStack gap={2}>
                <Text type="body" weight="semibold">
                  How to read this graph
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  S = Granola session (raw transcript) · D = project document · I = insight (synthesized finding) · F = feature (design output) · P = pattern (WCAG / anti-pattern).
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  Click any node to see its connections and trace the evidence chain from raw session to built feature. Edge direction is information flow; nodes that map to a routable entity open it directly.
                </Text>
                <HStack gap={1.5} wrap="wrap">
                  {(['session', 'doc', 'insight', 'feature', 'pattern'] as GNode['type'][]).map((type) => (
                    <Token key={type} label={`${NODES.filter((n) => n.type === type).length} ${type}s`} onClick={() => setFilterType(type as FilterType)} />
                  ))}
                </HStack>
              </VStack>
            </Card>
          )}
        </VStack>
      </HStack>
    </VStack>
  );
}
