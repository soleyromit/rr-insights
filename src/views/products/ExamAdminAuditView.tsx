// views/products/ExamAdminAuditView.tsx — Exam Management admin design audit
// (v18 Astryx). Hero: severity-ranked finding groups. 6 role journeys, 27
// stories, 12 UX gaps, 10 standards checks, 5 AI stories — audit date Mar 26.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Fig } from '../../components/charts/Fig';
import { RankedList } from '../../components/charts/RankedList';
import { SpecSection } from './spec/SpecSection';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { SpecFooter } from './spec/SpecFooter';
import { hrefInsights } from '../../lib/links';

const PRODUCT_ID = 'exam-management';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'journeys', label: 'Role journeys' },
  { id: 'stories', label: 'Story set' },
  { id: 'gaps', label: 'UX gaps' },
  { id: 'standards', label: 'Standards' },
  { id: 'ai', label: 'AI stories' },
];

interface JourneyStep {
  step: string;
  action: string;
  screen: string;
  pain: string;
}
interface Role {
  id: string;
  label: string;
  job: string;
  frequency: string;
  mentalModel: string;
  frustrations: string[];
  journey: JourneyStep[];
}

const ROLES: Role[] = [
  {
    id: 'faculty', label: 'Faculty / Course Director', job: 'Build exams, manage the question bank, review results', frequency: 'Daily during exam periods, weekly otherwise',
    mentalModel: 'Thinks in courses and cohorts, not abstract question IDs. Builds from topic clusters.',
    frustrations: ['Manages questions across ExamSoft AND a spreadsheet — no multi-campus sharing', 'Approval process entirely offline (email + printouts)', 'Analytics require CSV export into Excel', 'No visibility into whether a question was used before or how it performed'],
    journey: [
      { step: 'Start', action: 'Open the dashboard', screen: 'Exam list / home', pain: 'Lands inside an exam — no overview of all exams' },
      { step: 'Build', action: 'Create or clone an exam', screen: 'Build phase', pain: 'Clone-from-previous is not designed — critical for 80% of use cases' },
      { step: 'Questions', action: 'Add from bank or create', screen: 'Build + QB panel', pain: 'A side drawer cannot support browsing 1,800+ questions' },
      { step: 'Tag', action: "Tag Bloom's, difficulty, competency", screen: 'Question Editor', pain: 'Tagging is manual; AI suggestion only on explicit request' },
      { step: 'Submit', action: 'Submit for dept head review', screen: 'Publish phase', pain: 'Review flow not designed — who is notified, where do they review?' },
      { step: 'Publish', action: 'Pass the accessibility gate', screen: 'Publish phase', pain: 'Works, but accommodation assignment is per-student, not bulk' },
      { step: 'Monitor', action: 'Watch the live exam', screen: 'Live phase', pain: 'Proxy submit exists but no communication template for disconnections' },
      { step: 'Score', action: 'Review item stats, curve, release', screen: 'Post-exam', pain: 'No bulk action for multiple flagged questions' },
    ],
  },
  {
    id: 'dept-head', label: 'Dept Head / Program Director', job: 'Approve questions, review exam quality, sign off before publish', frequency: 'Weekly review cycles',
    mentalModel: 'Thinks in program outcomes and accreditation compliance — aggregate signals, not per-question detail.',
    frustrations: ['Review queue is entirely offline today', 'Cannot see psychometric quality before approving', 'No cross-cohort comparison', 'Accreditation reports compiled manually from multiple sources'],
    journey: [
      { step: 'Dashboard', action: 'See the review queue', screen: 'Home', pain: 'NO home screen exists — no queue surface, no at-a-glance status' },
      { step: 'Review', action: 'Open a question in review', screen: 'Question reviewer', pain: 'No dedicated reviewer view — reuses the faculty editor' },
      { step: 'Approve / reject', action: 'Decide with comments', screen: 'Editor (review mode)', pain: 'Approve exists only as a hover button; no dedicated workflow' },
      { step: 'Blueprint check', action: 'Verify NCCPA/PAEA coverage', screen: 'Build analytics', pain: 'Blueprint check NOT BUILT — a P1 missing feature' },
      { step: 'Sign off', action: 'Sign off for publish', screen: 'Publish phase', pain: 'No notification back to faculty when sign-off completes' },
      { step: 'Post-exam', action: 'Review cohort performance', screen: 'Post-exam analytics', pain: 'Works well for PA; needs generalization to other disciplines' },
    ],
  },
  {
    id: 'contributor', label: 'Contributor (Associate Faculty)', job: 'Write questions for assigned sections only', frequency: 'Sporadic — per exam cycle',
    mentalModel: 'Thinks in their subject area only; does not know the full exam structure.',
    frustrations: ['Cannot see what other contributors already wrote', 'Cannot tell if their style matches the program standard', 'No feedback loop after submission — questions disappear into review'],
    journey: [
      { step: 'Assignment', action: 'Receive a task from head faculty', screen: 'Notification', pain: 'No assignment notification designed — assumed out-of-band' },
      { step: 'Create', action: 'Write in the assigned section', screen: 'Editor (scoped)', pain: 'Same editor as faculty — no scoped view, no inline style guide' },
      { step: 'Submit', action: 'Submit for review', screen: 'Editor', pain: 'No clear status feedback after submission' },
      { step: 'Feedback', action: 'Learn the outcome', screen: 'Status view', pain: 'No feedback view — the contributor never learns what happened' },
    ],
  },
  {
    id: 'reviewer', label: 'Reviewer (assigned by Dept Head)', job: 'Validate clinical accuracy within an assigned scope', frequency: '1–2 review sessions per semester',
    mentalModel: 'Subject matter expert who validates; does not build exams.',
    frustrations: ['No baseline vs past questions in the same topic', 'No inline comments on a specific part of the stem', 'No review context — related questions and past performance invisible'],
    journey: [
      { step: 'Queue', action: 'Open the scoped review queue', screen: 'Review queue', pain: 'NO dedicated reviewer queue screen' },
      { step: 'Review', action: 'Evaluate the question', screen: 'Read-only viewer', pain: 'Sees the edit-mode editor — confusing affordance mismatch' },
      { step: 'Comment', action: 'Comment on specific text', screen: 'Comment layer', pain: 'Comments not designed — only global approve/reject' },
      { step: 'Decision', action: 'Approve / reject / revise', screen: 'Review decision', pain: 'Exists only as a hover action in the build phase' },
    ],
  },
  {
    id: 'outcome-director', label: 'Outcome Director / Accreditation', job: 'Map questions to competency outcomes; generate accreditation reports', frequency: 'Monthly, intensive pre-accreditation',
    mentalModel: 'Thinks in compliance and longitudinal trend.',
    frustrations: ['Manually compiles exam data for the ARC-PA self-study', 'Curriculum mapping only 50–60% accurate in the current AI implementation', 'Cannot see which competency areas are consistently undertested', 'ExamSoft history import breaks longitudinal analysis'],
    journey: [
      { step: 'Dashboard', action: 'Open the compliance dashboard', screen: 'Outcome dashboard', pain: 'NOT DESIGNED — no accreditation/outcome view exists' },
      { step: 'Coverage', action: 'Check blueprint coverage across exams', screen: 'Coverage map', pain: 'Blueprint coverage map NOT BUILT — "a life saver" per Ed Razenbach' },
      { step: 'Export', action: 'Export the ARC-PA report', screen: 'Reports', pain: 'CSV export exists per exam but no program-level multi-exam report' },
    ],
  },
  {
    id: 'inst-admin', label: 'Institution Admin', job: 'Configure programs, manage users, audit access, set global rules', frequency: 'Setup-heavy at start of year',
    mentalModel: 'Thinks in configuration and compliance — set guardrails, then step back.',
    frustrations: ['Cannot see who accessed the question bank and when (partially solved)', 'Accommodation profiles set per-exam — 70 setups for 7 students', 'No bulk user import or role assignment', 'Multi-campus sharing requires manual export/import'],
    journey: [
      { step: 'Setup', action: "Configure settings, Bloom's scale, roles", screen: 'Program settings', pain: 'Settings screen NOT DESIGNED — only implied via editor toggles' },
      { step: 'Accommodations', action: 'Assign program-level profiles', screen: 'Accommodation manager', pain: 'Modal exists but assignment is per-exam, not program-level' },
      { step: 'Audit', action: 'Check exam-window bank access', screen: 'Audit trail', pain: 'Audit trail IS designed — this works' },
      { step: 'Multi-campus', action: 'Share questions cross-campus', screen: 'QB sharing', pain: 'A stub — no sharing UI beyond a menu item' },
    ],
  },
];

interface StoryRec extends Record<string, unknown> {
  id: string;
  epic: string;
  type: string;
  role: string;
  story: string;
  src: string;
  built: boolean;
  priority: string;
}
const STORIES: StoryRec[] = [
  { id: 'UA-01', epic: 'Exam Dashboard (missing)', type: 'User', role: 'All admins', story: 'Opening Exam Management should show active exams, review queue count and the next scheduled exam at a glance.', src: 'All stakeholder sessions — no home screen is a critical gap', built: false, priority: 'P0' },
  { id: 'UA-02', epic: 'Exam Dashboard (missing)', type: 'User', role: 'Faculty', story: 'Clone a previous exam and modify it — 80–85% of exams are incremental changes.', src: 'Akshit Q2 (template-first) + ExamSoft comparison', built: false, priority: 'P0' },
  { id: 'UB-01', epic: 'Build Phase', type: 'User', role: 'Faculty', story: 'A blueprint coverage bar during build showing covered vs missing NCCPA/PAEA content areas.', src: 'Ed: "Pick assessment from blueprint… life saver!"', built: false, priority: 'P1' },
  { id: 'UB-02', epic: 'Build Phase', type: 'User', role: 'Faculty', story: "Search/filter the bank by topic, Bloom's, difficulty, past performance, and 'not used in last 2 exams'.", src: 'QB architecture (f59ac2a6)', built: false, priority: 'P1' },
  { id: 'UB-03', epic: 'Build Phase', type: 'User', role: 'Faculty', story: 'Smart Views that auto-populate on my criteria, reusable across exam cycles.', src: 'QB architecture (8c94698f)', built: false, priority: 'P2' },
  { id: 'UB-04', epic: 'Build Phase', type: 'Interaction', role: 'Faculty', story: 'Dragging a question from the bank panel animates into the section showing status, marks and a11y flags without opening the editor.', src: 'Standard drag-to-add pattern', built: false, priority: 'P1' },
  { id: 'UB-05', epic: 'Build Phase', type: 'User', role: 'Contributor', story: 'See only my assigned sections plus an inline program style guide.', src: 'Nipun Q2 — multi-professor workflow', built: false, priority: 'P2' },
  { id: 'UQ-01', epic: 'Question Editor', type: 'Functional', role: 'Faculty', story: 'After I type a stem, AI suggests 4 answer options as shadows — accept or ignore, never interrupting.', src: 'Arun: "AI always ready to propose without disrupting manual control"', built: false, priority: 'P1' },
  { id: 'UQ-02', epic: 'Question Editor', type: 'Functional', role: 'Faculty', story: 'A versioning panel: all past versions, who edited, which exams pin to which version.', src: 'QB architecture (8c94698f)', built: false, priority: 'P1' },
  { id: 'UQ-03', epic: 'Question Editor', type: 'Functional', role: 'Reviewer', story: 'A read-only reviewer view with inline annotation — highlight words, attach comments.', src: 'Reviewer workflow gap (this audit)', built: false, priority: 'P1' },
  { id: 'UQ-04', epic: 'Question Editor', type: 'Functional', role: 'Faculty', story: 'A "used in" panel: past exams, per-exam correct-% and discrimination index.', src: 'ExamSoft per-question analytics comparison', built: false, priority: 'P1' },
  { id: 'UQ-05', epic: 'Question Editor', type: 'Interaction', role: 'Faculty', story: 'Selecting OSCE Rubric transforms the editor into a rubric table builder with an intentional transition.', src: 'OSCE rubric as type 10 — Ed Razenbach', built: true, priority: 'P1' },
  { id: 'UR-01', epic: 'Review Workflow (missing)', type: 'User', role: 'Dept Head', story: 'A dedicated review queue sorted by wait time with preview and one-click approve/reject/comment.', src: 'Day 2 Marriott: approvals entirely offline', built: false, priority: 'P0' },
  { id: 'UR-02', epic: 'Review Workflow (missing)', type: 'User', role: 'Reviewer', story: 'A scoped queue for my subject areas with the question and its AI-suggested tags side-by-side.', src: 'Role-based access design (this audit)', built: false, priority: 'P1' },
  { id: 'UR-03', epic: 'Review Workflow (missing)', type: 'Functional', role: 'Faculty', story: 'On rejection: an in-app notification with the reviewer comment and a direct link to revise.', src: 'Offline approval pain — QB architecture', built: false, priority: 'P1' },
  { id: 'UP-01', epic: 'Publish Phase', type: 'User', role: 'Inst Admin', story: 'Program-level accommodation profiles that apply to all exams automatically — not 70 per-exam setups.', src: 'D2L: 7 students × 10 quizzes = 70 setups; profile = 1', built: false, priority: 'P0' },
  { id: 'UP-02', epic: 'Publish Phase', type: 'Interaction', role: 'Faculty', story: 'The accessibility gate animates through its checklist per item before unlocking publish.', src: 'Gate exists; interaction is static', built: false, priority: 'P2' },
  { id: 'UP-03', epic: 'Publish Phase', type: 'Functional', role: 'Faculty', story: 'Per-section behavior config: return allowed, individual timing, prep screens — separate from global settings.', src: 'Aarti/Kunal session (f29a990d)', built: false, priority: 'P1' },
  { id: 'UL-01', epic: 'Live Phase', type: 'User', role: 'Faculty', story: 'A student "raise hand" flag appears immediately in the live monitor with name and question number.', src: 'Live monitoring UX beyond the progress table', built: false, priority: 'P1' },
  { id: 'UL-02', epic: 'Live Phase', type: 'Functional', role: 'Faculty', story: 'Extend time for one student mid-exam and see their timer update in real time.', src: '"+Time" button exists but is not interactive', built: false, priority: 'P1' },
  { id: 'UL-03', epic: 'Live Phase', type: 'Functional', role: 'Inst Admin', story: 'See which questions are most-flagged live to catch a flawed question before the exam ends.', src: 'Live analytics — not in the current design', built: false, priority: 'P2' },
  { id: 'UPE-01', epic: 'Post-Exam Phase', type: 'User', role: 'Faculty', story: 'Apply a curve to all flagged questions in one step, with a grade-impact preview.', src: 'Item analytics — partial implementation', built: false, priority: 'P1' },
  { id: 'UPE-02', epic: 'Post-Exam Phase', type: 'Functional', role: 'Outcome Director', story: 'A competency coverage report by ARC-PA/NCCPA area with per-item performance, self-study-ready.', src: 'Outcome Director journey gap', built: false, priority: 'P1' },
  { id: 'UPE-03', epic: 'Post-Exam Phase', type: 'User', role: 'Dept Head', story: 'Compare this cohort against the last 3 cohorts on the same exam without a spreadsheet.', src: 'Day 1 Marriott (e9e48150) student success vision', built: false, priority: 'P2' },
  { id: 'AI-01', epic: 'AI — Question Generation', type: 'AI', role: 'Faculty', story: 'With a topic tag selected, AI proactively offers "Generate 5 MCQs on this topic at Apply level" as a ghost CTA.', src: 'Arun: "AI everywhere it helps, never in the way."', built: false, priority: 'P1' },
  { id: 'AI-02', epic: 'AI — Blueprint Assembly', type: 'AI', role: 'Faculty', story: 'Type "build a 30-question NCCPA-blueprint exam for PA2, 60% Apply or above" and get a draft to accept/swap/delete.', src: 'Ed: blueprint assembly "life saver"', built: false, priority: 'P1' },
  { id: 'AI-03', epic: 'AI — Distractor Quality', type: 'AI', role: 'Faculty', story: 'From a stem + correct answer, AI generates 3 clinically plausible distractors; regenerate any single one.', src: 'Touro ExamSoft demo (f5d66e4c)', built: false, priority: 'P1' },
  { id: 'AI-04', epic: 'AI — Post-Exam Insights', type: 'AI', role: 'Dept Head', story: 'A plain-English results summary ("Section B performed 12% below average; 3 drug-interaction questions have the lowest discrimination…").', src: 'Arun 3-year vision — analytics interpretation', built: false, priority: 'P2' },
  { id: 'AI-05', epic: 'AI — Remediation', type: 'AI', role: 'Faculty / DCE', story: 'On an EOR fail, AI suggests a remediation exam targeted at the student’s weak items, not just the specialty.', src: 'Ed: per-specialty remediation + Arun: personalized assessment', built: false, priority: 'P2' },
];

interface Gap extends Record<string, unknown> {
  id: string;
  area: string;
  severity: string;
  effort: string;
  why: string;
  fix: string;
}
const UX_GAPS: Gap[] = [
  { id: 'g1', area: 'No home screen / dashboard', severity: 'critical', effort: 'High', why: 'Admin lands directly inside an exam. No overview, review queue, pending tasks, or schedule — every role\'s "what needs my attention?" is unanswered at entry.', fix: 'Home: exam table (status, date, action needed), per-role review queue count, next 3 scheduled exams, quick KPIs.' },
  { id: 'g2', area: 'Question bank is a side panel', severity: 'critical', effort: 'High', why: 'A 320px drawer cannot support 1,800+ questions across 5+ filter dimensions with performance data. This is a core tool, not a supporting feature.', fix: 'Full-screen QB view: search, multi-filter rail, card/list toggle, smart views sidebar, per-question performance preview.' },
  { id: 'g3', area: 'Review workflow entirely absent', severity: 'critical', effort: 'High', why: 'Approve exists only as a hover button. No queue, no inline comments, no outcome notifications, no reviewer view. ExamSoft does this offline — Exxat\'s clearest daily-use win.', fix: 'Dedicated queues for Dept Head + Reviewer; comment threads per word/sentence; approval/rejection notifications.' },
  { id: 'g4', area: 'Blueprint coverage check missing', severity: 'high', effort: 'Medium', why: 'Ed called blueprint-driven assembly "a life saver"; today there is no coverage map or gap alert at all.', fix: 'Build-phase coverage bar per content area; alert on under-represented areas; "Build exam from blueprint" AI assembly.' },
  { id: 'g5', area: 'Accommodation assignment per-exam', severity: 'high', effort: 'Medium', why: 'The program-level profile concept exists but bulk assignment is not built — students are still assigned one at a time.', fix: 'Program-level profiles; bulk assignment via CSV or group select; auto-apply to all future exams.' },
  { id: 'g6', area: 'Exam clone / template workflow absent', severity: 'high', effort: 'Low', why: '80–85% of exams are incremental edits, but faculty rebuild from scratch every cycle.', fix: '"Clone" on each exam copies questions, sections and settings.' },
  { id: 'g7', area: 'Question versioning invisible', severity: 'medium', effort: 'Medium', why: 'Architecturally correct version pinning is invisible — faculty cannot see whether they are editing an exam-pinned version.', fix: 'Version history drawer: edit timeline, editors, exam pins; editing a pinned version forks.' },
  { id: 'g8', area: 'No live flag-rate monitoring', severity: 'medium', effort: 'Medium', why: 'Many students flagging the same question live usually means a flawed question, but no aggregate signal exists.', fix: 'Live flag heatmap; alert when >20% of students flag one question.' },
  { id: 'g9', area: 'No post-exam bulk actions', severity: 'medium', effort: 'Low', why: 'Curves apply one question at a time even when many are flagged.', fix: 'Multi-select + bulk action (credit / exclude / flag) with grade-impact preview.' },
  { id: 'g10', area: 'Outcome Director has no view', severity: 'medium', effort: 'High', why: "No accreditation-oriented view: no year-wide Bloom's distribution, competency coverage map, or cohort trend.", fix: "Outcome dashboard: Bloom's distribution, competency heatmap vs blueprint, cohort trends, one-click self-study export." },
  { id: 'g11', area: 'Section behavior not configurable at publish', severity: 'low', effort: 'Low', why: 'No per-section lock (GRE model), time limits, or prep screen content in the Publish phase.', fix: 'Section settings accordion: lock, time override, prep screen title + instructions.' },
  { id: 'g12', area: 'Contributor feedback loop broken', severity: 'low', effort: 'Low', why: 'Contributors never learn if their question was approved, rejected, or modified.', fix: 'In-app notification with the reviewer comment inline.' },
];

interface Std extends Record<string, unknown> {
  id: string;
  standard: string;
  status: string;
  detail: string;
}
const STANDARDS: Std[] = [
  { id: 's1', standard: 'Progressive disclosure', status: 'Partial', detail: 'Build-phase accordions are good; role banners should be contextual callouts; the editor shows all tagging fields at once instead of primary-first.' },
  { id: 's2', standard: 'Consistent empty states', status: 'Missing', detail: 'No empty state for an empty bank, a 0-question exam, or first-run. Empty states should point to the next action (add / import / AI).' },
  { id: 's3', standard: 'Feedback on every action', status: 'Partial', detail: '"Save draft", bank "Add" and "Proxy submit" all lack confirmations.' },
  { id: 's4', standard: 'Keyboard accessibility (WCAG 2.1 AA)', status: 'Missing', detail: 'No focus ring styles, documented tab order, skip navigation, or shortcut reference — the admin side must meet WCAG too.' },
  { id: 's5', standard: 'Error prevention over messaging', status: 'Partial', detail: 'The a11y gate blocks publish (good), but nothing prevents over-scheduling questions, mismatched section marks, or duplicate IDs.' },
  { id: 's6', standard: 'Data visualization appropriateness', status: 'Partial', detail: 'Z-score table and mark distribution are correct; discrimination shows a redundant bar + number.' },
  { id: 's7', standard: 'Loading and skeleton states', status: 'Missing', detail: 'None designed: bank search, live refresh, and results calculation all need skeletons or progressive loading.' },
  { id: 's8', standard: 'Mobile / responsive', status: 'Missing', detail: 'Everything is desktop-only; the live monitor is the one surface faculty use walking around — it needs a compact mode.' },
  { id: 's9', standard: 'Color contrast (WCAG AA)', status: 'Review needed', detail: 'Muted-text-on-muted-background pairs likely fail 4.5:1; status dots rely on color alone without shape differentiation.' },
  { id: 's10', standard: 'Undo / destructive confirmation', status: 'Missing', detail: 'Deleting questions/sections and ending a live exam ("87 students force-submitted") have no confirmation with consequences.' },
];

const STRENGTHS = [
  'Phase navigation (Build / Publish / Live / Post-exam) matches the exam lifecycle; the publish gate is the right pattern.',
  'Role-aware context banners surface the right context at the right moment.',
  'Accessibility publish gate: critical blocks, warnings surface — the Blackboard Ultra pattern, correctly implemented.',
  'Post-exam item analytics with plain-language negative-biserial flagging; z-score methodology is Ed-verified.',
  'OSCE Rubric as question type 10 — first clinical exam platform with this integration.',
  'PA Dashboard with PANCE predictor — "Even Influx is not doing this level of report" (Vishaka).',
  'Audit trail with exam-window access flagged red — Dr. T and Ed both asked explicitly.',
  'Formula questions with live 3-variant preview — "ExamSoft does not have this" (Dr. Vicky Mody).',
];

const SEV_ORDER = ['critical', 'high', 'medium', 'low'] as const;

export function ExamAdminAuditView() {
  const [section, setSection] = useSection(SECTIONS, 'overview');
  const [roleId, setRoleId] = useState(ROLES[0].id);
  const role = ROLES.find((r) => r.id === roleId) ?? ROLES[0];
  const built = STORIES.filter((s) => s.built).length;

  const sevRows = SEV_ORDER.map((sev) => ({
    key: sev,
    label: `${sev} findings`,
    value: UX_GAPS.filter((g) => g.severity === sev).length,
    hint: UX_GAPS.filter((g) => g.severity === sev).map((g) => g.area).slice(0, 3).join(' · '),
  }));

  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="Exam Management — admin design audit"
        lede="Full audit of the admin design: 6 roles, 27 stories, 12 UX gaps, 5 AI stories. Audit date Mar 26, 2026."
        meta={`Sources: 20+ Granola sessions, ExamSoft + D2L demos, Arun 3-year vision, Nipun UNF pilot, Ed Razenbach · ${built}/${STORIES.length} stories built (${Math.round((built / STORIES.length) * 100)}% design completeness)`}
      />

      <Fig
        title="Findings by severity"
        caption="The three critical findings — no home screen, question bank as a side panel, no review workflow — are the P0 build queue. Everything else waits behind them."
      >
        <RankedList rows={sevRows} />
      </Fig>

      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />

      {section === 'overview' && (
        <VStack gap={6}>
          <SpecSection title="Where to focus next" sub="The three most critical missing pieces — all P0, build now.">
            <Grid columns={{ minWidth: 280, max: 3 }} gap={3}>
              {UX_GAPS.filter((g) => g.severity === 'critical').map((g) => (
                <Card key={g.id} padding={3}>
                  <VStack gap={1}>
                    <HStack gap={2} vAlign="center">
                      <Badge variant="error" label="P0" />
                      <Text type="body" weight="semibold">
                        {g.area}
                      </Text>
                    </HStack>
                    <Text type="supporting" as="p" textWrap="pretty">
                      {g.why}
                    </Text>
                  </VStack>
                </Card>
              ))}
            </Grid>
          </SpecSection>
          <SpecSection title="What the current design does well" sub="Strengths confirmed against stakeholder requirements.">
            <Card variant="muted" padding={3}>
              <VStack gap={1.5}>
                {STRENGTHS.map((s, i) => (
                  <HStack key={i} gap={2} vAlign="center">
                    <Badge variant="success" label="✓" />
                    <Text type="supporting" as="p" textWrap="pretty">
                      {s}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </Card>
          </SpecSection>
        </VStack>
      )}

      {section === 'journeys' && (
        <SpecSection title="Role journeys" sub="Six admin roles with different mental models. Faculty and Dept Head are the primary users.">
          <SegmentedControl label="Role" value={roleId} onChange={setRoleId} size="sm">
            {ROLES.map((r) => (
              <SegmentedControlItem key={r.id} value={r.id} label={r.label.split(' (')[0].split(' /')[0]} />
            ))}
          </SegmentedControl>
          <Card padding={4}>
            <VStack gap={2}>
              <Text type="body" weight="semibold">
                {role.label}
              </Text>
              <Text type="supporting">
                {role.job} · {role.frequency}
              </Text>
              <Text type="supporting" as="p" textWrap="pretty">
                Mental model: {role.mentalModel}
              </Text>
              <VStack gap={1}>
                <Text type="label" color="secondary">
                  Frustrations
                </Text>
                {role.frustrations.map((f, i) => (
                  <Text key={i} type="supporting" as="p" textWrap="pretty">
                    {f}
                  </Text>
                ))}
              </VStack>
            </VStack>
          </Card>
          <Table<Record<string, unknown> & JourneyStep & { id: string }>
            data={role.journey.map((j, i) => ({ id: `${role.id}-${i}`, ...j }))}
            idKey="id"
            density="compact"
            columns={[
              { key: 'step', header: 'Step', width: pixel(120), renderCell: (r) => <Text type="body" weight="semibold">{r.step}</Text> },
              { key: 'action', header: 'Action', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.action}</Text> },
              { key: 'screen', header: 'Screen', width: pixel(180), renderCell: (r) => <Text type="supporting">{r.screen}</Text> },
              {
                key: 'pain',
                header: 'State',
                width: proportional(3),
                renderCell: (r) => (
                  <HStack gap={1.5} vAlign="center" wrap="wrap">
                    <Badge
                      variant={/NOT|not designed|NO /.test(r.pain) ? 'error' : /Works|IS designed/.test(r.pain) ? 'success' : 'warning'}
                      label={/NOT|not designed|NO /.test(r.pain) ? 'missing' : /Works|IS designed/.test(r.pain) ? 'works' : 'partial'}
                    />
                    <Text type="supporting" as="p" textWrap="pretty">
                      {r.pain}
                    </Text>
                  </HStack>
                ),
              },
            ]}
          />
        </SpecSection>
      )}

      {section === 'stories' && (
        <SpecSection title="Full story set" sub={`${STORIES.length} stories across 9 epics — user, functional, interaction and AI stories. ${built} built; the rest are design gaps.`}>
          <Table<StoryRec>
            data={STORIES}
            idKey="id"
            density="compact"
            hasHover
            columns={[
              { key: 'id', header: 'ID', width: pixel(80), renderCell: (r) => <Text type="code">{r.id}</Text> },
              { key: 'priority', header: 'Pri', width: pixel(60), renderCell: (r) => <Badge variant={r.priority === 'P0' ? 'error' : r.priority === 'P1' ? 'warning' : 'info'} label={r.priority} /> },
              { key: 'built', header: 'Built', width: pixel(70), renderCell: (r) => (r.built ? <Badge variant="success" label="built" /> : <Badge variant="neutral" label="gap" />) },
              { key: 'role', header: 'Role', width: pixel(120), renderCell: (r) => <Text type="supporting">{r.role}</Text> },
              { key: 'story', header: 'Story', width: proportional(4), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.story}</Text> },
              { key: 'src', header: 'Source', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.src}</Text> },
            ]}
          />
        </SpecSection>
      )}

      {section === 'gaps' && (
        <SpecSection title="UX gap ledger" sub="Each gap names why it hurts a specific user, the correct fix, and effort.">
          <Table<Gap>
            data={UX_GAPS}
            idKey="id"
            density="balanced"
            columns={[
              { key: 'severity', header: 'Sev', width: pixel(90), renderCell: (r) => <Badge variant={r.severity === 'critical' ? 'error' : r.severity === 'high' ? 'warning' : 'info'} label={r.severity} /> },
              { key: 'area', header: 'Gap', width: pixel(220), renderCell: (r) => <Text type="body" weight="semibold">{r.area}</Text> },
              { key: 'why', header: 'Why this hurts', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.why}</Text> },
              { key: 'fix', header: 'Fix', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.fix}</Text> },
              { key: 'effort', header: 'Effort', width: pixel(80), renderCell: (r) => <Text type="supporting">{r.effort}</Text> },
            ]}
          />
        </SpecSection>
      )}

      {section === 'standards' && (
        <SpecSection title="UX / UI standards audit" sub="Against WCAG 2.1 AA, Nielsen heuristics, and healthcare SaaS best practice.">
          <Table<Std>
            data={STANDARDS}
            idKey="id"
            density="balanced"
            columns={[
              { key: 'standard', header: 'Standard', width: pixel(240), renderCell: (r) => <Text type="body">{r.standard}</Text> },
              { key: 'status', header: 'Status', width: pixel(130), renderCell: (r) => <Badge variant={r.status === 'Missing' ? 'error' : r.status === 'Partial' ? 'warning' : 'neutral'} label={r.status} /> },
              { key: 'detail', header: 'Finding', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.detail}</Text> },
            ]}
          />
        </SpecSection>
      )}

      {section === 'ai' && (
        <SpecSection
          title="AI stories"
          sub='Non-negotiable constraint (Arun): "Everywhere it helps, never in the way." Users must always be able to do everything manually; the AI success metric is faculty time saved.'
        >
          <Grid columns={{ minWidth: 340, max: 2 }} gap={3}>
            {STORIES.filter((s) => s.type === 'AI').map((s) => (
              <Card key={s.id} padding={3}>
                <VStack gap={1}>
                  <HStack gap={2} vAlign="center">
                    <Text type="code">{s.id}</Text>
                    <Badge variant={s.priority === 'P1' ? 'warning' : 'info'} label={s.priority} />
                    <Text type="supporting">{s.role}</Text>
                  </HStack>
                  <Text type="supporting" as="p" textWrap="pretty">
                    {s.story}
                  </Text>
                  <Text type="supporting" as="p">
                    {s.src}
                  </Text>
                </VStack>
              </Card>
            ))}
          </Grid>
          <Card variant="muted" padding={3}>
            <VStack gap={1.5}>
              <Text type="label" color="secondary">
                AI integration checklist for the admin UI
              </Text>
              {[
                'Question Editor stem field — ghost CTA "Generate 4 options" after 1.5s idle; visible but never blocking.',
                'Build phase section footer — "AI suggest 5 questions" once the section is named with ≥1 question.',
                'Build phase exam header — blueprint coverage indicator, amber under target, "Fill gaps with AI".',
                'Post-exam summary — auto-generated 3–5 sentence plain-language readout, dismissible.',
                'Remediation drawer — AI pre-fills specialty and question count from the student\'s weak EOR areas; faculty overrides.',
              ].map((t, i) => (
                <Text key={i} type="supporting" as="p" textWrap="pretty">
                  {t}
                </Text>
              ))}
            </VStack>
          </Card>
        </SpecSection>
      )}

      <SpecFooter
        productId={PRODUCT_ID}
        extra={
          <Link href={hrefInsights({ product: PRODUCT_ID, severity: 'critical' })} isStandalone>
            Critical exam findings →
          </Link>
        }
      />
    </VStack>
  );
}
