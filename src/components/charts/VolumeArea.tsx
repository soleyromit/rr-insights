// @ts-nocheck
// components/charts/VolumeArea.tsx — Dovetail volume pattern (Benchmark D2).
// One soft area line of evidence volume per month, hover for the split. Replaces dot-field timelines.
import { useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { PlotFigure } from './PlotFigure';

const MONO = "'JetBrains Mono', monospace";

export function VolumeArea({ dates, criticalDates = [], height = 170, accent = '#6d5ed4' }) {
  // dates: Date[] of all evidence; criticalDates: Date[] subset
  const bins = useMemo(() => {
    const byMonth = new Map();
    const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    for (const d of dates) {
      const k = key(d);
      byMonth.set(k, (byMonth.get(k) ?? { month: new Date(d.getFullYear(), d.getMonth(), 1), total: 0, critical: 0 }));
      byMonth.get(k).total += 1;
    }
    for (const d of criticalDates) {
      const k = key(d);
      if (byMonth.has(k)) byMonth.get(k).critical += 1;
    }
    return [...byMonth.values()].sort((a, b) => a.month - b.month);
  }, [dates, criticalDates]);

  if (bins.length < 2) {
    return <div className="mono" style={{ fontSize: 13, color: 'var(--text2)', padding: '12px 0' }}>
      {dates.length} evidence points, all within one month — volume trend renders once a second month lands.
    </div>;
  }

  return (
    <PlotFigure minHeight={height} deps={[bins]} build={() => ({
      height,
      marginLeft: 44, marginTop: 12, marginBottom: 28, marginRight: 16,
      style: { fontFamily: MONO, fontSize: '12px', background: 'transparent' },
      x: { type: 'time', label: null, tickFormat: '%b' },
      y: { label: null, tickSize: 0, grid: true },
      marks: [
        Plot.areaY(bins, { x: 'month', y: 'total', fill: accent, fillOpacity: 0.14, curve: 'monotone-x' }),
        Plot.lineY(bins, { x: 'month', y: 'total', stroke: accent, strokeWidth: 2, curve: 'monotone-x' }),
        Plot.dot(bins, { x: 'month', y: 'total', fill: accent, r: 3.5, tip: true,
          title: d => `${d.month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}\n${d.total} insights · ${d.critical} critical` }),
      ],
    })} />
  );
}
