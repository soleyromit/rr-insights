// views/products/pce/Overview.tsx — PCE design gaps, competitive position and
// transcript-grounded architecture facts (v19, split from the 477-line
// CourseEvalView monolith; structure mirrors views/products/exam/).
import { VStack } from '@astryxdesign/core/VStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Link } from '@astryxdesign/core/Link';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Fig } from '../../../components/charts/Fig';
import { RankedList } from '../../../components/charts/RankedList';
import { SpecSection } from '../spec/SpecSection';
import { hrefCompetitive } from '../../../lib/links';

const PRODUCT_ID = 'course-eval';

interface GapRow extends Record<string, unknown> {
  id: string;
  area: string;
  severity: string;
  why: string;
  fix: string;
  src: string;
}
const DESIGN_GAPS: GapRow[] = [
  { id: 'd1', area: 'Two-instrument architecture not designed', severity: 'critical', why: 'Post-course eval and faculty survey are different instruments: different respondents, routing and anonymity. Faculty surveys route ONLY to the PD; post-course evals route to Faculty + PD + Dean.', fix: 'Two separate flows with distinct routing rules, anonymity settings and result visibility.', src: 'PCE primer v2 + Open Questions doc' },
  { id: 'd2', area: 'Anonymity + grade-timing controls absent', severity: 'critical', why: 'Students must not be identifiable to faculty until grades are locked; the grades-before-close conflict is a known risk with no controls today.', fix: 'Survey window gated on grade submission; faculty see aggregate only; minimum N for small-cohort visibility.', src: 'PCE primer v2' },
  { id: 'd3', area: 'ARC-PA 65% response monitoring absent', severity: 'high', why: 'Touro site visit: below 65% is an accreditation risk; no threshold monitoring or PD alert exists.', fix: 'Response-rate badge per course; amber below 80% with time remaining; red on close below 65%; automated reminders.', src: 'Touro PA site visit (Vishaka, Mar 12)' },
  { id: 'd4', area: 'Feedback loop to students absent', severity: 'high', why: 'No competitor closes the loop either; invisible outcomes depress future participation.', fix: '"Based on your feedback, we changed…" — PD publishes a 1–3 sentence response per course.', src: 'Open Questions + competitor analysis' },
  { id: 'd5', area: 'Longitudinal / multi-term dashboard absent', severity: 'high', why: 'Curriculum drift is only detectable across 3+ semesters; current design shows one term at a time.', fix: 'Multi-term trend per course, cohort comparison, outlier detection.', src: 'PCE primer v2' },
  { id: 'd6', area: 'Dean-level aggregate view absent', severity: 'medium', why: 'Deans need program roll-ups and exception reports, not raw survey data — essential for self-studies.', fix: 'Dean view: program-level roll-up, exception reports, annual review export.', src: 'PCE primer v2' },
  { id: 'd7', area: 'Accreditation-aligned question bank absent', severity: 'medium', why: 'CAPTE/ACOTE/CCNE require documented evidence of collecting and acting on feedback; a pre-mapped bank beats all four competitors.', fix: 'Base bank mapped to CAPTE/ACOTE/CCNE; PDs customize but keep the mapped core.', src: 'Open Questions + PCE primer v2' },
];

interface CompRow extends Record<string, unknown> {
  id: string;
  name: string;
  score: number;
  strength: string;
  weakness: string;
}
const COMPETITORS: CompRow[] = [
  { id: 'blue', name: 'Explorance Blue', score: 3.5, strength: 'Market leader; accreditation-aware; strong anonymity controls.', weakness: 'No AI; weak accreditation export; no feedback loop to students.' },
  { id: 'wm', name: 'Watermark CES', score: 3.5, strength: 'Dean-level fixed questions; strong governance.', weakness: 'No AI; limited longitudinal views; no feedback loop.' },
  { id: 'anth', name: 'Anthology', score: 4, strength: 'Best dean-level aggregate reporting; role-based views.', weakness: 'No AI; same export weaknesses.' },
  { id: 'sm', name: 'SurveyMonkey', score: 2.5, strength: 'Best ease of survey creation; highly customizable.', weakness: 'No accreditation alignment, preset banks, or role-based views.' },
  { id: 'exxat', name: 'Exxat target', score: 5, strength: 'Bundled with Prism at zero marginal cost; accreditation-aligned questions; AI sentiment; feedback loop; 65% threshold monitoring.', weakness: 'Not built yet; switchers need historical data migration.' },
];

export function Overview() {
  return (
    <VStack gap={6}>
      <SpecSection
        title="Design gaps"
        sub="Identified from the primer, the Open Questions doc, the Touro site visit and competitor analysis. The two critical rows shaped the P1 architecture."
      >
        <Table<GapRow>
          data={DESIGN_GAPS}
          idKey="id"
          density="balanced"
          columns={[
            { key: 'severity', header: 'Sev', width: pixel(90), renderCell: (r) => <Badge variant={r.severity === 'critical' ? 'error' : r.severity === 'high' ? 'warning' : 'info'} label={r.severity} /> },
            { key: 'area', header: 'Gap', width: pixel(220), renderCell: (r) => <Text type="body" weight="semibold">{r.area}</Text> },
            { key: 'why', header: 'Why it hurts', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.why}</Text> },
            { key: 'fix', header: 'Fix', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.fix}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection
        title="Competitive position"
        sub="From the Open Questions doc. Programs pay ~$5K/yr for standalone tools; 0 of 4 competitors offer AI analysis; none close the feedback loop; LMSs do course eval poorly and without accreditation alignment."
      >
        <Fig
          title="Competitor scores"
          n={COMPETITORS.length}
          caption="Editorial 0–5 scoring from the competitor analysis — a design target, not a measurement. The Exxat row is aspiration, not a shipped product."
        >
          <RankedList
            rows={COMPETITORS.map((c) => ({ key: c.id, label: c.name, value: c.score, hint: c.weakness }))}
            format={(r) => `${r.value}/5`}
          />
        </Fig>
        <Link href={hrefCompetitive(PRODUCT_ID)} isStandalone>
          Full parity matrix — 4 competitors →
        </Link>
      </SpecSection>
      <SpecSection
        title="Transcript-grounded architecture facts"
        sub="Session bde86866 (Mar 24): PCE lives INSIDE the surveys module as a premium tile with two entry points (surveys tile for admins, per-course for faculty); Prism course offerings are the distribution prerequisite with a Phase-2 CSV fallback; faculty need an aggregate cross-course dashboard, not per-course tiles only; Marquette shows why clinical and didactic courses need separate question sets."
      >
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Marquette pain (David, Mar 24): the university forced didactic-focused questions onto clinical placements —
            students answered "Did this course expose you to diverse patient populations?" for classroom courses, forcing
            artificially low ratings. Phase 1: separate clinical vs didactic question sets. Phase 2: tenant-level questions
            with program-level override.
          </Text>
        </Card>
      </SpecSection>
    </VStack>
  );
}
