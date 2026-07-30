// components/charts/QuadrantChart.tsx — score × age quadrant (v19.5).
// x = days since capture, y = opportunity score; reference lines split the
// plane into act-now / fading-urgency / fresh-context / archive. Severity
// status colors are legitimate (they encode severity itself, not series id).
import { Chart, ChartAxis, ChartGrid, dot, referenceLine, useChartColors } from '@astryxdesign/charts';
import { SEV_COLORS } from '../../data/taxonomy';
import type { SeverityLevel } from '../../types';

export interface QuadrantDatum {
  x: number; // age in days
  y: number; // opportunity score
  label: string;
  severity?: SeverityLevel;
}

export interface QuadrantChartProps {
  data: QuadrantDatum[];
  /** vertical split: evidence older than this is "aging" */
  xSplit: number;
  /** horizontal split: scores at/above this are the action band (P0/P1 floor) */
  ySplit: number;
  height?: number;
}

export function QuadrantChart({ data, xSplit, ySplit, height = 300 }: QuadrantChartProps) {
  const colors = useChartColors();
  const byX = new Map<number, QuadrantDatum[]>();
  for (const d of data) {
    const list = byX.get(d.x) ?? [];
    list.push(d);
    byX.set(d.x, list);
  }
  const yMax = Math.ceil(Math.max(...data.map((d) => d.y), 1) * 1.1);
  return (
    <Chart
      data={data as unknown as Record<string, unknown>[]}
      xKey="x"
      height={height}
      yDomain={[0, yMax]}
      series={[
        dot('y', {
          color: (d: Record<string, unknown>) =>
            SEV_COLORS[(d.severity as SeverityLevel) ?? 'na'] ?? colors.semantic.neutral,
          radius: 4,
          opacity: 0.7,
          dodge: true,
        }),
        referenceLine({ y: ySplit, strokeDasharray: '3 3', color: colors.structural.axis, label: 'action band ≥', labelPosition: 'end' }),
        referenceLine({ x: xSplit, strokeDasharray: '3 3', color: colors.structural.axis, label: `${xSplit}d`, labelPosition: 'start' }),
      ]}
      grid={<ChartGrid horizontal tickCount={4} />}
      axes={
        <>
          <ChartAxis position="bottom" tickFormat={(v: unknown) => `${v}d`} />
          <ChartAxis position="left" tickCount={4} />
        </>
      }
      tooltip={{
        render: (xValue: unknown) => {
          const list = byX.get(Number(xValue)) ?? [];
          if (!list.length) return String(xValue);
          const top = [...list].sort((a, b) => b.y - a.y)[0];
          return list.length > 1 ? `${top.label} (+${list.length - 1} more this day)` : top.label;
        },
      }}
    />
  );
}
