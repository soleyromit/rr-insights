// views/products/ProductPage.tsx — the product template (v19 redesign).
// Act 0 answers "what changed since you last looked" before the four-act case:
// Act 1 stakes, Act 2 evidence, Act 3 response, Act 4 scoreboard. Every
// aggregate number is a door into the filtered corpus.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid, GridSpan } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Token } from '@astryxdesign/core/Token';
import { Badge } from '@astryxdesign/core/Badge';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Collapsible } from '@astryxdesign/core/Collapsible';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { ThemeStrip } from '../../components/insight/ThemeStrip';
import { Fig } from '../../components/charts/Fig';
import { Sparkline } from '../../components/charts/Sparkline';
import { TrendDelta } from '../../components/charts/TrendDelta';
import { SeverityStackChart } from '../../components/charts/SeverityStackChart';
import { FindingsFeed } from '../../components/story/FindingsFeed';
import { EvidenceList } from '../../components/story/EvidenceRow';
import { StatTile, StatTileRow } from '../../components/story/StatTile';
import { QueryLink } from '../../components/story/QueryLink';
import { StalenessMeter } from '../../components/story/StalenessMeter';
import { SevBadge } from '../../components/ui/sev';
import { getProduct } from '../../data/products';
import { PERSONAS, MILESTONES } from '../../data/personas';
import { insightsWhere, productFacts, allSignals } from '../../lib/selectors';
import { monthlyVolume, fillMonths, monthDomain, severityByMonth } from '../../lib/series';
import { computePhaseStates, milestoneState } from '../../lib/phaseDates';
import { hrefCompetitive, hrefInsights, hrefProduct, hrefProductSpec } from '../../lib/links';
import { formatDay } from '../../lib/format';
import type { SeverityLevel } from '../../types';
import type { ProductId } from '../../types';

const personaName = (pid: string) => PERSONAS.find((p) => p.id === pid)?.name ?? pid;

interface AiRow extends Record<string, unknown> {
  id: string;
  feature: string;
  problem: string;
  status: string;
}

const MILESTONE_BADGE: Record<string, 'neutral' | 'info' | 'warning'> = {
  passed: 'neutral',
  later: 'info',
  unscheduled: 'warning',
};

export function ProductPage({ productId }: { productId: string }) {
  const p = getProduct(productId);

  const insights = useMemo(() => insightsWhere({ product: productId }), [productId]);
  const facts = productFacts(productId);
  const spark = useMemo(
    () =>
      fillMonths(monthlyVolume(insights), monthDomain(insights))
        .slice(-6)
        .map((pt) => ({ label: pt.label, value: pt.total })),
    [insights]
  );
  const sevMonths = useMemo(
    () => severityByMonth(insights).map((m) => ({ category: m.label, critical: m.critical, high: m.high, medium: m.medium, low: m.low })),
    [insights]
  );
  const topEvidence = useMemo(
    () => insights.filter((i) => i.severity === 'critical' || i.severity === 'high'),
    [insights]
  );
  const highCount = useMemo(() => insights.filter((i) => i.severity === 'high').length, [insights]);
  const topSignals = useMemo(
    () =>
      allSignals()
        .map((sig) => ({ sig, members: sig.byProduct[productId as ProductId] ?? 0 }))
        .filter((s) => s.members > 0)
        .sort((a, b) => b.members - a.members)
        .slice(0, 2),
    [productId]
  );
  const milestones = useMemo(() => MILESTONES.filter((m) => m.productId === productId), [productId]);

  if (!p) return <EmptyState title="Product not found" description={`No product "${productId}".`} />;

  const phaseStates = computePhaseStates(p.roadmapPhases.map((ph) => ph.phase));
  const happySteps = p.happyPath.split('→').map((s) => s.trim());
  const foldCount = p.newFeatureFramework.microInteractions.length + p.amPmPipeline.pendingDecisions.length;

  return (
    <VStack gap={5} padding={6} maxWidth={1080}>
      <PageHeader
        title={p.name}
        lede={p.description}
        meta={`${p.status} · ${p.userCount ?? 'internal'} · launch ${p.launchDate ?? 'tbd'}`}
        facts={[
          { value: String(facts.n), label: 'insights', href: hrefInsights({ product: productId }) },
          {
            value: String(facts.critical),
            label: 'critical open',
            href: hrefInsights({ product: productId, severity: 'critical' }),
          },
          { value: facts.newestDate ? formatDay(facts.newestDate) : '—', label: 'newest evidence' },
        ]}
      />

      {/* ── ACT 0 · WHAT'S NEW ── */}
      <Grid columns={4} gap={4}>
        <GridSpan columns={3}>
          <FindingsFeed
            insights={insights}
            from={productId}
            limit={5}
            showProducts={false}
            header={
              <Text type="label" color="secondary">
                What's new
              </Text>
            }
            emptyLabel="No evidence captured for this product yet."
          />
        </GridSpan>
        <VStack gap={2}>
          <Text type="label" color="secondary">
            Momentum
          </Text>
          {spark.length > 1 && <Sparkline data={spark} height={40} />}
          <TrendDelta current={facts.last30d} prior={facts.prior30d} windowLabel="vs prior 30d" />
          <StalenessMeter newestDate={facts.newestDate} staleDays={facts.staleDays} />
          <QueryLink
            href={hrefInsights({ product: productId, sort: 'newest' })}
            count={facts.n}
            label="insights, newest first"
          />
        </VStack>
      </Grid>

      {/* ── ACT 1 · THE STAKES ── */}
      <VStack gap={3}>
        <Heading level={2}>{p.hmwStatements[0]}</Heading>
        <StatTileRow>
          {p.daysToDeadline != null && (
            <StatTile value={`${p.daysToDeadline}d`} label={`to planned launch (${p.launchDate ?? 'per product plan'})`} />
          )}
          {p.nps != null && <StatTile value={`${p.nps}/5`} label="NPS baseline" />}
          {p.ticketsPerYear != null && <StatTile value={p.ticketsPerYear.toLocaleString()} label="support tickets / yr" />}
          <StatTile value={facts.n} label="tagged insights" href={hrefInsights({ product: productId })} />
          <StatTile
            value={facts.critical}
            label="critical findings"
            href={hrefInsights({ product: productId, severity: 'critical' })}
          />
          <StatTile value={p.granolaSessions} label="research sessions" />
        </StatTileRow>
        <ThemeStrip productId={productId} />
        <Blockquote cite={p.keyQuoteSource}>{p.keyQuote}</Blockquote>
        <Grid columns={{ minWidth: 240, max: 3 }} gap={3}>
          {Object.entries(p.dayInLife).map(([pid, day]) => (
            <Card key={pid} variant="muted" padding={3}>
              <VStack gap={1}>
                <Text type="label" color="secondary">
                  {personaName(pid)} · today
                </Text>
                <Text type="supporting" as="p" textWrap="pretty">
                  {day}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>

      {/* ── ACT 2 · THE EVIDENCE ── */}
      <VStack gap={3}>
        <Heading level={2}>What the research says</Heading>
        <Fig
          title="Severity mix by month"
          caption={`${facts.last30d} of ${facts.n} insights landed in the last 30 days. Red is critical: a growing red band into a deadline is the escalation argument.`}
          n={facts.n}
        >
          <SeverityStackChart data={sevMonths} height={200} />
        </Fig>
        <VStack gap={2}>
          <HStack hAlign="between" vAlign="center" wrap="wrap" gap={3}>
            <Text type="label" color="secondary">
              Critical and high findings — each row opens the full artifact
            </Text>
            <HStack gap={4} wrap="wrap">
              {topSignals.map(({ sig, members }) => (
                <QueryLink
                  key={sig.def.id}
                  href={hrefInsights({ signal: sig.def.id, product: productId })}
                  count={members}
                  label={`in Signal: ${sig.def.title}`}
                  isStandalone={false}
                />
              ))}
            </HStack>
          </HStack>
          <EvidenceList insights={topEvidence} from={productId} limit={6} order="score" showProducts={false} />
          <QueryLink
            href={hrefInsights({ product: productId, severity: 'high' })}
            count={highCount}
            label={`high-severity findings for ${p.shortName}`}
          />
        </VStack>
        <Grid columns={{ minWidth: 200, max: 4 }} gap={3}>
          {Object.entries(p.gapsByDiscipline).map(([disc, gaps]) => (
            <Card key={disc} variant="muted" padding={3}>
              <VStack gap={1.5}>
                <Text type="label" color="secondary">
                  {disc} gaps · {(gaps as string[]).length}
                </Text>
                {(gaps as string[]).map((g, i) => (
                  <Text key={i} type="supporting" as="p" textWrap="pretty">
                    {g}
                  </Text>
                ))}
              </VStack>
            </Card>
          ))}
        </Grid>
      </VStack>

      {/* ── ACT 3 · THE DESIGN RESPONSE ── */}
      <VStack gap={3}>
        <Heading level={2}>The design response</Heading>
        <Card padding={4}>
          <VStack gap={2}>
            <Text type="label" color="secondary">
              The happy path this product is building toward
            </Text>
            <VStack gap={1.5}>
              {happySteps.map((step, i) => (
                <HStack key={i} gap={2} vAlign="center">
                  <Badge variant="neutral" label={String(i + 1)} />
                  <Text type="body">{step}</Text>
                </HStack>
              ))}
            </VStack>
          </VStack>
        </Card>
        <Fig
          title="AI, embedded as product behavior"
          caption="Problem first, feature second — each row names the user problem the AI feature answers and the sprint that owns it."
        >
          <Table<AiRow>
            data={p.newFeatureFramework.aiOpportunities.map((ai) => ({ id: ai.feature, ...ai }))}
            idKey="id"
            density="balanced"
            columns={[
              { key: 'feature', header: 'Feature', width: pixel(230), renderCell: (r) => <Text type="body" weight="semibold">{r.feature}</Text> },
              { key: 'problem', header: 'Problem it answers', width: proportional(3), renderCell: (r) => <Text type="supporting" as="p" textWrap="pretty">{r.problem}</Text> },
              { key: 'status', header: 'When', width: pixel(110), renderCell: (r) => <Badge variant="info" label={r.status} /> },
            ]}
          />
        </Fig>
        <Grid columns={{ minWidth: 340, max: 2 }} gap={4}>
          <Card padding={4}>
            <VStack gap={2}>
              <Text type="label" color="secondary">
                Enhancement requests, by evidence weight
              </Text>
              {p.amPmPipeline.enhancementRequests.map((r) => (
                <VStack key={r.request} gap={0.5}>
                  <HStack gap={2} vAlign="center">
                    <SevBadge severity={r.priority as SeverityLevel} />
                    <Text type="body">{r.request}</Text>
                  </HStack>
                  <Text type="supporting">
                    {r.requestedBy} · {r.sessions} session{r.sessions > 1 ? 's' : ''}
                  </Text>
                </VStack>
              ))}
            </VStack>
          </Card>
          <VStack gap={4}>
            <VStack gap={1.5}>
              <Text type="label" color="secondary">
                Design system components in scope
              </Text>
              <HStack gap={1.5} wrap="wrap">
                {p.newFeatureFramework.designSystemComponents.map((c) => (
                  <Token key={c} label={c} />
                ))}
              </HStack>
            </VStack>
            <Collapsible
              trigger={
                <Text type="label" color="secondary">
                  Micro-interactions & pending decisions · {foldCount}
                </Text>
              }
              defaultIsOpen={false}
            >
              <VStack gap={3}>
                <VStack gap={1}>
                  <Text type="label" color="secondary">
                    Micro-interactions · clinical-grade motion
                  </Text>
                  {p.newFeatureFramework.microInteractions.map((m, i) => (
                    <Text key={i} type="supporting" as="p" textWrap="pretty">
                      {m}
                    </Text>
                  ))}
                </VStack>
                <VStack gap={1}>
                  <Text type="label" color="secondary">
                    Pending decisions
                  </Text>
                  {p.amPmPipeline.pendingDecisions.map((d, i) => (
                    <Text key={i} type="supporting" as="p" textWrap="pretty">
                      {d}
                    </Text>
                  ))}
                </VStack>
              </VStack>
            </Collapsible>
          </VStack>
        </Grid>
      </VStack>

      {/* ── ACT 4 · THE SCOREBOARD ── */}
      <VStack gap={3}>
        <Heading level={2}>The scoreboard</Heading>
        <Fig
          title="Roadmap phases"
          caption="Phase state is derived from dates in the plan itself, never from array position. Unscheduled = no parseable date recorded; passed = the date is behind us."
        >
          <Grid columns={{ minWidth: 200, max: 4 }} gap={2}>
            {p.roadmapPhases.map((ph, i) => {
              const st = phaseStates[i].state;
              return (
                <Card key={ph.phase} variant={st === 'next' ? 'blue' : 'muted'} padding={3}>
                  <VStack gap={1}>
                    <HStack gap={2} vAlign="center" hAlign="between">
                      <Text type="body" weight="semibold">
                        {ph.phase}
                      </Text>
                      <Badge
                        variant={st === 'next' ? 'info' : st === 'passed' ? 'neutral' : st === 'unscheduled' ? 'warning' : 'neutral'}
                        label={st}
                      />
                    </HStack>
                    {ph.items.map((it, j) => (
                      <Text key={j} type="supporting" as="p" textWrap="pretty">
                        {it}
                      </Text>
                    ))}
                  </VStack>
                </Card>
              );
            })}
          </Grid>
        </Fig>
        {milestones.length > 0 && (
          <Card padding={4}>
            <VStack gap={2}>
              <Text type="label" color="secondary">
                Milestones on record — state derived from the date, never the data's status field
              </Text>
              {milestones.map((m) => {
                const st = milestoneState(m.date);
                return (
                  <HStack key={m.label} gap={2} vAlign="center" wrap="wrap">
                    <Text type="supporting" hasTabularNumbers>
                      {m.date}
                    </Text>
                    <Text type="body">{m.label}</Text>
                    <Badge variant={MILESTONE_BADGE[st] ?? 'neutral'} label={st} />
                    {m.isHardDeadline && <Badge variant="error" label="hard deadline" />}
                  </HStack>
                );
              })}
            </VStack>
          </Card>
        )}
        <Grid columns={{ minWidth: 300, max: 2 }} gap={4}>
          <Card padding={4}>
            <VStack gap={2}>
              <Text type="label" color="secondary">
                Depends on
              </Text>
              {p.productDependencies.map((d) => (
                <HStack key={d.product} gap={2} vAlign="center" wrap="wrap">
                  <Token label={getProduct(d.product)?.shortName ?? d.product} href={hrefProduct(d.product)} color="blue" />
                  <Text type="supporting">{d.dependency}</Text>
                </HStack>
              ))}
            </VStack>
          </Card>
          <Card padding={4}>
            <VStack gap={2}>
              <Text type="label" color="secondary">
                Competes with
              </Text>
              <HStack gap={1.5} wrap="wrap">
                {p.competitors.map((c) => (
                  <Token key={c} label={c} />
                ))}
              </HStack>
              <Link href={hrefCompetitive(productId)} isStandalone>
                Full parity matrix →
              </Link>
            </VStack>
          </Card>
        </Grid>
        <HStack gap={4} wrap="wrap">
          <Link href={hrefProductSpec(productId)} isStandalone>
            Full spec archive (pre-audit deep dive) →
          </Link>
          {productId === 'exam-management' && (
            <>
              <Link href="/products/exam-management/audit" isStandalone>
                Exam Admin Audit →
              </Link>
              <Link href="/products/exam-management/ia" isStandalone>
                Navigation IA →
              </Link>
            </>
          )}
        </HStack>
      </VStack>
    </VStack>
  );
}
