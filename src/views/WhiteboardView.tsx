// views/WhiteboardView.tsx — Source Library (v18 Astryx rebuild).
// Primary sources shown as primary sources: whiteboard artifacts as a
// filterable gallery (?category=), each linked forward to the page that
// operationalized it. ?session= highlights the artifacts an insight cites.
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Token } from '@astryxdesign/core/Token';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { WHITEBOARD_ARTIFACTS } from '../data/personas';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { hrefPersonas, hrefCompetitive, hrefSignals, hrefRoadmap, hrefProduct, hrefSources } from '../lib/links';

const CATEGORY_LABELS: Record<string, string> = {
  'product-context': 'Product context',
  persona: 'Personas',
  competitor: 'Competitors',
  strategic: 'Strategy',
  feature: 'Features',
  'exam-intel': 'Exam intel',
};

// Where each whiteboard's thinking now lives in the app.
const BECAME: Record<string, { href: string; label: string }> = {
  'product-context': { href: '/', label: 'Command Center' },
  persona: { href: hrefPersonas(), label: 'Persona Atlas' },
  competitor: { href: hrefCompetitive(), label: 'Competitive Parity' },
  strategic: { href: hrefSignals(), label: 'Signals' },
  feature: { href: hrefRoadmap(), label: 'Roadmap' },
  'exam-intel': { href: hrefProduct('exam-management'), label: 'Exam Management' },
};

const ITEM_PREVIEW = 5;

export function WhiteboardView() {
  const [params, setParams] = useSearchParams();
  const category = params.get('category') ?? undefined;
  const session = params.get('session') ?? undefined;

  const set = (key: string, value?: string) =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (value) p.set(key, value);
        else p.delete(key);
        return p;
      },
      { replace: true }
    );

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

  const heroRows = categories
    .map(([cat, count]) => ({
      key: cat,
      label: CATEGORY_LABELS[cat] ?? cat,
      value: WHITEBOARD_ARTIFACTS.filter((a) => a.category === cat).reduce((n, a) => n + a.items.length, 0),
      hint: `${count} artifact${count === 1 ? '' : 's'}`,
      href: hrefSources() + `?category=${cat}`,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <VStack gap={5} padding={6} maxWidth={1120}>
      <PageHeader
        title="Source Library"
        lede="The whiteboards that started everything, kept as artifacts rather than retyped as prose — each one links forward to the page where its thinking now lives."
        meta={`${WHITEBOARD_ARTIFACTS.length} whiteboard artifacts · Mar 20, 2026 sessions · ${WHITEBOARD_ARTIFACTS.reduce((n, a) => n + a.items.length, 0)} captured items`}
      />

      <Fig
        title="Captured items by category"
        caption="Where the whiteboard thinking concentrated. The heaviest category names the research phase's center of gravity — each bar filters the gallery below."
      >
        <RankedList rows={heroRows} format={(r) => `${r.value} items`} />
      </Fig>

      <HStack gap={1.5} wrap="wrap" vAlign="center">
        <Token label={`All · ${WHITEBOARD_ARTIFACTS.length}`} color={!category ? 'blue' : 'default'} onClick={() => set('category', undefined)} />
        {categories.map(([cat, count]) => (
          <Token
            key={cat}
            label={`${CATEGORY_LABELS[cat] ?? cat} · ${count}`}
            color={category === cat ? 'blue' : 'default'}
            onClick={() => set('category', category === cat ? undefined : cat)}
          />
        ))}
        {session && <Token label={`session: ${session}`} color="orange" onRemove={() => set('session', undefined)} />}
      </HStack>

      {shown.length === 0 ? (
        <EmptyState
          title="No matching artifacts"
          description={session ? `No whiteboard artifact matches "${session}". Clear the session filter to see the full library.` : 'No artifacts in this category.'}
        />
      ) : (
        <Grid columns={{ minWidth: 340, max: 3 }} gap={4}>
          {shown.map((a) => {
            const became = BECAME[a.category];
            return (
              <Card key={a.id} padding={4}>
                <VStack gap={2}>
                  <VStack gap={0.5}>
                    <Text type="body" weight="semibold" textWrap="balance">
                      {a.title}
                    </Text>
                    <Text type="supporting">
                      {a.source} · {CATEGORY_LABELS[a.category] ?? a.category}
                    </Text>
                  </VStack>
                  <VStack gap={1}>
                    {a.items.slice(0, ITEM_PREVIEW).map((it, i) => (
                      <HStack key={i} gap={2}>
                        <Text type="supporting">·</Text>
                        <Text type="supporting" as="p" textWrap="pretty">
                          {it}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                  {a.items.length > ITEM_PREVIEW && (
                    <Collapsible trigger={<Text type="supporting">{`+${a.items.length - ITEM_PREVIEW} more items`}</Text>} defaultIsOpen={false}>
                      <VStack gap={1}>
                        {a.items.slice(ITEM_PREVIEW).map((it, i) => (
                          <HStack key={i} gap={2}>
                            <Text type="supporting">·</Text>
                            <Text type="supporting" as="p" textWrap="pretty">
                              {it}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Collapsible>
                  )}
                  {became && (
                    <Link href={became.href} isStandalone>
                      became {became.label} →
                    </Link>
                  )}
                </VStack>
              </Card>
            );
          })}
        </Grid>
      )}
    </VStack>
  );
}
