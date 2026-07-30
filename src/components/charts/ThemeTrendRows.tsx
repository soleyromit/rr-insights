// components/charts/ThemeTrendRows.tsx — longitudinal theme trending (v19.5).
// One row per theme: name (a door), aligned sparkline on the shared month
// domain, corpus size, and a 30d-vs-prior delta. Ranked-sparkline table instead
// of a 12-line spaghetti chart — identity by label, never by 12 hues.
import { Grid } from '@astryxdesign/core/Grid';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Badge } from '@astryxdesign/core/Badge';
import { Sparkline } from './Sparkline';
import { TrendDelta } from './TrendDelta';
import { getTheme } from '../../data/themes';
import { hrefInsights } from '../../lib/links';
import type { MonthPoint } from '../../lib/series';

export interface ThemeTrendRow {
  key: string;
  n: number;
  points: MonthPoint[];
  current: number;
  prior: number;
  /** Custom display label — defaults to the theme title for the key. */
  label?: string;
  /** Custom door — defaults to the theme-filtered index. */
  href?: string;
}

export function ThemeTrendRows({ rows }: { rows: ThemeTrendRow[] }) {
  return (
    <Grid columns={{ minWidth: 300, max: 2 }} gap={3}>
      {rows.map((r) => (
        <HStack key={r.key} gap={3} vAlign="center" hAlign="between">
          <HStack gap={2} vAlign="center">
            <Link href={r.href ?? hrefInsights({ theme: r.key })}>
              <Text type="supporting" maxLines={1} hasTruncateTooltip={false}>
                {r.label ?? getTheme(r.key)?.title ?? r.key}
              </Text>
            </Link>
            <Badge variant="neutral" label={`n = ${r.n}`} />
          </HStack>
          <HStack gap={2} vAlign="center">
            <Sparkline data={r.points.map((p) => ({ label: p.label, value: p.total }))} height={32} tone="neutral" />
            <TrendDelta current={r.current} prior={r.prior} windowLabel="vs prior 30d" />
          </HStack>
        </HStack>
      ))}
    </Grid>
  );
}
