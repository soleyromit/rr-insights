// views/InsightIndexView.tsx — the queryable corpus (v18 Astryx rebuild).
// Real search over 420 insights, filters synced to the URL (every chip is a
// shareable query), live volume histogram, and rows that open the canonical
// insight document.
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { TextInput } from '@astryxdesign/core/TextInput';
import { Token } from '@astryxdesign/core/Token';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Pagination } from '@astryxdesign/core/Pagination';
import { Link } from '@astryxdesign/core/Link';
import { DateRangeInput } from '@astryxdesign/core/DateRangeInput';
import type { DateRange } from '@astryxdesign/core/DateRangeInput';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { VolumeChart } from '../components/charts/VolumeChart';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { SevDot } from '../components/ui/sev';
import { insightsWhere, evidenceClass } from '../lib/selectors';
import { monthlyVolume } from '../lib/series';
import { scoreOf, scoreInsight } from '../lib/score';
import { ScoreTier } from '../components/ui/ScoreTier';
import { formatDay } from '../lib/format';
import { PRODUCTS, getProduct } from '../data/products';
import { PERSONAS } from '../data/personas';
import { THEMES } from '../data/themes';
import { ALL_INSIGHTS } from '../data/insights';
import { sumScores } from '../lib/score';
import { hrefInsights } from '../lib/links';
import { hrefInsight, parseInsightFilter } from '../lib/links';
import type { Insight } from '../types';

const PAGE_SIZE = 25;
const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low'] as const;

interface Row extends Record<string, unknown> {
  id: string;
  insight: Insight;
  score: number;
}

export function InsightIndexView() {
  const [params, setParams] = useSearchParams();

  const filter = parseInsightFilter(params);
  const q = filter.q ?? '';
  const { product, persona, severity, signal, tag, theme, since, until } = filter;
  const sort = filter.sort ?? 'score';
  const page = Math.max(1, Number(params.get('page') ?? 1));
  const view = params.get('view') === 'themes' ? 'themes' : 'flat';

  const set = (key: string, value?: string) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (value) p.set(key, value);
        else p.delete(key);
        if (key !== 'page') p.delete('page');
        return p;
      },
      { replace: true }
    );
  };

  /** Set/clear both date bounds in one URL update (Token remove, DateRangeInput). */
  const setDates = (nextSince?: string, nextUntil?: string) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (nextSince) p.set('since', nextSince);
        else p.delete('since');
        if (nextUntil) p.set('until', nextUntil);
        else p.delete('until');
        p.delete('page');
        return p;
      },
      { replace: true }
    );
  };

  const filtered = useMemo(
    () => insightsWhere({ q: q || undefined, product, persona, severity, signal, tag, since, until, sort }),
    [q, product, persona, severity, signal, tag, since, until, sort]
  );
  const volume = useMemo(() => monthlyVolume(filtered), [filtered]);

  // Query-context facts for whatever the current filter matches.
  const queryFacts = useMemo(() => {
    const n = filtered.length;
    const critical = filtered.filter((i) => i.severity === 'critical').length;
    const quotes = filtered.filter((i) => evidenceClass(i) === 'DIRECT QUOTE').length;
    const newest = filtered.reduce<string | undefined>(
      (m, i) => (m === undefined || i.createdAt > m ? i.createdAt : m),
      undefined
    );
    return { n, critical, quotes, synthesis: n - quotes, newest };
  }, [filtered]);

  const dateTokenLabel =
    since && until
      ? `${formatDay(since)} – ${formatDay(until)}`
      : since
        ? `since ${formatDay(since)}`
        : until
          ? `until ${formatDay(until)}`
          : undefined;
  const pageRows: Row[] = filtered
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    .map((i) => ({ id: i.id, insight: i, score: scoreOf(i) }));

  // Grouped view: same filtered set, sectioned by theme, ordered by opportunity mass.
  const themeGroups = useMemo(() => {
    const by = new Map<string, Insight[]>();
    for (const i of filtered) {
      const list = by.get(i.themeId) ?? [];
      list.push(i);
      by.set(i.themeId, list);
    }
    return THEMES.map((t) => ({ theme: t, insights: by.get(t.id) ?? [] }))
      .filter((g) => g.insights.length > 0)
      .sort((a, b) => sumScores(b.insights) - sumScores(a.insights));
  }, [filtered]);

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Insight Index"
        lede="The full corpus, queryable — every filter is a URL you can share."
        meta={`${filtered.length} of ${ALL_INSIGHTS.length} insights match · sorted by ${sort === 'score' ? 'opportunity score' : 'recency'}`}
      />

      <VStack gap={3}>
        <HStack gap={3} vAlign="center" wrap="wrap">
          <TextInput
            label="Search insights"
            isLabelHidden
            value={q}
            onChange={(v) => set('q', v || undefined)}
            placeholder="Search text, quotes, sources…"
            hasClear
          />
          <SegmentedControl
            label="Severity"
            value={severity ?? 'all'}
            onChange={(v) => set('severity', v === 'all' ? undefined : v)}
            size="sm"
          >
            {SEVERITIES.map((s) => (
              <SegmentedControlItem key={s} value={s} label={s} />
            ))}
          </SegmentedControl>
          <SegmentedControl label="Sort" value={sort} onChange={(v) => set('sort', v === 'score' ? undefined : v)} size="sm">
            <SegmentedControlItem value="score" label="by score" />
            <SegmentedControlItem value="newest" label="newest" />
          </SegmentedControl>
          <SegmentedControl label="View" value={view} onChange={(v) => set('view', v === 'flat' ? undefined : v)} size="sm">
            <SegmentedControlItem value="flat" label="flat" />
            <SegmentedControlItem value="themes" label="by theme" />
          </SegmentedControl>
          <DateRangeInput
            label="Captured between"
            isLabelHidden
            size="sm"
            placeholder="Any date"
            value={since && until ? ({ start: since, end: until } as DateRange) : null}
            onChange={(range) => setDates(range?.start, range?.end)}
          />
        </HStack>
        <HStack gap={1.5} wrap="wrap" vAlign="center">
          {PRODUCTS.map((p) => (
            <Token
              key={p.id}
              label={p.shortName}
              color={product === p.id ? 'blue' : 'default'}
              onClick={() => set('product', product === p.id ? undefined : p.id)}
            />
          ))}
          {PERSONAS.map((p) => (
            <Token
              key={p.id}
              label={p.name}
              color={persona === p.id ? 'purple' : 'default'}
              onClick={() => set('persona', persona === p.id ? undefined : p.id)}
            />
          ))}
          {THEMES.map((t) => (
            <Token
              key={t.id}
              label={t.title}
              color={theme === t.id ? 'teal' : 'default'}
              onClick={() => set('theme', theme === t.id ? undefined : t.id)}
            />
          ))}
          {signal && <Token label={`signal: ${signal}`} color="teal" onRemove={() => set('signal', undefined)} />}
          {tag && <Token label={`tag: ${tag}`} color="orange" onRemove={() => set('tag', undefined)} />}
          {dateTokenLabel && <Token label={dateTokenLabel} color="green" onRemove={() => setDates(undefined, undefined)} />}
        </HStack>
      </VStack>

      <StatTileRow>
        <StatTile value={queryFacts.n} label="matching insights" />
        <StatTile
          value={queryFacts.n ? `${Math.round((queryFacts.critical / queryFacts.n) * 100)}%` : '—'}
          label={`critical share (${queryFacts.critical})`}
        />
        <StatTile value={queryFacts.newest ? formatDay(queryFacts.newest) : '—'} label="newest match" />
        <StatTile value={`${queryFacts.quotes} / ${queryFacts.synthesis}`} label="direct quote / synthesis" />
      </StatTileRow>

      <Fig
        title="Evidence volume for this query"
        n={filtered.length}
        note={
          filtered.length === ALL_INSIGHTS.length
            ? undefined
            : `Histogram re-computes from the ${filtered.length} insights the current filter matches.`
        }
      >
        <VolumeChart data={volume} height={140} />
      </Fig>

      {view === 'themes' && (
        <VStack gap={6}>
          {themeGroups.map((g) => (
            <VStack key={g.theme.id} gap={2}>
              <HStack hAlign="between" vAlign="center" wrap="wrap" gap={2}>
                <HStack gap={2} vAlign="center">
                  <Text type="large" weight="semibold">{g.theme.title}</Text>
                  <Text type="supporting">
                    {g.insights.length} insights · {g.insights.filter((i) => i.severity === 'critical').length} critical
                  </Text>
                </HStack>
                <Link href={hrefInsights({ ...filter, theme: g.theme.id })}>view all {g.insights.length}</Link>
              </HStack>
              <Text type="supporting">{g.theme.description}</Text>
              <HStack gap={1.5} wrap="wrap" vAlign="center">
                {PRODUCTS.filter((p) => g.insights.some((i) => i.productIds.includes(p.id))).map((p) => (
                  <Token
                    key={p.id}
                    size="sm"
                    label={`${p.shortName} · ${g.insights.filter((i) => i.productIds.includes(p.id)).length}`}
                    color={product === p.id ? 'blue' : 'default'}
                    onClick={() => set('product', product === p.id ? undefined : p.id)}
                  />
                ))}
                {PERSONAS.filter((pe) => g.insights.some((i) => (i.personaIds ?? []).includes(pe.id))).map((pe) => (
                  <Token
                    key={pe.id}
                    size="sm"
                    label={pe.name}
                    color={persona === pe.id ? 'purple' : 'default'}
                    onClick={() => set('persona', persona === pe.id ? undefined : pe.id)}
                  />
                ))}
              </HStack>
              <VStack gap={1.5}>
                {g.insights.slice(0, 5).map((i) => (
                  <HStack key={i.id} gap={2} vAlign="center">
                    <SevDot severity={i.severity} />
                    <Link href={hrefInsight(i.id)}>
                      <Text type="body" maxLines={1} hasTruncateTooltip={false}>
                        {i.text}
                      </Text>
                    </Link>
                    <ScoreTier breakdown={scoreInsight(i)} showFormula={false} />
                  </HStack>
                ))}
              </VStack>
            </VStack>
          ))}
        </VStack>
      )}

      {view === 'flat' && (
      <Table<Row>
        data={pageRows}
        idKey="id"
        density="balanced"
        hasHover
        rowIndexStart={(page - 1) * PAGE_SIZE + 1}
        rowCount={filtered.length}
        columns={[
          { key: 'sev', header: '', width: pixel(36), renderCell: (r: Row) => <SevDot severity={r.insight.severity} /> },
          {
            key: 'text',
            header: 'Insight',
            width: proportional(3),
            renderCell: (r: Row) => (
              <Link href={hrefInsight(r.insight.id)}>
                <Text type="body" maxLines={2} hasTruncateTooltip={false}>
                  {r.insight.text}
                </Text>
              </Link>
            ),
          },
          {
            key: 'products',
            header: 'Products',
            width: pixel(150),
            renderCell: (r: Row) => (
              <Text type="supporting">{r.insight.productIds.map((p) => getProduct(p)?.shortName ?? p).join(' · ')}</Text>
            ),
          },
          {
            key: 'evidence',
            header: 'Evidence',
            width: pixel(120),
            renderCell: (r: Row) => <Text type="supporting">{evidenceClass(r.insight)}</Text>,
          },
          {
            key: 'score',
            header: 'Priority',
            width: pixel(140),
            renderCell: (r: Row) => <ScoreTier breakdown={scoreInsight(r.insight)} />,
          },
          { key: 'date', header: 'Captured', width: pixel(110), renderCell: (r: Row) => <Text type="supporting">{formatDay(r.insight.createdAt)}</Text> },
        ]}
      />
      )}

      {view === 'flat' && (
        <HStack hAlign="between" vAlign="center">
          <Text type="supporting">
            {filtered.length === 0 ? '0' : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)}`} of {filtered.length}
          </Text>
          <Pagination
            page={page}
            onChange={(p) => set('page', p === 1 ? undefined : String(p))}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            variant="pages"
            size="sm"
          />
        </HStack>
      )}
    </VStack>
  );
}
