// views/HighlightsView.tsx — the highlight wall: every direct quote in the corpus (v17.1).
// Evidence as highlighted text with its speaker, in a browsable grid — the Dovetail tag-page
// pattern (mobbin.com/screens/867a0db5-2337-45eb-8d0d-71de5ed5ba1b). Two sources feed it:
// insights carrying a pullQuote, and the named-voice interviews in voices.ts.
import { useMemo, useState } from 'react';
import { ALL_INSIGHTS } from '../data/insights';
import { REAL_VOICES } from '../data/voices';
import { PRODUCTS, getProduct } from '../data/products';
import { evidenceClass, EVIDENCE_COLORS } from '../data/signals';
import { SEV_COLORS } from '../data/taxonomy';
import { Masthead } from '../components/ui/Figure';
import { InsightDocument } from '../components/drilldown/InsightDocument';
import type { Insight, ProductId } from '../types';

interface HighlightCard {
  key: string;
  quote: string;
  speaker: string;        // who said it (or the session it came from)
  detail?: string;        // title · institution for named voices
  date?: string;
  productIds: ProductId[];
  accent: string;         // highlight tint
  severity?: string;      // insight-backed cards only
  insight?: Insight;      // opens the document when present
}

export function HighlightsView({ onNav }: { onNav?: (v: string) => void }) {
  const [product, setProduct] = useState<ProductId | undefined>();
  const [open, setOpen] = useState<Insight | undefined>();

  const cards = useMemo<HighlightCard[]>(() => {
    const fromInsights = (ALL_INSIGHTS as Insight[])
      .filter(i => i.pullQuote)
      .map(i => ({
        key: i.id,
        quote: i.pullQuote!,
        speaker: i.pullQuoteSource ?? i.source,
        date: i.createdAt,
        productIds: i.productIds,
        accent: EVIDENCE_COLORS[evidenceClass(i)],
        severity: i.severity,
        insight: i,
      }));
    const fromVoices = REAL_VOICES.map(v => ({
      key: v.id,
      quote: v.quote,
      speaker: v.name,
      detail: `${v.title} · ${v.institution}`,
      productIds: v.productIds,
      accent: '#16a34a', // named voices are direct quotes by definition
    }));
    return [...fromVoices, ...fromInsights];
  }, []);

  const filtered = product ? cards.filter(c => c.productIds.includes(product)) : cards;

  const digest = useMemo(() => {
    const quoted = (ALL_INSIGHTS as Insight[]).filter(i => i.pullQuote).length;
    const criticalQuoted = (ALL_INSIGHTS as Insight[]).filter(i => i.severity === 'critical' && i.pullQuote).length;
    const criticals = (ALL_INSIGHTS as Insight[]).filter(i => i.severity === 'critical').length;
    return `${cards.length} highlights on the wall: ${REAL_VOICES.length} named voices and ${quoted} quoted insights. ${criticalQuoted} of ${criticals} criticals carry a quote — the remaining ${criticals - criticalQuoted} are the evidence debt the C1 content pass will pay down.`;
  }, [cards]);

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1120 }}>
      <Masthead title="Highlights"
        lede="What people actually said, in their words: every direct quote in the corpus with its speaker attached. This wall is the fastest answer to the stakeholder question, says who?"
        byline={`${filtered.length} highlights shown · sources: insights.ts pull quotes + voices.ts named interviews`}
        digest={digest} />

      <div className="flex flex-wrap items-center gap-1.5" style={{ marginBottom: 16 }}>
        <button className="press" onClick={() => setProduct(undefined)} style={chip(!product)}>All products · {cards.length}</button>
        {PRODUCTS.map(p => {
          const n = cards.filter(c => c.productIds.includes(p.id)).length;
          if (!n) return null;
          return (
            <button key={p.id} className="press" onClick={() => setProduct(product === p.id ? undefined : p.id)} style={chip(product === p.id)}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.accentColor, display: 'inline-block', marginRight: 6 }} />{p.shortName} · {n}
            </button>
          );
        })}
      </div>

      {/* Masonry wall — CSS columns keep card order top-to-bottom per column */}
      <div style={{ columns: '3 300px', columnGap: 14 }}>
        {filtered.map(c => {
          const Wrapper: React.ElementType = c.insight ? 'button' : 'div';
          return (
            <Wrapper key={c.key}
              {...(c.insight ? { onClick: () => setOpen(c.insight), className: 'press w-full text-left' } : {})}
              style={{
                display: 'block', width: '100%', breakInside: 'avoid', marginBottom: 14,
                background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '16px 18px', cursor: c.insight ? 'pointer' : 'default', textAlign: 'left',
              }}>
              <span className="serif" style={{
                fontSize: 15.5, color: 'var(--text)', lineHeight: 1.7,
                background: `${c.accent}14`, borderRadius: 3, padding: '1px 4px',
                boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
              }}>{c.quote}</span>
              <div style={{ marginTop: 12 }}>
                <div className="flex items-baseline gap-2">
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)' }}>{c.speaker}</span>
                  {c.date && <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>{c.date}</span>}
                </div>
                {c.detail && <div style={{ fontSize: 12.5, color: 'var(--text2)', marginTop: 1 }}>{c.detail}</div>}
                <div className="flex items-center gap-1.5" style={{ marginTop: 8 }}>
                  {c.severity && <span title={c.severity} style={{ width: 7, height: 7, borderRadius: '50%', background: SEV_COLORS[c.severity as keyof typeof SEV_COLORS] ?? 'var(--text3)' }} />}
                  {c.productIds.slice(0, 3).map(p => (
                    <span key={p} className="mono" style={{ fontSize: 11.5, padding: '1.5px 7px', borderRadius: 3, background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--bg3)' }}>
                      {getProduct(p)?.shortName ?? p}
                    </span>
                  ))}
                </div>
              </div>
            </Wrapper>
          );
        })}
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
