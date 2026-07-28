// views/SignalsView.tsx — Evidence layer home, editorial edition (P2.1 visual upgrade)
// Charts: Observable Plot (persona heatmap, evidence timeline) + Highcharts (severity composition).
// Chart discipline (SKILL §7): every figure carries the decision it supports in its caption.
import { useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { ChevronRightIcon } from 'lucide-react';
import { computeAllSignals } from '../data/signals';
import { EvidencePanel } from '../components/drilldown/EvidencePanel';
import { PlotFigure } from '../components/charts/PlotFigure';
import { HighchartFigure } from '../components/charts/HighchartFigure';
import { useDrilldown } from '../hooks/useDrilldown';
import { Figure, Masthead } from '../components/ui/Figure';
import type { ComputedSignal } from '../data/signals';
import type Highcharts from 'highcharts';

const SEV_COLORS: Record<string, string> = { critical: '#e8604a', high: '#f5a623', medium: '#6d5ed4', low: '#2ec4a0' };
const SEVERITIES = ['critical', 'high', 'medium', 'low'] as const;
const SEV_WEIGHT: Record<string, number> = { critical: 3, high: 2, medium: 1, low: 0.5, na: 0.25 };
const SHORT: Record<string, string> = {
  overload: 'Cognitive overload', reporting: 'Reporting deficit', 'ai-layer': 'AI layer',
  'config-debt': 'Config debt', multicampus: 'Multi-campus', 'skills-entity': 'Skills entity',
  'scce-underservice': 'SCCE / mobile',
};
const PERSONA_LABELS: Record<string, string> = {
  student: 'Student', dce: 'DCE / Faculty', scce: 'SCCE', 'program-director': 'Program Dir.', unassigned: 'Cross-persona',
};
const PERSONA_ORDER = ['Student', 'DCE / Faculty', 'SCCE', 'Program Dir.', 'Cross-persona'];
const MONO = "'JetBrains Mono', monospace";

function SignalIndexRow({ signal, index, active, compact, onOpen }: {
  signal: ComputedSignal; index: number; active: boolean; compact: boolean; onOpen: (id: string) => void;
}) {
  const { def, insights, topSeverity, byProduct } = signal;
  return (
    <button onClick={() => onOpen(def.id)} className="press w-full text-left group" style={{
      display: 'flex', alignItems: 'center', gap: 16, padding: compact ? '12px 14px' : '15px 18px',
      background: active ? 'var(--bg2)' : '#fff', cursor: 'pointer',
      borderBottom: '1px solid var(--bg3)', transition: 'background 140ms, border-color 140ms',
    }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--bg)'; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#fff'; }}>
      <span className="mono" style={{ fontSize: 11, fontWeight: active ? 700 : 400, color: active ? def.color : 'var(--text3)', width: 22, flexShrink: 0 }}>{String(index + 1).padStart(2, '0')}</span>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: def.color, flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="rr-serif" style={{ display: 'block', fontSize: compact ? 15 : 16.5, color: 'var(--text)', lineHeight: 1.25 }}>{def.title}</span>
        {!compact && <span className="serif" style={{ display: 'block', fontSize: 13, color: 'var(--text2)', lineHeight: 1.4, marginTop: 2 }}>{def.question}</span>}
      </span>
      {!compact && (
        <span className="mono flex-shrink-0" style={{ fontSize: 10, color: 'var(--text3)', textAlign: 'right', lineHeight: 1.6 }}>
          {Object.keys(byProduct).length} products<br />{insights.length} insights
        </span>
      )}
      <span className="mono flex-shrink-0" style={{
        fontSize: 9.5, fontWeight: 600, padding: '2.5px 8px', borderRadius: 3,
        background: `${SEV_COLORS[topSeverity] ?? '#8a8580'}16`, color: SEV_COLORS[topSeverity] ?? '#8a8580',
      }}>{topSeverity.toUpperCase()}</span>
      <ChevronRightIcon size={15} style={{ color: 'var(--text3)', flexShrink: 0, opacity: active ? 1 : 0.45 }} />
    </button>
  );
}

export function SignalsView() {
  const signals = useMemo(() => computeAllSignals(), []);
  const { state, apply } = useDrilldown();
  const active = signals.find(s => s.def.id === state.signal);
  const panelOpen = !!active;
  const totalEvidence = signals.reduce((n, s) => n + s.insights.length, 0);

  // ── Heatmap cells: signal × persona, severity-weighted ──
  const heatCells = useMemo(() => {
    const cells: { persona: string; signal: string; weight: number; count: number }[] = [];
    for (const s of signals) {
      for (const [pid, items] of Object.entries(s.byPersona)) {
        if (!items?.length) continue;
        cells.push({
          persona: PERSONA_LABELS[pid] ?? pid,
          signal: SHORT[s.def.id],
          count: items.length,
          weight: items.reduce((w, i) => w + (SEV_WEIGHT[i.severity ?? 'na'] ?? 0), 0),
        });
      }
    }
    return cells;
  }, [signals]);
  const maxWeight = Math.max(...heatCells.map(c => c.weight), 1);

  // ── Timeline rows: evidence accumulation per signal ──
  const timelineRows = useMemo(() => {
    const rows: { date: Date; signal: string; severity: string; text: string }[] = [];
    for (const s of signals)
      for (const i of s.insights)
        rows.push({ date: new Date(i.createdAt), signal: SHORT[s.def.id], severity: i.severity ?? 'low', text: i.text });
    return rows;
  }, [signals]);

  // ── Highcharts severity composition ──
  const hcOptions = useMemo((): Highcharts.Options => ({
    chart: { type: 'bar', backgroundColor: 'transparent', height: signals.length * 36 + 92, spacing: [4, 4, 4, 0], style: { fontFamily: MONO } },
    title: { text: undefined }, credits: { enabled: false },
    xAxis: {
      categories: signals.map(s => SHORT[s.def.id]), lineColor: '#e3ddd4', tickLength: 0,
      labels: { style: { fontSize: '10px', color: '#4a4844', fontFamily: MONO } },
    },
    yAxis: {
      title: { text: undefined }, gridLineColor: '#ede9e3', tickInterval: 10,
      labels: { style: { fontSize: '9.5px', color: '#6b6660', fontFamily: MONO } },
    },
    legend: { itemStyle: { fontSize: '10px', fontWeight: '400', color: '#4a4844', fontFamily: MONO }, symbolRadius: 2, symbolHeight: 9 },
    tooltip: {
      shared: true, backgroundColor: '#1a1917', borderRadius: 8, borderWidth: 0, shadow: false,
      style: { color: '#faf9f7', fontSize: '11px', fontFamily: MONO },
    },
    plotOptions: { series: { stacking: 'normal', borderWidth: 0, pointPadding: 0.06, groupPadding: 0.07, animation: { duration: 500 } } },
    series: SEVERITIES.map(sev => ({
      type: 'bar' as const, name: sev, color: SEV_COLORS[sev],
      data: signals.map(s => s.bySeverity[sev] ?? 0),
    })),
  }), [signals]);

  return (
    <div className="flex h-full" style={{ minHeight: 0 }}>
      <div className="flex-1 overflow-y-auto" style={{ padding: '30px 34px 48px' }}>

        <Masthead compact={panelOpen}
          title="Seven platform signals"
          lede="Cross-product patterns with drill-down evidence: grouped by persona, sorted by severity, every card ending in an action. The URL follows your drill, so any state is a shareable link."
          byline={`Computed live from ${totalEvidence} insight-signal pairs · insights.ts`} />

        {/* ── Figures ── */}
        {!panelOpen && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
            <Figure title="Fig. 1 — Who is hit by what" caption="Severity-weighted evidence per persona × signal. Decision: which persona-signal pair gets the next research and design cycle. The hottest cells are the design brief.">
              <PlotFigure minHeight={signals.length * 36 + 60} deps={[heatCells]} build={() => ({
                height: signals.length * 36 + 58,
                marginLeft: 138, marginTop: 26, marginBottom: 4, marginRight: 8,
                style: { fontFamily: MONO, fontSize: '10.5px', background: 'transparent' },
                x: { axis: 'top', label: null, domain: PERSONA_ORDER, tickSize: 0, padding: 0.06 },
                y: { label: null, tickSize: 0, padding: 0.12 },
                color: { type: 'linear', range: ['#f4f2ee', '#e8604a'], domain: [0, maxWeight] },
                marks: [
                  Plot.cell(heatCells, { x: 'persona', y: 'signal', fill: 'weight', rx: 4, inset: 1.5 }),
                  Plot.text(heatCells, {
                    x: 'persona', y: 'signal', text: d => String(d.count),
                    fill: d => (d.weight > maxWeight * 0.55 ? '#fff' : '#4a4844'), fontSize: 10.5,
                  }),
                ],
              })} />
            </Figure>
            <Figure title="Fig. 2 — Severity composition" caption="Insight counts stacked by severity per signal. Decision: where critical mass justifies escalating a signal into the next stakeholder briefing.">
              <HighchartFigure options={hcOptions} deps={[signals]} />
            </Figure>
          </div>
        )}

        {!panelOpen && (
          <div style={{ marginBottom: 20 }}>
            <Figure title="Fig. 3 — Evidence accumulation, Feb → Jul 2026" caption="Each dot is one insight landing on a signal, colored by severity. Decision: which signals are still accumulating evidence (research is live) versus settled (ready for design response). Hover any dot for its finding.">
              <PlotFigure minHeight={signals.length * 30 + 70} deps={[timelineRows]} build={() => ({
                height: signals.length * 30 + 66,
                marginLeft: 138, marginTop: 8, marginBottom: 26, marginRight: 12,
                style: { fontFamily: MONO, fontSize: '10.5px', background: 'transparent' },
                x: { type: 'time', label: null, tickFormat: '%b' },
                y: { label: null, tickSize: 0, padding: 0.5 },
                color: { domain: [...SEVERITIES], range: SEVERITIES.map(s => SEV_COLORS[s]), legend: true, label: 'severity' },
                marks: [
                  Plot.ruleY([...new Set(timelineRows.map(r => r.signal))], { y: d => d, stroke: '#ede9e3', strokeWidth: 1 }),
                  Plot.dot(timelineRows, {
                    x: 'date', y: 'signal', fill: 'severity', r: 3.4, fillOpacity: 0.85,
                    stroke: '#fff', strokeWidth: 0.6,
                    tip: true, title: d => `${d.text.slice(0, 120)}${d.text.length > 120 ? '…' : ''}`,
                  }),
                ],
              })} />
            </Figure>
          </div>
        )}

        {/* ── Signal index ── */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Signal index, ranked by severity — open a row for its evidence
          </div>
          {signals.map((s, i) => (
            <SignalIndexRow key={s.def.id} signal={s} index={i} compact={panelOpen}
              active={s.def.id === state.signal}
              onOpen={(id) => apply(id === state.signal ? {} : { signal: id })} />
          ))}
        </div>
      </div>

      {active && (
        <EvidencePanel
          signal={active}
          activePersona={state.persona}
          activeInsight={state.insight}
          onPersona={(p) => apply({ signal: state.signal, persona: p, insight: undefined })}
          onInsight={(i) => apply({ signal: state.signal, persona: state.persona, insight: i })}
          onClose={() => apply({})}
        />
      )}
    </div>
  );
}
