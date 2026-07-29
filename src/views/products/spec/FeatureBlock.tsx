// views/products/spec/FeatureBlock.tsx — one named capability with its spec
// line (v18). Used across product spec pages for feature maps.
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';

type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'error';

export interface FeatureBlockProps {
  title: string;
  desc: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
}

export function FeatureBlock({ title, desc, badge, badgeVariant = 'neutral' }: FeatureBlockProps) {
  return (
    <Card variant="muted" padding={3}>
      <VStack gap={1}>
        <HStack gap={2} vAlign="center">
          <Text type="body" weight="semibold">
            {title}
          </Text>
          {badge && <Badge variant={badgeVariant} label={badge} />}
        </HStack>
        <Text type="supporting" as="p" textWrap="pretty">
          {desc}
        </Text>
      </VStack>
    </Card>
  );
}
