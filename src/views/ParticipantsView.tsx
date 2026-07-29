// views/ParticipantsView.tsx — the named voices behind the corpus (v19
// redesign). Sentiment is a diverging bar chart around the neutral midpoint
// (diverging palette, not status colors — the old per-card ProgressBar misused
// success/warning/error); the roster is edge-to-edge rows whose traced-insight
// counts are the doors into each profile.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Text } from '@astryxdesign/core/Text';
import { Avatar } from '@astryxdesign/core/Avatar';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { DivergingBarChart } from '../components/charts/DivergingBarChart';
import { QueryLink } from '../components/story/QueryLink';
import { REAL_VOICES } from '../data/voices';
import { getProduct } from '../data/products';
import { insightsForVoice } from '../lib/selectors';
import { hrefParticipant } from '../lib/links';

export function ParticipantsView() {
  const sentimentData = useMemo(
    () =>
      [...REAL_VOICES]
        .sort((a, b) => b.sentimentScore - a.sentimentScore)
        .map((v) => ({ label: v.name, value: v.sentimentScore })),
    []
  );
  const roster = useMemo(
    () => REAL_VOICES.map((v) => ({ voice: v, contributed: insightsForVoice(v).length })),
    []
  );

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Participants"
        lede="The named people behind the evidence — every claim in this repository traces back to one of them."
        meta={`${REAL_VOICES.length} named interviewees across ${new Set(REAL_VOICES.map((v) => v.institution)).size} institutions`}
      />

      <Fig
        title="Sentiment by participant"
        n={REAL_VOICES.length}
        note="Sentiment scored 0–100 during synthesis; 50 is the neutral midpoint. Editorial judgment, not a survey measurement."
      >
        <DivergingBarChart
          data={sentimentData}
          midpoint={50}
          height={240}
          poles={{ positive: 'positive sentiment', negative: 'negative sentiment' }}
        />
      </Fig>

      <List
        density="spacious"
        hasDividers
        header={
          <Text type="label" color="secondary">
            Roster — every row opens the participant profile
          </Text>
        }
      >
        {roster.map(({ voice: v, contributed }) => (
          <Item
            key={v.id}
            as="li"
            href={hrefParticipant(v.id)}
            startContent={<Avatar name={v.name} size="sm" tooltip={false} />}
            label={v.name}
            description={`${v.title} · ${v.institution} — ${v.productIds.map((p) => getProduct(p)?.shortName ?? p).join(' · ')}`}
            descriptionLines={1}
            align="center"
            endContent={
              <VStack gap={0.5} hAlign="end">
                <QueryLink href={hrefParticipant(v.id)} count={contributed} label="insights traced" />
                <Text type="supporting">
                  {v.sentiment} · {v.sentimentScore}/100
                </Text>
              </VStack>
            }
          />
        ))}
      </List>
    </VStack>
  );
}
