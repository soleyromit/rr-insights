// @ts-nocheck
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
type TabId = 'insights' | 'blueprint' | 'userflows' | 'features' | 'analytics' | 'accessibility' | 'competitive' | 'decisions' | 'gaps' | 'stories' | 'pa-dashboard' | 'scalable-viz' | 'story-view' | 'arun-roadmap' | 'question-bank' | 'analogy';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights', label: 'Insights' },
  { id: 'question-bank', label: 'Question Bank' },
  { id: 'blueprint', label: 'Service Blueprint' },
  { id: 'userflows', label: 'User Flows' },
  { id: 'features', label: 'Feature Map' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'competitive', label: 'Competitive' },
  { id: 'decisions', label: 'Design Decisions' },
  { id: 'gaps', label: 'Granola Gaps' },
  { id: 'stories', label: 'UX Stories' },
  { id: 'pa-dashboard', label: 'PA Dashboard' },
  { id: 'scalable-viz', label: 'Scalable Analytics' },
  { id: 'story-view', label: 'Story View' },
  { id: 'arun-roadmap', label: 'Arun 3-Year' },
  { id: 'analogy', label: 'Feature Analogies' },
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


        {/* USER FLOWS TAB */}
        {activeTab === 'userflows' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="ai-strip">
              3-lane system flow confirmed across 10 Granola sessions + migration pack. Admin/Faculty lane → Question Bank layer → Student lane → Analytics feedback loop. April 17 requires all 3 persona prototypes.
            </div>

            {/* 3-Lane System Flow */}
            <Card>
              <CardTitle sub="Confirmed from migration pack system architecture document">3-lane lifecycle — how the system flows</CardTitle>
              <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
                <div style={{ minWidth: 720, display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {/* Lane headers */}
                  {[
                    { label: 'Admin / Faculty', color: '#6d5ed4', bg: 'rgba(109,94,212,0.06)' },
                    { label: 'Question Bank', color: '#0d9488', bg: 'rgba(13,148,136,0.06)' },
                    { label: 'Student', color: '#8a8580', bg: 'rgba(138,133,128,0.06)' },
                  ].map((lane, li) => {
                    const laneFlows = [
                      [
                        { label: 'Create question', sub: 'Or import from file/QB', color: '#6d5ed4' },
                        { label: 'Tag + version', sub: "Bloom's, topic, difficulty", color: '#6d5ed4' },
                        { label: 'Submit for review', sub: 'Draft → In Review', color: '#d97706' },
                        { label: 'Approve', sub: 'Status → Ready', color: '#0d9488' },
                      ],
                      [
                        { label: 'Question Bank pool', sub: 'Flat, institution-wide, scoped views', color: '#0d9488' },
                        { label: 'Assessment Builder', sub: 'Sections, marks, blueprint', color: '#0d9488' },
                        { label: 'Configure + publish', sub: 'Schedule, proctoring, accommodations', color: '#0d9488' },
                        { label: '', sub: '', color: 'transparent' },
                      ],
                      [
                        { label: 'Exam available', sub: 'Lockdown browser', color: '#8a8580' },
                        { label: 'Answer questions', sub: 'All question types', color: '#8a8580' },
                        { label: 'Submit + flag', sub: 'Progress, navigator', color: '#8a8580' },
                        { label: 'Graded result', sub: 'Auto-scored, LMS sync', color: '#0d9488' },
                      ],
                    ][li];
                    return (
                      <div key={lane.label} style={{ display: 'flex', background: lane.bg, borderBottom: '1px solid var(--border)', alignItems: 'stretch', minHeight: 80 }}>
                        <div style={{ width: 110, minWidth: 110, padding: '12px 10px', display: 'flex', alignItems: 'center', borderRight: '1px solid var(--border)' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: lane.color }}>{lane.label}</span>
                        </div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '10px 16px', gap: 8 }}>
                          {laneFlows.map((step, si) => step.label ? (
                            <div key={si} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ padding: '8px 12px', background: 'white', border: `1.5px solid ${step.color}30`, borderRadius: 8, minWidth: 120 }}>
                                <div style={{ fontSize: 12, fontWeight: 600, color: step.color, marginBottom: 2 }}>{step.label}</div>
                                <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.3 }}>{step.sub}</div>
                              </div>
                              {si < laneFlows.length - 1 && laneFlows[si+1].label && (
                                <span style={{ color: 'var(--text3)', fontSize: 16 }}>→</span>
                              )}
                            </div>
                          ) : null)}
                        </div>
                      </div>
                    );
                  })}
                  {/* Analytics feedback */}
                  <div style={{ padding: '10px 16px', background: 'rgba(109,94,212,0.04)', borderTop: '1px dashed var(--border2)' }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>↻ Analytics feedback loop: psychometrics flag poor questions, update difficulty, inform next exam — this is the competitive moat against ExamSoft</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Question Lifecycle Flow */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Card>
                <CardTitle sub="5 states, auto-computed by system — faculty rarely set manually">Question lifecycle states</CardTitle>
                {[
                  { state: 'Draft', desc: 'Incomplete. Author-only. Cannot be used in any exam.', color: '#8a8580', dot: '#cdc8bf' },
                  { state: 'In Review', desc: 'Submitted for QA. Reviewer approves, rejects, or comments.', color: '#d97706', dot: '#d97706' },
                  { state: 'Ready', desc: 'All fields complete. Dept-visible. Available for assessments.', color: '#0d9488', dot: '#0d9488' },
                  { state: 'Active', desc: 'Used in ≥1 delivered exam. System prevents deletion.', color: '#3b82f6', dot: '#3b82f6' },
                  { state: 'Retired', desc: 'Pulled from use. Exists for historical exams only.', color: '#8a8580', dot: '#8a8580' },
                ].map((s, i) => (
                  <div key={s.state} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.dot, flexShrink: 0 }} />
                      {i < 4 && <div style={{ width: 1, height: 24, background: 'var(--border)', marginTop: 4 }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: s.color, marginBottom: 2 }}>{s.state}</div>
                      <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </Card>

              <Card>
                <CardTitle sub="6 roles, each with fundamentally different needs and content">Role-based access — what each persona sees</CardTitle>
                {[
                  { role: 'Dept Head / PD', access: 'Full control', desc: 'Approve questions, endorse versions, cross-dept sharing, lock exam window', color: '#e8604a', initial: 'DH' },
                  { role: 'Faculty / Course Dir.', access: 'Scoped edit', desc: 'Create questions, build assessments, submit for review', color: '#6d5ed4', initial: 'F' },
                  { role: 'Institution Admin', access: 'Read-only all', desc: 'Full audit view, configure tag schemas, accreditation mapping', color: '#3b82f6', initial: 'IA' },
                  { role: 'Contributor', access: 'Composable', desc: 'Creates questions for specific assessment — head faculty reviews', color: '#0d9488', initial: 'C' },
                  { role: 'Initiative Lead', access: 'Read QB', desc: 'Cross-dept program-level assessments, assign sections', color: '#d97706', initial: 'IL' },
                  { role: 'Reviewer', access: 'Review scope', desc: 'Assigned by Dept Head — approves/rejects before Ready status', color: '#8a8580', initial: 'R' },
                ].map((r) => (
                  <div key={r.role} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid var(--border)' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${r.color}20`, border: `1.5px solid ${r.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: r.color }}>{r.initial}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.role}</span>
                        <span className="badge badge-theme" style={{ fontSize: 10 }}>{r.access}</span>
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--text3)' }}>{r.desc}</span>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Assessment Builder Flow */}
            <Card>
              <CardTitle sub="The primary workflow for Faculty / Course Director — all screen states">Assessment Builder — user flow (Faculty role)</CardTitle>
              <div style={{ display: 'flex', gap: 0, overflowX: 'auto' }}>
                {[
                  { step: '01', screen: 'Dashboard', action: 'Action inbox', detail: '3 pending review · 2 exams · 1 draft', color: '#6d5ed4' },
                  { step: '02', screen: 'New Assessment', action: 'Setup metadata', detail: 'Name, type, weightage · Duration · Schedule window', color: '#6d5ed4' },
                  { step: '03', screen: 'Structure tab', action: 'Add sections', detail: 'Section A, B, C · Marks per section · Distribution method', color: '#3b82f6' },
                  { step: '04', screen: 'Question Bank', action: 'Browse + add', detail: "Scoped views sidebar · Filter by Bloom's · Add to section", color: '#3b82f6' },
                  { step: '05', screen: 'Accessibility tab', action: 'Configure', detail: 'TTS, STT, zoom · Accommodation profiles · Publish gate check', color: '#d97706' },
                  { step: '06', screen: 'Submit for Review', action: 'HOD approval', detail: 'Draft → In Review · Reviewer notified · Comments inline', color: '#d97706' },
                  { step: '07', screen: 'Published', action: 'Live exam', detail: 'Students notified · Lockdown browser · Admin monitors', color: '#0d9488' },
                ].map((step, i) => (
                  <div key={step.step} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                    <div style={{ padding: '14px 16px', background: `${step.color}08`, border: `1.5px solid ${step.color}25`, borderRadius: 10, minWidth: 130, flexShrink: 0 }}>
                      <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: step.color, fontWeight: 700, marginBottom: 6 }}>STEP {step.step}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{step.screen}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 6 }}>{step.action}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', lineHeight: 1.5, whiteSpace: 'pre-line' }}>{step.detail}</div>
                    </div>
                    {i < 6 && <div style={{ color: 'var(--text3)', fontSize: 18, padding: '0 6px', flexShrink: 0 }}>→</div>}
                  </div>
                ))}
              </div>
            </Card>

            {/* Question types grid */}
            <Card>
              <CardTitle sub="All 9 question types admin can add — what students will experience">Question types — admin creates, student sees</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { type: 'MCQ + MSQ', detail: "Single select / multiple select. Cross-out feature (David's request) — strike through options without removing selectability. Keyboard: A/B/C/D. Used in: PA pharmacology, didactic exams.", priority: 'P1', color: '#6d5ed4' },
                  { type: 'Fill-in-the-blank', detail: 'Inline blanks within text. Student types or uses speech-to-text. Supports multiple blanks per question. Used in: medical calculations, drug dosage.', priority: 'P1', color: '#6d5ed4' },
                  { type: 'Hotspot / Image', detail: 'Student clicks region on image (X-ray, anatomy diagram, EKG). Correctness = click within defined region. Used in: anatomy, radiology, cardiac rhythm.', priority: 'P1', color: '#6d5ed4' },
                  { type: 'Passage-based', detail: "Long-form passage with 1+ questions. Text highlighting (David's request) — students highlight key phrases. Speech-to-text for open responses. Used in: clinical reasoning, case studies.", priority: 'P1', color: '#3b82f6' },
                  { type: 'Match-the-following', detail: 'Student aligns items from one list to another. Supports per-pair scoring. Used in: drug-mechanism matching, anatomy labeling.', priority: 'P1', color: '#3b82f6' },
                  { type: 'Audio-based', detail: 'Audio clip plays (heart sounds, lung sounds, speech). Captions + transcript displayed. Student responds via MCQ or short answer. Used in: clinical auscultation.', priority: 'P2', color: '#d97706' },
                  { type: 'Video-based', detail: 'Video content with required captions. Transcript auto-generated in backend. Used in: surgical procedures, patient encounters, clinical skills.', priority: 'P2', color: '#d97706' },
                  { type: 'PDF / Case study', detail: 'Embedded multi-page PDF viewer. Faculty uploads case document. Students scroll in PDF pane while answering. Used in: complex clinical scenarios spanning multiple pages.', priority: 'P2', color: '#d97706' },
                  { type: 'Chart / Visual', detail: 'Chart or graph as stimulus. Alt text + description required (WCAG). Color cannot be sole indicator. Used in: lab values, vital signs trends, EKG strips.', priority: 'P2', color: '#8a8580' },
                ].map(qt => (
                  <div key={qt.type} style={{ padding: '12px 14px', background: `${qt.color}06`, border: `1px solid ${qt.color}20`, borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: qt.color }}>{qt.type}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: qt.priority === 'P1' ? '#0d9488' : '#d97706', fontFamily: 'JetBrains Mono, monospace' }}>{qt.priority}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55 }}>{qt.detail}</p>
                  </div>
                ))}
              </div>
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

        {/* ─── GRANOLA GAPS TAB ─── */}
        {activeTab === 'gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Verbatim cross-check: Vishaka (7dbabdb5), David (f29a990d), Ed (ca5a709c), Touro ExamSoft demo (f5d66e4c), Nipun standup (689bdc25). Every gap is grounded in a direct quote." />
            <Card>
              <CardTitle sub="Entirely absent from Magic Patterns — P0">Student exam-taking view (Epic 1)</CardTitle>
              {[
                { who: 'David + Romit (f29a990d)', gap: 'Full student exam view — navigator, flag 2×2, keyboard shortcuts, cross-out, submit logic, section screens, pre-exam tutorial', quote: '"Student wants to visually cross out answers... crossed-out options remain selectable"', p: 'P0' },
                { who: 'Kunal (f29a990d)', gap: 'Flag is a 2×2 attribute — answered/unanswered × flagged/not-flagged. Not a third bucket.', quote: '"Flag is an attribute of both buckets... it is a 2x2 matrix"', p: 'P0' },
                { who: 'Aarti + Kunal (f29a990d)', gap: 'Submit button always visible but faded. Prominent only at last question OR last 5-10 min. Never "Exit exam."', quote: '"Do not hide it. Keep it visible but faded until conditions are met"', p: 'P0' },
                { who: 'Aarti (f29a990d)', gap: 'Section entry screen: shows section title + question count before entering. Faculty configures lock (GRE model) or free nav.', quote: '"You enter a section... screen says section one, this is the topic..."', p: 'P0' },
                { who: 'Romit (f29a990d)', gap: 'Pre-exam tutorial: one sample question + audio check before timer starts.', quote: '"We can give a sample of one question... then you start the exam with the timer"', p: 'P2' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge variant={item.p === 'P0' ? 'error' : item.p === 'P1' ? 'warning' : 'info'}>{item.p}</Badge>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.who}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{item.gap}</div>
                  <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>{item.quote}</div>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="Vishaka's proposed differentiator vs Influx — P0">PA Student Dashboard (Epic 5)</CardTitle>
              {[
                { who: 'Vishaka (7dbabdb5)', gap: 'PA dashboard: PACRAT 1+2, EOR by all 7 specialties, OSCE, EOC, PANCE readiness predictor (75+ = good passing chance), cohort vs national.', quote: '"Even Influx is not doing this level of report... this would be our differentiator"', p: 'P0' },
                { who: 'Vishaka (7dbabdb5)', gap: 'Bulk CSV upload for PAEA + ExamSoft data. 5-minute manual step acceptable initially. Match by Student ID.', quote: '"Give them a way to import a lot of data from PAEA or ExamSoft in the form of bulk CSV upload"', p: 'P1' },
                { who: 'Vishaka (7dbabdb5)', gap: 'Cohort dashboard alongside individual view. Cohort vs cohort by year + national averages.', quote: '"We also want to create a dashboard at a cohort level"', p: 'P2' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge variant={item.p === 'P0' ? 'error' : item.p === 'P1' ? 'warning' : 'info'}>{item.p}</Badge>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.who}</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{item.gap}</div>
                  <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>{item.quote}</div>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="Ed Razenbach specifics — P1">Ed Razenbach gaps (ca5a709c)</CardTitle>
              {[
                { gap: 'Z-score display alongside raw scores. National mean + SD from PAEA per exam.', quote: "I use z scores rather than raw scores because a raw 412 in EM is not the same as a 382 in women's health", p: 'P1' },
                { gap: '"Assessments" label everywhere → "Exams". Both Ed and Touro coordinator said this independently.', quote: '"The word assessment kinda throws everything off. Write down Exams."', p: 'P0' },
                { gap: 'Remediation exam workflow post-EOR fail: specialty-specific, open book, untimed, sequestered questions.', quote: '"I have exams set aside just for remediation purposes"', p: 'P1' },
                { gap: 'OSCE rubric as question type 10. Critical task marking. Multi-rubric per encounter.', quote: '"100 scenarios across specialties. Done in ExamSoft with rubric functionality."', p: 'P1' },
                { gap: "Bloom's 1-3 only mode. PAEA uses 1-3; ExamSoft uses 1-5. Ed prefers 1-3.", quote: '"I like the Level 1-3 rather than 1-5"', p: 'P2' },
                { gap: 'Audit trail: who accessed questions, when, what was changed. Real-time.', quote: '"Who is in there, what was touched — a detailed audit analysis"', p: 'P2' },
                { gap: 'Multi-campus question sharing without print/email/re-upload.', quote: '"We literally had to print out the questions, send them over. It was a nightmare."', p: 'P2' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < 6 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge variant={item.p === 'P0' ? 'error' : item.p === 'P1' ? 'warning' : 'info'}>{item.p}</Badge>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 4 }}>{item.gap}</div>
                  <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text-muted)', borderLeft: '2px solid var(--border)', paddingLeft: 8 }}>{item.quote}</div>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="D2L BrightSpace demo (c7a8d32e) + Nipun UNF pilot (4c9b94f5) + Accessibility session (77fc2588)">Accessibility + D2L gaps</CardTitle>
              {[
                { src: 'D2L BrightSpace demo · Mar 4', gap: 'Bulk accommodation assignment: D2L requires 7 students × 10 quizzes = 70 manual setups. Program-level accommodation profile = 1 setup. First-to-market differentiator.', p: 'P0', built: false },
                { src: 'Nipun UNF pilot · Mar 11', gap: 'V0 accessibility for UNF Australia pilot (July): magnification, high contrast, extra time accommodations. ACR (Accessibility Compliance Report) validation required.', p: 'P0', built: true },
                { src: 'Accessibility session · Mar 16', gap: 'On-screen keyboard (OSK) must be platform-embedded. No external software allowed — LockDown browser blocks all external a11y tools. Pearson Education (GRE/SAT/TOEFL) is reference architecture.', p: 'P1', built: false },
                { src: 'Accessibility session · Mar 16', gap: 'Two-phase approach confirmed: Phase 1 = minimum changes for UNF pilot. Phase 2 = comprehensive revamp during student portal overhaul.', p: 'P0', built: false },
                { src: 'Nipun UNF pilot · Mar 11', gap: 'Question rationale/explanation feature: teacher-defined per question, shown after submission or full assessment. AI assistance for content creation. Low-stakes exam differentiator.', p: 'P2', built: false },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge variant={item.p === 'P0' ? 'error' : item.p === 'P1' ? 'warning' : 'info'}>{item.p}</Badge>
                    {item.built && <Badge variant="success">Built</Badge>}
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.src}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.gap}</div>
                </div>
              ))}
            </Card>
            <Card>
                            <CardTitle sub="Present in Magic Patterns and confirmed correct">What is built correctly</CardTitle>
              {['Cross-out feature (David) — strike options without removing selectability. Built.',
                'Text highlighting in passage questions (David). Built.',
                'Calculator per question (David). Built.',
                'Proxy submit for disconnected student (Vishaka standup). Built.',
                'Accessibility publish gate — alt text blocks publish, TTS/STT/zoom/OSK/focus mode. Built.',
                'Post-exam: 5 curving options from ExamSoft demos. Built.',
                'Live monitoring with per-student progress, time remaining, accommodation multiplier. Built.',
                'Role switcher: Dept Head, Faculty, Contributor, Reviewer, Outcome Director, Inst Admin. Built.',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: '8px 0', borderBottom: i < 7 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ color: '#10B981', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item}</span>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ─── UX STORIES TAB ─── */}
        {activeTab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="17 user stories across 9 epics. All grounded in verbatim quotes from Vishaka, David, Ed, Aarti, Kunal, Nipun. Each story maps to a specific Magic Patterns component." />
            {[
              { epic: 'Epic 1 — Student exam-taking view (P0)', stories: [
                { id: 'US-01', title: 'Pre-exam setup + technical check', who: 'Student', what: 'Complete a technical check and one sample question before timer starts', why: 'Need to understand controls before time pressure begins', src: 'Romit (f29a990d)', mp: 'PreExamScreen.tsx' },
                { id: 'US-02', title: 'Keyboard navigation + one question at a time', who: 'Student', what: 'Move between questions using keyboard shortcuts (→/Enter/←/F/A-D)', why: 'Work at speed without hunting UI elements', src: 'f29a990d — keyboard shortcut list', mp: 'StudentExamApp.tsx' },
                { id: 'US-03', title: 'Flag navigator as 2×2 attribute', who: 'Student', what: 'Flagged questions surfaced at top of navigator, not as a third bucket', why: 'Flag is an attribute of answered AND unanswered — Kunal explicit', src: 'Kunal (f29a990d)', mp: 'QuestionNavigator.tsx' },
                { id: 'US-04', title: 'Cross-out answer options', who: 'Student', what: 'Visually strike answer options without removing selectability', why: 'Clinical reasoning requires elimination strategy while preserving choices', src: 'David (f29a990d)', mp: 'QuestionCard.tsx' },
                { id: 'US-05', title: 'Text highlighting in passages', who: 'Student', what: 'Highlight key phrases in passage text, persists across navigation', why: 'Medical clinical problem solving uses evidence marking', src: 'David (f29a990d)', mp: 'QuestionRenderers.tsx' },
                { id: 'US-06', title: 'Section entry screen', who: 'Student', what: 'See section title + question count before entering each section', why: 'Informed pacing decisions + faculty-configured lock behavior', src: 'Aarti (f29a990d)', mp: 'SectionEntryScreen.tsx' },
              ]},
              { epic: 'Epic 2 — Label rename (P0)', stories: [
                { id: 'US-07', title: '"Assessments" → "Exams" everywhere', who: 'Faculty / Admin', what: 'All nav items, breadcrumbs, buttons say "Exams" not "Assessments"', why: 'PAEA and clinical education use "Exams" — confirmed by Ed and Touro coordinator independently', src: 'Ed (ca5a709c) + Touro coordinator (f5d66e4c)', mp: 'Sidebar.tsx, PhaseShell.tsx, BuildPhase.tsx' },
              ]},
              { epic: 'Epic 3 — Z-score + Remediation (P1)', stories: [
                { id: 'US-08', title: 'Z-score display in EOR analytics', who: 'PA Program Director', what: 'See z-scores alongside raw EOR scores with national mean + SD', why: 'Raw scores across specialties are not comparable — normalization required', src: 'Ed (ca5a709c)', mp: 'PostExamPhase.tsx — EOR + Z-scores tab' },
                { id: 'US-09', title: 'Remediation exam assignment workflow', who: 'DCE / Faculty', what: 'Assign specialty-specific remediation exam to students below EOR threshold', why: '"I have exams set aside just for remediation purposes" — open book, untimed, sequestered', src: 'Ed (ca5a709c)', mp: 'PostExamPhase.tsx — remediation drawer' },
              ]},
              { epic: 'Epic 4 — OSCE Rubric (P1)', stories: [
                { id: 'US-10', title: 'OSCE Rubric as 10th question type', who: 'PA Faculty', what: 'Build OSCE rubrics with critical task marking, multi-rubric per encounter', why: 'ExamSoft rubric functionality is a retention anchor. 100 scenarios at Emory & Henry.', src: 'Ed (ca5a709c)', mp: 'QuestionEditor.tsx — OSCE Rubric type' },
              ]},
              { epic: 'Epic 5 — PA Dashboard + CSV import (P0/P1)', stories: [
                { id: 'US-11', title: 'PA Student Performance Dashboard', who: 'PA Program Director / DCE', what: 'Cohort + individual dashboard with PACRAT, EOR, OSCE, EOC, PANCE predictor', why: 'Influx does not do this level. Vishaka: "This would be our differentiator."', src: 'Vishaka (7dbabdb5)', mp: 'PADashboard.tsx' },
                { id: 'US-12', title: 'Bulk CSV import for PAEA + ExamSoft data', who: 'Admin / DCE', what: '5-step CSV import wizard: source → upload → map columns → preview → confirm', why: 'PAEA data cannot be auto-integrated yet. 5-minute manual step acceptable initially.', src: 'Vishaka (7dbabdb5)', mp: 'PADashboard.tsx — import view' },
              ]},
              { epic: "Epic 6 — Bloom's 1-3 restriction (P2)", stories: [
                { id: 'US-13', title: "Bloom's 1-3 only mode for PA programs", who: 'PA Faculty', what: "Program-level setting restricts Bloom's picker to levels 1-3", why: 'PAEA uses 1-3. Ed: "I like the Level 1-3 rather than 1-5"', src: 'Ed (ca5a709c)', mp: "QuestionEditor.tsx — Bloom's toggle" },
              ]},
              { epic: 'Epic 7 — Negative discrimination flagging (P2)', stories: [
                { id: 'US-14', title: 'Negative point biserial with clinical explanation', who: 'Faculty', what: 'Negative discrimination values flagged red with explanation: "weak students outperformed strong"', why: 'Touro coordinator: "A negative sometimes means students who knew less got it right"', src: 'f5d66e4c (Touro ExamSoft demo)', mp: 'PostExamPhase.tsx — item analytics table' },
              ]},
              { epic: 'Epic 8 — Multi-campus sharing (P2)', stories: [
                { id: 'US-15', title: 'Cross-campus question sharing', who: 'Faculty', what: 'Share questions to another campus without manual export/import/re-upload', why: '"We literally had to print out the questions, send them over. It was a nightmare."', src: 'Touro coordinator (f5d66e4c)', mp: 'QuestionBankBrowser.tsx — Share action' },
              ]},
              { epic: 'Epic 9 — Audit trail (P2)', stories: [
                { id: 'US-16', title: 'Question bank audit trail', who: 'Dept Head / Inst Admin', what: 'Full log of who accessed questions, when, what action. Exam-window accesses flagged.', why: '"Who is in there, what was touched — a detailed audit analysis" — Ed + Dr. T (Touro)', src: 'Ed (ca5a709c) + Dr. T (f5d66e4c)', mp: 'AuditTrail.tsx' },
              ]},
            ].map((epic, ei) => (
              <Card key={ei}>
                <CardTitle sub={`${epic.stories.length} stor${epic.stories.length === 1 ? 'y' : 'ies'}`}>{epic.epic}</CardTitle>
                {epic.stories.map((s, si) => (
                  <div key={s.id} style={{ padding: '12px 0', borderBottom: si < epic.stories.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', background: 'var(--brand-soft)', padding: '2px 6px', borderRadius: 4 }}>{s.id}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{s.title}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      <strong>As a</strong> {s.who}, <strong>I need to</strong> {s.what}, <strong>so that</strong> {s.why}.
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-muted)' }}>
                      <span>Source: {s.src}</span>
                      <span>MP: {s.mp}</span>
                    </div>
                  </div>
                ))}
              </Card>
            ))}
          </div>
        )}

        {/* ─── PA DASHBOARD TAB ─── */}
        {activeTab === 'pa-dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Vishaka's proposed competitive differentiator vs Influx (7dbabdb5). PACRAT 1+2, EOR by 7 specialties, OSCE, EOC, PANCE readiness predictor. Built in Magic Patterns: PADashboard.tsx." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="PACRAT 1 avg z-score" value="+0.22" delta="Above national" deltaPositive />
              <MetricCard label="PACRAT 2 avg z-score" value="−0.18" delta="Within 1 SD" deltaPositive={false} />
              <MetricCard label="EOR avg z-score" value="−0.14" delta="Within 1 SD of mean" deltaPositive />
              <MetricCard label="PANCE predictor avg" value="74" delta="Threshold: 75" deltaPositive={false} />
            </div>
            <Card>
              <CardTitle sub="EOR scores normalized by national mean + SD (Ed Razenbach methodology)">EOR by specialty — z-score view</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { name: 'Emergency Medicine', raw: 412, nat: 404, sd: 28, z: 0.29 },
                  { name: 'Family / Internal Med.', raw: 378, nat: 392, sd: 24, z: -0.58 },
                  { name: 'Behavioral Health', raw: 391, nat: 385, sd: 22, z: 0.27 },
                  { name: 'Pediatrics', raw: 356, nat: 374, sd: 26, z: -0.69 },
                  { name: 'Surgery', raw: 401, nat: 398, sd: 30, z: 0.10 },
                  { name: "Women's Health", raw: 382, nat: 388, sd: 20, z: -0.30 },
                  { name: 'EOC (End of Curriculum)', raw: 387, nat: 392, sd: 25, z: -0.20 },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < 6 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ width: 180, fontSize: 13, color: 'var(--text-primary)', flexShrink: 0 }}>{row.name}</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'var(--surface-secondary)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(0, Math.min(100, 50 + row.z * 20))}%`, background: row.z >= 0 ? '#10B981' : row.z >= -1 ? '#F59E0B' : '#EF4444', borderRadius: 4 }} />
                      <div style={{ position: 'absolute', left: '50%', top: 0, width: 2, height: '100%', background: '#3B82F6', opacity: 0.6 }} />
                    </div>
                    <span style={{ width: 60, fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: row.z >= 0 ? '#10B981' : row.z >= -1 ? '#F59E0B' : '#EF4444', textAlign: 'right' }}>{row.z >= 0 ? '+' : ''}{row.z.toFixed(2)} z</span>
                    <span style={{ width: 50, fontSize: 11, color: 'var(--text-muted)', textAlign: 'right' }}>{row.raw} raw</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                Blue line = national mean. Green = above. Amber = within 1 SD. Red = below 1 SD. Formula: (student score − national mean) ÷ national SD. Source: Ed Razenbach, Feb 26.
              </div>
            </Card>
          </div>
        )}

      </div>

        {/* ─── SCALABLE ANALYTICS TAB ─────────────────────────────────────────── */}
        {/* D3.js-style scalable visualization. Default 100 students, scales to 1000+. */}
        {/* Source: David Stocker f59ac2a6, Ed Razenbach ca5a709c, SKILL.md Section 8 */}
        {activeTab === 'scalable-viz' && (() => {
          const cohortSize = 100;
          const scoreData = Array.from({ length: 25 }, (_, i) => {
            const range = 50 + i * 2;
            const nat = Math.round(8 * Math.exp(-0.5 * Math.pow((range - 77) / 9, 2)));
            const cohort = Math.round(8 * Math.exp(-0.5 * Math.pow((range - 74) / 8, 2)));
            return { range: `${range}`, nat, cohort };
          });
          const bloomPerf = [
            { level: 'Remember', pval: 0.82, target: 0.65, n: 12 },
            { level: 'Understand', pval: 0.74, target: 0.65, n: 10 },
            { level: 'Apply', pval: 0.61, target: 0.65, n: 14 },
            { level: 'Analyze', pval: 0.52, target: 0.65, n: 8 },
            { level: 'Evaluate', pval: 0.45, target: 0.65, n: 5 },
            { level: 'Create', pval: 0.38, target: 0.65, n: 3 },
          ];
          const watchListStudents = [
            { name: 'Marcus T.', cohort: 'PA2', gpa: 2.9, pancePredictor: 58, eorZ: -1.12, risk: 'High', flags: ['EOR-EM fail', 'PACRAT-1 ↓', 'GPA <2.67'] },
            { name: 'Sarah K.', cohort: 'PA3', gpa: 3.1, pancePredictor: 68, eorZ: -0.82, risk: 'High', flags: ['EOR-FM fail', '2 makeup exams'] },
            { name: 'Elena R.', cohort: 'PA2', gpa: 3.2, pancePredictor: 72, eorZ: -0.44, risk: 'Medium', flags: ['Conditional standing'] },
          ];
          const compMap = [
            { area: 'Pharmacology', class: 74, nat: 78, gap: -4 },
            { area: 'Cardiovascular', class: 81, nat: 77, gap: +4 },
            { area: 'Neurology', class: 58, nat: 72, gap: -14 },
            { area: 'GI / Hepatic', class: 66, nat: 70, gap: -4 },
            { area: 'Pulmonology', class: 79, nat: 74, gap: +5 },
          ];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <AIStrip text="All charts scale from 100 → 1000+ students. Story-first: every chart answers one decision question. Source: David Stocker f59ac2a6 (difficulty viz request), Ed Razenbach ca5a709c (KR-20 methodology), SKILL.md Section 8." />

              {/* Story metric — not a KPI card */}
              <div style={{ padding: 20, borderRadius: 12, background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.18)', borderLeft: '4px solid #dc2626' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                  Why: this class is showing the same pattern that caused 2 remediation cases last year
                </div>
                <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, fontFamily: 'DM Serif Display, Georgia, serif', fontStyle: 'italic' }}>
                  Your class of {cohortSize} students is 3 points below last semester on Neurology — the exact
                  competency gap that drove remediation in 2024–25. Three students are already at risk.
                  The question heatmap shows Q18 flagged by 44% of students. That is a design signal, not a knowledge signal.
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                {/* Score distribution histogram — scales to 1000+ via bin aggregation */}
                <Card>
                  <CardTitle sub="Why: is this cohort's distribution shifting left vs national mean?">Score distribution — {cohortSize} students</CardTitle>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 10 }}>
                    At 1000+ students, individual bars aggregate into percentile bands automatically.
                  </div>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={scoreData} margin={{ left: -20, right: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="range" tick={{ fontSize: 9, fill: 'var(--text3)' }} />
                      <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid var(--border)' }} />
                      <Bar dataKey="nat" fill="#94a3b8" name="National" radius={[2,2,0,0]} />
                      <Bar dataKey="cohort" fill="#6d5ed4" name="This class" radius={[2,2,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#6d5ed4' }} /><span style={{ fontSize: 10, color: 'var(--text3)' }}>This class (μ=74%)</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#94a3b8' }} /><span style={{ fontSize: 10, color: 'var(--text3)' }}>National mean (μ=77%)</span></div>
                  </div>
                </Card>

                {/* Competency map — David's exact request */}
                <Card>
                  <CardTitle sub="Why: Neurology gap is 14pts below national. Curriculum review needed.">Competency vs national — David Stocker's exact request (f59ac2a6)</CardTitle>
                  {compMap.map((c, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 12, color: 'var(--text)' }}>{c.area}</span>
                        <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: c.gap < -8 ? '#dc2626' : c.gap < 0 ? '#d97706' : '#16a34a' }}>
                          {c.gap > 0 ? '+' : ''}{c.gap}% vs nat.
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        <div style={{ flex: c.class, height: 6, background: c.gap < -8 ? '#dc2626' : c.gap < 0 ? '#d97706' : '#16a34a', borderRadius: '3px 0 0 3px' }} />
                        <div style={{ flex: 100 - c.class, height: 6, background: 'var(--bg3)', borderRadius: '0 3px 3px 0' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{c.class}% class</span>
                        <span style={{ fontSize: 10, color: 'var(--text3)' }}>{c.nat}% national</span>
                      </div>
                    </div>
                  ))}
                </Card>

                {/* Bloom's performance chart */}
                <Card>
                  <CardTitle sub="Why: Analyze-level questions have p-val 0.52. Below 0.65 threshold. Review before next exam.">Bloom's difficulty vs threshold — item analysis</CardTitle>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={bloomPerf} layout="vertical" margin={{ left: 60, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis type="number" domain={[0, 1]} tick={{ fontSize: 9, fill: 'var(--text3)' }} tickFormatter={v => v.toFixed(1)} />
                      <YAxis type="category" dataKey="level" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                      <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} formatter={(v: number) => [v.toFixed(2), 'p-value']} />
                      <Bar dataKey="pval" radius={[0,4,4,0]}
                        label={{ position: 'right', fontSize: 9, fill: 'var(--text3)', formatter: (v: number) => v.toFixed(2) }}>
                        {bloomPerf.map((b, i) => (
                          <rect key={i} fill={b.pval < 0.65 ? '#e8604a' : '#0d9488'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 6 }}>
                    Red = p-value below 0.65 threshold (too hard for current cohort). Review question quality, not curriculum.
                  </div>
                </Card>

                {/* Watch-list — the story, not a table */}
                <Card style={{ borderLeft: '4px solid #dc2626' }}>
                  <CardTitle sub="Why: These 3 students need intervention now — not after PANCE.">At-risk watch-list — auto-flagged by threshold (Touro model)</CardTitle>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5, fontStyle: 'italic', fontFamily: 'DM Serif Display, Georgia, serif' }}>
                    Mary (Touro): "Wouldn't it be nice if you saw a highlight on a student because they weren't meeting criteria?"
                  </div>
                  {watchListStudents.map((s, i) => (
                    <div key={i} style={{ padding: '10px 0', borderBottom: i < watchListStudents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.risk === 'High' ? 'rgba(220,38,38,0.12)' : 'rgba(217,119,6,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: s.risk === 'High' ? '#dc2626' : '#d97706', flexShrink: 0 }}>
                          {s.name.slice(0, 2)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 8, background: s.risk === 'High' ? 'rgba(220,38,38,0.1)' : 'rgba(217,119,6,0.1)', color: s.risk === 'High' ? '#dc2626' : '#d97706' }}>{s.risk} risk</span>
                          </div>
                          <div style={{ display: 'flex', gap: 4, marginTop: 3, flexWrap: 'wrap' }}>
                            {s.flags.map((f, fi) => (
                              <span key={fi} style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: 'var(--bg3)', color: 'var(--text3)' }}>{f}</span>
                            ))}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: s.pancePredictor < 70 ? '#dc2626' : '#d97706' }}>{s.pancePredictor}</div>
                          <div style={{ fontSize: 9, color: 'var(--text3)' }}>PANCE predictor</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text3)', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                    Threshold criteria: GPA &lt;2.67, 2+ EOR failures, 2+ makeup exams, conditional academic standing.
                    Auto-flagged — no manual input required.
                  </div>
                </Card>
              </div>

              {/* Scalability note */}
              <div style={{ padding: '12px 16px', borderRadius: 10, background: 'rgba(109,94,212,0.05)', border: '1px solid rgba(109,94,212,0.15)', fontSize: 12, color: 'var(--text2)' }}>
                <span style={{ fontWeight: 700, color: '#6d5ed4' }}>Scalability protocol (SKILL.md Section 8.2):</span>{' '}
                At 1000+ students, score distribution becomes aggregated histogram (not individual bars),
                watch-list table virtualizes (react-window renders only visible rows),
                competency map shows percentile bands instead of class averages,
                and item analysis switches to scatter plot with quadrant coloring.
                All data is already structured to support both scales.
              </div>
            </div>
          );
        })()}

        {/* ─── STORY VIEW TAB ──────────────────────────────────────────────────── */}
        {/* Claude design principles applied to rr-insights content. */}
        {/* Every situation has a story. No KPI cards without narrative context. */}
        {activeTab === 'story-view' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 780, margin: '0 auto' }}>

            {/* The story principle banner */}
            <div style={{ padding: 20, borderRadius: 12, background: 'rgba(109,94,212,0.05)', border: '1px solid rgba(109,94,212,0.2)', borderLeft: '4px solid #6d5ed4' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#6d5ed4', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                Claude design principle: story over metrics
              </div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
                Every dashboard in rr-insights tells a story, not just displays metrics.
                The admin does not want KPI cards. They want to know <em>what is happening</em>,
                <em> why it matters</em>, and <em>what to do next</em>. The metrics serve the story.
              </p>
            </div>

            {/* Story 1: The exam before the exam */}
            <div style={{ padding: 20, borderRadius: 12, background: '#fff', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Story 1 — three days before the exam</div>
              <h3 style={{ fontSize: 18, color: 'var(--text)', margin: '0 0 8px', fontFamily: 'DM Serif Display, Georgia, serif' }}>
                "Two questions are blocking 87 students from taking their exam in 3 days."
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, margin: '0 0 14px' }}>
                The CV Pharmacology Midterm publishes April 17. As of today, Q3 and Q32 are missing alt text —
                which means screen readers and TTS cannot interpret them for students with disabilities.
                ADA Title II goes into law April 24. This exam must be accessible before it is delivered.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, padding: '10px 12px', borderRadius: 9, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', marginBottom: 3 }}>Q3 — Hotspot</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>Receptor binding site diagram. No alt text. Blocks publish.</div>
                </div>
                <div style={{ flex: 1, padding: '10px 12px', borderRadius: 9, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#dc2626', marginBottom: 3 }}>Q32 — EKG strip</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>Cardiac rhythm image. No alt text. Blocks publish.</div>
                </div>
                <div style={{ padding: '10px 14px', borderRadius: 9, background: '#6d5ed4', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>Fix now →</span>
                </div>
              </div>
            </div>

            {/* Story 2: The week after the exam */}
            <div style={{ padding: 20, borderRadius: 12, background: '#fff', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Story 2 — post-exam</div>
              <h3 style={{ fontSize: 18, color: 'var(--text)', margin: '0 0 8px', fontFamily: 'DM Serif Display, Georgia, serif' }}>
                "74% average. But that number is hiding a Neurology problem that goes back 2 years."
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, margin: '0 0 14px' }}>
                The class passed. But Neurology questions had a class average 14 points below national mean.
                This is the same gap from the 2024 cohort. In that cohort, 2 students needed remediation.
                In this cohort, 3 students are already on the watch-list with declining PACRAT z-scores.
              </p>
              <div style={{ padding: '12px 14px', borderRadius: 9, background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)', marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--text)', fontFamily: 'DM Serif Display, Georgia, serif', lineHeight: 1.5 }}>
                  "I give it the PACRAT results by topic and it generates personalised questions for each student.
                  Two students failed family medicine but each got a completely different question set from me."
                </div>
                <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 5 }}>Ed Razenbach · DCE, Touro PA program · Feb 26, 2026</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626', fontFamily: 'JetBrains Mono, monospace' }}>−14%</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>Neurology vs national</div>
                </div>
                <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#dc2626', fontFamily: 'JetBrains Mono, monospace' }}>3</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>students watch-listed</div>
                </div>
                <div style={{ flex: 1, padding: '8px 12px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)', textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#d97706', fontFamily: 'JetBrains Mono, monospace' }}>Q18</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>flagged by 44% of class</div>
                </div>
              </div>
            </div>

            {/* Story 3: The faculty question */}
            <div style={{ padding: 20, borderRadius: 12, background: '#fff', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>Story 3 — question quality</div>
              <h3 style={{ fontSize: 18, color: 'var(--text)', margin: '0 0 8px', fontFamily: 'DM Serif Display, Georgia, serif' }}>
                "Q18 was flagged by almost half the class. That is a question problem, not a student problem."
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, margin: '0 0 14px' }}>
                High flag rates during an exam indicate ambiguous wording or an incorrect answer key —
                not a gap in student knowledge. Q18 has a point-biserial of −0.09:
                weaker students got it right more often than stronger students.
                This question needs to be retired or rewritten before the next exam.
              </p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>Point-biserial: −0.09</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>Negative = weaker students scored higher</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>44% flagged during exam</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>≥20% flag rate = design signal</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626' }}>Correct %: 44%</div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>Upper 27%: 38% vs Lower 27%: 51%</div>
                </div>
              </div>
            </div>

            {/* Design principle note */}
            <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', fontSize: 12, color: 'var(--text2)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text)' }}>Applied to Magic Patterns:</span>{' '}
              Every PostExamPhase, ExamDashboard, and PADashboard component in Magic Patterns should
              surface the narrative before the numbers. The KPI cards are present but serve the story.
              Pull quotes from stakeholders anchor the emotional weight. Severity is spatial, not just color.
            </div>
          </div>
        )}


        {/* ─── QUESTION BANK ARCHITECTURE — source: Stakeholder Day1+2 Feb 2026, Exam Standup Mar 26, Nipun kickoff Mar 27 ─── */}
        {activeTab === 'question-bank' && (() => {
          const roles = [
            { role: 'Institution Admin', scope: 'Institution', access: 'Read-only (all depts)', color: '#6d5ed4', useCase: 'Audit, compliance reporting, tag schema governance' },
            { role: 'Dept Head', scope: 'Department', access: 'Full (own dept)', color: '#0d9488', useCase: 'Quality assurance, endorsing versions, approving cross-dept sharing' },
            { role: 'Initiative Lead', scope: 'Initiative / Program', access: 'Read-only (initiative)', color: '#d97706', useCase: 'Cross-department competency gap analysis' },
            { role: 'Faculty', scope: 'Course(s)', access: 'Scoped (own + dept-shared)', color: '#3b82f6', useCase: 'Create, edit own questions, build assessments' },
          ];
          const statuses = [
            { status: 'Draft', desc: 'Authored, not yet reviewed. Only visible to creator and admins.', color: '#6b7280', next: 'In Review' },
            { status: 'In Review', desc: 'Submitted for approval. Blocked on Dept Head config: some depts skip review.', color: '#d97706', next: 'Golden' },
            { status: 'Golden', desc: 'Approved for live exams. Can be used in assessments.', color: '#16a34a', next: 'Archived' },
            { status: 'Archived', desc: 'Deprecated. Retained for historical data. Excluded from active pool.', color: '#6b7280', next: null },
            { status: 'Action Required', desc: 'Orange badge replaces status when colleague requests an edit or item performed poorly.', color: '#dc2626', next: 'Draft' },
          ];
          const tagCategories = [
            { cat: 'Question type', examples: 'MCQ, MSQ, fill-blank, matching, hotspot, formula, audio, video, PDF', system: true },
            { cat: "Bloom's level", examples: 'Remember, Understand, Apply, Analyze, Evaluate, Create', system: true },
            { cat: 'Difficulty', examples: 'Easy, Medium, Hard, Very Hard', system: true },
            { cat: 'Body system', examples: 'Cardio, Pulm, GI, Neuro, MSK, Derm, Psych (dept-configurable)', system: true },
            { cat: 'Competency', examples: 'NCCPA blueprint cells, ARC-PA domains, CAPTE outcomes (programme-specific)', system: false },
            { cat: 'Course', examples: 'Optional — no hard DB constraint. If assigned: auto-tagged.', system: false },
            { cat: 'Free-form', examples: 'Any additional tag. ~20 tags per question when fully used.', system: false },
          ];
          const entryMethods = [
            { method: 'Create new', who: 'Faculty', desc: 'Write directly in question editor. Starts as Draft.', ai: false },
            { method: 'Import from file', who: 'Admin / Faculty', desc: 'Bulk upload Word/Excel/QTI. System parses and creates Drafts.', ai: false },
            { method: 'Clone from existing', who: 'Faculty', desc: 'Save as variant — new question (new ID, new chain). Not a new version of original.', ai: false },
            { method: 'AI generation', who: 'Faculty', desc: 'Upload course content → AI generates MCQs/MSQs with tags pre-filled. Faculty reviews before saving to bank.', ai: true },
            { method: 'ExamSoft import', who: 'Admin', desc: 'AI-assisted migration from ExamSoft CSV export. Maps existing tags to Exxat tag schema.', ai: true },
          ];
          const smartViews = [
            { view: 'My Questions', filter: 'Author = current user', private: true },
            { view: '[Dept] Questions', filter: 'Department = user department', private: false },
            { view: 'Recently Used', filter: 'Last used in assessment within 90 days', private: true },
            { view: 'Flagged for Review', filter: 'Status = Action Required', private: false },
            { view: 'High-Yield [Topic]', filter: 'Tag includes topic + Difficulty ≥ Hard', private: false },
            { view: 'NCCPA Blueprint — [Cell]', filter: 'Competency tag = NCCPA cell ID', private: false },
          ];
          const competitors = [
            { tool: 'ExamSoft', model: 'Folder-based (like a file system)', problem: 'Questions trapped in course silos. Updates in one bank not reflected in another. Two versions diverge with no link.', exxat: 'Flat pool + smart views solves this' },
            { tool: 'Canvas LMS', model: 'Flat list + search/filter + tags', problem: 'Two separate question systems that do not talk to each other. Not built for medical-specific needs.', exxat: 'One pool, medical-specific tags, NCCPA blueprint cells' },
            { tool: 'Blackboard Ultra', model: 'Flat list + search + AI gen', problem: 'Dropped folders entirely — may be too unstructured for power faculty. No medical taxonomy built in.', exxat: 'Smart views give structure without rigid folders. AI gen in scope.' },
            { tool: 'D2L BrightSpace', model: 'Folder + shared LOR', problem: 'Bulk accommodation manually per student per quiz. No clinical education differentiation.', exxat: 'Program-level accommodation profiles — 1 action vs 70 per D2L' },
          ];
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Architecture summary */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(109,94,212,0.04)', border: '1px solid rgba(109,94,212,0.2)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6d5ed4', marginBottom: 8 }}>Architecture decision — flat pool + scoped views · Source: Stakeholder Day 1+2 · Feb 2026 + Exam Standup Mar 26</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>
                  Every question lives in a single institution-wide flat pool. There are no separate course banks or department banks. Faculty see questions through <strong style={{ color: 'var(--text)' }}>Smart Views</strong> — saved filter queries that look like folders. Tags and permissions determine which "folder" shows which questions. This solves the ExamSoft silo problem without forcing rigid hierarchy.
                </div>
              </div>

              {/* Pool model visual */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 10 }}>What Prof. Sharma sees</div>
                  {['My Questions (47)', 'Pharmacology Dept (312)', 'Cardiology Shared (28)', 'Recently Used (15)', 'Flagged for Review (6)'].map((v, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)', marginBottom: 4 }}>
                      <span style={{ fontSize: 13 }}>📁</span>
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{v}</span>
                      <span style={{ marginLeft: 'auto', fontSize: 9, color: '#6d5ed4', background: 'rgba(109,94,212,0.08)', padding: '2px 6px', borderRadius: 4 }}>Smart View</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 8, fontStyle: 'italic' }}>Smart folders = saved search filters applied to the flat pool</div>
                </div>
                <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 10 }}>What the system stores</div>
                  <div style={{ padding: '20px', borderRadius: 10, background: 'rgba(109,94,212,0.06)', border: '2px dashed rgba(109,94,212,0.3)', textAlign: 'center', marginBottom: 10 }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#6d5ed4' }}>1 pool</div>
                    <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>All 2,847 questions</div>
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>Tags + permissions determine visibility</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    {['Question ID (dept-prefixed)', 'Original Author (never changes)', 'Version chain', 'Tags (7 category types)', 'Status lifecycle', 'Department ownership'].map((f, i) => (
                      <div key={i} style={{ fontSize: 10, color: 'var(--text3)', padding: '4px 8px', borderRadius: 4, background: 'var(--bg)', border: '1px solid var(--border)' }}>{f}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Entry methods */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 12 }}>How questions enter the bank</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {entryMethods.map((m, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 14px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', alignItems: 'flex-start' }}>
                      <div style={{ width: 130, minWidth: 130 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{m.method}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{m.who}</div>
                      </div>
                      <div style={{ flex: 1, fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{m.desc}</div>
                      {m.ai && <span style={{ fontSize: 9, background: 'rgba(109,94,212,0.1)', color: '#6d5ed4', padding: '3px 8px', borderRadius: 4, fontWeight: 700, flexShrink: 0 }}>AI</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Question status lifecycle */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 12 }}>Question status lifecycle</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 14, flexWrap: 'wrap' }}>
                  {statuses.filter(s => s.status !== 'Action Required').map((s, i, arr) => (
                    <div key={s.status} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ padding: '4px 10px', borderRadius: 20, background: `${s.color}18`, border: `1px solid ${s.color}`, fontSize: 11, fontWeight: 600, color: s.color }}>{s.status}</div>
                      {i < arr.length - 1 && <span style={{ color: 'var(--text3)', fontSize: 12 }}>→</span>}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {statuses.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 12px', borderRadius: 6, background: 'var(--bg)', borderLeft: `3px solid ${s.color}` }}>
                      <div style={{ width: 120, minWidth: 120, fontSize: 11, fontWeight: 600, color: s.color }}>{s.status}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 12 }}>Roles and question bank access</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                  {roles.map((r, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', borderTop: `3px solid ${r.color}` }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.role}</div>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 3 }}>Scope: {r.scope}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 6 }}>{r.access}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4, lineHeight: 1.4 }}>{r.useCase}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8, background: 'rgba(109,94,212,0.04)', border: '1px solid rgba(109,94,212,0.15)' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6d5ed4', marginBottom: 4 }}>Review Access (composable permission)</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>Not a role — a permission layer granted on top of Faculty. Allows approve/reject + review comments within assigned scope. Granted by Dept Head. Scoped to specific course(s) or program. Dept Head has Review Access by default.</div>
                </div>
              </div>

              {/* Tag categories */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 12 }}>Tag schema — 7 category types, ~20 tags per question</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {tagCategories.map((t, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 12px', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)', alignItems: 'flex-start' }}>
                      <div style={{ width: 120, minWidth: 120 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{t.cat}</div>
                        <span style={{ fontSize: 9, background: t.system ? 'rgba(22,163,74,0.1)' : 'rgba(109,94,212,0.1)', color: t.system ? '#16a34a' : '#6d5ed4', padding: '1px 6px', borderRadius: 4 }}>{t.system ? 'System-built' : 'Custom'}</span>
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.5 }}>{t.examples}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Views */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 4 }}>Smart Views — two modes</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 12 }}>Always-updated (live filter) vs Fixed snapshot (pinned at creation). Personal Views private by default. Dept views shared.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 6 }}>
                  {smartViews.map((v, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 13 }}>📁</span>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>{v.view}</div>
                        <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 2 }}>{v.filter}</div>
                        {v.private && <span style={{ fontSize: 9, color: '#6b7280', background: 'rgba(107,114,128,0.1)', padding: '1px 5px', borderRadius: 3, marginTop: 3, display: 'inline-block' }}>private</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Versioning model */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 12 }}>Versioning model — every edit creates an immutable version</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
                  {[
                    { scenario: 'Faculty creates question', orig: 'Prof. Gupta', editor: '—', v: 'V1' },
                    { scenario: 'Same faculty edits', orig: 'Prof. Gupta', editor: 'Prof. Gupta', v: 'V2' },
                    { scenario: 'Dept Head edits', orig: 'Prof. Gupta', editor: 'Dr. Khan', v: 'V3' },
                    { scenario: 'Another faculty forks', orig: 'Prof. Sharma (new Q)', editor: '—', v: 'V1' },
                  ].map((r, i) => (
                    <div key={i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 6, lineHeight: 1.4 }}>{r.scenario}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>Orig: <strong style={{ color: 'var(--text)' }}>{r.orig}</strong></div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>Editor: {r.editor || '—'}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#6d5ed4', marginTop: 4 }}>{r.v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: 'var(--text3)' }}>Original Author never changes. Forks create a new question with a <code style={{ fontSize: 10, background: 'var(--bg)', padding: '1px 4px', borderRadius: 3 }}>derived_from</code> link. Each version stores: editor, timestamp, diff from previous.</div>
              </div>

              {/* Competitive comparison */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 12 }}>Competitor question bank models vs Exxat flat pool</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {competitors.map((c, i) => (
                    <div key={i} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 1fr 1fr', gap: 12, padding: '10px 12px', borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>{c.tool}</div>
                      <div style={{ fontSize: 11, color: 'var(--text3)' }}><span style={{ fontWeight: 600, color: 'var(--text2)' }}>Model:</span> {c.model}</div>
                      <div style={{ fontSize: 11, color: '#dc2626' }}><span style={{ fontWeight: 600 }}>Gap:</span> {c.problem}</div>
                      <div style={{ fontSize: 11, color: '#16a34a' }}><span style={{ fontWeight: 600 }}>Exxat:</span> {c.exxat}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Design implications */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.2)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#0d9488', marginBottom: 10 }}>Design implications from architecture — Magic Patterns build priorities</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {[
                    { priority: 'Screen 1 — QB navigation', detail: 'Two entry points: global QB sidebar item + course-level QB with auto-tag. Smart view sidebar with personal + dept views. Draft counter badge.', deadline: 'Apr 3' },
                    { priority: 'Screen 2 — QB table / filter', detail: 'Columns: ID, stem, type, status, Bloom\'s, difficulty, author. Filter bar: status, topic, Bloom\'s, course, type. Bulk action row for selection.', deadline: 'Apr 3' },
                    { priority: 'Screen 3 — Question editor', detail: 'Role-gated: Faculty sees create/submit. Dept Head sees approve/reject. Version chain visualization. Edit-in-assessment vs master modal split.', deadline: 'Apr 7' },
                  ].map((s, i) => (
                    <div key={i} style={{ padding: '12px 14px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', marginBottom: 6 }}>{s.priority}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 6 }}>{s.detail}</div>
                      <div style={{ fontSize: 10, mono: true, color: '#dc2626' }}>Target: {s.deadline}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* Arun 3-year plan — source: session 791334af Mar 24, 2026 */}
        {activeTab === 'arun-roadmap' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(109,94,212,0.04)', border: '1px solid rgba(109,94,212,0.2)', borderLeft: '4px solid #6d5ed4' }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6d5ed4', marginBottom: 8 }}>Arun Gautam - Mar 24, 2026 - session 791334af</div>
              <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.65, fontFamily: 'DM Serif Display, Georgia, serif', fontStyle: 'italic', marginBottom: 10 }}>
                ExamSoft is publicly against AI. We are going to use it. That is our second differentiator.
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {[
                { year: 'Year 1 - 2026', goal: 'Beat LMS quiz modules', color: '#2ec4a0', items: ['Canvas/D2L feature parity (no less)', 'Better UI than any LMS', 'One excellent AI use case', 'Lockdown browser (Respondus preferred)', 'Psychometrics at question and assessment level', 'Free for all Prism users'] },
                { year: 'Year 2 - 2027', goal: 'Equal or better than ExamSoft', color: '#6d5ed4', items: ['All ExamSoft features + more', 'Several AI use cases (ExamSoft is anti-AI)', 'Seamless Prism integration', 'Better UI than ExamSoft', 'Competitive or lower pricing', 'Charged product'] },
                { year: 'Year 3 - 2028', goal: 'Way beyond ExamSoft', color: '#e8604a', items: ['AI-powered proctoring', 'Adaptive exams (NCLEX CAT model)', 'Consider own lockdown browser', 'No reason for customers to use ExamSoft'] },
              ].map((v, i) => (
                <div key={i} style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', borderTop: '3px solid ' + v.color }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: v.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{v.year}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginTop: 3 }}>{v.goal}</div>
                  </div>
                  <div style={{ padding: '12px 16px' }}>
                    {v.items.map((item, j) => (
                      <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <span style={{ color: v.color, flexShrink: 0 }}>-</span>
                        <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '14px 18px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Design principles from Arun</div>
              {[
                { p: 'Speed over design system compliance', d: 'Design system is still a first draft. Freedom to build custom components. Mandate comes when convergence is visible.' },
                { p: 'AI everywhere on admin side', d: 'AI should reduce time faculty spends designing and conducting exams. Question generation, option generation, gap detection. Not for the exam taker.' },
                { p: 'Exam taker UI is its own design system', d: 'The student exam experience has no equivalent in current products. Whatever is built becomes the design system for this context.' },
                { p: 'Prism integration is differentiator 4', d: 'Seamless Prism integration is a key competitive advantage. Data should flow without re-entry.' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: '10px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6d5ed4', flexShrink: 0, width: 220 }}>{r.p}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.55 }}>{r.d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── FEATURE ANALOGY MAPPING — added Apr 3, 2026 ─────────────────────── */}
        {/* Maps every major Exam Management feature to well-known enterprise products */}
        {/* so the design team can study scalable UX patterns without reinventing them. */}
        {activeTab === 'analogy' && (() => {
          const features = [
            {
              id: 1,
              name: 'Question Bank / Repository',
              exxat: 'Shared vs individual question banks with department/course access controls, nested folders, tagging, versioning.',
              color: '#6d5ed4',
              analogies: [
                { product: 'Google Drive / Dropbox', pattern: 'Nested folder + file management — the mental model most faculty already have', type: 'structure' },
                { product: 'Notion databases', pattern: 'Tagging, filtering, multiple views of the same data — database thinking, not file thinking', type: 'data' },
                { product: 'GitHub repos', pattern: 'Versioning, ownership/permissions, PR = approval workflow — the gold standard for collaborative authoring with history', type: 'collab' },
                { product: 'Confluence', pattern: 'Collaborative knowledge base with spaces = departments — shared ownership at org level', type: 'collab' },
                { product: 'Gmail smart labels / Spotify playlists / Jira saved filters', pattern: 'Smart Views — dynamic collections built from filter criteria, not manual curation', type: 'views' },
              ],
              takeaway: 'Treat the question bank as a database, not a file system. Every question is a row with properties, not a document in a folder. Smart views are saved filter queries — not folders you drag things into.',
              scalability: 'Folder-only thinking breaks at 10,000+ questions. Tag-based filtering + saved views scale indefinitely. ExamSoft uses folders — that is why power users hit walls.',
            },
            {
              id: 2,
              name: 'Question as a Work Item',
              exxat: 'Each question has metadata, tags, status, owner, version history, metrics (point biserial, difficulty %). Review/approval workflow.',
              color: '#0d9488',
              analogies: [
                { product: 'Azure DevOps / VSTS work items', pattern: 'Status workflow, assignee, tags, comments, history, custom fields — the richest work-item model in enterprise software', type: 'workflow' },
                { product: 'Jira issues / Linear issues', pattern: 'Status transitions (Draft → In Review → Golden = Backlog → In Progress → Done), labels, priority, history log', type: 'workflow' },
                { product: 'Asana tasks', pattern: 'Assignee, due date, dependency — maps to question owner + review deadline + prerequisite competency', type: 'workflow' },
                { product: 'GitHub PR review', pattern: 'Parallel reviewers, inline comments, approve/request changes — exact model for question peer review', type: 'collab' },
                { product: 'SonarQube code quality / A/B test dashboards', pattern: 'Question metrics (p-value, point-biserial, distractor analysis) shown on the work-item detail pane', type: 'data' },
              ],
              takeaway: 'Questions are living entities with lifecycles, not static text blobs. Design the detail view like a work item — status pill, assignee avatar, version timeline, inline comments — not a blank form.',
              scalability: 'Work-item pattern means you can add any metadata field later (e.g., USMLE category, AI confidence score) without redesigning the core entity. Every field is just another property.',
            },
            {
              id: 3,
              name: 'Tagging System',
              exxat: 'Flat tagging with 5–7 predefined categories (question type, difficulty, Bloom\'s taxonomy, body parts), universal vs course-specific tags.',
              color: '#d97706',
              analogies: [
                { product: 'Shopify product tags + collections', pattern: 'Tags for flexible search, collections for curated sets — same dual-layer model Exxat needs', type: 'structure' },
                { product: 'WordPress taxonomies', pattern: 'Categories (hierarchical, controlled) vs tags (flat, freeform) — the distinction between school-defined mandatory tags and faculty personal tags', type: 'data' },
                { product: 'Figma component properties', pattern: 'Structured select/multi-select on each component — exactly how question properties should work: choose from a list, not type freeform', type: 'data' },
                { product: 'Stack Overflow tag system', pattern: 'Community-maintained, searchable, autocomplete, synonym groups — the right reference for tag governance at scale', type: 'governance' },
                { product: 'Notion select/multi-select', pattern: 'Property pane with colored chips — the interaction model faculty will recognize immediately for tagging', type: 'views' },
              ],
              takeaway: 'Use structured properties (select/multi-select with a controlled vocabulary) not freeform tags. This makes filtering, reporting, and AI enhancement possible. Freeform tags are a data quality problem waiting to happen.',
              scalability: 'Freeform tags create chaos at scale ("MCQ" vs "Multiple Choice" vs "mcq" all mean the same thing). Controlled vocabularies with an "Other + suggest" escape hatch plus an AI suggestion layer is the mature pattern.',
            },
            {
              id: 4,
              name: 'Exam / Assessment Builder',
              exxat: 'Blueprint-based creation, importing from question bank, collaboration, randomization, sections, mark distribution.',
              color: '#3b82f6',
              analogies: [
                { product: 'Notion page builder / block editors', pattern: 'Sections as blocks — add, reorder, collapse. The assembly metaphor, not the blank canvas metaphor.', type: 'structure' },
                { product: 'Webflow section builder', pattern: 'Drag sections into a layout — visual assembly with structured components', type: 'structure' },
                { product: 'Typeform flow builder', pattern: 'Flow-based question sequencing, branching logic — the interaction model for conditional question paths', type: 'workflow' },
                { product: 'Monday.com / Asana project templates', pattern: 'Blueprint = project template. Start from a blueprint, not a blank exam.', type: 'workflow' },
                { product: 'GitHub Actions pipeline config', pattern: 'Blueprint as declarative config — define the exam structure as a spec, not by manually placing questions', type: 'data' },
              ],
              takeaway: 'The builder is a structured assembly tool, not a blank canvas. Faculty configure a blueprint then let it assemble — they don\'t build from scratch every time. The UI should feel like "fill in the spec" not "build something."',
              scalability: 'Template/blueprint approach means new exam types (OSCE, practical, adaptive) don\'t require new UIs — just new blueprint configurations. The architecture scales to any assessment type.',
            },
            {
              id: 5,
              name: 'Exam Delivery / Student Experience',
              exxat: 'Lockdown browser, accessibility (zoom 100–400%, TTS, STT, keyboard nav), 32 question layout variations, 9 question types.',
              color: '#ec4899',
              analogies: [
                { product: 'Respondus LockDown Browser', pattern: 'Direct competitor — the security baseline Exxat must match. Study what faculty expect from lockdown before designing around it.', type: 'competitor' },
                { product: 'Duolingo assessment UX', pattern: 'Consumer-grade polish in an assessment context — single question focus, clear progress, celebration on completion', type: 'ux' },
                { product: 'Coursera / edX quiz interface', pattern: 'Long-form question + options layout familiar to students in higher education — the mental model they arrive with', type: 'ux' },
                { product: 'Microsoft Office accessibility checker / Apple VoiceOver', pattern: 'Accessibility as a built-in layer, not a third-party add-on — the Pearson model Exxat is targeting', type: 'a11y' },
                { product: 'Wolfram Alpha embedded / Google Sheets formula bar', pattern: 'Scientific calculator as an embedded tool, not an external window — must work within lockdown browser constraints', type: 'tool' },
              ],
              takeaway: 'The exam environment IS the product for students. It must be as polished as a consumer app (Duolingo, not Canvas) while meeting WCAG 2.1 AA. Every interaction — flagging, crossing out, zooming — must feel intentional.',
              scalability: 'Accommodation features designed as platform-level profiles (not per-exam config) scale to any assessment type. One profile, applied across every exam automatically.',
            },
            {
              id: 6,
              name: 'Grading & Review',
              exxat: 'Manual correction, rubric-based grading, parallel grading, anonymous grading, curve grading, bonus marks, question elimination.',
              color: '#16a34a',
              analogies: [
                { product: 'Turnitin', pattern: 'Inline annotation + score — the grader stays in context, does not switch between a submission view and a grade entry form', type: 'ux' },
                { product: 'Canvas SpeedGrader', pattern: 'Sequential grading workflow — next student, previous student, grade in one panel. The efficiency benchmark for manual grading.', type: 'workflow' },
                { product: 'Google Classroom rubrics', pattern: 'Rubric displayed alongside the submission — faculty clicks a cell, score is calculated automatically', type: 'workflow' },
                { product: 'GitHub code review', pattern: 'Parallel reviewers = parallel graders. Each reviewer sees the submission independently until scores are reconciled. Exact model for anonymous parallel grading.', type: 'collab' },
                { product: 'Greenhouse scorecard builder', pattern: 'Rubric as a reusable template applied across all candidates — maps to rubric templates applied across all students', type: 'governance' },
              ],
              takeaway: 'Grading is a review workflow, not a data entry screen. Study how code review tools handle parallel reviewers and conflict resolution. The faculty should not see a form — they should see the student\'s submission with grading overlaid.',
              scalability: 'Rubric as a reusable template (not per-assessment config) enables institution-wide grading consistency. One rubric update propagates to all future exams that reference it.',
            },
            {
              id: 7,
              name: 'Reporting & Analytics',
              exxat: 'Question-level, assessment-level, student-level, cohort-level reports, competency tracking.',
              color: '#6d5ed4',
              analogies: [
                { product: 'Mixpanel / Amplitude', pattern: 'Event-based product analytics with drill-down — slice by dimension, funnel from cohort to individual, retention curves. The interaction model for assessment analytics.', type: 'data' },
                { product: 'Tableau / Power BI', pattern: 'Interactive dashboard with filters, drill-down, cross-filter — not static tables or PDF exports', type: 'data' },
                { product: 'Datadog performance monitoring', pattern: 'Item analysis as performance monitoring — p-value and point-biserial are the latency and error-rate of question quality', type: 'data' },
                { product: 'Lattice / 15Five OKR tracking', pattern: 'Competency mapping = OKR alignment. Student competency → program goal → accreditation standard. Visualize the alignment across levels.', type: 'governance' },
                { product: 'LinkedIn Learning skill matrix', pattern: 'Competency × student grid with completion status — the heat map format for program-wide competency reporting', type: 'views' },
              ],
              takeaway: 'Reports should be interactive dashboards with drill-down, not static PDF exports. The Program Director\'s question is always "which students, which competencies, by when" — the UI must let them ask that question themselves.',
              scalability: 'Dimension-based analytics (slice by competency, cohort, time period, question tag) scale to any report request without building new report templates. The dimensions are the reports.',
            },
            {
              id: 8,
              name: 'AI Features',
              exxat: 'AI question generation from syllabus, conversational UI with version history, auto-assessment creation, AI-enhanced tagging, context-aware generation.',
              color: '#e8604a',
              analogies: [
                { product: 'GitHub Copilot', pattern: 'AI in context — suggests, faculty accepts or dismisses. The "suggest then confirm" model. AI never replaces, always proposes.', type: 'ai' },
                { product: 'Notion AI (generate from context)', pattern: 'AI understands the page/document context before generating — maps to AI reading the syllabus before generating questions', type: 'ai' },
                { product: 'Grammarly', pattern: 'AI enhancement layer on top of existing content — the model for AI-enhanced tagging and question improvement suggestions', type: 'ai' },
                { product: 'ChatGPT / Claude conversational UI', pattern: 'Conversational generation with version history — the interaction model for iterative AI question generation with faculty feedback', type: 'ai' },
                { product: 'Gmail auto-categorization / Google Photos auto-tagging', pattern: 'AI shadow tags that appear as suggestions, not mandatory fields — the pattern for AI-enhanced tagging that preserves faculty control', type: 'ai' },
              ],
              takeaway: 'AI as assistant, not replacement. Always show confidence levels and let faculty override. The Copilot "suggest then confirm" pattern is the gold standard. Never force an AI output — always propose it.',
              scalability: 'AI features designed as a layer (not hardcoded per feature) can be extended to any product surface — question gen today, assessment scaffolding tomorrow, remediation path generation next.',
            },
            {
              id: 9,
              name: 'Import / Migration',
              exxat: 'Importing questions from ExamSoft, bulk import from Word/Excel/QTI.',
              color: '#0d9488',
              analogies: [
                { product: 'Notion import from Confluence/Evernote', pattern: 'Step-by-step wizard: select source → map fields → preview → import. The migration is a product moment, not a support ticket.', type: 'workflow' },
                { product: 'Figma import from Sketch', pattern: 'Fidelity-first import — show exactly what did and did not translate. Faculty need to know what they\'re getting before committing.', type: 'workflow' },
                { product: 'Salesforce data import wizard', pattern: 'Map source fields → Exxat fields — visual field mapping UI that non-technical users can operate without a spreadsheet', type: 'workflow' },
                { product: 'GitHub repo migration', pattern: 'Full history preserved — version history, authorship, comments. A question imported from ExamSoft should carry its exam history with it.', type: 'data' },
              ],
              takeaway: 'Migration is a product feature, not an afterthought. The import wizard IS the onboarding experience for switching customers. It must be self-service and show a preview before any data is committed.',
              scalability: 'A generic import framework (map source fields → Exxat fields) handles ExamSoft today, any future competitor migration tomorrow. Build the mapper, not the ExamSoft-specific importer.',
            },
            {
              id: 10,
              name: 'Collaboration & Permissions',
              exxat: 'Owner approval for modifications, shared vs individual banks, department-level access controls.',
              color: '#d97706',
              analogies: [
                { product: 'Google Workspace sharing', pattern: 'Viewer / Commenter / Editor / Owner — visible inline ("Shared with 3 people"). Sharing status should be apparent without opening settings.', type: 'structure' },
                { product: 'Figma team permissions', pattern: 'Org → Team → Project → File — maps to Institution → Department → Course → Question. Permission inheritance at each level.', type: 'governance' },
                { product: 'GitHub org / team / repo permissions', pattern: 'Org-level role + team membership + repo-level override — the most nuanced permission model to study for edge cases', type: 'governance' },
                { product: 'Notion workspace permissions', pattern: 'Page-level sharing with visible member list — the UI pattern that makes permissions feel manageable, not bureaucratic', type: 'ux' },
                { product: 'Jira workflow transitions / GitHub branch protection', pattern: 'Approval workflow — only Dept Head can approve. Enforced in the UI, not just in policy.', type: 'workflow' },
              ],
              takeaway: 'Permission model must be visible in the UI — who can see this? who can edit? Study how Google Drive shows sharing status inline on every item. Hidden permissions create confusion and support tickets.',
              scalability: 'Role-based access designed at the platform level (not per-feature) prevents permission fragmentation. One permission model for questions, assessments, and grade reports — not three separate systems.',
            },
            {
              id: 11,
              name: 'LMS Integration',
              exxat: 'Canvas / LMS integration via LTI, grade sync.',
              color: '#3b82f6',
              analogies: [
                { product: 'Stripe API / Webhooks', pattern: 'API-first architecture — LTI is the auth handshake (like OAuth), webhooks push grade data back the moment an exam is submitted. No polling.', type: 'data' },
                { product: 'Slack app integrations', pattern: 'Grade sync should feel like a notification arriving — faculty does nothing extra, data just appears in Canvas', type: 'ux' },
                { product: 'Zapier / Make automation', pattern: 'Trigger → Action model for grade sync: exam submitted → grade appears in Canvas gradebook. Zero-touch for faculty after initial setup.', type: 'workflow' },
                { product: 'Salesforce AppExchange', pattern: 'Certified integration marketplace — LTI integration as a first-class certified connector, not a configuration form buried in settings', type: 'governance' },
                { product: 'Figma plugin ecosystem', pattern: 'Plugins that feel native — LTI launch should feel like Canvas is launching Exxat as a built-in tool, not opening a new window', type: 'ux' },
              ],
              takeaway: 'Integration should feel seamless — grades appear in the LMS without faculty doing anything extra after a one-time setup. The setup itself should be a certified, documented wizard, not a support ticket.',
              scalability: 'API-first + webhook architecture means any new LMS (D2L, Blackboard, Moodle) can be added by implementing the same webhook target. No redesign of the integration layer.',
            },
            {
              id: 12,
              name: 'Curriculum Mapping',
              exxat: 'Three-way matching: accreditation standards ↔ curriculum ↔ assessments. Blueprint cells linked to NCCPA, ARC-PA, CAPTE outcomes.',
              color: '#6d5ed4',
              analogies: [
                { product: 'Jira epic → story → subtask hierarchy', pattern: 'Standard → Program Outcome → Assessment → Question — the same parent-child hierarchy. Drill down, roll up.', type: 'structure' },
                { product: 'OKR alignment tools (Lattice, Gtmhub)', pattern: 'Company → Team → Individual OKR alignment — maps directly to Accreditation Standard → Program Goal → Student Assessment. Visualize coverage gaps.', type: 'governance' },
                { product: 'Dependency graph / network diagrams in PM tools', pattern: 'Curriculum map as a graph — competencies are nodes, assessments are edges. Missing edges = coverage gaps. ExamSoft shows this as a table; Exxat should show it as a graph.', type: 'data' },
                { product: 'Excel pivot tables (current state at every program)', pattern: 'The thing Exxat must replace — three-axis pivot of standard × course × question is the manual version of what Exxat automates', type: 'competitor' },
              ],
              takeaway: 'Curriculum mapping is a graph/relationship problem, not a table problem. Study how OKR tools visualize alignment across levels. The key insight: faculty need to see coverage gaps (unmapped standards) not just what is mapped.',
              scalability: 'Graph-based data model handles any depth of curriculum hierarchy (CAPTE → program outcome → course objective → assessment question) and any accreditation standard without a schema change.',
            },
          ];

          const typeColors: Record<string, string> = {
            structure: '#6d5ed4', data: '#0d9488', collab: '#3b82f6', workflow: '#d97706',
            views: '#ec4899', governance: '#16a34a', ux: '#e8604a', a11y: '#0d9488',
            tool: '#6b7280', competitor: '#dc2626', ai: '#6d5ed4',
          };
          const typeLabels: Record<string, string> = {
            structure: 'Structure', data: 'Data model', collab: 'Collaboration', workflow: 'Workflow',
            views: 'Views', governance: 'Governance', ux: 'UX pattern', a11y: 'Accessibility',
            tool: 'Tooling', competitor: 'Competitor', ai: 'AI pattern',
          };

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 960, margin: '0 auto' }}>
              {/* Header / framing */}
              <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(109,94,212,0.04)', border: '1px solid rgba(109,94,212,0.2)', borderLeft: '4px solid #6d5ed4' }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6d5ed4', marginBottom: 6 }}>Feature Analogy Mapping — Exam Management · Apr 3, 2026</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, margin: 0 }}>
                  Every major Exam Management feature maps to a well-known enterprise product that has already solved the UX at scale.
                  Use these analogies to study proven patterns before designing from scratch.
                  The design takeaway and scalability note for each feature are the actionable outputs — not the analogies themselves.
                </p>
              </div>

              {/* Feature cards */}
              {features.map(f => (
                <div key={f.id} style={{ borderRadius: 14, background: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
                  {/* Card header */}
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', borderTop: `3px solid ${f.color}`, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: f.color, background: `${f.color}15`, padding: '2px 7px', borderRadius: 6 }}>
                          {String(f.id).padStart(2, '0')}
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', fontFamily: 'DM Serif Display, Georgia, serif' }}>{f.name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{f.exxat}</div>
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text3)', flexShrink: 0 }}>{f.analogies.length} analogies</div>
                  </div>

                  {/* Analogies grid */}
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text3)', marginBottom: 10 }}>Product analogies — study these UX patterns</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {f.analogies.map((a, i) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 10px', borderRadius: 8, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                          <div style={{ flexShrink: 0, marginTop: 1 }}>
                            <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: `${typeColors[a.type] ?? '#6b7280'}15`, color: typeColors[a.type] ?? '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                              {typeLabels[a.type] ?? a.type}
                            </span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{a.product}</div>
                            <div style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{a.pattern}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Design takeaway + scalability note */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                    <div style={{ padding: '12px 20px', borderRight: '1px solid var(--border)', background: `${f.color}06` }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: f.color, marginBottom: 6 }}>Design takeaway</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{f.takeaway}</div>
                    </div>
                    <div style={{ padding: '12px 20px', background: 'rgba(109,94,212,0.03)' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#6d5ed4', marginBottom: 6 }}>Scalability note</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{f.scalability}</div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary reference panel */}
              <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Pattern type legend</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {Object.entries(typeLabels).map(([k, v]) => (
                    <span key={k} style={{ fontSize: 10, fontWeight: 600, padding: '3px 9px', borderRadius: 20, background: `${typeColors[k]}15`, color: typeColors[k] }}>{v}</span>
                  ))}
                </div>
                <div style={{ marginTop: 14, fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text2)' }}>How to use this view:</strong>{' '}
                  Before designing a new feature area, read the analogies for that feature and open 1–2 of the referenced products.
                  Study how they handle the specific pattern (not the product as a whole).
                  Then apply the design takeaway to the Exxat context.
                  The scalability note flags the architectural decision that determines whether the feature survives 10× usage.
                </div>
              </div>
            </div>
          );
        })()}

    </div>
  );
}
// This file is extended in place — new tabs added below via ExamManagementViewV2
// Protocol note: this file is kept in sync with Magic Patterns editor mnirdwczw9xbbzyuveee4g
// Every Magic Patterns change MUST be reflected here in the same session
// Last sync: 2026-03-26 — Epics 2-9 (label rename, z-score, remediation, OSCE, PA dashboard, CSV import, Bloom's 1-3, audit trail)

// ─── ARUN 3-YEAR ROADMAP TAB — appended Mar 26 ───────────────────────────────
// Source: Arun Romit Vision session 791334af Mar 24, 2026
// Arun verbatim: "ExamSoft is publicly against AI — we are going to use it."
// Year 1: beat LMS (free). Year 2: beat ExamSoft (paid). Year 3: beyond ExamSoft (AI proctoring).
