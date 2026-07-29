// views/PortfolioView.tsx — Portfolio + Deliverables (v18 Astryx rebuild).
// Hero: staff-readiness ranked meters against the self-set 70 bar. Case-study
// pipeline rows link forward to the products they document (dead-end rule).
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { DIMENSIONS, ANCHORS, GAPS } from '../data/portfolio';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { hrefProduct } from '../lib/links';

const TARGET = 70;

const CASE_STUDY_PRODUCT: Record<string, string> = {
  P1: 'faas',
  P2: 'exam-management',
  P3: 'skills-checklist',
};

export function PortfolioView() {
  const rows = [...DIMENSIONS]
    .sort((a, b) => b.value - a.value)
    .map((d) => ({ key: d.label, label: d.label, value: d.value, hint: undefined, href: undefined }));

  return (
    <VStack gap={5} padding={6} maxWidth={1080}>
      <PageHeader
        title="Portfolio + Deliverables"
        lede="Staff-level positioning measured against JD benchmarks — the shortest bar is the writing assignment."
        meta={`${DIMENSIONS.length} positioning dimensions · ${ANCHORS.length} narrative anchors · ${GAPS.length} case studies in pipeline`}
      />

      <Fig
        title="Staff-readiness by dimension"
        caption={`Self-assessed against Staff Product Designer JDs; ${TARGET} is a self-set target, not an external benchmark. Red bars sit under the target — measurable outcomes is the shortest, so the FaaS case study with before/after metrics is the highest-priority deliverable.`}
      >
        <RankedList rows={rows} errorBelow={TARGET} format={(r) => `${r.value}/100`} />
      </Fig>

      <Grid columns={2} gap={4}>
        <Card padding={4}>
          <VStack gap={3}>
            <Text type="label" color="secondary">
              Narrative anchors — at least two per output
            </Text>
            <VStack gap={3}>
              {ANCHORS.map((a) => (
                <Text key={a.label} type="body" as="p" textWrap="pretty">
                  {a.text}
                </Text>
              ))}
            </VStack>
          </VStack>
        </Card>

        <Card padding={4}>
          <VStack gap={3}>
            <Text type="label" color="secondary">
              Case-study pipeline — ranked by positioning impact
            </Text>
            <VStack gap={4}>
              {GAPS.map((g) => (
                <VStack key={g.priority} gap={1}>
                  <HStack gap={2} vAlign="center">
                    <Badge
                      variant={g.priority === 'P1' ? 'error' : g.priority === 'P2' ? 'warning' : 'info'}
                      label={g.priority}
                    />
                    <Text type="body" weight="semibold">
                      {g.title}
                    </Text>
                  </HStack>
                  <Text type="supporting" as="p" textWrap="pretty">
                    {g.desc}
                  </Text>
                  {CASE_STUDY_PRODUCT[g.priority] && (
                    <Link href={hrefProduct(CASE_STUDY_PRODUCT[g.priority])} isStandalone>
                      Product evidence →
                    </Link>
                  )}
                </VStack>
              ))}
            </VStack>
          </VStack>
        </Card>
      </Grid>
    </VStack>
  );
}
