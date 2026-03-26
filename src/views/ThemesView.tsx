import { INSIGHTS } from '../data/insights';
import { PRODUCTS } from '../data/products';
import { Card, CardTitle } from '../components/ui/Card';
import { InsightRow, AIStrip } from '../components/ui/InsightRow';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

const THEMES = [
{
  id: 'overload',
  title: 'Cognitive overload under constraint',
  color: '#8b7ff5',
  products: ['exam-management', 'faas', 'skills-checklist'],
  persona: 'Student',
  description:
  'Students in Exam Management (no annotation), FaaS (opaque status, no mid-save), and Skills Checklist (placement-scoped, no aggregate view) all carry mental load the platform should absorb. Same underlying problem, three surfaces. 80-90% of students build external tracking documents.',
  designImplication:
  'Platform-level architecture decision, not a product-specific fix. Every student-facing surface needs a single status layer built from a shared data model.',
  insightIds: ['ins-plat-001', 'ins-em-002', 'ins-sc-001']
},
{
  id: 'ai',
  title: 'AI opportunity layer',
  color: '#2ec4a0',
  products: ['exam-management', 'faas', 'course-eval', 'skills-checklist', 'learning-contracts'],
  persona: 'All',
  description:
  'Confirmed AI use cases from Granola across every product: (1) Exam: question gen from slides, blueprint-based assembly, PANCE predictor. (2) FaaS: 95% automated compliance approvals. (3) Course Eval: theme extraction from open-ended responses. (4) Skills: smart eval scheduling, graduation risk. (5) Learning Contracts: competency gap analysis.',
  designImplication:
  'AI must be designed in at the architecture level, not retrofitted. Phase 1 is AI-architecture-ready but AI-features-off. May sprint turns AI on across Exam Management first.',
  insightIds: ['ins-plat-002', 'ins-em-003', 'ins-em-005', 'ins-ce-002']
},
{
  id: 'reporting',
  title: 'Reporting deficit',
  color: '#e8604a',
  products: ['exam-management', 'faas', 'course-eval'],
  persona: 'Program Director',
  description:
  'Program Directors cannot self-serve accreditation-ready reports from Exam Management (no NCCPA/PAEA integration), FaaS (PDF split, NPS 2/5), or Course Eval (Blue/Canvas dependency). Touro Monster Grid is a triple-digit-column Excel synthesising three data systems. This is one missing platform capability, not three separate product bugs.',
  designImplication:
  'A narrative synthesis and structured accreditation reporting layer needs to exist at the platform level. AI narrative generation from aggregate scores and open-ended themes is the fastest path.',
  insightIds: ['ins-plat-003', 'ins-faas-001', 'ins-ce-001']
},
{
  id: 'multicampus',
  title: 'Multi-campus fragmentation',
  color: '#f5a623',
  products: ['exam-management', 'faas', 'course-eval'],
  persona: 'DCE / Faculty',
  description:
  'Faculty print questions, email to a second campus, re-upload with images. California campus requires a different ExamSoft version entirely. EKG/complex images via Box. Affects programmes with multiple state campuses, estimated 30-40% of the client base. Flat tagging architecture directly solves this.',
  designImplication:
  'The architecture decision to move from folder hierarchy to flat tagging was explicitly motivated by this pain. The first pilot proof point should be a Touro multi-campus exam sharing case study.',
  insightIds: ['ins-em-001', 'ins-em-004']
},
{
  id: 'skills-entity',
  title: 'Standalone skills entity gap',
  color: '#e87ab5',
  products: ['skills-checklist', 'learning-contracts'],
  persona: 'Student · SCCE · PD',
  description:
  'Skills must be a student programme-level entity, not placement-scoped. Current architecture cannot answer "has this student demonstrated this skill across all rotations?" This blocks SCCE (no aggregate context), Student (no programme-level view), and Program Director (no cross-site reporting). Q2-Q4 roadmap confirmed.',
  designImplication:
  'Until this is resolved, Skills Checklist and Learning Contracts are both partially broken for all three affected personas. Highest-leverage architectural fix in Q2-Q4 roadmap.',
  insightIds: ['ins-sc-001', 'ins-lc-001']
},
{
  id: 'power-casual',
  title: 'Power vs. casual user split',
  color: '#78aaf5',
  products: ['exam-management', 'faas'],
  persona: 'DCE / Faculty',
  description:
  'Faculty in Exam Management (Bloom tagging overhead) and DCEs in FaaS (form governance complexity) both have a split user base. Expert configurers alongside users who want minimal overhead. The same two products, the same unresolved IA tension. Progressive disclosure is the cross-product resolution.',
  designImplication:
  'Default to the simplest flow. Power settings live behind an advanced toggle. AI handles tagging automatically so power users get value without burdening casual users.',
  insightIds: ['ins-em-004', 'ins-faas-003']
}];


const radarData = [
{ dim: 'Evidence', overload: 90, ai: 85, reporting: 80, multicampus: 75 },
{ dim: 'Products', overload: 60, ai: 100, reporting: 60, multicampus: 60 },
{ dim: 'Personas', overload: 30, ai: 100, reporting: 30, multicampus: 30 },
{ dim: 'Urgency', overload: 90, ai: 80, reporting: 70, multicampus: 85 },
{ dim: 'Competitive risk', overload: 60, ai: 95, reporting: 80, multicampus: 90 }];


const CHART_STYLE = { fontSize: 11, fill: '#5c5a57' };

export function ThemesView() {
  const platformInsights = INSIGHTS.filter((i) => i.tags.includes('platform'));

  return (
    <div className="p-5 overflow-y-auto flex-1">
      <h1 className="font-display text-[24px] tracking-tight text-[var(--text)] mb-1">Theme Clusters</h1>
      <p className="text-[11px] text-[var(--text3)] mb-4">
        Synthesised from 39 Granola sessions + project documents · 6 platform-level patterns · March 2026
      </p>

      <AIStrip>
        <strong className="text-[var(--accent)] font-medium">3 new platform-level signals this week.</strong>
        {' '}AI opportunity layer confirmed across all 5 products. Multi-campus fragmentation now quantified from
        Touro. Standalone skills entity gap has a confirmed Q2-Q4 roadmap.
      </AIStrip>

      <div className="grid grid-cols-2 gap-3 mb-5">
        {THEMES.map((theme) => {
          const productNames = PRODUCTS.
          filter((p) => theme.products.includes(p.id)).
          map((p) => p.shortName).
          join(' · ');
          const relatedInsights = INSIGHTS.filter((i) => theme.insightIds.includes(i.id));

          return (
            <Card key={theme.id}>
              <div className="flex items-start justify-between mb-2">
                <div className="text-[13px] font-medium leading-tight" style={{ color: theme.color }}>
                  {theme.title}
                </div>
                <span
                  className="text-[11px] px-1.5 py-0.5 rounded font-mono ml-2 flex-shrink-0"
                  style={{ background: `${theme.color}18`, color: theme.color }}>
                  
                  {theme.products.length} products
                </span>
              </div>

              <div className="text-[11px] text-[var(--text3)] font-mono mb-2">
                {productNames} {'\u00b7'} {theme.persona}
              </div>

              <p className="text-[11px] text-[var(--text2)] leading-[1.55] mb-3">{theme.description}</p>

              <div
                className="text-[10px] leading-[1.5] p-2.5 rounded-lg mb-3"
                style={{ background: `${theme.color}10`, color: theme.color }}>
                
                <span className="font-medium">Design implication: </span>
                {theme.designImplication}
              </div>

              {relatedInsights.length > 0 &&
              <div>
                  <div className="text-[11px] uppercase tracking-[0.07em] text-[var(--text3)] font-semibold mb-1.5">
                    Evidence
                  </div>
                  {relatedInsights.slice(0, 2).map((i) =>
                <InsightRow key={i.id} insight={i} />
                )}
                </div>
              }
            </Card>);

        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardTitle sub="Why: prioritises which themes need design action most urgently">
            Theme strength matrix
          </CardTitle>
          <div style={{ height: 260 }}>
            <ResponsiveContainer>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.06)" />
                <PolarAngleAxis dataKey="dim" tick={CHART_STYLE} />
                <Radar name="AI layer" dataKey="ai" stroke="#2ec4a0" fill="rgba(46,196,160,0.1)" strokeWidth={1.5} />
                <Radar name="Overload" dataKey="overload" stroke="#8b7ff5" fill="rgba(139,127,245,0.08)" strokeWidth={1.5} />
                <Radar name="Reporting" dataKey="reporting" stroke="#e8604a" fill="transparent" strokeDasharray="4 3" strokeWidth={1.5} />
                <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardTitle sub="Platform-level only">Platform signal feed</CardTitle>
          {platformInsights.map((i) =>
          <InsightRow key={i.id} insight={i} />
          )}
        </Card>
      </div>
    </div>);

}