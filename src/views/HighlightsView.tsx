// views/HighlightsView.tsx — the highlight wall (v18 Astryx rebuild).
// Every direct quote in the corpus as a browsable masonry wall, groupable by
// product or sentiment; every card opens its insight, every speaker their
// participant page. Sources: insights with pullQuote + voices.ts interviews.
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { PageHeader } from '../components/ui/PageHeader';
import { SevDot } from '../components/ui/sev';
import { ALL_INSIGHTS } from '../data/insights';
import { REAL_VOICES } from '../data/voices';
import { PRODUCTS, getProduct } from '../data/products';
import { hrefInsight, hrefParticipant, hrefProduct } from '../lib/links';
import type { Insight } from '../types';
import type { RealVoice } from '../data/voices';

interface Highlight {
  key: string;
  quote: string;
  speaker: string;
  date?: string;
  productIds: string[];
  insight?: Insight;
  voice?: RealVoice;
}

export function HighlightsView() {
  const [params, setParams] = useSearchParams();
  const product = params.get('product') ?? 'all';

  const highlights = useMemo<Highlight[]>(() => {
    const fromInsights: Highlight[] = ALL_INSIGHTS.filter((i) => i.pullQuote).map((i) => ({
      key: i.id,
      quote: i.pullQuote!,
      speaker: i.pullQuoteSource ?? i.source,
      date: i.createdAt,
      productIds: i.productIds,
      insight: i,
    }));
    const fromVoices: Highlight[] = REAL_VOICES.map((v) => ({
      key: `voice-${v.id}`,
      quote: v.quote,
      speaker: `${v.name} · ${v.title}, ${v.institution}`,
      productIds: v.productIds,
      voice: v,
    }));
    return [...fromInsights, ...fromVoices];
  }, []);

  const filtered = product === 'all' ? highlights : highlights.filter((h) => h.productIds.includes(product));

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Highlights"
        lede="The corpus speaking in its own words — every quote opens the evidence behind it."
        meta={`${filtered.length} highlights · ${REAL_VOICES.length} named voices`}
      />

      <SegmentedControl
        label="Filter by product"
        value={product}
        onChange={(v) =>
          setParams(
            (prev) => {
              const p = new URLSearchParams(prev);
              if (v === 'all') p.delete('product');
              else p.set('product', v);
              return p;
            },
            { replace: true }
          )
        }
        size="sm"
      >
        <SegmentedControlItem value="all" label="All" />
        {PRODUCTS.map((p) => (
          <SegmentedControlItem key={p.id} value={p.id} label={p.shortName} />
        ))}
      </SegmentedControl>

      <div style={{ columns: '320px 3', columnGap: 16 }}>
        {filtered.map((h) => (
          <div key={h.key} style={{ breakInside: 'avoid', marginBottom: 16 }}>
            <Card padding={4}>
              <VStack gap={2}>
                <Blockquote>{h.quote}</Blockquote>
                <HStack gap={2} vAlign="center" wrap="wrap">
                  {h.insight && <SevDot severity={h.insight.severity} />}
                  <Text type="supporting" maxLines={1}>
                    {h.speaker}
                  </Text>
                  {h.date && <Text type="supporting">{h.date}</Text>}
                </HStack>
                <HStack gap={1.5} vAlign="center" wrap="wrap">
                  {h.productIds.slice(0, 3).map((p) => (
                    <Token key={p} label={getProduct(p)?.shortName ?? p} size="sm" color="blue" href={hrefProduct(p)} />
                  ))}
                  {h.insight && (
                    <Link href={hrefInsight(h.insight.id, 'highlights')}>Open insight →</Link>
                  )}
                  {h.voice && (
                    <Link href={hrefParticipant(h.voice.id)}>Participant →</Link>
                  )}
                </HStack>
              </VStack>
            </Card>
          </div>
        ))}
      </div>
    </VStack>
  );
}
