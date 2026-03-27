import { useState } from 'react';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts';

type TabId = 'overview' | 'workflow' | 'personas' | 'gaps' | 'roadmap' | 'exactone';
const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'workflow', label: 'Lifecycle' },
  { id: 'personas', label: 'Personas' },
  { id: 'gaps', label: 'Design gaps' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'exactone', label: '★ ExactOne north star' },
];
const ts = (t: TabId, cur: TabId) => ({
  padding: '10px 18px', fontSize: 13,
  fontWeight: cur === t ? 600 : 400,
  color: cur === t ? 'var(--brand)' : 'var(--text-secondary)',
  borderBottom: `2px solid ${cur === t ? 'var(--brand)' : 'transparent'}`,
  marginBottom: -1, background: 'none', border: 'none',
  cursor: 'pointer', whiteSpace: 'nowrap' as const,
});
const LIFECYCLE = [
  { stage: 'Placement assigned', owner: 'DCE', action: 'System generates draft contract from template. DCE reviews and customises objectives.', pain: 'Template selection is manual. No link to previous rotations or student competency history.' },
  { stage: 'Student acknowledgement', owner: 'Student', action: 'Student reviews objectives, signs digitally. Deadline tracked by system.', pain: 'Students often unaware a contract exists until DCE chases. No in-app notification.', nps: true },
  { stage: 'Site supervisor review', owner: 'SCCE', action: 'Clinical supervisor reviews student goals and adds site-specific expectations.', pain: 'SCCE rarely uses Exxat. Re-learns the platform every rotation. Mobile experience inadequate.', nps: true },
  { stage: 'Midpoint check-in', owner: 'DCE + Student', action: 'Optional midpoint review. Progress noted against objectives.', pain: 'No structured midpoint workflow. DCE uses email or phone. Progress notes lost outside system.' },
  { stage: 'End-of-rotation review', owner: 'DCE + SCCE + Student', action: 'All three parties assess goal completion. Contract marked complete or carries over.', pain: 'Carryover logic not built. Incomplete goals from rotation 1 do not appear in rotation 2 contract.' },
  { stage: 'Program archive', owner: 'System', action: 'Completed contracts archived. Program Director reviews aggregate goal attainment.', pain: 'No aggregate view. Program Director cannot see what percentage of students met a given goal.' },
];
const GAPS = [
  { area: 'No cross-rotation continuity', severity: 'Critical', detail: 'Objectives completed in rotation 1 are invisible when building rotation 2. DCEs must manually remember what was agreed. Students cannot build on previous goals.', fix: 'Contract templates auto-populate incomplete goals from previous rotation. Show cumulative objective attainment across the entire clinical year.' },
  { area: 'Skills Checklist is disconnected', severity: 'Critical', detail: 'Learning contracts set goals (perform 10 IV insertions). Skills Checklist tracks competency (IV insertion: observed/performed). These two systems are not linked. A student can meet a Skills item without the contract knowing, and vice versa.', fix: 'Bi-directional link: completing a Skills item marks contract objective progress. Contract objectives auto-suggest corresponding Skills items.' },
  { area: 'SCCE has no context when opening the contract', severity: 'High', detail: 'The site supervisor sees a contract with no background on the student: no rotation number, no program context, no prior site history. Every rotation feels like the first interaction.', fix: 'Contract landing page for SCCE: student name, program, rotation number, prior site feedback, DCE contact. Mobile-first layout. 60-second read.' },
  { area: 'No mobile-ready contract signing', severity: 'High', detail: 'NPS 2025 student feedback: mobile navigation is hard. Contract signing is a milestone action students and SCSEs must complete on any device in under 2 minutes.', fix: 'Mobile-first signing flow: progressive disclosure, one section at a time, signature on final screen. Works on a phone in a clinical hallway.' },
  { area: 'Program Director has no aggregate view', severity: 'High', detail: 'No dashboard shows: what objectives are most commonly set, what percentage were met, which students are behind, which sites have the lowest completion rates.', fix: 'Program-level dashboard: objective frequency heat map, completion rate by site/student/type. CAPTE and ACOTE evidence export.' },
  { area: 'Midpoint check-in is unstructured', severity: 'Medium', detail: 'The midpoint review happens outside Exxat via email or phone. No record exists unless DCE manually enters a note. There is no reminder workflow.', fix: 'Optional midpoint workflow: system reminder at rotation midpoint, DCE and student complete a 3-question progress form, note is timestamped.' },
];
const PERSONA_DATA = [
  { persona: 'Student', pain: 4, mobile: 5, awareness: 2 },
  { persona: 'DCE', pain: 3, mobile: 2, awareness: 5 },
  { persona: 'SCCE', pain: 5, mobile: 5, awareness: 1 },
  { persona: 'Program Dir.', pain: 3, mobile: 1, awareness: 3 },
];
const RADAR_DATA = [
  { axis: 'Usability', current: 2, target: 8 },
  { axis: 'Mobile', current: 1, target: 9 },
  { axis: 'Continuity', current: 1, target: 8 },
  { axis: 'Integration', current: 2, target: 9 },
  { axis: 'Reporting', current: 1, target: 7 },
];
const ROADMAP = [
  { phase: 'Q2 2026', label: 'Foundation', items: ['Mobile-first signing flow for SCCE + Student', 'SCCE landing page with full student context', 'In-app notifications for contract milestones', 'Cross-rotation objective carryover logic'] },
  { phase: 'Q3 2026', label: 'Integration', items: ['Skills Checklist bi-directional link to contract objectives', 'Structured midpoint check-in workflow', 'Program Director aggregate dashboard', 'DCE objective bank reusable across cohorts'] },
  { phase: 'Q4 2026', label: 'Intelligence', items: ['AI objective suggestion from competency gaps', 'Accreditation export — CAPTE / ACOTE goal attainment evidence', 'Site performance dashboard: which sites produce highest completion', 'Longitudinal competency map across all rotations'] },
];

export function LearningContractsView() {
  const [tab, setTab] = useState<TabId>('overview');
  const critical = GAPS.filter(g => g.severity === 'Critical').length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={ts(t.id, tab)}>
            {t.label}
            {t.id === 'gaps' && critical > 0 && (
              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, background: '#EF4444', color: 'white', padding: '1px 5px', borderRadius: 10 }}>{critical}</span>
            )}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Sources: Day 4 Marriott (domain models, Mar 5), Day 5 FaaS session (Mar 6), NPS 2025 SCCE + student signals. No dedicated Learning Contracts session yet — synthesised from cross-product Granola notes." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Dedicated sessions" value="0" delta="Discovery session needed" deltaVariant="down" />
              <MetricCard label="Critical gaps" value={String(critical)} delta="Cross-rotation + Skills link" deltaVariant="down" />
              <MetricCard label="Personas" value="3" delta="Student / DCE / SCCE" />
              <MetricCard label="Accreditation" value="CAPTE/ACOTE" delta="Goal attainment evidence required" deltaVariant="neutral" />
            </div>
            <Card>
              <CardTitle sub="Three parties, one agreement, every rotation">What Learning Contracts does</CardTitle>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 12px' }}>
                A Learning Contract formalises the objectives a student will work toward during a clinical rotation. It involves three parties: the student, their DCE (academic side), and the SCCE (clinical site side). Contracts run across every rotation in a clinical year and must link to competency frameworks for accreditation evidence.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { role: 'Student', job: 'Review and acknowledge objectives. Track own progress.', gap: 'Unaware a contract exists until chased. No visibility into cross-rotation progress.' },
                  { role: 'DCE', job: 'Create contracts, monitor progress across all students, escalate at-risk cases.', gap: 'No cross-rotation continuity. Manual templating. No aggregate dashboard.' },
                  { role: 'SCCE', job: 'Review student objectives, add site expectations, confirm completion at rotation end.', gap: 'Platform unfamiliar — re-learns each rotation. No student context on arrival.' },
                ].map((p, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--brand)', marginBottom: 6 }}>{p.role}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}><strong>Job: </strong>{p.job}</div>
                    <div style={{ fontSize: 11, color: '#EF4444' }}><strong>Gap: </strong>{p.gap}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle sub="The untapped connection: Learning Contracts plus Skills Checklist">The missing link</CardTitle>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 10px' }}>
                    Contracts set goals: <em>perform 10 IV insertions by end of rotation.</em> Skills Checklist tracks competency: <em>IV insertion — observed / performed.</em> These two systems are entirely disconnected. A student can complete the Skills item without the contract knowing.
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
                    Connecting them creates a closed-loop competency system. Every contract objective maps to Skills Checklist items. Completing one drives progress in the other. No competitor has this.
                  </p>
                </div>
                <div style={{ width: 200, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={RADAR_DATA}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                      <Radar name="Current" dataKey="current" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} />
                      <Radar name="Target" dataKey="target" stroke="var(--brand)" fill="var(--brand)" fillOpacity={0.1} />
                      <Tooltip contentStyle={{ background: 'var(--surface-primary)', border: '1px solid var(--border)', fontSize: 11 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>Current vs target (1-10)</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {tab === 'workflow' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AIStrip text="Lifecycle synthesised from cross-product Granola notes. NPS signal tags indicate confirmed user verbatim from NPS 2025 data." />
            {LIFECYCLE.map((stage, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{stage.stage}</span>
                      <Badge variant="default">{stage.owner}</Badge>
                      {stage.nps && <Badge variant="error">NPS signal</Badge>}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}><strong>Action: </strong>{stage.action}</div>
                    <div style={{ fontSize: 12, color: '#EF4444', padding: '6px 10px', background: 'rgba(239,68,68,0.06)', borderRadius: 8, borderLeft: '2px solid #EF4444' }}>
                      <strong>Pain: </strong>{stage.pain}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'personas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="SCCE is the highest-risk persona: infrequent use, no mobile experience, no student context on arrival. NPS 2025 confirms mobile gap for students at contract signing." />
            <Card>
              <CardTitle sub="Pain level vs mobile need vs platform awareness (1-5 scale)">Persona friction chart</CardTitle>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={PERSONA_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="persona" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} domain={[0, 6]} />
                  <Tooltip contentStyle={{ background: 'var(--surface-primary)', border: '1px solid var(--border)', fontSize: 11 }} />
                  <Bar dataKey="pain" fill="#EF4444" name="Pain level" radius={[4,4,0,0]} />
                  <Bar dataKey="mobile" fill="#D97706" name="Mobile need" radius={[4,4,0,0]} />
                  <Bar dataKey="awareness" fill="var(--brand)" name="Platform awareness" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
            {[
              { persona: 'SCCE', color: '#EF4444', risk: 'Highest risk', points: ['Logs in once per rotation — platform is always unfamiliar', 'No student context on arrival: no rotation number, no prior feedback, no DCE contact', 'Mobile is the primary device in clinical settings — experience is desktop-only', 'Related: preceptor eval length discouraging completion (NPS 2025 student signal)'], design: 'SCCE landing page delivers full context in 60 seconds. Mobile-first signing. One primary action per screen.' },
              { persona: 'Student', color: '#D97706', risk: 'High risk', points: ['Often unaware a contract exists until DCE sends a follow-up email', 'No visibility into how contract objectives map to Skills Checklist items', 'Cannot see cumulative progress across all rotations — each feels disconnected', 'NPS 2025: mobile navigation hard, especially for signing and time-sensitive actions'], design: 'Contract summary on clinical dashboard. Progress bar per objective. Mobile signing in 2 taps.' },
              { persona: 'DCE', color: '#3B82F6', risk: 'Medium risk', points: ['Manual template selection with no suggestion based on student or site history', 'No cross-rotation objective carryover — must manually copy from previous contract', 'No alert when student has not signed or SCCE has not reviewed after N days', 'No aggregate view — cannot see which objectives are most commonly set or completed'], design: 'DCE home: contract queue sorted by action needed. Template suggestion from student profile. Cross-rotation carryover built in.' },
            ].map((p, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: p.color }}>{p.persona}</div>
                  <Badge variant={p.risk === 'Highest risk' ? 'error' : p.risk === 'High risk' ? 'warning' : 'default'}>{p.risk}</Badge>
                </div>
                {p.points.map((pt, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
                    <span style={{ color: p.color, flexShrink: 0 }}>•</span>{pt}
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, background: `${p.color}08`, borderLeft: `2px solid ${p.color}`, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <strong style={{ color: p.color }}>Design direction: </strong>{p.design}
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AIStrip text="Gaps inferred from cross-product synthesis. A dedicated Learning Contracts discovery session is needed to validate these before design work begins." />
            {['Critical', 'High', 'Medium'].map(sev => {
              const items = GAPS.filter(g => g.severity === sev);
              if (!items.length) return null;
              return (
                <div key={sev}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: sev === 'Critical' ? '#EF4444' : sev === 'High' ? '#D97706' : '#3B82F6', marginBottom: 8 }}>{sev} ({items.length})</div>
                  {items.map((g, i) => (
                    <Card key={i}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{g.area}</div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.6 }}>{g.detail}</p>
                      <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.07)', borderLeft: '2px solid #10B981', fontSize: 12, color: 'var(--text-secondary)' }}>
                        <strong style={{ color: '#10B981' }}>Fix: </strong>{g.fix}
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'roadmap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AIStrip text="Roadmap is a design proposal — not committed scope. Requires PM alignment before engineering handoff." />
            {ROADMAP.map((phase, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--brand)', color: 'white', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{phase.phase}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{phase.label}</div>
                    {phase.items.map((item, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        <span style={{ color: 'var(--brand)', flexShrink: 0 }}>→</span>{item}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}


        {tab === 'exactone' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(109,94,212,0.04)', border: '1px solid rgba(109,94,212,0.2)', borderLeft: '4px solid #6d5ed4' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6d5ed4', marginBottom: 8 }}>Aarti · ExxatOne Student + School · Feb 25 · sessions d4c622ef + 72f8b82e</div>
              <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.65, fontFamily: 'DM Serif Display, Georgia, serif', fontStyle: 'italic', marginBottom: 8 }}>
                "We are creating the concept of an allied health care student — just like Airbnb created the concept of a traveler."
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>ExactOne is not a schedule viewer. It is the student-facing platform for the entire allied health career lifecycle.</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { title: 'Airbnb model', items: ['Student lands on: pay > placement > jobs', 'Pre-login shows modules; post-login shows personal state', 'Become a host = register as site (secondary, visible)', 'New modules advertised inline as tabs/tiles'], color: '#6d5ed4' },
                { title: 'Uber model', items: ['Payment-first: sooner student pays, sooner Exact gets paid', 'Reserve model: commit + pay ahead, remove friction', 'Every new module (jobs, CME) advertised inside app', 'Consolidated account for rides, food, groceries = one ID'], color: '#e8604a' },
              ].map((col, i) => (
                <div key={i} style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', borderLeft: '3px solid ' + col.color, padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: col.color, marginBottom: 10 }}>{col.title}</div>
                  {col.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: col.color, flexShrink: 0 }}>·</span>
                      <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '14px 16px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Confirmed UX decisions from Aarti (Feb 25)</div>
              {[
                { decision: 'Payment is primary CTA', detail: 'First element on student dashboard when payment is due. Exact makes money only when student pays.', source: 'd4c622ef' },
                { decision: 'Calendar view removed', detail: 'Rotations happen in 35-40 of 150 grad school weeks. Daily calendar not useful.', source: 'd4c622ef' },
                { decision: 'Ongoing vs upcoming split', detail: 'Ongoing = already in clinic (compliant, no daily activity). Upcoming = onboarding phase. Prism handles school activity; ExactOne handles site activity.', source: 'd4c622ef' },
                { decision: 'Placement vs Jobs = separate nav', detail: 'Placement = mandatory clinical internship. Jobs = first employment post-graduation. Cannot be merged.', source: '72f8b82e' },
                { decision: 'Slot request replaces March 1 email', detail: 'Sites post availability; schools apply. Eliminates 300+ PT schools mass-emailing sites each March 1.', source: '72f8b82e' },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ flexShrink: 0, width: 180 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>{d.decision}</div>
                    <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)', marginTop: 2 }}>{d.source}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55 }}>{d.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
