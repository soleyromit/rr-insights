// views/NPSView.tsx — NPS Intelligence 2025 (v18 Astryx rebuild).
// The attitudinal baseline for all design work: 1,494 responses. Distribution
// and segment mix render as stacked bars on the semantic palette (radar and
// pie retired); persona and discipline NPS render as ranked meters on a
// −100..+100 scale; every theme links to the NPS-sourced evidence.
import { Chart, ChartAxis, ChartGrid, bar, useChartColors } from '@astryxdesign/charts';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { SevBadge } from '../components/ui/sev';
import { hrefInsights } from '../lib/links';
import type { SeverityLevel } from '../types';

/* ─── NPS 2025 data (hardcoded report — Mar 28, 2026) ─────────────────── */
const STUDENT_DIST = [
  { score: '0', count: 207 }, { score: '1', count: 73 }, { score: '2', count: 86 },
  { score: '3', count: 107 }, { score: '4', count: 96 }, { score: '5', count: 160 },
  { score: '6', count: 107 }, { score: '7', count: 115 }, { score: '8', count: 104 },
  { score: '9', count: 74 }, { score: '10', count: 153 },
];

const SEGMENT_DATA = [
  { name: 'Detractors (0–6)', value: 836, pct: 65 },
  { name: 'Passives (7–8)', value: 219, pct: 17 },
  { name: 'Promoters (9–10)', value: 227, pct: 18 },
];

const PERSONA_NPS = [
  { persona: 'Student', nps: -47.5, n: 1282 },
  { persona: 'Faculty', nps: -49.1, n: 108 },
  { persona: 'Admin', nps: -4.8, n: 104 },
  { persona: 'Sites (SCCE)', nps: 8.0, n: 8 },
  { persona: 'Approve', nps: 87.5, n: 8 },
];

const DOMAIN_NPS = [
  { domain: 'Physical Therapy', avg: 4.46, n: 150, nps: -52 },
  { domain: 'Emerging Disciplines', avg: 4.61, n: 170, nps: -49 },
  { domain: 'Occupational Therapy', avg: 4.91, n: 68, nps: -46 },
  { domain: 'Physician Assistant', avg: 5.04, n: 161, nps: -44 },
  { domain: 'Nursing', avg: 5.13, n: 608, nps: -42 },
  { domain: 'Speech-Language Path', avg: 5.36, n: 14, nps: -38 },
];

const THEMES: { theme: string; count: number; severity: SeverityLevel; product: string; quote: string }[] = [
  { theme: 'Navigation / findability', count: 218, severity: 'critical', product: 'Platform', quote: 'I cannot find hour tracking. Many features in confusing locations.' },
  { theme: 'Mobile clocking UX', count: 167, severity: 'critical', product: 'Skills / LC', quote: 'Should be able to tap check-in once and it saves.' },
  { theme: 'Preceptor form length', count: 134, severity: 'critical', product: 'FaaS', quote: 'Lengthy evaluations discouraged preceptors from filling them out.' },
  { theme: 'Login friction', count: 112, severity: 'high', product: 'Platform', quote: 'Have to log in multiple times to get to the homepage.' },
  { theme: 'Compliance false positives', count: 98, severity: 'high', product: 'FaaS', quote: 'Shows requirement missing after program cleared it. Causes anxiety.' },
  { theme: 'Diagnosis / log limitations', count: 87, severity: 'high', product: 'Skills / LC', quote: 'Extremely limited diagnosis tab. Cannot set overall hour total.' },
  { theme: 'Confusing UI labels', count: 72, severity: 'medium', product: 'Platform', quote: 'This is so confusing / it is not intuitive.' },
  { theme: 'No multi-placement view', count: 61, severity: 'high', product: 'Skills', quote: 'Cannot see total hours across multiple placements except on mobile app.' },
  { theme: 'No edit after submit', count: 54, severity: 'medium', product: 'FaaS', quote: 'The inability to edit something after being passed in.' },
  { theme: 'Support response time', count: 48, severity: 'medium', product: 'Platform', quote: 'I hate I cannot speak to anyone. Delayed response causes me anxiety.' },
];

const APPROVE_ATTRS = [
  { attr: 'Expertise on requirements', value: 6 },
  { attr: 'Responsiveness', value: 6 },
  { attr: 'Turnaround time', value: 4 },
  { attr: 'Email support for students', value: 3 },
  { attr: 'Quality of review', value: 3 },
];

// Model-based projection (not measured) — kept as data, rendered as a table.
const DESIGN_LEVERAGE = [
  { subject: 'Navigation', before: 20, after: 55 },
  { subject: 'Mobile UX', before: 25, after: 60 },
  { subject: 'Form length', before: 35, after: 65 },
  { subject: 'Compliance', before: 30, after: 60 },
  { subject: 'Login', before: 40, after: 70 },
];

/* ─── Charts (semantic palette: negative / neutral / positive) ─────────── */

function DistributionChart() {
  const colors = useChartColors();
  const data = STUDENT_DIST.map((d) => {
    const s = Number(d.score);
    return {
      score: d.score,
      detractors: s <= 6 ? d.count : 0,
      passives: s >= 7 && s <= 8 ? d.count : 0,
      promoters: s >= 9 ? d.count : 0,
    };
  });
  const yMax = Math.max(...STUDENT_DIST.map((d) => d.count));
  return (
    <Chart
      data={data as unknown as Record<string, unknown>[]}
      xKey="score"
      height={200}
      yDomain={[0, Math.ceil(yMax * 1.1)]}
      series={[
        bar('detractors', { stack: 'seg', color: colors.semantic.negative, label: 'Detractors (0–6)' }),
        bar('passives', { stack: 'seg', color: colors.semantic.neutral, label: 'Passives (7–8)' }),
        bar('promoters', { stack: 'seg', color: colors.semantic.positive, label: 'Promoters (9–10)' }),
      ]}
      grid={<ChartGrid horizontal tickCount={4} />}
      axes={
        <>
          <ChartAxis position="bottom" />
          <ChartAxis position="left" tickCount={4} />
        </>
      }
      legend
      tooltip
    />
  );
}

function SegmentBar() {
  const colors = useChartColors();
  const data = [{ category: 'Students (n=1,282)', detractors: 836, passives: 219, promoters: 227 }];
  return (
    <Chart
      data={data as unknown as Record<string, unknown>[]}
      xKey="category"
      height={140}
      yDomain={[0, 1350]}
      series={[
        bar('detractors', { stack: 'seg', color: colors.semantic.negative, label: 'Detractors 836 (65%)' }),
        bar('passives', { stack: 'seg', color: colors.semantic.neutral, label: 'Passives 219 (17%)' }),
        bar('promoters', { stack: 'seg', color: colors.semantic.positive, label: 'Promoters 227 (18%)' }),
      ]}
      grid={<ChartGrid horizontal tickCount={3} />}
      axes={
        <>
          <ChartAxis position="bottom" />
          <ChartAxis position="left" tickCount={3} />
        </>
      }
      legend
      tooltip
    />
  );
}

interface LeverageRow extends Record<string, unknown> {
  id: string;
  subject: string;
  before: number;
  after: number;
}

const signed = (v: number) => `${v > 0 ? '+' : ''}${v}`;

export function NPSView() {
  const personaRows = PERSONA_NPS.map((p) => ({
    key: p.persona,
    label: p.persona,
    value: p.nps + 100, // shifted −100..+100 → 0..200 so the meter stays monotonic
    hint: `n=${p.n.toLocaleString('en-US')}`,
    href: hrefInsights({ source: 'NPS' }),
  })).sort((a, b) => b.value - a.value);

  const domainRows = DOMAIN_NPS.map((d) => ({
    key: d.domain,
    label: d.domain,
    value: Math.round(d.nps + 100),
    hint: `n=${d.n} · avg ${d.avg}`,
    href: undefined,
  })).sort((a, b) => b.value - a.value);

  const leverageRows: LeverageRow[] = DESIGN_LEVERAGE.map((d) => ({ id: d.subject, ...d }));

  return (
    <VStack gap={5} padding={6} maxWidth={1100}>
      <PageHeader
        title="NPS Intelligence — 2025"
        lede="1,494 responses across Exxat Prism, Exxat One Sites, and Approve, with textual analysis of 1,275 student qualitative responses — the attitudinal baseline for all design work."
        meta="Student −47.5 (n=1,282) · Faculty −49.1 (n=108) · Admin −4.8 (n=104) · Sites +8 (n=8) · Approve +87.5 (n=8)"
      />

      <Grid columns={{ minWidth: 380, max: 2 }} gap={4}>
        <Fig
          title="Student score distribution (n=1,282)"
          caption="Bimodal: mass at 0–3 and 5–6, almost no 4s or 8–9s. The pattern is hate or tolerate, near zero delight — the design target is the missing right-hand mode."
        >
          <DistributionChart />
        </Fig>
        <Fig
          title="Segment mix"
          caption="NPS = % promoters − % detractors = 18 − 65 = −47. Moving passives to promoters is slower leverage than removing detractor causes below."
        >
          <SegmentBar />
        </Fig>
      </Grid>

      <Grid columns={{ minWidth: 380, max: 2 }} gap={4}>
        <Fig
          title="NPS by persona — the design priority signal"
          caption="Bars sit on a −100..+100 scale (red = negative NPS). Student and faculty are near-equivalent in dissatisfaction: those two personas are the design priority for 2026–2027. Each row opens the NPS-sourced evidence."
        >
          <RankedList rows={personaRows} errorBelow={100} format={(r) => signed(Math.round((r.value - 100) * 10) / 10)} />
        </Fig>
        <Fig
          title="Student NPS by discipline"
          caption="Bars on the same −100..+100 scale. Nursing is 608 responses (47% of volume) — Nursing improvements move the overall metric most."
        >
          <RankedList rows={domainRows} errorBelow={100} format={(r) => signed(r.value - 100)} />
        </Fig>
      </Grid>

      <Card padding={4}>
        <VStack gap={3}>
          <HStack hAlign="between" vAlign="center">
            <Text type="label" color="secondary">
              Detractor themes — ranked by frequency (835 negative responses analyzed)
            </Text>
            <Link href={hrefInsights({ source: 'NPS' })}>All NPS-sourced insights →</Link>
          </HStack>
          <VStack gap={3}>
            {THEMES.map((t, i) => (
              <HStack key={t.theme} gap={3} hAlign="between">
                <HStack gap={2}>
                  <Text type="supporting" hasTabularNumbers>
                    {String(i + 1).padStart(2, '0')}
                  </Text>
                  <VStack gap={0.5}>
                    <HStack gap={2} vAlign="center" wrap="wrap">
                      <Link href={hrefInsights({ source: 'NPS', q: t.theme.split(' / ')[0] })}>
                        <Text type="body" weight="semibold">
                          {t.theme}
                        </Text>
                      </Link>
                      <SevBadge severity={t.severity} />
                      <Text type="supporting">{t.product}</Text>
                    </HStack>
                    <Text type="supporting" as="p" textWrap="pretty">
                      "{t.quote}"
                    </Text>
                  </VStack>
                </HStack>
                <Text type="body" hasTabularNumbers textWrap="nowrap">
                  {t.count} mentions
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Card>

      <Grid columns={{ minWidth: 380, max: 2 }} gap={4}>
        <Fig
          title="Approve (+87.5) — what the highest NPS product does right"
          caption="Attribute mentions from Approve responses. Managed service: human expertise plus fast response wins where self-service fails — every FaaS feature should ask whether it matches what Approve does manually."
        >
          <RankedList rows={APPROVE_ATTRS.map((a) => ({ key: a.attr, label: a.attr, value: a.value, hint: undefined, href: undefined }))} format={(r) => `${r.value} mentions`} />
        </Fig>

        <Fig
          title="Projected satisfaction lift per theme"
          caption="Estimated satisfaction score (0–10) before and after design fix. Model-based, not measured — treat as a prioritization sketch, not a forecast."
        >
          <Table<LeverageRow>
            data={leverageRows}
            idKey="id"
            density="compact"
            columns={[
              { key: 'subject', header: 'Theme', width: proportional(2), renderCell: (r: LeverageRow) => <Text type="body">{r.subject}</Text> },
              { key: 'before', header: 'Before', width: pixel(80), align: 'end', renderCell: (r: LeverageRow) => <Text type="body" hasTabularNumbers>{r.before}</Text> },
              { key: 'after', header: 'After', width: pixel(80), align: 'end', renderCell: (r: LeverageRow) => <Text type="body" hasTabularNumbers>{r.after}</Text> },
              { key: 'delta', header: 'Δ', width: pixel(70), align: 'end', renderCell: (r: LeverageRow) => <Text type="body" hasTabularNumbers>{signed(r.after - r.before)}</Text> },
            ]}
          />
        </Fig>
      </Grid>

      <Grid columns={{ minWidth: 280, max: 3 }} gap={4}>
        <Card variant="muted" padding={4}>
          <VStack gap={1}>
            <Text type="label" color="secondary">
              Fix navigation first
            </Text>
            <Text type="body" as="p" textWrap="pretty">
              218 mentions. Cannot find hour tracking; features in unexpected locations. Every product home screen must answer: what do I do right now?
            </Text>
          </VStack>
        </Card>
        <Card variant="muted" padding={4}>
          <VStack gap={1}>
            <Text type="label" color="secondary">
              Mobile is not optional
            </Text>
            <Text type="body" as="p" textWrap="pretty">
              167 mentions from clinical students. Check-in must be one tap; more than 2 steps means abandonment. Mobile-first is the mandate for Skills and LC.
            </Text>
          </VStack>
        </Card>
        <Card variant="muted" padding={4}>
          <VStack gap={1}>
            <Text type="label" color="secondary">
              Nursing-first has highest leverage
            </Text>
            <Text type="body" as="p" textWrap="pretty">
              47% of total volume. Fix Nursing pains (compliance false positives, mobile time entry, preceptor form length) and overall NPS moves most.
            </Text>
          </VStack>
        </Card>
      </Grid>

      <Text type="supporting">
        {SEGMENT_DATA.map((s) => `${s.name}: ${s.value} (${s.pct}%)`).join(' · ')} · Exxat Prism + One Sites + Approve · Mar 28, 2026
      </Text>
    </VStack>
  );
}
