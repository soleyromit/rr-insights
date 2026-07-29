// views/CompetitiveView.tsx — Competitive Parity (v18 Astryx rebuild).
// Parity matrix as a table of status cells, weighted-parity ranked meters, the
// open-territory list, and the three ExamSoft retention anchors — each ending
// in the evidence query that backs it. The Cohere date conflict stays surfaced.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Token } from '@astryxdesign/core/Token';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { COMPETITOR_FEATURES } from '../data/personas';
import { PRODUCTS } from '../data/products';
import { COHERE_LAUNCH } from '../data/taxonomy';
import { parsePhaseDate } from '../lib/phaseDates';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { hrefInsights, hrefProduct } from '../lib/links';

type CellValue = boolean | 'partial';
const PLATFORMS = [
  { key: 'exxat', label: 'Exxat' },
  { key: 'examsoft', label: 'ExamSoft' },
  { key: 'blackboard', label: 'Blackboard' },
  { key: 'd2l', label: 'D2L' },
] as const;

const score = (v: CellValue) => (v === true ? 1 : v === 'partial' ? 0.5 : 0);

// The three reasons programs stay on ExamSoft (Dr. Vicky Mody session, Mar 20)
// and Exxat's answer to each. Status is stated, not scored: nothing is measured yet.
const ANCHORS = [
  { title: 'Curriculum mapping', state: 'partial', response: 'Flat tagging architecture + bulk tag on import. One system, no Excel.', evidence: 'ins-em-008 · ins-em-011', q: 'curriculum mapping' },
  { title: 'Faculty training over years', state: 'planned', response: 'Canvas-level UX so training is unnecessary; migration UX designed for the switching moment.', evidence: 'ins-em-018', q: 'ExamSoft' },
  { title: 'Strong item analytics', state: 'planned', response: 'Item heatmaps + p-values in Assessment analytics; AI layer (May sprint) surpasses rather than matches.', evidence: 'ins-em-015 · ins-em-016', q: 'item analytics' },
];

interface FeatureRow extends Record<string, unknown> {
  id: string;
  name: string;
  exxat: CellValue;
  examsoft: CellValue;
  blackboard: CellValue;
  d2l: CellValue;
}

function StatusCell({ v }: { v: CellValue }) {
  if (v === true) return <StatusDot variant="success" label="have" />;
  if (v === 'partial') return <StatusDot variant="warning" label="partial" />;
  return <StatusDot variant="neutral" label="missing" />;
}

export function CompetitiveView() {
  const featureRows: FeatureRow[] = useMemo(
    () => COMPETITOR_FEATURES.map((f) => ({ id: f.name, name: f.name, exxat: f.exxat, examsoft: f.examsoft, blackboard: f.blackboard, d2l: f.d2l })),
    []
  );

  const parity = useMemo(
    () =>
      PLATFORMS.map((p) => ({
        key: p.label,
        label: p.label,
        value: Math.round((100 * COMPETITOR_FEATURES.reduce((n, f) => n + score(f[p.key]), 0)) / COMPETITOR_FEATURES.length),
        hint: p.key === 'exxat' ? 'us — weighted coverage %' : 'weighted coverage %',
        href: p.key === 'exxat' ? hrefInsights({ product: 'exam-management', tag: 'competitive' }) : undefined,
      })).sort((a, b) => b.value - a.value),
    []
  );

  const openTerritory = COMPETITOR_FEATURES.filter(
    (f) => score(f.exxat) > 0 && score(f.examsoft) === 0 && score(f.blackboard) === 0 && score(f.d2l) === 0
  );

  const cohereDate = parsePhaseDate(COHERE_LAUNCH.rendered);
  const daysToCohere = cohereDate ? Math.max(0, Math.round((cohereDate.getTime() - Date.now()) / 86400000)) : null;

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Competitive Parity"
        lede="Twelve tracked features across four platforms, and the three reasons programs actually stay on ExamSoft — displacement happens at the switching moment."
        meta={`${COMPETITOR_FEATURES.length} features × ${PLATFORMS.length} platforms · Cohere in ${daysToCohere ?? '?'} days (rendered ${COHERE_LAUNCH.rendered}, ${COHERE_LAUNCH.status}, owner ${COHERE_LAUNCH.owner})`}
      />

      <HStack gap={2} vAlign="center">
        <StatusDot variant="warning" label="date conflict" />
        <Text type="supporting" as="p" textWrap="pretty">
          {COHERE_LAUNCH.note}
        </Text>
      </HStack>

      <Fig
        title="Feature parity matrix"
        caption="Green = shipped, amber = partial, hollow = missing. Empty Exxat cells in rows where any competitor is green are the build queue; each feature name opens the exam-management evidence behind it."
      >
        <Table<FeatureRow>
          data={featureRows}
          idKey="id"
          density="compact"
          hasHover
          columns={[
            {
              key: 'name',
              header: 'Feature',
              width: proportional(2),
              renderCell: (r: FeatureRow) => <Link href={hrefInsights({ product: 'exam-management', q: r.name })}>{r.name}</Link>,
            },
            ...PLATFORMS.map((p) => ({
              key: p.key,
              header: p.label,
              width: pixel(110),
              renderCell: (r: FeatureRow) =>
                r[p.key] === true || r[p.key] === 'partial' ? (
                  <Link href={hrefInsights({ product: 'exam-management', q: r.name })} aria-label={`${r.name} on ${p.label}`}>
                    <StatusCell v={r[p.key] as CellValue} />
                  </Link>
                ) : (
                  <StatusCell v={false} />
                ),
            })),
          ]}
        />
      </Fig>

      <Grid columns={{ minWidth: 360, max: 2 }} gap={4}>
        <Fig
          title="Weighted parity score"
          caption="Coverage of the 12 tracked features (full = 1, partial = half). The Exxat number is the one to move before Cohere — report it in every Arun check-in."
        >
          <RankedList rows={parity} format={(r) => `${r.value}%`} />
        </Fig>

        <Fig
          title="Open territory"
          caption="Features no tracked platform ships. These lead the Cohere story, not the parity table."
        >
          <VStack gap={2}>
            {openTerritory.map((f) => (
              <HStack key={f.name} gap={2} vAlign="center" hAlign="between">
                <Link href={hrefInsights({ product: 'exam-management', q: f.name })}>{f.name}</Link>
                <Text type="supporting">{f.exxat === true ? 'shipped' : 'in design'}</Text>
              </HStack>
            ))}
          </VStack>
        </Fig>
      </Grid>

      <Card padding={4}>
        <VStack gap={3}>
          <VStack gap={0}>
            <Text type="label" color="secondary">
              The three retention anchors
            </Text>
            <Text type="supporting" as="p" textWrap="pretty">
              Programs stay on ExamSoft for exactly three reasons (School of Pharmacy session, Mar 20). Match or beat all three and there is, in Arun's words, no rational reason to stay. Readiness carries no percentage on purpose: nothing is measured yet, so status is stated, not scored.
            </Text>
          </VStack>
          {ANCHORS.map((a, i) => (
            <Collapsible
              key={a.title}
              trigger={<Text type="body" weight="semibold">{`${i + 1}. ${a.title} — ${a.state}`}</Text>}
              defaultIsOpen={false}
            >
              <VStack gap={2}>
                <Text type="body" as="p" textWrap="pretty">
                  {a.response}
                </Text>
                <Text type="supporting">{a.evidence}</Text>
                <Link href={hrefInsights({ product: 'exam-management', q: a.q })} isStandalone>
                  Evidence for this anchor →
                </Link>
              </VStack>
            </Collapsible>
          ))}
        </VStack>
      </Card>

      <Card padding={4}>
        <VStack gap={3}>
          <Text type="label" color="secondary">
            Competitor sets per product
          </Text>
          {PRODUCTS.map((p) => (
            <HStack key={p.id} gap={2} vAlign="center" wrap="wrap">
              <Link href={hrefProduct(p.id)}>
                <Text type="supporting">{p.shortName}</Text>
              </Link>
              {p.competitors.map((c) => (
                <Token key={c} label={c} href={hrefInsights({ product: p.id, q: c })} />
              ))}
            </HStack>
          ))}
        </VStack>
      </Card>
    </VStack>
  );
}
