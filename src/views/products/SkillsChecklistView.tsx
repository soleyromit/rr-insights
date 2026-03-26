import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';

const PRODUCT_ID = 'skills-checklist';
type TabId = 'insights' | 'workflows' | 'accreditation' | 'stories';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights', label: 'Insights' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'accreditation', label: 'Accreditation' },
  { id: 'stories', label: 'UX stories' },
];

export function SkillsChecklistView() {
  const [tab, setTab] = useState<TabId>('insights');
  const insights = getInsightsByProduct(PRODUCT_ID);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '10px 18px', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? 'var(--brand)' : 'var(--text-secondary)', borderBottom: `2px solid ${tab === t.id ? 'var(--brand)' : 'transparent'}`, marginBottom: -1, background: 'none', border: 'none', cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
        {tab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Skills Checklist signal: Day 4 Marriott (Skills + Learning Contract, Mar 5). Clinical competency verification required by CAPTE, ACOTE, CCNE. Three-way sign-off: student self-assessment → SCCE verification → DCE review. Low signal density — needs more stakeholder sessions." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Sign-off parties" value="3" delta="Student · SCCE · DCE" />
              <MetricCard label="Accreditation bodies" value="6+" delta="CAPTE, ACOTE, CCNE, ARC-PA, CSWE, CAAHEP" />
              <MetricCard label="Mobile friction" value="High" delta="SCCE primary device is mobile" deltaPositive={false} />
            </div>
            <Card>
              <CardTitle sub="Three-way sign-off flow — Day 4 Marriott meeting">Skills verification workflow</CardTitle>
              {[
                { step: '1', actor: 'Student', action: 'Self-assesses competency level against checklist items', note: 'Often done in field on mobile device' },
                { step: '2', actor: 'SCCE', action: 'Verifies student performance against each item', note: 'SCCE uses mobile — desktop-first design breaks this workflow' },
                { step: '3', actor: 'DCE', action: 'Reviews aggregate competency data across all students in rotation', note: 'Needs program-level view, not per-student drill-down' },
                { step: '4', actor: 'System', action: 'Tracks minimum procedure counts for graduation clearance', note: 'Clinical passport: must complete before graduation. Accreditation audit trail.' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{row.step}</div>
                  <div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                      <Badge variant="default">{row.actor}</Badge>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{row.action}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{row.note}</p>
                  </div>
                </div>
              ))}
            </Card>
            {insights.slice(0, 4).map((ins, i) => <InsightRow key={i} insight={ins} />)}
            <Card>
              <CardTitle sub="Sessions needed to build full signal">Signal gaps — needs more data</CardTitle>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Skills Checklist is low-signal compared to Exam Management and FaaS. Key unknowns: (1) How do programs currently configure competency frameworks — CAPTE vs ACOTE have different taxonomies. (2) How does the SCCE mobile experience break — no user interview with an SCCE yet. (3) What does graduation clearance look like across disciplines. Recommend: one SCCE interview session, one DCE interview session focused on Skills Checklist specifically.
              </div>
            </Card>
          </div>
        )}

        {tab === 'workflows' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Workflows sourced from Day 4 Marriott meeting (Mar 5) and Touro ExamSoft meeting (Mar 11) — summative evaluation discussion." />
            {[
              { title: 'Clinical passport', detail: 'Students must accumulate minimum procedure/encounter counts before graduation clearance. Each count must be signed off by the SCCE at the site. Program sets minimums. System tracks against them. This is a graduation-blocking requirement for CAPTE and ACOTE.' },
              { title: 'Summative OSCE evaluation', detail: 'End of program: multi-station OSCE where faculty observe students performing clinical skills. Each station maps to a specific competency and ARC-PA standard. Must be completed in the last 4 months of the program (ARC-PA requirement). Technical skills, clinical skills, interpersonal skills, professionalism — all assessed.' },
              { title: 'Rotation-level skill verification', detail: 'During each 6-week rotation, SCCE verifies student performed specific procedures (IV placement, suturing, injection). These feed into the clinical passport. Student self-reports first, SCCE confirms.' },
              { title: 'Didactic lab sign-offs', detail: 'Teach-demonstrate-practice-assess. Each semester has PD labs where students get graded. Not the same as clinical skills passport — didactic context. Typically paper-based at most programs.' },
            ].map((w, i) => (
              <Card key={i}>
                <CardTitle>{w.title}</CardTitle>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{w.detail}</p>
              </Card>
            ))}
          </div>
        )}

        {tab === 'accreditation' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Accreditation requirements for clinical competency tracking. Each accreditor has different standard names but the same underlying need: prove students can do the job before they graduate." />
            {[
              { body: 'CAPTE (PT/PTA)', requirement: 'Clinical Performance Instrument (CPI). Students rated on 18 performance criteria across all clinical placements. Must demonstrate at least "entry-level" performance by graduation.', form: 'CPI Web' },
              { body: 'ACOTE (OT)', requirement: 'Fieldwork Performance Evaluation (FWPE). Similar 27-item rating scale. Fieldwork supervisor completes. Program director reviews aggregates.', form: 'FWPE' },
              { body: 'ARC-PA (PA)', requirement: 'End of Rotation exams + OSCE + summative evaluation. Skills mapped to NCCPA content areas. Clinical passport for procedure minimums.', form: 'Program-specific' },
              { body: 'CCNE (Nursing)', requirement: 'Clinical competency verification by faculty and preceptors. Maps to program outcomes and QSEN competencies. Simulation and clinical hours tracked separately.', form: 'Program-specific' },
              { body: 'CSWE (Social Work)', requirement: 'Field placement competency assessments. EPAS 2022 framework. Nine core competencies with 31 practice behaviors. Field supervisor signs off.', form: 'EPAS-aligned' },
            ].map((a, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Badge variant="default">{a.body}</Badge>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Standard form: {a.form}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{a.requirement}</p>
              </Card>
            ))}
          </div>
        )}

        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Skills Checklist user stories. Lower confidence than Exam Management stories — needs more SCCE-specific session." />
            {[
              { id: 'SC-01', who: 'Student', what: 'Log a completed procedure on my mobile device immediately after performing it at the clinical site', why: 'SCCE is busy — logging immediately while memory is fresh is the only reliable workflow. Desktop-first design breaks this.' },
              { id: 'SC-02', who: 'SCCE', what: 'Verify a student\'s procedure log with one tap and my signature, without logging into a full desktop interface', why: 'SCCEs see 5-10 students across multiple programs. Low-friction mobile verification is the only path to compliance.' },
              { id: 'SC-03', who: 'DCE', what: 'See which students in my program are at risk of not meeting minimum procedure counts before graduation', why: 'Graduation clearance requires minimum counts. Early warning = early intervention before it is too late.' },
              { id: 'SC-04', who: 'Program Director', what: 'Generate a competency completion report per CAPTE/ACOTE standard for accreditation self-study', why: 'Accreditation reviewers require evidence that all graduates met clinical competency standards. Manual compilation takes days.' },
            ].map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', background: 'rgba(227,28,121,0.08)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>{s.id}</span>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>As a</strong> {s.who}, <strong>I need to</strong> {s.what}, <strong>so that</strong> {s.why}.
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
