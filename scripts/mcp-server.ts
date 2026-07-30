// scripts/mcp-server.ts — the corpus as an MCP server (v19.4).
// Ask-the-repository for any MCP client (Claude Code, Cursor, Claude Desktop):
// grounded answers with insight-id citations, powered by the same selectors the
// site renders from — no second source of truth.
// Run: npx tsx scripts/mcp-server.ts   (registered in .mcp.json)
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { ALL_INSIGHTS } from '../src/data/insights';
import { THEMES, getTheme } from '../src/data/themes';
import { SIGNAL_DEFS } from '../src/data/signals';
import { PRODUCTS } from '../src/data/products';
import { PERSONAS } from '../src/data/personas';
import { SCORE_TIERS } from '../src/data/taxonomy';
import { CONFLICTS } from '../src/data/conflicts';
import { RECOMMENDATIONS } from '../src/data/recommendations';
import { insightsWhere, allSignals, signalsOf, evidenceClass, corpusFacts, productFacts } from '../src/lib/selectors';
import { scoreInsight } from '../src/lib/score';

const server = new McpServer({ name: 'rr-insights', version: '19.4.0' });

const compact = (i: (typeof ALL_INSIGHTS)[number]) => {
  const s = scoreInsight(i);
  return {
    id: i.id,
    text: i.text,
    tier: s.tier,
    score: s.label,
    severity: i.severity ?? 'na',
    evidenceClass: evidenceClass(i),
    theme: i.themeId,
    products: i.productIds,
    personas: i.personaIds ?? [],
    date: i.createdAt,
    source: i.source,
  };
};

const json = (data: unknown) => ({ content: [{ type: 'text' as const, text: JSON.stringify(data, null, 1) }] });

server.tool(
  'search_insights',
  'Search the 420-insight corpus. All filters compose (AND). Returns compact rows sorted by opportunity score; cite results by insight id.',
  {
    q: z.string().optional().describe('full-text over insight text, quotes, soWhat, source'),
    theme: z.enum(THEMES.map((t) => t.id) as [string, ...string[]]).optional(),
    product: z.enum(PRODUCTS.map((p) => p.id) as [string, ...string[]]).optional(),
    persona: z.enum(PERSONAS.map((p) => p.id) as [string, ...string[]]).optional(),
    severity: z.enum(['critical', 'high', 'medium', 'low']).optional(),
    signal: z.enum(SIGNAL_DEFS.map((s) => s.id) as [string, ...string[]]).optional(),
    tier: z.enum(['P0', 'P1', 'P2', 'P3']).optional(),
    since: z.string().optional().describe('ISO day lower bound on createdAt'),
    until: z.string().optional().describe('ISO day upper bound on createdAt'),
    limit: z.number().int().min(1).max(100).default(20),
  },
  async ({ tier, limit, ...filter }) => {
    let rows = insightsWhere(filter);
    if (tier) rows = rows.filter((i) => scoreInsight(i).tier === tier);
    return json({ total: rows.length, returned: Math.min(limit, rows.length), insights: rows.slice(0, limit).map(compact) });
  }
);

server.tool(
  'get_insight',
  'Full record for one insight id: text, verbatim evidence, score breakdown, theme, signal memberships.',
  { id: z.string() },
  async ({ id }) => {
    const i = ALL_INSIGHTS.find((x) => x.id === id);
    if (!i) return json({ error: `no insight with id ${id}` });
    return json({
      ...i,
      score: scoreInsight(i),
      evidenceClass: evidenceClass(i),
      theme: getTheme(i.themeId)?.title,
      signals: signalsOf(i.id).map((s) => s.def.title),
    });
  }
);

server.tool(
  'corpus_overview',
  'Corpus-wide stats: totals, counts by theme / tier / product / severity, freshness per product.',
  {},
  async () => {
    const byTheme: Record<string, number> = {};
    const byTier: Record<string, number> = {};
    const bySeverity: Record<string, number> = {};
    for (const i of ALL_INSIGHTS) {
      byTheme[i.themeId] = (byTheme[i.themeId] ?? 0) + 1;
      byTier[scoreInsight(i).tier] = (byTier[scoreInsight(i).tier] ?? 0) + 1;
      const sev = i.severity ?? 'na';
      bySeverity[sev] = (bySeverity[sev] ?? 0) + 1;
    }
    const facts = corpusFacts();
    return json({
      totalInsights: ALL_INSIGHTS.length,
      newest: facts.newestDate,
      last30d: facts.last30d,
      byTheme,
      byTier,
      bySeverity,
      products: PRODUCTS.map((p) => {
        const f = productFacts(p.id);
        return { id: p.id, name: p.name, insights: f.n, critical: f.critical, staleDays: f.staleDays };
      }),
      tiers: SCORE_TIERS,
    });
  }
);

server.tool('list_themes', 'The 12 themes with descriptions and member counts.', {}, async () => {
  const counts: Record<string, number> = {};
  for (const i of ALL_INSIGHTS) counts[i.themeId] = (counts[i.themeId] ?? 0) + 1;
  return json(THEMES.map((t) => ({ ...t, insightCount: counts[t.id] ?? 0 })));
});

server.tool('list_signals', 'The 7 strategic signals: question, design response, member counts by product.', {}, async () =>
  json(
    allSignals().map((s) => ({
      id: s.def.id,
      title: s.def.title,
      question: s.def.question,
      designResponse: s.def.designResponse,
      insightCount: s.insights.length,
      byProduct: s.byProduct,
    }))
  )
);

server.tool(
  'list_recommendations',
  'The decision layer: recommendations with status pipeline and evidence chains (insight ids).',
  { status: z.enum(['proposed', 'aligned', 'approved', 'shipped', 'rejected']).optional() },
  async ({ status }) => json(status ? RECOMMENDATIONS.filter((r) => r.status === status) : RECOMMENDATIONS)
);

server.tool('open_conflicts', 'Contested facts: competing claims, what each blocks, resolution owner.', {}, async () =>
  json(CONFLICTS)
);

await server.connect(new StdioServerTransport());
