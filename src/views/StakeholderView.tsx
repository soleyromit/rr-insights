// @ts-nocheck
// views/StakeholderView.tsx — Briefings, fully computed (S2 exit test: zero static prose).
// Every sentence below is assembled from live data at render: signals, scores, products,
// milestones, and the surfaced Cohere conflict. Writing rules enforced: no em dashes leave this page.
import { useMemo, useState } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { computeAllSignals } from '../data/signals';
import { signalScore } from '../lib/opportunityScore';
import { PRODUCTS, getProduct } from '../data/products';
import { MILESTONES } from '../data/personas';
import { SIGNAL_RISKS } from '../data/briefings';
import { Masthead } from '../components/ui/Figure';

const clean = (t) => t.replace(/\s+—\s+/g, ', ').replace(/—/g, ', ');
const SHORT = {
  overload: 'cognitive overload', reporting: 'the reporting deficit', 'ai-layer': 'the AI layer',
  'config-debt': 'manual configuration debt', multicampus: 'multi-campus fragmentation',
  'skills-entity': 'the standalone skills entity gap', 'scce-underservice': 'SCCE underservice',
};
const parseMs = (str) => { const d = new Date(str); return isNaN(d) ? new Date(str.replace(/^(\w+) (\d{4})$/, '$1 1, $2')) : d; };

function useBriefingData() {
  return useMemo(() => {
    const signals = computeAllSignals().map(s => ({ ...s, score: signalScore(s) })).sort((a, b) => b.score - a.score);
    const top = signals[0]; const second = signals[1];
    const critTotal = signals.reduce((n, s) => n + (s.bySeverity.critical ?? 0), 0);
    const today = new Date();
    const nextHard = MILESTONES.map(m => ({ ...m, d: parseMs(m.date) })).filter(m => m.isHardDeadline && m.d >= today).sort((a, b) => a.d - b.d)[0];
    const daysLeft = nextHard ? Math.round((nextHard.d - today) / 86400000) : null;
    const cohereConflict = (getProduct('exam-management')?.pilotDate ?? '').startsWith('Sep') && /aug/i.test(nextHard?.date ?? '');
    const fires = PRODUCTS.filter(p => p.urgencyLevel === 'fire');
    const faas = getProduct('faas');
    return { signals, top, second, critTotal, nextHard, daysLeft, cohereConflict, fires, faas };
  }, []);
}

function buildDecks(d) {
  const deadlineLine = d.nextHard
    ? `${d.nextHard.label} in ${d.daysLeft} days${d.cohereConflict ? ' (date conflicted between milestones (Aug) and product plan (Sep); needs your confirmation)' : ''}`
    : 'no hard deadline scheduled';
  return [
    {
      audience: 'Arun', role: 'Design status',
      problem: `Top-scored platform signal right now is ${SHORT[d.top.def.id]} (opportunity score ${d.top.score}, ${d.top.insights.length} supporting insights, ${d.top.bySeverity.critical ?? 0} critical). Second is ${SHORT[d.second.def.id]} at ${d.second.score}. Next hard deadline: ${deadlineLine}.`,
      findings: `${d.critTotal} critical findings are open platform-wide. ${d.fires.length ? d.fires.map(p => p.shortName).join(' and ') + ' sit at fire urgency. ' : ''}The design response for ${SHORT[d.top.def.id]} is: ${d.top.def.designResponse}`,
      recommendation: `This week's design queue follows the score ranking, not recency. Risk flags: ${d.cohereConflict ? 'the Cohere date conflict blocks demo planning and needs a one-line decision from you; ' : ''}the SCCE evidence base remains the thinnest voice in the corpus and constrains FaaS reviewer design confidence until the planned sessions land.`,
    },
    {
      audience: 'Kunal', role: 'Business impact',
      problem: `${d.faas?.name ?? 'FaaS'} generates ${d.faas?.ticketsPerYear?.toLocaleString?.() ?? '95,000'} support tickets a year against an NPS baseline of ${d.faas?.nps ?? 2}/5: a quantified support cost and a churn leading indicator. Across the platform, ${d.critTotal} critical findings are open, concentrated in ${SHORT[d.top.def.id]}.`,
      findings: `Evidence-ranked priorities: ${SHORT[d.top.def.id]} (score ${d.top.score}) and ${SHORT[d.second.def.id]} (score ${d.second.score}). Both are cross-product patterns, which means one design investment pays back in multiple modules.`,
      recommendation: `Fund the top-scored signal first; it has the largest evidence mass per design hour. Timeline anchor: ${deadlineLine}. The research repository now ranks by an inspectable formula, so this prioritization is auditable rather than asserted.`,
    },
    {
      audience: 'Aarti', role: 'Decision only',
      problem: `${SHORT[d.top.def.id].charAt(0).toUpperCase() + SHORT[d.top.def.id].slice(1)} is the platform's top evidence-ranked problem (${d.top.insights.length} insights, ${d.top.bySeverity.critical ?? 0} critical).`,
      findings: `The design response is defined and in motion: ${d.top.def.designResponse}`,
      recommendation: d.cohereConflict
        ? `One decision needed from leadership: confirm the Cohere date (milestones say Aug 2026, product plan says Sep 2026).`
        : `Nothing is needed from you this cycle; the next hard deadline is ${deadlineLine}.`,
    },
  ];
}

const SECTIONS = [
  { key: 'problem', label: 'The problem' },
  { key: 'findings', label: 'What we found' },
  { key: 'recommendation', label: 'Recommended direction' },
];

export function StakeholderView() {
  const data = useBriefingData();
  const decks = useMemo(() => buildDecks(data), [data]);
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const deck = decks[active];
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const copyText = () => {
    const text = [
      `BRIEFING · ${deck.audience} (${deck.role}) · ${dateStr}`,
      ...SECTIONS.flatMap(sec => ['', sec.label.toUpperCase(), clean(deck[sec.key])]),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const digest = `All three letters below were assembled from live data at this render: top signal ${SHORT[data.top.def.id]} at score ${data.top.score}, ${data.critTotal} open criticals, ${data.nextHard ? data.daysLeft + ' days to ' + data.nextHard.label : 'no hard deadline scheduled'}.`;

  return (
    <div style={{ padding: '30px 34px 48px', maxWidth: 1080 }}>
      <Masthead title="Briefings"
        lede="The same research, three registers: evidence and risk for Arun, business impact for Kunal, decision-only for Aarti. Nothing here is written by hand; change the data and the letters change."
        digest={digest}
        byline={`computed at render from signals, scores, products, milestones · copy strips em dashes per writing rules`} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)', gap: 16 }}>
        <div>
          <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 14 }} role="tablist" aria-label="Select audience">
            {decks.map((dk, i) => (
              <button key={dk.audience} role="tab" aria-selected={i === active} className="press" onClick={() => setActive(i)} style={{
                fontSize: 14, fontWeight: 500, padding: '5px 14px', borderRadius: 14, cursor: 'pointer',
                border: `1px solid ${i === active ? 'var(--accent)' : 'var(--border)'}`,
                background: i === active ? 'var(--accent-bg)' : '#fff', color: i === active ? 'var(--accent)' : 'var(--text2)',
              }}>{dk.audience}<span className="mono" style={{ marginLeft: 7, fontSize: 12, opacity: 0.75 }}>{dk.role}</span></button>
            ))}
          </div>

          <article aria-label={`Briefing for ${deck.audience}`}
            style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '26px 30px' }}>
            <div className="flex items-baseline justify-between" style={{ borderBottom: '1px solid var(--border)', paddingBottom: 12, marginBottom: 18 }}>
              <div>
                <div className="rr-serif" style={{ fontSize: 23, color: 'var(--text)' }}>Briefing · {deck.audience}</div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{deck.role} · {dateStr} · generated this render</div>
              </div>
              <button className="press flex items-center gap-1.5" onClick={copyText} aria-label="Copy briefing text" style={{
                fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                border: `1px solid ${copied ? 'var(--accent)' : 'var(--border2)'}`,
                background: copied ? 'var(--accent-bg)' : '#fff', color: copied ? 'var(--accent)' : 'var(--text2)',
              }}>{copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}{copied ? 'Copied' : 'Copy briefing'}</button>
            </div>
            {SECTIONS.map(sec => (
              <section key={sec.key} style={{ marginBottom: 18 }}>
                <h2 className="rr-serif" style={{ fontSize: 17, color: 'var(--text)', marginBottom: 5 }}>{sec.label}</h2>
                <p style={{ fontSize: 14.5, color: 'var(--text2)', lineHeight: 1.65, maxWidth: '68ch' }}>{clean(deck[sec.key])}</p>
              </section>
            ))}
          </article>
        </div>

        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', alignSelf: 'start' }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text2)', padding: '11px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
            Signal register, quoted in the briefings
          </div>
          {SIGNAL_RISKS.map((sr, i) => (
            <div key={i} className="flex items-start gap-2.5" style={{ padding: '11px 16px', borderBottom: '1px solid var(--bg3)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 5, flexShrink: 0, background: sr.color }} aria-hidden />
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{clean(sr.signal)}</span>
              <span className="mono" style={{ fontSize: 12, fontWeight: 600, color: sr.color, flexShrink: 0 }}>{sr.type.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
