// views/StakeholderAtlasView.tsx — the internal stakeholder atlas (v19.6).
// Personas are research subjects; these are the decision-makers and domain
// voices whose words drive the corpus. Identity/authority is curated
// (stakeholders.ts, every claim backed by insight ids); everything countable is
// computed live by name-matching — influence mass, theme spread, decisions
// owned — and every number is a query you can open.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { Divider } from '@astryxdesign/core/Divider';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { HeatGrid } from '../components/charts/HeatGrid';
import { TierBars } from '../components/charts/TierBars';
import { StatTile, StatTileRow } from '../components/story/StatTile';
import { ALL_INSIGHTS } from '../data/insights';
import { THEMES, getTheme } from '../data/themes';
import { STAKEHOLDERS, STAKEHOLDER_GROUP_META, stakeholderMatches } from '../data/stakeholders';
import type { Stakeholder, StakeholderGroup } from '../data/stakeholders';
import { RECOMMENDATIONS } from '../data/recommendations';
import { getProduct } from '../data/products';
import { scoreInsight } from '../lib/score';
import { hrefInsights } from '../lib/links';
import type { Insight } from '../types';

const THEME_SHORT: Record<string, string> = {
  'reporting-analytics': 'Reporting',
  'config-debt': 'Config debt',
  'form-experience': 'Forms',
  accessibility: 'A11y',
  'ai-layer': 'AI',
  'navigation-ia': 'Nav & IA',
  'mobile-low-frequency': 'Mobile',
  'skills-portability': 'Skills',
  competitive: 'Competitive',
  'integration-data': 'Integration',
  'platform-trust': 'Trust',
  'process-strategy': 'Process',
};

interface Computed {
  s: Stakeholder;
  insights: Insight[];
  mass: number;
  tiers: Record<string, number>;
  critical: number;
  topThemes: { id: string; n: number }[];
  themeCounts: Map<string, number>;
  recsOwned: number;
  decisions: number;
}

export function StakeholderAtlasView() {
  const computed: Computed[] = useMemo(() => {
    return STAKEHOLDERS.map((s) => {
      const insights = ALL_INSIGHTS.filter((i) =>
        stakeholderMatches(s, `${i.text} ${i.source} ${i.pullQuoteSource ?? ''} ${i.soWhat ?? ''}`)
      );
      const tiers: Record<string, number> = {};
      const themeCounts = new Map<string, number>();
      let mass = 0;
      for (const i of insights) {
        const sc = scoreInsight(i);
        mass += sc.total;
        tiers[sc.tier] = (tiers[sc.tier] ?? 0) + sc.total;
        themeCounts.set(i.themeId, (themeCounts.get(i.themeId) ?? 0) + 1);
      }
      return {
        s,
        insights,
        mass,
        tiers,
        critical: insights.filter((i) => i.severity === 'critical').length,
        topThemes: [...themeCounts.entries()]
          .map(([id, n]) => ({ id, n }))
          .sort((a, b) => b.n - a.n)
          .slice(0, 3),
        themeCounts,
        recsOwned: RECOMMENDATIONS.filter((r) => r.owner && stakeholderMatches(s, r.owner)).length,
        decisions: insights.filter((i) => (i.tags as string[]).includes('decision')).length,
      };
    }).sort((a, b) => b.mass - a.mass);
  }, []);

  const coverage = useMemo(() => {
    const covered = new Set<string>();
    for (const c of computed) for (const i of c.insights) covered.add(i.id);
    return covered.size;
  }, [computed]);

  const influenceRows = computed.map((c) => ({
    key: c.s.id,
    label: `${c.s.name} — ${c.s.role}`,
    mass: c.mass,
    n: c.insights.length,
    critical: c.critical,
    tiers: c.tiers,
    href: hrefInsights({ q: c.s.searchTerm }),
  }));

  const groups: StakeholderGroup[] = ['leadership', 'product', 'design-eng', 'domain-sme'];

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Stakeholders"
        lede="The people inside the product organization whose words drive this corpus — who decides what, what their voice means for the product, and the evidence trail behind each of them."
        meta={`${STAKEHOLDERS.length} stakeholders · membership computed by name-match over text, source, and quotes · personas (users) live in the Persona Atlas`}
      />

      <StatTileRow>
        <StatTile value={STAKEHOLDERS.length} label="internal stakeholders" />
        <StatTile
          value={`${Math.round((coverage / ALL_INSIGHTS.length) * 100)}%`}
          label={`of the corpus involves at least one (${coverage})`}
        />
        <StatTile value={computed.reduce((a, c) => a + c.decisions, 0)} label="decision-tagged mentions" />
        <StatTile value={computed.reduce((a, c) => a + c.recsOwned, 0)} label="recommendations owned" href="/decisions" />
      </StatTileRow>

      <Fig
        title="Influence — evidence involving each stakeholder, tier-stacked"
        n={ALL_INSIGHTS.length}
        caption="Mass = summed opportunity score of the insights that name them; segments are P0–P3 tiers. High mass means their conversations produce the evidence the roadmap runs on. Every row opens the search that produces it."
        exportData={computed.map((c) => ({
          stakeholder: c.s.name,
          role: c.s.role,
          insights: c.insights.length,
          mass: Math.round(c.mass),
          critical: c.critical,
          decisions: c.decisions,
          topTheme: getTheme(c.topThemes[0]?.id ?? '')?.title ?? '—',
        }))}
        exportName="stakeholder-influence"
      >
        <TierBars rows={influenceRows} />
      </Fig>

      <Fig
        title="Who drives which theme"
        n={ALL_INSIGHTS.length}
        caption="Insights naming the stakeholder, split by theme. Read a column to see a theme's owners-in-practice; read a row to see a person's actual footprint (which may differ from their title). Every cell opens its search."
        exportData={computed.map((c) => ({
          stakeholder: c.s.name,
          ...Object.fromEntries(THEMES.map((t) => [THEME_SHORT[t.id], c.themeCounts.get(t.id) ?? 0])),
        }))}
        exportName="stakeholder-theme-grid"
      >
        <HeatGrid
          rows={computed.map((c) => c.s.name)}
          cols={THEMES.map((t) => THEME_SHORT[t.id])}
          rowHref={(r) => hrefInsights({ q: computed[r].s.searchTerm })}
          emptyHint="no evidence"
          cell={(r, c) => {
            const v = computed[r].themeCounts.get(THEMES[c].id) ?? 0;
            return {
              value: v,
              href: v > 0 ? hrefInsights({ q: computed[r].s.searchTerm, theme: THEMES[c].id }) : undefined,
              title: `${computed[r].s.name} × ${THEMES[c].title}: ${v} insights`,
            };
          }}
          legend={{ low: 'no footprint', high: 'drives the theme' }}
        />
      </Fig>

      {groups.map((g) => {
        const members = computed.filter((c) => c.s.group === g);
        if (!members.length) return null;
        const meta = STAKEHOLDER_GROUP_META[g];
        return (
          <VStack key={g} gap={3}>
            <HStack gap={2} vAlign="center">
              <Text type="large" weight="semibold">
                {meta.label}
              </Text>
              <Text type="supporting">{meta.meaning}</Text>
            </HStack>
            <VStack gap={4}>
              {members.map((c, idx) => (
                <VStack key={c.s.id} gap={2}>
                  {idx > 0 && <Divider />}
                  <HStack gap={2} vAlign="center" hAlign="between" wrap="wrap">
                    <HStack gap={2} vAlign="center">
                      <Link href={hrefInsights({ q: c.s.searchTerm })} isStandalone>
                        {c.s.name}
                      </Link>
                      <Text type="supporting">{c.s.role}</Text>
                    </HStack>
                    <Text type="supporting" hasTabularNumbers>
                      {c.insights.length} insights · {c.critical} critical · {c.decisions} decisions
                      {c.recsOwned > 0 ? ` · owns ${c.recsOwned} recommendations` : ''}
                    </Text>
                  </HStack>
                  <Text type="body" as="p" textWrap="pretty">
                    {c.s.authority}{' '}
                    <Link href={hrefInsights({ ids: c.s.authorityRefs })}>evidence ↗</Link>
                  </Text>
                  <Text type="supporting" as="p" textWrap="pretty">
                    {c.s.meansForProduct}
                  </Text>
                  <HStack gap={1.5} wrap="wrap" vAlign="center">
                    {c.topThemes.map((t) => (
                      <Link key={t.id} href={hrefInsights({ q: c.s.searchTerm, theme: t.id })}>
                        <Token size="sm" label={`${getTheme(t.id)?.title} · ${t.n}`} />
                      </Link>
                    ))}
                    {c.s.productIds.map((p) => (
                      <Token key={p} size="sm" label={getProduct(p)?.shortName ?? p} color="blue" />
                    ))}
                  </HStack>
                </VStack>
              ))}
            </VStack>
          </VStack>
        );
      })}

      <Text type="supporting">
        Method: an insight belongs to a stakeholder when their name appears in its text, source, quote attribution, or
        so-what (word-boundary match). Sorted by influence mass ({computed.map((c) => c.s.name).slice(0, 3).join(', ')} lead).
        Mentions ≠ agreement — the grid shows footprint, and the curated authority lines say who actually decides.
      </Text>
    </VStack>
  );
}
