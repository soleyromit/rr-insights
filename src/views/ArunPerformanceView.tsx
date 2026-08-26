// views/ArunPerformanceView.tsx — Performance Ledger (v19.11 refresh).
// Source 1: Offer of Appointment — Kunal Vaishnav / Exxat Inc · Mar 15, 2026.
// Source 2: Granola raw transcripts + Obsidian meeting notes — eight Arun
// sessions Mar 24 → Aug 12, 2026 (791334af, 277a02d9, a4a0e1db, 84c5d242,
// e69904b6, a1eda6e2, 2870dd23, 77e5276a). Seven offer-letter criteria scored
// with dated rationale, the 1:1 arc as a timeline, and verbatim Arun quotes
// only. The Aug 12 session covered individual performance feedback beyond
// the process fix recorded here — captured only the collaboration-process
// takeaways per an explicit privacy decision; the rest was not published.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Badge } from '@astryxdesign/core/Badge';
import { Citation } from '@astryxdesign/core/Citation';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { List } from '@astryxdesign/core/List';
import { Item } from '@astryxdesign/core/Item';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { RankedList } from '../components/charts/RankedList';
import { QueryLink } from '../components/story/QueryLink';
import { insightsWhere } from '../lib/selectors';
import { hrefPortfolio, hrefBriefings, hrefInsights } from '../lib/links';
import type { InsightFilter } from '../lib/links';

const TARGET = 85;

// ── The 1:1 arc — every entry sourced to a dated session (Granola id in the
// vault note frontmatter). The trajectory IS the review: firefighting →
// stabilizing → "speed is the skill signal". ──
const REVIEW_TIMELINE = [
  { date: 'Mar 24', title: '3-year vision session', signal: 'baseline', note: 'Exam taker experience + assessment creation set as sole priority; AI everywhere; speed over design-system compliance; one review per phase.' },
  { date: 'Apr 20', title: 'First 1:1', signal: 'expectations', note: 'Decision hierarchy set: verbal alignment → Vishaka approval → then design. US proximity flagged as strategic asset. DS co-ownership with Himanshu, accessibility first.' },
  { date: 'Jun 9', title: 'Execution reset', signal: 'corrective', note: 'Both products delayed in approval loops. New framework: critical path only, PMs drive, all Aarti requests route through PMs. "Done" = the next person understands the design. DS deprioritized for speed.' },
  { date: 'Jun 30', title: 'Roadmap + DS strategy', signal: 'stabilizing', note: 'Priorities fixed: Exam #1, Course Eval #2. Speed wins when the DS bottlenecks; retrofit alignment later. Designer time should shift to non-trivial UI; AI covers commodity screens.' },
  { date: 'Jul 6', title: '1:1 — oversight change', signal: 'stabilizing', note: 'Aarti steps back; Yash + PMs drive approvals. 100% focus on PM-driven work. Role boundary: share design ideas, PMs decide. Time-zone concern raised by others — Arun not entertaining it yet.' },
  { date: 'Jul 13', title: '1:1 — process gaps', signal: 'candid', note: 'Romit raises: assessment-creation designs bypassed (devs built below-standard screens), no PRDs/tracker, pixel-perfect double standard. Arun: establish collaboration first; design iterates post-build; daily syncs agreed.' },
  { date: 'Jul 20', title: '1:1 — positive turn', signal: 'positive', note: 'Designs and prototypes AHEAD of documentation — endorsed as "absolutely the right approach". ~80–85% of Course Eval designed. Speed reframed as the skill signal; consensus plans expected over individual escalations; AI feature decisions PM-owned.' },
  { date: 'Aug 12', title: '1:1 — communication root cause', signal: 'process-reset', note: 'Root cause named for the PM/design review-cycle friction: static documentation carries only a fraction of the necessary context. Prescribed fix: daily video syncs with PMs, camera on, working through open questions in real time rather than over documents. Guidance for the current phase: UI execution first, hold broader UX judgment calls until the foundation stabilizes, and stay scoped to what PMs explicitly ask for rather than over-delivering. Two-sided — the same communication-gap message is being delivered to the PM team directly, not just this side.' },
  { date: 'Aug 24', title: '1:1 — delay-tracking dashboard', signal: 'data-driven', note: 'Romit shared a live delay-tracking dashboard (MS Teams/SharePoint data) quantifying two patterns: redesign cycles and long review times, some features 50+ days. Arun: useful data to have, but the goal is smooth collaboration, not justification — the dashboard "shouldn\'t ideally be necessary." Will ask to see it if needed; no immediate action. Focus areas confirmed: course eval dashboard plus expanded scope (learning contracts, skill checklist, emerging domain research).' },
];

// ── Verbatim Arun quotes — not paraphrased. Mar 24 set from transcript
// 791334af; Jul 20 set from transcript 2870dd23. ──
const ARUN_VERBATIM = [
  { quote: 'Speed is not just for the sake of doing it quickly. Speed is a sign of skill. Given infinite time, anybody can do anything in this world.', context: 'Reframing speed as the skill measurement itself', source: 'Raw transcript · Jul 20' },
  { quote: 'High ideas are only ideas. I only care about executed ideas.', context: 'On design ambition vs. delivery — execution is the currency', source: 'Raw transcript · Jul 20' },
  { quote: 'First, you need to show me, not tell me the idea.', context: 'The bar for proposals: demonstrated, not described', source: 'Raw transcript · Jul 20' },
  { quote: 'The skills I am comfortable with — skills we got. But the teamwork is not up to like the standard I want.', context: 'Individual skills explicitly endorsed; team consensus named as THE gap', source: 'Raw transcript · Jul 20' },
  { quote: 'Why do you even need to escalate this to me? Why don\'t you, all of you together decide we are going to do something great?', context: 'The new expectation: arrive with a consensus plan, not individual escalations', source: 'Raw transcript · Jul 20' },
  { quote: 'We will have some throwaway work. That\'s fine.', context: 'Current phase is foundational — beta expectations, iteration expected', source: 'Raw transcript · Jul 20' },
  { quote: 'Even to enter the territory of a great product, I will say, the thing has to be like a intelligent professional first.', context: 'Arun\'s product bar: an intelligent professional that manages data, not a data tool', source: 'Raw transcript · Jul 20' },
  { quote: 'Your top top top priority is this only — exam taker experience and admin/faculty assessment creation.', context: 'Confirming Exam Management as sole priority for next few weeks', source: 'Raw transcript · Mar 24' },
  { quote: 'AI can be used, it should be used. Everywhere. Like, everywhere. AI can be used, it should be used.', context: 'On AI integration philosophy — not selective, not optional', source: 'Raw transcript · Mar 24' },
  { quote: 'We want to reduce the amount of time faculty has to spend. That is the goal. We want to actively reduce the amount of time they have to spend designing exams.', context: 'Defining the core AI success metric explicitly', source: 'Raw transcript · Mar 24' },
  { quote: "ExamSoft is publicly against AI. Which is, like, amazing from my point of view. We are like, great. You don't use AI. We are going to use it.", context: 'Strategic framing — ExamSoft anti-AI stance is Exxat\'s opening', source: 'Raw transcript · Mar 24' },
  { quote: 'The exam taker app — whatever you build becomes the part of the design system. There is nothing like this we have.', context: 'On design system: exam taker UI is greenfield, not constrained by Himanshu DS', source: 'Raw transcript · Mar 24' },
  { quote: 'Speed of delivery is of higher importance. Speed over above anything else.', context: 'Explicitly ranking speed over design system compliance', source: 'Raw transcript · Mar 24' },
  { quote: 'I will not inject myself into too many design reviews. I will do one review when it is rounded up to see if there are any major problems.', context: 'On Arun\'s review cadence — one review at phase completion, not incremental', source: 'Raw transcript · Mar 24' },
  { quote: "The dev team's primary job is to execute what the three of you — you, Vishakha, and Nipun — propose.", context: 'Clarifying design-PM-engineering authority structure', source: 'Raw transcript · Mar 24' },
  { quote: 'Current product requirements — the alignment with the high-level strategic differentiation is not as visible as it should be.', context: 'Arun agreeing with Romit\'s observation about PRD quality gap', source: 'Raw transcript · Mar 24' },
  { quote: 'I would say it is more of a first draft than the final design system. We do not quite have a design system at this point.', context: 'Arun\'s own characterization of Himanshu\'s DS — removes the blocker', source: 'Raw transcript · Mar 24' },
  { quote: 'You got to work with the PMs daily for several hours...the video needs to be on, the screen needs to be on...if you just rely on some document...there is nothing at all in a static document.', context: 'The prescribed fix for the PM/design communication gap — daily video syncs over static docs', source: 'Raw transcript · Aug 12' },
  { quote: 'The goal is for us to be able to get along and work, not justify on either party side. That should not be even necessary...it should not even be necessary to do this sort of a thing.', context: 'On the delay-tracking dashboard — reframing the goal as collaboration, not justification', source: 'Raw transcript · Aug 24' },
];

type Status = 'strong' | 'on-track' | 'in-progress' | 'at-risk';

interface Criterion {
  id: string;
  label: string;
  weight: number;
  score: number;
  status: Status;
  offerText: string;
  rationale: string;
  /** When the cite is an insight query, `filter` lets the UI show a live count. */
  cite: { label: string; href: string; filter?: InsightFilter };
}

// ── 7 criteria from the offer letter, scored with rationale; the cite column
// names the surface in this app where the rationale's evidence lives. ──
const CRITERIA: Criterion[] = [
  {
    id: 'ui-design', label: 'UI Design', weight: 22, score: 78, status: 'on-track',
    offerText: 'Designing user interface components, workflows, and interaction patterns for assigned features within Exxat\'s software platform.',
    rationale: 'Raised 68 → 78 (Jul 20): ~80–85% of Course Eval screens designed, running AHEAD of documentation — Arun called it "absolutely the right approach". Held below target because assessment-creation screens shipped dev-built without design follow-through (Jul 13), and the Cohere-release design wrap is still open.',
    cite: { label: 'Portfolio', href: hrefPortfolio() },
  },
  {
    id: 'prototypes', label: 'Prototypes', weight: 20, score: 82, status: 'on-track',
    offerText: 'Creating wireframes, mockups, and interactive prototypes to support product development and usability improvements.',
    rationale: 'Raised 55 → 82: the Mar "no prototype exists" rationale is obsolete — by Jul 20 designs and prototypes run ahead of the documents, shared through Cloud Design to Aarti/Kunal/product (Jul 13). Remaining gap: prototypes live in shares, not a persistent artifact library the team can self-serve.',
    cite: { label: 'Portfolio pipeline', href: hrefPortfolio() },
  },
  {
    id: 'requirements', label: 'Requirements → Design', weight: 18, score: 88, status: 'strong',
    offerText: 'Translating product requirements and user stories into clear, user-centered interface designs.',
    rationale: 'Score 88. Works from Excel-only inputs where PRDs don\'t exist, recreating PM mocks into purposeful screens (Jul 13); multi-survey analytics designed with no PRD at all. Arun\'s operating guidance adopted: align with the PM by call before designing rather than assuming.',
    cite: { label: 'Briefings', href: hrefBriefings() },
  },
  {
    id: 'collaboration', label: 'PM + Eng Collaboration', weight: 16, score: 72, status: 'in-progress',
    offerText: 'Collaborating with product managers and engineering teams to ensure designs align with product requirements and technical constraints.',
    rationale: 'Adjusted 76 → 72 because the bar moved, not the work: Arun explicitly endorsed the skills ("skills we got") and named team consensus as THE gap (Jul 20) — the expectation is now arriving with a consensus plan, not individual escalations. Role boundary set Jul 6: share design ideas, PMs decide. Daily syncs agreed Jul 13. This is the primary growth axis for the next review.',
    cite: { label: 'Briefings', href: hrefBriefings() },
  },
  {
    id: 'design-reviews', label: 'Reviews + Specs', weight: 10, score: 58, status: 'at-risk',
    offerText: 'Participating in design reviews and supporting implementation by providing design specifications and clarifying design intent during development.',
    rationale: 'Score 58 — still the weak axis, now with sharper evidence: documentation lagging active development caused mid-build design surprises for devs (Jul 6); no formal tracking exists (no ADO/VSTS user stories, Jul 13). Two-sided (PMs lack PRDs too), but the offer-letter deliverable is design specs and they remain thin. Domain-expert review round now running (Jul 20) partially offsets.',
    cite: { label: 'Design-system evidence', href: hrefInsights({ q: 'design system' }), filter: { q: 'design system' } },
  },
  {
    id: 'usability', label: 'Usability + Feedback', weight: 8, score: 88, status: 'strong',
    offerText: 'Evaluating product usability through feedback from users and internal stakeholders to improve overall user experience.',
    rationale: 'Score 88. The NPS analysis and multi-persona research remain strong — 1,494 responses analysed, 8+ personas interviewed — and a domain-expert review round over the Course Eval designs is live (Jul 20). The gap is unchanged: Pendo behavioral data and SCCE under-representation.',
    cite: { label: 'NPS-sourced insights', href: hrefInsights({ source: 'NPS' }), filter: { source: 'NPS' } },
  },
  {
    id: 'accessibility', label: 'Accessibility + Compliance', weight: 6, score: 91, status: 'strong',
    offerText: 'Incorporating accessibility and compliance considerations, including applicable healthcare education regulations such as HIPAA, FERPA, and ADA, when designing product interfaces and workflows.',
    rationale: 'Highest-scoring criterion at 91. Program-level accommodation profiles are a first-to-market architecture decision; the WCAG 2.1 AA feature map is complete and the publish gate is designed. Note: Arun paused Himanshu\'s DS work to realign with the React library (Jul 20) — a11y specs stay with design in the meantime.',
    cite: { label: 'Accessibility evidence', href: hrefInsights({ tag: 'accessibility' }), filter: { tag: 'accessibility' } },
  },
];

const OVERALL = Math.round(CRITERIA.reduce((s, c) => s + c.score * (c.weight / 100), 0));

const STATUS_BADGE: Record<Status, { label: string; variant: 'success' | 'info' | 'warning' | 'error' }> = {
  strong: { label: 'Strong', variant: 'success' },
  'on-track': { label: 'On track', variant: 'info' },
  'in-progress': { label: 'In progress', variant: 'warning' },
  'at-risk': { label: 'At risk', variant: 'error' },
};

interface Row extends Record<string, unknown> {
  id: string;
  c: Criterion;
}

export function ArunPerformanceView() {
  const heroRows = [...CRITERIA]
    .sort((a, b) => b.score - a.score)
    .map((c) => ({
      key: c.id,
      label: c.label,
      value: c.score,
      hint: `weight ${c.weight}% · ${STATUS_BADGE[c.status].label.toLowerCase()}`,
      href: c.cite.href,
    }));

  const rows: Row[] = CRITERIA.map((c) => ({ id: c.id, c }));

  return (
    <VStack gap={5} padding={6} maxWidth={1100}>
      <PageHeader
        title="Performance Ledger"
        lede="Seven criteria from the official offer letter, cross-referenced with seven Arun sessions from the Granola transcripts and Obsidian notes — every Arun quote is verbatim, not paraphrased. The Jul 20 arc: skills endorsed, speed reframed as the skill signal, team consensus named as the growth axis."
        meta={`Weighted score ${OVERALL}/100 · offer letter: Kunal Vaishnav · Mar 15, 2026 · sessions Mar 24 → Aug 24, 2026 · reports to Arun Gautam · updated Aug 24`}
      />

      <Fig
        title={`Criterion scores against the ${TARGET} target`}
        caption={`Self-scored, editorial — not an external measurement. Rescored Jul 29 against the Mar–Jul session evidence: prototypes recovered from the sole at-risk criterion (55 → 82, designs now run ahead of documentation) while specs remain the weak axis and collaboration was re-based against Arun's new consensus expectation. Each bar links to the evidence surface its rationale cites. Weighted overall: ${OVERALL}/100.`}
        note={`Thresholds: red marks scores below 70; ${TARGET} is the stated target — bars between 70 and ${TARGET} are not yet at target even though they render in the default color.`}
      >
        <RankedList rows={heroRows} errorBelow={70} format={(r) => `${r.value}/100`} />
      </Fig>

      <Fig
        title="The 1:1 arc — nine sessions, Mar 24 → Aug 24"
        n={REVIEW_TIMELINE.length}
        caption="Sourced from Granola transcripts and the Obsidian meeting notes. The trajectory is the review: firefighting (Jun 9) → stabilizing (Jun 30–Jul 6) → candid process reset (Jul 13) → the positive turn (Jul 20) → communication root cause named (Aug 12) → delay pattern quantified with dashboard data (Aug 24)."
      >
        <List density="balanced" hasDividers>
          {REVIEW_TIMELINE.map((t) => (
            <Item
              key={t.date}
              as="li"
              label={`${t.date} — ${t.title}`}
              description={t.note}
              descriptionLines={3}
              endContent={<Badge variant={t.signal === 'positive' ? 'success' : t.signal === 'corrective' ? 'error' : t.signal === 'candid' ? 'warning' : 'neutral'} label={t.signal} />}
              align="start"
            />
          ))}
        </List>
      </Fig>

      <Fig
        title="The seven offer-letter criteria"
        caption="Weight is the offer letter's emphasis; the rationale states why each score is what it is. The cite column opens the surface in this app where the supporting evidence lives."
      >
        <Table<Row>
          data={rows}
          idKey="id"
          density="balanced"
          hasHover
          columns={[
            {
              key: 'criterion',
              header: 'Criterion',
              width: proportional(2),
              renderCell: (r: Row) => (
                <VStack gap={0.5}>
                  <HStack gap={2} vAlign="center">
                    <Text type="body" weight="semibold">
                      {r.c.label}
                    </Text>
                    <Badge variant={STATUS_BADGE[r.c.status].variant} label={STATUS_BADGE[r.c.status].label} />
                  </HStack>
                  <Text type="supporting" as="p" maxLines={2} hasTruncateTooltip textWrap="pretty">
                    {r.c.offerText}
                  </Text>
                </VStack>
              ),
            },
            { key: 'weight', header: 'Weight', width: pixel(80), align: 'end', renderCell: (r: Row) => <Text type="body" hasTabularNumbers>{r.c.weight}%</Text> },
            { key: 'score', header: 'Score', width: pixel(80), align: 'end', renderCell: (r: Row) => <Text type="body" hasTabularNumbers>{r.c.score}</Text> },
            {
              key: 'rationale',
              header: 'Rationale',
              width: proportional(3),
              renderCell: (r: Row) => (
                <Text type="supporting" as="p" textWrap="pretty">
                  {r.c.rationale}
                </Text>
              ),
            },
            {
              key: 'cite',
              header: 'Cites',
              width: pixel(190),
              renderCell: (r: Row) =>
                r.c.cite.filter ? (
                  <QueryLink
                    href={r.c.cite.href}
                    count={insightsWhere(r.c.cite.filter).length}
                    label={r.c.cite.label.toLowerCase()}
                    isStandalone={false}
                  />
                ) : (
                  <Link href={r.c.cite.href}>{r.c.cite.label} →</Link>
                ),
            },
          ]}
        />
      </Fig>

      <Card padding={4}>
        <Collapsible
          trigger={<Text type="label" color="secondary">{`Arun verbatim — ${ARUN_VERBATIM.length} direct quotes (raw transcripts · Mar 24 + Jul 20, 2026)`}</Text>}
          defaultIsOpen={false}
        >
          <List density="spacious" hasDividers>
            {ARUN_VERBATIM.map((q, i) => (
              <Item
                key={i}
                as="li"
                align="start"
                label={`“${q.quote}”`}
                labelLines={4}
                description={q.context}
                descriptionLines={2}
                endContent={<Citation source={{ title: q.source }} number={i + 1} variant="label" />}
              />
            ))}
          </List>
        </Collapsible>
      </Card>
    </VStack>
  );
}
