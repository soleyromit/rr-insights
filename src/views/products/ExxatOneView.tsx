// views/products/ExxatOneView.tsx — the /platform page (v19). Platform has no
// productId, so the header stays a plain PageHeader whose facts are computed
// from the honest non-zero query (tag:'platform' — 16 insights; q:'ExxatOne'
// matches only 10). Orienting = the 5×5 dependency HeatGrid computed from
// PRODUCTS[].productDependencies; every hub link carries its live count.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Token } from '@astryxdesign/core/Token';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Fig } from '../../components/charts/Fig';
import { HeatGrid } from '../../components/charts/HeatGrid';
import { QueryLink } from '../../components/story/QueryLink';
import { SpecSection } from './spec/SpecSection';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { StoryTable } from './spec/StoryTable';
import type { StoryRow } from './spec/StoryTable';
import { PRODUCTS, getProduct } from '../../data/products';
import { insightsWhere, productFacts } from '../../lib/selectors';
import { formatDay } from '../../lib/format';
import { hrefInsights, hrefProduct } from '../../lib/links';

const SECTIONS = [
  { id: 'context', label: 'Business context' },
  { id: 'dependencies', label: 'Dependency web' },
  { id: 'revenue', label: 'Revenue map' },
  { id: 'decisions', label: 'UX decisions' },
  { id: 'stories', label: 'Stories' },
];

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

interface EvoRow extends Record<string, unknown> {
  id: string;
  era: string;
  desc: string;
}
const EVOLUTION: EvoRow[] = [
  { id: 'e1', era: 'Before ExxatOne', desc: 'March 1st: all schools emailed all sites simultaneously. Sites overwhelmed; first-come-first-serve conflicts; schools competing for the same slots.' },
  { id: 'e2', era: 'ExxatOne V1', desc: 'Sites post availability; schools apply with specific students. Control shifts from schools to clinical sites; the mass-email chaos ends.' },
  { id: 'e3', era: 'Target state', desc: 'Uber/Airbnb-style ecosystem: placements → jobs → observerships → CME. The student platform for the entire allied healthcare career lifecycle.' },
];

interface RevRow extends Record<string, unknown> {
  id: string;
  action: string;
  rev: boolean;
  note: string;
}
const REVENUE_MAP: RevRow[] = [
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
  const [section, setSection] = useSection(SECTIONS, 'context');

  // Honest facts source: tag:'platform' (16 insights) beats q:'ExxatOne' (10)
  // — labeled as what it is, insights *tagged* platform.
  const platform = insightsWhere({ tag: 'platform' });
  const platformCritical = platform.filter((i) => i.severity === 'critical').length;
  const platformNewest = insightsWhere({ tag: 'platform', sort: 'newest' })[0];

  const productShort = (id: string) => getProduct(id)?.shortName ?? id;

  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="ExxatOne — the platform"
        lede="Placement logistics before clinical work begins: the marketplace layer adjacent to Prism, and the ecosystem every product page depends on."
        meta="Sources: Aarti student + school design reviews (Feb 25), Day 1–2 Marriott (Mar 2–3)"
        facts={[
          {
            value: String(platform.length),
            label: 'insights tagged “platform”',
            href: hrefInsights({ tag: 'platform' }),
          },
          {
            value: String(platformCritical),
            label: 'critical',
            href: hrefInsights({ tag: 'platform', severity: 'critical' }),
          },
          ...(platformNewest
            ? [
                {
                  value: formatDay(platformNewest.createdAt),
                  label: 'newest',
                  href: hrefInsights({ tag: 'platform', sort: 'newest' }),
                },
              ]
            : []),
        ]}
      />

      <Fig
        title="Product dependency web — who depends on whom"
        n={DEPS.length}
        caption={`Computed from each product's declared dependencies in the registry: ${DEPS.length} directed edges across ${PRODUCTS.length} products. Rows depend on columns; a cell links to the depending product's hub.`}
      >
        <HeatGrid
          rows={PRODUCTS.map((p) => p.shortName)}
          cols={PRODUCTS.map((p) => p.shortName)}
          cell={(r, c) => {
            const from = PRODUCTS[r];
            const to = PRODUCTS[c];
            const dep = from.productDependencies.find((d) => d.product === to.id);
            return dep
              ? {
                  value: 1,
                  label: '●',
                  title: `${from.shortName} → ${to.shortName}: ${dep.dependency}`,
                  href: hrefProduct(from.id),
                }
              : { value: 0 };
          }}
          rowHref={(r) => hrefProduct(PRODUCTS[r].id)}
          emptyHint="no declared dependency"
        />
      </Fig>

      <Blockquote cite="Aarti · ExxatOne Student + School · Feb 25 · sessions d4c622ef + 72f8b82e">
        We are creating the concept of an allied health care student — just like Airbnb created the concept of a traveler.
      </Blockquote>

      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />

      {section === 'context' && (
        <SpecSection title="Business context" sub="The numbers Romit designs within — Day 1 Marriott (Mar 2) + Aarti reviews.">
          <MetadataList columns="multi" title="Platform facts">
            <MetadataListItem label="Revenue trigger">One action: student pays for an accepted placement. Nothing else generates revenue.</MetadataListItem>
            <MetadataListItem label="PA market penetration">51% — 105 of ~300 PA programs; the rest blocked by semester registration, multi-site tracking, competency visualization</MetadataListItem>
            <MetadataListItem label="Demo close rate">40% — 4 of 10 demos close</MetadataListItem>
            <MetadataListItem label="Jobs module launch">Apr 15 — post-graduation employment, licensed students only</MetadataListItem>
            <MetadataListItem label="KKR thesis">TAM $300M → $1B; Rule of 40 target 50–60; clinical education consolidates to 1–3 players and Exxat must be one</MetadataListItem>
            <MetadataListItem label="Incumbent weakness">ExamSoft NPS 1/5, sold by Turnitin, publicly anti-AI — the displacement window is open</MetadataListItem>
          </MetadataList>
          <Table<EvoRow>
            data={EVOLUTION}
            idKey="id"
            density="balanced"
            verticalAlign="top"
            columns={[
              { key: 'era', header: 'Era', width: pixel(170), renderCell: (r) => <Text type="body" weight="semibold">{r.era}</Text> },
              { key: 'desc', header: 'How placement works', width: proportional(4), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.desc}</Text> },
            ]}
          />
        </SpecSection>
      )}

      {section === 'dependencies' && (
        <SpecSection
          title="Product dependency web"
          sub="The rows behind the header grid — every row links both product hubs."
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
                renderCell: (r) => <Token label={productShort(r.from)} href={hrefProduct(r.from)} color="blue" />,
              },
              {
                key: 'to',
                header: 'Depends on',
                width: pixel(130),
                renderCell: (r) => <Token label={productShort(r.to)} href={hrefProduct(r.to)} />,
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
      )}

      {section === 'revenue' && (
        <SpecSection title="Revenue map" sub="What generates revenue vs what does not — this asymmetry shapes every design priority.">
          <Table<RevRow>
            data={REVENUE_MAP}
            idKey="id"
            density="compact"
            columns={[
              { key: 'rev', header: '', width: pixel(100), renderCell: (r) => <Badge variant={r.rev ? 'success' : 'neutral'} label={r.rev ? 'revenue' : 'free'} /> },
              { key: 'action', header: 'Event', width: proportional(2), renderCell: (r) => <Text type="body" weight={r.rev ? 'semibold' : undefined}>{r.action}</Text> },
              { key: 'note', header: 'Why', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.note}</Text> },
            ]}
          />
          <Text type="supporting" as="p" textWrap="pretty">
            Ecosystem expansion: Placements (live) → Jobs module (Apr 15) → Observerships/shadowships (future) → CME (2027,
            "coming soon" tab under consideration). Student phases: pre-placement is P0 (pay, upload compliance, onboard —
            must complete before entering a facility); during-placement activity stays in Prism; offboarding usage is very low
            and may merge into during-placement.
          </Text>
        </SpecSection>
      )}

      {section === 'decisions' && (
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
      )}

      {section === 'stories' && (
        <SpecSection title="Platform user stories" sub="From the Aarti design reviews and Day 2 Marriott.">
          <StoryTable rows={STORIES} />
        </SpecSection>
      )}

      <HStack gap={4} wrap="wrap">
        <QueryLink
          href={hrefInsights({ tag: 'platform' })}
          count={platform.length}
          label="platform-tagged findings in the corpus"
        />
        {PRODUCTS.map((p) => (
          <QueryLink
            key={p.id}
            href={hrefProduct(p.id)}
            count={productFacts(p.id).n}
            label={`insights · ${p.shortName} hub`}
          />
        ))}
      </HStack>
    </VStack>
  );
}
