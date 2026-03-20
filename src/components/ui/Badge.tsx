// ─────────────────────────────────────────────
//  components/ui/Badge.tsx  —  reusable tag pill
// ─────────────────────────────────────────────
import type { InsightTag, SeverityLevel } from '../../types';

interface BadgeProps {
  variant: InsightTag | SeverityLevel | 'active' | 'wip' | 'planned' | 'scoped';
  children: React.ReactNode;
  size?: 'sm' | 'xs';
}

const VARIANT_STYLES: Record<string, string> = {
  theme: 'bg-[rgba(139,127,245,0.15)] text-[#b5aeff]',
  gap: 'bg-[rgba(232,96,74,0.15)]  text-[#f0937e]',
  opportunity: 'bg-[rgba(46,196,160,0.12)] text-[#2ec4a0]',
  persona: 'bg-[rgba(120,170,245,0.12)] text-[#78aaf5]',
  platform: 'bg-[rgba(245,166,35,0.15)] text-[#f5a623]',
  ai: 'bg-[rgba(76,175,125,0.12)] text-[#4caf7d]',
  new: 'bg-[rgba(245,166,35,0.15)] text-[#f5a623]',
  architecture: 'bg-[rgba(232,122,181,0.12)] text-[#e87ab5]',
  critical: 'bg-[rgba(232,96,74,0.15)]  text-[#e8604a]',
  high: 'bg-[rgba(245,166,35,0.15)] text-[#f5a623]',
  medium: 'bg-[rgba(76,175,125,0.12)] text-[#4caf7d]',
  low: 'bg-[rgba(88,88,100,0.15)]  text-[#9a9690]',
  na: 'bg-[rgba(88,88,100,0.12)]  text-[#5c5a57]',
  active: 'bg-[rgba(76,175,125,0.12)] text-[#4caf7d]',
  wip: 'bg-[rgba(245,166,35,0.15)] text-[#f5a623]',
  planned: 'bg-[rgba(46,196,160,0.12)] text-[#2ec4a0]',
  scoped: 'bg-[rgba(232,122,181,0.12)] text-[#e87ab5]'
};

const TAG_LABELS: Record<string, string> = {
  theme: 'Theme', gap: 'Gap', opportunity: 'Opportunity', persona: 'Persona',
  platform: 'Platform-level', ai: 'AI ✦', new: 'New · Granola', architecture: 'Architecture',
  critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low', na: 'N/A',
  active: 'Active', wip: 'WIP', planned: 'Planned', scoped: 'Scoped'
};

export function Badge({ variant, children, size = 'xs' }: BadgeProps) {
  const cls = VARIANT_STYLES[variant] ?? 'bg-[rgba(88,88,100,0.12)] text-[#9a9690]';
  const sz = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-[9px] px-1.5 py-0.5';
  return (
    <span className={`${cls} ${sz} rounded font-medium font-sans inline-block`}>
      {children || TAG_LABELS[variant] || variant}
    </span>);

}

export function TagList({ tags }: {tags: InsightTag[];}) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((t) => <Badge key={t} variant={t} />)}
    </div>);

}