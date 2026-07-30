// components/charts/TierBars.tsx — opportunity-mass ranked bars, tier-stacked
// (v19.5). Each row: label + n + critical hint, then a stacked meter whose
// segments are P0→P3 mass (tier status colors — they encode the tier itself).
// 2px gaps between segments per mark spec; every row is a door.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { SCORE_TIERS } from '../../data/taxonomy';

export interface TierBarRow {
  key: string;
  label: string;
  mass: number;
  n: number;
  critical: number;
  tiers: Record<string, number>;
  href?: string;
}

const BAR_H = 12;

export function TierBars({ rows }: { rows: TierBarRow[] }) {
  const max = Math.max(...rows.map((r) => r.mass), 1);
  return (
    <VStack gap={3}>
      {rows.map((r) => {
        const segs = SCORE_TIERS.map((t) => ({ tier: t.tier, color: t.color, mass: r.tiers[t.tier] ?? 0 })).filter(
          (s) => s.mass > 0
        );
        let x = 0;
        const widthPct = (m: number) => (m / max) * 100;
        return (
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
                <Text type="supporting">
                  {r.n} insights · {r.critical} critical
                </Text>
              </HStack>
              <Text type="body" hasTabularNumbers color="secondary">
                {Math.round(r.mass)}
              </Text>
            </HStack>
            <svg width="100%" height={BAR_H} role="img" aria-label={`${r.label}: opportunity mass ${Math.round(r.mass)}`}>
              {segs.map((s) => {
                const w = widthPct(s.mass);
                const el = (
                  <rect key={s.tier} x={`${x}%`} y={0} width={`calc(${w}% - 2px)`} height={BAR_H} rx={2} fill={s.color}>
                    <title>{`${r.label} · ${s.tier}: ${Math.round(s.mass)} mass`}</title>
                  </rect>
                );
                x += w;
                return el;
              })}
            </svg>
          </VStack>
        );
      })}
    </VStack>
  );
}
