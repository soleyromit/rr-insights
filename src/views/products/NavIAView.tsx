// views/products/NavIAView.tsx — Exam Management Navigation IA (v18 Astryx).
// Role hierarchy as a TreeList, the nav merge map and access matrix as
// Tables, and the dual meaning of "Sections" as cards.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { TreeList } from '@astryxdesign/core/TreeList';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { SpecSection } from './spec/SpecSection';
import { SpecFooter } from './spec/SpecFooter';
import { hrefProductSpec } from '../../lib/links';

const PRODUCT_ID = 'exam-management';

const ROLE_TREE = [
  {
    id: 'tier1',
    label: 'Tier 1 — Institution',
    isExpanded: true,
    children: [
      {
        id: 'inst-admin',
        label: 'Institution admin — full platform config, audit, user mgmt, LMS/LTI, Respondus proctoring',
        children: ['All exams', 'Question bank (full)', 'Assessments + Sections builder', 'Distribution', 'Analytics', 'Outcome & accreditation', 'Audit trail', 'Settings / user mgmt', 'LMS integration'].map((n, i) => ({ id: `ia-${i}`, label: n })),
      },
    ],
  },
  {
    id: 'tier2',
    label: 'Tier 2 — Program',
    isExpanded: true,
    children: [
      {
        id: 'prog-dir',
        label: 'Program director — accreditation compliance, PANCE/ARC-PA reporting, outcome oversight',
        children: ['All exams (read)', 'Question bank (read)', 'Assessments (read)', 'Analytics (full)', 'Outcome & accreditation (full)'].map((n, i) => ({ id: `pd-${i}`, label: n })),
      },
      {
        id: 'hod',
        label: 'Dept head / HOD — question governance, review queue, version visibility across faculty',
        children: ['All exams', 'Question bank (full)', 'Assessments + Sections builder', 'Review queue (full)', 'Distribution', 'Analytics (full)'].map((n, i) => ({ id: `hod-${i}`, label: n })),
      },
      {
        id: 'outcome-dir',
        label: 'Outcome director (CONFIRM — may be a Dept Head responsibility, not a standalone role)',
        children: ['Analytics (full)', 'Outcome & accreditation (full)'].map((n, i) => ({ id: `od-${i}`, label: n })),
      },
    ],
  },
  {
    id: 'tier3',
    label: 'Tier 3 — Scoped',
    isExpanded: true,
    children: [
      {
        id: 'contributor',
        label: 'Contributor — adds questions to assigned sections only; entry point of the HOD approval workflow',
        children: ['Question bank (add only — assigned sections)', 'My drafts'].map((n, i) => ({ id: `co-${i}`, label: n })),
      },
      {
        id: 'reviewer',
        label: 'Reviewer — approves drafts within scope; read-only content access (missing capability today)',
        children: ['Review queue (scoped)', 'Question bank (read-only, scoped)'].map((n, i) => ({ id: `re-${i}`, label: n })),
      },
      {
        id: 'dce',
        label: 'DCE — clinical exam oversight and student accommodation profiles for placements',
        children: ['Assessments', 'Students / accommodations', 'Question bank (scoped to clinical)'].map((n, i) => ({ id: `dce-${i}`, label: n })),
      },
    ],
  },
];

interface MergeRow extends Record<string, unknown> {
  id: string;
  label: string;
  status: string;
  note: string;
}
const MERGE: MergeRow[] = [
  { id: 'm1', label: 'All exams / dashboard', status: 'shared', note: 'Same layout; admin sees all programs, faculty sees their courses.' },
  { id: 'm2', label: 'Question bank', status: 'shared', note: 'Same table; admin adds approval controls, faculty is course-scoped with status tags.' },
  { id: 'm3', label: 'Assessments', status: 'shared', note: 'Same creation flow; admin drops to all programs, faculty scoped to course assignments.' },
  { id: 'm4', label: 'Rubrics', status: 'shared', note: 'OSCE rubric creation; admin all programs, faculty assigned courses.' },
  { id: 'm5', label: 'Review queue', status: 'shared', note: 'HOD/Admin full queue; faculty sees only items pending on their questions.' },
  { id: 'm6', label: 'Analytics', status: 'shared', note: 'Admin program-level, faculty course-level — same component, different data scope.' },
  { id: 'm7', label: 'Sections (assessment builder)', status: 'shared', note: 'A tab inside Assessment Builder — content-area blocks with time limits, pools, nav rules. NOT a standalone sidebar item.' },
  { id: 'm8', label: 'Students / accommodations', status: 'admin-only', note: 'Enrollment, accommodation profiles, extended time.' },
  { id: 'm9', label: 'Distribution', status: 'admin-only', note: 'Live exam console; submit on behalf of a student.' },
  { id: 'm10', label: 'Outcome & accreditation', status: 'admin-only', note: 'ARC-PA reports, competency dashboards.' },
  { id: 'm11', label: 'Audit trail', status: 'admin-only', note: 'Full platform audit log.' },
  { id: 'm12', label: 'Settings / user mgmt', status: 'admin-only', note: 'RBAC, LMS integration, proctoring config.' },
  { id: 'm13', label: 'My courses', status: 'faculty-only', note: 'Course-based entry to the question bank — confirmed faculty default nav.' },
  { id: 'm14', label: 'Student exam shell', status: 'student-only', note: 'No sidebar. Progress bar, 3-state navigator, accessibility controls — a completely separate surface.' },
];

interface MatrixRow extends Record<string, unknown> {
  id: string;
  feature: string;
  cells: string[];
}
const MATRIX_HEADERS = ['Inst. admin', 'Prog. director', 'HOD', 'Outcome dir.', 'Contributor', 'Reviewer', 'DCE'];
const MATRIX: MatrixRow[] = [
  { id: 'x1', feature: 'All exams / dashboard', cells: ['full', 'read', 'full', 'read', 'read', '—', 'read'] },
  { id: 'x2', feature: 'Question bank', cells: ['full', 'read', 'full', '—', 'add', 'read', 'scoped'] },
  { id: 'x3', feature: 'Assessments', cells: ['full', 'read', 'full', '—', '—', '—', 'read'] },
  { id: 'x4', feature: 'Review queue', cells: ['full', '—', 'full', '—', '—', 'scoped', '—'] },
  { id: 'x5', feature: 'Sections (in Assessment Builder)', cells: ['full', 'read', 'full', '—', '—', '—', 'read'] },
  { id: 'x6', feature: 'Distribution', cells: ['full', '—', 'full', '—', '—', '—', '—'] },
  { id: 'x7', feature: 'Analytics', cells: ['full', 'full', 'full', 'full', '—', '—', '—'] },
  { id: 'x8', feature: 'Outcome & accreditation', cells: ['full', 'full', 'read', 'full', '—', '—', '—'] },
  { id: 'x9', feature: 'Audit trail', cells: ['full', '—', '—', '—', '—', '—', '—'] },
  { id: 'x10', feature: 'Settings / user mgmt', cells: ['full', '—', '—', '—', '—', '—', '—'] },
  { id: 'x11', feature: 'LMS / integration', cells: ['full', '—', '—', '—', '—', '—', '—'] },
  { id: 'x12', feature: 'My courses (faculty)', cells: ['—', '—', '—', '—', 'full', 'read', '—'] },
];

const ACCESS_VARIANT: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  full: 'success',
  read: 'info',
  add: 'warning',
  scoped: 'neutral',
};

const MERGE_VARIANT: Record<string, 'info' | 'error' | 'success' | 'neutral'> = {
  shared: 'info',
  'admin-only': 'error',
  'faculty-only': 'success',
  'student-only': 'neutral',
};

export function NavIAView() {
  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="Exam Management — Navigation IA"
        lede="Synthesized Apr 1 2026 from 40 Granola sessions, ExamSoft screenshot analysis, and the system hierarchy blueprint."
        meta="Merge principle: unified interface, role controls data scope — not layout. Shared screens confirmed: Question Bank, Assessments, Rubrics (+ Analytics at different scopes)."
      />

      <SpecSection title="Role hierarchy" sub="Three tiers; expand a role for its nav items. Open question flagged Apr 1: is Outcome Director standalone or a Dept Head responsibility? Confirm with Vishaka before building that nav state.">
        <Card padding={4}>
          <TreeList items={ROLE_TREE} density="compact" />
        </Card>
      </SpecSection>

      <SpecSection title="Nav merge map" sub="Which surfaces are shared across roles vs owned by one audience.">
        <Table<MergeRow>
          data={MERGE}
          idKey="id"
          density="compact"
          columns={[
            { key: 'status', header: 'Ownership', width: pixel(120), renderCell: (r) => <Badge variant={MERGE_VARIANT[r.status]} label={r.status.replace('-', ' ')} /> },
            { key: 'label', header: 'Nav item', width: pixel(220), renderCell: (r) => <Text type="body">{r.label}</Text> },
            { key: 'note', header: 'Behavior', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.note}</Text> },
          ]}
        />
      </SpecSection>

      <SpecSection title='What "Sections" means' sub='The word carries two meanings at different product layers — a P0 naming decision before April 17.'>
        <Grid columns={{ minWidth: 320, max: 3 }} gap={3}>
          <Card variant="muted" padding={3}>
            <VStack gap={1}>
              <Text type="body" weight="semibold">
                Builder construct
              </Text>
              <Text type="supporting" as="p" textWrap="pretty">
                A tab inside Assessment Builder where an admin divides an exam into named content-area blocks — each with its
                own question pool, time limit, point weighting and navigation rules (e.g. Section 1 = Pulmonology, 20
                questions, 30 min). Confirmed: sequential vs flexible navigation per section, blueprint-based assignment per
                content area (sessions f5d66e4c, a4625ac7).
              </Text>
            </VStack>
          </Card>
          <Card variant="muted" padding={3}>
            <VStack gap={1}>
              <Text type="body" weight="semibold">
                Student experience
              </Text>
              <Text type="supporting" as="p" textWrap="pretty">
                A Section Entry Screen precedes each block: title, question count, time limit. Navigation is configurable —
                sequential (submit Section 1 before Section 2, no return) or flexible within total time. Handled by
                SectionEntryScreen.tsx; sequential lock-out confirmed for standardized exam types (f29a990d).
              </Text>
            </VStack>
          </Card>
          <Card variant="muted" padding={3}>
            <VStack gap={1}>
              <HStack gap={2} vAlign="center">
                <Text type="body" weight="semibold">
                  Correction note
                </Text>
                <Badge variant="warning" label="corrected Apr 1" />
              </HStack>
              <Text type="supporting" as="p" textWrap="pretty">
                Earlier analysis wrongly classified Sections as a top-level admin nav item for roster/cohort management. It is
                not a standalone destination. Action: propose renaming any admin-nav "Sections" to "Cohorts" before the April
                17 demo — ExamSoft's naming confusion is a documented pain point.
              </Text>
            </VStack>
          </Card>
        </Grid>
      </SpecSection>

      <SpecSection title="Access matrix" sub="full = create/edit/delete · read = view only · add = create only · scoped = within assigned scope.">
        <Table<MatrixRow>
          data={MATRIX}
          idKey="id"
          density="compact"
          columns={[
            { key: 'feature', header: 'Nav item', width: pixel(220), renderCell: (r) => <Text type="body">{r.feature}</Text> },
            ...MATRIX_HEADERS.map((h, i) => ({
              key: `c${i}`,
              header: h,
              width: proportional(1),
              renderCell: (r: MatrixRow) =>
                r.cells[i] === '—' ? (
                  <Text type="supporting">—</Text>
                ) : (
                  <Badge variant={ACCESS_VARIANT[r.cells[i]] ?? 'neutral'} label={r.cells[i]} />
                ),
            })),
          ]}
        />
      </SpecSection>

      <SpecFooter
        productId={PRODUCT_ID}
        extra={
          <>
            <Link href={`${hrefProductSpec(PRODUCT_ID)}?section=architecture`} isStandalone>
              Spec: QB architecture →
            </Link>
            <Link href={`${hrefProductSpec(PRODUCT_ID)}?section=builder`} isStandalone>
              Spec: builder + stories →
            </Link>
          </>
        }
      />
    </VStack>
  );
}
