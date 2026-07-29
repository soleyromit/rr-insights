// @ts-nocheck
// views/RoadmapView.tsx — Roadmap (P3 rebuild, UX Audit v1). Out of the archive, into The Story.
// One timeline, honest about the calendar: past milestones render as passed even if data says upcoming.
import { useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { MILESTONES } from '../data/personas';
import { PRODUCTS, getProduct } from '../data/products';
import { Figure, Masthead } from '../components/ui/Figure';
import { PlotFigure } from '../components/charts/PlotFigure';
import { computePhaseStates } from '../lib/phaseDates';

const MONO = "'JetBrains Mono', monospace";

function parseMilestoneDate(str) {
  const d = new Date(str);
  if (!isNaN(d)) return d;
  const alt = new Date(str.replace(/^(\w+) (\d{4})$/, '$1 1, $2'));
  return isNaN(alt) ? null : alt;
}

export function RoadmapView() {
  const today = new Date();

  const rows = useMemo(() => MILESTONES
    .map(m => {
      const date = parseMilestoneDate(m.date);
      const prod = m.productId ? getProduct(m.productId) : null;
      return date ? {
        date, label: m.label, description: m.description, hard: !!m.isHardDeadline,
        lane: prod?.shortName ?? 'Platform', color: prod?.accentColor ?? '#4a4844',
        passed: date < today,
      } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date), []);

  const lanes = useMemo(() => {
    const order = [...PRODUCTS.map(p => p.shortName), 'Platform'];
    return order.filter(l => rows.some(r => r.lane === l));
  }, [rows]);

  const upcoming = rows.filter(r => !r.passed);
  const nextHard = upcoming.filter(r => r.hard).slice(0, 3);
  const dLeft = d => Math.max(0, Math.round((d - today) / 86400000));

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1120 }}>
      <Masthead title="Roadmap"
        lede="Every milestone on one calendar, product by product, with the hard deadlines that do not move. Past dates render as passed; the countdown only counts what is ahead."
        byline={`${rows.length} milestones · ${upcoming.length} ahead · today is ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`} />

      {/* Countdown to the immovable dates — big serif numbers are data, not decoration */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(nextHard.length, 1)}, 1fr)`, gap: 14, marginBottom: 16 }}>
        {nextHard.map(m => (
          <div key={m.label} style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' }}>
            <div className="flex items-baseline gap-2">
              <span className="rr-serif" style={{ fontSize: 34, color: 'var(--text)', lineHeight: 1 }}>{dLeft(m.date)}</span>
              <span className="mono" style={{ fontSize: 12.5, color: 'var(--text2)' }}>days</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', margin: '6px 0 2px' }}>{m.label}</div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--text2)' }}>{m.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {m.lane}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <Figure title="Fig. 1 · Milestone timeline" caption="Diamonds are hard deadlines, dots are working milestones, hollow marks have passed. Decision: distance between today's rule and the next diamond is the real sprint budget — everything else flexes around it.">
          <PlotFigure minHeight={lanes.length * 44 + 80} deps={[rows]} build={() => ({
            height: lanes.length * 44 + 76,
            marginLeft: 96, marginTop: 10, marginBottom: 30, marginRight: 24,
            style: { fontFamily: MONO, fontSize: '12.5px', background: 'transparent' },
            x: { type: 'time', label: null },
            y: { label: null, domain: lanes, tickSize: 0, padding: 0.5 },
            marks: [
              Plot.ruleY(lanes, { y: d => d, stroke: '#ede9e3' }),
              Plot.ruleX([today], { stroke: '#1a1917', strokeWidth: 1.25, strokeDasharray: '3 3' }),
              Plot.text([today], { x: d => d, frameAnchor: 'top', text: () => 'today', dy: -2, dx: 18, fill: '#1a1917', fontSize: 12, fontWeight: 600 }),
              Plot.dot(rows.filter(r => !r.hard), { x: 'date', y: 'lane', r: 4.5, fill: d => d.passed ? '#fff' : d.color, stroke: d => d.color, strokeWidth: 1.4, tip: true, title: d => `${d.label}\n${d.description}` }),
              Plot.dot(rows.filter(r => r.hard), { x: 'date', y: 'lane', r: 6.5, symbol: 'diamond', fill: d => d.passed ? '#fff' : d.color, stroke: d => d.color, strokeWidth: 1.6, tip: true, title: d => `HARD DEADLINE · ${d.label}\n${d.description}` }),
              Plot.text(rows.filter(r => r.hard && !r.passed), { x: 'date', y: 'lane', text: 'label', dy: -15, fill: '#1a1917', fontSize: 12, fontWeight: 600 }),
            ],
          })} />
        </Figure>
      </div>

      <Figure title="Fig. 2 · Phase tracks per product" caption="Phase state is derived from dates written in the plan itself: struck phases have passed, the filled phase is the next dated one, dashed phases carry no date and claim no state. Decision: a product whose next dated phase overruns the diamond above needs scope cut, not optimism.">
        <div style={{ display: 'grid', gap: 12 }}>
          {PRODUCTS.map(p => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="mono" style={{ fontSize: 12.5, color: 'var(--text2)', width: 86, flexShrink: 0 }}>{p.shortName}</span>
              <div className="flex flex-1 gap-1" role="list" aria-label={`${p.name} phases (state derived from dates)`}>
                {(() => { const states = computePhaseStates(p.roadmapPhases.map(ph => ph.phase)); return p.roadmapPhases.map((ph, i) => {
                  const st = states[i].state;
                  return (
                    <div key={ph.phase} role="listitem" title={`${st === 'unscheduled' ? 'No parseable date. ' : ''}${ph.phase}: ${ph.items.slice(0, 3).join(' · ')}`} style={{
                      flex: 1, padding: '6px 10px', borderRadius: 4, fontSize: 13,
                      background: st === 'next' ? p.accentColor : 'var(--bg2)',
                      border: st === 'unscheduled' ? '1px dashed var(--border2)' : '1px solid transparent',
                      color: st === 'next' ? '#fff' : st === 'passed' ? 'var(--text3)' : 'var(--text2)',
                      fontWeight: st === 'next' ? 600 : 400, textDecoration: st === 'passed' ? 'line-through' : 'none',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{ph.phase}{st === 'unscheduled' ? ' ·?' : ''}</div>
                  );
                }); })()}
              </div>
            </div>
          ))}
        </div>
      </Figure>
    </div>
  );
}
