// scripts/check-build-status.ts — corpus invariants for the build-status
// cross-reference layer. Mirrors scripts/check-themes.ts's job.
// Run: npx tsx scripts/check-build-status.ts   (exit 1 on violation)
import { BUILD_STATUS } from '../src/data/buildStatus';
import { ALL_INSIGHTS } from '../src/data/insights';
import { PRODUCTS } from '../src/data/products';
import { INTERNAL_TOOLS } from '../src/data/internalTools';

let fail = 0;
const err = (m: string) => { console.error('FAIL:', m); fail = 1; };

const knownProductIds = new Set<string>([...PRODUCTS.map((p) => p.id), ...INTERNAL_TOOLS.map((t) => t.id)]);
const knownInsightIds = new Set(ALL_INSIGHTS.map((i) => i.id));

// Unique ids: BuildStatusEntry.id must be unique — UI React keys and the
// sync's re-run upsert logic both depend on this.
{
  const seen = new Set<string>();
  for (const b of BUILD_STATUS) {
    if (seen.has(b.id)) err(`duplicate build-status id: ${b.id}`);
    seen.add(b.id);
  }
}

for (const b of BUILD_STATUS) {
  if (!knownProductIds.has(b.productId)) {
    err(`${b.id}: unknown productId "${b.productId}" (not in PRODUCTS or INTERNAL_TOOLS)`);
  }

  const dead = b.relatedInsightIds.filter((id) => !knownInsightIds.has(id));
  if (dead.length) err(`${b.id}: cites missing insights: ${dead.join(', ')}`);

  if ((b.status === 'built' || b.status === 'partial') && b.evidence.length === 0) {
    err(`${b.id}: status "${b.status}" requires at least one evidence entry`);
  }

  if (b.productId === 'portal' && b.personaIds.length > 0) {
    err(`${b.id}: portal entries must have personaIds: [] (no persona taxonomy for an internal tool)`);
  }
}

if (!fail) console.log('OK:', BUILD_STATUS.length, 'build-status entries, all valid.');
process.exit(fail);
