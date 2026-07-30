// views/DigestView.tsx — "This week in research" (v19.4).
// The push artifact, computed live: what landed in the last 7 days, which
// products are going quiet, which conflicts and recommendations are stalling.
// Zero static prose — every number is the query that produces it.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { Card } from '@astryxdesign/core/Card';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { PageHeader } from '../components/ui/PageHeader';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { EvidenceList } from '../components/story/EvidenceRow';
import { insightsWhere, productFacts, CORPUS_ANCHOR } from '../lib/selectors';
import { scoreInsight } from '../lib/score';
import { getTheme } from '../data/themes';
import { PRODUCTS } from '../data/products';
import { openConflicts } from '../data/conflicts';
import { RECOMMENDATIONS } from '../data/recommendations';
import { hrefInsights, hrefProduct } from '../lib/links';
import { formatDay } from '../lib/format';

const dayMs = 86400000;
const isoDaysAgo = (days: number) =>
  new Date(new Date(CORPUS_ANCHOR).getTime() - days * dayMs).toISOString().slice(0, 10);

export function DigestView() {
  const since = isoDaysAgo(7);
  const fresh = useMemo(() => insightsWhere({ since }), [since]);

  const themeMix = useMemo(() => {
    const by = new Map<string, number>();
    for (const i of fresh) by.set(i.themeId, (by.get(i.themeId) ?? 0) + 1);
    return [...by.entries()].sort((a, b) => b[1] - a[1]);
  }, [fresh]);

  const p0 = fresh.filter((i) => scoreInsight(i).tier === 'P0');
  const quiet = PRODUCTS.map((p) => ({ p, facts: productFacts(p.id) })).filter((x) => x.facts.staleDays > 14);
  const staleRecs = RECOMMENDATIONS.filter(
    (r) => (r.status === 'proposed' || r.status === 'aligned') && r.statusDate < isoDaysAgo(30)
  );

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="This week"
        lede="The weekly digest, computed from the corpus — what landed, what went quiet, what needs a decision."
        meta={`Week ending ${formatDay(CORPUS_ANCHOR)} · window ${formatDay(since)} → today`}
      />

      <StatTileRow>
        <StatTile value={fresh.length} label="new insights (7d)" href={hrefInsights({ since })} />
        <StatTile value={p0.length} label="new P0 priority" href={hrefInsights({ since, ids: p0.map((i) => i.id) })} />
        <StatTile value={themeMix.length} label="themes touched" />
        <StatTile value={staleRecs.length} label="recommendations stalling" href="/decisions" />
      </StatTileRow>

      {themeMix.length > 0 && (
        <VStack gap={2}>
          <Text type="large" weight="semibold">
            Where the week's evidence landed
          </Text>
          <HStack gap={1.5} wrap="wrap">
            {themeMix.map(([themeId, n]) => (
              <Link key={themeId} href={hrefInsights({ theme: themeId, since })}>
                <Token label={`${getTheme(themeId)?.title ?? themeId} · ${n}`} />
              </Link>
            ))}
          </HStack>
          <EvidenceList insights={fresh} order="newest" limit={8} density="compact" />
        </VStack>
      )}
      {fresh.length === 0 && (
        <Card variant="muted" padding={4}>
          <Text type="body">No new insights in the last 7 days — the next sync runs Monday 9:37am.</Text>
        </Card>
      )}

      {quiet.length > 0 && (
        <VStack gap={2}>
          <Text type="large" weight="semibold">
            Going quiet
          </Text>
          <HStack gap={1.5} wrap="wrap">
            {quiet.map(({ p, facts }) => (
              <Link key={p.id} href={hrefProduct(p.id)}>
                <Token label={`${p.shortName} · ${facts.staleDays}d since last evidence`} color="orange" />
              </Link>
            ))}
          </HStack>
          <Text type="supporting">
            Products with no new evidence in 14+ days. Staleness is a research-coverage signal, not a product-health one.
          </Text>
        </VStack>
      )}

      {openConflicts().length > 0 && (
        <VStack gap={2}>
          <Text type="large" weight="semibold">
            Open conflicts ({openConflicts().length})
          </Text>
          <List density="compact" hasDividers>
            {openConflicts().map((c) => (
              <Item
                key={c.id}
                as="li"
                href="/decisions"
                label={c.fact}
                labelLines={1}
                description={`owner ${c.owner} — blocks: ${c.blocks}`}
                descriptionLines={1}
                endContent={
                  <Text type="supporting" hasTabularNumbers>
                    since {formatDay(c.raisedAt)}
                  </Text>
                }
              />
            ))}
          </List>
        </VStack>
      )}

      {staleRecs.length > 0 && (
        <VStack gap={2}>
          <Text type="large" weight="semibold">
            Recommendations waiting 30+ days
          </Text>
          <List density="compact" hasDividers>
            {staleRecs.map((r) => (
              <Item
                key={r.id}
                as="li"
                href="/decisions"
                startContent={<Token label={r.status} size="sm" color={r.status === 'proposed' ? 'gray' : 'orange'} />}
                label={r.text}
                labelLines={1}
                endContent={
                  <Text type="supporting" hasTabularNumbers>
                    since {formatDay(r.statusDate)}
                  </Text>
                }
              />
            ))}
          </List>
        </VStack>
      )}
    </VStack>
  );
}
