// components/charts/ColumnBarChart.tsx — single-series magnitude over named
// checkpoints (v19.15). A real column chart (axis, grid, tooltip) — not a
// ranked-list progress bar — for when the story is a trend across a small,
// labeled set of points (an escalation, a count over dated checkpoints).
import { Chart, ChartAxis, ChartGrid, useChartColors } from '@astryxdesign/charts';
import { bar } from '@astryxdesign/charts';

export interface ColumnBarDatum {
  label: string;
  value: number;
  /** Optional per-bar semantic color key; defaults to the negative/warning ramp. */
  tone?: 'positive' | 'negative' | 'warning' | 'neutral';
}

export interface ColumnBarChartProps {
  data: ColumnBarDatum[];
  height?: number;
  /** Uniform tone for every bar when data doesn't specify one. */
  defaultTone?: ColumnBarDatum['tone'];
}

export function ColumnBarChart({ data, height = 220, defaultTone = 'negative' }: ColumnBarChartProps) {
  const colors = useChartColors();
  const yMax = Math.max(...data.map((d) => d.value), 1);
  const toneColor = (t: ColumnBarDatum['tone']) =>
    t === 'positive' ? colors.semantic.positive
    : t === 'warning' ? colors.semantic.warning
    : t === 'neutral' ? colors.semantic.neutral
    : colors.semantic.negative;
  return (
    <Chart
      data={data as unknown as Record<string, unknown>[]}
      xKey="label"
      height={height}
      yDomain={[0, Math.ceil(yMax * 1.15)]}
      series={[
        bar('value', {
          radius: 4,
          color: (d: Record<string, unknown>) => toneColor((d.tone as ColumnBarDatum['tone']) ?? defaultTone),
        }),
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
  );
}
