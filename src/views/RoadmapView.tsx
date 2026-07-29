// views/RoadmapView.tsx — Roadmap (v19 redesign). Countdown to the immovable
// dates, then a REAL date-axis milestone chart: months on a linear x-axis
// (a band scale can't host the 'today' reference line — verified against the
// charts package), one dot lane per product on y, hard deadlines ringed in the
// reserved negative status color. Below it, the milestone table grouped by
// product with a Δdays column. Learning Contracts holds its lane and its group
// with zero dated milestones — the empty row is the finding, not a bug.
// Milestone state derives from parsePhaseDate/milestoneState only; the data's
// Milestone.status field is never read.
import { useMemo, useState } from 'react';
import { Chart, ChartAxis, dot, referenceLine, useChartColors } from '@astryxdesign/charts';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Link } from '@astryxdesign/core/Link';
import { Badge } from '@astryxdesign/core/Badge';
import { Token } from '@astryxdesign/core/Token';
import { Table, pixel, proportional, useTableGroupedRows } from '@astryxdesign/core/Table';
import { MILESTONES } from '../data/personas';
import { PRODUCTS, getProduct } from '../data/products';
import { parsePhaseDate, computePhaseStates, milestoneState } from '../lib/phaseDates';
import { productFacts } from '../lib/selectors';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { QueryLink } from '../components/story/QueryLink';
import { StalenessMeter } from '../components/story/StalenessMeter';
import { hrefProduct, hrefInsights } from '../lib/links';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const monthOrdinal = (d: Date) => d.getFullYear() * 12 + d.getMonth();
const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

interface Dated {
  date: Date;
  dateLabel: string;
  label: string;
  description: string;
  hard: boolean;
  productId: string;
}

interface MsRow extends Record<string, unknown> {
  id: string;
  m: Dated;
  deltaDays: number;
  passed: boolean;
}

const signedDays = (n: number) => `${n >= 0 ? '+' : ''}${n}d`;

export function RoadmapView() {
  const today = useMemo(() => new Date(), []);
  const colors = useChartColors();
  const productColors = colors.categorical(PRODUCTS.length);

  const dated: Dated[] = useMemo(
    () =>
      MILESTONES.flatMap((m) => {
        const date = parsePhaseDate(m.date);
        if (!date || !m.productId) return [];
        return [{ date, dateLabel: m.date, label: m.label, description: m.description, hard: !!m.isHardDeadline, productId: m.productId }];
      }).sort((a, b) => a.date.getTime() - b.date.getTime()),
    []
  );

  // ── Month bins for the linear x-axis (today's month always included) ──
  const bins = useMemo(() => {
    const ords = [...dated.map((m) => monthOrdinal(m.date)), monthOrdinal(today)];
    const lo = Math.min(...ords);
    const hi = Math.max(...ords);
    const out: { ord: number; label: string }[] = [];
    for (let o = lo; o <= hi; o++) {
      out.push({ ord: o, label: `${MONTH_NAMES[o % 12]} '${String(Math.floor(o / 12)).slice(2)}` });
    }
    return out;
  }, [dated, today]);
  const firstOrd = bins[0].ord;
  const xOf = (d: Date) => monthOrdinal(d) - firstOrd + (d.getDate() - 1) / daysInMonth(d);

  // Lane per product: first product (Exam) on top.
  const laneOf = (productId: string) => PRODUCTS.length - PRODUCTS.findIndex((p) => p.id === productId);
  const laneNames = new Map(PRODUCTS.map((p) => [laneOf(p.id), p.shortName]));

  // ── Chart rows: one per milestone; coincident same-product dates nudged so
  // every dot stays visible and the tooltip lookup stays 1:1. ──
  const { chartRows, byX } = useMemo(() => {
    const seen = new Map<string, number>();
    const rows: Record<string, unknown>[] = [];
    const lookup = new Map<number, Dated>();
    for (const m of dated) {
      const rawX = monthOrdinal(m.date) - firstOrd + (m.date.getDate() - 1) / daysInMonth(m.date);
      const dupKey = `${m.productId}|${rawX}`;
      const k = seen.get(dupKey) ?? 0;
      seen.set(dupKey, k + 1);
      const x = rawX + k * 0.18;
      const row: Record<string, unknown> = { x, [m.productId]: laneOf(m.productId) };
      if (m.hard) row.hard = laneOf(m.productId);
      rows.push(row);
      lookup.set(x, m);
    }
    return { chartRows: rows, byX: lookup };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dated, firstOrd]);

  const todayX = xOf(today);

  const upcoming = dated.filter((m) => milestoneState(m.dateLabel, today) !== 'passed');
  const nextHard = upcoming.filter((m) => m.hard).slice(0, 3);
  const daysLeft = (d: Date) => Math.max(0, Math.round((d.getTime() - today.getTime()) / 86400000));

  // ── Milestone table grouped by product ──
  const msRows: MsRow[] = useMemo(
    () =>
      dated.map((m, i) => ({
        id: `${m.productId}-${i}-${m.label}`,
        m,
        deltaDays: Math.round((m.date.getTime() - today.getTime()) / 86400000),
        passed: milestoneState(m.dateLabel, today) === 'passed',
      })),
    [dated, today]
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const grouped = useTableGroupedRows<MsRow>({
    data: msRows,
    groupBy: (r) => r.m.productId,
    collapsedGroups,
    onToggleGroup: (key) =>
      setCollapsedGroups((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else next.add(key);
        return next;
      }),
    getRowKey: (r) => r.id,
    groupOrder: PRODUCTS.map((p) => p.id),
    renderGroupHeader: (key, count) => {
      const p = getProduct(key);
      return (
        <HStack gap={3} vAlign="center" wrap="wrap">
          <Text type="body" weight="semibold">
            {p?.name ?? key}
          </Text>
          <Text type="supporting" hasTabularNumbers>
            {count} dated milestone{count === 1 ? '' : 's'}
          </Text>
          <QueryLink
            href={hrefInsights({ product: key, severity: 'critical' })}
            count={productFacts(key).critical}
            label="blocking criticals"
            isStandalone={false}
          />
        </HStack>
      );
    },
  });

  const lcFacts = productFacts('learning-contracts');

  return (
    <VStack gap={5} padding={6}>
      <PageHeader
        title="Roadmap"
        lede="Every milestone on one calendar, product by product, with the hard deadlines that do not move — state derives from the dates in the plan, and the countdown only counts what is ahead."
        meta={`${dated.length} dated milestones · ${upcoming.length} ahead · today is ${fmt(today)}`}
      />

      <Grid columns={{ minWidth: 240, max: 3 }} gap={4}>
        {nextHard.map((m) => {
          const p = getProduct(m.productId);
          return (
            <Card key={m.label} padding={4}>
              <VStack gap={1}>
                <HStack gap={2} vAlign="end">
                  <Heading level={2} type="display-2">
                    {daysLeft(m.date)}
                  </Heading>
                  <Text type="label" color="secondary">
                    days
                  </Text>
                </HStack>
                <Text type="body" weight="semibold">
                  {m.label}
                </Text>
                <Text type="supporting">{fmt(m.date)}</Text>
                <QueryLink
                  href={hrefProduct(m.productId)}
                  count={productFacts(m.productId).critical}
                  label={`blocking criticals · ${p?.shortName ?? m.productId} hub`}
                />
              </VStack>
            </Card>
          );
        })}
      </Grid>

      <Fig
        title="Milestone timeline by product"
        n={dated.length}
        caption="Each dot is a dated milestone, placed by its real date on the month axis; each product holds one lane. Red-ringed dots are hard deadlines — the distance from the today line to the next ring is the real sprint budget. Hover any dot for the milestone."
        note="Learning Contracts holds a lane with zero dated milestones — the empty row is the honest state of that plan, not missing data."
      >
        <Chart
          data={chartRows}
          xKey="x"
          height={260}
          margin={{ left: 84 }}
          xDomain={[-0.3, bins.length - 1 + 0.9]}
          yDomain={[0.5, PRODUCTS.length + 0.5]}
          series={[
            referenceLine({ x: todayX, label: 'today', strokeDasharray: '3 3', color: colors.structural.axis }),
            dot('hard', { color: colors.semantic.negative, radius: 8, opacity: 0.4, label: 'Hard deadline' }),
            ...PRODUCTS.map((p, i) =>
              dot(p.id, { color: productColors[i], radius: 4.5, label: p.shortName })
            ),
          ]}
          axes={
            <>
              <ChartAxis
                position="bottom"
                tickCount={bins.length}
                tickFormat={(v) => {
                  const i = Number(v);
                  return Number.isInteger(i) && bins[i] ? bins[i].label : '';
                }}
              />
              <ChartAxis
                position="left"
                tickCount={PRODUCTS.length}
                tickFormat={(v) => {
                  const i = Number(v);
                  return Number.isInteger(i) ? laneNames.get(i) ?? '' : '';
                }}
              />
            </>
          }
          legend={{
            items: [
              ...PRODUCTS.filter((p) => dated.some((m) => m.productId === p.id)).map((p) => ({
                label: p.shortName,
                color: productColors[PRODUCTS.findIndex((q) => q.id === p.id)],
              })),
              { label: 'hard deadline', color: colors.semantic.negative },
            ],
          }}
          tooltip={{
            render: (xValue) => {
              const m = byX.get(Number(xValue));
              if (!m) return null;
              const p = getProduct(m.productId);
              return (
                <VStack gap={0.5}>
                  <Text type="label">{m.label}</Text>
                  <Text type="supporting" hasTabularNumbers>
                    {fmt(m.date)} · {p?.shortName ?? m.productId}
                    {m.hard ? ' · hard deadline' : ''}
                  </Text>
                </VStack>
              );
            },
          }}
        />
      </Fig>

      <Fig
        title="Milestone register, grouped by product"
        n={dated.length}
        caption="Δdays counts from today: negative is passed, positive is runway. Group headers carry each product's live blocking-critical query."
      >
        <VStack gap={3}>
          <Table<MsRow>
            data={grouped.data}
            idKey={grouped.idKey}
            density="balanced"
            hasHover
            plugins={{ grouped: grouped.plugin }}
            columns={[
              {
                key: 'date',
                header: 'Date',
                width: pixel(170),
                // Group-header rows are Proxies whose fields resolve to '' — guard
                // nested access before the plugin swaps in the full-width header.
                renderCell: (r: MsRow) =>
                  r.m ? (
                    <HStack gap={2} vAlign="center" wrap="wrap">
                      <Text type="supporting" hasTabularNumbers>
                        {fmt(r.m.date)}
                      </Text>
                      {r.passed && <Badge variant="neutral" label="passed" />}
                    </HStack>
                  ) : null,
              },
              {
                key: 'milestone',
                header: 'Milestone',
                width: proportional(3),
                renderCell: (r: MsRow) =>
                  r.m ? (
                    <VStack gap={0.5}>
                      <Text type="body" weight="semibold">
                        {r.m.label}
                      </Text>
                      <Text type="supporting" as="p" maxLines={2} textWrap="pretty">
                        {r.m.description}
                      </Text>
                    </VStack>
                  ) : null,
              },
              {
                key: 'product',
                header: 'Product',
                width: pixel(210),
                renderCell: (r: MsRow) =>
                  r.m ? (
                    <QueryLink
                      href={hrefProduct(r.m.productId)}
                      count={productFacts(r.m.productId).n}
                      label={`insights · ${getProduct(r.m.productId)?.shortName ?? r.m.productId}`}
                      isStandalone={false}
                    />
                  ) : null,
              },
              {
                key: 'hard',
                header: 'Hard',
                width: pixel(80),
                renderCell: (r: MsRow) => (r.m && r.m.hard ? <Badge variant="error" label="hard" /> : null),
              },
              {
                key: 'delta',
                header: 'Δdays',
                width: pixel(90),
                align: 'end',
                renderCell: (r: MsRow) =>
                  r.m ? (
                    <Text type="body" hasTabularNumbers>
                      {signedDays(r.deltaDays)}
                    </Text>
                  ) : null,
              },
            ]}
          />
          <HStack gap={3} vAlign="center" wrap="wrap">
            <Text type="body" weight="semibold">
              Learning Contracts — 0 dated milestones
            </Text>
            <StalenessMeter newestDate={lcFacts.newestDate} staleDays={lcFacts.staleDays} />
            <QueryLink
              href={hrefProduct('learning-contracts')}
              count={lcFacts.n}
              label="insights · LC hub"
              isStandalone={false}
            />
          </HStack>
        </VStack>
      </Fig>

      <Card padding={4}>
        <VStack gap={3}>
          <VStack gap={0}>
            <Text type="label" color="secondary">
              Phase tracks — state derived from dates in the plan
            </Text>
            <Text type="supporting">
              Passed phases are marked done, the filled phase is the next dated one, phases without a parseable date claim no state.
            </Text>
          </VStack>
          {PRODUCTS.map((p) => {
            const states = computePhaseStates(p.roadmapPhases.map((ph) => ph.phase), today);
            return (
              <HStack key={p.id} gap={3} vAlign="center" wrap="wrap">
                <Link href={hrefProduct(p.id)}>
                  <Text type="supporting">{p.shortName}</Text>
                </Link>
                {p.roadmapPhases.map((ph, i) => {
                  const st = states[i].state;
                  return (
                    <Token
                      key={ph.phase}
                      label={st === 'passed' ? `✓ ${ph.phase}` : st === 'unscheduled' ? `${ph.phase} ·?` : ph.phase}
                      color={st === 'next' ? 'blue' : 'default'}
                      href={hrefProduct(p.id)}
                    />
                  );
                })}
              </HStack>
            );
          })}
        </VStack>
      </Card>
    </VStack>
  );
}
