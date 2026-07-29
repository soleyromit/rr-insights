// @ts-nocheck
// views/CompetitiveView.tsx — Competitive Parity (P3 rebuild, UX Audit v1)
// Viz-first: parity matrix + scores lead; the ExamSoft retention anchors carry the narrative.
import { useMemo } from 'react';
import * as Plot from '@observablehq/plot';
import { COMPETITOR_FEATURES, MILESTONES } from '../data/personas';
import { getProduct } from '../data/products';
import { Figure, Masthead } from '../components/ui/Figure';
import { PlotFigure } from '../components/charts/PlotFigure';
import { HighchartFigure } from '../components/charts/HighchartFigure';

const MONO = "'JetBrains Mono', monospace";
const PLATFORMS = [
  { key: 'exxat', label: 'Exxat' },
  { key: 'examsoft', label: 'ExamSoft' },
  { key: 'blackboard', label: 'Blackboard' },
  { key: 'd2l', label: 'D2L' },
];
const STATUS_COLOR = { yes: '#2ec4a0', partial: '#f5a623', no: '#f0ede7' };
const STATUS_GLYPH = { yes: '✓', partial: '◐', no: '' };
const score = v => (v === true ? 1 : v === 'partial' ? 0.5 : 0);

// The three reasons programs stay on ExamSoft (Dr. Vicky Mody session, Mar 20) and Exxat's answer to each.
const ANCHORS = [
  { title: 'Curriculum mapping', state: 'partial', response: 'Flat tagging architecture + bulk tag on import. One system, no Excel.', evidence: 'ins-em-008 · ins-em-011' },
  { title: 'Faculty training over years', state: 'planned', response: 'Canvas-level UX so training is unnecessary; migration UX designed for the switching moment.', evidence: 'ins-em-018' },
  { title: 'Strong item analytics', state: 'planned', response: 'Item heatmaps + p-values in Assessment analytics; AI layer (May sprint) surpasses rather than matches.', evidence: 'ins-em-015 · ins-em-016' },
];

export function CompetitiveView() {
  const cells = useMemo(() => {
    const out = [];
    for (const f of COMPETITOR_FEATURES)
      for (const p of PLATFORMS) {
        const v = f[p.key];
        out.push({ feature: f.name, platform: p.label, status: v === true ? 'yes' : v === 'partial' ? 'partial' : 'no' });
      }
    return out;
  }, []);

  const parityScores = useMemo(() => PLATFORMS.map(p => ({
    platform: p.label,
    pct: Math.round(100 * COMPETITOR_FEATURES.reduce((n, f) => n + score(f[p.key]), 0) / COMPETITOR_FEATURES.length),
  })), []);

  const differentiators = COMPETITOR_FEATURES.filter(f =>
    score(f.exxat) > 0 && score(f.examsoft) === 0 && score(f.blackboard) === 0 && score(f.d2l) === 0);

  // Cohere date is CONFLICTED across sources: milestones say Aug 2026, product plan says Sep 2026.
  // Render the earlier (conservative) date and flag the conflict; do not silently pick.
  const cohereMs = MILESTONES.find(m => /cohere/i.test(m.label));
  const cohereDate = cohereMs ? new Date(cohereMs.date.replace(/^(\w+) (\d{4})$/, '$1 1, $2')) : null;
  const coherePlan = getProduct('exam-management')?.pilotDate ?? '';
  const cohereConflict = coherePlan && cohereDate && !coherePlan.toLowerCase().startsWith(cohereDate.toLocaleDateString('en-US', { month: 'short' }).toLowerCase());
  const daysToCohere = cohereDate ? Math.max(0, Math.round((cohereDate - new Date()) / 86400000)) : null;

  const hcScores = useMemo(() => ({
    chart: { type: 'bar', backgroundColor: 'transparent', height: PLATFORMS.length * 40 + 70, spacing: [4, 4, 4, 0], style: { fontFamily: MONO } },
    title: { text: undefined }, credits: { enabled: false }, legend: { enabled: false },
    xAxis: { categories: parityScores.map(s => s.platform), lineColor: '#e3ddd4', tickLength: 0, labels: { style: { fontSize: '12px', color: '#4a4844', fontFamily: MONO } } },
    yAxis: { max: 100, title: { text: undefined }, gridLineColor: '#ede9e3', labels: { format: '{value}%', style: { fontSize: '12px', color: '#6b6660', fontFamily: MONO } } },
    tooltip: { backgroundColor: '#1a1917', borderRadius: 8, borderWidth: 0, shadow: false, style: { color: '#faf9f7', fontSize: '13px', fontFamily: MONO }, pointFormat: '<b>{point.y}%</b> of 12 tracked features' },
    plotOptions: { series: { borderWidth: 0, pointPadding: 0.08, groupPadding: 0.1, animation: { duration: 500 },
      dataLabels: { enabled: true, format: '{y}%', style: { fontSize: '12px', fontWeight: '600', color: '#4a4844', fontFamily: MONO, textOutline: 'none' } } } },
    series: [{ type: 'bar', name: 'parity', data: parityScores.map(s => ({ y: s.pct, color: s.platform === 'Exxat' ? '#6d5ed4' : '#b8b2a8' })) }],
  }), [parityScores]);

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1120 }}>
      <Masthead title="Competitive parity"
        lede="Twelve tracked features across four platforms, and the three reasons programs actually stay on ExamSoft. Displacement happens at the switching moment; these are the switching conditions."
        byline={`Cohere in ${daysToCohere} days per milestones (Aug 2026)${cohereConflict ? ` · CONFLICT: product plan says ${coherePlan}, confirm with Arun` : ''} · feature evidence from Granola sessions Mar 2026`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)', gap: 16, marginBottom: 16 }}>
        <Figure title="Fig. 1 · Feature parity matrix" caption="Full ✓, partial ◐, absent blank. Decision: blank Exxat cells in rows where any competitor is green are the build queue; rows where every column is blank are open territory.">
          <PlotFigure minHeight={COMPETITOR_FEATURES.length * 26 + 60} deps={[cells]} build={() => ({
            height: COMPETITOR_FEATURES.length * 26 + 56,
            marginLeft: 172, marginTop: 26, marginBottom: 4, marginRight: 8,
            style: { fontFamily: MONO, fontSize: '12.5px', background: 'transparent' },
            x: { axis: 'top', label: null, domain: PLATFORMS.map(p => p.label), tickSize: 0, padding: 0.1 },
            y: { label: null, domain: COMPETITOR_FEATURES.map(f => f.name), tickSize: 0, padding: 0.18 },
            color: { domain: ['yes', 'partial', 'no'], range: [STATUS_COLOR.yes, STATUS_COLOR.partial, STATUS_COLOR.no] },
            marks: [
              Plot.cell(cells, { x: 'platform', y: 'feature', fill: 'status', rx: 4, inset: 1.5 }),
              Plot.text(cells, { x: 'platform', y: 'feature', text: d => STATUS_GLYPH[d.status], fill: '#fff', fontSize: 13, fontWeight: 700 }),
            ],
          })} />
        </Figure>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Figure title="Fig. 2 · Parity score" caption="Weighted coverage of the tracked set (full = 1, partial = ½). Decision: the Exxat bar is the number to move before Cohere; report it in every Arun check-in.">
            <HighchartFigure options={hcScores} deps={[parityScores]} />
          </Figure>
          <Figure title="Fig. 3 · Open territory" caption="Features no tracked platform ships. Decision: these are launch-moment differentiators; they lead the Cohere story, not the parity table.">
            <div>
              {differentiators.map(f => (
                <div key={f.name} className="flex items-center gap-2.5" style={{ padding: '7px 0', borderBottom: '1px solid var(--bg3)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6d5ed4', flexShrink: 0 }} />
                  <span style={{ fontSize: 14.5, color: 'var(--text)' }}>{f.name}</span>
                  <span className="mono" style={{ marginLeft: 'auto', fontSize: 12, color: f.exxat === true ? '#1d8a6e' : '#b45309' }}>{f.exxat === true ? 'shipped' : 'in design'}</span>
                </div>
              ))}
            </div>
          </Figure>
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px 22px' }}>
        <div className="rr-serif" style={{ fontSize: 19.5, color: 'var(--text)', marginBottom: 2 }}>The three retention anchors</div>
        <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.5, maxWidth: 640, marginBottom: 16 }}>
          Programs stay on ExamSoft for exactly three reasons (School of Pharmacy session, Mar 20). Match or beat all three and there is, in Arun's words, no rational reason to stay. Readiness carries no percentage here on purpose: nothing is measured yet, so status is stated, not scored.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {ANCHORS.map((a, i) => (
            <div key={a.title} style={{ border: '1px solid var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '14px 15px' }}>
              <div className="flex items-baseline justify-between" style={{ marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{i + 1}. {a.title}</span>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: a.state === 'partial' ? '#b45309' : '#6d5ed4' }}>{a.state.toUpperCase()}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 8 }}>{a.response}</p>
              <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>{a.evidence}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
