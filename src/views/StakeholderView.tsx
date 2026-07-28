// @ts-nocheck
// views/StakeholderView.tsx — Briefings (P5 rebuild, UX Audit v1)
// One audience at a time, letter-format, copy-ready. Sections follow the skill's 3-part briefing.
// Writing rules enforced on render and copy: no em dashes leave this page.
import { useState } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { DECKS, SIGNAL_RISKS } from '../data/briefings';
import { Masthead } from '../components/ui/Figure';

const clean = (t) => t.replace(/\s+—\s+/g, ', ').replace(/—/g, ', ');
const SECTIONS = [
  { key: 'problem', label: 'The problem' },
  { key: 'findings', label: 'What we found' },
  { key: 'recommendation', label: 'Recommended direction' },
];

export function StakeholderView() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const deck = DECKS[active];

  const copyText = () => {
    const text = [
      `BRIEFING · ${deck.audience} (${deck.role}) · ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`,
      ...SECTIONS.flatMap(s => ['', s.label.toUpperCase(), clean(deck[s.key])]),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1080 }}>
      <Masthead title="Briefings"
        lede="The same research, three registers: evidence-grounded for Arun, business-outcome for Kunal, decision-only for Aarti. Pick the audience, copy the letter, send it."
        byline={`3 audiences · sourced from 39 stakeholder sessions and NPS 2025 · copy strips em dashes per writing rules`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 16 }}>
        <div>
          <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 14 }} role="tablist" aria-label="Select audience">
            {DECKS.map((d, i) => (
              <button key={d.audience} role="tab" aria-selected={i === active} className="press" onClick={() => setActive(i)} style={{
                fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 14, cursor: 'pointer',
                border: `1px solid ${i === active ? 'var(--accent)' : 'var(--border)'}`,
                background: i === active ? 'var(--accent-bg)' : '#fff', color: i === active ? 'var(--accent)' : 'var(--text2)',
              }}>{d.audience}<span className="mono" style={{ marginLeft: 7, fontSize: 10, opacity: 0.75 }}>{d.role}</span></button>
            ))}
          </div>

          {/* The letter */}
          <article aria-label={`Briefing for ${deck.audience}`}
            style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '26px 30px' }}>
            <div className="flex items-baseline justify-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 18 }}>
              <div>
                <div className="rr-serif" style={{ fontSize: 21, color: 'var(--text)' }}>Briefing · {deck.audience}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--text2)', marginTop: 2 }}>{deck.role} · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
              <button className="press flex items-center gap-1.5" onClick={copyText} aria-label="Copy briefing text" style={{
                fontSize: 11.5, fontWeight: 500, padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                border: `1px solid ${copied ? 'var(--accent)' : 'var(--border2)'}`,
                background: copied ? 'var(--accent-bg)' : '#fff', color: copied ? 'var(--accent)' : 'var(--text2)',
              }}>{copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}{copied ? 'Copied' : 'Copy briefing'}</button>
            </div>
            {SECTIONS.map(s => (
              <section key={s.key} style={{ marginBottom: 18 }}>
                <h2 className="rr-serif" style={{ fontSize: 15.5, color: 'var(--text)', marginBottom: 5 }}>{s.label}</h2>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, maxWidth: '68ch' }}>{clean(deck[s.key])}</p>
              </section>
            ))}
          </article>
        </div>

        {/* Live risk register beside the letter */}
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', padding: '11px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Signal register, quoted in the briefings
          </div>
          {SIGNAL_RISKS.map((s, i) => (
            <div key={i} className="flex items-start gap-2.5" style={{ padding: '11px 16px', borderBottom: '1px solid var(--bg3)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: s.color }} aria-hidden />
              <span style={{ flex: 1, fontSize: 12.5, color: 'var(--text)', lineHeight: 1.5 }}>{clean(s.signal)}</span>
              <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, color: s.color, flexShrink: 0 }}>{s.type.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
