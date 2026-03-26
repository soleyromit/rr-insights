import type { Insight } from '../../types';

const TAG_CONFIG: Record<string, { label: string; cls: string }> = {
  gap:        { label: 'Gap',      cls: 'badge badge-gap' },
  theme:      { label: 'Theme',    cls: 'badge badge-theme' },
  opportunity:{ label: 'Opp',     cls: 'badge badge-opp' },
  persona:    { label: 'Persona',  cls: 'badge badge-persona' },
  ai:         { label: 'AI',       cls: 'badge badge-ai' },
  platform:   { label: 'Platform', cls: 'badge badge-platform' },
  new:        { label: 'New',      cls: 'badge badge-new' },
  architecture:{ label: 'Arch',   cls: 'badge badge-theme' },
};

const SEV_COLOR: Record<string, string> = {
  critical: 'var(--coral)',
  high:     'var(--amber)',
  medium:   'var(--blue)',
  low:      'var(--teal)',
};

interface InsightRowProps {
  insight: Insight;
  showSoWhat?: boolean;
}

export function InsightRow({ insight, showSoWhat = false }: InsightRowProps) {
  return (
    <div className="insight-card" style={{ marginBottom: 8 }}>
      {/* Severity indicator + tags row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        {insight.severity && (
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: SEV_COLOR[insight.severity] || 'var(--border2)',
            flexShrink: 0, display: 'inline-block',
          }} />
        )}
        {insight.tags.slice(0, 3).map(tag => {
          const cfg = TAG_CONFIG[tag];
          return cfg ? (
            <span key={tag} className={cfg.cls}>{cfg.label}</span>
          ) : null;
        })}
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
          {insight.source?.split('·')[0]?.trim()}
        </span>
      </div>

      {/* Pull quote */}
      {insight.pullQuote && (
        <div className="pull-quote" style={{ fontSize: 14, marginBottom: 8 }}>
          "{insight.pullQuote}"
          {insight.pullQuoteSource && (
            <div style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'normal', marginTop: 4 }}>
              — {insight.pullQuoteSource}
            </div>
          )}
        </div>
      )}

      {/* Insight text */}
      <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{insight.text}</p>

      {/* So what */}
      {showSoWhat && insight.soWhat && (
        <div style={{
          marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)',
          fontSize: 13, color: 'var(--accent)', lineHeight: 1.5,
        }}>
          <span style={{ fontWeight: 600 }}>So what: </span>{insight.soWhat}
        </div>
      )}
    </div>
  );
}

/* ── AIStrip ── */
export function AIStrip({ children, text }: { children?: React.ReactNode; text?: string }) {
  return (
    <div className="ai-strip">
      <span style={{ marginRight: 8, fontSize: 14 }}>✦</span>
      {text ?? children}
    </div>
  );
}

/* ── Progress Bar ── */
interface ProgressBarProps {
  label: string;
  sublabel?: string;
  value: number;
  color?: string;
  valueLabel?: string;
}

export function ProgressBar({ label, sublabel, value, color = 'var(--accent)', valueLabel }: ProgressBarProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <div>
          <span style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500 }}>{label}</span>
          {sublabel && <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 8 }}>{sublabel}</span>}
        </div>
        <span style={{ fontSize: 12, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>
          {valueLabel || `${value}%`}
        </span>
      </div>
      <div className="progress-track">
        <div style={{ width: `${Math.min(value, 100)}%`, height: '100%', background: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

/* ── Timeline item ── */
interface TimelineItem {
  date: string;
  label?: string;
  title?: string;
  status: 'done' | 'active' | 'upcoming';
  description?: string;
  color?: string;
  isHardDeadline?: boolean;
}

export function TimelineItemRow({ item }: { item: TimelineItem }) {
  const colors = { done: 'var(--teal)', active: 'var(--accent)', upcoming: 'var(--text3)' };
  const bgColors = { done: 'rgba(13,148,136,0.08)', active: 'rgba(109,94,212,0.08)', upcoming: 'transparent' };
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10, padding: '8px 10px', background: bgColors[item.status], borderRadius: 'var(--radius-sm)' }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[item.status], flexShrink: 0, marginTop: 5 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: colors[item.status], fontWeight: 600 }}>{item.date}</span>
          <span>{item.label ?? item.title ?? ""}</span>
          {item.isHardDeadline && <span className="badge badge-gap" style={{ fontSize: 10 }}>Hard deadline</span>}
        </div>
        {item.description && <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3, lineHeight: 1.4 }}>{item.description}</p>}
      </div>
    </div>
  );
}
