// views/PersonasView.tsx — Persona Atlas (v18 Astryx rebuild). Hero: the
// persona × product friction heat matrix, every cell a filtered query. Cards
// open per-persona detail pages (new canonical routes).
import { useNavigate } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Text } from '@astryxdesign/core/Text';
import { Avatar } from '@astryxdesign/core/Avatar';
import { Badge } from '@astryxdesign/core/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { HeatGrid } from '../components/charts/HeatGrid';
import { PERSONAS } from '../data/personas';
import { PRODUCTS } from '../data/products';
import { PERSONA_PRODUCT_FRICTION } from '../data/personaFriction';
import { insightsWhere } from '../lib/selectors';
import { hrefInsights, hrefPersona } from '../lib/links';

const SEV_VALUE = { critical: 3, high: 2, medium: 1, na: 0 } as const;

export function PersonasView() {
  const navigate = useNavigate();

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Persona Atlas"
        lede="Who is hit by what — friction mapped per persona and product, with the evidence one click away."
        meta={`${PERSONAS.length} personas · ${PRODUCTS.length} products`}
      />

      <Fig
        title="Friction heat: persona × product"
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

      <Grid columns={{ minWidth: 260, max: 4 }} gap={4}>
        {PERSONAS.map((p) => {
          const evidence = insightsWhere({ persona: p.id });
          const critical = evidence.filter((i) => i.severity === 'critical').length;
          return (
            <ClickableCard key={p.id} onClick={() => navigate(hrefPersona(p.id))} padding={4}>
              <VStack gap={2}>
                <HStack gap={2} vAlign="center">
                  <Avatar name={p.name} size="sm" tooltip={false} />
                  <VStack gap={0}>
                    <Text type="body" weight="semibold">
                      {p.name}
                    </Text>
                    <Text type="supporting" maxLines={1}>
                      {p.role}
                    </Text>
                  </VStack>
                </HStack>
                <HStack gap={2} vAlign="center">
                  <Badge label={`${evidence.length} insights`} />
                  <Badge variant={critical > 0 ? 'error' : 'neutral'} label={`${critical} critical`} />
                  <Badge variant={p.priority === 'very-high' ? 'warning' : 'neutral'} label={p.priority} />
                </HStack>
                <Text type="supporting" as="p" maxLines={3} hasTruncateTooltip={false}>
                  {p.povStatement}
                </Text>
              </VStack>
            </ClickableCard>
          );
        })}
      </Grid>
    </VStack>
  );
}
