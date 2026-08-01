// views/products/ExamManagementView.tsx — Exam Management spec archive shell
// (v19). SpecPageHeader with live corpus chips + the two delivery-state Figs
// promoted from Architecture as the shell's orienting visuals; five sections
// switched by a URL-synced ?section= param. The insight feed lives on the hub.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Link } from '@astryxdesign/core/Link';
import { Badge } from '@astryxdesign/core/Badge';
import { Fig } from '../../components/charts/Fig';
import { RankedList } from '../../components/charts/RankedList';
import { SpecPageHeader } from './spec/SpecPageHeader';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { SpecFooter } from './spec/SpecFooter';
import { Architecture } from './exam/Architecture';
import { Builder } from './exam/Builder';
import { Accessibility } from './exam/Accessibility';
import { Analytics } from './exam/Analytics';
import { Decisions } from './exam/Decisions';
import { BuildStatus } from '../../components/build-status/BuildStatus';

const PRODUCT_ID = 'exam-management';

const SECTIONS = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'builder', label: 'Builder + Stories' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'decisions', label: 'Decisions + Gaps' },
  { id: 'build-status', label: 'Build Status' },
];

// Promoted from Architecture's "Delivery state" section (Granola Jul 23 +
// design review Jul 15) — self-reported design/build state, not telemetry.
const MVP_READINESS = [
  { key: 'qb', label: 'Question Bank (QA phase)', value: 95, hint: 'folders, Smart Views, permissions in QA' },
  { key: 'student', label: 'Student Exam UX', value: 85, hint: 'a11y toolbar + navigator; offline cut to March' },
  { key: 'builder', label: 'Assessment Builder', value: 80, hint: '7 question types built; settings UI in dev' },
  { key: 'review', label: 'Faculty Review + Scoring', value: 60, hint: "item analysis spec'd; score adjustment in progress" },
  { key: 'ai', label: 'AI features', value: 15, hint: 'POC complete (100% accuracy); paused' },
];

const PHASE_CONFIDENCE = [
  { key: 'mvp', label: 'Jan 20 MVP overall', value: 82, hint: '82% design · 75% engineering' },
  { key: 'cohere', label: 'Cohere Sep 2026 demo', value: 65, hint: 'production-ready, not just working' },
  { key: 'parity', label: 'ExamSoft full parity', value: 40, hint: 'Cronbach alpha, curriculum mapping — Year 2' },
  { key: 'offline', label: 'Offline download (March LA)', value: 0, hint: 'cut from MVP; Aarti/team conflict open' },
];

export function ExamManagementView() {
  const [section, setSection] = useSection(SECTIONS, 'architecture');

  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <SpecPageHeader
        title="Exam Management — spec archive"
        productId={PRODUCT_ID}
        claim="Jan 20 2027 is a hard target the team self-scores at 82% design confidence — the Question Bank is in QA while AI features, the second differentiator, sit paused at 15%."
        meta="Jan 20 2027 MVP (hard target) · Sep 2026 Cohere demo · CAAHEP / CAPTE / ARC-PA · personas: Student, DCE/Faculty, Admin, Program Director · sources: Granola Jul 23 + design review Jul 15"
        actions={
          <HStack gap={3} vAlign="center" wrap="wrap">
            <Badge variant="warning" label="pre-audit deep dive" />
            <Link href="https://project-precious-cranberry-828.magicpatterns.app" isStandalone>
              University UI ↗
            </Link>
            <Link href="https://project-student-exam-accessibility.magicpatterns.app" isStandalone>
              Student UI ↗
            </Link>
          </HStack>
        }
        orienting={
          <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
            <Fig
              title="MVP readiness by module"
              n={MVP_READINESS.length}
              caption="Self-reported design + build state; AI features are POC-complete but paused for the roadmap decision."
            >
              <RankedList rows={MVP_READINESS} format={(r) => `${r.value}%`} errorBelow={50} />
            </Fig>
            <Fig
              title="Phase delivery confidence"
              n={PHASE_CONFIDENCE.length}
              caption="Jan 20 MVP tracks at 82% design / 75% engineering; the offline-download conflict is surfaced, not resolved."
            >
              <RankedList rows={PHASE_CONFIDENCE} format={(r) => `${r.value}%`} errorBelow={50} />
            </Fig>
          </Grid>
        }
      />

      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />

      {section === 'architecture' && <Architecture />}
      {section === 'builder' && <Builder />}
      {section === 'accessibility' && <Accessibility />}
      {section === 'analytics' && <Analytics />}
      {section === 'decisions' && <Decisions />}
      {section === 'build-status' && <BuildStatus productId={PRODUCT_ID} />}

      <SpecFooter
        productId={PRODUCT_ID}
        extra={
          <>
            <Link href="/products/exam-management/audit" isStandalone>
              Admin design audit — 12 UX gaps →
            </Link>
            <Link href="/products/exam-management/ia" isStandalone>
              Navigation IA — 12 items × 7 roles →
            </Link>
          </>
        }
      />
    </VStack>
  );
}
