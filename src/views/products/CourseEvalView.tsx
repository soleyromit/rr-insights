import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { getProduct } from '../../data/products';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PRODUCT_ID = 'course-eval';
type TabId = 'insights' | 'market' | 'personas' | 'pce-scope' | 'stories' | 'decisions';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights', label: 'Insights' },
  { id: 'market', label: 'Market context' },
  { id: 'personas', label: 'Personas + needs' },
  { id: 'pce-scope', label: 'PCE scope' },
  { id: 'stories', label: 'UX stories' },
  { id: 'decisions', label: 'Design decisions' },
];

const responseRateData = [
  { program: 'PA Long Island', rate: 72, target: 85 },
  { program: 'PA Manhattan', rate: 61, target: 85 },
  { program: 'PT Program', rate: 58, target: 85 },
  { program: 'Nursing FNP', rate: 44, target: 85 },
  { program: 'SLP', rate: 38, target: 85 },
];

const surveyTypes = [
  { type: 'Post-course evaluation (didactic)', owner: 'Faculty + program', frequency: 'End of each course', current: 'Blue (Canvas integration)', gap: 'Multiple faculty per course hard to handle' },
  { type: 'End of didactic year eval', owner: 'Program', frequency: 'Annual', current: 'Blue / SmartEval', gap: 'Question numbering disrupts longitudinal data if updated' },
  { type: 'Clinical course / preceptor eval', owner: 'Students', frequency: 'Per rotation', current: 'Exact Prism', gap: 'Competency mapping not yet fully connected' },
  { type: 'Peer review (faculty)', owner: 'Faculty', frequency: 'As needed / annual', current: 'Paper / ad hoc', gap: 'No digital system — accreditation risk' },
  { type: 'Orientation survey', owner: 'Program', frequency: 'Cohort start', current: 'Paper / Blue', gap: 'Not systematized' },
  { type: 'Exit survey', owner: 'Program', frequency: 'Graduation', current: 'Paper / Email', gap: 'Response rate: 8–16% — too low for accreditation' },
  { type: 'Graduate / employment survey', owner: 'Program', frequency: '3 / 6 month post-grad', current: 'Email outreach', gap: 'Response rate extremely low. ARC-PA tracks employment data.' },
  { type: 'Program director survey', owner: 'Faculty + staff', frequency: 'Annual', current: 'Internal form', gap: 'ARC-PA recently added 2 new required questions — versioning problem' },
  { type: 'Annual program report (university)', owner: 'Admin', frequency: 'Annual', current: 'Manual aggregation', gap: 'Must satisfy Middle States + ARC-PA simultaneously' },
];

const competitors = [
  { name: 'Blue (Campus Labs)', strength: 'Canvas LMS integration, multi-instructor team-taught support', weakness: 'Requires admin setup, response rate issues', used: 'Touro Long Island' },
  { name: 'SmartEval', strength: 'Built for healthcare education, accreditation templates', weakness: 'Being replaced — Exxat already surpassing it', used: 'Touro Chicago (was)' },
  { name: 'CoreEval', strength: 'Clinical evaluation specialist', weakness: 'Standalone, no LMS integration', used: 'Various PA programs' },
  { name: 'Anthology / Civitas', strength: 'Full academic analytics suite', weakness: 'Expensive, complex, not clinical-focused', used: 'Large universities' },
  { name: 'Exxat Survey (current)', strength: 'Already integrated in Prism, familiar to users', weakness: 'Versioning breaks longitudinal data, no post-course-eval specific logic', used: 'Exxat customers' },
];

export function CourseEvalView() {
  const [tab, setTab] = useState<TabId>('insights');
  const insights = getInsightsByProduct(PRODUCT_ID);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '10px 18px', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? 'var(--brand)' : 'var(--text-secondary)', borderBottom: `2px solid \${tab === t.id ? 'var(--brand)' : 'transparent'}`, marginBottom: -1, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {tab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Course &amp; Faculty Eval signal sources: Mohil/Vishaka/David PCE context (Mar 24), Arun 3-year vision (Mar 24), Touro ExamSoft meeting (Mar 11 — post-course eval discussion). LMS platforms historically don't offer post-course eval — Exxat's market opportunity." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Survey types needed" value="9" delta="Across didactic + clinical" />
              <MetricCard label="Exit survey response rate" value="8–16%" delta="Too low for accreditation" deltaPositive={false} />
              <MetricCard label="Target response rate" value="≥85%" delta="ARC-PA self-study standard" />
              <MetricCard label="Competitors charging for this" value="CoreEval / Blue" delta="Exxat can bundle free" />
            </div>
            <Card>
              <CardTitle sub="Current response rate vs 85% target (Touro data)">Survey response rates by program</CardTitle>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={responseRateData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="program" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Bar dataKey="rate" fill="#E31C79" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" fill="rgba(59,130,246,0.2)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8 }}>Pink = current rate. Blue = 85% target. Source: Touro team, Mar 11.</div>
            </Card>
            {insights.slice(0, 6).map((ins, i) => <InsightRow key={i} insight={ins} />)}
          </div>
        )}

        {tab === 'market' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Market positioning from Mohil/Vishaka/David PCE session (Mar 24). LMS platforms do not natively offer post-course evaluation. Academic programs pay separate vendors. Exxat opportunity: bundle into Prism subscription at no extra cost to displace CoreEval, Blue, SmartEval." />
            <Card>
              <CardTitle sub="Who programs currently pay for post-course evaluation">Competitor landscape</CardTitle>
              {competitors.map((c, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < competitors.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</span>
                    <Badge variant="default">Used by: {c.used}</Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                    <div style={{ color: '#10B981' }}>+ {c.strength}</div>
                    <div style={{ color: '#EF4444' }}>− {c.weakness}</div>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="Vishaka / Mohil (Mar 24) — Exxat strategic framing">Why Exxat wins this market</CardTitle>
              {[
                'LMS platforms (Canvas, Blackboard, D2L) do not natively offer post-course evaluation. Programs pay separate vendors annually.',
                'Exxat can bundle PCE into the Prism subscription at no extra charge — identical to the exam platform Year 1 free strategy.',
                'Exxat already has the course offering, faculty, and student roster data. No manual setup needed unlike Blue or CoreEval.',
                'Accreditation bodies (ARC-PA, CAPTE, ACOTE) mandate specific question sets that Exxat can pre-populate as templates.',
                'Mohil: "The integration approach supports other modules — student 360 dashboard, LMS/ExamSoft data import." PCE is a data hub, not just a survey tool.',
              ].map((point, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: 'var(--brand)', fontWeight: 700, flexShrink: 0 }}>→</span>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{point}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === 'personas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Four personas interact with Course Eval. Each has a different job. Source: Touro team (Mar 11), Mohil/Vishaka/David (Mar 24)." />
            {[
              { persona: 'Student', job: 'Complete post-course evaluations before accessing next course or exam results', pain: 'Surveys open during finals week when they are already stressed. Programs tie completion to exam access as a compliance mechanism.', quote: '"The students don\'t comprehend how much their grades are worth until the end of the semester when they start calculating." — Touro Mary', src: 'Touro ExamSoft session · Mar 11' },
              { persona: 'Faculty', job: 'View their own course evaluation results after admin publishes them. See year-over-year trend.', pain: 'Results come back through multiple platforms (Blue, SmartEval, Canvas) making trend analysis impossible. Need a single faculty dashboard across all their courses.', quote: '"The instructor gets automatically sent their evaluations once closed. The academic coordinator has access to all of them." — Touro coordinator', src: 'Touro ExamSoft session · Mar 11' },
              { persona: 'Program Director / Admin', job: 'Aggregate all evaluation data for accreditation self-study. Identify curriculum gaps. Report to university and accreditor simultaneously.', pain: 'Multiple platforms, manual aggregation, versioning breaks longitudinal data. ARC-PA recently added 2 new required questions — forces a new survey version which breaks historical comparisons.', quote: '"If we change a question in an evaluation, the system treats it as a new evaluation. You cannot aggregate data." — Touro coordinator', src: 'Touro ExamSoft session · Mar 11' },
              { persona: 'Supervisor / Preceptor', job: 'Evaluate student performance in clinical settings. View program-level reports on preceptor satisfaction.', pain: 'Preceptor evaluations happen in Prism but post-course evaluations happen in a separate tool. No unified view for program directors.', quote: '"Preceptor evaluations if you wanted to electronize the forms and not use paper forms, we could easily set it up for you in Exact Prism." — Vishaka', src: 'Touro ExamSoft session · Mar 11' },
            ].map((p, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Badge variant="default">{p.persona}</Badge>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.src}</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Job: {p.job}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>Pain: {p.pain}</div>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>{p.quote}</div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'pce-scope' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Post-Course Evaluation (PCE) scope from Mohil/Vishaka/David session (Mar 24). Key decision: integrate through survey module, not course pages. Monetization: separate paid feature from general surveys." />
            <Card>
              <CardTitle sub="All 9 survey types needed across a typical PA/PT program lifecycle">Survey type registry</CardTitle>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Survey type', 'Owner', 'Frequency', 'Current tool', 'Key gap'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {surveyTypes.map((s, i) => (
                    <tr key={i} style={{ borderBottom: i < surveyTypes.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{s.type}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{s.owner}</td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{s.frequency}</td>
                      <td style={{ padding: '10px 12px' }}><Badge variant="default">{s.current}</Badge></td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-muted)' }}>{s.gap}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Card>
              <CardTitle sub="Mohil/Vishaka/David PCE session — phased implementation">PCE implementation phases</CardTitle>
              {[
                { phase: 'Phase 1', title: 'Course-based PCE for Prism users', detail: 'Requires course offerings in Prism. Auto-schedule evaluations after course end date. Integrate through survey module (preferred over course-level). Student sees evaluation in their survey tile.', timeline: 'Q2–Q3 2026' },
                { phase: 'Phase 2', title: 'CSV upload for non-Prism course management + tenant-level config', detail: 'Allow programs not using Prism course management to upload CSV for distribution. Tenant-level survey configuration (currently planned as Phase 2). Flexibility needed: university-mandated vs program-specific questions.', timeline: 'Q4 2026' },
                { phase: 'Phase 3', title: 'Integration with student 360 + LMS/ExamSoft data', detail: 'PCE data feeds into student 360 dashboard. LMS and ExamSoft data imports for comprehensive program analytics. AI theme extraction from qualitative comments.', timeline: '2027' },
              ].map((p, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge variant={i === 0 ? 'warning' : i === 1 ? 'default' : 'info'}>{p.phase}</Badge>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{p.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>{p.timeline}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{p.detail}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Course Eval user stories sourced from Touro team (Mar 11), Mohil/Vishaka/David (Mar 24). Each story is an action a real user is trying to complete." />
            {[
              { id: 'CE-01', who: 'Student', what: 'Complete a post-course evaluation for each faculty member in a team-taught course in one sitting', why: 'Currently: separate Blue evaluations per instructor. Students fill out 4–5 surveys for one course.', src: 'Touro coordinator (Mar 11)' },
              { id: 'CE-02', who: 'Faculty', what: 'See my course evaluation results across all my courses in a single dashboard after admin publishes', why: 'Currently: results in Blue + Canvas separately. No year-over-year trend view.', src: 'Mohil/Vishaka (Mar 24)' },
              { id: 'CE-03', who: 'Program Director', what: 'Update a survey question without breaking historical trend data for all previous responses', why: 'ARC-PA added 2 new required questions. Current system treats updated survey as a new object — breaks longitudinal comparisons.', src: 'Touro coordinator (Mar 11)' },
              { id: 'CE-04', who: 'Program Director', what: 'See AI-extracted themes from open-ended survey responses without reading each response individually', why: '"That would save the clinical team hours and hours." Clinical directors currently read all comments manually.', src: 'Touro/Vishaka (Mar 11)' },
              { id: 'CE-05', who: 'Program Director', what: 'Configure a central auto-schedule that sends evaluations to all courses after their end date', why: 'Currently: manual per-course setup. Central-level setup across all courses is the preferred approach.', src: 'Mohil/Vishaka (Mar 24)' },
              { id: 'CE-06', who: 'Admin', what: 'Incentivize students to complete evaluations by tying completion to exam result access', why: 'Touro: "Before we take this exam, you guys need to complete the course evaluations." Compliance mechanism that works.', src: 'Touro coordinator (Mar 11)' },
              { id: 'CE-07', who: 'Admin', what: 'Export all program survey data in one download for accreditation self-study', why: 'Currently: download separately from Blue, Canvas, Prism, SmartEval. Manual aggregation for every accreditation cycle.', src: 'Touro team (Mar 11)' },
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

        {tab === 'decisions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Design decisions for Course Eval grounded in PCE session and Touro discussions." />
            {[
              { title: 'Entry point: survey module, not course pages', d: 'Post-course evaluation is accessed through the surveys section, not inside individual course pages.', r: 'Mohil: "More intuitive for academic users who already use surveys section. Central system setup with auto-scheduling for all courses after completion." Admin efficiency: configure once, applies to all courses.', t: 'Faculty may expect to find evaluations inside their course. Mitigation: surface "View your evaluations" link in course pages that deep-links to the survey module.', src: 'Mohil/Vishaka/David PCE · Mar 24' },
              { title: 'Versioned questions, not new survey on update', d: 'When a survey question is updated, the system preserves the previous version and aggregates across versions using question themes.', r: 'Touro coordinator: "If we change a question and the meaning doesn\'t change... we label it 3-i so question 3 stays and question 4 stays. We overcame that." ARC-PA requires continuous longitudinal reporting — version breaks are a compliance risk.', t: 'More complex data model. Mitigation: Exxat already solved this for clinical evaluation themes. Same architecture applies here.', src: 'Touro coordinator (Mar 11)' },
              { title: 'PCE as paid feature, general surveys stay free', d: 'Post-course evaluation with accreditation reporting is a separate paid module. General surveys remain bundled in Prism.', r: 'Mohil: "Post-course evaluation will be separate paid feature. Non-subscribers won\'t see the post-course evaluation tile." Positions Exxat against CoreEval and Blue on value + price.', t: 'UI must clearly communicate what is free vs paid without making free users feel blocked. Progressive disclosure: show the feature, gate the activate action behind subscription check.', src: 'Mohil/Vishaka/David PCE · Mar 24' },
            ].map((d, i) => (
              <Card key={i}>
                <CardTitle sub={d.src}>{d.title}</CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[{ label: 'Decision', text: d.d, color: '#3B82F6' }, { label: 'Rationale', text: d.r, color: '#10B981' }, { label: 'Tradeoff', text: d.t, color: '#F59E0B' }].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: row.color, width: 64, flexShrink: 0, marginTop: 2 }}>{row.label}</span>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{row.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
