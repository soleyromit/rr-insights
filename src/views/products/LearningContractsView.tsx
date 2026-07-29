// views/products/LearningContractsView.tsx — Learning Contracts spec archive
// (v18 Astryx). Stacked sections (the page is small enough to read top to
// bottom); the misplaced ExactOne north-star tab moved to /platform.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { SpecSection } from './spec/SpecSection';
import { SpecFooter } from './spec/SpecFooter';
import { hrefProduct } from '../../lib/links';

const PRODUCT_ID = 'learning-contracts';

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

const PERSONA_RISK = [
  { persona: 'SCCE', risk: 'Highest risk', points: ['Logs in once per rotation — the platform is always unfamiliar', 'No student context on arrival', 'Mobile is the primary device in clinical settings; experience is desktop-only', 'Related: preceptor eval length discourages completion (NPS 2025)'], design: 'Landing page delivers full context in 60 seconds; mobile-first signing; one primary action per screen.' },
  { persona: 'Student', risk: 'High risk', points: ['Often unaware a contract exists until a follow-up email', 'No visibility into how objectives map to Skills Checklist items', 'Cannot see cumulative progress across rotations', 'NPS 2025: mobile navigation hard for time-sensitive actions'], design: 'Contract summary on the clinical dashboard; progress bar per objective; mobile signing in 2 taps.' },
  { persona: 'DCE', risk: 'Medium risk', points: ['Manual template selection, no history-based suggestion', 'No cross-rotation carryover — copies from the previous contract by hand', 'No alert when signatures or reviews stall', 'No aggregate objective view'], design: 'Contract queue sorted by action needed; template suggestions from the student profile; carryover built in.' },
];

const ROADMAP = [
  { phase: 'Q2 2026 · Foundation', items: ['Mobile-first signing for SCCE + Student', 'SCCE landing page with full student context', 'In-app notifications for contract milestones', 'Cross-rotation objective carryover'] },
  { phase: 'Q3 2026 · Integration', items: ['Skills Checklist bi-directional link', 'Structured midpoint check-in', 'PD aggregate dashboard', 'Reusable DCE objective bank'] },
  { phase: 'Q4 2026 · Intelligence', items: ['AI objective suggestion from competency gaps', 'CAPTE / ACOTE goal-attainment export', 'Site performance dashboard', 'Longitudinal competency map across rotations'] },
];

export function LearningContractsView() {
  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="Learning Contracts — spec archive"
        lede="Three parties, one agreement, every rotation: student objectives formalized with the DCE (academic side) and SCCE (clinical side), linked to competency frameworks for accreditation evidence."
        meta="0 dedicated discovery sessions yet — synthesized from Day 4 Marriott, Day 5 FaaS and NPS 2025 signals · CAPTE / ACOTE evidence required"
      />

      <SpecSection title="Who does what — and where it breaks" sub="Roadmap and gaps below are a design proposal pending a dedicated discovery session and PM alignment.">
        <Grid columns={{ minWidth: 260, max: 3 }} gap={3}>
          {[
            { role: 'Student', job: 'Review and acknowledge objectives; track own progress.', gap: 'Unaware a contract exists until chased; no cross-rotation visibility.' },
            { role: 'DCE', job: 'Create contracts, monitor all students, escalate at-risk cases.', gap: 'No continuity, manual templating, no aggregate dashboard.' },
            { role: 'SCCE', job: 'Review objectives, add site expectations, confirm completion.', gap: 'Re-learns the platform each rotation; no student context on arrival.' },
          ].map((p) => (
            <Card key={p.role} variant="muted" padding={3}>
              <VStack gap={1}>
                <Text type="body" weight="semibold">
                  {p.role}
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  Job: {p.job}
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  Gap: {p.gap}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
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
          Skills Checklist product hub →
        </Link>
      </SpecSection>

      <SpecSection title="Persona risk" sub="SCCE is the highest-risk persona: infrequent use, no mobile experience, no context on arrival.">
        <Grid columns={{ minWidth: 300, max: 3 }} gap={3}>
          {PERSONA_RISK.map((p) => (
            <Card key={p.persona} padding={3}>
              <VStack gap={1.5}>
                <HStack gap={2} vAlign="center">
                  <Text type="body" weight="semibold">
                    {p.persona}
                  </Text>
                  <Badge variant={p.risk === 'Highest risk' ? 'error' : p.risk === 'High risk' ? 'warning' : 'neutral'} label={p.risk} />
                </HStack>
                {p.points.map((pt, i) => (
                  <Text key={i} type="supporting" as="p" textWrap="pretty">
                    {pt}
                  </Text>
                ))}
                <Text type="supporting" as="p" textWrap="pretty">
                  Design direction: {p.design}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </SpecSection>

      <SpecSection title="Proposed roadmap" sub="A design proposal, not committed scope — requires PM alignment before engineering handoff.">
        <Grid columns={{ minWidth: 260, max: 3 }} gap={3}>
          {ROADMAP.map((ph) => (
            <Card key={ph.phase} variant="muted" padding={3}>
              <VStack gap={1.5}>
                <Text type="body" weight="semibold">
                  {ph.phase}
                </Text>
                {ph.items.map((it, i) => (
                  <Text key={i} type="supporting" as="p" textWrap="pretty">
                    {it}
                  </Text>
                ))}
              </VStack>
            </Card>
          ))}
        </Grid>
      </SpecSection>

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
