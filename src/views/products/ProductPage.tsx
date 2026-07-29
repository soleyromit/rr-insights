// views/products/ProductPage.tsx — the four-act product template (v18 Astryx).
// Acts, not tabs: Act 1 stakes, Act 2 evidence, Act 3 response, Act 4
// scoreboard. Every aggregate number is a door into the filtered corpus; the
// deep spec stays one click away.
import { useMemo } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Grid } from '@astryxdesign/core/Grid';
import { Card } from '@astryxdesign/core/Card';
import { ClickableCard } from '@astryxdesign/core/ClickableCard';
import { Heading } from '@astryxdesign/core/Heading';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Token } from '@astryxdesign/core/Token';
import { Badge } from '@astryxdesign/core/Badge';
import { Blockquote } from '@astryxdesign/core/Blockquote';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { PageHeader } from '../../components/ui/PageHeader';
import { Fig } from '../../components/charts/Fig';
import { VolumeChart } from '../../components/charts/VolumeChart';
import { SevDot, SevBadge } from '../../components/ui/sev';
import { getProduct } from '../../data/products';
import { PERSONAS, MILESTONES } from '../../data/personas';
import { insightsWhere } from '../../lib/selectors';
import { monthlyVolume } from '../../lib/series';
import { computePhaseStates } from '../../lib/phaseDates';
import { hrefCompetitive, hrefInsight, hrefInsights, hrefProduct, hrefProductSpec, hrefSignals } from '../../lib/links';
import type { Insight, SeverityLevel } from '../../types';

const personaName = (pid: string) => PERSONAS.find((p) => p.id === pid)?.name ?? pid;

interface AiRow extends Record<string, unknown> {
  id: string;
  feature: string;
  problem: string;
  status: string;
}

function Stat({ stat, label, href }: { stat: string; label: string; href?: string }) {
  const body = (
    <VStack gap={0.5}>
      <Text type="display-3" hasTabularNumbers>
        {stat}
      </Text>
      <Text type="supporting">{label}</Text>
    </VStack>
  );
  return href ? (
    <ClickableCard href={href} label={`${stat} ${label}`} padding={3}>
      {body}
    </ClickableCard>
  ) : (
    <Card padding={3}>{body}</Card>
  );
}

export function ProductPage({ productId }: { productId: string }) {
  const p = getProduct(productId);

  const insights = useMemo(() => insightsWhere({ product: productId }), [productId]);
  const critical = useMemo(() => insights.filter((i) => i.severity === 'critical'), [insights]);
  const volume = useMemo(() => monthlyVolume(insights), [insights]);
  const topEvidence = useMemo(
    () =>
      insights
        .filter((i) => i.severity === 'critical' || i.severity === 'high')
        .slice(0, 6),
    [insights]
  );
  const milestones = useMemo(() => MILESTONES.filter((m) => m.productId === productId), [productId]);

  if (!p) return <EmptyState title="Product not found" description={`No product "${productId}".`} />;

  const newest = [...insights].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))[0];
  const topReq = p.amPmPipeline.enhancementRequests[0];
  const phaseStates = computePhaseStates(p.roadmapPhases.map((ph) => ph.phase));
  const happySteps = p.happyPath.split('→').map((s) => s.trim());

  return (
    <VStack gap={5} padding={6} maxWidth={1080}>
      <PageHeader
        title={p.name}
        lede={p.description}
        meta={`${p.status} · ${p.userCount ?? 'internal'} · pilot ${p.pilotDate ?? 'tbd'} · launch ${p.launchDate ?? 'tbd'} · ${critical.length} critical open · newest evidence ${newest?.createdAt ?? 'n/a'} · loudest request: ${topReq?.request ?? 'none logged'}`}
      />

      {/* ── ACT 1 · THE STAKES ── */}
      <VStack gap={3}>
        <Heading level={2}>{p.hmwStatements[0]}</Heading>
        <Grid columns={{ minWidth: 150, max: 6 }} gap={2}>
          {p.daysToDeadline != null && (
            <Stat stat={`${p.daysToDeadline}d`} label={`to planned launch (${p.launchDate ?? 'per product plan'})`} />
          )}
          {p.nps != null && <Stat stat={`${p.nps}/5`} label="NPS baseline" />}
          {p.ticketsPerYear != null && <Stat stat={p.ticketsPerYear.toLocaleString()} label="support tickets / yr" />}
          <Stat stat={String(insights.length)} label="tagged insights" href={hrefInsights({ product: productId })} />
          <Stat
            stat={String(critical.length)}
            label="critical findings"
            href={hrefInsights({ product: productId, severity: 'critical' })}
          />
          <Stat stat={String(p.granolaSessions)} label="research sessions" />
        </Grid>
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
          title="Evidence volume by month"
          caption="A rising line means the problem space is live and design responses stay provisional; a settled line clears the way to commit. Red line is the critical-only split."
        >
          <VolumeChart data={volume} height={180} />
        </Fig>
        <VStack gap={2}>
          <HStack hAlign="between" vAlign="center">
            <Text type="label" color="secondary">
              Critical and high findings — each row opens the full artifact
            </Text>
            <Link href={hrefSignals()}>drill into Signals →</Link>
          </HStack>
          {topEvidence.map((i: Insight) => (
            <Card key={i.id} padding={3}>
              <VStack gap={1}>
                <HStack gap={2} vAlign="center">
                  <SevDot severity={i.severity as SeverityLevel} />
                  <Text type="supporting">
                    {i.source} · {i.createdAt}
                  </Text>
                </HStack>
                <Link href={hrefInsight(i.id, productId)}>
                  <Text type="body" maxLines={2} hasTruncateTooltip={false}>
                    {i.text}
                  </Text>
                </Link>
              </VStack>
            </Card>
          ))}
          <Link href={hrefInsights({ product: productId, severity: 'high' })} isStandalone>
            All high-severity findings for {p.shortName} →
          </Link>
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
                Milestones on record
              </Text>
              {milestones.map((m) => (
                <HStack key={m.label} gap={2} vAlign="center" wrap="wrap">
                  <Text type="supporting" hasTabularNumbers>
                    {m.date}
                  </Text>
                  <Text type="body">{m.label}</Text>
                  {m.isHardDeadline && <Badge variant="error" label="hard deadline" />}
                </HStack>
              ))}
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
