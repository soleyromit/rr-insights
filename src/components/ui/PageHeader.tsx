// components/ui/PageHeader.tsx — page masthead (v18): title, one-sentence
// lede, and a supporting meta line. Replaces the old serif Masthead.
import { Children, Fragment } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Divider } from '@astryxdesign/core/Divider';

export interface PageHeaderFact {
  value: string;
  label: string;
  href?: string;
}

export interface PageHeaderProps {
  title: string;
  lede?: string;
  meta?: string;
  /** Structured value+label pairs — the exit ramp from the ·-joined meta string. */
  facts?: PageHeaderFact[];
  /** Extra header widgets (e.g. StalenessMeter), rendered on the facts row. */
  factsEnd?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, lede, meta, facts, factsEnd, actions }: PageHeaderProps) {
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
      {(facts?.length || factsEnd) && (
        <HStack gap={3} vAlign="center" wrap="wrap">
          {facts?.map((f, i) => (
            <Fragment key={`${f.label}-${i}`}>
              {i > 0 && <Divider orientation="vertical" />}
              <HStack gap={1} vAlign="center">
                <Text type="body" weight="semibold" hasTabularNumbers>
                  {f.value}
                </Text>
                {f.href ? (
                  <Link href={f.href}>{f.label}</Link>
                ) : (
                  <Text type="supporting">{f.label}</Text>
                )}
              </HStack>
            </Fragment>
          ))}
          {factsEnd && Children.count(factsEnd) > 0 && (
            <>
              {facts?.length ? <Divider orientation="vertical" /> : null}
              {factsEnd}
            </>
          )}
        </HStack>
      )}
      {meta && (
        <Text type="supporting" as="p">
          {meta}
        </Text>
      )}
    </VStack>
  );
}
