import { useState, useEffect, useRef } from 'react';

// ─── Knowledge Graph View ───────────────────────────────────────────────────
// Visualizes connections between Granola sessions, project docs, insights,
// and features using an interactive force-directed simulation.
// Every edge has a type: source-of | confirms | contradicts | extends | blocks
// Nodes are colored by product accent, sized by evidence density.


const EDGE_COLORS: Record<string, string> = {
  'source-of': '#6d5ed4',
  confirms: '#0d9488',
  contradicts: '#e8604a',
  extends: '#d97706',
  blocks: '#dc2626',
};

// ─── Static graph data built from SKILL.md Section 1 ─────────────────────
// Every node = real information source. Every edge = real documented connection.
interface GNode {
  id: string; label: string; type: 'session' | 'doc' | 'insight' | 'feature' | 'persona' | 'pattern';
  product: string; confidence: 'high' | 'medium' | 'low';
  detail: string; speaker?: string; date?: string;
  x?: number; y?: number; vx?: number; vy?: number;
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

const NODE_TYPE_COLORS: Record<string, string> = {
  session: '#6d5ed4', doc: '#0d9488', insight: '#e8604a', feature: '#16a34a', pattern: '#d97706', persona: '#db2777',
};

export function KnowledgeGraphView() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<GNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterProduct, setFilterProduct] = useState<ProductFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
  const animRef = useRef<number>();
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

  const TYPE_FILTERS: { id: FilterType; label: string; color: string }[] = [
    { id: 'all', label: 'All', color: '#6d5ed4' },
    { id: 'session', label: 'Sessions', color: NODE_TYPE_COLORS.session },
    { id: 'doc', label: 'Docs', color: NODE_TYPE_COLORS.doc },
    { id: 'insight', label: 'Insights', color: NODE_TYPE_COLORS.insight },
    { id: 'feature', label: 'Features', color: NODE_TYPE_COLORS.feature },
    { id: 'pattern', label: 'Patterns', color: NODE_TYPE_COLORS.pattern },
  ];

  const PROD_FILTERS: { id: ProductFilter; label: string }[] = [
    { id: 'all', label: 'All products' },
    { id: 'exam-management', label: 'Exam Mgmt' },
    { id: 'faas', label: 'FaaS' },
    { id: 'course-eval', label: 'Course Eval' },
    { id: 'skills-checklist', label: 'Skills' },
    { id: 'platform', label: 'Platform' },
  ];

  const nodeRadius = (n: GNode) => n.type === 'session' ? 11 : n.type === 'feature' ? 10 : 8;

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif', background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: 0, fontFamily: 'DM Serif Display, Georgia, serif' }}>
            Knowledge Graph
          </h1>
          <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)' }}>
            {NODES.length} nodes · {EDGES.length} edges
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0, maxWidth: 600 }}>
          Every Granola session, project doc, insight, and feature — connected by evidence.
          Click any node to trace its information lineage.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          placeholder="Search nodes, speakers…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ fontSize: 12, padding: '5px 10px', borderRadius: 7, border: '1px solid var(--border)', background: '#fff', color: 'var(--text)', outline: 'none', width: 200 }}
        />
        <div style={{ display: 'flex', gap: 4 }}>
          {TYPE_FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilterType(f.id)}
              style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: `1px solid ${filterType === f.id ? f.color : 'var(--border)'}`, background: filterType === f.id ? `${f.color}15` : '#fff', color: filterType === f.id ? f.color : 'var(--text3)', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {PROD_FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilterProduct(f.id)}
              style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, border: `1px solid ${filterProduct === f.id ? '#6d5ed4' : 'var(--border)'}`, background: filterProduct === f.id ? '#6d5ed415' : '#fff', color: filterProduct === f.id ? '#6d5ed4' : 'var(--text3)', cursor: 'pointer' }}>
              {f.label}
            </button>
          ))}
        </div>
        {selectedNode && (
          <button onClick={() => setSelectedNode(null)}
            style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: '1px solid var(--border)', background: '#fff', color: 'var(--text3)', cursor: 'pointer' }}>
            ✕ Clear selection
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Graph canvas */}
        <div style={{ flex: 1 }}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: '#fafafa', overflow: 'hidden', position: 'relative' }}>
            <svg ref={svgRef} width={W} height={H} style={{ display: 'block' }}>
              <defs>
                {Object.entries(EDGE_COLORS).map(([type, color]) => (
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
                const color = EDGE_COLORS[e.type] || '#94a3b8';
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
                      <text x={mx} y={my - 4} fontSize={9} fill={color} textAnchor="middle" fontFamily="JetBrains Mono, monospace"
                        style={{ pointerEvents: 'none' }}>
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
                const color = NODE_TYPE_COLORS[n.type] || '#94a3b8';
                const r = nodeRadius(n);
                const isSelected = selectedNode?.id === n.id;
                return (
                  <g key={n.id} transform={`translate(${pos.x},${pos.y})`} opacity={opacity}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedNode(prev => prev?.id === n.id ? null : n)}
                    onMouseEnter={() => setHoveredNode(n.id)}
                    onMouseLeave={() => setHoveredNode(null)}>
                    <circle r={r + (isSelected ? 4 : 0)} fill={color}
                      stroke={isSelected ? '#fff' : `${color}40`} strokeWidth={isSelected ? 2.5 : 1}
                      opacity={0.85} />
                    <text fontSize={10} fill="#fff" textAnchor="middle" dy={3}
                      fontFamily="JetBrains Mono, monospace" fontWeight={700}
                      style={{ pointerEvents: 'none' }}>
                      {n.type === 'session' ? 'S' : n.type === 'doc' ? 'D' : n.type === 'insight' ? 'I' : n.type === 'feature' ? 'F' : 'P'}
                    </text>
                    {(isSelected || hoveredNode === n.id) && (
                      <text fontSize={10} fill="var(--text)" textAnchor="middle" dy={r + 13}
                        fontFamily="Inter, sans-serif" fontWeight={600}
                        style={{ pointerEvents: 'none' }}>
                        {n.label.length > 20 ? n.label.slice(0, 20) + '…' : n.label}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
            {Object.entries(NODE_TYPE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
                <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
            <div style={{ width: 1, background: 'var(--border)' }} />
            {Object.entries(EDGE_COLORS).map(([type, color]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 18, height: 2, background: color, borderRadius: 1 }} />
                <span style={{ fontSize: 11, color: 'var(--text3)' }}>{type.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div style={{ width: 280, flexShrink: 0 }}>
          {selectedNode ? (
            <div style={{ border: `2px solid ${NODE_TYPE_COLORS[selectedNode.type]}30`, borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', background: `${NODE_TYPE_COLORS[selectedNode.type]}08` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: NODE_TYPE_COLORS[selectedNode.type] }} />
                  <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: NODE_TYPE_COLORS[selectedNode.type], fontWeight: 700, textTransform: 'uppercase' }}>
                    {selectedNode.type}
                  </span>
                  <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)', marginLeft: 'auto' }}>
                    {selectedNode.confidence}
                  </span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{selectedNode.label}</div>
                {selectedNode.speaker && (
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 3 }}>{selectedNode.speaker}{selectedNode.date && ` · ${selectedNode.date}`}</div>
                )}
              </div>
              <div style={{ padding: '12px 14px' }}>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, margin: 0 }}>{selectedNode.detail}</p>
              </div>
              {/* Connected nodes */}
              <div style={{ padding: '0 14px 14px' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Connected
                </div>
                {EDGES.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).map((e, i) => {
                  const isOut = e.source === selectedNode.id;
                  const otherId = isOut ? e.target : e.source;
                  const other = NODES.find(n => n.id === otherId);
                  if (!other) return null;
                  const color = EDGE_COLORS[e.type];
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: 6, cursor: 'pointer' }}
                      onClick={() => setSelectedNode(other)}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: NODE_TYPE_COLORS[other.type], flexShrink: 0, marginTop: 4 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 500 }}>{other.label}</div>
                        <div style={{ fontSize: 10, color, fontFamily: 'JetBrains Mono, monospace' }}>
                          {isOut ? '→' : '←'} {e.label}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 16, background: '#fff' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>How to read this graph</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
                <div style={{ marginBottom: 6 }}><strong>S</strong> = Granola session (raw transcript)</div>
                <div style={{ marginBottom: 6 }}><strong>D</strong> = Project document / attachment</div>
                <div style={{ marginBottom: 6 }}><strong>I</strong> = Insight (synthesized finding)</div>
                <div style={{ marginBottom: 6 }}><strong>F</strong> = Feature (design output)</div>
                <div style={{ marginBottom: 12 }}><strong>P</strong> = Pattern (WCAG / anti-pattern)</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  Click any node to see its connections and trace the evidence chain from raw session to built feature.
                  Edge direction = information flow.
                </div>
              </div>
              {/* Quick stats */}
              <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {Object.entries(NODE_TYPE_COLORS).map(([type, color]) => {
                  const count = NODES.filter(n => n.type === type).length;
                  return (
                    <div key={type} style={{ padding: '8px 10px', borderRadius: 8, background: `${color}08`, border: `1px solid ${color}20` }}>
                      <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color }}>{count}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', textTransform: 'capitalize' }}>{type}s</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
