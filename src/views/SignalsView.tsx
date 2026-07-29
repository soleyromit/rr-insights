// views/SignalsView.tsx — Evidence layer home, editorial edition (P2.1 visual upgrade)
// Charts: Dovetail-pattern ranked bars + monthly volume area (Benchmark D1/D2); Observable Plot heatmap retained (matrix is the true shape).
// Chart discipline (SKILL §7): every figure carries the decision it supports in its caption.
import { useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { ChevronRightIcon } from 'lucide-react';
import { computeAllSignals } from '../data/signals';
import { EvidencePanel } from '../components/drilldown/EvidencePanel';
import { PlotFigure } from '../components/charts/PlotFigure';
import { RankedBars } from '../components/charts/RankedBars';
import { VolumeArea } from '../components/charts/VolumeArea';
import { useDrilldown } from '../hooks/useDrilldown';
import { Figure, Masthead } from '../components/ui/Figure';
import type { ComputedSignal } from '../data/signals';

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
      <span className="mono" style={{ fontSize: 13, fontWeight: active ? 700 : 400, color: active ? def.color : 'var(--text3)', width: 22, flexShrink: 0 }}>{String(index + 1).padStart(2, '0')}</span>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: def.color, flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="rr-serif" style={{ display: 'block', fontSize: compact ? 15 : 16.5, color: 'var(--text)', lineHeight: 1.25 }}>{def.title}</span>
        {!compact && <span className="serif" style={{ display: 'block', fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.4, marginTop: 2 }}>{def.question}</span>}
      </span>
      {!compact && (
        <span className="mono flex-shrink-0" style={{ fontSize: 12, color: 'var(--text3)', textAlign: 'right', lineHeight: 1.6 }}>
          {Object.keys(byProduct).length} products<br />{insights.length} insights
        </span>
      )}
      <span className="mono flex-shrink-0" style={{
        fontSize: 12, fontWeight: 600, padding: '2.5px 8px', borderRadius: 3,
        background: `${SEV_COLORS[topSeverity] ?? '#8a8580'}16`, color: SEV_COLORS[topSeverity] ?? '#8a8580',
      }}>{topSeverity.toUpperCase()}</span>
      <ChevronRightIcon size={15} style={{ color: 'var(--text3)', flexShrink: 0, opacity: active ? 1 : 0.45 }} />
    </button>
  );
}

export function SignalsView({ onNav }) {
  const signals = useMemo(() => computeAllSignals(), []);
  const { state, apply } = useDrilldown();
  const active = signals.find(s => s.def.id === state.signal);
  const panelOpen = !!active;
  const totalEvidence = signals.reduce((n, s) => n + s.insights.length, 0);
  const digest = useMemo(() => {
    const top = signals[0];
    const newest = signals.flatMap(s => s.insights).sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))[0];
    const critTotal = signals.reduce((n, s) => n + (s.bySeverity.critical ?? 0), 0);
    return `${SHORT[top.def.id]} leads with ${top.insights.length} insights (${top.bySeverity.critical ?? 0} of ${critTotal} platform criticals); newest evidence landed ${newest?.createdAt ?? 'n/a'} from ${newest?.source ?? ''}.`;
  }, [signals]);

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

  return (
    <div className="flex h-full" style={{ minHeight: 0 }}>
      <div className="flex-1 overflow-y-auto" style={{ padding: '30px 34px 48px' }}>

        <Masthead compact={panelOpen}
          title="Seven platform signals"
          lede="Cross-product patterns with drill-down evidence: grouped by persona, sorted by severity, every card ending in an action. The URL follows your drill, so any state is a shareable link."
          byline={`Computed live from ${totalEvidence} insight-signal pairs · insights.ts`} digest={digest} />

        {/* ── Figures ── */}
        {!panelOpen && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
            <Figure title="Fig. 1 — Who is hit by what" caption="Severity-weighted evidence per persona × signal. Decision: which persona-signal pair gets the next research and design cycle. The hottest cells are the design brief.">
              <PlotFigure minHeight={signals.length * 36 + 60} deps={[heatCells]} build={() => ({
                height: signals.length * 36 + 58,
                marginLeft: 138, marginTop: 26, marginBottom: 4, marginRight: 8,
                style: { fontFamily: MONO, fontSize: '12.5px', background: 'transparent' },
                x: { axis: 'top', label: null, domain: PERSONA_ORDER, tickSize: 0, padding: 0.06 },
                y: { label: null, tickSize: 0, padding: 0.12 },
                color: { type: 'linear', range: ['#f4f2ee', '#e8604a'], domain: [0, maxWeight] },
                marks: [
                  Plot.cell(heatCells, { x: 'persona', y: 'signal', fill: 'weight', rx: 4, inset: 1.5 }),
                  Plot.text(heatCells, {
                    x: 'persona', y: 'signal', text: d => String(d.count),
                    fill: d => (d.weight > maxWeight * 0.55 ? '#fff' : '#4a4844'), fontSize: 12.5,
                  }),
                ],
              })} />
            </Figure>
            <Figure title="Fig. 2 — Evidence mass, ranked" caption="Signals ranked by supporting evidence; the red segment is critical mass with its count inline. Decision: rank order is the escalation order for the next stakeholder briefing. Click a bar to open its evidence.">
              <RankedBars onRowClick={(id) => apply({ signal: id })} rows={signals.map(s => ({
                key: s.def.id, label: SHORT[s.def.id], color: s.def.color,
                total: s.insights.length, critical: s.bySeverity.critical ?? 0,
              }))} />
            </Figure>
          </div>
        )}

        {!panelOpen && (
          <div style={{ marginBottom: 20 }}>
            <Figure title="Fig. 3 — Evidence volume by month" caption="One line: how much evidence landed each month across all signals; hover a point for the critical split. Decision: a rising line means the problem space is still live and design responses stay provisional; a settled line is a green light.">
              <VolumeArea dates={timelineRows.map(r => r.date)} criticalDates={timelineRows.filter(r => r.severity === 'critical').map(r => r.date)} />
            </Figure>
          </div>
        )}

        {/* ── Signal index ── */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
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
          onNav={onNav}
        />
      )}
    </div>
  );
}
