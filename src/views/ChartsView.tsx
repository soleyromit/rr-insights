// views/ChartsView.tsx — charts-by-dimension (v19 redesign; Dovetail's
// "charts" pattern). One configurable view over the corpus: pick a dimension,
// pick a form, and every bar or cell is a click into the insight list that
// produces it — the chart is a query builder, not a picture. The volume form
// renders aligned small multiples per dimension value instead of a prose
// pointer elsewhere; the tag dimension excludes the no-signal 'new' tag and
// says so.
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { Grid } from '@astryxdesign/core/Grid';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { SeverityStackChart } from '../components/charts/SeverityStackChart';
import { SmallMultiples } from '../components/charts/SmallMultiples';
import { ALL_INSIGHTS } from '../data/insights';
import { getProduct } from '../data/products';
import { getTheme } from '../data/themes';
import { PERSONAS } from '../data/personas';
import { dimensionCounts, monthlyVolume, severityMix, fillMonths, monthDomain, tierMassByDimension } from '../lib/series';
import { scoreInsight } from '../lib/score';
import { TierBars } from '../components/charts/TierBars';
import { hrefInsights } from '../lib/links';
import type { Insight } from '../types';
import type { InsightFilter } from '../lib/links';

type Dim = 'product' | 'theme' | 'persona' | 'severity' | 'tag';

const DIM_ACCESSOR: Record<Dim, (i: Insight) => string[] | string | undefined> = {
  product: (i) => i.productIds,
  theme: (i) => i.themeId,
  persona: (i) => i.personaIds,
  severity: (i) => i.severity,
  tag: (i) => i.tags as string[],
};

const DIM_FILTER: Record<Dim, (key: string) => InsightFilter> = {
  product: (key) => ({ product: key }),
  theme: (key) => ({ theme: key }),
  persona: (key) => ({ persona: key }),
  severity: (key) => ({ severity: key as InsightFilter['severity'] }),
  tag: (key) => ({ tag: key }),
};

function labelFor(dim: Dim, key: string): string {
  if (dim === 'product') return getProduct(key)?.name ?? key;
  if (dim === 'theme') return getTheme(key)?.title ?? key;
  if (dim === 'persona') return PERSONAS.find((p) => p.id === key)?.name ?? key;
  return key;
}

export function ChartsView() {
  const [params, setParams] = useSearchParams();
  const dim = (params.get('dim') as Dim | null) ?? 'product';

  const set = (key: string, value: string, def: string) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (value === def) p.delete(key);
        else p.set(key, value);
        return p;
      },
      { replace: true }
    );
  };

  // 'new' rides on nearly the whole corpus — no signal along the tag dimension.
  const newTagShare = useMemo(
    () => Math.round((ALL_INSIGHTS.filter((i) => (i.tags as string[]).includes('new')).length / ALL_INSIGHTS.length) * 100),
    []
  );
  const tagNote = dim === 'tag' ? `'new' excluded — appears on ${newTagShare}% of the corpus.` : undefined;

  const counts = useMemo(() => {
    const all = dimensionCounts(ALL_INSIGHTS, DIM_ACCESSOR[dim]);
    return (dim === 'tag' ? all.filter((c) => c.key !== 'new') : all).slice(0, 12);
  }, [dim]);

  // Ranked by opportunity mass (summed score), tier-stacked — not raw counts.
  const massRows = useMemo(() => {
    const all = tierMassByDimension(ALL_INSIGHTS, DIM_ACCESSOR[dim], (i) => scoreInsight(i).tier);
    return (dim === 'tag' ? all.filter((c) => c.key !== 'new') : all).slice(0, 12).map((r) => ({
      ...r,
      label: labelFor(dim, r.key),
      href: hrefInsights(DIM_FILTER[dim](r.key)),
    }));
  }, [dim]);

  const sevData = useMemo(
    () =>
      counts.slice(0, 8).map((c) => {
        const members = ALL_INSIGHTS.filter((i) => {
          const raw = DIM_ACCESSOR[dim](i);
          return raw !== undefined && (Array.isArray(raw) ? raw.includes(c.key) : raw === c.key);
        });
        return { category: labelFor(dim, c.key), ...severityMix(members) };
      }),
    [counts, dim]
  );

  const volumeGroups = useMemo(() => {
    const domain = monthDomain(ALL_INSIGHTS);
    return counts.slice(0, 5).map((c) => {
      const members = ALL_INSIGHTS.filter((i) => {
        const raw = DIM_ACCESSOR[dim](i);
        return raw !== undefined && (Array.isArray(raw) ? raw.includes(c.key) : raw === c.key);
      });
      return {
        key: c.key,
        label: labelFor(dim, c.key),
        href: hrefInsights(DIM_FILTER[dim](c.key)),
        n: c.count,
        points: fillMonths(monthlyVolume(members), domain),
      };
    });
  }, [counts, dim]);

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Charts"
        lede="One dimension, three honest views: where the opportunity mass sits, what it's made of, and how it moved."
        meta={`${ALL_INSIGHTS.length} insights · dimension: ${dim}`}
      />

      <SegmentedControl label="Dimension" value={dim} onChange={(v) => set('dim', v, 'product')} size="sm">
        <SegmentedControlItem value="product" label="Product" />
        <SegmentedControlItem value="theme" label="Theme" />
        <SegmentedControlItem value="persona" label="Persona" />
        <SegmentedControlItem value="severity" label="Severity" />
        <SegmentedControlItem value="tag" label="Tag" />
      </SegmentedControl>

      <Fig
        title={`Opportunity mass by ${dim} — tier-stacked`}
        n={ALL_INSIGHTS.length}
        caption="Ranked by summed opportunity score, not row count — a value with many P2s can outrank one with a few P0s, and the stack shows exactly why. Segment colors are the P0–P3 tiers."
        note={tagNote}
        exportData={massRows.map((r) => ({
          [dim]: r.label,
          mass: Math.round(r.mass),
          insights: r.n,
          critical: r.critical,
          P0: Math.round(r.tiers.P0 ?? 0),
          P1: Math.round(r.tiers.P1 ?? 0),
          P2: Math.round(r.tiers.P2 ?? 0),
          P3: Math.round(r.tiers.P3 ?? 0),
        }))}
        exportName={`opportunity-mass-${dim}`}
        link={{ href: hrefInsights(), count: ALL_INSIGHTS.length, label: 'insights, full corpus query' }}
      >
        <TierBars rows={massRows} />
      </Fig>

      <Grid columns={{ minWidth: 420, max: 2 }} gap={4}>
        <Fig
          title={`Severity mix by ${dim}`}
          n={ALL_INSIGHTS.length}
          caption="Stacked severity per category — status colors are the taxonomy's, reserved for severity only."
          note={tagNote}
        >
          <SeverityStackChart data={sevData} height={300} />
        </Fig>

        <Fig
          title={`Volume over time by ${dim}`}
          n={ALL_INSIGHTS.length}
          caption="Aligned small multiples for the top values — shared axes, zero-filled months, so shapes compare honestly. Each cell opens its query."
          note={tagNote}
        >
          <SmallMultiples groups={volumeGroups} />
        </Fig>
      </Grid>
    </VStack>
  );
}
