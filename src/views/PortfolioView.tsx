// @ts-nocheck
// views/PortfolioView.tsx — Portfolio + Deliverables (P5 rebuild, UX Audit v1)
// Staff-readiness as a chart, anchors as claims, case-study pipeline ranked by priority.
import { DIMENSIONS, ANCHORS, GAPS } from '../data/portfolio';
import { Figure, Masthead } from '../components/ui/Figure';
import { RankedBars } from '../components/charts/RankedBars';

const MONO = "'JetBrains Mono', monospace";

export function PortfolioView() {
  const sorted = [...DIMENSIONS].sort((a, b) => b.value - a.value);
  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1080 }}>
      <Masthead title="Portfolio + Deliverables"
        lede="Staff-level positioning measured against JD benchmarks: where the evidence is strong, where it is thin, and the case studies that close the gap. The shortest bar is the writing assignment."
        byline={`${DIMENSIONS.length} positioning dimensions · ${ANCHORS.length} narrative anchors · ${GAPS.length} case studies in pipeline`} />

      <div style={{ marginBottom: 16 }}>
        <Figure title="Fig. 1 · Staff-readiness by dimension" caption="Self-assessed against Staff Product Designer JDs; 70 is a self-set target, not an external benchmark. Bars below the target render red. Decision: the lowest bar is the writing assignment; measurable outcomes points at the FaaS before/after case study.">
          <RankedBars maxHint={100} rows={sorted.map(d => ({
            key: d.label, label: d.label, total: d.value,
            barColor: d.value < 70 ? '#e8604a' : '#b8b2a8',
            sub: `${d.value} / self-set target 70 · ${d.note}`,
          }))} />
        </Figure>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 16 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Narrative anchors, at least two per output
          </div>
          {ANCHORS.map(a => (
            <div key={a.label} className="flex items-start gap-2.5" style={{ padding: '11px 18px', borderBottom: '1px solid var(--bg3)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: 'var(--accent)' }} />
              <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{a.text}</span>
            </div>
          ))}
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Case-study pipeline, ranked by positioning impact
          </div>
          {GAPS.map(g => (
            <div key={g.priority} style={{ padding: '13px 18px', borderBottom: '1px solid var(--bg3)' }}>
              <div className="flex items-baseline gap-2.5" style={{ marginBottom: 3 }}>
                <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: g.color }}>{g.priority}</span>
                <span className="rr-serif" style={{ fontSize: 16.5, color: 'var(--text)' }}>{g.title}</span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
