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
  PolarAngleAxis, LineChart, Line, Legend,
} from 'recharts';

const PRODUCT_ID = 'exam-management';
type TabId = 'insights' | 'blueprint' | 'features' | 'analytics' | 'accessibility' | 'competitive' | 'decisions';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights', label: 'Insights' },
  { id: 'blueprint', label: 'Service Blueprint' },
  { id: 'features', label: 'Feature Map' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'competitive', label: 'Competitive' },
  { id: 'decisions', label: 'Design Decisions' },
];

const scoreDistData = [
  { range: '50-59', cohort: 3, national: 2 },
  { range: '60-69', cohort: 8, national: 6 },
  { range: '70-79', cohort: 22, national: 18 },
  { range: '80-89', cohort: 34, national: 30 },
  { range: '90-100', cohort: 18, national: 22 },
];
const eorData = [
  { name: 'EOR 1', cohort: 74, benchmark: 77 },
  { name: 'EOR 2', cohort: 71, benchmark: 77 },
  { name: 'EOR 3', cohort: 78, benchmark: 77 },
  { name: 'EOR 4', cohort: 76, benchmark: 77 },
  { name: 'EOR 5', cohort: 80, benchmark: 77 },
  { name: 'EOR 6', cohort: 73, benchmark: 77 },
  { name: 'EOR 7', cohort: 82, benchmark: 77 },
  { name: 'EOR 8', cohort: 77, benchmark: 77 },
];
const bloomData = [
  { level: 'Remember', pval: 0.82 },
  { level: 'Understand', pval: 0.74 },
  { level: 'Apply', pval: 0.61 },
  { level: 'Analyze', pval: 0.52 },
  { level: 'Evaluate', pval: 0.45 },
  { level: 'Create', pval: 0.38 },
];
const nccpaData = [
  { subject: 'Cardio', A: 85, B: 80 },
  { subject: 'Pulm', A: 72, B: 80 },
  { subject: 'GI', A: 80, B: 80 },
  { subject: 'Neuro', A: 68, B: 80 },
  { subject: 'MSK', A: 91, B: 80 },
  { subject: 'Derm', A: 60, B: 80 },
  { subject: 'Psych', A: 74, B: 80 },
];
const bankGrowthData = [
  { month: 'Sep', total: 1240, approved: 980 },
  { month: 'Oct', total: 1380, approved: 1100 },
  { month: 'Nov', total: 1520, approved: 1230 },
  { month: 'Dec', total: 1640, approved: 1340 },
  { month: 'Jan', total: 1710, approved: 1410 },
  { month: 'Feb', total: 1780, approved: 1480 },
  { month: 'Mar', total: 1847, approved: 1530 },
];
const CS = { fontSize: 10, fill: '#5c5a57' };

function FB({ title, desc, v }: { title: string; desc: string; v: string }) {
  const vs: Record<string, string> = {
    accent: 'border-[rgba(139,127,245,0.2)] bg-[rgba(139,127,245,0.04)] text-[#b5aeff]',
    teal: 'border-[rgba(46,196,160,0.2)] bg-[rgba(46,196,160,0.04)] text-[#2ec4a0]',
    amber: 'border-[rgba(245,166,35,0.2)] bg-[rgba(245,166,35,0.04)] text-[#f5a623]',
    coral: 'border-[rgba(232,96,74,0.2)] bg-[rgba(232,96,74,0.04)] text-[#e8604a]',
    blue: 'border-[rgba(120,170,245,0.2)] bg-[rgba(120,170,245,0.04)] text-[#78aaf5]',
    green: 'border-[rgba(76,175,125,0.2)] bg-[rgba(76,175,125,0.04)] text-[#4caf7d]',
    pink: 'border-[rgba(219,39,119,0.2)] bg-[rgba(219,39,119,0.04)] text-[#ec4899]',
  };
  return (
    <div className={`p-3 rounded-lg border ${vs[v] ?? vs.accent}`}>
      <div className="text-[13px] font-semibold mb-1">{title}</div>
      <div className="text-[13px] text-[var(--text3)] leading-[1.45]">{desc}</div>
    </div>
  );
}

function BPRow({ lane, cells, isGap }: { lane: string; cells: string[]; isGap?: boolean }) {
  return (
    <div className="flex text-[13px] border-b border-[var(--border)] last:border-0">
      <div className="w-[110px] min-w-[110px] px-2 py-2 bg-[var(--bg3)] text-[9px] uppercase tracking-[0.05em] font-medium text-[var(--text3)] border-r border-[var(--border)] flex-shrink-0">{lane}</div>
      {cells.map((c, i) => (
        <div key={i} className={`flex-1 px-2 py-2 border-r border-[var(--border)] last:border-0 leading-[1.4] ${isGap ? 'text-[#e8604a]' : 'text-[var(--text2)]'}`}>{c}</div>
      ))}
    </div>
  );
}

function DC({ title, d, r, t, src }: { title: string; d: string; r: string; t: string; src: string }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <InsightRow insight={{ id: '', text: d, tags: ['architecture'], source: src, productIds: [], createdAt: '' }} />
      <InsightRow insight={{ id: '', text: r, tags: ['theme'], source: src, productIds: [], createdAt: '' }} />
      <InsightRow insight={{ id: '', text: t, tags: ['gap'], source: src, productIds: [], createdAt: '' }} />
    </Card>
  );
}

function AR({ feature, adm, stu, wcag, p }: { feature: string; adm: string; stu: string; wcag: string; p: 'critical' | 'high' | 'new' }) {
  const col = { critical: 'text-[#e8604a]', high: 'text-[#f5a623]', new: 'text-[#2ec4a0]' };
  const lbl = { critical: 'CRITICAL', high: 'HIGH', new: 'NEW' };
  return (
    <div className="grid grid-cols-[140px_1fr_1fr_80px_60px] gap-2 text-[13px] border-b border-[var(--border)] py-2.5 last:border-0">
      <div className="font-medium text-[var(--text)]">{feature}</div>
      <div className="text-[var(--text3)] leading-[1.4]">{adm}</div>
      <div className="text-[var(--text3)] leading-[1.4]">{stu}</div>
      <div className="text-[var(--text3)] font-mono text-[9px]">{wcag}</div>
      <div className={`font-semibold text-[9px] ${col[p]}`}>{lbl[p]}</div>
    </div>
  );
}

function CR({ feature, es, bb, cv, d2l, ex }: { feature: string; es: string; bb: string; cv: string; d2l: string; ex: string }) {
  const gc = (v: string) => v.startsWith('Yes') || v.startsWith('Built') || v.startsWith('Bulk') || v.startsWith('Per-Q') || v.startsWith('Required') || v.startsWith('3 mode')
    ? 'text-[#2ec4a0]'
    : v.startsWith('No') || v.startsWith('Blocked') || v.startsWith('None')
    ? 'text-[#e8604a]'
    : 'text-[#f5a623]';
  return (
    <div className="grid grid-cols-[130px_1fr_1fr_1fr_1fr_1fr] gap-1 text-[9px] border-b border-[var(--border)] py-2 last:border-0">
      <div className="text-[var(--text2)] font-medium text-[13px]">{feature}</div>
      <div className={`leading-[1.4] ${gc(es)}`}>{es}</div>
      <div className={`leading-[1.4] ${gc(bb)}`}>{bb}</div>
      <div className={`leading-[1.4] ${gc(cv)}`}>{cv}</div>
      <div className={`leading-[1.4] ${gc(d2l)}`}>{d2l}</div>
      <div className={`leading-[1.4] font-medium ${gc(ex)}`}>{ex}</div>
    </div>
  );
}

export function ExamManagementView() {
  const [activeTab, setActiveTab] = useState<TabId>('insights');
  const product = getProduct(PRODUCT_ID);
  const insights = getInsightsByProduct(PRODUCT_ID);
  if (!product) return null;

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="mx-5 mt-5 mb-0 bg-[var(--bg2)] border border-[var(--border)] rounded-xl p-4 flex items-start justify-between gap-5">
        <div className="flex-1">
          <h1 className="rr-serif text-[22px] text-[var(--text)] tracking-tight mb-1">{product.name}</h1>
          <p className="text-[13px] text-[var(--text3)] leading-[1.55] max-w-xl">{product.description}</p>
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {['Student', 'DCE / Faculty', 'Admin', 'Program Director'].map(p => (
              <Badge key={p} variant="persona">{p}</Badge>
            ))}
            <Badge variant="theme">CAAHEP · CAPTE · ARC-PA</Badge>
            <a href="https://project-precious-cranberry-828.magicpatterns.app" target="_blank" rel="noreferrer"
              className="px-2 py-0.5 rounded text-[13px] font-medium border border-[rgba(219,39,119,0.4)] text-[#ec4899] hover:bg-[rgba(219,39,119,0.08)] transition-colors">
              University UI
            </a>
            <a href="https://project-student-exam-accessibility.magicpatterns.app" target="_blank" rel="noreferrer"
              className="px-2 py-0.5 rounded text-[13px] font-medium border border-[rgba(46,196,160,0.4)] text-[#2ec4a0] hover:bg-[rgba(46,196,160,0.08)] transition-colors">
              Student UI
            </a>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono text-[22px] font-medium text-[var(--text)]">Apr 17</div>
          <div className="text-[13px] text-[var(--text3)]">Demo for Vishaka</div>
          <div className="font-mono text-[18px] font-medium text-[var(--coral)] mt-2">Aug 2026</div>
          <div className="text-[13px] text-[var(--text3)]">Cohere launch</div>
        </div>
      </div>

      <div className="mx-5 mt-4 flex gap-1 border-b border-[var(--border)] overflow-x-auto">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-2 text-[13px] border-b-2 transition-all -mb-px whitespace-nowrap
              ${activeTab === t.id ? 'text-[var(--accent)] border-[var(--accent)] font-medium' : 'text-[var(--text3)] border-transparent hover:text-[var(--text2)]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">

        {activeTab === 'insights' && (
          <div>
            <AIStrip>
              <strong className="text-[var(--accent)] font-medium">{insights.length} insights synced from 45 Granola sessions.</strong>{' '}
              Accommodation profile system ships first-to-market (Mar 25). Publish gate added. Apr 17 demo is the hard target.
            </AIStrip>
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              <MetricCard label="Insights" value={insights.length} delta="+5 from Mar 25" deltaVariant="up" />
              <MetricCard label="Critical gaps" value={product.criticalGaps} delta="Accessibility, multi-campus" deltaVariant="down" />
              <MetricCard label="AI opportunities" value="4" delta="Blueprint, PANCE, remediation, migration" deltaVariant="up" />
              <MetricCard label="Days to Apr 17" value="23" delta="Demo deadline" deltaVariant="down" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardTitle sub={`${insights.length} sourced findings`}>Insight feed</CardTitle>
                {insights.map(i => <InsightRow key={i.id} insight={i} />)}
              </Card>
              <div className="flex flex-col gap-3">
                <Card>
                  <CardTitle>Persona design readiness</CardTitle>
                  <ProgressBar label="Student (test-taker)" sublabel="V1.1 live at student URL" value={85} color="#2ec4a0" />
                  <ProgressBar label="Faculty / question author" sublabel="University UI v1.1 live" value={72} color="#8b7ff5" />
                  <ProgressBar label="Admin / accessibility config" sublabel="Accommodation profiles built" value={65} color="#f5a623" />
                  <ProgressBar label="Program Director" sublabel="Dashboard scoped — PA" value={20} color="#e8604a" />
                </Card>
                <Card>
                  <CardTitle>Feature delivery status</CardTitle>
                  <ProgressBar label="Student exam (9 types, a11y toolbar)" value={90} color="#2ec4a0" valueLabel="90%" />
                  <ProgressBar label="Accommodation profiles system" value={100} color="#4caf7d" valueLabel="Done" />
                  <ProgressBar label="Publish gate checklist" value={100} color="#4caf7d" valueLabel="Done" />
                  <ProgressBar label="Question bank browser" value={80} color="#8b7ff5" valueLabel="80%" />
                  <ProgressBar label="Question editor + a11y panel" value={70} color="#f5a623" valueLabel="70%" />
                  <ProgressBar label="AI features (May target)" value={5} color="#5c5a57" />
                </Card>
                <Card>
                  <CardTitle>Milestone timeline</CardTitle>
                  {EXAM_TIMELINE.map((t, i) => <TimelineItemRow key={i} item={t} />)}
                </Card>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blueprint' && (
          <div className="space-y-4">
            <Card className="overflow-x-auto">
              <CardTitle sub="Admin creates → QB → Assessment Builder → configure accessibility → publish → student exam → analytics">End-to-end lifecycle — admin to student</CardTitle>
              <div style={{ minWidth: 750 }}>
                <BPRow lane="" cells={['Create Q', 'Tag + Version', 'Review', 'Build Exam', 'A11y Config', 'Publish', 'Student Exam', 'Analytics']} />
                <BPRow lane="User actions" cells={['Write stem + options', "Assign Bloom's, topic", 'Peer review, approve', 'Add to sections, set marks', 'Set accommodations', 'Pass publish gate', 'Take exam w/ a11y toolbar', 'Faculty reviews item stats']} />
                <BPRow lane="Frontstage UI" cells={['Rich text + image upload', 'Tag panel + AI overlay', 'Review sidebar + diff', 'Assessment Builder tabs', 'Accessibility tab + audit', 'Publish gate modal', 'Exam UI + a11y toolbar', 'Item heatmap, p-value']} />
                <BPRow lane="Backstage" cells={['Version UUID, audit log', 'AI taxonomy on save', 'Notification + audit', 'Marks auto-compute', 'Profile assigned to student', 'WCAG check published', 'Lockdown, encrypted', 'p-value, PBis computed']} />
                <BPRow lane="Policies" cells={['FERPA: no student ID', 'CAPTE requires LO map', 'Min 1 peer reviewer', 'Blueprint verified', 'ADA 508 + WCAG 2.1 AA', 'CRITICAL items resolved', 'Lockdown enforced', 'De-identified export']} />
                <BPRow lane="Pain points" isGap cells={['Manual alt text', 'Tagging burden', 'No async threading', 'Multi-campus sync', '—', 'Publish gate is new', 'OSK + TTS built in', 'No cohort vs national']} />
              </div>
            </Card>
            <Card>
              <CardTitle sub="Every admin control must have a corresponding student-side experience">Admin to Student accessibility connection</CardTitle>
              <div className="grid grid-cols-[140px_1fr_1fr_80px_60px] gap-2 text-[9px] font-semibold uppercase tracking-wider text-[var(--text3)] border-b border-[var(--border)] pb-2 mb-1">
                <div>Feature</div><div>Admin control</div><div>Student experience</div><div>WCAG</div><div>Priority</div>
              </div>
              <AR feature="Text magnification" adm="Toggle per exam, default zoom, per-student override" stu="Toolbar slider 100-400%, persists session" wcag="1.4.4" p="critical" />
              <AR feature="Text-to-speech" adm="Enable/disable, reading speed, voice type" stu="Toolbar toggle, reads stem + options" wcag="1.1.1" p="high" />
              <AR feature="Speech-to-text" adm="Enable for open-ended Qs only, auto-off for MCQ" stu="Mic in text inputs, live transcript preview" wcag="N/A" p="high" />
              <AR feature="High contrast modes" adm="Student chooses or force specific mode" stu="3-mode cycle in toolbar, persists session" wcag="1.4.3" p="high" />
              <AR feature="On-screen keyboard" adm="Enable globally for exam" stu="Float above exam, draggable" wcag="2.1.1" p="high" />
              <AR feature="Extended time" adm="Per-student multiplier 1x/1.5x/2x, bulk apply profiles" stu="Timer shows personal end time, 10-min warning" wcag="N/A" p="critical" />
              <AR feature="Calculator" adm="Per-question toggle + global type (none/basic/scientific)" stu="Button in toolbar, active only on permitted Qs" wcag="N/A" p="high" />
              <AR feature="Alt text on images" adm="Required field on upload — blocks save" stu="Screen reader reads, TTS announces, tooltip" wcag="1.1.1" p="critical" />
              <AR feature="Captions / transcript" adm="Required .vtt upload, AI generation option" stu="CC button, transcript panel collapses/expands" wcag="1.2.2" p="critical" />
              <AR feature="Accommodation profiles" adm="Named program-level profiles, bulk apply, CSV import" stu="Silently apply on exam launch" wcag="N/A" p="new" />
              <AR feature="Focus mode" adm="Enable/disable per exam" stu="Removes chrome, question + answer only" wcag="N/A" p="new" />
              <AR feature="Dyslexia font" adm="Allow override per exam, per-student flag" stu="Font selector in toolbar, persists" wcag="N/A" p="new" />
              <AR feature="Publish gate" adm="Blocks publish until all CRITICAL items resolved" stu="Students never see a broken accessible exam" wcag="All" p="new" />
            </Card>
          </div>
        )}

        {activeTab === 'features' && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <Card>
                <CardTitle>Question creation</CardTitle>
                <div className="flex flex-col gap-2">
                  <FB title="Rich text editor" desc="Stem, options, image upload (alt text required), media embed, table. Rationale shown post-submit on low-stakes exams." v="accent" />
                  <FB title="9 question types" desc="MCQ, Multi-select, Fill-in-blank, Match, Hotspot, Audio, Video, Case Study, Passage. 32 layout variants built." v="accent" />
                  <FB title="Version control" desc="Every edit creates new immutable version. Exams pin to version at creation. Dept Head endorses per-department version." v="accent" />
                  <FB title="Accessibility panel (NEW)" desc="Alt text (required, blocks save), TTS hint text, calculator toggle per question, accessibility score 4-circle indicator." v="pink" />
                </div>
              </Card>
              <Card>
                <CardTitle>Tagging system</CardTitle>
                <div className="flex flex-col gap-2">
                  <FB title="5 predefined categories" desc="Topic (3-4 level tree), Bloom's (6 levels), Difficulty (compound with Year/Level), USMLE/Competency, Custom tags" v="teal" />
                  <FB title="AI tag assist" desc="Bloom's auto-suggest on save. Tag consistency checker. Import from ExamSoft auto-tags 10,000+ questions. AI shadow tags." v="teal" />
                  <FB title="Scoped Views — flat pool" desc="Not siloed by course. Tier 1: pinned/recent/courses sidebar. Tier 2: Browse All Views slide-out panel. Auto-created per course." v="teal" />
                </div>
              </Card>
              <Card>
                <CardTitle>Lifecycle + review</CardTitle>
                <div className="flex flex-col gap-2">
                  <FB title="6 lifecycle states" desc="Draft > In Review > Ready > Active (used in exam) > Retired. Overlay flags: Update Available, Locked during exam window." v="amber" />
                  <FB title="RTI-style approval" desc="Head faculty assigns sections to contributors. Contributors create questions. Head approves at question level. ExamSoft does this entirely offline." v="amber" />
                  <FB title="Performance analytics" desc="Correct %, Discrimination index, KR-20, Usage count, Cross-course breakdown. Inline row expansion in QB browser." v="amber" />
                </div>
              </Card>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardTitle>Assessment assembly</CardTitle>
                <div className="flex flex-col gap-2">
                  <FB title="Section-based structure" desc="Multi-section exam. Section-level marks + distribution (equal/manual/difficulty-based). Auto-computes total marks." v="blue" />
                  <FB title="AI blueprint assembly" desc="Phase 2: AI selects questions satisfying all NCCPA blueprint cells. Touro direct quote: 'a lifesaver'. Target: Cohere Aug." v="blue" />
                  <FB title="Lifecycle stepper" desc="Draft > Building > Review > Published > Scheduled > Live. All 6 nodes clickable. Submit for Review gates the transition." v="blue" />
                </div>
              </Card>
              <Card>
                <CardTitle>Accessibility settings (NEW)</CardTitle>
                <div className="flex flex-col gap-2">
                  <FB title="Global exam toggles" desc="TTS, STT, OSK, Focus Mode, Calculator type, Zoom default, Display mode. All configurable per exam from Accessibility tab." v="green" />
                  <FB title="Accommodation profiles" desc="Named program-level profiles. Preset + custom. Bulk apply to N students. D2L's 70-operation workflow reduced to 1. First-to-market." v="green" />
                  <FB title="Publish gate checklist" desc="Blocks publish until: all images have alt text, all media has captions, accommodation-flagged students have profiles." v="green" />
                </div>
              </Card>
              <Card>
                <CardTitle>Analytics layer</CardTitle>
                <div className="flex flex-col gap-2">
                  <FB title="Item performance" desc="p-value per question per course offering. Point biserial. Discrimination index. Negative PBis = auto-flag." v="coral" />
                  <FB title="PANCE predictor" desc="Ed Razenbach's Excel model automated: 8 variables, R2 0.66-0.84. PACRAT + EOR z-scores + GPA + remediations. Identifies at-risk students months early." v="coral" />
                  <FB title="Accommodation analytics" desc="Performance comparison: standard vs extended-time cohort. Per-accommodation breakdown. Privacy: N>=5 students per group." v="coral" />
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              <MetricCard label="Bank size" value="1,847" delta="+140 this semester" deltaVariant="up" />
              <MetricCard label="Avg score" value="74%" delta="+3 vs last cohort" deltaVariant="up" />
              <MetricCard label="Item flag rate" value="12%" delta="High -- review needed" deltaVariant="down" />
              <MetricCard label="PANCE readiness" value="73%" delta="Of cohort >= 75 score" deltaVariant="up" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Card>
                <CardTitle sub="Why: reveals if cohort clusters at risk zone">Score distribution -- PT Cohort 2025</CardTitle>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={scoreDistData} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="range" tick={CS} />
                      <YAxis tick={CS} />
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
                      <XAxis dataKey="name" tick={CS} />
                      <YAxis domain={[60, 90]} tick={CS} />
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
                <CardTitle sub="Why: validates higher-order questions are harder">p-value by Bloom's level</CardTitle>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer>
                    <BarChart data={bloomData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis type="number" domain={[0, 1]} tick={CS} />
                      <YAxis dataKey="level" type="category" tick={CS} width={70} />
                      <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                      <Bar dataKey="pval" fill="rgba(139,127,245,0.6)" radius={3} name="Avg p-value" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
              <Card>
                <CardTitle sub="Why: replaces Touro's Monster Grid -- triple-digit Excel columns">NCCPA blueprint coverage</CardTitle>
                <div style={{ height: 200 }}>
                  <ResponsiveContainer>
                    <RadarChart data={nccpaData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="subject" tick={{ ...CS, fontSize: 9 }} />
                      <Radar name="Student" dataKey="A" stroke="#8b7ff5" fill="rgba(139,127,245,0.15)" strokeWidth={2} />
                      <Radar name="Blueprint" dataKey="B" stroke="rgba(46,196,160,0.5)" fill="transparent" strokeDasharray="4 3" strokeWidth={1.5} />
                      <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            <Card>
              <CardTitle sub="Why: tracks approved vs total -- governance health signal">Question bank growth</CardTitle>
              <div style={{ height: 180 }}>
                <ResponsiveContainer>
                  <AreaChart data={bankGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={CS} />
                    <YAxis tick={CS} />
                    <Tooltip contentStyle={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 10 }} />
                    <Legend wrapperStyle={{ fontSize: 10, color: '#5c5a57' }} />
                    <Area type="monotone" dataKey="total" stroke="#2ec4a0" fill="rgba(46,196,160,0.1)" name="Total questions" strokeWidth={2} />
                    <Area type="monotone" dataKey="approved" stroke="#8b7ff5" fill="rgba(139,127,245,0.08)" name="Approved" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="space-y-4">
            <AIStrip>
              <strong className="text-[var(--accent)] font-medium">First-to-market (Mar 25):</strong>{' '}
              Program-level accommodation profile system. No competitor has bulk profile assignment.
              D2L gap: 70 manual operations. Exxat solution: 1 operation. Publish gate blocks deploy until WCAG requirements met.
            </AIStrip>
            <div className="grid grid-cols-4 gap-2.5">
              <MetricCard label="A11y features mapped" value="15" delta="All admin to student" deltaVariant="up" />
              <MetricCard label="WCAG criteria met" value="8" delta="Of 12 required for AA" deltaVariant="up" />
              <MetricCard label="Competitors with built-in" value="0" delta="All rely on OS tools" deltaVariant="down" />
              <MetricCard label="D2L ops gap closed" value="70 to 1" delta="Accommodation profiles" deltaVariant="up" />
            </div>
            <Card>
              <CardTitle sub="SKILL.md Section 13.7 -- every admin control maps to a student experience. Source: accessibility session Mar 16">Accessibility feature map</CardTitle>
              <div className="grid grid-cols-[140px_1fr_1fr_80px_60px] gap-2 text-[9px] font-semibold uppercase tracking-wider text-[var(--text3)] border-b border-[var(--border)] pb-2 mb-1">
                <div>Feature</div><div>Admin control</div><div>Student experience</div><div>WCAG</div><div>Priority</div>
              </div>
              <AR feature="Text magnification" adm="Toggle per exam, default zoom level, per-student override" stu="Toolbar slider 100-400%, persists per session" wcag="1.4.4" p="critical" />
              <AR feature="Text-to-speech (TTS)" adm="Enable/disable, reading speed, voice type" stu="Toolbar toggle, reads stem + options, visual indicator" wcag="1.1.1" p="high" />
              <AR feature="Speech-to-text (STT)" adm="Enable for open-ended Qs only. Auto-disabled for MCQ/MSQ." stu="Mic button in text inputs, live transcript preview" wcag="N/A" p="high" />
              <AR feature="High contrast modes" adm="Student chooses (default) / Force light / Force high contrast" stu="3-mode cycle in toolbar (light/dark/high contrast), persists" wcag="1.4.3" p="high" />
              <AR feature="On-screen keyboard" adm="Enable globally for exam (motor impairment)" stu="Float above exam, draggable, full character set" wcag="2.1.1" p="high" />
              <AR feature="Extended time" adm="Per-student multiplier (1.0x/1.5x/2.0x/custom). Bulk apply." stu="Timer shows personal end time. 10-min warning." wcag="N/A" p="critical" />
              <AR feature="Calculator" adm="Per-question toggle + global type (none/basic/scientific)." stu="Button in toolbar, active only on permitted Qs." wcag="N/A" p="high" />
              <AR feature="Alt text on images" adm="Required field on image upload. Blocks question save." stu="Screen reader announces alt text. TTS reads it." wcag="1.1.1" p="critical" />
              <AR feature="Captions for media" adm="Required .vtt or .srt upload. AI generation option." stu="CC button on media player. Transcript panel." wcag="1.2.2" p="critical" />
              <AR feature="Cross-out answer" adm="Always enabled for MCQ/MSQ. Cannot disable." stu="Right-click or long-press strikes through option." wcag="N/A" p="high" />
              <AR feature="Accommodation profiles" adm="Named program-level profiles. Bulk assign. CSV import." stu="Silently apply on exam launch -- no student action." wcag="N/A" p="new" />
              <AR feature="Focus mode" adm="Enable/disable per exam. ADHD/cognitive support." stu="Removes decorative chrome. Question + answer only." wcag="N/A" p="new" />
              <AR feature="Dyslexia font" adm="Allow override per exam, per-student accommodation flag." stu="Font selector in toolbar (OpenDyslexic). Persists." wcag="N/A" p="new" />
              <AR feature="Line reader" adm="Enable/disable per exam. Reading pace support." stu="Horizontal guide bar follows cursor through passage." wcag="N/A" p="new" />
              <AR feature="Image magnifier" adm="Always on for hotspot/image questions. Cannot disable." stu="Click-to-zoom, pinch gesture, magnifier lens for EKG." wcag="1.4.4" p="critical" />
            </Card>
            <Card>
              <CardTitle sub="SKILL.md Section 13.12 -- full interaction spec for the Accessibility tab in Assessment Builder">Accessibility tab -- interaction spec</CardTitle>
              <div className="space-y-3">
                {[
                  { title: 'Global exam toggles', desc: 'TTS, STT, OSK, Focus Mode, Calculator (radio group), Zoom (always-on + default level dropdown), Display mode (radio). Each toggle card: click anywhere on card toggles -- not just the switch. role="switch", aria-checked, label + description always visible.' },
                  { title: 'Accommodation profiles', desc: 'Program-level library (not per-exam). Preset profiles: Visual standard (TTS + high contrast + 1.5x + 150% zoom), Extended time 2x, Motor support (OSK + STT + 1.5x + basic calculator), Dyslexia support (OpenDyslexic + line reader + TTS + 1.25x zoom + 1.5x time). Custom builder: all toggles + time multiplier.' },
                  { title: 'Student accommodation table', desc: 'Columns: Name / Email / Profile (badge or orange warning) / Time multiplier / Actions. Rows without profiles: orange tint. Apply profile = orange CTA. Bulk apply: checkbox select then Apply then modal then summary then confirm then 10-second undo. Import: CSV with student ID + accommodation type.' },
                  { title: 'Accessibility audit rings', desc: '4 audit cards with progress rings: Images with alt text (X/Y count, Fix N CTA), Media with captions, Students with profiles, WCAG compliance (in review). Fix CTA navigates to Structure tab filtered to questions with accessibility warnings. Publish blocked until all CRITICAL rings are green.' },
                  { title: 'Preview as accommodation', desc: 'Preview as accommodation button opens modal: pick specific student or pick profile. Opens student exam view in new tab with full accommodation stack applied. Confidence-builder for faculty before April 17 demo. No competitor has this feature.' },
                ].map(item => (
                  <div key={item.title} className="p-3 rounded-lg bg-[var(--bg3)] border border-[var(--border)]">
                    <div className="text-[13px] font-semibold text-[var(--text)] mb-1">{item.title}</div>
                    <div className="text-[13px] text-[var(--text3)] leading-[1.5]">{item.desc}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'competitive' && (
          <div className="space-y-4">
            <AIStrip>
              <strong className="text-[var(--accent)] font-medium">ExamSoft retention anchors (Granola Mar 20, Dr. Vicky Mody):</strong>{' '}
              1) Curriculum mapping already established. 2) Faculty training built over years. 3) Strong item analytics.
              These are the exact 3 things Exxat must match or exceed. Accommodation profiles + publish gate are first-to-market.
            </AIStrip>
            <Card className="overflow-x-auto">
              <CardTitle sub="Yes = Exxat wins or matches, orange = partial, No = gap. Source: SKILL.md Section 13.8">Feature parity matrix -- 12 features across 5 platforms</CardTitle>
              <div style={{ minWidth: 750 }}>
                <div className="grid grid-cols-[130px_1fr_1fr_1fr_1fr_1fr] gap-1 text-[9px] font-semibold uppercase tracking-wider text-[var(--text3)] border-b border-[var(--border)] pb-2 mb-1">
                  <div>Feature</div><div>ExamSoft</div><div>Blackboard Ultra</div><div>Canvas</div><div>D2L</div><div className="text-[#2ec4a0]">Exxat target</div>
                </div>
                <CR feature="Extended time per student" es="Yes" bb="Per-attempt only" cv="Yes" d2l="Manual, no bulk" ex="Bulk + profile template" />
                <CR feature="Bulk accommodation assign" es="No" bb="No" cv="Group sections" d2l="No -- 70 ops gap" ex="Bulk -- 1 operation" />
                <CR feature="TTS / narrator" es="Third-party only" bb="Browser built-in" cv="Browser built-in" d2l="Browser built-in" ex="Built-in, lockdown-safe" />
                <CR feature="STT / dictation" es="No" bb="Browser API" cv="No" d2l="No" ex="Built-in, open-ended only" />
                <CR feature="In-app zoom 100-400pct" es="Blocked -- OS zoom" bb="Blocked -- browser" cv="Blocked -- browser" d2l="Blocked -- browser" ex="Built-in, lockdown-safe" />
                <CR feature="On-screen keyboard" es="No" bb="No" cv="No" d2l="No" ex="Built-in, draggable" />
                <CR feature="Alt text enforcement" es="Optional field" bb="Warning on publish" cv="Required" d2l="Optional" ex="Required, blocks publish" />
                <CR feature="Image magnifier (medical)" es="Yes" bb="Basic zoom" cv="No" d2l="No" ex="Magnifier lens + pinch" />
                <CR feature="High contrast mode" es="No" bb="Yes" cv="Basic" d2l="Yes" ex="3 modes + system-detect" />
                <CR feature="Formula questions" es="Yes" bb="Yes -- best" cv="Yes" d2l="Yes" ex="Phase 2 -- not Aug 2026" />
                <CR feature="Calculator per question" es="Yes" bb="Global only" cv="Global only" d2l="Global only" ex="Per-Q granularity" />
                <CR feature="WCAG 2.1 AA (ACR)" es="Partial -- no ACR" bb="Yes" cv="Yes" d2l="Yes" ex="Required for UNF pilot" />
              </div>
            </Card>
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardTitle sub="Source: Dr. Vicky Mody Mar 20">ExamSoft retention anchors</CardTitle>
                <InsightRow insight={{ id: '', text: '1. Curriculum mapping already done -- 8 cohorts of questions. Rebuilding takes a year.', tags: ['gap'], source: 'Dr. Vicky Mody Mar 20', productIds: [], createdAt: '' }} />
                <InsightRow insight={{ id: '', text: '2. Faculty training built over years. Retraining would take a year.', tags: ['gap'], source: 'Dr. Vicky Mody Mar 20', productIds: [], createdAt: '' }} />
                <InsightRow insight={{ id: '', text: '3. Strong item analytics: difficulty, discrimination index, KR-20, 5 criteria per question.', tags: ['gap'], source: 'Dr. Vicky Mody Mar 20', productIds: [], createdAt: '' }} />
              </Card>
              <Card>
                <CardTitle sub="Source: D2L demo Mar 4 + PRISM strategy Mar 3">Where Exxat already wins</CardTitle>
                <InsightRow insight={{ id: '', text: 'Flat pool + Scoped Views: no folder silos, cross-dept sharing without duplication.', tags: ['opportunity'], source: 'Platform strategy Mar 4', productIds: [], createdAt: '' }} />
                <InsightRow insight={{ id: '', text: 'Prism integration: student/course/faculty data already exists. No rebuild needed.', tags: ['opportunity'], source: 'PRISM strategy Mar 3', productIds: [], createdAt: '' }} />
                <InsightRow insight={{ id: '', text: 'Accommodation profile system: program-level bulk assignment. D2L critical gap closed.', tags: ['opportunity'], source: 'Exam Management build Mar 25', productIds: [], createdAt: '' }} />
                <InsightRow insight={{ id: '', text: 'AI-first architecture: retrofitting AI into ExamSoft 20-year codebase is impossible.', tags: ['opportunity'], source: 'PRISM Day 1 Mar 2', productIds: [], createdAt: '' }} />
              </Card>
              <Card>
                <CardTitle sub="Source: SKILL.md Section 13.9">UX patterns to follow</CardTitle>
                <InsightRow insight={{ id: '', text: 'Progressive disclosure: hide accommodation complexity from faculty who do not need it.', tags: ['theme'], source: 'SKILL.md 13.9', productIds: [], createdAt: '' }} />
                <InsightRow insight={{ id: '', text: 'Publish gate checklist (Blackboard Ultra pattern): blocks publish until WCAG met.', tags: ['architecture'], source: 'SKILL.md 13.9', productIds: [], createdAt: '' }} />
                <InsightRow insight={{ id: '', text: 'Preview as accommodation: admin sees exactly what student with that profile experiences.', tags: ['opportunity'], source: 'SKILL.md 13.9', productIds: [], createdAt: '' }} />
                <InsightRow insight={{ id: '', text: 'Live monitoring with accommodation badges: extend time in real-time without leaving screen.', tags: ['opportunity'], source: 'SKILL.md 13.9', productIds: [], createdAt: '' }} />
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'decisions' && (
          <div className="grid grid-cols-2 gap-3">
            <DC title="Decision 1: Flat tagging over folder hierarchy"
              d="Moved away from ExamSoft rigid folder structure. Adopted flat tagging with Scoped Views. Only 1 of 5 top tools still uses folders."
              r="ExamSoft folder structure fails cross-course knowledge mapping and breaks multi-campus sharing. ~20 tags per question enables cross-campus analytics. Canvas and Blackboard already moved to flat lists."
              t="Folders feel familiar to faculty. Risk: cognitive overhead deters casual users. Mitigation: AI handles tagging on save. Scoped Views recreate the folder UX on top of flat architecture."
              src="Platform strategy Mar 4, Q-Bank architecture Mar 12" />
            <DC title="Decision 2: Platform-embedded accessibility (no 3rd-party)"
              d="All accessibility features must be built into the exam platform. No external tools allowed."
              r="LockDown browser blocks all external tools. This is not a design preference -- it is the only compliant path. Pearson Education model (GRE, SAT, TOEFL) proves it is achievable. Confirmed UNF pilot blocker."
              t="Building custom OSK, zoom, TTS is significantly more expensive. Phased delivery (V0 to V1) manages cost. V0 ships minimum viable for UNF pilot compliance."
              src="Accessibility session Mar 16, Nipun roadmap Mar 11" />
            <DC title="Decision 3: Accommodation profile as program-level object"
              d="Accommodation profiles are created once at program level and applied to N students across N exams. Not per-exam configuration."
              r="D2L per-exam setup requires 70 manual operations for 7 students x 10 quizzes. Program-level profile reduces this to 1 operation. First-to-market competitive differentiator."
              t="More complex data model: profiles must be versioned carefully. Mitigation: profiles are additive -- changing a profile does not auto-update existing exam assignments, only new ones."
              src="D2L BrightSpace demo Mar 4, Exam Management build Mar 25" />
            <DC title="Decision 4: Publish gate accessibility checklist"
              d="Exam cannot be published until all critical accessibility items pass: images have alt text, media has captions, accommodation-flagged students have profiles."
              r="Error discovery shifts from after 200 students submit to before publish. Reduces ADA compliance risk at program level. Mirrors Blackboard Ultra proven publish gate pattern."
              t="May frustrate faculty who want to publish quickly. Mitigation: only CRITICAL items block; warnings surface but do not block. Each item links directly to the resource needing fixing."
              src="Exam Management build Mar 25, SKILL.md 13.9" />
            <DC title="Decision 5: React front-end, AI-first architecture"
              d="React front-end confirmed for entire app (admin + student). AI-first: every screen must consider AI integration upfront. Cannot retrofit AI later."
              r="Retrofitting AI into existing functionality is architectural debt. This is Exxat primary competitive moat vs ExamSoft (which cannot AI-first its 20-year-old codebase)."
              t="AI features blocked in Phase 1 due to adoption concerns. Risk of over-promising timeline. Mitigation: Phase 1 is AI-architecture-ready but AI-features-off until May sprint."
              src="PRISM Day 2 Mar 3, Exam stand-up Mar 19" />
            <DC title="Decision 6: Assessment creation as primary workflow"
              d="Assessment creation must be the primary workflow, not Q-bank management. Current wireframe was too database-heavy."
              r="Faculty primary job is building and delivering exams, not curating a database. 3 entry points to questions: bank direct, within course, during exam assembly."
              t="Power users (program-level) want to manage the bank as a primary workflow. Progressive disclosure solves this: assessment creation as default, bank management in advanced view."
              src="Q-Bank multi-campus Mar 12, Platform strategy Mar 4" />
          </div>
        )}
      </div>
    </div>
  );
}
