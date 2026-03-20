// ─────────────────────────────────────────────
//  views/products/ExamManagementView.tsx
//  Deep-dive for Exam Management.
//  PATTERN: Copy this file for every new product.
//  Update: productId, product-specific data, tabs.
// ─────────────────────────────────────────────
import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { getProduct } from '../../data/products';
import { EXAM_TIMELINE } from '../../data/personas';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip, TimelineItemRow, ProgressBar } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, LineChart, Line, Legend } from
'recharts';

const PRODUCT_ID = 'exam-management';

// ── Tab types for this product ──
type TabId = 'insights' | 'blueprint' | 'features' | 'analytics' | 'decisions';

const TABS: {id: TabId;label: string;}[] = [
{ id: 'insights', label: 'Insights' },
{ id: 'blueprint', label: 'Service Blueprint' },
{ id: 'features', label: 'Feature Map' },
{ id: 'analytics', label: 'Analytics' },
{ id: 'decisions', label: 'Design Decisions' }];


// ── Mock chart data ──
const scoreDistData = [
{ range: '50–59', cohort: 3, national: 2 },
{ range: '60–69', cohort: 8, national: 6 },
{ range: '70–79', cohort: 22, national: 18 },
{ range: '80–89', cohort: 34, national: 30 },
{ range: '90–100', cohort: 18, national: 22 }];


const eorData = [
{ name: 'EOR 1', cohort: 74, benchmark: 77 },
{ name: 'EOR 2', cohort: 71, benchmark: 77 },
{ name: 'EOR 3', cohort: 78, benchmark: 77 },
{ name: 'EOR 4', cohort: 76, benchmark: 77 },
{ name: 'EOR 5', cohort: 80, benchmark: 77 },
{ name: 'EOR 6', cohort: 73, benchmark: 77 },
{ name: 'EOR 7', cohort: 82, benchmark: 77 },
{ name: 'EOR 8', cohort: 77, benchmark: 77 }];


const bloomData = [
{ level: 'Remember', pval: 0.82, count: 18 },
{ level: 'Understand', pval: 0.74, count: 24 },
{ level: 'Apply', pval: 0.61, count: 32 },
{ level: 'Analyze', pval: 0.52, count: 16 },
{ level: 'Evaluate', pval: 0.45, count: 7 },
{ level: 'Create', pval: 0.38, count: 3 }];


const nccpaData = [
{ subject: 'Cardio', A: 85, B: 80 },
{ subject: 'Pulm', A: 72, B: 80 },
{ subject: 'GI', A: 80, B: 80 },
{ subject: 'Neuro', A: 68, B: 80 },
{ subject: 'MSK', A: 91, B: 80 },
{ subject: 'Derm', A: 60, B: 80 },
{ subject: 'Psych', A: 74, B: 80 }];


const bankGrowthData = [
{ month: 'Sep', total: 1240, approved: 980 },
{ month: 'Oct', total: 1380, approved: 1100 },
{ month: 'Nov', total: 1520, approved: 1230 },
{ month: 'Dec', total: 1640, approved: 1340 },
{ month: 'Jan', total: 1710, approved: 1410 },
{ month: 'Feb', total: 1780, approved: 1480 },
{ month: 'Mar', total: 1847, approved: 1530 }];


const CHART_STYLE = { fontSize: 10, fill: '#5c5a57' };

// ── Feature box ──
function FeatureBox({ title, desc, variant }: {title: string;desc: string;variant: string;}) {
  const variants: Record<string, string> = {
    accent: 'border-[rgba(139,127,245,0.2)] bg-[rgba(139,127,245,0.04)] text-[#b5aeff]',
    teal: 'border-[rgba(46,196,160,0.2)]  bg-[rgba(46,196,160,0.04)]  text-[#2ec4a0]',
    amber: 'border-[rgba(245,166,35,0.2)]  bg-[rgba(245,166,35,0.04)]  text-[#f5a623]',
    coral: 'border-[rgba(232,96,74,0.2)]   bg-[rgba(232,96,74,0.04)]   text-[#e8604a]',
    blue: 'border-[rgba(120,170,245,0.2)] bg-[rgba(120,170,245,0.04)] text-[#78aaf5]',
    green: 'border-[rgba(76,175,125,0.2)]  bg-[rgba(76,175,125,0.04)]  text-[#4caf7d]'
  };
  return (
    <div className={`p-3 rounded-lg border ${variants[variant] ?? variants.accent}`}>
      <div className="text-[11px] font-semibold mb-1">{title}</div>
      <div className="text-[10px] text-[var(--text3)] leading-[1.45]">{desc}</div>
    </div>);

}

// ── Blueprint row ──
function BPRow({ lane, cells, isGap }: {lane: string;cells: string[];isGap?: boolean;}) {
  return (
    <div className="flex text-[10px] border-b border-[var(--border)] last:border-0">
      <div className="w-[110px] min-w-[110px] px-2 py-2 bg-[var(--bg3)] text-[9px] uppercase tracking-[0.05em] font-medium text-[var(--text3)] border-r border-[var(--border)] flex-shrink-0">
        {lane}
      </div>
      {cells.map((c, i) =>
      <div
        key={i}
        className={`flex-1 px-2 py-2 border-r border-[var(--border)] last:border-0 leading-[1.4] ${isGap ? 'text-[#e8604a]' : 'text-[var(--text2)]'}`}>
        
          {c}
        </div>
      )}
    </div>);

}

// ── Decision card ──
function DecisionCard({ title, decision, rationale, tradeoff, source

}: {title: string;decision: string;rationale: string;tradeoff: string;source: string;}) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <InsightRow insight={{ id: '', text: decision, tags: ['architecture'], source, productIds: [], createdAt: '' }} />
      <InsightRow insight={{ id: '', text: rationale, tags: ['theme'], source, productIds: [], createdAt: '' }} />
      <InsightRow insight={{ id: '', text: tradeoff, tags: ['gap'], source, productIds: [], createdAt: '' }} />
    </Card>);

}

export function ExamManagementView() {
  const [activeTab, setActiveTab] = useState<TabId>('insights');
  const product = getProduct(PRODUCT_ID);
  const insights = getInsightsByProduct(PRODUCT_ID);

  if (!product) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Product hero */}
      <div className="mx-5 mt-5 mb-0 bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 flex items-start justify-between gap-5">
        <div className="flex-1">
          <h1 className="font-display text-[22px] text-[var(--text)] tracking-tight mb-1">{product.name}</h1>
          <p className="text-[12px] text-[var(--text3)] leading-[1.55] max-w-xl">{product.description}</p>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {['Student', 'DCE / Faculty', 'Admin', 'Program Director'].map((p) =>
            <Badge key={p} variant="persona">{p}</Badge>
            )}
            <Badge variant="theme">CAAHEP · CAPTE · ARC-PA</Badge>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono text-[22px] font-medium text-[var(--text)]">Jul '26</div>
          <div className="text-[10px] text-[var(--text3)]">UNF pilot deadline</div>
          <div className="font-mono text-[18px] font-medium text-[var(--coral)] mt-2">Nov–Dec</div>
          <div className="text-[10px] text-[var(--text3)]">ExamSoft-competitive</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-5 mt-4 flex gap-1 border-b border-[var(--border)]">
        {TABS.map((t) =>
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          className={`px-3.5 py-2 text-[12px] border-b-2 transition-all -mb-px
              ${activeTab === t.id ?
          'text-[var(--accent)] border-[var(--accent)] font-medium' :
          'text-[var(--text3)] border-transparent hover:text-[var(--text2)]'}`
          }>
          
            {t.label}
          </button>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* ── INSIGHTS ── */}
        {activeTab === 'insights' &&
        <div>
            <AIStrip>
              <strong className="text-[var(--accent)] font-medium">9 Granola sessions ingested.</strong>{' '}
              Multi-campus sharing is Touro's #1 pain. Accessibility V0 is the hard blocker for the UNF July pilot.
              Blueprint-based AI assembly is the most-wanted faculty feature. PANCE predictor is the most-wanted PD feature.
            </AIStrip>
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              <MetricCard label="Insights" value={insights.length} delta="+12 from Granola" deltaVariant="up" />
              <MetricCard label="Critical gaps" value={product.criticalGaps} delta="Accessibility, multi-campus, annotation" deltaVariant="down" />
              <MetricCard label="AI opportunities" value="4" delta="All confirmed from Touro" deltaVariant="up" />
              <MetricCard label="UNF pilot" value="Jul '26" delta="Accessibility is blocker" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardTitle sub={`${insights.length} sourced findings`}>Insight feed</CardTitle>
                {insights.map((i) => <InsightRow key={i.id} insight={i} />)}
              </Card>
              <div className="flex flex-col gap-3">
                <Card>
                  <CardTitle>Persona design readiness</CardTitle>
                  <ProgressBar label="Student (test-taker)" sublabel="V0 nearly ready" value={62} color="#2ec4a0" />
                  <ProgressBar label="Faculty (question author)" sublabel="Architecture in progress" value={38} color="#f5a623" />
                  <ProgressBar label="Admin (assessment config)" sublabel="Distribution screen in dev" value={28} color="#f5a623" />
                  <ProgressBar label="Program Director" sublabel="Dashboard scoped — PA" value={15} color="#e8604a" />
                </Card>
                <Card>
                  <CardTitle>Feature delivery status</CardTitle>
                  <ProgressBar label="Student exam interface" value={75} color="#2ec4a0" />
                  <ProgressBar label="Calculator (sci + simple)" value={100} color="#4caf7d" valueLabel="Done" />
                  <ProgressBar label="Accessibility V1" value={30} color="#e8604a" />
                  <ProgressBar label="Admin distribution screen" value={45} color="#f5a623" />
                  <ProgressBar label="Question bank / tagging" value={20} color="#e8604a" />
                  <ProgressBar label="AI features (May target)" value={5} color="#5c5a57" />
                </Card>
                <Card>
                  <CardTitle>Milestone timeline</CardTitle>
                  {EXAM_TIMELINE.map((t, i) => <TimelineItemRow key={i} item={t} />)}
                </Card>
              </div>
            </div>
          </div>
        }

        {/* ── SERVICE BLUEPRINT ── */}
        {activeTab === 'blueprint' &&
        <Card className="overflow-x-auto">
            <CardTitle sub="From creation to post-exam analytics">Question lifecycle — service blueprint</CardTitle>
            <div style={{ minWidth: 700 }}>
              <BPRow lane="" cells={['Create', 'Tag', 'Review', 'Publish', 'Exam delivery', 'Analytics']} />
              <BPRow lane="User actions" cells={['Write stem + options', 'Assign Bloom\'s, LO', 'Peer reviews, approves', 'Question to bank', 'Student takes exam', 'Faculty reviews stats']} />
              <BPRow lane="Frontstage UI" cells={['Rich text editor, image upload', 'Tag panel + AI overlay', 'Review sidebar, diff view', 'Bank view, version history', 'Exam UI + a11y layer', 'Item heatmap, p-value dash']} />
              <BPRow lane="Backstage" cells={['Version UUID, audit log', 'AI taxonomy on save', 'Notification, audit log', 'Status → approved', 'Lockdown session, encrypted', 'p-value, PBis computed']} />
              <BPRow lane="Policies" cells={['FERPA: no student ID', 'CAPTE requires LO map', 'Min 1 peer reviewer', 'WCAG 2.1 AA check', 'Lockdown enforced', 'De-identified on export']} />
              <BPRow lane="Pain points" isGap cells={['—', 'Manual tagging = burden', 'No async threading', 'Multi-campus sync broken', 'No annotation, a11y gap', 'No cohort vs national']} />
            </div>
          </Card>
        }

        {/* ── FEATURES ── */}
        {activeTab === 'features' &&
        <div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <Card>
                <CardTitle>Question creation</CardTitle>
                <div className="flex flex-col gap-2">
                  <FeatureBox title="Rich text editor" desc="Stem, options, image upload, media embed, table support. Rationale field shown post-submit on low-stakes exams." variant="accent" />
                  <FeatureBox title="Question types" desc="MCQ · Multi-select · Clinical vignette · True/False · Matching · Free response." variant="accent" />
                  <FeatureBox title="Version control" desc="Every edit creates new version. Owner approval required. HOD sees version usage across faculty." variant="accent" />
                </div>
              </Card>
              <Card>
                <CardTitle>Tagging system</CardTitle>
                <div className="flex flex-col gap-2">
                  <FeatureBox title="5–7 predefined categories" desc="Question type · Bloom's (1–3) · Difficulty · Body system · Learning objective · NCCPA blueprint cell." variant="teal" />
                  <FeatureBox title="AI tag assist ✦" desc="Bloom's auto-suggest on save. Tag consistency checker (heart vs cardiovascular). Import from ExamSoft auto-tags 10,000+ questions." variant="teal" />
                  <FeatureBox title="Smart Views" desc="Personal folders auto-populated by tag criteria. Mode 1: always-updated. Mode 2: fixed snapshot for audit trail." variant="teal" />
                </div>
              </Card>
              <Card>
                <CardTitle>Review workflow</CardTitle>
                <div className="flex flex-col gap-2">
                  <FeatureBox title="Peer review" desc="Async comment threading (V1). Diff view between versions. Draft → In Review → Approved." variant="amber" />
                  <FeatureBox title="HOD approval" desc="Head of department visibility into all version usage. Approval gates before campus-wide availability." variant="amber" />
                  <FeatureBox title="Import / migration" desc="ExamSoft → AI auto-tag → review → approve → bank. 10,000+ question migration. Folder structure → flat tags." variant="amber" />
                </div>
              </Card>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardTitle>Assessment assembly</CardTitle>
                <div className="flex flex-col gap-2">
                  <FeatureBox title="Manual selection" desc="Filter by any tag combination. Difficulty distribution dashboard. 3 entry points: bank, course, exam setup." variant="blue" />
                  <FeatureBox title="AI blueprint assembly ✦" desc="V2: AI selects questions satisfying all NCCPA blueprint cells. Lifesaver — Touro direct quote." variant="blue" />
                  <FeatureBox title="Randomization" desc="Question + option order randomization per student. Parallel forms. Prevents cheating in synchronous settings." variant="blue" />
                </div>
              </Card>
              <Card>
                <CardTitle>Multi-campus sharing</CardTitle>
                <div className="flex flex-col gap-2">
                  <FeatureBox title="Universal repository" desc="Single source — no more ExamSoft copy/paste between campuses. View-only access for approved questions cross-campus." variant="green" />
                  <FeatureBox title="Access controls" desc="Department / course-level access. View vs. modify rights. Campus-scoped visibility." variant="green" />
                  <FeatureBox title="Approval workflow" desc="New questions require campus approval before cross-campus availability. HOD tracks which campuses use which versions." variant="green" />
                </div>
              </Card>
              <Card>
                <CardTitle>Analytics layer</CardTitle>
                <div className="flex flex-col gap-2">
                  <FeatureBox title="Item performance" desc="p-value per question per course offering. Point biserial. Discrimination index. Negative PBis = flag for review." variant="coral" />
                  <FeatureBox title="Clickable insights" desc="Performance by course instance. Filter by creator, date, difficulty. Correctness % across cohorts." variant="coral" />
                  <FeatureBox title="Rubric support" desc="% score rubrics for PD lab testing (Manhattan PA model). Faculty review questions as good/bad based on metrics." variant="coral" />
                </div>
              </Card>
            </div>
          </div>
        }

        {/* ── ANALYTICS ── */}
        {activeTab === 'analytics' &&
        <div>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              <MetricCard label="Bank size" value="1,847" delta="+140 this semester" deltaVariant="up" />
              <MetricCard label="Avg score" value="74%" delta="+3 vs last cohort" deltaVariant="up" />
              <MetricCard label="Item flag rate" value="12%" delta="High — review needed" deltaVariant="down" />
              <MetricCard label="PANCE readiness" value="73%" delta="Of cohort ≥ 75 score" deltaVariant="up" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Card>
                <CardTitle sub="Why: reveals if cohort clusters at risk zone">Score distribution — PT Cohort 2025</CardTitle>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={scoreDistData} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="range" tick={CHART_STYLE} />
                      <YAxis tick={CHART_STYLE} />
                      <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                      <Legend wrapperStyle={{ fontSize: 10, color: '#5c5a57' }} />
                      <Bar dataKey="cohort" fill="rgba(139,127,245,0.7)" radius={3} name="This cohort" />
                      <Bar dataKey="national" fill="rgba(46,196,160,0.45)" radius={3} name="National avg" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <CardTitle sub="Why: shows which rotations produce under-performers">EOR performance across 8 rotations</CardTitle>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer>
                    <LineChart data={eorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={CHART_STYLE} />
                      <YAxis domain={[60, 90]} tick={CHART_STYLE} />
                      <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                      <Legend wrapperStyle={{ fontSize: 10, color: '#5c5a57' }} />
                      <Line type="monotone" dataKey="cohort" stroke="#8b7ff5" dot={{ fill: '#8b7ff5', r: 3 }} name="Cohort avg" strokeWidth={2} />
                      <Line type="monotone" dataKey="benchmark" stroke="rgba(232,96,74,0.6)" strokeDasharray="4 3" dot={false} name="Benchmark 77%" strokeWidth={1.5} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Card>
                <CardTitle sub="Why: validates higher-order questions are harder — quality signal">p-value by Bloom's level</CardTitle>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={bloomData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis type="number" domain={[0, 1]} tick={CHART_STYLE} />
                      <YAxis dataKey="level" type="category" tick={CHART_STYLE} width={70} />
                      <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                      <Bar dataKey="pval" fill="rgba(139,127,245,0.6)" radius={3} name="Avg p-value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <CardTitle sub="Why: replaces Touro's Monster Grid — triple-digit Excel columns">NCCPA blueprint coverage</CardTitle>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer>
                    <RadarChart data={nccpaData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="subject" tick={{ ...CHART_STYLE, fontSize: 9 }} />
                      <Radar name="Student" dataKey="A" stroke="#8b7ff5" fill="rgba(139,127,245,0.15)" strokeWidth={2} />
                      <Radar name="Blueprint" dataKey="B" stroke="rgba(46,196,160,0.5)" fill="transparent" strokeDasharray="4 3" strokeWidth={1.5} />
                      <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <Card>
              <CardTitle sub="Why: tracks approved vs. total — governance health signal">Question bank growth</CardTitle>
              <div style={{ height: 180 }}>
                <ResponsiveContainer>
                  <AreaChart data={bankGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={CHART_STYLE} />
                    <YAxis tick={CHART_STYLE} />
                    <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                    <Legend wrapperStyle={{ fontSize: 10, color: '#5c5a57' }} />
                    <Area type="monotone" dataKey="total" stroke="#2ec4a0" fill="rgba(46,196,160,0.1)" name="Total questions" strokeWidth={2} />
                    <Area type="monotone" dataKey="approved" stroke="#8b7ff5" fill="rgba(139,127,245,0.08)" name="Approved" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        }

        {/* ── DESIGN DECISIONS ── */}
        {activeTab === 'decisions' &&
        <div className="grid grid-cols-2 gap-3">
            <DecisionCard
            title="Decision 1: Flat tagging over folder hierarchy"
            decision="Moved away from ExamSoft's rigid folder structure. Adopted flat tagging with Smart Views."
            rationale="ExamSoft folder structure fails cross-course knowledge mapping. Students fail because prerequisite gaps from other courses aren't tracked. Folders break multi-campus sharing. ~20 tags per question enables cross-course, cross-campus, cross-cohort analytics."
            tradeoff="Folders feel familiar to faculty. Risk: cognitive overhead deters casual users. Mitigation: AI handles tagging on save. Smart Views recreate the folder UX on top of flat architecture."
            source="Platform strategy · Mar 4 · Q-Bank architecture · Mar 12" />
          
            <DecisionCard
            title="Decision 2: Platform-embedded accessibility (no 3rd-party)"
            decision="All accessibility features must be built into the exam platform. No external tools allowed."
            rationale="Lockdown browser blocks all external tools. This is not a design preference — it is the only compliant path. Pearson Education model (GRE, SAT, TOEFL) proves it is achievable with platform-embedded features."
            tradeoff="Building custom OSK, zoom, TTS is significantly more expensive. Phased delivery (V0→V1) manages cost. V0 ships minimum viable for UNF pilot compliance."
            source="Accessibility session · Mar 16 · Nipun roadmap · Mar 11" />
          
            <DecisionCard
            title="Decision 3: React front-end, AI-first architecture"
            decision="React front-end confirmed for entire app (admin + student). AI-first philosophy: every screen must consider AI integration upfront."
            rationale="Retrofitting AI into existing functionality is architectural debt. This is Exxat's primary competitive moat vs ExamSoft (which cannot AI-first its 20-year-old codebase). Must be designed in from scratch."
            tradeoff="AI features blocked in Phase 1 due to adoption concerns. Risk of over-promising timeline. Mitigation: Phase 1 is AI-architecture-ready but AI-features-off until May sprint."
            source="PRISM Day 2 · Mar 3 · Exam stand-up · Mar 19" />
          
            <DecisionCard
            title="Decision 4: Assessment creation as primary workflow"
            decision="Current wireframe 'too database-heavy.' Assessment creation must be the primary workflow, not Q-bank management."
            rationale="Faculty's primary job is building and delivering exams, not curating a database. 3 entry points to questions: bank direct, within course, during exam assembly. Assessment creation surfaces questions — not the reverse."
            tradeoff="Power users (program-level) want to manage the bank as a primary workflow. Progressive disclosure solves this: assessment creation as default, bank management in 'advanced' view for power users."
            source="Q-Bank multi-campus · Mar 12 · Platform strategy · Mar 4" />
          
          </div>
        }
      </div>
    </div>);

}