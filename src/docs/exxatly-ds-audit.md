# Exxatly DS — Complete Dual-Mode Audit
**Date:** March 27, 2026 | **DS:** `ds-712de3ba-b73d-407d-9d94-a149d8f9d481`

---

## DUAL-MODE ARCHITECTURE

```
HTML class  │ Theme         │ Who uses it
────────────┼───────────────┼──────────────────────────────
.dark       │ School Admin  │ Default — dark bg, light sidebar
.light      │ Light mode    │ User-switchable via Appearance menu
```

### Dark Mode (`.dark`)
```
Page bg:       #0b0b0e
Sidebar:       #1a1a21   ← different from page bg
Card/Popover:  #15161a
Secondary:     #222137
Accent:        #272445
Deep panel:    #0e111b   ← table headers, stepper bg
Active nav:    #28282f   (r:8px)
Border:        #414247
Input border:  #a1a4ac
Primary text:  #fafafa
Muted text:    #a1a4ac
Subtle text:   #817b7c
```

### Light Mode (`.light`)
```
Page bg:       #f3f3ff   ← brand tint, NOT white
Card:          #ffffff
Sidebar:       #3f3679   ← brand-dark PURPLE (stays dark)
Sidebar active:#ebebfd   ← brand tint chip
Secondary:     #ededf6
Muted:         #ececf2
Muted text:    #60636a
Border:        #e4e4e6
Input border:  #939599
Primary text:  #0a0a0a
Card shadow:   0px 1px 3px rgba(0,0,0,0.08)
```

---

## ALL CONFIRMED COMPONENT TOKENS

### Buttons
```
Primary dark:  bg #fafafa  / text #39393c  ← INVERTED
Primary light: bg #39393c  / text #fafafa  ← INVERTED
Action height: 40px | Form/small: 32px | Radius: 8px | Weight: 500
Ghost:         border var(--border), transparent bg
Ask Leo:       border #6053b0, text #5f53ae, h:32px
```

### Form Inputs [FIXED — was 40px]
```
Height: 32px | Radius: 8px | Padding: 4px 10px | Font: 14px/400
Dark border: #a1a4ac | Light border: #939599
```

### Dropdown [FIXED — was 8px]
```
Popover bg: var(--card) | Radius: 12px | z-index: 50
Item: 28px h / 4px 32px 4px 6px pad / 8px radius
Hover: rgba(95,83,174,0.15)
```

### Tooltip [NEW]
```
bg #1a1a21 | text #fafafa | radius 6px | 12px/400 | pad 4px 10px
```

### User Menu [NEW — from screenshot]
```
Container: var(--card) bg | var(--border) border | radius 12px
Items: 32px h | 14px/400 | hover: var(--accent)
Avatar in menu: bg #222137 | RADIUS 12px (NOT pill)
Value labels: var(--muted-foreground) right-aligned
Separator: 1px var(--border)
Options: Account, Billing, Notifications, Appearance (sub →Dark/Light/System),
         Contrast, Brand, Dashboard view, Chart style, Log out
```

### Side Panel / Ask Leo
```
Width: 382px | bg: var(--card) | radius: 12px
AI msg: var(--secondary) | User msg: var(--accent)
Suggestion chips: text #5f53ae, radius 8px
```

### Filter Tab Bar [NEW]
```
Container: dark bg #222137 / light bg #ededf6 | radius 12px | pad 3px
Active:    bg var(--background) | text var(--foreground) | r:8px | h:24px | 12px/500
Inactive:  transparent | var(--muted-foreground) | 12px/400
```

### Stepper
```
Active:   bg #5f53ae | text #fafafa | 32px | pill
Inactive: bg var(--secondary) | text var(--muted-foreground)
Connector: var(--border)
Label:    11px/500 | active=foreground / inactive=muted
```

### Checkbox
```
16×16px | radius 4px | border: var(--input)
Checked: bg #5f53ae (brand)
```

### Avatar
```
Dark menu: bg #222137 | radius 12px | 32px
Standard:  bg #4e4a7e | text #fbfbff | pill | 32px
```

### Status Badges (mode-agnostic — rgba works on all bgs)
```
Under Review: rgba(82,148,255,0.18) / #7aadff    r:6px
Pending:      rgba(239,173,0,0.18)  / #f4bb2b    r:6px
Completed:    rgba(170,163,163,0.18)/ #d4d0d0    r:6px
Rejected:     rgba(239,74,74,0.18)  / #f14d4c    r:6px
Confirmed:    rgba(49,206,148,0.18) / #60d2a1    r:6px
Overdue:      #f24a4a SOLID / #f14d4c            r:32px
Due Soon:     #ff9a00 SOLID / #fef3c6            r:32px
All: font 12px/500
```

### Charts [CORRECTED from live recharts]
```
chart-1: #5794ff  (was incorrectly #2b7fff)
chart-2: #33cb91
chart-3: #54c6f3  (cyan — NEW)
chart-4: #f3b100  (amber — was incorrectly #f14d4c)
chart-5: #f49500  (orange — NEW)
Axis ticks: var(--muted-foreground) 12px
Grid: var(--border) dashed 3 3
```

### Typography
```
11px — helper, steps, eyebrows, table headers
12px — breadcrumbs, tooltips, filter tabs
14px — BODY BASE (all forms, nav, table)
16px — section titles
24px/600/lh30px — page H1
36px/700 — dashboard stats | 26px/700 — list page stats
```

---

## FORM LABEL ANATOMY
```
[Label 14px/500]  *[red #f14d4c]   [(optional) 11px/muted]
[Input 32px / border #a1a4ac / r:8px / pad:4px 10px        ]
[Helper text 11px / #817b7c                                 ]
```

---

## DS FILE STATE
```
index.css           8,382 chars  — dual-mode :root .dark .light + all component tokens
tailwind.config.js  4,955 chars  — hex only, darkMode:'class', both mode color sets
Rules               5,020 chars  — dual-mode guidance + 6 NEVER rules
```

## TOKEN OVERFLOW PREVENTION
- `tailwind.config.js` NEVER uses `var(--...)` → causes "trimmed messages exceeds token context limit"
- After any AI generation: overwrite tailwind.config.js from `src/docs/exxatly-tailwind-clean.js`

## COMPONENTS BUILT
| Component | Editor | Preview |
|-----------|--------|---------|
| Full library (dark+light) | `j2xmmvtmqsg77u8n6wx92v` | project-brave-summit-300.magicpatterns.app |
| Exam Admin Dark | `4pe34lrvlzaqzayvspzr2s` | project-rich-macaroni-332.magicpatterns.app |
| PCE Analytics | `x7nzrvdrqkmvnjwmz7s1qh` | project-truthful-apricot-326.magicpatterns.app |
| FaaS Form Builder | `coh6xkx75pa4gmrj5j7giy` | project-noble-anchovy-330.magicpatterns.app |

---

## COMPONENT LIBRARY — Published

**Design:** Exxatly Component Library — Dark + Light  
**Editor:** `afbbaapuz9ds5ebwyjvvna`  
**Preview:** `project-graceful-quail-855.magicpatterns.app`  

All 10 components built side-by-side in dark and light mode:

| # | Component | Dark | Light |
|---|---|---|---|
| 1 | Buttons | Primary (white/dark text), Ghost, Small, Ask Leo | Primary (brand purple), Ghost, Small, Ask Leo |
| 2 | Form Inputs | Email, Required *, Optional, Select | Same with light surfaces |
| 3 | Status Badges | All 7 with correct rgba backgrounds | Same (badges are mode-agnostic) |
| 4 | Nav Badges | New (brand), Beta (amber), Notif (red) | Same |
| 5 | Filter Tab Bar | `#222137` container, `#0b0b0e` active | `#ededf6` container, `#ffffff` active |
| 6 | Avatars | Default pill + menu square (r:12px) | Same |
| 7 | User Menu Dropdown | `#15161a` bg, avatar r:12px, 32px items | `#ffffff` bg, items hover `#ededf6` |
| 8 | Tooltip | `#1a1a21` bg, r:6px, 12px | Same (tooltip stays dark in light mode) |
| 9 | Stepper | Brand active, `#222137` inactive | Brand active, `#ededf6` inactive |
| 10 | Checkbox | `#a1a4ac` border, `#5f53ae` checked | `#939599` border, `#5f53ae` checked |

**fix applied:** Stripped all `var(--...)` refs from tailwind.config.js after AI generation.

---

## Phase 2 Components — Generated Mar 28, 2026

### Standalone designs (not yet in DS sidebar — use these URLs to add)

| # | Component | Editor URL | Preview | Status |
|---|---|---|---|---|
| 21 | Tooltip | https://www.magicpatterns.com/c/pvftwieqqyeipw1hulu9kc | https://project-tooltip-650.magicpatterns.app | ✅ Generated |
| 22 | EmptyState | https://www.magicpatterns.com/c/cujhkb6ibhqweuekxpauvq | https://project-emptystate-886.magicpatterns.app | ✅ Generated |
| 23 | AskLeoPanel | https://www.magicpatterns.com/c/gkwkr3z6xtsutnmcrzeleb | https://project-askleopanel-468.magicpatterns.app | ✅ Generated |
| 24 | BarChartCard (Grouped) | https://www.magicpatterns.com/c/9q21x4qlayhi6uaegzfic6 | https://project-barchartcardgrouped-593.magicpatterns.app | ✅ Generated |
| 25 | StackedBarChartCard | https://www.magicpatterns.com/c/wiixjpg3stp9s2xqp1p4mp | https://project-stackedbarchartcard-375.magicpatterns.app | 🔄 Generating |
| 26 | CollapsedSidebar | https://www.magicpatterns.com/c/bykggp5kkpemlrjjpe71m7 | https://project-collapsedsidebar-895.magicpatterns.app | 🔄 Generating |

### Phase 2 remaining (not yet started)
| # | Component | Priority | Notes |
|---|---|---|---|
| 27 | OrgSwitcherDropdown | P1 | Click org name in sidebar → dropdown |
| 28 | CoachMark/Spotlight | P1 | Settings page guided tour |
| 29 | SearchModal | P2 | Full-screen overlay search |
| 30 | RotationsSubmenu | P2 | Expandable sidebar submenu |
| 31 | MoreMenuOverflow | P2 | Collapsed nav overflow panel |


### Phase 2 Batch 2 — Generated Mar 28, 2026

| # | Component | Editor URL | Preview | Status |
|---|---|---|---|---|
| 27 | OrgSwitcherDropdown | https://www.magicpatterns.com/c/u2redfk6c47c4cp8bvmman | https://project-orgswitcherdropdown-638.magicpatterns.app | 🔄 Generating |
| 28 | CoachMarkSpotlight | https://www.magicpatterns.com/c/nbg3j9njhayp84diwjgmdg | https://project-coachmarkspotlight-117.magicpatterns.app | 🔄 Generating |
| 29 | SearchModal | https://www.magicpatterns.com/c/kac1xtapdpvfasd1g8z6mh | https://project-searchmodal-960.magicpatterns.app | 🔄 Generating |
| 30 | RotationsSubmenu | https://www.magicpatterns.com/c/8kx6cq78443vvyj4nfdbva | https://project-rotationssubmenu-626.magicpatterns.app | 🔄 Generating |
| 31 | MoreMenuOverflow | https://www.magicpatterns.com/c/u6hbv1gueb8qq54fvftt9b | https://project-moremenuoverflow-327.magicpatterns.app | 🔄 Generating |
