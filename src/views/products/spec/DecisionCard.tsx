// views/products/spec/DecisionCard.tsx — a design decision with its rationale
// and tradeoff (v18). Optional supporting insight ids link into the corpus so
// every decision stays evidence-backed.
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { hrefInsight } from '../../../lib/links';

export interface DecisionCardProps {
  title: string;
  decision: string;
  rationale: string;
  tradeoff: string;
  source: string;
  insightIds?: string[];
}

function Row({ label, text }: { label: string; text: string }) {
  return (
    <VStack gap={0.5}>
      <Text type="label" color="secondary">
        {label}
      </Text>
      <Text type="body" as="p" textWrap="pretty">
        {text}
      </Text>
    </VStack>
  );
}

export function DecisionCard({ title, decision, rationale, tradeoff, source, insightIds }: DecisionCardProps) {
  return (
    <Card padding={4}>
      <VStack gap={3}>
        <Text type="body" weight="semibold">
          {title}
        </Text>
        <Row label="Decision" text={decision} />
        <Row label="Rationale" text={rationale} />
        <Row label="Tradeoff" text={tradeoff} />
        <HStack gap={3} vAlign="center" wrap="wrap">
          <Text type="supporting">{source}</Text>
          {insightIds?.map((id) => (
            <Link key={id} href={hrefInsight(id)}>
              {id} →
            </Link>
          ))}
        </HStack>
      </VStack>
    </Card>
  );
}
