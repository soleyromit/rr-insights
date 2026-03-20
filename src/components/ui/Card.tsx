// ─────────────────────────────────────────────
//  components/ui/Card.tsx  —  surface containers
// ─────────────────────────────────────────────
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'flat' | 'ai';
}

export function Card({ children, className = '', variant = 'default' }: CardProps) {
  const base = 'rounded-xl border transition-colors duration-150';
  const variants: Record<string, string> = {
    default: 'bg-[var(--bg2)] border-[var(--border)] hover:border-[var(--border2)] p-4',
    flat: 'bg-[var(--bg3)] border-[var(--border)] p-3',
    ai: 'bg-[rgba(139,127,245,0.06)] border-[rgba(139,127,245,0.2)] p-3'
  };
  return <div className={`${base} ${variants[variant]} ${className}`}>{children}</div>;
}

export function CardTitle({
  children,
  sub



}: {children: ReactNode;sub?: ReactNode;}) {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.07em] text-[var(--text)]">
        {children}
      </span>
      {sub &&
      <span className="text-[9px] text-[var(--text3)] font-normal normal-case tracking-normal">
          {sub}
        </span>
      }
    </div>);

}

// ─────────────────────────────────────────────
//  components/ui/MetricCard.tsx
// ─────────────────────────────────────────────
interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: string;
  deltaVariant?: 'up' | 'down' | 'neutral';
  valueColor?: string;
}

export function MetricCard({ label, value, delta, deltaVariant = 'neutral', valueColor }: MetricCardProps) {
  const deltaColors = { up: 'text-[#4caf7d]', down: 'text-[#e8604a]', neutral: 'text-[var(--text3)]' };
  return (
    <div className="bg-[var(--bg2)] border border-[var(--border)] hover:border-[var(--border2)] rounded-lg p-3.5 transition-colors">
      <div className="text-[9px] uppercase tracking-[0.06em] text-[var(--text3)] mb-1.5">{label}</div>
      <div className="font-mono font-semibold leading-none mb-1.5 text-2xl" style={valueColor ? { color: valueColor } : { color: 'var(--text)' }}>
        {value}
      </div>
      {delta && <div className={`text-[10px] ${deltaColors[deltaVariant]}`}>{delta}</div>}
    </div>);

}