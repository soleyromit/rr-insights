// @ts-nocheck
// views/products/ProductPage.tsx — the four-act product template (P4, UX Audit v1)
// Acts, not tabs: a narrative has an order. Act 1 stakes, Act 2 evidence, Act 3 response, Act 4 scoreboard.
// Every act leads with structure or a figure; prose is capped, deep spec stays one click away.
import { useMemo, useRef, useState } from 'react';
import * as Plot from '@observablehq/plot';
import { ChevronRightIcon, ArrowRightIcon } from 'lucide-react';
import { getProduct, PRODUCTS } from '../../data/products';
import { getInsightsByProduct } from '../../data/insights';
import { MILESTONES } from '../../data/personas';
import { PERSONAS } from '../../data/personas';
import { Figure, Masthead } from '../../components/ui/Figure';
import { PlotFigure } from '../../components/charts/PlotFigure';
import { computePhaseStates } from '../../lib/phaseDates';

const MONO = "'JetBrains Mono', monospace";
const SEV_COLORS = { critical: '#e8604a', high: '#f5a623', medium: '#6d5ed4', low: '#2ec4a0' };
const SEVERITIES = ['critical', 'high', 'medium', 'low'];
const ACTS = [
  { id: 'stakes', label: 'Act 1 · The stakes' },
  { id: 'evidence', label: 'Act 2 · The evidence' },
  { id: 'response', label: 'Act 3 · The design response' },
  { id: 'scoreboard', label: 'Act 4 · The scoreboard' },
];
const SPEC_ROUTE = {
  'exam-management': 'exam-spec', faas: 'faas-spec', 'course-eval': 'course-eval-spec',
  'skills-checklist': 'skills-spec', 'learning-contracts': 'lc-spec',
};
const personaName = pid => PERSONAS.find(p => p.id === pid)?.name ?? pid;
const parseMs = str => { const d = new Date(str); return isNaN(d) ? new Date(str.replace(/^(\w+) (\d{4})$/, '$1 1, $2')) : d; };

function SectionHead({ id, children, refs }) {
  return <h2 id={id} ref={el => refs.current[id] = el} className="rr-serif"
    style={{ fontSize: 20, color: 'var(--text)', margin: '30px 0 12px', scrollMarginTop: 60 }}>{children}</h2>;
}

export function ProductPage({ productId, onNav }) {
  const p = getProduct(productId);
  const refs = useRef({});
  const [showAll, setShowAll] = useState(false);
  const [openId, setOpenId] = useState(null);

  const insights = useMemo(() => getInsightsByProduct(productId), [productId]);
  const critical = insights.filter(i => i.severity === 'critical');
  const timelineRows = useMemo(() => insights
    .filter(i => i.severity)
    .map(i => ({ date: new Date(i.createdAt), severity: i.severity, text: i.text })), [insights]);
  const topEvidence = useMemo(() => [...insights]
    .filter(i => i.severity === 'critical' || i.severity === 'high')
    .sort((a, b) => (a.severity === b.severity ? (b.createdAt > a.createdAt ? 1 : -1) : a.severity === 'critical' ? -1 : 1)), [insights]);
  const shownEvidence = showAll ? topEvidence : topEvidence.slice(0, 6);
  const productMilestones = useMemo(() => MILESTONES
    .filter(m => m.productId === productId)
    .map(m => ({ ...m, d: parseMs(m.date) }))
    .sort((a, b) => a.d - b.d), [productId]);
  const today = new Date();

  if (!p) return null;

  const stats = [
    p.nps != null && { stat: `${p.nps}/5`, label: 'NPS baseline' },
    p.ticketsPerYear && { stat: p.ticketsPerYear.toLocaleString(), label: 'support tickets / yr' },
    { stat: insights.length, label: 'tagged insights' },
    { stat: critical.length, label: 'critical findings' },
    p.daysToDeadline && { stat: `${p.daysToDeadline}d`, label: `to planned launch (${p.launchDate ?? 'per product plan'})` },
    { stat: p.granolaSessions, label: 'research sessions' },
  ].filter(Boolean);

  const jump = id => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1080 }}>
      <Masthead title={p.name}
        lede={p.description}
        byline={`${p.status} · ${p.userCount ?? 'internal'} · pilot ${p.pilotDate ?? 'tbd'} · launch ${p.launchDate ?? 'tbd'}`} />

      {/* Act tracker — the narrative order, sticky */}
      <nav aria-label="Page acts" className="flex gap-1.5 flex-wrap" style={{ position: 'sticky', top: 0, zIndex: 5, background: 'var(--bg)', padding: '8px 0 10px', marginBottom: 6 }}>
        {ACTS.map(a => (
          <button key={a.id} className="press mono" onClick={() => jump(a.id)} style={{
            fontSize: 12.5, fontWeight: 500, padding: '4px 12px', borderRadius: 12, cursor: 'pointer',
            border: '1px solid var(--border)', background: '#fff', color: 'var(--text2)',
          }}>{a.label}</button>
        ))}
      </nav>

      {/* ── ACT 1 · THE STAKES ── */}
      <SectionHead id="stakes" refs={refs}>{p.hmwStatements[0]}</SectionHead>
      <div role="list" aria-label="Key numbers" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.length, 6)}, 1fr)`, gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 14 }}>
        {stats.map((s, i) => (
          <div key={i} role="listitem" style={{ background: '#fff', padding: '13px 15px' }}>
            <span className="rr-serif" style={{ fontSize: 24, color: 'var(--text)', lineHeight: 1 }}>{s.stat}</span>
            <span className="mono" style={{ display: 'block', fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{s.label}</span>
          </div>
        ))}
      </div>
      <blockquote style={{ position: 'relative', margin: '0 0 16px', padding: '2px 0 0 26px', maxWidth: 700 }}>
        <span className="rr-serif" style={{ position: 'absolute', left: 0, top: -8, fontSize: 34, color: 'var(--border2)', lineHeight: 1 }}>“</span>
        <span className="serif" style={{ fontSize: 16.5, color: 'var(--text)', lineHeight: 1.55, display: 'block' }}>{p.keyQuote}</span>
        <span className="mono" style={{ fontSize: 12, color: 'var(--text2)', marginTop: 5, display: 'block' }}>— {p.keyQuoteSource}</span>
      </blockquote>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Object.keys(p.dayInLife).length}, 1fr)`, gap: 14, marginBottom: 8 }}>
        {Object.entries(p.dayInLife).map(([pid, day]) => (
          <div key={pid} style={{ borderTop: '2px solid var(--border2)', paddingTop: 9 }}>
            <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 4 }}>{personaName(pid).toUpperCase()} · TODAY</div>
            <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.55 }}>{day}</p>
          </div>
        ))}
      </div>

      {/* ── ACT 2 · THE EVIDENCE ── */}
      <SectionHead id="evidence" refs={refs}>What the research says</SectionHead>
      <div style={{ marginBottom: 14 }}>
        <Figure title={`Fig. 1 · Evidence accumulation, by severity`}
          caption="Each dot is one finding landing, lane per severity. Decision: a critical lane still filling means the problem space is live; a settled lane is ready for its design response. Hover any dot for the finding.">
          <PlotFigure minHeight={4 * 30 + 66} deps={[timelineRows]} build={() => ({
            height: 4 * 30 + 62,
            marginLeft: 76, marginTop: 8, marginBottom: 26, marginRight: 12,
            style: { fontFamily: MONO, fontSize: '12.5px', background: 'transparent' },
            x: { type: 'time', label: null, tickFormat: '%b' },
            y: { label: null, domain: SEVERITIES, tickSize: 0, padding: 0.5 },
            marks: [
              Plot.ruleY(SEVERITIES, { y: d => d, stroke: '#ede9e3' }),
              Plot.dot(timelineRows, { x: 'date', y: 'severity', fill: d => SEV_COLORS[d.severity], r: 3.2, fillOpacity: 0.85, stroke: '#fff', strokeWidth: 0.6, tip: true, title: d => `${d.text.slice(0, 120)}${d.text.length > 120 ? '…' : ''}` }),
            ],
          })} />
        </Figure>
      </div>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 14 }}>
        <div className="flex items-center justify-between" style={{ padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)' }}>Critical and high findings — open a row for the full artifact</span>
          <button className="press mono" onClick={() => onNav('signals')} style={{ fontSize: 12.5, color: 'var(--accent)', cursor: 'pointer' }}>drill down in Signals →</button>
        </div>
        {shownEvidence.map(i => (
          <div key={i.id} style={{ borderBottom: '1px solid var(--bg3)' }}>
            <button className="press w-full text-left flex items-start gap-2.5" onClick={() => setOpenId(openId === i.id ? null : i.id)}
              aria-expanded={openId === i.id} style={{ padding: '11px 18px', cursor: 'pointer', background: '#fff' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 6, flexShrink: 0, background: SEV_COLORS[i.severity] }} />
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>
                {openId === i.id ? i.text : `${i.text.slice(0, 130)}${i.text.length > 130 ? '…' : ''}`}
              </span>
              <ChevronRightIcon size={13} style={{ color: 'var(--text3)', flexShrink: 0, marginTop: 3, transform: openId === i.id ? 'rotate(90deg)' : 'none', transition: 'transform 160ms' }} />
            </button>
            {openId === i.id && (
              <div style={{ padding: '0 18px 12px 33px' }}>
                {i.soWhat && <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 5 }}><span className="mono" style={{ fontWeight: 600, color: 'var(--accent)', fontSize: 12 }}>SO WHAT · </span>{i.soWhat}</p>}
                <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>{i.source} · {i.createdAt}</span>
              </div>
            )}
          </div>
        ))}
        {topEvidence.length > 6 && (
          <button className="press w-full mono" onClick={() => setShowAll(v => !v)} style={{ padding: '10px 18px', fontSize: 12.5, color: 'var(--text2)', cursor: 'pointer', background: 'var(--bg)', textAlign: 'left' }}>
            {showAll ? 'show fewer' : `+${topEvidence.length - 6} more findings`}
          </button>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 8 }}>
        {Object.entries(p.gapsByDiscipline).map(([disc, gaps]) => (
          <div key={disc} style={{ borderTop: '2px solid var(--border2)', paddingTop: 9 }}>
            <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 5 }}>{disc.toUpperCase()} GAPS · {gaps.length}</div>
            {gaps.map((g, i) => <p key={i} style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.45, marginBottom: 6 }}>{g}</p>)}
          </div>
        ))}
      </div>

      {/* ── ACT 3 · THE DESIGN RESPONSE ── */}
      <SectionHead id="response" refs={refs}>The design response</SectionHead>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '15px 18px', marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 5 }}>THE HAPPY PATH THIS PRODUCT IS BUILDING TOWARD</div>
        <div className="flex items-center gap-2 flex-wrap">
          {p.happyPath.split('→').map((step, i, arr) => (
            <span key={i} className="flex items-center gap-2">
              <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.4, background: 'var(--bg)', border: '1px solid var(--bg3)', borderRadius: 'var(--radius-sm)', padding: '6px 11px' }}>{step.trim()}</span>
              {i < arr.length - 1 && <ArrowRightIcon size={13} style={{ color: 'var(--text3)', flexShrink: 0 }} />}
            </span>
          ))}
        </div>
      </div>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', padding: '11px 18px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
          AI, embedded as product behavior — problem first, feature second
        </div>
        {p.newFeatureFramework.aiOpportunities.map(ai => (
          <div key={ai.feature} className="flex items-start gap-3" style={{ padding: '11px 18px', borderBottom: '1px solid var(--bg3)' }}>
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>{ai.feature}</span>
              <span style={{ display: 'block', fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.5, marginTop: 2 }}>{ai.problem}</span>
            </span>
            <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', flexShrink: 0, paddingTop: 3 }}>{ai.status.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 8 }}>
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', padding: '11px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Enhancement requests, by evidence weight
          </div>
          {p.amPmPipeline.enhancementRequests.map(r => (
            <div key={r.request} className="flex items-start gap-2.5" style={{ padding: '10px 16px', borderBottom: '1px solid var(--bg3)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: SEV_COLORS[r.priority] ?? '#8a8580' }} />
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', fontSize: 14, color: 'var(--text)', lineHeight: 1.45 }}>{r.request}</span>
                <span className="mono" style={{ fontSize: 12, color: 'var(--text2)' }}>{r.requestedBy} · {r.sessions} session{r.sessions > 1 ? 's' : ''}</span>
              </span>
            </div>
          ))}
        </div>
        <div>
          <div style={{ borderTop: '2px solid var(--border2)', paddingTop: 9, marginBottom: 14 }}>
            <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 5 }}>DESIGN SYSTEM COMPONENTS IN SCOPE</div>
            <div className="flex gap-1.5 flex-wrap">
              {p.newFeatureFramework.designSystemComponents.map(c => (
                <span key={c} className="mono" style={{ fontSize: 12, padding: '2.5px 9px', borderRadius: 3, background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--bg3)' }}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '2px solid var(--border2)', paddingTop: 9 }}>
            <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 5 }}>MICRO-INTERACTIONS · CLINICAL-GRADE MOTION</div>
            {p.newFeatureFramework.microInteractions.map((m, i) => (
              <p key={i} style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 4 }}>{m}</p>
            ))}
          </div>
        </div>
      </div>

      {/* ── ACT 4 · THE SCOREBOARD ── */}
      <SectionHead id="scoreboard" refs={refs}>The scoreboard</SectionHead>
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '15px 18px', marginBottom: 14 }}>
        <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 8 }}>ROADMAP PHASES</div>
        <div className="flex gap-1" role="list" aria-label="Roadmap phases (state derived from dates in phase names)">
          {(() => { const states = computePhaseStates(p.roadmapPhases.map(ph => ph.phase)); return p.roadmapPhases.map((ph, i) => {
            const st = states[i].state;
            return (
              <div key={ph.phase} role="listitem" title={`${st === 'unscheduled' ? 'No parseable date in plan. ' : st === 'passed' ? 'Date has passed. ' : st === 'next' ? 'Next dated phase. ' : ''}${ph.items.join(' · ')}`} style={{
                flex: 1, padding: '7px 11px', borderRadius: 4, fontSize: 13.5,
                background: st === 'passed' ? 'var(--bg2)' : st === 'next' ? p.accentColor : 'var(--bg2)',
                border: st === 'unscheduled' ? '1px dashed var(--border2)' : '1px solid transparent',
                color: st === 'next' ? '#fff' : st === 'passed' ? 'var(--text3)' : 'var(--text2)',
                fontWeight: st === 'next' ? 600 : 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                textDecoration: st === 'passed' ? 'line-through' : 'none',
              }}>{ph.phase}{st === 'unscheduled' ? ' ·?' : ''}</div>
            );
          }); })()}
        </div>
        <div className="mono" style={{ fontSize: 12, color: 'var(--text2)', marginTop: 6 }}>Phase state derived from dates in the plan itself. Dashed = no date recorded; struck = date passed.</div>
        {productMilestones.length > 0 && (
          <div style={{ marginTop: 12 }}>
            {productMilestones.map(m => (
              <div key={m.label} className="flex items-center gap-3" style={{ padding: '6px 0', borderTop: '1px solid var(--bg3)' }}>
                <span className="mono" style={{ fontSize: 12, color: m.d < today ? 'var(--text3)' : 'var(--text2)', width: 88, flexShrink: 0 }}>{m.date}</span>
                <span style={{ fontSize: 14, color: m.d < today ? 'var(--text3)' : 'var(--text)' }}>{m.label}</span>
                {m.isHardDeadline && m.d >= today && <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: '#c24d3a' }}>HARD</span>}
                {m.d < today && <span className="mono" style={{ fontSize: 12, color: 'var(--text3)' }}>passed</span>}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-start gap-14 flex-wrap" style={{ marginBottom: 18 }}>
        <div style={{ borderTop: '2px solid var(--border2)', paddingTop: 9, minWidth: 300, flex: 1 }}>
          <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 5 }}>DEPENDS ON</div>
          {p.productDependencies.map(d => (
            <button key={d.product} className="press w-full text-left flex items-start gap-2" onClick={() => onNav(d.product)}
              style={{ padding: '5px 0', cursor: 'pointer', fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.5 }}>
              <span className="mono" style={{ color: 'var(--accent)', fontSize: 12.5, flexShrink: 0, paddingTop: 1 }}>{getProduct(d.product)?.shortName}</span>
              <span>{d.dependency}</span>
            </button>
          ))}
        </div>
        <div style={{ borderTop: '2px solid var(--border2)', paddingTop: 9, minWidth: 240 }}>
          <div className="mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 5 }}>COMPETES WITH</div>
          <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 8 }}>
            {p.competitors.map(c => <span key={c} className="mono" style={{ fontSize: 12, padding: '2.5px 9px', borderRadius: 3, background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--bg3)' }}>{c}</span>)}
          </div>
          <button className="press mono flex items-center gap-1" onClick={() => onNav('competitive')} style={{ fontSize: 12.5, color: 'var(--accent)', cursor: 'pointer' }}>
            full parity matrix <ArrowRightIcon size={11} />
          </button>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        <button className="press mono flex items-center gap-1.5" onClick={() => onNav(SPEC_ROUTE[productId])} style={specBtn}>
          Full spec archive (pre-audit deep dive) <ArrowRightIcon size={12} />
        </button>
        {productId === 'exam-management' && (
          <button className="press mono flex items-center gap-1.5" onClick={() => onNav('exam-audit')} style={specBtn}>
            Exam Admin Audit <ArrowRightIcon size={12} />
          </button>
        )}
      </div>
    </div>
  );
}
const specBtn = { fontSize: 13, fontWeight: 500, padding: '7px 13px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border2)', background: '#fff', color: 'var(--text2)', cursor: 'pointer' };
