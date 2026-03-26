// @ts-nocheck
// ─────────────────────────────────────────────
//  views/PortfolioView.tsx
//  Staff designer readiness audit vs JD benchmarks
// ─────────────────────────────────────────────
import { PRODUCTS } from '../data/products';
import { Card, CardTitle, MetricCard } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/InsightRow';
import { InsightRow } from '../components/ui/InsightRow';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const DIMENSIONS = [
{ label: 'Systems thinking', value: 92, color: '#8b7ff5', note: 'Service blueprints, governance models, cross-product architecture' },
{ label: 'Cross-product ownership', value: 97, color: '#2ec4a0', note: 'Sole designer across 5 enterprise SaaS products' },
{ label: 'Accessibility leadership', value: 82, color: '#f5a623', note: 'WCAG 2.1 AA within lockdown constraints — senior design challenge' },
{ label: 'Published research', value: 94, color: '#8b7ff5', note: 'ACM SIGDOC 2024 · IEEE · UXPA Journal' },
{ label: 'Domain expertise', value: 96, color: '#2ec4a0', note: 'CAPTE, ACOTE, CCNE, ARC-PA, CSWE, CAAHEP — 12 years' },
{ label: 'Measurable outcomes', value: 62, color: '#e8604a', note: '⚠ Gap — needs case studies with before/after metrics' },
{ label: 'Stakeholder communication', value: 78, color: '#f5a623', note: 'Building evidence — Touro, PRISM, Marriott sessions documented' },
{ label: 'AI-product thinking', value: 74, color: '#2ec4a0', note: 'Growing — 6 confirmed AI use cases from Granola sessions' }];


const ANCHORS = [
{
  label: 'Anchor 1',
  text: 'Sole designer with cross-product ownership across 5 enterprise SaaS products serving 170+ accredited healthcare programmes.'
},
{
  label: 'Anchor 2',
  text: 'Redesigned FaaS governance framework covering 17,000+ configured forms and 95,000+ annual support tickets (NPS 2/5 baseline).'
},
{
  label: 'Anchor 3',
  text: 'Published researcher in HCI: Vector Personas framework (ACM SIGDOC 2024) applied directly to enterprise design practice.'
},
{
  label: 'Anchor 4',
  text: 'Deep accreditation domain expertise: CAPTE, ACOTE, CCNE, ARC-PA, CSWE, CAAHEP. Designing for compliance, not just usability.'
},
{
  label: 'Anchor 5',
  text: 'Founder-level institutional knowledge: original Exxat designer from 2014, returning with graduate research lens. 12-year product context.'
}];


const GAPS = [
{
  priority: 'P1',
  title: 'FaaS 2.0 governance case study',
  desc: 'Problem scale (95k tickets, NPS 2/5) + design decisions (3-level governance) + measurable outcomes. Highest-priority case study.',
  color: '#e8604a'
},
{
  priority: 'P2',
  title: 'Exam accessibility case study',
  desc: 'Systems thinking under constraint: building WCAG 2.1 AA within lockdown browser. Staff-level challenge framing.',
  color: '#f5a623'
},
{
  priority: 'P3',
  title: 'Skills Checklist architectural case study',
  desc: 'Platform-level architecture decision: standalone entity, multi-domain (nursing, PA, social work, rad tech). January 2027 launch.',
  color: '#78aaf5'
}];


const radarData = [
{ dim: 'Systems', score: 92 },
{ dim: 'Ownership', score: 97 },
{ dim: 'A11y', score: 82 },
{ dim: 'Research', score: 94 },
{ dim: 'Domain', score: 96 },
{ dim: 'Outcomes', score: 62 },
{ dim: 'Stakeholder', score: 78 },
{ dim: 'AI thinking', score: 74 }];


const CHART_STYLE = { fontSize: 11, fill: '#5c5a57' };

export function PortfolioView() {
  const overallScore = Math.round(DIMENSIONS.reduce((s, d) => s + d.value, 0) / DIMENSIONS.length);

  return (
    <div className="p-5 overflow-y-auto flex-1">
      <h1 className="rr-serif text-[24px] tracking-tight text-[var(--text)] mb-1">Staff Designer Signal Audit</h1>
      <p className="text-[11px] text-[var(--text3)] mb-4">
        Market positioning vs Staff / Principal Product Designer JD benchmarks · March 2026
      </p>

      <div className="grid grid-cols-4 gap-2.5 mb-5">
        <MetricCard label="Overall signal" value={overallScore} delta="Strong for Staff level" deltaVariant="up" />
        <MetricCard label="Products owned" value={PRODUCTS.length} delta="Sole designer, enterprise SaaS" />
        <MetricCard label="Publications" value="3" delta="ACM · IEEE · UXPA" deltaVariant="up" />
        <MetricCard label="Portfolio gaps" value="2" delta="Case studies needed" deltaVariant="down" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Dimensions */}
        <Card>
          <CardTitle>Positioning dimensions</CardTitle>
          {DIMENSIONS.map((d) =>
          <ProgressBar
            key={d.label}
            label={d.label}
            sublabel={d.note}
            value={d.value}
            color={d.color} />

          )}
        </Card>

        <div className="flex flex-col gap-3">
          {/* Radar */}
          <Card>
            <CardTitle sub="Why: visualises which dimensions are portfolio-ready vs gaps">
              Staff signal radar
            </CardTitle>
            <div style={{ height: 220 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis dataKey="dim" tick={CHART_STYLE} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8b7ff5"
                    fill="rgba(139,127,245,0.15)"
                    strokeWidth={2} />
                  
                  <Tooltip
                    contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                  
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Anchors */}
          <Card>
            <CardTitle>Staff-level narrative anchors</CardTitle>
            {ANCHORS.map((a) =>
            <div key={a.label} className="flex gap-2 py-2 border-b border-[var(--border)] last:border-0">
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-[rgba(139,127,245,0.12)] text-[var(--accent)] font-mono h-fit flex-shrink-0 mt-0.5">
                  {a.label}
                </span>
                <p className="text-[11px] text-[var(--text2)] leading-[1.5]">{a.text}</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Case study gaps */}
      <Card>
        <CardTitle>Priority case studies to close positioning gaps</CardTitle>
        <div className="grid grid-cols-3 gap-3">
          {GAPS.map((g) =>
          <div
            key={g.title}
            className="p-3 rounded-lg border"
            style={{ borderColor: `${g.color}30`, background: `${g.color}08` }}>
            
              <div className="flex items-center gap-1.5 mb-1.5">
                <span
                className="text-[11px] px-1.5 py-0.5 rounded font-mono font-semibold"
                style={{ background: `${g.color}20`, color: g.color }}>
                
                  {g.priority}
                </span>
                <div className="text-[11px] font-medium" style={{ color: g.color }}>{g.title}</div>
              </div>
              <p className="text-[10px] text-[var(--text3)] leading-[1.45]">{g.desc}</p>
            </div>
          )}
        </div>
      </Card>
    </div>);

}