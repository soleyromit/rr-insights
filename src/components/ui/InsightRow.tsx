// ─────────────────────────────────────────────
//  components/ui/InsightRow.tsx
//  Renders a single sourced insight entry.
//  Used in every product view and the overview.
// ─────────────────────────────────────────────
import type { Insight } from '../../types';
import { TagList } from './Badge';

interface InsightRowProps {
  insight: Insight;
}

export function InsightRow({ insight }: InsightRowProps) {
  return (
    <div className="py-2.5 border-b border-[var(--border)] last:border-0">
      <div className="flex flex-wrap gap-1 mb-1.5">
        <TagList tags={insight.tags} />
      </div>
      <p className="text-[12px] text-[var(--text2)] leading-[1.55]">{insight.text}</p>
      <p className="text-[9px] text-[var(--text3)] font-mono mt-1">{insight.source}</p>
    </div>);

}

// ─────────────────────────────────────────────
//  components/ui/ProgressBar.tsx
// ─────────────────────────────────────────────
interface ProgressBarProps {
  label: string;
  sublabel?: string;
  value: number; // 0–100
  color?: string;
  valueLabel?: string;
}

export function ProgressBar({ label, sublabel, value, color = '#8b7ff5', valueLabel }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-[var(--text2)]">{label}</div>
        {sublabel && <div className="text-[9px] text-[var(--text3)] mt-0.5">{sublabel}</div>}
      </div>
      <div className="w-24 h-1.5 bg-[var(--bg4)] rounded-full overflow-hidden flex-shrink-0">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color }} />
        
      </div>
      <div className="text-[11px] font-mono font-medium text-[var(--text)] min-w-[36px] text-right">
        {valueLabel ?? `${value}%`}
      </div>
    </div>);

}

// ─────────────────────────────────────────────
//  components/ui/AIStrip.tsx
// ─────────────────────────────────────────────
import { ReactNode } from 'react';

export function AIStrip({ children }: {children: ReactNode;}) {
  return (
    <div className="flex gap-2.5 items-start p-3 rounded-lg bg-[rgba(139,127,245,0.06)] border border-[rgba(139,127,245,0.2)] mb-4">
      <div className="w-6 h-6 rounded-md bg-[var(--accent)] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
        ✦
      </div>
      <div className="text-[11px] text-[var(--text2)] leading-[1.55] flex-1">{children}</div>
    </div>);

}

// ─────────────────────────────────────────────
//  components/ui/TimelineItem.tsx
// ─────────────────────────────────────────────
import type { TimelineItem as TI } from '../../types';

export function TimelineItemRow({ item }: {item: TI;}) {
  return (
    <div className="flex gap-3 py-2.5 border-b border-[var(--border)] last:border-0">
      <div
        className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
        style={{ background: item.color }} />
      
      <div className="flex-1">
        <div className="text-[12px] font-medium text-[var(--text)]">{item.title}</div>
        <div className="text-[9px] font-mono text-[var(--text3)] mt-0.5">{item.date}</div>
        <div className="text-[11px] text-[var(--text3)] mt-1 leading-[1.4]">{item.description}</div>
      </div>
    </div>);

}