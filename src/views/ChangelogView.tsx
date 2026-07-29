// views/ChangelogView.tsx — Changelog (v19, light touch). Hero: build velocity
// as bars + corpus line. The release table gains row expansion (full release
// note inside the row) and a corpus TrendDelta against the prior release in
// the Counts column. This page remains a leaf on purpose.
import { useMemo, useState } from 'react';
import { Chart, ChartAxis, ChartGrid, bar, line, useChartColors } from '@astryxdesign/charts';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Token } from '@astryxdesign/core/Token';
import { Table, pixel, proportional, useTableRowExpansion, useTableRowExpansionState } from '@astryxdesign/core/Table';
import { VERSION_HISTORY } from '../data/personas';
import { VERSION, LAST_UPDATED, SESSIONS_SYNCED, INSIGHTS_TOTAL } from '../data/version';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
import { TrendDelta } from '../components/charts/TrendDelta';
import type { VersionEntry } from '../types';

const FILE_TOKEN_LIMIT = 4;

function VelocityChart() {
  const colors = useChartColors();
  const [c0, c1] = colors.categorical(2);
  const data = useMemo(
    () =>
      [...VERSION_HISTORY]
        .reverse()
        .map((e) => ({ version: e.version, corpus: e.insightCount, sessions: e.sessionsAdded })),
    []
  );
  const yMax = Math.max(...data.map((d) => d.corpus));
  return (
    <Chart
      data={data as unknown as Record<string, unknown>[]}
      xKey="version"
      height={220}
      yDomain={[0, Math.ceil(yMax * 1.1)]}
      series={[
        bar('sessions', { color: c1, label: 'Sessions synced in release' }),
        line('corpus', { color: c0, strokeWidth: 2, label: 'Recorded corpus size' }),
      ]}
      grid={<ChartGrid horizontal tickCount={4} />}
      axes={
        <>
          <ChartAxis position="bottom" maxTicks={10} />
          <ChartAxis position="left" tickCount={4} />
        </>
      }
      legend
      tooltip
    />
  );
}

interface Row extends Record<string, unknown> {
  id: string;
  entry: VersionEntry;
  latest: boolean;
  /** Prior (older) release's recorded corpus size, for the Counts delta. */
  priorCount?: number;
  kind: 'release' | 'note';
}

export function ChangelogView() {
  const baseRows: Row[] = useMemo(
    () =>
      VERSION_HISTORY.map((entry, i) => ({
        id: entry.version,
        entry,
        latest: i === 0,
        priorCount: VERSION_HISTORY[i + 1]?.insightCount,
        kind: 'release' as const,
      })),
    []
  );

  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());
  const { data, expansionConfig } = useTableRowExpansionState<Row>({
    baseData: baseRows,
    getChildren: (r) =>
      r.kind === 'release'
        ? [{ id: `${r.entry.version}-note`, entry: r.entry, latest: false, kind: 'note' as const }]
        : [],
    getRowKey: (r) => r.id,
    expandedKeys,
    setExpandedKeys,
  });
  const expansion = useTableRowExpansion<Row>({ ...expansionConfig, hasRowClickExpansion: true });

  return (
    <VStack gap={5} padding={6} maxWidth={1100}>
      <PageHeader
        title="Changelog"
        lede="Every version pushed to soleyromit.github.io/rr-insights by Claude — the release history is the research velocity record. Click a row for the full release note."
        meta={`Current ${VERSION} · ${LAST_UPDATED} · ${INSIGHTS_TOTAL} insights · ${SESSIONS_SYNCED} sessions synced · zero manual push steps`}
      />

      <Fig
        title="Build velocity by release"
        caption="Bars are Granola sessions synced in each release; the line is the corpus size recorded in that release note. Counts are as recorded — early releases include metadata corrections, so the line is the ledger, not a smooth growth curve."
      >
        <VelocityChart />
      </Fig>

      <Table<Row>
        data={data}
        idKey="id"
        density="balanced"
        hasHover
        plugins={{ expansion }}
        columns={[
          {
            key: 'version',
            header: 'Version',
            width: pixel(120),
            renderCell: (r: Row) =>
              r.kind === 'note' ? null : (
                <VStack gap={0.5}>
                  <Text type="body" weight="semibold" hasTabularNumbers>
                    {r.entry.version}
                  </Text>
                  {r.latest && <Badge variant="info" label="latest" />}
                </VStack>
              ),
          },
          {
            key: 'date',
            header: 'Date',
            width: pixel(110),
            renderCell: (r: Row) =>
              r.kind === 'note' ? null : <Text type="supporting">{r.entry.date}</Text>,
          },
          {
            key: 'summary',
            header: 'Summary',
            width: proportional(3),
            renderCell: (r: Row) =>
              r.kind === 'note' ? (
                <Text type="supporting" as="p" textWrap="pretty">
                  {r.entry.summary}
                </Text>
              ) : (
                <Text type="supporting" as="p" maxLines={2} textWrap="pretty">
                  {r.entry.summary}
                </Text>
              ),
          },
          {
            key: 'counts',
            header: 'Counts',
            width: pixel(170),
            renderCell: (r: Row) =>
              r.kind === 'note' ? null : (
                <VStack gap={0.5}>
                  <Text type="supporting" hasTabularNumbers>
                    {r.entry.insightCount} insights
                  </Text>
                  {r.priorCount !== undefined && (
                    <TrendDelta
                      current={r.entry.insightCount}
                      prior={r.priorCount}
                      windowLabel="vs prior release"
                    />
                  )}
                  {r.entry.sessionsAdded > 0 && (
                    <Text type="supporting" hasTabularNumbers>
                      +{r.entry.sessionsAdded} sessions
                    </Text>
                  )}
                </VStack>
              ),
          },
          {
            key: 'files',
            header: 'Changed files',
            width: proportional(2),
            renderCell: (r: Row) =>
              r.kind === 'note' ? null : (
                <HStack gap={1} wrap="wrap">
                  {r.entry.changedFiles.slice(0, FILE_TOKEN_LIMIT).map((f) => (
                    <Token key={f} label={f.split('/').pop() ?? f} size="sm" />
                  ))}
                  {r.entry.changedFiles.length > FILE_TOKEN_LIMIT && (
                    <Token label={`+${r.entry.changedFiles.length - FILE_TOKEN_LIMIT}`} size="sm" />
                  )}
                </HStack>
              ),
          },
        ]}
      />

      <Text type="supporting">
        Pushed directly by Claude via PAT → GitHub Actions → GitHub Pages. Zero manual steps.
      </Text>
    </VStack>
  );
}
