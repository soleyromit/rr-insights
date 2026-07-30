// views/AnalyticsView.tsx — Intelligence Analytics (v19.1). Reinstates the
// archived v16 analytics page with every metric recomputed live from the
// corpus, and upgrades each one to the v19 chart kit: the research operation
// itself, measured. Every mark opens its query.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Chart, ChartAxis, ChartGrid, area, line, useChartColors } from '@astryxdesign/charts';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { SeverityStackChart } from '../components/charts/SeverityStackChart';
import { QuadrantChart } from '../components/charts/QuadrantChart';
import { ThemeTrendRows } from '../components/charts/ThemeTrendRows';
import { FlowChart } from '../components/charts/FlowChart';
import { SmallMultiples } from '../components/charts/SmallMultiples';
import { HeatGrid } from '../components/charts/HeatGrid';
import { RankedList } from '../components/charts/RankedList';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { ALL_INSIGHTS } from '../data/insights';
import { PRODUCTS, getProduct } from '../data/products';
import { PERSONAS } from '../data/personas';
import { THEMES, getTheme } from '../data/themes';
import { SCORE_TIERS } from '../data/taxonomy';
import { corpusFacts, insightsWhere, CORPUS_ANCHOR } from '../lib/selectors';
import {
  monthlyVolume,
  severityByMonth,
  themeTrendRows,
  valenceByMonth,
  evidenceFlow,
  personaProductMatrix,
  perProductMonthly,
  evidenceDebt,
  termWatch,
  evidenceDebtByTheme,
} from '../lib/series';
import { evidenceClass } from '../lib/selectors';
import { scoreOf, scoreInsight } from '../lib/score';
import { hrefInsights, hrefPersona } from '../lib/links';
import type { SeverityLevel } from '../types';

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

  // Theme trends — longitudinal per-theme momentum (the Channels-style view).
  const themeRows = useMemo(
    () => themeTrendRows(ALL_INSIGHTS, THEMES.map((t) => t.id), CORPUS_ANCHOR),
    []
  );

  // Valence: pain (gap) vs opportunity share per month, tag-derived.
  const valence = useMemo(() => valenceByMonth(ALL_INSIGHTS), []);

  // Term watch — curated watch terms tied to live product questions.
  const WATCH_TERMS = [
    { key: 'offline', label: 'offline (exam download)', pattern: 'offline', q: 'offline' },
    { key: 'accommodation', label: 'accommodations', pattern: 'accommodations?', q: 'accommodation' },
    { key: 'template', label: 'templates', pattern: 'templates?', q: 'template' },
    { key: 'self-service', label: 'self-service', pattern: 'self[- ]service', q: 'self-service' },
    { key: 'preview', label: 'preview / simulator', pattern: 'preview|simulator', q: 'preview' },
    { key: 'versioning', label: 'versioning', pattern: 'versioning|version chain|versions?', q: 'versioning' },
    { key: 'anonymity', label: 'anonymity', pattern: 'anonym\\w*', q: 'anonymity' },
    { key: 'accreditation', label: 'accreditation', pattern: 'accreditat\\w*|arc-pa|capte|ccne', q: 'accreditation' },
  ];
  const watch = useMemo(
    () =>
      termWatch(ALL_INSIGHTS, WATCH_TERMS, CORPUS_ANCHOR).map((r) => {
        const def = WATCH_TERMS.find((t) => t.key === r.key)!;
        return { ...r, label: def.label, href: hrefInsights({ q: def.q }) };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Evidence debt: direct-quote share per theme (weakest-evidenced first).
  const debtByTheme = useMemo(
    () =>
      evidenceDebtByTheme(ALL_INSIGHTS, THEMES.map((t) => t.id), (i) => evidenceClass(i) === 'DIRECT QUOTE').map(
        (r) => ({
          key: r.key,
          label: getTheme(r.key)?.title ?? r.key,
          value: r.share,
          hint: `${r.quoted}/${r.n} direct-quoted`,
          href: hrefInsights({ theme: r.key }),
        })
      ),
    []
  );

  // Evidence flow: product → theme → tier.
  const flow = useMemo(() => {
    const { productTheme, themeTier } = evidenceFlow(ALL_INSIGHTS, (i) => scoreInsight(i).tier);
    const links = [
      ...[...productTheme.entries()].map(([k, value]) => {
        const [from, to] = k.split('→');
        return { from: `p:${from}`, to: `t:${to}`, value };
      }),
      ...[...themeTier.entries()].map(([k, value]) => {
        const [from, to] = k.split('→');
        return { from: `t:${from}`, to: `r:${to}`, value };
      }),
    ];
    const columns = [
      PRODUCTS.map((p) => ({ id: `p:${p.id}`, label: p.shortName, color: p.accentColor })),
      THEMES.map((t) => ({ id: `t:${t.id}`, label: t.title, color: t.color })),
      SCORE_TIERS.map((t) => ({ id: `r:${t.tier}`, label: t.tier, color: t.color })),
    ];
    return { columns, links };
  }, []);

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

      <Fig
        title="Theme trends — 30d momentum per theme"
        n={corpus.n}
        caption="Aligned sparklines on the shared month domain; the delta compares the last 30 days to the 30 before. Rising themes are where research attention is flowing right now."
        exportData={themeRows.map((r) => ({
          theme: getTheme(r.key)?.title ?? r.key,
          insights: r.n,
          last30d: r.current,
          prior30d: r.prior,
          delta: r.current - r.prior,
        }))}
        exportName="theme-trends"
        detail={<SeverityStackChart data={sevMonths} height={200} />}
        detailLabel="Severity backdrop"
      >
        <ThemeTrendRows rows={themeRows} />
      </Fig>

      <Grid columns={{ minWidth: 420, max: 2 }} gap={4}>
        <Fig
          title="Priority quadrant — open critical + high findings"
          n={aging.length}
          caption={`x = days since captured, y = opportunity score, color = severity. Reference lines split the plane at 90 days and the P0 floor (24): top-right is the danger quadrant — ${oldHeavy} high-scoring findings are aging past 90 days.`}
          exportData={aging.map((d) => ({ ageDays: d.x, score: d.y, severity: d.severity, insight: d.label }))}
          exportName="priority-quadrant"
          link={{
            href: hrefInsights({ severity: 'critical', sort: 'score' }),
            count: corpus.critical,
            label: 'critical findings, score-ranked',
          }}
        >
          <QuadrantChart data={aging} xSplit={90} ySplit={24} height={260} />
        </Fig>

        <Fig
          title="Evidence valence — pain vs opportunity share by month"
          n={corpus.n}
          note="Tag-derived (gap = pain, opportunity = opportunity); months with fewer than 3 insights excluded. A synced sentiment field can replace the accessor later."
          caption="When the pain line runs above the opportunity line, the month's research surfaced more broken workflow than open headroom."
          exportData={valence.map((v) => ({ month: v.month, painPct: v.pain, opportunityPct: v.opportunity }))}
          exportName="evidence-valence"
        >
          <Chart
            data={valence as unknown as Record<string, unknown>[]}
            xKey="label"
            height={260}
            yDomain={[0, 100]}
            series={[
              line('pain', { color: colors.semantic.negative, strokeWidth: 2, label: 'Pain (gap-tagged) %' }),
              line('opportunity', { color: blue, strokeWidth: 2, label: 'Opportunity-tagged %' }),
            ]}
            grid={<ChartGrid horizontal tickCount={4} />}
            axes={
              <>
                <ChartAxis position="bottom" maxTicks={8} />
                <ChartAxis position="left" tickCount={4} tickFormat={(v: unknown) => `${v}%`} />
              </>
            }
            legend
            tooltip
          />
        </Fig>
      </Grid>

      <Grid columns={{ minWidth: 420, max: 2 }} gap={4}>
        <Fig
          title="Term watch — mention trends for live product questions"
          n={corpus.n}
          caption="Curated watch terms (Channels-lite): monthly mention volume across text, quotes, and so-whats, with 30d momentum. A term heating up means that question is being re-litigated in sessions right now."
          exportData={watch.map((w) => ({ term: w.label, mentions: w.n, last30d: w.current, prior30d: w.prior }))}
          exportName="term-watch"
        >
          <ThemeTrendRows rows={watch} />
        </Fig>

        <Fig
          title="Evidence debt — direct-quote share by theme"
          n={corpus.n}
          caption="Weakest-evidenced themes first: a low share means the theme's claims rest on synthesis rather than verbatim voices. The evidence-span backfill (next syncs) should raise these floors."
          exportData={debtByTheme.map((d) => ({ theme: d.label, quotedSharePct: d.value, detail: d.hint }))}
          exportName="evidence-debt-by-theme"
        >
          <RankedList rows={debtByTheme} format={(r) => `${r.value}%`} errorBelow={10} />
        </Fig>
      </Grid>

      <Fig
        title="Evidence flow — product → theme → priority tier"
        n={corpus.n}
        caption="Ribbon width is insight count (multi-product insights count once per product). Read left to right: which products feed which themes, and how each theme's evidence distributes across the P0–P3 action tiers."
        exportData={flow.links.map((l) => ({ from: l.from.slice(2), to: l.to.slice(2), insights: l.value }))}
        exportName="evidence-flow"
      >
        <FlowChart columns={flow.columns} links={flow.links} height={440} />
      </Fig>

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
