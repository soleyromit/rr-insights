// views/products/pce/Questions.tsx — the 24-question ledger as one table with
// row expansion (v19; replaces 24 stacked Collapsibles). The StatTile row is
// computed from the data array, never asserted.
import { useState } from 'react';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Table, pixel, proportional, useTableRowExpansion, useTableRowExpansionState } from '@astryxdesign/core/Table';
import { StatTile, StatTileRow } from '../../../components/story/StatTile';
import { SpecSection } from '../spec/SpecSection';

type Priority = 'P0' | 'P1' | 'P2';

const OPEN_QUESTIONS: { q: string; priority: Priority; answered: boolean; answer: string }[] = [
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

interface QRow extends Record<string, unknown> {
  id: string;
  kind: 'q' | 'a';
  q: string;
  priority?: Priority;
  answered?: boolean;
  answer?: string;
  children?: QRow[];
}

const TREE: QRow[] = OPEN_QUESTIONS.map((q, i) => ({
  id: `q${i}`,
  kind: 'q',
  q: q.q,
  priority: q.priority,
  answered: q.answered,
  children: [{ id: `a${i}`, kind: 'a', q: q.answer }],
}));

const P_VARIANT: Record<Priority, 'error' | 'warning' | 'info'> = { P0: 'error', P1: 'warning', P2: 'info' };

export function Questions() {
  const total = OPEN_QUESTIONS.length;
  const answered = OPEN_QUESTIONS.filter((q) => q.answered).length;
  const open = total - answered;
  const p0 = OPEN_QUESTIONS.filter((q) => q.priority === 'P0').length;

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const { data, expansionConfig } = useTableRowExpansionState<QRow>({
    baseData: TREE,
    getChildren: (r) => r.children ?? [],
    getRowKey: (r) => r.id,
    expandedKeys,
    setExpandedKeys,
  });
  const expansion = useTableRowExpansion<QRow>({ ...expansionConfig, hasRowClickExpansion: true });

  return (
    <SpecSection
      title="Open questions ledger"
      sub="Answered by Monil Mar 26 + Mohil/Vishaka/David Mar 24 + PCE Primer v2. One remains open — question types and answer formats. Design can proceed on P1 scope. Expand a row for its answer."
    >
      <StatTileRow>
        <StatTile value={total} label="product questions" />
        <StatTile value={answered} label="answered" />
        <StatTile value={open} label="still open" hint="question types + answer formats" />
        <StatTile value={p0} label="P0 questions" />
      </StatTileRow>
      <Table<QRow>
        data={data}
        idKey="id"
        density="balanced"
        verticalAlign="top"
        plugins={{ expansion }}
        columns={[
          {
            key: 'priority',
            header: 'Pri',
            width: pixel(64),
            renderCell: (r) => (r.kind === 'q' && r.priority ? <Badge variant={P_VARIANT[r.priority]} label={r.priority} /> : null),
          },
          {
            key: 'answered',
            header: 'Status',
            width: pixel(100),
            renderCell: (r) =>
              r.kind === 'q' ? <Badge variant={r.answered ? 'success' : 'error'} label={r.answered ? 'answered' : 'OPEN'} /> : null,
          },
          {
            key: 'q',
            header: 'Question / answer',
            width: proportional(5),
            renderCell: (r) =>
              r.kind === 'q' ? (
                <Text type="body" as="p" textWrap="pretty">
                  {r.q}
                </Text>
              ) : (
                <Text type="supporting" as="p" textWrap="pretty">
                  {r.q}
                </Text>
              ),
          },
        ]}
      />
    </SpecSection>
  );
}
