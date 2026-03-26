import { useState } from 'react';
import type { WhiteboardArtifact } from '../types';

const ARTIFACTS: WhiteboardArtifact[] = [
  // PRODUCT CONTEXT
  {
    id: 'wb-pc-01', category: 'product-context', color: '#6d5ed4',
    title: 'The north star loop', source: 'Whiteboard session · Mar 2026',
    items: [
      'Measure what delightful experience looks like',
      '→ How we make experience better',
      '→ That\'s what we\'ll build → Changes → Delightful Experience',
      'Three questions: Who are the users? What do they need? What is their current experience?',
      'The finish line is not a feature — it is: Whose lives are we making better?',
    ],
  },
  {
    id: 'wb-pc-02', category: 'product-context', color: '#6d5ed4',
    title: 'Product experience spectrum', source: 'Day 1 Marriott · Mar 2, 2026',
    items: [
      'Didactic → Clinical → Culminating Exp → Advisory → Internship → Jobs → Continuing Education',
      'Exxat owns the clinical and culminating experience layer — no competitor owns the full arc',
      'Strategic shift: clinical education specialist → comprehensive program management platform',
      'Target: "third essential university system alongside LMS and SIS"',
      'KKR investment requires TAM expansion from $300M → $1B',
    ],
  },
  {
    id: 'wb-pc-03', category: 'product-context', color: '#6d5ed4',
    title: 'Platform-level signals (3+ products)', source: 'Synthesized · Mar 2026',
    items: [
      'Cognitive overload under constraint (Exam + FaaS + Skills)',
      'Reporting deficit — Program Directors cannot self-serve accreditation reports',
      'AI opportunity layer — confirmed across all 5 products',
      'Manual configuration debt — Excel mapping, manual tags, manual ID sync',
      'Multi-campus fragmentation (Exam + FaaS + ExactOne)',
      'Standalone skills entity gap (Skills + Learning Contracts)',
      'Mobile gap / SCCE underservice (FaaS + Skills)',
    ],
  },
  {
    id: 'wb-pc-04', category: 'product-context', color: '#6d5ed4',
    title: 'Claude architecture / Product = Exxat', source: 'Whiteboard session · Mar 2026',
    items: [
      'For every product: Context → Frustrations/Gaps → Happy path → Scenarios → Features used most/least → Connections → Perspectives',
      'For every feature: Context, vision, objectives → Personas affected → Workflow/lifecycle → Competitors → Pendo analytics → AMs/PMs pipeline → Gaps (Dev/UX/UI/Product) → Dependencies → AI involvement',
      'What Claude never does: generic output, skips Granola evidence, recommends without competitive check, ignores accreditation vocabulary',
      'Access to Pendo: flagged as gap — currently unavailable for feature adoption data',
    ],
  },

  // PERSONA
  {
    id: 'wb-pe-01', category: 'persona', color: '#2ec4a0',
    title: 'Student (clinical education)', source: 'Day 4 Marriott + Granola sessions · Mar 2026',
    items: [
      '80–90% build external tracking docs because the platform doesn\'t serve their needs',
      '"Have I done this skill across all rotations?" — currently unanswerable in the system',
      'Accessibility gap in exam environment is a legal blocker (ADA 508), not a nice-to-have',
      'Day in life: Complete clinical forms → take exams → track competencies → manage placement',
      'Great day: exam accommodations work silently, skill tracked cross-rotation, PANCE readiness visible',
      'Poor day: LockDown browser blocks OS tools, form submission breaks in October, spreadsheet still needed',
    ],
  },
  {
    id: 'wb-pe-02', category: 'persona', color: '#2ec4a0',
    title: 'DCE / Faculty (Director of Clinical Education)', source: 'Multiple Granola sessions · Mar 2026',
    items: [
      'Power users want Bloom\'s taxonomy + LO cross-referencing. Research-first want zero overhead.',
      'Progressive disclosure is the architectural answer — never force all faculty into the same flow.',
      '"I paste all open-ended responses into ChatGPT to extract themes. Saves hours every cycle." — Ed Razenbach',
      '"The California campus is on a different ExamSoft version. How do I share this question bank?"',
      '"We type the tags by hand. One spelling mistake and the entire form logic breaks." — Harsha',
      'Day in life: Configure forms → review student performance → coordinate clinical sites → manage accreditation data',
    ],
  },
  {
    id: 'wb-pe-03', category: 'persona', color: '#2ec4a0',
    title: 'SCCE (Site Coordinator of Clinical Education)', source: 'FaaS compliance interview · Mar 20, 2026',
    items: [
      'Most underserved persona in current IA. External user with lowest friction tolerance.',
      'Infrequent usage = relearning burden every login. Platform designed for institution, not the site.',
      '"The text is so small I have to zoom in just to read what I am approving." — SCCE feedback',
      'Approval reviewer UX is broken: guidelines buried, no side-by-side comparison with submission',
      'Preceptor intake form in FaaS is the first real surface designed for this persona',
      'Mobile gap: uses phone at clinical sites, platform not optimised',
    ],
  },
  {
    id: 'wb-pe-04', category: 'persona', color: '#2ec4a0',
    title: 'Program Director / Accreditation Coordinator', source: 'Ed Razenbach + Touro sessions · Mar 2026',
    items: [
      '"I wrote a 75-page statistical analysis for ARC-PA. Previous programs submitted 10 pages and got rejected. That report should be automated." — Ed Razenbach',
      '"If I could see every student\'s predicted PANCE score right now, I would know exactly who needs counseling this week."',
      'Builds PANCE predictor in Excel: 8 variables, R² 0.66–0.84. Predicts within 1% of actual scores.',
      'Touro runs 7 survey types outside Exxat — 7 separate data silos across Blue, Canvas, Qualtrics',
      '"Just show me the reds" — filter to deficient students only. System cannot currently do this.',
      'Accreditation report generation is the platform-level feature that makes Exxat irreplaceable',
    ],
  },

  // COMPETITOR
  {
    id: 'wb-co-01', category: 'competitor', color: '#e8604a',
    title: 'ExamSoft — the target', source: 'Dr. Vicky Mody Blackboard session · Mar 20, 2026',
    items: [
      'Estimated $60M revenue. $200–300M valuation. User satisfaction: 1/5. "Publicly anti-AI."',
      'Retention anchors: 1) Curriculum mapping already established. 2) Faculty training built over years. 3) Strong item analytics.',
      '"We have 8 cohorts of questions in ExamSoft. The curriculum mapping is done. Retraining faculty would take a year."',
      'Critical weakness: multi-campus sharing = print/email/re-upload manually. No bulk accommodation assignment.',
      'Exxat must match: curriculum mapping tags, item analytics (5 criteria, KR-20, discrimination index), blueprint assembly',
      'Exxat already beats: modern UX, built-in accessibility within lockdown, accommodation profiles, AI-first architecture',
    ],
  },
  {
    id: 'wb-co-02', category: 'competitor', color: '#e8604a',
    title: 'Blackboard Ultra + Canvas + D2L', source: 'Multiple competitive sessions · Mar 2026',
    items: [
      'Blackboard Ultra: 8+ question types ExamSoft lacks — formula-based, hotspot, jumbled sentence, ordering',
      '"Ordering questions — like ranking glycolysis enzyme steps — ExamSoft simply cannot do that." — Dr. Vicky Mody',
      'Canvas "two systems" trap: Classic Quizzes ≠ New Quizzes. Professors must migrate manually. Confusion persists.',
      'D2L critical gap: per-student per-quiz accommodation = 70 manual operations for 7 students × 10 quizzes. No bulk.',
      'All 4 competitors rely on OS-level or browser accessibility tools — all blocked by LockDown browser.',
      'Only 1 of 5 top assessment tools still uses folders (ExamSoft). Canvas, Blackboard, Surpass all moved to flat lists.',
    ],
  },
  {
    id: 'wb-co-03', category: 'competitor', color: '#e8604a',
    title: 'Indirect competitors (feature-level)', source: 'Synthesized · Mar 2026',
    items: [
      'SurveyMonkey / Typeform: self-service form creation FaaS must match. The baseline clients compare against.',
      'Qualtrics: Touro uses this for 7 survey types instead of Exxat eval. Survey analysis + theme extraction.',
      'Google Forms: zero-friction creation. The mental model faculty carry into every form builder.',
      'SmartEval: standalone course eval vendor at ~$5K/yr. Integration is Exxat\'s moat, not price.',
      'Typhon / CompetencyAI: Skills Checklist head-to-head. Timeline risk if either launches during Q3–Q4.',
      'CORE: more intuitive than Exxat because it uses domain language ("preceptor evaluations") not technical ("FaaS forms")',
    ],
  },

  // STRATEGIC
  {
    id: 'wb-st-01', category: 'strategic', color: '#f5a623',
    title: 'AI-first design philosophy', source: 'Day 1 Marriott PRISM · Mar 2, 2026',
    items: [
      '"If we build screens without AI in mind, retrofitting it later costs 10x. Every screen needs an AI integration point."',
      'Confirmed AI opportunities: blueprint assembly, PANCE predictor, theme extraction, approval automation, personalised remediation, smart scheduling, graduation risk, skills setup automation',
      'Multi-model approach: OpenAI, Gemini, Anthropic enterprise versions. Data protection enforced.',
      '95% automated compliance approval target for FaaS. 10% random sample currently — AI to cover 90%.',
      'AI-first is Exxat\'s primary competitive moat. ExamSoft cannot AI-first its 20-year-old codebase.',
      'Rule: every new screen design must include an AI integration point annotation before engineering handoff.',
    ],
  },
  {
    id: 'wb-st-02', category: 'strategic', color: '#f5a623',
    title: 'Key dates and deadlines', source: 'Exam standup + Vishaka sessions · Mar 2026',
    items: [
      'April 17, 2026: Student + admin + faculty demo for Vishaka — hard deadline',
      'May 2026: AI integration sprint (blueprint assembly, PANCE predictor, remediation)',
      'July 2026: AI heavy sprint + UNF pilot (accessibility V1 is the blocker)',
      'August 2026: Cohere launch — must be ExamSoft-competitive by this date',
      'November–December 2026: Full ExamSoft-competitive feature parity + first migration',
      'January 1, 2027: Skills Checklist production launch',
    ],
  },
  {
    id: 'wb-st-03', category: 'strategic', color: '#f5a623',
    title: 'Design system — Exxatly', source: 'Day 1 + Himanshu sessions · Mar 2026',
    items: [
      'Oracle brand guidelines as base. Purple tint for Prism products. Pink tint for ExactOne products.',
      'Family resemblance across all new modules: exam management, course eval, skills checklist.',
      'Exxatly design system active in Magic Patterns (ID: ds-7d06a130-7f2b-4db1-94e8-060fe845add8)',
      'WCAG 2.1 AA minimum on all components. Motion: purposeful, not decorative.',
      'Speed prioritised over strict standardisation currently. Acceptable to diverge when needed.',
      'Himanshu owns design system development. Romit collaborates on exam management + new modules.',
    ],
  },
  {
    id: 'wb-st-04', category: 'strategic', color: '#f5a623',
    title: 'FaaS 3-system fragmentation', source: 'Harsha · Mar 20, 2026',
    items: [
      'ExactOne manages placement data. CAS stores requirement setup. FAST handles form rendering.',
      '"You are in ExactOne. Then CAS. Then FAST. They look like three different products from three companies."',
      'Solution: headless unified frontend over three backends. Design challenge: make 3 systems feel like 1.',
      'CAS layer adds semantic meaning to form fields — Compliance as a Service.',
      '95,000+ annual support tickets. NPS: 2/5. Every ticket is a manual tag correction or config fix.',
      'April 15, 2026: CAS compliance planning meeting with ASU team — critical milestone.',
    ],
  },

  // FEATURE
  {
    id: 'wb-fe-01', category: 'feature', color: '#78aaf5',
    title: 'Accessibility — platform-embedded model', source: 'Accessibility session · Mar 16 + UNF pilot · 2026',
    items: [
      'LockDown browser blocks ALL external tools including OS-level accessibility. Must be built inside the exam.',
      'Pearson model (GRE, SAT, TOEFL): platform-embedded accessibility is proven and achievable.',
      'UNF pilot blocked until accessibility V1 ships. This is a legal requirement (ADA 508), not a feature.',
      '15 features mapped: zoom (always on, WCAG 1.4.4), TTS, STT, OSK, high contrast, extended time, calculator per question, alt text (required, blocks publish), captions (required), accommodation profiles, focus mode, dyslexia font, line reader, cross-out, image magnifier.',
      'Accommodation profile system: program-level, named profiles, bulk apply — D2L\'s 70-operation gap → 1 operation.',
      'Publish gate: blocks deploy until all images have alt text, all media has captions, all flagged students have profiles.',
    ],
  },
  {
    id: 'wb-fe-02', category: 'feature', color: '#78aaf5',
    title: 'Question bank architecture — flat tagging', source: 'Platform strategy + Q-Bank sessions · Mar 2026',
    items: [
      'Flat pool — questions are NOT siloed per course. Scoped Views = saved filter queries that look like smart folders.',
      'Only 1 of 5 top assessment tools still uses folders (ExamSoft). Folders fail cross-course knowledge mapping.',
      'Versioning: every edit creates immutable version. Exams pin to version at creation. No data loss ever.',
      '~20 tags per question when fully utilised: topic (3–4 levels), Bloom\'s, difficulty + year, USMLE/competency, course, custom.',
      'AI shadow tags: hidden AI version for quality check alongside human authoritative tags.',
      'Scoped Views: Tier 1 sidebar (pinned/recent/courses) + Tier 2 "Browse All Views" slide-out panel.',
    ],
  },
  {
    id: 'wb-fe-03', category: 'feature', color: '#78aaf5',
    title: 'Skills Checklist — standalone entity', source: 'Day 4 Marriott + Dr. T Touro · Mar 2026',
    items: [
      '"Have I done this skill across all rotations?" is currently unanswerable. System is placement-scoped, not program-scoped.',
      '"Just show me the reds" — filter to deficient students only. This is the killer feature for program directors.',
      'Architecture decision: skills must be a student program-level entity that crosses all placements.',
      'Discipline variation: PA = clinical passport + preceptor sign-off. Nursing = batch evaluation. CVT = 0/5/7.5/9/10 scale with 20–30 criteria.',
      'ARC-PA requires 3× per procedure type minimum. Overflow catch-up rotation needed for missed procedures.',
      'AI opportunity: PDF upload → skill hierarchy auto-generation. Graduation readiness predictor.',
    ],
  },
  {
    id: 'wb-fe-04', category: 'feature', color: '#78aaf5',
    title: 'Course Eval — 7 survey types (Touro)', source: 'Touro session + Ed Razenbach · Mar 2026',
    items: [
      'Touro runs 7 survey types outside Exxat: faculty peer review, didactic eval, orientation, end-of-didactic, clinical eval, exit survey, grad survey.',
      '"We run 7 different survey types. None of them are in Exxat. That is 7 separate tools and 7 separate data silos."',
      'AI theme extraction: Ed uses ChatGPT to extract themes from open-ended responses every cycle. Bring it inside Exxat.',
      'Standalone eval vendors charge ~$5K/yr. Exxat moat is integration, not price.',
      'Timing logic: available after course completion, closed before grades published. Automated enforcement required.',
      'SmartEval feature parity definition needed before April workshop.',
    ],
  },

  // EXAM MANAGEMENT — DEEP INTEL (from whiteboard screenshots + all 10 Granola sessions)
  {
    id: 'wb-em-01', category: 'exam-intel', color: '#e8604a',
    title: 'What this product is (confirmed)', source: 'Exam Mgmt whiteboard · Mar 2026',
    items: [
      'The admin side of exams — university admins and faculty create, configure, and deploy assessments. Students see the output. This tool builds the input.',
      'Two-module system: Assessment Builder (configure and publish exams) + Question Bank (institution-wide repository with tagging, versioning, lifecycle states).',
      'ExamSoft target: August 2026 Cohere launch. Must be ExamSoft-competitive. ExamSoft retention anchors: curriculum mapping, faculty training, item analytics.',
      'Year 1 goal (Arun, Mar 24): beat LMS quiz modules — Canvas parity + better UX + 1 flagship AI feature, free for Prism users.',
      'Year 2: ExamSoft parity + charge. Year 3: AI proctoring, adaptive testing, custom lockdown browser.',
      'ExamSoft is publicly anti-AI. That is the strategic opening. Exxat leans into AI everywhere.',
    ],
  },
  {
    id: 'wb-em-02', category: 'exam-intel', color: '#e8604a',
    title: 'Roles in scope — 6 personas confirmed', source: 'Migration pack + Granola sessions · Mar 2026',
    items: [
      'Dept Head / Program Director: full control — approve questions, endorse versions, cross-dept sharing, lock during exam window.',
      'Faculty / Course Director: create questions, build assessments, collaborate with contributors, submit for review.',
      'Institution Admin: full audit view, configure tag schemas, accreditation mapping, multi-campus hierarchy.',
      'Contributor (Faculty +): composable permission — creates questions for a specific assessment, head faculty reviews.',
      'Initiative / Program Lead: read-only QB, build cross-dept program-level assessments, assign sections to faculty.',
      'Reviewer (Faculty +): assigned by Dept Head for a scope — reviews drafts, approves/rejects before Ready status.',
    ],
  },
  {
    id: 'wb-em-03', category: 'exam-intel', color: '#e8604a',
    title: 'Question bank — feature clusters confirmed', source: 'Migration pack PRD · Mar 2026',
    items: [
      'Question lifecycle: Draft (author-only, cannot be used in any exam) → In Review (submitted for QA, reviewer approves/rejects) → Ready (all fields complete, dept-visible, available for assessments) → Active (used in ≥1 delivered exam, system prevents deletion) → Retired (pulled from use, exists for historical exams only).',
      'Versioning logic: every edit creates new immutable version (V1→V2→V3). Exams pin to exact version used at creation. Revert = new forward version with old content, never overwrite. Variant = fork with new ID, new owner, linked back to original. Dept Head can endorse a specific version per department.',
      'Tagging: Subject/Topic (dept-defined tree, 3–4 levels deep e.g. Pharm→CV→Beta Blockers), Bloom\'s (Remember/Understand/Apply/Analyze/Evaluate/Create), Difficulty (Easy/Medium/Hard compound with Year/Level), USMLE/Competency (ARC-PA, PAEA, Step 1–3), AI shadow tags (hidden, quality check only), mandatory tags from predefined blueprints — no free-text drift.',
      'Scoped views: flat pool, questions not siloed per course. Scoped Views = saved filter queries that look like smart folders. Auto-created per course on setup — faculty never face blank slate. Tier 1 (pinned views, recent items, My Courses accordion) + Tier 2 (Browse All Views sliding panel with search). 3-level drill-down with breadcrumb; sidebar collapses to icon mode.',
    ],
  },
  {
    id: 'wb-em-04', category: 'exam-intel', color: '#e8604a',
    title: 'Assessment Builder — feature clusters confirmed', source: 'Migration pack + Granola sessions · Mar 2026',
    items: [
      'Assessment setup: name, type (quiz/formative/summative), weightage, delivery mode. Duration, total marks (auto-computed from sections). Schedule: publish date, availability window, time zone. Lifecycle stepper: Draft→Building→Review→Published→Scheduled→Live. LMS integration (Canvas LTI): auto-post results.',
      'Section + question structure: multi-section exam with individual marks per section. Section-level weightage + question-level mark distribution. Equal distribution / manual / difficulty-based marks. Blueprint-based: specify % by content area + difficulty level. Auto-select matching questions + randomization. Question and answer option randomization per student.',
      'Question types (what admin creates, student sees): MCQ (single) + MSQ (multiple) + cross-out. Fill-in-blank. Match-the-following. Hotspot / image-based. Audio + video with captions/transcripts. PDF/multi-page case studies. Passage-based with highlighting. Chart-based.',
      'Security + proctoring: Respondus LockDown Browser. Admin live monitoring dashboard. Question + answer order randomization. Secure client delivery, restrict key combos. Accommodation settings per student: extended time, magnification, calculator.',
      'Post-exam analytics: psychometrics (item difficulty, discrimination index, KR-20). 5 evaluation criteria per question. Auto-flag poor-performing questions. Content area performance vs. national benchmarks. Cross-course performance per cohort. Curriculum mapping output: standards ↔ curriculum.',
    ],
  },
  {
    id: 'wb-em-05', category: 'exam-intel', color: '#e8604a',
    title: 'ExamSoft gaps vs. Exxat wins', source: 'ExamSoft demos (4h15m) + Touro meeting · Mar 2026',
    items: [
      'ExamSoft retention anchors (the real blockers): (1) Curriculum mapping already established. (2) Faculty training built over years — high switching cost. (3) Strong item analytics (difficulty, discrimination, KR-20). Must match all three by August 2026.',
      'Where Exxat wins architecturally: flat pool + Scoped Views (not folder silos). Cross-dept question sharing without duplication. Prism integration: student/course/faculty data already exists. AI question generation from syllabi (Phase 2). Initiative/Program cross-dept competency tracking.',
      'Multi-campus pain (confirmed by Touro): California campus on different ExamSoft version. Manual process: print questions, email, re-upload with pictures. EKG images require Box cloud sharing. This is a 45-minute workflow that should be a single click.',
      'Item analytics ExamSoft offers (must match): KR-20 (>0.8 good, >0.9 for medical). Point biserial (closer to 1 = better, negative = question is misleading). Difficulty percentage. Upper 27% (top performers) vs. lower 27% discrimination.',
      'Curving options ExamSoft has that Exxat needs: give full credit to all, assign as bonus question (does not affect 100% denominator), adjust correct answer after exam, add additional correct option. Assessment-level changes only — not retroactive across other assessments.',
    ],
  },
  {
    id: 'wb-em-06', category: 'exam-intel', color: '#e8604a',
    title: 'System flow — 3-lane lifecycle', source: 'Migration pack + Granola synthesis · Mar 2026',
    items: [
      'Admin/Faculty lane: Create question (or import from file/QB) → Tag + version (Bloom\'s, topic, difficulty) → Submit for review (Draft→In Review) → Approve (Status→Ready).',
      'Question Bank layer: Flat pool feeds Assessment Builder. Assessment Builder feeds Configure + Publish (schedule, proctoring, accommodations).',
      'Student lane: Exam available (Lockdown browser) → Answer questions (all question types) → Submit + flag (progress, navigator) → Graded result (auto-scored, LMS sync).',
      'Analytics feedback loop: psychometrics feed back — flag poor questions, update difficulty, inform next exam. This loop is the competitive moat against ExamSoft.',
      'April 17 milestone: student prototype + admin prototype + faculty prototype. May: architecture review. July: AI heavy. August: Cohere launch.',
    ],
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All artifacts', count: ARTIFACTS.length },
  { id: 'product-context', label: 'Product context', count: ARTIFACTS.filter(a => a.category === 'product-context').length },
  { id: 'persona', label: 'Personas', count: ARTIFACTS.filter(a => a.category === 'persona').length },
  { id: 'competitor', label: 'Competitive', count: ARTIFACTS.filter(a => a.category === 'competitor').length },
  { id: 'strategic', label: 'Strategic', count: ARTIFACTS.filter(a => a.category === 'strategic').length },
  { id: 'feature', label: 'Features', count: ARTIFACTS.filter(a => a.category === 'feature').length },
  { id: 'exam-intel', label: 'Exam Management', count: ARTIFACTS.filter(a => a.category === 'exam-intel').length },
] as const;

const CAT_COLORS: Record<string, string> = {
  'product-context': '#6d5ed4',
  'persona': '#2ec4a0',
  'competitor': '#e8604a',
  'strategic': '#f5a623',
  'feature': '#78aaf5',
  'exam-intel': '#e8604a',
};

export function WhiteboardView() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeCategory === 'all'
    ? ARTIFACTS
    : ARTIFACTS.filter(a => a.category === activeCategory);

  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 24px 48px' }}>

        {/* Header */}
        <p className="eyebrow mb-2">Whiteboard artifacts</p>
        <h1 className="serif text-[22px] font-medium mb-1" style={{ color: 'var(--text)' }}>
          Research intelligence from 114 Granola sessions
        </h1>
        <p className="text-[13px] mb-6" style={{ color: 'var(--text3)' }}>
          Every card is sourced from a real meeting, whiteboard session, or stakeholder interview.
          Synthesized Feb–Mar 2026 across all 5 Exxat products.
        </p>

        {/* Category filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: activeCategory === cat.id ? 600 : 400,
                border: `1px solid ${activeCategory === cat.id ? (cat.id === 'all' ? '#6d5ed4' : CAT_COLORS[cat.id] || '#6d5ed4') : 'var(--border)'}`,
                background: activeCategory === cat.id ? (cat.id === 'all' ? 'rgba(109,94,212,0.08)' : `${CAT_COLORS[cat.id]}18`) : 'var(--bg2)',
                color: activeCategory === cat.id ? (cat.id === 'all' ? '#6d5ed4' : CAT_COLORS[cat.id] || '#6d5ed4') : 'var(--text2)',
                cursor: 'pointer',
                transition: 'all .15s',
              }}
            >
              {cat.label} <span style={{ opacity: 0.6 }}>{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Artifact grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {filtered.map(artifact => {
            const isExpanded = expandedId === artifact.id;
            const color = artifact.color;
            return (
              <div
                key={artifact.id}
                onClick={() => setExpandedId(isExpanded ? null : artifact.id)}
                style={{
                  background: 'var(--bg2)',
                  border: `1px solid ${isExpanded ? color : 'var(--border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'border-color .15s, box-shadow .15s',
                  boxShadow: isExpanded ? `0 0 0 2px ${color}22` : 'none',
                  gridColumn: isExpanded ? 'span 2' : 'span 1',
                }}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span style={{
                      display: 'inline-block',
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color,
                      marginBottom: 4,
                    }}>
                      {artifact.category.replace('-', ' ')}
                    </span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.35 }}>
                      {artifact.title}
                    </p>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text3)', flexShrink: 0, marginTop: 2 }}>
                    {isExpanded ? '↑' : '↓'}
                  </span>
                </div>

                {/* Preview items (always show first 2) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {(isExpanded ? artifact.items : artifact.items.slice(0, 2)).map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color, flexShrink: 0, marginTop: 1, fontSize: 10, fontWeight: 700 }}>—</span>
                      <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                  {!isExpanded && artifact.items.length > 2 && (
                    <span style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                      +{artifact.items.length - 2} more · click to expand
                    </span>
                  )}
                </div>

                {/* Source footer */}
                {isExpanded && (
                  <div style={{
                    marginTop: 12,
                    paddingTop: 10,
                    borderTop: '1px solid var(--border)',
                    fontSize: 10,
                    color: 'var(--text3)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}>
                    {artifact.source}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer summary */}
        <div style={{
          marginTop: 32,
          padding: '14px 18px',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          fontSize: 11,
          color: 'var(--text3)',
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <span>● {ARTIFACTS.length} artifacts</span>
          <span>● 114 Granola sessions synthesized</span>
          <span>● Feb 23 – Mar 25, 2026</span>
          <span>● 5 products · 4 persona types · 7+ competitors</span>
          <span>● Last synced: Mar 25, 2026</span>
        </div>
      </div>
    </div>
  );
}
