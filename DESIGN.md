# DESIGN.md — rr-insights visual world

The committed visual world, documented from the v13.x implementation. Refinements preserve this; replacing it is a deliberate redesign decision, not a drive-by.

## The world: editorial research journal

The repo reads like a well-set research publication, not a SaaS dashboard. Serif display for narrative, mono for data and measurement, a quiet warm-paper surface. Visitor mode: **Operate** (task surfaces: Signals, product pages, panels) with **Read** passages (Connect the Dots, briefings). Familiarity over novelty; brand lives in typographic precision, hairline rules, and figure discipline.

## Type

- **Display / narrative**: DM Serif Display (`.rr-serif`; `.serif` for italic). Page titles, signal titles, pull quotes, persona runners. Never on buttons, labels, or data.
- **Body / UI**: Schibsted Grotesk. Headings, controls, prose, table text.
- **Data**: JetBrains Mono (`.mono`). Counts, dates, IDs, severity chips, axis labels, captions' provenance lines. Mono marks measurement, never "technical" decoration.
- Fixed rem scale, ratio ~1.15–1.2. Tracking no tighter than -0.03em.

## Color

Warm paper neutrals from `src/index.css`: `--bg #faf9f7`, surfaces `#fff`, borders `#e3ddd4/#cdc8bf`, ink `#1a1917/#4a4844/#8a8580` (use `--text3` only for non-essential furniture; captions and reading text use `--text2`+).

- Accent `#6d5ed4` for primary actions, selection, and state only.
- Severity (charts + chips, consistent everywhere): critical `#e8604a`, high `#f5a623`, medium `#6d5ed4`, low `#2ec4a0`.
- Product accents: Exam violet, FaaS teal, PCE amber, Skills blue, LC purple. Signals carry their own hue via small dots and markers, never stripes.
- Data marks neutral until they encode; no gradients on data. The sidebar logo gradient is the single permitted decorative element.

## Layout and components

- Elevation declared once: hairline border **or** shadow, never both. Figures and index containers: 1px border, radius 10px, no shadow.
- No colored side/top stripe borders above 1px (Impeccable side-tab ban). Signal identity = 8–9px dot + colored rank number/label.
- No kicker/eyebrow above headings. Provenance lines go below the heading as a mono byline.
- Numbered lists only where order carries information (signal index = severity rank, figure numbers = references).
- Charts: Observable Plot for editorial small multiples (heatmaps, timelines), Highcharts for interactive composition. Transparent backgrounds, mono axis labels ≥`#6b6660`, dark tooltip `#1a1917`. Every figure ends in a caption naming its decision.
- Drill-down contract (L0 signal → L1 evidence set → L2 insight card → L3 action) is the one interaction pattern; new evidence surfaces reuse it rather than inventing layouts.

## Motion

150–250ms, state changes only: panel slide-in 180ms ease-out, chevron rotation 160ms, hover surface tint 140ms. No page-load choreography, no scroll reveals, nothing animates that isn't a state.

## Enforcement

Two design skills govern this repo; where they and the brief disagree, **the brief wins** (both skills' own rule).

**Impeccable** (pbakaus/impeccable): `bash scripts/design-check.sh` runs its 60-rule deterministic detector and must return 0 findings on new/rebuilt surfaces before push. Legacy pre-audit views are exempt until their P4 rebuild, at which point they adopt this world.

**taste-skill** (Leonxlnx/taste-skill): guidance layer, no CLI. Its configuration for this product:

- **Dials: `DESIGN_VARIANCE 4 / MOTION_INTENSITY 3 / VISUAL_DENSITY 5`** — the trust-first data-tool preset. This is a research instrument for accreditation-adjacent work; calm layout, minimal motion, honest density.
- **Shape lock (documented rule)**: containers and figures 10px radius; nested evidence cards 6px; chips and small pills full-radius. Nothing else.
- **Color lock**: one accent (`#6d5ed4`) for action/selection across the whole app; severity and product hues are data encodings, not accents.
- **Eyebrow ceiling**: max 1 small-caps label per 3 content sections; nav section labels in the sidebar are exempt (navigation, not section headers).
- **Mandatory mechanics adopted**: `prefers-reduced-motion` guard (global), `:active` tactile press on interactive elements (`.press`), skeleton-over-spinner if async loading ever appears, label-above-input for any future forms, WCAG AA contrast on every control.
- **Resolved conflicts, with rationale**: (1) taste-skill discourages serif display as a default reach; this world keeps DM Serif Display because the brief pins a genuinely editorial/publication identity — taste-skill's own stated exception — and its banned serifs (Fraunces, Instrument Serif) are not used. (2) Its warm-paper palette ban targets premium-consumer briefs reaching for cream+brass by habit; this palette is pinned by the rr-insights skill for an internal research journal and uses no brass/clay/oxblood accents. Neither exception licenses spreading these choices to other projects.
