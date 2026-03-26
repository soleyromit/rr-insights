import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';

const PRODUCT_ID = 'learning-contracts';
type TabId = 'insights' | 'workflows' | 'social-work' | 'stories';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights', label: 'Insights' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'social-work', label: 'Social work model' },
  { id: 'stories', label: 'UX stories' },
];

const tabStyle = (tab: TabId, id: TabId) => ({
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

export function LearningContractsView() {
  const [tab, setTab] = useState<TabId>('insights');
  const insights = getInsightsByProduct(PRODUCT_ID);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0 }}>
        {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(tab, t.id)}>{t.label}</button>)}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {tab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Learning Contracts primary source: Day 4 Marriott (Mar 5) — social work integration is the most detailed model. Two distinct contract types: rotation learning objectives and academic remediation. Vaibhav FaaS review (Feb 27) — prior failed attempt to merge learning contracts with evaluations." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Contract types" value="2" delta="Rotation objectives · Remediation plan" />
              <MetricCard label="Sign-off parties" value="3" delta="Student · Supervisor · DCE/Faculty" />
              <MetricCard label="Critical insight" value="Keep separate" delta="Prior attempt to merge with evals failed" deltaPositive={false} />
            </div>
            <Card>
              <CardTitle sub="Vaibhav Feb 27 — critical architecture lesson">Why prior Learning Contract + Evaluation merge failed</CardTitle>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                A previous version of the product attempted to merge learning contracts into the evaluation form. This was reverted. Reason: the planning document (contract) and the assessment document (evaluation) serve different purposes at different times. The correct approach: keep them as separate entities, but show them side-by-side during evaluation. The evaluation references the contract — it does not replace it.
              </p>
            </Card>
            <Card>
              <CardTitle sub="Most complex use case — requires dedicated design attention">Social work: the hardest Learning Contract model</CardTitle>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.6 }}>
                Social work programs run 6–12 month placements across multiple sites, sometimes spanning multiple semesters. A single learning contract covers the full placement. Preceptors change during the placement. The contract must remain continuous even as evaluators change. 9 EPAS competency areas × 5 sub-areas = 45 trackable items. Midterm + final evaluation both reference the same contract.
              </p>
            </Card>
            {insights.slice(0, 4).map((ins, i) => <InsightRow key={i} insight={ins} />)}
          </div>
        )}

        {tab === 'workflows' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Two contract workflows — both from Day 4 Marriott (Mar 5). Rotation contracts are relatively standardized. Remediation contracts are highly variable per student situation." />
            {[
              {
                title: 'Rotation learning contract',
                who: 'All disciplines with structured placements',
                steps: [
                  'Student proposes learning objectives for the rotation (drawn from program competency framework)',
                  'Supervisor reviews and may modify objectives based on site capabilities',
                  'Both parties sign electronically — contract is now live',
                  'Mid-rotation check-in: student and supervisor assess progress informally',
                  'Evaluation form opens — shows contract commitments alongside rating scales',
                  'End-of-rotation: both parties sign off on achievement of objectives',
                  'Contract archived to student program record — available for accreditation review',
                ],
              },
              {
                title: 'Academic improvement / remediation contract',
                who: 'Any student who failed a course, EOR exam, or rotation',
                steps: [
                  'Program identifies at-risk student (failed course, EOR below threshold, rotation fail)',
                  'DCE or faculty drafts remediation plan: specific action items, timeline, checkpoints',
                  'Student signs acknowledging the plan and commitments',
                  'System notifies DCE at each checkpoint date',
                  'Progress documented at check-in dates — notes added to contract record',
                  'Contract closed when all conditions met, or escalated to academic committee if not',
                  'Closed contracts archived. Open contracts visible in DCE dashboard as active concerns.',
                ],
              },
            ].map((w, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <CardTitle>{w.title}</CardTitle>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Used by: {w.who}</div>
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

        {tab === 'social-work' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Social work is the most demanding Learning Contract use case. Day 4 Marriott (Mar 5) documented the full EPAS-aligned model. 9 competencies, 5 sub-areas each, multi-semester placements, dual evaluator roles." />
            <Card>
              <CardTitle sub="EPAS 2022 framework — mandated by CSWE">9 competency areas × 5 sub-areas</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  'Professional identity and conduct',
                  'Ethics and professional behavior',
                  'Anti-racism and social justice',
                  'Engage with research and evidence',
                  'Policy analysis and advocacy',
                  'Engage with individuals, families, groups',
                  'Assessment and diagnostic reasoning',
                  'Intervention planning and delivery',
                  'Evaluation and professional development',
                ].map((c, i) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: 'var(--surface-secondary)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ fontFamily: 'monospace', color: 'var(--brand)', marginRight: 8 }}>{i + 1}</span>{c}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                Each competency has 5 sub-areas: Knowledge · Values · Skills · Cognitive · Affective. Total trackable items: 45 minimum per student per placement.
              </div>
            </Card>
            <Card>
              <CardTitle sub="What makes social work learning contracts uniquely complex">Design requirements specific to social work</CardTitle>
              {[
                { req: 'Multi-semester placement continuity', detail: 'Placements run 6–12 months across multiple semesters. One learning contract covers the entire period. The contract must survive preceptor changes, semester boundaries, and site transitions.' },
                { req: 'Dual evaluator roles', detail: 'Site supervisor provides qualitative comments per competency. Faculty coordinator provides official numeric ratings. Both must be visible in the same view. Permissions differ: supervisor = comment only, faculty = rating + comment.' },
                { req: 'Side-by-side contract + evaluation view', detail: 'Midterm and final evaluations must display the learning contract commitments alongside the rating scales. Evaluator sees what was committed and then rates achievement. Previous version did not have this — Vaibhav flagged it as a failure.' },
                { req: 'Dynamic contract modification', detail: 'Contract can be modified throughout the placement if all parties agree. All versions must be preserved with timestamps and signatures. Not a static document — a living agreement.' },
                { req: 'Integration with competency tracker', detail: 'When a student is assessed on a learning contract competency, the result should feed into the program-level competency tracker. Currently these are separate — a major gap for CSWE accreditation reporting.' },
              ].map((r, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{r.req}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{r.detail}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Learning Contracts user stories. Higher confidence now after Day 4 Marriott social work model." />
            {[
              { id: 'LC-01', who: 'Student', what: 'Electronically sign my learning contract and access the signed version at any time during my placement', why: 'Currently paper-based. Students lose their copy. No record of original commitments. Legal importance for remediation contracts in particular.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'LC-02', who: 'DCE / Faculty', what: 'Create a remediation contract from a template with the failed areas pre-filled from the student record', why: 'Remediation contracts are customized per student situation but follow a consistent structure. Starting from a template with pre-filled context reduces setup time.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'LC-03', who: 'Social Work student', what: 'See my learning contract commitments side-by-side with the evaluation form when my supervisor is assessing me', why: 'The contract defines what success looks like. The evaluation measures it. Forcing the evaluator to remember what was committed without visual reference breaks the connection between planning and assessment.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'LC-04', who: 'Supervisor', what: 'Receive a mobile notification when a student submits learning objectives for my review and sign off with one action', why: 'Supervisors are in clinical settings. Desktop-only workflows mean delays of days. Mobile sign-off in the field is the only path to timely contract activation.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'LC-05', who: 'DCE', what: 'See all open remediation contracts with their checkpoint dates and current status in one dashboard view', why: 'Open remediation contracts represent active academic risk. A student whose remediation checkpoints are missed without intervention may fail to graduate. Visibility enables follow-up.', src: 'Day 4 Marriott · Mar 5' },
              { id: 'LC-06', who: 'Program Director', what: 'Access the complete version history of a student learning contract including all amendments and who signed each version', why: 'Accreditation site visitors may request evidence of remediation processes. Version history is the audit trail. Must be exportable for site visit preparation.', src: 'Day 4 Marriott · Mar 5' },
            ].map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', background: 'rgba(227,28,121,0.08)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>{s.id}</span>
                  <div>
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
