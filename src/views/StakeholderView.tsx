// @ts-nocheck
// ─────────────────────────────────────────────
//  views/StakeholderView.tsx
//  Executive-ready briefing — Arun / Kunal framing
// ─────────────────────────────────────────────
import { Card, CardTitle } from '../components/ui/Card';
import { AIStrip } from '../components/ui/InsightRow';
import { INSIGHTS } from '../data/insights';
import { PRODUCTS } from '../data/products';

interface BriefingSectionProps {
  label: string;
  text: string;
  highlight?: boolean;
}

function BriefingSection({ label, text, highlight = false }: BriefingSectionProps) {
  return (
    <div
      className={`p-3 rounded-lg border mb-2 last:mb-0 ${
      highlight ?
      'border-[rgba(139,127,245,0.25)] bg-[rgba(139,127,245,0.05)]' :
      'border-[var(--border)] bg-[var(--bg3)]'}`
      }>
      
      <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[var(--text3)] mb-1.5">
        {label}
      </div>
      <p className={`text-[12px] leading-[1.6] ${highlight ? 'text-[var(--accent)]' : 'text-[var(--text2)]'}`}>
        {text}
      </p>
    </div>);

}

const DECKS = [
{
  audience: 'Arun Gautam',
  role: 'Direct manager',
  color: '#8b7ff5',
  problem:
  'Exxat\'s five clinical education products carry unresolved friction that compounds at scale. FaaS runs at 95,000 support tickets annually with a 2/5 NPS. Exam Management lacks accessibility and multi-campus capabilities that competitors already provide. Skills Checklist cannot answer the question every student asks: "have I met my requirements?" These are symptoms of missing platform-level architecture, not isolated product bugs.',
  findings:
  'Across 39 stakeholder sessions (March 2026), six platform-level signals emerged. Three are new this week: an AI opportunity layer confirmed across all five products, multi-campus fragmentation affecting an estimated 30–40% of the client base, and a standalone skills entity gap that blocks three personas simultaneously. Most urgent near-term finding: Touro runs seven survey types outside Exxat in Blue and Canvas because our survey UX lost their trust.',
  recommendation:
  'Three actions with the highest cross-product leverage: (1) Ship the accessibility layer for Exam Management before the UNF pilot in July — this is also the platform\'s first public commitment to WCAG 2.1 AA. (2) Begin the standalone skills entity architecture in Q2 — every day it delays, the SCCE and student personas remain underserved across two products at once. (3) Run the course evaluation module design workshop in April as planned — this is how Exxat gets back the survey surface it has already lost to competitors.'
},
{
  audience: 'Kunal',
  role: 'COO',
  color: '#2ec4a0',
  problem:
  'Three products are carrying risk that affects renewal and expansion. FaaS\'s NPS 2/5 and 95k tickets represent a retention risk at programme renewal. Exam Management\'s accessibility gaps create a compliance liability for accredited programmes. Course Eval has already lost seven survey types at Touro to Blue and Canvas — an estimated $5k/year per programme in addressable revenue.',
  findings:
  'AI is the single highest-leverage investment across all five products. Confirmed use cases from Touro alone: blueprint-based exam assembly, PANCE readiness predictor, personalised remediation, and survey theme extraction. These are not speculative — they were requested by name in session. KKR\'s expectation of TAM expansion from $300M to $1B requires this AI layer to be live and demonstrable before the next board cycle.',
  recommendation:
  'Prioritise AI feature completeness for the August Cohere conference. This is the primary external proof point. A November–December ExamSoft-competitive launch without AI features is not viable — it does not differentiate from an LMS. The multi-campus sharing architecture (flat tagging) is ready and should lead the ExamSoft displacement conversation starting now.'
},
{
  audience: 'Aarti',
  role: 'CEO',
  color: '#e87ab5',
  problem: 'Exam Management and FaaS carry the two largest platform-level risks in the current quarter.',
  findings:
  'AI is confirmed as a competitive necessity, not a roadmap nice-to-have. Touro named specific features they need. Cohere August is the external deadline.',
  recommendation:
  'Two decisions needed from Aarti: (1) Confirm AI sprint in July as a resource priority. (2) Approve the dedicated course evaluation module build to recover the survey surface lost to Blue/Canvas.'
}];


const SIGNAL_RISKS = [
{ signal: 'Course Eval: 7 survey types at Touro outside Exxat', type: 'Risk', color: '#e8604a' },
{ signal: 'ExamSoft launch without AI in Nov–Dec = not viable', type: 'Risk', color: '#e8604a' },
{ signal: 'Multi-campus sharing: flat tagging ready → lead ExamSoft displacement with this now', type: 'Opportunity', color: '#2ec4a0' },
{ signal: 'PA Student Dashboard (Touro/Aarti session) — new product surface not previously scoped', type: 'Opportunity', color: '#2ec4a0' },
{ signal: 'Skills standalone entity unblocks 3 personas simultaneously', type: 'Priority', color: '#f5a623' },
{ signal: 'UNF pilot is July — accessibility V0 is the hard deadline, not a best-effort', type: 'Priority', color: '#f5a623' }];


export function StakeholderView() {
  const criticalInsights = INSIGHTS.filter((i) => i.severity === 'critical').slice(0, 4);

  return (
    <div className="p-5 overflow-y-auto flex-1">
      <h1 className="rr-serif text-[24px] tracking-tight text-[var(--text)] mb-1">Stakeholder Deck</h1>
      <p className="text-[11px] text-[var(--text3)] mb-4">
        Executive-ready · Arun + Kunal + Aarti framing · Formal register · March 2026
      </p>

      <AIStrip>
        <strong className="text-[var(--accent)] font-medium">Audience-aware generation.</strong>{' '}
        Each deck below is calibrated to the right level of detail for that stakeholder. Arun gets process
        + risk flags. Kunal gets business impact + timeline. Aarti gets one-line summary + what she needs to decide.
      </AIStrip>

      {/* Deck cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {DECKS.map((deck) =>
        <Card key={deck.audience}>
            <div className="flex items-center gap-2 mb-3">
              <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
              style={{ background: deck.color }}>
              
                {deck.audience.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="text-[12px] font-medium text-[var(--text)]">{deck.audience}</div>
                <div className="text-[11px] text-[var(--text3)]">{deck.role}</div>
              </div>
            </div>
            <BriefingSection label="The problem" text={deck.problem} />
            <BriefingSection label="What we found" text={deck.findings} />
            <BriefingSection label="Recommended direction" text={deck.recommendation} highlight />
          </Card>
        )}
      </div>

      {/* Signal / risk table */}
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardTitle>Signals for leadership</CardTitle>
          {SIGNAL_RISKS.map((s, i) =>
          <div key={i} className="flex items-start gap-2 py-2 border-b border-[var(--border)] last:border-0">
              <span
              className="text-[11px] px-1.5 py-0.5 rounded font-mono flex-shrink-0 mt-0.5"
              style={{ background: `${s.color}15`, color: s.color }}>
              
                {s.type}
              </span>
              <p className="text-[11px] text-[var(--text2)] leading-[1.45]">{s.signal}</p>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle sub="Highest severity · most recent">Critical insights to brief</CardTitle>
          {criticalInsights.map((i) =>
          <div key={i.id} className="py-2 border-b border-[var(--border)] last:border-0">
              <p className="text-[11px] text-[var(--text2)] leading-[1.5] mb-1">{i.text}</p>
              <p className="text-[11px] text-[var(--text3)] font-mono">{i.source}</p>
            </div>
          )}
        </Card>
      </div>
    </div>);

}