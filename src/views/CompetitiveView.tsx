import { useState } from 'react';

// ─── Competitive Intelligence View ───────────────────────────────────────────
// Rich competitor analysis with use cases, scenarios, real feature gaps,
// and direct connections to what Exxat is building.
// Every entry sourced from Granola sessions or project documents.
// "I want examples, visuals, use cases and scenarios to support each
//  information piece. Connect the dots with features we are building."
// — Romit's prompt, Mar 26, 2026

interface Feature {
  name: string;
  examsoft: 'yes' | 'no' | 'partial';
  blackboard: 'yes' | 'no' | 'partial';
  canvas: 'yes' | 'no' | 'partial';
  d2l: 'yes' | 'no' | 'partial';
  exxat: 'yes' | 'no' | 'partial' | 'planned';
  source: string;
  exxatNote?: string;
}

interface UseCase {
  scenario: string;
  who: string;
  currentPain: string;
  exxatFix: string;
  builtIn: string; // which Magic Patterns component addresses this
  source: string;
}

interface IndirectCompetitor {
  name: string;
  category: string;
  color: string;
  productOverlap: string;
  whyTheyWin: string;
  exxatGap: string;
  exxatFix: string;
  source: string;
}

const FEATURE_MATRIX: Feature[] = [
  { name: 'Flat pool + Smart Views (no folder silos)', examsoft: 'no', blackboard: 'yes', canvas: 'partial', d2l: 'partial', exxat: 'yes', source: 'f59ac2a6 Nipun + Stakeholder Day 1', exxatNote: 'Industry-first: flat pool with school-shared + personal Smart Views. ExamSoft folder trap eliminated.' },
  { name: 'Online review/approval workflow', examsoft: 'no', blackboard: 'no', canvas: 'no', d2l: 'no', exxat: 'yes', source: '8c94698f Nipun', exxatNote: 'ReviewQueue.tsx — Approve/reject/revise with inline comment. ExamSoft uses email.' },
  { name: 'AI question generation from slides', examsoft: 'no', blackboard: 'partial', canvas: 'partial', d2l: 'no', exxat: 'planned', source: 'f5d66e4c Ed Razenbach + 791334af Arun', exxatNote: 'ExamDashboard AI panel — upload lecture PDF, AI drafts questions. ExamSoft publicly anti-AI.' },
  { name: 'Blueprint assembly (describe → system builds)', examsoft: 'no', blackboard: 'no', canvas: 'no', d2l: 'no', exxat: 'planned', source: '791334af Arun', exxatNote: 'Industry first. Describe the exam in natural language, system assembles from bank.' },
  { name: 'AI personalised remediation per student', examsoft: 'no', blackboard: 'no', canvas: 'no', d2l: 'no', exxat: 'planned', source: 'ca5a709c Ed Razenbach', exxatNote: 'PostExamPhase — per-student weak-area question sets. Ed already does manually with Claude.' },
  { name: 'Formula/variable injection questions', examsoft: 'no', blackboard: 'yes', canvas: 'yes', d2l: 'yes', exxat: 'yes', source: '2768ba8d Dr. Vicky Mody', exxatNote: 'FormulaQuestionEditor.tsx — anti-cheating by design. ExamSoft gap confirmed.' },
  { name: 'Ordering / sequence question type', examsoft: 'no', blackboard: 'yes', canvas: 'yes', d2l: 'yes', exxat: 'yes', source: '2768ba8d Dr. Vicky Mody', exxatNote: 'QuestionEditor ordering type. Glycolysis steps, pathophysiology sequences.' },
  { name: 'Bulk accommodation profile (assign once, applies to all exams)', examsoft: 'no', blackboard: 'no', canvas: 'partial', d2l: 'no', exxat: 'yes', source: 'f29a990d Aarti + D2L demo Mar 4', exxatNote: 'AccommodationManager.tsx — program-level profile. D2L requires 70 manual ops per 7 students × 10 quizzes.' },
  { name: 'WCAG 2.1 AA + ACR/VPAT report', examsoft: 'partial', blackboard: 'yes', canvas: 'yes', d2l: 'yes', exxat: 'yes', source: '4c9b94f5 Nipun + f29a990d Aarti', exxatNote: 'PublishPhase ACR panel — 11 WCAG criteria, Export VPAT. Required for UNF pilot + ADA Title II Apr 24.' },
  { name: 'Platform-embedded TTS/STT in lockdown', examsoft: 'no', blackboard: 'no', canvas: 'no', d2l: 'no', exxat: 'planned', source: 'Mar 16 accessibility session', exxatNote: 'No competitor has this. All rely on OS-level tools that lockdown browser blocks.' },
  { name: 'KR-20 + point-biserial + upper/lower 27%', examsoft: 'yes', blackboard: 'partial', canvas: 'no', d2l: 'partial', exxat: 'yes', source: 'f5d66e4c Mary + ca5a709c Ed', exxatNote: 'PostExamPhase psychometrics tab — built.' },
  { name: 'Curve options (full credit / bonus / answer change)', examsoft: 'yes', blackboard: 'partial', canvas: 'partial', d2l: 'partial', exxat: 'yes', source: 'f5d66e4c ExamSoft demo', exxatNote: 'PostExamPhase curves tab — 3 options built.' },
  { name: 'Watch-list: auto-flag at-risk students', examsoft: 'no', blackboard: 'no', canvas: 'no', d2l: 'no', exxat: 'yes', source: '92bef6ba Dr. T Touro', exxatNote: 'ExamDashboard watch-list widget. Dr. T: "Wouldn\'t it be nice if the computer flagged them automatically."' },
  { name: 'Full audit trail per question access', examsoft: 'partial', blackboard: 'no', canvas: 'no', d2l: 'no', exxat: 'yes', source: '92bef6ba Dr. T Touro', exxatNote: 'AuditTrail.tsx — ExamSoft had incidents where they couldn\'t tell who accessed an exam.' },
  { name: 'PA performance dashboard (PACRAT + EOR + PANCE predictor)', examsoft: 'no', blackboard: 'no', canvas: 'no', d2l: 'no', exxat: 'yes', source: '7dbabdb5 Aarti + Vishaka', exxatNote: 'PADashboard.tsx — Aarti: "Even Influx is not doing this level of report."' },
  { name: 'Marks: Bloom\'s-based distribution', examsoft: 'no', blackboard: 'no', canvas: 'no', d2l: 'no', exxat: 'yes', source: 'marks_weightage_features.md', exxatNote: 'MarksWeightage.tsx — Phase 3 feature. No competitor has this.' },
  { name: 'Immutable question versioning (exams pin to version used)', examsoft: 'no', blackboard: 'no', canvas: 'partial', d2l: 'no', exxat: 'yes', source: 'Stakeholder Day 1 + Day 2', exxatNote: 'ExamSoft: editing a question loses the exam link. Exxat: every edit creates a new immutable version.' },
];

const USE_CASES: UseCase[] = [
  {
    scenario: 'Faculty wants to build a 42-question exam covering 3 competency areas',
    who: 'Dr. Vicky Mody (Touro PA, Pharmacy)',
    currentPain: 'In ExamSoft: navigate 3 separate folder banks, manually check blueprint coverage, no AI. Takes 3–4 hours.',
    exxatFix: 'Blueprint prompt: "30 MCQ: 10 hard CV Pharm Apply-level, 10 medium Pulm Understand-level, 10 easy Neuro recall. Exclude last 2 exams." AI builds the set. Faculty reviews.',
    builtIn: 'ExamDashboard AI Generate panel — Blueprint assembly. BuildPhase AI suggest per section.',
    source: '791334af Arun + f5d66e4c Ed Razenbach',
  },
  {
    scenario: 'Two students fail the same EOR — need different remediation',
    who: 'Ed Razenbach (DCE, Touro PA)',
    currentPain: 'Ed manually runs PACRAT results through Claude, generates per-student question sets. Completely manual, not scalable.',
    exxatFix: 'PostExamPhase remediation tab: click "Generate remediation set" per student. AI uses their weak competency tags to build a personalised question set. Faculty reviews before sending.',
    builtIn: 'PostExamPhase — Remediation tab with AI generate per student.',
    source: 'ca5a709c Ed Razenbach: "Two students failed family med but each got different question sets from me."',
  },
  {
    scenario: 'Student with ADHD needs extended time + TTS + on-screen keyboard',
    who: 'Students with disabilities (WCAG, UNF pilot)',
    currentPain: 'ExamSoft/Respondus blocks OS-level tools. Students with disabilities have no in-exam accommodations. Programs file ADA complaints.',
    exxatFix: 'Accommodation profile: 1.5× time + TTS + on-screen keyboard set once. Applies automatically to all of their exams. ADA Title II compliant by April 24.',
    builtIn: 'AccommodationManager.tsx + PublishPhase ACR panel + student PreExamScreen accessibility toolbar.',
    source: 'f29a990d Aarti: "Title Two is going into law on April 24. Anything we release has to be accessible from day one."',
  },
  {
    scenario: 'Program director wants to see which students are at risk before graduation',
    who: 'Dr. T (Touro PA program), Mary (coordinator)',
    currentPain: '"Monster Grid" — Excel combining PACRAT, EOR, PANCE predictor, procedure minimums, GPA. Updated manually each rotation.',
    exxatFix: '"Just the reds" toggle: single click shows only students below any threshold. PANCE predictor, EOR z-scores, procedure gaps all in one dashboard. CSV import for PAEA data.',
    builtIn: 'PADashboard.tsx — cohort view with at-risk sort + watch-list widget on ExamDashboard.',
    source: '92bef6ba Dr. T: "I just want the reds." 7dbabdb5 Aarti: "Even Influx is not doing this."',
  },
  {
    scenario: 'Head professor wants 3 associates to each build one section of a 100-question exam',
    who: 'Nipun (PM), confirmed at Touro',
    currentPain: 'No platform supports this. Head emails associates "give me 5 hard Apply-level cardiology questions," receives them by email, manually adds to ExamSoft.',
    exxatFix: 'Multi-professor collaboration: head defines section scope, assigns to contributor roles. Each contributor sees their section only. Head reviews question level (Approve/reject from ReviewQueue).',
    builtIn: 'ReviewQueue.tsx + BuildPhase contributor role + PhaseShell role-based access.',
    source: '84c94044 Nipun: "Up to now, there is no tool which does this kind of collaboration."',
  },
  {
    scenario: 'Faculty wants to understand why Question 18 was flagged by 44% of students',
    who: 'David Stocker (faculty, Touro)',
    currentPain: 'ExamSoft shows flag count but no psychometric context. "Is it a bad question or just a hard concept?" Cannot tell without KR-20 + point-biserial analysis.',
    exxatFix: 'PostExamPhase psychometrics: Q18 shows point-biserial −0.09 (weaker students scored higher), 44% flag rate, upper-27% vs lower-27% split. Action: "Review" badge, retire from bank.',
    builtIn: 'PostExamPhase — Psychometrics tab with per-question analysis.',
    source: 'f5d66e4c Mary: "Negative means weaker students got it right — that\'s a bad question."',
  },
];

const INDIRECT: IndirectCompetitor[] = [
  {
    name: 'SurveyMonkey / Typeform',
    category: 'FaaS 2.0 — Form creation',
    color: '#00BF6F',
    productOverlap: 'Form creation UX, branching logic, inline validation, response analytics',
    whyTheyWin: 'Zero-friction creation. Inline validation on every field (not submit-only). Preview before publish. Free tier eliminates procurement friction.',
    exxatGap: 'FaaS has NO inline validation — Prasanjit confirmed: numeric fields accept any value, error only on submit. This is WCAG 3.3.1 violation AND baseline UX expectation.',
    exxatFix: 'Inline validation with visible field limits on all FaaS form controls. Error on blur, not submit.',
    source: '13352a23 Prasanjit: "Mandatory field errors only appear on submit, not during input."',
  },
  {
    name: 'Qualtrics / Blue',
    category: 'Course Eval — Survey analysis',
    color: '#0033A0',
    productOverlap: 'Survey analysis, theme extraction from open-text, benchmarking, reporting',
    whyTheyWin: 'AI theme extraction saves hours from qualitative analysis. Export-ready accreditation reports. Touro uses Blue for all 7 eval types instead of Exxat.',
    exxatGap: 'No AI theme extraction from open-ended responses. Excel-only export. 7 survey types run outside Exxat.',
    exxatFix: 'PCE module: AI theme extraction from open-text responses is the single highest-ROI feature to compete with Qualtrics.',
    source: 'f5d66e4c Touro: "It saves hours and hours." bde86866 Vishaka: PCE = special kind of survey.',
  },
  {
    name: 'Google Forms',
    category: 'FaaS 2.0 — Zero-friction baseline',
    color: '#4285F4',
    productOverlap: 'Form creation baseline expectation for all users',
    whyTheyWin: 'Zero setup. No training. If you can type, you can make a form. Free. This is what every new user compares FaaS to.',
    exxatGap: 'FaaS is significantly harder than Google Forms for basic form creation. Low self-service adoption confirmed by Pendo (Pratiksha: "not many clients who go and do the setup themselves").',
    exxatFix: 'Template-first entry (Akshit Q2 strategy): 80-85% of creation is cloning existing template. Don\'t open with blank canvas.',
    source: '19c032d2 Akshit: "80-85% are just addition of questions or options on existing questions." 1a0cd25e Pratiksha: Pendo shows low event count.',
  },
  {
    name: 'Influx',
    category: 'PA Dashboard — Student performance',
    color: '#FF6B35',
    productOverlap: 'PA student performance tracking, some didactic data from ExamSoft',
    whyTheyWin: 'Some ExamSoft data integration. Established in PA programs. Familiar interface.',
    exxatGap: 'Influx cannot get clinical data — no placement context. Cannot combine didactic + clinical in one view.',
    exxatFix: 'Exxat owns the clinical layer. PA Dashboard combines PACRAT + EOR + OSCE + procedure minimums + placement data. Aarti: "Even Influx is not doing this level of report."',
    source: '7dbabdb5 Aarti + Vishaka PA Dashboard session.',
  },
  {
    name: 'Meditrek',
    category: 'Skills Checklist — Clinical hours tracking',
    color: '#5B2D8E',
    productOverlap: 'Procedure minimums tracking, clinical hours, competency logging',
    whyTheyWin: 'Purpose-built for procedure tracking. Simple mobile interface. Programs have used it for years.',
    exxatGap: 'Skills must be program-scoped (not placement-scoped). Students cannot answer "how many IVs have I done total across all rotations?" in current Exxat system — same limitation as Meditrek.',
    exxatFix: 'Skills Checklist program-scoped redesign + "just the reds" filter + overflow/culminating rotation slot + mobile-first logging.',
    source: '5890b614 Day 4 Marriott: 80-90% use external spreadsheets. 92bef6ba Dr. T: "Typhon replaced by Exxat."',
  },
  {
    name: 'Notion',
    category: 'rr-insights — Research repository',
    color: '#000000',
    productOverlap: 'Research intelligence, note-taking, knowledge management',
    whyTheyWin: 'Beautiful UX. Flexible structure. Everyone already uses it.',
    exxatGap: 'Notion has no clinical education domain intelligence, no Granola auto-sync, no product-aware insight tagging.',
    exxatFix: 'rr-insights: Granola → insights pipeline, force-directed knowledge graph, domain expert breakdown, story-driven product views. Notion cannot connect a transcript to a Magic Patterns component.',
    source: 'SKILL.md v5.0 — rr-insights as intelligence agency.',
  },
];

const STATUS_COLORS = { yes: '#16a34a', no: '#dc2626', partial: '#d97706', planned: '#6d5ed4' };
const STATUS_BG = { yes: 'rgba(22,163,74,0.08)', no: 'rgba(220,38,38,0.07)', partial: 'rgba(217,119,6,0.08)', planned: 'rgba(109,94,212,0.08)' };
const STATUS_LABELS = { yes: '✓', no: '✗', partial: '~', planned: '⬡' };

type ViewTab = 'matrix' | 'use-cases' | 'indirect' | 'retention';

export function CompetitiveView() {
  const [tab, setTab] = useState<ViewTab>('matrix');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterProduct, setFilterProduct] = useState<'all' | 'exxat-wins' | 'exxat-gaps' | 'exxat-planned'>('all');

  const filteredFeatures = FEATURE_MATRIX.filter(f => {
    if (filterProduct === 'exxat-wins') return f.exxat === 'yes';
    if (filterProduct === 'exxat-gaps') return f.exxat === 'no' || f.exxat === 'partial';
    if (filterProduct === 'exxat-planned') return f.exxat === 'planned';
    return true;
  });

  const wins = FEATURE_MATRIX.filter(f => f.exxat === 'yes').length;
  const planned = FEATURE_MATRIX.filter(f => f.exxat === 'planned').length;
  const gaps = FEATURE_MATRIX.filter(f => f.exxat === 'no' || f.exxat === 'partial').length;

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif', background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px', fontFamily: 'DM Serif Display, Georgia, serif' }}>
          Competitive Intelligence
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0 }}>
          Real use cases, real gaps, direct connections to what we are building. Every entry sourced from Granola sessions.
        </p>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Features built', val: wins, color: '#16a34a', sub: 'Exxat leads or matches', filter: 'exxat-wins' as const },
          { label: 'Planned', val: planned, color: '#6d5ed4', sub: 'Industry-first or Q3+', filter: 'exxat-planned' as const },
          { label: 'Still gaps', val: gaps, color: '#dc2626', sub: 'Needs work', filter: 'exxat-gaps' as const },
          { label: 'Indirect competitors', val: INDIRECT.length, color: '#d97706', sub: 'Feature-level collision', filter: 'all' as const },
        ].map(k => (
          <button key={k.label} onClick={() => { setFilterProduct(k.filter); setTab('matrix'); }}
            style={{ textAlign: 'left', padding: '12px 14px', borderRadius: 10, background: '#fff', border: `1px solid var(--border)`, cursor: 'pointer' }}>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginTop: 1 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{k.sub}</div>
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {([
          { id: 'matrix', label: 'Feature matrix' },
          { id: 'use-cases', label: 'Real use cases' },
          { id: 'indirect', label: 'Indirect competitors' },
          { id: 'retention', label: 'Retention anchors' },
        ] as { id: ViewTab; label: string }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '10px 18px', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? 'var(--brand)' : 'var(--text3)', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? 'var(--brand)' : 'transparent'}`, marginBottom: -1, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* FEATURE MATRIX */}
      {tab === 'matrix' && (
        <div>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            {([['all', 'All features'], ['exxat-wins', '✓ Exxat wins'], ['exxat-planned', '⬡ Planned'], ['exxat-gaps', '✗ Gaps']] as const).map(([f, label]) => (
              <button key={f} onClick={() => setFilterProduct(f)}
                style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, border: `1px solid ${filterProduct === f ? 'var(--brand)' : 'var(--border)'}`, background: filterProduct === f ? 'var(--brand-soft)' : '#fff', color: filterProduct === f ? 'var(--brand)' : 'var(--text3)', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
            <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
              {(['yes', 'partial', 'no', 'planned'] as const).map(s => (
                <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 20, height: 18, borderRadius: 4, background: STATUS_BG[s], color: STATUS_COLORS[s], fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{STATUS_LABELS[s]}</span>
                  <span style={{ color: 'var(--text3)', fontSize: 11, textTransform: 'capitalize' }}>{s === 'planned' ? 'Exxat planned' : s === 'yes' ? 'Yes' : s === 'no' ? 'No' : 'Partial'}</span>
                </span>
              ))}
            </span>
          </div>

          {/* Matrix table */}
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', background: '#fff' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 100px 100px 140px', gap: 0, padding: '10px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Feature</span>
              {['ExamSoft', 'Blackboard Ultra', 'Canvas LMS', 'D2L', 'Exxat target'].map(h => (
                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: h === 'Exxat target' ? 'var(--brand)' : 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>{h}</span>
              ))}
            </div>
            {filteredFeatures.map((f, i) => (
              <div key={f.name}>
                <div
                  onClick={() => setExpanded(expanded === f.name ? null : f.name)}
                  style={{ display: 'grid', gridTemplateColumns: '1fr 100px 120px 100px 100px 140px', gap: 0, padding: '10px 16px', borderBottom: '1px solid var(--border)', cursor: 'pointer', background: expanded === f.name ? 'var(--bg2)' : 'transparent' }}
                  onMouseEnter={e => { if (expanded !== f.name) e.currentTarget.style.background = 'var(--bg2)'; }}
                  onMouseLeave={e => { if (expanded !== f.name) e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4, paddingRight: 12 }}>{f.name}</span>
                  {(['examsoft', 'blackboard', 'canvas', 'd2l', 'exxat'] as const).map(comp => (
                    <div key={comp} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: comp === 'exxat' ? 13 : 12, fontWeight: 700, width: comp === 'exxat' ? 52 : 32, height: 24, borderRadius: 6, background: STATUS_BG[f[comp]], color: STATUS_COLORS[f[comp]], display: 'inline-flex', alignItems: 'center', justifyContent: 'center', letterSpacing: comp === 'exxat' && f[comp] === 'planned' ? '0em' : '0em' }}>
                        {comp === 'exxat' && f[comp] === 'planned' ? 'Planned' : STATUS_LABELS[f[comp]]}
                      </span>
                    </div>
                  ))}
                </div>
                {expanded === f.name && (
                  <div style={{ padding: '12px 16px 14px', background: 'rgba(109,94,212,0.03)', borderBottom: '1px solid var(--border)', borderLeft: '3px solid var(--brand)' }}>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {f.exxatNote && (
                        <div style={{ flex: 1, minWidth: 280 }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Exxat design note</div>
                          <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>{f.exxatNote}</p>
                        </div>
                      )}
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Source</div>
                        <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)' }}>{f.source}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USE CASES */}
      {tab === 'use-cases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: '10px 14px', borderRadius: 9, background: 'rgba(109,94,212,0.05)', border: '1px solid rgba(109,94,212,0.15)', fontSize: 12, color: 'var(--text2)' }}>
            Every use case is real — sourced from Granola sessions with Touro faculty, DCEs, and program directors. Each maps directly to a built or planned Magic Patterns component.
          </div>
          {USE_CASES.map((uc, i) => (
            <div key={i} style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Use case {i + 1} · {uc.who}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', lineHeight: 1.4 }}>{uc.scenario}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ padding: '12px 16px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Current pain</div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>{uc.currentPain}</p>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Exxat solution</div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>{uc.exxatFix}</p>
                </div>
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Built in: </span>
                  <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text2)' }}>{uc.builtIn}</span>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{uc.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* INDIRECT */}
      {tab === 'indirect' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: '10px 14px', borderRadius: 9, background: 'rgba(217,119,6,0.05)', border: '1px solid rgba(217,119,6,0.15)', fontSize: 12, color: 'var(--text2)' }}>
            Indirect competitors do not compete at the category level, but they set user expectations at the feature level. Users compare FaaS to SurveyMonkey, PCE to Qualtrics, and skills tracking to Meditrek regardless of whether they are in the same space.
          </div>
          {INDIRECT.map((c, i) => (
            <div key={i} style={{ borderRadius: 12, background: '#fff', border: `1px solid ${c.color}25`, overflow: 'hidden', borderLeft: `4px solid ${c.color}` }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `${c.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: c.color, flexShrink: 0 }}>
                  {c.name.slice(0, 1)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{c.category}</div>
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${c.color}10`, color: c.color, fontWeight: 600 }}>
                  {c.productOverlap.split(' — ')[0]}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }}>
                {[
                  { label: 'Why they win', text: c.whyTheyWin, color: '#dc2626' },
                  { label: 'Exxat gap', text: c.exxatGap, color: '#d97706' },
                  { label: 'Exxat fix', text: c.exxatFix, color: '#16a34a' },
                ].map((col, ci) => (
                  <div key={ci} style={{ padding: '12px 14px', borderRight: ci < 2 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: col.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{col.label}</div>
                    <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>{col.text}</p>
                  </div>
                ))}
              </div>
              <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)' }}>
                {c.source}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RETENTION ANCHORS */}
      {tab === 'retention' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.2)', borderLeft: '4px solid #dc2626' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
              Why schools stay on ExamSoft — confirmed verbatim
            </div>
            <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, fontFamily: 'DM Serif Display, Georgia, serif', fontStyle: 'italic', marginBottom: 8 }}>
              "Curriculum mapping already done in ExamSoft — 8 cohorts of questions. Faculty training built over years. Strong item analytics. These are the exact three things Exxat must match or exceed."
            </div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>Dr. Vicky Mody, Touro School of Pharmacy · Mar 20, 2026 · session 2768ba8d</div>
          </div>

          {[
            {
              anchor: '1. Curriculum mapping established',
              detail: '8 cohorts of question-to-competency mapping already done in ExamSoft. Rebuilding this in a new system takes 12–18 months of faculty time. This is the highest switching cost.',
              exxatCounter: 'AI tag suggestion: faculty types "heart drugs" → AI suggests "Cardiovascular Pharmacology" → one click to accept. Rebuilding the map becomes hours not months. Flat pool means questions can be retagged in bulk.',
              sessions: '2768ba8d Dr. Vicky Mody + Stakeholder Day 1',
            },
            {
              anchor: '2. Faculty training built over years',
              detail: 'Faculty have 5–10 years of ExamSoft muscle memory. Question creation, exam assembly, scoring — all feel automatic. Switching means retraining a department.',
              exxatCounter: 'QB landing = assessment builder mode (Nipun confirmed). Three entry points to questions. No folder navigation — just search and filter. Onboarding must feel like ExamSoft, then reveal the upgrades.',
              sessions: '2768ba8d Dr. Vicky Mody + f59ac2a6 David Stocker',
            },
            {
              anchor: '3. Strong item analytics',
              detail: 'ExamSoft shows KR-20, point-biserial, difficulty index, discrimination index, 5 criteria per question per exam. Faculty trust these numbers for accreditation.',
              exxatCounter: 'PostExamPhase psychometrics: KR-20, point-biserial, upper/lower 27%, per-question action badges (Good/Flag/Remove). Plus AI remediation — ExamSoft cannot do this.',
              sessions: 'f5d66e4c Mary Touro + ca5a709c Ed Razenbach',
            },
            {
              anchor: 'ExamSoft security failures (opportunity)',
              detail: 'Dr. T: "If you edit a question it loses the exam link. You can\'t tell who accessed an exam. Printed copies left on desks caused cheating incidents." These are not minor UX issues — they are institutional integrity risks.',
              exxatCounter: 'Immutable versioning: every edit creates a new version, past exams pinned. Full audit trail per access. Export/print control. These are switching triggers, not just improvements.',
              sessions: '92bef6ba Dr. T Touro clinical team',
            },
          ].map((r, i) => (
            <div key={i} style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: i === 3 ? 'rgba(16,163,74,0.04)' : 'rgba(220,38,38,0.03)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: i === 3 ? '#16a34a' : '#dc2626' }}>{r.anchor}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ padding: '12px 16px', borderRight: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: i === 3 ? '#16a34a' : '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>
                    {i === 3 ? 'Why this is an opportunity' : 'Why it keeps schools on ExamSoft'}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>{r.detail}</p>
                </div>
                <div style={{ padding: '12px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6d5ed4', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>Exxat counter</div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.6 }}>{r.exxatCounter}</p>
                </div>
              </div>
              <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)' }}>{r.sessions}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
