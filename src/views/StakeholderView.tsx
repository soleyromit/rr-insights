// views/StakeholderView.tsx — Briefings (v19 redesign).
// One audience at a time (synced to ?audience=), letter format, copy-ready.
// The letter now sits beside a 380px evidence rail that proves its numbers:
// criticals by product, a 6-month volume sparkline, the signal register as
// linked rows, and a newest-first findings teaser. Writing rules enforced on
// render and copy: no em dashes leave this page.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Layout, LayoutPanel } from '@astryxdesign/core/Layout';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Token } from '@astryxdesign/core/Token';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { useToast } from '@astryxdesign/core/Toast';
import { DECKS, SIGNAL_RISKS } from '../data/briefings';
import { ALL_INSIGHTS } from '../data/insights';
import { MILESTONES } from '../data/personas';
import { PRODUCTS } from '../data/products';
import { SESSIONS_SYNCED } from '../data/version';
import { allSignals, insightsWhere, productFacts, corpusFacts, CORPUS_ANCHOR } from '../lib/selectors';
import { monthlyVolume } from '../lib/series';
import { useParamState } from '../lib/useParamState';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { Sparkline } from '../components/charts/Sparkline';
import { FindingsFeed } from '../components/story/FindingsFeed';
import { hrefSignal, hrefProduct, hrefInsights } from '../lib/links';

// Writing rule: no em dashes leave this page, on screen or on the clipboard.
const clean = (t: string) => t.replace(/\s+—\s+/g, ', ').replace(/—/g, ', ');

const SECTIONS = [
  { key: 'problem', label: 'The problem' },
  { key: 'findings', label: 'What we found' },
  { key: 'recommendation', label: 'Recommended direction' },
] as const;

const slug = (audience: string) => audience.split(' ')[0].toLowerCase();

const RISK_DOT: Record<string, 'error' | 'warning' | 'success'> = {
  Risk: 'error',
  Priority: 'warning',
  Opportunity: 'success',
};

/** Resolve a risk-register row back to the entity it quotes. */
function riskHref(text: string): string | undefined {
  const sig = allSignals().find((s) => text.startsWith(s.def.title));
  if (sig) return hrefSignal(sig.def.id);
  const ms = MILESTONES.find((m) => text.startsWith(m.label));
  if (ms?.productId) return hrefProduct(ms.productId);
  if (/^AI opportunity/i.test(text)) return hrefSignal('ai-layer');
  return undefined;
}

export function StakeholderView() {
  const [audienceParam, setAudience] = useParamState('audience', slug(DECKS[0].audience));
  const toast = useToast();

  const deck = DECKS.find((d) => slug(d.audience) === audienceParam) ?? DECKS[0];

  const referencedProducts = useMemo(() => {
    const text = SECTIONS.map((s) => deck[s.key]).join(' ');
    return PRODUCTS.filter((p) => text.includes(p.name) || text.includes(p.shortName));
  }, [deck]);

  // Evidence rail data — every number in the letter is provable one click away.
  const criticalRows = useMemo(
    () =>
      PRODUCTS.map((p) => {
        const f = productFacts(p.id);
        return {
          key: p.id,
          label: p.shortName,
          value: f.critical,
          hint: `of ${f.n}`,
          href: hrefInsights({ product: p.id, severity: 'critical' }),
        };
      }).sort((a, b) => b.value - a.value),
    []
  );

  const sparkData = useMemo(
    () =>
      monthlyVolume(ALL_INSIGHTS)
        .slice(-6)
        .map((m) => ({ label: m.label, value: m.total })),
    []
  );

  const since7 = useMemo(
    () => new Date(new Date(CORPUS_ANCHOR).getTime() - 7 * 86400000).toISOString().slice(0, 10),
    []
  );
  const newest = useMemo(() => insightsWhere({ sort: 'newest' }), []);

  const copyText = () => {
    const text = [
      `BRIEFING · ${deck.audience} (${deck.role}) · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      ...SECTIONS.flatMap((s) => ['', s.label.toUpperCase(), clean(deck[s.key])]),
    ].join('\n');
    navigator.clipboard.writeText(text);
    toast({ body: 'Briefing copied, em dashes stripped', uniqueID: 'copy-briefing' });
  };

  return (
    <VStack gap={5} padding={6} maxWidth={1180}>
      <PageHeader
        title="Briefings"
        lede="The same research, three registers: evidence-grounded for Arun, business-outcome for Kunal, decision-only for Aarti — pick the audience, copy the letter, send it. The rail alongside proves every number the letter quotes."
        meta={`${DECKS.length} audiences · computed live from ${ALL_INSIGHTS.length} insights across ${SESSIONS_SYNCED} synced sessions · copy strips em dashes per writing rules`}
      />

      <SegmentedControl label="Audience" value={slug(deck.audience)} onChange={setAudience}>
        {DECKS.map((d) => (
          <SegmentedControlItem key={d.audience} value={slug(d.audience)} label={`${d.audience} · ${d.role}`} />
        ))}
      </SegmentedControl>

      <Layout
        height="auto"
        end={
          <LayoutPanel width={380} hasDivider isScrollable={false} padding={3} label="Evidence rail">
            <VStack gap={4}>
              <Fig
                title="Critical load by product"
                n={corpusFacts().critical}
                caption="Computed live from the corpus — the same numbers the letters quote. Each row opens that product's critical query."
              >
                <RankedList rows={criticalRows} format={(r) => `${r.value} critical`} />
              </Fig>

              <Fig
                title="Evidence volume — last 6 months"
                n={sparkData.reduce((n, d) => n + d.value, 0)}
                link={{
                  href: hrefInsights({ sort: 'newest', since: since7 }),
                  count: corpusFacts().last7d,
                  label: 'added this week — newest first',
                }}
              >
                <Sparkline data={sparkData} height={48} />
              </Fig>

              <Card padding={3}>
                <List
                  density="compact"
                  hasDividers
                  header={
                    <Text type="label" color="secondary">
                      Signal register, quoted in the briefings
                    </Text>
                  }
                >
                  {SIGNAL_RISKS.map((r, i) => {
                    const href = riskHref(r.signal);
                    return (
                      <Item
                        key={i}
                        as="li"
                        align="start"
                        href={href}
                        startContent={<StatusDot variant={RISK_DOT[r.type] ?? 'neutral'} label={r.type} tooltip={r.type} />}
                        label={clean(r.signal)}
                        labelLines={3}
                      />
                    );
                  })}
                </List>
              </Card>

              <Card padding={3}>
                <FindingsFeed
                  insights={newest}
                  limit={3}
                  from="/briefings"
                  header={
                    <Text type="label" color="secondary">
                      What's new
                    </Text>
                  }
                />
              </Card>
            </VStack>
          </LayoutPanel>
        }
      >
        <Card padding={5}>
          <VStack gap={4}>
            <HStack gap={3} vAlign="center" hAlign="between">
              <VStack gap={0.5}>
                <Heading level={2}>Briefing · {deck.audience}</Heading>
                <Text type="supporting">
                  {deck.role} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </Text>
              </VStack>
              <Button label="Copy briefing" variant="secondary" size="sm" icon={<Icon icon="copy" />} onClick={copyText} />
            </HStack>

            {SECTIONS.map((s) => (
              <VStack key={s.key} gap={1}>
                <Heading level={3}>{s.label}</Heading>
                <Text type="body" as="p" textWrap="pretty">
                  {clean(deck[s.key])}
                </Text>
              </VStack>
            ))}

            {referencedProducts.length > 0 && (
              <HStack gap={1.5} vAlign="center" wrap="wrap">
                <Text type="supporting">Referenced products:</Text>
                {referencedProducts.map((p) => (
                  <Token key={p.id} label={p.shortName} href={hrefProduct(p.id)} />
                ))}
              </HStack>
            )}
          </VStack>
        </Card>
      </Layout>
    </VStack>
  );
}
