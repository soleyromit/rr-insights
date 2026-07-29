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
import { SevDot } from '../components/ui/sev';
import { InsightDoc } from '../components/insight/InsightDoc';
import { signalById, insightById } from '../lib/selectors';
import { monthlyVolume } from '../lib/series';
import { scoreOf } from '../lib/score';
import { PERSONAS } from '../data/personas';
import { getProduct } from '../data/products';
import { hrefInsight, hrefProduct, hrefSignals } from '../lib/links';
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
  const openInsightId = params.get('insight');

  const members = useMemo(() => {
    if (!sig) return [];
    const list = persona === 'all' ? sig.insights : (sig.byPersona[persona as keyof typeof sig.byPersona] ?? []);
    return [...list].sort((a, b) => scoreOf(b) - scoreOf(a));
  }, [sig, persona]);

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

  return (
    <VStack gap={5} padding={6}>
      <VStack gap={2}>
        <Link href={hrefSignals()} isStandalone>
          ← All signals
        </Link>
        <PageHeader
          title={sig.def.title}
          lede={sig.def.question}
          meta={`${sig.insights.length} member insights · ${sig.bySeverity['critical'] ?? 0} critical · top severity ${sig.topSeverity}`}
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
        caption="When this signal's evidence landed. A rising line into a deadline is the escalation argument."
      >
        <VolumeChart data={monthlyVolume(sig.insights)} height={180} />
      </Fig>

      <VStack gap={3}>
        <HStack hAlign="between" vAlign="center" wrap="wrap" gap={3}>
          <Text type="label" color="secondary">
            Member evidence, score-ranked
          </Text>
          <SegmentedControl label="Persona filter" value={persona} onChange={(v) => set('persona', v === 'all' ? undefined : v)} size="sm">
            <SegmentedControlItem value="all" label={`All · ${sig.insights.length}`} />
            {personasPresent.map((p) => (
              <SegmentedControlItem key={p.id} value={p.id} label={`${p.name} · ${sig.byPersona[p.id]?.length ?? 0}`} />
            ))}
          </SegmentedControl>
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
            { key: 'date', header: 'Captured', width: pixel(100), renderCell: (r: Row) => <Text type="supporting">{r.insight.createdAt}</Text> },
          ]}
        />
      </VStack>
    </VStack>
  );
}
