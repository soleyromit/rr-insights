// views/products/SkillsChecklistView.tsx — Skills Checklist spec archive (v18
// Astryx). The invented coverage radar and the fabricated student matrix are
// gone; the confirmed UX decisions they illustrated ("just the reds", the
// culminating slot) survive as text with their sources.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { SpecSection } from './spec/SpecSection';
import { DecisionCard } from './spec/DecisionCard';
import { StoryTable } from './spec/StoryTable';
import type { StoryRow } from './spec/StoryTable';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { SpecFooter } from './spec/SpecFooter';

const PRODUCT_ID = 'skills-checklist';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'domains', label: 'Domains' },
  { id: 'workflows', label: 'Workflows' },
  { id: 'accreditation', label: 'Accreditation' },
  { id: 'stories', label: 'Stories' },
];

const ARCH_DECISIONS = [
  {
    title: 'Skills as student program-level entity, not placement-specific',
    decision: 'A new entity sits above courses, placements and individual evaluations.',
    rationale: 'The current system cannot answer "Has student done skill X across all placements?" — skills are artificially constrained to placement boundaries, so 80–90% of students keep external tracking docs.',
    tradeoff: 'More complex data model; backward compatibility with the existing competency system; migration risk for existing clients.',
    source: 'Day 4 Marriott · Mar 5',
  },
  {
    title: 'Student-initiated evaluation, not preceptor-initiated',
    decision: 'The student decides when ready and requests sign-off from whoever supervised them that day.',
    rationale: 'Matches real clinical workflow — the supervisor of the moment may not be the main preceptor.',
    tradeoff: 'Some programs use preceptor-initiated or scheduled triggers; the system must support all trigger types.',
    source: 'Day 4 Marriott · Mar 5',
  },
  {
    title: 'Same backend, domain-specific UIs',
    decision: 'Nursing sees "Skills Tracking Dashboard", PA sees a clinical passport, social work sees competency management — one data model, different labels, workflows and scales.',
    rationale: 'Five documented domain models must work on one backend; forcing one UI on all five fails every discipline.',
    tradeoff: 'Frontend complexity and UX-drift risk. Mitigation: shared component library with a domain configuration layer.',
    source: 'Day 4 Marriott · Mar 5',
  },
  {
    title: 'Template-based cohort versioning',
    decision: 'Requirement changes apply to new cohorts, not existing students; old versions archive.',
    rationale: 'Accreditation standards change; Class of 2024 vs 2025 may carry different requirements.',
    tradeoff: 'Version management complexity; edge case: student changes program mid-cohort.',
    source: 'Day 4 Marriott · Mar 5',
  },
  {
    title: 'PDF auto-import for existing checklists',
    decision: 'AI imports 20+ years of paper/PDF checklists into the skill hierarchy.',
    rationale: '"Rebuild from scratch" friction is the primary adoption blocker.',
    tradeoff: 'AI accuracy is not 100% — human review workflow required; complex custom scales need manual mapping.',
    source: 'Day 4 Marriott · Mar 5',
  },
];

interface TriggerRow extends Record<string, unknown> {
  id: string;
  trigger: string;
  desc: string;
  programs: string;
}
const TRIGGERS: TriggerRow[] = [
  { id: 't1', trigger: 'Student-initiated', desc: 'Student decides when ready, selects preceptor; form routed for evaluation.', programs: 'PA, CVT, Rad Tech' },
  { id: 't2', trigger: 'Preceptor-initiated', desc: 'Supervisor identifies readiness and sends the evaluation form.', programs: 'PT, OT' },
  { id: 't3', trigger: 'Scheduled milestones', desc: 'Auto-triggers at week 5, end of rotation, end of program.', programs: 'Nursing' },
  { id: 't4', trigger: 'Event-triggered', desc: 'Patient log entry prompts a skill evaluation request — the most automated path.', programs: 'PA (target)' },
  { id: 't5', trigger: 'Emergency reassessment', desc: 'Incident report triggers immediate competency re-evaluation.', programs: 'All clinical disciplines' },
];

interface DomainRow extends Record<string, unknown> {
  id: string;
  name: string;
  skills: string;
  structure: string;
  trigger: string;
  graduation: string;
  evaluator: string;
  gap: string;
}
const DOMAINS: DomainRow[] = [
  { id: 'pa', name: 'PA Programs', skills: '15 core technical skills across all rotations', structure: 'Organized by rotation type (EM, family med, surgery); required vs optional marked per rotation.', trigger: 'Student logs patient → system prompts a skill evaluation request to the preceptor.', graduation: 'Clinical passport completion required for graduation clearance.', evaluator: 'Site preceptor, same day as the procedure', gap: 'Patient-logging trigger not yet integrated; USC passport model needs a digitization path.' },
  { id: 'nursing', name: 'Nursing (FNP/PNP/CRNA)', skills: '50+ skills organized by body systems and procedure types', structure: 'Rows = students, columns = skills; batch evaluation preferred; skills lab before clinical.', trigger: 'Scheduled milestones (week 5, end of rotation, end of program).', graduation: 'All required skills signed off; GPA threshold + skills together.', evaluator: 'Faculty (lab) + clinical preceptor (field)', gap: 'Batch evaluation UI not built; skills lab integration separate from clinical.' },
  { id: 'radtech', name: 'Radiation Technology', skills: '50+ X-ray procedures in a body-part → system → procedure hierarchy', structure: '"Does not meet / Meets / Exceeds / N/A" per procedure.', trigger: 'Student selects preceptor → form routes for evaluation.', graduation: '"Does the student demonstrate competence in this exam?" — final determination required.', evaluator: 'Preceptor at scan time', gap: 'The 4-level hierarchy is the hardest UX problem — a dropdown with 100+ items is unusable.' },
  { id: 'cvt', name: 'CVT (Cardiovascular Tech)', skills: 'Each competency includes detailed instructions and daily guidelines', structure: '20–30 questions per competency: patient interaction, communication, equipment, scrubbing, hemodynamic analysis.', trigger: 'Student performs procedure → selects preceptor → form routed.', graduation: 'Custom 0 / 5 / 7.5 / 9 / 10 scoring across all criteria; average determines pass.', evaluator: 'Preceptor, real-time', gap: 'Non-1-to-5 scoring requires configurable scale support — the highest-complexity domain.' },
  { id: 'sw', name: 'Social Work', skills: '9 EPAS competencies × 5 sub-areas (knowledge, values, skills, cognitive, affective)', structure: 'Skills evaluation maps to professional competencies; learning contract integration mandatory.', trigger: 'Pre-planned: contract commits → evaluation at midterm + final.', graduation: 'All 9 competency areas achieved + learning contract closed.', evaluator: 'Site supervisor (comments) + faculty coordinator (official ratings)', gap: 'Contract and evaluation must sit side-by-side; the current system separates them.' },
];

interface MethodRow extends Record<string, unknown> {
  id: string;
  method: string;
  programs: string;
  note: string;
}
const METHODS: MethodRow[] = [
  { id: 'm1', method: 'Binary (Yes/No + signature)', programs: 'PA, PT, PTA', note: 'Simple procedure completion — the USC PA passport model.' },
  { id: 'm2', method: 'Scaled (1–5 or custom)', programs: 'Nursing, CVT, Social Work', note: 'CVT uses 0/5/7.5/9/10 across 30 criteria per competency.' },
  { id: 'm3', method: 'Rubric-based', programs: 'PA, Nursing, OT', note: 'Multi-dimension scoring with critical task marking for OSCE-linked skills.' },
  { id: 'm4', method: 'Narrative feedback', programs: 'Social Work, PT', note: 'Qualitative comments with structured prompts, aligned to learning contracts.' },
  { id: 'm5', method: 'Self-assessment + validation', programs: 'PT, PA, Nursing', note: 'Student rates first; preceptor confirms or overrides.' },
  { id: 'm6', method: 'Physical signature (passport)', programs: 'PA (USC model)', note: 'Paper passport digitized: 15 core technical skills across all rotations.' },
];

const WORKFLOWS = [
  { title: 'Clinical passport (PA — USC model)', steps: ['Student performs procedure at the clinical site', 'Student logs the patient encounter', 'System detects an eligible procedure and prompts a skill evaluation request', 'Student selects the preceptor who supervised', 'Preceptor gets a mobile notification — verifies and signs', 'Skill logs against the passport; progress bar updates', 'DCE views the graduation clearance dashboard — red flags for students under minimums'] },
  { title: 'Nursing batch evaluation (faculty-led)', steps: ['Faculty opens the Skills Dashboard — rows = students, columns = skills', 'Selects a skill; batch assessment mode opens', 'Per student: observed / not observed / needs repeat in one pass', 'Submits the batch — all 40 students update simultaneously', 'PD sees the cohort aggregate ("38/40 achieved hand washing")', 'At-risk students surface with an intervention recommendation'] },
  { title: 'Social work learning contract + evaluation', steps: ['Pre-placement: student, preceptor and faculty agree the contract (9 EPAS competencies)', 'Student defines tasks per competency area', 'All parties sign — the contract is a living document', 'Midterm: evaluation opens side-by-side with the contract commitments', 'Site supervisor comments per competency; faculty coordinator rates officially', 'Final evaluation repeats; contract closes when all competencies are achieved'] },
  { title: 'Graduation clearance (program-level)', steps: ['Program sets minimum counts per skill (e.g. 3× venipuncture)', 'System accumulates across ALL placements, not per rotation', 'Deficiency filter shows only students under threshold ("just the reds")', 'DCE alerted 8 weeks before the graduation deadline', 'Student completes missing procedures in the 10th/culminating rotation', 'One-click accreditation-ready report: all students × skills × sign-offs'] },
];

interface AccredRow extends Record<string, unknown> {
  id: string;
  body: string;
  standard: string;
  detail: string;
  report: string;
}
const ACCRED: AccredRow[] = [
  { id: 'capte', body: 'CAPTE (PT/PTA)', standard: 'Clinical Performance Instrument (CPI)', detail: '18 performance criteria; entry-level performance by graduation; CPI Web is the digital form — Exxat must map to the CPI taxonomy.', report: 'All 18 criteria achieved per student + cohort aggregate' },
  { id: 'acote', body: 'ACOTE (OT)', standard: 'Fieldwork Performance Evaluation (FWPE)', detail: '27-item rating scale completed by the fieldwork supervisor; Level II fieldwork = 24 weeks full-time supervised practice.', report: 'FWPE scores + hours log per student' },
  { id: 'arcpa', body: 'ARC-PA (PA)', standard: 'Program-defined competencies', detail: '9 mandated competency areas; clinical passport for procedure minimums; evidence that competencies were communicated AND assessed AND reported; summative OSCE in the last 4 months.', report: 'Passport completion + OSCE results + EOR z-scores (Ed Razenbach)' },
  { id: 'ccne', body: 'CCNE (Nursing)', standard: 'QSEN competencies + program outcomes', detail: 'Patient safety, EBP, teamwork, informatics, QI — all mapped to clinical and didactic activities: "has every student demonstrated this at least once?"', report: 'Competency achievement by student by area' },
  { id: 'cswe', body: 'CSWE (Social Work)', standard: 'EPAS 2022 — 9 competencies × 5 sub-areas', detail: '45+ trackable items minimum across professional identity, ethics, justice, research, policy, engagement, assessment, intervention, evaluation.', report: 'All 9 competencies per student + contract closure per placement' },
  { id: 'monster', body: 'Dr. T (Touro) request', standard: 'Monster Grid', detail: 'Didactic + SPAC + clinical data in one consolidated view; PAEA export + ExamSoft integration; bulk upload for external sources.', report: 'Excel export: students × data points × placements, filterable to "only deficient students"' },
];

const STORIES: StoryRow[] = [
  { id: 'SC-01', who: 'Student (PA)', what: 'log a completed procedure and immediately request preceptor sign-off on mobile', why: 'logging while the preceptor is still present is the only reliable workflow', source: 'Day 4 Marriott · Mar 5' },
  { id: 'SC-02', who: 'Student (any)', what: 'see my complete skills progress across all placements in one view', why: '"How many venipunctures total?" currently requires navigating 8 separate forms', source: 'Day 4 Marriott · Mar 5' },
  { id: 'SC-03', who: 'Preceptor (mobile)', what: 'verify a student skill with a single tap and signature, no account setup', why: 'any friction and preceptors stop signing — the data goes incomplete', source: 'Day 4 Marriott · Mar 5' },
  { id: 'SC-04', who: 'Faculty (Nursing)', what: 'assess 40 students on one skill in a single batch session', why: 'one-at-a-time forms waste 90 minutes per skill', source: 'Day 4 Marriott · Mar 5' },
  { id: 'SC-05', who: 'DCE', what: 'see which students are below minimum procedure counts 8 weeks before clearance', why: 'finding gaps the week before graduation is too late', source: 'Dr. T Touro · Mar 11' },
  { id: 'SC-06', who: 'Program Director', what: 'generate an accreditation-ready competency report in one click', why: 'the manual download-merge-format cycle repeats every accreditation cycle', source: 'Day 4 Marriott · Mar 5' },
  { id: 'SC-07', who: 'Social Work student', what: 'see my learning contract side-by-side with my evaluation form', why: 'the contract defines success; the evaluation measures it', source: 'Day 4 Marriott · Mar 5' },
  { id: 'SC-08', who: 'Admin', what: 'import an existing PDF checklist and get the skill hierarchy auto-generated', why: 'rebuilding from scratch is the primary adoption blocker', source: 'Day 4 Marriott · Mar 5' },
];

export function SkillsChecklistView() {
  const [section, setSection] = useSection(SECTIONS, 'overview');
  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="Skills Checklist — spec archive"
        lede="Clinical competency tracking across 6+ disciplines — the richest requirements document in the corpus (Day 4 Marriott: 80+ requirements)."
        meta="Q2 2026 requirements + prototyping · Q3–Q4 development · Jan 1 2027 launch · competitors: Typhon, CompetencyAI, eValue, CORE, Excel"
      />
      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />

      {section === 'overview' && (
        <VStack gap={6}>
          <SpecSection title="The core problem in one sentence" sub="Current vs target state — Day 4 Marriott (Mar 5).">
            <Grid columns={{ minWidth: 340, max: 2 }} gap={3}>
              <Card variant="muted" padding={3}>
                <VStack gap={1}>
                  <Badge variant="error" label="Current state" />
                  <Text type="supporting" as="p" textWrap="pretty">
                    Skills are locked inside individual placement forms. Nobody can answer "has this student completed
                    venipuncture at least once across all 8 rotations?" — so 80–90% of students build external tracking docs,
                    and faculty cannot see cohort-level competency achievement.
                  </Text>
                </VStack>
              </Card>
              <Card variant="muted" padding={3}>
                <VStack gap={1}>
                  <Badge variant="success" label="Target state" />
                  <Text type="supporting" as="p" textWrap="pretty">
                    Skills exist at student program level — a cross-cutting entity above courses, placements and evaluations.
                    Student initiates assessment when ready; totals aggregate across all placements automatically; the
                    graduation clearance dashboard flags at-risk students weeks before the deadline.
                  </Text>
                </VStack>
              </Card>
            </Grid>
          </SpecSection>
          <SpecSection
            title='"Just the reds" — the confirmed procedure-tracker decision'
            sub="Dr. T, Touro PA · Mar 11 · session 92bef6ba. A toggle that shows ONLY deficient students (threshold: 3 per procedure), defaulting to reds-only on load — an action view, not an overview. Cell color bands: below threshold / near (3–5) / well above (6+)."
          >
            <Blockquote cite="Dr. T · Touro PA program · session 92bef6ba">
              I just want the reds. Just the students missing their procedure minimums.
            </Blockquote>
            <Card variant="muted" padding={3}>
              <Text type="supporting" as="p" textWrap="pretty">
                Edge case, same session: "We need a space where if a student comes back and says I never did an IV on all my
                clinicals." The checklist must support an overflow/culminating rotation slot (rotation 10 at Touro) where
                missed procedures are logged retroactively — a known scenario, not a theoretical one.
              </Text>
            </Card>
          </SpecSection>
          <SpecSection
            title="Transcript-grounded gaps"
            sub="Day 4 Marriott (5890b614 · Mar 5): skills are program-scoped goals, NOT placement-scoped — any skill can be satisfied in any placement; PA uses a procedure-based passport model while higher-degree programs track confidence and competency — both models must be supported; and students trigger their own evaluation when they feel ready — fundamentally different from faculty-initiated evaluation."
          >
            <HStack gap={2} wrap="wrap">
              <Badge variant="error" label="critical · program-scoped, not placement-scoped" />
              <Badge variant="warning" label="high · passport AND competency models" />
              <Badge variant="warning" label="high · student-initiated trigger" />
            </HStack>
          </SpecSection>
        </VStack>
      )}

      {section === 'architecture' && (
        <VStack gap={6}>
          <SpecSection title="Architecture decisions" sub="Not suggestions — the decided approach. Arun owns technical, Vishaka leads UX.">
            <Grid columns={{ minWidth: 380, max: 2 }} gap={3}>
              {ARCH_DECISIONS.map((d) => (
                <DecisionCard key={d.title} {...d} />
              ))}
            </Grid>
          </SpecSection>
          <SpecSection title="Trigger mechanism matrix" sub="All five trigger types must be supported per program.">
            <Table<TriggerRow>
              data={TRIGGERS}
              idKey="id"
              density="balanced"
              columns={[
                { key: 'trigger', header: 'Trigger', width: pixel(180), renderCell: (r) => <Text type="body" weight="semibold">{r.trigger}</Text> },
                { key: 'desc', header: 'Behavior', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.desc}</Text> },
                { key: 'programs', header: 'Used by', width: pixel(180), renderCell: (r) => <Text type="supporting">{r.programs}</Text> },
              ]}
            />
          </SpecSection>
        </VStack>
      )}

      {section === 'domains' && (
        <VStack gap={6}>
          <SpecSection title="Five domain models, one backend" sub="The hardest design challenge: one architecture, five completely different UX surfaces. Day 4 Marriott · Mar 5.">
            <VStack gap={3}>
              {DOMAINS.map((d) => (
                <Card key={d.id} padding={4}>
                  <VStack gap={2}>
                    <Text type="body" weight="semibold">
                      {d.name}
                    </Text>
                    <Grid columns={{ minWidth: 260, max: 2 }} gap={2}>
                      {[
                        ['Skills scope', d.skills],
                        ['Structure', d.structure],
                        ['Trigger', d.trigger],
                        ['Graduation link', d.graduation],
                        ['Primary evaluator', d.evaluator],
                      ].map(([label, val]) => (
                        <VStack key={label} gap={0.5}>
                          <Text type="label" color="secondary">
                            {label}
                          </Text>
                          <Text type="supporting" as="p" textWrap="pretty">
                            {val}
                          </Text>
                        </VStack>
                      ))}
                    </Grid>
                    <HStack gap={2} vAlign="center">
                      <Badge variant="error" label="design gap" />
                      <Text type="supporting" as="p" textWrap="pretty">
                        {d.gap}
                      </Text>
                    </HStack>
                  </VStack>
                </Card>
              ))}
            </VStack>
          </SpecSection>
          <SpecSection title="Evaluation method registry" sub="All six approaches must be configurable per program.">
            <Table<MethodRow>
              data={METHODS}
              idKey="id"
              density="balanced"
              columns={[
                { key: 'method', header: 'Method', width: pixel(230), renderCell: (r) => <Text type="body">{r.method}</Text> },
                { key: 'programs', header: 'Used by', width: pixel(190), renderCell: (r) => <Text type="supporting">{r.programs}</Text> },
                { key: 'note', header: 'Notes', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.note}</Text> },
              ]}
            />
          </SpecSection>
        </VStack>
      )}

      {section === 'workflows' && (
        <SpecSection title="Core workflows" sub="Clinical passport, nursing batch evaluation, social work contract integration, graduation clearance — Day 4 Marriott + Dr. T Touro.">
          <Grid columns={{ minWidth: 380, max: 2 }} gap={3}>
            {WORKFLOWS.map((w) => (
              <Card key={w.title} padding={4}>
                <VStack gap={1.5}>
                  <Text type="body" weight="semibold">
                    {w.title}
                  </Text>
                  {w.steps.map((s, i) => (
                    <HStack key={i} gap={2} vAlign="center">
                      <Badge variant="neutral" label={String(i + 1)} />
                      <Text type="supporting" as="p" textWrap="pretty">
                        {s}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Card>
            ))}
          </Grid>
        </SpecSection>
      )}

      {section === 'accreditation' && (
        <SpecSection title="Accreditor requirements" sub="Different standard names, same underlying need: prove students can perform clinical skills before graduation. All evidence must be program-level, not placement-level.">
          <Table<AccredRow>
            data={ACCRED}
            idKey="id"
            density="balanced"
            columns={[
              { key: 'body', header: 'Body', width: pixel(150), renderCell: (r) => <Text type="body" weight="semibold">{r.body}</Text> },
              { key: 'standard', header: 'Instrument', width: pixel(210), renderCell: (r) => <Text type="supporting">{r.standard}</Text> },
              { key: 'detail', header: 'Detail', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.detail}</Text> },
              { key: 'report', header: 'Report required', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.report}</Text> },
            ]}
          />
        </SpecSection>
      )}

      {section === 'stories' && (
        <SpecSection title="User stories" sub="High confidence after Day 4 Marriott (Mar 5) and Dr. T Touro (Mar 11); multi-discipline coverage.">
          <StoryTable rows={STORIES} />
        </SpecSection>
      )}

      <SpecFooter productId={PRODUCT_ID} />
    </VStack>
  );
}
