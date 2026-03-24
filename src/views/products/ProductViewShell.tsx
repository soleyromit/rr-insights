import React, { useState } from 'react';
import { getInsightsByProduct } from '../../data/insights';
import { getProduct } from '../../data/products';
import { getVoicesByProduct } from '../../data/voices';
import {
  FlameIcon, AlertTriangleIcon, CheckCircleIcon, ArrowRightIcon,
  LightbulbIcon, ClockIcon, CodeIcon, PaletteIcon, LayoutIcon,
  PackageIcon, ZapIcon, GitBranchIcon, UsersIcon, BarChart2Icon, CheckSquareIcon
} from 'lucide-react';
import type { ProductId } from '../../types';

const SEV_COLORS: Record<string, string> = {
  critical: '#dc2626', high: '#b45309', medium: '#2563eb', low: '#0d9488',
};

const SENTIMENT_LABEL: Record<string, string> = {
  frustrated: 'Frustrated', hopeful: 'Hopeful', positive: 'Positive',
  neutral: 'Neutral', overwhelmed: 'Overwhelmed',
};

const SENTIMENT_COLOR: Record<string, { bg: string; color: string }> = {
  frustrated: { bg: '#fef2f2', color: '#b91c1c' },
  hopeful:    { bg: '#f0fdf4', color: '#15803d' },
  positive:   { bg: '#f0fdf4', color: '#15803d' },
  neutral:    { bg: '#f8fafc', color: '#475569' },
  overwhelmed:{ bg: '#fef3c7', color: '#92400e' },
};

const GAP_DISCIPLINES = [
  { key: 'dev',     label: 'Dev',     icon: CodeIcon,    color: '#2563eb' },
  { key: 'ux',      label: 'UX',      icon: UsersIcon,   color: '#6d5ed4' },
  { key: 'ui',      label: 'UI',      icon: PaletteIcon, color: '#db2777' },
  { key: 'product', label: 'Product', icon: PackageIcon, color: '#b45309' },
];

const PRIORITY_COLORS: Record<string, { bg: string; color: string }> = {
  critical: { bg: '#fef2f2', color: '#b91c1c' },
  high:     { bg: '#fffbeb', color: '#92400e' },
  medium:   { bg: '#eff6ff', color: '#1d4ed8' },
  low:      { bg: '#f0fdf4', color: '#15803d' },
};

type Tab = 'insights' | 'voices' | 'dayinlife' | 'gaps' | 'features' | 'pipeline' | 'dependencies' | 'roadmap';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'insights',     label: 'Insights',            icon: BarChart2Icon },
  { id: 'voices',       label: 'Voices',              icon: UsersIcon },
  { id: 'dayinlife',    label: 'Day in the life',      icon: ClockIcon },
  { id: 'gaps',         label: 'Gaps by discipline',   icon: AlertTriangleIcon },
  { id: 'features',     label: 'Feature framework',    icon: ZapIcon },
  { id: 'pipeline',     label: 'AM / PM pipeline',     icon: LayoutIcon },
  { id: 'dependencies', label: 'Dependencies',         icon: GitBranchIcon },
  { id: 'roadmap',      label: 'Roadmap',              icon: CheckSquareIcon },
];

const DEP_META: Record<string, { name: string; color: string }> = {
  'exam-management':  { name: 'Exam Management', color: '#6d5ed4' },
  'faas':             { name: 'FaaS 2.0',         color: '#dc2626' },
  'course-eval':      { name: 'Course Eval',       color: '#0d9488' },
  'skills-checklist': { name: 'Skills Checklist',  color: '#b45309' },
  'learning-contracts':{ name: 'Learning Contracts', color: '#db2777' },
};

interface Props { productId: ProductId; }

export function ProductViewShell({ productId }: Props) {
  const [tab, setTab] = useState<Tab>('insights');
  const [expanded, setExpanded] = useState<string | null>(null);
  const product = getProduct(productId);
  const insights = getInsightsByProduct(productId);
  const voices = getVoicesByProduct(productId);

  if (!product) return null;

  const critical = insights.filter(i => i.severity === 'critical');
  const high     = insights.filter(i => i.severity === 'high');
  const aiOps    = insights.filter(i => i.tags.includes('ai'));
  const urgIcon  = product.urgencyLevel === 'fire' ? FlameIcon : product.urgencyLevel === 'warn' ? AlertTriangleIcon : CheckCircleIcon;
  const urgClass = product.urgencyLevel === 'fire' ? 'urgency-fire' : product.urgencyLevel === 'warn' ? 'urgency-warn' : 'urgency-ok';

  return (
    <div className="flex flex-col flex-1 overflow-hidden" style={{ background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <div className="mx-5 mt-5 p-5 rounded-xl" style={{ background: '#fff', border: '1px solid var(--border)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="serif text-[22px] font-medium" style={{ color: 'var(--text)', letterSpacing: '-0.01em' }}>
                {product.name}
              </h1>
              <span className={`urgency-chip ${urgClass}`}>
                {React.createElement(urgIcon, { size: 10 })}
                {product.urgencyLevel === 'fire' ? 'On fire' : product.urgencyLevel === 'warn' ? 'Watch' : 'Scoped'}
              </span>
            </div>
            <p className="text-[13px] mb-3" style={{ color: 'var(--text2)', maxWidth: 560 }}>{product.description}</p>
            <blockquote className="pull-quote mb-1">"{product.keyQuote}"</blockquote>
            <p className="text-[11px] mb-3" style={{ color: 'var(--text3)' }}>{product.keyQuoteSource}</p>
            <div className="flex items-center gap-4 flex-wrap">
              {product.nps !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]" style={{ color: 'var(--text3)' }}>NPS</span>
                  <span className="text-[18px] font-semibold mono" style={{ color: '#dc2626' }}>{product.nps}/5</span>
                </div>
              )}
              {product.ticketsPerYear && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px]" style={{ color: 'var(--text3)' }}>Tickets/yr</span>
                  <span className="text-[15px] font-semibold mono" style={{ color: '#b45309' }}>{product.ticketsPerYear.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]" style={{ color: 'var(--text3)' }}>Sessions</span>
                <span className="text-[15px] font-semibold mono" style={{ color: product.accentColor }}>{product.granolaSessions}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]" style={{ color: 'var(--text3)' }}>Voices</span>
                <span className="text-[15px] font-semibold mono" style={{ color: product.accentColor }}>{voices.length}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[28px] font-semibold" style={{ color: product.accentColor, letterSpacing: '-0.02em' }}>
              {product.priorityScore}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--text3)' }}>priority score</div>
            {product.daysToDeadline && (
              <div className="mt-2 flex items-center gap-1 justify-end">
                <ClockIcon size={10} style={{ color: '#dc2626' }} />
                <span className="text-[12px] font-medium" style={{ color: '#dc2626' }}>{product.daysToDeadline}d to deadline</span>
              </div>
            )}
            <div className="mt-3">
              <div className="text-[10px] mb-1" style={{ color: 'var(--text3)' }}>user sentiment</div>
              <div className="flex items-center gap-2 justify-end">
                <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                  <div className="h-full rounded-full" style={{
                    width: `${product.sentimentScore}%`,
                    background: product.sentimentScore >= 60 ? '#16a34a' : product.sentimentScore >= 45 ? '#b45309' : '#dc2626'
                  }} />
                </div>
                <span className="text-[11px] mono font-semibold" style={{
                  color: product.sentimentScore >= 60 ? '#16a34a' : product.sentimentScore >= 45 ? '#b45309' : '#dc2626'
                }}>{product.sentimentScore}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="mx-5 mt-4 flex overflow-x-auto border-b" style={{ borderColor: 'var(--border)' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 text-[12.5px] whitespace-nowrap flex-shrink-0 transition-colors"
            style={{
              color: tab === t.id ? product.accentColor : 'var(--text3)',
              borderBottom: `2px solid ${tab === t.id ? product.accentColor : 'transparent'}`,
              fontWeight: tab === t.id ? 500 : 400,
              background: 'transparent',
              cursor: 'pointer',
            }}>
            {React.createElement(t.icon, { size: 12 })}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* INSIGHTS */}
        {tab === 'insights' && (
          <div>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {[
                { label: 'Critical', value: critical.length, color: '#dc2626' },
                { label: 'High',     value: high.length,     color: '#b45309' },
                { label: 'AI ops',   value: aiOps.length,    color: '#7c3aed' },
                { label: 'Gaps',     value: product.criticalGaps, color: '#dc2626' },
              ].map(({ label, value, color }) => (
                <div key={label} className="stat-card text-center">
                  <div className="text-[24px] font-semibold" style={{ color, letterSpacing: '-0.02em' }}>{value}</div>
                  <div className="text-[11px]" style={{ color: 'var(--text3)' }}>{label}</div>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {insights.length === 0 ? (
                <div className="py-12 text-center rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                  <p className="text-[13px]" style={{ color: 'var(--text3)' }}>No insights yet. Share a Granola session to populate.</p>
                </div>
              ) : insights
                .slice()
                .sort((a, b) => ({ critical: 0, high: 1, medium: 2, low: 3 }[a.severity ?? 'low'] ?? 3) - ({ critical: 0, high: 1, medium: 2, low: 3 }[b.severity ?? 'low'] ?? 3))
                .map(ins => (
                  <div key={ins.id} className="insight-card" onClick={() => setExpanded(expanded === ins.id ? null : ins.id)} style={{ cursor: 'pointer' }}>
                    <div className="flex items-start gap-3">
                      <div className="severity-dot mt-1.5 flex-shrink-0" style={{ background: SEV_COLORS[ins.severity ?? 'medium'] }} />
                      <div className="flex-1 min-w-0">
                        {ins.pullQuote && (
                          <blockquote className="pull-quote mb-2">"{ins.pullQuote}"
                            {ins.pullQuoteSource && <span className="block text-[10px] mt-0.5 not-italic" style={{ color: 'var(--text3)' }}>{ins.pullQuoteSource}</span>}
                          </blockquote>
                        )}
                        <p className="text-[13.5px]" style={{ color: 'var(--text)', lineHeight: 1.55 }}>{ins.text}</p>
                        {expanded === ins.id && ins.soWhat && (
                          <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ background: 'var(--accent-bg)', border: '1px solid rgba(109,94,212,0.15)' }}>
                            <LightbulbIcon size={13} style={{ color: '#6d5ed4', flexShrink: 0, marginTop: 1 }} />
                            <div>
                              <div className="text-[10px] font-semibold mb-0.5" style={{ color: '#5449b3', textTransform: 'uppercase', letterSpacing: '.06em' }}>So what</div>
                              <p className="text-[12.5px]" style={{ color: '#5449b3' }}>{ins.soWhat}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px]" style={{ color: 'var(--text3)' }}>{ins.source}</span>
                          {ins.confidence && <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--bg3)', color: 'var(--text3)' }}>{ins.confidence}</span>}
                          <div className="flex gap-1 flex-wrap">
                            {ins.tags.slice(0, 3).map(tag => {
                              const tc: Record<string, { bg: string; color: string }> = {
                                gap:          { bg: '#fef2f2', color: '#b91c1c' },
                                opportunity:  { bg: '#f0fdf4', color: '#15803d' },
                                theme:        { bg: '#eff6ff', color: '#1d4ed8' },
                                platform:     { bg: '#f5f3ff', color: '#6d28d9' },
                                ai:           { bg: '#fdf4ff', color: '#7e22ce' },
                                architecture: { bg: '#fffbeb', color: '#92400e' },
                                new:          { bg: '#ecfdf5', color: '#065f46' },
                              };
                              return (
                                <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                                  style={{ background: tc[tag]?.bg ?? 'var(--bg3)', color: tc[tag]?.color ?? 'var(--text3)' }}>
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-1 rounded-full font-medium flex-shrink-0"
                        style={{ background: `${SEV_COLORS[ins.severity ?? 'medium']}12`, color: SEV_COLORS[ins.severity ?? 'medium'] }}>
                        {ins.severity}
                      </span>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* VOICES */}
        {tab === 'voices' && (
          <div>
            <p className="eyebrow mb-1">Real people from Granola sessions</p>
            <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Who we spoke to about {product.shortName}</h2>
            {voices.length === 0 ? (
              <div className="py-12 text-center rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                <p className="text-[13px]" style={{ color: 'var(--text3)' }}>No named voices mapped to this product yet.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {voices.map(voice => {
                  const sc = SENTIMENT_COLOR[voice.sentiment] ?? { bg: 'var(--bg2)', color: 'var(--text2)' };
                  const initials = voice.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  const avatarBg = voice.personaRole === 'student' ? '#6d5ed4' : voice.personaRole === 'dce' ? '#0d9488' : voice.personaRole === 'scce' ? '#b45309' : voice.personaRole === 'program-director' ? '#dc2626' : '#2563eb';
                  return (
                    <div key={voice.id} className="card">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0"
                            style={{ background: avatarBg }}>
                            {initials}
                          </div>
                          <div>
                            <div className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>{voice.name}</div>
                            <div className="text-[11px]" style={{ color: 'var(--text2)' }}>{voice.title} · {voice.institution}</div>
                            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>{voice.granolaMeetingLabel}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] px-2 py-1 rounded-full font-medium" style={{ background: sc.bg, color: sc.color }}>
                            {SENTIMENT_LABEL[voice.sentiment]}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg3)' }}>
                              <div className="h-full rounded-full" style={{
                                width: `${voice.sentimentScore}%`,
                                background: voice.sentimentScore >= 60 ? '#16a34a' : voice.sentimentScore >= 45 ? '#b45309' : '#dc2626'
                              }} />
                            </div>
                            <span className="text-[10px] mono" style={{ color: 'var(--text3)' }}>{voice.sentimentScore}%</span>
                          </div>
                        </div>
                      </div>
                      <blockquote className="pull-quote mb-3">"{voice.quote}"</blockquote>
                      <p className="text-[12.5px] mb-4" style={{ color: 'var(--text2)', lineHeight: 1.6 }}>{voice.context}</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Frictions', items: voice.frictions, color: '#dc2626' },
                          { label: 'Workarounds today', items: voice.workarounds, color: '#b45309' },
                          { label: 'What they want', items: voice.wishList, color: '#0d9488' },
                        ].map(({ label, items, color }) => (
                          <div key={label} className="card-flat">
                            <div className="text-[10px] font-semibold mb-2" style={{ color, textTransform: 'uppercase', letterSpacing: '.06em' }}>{label}</div>
                            <div className="space-y-1.5">
                              {items.map((item: string, i: number) => (
                                <div key={i} className="flex items-start gap-1.5">
                                  <div className="w-1 h-1 rounded-full flex-shrink-0 mt-2" style={{ background: color, opacity: 0.6 }} />
                                  <span className="text-[11.5px]" style={{ color: 'var(--text2)', lineHeight: 1.45 }}>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* DAY IN THE LIFE */}
        {tab === 'dayinlife' && (
          <div className="space-y-4">
            <div>
              <p className="eyebrow mb-1">Current state — before we build anything better</p>
              <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>What actually happens today</h2>
            </div>
            {Object.entries(product.dayInLife).map(([pid, story]) => (
              <div key={pid} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                    style={{ background: pid === 'student' ? '#6d5ed4' : pid === 'dce' ? '#0d9488' : pid === 'scce' ? '#b45309' : '#dc2626' }}>
                    {pid === 'student' ? 'ST' : pid === 'dce' ? 'DC' : pid === 'scce' ? 'SC' : 'PD'}
                  </div>
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>
                    {pid === 'student' ? 'Student' : pid === 'dce' ? 'DCE / Faculty' : pid === 'scce' ? 'SCCE' : 'Program Director'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: '#fef2f2', color: '#b91c1c' }}>Current state</span>
                </div>
                <p className="text-[13.5px]" style={{ color: 'var(--text2)', lineHeight: 1.65 }}>{story as string}</p>
              </div>
            ))}
            <div className="card" style={{ borderColor: 'rgba(13,148,136,0.3)', background: 'rgba(13,148,136,0.04)' }}>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mb-3 inline-block" style={{ background: '#f0fdf4', color: '#15803d' }}>
                Happy path — what we are building toward
              </span>
              <p className="text-[13.5px]" style={{ color: 'var(--text)', lineHeight: 1.65 }}>{product.happyPath}</p>
            </div>
          </div>
        )}

        {/* GAPS BY DISCIPLINE */}
        {tab === 'gaps' && (
          <div>
            <p className="eyebrow mb-1">Whiteboard Photo 4 — gaps and concerns by discipline</p>
            <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Dev / UX / UI / Product — separated</h2>
            <div className="grid grid-cols-2 gap-4">
              {GAP_DISCIPLINES.map(({ key, label, icon: Icon, color }) => {
                const items = product.gapsByDiscipline[key as keyof typeof product.gapsByDiscipline] ?? [];
                return (
                  <div key={key} className="card">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}>
                        {React.createElement(Icon, { size: 14, style: { color } })}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{label} gaps</div>
                        <div className="text-[10px]" style={{ color: 'var(--text3)' }}>{items.length} identified</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {items.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: 'var(--bg2)' }}>
                          <div className="w-1 h-1 rounded-full flex-shrink-0 mt-2" style={{ background: color, opacity: 0.7 }} />
                          <span className="text-[12.5px]" style={{ color: 'var(--text2)', lineHeight: 1.5 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* FEATURE FRAMEWORK */}
        {tab === 'features' && (
          <div>
            <p className="eyebrow mb-1">Whiteboard Photo 4 — new feature framework</p>
            <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>AI first. Problem. UX/UI. Design system. Micro-interactions.</h2>
            <div className="card mb-4">
              <div className="flex items-center gap-2 mb-4">
                <ZapIcon size={14} style={{ color: '#7c3aed' }} />
                <h3 className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>AI-first opportunities</h3>
              </div>
              <div className="space-y-3">
                {product.newFeatureFramework.aiOpportunities.map(opp => (
                  <div key={opp.feature} className="p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <div className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{opp.feature}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>{opp.status}</span>
                    </div>
                    <p className="text-[12px]" style={{ color: 'var(--text2)' }}>{opp.problem}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <LayoutIcon size={13} style={{ color: '#6d5ed4' }} />
                  <h3 className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>Design system components needed</h3>
                </div>
                <div className="space-y-1.5">
                  {product.newFeatureFramework.designSystemComponents.map((c: string, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full" style={{ background: '#6d5ed4', opacity: 0.6 }} />
                      <span className="text-[12.5px]" style={{ color: 'var(--text2)' }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="flex items-center gap-2 mb-3">
                  <PaletteIcon size={13} style={{ color: '#db2777' }} />
                  <h3 className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>Micro-interaction considerations</h3>
                </div>
                <div className="space-y-1.5">
                  {product.newFeatureFramework.microInteractions.map((m: string, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full flex-shrink-0 mt-2" style={{ background: '#db2777', opacity: 0.6 }} />
                      <span className="text-[12.5px]" style={{ color: 'var(--text2)', lineHeight: 1.45 }}>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="eyebrow mb-3">How might we</p>
            <div className="space-y-2">
              {product.hmwStatements.map((hmw: string, i: number) => (
                <div key={i} className="hmw-card flex items-start gap-3">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5" style={{ background: 'rgba(109,94,212,0.12)', color: '#5449b3' }}>HMW</span>
                  <p className="text-[13px]">{hmw}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AM/PM PIPELINE */}
        {tab === 'pipeline' && (
          <div>
            <p className="eyebrow mb-1">Whiteboard Photo 4 — AMs, PMs, Sales pipeline</p>
            <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Enhancement requests and pending decisions</h2>
            <div className="card mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold" style={{ color: 'var(--text)' }}>Client enhancement requests</h3>
                <span className="text-[11px]" style={{ color: 'var(--text3)' }}>sorted by priority</span>
              </div>
              <div className="space-y-2">
                {product.amPmPipeline.enhancementRequests
                  .slice()
                  .sort((a, b) => ({ critical: 0, high: 1, medium: 2, low: 3 }[a.priority] - { critical: 0, high: 1, medium: 2, low: 3 }[b.priority]))
                  .map((req, i) => {
                    const pc = PRIORITY_COLORS[req.priority];
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: 'var(--bg2)', border: '1px solid var(--border)' }}>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5" style={{ background: pc.bg, color: pc.color }}>{req.priority}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium" style={{ color: 'var(--text)' }}>{req.request}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: 'var(--text3)' }}>Requested by: {req.requestedBy}</div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: product.accentColor }} />
                          <span className="text-[11px] mono" style={{ color: 'var(--text3)' }}>{req.sessions} sessions</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="card">
              <h3 className="text-[14px] font-semibold mb-4" style={{ color: 'var(--text)' }}>Pending decisions blocking design</h3>
              <div className="space-y-2">
                {product.amPmPipeline.pendingDecisions.map((d: string, i: number) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg" style={{ background: 'rgba(180,83,9,0.06)', border: '1px solid rgba(180,83,9,0.15)' }}>
                    <AlertTriangleIcon size={12} style={{ color: '#b45309', flexShrink: 0, marginTop: 2 }} />
                    <span className="text-[12.5px]" style={{ color: 'var(--text2)' }}>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DEPENDENCIES */}
        {tab === 'dependencies' && (
          <div>
            <p className="eyebrow mb-1">Whiteboard Photo 4 — dependency to other features and products</p>
            <h2 className="text-[15px] font-semibold mb-4" style={{ color: 'var(--text)' }}>{product.shortName} cross-product connections</h2>
            <div className="card mb-5">
              <div className="flex items-center justify-center py-6 flex-col gap-6">
                <div className="px-5 py-3 rounded-xl text-white text-[13px] font-semibold" style={{ background: product.accentColor }}>
                  {product.shortName}
                </div>
                <div className="flex items-start gap-6 flex-wrap justify-center">
                  {product.productDependencies.map(dep => {
                    const dm = DEP_META[dep.product] ?? { name: dep.product, color: '#888' };
                    return (
                      <div key={dep.product} className="flex flex-col items-center gap-2">
                        <div className="w-px h-8" style={{ background: 'var(--border2)' }} />
                        <div className="px-4 py-2 rounded-lg text-[12px] font-medium border"
                          style={{ borderColor: `${dm.color}40`, color: dm.color, background: `${dm.color}08` }}>
                          {dm.name}
                        </div>
                        <p className="text-[10px] text-center max-w-[140px]" style={{ color: 'var(--text3)', lineHeight: 1.4 }}>{dep.dependency}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {product.productDependencies.map(dep => {
                const dm = DEP_META[dep.product] ?? { name: dep.product, color: '#888' };
                return (
                  <div key={dep.product} className="insight-card">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: dm.color }} />
                      <div>
                        <div className="text-[13px] font-medium mb-0.5" style={{ color: 'var(--text)' }}>{dm.name}</div>
                        <p className="text-[12.5px]" style={{ color: 'var(--text2)' }}>{dep.dependency}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ROADMAP */}
        {tab === 'roadmap' && (
          <div>
            <p className="eyebrow mb-1">Phased delivery — confirmed from Granola sessions</p>
            <h2 className="text-[15px] font-semibold mb-5" style={{ color: 'var(--text)' }}>{product.name} roadmap</h2>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(product.roadmapPhases.length, 3)}, 1fr)` }}>
              {product.roadmapPhases.map((phase, i) => (
                <div key={phase.phase} className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
                      style={{ background: product.accentColor, opacity: Math.min(0.6 + i * 0.1, 1) }}>
                      {i + 1}
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--text)' }}>{phase.phase}</span>
                  </div>
                  <div className="space-y-2">
                    {phase.items.map((item: string) => (
                      <div key={item} className="flex items-start gap-2">
                        <ArrowRightIcon size={11} style={{ color: product.accentColor, flexShrink: 0, marginTop: 3, opacity: 0.7 }} />
                        <span className="text-[12.5px]" style={{ color: 'var(--text2)' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <p className="eyebrow mb-3">Competitors</p>
              <div className="flex flex-wrap gap-2">
                {product.competitors.map((c: string) => (
                  <span key={c} className="px-3 py-1.5 rounded-xl text-[12px] font-medium"
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
