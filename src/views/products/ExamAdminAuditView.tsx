import { useState } from 'react';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';

type TabId = 'overview' | 'user-journeys' | 'stories' | 'gaps' | 'ux-standards' | 'ai-stories';
const TABS: { id: TabId; label: string; alert?: boolean }[] = [
  { id: 'overview',      label: 'Audit overview' },
  { id: 'user-journeys', label: 'User journeys (6 roles)' },
  { id: 'stories',       label: 'Full story set' },
  { id: 'gaps',          label: 'Design gaps', alert: true },
  { id: 'ux-standards',  label: 'UX / UI standards' },
  { id: 'ai-stories',    label: 'AI stories' },
];

const ts = (tab: TabId, cur: TabId) => ({
  padding: '10px 18px', fontSize: 13,
  fontWeight: cur === tab ? 600 : 400,
  color: cur === tab ? 'var(--brand)' : 'var(--text-secondary)',
  borderBottom: `2px solid ${cur === tab ? 'var(--brand)' : 'transparent'}`,
  marginBottom: -1, background: 'none', border: 'none',
  cursor: 'pointer', whiteSpace: 'nowrap' as const,
});

// ─── DATA ────────────────────────────────────────────────────────────────────

const ROLES = [
  {
    id: 'faculty', label: 'Faculty / Course Director', icon: '🎓', color: '#7C3AED',
    primaryJob: 'Build exams, manage question bank, review results',
    frequency: 'Daily during exam period, weekly otherwise',
    mentalModel: 'Thinks in courses and cohorts, not abstract question IDs. Builds from topic clusters.',
    topFrustrations: [
      'Has to manage questions across ExamSoft AND a spreadsheet because ExamSoft has no multi-campus sharing',
      'Approval process is entirely offline — emails and printouts',
      'Analytics require exporting CSV and opening Excel',
      'No way to see if a question has been used before or how it performed',
    ],
    keyQuestions: [
      'Which of my questions are underperforming?',
      'Can I reuse last semester\'s exam with modifications?',
      'Did all my students receive accommodations?',
      'Is this exam ready to publish or are there blocking issues?',
      'Which questions should I remove after seeing item stats?',
    ],
    journey: [
      { step: 'Start', action: 'Open Exam Management dashboard', screen: 'Exam list / home', pain: 'Currently lands in an exam directly — no overview of all exams' },
      { step: 'Build', action: 'Create new exam or clone previous', screen: 'Build phase', pain: 'Clone from previous exam is not designed — critical for 80% of use cases' },
      { step: 'Questions', action: 'Add questions from bank or create new', screen: 'Build + QB panel', pain: 'QB panel is a side drawer — not adequate for browsing 1,800+ questions' },
      { step: 'Tag', action: 'Tag Bloom\'s, difficulty, competency', screen: 'Question Editor', pain: 'Tagging is manual; no AI suggestion unless user explicitly requests' },
      { step: 'Submit', action: 'Submit exam for dept head review', screen: 'Publish phase', pain: 'Review flow not designed — who gets notified? Where do they review?' },
      { step: 'Publish', action: 'Pass accessibility gate + publish', screen: 'Publish phase', pain: 'Works in design but accommodation assignment is per-student not bulk' },
      { step: 'Monitor', action: 'Watch live exam, handle issues', screen: 'Live phase', pain: 'Proxy submit exists but no communication template for disconnected students' },
      { step: 'Score', action: 'Review item stats, apply curve, release', screen: 'Post-exam', pain: 'Curve application UI exists but no bulk action for multiple flagged questions' },
    ],
  },
  {
    id: 'dept-head', label: 'Dept Head / Program Director', icon: '🏥', color: '#E31C79',
    primaryJob: 'Approve questions, review exam quality, sign off before publishing',
    frequency: 'Weekly review cycles, more frequent near exam periods',
    mentalModel: 'Thinks in program outcomes and accreditation compliance. Wants aggregate signals, not per-question detail.',
    topFrustrations: [
      'Review queue is currently entirely offline (email + printout)',
      'Cannot see psychometric quality of a question before approving',
      'No cross-cohort comparison — cannot see if this cohort performs differently than last year\'s',
      'Accreditation report requires manual compilation from multiple sources',
    ],
    keyQuestions: [
      'How many questions are waiting for my approval?',
      'Is this exam balanced across Bloom\'s levels and competency areas?',
      'Which faculty members have questions in draft for the longest time?',
      'Does this exam meet our ARC-PA blueprint requirements?',
      'How does this cohort compare to last year at this point?',
    ],
    journey: [
      { step: 'Dashboard', action: 'Open Exam Management, see review queue', screen: 'Home / dashboard', pain: 'NO home screen exists — no review queue surface, no at-a-glance status' },
      { step: 'Review', action: 'Open question in review, check quality', screen: 'Question reviewer', pain: 'No dedicated reviewer view — reviewer uses same editor as faculty' },
      { step: 'Approve/Reject', action: 'Approve question or send back with comments', screen: 'Question editor (review mode)', pain: 'Approve button exists in build phase hover but no dedicated review workflow' },
      { step: 'Blueprint check', action: 'Verify exam meets NCCPA/PAEA blueprint', screen: 'Build phase analytics', pain: 'Blueprint check NOT BUILT — this is a P1 missing feature' },
      { step: 'Sign off', action: 'Sign off on exam for publish', screen: 'Publish phase', pain: 'Sign-off exists in design but no notification to faculty that sign-off is complete' },
      { step: 'Post-exam', action: 'Review cohort performance, flag concerns', screen: 'Post-exam analytics', pain: 'Works well for PA. Needs generalization to other disciplines.' },
    ],
  },
  {
    id: 'contributor', label: 'Contributor (Associate Faculty)', icon: '✍️', color: '#0891B2',
    primaryJob: 'Write questions for assigned sections only — does not see full exam',
    frequency: 'Sporadic — assigned per exam cycle',
    mentalModel: 'Thinks in their subject area only. Does not know the full exam structure. Writes and submits.',
    topFrustrations: [
      'Does not know which questions have already been written by other contributors',
      'Cannot tell if their question style matches the program standard',
      'No feedback loop after submission — questions disappear into review',
    ],
    keyQuestions: [
      'Which section am I assigned to?',
      'How many questions do I need to write?',
      'What format/style should my questions follow?',
      'Was my question approved or rejected?',
    ],
    journey: [
      { step: 'Assignment', action: 'Receive task from head faculty', screen: 'Assignment notification', pain: 'No assignment notification designed — assumed out-of-band' },
      { step: 'Create', action: 'Write question in assigned section', screen: 'Question Editor (scoped)', pain: 'Contributor uses same editor as faculty — no scoped view, no style guide inline' },
      { step: 'Submit', action: 'Submit question for head faculty review', screen: 'Question Editor', pain: '"Save & submit for review" exists but no clear status feedback after submission' },
      { step: 'Feedback', action: 'See if question was approved, rejected, or needs revision', screen: 'Notification / status view', pain: 'No feedback view designed — contributor never sees what happened to their question' },
    ],
  },
  {
    id: 'reviewer', label: 'Reviewer (Assigned by Dept Head)', icon: '🔍', color: '#059669',
    primaryJob: 'Review questions in their assigned scope (e.g., Cardiology only)',
    frequency: 'Assigned per cycle — 1–2 review sessions per semester',
    mentalModel: 'Subject matter expert who validates clinical accuracy. Does not build exams.',
    topFrustrations: [
      'Has no baseline — cannot tell if question is better or worse than past questions in the same topic',
      'No way to leave inline comments on a specific part of the stem',
      'Review context is missing — cannot see related questions or past performance of similar questions',
    ],
    keyQuestions: [
      'What is my review queue today?',
      'Is this question clinically accurate?',
      'Is the correct answer definitively correct?',
      'Are the distractors plausible but clearly wrong?',
      'Does this question match the Bloom\'s level assigned?',
    ],
    journey: [
      { step: 'Queue', action: 'Open review queue for assigned scope', screen: 'Review queue', pain: 'NO dedicated reviewer queue screen — reviewer uses same build phase as everyone' },
      { step: 'Review', action: 'Read question, evaluate quality', screen: 'Question viewer (read-only + comments)', pain: 'Reviewer sees the same edit-mode question editor — confusing affordance mismatch' },
      { step: 'Comment', action: 'Leave inline comment on specific text', screen: 'Comment layer', pain: 'Comments not designed — only global approve/reject action exists' },
      { step: 'Decision', action: 'Approve, reject, or request revision', screen: 'Review decision', pain: 'Works as hover action in build phase but not in a dedicated reviewer workflow' },
    ],
  },
  {
    id: 'outcome-director', label: 'Outcome Director / Accreditation', icon: '📊', color: '#D97706',
    primaryJob: 'Map exam questions to competency outcomes; generate accreditation reports',
    frequency: 'Monthly reporting, intensive pre-accreditation review',
    mentalModel: 'Thinks in compliance and longitudinal trend. Does not build exams.',
    topFrustrations: [
      'Has to manually compile exam data from multiple sources for ARC-PA self-study',
      'Curriculum mapping is 50–60% accurate in current AI implementation',
      'Cannot see which competency areas are consistently undertested across all exams',
      'Historical data import from ExamSoft breaks longitudinal analysis',
    ],
    keyQuestions: [
      'Are we testing all 9 ARC-PA competency areas proportionally?',
      'Which competency areas show declining performance across cohorts?',
      'What is our Bloom\'s level distribution across all exams this year?',
      'How does our program\'s question bank coverage compare to NCCPA blueprint?',
    ],
    journey: [
      { step: 'Dashboard', action: 'Open accreditation compliance dashboard', screen: 'Outcome dashboard', pain: 'NOT DESIGNED — no accreditation/outcome mapping view exists in admin design' },
      { step: 'Coverage', action: 'Check blueprint coverage across all exams', screen: 'Blueprint coverage map', pain: 'Blueprint coverage map NOT BUILT — cited as "life saver" by Ed Razenbach' },
      { step: 'Export', action: 'Export ARC-PA compliance report', screen: 'Reports', pain: 'Export CSV exists in post-exam but no program-level multi-exam report' },
    ],
  },
  {
    id: 'inst-admin', label: 'Institution Admin', icon: '🏛️', color: '#6366F1',
    primaryJob: 'Configure program settings, manage users, audit access, set global rules',
    frequency: 'Setup-heavy at start of year, light ongoing',
    mentalModel: 'Thinks in configuration and compliance. Wants to set guardrails then step back.',
    topFrustrations: [
      'Cannot see who accessed the question bank and when',
      'Accommodation profiles must be set per-exam (70 setups for 7 students) — not at program level',
      'No bulk user import or role assignment',
      'Multi-campus question sharing requires manual export/import/re-upload',
    ],
    keyQuestions: [
      'Who accessed the question bank last night before the exam?',
      'Which students have active accommodation profiles across all programs?',
      'Is our Bloom\'s scale set to 1–3 (PA programs) or 1–6?',
      'Are all faculty in the right role before the exam window opens?',
    ],
    journey: [
      { step: 'Setup', action: 'Configure program settings, Bloom\'s scale, roles', screen: 'Program settings', pain: 'Program settings screen NOT DESIGNED — only implied via toggles in question editor' },
      { step: 'Accommodations', action: 'Assign program-level accommodation profiles to students', screen: 'Accommodation manager', pain: 'AccommodationProfileModal exists but assignment is per-exam, not program-level' },
      { step: 'Audit', action: 'Check who accessed question bank during exam window', screen: 'Audit trail', pain: 'Audit trail IS designed — this works' },
      { step: 'Multi-campus', action: 'Share questions to another campus without manual export', screen: 'QB sharing', pain: 'Multi-campus sharing is a stub — no actual sharing UI beyond a menu item' },
    ],
  },
];

const ALL_STORIES = [
  // EXAM HOME / DASHBOARD
  { id: 'UA-01', epic: 'Exam Dashboard (missing)', type: 'User', role: 'All admins', story: 'When I open Exam Management, I need to see my active exams, review queue count, and next scheduled exam at a glance, so I can prioritize my work without navigating into each exam.', src: 'Inferred from all stakeholder sessions — no home screen is a critical gap', built: false, priority: 'P0' },
  { id: 'UA-02', epic: 'Exam Dashboard (missing)', type: 'User', role: 'Faculty', story: 'I need to clone a previous exam and modify it for this semester, so I don\'t rebuild from scratch every cycle. 80–85% of exams are incremental changes.', src: 'Akshit Q2 (template-first) + ExamSoft comparison', built: false, priority: 'P0' },

  // BUILD PHASE
  { id: 'UB-01', epic: 'Build Phase', type: 'User', role: 'Faculty', story: 'I need to see a blueprint coverage bar while building my exam that shows which NCCPA/PAEA content areas are covered and which are missing, so I can ensure balanced coverage before publishing.', src: 'Ed Razenbach: "Pick assessment from blueprint that meet all curriculum — life saver!"', built: false, priority: 'P1' },
  { id: 'UB-02', epic: 'Build Phase', type: 'User', role: 'Faculty', story: 'I need to search and filter the question bank by topic, Bloom\'s level, difficulty, past performance, and "not used in last 2 exams," so I can pick the best questions without browsing 1,800 items.', src: 'Q-bank architecture session (f59ac2a6)', built: false, priority: 'P1' },
  { id: 'UB-03', epic: 'Build Phase', type: 'User', role: 'Faculty', story: 'I need to see a Smart View that auto-populates with questions matching my criteria (e.g., Cardiology + Apply level + not used this year), so I can reuse the same filter across multiple exam cycles.', src: 'Smart Views feature — Q-bank architecture (8c94698f)', built: false, priority: 'P2' },
  { id: 'UB-04', epic: 'Build Phase', type: 'Interaction', role: 'Faculty', story: 'When I drag a question from the bank panel into a section, it should animate into the section list and immediately show status, marks, and accessibility flags — without requiring me to open the question editor.', src: 'Build phase interaction design — standard drag-to-add pattern', built: false, priority: 'P1' },
  { id: 'UB-05', epic: 'Build Phase', type: 'User', role: 'Contributor', story: 'I need to see only the sections I\'m assigned to and a style guide for this program\'s question format inline, so I don\'t write questions in the wrong format or style.', src: 'Nipun Q2 session — multi-professor workflow', built: false, priority: 'P2' },

  // QUESTION EDITOR
  { id: 'UQ-01', epic: 'Question Editor', type: 'Functional', role: 'Faculty', story: 'When I type a question stem and press Tab or wait 1.5 seconds, the AI should suggest 4 answer options as "shadows" — I accept or ignore. It must not interrupt my flow.', src: 'Arun: "AI is just there, always ready to propose without disrupting manual control"', built: false, priority: 'P1' },
  { id: 'UQ-02', epic: 'Question Editor', type: 'Functional', role: 'Faculty', story: 'I need a question versioning panel that shows all past versions, who edited each, and which exams pin to which version, so I can safely update questions without breaking historical exams.', src: 'Q-bank architecture — smart views versioning (8c94698f)', built: false, priority: 'P1' },
  { id: 'UQ-03', epic: 'Question Editor', type: 'Functional', role: 'Reviewer', story: 'I need a dedicated reviewer view that shows the question in read-only mode with an inline annotation tool — I can highlight specific words and attach a comment to that highlight, so my feedback is precise.', src: 'Reviewer workflow gap identified in audit', built: false, priority: 'P1' },
  { id: 'UQ-04', epic: 'Question Editor', type: 'Functional', role: 'Faculty', story: 'I need a "Used in" panel that shows which past exams used this question and its historical correct-% and discrimination index per exam, so I can assess question quality before reusing.', src: 'ExamSoft comparison — question analytics per question', built: false, priority: 'P1' },
  { id: 'UQ-05', epic: 'Question Editor', type: 'Interaction', role: 'Faculty', story: 'When I select the OSCE Rubric type, the editor should transform into a rubric table builder — not show the standard stem/options UI — with a smooth transition that makes the interface change feel intentional.', src: 'OSCE rubric as type 10 — Ed Razenbach', built: true, priority: 'P1' },

  // REVIEW WORKFLOW
  { id: 'UR-01', epic: 'Review Workflow (missing)', type: 'User', role: 'Dept Head', story: 'I need a dedicated review queue that shows all questions pending my approval, sorted by wait time, with preview of the question, who wrote it, and one-click approve/reject/comment — without opening each question individually.', src: 'Day 2 Marriott: "Approval processes are entirely offline" — cited as major pain', built: false, priority: 'P0' },
  { id: 'UR-02', epic: 'Review Workflow (missing)', type: 'User', role: 'Reviewer', story: 'I need a scoped review queue that shows only questions in my assigned subject areas, with a side-by-side view of the question and its AI-suggested tags, so I can validate accuracy efficiently.', src: 'Role-based access design — audit finding', built: false, priority: 'P1' },
  { id: 'UR-03', epic: 'Review Workflow (missing)', type: 'Functional', role: 'Faculty', story: 'When my question is rejected by a reviewer, I need an in-app notification with the reviewer\'s comment and a direct link to the question, so I can revise and resubmit without an email thread.', src: 'Offline approval pain — Q-bank architecture session', built: false, priority: 'P1' },

  // PUBLISH PHASE
  { id: 'UP-01', epic: 'Publish Phase', type: 'User', role: 'Inst Admin', story: 'I need to assign accommodation profiles at the program level — student has "Extended time 1.5×" as a persistent profile that applies to all exams automatically — not per-exam manual assignment that requires 70 individual setups.', src: 'D2L comparison: 7 students × 10 quizzes = 70 manual setups. Program profile = 1.', built: false, priority: 'P0' },
  { id: 'UP-02', epic: 'Publish Phase', type: 'Interaction', role: 'Faculty', story: 'When I hit "Publish," the accessibility gate should animate through its checklist sequentially — showing pass/fail per item — then unlock the publish button with a satisfying confirmation, not a static form.', src: 'Publish gate exists but interaction design is static', built: false, priority: 'P2' },
  { id: 'UP-03', epic: 'Publish Phase', type: 'Functional', role: 'Faculty', story: 'I need to configure per-section behavior: whether students can return to previous sections, whether sections are timed individually, and whether section entry shows a prep screen — separate from the global exam settings.', src: 'Section behavior — Aarti/Kunal accessibility session (f29a990d)', built: false, priority: 'P1' },

  // LIVE PHASE
  { id: 'UL-01', epic: 'Live Phase', type: 'User', role: 'Faculty', story: 'When a student raises their hand (sends a flag from the exam), I need to see it immediately as an alert in the live monitor with the student name and their question number, so I can respond in context.', src: 'Live monitoring UX — not designed beyond the progress table', built: false, priority: 'P1' },
  { id: 'UL-02', epic: 'Live Phase', type: 'Functional', role: 'Faculty', story: 'I need to extend time for a specific student mid-exam — adding 15 or 30 minutes — and see the student\'s timer update in real time on my monitor, so I can handle accommodation edge cases during the exam.', src: 'Live phase time extension — "+Time" button exists but not interactive', built: false, priority: 'P1' },
  { id: 'UL-03', epic: 'Live Phase', type: 'Functional', role: 'Inst Admin', story: 'I need to see which questions are being flagged most frequently by students during a live exam, so I can identify a potentially flawed question in real time and take action before the exam ends.', src: 'Live analytics — not in current design', built: false, priority: 'P2' },

  // POST-EXAM
  { id: 'UPE-01', epic: 'Post-Exam Phase', type: 'User', role: 'Faculty', story: 'When I see multiple questions with negative discrimination, I need to apply a curve action to all flagged questions in a single step — not one by one — with a preview of the grade impact before confirming.', src: 'Post-exam item analytics — partial implementation', built: false, priority: 'P1' },
  { id: 'UPE-02', epic: 'Post-Exam Phase', type: 'Functional', role: 'Outcome Director', story: 'I need a competency coverage report that shows which ARC-PA/NCCPA competency areas were tested in this exam and each item\'s performance by competency, so I can use this directly in an accreditation self-study.', src: 'Outcome Director journey — accreditation reporting gap', built: false, priority: 'P1' },
  { id: 'UPE-03', epic: 'Post-Exam Phase', type: 'User', role: 'Dept Head', story: 'I need to compare this cohort\'s performance against the last 3 cohorts on the same exam (or equivalent exam) to identify whether performance is trending up, down, or stable — without opening a spreadsheet.', src: 'Cross-cohort comparison — Day 1 Marriott (e9e48150) student success analytics vision', built: false, priority: 'P2' },

  // AI STORIES
  { id: 'AI-01', epic: 'AI — Question Generation', type: 'AI', role: 'Faculty', story: 'When I open the Question Editor and have selected a topic tag, the AI should proactively suggest "Generate 5 MCQs on this topic at Apply level" as a ghost CTA — not buried in a menu.', src: 'Arun: "AI everywhere it helps, never in the way. Faculty must always be able to do everything manually."', built: false, priority: 'P1' },
  { id: 'AI-02', epic: 'AI — Blueprint Assembly', type: 'AI', role: 'Faculty', story: 'I should be able to type "Build me a 30-question exam that covers the NCCPA blueprint for PA2 with 60% at Apply or above" and receive a draft exam with questions pulled from my bank — I then accept, swap, or delete items.', src: 'Ed: "Pick assessment from blueprint that meet all curriculum — life saver!"', built: false, priority: 'P1' },
  { id: 'AI-03', epic: 'AI — Distractor Quality', type: 'AI', role: 'Faculty', story: 'When I write an MCQ stem and correct answer, the AI should generate 3 clinically plausible distractors in the same format — I can regenerate any single distractor without regenerating all.', src: 'Question generation AI — Touro ExamSoft demo (f5d66e4c)', built: false, priority: 'P1' },
  { id: 'AI-04', epic: 'AI — Post-Exam Insights', type: 'AI', role: 'Dept Head', story: 'After results are released, the AI should generate a plain-English summary: "Section B performed 12% below section average. The 3 questions on drug interactions in Section B have the lowest discrimination. Consider revising before next semester." — without me having to interpret the stats.', src: 'Arun 3-year vision: AI-driven analytics interpretation', built: false, priority: 'P2' },
  { id: 'AI-05', epic: 'AI — Remediation Assignment', type: 'AI', role: 'Faculty / DCE', story: 'When a student fails an EOR below threshold, the AI should suggest a specific remediation exam from the bank based on the student\'s weak areas (identified by their low-performing items) — not just the specialty.', src: 'Ed Razenbach: remediation per specialty. Arun: personalized assessment because every student situation is different.', built: false, priority: 'P2' },
];

const UX_GAPS = [
  { area: 'No home screen / dashboard', severity: 'Critical', why: 'Admin opens Exam Management and lands directly inside an exam. There is no overview of all exams, no review queue, no pending tasks, no upcoming exam schedule. Every role\'s primary question ("What needs my attention?") is unanswered at entry.', fix: 'Exam Management home: table of all exams (status, date, role action needed), review queue count per role, next 3 scheduled exams, quick KPIs.', effort: 'High' },
  { area: 'Question bank is a side panel, not a first-class screen', severity: 'Critical', why: 'A faculty member with 1,800+ questions needs to browse, filter by 5+ dimensions, see performance data, and manage smart views. A 320px side drawer is not adequate for this. This is a core tool, not a supporting feature.', fix: 'Full-screen QB view accessible from sidebar nav with: search, multi-filter rail, card/list view toggle, smart views sidebar, per-question performance preview.', effort: 'High' },
  { area: 'Review workflow is entirely absent', severity: 'Critical', why: 'The "approve" action exists as a hover button on a question row. There is no: review queue screen, inline comment system, notification to faculty of outcome, or reviewer-specific view. ExamSoft does this entirely offline — this is Exxat\'s chance to solve it.', fix: 'Dedicated review queue for Dept Head and Reviewer roles. Question review view with comment threads per word/sentence. Notification system for approval/rejection.', effort: 'High' },
  { area: 'Blueprint coverage check missing', severity: 'High', why: 'Ed Razenbach called it "a life saver" — assembling exams from a blueprint that ensures coverage of NCCPA/PAEA content areas. Currently there is no visual coverage map, no blueprint gap alert, nothing.', fix: 'Build phase: blueprint coverage bar showing % coverage per content area. Alert when a required area is under-represented. AI assembly: "Build exam from blueprint."', effort: 'Medium' },
  { area: 'Accommodation assignment is per-exam, not program-level', severity: 'High', why: 'D2L finding: 7 students × 10 quizzes = 70 individual setups. Exxat\'s differentiator is program-level accommodation profiles (1 setup). This is designed in concept but the bulk assignment workflow is not built — students are still assigned one at a time in the roster panel.', fix: 'Program-level accommodation profiles. Bulk assignment via CSV or group select. Profile auto-applies to all future exams for that student.', effort: 'Medium' },
  { area: 'Exam clone / template workflow absent', severity: 'High', why: '80-85% of exams are incremental edits to previous exams. The design has no "clone this exam" action, no template library, and no way to inherit settings from a previous exam. Faculty must rebuild from scratch every cycle.', fix: 'Exam list: "Clone" action on each exam. Clone creates a new exam with all questions, sections, settings copied. Faculty modifies what\'s different.', effort: 'Low' },
  { area: 'Question versioning not visible', severity: 'Medium', why: 'Every question edit creates a new version. Exams pin to a version at creation. This is architecturally correct but the version history is invisible to the user. Faculty cannot see if they are editing the version pinned to an active exam.', fix: 'Version history drawer in Question Editor: timeline of edits, who made each, which exams pin to which version. "Edit" on an exam-pinned version creates a new fork.', effort: 'Medium' },
  { area: 'Live phase lacks real-time question flag monitoring', severity: 'Medium', why: 'Faculty can see student progress and flags (questions the student marked for review). But there is no signal for when a question is flagged by many students simultaneously — which often indicates a flawed question that should be noted for post-exam curve.', fix: 'Live phase: question flag heatmap. If >20% of students flag the same question, surface an alert: "Q12 flagged by 18 students — possible issue."', effort: 'Medium' },
  { area: 'Post-exam bulk action for flagged questions', severity: 'Medium', why: 'When multiple questions have negative discrimination or are flagged, the curve must be applied one question at a time. There is no "select all flagged → apply give-credit" action.', fix: 'Post-exam item analytics: checkbox select on multiple questions. Bulk action dropdown: give credit / exclude from scoring / flag for revision. Preview of grade impact before confirming.', effort: 'Low' },
  { area: 'Outcome Director has no view', severity: 'Medium', why: 'The Outcome Director role can view post-exam analytics but there is no accreditation-oriented view: no Bloom\'s distribution across all exams this year, no competency coverage map, no cross-cohort trend.', fix: 'Outcome Director dashboard: Bloom\'s radar chart across all exams, competency coverage heatmap vs ARC-PA/NCCPA blueprint, cohort trend lines, one-click ARC-PA self-study export.', effort: 'High' },
  { area: 'Section behavior not configurable in Publish', severity: 'Low', why: 'Publish phase has schedule and proctoring settings but no per-section behavior controls: section lock (GRE model), individual section time limits, section prep screen content.', fix: 'Add "Section settings" accordion in Publish phase. Per-section: lock on/off, time limit override, prep screen title + instructions.', effort: 'Low' },
  { area: 'Contributor feedback loop broken', severity: 'Low', why: 'Contributor writes a question, submits, and gets no feedback in the app. They do not know if it was approved, rejected with comments, or modified. The feedback loop is entirely offline.', fix: 'Notification center: contributor gets in-app notification when their question is approved, rejected, or sent back for revision. Shows reviewer comment inline.', effort: 'Low' },
];

const UX_STANDARDS = [
  { standard: 'Progressive disclosure', status: 'Partial', detail: 'Build phase uses accordions well. But role banners (Dept Head / Reviewer / Contributor) are inline text blocks when they should be contextual callout panels. Question Editor shows all tagging fields simultaneously — should show primary fields first, secondary on expand.' },
  { standard: 'Consistent empty states', status: 'Missing', detail: 'No empty state designed for: empty question bank, exam with 0 questions, first-time user. Empty states are high-trust moments — they should guide the user to their next action (Add question / Import from bank / Use AI).' },
  { standard: 'Feedback on every action', status: 'Partial', detail: '"Save draft" button exists but no visual confirmation that it saved. "Add" from question bank has no confirmation the question was added to the section. "Proxy submit" has no confirmation modal.' },
  { standard: 'Keyboard accessibility (WCAG 2.1 AA)', status: 'Missing', detail: 'The design has no focus ring styles, no tab order documented, no skip navigation pattern, no keyboard shortcut reference for power users. For a product with an accessibility publish gate, the admin side must also meet WCAG.' },
  { standard: 'Error prevention over error messaging', status: 'Partial', detail: 'Accessibility gate blocks publish — good. But no prevention for: adding more questions than the exam schedule allows, setting section marks that don\'t add to total, duplicate question IDs.' },
  { standard: 'Data visualization appropriateness', status: 'Partial', detail: 'Z-score table in Post-Exam is correct. Mark distribution bar is correct. But: discrimination index uses a bar next to a number (redundant). Bloom\'s radar chart in Outcome Director (not built) is the right choice for that data shape.' },
  { standard: 'Loading and skeleton states', status: 'Missing', detail: 'No loading states designed anywhere. Question bank search, live exam data refresh, post-exam results calculation — all need skeleton states or progressive loading indicators.' },
  { standard: 'Mobile / responsive consideration', status: 'Missing', detail: 'All screens are desktop-only. While admin work is primarily desktop, the live monitoring view is the one case where faculty walk around with a laptop or tablet. The live monitor table needs a compact mode for smaller screens.' },
  { standard: 'Color contrast (WCAG AA)', status: 'Review needed', detail: 'Using CSS variables consistently — good. But need to verify: var(--text3) on var(--surface3) backgrounds (muted text on muted background) likely fails 4.5:1 ratio. Status dots (2×2px colored circles) rely on color alone without shape differentiation.' },
  { standard: 'Undo / destructive action confirmation', status: 'Missing', detail: 'Delete question from section has no confirmation. Removing a section has no confirmation. Ending an active live exam has no confirmation modal with consequence explanation ("87 students will be force-submitted").' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export function ExamAdminAuditView() {
  const [tab, setTab] = useState<TabId>('overview');
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);
  const currentRole = ROLES.find(r => r.id === selectedRole)!;
  const builtCount = ALL_STORIES.filter(s => s.built).length;
  const criticalGaps = UX_GAPS.filter(g => g.severity === 'Critical').length;
  const epicGroups = [...new Set(ALL_STORIES.map(s => s.epic))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={ts(t.id, tab)}>
            {t.label}
            {t.alert && criticalGaps > 0 && (
              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, background: '#EF4444', color: 'white', padding: '1px 5px', borderRadius: 10 }}>{criticalGaps}</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Full audit of Exam Management admin design — 6 admin roles, 27 user stories, 12 UX gaps, 5 AI stories. Sources: all 20+ Granola sessions, ExamSoft demo, D2L demo, Arun 3-year vision, Nipun UNF pilot, Ed Razenbach PA program. Audit date: Mar 26, 2026." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Admin roles" value="6" delta="Faculty · DH · Contributor · Reviewer · OD · Admin" />
              <MetricCard label="User stories" value={String(ALL_STORIES.length)} delta={`${builtCount} built · ${ALL_STORIES.length - builtCount} gaps`} deltaVariant="down" />
              <MetricCard label="Critical UX gaps" value={String(criticalGaps)} delta="Home, QB, Review workflow" deltaVariant="down" />
              <MetricCard label="AI stories" value={String(ALL_STORIES.filter(s => s.type === 'AI').length)} delta="Generation · Blueprint · Distractor · Insights" />
              <MetricCard label="Design completeness" value={`${Math.round(builtCount/ALL_STORIES.length*100)}%`} delta="vs full story set" deltaVariant="down" />
            </div>

            <Card>
              <CardTitle sub="What the current design does well">Strengths</CardTitle>
              {[
                { item: 'Phase navigation (Build / Publish / Live / Post-exam)', why: 'Linear phase flow is correct for the exam lifecycle. Clear progress affordance. Phase gate for publish is the right pattern.' },
                { item: 'Role-aware context banners', why: 'Dept Head sees review queue alert, Reviewer sees assigned scope, Contributor sees their sections. Context is surfaced at the right moment.' },
                { item: 'Accessibility publish gate', why: 'Critical issues block publish, warnings surface but don\'t block. Pattern borrowed from Blackboard Ultra. Correct implementation.' },
                { item: 'Post-exam item analytics with discrimination', why: 'Negative biserial flagging with plain-language explanation is the right clinical education pattern. Z-score methodology is Ed-verified.' },
                { item: 'OSCE Rubric as question type 10', why: 'Critical task toggle, rubric rows, scoring types — all match Ed\'s requirements. First clinical exam platform with this integration.' },
                { item: 'PA Dashboard with PANCE predictor', why: 'Vishaka: "Even Influx is not doing this level of report." PACRAT + EOR z-scores + PANCE gauge is a genuine differentiator.' },
                { item: 'Audit trail with exam-window flagging', why: 'Dr. T + Ed both asked for this explicitly. Exam-window access rows highlighted in red is correct threat signal design.' },
                { item: 'Formula questions with live preview', why: 'Dr. Vicky Mody: "ExamSoft does not have this." Live variable preview showing 3 student variants is the right UX for a novel question type.' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: i < 7 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: '#10B981', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{s.item}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.why}</div>
                  </div>
                </div>
              ))}
            </Card>

            <Card>
              <CardTitle sub="The 3 most critical missing pieces">Where to focus next</CardTitle>
              {[
                { priority: 'P0 · Build now', title: 'Exam home / dashboard', desc: 'Every admin opens the app and has no idea where to start. Review queue, exam list, scheduled exams, pending actions — none of this is surfaced. This is the entry point to everything else.' },
                { priority: 'P0 · Build now', title: 'Question bank as first-class screen', desc: 'A 320px side panel cannot support 1,800+ questions with filtering, smart views, and performance data. The question bank is a core tool that needs its own screen.' },
                { priority: 'P0 · Build now', title: 'Review workflow (queue + comments + notifications)', desc: 'The entire approval process is offline (email + printout). Building this in-app is Exxat\'s clearest opportunity to beat ExamSoft on a daily-use workflow.' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge variant="error">{item.priority}</Badge>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{item.desc}</p>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── USER JOURNEYS ── */}
        {tab === 'user-journeys' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="6 distinct admin roles. Each has a different mental model, different primary job, different key questions when opening Exam Management. Design must serve all 6 — but Faculty and Dept Head are the primary users." />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ROLES.map(r => (
                <button key={r.id} onClick={() => setSelectedRole(r.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: selectedRole === r.id ? `${r.color}15` : 'var(--surface-primary)', color: selectedRole === r.id ? r.color : 'var(--text-secondary)', border: `1px solid ${selectedRole === r.id ? `${r.color}40` : 'var(--border)'}` }}>
                  <span>{r.icon}</span>{r.label}
                </button>
              ))}
            </div>

            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{currentRole.icon}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: currentRole.color }}>{currentRole.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentRole.frequency}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Mental model</div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{currentRole.mentalModel}</p>
                </div>
                <div style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--surface-secondary)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>Key questions on open</div>
                  {currentRole.keyQuestions.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>
                      <span style={{ color: currentRole.color, flexShrink: 0 }}>?</span>{q}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 10 }}>Frustrations</div>
              {currentRole.topFrustrations.map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderBottom: i < currentRole.topFrustrations.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: '#EF4444', flexShrink: 0 }}>×</span>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{f}</p>
                </div>
              ))}
            </Card>

            <Card>
              <CardTitle sub={`Step-by-step journey for ${currentRole.label}`}>Journey map</CardTitle>
              {currentRole.journey.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: i < currentRole.journey.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: step.pain.includes('NOT') || step.pain.includes('not designed') ? '#EF4444' : step.pain.includes('Works') ? '#10B981' : '#F59E0B', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: currentRole.color }}>{step.step}</span>
                      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{step.action}</span>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Screen: {step.screen}</div>
                    <div style={{ fontSize: 12, color: step.pain.includes('NOT') || step.pain.includes('not designed') ? '#EF4444' : step.pain.includes('Works') ? '#10B981' : '#D97706', fontStyle: 'italic' }}>{step.pain}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── STORIES ── */}
        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text={`${ALL_STORIES.length} stories across 9 epics. User stories, functional stories, interaction stories, AI stories. ${builtCount} built in Magic Patterns. ${ALL_STORIES.length - builtCount} are design gaps.`} />
            {epicGroups.map(epic => {
              const stories = ALL_STORIES.filter(s => s.epic === epic);
              return (
                <Card key={epic}>
                  <CardTitle sub={`${stories.length} stories · ${stories.filter(s => s.built).length} built · ${stories.filter(s => !s.built).length} gaps`}>{epic}</CardTitle>
                  {stories.map((s, i) => (
                    <div key={s.id} style={{ padding: '10px 0', borderBottom: i < stories.length - 1 ? '1px solid var(--border)' : 'none', opacity: s.built ? 0.7 : 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontFamily: 'monospace', fontWeight: 700, color: s.type === 'AI' ? '#D97706' : s.type === 'Interaction' ? '#059669' : s.type === 'Functional' ? '#0891B2' : 'var(--brand)', background: s.type === 'AI' ? 'rgba(217,119,6,0.1)' : s.type === 'Interaction' ? 'rgba(5,150,105,0.1)' : s.type === 'Functional' ? 'rgba(8,145,178,0.1)' : 'rgba(227,28,121,0.1)', padding: '1px 5px', borderRadius: 4 }}>{s.id}</span>
                        <Badge variant={s.priority === 'P0' ? 'error' : s.priority === 'P1' ? 'warning' : 'info'}>{s.priority}</Badge>
                        <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.type} · {s.role}</span>
                        {s.built && <span style={{ fontSize: 9, fontWeight: 700, color: '#10B981', background: 'rgba(16,185,129,0.1)', padding: '1px 5px', borderRadius: 4 }}>BUILT</span>}
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 3px', lineHeight: 1.6 }}>{s.story}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>{s.src}</p>
                    </div>
                  ))}
                </Card>
              );
            })}
          </div>
        )}

        {/* ── GAPS ── */}
        {tab === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AIStrip text="12 design gaps identified. 3 Critical (P0 — build now), 5 High, 4 Medium/Low. Each gap has: why it matters to a specific user, what the correct fix is, and effort estimate." />
            {['Critical', 'High', 'Medium', 'Low'].map(sev => {
              const items = UX_GAPS.filter(g => g.severity === sev);
              if (!items.length) return null;
              return (
                <div key={sev}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: sev === 'Critical' ? '#EF4444' : sev === 'High' ? '#D97706' : 'var(--text-muted)', marginBottom: 8 }}>{sev} ({items.length})</div>
                  {items.map((gap, i) => (
                    <Card key={i}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: sev === 'Critical' ? '#EF4444' : sev === 'High' ? '#D97706' : '#3B82F6', flexShrink: 0, marginTop: 5 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{gap.area}</span>
                            <Badge variant="default">{gap.effort} effort</Badge>
                          </div>
                          <div style={{ marginBottom: 6 }}>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#EF4444', marginRight: 6 }}>Why this hurts:</span>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{gap.why}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#10B981', marginRight: 6 }}>Fix:</span>
                            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{gap.fix}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* ── UX STANDARDS ── */}
        {tab === 'ux-standards' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <AIStrip text="Audit of UX/UI standards, interaction patterns, accessibility, and data visualization against WCAG 2.1 AA, Nielsen heuristics, and healthcare SaaS best practices." />
            {UX_STANDARDS.map((std, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{std.status === 'Missing' ? '❌' : std.status === 'Partial' ? '⚠️' : std.status === 'Review needed' ? '🔍' : '✅'}</span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{std.standard}</span>
                      <Badge variant={std.status === 'Missing' ? 'error' : std.status === 'Partial' ? 'warning' : 'default'}>{std.status}</Badge>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{std.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── AI STORIES ── */}
        {tab === 'ai-stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="5 AI stories for Exam Management admin side. Principle from Arun: AI everywhere it helps, never in the way. Faculty must always be able to do everything manually. AI augments — never blocks." />
            <Card>
              <CardTitle sub="Arun 3-year vision — the AI design principle">Non-negotiable constraint</CardTitle>
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)' }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 6px' }}>"Everywhere it helps, never in the way"</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>AI should be present throughout faculty/admin workflows but users must be able to do everything manually at any time. AI should augment and accelerate, not block or force a new path. Core AI success metric: "How much faculty time did we save?"</p>
              </div>
            </Card>
            {ALL_STORIES.filter(s => s.type === 'AI').map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#D97706', background: 'rgba(217,119,6,0.1)', padding: '2px 6px', borderRadius: 4 }}>{s.id}</span>
                  <Badge variant={s.priority === 'P1' ? 'warning' : 'info'}>{s.priority}</Badge>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Role: {s.role}</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 6px', lineHeight: 1.6 }}>{s.story}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, fontStyle: 'italic' }}>{s.src}</p>
              </Card>
            ))}
            <Card>
              <CardTitle sub="What this means for the Magic Patterns design">AI integration checklist for admin UI</CardTitle>
              {[
                { where: 'Question Editor — stem field', what: 'Ghost text CTA: "Generate 4 options for this question ↗" — appears after user stops typing for 1.5s', when: 'Always visible but subtle; never blocks typing' },
                { where: 'Build phase — section footer', what: '"AI suggest 5 questions for this section based on topic and Bloom\'s balance" button', when: 'After section is named + at least 1 question exists' },
                { where: 'Build phase — exam header', what: 'Blueprint coverage indicator: shows % of NCCPA/PAEA areas covered. Button: "Fill gaps with AI" opens assembly panel', when: 'Always visible during build; amber when coverage < target' },
                { where: 'Post-exam — summary', what: 'AI plain-language summary of exam performance at the top of Post-Exam view. 3-5 sentences. E.g. "Section B underperformed by 12%..."', when: 'Auto-generated when results are ready; dismissible' },
                { where: 'Remediation drawer', what: 'AI pre-fills specialty and question count based on student\'s weak EOR areas; faculty can override', when: 'When remediation drawer opens from at-risk student row' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#D97706', background: 'rgba(217,119,6,0.1)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>WHERE</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{row.where}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#0891B2', background: 'rgba(8,145,178,0.1)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>WHAT</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.what}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#059669', background: 'rgba(5,150,105,0.1)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>WHEN</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.when}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
