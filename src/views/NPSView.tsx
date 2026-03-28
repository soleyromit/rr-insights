// @ts-nocheck
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, PieChart, Pie, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line,
} from 'recharts';

/* ─── NPS 2025 DATA ─────────────────────────────────────────────────────── */
const STUDENT_DIST = [
  { score: '0', count: 207 }, { score: '1', count: 73 }, { score: '2', count: 86 },
  { score: '3', count: 107 }, { score: '4', count: 96 }, { score: '5', count: 160 },
  { score: '6', count: 107 }, { score: '7', count: 115 }, { score: '8', count: 104 },
  { score: '9', count: 74 },  { score: '10', count: 153 },
];

const SEGMENT_DATA = [
  { name: 'Detractors (0–6)', value: 836, pct: 65, color: '#dc2626' },
  { name: 'Passives (7–8)',   value: 219, pct: 17, color: '#d97706' },
  { name: 'Promoters (9–10)', value: 227, pct: 18, color: '#16a34a' },
];

const PERSONA_NPS = [
  { persona: 'Student', nps: -47.5, n: 1282, color: '#dc2626' },
  { persona: 'Faculty',  nps: -49.1, n: 108,  color: '#dc2626' },
  { persona: 'Admin',    nps: -4.8,  n: 104,  color: '#d97706' },
  { persona: 'Sites (SCCE)', nps: 8.0, n: 8, color: '#0d9488' },
  { persona: 'Approve',  nps: 87.5,  n: 8,   color: '#16a34a' },
];

const DOMAIN_NPS = [
  { domain: 'Physical Therapy',      avg: 4.46, n: 150, nps: -52 },
  { domain: 'Emerging Disciplines',  avg: 4.61, n: 170, nps: -49 },
  { domain: 'Occupational Therapy',  avg: 4.91, n: 68,  nps: -46 },
  { domain: 'Physician Assistant',   avg: 5.04, n: 161, nps: -44 },
  { domain: 'Nursing',               avg: 5.13, n: 608, nps: -42 },
  { domain: 'Speech-Language Path',  avg: 5.36, n: 14,  nps: -38 },
];

const THEMES = [
  { theme: 'Navigation / findability', count: 218, severity: 'critical', product: 'Platform', quote: 'I cannot find hour tracking. Many features in confusing locations.' },
  { theme: 'Mobile clocking UX', count: 167, severity: 'critical', product: 'Skills / LC', quote: 'Should be able to tap check-in once and it saves.' },
  { theme: 'Preceptor form length', count: 134, severity: 'critical', product: 'FaaS', quote: 'Lengthy evaluations discouraged preceptors from filling them out.' },
  { theme: 'Login friction', count: 112, severity: 'high', product: 'Platform', quote: 'Have to log in multiple times to get to the homepage.' },
  { theme: 'Compliance false positives', count: 98,  severity: 'high', product: 'FaaS', quote: 'Shows requirement missing after program cleared it. Causes anxiety.' },
  { theme: 'Diagnosis / log limitations', count: 87, severity: 'high', product: 'Skills / LC', quote: 'Extremely limited diagnosis tab. Cannot set overall hour total.' },
  { theme: 'Confusing UI labels', count: 72, severity: 'medium', product: 'Platform', quote: 'This is so confusing / it is not intuitive.' },
  { theme: 'No multi-placement view', count: 61, severity: 'high', product: 'Skills', quote: 'Cannot see total hours across multiple placements except on mobile app.' },
  { theme: 'No edit after submit', count: 54, severity: 'medium', product: 'FaaS', quote: 'The inability to edit something after being passed in.' },
  { theme: 'Support response time', count: 48, severity: 'medium', product: 'Platform', quote: 'I hate I cannot speak to anyone. Delayed response causes me anxiety.' },
];

const APPROVE_ATTRS = [
  { attr: 'Expertise on requirements', value: 6 },
  { attr: 'Responsiveness',            value: 6 },
  { attr: 'Turnaround time',           value: 4 },
  { attr: 'Email support for students',value: 3 },
  { attr: 'Quality of review',         value: 3 },
];

const DESIGN_LEVERAGE = [
  { subject: 'Navigation', before: 20, after: 55 },
  { subject: 'Mobile UX',  before: 25, after: 60 },
  { subject: 'Form length',before: 35, after: 65 },
  { subject: 'Compliance', before: 30, after: 60 },
  { subject: 'Login',      before: 40, after: 70 },
];

const CS = { fontSize: 10, fill: '#6b7280' };
const SEV_COLOR: Record<string, string> = { critical: '#dc2626', high: '#d97706', medium: '#6d5ed4' };

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="p-4 rounded-xl border text-center" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>{label}</div>
      <div className="text-[32px] font-bold leading-none mb-1" style={{ color }}>{value}</div>
      <div className="text-[11px]" style={{ color: 'var(--text3)' }}>{sub}</div>
    </div>
  );
}

export function NPSView() {
  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      <div>
        <div className="text-[22px] font-semibold mb-1" style={{ fontFamily: 'DM Serif Display, serif', color: 'var(--text)' }}>
          NPS Intelligence — 2025
        </div>
        <p className="text-[13px]" style={{ color: 'var(--text3)' }}>
          1,494 responses across Exxat Prism (student, admin, faculty), Exxat One Sites, and Approve. Textual analysis of 1,275 student qualitative responses. This is the attitudinal baseline for all design work.
        </p>
      </div>

      {/* Top metrics */}
      <div className="grid grid-cols-5 gap-3">
        <MetricCard label="Student NPS" value="-47.5" sub="n=1,282 · 65% detractors" color="#dc2626" />
        <MetricCard label="Faculty NPS" value="-49.1" sub="n=108 · worst segment" color="#dc2626" />
        <MetricCard label="Admin NPS"   value="-4.8"  sub="n=104 · least bad" color="#d97706" />
        <MetricCard label="Sites (SCCE)" value="+8"  sub="n=8 · training-dependent" color="#0d9488" />
        <MetricCard label="Approve"     value="+87.5" sub="n=8 · managed service" color="#16a34a" />
      </div>

      {/* Score distribution + segments */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>Student score distribution (n=1,282)</div>
          <div className="text-[11px] mb-3" style={{ color: 'var(--text3)' }}>Bimodal: mass at 0–3 and 5–6. Almost no 4s or 8–9s. Pattern = hate or tolerate. Near zero delight.</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={STUDENT_DIST} margin={{ left: -10 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="score" tick={CS} label={{ value: 'NPS Score', position: 'insideBottom', offset: -2, style: CS }} />
              <YAxis tick={CS} />
              <Tooltip contentStyle={{ fontSize: 11, background: 'var(--bg2)', border: '1px solid var(--border)' }} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {STUDENT_DIST.map((d) => (
                  <Cell key={d.score} fill={+d.score <= 6 ? '#dc2626' : +d.score <= 8 ? '#d97706' : '#16a34a'} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>Segment breakdown</div>
          <div className="text-[11px] mb-2" style={{ color: 'var(--text3)' }}>NPS = % Promoters − % Detractors = 18 − 65 = -47</div>
          <ResponsiveContainer width="100%" height={130}>
            <PieChart>
              <Pie data={SEGMENT_DATA} dataKey="value" cx="50%" cy="50%" outerRadius={55} label={({ name, pct }) => `${pct}%`} labelLine={false} fontSize={10}>
                {SEGMENT_DATA.map(s => <Cell key={s.name} fill={s.color} />)}
              </Pie>
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {SEGMENT_DATA.map(s => (
              <div key={s.name} className="flex justify-between text-[11px]">
                <span style={{ color: 'var(--text2)' }}>{s.name}</span>
                <span className="mono" style={{ color: s.color }}>{s.value} ({s.pct}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Persona comparison */}
      <div className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>NPS by persona — the design priority signal</div>
        <div className="text-[11px] mb-3" style={{ color: 'var(--text3)' }}>Admin surfaces are adequate. Student and faculty are near-equivalent in dissatisfaction. These two personas are the design priority for 2026–2027.</div>
        <div className="flex gap-3 flex-wrap">
          {PERSONA_NPS.map(p => (
            <div key={p.persona} className="flex-1 min-w-[140px] p-3 rounded-lg border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>{p.persona}</div>
              <div className="text-[26px] font-bold leading-none" style={{ color: p.color }}>{p.nps > 0 ? '+' : ''}{p.nps}</div>
              <div className="text-[10px] mono mt-1" style={{ color: 'var(--text3)' }}>n={p.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain breakdown */}
      <div className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>Student NPS by discipline — design leverage by domain</div>
        <div className="text-[11px] mb-3" style={{ color: 'var(--text3)' }}>Nursing = 608 responses (47% of total). Nursing improvements move the overall metric most.</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={DOMAIN_NPS} layout="vertical" margin={{ left: 120, right: 40 }}>
            <CartesianGrid horizontal={false} stroke="var(--border)" />
            <XAxis type="number" domain={[-60, 0]} tick={CS} />
            <YAxis type="category" dataKey="domain" tick={{ fontSize: 10, fill: '#6b7280' }} width={120} />
            <Tooltip contentStyle={{ fontSize: 11, background: 'var(--bg2)', border: '1px solid var(--border)' }}
              formatter={(v, n, p) => [`NPS: ${v} (n=${p.payload.n})`, p.payload.domain]} />
            <Bar dataKey="nps" radius={[0, 3, 3, 0]}>
              {DOMAIN_NPS.map(d => <Cell key={d.domain} fill="#dc2626" opacity={0.6 + (d.n / 1000)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top themes */}
      <div className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
        <div className="text-[11px] uppercase tracking-widest mb-3" style={{ color: 'var(--text3)' }}>Detractor themes — ranked by frequency (n=835 negative responses analyzed)</div>
        <div className="space-y-2">
          {THEMES.map((t, i) => (
            <div key={t.theme} className="flex gap-3 p-3 rounded-lg border" style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}>
              <div className="text-[11px] font-semibold mono w-4 text-right flex-shrink-0 pt-0.5" style={{ color: 'var(--text3)' }}>{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{t.theme}</span>
                  <span className="text-[9px] mono px-1.5 py-0.5 rounded" style={{ background: `${SEV_COLOR[t.severity]}18`, color: SEV_COLOR[t.severity] }}>{t.severity}</span>
                  <span className="text-[9px] mono" style={{ color: 'var(--text3)' }}>{t.product}</span>
                </div>
                <div className="text-[11px] italic" style={{ color: 'var(--text3)' }}>"{t.quote}"</div>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="text-[18px] font-bold" style={{ color: SEV_COLOR[t.severity] }}>{t.count}</div>
                <div className="text-[9px] mono" style={{ color: 'var(--text3)' }}>mentions</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approve benchmark */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border" style={{ background: 'rgba(22,163,74,0.03)', borderColor: 'rgba(22,163,74,0.2)' }}>
          <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: '#16a34a' }}>Approve — the highest NPS product (+87.5)</div>
          <div className="text-[11px] mb-3" style={{ color: 'var(--text3)' }}>Managed service model. Human expertise + fast response wins where self-service fails. Every FaaS feature should ask: can this match what Approve does manually?</div>
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={APPROVE_ATTRS} layout="vertical" margin={{ left: 130 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" tick={CS} />
              <YAxis type="category" dataKey="attr" tick={{ fontSize: 9, fill: '#6b7280' }} width={130} />
              <Tooltip contentStyle={{ fontSize: 11 }} />
              <Bar dataKey="value" fill="#16a34a" fillOpacity={0.7} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--bg2)', borderColor: 'var(--border)' }}>
          <div className="text-[11px] uppercase tracking-widest mb-1" style={{ color: 'var(--text3)' }}>Projected NPS lift — design intervention impact</div>
          <div className="text-[11px] mb-3" style={{ color: 'var(--text3)' }}>Estimated satisfaction score (0–10) per theme before and after design fix. Model-based, not measured.</div>
          <ResponsiveContainer width="100%" height={130}>
            <RadarChart data={DESIGN_LEVERAGE}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: '#6b7280' }} />
              <Radar name="Current" dataKey="before" stroke="#dc2626" fill="#dc2626" fillOpacity={0.15} />
              <Radar name="After fix" dataKey="after" stroke="#16a34a" fill="#16a34a" fillOpacity={0.15} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Design mandate */}
      <div className="p-4 rounded-xl border" style={{ background: 'rgba(109,94,212,0.04)', borderColor: 'rgba(109,94,212,0.2)' }}>
        <div className="text-[11px] uppercase tracking-widest mb-2" style={{ color: '#6d5ed4' }}>Design mandate from NPS data</div>
        <div className="grid grid-cols-3 gap-4 text-[12px]" style={{ color: 'var(--text2)' }}>
          <div><strong style={{ color: 'var(--text)' }}>Fix navigation first.</strong> 218 mentions. Cannot find hour tracking. Features in unexpected locations. Every product home screen must answer: what do I do right now?</div>
          <div><strong style={{ color: 'var(--text)' }}>Mobile is not optional.</strong> 167 mentions from clinical students. Check-in must be one tap. If it takes more than 2 steps it will be abandoned. Mobile-first is the mandate for Skills and LC.</div>
          <div><strong style={{ color: 'var(--text)' }}>Nursing-first design has highest NPS leverage.</strong> 47% of total volume. Fix Nursing pains (compliance false positives, mobile time entry, preceptor form length) and overall NPS moves most.</div>
        </div>
      </div>

      <div className="text-[11px] mono text-center pb-4" style={{ color: 'var(--text3)' }}>
        rr-insights · NPS Intelligence 2025 · 1,494 responses · Exxat Prism + One Sites + Approve · Mar 28, 2026
      </div>
    </div>
  );
}
