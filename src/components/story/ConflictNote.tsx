// components/story/ConflictNote.tsx — a contested fact, rendered as one (v19).
// Built for COHERE_LAUNCH-shaped records: claims disagree, the UI renders the
// conservative value and names who confirms. Never bury a conflict in a caption.
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { StatusDot } from '@astryxdesign/core/StatusDot';

export interface ConflictNoteProps {
  label: string;
  conflict: {
    claims: { date: string; source: string }[];
    rendered: string;
    status: string;
    owner: string;
    note?: string;
  };
}

export function ConflictNote({ label, conflict }: ConflictNoteProps) {
  return (
    <Card variant="muted" padding={3}>
      <VStack gap={1.5}>
        <HStack gap={2} vAlign="center">
          <StatusDot variant="warning" label="contested fact" />
          <Text type="label">{label}</Text>
          <Badge variant="warning" label={conflict.status} />
        </HStack>
        {conflict.claims.map((c) => (
          <Text key={c.source} type="supporting">
            {c.date} — {c.source}
          </Text>
        ))}
        <Text type="supporting" weight="medium">
          Rendered as {conflict.rendered} until {conflict.owner} confirms.
        </Text>
        {conflict.note && (
          <Text type="supporting" as="p" textWrap="pretty">
            {conflict.note}
          </Text>
        )}
      </VStack>
    </Card>
  );
}
