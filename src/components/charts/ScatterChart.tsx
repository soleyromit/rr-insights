// components/charts/ScatterChart.tsx — severity-colored scatter (v19).
// Numeric x/y; severity status colors are legitimate here because the color
// encodes severity itself. Marks can't carry hrefs — pair with a Fig-level
// link so the figure stays a door.
import { Chart, ChartAxis, ChartGrid, dot, useChartColors } from '@astryxdesign/charts';
import { SEV_COLORS } from '../../data/taxonomy';
import type { SeverityLevel } from '../../types';

export interface ScatterDatum {
  x: number;
  y: number;
  label: string;
  severity?: SeverityLevel;
}

export interface ScatterChartProps {
  data: ScatterDatum[];
  height?: number;
  xFormat?: (v: number) => string;
}

/** Axis meanings go in the Fig caption — ChartAxis has no label prop. */
export function ScatterChart({ data, height = 280, xFormat }: ScatterChartProps) {
  const colors = useChartColors();
  const byX = new Map(data.map((d) => [d.x, d]));
  return (
    <Chart
      data={data as unknown as Record<string, unknown>[]}
      xKey="x"
      height={height}
      yDomain={[0, Math.ceil(Math.max(...data.map((d) => d.y), 1) * 1.1)]}
      series={[
        dot('y', {
          color: (d: Record<string, unknown>) =>
            SEV_COLORS[(d.severity as SeverityLevel) ?? 'na'] ?? colors.semantic.neutral,
          radius: 4,
          opacity: 0.75,
          dodge: true,
        }),
      ]}
      grid={<ChartGrid horizontal tickCount={4} />}
      axes={
        <>
          <ChartAxis position="bottom" tickFormat={xFormat ? (v: unknown) => xFormat(Number(v)) : undefined} />
          <ChartAxis position="left" tickCount={4} />
        </>
      }
      tooltip={{
        render: (xValue: unknown) => {
          const d = byX.get(Number(xValue));
          return d ? `${d.label}` : String(xValue);
        },
      }}
    />
  );
}
