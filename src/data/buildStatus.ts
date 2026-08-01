// data/buildStatus.ts — what's actually shipped in exxat-admin-workspace,
// cross-referenced against the research corpus in insights.ts (never
// mutated by this file or its consumers). Populated by the
// build-status-sync automation (.claude/skills/sync-build-status) —
// starts empty; do not hand-backfill (see design spec, "Out of scope").
import type { BuildStatusEntry } from '../types';

export const BUILD_STATUS: BuildStatusEntry[] = [];
