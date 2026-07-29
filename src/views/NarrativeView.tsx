// views/NarrativeView.tsx — Connect the Dots (v18 Astryx rebuild).
// Five defended arguments. Hero ranks them by evidence mass; each argument is a
// claim, its load-bearing stats, the evidence list, and the implication +
// design response pair. Every navTarget resolves through the route registry.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { ARGUMENTS } from '../data/arguments';
import { VIEW_PATH } from '../app/routes';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';

export function NarrativeView() {
  const statCount = ARGUMENTS.reduce((n, a) => n + a.sources.length, 0);

  const heroRows = [...ARGUMENTS]
    .map((a) => ({
      key: a.id,
      label: `${a.number} · ${a.claim}`,
      value: a.evidence.length + a.sources.length,
      hint: `${a.sources.length} stats · ${a.evidence.length} evidence lines`,
      href: VIEW_PATH[a.navTarget] ?? '/',
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <VStack gap={5} padding={6} maxWidth={1080}>
      <PageHeader
        title="Connect the Dots"
        lede="Five arguments, each defensible in a leadership meeting: a claim, the numbers behind it, what it implies, and the design response already in motion."
        meta={`${ARGUMENTS.length} arguments · ${statCount} sourced statistics · NPS 2025, Granola sessions, user interviews`}
      />

      <Fig
        title="Arguments ranked by evidence mass"
        caption="Sourced stats plus evidence lines per argument. The heaviest argument is the one to lead with in the next leadership meeting; each bar links to the page that operationalizes it."
      >
        <RankedList rows={heroRows} format={(r) => `${r.value} items`} />
      </Fig>

      {ARGUMENTS.map((a) => (
        <Card key={a.id} padding={5}>
          <VStack gap={4}>
            <VStack gap={1.5}>
              <HStack gap={2} vAlign="center">
                <Text type="supporting" hasTabularNumbers>
                  {a.number}
                </Text>
                <Heading level={2} textWrap="balance">
                  {a.claim}
                </Heading>
              </HStack>
              <Text type="body" color="secondary" as="p" textWrap="pretty">
                {a.subclaim}
              </Text>
            </VStack>

            <Grid columns={{ minWidth: 200, max: 3 }} gap={4}>
              {a.sources.map((s) => (
                <VStack key={s.statLabel} gap={0.5}>
                  <Heading level={3} type="display-3">
                    {s.stat}
                  </Heading>
                  <Text type="label" color="secondary">
                    {s.statLabel} · {s.label}
                  </Text>
                  <Text type="supporting" as="p" textWrap="pretty">
                    {s.context}
                  </Text>
                </VStack>
              ))}
            </Grid>

            <VStack gap={1.5}>
              {a.evidence.map((e, i) => (
                <HStack key={i} gap={2}>
                  <Text type="supporting">·</Text>
                  <Text type="body" as="p" textWrap="pretty">
                    {e}
                  </Text>
                </HStack>
              ))}
            </VStack>

            <Grid columns={{ minWidth: 300, max: 2 }} gap={4}>
              <Card variant="muted" padding={4}>
                <VStack gap={1}>
                  <Text type="label" color="secondary">
                    Implication
                  </Text>
                  <Text type="body" as="p" textWrap="pretty">
                    {a.implication}
                  </Text>
                </VStack>
              </Card>
              <Card variant="muted" padding={4}>
                <VStack gap={1}>
                  <Text type="label" color="secondary">
                    Design response
                  </Text>
                  <Text type="body" as="p" textWrap="pretty">
                    {a.designResponse}
                  </Text>
                </VStack>
              </Card>
            </Grid>

            <Link href={VIEW_PATH[a.navTarget] ?? '/'} isStandalone>
              {a.navLabel} →
            </Link>
          </VStack>
        </Card>
      ))}
    </VStack>
  );
}
