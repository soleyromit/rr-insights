// components/drilldown/SignalCard.tsx — L0 of the drill-down (P2, UX Audit v1)
// Rule: title + question + frequency proof. Zero insight body text at this level.
import { getProduct } from '../../data/products';
import type { ComputedSignal } from '../../data/signals';

const SEV_COLORS: Record<string, string> = {
  critical: '#dc2626', high: '#d97706', medium: '#ca8a04', low: '#16a34a', na: '#8a8580',
};

export function SignalCard({ signal, active, onOpen }: {
  signal: ComputedSignal; active: boolean; onOpen: (id: string) => void;
}) {
  const { def, insights, bySeverity, byProduct } = signal;
  const total = insights.length || 1;
  return (
    <button
      onClick={() => onOpen(def.id)}
      className="text-left w-full transition-all"
      style={{
        background: '#fff',
        border: `1px solid ${active ? def.color : 'var(--border)'}`,
        borderLeft: `4px solid ${def.color}`,
        borderRadius: 'var(--radius)',
        padding: '16px 18px',
        boxShadow: active ? 'var(--shadow)' : 'var(--shadow-sm)',
        transform: active ? 'scale(1.01)' : 'none',
        cursor: 'pointer',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{def.title}</div>
        <span className="mono flex-shrink-0" style={{
          fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 10,
          background: `${SEV_COLORS[signal.topSeverity]}14`, color: SEV_COLORS[signal.topSeverity],
        }}>{signal.topSeverity.toUpperCase()}</span>
      </div>
      <div style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.45, marginBottom: 12, fontStyle: 'italic' }}>
        {def.question}
      </div>

      {/* Severity composition bar — the frequency proof */}
      <div className="flex w-full overflow-hidden" style={{ height: 5, borderRadius: 3, background: 'var(--bg3)', marginBottom: 8 }}>
        {(['critical', 'high', 'medium', 'low'] as const).map(s =>
          bySeverity[s] ? (
            <div key={s} title={`${bySeverity[s]} ${s}`} style={{ width: `${(bySeverity[s] / total) * 100}%`, background: SEV_COLORS[s] }} />
          ) : null
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(byProduct).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0)).slice(0, 4).map(([pid, count]) => {
            const p = getProduct(pid);
            return (
              <span key={pid} className="mono" style={{
                fontSize: 10, padding: '1.5px 7px', borderRadius: 9,
                background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--border)',
              }}>{p?.shortName ?? pid} {count}</span>
            );
          })}
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--text3)' }}>
          {insights.length} insights →
        </span>
      </div>
    </button>
  );
}
