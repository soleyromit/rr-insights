// views/PersonaDetailView.tsx — one persona's canonical page (v18, new route).
// POV, day split, collapsed empathy map (the biggest content cut of the
// redesign), friction row across products, and a score-ranked evidence rail.
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
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { HeatGrid } from '../components/charts/HeatGrid';
import { SevDot } from '../components/ui/sev';
import { PERSONAS } from '../data/personas';
import { PRODUCTS } from '../data/products';
import { PERSONA_PRODUCT_FRICTION } from '../data/personaFriction';
import { REAL_VOICES } from '../data/voices';
import { insightsWhere } from '../lib/selectors';
import { hrefInsight, hrefInsights, hrefParticipant, hrefPersonas } from '../lib/links';

const SEV_VALUE = { critical: 3, high: 2, medium: 1, na: 0 } as const;
const VOICE_ROLE: Record<string, string> = {
  student: 'student',
  dce: 'dce',
  scce: 'scce',
  'program-director': 'program-director',
};

export function PersonaDetailView() {
  const { personaId } = useParams();
  const persona = PERSONAS.find((p) => p.id === personaId);
  if (!persona) {
    return <EmptyState title="Persona not found" description={`No persona "${personaId}".`} />;
  }

  const evidence = insightsWhere({ persona: persona.id });
  const top = evidence.slice(0, 6);
  const voices = REAL_VOICES.filter((v) => v.personaRole === VOICE_ROLE[persona.id]);

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
        title="Friction across products"
        caption="This persona's row from the atlas — the most prominent cell is the most severe. Click a cell for the evidence."
      >
        <HeatGrid
          rows={[persona.name]}
          cols={PRODUCTS.map((p) => p.shortName)}
          cell={(_r, c) => {
            const f = PERSONA_PRODUCT_FRICTION[persona.id]?.[PRODUCTS[c].id];
            const v = f ? SEV_VALUE[f.severity] : 0;
            return {
              value: v,
              label: f && f.severity !== 'na' ? f.severity : '',
              href: v > 0 ? hrefInsights({ persona: persona.id, product: PRODUCTS[c].id }) : undefined,
              title: f?.text,
            };
          }}
        />
      </Fig>

      <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
        <VStack gap={4}>
          <MetadataList columns="single" title="A great day / a poor day">
            <MetadataListItem label="Great day">{persona.greatDay}</MetadataListItem>
            <MetadataListItem label="Poor day">{persona.poorDay}</MetadataListItem>
            <MetadataListItem label="Current tools">{persona.currentTools.join(', ')}</MetadataListItem>
          </MetadataList>

          <Collapsible label={`Empathy map (${persona.empathyMap.thinks.length + persona.empathyMap.feels.length + persona.empathyMap.says.length + persona.empathyMap.does.length} entries)`}>
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
            <VStack gap={3}>
              <Text type="label" color="secondary">
                Named voices
              </Text>
              {voices.map((v) => (
                <Card key={v.id} padding={3}>
                  <VStack gap={2}>
                    <Blockquote cite={`${v.name} · ${v.institution}`}>{v.quote}</Blockquote>
                    <Link href={hrefParticipant(v.id)}>Participant profile →</Link>
                  </VStack>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>

        <VStack gap={3}>
          <HStack hAlign="between" vAlign="center">
            <Text type="label" color="secondary">
              Top evidence, score-ranked
            </Text>
            <Link href={hrefInsights({ persona: persona.id })}>All {evidence.length} →</Link>
          </HStack>
          {top.map((i) => (
            <Card key={i.id} padding={3}>
              <VStack gap={1}>
                <HStack gap={2} vAlign="center">
                  <SevDot severity={i.severity} />
                  <Text type="supporting">{i.createdAt}</Text>
                </HStack>
                <Link href={hrefInsight(i.id, `personas/${persona.id}`)}>
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
