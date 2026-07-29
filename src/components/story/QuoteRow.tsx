// components/story/QuoteRow.tsx — sourced quotes as Citation rows (v19).
// Replaces the Blockquote-in-Card grids; QuoteList's Grid layout is the
// Astryx-native masonry replacement for the old raw-div column hack.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Text } from '@astryxdesign/core/Text';
import { Citation } from '@astryxdesign/core/Citation';
import { formatSource } from '../../lib/format';

export interface QuoteRowProps {
  quote: string;
  speaker: string;
  number: number;
  /** Extra chips/links rendered under the citation line. */
  footer?: React.ReactNode;
  /** Timestamp / date node rendered beside the citation. */
  time?: React.ReactNode;
}

export function QuoteRow({ quote, speaker, number, footer, time }: QuoteRowProps) {
  return (
    <VStack gap={1.5}>
      <Text type="large" as="p" textWrap="pretty">
        “{quote}”
      </Text>
      <HStack gap={2} vAlign="center" wrap="wrap">
        <Citation source={{ title: formatSource(speaker) }} number={number} variant="label" />
        {time}
      </HStack>
      {footer}
    </VStack>
  );
}

export interface QuoteListProps {
  children: React.ReactNode;
  columns?: boolean;
}

export function QuoteList({ children, columns = false }: QuoteListProps) {
  if (columns) {
    return (
      <Grid columns={{ minWidth: 320, max: 3 }} gap={5}>
        {children}
      </Grid>
    );
  }
  return (
    <VStack gap={5} maxWidth={720}>
      {children}
    </VStack>
  );
}
