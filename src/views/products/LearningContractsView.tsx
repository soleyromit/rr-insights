// views/products/LearningContractsView.tsx — Learning Contracts spec archive
// (v19). Sparseness IS the story: the header chips show the dormant evidence
// stream, and the orienting figure finally CHARTS the page's one claim —
// per-persona evidence counts computed live from the corpus. The caption
// states whether SCCE actually leads the count; it does not assume it.
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Fig } from '../../components/charts/Fig';
import { RankedList } from '../../components/charts/RankedList';
import { SpecPageHeader } from './spec/SpecPageHeader';
import { SpecSection } from './spec/SpecSection';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { SpecFooter } from './spec/SpecFooter';
import { insightsWhere } from '../../lib/selectors';
import { hrefInsights, hrefProduct } from '../../lib/links';
import { PERSONAS } from '../../data/personas';

const PRODUCT_ID = 'learning-contracts';

const SECTIONS = [
  { id: 'lifecycle', label: 'Roles + lifecycle' },
  { id: 'gaps', label: 'The missing link' },
  { id: 'personas', label: 'Persona risk' },
  { id: 'roadmap', label: 'Proposed roadmap' },
];

interface StageRow extends Record<string, unknown> {
  id: string;
  stage: string;
  owner: string;
  action: string;
  pain: string;
  nps?: boolean;
}
const LIFECYCLE: StageRow[] = [
  { id: 's1', stage: 'Placement assigned', owner: 'DCE', action: 'System generates a draft contract from template; DCE customizes objectives.', pain: 'Template selection is manual; no link to previous rotations or competency history.' },
  { id: 's2', stage: 'Student acknowledgement', owner: 'Student', action: 'Student reviews objectives and signs digitally; deadline tracked.', pain: 'Students often unaware a contract exists until chased; no in-app notification.', nps: true },
  { id: 's3', stage: 'Site supervisor review', owner: 'SCCE', action: 'Clinical supervisor reviews goals and adds site-specific expectations.', pain: 'SCCE rarely uses Exxat — re-learns the platform every rotation; mobile inadequate.', nps: true },
  { id: 's4', stage: 'Midpoint check-in', owner: 'DCE + Student', action: 'Optional midpoint review; progress noted against objectives.', pain: 'No structured workflow — happens over email/phone; notes lost outside the system.' },
  { id: 's5', stage: 'End-of-rotation review', owner: 'DCE + SCCE + Student', action: 'All three parties assess completion; contract completes or carries over.', pain: 'Carryover logic not built — incomplete rotation-1 goals vanish from rotation 2.' },
  { id: 's6', stage: 'Program archive', owner: 'System', action: 'Completed contracts archive; PD reviews aggregate goal attainment.', pain: 'No aggregate view — PD cannot see what percentage of students met a goal.' },
];

interface RoleRow extends Record<string, unknown> {
  id: string;
  role: string;
  job: string;
  gap: string;
}
const ROLES: RoleRow[] = [
  { id: 'r1', role: 'Student', job: 'Review and acknowledge objectives; track own progress.', gap: 'Unaware a contract exists until chased; no cross-rotation visibility.' },
  { id: 'r2', role: 'DCE', job: 'Create contracts, monitor all students, escalate at-risk cases.', gap: 'No continuity, manual templating, no aggregate dashboard.' },
  { id: 'r3', role: 'SCCE', job: 'Review objectives, add site expectations, confirm completion.', gap: 'Re-learns the platform each rotation; no student context on arrival.' },
];

interface GapRow extends Record<string, unknown> {
  id: string;
  area: string;
  severity: string;
  detail: string;
  fix: string;
}
const GAPS: GapRow[] = [
  { id: 'g1', area: 'No cross-rotation continuity', severity: 'critical', detail: 'Objectives completed in rotation 1 are invisible when building rotation 2; DCEs remember manually; students cannot build on previous goals.', fix: 'Templates auto-populate incomplete goals from the previous rotation; show cumulative attainment across the clinical year.' },
  { id: 'g2', area: 'Skills Checklist is disconnected', severity: 'critical', detail: 'Contracts set goals ("perform 10 IV insertions"); Skills tracks competency ("IV insertion: observed/performed") — the systems are not linked in either direction.', fix: 'Bi-directional link: completing a Skills item marks contract progress; objectives auto-suggest Skills items. No competitor has this closed loop.' },
  { id: 'g3', area: 'SCCE has no context on open', severity: 'high', detail: 'The supervisor sees a contract with no rotation number, program context or prior site history — every rotation feels like the first interaction.', fix: 'SCCE landing page: student, program, rotation number, prior feedback, DCE contact. Mobile-first, 60-second read.' },
  { id: 'g4', area: 'No mobile-ready contract signing', severity: 'high', detail: 'NPS 2025 student feedback: mobile navigation is hard. Signing is a milestone action that must complete on any device in under 2 minutes.', fix: 'Mobile-first signing: progressive disclosure, one section at a time, signature on the final screen — works in a clinical hallway.' },
  { id: 'g5', area: 'PD has no aggregate view', severity: 'high', detail: 'No dashboard shows common objectives, completion rates, students behind, or lowest-completing sites.', fix: 'Program dashboard: objective frequency heat map, completion by site/student/type, CAPTE + ACOTE evidence export.' },
  { id: 'g6', area: 'Midpoint check-in unstructured', severity: 'medium', detail: 'Midpoint reviews happen outside Exxat with no record and no reminders.', fix: 'Optional workflow: system reminder at midpoint, a 3-question progress form, timestamped note.' },
];

interface RiskRow extends Record<string, unknown> {
  id: string;
  persona: string;
  risk: string;
  points: string;
  design: string;
}
const PERSONA_RISK: RiskRow[] = [
  { id: 'scce', persona: 'SCCE', risk: 'Highest risk', points: 'Logs in once per rotation — the platform is always unfamiliar · no student context on arrival · mobile is the primary device in clinical settings; experience is desktop-only · related: preceptor eval length discourages completion (NPS 2025).', design: 'Landing page delivers full context in 60 seconds; mobile-first signing; one primary action per screen.' },
  { id: 'student', persona: 'Student', risk: 'High risk', points: 'Often unaware a contract exists until a follow-up email · no visibility into how objectives map to Skills Checklist items · cannot see cumulative progress across rotations · NPS 2025: mobile navigation hard for time-sensitive actions.', design: 'Contract summary on the clinical dashboard; progress bar per objective; mobile signing in 2 taps.' },
  { id: 'dce', persona: 'DCE', risk: 'Medium risk', points: 'Manual template selection, no history-based suggestion · no cross-rotation carryover — copies from the previous contract by hand · no alert when signatures or reviews stall · no aggregate objective view.', design: 'Contract queue sorted by action needed; template suggestions from the student profile; carryover built in.' },
];

interface PhaseRow extends Record<string, unknown> {
  id: string;
  phase: string;
  items: string;
}
const ROADMAP: PhaseRow[] = [
  { id: 'q2', phase: 'Q2 2026 · Foundation', items: 'Mobile-first signing for SCCE + Student · SCCE landing page with full student context · in-app notifications for contract milestones · cross-rotation objective carryover.' },
  { id: 'q3', phase: 'Q3 2026 · Integration', items: 'Skills Checklist bi-directional link · structured midpoint check-in · PD aggregate dashboard · reusable DCE objective bank.' },
  { id: 'q4', phase: 'Q4 2026 · Intelligence', items: 'AI objective suggestion from competency gaps · CAPTE / ACOTE goal-attainment export · site performance dashboard · longitudinal competency map across rotations.' },
];

export function LearningContractsView() {
  const [section, setSection] = useSection(SECTIONS, 'lifecycle');

  // Derived, not asserted: LC evidence per persona from the live corpus.
  const all = insightsWhere({ product: PRODUCT_ID });
  const personaRows = PERSONAS.map((p) => ({
    key: p.id,
    label: p.name,
    value: insightsWhere({ product: PRODUCT_ID, persona: p.id }).length,
    href: hrefInsights({ product: PRODUCT_ID, persona: p.id }),
  })).sort((a, b) => b.value - a.value);
  const top = personaRows[0];
  const scce = personaRows.find((r) => r.key === 'scce');
  const scceLeads = top?.key === 'scce';
  const caption = scceLeads
    ? `Computed from the corpus: SCCE leads the tagged count (${top?.value} of ${all.length}) — the volume agrees with the highest-risk call.`
    : `Computed from the corpus: ${top?.label} leads the tagged count (${top?.value} of ${all.length}), not SCCE (${scce?.value ?? 0}) — the SCCE-highest-risk claim below rests on qualitative severity, not evidence volume. Insights can carry multiple persona tags.`;

  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <SpecPageHeader
        title="Learning Contracts — spec archive"
        productId={PRODUCT_ID}
        claim="The sparseness is the finding: the thinnest evidence stream in the portfolio and zero dedicated discovery sessions, for a workflow that binds three parties every single rotation."
        meta="Synthesized from Day 4 Marriott, Day 5 FaaS and NPS 2025 signals — no dedicated discovery yet · 0 dated milestones · CAPTE / ACOTE evidence required"
        orienting={
          <Fig
            title="LC evidence by persona"
            n={all.length}
            caption={caption}
            link={{
              href: hrefInsights({ product: PRODUCT_ID, sort: 'newest' }),
              count: all.length,
              label: 'Learning Contracts findings, newest first',
            }}
          >
            <RankedList rows={personaRows} />
          </Fig>
        }
      />

      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />

      {section === 'lifecycle' && (
        <VStack gap={6}>
          <SpecSection title="Who does what — and where it breaks" sub="Roadmap and gaps on this page are a design proposal pending a dedicated discovery session and PM alignment.">
            <Table<RoleRow>
              data={ROLES}
              idKey="id"
              density="balanced"
              verticalAlign="top"
              columns={[
                { key: 'role', header: 'Role', width: pixel(120), renderCell: (r) => <Text type="body" weight="semibold">{r.role}</Text> },
                { key: 'job', header: 'Job', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.job}</Text> },
                { key: 'gap', header: 'Where it breaks', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.gap}</Text> },
              ]}
            />
          </SpecSection>
          <SpecSection title="Contract lifecycle" sub="Six stages; NPS marks stages with confirmed user verbatim from NPS 2025 data.">
            <Table<StageRow>
              data={LIFECYCLE}
              idKey="id"
              density="balanced"
              columns={[
                { key: 'stage', header: 'Stage', width: pixel(190), renderCell: (r) => (
                  <HStack gap={1.5} vAlign="center" wrap="wrap">
                    <Text type="body" weight="semibold">{r.stage}</Text>
                    {r.nps && <Badge variant="error" label="NPS" />}
                  </HStack>
                ) },
                { key: 'owner', header: 'Owner', width: pixel(150), renderCell: (r) => <Text type="supporting">{r.owner}</Text> },
                { key: 'action', header: 'Action', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.action}</Text> },
                { key: 'pain', header: 'Pain', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.pain}</Text> },
              ]}
            />
          </SpecSection>
        </VStack>
      )}

      {section === 'gaps' && (
        <SpecSection
          title="The missing link: Learning Contracts + Skills Checklist"
          sub="Connecting the two creates a closed-loop competency system — every contract objective maps to Skills items and completing one drives the other. No competitor has this."
        >
          <Table<GapRow>
            data={GAPS}
            idKey="id"
            density="balanced"
            columns={[
              { key: 'severity', header: 'Sev', width: pixel(90), renderCell: (r) => <Badge variant={r.severity === 'critical' ? 'error' : r.severity === 'high' ? 'warning' : 'info'} label={r.severity} /> },
              { key: 'area', header: 'Gap', width: pixel(210), renderCell: (r) => <Text type="body" weight="semibold">{r.area}</Text> },
              { key: 'detail', header: 'Detail', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.detail}</Text> },
              { key: 'fix', header: 'Fix', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.fix}</Text> },
            ]}
          />
          <Link href={hrefProduct('skills-checklist')} isStandalone>
            Skills Checklist hub — the other half of the closed loop →
          </Link>
        </SpecSection>
      )}

      {section === 'personas' && (
        <SpecSection title="Persona risk" sub="SCCE is judged highest-risk on severity (infrequent use, no mobile experience, no context on arrival) — the header chart shows evidence volume does not yet back this with dedicated sessions.">
          <Table<RiskRow>
            data={PERSONA_RISK}
            idKey="id"
            density="balanced"
            verticalAlign="top"
            columns={[
              { key: 'persona', header: 'Persona', width: pixel(110), renderCell: (r) => <Text type="body" weight="semibold">{r.persona}</Text> },
              { key: 'risk', header: 'Risk', width: pixel(120), renderCell: (r) => <Badge variant={r.risk === 'Highest risk' ? 'error' : r.risk === 'High risk' ? 'warning' : 'neutral'} label={r.risk} /> },
              { key: 'points', header: 'Why', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.points}</Text> },
              { key: 'design', header: 'Design direction', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.design}</Text> },
            ]}
          />
        </SpecSection>
      )}

      {section === 'roadmap' && (
        <SpecSection title="Proposed roadmap" sub="A design proposal, not committed scope — requires PM alignment before engineering handoff. Learning Contracts has 0 dated milestones in the registry.">
          <Table<PhaseRow>
            data={ROADMAP}
            idKey="id"
            density="balanced"
            verticalAlign="top"
            columns={[
              { key: 'phase', header: 'Phase', width: pixel(200), renderCell: (r) => <Text type="body" weight="semibold">{r.phase}</Text> },
              { key: 'items', header: 'Scope', width: proportional(4), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.items}</Text> },
            ]}
          />
        </SpecSection>
      )}

      <SpecFooter
        productId={PRODUCT_ID}
        extra={
          <Link href="/platform" isStandalone>
            ExxatOne platform north star →
          </Link>
        }
      />
    </VStack>
  );
}
