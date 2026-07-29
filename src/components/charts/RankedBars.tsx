// @ts-nocheck
// components/charts/RankedBars.tsx — Dovetail channels pattern (Benchmark D1).
// Themes as full-width ranked bars: readable label on its own line, bar below, count at the end.
// No axes, no legend, no chart chrome. Critical mass shows as a red leading segment with an
// inline label — the one place a two-segment bar is allowed because both segments are named.
export function RankedBars({ rows, maxHint, onRowClick }) {
  // rows: { key, label, total, critical?, color?, note?, sub? }
  const max = Math.max(maxHint ?? 0, ...rows.map(r => r.total), 1);
  return (
    <div role="list">
      {rows.map(r => {
        const Row = onRowClick ? 'button' : 'div';
        return (
          <Row key={r.key} role="listitem" onClick={onRowClick ? () => onRowClick(r.key) : undefined}
            className={onRowClick ? 'press w-full text-left' : undefined}
            style={{ display: 'block', width: '100%', padding: '9px 0', borderBottom: '1px solid var(--bg3)', cursor: onRowClick ? 'pointer' : 'default', background: 'transparent' }}>
            <div className="flex items-baseline justify-between" style={{ marginBottom: 5 }}>
              <span style={{ fontSize: 14.5, color: 'var(--text)', fontWeight: 500 }}>
                {r.color && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: r.color, marginRight: 8, verticalAlign: 'baseline' }} />}
                {r.label}
              </span>
              <span className="mono" style={{ fontSize: 13, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                {r.critical ? <span style={{ color: '#c2362b' }}>{r.critical} critical · </span> : null}{r.total}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: 'var(--bg3)', overflow: 'hidden', display: 'flex' }}
              aria-label={`${r.label}: ${r.total} total${r.critical ? `, ${r.critical} critical` : ''}`}>
              {r.critical > 0 && <div style={{ width: `${(r.critical / max) * 100}%`, background: '#e8604a' }} />}
              <div style={{ width: `${((r.total - (r.critical ?? 0)) / max) * 100}%`, background: r.barColor ?? '#b8b2a8' }} />
            </div>
            {r.sub && <div className="mono" style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 4 }}>{r.sub}</div>}
          </Row>
        );
      })}
    </div>
  );
}
