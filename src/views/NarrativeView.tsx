// views/NarrativeView.tsx — Connect the Dots (v19 redesign).
// Five defended arguments. The hero is an argument index — number, claim, lead
// stat, and a claim-carrying QueryLink into the page that operationalizes it.
// Each argument card: StatTile row from its sources, evidence lines, an
// implication/response MetadataList, and a LIVE corpus-backing query so the
// argument's evidence base is one click away and its size is stated inline.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { ARGUMENTS } from '../data/arguments';
import { VIEW_PATH } from '../app/routes';
import { PageHeader } from '../components/ui/PageHeader';
import { QueryLink } from '../components/story/QueryLink';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { insightsWhere } from '../lib/selectors';
import { hrefInsights } from '../lib/links';
import type { InsightFilter } from '../lib/links';

// Live corpus backing per argument — each claim maps to the filter that best
// approximates its evidence base. Counts are computed, never declared; a
// zero-result filter renders no link rather than a dead one.
const ARG_BACKING: Record<string, { filter: InsightFilter; label: string }> = {
  'arg-01': { filter: { persona: 'student' }, label: 'student-tagged insights in the corpus back this claim' },
  'arg-02': { filter: { persona: 'dce' }, label: 'faculty/DCE-tagged insights in the corpus back this claim' },
  'arg-03': { filter: { product: 'exam-management', q: 'ExamSoft' }, label: 'exam insights referencing ExamSoft back this claim' },
  'arg-04': { filter: { product: 'course-eval' }, label: 'course-eval insights in the corpus back this claim' },
  'arg-05': { filter: { q: 'navigation' }, label: 'insights mentioning navigation back this claim' },
};

export function NarrativeView() {
  const statCount = ARGUMENTS.reduce((n, a) => n + a.sources.length, 0);

  return (
    <VStack gap={5} padding={6} maxWidth={1080}>
      <PageHeader
        title="Connect the Dots"
        lede="Five arguments, each defensible in a leadership meeting: a claim, the numbers behind it, what it implies, and the design response already in motion."
        meta={`${ARGUMENTS.length} arguments · ${statCount} sourced statistics · NPS 2025, Granola sessions, user interviews`}
      />

      <Card padding={4}>
        <List
          density="spacious"
          hasDividers
          header={
            <Text type="label" color="secondary">
              The argument index — each row opens the page that operationalizes the claim
            </Text>
          }
        >
          {ARGUMENTS.map((a) => (
            <Item
              key={a.id}
              as="li"
              align="start"
              marker={
                <Text type="supporting" hasTabularNumbers>
                  {a.number}
                </Text>
              }
              label={a.claim}
              labelLines={2}
              description={`Lead stat: ${a.sources[0].stat} — ${a.sources[0].statLabel}`}
              endContent={
                <QueryLink
                  href={VIEW_PATH[a.navTarget] ?? '/'}
                  count={`Argument ${a.number}`}
                  label={`· ${a.navLabel}`}
                />
              }
            />
          ))}
        </List>
      </Card>

      {ARGUMENTS.map((a) => {
        const backing = ARG_BACKING[a.id];
        const backingCount = backing ? insightsWhere(backing.filter).length : 0;
        return (
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

              <StatTileRow>
                {a.sources.map((s) => (
                  <StatTile
                    key={s.statLabel}
                    value={s.stat}
                    label={s.statLabel}
                    hint={`${s.label}. ${s.context}`}
                  />
                ))}
              </StatTileRow>

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

              <MetadataList columns="multi">
                <MetadataListItem label="Implication">
                  <Text type="body" as="p" textWrap="pretty">
                    {a.implication}
                  </Text>
                </MetadataListItem>
                <MetadataListItem label="Design response">
                  <Text type="body" as="p" textWrap="pretty">
                    {a.designResponse}
                  </Text>
                </MetadataListItem>
              </MetadataList>

              <HStack gap={4} vAlign="center" wrap="wrap">
                <QueryLink
                  href={VIEW_PATH[a.navTarget] ?? '/'}
                  count={`Argument ${a.number}`}
                  label={`· ${a.navLabel}`}
                />
                {backing && backingCount > 0 && (
                  <QueryLink
                    href={hrefInsights(backing.filter)}
                    count={backingCount}
                    label={backing.label}
                  />
                )}
              </HStack>
            </VStack>
          </Card>
        );
      })}
    </VStack>
  );
}
