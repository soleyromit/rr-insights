// views/WhiteboardView.tsx — Source Library (v19 redesign).
// Primary sources shown as primary sources: a StatTile hero computed from the
// data, the shared TokenFilterRow over ?category=, and the artifact gallery as
// an edge-to-edge table with row expansion for the captured bullets. Every
// artifact carries a per-artifact "now lives in" QueryLink with a live count —
// the category-level BECAME map is extended to the artifact level.
import { useMemo, useState } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { Table, pixel, proportional, useTableRowExpansion, useTableRowExpansionState } from '@astryxdesign/core/Table';
import { WHITEBOARD_ARTIFACTS, PERSONAS, COMPETITOR_FEATURES, MILESTONES } from '../data/personas';
import { PageHeader } from '../components/ui/PageHeader';
import { QueryLink } from '../components/story/QueryLink';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { TokenFilterRow } from '../components/ui/TokenFilterRow';
import { useParamState } from '../lib/useParamState';
import { allSignals, corpusFacts, productFacts } from '../lib/selectors';
import { parsePhaseDate } from '../lib/phaseDates';
import { hrefPersonas, hrefCompetitive, hrefSignals, hrefRoadmap, hrefProduct } from '../lib/links';
import type { WhiteboardArtifact } from '../types';

const CATEGORY_LABELS: Record<string, string> = {
  'product-context': 'Product context',
  persona: 'Personas',
  competitor: 'Competitors',
  strategic: 'Strategy',
  feature: 'Features',
  'exam-intel': 'Exam intel',
};

interface Destination {
  href: string;
  count: number;
  label: string;
}

/** Where each whiteboard's thinking now lives — artifact-level where the
 * mapping is obvious, category-level otherwise. Counts are computed live so
 * the link states what is behind it. */
function destinationOf(a: WhiteboardArtifact): Destination | undefined {
  const personas: Destination = { href: hrefPersonas(), count: PERSONAS.length, label: 'personas — Persona Atlas' };
  const signals: Destination = { href: hrefSignals(), count: allSignals().length, label: 'signals — Signal Board' };
  const commandCenter: Destination = { href: '/', count: corpusFacts().n, label: 'insights — Command Center' };
  const competitive: Destination = { href: hrefCompetitive(), count: COMPETITOR_FEATURES.length, label: 'tracked features — Competitive Parity' };
  const roadmap: Destination = {
    href: hrefRoadmap(),
    count: MILESTONES.filter((m) => parsePhaseDate(m.date)).length,
    label: 'dated milestones — Roadmap',
  };
  const examHub: Destination = {
    href: hrefProduct('exam-management'),
    count: productFacts('exam-management').n,
    label: 'insights — Exam Management hub',
  };

  // Artifact-level overrides where the artifact obviously maps.
  const byArtifact: Record<string, Destination> = {
    'wb-users': personas,
    'wb-persona-methods': personas,
    'wb-competitor': competitive,
    'wb-strategic': signals,
    'wb-maturity': signals,
    'wb-gaps': commandCenter,
    'wb-product-context': commandCenter,
    'wb-product-experience': commandCenter,
    'wb-product-1': roadmap,
    'wb-new-features': roadmap,
  };
  if (byArtifact[a.id]) return byArtifact[a.id];

  // Category-level fallback (the original BECAME map, with live counts).
  const byCategory: Record<string, Destination> = {
    'product-context': commandCenter,
    persona: personas,
    competitor: competitive,
    strategic: signals,
    feature: roadmap,
    'exam-intel': examHub,
  };
  return byCategory[a.category];
}

interface WbRow extends Record<string, unknown> {
  id: string;
  kind: 'artifact' | 'item';
  artifact: WhiteboardArtifact;
  text?: string;
}

export function WhiteboardView() {
  const [category, setCategory] = useParamState('category');
  const [session, setSession] = useParamState('session');

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of WHITEBOARD_ARTIFACTS) counts.set(a.category, (counts.get(a.category) ?? 0) + 1);
    return [...counts.entries()];
  }, []);

  const shown = useMemo(() => {
    let list = WHITEBOARD_ARTIFACTS;
    if (category) list = list.filter((a) => a.category === category);
    if (session) {
      const q = session.toLowerCase();
      list = list.filter((a) => a.source.toLowerCase().includes(q) || a.title.toLowerCase().includes(q));
    }
    return list;
  }, [category, session]);

  const totalItems = WHITEBOARD_ARTIFACTS.reduce((n, a) => n + a.items.length, 0);

  const baseRows: WbRow[] = useMemo(
    () => shown.map((a) => ({ id: a.id, kind: 'artifact' as const, artifact: a })),
    [shown]
  );
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const { data, expansionConfig } = useTableRowExpansionState<WbRow>({
    baseData: baseRows,
    getChildren: (r) =>
      r.kind === 'artifact'
        ? r.artifact.items.map((text, i) => ({
            id: `${r.artifact.id}-item-${i}`,
            kind: 'item' as const,
            artifact: r.artifact,
            text,
          }))
        : [],
    getRowKey: (r) => r.id,
    expandedKeys,
    setExpandedKeys,
  });
  const expansion = useTableRowExpansion<WbRow>({ ...expansionConfig, hasRowClickExpansion: true });

  return (
    <VStack gap={5} padding={6} maxWidth={1120}>
      <PageHeader
        title="Source Library"
        lede="The whiteboards that started everything, kept as artifacts rather than retyped as prose — expand any row for the captured items, and follow each artifact to the page where its thinking now lives."
        meta="Captured in the Mar 20, 2026 whiteboard sessions"
      />

      <StatTileRow>
        <StatTile value={WHITEBOARD_ARTIFACTS.length} label="whiteboard artifacts" />
        <StatTile value={totalItems} label="captured items" />
        <StatTile value={categories.length} label="categories" />
        <StatTile value="Mar 20, 2026" label="captured" />
      </StatTileRow>

      <HStack gap={3} vAlign="center" wrap="wrap">
        <TokenFilterRow
          options={categories.map(([cat, count]) => ({
            key: cat,
            label: CATEGORY_LABELS[cat] ?? cat,
            count,
          }))}
          value={category}
          onChange={setCategory}
          allLabel={`All · ${WHITEBOARD_ARTIFACTS.length}`}
        />
        {session && <Token label={`session: ${session}`} color="orange" onRemove={() => setSession(undefined)} />}
      </HStack>

      {shown.length === 0 ? (
        <EmptyState
          title="No matching artifacts"
          description={
            session
              ? `No whiteboard artifact matches "${session}". Clear the session filter to see the full library.`
              : 'No artifacts in this category.'
          }
        />
      ) : (
        <Table<WbRow>
          data={data}
          idKey="id"
          density="balanced"
          hasHover
          verticalAlign="top"
          plugins={{ expansion }}
          columns={[
            {
              key: 'title',
              header: 'Artifact',
              width: proportional(3),
              renderCell: (r: WbRow) =>
                r.kind === 'item' ? (
                  <Text type="supporting" as="p" textWrap="pretty">
                    · {r.text}
                  </Text>
                ) : (
                  <Text type="body" weight="semibold" textWrap="balance">
                    {r.artifact.title}
                  </Text>
                ),
            },
            {
              key: 'category',
              header: 'Category',
              width: pixel(140),
              renderCell: (r: WbRow) =>
                r.kind === 'item' ? null : (
                  <Token label={CATEGORY_LABELS[r.artifact.category] ?? r.artifact.category} size="sm" />
                ),
            },
            {
              key: 'source',
              header: 'Source',
              width: proportional(2),
              renderCell: (r: WbRow) =>
                r.kind === 'item' ? null : <Text type="supporting">{r.artifact.source}</Text>,
            },
            {
              key: 'items',
              header: 'Items',
              width: pixel(80),
              align: 'end',
              renderCell: (r: WbRow) =>
                r.kind === 'item' ? null : (
                  <Text type="supporting" hasTabularNumbers>
                    {r.artifact.items.length}
                  </Text>
                ),
            },
            {
              key: 'destination',
              header: 'Now lives in',
              width: proportional(2),
              renderCell: (r: WbRow) => {
                if (r.kind === 'item') return null;
                const dest = destinationOf(r.artifact);
                return dest ? (
                  <QueryLink href={dest.href} count={dest.count} label={dest.label} isStandalone={false} />
                ) : null;
              },
            },
          ]}
        />
      )}
    </VStack>
  );
}
