// views/ParticipantDetailView.tsx — one participant's profile (v19 redesign).
// Opens with an honest mini-profile band (severity mix of their traced
// contributions, annotated as text-matched, beside their sentiment tile);
// contributions render as a newest-first FindingsFeed with no silent cutoff;
// a forward-journey footer links persona, product hubs, and the session query.
import { useParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Text } from '@astryxdesign/core/Text';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { SeverityStackChart } from '../components/charts/SeverityStackChart';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { FindingsFeed } from '../components/story/FindingsFeed';
import { QueryLink } from '../components/story/QueryLink';
import { REAL_VOICES } from '../data/voices';
import { getProduct } from '../data/products';
import { PERSONAS } from '../data/personas';
import { insightsForVoice, insightsWhere } from '../lib/selectors';
import { severityMix } from '../lib/series';
import { hrefInsights, hrefParticipants, hrefPersona, hrefProduct } from '../lib/links';

export function ParticipantDetailView() {
  const { voiceId } = useParams();
  const voice = REAL_VOICES.find((v) => v.id === voiceId);
  if (!voice) {
    return <EmptyState title="Participant not found" description={`No participant "${voiceId}".`} />;
  }

  const contributed = insightsForVoice(voice);
  const persona = PERSONAS.find((p) => p.id === voice.personaRole);
  const personaCount = persona ? insightsWhere({ persona: persona.id }).length : 0;
  const sessionLabel = voice.granolaMeetingLabel;
  const sessionCount = sessionLabel ? insightsWhere({ source: sessionLabel }).length : 0;

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
            meta={voice.granolaMeetingLabel}
          />
        </HStack>
      </VStack>

      <Fig
        title="Contribution profile"
        n={contributed.length}
        note="Contributions are matched by source-text, not IDs — treat these counts as a careful approximation."
      >
        <HStack gap={5} vAlign="center" wrap="wrap">
          <StatTileRow>
            <StatTile value={`${voice.sentimentScore}/100`} label={`sentiment · ${voice.sentiment}`} />
            <StatTile value={contributed.length} label="insights traced" />
          </StatTileRow>
          {contributed.length > 0 && (
            <VStack width={360}>
              <SeverityStackChart data={[{ category: voice.name, ...severityMix(contributed) }]} height={120} />
            </VStack>
          )}
        </HStack>
      </Fig>

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
          <FindingsFeed
            insights={contributed}
            from={`participants/${voice.id}`}
            limit={contributed.length}
            header={
              <Text type="label" color="secondary">
                Insights traced to this participant ({contributed.length}), newest first
              </Text>
            }
            emptyLabel="No corpus insights are text-matched to this participant yet; their evidence lives in the session notes."
          />
        </VStack>
      </Grid>

      <VStack gap={2}>
        <Text type="label" color="secondary">
          Where this voice leads
        </Text>
        <HStack gap={4} vAlign="center" wrap="wrap">
          {persona && (
            <QueryLink
              href={hrefPersona(persona.id)}
              count={personaCount}
              label={`insights · ${persona.name} persona`}
            />
          )}
          {voice.productIds.map((p) => (
            <QueryLink
              key={p}
              href={hrefProduct(p)}
              count={contributed.filter((i) => (i.productIds as string[]).includes(p)).length}
              label={`contributed · ${getProduct(p)?.shortName ?? p} hub`}
            />
          ))}
          {sessionLabel && (
            <QueryLink
              href={hrefInsights({ source: sessionLabel })}
              count={sessionCount}
              label="insights from this session"
            />
          )}
        </HStack>
      </VStack>
    </VStack>
  );
}
