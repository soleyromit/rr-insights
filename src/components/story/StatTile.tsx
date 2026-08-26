// components/story/StatTile.tsx — stat tiles as an edge-to-edge row divided by
// vertical rules (v19, dashboard-portfolio pattern) — not six little Cards.
import { Children, Fragment } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Divider } from '@astryxdesign/core/Divider';
import { Icon } from '@astryxdesign/core/Icon';
import type { IconName } from '@astryxdesign/core/Icon';
import { TrendDelta } from '../charts/TrendDelta';
import type { TrendDeltaProps } from '../charts/TrendDelta';
import { Sparkline } from '../charts/Sparkline';
import type { SparklinePoint } from '../charts/Sparkline';

export interface StatTileProps {
  value: string | number;
  label: string;
  href?: string;
  delta?: TrendDeltaProps;
  spark?: SparklinePoint[];
  hint?: string;
  /** Optional leading icon — a quick-scan cue for what kind of number this is (a risk, a person, a deadline). */
  icon?: IconName;
  iconColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'warning';
}

export function StatTile({ value, label, href, delta, spark, hint, icon, iconColor = 'secondary' }: StatTileProps) {
  return (
    <VStack gap={0.5}>
      <HStack gap={1.5} vAlign="center">
        {icon && <Icon icon={icon} color={iconColor} size="sm" />}
        <Text type="display-3" hasTabularNumbers>
          {String(value)}
        </Text>
      </HStack>
      {href ? (
        <Link href={href}>{label}</Link>
      ) : (
        <Text type="supporting">{label}</Text>
      )}
      {delta && <TrendDelta {...delta} />}
      {spark && spark.length > 1 && <Sparkline data={spark} height={32} />}
      {hint && <Text type="supporting">{hint}</Text>}
    </VStack>
  );
}

export function StatTileRow({ children }: { children: React.ReactNode }) {
  const kids = Children.toArray(children);
  return (
    <HStack gap={5} vAlign="start" wrap="wrap">
      {kids.map((child, i) => (
        <Fragment key={i}>
          {i > 0 && <Divider orientation="vertical" />}
          {child}
        </Fragment>
      ))}
    </HStack>
  );
}
