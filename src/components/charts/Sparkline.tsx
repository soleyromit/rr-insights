// components/charts/Sparkline.tsx — a trend in 40px (v19). No axes, no grid, no
// legend, no tooltip: the enclosing tile carries the link and the numbers. The
// last point gets a dot so "where we are now" is readable at a glance.
import { Chart, line, dot, useChartColors } from '@astryxdesign/charts';

export interface SparklinePoint {
  label: string;
  value: number;
}

export interface SparklineProps {
  data: SparklinePoint[];
  height?: number;
  tone?: 'accent' | 'neutral';
}

export function Sparkline({ data, height = 40, tone = 'accent' }: SparklineProps) {
  const colors = useChartColors();
  const color = tone === 'accent' ? colors.categorical(1)[0] : colors.semantic.neutral;
  const max = Math.max(...data.map((d) => d.value), 1);
  const rows = data.map((d, i) => ({
    ...d,
    last: i === data.length - 1 ? d.value : undefined,
  }));
  return (
    <Chart
      data={rows as unknown as Record<string, unknown>[]}
      xKey="label"
      height={height}
      // Default margins reserve axis space and would swallow the whole 40px —
      // a sparkline has no axes, so the plot gets (almost) every pixel.
      margin={{ top: 4, right: 6, bottom: 4, left: 6 }}
      yDomain={[0, Math.ceil(max * 1.1)]}
      series={[
        line('value', { color, strokeWidth: 2 }),
        dot('last', { color, radius: 3 }),
      ]}
    />
  );
}
