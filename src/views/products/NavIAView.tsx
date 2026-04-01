// @ts-nocheck
// NavIAView.tsx — Exam Management Navigation IA
// Synthesized from: Claude conversation Apr 1 2026
// Sources: Granola (all 40 sessions), ExamSoft screenshot analysis, system_hierarchy_blueprint.md

import { useState } from 'react';
import { Card, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

type Tab = 'roles' | 'merge' | 'sections' | 'matrix';

const TABS: { id: Tab; label: string; alert?: boolean }[] = [
  { id: 'roles',   label: 'Role hierarchy' },
  { id: 'merge',   label: 'Nav merge map' },
  { id: 'sections',label: 'What is Sections?', alert: true },
  { id: 'matrix',  label: 'Access matrix' },
];

const ts = (tab: Tab, cur: Tab) => ({
  padding: '10px 18px', fontSize: 13,
  fontWeight: cur === tab ? 600 : 400,
  color: cur === tab ? 'var(--brand)' : 'var(--text-secondary)',
  borderBottom: `2px solid ${cur === tab ? 'var(--brand)' : 'transparent'}`,
  marginBottom: -1, background: 'none', border: 'none',
  cursor: 'pointer', whiteSpace: 'nowrap' as const,
});

// ─── Data ───────────────────────────────────────────────────────────────────

const ROLES = [
  {
    tier: 1, label: 'Institution admin', group: 'institution',
    color: '#534AB7', bg: '#EEEDFE',
    desc: 'Full platform config, audit, user management, LMS/Canvas LTI setup, Respondus proctoring config. Sits above all programs.',
    nav: ['All exams', 'Question bank (full)', 'Assessments', 'Sections', 'Distribution', 'Analytics', 'Outcome & accreditation', 'Audit trail', 'Settings / user mgmt', 'LMS integration'],
    granola: 'Confirmed: role-based access controls at field and page levels (Granola session 39)',
  },
  {
    tier: 2, label: 'Program director', group: 'program',
    color: '#0F6E56', bg: '#E1F5EE',
    desc: 'Accreditation compliance, PANCE/ARC-PA reporting, outcome oversight. Primary job: narrative synthesis + structured accreditation reports.',
    nav: ['All exams (read)', 'Question bank (read)', 'Assessments (read)', 'Analytics (full)', 'Outcome & accreditation (full)'],
    granola: 'Confirmed: ARC-PA quarterly reporting, PANCE pass rate tracking, program-level outcome oversight (Granola sessions 25, 42)',
  },
  {
    tier: 2, label: 'Dept head / HOD', group: 'program',
    color: '#0F6E56', bg: '#E1F5EE',
    desc: 'Question governance and approval. Owns review queue. Sees all question versions across faculty. Sets department-defined tag categories.',
    nav: ['All exams', 'Question bank (full)', 'Assessments', 'Review queue (full)', 'Sections', 'Distribution', 'Analytics (full)'],
    granola: '"HOD visibility into question version usage across faculty" — explicit Granola requirement (session 8c94698f Mar 4)',
  },
  {
    tier: 2, label: 'Outcome director', group: 'program',
    color: '#0F6E56', bg: '#E1F5EE',
    desc: 'Competency tracking and accreditation data only. Does not touch question creation or distribution. Generates 1-click accreditation reports.',
    nav: ['Analytics (full)', 'Outcome & accreditation (full)'],
    granola: 'Status: open question — may be dept head with additional responsibility, not a standalone role. Confirm with Vishaka (Apr 1 session)',
    openQuestion: true,
  },
  {
    tier: 3, label: 'Contributor', group: 'scoped',
    color: '#5F5E5A', bg: '#F1EFE8',
    desc: 'Can add questions to assigned sections only. Cannot publish, approve, or access reports. Entry point of the HOD approval workflow.',
    nav: ['Question bank (add only — assigned sections)', 'My drafts'],
    granola: '"Approval workflows needed before campus-wide availability" — Contributor is the start of this workflow (session f59ac2a6 Mar 12)',
  },
  {
    tier: 3, label: 'Reviewer', group: 'scoped',
    color: '#5F5E5A', bg: '#F1EFE8',
    desc: 'Approves drafts within their scope. Read-only access to question content. Cannot create or edit. Missing capability identified in current platform.',
    nav: ['Review queue (scoped)', 'Question bank (read-only, scoped)'],
    granola: 'Gap confirmed: read-only access roles missing across all permission levels (Granola session 86820dfe)',
  },
  {
    tier: 3, label: 'DCE', group: 'scoped',
    color: '#5F5E5A', bg: '#F1EFE8',
    desc: 'Director of Clinical Education. Manages clinical exam oversight and student accommodation profiles for clinical placements.',
    nav: ['Assessments', 'Students / accommodations', 'Question bank (scoped to clinical)'],
    granola: 'Confirmed persona across FaaS, Skills Checklist, and Exam Management (all Granola sessions)',
  },
];

const MERGE_ITEMS = [
  { label: 'All exams / dashboard', status: 'shared', note: 'Same layout. Admin sees all programs. Faculty sees their courses.' },
  { label: 'Question bank', status: 'shared', note: 'Same table. Admin sees all + approval controls. Faculty sees course-scoped + approval status tags.' },
  { label: 'Assessments', status: 'shared', note: 'Same creation flow. Admin drops to all programs. Faculty scoped to course assignments.' },
  { label: 'Rubrics', status: 'shared', note: 'OSCE rubric creation. Admin sees all programs. Faculty sees assigned courses.' },
  { label: 'Review queue', status: 'shared', note: 'HOD/Admin sees full queue. Faculty sees only items pending on their questions.' },
  { label: 'Analytics', status: 'shared', note: 'Admin = program-level. Faculty = course-level. Same component, different data scope.' },
  { label: 'Students / accommodations', status: 'admin-only', note: 'Enrollment, accommodation profiles, extended time. No faculty equivalent.' },
  { label: 'Sections (roster)', status: 'admin-only', note: 'Cohort management, student assignment. No faculty equivalent.' },
  { label: 'Distribution', status: 'admin-only', note: 'Live exam console, submit on behalf of student. No faculty equivalent.' },
  { label: 'Outcome & accreditation', status: 'admin-only', note: 'ARC-PA reports, competency dashboards. No faculty equivalent.' },
  { label: 'Audit trail', status: 'admin-only', note: 'Full platform audit log. No faculty equivalent.' },
  { label: 'Settings / user mgmt', status: 'admin-only', note: 'RBAC, LMS integration, proctoring config. No faculty equivalent.' },
  { label: 'My courses', status: 'faculty-only', note: 'Course-based entry point to question bank. Confirmed in Granola as faculty default nav.' },
  { label: 'Student exam shell', status: 'student-only', note: 'No sidebar. Progress bar, 3-state navigator, accessibility controls. Completely separate surface.' },
];

const SECTIONS_MEANINGS = [
  {
    title: 'Meaning 1 — Admin nav: roster management',
    color: '#534AB7', bg: '#EEEDFE',
    description: 'In the admin sidebar, "Sections" = student cohort groups. An admin creates named cohorts (e.g. "PT Year 2 Section A") and assigns students to them. When an exam is distributed, it goes to a section — not to individual students. Roster import, enrollment, and section-level accommodation overrides all live here.',
    where: 'Admin sidebar nav item → pre-exam setup',
    granola: 'Maps to ExamSoft "Sections" tab. Blueprint-based exam building assigns question pools per section (Granola sessions f5d66e4c, 41)',
    confusion: false,
  },
  {
    title: 'Meaning 2 — Exam structure: locked content blocks',
    color: '#185FA5', bg: '#E6F1FB',
    description: 'Inside an exam, a section is a timed content block. Like USMLE blocks: once you submit Section 1 (Pulmonology, 20 questions, 30 min), you cannot return. Section 2 is a new timed block. Students see a section entry screen with title, question count, and time limit before entering.',
    where: 'Student exam shell → SectionEntryScreen component',
    granola: '"Section entry screen with title and question count before entering" — confirmed in accessibility design session (f29a990d Mar 20)',
    confusion: false,
  },
  {
    title: 'Design recommendation: rename to resolve the confusion',
    color: '#854F0B', bg: '#FAEEDA',
    description: 'ExamSoft uses "Sections" for both meanings — a known UX pain point that contributes to their 1/5 satisfaction rating. Exxat should call the admin function "Cohorts" or "Enrollment groups" and reserve "Sections" only for the in-exam structural blocks. This is a naming decision that should go to Vishaka before April 17.',
    where: 'Decision needed before April 17 demo',
    granola: 'ExamSoft satisfaction 1/5 confirmed (Granola session e9e48150). Naming ambiguity is a known contributor.',
    confusion: true,
  },
];

const MATRIX_ROWS = [
  { feature: 'All exams / dashboard', instAdmin: 'full', progDir: 'read', hod: 'full', outcomeDr: 'read', contributor: 'read', reviewer: '—', dce: 'read' },
  { feature: 'Question bank', instAdmin: 'full', progDir: 'read', hod: 'full', outcomeDr: '—', contributor: 'add', reviewer: 'read', dce: 'scoped' },
  { feature: 'Assessments', instAdmin: 'full', progDir: 'read', hod: 'full', outcomeDr: '—', contributor: '—', reviewer: '—', dce: 'read' },
  { feature: 'Review queue', instAdmin: 'full', progDir: '—', hod: 'full', outcomeDr: '—', contributor: '—', reviewer: 'scoped', dce: '—' },
  { feature: 'Sections (cohorts)', instAdmin: 'full', progDir: 'read', hod: 'full', outcomeDr: '—', contributor: '—', reviewer: '—', dce: '—' },
  { feature: 'Distribution', instAdmin: 'full', progDir: '—', hod: 'full', outcomeDr: '—', contributor: '—', reviewer: '—', dce: '—' },
  { feature: 'Analytics', instAdmin: 'full', progDir: 'full', hod: 'full', outcomeDr: 'full', contributor: '—', reviewer: '—', dce: '—' },
  { feature: 'Outcome & accreditation', instAdmin: 'full', progDir: 'full', hod: 'read', outcomeDr: 'full', contributor: '—', reviewer: '—', dce: '—' },
  { feature: 'Audit trail', instAdmin: 'full', progDir: '—', hod: '—', outcomeDr: '—', contributor: '—', reviewer: '—', dce: '—' },
  { feature: 'Settings / user mgmt', instAdmin: 'full', progDir: '—', hod: '—', outcomeDr: '—', contributor: '—', reviewer: '—', dce: '—' },
  { feature: 'LMS / integration', instAdmin: 'full', progDir: '—', hod: '—', outcomeDr: '—', contributor: '—', reviewer: '—', dce: '—' },
  { feature: 'My courses (faculty)', instAdmin: '—', progDir: '—', hod: '—', outcomeDr: '—', contributor: 'full', reviewer: 'read', dce: '—' },
];

const ACCESS_COLORS: Record<string, string> = {
  'full':   '#0F6E56',
  'read':   '#185FA5',
  'add':    '#854F0B',
  'scoped': '#534AB7',
  '—':      '#B4B2A9',
};
const ACCESS_BG: Record<string, string> = {
  'full':   '#E1F5EE',
  'read':   '#E6F1FB',
  'add':    '#FAEEDA',
  'scoped': '#EEEDFE',
  '—':      'transparent',
};

// ─── Component ──────────────────────────────────────────────────────────────

export function NavIAView() {
  const [tab, setTab] = useState<Tab>('roles');

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1100 }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
          Navigation IA — Exam Management
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 680 }}>
          Synthesized Apr 1 2026 from 40 Granola sessions, ExamSoft screenshot analysis, and system hierarchy blueprint.
          Covers all admin-layer roles, nav merge decisions, and the dual meaning of "Sections".
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24, gap: 0, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t.id} style={ts(t.id, tab)} onClick={() => setTab(t.id)}>
            {t.label}{t.alert && <span style={{ marginLeft: 4, fontSize: 9, color: '#E24B4A', fontWeight: 700 }}>●</span>}
          </button>
        ))}
      </div>

      {/* Role hierarchy */}
      {tab === 'roles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Tier labels */}
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'start' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 16 }}>
              Tier 1<br />Institution
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {ROLES.filter(r => r.tier === 1).map(role => (
                <RoleCard key={role.label} role={role} />
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 120, height: 1, background: 'var(--border)', marginBottom: 4 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'start' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 16 }}>
              Tier 2<br />Program
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
              {ROLES.filter(r => r.tier === 2).map(role => (
                <RoleCard key={role.label} role={role} />
              ))}
            </div>
          </div>
          <div style={{ marginLeft: 120, height: 1, background: 'var(--border)', marginBottom: 4 }} />
          <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 12, alignItems: 'start' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', paddingTop: 16 }}>
              Tier 3<br />Scoped
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
              {ROLES.filter(r => r.tier === 3).map(role => (
                <RoleCard key={role.label} role={role} />
              ))}
            </div>
          </div>
          <Card style={{ marginTop: 8, background: 'var(--surface2)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              <strong style={{ color: 'var(--text)' }}>Open question (confirm with Vishaka):</strong> Outcome Director — is this a standalone role or additional responsibility layered onto Dept Head? Apr 1 session flagged this. Confirm before building the nav state for this role.
            </p>
          </Card>
        </div>
      )}

      {/* Nav merge map */}
      {tab === 'merge' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 8, flexWrap: 'wrap' as const }}>
            {[
              { status: 'shared', label: 'Shared — admin + faculty', color: '#534AB7', bg: '#EEEDFE' },
              { status: 'admin-only', label: 'Admin only', color: '#9D174D', bg: '#FCE7F3' },
              { status: 'faculty-only', label: 'Faculty only', color: '#065F46', bg: '#D1FAE5' },
              { status: 'student-only', label: 'Student only', color: '#185FA5', bg: '#E6F1FB' },
            ].map(l => (
              <span key={l.status} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: l.bg, color: l.color }}>
                {l.label}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12, lineHeight: 1.5 }}>
            Merge principle from Granola: unified interface, role controls data scope — not layout. Same screen renders differently based on role context. Three shared screens confirmed: Question Bank, Assessments, Rubrics (plus Analytics at different scopes).
          </p>
          {MERGE_ITEMS.map(item => {
            const colors = {
              'shared':       { c: '#534AB7', bg: '#EEEDFE' },
              'admin-only':   { c: '#9D174D', bg: '#FCE7F3' },
              'faculty-only': { c: '#065F46', bg: '#D1FAE5' },
              'student-only': { c: '#185FA5', bg: '#E6F1FB' },
            }[item.status] || { c: '#888', bg: '#eee' };
            return (
              <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12, background: colors.bg, color: colors.c, flexShrink: 0, marginTop: 1, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {item.status.replace('-', ' ')}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.note}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* What is Sections */}
      {tab === 'sections' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 680 }}>
            "Sections" carries two distinct meanings in Exam Management. They live at different layers of the product and should never share a label. This is a P0 naming decision before April 17.
          </p>
          {SECTIONS_MEANINGS.map(m => (
            <Card key={m.title} style={{ border: `1px solid ${m.color}33`, background: m.bg }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 4, minHeight: 80, borderRadius: 2, background: m.color, flexShrink: 0, marginTop: 2 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: m.color, marginBottom: 8 }}>{m.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65, marginBottom: 10 }}>{m.description}</p>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' as const }}>
                    <div style={{ fontSize: 11, color: m.color, fontWeight: 500 }}>
                      Where: <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>{m.where}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    {m.granola}
                  </div>
                  {m.confusion && (
                    <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 6, background: '#FAEEDA', border: '1px solid #F0997B' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#854F0B' }}>Action required: </span>
                      <span style={{ fontSize: 12, color: '#854F0B' }}>Propose renaming "Sections" (admin nav) to "Cohorts" to Vishaka before April 17 demo. ExamSoft's naming confusion is a documented pain point — fix it before launch.</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Access matrix */}
      {tab === 'matrix' && (
        <div style={{ overflowX: 'auto' }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.5 }}>
            Access key: <span style={{ background: '#E1F5EE', color: '#0F6E56', padding: '1px 6px', borderRadius: 4, fontWeight: 600, fontSize: 11 }}>full</span> = create/edit/delete &nbsp;
            <span style={{ background: '#E6F1FB', color: '#185FA5', padding: '1px 6px', borderRadius: 4, fontWeight: 600, fontSize: 11 }}>read</span> = view only &nbsp;
            <span style={{ background: '#FAEEDA', color: '#854F0B', padding: '1px 6px', borderRadius: 4, fontWeight: 600, fontSize: 11 }}>add</span> = create only &nbsp;
            <span style={{ background: '#EEEDFE', color: '#534AB7', padding: '1px 6px', borderRadius: 4, fontWeight: 600, fontSize: 11 }}>scoped</span> = within assigned scope only
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: 'var(--surface2)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', minWidth: 180 }}>Nav item</th>
                {['Inst. admin', 'Prog. director', 'HOD', 'Outcome dir.', 'Contributor', 'Reviewer', 'DCE'].map(h => (
                  <th key={h} style={{ textAlign: 'center', padding: '10px 8px', fontWeight: 600, color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)', minWidth: 88 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX_ROWS.map((row, i) => (
                <tr key={row.feature} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface2)', borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '9px 12px', fontWeight: 500, color: 'var(--text)' }}>{row.feature}</td>
                  {[row.instAdmin, row.progDir, row.hod, row.outcomeDr, row.contributor, row.reviewer, row.dce].map((val, vi) => (
                    <td key={vi} style={{ textAlign: 'center', padding: '9px 8px' }}>
                      {val !== '—' ? (
                        <span style={{ background: ACCESS_BG[val] || 'transparent', color: ACCESS_COLORS[val] || '#888', padding: '2px 8px', borderRadius: 10, fontWeight: 600, fontSize: 11 }}>{val}</span>
                      ) : (
                        <span style={{ color: 'var(--border)', fontSize: 13 }}>—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function RoleCard({ role }: { role: typeof ROLES[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{ flex: '1 1 240px', maxWidth: 320, padding: '14px 16px', borderRadius: 10, border: `1px solid ${role.color}33`, background: role.bg, cursor: 'pointer', transition: 'box-shadow 0.15s' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: role.color, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: role.color }}>{role.label}</span>
        {role.openQuestion && <span style={{ fontSize: 9, color: '#E24B4A', fontWeight: 700, marginLeft: 2 }}>CONFIRM</span>}
      </div>
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, marginBottom: 8 }}>{role.desc}</p>
      {open && (
        <div style={{ marginTop: 8, borderTop: `1px solid ${role.color}22`, paddingTop: 8 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: role.color, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nav items</div>
          {role.nav.map(n => (
            <div key={n} style={{ fontSize: 11, color: 'var(--text-secondary)', padding: '2px 0', display: 'flex', gap: 6, alignItems: 'center' }}>
              <span style={{ color: role.color, fontSize: 9 }}>›</span> {n}
            </div>
          ))}
          <div style={{ marginTop: 8, fontSize: 10, color: role.color, fontStyle: 'italic', lineHeight: 1.4 }}>{role.granola}</div>
        </div>
      )}
      <div style={{ fontSize: 10, color: role.color, opacity: 0.6 }}>{open ? 'click to collapse' : 'click for nav items'}</div>
    </div>
  );
}
