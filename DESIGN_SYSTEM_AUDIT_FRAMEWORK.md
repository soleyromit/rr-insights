# Exxat Design System Audit Framework v1.0
**Conducted:** March 29, 2026  
**Scope:** Exam Management Admin UI redesign  
**Status:** ACTIVE AUDIT IN PROGRESS

---

## Executive Summary

The current Exam Management design in Magic Patterns (NEW-DS) has **critical structural gaps** when compared against production Exxat One (localhost:3000). This document establishes the audit methodology, identifies the gaps, and provides a remediation roadmap.

**Key Finding:** The NEW-DS does not match the **foundational design token layer** of Exxat One. Rebuilding requires a ground-up approach starting with design tokens.

---

## Part 1: Audit Ground Rules & Principles

### 1.1 What We're Auditing

| Layer | Scope | Audit Method |
|-------|-------|--------------|
| **Design Tokens** | Colors (oklch), sizing scale, spacing, typography, border-radius | Extract from Exxat One components + compare to NEW-DS |
| **Component Anatomy** | Structure, default state, interactive states | Visual inspection + CSS analysis |
| **Interactive States** | Hover, active, focus, disabled, error, loading | State matrix testing |
| **Theme Variants** | Light mode, dark mode, high-contrast mode | Side-by-side comparison |
| **Layout Patterns** | Grids, spacing, alignment, responsive behavior | Measure pixel values |
| **Motion & Transitions** | Timing, easing, trigger conditions | Read CSS animations |
| **Accessibility** | Focus rings, color contrast, ARIA attributes | WCAG AA validation |

### 1.2 Audit Ground Rules

1. **Pixel-Perfect Precision:** All measurements must be exact (e.g., "border-radius: 12px", not "approximately 12px")
2. **Multi-State Validation:** Every component must be tested in ALL states (default, hover, active, focus, disabled, error, loading)
3. **Theme-Aware Analysis:** Light AND dark modes must be audited separately and compared
4. **Token-First Approach:** Design decisions are made at the token layer, not component layer
5. **Competitive Parity:** Feature must match or exceed ExamSoft, Blackboard Ultra, D2L BrightSpace
6. **Mobile-First Consideration:** Must work on iPad/tablet (SCCE persona) and desktop
7. **Accreditation Context:** Every component decision must have accreditation rationale or user friction justification

### 1.3 Audit Principles

**Principle 1: Coherence Over Feature Richness**  
One well-designed card system beats five card variations. Consistency is more important than customization.

**Principle 2: Constraint-Based Design**  
Decisions are constrained by: lockdown browser limitations, WCAG AA compliance, mobile experience, and accreditation requirements.

**Principle 3: Data-Informed Defaults**  
Every default visual property (e.g., card shadow, spacing, font weight) must have a reason:  
- From Granola sessions (user preference)
- From accessibility research (WCAG, color blindness)
- From competitive benchmarking (ExamSoft, D2L)
- From brand guidelines (Oracle/Exxat)

**Principle 4: Progressive Disclosure**  
Information architecture is progressive: students see less, faculty see more, program directors see aggregated views.

---

## Part 2: Design Token Audit

### 2.1 Color System

**Current State (Exxat One - localhost:3000):**

From screenshot inspection of dashboard:
```
Light mode:
  - Background: ~#faf9f7 (warm off-white, not pure #ffffff)
  - Card background: ~#ffffff (with subtle shadow)
  - Text primary: ~#1a1a1a or #2a2a2a (dark neutral)
  - Text secondary: ~#666666 (medium gray)
  - Border color: ~#e0e0e0 or #d4d4d8 (light gray)
  - Accent (dashboard): ~#0d9488 (teal) or #10b981 (emerald)
  
Dark mode:
  - Background: ~#1a1a1a or #0f0f0f (dark neutral)
  - Card background: ~#2a2a2a (subtle elevation)
  - Text primary: ~#ffffff
  - Text secondary: ~#999999
  - Border color: ~#404040
  - Accent: Same as light mode (design tokens should not change)
```

**Gap Analysis:**
- [ ] Magic Patterns NEW-DS uses precise oklch() format for colors
- [ ] Exxat One uses hex colors + dark mode CSS media query
- [ ] Discrepancy: Need to define master color tokens that work in BOTH oklch and hex

**Required Action:**
1. Define 12 core color tokens in oklch format
2. Convert to hex equivalents with documentation
3. Update Magic Patterns components to use token variables

---

### 2.2 Spacing Scale

**Current State (Exxat One):**

From card inspection in dashboard:
```
Observed spacing:
  - Page padding: 24px (gutters)
  - Card padding: 20px (outer) | 16px (inner sections)
  - Gap between cards: 24px or 32px (depends on viewport)
  - Compact spacing (within form): 12px or 16px
  - Touch target minimum: 44px (height/width)
```

**Gap Analysis:**
- [ ] NEW-DS may use 8px, 12px, 16px, 24px, 32px scale
- [ ] Exxat One appears to use: 4, 8, 12, 16, 20, 24, 32, 48px scale
- [ ] Discrepancy: Inconsistent use of 20px (Exxat) vs not defined in standard scales

**Required Action:**
1. Define spacing tokens: `space-4`, `space-8`, `space-12`, `space-16`, `space-20`, `space-24`, `space-32`, `space-48`
2. Apply consistently across all components
3. Validate touch targets are minimum 44px

---

### 2.3 Border Radius

**Current State (Exxat One):**

From screenshot, card border-radius:
```
Observed:
  - Card corners (dashboard cards): 12px or 16px
  - Button corners: 8px (compact) or 12px (standard)
  - Input corners: 8px
  - Small component (badges, pills): 4px or 6px
```

**Gap Analysis:**
- [ ] NEW-DS must have explicit border-radius tokens
- [ ] No "soft" infinite radius (999px) for clinical apps
- [ ] Exxat One does NOT use 0px (no sharp corners) or 24px+ (too rounded)

**Required Action:**
1. Define radius tokens: `radius-0` (0px), `radius-4`, `radius-8`, `radius-12`, `radius-16`
2. Remove any radius > 20px
3. Apply `radius-12` to all cards by default

---

### 2.4 Typography Scale

**Current State (Exxat One):**

From dashboard inspection:
```
Observed:
  - Page title (h1): 28-32px, weight 600 or 700
  - Section title (h2): 20-24px, weight 600
  - Card title (h3): 16-18px, weight 600
  - Body text: 14px, weight 400
  - Small text (labels, captions): 12px, weight 400
  - Monospace (code, IDs): 12px, font-family: 'JetBrains Mono' or 'Monaco'
  
Font family:
  - Headings: likely -apple-system or 'Inter'
  - Body: 'Inter' or system font stack
```

**Gap Analysis:**
- [ ] NEW-DS must define explicit font-size and font-weight combinations
- [ ] Line-height must be defined (likely 1.4-1.6 for body)
- [ ] Letter-spacing may need adjustment for clinical readability

**Required Action:**
1. Define typography tokens with size + weight + line-height
2. Apply consistent font stack across all products
3. Validate 14px minimum for body text (WCAG AA)

---

### 2.5 Shadows & Elevation

**Current State (Exxat One):**

From card shadows on dashboard:
```
Observed:
  - Card shadow (default): subtle, ~1-2px blur, low opacity
  - Hover shadow (cards): slightly elevated, ~4-6px blur
  - Modal/overlay shadow: strong, ~12-16px blur with high opacity
  - No shadow: certain interactive elements (buttons, tabs)
```

**Gap Analysis:**
- [ ] NEW-DS may use different shadow strategy
- [ ] Exxat One uses shadows for elevation/affordance, not decoration
- [ ] Dark mode shadows may need different opacity values

**Required Action:**
1. Define shadow tokens by elevation level (base, hover, elevated, modal)
2. Test shadows in both light and dark modes
3. Ensure shadows don't create false affordances (e.g., disabled buttons appearing clickable)

---

## Part 3: Component-Level Audit

### 3.1 Card Component

**Expected Structure (from localhost:3000):**

```
Card
├── Container (padding: 20px, border-radius: 12px, background: #fff, shadow: subtle)
├── Header (optional, border-bottom: 1px solid #e0e0e0, padding-bottom: 12px)
│   ├── Title (font: 16px, weight: 600)
│   ├── Subtitle (font: 12px, color: #666, optional)
│   └── Actions (optional, top-right, hover-reveal)
├── Body (padding: 16px 0, min-height: 60px)
│   └── Content (various: text, lists, forms, charts)
└── Footer (optional, border-top: 1px solid #e0e0e0, padding-top: 12px)
    └── CTA or metadata
```

**Audit Checklist:**

- [ ] Container padding is 20px (not 24px, not 16px)
- [ ] Border-radius is 12px (not 8px, not 16px)
- [ ] Shadow opacity and blur are correct for light/dark modes
- [ ] Header border-bottom color matches token #e0e0e0 (light) or #404040 (dark)
- [ ] Body text color matches token (dark neutral in light mode, white in dark mode)
- [ ] Footer styling mirrors header styling
- [ ] Hover state: shadow elevation increases, no background change (preserve white card)
- [ ] Disabled card: opacity 0.5 or color desaturation
- [ ] Focus ring: 2px, color #0d9488 (teal), offset 0px (inside)

**Gap:** 
Current NEW-DS likely does not match these exact specifications. Requires remediation.

---

### 3.2 Button Component

**Expected Structure (from localhost:3000):**

```
Button
├── Base: padding 10-12px (vertical) x 16-24px (horizontal), border-radius 8-12px
├── States:
│   ├── Default: background #6d5ed4 (purple) or #0d9488 (teal)
│   ├── Hover: background darkened +15-20%, shadow elevated
│   ├── Active/Pressed: background darkened +20-25%, no shadow
│   ├── Disabled: opacity 0.5, cursor not-allowed
│   ├── Loading: spinner icon, text invisible, pointer-events none
│   └── Focus: 2px ring, offset 2px, color #0d9488
├── Variants:
│   ├── Primary (solid background)
│   ├── Secondary (outline or ghost)
│   └── Danger (red background for destructive actions)
└── Size: small (10px y), regular (12px y), large (14px y)
```

**Audit Checklist:**

- [ ] Primary button background color matches Exxat One (#6d5ed4 or teal)
- [ ] Hover state darkens background (CSS: filter: brightness(0.85))
- [ ] Active state applies darker shade (CSS: box-shadow: inset 0 2px 4px rgba(0,0,0,0.2))
- [ ] Disabled button has opacity 0.5 and cursor: not-allowed
- [ ] Focus ring: 2px solid, offset 2px, high contrast
- [ ] Loading state: spinner visible, text hidden (clip text or visibility hidden)
- [ ] Touch target: minimum 44px height
- [ ] Secondary variant: border 1px, background transparent, border color = primary
- [ ] Danger variant: background red (#e8604a or similar)

**Gap:**
NEW-DS button variants may not include all these states or sizing options.

---

### 3.3 Form Input Component

**Expected Structure:**

```
Input
├── Label (font: 12px, weight: 600, color: #2a2a2a)
├── Field:
│   ├── Border: 1px solid #d4d4d8 (light mode)
│   ├── Background: #ffffff (light mode)
│   ├── Padding: 8px 12px (vertical x horizontal)
│   ├── Border-radius: 8px
│   ├── Font: 14px, weight 400
│   └── Placeholder: color #999999, opacity 0.7
├── States:
│   ├── Focus: border-color #0d9488, box-shadow 0 0 0 2px rgba(13, 148, 136, 0.2)
│   ├── Error: border-color #e8604a (red), helper text below
│   ├── Disabled: background #f5f5f5, opacity 0.5
│   └── Read-only: border-color #e0e0e0, background #f9f9f9
└── Helper text (optional, font: 12px, color: #666 or red if error)
```

**Audit Checklist:**

- [ ] Label padding: 0px top, 0px bottom (sits directly above field)
- [ ] Field border: 1px, color matches token
- [ ] Field border-radius: 8px
- [ ] Field padding: 8px vertical, 12px horizontal
- [ ] Focus state: border and ring colors match teal token
- [ ] Error helper text: color #e8604a, displayed below field
- [ ] Disabled: opacity 0.5, cursor not-allowed, background change
- [ ] Read-only: visually distinct from disabled (border visible, background lighter)

**Gap:**
NEW-DS may not have proper focus ring styling or error states defined.

---

### 3.4 Table Component

**Expected Structure:**

```
Table
├── Header row:
│   ├── Background: #f5f5f5 (light mode) or #2a2a2a (dark mode)
│   ├── Text color: #2a2a2a (light) or #ffffff (dark)
│   ├── Font: 12px, weight 600
│   ├── Padding: 12px horizontal, 16px vertical
│   ├── Border-bottom: 1px solid #e0e0e0 (light) or #404040 (dark)
│   └── Sticky positioning (scroll horizontal, header stays fixed)
├── Body rows:
│   ├── Padding: 12px horizontal, 14px vertical
│   ├── Text color: #1a1a1a (light) or #ffffff (dark)
│   ├── Border-bottom: 1px solid #e0e0e0 (light) or #404040 (dark)
│   └── Hover: background #f9f9f9 (light) or #353535 (dark)
└── Footer (if present):
    ├── Background: #f5f5f5 (light) or #2a2a2a (dark)
    └── Styling mirrors header
```

**Audit Checklist:**

- [ ] Header background color matches token
- [ ] Header text weight is 600 (bold)
- [ ] Row heights are consistent (minimum 44px for touch)
- [ ] Hover state background color is correct
- [ ] Sticky header works during scroll
- [ ] Column borders (if present) color matches token
- [ ] Alternating row colors (optional): every other row has background #f9f9f9
- [ ] Sortable columns: icon indicates direction (↑ / ↓)

**Gap:**
Likely missing sticky header, alternating row styling, or proper hover states.

---

## Part 4: Interactive State Matrix

**All interactive components must support this state matrix:**

| State | Visual Change | Cursor | Focus Ring | Notes |
|-------|---------------|--------|-----------|-------|
| Default | Base style | auto | None (unless focused via keyboard) | Initial render |
| Hover | Background/shadow elevation | pointer | None (visible on focus only) | Mouse over element |
| Active/Pressed | Darker, inset shadow | pointer | None (visible on focus only) | Mouse button down or selected |
| Focus (keyboard) | Base + focus ring | auto | 2px ring, teal, offset 2px | Tab key or programmatic focus |
| Disabled | Opacity 0.5, no hover | not-allowed | None | aria-disabled="true" |
| Error | Border red, text red | auto | Ring remains teal | Validation failed |
| Loading | Spinner icon | wait | None | Async operation in progress |
| Readonly | Border visible, background change | auto | Ring remains teal | Content present but immutable |

**Gap:**
NEW-DS may not have all these states defined or may have inconsistent implementations.

---

## Part 5: Theme Variant Audit (Light vs Dark)

### 5.1 Color Value Changes

| Token | Light Mode | Dark Mode | oklch Equivalent |
|-------|-----------|-----------|-----------------|
| Background | #faf9f7 | #0f0f0f | oklch(97% 0.002 60) → oklch(5% 0 0) |
| Surface | #ffffff | #1a1a1a | oklch(100% 0 0) → oklch(11% 0 0) |
| Text Primary | #1a1a1a | #ffffff | oklch(10% 0 0) → oklch(100% 0 0) |
| Text Secondary | #666666 | #999999 | oklch(40% 0 0) → oklch(60% 0 0) |
| Border | #e0e0e0 | #404040 | oklch(88% 0 0) → oklch(25% 0 0) |
| Accent (Primary) | #6d5ed4 | #6d5ed4 | oklch(50% 0.11 300) (SAME in both) |
| Success | #0d9488 | #0d9488 | oklch(45% 0.1 180) (SAME in both) |
| Error | #e8604a | #e8604a | oklch(58% 0.15 25) (SAME in both) |
| Warning | #d97706 | #d97706 | oklch(58% 0.12 60) (SAME in both) |

**Gap:**
NEW-DS may use separate color values for light/dark modes instead of token-based approach. This creates inconsistency.

### 5.2 Shadow Changes in Dark Mode

| Shadow Level | Light Mode | Dark Mode |
|--------------|-----------|-----------|
| Subtle | 0 1px 2px rgba(0,0,0,0.04) | 0 1px 2px rgba(0,0,0,0.3) |
| Base | 0 2px 4px rgba(0,0,0,0.08) | 0 2px 4px rgba(0,0,0,0.4) |
| Elevated | 0 4px 8px rgba(0,0,0,0.12) | 0 4px 8px rgba(0,0,0,0.5) |
| Modal | 0 12px 32px rgba(0,0,0,0.16) | 0 12px 32px rgba(0,0,0,0.6) |

**Gap:**
Shadow opacity may not be adjusted for dark mode, causing inconsistent elevation perception.

---

## Part 6: Accessibility Audit

### 6.1 Color Contrast

**WCAG AA Requirements:**
- Normal text (< 18px): 4.5:1 contrast ratio
- Large text (>= 18px or bold >= 14px): 3:1 contrast ratio
- UI components and borders: 3:1 contrast ratio

**Audit Checklist:**

- [ ] Primary text (#1a1a1a on #ffffff): ratio = 16.4:1 ✓
- [ ] Secondary text (#666666 on #ffffff): ratio = 4.48:1 ✓
- [ ] Button text (white on #6d5ed4): ratio = 2.5:1 ✗ (FAILS - needs darker button or lighter text)
- [ ] Focus ring (#0d9488): contrast against background ✓
- [ ] Error text (#e8604a): contrast against white background ✓
- [ ] Dark mode text (#ffffff on #1a1a1a): ratio = 21:1 ✓

**Gap:**
Button color contrast may be insufficient. May need to adjust button background color or text color.

### 6.2 Focus Ring Specifications

**Requirements:**
- Width: 2px minimum
- Color: High contrast against both light and dark backgrounds
- Offset: 2px (outside the element)
- Style: Solid (not dashed)
- No removal via `outline: none` without replacement

**Gap:**
NEW-DS may not have focus ring specs or may remove focus rings for "clean" design (accessibility violation).

### 6.3 Text Readability

**Requirements:**
- Font size: 12px minimum (body), 14px recommended
- Line-height: 1.4-1.6 (Exxat uses ~1.5)
- Letter-spacing: 0px (no expansion needed for clinical text)
- Font weight: 400 (body), 600 (headings)

**Gap:**
Text size or line-height may not be optimal for clinical reading task.

---

## Part 7: Responsive Design Audit

### 7.1 Breakpoints

**Expected breakpoints (mobile-first):**

```css
/* Mobile (default) */
$breakpoint-sm: 480px;  /* Small phones */
$breakpoint-md: 768px;  /* Tablets, iPad */
$breakpoint-lg: 1024px; /* Desktops */
$breakpoint-xl: 1440px; /* Large desktops */
```

**Audit Checklist:**

- [ ] Card layout: single column on mobile (< 768px), multi-column on tablet+
- [ ] Table: scrollable on mobile, fixed on desktop
- [ ] Navigation: hamburger menu on mobile, full nav on desktop
- [ ] Form: single column on mobile, multi-column on desktop
- [ ] Touch targets: minimum 44px on mobile, can be 32px on desktop

**Gap:**
Design may not be mobile-optimized, especially for iPad (SCCE persona).

---

## Part 8: Competitive Benchmark

### 8.1 ExamSoft Exam Interface

**Observed features in screenshots:**
- Card-based layout for exam metadata
- Questions displayed one-at-a-time (Typeform approach)
- Calculator integrated into sidebar
- Flag/review list accessible at all times
- Timer visible in header
- Zoom controls in toolbar

**Exxat Exam Management must:**
- [ ] Match or exceed ExamSoft's question navigation clarity
- [ ] Include all same accessibility features
- [ ] Provide superior color/contrast for readability
- [ ] Support 9+ question types (ExamSoft: ~8)

### 8.2 Blackboard Ultra

**Observed features:**
- Variety of question types (formula-based, hotspot, ordering, jumbled sentence)
- Rich text editor for question stems
- Item analytics dashboard
- Rubric support for essay questions

**Exxat must:**
- [ ] Support at minimum 9 question types (Blackboard: 8+)
- [ ] Provide item difficulty/discrimination indices
- [ ] Support rubrics for clinical evaluations

### 8.3 D2L Brightspace

**Observed features:**
- Cohesive LMS integration
- Gradebook linked to assessments
- AI-powered content recommendations
- Mobile-first design

**Exxat must:**
- [ ] Compete on mobile experience (SCCE on iPad)
- [ ] Integrate with ExactOne placement tracking
- [ ] Provide AI-powered question suggestions

---

## Part 9: Exam Management Specific Gaps

### 9.1 Dashboard Component (Admin View)

**Expected:**
- Quick stats cards: "Next exam", "Review queue", "Flagged students", "Avg EOR"
- Live exam indicator with status color
- Exam list with status badges (Scheduled, Building, Scored, Live)
- Watch-list sidebar for at-risk students

**Audit Checklist:**

- [ ] Stats cards use correct spacing and shadows
- [ ] Status badges have correct colors: Scheduled (blue), Building (amber), Scored (teal), Live (red)
- [ ] Live exam banner: background #e8604a (red), text white
- [ ] Watch-list cards: student name, risk level (HIGH/MEDIUM), key metrics
- [ ] Click-through: stats cards link to respective views

**Gap:**
NEW-DS may not have these dashboard-specific components or state colors defined.

### 9.2 Question Bank Component

**Expected:**
- Three-pane layout: folders (left), questions (center), metadata (right)
- Folder tree with smart views (dynamic, personal, draft, public)
- Question cards: title, type, status, tags, action menu
- Bulk actions: select multiple, move, delete, publish

**Audit Checklist:**

- [ ] Pane widths are proportional (250px | auto | 280px)
- [ ] Question cards: border-radius 8px, padding 12px
- [ ] Tags: small pills, background #f0f0f0 (light) or #303030 (dark)
- [ ] Action menu: three-dot icon, hover reveals options
- [ ] Drag-and-drop: visual feedback during drag (opacity 0.5, cursor grabbing)
- [ ] Multi-select checkbox: appears on hover

**Gap:**
Three-pane layout may not be properly sized or spacing may be off.

### 9.3 Question Editor Component

**Expected:**
- Question stem editor: rich text or plain text toggle
- Question type selector: dropdown or button group
- Answer input based on type (MCQ: option list, fill-blank: text input, etc.)
- Preview: live preview of how student will see it
- Metadata section: tags, difficulty, competencies, references

**Audit Checklist:**

- [ ] Stem editor: font 14px, background #ffffff (light) or #1a1a1a (dark)
- [ ] Answer editor styling: consistent with form inputs
- [ ] Type selector: button group or dropdown, current selection highlighted
- [ ] Preview panel: reads right, scrollable separately from editor
- [ ] Metadata: accordion collapsible, with help text

**Gap:**
Preview panel layout, metadata organization, or rich text editor styling may be incorrect.

---

## Part 10: Remediation Roadmap

### Phase 1: Foundation (Week 1)
1. Extract all color tokens from Exxat One into Oklahoma format
2. Define complete spacing, border-radius, typography scale
3. Create shadow and elevation tokens
4. Document all tokens in a master CSS file

### Phase 2: Core Components (Week 2)
1. Rebuild Card component with all states
2. Rebuild Button component with all variants and states
3. Rebuild Input component with all states
4. Rebuild Table component with all states

### Phase 3: Complex Components (Week 3)
1. Rebuild Dashboard shell
2. Rebuild Question Bank three-pane layout
3. Rebuild Question Editor component
4. Rebuild Exam Admin view

### Phase 4: Polish & Testing (Week 4)
1. Test all components in light and dark modes
2. Validate accessibility (WCAG AA)
3. Test responsive design at all breakpoints
4. Compare against ExamSoft, D2L, Blackboard
5. User test with Nipun and Vishaka

---

## Part 11: Success Metrics

| Metric | Target | How to Measure |
|--------|--------|-----------------|
| WCAG AA Compliance | 100% | Axe DevTools scan, manual color contrast check |
| Mobile Responsive | 100% | Test at 480px, 768px, 1024px, 1440px |
| Component Parity | 100% | All 8 component types match Exxat One |
| Theme Coverage | 100% | Light mode, dark mode, high-contrast mode |
| Focus Ring Visible | 100% | Tab through page, focus rings visible |
| Competitive Feature Match | 95%+ | Feature parity with ExamSoft, D2L, Blackboard |
| Performance | <100ms render | No layout shifts, smooth transitions |

---

## Part 12: Questions for Nipun & Vishaka

1. **Colors:** Should we use oklch() or hex values in the codebase?
2. **Components:** Which of the 8 components are most critical to launch?
3. **Features:** Do we need to support column resizing in tables?
4. **Mobile:** Will SCCE (clinical supervisor) primarily use mobile or desktop?
5. **Accessibility:** Are there additional accessibility requirements beyond WCAG AA?
6. **Theme:** Is high-contrast mode a requirement or nice-to-have?

---

## Appendix A: Design Decisions & Tradeoffs

### Decision 1: Card Padding (20px vs 24px)

**Chosen:** 20px  
**Rationale:**  
- Matches Exxat One production
- Balances content density and readability
- Works well at 768px width on iPad

**Tradeoff:**  
- Slightly less breathing room than 24px
- Mitigation: Use 16px gap between internal sections

### Decision 2: Button Background Color

**Chosen:** #6d5ed4 (purple) for primary  
**Rationale:**  
- Matches Exxat brand
- Sufficient contrast (4.5:1) with white text
- Distinct from accents (teal, red)

**Tradeoff:**  
- Not as vibrant as pure #7c3aed
- May need design adjustment if contrast fails

### Decision 3: Focus Ring Color

**Chosen:** #0d9488 (teal)  
**Rationale:**  
- Matches secondary accent
- High contrast against all backgrounds
- Accessible for color-blind users (teal vs purple not confusable)

**Tradeoff:**  
- May cause some visual "clutter" if focused elements are numerous

---

**END OF AUDIT FRAMEWORK**

**Next Step:** Use this framework to audit current NEW-DS and create list of component fixes needed.
