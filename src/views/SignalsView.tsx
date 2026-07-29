// views/SignalsView.tsx — the signal board (v18 Astryx rebuild). Seven
// cross-product signals ranked by opportunity mass; every card is a door into
// its case file, every heat cell a filtered query. The old inline drilldown
// moved to /signals/:signalId.
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { HeatGrid } from '../components/charts/HeatGrid';
import { SevBadge } from '../components/ui/sev';
import { allSignals } from '../lib/selectors';
import { sumScores } from '../lib/score';
import { PRODUCTS } from '../data/products';
import { hrefInsights, hrefSignal } from '../lib/links';

export function SignalsView() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Legacy #dd= deep links land here via the boot shim — forward to the case file.
  useEffect(() => {
    const dd = params.get('dd');
    if (!dd) return;
    const parts = Object.fromEntries(dd.split('/').map((p) => p.split(':')));
    if (parts.signal) {
      navigate(hrefSignal(parts.signal, { persona: parts.persona, insight: parts.insight }), { replace: true });
    }
  }, [params, navigate]);

  const signals = useMemo(() => allSignals(), []);
  const ranked = useMemo(
    () =>
      [...signals]
        .map((s) => ({ sig: s, mass: sumScores(s.insights) }))
        .sort((a, b) => b.mass - a.mass),
    [signals]
  );

  const rows = ranked.map(({ sig, mass }) => ({
    key: sig.def.id,
    label: sig.def.title,
    value: mass,
    hint: `${sig.insights.length} insights · ${sig.bySeverity['critical'] ?? 0} critical`,
    href: hrefSignal(sig.def.id),
  }));

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Platform Signals"
        lede="Cross-product patterns ranked by opportunity mass — rank order is the escalation order for the next stakeholder briefing."
        meta={`${signals.length} signals computed live from ${signals.reduce((n, s) => n + s.insights.length, 0)} insight-signal pairs`}
      />

      <Grid columns={{ minWidth: 380, max: 2 }} gap={4}>
        <Fig
          title="Opportunity mass, ranked"
          caption="Summed opportunity scores (severity × evidence × persona priority). The top bar is the next design cycle."
        >
          <RankedList rows={rows} format={(r) => String(r.value)} />
        </Fig>

        <Fig
          title="Signal × product evidence"
          caption="Where each signal's evidence concentrates. The heaviest cell is a product-level brief waiting to be written — click it for the insight list."
        >
          <HeatGrid
            rows={ranked.map(({ sig }) => sig.def.title)}
            cols={PRODUCTS.map((p) => p.shortName)}
            cell={(r, c) => {
              const sig = ranked[r].sig;
              const pid = PRODUCTS[c].id;
              const v = sig.byProduct[pid] ?? 0;
              return {
                value: v,
                href: v > 0 ? hrefInsights({ signal: sig.def.id, product: pid }) : undefined,
                title: `${sig.def.title} × ${PRODUCTS[c].shortName}: ${v} insights`,
              };
            }}
            legend={{ low: 'no evidence', high: 'evidence mass' }}
          />
        </Fig>
      </Grid>

      <Grid columns={{ minWidth: 320, max: 2 }} gap={4}>
        {ranked.map(({ sig, mass }, i) => (
          <ClickableCard key={sig.def.id} onClick={() => navigate(hrefSignal(sig.def.id))} padding={4}>
            <VStack gap={2}>
              <HStack gap={2} vAlign="center" hAlign="between">
                <HStack gap={2} vAlign="center">
                  <Text type="supporting" hasTabularNumbers>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                  <Text type="body" weight="semibold">
                    {sig.def.title}
                  </Text>
                </HStack>
                <SevBadge severity={sig.topSeverity} />
              </HStack>
              <Text type="supporting" as="p" textWrap="pretty">
                {sig.def.question}
              </Text>
              <HStack gap={2} vAlign="center">
                <Badge label={`${sig.insights.length} insights`} />
                <Badge variant={(sig.bySeverity['critical'] ?? 0) > 0 ? 'error' : 'neutral'} label={`${sig.bySeverity['critical'] ?? 0} critical`} />
                <Text type="supporting" hasTabularNumbers>
                  mass {mass}
                </Text>
              </HStack>
            </VStack>
          </ClickableCard>
        ))}
      </Grid>
    </VStack>
  );
}
