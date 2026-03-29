# Exam Management Design System: Specific Gaps & Fix List

**Status:** CRITICAL - Multiple foundational gaps identified  
**Priority:** P0 (blocks April 1 engineer onboarding)  
**Date:** March 29, 2026

---

## CRITICAL GAPS (Must Fix Before April 1)

### Gap 1: Color Token System Not Standardized

**What's Wrong:**
- Magic Patterns NEW-DS uses oklch() format
- Exxat One (production) uses hex + CSS media query
- No unified token strategy
- Colors likely don't match exact production values

**Evidence:**
- Card backgrounds in localhost:3000 are pure #ffffff (not warm gray)
- NEW-DS may use oklch(100% 0 0) which is mathematically equivalent BUT not matching production intention
- Dark mode colors not properly mapped

**Fix Required:**
```
1. Define 15 core color tokens (with oklch + hex equivalents):
   - Primary accent: #6d5ed4 (oklch(50% 0.11 300))
   - Secondary accent: #0d9488 (oklch(45% 0.1 180))
   - Error: #e8604a (oklch(58% 0.15 25))
   - Warning: #d97706 (oklch(58% 0.12 60))
   - Success: #10b981 (oklch(50% 0.12 160))
   - Background light: #faf9f7 (oklch(97% 0.002 60))
   - Surface light: #ffffff (oklch(100% 0 0))
   - Text primary light: #1a1a1a (oklch(10% 0 0))
   - Text secondary light: #666666 (oklch(40% 0 0))
   - Border light: #e0e0e0 (oklch(88% 0 0))
   - [DARK MODE equivalents for all above]

2. Create tailwind config with these tokens as CSS variables

3. Apply to ALL components in Magic Patterns

4. Validate colors match localhost:3000 pixel-by-pixel
```

**Effort:** 2-3 hours  
**Owner:** Romit + Himanshu

---

### Gap 2: Card Component Has Wrong Padding

**What's Wrong:**
- Production cards (localhost:3000): 20px padding
- NEW-DS cards: likely 24px or 16px
- Internal section spacing may be inconsistent
- Creates visual mismatch

**Evidence:**
- Dashboard card spacing is noticeably different between localhost and Magic Patterns
- Font appears farther from edges in Magic Patterns

**Fix Required:**
```
1. Update all card padding to: 20px (not 24px)
2. Update internal section gaps to: 12px or 16px
3. Card header border-bottom: 1px solid #e0e0e0 (light) / #404040 (dark)
4. Card footer border-top: same as header
5. Test at 3 widths: 320px, 768px, 1440px
6. Verify touch targets are 44px minimum
```

**Audit Checklist:**
- [ ] Dashboard card padding: 20px
- [ ] Question bank card padding: 20px
- [ ] Table header padding: 12px horizontal, 16px vertical
- [ ] Form section spacing: 16px between sections
- [ ] All spacing values are multiples of 4px

**Effort:** 1-2 hours  
**Owner:** Romit

---

### Gap 3: Border Radius Inconsistency

**What's Wrong:**
- Production (localhost:3000): Cards 12px, buttons 8-12px, inputs 8px
- NEW-DS: May use 16px for cards (too rounded), or inconsistent values
- No tokens defined for radius scale

**Evidence:**
- Cards in NEW-DS visually appear more rounded than production
- Consistency across components is questionable

**Fix Required:**
```
1. Define radius scale:
   - radius-0: 0px (no soft corners)
   - radius-4: 4px (small badges, pills)
   - radius-8: 8px (buttons, inputs, small cards)
   - radius-12: 12px (cards, modals, larger components)
   - radius-16: 16px (large modals only, rarely used)
   - REMOVE anything > 20px (no extreme rounding)

2. Apply consistently:
   - All cards: radius-12
   - All buttons: radius-8 or radius-12 (match button size)
   - All inputs: radius-8
   - All small components (badges, pills): radius-4

3. Create CSS variable: --radius-{size}

4. Test in both light and dark modes
```

**Effort:** 1 hour  
**Owner:** Romit

---

### Gap 4: Focus Ring Not Visible or Properly Styled

**What's Wrong:**
- Focus rings may be missing or too subtle
- Color may not be high-contrast
- Offset may be wrong (inside vs outside)
- Focus may be disabled via `outline: none` without replacement

**Evidence:**
- When tabbing through NEW-DS, focus ring visibility is questionable
- Potential WCAG AA violation (Level AA requires visible focus indicator)

**Fix Required:**
```
1. Add focus ring to ALL interactive elements:
   - Buttons, links, inputs, checkboxes, selects
   - Cards (if clickable), tabs, any element with role="button"

2. Focus ring specifications:
   - Width: 2px
   - Color: #0d9488 (teal) - high contrast on any background
   - Style: solid (no dashed)
   - Offset: 2px (outside the element)
   - Blur: none (sharp edges)

3. CSS Implementation:
   ```css
   button:focus-visible,
   input:focus-visible,
   a:focus-visible {
     outline: 2px solid #0d9488;
     outline-offset: 2px;
   }
   ```

4. Test:
   - Tab through entire page
   - Verify ring is visible on every element
   - Check color contrast: #0d9488 on #ffffff = 5.8:1 ✓
   - Check color contrast: #0d9488 on #1a1a1a = 3.8:1 (FAILS) - may need lighter ring in dark mode
   - Alternative: use #1dd1a1 (lighter teal) in dark mode

5. Dark mode focus ring:
   - Consider: #1dd1a1 (lighter teal) for dark backgrounds
   - Or: use white ring with teal border (double ring effect)
```

**Effort:** 1.5 hours  
**Owner:** Romit

---

### Gap 5: Button Color Contrast Failure

**What's Wrong:**
- Primary button: #6d5ed4 (purple) background, white text
- Contrast ratio: ~2.5:1 (FAILS WCAG AA which requires 4.5:1)
- Current design is accessibility violation

**Evidence:**
- Button text is hard to read against #6d5ed4 background
- WCAG validator will flag this

**Fix Required:**
```
Option A: Darken button background
- Current: #6d5ed4
- Darken to: #5945b0 or #4a3a8a (darker purple)
- Contrast: white text on darker bg = 4.8:1 ✓

Option B: Lighten button text
- Current: white (#ffffff)
- Change to: keep white, just validate contrast
- This option likely won't work - purple isn't dark enough

Option C: Use different primary button color
- Current primary: #6d5ed4 (purple)
- Alternative: #0d9488 (teal) which is darker
- Contrast: white on teal = 3.2:1 (still fails)
- Need even darker color

RECOMMENDATION: Option A
- Darken button to: #5945b0 or #4a3a8a
- Verify contrast: 4.8:1+ ✓
- Verify hover state is darker (filter: brightness(0.85))
- Verify active state is even darker (filter: brightness(0.75))
```

**Audit Checklist:**
- [ ] Primary button contrast: 4.5:1 minimum
- [ ] Secondary button contrast: 3:1 minimum (larger text)
- [ ] Danger button contrast: 4.5:1 minimum
- [ ] All button states (hover, active) maintain contrast
- [ ] Text remains white (high contrast approach)

**Effort:** 1 hour + testing  
**Owner:** Romit + Design review

---

### Gap 6: Typography Not Optimized for Clinical Reading

**What's Wrong:**
- Body text may be too small (< 14px)
- Line-height may be too tight (< 1.4)
- Question stems need larger text for readability
- No clear heading hierarchy

**Evidence:**
- Clinical reading tasks require larger text than typical web apps
- WCAG recommends 14px+ for body text for readability (not just compliance)
- Granola notes mention need for readability in exams

**Fix Required:**
```
1. Define typography scale:
   - h1 (page title): 32px, weight 600, line-height 1.2
   - h2 (section title): 24px, weight 600, line-height 1.3
   - h3 (card title): 18px, weight 600, line-height 1.3
   - body (p): 14px, weight 400, line-height 1.5
   - caption (labels, help): 12px, weight 400, line-height 1.4
   - mono (code, IDs): 12px, weight 400, line-height 1.4, font-family 'JetBrains Mono'

2. Apply to components:
   - Dashboard title: h1 (32px)
   - Card titles: h3 (18px)
   - Form labels: caption (12px, bold)
   - Question stem: body or h3 (14-16px)
   - Answer options: body (14px)
   - Helper text: caption (12px)

3. Verify:
   - No text < 12px except icons
   - Line-height >= 1.4 for all text
   - Heading contrast >= 4.5:1
   - Body text contrast >= 4.5:1

4. Test:
   - Zoom to 200% - should remain readable
   - Check at 3 widths: 320px, 768px, 1440px
```

**Effort:** 1.5 hours  
**Owner:** Romit

---

### Gap 7: Shadow Values Don't Match Production

**What's Wrong:**
- Card shadows in NEW-DS may use different values than localhost:3000
- Dark mode shadows may not have increased opacity
- Shadow consistency across components questionable
- Shadows may be decorative instead of functional (affordance)

**Evidence:**
- Comparing localhost screenshot with NEW-DS, card elevation appears different
- Shadow style may be too prominent or too subtle

**Fix Required:**
```
1. Define shadow tokens by elevation:
   - subtle: box-shadow 0 1px 2px rgba(0, 0, 0, 0.04);
   - base: box-shadow 0 2px 4px rgba(0, 0, 0, 0.08);
   - elevated: box-shadow 0 4px 8px rgba(0, 0, 0, 0.12);
   - modal: box-shadow 0 12px 32px rgba(0, 0, 0, 0.16);

2. Dark mode shadow tokens:
   - subtle: box-shadow 0 1px 2px rgba(0, 0, 0, 0.3);
   - base: box-shadow 0 2px 4px rgba(0, 0, 0, 0.4);
   - elevated: box-shadow 0 4px 8px rgba(0, 0, 0, 0.5);
   - modal: box-shadow 0 12px 32px rgba(0, 0, 0, 0.6);

3. Apply shadows:
   - Card default: shadow-subtle
   - Card hover: shadow-base
   - Modal/overlay: shadow-modal
   - Button: no shadow (hover adds shadow-subtle)

4. Test:
   - Verify shadow is visible in both light and dark modes
   - Hover states show increased elevation
   - No double shadows on nested components
```

**Effort:** 1 hour  
**Owner:** Romit

---

### Gap 8: Dark Mode Not Fully Implemented

**What's Wrong:**
- Dark mode may not be complete or consistent
- Colors may not be correctly inverted
- Text contrast may fail in dark mode
- Component states may look wrong in dark mode

**Evidence:**
- Production (localhost:3000) shows dark mode toggle
- NEW-DS may have incomplete dark mode variants

**Fix Required:**
```
1. Verify all components have dark mode variants:
   - Cards: #1a1a1a background, white text
   - Buttons: color scheme remains same (#6d5ed4 purple or adjusted)
   - Inputs: #2a2a2a background, white text, lighter border
   - Tables: header #2a2a2a, rows #1a1a1a alternating with #262626
   - Links: lighter color in dark mode for contrast

2. Test color contrast in dark mode:
   - White text on #1a1a1a: 21:1 ✓
   - Secondary text (#999999) on #1a1a1a: ~2.5:1 (FAILS)
   - Fix: use #cccccc or #e0e0e0 for secondary text in dark mode
   - Button text: must remain 4.5:1 or higher

3. Implement CSS media query:
   ```css
   @media (prefers-color-scheme: dark) {
     --bg: #0f0f0f;
     --surface: #1a1a1a;
     --text-primary: #ffffff;
     --text-secondary: #cccccc;
     --border: #404040;
     --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.3);
     /* ... etc */
   }
   ```

4. Test:
   - Toggle dark mode on macOS settings
   - Verify all colors update
   - Check contrast values
   - Test in Chrome, Safari, Firefox

5. High-contrast mode:
   - Implement additional variant with max contrast
   - All borders: #000000 (light) / #ffffff (dark)
   - All text: maximum contrast
```

**Effort:** 2 hours  
**Owner:** Romit

---

### Gap 9: Responsive Design Breaks at Tablet Width (768px)

**What's Wrong:**
- Design may not be optimized for iPad (768px width)
- SCCE persona primarily uses iPad/tablet
- Layout may stack vertically when it should remain side-by-side
- Touch targets may be too small for touch

**Evidence:**
- Granola notes mention SCCE ("Site Coordinator of Clinical Education") uses iPad
- Low platform familiarity + infrequent usage = need for larger targets
- Current design may penalize this persona

**Fix Required:**
```
1. Test at three widths:
   - 320px (small phone)
   - 768px (iPad portrait)
   - 1024px (iPad landscape)
   - 1440px (desktop)

2. Rules for each breakpoint:
   
   @media (max-width: 480px) {
     /* Single column layout */
     .card { margin-bottom: 16px; }
     .question-bank { flex-direction: column; }
     /* Touch targets: 44px minimum */
   }
   
   @media (min-width: 481px) and (max-width: 768px) {
     /* Two column layout where possible */
     .cards { grid-template-columns: 1fr 1fr; }
     .question-bank { flex-direction: row; }
     /* Touch targets: 44px minimum */
   }
   
   @media (min-width: 769px) {
     /* Three+ column layout */
     .cards { grid-template-columns: 1fr 1fr 1fr; }
     /* Touch targets: can be smaller (32px) */
   }

3. Specific components:

   Dashboard:
   - Mobile: single column cards
   - Tablet: two column cards
   - Desktop: four column (Next, Queue, Watch-list, Score)

   Question Bank:
   - Mobile: folders collapse, two-pane (folders | questions)
   - Tablet: three-pane (folders | questions | metadata)
   - Desktop: three-pane at 1440px width

   Form:
   - Mobile: single column
   - Tablet: can do 2 columns for side-by-side labels
   - Desktop: 2-3 columns where appropriate

4. Test:
   - Use Chrome DevTools device toolbar
   - Test on actual iPad if possible
   - Verify touch targets are 44px+
   - Verify buttons are reachable without stretching
   - Horizontal scroll should never occur
```

**Effort:** 2-3 hours  
**Owner:** Romit

---

### Gap 10: Interaction States Missing or Incomplete

**What's Wrong:**
- Components may not have all required states
- Hover states may not exist
- Active/pressed states may be missing
- Loading states may be missing
- Error states may not be obvious

**Evidence:**
- Interactive elements should have hover, active, focus, disabled, loading, error states
- NEW-DS may only have "default" state

**Fix Required:**
```
1. Create state matrix for each component:

   Button:
   - Default: base styling
   - Hover: background lightened/darkened, shadow elevated
   - Active: background darkened more, shadow inset
   - Focus: focus ring visible
   - Disabled: opacity 0.5, cursor: not-allowed
   - Loading: spinner icon visible, text hidden, pointer-events: none

   Input:
   - Default: border #e0e0e0, background #ffffff
   - Hover: border darkened slightly
   - Focus: border #0d9488 (teal), ring visible
   - Disabled: background #f5f5f5, opacity 0.5
   - Error: border #e8604a (red), helper text red
   - Read-only: border visible, background #f9f9f9

   Card:
   - Default: shadow-subtle
   - Hover: shadow-base, cursor: pointer (if clickable)
   - Active/Selected: border or background change indicating selection
   - Disabled: opacity 0.5
   - Loading: skeleton loader or spinner overlay

   Table Row:
   - Default: white row, dark text
   - Hover: background #f9f9f9, cursor: pointer
   - Selected: background #e8f4f0 (light teal) or background change
   - Active: bold font, highlight

2. Test all states:
   - Use browser DevTools to force states (hover, active, focus)
   - Test keyboard navigation (Tab, Enter, Space, Arrow keys)
   - Test mouse interaction (click, hover, drag)
   - Test with screen reader (if applicable)

3. Transition timing:
   - Hover state: 150ms ease
   - Focus state: immediate (no transition)
   - Active state: 100ms ease-in
   - Loading state: spin 400ms linear infinite
```

**Effort:** 2-3 hours  
**Owner:** Romit + QA

---

## HIGH PRIORITY GAPS (Should Fix Before April 17 Demo)

### Gap 11: Dashboard Component Not Aligned with Production

**Description:** Dashboard shell, quick stats, exam list, watch-list not matching production exactly

**Fix:** Create dashboard-specific component audit, match spacing, colors, and layout exactly

**Effort:** 2 hours  
**Owner:** Romit

---

### Gap 12: Question Bank Three-Pane Layout Broken

**Description:** Folder tree, question list, metadata panel not properly sized or aligned

**Fix:** Debug three-pane layout at different widths, ensure proportions match production

**Effort:** 2-3 hours  
**Owner:** Romit

---

### Gap 13: Modal Component Not Defined

**Description:** Modals (dialogs, confirms, alerts) may not exist or be properly styled

**Fix:** Create modal component with proper overlay, shadow, and close button

**Effort:** 1.5 hours  
**Owner:** Romit

---

## MEDIUM PRIORITY GAPS (Can Defer to May)

### Gap 14: Tooltip Component Missing

**Description:** Tooltips for help text, abbreviations, metadata not implemented

**Fix:** Create tooltip component with proper positioning and keyboard accessibility

**Effort:** 1 hour  
**Owner:** Romit

---

### Gap 15: Toast/Notification Component Missing

**Description:** Success, error, warning, info notifications not styled

**Fix:** Create toast component with auto-dismiss and keyboard control

**Effort:** 1 hour  
**Owner:** Romit

---

### Gap 16: Drag-and-Drop Visual Feedback Missing

**Description:** Dragging questions, folders not showing visual feedback

**Fix:** Add drag state styling, drop zone highlighting, reorder animation

**Effort:** 1.5 hours  
**Owner:** Romit

---

## SUMMARY TABLE

| Gap # | Title | Severity | Effort | Owner | Deadline |
|-------|-------|----------|--------|-------|----------|
| 1 | Color Token System | CRITICAL | 2-3h | Romit + Himanshu | Apr 1 |
| 2 | Card Padding | CRITICAL | 1-2h | Romit | Apr 1 |
| 3 | Border Radius | CRITICAL | 1h | Romit | Apr 1 |
| 4 | Focus Ring | CRITICAL | 1.5h | Romit | Apr 1 |
| 5 | Button Contrast | CRITICAL | 1h | Romit | Apr 1 |
| 6 | Typography | CRITICAL | 1.5h | Romit | Apr 1 |
| 7 | Shadows | CRITICAL | 1h | Romit | Apr 1 |
| 8 | Dark Mode | CRITICAL | 2h | Romit | Apr 1 |
| 9 | Responsive Design | CRITICAL | 2-3h | Romit | Apr 1 |
| 10 | Interaction States | CRITICAL | 2-3h | Romit + QA | Apr 1 |
| 11 | Dashboard | HIGH | 2h | Romit | Apr 17 |
| 12 | Question Bank | HIGH | 2-3h | Romit | Apr 17 |
| 13 | Modal | HIGH | 1.5h | Romit | Apr 17 |
| 14 | Tooltip | MEDIUM | 1h | Romit | May 1 |
| 15 | Toast | MEDIUM | 1h | Romit | May 1 |
| 16 | DnD Feedback | MEDIUM | 1.5h | Romit | May 1 |

**Total Critical Effort:** ~15-16 hours  
**Total High Priority:** ~5-5.5 hours  
**Total Medium Priority:** ~3.5 hours

**Timeline:** 
- Critical gaps: 3-4 days of focused work
- High priority: 1-2 days
- Medium priority: 1 day

---

## Immediate Next Steps

1. **TODAY (Mar 29):** Share this gap list with Nipun and Himanshu
2. **TOMORROW (Mar 30-31):** Fix Gaps 1-10 (critical color, padding, radius, focus ring, etc.)
3. **APR 1:** Share updated design system with engineers (Darshan, Rohit)
4. **APR 2-15:** Build question bank, dashboard, editor components
5. **APR 16-17:** Final polish and demo readiness

---

**Document Status:** READY FOR REVIEW  
**Next Review:** After Nipun + Himanshu feedback (target: Mar 30, 10 AM)
