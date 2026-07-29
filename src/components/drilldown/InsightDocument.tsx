// components/drilldown/InsightDocument.tsx — insight as a published document (Benchmark D3, v17.1).
// Dovetail's published-insight anatomy at full width: cover band, display title, summary,
// evidence as a highlight span in context (D4), properties, related insights, actions.
// Reference pattern: mobbin.com/screens/dcb681d3-f78a-40a2-b80d-b8e0d2043215 (Dovetail).
import { useEffect, useMemo, useState } from 'react';
import { XIcon, CopyIcon, CheckIcon, ArrowRightIcon } from 'lucide-react';
import { getProduct } from '../../data/products';
import { PERSONAS } from '../../data/personas';
import { ALL_INSIGHTS } from '../../data/insights';
import { evidenceClass, EVIDENCE_COLORS } from '../../data/signals';
import { SEV_COLORS } from '../../data/taxonomy';
import { scoreInsight } from '../../lib/score';
import type { Insight } from '../../types';

const personaById = new Map(PERSONAS.map(p => [p.id, p]));

// The trust contract, stated where the claim is read (PRODUCT.md evidence classes).
const EC_MEANING: Record<string, string> = {
  'DIRECT QUOTE': 'Verbatim from a recorded session. The quote below is the evidence.',
  'SYNTHESIS': 'A pattern across sessions with no single quote attached. Verify against the source session before citing externally.',
  'HYPOTHESIS': 'Inferred, not confirmed by any session. Treat as an assumption until research validates it.',
};

// Granola session ids appear inline in source strings as 8-hex tokens (e.g. f29a990d).
const sessionIdOf = (i: Insight) =>
  (`${i.source} ${i.pullQuoteSource ?? ''}`.match(/\b[0-9a-f]{8}\b/) ?? [])[0];

const ageDays = (createdAt: string) =>
  Math.max(0, Math.round((Date.now() - new Date(createdAt).getTime()) / 86400000));

function splitTitle(text: string): { title: string; body: string } {
  const m = text.match(/^(.*?[.!?])\s+([\s\S]+)$/);
  return m ? { title: m[1], body: m[2] } : { title: text, body: '' };
}

function briefFor(insight: Insight): string {
  const products = insight.productIds.map(p => getProduct(p)?.name ?? p).join(', ');
  return [
    `DESIGN BRIEF — from rr-insights (${insight.id})`,
    `Evidence class: ${evidenceClass(insight)} · Severity: ${(insight.severity ?? 'n/a').toUpperCase()} · Opportunity score: ${scoreInsight(insight).label} · Source: ${insight.source}`,
    `Products: ${products}`,
    ``,
    `Finding: ${insight.text}`,
    insight.pullQuote ? `Quote: "${insight.pullQuote}" — ${insight.pullQuoteSource ?? insight.source}` : '',
    insight.soWhat ? `So what: ${insight.soWhat}` : '',
  ].filter(Boolean).join('\n');
}

function Chip({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="mono" style={{
      fontSize: 12, fontWeight: color ? 600 : 400, padding: '2.5px 9px', borderRadius: 4,
      background: color ? `${color}14` : 'var(--bg2)', color: color ?? 'var(--text2)',
      border: color ? 'none' : '1px solid var(--bg3)',
    }}>{children}</span>
  );
}

export function InsightDocument({ insight, onClose, onOpen, onNav }: {
  insight: Insight;
  onClose: () => void;
  onOpen: (i: Insight) => void;      // swap to a related insight
  onNav?: (view: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const ec = evidenceClass(insight);
  const score = scoreInsight(insight);
  const doc = splitTitle(insight.text);
  const accent = getProduct(insight.productIds[0])?.accentColor ?? 'var(--accent)';

  const related = useMemo(() => (ALL_INSIGHTS as Insight[])
    .filter(m => m.id !== insight.id
      && m.productIds.some(p => insight.productIds.includes(p))
      && m.tags.some(t => insight.tags.includes(t)))
    .map(m => ({ m, s: scoreInsight(m).total }))
    .sort((a, b) => b.s - a.s)
    .slice(0, 4), [insight]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={`Insight ${insight.id}`}
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(26,25,23,0.45)', display: 'flex', justifyContent: 'center', overflowY: 'auto', padding: '38px 20px' }}>
      <article onClick={e => e.stopPropagation()}
        style={{ width: 'min(760px, 100%)', alignSelf: 'flex-start', background: '#fff', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>

        {/* Cover band — typographic cover carrying the product hue; media evidence lands in P9 */}
        <div style={{ background: `linear-gradient(135deg, ${accent}1f, ${accent}0a)`, padding: '26px 36px 22px', position: 'relative' }}>
          <button onClick={onClose} aria-label="Close" className="press"
            style={{ position: 'absolute', top: 14, right: 14, color: 'var(--text2)', cursor: 'pointer', padding: 4 }}>
            <XIcon size={16} />
          </button>
          <div className="flex items-center gap-2" style={{ marginBottom: 12 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: SEV_COLORS[insight.severity ?? 'na'] }} />
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>{(insight.severity ?? 'ungraded').toUpperCase()}</span>
            <Chip color={EVIDENCE_COLORS[ec]}>{ec}</Chip>
            <span className="mono" title="opportunity score: severity × evidence class × persona priority"
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginLeft: 'auto', marginRight: 28 }}>{score.label}</span>
          </div>
          <h1 className="rr-serif" style={{ fontSize: 28, lineHeight: 1.22, color: 'var(--text)', maxWidth: '26ch' }}>{doc.title}</h1>
          <div className="mono" style={{ fontSize: 12.5, color: 'var(--text2)', marginTop: 12 }}>
            {insight.source} · {insight.createdAt} · {insight.id}
          </div>
        </div>

        <div style={{ padding: '24px 36px 30px' }}>
          {/* Trust strip — what kind of claim this is, how old it is, and where to verify it */}
          <div style={{
            background: ec === 'HYPOTHESIS' ? 'rgba(217,119,6,0.07)' : 'var(--bg)',
            border: `1px solid ${ec === 'HYPOTHESIS' ? 'rgba(217,119,6,0.35)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-sm)', padding: '10px 14px', marginBottom: 18,
          }}>
            <div style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.55 }}>
              <span className="mono" style={{ fontWeight: 600, color: EVIDENCE_COLORS[ec] }}>{ec}. </span>
              {EC_MEANING[ec]}
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5 }}>
              {sessionIdOf(insight)
                ? `Verify: search Granola for session ${sessionIdOf(insight)} (${insight.source}).`
                : `Verify: ${insight.source} — session id not on file; trace via the Obsidian vault note.`}
              {' '}Recorded {insight.createdAt} · {ageDays(insight.createdAt)} days old{ageDays(insight.createdAt) > 90 ? ' · aged, recheck before citing' : ''}.
            </div>
          </div>
          {doc.body && (
            <p style={{ fontSize: 15.5, color: 'var(--text)', lineHeight: 1.7, maxWidth: '66ch', marginBottom: 18 }}>{doc.body}</p>
          )}

          {insight.pullQuote && (
            <div style={{ margin: '0 0 18px' }}>
              <span className="serif" style={{
                fontSize: 17, color: 'var(--text)', lineHeight: 1.75,
                background: `${EVIDENCE_COLORS[ec]}17`, borderRadius: 3, padding: '2px 5px',
                boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
              }}>{insight.pullQuote}</span>
              <span className="mono" style={{ fontSize: 12.5, color: 'var(--text3)', marginTop: 8, display: 'block' }}>— {insight.pullQuoteSource ?? insight.source}</span>
            </div>
          )}

          {insight.soWhat && (
            <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '14px 18px', marginBottom: 18 }}>
              <span className="mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--accent)', display: 'block', marginBottom: 4 }}>SO WHAT</span>
              <span style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.6 }}>{insight.soWhat}</span>
            </div>
          )}

          {/* Properties — TheyDo-style attribute row */}
          <div className="flex flex-wrap items-center gap-1.5" style={{ marginBottom: 20 }}>
            {(insight.personaIds ?? []).map(pid => {
              const p = personaById.get(pid);
              return p ? (
                <span key={pid} className="flex items-center gap-1.5" style={{ border: '1px solid var(--bg3)', borderRadius: 99, padding: '2px 10px 2px 3px' }}>
                  <span className="flex items-center justify-center text-white mono" style={{ width: 18, height: 18, borderRadius: '50%', fontSize: 10, fontWeight: 700, background: p.avatarColor }}>{p.avatarInitials}</span>
                  <span style={{ fontSize: 12.5, color: 'var(--text2)' }}>{p.name}</span>
                </span>
              ) : null;
            })}
            {insight.productIds.map(p => onNav
              ? <button key={p} className="press mono" onClick={() => { onClose(); onNav(p); }}
                  style={{ fontSize: 12, fontWeight: 500, padding: '2.5px 9px', borderRadius: 4, background: 'var(--bg2)', color: 'var(--accent)', border: '1px solid var(--bg3)', cursor: 'pointer' }}>
                  {getProduct(p)?.shortName ?? p} →
                </button>
              : <Chip key={p}>{getProduct(p)?.shortName ?? p}</Chip>)}
            {insight.confidence && <Chip>confidence: {insight.confidence}</Chip>}
            {insight.tags.slice(0, 4).map(t => <Chip key={t}>{t}</Chip>)}
          </div>

          {related.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginBottom: 18 }}>
              <span className="mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--text3)', display: 'block', marginBottom: 8 }}>RELATED EVIDENCE</span>
              {related.map(({ m, s }) => (
                <button key={m.id} className="press w-full text-left flex items-start gap-2.5" onClick={() => onOpen(m)}
                  style={{ padding: '7px 0', cursor: 'pointer' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: SEV_COLORS[m.severity ?? 'na'] }} />
                  <span style={{ flex: 1, fontSize: 14, color: 'var(--text2)', lineHeight: 1.5 }}>{m.text.slice(0, 120)}{m.text.length > 120 ? '…' : ''}</span>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--text3)', flexShrink: 0, marginTop: 2 }}>{Math.round(s)}</span>
                  <ArrowRightIcon size={13} style={{ color: 'var(--text3)', flexShrink: 0, marginTop: 3, opacity: 0.6 }} />
                </button>
              ))}
            </div>
          )}

          <button onClick={() => { navigator.clipboard.writeText(briefFor(insight)); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="press flex items-center gap-1.5"
            style={{
              fontSize: 13.5, fontWeight: 500, padding: '6px 13px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              border: `1px solid ${copied ? 'var(--accent)' : 'var(--border2)'}`,
              background: copied ? 'var(--accent-bg)' : '#fff', color: copied ? 'var(--accent)' : 'var(--text2)',
            }}>
            {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}{copied ? 'Brief copied' : 'Copy design brief'}
          </button>
        </div>
      </article>
    </div>
  );
}
