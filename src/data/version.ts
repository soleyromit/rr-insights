// Auto-updated by Claude — 2026-07-29 (v18.0)
export const VERSION = '18.0.0';
export const LAST_UPDATED = '2026-07-29';
export const LAST_PUSH = 'v18.0: full Astryx rebuild (facebook/astryx, stock neutral theme, React 19). New IA: 26 flat routes -> 16 nav items + canonical entity routes (/insights/:id, /signals/:id, /personas/:id, /participants/:id — new Dovetail-style participants pages), HashRouter with legacy #dd= link shim, AppShell + real Cmd-K command palette over the whole corpus. Link contract in lib/links.ts: every entity name links to the entity, every aggregate number links to its query; dead-end rule enforced (only /changelog is a leaf). All charts on @astryxdesign/charts@canary (exact-pinned) via the chart kit; radar/pie forms replaced with ranked meters and stacked bars; validated categorical palette (max 5 series). ExamManagementView decomposed 1803 -> 75-line shell + 5 sections on a shared spec kit. Removed: Recharts, Observable Plot, d3 dep, Tailwind, Google Fonts, the entire warm-paper token system, old Sidebar/Topbar/Figure/Masthead/EvidencePanel/InsightDocument. tsc --noEmit: 0 errors repo-wide (all @ts-nocheck gone).';
export const PUSH_METHOD = 'Direct git push via PAT — zero manual steps';
export const SKILL_VERSION = '5.0.0';
export const SESSIONS_SYNCED = 76;
export const INSIGHTS_TOTAL = 420; // = ALL_INSIGHTS.length; keep in step when adding insights
export const PRODUCTS_COVERED = 5;
export const MAGIC_PATTERNS_PCE = 'https://project-truthful-apricot-326.magicpatterns.app';
export const MAGIC_PATTERNS_EXAM_ADMIN = 'https://project-rich-macaroni-332.magicpatterns.app';
export const MAGIC_PATTERNS_UNIVERSITY = 'https://project-precious-cranberry-828.magicpatterns.app';
export const EXXATLY_DS_URL = 'https://www.magicpatterns.com/design-system/ds-712de3ba-b73d-407d-9d94-a149d8f9d481';
export const VIEWS_COUNT = 27;
export const SESSIONS_RAW_READ = 76;
export const DS_TOKENS_CONFIRMED = 263;
export const DS_COMPONENTS_BUILT = 31;
export const DS_COMPONENTS_PHASE2 = 11;
