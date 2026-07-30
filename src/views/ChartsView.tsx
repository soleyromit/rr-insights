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
import { HStack } from '@astryxdesign/core/HStack';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { SeverityStackChart } from '../components/charts/SeverityStackChart';
import { SmallMultiples } from '../components/charts/SmallMultiples';
import { ALL_INSIGHTS } from '../data/insights';
import { getProduct } from '../data/products';
import { getTheme } from '../data/themes';
import { PERSONAS } from '../data/personas';
import { dimensionCounts, monthlyVolume, severityMix, fillMonths, monthDomain } from '../lib/series';
import { hrefInsights } from '../lib/links';
import type { Insight } from '../types';
import type { InsightFilter } from '../lib/links';

type Dim = 'product' | 'theme' | 'persona' | 'severity' | 'tag';
type Viz = 'ranked' | 'severity' | 'volume';

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
  const viz = (params.get('viz') as Viz | null) ?? 'ranked';

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

  const rankedRows = counts.map((c) => ({
    key: c.key,
    label: labelFor(dim, c.key),
    value: c.count,
    hint: c.critical ? `${c.critical} critical` : undefined,
    href: hrefInsights(DIM_FILTER[dim](c.key)),
  }));

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
        lede="The corpus along any dimension — click any bar to open the insights that produce it."
        meta={`${ALL_INSIGHTS.length} insights · dimension: ${dim} · form: ${viz}`}
      />

      <HStack gap={3} vAlign="center" wrap="wrap">
        <SegmentedControl label="Dimension" value={dim} onChange={(v) => set('dim', v, 'product')} size="sm">
          <SegmentedControlItem value="product" label="Product" />
          <SegmentedControlItem value="theme" label="Theme" />
          <SegmentedControlItem value="persona" label="Persona" />
          <SegmentedControlItem value="severity" label="Severity" />
          <SegmentedControlItem value="tag" label="Tag" />
        </SegmentedControl>
        <SegmentedControl label="Visualize as" value={viz} onChange={(v) => set('viz', v, 'ranked')} size="sm">
          <SegmentedControlItem value="ranked" label="Ranked bars" />
          <SegmentedControlItem value="severity" label="Severity mix" />
          <SegmentedControlItem value="volume" label="Volume over time" />
        </SegmentedControl>
      </HStack>

      {viz === 'ranked' && (
        <Fig
          title={`Insights by ${dim}`}
          n={ALL_INSIGHTS.length}
          caption="Counts along the chosen dimension; the trailing hint is the critical share. Every row opens its query."
          note={tagNote}
          link={{ href: hrefInsights(), count: ALL_INSIGHTS.length, label: 'insights, full corpus query' }}
        >
          <RankedList rows={rankedRows} format={(r) => String(r.value)} />
        </Fig>
      )}

      {viz === 'severity' && (
        <Fig
          title={`Severity mix by ${dim}`}
          n={ALL_INSIGHTS.length}
          caption="Stacked severity per category — status colors are the taxonomy's, reserved for severity only."
          note={tagNote}
        >
          <SeverityStackChart data={sevData} height={300} />
        </Fig>
      )}

      {viz === 'volume' && (
        <Fig
          title={`Volume over time by ${dim}`}
          n={ALL_INSIGHTS.length}
          caption="Aligned small multiples for the top values of the chosen dimension — shared axes, zero-filled months, so shapes compare honestly. Each cell opens its query."
          note={tagNote}
        >
          <SmallMultiples groups={volumeGroups} />
        </Fig>
      )}
    </VStack>
  );
}
