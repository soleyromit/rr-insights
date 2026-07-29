// views/products/spec/StatusCell.tsx — StatusDot + short text for matrix cells
// (v19). Replaces Badge walls: status colors stay reserved for state semantics
// (have / partial / missing), and the word travels with the dot.
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { StatusDot } from '@astryxdesign/core/StatusDot';

type CellState = 'yes' | 'partial' | 'no' | 'planned';

const VARIANT: Record<CellState, 'success' | 'warning' | 'neutral' | 'accent'> = {
  yes: 'success',
  partial: 'warning',
  no: 'neutral',
  planned: 'accent',
};

const WORD: Record<CellState, string> = {
  yes: 'shipped',
  partial: 'partial',
  no: '—',
  planned: 'planned',
};

export function StatusCell({ state, label }: { state: CellState; label?: string }) {
  return (
    <HStack gap={1.5} vAlign="center">
      <StatusDot variant={VARIANT[state]} label={label ?? WORD[state]} />
      <Text type="supporting">{label ?? WORD[state]}</Text>
    </HStack>
  );
}

export type { CellState };
