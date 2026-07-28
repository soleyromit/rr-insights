// @ts-nocheck
// views/NarrativeView.tsx — Connect the Dots (P5 rebuild, UX Audit v1)
// Five defended arguments. The stats are the visual: an evidence ledger leads, prose stays behind structure.
import { useRef } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { ARGUMENTS } from '../data/arguments';
import { Masthead } from '../components/ui/Figure';

export function NarrativeView({ onNav }) {
  const refs = useRef({});
  const jump = (id) => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const ledger = ARGUMENTS.flatMap(a => a.sources.map(s => ({ ...s, argId: a.id, number: a.number, color: a.color })));

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1080 }}>
      <Masthead title="Connect the Dots"
        lede="Five arguments, each defensible in a leadership meeting: a claim, the numbers behind it, what it implies, and the design response already in motion. The ledger below is every load-bearing stat in one view."
        byline={`${ARGUMENTS.length} arguments · ${ledger.length} sourced statistics · NPS 2025, Granola sessions, user interviews`} />

      {/* Evidence ledger — every stat that carries an argument, one glance */}
      <div role="list" aria-label="Evidence ledger"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 20 }}>
        {ledger.map((s, i) => (
          <button key={i} role="listitem" className="press text-left" onClick={() => jump(s.argId)}
            aria-label={`${s.statLabel}: ${s.stat}. Jump to argument ${s.number}`}
            style={{ background: '#fff', padding: '13px 15px', cursor: 'pointer' }}>
            <span className="flex items-baseline gap-2">
              <span className="rr-serif" style={{ fontSize: 25, color: 'var(--text)', lineHeight: 1 }}>{s.stat}</span>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.color }} />
            </span>
            <span className="mono" style={{ display: 'block', fontSize: 10, color: 'var(--text2)', marginTop: 4 }}>{s.statLabel}</span>
            <span className="mono" style={{ display: 'block', fontSize: 9.5, color: 'var(--text3)', marginTop: 1 }}>arg {s.number}</span>
          </button>
        ))}
      </div>

      {/* Argument index — the order is the narrative */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 26 }}>
        {ARGUMENTS.map(a => (
          <button key={a.id} className="press w-full text-left flex items-center gap-4" onClick={() => jump(a.id)}
            style={{ padding: '12px 18px', borderBottom: '1px solid var(--bg3)', cursor: 'pointer', background: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <span className="mono" style={{ fontSize: 11, fontWeight: 700, color: a.color, width: 22, flexShrink: 0 }}>{a.number}</span>
            <span className="rr-serif" style={{ flex: 1, fontSize: 15.5, color: 'var(--text)', lineHeight: 1.3 }}>{a.claim}</span>
            <ArrowRightIcon size={14} style={{ color: 'var(--text3)', flexShrink: 0, opacity: 0.5 }} />
          </button>
        ))}
      </div>

      {/* The arguments */}
      {ARGUMENTS.map(a => (
        <section key={a.id} ref={el => refs.current[a.id] = el} aria-labelledby={`${a.id}-claim`}
          style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '22px 24px', marginBottom: 18, scrollMarginTop: 16 }}>
          <div className="flex items-start gap-4" style={{ marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: a.color, paddingTop: 7 }}>{a.number}</span>
            <div>
              <h2 id={`${a.id}-claim`} className="rr-serif" style={{ fontSize: 22, color: 'var(--text)', lineHeight: 1.2, marginBottom: 6 }}>{a.claim}</h2>
              <p className="serif" style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.55, maxWidth: 680 }}>{a.subclaim}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${a.sources.length}, 1fr)`, gap: 1, background: 'var(--bg3)', border: '1px solid var(--bg3)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', margin: '14px 0 16px' }}>
            {a.sources.map((s, i) => (
              <div key={i} style={{ background: 'var(--bg)', padding: '12px 14px' }}>
                <span className="rr-serif" style={{ fontSize: 24, color: 'var(--text)', lineHeight: 1 }}>{s.stat}</span>
                <span className="mono" style={{ display: 'block', fontSize: 10, color: 'var(--text2)', margin: '4px 0 6px' }}>{s.statLabel} · {s.label}</span>
                <span style={{ display: 'block', fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.45 }}>{s.context}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            {a.evidence.map((e, i) => (
              <div key={i} className="flex items-start gap-2.5" style={{ padding: '6px 0', borderBottom: i < a.evidence.length - 1 ? '1px solid var(--bg3)' : 'none' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: a.color }} />
                <span style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.5 }}>{e}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <div className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text2)', marginBottom: 4 }}>IMPLICATION</div>
              <p style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.55 }}>{a.implication}</p>
            </div>
            <div>
              <div className="mono" style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em', color: a.color, marginBottom: 4 }}>DESIGN RESPONSE</div>
              <p style={{ fontSize: 12.5, color: 'var(--text)', lineHeight: 1.55 }}>{a.designResponse}</p>
            </div>
          </div>

          <button className="press mono flex items-center gap-1.5" onClick={() => onNav(a.navTarget)}
            style={{ marginTop: 14, fontSize: 11, fontWeight: 500, padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border2)', background: '#fff', color: 'var(--text2)', cursor: 'pointer' }}>
            {a.navLabel} <ArrowRightIcon size={12} />
          </button>
        </section>
      ))}
    </div>
  );
}
