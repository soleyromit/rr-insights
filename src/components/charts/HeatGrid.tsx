// components/charts/HeatGrid.tsx — categorical matrix as a CSS grid of linked
// cells (v18). Chosen over heatmapGL: cells here are queries (each one links to
// the insight list that produces it), which a WebGL canvas can't give us, and
// the matrices are small (≤ 7×5). Sequential color = one hue, light→dark.
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { useChartColors } from '@astryxdesign/charts';
import { Link } from 'react-router-dom';

export interface HeatCell {
  value: number;
  label?: string;
  href?: string;
  title?: string;
}

export interface HeatGridProps {
  rows: string[];
  cols: string[];
  /** cell(rowIndex, colIndex) */
  cell: (r: number, c: number) => HeatCell | undefined;
  legend?: { low: string; high: string };
  /** Make row labels doors too. */
  rowHref?: (r: number) => string | undefined;
  /** Annotation for zero cells, e.g. "no evidence — coverage gap". */
  emptyHint?: string;
}

export function HeatGrid({ rows, cols, cell, legend, rowHref, emptyHint }: HeatGridProps) {
  const colors = useChartColors();
  // The theme returns the ramp low→high for the active mode (in dark mode the
  // high end is the brighter, higher-contrast step). Trust its order.
  const steps = colors.sequential.blue(5);
  let max = 1;
  for (let r = 0; r < rows.length; r++)
    for (let c = 0; c < cols.length; c++) max = Math.max(max, cell(r, c)?.value ?? 0);

  const bg = (v: number) => (v <= 0 ? 'transparent' : steps[Math.min(4, Math.floor((v / max) * 5))]);
  const ink = (v: number) => {
    if (v <= 0) return undefined;
    return luminance(bg(v)) < 0.45 ? '#ffffff' : '#171717';
  };

  return (
    <VStack gap={2}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `minmax(120px, auto) repeat(${cols.length}, minmax(0, 1fr))`,
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        <span />
        {cols.map((c) => (
          <Text key={c} type="supporting" justify="center" maxLines={1} hasTruncateTooltip>
            {c}
          </Text>
        ))}
        {rows.map((rLabel, r) => (
          <FragmentRow key={rLabel} label={rLabel} href={rowHref?.(r)}>
            {cols.map((cLabel, c) => {
              const d = cell(r, c);
              const v = d?.value ?? 0;
              const body = (
                <span
                  title={d?.title ?? (v <= 0 && emptyHint ? `${rLabel} × ${cLabel}: ${emptyHint}` : `${rLabel} × ${cLabel}: ${v}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 34,
                    borderRadius: 4,
                    background: bg(v),
                    color: ink(v),
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: 12,
                    border: v <= 0 ? '1px dashed var(--color-border, #e5e5e5)' : 'none',
                  }}
                >
                  {d?.label ?? (v > 0 ? v : '')}
                </span>
              );
              return d?.href ? (
                <Link key={cLabel} to={d.href} style={{ textDecoration: 'none' }} aria-label={d?.title}>
                  {body}
                </Link>
              ) : (
                <span key={cLabel}>{body}</span>
              );
            })}
          </FragmentRow>
        ))}
      </div>
      {legend && (
        <Text type="supporting">
          {legend.low} → {legend.high} (more prominent = more)
        </Text>
      )}
    </VStack>
  );
}

function luminance(hex: string): number {
  const m = hex.replace('#', '');
  if (m.length < 6) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(m.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function FragmentRow({ label, href, children }: { label: string; href?: string; children: React.ReactNode }) {
  return (
    <>
      {href ? (
        <Link to={href} style={{ textDecoration: 'none' }}>
          <Text type="supporting" maxLines={1} hasTruncateTooltip color="inherit">
            {label}
          </Text>
        </Link>
      ) : (
        <Text type="supporting" maxLines={1} hasTruncateTooltip>
          {label}
        </Text>
      )}
      {children}
    </>
  );
}
