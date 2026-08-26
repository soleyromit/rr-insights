// components/charts/StackedBarChart.tsx — one stacked bar per category
// (v19.15). Generalizes SeverityStackChart's pattern to arbitrary named
// segments (e.g. accepted/declined/no-response) instead of the fixed
// severity scale — for composition-of-a-whole stories, not magnitude ranking.
import { Chart, ChartAxis, ChartGrid, ChartLegend, bar, useChartColors } from '@astryxdesign/charts';
import { VStack } from '@astryxdesign/core/VStack';

export interface StackedBarSegment {
  key: string;
  label: string;
  tone: 'positive' | 'negative' | 'warning' | 'neutral';
}

export interface StackedBarChartProps {
  data: Record<string, unknown>[];
  xKey: string;
  segments: StackedBarSegment[];
  height?: number;
}

export function StackedBarChart({ data, xKey, segments, height = 200 }: StackedBarChartProps) {
  const colors = useChartColors();
  const toneColor = (t: StackedBarSegment['tone']) =>
    t === 'positive' ? colors.semantic.positive
    : t === 'warning' ? colors.semantic.warning
    : t === 'neutral' ? colors.semantic.neutral
    : colors.semantic.negative;
  const yMax = Math.max(...data.map((d) => segments.reduce((sum, s) => sum + (Number(d[s.key]) || 0), 0)), 1);
  return (
    <VStack gap={2}>
      <Chart
        data={data}
        xKey={xKey}
        height={height}
        yDomain={[0, Math.ceil(yMax * 1.1)]}
        series={segments.map((s) => bar(s.key, { stack: 'total', color: toneColor(s.tone), label: s.label }))}
        grid={<ChartGrid horizontal tickCount={4} />}
        axes={
          <>
            <ChartAxis position="bottom" />
            <ChartAxis position="left" tickCount={4} />
          </>
        }
        tooltip
      />
      <ChartLegend items={segments.map((s) => ({ label: s.label, color: toneColor(s.tone) }))} />
    </VStack>
  );
}
