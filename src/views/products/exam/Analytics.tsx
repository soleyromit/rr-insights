// views/products/exam/Analytics.tsx — the analytics design spec. All cohort
// numbers here are ILLUSTRATIVE spec data that demonstrate the chart designs
// (Ed Razenbach's z-score methodology, Touro's watch-list model) — they are
// not live student data, and every figure says so.
import { VStack } from '@astryxdesign/core/VStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Chart, ChartAxis, ChartGrid, bar, line, area, referenceLine, useChartColors } from '@astryxdesign/charts';
import { Fig } from '../../../components/charts/Fig';
import { RankedList } from '../../../components/charts/RankedList';
import { SpecSection } from '../spec/SpecSection';
import { hrefInsight } from '../../../lib/links';

const SCORE_DIST = [
  { range: '50-59', cohort: 3, national: 2 },
  { range: '60-69', cohort: 8, national: 6 },
  { range: '70-79', cohort: 22, national: 18 },
  { range: '80-89', cohort: 34, national: 30 },
  { range: '90-100', cohort: 18, national: 22 },
];

const EOR = Array.from({ length: 8 }, (_, i) => ({
  name: `EOR ${i + 1}`,
  cohort: [74, 71, 78, 76, 80, 73, 82, 77][i],
}));

const BLOOM = [
  { key: 'remember', label: 'Remember', value: 0.82 },
  { key: 'understand', label: 'Understand', value: 0.74 },
  { key: 'apply', label: 'Apply', value: 0.61 },
  { key: 'analyze', label: 'Analyze', value: 0.52 },
  { key: 'evaluate', label: 'Evaluate', value: 0.45 },
  { key: 'create', label: 'Create', value: 0.38 },
];

const NCCPA = [
  { key: 'msk', label: 'MSK', value: 91 },
  { key: 'cardio', label: 'Cardio', value: 85 },
  { key: 'gi', label: 'GI', value: 80 },
  { key: 'psych', label: 'Psych', value: 74 },
  { key: 'pulm', label: 'Pulm', value: 72 },
  { key: 'neuro', label: 'Neuro', value: 68 },
  { key: 'derm', label: 'Derm', value: 60 },
];

const BANK_GROWTH = [
  { month: 'Sep', total: 1240, approved: 980 },
  { month: 'Oct', total: 1380, approved: 1100 },
  { month: 'Nov', total: 1520, approved: 1230 },
  { month: 'Dec', total: 1640, approved: 1340 },
  { month: 'Jan', total: 1710, approved: 1410 },
  { month: 'Feb', total: 1780, approved: 1480 },
  { month: 'Mar', total: 1847, approved: 1530 },
];

interface ZRow extends Record<string, unknown> {
  id: string;
  name: string;
  raw: number;
  nat: number;
  sd: number;
  z: number;
}
const Z_ROWS: ZRow[] = [
  { id: 'em', name: 'Emergency Medicine', raw: 412, nat: 404, sd: 28, z: 0.29 },
  { id: 'fm', name: 'Family / Internal Med.', raw: 378, nat: 392, sd: 24, z: -0.58 },
  { id: 'bh', name: 'Behavioral Health', raw: 391, nat: 385, sd: 22, z: 0.27 },
  { id: 'peds', name: 'Pediatrics', raw: 356, nat: 374, sd: 26, z: -0.69 },
  { id: 'surg', name: 'Surgery', raw: 401, nat: 398, sd: 30, z: 0.1 },
  { id: 'wh', name: "Women's Health", raw: 382, nat: 388, sd: 20, z: -0.3 },
  { id: 'eoc', name: 'EOC (End of Curriculum)', raw: 387, nat: 392, sd: 25, z: -0.2 },
];

interface WatchRow extends Record<string, unknown> {
  id: string;
  name: string;
  cohort: string;
  gpa: number;
  pance: number;
  eorZ: number;
  risk: string;
  flags: string;
}
const WATCH: WatchRow[] = [
  { id: 'w1', name: 'Student A (illustrative)', cohort: 'PA2', gpa: 2.9, pance: 58, eorZ: -1.12, risk: 'High', flags: 'EOR-EM fail · PACKRAT-1 declining · GPA < 2.67' },
  { id: 'w2', name: 'Student B (illustrative)', cohort: 'PA3', gpa: 3.1, pance: 68, eorZ: -0.82, risk: 'High', flags: 'EOR-FM fail · 2 makeup exams' },
  { id: 'w3', name: 'Student C (illustrative)', cohort: 'PA2', gpa: 3.2, pance: 72, eorZ: -0.44, risk: 'Medium', flags: 'Conditional standing' },
];

const ILLUSTRATIVE = 'Illustrative spec data — demonstrates the chart design, not live cohort data.';

function ScoreDistChart() {
  const colors = useChartColors();
  const [c1, c2] = colors.categorical(2);
  return (
    <Chart
      data={SCORE_DIST as unknown as Record<string, unknown>[]}
      xKey="range"
      height={200}
      yDomain={[0, 40]}
      series={[bar('cohort', { color: c1, label: 'This cohort' }), bar('national', { color: c2, label: 'National avg' })]}
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

function EorChart() {
  const colors = useChartColors();
  const [c1] = colors.categorical(1);
  return (
    <Chart
      data={EOR as unknown as Record<string, unknown>[]}
      xKey="name"
      height={200}
      yDomain={[0, 100]}
      series={[
        line('cohort', { color: c1, strokeWidth: 2, label: 'Cohort avg' }),
        referenceLine({ y: 77, label: 'Benchmark 77%', strokeDasharray: '3 3', color: colors.structural.axis }),
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

function BankGrowthChart() {
  const colors = useChartColors();
  const [c1, c2] = colors.categorical(2);
  return (
    <Chart
      data={BANK_GROWTH as unknown as Record<string, unknown>[]}
      xKey="month"
      height={180}
      yDomain={[0, 2000]}
      series={[area('total', { color: c1, label: 'Total questions' }), line('approved', { color: c2, strokeWidth: 2, label: 'Approved' })]}
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

export function Analytics() {
  return (
    <VStack gap={6}>
      <SpecSection
        title="Analytics design contracts"
        sub="Two universal chart requirements locked Jul 15 for all analytics: (1) PNG/PDF export plus raw data export, (2) scalable view — summary at surface, expandable to full detail. Every analytics surface must ship both."
      >
        <VStack gap={1}>
          <Link href={hrefInsight('ins-ds-jul-01')}>Design-system chart contract (ins-ds-jul-01) →</Link>
          <Link href={hrefInsight('ins-ce-jul-01')}>Single- vs multi-survey analytics architecture (ins-ce-jul-01) →</Link>
        </VStack>
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Scalability protocol: at 1000+ students the score distribution aggregates into percentile bands, the watch-list
            table virtualizes, competency maps show percentile bands instead of class averages, and item analysis switches to
            a quadrant scatter. Data is structured to support both scales from day one.
          </Text>
        </Card>
      </SpecSection>

      <SpecSection title="Cohort performance views" sub={ILLUSTRATIVE}>
        <Grid columns={{ minWidth: 380, max: 2 }} gap={4}>
          <Fig title="Score distribution — cohort vs national" caption="Reveals whether the cohort clusters in the risk zone; a leftward shift vs national is the early remediation signal.">
            <ScoreDistChart />
          </Fig>
          <Fig title="EOR performance across 8 rotations" caption="Shows which rotations produce under-performers; the dashed 77% line is the PAEA benchmark reference.">
            <EorChart />
          </Fig>
        </Grid>
        <Grid columns={{ minWidth: 380, max: 2 }} gap={4}>
          <Fig title="p-value by Bloom's level" caption="Validates that higher-order questions are harder; red rows fall under the 0.65 threshold — review question quality, not curriculum.">
            <RankedList rows={BLOOM} format={(r) => r.value.toFixed(2)} errorBelow={0.65} />
          </Fig>
          <Fig title="NCCPA blueprint coverage by subject" caption="Replaces Touro's Monster Grid of triple-digit Excel columns. Red bars sit under the 80 blueprint target — Derm and Neuro are the curriculum-review flags.">
            <RankedList rows={NCCPA} format={(r) => `${r.value}/80`} errorBelow={80} />
          </Fig>
        </Grid>
        <Fig title="Question bank growth" caption="Tracks approved vs total — the gap between the lines is the governance backlog.">
          <BankGrowthChart />
        </Fig>
      </SpecSection>

      <SpecSection
        title="EOR z-score view (Ed Razenbach methodology)"
        sub="Formula: (student score − national mean) ÷ national SD. Ed: a raw 412 in EM is not the same as a 382 in women's health — normalization is required. National mean + SD come from PAEA per exam."
      >
        <Table<ZRow>
          data={Z_ROWS}
          idKey="id"
          density="compact"
          columns={[
            { key: 'name', header: 'Specialty', width: proportional(2), renderCell: (r) => <Text type="body">{r.name}</Text> },
            { key: 'raw', header: 'Raw', width: pixel(70), align: 'end', renderCell: (r) => <Text type="body" hasTabularNumbers>{r.raw}</Text> },
            { key: 'nat', header: 'Nat. mean', width: pixel(90), align: 'end', renderCell: (r) => <Text type="supporting" hasTabularNumbers>{r.nat}</Text> },
            { key: 'sd', header: 'SD', width: pixel(60), align: 'end', renderCell: (r) => <Text type="supporting" hasTabularNumbers>{r.sd}</Text> },
            {
              key: 'z',
              header: 'z-score',
              width: pixel(110),
              align: 'end',
              renderCell: (r) => (
                <Badge variant={r.z >= 0 ? 'success' : r.z >= -1 ? 'warning' : 'error'} label={`${r.z >= 0 ? '+' : ''}${r.z.toFixed(2)} z`} />
              ),
            },
          ]}
        />
        <Text type="supporting" as="p">
          {ILLUSTRATIVE}
        </Text>
      </SpecSection>

      <SpecSection
        title="At-risk watch-list (Touro model)"
        sub="Auto-flagged by threshold, no manual input: GPA < 2.67, 2+ EOR failures, 2+ makeup exams, or conditional academic standing. PANCE predictor threshold: 75."
      >
        <Blockquote cite="Mary · Touro">
          Wouldn't it be nice if you saw a highlight on a student because they weren't meeting criteria?
        </Blockquote>
        <Table<WatchRow>
          data={WATCH}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'name', header: 'Student', width: proportional(2), renderCell: (r) => <Text type="body">{r.name}</Text> },
            { key: 'cohort', header: 'Cohort', width: pixel(70), renderCell: (r) => <Text type="supporting">{r.cohort}</Text> },
            { key: 'pance', header: 'PANCE pred.', width: pixel(100), align: 'end', renderCell: (r) => <Text type="body" hasTabularNumbers>{r.pance}</Text> },
            { key: 'eorZ', header: 'EOR z', width: pixel(80), align: 'end', renderCell: (r) => <Text type="supporting" hasTabularNumbers>{r.eorZ.toFixed(2)}</Text> },
            { key: 'risk', header: 'Risk', width: pixel(90), renderCell: (r) => <Badge variant={r.risk === 'High' ? 'error' : 'warning'} label={r.risk} /> },
            { key: 'flags', header: 'Flags', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.flags}</Text> },
          ]}
        />
        <Text type="supporting" as="p">
          {ILLUSTRATIVE}
        </Text>
      </SpecSection>

      <SpecSection
        title="Question-quality signals"
        sub="Live flag rates are design signals, not knowledge signals: a question flagged by ≥20% of students during an exam indicates ambiguous wording or a wrong key. Negative point-biserial means weaker students outperformed stronger ones — retire or rewrite before the next exam."
      >
        <Blockquote cite="Ed Razenbach · DCE, Touro PA program · Feb 26, 2026">
          I give it the PACKRAT results by topic and it generates personalised questions for each student. Two students failed
          family medicine but each got a completely different question set from me.
        </Blockquote>
      </SpecSection>
    </VStack>
  );
}
