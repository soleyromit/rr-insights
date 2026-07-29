// components/charts/RankedList.tsx — ranked meter rows (v18). A ranked list is
// a list, not an x/y chart: label row + measured bar + count, every row a door.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { TrendDelta } from './TrendDelta';
import type { TrendDeltaProps } from './TrendDelta';
import type { RankedRow } from '../../lib/series';

export interface RankedRowWithDelta extends RankedRow {
  delta?: TrendDeltaProps;
}

export interface RankedListProps {
  rows: RankedRowWithDelta[];
  /** Value formatter for the trailing figure. */
  format?: (r: RankedRow) => string;
  /** Rows at/under this value render with the error variant (e.g. below target). */
  errorBelow?: number;
}

export function RankedList({ rows, format, errorBelow }: RankedListProps) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <VStack gap={3}>
      {rows.map((r) => (
        <VStack key={r.key} gap={0.5}>
          <HStack gap={2} vAlign="center" hAlign="between">
            <HStack gap={2} vAlign="center">
              {r.href ? (
                <Link href={r.href} isStandalone>
                  {r.label}
                </Link>
              ) : (
                <Text type="body">{r.label}</Text>
              )}
              {r.hint && <Text type="supporting">{r.hint}</Text>}
            </HStack>
            <HStack gap={2} vAlign="center">
              {r.delta && <TrendDelta {...r.delta} />}
              <Text type="body" hasTabularNumbers color="secondary">
                {format ? format(r) : String(r.value)}
              </Text>
            </HStack>
          </HStack>
          <ProgressBar
            label={r.label}
            isLabelHidden
            value={r.value}
            max={max}
            variant={errorBelow !== undefined && r.value < errorBelow ? 'error' : 'accent'}
          />
        </VStack>
      ))}
    </VStack>
  );
}
