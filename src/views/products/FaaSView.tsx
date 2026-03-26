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
type TabId = 'insights' | 'control-types' | 'ux-gaps' | 'q2-scope' | 'architecture' | 'stories' | 'decisions';
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

      </div>
    </div>
  );
}
