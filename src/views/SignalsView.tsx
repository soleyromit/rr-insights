// views/SignalsView.tsx — Evidence layer home (P2, UX Audit v1). Replaces ThemesView route.
// L0 rule enforced: 7 signals visible on first paint. Not 292 insights.
// All insight text lives behind the drill-down (EvidencePanel).
import { useMemo } from 'react';
import { computeAllSignals } from '../data/signals';
import { SignalCard } from '../components/drilldown/SignalCard';
import { EvidencePanel } from '../components/drilldown/EvidencePanel';
import { useDrilldown } from '../hooks/useDrilldown';

export function SignalsView() {
  const signals = useMemo(() => computeAllSignals(), []);
  const { state, apply } = useDrilldown();
  const active = signals.find(s => s.def.id === state.signal);
  const totalEvidence = signals.reduce((n, s) => n + s.insights.length, 0);
  const criticalCount = signals.filter(s => s.topSeverity === 'critical').length;

  return (
    <div className="flex h-full" style={{ minHeight: 0 }}>
      <div className="flex-1 overflow-y-auto" style={{ padding: '28px 32px' }}>
        <div style={{ marginBottom: 6 }}>
          <div className="eyebrow">Evidence · Layer 2 · computed live from insights.ts</div>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', margin: '4px 0 3px', fontFamily: 'var(--rr-serif, Georgia, serif)' }}>
            Platform signals
          </h1>
          <p style={{ fontSize: 13.5, color: 'var(--text2)', maxWidth: 560, lineHeight: 1.55 }}>
            Seven cross-product patterns, each backed by drill-down evidence. Click a signal to open its
            evidence set — grouped by persona, sorted by severity, every card ending in an action.
            The URL updates as you drill, so any state is shareable as a link.
          </p>
        </div>

        <div className="flex gap-4 mono" style={{ fontSize: 11, color: 'var(--text3)', margin: '14px 0 18px' }}>
          <span><b style={{ color: 'var(--text)' }}>{signals.length}</b> signals</span>
          <span><b style={{ color: '#dc2626' }}>{criticalCount}</b> critical</span>
          <span><b style={{ color: 'var(--text)' }}>{totalEvidence}</b> supporting insights (behind drill-down)</span>
        </div>

        <div className="grid gap-3" style={{ gridTemplateColumns: active ? '1fr' : 'repeat(auto-fill, minmax(330px, 1fr))' }}>
          {signals.map(s => (
            <SignalCard key={s.def.id} signal={s} active={s.def.id === state.signal}
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
