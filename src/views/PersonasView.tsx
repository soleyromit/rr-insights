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
import { JOURNEY_STAGES } from '../data/journeys';
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

  // Journey friction: persona × workflow stage, membership via each stage's
  // theme set (curated in journeys.ts), counts computed live.
  const journey = useMemo(
    () =>
      PERSONAS.map((pe) =>
        JOURNEY_STAGES.map((st) => {
          const list = insightsWhere({ persona: pe.id }).filter((i) => st.themeIds.includes(i.themeId));
          return {
            n: list.length,
            critical: list.filter((i) => i.severity === 'critical').length,
            ids: list.map((i) => i.id),
          };
        })
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

      <Fig
        title="Journey friction — persona × workflow stage"
        n={ALL_INSIGHTS.length}
        caption="Stages are curated theme groupings (journeys.ts); counts are computed live. Read a row left-to-right as that persona's path through the platform — the hottest cell is where their journey breaks down. Cell title shows the critical count."
        note="Cross-cutting themes (AI layer, competitive, process) are excluded — they are not journey stages."
        exportData={PERSONAS.flatMap((pe, r) =>
          JOURNEY_STAGES.map((st, c) => ({
            persona: pe.name,
            stage: st.title,
            insights: journey[r][c].n,
            critical: journey[r][c].critical,
          }))
        )}
        exportName="journey-friction"
      >
        <HeatGrid
          rows={PERSONAS.map((p) => p.name)}
          cols={JOURNEY_STAGES.map((s) => s.title)}
          rowHref={(r) => hrefPersona(PERSONAS[r].id)}
          emptyHint="no evidence at this stage"
          cell={(r, c) => {
            const d = journey[r][c];
            return {
              value: d.n,
              href: d.n > 0 ? hrefInsights({ ids: d.ids }) : undefined,
              title: `${PERSONAS[r].name} × ${JOURNEY_STAGES[c].title}: ${d.n} insights, ${d.critical} critical — ${JOURNEY_STAGES[c].description}`,
            };
          }}
          legend={{ low: 'smooth stage', high: 'journey breakdown' }}
        />
      </Fig>

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
