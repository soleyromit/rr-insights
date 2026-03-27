// @ts-nocheck
import { useState } from 'react';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

type TabId = 'overview' | 'instruments' | 'stakeholders' | 'gaps' | 'competitive' | 'open-questions' | 'north-star' | 'pce-arch' | 'pce-build';
const TABS: { id: TabId; label: string; alert?: boolean }[] = [
  { id: 'overview',       label: 'Overview' },
  { id: 'instruments',    label: 'Instruments' },
  { id: 'stakeholders',   label: 'Stakeholder cascade' },
  { id: 'gaps',           label: 'Design gaps', alert: true },
  { id: 'competitive',    label: 'Competitive' },
  { id: 'open-questions', label: 'Open questions (24)', alert: true },
  { id: 'north-star', label: '★ North star' },
  { id: 'pce-arch', label: 'PCE Architecture' },
  { id: 'pce-build', label: '★ PCE Build Plan', alert: true },
];

const ts = (tab: TabId, cur: TabId) => ({
  padding: '10px 18px', fontSize: 13,
  fontWeight: cur === tab ? 600 : 400,
  color: cur === tab ? 'var(--brand)' : 'var(--text-secondary)',
  borderBottom: `2px solid ${cur === tab ? 'var(--brand)' : 'transparent'}`,
  marginBottom: -1, background: 'none', border: 'none',
  cursor: 'pointer', whiteSpace: 'nowrap' as const,
});

const OPEN_QUESTIONS = [
  { q: 'What is the minimum response rate threshold below which evaluation data is flagged as statistically unreliable?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'Can university-level question customization be done by program admins or does it require IT?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'Who (role) will set up the course evaluation survey?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'Will the course-related questions be the same across all didactic and clinical courses?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'Who decides and freezes the questions?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'What is the minimum number of responses required before results are visible to faculty — to prevent de-anonymization in small cohorts?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'Does the two-section survey (course + faculty) always appear together, or can program directors enable/disable sections independently?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'What is the notification channel for students — email only, in-app, LMS notification, or SMS?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'What does semester-over-semester comparison show when a course changes its name or question set between terms?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'Who creates and manages the survey schedule — does the PD set it manually each term, does it auto-generate from SIS enrollment data, or does a Prism admin configure it once at onboarding?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'What happens when a student does not complete the survey before the window closes — can they submit late, is it locked permanently, and does it affect response rate calculation?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'What if grades are received and the survey is still open — students will review based on grades received?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'What does migration from Watermark look like — do we import their historical evaluation data?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'What if the Program Director changes one of the questions after 2 years — do we allow it?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'Should Exxat create a predefined set of questions mapped to accreditation points (CAPTE, ACOTE, CCNE)?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'Do students know what changed in the curriculum because of their feedback last year — is there a feedback loop?', priority: 'P2', source: 'Open Questions doc' },
  { q: 'What metrics will faculty want to measure?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'What metrics will the Program Director want to measure?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'What metrics will the Dean want to measure?', priority: 'P0', source: 'Open Questions doc' },
  { q: 'ARC-PA requires 65% response rate — what is the threshold logic and who gets notified when a course falls below?', priority: 'P0', source: 'Touro PA site visit + Open Questions doc' },
  { q: 'Request for access to Program Director or Dean-level view of incumbent portals (Explorance Blue, Watermark)', priority: 'P1', source: 'Open Questions doc' },
  { q: 'What % of total tenants use survey tools provided by LMS for post-course evaluation?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'Watermark has dean-level fixed questions that cannot be removed — should we give this ability?', priority: 'P1', source: 'Open Questions doc' },
  { q: 'What is the one thing your current evaluation tool does that you would be devastated to lose — and what does not do that keeps you up at night?', priority: 'P0', source: 'Open Questions doc — should ask every customer' },
];

const COMPETITORS = [
  { name: 'Explorance Blue', strength: 'Market leader. Accreditation-aware. Strong anonymity controls.', weakness: 'No AI. Accreditation export is weak (1★). No feedback loop to students.', score: 3.5 },
  { name: 'Watermark CES', strength: 'Dean-level fixed questions. Strong governance. Similar to Blue.', weakness: 'No AI. Limited longitudinal views. No feedback loop.', score: 3.5 },
  { name: 'Anthology', strength: 'Best-in-class dean-level aggregate reporting (5★). Role-based views.', weakness: 'No AI. Same export weaknesses.', score: 4 },
  { name: 'SurveyMonkey', strength: 'Best ease of survey creation. Highly customizable.', weakness: 'No accreditation alignment. No preset question banks. No role-based views.', score: 2.5 },
  { name: 'Exxat target', strength: 'Bundled with Prism — zero additional cost. Accreditation-aligned questions. AI sentiment analysis. Feedback loop to students. 65% ARC-PA threshold monitoring.', weakness: 'Not built yet. Historical data migration needed for switchers.', score: 5 },
];

const TIMING_PHASES = [
  { phase: 'End of course', timing: 'Final week / last class day', activity: 'Post-Course Evaluation opens', who: 'Students complete', color: '#E31C79' },
  { phase: 'Post-course', timing: '1–2 weeks after course ends', activity: 'Faculty Survey opens (after PCE closes)', who: 'Faculty complete', color: '#7C3AED' },
  { phase: 'Term review', timing: 'End of each term', activity: 'Program Director reviews both surveys', who: 'PD synthesizes → Dean reviews', color: '#0891B2' },
  { phase: 'Annual review', timing: 'Yearly / Accreditation cycle', activity: 'Program-Level Evaluation Report', who: 'PD → Dean → Accreditor', color: '#059669' },
];

const DESIGN_GAPS = [
  { area: 'Two-instrument architecture not designed', severity: 'Critical', why: 'The current CourseEvalView treats post-course eval and faculty surveys as the same thing. The primer is explicit: they are different instruments, different respondents, different org reach, different routing. Faculty surveys route ONLY to Program Director — not deans. Post-course evals route to Faculty + PD + Dean. The design must reflect this separation.', fix: 'Two separate survey flows with different routing rules, anonymity settings, and result visibility configurations.', src: 'post_course_eval_primer_v2 + Open Questions doc' },
  { area: '24 open questions unanswered — blocking design', severity: 'Critical', why: 'None of the 24 open questions from the product team have been answered. Multiple P0 blockers: Who sets up the survey? What is the minimum response threshold? Are questions the same across didactic and clinical? These answers determine the entire UX architecture.', fix: 'Answer all 24 before any Magic Patterns work on this product. Schedule a design workshop with David/Mohil.', src: 'Open_Questions_on_Course_Evaluations.docx' },
  { area: 'Anonymity and grade-timing controls absent', severity: 'Critical', why: 'Students must not be identifiable to faculty until after grades are locked. Grade timing conflict (grades received before survey closes) is a known design risk. No controls exist in the current design for either.', fix: 'Survey open window gated on grade submission. Faculty see aggregate only, never individual responses. Minimum N for faculty visibility (prevent de-anonymization in small cohorts).', src: 'post_course_eval_primer_v2' },
  { area: 'ARC-PA 65% response rate monitoring absent', severity: 'High', why: 'Touro site visit: ARC-PA requires 65% response rate. If a course falls below this, it is an accreditation risk. No threshold monitoring, no alerts, no PD notification exists in the current design.', fix: 'Response rate badge per course. Amber alert when below 80% with time remaining. Red alert when window closes below 65%. Automated reminder sequence.', src: 'Touro PA site visit notes (Vishaka, Mar 12)' },
  { area: 'Feedback loop to students absent', severity: 'High', why: 'All four competitors (Blue, Watermark, Anthology, SurveyMonkey) get ★★ on feedback loop. Students have no visibility into what changed because of their feedback. This reduces future participation rates and is a program trust issue.', fix: '"Based on your feedback last semester, we made these changes" — a simple notification or dashboard element closing the loop. Program Director publishes a 1-3 sentence response per course.', src: 'Open Questions doc + competitor analysis' },
  { area: 'Longitudinal / multi-term dashboard absent', severity: 'High', why: 'Program Directors need to see whether a course is trending better or worse over 3+ semesters. "Curriculum drift" is only detectable longitudinally. Current design shows one term at a time.', fix: 'Multi-term trend line per course. Cohort comparison. Outlier detection ("Course X dropped 0.8 points from last semester").', src: 'post_course_eval_primer_v2 + Open Questions doc' },
  { area: 'Dean-level aggregate view absent', severity: 'Medium', why: 'Deans receive high-level trend summaries across programs — not raw survey data. No dean-level role or view exists. Essential for accreditation self-studies.', fix: 'Dean view: program-level roll-up, not course-level detail. Exception reports for significant drops. Annual program review export.', src: 'post_course_eval_primer_v2' },
  { area: 'Accreditation-aligned question bank absent', severity: 'Medium', why: 'CAPTE, ACOTE, and CCNE require documented evidence that programs collect and act on student feedback. Pre-built question sets mapped to accreditation requirements would be a significant differentiator over all four competitors.', fix: 'Exxat provides a base question bank mapped to CAPTE/ACOTE/CCNE. Program Directors can customize but must keep the accreditation-mapped core.', src: 'Open Questions doc + post_course_eval_primer_v2' },
];


// Transcript gaps from PCE Context session (bde86866 Mar 24) + Monil session
const PCE_TRANSCRIPT_GAPS = [
  { src:'Vishaka (bde86866 Mar 24)', gap:'PCE lives INSIDE the surveys module as a premium tile — not a standalone product. Entry points: (1) surveys module tile (admin), (2) inside each course (faculty viewing their own results). Two entry points, one data layer.', severity:'High' },
  { src:'David/Marquette (bde86866 Mar 24)', gap:'Real institutional pain: Marquette forces all programs to use university-level didactic questions for clinical placements too. Clinical programs have no relevant post-rotation questions. Need: separate question sets for didactic vs clinical.', severity:'High' },
  { src:'Vishaka (bde86866 Mar 24)', gap:'PCE prerequisite: course offerings must exist in Prism for auto-population of student/faculty distribution lists. Programs without Prism course offerings need a CSV upload fallback — but this should be Phase 2.', severity:'Medium' },
  { src:'David (bde86866 Mar 24)', gap:'Faculty persona needs aggregate view across all their courses — not per-course only. Year-over-year comparison for same course, cross-course rating view. This requires a faculty dashboard, not just per-course tiles.', severity:'High' },
];

export function CourseEvalView() {
  const [tab, setTab] = useState<TabId>('overview');
  const criticalGaps = DESIGN_GAPS.filter(g => g.severity === 'Critical').length;
  const p0Questions = OPEN_QUESTIONS.filter(q => q.priority === 'P0').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={ts(t.id, tab)}>
            {t.label}
            {t.alert && t.id === 'gaps' && criticalGaps > 0 && (
              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, background: '#EF4444', color: 'white', padding: '1px 5px', borderRadius: 10 }}>{criticalGaps}</span>
            )}
            {t.alert && t.id === 'open-questions' && (
              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, background: '#D97706', color: 'white', padding: '1px 5px', borderRadius: 10 }}>{p0Questions} P0</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Sources: post_course_eval_primer_v2 (Exxat internal design spec), Open Questions doc (24 unanswered product questions), Touro PA site visit (Vishaka, Mar 12), Mohil/Vishaka/David PCE context (Mar 24), NPS 2025 textual responses, competitor analysis (Blue/Watermark/Anthology/SurveyMonkey)." />
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(227,28,121,0.05)', border: '1px solid rgba(227,28,121,0.2)' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>⚠ Design status: NOT READY TO BUILD</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>24 open product questions are unanswered. 3 critical design gaps identified from the primer. This view documents what we know and what must be resolved before any Magic Patterns work begins on this product.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Open P0 questions" value={String(p0Questions)} delta="Must answer before building" deltaVariant="down" />
              <MetricCard label="Critical design gaps" value={String(criticalGaps)} delta="Anonymity, instruments, ARC-PA" deltaVariant="down" />
              <MetricCard label="Competitors analyzed" value="4" delta="Blue, Watermark, Anthology, SurveyMonkey" />
              <MetricCard label="Market opportunity" value="~$5K/yr" delta="Per program, standalone vendors charge this" deltaVariant="up" />
            </div>
            <Card>
              <CardTitle sub="From post_course_eval_primer_v2 — the authoritative product spec">The two instruments — fundamentally different</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { title: 'Post-Course Evaluation', sub: 'PRIMARY instrument', respondents: 'Students', routes: 'Faculty + Program Director + Dean', timing: 'Opens after final grade-influencing activity, before grades locked', anonymity: 'Anonymous to instructor until grades submitted and locked. Faculty see aggregate, never individual.', accreditation: 'CAPTE, ACOTE, CCNE require documented evidence of systematic collection and action.', color: '#E31C79', priority: 'Design this first' },
                  { title: 'Faculty Survey', sub: 'SECONDARY instrument', respondents: 'Faculty (self-reflection)', routes: 'Program Director ONLY — not deans in raw form', timing: 'Opens after post-course eval closes (1–2 weeks after course)', anonymity: 'Confidential to PD. Deans see aggregated summaries only. NOT a performance evaluation.', accreditation: 'Not a primary accreditation instrument. Supports PD–faculty development relationship.', color: '#7C3AED', priority: 'Lightweight companion' },
                ].map((inst, i) => (
                  <div key={i} style={{ padding: '14px 16px', borderRadius: 12, background: `${inst.color}06`, border: `1px solid ${inst.color}25` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: inst.color }}>{inst.title}</span>
                      <Badge variant={i === 0 ? 'error' : 'default'}>{inst.sub}</Badge>
                    </div>
                    {[
                      ['Respondents', inst.respondents],
                      ['Routes to', inst.routes],
                      ['Timing', inst.timing],
                      ['Anonymity', inst.anonymity],
                      ['Accreditation', inst.accreditation],
                      ['Design priority', inst.priority],
                    ].map(([label, val]) => (
                      <div key={label} style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: inst.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}: </span>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{val}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle sub="From post_course_eval_primer_v2">Survey timing — why timing is not arbitrary</CardTitle>
              {TIMING_PHASES.map((p, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: i < TIMING_PHASES.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: p.color }}>{p.phase}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.timing}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 2 }}>{p.activity}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.who}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* INSTRUMENTS */}
        {tab === 'instruments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Survey structure from Post_course_evaluation_survey_tool.docx (Exxat internal spec, MSU-PA June 2022). This defines what Exxat is building — the product spec, not the design." />
            <Card>
              <CardTitle sub="From Post_course_evaluation_survey_tool.docx">Post-Course Evaluation structure</CardTitle>
              {[
                { section: 'Section 1: Rate the course', items: ['Course design and content', 'Flow and pacing of topics', 'Rigor and level of challenge', 'Time allocation for topics', 'Assessment quality and alignment', 'Overall course rating'] },
                { section: 'Section 2: Rate the personnel', items: ['Course coordinator / course director (manages logistics, grades, communication)', 'Faculty teaching in the course (each instructor gets their own section)', 'Adjunct faculty / guest lecturers (even if not in the Exxat system)', 'Threshold: faculty must have taught ≥N hours to be included (program-configurable)'] },
                { section: 'Setup and customization requirements', items: ['Define recipients (students + which faculty/staff)', 'Define review objects (course + each instructor)', 'Add guest lecturers not in system by name', 'Build survey structure and questions', 'Set timeline (open date, deadline, auto-reminders)', 'Configure result access (who sees what)'] },
              ].map((sec, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{sec.section}</div>
                  {sec.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>
                      <span style={{ color: 'var(--brand)', flexShrink: 0 }}>•</span>{item}
                    </div>
                  ))}
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="What results look like — grounded in real data from Immunomicro_1.pdf (PCOM 2018) and Spring_2025_MOCES_PHTH_7504_1.pdf (Marquette PT 2025)">Real survey result format</CardTitle>
              {[
                { label: 'Rating scales', desc: '5-point (1=SD to 5=SA) or 6-point (1=VP to 6=E). Medical programs often use 6-point to avoid midpoint clustering.' },
                { label: 'Per-instructor comparison', desc: 'Individual vs department avg vs all-faculty avg. Percentile rank shown. Q9 (clear learning objectives): Dr. Bhave 4.7, PHARMACY avg 4.4, All Faculty 4.4 → 85th percentile.' },
                { label: 'Response rate tracking', desc: 'Responses / Expected shown. 81/89 (91.01%) for Immunomicro. 53/67 (79.10%) for Marquette PT. ARC-PA minimum: 65%.' },
                { label: 'Free-text comments', desc: 'Separated by question and by respondent. Program decides which comments are shown to faculty. Comments on course content vs comments on instructor are in different sections.' },
                { label: 'Longitudinal comparison', desc: 'Multi-term tracking shows whether scores are improving or declining. Not present in either sample — a gap vs what Blue/Watermark offer.' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '8px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{row.label}: </span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.desc}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* STAKEHOLDER CASCADE */}
        {tab === 'stakeholders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Stakeholder cascade from post_course_eval_primer_v2. Post-course evaluations create a cascade of information from student → faculty → program director → dean. Each level has different visibility rights, different decision contexts, and different UX needs." />
            {[
              { role: 'Student', icon: '🎓', color: '#7C3AED', purpose: 'Provide candid feedback on course content, teaching quality, pacing, workload, learning environment', impact: 'Student voice is the primary driver of course-level improvement. Visible program responses build trust and increase future participation.', use: 'Complete evaluation at course end. Optionally view aggregated trends from prior cohorts to calibrate expectations.', sees: 'Their own responses. Aggregated prior cohort results (optional). "What changed based on your feedback" notifications.' },
              { role: 'Faculty', icon: '📚', color: '#0891B2', purpose: 'Receive structured, anonymized insight into how their course was experienced', impact: 'Helps instructors understand gaps between teaching intent and student experience. Informs syllabi and delivery adjustments.', use: 'Review program-released aggregate results after grades are submitted.', sees: 'AGGREGATE results only — never individual responses. Results visible only after grades are locked. Department and all-faculty averages for comparison.' },
              { role: 'Program Director', icon: '🏥', color: '#E31C79', purpose: 'Monitor course quality, identify patterns across instructors and cohorts, support faculty development', impact: 'Enables data-driven curriculum decisions. Surfaces early warning signs.', use: 'View dashboards by course, instructor, cohort. Flag outliers. Initiate course reviews. Review faculty surveys alongside student evals.', sees: 'All results: individual student comments (anonymized), per-faculty scores, longitudinal trends. Faculty surveys in full. Response rate monitoring.' },
              { role: 'Dean / Academic Leadership', icon: '🏛️', color: '#D97706', purpose: 'Ensure program-wide academic quality, accreditation readiness, institutional accountability', impact: 'Evidence base for resource allocation, faculty appointments, program reviews. Essential for accreditation self-studies.', use: 'High-level trend summaries across programs. Exception reports for significant drops. Annual program review.', sees: 'Program-level roll-ups only — NOT course-level individual data. NOT individual faculty survey responses. Exception alerts only.' },
            ].map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${s.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: s.color, marginBottom: 10 }}>{s.role}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {[['Purpose', s.purpose], ['Impact', s.impact], ['How they use it', s.use], ['What they see', s.sees]].map(([label, val]) => (
                        <div key={label}>
                          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: s.color, marginBottom: 3 }}>{label}</div>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* DESIGN GAPS */}
        {tab === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AIStrip text="All gaps identified from reading project documents. Sources: post_course_eval_primer_v2, Open Questions doc, Touro PA site visit, competitor analysis. These gaps must be resolved before Magic Patterns work begins." />
            {['Critical', 'High', 'Medium'].map(sev => {
              const items = DESIGN_GAPS.filter(g => g.severity === sev);
              return (
                <div key={sev}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: sev === 'Critical' ? '#EF4444' : sev === 'High' ? '#D97706' : '#3B82F6', marginBottom: 8 }}>{sev} ({items.length})</div>
                  {items.map((gap, i) => (
                    <Card key={i}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: sev === 'Critical' ? '#EF4444' : sev === 'High' ? '#D97706' : '#3B82F6', flexShrink: 0, marginTop: 4 }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{gap.area}</div>
                          <div style={{ marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>Why: </span>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{gap.why}</span>
                          </div>
                          <div style={{ marginBottom: 4 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>Fix: </span>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{gap.fix}</span>
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>Source: {gap.src}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* COMPETITIVE */}
        {tab === 'competitive' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Competitor analysis from Open_Questions_on_Course_Evaluations__1_.docx. Analyzed Explorance Blue, Watermark CES, Anthology, SurveyMonkey. Market opportunity: programs pay ~$5K/year for standalone course eval tools. Exxat can bundle at zero marginal cost." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Standalone market" value="~$5K/yr" delta="Per program, Explorance Blue pricing" deltaVariant="up" />
              <MetricCard label="LMS do course eval?" value="Yes, poorly" delta="Low adoption, not accreditation-aligned" deltaVariant="neutral" />
              <MetricCard label="AI analysis" value="None" delta="0 of 4 competitors offer AI" deltaVariant="up" />
              <MetricCard label="Feedback loop" value="★★ all 4" delta="No competitor closes the loop to students" deltaVariant="up" />
            </div>
            {COMPETITORS.map((comp, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: i === 4 ? 'var(--brand)' : 'var(--text-primary)' }}>{comp.name}</span>
                      {i === 4 && <Badge variant="error">Our target</Badge>}
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>Score: {comp.score}/5</span>
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981' }}>✓ </span>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{comp.strength}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444' }}>✗ </span>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{comp.weakness}</span>
                    </div>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: `${i === 4 ? 'var(--brand)' : '#94A3B8'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: i === 4 ? 'var(--brand)' : '#94A3B8' }}>{comp.score}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* OPEN QUESTIONS */}
        {tab === 'open-questions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AIStrip text="24 open product questions from Open_Questions_on_Course_Evaluations.docx — none answered yet. These are not nice-to-haves. P0 questions block design architecture decisions. Do not start building until P0 questions are answered." />
            <Card>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                {[['P0 blockers', OPEN_QUESTIONS.filter(q => q.priority === 'P0').length, '#EF4444'], ['P1 important', OPEN_QUESTIONS.filter(q => q.priority === 'P1').length, '#D97706'], ['P2 nice-to-know', OPEN_QUESTIONS.filter(q => q.priority === 'P2').length, '#94A3B8']].map(([label, count, color]) => (
                  <div key={String(label)} style={{ padding: '8px 14px', borderRadius: 8, background: `${color}10`, border: `1px solid ${color}25` }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: String(color) }}>{String(count)}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{String(label)}</div>
                  </div>
                ))}
              </div>
            </Card>
            {['P0', 'P1', 'P2'].map(prio => {
              const questions = OPEN_QUESTIONS.filter(q => q.priority === prio);
              return (
                <div key={prio}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: prio === 'P0' ? '#EF4444' : prio === 'P1' ? '#D97706' : '#94A3B8', marginBottom: 8 }}>{prio} — {prio === 'P0' ? 'MUST answer before building' : prio === 'P1' ? 'Answer before detailed design' : 'Nice to know'}</div>
                  {questions.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', borderRadius: 8, background: 'var(--surface-primary)', border: '1px solid var(--border)', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: prio === 'P0' ? '#EF4444' : '#D97706', flexShrink: 0, marginTop: 1 }}>{prio}</span>
                      <div>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 3px', lineHeight: 1.6 }}>{q.q}</p>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic' }}>{q.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}


        {/* ─── NORTH STAR TAB ─────────────────────────────────────────────────────── */}
        {/* Source: PRISM Day 3 (c7a8d32e) — Aarti's verbatim leadership questions */}
        {/* "Which courses are doing better? Which faculty are not doing better?     */}
        {/* How are my cohorts perceiving my curriculum?"                            */}
        {/* Anti-pattern: "If I see a button that says click here to get AI         */}
        {/* insights, I am done." AI must be embedded, not bolted on.               */}
        {tab === 'north-star' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Aarti verbatim */}
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(109,94,212,0.04)', border: '1px solid rgba(109,94,212,0.2)', borderLeft: '4px solid var(--brand)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--brand)', marginBottom: 8 }}>
                Aarti · PRISM Day 3 · Mar 4, 2026 · session c7a8d32e
              </div>
              <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.65, fontFamily: 'DM Serif Display, Georgia, serif', fontStyle: 'italic', marginBottom: 10 }}>
                "Which courses are doing better? Which faculty are not doing better? How are my cohorts perceiving my curriculum, and what changes do I need to make? I want AI insights embedded in the dashboard — not a button I click to get AI insights. If I see a button that says click here to get AI insights, I am done."
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                This single statement defines the entire course evaluation north star. The product is not a form tool with a reporting tab. It is a <strong>program quality intelligence dashboard</strong> where the leadership questions are answered before the director clicks anything.
              </div>
            </div>

            {/* Three leadership views */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[
                { title: 'Course leaderboard', question: 'Which courses are doing best — and worst — this semester?', content: 'All courses ranked by average score. Trending up ↑ or down ↓ vs last semester. Courses below threshold flagged automatically. New courses marked for closer monitoring.', aarti: 'The leaderboard IS the AI insight. Not a separate panel.', source: 'c7a8d32e Aarti PRISM Day 3' },
                { title: 'Faculty leaderboard', question: 'Which faculty need attention — and who should be recognized?', content: 'All faculty ranked by student perception score. Year-over-year trend per faculty. New faculty automatically flagged for extra observation period. Score fed back into faculty development.', aarti: 'This is what keeps the dean up at night. Show it at the top.', source: 'c7a8d32e Aarti PRISM Day 3' },
                { title: 'Cohort trend', question: 'How does the class of 2026 perceive the curriculum vs class of 2025?', content: 'Cohort-level comparison: how each graduating class rated courses and faculty. Signals curriculum drift, faculty turnover impact, or program improvement over time.', aarti: 'Cohort comparison is the accreditation story. Programs must show improvement.', source: 'c7a8d32e Aarti PRISM Day 3' },
              ].map((v, i) => (
                <div key={i} style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{v.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--brand)', marginTop: 2, fontStyle: 'italic' }}>{v.question}</div>
                  </div>
                  <div style={{ padding: '12px 14px', flex: 1 }}>
                    <p style={{ fontSize: 12, color: 'var(--text2)', margin: '0 0 10px', lineHeight: 1.6 }}>{v.content}</p>
                    <div style={{ padding: '8px 10px', borderRadius: 7, background: 'rgba(109,94,212,0.06)', border: '1px solid rgba(109,94,212,0.15)' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand)', marginBottom: 2 }}>Aarti's framing</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', fontStyle: 'italic' }}>{v.aarti}</div>
                    </div>
                  </div>
                  <div style={{ padding: '6px 14px', borderTop: '1px solid var(--border)', fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)' }}>{v.source}</div>
                </div>
              ))}
            </div>

            {/* Anti-patterns */}
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Anti-patterns to avoid — Aarti verbatim</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { pattern: '"Click here to get AI insights" button', why: 'AI insights are embedded in the leaderboard layout itself. The leaderboard IS the insight. There is no separate AI panel.', source: 'c7a8d32e PRISM Day 3' },
                  { pattern: 'Flat list of courses → click → course report', why: 'Director never wants to click into individual reports to understand program health. Show the picture first. Details are drill-downs, not the entry point.', source: 'c7a8d32e PRISM Day 3' },
                  { pattern: 'No time dimension — courses sorted alphabetically', why: 'Evaluations happen at semester end. Directors always look at the previous semester. The UI must be organized by term. Sort by rating, filter by term, trending up/down are all required.', source: 'c7a8d32e PRISM Day 3' },
                  { pattern: 'Collecting data without connecting it to decisions', why: 'Qualtrics and SurveyMonkey collect feedback too. Our differentiation is connecting evaluation data to curriculum changes, accreditation reports, and faculty development. Data without decision context has no moat.', source: 'c7a8d32e PRISM Day 3' },
                ].map((ap, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', borderRadius: 9, background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)' }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#dc2626', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✗</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 3 }}>{ap.pattern}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{ap.why}</div>
                      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)', marginTop: 4 }}>{ap.source}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* D2L gaps to fill */}
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>D2L gaps that become Exxat opportunities</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12, fontFamily: 'JetBrains Mono, monospace' }}>Source: D2L BrightSpace demo Mar 4 · session c7a8d32e</div>
              {[
                { gap: 'No in-document annotation feedback', opp: 'Allow faculty to annotate submitted PDFs directly — comments, highlights, ink markup — and publish to students. Standard expectation from Canvas/D2L. Missing from Exxat.' },
                { gap: 'No publish/draft state for grades', opp: 'Faculty grade all students first, review, then publish at once. Currently grades appear live as faculty grade. All LMS have this. Exxat does not.' },
                { gap: 'No auto-alert for inactive students', opp: 'Faculty set rule: if student has not logged in for X days, notify me. D2L has this built in. Exxat has no equivalent.' },
                { gap: 'ExamSoft being sold by Turnitin', opp: 'Displacement window is open. LMS platforms now doing what ExamSoft did. Exxat can take the clinical education slice that LMS cannot serve (preceptors, placements, accreditation-specific analytics).' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, borderBottom: i < 3 ? '1px solid var(--border)' : 'none', padding: '10px 0' }}>
                  <div style={{ paddingRight: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', marginBottom: 2 }}>Gap</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>{r.gap}</div>
                  </div>
                  <div style={{ paddingLeft: 14, borderLeft: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 2 }}>Exxat opportunity</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>{r.opp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {tab === 'pce-arch' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(109,94,212,0.04)', border: '1px solid rgba(109,94,212,0.2)', borderLeft: '4px solid #6d5ed4' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6d5ed4', marginBottom: 6 }}>Vishaka + Mohil + David - Mar 24, 2026 - session bde86866</div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>
                PCE is a special type of survey. Entry point must be the Survey section — not inside each course, not a standalone module. All feedback mechanisms in one place is the right UX for academia.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                {
                  title: 'Phase 1 scope', color: '#2ec4a0',
                  items: [
                    'Entry via Survey section — PCE is a survey tile/tab',
                    'Program-level question sets (clinical vs didactic)',
                    'Course offerings in Prism = prerequisite for full distribution',
                    'CSV upload fallback for schools without Prism courses',
                    'Faculty sees results per course AND aggregate dashboard',
                    'Admin sees program-level analytics dashboard',
                  ]
                },
                {
                  title: 'Phase 2 additions', color: '#6d5ed4',
                  items: [
                    'Tenant-level (university) question sets — mandate questions for all programs',
                    'Program override of university-mandated questions',
                    'AI-assisted rationale generation per question/option',
                    'Aggregate year-over-year faculty performance view',
                    'Student cohort perception trend',
                    'Cross-program discipline benchmarking',
                  ]
                },
              ].map((col, i) => (
                <div key={i} style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', borderLeft: '3px solid ' + col.color, padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: col.color, marginBottom: 10 }}>{col.title}</div>
                  {col.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: col.color, flexShrink: 0 }}>-</span>
                      <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '14px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Marquette pain point - David (Mar 24)</div>
              <div style={{ padding: '12px 14px', borderRadius: 9, background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)', marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>University-level questions forced on clinical courses</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                  University set didactic-focused questions for all programs. Clinical placement students were forced to answer "Did this course expose you to diverse patient populations?" for classroom courses — forced artificially low ratings. This is a real pain point at programs where university mandates override clinical context.
                </div>
              </div>
              <div style={{ padding: '10px 14px', borderRadius: 9, background: 'rgba(22,163,74,0.04)', border: '1px solid rgba(22,163,74,0.15)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', marginBottom: 3 }}>Solution</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
                  Phase 1: program directors create separate question sets for clinical vs didactic. Phase 2: tenant-level questions with program-level override capability.
                </div>
              </div>
            </div>
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '14px 18px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Persona entry points</div>
              {[
                { persona: 'Program Director / Admin', entry: 'Survey section → PCE tile → program-level analytics dashboard (course leaderboard, faculty leaderboard, cohort trend)', source: 'c7a8d32e + bde86866' },
                { persona: 'Faculty', entry: 'Course page → view survey results for this course (after admin publishes) AND faculty dashboard → aggregate view across all courses they teach', source: 'bde86866' },
                { persona: 'Student', entry: 'Receives survey at course end via email or LMS. Survey is configured per course by admin.', source: 'bde86866' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6d5ed4', width: 180, flexShrink: 0 }}>{r.persona}</div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{r.entry}</div>
                    <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)', marginTop: 3 }}>{r.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PCE BUILD PLAN — Monil Mar 26 ─────────────────────────────── */}
        {tab === 'pce-build' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Session banner */}
            <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(14,148,163,0.06)', border: '1px solid rgba(14,148,163,0.25)', borderLeft: '4px solid #0d9488' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#0d9488', marginBottom: 4 }}>Monil — PCE Introduction · Mar 26, 2026</div>
              <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>
                PCE is the sales entry point for didactic programs not registered on Prism. End-to-April design target. Engineering handoff May 2026.
              </div>
            </div>

            {/* Deadline strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { label: 'Design deadline', value: 'End of April', sub: 'Full 3-layer scope', color: '#e8604a' },
                { label: 'Engineering handoff', value: 'May 2026', sub: 'Spec → dev', color: '#6d5ed4' },
                { label: 'Strategic value', value: 'Sales entry', sub: 'Non-Prism programs', color: '#0d9488' },
              ].map((m, i) => (
                <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{m.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: m.color, lineHeight: 1.1, marginBottom: 3 }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{m.sub}</div>
                </div>
              ))}
            </div>

            {/* 3-layer architecture */}
            <div style={{ borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', padding: '18px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>3-Layer Architecture — confirmed by Monil</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[
                  {
                    n: '1', label: 'Template Setup', color: '#6d5ed4',
                    who: 'Admin / Program Director',
                    details: [
                      'Select program + course type (clinical / didactic)',
                      'Maximum 2 templates per program',
                      'Fixed structure: course section (5–6 Qs) + faculty section (5–6 Qs)',
                      'Templates saved at program level, reusable across offerings',
                      'Toggle sections: enable/disable course vs faculty evaluation independently',
                      'Add 1–3 supplemental questions beyond template base',
                    ]
                  },
                  {
                    n: '2', label: 'Distribution', color: '#e8604a',
                    who: 'Admin / Program Director (TBD)',
                    details: [
                      'Select existing template for program + course type',
                      'Choose specific course offering (e.g. "ABC Spring 2026")',
                      'System auto-populates student and faculty lists from Prism',
                      'Faculty management: review/edit assignments, handle guest faculty',
                      'TA and part-time faculty included for performance evaluation',
                      'Survey window configuration: open/close dates',
                    ]
                  },
                  {
                    n: '3', label: 'Analytics & Reporting', color: '#0d9488',
                    who: 'Program Director + Faculty + Dean',
                    details: [
                      'Year-over-year faculty performance tracking',
                      'Cross-faculty comparisons within programs',
                      'Response rate monitoring per course',
                      'Program-level performance benchmarking',
                      'AI: sentiment classification of free-text (improvement vs compliment)',
                      'AI: SWOT visualization from response data',
                      'AI: cross-program common complaint analysis',
                      'Top category rating extraction from qualitative responses',
                    ]
                  },
                ].map((layer, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, padding: '14px 16px', borderRadius: 10, background: 'white', border: '1px solid var(--border)', borderLeft: `3px solid ${layer.color}` }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: layer.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{layer.n}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: layer.color }}>{layer.label}</span>
                        <span style={{ fontSize: 11, color: 'var(--text3)', background: 'var(--bg3)', padding: '2px 8px', borderRadius: 4 }}>{layer.who}</span>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
                        {layer.details.map((d, j) => (
                          <div key={j} style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text2)', lineHeight: 1.4 }}>
                            <span style={{ color: layer.color, flexShrink: 0, marginTop: 1 }}>›</span>
                            <span>{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI differentiation */}
            <div style={{ borderRadius: 12, background: 'rgba(109,94,212,0.04)', border: '1px solid rgba(109,94,212,0.2)', padding: '16px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6d5ed4', marginBottom: 4 }}>AI differentiation strategy — without explicit "AI-powered" branding</div>
              <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.6 }}>
                Competitors (Explorance Blue, Watermark) only provide basic mathematical reporting — median, mode, mean. Exxat differentiates through integrated AI insights that surface automatically.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  { feature: 'Sentiment classification', desc: 'Free-text automatically tagged as improvement signal vs compliment signal', icon: '🏷' },
                  { feature: 'SWOT visualization', desc: 'Responses auto-grouped into Strengths / Weaknesses / Opportunities / Threats per course', icon: '⊞' },
                  { feature: 'Cross-program complaint analysis', desc: 'Identifies common issues appearing across multiple courses or programs', icon: '⟺' },
                  { feature: 'Top category extraction', desc: 'Surfaces highest-rated and lowest-rated aspects from qualitative responses', icon: '↑' },
                  { feature: 'Comment filtering by signal type', desc: 'PD can filter to see only improvement signals or only compliments', icon: '⊡' },
                  { feature: 'Faculty vs program average comparison', desc: 'Auto-benchmarks each faculty member against program average without manual calculation', icon: '≈' },
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 12px', borderRadius: 8, background: 'white', border: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{f.feature}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.4 }}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Open questions from Monil */}
            <div style={{ borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)', padding: '16px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Open questions — Monil session (Mar 26)</div>
              {[
                { q: 'Who distributes surveys — program director, course coordinator, or admin?', priority: 'P0' },
                { q: 'What is the user value hierarchy — what does each persona care about and why?', priority: 'P0' },
                { q: 'Student engagement: what response rate improvement tactics are in scope (incentives, gamification)?', priority: 'P1' },
                { q: 'How do free-text comment links to specific question categories work?', priority: 'P1' },
                { q: 'Cross-faculty comparison methodology and fairness considerations?', priority: 'P1' },
                { q: 'Should future question bank integrate with exam management question banks?', priority: 'P2' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: item.priority === 'P0' ? 'rgba(220,38,38,0.08)' : item.priority === 'P1' ? 'rgba(217,119,6,0.08)' : 'rgba(107,114,128,0.08)', color: item.priority === 'P0' ? '#dc2626' : item.priority === 'P1' ? '#d97706' : '#6b7280', flexShrink: 0, height: 'fit-content', marginTop: 1 }}>{item.priority}</span>
                  <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item.q}</span>
                </div>
              ))}
            </div>

            {/* Competitors to analyze */}
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(219,39,119,0.04)', border: '1px solid rgba(219,39,119,0.15)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#db2777', marginBottom: 4 }}>Competitor walkthrough required (Monil directive)</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                Before any Analytics layer design — complete walkthroughs of <strong>Watermark CES</strong> and <strong>Explorance Blue</strong> video demos.
                Focus: how they handle YoY comparison, response rate monitoring, and AI/insight summaries (they don't have any — that's the gap).
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
