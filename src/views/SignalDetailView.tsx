// views/SignalDetailView.tsx — one signal's case file (v18, new route).
// Everything the old hash-drilldown showed, now at a canonical URL:
// /signals/:signalId?persona=…&insight=… arrives pre-drilled.
import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { Button } from '@astryxdesign/core/Button';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { VolumeChart } from '../components/charts/VolumeChart';
import { TrendDelta } from '../components/charts/TrendDelta';
import { QueryLink } from '../components/story/QueryLink';
import { SevDot } from '../components/ui/sev';
import { InsightDoc } from '../components/insight/InsightDoc';
import { signalById, insightById, allSignals, CORPUS_ANCHOR } from '../lib/selectors';
import { monthlyVolume, recentCounts } from '../lib/series';
import { scoreOf } from '../lib/score';
import { formatDay } from '../lib/format';
import { PERSONAS } from '../data/personas';
import { getProduct } from '../data/products';
import { hrefInsight, hrefInsights, hrefProduct, hrefSignal, hrefSignals } from '../lib/links';
import type { Insight } from '../types';

interface Row extends Record<string, unknown> {
  id: string;
  insight: Insight;
  score: number;
}

export function SignalDetailView() {
  const { signalId } = useParams();
  const [params, setParams] = useSearchParams();
  const sig = signalId ? signalById(signalId) : undefined;
  const persona = params.get('persona') ?? 'all';
  const sort = params.get('sort') === 'newest' ? 'newest' : 'score';
  const openInsightId = params.get('insight');

  const members = useMemo(() => {
    if (!sig) return [];
    const list = persona === 'all' ? sig.insights : (sig.byPersona[persona as keyof typeof sig.byPersona] ?? []);
    return [...list].sort(
      sort === 'newest' ? (a, b) => (b.createdAt > a.createdAt ? 1 : -1) : (a, b) => scoreOf(b) - scoreOf(a)
    );
  }, [sig, persona, sort]);

  if (!sig) {
    return <EmptyState title="Signal not found" description={`No signal with id "${signalId}".`} />;
  }

  const set = (key: string, value?: string) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (value) p.set(key, value);
        else p.delete(key);
        return p;
      },
      { replace: true }
    );
  };

  const openInsight = openInsightId ? insightById(openInsightId) : undefined;
  const personasPresent = PERSONAS.filter((p) => (sig.byPersona[p.id]?.length ?? 0) > 0);

  const rows: Row[] = members.map((i) => ({ id: i.id, insight: i, score: scoreOf(i) }));

  const newest = sig.insights.reduce<string | undefined>(
    (m, i) => (m === undefined || i.createdAt > m ? i.createdAt : m),
    undefined
  );
  const recent = recentCounts(sig.insights, 30, CORPUS_ANCHOR);

  // Forward journey: member counts per product, plus siblings sharing the top product.
  const productCounts = (Object.entries(sig.byProduct) as [string, number][])
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const topProduct = productCounts[0]?.[0];
  const siblings = topProduct
    ? allSignals()
        .filter((s) => s.def.id !== sig.def.id && (s.byProduct[topProduct as keyof typeof s.byProduct] ?? 0) > 0)
        .slice(0, 2)
    : [];

  return (
    <VStack gap={5} padding={6}>
      <VStack gap={2}>
        <Link href={hrefSignals()} isStandalone>
          ← All signals
        </Link>
        <PageHeader
          title={sig.def.title}
          lede={sig.def.question}
          facts={[
            { value: String(sig.insights.length), label: 'member insights' },
            { value: String(sig.bySeverity['critical'] ?? 0), label: 'critical' },
            { value: newest ? formatDay(newest) : '—', label: 'newest evidence' },
          ]}
          factsEnd={<TrendDelta current={recent.current} prior={recent.prior} windowLabel="vs prior 30d" />}
        />
      </VStack>

      {openInsight && (
        <Card padding={5} elevation="low">
          <VStack gap={3}>
            <HStack hAlign="between" vAlign="center">
              <Text type="label" color="secondary">
                Opened from this signal
              </Text>
              <Button label="Close" variant="ghost" size="sm" onClick={() => set('insight', undefined)} />
            </HStack>
            <InsightDoc insight={openInsight} />
          </VStack>
        </Card>
      )}

      <MetadataList columns="multi" title="Case file">
        <MetadataListItem label="Design response">{sig.def.designResponse}</MetadataListItem>
        <MetadataListItem label="Persona focus">
          {sig.def.personaFocus === 'all' ? 'All personas' : PERSONAS.find((p) => p.id === sig.def.personaFocus)?.name ?? sig.def.personaFocus}
        </MetadataListItem>
        <MetadataListItem label="Products">
          <HStack gap={1.5} wrap="wrap">
            {sig.def.products.map((p) => (
              <Token key={p} label={getProduct(p)?.shortName ?? p} color="blue" href={hrefProduct(p)} />
            ))}
          </HStack>
        </MetadataListItem>
      </MetadataList>

      <Fig
        title="Evidence volume by month"
        n={sig.insights.length}
        caption="When this signal's evidence landed. A rising line into a deadline is the escalation argument."
        link={{
          href: hrefInsights({ signal: sig.def.id, sort: 'newest' }),
          count: sig.insights.length,
          label: 'member insights, newest first',
        }}
      >
        <VolumeChart data={monthlyVolume(sig.insights)} height={180} />
      </Fig>

      <VStack gap={3}>
        <HStack hAlign="between" vAlign="center" wrap="wrap" gap={3}>
          <Text type="label" color="secondary">
            Member evidence
          </Text>
          <HStack gap={3} vAlign="center" wrap="wrap">
            <SegmentedControl label="Sort" value={sort} onChange={(v) => set('sort', v === 'score' ? undefined : v)} size="sm">
              <SegmentedControlItem value="score" label="by score" />
              <SegmentedControlItem value="newest" label="newest" />
            </SegmentedControl>
            <SegmentedControl label="Persona filter" value={persona} onChange={(v) => set('persona', v === 'all' ? undefined : v)} size="sm">
              <SegmentedControlItem value="all" label={`All · ${sig.insights.length}`} />
              {personasPresent.map((p) => (
                <SegmentedControlItem key={p.id} value={p.id} label={`${p.name} · ${sig.byPersona[p.id]?.length ?? 0}`} />
              ))}
            </SegmentedControl>
          </HStack>
        </HStack>

        <Table<Row>
          data={rows}
          idKey="id"
          density="balanced"
          hasHover
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
            { key: 'date', header: 'Captured', width: pixel(110), renderCell: (r: Row) => <Text type="supporting">{formatDay(r.insight.createdAt)}</Text> },
          ]}
        />
      </VStack>

      <VStack gap={2}>
        <Text type="label" color="secondary">
          Where this signal leads
        </Text>
        <HStack gap={4} vAlign="center" wrap="wrap">
          {productCounts.map(([pid, count]) => (
            <QueryLink
              key={pid}
              href={hrefInsights({ signal: sig.def.id, product: pid })}
              count={count}
              label={`in ${getProduct(pid)?.shortName ?? pid}`}
            />
          ))}
          {siblings.map((sib) => (
            <QueryLink
              key={sib.def.id}
              href={hrefSignal(sib.def.id)}
              count={sib.insights.length}
              label={`insights · sibling signal “${sib.def.title}”`}
            />
          ))}
        </HStack>
      </VStack>
    </VStack>
  );
}
