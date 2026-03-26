import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className = '', style }: CardProps) {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  sub?: string;
}

export function CardTitle({ children, sub }: CardTitleProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3, marginBottom: sub ? 4 : 0 }}>
        {children}
      </h3>
      {sub && (
        <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.4 }}>{sub}</p>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaVariant?: 'up' | 'down' | 'neutral';
  deltaPositive?: boolean;
  accent?: string;
}

export function MetricCard({ label, value, delta, deltaVariant, deltaPositive, accent }: MetricCardProps) {
  // Support both deltaVariant ('up'/'down'/'neutral') and deltaPositive (boolean)
  const resolvedVariant = deltaVariant ?? (deltaPositive === true ? 'up' : deltaPositive === false ? 'down' : 'neutral');
  const deltaColor = resolvedVariant === 'up' ? 'var(--teal)' : resolvedVariant === 'down' ? 'var(--coral)' : 'var(--text3)';
  return (
    <div className="stat-card">
      <div className="eyebrow" style={{ marginBottom: 8 }}>{label}</div>
      <div className="metric-value" style={{ color: accent || 'var(--text)' }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 12, color: deltaColor, marginTop: 6, lineHeight: 1.3 }}>{delta}</div>
      )}
    </div>
  );
}
