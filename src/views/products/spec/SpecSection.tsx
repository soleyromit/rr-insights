// views/products/spec/SpecSection.tsx — spec page section wrapper (v18).
// One heading + optional context line, then structured content. Every spec
// page is a stack of these so the outline stays scannable.
import { VStack } from '@astryxdesign/core/VStack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';

export interface SpecSectionProps {
  title: string;
  sub?: string;
  children: React.ReactNode;
}

export function SpecSection({ title, sub, children }: SpecSectionProps) {
  return (
    <VStack gap={3}>
      <VStack gap={0.5}>
        <Heading level={2}>{title}</Heading>
        {sub && (
          <Text type="supporting" as="p" textWrap="pretty">
            {sub}
          </Text>
        )}
      </VStack>
      {children}
    </VStack>
  );
}
