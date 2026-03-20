// ─────────────────────────────────────────────
//  views/products/ProductViewShell.tsx
//  Reusable shell for products without a deep-dive yet.
//  Copy ExamManagementView.tsx pattern to build out each product.
// ─────────────────────────────────────────────
import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { getProduct } from '../../data/products';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip, ProgressBar } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import type { ProductId } from '../../types';

const AI_CALLOUTS: Partial<Record<ProductId, string>> = {
  faas: 'AI Q1–Q2 target: 95% automated compliance approval recommendations. Multi-model approach: OpenAI, Gemini, Anthropic. Theme extraction from open-ended survey responses — "saves hours and hours" (Touro direct quote).',
  'course-eval': 'AI theme extraction from open-ended responses is the #1 requested feature from Touro — and the highest-ROI AI intervention for Course Eval. AI narrative synthesis for accreditation self-study is the PD-level priority.',
  'skills-checklist': 'AI opportunities confirmed: setup automation (PDF → skill hierarchy), smart scheduling (surface eval request at right clinical moment), early-warning for at-risk students, graduation readiness predictor.',
  'learning-contracts': 'AI gap analysis: automatically benchmark learning contract objectives against ARC-PA / CSWE competency frameworks. Gaps surfaced before accreditation self-study, not after.'
};

const ROADMAP_NOTES: Partial<Record<ProductId, {phase: string;items: string[];}[]>> = {
  faas: [
  { phase: 'Q1–Q2', items: ['Patient Log → Mongo migration', 'Preceptor intake form in FaaS', '3-level governance model design'] },
  { phase: 'Q2–Q3', items: ['Close all capability gaps vs legacy', 'CAS compliance consolidation', 'PDF unified site assessment doc'] },
  { phase: 'Q4', items: ['AI approval automation (95% target)', 'Individual complex forms (PTSCs, CITs)', '300+ schools on standardized form handling'] }],

  'course-eval': [
  { phase: 'April 2026', items: ['Design workshop — full module scope', 'Hybrid form (course + multi-instructor)', 'Touro survey type coverage analysis'] },
  { phase: 'Q2–Q3', items: ['Module build using FaaS components', 'Response rate tracking dashboard', 'Historical comparison and trending'] },
  { phase: 'Q4', items: ['AI theme extraction from open-ends', 'AI narrative synthesis for self-study', 'ARC-PA accreditation report automation'] }],

  'skills-checklist': [
  { phase: 'Q2 2026', items: ['Requirements + domain research (20+ programs)', 'Detailed prototyping all personas', 'Technical architecture — standalone entity'] },
  { phase: 'Q3 2026', items: ['Core system development', 'Student + faculty interfaces', 'Integration with existing competency system'] },
  { phase: 'Q4 + Jan 2027', items: ['AI insights + automation', 'Mobile optimization', 'Full production launch Jan 1, 2027'] }],

  'learning-contracts': [
  { phase: 'Current', items: ['Multi-semester scope architecture design', 'Social work LC-evaluation integration spec', 'ARC-PA competency evidence mapping'] },
  { phase: 'Q2–Q3', items: ['Preceptor change mid-placement workflow', 'Role-based access: SCCE vs faculty vs student', 'Dynamic LC during placement (not static)'] },
  { phase: 'Q4', items: ['Auto-benchmark objectives to accreditor standards', 'Gap surfacing before self-study', 'LC-skills checklist data bridge'] }]

};

interface ProductViewShellProps {
  productId: ProductId;
}

type Tab = 'insights' | 'roadmap';

export function ProductViewShell({ productId }: ProductViewShellProps) {
  const [tab, setTab] = useState<Tab>('insights');
  const product = getProduct(productId);
  const insights = getInsightsByProduct(productId);
  const aiCallout = AI_CALLOUTS[productId];
  const roadmap = ROADMAP_NOTES[productId] ?? [];

  if (!product) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Hero */}
      <div className="mx-5 mt-5 bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 flex items-start justify-between gap-5">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-display text-[22px] text-[var(--text)] tracking-tight">{product.name}</h1>
            <Badge variant={product.status} size="sm" />
          </div>
          <p className="text-[12px] text-[var(--text3)] leading-[1.55] max-w-xl mb-3">{product.description}</p>
          {product.nps !== undefined &&
          <div className="flex items-center gap-4 text-[11px]">
              <span className="text-[var(--text3)]">NPS</span>
              <span className="font-mono font-semibold text-[#e8604a] text-lg">{product.nps}/5</span>
              {product.ticketsPerYear &&
            <>
                  <span className="text-[var(--text3)]">Annual support tickets</span>
                  <span className="font-mono font-semibold text-[var(--amber)]">{product.ticketsPerYear.toLocaleString()}</span>
                </>
            }
            </div>
          }
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono text-[22px] font-medium text-[var(--text)]">{insights.length}</div>
          <div className="text-[10px] text-[var(--text3)]">insights tagged</div>
          <div className="font-mono text-[18px] font-medium text-[var(--coral)] mt-2">{product.criticalGaps}</div>
          <div className="text-[10px] text-[var(--text3)]">critical gaps</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-5 mt-4 flex gap-1 border-b border-[var(--border)]">
        {(['insights', 'roadmap'] as Tab[]).map((t) =>
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-3.5 py-2 text-[12px] border-b-2 transition-all -mb-px capitalize
              ${tab === t ? 'text-[var(--accent)] border-[var(--accent)] font-medium' : 'text-[var(--text3)] border-transparent hover:text-[var(--text2)]'}`}>
          
            {t}
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'insights' &&
        <div>
            {aiCallout &&
          <AIStrip>
                <strong className="text-[var(--accent)] font-medium">AI opportunity:</strong> {aiCallout}
              </AIStrip>
          }
            <div className="grid grid-cols-3 gap-2.5 mb-4">
              <MetricCard label="Insights tagged" value={insights.length} delta="Sourced from Granola" />
              <MetricCard label="Critical gaps" value={product.criticalGaps} deltaVariant="down" />
              <MetricCard label="Status" value={product.status.toUpperCase()} />
            </div>
            <Card>
              <CardTitle sub={`${productId} · Granola sources`}>Insight feed</CardTitle>
              {insights.length > 0 ?
            insights.map((i) => <InsightRow key={i.id} insight={i} />) :

            <div className="py-10 text-center text-[var(--text3)] text-[11px]">
                    No insights yet for this product.<br />
                    Upload Granola notes or transcripts to populate.
                  </div>

            }
            </Card>
          </div>
        }

        {tab === 'roadmap' &&
        <div className="grid grid-cols-3 gap-3">
            {roadmap.length > 0 ?
          roadmap.map((phase) =>
          <Card key={phase.phase}>
                  <CardTitle>{phase.phase}</CardTitle>
                  {phase.items.map((item) =>
            <div key={item} className="flex items-start gap-2 py-2 border-b border-[var(--border)] last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0" />
                      <div className="text-[11px] text-[var(--text2)] leading-[1.4]">{item}</div>
                    </div>
            )}
                </Card>
          ) :

          <div className="col-span-3 py-10 text-center text-[var(--text3)] text-[11px]">
                  Roadmap not yet scoped. Upload product brief or stakeholder session to generate.
                </div>

          }
          </div>
        }
      </div>
    </div>);

}