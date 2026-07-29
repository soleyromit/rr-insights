// views/InsightIndexView.tsx — the flat, queryable index of every insight (v17.1).
// Closes the audit's "arbitrary query" gap: until now no page listed the corpus.
// Reference pattern: TheyDo's insight table (type chip · title · personas · score),
// mobbin.com/screens/0420156b-e923-44d7-9be9-8b86205fb7b5.
import { useMemo, useState } from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { ALL_INSIGHTS } from '../data/insights';
import { PRODUCTS, getProduct } from '../data/products';
import { PERSONAS } from '../data/personas';
import { evidenceClass, EVIDENCE_COLORS } from '../data/signals';
import { SEV_COLORS } from '../data/taxonomy';
import { scoreInsight } from '../lib/score';
import { Masthead } from '../components/ui/Figure';
import { InsightDocument } from '../components/drilldown/InsightDocument';
import type { Insight, SeverityLevel } from '../types';

const personaById = new Map(PERSONAS.map(p => [p.id, p]));
const SEVERITIES: SeverityLevel[] = ['critical', 'high', 'medium', 'low'];

// Fixed type-chip assignment — identity encoding, one hue per tag family, never cycled.
const TYPE_CHIP: Record<string, { label: string; color: string }> = {
  gap: { label: 'Gap', color: '#e8604a' },
  opportunity: { label: 'Opportunity', color: '#0d9488' },
  decision: { label: 'Decision', color: '#6d5ed4' },
  architecture: { label: 'Architecture', color: '#3b82f6' },
  ai: { label: 'AI', color: '#16a34a' },
  theme: { label: 'Theme', color: '#d97706' },
};
const TYPE_ORDER = ['gap', 'opportunity', 'decision', 'architecture', 'ai', 'theme'];
const typeOf = (i: Insight) => TYPE_ORDER.find(t => (i.tags as string[]).includes(t));

const PAGE = 60;

export function InsightIndexView({ onNav }: { onNav?: (v: string) => void }) {
  const [product, setProduct] = useState<string | undefined>();
  const [severity, setSeverity] = useState<string | undefined>();
  const [sort, setSort] = useState<'score' | 'newest'>('score');
  const [limit, setLimit] = useState(PAGE);
  const [open, setOpen] = useState<Insight | undefined>();

  const rows = useMemo(() => (ALL_INSIGHTS as Insight[])
    .map(i => ({ i, score: scoreInsight(i) }))
    .filter(r => !product || r.i.productIds.includes(product as Insight['productIds'][number]))
    .filter(r => !severity || r.i.severity === severity)
    .sort((a, b) => sort === 'score'
      ? b.score.total - a.score.total || (b.i.createdAt > a.i.createdAt ? 1 : -1)
      : (b.i.createdAt > a.i.createdAt ? 1 : -1)),
    [product, severity, sort]);

  const digest = useMemo(() => {
    const all = ALL_INSIGHTS as Insight[];
    const quoted = all.filter(i => i.pullQuote).length;
    const bySev = SEVERITIES.map(s => `${all.filter(i => i.severity === s).length} ${s}`).join(' / ');
    return `${all.length} insights on file (${bySev}); ${quoted} carry a direct quote. Default order is opportunity score, so the top row is the strongest evidence-backed case in the repo.`;
  }, []);

  const visible = rows.slice(0, limit);

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1120 }}>
      <Masthead title="Insight Index"
        lede="Every insight in the corpus, one row each: type, personas, evidence class, and the opportunity score that ranks it. Filter to a product or severity, open a row to read it as a document."
        byline={`${rows.length} of ${ALL_INSIGHTS.length} insights shown · score = severity × evidence × persona priority`}
        digest={digest} />

      {/* Filters — one row above the table */}
      <div className="flex flex-wrap items-center gap-1.5" style={{ marginBottom: 14 }}>
        <button className="press" onClick={() => setProduct(undefined)} style={chip(!product)}>All products</button>
        {PRODUCTS.map(p => (
          <button key={p.id} className="press" onClick={() => setProduct(product === p.id ? undefined : p.id)} style={chip(product === p.id)}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.accentColor, display: 'inline-block', marginRight: 6 }} />{p.shortName}
          </button>
        ))}
        <span style={{ width: 1, height: 18, background: 'var(--border)', margin: '0 6px' }} />
        {SEVERITIES.map(s => (
          <button key={s} className="press mono" onClick={() => setSeverity(severity === s ? undefined : s)}
            style={{ ...chip(severity === s), fontSize: 12.5 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: SEV_COLORS[s], display: 'inline-block', marginRight: 6 }} />{s}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button className="press mono" onClick={() => setSort(sort === 'score' ? 'newest' : 'score')}
          style={{ ...chip(true), fontSize: 12.5 }}>
          sorted by {sort === 'score' ? 'score ↓' : 'newest ↓'}
        </button>
      </div>

      {/* The index table */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <div className="flex items-center mono" style={{ padding: '9px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', fontSize: 12, color: 'var(--text3)', gap: 12 }}>
          <span style={{ width: 52 }}>Score</span>
          <span style={{ flex: 1 }}>Insight</span>
          <span style={{ width: 92 }}>Type</span>
          <span style={{ width: 64 }}>Personas</span>
          <span style={{ width: 100 }}>Evidence</span>
          <span style={{ width: 78, textAlign: 'right' }}>Date</span>
          <span style={{ width: 15 }} />
        </div>
        {visible.map(({ i, score }) => {
          const t = typeOf(i);
          const ec = evidenceClass(i);
          return (
            <button key={i.id} className="press w-full text-left flex items-center" onClick={() => setOpen(i)}
              style={{ padding: '10px 16px', borderBottom: '1px solid var(--bg3)', cursor: 'pointer', background: '#fff', gap: 12 }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}>
              {/* Score: number + thin neutral bar, severity carried by the dot not the bar */}
              <span style={{ width: 52, flexShrink: 0 }} title={score.label}>
                <span className="mono" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text2)', display: 'block' }}>{Math.round(score.total)}</span>
                <span style={{ display: 'block', height: 3, borderRadius: 2, background: 'var(--bg3)', marginTop: 3 }}>
                  <span style={{ display: 'block', height: 3, borderRadius: 2, width: `${(score.total / 36) * 100}%`, background: 'var(--text3)' }} />
                </span>
              </span>
              <span className="flex items-start gap-2" style={{ flex: 1, minWidth: 0 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: SEV_COLORS[i.severity ?? 'na'] }} />
                <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {i.text}
                </span>
              </span>
              <span style={{ width: 92, flexShrink: 0 }}>
                {t && <span className="mono" style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: `${TYPE_CHIP[t].color}14`, color: TYPE_CHIP[t].color }}>{TYPE_CHIP[t].label}</span>}
              </span>
              <span className="flex" style={{ width: 64, flexShrink: 0 }}>
                {(i.personaIds ?? []).slice(0, 3).map((pid, idx) => {
                  const p = personaById.get(pid);
                  return p ? (
                    <span key={pid} title={p.name} className="flex items-center justify-center text-white mono"
                      style={{ width: 20, height: 20, borderRadius: '50%', fontSize: 10, fontWeight: 700, background: p.avatarColor, border: '2px solid #fff', marginLeft: idx ? -6 : 0 }}>
                      {p.avatarInitials}
                    </span>
                  ) : null;
                })}
              </span>
              <span style={{ width: 100, flexShrink: 0 }}>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: EVIDENCE_COLORS[ec] }}>{ec === 'DIRECT QUOTE' ? 'QUOTE' : ec}</span>
              </span>
              <span className="mono" style={{ width: 78, flexShrink: 0, fontSize: 12, color: 'var(--text3)', textAlign: 'right' }}>{i.createdAt}</span>
              <ChevronRightIcon size={14} style={{ color: 'var(--text3)', flexShrink: 0, opacity: 0.5 }} />
            </button>
          );
        })}
        {rows.length > limit && (
          <button className="press w-full mono" onClick={() => setLimit(l => l + PAGE)}
            style={{ padding: '11px 16px', fontSize: 12.5, color: 'var(--accent)', cursor: 'pointer', background: 'var(--bg)' }}>
            Show {Math.min(PAGE, rows.length - limit)} more of {rows.length - limit} remaining
          </button>
        )}
      </div>

      {open && (
        <InsightDocument insight={open} onClose={() => setOpen(undefined)} onOpen={setOpen} onNav={onNav} />
      )}
    </div>
  );
}

function chip(active: boolean): React.CSSProperties {
  return {
    fontSize: 13, fontWeight: 500, padding: '3.5px 11px', borderRadius: 12, cursor: 'pointer',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent-bg)' : '#fff', color: active ? 'var(--accent)' : 'var(--text2)',
  };
}
