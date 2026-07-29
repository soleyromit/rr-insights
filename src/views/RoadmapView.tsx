// views/RoadmapView.tsx — Roadmap (v18 Astryx rebuild). Countdown to the
// immovable dates, then a per-product DOM timeline with a today marker.
// Every milestone links to its product hub and every product row exposes its
// blocking criticals as a query — the roadmap is no longer a dead end.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Badge } from '@astryxdesign/core/Badge';
import { Token } from '@astryxdesign/core/Token';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { MILESTONES } from '../data/personas';
import { PRODUCTS } from '../data/products';
import { parsePhaseDate, computePhaseStates } from '../lib/phaseDates';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { hrefProduct, hrefInsights } from '../lib/links';

interface Row {
  date: Date;
  label: string;
  description: string;
  hard: boolean;
  productId?: string;
  passed: boolean;
}

const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export function RoadmapView() {
  const today = useMemo(() => new Date(), []);

  const rows: Row[] = useMemo(
    () =>
      MILESTONES.flatMap((m) => {
        const date = parsePhaseDate(m.date);
        if (!date) return [];
        return [{ date, label: m.label, description: m.description, hard: !!m.isHardDeadline, productId: m.productId, passed: date < today }];
      }).sort((a, b) => a.date.getTime() - b.date.getTime()),
    [today]
  );

  const upcoming = rows.filter((r) => !r.passed);
  const nextHard = upcoming.filter((r) => r.hard).slice(0, 3);
  const daysLeft = (d: Date) => Math.max(0, Math.round((d.getTime() - today.getTime()) / 86400000));

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Roadmap"
        lede="Every milestone on one calendar, product by product, with the hard deadlines that do not move — past dates render as passed, the countdown only counts what is ahead."
        meta={`${rows.length} dated milestones · ${upcoming.length} ahead · today is ${fmt(today)}`}
      />

      <Grid columns={{ minWidth: 240, max: 3 }} gap={4}>
        {nextHard.map((m) => (
          <Card key={m.label} padding={4}>
            <VStack gap={1}>
              <HStack gap={2} vAlign="end">
                <Heading level={2} type="display-2">
                  {daysLeft(m.date)}
                </Heading>
                <Text type="label" color="secondary">
                  days
                </Text>
              </HStack>
              <Text type="body" weight="semibold">
                {m.label}
              </Text>
              <Text type="supporting">{fmt(m.date)}</Text>
              {m.productId && (
                <Link href={hrefProduct(m.productId)} isStandalone>
                  Product hub →
                </Link>
              )}
            </VStack>
          </Card>
        ))}
      </Grid>

      <Fig
        title="Milestone timeline by product"
        caption="Milestones ordered by date per product; the today marker splits passed from ahead. Hard deadlines carry the red dot — the distance from today to the next one is the real sprint budget, everything else flexes around it."
      >
        <VStack gap={5}>
          {PRODUCTS.map((p) => {
            const items = rows.filter((r) => r.productId === p.id);
            const firstFuture = items.findIndex((r) => !r.passed);
            return (
              <VStack key={p.id} gap={2}>
                <HStack gap={3} vAlign="center" hAlign="between">
                  <Link href={hrefProduct(p.id)} isStandalone>
                    {p.name}
                  </Link>
                  <Link href={hrefInsights({ product: p.id, severity: 'critical' })}>
                    {p.criticalGaps} blocking criticals →
                  </Link>
                </HStack>
                {items.length === 0 ? (
                  <Text type="supporting">No dated milestones on the current plan.</Text>
                ) : (
                  <HStack gap={3} wrap="wrap" vAlign="center">
                    {items.map((m, i) => (
                      <HStack key={m.label} gap={3} vAlign="center">
                        {i === firstFuture && <StatusDot variant="accent" label="today" />}
                        <Card variant={m.passed ? 'muted' : 'default'} padding={3}>
                          <VStack gap={1} maxWidth={260}>
                            <HStack gap={2} vAlign="center">
                              <Text type="supporting" hasTabularNumbers>
                                {fmt(m.date)}
                              </Text>
                              {m.hard && <StatusDot variant="error" label="hard deadline" tooltip="Hard deadline — does not move" />}
                              {m.hard && <Badge variant="error" label="hard" />}
                              {m.passed && <Badge variant="neutral" label="passed" />}
                            </HStack>
                            <Link href={hrefProduct(p.id)}>
                              <Text type="body" weight="semibold">
                                {m.label}
                              </Text>
                            </Link>
                            <Text type="supporting" as="p" maxLines={2} hasTruncateTooltip textWrap="pretty">
                              {m.description}
                            </Text>
                          </VStack>
                        </Card>
                      </HStack>
                    ))}
                    {firstFuture === -1 && <StatusDot variant="accent" label="today" />}
                  </HStack>
                )}
              </VStack>
            );
          })}
        </VStack>
      </Fig>

      <Card padding={4}>
        <VStack gap={3}>
          <VStack gap={0}>
            <Text type="label" color="secondary">
              Phase tracks — state derived from dates in the plan
            </Text>
            <Text type="supporting">
              Passed phases are marked done, the filled phase is the next dated one, phases without a parseable date claim no state.
            </Text>
          </VStack>
          {PRODUCTS.map((p) => {
            const states = computePhaseStates(p.roadmapPhases.map((ph) => ph.phase), today);
            return (
              <HStack key={p.id} gap={3} vAlign="center" wrap="wrap">
                <Link href={hrefProduct(p.id)}>
                  <Text type="supporting">{p.shortName}</Text>
                </Link>
                {p.roadmapPhases.map((ph, i) => {
                  const st = states[i].state;
                  return (
                    <Token
                      key={ph.phase}
                      label={st === 'passed' ? `✓ ${ph.phase}` : st === 'unscheduled' ? `${ph.phase} ·?` : ph.phase}
                      color={st === 'next' ? 'blue' : 'default'}
                      href={hrefProduct(p.id)}
                    />
                  );
                })}
              </HStack>
            );
          })}
        </VStack>
      </Card>
    </VStack>
  );
}
