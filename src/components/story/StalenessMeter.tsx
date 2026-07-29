// components/story/StalenessMeter.tsx — days since last evidence (v19).
// Status colors are legitimate here: freshness thresholds are a state, and a
// dormant product should say so out loud.
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { formatDay } from '../../lib/format';

export interface StalenessMeterProps {
  newestDate?: string;
  staleDays: number;
  /** fresh ≤ these days → success; aging ≤ → warning; beyond → error. */
  thresholds?: { fresh: number; aging: number };
}

export function StalenessMeter({ newestDate, staleDays, thresholds = { fresh: 7, aging: 30 } }: StalenessMeterProps) {
  if (!newestDate) {
    return (
      <HStack gap={1.5} vAlign="center">
        <StatusDot variant="error" label="no evidence" />
        <Text type="supporting">No evidence captured</Text>
      </HStack>
    );
  }
  const variant = staleDays <= thresholds.fresh ? 'success' : staleDays <= thresholds.aging ? 'warning' : 'error';
  const phrase = staleDays <= 0 ? 'today' : staleDays === 1 ? '1 day ago' : `${staleDays} days ago`;
  return (
    <HStack gap={1.5} vAlign="center">
      <StatusDot variant={variant} label={`last evidence ${phrase}`} />
      <Text type="supporting" hasTabularNumbers>
        Last evidence {phrase} · {formatDay(newestDate)}
      </Text>
    </HStack>
  );
}
