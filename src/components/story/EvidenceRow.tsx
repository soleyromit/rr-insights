// components/story/EvidenceRow.tsx — the one evidence row (v19). Replaces the
// three structurally-identical score-ranked Card lists (ProductPage /
// PersonaDetail / ParticipantDetail). An Item, not a Card: records are rows.
// formatSource/formatDay are called here so pages can't forget them.
import { Item } from '@astryxdesign/core/Item';
import { List } from '@astryxdesign/core/List';
import { Text } from '@astryxdesign/core/Text';
import { Timestamp } from '@astryxdesign/core/Timestamp';
import { SevDot } from '../ui/sev';
import { formatSource, formatDay } from '../../lib/format';
import { hrefInsight } from '../../lib/links';
import { getProduct } from '../../data/products';
import { scoreOf } from '../../lib/score';
import type { Insight, SeverityLevel } from '../../types';

/** Relative time ≤30d old, plain date beyond — avoids Timestamp's fake
 * time-of-day on our date-only corpus. */
export function FeedTime({ iso }: { iso: string }) {
  const ageDays = (Date.now() - new Date(iso).getTime()) / 86400000;
  if (ageDays >= 0 && ageDays <= 30) {
    return <Timestamp value={`${iso}T12:00:00`} format="relative" hasTooltip={false} />;
  }
  return (
    <Text type="supporting" hasTabularNumbers>
      {formatDay(iso)}
    </Text>
  );
}

export interface EvidenceRowProps {
  insight: Insight;
  from?: string;
  showProducts?: boolean;
}

export function EvidenceRow({ insight, from, showProducts = true }: EvidenceRowProps) {
  const products = showProducts
    ? insight.productIds.map((p) => getProduct(p)?.shortName ?? p).join(' · ')
    : '';
  return (
    <Item
      as="li"
      href={hrefInsight(insight.id, from)}
      startContent={<SevDot severity={insight.severity as SeverityLevel} />}
      label={insight.text}
      labelLines={2}
      description={[formatSource(insight.source), products].filter(Boolean).join(' — ')}
      descriptionLines={1}
      endContent={<FeedTime iso={insight.createdAt} />}
      align="start"
    />
  );
}

export interface EvidenceListProps {
  insights: Insight[];
  from?: string;
  limit?: number;
  order?: 'score' | 'newest';
  showProducts?: boolean;
  density?: 'compact' | 'balanced' | 'spacious';
  header?: React.ReactNode;
}

export function EvidenceList({
  insights,
  from,
  limit,
  order = 'score',
  showProducts,
  density = 'balanced',
  header,
}: EvidenceListProps) {
  const sorted = [...insights].sort(
    order === 'newest'
      ? (a, b) => (b.createdAt > a.createdAt ? 1 : -1)
      : (a, b) => scoreOf(b) - scoreOf(a)
  );
  const rows = limit ? sorted.slice(0, limit) : sorted;
  return (
    <List density={density} hasDividers header={header}>
      {rows.map((i) => (
        <EvidenceRow key={i.id} insight={i} from={from} showProducts={showProducts} />
      ))}
    </List>
  );
}
