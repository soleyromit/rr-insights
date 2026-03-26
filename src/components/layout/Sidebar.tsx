import { LayoutDashboardIcon, FileTextIcon, FormInputIcon, GraduationCapIcon, CheckSquareIcon, FileSignatureIcon, UsersIcon, TagIcon, MapIcon, TrendingUpIcon, PresentationIcon, LayersIcon, GitBranchIcon, BookOpenIcon, FlameIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
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

function Section({ label }: { label: string }) {
  return <div className="px-3 pt-5 pb-1.5 eyebrow">{label}</div>;
}

export function Sidebar({ activeView, onNav }: Props) {
  const v = VERSION_HISTORY[0];
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
        <Section label="Workspace" />
        <NavItem id="overview" label="Overview" icon={LayoutDashboardIcon} active={activeView === 'overview'} onNav={onNav} />
        <NavItem id="whiteboard" label="Whiteboard artifacts" icon={LayersIcon} active={activeView === 'whiteboard'} onNav={onNav} badge="10" />
        <Section label="Products — by priority" />
        {PRODUCTS.map(p => {
          const Icon = PRODUCT_ICONS[p.id] ?? FileTextIcon;
          return (
            <NavItem key={p.id} id={p.id} label={p.shortName} icon={Icon} active={activeView === p.id}
              badge={p.daysToDeadline ? `${p.daysToDeadline}d` : undefined}
              badgeColor={p.accentColor} urgency={p.urgencyLevel} onNav={onNav} />
          );
        })}
        <Section label="Intelligence" />
        <NavItem id="personas" label="Persona map" icon={UsersIcon} active={activeView === 'personas'} onNav={onNav} />
        <NavItem id="competitive" label="Competitive analysis" icon={GitBranchIcon} active={activeView === 'competitive'} onNav={onNav} />
        <NavItem id="themes" label="Theme clusters" icon={TagIcon} active={activeView === 'themes'} onNav={onNav} />
        <NavItem id="roadmap" label="Roadmap" icon={MapIcon} active={activeView === 'roadmap'} onNav={onNav} />
        <Section label="Delivery" />
        <NavItem id="portfolio" label="Staff signal" icon={TrendingUpIcon} active={activeView === 'portfolio'} onNav={onNav} />
        <NavItem id="stakeholder" label="Stakeholder deck" icon={PresentationIcon} active={activeView === 'stakeholder'} onNav={onNav} />
        <NavItem id="changelog" label="Changelog" icon={BookOpenIcon} active={activeView === 'changelog'} onNav={onNav} badge={v.version} badgeColor="#6d5ed4" />
      </div>
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6d5ed4, #0d9488)' }}>RS</div>
          <div>
            <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>Romit Soley</div>
            <div className="text-[10px]" style={{ color: 'var(--text3)' }}>Designer II · Exxat</div>
          </div>
        </div>
      </div>
    </div>
  );
}
