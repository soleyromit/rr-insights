// views/products/pce/Strategy.tsx — the north star, Aarti's anti-patterns and
// the D2L displacement opportunities (v19, split from the CourseEvalView
// monolith). Prose bullet-cards reshaped into edge-to-edge tables.
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { SpecSection } from '../spec/SpecSection';

interface ViewRow extends Record<string, unknown> {
  id: string;
  title: string;
  q: string;
  d: string;
}
const NORTH_STAR_VIEWS: ViewRow[] = [
  { id: 'course', title: 'Course leaderboard', q: 'Which courses are doing best — and worst — this semester?', d: 'All courses ranked by average score, trending vs last semester, below-threshold courses flagged automatically. The leaderboard IS the AI insight.' },
  { id: 'faculty', title: 'Faculty leaderboard', q: 'Which faculty need attention — who should be recognized?', d: 'Faculty ranked by student perception, year-over-year per faculty, new faculty auto-flagged for observation. "This is what keeps the dean up at night."' },
  { id: 'cohort', title: 'Cohort trend', q: 'How does the class of 2026 perceive the curriculum vs 2025?', d: 'Cohort-level comparison signals curriculum drift and faculty turnover impact — the accreditation improvement story.' },
];

interface PatternRow extends Record<string, unknown> {
  id: string;
  anti: string;
  instead: string;
}
const ANTI_PATTERNS: PatternRow[] = [
  { id: 'ap1', anti: '"Click here for AI insights" button', instead: 'Insights are embedded in the leaderboard layout; there is no separate AI panel.' },
  { id: 'ap2', anti: 'Flat alphabetical course list → click → report', instead: 'Show the picture first; details are drill-downs, not the entry point.' },
  { id: 'ap3', anti: 'No time dimension', instead: 'Directors always look at the previous semester — organize by term with trending indicators.' },
  { id: 'ap4', anti: 'Collecting data without connecting it to decisions', instead: 'Qualtrics collects too; the moat is connecting evaluations to curriculum changes, accreditation reports and faculty development.' },
];

interface D2LRow extends Record<string, unknown> {
  id: string;
  gap: string;
  opportunity: string;
}
const D2L_GAPS: D2LRow[] = [
  { id: 'dg1', gap: 'No in-document annotation feedback', opportunity: 'Let faculty annotate submitted PDFs (comments, highlights, ink) and publish to students.' },
  { id: 'dg2', gap: 'No publish/draft state for grades', opportunity: 'Grade all, review, publish at once; every LMS has this, Exxat does not.' },
  { id: 'dg3', gap: 'No auto-alert for inactive students', opportunity: 'Rule-based notifications D2L ships built-in.' },
  { id: 'dg4', gap: 'ExamSoft being sold by Turnitin', opportunity: 'The displacement window is open; take the clinical education slice LMSs cannot serve.' },
];

export function Strategy() {
  return (
    <VStack gap={6}>
      <SpecSection title="The north star" sub="Aarti · PRISM Day 3 · Mar 4 (session c7a8d32e). The product is a program quality intelligence dashboard, not a form tool with a reporting tab.">
        <Blockquote cite="Aarti · PRISM Day 3 · Mar 4, 2026">
          Which courses are doing better? Which faculty are not doing better? How are my cohorts perceiving my curriculum, and
          what changes do I need to make? I want AI insights embedded in the dashboard — not a button I click to get AI
          insights. If I see a button that says click here to get AI insights, I am done.
        </Blockquote>
        <Table<ViewRow>
          data={NORTH_STAR_VIEWS}
          idKey="id"
          density="balanced"
          verticalAlign="top"
          columns={[
            { key: 'title', header: 'View', width: pixel(180), renderCell: (r) => <Text type="body" weight="semibold">{r.title}</Text> },
            { key: 'q', header: 'The question it answers', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.q}</Text> },
            { key: 'd', header: 'What it shows', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.d}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection title="Anti-patterns — Aarti verbatim" sub="Session c7a8d32e. Four ways to fail the north star, each paired with the correct move.">
        <Table<PatternRow>
          data={ANTI_PATTERNS}
          idKey="id"
          density="balanced"
          verticalAlign="top"
          columns={[
            { key: 'anti', header: 'Anti-pattern', width: proportional(2), renderCell: (r) => <Text type="body" as="p" textWrap="pretty">{r.anti}</Text> },
            { key: 'instead', header: 'Instead', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.instead}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection title="D2L gaps that become Exxat opportunities" sub="D2L BrightSpace demo · Mar 4 (c7a8d32e).">
        <Table<D2LRow>
          data={D2L_GAPS}
          idKey="id"
          density="balanced"
          verticalAlign="top"
          columns={[
            { key: 'gap', header: 'D2L gap', width: proportional(2), renderCell: (r) => <Text type="body" as="p" textWrap="pretty">{r.gap}</Text> },
            { key: 'opportunity', header: 'Exxat opportunity', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.opportunity}</Text> },
          ]}
        />
      </SpecSection>
    </VStack>
  );
}
