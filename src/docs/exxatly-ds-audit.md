# Exxatly-NEW-DS — Complete Audit Report
**Date:** March 27, 2026  
**DS ID:** `ds-712de3ba-b73d-407d-9d94-a149d8f9d481`  
**Source:** localhost:3000 live DOM — all routes + overlays + tooltips + charts  
**Status:** ✅ All 12+ issues fixed · Both files saved

---

## DS FILE SIZES (targets to prevent token overflow)

| File | Chars | Target | Status |
|------|-------|--------|--------|
| `index.css` | 10,706 | < 12,000 | ✅ |
| `tailwind.config.js` | 4,602 | < 5,000 | ✅ |
| `Rules` | 5,903 | < 6,000 | ✅ |

---

## CRITICAL: TOKEN OVERFLOW ROOT CAUSE + FIX

**Problem:** Magic Patterns AI reads `index.css`, then injects ALL CSS variable names as `var(--...)` Tailwind color keys in `tailwind.config.js`. This causes "Trimmed messages exceeds token context limit".

**Fix:** `tailwind.config.js` must ALWAYS use hex values. The warning block in the file header prevents the AI from adding var() refs:
```
⚠️ CRITICAL: HEX VALUES ONLY IN THIS FILE
DO NOT add any var(--...) references anywhere in this config.
```

**After every AI generation**, run `write_artifact_files` on `tailwind.config.js` with the clean version from `src/docs/exxatly-tailwind-clean.js`.

---

## CODE INTEGRITY CHECKLIST (before writing any DS file)

- [ ] Count `var(--` in tailwind.config.js → must be **0**
- [ ] Check for duplicate CSS variable names → must be **0**  
- [ ] tailwind.config.js < 5,000 chars
- [ ] index.css < 12,000 chars
- [ ] Input heights: form inputs = 32px, buttons = 40px
- [ ] Dropdown radius = 12px (not 8px)
- [ ] Dropdown item height = 28px

---

## ALL CONFIRMED TOKENS

### Surfaces (darkest → lightest)
```
Page bg:      #0b0b0e   ← deepest
Sidebar:      #1a1a21   ← sidebar + header bar
Card:         #15161a   ← cards, dropdowns, dialog, side panel
Deep panel:   #0e111b   ← table headers, stepper inactive bg
Secondary:    #222137   ← secondary panels, chat AI bubble
Accent:       #272445   ← accent, chat user bubble
Active nav:   #28282f   ← active sidebar item (radius 8px)
```

### Brand
```
Default:  #5f53ae   ← indigo-purple (NOT student blue #465fe6, NOT pink #E31C79)
Dark:     #3f3679
Deep:     #272050
Light:    #b2afef   ← text on dark brand elements
Tint:     #f3f3ff   ← light surface use only
Prism:    #E31C79   ← logo only, NEVER use in designs
```

### Text
```
Primary:  #fafafa
Muted:    #a1a4ac   ← metadata, chart axis, secondary text
Subtle:   #817b7c   ← sidebar labels, hints, table headers
```

### Buttons
```
Primary:  bg #fafafa / text #39393c (INVERTED)  h:40px  r:8px  fw:500  fs:14px
Small:    same colors                             h:32px  r:8px
Ghost:    transparent / border #414247 / text #fafafa
Ask Leo:  border #6053b0 / text #5f53ae (brand)  h:32px
```

### Form Inputs [FIXED — was 40px]
```
Height:  32px (NOT 40px — that's for action buttons)
Radius:  8px
Border:  #a1a4ac
Padding: 4px 10px
Font:    14px / regular
```

### Dropdown/Select [FIXED — was 8px radius]
```
Popover bg:   #15161a
Border:       #414247
Radius:       12px (NOT 8px)
z-index:      50
Item height:  28px (NOT 32px)
Item padding: 4px 32px 4px 6px
Item radius:  8px
Item hover:   rgba(95,83,174,0.15)
```

### Tooltip [NEW]
```
bg:      #1a1a21
text:    #fafafa
radius:  6px
font:    12px / 400
padding: 4px 10px
```

### Side Panel / Ask Leo [NEW]
```
Width:      382px
bg:         #15161a
border:     #414247
radius:     12px
AI bubble:  bg #222137
User bubble:bg #272445
Chips:      text #5f53ae, radius 8px
Input:      32px / border #a1a4ac / radius 8px
```

### Sidebar States [NEW]
```
Expanded:  240px
Collapsed: 60px (icon-only when panel opens)
Icon area: 36px
```

### Filter Tab Bar [NEW]
```
Container: bg #222137 / border #414247 / radius 12px / padding 3px
Active:    bg #0b0b0e / text #fafafa / radius 8px / h:24px / 12px/500
Inactive:  bg transparent / text #a1a4ac / 12px/400
```

### Stepper/Wizard [NEW]
```
Active circle:   bg #5f53ae / text #fafafa / 32px / pill
Inactive circle: bg #222137 / text #817b7c
Connector:       bg #414247
Label:           11px/500 / active #fafafa / inactive #817b7c
```

### Form Components [NEW]
```
Label:     14px / 500 / #fafafa / ls 0.025em
Required:  #f14d4c (asterisk)
Helper:    11px / #817b7c
Optional:  11px / #817b7c
Field gap: 16px | Section gap: 24px
```

### Announcement Banner [NEW]
```
bg: #1a1a21 | height: 40px | border-bottom: #414247
Icon: #b2afef | Text: #fafafa
```

### Table
```
Row height:    48px
Header bg:     #0e111b (deep panel)
Header text:   #817b7c | uppercase | 11px | 700 | ls 0.07em
Border:        #414247
```

### Status Badges
```
Under Review: rgba(82,148,255,0.18) / #7aadff     r:6px
Pending:      rgba(239,173,0,0.18)  / #f4bb2b     r:6px
Completed:    rgba(170,163,163,0.18)/ #d4d0d0     r:6px
Rejected:     rgba(239,74,74,0.18)  / #f14d4c     r:6px
Confirmed:    rgba(49,206,148,0.18) / #60d2a1     r:6px
Overdue:      #f24a4a (SOLID)       / #f14d4c     r:32px
Due Soon:     #ff9a00 (SOLID)       / #fef3c6     r:32px
Font: 12px / weight 500
```

### Nav Label Badges
```
New:    bg #5f53ae / text #fafafa  (pill, 10px/600)
Beta:   bg #fdc700 / text #432004  (pill, 10px/600)
Notif:  bg #e7000b / text #ffffff  (pill, number count, ~16px)
```

### Checkbox [NEW]
```
Size:   16px × 16px
Radius: 4px
Border: #a1a4ac
Checked bg: #5f53ae (brand)
```

### Chart System [NEW]
```
Line 1: var(--brand-color) = #5f53ae
Line 2: var(--color-chart-2) = #33cb91
Line 3: var(--color-chart-4) = #f14d4c
Line 4+: var(--chart-N) sequence
Axis ticks: #a1a4ac (12px)
Grid lines: #414247 (dashed 3 3)
Donut gaps: stroke var(--card) = #15161a
Legend: 12px / #a1a4ac
```

### Insight/Alert Card [NEW]
```
Border:     #414247
Icon:       bg #fdc700 / 36px / pill
Title:      14px/600
Body:       13px / #a1a4ac
```

### Typography Scale
```
11px — helper text, step labels, badge text, eyebrows
12px — breadcrumbs, tooltips, metadata, chart axis
14px — BODY BASE, nav, table cells, form inputs, labels (BASE)
16px — section/card titles
24px — page H1 (weight 600, lh 30px) — NOT 28px
36px — dashboard stat numbers (weight 700)
26px — list page stat numbers (weight 700)
```

### Avatar
```
bg: #4e4a7e | text: #fbfbff | 32px | pill | initials 2 chars / 700
```

### Charts
```
1: #2b7fff  2: #33cb91  3: #efad00  4: #f14d4c  5: #b2afef
```

### Semantic
```
Destructive: #f14d4c | Success: #33cb91 | Warning: #efad00 | Info: #2b7fff
Trend up: #33cb91 | Trend down: #f14d4c (both 14px/500)
```

### Radius Scale
```
2px  — micro
4px  — small tags, checkbox
8px  — inputs, buttons, cards, nav items (DEFAULT)
12px — dropdowns, panels, filter bar outer, dialog
16px — large cards
32px — Overdue/Due Soon solid badges
9999px — avatars, notification dots
```

### Z-Index
```
50 — dropdowns | 60 — sticky | 100 — modal | 200 — toast
```

---

## ROUTES AUDITED

| Route | Status | Key findings |
|-------|--------|-------------|
| `/dashboard` | ✅ | H1 24px/30lh, stats 36px/700, trend #33cb91, charts, donut, insight card |
| `/data-list` | ✅ | Filter tab bar (container #222137/r12px, active #0b0b0e/r8px/h24px) |
| `/compliance` | ✅ | Overdue #f24a4a, Due Soon #ff9a00, both solid radius 32px |
| `/team` | ✅ | ACTIVE/INVITED badges, avatar colors |
| `/settings` | ✅ | Completed badge #222137, step circles #6352ad, ghost buttons |
| `/data-list/new` | ✅ | 5-step stepper, form inputs 32px, dropdown 12px, wizard pattern |
| Ask Leo panel | ✅ | 382px width, chat bubbles, suggestion chips, sidebar collapses to 60px |
| Tooltip hover | ✅ | #1a1a21 bg, 6px radius, 12px font |

---

## DS STRUCTURE

```
Exxatly-NEW-DS (ds-712de3ba-b73d-407d-9d94-a149d8f9d481)
├── Typography
│   ├── Heading   — Inter Semibold (600) ✅
│   ├── Body      — Inter Regular (400)  ✅
│   └── UI Labels — Inter Medium (500)   ✅
├── Colors
│   └── Background #0b0b0e ✅
├── Rules (Brand Guidelines)
│   └── 5,903 chars — full dark theme guidance + 12 NEVER rules ✅
└── Default Files
    ├── index.css      — 10,706 chars — all tokens + components ✅
    └── tailwind.config.js — 4,602 chars — hex only, no var() ✅
```

## PUBLISHED DESIGNS

| Design | Editor | Preview | Status |
|--------|--------|---------|--------|
| Exam Admin Dark | `4pe34lrvlzaqzayvspzr2s` | project-rich-macaroni-332.magicpatterns.app | ✅ |
| PCE Analytics | `x7nzrvdrqkmvnjwmz7s1qh` | project-truthful-apricot-326.magicpatterns.app | ✅ |
| FaaS Form Builder | `coh6xkx75pa4gmrj5j7giy` | project-noble-anchovy-330.magicpatterns.app | ✅ |

## REUSABLE CLEAN TAILWIND CONFIG

After every AI generation, overwrite `tailwind.config.js` with:  
`src/docs/exxatly-tailwind-clean.js`

This strips all `var(--...)` refs the AI auto-injects.
