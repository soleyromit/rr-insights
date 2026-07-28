// @ts-nocheck
// views/PersonaMapView.tsx — Persona Atlas (P3 rebuild, UX Audit v1)
// Viz-first: friction heat grid + research coverage lead; persona detail on selection, no wall of text.
import { useMemo, useState } from 'react';
import * as Plot from '@observablehq/plot';
import { PRODUCTS } from '../data/products';
import { PERSONAS } from '../data/personas';
import { getInsightsByPersona } from '../data/insights';
import { PERSONA_PRODUCT_FRICTION } from '../data/personaFriction';
import { Figure, Masthead } from '../components/ui/Figure';
import { PlotFigure } from '../components/charts/PlotFigure';

const MONO = "'JetBrains Mono', monospace";
const SEV_NUM = { critical: 3, high: 2, medium: 1, na: 0 };
const SEV_COLORS = { critical: '#e8604a', high: '#f5a623', medium: '#6d5ed4', na: '#ece9e3' };
const PERSONA_ORDER = ['student', 'dce', 'scce', 'program-director'];

export function PersonaMapView() {
  const [selected, setSelected] = useState('scce'); // open on the most underserved persona
  const persona = PERSONAS.find(p => p.id === selected);
  const friction = PERSONA_PRODUCT_FRICTION[selected] ?? {};

  const heatCells = useMemo(() => {
    const cells = [];
    for (const pid of PERSONA_ORDER) {
      const row = PERSONA_PRODUCT_FRICTION[pid] ?? {};
      for (const prod of PRODUCTS) {
        const cell = row[prod.id];
        cells.push({
          persona: PERSONAS.find(p => p.id === pid)?.name ?? pid,
          product: prod.shortName,
          severity: cell?.severity ?? 'na',
          cross: cell?.cross ?? '',
        });
      }
    }
    return cells;
  }, []);

  const coverage = useMemo(() =>
    PERSONA_ORDER.map(pid => ({
      persona: PERSONAS.find(p => p.id === pid)?.name ?? pid,
      insights: getInsightsByPersona(pid).length,
    })), []);
  const maxCoverage = Math.max(...coverage.map(c => c.insights), 1);

  const personaName = (pid) => PERSONAS.find(p => p.id === pid)?.name ?? pid;

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1120 }}>
      <Masthead title="Persona Atlas"
        lede="Four personas, five products: friction severity computed against every surface, research coverage counted honestly. Select a persona for their situation, day shape, and open frictions."
        byline={`Friction matrix from research synthesis · coverage from ${coverage.reduce((n, c) => n + c.insights, 0)} tagged insights`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
        <Figure title="Fig. 1 · Friction heat grid" caption="Severity of each persona's experience per product. Decision: the darkest row is the persona whose next release matters most — SCCE and Student rows carry the critical mass.">
          <PlotFigure minHeight={4 * 44 + 60} deps={[heatCells]} build={() => ({
            height: 4 * 44 + 58,
            marginLeft: 128, marginTop: 26, marginBottom: 4, marginRight: 8,
            style: { fontFamily: MONO, fontSize: '10.5px', background: 'transparent' },
            x: { axis: 'top', label: null, domain: PRODUCTS.map(p => p.shortName), tickSize: 0, padding: 0.08 },
            y: { label: null, domain: PERSONA_ORDER.map(personaName), tickSize: 0, padding: 0.14 },
            color: { domain: ['critical', 'high', 'medium', 'na'], range: [SEV_COLORS.critical, SEV_COLORS.high, SEV_COLORS.medium, SEV_COLORS.na], legend: true },
            marks: [
              Plot.cell(heatCells, { x: 'product', y: 'persona', fill: 'severity', rx: 4, inset: 2, tip: true, title: d => d.cross ? `${d.severity.toUpperCase()} · platform signal: ${d.cross}` : d.severity.toUpperCase() }),
              Plot.text(heatCells.filter(d => d.cross), { x: 'product', y: 'persona', text: () => '◆', fill: '#fff', fontSize: 8, dy: 0 }),
            ],
          })} />
        </Figure>
        <Figure title="Fig. 2 · Research coverage" caption="Tagged insights per persona. Decision: where the evidence base is thin, the next research agenda goes — a short SCCE bar is a to-do, not a fact about SCCEs.">
          <PlotFigure minHeight={4 * 44 + 40} deps={[coverage]} build={() => ({
            height: 4 * 44 + 38,
            marginLeft: 128, marginTop: 8, marginBottom: 26, marginRight: 40,
            style: { fontFamily: MONO, fontSize: '10.5px', background: 'transparent' },
            x: { label: 'insights', domain: [0, maxCoverage * 1.1], tickSize: 0 },
            y: { label: null, domain: PERSONA_ORDER.map(personaName), tickSize: 0, padding: 0.35 },
            marks: [
              Plot.barX(coverage, { x: 'insights', y: 'persona', fill: '#8a8580', rx: 3 }),
              Plot.text(coverage, { x: 'insights', y: 'persona', text: d => String(d.insights), dx: 14, fill: '#4a4844', fontSize: 10.5 }),
            ],
          })} />
        </Figure>
      </div>

      {/* Persona selector — one control vocabulary with the drill-down chips */}
      <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 14 }} role="tablist" aria-label="Select persona">
        {PERSONA_ORDER.map(pid => {
          const p = PERSONAS.find(x => x.id === pid);
          const active = pid === selected;
          return (
            <button key={pid} role="tab" aria-selected={active} className="press" onClick={() => setSelected(pid)} style={{
              fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 14, cursor: 'pointer',
              border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              background: active ? 'var(--accent-bg)' : '#fff', color: active ? 'var(--accent)' : 'var(--text2)',
            }}>{p?.name}<span className="mono" style={{ marginLeft: 7, fontSize: 10, opacity: 0.75 }}>{p?.priority}</span></button>
          );
        })}
      </div>

      {persona && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 22px' }}>
          <div className="flex items-baseline gap-3 flex-wrap" style={{ marginBottom: 4 }}>
            <span className="rr-serif" style={{ fontSize: 22, color: 'var(--text)' }}>{persona.name}</span>
            <span style={{ fontSize: 13, color: 'var(--text2)' }}>{persona.role}</span>
          </div>
          <p className="serif" style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.55, maxWidth: 640, marginBottom: 16 }}>{persona.povStatement}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div style={{ borderTop: `2px solid #2ec4a0`, paddingTop: 10 }}>
              <div className="mono" style={{ fontSize: 10, fontWeight: 600, color: '#1d8a6e', marginBottom: 4 }}>A GREAT DAY</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55 }}>{persona.greatDay}</p>
            </div>
            <div style={{ borderTop: `2px solid #e8604a`, paddingTop: 10 }}>
              <div className="mono" style={{ fontSize: 10, fontWeight: 600, color: '#c24d3a', marginBottom: 4 }}>A POOR DAY</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.55 }}>{persona.poorDay}</p>
            </div>
          </div>

          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>Open frictions by product, ranked by severity</div>
          <div>
            {PRODUCTS
              .map(prod => ({ prod, cell: friction[prod.id] }))
              .filter(x => x.cell && x.cell.severity !== 'na')
              .sort((a, b) => SEV_NUM[b.cell.severity] - SEV_NUM[a.cell.severity])
              .map(({ prod, cell }) => (
                <div key={prod.id} className="flex items-start gap-3" style={{ padding: '9px 0', borderBottom: '1px solid var(--bg3)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: SEV_COLORS[cell.severity] }} aria-label={cell.severity} />
                  <span className="mono" style={{ fontSize: 10.5, color: 'var(--text2)', width: 86, flexShrink: 0, paddingTop: 1 }}>{prod.shortName}</span>
                  <span style={{ flex: 1, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{cell.text}</span>
                  <span className="flex gap-1.5 flex-shrink-0">
                    {cell.cross && <span className="mono" style={{ fontSize: 9.5, padding: '2px 8px', borderRadius: 3, background: 'var(--bg2)', color: 'var(--text2)' }}>◆ {cell.cross}</span>}
                    {cell.ai && <span className="mono" style={{ fontSize: 9.5, padding: '2px 8px', borderRadius: 3, background: 'rgba(13,148,136,0.10)', color: '#0d7a6e' }}>{cell.ai}</span>}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
