// components/charts/Fig.tsx — figure chrome (v18). Carries over the repo's
// chart discipline: every figure names the decision it supports in its caption.
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';

export interface FigProps {
  title: string;
  caption?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function Fig({ title, caption, actions, children }: FigProps) {
  return (
    <Card padding={4}>
      <VStack gap={3}>
        <HStack gap={2} vAlign="center" hAlign="between">
          <Text type="label" color="secondary">
            {title}
          </Text>
          {actions}
        </HStack>
        <div role="img" aria-label={caption ? `${title}. ${caption}` : title}>
          {children}
        </div>
        {caption && (
          <Text type="supporting" as="p">
            {caption}
          </Text>
        )}
      </VStack>
    </Card>
  );
}
