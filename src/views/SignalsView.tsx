// views/SignalsView.tsx — the signal board (v19 redesign). Seven cross-product
// signals ranked by opportunity mass; the hero heat grid keeps every cell a
// filtered query, and the case files are edge-to-edge rows carrying the recency
// the board never had: newest member, 30d trend, and a mini volume sparkline.
import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Text } from '@astryxdesign/core/Text';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { HeatGrid } from '../components/charts/HeatGrid';
import { Sparkline } from '../components/charts/Sparkline';
import { TrendDelta } from '../components/charts/TrendDelta';
import { FeedTime } from '../components/story/EvidenceRow';
import { allSignals, CORPUS_ANCHOR } from '../lib/selectors';
import { monthlyVolume, recentCounts } from '../lib/series';
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
        .map((s) => ({
          sig: s,
          mass: sumScores(s.insights),
          recent: recentCounts(s.insights, 30, CORPUS_ANCHOR),
          newest: s.insights.reduce<string | undefined>(
            (m, i) => (m === undefined || i.createdAt > m ? i.createdAt : m),
            undefined
          ),
          spark: monthlyVolume(s.insights).map((p) => ({ label: p.label, value: p.total })),
        }))
        .sort((a, b) => b.mass - a.mass),
    [signals]
  );

  const rows = ranked.map(({ sig, mass, recent }) => ({
    key: sig.def.id,
    label: sig.def.title,
    value: mass,
    hint: `${sig.insights.length} insights · ${sig.bySeverity['critical'] ?? 0} critical`,
    href: hrefSignal(sig.def.id),
    delta: { current: recent.current, prior: recent.prior, windowLabel: 'vs prior 30d' },
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
          caption="Summed opportunity scores (severity × evidence × persona priority). The top bar is the next design cycle; the delta is the 30-day evidence trend."
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

      <List
        density="spacious"
        hasDividers
        header={
          <Text type="label" color="secondary">
            Case files — every row opens the signal's canonical page
          </Text>
        }
      >
        {ranked.map(({ sig, recent, newest, spark }, i) => (
          <Item
            key={sig.def.id}
            as="li"
            href={hrefSignal(sig.def.id)}
            marker={
              <Text type="supporting" hasTabularNumbers>
                {String(i + 1).padStart(2, '0')}
              </Text>
            }
            label={sig.def.title}
            description={sig.def.question}
            descriptionLines={2}
            align="center"
            endContent={
              <HStack gap={4} vAlign="center">
                <VStack gap={0.5} hAlign="end">
                  <HStack gap={1} vAlign="center">
                    <Text type="supporting" hasTabularNumbers>
                      {sig.insights.length} insights · newest
                    </Text>
                    {newest && <FeedTime iso={newest} />}
                  </HStack>
                  <TrendDelta current={recent.current} prior={recent.prior} windowLabel="vs prior 30d" />
                </VStack>
                {spark.length > 1 && (
                  <VStack width={120}>
                    <Sparkline data={spark} />
                  </VStack>
                )}
              </HStack>
            }
          />
        ))}
      </List>
    </VStack>
  );
}
