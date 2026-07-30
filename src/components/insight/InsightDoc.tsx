// components/insight/InsightDoc.tsx — the canonical insight document (v18).
// Every list row in the repo opens into this: full text, inspectable score,
// quote with its evidence-class contract, and a related-entities rail that
// makes the page a hub, not a dead end.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { SevBadge } from '../ui/sev';
import { ScoreTier } from '../ui/ScoreTier';
import { scoreInsight } from '../../lib/score';
import { evidenceClass, relatedInsights, signalsOf, voiceForInsight } from '../../lib/selectors';
import { getProduct } from '../../data/products';
import { getTheme } from '../../data/themes';
import { PERSONAS } from '../../data/personas';
import { hrefInsight, hrefInsights, hrefParticipant, hrefPersona, hrefProduct, hrefSignal, hrefSources } from '../../lib/links';
import { formatSource, formatDay } from '../../lib/format';
import type { Insight } from '../../types';

export function InsightDoc({ insight }: { insight: Insight }) {
  const score = scoreInsight(insight);
  const memberOf = signalsOf(insight.id);
  const related = relatedInsights(insight.id);
  const voice = voiceForInsight(insight);
  const personas = (insight.personaIds ?? [])
    .map((id) => PERSONAS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <Grid columns={{ minWidth: 320, max: 3 }} gap={5}>
      <VStack gap={4}>
        <VStack gap={2}>
          <HStack gap={2} vAlign="center">
            <SevBadge severity={insight.severity} />
            <ScoreTier breakdown={score} />
          </HStack>
          <Heading level={2} textWrap="balance">
            {insight.text}
          </Heading>
        </VStack>

        {insight.pullQuote && (
          <Blockquote cite={insight.pullQuoteSource && formatSource(insight.pullQuoteSource)}>
            {insight.pullQuote}
          </Blockquote>
        )}

        {insight.soWhat && (
          <Card variant="muted" padding={4}>
            <VStack gap={1}>
              <Text type="label" color="secondary">
                So what
              </Text>
              <Text type="body" as="p" textWrap="pretty">
                {insight.soWhat}
              </Text>
            </VStack>
          </Card>
        )}

        <MetadataList columns="multi" title="Provenance">
          <MetadataListItem label="Source">
            <Link href={hrefSources(insight.source)}>{formatSource(insight.source)}</Link>
          </MetadataListItem>
          <MetadataListItem label="Captured">{formatDay(insight.createdAt)}</MetadataListItem>
          <MetadataListItem label="Evidence class">{evidenceClass(insight)}</MetadataListItem>
          <MetadataListItem label="Confidence">{insight.confidence ?? 'unstated'}</MetadataListItem>
          <MetadataListItem label="Theme">
            <Link href={hrefInsights({ theme: insight.themeId })}>
              {getTheme(insight.themeId)?.title ?? insight.themeId}
            </Link>
          </MetadataListItem>
        </MetadataList>
      </VStack>

      <VStack gap={4}>
        {memberOf.length > 0 && (
          <VStack gap={2}>
            <Text type="label" color="secondary">
              Signals
            </Text>
            <HStack gap={1.5} wrap="wrap">
              {memberOf.map((s) => (
                <Token
                  key={s.def.id}
                  label={s.def.title}
                  href={hrefSignal(s.def.id, { insight: insight.id })}
                />
              ))}
            </HStack>
          </VStack>
        )}

        <VStack gap={2}>
          <Text type="label" color="secondary">
            Products
          </Text>
          <HStack gap={1.5} wrap="wrap">
            {insight.productIds.map((p) => (
              <Token key={p} label={getProduct(p)?.shortName ?? p} color="blue" href={hrefProduct(p)} />
            ))}
          </HStack>
        </VStack>

        {personas.length > 0 && (
          <VStack gap={2}>
            <Text type="label" color="secondary">
              Personas
            </Text>
            <HStack gap={1.5} wrap="wrap">
              {personas.map((p) => (
                <Token key={p!.id} label={p!.name} color="purple" href={hrefPersona(p!.id)} />
              ))}
            </HStack>
          </VStack>
        )}

        {voice && (
          <VStack gap={1}>
            <Text type="label" color="secondary">
              Participant
            </Text>
            <Link href={hrefParticipant(voice.id)} isStandalone>
              {voice.name} · {voice.institution}
            </Link>
          </VStack>
        )}

        {related.length > 0 && (
          <VStack gap={2}>
            <Text type="label" color="secondary">
              Related evidence
            </Text>
            <VStack gap={2}>
              {related.map((r) => (
                <Link key={r.id} href={hrefInsight(r.id)} isStandalone>
                  <Text type="supporting" maxLines={2} hasTruncateTooltip={false}>
                    {r.text}
                  </Text>
                </Link>
              ))}
            </VStack>
          </VStack>
        )}
      </VStack>
    </Grid>
  );
}
