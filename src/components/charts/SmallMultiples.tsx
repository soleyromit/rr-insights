// components/charts/SmallMultiples.tsx — aligned mini area charts (v19).
// Shared y-domain and a shared zero-filled month domain (caller uses
// series.fillMonths) so cells are comparable; a cell without those guarantees
// would silently lie. Capped at 6 cells (max-series discipline).
import { Grid } from '@astryxdesign/core/Grid';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Link } from '@astryxdesign/core/Link';
import { Badge } from '@astryxdesign/core/Badge';
import { Chart, area, useChartColors } from '@astryxdesign/charts';
import type { MonthPoint } from '../../lib/series';

export interface SmallMultipleGroup {
  key: string;
  label: string;
  href?: string;
  n: number;
  points: MonthPoint[];
}

export interface SmallMultiplesProps {
  groups: SmallMultipleGroup[];
  height?: number;
}

export function SmallMultiples({ groups, height = 72 }: SmallMultiplesProps) {
  const colors = useChartColors();
  const [blue] = colors.categorical(1);
  const shown = groups.slice(0, 6);
  const yMax = Math.max(1, ...shown.flatMap((g) => g.points.map((p) => p.total)));
  return (
    <Grid columns={{ minWidth: 180, max: 3 }} gap={4}>
      {shown.map((g) => (
        <VStack key={g.key} gap={1}>
          <HStack gap={2} vAlign="center" hAlign="between">
            {g.href ? <Link href={g.href}>{g.label}</Link> : <Text type="supporting">{g.label}</Text>}
            <Badge variant="neutral" label={`n = ${g.n}`} />
          </HStack>
          <Chart
            data={g.points as unknown as Record<string, unknown>[]}
            xKey="label"
            height={height}
            yDomain={[0, Math.ceil(yMax * 1.1)]}
            series={[area('total', { color: blue, gradient: true })]}
          />
        </VStack>
      ))}
    </Grid>
  );
}
