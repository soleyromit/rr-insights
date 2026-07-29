// views/products/exam/Accessibility.tsx — the admin→student accessibility
// contract, interaction spec, and competitive parity matrix (v19). The
// orienting stacked bar is DERIVED from the real 12-feature parity matrix —
// no fabricated numbers — and the badge wall is now the StatusCell pattern.
import { VStack } from '@astryxdesign/core/VStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Chart, ChartAxis, ChartGrid, bar, useChartColors } from '@astryxdesign/charts';
import { Fig } from '../../../components/charts/Fig';
import { SpecSection } from '../spec/SpecSection';
import { StatusCell } from '../spec/StatusCell';
import { insightsWhere } from '../../../lib/selectors';
import { hrefInsights } from '../../../lib/links';

interface A11yRow extends Record<string, unknown> {
  id: string;
  feature: string;
  admin: string;
  student: string;
  wcag: string;
  p: 'critical' | 'high' | 'new';
}

const A11Y: A11yRow[] = [
  { id: 'zoom', feature: 'Text magnification', admin: 'Toggle per exam, default zoom level, per-student override', student: 'Toolbar slider 100–400%, persists per session', wcag: '1.4.4', p: 'critical' },
  { id: 'tts', feature: 'Text-to-speech', admin: 'Enable/disable, reading speed, voice type', student: 'Toolbar toggle, reads stem + options, visual indicator', wcag: '1.1.1', p: 'high' },
  { id: 'stt', feature: 'Speech-to-text', admin: 'Enable for open-ended Qs only; auto-disabled for MCQ/MSQ', student: 'Mic button in text inputs, live transcript preview', wcag: 'N/A', p: 'high' },
  { id: 'contrast', feature: 'High contrast modes', admin: 'Student chooses (default) / force light / force high contrast', student: '3-mode cycle in toolbar, persists', wcag: '1.4.3', p: 'high' },
  { id: 'osk', feature: 'On-screen keyboard', admin: 'Enable globally for exam (motor impairment)', student: 'Floats above exam, draggable, full character set', wcag: '2.1.1', p: 'high' },
  { id: 'time', feature: 'Extended time', admin: 'Per-student multiplier (1×/1.5×/2×/custom), bulk apply', student: 'Timer shows personal end time; 10-min warning', wcag: 'N/A', p: 'critical' },
  { id: 'calc', feature: 'Calculator', admin: 'Per-question toggle + global type (none/basic/scientific)', student: 'Toolbar button, active only on permitted questions', wcag: 'N/A', p: 'high' },
  { id: 'alt', feature: 'Alt text on images', admin: 'Required field on upload — blocks question save', student: 'Screen reader announces; TTS reads it; tooltip', wcag: '1.1.1', p: 'critical' },
  { id: 'cc', feature: 'Captions for media', admin: 'Required .vtt/.srt upload; AI generation option', student: 'CC button on player; collapsible transcript panel', wcag: '1.2.2', p: 'critical' },
  { id: 'crossout', feature: 'Cross-out answer', admin: 'Always enabled for MCQ/MSQ; cannot disable', student: 'Right-click / long-press strikes through the option', wcag: 'N/A', p: 'high' },
  { id: 'profiles', feature: 'Accommodation profiles', admin: 'Named program-level profiles; bulk assign; CSV import', student: 'Silently apply on exam launch — no student action', wcag: 'N/A', p: 'new' },
  { id: 'focus', feature: 'Focus mode', admin: 'Enable/disable per exam (ADHD/cognitive support)', student: 'Removes decorative chrome — question + answer only', wcag: 'N/A', p: 'new' },
  { id: 'dyslexia', feature: 'Dyslexia font', admin: 'Allow override per exam, per-student flag', student: 'Font selector in toolbar (OpenDyslexic), persists', wcag: 'N/A', p: 'new' },
  { id: 'line', feature: 'Line reader', admin: 'Enable/disable per exam (reading pace support)', student: 'Horizontal guide bar follows cursor through passage', wcag: 'N/A', p: 'new' },
  { id: 'magnifier', feature: 'Image magnifier', admin: 'Always on for hotspot/image questions; cannot disable', student: 'Click-to-zoom, pinch gesture, magnifier lens for EKG', wcag: '1.4.4', p: 'critical' },
];

const INTERACTION_SPEC = [
  { title: 'Global exam toggles', desc: 'TTS, STT, OSK, focus mode, calculator (radio group), zoom (always-on + default level), display mode. Click anywhere on a toggle card toggles it — role="switch", aria-checked, label + description always visible.' },
  { title: 'Accommodation profiles', desc: 'Program-level library, not per-exam. Presets: Visual standard (TTS + high contrast + 1.5× + 150% zoom), Extended time 2×, Motor support (OSK + STT + 1.5× + basic calculator), Dyslexia support (OpenDyslexic + line reader + TTS + 1.25× zoom + 1.5× time). Custom builder exposes all toggles + time multiplier.' },
  { title: 'Student accommodation table', desc: 'Columns: name / email / profile (badge or orange warning) / time multiplier / actions. Rows without profiles tinted orange. Bulk apply: select → modal → summary → confirm → 10-second undo. CSV import by student ID + accommodation type.' },
  { title: 'Accessibility audit rings', desc: 'Four progress rings: images with alt text (Fix N CTA), media with captions, students with profiles, WCAG compliance. Fix navigates to Structure tab filtered to warnings. Publish blocked until all CRITICAL rings are green.' },
  { title: 'Preview as accommodation', desc: 'Pick a student or a profile → opens the student exam view in a new tab with the full accommodation stack applied. Faculty confidence-builder; no competitor has this.' },
];

interface ParityRow extends Record<string, unknown> {
  id: string;
  feature: string;
  es: string;
  bb: string;
  cv: string;
  d2l: string;
  ex: string;
}

const PARITY: ParityRow[] = [
  { id: 'p1', feature: 'Extended time per student', es: 'Yes', bb: 'Per-attempt only', cv: 'Yes', d2l: 'Manual, no bulk', ex: 'Bulk + profile template' },
  { id: 'p2', feature: 'Bulk accommodation assign', es: 'No', bb: 'No', cv: 'Group sections', d2l: 'No — 70 ops gap', ex: 'Bulk — 1 operation' },
  { id: 'p3', feature: 'TTS / narrator', es: 'Third-party only', bb: 'Browser built-in', cv: 'Browser built-in', d2l: 'Browser built-in', ex: 'Built-in, lockdown-safe' },
  { id: 'p4', feature: 'STT / dictation', es: 'No', bb: 'Browser API', cv: 'No', d2l: 'No', ex: 'Built-in, open-ended only' },
  { id: 'p5', feature: 'In-app zoom 100–400%', es: 'Blocked — OS zoom', bb: 'Blocked — browser', cv: 'Blocked — browser', d2l: 'Blocked — browser', ex: 'Built-in, lockdown-safe' },
  { id: 'p6', feature: 'On-screen keyboard', es: 'No', bb: 'No', cv: 'No', d2l: 'No', ex: 'Built-in, draggable' },
  { id: 'p7', feature: 'Alt text enforcement', es: 'Optional field', bb: 'Warning on publish', cv: 'Required', d2l: 'Optional', ex: 'Required, blocks publish' },
  { id: 'p8', feature: 'Image magnifier (medical)', es: 'Yes', bb: 'Basic zoom', cv: 'No', d2l: 'No', ex: 'Magnifier lens + pinch' },
  { id: 'p9', feature: 'High contrast mode', es: 'No', bb: 'Yes', cv: 'Basic', d2l: 'Yes', ex: '3 modes + system-detect' },
  { id: 'p10', feature: 'Formula questions', es: 'Yes', bb: 'Yes — best', cv: 'Yes', d2l: 'Yes', ex: 'Phase 2 — not Aug 2026' },
  { id: 'p11', feature: 'Calculator per question', es: 'Yes', bb: 'Global only', cv: 'Global only', d2l: 'Global only', ex: 'Per-Q granularity' },
  { id: 'p12', feature: 'WCAG 2.1 AA (ACR)', es: 'Partial — no ACR', bb: 'Yes', cv: 'Yes', d2l: 'Yes', ex: 'Required for UNF pilot' },
];

/** Classify a raw parity-matrix value: has / partial / gap. */
const parityState = (v: string): 'yes' | 'partial' | 'no' =>
  /^(Yes|Built|Bulk|Per-Q|Required|3 mode)/.test(v) ? 'yes' : /^(No|Blocked|None|Partial)/.test(v) ? 'no' : 'partial';

const PLATFORMS: { key: keyof ParityRow & string; label: string }[] = [
  { key: 'es', label: 'ExamSoft' },
  { key: 'bb', label: 'Blackboard' },
  { key: 'cv', label: 'Canvas' },
  { key: 'd2l', label: 'D2L' },
  { key: 'ex', label: 'Exxat target' },
];

// Derived, not asserted: win/partial/gap counts per platform from the matrix.
const PARITY_STACK = PLATFORMS.map((p) => {
  const values = PARITY.map((r) => String(r[p.key]));
  return {
    platform: p.label,
    has: values.filter((v) => parityState(v) === 'yes').length,
    partial: values.filter((v) => parityState(v) === 'partial').length,
    gap: values.filter((v) => parityState(v) === 'no').length,
  };
});

const EXXAT_HAS = PARITY_STACK.find((d) => d.platform === 'Exxat target');

function ParityStackChart() {
  const colors = useChartColors();
  return (
    <Chart
      data={PARITY_STACK as unknown as Record<string, unknown>[]}
      xKey="platform"
      height={220}
      yDomain={[0, PARITY.length]}
      series={[
        bar('has', { stack: 'parity', color: colors.semantic.positive, label: 'Has / wins' }),
        bar('partial', { stack: 'parity', color: colors.semantic.warning, label: 'Partial' }),
        bar('gap', { stack: 'parity', color: colors.semantic.negative, label: 'Gap' }),
      ]}
      grid={<ChartGrid horizontal tickCount={4} />}
      axes={
        <>
          <ChartAxis position="bottom" />
          <ChartAxis position="left" tickCount={4} />
        </>
      }
      legend
      tooltip
    />
  );
}

const WINS = [
  { id: 'w1', kind: 'Structural advantage', point: 'Flat pool + Scoped Views: no folder silos, cross-dept sharing without duplication.' },
  { id: 'w2', kind: 'Structural advantage', point: 'Prism integration: student/course/faculty data already exists — no rebuild.' },
  { id: 'w3', kind: 'Structural advantage', point: 'Accommodation profile system closes the D2L 70-operation gap.' },
  { id: 'w4', kind: 'Structural advantage', point: 'AI-first architecture: retrofitting AI into a 20-year ExamSoft codebase is impossible.' },
  { id: 'w5', kind: 'UX pattern to follow', point: 'Progressive disclosure: hide accommodation complexity from faculty who do not need it.' },
  { id: 'w6', kind: 'UX pattern to follow', point: 'Publish gate checklist (Blackboard Ultra pattern): blocks publish until WCAG is met.' },
  { id: 'w7', kind: 'UX pattern to follow', point: 'Preview-as-accommodation: admin sees exactly what a student with that profile experiences.' },
  { id: 'w8', kind: 'UX pattern to follow', point: 'Live monitoring with accommodation badges: extend time in real time without leaving the screen.' },
];

export function Accessibility() {
  const a11yEvidence = insightsWhere({ product: 'exam-management', q: 'accessibility' });
  return (
    <VStack gap={6}>
      <Fig
        title="Feature parity mix per platform"
        n={PARITY.length}
        caption={`Derived from the 12-feature parity matrix below (wins/partial/gap per platform). The Exxat target column carries ${EXXAT_HAS?.has ?? 0} wins and ${EXXAT_HAS?.gap ?? 0} gap (formula questions — Phase 2); every competitor relies on OS assistive tools that lockdown browsers block.`}
        note="Exxat column is the design target, not a shipped product."
        link={{ href: hrefInsights({ product: 'exam-management', q: 'accessibility' }), count: a11yEvidence.length, label: 'accessibility findings in the corpus' }}
      >
        <ParityStackChart />
      </Fig>

      <SpecSection
        title="First-to-market position"
        sub="Program-level accommodation profiles: no competitor has bulk profile assignment. D2L needs 70 manual operations (7 students × 10 quizzes); Exxat needs 1. The publish gate blocks deploy until WCAG requirements are met. 15 features mapped admin→student; 8 of 12 WCAG AA criteria met; 0 competitors ship built-in tools (all rely on OS features, which lockdown browsers block)."
      >
        <Card variant="muted" padding={3}>
          <Text type="supporting" as="p" textWrap="pretty">
            Constraint that drives everything: LockDown browser blocks all external assistive tools, so accessibility must be
            platform-embedded — the Pearson model (GRE/SAT/TOEFL) proves it is achievable. Confirmed UNF pilot blocker; ACR
            validation required. Two-phase plan: Phase 1 = minimum for the UNF pilot (magnification, high contrast, extra
            time); Phase 2 = comprehensive revamp with the student portal overhaul. ADA Title II deadline: April 24.
          </Text>
        </Card>
      </SpecSection>

      <SpecSection title="Accessibility feature map" sub="Every admin control maps to a student experience — accessibility session Mar 16. NEW = first-to-market surface.">
        <Table<A11yRow>
          data={A11Y}
          idKey="id"
          density="compact"
          columns={[
            { key: 'feature', header: 'Feature', width: pixel(170), renderCell: (r) => <Text type="body" weight="semibold">{r.feature}</Text> },
            { key: 'admin', header: 'Admin control', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.admin}</Text> },
            { key: 'student', header: 'Student experience', width: proportional(2), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.student}</Text> },
            { key: 'wcag', header: 'WCAG', width: pixel(70), renderCell: (r) => <Text type="code">{r.wcag}</Text> },
            { key: 'p', header: 'Priority', width: pixel(90), renderCell: (r) => <Badge variant={r.p === 'critical' ? 'error' : r.p === 'high' ? 'warning' : 'success'} label={r.p === 'new' ? 'NEW' : r.p} /> },
          ]}
        />
      </SpecSection>

      <SpecSection title="Accessibility tab — interaction spec" sub="Full interaction spec for the Accessibility tab in Assessment Builder (SKILL.md 13.12).">
        <VStack gap={2}>
          {INTERACTION_SPEC.map((s) => (
            <Collapsible key={s.title} trigger={s.title} defaultIsOpen={false}>
              <Text type="body" as="p" textWrap="pretty">
                {s.desc}
              </Text>
            </Collapsible>
          ))}
        </VStack>
      </SpecSection>

      <SpecSection
        title="Feature parity — 12 features across 5 platforms"
        sub="Dot = state (shipped / partial / missing); the cell text keeps each platform's actual behavior. ExamSoft retention anchors (Dr. Vicky Mody, Mar 20): established curriculum mapping, years of faculty training, strong item analytics — the three things Exxat must match or exceed."
      >
        <Table<ParityRow>
          data={PARITY}
          idKey="id"
          density="compact"
          columns={[
            { key: 'feature', header: 'Feature', width: pixel(190), renderCell: (r) => <Text type="body">{r.feature}</Text> },
            ...PLATFORMS.map((p) => ({
              key: p.key,
              header: p.label,
              width: proportional(1),
              renderCell: (r: ParityRow) => <StatusCell state={parityState(String(r[p.key]))} label={String(r[p.key])} />,
            })),
          ]}
        />
      </SpecSection>

      <SpecSection title="Where Exxat already wins / patterns to follow" sub="From the D2L demo (Mar 4), PRISM strategy (Mar 2–4) and the Mar 25 build.">
        <Table<Record<string, unknown> & (typeof WINS)[number]>
          data={WINS}
          idKey="id"
          density="compact"
          columns={[
            { key: 'kind', header: 'Kind', width: pixel(190), renderCell: (r) => <Badge variant={r.kind === 'Structural advantage' ? 'success' : 'info'} label={r.kind} /> },
            { key: 'point', header: 'What it is', width: proportional(4), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.point}</Text> },
          ]}
        />
      </SpecSection>
    </VStack>
  );
}
