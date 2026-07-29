// components/story/FindingsFeed.tsx — THE latest-findings primitive (v19).
// A newest-first EvidenceList preset with an honest empty state; product hubs
// and the Overview freshness experience are built on this.
import { Text } from '@astryxdesign/core/Text';
import { EvidenceList } from './EvidenceRow';
import type { Insight } from '../../types';

export interface FindingsFeedProps {
  insights: Insight[];
  from?: string;
  limit?: number;
  header?: React.ReactNode;
  emptyLabel?: string;
  showProducts?: boolean;
}

export function FindingsFeed({
  insights,
  from,
  limit = 5,
  header,
  emptyLabel = 'No evidence captured yet.',
  showProducts = true,
}: FindingsFeedProps) {
  if (!insights.length) {
    return (
      <Text type="supporting" as="p">
        {emptyLabel}
      </Text>
    );
  }
  return (
    <EvidenceList
      insights={insights}
      from={from}
      limit={limit}
      order="newest"
      density="spacious"
      showProducts={showProducts}
      header={header}
    />
  );
}
