// @ts-nocheck
// ProductViewShell.tsx — Standard product deep-dive for FaaS, Course Eval, Skills, LC
// Same 7-tab architecture as ExamManagementView.
// Tabs: Insights | Service Blueprint | Feature Map | Analytics | Accessibility | Competitive | Design Decisions
import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { getProduct } from '../../data/products';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip, ProgressBar } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';

type TabId = 'insights' | 'blueprint' | 'features' | 'analytics' | 'accessibility' | 'competitive' | 'decisions';

const TABS: { id: TabId; label: string }[] = [
  { id: 'insights',    label: 'Insights' },
  { id: 'blueprint',   label: 'Service Blueprint' },
  { id: 'features',    label: 'Feature Map' },
  { id: 'analytics',   label: 'Analytics' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'competitive', label: 'Competitive' },
  { id: 'decisions',   label: 'Design Decisions' },
];

const CS = { fontSize: 12, fill: '#8a8580' };

function BPRow({ lane, cells, isGap }: { lane: string; cells: string[]; isGap?: boolean }) {
  return (
    <div style={{ display: 'flex', fontSize: 12, borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 100, minWidth: 100, padding: '10px 8px', background: 'var(--bg3)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, color: 'var(--text3)', borderRight: '1px solid var(--border)', flexShrink: 0 }}>{lane}</div>
      {cells.map((c, i) => (
        <div key={i} style={{ flex: 1, padding: '10px 10px', borderRight: '1px solid var(--border)', lineHeight: 1.5, color: isGap ? 'var(--coral)' : 'var(--text2)' }}>{c}</div>
      ))}
    </div>
  );
}

function FeatureBox({ title, desc, color }: { title: string; desc: string; color: string }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 'var(--radius)', border: `1px solid ${color}25`, background: `${color}06`, marginBottom: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55 }}>{desc}</div>
    </div>
  );
}

function DecisionCard({ title, decision, rationale, tradeoff, source }: { title: string; decision: string; rationale: string; tradeoff: string; source: string }) {
  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>{title}</h4>
      {[{ label: 'Decision', text: decision, color: 'var(--accent)' }, { label: 'Rationale', text: rationale, color: 'var(--teal)' }, { label: 'Tradeoff', text: tradeoff, color: 'var(--coral)' }].map(item => (
        <div key={item.label} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: item.color, flexShrink: 0, marginTop: 2, width: 60 }}>{item.label}</span>
          <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55 }}>{item.text}</span>
        </div>
      ))}
      <div style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>{source}</div>
    </div>
  );
}

// ── Product-specific data ──────────────────────────────────────────────────────

const PRODUCT_DATA: Record<string, {
  aiStrip: string;
  bpCols: string[];
  bpRows: { lane: string; cells: string[]; isGap?: boolean }[];
  featureClusters: { title: string; features: { title: string; desc: string }[] }[];
  charts: { type: string; title: string; sub: string }[];
  a11yFeatures: { feature: string; status: string; priority: string }[];
  competitors: { name: string; gap: string; win: string }[];
  decisions: { title: string; decision: string; rationale: string; tradeoff: string; source: string }[];
}> = {
  faas: {
    aiStrip: '10 Granola sessions synced. 95,000+ annual support tickets. NPS 2/5. Three-system fragmentation (ExactOne/CAS/FAST) is the architectural root cause. Tag validation, form simulator, and approval reviewer redesign are the top 3 priorities.',
    bpCols: ['Configure', 'Tag', 'Preview', 'Publish', 'Student submits', 'Coordinator reviews', 'Approve/Reject'],
    bpRows: [
      { lane: 'User actions', cells: ['DCE creates form from template', 'Assigns compliance tags', 'Previews in simulator', 'Publishes to cohort', 'Student fills form', 'Coordinator opens approval', 'Approves or returns'] },
      { lane: 'Frontstage', cells: ['Template library + blank builder', 'Tag dropdown (validated)', 'Form simulator canvas', 'Publish confirmation modal', 'Form renderer (student)', 'Split-pane: submission + guidelines', 'Approval stamp + comment'] },
      { lane: 'Backstage', cells: ['CAS + FAST sync on create', 'Tag validated against schema', 'Preview uses live renderer', 'Status → published, cohort notified', 'Submission stored in FAST', 'ExactOne + CAS + FAST query', 'Workflow engine triggers next step'] },
      { lane: 'Policies', cells: ['HIPAA: no PII in tag names', 'ARC-PA standards require specific fields', 'Accreditor format required', 'FERPA: student data scoped', 'FERPA: submission encrypted', 'HIPAA: reviewer scoped by role', 'Audit log required for accreditation'] },
      { lane: 'Pain points', isGap: true, cells: ['Interface not self-service', 'Free-text tag entry = typos = 95k tickets', 'No preview mode exists today', 'No cohort preview before publish', 'Multi-select shows as plain text', 'Text tiny, guidelines buried', 'No field-level comments'] },
    ],
    featureClusters: [
      { title: 'Form builder', features: [
        { title: 'Template-first creation', desc: '80–85% of forms are incremental changes. Template library is the primary entry — not blank canvas. Auto-sorted by module context.' },
        { title: 'Validated tag dropdown', desc: 'Free-text tag entry is the root cause of 95,000+ annual tickets. Dropdown with schema validation eliminates this entirely.' },
        { title: 'Form simulator / preview', desc: 'Forms currently untestable until live. Preview mode shows exact student experience before publish. Critical gap, no competitor offers it in this context.' },
      ]},
      { title: 'Compliance engine', features: [
        { title: 'Real-time field validation', desc: 'Errors currently shown only at submit. Real-time feedback per field eliminates the "broken form discovered in October" scenario.' },
        { title: 'Chip-based multi-select', desc: 'ICD/CPT code selections display as long text strings. Must render as removable chips with clear delete affordance.' },
        { title: 'Section color-coding', desc: 'Lost in current version. Students cannot identify which section they are in without color/indentation. Visual regression from prior version.' },
      ]},
      { title: 'Approval reviewer', features: [
        { title: 'Split-pane: submission + guidelines', desc: 'Current: guidelines are buried. Required UX: submission on left, relevant guideline on right, always visible. SCCE primary daily surface.' },
        { title: 'Field-level comments', desc: 'Currently only form-level comments exist. Coordinators need to annotate specific ICD codes, specific fields. Granular feedback loop.' },
        { title: 'AI approval recommendation ✦', desc: '95% automated compliance recommendations target. Multi-model approach (OpenAI/Gemini/Anthropic). Human oversight layer required — coordinators must trust AI before delegating.' },
      ]},
    ],
    charts: [],
    a11yFeatures: [
      { feature: 'Form on mobile (SCCE clinical site)', status: 'Not optimised', priority: 'HIGH' },
      { feature: 'Text size in approval reviewer', status: 'Too small — confirmed user complaint', priority: 'CRITICAL' },
      { feature: 'Color not sole indicator (section tabs)', status: 'Color only — needs icon/label', priority: 'HIGH' },
      { feature: 'ICD/CPT chip delete affordance', status: 'Unclear delete target', priority: 'HIGH' },
      { feature: 'Error messages (form submit)', status: 'Appear only on submit, not inline', priority: 'CRITICAL' },
    ],
    competitors: [
      { name: 'SurveyMonkey / Typeform', gap: 'Self-service creation, zero-friction entry — the mental model faculty bring', win: 'Accreditation mapping, clinical domain vocabulary, compliance enforcement' },
      { name: 'Google Forms', gap: 'Zero-friction baseline — what clients compare against before calling support', win: 'Workflow engine, approval chain, ARC-PA/CAPTE compliance fields' },
      { name: 'Qualtrics', gap: 'Survey analysis, theme extraction, historical comparison — Touro uses this instead', win: 'Embedded in clinical education lifecycle — Qualtrics knows nothing about placements or PANCE' },
      { name: 'Neovas (FaaS competitor)', gap: 'Hover previews, drag-and-drop, built-in guide system, quiz mode, AI import', win: 'Clinical-specific field types (ICD/CPT codes, patient log types, competency mapping)' },
      { name: 'CORE Elsevier', gap: 'Domain language navigation — "preceptor evaluations" not "FaaS forms"', win: 'Deeper Exxat integration — CORE is standalone, Exxat owns the full placement lifecycle' },
    ],
    decisions: [
      { title: 'Headless unified frontend over 3 backends', decision: 'Single React frontend over ExactOne + CAS + FAST. Users never see the 3-system architecture.', rationale: 'Three-system fragmentation is the root cause of every UX complaint. Harsha: "They look like three products from three companies." One UI is the only solution.', tradeoff: 'Higher frontend complexity. Three API contracts to maintain. Risk: backend changes in any system cascade to unified UI. Mitigation: API gateway with typed contracts.', source: 'Harsha FaaS compliance interview · Mar 20' },
      { title: 'Template-first over blank canvas', decision: 'Form library is the default entry point. Blank canvas and AI import are secondary.', rationale: '80–85% of forms are incremental changes. Showing blank canvas first means 80% of users start wrong. Context-aware template library cuts their time by 10× on first step.', tradeoff: 'Template library must be maintained, versioned, and context-aware per module. Stale templates are worse than blank canvas. Requires ongoing curation.', source: 'Akshit Q2 Requirements · Mar 25' },
      { title: 'Validated dropdown for tag entry', decision: 'All compliance tags must be selected from a validated schema dropdown. Free text is removed entirely.', rationale: 'Free-text tag entry causes thousands of typo-based errors annually. One spelling mistake breaks form logic for 200 students. This is the single highest-frequency error in the system.', tradeoff: 'Tag schema must be maintained. New accreditation fields require schema updates. Risk: schema becomes a bottleneck. Mitigation: self-service schema editing for internal admin team.', source: 'Harsha FaaS compliance interview · Mar 20' },
      { title: 'Phase 1: internal users only (Q2)', decision: 'Self-service tool launches for CI team, CIC exec, and page server team. End users not exposed.', rationale: 'Workflow configuration is too complex for Phase 1 end-user exposure. Internal team can accept design trade-offs. Phase 2 (Q3) exposes limited workflows to end users without proactive communication.', tradeoff: 'Internal-only launch limits adoption signals. Risk: internal usage patterns may not reflect end-user needs. Mitigation: shadow end-user sessions before Phase 2 launch.', source: 'Akshit Q2 Requirements · Mar 25' },
    ],
  },
  'course-eval': {
    aiStrip: '5 Granola sessions synced. Touro runs 7 survey types outside Exxat today. Ed Razenbach already uses ChatGPT to extract themes from open-ended responses. PCE is now a paid feature (Mar 24). AI theme extraction is the highest-ROI feature for this product.',
    bpCols: ['Survey design', 'Configure timing', 'Distribute', 'Student responds', 'Faculty views', 'Admin compiles', 'Report generated'],
    bpRows: [
      { lane: 'User actions', cells: ['DCE selects survey type + questions', 'Sets open/close dates', 'System auto-distributes', 'Student completes survey', 'Faculty views results', 'Admin downloads data', 'Accreditation report exported'] },
      { lane: 'Frontstage', cells: ['Survey builder (FaaS-based)', 'Date picker with enforcement logic', 'Email notification to students', 'Survey form on student portal', 'Faculty dashboard', 'Admin aggregate view', 'PDF report with AI narrative'] },
      { lane: 'Pain points', isGap: true, cells: ['7 survey types done outside Exxat (Touro)', 'No timing enforcement today', 'Manual distribution via Blue/Canvas', 'Low completion rates tracked manually', 'No anonymous enforcement at data layer', 'Manual compilation in Word', 'No accreditation-mapped report'] },
    ],
    featureClusters: [
      { title: 'Survey types (7 to cover)', features: [
        { title: 'Faculty peer review', desc: 'Anonymous review of faculty by faculty. Most sensitive — anonymity enforcement critical at data layer, not just UI.' },
        { title: 'Didactic + clinical evaluation', desc: 'Post-course evaluation available after completion, closed before final grades published. Timing logic must be configurable and auto-enforced.' },
        { title: 'Exit + graduation survey', desc: 'Longitudinal data tied to PANCE outcomes and employment. These are the surveys accreditors want most.' },
      ]},
      { title: 'AI features', features: [
        { title: 'Theme extraction from open-ends ✦', desc: 'Ed Razenbach: "I paste all open-ended responses into ChatGPT. Saves hours every cycle." Bringing this inside Exxat is the highest-ROI AI feature for Course Eval.' },
        { title: 'AI narrative for self-study ✦', desc: 'ARC-PA self-study requires narrative analysis of survey themes. Currently manual and takes days. AI synthesis reduces to minutes.' },
        { title: 'Benchmarking + trend detection ✦', desc: 'Year-over-year comparison per faculty and course. Flag statistically significant changes. Proactive, not reactive.' },
      ]},
      { title: 'PCE integration', features: [
        { title: 'Paid feature tile (Phase 1)', desc: 'Non-subscribers do not see the PCE tile. Subscribers access through survey interface. Phase 1 requires Prism course offerings for proper distribution.' },
        { title: 'Phase 2: CSV upload', desc: 'Schools not using Prism course management can upload student roster via CSV. Unlocks PCE for non-Prism schools.' },
      ]},
    ],
    charts: [],
    a11yFeatures: [
      { feature: 'Anonymous survey — UI signal', status: 'Clear signal without exposing identity', priority: 'CRITICAL' },
      { feature: 'Mobile for student survey completion', status: 'Must work on phone', priority: 'HIGH' },
      { feature: 'Response rate visible to admin', status: 'Not designed yet', priority: 'HIGH' },
    ],
    competitors: [
      { name: 'SmartEval', gap: 'Feature-complete standalone eval platform, established in PA programs', win: 'Integration with Exxat placement + exam data. SmartEval is isolated.' },
      { name: 'Qualtrics', gap: 'Advanced survey analysis, theme extraction, benchmark comparisons', win: 'Zero accreditation context. Qualtrics does not know ARC-PA from CAPTE.' },
      { name: 'Blue (CourseEval)', gap: 'Dedicated course eval, historical trending, faculty profiles', win: 'Exxat connects course eval results to clinical outcomes. Blue cannot.' },
    ],
    decisions: [
      { title: 'FaaS-embedded vs standalone module', decision: 'Course Eval is built on FaaS form rendering and distribution components. Not a separate system.', rationale: 'FaaS already handles form building, logic, validation, reporting. Building a separate system duplicates all of this. Anand team does core FaaS redesign. New team builds Course Eval using those components.', tradeoff: 'FaaS limitations constrain Course Eval. If FaaS cannot support hybrid forms (course + multi-instructor on same form), Course Eval must wait. Mitigation: validate hybrid form data model with Anand before April workshop.', source: 'Romit<>Arun<>VB FaaS design strategy · Mar 3' },
      { title: 'PCE as paid feature (Phase 1)', decision: 'Post-Course Evaluation is a separate paid feature. Subscribers see the tile. Non-subscribers do not.', rationale: 'Monetisation strategy confirmed Mar 24 (PCE Context session). Current surveys included in Prism at no extra charge. PCE creates a new revenue line tied to the evaluation lifecycle.', tradeoff: 'Paid gating may reduce initial adoption. Risk: programs trial competitors first. Mitigation: strong demo at April workshop, reference case from Touro.', source: 'Mohil<>Vishaka<>David PCE Context · Mar 24' },
    ],
  },
  'skills-checklist': {
    aiStrip: '6 Granola sessions synced. 80–90% of students build external tracking spreadsheets because the platform cannot aggregate across placements. "Just show me the reds" is the killer feature for program directors. Cohere August is the hard prototype deadline.',
    bpCols: ['Skill setup', 'Student performs', 'Request sign-off', 'Preceptor approves', 'Program tracks', 'Accreditation report'],
    bpRows: [
      { lane: 'User actions', cells: ['DCE uploads skill hierarchy (or PDF)', 'Student performs procedure at clinical site', 'Student requests preceptor sign-off in app', 'Preceptor approves on mobile', 'PD views deficiency dashboard', 'ARC-PA report auto-generated'] },
      { lane: 'Frontstage', cells: ['PDF upload → AI hierarchy generation', 'Student mobile skill tracker', 'Sign-off request notification', 'Preceptor mobile approval screen', 'Red filter dashboard (deficiency view)', 'Accreditation export with procedure counts'] },
      { lane: 'Pain points', isGap: true, cells: ['"Have I done this skill across all rotations?" — unanswerable', '80–90% use external spreadsheets', 'No sign-off workflow in current system', 'Preceptor not in system or never logged in', 'No default deficiency filter', 'Manual CSV export + highlighting'] },
    ],
    featureClusters: [
      { title: 'Student skill tracking', features: [
        { title: 'Program-level skill entity', desc: 'Skills must cross all placements. Not placement-scoped. "Have I done this skill across all rotations?" must be answerable. This is the architectural foundation.' },
        { title: 'Mobile sign-off workflow', desc: 'Student performs procedure → taps skill → sign-off request sent → preceptor approves on phone in 2 minutes. Designed for clinical site context.' },
        { title: 'Cross-rotation aggregate view', desc: 'Show total procedure count across all placements, all rotations, all sites. The one number every student needs and currently cannot get.' },
      ]},
      { title: 'Program director dashboard', features: [
        { title: '"Show me the reds" filter ✦', desc: '"I do not need to see 200 students. I need to see the 8 who are behind on procedures." Default view is deficient students, not all students.' },
        { title: 'Procedure minimum counter', desc: 'ARC-PA requires 3× per procedure type minimum. Counter shows actual vs required. Red when below minimum.' },
        { title: 'Graduation readiness predictor ✦', desc: 'AI flags students at risk of missing graduation minimums before it is too late. Earlier intervention, better outcomes.' },
      ]},
      { title: 'Discipline configurability', features: [
        { title: 'PA: clinical passport + sign-off', desc: 'Preceptor sign-off per procedure. Binary: done or not done.' },
        { title: 'Nursing: batch evaluation grid', desc: 'Rows = students, columns = skills. Evaluate multiple students on the same skill at once.' },
        { title: 'CVT: 0/5/7.5/9/10 custom scale', desc: '20–30 criteria per competency. Custom scoring scale. One rigid model fails across 70+ disciplines — configurability is mandatory.' },
      ]},
    ],
    charts: [],
    a11yFeatures: [
      { feature: 'Mobile-first for clinical site sign-off', status: 'Designed for mobile from day 1', priority: 'CRITICAL' },
      { feature: 'Red deficiency indicator', status: 'Cannot rely on color alone — needs icon + label', priority: 'HIGH' },
      { feature: 'Skill completion checkmark feedback', status: 'Haptic feedback on mobile sign-off receipt', priority: 'NEW' },
    ],
    competitors: [
      { name: 'Typhon Group', gap: 'Established clinical hour tracking in PA programs. Known quantity.', win: 'Exxat integration: skills + placements + PANCE predictor in one platform. Typhon is isolated.' },
      { name: 'CompetencyAI', gap: 'Directly targeting this gap. Timeline risk if they launch during Q3–Q4.', win: 'Accelerate Cohere prototype. A working demo at August locks early adopters.' },
      { name: 'Excel / Google Sheets', gap: '80–90% of students use this today. Zero switching cost.', win: 'Sign-off workflow, cross-rotation aggregation, graduation risk prediction — Excel cannot do any of this.' },
    ],
    decisions: [
      { title: 'Program-level entity (not placement-scoped)', decision: 'Skills belong to the student-program relationship, not the placement record. Architectural non-negotiable.', rationale: '"Have I done this skill across all rotations?" is currently unanswerable. This is the most common student question. The system must be redesigned from placement-scoped to program-scoped to answer it.', tradeoff: 'More complex data model. Cross-placement aggregation queries at scale (1000+ students) are a performance risk. Mitigation: indexed query design, pagination, async dashboard loading.', source: 'Day 4 Marriott — Skills and LC · Mar 5' },
      { title: 'Cohere August hard target for prototype', decision: 'Working demo at August Cohere conference — not feature-complete, but demonstrable.', rationale: 'Typhon and CompetencyAI are targeting the same gap. First credible demo locks early adopters before competitors capitalise. Cohere is the largest clinical education conference — perfect launch.', tradeoff: 'Prototype risk: showing unfinished product. Mitigation: scope demo to student mobile sign-off + program director deficiency view only. Two flows, polished, not ten flows half-done.', source: 'Day 4 Marriott — Skills and LC · Mar 5' },
    ],
  },
  'learning-contracts': {
    aiStrip: '3 Granola sessions synced. Social work placements span 6–12 months with one contract. Preceptor change mid-placement breaks the contract. The architectural fix: decouple LC from placement records. Social work first, then all disciplines.',
    bpCols: ['Contract created', 'Objectives set', 'Midterm review', 'Preceptor change', 'Final evaluation', 'Accreditation'],
    bpRows: [
      { lane: 'User actions', cells: ['Student initiates LC at program start', 'Student sets CSWE-mapped objectives', 'Preceptor reviews at midterm', 'New preceptor assigned mid-placement', 'Final evaluation against objectives', 'CSWE report generated'] },
      { lane: 'Pain points', isGap: true, cells: ['LC tied to placement record — breaks at preceptor change', 'Objectives vague — not mapped to CSWE competencies', 'LC and evaluation in separate PDFs', 'Restart from scratch after preceptor change', 'Evaluation disconnected from LC goals', 'Manual narrative for CSWE self-study'] },
    ],
    featureClusters: [
      { title: 'Contract architecture', features: [
        { title: 'Program-level LC entity', desc: 'Contract belongs to student-program relationship, not placement record. Survives preceptor changes, site changes, even semester breaks.' },
        { title: 'Preceptor handoff workflow', desc: 'New preceptor assigned → sees full LC history, prior midterm notes, student commitments. No restart. Continuity is preserved.' },
      ]},
      { title: 'Social work model (9 CSWE competencies)', features: [
        { title: 'CSWE competency framework', desc: 'Nine competency areas: knowledge, values, skills, cognitive, affective. Each has sub-objectives. Learning contract maps directly to these.' },
        { title: 'LC + evaluation side-by-side', desc: 'Midterm evaluation must show LC objectives alongside rating scales. Not two separate screens. One unified workflow.' },
        { title: 'AI objective benchmarking ✦', desc: 'Students write vague goals. AI maps them to CSWE or ARC-PA competencies automatically. Ensures accreditor-ready specificity.' },
      ]},
    ],
    charts: [],
    a11yFeatures: [
      { feature: 'Multi-role editing (student initiates, preceptor + faculty approve)', status: 'Role-based edit access — designed in from start', priority: 'HIGH' },
      { feature: 'Contract version history', status: 'Track all modifications with timestamps', priority: 'HIGH' },
    ],
    competitors: [
      { name: 'eValue', gap: 'Competency tracking with LC integration in some disciplines', win: 'Exxat owns the placement record — eValue does not know which site the student is at.' },
      { name: 'Typhon', gap: 'LC-like functionality for some PA programs', win: 'Cross-product integration: LC objectives connected to skills checklist minimums and exam results.' },
    ],
    decisions: [
      { title: 'Social work first — then all disciplines', decision: 'Build the most complex LC model (social work 9-competency) first. All simpler disciplines will work automatically.', rationale: 'Social work has the most demanding LC requirements: 6–12 month placements, 9 CSWE competency areas, preceptor changes mid-placement, LC-evaluation integration. Design for the hardest case.', tradeoff: 'Social work programs are a smaller slice of Exxat client base than PT or nursing. Risk of over-engineering for niche. Mitigation: modular competency framework that PT/nursing programs can configure differently.', source: 'Day 4 Marriott — Skills and LC · Mar 5' },
    ],
  },
};

// ── Charts per product ────────────────────────────────────────────────────────

const PRODUCT_CHARTS: Record<string, React.FC> = {
  faas: () => {
    const ticketData = [
      { month: 'Sep', tickets: 8200 }, { month: 'Oct', tickets: 9100 },
      { month: 'Nov', tickets: 7800 }, { month: 'Dec', tickets: 6200 },
      { month: 'Jan', tickets: 8800 }, { month: 'Feb', tickets: 9300 },
      { month: 'Mar', tickets: 7600 },
    ];
    const gapData = [
      { name: 'Tag typos', value: 38, fill: '#e8604a' },
      { name: 'Config errors', value: 27, fill: '#d97706' },
      { name: 'Preview issues', value: 18, fill: '#3b82f6' },
      { name: 'Reviewer UX', value: 11, fill: '#6d5ed4' },
      { name: 'Other', value: 6, fill: '#8a8580' },
    ];
    const selfServiceData = [
      { name: 'Template clone', pct: 83 }, { name: 'Edit existing', pct: 72 },
      { name: 'Add questions', pct: 65 }, { name: 'New from scratch', pct: 18 },
      { name: 'AI import', pct: 8 },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardTitle sub="Why: shows ticket burden before/after tag validation ships">Monthly support tickets — FaaS (2025–2026)</CardTitle>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <AreaChart data={ticketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={CS} />
                <YAxis tick={CS} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="tickets" stroke="#e8604a" fill="rgba(232,96,74,0.1)" strokeWidth={2} name="Support tickets" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle sub="Why: justifies validated dropdown as #1 priority fix">Support ticket root causes</CardTitle>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={gapData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={CS} />
                <YAxis dataKey="name" type="category" tick={CS} width={90} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" radius={3} name="% of tickets">
                  {gapData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle sub="Why: proves template-first is the right entry point (80%+ use)">Form creation method usage (% of sessions)</CardTitle>
          <div style={{ height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={selfServiceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" domain={[0, 100]} tick={CS} />
                <YAxis dataKey="name" type="category" tick={CS} width={110} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="pct" fill="rgba(109,94,212,0.6)" radius={3} name="% of sessions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle sub="Why: shows accreditation compliance gap vs. target">FaaS NPS trajectory (target: 3/5 in 6 months)</CardTitle>
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 64, fontFamily: 'DM Serif Display, serif', color: '#e8604a', lineHeight: 1 }}>2/5</div>
            <div style={{ fontSize: 13, color: 'var(--text3)' }}>Current NPS · 95,000+ annual tickets</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {[1,2,3,4,5].map(n => (
                <div key={n} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, background: n <= 2 ? '#e8604a' : n === 3 ? 'rgba(109,94,212,0.15)' : 'var(--bg3)', color: n <= 2 ? 'white' : n === 3 ? '#6d5ed4' : 'var(--text3)', border: n === 3 ? '2px dashed #6d5ed4' : 'none' }}>{n}</div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: '#6d5ed4', fontWeight: 600 }}>Target: 3/5 after tag validation + form simulator ship</div>
          </div>
        </Card>
      </div>
    );
  },
  'course-eval': () => {
    const surveyTypeData = [
      { name: 'Faculty peer review', inExxat: 0, atTouro: 1 },
      { name: 'Didactic eval', inExxat: 0, atTouro: 1 },
      { name: 'Orientation', inExxat: 0, atTouro: 1 },
      { name: 'End-of-didactic', inExxat: 0, atTouro: 1 },
      { name: 'Clinical eval', inExxat: 1, atTouro: 1 },
      { name: 'Exit survey', inExxat: 0, atTouro: 1 },
      { name: 'Grad survey', inExxat: 0, atTouro: 1 },
    ];
    const completionData = [
      { week: 'W1', rate: 22 }, { week: 'W2', rate: 45 }, { week: 'W3', rate: 61 },
      { week: 'W4', rate: 74 }, { week: 'W5', rate: 80 }, { week: 'W6', rate: 82 },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardTitle sub="Why: the 7 survey types are Touro's explicit product requirement list">Survey coverage — Touro today vs Exxat target</CardTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={surveyTypeData} layout="vertical" barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" domain={[0, 1]} tick={CS} tickFormatter={(v) => v === 0 ? 'Missing' : 'Exists'} />
                <YAxis dataKey="name" type="category" tick={CS} width={110} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="inExxat" fill="rgba(109,94,212,0.6)" radius={3} name="In Exxat today" />
                <Bar dataKey="atTouro" fill="rgba(13,148,136,0.4)" radius={3} name="Touro uses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle sub="Why: shows automated reminder impact on completion rates">Survey completion rate over 6 weeks (with reminders)</CardTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={completionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="week" tick={CS} />
                <YAxis domain={[0, 100]} tick={CS} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="rate" stroke="#6d5ed4" strokeWidth={2.5} dot={{ fill: '#6d5ed4', r: 4 }} name="Completion %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    );
  },
  'skills-checklist': () => {
    const deficiencyData = [
      { student: 'Student 1', done: 8, required: 12 },
      { student: 'Student 2', done: 12, required: 12 },
      { student: 'Student 3', done: 5, required: 12 },
      { student: 'Student 4', done: 11, required: 12 },
      { student: 'Student 5', done: 3, required: 12 },
      { student: 'Student 6', done: 12, required: 12 },
      { student: 'Student 7', done: 7, required: 12 },
      { student: 'Student 8', done: 12, required: 12 },
    ];
    const trackingData = [
      { name: 'External spreadsheet', pct: 83, fill: '#e8604a' },
      { name: 'Paper passport', pct: 12, fill: '#d97706' },
      { name: 'In-platform', pct: 5, fill: '#16a34a' },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <CardTitle sub="Why: the 'show me the reds' feature in data form — this is what PDs need">Procedure minimums — cohort deficiency view</CardTitle>
          <div style={{ height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={deficiencyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" domain={[0, 14]} tick={CS} />
                <YAxis dataKey="student" type="category" tick={CS} width={68} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="required" fill="rgba(232,96,74,0.15)" radius={3} name="Required" />
                <Bar dataKey="done" radius={3} name="Completed">
                  {deficiencyData.map((d, i) => <Cell key={i} fill={d.done < d.required ? '#e8604a' : '#16a34a'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardTitle sub="Why: 83% using spreadsheets is the success metric baseline">How students track skills today (before Exxat ships)</CardTitle>
          <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={trackingData} cx="50%" cy="50%" outerRadius={80} dataKey="pct" label={({ name, pct }) => `${name}: ${pct}%`} labelLine={false} fontSize={11}>
                  {trackingData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    );
  },
  'learning-contracts': () => {
    const lcStatusData = [
      { phase: 'Contract created', students: 142 }, { phase: 'Objectives set', students: 138 },
      { phase: 'Midterm reviewed', students: 121 }, { phase: 'Preceptor changed', students: 34 },
      { phase: 'Contract restarted', students: 28 }, { phase: 'Final evaluation', students: 89 },
    ];
    return (
      <Card>
        <CardTitle sub="Why: shows the dropout at 'preceptor changed' — the architectural gap">Learning contract funnel — where students fall out</CardTitle>
        <div style={{ height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={lcStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="phase" tick={{ ...CS, fontSize: 10 }} />
              <YAxis tick={CS} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="students" radius={3} name="Students">
                {lcStatusData.map((d, i) => <Cell key={i} fill={d.phase === 'Contract restarted' ? '#e8604a' : d.phase === 'Preceptor changed' ? '#d97706' : 'rgba(109,94,212,0.6)'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  },
};

// ── Main component ─────────────────────────────────────────────────────────────

interface Props { productId: string; }

export function ProductViewShell({ productId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('insights');
  const product = getProduct(productId);
  const insights = getInsightsByProduct(productId);
  const data = PRODUCT_DATA[productId];
  const ChartComponent = PRODUCT_CHARTS[productId];

  if (!product || !data) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Product hero */}
      <div style={{ margin: '20px 20px 0', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 26, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 6 }}>{product.name}</h1>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 540, marginBottom: 12 }}>{product.description}</p>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {product.primaryPersonas.map(p => <Badge key={p} variant="persona">{p}</Badge>)}
            <Badge variant="theme">{product.competitors.slice(0, 2).join(' · ')}</Badge>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 24, fontWeight: 700, color: product.urgencyLevel === 'fire' ? 'var(--coral)' : 'var(--text)', lineHeight: 1 }}>
            {product.criticalGaps}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>critical gaps</div>
          <div style={{ fontSize: 22, fontFamily: 'DM Serif Display, serif', color: 'var(--text)' }}>{insights.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>insights</div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ margin: '16px 20px 0', display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: '10px 16px', fontSize: 13.5, fontWeight: activeTab === t.id ? 600 : 400, color: activeTab === t.id ? 'var(--accent)' : 'var(--text2)', border: 'none', borderBottom: `2px solid ${activeTab === t.id ? 'var(--accent)' : 'transparent'}`, background: 'transparent', cursor: 'pointer', transition: 'all .15s', whiteSpace: 'nowrap', marginBottom: -1 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

        {/* INSIGHTS */}
        {activeTab === 'insights' && (
          <div>
            <div className="ai-strip">{data.aiStrip}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              <MetricCard label="Insights" value={insights.length} delta={`${insights.filter(i => i.tags.includes('new')).length} new this session`} deltaVariant="up" />
              <MetricCard label="Critical gaps" value={product.criticalGaps} deltaVariant="down" />
              <MetricCard label="AI opportunities" value={insights.filter(i => i.tags.includes('ai')).length} delta="Confirmed from sessions" deltaVariant="up" />
              <MetricCard label="Granola sessions" value={product.granolaSessions} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Card>
                <CardTitle sub={`${insights.length} sourced findings`}>Insight feed</CardTitle>
                {insights.map(i => <InsightRow key={i.id} insight={i} showSoWhat />)}
              </Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Card>
                  <CardTitle>Persona coverage</CardTitle>
                  {product.primaryPersonas.map((p, i) => {
                    const pcts = [72, 55, 38, 20];
                    const colors = ['#2ec4a0', '#6d5ed4', '#d97706', '#e8604a'];
                    return <ProgressBar key={p} label={p} value={pcts[i] || 30} color={colors[i] || '#6d5ed4'} />;
                  })}
                </Card>
                <Card>
                  <CardTitle>HMW statements</CardTitle>
                  {product.hmwStatements.map((h, i) => (
                    <div key={i} className="hmw-card" style={{ marginBottom: 8 }}>"{h}"</div>
                  ))}
                </Card>
                <Card>
                  <CardTitle>Roadmap phases</CardTitle>
                  {product.roadmapPhases.map((phase, i) => (
                    <div key={i} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>{phase.phase}</div>
                      {phase.items.map((item, j) => (
                        <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13, color: 'var(--text2)' }}>
                          <span style={{ color: 'var(--border2)', flexShrink: 0 }}>–</span>{item}
                        </div>
                      ))}
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* SERVICE BLUEPRINT */}
        {activeTab === 'blueprint' && (
          <div>
            <Card style={{ overflowX: 'auto' }}>
              <CardTitle sub="Admin creates → configures → publishes → user submits → reviewer approves → analytics">End-to-end service blueprint</CardTitle>
              <div style={{ minWidth: 800 }}>
                <BPRow lane="" cells={data.bpCols} />
                {data.bpRows.map((row, i) => (
                  <BPRow key={i} lane={row.lane} cells={row.cells} isGap={row.isGap} />
                ))}
              </div>
            </Card>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Card>
                <CardTitle>Day in the life — {product.primaryPersonas[0]}</CardTitle>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>
                  {product.dayInLife[product.primaryPersonas[0] as keyof typeof product.dayInLife] || 'Day in life data not yet synced for this persona.'}
                </p>
              </Card>
              <Card>
                <CardTitle>Happy path (target state)</CardTitle>
                <p style={{ fontSize: 14, color: 'var(--teal)', lineHeight: 1.7 }}>{product.happyPath}</p>
              </Card>
            </div>
          </div>
        )}

        {/* FEATURE MAP */}
        {activeTab === 'features' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {data.featureClusters.map(cluster => (
              <Card key={cluster.title}>
                <CardTitle>{cluster.title}</CardTitle>
                {cluster.features.map(f => (
                  <FeatureBox key={f.title} title={f.title} desc={f.desc} color={
                    f.title.includes('✦') ? '#6d5ed4' :
                    f.title.toLowerCase().includes('gap') || f.title.toLowerCase().includes('missing') ? '#e8604a' :
                    '#0d9488'
                  } />
                ))}
              </Card>
            ))}
            <Card>
              <CardTitle>AI opportunities</CardTitle>
              {product.newFeatureFramework.aiOpportunities.map(ai => (
                <FeatureBox key={ai.feature} title={`${ai.feature} ✦`} desc={`${ai.problem} — Status: ${ai.status}`} color="#d97706" />
              ))}
            </Card>
          </div>
        )}

        {/* ANALYTICS */}
        {activeTab === 'analytics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              <MetricCard label="Critical gaps" value={product.criticalGaps} deltaVariant="down" />
              <MetricCard label="Support tickets/yr" value={product.ticketsPerYear ? `${(product.ticketsPerYear / 1000).toFixed(0)}k` : '—'} deltaVariant="down" />
              <MetricCard label="NPS score" value={product.nps ? `${product.nps}/5` : '—'} deltaVariant="down" />
              <MetricCard label="Granola sessions" value={product.granolaSessions} delta="All synced" deltaVariant="up" />
            </div>
            {ChartComponent ? <ChartComponent /> : (
              <Card><CardTitle sub="Charts pending data availability">Analytics</CardTitle><p style={{ fontSize: 14, color: 'var(--text3)' }}>Charts will be added as Pendo analytics data becomes available for this product.</p></Card>
            )}
          </div>
        )}

        {/* ACCESSIBILITY */}
        {activeTab === 'accessibility' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card>
              <CardTitle sub="Accessibility requirements specific to this product and user context">Accessibility requirements</CardTitle>
              <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: 1, background: 'var(--border)' }}>
                  {['Feature', 'Current status', 'Priority'].map(h => (
                    <div key={h} style={{ padding: '10px 14px', background: 'var(--bg3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)' }}>{h}</div>
                  ))}
                  {data.a11yFeatures.map((f, i) => (
                    <>
                      <div key={`f${i}`} style={{ padding: '11px 14px', background: 'white', fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{f.feature}</div>
                      <div key={`s${i}`} style={{ padding: '11px 14px', background: 'white', fontSize: 13, color: 'var(--text2)', lineHeight: 1.45 }}>{f.status}</div>
                      <div key={`p${i}`} style={{ padding: '11px 14px', background: 'white', fontSize: 11, fontWeight: 700, color: f.priority === 'CRITICAL' ? 'var(--coral)' : f.priority === 'HIGH' ? 'var(--amber)' : 'var(--teal)' }}>{f.priority}</div>
                    </>
                  ))}
                </div>
              </div>
            </Card>
            <Card>
              <CardTitle>WCAG 2.1 AA requirements for this product</CardTitle>
              {[
                { criterion: '1.3.1 Info and relationships', req: 'Form labels programmatically associated with inputs. Table headers with scope attributes.' },
                { criterion: '1.4.3 Contrast (minimum)', req: '4.5:1 for normal text, 3:1 for large text. All text on all background colors.' },
                { criterion: '1.4.4 Resize text', req: 'Text resizable to 200% without loss of content or functionality.' },
                { criterion: '2.1.1 Keyboard', req: 'All functionality operable via keyboard. No keyboard traps.' },
                { criterion: '2.4.7 Focus visible', req: '3px focus ring on all interactive elements. Visible in all display modes.' },
                { criterion: '3.3.1 Error identification', req: 'Error messages specific and actionable. Never "This field is required" — always why and how to fix.' },
              ].map(item => (
                <div key={item.criterion} style={{ display: 'flex', gap: 14, marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--accent)', flexShrink: 0, marginTop: 1, width: 130 }}>{item.criterion}</span>
                  <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{item.req}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* COMPETITIVE */}
        {activeTab === 'competitive' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="ai-strip">
              Competitor analysis sourced from Granola sessions. Every gap is confirmed from stakeholder quotes, not assumed. Focus on where Exxat has a defensible moat, not just feature parity.
            </div>
            {data.competitors.map((c, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>{c.name}</h4>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--coral)', flexShrink: 0, marginTop: 2, width: 40 }}>Gap</span>
                      <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{c.gap}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--teal)', flexShrink: 0, marginTop: 2, width: 40 }}>Win</span>
                      <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{c.win}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Card>
              <CardTitle>Indirect competitor comparison</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 1, background: 'var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                {['Feature', 'Competitor offers', 'Exxat advantage'].map(h => (
                  <div key={h} style={{ padding: '10px 14px', background: 'var(--bg3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)' }}>{h}</div>
                ))}
                {[
                  { feature: 'Self-service', comp: 'Google Forms, Typeform — zero friction', exxat: 'Clinical domain vocabulary, compliance enforcement, ARC-PA/CAPTE fields' },
                  { feature: 'Data viz', comp: 'Qualtrics — advanced survey analysis', exxat: 'Connected to placement + exam data — Qualtrics knows nothing about PANCE' },
                  { feature: 'AI features', comp: 'Typeform AI, Qualtrics iQ', exxat: 'AI built into clinical lifecycle — not generic survey AI' },
                ].map((row, i) => (
                  <>
                    <div key={`r${i}0`} style={{ padding: '10px 14px', background: 'white', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{row.feature}</div>
                    <div key={`r${i}1`} style={{ padding: '10px 14px', background: 'white', fontSize: 13, color: 'var(--text2)', lineHeight: 1.45 }}>{row.comp}</div>
                    <div key={`r${i}2`} style={{ padding: '10px 14px', background: 'white', fontSize: 13, color: 'var(--teal)', lineHeight: 1.45 }}>{row.exxat}</div>
                  </>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* DESIGN DECISIONS */}
        {activeTab === 'decisions' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {data.decisions.map(d => <DecisionCard key={d.title} {...d} />)}
            <Card>
              <CardTitle>Gaps by discipline</CardTitle>
              {Object.entries(product.gapsByDiscipline).map(([disc, gaps]) => (
                <div key={disc} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: disc === 'dev' ? '#3b82f6' : disc === 'ux' ? '#6d5ed4' : disc === 'ui' ? '#db2777' : '#d97706', marginBottom: 6 }}>{disc}</div>
                  {gaps.map((g: string, i: number) => (
                    <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5, fontSize: 13, color: 'var(--text2)' }}>
                      <span style={{ color: 'var(--border2)' }}>–</span>{g}
                    </div>
                  ))}
                </div>
              ))}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
