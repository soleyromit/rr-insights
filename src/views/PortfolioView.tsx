// @ts-nocheck
// views/PortfolioView.tsx — Portfolio + Deliverables (P5 rebuild, UX Audit v1)
// Staff-readiness as a chart, anchors as claims, case-study pipeline ranked by priority.
import * as Plot from '@observablehq/plot';
import { DIMENSIONS, ANCHORS, GAPS } from '../data/portfolio';
import { Figure, Masthead } from '../components/ui/Figure';
import { PlotFigure } from '../components/charts/PlotFigure';

const MONO = "'JetBrains Mono', monospace";

export function PortfolioView() {
  const sorted = [...DIMENSIONS].sort((a, b) => b.value - a.value);
  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1080 }}>
      <Masthead title="Portfolio + Deliverables"
        lede="Staff-level positioning measured against JD benchmarks: where the evidence is strong, where it is thin, and the case studies that close the gap. The shortest bar is the writing assignment."
        byline={`${DIMENSIONS.length} positioning dimensions · ${ANCHORS.length} narrative anchors · ${GAPS.length} case studies in pipeline`} />

      <div style={{ marginBottom: 16 }}>
        <Figure title="Fig. 1 · Staff-readiness by dimension" caption="Self-assessed against Staff Product Designer JDs; the 70 bar is a self-set target, not an external benchmark. Decision: measurable outcomes is the shortest bar, so the FaaS case study with before/after metrics is the highest-priority deliverable.">
          <PlotFigure minHeight={DIMENSIONS.length * 32 + 50} deps={[sorted]} build={() => ({
            height: DIMENSIONS.length * 32 + 46,
            marginLeft: 190, marginTop: 8, marginBottom: 26, marginRight: 40,
            style: { fontFamily: MONO, fontSize: '10.5px', background: 'transparent' },
            x: { label: 'readiness', domain: [0, 100], tickSize: 0 },
            y: { label: null, domain: sorted.map(d => d.label), tickSize: 0, padding: 0.3 },
            marks: [
              Plot.ruleX([70], { stroke: '#cdc8bf', strokeDasharray: '3 3' }),
              Plot.text([70], { x: d => d, frameAnchor: 'bottom', text: () => 'self-set bar: 70', dy: 14, fill: '#6b6660', fontSize: 9.5 }),
              Plot.barX(sorted, { x: 'value', y: 'label', fill: d => d.value < 70 ? '#e8604a' : '#8a8580', rx: 3, tip: true, title: d => d.note }),
              Plot.text(sorted, { x: 'value', y: 'label', text: d => String(d.value), dx: 14, fill: '#4a4844', fontSize: 10.5 }),
            ],
          })} />
        </Figure>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Narrative anchors, at least two per output
          </div>
          {ANCHORS.map(a => (
            <div key={a.label} className="flex items-start gap-2.5" style={{ padding: '11px 18px', borderBottom: '1px solid var(--bg3)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: 'var(--accent)' }} />
              <span style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.5 }}>{a.text}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Case-study pipeline, ranked by positioning impact
          </div>
          {GAPS.map(g => (
            <div key={g.priority} style={{ padding: '13px 18px', borderBottom: '1px solid var(--bg3)' }}>
              <div className="flex items-baseline gap-2.5" style={{ marginBottom: 3 }}>
                <span className="mono" style={{ fontSize: 10, fontWeight: 700, color: g.color }}>{g.priority}</span>
                <span className="rr-serif" style={{ fontSize: 15.5, color: 'var(--text)' }}>{g.title}</span>
              </div>
              <p style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.5 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
