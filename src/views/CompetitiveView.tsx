import { useState } from 'react';

type CompetitorId = 'examsoft' | 'blackboard' | 'd2l' | 'canvas' | 'core' | 'surveymonkey' | 'typhon';

interface Competitor {
  id: CompetitorId;
  name: string;
  category: 'direct' | 'lms' | 'indirect';
  categoryLabel: string;
  color: string;
  tagline: string;
  source: string;
  satisfaction?: string;
  revenue?: string;
  strengths: string[];
  weaknesses: string[];
  retentionAnchors?: string[];
  exxatWins: string[];
  keyQuote?: string;
  keyQuoteSource?: string;
}

const COMPETITORS: Competitor[] = [
  {
    id: 'examsoft',
    name: 'ExamSoft',
    category: 'direct',
    categoryLabel: 'Primary target',
    color: '#e8604a',
    tagline: 'Comprehensive features, 20-year-old UX, publicly anti-AI',
    source: 'Dr. Vicky Mody · Mar 20 + Day 1 Marriott · Mar 2',
    satisfaction: '1/5',
    revenue: '~$60M',
    strengths: [
      'Curriculum mapping already established at client sites',
      'Faculty training built over years — high switching cost',
      'Strong item analytics: p-value, discrimination index, KR-20',
      'Blueprint-based exam building with NCCPA cell coverage',
      'Deep medical education domain fit',
      'Question + answer randomisation, secure client delivery',
    ],
    weaknesses: [
      'User satisfaction 1/5 — "worst UX in edtech"',
      'Multi-campus sharing = print / email / re-upload manually',
      'No bulk accommodation assignment — 70 manual ops for 7 students × 10 quizzes',
      'No built-in accessibility — blocked by lockdown browser',
      'No AI features — cannot AI-first a 20-year-old codebase',
      'Manual course ID sync with LMS every semester',
      'Curriculum mapping lives in Excel outside the system',
    ],
    retentionAnchors: [
      'Curriculum mapping already done — "8 cohorts of questions. Rebuilding takes a year."',
      'Faculty training built over years — retraining would take a year',
      'Strong item analytics — 5 evaluation criteria per question',
    ],
    exxatWins: [
      'Modern UX — Canvas-level interface vs 20-year-old design',
      'Built-in accessibility within lockdown browser (Pearson model)',
      'Accommodation profile system — 70 ops → 1 operation',
      'AI-first architecture from day one',
      'Flat tagging replaces folder silos — cross-campus sharing',
      'Prism integration — student/course/faculty data already exists',
    ],
    keyQuote: 'We have 8 cohorts of questions in ExamSoft. The curriculum mapping is done. Retraining faculty would take a year.',
    keyQuoteSource: 'Dr. Vicky Mody · Touro · Mar 20, 2026',
  },
  {
    id: 'blackboard',
    name: 'Blackboard Ultra',
    category: 'lms',
    categoryLabel: 'LMS competitor',
    color: '#f5a623',
    tagline: 'Best question type variety, AI generation, dropped folders entirely',
    source: 'Dr. Vicky Mody Blackboard session · Mar 20, 2026',
    strengths: [
      '8+ question types ExamSoft lacks: formula-based with random variables, hotspot, jumbled sentence ordering',
      'AI question generation from syllabi and course materials',
      'Survey integration eliminates separate SurveyMonkey subscriptions',
      'WCAG 2.1 AA certified with ACR documentation',
      'High contrast mode, browser accessibility built-in',
      'Warning on publish if images missing alt text',
    ],
    weaknesses: [
      'Dropped folders entirely — may be too unstructured for clinical faculty',
      'Browser-based accessibility blocked by LockDown browser (same as ExamSoft)',
      'No clinical education differentiation — generic LMS',
      'Curriculum mapping disabled for faculty at Touro to prevent duplicates',
      'No accommodation profile system — per-attempt only',
      'Faculty still mapping curriculum in Excel outside both systems',
    ],
    exxatWins: [
      'Clinical-specific IA — not a generic LMS bolted onto healthcare',
      'Accommodation profiles at program level — Blackboard is per-attempt',
      'Built-in accessibility within lockdown (Blackboard relies on browser)',
      'Publish gate blocks deploy until all a11y items resolved',
    ],
    keyQuote: 'Ordering questions — like ranking glycolysis enzyme steps — ExamSoft simply cannot do that.',
    keyQuoteSource: 'Dr. Vicky Mody · Mar 20, 2026',
  },
  {
    id: 'd2l',
    name: 'D2L BrightSpace',
    category: 'lms',
    categoryLabel: 'LMS competitor',
    color: '#78aaf5',
    tagline: 'Good LMS integration, broken accommodation workflow',
    source: 'D2L BrightSpace demo · Mar 4, 2026',
    strengths: [
      'Respondus LockDown Browser integration built-in',
      'Remote proctoring with camera monitoring',
      'Quiz statistics and distribution analysis',
      'Canvas-style clean UX',
      'Broad institutional use across North America',
    ],
    weaknesses: [
      'Per-student per-quiz accommodation setup — no bulk assignment',
      '7 students × 10 quizzes = 70 individual manual setups. No bulk option.',
      'No clinical education differentiation',
      'Browser-based accessibility blocked by LockDown',
      'No accommodation profile system at any level',
    ],
    exxatWins: [
      'Accommodation profile system: D2L\'s 70-operation gap → 1 operation',
      'This is the single strongest UX competitive differentiator vs D2L',
      'Clinical-specific IA, accreditation vocabulary, placement integration',
    ],
    keyQuote: '7 students with accommodations. 10 quizzes each. That is 70 individual setups. No bulk option.',
    keyQuoteSource: 'D2L BrightSpace demo · Mar 4, 2026',
  },
  {
    id: 'canvas',
    name: 'Canvas (New Quizzes)',
    category: 'lms',
    categoryLabel: 'LMS competitor',
    color: '#2ec4a0',
    tagline: 'Best UX in class, two-systems trap, no clinical differentiation',
    source: 'Platform strategy sessions · Mar 2026',
    strengths: [
      'Modern UX — the benchmark faculty compare everything against',
      'Shareable item banks in New Quizzes (not locked to course)',
      'WCAG 2.1 AA certified',
      'Alt text required on image upload',
      'LTI integration ecosystem',
    ],
    weaknesses: [
      '"Two systems" trap: Classic Quizzes ≠ New Quizzes — professors must migrate manually',
      'Browser-based zoom blocked by LockDown browser',
      'No clinical education differentiation, no accreditation vocabulary',
      'No accommodation profile system — group sections only',
      'No lockdown-safe accessibility tools',
    ],
    exxatWins: [
      'Clinical-specific IA that Canvas will never build (not their market)',
      'Built-in accessibility within lockdown',
      'Accommodation profiles vs Canvas group sections only',
      'No migration nightmare — flat tagging from day one, no Classic vs New problem',
    ],
  },
  {
    id: 'core',
    name: 'CORE Elsevier',
    category: 'direct',
    categoryLabel: 'Direct competitor',
    color: '#6d5ed4',
    tagline: 'Domain language navigation, 23 modules, preceptor-centric model',
    source: 'Day 2 — Enflux and CORE review · Feb 27, 2026',
    strengths: [
      'Uses natural domain language: "preceptor evaluations" not "FaaS forms"',
      '23 active modules covering the full clinical education lifecycle',
      'More intuitive navigation than Exxat — users understand it immediately',
      'Preceptor-based model designed for clinical site users',
    ],
    weaknesses: [
      'No AI-first approach',
      'Less clinical placement depth than Exxat ExactOne',
      'No exam management module',
    ],
    exxatWins: [
      'Lesson: Rename FaaS surfaces to domain language — "Compliance requirements" not "FaaS forms"',
      'Deeper placement data via ExactOne',
      'AI-first architecture CORE cannot match',
    ],
    keyQuote: 'CORE users understand "preceptor evaluations" immediately. Nobody understands what "FaaS forms" means.',
    keyQuoteSource: 'Day 2 — Enflux and CORE review · Feb 27, 2026',
  },
  {
    id: 'surveymonkey',
    name: 'SurveyMonkey / Qualtrics',
    category: 'indirect',
    categoryLabel: 'Indirect — FaaS / Course Eval',
    color: '#4caf7d',
    tagline: 'Self-service baseline faculty expect from any form builder',
    source: 'Touro session + synthesized · Mar 2026',
    strengths: [
      'Zero-friction self-service form creation — the mental model faculty bring',
      'Qualtrics: advanced survey analysis, theme extraction, reporting',
      'Touro uses Qualtrics for 7 survey types instead of Exxat eval',
      '~$5K/yr standalone — price competitive with module add-ons',
    ],
    weaknesses: [
      'No clinical education context — generic survey tools',
      'No accreditation mapping, no ARC-PA/CAPTE vocabulary',
      'Data in separate silos from placement and exam data',
      'No AI theme extraction built-in (users manually paste into ChatGPT)',
    ],
    exxatWins: [
      'Integration moat: one platform for surveys + placements + exams + competencies',
      'Accreditation-ready reports automatic vs 20+ hours manual compilation',
      'AI theme extraction inside Exxat vs ChatGPT workaround',
    ],
    keyQuote: 'I paste all the open-ended responses into ChatGPT and ask it to extract themes. It saves hours and hours every cycle.',
    keyQuoteSource: 'Ed Razenbach · Feb 26, 2026',
  },
  {
    id: 'typhon',
    name: 'Typhon / CompetencyAI',
    category: 'indirect',
    categoryLabel: 'Indirect — Skills Checklist',
    color: '#e8604a',
    tagline: 'Skills checklist head-to-head — timeline risk in Q3–Q4',
    source: 'Day 4 Marriott — Skills and LC · Mar 5, 2026',
    strengths: [
      'Established skills tracking in PA and nursing programs',
      'Typhon has deep clinical hours tracking',
      'CompetencyAI specifically targeting the same gap Exxat is building',
    ],
    weaknesses: [
      'No placement integration — standalone skills only',
      'No AI-first approach',
      'No exam management, no FaaS — siloed tool',
    ],
    exxatWins: [
      'Full lifecycle context: placement + skills + exam in one platform',
      'Accelerate Cohere prototype — demo at August locks early adopters before Typhon capitalises',
      'AI graduation readiness predictor Typhon cannot match',
    ],
  },
];

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'direct', label: 'Direct' },
  { id: 'lms', label: 'LMS' },
  { id: 'indirect', label: 'Indirect' },
];

export function CompetitiveView() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<CompetitorId | null>('examsoft');
  const [activeSection, setActiveSection] = useState<'weaknesses' | 'strengths' | 'exxat'>('weaknesses');

  const filtered = activeFilter === 'all'
    ? COMPETITORS
    : COMPETITORS.filter(c => c.category === activeFilter);

  const expanded = COMPETITORS.find(c => c.id === expandedId);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 24px 48px' }}>

        <p className="eyebrow mb-2">Competitive analysis</p>
        <h1 className="serif text-[22px] font-medium mb-1" style={{ color: 'var(--text)' }}>
          7 competitors · sourced from 114 Granola sessions
        </h1>
        <p className="text-[13px] mb-6" style={{ color: 'var(--text3)' }}>
          Every entry is grounded in real stakeholder sessions, demos, and product comparisons. Click a competitor to expand.
        </p>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {CATEGORY_FILTERS.map(f => (
            <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{
              padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer',
              fontWeight: activeFilter === f.id ? 600 : 400, transition: 'all .15s',
              border: `1px solid ${activeFilter === f.id ? '#6d5ed4' : 'var(--border)'}`,
              background: activeFilter === f.id ? 'rgba(109,94,212,0.08)' : 'var(--bg2)',
              color: activeFilter === f.id ? '#6d5ed4' : 'var(--text2)',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Two-panel layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16, alignItems: 'start' }}>

          {/* Left: competitor list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {filtered.map(c => (
              <button key={c.id} onClick={() => setExpandedId(c.id)}
                style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 'var(--radius)',
                  border: `1px solid ${expandedId === c.id ? c.color : 'var(--border)'}`,
                  background: expandedId === c.id ? `${c.color}10` : 'var(--bg2)',
                  cursor: 'pointer', transition: 'all .15s',
                }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: expandedId === c.id ? c.color : 'var(--text)', marginBottom: 2 }}>
                  {c.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>{c.categoryLabel}</div>
                {c.satisfaction && (
                  <div style={{ fontSize: 10, color: '#e8604a', marginTop: 3, fontWeight: 600 }}>
                    Satisfaction {c.satisfaction}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Right: expanded detail */}
          {expanded && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{
                padding: '18px 22px', borderBottom: '1px solid var(--border)',
                background: `${expanded.color}08`,
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{expanded.name}</h2>
                      <span style={{
                        fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em',
                        padding: '2px 8px', borderRadius: 10,
                        background: `${expanded.color}18`, color: expanded.color,
                      }}>{expanded.categoryLabel}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text2)' }}>{expanded.tagline}</p>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {expanded.satisfaction && (
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#e8604a' }}>{expanded.satisfaction}</div>
                    )}
                    {expanded.satisfaction && (
                      <div style={{ fontSize: 10, color: 'var(--text3)' }}>user satisfaction</div>
                    )}
                    {expanded.revenue && (
                      <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>{expanded.revenue} revenue</div>
                    )}
                  </div>
                </div>

                {/* Key quote */}
                {expanded.keyQuote && (
                  <div className="pull-quote" style={{ marginTop: 12, marginBottom: 0 }}>
                    "{expanded.keyQuote}"
                    <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4, fontStyle: 'normal' }}>
                      — {expanded.keyQuoteSource}
                    </div>
                  </div>
                )}
              </div>

              {/* Section tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 22px' }}>
                {([
                  { id: 'weaknesses', label: 'Weaknesses' },
                  { id: 'strengths', label: 'Strengths' },
                  { id: 'exxat', label: 'Where Exxat wins' },
                ] as const).map(tab => (
                  <button key={tab.id} onClick={() => setActiveSection(tab.id)} style={{
                    padding: '10px 14px', fontSize: 12, cursor: 'pointer',
                    fontWeight: activeSection === tab.id ? 600 : 400,
                    borderBottom: `2px solid ${activeSection === tab.id ? expanded.color : 'transparent'}`,
                    color: activeSection === tab.id ? expanded.color : 'var(--text2)',
                    background: 'transparent', border: 'none',
                    borderBottom: `2px solid ${activeSection === tab.id ? expanded.color : 'transparent'}`,
                    transition: 'all .15s',
                  }}>{tab.label}</button>
                ))}
              </div>

              {/* Section content */}
              <div style={{ padding: '16px 22px' }}>
                {activeSection === 'weaknesses' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {expanded.weaknesses.map((w, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: '#e8604a', flexShrink: 0, fontWeight: 700, fontSize: 12, marginTop: 1 }}>✕</span>
                        <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{w}</span>
                      </div>
                    ))}
                    {expanded.retentionAnchors && (
                      <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(232,96,74,0.06)', borderRadius: 8, border: '1px solid rgba(232,96,74,0.15)' }}>
                        <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#e8604a', marginBottom: 8 }}>
                          Retention anchors — why clients stay despite bad UX
                        </p>
                        {expanded.retentionAnchors.map((r, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 5 }}>
                            <span style={{ color: '#e8604a', flexShrink: 0, fontSize: 12, marginTop: 1 }}>⚓</span>
                            <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'strengths' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {expanded.strengths.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: expanded.color, flexShrink: 0, fontWeight: 700, fontSize: 12, marginTop: 1 }}>+</span>
                        <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{s}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeSection === 'exxat' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {expanded.exxatWins.map((w, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: '#2ec4a0', flexShrink: 0, fontWeight: 700, fontSize: 12, marginTop: 1 }}>→</span>
                        <span style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{w}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Source footer */}
              <div style={{
                padding: '10px 22px', borderTop: '1px solid var(--border)',
                fontSize: 10, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace',
              }}>
                Source: {expanded.source}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
