// scripts/check-themes.ts — corpus invariants for the theme taxonomy.
// Run: npx tsx scripts/check-themes.ts   (exit 1 on violation)
import { ALL_INSIGHTS } from '../src/data/insights';
import { THEMES, getTheme } from '../src/data/themes';
import { RECOMMENDATIONS } from '../src/data/recommendations';
import { scoreInsight } from '../src/lib/score';

let fail = 0;
const err = (m: string) => { console.error('FAIL:', m); fail = 1; };

const missing = ALL_INSIGHTS.filter(i => !i.themeId || !getTheme(i.themeId));
if (missing.length) err(`${missing.length} insights without a valid themeId: ${missing.slice(0, 10).map(i => i.id).join(', ')}${missing.length > 10 ? ', …' : ''}`);

const counts = new Map<string, number>();
for (const i of ALL_INSIGHTS) counts.set(i.themeId ?? '?', (counts.get(i.themeId ?? '?') ?? 0) + 1);
for (const t of THEMES) {
  const n = counts.get(t.id) ?? 0;
  if (n < 5) err(`theme ${t.id} has only ${n} members (<5)`);
  if (n > ALL_INSIGHTS.length * 0.4) err(`theme ${t.id} has ${n} members (>40% of corpus)`);
}

// Recommendations: every evidence link must reference a real insight.
{
  const ids = new Set(ALL_INSIGHTS.map(i => i.id));
  for (const r of RECOMMENDATIONS) {
    const dead = r.insightIds.filter(id => !ids.has(id));
    if (dead.length) err(`recommendation ${r.id} cites missing insights: ${dead.join(', ')}`);
    if (!r.insightIds.length) err(`recommendation ${r.id} has no evidence chain`);
  }
}

const tiers = new Map<string, number>();
for (const i of ALL_INSIGHTS) { const t = scoreInsight(i).tier; tiers.set(t, (tiers.get(t) ?? 0) + 1); }
console.log('theme counts:', Object.fromEntries([...counts.entries()].sort((a, b) => b[1] - a[1])));
console.log('tier counts:', Object.fromEntries(tiers));
if (!fail) console.log('OK:', ALL_INSIGHTS.length, 'insights, all themed.');
process.exit(fail);
