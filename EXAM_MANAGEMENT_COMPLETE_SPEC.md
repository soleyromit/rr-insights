# Exam Management — Complete Feature Specification
> Source of truth compiled from: question_bank_prd.md, question_bank_roles_and_statuses.md, question_creation_data_model.md, prd_question_bank_faculty.md, assessment_tool.md, marks_weightage_features.md, Phases_Walkthrough_Specs.md, Navigation_Architecture_Blueprint.md, Stakeholder_Summary_Day1.md, Stakeholder_Summary_Day2.md, system_hierarchy_blueprint.md, how_to_group_questions.md, question_grouping_workflow.md, UX_Prototype_Task_Checklist.md, implementation_plan.md, walkthrough.md + all Granola sessions
> Compiled: April 2026

---

## PART 1 — ROLES (Confirmed from project docs)

The correct role names from question_bank_prd.md and question_bank_roles_and_statuses.md:

| # | Role | Scope | QB Access | Nav Access |
|---|------|-------|-----------|------------|
| 1 | Institution Admin | Institution-wide | Read-only all depts | All screens (full) |
| 2 | Dept Head (HOD) | Department | Full own dept | QB, Assessments, Review Queue, Sections, Distribution, Analytics, Outcome+Accred |
| 3 | Initiative Lead (Outcome Director) | Initiative/Program | Read-only initiative | All Exams/Dashboard, QB read, Assessments read, Analytics full, Outcome+Accred full |
| 4 | Faculty (Contributor) | Course(s) | Create+edit own | QB, Assessments (own), Review Queue (own submissions) |
| 4b | Faculty + Review Access | Assigned scope | Same + approve/reject | Review Queue (approver view) |
| 5 | Student | — | None | My Exams only |

**Review Access** = composable permission granted to Faculty by Dept Head. Not a separate role.

**Multi-role users** get context switcher: "Acting as: Dept Head · Pharmacology ▾"

**What the current build has wrong:**
- Uses "Admin", "Ad Hoc", "Faculty", "HOD" — wrong names
- "Ad Hoc" does not exist in any project document
- Initiative Lead / Outcome Director not in dropdown
- Institution Admin != Admin (Admin in build is too broad)

---

## PART 2 — NAV SCREENS (All 11, per your image + project docs)

### Screen 1: All Exams / Dashboard
**Who sees it:** All roles (Inst Admin full, Prog Director yes, HOD yes, Outcome Dir yes, Contributor read)
**What it contains:**
- Action-oriented inbox, not just charts (per Navigation_Architecture_Blueprint.md)
- "Needs attention now" items: queue count, drafts pending, exams live
- Quick access to pinned/active courses
- Upcoming exam calendar
- At-risk student alerts (Influx model)
- Quick create (+) menu: Assessment, Question, Announcement
- Command palette Cmd+K
**Current build:** NOT BUILT — no dashboard screen at all

### Screen 2: Question Bank
**Who sees it:** Inst Admin (read all depts), Dept Head (full own dept), Initiative Lead (read initiative scope), Faculty (create+edit own + dept-shared)
**Contributor/Faculty:** QB visible — add-only, no edit of others

#### QB Left Sidebar — Two-tier architecture (confirmed prd_question_bank_faculty.md)
**Tier 1 (always visible):**
- Pinned views (up to 3, user-pinned)
- Recent items (up to 2)
- My Courses accordion (expand/collapse per course)
- Collapsible to 68px icon lane
- Draggable resizer up to 500px

**Tier 2 (slide-out panel via "Browse All Views →"):**
- Search bar inside panel
- Categories: Pinned, My Views (custom saved searches)
- Nested folder drill-down up to 3 levels deep
- Breadcrumb trail when drilling down
- "New Smart View" dashed ghost button at bottom
- Smart View auto-update banner when new questions match criteria

**Smart Views (from Navigation_Architecture_Blueprint.md):**
- All questions
- My Drafts
- Needs Review
- High-Yield [topic]
- Recently Used
- Flagged for Review
- Unused in exams
- Pending approval

**Smart View creation modal — two paths:**
1. Smart View (rule-based filters, optional auto-update with permission)
2. Static Folder (empty bucket, manual drag/drop)

#### QB Table — Confirmed columns (question_bank_prd.md)
| Column | Notes |
|--------|-------|
| ID | Dept-prefixed: PHR-102. Monospaced font. |
| Question Stem | Truncated. Click chevron to expand. |
| Type | MCQ, MSQ, T/F, Essay, etc. |
| Status | 6 primary badges + 2 overlay flags |
| Topic | From dept topic tree |
| Bloom's | 6 levels |
| Difficulty | Compound: "Medium (Y2)" |
| Author | Original author, never changes |
| Source | "Own" or "📌 Shared from [Dept]" |
| Last Modified | Timestamp |
| Usage Count | Used in N exams |

**Column toggle + drag-reorder:** Display settings popover, persists across folder navigation

**Sortable by:** clicking column headers (Usage Count, Last Modified, etc.)

#### QB Filters (confirmed question_bank_prd.md + Stakeholder_Summary_Day2.md)
- Status (Draft/Ready/Active/In Review/Approved/Archived)
- Topic (dept topic tree)
- Bloom's (6 levels)
- Difficulty (Easy/Medium/Hard)
- Course
- Year/Level (Y1-4)
- Author (Dept Head + Inst Admin only)
- Source (Own/Shared/All)
- Usage count (Never used / 1-3x / 4+x)
- Date range (created/modified)
- Free text search (stem, ID, tags, author)

#### QB Status Badges — 6 primary + 2 overlay (question_bank_roles_and_statuses.md)
**Primary (mutually exclusive):**
- 📝 Draft (gray) — missing required fields, author-only visible
- ✅ Ready (green) — all fields complete, never used in exam
- 👁️ In Review (purple) — submitted, awaiting approval
- ⭐ Approved / Golden (gold) — dept head endorsed
- 🟢 Active (blue) — used in ≥1 delivered assessment
- ⚫ Archived (dim gray) — draft untouched 12+ months

**Overlay flags (appear alongside primary):**
- ⚠️ Update Available — newer version exists
- 🔒 Locked — dept head locked during exam window

**V0 scope:** Draft, Ready, Active only

#### QB Row Expand — Performance Insights drawer (prd_question_bank_faculty.md)
- Per-course breakdown: Correct %, Discrimination Index, Usage Count
- Flags: "performs well in advanced courses but poorly in intro"
- Shows for questions tagged to multiple courses
- "+1" badge in Course column when multi-course tagged

#### QB Bulk Action Bar — floating, Gmail-style (prd_question_bank_faculty.md)
- Appears when 1+ checkboxes selected
- Actions: Create Shortcut in View, Create New View, Archive, Add to Assessment
- Show selected count
- Select All / Deselect All

#### QB Action Required system (prd_question_bank_faculty.md)
- Global banner above table: "Action Required: 12 drafted questions need review"
- Individual row: orange "Action Required" pill replaces status badge
- Expanding row shows trigger: colleague requested edit, HOD requested edit, poor performance

#### QB Cross-dept sharing (Stakeholder_Summary_Day2.md)
- "📌 Shared from [Dept]" badge on shared questions
- Receiving dept can override contextual tags
- Fork option: creates new question owned by receiving dept

#### What the current build has wrong / missing:
- Status badges: only Draft/Ready/Active shown. In Review, Approved, Update Available, Locked missing
- No dept-prefixed IDs (PHR-102 format)
- No "Source" column (Own / Shared from [Dept])
- No Usage Count column
- No row expand → Performance Insights drawer
- No bulk action bar (only a simplified version)
- No Action Required system (banner + individual row pill)
- No Smart View creation modal
- No Tier 2 slide-out panel in correct form
- No Author filter (HOD/Admin only)
- No compound difficulty display (Medium Y2)
- No column drag-reorder
- Cross-dept sharing UI entirely absent

### Screen 3: Assessment Builder
**Who sees it:** Inst Admin (full), HOD (full), Prog Director (read), Initiative Lead/Outcome Dir (read), Faculty (own courses full), Contributor (assigned sections only)

#### Assessment Builder confirmed sub-screens / tabs (assessment_tool.md, walkthrough.md, implementation_plan.md):
1. **Structure tab** — sections, question list, add/remove questions, reorder
2. **All Questions tab** — flat table of all N questions: #, Section, Type, Stem, Bloom's, Difficulty, Marks, Status
3. **Collaboration tab** — assign sections to faculty contributors, guidelines
4. **Settings tab** — randomization, lockdown, calculator, scoring mode, negative marking
5. **Pre-Read tab** — supplementary materials students see before exam

#### Assessment Builder header:
- Lifecycle stepper: Draft → Building → Review → Published → Scheduled → Live
- Meta strip (clickable chips): Assessment name, Type, Weightage, Delivery, Duration, Total Marks (AUTO badge), Scheduled date
- Created by badge: "Dr. Verma, HOD"
- Role indicator: "You are: Owner" or "You are: Contributor"
- Actions: Settings gear, Collaborators, Submit for Review

#### Question states in builder (implementation_plan.md):
- DRAFT badge (gray)
- LOCKED badge (amber)
- APPROVED/GOLDEN badge (green)
- Source badge: 📚 BANK or ✏️ NEW

#### Question grouping (how_to_group_questions.md, question_grouping_workflow.md):
- Checkboxes on each question item
- Selecting 2+ reveals "🔗 Group Selected (N)" button in section toolbar
- Creates dashed-border container with group label
- Group moves as unit when reordered
- Randomization: entire group moves as one
- Individual approval per question even within group
- Ungroup button in group header
- Keyboard: Cmd+G to group, Cmd+Shift+G to ungroup

#### Marks/Weightage (marks_weightage_features.md) — Phase 1 MVP:
- Assessment-level total marks
- Section-level total marks (editable per section header)
- Equal distribution button per section
- Manual per-question inline marks field
- Bulk apply marks modal (filter by type, apply N marks to selection)
- Question type-based defaults (MCQ=2, Essay=15, Short Answer=5)
- Marks preview summary bar (A:60, B:25, C:15)
- Phase 2: Partial credit for MSQ (all-or-nothing/additive/proportional), Negative marking, Percentage weightage

#### Role-based edit privileges (Phases_Walkthrough_Specs.md):
- Teacher Owner: full edit all questions
- Teacher Contributor: edit own assigned questions only, edit button grayed for others
- Admin/Director: edit button hidden (should not modify academic content)

#### Browse Bank modal (implementation_plan.md):
- Search bar with filters (Topic, Type, Bloom's, Difficulty)
- Results list with preview
- Checkboxes for multi-select
- "Add Selected (N)" button
- Blueprint gap bar (how many questions needed per area still unfilled)
- Duplicate detection

#### Student preview modal (Phases_Walkthrough_Specs.md):
- Dynamic rendering by question type
- Real-time scoring: MCQ = full marks on correct answer
- Essay = "Pending manual grading" status
- Role-based: edit button hidden for Admin/Director

#### Current build gap — Assessment Builder:
- Question grouping (group/ungroup) not built
- Question states (DRAFT/LOCKED/APPROVED + BANK/NEW badges) not built
- Collaboration tab not fully built (assign sections to specific faculty)
- Pre-Read tab not built
- All Questions flat table not built (only stub exists)
- Marks system: partial credit, negative marking, percentage not built
- Browse Bank modal: blueprint gap bar, duplicate detection missing
- Context switcher (Owner vs Contributor view) not built

### Screen 4: Review Queue
**Who sees it:** Inst Admin (full audit), HOD (full approval workflow), Faculty (own submissions tracker)
**What it contains:**
- HOD: approve / return / leave feedback per question
- Faculty: read-only view of own submitted questions + status
- Faculty + Review Access: approve/reject within assigned scope
- Diff view: Previous vs Changes when edit request
- Feedback field → shown to author if returned
- Priority tiers (high/medium/low)
- Filter by priority
- Admin: read-only audit banner

**Current build:** Substantially correct. Missing:
- Faculty + Review Access as a distinct sub-view
- Batch approve (select multiple, approve all)

### Screen 5: Sections (standalone nav item)
**Who sees it:** Inst Admin (full), HOD (full), Prog Director (read)
**What it is:** NOT a tab inside Assessment Builder. Standalone screen.
**Contents:**
- Section library across all assessments
- Section templates for reuse
- Section-level timing configuration
- Navigation mode per section (Sequential vs Flexible)
- Pre-read material management
- Section performance analytics over time

**Current build:** DOES NOT EXIST as standalone. Only exists as a tab inside Assessment Builder.

### Screen 6: Distribution
**Who sees it:** Inst Admin (full), HOD (full)
**What it contains:**
- Schedule exam open/close windows (date + time)
- Assign to student cohorts / groups / course enrollments
- Per-student accommodation overrides (1.5x / 2.0x time)
- LMS sync status (Canvas / Prism)
- Email notification config to students
- Exam access link generation
- Published → student access confirmation
- Admin can submit on behalf of students (Granola: March standup)

**Current build:** DOES NOT EXIST. Only a Students tab inside Assessment Builder (which handles accommodation but not full scheduling/distribution).

### Screen 7: Analytics
**Who sees it:** Inst Admin (full), HOD (full), Prog Director (full), Outcome Director (full)
**What it contains:**
- KPI strip: total questions, avg p-value, pending review, exams this term
- Leo insight card (ambient, inline — not "click here for AI")
- Bloom's distribution bar chart per scope
- Bank health: status breakdown (Active/Draft/Pending/Archived counts)
- NCCPA blueprint radar (Admin/HOD)
- p-value scatter / item analysis table
- Point biserial values (from Granola ExamSoft analysis)
- KR-20 reliability measurement
- Overexposed question alerts (P2)
- Student risk detection / at-risk flags
- Cross-course performance by topic
- Exportable: CSV, accreditation report format

**Current build:** Substantially correct. Missing:
- Point biserial display
- KR-20 reliability metric
- Student risk detection (at-risk alerts)
- Cross-course topic breakdown

### Screen 8: Outcome & Accreditation
**Who sees it:** Inst Admin (full), Prog Director (full), HOD (read), Outcome Director (full)
**What it contains (Navigation_Architecture_Blueprint.md):**
- Outcomes Dashboard: red flags and compliance health
- Longitudinal Competency Map: interactive matrix, USMLE/ACGME standards vs all 4 years of curriculum
- Initiatives / Degree Programs: cross-cutting nodes aggregating data across depts
- External Data Connectors: clinical assessment data merged with written assessment
- Accreditation Reporting Studio: 1-click audit reports for CAPTE, ARC-PA, ACOTE, CCNE
- Interdisciplinary Insights: AI-generated ("Students grasp Beta Blockers in Pharmacology but fail in Clinical rotations")
- ARC-PA 9 standard competency areas tracker
- PANCE performance data (85% first-time pass rate requirement)
- Attrition rate tracking (<8% required)

**Current build:** DOES NOT EXIST.

### Screen 9: Audit Trail
**Who sees it:** Institution Admin ONLY
**What it contains:**
- Who changed what, when — full change log
- Question edits, version promotions, approval decisions
- Exam access logs
- Role changes
- Sharing approvals/revocations
- Exportable for compliance

**Current build:** DOES NOT EXIST.

### Screen 10: Settings / User Management
**Who sees it:** Institution Admin ONLY (full). Other roles get profile/notification settings only.
**What Inst Admin sees (Navigation_Architecture_Blueprint.md):**
- System Health & Metrics (usage, storage, licenses)
- Institutional Hierarchy Setup (manage Institution → Initiative → Department tree)
- User & Identity Management (SSO config, RBAC role assignment, bulk import students/faculty)
- Taxonomy & Tag Manager (configure tag blueprints, approve custom tags, reclassify objective/contextual)
- Integration Config (Canvas LTI, Prism sync, API management)
- Audit Log access

**What other roles see (Settings screen):**
- Profile (name, email, dept, institution — role is read-only)
- Accessibility defaults (zoom, HC, TTS, keyboard nav)
- Notifications (role-specific toggles)

**Current build:** Settings exists as profile/accessibility/notifications stub. No User Management, Hierarchy Setup, Tag Manager, or Integration Config.

### Screen 11: LMS / Integration Config
**Who sees it:** Institution Admin ONLY
**What it contains:**
- Canvas LTI configuration
- Prism sync settings
- API key management
- Grade passback configuration
- External data connector setup (clinical products)

**Current build:** DOES NOT EXIST. Deferred but needs a nav placeholder.

---

## PART 3 — QUESTION BANK: COMPLETE FEATURE GAP

### 3.1 Question Entry Methods (Stakeholder_Summary_Day2.md)
| Method | Details | Status in build |
|--------|---------|-----------------|
| Create new | Opens question editor, starts as Draft | Partial |
| Import from file | Word/Excel/QTI bulk upload, creates Drafts | Import modal stub only — no file parsing |
| Clone/Save as variant | Creates new question (new ID, new version chain), owned by cloner, linked to original | NOT BUILT |
| Pulled from assessment | Enters bank as Ready (skips review gate) | NOT BUILT as distinct flow |

### 3.2 Question Creation — Full Required Fields

**Layer A — QB Metadata (auto-managed):**
- Question ID (dept-prefixed, system-generated)
- Original Author (never changes)
- Version Editor (who created this version)
- Created / Modified timestamps
- Version number (auto-increments)
- Status (auto-computed)
- Department (from creator)

**Layer B — Question Editor fields:**
- Question stem (rich text, not plain textarea)
- Answer options (type-specific builder)
- Correct answer marking
- Answer-specific rationale (per choice, shown post-exam)
- Overall rationale / explanation (with references/sources)
- Supplementary material (pre-read attachment)
- Media attachments (image, audio, video — each with alt-text)

**Layer B fields MISSING from current build:**
- Rich text editor for stem (not plain textarea)
- Per-choice rationale (only overall rationale exists)
- References/sources field
- Supplementary material per question
- Alt-text field for every media attachment

**Layer C — Assessment/Feature Level (per question):**
- Partial credit scoring mode (all-or-nothing / additive / proportional)
- Answer randomization override per question
- Time limit per question (optional)
- Calculator allowed toggle per question
- Cross-out enabled per question
- Question pool assignment

### 3.3 Tag Categories — Complete List (question_creation_data_model.md)
| Tag | Required? | Values | Behavior |
|-----|-----------|--------|----------|
| Course | Optional | Institution course list | Auto-filled from course context |
| Topic/Subject | Warning if missing | Dept-specific tree (3-4 levels deep) | Mandatory or warning per dept config |
| Difficulty | Warning if missing | Easy/Medium/Hard | Compound with Year/Level |
| Bloom's Taxonomy | Warning if missing | 6 levels | Objective — cannot override in shared |
| USMLE/Competency | Optional | Step 1-3 map, pre-loaded | Objective — cannot override in shared |
| Goal/Outcome | Optional | Institution-defined | Contextual — override allowed |
| Year/Level | Optional | Y1-4 | Auto-inferred from course if tagged |
| Custom tags | Optional | Dept creates, approval required | Contextual — override allowed |

**AI Shadow Tags:** hidden AI-generated version of each tag, read-only, shown only to faculty as quality-check suggestions — NOT shown as official tags. This is MISSING from the build.

**Tag Behavior on shared questions:**
- Objective tags (Bloom's, USMLE): inherit only, cannot override
- Contextual tags (Topic, Course, Difficulty, etc.): override allowed per receiving dept

**What current build has wrong:**
- No distinction between Objective and Contextual tags
- No AI shadow tag suggestions
- No dept topic tree — just free-form tags
- No compound difficulty display
- No USMLE/Competency mapping field

### 3.4 Question Types — Complete Requirements

#### MCQ (single correct)
- Stem (rich text, may include image, audio, video)
- 3-6 answer choices (A-F), each with:
  - Choice text
  - Correct/incorrect toggle (radio)
  - Per-choice rationale (shown post-exam)
- Overall rationale field
- Randomization toggle per question
- Cross-out enabled toggle
- Calculator allowed toggle
- Partial credit: N/A (single answer)
- **MISSING from build:** per-choice rationale, randomization toggle, cross-out toggle, calculator toggle

#### MSQ / Multi-select
- All MCQ fields plus:
- Correct answer: 2+ choices (checkboxes)
- Partial credit mode selector: all-or-nothing / additive / proportional
- "Select N correct answers" instruction auto-generated
- **MISSING from build:** partial credit mode selector, auto-instruction

#### True/False
- Stem
- Two choices auto-populated (True/False)
- Correct answer toggle
- Rationale
- **Current build:** correct (auto-populates T/F)

#### Essay
- Stem
- Word limit / character limit field
- Model answer field (for grader reference, never shown to student)
- Rubric builder (criteria + point values)
- AI grading suggestion field (July milestone — placeholder)
- Grader assignment (which faculty grades)
- **MISSING from build:** word/char limit, model answer, rubric builder, grader assignment

#### Short Answer
- Same as Essay but without rubric builder
- Single-line or multi-line toggle
- Accepted answers list (for auto-grading variants)
- **MISSING from build:** accepted answers list, line mode toggle

#### Matching / Ordering
- Minimum 4 items, maximum 8-9
- Two columns: left prompts, right answers
- Pair builder (add/remove pairs)
- Per-pair scoring
- Ordering variant: single column, student puts in order
- Student-side: drag-and-drop
- **MISSING from build:** ENTIRE type not built

#### Hotspot (image click)
- Image upload (X-ray, anatomy diagram, EKG)
- Region-drawing tool (define correct clickable zone)
- Alt-text field (mandatory for WCAG)
- Multiple hotspot zones option
- Student-side: click on image
- **MISSING from build:** ENTIRE type not built

#### Formula / Variable
- Stem with {variable} placeholder syntax
- Variable definition panel: name, type (integer/decimal), min, max, units
- Formula for correct answer (using variable values)
- Tolerance setting (±5%)
- Each student gets unique variable values (anti-cheating)
- **MISSING from build:** ENTIRE type not built

#### Fill-in-the-blank (inline)
- Sentence with inline blank markers [____]
- Multiple blanks supported
- Per-blank: accepted answers, case-sensitive toggle, synonym list
- Student-side: type into inline blanks
- **MISSING from build:** ENTIRE type not built

#### Passage / Case Study
- Rich text passage OR PDF upload
- Multiple linked questions (same passage, different questions)
- Student-side: split-pane (passage left, questions right)
- Text highlighting in passage
- Scroll sync between passage and question
- **MISSING from build:** ENTIRE type not built

#### Audio / Video
- File upload (audio clip or video)
- Captions/transcript field (WCAG mandatory)
- No autoplay rule
- Replay count restriction option
- Student-side: accessible player controls
- **MISSING from build:** ENTIRE type not built

### 3.5 Versioning — Confirmed rules (Stakeholder_Summary_Day2.md, question_creation_data_model.md)
- Every edit = new immutable version (V1 → V2 → V3)
- Original Author never changes; Version Editor updates
- Assessments pin to specific version used at creation
- "Revert" = new forward version with old content (never overwrite)
- Variant = fork with new ID, new version chain, linked back to original
- Dept Head can endorse a specific version (dept-level pointer)
- Faculty can "Save as variant" — creates new question they own

### 3.6 Deletion Policy (question_bank_roles_and_statuses.md)
| Scenario | Action |
|----------|--------|
| Unused draft, own question | Hard delete allowed |
| Used question | Archive only |
| Question edited by others | Archive only, needs Dept Head approval |
| Shared/cross-dept | Archive only |
| Strict Mode (medical) | No hard delete after Draft status |

---

## PART 4 — WHAT TO BUILD IN WHAT ORDER

### Phase 0 — Specification lock (do this FIRST, before any more code)
1. Confirm role names with Nipun (April 2 call result)
2. Push this spec to GitHub for Nipun/Vishaka/Darshan sign-off
3. No code until spec is signed

### Phase 1 — April 8 (QB structure for Darshan)
- Correct role names + permissions in dropdown
- QB table: dept-prefixed IDs, Source column, Status 6 badges + 2 overlays, Usage Count
- QB sidebar Tier 1 + Tier 2 slide-out panel
- Tag system: dept topic tree, compound difficulty, USMLE field
- Row expand → Performance Insights drawer

### Phase 2 — April 9 (QB flow for Vishaka)
- Faculty vs HOD vs Initiative Lead QB views enforced
- Smart View creation modal (rule-based + static folder)
- Bulk action bar (Gmail-style)
- Action Required system (banner + individual row pill)
- Cross-dept sharing UI (Shared from [Dept] badge, fork option)

### Phase 3 — April 17 demo
- Student exam shell (existing, polish)
- Assessment Builder: question grouping, question states (DRAFT/LOCKED/APPROVED/BANK/NEW)
- Add Questions drawer (blueprint coverage bar, duplicate detection)
- New Question creation: per-choice rationale, rich text stem, tag fields complete
- Students tab in Builder (accommodation roster)
- Settings, Notifications screens

### Phase 4 — Post-April 17
- Matching/Ordering question type
- Hotspot question type
- Essay rubric builder
- Short answer accepted answers list
- Distribution screen (standalone)
- Sections screen (standalone)
- Marks system: Phase 2 features

### Phase 5 — August Cohere
- Outcome & Accreditation screen
- Longitudinal Competency Map
- Accreditation Reporting Studio
- Formula/Variable question type
- Passage/Case Study question type

### Phase 6 — November ExamSoft-competitive
- Audio/Video question type
- Fill-in-the-blank inline type
- Audit Trail screen
- Settings/User Management full Inst Admin view
- AI shadow tags
- Endorsed versions (Phase 3 in architecture docs)
