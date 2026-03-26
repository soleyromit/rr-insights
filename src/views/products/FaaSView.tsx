// @ts-nocheck
import { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { getProduct } from '../../data/products';
import { Card, CardTitle, MetricCard } from '../../components/ui/Card';
import { InsightRow, AIStrip } from '../../components/ui/InsightRow';
import { Badge } from '../../components/ui/Badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, LineChart, Line, Legend,
} from 'recharts';

const PRODUCT_ID = 'faas';
type TabId = 'insights' | 'control-types' | 'ux-gaps' | 'q2-scope' | 'architecture' | 'stories' | 'decisions' | 'inline-validation' | 'site-assessment';
const TABS: { id: TabId; label: string }[] = [
  { id: 'insights', label: 'Insights' },
  { id: 'control-types', label: 'Control types' },
  { id: 'ux-gaps', label: 'UX gaps' },
  { id: 'q2-scope', label: 'Q2 scope' },
  { id: 'stories', label: 'UX stories' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'decisions', label: 'Design decisions' },
];

const ticketTrendData = [
  { month: 'Aug', tickets: 7200 }, { month: 'Sep', tickets: 8100 },
  { month: 'Oct', tickets: 7800 }, { month: 'Nov', tickets: 9200 },
  { month: 'Dec', tickets: 8400 }, { month: 'Jan', tickets: 9800 },
  { month: 'Feb', tickets: 10200 }, { month: 'Mar', tickets: 9600 },
];

const usageBreakdown = [
  { domain: 'PA Programs', pct: 22, complexity: 'Low', note: 'Simple layouts, clone-heavy workflow' },
  { domain: 'Nursing (FNP/PNP)', pct: 31, complexity: 'High', note: '4-level hierarchy, repeater controls' },
  { domain: 'CRNA', pct: 18, complexity: 'Very High', note: 'Matrix + time pickers, complex dependencies' },
  { domain: 'SLP', pct: 12, complexity: 'High', note: 'Matrix-heavy, document upload, 999hr time pickers' },
  { domain: 'PT/OT', pct: 17, complexity: 'Medium', note: 'CPI/FWPE format, competency mapping' },
];

const controlTypes = [
  { type: 'Date picker', category: 'Basic', status: 'Stable', issues: 'None' },
  { type: 'Dropdown', category: 'Basic', status: 'Stable', issues: 'Long ICD/CPT strings display poorly' },
  { type: 'Free text', category: 'Basic', status: 'Stable', issues: 'None' },
  { type: 'Multi checkbox', category: 'Basic', status: 'Stable', issues: 'Chip display inconsistent vs plain text' },
  { type: 'Numeric box', category: 'Basic', status: 'Bug', issues: 'Limits only validated on submit, not real-time' },
  { type: 'Radio', category: 'Basic', status: 'Stable', issues: 'None' },
  { type: 'Search / Lookup (ICD/CPT)', category: 'Basic', status: 'Critical', issues: 'Delete button unclear, selected items not chip-styled, Observed vs Performed clunky' },
  { type: 'Matrix layout', category: 'Advanced', status: 'Critical', issues: 'Creation flow confusing — users cannot tell where new questions will land. 7+ radio options per row breaks layout.' },
  { type: 'Repeater controls', category: 'Advanced', status: 'Bug', issues: 'No guidance on when/how to use. Unlimited additions with no visual limit.' },
  { type: 'Hierarchical dependencies', category: 'Advanced', status: 'Bug', issues: 'CRNA: 4-level nesting (comprehensive → pediatric → intrathoracic → heart) renders poorly.' },
  { type: 'Time duration calculator', category: 'Specialized', status: 'Stable', issues: '99hr vs 999hr variants — backend difference invisible to creators' },
  { type: 'Code dropdown (ICD/CPT)', category: 'Specialized', status: 'Critical', issues: 'Long text strings, poor chip display, delete UX broken' },
];

const uxGaps = [
  { area: 'Color coding lost', severity: 'High', who: 'Prasanjit (Mar 25)', detail: 'Previously: patient demographics in different colors, surgical vs clinical settings with distinct indentation. Current: monochromatic black/white. Students cannot identify which section they are viewing.' },
  { area: 'Validation timing', severity: 'High', who: 'Prasanjit (Mar 25)', detail: 'Mandatory field errors only appear on submit. Numeric limits (>100 minutes) only validated at submission. No real-time feedback.' },
  { area: 'ICD/CPT lookup display', severity: 'Critical', who: 'Prasanjit (Mar 25)', detail: 'Selected ICD/CPT codes display as long text strings. Delete buttons unclear and poorly positioned. Observed vs Performed toggle clunky. Selected options should be chips.' },
  { area: 'Multi-select inconsistency', severity: 'Medium', who: 'Prasanjit (Mar 25)', detail: 'Some fields show chips, others plain text. Inconsistent selection states across similar control types in the same form.' },
  { area: 'Sticky feedback panel', severity: 'Medium', who: 'Prasanjit (Mar 25)', detail: 'Feedback panel does not remain sticky during scroll. Section navigation indicators do not update with scroll position.' },
  { area: 'Matrix creation confusion', severity: 'Critical', who: 'Prasanjit (Mar 25)', detail: 'Form creators cannot understand where new questions will be added. No preview of how additions render in student view. 7+ radio options per row creates overwhelming layouts.' },
  { area: 'Self-service blocked', severity: 'High', who: 'Akshit (Mar 25)', detail: 'Universities cannot create or edit forms independently. Feature intentionally disabled due to system stability concerns. All customization requires internal team intervention.' },
  { area: 'No field-level feedback', severity: 'Medium', who: 'Prasanjit (Mar 25)', detail: 'Current: only general comments at form level. Requested: granular annotations (e.g., specific ICD code feedback from supervisor to student).' },
];

const q2Scope = [
  { feature: 'Internal self-service (Phase 1)', target: 'CI team / CIC exec / page server', timeline: 'Q2 2026', detail: 'Adding questions, editing existing questions, adding options. Workflows currently hard-coded by tech team.' },
  { feature: 'Form library first', target: 'All modules', timeline: 'Q2 2026', detail: '80-85% of forms are incremental changes. Template-first approach. 90% start from predefined templates.' },
  { feature: 'Real-time validation', target: 'Student form-filler', timeline: 'Q2 2026', detail: 'Mandatory field errors inline, not on submit. Numeric limit validation as user types.' },
  { feature: 'ICD/CPT chip display', target: 'Student form-filler', timeline: 'Q2 2026', detail: 'Selected codes as chips, clear delete, Observed vs Performed as clean toggle.' },
  { feature: 'Section color coding restore', target: 'Student + faculty', timeline: 'Q2 2026', detail: 'Per Prasanjit: lost capability. Restore configurable section colors and indentation.' },
  { feature: 'Limited end-user rollout', target: 'Programs', timeline: 'Q3 2026', detail: 'Incremental exposure. Observe patterns before full rollout. Complex actions deferred.' },
  { feature: 'Drag-and-drop form builder', target: 'Admin', timeline: 'Q3+ 2026', detail: 'Has frontend constraints. Incremental implementation as tech team capacity allows.' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, 'error' | 'warning' | 'success' | 'default'> = {
    'Critical': 'error', 'Bug': 'warning', 'Stable': 'success',
  };
  return <Badge variant={map[status] || 'default'}>{status}</Badge>;
}

function SeverityDot({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    'Critical': '#EF4444', 'High': '#F59E0B', 'Medium': '#3B82F6',
  };
  return (
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[severity] || '#94A3B8', display: 'inline-block', flexShrink: 0, marginTop: 4 }} />
  );
}


// Transcript gaps added from raw session analysis Mar 26
const FAAS_TRANSCRIPT_GAPS = [
  { src:'Harsha (9f1f5f4f Mar 20)', gap:'FaaS looks like an outlier — "the entire product UI is something like this and fast is something different." Must be headless-first: form components inherit the host module visual language (compliance, eval, patient log). Not a style preference — a technical architecture requirement.', severity:'Critical' },
  { src:'Harsha (9f1f5f4f Mar 20)', gap:'No simulator/preview mode exists for form configuration. Errors only surface when students submit 2-3 months after setup. Need: live preview with sample data, and test mode before publishing.', severity:'Critical' },
  { src:'Harsha (9f1f5f4f Mar 20)', gap:'Manual free-text tag entry for CAS-FAST field mapping creates silent data corruption risk. A misspelled tag (e.g. "expiraiton date") breaks business logic with no error visible until student submission. Need: structured dropdown autocomplete for standard field types.', severity:'High' },
  { src:'Prasanjit (13352a23 Mar 25)', gap:'Section scroll synchronization is broken — scrolling the form does not update the section indicator. "I have moved to diagnosis but it has not moved." Section identity (knowing where you are) is completely lost.', severity:'High' },
  { src:'Prasanjit (13352a23 Mar 25)', gap:'Color coding for sections was removed in the FaaS migration. The old layout had clear section differentiation. The new FaaS makes all sections look the same — cognitive overload confirmed by Harsha and Prasanjit independently.', severity:'High' },
  { src:'Aarti (f29a990d Mar 20)', gap:'The 3-pane FaaS form builder is inaccessible. Aarti: "Usually a three tab like this is very difficult to make it accessible. To find out later it is not accessible — reworking is very hard." Title II deadline April 24 applies to FaaS too.', severity:'Critical' },
];

export function FaaSView() {
  const [tab, setTab] = useState<TabId>('insights');
  const insights = getInsightsByProduct(PRODUCT_ID);
  const product = getProduct(PRODUCT_ID);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'var(--surface-primary)', flexShrink: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '10px 18px', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? 'var(--brand)' : 'var(--text-secondary)', borderBottom: `2px solid ${tab === t.id ? 'var(--brand)' : 'transparent'}`, marginBottom: -1, background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* INSIGHTS TAB */}
        {tab === 'insights' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="FaaS 2.0: 17,000 configured forms across 11 types. 95,000 annual support tickets. NPS 2/5. Primary signal sources: Prasanjit (Patient Log Mar 25), Akshit Q2 Requirements (Mar 25), Harsha FaaS interview (Mar 20), Pratiksha Site Assessment (Mar 18), Vaibhav FaaS review (Feb 27)." />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <MetricCard label="Configured forms" value="17,000+" delta="Across 11 types" />
              <MetricCard label="Annual support tickets" value="95,000" delta="NPS 2/5 baseline" deltaPositive={false} />
              <MetricCard label="Admin NPS detractors" value="37" delta="Navigation & click-depth cited most" deltaPositive={false} />
              <MetricCard label="Student detractors" value="629" delta="Preceptor eval length + mobile gaps" deltaPositive={false} />
              <MetricCard label="Q2 Phase 1 target" value="Internal only" delta="CI team + CIC exec" />
              <MetricCard label="Form change type" value="80–85%" delta="Incremental edits vs new" />
            </div>

            <Card>
              <CardTitle sub="Monthly support ticket trend">Support ticket volume</CardTitle>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={ticketTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="tickets" stroke="#E31C79" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card>
              <CardTitle sub="Usage by clinical discipline + complexity (Prasanjit Mar 25)">Domain usage breakdown</CardTitle>
              {usageBreakdown.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: i < usageBreakdown.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ width: 140, fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', flexShrink: 0 }}>{d.domain}</span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--surface-secondary)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${d.pct}%`, background: '#E31C79', borderRadius: 3 }} />
                  </div>
                  <span style={{ width: 30, fontSize: 12, fontFamily: 'monospace', color: 'var(--text-secondary)', textAlign: 'right', flexShrink: 0 }}>{d.pct}%</span>
                  <Badge variant={d.complexity === 'Very High' || d.complexity === 'Critical' ? 'error' : d.complexity === 'High' ? 'warning' : 'default'}>{d.complexity}</Badge>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>{d.note}</span>
                </div>
              ))}
            </Card>

            {insights.slice(0, 8).map((ins, i) => (
              <InsightRow key={i} insight={ins} />
            ))}
          </div>
        )}

        {/* CONTROL TYPES TAB */}
        {tab === 'control-types' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="12 control types currently deployed across FaaS. Sources: Prasanjit Patient Log session (Mar 25), Harsha FaaS interview (Mar 20). Critical = blocks publish-quality work. Bug = degrades UX. Stable = works." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 4 }}>
              {[{ label: 'Critical issues', val: controlTypes.filter(c => c.status === 'Critical').length, color: '#EF4444' },
                { label: 'Bugs', val: controlTypes.filter(c => c.status === 'Bug').length, color: '#F59E0B' },
                { label: 'Stable', val: controlTypes.filter(c => c.status === 'Stable').length, color: '#10B981' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--surface-primary)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <Card>
              <CardTitle sub="All 12 types — status and known issues">Control type registry</CardTitle>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Control type', 'Category', 'Status', 'Known issue'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {controlTypes.map((c, i) => (
                    <tr key={i} style={{ borderBottom: i < controlTypes.length - 1 ? '1px solid var(--border)' : 'none', background: c.status === 'Critical' ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                      <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{c.type}</td>
                      <td style={{ padding: '10px 12px' }}><Badge variant="default">{c.category}</Badge></td>
                      <td style={{ padding: '10px 12px' }}><StatusBadge status={c.status} /></td>
                      <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)' }}>{c.issues}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {/* UX GAPS TAB */}
        {tab === 'ux-gaps' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="8 UX gaps identified from verbatim Prasanjit (Mar 25) and Akshit (Mar 25) sessions. Prasanjit is the internal FaaS domain expert — 3 years supporting Patient Log across nursing, CRNA, SLP, PA programs." />
            {uxGaps.map((gap, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <SeverityDot severity={gap.severity} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{gap.area}</span>
                      <Badge variant={gap.severity === 'Critical' ? 'error' : gap.severity === 'High' ? 'warning' : 'info'}>{gap.severity}</Badge>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{gap.who}</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{gap.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Q2 SCOPE TAB */}
        {tab === 'q2-scope' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Q2 scope from Akshit session (Mar 25). Phase 1: internal users only (CI team, CIC exec, page server). Phase 2: limited end-user rollout Q3. Key insight: 80-85% of forms are incremental — design must start from templates, not blank." />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              {[{ label: 'Q2 Phase 1 users', val: 'Internal', sub: 'CI team + CIC exec + page server' },
                { label: 'Primary use case', val: '80–85%', sub: 'Incremental edits to existing forms' },
                { label: 'Scratch creation', val: '2–3%', sub: 'Rare — template-first approach correct' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '14px 16px', borderRadius: 10, background: 'var(--surface-primary)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--brand)', fontFamily: 'monospace' }}>{s.val}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sub}</div>
                </div>
              ))}
            </div>
            <Card>
              <CardTitle sub="Scoped features with timeline and owner — Akshit Q2 session">Q2 feature scope</CardTitle>
              {q2Scope.map((item, i) => (
                <div key={i} style={{ padding: '12px 0', borderBottom: i < q2Scope.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{item.feature}</span>
                    <Badge variant={item.timeline === 'Q2 2026' ? 'warning' : 'default'}>{item.timeline}</Badge>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.target}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)', margin: 0 }}>{item.detail}</p>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="Akshit: template-first is the correct default — abstract screen accommodates all modules">Creation flow prioritization</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { rank: 1, option: 'Form library (templates)', pct: '90–95%', note: 'Patient log: nearly all forms start here' },
                  { rank: 2, option: 'AI import (PDF/document)', pct: '2–3%', note: 'Limited adoption data — do not over-promote yet' },
                  { rank: 3, option: 'Build from scratch', pct: '2–3%', note: 'Power users only — accessible but not default' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: i === 0 ? 'rgba(227,28,121,0.06)' : 'var(--surface-secondary)', border: `1px solid ${i === 0 ? 'rgba(227,28,121,0.15)' : 'var(--border)'}` }}>
                    <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'monospace', color: i === 0 ? 'var(--brand)' : 'var(--text-muted)', width: 24 }}>{row.rank}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', flex: 1 }}>{row.option}</span>
                    <span style={{ fontSize: 13, fontFamily: 'monospace', color: 'var(--text-secondary)', width: 60, textAlign: 'right' }}>{row.pct}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1 }}>{row.note}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* UX STORIES TAB */}
        {tab === 'stories' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="FaaS 2.0 user stories sourced from Prasanjit (Mar 25), Akshit (Mar 25), Harsha (Mar 20), Pratiksha (Mar 18). These are the actions users are performing — not reading a form builder manual." />
            {[
              { id: 'FS-01', who: 'Student (form filler)', what: 'See inline validation errors as I type, not only on submit', why: 'Currently: numeric limits only validated on submit — confusing and wastes time', src: 'Prasanjit (Mar 25)' },
              { id: 'FS-02', who: 'Student (form filler)', what: 'See selected ICD/CPT codes as chips with a clear remove action', why: 'Current long text strings are unreadable and delete button is poorly positioned', src: 'Prasanjit (Mar 25)' },
              { id: 'FS-03', who: 'Student (form filler)', what: 'Identify which section I am in by color or visual marker', why: 'Lost color coding — monochromatic interface makes sections indistinguishable', src: 'Prasanjit (Mar 25)' },
              { id: 'FS-04', who: 'Student (form filler)', what: 'See feedback from my supervisor at the field level, not just general comments', why: 'Supervisors need to annotate specific ICD code choices, not just leave general form-level notes', src: 'Prasanjit (Mar 25)' },
              { id: 'FS-05', who: 'Admin (form creator)', what: 'See a live preview of my matrix layout before saving', why: 'Current: users cannot tell where new questions will be added. No preview of student-side render.', src: 'Prasanjit (Mar 25)' },
              { id: 'FS-06', who: 'Admin (form creator)', what: 'Create a form from an existing template in under 3 clicks', why: '80-85% of forms are incremental changes. Template-first flow is the correct default.', src: 'Akshit (Mar 25)' },
              { id: 'FS-07', who: 'Admin (form creator)', what: 'Add a question to an existing form without involving the internal tech team', why: 'Self-service currently blocked for stability reasons. Phase 1 target: internal users only.', src: 'Akshit (Mar 25)' },
              { id: 'FS-08', who: 'Supervisor (form reviewer)', what: 'Leave annotated feedback on a specific field within the submitted form', why: 'Field-level comment system missing. Currently only form-level general comments.', src: 'Prasanjit (Mar 25)' },
            ].map((s, i) => (
              <Card key={i}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: 'var(--brand)', background: 'rgba(227,28,121,0.08)', padding: '2px 6px', borderRadius: 4, flexShrink: 0, marginTop: 1 }}>{s.id}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 4px' }}>
                      <strong>As a</strong> {s.who}, <strong>I need to</strong> {s.what}, <strong>so that</strong> {s.why}.
                    </p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Source: {s.src}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* DESIGN DECISIONS TAB */}
        {tab === 'decisions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="Key FaaS 2.0 design decisions grounded in Granola sessions. Each decision has a problem, rationale, and tradeoff." />
            {[
              { title: 'Template-first creation flow, not blank canvas', d: 'The default entry point for form creation is the form library, not a blank form builder.', r: '80-85% of forms are incremental changes to existing templates. Only 2-3% are built from scratch. Akshit: "Show form library prominently based on module context. Reduce user clicks by displaying relevant templates immediately."', t: 'Power users who want full control may feel constrained. Progressive disclosure solves: library first, advanced builder accessible but not default.', src: 'Akshit Q2 session · Mar 25' },
              { title: 'Phase 1: internal users only for self-service', d: 'Q2 self-service form editing is restricted to CI team, CIC exec, and page server team — not external university admins.', r: 'Self-service previously enabled and disabled due to system stability. Building with guardrails first. Akshit: "Workflow complexity too high for initial end user exposure. Incremental exposure without proactive communication."', t: 'Limits short-term adoption. Universities still need to request changes via internal team. Risk: frustration from power users who want to move faster.', src: 'Akshit Q2 session · Mar 25' },
              { title: 'Restore section color coding as a first-class feature', d: 'Section colors and indentation must be a configurable property in FaaS 2.0, not removed for simplicity.', r: 'Prasanjit: "Previously patient demographics in different colors, surgical vs clinical settings with distinct indentation. Current monochromatic interface reduces comprehension." CRNA and nursing programs rely on this for 4-level hierarchical forms.', t: 'Color configuration adds complexity to the form builder. Mitigation: preset color themes per discipline (nursing/surgical/clinical), not free-pick RGB.', src: 'Prasanjit Patient Log session · Mar 25' },
              { title: 'Real-time validation, not submit-time validation', d: 'Mandatory field errors and numeric limits must appear inline as the user types, not deferred to form submission.', r: 'Prasanjit: "Numeric limits only validated at submission." Current behavior is confusing and forces re-scrolling to find errors. Industry standard (Typeform, SurveyMonkey) shows inline errors.', t: 'Real-time validation requires more front-end state management. For matrix and hierarchical controls, validation triggers must be carefully scoped per-row.', src: 'Prasanjit Patient Log session · Mar 25' },
            ].map((d, i) => (
              <Card key={i}>
                <CardTitle sub={d.src}>{d.title}</CardTitle>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[{ label: 'Decision', text: d.d, color: '#3B82F6' }, { label: 'Rationale', text: d.r, color: '#10B981' }, { label: 'Tradeoff', text: d.t, color: '#F59E0B' }].map(row => (
                    <div key={row.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: row.color, width: 64, flexShrink: 0, marginTop: 2 }}>{row.label}</span>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>{row.text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ── ARCHITECTURE TAB ── */}
        {tab === 'architecture' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <AIStrip text="FaaS architecture from Arun/VB strategy session (Mar 3), India team (Mar 5), Harsha compliance interview (Mar 20), Day 5 migration plan (Mar 6). FaaS is an internal embedded component library — never standalone." />
            <Card>
              <CardTitle sub="Arun: cannot fundamentally rewrite backend — UI can be completely redesigned">Core constraint</CardTitle>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'What can change', items: ['Complete UI redesign', 'New React components', 'AI-powered features on top of existing API', 'New workflow engine (Q2–Q3)', 'New reporting layer per question type'], color: '#10B981' },
                  { label: 'What cannot change (without Anand sign-off)', items: ['Core form data model', 'Existing form template structures', 'Module API contracts', 'Client-facing form instances (80k+ patient logs)'], color: '#EF4444' },
                ].map((col, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: i === 0 ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)', border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: col.color, marginBottom: 8 }}>{col.label}</div>
                    {col.items.map((item, j) => (
                      <div key={j} style={{ display: 'flex', gap: 6, fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        <span style={{ color: col.color, flexShrink: 0 }}>{i === 0 ? '✓' : '×'}</span>{item}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <CardTitle sub="FaaS serves 5 modules — each adds its own layer">Embedded module architecture</CardTitle>
              {[
                { module: 'Patient Log (Prism)', adds: 'ICD/CPT lookups, specialized visualizations, procedure tracking triggers', fastProvides: 'Form rendering, validation, section logic' },
                { module: 'Evaluations (Prism)', adds: 'Competency mapping, approval workflows, DCE review queue', fastProvides: 'Rating scales, rubric controls, scoring formulas' },
                { module: 'Surveys', adds: 'Distribution lists, response analytics, scheduling', fastProvides: 'Question types, conditional logic, basic reporting' },
                { module: 'Site Assessment', adds: 'Site profile integration, accreditation PDF export', fastProvides: 'Form controls, e-signature, document upload' },
                { module: 'Compliance (CAS)', adds: 'Expiration date intelligence, approval queue, audit trail', fastProvides: 'Form fields, tag mapping, document collection' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge variant="default">{row.module}</Badge>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Module adds: </span><span style={{ color: 'var(--text-secondary)' }}>{row.adds}</span></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>FaaS provides: </span><span style={{ color: 'var(--text-secondary)' }}>{row.fastProvides}</span></div>
                  </div>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle sub="Harsha compliance interview (Mar 20) — three-system fragmentation">Compliance system pain: 3 systems, no cohesion</CardTitle>
              {[
                { system: 'ExactOne', role: 'Manages placement data', pain: 'Source of truth for placement records but isolated from compliance logic' },
                { system: 'CAS (Compliance as a Service)', role: 'Stores requirement setup and response data', pain: 'Tags manually entered by support team — spelling mistakes break business logic. No dropdown validation. No preview.' },
                { system: 'FaaS (FAST)', role: 'Form rendering and data capture', pain: 'Different UI styles from ExactOne. Cognitive overload from multiple borders, inconsistent fonts. Should be "headless application with consistent frontend."' },
              ].map((row, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Badge variant={i === 1 ? 'error' : 'default'}>{row.system}</Badge>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.role}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>{row.pain}</p>
                </div>
              ))}
              <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
                  <strong style={{ color: 'var(--text-primary)' }}>Day 5 resolution (Mar 6):</strong> Migrate to unified CAS. Centralized intelligence for expiration dates, completion validation, universal integrations. Maintain existing UI initially — backend transition first. Timeline: April compliance migration meeting.
                </p>
              </div>
            </Card>
            <Card>
              <CardTitle sub="Day 5 migration plan (Mar 6)">Patient Log database migration</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { label: 'From', val: 'Transactional: Cosmos DB · Reporting: Elastic + Mongo · 4 copies of data across systems' },
                  { label: 'To', val: 'Single Mongo transactional DB · Unified reporting (Elastic + Mongo) · End of March target' },
                  { label: 'Scale', val: '80,000+ forms require individual review and validation — high confidence required (nursing/PA programs)' },
                  { label: 'Exception', val: 'CRNA transition deferred until after summer — too complex for April rollout' },
                  { label: 'Q1–Q4 phases', val: 'Q1–Q2: Simple forms no scoring → Simple forms with scoring → Complex forms with active components. Q4: PTSCs, CITs, PT Max (custom rendering).' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand)', width: 64, flexShrink: 0, marginTop: 2 }}>{row.label}</span>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{row.val}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}


        {/* ─── INLINE VALIDATION STORY TAB ──────────────────────────────────────── */}
        {/* Source: Prasanjit session 13352a23 — the submit-only validation anti-pattern */}
        {/* SKILL.md Section 1.1: The Prasanjit Example — template for information connection */}
        {tab === 'inline-validation' && (() => {
          const [demoVal, setDemoVal] = (useState as any)('');
          const [submitted, setSubmitted] = (useState as any)(false);
          const [inlineMode, setInlineMode] = (useState as any)(true);
          const isInvalid = demoVal !== '' && (isNaN(Number(demoVal)) || Number(demoVal) > 99 || Number(demoVal) < 0);
          const showError = inlineMode ? (demoVal !== '' && isInvalid) : (submitted && isInvalid);
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* The story */}
              <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(232,96,74,0.04)', border: '1px solid rgba(232,96,74,0.2)', borderLeft: '4px solid #e8604a' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#e8604a', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                  Prasanjit · FaaS Patient Log · Mar 25, 2026 · session 13352a23
                </div>
                <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, fontFamily: 'DM Serif Display, Georgia, serif', fontStyle: 'italic', marginBottom: 10 }}>
                  "Mandatory field errors only appear on submit, not during input. Numeric limits only validated at submission. Students don't get immediate feedback when entering invalid data."
                </div>
                <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
                  A student enters 150 minutes into a procedure duration field. The form accepts it silently.
                  They complete 20 more fields. They hit submit. Then: a red error banner at the top of the page.
                  They must scroll back up, find the field, fix it, and resubmit. This is the submit-only validation
                  anti-pattern — and it is a WCAG 3.3.1 violation on top of a UX failure.
                </div>
              </div>

              {/* Live demo */}
              <div style={{ padding: '16px 20px', borderRadius: 12, background: '#fff', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Interactive demo — feel the difference</div>
                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    {([true, false] as const).map(mode => (
                      <button key={String(mode)} onClick={() => { setInlineMode(mode); setSubmitted(false); setDemoVal(''); }}
                        style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 20, border: `1px solid ${inlineMode === mode ? (mode ? '#0d9488' : '#e8604a') : 'var(--border)'}`, background: inlineMode === mode ? (mode ? 'rgba(13,148,136,0.08)' : 'rgba(232,96,74,0.08)') : '#fff', color: inlineMode === mode ? (mode ? '#0d9488' : '#e8604a') : 'var(--text3)', cursor: 'pointer' }}>
                        {mode ? '✓ Inline validation (fixed)' : '✗ Submit-only (current)'}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ maxWidth: 360 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', display: 'block', marginBottom: 6 }}>
                    Procedure duration (0–99 minutes)
                    <span style={{ color: '#e8604a', marginLeft: 3 }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number" value={demoVal} placeholder="Enter minutes"
                      onChange={e => { setDemoVal(e.target.value); setSubmitted(false); }}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1.5px solid ${showError ? '#e8604a' : 'var(--border)'}`, fontSize: 13, outline: 'none', background: showError ? 'rgba(232,96,74,0.04)' : '#fff', boxSizing: 'border-box' }}
                    />
                    {!inlineMode && (
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: 'var(--text3)' }}>max 99</span>
                    )}
                    {inlineMode && demoVal !== '' && (
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 10, color: isInvalid ? '#e8604a' : '#0d9488', fontWeight: 700 }}>
                        {isInvalid ? '✗' : '✓'}
                      </span>
                    )}
                  </div>
                  {showError && (
                    <div style={{ marginTop: 5, fontSize: 12, color: '#e8604a', display: 'flex', alignItems: 'center', gap: 4 }}>
                      ⚠ Please enter a number between 0 and 99
                    </div>
                  )}
                  {!showError && demoVal !== '' && !isInvalid && inlineMode && (
                    <div style={{ marginTop: 5, fontSize: 12, color: '#0d9488' }}>✓ Valid duration</div>
                  )}
                  {!inlineMode && (
                    <button onClick={() => setSubmitted(true)} style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, background: '#6d5ed4', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                      Submit form
                    </button>
                  )}
                  {!inlineMode && submitted && !isInvalid && demoVal !== '' && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#0d9488' }}>✓ Submitted successfully</div>
                  )}
                </div>
              </div>

              {/* Information connection graph */}
              <div style={{ padding: '14px 18px', borderRadius: 12, background: '#fff', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                  Information connection — how one observation becomes a design decision
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {[
                    { node: 'Session 13352a23', type: 'S', color: '#6d5ed4', desc: 'Prasanjit shows FaaS numeric field. Student can type 999. Error only on submit.', edge: 'source-of' },
                    { node: 'Gap ins-faas-gap-23', type: 'I', color: '#e8604a', desc: 'No inline field validation. Submit-only error pattern across all FaaS form controls.', edge: 'violates' },
                    { node: 'WCAG 3.3.1', type: 'P', color: '#d97706', desc: 'Error identification: "If an input error is automatically detected, the item in error is identified and the error is described to the user in text." — must be immediate, not deferred.', edge: 'requires' },
                    { node: 'SurveyMonkey / Typeform / Google Forms', type: 'C', color: '#94a3b8', desc: 'All three validate inline. This is the baseline expectation users bring from any form tool.', edge: 'blocks' },
                    { node: 'FaaS self-service launch', type: 'F', color: '#0d9488', desc: 'Design fix: real-time validation with visible limits as helper text, error on blur not submit.', edge: null },
                  ].map((n, i, arr) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 24 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: n.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>{n.type}</div>
                        {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border)', minHeight: 24, marginTop: 2 }} />}
                      </div>
                      <div style={{ paddingBottom: i < arr.length - 1 ? 16 : 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: n.color, marginBottom: 2 }}>{n.node}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.5 }}>{n.desc}</div>
                        {n.edge && (
                          <div style={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)', marginTop: 2 }}>→ {n.edge}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FaaS design fixes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                {[
                  { title: 'Inline validation', fix: 'Every form control validates on blur. Character/number limits shown as helper text before user types. Error message is specific ("Enter 0–99") not generic ("Invalid value").', severity: 'critical', wcag: '3.3.1' },
                  { title: 'Scroll sync', fix: 'Moving to a new section must update the section indicator in the left nav. Currently broken — user navigates blind.', severity: 'high', wcag: '2.4.3' },
                  { title: 'Section color coding', fix: 'Color coding for sections was removed in FaaS migration. Restore to help users distinguish sections at a glance. Color alone not sufficient — use color + icon + label.', severity: 'high', wcag: '1.4.1' },
                ].map((f, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: '#fff', border: `1px solid ${f.severity === 'critical' ? 'rgba(220,38,38,0.25)' : 'var(--border)'}`, borderLeft: `3px solid ${f.severity === 'critical' ? '#dc2626' : '#d97706'}` }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: f.severity === 'critical' ? '#dc2626' : '#d97706' }}>{f.title}</span>
                      <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 8, background: 'rgba(109,94,212,0.08)', color: '#6d5ed4', fontFamily: 'JetBrains Mono, monospace' }}>WCAG {f.wcag}</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>{f.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ─── SITE ASSESSMENT TAB ─────────────────────────────────────────────── */}
        {/* Source: Pratiksha session 1a0cd25e — site assessment deep dive */}
        {tab === 'site-assessment' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Story */}
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'rgba(13,148,136,0.04)', border: '1px solid rgba(13,148,136,0.2)', borderLeft: '4px solid #0d9488' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
                Pratiksha · FaaS Site Assessment · Mar 18, 2026 · session 1a0cd25e
              </div>
              <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, fontFamily: 'DM Serif Display, Georgia, serif', fontStyle: 'italic', marginBottom: 8 }}>
                "They need to present the site assessment to accreditation bodies. For that they need one PDF. But step 1 and step 3 are outside FaaS. So we cannot give them one PDF. That is the problem."
              </div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
                A program director visits a clinical site. She records the assessment across 3 steps — site details (step 1), assessment questions (step 2 via FaaS), and form metadata (step 3). When her accreditor asks for documentation, she needs one unified PDF. Exxat gives her an Excel export of step 2 only. She manually stitches steps 1–3 together in Word. Every cycle.
              </div>
            </div>

            {/* 3-step visual */}
            <div style={{ padding: '16px 20px', borderRadius: 12, background: '#fff', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Site assessment: 3-step lifecycle</div>
              <div style={{ display: 'flex', gap: 0, alignItems: 'stretch' }}>
                {[
                  { step: 'Step 1', label: 'Site details', location: 'Site module (hardcoded)', status: 'outside-faas', desc: 'Site name, address, accreditation type, capacity. Not configurable by FaaS.' },
                  { step: 'Step 2', label: 'Assessment form', location: 'FaaS (configurable)', status: 'in-faas', desc: 'Custom questions configured per school. Up to 5 form variations. This is what FaaS controls.' },
                  { step: 'Step 3', label: 'Form metadata', location: 'Site module (hardcoded)', status: 'outside-faas', desc: 'Completion date, reviewer name, submission status. Not configurable by FaaS.' },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, padding: '12px 14px', background: s.status === 'in-faas' ? 'rgba(13,148,136,0.06)' : 'rgba(232,96,74,0.05)', border: `1px solid ${s.status === 'in-faas' ? 'rgba(13,148,136,0.25)' : 'rgba(232,96,74,0.25)'}`, borderRadius: i === 0 ? '10px 0 0 10px' : i === 2 ? '0 10px 10px 0' : 0, borderLeft: i > 0 ? 'none' : undefined }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: s.status === 'in-faas' ? '#0d9488' : '#e8604a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.step}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, display: 'inline-block', background: s.status === 'in-faas' ? 'rgba(13,148,136,0.12)' : 'rgba(232,96,74,0.12)', color: s.status === 'in-faas' ? '#0d9488' : '#e8604a', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace' }}>{s.location}</div>
                    <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 8, background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.18)', fontSize: 12, color: 'var(--text2)' }}>
                <strong style={{ color: '#dc2626' }}>Accreditation blocker:</strong> FaaS PDF download exports step 2 only. Accreditors need steps 1+2+3 as one document. Clients manually stitch in Word or Excel every accreditation cycle.
              </div>
            </div>

            {/* Key asks + PIF */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ padding: '14px 16px', borderRadius: 12, background: '#fff', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Top client asks (confirmed by Pendo + Pratiksha)</div>
                {[
                  { ask: 'Download form responses as PDF', priority: 'P0', detail: 'Not Excel. The accreditation audience reads PDFs, not spreadsheets. Must include all 3 steps as unified document.' },
                  { ask: 'Unpublish form without deleting', priority: 'P1', detail: 'Clients need to take a form offline temporarily (seasonal sites, under review) without losing the configuration.' },
                  { ask: 'No requests for more control types', priority: 'Note', detail: 'Current control set (single/multi choice, short/long answer, dropdown, date, signature) is sufficient for assessment use case.' },
                ].map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, paddingBottom: i < 2 ? 10 : 0, marginBottom: i < 2 ? 10 : 0, borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6, background: a.priority === 'P0' ? 'rgba(220,38,38,0.1)' : a.priority === 'P1' ? 'rgba(217,119,6,0.1)' : 'rgba(148,163,184,0.1)', color: a.priority === 'P0' ? '#dc2626' : a.priority === 'P1' ? '#d97706' : '#94a3b8', flexShrink: 0, height: 'fit-content', marginTop: 1 }}>{a.priority}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{a.ask}</div>
                      <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>{a.detail}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '14px 16px', borderRadius: 12, background: '#fff', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Preceptor Intake Form (PIF) — new FaaS surface</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  FaaS powers a new global preceptor profile system. A preceptor fills the form once — their credentials, license, certifications sync to every school that uses them.
                </div>
                {[
                  { label: 'Standardized fields', val: 'Locked. Cannot be renamed. First name, credentials, license, certifications. Maps directly to global profile.' },
                  { label: 'Custom section', val: 'School adds program-specific questions. These stay local, not synced to global profile.' },
                  { label: 'License expiry', val: 'Feeds into placement clearance dashboard — flags preceptors with expiring credentials before rotation starts.' },
                  { label: 'Design implication', val: 'Two-section form: standardized (read-only field labels) + custom (editable). Visual distinction required.' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, paddingBottom: i < 3 ? 8 : 0, marginBottom: i < 3 ? 8 : 0, borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#0d9488', width: 120, flexShrink: 0, marginTop: 1 }}>{r.label}</span>
                    <p style={{ fontSize: 12, color: 'var(--text2)', margin: 0, lineHeight: 1.5 }}>{r.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
