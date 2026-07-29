// views/products/spec/StoryTable.tsx — user stories as a real table (v18).
// Replaces the old per-story card walls across all product spec pages.
import { Table, pixel, proportional } from '@astryxdesign/core/Table';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';

export interface StoryRow extends Record<string, unknown> {
  id: string;
  who: string;
  what: string;
  why: string;
  source: string;
  priority?: string;
}

const PRIORITY_VARIANT: Record<string, 'error' | 'warning' | 'info'> = {
  P0: 'error',
  P1: 'warning',
  P2: 'info',
};

export function StoryTable({ rows }: { rows: StoryRow[] }) {
  const hasPriority = rows.some((r) => r.priority);
  return (
    <Table<StoryRow>
      data={rows}
      idKey="id"
      density="balanced"
      columns={[
        { key: 'id', header: 'ID', width: pixel(70), renderCell: (r) => <Text type="code">{r.id}</Text> },
        ...(hasPriority
          ? [
              {
                key: 'priority',
                header: 'Pri',
                width: pixel(60),
                renderCell: (r: StoryRow) =>
                  r.priority ? <Badge variant={PRIORITY_VARIANT[r.priority] ?? 'info'} label={r.priority} /> : null,
              },
            ]
          : []),
        { key: 'who', header: 'As a…', width: pixel(150), renderCell: (r) => <Text type="supporting">{r.who}</Text> },
        {
          key: 'what',
          header: 'I need to… / so that…',
          width: proportional(3),
          renderCell: (r) => (
            <Text type="supporting" as="p" textWrap="pretty">
              {r.what} — {r.why}
            </Text>
          ),
        },
        { key: 'source', header: 'Source', width: pixel(180), renderCell: (r) => <Text type="supporting">{r.source}</Text> },
      ]}
    />
  );
}
