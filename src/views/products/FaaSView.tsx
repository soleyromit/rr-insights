// views/products/FaaSView.tsx — FaaS 2.0 spec archive (v18 Astryx).
// URL-synced sections replace the hidden tab bar; the invented monthly ticket
// trend is gone (only the sourced 95k/yr figure survives).
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../../components/ui/PageHeader';
import { Fig } from '../../components/charts/Fig';
import { RankedList } from '../../components/charts/RankedList';
import { SpecSection } from './spec/SpecSection';
import { DecisionCard } from './spec/DecisionCard';
import { StoryTable } from './spec/StoryTable';
import type { StoryRow } from './spec/StoryTable';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { SpecFooter } from './spec/SpecFooter';

const PRODUCT_ID = 'faas';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'controls', label: 'Controls + UX gaps' },
  { id: 'scope', label: 'Q2 scope + stories' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'decisions', label: 'Decisions' },
];

const USAGE = [
  { key: 'nursing', label: 'Nursing (FNP/PNP)', value: 31, hint: '4-level hierarchy, repeater controls — High complexity' },
  { key: 'pa', label: 'PA Programs', value: 22, hint: 'Simple layouts, clone-heavy workflow — Low complexity' },
  { key: 'crna', label: 'CRNA', value: 18, hint: 'Matrix + time pickers, complex dependencies — Very High' },
  { key: 'ptot', label: 'PT/OT', value: 17, hint: 'CPI/FWPE format, competency mapping — Medium' },
  { key: 'slp', label: 'SLP', value: 12, hint: 'Matrix-heavy, document upload, 999hr time pickers — High' },
];

interface ControlRow extends Record<string, unknown> {
  id: string;
  type: string;
  category: string;
  status: 'Stable' | 'Bug' | 'Critical';
  issues: string;
}
const CONTROLS: ControlRow[] = [
  { id: 'c1', type: 'Date picker', category: 'Basic', status: 'Stable', issues: 'None' },
  { id: 'c2', type: 'Dropdown', category: 'Basic', status: 'Stable', issues: 'Long ICD/CPT strings display poorly' },
  { id: 'c3', type: 'Free text', category: 'Basic', status: 'Stable', issues: 'None' },
  { id: 'c4', type: 'Multi checkbox', category: 'Basic', status: 'Stable', issues: 'Chip display inconsistent vs plain text' },
  { id: 'c5', type: 'Numeric box', category: 'Basic', status: 'Bug', issues: 'Limits only validated on submit, not real-time' },
  { id: 'c6', type: 'Radio', category: 'Basic', status: 'Stable', issues: 'None' },
  { id: 'c7', type: 'Search / Lookup (ICD/CPT)', category: 'Basic', status: 'Critical', issues: 'Delete button unclear, selected items not chip-styled, Observed vs Performed clunky' },
  { id: 'c8', type: 'Matrix layout', category: 'Advanced', status: 'Critical', issues: 'Creation flow confusing — users cannot tell where new questions land; 7+ radio options per row breaks layout' },
  { id: 'c9', type: 'Repeater controls', category: 'Advanced', status: 'Bug', issues: 'No guidance on when/how to use; unlimited additions with no visual limit' },
  { id: 'c10', type: 'Hierarchical dependencies', category: 'Advanced', status: 'Bug', issues: 'CRNA 4-level nesting (comprehensive → pediatric → intrathoracic → heart) renders poorly' },
  { id: 'c11', type: 'Time duration calculator', category: 'Specialized', status: 'Stable', issues: '99hr vs 999hr variants — backend difference invisible to creators' },
  { id: 'c12', type: 'Code dropdown (ICD/CPT)', category: 'Specialized', status: 'Critical', issues: 'Long text strings, poor chip display, broken delete UX' },
];

interface GapRow extends Record<string, unknown> {
  id: string;
  area: string;
  severity: string;
  who: string;
  detail: string;
}
const UX_GAPS: GapRow[] = [
  { id: 'g1', area: 'ICD/CPT lookup display', severity: 'critical', who: 'Prasanjit (Mar 25)', detail: 'Selected codes display as long text strings; delete buttons unclear; Observed vs Performed toggle clunky. Selected options should be chips.' },
  { id: 'g2', area: 'Matrix creation confusion', severity: 'critical', who: 'Prasanjit (Mar 25)', detail: 'Form creators cannot tell where new questions will be added; no preview of the student-side render; 7+ radio options per row overwhelms.' },
  { id: 'g3', area: 'Color coding lost', severity: 'high', who: 'Prasanjit (Mar 25)', detail: 'Previously: patient demographics in distinct colors, surgical vs clinical indentation. Now monochromatic — students cannot identify which section they are in.' },
  { id: 'g4', area: 'Validation timing', severity: 'high', who: 'Prasanjit (Mar 25)', detail: 'Mandatory-field errors and numeric limits (>100 minutes) only surface at submit. No real-time feedback — a WCAG 3.3.1 failure on top of a UX one.' },
  { id: 'g5', area: 'Self-service blocked', severity: 'high', who: 'Akshit (Mar 25)', detail: 'Universities cannot create or edit forms independently — intentionally disabled for stability. All customization goes through the internal team.' },
  { id: 'g6', area: 'Multi-select inconsistency', severity: 'medium', who: 'Prasanjit (Mar 25)', detail: 'Some fields show chips, others plain text — inconsistent selection states across similar controls in the same form.' },
  { id: 'g7', area: 'Sticky feedback panel', severity: 'medium', who: 'Prasanjit (Mar 25)', detail: 'Feedback panel does not stay sticky on scroll; section indicators do not update with scroll position.' },
  { id: 'g8', area: 'No field-level feedback', severity: 'medium', who: 'Prasanjit (Mar 25)', detail: 'Only general form-level comments exist; supervisors need granular annotations (e.g. on a specific ICD code).' },
];

const TRANSCRIPT_GAPS = [
  { src: 'Harsha (9f1f5f4f Mar 20)', sev: 'critical', gap: 'FaaS looks like an outlier inside host modules. Must be headless-first: form components inherit the host module visual language. A technical architecture requirement, not a style preference.' },
  { src: 'Harsha (9f1f5f4f Mar 20)', sev: 'critical', gap: 'No simulator/preview mode. Errors surface when students submit 2–3 months after setup. Need live preview with sample data and a test mode before publishing.' },
  { src: 'Aarti (f29a990d Mar 20)', sev: 'critical', gap: 'The 3-pane form builder is inaccessible. "To find out later it is not accessible — reworking is very hard." Title II deadline April 24 applies to FaaS too.' },
  { src: 'Harsha (9f1f5f4f Mar 20)', sev: 'high', gap: 'Manual free-text tag entry for CAS-FAST mapping silently corrupts data — a misspelled tag breaks business logic with no visible error until student submission. Need structured dropdown autocomplete.' },
  { src: 'Prasanjit (13352a23 Mar 25)', sev: 'high', gap: 'Section scroll sync is broken — "I have moved to diagnosis but it has not moved." Section identity is completely lost.' },
];

interface Q2Row extends Record<string, unknown> {
  id: string;
  feature: string;
  target: string;
  timeline: string;
  detail: string;
}
const Q2_SCOPE: Q2Row[] = [
  { id: 'q1', feature: 'Internal self-service (Phase 1)', target: 'CI team / CIC exec / page server', timeline: 'Q2 2026', detail: 'Adding questions, editing existing questions, adding options — workflows currently hard-coded by the tech team.' },
  { id: 'q2', feature: 'Form library first', target: 'All modules', timeline: 'Q2 2026', detail: '80–85% of forms are incremental changes; ~90% start from predefined templates. Template-first is the default.' },
  { id: 'q3', feature: 'Real-time validation', target: 'Student form-filler', timeline: 'Q2 2026', detail: 'Mandatory-field errors inline, numeric limit validation as the user types.' },
  { id: 'q4', feature: 'ICD/CPT chip display', target: 'Student form-filler', timeline: 'Q2 2026', detail: 'Selected codes as chips with clear delete; Observed vs Performed as a clean toggle.' },
  { id: 'q5', feature: 'Section color coding restore', target: 'Student + faculty', timeline: 'Q2 2026', detail: 'Restore configurable section colors and indentation — a lost capability per Prasanjit.' },
  { id: 'q6', feature: 'Limited end-user rollout', target: 'Programs', timeline: 'Q3 2026', detail: 'Incremental exposure; observe patterns before full rollout; complex actions deferred.' },
  { id: 'q7', feature: 'Drag-and-drop form builder', target: 'Admin', timeline: 'Q3+ 2026', detail: 'Frontend constraints; incremental implementation as capacity allows.' },
];

const STORIES: StoryRow[] = [
  { id: 'FS-01', who: 'Student (form filler)', what: 'see inline validation errors as I type, not only on submit', why: 'numeric limits validated only at submit waste time and violate WCAG 3.3.1', source: 'Prasanjit (Mar 25)' },
  { id: 'FS-02', who: 'Student (form filler)', what: 'see selected ICD/CPT codes as chips with a clear remove action', why: 'long text strings are unreadable and delete is poorly positioned', source: 'Prasanjit (Mar 25)' },
  { id: 'FS-03', who: 'Student (form filler)', what: 'identify which section I am in by color or visual marker', why: 'the monochromatic interface makes sections indistinguishable', source: 'Prasanjit (Mar 25)' },
  { id: 'FS-04', who: 'Student (form filler)', what: 'see supervisor feedback at the field level, not just general comments', why: 'supervisors need to annotate specific ICD code choices', source: 'Prasanjit (Mar 25)' },
  { id: 'FS-05', who: 'Admin (form creator)', what: 'see a live preview of my matrix layout before saving', why: 'creators cannot tell where new questions land or how students see them', source: 'Prasanjit (Mar 25)' },
  { id: 'FS-06', who: 'Admin (form creator)', what: 'create a form from an existing template in under 3 clicks', why: '80–85% of forms are incremental changes', source: 'Akshit (Mar 25)' },
  { id: 'FS-07', who: 'Admin (form creator)', what: 'add a question to an existing form without the internal tech team', why: 'self-service is blocked for stability; Phase 1 targets internal users', source: 'Akshit (Mar 25)' },
  { id: 'FS-08', who: 'Supervisor (reviewer)', what: 'leave annotated feedback on a specific field in a submission', why: 'field-level comments are missing entirely', source: 'Prasanjit (Mar 25)' },
];

const MODULES = [
  { id: 'm1', module: 'Patient Log (Prism)', adds: 'ICD/CPT lookups, specialized visualizations, procedure tracking triggers', provides: 'Form rendering, validation, section logic' },
  { id: 'm2', module: 'Evaluations (Prism)', adds: 'Competency mapping, approval workflows, DCE review queue', provides: 'Rating scales, rubric controls, scoring formulas' },
  { id: 'm3', module: 'Surveys', adds: 'Distribution lists, response analytics, scheduling', provides: 'Question types, conditional logic, basic reporting' },
  { id: 'm4', module: 'Site Assessment', adds: 'Site profile integration, accreditation PDF export', provides: 'Form controls, e-signature, document upload' },
  { id: 'm5', module: 'Compliance (CAS)', adds: 'Expiration date intelligence, approval queue, audit trail', provides: 'Form fields, tag mapping, document collection' },
];

const DECISIONS = [
  {
    title: 'Template-first creation flow, not blank canvas',
    decision: 'The default entry point for form creation is the form library, not a blank builder.',
    rationale: '80–85% of forms are incremental changes; only 2–3% are built from scratch. Akshit: "Show form library prominently based on module context. Reduce user clicks."',
    tradeoff: 'Power users may feel constrained. Progressive disclosure: library first, advanced builder accessible but not default.',
    source: 'Akshit Q2 session · Mar 25',
  },
  {
    title: 'Phase 1: internal users only for self-service',
    decision: 'Q2 self-service editing restricted to CI team, CIC exec, and page server team — not external university admins.',
    rationale: 'Self-service was previously enabled and then disabled over stability. Guardrails first; incremental exposure.',
    tradeoff: 'Limits short-term adoption; universities still route changes through the internal team; power users may be frustrated.',
    source: 'Akshit Q2 session · Mar 25',
  },
  {
    title: 'Restore section color coding as a first-class feature',
    decision: 'Section colors and indentation are a configurable property in FaaS 2.0, not removed for simplicity.',
    rationale: 'CRNA and nursing programs rely on visual section differentiation for 4-level hierarchical forms; the monochromatic migration reduced comprehension.',
    tradeoff: 'Adds builder complexity. Mitigation: preset color themes per discipline, not free-pick RGB. Color + icon + label (WCAG 1.4.1 — never color alone).',
    source: 'Prasanjit Patient Log session · Mar 25',
  },
  {
    title: 'Real-time validation, not submit-time validation',
    decision: 'Mandatory-field errors and numeric limits appear inline (on blur), with limits shown as helper text before typing.',
    rationale: 'Submit-only errors force re-scrolling and violate WCAG 3.3.1 (error identified and described immediately). SurveyMonkey, Typeform and Google Forms all validate inline — the baseline users arrive with.',
    tradeoff: 'More front-end state management; matrix and hierarchical controls need per-row validation scoping.',
    source: 'Prasanjit Patient Log session · Mar 25',
  },
];

function Overview() {
  return (
    <VStack gap={6}>
      <SpecSection
        title="The numbers behind the fire"
        sub="17,000+ configured forms across 11 types · 95,000 annual support tickets · NPS 2/5 · 37 admin NPS detractors (navigation and click-depth) · 629 student detractors (preceptor eval length + mobile gaps) · 80–85% of form changes are incremental edits."
      >
        <Fig
          title="Usage by clinical discipline"
          caption="Share of Patient Log usage with complexity per discipline (Prasanjit, Mar 25). CRNA is the smallest share but the highest complexity — its 4-level hierarchies break the current controls."
        >
          <RankedList rows={USAGE} format={(r) => `${r.value}%`} />
        </Fig>
      </SpecSection>
      <SpecSection title="Transcript-grounded gaps" sub="From raw session analysis Mar 26 — each gap traces to a named speaker and session.">
        <VStack gap={2}>
          {TRANSCRIPT_GAPS.map((g, i) => (
            <Card key={i} padding={3}>
              <VStack gap={1}>
                <HStack gap={2} vAlign="center" wrap="wrap">
                  <Badge variant={g.sev === 'critical' ? 'error' : 'warning'} label={g.sev} />
                  <Text type="supporting">{g.src}</Text>
                </HStack>
                <Text type="body" as="p" textWrap="pretty">
                  {g.gap}
                </Text>
              </VStack>
            </Card>
          ))}
        </VStack>
      </SpecSection>
    </VStack>
  );
}

function Controls() {
  const counts = {
    Critical: CONTROLS.filter((c) => c.status === 'Critical').length,
    Bug: CONTROLS.filter((c) => c.status === 'Bug').length,
    Stable: CONTROLS.filter((c) => c.status === 'Stable').length,
  };
  return (
    <VStack gap={6}>
      <SpecSection
        title="Control type registry"
        sub={`All 12 deployed control types: ${counts.Critical} critical, ${counts.Bug} with bugs, ${counts.Stable} stable. Critical = blocks publish-quality work. Sources: Prasanjit (Mar 25), Harsha (Mar 20).`}
      >
        <Table<ControlRow>
          data={CONTROLS}
          idKey="id"
          density="compact"
          columns={[
            { key: 'type', header: 'Control', width: pixel(210), renderCell: (r) => <Text type="body">{r.type}</Text> },
            { key: 'category', header: 'Category', width: pixel(110), renderCell: (r) => <Text type="supporting">{r.category}</Text> },
            { key: 'status', header: 'Status', width: pixel(100), renderCell: (r) => <Badge variant={r.status === 'Critical' ? 'error' : r.status === 'Bug' ? 'warning' : 'success'} label={r.status} /> },
            { key: 'issues', header: 'Known issue', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.issues}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection title="UX gaps" sub="8 gaps from verbatim Prasanjit + Akshit sessions (Mar 25). Prasanjit is the internal Patient Log domain expert — 3 years across nursing, CRNA, SLP, PA.">
        <Table<GapRow>
          data={UX_GAPS}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'severity', header: 'Sev', width: pixel(90), renderCell: (r) => <Badge variant={r.severity === 'critical' ? 'error' : r.severity === 'high' ? 'warning' : 'info'} label={r.severity} /> },
            { key: 'area', header: 'Gap', width: pixel(200), renderCell: (r) => <Text type="body" weight="semibold">{r.area}</Text> },
            { key: 'detail', header: 'Detail', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.detail}</Text> },
            { key: 'who', header: 'Source', width: pixel(140), renderCell: (r) => <Text type="supporting">{r.who}</Text> },
          ]}
        />
      </SpecSection>
    </VStack>
  );
}

function Scope() {
  return (
    <VStack gap={6}>
      <SpecSection
        title="Q2 feature scope"
        sub="From the Akshit Q2 session (Mar 25). Phase 1 is internal-only; limited end-user rollout follows in Q3. Creation flow ranking: form library 90–95%, AI import 2–3%, from-scratch 2–3% — template-first is the correct default."
      >
        <Table<Q2Row>
          data={Q2_SCOPE}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'feature', header: 'Feature', width: pixel(240), renderCell: (r) => <Text type="body" weight="semibold">{r.feature}</Text> },
            { key: 'timeline', header: 'When', width: pixel(100), renderCell: (r) => <Badge variant={r.timeline === 'Q2 2026' ? 'warning' : 'neutral'} label={r.timeline} /> },
            { key: 'target', header: 'For', width: pixel(180), renderCell: (r) => <Text type="supporting">{r.target}</Text> },
            { key: 'detail', header: 'Detail', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.detail}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection title="User stories" sub="Sourced from Prasanjit, Akshit, Harsha and Pratiksha sessions — the actions users are actually performing.">
        <StoryTable rows={STORIES} />
      </SpecSection>
    </VStack>
  );
}

function ArchitectureSection() {
  return (
    <VStack gap={6}>
      <SpecSection
        title="Core constraint"
        sub="Arun: the backend cannot be fundamentally rewritten — the UI can be completely redesigned. Can change: complete UI redesign, new React components, AI features on the existing API, new workflow engine (Q2–Q3), new reporting layer. Cannot change without Anand sign-off: core form data model, existing template structures, module API contracts, 80k+ client-facing patient log instances."
      >
        <Table<Record<string, unknown> & (typeof MODULES)[number]>
          data={MODULES}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'module', header: 'Host module', width: pixel(180), renderCell: (r) => <Text type="body" weight="semibold">{r.module}</Text> },
            { key: 'provides', header: 'FaaS provides', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.provides}</Text> },
            { key: 'adds', header: 'Module adds', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.adds}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection
        title="Compliance pain: 3 systems, no cohesion"
        sub="Harsha compliance interview (Mar 20). ExactOne manages placement data but is isolated from compliance logic; CAS stores requirement setup with support-team-typed tags (one typo breaks form logic, discovered in October); FaaS/FAST renders forms in a different UI style — it should be a headless application with a consistent frontend."
      >
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Day 5 resolution (Mar 6): migrate to unified CAS — centralized intelligence for expiration dates, completion
            validation, universal integrations. Backend transition first, existing UI initially maintained. Patient Log DB
            migration: from Cosmos + Elastic + Mongo (4 copies of data) to a single Mongo transactional DB; 80,000+ forms need
            individual review; CRNA deferred until after summer; Q1–Q2 simple forms → scored forms → complex forms; Q4 PTSCs,
            CITs, PT Max custom rendering.
          </Text>
        </Card>
      </SpecSection>
      <SpecSection
        title="Site assessment: the one-PDF problem"
        sub='Pratiksha (Mar 18, session 1a0cd25e): "They need to present the site assessment to accreditation bodies. For that they need one PDF. But step 1 and step 3 are outside FaaS."'
      >
        <Grid columns={{ minWidth: 220, max: 3 }} gap={3}>
          {[
            { step: 'Step 1 · Site details', inFaas: false, desc: 'Site name, address, accreditation type, capacity. Hardcoded in the Site module.' },
            { step: 'Step 2 · Assessment form', inFaas: true, desc: 'Custom questions per school, up to 5 variations — the only step FaaS controls.' },
            { step: 'Step 3 · Form metadata', inFaas: false, desc: 'Completion date, reviewer, submission status. Hardcoded in the Site module.' },
          ].map((s) => (
            <Card key={s.step} variant="muted" padding={3}>
              <VStack gap={1}>
                <HStack gap={2} vAlign="center">
                  <Badge variant={s.inFaas ? 'success' : 'error'} label={s.inFaas ? 'in FaaS' : 'outside FaaS'} />
                  <Text type="body" weight="semibold">
                    {s.step}
                  </Text>
                </HStack>
                <Text type="supporting" as="p" textWrap="pretty">
                  {s.desc}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
        <Card variant="muted" padding={3}>
          <VStack gap={1.5}>
            <Text type="supporting" as="p" textWrap="pretty">
              Accreditation blocker: the PDF download exports step 2 only; clients manually stitch steps 1+2+3 in Word every
              cycle. Top client asks (Pendo + Pratiksha): P0 — download responses as one unified PDF (accreditors read PDFs,
              not spreadsheets); P1 — unpublish a form without deleting it; note — no requests for more control types.
            </Text>
            <Text type="supporting" as="p" textWrap="pretty">
              Preceptor Intake Form (PIF), a new FaaS surface: preceptor fills once, credentials/license/certifications sync to
              every school. Standardized fields are locked; a custom school section stays local; license expiry feeds the
              placement clearance dashboard. Design implication: a two-section form with visually distinct locked vs editable
              areas.
            </Text>
          </VStack>
        </Card>
      </SpecSection>
    </VStack>
  );
}

export function FaaSView() {
  const [section, setSection] = useSection(SECTIONS, 'overview');
  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="FaaS 2.0 — spec archive"
        lede="Forms as a Service: the embedded form engine behind Patient Log, Evaluations, Surveys, Site Assessment and Compliance — never a standalone product."
        meta="17k forms · 95k tickets/yr · NPS 2/5 · Q2 2026 internal self-service, Q3 limited rollout"
      />
      <Blockquote cite="Harsha · FaaS compliance interview · Mar 20">
        We type the tags by hand. One spelling mistake and the entire form logic breaks. We find out in October when students
        start submitting.
      </Blockquote>
      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />
      {section === 'overview' && <Overview />}
      {section === 'controls' && <Controls />}
      {section === 'scope' && <Scope />}
      {section === 'architecture' && <ArchitectureSection />}
      {section === 'decisions' && (
        <SpecSection title="Design decisions" sub="Each grounded in a Granola session, with the tradeoff it accepts.">
          <Grid columns={{ minWidth: 380, max: 2 }} gap={3}>
            {DECISIONS.map((d) => (
              <DecisionCard key={d.title} {...d} />
            ))}
          </Grid>
        </SpecSection>
      )}
      <SpecFooter productId={PRODUCT_ID} />
    </VStack>
  );
}
