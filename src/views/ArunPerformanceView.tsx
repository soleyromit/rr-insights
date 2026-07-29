// views/ArunPerformanceView.tsx — Performance Ledger (v18 Astryx rebuild).
// Source 1: Offer of Appointment — Kunal Vaishnav / Exxat Inc · Mar 15, 2026.
// Source 2: Granola raw transcript — Arun<>Romit Vision · Mar 24, 2026 (791334af).
// Seven offer-letter criteria as a scored table with rationale, a ranked hero
// of scores against the 85 target, and the ten verbatim Arun quotes kept whole.
// (v18 cut: evidence/gap/action sublists, velocity chart, milestone board.)
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Badge } from '@astryxdesign/core/Badge';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { hrefPortfolio, hrefBriefings, hrefInsights } from '../lib/links';

const TARGET = 85;

// ── Verbatim Arun quotes from the raw transcript (791334af) — not paraphrased ──
const ARUN_VERBATIM = [
  { quote: 'Your top top top priority is this only — exam taker experience and admin/faculty assessment creation.', context: 'Confirming Exam Management as sole priority for next few weeks', source: 'Raw transcript · Mar 24' },
  { quote: 'AI can be used, it should be used. Everywhere. Like, everywhere. AI can be used, it should be used.', context: 'On AI integration philosophy — not selective, not optional', source: 'Raw transcript · Mar 24' },
  { quote: 'We want to reduce the amount of time faculty has to spend. That is the goal. We want to actively reduce the amount of time they have to spend designing exams.', context: 'Defining the core AI success metric explicitly', source: 'Raw transcript · Mar 24' },
  { quote: "ExamSoft is publicly against AI. Which is, like, amazing from my point of view. We are like, great. You don't use AI. We are going to use it.", context: 'Strategic framing — ExamSoft anti-AI stance is Exxat\'s opening', source: 'Raw transcript · Mar 24' },
  { quote: 'The exam taker app — whatever you build becomes the part of the design system. There is nothing like this we have.', context: 'On design system: exam taker UI is greenfield, not constrained by Himanshu DS', source: 'Raw transcript · Mar 24' },
  { quote: 'Speed of delivery is of higher importance. Speed over above anything else.', context: 'Explicitly ranking speed over design system compliance', source: 'Raw transcript · Mar 24' },
  { quote: 'I will not inject myself into too many design reviews. I will do one review when it is rounded up to see if there are any major problems.', context: 'On Arun\'s review cadence — one review at phase completion, not incremental', source: 'Raw transcript · Mar 24' },
  { quote: "The dev team's primary job is to execute what the three of you — you, Vishakha, and Nipun — propose.", context: 'Clarifying design-PM-engineering authority structure', source: 'Raw transcript · Mar 24' },
  { quote: 'Current product requirements — the alignment with the high-level strategic differentiation is not as visible as it should be.', context: 'Arun agreeing with Romit\'s observation about PRD quality gap', source: 'Raw transcript · Mar 24' },
  { quote: 'I would say it is more of a first draft than the final design system. We do not quite have a design system at this point.', context: 'Arun\'s own characterization of Himanshu\'s DS — removes the blocker', source: 'Raw transcript · Mar 24' },
];

type Status = 'strong' | 'on-track' | 'in-progress' | 'at-risk';

interface Criterion {
  id: string;
  label: string;
  weight: number;
  score: number;
  status: Status;
  offerText: string;
  rationale: string;
  cite: { label: string; href: string };
}

// ── 7 criteria from the offer letter, scored with rationale; the cite column
// names the surface in this app where the rationale's evidence lives. ──
const CRITERIA: Criterion[] = [
  {
    id: 'ui-design', label: 'UI Design', weight: 22, score: 68, status: 'in-progress',
    offerText: 'Designing user interface components, workflows, and interaction patterns for assigned features within Exxat\'s software platform.',
    rationale: 'Architecture and component decisions are strong and well-reasoned. Score held at 68 because zero Magic Patterns interactive artifacts exist yet — the offer letter requirement is "designing components", which requires built, not described, components.',
    cite: { label: 'Portfolio', href: hrefPortfolio() },
  },
  {
    id: 'prototypes', label: 'Prototypes', weight: 20, score: 55, status: 'at-risk',
    offerText: 'Creating wireframes, mockups, and interactive prototypes to support product development and usability improvements.',
    rationale: 'Score 55 because no MP prototype exists for any Exam Management screen. The offer letter\'s primary deliverable here is interactive prototypes; engineering joined needing design assets. The single highest-risk criterion.',
    cite: { label: 'Portfolio pipeline', href: hrefPortfolio() },
  },
  {
    id: 'requirements', label: 'Requirements → Design', weight: 18, score: 87, status: 'strong',
    offerText: 'Translating product requirements and user stories into clear, user-centered interface designs.',
    rationale: 'Score raised to 87. Romit not only translates requirements — he identified the gap Arun himself agreed with: PRDs lack strategic AI thinking, raised directly in session. That goes beyond the offer letter\'s stated expectation.',
    cite: { label: 'Briefings', href: hrefBriefings() },
  },
  {
    id: 'collaboration', label: 'PM + Eng Collaboration', weight: 16, score: 76, status: 'on-track',
    offerText: 'Collaborating with product managers and engineering teams to ensure designs align with product requirements and technical constraints.',
    rationale: 'Score 76. Sessions are happening and decisions are being aligned; the gap is that the formal handoff artifact (MP file + spec) does not exist yet, so collaboration is still verbal, not documented.',
    cite: { label: 'Briefings', href: hrefBriefings() },
  },
  {
    id: 'design-reviews', label: 'Reviews + Specs', weight: 10, score: 60, status: 'at-risk',
    offerText: 'Participating in design reviews and supporting implementation by providing design specifications and clarifying design intent during development.',
    rationale: 'Score 60. Arun said he will only run one phase-end review, which reduces review pressure — but the offer letter requires design specifications and intent documentation, and zero specs exist. That is a real gap.',
    cite: { label: 'Design-system evidence', href: hrefInsights({ q: 'design system' }) },
  },
  {
    id: 'usability', label: 'Usability + Feedback', weight: 8, score: 88, status: 'strong',
    offerText: 'Evaluating product usability through feedback from users and internal stakeholders to improve overall user experience.',
    rationale: 'Score 88. The NPS analysis and multi-persona research are genuinely strong — 1,494 responses analysed, 8+ personas interviewed, domain breakdown with NPS leverage calculated. The gap is Pendo behavioral data and SCCE under-representation.',
    cite: { label: 'NPS-sourced insights', href: hrefInsights({ source: 'NPS' }) },
  },
  {
    id: 'accessibility', label: 'Accessibility + Compliance', weight: 6, score: 91, status: 'strong',
    offerText: 'Incorporating accessibility and compliance considerations, including applicable healthcare education regulations such as HIPAA, FERPA, and ADA, when designing product interfaces and workflows.',
    rationale: 'Highest-scoring criterion at 91. Program-level accommodation profiles are a first-to-market architecture decision; the WCAG 2.1 AA feature map is complete and the publish gate is designed. The only gap is formal delivery to Himanshu as a written spec.',
    cite: { label: 'Accessibility evidence', href: hrefInsights({ tag: 'accessibility' }) },
  },
];

const OVERALL = Math.round(CRITERIA.reduce((s, c) => s + c.score * (c.weight / 100), 0));

const STATUS_BADGE: Record<Status, { label: string; variant: 'success' | 'info' | 'warning' | 'error' }> = {
  strong: { label: 'Strong', variant: 'success' },
  'on-track': { label: 'On track', variant: 'info' },
  'in-progress': { label: 'In progress', variant: 'warning' },
  'at-risk': { label: 'At risk', variant: 'error' },
};

interface Row extends Record<string, unknown> {
  id: string;
  c: Criterion;
}

export function ArunPerformanceView() {
  const heroRows = [...CRITERIA]
    .sort((a, b) => b.score - a.score)
    .map((c) => ({
      key: c.id,
      label: c.label,
      value: c.score,
      hint: `weight ${c.weight}% · ${STATUS_BADGE[c.status].label.toLowerCase()}`,
      href: c.cite.href,
    }));

  const rows: Row[] = CRITERIA.map((c) => ({ id: c.id, c }));

  return (
    <VStack gap={5} padding={6} maxWidth={1100}>
      <PageHeader
        title="Performance Ledger"
        lede="Seven criteria from the official offer letter, cross-referenced with the raw Granola transcript of the Arun session — every Arun quote is verbatim, not paraphrased."
        meta={`Weighted score ${OVERALL}/100 · offer letter: Kunal Vaishnav · Mar 15, 2026 · transcript 791334af · Mar 24, 2026 · reports to Arun Gautam`}
      />

      <Fig
        title={`Criterion scores against the ${TARGET} target`}
        caption={`Red bars sit under 70 — prototypes and specs are the two at-risk criteria, and both are unblocked by the same deliverable: built Magic Patterns artifacts. Each bar links to the evidence surface its rationale cites. Weighted overall: ${OVERALL}/100.`}
      >
        <RankedList rows={heroRows} errorBelow={70} format={(r) => `${r.value}/100`} />
      </Fig>

      <Fig
        title="The seven offer-letter criteria"
        caption="Weight is the offer letter's emphasis; the rationale states why each score is what it is. The cite column opens the surface in this app where the supporting evidence lives."
      >
        <Table<Row>
          data={rows}
          idKey="id"
          density="balanced"
          hasHover
          columns={[
            {
              key: 'criterion',
              header: 'Criterion',
              width: proportional(2),
              renderCell: (r: Row) => (
                <VStack gap={0.5}>
                  <HStack gap={2} vAlign="center">
                    <Text type="body" weight="semibold">
                      {r.c.label}
                    </Text>
                    <Badge variant={STATUS_BADGE[r.c.status].variant} label={STATUS_BADGE[r.c.status].label} />
                  </HStack>
                  <Text type="supporting" as="p" maxLines={2} hasTruncateTooltip textWrap="pretty">
                    {r.c.offerText}
                  </Text>
                </VStack>
              ),
            },
            { key: 'weight', header: 'Weight', width: pixel(80), align: 'end', renderCell: (r: Row) => <Text type="body" hasTabularNumbers>{r.c.weight}%</Text> },
            { key: 'score', header: 'Score', width: pixel(80), align: 'end', renderCell: (r: Row) => <Text type="body" hasTabularNumbers>{r.c.score}</Text> },
            {
              key: 'rationale',
              header: 'Rationale',
              width: proportional(3),
              renderCell: (r: Row) => (
                <Text type="supporting" as="p" textWrap="pretty">
                  {r.c.rationale}
                </Text>
              ),
            },
            {
              key: 'cite',
              header: 'Cites',
              width: pixel(170),
              renderCell: (r: Row) => <Link href={r.c.cite.href}>{r.c.cite.label} →</Link>,
            },
          ]}
        />
      </Fig>

      <Card padding={4}>
        <Collapsible
          trigger={<Text type="label" color="secondary">{`Arun verbatim — ${ARUN_VERBATIM.length} direct quotes (raw transcript 791334af · Mar 24, 2026)`}</Text>}
          defaultIsOpen={false}
        >
          <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
            {ARUN_VERBATIM.map((q, i) => (
              <Card key={i} variant="muted" padding={3}>
                <Blockquote cite={`${q.context} · ${q.source}`}>{q.quote}</Blockquote>
              </Card>
            ))}
          </Grid>
        </Collapsible>
      </Card>
    </VStack>
  );
}
