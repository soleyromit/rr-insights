// views/PersonasView.tsx — Persona Atlas (v19 redesign). Dual heat band: the
// hand-curated friction grid (research judgment) beside the computed
// persona × product evidence counts — the honest twin. Zero cells in the
// computed grid are coverage findings, not blanks. Persona cards became
// edge-to-edge rows with live counts and recency.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Text } from '@astryxdesign/core/Text';
import { Avatar } from '@astryxdesign/core/Avatar';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { HeatGrid } from '../components/charts/HeatGrid';
import { FeedTime } from '../components/story/EvidenceRow';
import { PERSONAS } from '../data/personas';
import { PRODUCTS } from '../data/products';
import { ALL_INSIGHTS } from '../data/insights';
import { PERSONA_PRODUCT_FRICTION } from '../data/personaFriction';
import { insightsWhere } from '../lib/selectors';
import { personaProductMatrix } from '../lib/series';
import { hrefInsights, hrefPersona } from '../lib/links';

const SEV_VALUE = { critical: 3, high: 2, medium: 1, na: 0 } as const;

export function PersonasView() {
  const computed = useMemo(
    () =>
      personaProductMatrix(
        ALL_INSIGHTS,
        PERSONAS.map((p) => p.id),
        PRODUCTS.map((p) => p.id)
      ),
    []
  );

  const personaRows = useMemo(
    () =>
      PERSONAS.map((p) => {
        const evidence = insightsWhere({ persona: p.id });
        const critical = evidence.filter((i) => i.severity === 'critical').length;
        const newest = evidence.reduce<string | undefined>(
          (m, i) => (m === undefined || i.createdAt > m ? i.createdAt : m),
          undefined
        );
        return { persona: p, n: evidence.length, critical, newest };
      }),
    []
  );

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Persona Atlas"
        lede="Who is hit by what — friction mapped per persona and product, with the evidence one click away."
        meta={`${PERSONAS.length} personas · ${PRODUCTS.length} products`}
      />

      <Grid columns={{ minWidth: 380, max: 2 }} gap={4}>
        <Fig
          title="Curated friction (research judgment)"
          caption="Hand-curated from research synthesis; the most prominent cell carries the most friction and is the next research-and-design cycle. Click a cell for its evidence."
        >
          <HeatGrid
            rows={PERSONAS.map((p) => p.name)}
            cols={PRODUCTS.map((p) => p.shortName)}
            cell={(r, c) => {
              const persona = PERSONAS[r];
              const product = PRODUCTS[c];
              const f = PERSONA_PRODUCT_FRICTION[persona.id]?.[product.id];
              const v = f ? SEV_VALUE[f.severity] : 0;
              return {
                value: v,
                label: f && f.severity !== 'na' ? f.severity : '',
                href: v > 0 ? hrefInsights({ persona: persona.id, product: product.id }) : undefined,
                title: f?.text ?? `${persona.name} × ${product.shortName}: no recorded friction`,
              };
            }}
            legend={{ low: 'no friction recorded', high: 'critical friction' }}
          />
        </Fig>

        <Fig
          title="Computed evidence: persona × product"
          n={ALL_INSIGHTS.length}
          caption="Counted live from the corpus — the honest twin of the curated grid. An empty cell is a coverage gap, not an absence of friction."
        >
          <HeatGrid
            rows={PERSONAS.map((p) => p.name)}
            cols={PRODUCTS.map((p) => p.shortName)}
            rowHref={(r) => hrefPersona(PERSONAS[r].id)}
            emptyHint="no evidence — coverage gap"
            cell={(r, c) => {
              const v = computed.counts[r][c];
              return {
                value: v,
                href: v > 0 ? hrefInsights({ persona: PERSONAS[r].id, product: PRODUCTS[c].id }) : undefined,
                title: `${PERSONAS[r].name} × ${PRODUCTS[c].shortName}: ${v} insights`,
              };
            }}
            legend={{ low: 'no evidence', high: 'evidence mass' }}
          />
        </Fig>
      </Grid>

      <List
        density="spacious"
        hasDividers
        header={
          <Text type="label" color="secondary">
            Personas — every row opens the canonical persona page
          </Text>
        }
      >
        {personaRows.map(({ persona, n, critical, newest }) => (
          <Item
            key={persona.id}
            as="li"
            href={hrefPersona(persona.id)}
            startContent={<Avatar name={persona.name} size="sm" tooltip={false} />}
            label={persona.name}
            description={`${persona.role} · priority ${persona.priority}`}
            descriptionLines={1}
            align="center"
            endContent={
              <VStack gap={0.5} hAlign="end">
                <Text type="supporting" hasTabularNumbers>
                  {n} insights · {critical} critical
                </Text>
                {newest && (
                  <HStack gap={1} vAlign="center">
                    <Text type="supporting">newest</Text>
                    <FeedTime iso={newest} />
                  </HStack>
                )}
              </VStack>
            }
          />
        ))}
      </List>
    </VStack>
  );
}
