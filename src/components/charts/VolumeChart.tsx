// components/charts/VolumeChart.tsx — evidence volume over time (v18).
// Area = all insights, line = critical only; optional vertical reference for
// launches/deadlines. Crosshair tooltip ships by default per chart discipline.
import { Chart, ChartAxis, ChartGrid, area, line, referenceLine, useChartColors } from '@astryxdesign/charts';
import type { MonthPoint } from '../../lib/series';

export interface VolumeChartProps {
  data: MonthPoint[];
  height?: number;
  referenceX?: { x: string; label: string };
}

export function VolumeChart({ data, height = 220, referenceX }: VolumeChartProps) {
  const colors = useChartColors();
  const [blue] = colors.categorical(1);
  const yMax = Math.max(...data.map((d) => d.total), 1);
  const refIndex = referenceX ? data.findIndex((d) => d.label === referenceX.x || d.month === referenceX.x) : -1;
  return (
    <Chart
      data={data as unknown as Record<string, unknown>[]}
      xKey="label"
      height={height}
      yDomain={[0, Math.ceil(yMax * 1.1)]}
      series={[
        area('total', { color: blue, gradient: true, label: 'All insights' }),
        line('critical', { color: colors.semantic.negative, strokeWidth: 2, label: 'Critical' }),
        ...(refIndex >= 0
          ? [referenceLine({ x: refIndex, label: referenceX!.label, strokeDasharray: '3 3', color: colors.structural.axis })]
          : []),
      ]}
      grid={<ChartGrid horizontal tickCount={4} />}
      axes={
        <>
          <ChartAxis position="bottom" maxTicks={8} />
          <ChartAxis position="left" tickCount={4} />
        </>
      }
      legend
      tooltip
    />
  );
}
