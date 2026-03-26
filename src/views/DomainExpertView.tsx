import { useState } from 'react';

// ─── Domain Expert Breakdown View ──────────────────────────────────────────
// Breaks down Aarti, Kunal, Vishaka, and David's signals into:
//   Layer 1: Terminology decisions (shapes UI copy)
//   Layer 2: Workflow logic (shapes interaction flows)
//   Layer 3: Quality standards (shapes acceptance criteria)
//   Layer 4: Competitive positioning (shapes what to build next)
// Each signal links to: source session, confidence level, and Magic Patterns impact.

interface ExpertSignal {
  id: string; layer: 1 | 2 | 3 | 4; signal: string; verbatim?: string;
  source: string; date: string; confidence: 'high' | 'medium';
  mpImpact: string; product: string; status: 'built' | 'in-progress' | 'pending';
}

interface Expert {
  id: string; name: string; role: string; product: string;
  accentColor: string; tagline: string;
  layers: { id: 1|2|3|4; label: string; icon: string; desc: string }[];
  signals: ExpertSignal[];
}

const EXPERTS: Expert[] = [
  {
    id: 'aarti', name: 'Aarti', role: 'CEO', product: 'All products', accentColor: '#e8604a',
    tagline: 'Every release must be accessible from day one. Non-negotiable.',
    layers: [
      { id: 1, label: 'Legal mandates', icon: '⚖️', desc: 'ADA Title II. Hard dates. Non-negotiable scope.' },
      { id: 2, label: 'UX principles', icon: '🎯', desc: 'Empathy over metrics. AI as invisible assistant.' },
      { id: 3, label: 'Quality bar', icon: '✅', desc: 'WCAG 2.1 AA minimum. No exceptions at launch.' },
      { id: 4, label: 'Product strategy', icon: '🔮', desc: 'Tagging = analytics engine. FaaS linear wizard.' },
    ],
    signals: [
      { id: 'a1', layer: 1, signal: 'ADA Title II hard legal deadline: April 24, 2026', verbatim: '"Title Two is going into law on April 24. Anything we release has to be accessible from day one."', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'ACR/VPAT panel built into PublishPhase. Accessibility publish gate with blockers.', product: 'exam-management', status: 'built' },
      { id: 'a2', layer: 3, signal: 'Do not reduce accessibility scope', verbatim: '"Don\'t reduce scope from day one. Let\'s make sure that we are doing a proper job."', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'Alt text = publish gate blocker. 2 critical items must be fixed before any exam can publish.', product: 'exam-management', status: 'built' },
      { id: 'a3', layer: 4, signal: 'Tagging = post-exam competency analytics engine', verbatim: '"After you finish the test it can tell you: strong in logic, weak in analytical. That\'s what the tagging does."', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'Competency tab in PostExamPhase maps tagged questions to PAEA areas.', product: 'exam-management', status: 'built' },
      { id: 'a4', layer: 2, signal: 'FaaS 3-pane builder is inaccessible', verbatim: '"Usually a three tab like this is very difficult to make accessible. Most competitors have similar layout. But they are not accessible."', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'FaaS redesign must use linear wizard, not 3-pane split.', product: 'faas', status: 'pending' },
      { id: 'a5', layer: 2, signal: 'AI everywhere on admin side, never on student exam side', source: '791334af', date: 'Mar 24', confidence: 'high', mpImpact: 'AI features only in admin editor. Student exam view is clean and unassisted.', product: 'exam-management', status: 'built' },
    ],
  },
  {
    id: 'kunal', name: 'Kunal', role: 'COO', product: 'Exam Management (UX)', accentColor: '#6d5ed4',
    tagline: 'The product makes intelligent decisions — so the student never has to think about the interface.',
    layers: [
      { id: 1, label: 'Interaction decisions', icon: '🖱️', desc: 'Submit behavior, flag model, progress logic.' },
      { id: 2, label: 'Screen containment', icon: '📺', desc: 'No product chrome in exam window.' },
      { id: 3, label: 'Confidence signals', icon: '📊', desc: 'What the student sees vs what the admin knows.' },
      { id: 4, label: 'Navigation model', icon: '🗺️', desc: 'Section lock behavior, free vs GRE-style.' },
    ],
    signals: [
      { id: 'k1', layer: 1, signal: 'Submit button: faded until last Q or last 5 minutes, then primary CTA', verbatim: '"Submit should be visible but faded — and becomes the primary CTA in the last 5 minutes or last question."', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'Student exam view: submit faded until threshold, then transforms to primary CTA.', product: 'exam-management', status: 'in-progress' },
      { id: 'k2', layer: 1, signal: 'Flag system: 2×2 matrix (answered/unanswered × flagged/unflagged)', verbatim: '"Not three buckets. It\'s a 2x2 — four states from two dimensions."', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'Question navigator uses four distinct visual states, not three.', product: 'exam-management', status: 'in-progress' },
      { id: 'k3', layer: 2, signal: 'No product chrome in exam window — new browser window, full screen', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'Student exam launches in new clean window. No Exxat sidebar, no topbar.', product: 'exam-management', status: 'built' },
      { id: 'k4', layer: 1, signal: 'Progress bar = questions answered, not question number', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'Progress bar in exam view shows answered count, not current position.', product: 'exam-management', status: 'in-progress' },
      { id: 'k5', layer: 4, signal: 'Section lock: free navigation vs GRE-style locked (cannot return)', verbatim: '"Some programs want GRE-style — once you submit section A, you cannot go back."', source: 'f29a990d', date: 'Mar 20', confidence: 'high', mpImpact: 'Section lock toggle per section in BuildPhase. Red/green indicator on section header.', product: 'exam-management', status: 'built' },
    ],
  },
  {
    id: 'vishaka', name: 'Vishaka', role: 'VP Product / Daily Authority', product: 'Exam Management', accentColor: '#0d9488',
    tagline: 'Flat pool, smart views, online approval — the architecture that makes ExamSoft obsolete.',
    layers: [
      { id: 1, label: 'Terminology (shapes UI copy)', icon: '📝', desc: 'CATEGORIES vs TAGS. DRAFT vs PRIVATE. Smart Views. These words appear in the UI.' },
      { id: 2, label: 'Workflow logic (shapes flows)', icon: '⚡', desc: 'QB landing. Online approval. Optional FK. Smart View types.' },
      { id: 3, label: 'Architecture decisions', icon: '🏗️', desc: 'Flat pool. Course = parent. No folder hierarchy.' },
      { id: 4, label: 'Competitive positioning', icon: '⚔️', desc: 'ExamSoft anti-AI. Curriculum mapping gap to close. Industry firsts.' },
    ],
    signals: [
      { id: 'v1', layer: 1, signal: 'CATEGORIES = school-defined, mandatory, admin-set. TAGS = personal, optional, faculty-owned.', verbatim: '"Categories are defined by the school. Tags are personal. They look similar but they mean different things."', source: '6fdcd0dd', date: 'Mar 26', confidence: 'high', mpImpact: 'QuestionEditor sidebar: amber shield "Categories" section + grey tag "Tags" section. Different icons, different behaviors.', product: 'exam-management', status: 'built' },
      { id: 'v2', layer: 1, signal: 'DRAFT = incomplete WIP. PRIVATE = complete but intentionally restricted.', verbatim: '"DRAFT means I haven\'t finished. PRIVATE means I finished but only I can see it. They are not the same state."', source: '6fdcd0dd', date: 'Mar 26', confidence: 'high', mpImpact: 'QuestionEditor: two distinct state pills with different icons, colors, banners, and capability gates.', product: 'exam-management', status: 'built' },
      { id: 'v3', layer: 2, signal: 'QB landing = assessment builder mode front and center', verbatim: '"When a faculty opens the question bank, they should see the assessment builder immediately. That is their job."', source: 'f59ac2a6', date: 'Mar 12', confidence: 'high', mpImpact: 'QuestionBankFull: Build/Browse mode toggle, default to Build (assessment creation) not Browse.', product: 'exam-management', status: 'built' },
      { id: 'v4', layer: 3, signal: 'Flat pool + Smart Views. Never folder hierarchy.', verbatim: '"Smart Views are like Zendesk ticket views. The pool is flat. Views are just filters over that pool."', source: '8c94698f', date: 'Mar 4', confidence: 'high', mpImpact: 'QB sidebar: School Smart Views (admin-created) + My Smart Views (personal). No folder tree.', product: 'exam-management', status: 'built' },
      { id: 'v5', layer: 2, signal: 'Course assignment is optional — no forced FK. Milestone exams are course-free.', source: '6fdcd0dd', date: 'Mar 26', confidence: 'high', mpImpact: 'Exam creation: course field is optional. System does not require a course to create or publish an exam.', product: 'exam-management', status: 'built' },
      { id: 'v6', layer: 4, signal: 'ExamSoft anti-AI = Exxat\'s open door', verbatim: '"ExamSoft says they will never use AI. That\'s amazing from our point of view."', source: '791334af', date: 'Mar 24', confidence: 'high', mpImpact: 'Every AI feature in admin is a direct ExamSoft gap. AI generate panel, blueprint assembly, AI remediation.', product: 'exam-management', status: 'built' },
      { id: 'v7', layer: 2, signal: 'Online approval workflow replaces offline email — industry first', source: '8c94698f', date: 'Mar 4', confidence: 'high', mpImpact: 'ReviewQueue component: approve/reject/revise with inline comment. Full status lifecycle tied to review.', product: 'exam-management', status: 'built' },
    ],
  },
  {
    id: 'david', name: 'David Stocker', role: 'Faculty User (Touro)', product: 'Exam Management', accentColor: '#d97706',
    tagline: 'Real faculty voice. Not a PM opinion — a user\'s specific ask, in his exact words.',
    layers: [
      { id: 1, label: 'Dashboard needs (asked for directly)', icon: '📊', desc: 'Visualization over tables. Difficulty distribution. His words drove specific chart choices.' },
      { id: 2, label: 'Analytics context (asked for directly)', icon: '🔍', desc: 'Per-cohort filtering. Semester comparison. Not inferred — explicitly requested.' },
      { id: 3, label: 'Mental model (observed from usage)', icon: '🧠', desc: 'How he thinks about questions, cohorts, and performance over time.' },
      { id: 4, label: 'Pain with ExamSoft (comparative)', icon: '⚠️', desc: 'What ExamSoft does that causes friction. Direct competitive signal.' },
    ],
    signals: [
      { id: 'd1', layer: 1, signal: 'Difficulty distribution visualization — confirmed direct request', verbatim: '"This is very much a database feel. I think it\'d be great to have some sort of visualization — X percentage of my questions are hard, X percentage are easy."', source: 'f59ac2a6', date: 'Mar 12', confidence: 'high', mpImpact: 'QuestionBankFull: difficulty distribution bar with Easy/Medium/Hard percentages on the QB header.', product: 'exam-management', status: 'built' },
      { id: 'd2', layer: 2, signal: 'Per-cohort performance filtering on question analytics — confirmed direct request', verbatim: '"Is this percentage correct across every time the question has been used? Can I filter that by semester or course offering?"', source: 'f59ac2a6', date: 'Mar 12', confidence: 'high', mpImpact: 'PostExamPhase: cohort filter on competency view. Question analytics by cohort, not just aggregate.', product: 'exam-management', status: 'in-progress' },
      { id: 'd3', layer: 2, signal: 'Year-over-year comparison for same course', source: 'f59ac2a6', date: 'Mar 12', confidence: 'medium', mpImpact: 'Cohort trends tab in PostExamPhase: grouped bar chart comparing same course across years.', product: 'exam-management', status: 'built' },
      { id: 'd4', layer: 3, signal: 'Mental model: questions are reusable assets, not course-specific documents', source: 'f59ac2a6', date: 'Mar 12', confidence: 'high', mpImpact: 'This validates the flat pool + Smart Views architecture. David naturally thinks cross-cohort.', product: 'exam-management', status: 'built' },
      { id: 'd5', layer: 4, signal: 'ExamSoft\'s "monster grid" = primary frustration with current system', source: 'f5d66e4c', date: 'Mar 11', confidence: 'high', mpImpact: 'Every QB table in our system is list-based, not grid-based. Search-first not browse-first.', product: 'exam-management', status: 'built' },
    ],
  },
];

const LAYER_COLORS = { 1: '#6d5ed4', 2: '#0d9488', 3: '#e8604a', 4: '#d97706' };
const STATUS_COLORS = { built: '#16a34a', 'in-progress': '#d97706', pending: '#94a3b8' };

export function DomainExpertView() {
  const [activeExpert, setActiveExpert] = useState<string>('vishaka');
  const [activeLayer, setActiveLayer] = useState<1|2|3|4|null>(null);
  const [selectedSignal, setSelectedSignal] = useState<ExpertSignal | null>(null);

  const expert = EXPERTS.find(e => e.id === activeExpert)!;
  const filteredSignals = activeLayer
    ? expert.signals.filter(s => s.layer === activeLayer)
    : expert.signals;

  const layerCounts = expert.layers.map(l => ({
    ...l, count: expert.signals.filter(s => s.layer === l.id).length,
  }));

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif', background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px', fontFamily: 'DM Serif Display, Georgia, serif' }}>
          Domain Expert Intelligence
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0 }}>
          Aarti, Kunal, Vishaka, and David — broken into layers so you know exactly what to build before it goes to Magic Patterns.
        </p>
      </div>

      {/* Expert selector */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {EXPERTS.map(e => (
          <button key={e.id} onClick={() => { setActiveExpert(e.id); setActiveLayer(null); setSelectedSignal(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 10, border: `2px solid ${activeExpert === e.id ? e.accentColor : 'var(--border)'}`, background: activeExpert === e.id ? `${e.accentColor}0d` : '#fff', cursor: 'pointer' }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: e.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {e.name.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: activeExpert === e.id ? e.accentColor : 'var(--text)' }}>{e.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)' }}>{e.role}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Expert header */}
      <div style={{ padding: '16px 20px', borderRadius: 12, background: `${expert.accentColor}08`, border: `1px solid ${expert.accentColor}25`, marginBottom: 20, display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: expert.accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
          {expert.name.slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'DM Serif Display, Georgia, serif' }}>{expert.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text3)' }}>{expert.role} · {expert.product}</div>
          </div>
          <div style={{ fontSize: 14, fontStyle: 'italic', color: expert.accentColor, fontFamily: 'DM Serif Display, Georgia, serif', lineHeight: 1.5, borderLeft: `3px solid ${expert.accentColor}`, paddingLeft: 12 }}>
            "{expert.tagline}"
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: expert.accentColor, fontFamily: 'JetBrains Mono, monospace' }}>{expert.signals.length}</div>
          <div style={{ fontSize: 10, color: 'var(--text3)' }}>confirmed signals</div>
        </div>
      </div>

      {/* Layer selector — radial visual */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button onClick={() => setActiveLayer(null)}
          style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${!activeLayer ? expert.accentColor : 'var(--border)'}`, background: !activeLayer ? `${expert.accentColor}12` : '#fff', color: !activeLayer ? expert.accentColor : 'var(--text3)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          All layers
        </button>
        {layerCounts.map(l => (
          <button key={l.id} onClick={() => setActiveLayer(prev => prev === l.id ? null : l.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: `1px solid ${activeLayer === l.id ? LAYER_COLORS[l.id] : 'var(--border)'}`, background: activeLayer === l.id ? `${LAYER_COLORS[l.id]}12` : '#fff', color: activeLayer === l.id ? LAYER_COLORS[l.id] : 'var(--text3)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
            <span>{l.icon}</span>
            <span>Layer {l.id}: {l.label}</span>
            <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', opacity: 0.7 }}>({l.count})</span>
          </button>
        ))}
      </div>

      {/* Layer description */}
      {activeLayer && (
        <div style={{ padding: '10px 14px', borderRadius: 9, background: `${LAYER_COLORS[activeLayer]}08`, border: `1px solid ${LAYER_COLORS[activeLayer]}20`, marginBottom: 16, fontSize: 13, color: 'var(--text2)' }}>
          {expert.layers.find(l => l.id === activeLayer)?.desc}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16 }}>
        {/* Signal cards */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filteredSignals.map(signal => (
            <div key={signal.id}
              onClick={() => setSelectedSignal(prev => prev?.id === signal.id ? null : signal)}
              style={{ padding: '14px 16px', borderRadius: 10, background: '#fff', border: `1.5px solid ${selectedSignal?.id === signal.id ? expert.accentColor : 'var(--border)'}`, cursor: 'pointer', transition: 'border-color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = expert.accentColor}
              onMouseLeave={e => e.currentTarget.style.borderColor = selectedSignal?.id === signal.id ? expert.accentColor : 'var(--border)'}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {/* Layer indicator */}
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${LAYER_COLORS[signal.layer]}15`, border: `1.5px solid ${LAYER_COLORS[signal.layer]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 800, color: LAYER_COLORS[signal.layer], fontFamily: 'JetBrains Mono, monospace' }}>L{signal.layer}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4, marginBottom: 4 }}>{signal.signal}</div>
                  {signal.verbatim && (
                    <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text2)', fontFamily: 'DM Serif Display, Georgia, serif', borderLeft: `2px solid ${expert.accentColor}60`, paddingLeft: 8, marginBottom: 6, lineHeight: 1.5 }}>
                      {signal.verbatim}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)' }}>
                      Session {signal.source.slice(0, 8)} · {signal.date}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8, background: `${STATUS_COLORS[signal.status]}12`, color: STATUS_COLORS[signal.status] }}>
                      {signal.status}
                    </span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8, background: `${signal.confidence === 'high' ? '#16a34a' : '#d97706'}12`, color: signal.confidence === 'high' ? '#16a34a' : '#d97706' }}>
                      {signal.confidence} confidence
                    </span>
                  </div>
                </div>
              </div>
              {/* Magic Patterns impact */}
              {selectedSignal?.id === signal.id && (
                <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    Magic Patterns impact
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{signal.mpImpact}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Status summary */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: '#fff', padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Build status</div>
            {(['built', 'in-progress', 'pending'] as const).map(status => {
              const count = expert.signals.filter(s => s.status === status).length;
              const pct = Math.round((count / expert.signals.length) * 100);
              return (
                <div key={status} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: STATUS_COLORS[status], fontWeight: 600, textTransform: 'capitalize' }}>{status.replace('-', ' ')}</span>
                    <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)' }}>{count}/{expert.signals.length}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'var(--bg3)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: STATUS_COLORS[status], borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Layer breakdown */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, background: '#fff', padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Signal layers</div>
            {layerCounts.map(l => (
              <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, cursor: 'pointer' }}
                onClick={() => setActiveLayer(prev => prev === l.id ? null : l.id)}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: LAYER_COLORS[l.id], flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 500 }}>L{l.id}: {l.label}</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>{l.desc.slice(0, 40)}…</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: LAYER_COLORS[l.id] }}>{l.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
