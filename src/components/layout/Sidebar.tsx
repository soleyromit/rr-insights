// ─────────────────────────────────────────────
//  components/layout/Sidebar.tsx
//  Navigation driver. Adding a new product =
//  add to PRODUCTS in data/products.ts — sidebar
//  auto-generates the product nav item.
// ─────────────────────────────────────────────
import {
  LayoutDashboardIcon,
  FileTextIcon,
  FormInputIcon,
  GraduationCapIcon,
  CheckSquareIcon,
  FileSignatureIcon,
  UsersIcon,
  TagIcon,
  MapIcon,
  TrendingUpIcon,
  PresentationIcon,
  SparklesIcon } from
'lucide-react';
import { PRODUCTS } from '../../data/products';
import type { ProductId } from '../../types';

type ViewId = string;

interface SidebarProps {
  activeView: ViewId;
  onNav: (view: ViewId) => void;
}

const PRODUCT_ICONS: Record<ProductId, React.ElementType> = {
  'exam-management': FileTextIcon,
  faas: FormInputIcon,
  'course-eval': GraduationCapIcon,
  'skills-checklist': CheckSquareIcon,
  'learning-contracts': FileSignatureIcon
};

const STATUS_BADGE: Record<string, {label: string;color: string;}> = {
  active: { label: 'Active', color: 'text-[#4caf7d] bg-[rgba(76,175,125,0.12)]' },
  wip: { label: 'WIP', color: 'text-[#f5a623] bg-[rgba(245,166,35,0.12)]' },
  planned: { label: 'Planned', color: 'text-[#2ec4a0] bg-[rgba(46,196,160,0.10)]' },
  scoped: { label: 'Scoped', color: 'text-[#e87ab5] bg-[rgba(232,122,181,0.10)]' }
};

function NavItem({
  id,
  label,
  icon: Icon,
  active,
  badge,
  badgeStyle,
  onNav








}: {id: string;label: string;icon: React.ElementType;active: boolean;badge?: string;badgeStyle?: string;onNav: (v: string) => void;}) {
  return (
    <button
      onClick={() => onNav(id)}
      className={`relative flex items-center gap-2 w-full px-2.5 py-1.5 mx-1.5 rounded-md text-[12px] transition-all duration-100 text-left
        ${active ?
      'bg-[rgba(139,127,245,0.1)] text-[var(--accent)] before:absolute before:left-[-6px] before:top-1/2 before:-translate-y-1/2 before:w-0.5 before:h-3.5 before:rounded-sm before:bg-[var(--accent)]' :
      'text-[var(--text2)] hover:bg-[var(--bg3)] hover:text-[var(--text)]'}`
      }>
      
      <Icon size={13} className="flex-shrink-0 opacity-70" />
      <span className="flex-1 truncate">{label}</span>
      {badge &&
      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium font-mono flex-shrink-0 ${badgeStyle}`}>
          {badge}
        </span>
      }
    </button>);

}

function SidebarSection({ label }: {label: string;}) {
  return (
    <div className="px-3.5 pt-4 pb-1 text-[9px] uppercase tracking-[0.1em] text-[var(--text3)] font-semibold">
      {label}
    </div>);

}

export function Sidebar({ activeView, onNav }: SidebarProps) {
  return (
    <div className="w-[228px] min-w-[228px] bg-[var(--bg2)] border-r border-[var(--border)] flex flex-col overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-4 flex items-center gap-2.5 border-b border-[var(--border)]">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--teal)] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          ✦
        </div>
        <div>
          <div className="font-display text-[15px] text-[var(--text)] leading-tight">Insight Hub</div>
          <div className="text-[9px] font-mono text-[var(--text3)]">exxat-rr-insights</div>
        </div>
      </div>

      {/* Workspace */}
      <SidebarSection label="Workspace" />
      <NavItem id="overview" label="Overview" icon={LayoutDashboardIcon} active={activeView === 'overview'} onNav={onNav} />

      {/* Products — auto-generated from PRODUCTS array */}
      <SidebarSection label="Products" />
      {PRODUCTS.map((p) => {
        const Icon = PRODUCT_ICONS[p.id] ?? FileTextIcon;
        const b = STATUS_BADGE[p.status];
        return (
          <NavItem
            key={p.id}
            id={p.id}
            label={p.name}
            icon={Icon}
            active={activeView === p.id}
            badge={b.label}
            badgeStyle={b.color}
            onNav={onNav} />);


      })}

      {/* Intelligence */}
      <SidebarSection label="Intelligence" />
      <NavItem id="personas" label="Persona Map" icon={UsersIcon} active={activeView === 'personas'} onNav={onNav} />
      <NavItem id="themes" label="Theme Clusters" icon={TagIcon} active={activeView === 'themes'} onNav={onNav} />
      <NavItem id="roadmap" label="Roadmap" icon={MapIcon} active={activeView === 'roadmap'} onNav={onNav} />

      {/* Portfolio */}
      <SidebarSection label="Portfolio" />
      <NavItem id="portfolio" label="Staff Signal" icon={TrendingUpIcon} active={activeView === 'portfolio'} onNav={onNav} />
      <NavItem id="stakeholder" label="Stakeholder Deck" icon={PresentationIcon} active={activeView === 'stakeholder'} onNav={onNav} />

      {/* Footer */}
      <div className="mt-auto p-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--teal)] flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0">
            RS
          </div>
          <div>
            <div className="text-[11px] font-medium text-[var(--text)]">Romit Soley</div>
            <div className="text-[9px] text-[var(--text3)]">Designer II · Exxat</div>
          </div>
        </div>
      </div>
    </div>);

}