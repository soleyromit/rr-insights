// views/products/exam/Architecture.tsx — Exam Management architecture spec
// (v18). Question-bank model, lifecycle, roles, versioning, service blueprint
// and the Arun 3-year strategy. Sources are named per block.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Fig } from '../../../components/charts/Fig';
import { RankedList } from '../../../components/charts/RankedList';
import { SpecSection } from '../spec/SpecSection';
import { hrefInsight } from '../../../lib/links';

interface Row extends Record<string, unknown> {
  id: string;
}

const ENTRY_METHODS = [
  { id: 'create', method: 'Create new', who: 'Faculty', desc: 'Write directly in question editor. Starts as Draft.', ai: false },
  { id: 'import', method: 'Import from file', who: 'Admin / Faculty', desc: 'Bulk upload Word/Excel/QTI. System parses and creates Drafts.', ai: false },
  { id: 'clone', method: 'Clone from existing', who: 'Faculty', desc: 'Save as variant — new question (new ID, new chain), not a new version of the original.', ai: false },
  { id: 'ai-gen', method: 'AI generation', who: 'Faculty', desc: 'Upload course content → AI generates MCQs/MSQs with tags pre-filled. Faculty reviews before saving to bank.', ai: true },
  { id: 'examsoft', method: 'ExamSoft import', who: 'Admin', desc: 'AI-assisted migration from ExamSoft CSV export. Maps existing tags to the Exxat tag schema.', ai: true },
];

const STATUSES = [
  { id: 'draft', status: 'Draft', desc: 'Authored, not yet reviewed. Only visible to creator and admins.' },
  { id: 'review', status: 'In Review', desc: 'Submitted for approval. Blocked on Dept Head config: some depts skip review.' },
  { id: 'golden', status: 'Golden', desc: 'Approved for live exams. Can be used in assessments.' },
  { id: 'archived', status: 'Archived', desc: 'Deprecated. Retained for historical data. Excluded from active pool.' },
  { id: 'action', status: 'Action Required', desc: 'Orange badge replaces status when a colleague requests an edit or an item performed poorly.' },
];

const ROLES = [
  { id: 'dh', role: 'Dept Head / PD', access: 'Full control', desc: 'Approve questions, endorse versions, cross-dept sharing, lock exam window. Has Review Access by default.' },
  { id: 'fac', role: 'Faculty / Course Director', access: 'Scoped edit', desc: 'Create questions, build assessments, submit for review.' },
  { id: 'ia', role: 'Institution Admin', access: 'Read-only all', desc: 'Full audit view, configure tag schemas, accreditation mapping.' },
  { id: 'con', role: 'Contributor', access: 'Composable', desc: 'Creates questions for a specific assessment — head faculty reviews.' },
  { id: 'il', role: 'Initiative Lead', access: 'Read QB', desc: 'Cross-dept program-level assessments, assigns sections.' },
  { id: 'rev', role: 'Reviewer', access: 'Review scope', desc: 'Not a role — a permission layer on top of Faculty. Approve/reject + review comments within assigned scope, granted by Dept Head.' },
];

const TAGS = [
  { id: 't1', cat: 'Question type', examples: 'MCQ, MSQ, fill-blank, matching, hotspot, formula, audio, video, PDF', system: true },
  { id: 't2', cat: "Bloom's level", examples: 'Remember, Understand, Apply, Analyze, Evaluate, Create', system: true },
  { id: 't3', cat: 'Difficulty', examples: 'Easy, Medium, Hard, Very Hard', system: true },
  { id: 't4', cat: 'Body system', examples: 'Cardio, Pulm, GI, Neuro, MSK, Derm, Psych (dept-configurable)', system: true },
  { id: 't5', cat: 'Competency', examples: 'NCCPA blueprint cells, ARC-PA domains, CAPTE outcomes (programme-specific)', system: false },
  { id: 't6', cat: 'Course', examples: 'Optional — no hard DB constraint. If assigned: auto-tagged.', system: false },
  { id: 't7', cat: 'Free-form', examples: 'Any additional tag. ~20 tags per question when fully used.', system: false },
];

const SMART_VIEWS = [
  { id: 'v1', view: 'My Questions', filter: 'Author = current user', scope: 'private' },
  { id: 'v2', view: '[Dept] Questions', filter: 'Department = user department', scope: 'shared' },
  { id: 'v3', view: 'Recently Used', filter: 'Last used in assessment within 90 days', scope: 'private' },
  { id: 'v4', view: 'Flagged for Review', filter: 'Status = Action Required', scope: 'shared' },
  { id: 'v5', view: 'High-Yield [Topic]', filter: 'Tag includes topic + Difficulty ≥ Hard', scope: 'shared' },
  { id: 'v6', view: 'NCCPA Blueprint — [Cell]', filter: 'Competency tag = NCCPA cell ID', scope: 'shared' },
];

const QB_COMPETITORS = [
  { id: 'es', tool: 'ExamSoft', model: 'Folder-based (file-system style)', gap: 'Questions trapped in course silos; updates in one bank not reflected in another; versions diverge with no link.', exxat: 'Flat pool + smart views solves the silo problem.' },
  { id: 'cv', tool: 'Canvas LMS', model: 'Flat list + search/filter + tags', gap: 'Two separate question systems that do not talk to each other. Not built for medical-specific needs.', exxat: 'One pool, medical-specific tags, NCCPA blueprint cells.' },
  { id: 'bb', tool: 'Blackboard Ultra', model: 'Flat list + search + AI gen', gap: 'Dropped folders entirely — too unstructured for power faculty; no medical taxonomy.', exxat: 'Smart views give structure without rigid folders. AI gen in scope.' },
  { id: 'd2l', tool: 'D2L BrightSpace', model: 'Folder + shared LOR', gap: 'Bulk accommodation is manual per student per quiz; no clinical education differentiation.', exxat: 'Program-level accommodation profiles — 1 action vs 70 in D2L.' },
];

const BLUEPRINT = [
  { id: 's1', stage: 'Create Q', action: 'Write stem + options', ui: 'Rich text + image upload', backstage: 'Version UUID, audit log', policy: 'FERPA: no student ID', pain: 'Manual alt text' },
  { id: 's2', stage: 'Tag + Version', action: "Assign Bloom's, topic", ui: 'Tag panel + AI overlay', backstage: 'AI taxonomy on save', policy: 'CAPTE requires LO map', pain: 'Tagging burden' },
  { id: 's3', stage: 'Review', action: 'Peer review, approve', ui: 'Review sidebar + diff', backstage: 'Notification + audit', policy: 'Min 1 peer reviewer', pain: 'No async threading' },
  { id: 's4', stage: 'Build Exam', action: 'Add to sections, set marks', ui: 'Assessment Builder tabs', backstage: 'Marks auto-compute', policy: 'Blueprint verified', pain: 'Multi-campus sync' },
  { id: 's5', stage: 'A11y Config', action: 'Set accommodations', ui: 'Accessibility tab + audit', backstage: 'Profile assigned to student', policy: 'ADA 508 + WCAG 2.1 AA', pain: '—' },
  { id: 's6', stage: 'Publish', action: 'Pass publish gate', ui: 'Publish gate modal', backstage: 'WCAG check published', policy: 'CRITICAL items resolved', pain: 'Publish gate is new' },
  { id: 's7', stage: 'Student Exam', action: 'Take exam w/ a11y toolbar', ui: 'Exam UI + a11y toolbar', backstage: 'Lockdown, encrypted', policy: 'Lockdown enforced', pain: 'OSK + TTS built in' },
  { id: 's8', stage: 'Analytics', action: 'Faculty reviews item stats', ui: 'Item heatmap, p-value', backstage: 'p-value, PBis computed', policy: 'De-identified export', pain: 'No cohort vs national' },
];

const LANES = [
  { lane: 'Admin / Faculty', steps: 'Create question (or import) → Tag + version → Submit for review (Draft → In Review) → Approve' },
  { lane: 'Question Bank', steps: 'Flat institution-wide pool with scoped views → Assessment Builder (sections, marks, blueprint) → Configure + publish (schedule, proctoring, accommodations)' },
  { lane: 'Student', steps: 'Exam available (lockdown browser) → Answer all question types → Submit + flag (progress, navigator) → Graded result (auto-scored, LMS sync)' },
];

const ARUN_YEARS = [
  { year: 'Year 1 · 2026', goal: 'Beat LMS quiz modules', items: ['Canvas/D2L feature parity (no less)', 'Better UI than any LMS', 'One excellent AI use case', 'Lockdown browser (Respondus preferred)', 'Psychometrics at question and assessment level', 'Free for all Prism users'] },
  { year: 'Year 2 · 2027', goal: 'Equal or better than ExamSoft', items: ['All ExamSoft features + more', 'Several AI use cases (ExamSoft is anti-AI)', 'Seamless Prism integration', 'Better UI than ExamSoft', 'Competitive or lower pricing', 'Charged product'] },
  { year: 'Year 3 · 2028', goal: 'Way beyond ExamSoft', items: ['AI-powered proctoring', 'Adaptive exams (NCLEX CAT model)', 'Consider own lockdown browser', 'No reason for customers to use ExamSoft'] },
];

const ARUN_PRINCIPLES = [
  { p: 'Speed over design system compliance', d: 'Design system is still a first draft. Freedom to build custom components; mandate comes when convergence is visible.' },
  { p: 'AI everywhere on admin side', d: 'AI should reduce time faculty spend designing and conducting exams — question generation, option generation, gap detection. Not for the exam taker.' },
  { p: 'Exam taker UI is its own design system', d: 'The student exam experience has no equivalent in current products. Whatever is built becomes the design system for this context.' },
  { p: 'Prism integration is differentiator 4', d: 'Seamless Prism integration is a key competitive advantage. Data should flow without re-entry.' },
];

export function Architecture() {
  return (
    <VStack gap={6}>
      <SpecSection
        title="Flat pool + Scoped Views"
        sub="Architecture decision · Stakeholder Day 1+2 Feb 2026 + Exam Standup Mar 26. Every question lives in a single institution-wide flat pool — no separate course or department banks. Faculty see questions through Smart Views: saved filter queries that look like folders. Tags and permissions determine visibility. This solves the ExamSoft silo problem without rigid hierarchy."
      >
        <Grid columns={{ minWidth: 320, max: 2 }} gap={3}>
          <Card variant="muted" padding={3}>
            <VStack gap={1}>
              <Text type="label" color="secondary">
                What the system stores
              </Text>
              <Text type="supporting" as="p" textWrap="pretty">
                One pool. Per question: dept-prefixed ID, original author (never changes), version chain, tags across 7 category
                types, status lifecycle, department ownership.
              </Text>
              <Link href={hrefInsight('ins-em-gap-02')}>QB ownership decision (ins-em-gap-02) →</Link>
            </VStack>
          </Card>
          <Card variant="muted" padding={3}>
            <VStack gap={1}>
              <Text type="label" color="secondary">
                Smart Views — two modes
              </Text>
              <Text type="supporting" as="p" textWrap="pretty">
                Always-updated (live filter) vs fixed snapshot (pinned at creation). Personal views private by default; dept
                views shared. Smart folders are saved searches applied to the flat pool — not containers you drag things into.
              </Text>
            </VStack>
          </Card>
        </Grid>
        <Table<Row & (typeof SMART_VIEWS)[number]>
          data={SMART_VIEWS}
          idKey="id"
          density="compact"
          columns={[
            { key: 'view', header: 'Smart View', width: pixel(220), renderCell: (r) => <Text type="body">{r.view}</Text> },
            { key: 'filter', header: 'Filter definition', width: proportional(2), renderCell: (r) => <Text type="supporting">{r.filter}</Text> },
            { key: 'scope', header: 'Scope', width: pixel(90), renderCell: (r) => <Badge variant={r.scope === 'private' ? 'neutral' : 'info'} label={r.scope} /> },
          ]}
        />
      </SpecSection>

      <SpecSection title="How questions enter the bank" sub="Five entry methods; two are AI-assisted. ExamSoft import is the switching-cost killer.">
        <Table<Row & (typeof ENTRY_METHODS)[number]>
          data={ENTRY_METHODS}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'method', header: 'Method', width: pixel(170), renderCell: (r) => <Text type="body" weight="semibold">{r.method}</Text> },
            { key: 'who', header: 'Who', width: pixel(130), renderCell: (r) => <Text type="supporting">{r.who}</Text> },
            { key: 'desc', header: 'Behavior', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.desc}</Text> },
            { key: 'ai', header: '', width: pixel(60), renderCell: (r) => (r.ai ? <Badge variant="info" label="AI" /> : null) },
          ]}
        />
      </SpecSection>

      <SpecSection
        title="Status lifecycle and versioning"
        sub="Draft → In Review → Golden → Archived, plus the Action Required overlay (Mar 26 standup naming; the earlier migration pack used Ready/Active/Retired for the same chain — the conflict is noted, not silenced). Every edit creates an immutable version; exams pin to a version at creation."
      >
        <Table<Row & (typeof STATUSES)[number]>
          data={STATUSES}
          idKey="id"
          density="compact"
          columns={[
            { key: 'status', header: 'Status', width: pixel(140), renderCell: (r) => <Badge variant={r.status === 'Golden' ? 'success' : r.status === 'Action Required' ? 'error' : r.status === 'In Review' ? 'warning' : 'neutral'} label={r.status} /> },
            { key: 'desc', header: 'Meaning', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.desc}</Text> },
          ]}
        />
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Versioning model: same-author edit → V2; Dept Head edit → V3 (original author never changes); another faculty
            forking creates a new question with a derived_from link. Each version stores editor, timestamp, and diff. Exams pin
            to the version current at creation — an ExamSoft data-loss failure Exxat must not repeat (see ins-em-gap-29).
          </Text>
        </Card>
      </SpecSection>

      <SpecSection title="Roles and question bank access" sub="Six roles with fundamentally different needs. The full per-feature access matrix lives on the Navigation IA page.">
        <Table<Row & (typeof ROLES)[number]>
          data={ROLES}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'role', header: 'Role', width: pixel(190), renderCell: (r) => <Text type="body" weight="semibold">{r.role}</Text> },
            { key: 'access', header: 'Access', width: pixel(120), renderCell: (r) => <Badge variant="neutral" label={r.access} /> },
            { key: 'desc', header: 'What they do', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.desc}</Text> },
          ]}
        />
        <Link href="/products/exam-management/ia" isStandalone>
          Full role × feature access matrix (Navigation IA) →
        </Link>
      </SpecSection>

      <SpecSection title="Tag schema" sub="Seven category types, ~20 tags per question when fully used. Structured properties, not freeform text.">
        <Table<Row & (typeof TAGS)[number]>
          data={TAGS}
          idKey="id"
          density="compact"
          columns={[
            { key: 'cat', header: 'Category', width: pixel(150), renderCell: (r) => <Text type="body">{r.cat}</Text> },
            { key: 'system', header: 'Origin', width: pixel(110), renderCell: (r) => <Badge variant={r.system ? 'success' : 'info'} label={r.system ? 'System' : 'Custom'} /> },
            { key: 'examples', header: 'Values', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.examples}</Text> },
          ]}
        />
      </SpecSection>

      <SpecSection title="Competitor question bank models" sub="Why flat pool wins: only 1 of the 5 top tools still uses folders.">
        <Table<Row & (typeof QB_COMPETITORS)[number]>
          data={QB_COMPETITORS}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'tool', header: 'Tool', width: pixel(130), renderCell: (r) => <Text type="body" weight="semibold">{r.tool}</Text> },
            { key: 'model', header: 'Model', width: proportional(1), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.model}</Text> },
            { key: 'gap', header: 'Gap', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.gap}</Text> },
            { key: 'exxat', header: 'Exxat answer', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.exxat}</Text> },
          ]}
        />
      </SpecSection>

      <SpecSection
        title="End-to-end service blueprint"
        sub="Admin creates → QB → Assessment Builder → accessibility config → publish → student exam → analytics. The analytics feedback loop (psychometrics flag poor questions, update difficulty, inform the next exam) is the competitive moat against ExamSoft."
      >
        <Table<Row & (typeof BLUEPRINT)[number]>
          data={BLUEPRINT}
          idKey="id"
          density="compact"
          columns={[
            { key: 'stage', header: 'Stage', width: pixel(110), renderCell: (r) => <Text type="body" weight="semibold">{r.stage}</Text> },
            { key: 'action', header: 'User action', width: proportional(1), renderCell: (r) => <Text type="supporting">{r.action}</Text> },
            { key: 'ui', header: 'Frontstage UI', width: proportional(1), renderCell: (r) => <Text type="supporting">{r.ui}</Text> },
            { key: 'backstage', header: 'Backstage', width: proportional(1), renderCell: (r) => <Text type="supporting">{r.backstage}</Text> },
            { key: 'policy', header: 'Policy', width: proportional(1), renderCell: (r) => <Text type="supporting">{r.policy}</Text> },
            { key: 'pain', header: 'Pain point', width: proportional(1), renderCell: (r) => <Text type="supporting" color="secondary">{r.pain}</Text> },
          ]}
        />
        <Collapsible trigger="3-lane system flow (migration pack)" defaultIsOpen={false}>
          <VStack gap={2}>
            {LANES.map((l) => (
              <HStack key={l.lane} gap={2} vAlign="center" wrap="wrap">
                <Badge variant="neutral" label={l.lane} />
                <Text type="supporting" as="p" textWrap="pretty">
                  {l.steps}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Collapsible>
      </SpecSection>

      <SpecSection title="Delivery state" sub="Source: Granola Jul 23 + design review Jul 15. Jan 20 2027 MVP is the hard target; offline download is unresolved (Aarti May 19: mandatory; Jul 23 team: March).">
        <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
          <Fig title="MVP readiness by module" caption="Self-reported design + build state; AI features are POC-complete but paused for the roadmap decision.">
            <RankedList
              rows={[
                { key: 'qb', label: 'Question Bank (QA phase)', value: 95, hint: 'folders, Smart Views, permissions in QA' },
                { key: 'student', label: 'Student Exam UX', value: 85, hint: 'a11y toolbar + navigator; offline cut to March' },
                { key: 'builder', label: 'Assessment Builder', value: 80, hint: '7 question types built; settings UI in dev' },
                { key: 'review', label: 'Faculty Review + Scoring', value: 60, hint: "item analysis spec'd; score adjustment in progress" },
                { key: 'ai', label: 'AI features', value: 15, hint: 'POC complete (100% accuracy); paused' },
              ]}
              format={(r) => `${r.value}%`}
              errorBelow={50}
            />
          </Fig>
          <Fig title="Phase delivery confidence" caption="Jan 20 MVP tracks at 82% design / 75% engineering; the offline-download conflict is surfaced, not resolved.">
            <RankedList
              rows={[
                { key: 'mvp', label: 'Jan 20 MVP overall', value: 82, hint: '82% design · 75% engineering' },
                { key: 'cohere', label: 'Cohere Sep 2026 demo', value: 65, hint: 'production-ready, not just working' },
                { key: 'parity', label: 'ExamSoft full parity', value: 40, hint: 'Cronbach alpha, curriculum mapping — Year 2' },
                { key: 'offline', label: 'Offline download (March LA)', value: 0, hint: 'cut from MVP; Aarti/team conflict open' },
              ]}
              format={(r) => `${r.value}%`}
              errorBelow={50}
            />
          </Fig>
        </Grid>
      </SpecSection>

      <SpecSection title="Arun's 3-year strategy" sub="Session 791334af · Mar 24 2026.">
        <Blockquote cite="Arun Gautam · Mar 24, 2026 · session 791334af">
          ExamSoft is publicly against AI. We are going to use it. That is our second differentiator.
        </Blockquote>
        <Grid columns={{ minWidth: 240, max: 3 }} gap={3}>
          {ARUN_YEARS.map((y) => (
            <Card key={y.year} padding={3}>
              <VStack gap={1.5}>
                <Text type="label" color="secondary">
                  {y.year}
                </Text>
                <Text type="body" weight="semibold">
                  {y.goal}
                </Text>
                {y.items.map((it, i) => (
                  <Text key={i} type="supporting" as="p" textWrap="pretty">
                    {it}
                  </Text>
                ))}
              </VStack>
            </Card>
          ))}
        </Grid>
        <Card variant="muted" padding={3}>
          <VStack gap={2}>
            <Text type="label" color="secondary">
              Design principles from Arun
            </Text>
            {ARUN_PRINCIPLES.map((r) => (
              <VStack key={r.p} gap={0.5}>
                <Text type="body" weight="semibold">
                  {r.p}
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  {r.d}
                </Text>
              </VStack>
            ))}
          </VStack>
        </Card>
      </SpecSection>
    </VStack>
  );
}
