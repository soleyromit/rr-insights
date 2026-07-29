// components/charts/SeverityStackChart.tsx — severity mix per category (v18).
// One stacked bar per category; severity uses the reserved status palette,
// never the categorical ramp.
import { Chart, ChartAxis, ChartGrid, bar, useChartColors } from '@astryxdesign/charts';

export interface SeverityStackDatum {
  category: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface SeverityStackChartProps {
  data: SeverityStackDatum[];
  height?: number;
}

export function SeverityStackChart({ data, height = 240 }: SeverityStackChartProps) {
  const colors = useChartColors();
  const yMax = Math.max(...data.map((d) => d.critical + d.high + d.medium + d.low), 1);
  return (
    <Chart
      data={data as unknown as Record<string, unknown>[]}
      xKey="category"
      height={height}
      yDomain={[0, Math.ceil(yMax * 1.1)]}
      series={[
        bar('critical', { stack: 'sev', color: colors.semantic.negative, label: 'Critical' }),
        bar('high', { stack: 'sev', color: colors.semantic.warning, label: 'High' }),
        bar('medium', { stack: 'sev', color: colors.categorical(1)[0], label: 'Medium' }),
        bar('low', { stack: 'sev', color: colors.semantic.neutral, label: 'Low' }),
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
