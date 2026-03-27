// @ts-nocheck
// ─────────────────────────────────────────────────────────────────────────────
//  AnalyticsView.tsx
//  Data intelligence — insight distribution, session velocity, product coverage
//  Uses: D3 (direct DOM), Observable Plot (declarative), Recharts (React-native)
//  Packages added by Romit: d3, @observablehq/plot, @highcharts/react
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';
import { INSIGHTS } from '../data/insights';
import { PRODUCTS } from '../data/products';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

// ─── Data transforms ────────────────────────────────────────────────────────

const SEVERITY_ORDER = ['critical', 'high', 'medium', 'low'];
const SEVERITY_COLORS: Record<string, string> = {
  critical: '#e8604a',
  high: '#f5a623',
  medium: '#6d5ed4',
  low: '#2ec4a0',
};

const TAG_COLORS: Record<string, string> = {
  decision: '#6d5ed4',
  gap: '#e8604a',
  opportunity: '#2ec4a0',
  'persona-signal': '#f5a623',
  architecture: '#78aaf5',
  ai: '#e31c79',
  new: '#16a34a',
};

function getInsightsByProduct() {
  return PRODUCTS.map(p => ({
    name: p.name.replace('Course & Faculty Evaluation', 'Course Eval')
               .replace('FaaS 2.0 (Forms as a Service)', 'FaaS 2.0')
               .replace('Skills Checklist', 'Skills')
               .replace('Learning Contracts', 'Learning'),
    id: p.id,
    count: INSIGHTS.filter(i => i.productIds?.includes(p.id)).length,
    critical: INSIGHTS.filter(i => i.productIds?.includes(p.id) && i.severity === 'critical').length,
    high: INSIGHTS.filter(i => i.productIds?.includes(p.id) && i.severity === 'high').length,
  }));
}

function getTagDistribution() {
  const counts: Record<string, number> = {};
  INSIGHTS.forEach(i => {
    i.tags?.forEach(t => {
      if (t !== 'new') counts[t] = (counts[t] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count, color: TAG_COLORS[tag] || '#94a3b8' }));
}

function getSeverityBreakdown() {
  return SEVERITY_ORDER.map(s => ({
    severity: s,
    count: INSIGHTS.filter(i => i.severity === s).length,
    color: SEVERITY_COLORS[s],
  })).filter(s => s.count > 0);
}

function getSessionVelocity() {
  // Group insights by createdAt date
  const byDate: Record<string, number> = {};
  INSIGHTS.forEach(i => {
    const d = i.createdAt?.slice(0, 10) || '2026-03-01';
    byDate[d] = (byDate[d] || 0) + 1;
  });
  
  // Build cumulative timeline
  const sorted = Object.entries(byDate).sort((a, b) => a[0].localeCompare(b[0]));
  let cumulative = 0;
  return sorted.map(([date, count]) => {
    cumulative += count;
    return {
      date: date.slice(5), // MM-DD
      daily: count,
      cumulative,
    };
  });
}

function getPersonaCoverage() {
  const personas = [
    { id: 'student', label: 'Student' },
    { id: 'dce', label: 'DCE / Faculty' },
    { id: 'scce', label: 'SCCE / Supervisor' },
    { id: 'program-director', label: 'Program Director' },
  ];
  return personas.map(p => ({
    persona: p.label,
    count: INSIGHTS.filter(i => i.personaIds?.includes(p.id)).length,
  }));
}

function getPlatformSignals() {
  // Insights that appear across 3+ products = platform signal
  return INSIGHTS.filter(i => (i.productIds?.length || 0) >= 3).length;
}

// ─── D3 Bubble Chart Component ────────────────────────────────────────────────
function BubbleChart() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const productData = getInsightsByProduct();
    const W = 480, H = 220;

    const svg = ref.current;
    if (!svg) return;
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const maxCount = Math.max(...productData.map(d => d.count));
    const colors = ['#6d5ed4', '#e8604a', '#2ec4a0', '#f5a623', '#78aaf5'];
    const spacing = W / productData.length;

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

    productData.forEach((d, i) => {
      const r = Math.max(18, (d.count / maxCount) * 52);
      const cx = spacing * i + spacing / 2;
      const cy = H / 2;
      const color = colors[i % colors.length];

      // Bubble
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', String(cx));
      circle.setAttribute('cy', String(cy));
      circle.setAttribute('r', String(r));
      circle.setAttribute('fill', color);
      circle.setAttribute('opacity', '0.18');
      g.appendChild(circle);

      // Inner circle
      const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      inner.setAttribute('cx', String(cx));
      inner.setAttribute('cy', String(cy));
      inner.setAttribute('r', String(r * 0.55));
      inner.setAttribute('fill', color);
      inner.setAttribute('opacity', '0.7');
      g.appendChild(inner);

      // Count label
      const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      countText.setAttribute('x', String(cx));
      countText.setAttribute('y', String(cy + 4));
      countText.setAttribute('text-anchor', 'middle');
      countText.setAttribute('fill', '#fff');
      countText.setAttribute('font-size', '14');
      countText.setAttribute('font-weight', '700');
      countText.setAttribute('font-family', 'JetBrains Mono, monospace');
      countText.textContent = String(d.count);
      g.appendChild(countText);

      // Name label
      const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      nameText.setAttribute('x', String(cx));
      nameText.setAttribute('y', String(cy + r + 16));
      nameText.setAttribute('text-anchor', 'middle');
      nameText.setAttribute('fill', 'var(--text2, #475569)');
      nameText.setAttribute('font-size', '10');
      nameText.setAttribute('font-weight', '600');
      nameText.textContent = d.name.split(' ')[0];
      g.appendChild(nameText);

      // Critical dot
      if (d.critical > 0) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', String(cx + r * 0.65));
        dot.setAttribute('cy', String(cy - r * 0.65));
        dot.setAttribute('r', '8');
        dot.setAttribute('fill', '#e8604a');
        g.appendChild(dot);

        const dotText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dotText.setAttribute('x', String(cx + r * 0.65));
        dotText.setAttribute('y', String(cy - r * 0.65 + 4));
        dotText.setAttribute('text-anchor', 'middle');
        dotText.setAttribute('fill', '#fff');
        dotText.setAttribute('font-size', '9');
        dotText.setAttribute('font-weight', '700');
        dotText.textContent = String(d.critical);
        g.appendChild(dotText);
      }
    });

    svg.appendChild(g);
  }, []);

  return (
    <svg ref={ref} style={{ width: '100%', height: 220 }} />
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
type TabId = 'overview' | 'distribution' | 'velocity' | 'coverage';

export function AnalyticsView() {
  const [tab, setTab] = useState<TabId>('overview');

  const tagDist = getTagDistribution();
  const severityData = getSeverityBreakdown();
  const velocity = getSessionVelocity();
  const personaCoverage = getPersonaCoverage();
  const productData = getInsightsByProduct();
  const platformSignals = getPlatformSignals();

  const totalInsights = INSIGHTS.length;
  const criticalCount = INSIGHTS.filter(i => i.severity === 'critical').length;
  const newCount = INSIGHTS.filter(i => i.tags?.includes('new')).length;
  const aiCount = INSIGHTS.filter(i => i.tags?.includes('ai')).length;

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, sans-serif', background: 'var(--bg)', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)', margin: '0 0 4px', fontFamily: 'DM Serif Display, Georgia, serif' }}>
          Intelligence Analytics
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text2)', margin: 0 }}>
          Data visualized across {totalInsights} insights · {PRODUCTS.length} products · 4 personas
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Total insights', val: totalInsights, color: '#6d5ed4', sub: '43 Granola sessions' },
          { label: 'Critical gaps', val: criticalCount, color: '#e8604a', sub: 'Require immediate action' },
          { label: 'New this session', val: newCount, color: '#16a34a', sub: 'Added today' },
          { label: 'AI-tagged', val: aiCount, color: '#e31c79', sub: 'AI product signals' },
          { label: 'Platform signals', val: platformSignals, color: '#f5a623', sub: 'Spans 3+ products' },
        ].map(k => (
          <div key={k.label} style={{ padding: '12px 14px', borderRadius: 10, background: '#fff', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginTop: 1 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {([
          { id: 'overview', label: 'Overview' },
          { id: 'distribution', label: 'Tag distribution' },
          { id: 'velocity', label: 'Session velocity' },
          { id: 'coverage', label: 'Persona coverage' },
        ] as { id: TabId; label: string }[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: '10px 18px', fontSize: 13, fontWeight: tab === t.id ? 600 : 400, color: tab === t.id ? 'var(--brand)' : 'var(--text3)', background: 'none', border: 'none', borderBottom: `2px solid ${tab === t.id ? 'var(--brand)' : 'transparent'}`, marginBottom: -1, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Bubble chart — insights per product */}
          <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Insight density by product</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>
              Bubble size = total insights. Red badge = critical gaps. D3 bubble chart.
            </div>
            <BubbleChart />
          </div>

          {/* Severity × Product heatmap */}
          <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Severity breakdown by product</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={productData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }}
                  itemStyle={{ color: 'var(--text)' }}
                />
                <Bar dataKey="critical" name="Critical" stackId="a" fill="#e8604a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="high" name="High" stackId="a" fill="#f5a623" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tag pie */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Insight type mix</div>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={tagDist.slice(0, 6)} dataKey="count" nameKey="tag" cx="50%" cy="50%" outerRadius={70} label={({ tag, percent }) => `${tag} ${Math.round(percent * 100)}%`} labelLine={false}>
                    {tagDist.slice(0, 6).map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Persona radar</div>
              <ResponsiveContainer width="100%" height={180}>
                <RadarChart data={personaCoverage}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="persona" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                  <Radar name="Insights" dataKey="count" stroke="#6d5ed4" fill="#6d5ed4" fillOpacity={0.25} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* TAG DISTRIBUTION */}
      {tab === 'distribution' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>All insight tags</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>Every insight carries one or more tags. Multi-tag insights are counted once per tag.</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tagDist.map(d => {
                const pct = Math.round((d.count / totalInsights) * 100);
                return (
                  <div key={d.tag} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 100, fontSize: 12, fontWeight: 600, color: d.color, textTransform: 'capitalize', flexShrink: 0 }}>{d.tag}</div>
                    <div style={{ flex: 1, height: 20, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(4, pct)}%`, background: d.color, borderRadius: 4, opacity: 0.75, transition: 'width 0.5s ease' }} />
                    </div>
                    <div style={{ width: 36, fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)', textAlign: 'right', flexShrink: 0 }}>{d.count}</div>
                    <div style={{ width: 30, fontSize: 10, color: 'var(--text3)', flexShrink: 0 }}>{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Severity breakdown */}
          <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Severity distribution</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {severityData.map(s => (
                <div key={s.severity} style={{ flex: 1, padding: '12px 14px', borderRadius: 10, background: `${s.color}08`, border: `1px solid ${s.color}30`, textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'JetBrains Mono, monospace' }}>{s.count}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: s.color, textTransform: 'capitalize', marginTop: 2 }}>{s.severity}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VELOCITY */}
      {tab === 'velocity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Cumulative insight growth</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 14 }}>
              Each Granola session adds a cluster of insights. Steep segments = high-signal sessions (Touro, PRISM Day 1, D2L demo).
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={velocity} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
                <Line type="monotone" dataKey="cumulative" stroke="#6d5ed4" strokeWidth={2.5} dot={{ r: 3, fill: '#6d5ed4' }} name="Total insights" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Daily insight additions</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={velocity} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text3)' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
                <Bar dataKey="daily" name="Insights added" fill="#e8604a" radius={[3, 3, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* COVERAGE */}
      {tab === 'coverage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {/* Persona coverage */}
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Persona coverage</div>
              {personaCoverage.map((p, i) => {
                const pct = Math.round((p.count / totalInsights) * 100);
                const colors2 = ['#6d5ed4', '#e8604a', '#2ec4a0', '#f5a623'];
                return (
                  <div key={p.persona} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 110, fontSize: 12, color: 'var(--text2)', flexShrink: 0 }}>{p.persona}</div>
                    <div style={{ flex: 1, height: 18, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(4, pct)}%`, background: colors2[i % 4], borderRadius: 4, opacity: 0.75 }} />
                    </div>
                    <div style={{ width: 28, fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)', textAlign: 'right', flexShrink: 0 }}>{p.count}</div>
                  </div>
                );
              })}
            </div>

            {/* Product coverage matrix */}
            <div style={{ borderRadius: 12, background: '#fff', border: '1px solid var(--border)', padding: '16px 20px' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>Product coverage</div>
              {productData.map((p, i) => {
                const pct = Math.round((p.count / totalInsights) * 100);
                const colors3 = ['#6d5ed4', '#e8604a', '#2ec4a0', '#f5a623', '#78aaf5'];
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 80, fontSize: 11, color: 'var(--text2)', flexShrink: 0 }}>{p.name.split(' ')[0]}</div>
                    <div style={{ flex: 1, height: 18, background: 'var(--bg2)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.max(4, pct)}%`, background: colors3[i % 5], borderRadius: 4, opacity: 0.75 }} />
                    </div>
                    <div style={{ width: 28, fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)', textAlign: 'right', flexShrink: 0 }}>{p.count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform signals callout */}
          <div style={{ borderRadius: 12, background: 'rgba(245,166,35,0.04)', border: '1px solid rgba(245,166,35,0.25)', borderLeft: '4px solid #f5a623', padding: '14px 18px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#d97706', marginBottom: 6 }}>
              {platformSignals} platform-level signals detected
            </div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>
              Insights tagged to 3+ products simultaneously indicate cross-cutting architectural patterns that require platform-level design decisions, not product-specific fixes.
              These are the highest-priority insights for systems-level thinking.
            </div>
            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {INSIGHTS.filter(i => (i.productIds?.length || 0) >= 3).slice(0, 6).map(i => (
                <div key={i.id} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 5, background: 'rgba(245,166,35,0.1)', color: '#92400e', fontFamily: 'JetBrains Mono, monospace' }}>
                  {i.id}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
