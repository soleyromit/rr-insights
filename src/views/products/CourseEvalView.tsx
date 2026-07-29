// views/products/CourseEvalView.tsx — Course & Faculty Eval (PCE) spec archive
// (v18 Astryx). URL-synced sections; the 24-question ledger collapses per
// question; every block names its source document or session.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Fig } from '../../components/charts/Fig';
import { RankedList } from '../../components/charts/RankedList';
import { SpecSection } from './spec/SpecSection';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { SpecFooter } from './spec/SpecFooter';
import { hrefCompetitive } from '../../lib/links';
import { Link } from '@astryxdesign/core/Link';

const PRODUCT_ID = 'course-eval';

const SECTIONS = [
  { id: 'overview', label: 'Overview + gaps' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'questions', label: 'Open questions' },
  { id: 'strategy', label: 'North star' },
  { id: 'build', label: 'Build plan' },
];

const OPEN_QUESTIONS: { q: string; priority: 'P0' | 'P1' | 'P2'; answered: boolean; answer: string }[] = [
  { q: 'What is the minimum response rate threshold?', priority: 'P0', answered: true, answer: 'Show rate + count only; no automatic flagging — schools interpret. ARC-PA recommends 65% minimum (unconfirmed). VB: most programs have poor rates and take what they get.' },
  { q: 'Can question customization be done by program admins or does it require IT?', priority: 'P0', answered: true, answer: 'Finalized at program level due to discipline nuances — actionable insights always land at program level with the curriculum/assessment committee. VB confirmed.' },
  { q: 'Who sets up the course evaluation survey?', priority: 'P0', answered: true, answer: 'Program administrator or program director. Nursing/Pharmacy/Medical = associate or assessment dean; PT/OT/PA = program directors.' },
  { q: 'Are course questions the same across didactic and clinical courses?', priority: 'P1', answered: true, answer: 'Same within all didactic courses, same within all clinical courses, different between the two types. Max 2 templates per program.' },
  { q: 'Who decides and freezes the questions?', priority: 'P0', answered: true, answer: 'Program director or high-level administrator.' },
  { q: 'Minimum responses before faculty see results (de-anonymization risk)?', priority: 'P0', answered: true, answer: 'PCE goes to the entire cohort — even 3/30 responses carries no anonymity risk because which 3 is never disclosed. Exception: faculty who taught <3 hours may be excluded from evaluation.' },
  { q: 'Do course + faculty sections always appear together?', priority: 'P1', answered: true, answer: 'Best practice = combined survey for higher response rates; some programs separate. Default combined with a program-level toggle. VB confirmed.' },
  { q: 'Notification channel for students?', priority: 'P1', answered: true, answer: 'Email at minimum; SMS recommended — students respond more on phones. Both is the P1 ideal.' },
  { q: 'Semester-over-semester comparison when course name or questions change?', priority: 'P1', answered: true, answer: 'Evals finalized per academic year, not per term. Minor name change = keep the series; major content change = break it. VB: not a P1 worry.' },
  { q: 'Who creates and manages the survey schedule?', priority: 'P0', answered: true, answer: 'Director/associate dean schedules ahead; system auto-populates from registrations. Students complete after finals, before the grade deadline; faculty see results only after final grades post. Admin flexibility over open/close/share dates — no hard-coded rules.' },
  { q: 'What happens when a student misses the survey window?', priority: 'P1', answered: true, answer: 'Loses access; counted as non-responder; no late submission, no modification after submit. Admin can extend the window if response rate is insufficient — otherwise closed is closed.' },
  { q: 'What if grades arrive before the survey closes?', priority: 'P1', answered: true, answer: 'Timing is designed so the survey closes before grades are visible; schools use early grade release as a completion incentive. Make it hard, not hard-coded — admin keeps flexibility.' },
  { q: 'Migration from Watermark — import historical data?', priority: 'P1', answered: true, answer: 'Not a P1 blocker. Schools download incumbent reports for past years and start fresh in Exxat. VB confirmed.' },
  { q: 'Can the PD change questions after 2 years?', priority: 'P1', answered: true, answer: 'Allow 1–5 supplemental questions, lock core questions. Changing core questions breaks longitudinal tracking and is rare in practice.' },
  { q: 'Should Exxat ship accreditation-mapped predefined questions?', priority: 'P0', answered: true, answer: 'Short-term: manual mapping of survey questions to accreditation standards — high value differentiator. Auto-tagging is P2+. VB confirmed.' },
  { q: 'Do students learn what changed because of their feedback?', priority: 'P2', answered: true, answer: 'Not a P1 requirement. Some faculty show implemented changes; graduating cohorts rarely see the next iteration anyway.' },
  { q: 'What metrics do faculty want?', priority: 'P0', answered: true, answer: 'Ratings over time, year-over-year for the same course, comparison to department/university average, views across all their courses, and a qualitative summary they can act on.' },
  { q: 'What metrics does the Program Director want?', priority: 'P0', answered: true, answer: 'Course performance across faculty at course + program level; same-course year-over-year; comment review with the ability to hide (never modify) unprofessional comments; red-flag thresholds; AI sentiment on qualitative. Today admins can modify scores in Exxat — that must be prevented.' },
  { q: 'What metrics does the Dean want?', priority: 'P0', answered: true, answer: 'High-level view across programs; PT vs OT vs PA on standardized questions; drill to programs/courses/faculty dragging scores down; response counts and satisfaction; department trends.' },
  { q: 'Journey when Prism has no course offerings?', priority: 'P1', answered: true, answer: 'Phase 1 requires course offerings in Prism. Phase 2: CSV upload for non-Prism schools; future LMS/ExamSoft import.' },
  { q: 'ARC-PA 65% response threshold monitoring?', priority: 'P0', answered: true, answer: 'P1: display rate clearly, let schools interpret. Future: configurable threshold with amber/red alerts as the close date nears on a low rate.' },
  { q: 'Publish PCE without a course offering in Prism?', priority: 'P1', answered: true, answer: 'Phase 1 no; Phase 2 CSV fallback so non-Prism schools are not blocked.' },
  { q: 'What question types and answer formats?', priority: 'P0', answered: false, answer: 'Pending. Likely 5-point and 7-point Likert, numeric, free text; university vs program level configuration. Needs a design decision before P1 begins.' },
  { q: 'Can the first implementation be program-level, not university-level?', priority: 'P0', answered: true, answer: 'Yes. Program-level first; university-level standardization is Phase 2.' },
];

interface GapRow extends Record<string, unknown> {
  id: string;
  area: string;
  severity: string;
  why: string;
  fix: string;
  src: string;
}
const DESIGN_GAPS: GapRow[] = [
  { id: 'd1', area: 'Two-instrument architecture not designed', severity: 'critical', why: 'Post-course eval and faculty survey are different instruments: different respondents, routing and anonymity. Faculty surveys route ONLY to the PD; post-course evals route to Faculty + PD + Dean.', fix: 'Two separate flows with distinct routing rules, anonymity settings and result visibility.', src: 'PCE primer v2 + Open Questions doc' },
  { id: 'd2', area: 'Anonymity + grade-timing controls absent', severity: 'critical', why: 'Students must not be identifiable to faculty until grades are locked; the grades-before-close conflict is a known risk with no controls today.', fix: 'Survey window gated on grade submission; faculty see aggregate only; minimum N for small-cohort visibility.', src: 'PCE primer v2' },
  { id: 'd3', area: 'ARC-PA 65% response monitoring absent', severity: 'high', why: 'Touro site visit: below 65% is an accreditation risk; no threshold monitoring or PD alert exists.', fix: 'Response-rate badge per course; amber below 80% with time remaining; red on close below 65%; automated reminders.', src: 'Touro PA site visit (Vishaka, Mar 12)' },
  { id: 'd4', area: 'Feedback loop to students absent', severity: 'high', why: 'No competitor closes the loop either; invisible outcomes depress future participation.', fix: '"Based on your feedback, we changed…" — PD publishes a 1–3 sentence response per course.', src: 'Open Questions + competitor analysis' },
  { id: 'd5', area: 'Longitudinal / multi-term dashboard absent', severity: 'high', why: 'Curriculum drift is only detectable across 3+ semesters; current design shows one term at a time.', fix: 'Multi-term trend per course, cohort comparison, outlier detection.', src: 'PCE primer v2' },
  { id: 'd6', area: 'Dean-level aggregate view absent', severity: 'medium', why: 'Deans need program roll-ups and exception reports, not raw survey data — essential for self-studies.', fix: 'Dean view: program-level roll-up, exception reports, annual review export.', src: 'PCE primer v2' },
  { id: 'd7', area: 'Accreditation-aligned question bank absent', severity: 'medium', why: 'CAPTE/ACOTE/CCNE require documented evidence of collecting and acting on feedback; a pre-mapped bank beats all four competitors.', fix: 'Base bank mapped to CAPTE/ACOTE/CCNE; PDs customize but keep the mapped core.', src: 'Open Questions + PCE primer v2' },
];

interface CompRow extends Record<string, unknown> {
  id: string;
  name: string;
  score: number;
  strength: string;
  weakness: string;
}
const COMPETITORS: CompRow[] = [
  { id: 'blue', name: 'Explorance Blue', score: 3.5, strength: 'Market leader; accreditation-aware; strong anonymity controls.', weakness: 'No AI; weak accreditation export; no feedback loop to students.' },
  { id: 'wm', name: 'Watermark CES', score: 3.5, strength: 'Dean-level fixed questions; strong governance.', weakness: 'No AI; limited longitudinal views; no feedback loop.' },
  { id: 'anth', name: 'Anthology', score: 4, strength: 'Best dean-level aggregate reporting; role-based views.', weakness: 'No AI; same export weaknesses.' },
  { id: 'sm', name: 'SurveyMonkey', score: 2.5, strength: 'Best ease of survey creation; highly customizable.', weakness: 'No accreditation alignment, preset banks, or role-based views.' },
  { id: 'exxat', name: 'Exxat target', score: 5, strength: 'Bundled with Prism at zero marginal cost; accreditation-aligned questions; AI sentiment; feedback loop; 65% threshold monitoring.', weakness: 'Not built yet; switchers need historical data migration.' },
];

function Overview() {
  return (
    <VStack gap={6}>
      <SpecSection
        title="Design gaps"
        sub="Identified from the primer, the Open Questions doc, the Touro site visit and competitor analysis. The two critical rows shaped the P1 architecture."
      >
        <Table<GapRow>
          data={DESIGN_GAPS}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'severity', header: 'Sev', width: pixel(90), renderCell: (r) => <Badge variant={r.severity === 'critical' ? 'error' : r.severity === 'high' ? 'warning' : 'info'} label={r.severity} /> },
            { key: 'area', header: 'Gap', width: pixel(220), renderCell: (r) => <Text type="body" weight="semibold">{r.area}</Text> },
            { key: 'why', header: 'Why it hurts', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.why}</Text> },
            { key: 'fix', header: 'Fix', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.fix}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection
        title="Competitive position"
        sub="From the Open Questions doc. Programs pay ~$5K/yr for standalone tools; 0 of 4 competitors offer AI analysis; none close the feedback loop; LMSs do course eval poorly and without accreditation alignment."
      >
        <Fig title="Competitor scores" caption="Editorial 0–5 scoring from the competitor analysis; the Exxat row is the design target, not a shipped product.">
          <RankedList
            rows={COMPETITORS.map((c) => ({ key: c.id, label: c.name, value: c.score, hint: c.weakness }))}
            format={(r) => `${r.value}/5`}
          />
        </Fig>
        <Link href={hrefCompetitive(PRODUCT_ID)} isStandalone>
          Full parity matrix →
        </Link>
      </SpecSection>
      <SpecSection
        title="Transcript-grounded architecture facts"
        sub="Session bde86866 (Mar 24): PCE lives INSIDE the surveys module as a premium tile with two entry points (surveys tile for admins, per-course for faculty); Prism course offerings are the distribution prerequisite with a Phase-2 CSV fallback; faculty need an aggregate cross-course dashboard, not per-course tiles only; Marquette shows why clinical and didactic courses need separate question sets."
      >
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Marquette pain (David, Mar 24): the university forced didactic-focused questions onto clinical placements —
            students answered "Did this course expose you to diverse patient populations?" for classroom courses, forcing
            artificially low ratings. Phase 1: separate clinical vs didactic question sets. Phase 2: tenant-level questions
            with program-level override.
          </Text>
        </Card>
      </SpecSection>
    </VStack>
  );
}

function Instruments() {
  return (
    <VStack gap={6}>
      <SpecSection title="The two instruments — fundamentally different" sub="From post_course_eval_primer_v2, the authoritative product spec.">
        <Grid columns={{ minWidth: 340, max: 2 }} gap={3}>
          <Card padding={4}>
            <VStack gap={1.5}>
              <HStack gap={2} vAlign="center">
                <Text type="body" weight="semibold">
                  Post-Course Evaluation
                </Text>
                <Badge variant="error" label="PRIMARY" />
              </HStack>
              {[
                'Respondents: students. Routes to Faculty + Program Director + Dean.',
                'Timing: opens after the final grade-influencing activity, before grades lock.',
                'Anonymity: anonymous to instructor until grades are locked; faculty see aggregate, never individuals.',
                'Accreditation: CAPTE, ACOTE, CCNE require documented evidence of systematic collection and action.',
              ].map((t, i) => (
                <Text key={i} type="supporting" as="p" textWrap="pretty">
                  {t}
                </Text>
              ))}
            </VStack>
          </Card>
          <Card padding={4}>
            <VStack gap={1.5}>
              <HStack gap={2} vAlign="center">
                <Text type="body" weight="semibold">
                  Faculty Survey
                </Text>
                <Badge variant="neutral" label="SECONDARY" />
              </HStack>
              {[
                'Respondents: faculty (self-reflection). Routes to the Program Director ONLY — never deans in raw form.',
                'Timing: opens after the post-course eval closes (1–2 weeks after the course).',
                'Anonymity: confidential to the PD; deans see aggregated summaries only. NOT a performance evaluation.',
                'Supports the PD–faculty development relationship; not a primary accreditation instrument.',
              ].map((t, i) => (
                <Text key={i} type="supporting" as="p" textWrap="pretty">
                  {t}
                </Text>
              ))}
            </VStack>
          </Card>
        </Grid>
      </SpecSection>
      <SpecSection title="Survey timing cascade" sub="Timing is not arbitrary: end of course → PCE opens (students) · 1–2 weeks post-course → faculty survey opens · end of term → PD reviews both, dean reviews synthesis · annually → program-level evaluation report to the accreditor." >
        <Card variant="muted" padding={3}>
          <VStack gap={1.5}>
            <Text type="label" color="secondary">
              PCE structure (Post_course_evaluation_survey_tool.docx, MSU-PA June 2022)
            </Text>
            {[
              'Section 1 — rate the course: design + content, flow and pacing, rigor, time allocation, assessment quality, overall rating.',
              'Section 2 — rate the personnel: course coordinator/director, each teaching faculty individually, adjuncts/guest lecturers (even if outside Exxat). Threshold: faculty must have taught ≥N hours (program-configurable).',
              'Setup requirements: define recipients and review objects, add guest lecturers by name, build structure + questions, set timeline with auto-reminders, configure result access.',
            ].map((t, i) => (
              <Text key={i} type="supporting" as="p" textWrap="pretty">
                {t}
              </Text>
            ))}
          </VStack>
        </Card>
        <Card variant="muted" padding={3}>
          <VStack gap={1.5}>
            <Text type="label" color="secondary">
              Real result formats (Immunomicro PCOM 2018 · Marquette PT Spring 2025)
            </Text>
            {[
              'Rating scales: 5-point (SD→SA) or 6-point (VP→E) — medical programs often use 6-point to avoid midpoint clustering.',
              'Per-instructor comparison vs department and all-faculty averages with percentile rank (e.g. 4.7 vs 4.4 → 85th percentile).',
              'Response-rate tracking: 81/89 (91.0%) Immunomicro; 53/67 (79.1%) Marquette PT; ARC-PA minimum 65%.',
              'Free-text comments separated by question and respondent; the program decides which comments faculty see.',
              'Longitudinal comparison absent from both samples — the gap vs Blue/Watermark.',
            ].map((t, i) => (
              <Text key={i} type="supporting" as="p" textWrap="pretty">
                {t}
              </Text>
            ))}
          </VStack>
        </Card>
      </SpecSection>
    </VStack>
  );
}

function Stakeholders() {
  const CASCADE = [
    { role: 'Student', sees: 'Their own responses; optional aggregated prior-cohort trends; "what changed based on your feedback" notifications.', use: 'Complete the evaluation at course end. Their voice is the primary driver of course-level improvement — visible responses build trust and future participation.' },
    { role: 'Faculty', sees: 'AGGREGATE results only, never individual responses, and only after grades lock. Department and all-faculty averages for comparison.', use: 'Understand the gap between teaching intent and student experience; adjust syllabi and delivery.' },
    { role: 'Program Director', sees: 'Everything: anonymized individual comments, per-faculty scores, longitudinal trends, faculty surveys in full, response-rate monitoring.', use: 'Monitor course quality, flag outliers, initiate reviews, support faculty development; data-driven curriculum decisions.' },
    { role: 'Dean / Academic Leadership', sees: 'Program-level roll-ups ONLY — no course-level data, no individual faculty survey responses. Exception alerts.', use: 'Program-wide quality, accreditation readiness, resource allocation, annual program review.' },
  ];
  return (
    <VStack gap={6}>
      <SpecSection title="Stakeholder cascade" sub="Information cascades student → faculty → PD → dean; each level has different visibility rights, decision context and UX needs.">
        <Grid columns={{ minWidth: 340, max: 2 }} gap={3}>
          {CASCADE.map((s) => (
            <Card key={s.role} padding={4}>
              <VStack gap={1.5}>
                <Text type="body" weight="semibold">
                  {s.role}
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  Sees: {s.sees}
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  Uses it to: {s.use}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </SpecSection>
      <SpecSection title="Persona entry points" sub="Sessions c7a8d32e + bde86866.">
        <Card variant="muted" padding={3}>
          <VStack gap={1.5}>
            {[
              'Program Director / Admin: Survey section → PCE tile → program analytics (course leaderboard, faculty leaderboard, cohort trend).',
              'Faculty: course page → results for that course (after admin publishes) AND a faculty dashboard aggregating all courses they teach.',
              'Student: receives the survey at course end via email or LMS, configured per course by the admin.',
            ].map((t, i) => (
              <Text key={i} type="supporting" as="p" textWrap="pretty">
                {t}
              </Text>
            ))}
          </VStack>
        </Card>
      </SpecSection>
    </VStack>
  );
}

function Questions() {
  const answered = OPEN_QUESTIONS.filter((q) => q.answered).length;
  return (
    <SpecSection
      title="Open questions ledger"
      sub={`${OPEN_QUESTIONS.length} product questions, ${answered} answered (Monil Mar 26 + Mohil/Vishaka/David Mar 24 + PCE Primer v2). One remains open: question types and answer formats. Design can proceed on P1 scope.`}
    >
      <VStack gap={2}>
        {OPEN_QUESTIONS.map((q, i) => (
          <Collapsible
            key={i}
            defaultIsOpen={false}
            trigger={
              <HStack gap={2} vAlign="center">
                <Badge variant={q.priority === 'P0' ? 'error' : q.priority === 'P1' ? 'warning' : 'info'} label={q.priority} />
                <Badge variant={q.answered ? 'success' : 'error'} label={q.answered ? 'answered' : 'OPEN'} />
                <Text type="body">{q.q}</Text>
              </HStack>
            }
          >
            <Text type="supporting" as="p" textWrap="pretty">
              {q.answer}
            </Text>
          </Collapsible>
        ))}
      </VStack>
    </SpecSection>
  );
}

function Strategy() {
  return (
    <VStack gap={6}>
      <SpecSection title="The north star" sub="Aarti · PRISM Day 3 · Mar 4 (session c7a8d32e). The product is a program quality intelligence dashboard, not a form tool with a reporting tab.">
        <Blockquote cite="Aarti · PRISM Day 3 · Mar 4, 2026">
          Which courses are doing better? Which faculty are not doing better? How are my cohorts perceiving my curriculum, and
          what changes do I need to make? I want AI insights embedded in the dashboard — not a button I click to get AI
          insights. If I see a button that says click here to get AI insights, I am done.
        </Blockquote>
        <Grid columns={{ minWidth: 260, max: 3 }} gap={3}>
          {[
            { title: 'Course leaderboard', q: 'Which courses are doing best — and worst — this semester?', d: 'All courses ranked by average score, trending vs last semester, below-threshold courses flagged automatically. The leaderboard IS the AI insight.' },
            { title: 'Faculty leaderboard', q: 'Which faculty need attention — who should be recognized?', d: 'Faculty ranked by student perception, year-over-year per faculty, new faculty auto-flagged for observation. "This is what keeps the dean up at night."' },
            { title: 'Cohort trend', q: 'How does the class of 2026 perceive the curriculum vs 2025?', d: 'Cohort-level comparison signals curriculum drift and faculty turnover impact — the accreditation improvement story.' },
          ].map((v) => (
            <Card key={v.title} padding={3}>
              <VStack gap={1}>
                <Text type="body" weight="semibold">
                  {v.title}
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  {v.q}
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  {v.d}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </SpecSection>
      <SpecSection title="Anti-patterns — Aarti verbatim" sub="Session c7a8d32e.">
        <Card variant="muted" padding={3}>
          <VStack gap={1.5}>
            {[
              '"Click here for AI insights" button — insights are embedded in the leaderboard layout; there is no separate AI panel.',
              'Flat alphabetical course list → click → report — show the picture first; details are drill-downs, not the entry point.',
              'No time dimension — directors always look at the previous semester; organize by term with trending indicators.',
              'Collecting data without connecting it to decisions — Qualtrics collects too; the moat is connecting evaluations to curriculum changes, accreditation reports and faculty development.',
            ].map((t, i) => (
              <Text key={i} type="supporting" as="p" textWrap="pretty">
                {t}
              </Text>
            ))}
          </VStack>
        </Card>
      </SpecSection>
      <SpecSection title="D2L gaps that become Exxat opportunities" sub="D2L BrightSpace demo · Mar 4 (c7a8d32e).">
        <Card variant="muted" padding={3}>
          <VStack gap={1.5}>
            {[
              'No in-document annotation feedback → let faculty annotate submitted PDFs (comments, highlights, ink) and publish to students.',
              'No publish/draft state for grades → grade all, review, publish at once; every LMS has this, Exxat does not.',
              'No auto-alert for inactive students → rule-based notifications D2L ships built-in.',
              'ExamSoft being sold by Turnitin → the displacement window is open; take the clinical education slice LMSs cannot serve.',
            ].map((t, i) => (
              <Text key={i} type="supporting" as="p" textWrap="pretty">
                {t}
              </Text>
            ))}
          </VStack>
        </Card>
      </SpecSection>
    </VStack>
  );
}

function Build() {
  const LAYERS = [
    { n: '1', label: 'Template Setup', who: 'Admin / Program Director', items: ['Select program + course type (clinical / didactic)', 'Maximum 2 templates per program', 'Fixed structure: course section (5–6 Qs) + faculty section (5–6 Qs)', 'Templates saved at program level, reusable across offerings', 'Toggle course vs faculty sections independently', 'Add 1–3 supplemental questions beyond the base'] },
    { n: '2', label: 'Distribution', who: 'Admin / PD (TBD)', items: ['Select template for program + course type', 'Choose the course offering (e.g. "ABC Spring 2026")', 'Auto-populate student + faculty lists from Prism', 'Faculty management: review/edit assignments, guest faculty', 'TAs and part-time faculty included for evaluation', 'Survey window: open/close dates'] },
    { n: '3', label: 'Analytics & Reporting', who: 'PD + Faculty + Dean', items: ['Year-over-year faculty performance', 'Cross-faculty comparison within programs', 'Response-rate monitoring per course', 'Program-level benchmarking', 'AI sentiment: improvement vs compliment classification', 'AI SWOT visualization per course', 'AI cross-program complaint analysis', 'Top-category extraction from qualitative responses'] },
  ];
  return (
    <VStack gap={6}>
      <SpecSection
        title="Milestones"
        sub="Apr 10 leadership presentation (Vishaka · David · Aarti): draft journey visualizations, template creation workflow, distribution workflow — mockups in the Exxat DS, not a prototype. Requirement + design freeze end of April; engineering handoff May 2026. Strategic value: PCE is the sales entry point for non-Prism programs. Sources: Monil Mar 26 + Romit<>Monil PRD Mar 30."
      >
        <Fig title="PCE design readiness by module" caption="Sources: Granola Jul 20 + Jul 28. Multi-survey analytics is paused because its requirements are not frozen — the red bar is a decision queue, not a build queue.">
          <RankedList
            rows={[
              { key: 'template', label: 'Template builder', value: 85, hint: 'role feedback incorporated; default toggle removed' },
              { key: 'dist', label: 'Distribution workflow', value: 80, hint: 'single table with soft warnings — confirmed Jul 20' },
              { key: 'single', label: 'Single survey analytics (View Results)', value: 75, hint: 'due engineering end of Jul 28 week' },
              { key: 'comms', label: 'Communication settings', value: 70, hint: 'centralized, not per-survey — confirmed Jul 28' },
              { key: 'multi', label: 'Multi-survey analytics', value: 30, hint: 'paused — requirements not frozen (Jul 28)' },
              { key: 'ai', label: 'AI narrative synthesis', value: 5, hint: 'Q3 post-beta; not in Sep 15 scope' },
            ]}
            format={(r) => `${r.value}%`}
            errorBelow={50}
          />
        </Fig>
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Launch timeline: Sep 15 2026 beta build-ready (5–10 programs, template + distribution live) → Sep Cohere demo
            (analytics/leaderboard, not distribution) → Nov/Dec first beta usage (fall evaluations) → Jan 2027 GA
            (self-checkout, monetized) → Q1 2027 100-program target with accreditation reporting.
          </Text>
        </Card>
      </SpecSection>
      <SpecSection title="3-layer architecture" sub="Confirmed by Monil (Mar 26).">
        <Grid columns={{ minWidth: 280, max: 3 }} gap={3}>
          {LAYERS.map((l) => (
            <Card key={l.n} padding={3}>
              <VStack gap={1.5}>
                <HStack gap={2} vAlign="center">
                  <Badge variant="neutral" label={l.n} />
                  <Text type="body" weight="semibold">
                    {l.label}
                  </Text>
                </HStack>
                <Text type="supporting">{l.who}</Text>
                {l.items.map((it, i) => (
                  <Text key={i} type="supporting" as="p" textWrap="pretty">
                    {it}
                  </Text>
                ))}
              </VStack>
            </Card>
          ))}
        </Grid>
      </SpecSection>
      <SpecSection
        title="AI differentiation — without 'AI-powered' branding"
        sub="Competitors provide basic math (median, mode, mean). Exxat surfaces integrated insights automatically: sentiment classification, SWOT visualization, cross-program complaint analysis, top-category extraction, comment filtering by signal type, faculty-vs-program auto-benchmarks. Monil directive: complete Watermark CES and Explorance Blue video walkthroughs before designing the analytics layer — their missing YoY/AI summaries are the gap."
      >
        <Card variant="muted" padding={3}>
          <VStack gap={1.5}>
            <Text type="label" color="secondary">
              Open questions from Monil (Mar 26)
            </Text>
            {[
              'P0 — Who distributes surveys: program director, course coordinator, or admin?',
              'P0 — What is the user value hierarchy per persona?',
              'P1 — Which response-rate tactics are in scope (incentives, gamification)?',
              'P1 — How do free-text comment links to question categories work?',
              'P1 — Cross-faculty comparison methodology and fairness?',
              'P2 — Should a future question bank integrate with exam management banks?',
            ].map((t, i) => (
              <Text key={i} type="supporting" as="p" textWrap="pretty">
                {t}
              </Text>
            ))}
          </VStack>
        </Card>
      </SpecSection>
    </VStack>
  );
}

export function CourseEvalView() {
  const [section, setSection] = useSection(SECTIONS, 'overview');
  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="Course & Faculty Eval — spec archive"
        lede="PCE: a premium survey tile inside the surveys module, built on FaaS — Sep 15 beta target, 103 warm programs."
        meta="Two instruments (post-course eval + faculty survey) · 24-question ledger 23 answered · Apr 10 leadership demo · May 2026 engineering handoff"
      />
      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />
      {section === 'overview' && <Overview />}
      {section === 'instruments' && <Instruments />}
      {section === 'stakeholders' && <Stakeholders />}
      {section === 'questions' && <Questions />}
      {section === 'strategy' && <Strategy />}
      {section === 'build' && <Build />}
      <SpecFooter productId={PRODUCT_ID} />
    </VStack>
  );
}
