// components/drilldown/EvidencePanel.tsx — L1/L2/L3 of the drill-down, editorial edition (P2.1)
// L1: evidence set grouped by persona, titles only. L2: one insight card, full research artifact.
// L3: every card ends in a verb — copy design brief, open Magic Patterns, flag for agenda.
import { useMemo, useState } from 'react';
import { XIcon, ChevronRightIcon, CopyIcon, ExternalLinkIcon, FlagIcon, CheckIcon } from 'lucide-react';
import { getProduct } from '../../data/products';
import { evidenceClass, EVIDENCE_COLORS } from '../../data/signals';
import type { ComputedSignal } from '../../data/signals';
import type { Insight } from '../../types';
import { MAGIC_PATTERNS_PCE, MAGIC_PATTERNS_EXAM_ADMIN } from '../../data/version';

const SEV_COLORS: Record<string, string> = { critical: '#e8604a', high: '#f5a623', medium: '#6d5ed4', low: '#2ec4a0', na: '#8a8580' };
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

function Chip({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="mono" style={{
      fontSize: 12, fontWeight: color ? 600 : 400, padding: '2px 8px', borderRadius: 3,
      background: color ? `${color}14` : 'var(--bg2)', color: color ?? 'var(--text2)',
      border: color ? 'none' : '1px solid var(--bg3)',
    }}>{children}</span>
  );
}

function InsightCardV2({ insight, expanded, onToggle, onNav }: {
  insight: Insight; expanded: boolean; onToggle: () => void; onNav?: (view: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const ec = evidenceClass(insight);
  const mp = mpLinkFor(insight);

  return (
    <div style={{
      border: `1px solid ${expanded ? 'var(--border2)' : 'var(--bg3)'}`,
      borderRadius: 'var(--radius-sm)', background: '#fff', marginBottom: 7, overflow: 'hidden',
      transition: 'border-color 160ms',
    }}>
      <button onClick={onToggle} className="w-full text-left flex items-start gap-2.5" style={{ padding: '11px 13px', cursor: 'pointer' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: SEV_COLORS[insight.severity ?? 'na'] }} />
        <span className="flex-1" style={{ fontSize: 14.5, color: 'var(--text)', lineHeight: 1.5 }}>
          {expanded ? insight.text : `${insight.text.slice(0, 110)}${insight.text.length > 110 ? '…' : ''}`}
        </span>
        <ChevronRightIcon size={14} style={{ color: 'var(--text3)', flexShrink: 0, marginTop: 3, transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 160ms' }} />
      </button>

      {expanded && (
        <div style={{ padding: '0 13px 13px 22px' }}>
          {insight.pullQuote && (
            <blockquote style={{ position: 'relative', margin: '6px 0 12px', padding: '2px 0 0 22px' }}>
              <span className="rr-serif" style={{ position: 'absolute', left: 0, top: -6, fontSize: 30, color: 'var(--border2)', lineHeight: 1 }}>“</span>
              <span className="serif" style={{ fontSize: 15.5, color: 'var(--text)', lineHeight: 1.55, display: 'block' }}>{insight.pullQuote}</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--text3)', marginTop: 5, display: 'block' }}>— {insight.pullQuoteSource ?? insight.source}</span>
            </blockquote>
          )}
          <div className="flex flex-wrap gap-1.5 items-center" style={{ marginBottom: 10 }}>
            <Chip color={EVIDENCE_COLORS[ec]}>{ec}</Chip>
            {insight.confidence && <Chip>confidence: {insight.confidence}</Chip>}
            {insight.productIds.map(p => onNav
              ? <button key={p} className="press mono" onClick={() => onNav(p)} style={{ fontSize: 12, fontWeight: 500, padding: '2px 8px', borderRadius: 3, background: 'var(--bg2)', color: 'var(--accent)', border: '1px solid var(--bg3)', cursor: 'pointer' }}>{getProduct(p)?.shortName ?? p} →</button>
              : <Chip key={p}>{getProduct(p)?.shortName ?? p}</Chip>)}
          </div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--text3)', marginBottom: insight.soWhat ? 10 : 12 }}>{insight.source} · {insight.createdAt}</div>
          {insight.soWhat && (
            <div style={{ padding: '2px 0', marginBottom: 12 }}>
              <span className="mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--accent)', display: 'block', marginBottom: 3 }}>SO WHAT</span>
              <span style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.55 }}>{insight.soWhat}</span>
            </div>
          )}
          {/* L3 — actions. No dead-end reading. */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { navigator.clipboard.writeText(briefFor(insight)); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="press flex items-center gap-1.5" style={actionStyle(copied)}>
              {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}{copied ? 'Brief copied' : 'Copy design brief'}
            </button>
            {mp && (
              <a href={mp.url} target="_blank" rel="noreferrer" className="press flex items-center gap-1.5" style={actionStyle(false)}>
                <ExternalLinkIcon size={12} />{mp.label}
              </a>
            )}
            <button onClick={() => setFlagged(f => !f)} className="press flex items-center gap-1.5" style={actionStyle(flagged)}>
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
    fontSize: 13.5, fontWeight: 500, padding: '5px 11px', borderRadius: 'var(--radius-sm)',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border2)'}`,
    background: active ? 'var(--accent-bg)' : '#fff',
    color: active ? 'var(--accent)' : 'var(--text2)', cursor: 'pointer', textDecoration: 'none',
  };
}

export function EvidencePanel({ signal, activePersona, activeInsight, onPersona, onInsight, onClose, onNav }: {
  signal: ComputedSignal;
  activePersona?: string;
  activeInsight?: string;
  onPersona: (p?: string) => void;
  onInsight: (id?: string) => void;
  onClose: () => void;
  onNav?: (view: string) => void;
}) {
  const { def, insights, byPersona } = signal;
  const groups = useMemo(() =>
    PERSONA_ORDER.filter(p => byPersona[p as keyof typeof byPersona]?.length)
      .map(p => ({ id: p, label: PERSONA_LABELS[p], items: byPersona[p as keyof typeof byPersona]! })),
    [byPersona]);
  const visibleGroups = activePersona ? groups.filter(g => g.id === activePersona) : groups;

  return (
    <div style={{
      width: 460, minWidth: 460, borderLeft: '1px solid var(--border)', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      animation: 'ddSlideIn 180ms ease-out',
    }}>
      <style>{'@keyframes ddSlideIn { from { transform: translateX(24px); opacity: 0 } to { transform: none; opacity: 1 } }'}</style>

      {/* Panel header — signal identity */}
      <div style={{ padding: '16px 18px 13px', borderBottom: '1px solid var(--border)', background: '#fff' }}>
        <div className="flex items-start justify-between gap-3">
          <div style={{ minWidth: 0 }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 4 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: def.color, flexShrink: 0 }} />
              <span className="rr-serif" style={{ fontSize: 19.5, color: 'var(--text)', lineHeight: 1.2 }}>{def.title}</span>
            </div>
            <div className="serif" style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.45 }}>{def.question}</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text3)', cursor: 'pointer', padding: 2, flexShrink: 0 }}><XIcon size={16} /></button>
        </div>
        {/* Breadcrumb — the connection made visible */}
        <div className="flex items-center gap-1 flex-wrap" style={{ marginTop: 10 }}>
          <button onClick={() => { onPersona(undefined); onInsight(undefined); }} className="mono" style={crumbStyle(!activePersona && !activeInsight)}>All evidence</button>
          {activePersona && (<>
            <ChevronRightIcon size={11} style={{ color: 'var(--text3)' }} />
            <button onClick={() => onInsight(undefined)} className="mono" style={crumbStyle(!activeInsight)}>{PERSONA_LABELS[activePersona]}</button>
          </>)}
          {activeInsight && (<>
            <ChevronRightIcon size={11} style={{ color: 'var(--text3)' }} />
            <span className="mono" style={crumbStyle(true)}>{activeInsight}</span>
          </>)}
          <div className="flex-1" />
          <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>Esc walks back</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '15px 18px' }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 16 }}>
          <span className="mono" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', color: def.color, display: 'block', marginBottom: 3 }}>DESIGN RESPONSE</span>
          <span style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.55 }}>{def.designResponse}</span>
        </div>

        {/* Persona filter chips */}
        <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 15 }}>
          <button onClick={() => onPersona(undefined)} className="press" style={chipStyle(!activePersona)}>All personas · {insights.length}</button>
          {groups.map(g => (
            <button key={g.id} onClick={() => onPersona(g.id === activePersona ? undefined : g.id)} className="press" style={chipStyle(g.id === activePersona)}>
              {g.label} · {g.items.length}
            </button>
          ))}
        </div>

        {visibleGroups.map(g => (
          <div key={g.id} style={{ marginBottom: 18 }}>
            {!activePersona && (
              <div className="flex items-baseline gap-2" style={{ marginBottom: 7 }}>
                <span className="rr-serif" style={{ fontSize: 15.5, color: 'var(--text)' }}>{g.label}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>{g.items.length}</span>
                <span style={{ flex: 1, borderBottom: '1px solid var(--bg4)', transform: 'translateY(-3px)' }} />
              </div>
            )}
            {g.items.map(i => (
              <InsightCardV2 key={`${g.id}-${i.id}`} insight={i} onNav={onNav} expanded={activeInsight === i.id}
                onToggle={() => { onInsight(activeInsight === i.id ? undefined : i.id); if (!activePersona) onPersona(g.id); }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function crumbStyle(active: boolean): React.CSSProperties {
  return { fontSize: 12, fontWeight: active ? 600 : 400, color: active ? 'var(--text)' : 'var(--text3)', cursor: 'pointer', maxWidth: 170, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
}
function chipStyle(active: boolean): React.CSSProperties {
  return {
    fontSize: 13, fontWeight: 500, padding: '3.5px 11px', borderRadius: 12, cursor: 'pointer',
    border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    background: active ? 'var(--accent-bg)' : '#fff', color: active ? 'var(--accent)' : 'var(--text2)',
  };
}
