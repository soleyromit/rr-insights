// views/HighlightsView.tsx — the highlight wall (v19 redesign). The raw-div
// masonry and card-per-quote soup are gone: quotes read as a single-column,
// numbered Citation list at reading measure, newest first by default, with a
// computed count strip and links that carry the severity and traced-insight
// counts they expand.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { PageHeader } from '../components/ui/PageHeader';
import { QuoteRow, QuoteList } from '../components/story/QuoteRow';
import { QueryLink } from '../components/story/QueryLink';
import { FeedTime } from '../components/story/EvidenceRow';
import { ALL_INSIGHTS } from '../data/insights';
import { REAL_VOICES } from '../data/voices';
import { PRODUCTS, getProduct } from '../data/products';
import { insightsForVoice } from '../lib/selectors';
import { useParamState } from '../lib/useParamState';
import { hrefInsight, hrefParticipant, hrefProduct } from '../lib/links';
import type { Insight } from '../types';
import type { RealVoice } from '../data/voices';

interface Highlight {
  key: string;
  quote: string;
  speaker: string;
  productIds: string[];
  insight?: Insight;
  voice?: RealVoice;
}

const productRank = (h: Highlight) => {
  const idx = PRODUCTS.findIndex((p) => h.productIds.includes(p.id));
  return idx === -1 ? PRODUCTS.length : idx;
};

export function HighlightsView() {
  const [product, setProduct] = useParamState('product', 'all');
  const [sort, setSort] = useParamState('sort', 'newest');

  const highlights = useMemo<Highlight[]>(() => {
    const fromInsights: Highlight[] = ALL_INSIGHTS.filter((i) => i.pullQuote).map((i) => ({
      key: i.id,
      quote: i.pullQuote!,
      speaker: i.pullQuoteSource ?? i.source,
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

  const voiceCounts = useMemo(
    () => new Map(REAL_VOICES.map((v) => [v.id, insightsForVoice(v).length])),
    []
  );

  const pullQuoteCount = useMemo(() => ALL_INSIGHTS.filter((i) => i.pullQuote).length, []);
  const quoteShare = Math.round((pullQuoteCount / ALL_INSIGHTS.length) * 100);

  const filtered = useMemo(() => {
    const list = product === 'all' ? highlights : highlights.filter((h) => h.productIds.includes(product!));
    const sorted = [...list];
    if (sort === 'product') {
      sorted.sort((a, b) => productRank(a) - productRank(b));
    } else {
      // Newest first; undated voice quotes follow the dated corpus quotes.
      sorted.sort((a, b) => {
        if (a.insight && b.insight) return b.insight.createdAt > a.insight.createdAt ? 1 : -1;
        if (a.insight) return -1;
        if (b.insight) return 1;
        return 0;
      });
    }
    return sorted;
  }, [highlights, product, sort]);

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Highlights"
        lede="The corpus speaking in its own words — every quote opens the evidence behind it."
        meta={`${REAL_VOICES.length} named voices join the corpus pull-quotes below`}
      />

      <HStack gap={3} vAlign="center" wrap="wrap" hAlign="between">
        <HStack gap={3} vAlign="center" wrap="wrap">
          <SegmentedControl label="Filter by product" value={product ?? 'all'} onChange={(v) => setProduct(v === 'all' ? undefined : v)} size="sm">
            <SegmentedControlItem value="all" label="All" />
            {PRODUCTS.map((p) => (
              <SegmentedControlItem key={p.id} value={p.id} label={p.shortName} />
            ))}
          </SegmentedControl>
          <SegmentedControl label="Sort" value={sort ?? 'newest'} onChange={(v) => setSort(v === 'newest' ? undefined : v)} size="sm">
            <SegmentedControlItem value="newest" label="Newest" />
            <SegmentedControlItem value="product" label="By product" />
          </SegmentedControl>
        </HStack>
        <Text type="supporting" hasTabularNumbers>
          {pullQuoteCount} pull-quotes · {quoteShare}% of the {ALL_INSIGHTS.length}-insight corpus · {filtered.length} match
        </Text>
      </HStack>

      <QuoteList>
        {filtered.map((h, idx) => (
          <QuoteRow
            key={h.key}
            quote={h.quote}
            speaker={h.speaker}
            number={idx + 1}
            time={h.insight ? <FeedTime iso={h.insight.createdAt} /> : undefined}
            footer={
              <HStack gap={3} vAlign="center" wrap="wrap">
                {h.productIds.slice(0, 3).map((p) => (
                  <Token key={p} label={getProduct(p)?.shortName ?? p} size="sm" color="blue" href={hrefProduct(p)} />
                ))}
                {h.insight && (
                  <QueryLink
                    href={hrefInsight(h.insight.id, 'highlights')}
                    count={h.insight.severity ?? 'unrated'}
                    label={`· “${h.insight.text.slice(0, 60)}${h.insight.text.length > 60 ? '…' : ''}”`}
                  />
                )}
                {h.voice && (
                  <QueryLink
                    href={hrefParticipant(h.voice.id)}
                    count={voiceCounts.get(h.voice.id) ?? 0}
                    label={`insights · ${h.voice.name}`}
                  />
                )}
              </HStack>
            }
          />
        ))}
      </QuoteList>
    </VStack>
  );
}
