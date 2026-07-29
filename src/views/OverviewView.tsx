// views/OverviewView.tsx — Command Center (v19 visualization-first redesign).
// Story: where evidence is landing this week, and what should be designed next.
// A cross-product freshness strip leads; every number below it is a query.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { VolumeChart } from '../components/charts/VolumeChart';
import { Sparkline } from '../components/charts/Sparkline';
import { TrendDelta } from '../components/charts/TrendDelta';
import { EvidenceList } from '../components/story/EvidenceRow';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { QueryLink } from '../components/story/QueryLink';
import { StalenessMeter } from '../components/story/StalenessMeter';
import { ALL_INSIGHTS } from '../data/insights';
import { PRODUCTS, getProductsByUrgency } from '../data/products';
import { MILESTONES } from '../data/personas';
import { insightsWhere, productFacts, corpusFacts, CORPUS_ANCHOR } from '../lib/selectors';
import { monthlyVolume, perProductMonthly } from '../lib/series';
import { sumScores } from '../lib/score';
import { hrefInsights, hrefProduct, hrefRoadmap, hrefSignals } from '../lib/links';
import { formatDay } from '../lib/format';
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

/** ISO day `days` before the corpus anchor — for "last 30d" query links. */
const isoDaysAgo = (days: number) =>
  new Date(new Date(CORPUS_ANCHOR).getTime() - days * 86400000).toISOString().slice(0, 10);

export function OverviewView() {
  const critical = useMemo(() => insightsWhere({ severity: 'critical' }), []);
  const volume = useMemo(() => monthlyVolume(ALL_INSIGHTS), []);
  const mass = useMemo(() => sumScores(ALL_INSIGHTS), []);
  const corpus = corpusFacts();
  const products: ProductRow[] = getProductsByUrgency().map((p) => ({ id: p.id, product: p }));

  // Freshness strip: hottest workstream first (most evidence in the last 30d).
  const freshness = useMemo(() => {
    const sparks = new Map(
      perProductMonthly(ALL_INSIGHTS, PRODUCTS.map((p) => p.id)).map((s) => [
        s.key,
        s.points.slice(-6).map((pt) => ({ label: pt.label, value: pt.total })),
      ])
    );
    return [...PRODUCTS]
      .map((p) => ({ product: p, facts: productFacts(p.id), spark: sparks.get(p.id) ?? [] }))
      .sort((a, b) => b.facts.last30d - a.facts.last30d || a.facts.staleDays - b.facts.staleDays);
  }, []);

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
        meta={`${corpus.n} insights · ${corpus.last7d} added this week`}
      />

      {/* ── Cross-product freshness strip: where evidence is landing right now ── */}
      <Grid columns={{ minWidth: 200, max: 5 }} gap={3}>
        {freshness.map(({ product, facts, spark }) => (
          <Card key={product.id} padding={3}>
            <VStack gap={2}>
              <Link href={hrefProduct(product.id)}>
                <Text type="label" color="inherit">
                  {product.shortName}
                </Text>
              </Link>
              {spark.length > 1 && <Sparkline data={spark} height={40} />}
              <TrendDelta current={facts.last30d} prior={facts.prior30d} windowLabel="vs prior 30d" />
              <StalenessMeter newestDate={facts.newestDate} staleDays={facts.staleDays} />
              <QueryLink
                href={hrefInsights({ product: product.id, since: isoDaysAgo(30), sort: 'newest' })}
                count={facts.last30d}
                label="in 30d, newest first"
              />
            </VStack>
          </Card>
        ))}
      </Grid>

      {/* ── KPI row: computed counts, same doors as before ── */}
      <StatTileRow>
        <StatTile value={corpus.n} label="insights · open the index" href={hrefInsights({})} />
        <StatTile
          value={corpus.critical}
          label="critical open · score-ranked"
          href={hrefInsights({ severity: 'critical', sort: 'score' })}
        />
        <StatTile
          value={daysTo !== null ? `${daysTo}d` : '—'}
          label="to next hard deadline · roadmap"
          href={hrefRoadmap()}
          hint={nextDeadline ? `${nextDeadline.label} · ${nextDeadline.date}` : 'nothing dated ahead'}
        />
        <StatTile value={Math.round(mass)} label="opportunity mass · signal board" href={hrefSignals()} />
      </StatTileRow>

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
                width: pixel(150),
                renderCell: (r: ProductRow) => {
                  const f = productFacts(r.product.id);
                  return (
                    <VStack gap={0}>
                      <Link href={hrefInsights({ product: r.product.id })}>{f.n} insights</Link>
                      <Text type="supporting" maxLines={1}>
                        {f.newestDate ? `newest ${formatDay(f.newestDate)}` : 'none yet'}
                      </Text>
                    </VStack>
                  );
                },
              },
              {
                key: 'last30d',
                header: 'Last 30d',
                width: pixel(120),
                renderCell: (r: ProductRow) => {
                  const f = productFacts(r.product.id);
                  return <TrendDelta current={f.last30d} prior={f.prior30d} windowLabel="vs prior" />;
                },
              },
              {
                key: 'critical',
                header: 'Critical',
                width: pixel(90),
                renderCell: (r: ProductRow) => (
                  <Link href={hrefInsights({ product: r.product.id, severity: 'critical' })}>
                    <Text type="body" color="inherit" hasTabularNumbers>
                      {productFacts(r.product.id).critical}
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
          n={corpus.n}
          note="May–Sep '25 tail is 3 insights total — plotted for honesty, not comparable to 2026 months."
          link={{ href: hrefInsights({ sort: 'newest' }), count: corpus.n, label: 'insights, newest first' }}
        >
          <VolumeChart data={volume} height={240} />
        </Fig>
      </Grid>

      {/* ── Design-next queue: edge-to-edge evidence rows, not cards ── */}
      <VStack gap={2}>
        <VStack gap={0}>
          <Text type="label" color="secondary">
            Design next — critical findings ranked by opportunity score
          </Text>
          <Text type="supporting">score = severity × evidence × persona priority</Text>
        </VStack>
        <EvidenceList insights={critical} limit={5} order="score" from="overview" />
        <QueryLink
          href={hrefInsights({ severity: 'critical', sort: 'score' })}
          count={corpus.critical}
          label="critical, score-ranked"
        />
      </VStack>
    </VStack>
  );
}
