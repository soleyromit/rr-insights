# rr-insights — Claude Architecture Guide
> Read this file at the start of every session.

## The push problem — solved

Claude cannot push to GitHub directly. The container has no token and no persistent storage.
The fix is a one-time token setup on your local machine. After that, pushing takes one command.

### First time only (run once from your terminal)

```bash
cd path/to/rr-insights
bash sync.sh --setup
```

You will be asked for your GitHub PAT once. It gets stored in your OS keychain / credential helper.
Every future `git push` — from any terminal session on this machine — works without asking again.

Your PAT needs: `repo` scope. Create at https://github.com/settings/tokens/new

### Every time Claude gives you new files

```bash
bash sync.sh
# or
npm run sync
```

That's it. Stages all src/ changes, commits, pushes, GitHub Actions deploys in ~60 seconds.
Live at: https://soleyromit.github.io/rr-insights/

---

## How Claude syncs data (the loop)

```
Granola session / doc uploaded
  → Claude reads + synthesizes
  → Claude writes updated files to outputs/
  → You download 3 files, drop into src/
  → bash sync.sh
  → Live in 60 seconds
```

Files Claude typically updates:
- `src/data/insights.ts` — insight array, tagged by product + persona
- `src/data/products.ts` — product registry (NPS, gaps, roadmap)
- `src/views/products/ExamManagementView.tsx` — Exam Management deep dive (7 tabs)
- `src/data/version.ts` — version tracking + Magic Patterns URLs

---

## File locations

| What | Where |
|------|-------|
| Insight data | `src/data/insights.ts` |
| Product registry | `src/data/products.ts` |
| Exam Management view | `src/views/products/ExamManagementView.tsx` |
| All product views | `src/views/products/` |
| SKILL.md (Claude context) | `/mnt/skills/user/rr-insights/SKILL.md` |
| Magic Patterns — University UI | https://project-precious-cranberry-828.magicpatterns.app |
| Magic Patterns — Student UI | https://project-student-exam-accessibility.magicpatterns.app |
| Magic Patterns — rr-insights | Editor: vgjt3gddfgxyknd4wfnfhd |

---

## Current state (Mar 25, 2026)

- **44 insights** across 5 products
- **ExamManagementView** — 7 tabs: Insights / Service Blueprint / Feature Map / Analytics / Accessibility / Competitive / Design Decisions
- **SKILL.md v3.0.0** — Sections 13 + 14 added (Exam Management deep product intelligence)
- **University UI v1.1** — Assessment Builder + Question Bank + Question Editor + Publish Gate
- **Student UI** — 9 question types, full a11y toolbar, 32 layout variants

---

## Git identity (always use this)

```
user.email = soleyromit@gmail.com
user.name = Romit Soley
```

Never use romit@exxat.com — that's the work email, will fail attribution.

<!-- ASTRYX:START -->
Astryx v0.1.9-canary.b7d7f4b · 153 components
CLI: run every command as `npx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
  import "@astryxdesign/core/reset.css";
  import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:
1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:
- No <div> — components do all layout/spacing. Full page → AppShell; sidebar nav → SideNav.
- Frame first: pick the shell (AppShell / Layout+LayoutPanel) and budget regions in px BEFORE writing content (`astryx docs layout`).
- Dense data = rows (Table, List/Item) edge-to-edge — never Card-wrapped list items. Card = dashboard widgets, galleries, settings groups only.
- Status → StatusDot/Token; Badge only for counts and enumerated states, never decoration.
- Custom styling: component props first; else Tailwind utilities backed by tokens (bg-surface, text-primary, rounded-lg) via tailwind-theme.css. No raw hex/px.
- Tokens for every value (`astryx docs tokens`). Brand/accent via `astryx theme` — never override --color-* in :root.
- SELF-CHECK before you finish: re-read the file and replace any style={{…}}, raw <div>/<span> layout, imported .css/@apply, or hardcoded/arbitrary value (e.g. bg-[#fff], p-[13px]) with the component or a token-backed utility. If unsure a component/prop exists, run `astryx component <Name>` / `astryx search "<thing>"`; don't hand-roll CSS.

MORE CLI:
  search "<query>"   find any component / hook / doc / template / block
  component --list   153 components by category
  template --list    page + block recipes
  docs <topic>       color, elevation, icons, illustrations, internationalization, layout, migration, motion, principles, shape, spacing, styling, theme, tokens, typography
  swizzle <Name>     eject component source for deep customization
  upgrade --apply    run after any @astryxdesign/core bump
<!-- ASTRYX:END -->
