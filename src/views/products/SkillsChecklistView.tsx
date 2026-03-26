import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

const PRODUCT_ID = 'skills-checklist';
type TabId = 'insights' | 'architecture' | 'domains' | 'workflows' | 'accreditation' | 'stories';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights', label: 'Insights' },
  { id: 'architecture', label: 'System architecture' },
  { id: 'domains', label: 'Domain variations' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'accreditation', label: 'Accreditation' },
  { id: 'stories', label: 'UX stories' },
];

const radarData = [
  { area: 'PA Programs', completeness: 72, complexity: 65 },
  { area: 'Nursing', completeness: 45, complexity: 85 },
  { area: 'Social Work', completeness: 38, complexity: 78 },
  { area: 'Rad Tech', completeness: 55, complexity: 90 },
  { area: 'CVT', completeness: 30, complexity: 95 },
  { area: 'PT/OT', completeness: 60, complexity: 70 },
];

const evaluationApproaches = [
  { method: 'Binary (Yes/No + signature)', programs: 'PA, PT, PTA', note: 'Simple procedure completion. USC PA passport model.' },
  { method: 'Scaled (1–5 or custom)', programs: 'Nursing, CVT, Social Work', note: 'CVT uses 0/5/7.5/9/10 scale across 30 criteria per competency.' },
  { method: 'Rubric-based', programs: 'PA, Nursing, OT', note: 'Multi-dimension scoring. Critical task marking for OSCE-linked skills.' },
  { method: 'Narrative feedback', programs: 'Social Work, PT', note: 'Qualitative comments with structured prompts. Aligned to learning contracts.' },
  { method: 'Self-assessment + validation', programs: 'PT, PA, Nursing', note: 'Student rates first, then preceptor confirms or overrides.' },
  { method: 'Physical signature (passport)', programs: 'PA (USC model)', note: 'Paper-style passport digitized. 15 core technical skills across all rotations.' },
];

const domains = [
  {
    name: 'PA Programs',
    ref: 'Day 4 Marriott · Mar 5',
    skills: '15 core technical skills across all rotations',
    structure: 'Organized by rotation type (EM, family med, surgery). Required vs optional per rotation clearly marked.',
    trigger: 'Student logs patient → system prompts skill evaluation request to preceptor',
    graduation: 'Clinical passport completion required for graduation clearance',
    evaluator: 'Site preceptor (same day as procedure)',
    gaps: 'Patient logging trigger not yet integrated. USC passport model needs digitization path.',
  },
  {
    name: 'Nursing (FNP/PNP/CRNA)',
    ref: 'Day 4 Marriott · Mar 5',
    skills: '50+ skills organized by body systems and procedure types',
    structure: 'Rows = students, columns = skills. Batch evaluation preferred by faculty. Skills lab before clinical.',
    trigger: 'Scheduled milestones (week 5, end of rotation, end of program)',
    graduation: 'All required skills signed off. GPA threshold + skills together.',
    evaluator: 'Faculty (lab) + clinical preceptor (field)',
    gaps: 'Batch evaluation UI not built. Skills lab integration separate from clinical.',
  },
  {
    name: 'Radiation Technology',
    ref: 'Day 4 Marriott · Mar 5',
    skills: '50+ X-ray procedures across complex hierarchy (body parts → systems → procedures)',
    structure: 'Abdomen → multiple sub-areas → specific scanning techniques. "Does not meet / Meets / Exceeds / N/A."',
    trigger: 'Student selects preceptor → form routes for evaluation',
    graduation: '"Does student demonstrate competence in this exam?" — final determination required',
    evaluator: 'Preceptor at scan time',
    gaps: 'Hierarchy depth (4 levels) is the hardest UX problem. Dropdown with 100+ items is unusable.',
  },
  {
    name: 'CVT (Cardiovascular Technology)',
    ref: 'Day 4 Marriott · Mar 5',
    skills: 'Each competency includes detailed instructions and daily guidelines',
    structure: '20–30 questions per competency. Dimensions: patient interaction, communication, equipment, scrubbing, hemodynamic analysis.',
    trigger: 'Student performs procedure → selects preceptor → form routed',
    graduation: 'Custom scoring: 0 / 5 / 7.5 / 9 / 10 across all criteria. Average determines pass.',
    evaluator: 'Preceptor (real-time)',
    gaps: 'Custom scoring scale (not 1–5) requires configurable scale support. Highest complexity domain.',
  },
  {
    name: 'Social Work',
    ref: 'Day 4 Marriott · Mar 5',
    skills: '9 EPAS competencies × 5 sub-areas (knowledge, values, skills, cognitive, affective)',
    structure: 'Skills evaluation maps directly to professional competencies. Learning contract integration is mandatory.',
    trigger: 'Pre-planned (learning contract commits → evaluation at midterm + final)',
    graduation: 'All 9 competency areas achieved + learning contract closed',
    evaluator: 'Site supervisor (comments) + faculty coordinator (official ratings)',
    gaps: 'Learning contract and evaluation must be visible side-by-side. Current system keeps them separate.',
  },
];

const architectureDecisions = [
  {
    decision: 'Skills as student program-level entity, not placement-specific',
    rationale: 'Cannot ask "Has student done skill X across all placements?" in current system. Skills artificially constrained to placement boundaries. New entity sits above courses, placements, and individual evaluations.',
    tradeoff: 'More complex data model. Must maintain backward compatibility with existing competency system. Migration risk for existing clients.',
    src: 'Day 4 Marriott · Mar 5',
  },
  {
    decision: 'Student-initiated evaluation, not preceptor-initiated',
    rationale: 'Student decides when ready for assessment. Matches real clinical workflow — student performs procedure, then requests sign-off from whoever worked with them that day (may not be main preceptor).',
    tradeoff: 'Some programs use preceptor-initiated or scheduled. System must support all trigger types. Not a pure student-initiated system.',
    src: 'Day 4 Marriott · Mar 5',
  },
  {
    decision: 'Same backend, domain-specific UIs',
    rationale: 'Nursing interface labeled "Skills Tracking Dashboard." PA interface is clinical passport. Social work is competency management. Same data model, different labels, workflows, and scoring scales per discipline.',
    tradeoff: 'More frontend complexity. Risk of UX drift. Mitigation: shared component library with domain-specific configuration layer.',
    src: 'Day 4 Marriott · Mar 5',
  },
  {
    decision: 'Template-based cohort versioning',
    rationale: 'Skills requirements change with new accreditation standards. Changes apply to new cohorts, not existing students. Archive old versions. Class of 2024 vs Class of 2025 may have different requirements.',
    tradeoff: 'Version management complexity. Clients must understand what version applies to whom. Edge case: student changes program mid-cohort.',
    src: 'Day 4 Marriott · Mar 5',
  },
  {
    decision: 'PDF auto-import for existing checklists',
    rationale: 'Programs have 20+ years of paper and PDF checklists. AI import of existing skills checklists into the hierarchy is the fastest migration path. Prevents "rebuild from scratch" friction that blocks adoption.',
    tradeoff: 'AI accuracy not 100%. Must have human review workflow. Programs with complex custom scales need manual mapping.',
    src: 'Day 4 Marriott · Mar 5',
  },
];


// Transcript gap from Day 4 Marriott session (5890b614 Mar 5)
const SC_TRANSCRIPT_GAPS = [
  { src:'Day 4 Marriott (5890b614 Mar 5)', gap:'Skills are program-scoped goals, NOT placement-scoped. A student can satisfy any skill in any placement. Current system ties skills to individual placements — forcing students to track completion in external spreadsheets. Fix: program-level aggregate view spanning all placements.', severity:'Critical' },
  { src:'Day 4 Marriott (5890b614 Mar 5)', gap:'PA programs use a "passport" model — procedure-based checklist, not competency-based. Lower-degree programs (PTA, lab assistant) focus on did-you-do-it. Higher-degree programs (PA, OT) focus on confidence and competency. Skills Checklist must support both models.', severity:'High' },
  { src:'Day 4 Marriott (5890b614 Mar 5)', gap:'Students trigger their own evaluation when they feel ready — faculty/preceptor does NOT initiate. The student decides "I am ready to be evaluated on this skill" and sends the form. This is fundamentally different from faculty-initiated evaluation.', severity:'High' },
];

export function SkillsChecklistView() {
  const [tab, setTab] = useState<TabId>('insights');
  const insights = getInsightsByProduct(PRODUCT_ID);

  const tabStyle = (id: TabId) => ({
    padding: '10px 18px',
    fontSize: 13,
    fontWeight: tab === id ? 600 : 400,
    color: tab === id ? 'var(--brand)' : 'var(--text-secondary)',
    borderBottom: `2px solid ${tab === id ? 'var(--brand)' : 'transparent'}`,
    marginBottom: -1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(t.id)}>{t.label}</button>)}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* ── INSIGHTS ── */}
        {tab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Primary source: Day 4 Marriott meeting (Mar 5) — 80+ requirements across nursing, PA, social work, rad tech, CVT. Dr. T Touro (Mar 11) — procedure tracking and Monster Grid. This is the richest product document in the corpus. Timeline: Q2 prototypes, Jan 2027 launch." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Disciplines covered" value="6+" delta="PA, Nursing, SocialWork, RadTech, CVT, PT/OT" />
              <MetricCard label="Timeline" value="Jan 2027" delta="Q2 requirements · Q3–Q4 dev" />
              <MetricCard label="Evaluation methods" value="6" delta="Binary to rubric-based" />
              <MetricCard label="Competitors" value="Typhon, CompetencyAI" delta="Must beat both at launch" deltaPositive={false} />
            </div>

            <Card>
              <CardTitle sub="Current vs target state — Day 4 Marriott">The core problem in one sentence</CardTitle>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Current state</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Skills are locked inside individual placement forms. Cannot answer: "Has this student completed venipuncture at least once across all 8 rotations?" Students lack a comprehensive view of their progress toward graduation. Faculty cannot see aggregate competency achievement across a program cohort.</p>
              </div>
              <div style={{ padding: '14px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px' }}>Target state</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>Skills exist at student program level — a cross-cutting entity above courses, placements, and evaluations. Student initiates assessment when ready. Aggregates across all placements automatically. Graduation clearance dashboard shows at-risk students weeks before the deadline.</p>
              </div>
            </Card>

            <Card>
              <CardTitle sub="Complexity and current coverage by discipline">Domain coverage radar</CardTitle>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                  <Radar name="Coverage" dataKey="completeness" stroke="#10B981" fill="#10B981" fillOpacity={0.15} />
                  <Radar name="Complexity" dataKey="complexity" stroke="#E31C79" fill="#E31C79" fillOpacity={0.1} />
                </RadarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Green = research coverage · Pink = implementation complexity</div>
            </Card>

            {insights.slice(0, 5).map((ins, i) => <InsightRow key={i} insight={ins} />)}
          </div>
        )}

        {/* ── ARCHITECTURE ── */}
        {tab === 'architecture' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="System architecture decisions from Day 4 Marriott (Mar 5). These are not suggestions — they are the decided approach that Arun owns technically, Vishaka leads UX on." />
            {architectureDecisions.map((a, i) => (
              <Card key={i}>
                <CardTitle sub={a.src}>{a.decision}</CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[{ label: 'Rationale', text: a.rationale, color: '#10B981' }, { label: 'Tradeoff', text: a.tradeoff, color: '#F59E0B' }].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: row.color, width: 72, flexShrink: 0, marginTop: 2 }}>{row.label}</span>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{row.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
            <Card>
              <CardTitle sub="Evaluation trigger types — must support all">Trigger mechanism matrix</CardTitle>
              {[
                { trigger: 'Student-initiated', desc: 'Student decides when ready. Selects preceptor. Form routed for evaluation.', programs: 'PA, CVT, Rad Tech' },
                { trigger: 'Preceptor-initiated', desc: 'Supervisor identifies readiness. Sends evaluation form to student/themselves.', programs: 'PT, OT' },
                { trigger: 'Scheduled milestones', desc: 'System auto-triggers at week 5, end of rotation, end of program.', programs: 'Nursing' },
                { trigger: 'Event-triggered', desc: 'Patient log entry → system prompts skill evaluation request. Most automated path.', programs: 'PA (target)' },
                { trigger: 'Emergency reassessment', desc: 'Incident report triggers immediate competency re-evaluation.', programs: 'All clinical disciplines' },
              ].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <Badge variant="default">{t.trigger}</Badge>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 2px' }}>{t.desc}</p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Used by: {t.programs}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── DOMAINS ── */}
        {tab === 'domains' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Day 4 Marriott documented 5 distinct domain models — all must work on the same backend. This is the hardest design challenge: one architecture, five completely different UX surfaces." />
            {domains.map((d, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Badge variant="default">{d.name}</Badge>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{d.ref}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
                  {[
                    { label: 'Skills scope', val: d.skills },
                    { label: 'Structure', val: d.structure },
                    { label: 'Trigger', val: d.trigger },
                    { label: 'Graduation link', val: d.graduation },
                    { label: 'Primary evaluator', val: d.evaluator },
                  ].map(row => (
                    <div key={row.label}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 2 }}>{row.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{row.val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#EF4444' }}>Design gap: </span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.gaps}</span>
                </div>
              </Card>
            ))}
            <Card>
              <CardTitle sub="All 6 evaluation approaches must be configurable per program">Evaluation method registry</CardTitle>
              {evaluationApproaches.map((e, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < evaluationApproaches.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{e.method}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>Used by: {e.programs}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.note}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── WORKFLOWS ── */}
        {tab === 'workflows' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Clinical passport (PA), batch nursing evaluation, social work learning contract integration, and graduation clearance workflows. All from Day 4 Marriott and Dr. T Touro session." />
            {[
              {
                title: 'Clinical passport (PA — USC model)',
                steps: [
                  'Student performs procedure at clinical site',
                  'Student logs patient encounter in patient log module',
                  'System detects eligible procedure — prompts skill evaluation request',
                  'Student selects preceptor who supervised the procedure',
                  'Preceptor receives mobile notification — opens form, verifies, signs',
                  'Skill logged against clinical passport. Progress bar updates.',
                  'DCE views graduation clearance dashboard — red flags for students under minimum counts',
                ],
              },
              {
                title: 'Nursing batch evaluation (faculty-led)',
                steps: [
                  'Faculty opens Skills Dashboard — rows = students, columns = skills',
                  'Selects skill (e.g., hand washing) — batch assessment mode opens',
                  'For each student: observed / not observed / needs repeat — checked in one pass',
                  'Faculty submits batch — all 40 students updated simultaneously',
                  'Program director sees cohort-level aggregate: "38/40 students achieved hand washing"',
                  'At-risk students (not achieved by milestone) surfaced with intervention recommendation',
                ],
              },
              {
                title: 'Social work learning contract + evaluation',
                steps: [
                  'Pre-placement: student, preceptor, and faculty agree on learning contract (9 EPAS competencies)',
                  'Student defines specific tasks/activities to achieve each competency area',
                  'All parties sign — contract is now a living document',
                  'Midterm: evaluation form opens side-by-side with learning contract commitments',
                  'Site supervisor provides qualitative comments per competency',
                  'Faculty coordinator provides official rating',
                  'Final evaluation: same workflow. Contract closed when all competencies marked achieved.',
                ],
              },
              {
                title: 'Graduation clearance (program-level)',
                steps: [
                  'Program sets minimum counts per skill type (e.g., 3× venipuncture required)',
                  'System tracks accumulation across ALL placements — not per rotation',
                  'Dr. T Touro: "Red flag when students below 3-procedure threshold — filterable report showing only the reds"',
                  'DCE receives alert 8 weeks before graduation deadline if students are at risk',
                  'Student can complete missing procedures in 10th rotation or culminating space (Dr. T request)',
                  'System generates accreditation-ready report: all students, all skills, all sign-offs',
                ],
              },
            ].map((w, i) => (
              <Card key={i}>
                <CardTitle>{w.title}</CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {w.steps.map((s, si) => (
                    <div key={si} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{si + 1}</span>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── ACCREDITATION ── */}
        {tab === 'accreditation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Each accreditor has different standard names but the same underlying need: prove students can perform clinical skills before graduation. All evidence must be program-level, not placement-level." />
            {[
              { body: 'CAPTE (PT/PTA)', standard: 'Clinical Performance Instrument (CPI)', detail: '18 performance criteria. Entry-level performance required by graduation. "Meets expectations" threshold. CPI Web is the digital form — Exxat must map to CPI taxonomy.', reportNeeded: 'All 18 criteria achieved per student + cohort aggregate' },
              { body: 'ACOTE (OT)', standard: 'Fieldwork Performance Evaluation (FWPE)', detail: '27-item rating scale. Fieldwork supervisor completes. Faculty director reviews aggregates. Level II fieldwork = 24 weeks of full-time supervised practice before graduation.', reportNeeded: 'FWPE scores + hours log per student' },
              { body: 'ARC-PA (PA)', standard: 'Program-defined competencies', detail: '9 competency areas mandated. Clinical passport for procedure minimums. Must demonstrate evidence that competencies were communicated to students AND assessed AND reported. Summative OSCE in last 4 months of program.', reportNeeded: 'Clinical passport completion + OSCE results + EOR z-scores (Ed Razenbach)' },
              { body: 'CCNE (Nursing)', standard: 'QSEN competencies + program outcomes', detail: 'Patient safety, evidence-based practice, teamwork, informatics, quality improvement. All must be mapped to clinical and didactic activities. "Has every student demonstrated this competency at least once across the program?"', reportNeeded: 'Competency achievement by student by competency area' },
              { body: 'CSWE (Social Work)', standard: 'EPAS 2022 — 9 competencies × 5 sub-areas', detail: '9 core competencies: professional identity, ethics, social justice, research, policy, engagement, assessment, intervention, evaluation. Each has knowledge/values/skills/cognitive/affective sub-areas = 45 trackable items minimum.', reportNeeded: 'All 9 competencies achieved per student. Learning contract closure for each placement.' },
              { body: 'Dr. T (Touro) request', standard: 'Monster Grid', detail: 'Comprehensive data consolidation across all programs. Didactic + SPAC + clinical data in one view. PAEA export integration. ExamSoft integration for exam data. Bulk upload for external data sources.', reportNeeded: 'Excel export: all students × all data points × all placements — filterable by "show only deficient students"' },
            ].map((a, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Badge variant="default">{a.body}</Badge>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{a.standard}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.6 }}>{a.detail}</p>
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>Report required: </span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a.reportNeeded}</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── STORIES ── */}
        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Skills Checklist user stories — significantly higher confidence now after Day 4 Marriott (Mar 5) and Dr. T Touro (Mar 11). Multi-discipline coverage." />
            {[
              { id: 'SC-01', who: 'Student (PA)', what: 'Log a completed procedure and immediately request preceptor sign-off on my mobile device', why: 'Clinical sites are busy. Logging immediately after the procedure — while the preceptor is still present — is the only reliable workflow. Desktop-first breaks this.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'SC-02', who: 'Student (any)', what: 'See my complete skills progress dashboard across all placements in one view', why: 'Current system requires students to check each placement separately. Cannot answer "How many venipunctures have I done total?" without navigating 8 different forms.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'SC-03', who: 'Preceptor (mobile)', what: 'Verify a student skill with a single tap and signature without creating an account or navigating a complex interface', why: 'Preceptors see 5–10 students across multiple programs. Any friction in the verification workflow means students stop asking and the data becomes incomplete.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'SC-04', who: 'Faculty (Nursing)', what: 'Assess 40 students on a single skill in one batch session without opening 40 separate forms', why: '"Rows = students, columns = skills" is how nursing faculty think about batch competency evaluation. One-at-a-time forms waste 90 minutes per skill.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'SC-05', who: 'DCE', what: 'See which students are below minimum procedure count 8 weeks before graduation clearance — not the day before', why: 'Dr. T: "Red flag when students below 3-procedure threshold — show only the reds." Early warning enables intervention. Finding gaps the week before graduation is too late.', src: 'Dr. T Touro · Mar 11' },
              { id: 'SC-06', who: 'Program Director', what: 'Generate an accreditation-ready competency report with one click — all students, all skills, all sign-offs, cohort format', why: 'Current: download separately, merge in Excel, format manually for each accreditation cycle. Should be automated to PDF/Excel by a single export action.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'SC-07', who: 'Social Work student', what: 'See my learning contract commitments side-by-side with my evaluation form when my preceptor is assessing me', why: 'Evaluation without reference to what was committed in the learning contract is disconnected. The contract defines what success looks like — the evaluation measures it.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'SC-08', who: 'Admin', what: 'Import an existing PDF skills checklist and have the system generate the skill hierarchy automatically', why: 'Programs have years of paper or PDF checklists. Asking them to rebuild from scratch is the primary adoption blocker. AI import reduces this to a review-and-confirm step.', src: 'Day 4 Marriott · Mar 5' },
            ].map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', background: 'rgba(227,28,121,0.08)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>{s.id}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                      <strong>As a</strong> {s.who}, <strong>I need to</strong> {s.what}, <strong>so that</strong> {s.why}.
                    </p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Source: {s.src}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
