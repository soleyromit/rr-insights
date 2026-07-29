// views/ParticipantsView.tsx — the named voices behind the corpus (v18, new).
// Dovetail's participants pattern: real people, their sentiment, and the
// evidence they contributed.
import { useNavigate } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Text } from '@astryxdesign/core/Text';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import { ProgressBar } from '@astryxdesign/core/ProgressBar';
import { PageHeader } from '../components/ui/PageHeader';
import { REAL_VOICES } from '../data/voices';
import { getProduct } from '../data/products';
import { insightsForVoice } from '../lib/selectors';
import { hrefParticipant } from '../lib/links';

const SENTIMENT_VARIANT: Record<string, 'success' | 'warning' | 'error' | 'neutral' | 'info'> = {
  positive: 'success',
  hopeful: 'info',
  neutral: 'neutral',
  frustrated: 'error',
  overwhelmed: 'warning',
};

export function ParticipantsView() {
  const navigate = useNavigate();
  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Participants"
        lede="The named people behind the evidence — every claim in this repository traces back to one of them."
        meta={`${REAL_VOICES.length} named interviewees across ${new Set(REAL_VOICES.map((v) => v.institution)).size} institutions`}
      />

      <Grid columns={{ minWidth: 300, max: 3 }} gap={4}>
        {REAL_VOICES.map((v) => {
          const contributed = insightsForVoice(v).length;
          return (
            <ClickableCard key={v.id} onClick={() => navigate(hrefParticipant(v.id))} padding={4}>
              <VStack gap={2}>
                <HStack gap={2} vAlign="center">
                  <Avatar name={v.name} size="sm" tooltip={false} />
                  <VStack gap={0}>
                    <Text type="body" weight="semibold">
                      {v.name}
                    </Text>
                    <Text type="supporting" maxLines={1}>
                      {v.title} · {v.institution}
                    </Text>
                  </VStack>
                </HStack>
                <HStack gap={2} vAlign="center" wrap="wrap">
                  <Badge variant={SENTIMENT_VARIANT[v.sentiment] ?? 'neutral'} label={v.sentiment} />
                  {contributed > 0 && <Badge label={`${contributed} insights`} />}
                  <Text type="supporting">{v.productIds.map((p) => getProduct(p)?.shortName ?? p).join(' · ')}</Text>
                </HStack>
                <ProgressBar
                  label={`Sentiment score for ${v.name}`}
                  isLabelHidden
                  value={v.sentimentScore}
                  max={100}
                  variant={v.sentimentScore >= 60 ? 'success' : v.sentimentScore >= 40 ? 'warning' : 'error'}
                />
                <Text type="supporting" as="p" maxLines={3} hasTruncateTooltip={false}>
                  “{v.quote}”
                </Text>
              </VStack>
            </ClickableCard>
          );
        })}
      </Grid>
    </VStack>
  );
}
