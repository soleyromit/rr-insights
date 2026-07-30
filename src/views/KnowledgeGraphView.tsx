// views/KnowledgeGraphView.tsx — theme co-occurrence network (v19.5 rebuild).
// The old hand-curated 44-node force graph was decorative: unlabeled dots,
// physics layout, disconnected from the corpus. This one is computed live —
// nodes are the 12 themes (size = evidence mass), edges are how often two
// themes surface in the SAME session. It answers a real question: which topics
// travel together in conversations, and therefore which design responses must
// be coordinated. Circular layout: deterministic, labeled, no hairball.
import { useMemo, useState } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Token } from '@astryxdesign/core/Token';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { ALL_INSIGHTS } from '../data/insights';
import { THEMES, getTheme } from '../data/themes';
import { themeCooccurrence } from '../lib/series';
import { hrefInsights } from '../lib/links';

const W = 880;
const H = 560;
const CX = W / 2;
const CY = H / 2;
const R = 200;

const MIN_SESSIONS = 2; // pairs sharing fewer sessions are pruned as noise

export function KnowledgeGraphView() {
  const [focus, setFocus] = useState<string | null>(null);
  const graph = useMemo(() => themeCooccurrence(ALL_INSIGHTS), []);
  const links = useMemo(() => graph.links.filter((l) => l.sessions >= MIN_SESSIONS), [graph]);

  // Fixed order around the circle = THEMES registry order, so the layout is
  // stable across visits (positions never depend on data churn).
  const pos = useMemo(() => {
    const ids = THEMES.map((t) => t.id).filter((id) => graph.nodes.some((n) => n.id === id));
    const map = new Map<string, { x: number; y: number; angle: number; n: number }>();
    ids.forEach((id, idx) => {
      const angle = (idx / ids.length) * Math.PI * 2 - Math.PI / 2;
      map.set(id, {
        x: CX + R * Math.cos(angle),
        y: CY + R * Math.sin(angle),
        angle,
        n: graph.nodes.find((n) => n.id === id)?.n ?? 0,
      });
    });
    return map;
  }, [graph]);

  const maxSessions = Math.max(1, ...links.map((l) => l.sessions));
  const maxN = Math.max(1, ...graph.nodes.map((n) => n.n));
  const radius = (n: number) => 6 + 16 * Math.sqrt(n / maxN);

  const visible = focus ? links.filter((l) => l.a === focus || l.b === focus) : links;
  const sessionsTotal = useMemo(() => new Set(ALL_INSIGHTS.map((i) => i.source)).size, []);
  const focusTheme = focus ? getTheme(focus) : undefined;

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Knowledge Graph"
        lede="Which themes travel together — computed from which topics surface in the same sessions. Strong edges mean the design responses must be coordinated, not shipped separately."
        meta={`${graph.nodes.length} themes · ${links.length} co-occurrence edges (≥${MIN_SESSIONS} shared sessions) · ${sessionsTotal} sessions`}
      />

      <StatTileRow>
        <StatTile value={links.length} label="theme pairs co-occurring" />
        <StatTile
          value={links[0] ? `${links[0].sessions}` : '—'}
          label={links[0] ? `strongest: ${getTheme(links[0].a)?.title} × ${getTheme(links[0].b)?.title}` : 'no pairs'}
        />
        <StatTile value={sessionsTotal} label="distinct sessions" />
      </StatTileRow>

      <HStack gap={1.5} wrap="wrap">
        {THEMES.filter((t) => pos.has(t.id)).map((t) => (
          <Token
            key={t.id}
            label={t.title}
            size="sm"
            color={focus === t.id ? 'teal' : 'default'}
            onClick={() => setFocus(focus === t.id ? null : t.id)}
          />
        ))}
      </HStack>

      <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
        <Fig
          title="Theme co-occurrence network"
          n={ALL_INSIGHTS.length}
          caption={
            focusTheme
              ? `Focused on ${focusTheme.title} — showing only its connections. Click the chip again to clear.`
              : 'Node size = evidence mass; edge width = sessions where both themes surfaced. Click a chip above to focus one theme; click a node to open its insights.'
          }
          exportData={links.map((l) => ({
            themeA: getTheme(l.a)?.title ?? l.a,
            themeB: getTheme(l.b)?.title ?? l.b,
            sharedSessions: l.sessions,
            insights: l.ids.length,
          }))}
          exportName="theme-cooccurrence"
        >
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="Theme co-occurrence network" fontFamily="inherit">
            {visible.map((l) => {
              const a = pos.get(l.a);
              const b = pos.get(l.b);
              if (!a || !b) return null;
              const w = 1 + 5 * (l.sessions / maxSessions);
              return (
                <path
                  key={`${l.a}|${l.b}`}
                  d={`M ${a.x} ${a.y} Q ${CX} ${CY} ${b.x} ${b.y}`}
                  fill="none"
                  stroke="#8a8580"
                  strokeWidth={w}
                  opacity={focus ? 0.55 : 0.18 + 0.4 * (l.sessions / maxSessions)}
                >
                  <title>{`${getTheme(l.a)?.title} × ${getTheme(l.b)?.title}: ${l.sessions} shared sessions, ${l.ids.length} insights`}</title>
                </path>
              );
            })}
            {[...pos.entries()].map(([id, p]) => {
              const t = getTheme(id);
              const r = radius(p.n);
              const rightSide = Math.cos(p.angle) >= 0;
              const lx = p.x + (rightSide ? r + 8 : -(r + 8));
              const dimmed = focus !== null && focus !== id && !visible.some((l) => l.a === id || l.b === id);
              return (
                <a key={id} href={`#${hrefInsights({ theme: id })}`} aria-label={`${t?.title}: ${p.n} insights`}>
                  <g opacity={dimmed ? 0.25 : 1}>
                    <circle cx={p.x} cy={p.y} r={r} fill={t?.color ?? '#6d5ed4'}>
                      <title>{`${t?.title}: ${p.n} insights`}</title>
                    </circle>
                    <text
                      x={lx}
                      y={p.y + 3.5}
                      textAnchor={rightSide ? 'start' : 'end'}
                      fontSize={11.5}
                      fill="currentColor"
                      opacity={0.85}
                    >
                      {`${t?.title} · ${p.n}`}
                    </text>
                  </g>
                </a>
              );
            })}
          </svg>
        </Fig>

        <Fig
          title="Strongest connections"
          caption="Every pair opens the insights from its shared sessions. A strong pair is one conversation topic wearing two theme labels — its design responses belong in one initiative."
        >
          <List density="compact" hasDividers>
            {(focus ? visible : links).slice(0, 12).map((l) => (
              <Item
                key={`${l.a}|${l.b}`}
                as="li"
                href={hrefInsights({ ids: l.ids })}
                label={`${getTheme(l.a)?.title} × ${getTheme(l.b)?.title}`}
                labelLines={1}
                description={`${l.sessions} shared sessions · ${l.ids.length} insights`}
                endContent={
                  <Text type="supporting" hasTabularNumbers>
                    {l.sessions}
                  </Text>
                }
              />
            ))}
          </List>
        </Fig>
      </Grid>

      <Text type="supporting">
        Method: an edge connects two themes when insights from the same session (source string) carry both theme labels.
        Pairs sharing fewer than {MIN_SESSIONS} sessions are pruned as noise. The old hand-curated lineage graph (44 nodes,
        static) was retired in v19.5 — <Link href="/changelog">changelog</Link>.
      </Text>
    </VStack>
  );
}
