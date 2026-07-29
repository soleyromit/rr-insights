// components/charts/DivergingBarChart.tsx — signed values around a zero
// baseline (v19). The y≥0-for-counts rule deliberately does not apply here:
// these are deltas/scores with real polarity, so the domain spans the data and
// zero is drawn as the reference. Single series; the legend names the poles.
import { Chart, ChartAxis, ChartGrid, ChartLegend, bar, referenceLine, useChartColors } from '@astryxdesign/charts';
import { VStack } from '@astryxdesign/core/VStack';

export interface DivergingDatum {
  label: string;
  value: number;
}

export interface DivergingBarChartProps {
  data: DivergingDatum[];
  height?: number;
  poles: { positive: string; negative: string };
  /** Zero point of the scale (default 0) — e.g. 50 for a 0–100 sentiment scale. */
  midpoint?: number;
}

export function DivergingBarChart({ data, height = 240, poles, midpoint = 0 }: DivergingBarChartProps) {
  const colors = useChartColors();
  // Explicit poles: blue = positive, red = negative. The library's
  // diverging.positiveNegative(2) resolves positive to RED (and green–red is
  // a CVD trap anyway), so we pin the conventional, colorblind-safe pair.
  const pos = colors.categorical(1)[0];
  const neg = colors.semantic.negative;
  const values = data.map((d) => d.value);
  const lo = Math.min(...values, midpoint);
  const hi = Math.max(...values, midpoint);
  const pad = Math.max(1, Math.round((hi - lo) * 0.1));
  return (
    <VStack gap={2}>
      <Chart
        data={data as unknown as Record<string, unknown>[]}
        xKey="label"
        height={height}
        yDomain={[lo - pad, hi + pad]}
        series={[
          bar('value', {
            color: (d: Record<string, unknown>) => ((d.value as number) >= midpoint ? pos : neg),
          }),
          referenceLine({ y: midpoint, color: colors.structural.axis }),
        ]}
        grid={<ChartGrid horizontal tickCount={4} />}
        axes={
          <>
            <ChartAxis position="bottom" />
            <ChartAxis position="left" tickCount={4} />
          </>
        }
        tooltip
      />
      <ChartLegend
        items={[
          { label: poles.positive, color: pos },
          { label: poles.negative, color: neg },
        ]}
      />
    </VStack>
  );
}
