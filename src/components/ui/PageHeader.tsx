// components/ui/PageHeader.tsx — page masthead (v18): title, one-sentence
// lede, and a supporting meta line. Replaces the old serif Masthead.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';

export interface PageHeaderProps {
  title: string;
  lede?: string;
  meta?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, lede, meta, actions }: PageHeaderProps) {
  return (
    <VStack gap={1.5}>
      <HStack gap={3} vAlign="center" hAlign="between">
        <Heading level={1}>{title}</Heading>
        {actions}
      </HStack>
      {lede && (
        <Text type="large" color="secondary" as="p" textWrap="pretty">
          {lede}
        </Text>
      )}
      {meta && (
        <Text type="supporting" as="p">
          {meta}
        </Text>
      )}
    </VStack>
  );
}
