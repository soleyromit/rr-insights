// views/PersonaDetailView.tsx — one persona's canonical page (v19 redesign).
// The degenerate 1-row heat grid became a per-product severity-mix chart; the
// named voices are Citation rows whose profile links carry traced-insight
// counts; the evidence rail is the shared EvidenceList with a newest/score
// toggle.
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Link } from '@astryxdesign/core/Link';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { SeverityStackChart } from '../components/charts/SeverityStackChart';
import { QuoteRow } from '../components/story/QuoteRow';
import { QueryLink } from '../components/story/QueryLink';
import { EvidenceList } from '../components/story/EvidenceRow';
import { PERSONAS } from '../data/personas';
import { PRODUCTS } from '../data/products';
import { REAL_VOICES } from '../data/voices';
import { insightsWhere, insightsForVoice } from '../lib/selectors';
import { severityMix } from '../lib/series';
import { hrefInsights, hrefParticipant, hrefPersonas } from '../lib/links';

const VOICE_ROLE: Record<string, string> = {
  student: 'student',
  dce: 'dce',
  scce: 'scce',
  'program-director': 'program-director',
};

export function PersonaDetailView() {
  const { personaId } = useParams();
  const [order, setOrder] = useState<'score' | 'newest'>('score');
  const persona = PERSONAS.find((p) => p.id === personaId);
  if (!persona) {
    return <EmptyState title="Persona not found" description={`No persona "${personaId}".`} />;
  }

  const evidence = insightsWhere({ persona: persona.id });
  const voices = REAL_VOICES.filter((v) => v.personaRole === VOICE_ROLE[persona.id]);

  const sevByProduct = PRODUCTS.map((p) => ({
    category: p.shortName,
    ...severityMix(insightsWhere({ persona: persona.id, product: p.id })),
  }));

  return (
    <VStack gap={5} padding={6}>
      <VStack gap={2}>
        <Link href={hrefPersonas()} isStandalone>
          ← Persona Atlas
        </Link>
        <HStack gap={3} vAlign="center">
          <Avatar name={persona.name} size="lg" tooltip={false} />
          <PageHeader title={persona.name} lede={persona.povStatement} meta={`${persona.role} · priority ${persona.priority} · ${evidence.length} insights`} />
        </HStack>
      </VStack>

      <Fig
        title="Severity mix across products"
        n={evidence.length}
        caption="This persona's evidence per product, computed from the corpus and stacked by severity — the tallest critical segment is the sharpest friction."
        link={{
          href: hrefInsights({ persona: persona.id }),
          count: evidence.length,
          label: 'insights for this persona, full query',
        }}
      >
        <SeverityStackChart data={sevByProduct} height={220} />
      </Fig>

      <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
        <VStack gap={4}>
          <MetadataList columns="single" title="A great day / a poor day">
            <MetadataListItem label="Great day">{persona.greatDay}</MetadataListItem>
            <MetadataListItem label="Poor day">{persona.poorDay}</MetadataListItem>
            <MetadataListItem label="Current tools">{persona.currentTools.join(', ')}</MetadataListItem>
          </MetadataList>

          <Collapsible
            defaultIsOpen={false}
            trigger={
              <Text type="label" color="secondary">
                Empathy map ({persona.empathyMap.thinks.length + persona.empathyMap.feels.length + persona.empathyMap.says.length + persona.empathyMap.does.length} entries)
              </Text>
            }
          >
            <Grid columns={{ minWidth: 200, max: 2 }} gap={3}>
              {(['thinks', 'feels', 'says', 'does'] as const).map((k) => (
                <Card key={k} variant="muted" padding={3}>
                  <VStack gap={1}>
                    <Text type="label" color="secondary">
                      {k}
                    </Text>
                    {persona.empathyMap[k].map((line, idx) => (
                      <Text key={idx} type="supporting" as="p">
                        {line}
                      </Text>
                    ))}
                  </VStack>
                </Card>
              ))}
            </Grid>
          </Collapsible>

          {voices.length > 0 && (
            <VStack gap={4}>
              <Text type="label" color="secondary">
                Named voices
              </Text>
              {voices.map((v, i) => (
                <QuoteRow
                  key={v.id}
                  quote={v.quote}
                  speaker={`${v.name} · ${v.institution}`}
                  number={i + 1}
                  footer={
                    <QueryLink
                      href={hrefParticipant(v.id)}
                      count={insightsForVoice(v).length}
                      label={`insights traced · ${v.name}'s profile`}
                    />
                  }
                />
              ))}
            </VStack>
          )}
        </VStack>

        <VStack gap={3}>
          <HStack hAlign="between" vAlign="center" wrap="wrap" gap={3}>
            <Text type="label" color="secondary">
              Evidence rail
            </Text>
            <HStack gap={3} vAlign="center">
              <SegmentedControl label="Order evidence" value={order} onChange={(v) => setOrder(v as 'score' | 'newest')} size="sm">
                <SegmentedControlItem value="score" label="by score" />
                <SegmentedControlItem value="newest" label="newest" />
              </SegmentedControl>
              <QueryLink href={hrefInsights({ persona: persona.id })} count={evidence.length} label="in the index" />
            </HStack>
          </HStack>
          <EvidenceList insights={evidence} from={`personas/${persona.id}`} limit={6} order={order} />
        </VStack>
      </Grid>
    </VStack>
  );
}
