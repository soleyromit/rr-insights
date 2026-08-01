// components/build-status/BuildStatusPill.tsx — status badge for
// BuildStatusEntry records. Follows the same variant-mapping pattern as
// components/ui/sev.tsx (SevBadge) — status colors are reserved for
// meaning, never reused as decoration.
import { Badge } from '@astryxdesign/core/Badge';
import { Text } from '@astryxdesign/core/Text';
import { HStack } from '@astryxdesign/core/HStack';
import type { BuildStatusEntry } from '../../types';

const STATUS_LABEL: Record<BuildStatusEntry['status'], string> = {
  built: 'Shipped',
  partial: 'Partial',
  gap: 'Still open',
  'not-started': 'Not started',
};

const STATUS_VARIANT: Record<BuildStatusEntry['status'], 'neutral' | 'info' | 'success' | 'warning' | 'error'> = {
  built: 'success',
  partial: 'warning',
  gap: 'error',
  'not-started': 'neutral',
};

export function BuildStatusPill({
  status,
  confidence,
}: {
  status: BuildStatusEntry['status'];
  confidence: BuildStatusEntry['confidence'];
}) {
  return (
    <HStack gap={1.5} vAlign="center">
      <Badge variant={STATUS_VARIANT[status]} label={STATUS_LABEL[status]} />
      {confidence !== 'high' && (
        <Text type="supporting" color="secondary">
          {confidence} confidence
        </Text>
      )}
    </HStack>
  );
}
