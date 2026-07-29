// views/products/exam/Decisions.tsx — the six architecture decisions plus the
// verbatim-grounded gap ledger (what Magic Patterns is missing, what is built).
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { SpecSection } from '../spec/SpecSection';
import { DecisionCard } from '../spec/DecisionCard';
import { hrefInsights } from '../../../lib/links';

const DECISIONS = [
  {
    title: '1 · Flat tagging over folder hierarchy',
    decision: 'Moved away from ExamSoft rigid folders to flat tagging with Scoped Views. Only 1 of 5 top tools still uses folders.',
    rationale: 'Folders fail cross-course knowledge mapping and break multi-campus sharing. ~20 tags per question enables cross-campus analytics; Canvas and Blackboard already moved to flat lists.',
    tradeoff: 'Folders feel familiar; cognitive overhead may deter casual users. Mitigation: AI handles tagging on save, Scoped Views recreate the folder UX on top of the flat architecture.',
    source: 'Platform strategy Mar 4 · QB architecture Mar 12',
    insightIds: ['ins-em-gap-02'],
  },
  {
    title: '2 · Platform-embedded accessibility, no third-party',
    decision: 'All accessibility features are built into the exam platform. No external tools.',
    rationale: 'LockDown browser blocks all external tools — this is the only compliant path, not a preference. Pearson (GRE/SAT/TOEFL) proves feasibility. Confirmed UNF pilot blocker.',
    tradeoff: 'Custom OSK, zoom and TTS are significantly more expensive. Phased delivery (V0 → V1) manages cost; V0 ships the minimum for UNF pilot compliance.',
    source: 'Accessibility session Mar 16 · Nipun roadmap Mar 11',
  },
  {
    title: '3 · Accommodation profile as program-level object',
    decision: 'Profiles are created once at program level and applied to N students across N exams — not per-exam configuration.',
    rationale: 'D2L needs 70 manual operations for 7 students × 10 quizzes; a program-level profile reduces it to 1. First-to-market differentiator.',
    tradeoff: 'More complex data model requiring careful versioning. Mitigation: profiles are additive — a profile change affects new assignments only, never existing exam assignments.',
    source: 'D2L BrightSpace demo Mar 4 · Exam build Mar 25',
  },
  {
    title: '4 · Publish-gate accessibility checklist',
    decision: 'An exam cannot publish until all critical accessibility items pass: alt text on images, captions on media, profiles for accommodation-flagged students.',
    rationale: 'Error discovery shifts from after 200 students submit to before publish; reduces program-level ADA risk. Mirrors the proven Blackboard Ultra publish gate.',
    tradeoff: 'May frustrate faculty in a hurry. Mitigation: only CRITICAL items block; warnings surface without blocking; each item links to the resource that needs fixing.',
    source: 'Exam build Mar 25 · SKILL.md 13.9',
  },
  {
    title: '5 · React front-end, AI-first architecture',
    decision: 'React confirmed for the entire app (admin + student). Every screen considers AI integration upfront — AI cannot be retrofitted later.',
    rationale: 'AI-first is the primary moat vs ExamSoft, which cannot AI-first a 20-year-old codebase.',
    tradeoff: 'AI features blocked in Phase 1 over adoption concerns; risk of over-promising timelines. Mitigation: Phase 1 is AI-architecture-ready with features off until the May sprint.',
    source: 'PRISM Day 2 Mar 3 · Exam stand-up Mar 19',
  },
  {
    title: '6 · Assessment creation as primary workflow',
    decision: 'Assessment creation, not QB management, is the primary workflow — the early wireframe was too database-heavy.',
    rationale: "Faculty's job is building and delivering exams, not curating a database. Three entry points to questions: bank direct, within course, during exam assembly.",
    tradeoff: 'Program-level power users want bank management as primary. Progressive disclosure: assessment creation as default, bank management in the advanced view.',
    source: 'QB multi-campus Mar 12 · Platform strategy Mar 4',
  },
];

interface GapItem {
  who: string;
  gap: string;
  quote?: string;
  p: 'P0' | 'P1' | 'P2';
  built?: boolean;
}

const GAP_GROUPS: { title: string; sub: string; items: GapItem[] }[] = [
  {
    title: 'Student exam-taking view (Epic 1) — absent from Magic Patterns',
    sub: 'Verbatim cross-check: David + Kunal + Aarti + Romit, session f29a990d.',
    items: [
      { who: 'David + Romit (f29a990d)', gap: 'Full student exam view — navigator, flag 2×2, keyboard shortcuts, cross-out, submit logic, section screens, pre-exam tutorial.', quote: 'Student wants to visually cross out answers… crossed-out options remain selectable', p: 'P0' },
      { who: 'Kunal (f29a990d)', gap: 'Flag is a 2×2 attribute — answered/unanswered × flagged/not-flagged. Not a third bucket.', quote: 'Flag is an attribute of both buckets… it is a 2x2 matrix', p: 'P0' },
      { who: 'Aarti + Kunal (f29a990d)', gap: 'Submit button always visible but faded; prominent only at the last question or last 5–10 minutes. Never "Exit exam".', quote: 'Do not hide it. Keep it visible but faded until conditions are met', p: 'P0' },
      { who: 'Aarti (f29a990d)', gap: 'Section entry screen shows title + question count before entering; faculty configures lock (GRE model) or free navigation.', quote: 'You enter a section… screen says section one, this is the topic…', p: 'P0' },
      { who: 'Romit (f29a990d)', gap: 'Pre-exam tutorial: one sample question + audio check before the timer starts.', p: 'P2' },
    ],
  },
  {
    title: 'PA Student Dashboard (Epic 5) — the Influx differentiator',
    sub: 'Vishaka, session 7dbabdb5.',
    items: [
      { who: 'Vishaka (7dbabdb5)', gap: 'PA dashboard: PACKRAT 1+2, EOR by all 7 specialties, OSCE, EOC, PANCE readiness predictor (75+ = good passing chance), cohort vs national.', quote: 'Even Influx is not doing this level of report… this would be our differentiator', p: 'P0' },
      { who: 'Vishaka (7dbabdb5)', gap: 'Bulk CSV upload for PAEA + ExamSoft data; 5-minute manual step acceptable initially; match by student ID.', p: 'P1' },
      { who: 'Vishaka (7dbabdb5)', gap: 'Cohort dashboard alongside individual view: cohort vs cohort by year plus national averages.', p: 'P2' },
    ],
  },
  {
    title: 'Ed Razenbach gaps',
    sub: 'Session ca5a709c.',
    items: [
      { who: 'Ed', gap: '"Assessments" label → "Exams" everywhere. Ed and the Touro coordinator said this independently.', quote: 'The word assessment kinda throws everything off. Write down Exams.', p: 'P0' },
      { who: 'Ed', gap: 'Z-score display alongside raw scores, with national mean + SD from PAEA per exam.', quote: "A raw 412 in EM is not the same as a 382 in women's health", p: 'P1' },
      { who: 'Ed', gap: 'Remediation exam workflow post-EOR fail: specialty-specific, open book, untimed, sequestered questions.', quote: 'I have exams set aside just for remediation purposes', p: 'P1' },
      { who: 'Ed', gap: 'OSCE rubric as question type 10 with critical task marking and multi-rubric per encounter.', quote: '100 scenarios across specialties. Done in ExamSoft with rubric functionality.', p: 'P1' },
      { who: 'Ed', gap: "Bloom's 1–3 only mode (PAEA uses 1–3; ExamSoft 1–5).", p: 'P2' },
      { who: 'Ed', gap: 'Real-time audit trail: who accessed questions, when, what changed.', quote: 'Who is in there, what was touched — a detailed audit analysis', p: 'P2' },
      { who: 'Ed + Touro', gap: 'Multi-campus question sharing without print/email/re-upload.', quote: 'We literally had to print out the questions, send them over. It was a nightmare.', p: 'P2' },
    ],
  },
  {
    title: 'Accessibility + D2L gaps',
    sub: 'D2L demo c7a8d32e · Nipun UNF pilot 4c9b94f5 · accessibility session 77fc2588.',
    items: [
      { who: 'D2L demo · Mar 4', gap: 'Bulk accommodation assignment: 7 students × 10 quizzes = 70 manual D2L setups; program-level profile = 1. First-to-market.', p: 'P0' },
      { who: 'Nipun · Mar 11', gap: 'V0 accessibility for the UNF Australia pilot (July): magnification, high contrast, extra time. ACR validation required.', p: 'P0', built: true },
      { who: 'A11y session · Mar 16', gap: 'Two-phase approach confirmed: Phase 1 minimum for UNF pilot; Phase 2 comprehensive revamp with the student portal overhaul.', p: 'P0' },
      { who: 'A11y session · Mar 16', gap: 'On-screen keyboard must be platform-embedded — LockDown blocks external tools; Pearson is the reference architecture.', p: 'P1' },
      { who: 'Nipun · Mar 11', gap: 'Question rationale per question, shown after submission; AI-assisted authoring. Low-stakes exam differentiator.', p: 'P2' },
    ],
  },
];

const BUILT = [
  'Cross-out feature (David) — strike options without removing selectability.',
  'Text highlighting in passage questions (David).',
  'Calculator per question (David).',
  'Proxy submit for disconnected student (Vishaka standup).',
  'Accessibility publish gate — alt text blocks publish; TTS/STT/zoom/OSK/focus mode.',
  'Post-exam: 5 curving options from the ExamSoft demos.',
  'Live monitoring with per-student progress, time remaining, accommodation multiplier.',
  'Role switcher: Dept Head, Faculty, Contributor, Reviewer, Outcome Director, Inst Admin.',
];

const SCREEN_PRIORITIES = [
  { screen: 'Screen 1 — QB navigation', deadline: 'Apr 3', detail: 'Two entry points: global QB sidebar item + course-level QB with auto-tag. Smart-view sidebar with personal + dept views. Draft counter badge.' },
  { screen: 'Screen 2 — QB table / filter', deadline: 'Apr 3', detail: "Columns: ID, stem, type, status, Bloom's, difficulty, author. Filter bar: status, topic, Bloom's, course, type. Bulk action row on selection (Gmail-style floating bar — ia-arch-008)." },
  { screen: 'Screen 3 — Question editor', deadline: 'Apr 7', detail: 'Role-gated: Faculty sees create/submit, Dept Head sees approve/reject. Version chain visualization. Edit-in-assessment vs master-edit modal split.' },
];

const P_VARIANT: Record<GapItem['p'], 'error' | 'warning' | 'info'> = { P0: 'error', P1: 'warning', P2: 'info' };

export function Decisions() {
  return (
    <VStack gap={6}>
      <SpecSection title="Design decisions" sub="Six decided positions — each with its rationale and the tradeoff it accepts.">
        <Grid columns={{ minWidth: 380, max: 2 }} gap={3}>
          {DECISIONS.map((d) => (
            <DecisionCard key={d.title} {...d} />
          ))}
        </Grid>
      </SpecSection>

      <SpecSection title="Gap ledger — grounded in verbatim quotes" sub="Every gap traces to a direct quote from a named session. P0 blocks the Apr 17 demo.">
        <VStack gap={3}>
          {GAP_GROUPS.map((g) => (
            <Card key={g.title} padding={4}>
              <VStack gap={3}>
                <VStack gap={0.5}>
                  <Text type="body" weight="semibold">
                    {g.title}
                  </Text>
                  <Text type="supporting">{g.sub}</Text>
                </VStack>
                {g.items.map((it, i) => (
                  <VStack key={i} gap={0.5}>
                    <HStack gap={2} vAlign="center" wrap="wrap">
                      <Badge variant={P_VARIANT[it.p]} label={it.p} />
                      {it.built && <Badge variant="success" label="Built" />}
                      <Text type="supporting">{it.who}</Text>
                    </HStack>
                    <Text type="body" as="p" textWrap="pretty">
                      {it.gap}
                    </Text>
                    {it.quote && <Blockquote>{it.quote}</Blockquote>}
                  </VStack>
                ))}
              </VStack>
            </Card>
          ))}
        </VStack>
        <Link href={hrefInsights({ product: 'exam-management', severity: 'critical' })} isStandalone>
          All critical exam-management findings →
        </Link>
      </SpecSection>

      <SpecSection title="What is built correctly" sub="Present in Magic Patterns and confirmed correct.">
        <Collapsible trigger={`${BUILT.length} confirmed-built items`} defaultIsOpen={false}>
          <VStack gap={1}>
            {BUILT.map((b, i) => (
              <HStack key={i} gap={2} vAlign="center">
                <Badge variant="success" label="✓" />
                <Text type="supporting">{b}</Text>
              </HStack>
            ))}
          </VStack>
        </Collapsible>
      </SpecSection>

      <SpecSection title="Magic Patterns build priorities" sub="Design implications from the QB architecture — the next three screens, with target dates.">
        <Grid columns={{ minWidth: 260, max: 3 }} gap={3}>
          {SCREEN_PRIORITIES.map((s) => (
            <Card key={s.screen} variant="muted" padding={3}>
              <VStack gap={1}>
                <HStack gap={2} vAlign="center" hAlign="between">
                  <Text type="body" weight="semibold">
                    {s.screen}
                  </Text>
                  <Badge variant="error" label={s.deadline} />
                </HStack>
                <Text type="supporting" as="p" textWrap="pretty">
                  {s.detail}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </SpecSection>
    </VStack>
  );
}
