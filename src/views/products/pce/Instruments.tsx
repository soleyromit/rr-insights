// views/products/pce/Instruments.tsx — the two PCE instruments as one
// comparative dimension × instrument table (v19), plus the survey structure
// and real result formats. Source: post_course_eval_primer_v2.
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { MetadataList, MetadataListItem } from '@astryxdesign/core/MetadataList';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { SpecSection } from '../spec/SpecSection';

interface DimRow extends Record<string, unknown> {
  id: string;
  dim: string;
  pce: string;
  faculty: string;
}

const DIMENSIONS: DimRow[] = [
  { id: 'resp', dim: 'Respondents + routing', pce: 'Students. Routes to Faculty + Program Director + Dean.', faculty: 'Faculty (self-reflection). Routes to the Program Director ONLY — never deans in raw form.' },
  { id: 'timing', dim: 'Timing', pce: 'Opens after the final grade-influencing activity, before grades lock.', faculty: 'Opens after the post-course eval closes (1–2 weeks after the course).' },
  { id: 'anon', dim: 'Anonymity', pce: 'Anonymous to instructor until grades are locked; faculty see aggregate, never individuals.', faculty: 'Confidential to the PD; deans see aggregated summaries only. NOT a performance evaluation.' },
  { id: 'accred', dim: 'Accreditation role', pce: 'CAPTE, ACOTE, CCNE require documented evidence of systematic collection and action.', faculty: 'Supports the PD–faculty development relationship; not a primary accreditation instrument.' },
];

export function Instruments() {
  return (
    <VStack gap={6}>
      <SpecSection title="The two instruments — fundamentally different" sub="From post_course_eval_primer_v2, the authoritative product spec. Same survey engine, different routing, anonymity and stakes.">
        <Table<DimRow>
          data={DIMENSIONS}
          idKey="id"
          density="balanced"
          verticalAlign="top"
          columns={[
            { key: 'dim', header: 'Dimension', width: pixel(170), renderCell: (r) => <Text type="body" weight="semibold">{r.dim}</Text> },
            {
              key: 'pce',
              header: 'Post-Course Evaluation',
              width: proportional(2),
              renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.pce}</Text>,
            },
            {
              key: 'faculty',
              header: 'Faculty Survey',
              width: proportional(2),
              renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.faculty}</Text>,
            },
          ]}
        />
        <Text type="supporting" as="p">
          <Badge variant="error" label="PRIMARY" /> Post-Course Evaluation is the accreditation instrument;{' '}
          <Badge variant="neutral" label="SECONDARY" /> the Faculty Survey supports faculty development.
        </Text>
      </SpecSection>
      <SpecSection title="Survey timing cascade" sub="Timing is not arbitrary: end of course → PCE opens (students) · 1–2 weeks post-course → faculty survey opens · end of term → PD reviews both, dean reviews synthesis · annually → program-level evaluation report to the accreditor.">
        <MetadataList columns="single" title="PCE structure (Post_course_evaluation_survey_tool.docx, MSU-PA June 2022)">
          <MetadataListItem label="Section 1 — rate the course">
            Design + content, flow and pacing, rigor, time allocation, assessment quality, overall rating.
          </MetadataListItem>
          <MetadataListItem label="Section 2 — rate the personnel">
            Course coordinator/director, each teaching faculty individually, adjuncts/guest lecturers (even if outside Exxat).
            Threshold: faculty must have taught ≥N hours (program-configurable).
          </MetadataListItem>
          <MetadataListItem label="Setup requirements">
            Define recipients and review objects, add guest lecturers by name, build structure + questions, set timeline with
            auto-reminders, configure result access.
          </MetadataListItem>
        </MetadataList>
        <MetadataList columns="single" title="Real result formats (Immunomicro PCOM 2018 · Marquette PT Spring 2025)">
          <MetadataListItem label="Rating scales">
            5-point (SD→SA) or 6-point (VP→E) — medical programs often use 6-point to avoid midpoint clustering.
          </MetadataListItem>
          <MetadataListItem label="Comparison views">
            Per-instructor comparison vs department and all-faculty averages with percentile rank (e.g. 4.7 vs 4.4 → 85th
            percentile).
          </MetadataListItem>
          <MetadataListItem label="Response-rate tracking">
            81/89 (91.0%) Immunomicro; 53/67 (79.1%) Marquette PT; ARC-PA minimum 65%.
          </MetadataListItem>
          <MetadataListItem label="Free-text comments">
            Separated by question and respondent; the program decides which comments faculty see.
          </MetadataListItem>
          <MetadataListItem label="Longitudinal comparison">
            Absent from both samples — the gap vs Blue/Watermark.
          </MetadataListItem>
        </MetadataList>
      </SpecSection>
    </VStack>
  );
}
