// views/ChangelogView.tsx — Changelog (v18 Astryx rebuild).
// Hero: build velocity — sessions synced per release as bars, the recorded
// corpus size as a line. Below, the full release table with changed-file
// tokens. This page may remain a leaf.
import { useMemo } from 'react';
import { Chart, ChartAxis, ChartGrid, bar, line, useChartColors } from '@astryxdesign/charts';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Token } from '@astryxdesign/core/Token';
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { VERSION_HISTORY } from '../data/personas';
import { VERSION, LAST_UPDATED, SESSIONS_SYNCED, INSIGHTS_TOTAL } from '../data/version';
import { PageHeader } from '../components/ui/PageHeader';
import { Fig } from '../components/charts/Fig';
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
}

export function ChangelogView() {
  const rows: Row[] = VERSION_HISTORY.map((entry, i) => ({ id: entry.version, entry, latest: i === 0 }));

  return (
    <VStack gap={5} padding={6} maxWidth={1100}>
      <PageHeader
        title="Changelog"
        lede="Every version pushed to soleyromit.github.io/rr-insights by Claude — the release history is the research velocity record."
        meta={`Current ${VERSION} · ${LAST_UPDATED} · ${INSIGHTS_TOTAL} insights · ${SESSIONS_SYNCED} sessions synced · zero manual push steps`}
      />

      <Fig
        title="Build velocity by release"
        caption="Bars are Granola sessions synced in each release; the line is the corpus size recorded in that release note. Counts are as recorded — early releases include metadata corrections, so the line is the ledger, not a smooth growth curve."
      >
        <VelocityChart />
      </Fig>

      <Table<Row>
        data={rows}
        idKey="id"
        density="balanced"
        hasHover
        columns={[
          {
            key: 'version',
            header: 'Version',
            width: pixel(110),
            renderCell: (r: Row) => (
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
            renderCell: (r: Row) => <Text type="supporting">{r.entry.date}</Text>,
          },
          {
            key: 'summary',
            header: 'Summary',
            width: proportional(3),
            renderCell: (r: Row) => (
              <Text type="supporting" as="p" maxLines={4} hasTruncateTooltip textWrap="pretty">
                {r.entry.summary}
              </Text>
            ),
          },
          {
            key: 'counts',
            header: 'Counts',
            width: pixel(120),
            renderCell: (r: Row) => (
              <VStack gap={0}>
                <Text type="supporting" hasTabularNumbers>
                  {r.entry.insightCount} insights
                </Text>
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
            renderCell: (r: Row) => (
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
