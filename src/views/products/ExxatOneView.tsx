import { useState } from 'react';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, FunnelChart, Funnel, LabelList,
} from 'recharts';

type TabId = 'insights' | 'student' | 'school' | 'revenue' | 'stories';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights',  label: 'Insights' },
  { id: 'student',   label: 'Student view' },
  { id: 'school',    label: 'School view' },
  { id: 'revenue',   label: 'Revenue model' },
  { id: 'stories',   label: 'UX stories' },
];

const tabStyle = (tab: TabId, id: TabId) => ({
  padding: '10px 18px', fontSize: 13,
  fontWeight: tab === id ? 600 : 400,
  color: tab === id ? 'var(--brand)' : 'var(--text-secondary)',
  borderBottom: `2px solid ${tab === id ? 'var(--brand)' : 'transparent'}`,
  marginBottom: -1, background: 'none', border: 'none',
  cursor: 'pointer', whiteSpace: 'nowrap' as const,
});

const pipelineStages = [
  { stage: 'Plan', actions: ['Define rotation requirements', 'Set site criteria', 'Schedule capacity'], owner: 'School Admin', status: 'Existing' },
  { stage: 'Place', actions: ['Post availability', 'Student wish list', 'Match + confirm'], owner: 'School + Site', status: 'Redesign' },
  { stage: 'Monitor', actions: ['Onboarding compliance', 'Document tracking', 'Expiration alerts'], owner: 'School + Student', status: 'V1 target' },
  { stage: 'Review', actions: ['Performance data', 'Site quality', 'Program outcomes'], owner: 'School Admin', status: 'Future' },
];

const studentJourney = [
  { phase: 'Pre-placement', actions: 'Pay for accepted placement → Upload compliance docs → Complete onboarding requirements', blocker: 'MUST complete before entering facility. No exceptions.', priority: 'P0' },
  { phase: 'During placement', actions: 'Case logging (Prism) · Time entry (Prism) · Evaluations (Prism)', blocker: 'Low adoption in ExactOne — activity stays in Prism', priority: 'P2' },
  { phase: 'Offboarding', actions: 'Exit survey · Final evaluations · TB/compliance renewals', blocker: 'Very low usage — may combine with during-placement', priority: 'P3' },
];

export function ExxatOneView() {
  const [tab, setTab] = useState<TabId>('insights');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map(t => <button key={t.id} onClick={() => setTab(t.id)} style={tabStyle(tab, t.id)}>{t.label}</button>)}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* ── INSIGHTS ── */}
        {tab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="ExxatOne sources: Aarti<>Romit Student design review (Feb 25), Aarti<>Romit School design review (Feb 25), Day 2 Marriott (Mar 3 — payment model), Day 1 Marriott (Mar 2 — ecosystem vision). Adjacent to Prism — handles placement logistics before clinical work begins." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Revenue trigger" value="1 action" delta="Payment only — nothing else generates revenue" deltaVariant="down" />
              <MetricCard label="PA market penetration" value="51%" delta="105 of ~300 PA programs" deltaVariant="up" />
              <MetricCard label="Demo close rate" value="40%" delta="4 of 10 demos close — can improve" deltaVariant="neutral" />
              <MetricCard label="Jobs module launch" value="Apr 15" delta="Next major milestone" deltaVariant="up" />
            </div>
            <Card>
              <CardTitle sub="Aarti (Feb 25) — the platform evolution story">From email chaos to availability-based marketplace</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { era: 'Before ExxatOne', desc: 'March 1st: all schools emailed all sites simultaneously. Sites overwhelmed. First-come-first-serve created conflicts. Schools competed for the same slots against each other.', color: '#EF4444' },
                  { era: 'ExxatOne V1', desc: 'Sites post their availability. Schools apply with specific students. Shifts control from schools to clinical sites. Eliminates mass-email chaos.', color: '#F59E0B' },
                  { era: 'Target state', desc: 'Uber/Airbnb-style ecosystem: placements → jobs → observerships → continuing medical education (CME). Student platform for entire allied healthcare career lifecycle.', color: '#10B981' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderRadius: 8, background: 'var(--surface-secondary)', borderLeft: `3px solid ${row.color}` }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: row.color, marginBottom: 3 }}>{row.era}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle sub="Day 1 Marriott (Mar 2) — business context Romit designs within">KKR investment thesis</CardTitle>
              {[
                'TAM must grow from $300M → $1B. SaaS valuations dropped 40%+ post-2021 (LegalZoom, Salesforce examples). Rule of 40: growth rate + profit margin must reach 50-60.',
                'Clinical education space will consolidate to 1-3 major players. Exxat must be one of them. ExamSoft satisfaction: 1/5 NPS. The bar to beat incumbents is low.',
                'Competitive advantage: SaaS + marketplace model with broad clinical education data moat. AI-first as new entrant advantage — ExamSoft publicly anti-AI.',
                'PA program: 51% market penetration (105/300 programs). Remaining 150-300 student programs blocked by: semester-based registration, multi-site tracking, competency visualization.',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--brand)', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{point}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── STUDENT VIEW ── */}
        {tab === 'student' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Aarti<>Romit ExxatOne Student (Feb 25). Core insight: ExactOne only makes money when students pay. Payment must be primary CTA — current left panel hierarchy buries it equally with other features." />
            <Card>
              <CardTitle sub="Aarti (Feb 25) — the critical design failure in current UI">The revenue hierarchy problem</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#EF4444', marginBottom: 8 }}>Current (broken)</div>
                  {['Payment buried in left panel', 'Equal visual weight to all features', 'Student can browse/create without paying', 'Revenue-critical action hidden from view'].map((item, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>× {item}</div>
                  ))}
                </div>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981', marginBottom: 8 }}>Target (Airbnb/Uber model)</div>
                  {['Payment as full-screen primary CTA', 'Pay early (Sep placement → pay today) OR closer to start', 'Payment status as top dashboard indicator', 'All other features secondary to payment completion'].map((item, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>✓ {item}</div>
                  ))}
                </div>
              </div>
            </Card>
            <Card>
              <CardTitle sub="Three phases — only pre-placement matters for ExactOne">Student activity phases</CardTitle>
              {studentJourney.map((phase, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Badge variant={phase.priority === 'P0' ? 'error' : phase.priority === 'P2' ? 'default' : 'info'}>{phase.priority}</Badge>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{phase.phase}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 4px' }}>{phase.actions}</p>
                  <p style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', margin: 0 }}>{phase.blocker}</p>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="Design decisions Aarti validated">Key decisions</CardTitle>
              {[
                { dec: 'Remove calendar view', why: 'Students in rotations only 35-40 weeks of 150 total school weeks. Next placement may be months away. Daily/weekly calendar = no value for sparse scheduling.' },
                { dec: 'Employment verification as top filter', why: 'Employees need 0-2 forms vs 20+ for non-employees. Self-attestation with employee ID. Hospital pays if employed, student pays $40 if not. Changes the entire onboarding flow.' },
                { dec: 'Document counts not listings', why: 'Some sites have 15+ requirements. Bifurcating into tabs creates variable length lists. Show "5 completed, 2 pending" counts instead of detailed listings.' },
                { dec: 'Wish list with ranking', why: 'Student indicates preferences. System supports ranking + filtering. Direct add-to-wishlist from browse view. Final submission communicates preferences to school.' },
              ].map((d, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{d.dec}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{d.why}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── SCHOOL VIEW ── */}
        {tab === 'school' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Aarti<>Romit ExxatOne School (Feb 25). Plan→Place→Monitor→Review pipeline. Action-driven interface replacing data entry mindset. School can act across all rotations OR drill into one." />
            <Card>
              <CardTitle sub="School admin's 4-stage workflow">Plan → Place → Monitor → Review</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {pipelineStages.map((s, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i+1}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.stage}</span>
                      <Badge variant={s.status === 'Existing' ? 'success' : s.status === 'Redesign' ? 'warning' : 'info'}>{s.status}</Badge>
                    </div>
                    {s.actions.map((a, j) => (
                      <div key={j} style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>• {a}</div>
                    ))}
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>Owner: {s.owner}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle sub="Aarti feedback on current wireframes">Navigation + dashboard decisions</CardTitle>
              {[
                { issue: 'Dropdown navigation feels CRM/B2B', fix: 'Replace with tiles showing next 10 upcoming rotations + "View all". Consumer-friendly, not enterprise-heavy.', src: 'Aarti Feb 25' },
                { issue: '360-degree rotation view buried in reports', fix: 'Move to main overview as primary section. Comprehensive rotation data accessible from dashboard, not hidden in reports.', src: 'Aarti Feb 25' },
                { issue: 'School must choose: act across all rotations OR within specific rotation', fix: 'Dual entry point on landing: task-based overview (cross-rotation) OR rotation-selection. Both valid workflows.', src: 'Aarti Feb 25' },
                { issue: 'Onboarding guide inside rotation context', fix: 'Move to separate pre-work section. Same guide applies across all rotations — should not be rotation-specific.', src: 'Aarti Feb 25' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: 12, color: '#EF4444', marginBottom: 3, fontWeight: 600 }}>Issue: {row.issue}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 2 }}>Fix: {row.fix}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.src}</div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── REVENUE MODEL ── */}
        {tab === 'revenue' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Aarti (Feb 25): ExactOne ONLY generates revenue when students pay for accepted placements. Not on account creation, not on browsing, not on site/school contracts. This shapes every design priority." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Revenue trigger" value="Student payment" delta="The ONLY trigger. Everything else is free." deltaVariant="down" />
              <MetricCard label="Payment timing" value="Flexible" delta="Can pay early or closer to start date" deltaVariant="up" />
              <MetricCard label="Employee discount" value="$0 vs $40" delta="Hospital employees: $0. Non-employees: $40" deltaVariant="neutral" />
            </div>
            <Card>
              <CardTitle sub="What generates revenue vs what does not">Revenue map</CardTitle>
              {[
                { action: 'Student accepts placement AND pays', rev: true, note: 'The only revenue-generating event' },
                { action: 'Student creates account', rev: false, note: 'No revenue' },
                { action: 'Student browses sites + wish lists', rev: false, note: 'No revenue — needed for discovery' },
                { action: 'School signs contract with ExactOne', rev: false, note: 'No revenue — platform access fee separate' },
                { action: 'Site posts availability', rev: false, note: 'No revenue — enables matching' },
                { action: 'Hospital employee self-attests', rev: false, note: 'Hospital pays on their behalf — reduces student friction' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: row.rev ? '#10B981' : '#EF4444', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>{row.rev ? '✓' : '×'}</span>
                  <span style={{ fontSize: 13, fontWeight: row.rev ? 600 : 400, color: row.rev ? 'var(--text-primary)' : 'var(--text-secondary)', flex: 1 }}>{row.action}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'right' }}>{row.note}</span>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="Aarti + Day 2 Marriott">Ecosystem expansion roadmap</CardTitle>
              {[
                { module: 'Placements (mandatory)', status: 'Live', desc: 'Core product. Assigned rotations + searchable/applicable placements (V2).' },
                { module: 'Jobs module', status: 'Apr 15 launch', desc: 'Post-graduation employment. Independent. Licensed, board-certified students only. No overlap with placements.' },
                { module: 'Observerships / Shadowships', status: 'Future', desc: 'Pre-professional experience for pre-med/pre-health students.' },
                { module: 'Continuing Medical Education (CME)', status: '2027 maybe', desc: '"Coming soon" tab considered. Healthcare professionals need CME credits for license renewal.' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <Badge variant={row.status === 'Live' ? 'success' : row.status.includes('Apr') ? 'warning' : 'default'}>{row.status}</Badge>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{row.module}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.desc}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── UX STORIES ── */}
        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="ExxatOne UX stories from Aarti design reviews (Feb 25) and Day 2 Marriott (Mar 3). ExxatOne is adjacent to Romit's core scope but informs the broader Exxat ecosystem understanding." />
            {[
              { id: 'EO-01', who: 'Student', what: 'See payment as the first and most prominent action when I log in', why: 'I can browse, get accepted, and onboard — but until I pay, ExactOne has generated no revenue. Payment must be the unmissable CTA, not buried in a left panel.', src: 'Aarti ExxatOne Student · Feb 25' },
              { id: 'EO-02', who: 'Student (hospital employee)', what: 'Self-attest as an employee with my hospital ID so my employer pays my placement fee instead of me', why: 'Employees need 0-2 forms vs 20+ for non-employees. Employment verification should be the first question asked — before showing any compliance requirements.', src: 'Aarti ExxatOne Student · Feb 25' },
              { id: 'EO-03', who: 'Student', what: 'Browse clinical sites, filter by specialty and location, and add ranked preferences to my wish list', why: 'ExxatOne shifted from school-assigned rotations to student-expressed preferences. Students need a browsing + ranking experience, not just a notification inbox.', src: 'Aarti ExxatOne Student · Feb 25' },
              { id: 'EO-04', who: 'School Admin', what: 'See all my pending actions across all 150 rotations in one cross-rotation task view, then drill into a specific rotation', why: 'Compliance gaps, bulk reminders, and group-level scheduling should not require navigating into each rotation individually. Cross-rotation triage is the primary admin workflow.', src: 'Aarti ExxatOne School · Feb 25' },
              { id: 'EO-05', who: 'School Admin', what: 'Act on compliance gaps for a group of students with bulk reminder + preview of who gets notified', why: 'Individual reminder emails per student create administrative overhead. Bulk action with preview (shows recipients + content before sending) reduces coordination time.', src: 'Aarti ExxatOne School · Feb 25' },
              { id: 'EO-06', who: 'Program Director', what: 'See student success analytics across admissions, curriculum, assessment, faculty, and outcomes in one dashboard', why: 'Day 1 Marriott: AI-driven insights with actionable recommendations. Move beyond efficiency tools to strategic partnership. Admission GPA vs outcomes, curriculum gaps, survey optimization.', src: 'Day 1 Marriott · Mar 2' },
            ].map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', background: 'rgba(227,28,121,0.08)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>{s.id}</span>
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
