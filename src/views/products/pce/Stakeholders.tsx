// views/products/pce/Stakeholders.tsx — the visibility cascade and persona
// entry points (v19, split from the CourseEvalView monolith). Information
// cascades student → faculty → PD → dean; each level sees strictly less.
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Badge } from '@astryxdesign/core/Badge';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { SpecSection } from '../spec/SpecSection';

interface CascadeRow extends Record<string, unknown> {
  id: string;
  role: string;
  sees: string;
  use: string;
}

const CASCADE: CascadeRow[] = [
  { id: 'student', role: 'Student', sees: 'Their own responses; optional aggregated prior-cohort trends; "what changed based on your feedback" notifications.', use: 'Complete the evaluation at course end. Their voice is the primary driver of course-level improvement — visible responses build trust and future participation.' },
  { id: 'faculty', role: 'Faculty', sees: 'AGGREGATE results only, never individual responses, and only after grades lock. Department and all-faculty averages for comparison.', use: 'Understand the gap between teaching intent and student experience; adjust syllabi and delivery.' },
  { id: 'pd', role: 'Program Director', sees: 'Everything: anonymized individual comments, per-faculty scores, longitudinal trends, faculty surveys in full, response-rate monitoring.', use: 'Monitor course quality, flag outliers, initiate reviews, support faculty development; data-driven curriculum decisions.' },
  { id: 'dean', role: 'Dean / Academic Leadership', sees: 'Program-level roll-ups ONLY — no course-level data, no individual faculty survey responses. Exception alerts.', use: 'Program-wide quality, accreditation readiness, resource allocation, annual program review.' },
];

const ENTRY_POINTS = [
  { role: 'Program Director / Admin', path: 'Survey section → PCE tile → program analytics (course leaderboard, faculty leaderboard, cohort trend).' },
  { role: 'Faculty', path: 'Course page → results for that course (after admin publishes) AND a faculty dashboard aggregating all courses they teach.' },
  { role: 'Student', path: 'Receives the survey at course end via email or LMS, configured per course by the admin.' },
];

export function Stakeholders() {
  return (
    <VStack gap={6}>
      <SpecSection title="Stakeholder cascade" sub="Information cascades student → faculty → PD → dean; each level has different visibility rights, decision context and UX needs.">
        <Table<CascadeRow>
          data={CASCADE}
          idKey="id"
          density="balanced"
          verticalAlign="top"
          columns={[
            { key: 'role', header: 'Role', width: pixel(190), renderCell: (r) => <Text type="body" weight="semibold">{r.role}</Text> },
            { key: 'sees', header: 'Sees', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.sees}</Text> },
            { key: 'use', header: 'Uses it to', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.use}</Text> },
          ]}
        />
      </SpecSection>
      <SpecSection title="Persona entry points" sub="Sessions c7a8d32e + bde86866.">
        <List density="balanced" hasDividers>
          {ENTRY_POINTS.map((e) => (
            <Item
              key={e.role}
              as="li"
              startContent={<Badge variant="neutral" label={e.role} />}
              label={e.path}
              labelLines={3}
              align="start"
            />
          ))}
        </List>
      </SpecSection>
    </VStack>
  );
}
