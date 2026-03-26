import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';

const PRODUCT_ID = 'learning-contracts';
type TabId = 'insights' | 'workflows' | 'stories';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights', label: 'Insights' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'stories', label: 'UX stories' },
];

export function LearningContractsView() {
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
            <AIStrip text="Learning Contracts is the lowest-signal product. Primary data: Day 4 Marriott meeting (Mar 5). Key insight: Learning Contracts are used for remediation planning and academic improvement agreements — not just rotation objectives. They require three-way sign-off and version history." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Signal density" value="Low" delta="Needs dedicated session" deltaPositive={false} />
              <MetricCard label="Sign-off parties" value="3" delta="Student · Supervisor · DCE" />
              <MetricCard label="Version requirement" value="High" delta="Each update must preserve history" />
            </div>
            <Card>
              <CardTitle sub="What we know — Day 4 Marriott">Learning Contracts context</CardTitle>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Learning Contracts serve two distinct purposes: (1) Rotation learning objectives — student and supervisor agree on what the student will learn during a rotation. These are relatively standardized. (2) Academic improvement agreements — student who failed a course or rotation agrees to a remediation plan. These are highly variable per student situation. Both require student signature, supervisor or faculty signature, and DCE review. Version history is legally important — programs must show what was agreed and when.
              </div>
            </Card>
            <Card>
              <CardTitle sub="Lowest confidence product — needs stakeholder sessions">Signal gaps</CardTitle>
              {['No dedicated Learning Contracts stakeholder session yet. Only Day 4 Marriott general overview.',
                'Key unknown: how do programs currently handle remediation contracts — mostly paper?',
                'Key unknown: what triggers a Learning Contract — any rotation failure, or only certain thresholds?',
                'Key unknown: how does the SCCE interact with Learning Contracts vs Skills Checklist — overlap unclear.',
                'Recommend: one DCE interview specifically about remediation workflows and Learning Contract lifecycle.',
              ].map((gap, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: '#F59E0B', flexShrink: 0, fontWeight: 700 }}>?</span>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{gap}</p>
                </div>
              ))}
            </Card>
            {insights.slice(0, 3).map((ins, i) => <InsightRow key={i} insight={ins} />)}
          </div>
        )}
        {tab === 'workflows' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Learning Contract workflows from Day 4 Marriott. Two distinct contract types." />
            {[
              { title: 'Rotation learning contract', steps: ['Student proposes learning objectives for the rotation', 'Supervisor reviews and modifies objectives', 'Both parties sign', 'Mid-rotation check-in against objectives', 'End-of-rotation: assess achievement'] },
              { title: 'Academic improvement / remediation contract', steps: ['Program identifies at-risk student (failed course, EOR, or academic warning)', 'DCE or faculty drafts remediation plan with specific action items and timeline', 'Student signs acknowledging the plan', 'Progress documented at check-in dates', 'Contract closed when conditions met or escalated if not'] },
            ].map((w, i) => (
              <Card key={i}>
                <CardTitle>{w.title}</CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {w.steps.map((s, si) => (
                    <div key={si} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--surface-secondary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', flexShrink: 0 }}>{si + 1}</span>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Learning Contracts stories — low confidence, needs more session data before building." />
            {[
              { id: 'LC-01', who: 'Student', what: 'Electronically sign my learning contract and see what I agreed to at any time', why: 'Currently paper-based. Students lose their copy. No record of original objectives.' },
              { id: 'LC-02', who: 'DCE', what: 'Create a remediation contract from a template with the student\'s specific failed areas pre-filled', why: 'Remediation contracts are customized per student situation. Starting from a template reduces time while ensuring required fields are present.' },
              { id: 'LC-03', who: 'DCE', what: 'See the full audit trail of a student\'s Learning Contract history — all versions, all signatures, all amendments', why: 'Accreditation site visitors may ask for evidence of remediation. Audit trail is the defense.' },
              { id: 'LC-04', who: 'Supervisor', what: 'Receive a mobile notification when a student submits their rotation learning objectives for my review', why: 'Supervisors are in clinical settings. Desktop-only notification means delays. Mobile notification ensures timely sign-off.' },
            ].map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', background: 'rgba(227,28,121,0.08)', padding: '2px 6px', borderRadius: 4, flexShrink: 0 }}>{s.id}</span>
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
