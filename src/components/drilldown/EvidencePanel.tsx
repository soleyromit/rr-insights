// components/drilldown/EvidencePanel.tsx — L1/L2/L3 of the drill-down (P2, UX Audit v1)
// L1: evidence set grouped by persona, titles only. L2: one insight card, full artifact.
// L3: every card ends in a verb — copy design brief, open Magic Patterns, flag for agenda.
import { useMemo, useState } from 'react';
import { XIcon, ChevronRightIcon, CopyIcon, ExternalLinkIcon, FlagIcon, CheckIcon } from 'lucide-react';
import { PERSONAS } from '../../data/personas';
import { getProduct } from '../../data/products';
import { evidenceClass, EVIDENCE_COLORS } from '../../data/signals';
import type { ComputedSignal } from '../../data/signals';
import type { Insight } from '../../types';
import { MAGIC_PATTERNS_PCE, MAGIC_PATTERNS_EXAM_ADMIN } from '../../data/version';

const SEV_COLORS: Record<string, string> = {
  critical: '#dc2626', high: '#d97706', medium: '#ca8a04', low: '#16a34a', na: '#8a8580',
};
const PERSONA_ORDER = ['student', 'dce', 'scce', 'program-director', 'unassigned'];
const PERSONA_LABELS: Record<string, string> = {
  student: 'Student', dce: 'DCE / Faculty', scce: 'SCCE', 'program-director': 'Program Director', unassigned: 'Cross-persona',
};

function mpLinkFor(insight: Insight): { label: string; url: string } | null {
  if (insight.productIds.includes('course-eval')) return { label: 'Open PCE prototype', url: MAGIC_PATTERNS_PCE };
  if (insight.productIds.includes('exam-management')) return { label: 'Open Exam prototype', url: MAGIC_PATTERNS_EXAM_ADMIN };
  return null;
}

function briefFor(insight: Insight): string {
  const products = insight.productIds.map(p => getProduct(p)?.name ?? p).join(', ');
  const personas = (insight.personaIds ?? []).map(p => PERSONA_LABELS[p] ?? p).join(', ');
  return [
    `DESIGN BRIEF — from rr-insights (${insight.id})`,
    `Evidence class: ${evidenceClass(insight)} · Severity: ${(insight.severity ?? 'n/a').toUpperCase()} · Source: ${insight.source}`,
    `Products: ${products}${personas ? ` · Personas: ${personas}` : ''}`,
    ``,
    `Finding: ${insight.text}`,
    insight.pullQuote ? `Quote: "${insight.pullQuote}" — ${insight.pullQuoteSource ?? insight.source}` : '',
    insight.soWhat ? `So what: ${insight.soWhat}` : '',
  ].filter(Boolean).join('\n');
}

function InsightCardV2({ insight, expanded, onToggle }: {
  insight: Insight; expanded: boolean; onToggle: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const ec = evidenceClass(insight);
  const mp = mpLinkFor(insight);

  return (
    <div style={{
      border: `1px solid ${expanded ? 'var(--border2)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-sm)', background: '#fff', marginBottom: 6, overflow: 'hidden',
    }}>
      <button onClick={onToggle} className="w-full text-left flex items-start gap-2" style={{ padding: '10px 12px', cursor: 'pointer' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: SEV_COLORS[insight.severity ?? 'na'] }} />
        <span className="flex-1" style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.45 }}>
          {expanded ? insight.text : `${insight.text.slice(0, 110)}${insight.text.length > 110 ? '…' : ''}`}
        </span>
        <ChevronRightIcon size={14} style={{ color: 'var(--text3)', flexShrink: 0, marginTop: 3, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 160ms' }} />
      </button>

      {expanded && (
        <div style={{ padding: '0 12px 12px 21px' }}>
          {insight.pullQuote && (
            <blockquote style={{
              borderLeft: '2px solid var(--border2)', paddingLeft: 10, margin: '4px 0 10px',
              fontSize: 13, fontStyle: 'italic', color: 'var(--text2)', lineHeight: 1.5,
            }}>
              “{insight.pullQuote}”
              <div className="mono" style={{ fontSize: 10.5, fontStyle: 'normal', color: 'var(--text3)', marginTop: 3 }}>— {insight.pullQuoteSource ?? insight.source}</div>
            </blockquote>
          )}
          <div className="flex flex-wrap gap-1.5 items-center" style={{ marginBottom: 8 }}>
            <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, padding: '1.5px 7px', borderRadius: 3, background: `${EVIDENCE_COLORS[ec]}14`, color: EVIDENCE_COLORS[ec] }}>{ec}</span>
            {insight.confidence && <span className="mono" style={{ fontSize: 9.5, padding: '1.5px 7px', borderRadius: 3, background: 'var(--bg2)', color: 'var(--text2)' }}>confidence: {insight.confidence}</span>}
            {insight.productIds.map(p => <span key={p} className="mono" style={{ fontSize: 9.5, padding: '1.5px 7px', borderRadius: 3, background: 'var(--bg2)', color: 'var(--text2)' }}>{getProduct(p)?.shortName ?? p}</span>)}
            <span className="mono" style={{ fontSize: 9.5, color: 'var(--text3)' }}>{insight.source}</span>
          </div>
          {insight.soWhat && (
            <div style={{ background: 'var(--accent-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 10px', fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 10 }}>
              <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--accent)', display: 'block', marginBottom: 2 }}>SO WHAT</span>
              {insight.soWhat}
            </div>
          )}
          {/* L3 — actions. No dead-end reading. */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { navigator.clipboard.writeText(briefFor(insight)); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="flex items-center gap-1.5" style={actionStyle(copied)}>
              {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}{copied ? 'Brief copied' : 'Copy design brief'}
            </button>
            {mp && (
              <a href={mp.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5" style={actionStyle(false)}>
                <ExternalLinkIcon size={12} />{mp.label}
              </a>
            )}
            <button onClick={() => setFlagged(f => !f)} className="flex items-center gap-1.5" style={actionStyle(flagged)}>
              <FlagIcon size={12} />{flagged ? 'On research agenda' : 'Flag for research agenda'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function actionStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 11.5, fontWeight: 500, padding: '5px 10px', borderRadius: 'var(--radius-sm)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}`,
    background: active ? 'var(--accent-bg)' : '#fff',
    color: active ? 'var(--accent)' : 'var(--text2)', cursor: 'pointer', textDecoration: 'none',
  };
}

export function EvidencePanel({ signal, activePersona, activeInsight, onPersona, onInsight, onClose }: {
  signal: ComputedSignal;
  activePersona?: string;
  activeInsight?: string;
  onPersona: (p?: string) => void;
  onInsight: (id?: string) => void;
  onClose: () => void;
}) {
  const { def, insights, byPersona } = signal;
  const groups = useMemo(() =>
    PERSONA_ORDER.filter(p => byPersona[p as keyof typeof byPersona]?.length)
      .map(p => ({ id: p, label: PERSONA_LABELS[p], items: byPersona[p as keyof typeof byPersona]! })),
    [byPersona]);
  const visibleGroups = activePersona ? groups.filter(g => g.id === activePersona) : groups;

  return (
    <div style={{
      width: 440, minWidth: 440, borderLeft: '1px solid var(--border)', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      animation: 'ddSlideIn 180ms ease-out',
    }}>
      <style>{'@keyframes ddSlideIn { from { transform: translateX(24px); opacity: 0 } to { transform: none; opacity: 1 } }'}</style>
      {/* Breadcrumb — the connection made visible */}
      <div className="flex items-center gap-1 flex-wrap" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: '#fff' }}>
        <button onClick={() => { onPersona(undefined); onInsight(undefined); }} className="mono" style={crumbStyle(!activePersona && !activeInsight)}>
          {def.title}
        </button>
        {activePersona && (<>
          <ChevronRightIcon size={12} style={{ color: 'var(--text3)' }} />
          <button onClick={() => onInsight(undefined)} className="mono" style={crumbStyle(!activeInsight)}>{PERSONA_LABELS[activePersona]}</button>
        </>)}
        {activeInsight && (<>
          <ChevronRightIcon size={12} style={{ color: 'var(--text3)' }} />
          <span className="mono" style={crumbStyle(true)}>{activeInsight}</span>
        </>)}
        <div className="flex-1" />
        <span className="mono" style={{ fontSize: 10, color: 'var(--text3)' }}>Esc walks back</span>
        <button onClick={onClose} style={{ color: 'var(--text3)', cursor: 'pointer', padding: 2 }}><XIcon size={15} /></button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px' }}>
        <div style={{ fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 6, fontStyle: 'italic' }}>{def.question}</div>
        <div style={{ background: '#fff', border: `1px solid var(--border)`, borderLeft: `3px solid ${def.color}`, borderRadius: 'var(--radius-sm)', padding: '9px 11px', fontSize: 12.5, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 16 }}>
          <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, color: 'var(--text3)', display: 'block', marginBottom: 2 }}>DESIGN RESPONSE</span>
          {def.designResponse}
        </div>

        {/* Persona filter chips */}
        <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 14 }}>
          <button onClick={() => onPersona(undefined)} style={chipStyle(!activePersona)}>All personas · {insights.length}</button>
          {groups.map(g => (
            <button key={g.id} onClick={() => onPersona(g.id === activePersona ? undefined : g.id)} style={chipStyle(g.id === activePersona)}>
              {g.label} · {g.items.length}
            </button>
          ))}
        </div>

        {visibleGroups.map(g => (
          <div key={g.id} style={{ marginBottom: 16 }}>
            {!activePersona && <div className="eyebrow" style={{ marginBottom: 6 }}>{g.label} · {g.items.length}</div>}
            {g.items.map(i => (
              <InsightCardV2 key={`${g.id}-${i.id}`} insight={i} expanded={activeInsight === i.id}
                onToggle={() => { onInsight(activeInsight === i.id ? undefined : i.id); if (!activePersona) onPersona(g.id); }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function crumbStyle(active: boolean): React.CSSProperties {
  return { fontSize: 10.5, fontWeight: active ? 600 : 400, color: active ? 'var(--text)' : 'var(--text3)', cursor: 'pointer', maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
}
function chipStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 11, fontWeight: 500, padding: '3.5px 10px', borderRadius: 12, cursor: 'pointer',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent-bg)' : '#fff', color: active ? 'var(--accent)' : 'var(--text2)',
  };
}
