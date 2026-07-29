// data/briefings.ts — audience briefings computed live from the evidence base (P7, v17.0).
// No static prose: every sentence below is assembled from data fields at load time, so a data
// change can never silently invalidate a briefing. Registers per audience are preserved:
// Arun evidence-grounded, Kunal business-outcome, Aarti decision-only.
import type { Insight } from '../types';
import { PRODUCTS } from './products';
import { ALL_INSIGHTS as RAW_INSIGHTS } from './insights';
import { insightsWhere } from '../lib/selectors';
const ALL_INSIGHTS = RAW_INSIGHTS as Insight[];
import { MILESTONES } from './personas';
import { computeAllSignals } from './signals';
import { COHERE_LAUNCH } from './taxonomy';
import { scoreInsight, sumScores } from '../lib/score';

const today = new Date();
const parseMs = (s: string) => new Date(s);

// ---- Shared computed facts ----
const rankedSignals = computeAllSignals()
  .map(s => ({ s, score: sumScores(s.insights) }))
  .sort((a, b) => b.score - a.score);

const productStats = PRODUCTS.map(p => {
  const ins = insightsWhere({ product: p.id });
  return { p, total: ins.length, critical: ins.filter(i => i.severity === 'critical').length };
}).sort((a, b) => b.critical - a.critical);

const criticals = ALL_INSIGHTS.filter(i => i.severity === 'critical');
const quotedCriticals = criticals.filter(i => i.pullQuote);
const fires = PRODUCTS.filter(p => p.urgencyLevel === 'fire');

const upcomingHard = MILESTONES
  .filter(m => m.isHardDeadline && parseMs(m.date) >= today)
  .sort((a, b) => parseMs(a.date).getTime() - parseMs(b.date).getTime());

const designNext = criticals
  .filter(i => i.soWhat)
  .map(i => ({ i, score: scoreInsight(i) }))
  .sort((a, b) => b.score.total - a.score.total);

const faas = PRODUCTS.find(p => p.id === 'faas');
const topSignals = rankedSignals.slice(0, 3);
const aiSignal = rankedSignals.find(r => r.s.def.id === 'ai-layer');

const list = (items: string[]) => items.join(' ');
const n = (v: number | undefined) => (v ?? 0).toLocaleString('en-US');

// ---- Decks ----
export const DECKS = [
  {
    audience: 'Arun Gautam',
    role: 'Direct manager',
    color: '#8b7ff5',
    problem: list([
      `The evidence base holds ${ALL_INSIGHTS.length} insights across ${PRODUCTS.length} products, of which ${criticals.length} are graded critical under the severity rubric.`,
      `${productStats[0].p.name} carries the largest critical load (${productStats[0].critical} of ${productStats[0].total} insights), followed by ${productStats[1].p.name} (${productStats[1].critical}).`,
      `${quotedCriticals.length} of ${criticals.length} criticals carry a direct quote; the rest are synthesis or hypothesis grade, which is the current evidence debt.`,
    ]),
    findings: list([
      `Ranked by opportunity score (severity times evidence class times persona priority), the top signals are: ${topSignals.map((r, idx) => `(${idx + 1}) ${r.s.def.title}, score ${Math.round(r.score)} across ${r.s.insights.length} insights`).join('; ')}.`,
      `The single highest-scored critical finding reads: "${designNext[0]?.i.soWhat ?? 'none graded'}" (${designNext[0]?.score.label ?? ''}).`,
      `${COHERE_LAUNCH.note}`,
    ]),
    recommendation: list([
      `The three highest-scored critical findings with a named design response, in order:`,
      ...designNext.slice(0, 3).map(({ i, score }, idx) => `(${idx + 1}) ${i.soWhat} [${i.productIds.join(', ')} · ${score.label}]`),
    ]),
  },
  {
    audience: 'Kunal',
    role: 'COO',
    color: '#2ec4a0',
    problem: list([
      faas ? `${faas.name} runs at ${n(faas.ticketsPerYear)} support tickets annually with an NPS of ${faas.nps}/5, a retention risk at renewal.` : '',
      fires.length ? `${fires.map(p => p.shortName).join(' and ')} ${fires.length === 1 ? 'is' : 'are'} on fire watch by deadline pressure.` : '',
      `${criticals.length} critical findings are open across the portfolio; ${productStats[0].p.shortName} alone holds ${productStats[0].critical}.`,
    ].filter(Boolean)),
    findings: list([
      aiSignal ? `The AI opportunity layer carries ${aiSignal.s.insights.length} confirmed insights (opportunity score ${Math.round(aiSignal.score)}), the broadest cross-product leverage in the base.` : '',
      `The next hard deadlines are: ${upcomingHard.slice(0, 3).map(m => `${m.label} (${m.date})`).join('; ')}.`,
    ].filter(Boolean)),
    recommendation: list([
      `Resource the top-scored signal first: ${topSignals[0].s.def.title}. ${topSignals[0].s.def.designResponse}`,
      `Cohere readiness renders as ${COHERE_LAUNCH.rendered} (${COHERE_LAUNCH.status}; confirmation owner ${COHERE_LAUNCH.owner}).`,
    ]),
  },
  {
    audience: 'Aarti',
    role: 'CEO',
    color: '#e87ab5',
    problem: fires.length
      ? `${fires.map(p => p.name).join(' and ')} carry the largest deadline-pressure risk this quarter (${fires.map(p => `${p.daysToDeadline ?? '?'} days to ${p.launchDate ?? p.pilotDate ?? 'launch'}`).join('; ')}).`
      : `No product is on fire watch today; the portfolio risk is concentrated in ${productStats[0].p.name} (${productStats[0].critical} criticals).`,
    findings: `${topSignals[0].s.def.title} is the top platform signal at score ${Math.round(topSignals[0].score)}. ${topSignals[0].s.def.question}`,
    recommendation: list([
      `Decisions needed:`,
      ...upcomingHard.slice(0, 2).map((m, idx) => `(${idx + 1}) Confirm resourcing for ${m.label} (${m.date}): ${m.description}`),
    ]),
  },
];

// ---- Risk register — top-scored signals plus hard deadlines, typed by top severity ----
export const SIGNAL_RISKS = [
  ...topSignals.map(({ s, score }) => ({
    signal: `${s.def.title}: ${s.insights.length} insights, ${s.bySeverity.critical ?? 0} critical (score ${Math.round(score)})`,
    type: s.topSeverity === 'critical' ? 'Risk' : 'Priority',
    color: s.topSeverity === 'critical' ? '#e8604a' : '#f5a623',
  })),
  ...upcomingHard.slice(0, 2).map(m => ({
    signal: `${m.label} (${m.date}): ${m.description}`,
    type: 'Priority',
    color: '#f5a623',
  })),
  ...(aiSignal ? [{
    signal: `AI opportunity layer: ${aiSignal.s.insights.length} confirmed insights across ${Object.keys(aiSignal.s.byProduct).length} products`,
    type: 'Opportunity',
    color: '#2ec4a0',
  }] : []),
];
