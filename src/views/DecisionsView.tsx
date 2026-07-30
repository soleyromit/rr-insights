// views/DecisionsView.tsx — the decision layer (v19.4).
// Recommendations are first-class: every action shows its evidence chain
// (insight ids → the query that produces them) and where it sits in the real
// approval pipeline (ins-process-001: verbal alignment → sign-off → build).
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { PageHeader } from '../components/ui/PageHeader';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { RECOMMENDATIONS, REC_STATUS_ORDER, REC_STATUS_META } from '../data/recommendations';
import { openConflicts } from '../data/conflicts';
import { getProduct } from '../data/products';
import { hrefInsights } from '../lib/links';
import { formatDay } from '../lib/format';
import type { Recommendation, RecommendationStatus } from '../types';
import { Card } from '@astryxdesign/core/Card';

const STATUS_TOKEN_COLOR: Record<RecommendationStatus, 'gray' | 'orange' | 'teal' | 'green' | 'red'> = {
  proposed: 'gray', aligned: 'orange', approved: 'teal', shipped: 'green', rejected: 'red',
};

function RecRow({ rec }: { rec: Recommendation }) {
  const products = rec.productIds.map((p) => getProduct(p)?.shortName ?? p).join(' · ');
  const meta = [
    rec.owner ? `owner ${rec.owner}` : undefined,
    `status ${formatDay(rec.statusDate)}`,
    products,
    rec.rationale,
  ]
    .filter(Boolean)
    .join(' — ');
  return (
    <Item
      as="li"
      label={rec.text}
      labelLines={2}
      description={meta}
      descriptionLines={2}
      align="start"
      endContent={
        <Link href={hrefInsights({ ids: rec.insightIds })}>
          <Text type="supporting" hasTabularNumbers>
            {rec.insightIds.length} insights
          </Text>
        </Link>
      }
    />
  );
}

export function DecisionsView() {
  const byStatus = new Map<RecommendationStatus, Recommendation[]>();
  for (const r of RECOMMENDATIONS) {
    const list = byStatus.get(r.status) ?? [];
    list.push(r);
    byStatus.set(r.status, list);
  }
  const counts = REC_STATUS_ORDER.map((s) => ({ status: s, n: byStatus.get(s)?.length ?? 0 }));

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Decisions"
        lede="Recommendations with their evidence chains — research that argues for an action, and where that action stands."
        meta={`${RECOMMENDATIONS.length} recommendations · every evidence count opens the insights behind it`}
      />

      <StatTileRow>
        <StatTile value={openConflicts().length} label="open conflicts" />
        {counts
          .filter((c) => c.n > 0)
          .map((c) => (
            <StatTile key={c.status} value={c.n} label={REC_STATUS_META[c.status].label.toLowerCase()} />
          ))}
      </StatTileRow>

      {openConflicts().length > 0 && (
        <VStack gap={2}>
          <HStack gap={2} vAlign="center">
            <Token label="Conflicts" color="red" />
            <Text type="supporting">Two sources disagree — both claims on record, nothing designed against either until the owner resolves it.</Text>
          </HStack>
          {openConflicts().map((c) => (
            <Card key={c.id} variant="muted" padding={4}>
              <VStack gap={1.5}>
                <HStack gap={2} vAlign="center" hAlign="between" wrap="wrap">
                  <Text type="body" weight="semibold">
                    {c.fact}
                  </Text>
                  <Text type="supporting">
                    owner {c.owner} · raised {formatDay(c.raisedAt)} ·{' '}
                    <Link href={hrefInsights({ ids: c.insightIds })}>evidence</Link>
                  </Text>
                </HStack>
                {c.claims.map((cl, i) => (
                  <Text key={i} type="supporting" as="p">
                    {i === 0 ? 'A' : 'B'}: {cl.claim} — {cl.source}
                  </Text>
                ))}
                <Text type="supporting" as="p" textWrap="pretty">
                  Blocks: {c.blocks}
                  {c.rendered ? ` Rendered conservatively as ${c.rendered}.` : ''}
                </Text>
              </VStack>
            </Card>
          ))}
        </VStack>
      )}

      {REC_STATUS_ORDER.filter((s) => (byStatus.get(s)?.length ?? 0) > 0).map((status) => {
        const recs = [...(byStatus.get(status) ?? [])].sort((a, b) => (b.statusDate > a.statusDate ? 1 : -1));
        return (
          <VStack key={status} gap={2}>
            <HStack gap={2} vAlign="center">
              <Token label={REC_STATUS_META[status].label} color={STATUS_TOKEN_COLOR[status]} />
              <Text type="supporting">{REC_STATUS_META[status].meaning}</Text>
            </HStack>
            <List density="balanced" hasDividers>
              {recs.map((r) => (
                <RecRow key={r.id} rec={r} />
              ))}
            </List>
          </VStack>
        );
      })}
    </VStack>
  );
}
