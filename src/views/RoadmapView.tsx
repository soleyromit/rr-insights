// ─────────────────────────────────────────────
//  views/RoadmapView.tsx
//  Cross-product roadmap — swimlane layout
// ─────────────────────────────────────────────
import { PRODUCTS } from '../data/products';
import { Card, CardTitle, MetricCard } from '../components/ui/Card';

interface RoadmapItem {
  label: string;
  color: string;
  status: 'done' | 'active' | 'upcoming';
}

const SWIMLANES: {product: string;color: string;rows: {phase: string;items: RoadmapItem[];}[];}[] = [
{
  product: 'Exam Management',
  color: '#8b7ff5',
  rows: [
  {
    phase: 'Q1 2026',
    items: [
    { label: 'Calculator added', color: '#4caf7d', status: 'done' },
    { label: 'Accessibility audit started', color: '#4caf7d', status: 'done' },
    { label: 'Navigator repositioned', color: '#4caf7d', status: 'done' }]

  },
  {
    phase: 'Q2 — Apr–Jun',
    items: [
    { label: 'April 17 demo (3 personas)', color: '#8b7ff5', status: 'active' },
    { label: 'Accessibility V0 complete', color: '#f5a623', status: 'active' },
    { label: 'Q-bank architecture locked', color: '#f5a623', status: 'active' }]

  },
  {
    phase: 'Q3 — Jul–Sep',
    items: [
    { label: 'UNF pilot July', color: '#f5a623', status: 'upcoming' },
    { label: 'AI: Bloom\'s tagging + rationale', color: '#2ec4a0', status: 'upcoming' },
    { label: 'Multi-campus sharing live', color: '#2ec4a0', status: 'upcoming' }]

  },
  {
    phase: 'Q4 — Oct–Dec',
    items: [
    { label: 'Cohere: AI demo (Aug)', color: '#8b7ff5', status: 'upcoming' },
    { label: 'PANCE predictor + blueprint AI', color: '#2ec4a0', status: 'upcoming' },
    { label: 'ExamSoft-competitive launch', color: '#e8604a', status: 'upcoming' }]

  }]

},
{
  product: 'FaaS 2.0',
  color: '#f5a623',
  rows: [
  {
    phase: 'Q1 2026',
    items: [
    { label: 'Mongo migration scoped', color: '#4caf7d', status: 'done' },
    { label: 'Governance model designed', color: '#4caf7d', status: 'done' }]

  },
  {
    phase: 'Q2 — Apr–Jun',
    items: [
    { label: 'Patient Log → Mongo (May)', color: '#f5a623', status: 'active' },
    { label: 'Preceptor intake form', color: '#f5a623', status: 'active' },
    { label: 'Simple forms + scoring', color: '#f5a623', status: 'active' }]

  },
  {
    phase: 'Q3 — Jul–Sep',
    items: [
    { label: 'Close all legacy capability gaps', color: '#f5a623', status: 'upcoming' },
    { label: 'CAS compliance consolidation', color: '#2ec4a0', status: 'upcoming' },
    { label: 'PDF unified site assessment', color: '#2ec4a0', status: 'upcoming' }]

  },
  {
    phase: 'Q4 — Oct–Dec',
    items: [
    { label: 'AI approval automation 95%', color: '#2ec4a0', status: 'upcoming' },
    { label: 'Complex forms (PTSCs, CITs)', color: '#f5a623', status: 'upcoming' },
    { label: '300+ schools on FaaS', color: '#8b7ff5', status: 'upcoming' }]

  }]

},
{
  product: 'Course & Faculty Eval',
  color: '#2ec4a0',
  rows: [
  {
    phase: 'Q1–Q2 2026',
    items: [
    { label: 'April design workshop', color: '#f5a623', status: 'active' },
    { label: 'Touro survey coverage mapped', color: '#4caf7d', status: 'done' },
    { label: 'Hybrid form spec', color: '#f5a623', status: 'active' }]

  },
  {
    phase: 'Q3–Q4 2026',
    items: [
    { label: 'Module build (FaaS components)', color: '#2ec4a0', status: 'upcoming' },
    { label: 'Response rate dashboard', color: '#2ec4a0', status: 'upcoming' },
    { label: 'AI theme extraction', color: '#2ec4a0', status: 'upcoming' },
    { label: 'AI narrative synthesis (PD)', color: '#2ec4a0', status: 'upcoming' }]

  }]

},
{
  product: 'Skills Checklist',
  color: '#78aaf5',
  rows: [
  {
    phase: 'Q2 2026',
    items: [
    { label: 'Requirements: 20+ programmes', color: '#f5a623', status: 'active' },
    { label: 'Prototyping all personas', color: '#f5a623', status: 'active' },
    { label: 'Standalone entity architecture', color: '#f5a623', status: 'active' }]

  },
  {
    phase: 'Q3 2026',
    items: [
    { label: 'Core system dev', color: '#78aaf5', status: 'upcoming' },
    { label: 'Student + faculty interfaces', color: '#78aaf5', status: 'upcoming' },
    { label: 'Competency system integration', color: '#78aaf5', status: 'upcoming' }]

  },
  {
    phase: 'Q4 + Jan 2027',
    items: [
    { label: 'AI: graduation risk + scheduling', color: '#2ec4a0', status: 'upcoming' },
    { label: 'Mobile optimisation (SCCE)', color: '#78aaf5', status: 'upcoming' },
    { label: 'Launch Jan 1, 2027', color: '#e8604a', status: 'upcoming' }]

  }]

},
{
  product: 'Learning Contracts',
  color: '#e87ab5',
  rows: [
  {
    phase: 'Q2 2026',
    items: [
    { label: 'Multi-semester scope design', color: '#f5a623', status: 'active' },
    { label: 'Social work LC-eval integration', color: '#f5a623', status: 'active' },
    { label: 'ARC-PA competency mapping', color: '#f5a623', status: 'active' }]

  },
  {
    phase: 'Q3–Q4 2026',
    items: [
    { label: 'Preceptor change workflow', color: '#e87ab5', status: 'upcoming' },
    { label: 'Role-based access: 3 personas', color: '#e87ab5', status: 'upcoming' },
    { label: 'Auto-benchmark to accreditors', color: '#2ec4a0', status: 'upcoming' }]

  }]

}];


const STATUS_DOT: Record<string, string> = {
  done: 'bg-[#4caf7d]',
  active: 'bg-[#f5a623]',
  upcoming: 'bg-[var(--bg4)]'
};

export function RoadmapView() {
  return (
    <div className="p-5 overflow-y-auto flex-1">
      <h1 className="rr-serif text-[24px] tracking-tight text-[var(--text)] mb-1">Cross-Product Roadmap</h1>
      <p className="text-[11px] text-[var(--text3)] mb-4">Q1 2026 → Jan 2027 · Sourced from PRISM Marriott sessions + Granola standups</p>

      {/* Milestone metrics */}
      <div className="grid grid-cols-4 gap-2.5 mb-5">
        <MetricCard label="Next milestone" value="Apr 17" delta="3-persona Exam demo" />
        <MetricCard label="UNF pilot" value="Jul '26" delta="Accessibility V0 required" />
        <MetricCard label="Cohere conference" value="Aug '26" delta="AI features must be live" />
        <MetricCard label="Skills launch" value="Jan '27" delta="Standalone entity" />
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-4 text-[10px] text-[var(--text3)]">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#4caf7d] inline-block" />Done</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f5a623] inline-block" />Active</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[var(--bg4)] border border-[var(--border)] inline-block" />Upcoming</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#2ec4a0] inline-block" />AI feature</span>
      </div>

      {/* Swimlanes */}
      <div className="flex flex-col gap-3">
        {SWIMLANES.map((lane) =>
        <Card key={lane.product}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: lane.color }} />
              <div className="text-[12px] font-semibold" style={{ color: lane.color }}>{lane.product}</div>
            </div>
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${lane.rows.length}, 1fr)` }}>
              {lane.rows.map((row) =>
            <div key={row.phase}>
                  <div className="text-[11px] uppercase tracking-[0.07em] font-semibold text-[var(--text3)] mb-2">{row.phase}</div>
                  <div className="flex flex-col gap-1.5">
                    {row.items.map((item, i) =>
                <div key={i} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0 ${STATUS_DOT[item.status]}`} style={item.status === 'active' ? { background: lane.color } : undefined} />
                        <span className="text-[10px] text-[var(--text2)] leading-[1.4]">{item.label}</span>
                      </div>
                )}
                  </div>
                </div>
            )}
            </div>
          </Card>
        )}
      </div>
    </div>);

}