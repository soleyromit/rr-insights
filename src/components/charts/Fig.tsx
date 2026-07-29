// components/charts/Fig.tsx — figure chrome (v18). Carries over the repo's
// chart discipline: every figure names the decision it supports in its caption.
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { QueryLink } from '../story/QueryLink';

export interface FigProps {
  title: string;
  caption?: string;
  actions?: React.ReactNode;
  /** Sample size shown as an "n = x" badge — the derived+annotated rule lives here. */
  n?: number;
  /** Sparse-data / methodology annotation, e.g. "May–Sep '25 tail: 3 insights total". */
  note?: string;
  /** Footer door into the query behind the figure. */
  link?: { href: string; count: number | string; label: string };
  children: React.ReactNode;
}

export function Fig({ title, caption, actions, n, note, link, children }: FigProps) {
  return (
    <Card padding={4}>
      <VStack gap={3}>
        <HStack gap={2} vAlign="center" hAlign="between">
          <HStack gap={2} vAlign="center">
            <Text type="label" color="secondary">
              {title}
            </Text>
            {n !== undefined && <Badge variant="neutral" label={`n = ${n}`} />}
          </HStack>
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
        {note && (
          <Text type="supporting" as="p" color="secondary">
            {note}
          </Text>
        )}
        {link && <QueryLink href={link.href} count={link.count} label={link.label} />}
      </VStack>
    </Card>
  );
}
