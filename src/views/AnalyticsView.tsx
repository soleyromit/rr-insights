// views/AnalyticsView.tsx — Intelligence Analytics (v19.1). Reinstates the
// archived v16 analytics page with every metric recomputed live from the
// corpus, and upgrades each one to the v19 chart kit: the research operation
// itself, measured. Every mark opens its query.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Chart, ChartAxis, ChartGrid, area, useChartColors } from '@astryxdesign/charts';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { SeverityStackChart } from '../components/charts/SeverityStackChart';
import { DivergingBarChart } from '../components/charts/DivergingBarChart';
import { ScatterChart } from '../components/charts/ScatterChart';
import { SmallMultiples } from '../components/charts/SmallMultiples';
import { HeatGrid } from '../components/charts/HeatGrid';
import { RankedList } from '../components/charts/RankedList';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { ALL_INSIGHTS } from '../data/insights';
import { PRODUCTS, getProduct } from '../data/products';
import { PERSONAS } from '../data/personas';
import { corpusFacts, insightsWhere, CORPUS_ANCHOR } from '../lib/selectors';
import {
  monthlyVolume,
  severityByMonth,
  tagTrends,
  personaProductMatrix,
  perProductMonthly,
  evidenceDebt,
} from '../lib/series';
import { scoreOf } from '../lib/score';
import { hrefInsights, hrefPersona } from '../lib/links';
import type { SeverityLevel } from '../types';

const TAG_SPLIT_MONTH = '2026-04'; // Mar '26 spike vs everything after

export function AnalyticsView() {
  const colors = useChartColors();
  const corpus = corpusFacts();
  const sources = useMemo(() => new Set(ALL_INSIGHTS.map((i) => i.source)).size, []);

  // Cumulative corpus growth.
  const growth = useMemo(() => {
    let acc = 0;
    return monthlyVolume(ALL_INSIGHTS).map((m) => ({ label: m.label, cumulative: (acc += m.total) }));
  }, []);

  const sevMonths = useMemo(
    () =>
      severityByMonth(ALL_INSIGHTS).map((m) => ({
        category: m.label,
        critical: m.critical,
        high: m.high,
        medium: m.medium,
        low: m.low,
      })),
    []
  );

  // Tag movers — 'new' excluded (92% of corpus, no signal).
  const movers = useMemo(
    () =>
      tagTrends(ALL_INSIGHTS, { splitMonth: TAG_SPLIT_MONTH })
        .slice(0, 8)
        .map((t) => ({ label: t.tag, value: t.delta })),
    []
  );

  const matrix = useMemo(
    () =>
      personaProductMatrix(
        ALL_INSIGHTS,
        PERSONAS.map((p) => p.id),
        PRODUCTS.map((p) => p.id)
      ),
    []
  );

  const multiples = useMemo(
    () =>
      perProductMonthly(ALL_INSIGHTS, PRODUCTS.map((p) => p.id)).map((g) => ({
        key: g.key,
        label: getProduct(g.key)?.shortName ?? g.key,
        href: hrefInsights({ product: g.key }),
        n: insightsWhere({ product: g.key }).length,
        points: g.points,
      })),
    []
  );

  // Backlog aging: open criticals+highs, age (days) vs opportunity score.
  const aging = useMemo(() => {
    const anchor = new Date(CORPUS_ANCHOR).getTime();
    return insightsWhere({})
      .filter((i) => i.severity === 'critical' || i.severity === 'high')
      .map((i) => ({
        x: Math.round((anchor - new Date(i.createdAt).getTime()) / 86400000),
        y: scoreOf(i),
        label: i.text.slice(0, 90),
        severity: i.severity as SeverityLevel,
      }));
  }, []);
  const oldHeavy = useMemo(() => aging.filter((d) => d.x > 90 && d.y >= 24).length, [aging]);

  const debtRows = useMemo(
    () =>
      PRODUCTS.map((p) => {
        const debt = evidenceDebt(insightsWhere({ product: p.id }));
        return {
          key: p.id,
          label: p.shortName,
          value: Math.round(debt.soWhatShare * 100),
          hint: `${Math.round(debt.pullQuoteShare * 100)}% direct-quoted · n=${debt.n}`,
          href: hrefInsights({ product: p.id }),
        };
      }).sort((a, b) => b.value - a.value),
    []
  );

  const [blue] = colors.categorical(1);

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Intelligence Analytics"
        lede="The research operation itself, measured — where evidence accumulates, which themes are moving, who is covered, and whether the critical backlog is aging."
        meta={`recomputed live from the corpus · anchor ${CORPUS_ANCHOR}`}
      />

      <StatTileRow>
        <StatTile value={corpus.n} label="insights" href={hrefInsights({})} />
        <StatTile
          value={corpus.critical}
          label="critical open"
          href={hrefInsights({ severity: 'critical' })}
        />
        <StatTile value={sources} label="distinct sources" />
        <StatTile
          value={corpus.last7d}
          label="added in last 7d"
          href={hrefInsights({ sort: 'newest' })}
          delta={{ current: corpus.last30d, prior: corpus.prior30d, windowLabel: 'vs prior 30d' }}
        />
      </StatTileRow>

      <Grid columns={{ minWidth: 420, max: 2 }} gap={4}>
        <Fig
          title="Corpus growth, cumulative"
          n={corpus.n}
          caption="Running total of captured insights by month. Plateaus are research-quiet periods, not health."
        >
          <Chart
            data={growth as unknown as Record<string, unknown>[]}
            xKey="label"
            height={220}
            yDomain={[0, Math.ceil(corpus.n * 1.05)]}
            series={[area('cumulative', { color: blue, gradient: true, label: 'Cumulative insights' })]}
            grid={<ChartGrid horizontal tickCount={4} />}
            axes={
              <>
                <ChartAxis position="bottom" maxTicks={8} />
                <ChartAxis position="left" tickCount={4} />
              </>
            }
            tooltip
          />
        </Fig>

        <Fig
          title="Severity mix by month"
          n={corpus.n}
          caption="What each month's evidence was made of. The March 2026 spike carried the critical mass; recent months skew medium — synthesis, not fires."
        >
          <SeverityStackChart data={sevMonths} height={220} />
        </Fig>
      </Grid>

      <Grid columns={{ minWidth: 420, max: 2 }} gap={4}>
        <Fig
          title="Theme movers — tag volume after the March spike"
          n={corpus.n}
          note="'new' excluded (on 92% of the corpus — no signal). Split at Apr 2026."
          caption="Right of zero: tags still accumulating evidence. Left: themes that peaked in the discovery burst and have gone quiet."
        >
          <DivergingBarChart
            data={movers}
            height={240}
            poles={{ positive: 'growing since Apr', negative: 'faded after Mar spike' }}
          />
        </Fig>

        <Fig
          title="Backlog aging — open critical + high findings"
          n={aging.length}
          caption={`x = days since captured, y = opportunity score, color = severity. Top-right is the danger zone: high-scoring findings going stale — ${oldHeavy} are older than 90 days with score ≥ 24.`}
          link={{
            href: hrefInsights({ severity: 'critical', sort: 'score' }),
            count: corpus.critical,
            label: 'critical findings, score-ranked',
          }}
        >
          <ScatterChart data={aging} height={240} xFormat={(v) => `${v}d`} />
        </Fig>
      </Grid>

      <Fig
        title="Persona coverage × product — computed from tags"
        n={corpus.n}
        caption="Every cell opens its query. Empty cells are coverage holes, not absence of friction — scce × exam is the loudest one."
      >
        <HeatGrid
          rows={matrix.personas.map((p) => PERSONAS.find((x) => x.id === p)?.name ?? p)}
          cols={matrix.products.map((p) => getProduct(p)?.shortName ?? p)}
          cell={(r, c) => ({
            value: matrix.counts[r][c],
            href: hrefInsights({ persona: matrix.personas[r], product: matrix.products[c] }),
          })}
          rowHref={(r) => hrefPersona(matrix.personas[r])}
          emptyHint="no evidence — coverage gap"
          legend={{ low: 'thin evidence', high: 'heavy evidence' }}
        />
      </Fig>

      <Fig
        title="Evidence volume by product — aligned small multiples"
        n={corpus.n}
        caption="Shared axes, zero-filled months, so shapes compare honestly. Course Eval is the only curve still climbing."
      >
        <SmallMultiples groups={multiples} height={72} />
      </Fig>

      <Fig
        title="Evidence quality — 'so what' coverage per product"
        n={corpus.n}
        caption="Share of insights carrying an explicit design implication; the hint shows the direct-quote share. Low bars are synthesis debt — findings not yet turned into direction."
      >
        <RankedList rows={debtRows} format={(r) => `${r.value}%`} />
      </Fig>
    </VStack>
  );
}
