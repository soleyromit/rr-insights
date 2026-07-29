// views/OverviewView.tsx — Command Center (v18 Astryx rebuild).
// One question: what should be designed next, and why. KPI tiles whose numbers
// are queries, a products table where every row is a door, and the design-next
// queue whose rows carry the clicked insight's identity (no more signals dump).
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { VolumeChart } from '../components/charts/VolumeChart';
import { SevDot } from '../components/ui/sev';
import { ALL_INSIGHTS } from '../data/insights';
import { PRODUCTS, getProductsByUrgency } from '../data/products';
import { MILESTONES } from '../data/personas';
import { insightsWhere } from '../lib/selectors';
import { monthlyVolume } from '../lib/series';
import { scoreInsight, sumScores } from '../lib/score';
import { hrefInsight, hrefInsights, hrefProduct, hrefRoadmap, hrefSignals } from '../lib/links';
import type { ProductMeta } from '../types';

interface ProductRow extends Record<string, unknown> {
  id: string;
  product: ProductMeta;
}

const URGENCY_DOT: Record<string, 'error' | 'warning' | 'success'> = {
  fire: 'error',
  hot: 'error',
  warn: 'warning',
  watch: 'warning',
  ok: 'success',
};

export function OverviewView() {
  const navigate = useNavigate();
  const critical = useMemo(() => insightsWhere({ severity: 'critical' }), []);
  const volume = useMemo(() => monthlyVolume(ALL_INSIGHTS), []);
  const mass = useMemo(() => sumScores(ALL_INSIGHTS), []);
  const queue = critical.slice(0, 5);
  const products: ProductRow[] = getProductsByUrgency().map((p) => ({ id: p.id, product: p }));

  const nextDeadline = useMemo(() => {
    const parse = (d: string) => new Date(d).getTime();
    return MILESTONES.filter((m) => m.isHardDeadline && !Number.isNaN(parse(m.date)) && parse(m.date) >= Date.now()).sort(
      (a, b) => parse(a.date) - parse(b.date)
    )[0];
  }, []);
  const daysTo = nextDeadline ? Math.ceil((new Date(nextDeadline.date).getTime() - Date.now()) / 86400000) : null;

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Command Center"
        lede="What should be designed next, and why — every number below is a query you can open."
        meta={`${ALL_INSIGHTS.length} insights across ${PRODUCTS.length} products`}
      />

      <Grid columns={{ minWidth: 220, max: 4 }} gap={4}>
        <ClickableCard label="Open the insight index" onClick={() => navigate(hrefInsights({}))} padding={4}>
          <VStack gap={1}>
            <Text type="label" color="secondary">
              Corpus
            </Text>
            <Heading level={3} type="display-3">
              {ALL_INSIGHTS.length}
            </Heading>
            <Text type="supporting">insights · open the index →</Text>
          </VStack>
        </ClickableCard>
        <ClickableCard label="Open critical insights ranked by score" onClick={() => navigate(hrefInsights({ severity: 'critical', sort: 'score' }))} padding={4}>
          <VStack gap={1}>
            <HStack gap={2} vAlign="center">
              <StatusDot variant="error" label="critical" />
              <Text type="label" color="secondary">
                Critical open
              </Text>
            </HStack>
            <Heading level={3} type="display-3">
              {critical.length}
            </Heading>
            <Text type="supporting">score-ranked list →</Text>
          </VStack>
        </ClickableCard>
        <ClickableCard label="Open the roadmap" onClick={() => navigate(hrefRoadmap())} padding={4}>
          <VStack gap={1}>
            <Text type="label" color="secondary">
              Next hard deadline
            </Text>
            <Heading level={3} type="display-3">
              {daysTo !== null ? `${daysTo}d` : '—'}
            </Heading>
            <Text type="supporting" maxLines={1}>
              {nextDeadline ? `${nextDeadline.label} · ${nextDeadline.date}` : 'nothing dated ahead'}
            </Text>
          </VStack>
        </ClickableCard>
        <ClickableCard label="Open the signal board" onClick={() => navigate(hrefSignals())} padding={4}>
          <VStack gap={1}>
            <Text type="label" color="secondary">
              Opportunity mass
            </Text>
            <Heading level={3} type="display-3">
              {Math.round(mass)}
            </Heading>
            <Text type="supporting">summed scores · signal board →</Text>
          </VStack>
        </ClickableCard>
      </Grid>

      <Grid columns={{ minWidth: 420, max: 2 }} gap={4}>
        <Fig
          title="Products, ranked by deadline pressure"
          caption="Open a row for its product hub. Critical counts are queries — the biggest red number outranks the longest backlog."
        >
          <Table<ProductRow>
            data={products}
            idKey="id"
            density="compact"
            hasHover
            columns={[
              {
                key: 'urgency',
                header: '',
                width: pixel(32),
                renderCell: (r: ProductRow) => (
                  <StatusDot variant={URGENCY_DOT[r.product.urgencyLevel] ?? 'success'} label={String(r.product.urgencyLevel)} />
                ),
              },
              {
                key: 'name',
                header: 'Product',
                width: proportional(2),
                renderCell: (r: ProductRow) => (
                  <VStack gap={0}>
                    <Link href={hrefProduct(r.product.id)}>{r.product.name}</Link>
                    <Text type="supporting" maxLines={1}>
                      {r.product.status}
                      {r.product.nps !== undefined ? ` · NPS ${r.product.nps}` : ''}
                    </Text>
                  </VStack>
                ),
              },
              {
                key: 'insights',
                header: 'Evidence',
                width: pixel(130),
                renderCell: (r: ProductRow) => (
                  <Link href={hrefInsights({ product: r.product.id })}>
                    {r.product.insightCount} insights
                  </Link>
                ),
              },
              {
                key: 'critical',
                header: 'Critical',
                width: pixel(110),
                renderCell: (r: ProductRow) => (
                  <Link href={hrefInsights({ product: r.product.id, severity: 'critical' })}>
                    <Text type="body" color="inherit" hasTabularNumbers>
                      {r.product.criticalGaps}
                    </Text>
                  </Link>
                ),
              },
              {
                key: 'deadline',
                header: 'Deadline',
                width: pixel(90),
                align: 'end',
                renderCell: (r: ProductRow) => (
                  <Text type="body" hasTabularNumbers>
                    {r.product.daysToDeadline !== null ? `${r.product.daysToDeadline}d` : '—'}
                  </Text>
                ),
              },
            ]}
          />
        </Fig>

        <Fig
          title="Evidence volume"
          caption="Corpus growth by month; the red line is critical-only. A rising red line into a deadline is the escalation argument."
        >
          <VolumeChart data={volume} height={240} />
        </Fig>
      </Grid>

      <Card padding={4}>
        <VStack gap={3}>
          <HStack hAlign="between" vAlign="center">
            <VStack gap={0}>
              <Text type="label" color="secondary">
                Design next — critical findings ranked by opportunity score
              </Text>
              <Text type="supporting">score = severity × evidence × persona priority</Text>
            </VStack>
            <Link href={hrefInsights({ severity: 'critical', sort: 'score' })}>full queue →</Link>
          </HStack>
          <VStack gap={3}>
            {queue.map((i) => (
              <HStack key={i.id} gap={3} vAlign="center" hAlign="between">
                <HStack gap={2} vAlign="center">
                  <SevDot severity={i.severity} />
                  <Link href={hrefInsight(i.id, 'overview')}>
                    <Text type="body" maxLines={2} hasTruncateTooltip={false}>
                      {i.text}
                    </Text>
                  </Link>
                </HStack>
                <Text type="supporting" hasTabularNumbers textWrap="nowrap">
                  {scoreInsight(i).label}
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Card>
    </VStack>
  );
}
