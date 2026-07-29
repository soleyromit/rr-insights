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
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { VolumeChart } from '../components/charts/VolumeChart';
import { SevDot } from '../components/ui/sev';
import { insightsWhere, evidenceClass } from '../lib/selectors';
import { monthlyVolume } from '../lib/series';
import { scoreOf } from '../lib/score';
import { PRODUCTS, getProduct } from '../data/products';
import { PERSONAS } from '../data/personas';
import { ALL_INSIGHTS } from '../data/insights';
import { hrefInsight } from '../lib/links';
import type { Insight, SeverityLevel } from '../types';

const PAGE_SIZE = 25;
const SEVERITIES = ['all', 'critical', 'high', 'medium', 'low'] as const;

interface Row extends Record<string, unknown> {
  id: string;
  insight: Insight;
  score: number;
}

export function InsightIndexView() {
  const [params, setParams] = useSearchParams();

  const q = params.get('q') ?? '';
  const product = params.get('product') ?? undefined;
  const persona = params.get('persona') ?? undefined;
  const severity = (params.get('severity') as SeverityLevel | null) ?? undefined;
  const signal = params.get('signal') ?? undefined;
  const tag = params.get('tag') ?? undefined;
  const sort = (params.get('sort') as 'score' | 'newest' | null) ?? 'score';
  const page = Math.max(1, Number(params.get('page') ?? 1));

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

  const filtered = useMemo(
    () => insightsWhere({ q: q || undefined, product, persona, severity, signal, tag, sort }),
    [q, product, persona, severity, signal, tag, sort]
  );
  const volume = useMemo(() => monthlyVolume(filtered), [filtered]);
  const pageRows: Row[] = filtered
    .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    .map((i) => ({ id: i.id, insight: i, score: scoreOf(i) }));

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
          {signal && <Token label={`signal: ${signal}`} color="teal" onRemove={() => set('signal', undefined)} />}
          {tag && <Token label={`tag: ${tag}`} color="orange" onRemove={() => set('tag', undefined)} />}
        </HStack>
      </VStack>

      <Fig
        title="Evidence volume for this query"
        caption="The histogram re-renders with every filter — a spike names the month the theme landed."
      >
        <VolumeChart data={volume} height={140} />
      </Fig>

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
            header: 'Score',
            width: pixel(70),
            align: 'end',
            renderCell: (r: Row) => (
              <Text type="body" hasTabularNumbers>
                {r.score}
              </Text>
            ),
          },
          { key: 'date', header: 'Captured', width: pixel(100), renderCell: (r: Row) => <Text type="supporting">{r.insight.createdAt}</Text> },
        ]}
      />

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
    </VStack>
  );
}
