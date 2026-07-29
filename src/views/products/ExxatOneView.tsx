// views/products/ExxatOneView.tsx — the /platform page (v18 Astryx).
// Ecosystem narrative as MetadataList, product dependency web computed from
// products.ts, revenue model and confirmed platform UX decisions. Absorbs the
// ExactOne north-star content that previously hid in the LC spec.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Token } from '@astryxdesign/core/Token';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { SpecSection } from './spec/SpecSection';
import { StoryTable } from './spec/StoryTable';
import type { StoryRow } from './spec/StoryTable';
import { PRODUCTS, getProduct } from '../../data/products';
import { hrefInsights, hrefProduct } from '../../lib/links';
import { Link } from '@astryxdesign/core/Link';

interface DepRow extends Record<string, unknown> {
  id: string;
  from: string;
  to: string;
  dependency: string;
}

const DEPS: DepRow[] = PRODUCTS.flatMap((p) =>
  p.productDependencies.map((d, i) => ({
    id: `${p.id}-${i}`,
    from: p.id,
    to: d.product,
    dependency: d.dependency,
  }))
);

const EVOLUTION = [
  { era: 'Before ExxatOne', desc: 'March 1st: all schools emailed all sites simultaneously. Sites overwhelmed; first-come-first-serve conflicts; schools competing for the same slots.' },
  { era: 'ExxatOne V1', desc: 'Sites post availability; schools apply with specific students. Control shifts from schools to clinical sites; the mass-email chaos ends.' },
  { era: 'Target state', desc: 'Uber/Airbnb-style ecosystem: placements → jobs → observerships → CME. The student platform for the entire allied healthcare career lifecycle.' },
];

const REVENUE_MAP = [
  { id: 'r1', action: 'Student accepts placement AND pays', rev: true, note: 'The only revenue-generating event' },
  { id: 'r2', action: 'Student creates account', rev: false, note: 'No revenue' },
  { id: 'r3', action: 'Student browses sites + wish lists', rev: false, note: 'No revenue — needed for discovery' },
  { id: 'r4', action: 'School signs a contract', rev: false, note: 'Platform access fee is separate' },
  { id: 'r5', action: 'Site posts availability', rev: false, note: 'No revenue — enables matching' },
  { id: 'r6', action: 'Hospital employee self-attests', rev: false, note: 'Hospital pays on their behalf — removes student friction' },
];

const DECISIONS = [
  { id: 'd1', decision: 'Payment is the primary CTA', detail: 'First element on the student dashboard when payment is due — ExactOne makes money only when the student pays. The current left-panel hierarchy buries it.', src: 'Aarti · d4c622ef' },
  { id: 'd2', decision: 'Calendar view removed', detail: 'Rotations occupy 35–40 of 150 grad-school weeks; a daily calendar has no value for sparse schedules.', src: 'Aarti · d4c622ef' },
  { id: 'd3', decision: 'Ongoing vs upcoming split', detail: 'Ongoing = already in clinic (compliant, no daily activity); upcoming = onboarding. Prism handles school activity; ExactOne handles site activity.', src: 'Aarti · d4c622ef' },
  { id: 'd4', decision: 'Placement vs Jobs = separate nav', detail: 'Placement is the mandatory clinical internship; Jobs is first employment post-graduation. They cannot merge.', src: 'Aarti · 72f8b82e' },
  { id: 'd5', decision: 'Slot request replaces the March 1 email', detail: 'Sites post availability, schools apply — eliminating 300+ PT schools mass-emailing sites every March 1.', src: 'Aarti · 72f8b82e' },
  { id: 'd6', decision: 'Employment verification as top filter', detail: 'Employees need 0–2 forms vs 20+ for non-employees; hospital pays if employed, student pays $40 if not. Ask first.', src: 'Aarti · Feb 25' },
  { id: 'd7', decision: 'Document counts, not listings', detail: 'Sites with 15+ requirements produce unmanageable lists — show "5 completed, 2 pending" instead.', src: 'Aarti · Feb 25' },
  { id: 'd8', decision: 'Tiles over dropdown navigation', detail: 'Dropdown nav feels CRM/B2B. Tiles show the next 10 upcoming rotations + "view all"; the 360° rotation view moves from reports to the main overview; dual entry: cross-rotation task view OR one rotation.', src: 'Aarti · Feb 25 (school review)' },
];

const STORIES: StoryRow[] = [
  { id: 'EO-01', who: 'Student', what: 'see payment as the first, most prominent action at login', why: 'until payment, ExactOne has generated no revenue', source: 'Aarti · Feb 25' },
  { id: 'EO-02', who: 'Student (hospital employee)', what: 'self-attest with my hospital ID so my employer pays the fee', why: 'employees need 0–2 forms vs 20+; ask employment first', source: 'Aarti · Feb 25' },
  { id: 'EO-03', who: 'Student', what: 'browse sites, filter by specialty/location, and rank a wish list', why: 'the platform shifted from school-assigned to student-expressed preferences', source: 'Aarti · Feb 25' },
  { id: 'EO-04', who: 'School Admin', what: 'triage pending actions across all 150 rotations, then drill into one', why: 'cross-rotation triage is the primary admin workflow', source: 'Aarti · Feb 25' },
  { id: 'EO-05', who: 'School Admin', what: 'bulk-remind students on compliance gaps with a recipient preview', why: 'per-student reminder emails create administrative overhead', source: 'Aarti · Feb 25' },
  { id: 'EO-06', who: 'Program Director', what: 'see student success analytics across admissions, curriculum, assessment, faculty and outcomes', why: 'move from efficiency tool to strategic partner', source: 'Day 1 Marriott · Mar 2' },
];

export function ExxatOneView() {
  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="ExxatOne — the platform"
        lede="Placement logistics before clinical work begins: the marketplace layer adjacent to Prism, and the ecosystem every product page depends on."
        meta="Sources: Aarti student + school design reviews (Feb 25), Day 1–2 Marriott (Mar 2–3)"
      />

      <Blockquote cite="Aarti · ExxatOne Student + School · Feb 25 · sessions d4c622ef + 72f8b82e">
        We are creating the concept of an allied health care student — just like Airbnb created the concept of a traveler.
      </Blockquote>

      <SpecSection title="Business context" sub="The numbers Romit designs within — Day 1 Marriott (Mar 2) + Aarti reviews.">
        <MetadataList columns="multi" title="Platform facts">
          <MetadataListItem label="Revenue trigger">One action: student pays for an accepted placement. Nothing else generates revenue.</MetadataListItem>
          <MetadataListItem label="PA market penetration">51% — 105 of ~300 PA programs; the rest blocked by semester registration, multi-site tracking, competency visualization</MetadataListItem>
          <MetadataListItem label="Demo close rate">40% — 4 of 10 demos close</MetadataListItem>
          <MetadataListItem label="Jobs module launch">Apr 15 — post-graduation employment, licensed students only</MetadataListItem>
          <MetadataListItem label="KKR thesis">TAM $300M → $1B; Rule of 40 target 50–60; clinical education consolidates to 1–3 players and Exxat must be one</MetadataListItem>
          <MetadataListItem label="Incumbent weakness">ExamSoft NPS 1/5, sold by Turnitin, publicly anti-AI — the displacement window is open</MetadataListItem>
        </MetadataList>
        <Grid columns={{ minWidth: 260, max: 3 }} gap={3}>
          {EVOLUTION.map((e) => (
            <Card key={e.era} variant="muted" padding={3}>
              <VStack gap={1}>
                <Text type="body" weight="semibold">
                  {e.era}
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  {e.desc}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </SpecSection>

      <SpecSection
        title="Product dependency web"
        sub="Computed from each product's declared dependencies in the registry — every row links to both product hubs."
      >
        <Table<DepRow>
          data={DEPS}
          idKey="id"
          density="compact"
          hasHover
          columns={[
            {
              key: 'from',
              header: 'Product',
              width: pixel(130),
              renderCell: (r) => <Token label={getProduct(r.from)?.shortName ?? r.from} href={hrefProduct(r.from)} color="blue" />,
            },
            {
              key: 'to',
              header: 'Depends on',
              width: pixel(130),
              renderCell: (r) => <Token label={getProduct(r.to)?.shortName ?? r.to} href={hrefProduct(r.to)} />,
            },
            {
              key: 'dependency',
              header: 'Dependency',
              width: proportional(4),
              renderCell: (r) => (
                <Text type="supporting" as="p" textWrap="pretty">
                  {r.dependency}
                </Text>
              ),
            },
          ]}
        />
      </SpecSection>

      <SpecSection title="Revenue map" sub="What generates revenue vs what does not — this asymmetry shapes every design priority.">
        <Card padding={4}>
          <VStack gap={1.5}>
            {REVENUE_MAP.map((r) => (
              <HStack key={r.id} gap={2} vAlign="center" wrap="wrap">
                <Badge variant={r.rev ? 'success' : 'neutral'} label={r.rev ? 'revenue' : 'free'} />
                <Text type="body" weight={r.rev ? 'semibold' : undefined}>
                  {r.action}
                </Text>
                <Text type="supporting">{r.note}</Text>
              </HStack>
            ))}
          </VStack>
        </Card>
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Ecosystem expansion: Placements (live) → Jobs module (Apr 15) → Observerships/shadowships (future) →
            CME (2027, "coming soon" tab under consideration). Student phases: pre-placement is P0 (pay, upload compliance,
            onboard — must complete before entering a facility); during-placement activity stays in Prism; offboarding usage
            is very low and may merge into during-placement.
          </Text>
        </Card>
      </SpecSection>

      <SpecSection title="Confirmed platform UX decisions" sub="Validated by Aarti in the Feb 25 design reviews.">
        <Table<Record<string, unknown> & (typeof DECISIONS)[number]>
          data={DECISIONS}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'decision', header: 'Decision', width: pixel(240), renderCell: (r) => <Text type="body" weight="semibold">{r.decision}</Text> },
            { key: 'detail', header: 'Detail', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.detail}</Text> },
            { key: 'src', header: 'Source', width: pixel(180), renderCell: (r) => <Text type="supporting">{r.src}</Text> },
          ]}
        />
      </SpecSection>

      <SpecSection title="Platform user stories" sub="From the Aarti design reviews and Day 2 Marriott.">
        <StoryTable rows={STORIES} />
      </SpecSection>

      <HStack gap={4} wrap="wrap">
        <Link href={hrefInsights({ q: 'ExxatOne' })} isStandalone>
          Platform evidence in the corpus →
        </Link>
        {PRODUCTS.map((p) => (
          <Link key={p.id} href={hrefProduct(p.id)} isStandalone>
            {p.shortName} hub →
          </Link>
        ))}
      </HStack>
    </VStack>
  );
}
