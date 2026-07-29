// components/charts/TrendDelta.tsx — current-vs-prior window delta (v19).
// Polarity defaults to neutral: more findings is not good or bad, it is volume.
// Semantic color only when a page explicitly declares a polarity.
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';

export interface TrendDeltaProps {
  current: number;
  prior: number;
  /** e.g. "vs prior 30d" */
  windowLabel: string;
  polarity?: 'up-good' | 'up-bad' | 'neutral';
}

export function TrendDelta({ current, prior, windowLabel, polarity = 'neutral' }: TrendDeltaProps) {
  const delta = current - prior;
  const arrow = delta > 0 ? '▲' : delta < 0 ? '▼' : '—';
  const signed = delta > 0 ? `+${delta}` : `${delta}`;
  const text = `${signed} ${arrow} ${windowLabel}`;
  if (polarity === 'neutral' || delta === 0) {
    return (
      <Text type="supporting" hasTabularNumbers>
        {text}
      </Text>
    );
  }
  const good = polarity === 'up-good' ? delta > 0 : delta < 0;
  return <Badge variant={good ? 'success' : 'error'} label={text} />;
}
