// views/products/exam/Builder.tsx — Assessment Builder + question types +
// feature map + the grounded user-story set + enterprise pattern analogies
// (v19). Flow cards → numbered list rows; FeatureBlock walls → one grouped
// table; analogy Collapsibles → a scannable table.
import { useState } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Table, pixel, proportional, useTableGroupedRows } from '@astryxdesign/core/Table';
import { SpecSection } from '../spec/SpecSection';
import { StoryTable } from '../spec/StoryTable';
import type { StoryRow } from '../spec/StoryTable';

const BUILDER_FLOW = [
  { step: '01', screen: 'Dashboard', detail: 'Action inbox: pending reviews, live exams, drafts' },
  { step: '02', screen: 'New Assessment', detail: 'Name, type, weightage · duration · schedule window' },
  { step: '03', screen: 'Structure tab', detail: 'Sections A/B/C · marks per section · distribution method' },
  { step: '04', screen: 'Question Bank', detail: "Scoped views sidebar · filter by Bloom's · add to section" },
  { step: '05', screen: 'Accessibility tab', detail: 'TTS, STT, zoom · accommodation profiles · publish gate check' },
  { step: '06', screen: 'Submit for Review', detail: 'Draft → In Review · reviewer notified · comments inline' },
  { step: '07', screen: 'Published', detail: 'Students notified · lockdown browser · admin monitors live' },
];

interface QTypeRow extends Record<string, unknown> {
  id: string;
  type: string;
  priority: string;
  detail: string;
}
const QUESTION_TYPES: QTypeRow[] = [
  { id: 'mcq', type: 'MCQ + MSQ', priority: 'P1', detail: "Single/multiple select. Cross-out feature (David's request) — strike options without removing selectability. Keyboard A–D. Used in PA pharmacology, didactic exams." },
  { id: 'fib', type: 'Fill-in-the-blank', priority: 'P1', detail: 'Inline blanks within text; typing or speech-to-text; multiple blanks per question. Used in medical calculations, drug dosage.' },
  { id: 'hotspot', type: 'Hotspot / Image', priority: 'P1', detail: 'Click a region on an image (X-ray, anatomy, EKG); correctness = click within defined region. Used in anatomy, radiology, cardiac rhythm.' },
  { id: 'passage', type: 'Passage-based', priority: 'P1', detail: "Long-form passage with 1+ questions. Text highlighting (David's request) persists across navigation; STT for open responses. Used in clinical reasoning, case studies." },
  { id: 'match', type: 'Match-the-following', priority: 'P1', detail: 'Align items across two lists with per-pair scoring. Used in drug-mechanism matching, anatomy labeling.' },
  { id: 'audio', type: 'Audio-based', priority: 'P2', detail: 'Audio clip (heart/lung sounds, speech) with captions + transcript; response via MCQ or short answer. Used in clinical auscultation.' },
  { id: 'video', type: 'Video-based', priority: 'P2', detail: 'Video with required captions; transcript auto-generated in backend. Used in surgical procedures, patient encounters.' },
  { id: 'pdf', type: 'PDF / Case study', priority: 'P2', detail: 'Embedded multi-page PDF viewer; students scroll the case while answering. Used in complex multi-page clinical scenarios.' },
  { id: 'chart', type: 'Chart / Visual', priority: 'P2', detail: 'Chart as stimulus; alt text + description required (WCAG); color cannot be the sole indicator. Used in lab values, vitals trends, EKG strips.' },
  { id: 'osce', type: 'OSCE Rubric (type 10)', priority: 'P1', detail: 'Rubric table builder with critical task marking, multi-rubric per encounter. ExamSoft retention anchor at Emory & Henry (100 scenarios) — Ed Razenbach.' },
];

interface FeatureRow extends Record<string, unknown> {
  id: string;
  group: string;
  title: string;
  desc: string;
  badge?: string;
}

const FEATURE_GROUPS = ['Question creation', 'Tagging system', 'Assessment assembly', 'Accessibility settings', 'Analytics layer'];

const FEATURES: FeatureRow[] = [
  { id: 'f1', group: 'Question creation', title: 'Rich text editor', desc: 'Stem, options, image upload (alt text required), media embed, table. Rationale shown post-submit on low-stakes exams.' },
  { id: 'f2', group: 'Question creation', title: '9 question types + OSCE', desc: 'MCQ, multi-select, fill-in-blank, match, hotspot, audio, video, case study, passage. 32 layout variants built.' },
  { id: 'f3', group: 'Question creation', title: 'Version control', desc: 'Every edit creates a new immutable version. Exams pin to version at creation; Dept Head endorses per-department version.' },
  { id: 'f4', group: 'Question creation', title: 'Accessibility panel', desc: 'Alt text (required, blocks save), TTS hint text, per-question calculator toggle, 4-circle accessibility score.', badge: 'NEW' },
  { id: 'f5', group: 'Tagging system', title: '5 predefined categories', desc: "Topic (3-4 level tree), Bloom's (6 levels), Difficulty (compound with Year/Level), USMLE/Competency, custom tags." },
  { id: 'f6', group: 'Tagging system', title: 'AI tag assist', desc: "Bloom's auto-suggest on save; tag consistency checker; ExamSoft import auto-tags 10,000+ questions; AI shadow tags." },
  { id: 'f7', group: 'Tagging system', title: 'Scoped Views on a flat pool', desc: 'Not siloed by course. Tier 1: pinned/recent/courses sidebar. Tier 2: Browse-All slide-out. Auto-created per course.' },
  { id: 'f8', group: 'Assessment assembly', title: 'Section-based structure', desc: 'Multi-section exams with section-level marks and distribution (equal/manual/difficulty-based); total auto-computed.' },
  { id: 'f9', group: 'Assessment assembly', title: 'AI blueprint assembly', desc: "Phase 2: AI selects questions satisfying all NCCPA blueprint cells. Touro verbatim: 'a lifesaver'. Target: Cohere Aug." },
  { id: 'f10', group: 'Assessment assembly', title: 'Lifecycle stepper', desc: 'Draft → Building → Review → Published → Scheduled → Live; all nodes clickable; Submit-for-Review gates the transition.' },
  { id: 'f11', group: 'Accessibility settings', title: 'Global exam toggles', desc: 'TTS, STT, OSK, focus mode, calculator type, zoom default, display mode — all configurable per exam.', badge: 'NEW' },
  { id: 'f12', group: 'Accessibility settings', title: 'Accommodation profiles', desc: "Named program-level profiles, preset + custom, bulk apply to N students. D2L's 70-operation workflow reduced to 1. First-to-market.", badge: 'NEW' },
  { id: 'f13', group: 'Accessibility settings', title: 'Publish gate checklist', desc: 'Blocks publish until: all images have alt text, all media has captions, accommodation-flagged students have profiles.', badge: 'NEW' },
  { id: 'f14', group: 'Analytics layer', title: 'Item performance', desc: 'p-value per question per course offering, point biserial, discrimination index; negative PBis auto-flags.' },
  { id: 'f15', group: 'Analytics layer', title: 'PANCE predictor', desc: "Ed Razenbach's Excel model automated: 8 variables, R² 0.66–0.84. PACKRAT + EOR z-scores + GPA + remediations flag at-risk students months early." },
  { id: 'f16', group: 'Analytics layer', title: 'Accommodation analytics', desc: 'Standard vs extended-time cohort comparison, per-accommodation breakdown. Privacy: N ≥ 5 students per group.' },
];

const STORIES: StoryRow[] = [
  { id: 'US-01', priority: 'P0', who: 'Student', what: 'complete a technical check and one sample question before the timer starts', why: 'controls must be understood before time pressure begins', source: 'Romit (f29a990d) · PreExamScreen' },
  { id: 'US-02', priority: 'P0', who: 'Student', what: 'move between questions with keyboard shortcuts (→/Enter/←/F/A–D)', why: 'work at speed without hunting UI elements', source: 'f29a990d · StudentExamApp' },
  { id: 'US-03', priority: 'P0', who: 'Student', what: 'see flagged questions surfaced at the top of the navigator, not as a third bucket', why: 'flag is a 2×2 attribute of answered AND unanswered — Kunal explicit', source: 'Kunal (f29a990d) · QuestionNavigator' },
  { id: 'US-04', priority: 'P0', who: 'Student', what: 'visually strike answer options without removing selectability', why: 'clinical reasoning uses elimination while preserving choices', source: 'David (f29a990d) · QuestionCard' },
  { id: 'US-05', priority: 'P0', who: 'Student', what: 'highlight key phrases in passage text, persisting across navigation', why: 'medical problem solving uses evidence marking', source: 'David (f29a990d) · QuestionRenderers' },
  { id: 'US-06', priority: 'P0', who: 'Student', what: 'see section title + question count before entering each section', why: 'informed pacing + faculty-configured lock behavior (GRE model)', source: 'Aarti (f29a990d) · SectionEntryScreen' },
  { id: 'US-07', priority: 'P0', who: 'Faculty / Admin', what: 'see "Exams" everywhere, never "Assessments"', why: 'PAEA and clinical education say Exams — Ed and Touro coordinator independently', source: 'Ed (ca5a709c) + Touro (f5d66e4c)' },
  { id: 'US-08', priority: 'P1', who: 'PA Program Director', what: 'see z-scores alongside raw EOR scores with national mean + SD', why: 'raw scores across specialties are not comparable', source: 'Ed (ca5a709c) · PostExamPhase' },
  { id: 'US-09', priority: 'P1', who: 'DCE / Faculty', what: 'assign a specialty-specific remediation exam to students below EOR threshold', why: 'remediation exams are open book, untimed, sequestered', source: 'Ed (ca5a709c) · remediation drawer' },
  { id: 'US-10', priority: 'P1', who: 'PA Faculty', what: 'build OSCE rubrics with critical task marking, multi-rubric per encounter', why: 'ExamSoft rubric functionality is a retention anchor', source: 'Ed (ca5a709c) · QuestionEditor' },
  { id: 'US-11', priority: 'P0', who: 'PA PD / DCE', what: 'see a cohort + individual dashboard with PACKRAT, EOR, OSCE, EOC and PANCE predictor', why: 'Vishaka: "even Influx is not doing this level — our differentiator"', source: 'Vishaka (7dbabdb5) · PADashboard' },
  { id: 'US-12', priority: 'P1', who: 'Admin / DCE', what: 'bulk-import PAEA + ExamSoft data via a 5-step CSV wizard', why: 'PAEA data cannot be auto-integrated yet; 5-minute manual step acceptable', source: 'Vishaka (7dbabdb5)' },
  { id: 'US-13', priority: 'P2', who: 'PA Faculty', what: "restrict the Bloom's picker to levels 1–3 at program level", why: 'PAEA uses 1–3; ExamSoft uses 1–5; Ed prefers 1–3', source: 'Ed (ca5a709c)' },
  { id: 'US-14', priority: 'P2', who: 'Faculty', what: 'see negative point-biserial flagged red with a clinical explanation', why: '"a negative sometimes means students who knew less got it right" — Touro', source: 'f5d66e4c · item analytics' },
  { id: 'US-15', priority: 'P2', who: 'Faculty', what: 'share questions to another campus without manual export/import/re-upload', why: '"We literally had to print out the questions. It was a nightmare."', source: 'Touro coordinator (f5d66e4c)' },
  { id: 'US-16', priority: 'P2', who: 'Dept Head / Inst Admin', what: 'see a full log of who accessed questions, when, and what changed — exam-window access flagged', why: '"who is in there, what was touched" — Ed + Dr. T', source: 'Ed (ca5a709c) + Dr. T (f5d66e4c)' },
];

interface AnalogyRow extends Record<string, unknown> {
  id: string;
  name: string;
  refs: string;
  takeaway: string;
}
const ANALOGIES: AnalogyRow[] = [
  { id: 'an1', name: 'Question Bank / Repository', refs: 'Google Drive (folders as mental model) · Notion databases (tags, filters, views) · GitHub (versioning, PR-as-approval) · Gmail smart labels / Jira saved filters (Smart Views)', takeaway: 'Treat the bank as a database, not a file system. Smart Views are saved filter queries, not folders. Folder-only thinking breaks at 10,000+ questions — that is where ExamSoft power users hit walls.' },
  { id: 'an2', name: 'Question as a work item', refs: 'Azure DevOps work items · Jira/Linear status transitions · GitHub PR review (parallel reviewers, inline comments) · SonarQube (quality metrics on the item)', takeaway: 'Questions are living entities with lifecycles. Design the detail view like a work item — status pill, assignee, version timeline, inline comments — not a blank form. New metadata fields become just another property.' },
  { id: 'an3', name: 'Tagging system', refs: 'Shopify tags + collections · WordPress taxonomies (controlled categories vs free tags) · Figma component properties · Stack Overflow tag governance', takeaway: 'Structured select/multi-select with a controlled vocabulary, not freeform tags — "MCQ" vs "Multiple Choice" vs "mcq" is a data-quality failure. Escape hatch: "Other + suggest" plus an AI suggestion layer.' },
  { id: 'an4', name: 'Assessment Builder', refs: 'Notion block editor (sections as blocks) · Typeform flow builder (branching) · Monday/Asana templates (blueprint = template) · GitHub Actions (declarative config)', takeaway: 'The builder is structured assembly, not a blank canvas — "fill in the spec", not "build something". New exam types (OSCE, adaptive) become new blueprint configurations, not new UIs.' },
  { id: 'an5', name: 'Exam delivery / student UX', refs: 'Respondus (security baseline) · Duolingo (consumer polish under assessment) · Coursera/edX (arriving mental model) · Apple VoiceOver (a11y as built-in layer)', takeaway: 'The exam environment IS the product for students: consumer-app polish plus WCAG 2.1 AA. Accommodations as platform-level profiles scale to any assessment type automatically.' },
  { id: 'an6', name: 'Grading & review', refs: 'Turnitin (inline annotation) · Canvas SpeedGrader (sequential workflow) · Google Classroom rubrics · GitHub code review (parallel/anonymous graders)', takeaway: 'Grading is a review workflow, not a data-entry screen — the grader sees the submission with grading overlaid. Rubrics as reusable templates give institution-wide consistency.' },
  { id: 'an7', name: 'Reporting & analytics', refs: 'Mixpanel/Amplitude (drill-down) · Tableau (interactive, not PDF) · Datadog (item stats as monitoring) · OKR tools (competency alignment) · skill matrices (heat maps)', takeaway: 'Interactive dashboards with drill-down, never static exports. The PD question is always "which students, which competencies, by when" — dimensions are the reports.' },
  { id: 'an8', name: 'AI features', refs: 'GitHub Copilot (suggest-then-confirm) · Notion AI (context-aware generation) · Grammarly (enhancement layer) · Gmail auto-categorization (shadow suggestions)', takeaway: 'AI as assistant, never replacement: show confidence, let faculty override, never force output. Built as a layer, it extends to any surface — question gen today, remediation paths next.' },
  { id: 'an9', name: 'Import / migration', refs: 'Notion import wizards · Figma Sketch import (fidelity-first preview) · Salesforce field mapping · GitHub repo migration (history preserved)', takeaway: 'Migration is a product feature and the onboarding experience for switchers: self-service wizard, preview before commit, history preserved. Build the generic mapper, not an ExamSoft-only importer.' },
  { id: 'an10', name: 'Collaboration & permissions', refs: 'Google Workspace sharing (visible inline) · Figma org→team→project→file inheritance · GitHub branch protection (workflow-enforced approval)', takeaway: 'Permissions must be visible in the UI — who can see, who can edit, shown inline per item. One platform-level RBAC model for questions, assessments, and reports — not three systems.' },
  { id: 'an11', name: 'LMS integration', refs: 'Stripe webhooks (push, no polling) · Slack integrations (grades just appear) · Zapier trigger→action · Figma plugins (feels native)', takeaway: 'Grade sync should feel like a notification arriving: exam submitted → grade in Canvas, zero-touch after a one-time certified setup. Webhook architecture makes each new LMS a new target, not a redesign.' },
  { id: 'an12', name: 'Curriculum mapping', refs: 'Jira epic→story→subtask hierarchy · OKR alignment tools · dependency graphs · Excel pivot tables (the thing to replace)', takeaway: 'A graph/relationship problem, not a table problem: standards are nodes, assessments are edges, missing edges are coverage gaps. Faculty need to see what is unmapped, not just what is mapped.' },
];

export function Builder() {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const grouped = useTableGroupedRows<FeatureRow>({
    data: FEATURES,
    groupBy: (r) => r.group,
    collapsedGroups: collapsed,
    onToggleGroup: (key) =>
      setCollapsed((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      }),
    getRowKey: (r) => r.id,
    groupOrder: FEATURE_GROUPS,
  });

  return (
    <VStack gap={6}>
      <SpecSection title="Assessment Builder — faculty flow" sub="The primary workflow for Faculty / Course Director; assessment creation is the default framing, bank management the advanced view.">
        <List density="balanced" hasDividers>
          {BUILDER_FLOW.map((s) => (
            <Item
              key={s.step}
              as="li"
              startContent={<Badge variant="neutral" label={s.step} />}
              label={s.screen}
              description={s.detail}
              align="start"
            />
          ))}
        </List>
      </SpecSection>

      <SpecSection title="Question types" sub="Admin creates, student experiences. P1 = Jan 20 MVP scope; P2 follows.">
        <Table<QTypeRow>
          data={QUESTION_TYPES}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'type', header: 'Type', width: pixel(180), renderCell: (r) => <Text type="body" weight="semibold">{r.type}</Text> },
            { key: 'priority', header: 'Pri', width: pixel(60), renderCell: (r) => <Badge variant={r.priority === 'P1' ? 'success' : 'warning'} label={r.priority} /> },
            { key: 'detail', header: 'Behavior + clinical use', width: proportional(4), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.detail}</Text> },
          ]}
        />
      </SpecSection>

      <SpecSection
        title="Feature map"
        sub={`${FEATURES.length} capabilities across ${FEATURE_GROUPS.length} groups; NEW marks first-to-market accessibility surfaces. Groups collapse.`}
      >
        <Table<FeatureRow>
          data={grouped.data}
          idKey={grouped.idKey}
          density="compact"
          verticalAlign="top"
          plugins={{ grouped: grouped.plugin }}
          columns={[
            {
              key: 'title',
              header: 'Capability',
              width: pixel(230),
              renderCell: (r) => (
                <HStack gap={2} vAlign="center" wrap="wrap">
                  <Text type="body" weight="semibold">
                    {r.title}
                  </Text>
                  {r.badge && <Badge variant="success" label={r.badge} />}
                </HStack>
              ),
            },
            { key: 'desc', header: 'Spec', width: proportional(4), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.desc}</Text> },
          ]}
        />
      </SpecSection>

      <SpecSection title="User stories" sub="16 stories across 9 epics, all grounded in verbatim quotes from Vishaka, David, Ed, Aarti, Kunal, Nipun. Each maps to a Magic Patterns component.">
        <StoryTable rows={STORIES} />
      </SpecSection>

      <SpecSection title="Feature analogies" sub="Every major feature maps to an enterprise product that already solved the UX at scale — study the pattern, apply the takeaway.">
        <Table<AnalogyRow>
          data={ANALOGIES}
          idKey="id"
          density="balanced"
          verticalAlign="top"
          columns={[
            { key: 'name', header: 'Feature', width: pixel(190), renderCell: (r) => <Text type="body" weight="semibold">{r.name}</Text> },
            { key: 'refs', header: 'Study', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.refs}</Text> },
            { key: 'takeaway', header: 'Takeaway', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.takeaway}</Text> },
          ]}
        />
      </SpecSection>
    </VStack>
  );
}
