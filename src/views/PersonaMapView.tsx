// @ts-nocheck
// views/PersonaMapView.tsx — Persona Atlas (v17.1 rebuild).
// Identity cards with per-persona evidence stats, profile + open frictions, and — new — the
// evidence rail: top-scored insights and named voices behind each persona, so every claim on
// this page is one click from its source. Pattern: TheyDo persona properties + Maze highlights
// reel (mobbin.com/screens/ed1bca16-4bad-4900-b879-d1344c395204).
import { useMemo, useState } from 'react';
import * as Plot from '@observablehq/plot';
import { PRODUCTS, getProduct } from '../data/products';
import { PERSONAS } from '../data/personas';
import { getInsightsByPersona } from '../data/insights';
import { PERSONA_PRODUCT_FRICTION } from '../data/personaFriction';
import { REAL_VOICES } from '../data/voices';
import { Figure, Masthead } from '../components/ui/Figure';
import { PlotFigure } from '../components/charts/PlotFigure';
import { InsightDocument } from '../components/drilldown/InsightDocument';
import { SEV_COLORS } from '../data/taxonomy';
import { scoreInsight } from '../lib/score';

const MONO = "'JetBrains Mono', monospace";
const SEV_NUM = { critical: 3, high: 2, medium: 1, na: 0 };
const CELL_COLORS = { critical: '#e8604a', high: '#f5a623', medium: '#6d5ed4', na: '#ece9e3' };
const PERSONA_ORDER = ['student', 'dce', 'scce', 'program-director'];

export function PersonaMapView({ onNav }) {
  const [selected, setSelected] = useState('scce'); // open on the most underserved persona
  const [openDoc, setOpenDoc] = useState(undefined);
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

  // Per-persona evidence: counts, quote coverage, and the top-scored insights themselves.
  const evidence = useMemo(() => {
    const byId = {};
    for (const pid of PERSONA_ORDER) {
      const ins = getInsightsByPersona(pid);
      byId[pid] = {
        total: ins.length,
        critical: ins.filter(i => i.severity === 'critical').length,
        quoted: ins.filter(i => i.pullQuote).length,
        top: ins.map(i => ({ i, s: scoreInsight(i) })).sort((a, b) => b.s.total - a.s.total).slice(0, 5),
      };
    }
    return byId;
  }, []);

  const voices = useMemo(() =>
    REAL_VOICES.filter(v => v.personaRole === selected), [selected]);

  const coverage = useMemo(() =>
    PERSONA_ORDER.map(pid => ({
      persona: PERSONAS.find(p => p.id === pid)?.name ?? pid,
      insights: evidence[pid].total,
    })), [evidence]);
  const maxCoverage = Math.max(...coverage.map(c => c.insights), 1);

  const digest = useMemo(() => {
    const sorted = [...coverage].sort((a, b) => a.insights - b.insights);
    const thin = sorted[0]; const rich = sorted[sorted.length - 1];
    return `${rich.persona} evidence outweighs ${thin.persona} ${Math.round(rich.insights / Math.max(thin.insights, 1))}:1 (${rich.insights} vs ${thin.insights}); the ${thin.persona} sessions in the content plan close the loudest silence in the corpus.`;
  }, [coverage]);

  const personaName = (pid) => PERSONAS.find(p => p.id === pid)?.name ?? pid;

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1120 }}>
      <Masthead title="Persona Atlas"
        lede="Four personas with their evidence attached: friction computed against every product, coverage counted honestly, and the actual insights and named voices behind each claim, one click away."
        byline={`Friction matrix from research synthesis · coverage from ${coverage.reduce((n, c) => n + c.insights, 0)} tagged insights`} digest={digest} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
        <Figure title="Fig. 1 · Friction heat grid" caption="Severity of each persona's experience per product. Decision: the darkest row is the persona whose next release matters most — SCCE and Student rows carry the critical mass.">
          <PlotFigure minHeight={4 * 44 + 60} deps={[heatCells]} build={() => ({
            height: 4 * 44 + 58,
            marginLeft: 128, marginTop: 26, marginBottom: 4, marginRight: 8,
            style: { fontFamily: MONO, fontSize: '12.5px', background: 'transparent' },
            x: { axis: 'top', label: null, domain: PRODUCTS.map(p => p.shortName), tickSize: 0, padding: 0.08 },
            y: { label: null, domain: PERSONA_ORDER.map(personaName), tickSize: 0, padding: 0.14 },
            color: { domain: ['critical', 'high', 'medium', 'na'], range: [CELL_COLORS.critical, CELL_COLORS.high, CELL_COLORS.medium, CELL_COLORS.na], legend: true },
            marks: [
              Plot.cell(heatCells, { x: 'product', y: 'persona', fill: 'severity', rx: 4, inset: 2, tip: true, title: d => d.cross ? `${d.severity.toUpperCase()} · platform signal: ${d.cross}` : d.severity.toUpperCase() }),
              Plot.text(heatCells.filter(d => d.cross), { x: 'product', y: 'persona', text: () => '◆', fill: '#fff', fontSize: 12, dy: 0 }),
            ],
          })} />
        </Figure>
        <Figure title="Fig. 2 · Research coverage" caption="Tagged insights per persona. Decision: where the evidence base is thin, the next research agenda goes — a short SCCE bar is a to-do, not a fact about SCCEs.">
          <PlotFigure minHeight={4 * 44 + 40} deps={[coverage]} build={() => ({
            height: 4 * 44 + 38,
            marginLeft: 128, marginTop: 8, marginBottom: 26, marginRight: 40,
            style: { fontFamily: MONO, fontSize: '12.5px', background: 'transparent' },
            x: { label: 'insights', domain: [0, maxCoverage * 1.1], tickSize: 0 },
            y: { label: null, domain: PERSONA_ORDER.map(personaName), tickSize: 0, padding: 0.35 },
            marks: [
              Plot.barX(coverage, { x: 'insights', y: 'persona', fill: '#8a8580', rx: 3 }),
              Plot.text(coverage, { x: 'insights', y: 'persona', text: d => String(d.insights), dx: 14, fill: '#4a4844', fontSize: 12.5 }),
            ],
          })} />
        </Figure>
      </div>

      {/* Persona identity cards — avatar, priority, evidence stats. The card is the selector. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12, marginBottom: 16 }} role="tablist" aria-label="Select persona">
        {PERSONA_ORDER.map(pid => {
          const p = PERSONAS.find(x => x.id === pid);
          const ev = evidence[pid];
          const active = pid === selected;
          return (
            <button key={pid} role="tab" aria-selected={active} className="press text-left" onClick={() => setSelected(pid)} style={{
              background: '#fff', border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)', padding: '14px 16px', cursor: 'pointer',
              boxShadow: active ? '0 0 0 1px var(--accent)' : 'none',
            }}>
              <div className="flex items-center gap-2.5" style={{ marginBottom: 10 }}>
                <span className="flex items-center justify-center text-white mono" style={{ width: 34, height: 34, borderRadius: '50%', fontSize: 13, fontWeight: 700, background: p.avatarColor, flexShrink: 0 }}>{p.avatarInitials}</span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>{p.name}</span>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>{p.priority} priority</span>
                </span>
              </div>
              <div className="mono flex items-baseline gap-3" style={{ fontSize: 12, color: 'var(--text2)' }}>
                <span><span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{ev.total}</span> insights</span>
                <span style={{ color: ev.critical ? '#c24d3a' : 'var(--text3)' }}>{ev.critical} crit</span>
                <span style={{ color: 'var(--text3)' }}>{ev.quoted} quoted</span>
              </div>
            </button>
          );
        })}
      </div>

      {persona && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.25fr) minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
          {/* Profile — who they are, day shape, open frictions */}
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 22px' }}>
            <div className="flex items-baseline gap-3 flex-wrap" style={{ marginBottom: 4 }}>
              <span className="rr-serif" style={{ fontSize: 22, color: 'var(--text)' }}>{persona.name}</span>
              <span style={{ fontSize: 14.5, color: 'var(--text2)' }}>{persona.role}</span>
            </div>
            <p className="serif" style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.55, maxWidth: 640, marginBottom: 16 }}>{persona.povStatement}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
              <div style={{ borderTop: `2px solid #2ec4a0`, paddingTop: 10 }}>
                <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: '#1d8a6e', marginBottom: 4 }}>A GREAT DAY</div>
                <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.55 }}>{persona.greatDay}</p>
              </div>
              <div style={{ borderTop: `2px solid #e8604a`, paddingTop: 10 }}>
                <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: '#c24d3a', marginBottom: 4 }}>A POOR DAY</div>
                <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.55 }}>{persona.poorDay}</p>
              </div>
            </div>

            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>Open frictions by product, ranked by severity</div>
            <div>
              {PRODUCTS
                .map(prod => ({ prod, cell: friction[prod.id] }))
                .filter(x => x.cell && x.cell.severity !== 'na')
                .sort((a, b) => SEV_NUM[b.cell.severity] - SEV_NUM[a.cell.severity])
                .map(({ prod, cell }) => (
                  <div key={prod.id} className="flex items-start gap-3" style={{ padding: '9px 0', borderBottom: '1px solid var(--bg3)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: CELL_COLORS[cell.severity] }} aria-label={cell.severity} />
                    <span className="mono" style={{ fontSize: 12.5, color: 'var(--text2)', width: 86, flexShrink: 0, paddingTop: 1 }}>{prod.shortName}</span>
                    <span style={{ flex: 1, fontSize: 14.5, color: 'var(--text)', lineHeight: 1.5 }}>{cell.text}</span>
                    <span className="flex gap-1.5 flex-shrink-0">
                      {cell.cross && <span className="mono" style={{ fontSize: 12, padding: '2px 8px', borderRadius: 3, background: 'var(--bg2)', color: 'var(--text2)' }}>◆ {cell.cross}</span>}
                      {cell.ai && <span className="mono" style={{ fontSize: 12, padding: '2px 8px', borderRadius: 3, background: 'rgba(13,148,136,0.10)', color: '#0d7a6e' }}>{cell.ai}</span>}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Evidence rail — the claims above, sourced. Nothing on this page is a dead end. */}
          <div>
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 14 }}>
              <div className="flex items-baseline justify-between" style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Top evidence for {persona.name}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>by score</span>
              </div>
              {evidence[selected].top.map(({ i, s }) => (
                <button key={i.id} className="press w-full text-left flex items-start gap-2.5" onClick={() => setOpenDoc(i)}
                  style={{ padding: '10px 16px', borderBottom: '1px solid var(--bg3)', cursor: 'pointer', background: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: SEV_COLORS[i.severity ?? 'na'] }} />
                  <span style={{ flex: 1, fontSize: 13.5, color: 'var(--text)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{i.text}</span>
                  <span className="mono" title={s.label} style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', flexShrink: 0 }}>{Math.round(s.total)}</span>
                </button>
              ))}
            </div>

            {voices.length > 0 && (
              <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>
                  Named voices
                </div>
                {voices.map(v => (
                  <div key={v.id} style={{ padding: '13px 16px', borderBottom: '1px solid var(--bg3)' }}>
                    <span className="serif" style={{
                      fontSize: 14.5, color: 'var(--text)', lineHeight: 1.65,
                      background: 'rgba(22,163,74,0.08)', borderRadius: 3, padding: '1px 4px',
                      boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
                    }}>{v.quote}</span>
                    <div style={{ marginTop: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{v.name}</span>
                      <span style={{ fontSize: 12.5, color: 'var(--text2)' }}> · {v.title}, {v.institution}</span>
                    </div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>{v.granolaMeetingLabel}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {openDoc && (
        <InsightDocument insight={openDoc} onClose={() => setOpenDoc(undefined)} onOpen={setOpenDoc} onNav={onNav} />
      )}
    </div>
  );
}
