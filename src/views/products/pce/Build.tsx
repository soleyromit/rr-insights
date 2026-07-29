// views/products/pce/Build.tsx — milestones, the 3-layer architecture and the
// AI differentiation plan (v19, split from the CourseEvalView monolith).
import { VStack } from '@astryxdesign/core/VStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Fig } from '../../../components/charts/Fig';
import { RankedList } from '../../../components/charts/RankedList';
import { SpecSection } from '../spec/SpecSection';

interface LayerRow extends Record<string, unknown> {
  id: string;
  n: string;
  label: string;
  who: string;
  items: string;
}
const LAYERS: LayerRow[] = [
  { id: 'l1', n: '1', label: 'Template Setup', who: 'Admin / Program Director', items: 'Select program + course type (clinical / didactic) · maximum 2 templates per program · fixed structure: course section (5–6 Qs) + faculty section (5–6 Qs) · templates saved at program level, reusable across offerings · toggle course vs faculty sections independently · add 1–3 supplemental questions beyond the base.' },
  { id: 'l2', n: '2', label: 'Distribution', who: 'Admin / PD (TBD)', items: 'Select template for program + course type · choose the course offering (e.g. "ABC Spring 2026") · auto-populate student + faculty lists from Prism · faculty management: review/edit assignments, guest faculty · TAs and part-time faculty included for evaluation · survey window: open/close dates.' },
  { id: 'l3', n: '3', label: 'Analytics & Reporting', who: 'PD + Faculty + Dean', items: 'Year-over-year faculty performance · cross-faculty comparison within programs · response-rate monitoring per course · program-level benchmarking · AI sentiment: improvement vs compliment classification · AI SWOT visualization per course · AI cross-program complaint analysis · top-category extraction from qualitative responses.' },
];

interface MonilQ extends Record<string, unknown> {
  id: string;
  priority: 'P0' | 'P1' | 'P2';
  q: string;
}
const MONIL_QUESTIONS: MonilQ[] = [
  { id: 'mq1', priority: 'P0', q: 'Who distributes surveys: program director, course coordinator, or admin?' },
  { id: 'mq2', priority: 'P0', q: 'What is the user value hierarchy per persona?' },
  { id: 'mq3', priority: 'P1', q: 'Which response-rate tactics are in scope (incentives, gamification)?' },
  { id: 'mq4', priority: 'P1', q: 'How do free-text comment links to question categories work?' },
  { id: 'mq5', priority: 'P1', q: 'Cross-faculty comparison methodology and fairness?' },
  { id: 'mq6', priority: 'P2', q: 'Should a future question bank integrate with exam management banks?' },
];

const READINESS = [
  { key: 'template', label: 'Template builder', value: 85, hint: 'role feedback incorporated; default toggle removed' },
  { key: 'dist', label: 'Distribution workflow', value: 80, hint: 'single table with soft warnings — confirmed Jul 20' },
  { key: 'single', label: 'Single survey analytics (View Results)', value: 75, hint: 'due engineering end of Jul 28 week' },
  { key: 'comms', label: 'Communication settings', value: 70, hint: 'centralized, not per-survey — confirmed Jul 28' },
  { key: 'multi', label: 'Multi-survey analytics', value: 30, hint: 'paused — requirements not frozen (Jul 28)' },
  { key: 'ai', label: 'AI narrative synthesis', value: 5, hint: 'Q3 post-beta; not in Sep 15 scope' },
];

export function Build() {
  return (
    <VStack gap={6}>
      <SpecSection
        title="Milestones"
        sub="Apr 10 leadership presentation (Vishaka · David · Aarti): draft journey visualizations, template creation workflow, distribution workflow — mockups in the Exxat DS, not a prototype. Requirement + design freeze end of April; engineering handoff May 2026. Strategic value: PCE is the sales entry point for non-Prism programs. Sources: Monil Mar 26 + Romit<>Monil PRD Mar 30."
      >
        <Fig
          title="PCE design readiness by module"
          n={READINESS.length}
          caption="Sources: Granola Jul 20 + Jul 28. Multi-survey analytics is paused because its requirements are not frozen — the red bar is a decision queue, not a build queue."
        >
          <RankedList rows={READINESS} format={(r) => `${r.value}%`} errorBelow={50} />
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
        <Table<LayerRow>
          data={LAYERS}
          idKey="id"
          density="balanced"
          verticalAlign="top"
          columns={[
            { key: 'n', header: '', width: pixel(50), renderCell: (r) => <Badge variant="neutral" label={r.n} /> },
            { key: 'label', header: 'Layer', width: pixel(180), renderCell: (r) => <Text type="body" weight="semibold">{r.label}</Text> },
            { key: 'who', header: 'Owner', width: pixel(190), renderCell: (r) => <Text type="supporting">{r.who}</Text> },
            { key: 'items', header: 'Scope', width: proportional(4), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.items}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection
        title="AI differentiation — without 'AI-powered' branding"
        sub="Competitors provide basic math (median, mode, mean). Exxat surfaces integrated insights automatically: sentiment classification, SWOT visualization, cross-program complaint analysis, top-category extraction, comment filtering by signal type, faculty-vs-program auto-benchmarks. Monil directive: complete Watermark CES and Explorance Blue video walkthroughs before designing the analytics layer — their missing YoY/AI summaries are the gap."
      >
        <Table<MonilQ>
          data={MONIL_QUESTIONS}
          idKey="id"
          density="compact"
          columns={[
            { key: 'priority', header: 'Pri', width: pixel(64), renderCell: (r) => <Badge variant={r.priority === 'P0' ? 'error' : r.priority === 'P1' ? 'warning' : 'info'} label={r.priority} /> },
            { key: 'q', header: 'Open question from Monil (Mar 26)', width: proportional(5), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.q}</Text> },
          ]}
        />
      </SpecSection>
    </VStack>
  );
}
