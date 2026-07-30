// components/charts/FlowChart.tsx — three-column evidence flow (v19.5).
// A compact sankey: where evidence comes from (products), what it's about
// (themes), how urgent it is (tiers). Ribbons are one neutral hue at low
// opacity — identity lives in node labels and positions, never in 20 ribbon
// colors. Node accents reuse the entities' own colors (they encode the entity).
import { useMemo } from 'react';

export interface FlowNode {
  id: string;
  label: string;
  color?: string; // entity accent for the node bar only
}

export interface FlowLink {
  from: string; // node id in column c
  to: string; // node id in column c+1
  value: number;
}

export interface FlowChartProps {
  columns: FlowNode[][]; // ordered columns of nodes
  links: FlowLink[]; // links between adjacent columns
  height?: number;
}

const W = 900;
const NODE_W = 10;
const GAP = 8;
const LABEL_W = 150;

interface Placed extends FlowNode {
  x: number;
  y: number;
  h: number;
  col: number;
  total: number;
  /** True entity count for the label: outbound (1 link per insight) except the
   * last column, which only receives. Inbound on middle columns can exceed it
   * when a source multi-counts (e.g. multi-product insights). */
  labelTotal: number;
}

export function FlowChart({ columns, links, height = 420 }: FlowChartProps) {
  const placed = useMemo(() => {
    const totals = new Map<string, number>();
    for (const l of links) {
      totals.set(l.from, (totals.get(l.from) ?? 0) + l.value);
      totals.set(l.to, (totals.get(l.to) ?? 0) + l.value);
    }
    // Geometry uses the larger side so ribbons never overflow the node; the
    // label uses the true count (see Placed.labelTotal).
    const nodeTotal = (id: string, col: number) => {
      const inbound = links.filter((l) => l.to === id).reduce((a, l) => a + l.value, 0);
      const outbound = links.filter((l) => l.from === id).reduce((a, l) => a + l.value, 0);
      return {
        geom: col === 0 ? outbound : col === columns.length - 1 ? inbound : Math.max(inbound, outbound),
        label: col === columns.length - 1 ? inbound : outbound,
      };
    };
    const colX = (c: number) => LABEL_W + (c * (W - 2 * LABEL_W - NODE_W)) / Math.max(1, columns.length - 1);
    const out = new Map<string, Placed>();
    columns.forEach((col, c) => {
      const nodes = col
        .map((n) => {
          const t = nodeTotal(n.id, c);
          return { ...n, total: t.geom, labelTotal: t.label };
        })
        .filter((n) => n.total > 0)
        .sort((a, b) => b.total - a.total);
      const sum = nodes.reduce((a, n) => a + n.total, 0);
      const avail = height - GAP * Math.max(0, nodes.length - 1);
      let y = 0;
      for (const n of nodes) {
        const h = Math.max(6, (n.total / Math.max(1, sum)) * avail);
        out.set(n.id, { ...n, x: colX(c), y, h, col: c, total: n.total, labelTotal: n.labelTotal });
        y += h + GAP;
      }
    });
    return out;
  }, [columns, links, height]);

  // Ribbon vertical offsets: consume each node's height in link order.
  const ribbons = useMemo(() => {
    const outOffset = new Map<string, number>();
    const inOffset = new Map<string, number>();
    const sorted = [...links].sort((a, b) => {
      const pa = placed.get(a.from);
      const pb = placed.get(b.from);
      return (pa?.y ?? 0) - (pb?.y ?? 0) || (placed.get(a.to)?.y ?? 0) - (placed.get(b.to)?.y ?? 0);
    });
    return sorted
      .map((l) => {
        const from = placed.get(l.from);
        const to = placed.get(l.to);
        if (!from || !to) return null;
        const fh = (l.value / Math.max(1, from.total)) * from.h;
        const th = (l.value / Math.max(1, to.total)) * to.h;
        const fy = from.y + (outOffset.get(l.from) ?? 0);
        const ty = to.y + (inOffset.get(l.to) ?? 0);
        outOffset.set(l.from, (outOffset.get(l.from) ?? 0) + fh);
        inOffset.set(l.to, (inOffset.get(l.to) ?? 0) + th);
        const x0 = from.x + NODE_W;
        const x1 = to.x;
        const mx = (x0 + x1) / 2;
        const d = `M ${x0} ${fy} C ${mx} ${fy}, ${mx} ${ty}, ${x1} ${ty} L ${x1} ${ty + th} C ${mx} ${ty + th}, ${mx} ${fy + fh}, ${x0} ${fy + fh} Z`;
        return { d, value: l.value, title: `${from.label} → ${to.label}: ${l.value}` };
      })
      .filter(Boolean) as { d: string; value: number; title: string }[];
  }, [links, placed]);

  const maxTotal = Math.max(1, ...[...placed.values()].map((n) => n.total));

  return (
    <svg
      viewBox={`0 0 ${W} ${height + 4}`}
      width="100%"
      role="img"
      aria-label="Evidence flow: products to themes to priority tiers"
      fontFamily="inherit"
    >
      {ribbons.map((r, i) => (
        <path key={i} d={r.d} fill="#8a8580" opacity={0.12 + 0.18 * Math.min(1, r.value / maxTotal)}>
          <title>{r.title}</title>
        </path>
      ))}
      {[...placed.values()].map((n) => {
        const rightSide = n.col === columns.length - 1;
        const anchorLeft = n.col === 0;
        return (
          <g key={n.id}>
            <rect x={n.x} y={n.y} width={NODE_W} height={n.h} rx={2} fill={n.color ?? '#6d5ed4'}>
              <title>{`${n.label}: ${n.labelTotal}`}</title>
            </rect>
            <text
              x={anchorLeft ? n.x - 8 : rightSide ? n.x + NODE_W + 8 : n.x + NODE_W + 6}
              y={n.y + Math.max(9, Math.min(n.h / 2 + 3.5, n.h - 2))}
              textAnchor={anchorLeft ? 'end' : 'start'}
              fontSize={11}
              fill="currentColor"
              opacity={0.85}
            >
              {`${n.label} · ${n.labelTotal}`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
