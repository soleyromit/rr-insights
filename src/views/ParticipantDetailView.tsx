// views/ParticipantDetailView.tsx — one participant's profile (v18, new).
// The human source: context, frictions, workarounds, wish list, and the
// insights they contributed.
import { useParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { PageHeader } from '../components/ui/PageHeader';
import { SevDot } from '../components/ui/sev';
import { REAL_VOICES } from '../data/voices';
import { getProduct } from '../data/products';
import { insightsForVoice } from '../lib/selectors';
import { hrefInsight, hrefParticipants } from '../lib/links';

export function ParticipantDetailView() {
  const { voiceId } = useParams();
  const voice = REAL_VOICES.find((v) => v.id === voiceId);
  if (!voice) {
    return <EmptyState title="Participant not found" description={`No participant "${voiceId}".`} />;
  }

  const contributed = insightsForVoice(voice);

  return (
    <VStack gap={5} padding={6}>
      <VStack gap={2}>
        <Link href={hrefParticipants()} isStandalone>
          ← All participants
        </Link>
        <HStack gap={3} vAlign="center">
          <Avatar name={voice.name} size="lg" tooltip={false} />
          <PageHeader
            title={voice.name}
            lede={`${voice.title}, ${voice.institution}`}
            meta={`${voice.granolaMeetingLabel} · sentiment: ${voice.sentiment} (${voice.sentimentScore}/100)`}
          />
        </HStack>
      </VStack>

      <Blockquote cite={voice.context}>{voice.quote}</Blockquote>

      <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
        <VStack gap={4}>
          <MetadataList columns="single" title="Field notes">
            <MetadataListItem label="Frictions">
              <VStack gap={1}>
                {voice.frictions.map((f, i) => (
                  <Text key={i} type="supporting" as="p">
                    {f}
                  </Text>
                ))}
              </VStack>
            </MetadataListItem>
            <MetadataListItem label="Workarounds">
              <VStack gap={1}>
                {voice.workarounds.map((w, i) => (
                  <Text key={i} type="supporting" as="p">
                    {w}
                  </Text>
                ))}
              </VStack>
            </MetadataListItem>
            <MetadataListItem label="Wish list">
              <VStack gap={1}>
                {voice.wishList.map((w, i) => (
                  <Text key={i} type="supporting" as="p">
                    {w}
                  </Text>
                ))}
              </VStack>
            </MetadataListItem>
            <MetadataListItem label="Products">
              <HStack gap={1.5} wrap="wrap">
                {voice.productIds.map((p) => (
                  <Badge key={p} label={getProduct(p)?.shortName ?? p} />
                ))}
              </HStack>
            </MetadataListItem>
          </MetadataList>
        </VStack>

        <VStack gap={3}>
          <Text type="label" color="secondary">
            Insights traced to this participant ({contributed.length})
          </Text>
          {contributed.length === 0 && (
            <Text type="supporting" as="p">
              No corpus insights are text-matched to this participant yet; their evidence lives in the session notes above.
            </Text>
          )}
          {contributed.slice(0, 8).map((i) => (
            <Card key={i.id} padding={3}>
              <VStack gap={1}>
                <HStack gap={2} vAlign="center">
                  <SevDot severity={i.severity} />
                  <Text type="supporting">{i.createdAt}</Text>
                </HStack>
                <Link href={hrefInsight(i.id, `participants/${voice.id}`)}>
                  <Text type="body" maxLines={3} hasTruncateTooltip={false}>
                    {i.text}
                  </Text>
                </Link>
              </VStack>
            </Card>
          ))}
        </VStack>
      </Grid>
    </VStack>
  );
}
