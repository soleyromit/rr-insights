# Exxatly-NEW-DS — Complete Audit Report
**Date:** March 27, 2026  
**Source:** localhost:3000 live DOM extraction — all 5 routes + overlays + tooltips  
**DS ID:** `ds-712de3ba-b73d-407d-9d94-a149d8f9d481`

---

## CODE INTEGRITY CHECKLIST

### ✅ Performance Rules (Tailwind config)
- [ ] **NEVER** put `var(--...)` references in `tailwind.config.js` — causes "trimmed messages exceeds token context limit"
- [ ] All Tailwind colors must use **hex values only**
- [ ] `tailwind.config.js` target size: < 3,500 chars
- [ ] `index.css` target size: < 9,000 chars (current: 8,160 — ✅)
- [ ] No duplicate CSS variable declarations (previously had duplicate `--sidebar-width`)

### ✅ Token Accuracy Checklist (confirm before each design)

| Token | Correct Value | Common Mistake |
|-------|--------------|----------------|
| Page background | `#0b0b0e` | Using `#000` or `#0f0f0f` |
| Brand color | `#5f53ae` | Using `#465fe6` (student app) or `#E31C79` (Prism) |
| Sidebar bg | `#1a1a21` | Using `#1c1c28` or `#0b0b0e` |
| Form input height | `32px` | ❌ `40px` (40px = action buttons only) |
| Dropdown radius | `12px` | ❌ `8px` |
| Dropdown item height | `28px` | ❌ `32px` or `36px` |
| Button height | `40px` (lg), `32px` (sm) | Mixing with input height |
| Header height | `48px` | ❌ `40px` (student app height) |
| Table row height | `48px` | ❌ `40px` |
| Status badge radius | `6px` | ❌ `8px` or `9999px` |
| Overdue/Due Soon radius | `32px` (solid bg) | Using rgba style |
| Avatar bg | `#4e4a7e` | Using brand `#5f53ae` |
| Deep panel bg | `#0e111b` | Using card `#15161a` |

---

## COMPONENT TOKENS — CONFIRMED FROM DOM

### Surfaces
```
Page:         #0b0b0e
Sidebar:      #1a1a21
Card:         #15161a  ← dropdowns, dialogs, panels
Deep panel:   #0e111b  ← table headers, stepper bg
Secondary:    #222137  ← chat AI bubbles, muted bg
Accent:       #272445  ← chat user bubbles
Active nav:   #28282f  (radius 8px)
```

### Typography Scale
```
11px — helper text, step labels, badge eyebrows, section labels
12px — breadcrumbs, tooltip text, Ask Leo button, metadata
14px — BODY BASE, nav items, table cells, form inputs, labels
16px — section titles, form section headers
24px — page H1 (weight 600) — NOT 28px
36px — dashboard stat numbers (weight 700)

Table header: 11px / 700 / uppercase / tracking 0.07em
Sidebar labels: 10-11px / 700 / uppercase / tracking 0.08em
Form labels: 14px / 500 / tracking 0.025em
```

### Buttons
```
Primary:   bg #fafafa / text #39393c (INVERTED)  h:40px  r:8px  fw:500
Small:     same colors                            h:32px  r:8px
Ghost:     transparent / border #414247 / text #fafafa
Ask Leo:   border #6053b0 / text #5f53ae (brand)  h:32px
```

### Form Inputs
```
Height:  32px (NOT 40px)
Radius:  8px
Border:  #a1a4ac (border-control)
Padding: 4px 10px
Font:    14px regular
```

### Dropdown / Select
```
Popover bg: #15161a
Border:     #414247
Radius:     12px (NOT 8px)
z-index:    50
Item height: 28px
Item pad:    4px 32px 4px 6px
Item radius: 8px
Item hover:  rgba(95,83,174,0.15)
```

### Tooltip
```
bg:      #1a1a21
text:    #fafafa
radius:  6px
font:    12px / 400
padding: 4px 10px
```

### Side Panel (Ask Leo)
```
Width:   382px
bg:      #15161a
border:  #414247
radius:  12px
AI msg:  bg #222137
User msg: bg #272445
Chips:   text #5f53ae, radius 8px
Input:   32px, border #a1a4ac, radius 8px
```

### Sidebar States
```
Expanded:  240px
Collapsed: 60px (icon-only, when side panel opens)
Icon area: 36px
```

### Stepper / Wizard
```
Active circle:   bg #5f53ae / text #fafafa / size 32px / pill
Inactive circle: bg #222137 / text #817b7c
Connector:       bg #414247
Label:           11px / 500 / active #fafafa / inactive #817b7c
```

### Form Components
```
Label:     14px / 500 / #fafafa / ls 0.025em
Required:  #f14d4c (asterisk)
Helper:    11px / #817b7c
Optional:  11px / #817b7c (inline)
Field gap: 16px
Section gap: 24px
```

### Announcement Banner
```
bg:     #1a1a21
border: #414247
height: 40px
icon:   #b2afef (sparkle)
text:   #fafafa
```

### Status Badges
```
Under Review: rgba(82,148,255,0.18)   / #7aadff
Pending:      rgba(239,173,0,0.18)    / #f4bb2b
Completed:    rgba(170,163,163,0.18)  / #d4d0d0
Rejected:     rgba(239,74,74,0.18)    / #f14d4c
Confirmed:    rgba(49,206,148,0.18)   / #60d2a1
Overdue:      #f24a4a (SOLID)         / #f14d4c  r:32px
Due Soon:     #ff9a00 (SOLID)         / #fef3c6  r:32px
All:          radius 6px / 12px / weight 500
```

### Nav Label Badges
```
New:   bg #5f53ae / text #fafafa  (pill, 10px/600)
Beta:  bg #fdc700 / text #432004  (pill, 10px/600)
Notif: bg #e7000b / text #ffffff  (pill, number count)
```

---

## PERFORMANCE AUDIT RULES

### Before writing any DS file:
1. Count `var(--` occurrences in tailwind.config.js → must be **0**
2. Check for duplicate CSS variable names → must be **0**
3. Verify file sizes: tailwind < 3,500 chars, index.css < 9,000 chars
4. Verify input heights: form inputs = 32px, buttons = 40px
5. Verify dropdown radius = 12px (not 8px)

### Token overflow prevention:
- Tailwind config = structural configuration only (hex values)
- CSS variables = semantic tokens (full DS)  
- Rules = human-readable guidance (no code)
- Never duplicate the same value in more than one file

---

## ROUTES AUDITED

| Route | Status | New tokens found |
|-------|--------|-----------------|
| `/dashboard` | ✅ | H1 24px/600, stats 36px/700, trend #33cb91 |
| `/data-list` | ✅ | All 5 status badges, table dims |
| `/compliance` | ✅ | Overdue #f24a4a r32px, Due Soon #ff9a00 r32px |
| `/team` | ✅ | ACTIVE/INVITED badge styles |
| `/settings` | ✅ | Completed badge #222137, step circles #6352ad |
| `/data-list/new` | ✅ | Form inputs 32px, dropdown 12px, stepper, wizard |
| Ask Leo panel | ✅ | 382px width, chat bubbles, suggestion chips |
| Tooltip hover | ✅ | 12px/#1a1a21, 6px radius |


---

## MAGIC PATTERNS DS FILE STRUCTURE

```
Exxatly-NEW-DS (ds-712de3ba-b73d-407d-9d94-a149d8f9d481)
├── Typography
│   ├── Heading — Inter Semibold (600) ✅
│   ├── Body    — Inter Regular (400)  ✅
│   └── UI Labels — Inter Medium (500) ✅
├── Colors
│   └── Background #0b0b0e ✅ (only 2 rows persisted via UI — rest in Default Files)
├── Rules
│   └── Brand Guidelines — 5,903 chars ✅ (all 12 fixes documented)
└── Default Files
    ├── index.css      — 8,160 chars ✅ (all tokens + component specs)
    └── tailwind.config.js — 3,428 chars ✅ (hex only, no var() refs)
```

## PUBLISHED DESIGNS USING THIS DS

| Design | Editor ID | Preview URL | Status |
|--------|-----------|-------------|--------|
| Exam Admin Dark | `4pe34lrvlzaqzayvspzr2s` | project-rich-macaroni-332.magicpatterns.app | ✅ Published |
| PCE Analytics | `x7nzrvdrqkmvnjwmz7s1qh` | project-truthful-apricot-326.magicpatterns.app | ✅ Published |
| FaaS Form Builder (validation test) | `coh6xkx75pa4gmrj5j7giy` | project-noble-anchovy-330.magicpatterns.app | 🔄 Generating |
