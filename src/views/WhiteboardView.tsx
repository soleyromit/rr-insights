// @ts-nocheck
// views/WhiteboardView.tsx — Source Library (P5 rebuild, UX Audit v1)
// Primary sources shown as primary sources: whiteboard artifacts as a filterable gallery,
// each linked forward to the page that operationalized it. No transcription prose.
import { useMemo, useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { WHITEBOARD_ARTIFACTS } from '../data/personas';
import { Masthead } from '../components/ui/Figure';

const CATEGORY_LABELS = {
  'product-context': 'Product context', persona: 'Personas', competitor: 'Competitors',
  strategic: 'Strategy', feature: 'Features', 'exam-intel': 'Exam intel',
};
// Where each whiteboard's thinking now lives in the app
const BECAME = {
  'product-context': { target: 'overview', label: 'Command Center' },
  persona: { target: 'personas', label: 'Persona Atlas' },
  competitor: { target: 'competitive', label: 'Competitive Parity' },
  strategic: { target: 'signals', label: 'Signals' },
  feature: { target: 'roadmap', label: 'Roadmap' },
  'exam-intel': { target: 'exam-management', label: 'Exam Management' },
};

export function WhiteboardView({ onNav }) {
  const [category, setCategory] = useState('all');
  const [expanded, setExpanded] = useState({});
  const categories = useMemo(() => {
    const counts = {};
    for (const a of WHITEBOARD_ARTIFACTS) counts[a.category] = (counts[a.category] ?? 0) + 1;
    return Object.entries(counts);
  }, []);
  const shown = category === 'all' ? WHITEBOARD_ARTIFACTS : WHITEBOARD_ARTIFACTS.filter(a => a.category === category);

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1080 }}>
      <Masthead title="Source Library"
        lede="The whiteboards that started everything, kept as artifacts rather than retyped as prose. Each one links forward to the page where its thinking now lives."
        byline={`${WHITEBOARD_ARTIFACTS.length} whiteboard artifacts · Mar 20, 2026 sessions · ${WHITEBOARD_ARTIFACTS.reduce((n, a) => n + a.items.length, 0)} captured items`} />

      <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 16 }} role="tablist" aria-label="Filter by category">
        <button role="tab" aria-selected={category === 'all'} className="press" onClick={() => setCategory('all')} style={chip(category === 'all')}>
          All · {WHITEBOARD_ARTIFACTS.length}
        </button>
        {categories.map(([cat, count]) => (
          <button key={cat} role="tab" aria-selected={category === cat} className="press" onClick={() => setCategory(cat === category ? 'all' : cat)} style={chip(category === cat)}>
            {CATEGORY_LABELS[cat] ?? cat} · {count}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
        {shown.map(a => {
          const isOpen = !!expanded[a.id];
          const items = isOpen ? a.items : a.items.slice(0, 5);
          const became = BECAME[a.category];
          return (
            <article key={a.id} aria-label={a.title}
              style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px', display: 'flex', flexDirection: 'column' }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0 }} />
                <span className="rr-serif" style={{ fontSize: 16.5, color: 'var(--text)', lineHeight: 1.25 }}>{a.title}</span>
              </div>
              <span className="mono" style={{ fontSize: 9.5, color: 'var(--text2)', marginBottom: 10 }}>{a.source} · {CATEGORY_LABELS[a.category]}</span>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
                {items.map((it, i) => (
                  <li key={i} className="flex items-start gap-2" style={{ padding: '4px 0', fontSize: 12, color: 'var(--text)', lineHeight: 1.45 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', marginTop: 7, flexShrink: 0, background: 'var(--border2)' }} />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bg3)' }}>
                {a.items.length > 5 ? (
                  <button className="press mono" onClick={() => setExpanded(e => ({ ...e, [a.id]: !isOpen }))}
                    aria-expanded={isOpen} style={{ fontSize: 10.5, color: 'var(--text2)', cursor: 'pointer' }}>
                    {isOpen ? 'show less' : `+${a.items.length - 5} more items`}
                  </button>
                ) : <span />}
                {became && (
                  <button className="press mono flex items-center gap-1" onClick={() => onNav?.(became.target)}
                    style={{ fontSize: 10.5, color: 'var(--accent)', cursor: 'pointer' }}>
                    became {became.label} <ArrowRightIcon size={11} />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function chip(active) {
  return {
    fontSize: 12, fontWeight: 500, padding: '5px 14px', borderRadius: 14, cursor: 'pointer',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent-bg)' : '#fff', color: active ? 'var(--accent)' : 'var(--text2)',
  };
}
