// views/StakeholderView.tsx — Briefings (v18 Astryx rebuild).
// One audience at a time (synced to ?audience=), letter format, copy-ready.
// Writing rules enforced on render and copy: no em dashes leave this page.
// Risk rows link to their signal case files; referenced products link to hubs.
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Token } from '@astryxdesign/core/Token';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { SegmentedControl, SegmentedControlItem } from '@astryxdesign/core/SegmentedControl';
import { useToast } from '@astryxdesign/core/Toast';
import { DECKS, SIGNAL_RISKS } from '../data/briefings';
import { ALL_INSIGHTS } from '../data/insights';
import { MILESTONES } from '../data/personas';
import { PRODUCTS } from '../data/products';
import { SESSIONS_SYNCED } from '../data/version';
import { allSignals } from '../lib/selectors';
import { PageHeader } from '../components/ui/PageHeader';
import { hrefSignal, hrefProduct } from '../lib/links';

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
  const [params, setParams] = useSearchParams();
  const toast = useToast();

  const audience = params.get('audience') ?? slug(DECKS[0].audience);
  const deck = DECKS.find((d) => slug(d.audience) === audience) ?? DECKS[0];

  const setAudience = (v: string) =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (v === slug(DECKS[0].audience)) p.delete('audience');
        else p.set('audience', v);
        return p;
      },
      { replace: true }
    );

  const referencedProducts = useMemo(() => {
    const text = SECTIONS.map((s) => deck[s.key]).join(' ');
    return PRODUCTS.filter((p) => text.includes(p.name) || text.includes(p.shortName));
  }, [deck]);

  const copyText = () => {
    const text = [
      `BRIEFING · ${deck.audience} (${deck.role}) · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      ...SECTIONS.flatMap((s) => ['', s.label.toUpperCase(), clean(deck[s.key])]),
    ].join('\n');
    navigator.clipboard.writeText(text);
    toast({ body: 'Briefing copied, em dashes stripped', uniqueID: 'copy-briefing' });
  };

  return (
    <VStack gap={5} padding={6} maxWidth={1080}>
      <PageHeader
        title="Briefings"
        lede="The same research, three registers: evidence-grounded for Arun, business-outcome for Kunal, decision-only for Aarti — pick the audience, copy the letter, send it."
        meta={`${DECKS.length} audiences · computed live from ${ALL_INSIGHTS.length} insights across ${SESSIONS_SYNCED} synced sessions · copy strips em dashes per writing rules`}
      />

      <SegmentedControl label="Audience" value={slug(deck.audience)} onChange={setAudience}>
        {DECKS.map((d) => (
          <SegmentedControlItem key={d.audience} value={slug(d.audience)} label={`${d.audience} · ${d.role}`} />
        ))}
      </SegmentedControl>

      <Grid columns={{ minWidth: 380, max: 2 }} gap={4}>
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

        <Card padding={4}>
          <VStack gap={3}>
            <Text type="label" color="secondary">
              Signal register, quoted in the briefings
            </Text>
            {SIGNAL_RISKS.map((r, i) => {
              const href = riskHref(r.signal);
              return (
                <HStack key={i} gap={2}>
                  <StatusDot variant={RISK_DOT[r.type] ?? 'neutral'} label={r.type} tooltip={r.type} />
                  {href ? (
                    <Link href={href}>
                      <Text type="body" as="p" textWrap="pretty">
                        {clean(r.signal)}
                      </Text>
                    </Link>
                  ) : (
                    <Text type="body" as="p" textWrap="pretty">
                      {clean(r.signal)}
                    </Text>
                  )}
                </HStack>
              );
            })}
          </VStack>
        </Card>
      </Grid>
    </VStack>
  );
}
