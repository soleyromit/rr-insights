// ─────────────────────────────────────────────
//  components/layout/Topbar.tsx
// ─────────────────────────────────────────────
import { PRODUCTS } from '../../data/products';

interface TopbarProps {
  activeView: string;
  onNav: (view: string) => void;
}

const VIEW_META: Record<string, {title: string;tag: string;}> = {
  overview: { title: 'Overview', tag: 'All Products' },
  personas: { title: 'Persona Map', tag: '6 Platform Signals' },
  themes: { title: 'Theme Clusters', tag: '39 Granola Sessions' },
  roadmap: { title: 'Roadmap', tag: '2026–2027' },
  portfolio: { title: 'Staff Signal', tag: 'Score: 87' },
  stakeholder: { title: 'Stakeholder Deck', tag: 'Arun + Kunal' }
};

function buildMeta(view: string) {
  if (VIEW_META[view]) return VIEW_META[view];
  const p = PRODUCTS.find((pr) => pr.id === view);
  if (p) return { title: p.name, tag: `${p.status.toUpperCase()} · ${p.insightCount} insights` };
  return { title: view, tag: '' };
}

export function Topbar({ activeView, onNav }: TopbarProps) {
  const meta = buildMeta(activeView);

  return (
    <div className="h-[52px] bg-[var(--bg2)] border-b border-[var(--border)] flex items-center justify-between px-5 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="text-[11px] text-[var(--text3)] flex items-center gap-1.5">
          Insight Hub
          <span className="text-[var(--text4)]">›</span>
          <span className="text-[12px] font-medium text-[var(--text)]">{meta.title}</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-[rgba(139,127,245,0.12)] text-[var(--accent)]">
          {meta.tag}
        </span>
      </div>
      <div className="flex gap-1.5 items-center">
        <button
          onClick={() => onNav('personas')}
          className="px-3 py-1 rounded-md text-[11px] font-medium bg-[var(--bg3)] text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--bg4)] hover:text-[var(--text)] transition-colors">
          
          Persona Map
        </button>
        <button
          onClick={() => onNav('themes')}
          className="px-3 py-1 rounded-md text-[11px] font-medium bg-[var(--bg3)] text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--bg4)] hover:text-[var(--text)] transition-colors">
          
          Themes
        </button>
        <button
          onClick={() => onNav('stakeholder')}
          className="px-3 py-1 rounded-md text-[11px] font-medium bg-[var(--accent)] text-white border border-[var(--accent)] hover:bg-[var(--accent2)] transition-colors">
          
          Stakeholder Deck
        </button>
      </div>
    </div>);

}