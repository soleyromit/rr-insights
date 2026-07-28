// Sidebar — P1 IA restructure (UX Audit v1, Fig. 1).
// Four layers: Story → Evidence → Products → Outputs. 23 flat items → 13 + archive.
// Badge discipline: deadline countdowns and severity dots only. No "New"/construction badges.
import { useState } from 'react';
import {
  LayoutDashboardIcon, SparklesIcon, RadioIcon, UsersIcon, GitBranchIcon, LayersIcon,
  FileTextIcon, FormInputIcon, GraduationCapIcon, CheckSquareIcon, FileSignatureIcon,
  PresentationIcon, TrendingUpIcon, MapIcon, BookOpenIcon, ArchiveIcon, ChevronRightIcon,
  FlameIcon, AlertTriangleIcon, CheckCircleIcon,
} from 'lucide-react';
import { PRODUCTS } from '../../data/products';
import { VERSION_HISTORY } from '../../data/personas';
import type { ProductId } from '../../types';

type ViewId = string;
interface Props { activeView: ViewId; onNav: (v: ViewId) => void; }

const PRODUCT_ICONS: Record<ProductId, React.ElementType> = {
  'exam-management': FileTextIcon, faas: FormInputIcon, 'course-eval': GraduationCapIcon,
  'skills-checklist': CheckSquareIcon, 'learning-contracts': FileSignatureIcon,
};
const URGENCY_ICON: Record<string, React.ElementType> = { fire: FlameIcon, warn: AlertTriangleIcon, ok: CheckCircleIcon };
const URGENCY_COLOR: Record<string, string> = { fire: '#dc2626', warn: '#b45309', ok: '#16a34a' };

function NavItem({ id, label, icon: Icon, active, badge, badgeColor, onNav, urgency }: {
  id: string; label: string; icon: React.ElementType; active: boolean;
  badge?: string; badgeColor?: string; onNav: (v: string) => void; urgency?: string;
}) {
  const UrgencyIcon = urgency ? URGENCY_ICON[urgency] : null;
  return (
    <button onClick={() => onNav(id)} className={`nav-item ${active ? 'active' : ''}`}>
      <Icon size={14} className="flex-shrink-0" style={{ opacity: 0.65 }} />
      <span className="flex-1 truncate">{label}</span>
      {UrgencyIcon && urgency && <UrgencyIcon size={10} style={{ color: URGENCY_COLOR[urgency], flexShrink: 0 }} />}
      {badge && !urgency && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 mono"
          style={{ background: badgeColor ? `${badgeColor}15` : 'var(--bg3)', color: badgeColor ?? 'var(--text3)' }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Section({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="px-3 pt-5 pb-1.5">
      <div className="eyebrow">{label}</div>
      {sub && <div style={{ fontSize: 9.5, color: 'var(--text3)', marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

// Pre-audit views awaiting merge (P3: nps, knowledge-graph · P4: exam-audit, exactone · Outputs: arun-performance, nav-ia, analytics)
const ARCHIVE_ITEMS: { id: string; label: string }[] = [
  { id: 'nps', label: 'NPS Intelligence 2025' },
  { id: 'knowledge-graph', label: 'Knowledge Graph' },
  { id: 'exam-audit', label: 'Exam Admin Audit' },
  { id: 'exactone', label: 'ExxatOne' },
  { id: 'arun-performance', label: 'Arun Performance' },
  { id: 'nav-ia', label: 'Nav IA · Apr 1' },
  { id: 'analytics', label: 'Intelligence Analytics' },
];

export function Sidebar({ activeView, onNav }: Props) {
  const v = VERSION_HISTORY[0];
  const archiveActive = ARCHIVE_ITEMS.some(a => a.id === activeView);
  const [archiveOpen, setArchiveOpen] = useState(archiveActive);

  return (
    <div className="w-[220px] min-w-[220px] flex flex-col overflow-y-auto border-r" style={{ background: '#fff', borderColor: 'var(--border)' }}>
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6d5ed4, #0d9488)' }}>✦</div>
          <div>
            <div className="text-[15px] font-semibold" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>Insight Hub</div>
            <div className="text-[10px] mono" style={{ color: 'var(--text3)' }}>rr-insights</div>
          </div>
        </div>
        <span className="version-badge"><span style={{ color: '#6d5ed4' }}>●</span>{v.version} · {v.date}</span>
      </div>

      <div className="px-2 py-1 flex-1">
        <Section label="The Story" sub="what now, and why" />
        <NavItem id="overview" label="Command Center" icon={LayoutDashboardIcon} active={activeView === 'overview'} onNav={onNav} />
        <NavItem id="narrative" label="Connect the Dots" icon={SparklesIcon} active={activeView === 'narrative'} onNav={onNav} />
        <NavItem id="roadmap" label="Roadmap" icon={MapIcon} active={activeView === 'roadmap'} onNav={onNav} />

        <Section label="Evidence" sub="signals before pages" />
        <NavItem id="signals" label="Signals" icon={RadioIcon} active={activeView === 'signals' || activeView === 'themes'} onNav={onNav} badge="7" badgeColor="#6d5ed4" />
        <NavItem id="personas" label="Persona Atlas" icon={UsersIcon} active={activeView === 'personas'} onNav={onNav} />
        <NavItem id="competitive" label="Competitive Parity" icon={GitBranchIcon} active={activeView === 'competitive'} onNav={onNav} />
        <NavItem id="whiteboard" label="Source Library" icon={LayersIcon} active={activeView === 'whiteboard'} onNav={onNav} />

        <Section label="Products" sub="by deadline pressure" />
        {PRODUCTS.map(p => {
          const Icon = PRODUCT_ICONS[p.id] ?? FileTextIcon;
          return (
            <NavItem key={p.id} id={p.id} label={p.shortName} icon={Icon} active={activeView === p.id}
              badge={p.daysToDeadline ? `${p.daysToDeadline}d` : undefined}
              badgeColor={p.accentColor} urgency={p.urgencyLevel} onNav={onNav} />
          );
        })}

        <Section label="Outputs" sub="what leaves the repo" />
        <NavItem id="stakeholder" label="Briefings" icon={PresentationIcon} active={activeView === 'stakeholder'} onNav={onNav} />
        <NavItem id="portfolio" label="Portfolio + Deliverables" icon={TrendingUpIcon} active={activeView === 'portfolio'} onNav={onNav} />

        {/* Pre-audit views, collapsed by default. Emptied as P3/P4 merges land, then removed. */}
        <button onClick={() => setArchiveOpen(o => !o)} className="nav-item" style={{ marginTop: 18, opacity: 0.75 }}>
          <ArchiveIcon size={13} className="flex-shrink-0" style={{ opacity: 0.65 }} />
          <span className="flex-1 truncate">Archive · pre-audit</span>
          <ChevronRightIcon size={12} style={{ transform: archiveOpen ? 'rotate(90deg)' : 'none', transition: 'transform 160ms', color: 'var(--text3)' }} />
        </button>
        {archiveOpen && ARCHIVE_ITEMS.map(a => (
          <NavItem key={a.id} id={a.id} label={a.label} icon={BookOpenIcon} active={activeView === a.id} onNav={onNav} />
        ))}
      </div>

      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6d5ed4, #0d9488)' }}>RS</div>
            <div>
              <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>Romit Soley</div>
              <div className="text-[10px]" style={{ color: 'var(--text3)' }}>Designer II · Exxat</div>
            </div>
          </div>
          <button onClick={() => onNav('changelog')} className="mono" title="Changelog"
            style={{ fontSize: 9.5, color: activeView === 'changelog' ? 'var(--accent)' : 'var(--text3)', cursor: 'pointer' }}>
            {v.version}
          </button>
        </div>
      </div>
    </div>
  );
}
