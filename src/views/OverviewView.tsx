// ─────────────────────────────────────────────────────────────────────────────
//  OverviewView.tsx  — Storytelling-first entry point
//  Philosophy: editorial front page, not a metrics dashboard.
//  One dominant signal. Clear "what to look at first". Route to action.
// ─────────────────────────────────────────────────────────────────────────────
import { PRODUCTS } from '../data/products';
import { INSIGHTS } from '../data/insights';

const BUILD_TIME = __BUILD_TIME__;
const COMMIT_SHA = __COMMIT_SHA__;

function formatBuildTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
      timeZoneName: 'short', timeZone: 'America/New_York',
    });
  } catch { return iso; }
}

interface Props { onNav: (view: string) => void; }

const STORY_BEATS = [
  {
    id: 'narrative', urgency: 'critical' as const,
    label: 'START HERE — CONNECT THE DOTS',
    headline: 'Five arguments about why the next design decisions matter more than they appear.',
    subhead: '35 Granola sessions + 1,282 NPS responses + 3 user interviews read as one document. What the signals mean together — not separately.',
    action: 'Read the full narrative →', nav: 'narrative',
    accentColor: '#6d5ed4', bgColor: 'rgba(109,94,212,0.05)',
  },
  {
    id: 'qb', urgency: 'critical' as const,
    label: 'ACTIVE — QUESTION BANK DESIGN',
    headline: 'Access model finalized. Arti review next week.',
    subhead: '4-user access model confirmed. Archive not delete. Draft/saved versioning. 3-tier attributes system. Smart Views scoped to assessment creation, not the bank. Design must be Vishaka-approved before prototype.',
    action: 'Open Exam Management', nav: 'exam-management',
    accentColor: '#8b7ff5', bgColor: 'rgba(139,127,245,0.05)',
  },
  {
    id: 'nps', urgency: 'critical' as const,
    label: 'NPS 2025 — FACULTY -49.1 · STUDENT -47.5',
    headline: 'Faculty NPS is worse than student NPS. Power users are the most dissatisfied.',
    subhead: 'Navigation/findability: 218 complaints. Mobile UX: 167. Preceptor form length: 134. Compliance false positives: 98. These are not feature requests — they are architecture failures.',
    action: 'Read NPS Intelligence', nav: 'nps',
    accentColor: '#dc2626', bgColor: 'rgba(220,38,38,0.05)',
  },
  {
    id: 'pce', urgency: 'high' as const,
    label: 'COURSE EVAL — DESIGN BEGINS JUNE 1',
    headline: 'Anthology fails to show all instructors. The bar is low. Exxat can clear it.',
    subhead: 'Dr. Wu missing from initial grid. Role context unlabeled. Daily email reminders cause alert fatigue. Three-tier eval model confirmed. AI sentiment analysis is the differentiation — no explicit AI labeling.',
    action: 'Open Course Eval', nav: 'course-eval',
    accentColor: '#0d9488', bgColor: 'rgba(13,148,136,0.05)',
  },
];

const PRODUCT_COLORS: Record<string, { accent: string; bg: string }> = {
  'exam-management':    { accent: '#8b7ff5', bg: 'rgba(139,127,245,0.07)' },
  faas:                 { accent: '#f5a623', bg: 'rgba(245,166,35,0.07)' },
  'course-eval':        { accent: '#2ec4a0', bg: 'rgba(46,196,160,0.07)' },
  'skills-checklist':   { accent: '#78aaf5', bg: 'rgba(120,170,245,0.07)' },
  'learning-contracts': { accent: '#e87ab5', bg: 'rgba(232,122,181,0.07)' },
};
const URGENCY_LABEL: Record<string, string> = { fire: 'CRITICAL', warn: 'HIGH', ok: 'SCOPED' };
const URGENCY_DOT:  Record<string, string> = { fire: '#dc2626', warn: '#b45309', ok: '#16a34a' };

const THIS_WEEK = [
  { label: 'QB access model + attributes — Arti review pending',  due: 'Next week',        color: '#8b7ff5' },
  { label: 'Vishaka alignment before any new prototype work',      due: 'Process gate',     color: '#dc2626' },
  { label: 'PCE: Spec freeze end of May, design June 1',          due: 'June 1',           color: '#0d9488' },
  { label: 'Design system v1 sign-off with Himanshu → Arti',      due: 'Before dev build', color: '#f5a623' },
];

const PLATFORM_SIGNALS = [
  { signal: 'AI opportunity layer',        desc: 'All 5 products have confirmed AI use cases. ExamSoft is anti-AI — Exxat\'s strategic gap.',              strength: 8, color: '#6d5ed4' },
  { signal: 'External spreadsheet dependency', desc: 'Students, faculty, and admins maintain parallel Excel systems because Exxat doesn\'t serve their real job.', strength: 7, color: '#dc2626' },
  { signal: 'No task-based home screen',   desc: 'NPS 2025: "No visible list of tasks when I log in." Affects every product. Navigation failure.',           strength: 7, color: '#b45309' },
  { signal: 'Monster Grid replacement',    desc: 'Touro: all assessment data in one view. Exxat can own this across all program types.',                    strength: 6, color: '#0d9488' },
  { signal: 'Reporting deficit',           desc: 'Program Directors cannot self-serve accreditation reports in any product. Manual export everywhere.',      strength: 6, color: '#b45309' },
  { signal: 'Mobile / SCCE gap',          desc: 'SCCEs use mobile in clinical settings. FaaS + Skills require desktop for key workflows.',                  strength: 5, color: '#f5a623' },
];

export function OverviewView({ onNav }: Props) {
  const criticalCount = INSIGHTS.filter(i => i.severity === 'critical').length;
  const platformCount = INSIGHTS.filter(i => i.tags.includes('platform')).length;
  const aiCount = INSIGHTS.filter(i => i.tags.includes('opportunity')).length;
  const recentNew = [...INSIGHTS].filter(i => i.tags.includes('new'))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);

  return (
    <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

      {/* HEADER */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 21, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', marginBottom: 3, fontFamily: 'var(--rr-serif, Georgia, serif)' }}>Platform Overview</h1>
          <p style={{ fontSize: 10, color: 'var(--text3)' }}>5 products · 35 sessions synced (Apr 23) · {INSIGHTS.length} insights · v6.0</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 7, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#2ec4a0' }} />
            <span style={{ fontSize: 10, color: 'var(--text2)' }}>Updated {formatBuildTime(BUILD_TIME)}</span>
          </div>
          <a href={`https://github.com/soleyromit/rr-insights/commit/${COMMIT_SHA}`} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text3)', padding: '2px 6px', borderRadius: 4, background: 'var(--bg3)', border: '1px solid var(--border)', textDecoration: 'none' }}>
            {COMMIT_SHA}
          </a>
        </div>
      </div>

      {/* KEY NUMBERS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { n: INSIGHTS.length, label: 'Insights indexed', sub: '5 products · 39 sessions', color: '#6d5ed4' },
          { n: criticalCount,   label: 'Critical signals',  sub: 'Need design response now',   color: '#dc2626' },
          { n: platformCount,   label: 'Platform signals',  sub: 'Cross-product patterns',     color: '#b45309' },
          { n: aiCount,         label: 'AI opportunities',  sub: 'Sourced from sessions',       color: '#0d9488' },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 9, padding: '12px 14px' }}>
            <div style={{ fontSize: 26, fontWeight: 700, color: item.color, fontFamily: 'Georgia, serif', lineHeight: 1 }}>{item.n}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginTop: 3 }}>{item.label}</div>
            <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 1 }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* STORY BEATS — what to look at first */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>What needs a response — in order</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {STORY_BEATS.map((beat, idx) => (
            <button key={beat.id} onClick={() => onNav(beat.nav)}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 9, border: '1px solid var(--border)', background: beat.bgColor, textAlign: 'left', cursor: 'pointer', width: '100%', transition: 'border-color 120ms' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = beat.accentColor + '50')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}>
              {/* number */}
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: beat.accentColor + '18', border: `1px solid ${beat.accentColor}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: beat.accentColor }}>{idx + 1}</span>
              </div>
              {/* label + headline + sub */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.08em', color: beat.accentColor, textTransform: 'uppercase', marginBottom: 2 }}>{beat.label}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{beat.headline}</div>
                <div style={{ fontSize: 10, color: 'var(--text2)', lineHeight: 1.5 }}>{beat.subhead}</div>
              </div>
              {/* cta */}
              <div style={{ flexShrink: 0, fontSize: 9, fontWeight: 600, color: beat.accentColor, border: `1px solid ${beat.accentColor}35`, borderRadius: 5, padding: '3px 9px', whiteSpace: 'nowrap' }}>
                {beat.action} →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2-COL: PRODUCTS + THIS WEEK */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18, marginBottom: 20 }}>

        {/* Products */}
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>5 products — by urgency</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {PRODUCTS.map(p => {
              const c = PRODUCT_COLORS[p.id] ?? { accent: '#6d5ed4', bg: 'rgba(109,94,212,0.07)' };
              const pInsights = INSIGHTS.filter(i => i.productIds.includes(p.id as never));
              const newCount = pInsights.filter(i => i.tags.includes('new')).length;
              const urgLabel = URGENCY_LABEL[p.urgencyLevel ?? 'ok'] ?? 'SCOPED';
              const urgDot = URGENCY_DOT[p.urgencyLevel ?? 'ok'] ?? '#16a34a';
              return (
                <button key={p.id} onClick={() => onNav(p.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg2)', textAlign: 'left', cursor: 'pointer', width: '100%', transition: 'all 120ms' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = c.accent + '50'; e.currentTarget.style.background = c.bg; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)'; }}>
                  <div style={{ width: 3, height: 28, borderRadius: 2, background: c.accent, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 1 }}>{p.name}</div>
                    <div style={{ fontSize: 9, color: 'var(--text3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>{p.description}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'JetBrains Mono, monospace' }}>{pInsights.length}</div>
                      <div style={{ fontSize: 8, color: 'var(--text3)' }}>insights</div>
                    </div>
                    {newCount > 0 && <span style={{ fontSize: 8, fontWeight: 700, background: c.accent + '18', color: c.accent, borderRadius: 3, padding: '1px 5px' }}>+{newCount} new</span>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <div style={{ width: 5, height: 5, borderRadius: '50%', background: urgDot }} />
                      <span style={{ fontSize: 8, fontWeight: 600, color: urgDot, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{urgLabel}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* This week */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>This week</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {THIS_WEEK.map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 7, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 3, height: 18, borderRadius: 1, background: item.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--text)', lineHeight: 1.35 }}>{item.label}</div>
                    <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 1 }}>{item.due}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Latest from Granola */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>Latest from Granola</div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentNew.map((insight, idx) => (
                <div key={insight.id} style={{ padding: '7px 0', borderBottom: idx < recentNew.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', gap: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', marginTop: 4, flexShrink: 0, background: insight.severity === 'critical' ? '#dc2626' : insight.severity === 'high' ? '#b45309' : '#6d5ed4' }} />
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{insight.text}</div>
                    <div style={{ fontSize: 8, color: 'var(--text3)', marginTop: 1 }}>{insight.source}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3-YEAR VISION STRIP */}
      <div style={{ background: 'linear-gradient(135deg,rgba(109,94,212,0.07) 0%,rgba(13,148,136,0.07) 100%)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px', marginBottom: 20 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#6d5ed4', textTransform: 'uppercase', marginBottom: 10 }}>Arun's 3-year vision · Mar 24, 2026</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { yr: '2026', lbl: 'Year 1', head: 'Beat LMS quizzes', desc: 'Canvas/D2L/Blackboard parity + better UX. Free for Prism users. Lockdown browser integration. One flagship AI feature on admin side.', color: '#6d5ed4' },
            { yr: '2027', lbl: 'Year 2', head: 'Match ExamSoft', desc: 'Full feature parity + better UI. Several AI use cases. Begin charging. ExamSoft is publicly anti-AI — this is the gap.', color: '#0d9488' },
            { yr: '2028', lbl: 'Year 3', head: 'Far beyond ExamSoft', desc: 'AI proctoring. Adaptive NCLEX/GRE-style CAT. Possibly own lockdown browser. Price equal to or less. No rational reason to stay on ExamSoft.', color: '#e87ab5' },
          ].map(item => (
            <div key={item.yr}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: item.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{item.lbl}</span>
                <span style={{ fontSize: 8, color: 'var(--text3)', fontFamily: 'JetBrains Mono, monospace' }}>{item.yr}</span>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{item.head}</div>
              <div style={{ fontSize: 9, color: 'var(--text2)', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PLATFORM SIGNALS */}
      <div>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: 8 }}>Platform-level signals — appear in 3+ products</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 7 }}>
          {PLATFORM_SIGNALS.map(item => (
            <div key={item.signal} style={{ padding: '10px 12px', borderRadius: 7, background: 'var(--bg2)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text)' }}>{item.signal}</span>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ width: 3, height: 9, borderRadius: 1, background: i < item.strength ? item.color : 'var(--bg4)' }} />
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 9, color: 'var(--text3)', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
