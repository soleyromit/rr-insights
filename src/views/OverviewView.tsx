// ─────────────────────────────────────────────
//  views/OverviewView.tsx
//  Platform homepage — product cards + signals
// ─────────────────────────────────────────────
import { PRODUCTS } from '../data/products';
import { INSIGHTS } from '../data/insights';
import { PLATFORM_SIGNALS } from '../data/personas';
import { Card, CardTitle, MetricCard } from '../components/ui/Card';
import { InsightRow } from '../components/ui/InsightRow';
import { AIStrip } from '../components/ui/InsightRow';
import { Badge } from '../components/ui/Badge';
import type { ProductMeta } from '../types';

interface OverviewViewProps {
  onNav: (view: string) => void;
}

const ACCENT_BORDERS: Record<string, string> = {
  'exam-management': 'from-[#8b7ff5] to-[#6c62d4]',
  faas: 'from-[#f5a623] to-[#d4881a]',
  'course-eval': 'from-[#2ec4a0] to-[#1a9e82]',
  'skills-checklist': 'from-[#78aaf5] to-[#4a82e0]',
  'learning-contracts': 'from-[#e87ab5] to-[#c45090]'
};

function ProductCard({ product, onNav }: {product: ProductMeta;onNav: (v: string) => void;}) {
  const grad = ACCENT_BORDERS[product.id] ?? 'from-[#8b7ff5] to-[#6c62d4]';
  return (
    <button
      onClick={() => onNav(product.id)}
      className="relative text-left bg-[var(--bg2)] border border-[var(--border)] hover:border-[var(--border2)] rounded-xl p-4 overflow-hidden transition-all duration-150 hover:-translate-y-px group w-full">
      
      <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${grad}`} />
      <div className="flex items-start justify-between mb-2">
        <div className="text-[12px] font-semibold text-[var(--text)]">{product.name}</div>
        <Badge variant={product.status}>{product.status}</Badge>
      </div>
      <div className="text-[10px] text-[var(--text3)] leading-[1.45] mb-3">{product.description}</div>
      <div className="flex gap-3 text-[10px]">
        <span className="font-mono font-medium text-[var(--text)]">{product.criticalGaps}</span>
        <span className="text-[var(--text3)]">critical gaps</span>
        <span className="font-mono font-medium text-[var(--text)] ml-2">{product.insightCount}</span>
        <span className="text-[var(--text3)]">insights</span>
        {product.nps !== undefined &&
        <>
            <span className="font-mono font-medium text-[#e8604a] ml-2">{product.nps}/5</span>
            <span className="text-[var(--text3)]">NPS</span>
          </>
        }
      </div>
    </button>);

}

export function OverviewView({ onNav }: OverviewViewProps) {
  const recentInsights = [...INSIGHTS].
  sort((a, b) => b.createdAt.localeCompare(a.createdAt)).
  slice(0, 5);

  const totalCritical = PRODUCTS.reduce((s, p) => s + p.criticalGaps, 0);
  const totalInsights = INSIGHTS.length;
  const platformSignals = INSIGHTS.filter((i) => i.tags.includes('platform')).length;

  return (
    <div className="p-5 overflow-y-auto flex-1">
      {/* Header */}
      <div className="mb-5">
        <h1 className="rr-serif text-[24px] tracking-tight text-[var(--text)] mb-1">Platform Overview</h1>
        <p className="text-[11px] text-[var(--text3)]">
          5 products · 4 personas · 39 Granola sessions synthesized · Last updated Mar 19, 2026
        </p>
      </div>

      {/* AI strip */}
      <AIStrip>
        <strong className="text-[var(--accent)] font-medium">6 platform-level signals detected</strong> from 39 Granola
        meetings. AI opportunity layer confirmed across all 5 products. Multi-campus fragmentation is Touro's #1 pain.
        Skills standalone entity is the Q2–Q4 architectural unlock. Course Eval is a strategic recovery play after
        Blue/Canvas displacement.
      </AIStrip>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        <MetricCard label="Insights tagged" value={totalInsights} delta="+38 from Granola sync" deltaVariant="up" />
        <MetricCard label="Platform signals" value={platformSignals} delta="3 new this week" deltaVariant="up" />
        <MetricCard label="Critical gaps" value={totalCritical} delta="Across 5 products" />
        <MetricCard label="Staff signal score" value="87" delta="+4 this month" deltaVariant="up" />
      </div>

      {/* Product cards grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {PRODUCTS.map((p) => <ProductCard key={p.id} product={p} onNav={onNav} />)}
        <div className="bg-[var(--bg3)] border border-dashed border-[var(--border)] rounded-xl flex items-center justify-center p-4 text-center">
          <div>
            <div className="text-[22px] text-[var(--text3)] mb-1">+</div>
            <div className="text-[11px] text-[var(--text3)]">PA Student Dashboard<br /><span className="text-[10px]">New surface from Touro session</span></div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-3">
        {/* Recent insights */}
        <Card>
          <CardTitle sub="Last 7 days">Recent Granola insights</CardTitle>
          {recentInsights.map((i) => <InsightRow key={i.id} insight={i} />)}
        </Card>

        {/* Platform signals */}
        <Card>
          <CardTitle>Platform signal strength</CardTitle>
          {PLATFORM_SIGNALS.map((s) =>
          <div key={s.label} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
              <div className="flex-1 text-[11px] text-[var(--text2)] flex items-center gap-1.5">
                {s.label}
                {s.isNew && <span className="text-[10px] px-1 py-0.5 rounded bg-[rgba(46,196,160,0.12)] text-[#2ec4a0] font-mono">New</span>}
              </div>
              <div className="w-24 h-1.5 bg-[var(--bg4)] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${s.count / 5 * 100}%`, background: s.color }} />
              </div>
              <div className="text-[11px] font-mono font-medium text-[var(--text)] min-w-[32px] text-right">{s.count}/5</div>
            </div>
          )}
        </Card>
      </div>
    </div>);

}