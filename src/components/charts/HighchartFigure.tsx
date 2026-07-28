// components/charts/HighchartFigure.tsx — Highcharts in React via direct API
// Note: Highcharts requires a commercial license for commercial use; already a project dependency.
import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';

export function HighchartFigure({ options, deps = [] }: {
  options: Highcharts.Options;
  deps?: unknown[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    chartRef.current = Highcharts.chart(ref.current, options);
    const ro = new ResizeObserver(() => chartRef.current?.reflow());
    ro.observe(ref.current);
    return () => { ro.disconnect(); chartRef.current?.destroy(); chartRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return <div ref={ref} style={{ width: '100%' }} />;
}
