// @ts-nocheck
// views/OverviewView.tsx — Command Center (P3 rebuild, UX Audit v1)
// The entry answers one question: what should be designed next, and why.
// Product-state strip + severity mix + design-next queue; repo bookkeeping lives in Changelog.
import { useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { ChevronRightIcon, FlameIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { ALL_INSIGHTS, getInsightsByProduct } from '../data/insights';
import { MILESTONES } from '../data/personas';
import { Figure, Masthead } from '../components/ui/Figure';
import { PlotFigure } from '../components/charts/PlotFigure';

const MONO = "'JetBrains Mono', monospace";
const SEV_COLORS = { critical: '#e8604a', high: '#f5a623', medium: '#6d5ed4', low: '#2ec4a0' };
const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const URGENCY = { fire: { icon: FlameIcon, color: '#dc2626' }, warn: { icon: AlertTriangleIcon, color: '#b45309' }, ok: { icon: CheckCircleIcon, color: '#16a34a' } };

function parseMs(str) {
  const d = new Date(str);
  return isNaN(d) ? new Date(str.replace(/^(\w+) (\d{4})$/, '$1 1, $2')) : d;
}

export function OverviewView({ onNav }) {
  const today = new Date();

  const productRows = useMemo(() => PRODUCTS.map(p => {
    const ins = getInsightsByProduct(p.id);
    return { p, total: ins.length, critical: ins.filter(i => i.severity === 'critical').length };
  }), []);

  const sevMix = useMemo(() => {
    const rows = [];
    for (const { p } of productRows)
      for (const sev of SEVERITIES)
        rows.push({ product: p.shortName, severity: sev, count: getInsightsByProduct(p.id).filter(i => i.severity === sev).length });
    return rows;
  }, [productRows]);

  const nextHard = useMemo(() => MILESTONES
    .map(m => ({ ...m, d: parseMs(m.date) }))
    .filter(m => m.isHardDeadline && m.d >= today)
    .sort((a, b) => a.d - b.d)[0], []);
  const daysLeft = nextHard ? Math.round((nextHard.d - today) / 86400000) : null;

  const designNext = useMemo(() => ALL_INSIGHTS
    .filter(i => i.severity === 'critical' && i.soWhat)
    .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1))
    .slice(0, 5), []);

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1120 }}>
      <Masthead title="Command Center"
        lede="The state of five products in one view: deadline pressure, evidence mass, and the queue of critical findings that already name their design response. Everything links into its evidence."
        byline={`${ALL_INSIGHTS.length} insights across ${PRODUCTS.length} products · next hard deadline: ${nextHard?.label ?? 'none scheduled'} in ${daysLeft} days (${nextHard?.date ?? ''})`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
        {/* Product state — each row is a door, not a card */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Products, ranked by deadline pressure — open a row for its deep dive
          </div>
          {productRows.map(({ p, total, critical }) => {
            const U = URGENCY[p.urgencyLevel] ?? URGENCY.ok;
            return (
              <button key={p.id} className="press w-full text-left flex items-center gap-3" onClick={() => onNav(p.id)}
                aria-label={`Open ${p.name}`}
                style={{ padding: '13px 18px', borderBottom: '1px solid var(--bg3)', cursor: 'pointer', background: '#fff' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                <U.icon size={13} style={{ color: U.color, flexShrink: 0 }} aria-label={p.urgencyLevel} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.accentColor, flexShrink: 0 }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>{p.shortName}</span>
                  <span className="mono" style={{ fontSize: 10, color: 'var(--text2)' }}>{p.status} · {p.userCount ?? 'n/a'}</span>
                </span>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--text2)', textAlign: 'right', lineHeight: 1.6, flexShrink: 0 }}>
                  {total} insights<br /><span style={{ color: critical ? '#c24d3a' : 'var(--text3)' }}>{critical} critical</span>
                </span>
                {p.daysToDeadline && <span className="mono" title={`days to planned launch: ${p.launchDate ?? 'per product plan'}`} style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--text2)', width: 44, textAlign: 'right', flexShrink: 0 }}>{p.daysToDeadline}d</span>}
                <ChevronRightIcon size={15} style={{ color: 'var(--text3)', flexShrink: 0, opacity: 0.5 }} />
              </button>
            );
          })}
        </div>

        <Figure title="Fig. 1 · Evidence mass by severity" caption="Insight counts per product, stacked by severity. Decision: red mass is design debt — a product whose bar is mostly critical outranks a longer but calmer bar.">
          <PlotFigure minHeight={PRODUCTS.length * 42 + 60} deps={[sevMix]} build={() => ({
            height: PRODUCTS.length * 42 + 56,
            marginLeft: 90, marginTop: 8, marginBottom: 28, marginRight: 16,
            style: { fontFamily: MONO, fontSize: '10.5px', background: 'transparent' },
            x: { label: 'insights', tickSize: 0 },
            y: { label: null, domain: PRODUCTS.map(p => p.shortName), tickSize: 0, padding: 0.3 },
            color: { domain: SEVERITIES, range: SEVERITIES.map(s => SEV_COLORS[s]), legend: true },
            marks: [Plot.barX(sevMix, { x: 'count', y: 'product', fill: 'severity', order: SEVERITIES, rx: 2, tip: true })],
          })} />
        </Figure>
      </div>

      {/* Design-next queue — critical findings that already name their response */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div className="flex items-center justify-between" style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)' }}>Design next — latest critical findings with a named response</span>
          <button className="press mono" onClick={() => onNav('signals')} style={{ fontSize: 10.5, color: 'var(--accent)', cursor: 'pointer' }}>all signals →</button>
        </div>
        {designNext.map(i => (
          <button key={i.id} className="press w-full text-left flex items-start gap-3" onClick={() => onNav('signals')}
            style={{ padding: '13px 18px', borderBottom: '1px solid var(--bg3)', cursor: 'pointer', background: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: SEV_COLORS.critical }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{i.soWhat}</span>
              <span className="mono" style={{ fontSize: 10, color: 'var(--text2)' }}>{i.productIds.join(' · ')} · {i.source}</span>
            </span>
            <ChevronRightIcon size={14} style={{ color: 'var(--text3)', flexShrink: 0, marginTop: 2, opacity: 0.5 }} />
          </button>
        ))}
      </div>
    </div>
  );
}
