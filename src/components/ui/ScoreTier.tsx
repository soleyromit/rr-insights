// components/ui/ScoreTier.tsx — tier + inspectable formula, never a bare number.
// The score's 11 possible values cluster heavily, so ranks render as P0–P3
// tiers with the severity×evidence×persona breakdown beside them.
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { tierOf } from '../../data/taxonomy';
import type { TierId } from '../../data/taxonomy';
import type { ScoreBreakdown } from '../../lib/score';

const TIER_TOKEN_COLOR: Record<TierId, 'red' | 'orange' | 'purple' | 'gray'> = {
  P0: 'red', P1: 'orange', P2: 'purple', P3: 'gray',
};

export function ScoreTier({ breakdown, showFormula = true }: { breakdown: ScoreBreakdown; showFormula?: boolean }) {
  const def = tierOf(breakdown.total);
  return (
    <HStack gap={1.5} vAlign="center">
      <Token label={breakdown.tier} size="sm" color={TIER_TOKEN_COLOR[breakdown.tier]} description={def.meaning} />
      {showFormula && (
        <Text type="supporting" hasTabularNumbers>
          {breakdown.label}
        </Text>
      )}
    </HStack>
  );
}
