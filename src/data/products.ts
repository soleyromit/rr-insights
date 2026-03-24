import type { ProductMeta } from '../types';

export const PRODUCTS: ProductMeta[] = [
  {
    id: 'exam-management', name: 'Exam Management', shortName: 'Exam',
    description: 'Clinical knowledge assessment platform. ExamSoft competitor with Canvas-level UX.',
    status: 'active', accentColor: '#6d5ed4', insightCount: 18, criticalGaps: 5,
    pilotDate: 'Apr 17, 2026', launchDate: 'Nov–Dec 2026', userCount: '170+ programs',
    primaryPersonas: ['student', 'dce', 'program-director'],
    priorityScore: 98, daysToDeadline: 25, urgencyLevel: 'fire', sentimentScore: 52, granolaSessions: 12,
    keyQuote: 'ExamSoft has comprehensive features but poor 20-year-old UX. Canvas has better UX but lacks proctoring.',
    keyQuoteSource: 'Exam platform strategy · Mar 4',
    hmwStatements: ['How might we make curriculum mapping so intuitive that faculty abandon their Excel sheets?','How might we give students with disabilities equitable exam experiences within LockDown browser?','How might we predict PANCE readiness before a student finishes their rotations?'],
    dayInLife: {
      student: 'Opens exam → accessibility features absent → workarounds break LockDown → emails faculty → loses time → score reflects barrier, not knowledge',
      dce: 'Opens ExamSoft → copies questions to second campus manually → sends via email → re-uploads with images → repeats for 3 campuses → 2 hours wasted',
      'program-director': 'Downloads PACKRAT CSV → uploads to Enflux manually → builds Excel predictive model → counsels at-risk students → does this for every cohort',
    },
    happyPath: 'Faculty assembles exam in 10 minutes using AI blueprint → students with any disability take it equitably → results feed to PANCE predictor → at-risk students flagged before rotations end',
    competitors: ['ExamSoft', 'D2L BrightSpace', 'Blackboard Ultra', 'Canvas', 'Moodle'],
    roadmapPhases: [
      { phase: 'Apr 17', items: ['Student experience demo', 'Admin question bank demo', 'Faculty interface', 'Basic accessibility'] },
      { phase: 'May', items: ['AI blueprint assembly', 'PANCE predictor V1', 'Multi-professor workflow'] },
      { phase: 'Aug', items: ['Cohere readiness', 'ExamSoft competitive feature set', 'AM team coordination'] },
      { phase: 'Nov–Dec', items: ['Full launch', 'First ExamSoft migration', 'AI remediation live'] },
    ],
    gapsByDiscipline: {
      dev: ['Multi-campus question bank synchronisation architecture','Lockdown browser accessibility API integration','CSV import pipeline from ExamSoft + PAEA','React migration from legacy stack'],
      ux: ['Progressive disclosure for power vs casual faculty','Accessibility feature discoverability within lockdown constraints','Question type mental model for clinical context'],
      ui: ['Assessment creation workflow too database-heavy — needs assessment-first framing','Question navigator IA incomplete','Dark/high contrast mode for accessibility not designed'],
      product: ['Scope decision: ExamSoft parity vs ExamSoft displacement','Proctoring vendor decision (Respondus integration) pending','Formula-based question types not in scope yet'],
    },
    newFeatureFramework: {
      aiOpportunities: [
        { feature: 'Blueprint-based question assembly', problem: 'Faculty spend hours manually selecting questions to meet NCCPA blueprint cells', status: 'May sprint' },
        { feature: 'PANCE readiness predictor', problem: 'Program directors cannot identify at-risk students before PANCE without building Excel models', status: 'May sprint' },
        { feature: 'Personalised remediation plan', problem: 'All students receive the same remediation handout regardless of individual EOR failures', status: 'Jul sprint' },
        { feature: 'AI question import from ExamSoft', problem: '10,000+ question migration is the primary switching cost barrier for ExamSoft clients', status: 'May sprint' },
      ],
      designSystemComponents: ['Question card (9 types)', 'Accessibility toolbar', 'Blueprint radar chart', 'Tag panel', 'Review workflow stepper', 'Score distribution chart'],
      microInteractions: ['Cross-out animation on MCQ elimination', 'Flag toggle with undo state', 'Zoom level transition (smooth, not jump)', 'TTS narrator start/stop with visual cue'],
    },
    amPmPipeline: {
      enhancementRequests: [
        { request: 'Multi-campus question sharing without email', requestedBy: 'Touro, Dr. Vicky Mody', priority: 'critical', sessions: 3 },
        { request: 'Formula-based question type with randomised variables', requestedBy: 'Dr. Vicky Mody (Blackboard comparison)', priority: 'high', sessions: 1 },
        { request: 'Bulk accommodation assignment at cohort level', requestedBy: 'D2L comparison — 70 manual setups flagged', priority: 'high', sessions: 1 },
        { request: 'PANCE readiness predictor dashboard', requestedBy: 'Ed Razenbach, PA programs', priority: 'high', sessions: 2 },
      ],
      pendingDecisions: ['React front-end confirmed — admin and student both migrating','Proctoring vendor: Respondus integration in Phase 1','AI features: architecture-ready in Phase 1, features-on in May sprint'],
    },
    productDependencies: [
      { product: 'faas', dependency: 'Survey distribution for post-exam feedback uses FaaS components' },
      { product: 'course-eval', dependency: 'Post-rotation course evaluation uses same question rendering engine' },
      { product: 'skills-checklist', dependency: 'Procedure minimum tracking shares patient log data layer' },
    ],
  },
  {
    id: 'faas', name: 'FaaS 2.0', shortName: 'FaaS',
    description: 'Forms as a Service — 17k configured forms, 95k annual support tickets, NPS 2/5.',
    status: 'wip', accentColor: '#dc2626', nps: 2, ticketsPerYear: 95000,
    insightCount: 10, criticalGaps: 6, userCount: '17,000 forms',
    primaryPersonas: ['dce', 'scce', 'program-director'],
    priorityScore: 91, daysToDeadline: 23, urgencyLevel: 'fire', sentimentScore: 35, granolaSessions: 9,
    keyQuote: 'We type the tags by hand. One spelling mistake and the entire form logic breaks. We find out in October when students start submitting.',
    keyQuoteSource: 'Harsha · FaaS compliance interview · Mar 20',
    hmwStatements: ['How might we make compliance form configuration so simple that coordinators never need to file a support ticket?','How might we let faculty preview a form before it reaches 200 students?','How might we unify three fragmented systems into one interface that feels like one product?'],
    dayInLife: {
      dce: 'Needs a compliance form → files support ticket → waits 3 days → support team types tags manually → one typo breaks the form → error discovered at accreditation review',
      scce: 'Logs in for the first time in 6 months → relearning the interface → cannot find what needs approval → calls the DCE → 3-day cycle for what should be 5 minutes',
      'program-director': 'Needs site assessment document for accreditors → FaaS covers only step 2 of a 3-step doc → manually assembles all three sections in Word',
    },
    happyPath: 'DCE builds compliance form in 10 minutes using validated dropdowns → previews in simulator → publishes → SCCE sees what needs attention on first login → approves in 4 minutes',
    competitors: ['SurveyMonkey', 'Typeform', 'Google Forms', 'Neovas', 'Smartsheet'],
    roadmapPhases: [
      { phase: 'Apr', items: ['Patient Log Mongo migration', 'April 15 compliance planning meeting', 'Preceptor intake form in FaaS'] },
      { phase: 'Q2–Q3', items: ['Close all capability gaps vs legacy', 'CAS compliance consolidation', 'Self-service config interface'] },
      { phase: 'Q4', items: ['AI approval automation (95% target)', 'Form simulator and preview', 'PDF unified site assessment doc'] },
    ],
    gapsByDiscipline: {
      dev: ['Mongo migration of 80,000+ Patient Log forms','CAS + ExactOne + FAST unification into single frontend','Workflow engine Q2-Q3 — currently absent for most modules'],
      ux: ['Approval reviewer surface redesign — primary SCCE daily surface','Form simulator / preview mode UX','Tag input validated dropdown vs free text','SCCE first-login experience — infrequent user pattern'],
      ui: ['Three UI styles across ExactOne, CAS, FAST need visual unification','Guidelines side-by-side with submission on approval screen','Mobile-optimised interface for SCCE clinical site use'],
      product: ['96,000 form update requests signal configuration self-service gap','Form type taxonomy unclear — 11 types with inconsistent naming','2-week client request to delivery pipeline must be eliminated'],
    },
    newFeatureFramework: {
      aiOpportunities: [
        { feature: 'AI approval automation', problem: '10% of approvals currently sampled manually — 95% automation target', status: 'Q4 2026' },
        { feature: 'Tag suggestion from form content', problem: 'Free-text tag entry causes thousands of typo-based errors annually', status: 'Q2-Q3 2026' },
        { feature: 'PDF document composition', problem: 'Accreditors need one unified site assessment doc — FaaS only generates step 2 of 3', status: 'Q4 2026' },
      ],
      designSystemComponents: ['Form builder drag-and-drop', 'Tag dropdown with validation', 'Form simulator canvas', 'Approval reviewer split-pane', 'Rule builder if/then UI'],
      microInteractions: ['Tag validation feedback (inline, not modal)', 'Drag-and-drop field reordering with ghost preview', 'Rule activation toggle with dependency highlight', 'Approval stamp animation'],
    },
    amPmPipeline: {
      enhancementRequests: [
        { request: 'Internal messaging on review/approve screens', requestedBy: 'Third client', priority: 'high', sessions: 3 },
        { request: 'Read-only access versions of all access levels', requestedBy: '2-3 clients specifically requested', priority: 'high', sessions: 2 },
        { request: 'Bulk student submission (1 form to 100 students)', requestedBy: 'Large program schools stepping back from platform', priority: 'critical', sessions: 5 },
        { request: 'Location groups in reports', requestedBy: 'Fifth client requesting this feature', priority: 'medium', sessions: 1 },
      ],
      pendingDecisions: ['Self-service vs support-team configuration — major architecture decision','CAS migration timeline — April 15 planning meeting with ASU team','Workflow engine scope for Q2-Q3'],
    },
    productDependencies: [
      { product: 'exam-management', dependency: 'Post-exam survey distribution reuses FaaS form rendering' },
      { product: 'course-eval', dependency: 'Course Eval module is built on FaaS components' },
      { product: 'skills-checklist', dependency: 'Skills evaluation forms use FaaS form rendering engine' },
      { product: 'learning-contracts', dependency: 'LC forms and preceptor intake forms use FaaS infrastructure' },
    ],
  },
  {
    id: 'course-eval', name: 'Course & Faculty Eval', shortName: 'Course Eval',
    description: 'Post-course survey and evaluation. Touro runs 7 survey types outside Exxat today.',
    status: 'active', accentColor: '#0d9488', insightCount: 4, criticalGaps: 2,
    primaryPersonas: ['dce', 'program-director'],
    priorityScore: 74, daysToDeadline: 40, urgencyLevel: 'warn', sentimentScore: 58, granolaSessions: 5,
    keyQuote: 'I paste all the open-ended responses into ChatGPT and ask it to extract themes. It saves hours and hours every cycle.',
    keyQuoteSource: 'Ed Razenbach · Feb 26',
    hmwStatements: ['How might we make accreditation survey reports so complete that program directors stop using SmartEval?','How might we bring all 7 survey types Touro runs externally into one platform?','How might we surface AI-generated themes from open-ended responses before a faculty meeting starts?'],
    dayInLife: {
      dce: 'Rotation ends → sends survey via Blue/Canvas → downloads CSV → pastes into ChatGPT → copies themes → manually maps to ARC-PA standards → builds Word report',
      'program-director': 'Receives 7 separate survey exports from 7 different tools → manually compiles into one self-study narrative → 20+ hours per accreditation cycle',
    },
    happyPath: 'Survey closes → AI extracts themes with accreditation standard mapping → report generated in 2 clicks → historical comparison visible on one dashboard',
    competitors: ['SmartEval', 'Qualtrics', 'Blue', 'Canvas', 'Microsoft Forms'],
    roadmapPhases: [
      { phase: 'Apr Workshop', items: ['Full module scope design', 'Hybrid form design', 'Touro survey type coverage analysis'] },
      { phase: 'Q2–Q3', items: ['Module build using FaaS components', 'Response rate tracking', 'Historical comparison'] },
      { phase: 'Q4', items: ['AI theme extraction', 'AI narrative synthesis for self-study', 'ARC-PA report automation'] },
    ],
    gapsByDiscipline: {
      dev: ['Course Eval module to be built on FaaS — architecture coupling decision','Anonymous survey enforcement at data layer','Hybrid form data model'],
      ux: ['Survey timing logic — open after course end, close before grades published','Faculty evaluation anonymity UX','Historical comparison and trending view'],
      ui: ['Competency mapping interface for survey questions','Response rate tracking dashboard','AI theme extraction results presentation'],
      product: ['Which of the 7 Touro survey types to build first','SmartEval feature parity definition','Standalone product pricing vs module pricing ($5K standalone vendors exist)'],
    },
    newFeatureFramework: {
      aiOpportunities: [
        { feature: 'AI theme extraction from open-ended responses', problem: 'Program directors paste comments into ChatGPT every evaluation cycle', status: 'Q4 2026' },
        { feature: 'AI narrative synthesis for self-study', problem: 'ARC-PA self-study requires narrative analysis — currently manual and takes days', status: 'Q4 2026' },
      ],
      designSystemComponents: ['Survey form (inherits FaaS)', 'Response rate bar with threshold indicator', 'Theme cluster card', 'Historical trend sparkline', 'Accreditation mapping tag'],
      microInteractions: ['Anonymous indicator (clear but unobtrusive)', 'Response count live update', 'Theme confidence score tooltip'],
    },
    amPmPipeline: {
      enhancementRequests: [
        { request: 'Course evaluation module to replace SmartEval', requestedBy: 'Ed Razenbach, Touro', priority: 'critical', sessions: 2 },
        { request: 'Anonymous survey with bulk distribution', requestedBy: 'Multiple PA programs', priority: 'high', sessions: 3 },
        { request: 'AI theme extraction from open-ends', requestedBy: 'Ed Razenbach explicitly', priority: 'high', sessions: 2 },
      ],
      pendingDecisions: ['April workshop scope — what exactly the Course Eval module covers','FaaS-embedded vs standalone module architecture'],
    },
    productDependencies: [
      { product: 'faas', dependency: 'Built entirely on FaaS form rendering and distribution components' },
      { product: 'exam-management', dependency: 'Post-exam feedback surveys share the same student evaluation lifecycle' },
    ],
  },
  {
    id: 'skills-checklist', name: 'Skills Checklist', shortName: 'Skills',
    description: 'Clinical competency tracking — 80–90% of students build external tracking docs today.',
    status: 'scoped', accentColor: '#b45309', insightCount: 4, criticalGaps: 3,
    launchDate: 'Jan 1, 2027', primaryPersonas: ['student', 'scce'],
    priorityScore: 68, daysToDeadline: 284, urgencyLevel: 'ok', sentimentScore: 45, granolaSessions: 6,
    keyQuote: 'Have I done this skill across all rotations? That question is completely unanswerable in the current system.',
    keyQuoteSource: 'Day 4 Marriott · Mar 5',
    hmwStatements: ['How might we give students a living portfolio of clinical competencies that travels across every rotation?','How might we let program directors see at a glance which students are at risk of missing ARC-PA minimums?','How might we make skill evaluation as simple as a student tapping a button after a procedure?'],
    dayInLife: {
      student: 'Completes procedure → needs preceptor sign-off → paper passport not available → writes it in personal Excel → forgets to transfer → graduation readiness check fails',
      'program-director': '"Just show me the reds" → system cannot filter deficient students → exports full CSV → manually highlights → 3 hours every rotation cycle',
    },
    happyPath: 'Student performs procedure → taps skill in mobile app → sign-off request sent → preceptor approves in 2 minutes → program director sees real-time deficiency map',
    competitors: ['Typhon', 'CompetencyAI', 'Excel/Google Sheets', 'eValue', 'CORE'],
    roadmapPhases: [
      { phase: 'Q2 2026', items: ['Requirements across 20+ disciplines', 'Detailed prototyping all personas', 'Technical architecture'] },
      { phase: 'Q3 2026', items: ['Core system development', 'Student and faculty interfaces', 'Integration with competency tracker'] },
      { phase: 'Q4 + Jan 2027', items: ['AI insights and automation', 'Mobile optimization', 'Production launch Jan 1'] },
    ],
    gapsByDiscipline: {
      dev: ['Standalone entity architecture — not placement-scoped','Cross-placement aggregation queries (performance risk at 1000+ students)','Mobile-first API design for clinical site use'],
      ux: ['Skill tree navigation (100+ skills in dropdown = unusable)','"Show me the reds" as default filter for program directors','Student self-initiation flow for evaluation requests','Batch evaluation for nursing (rows = students, columns = skills)'],
      ui: ['Progress visualisation that works on mobile at clinical sites','Skill hierarchy tree component','Domain-specific terminology: Skills Tracking for nursing, Clinical Passport for PA'],
      product: ['Discipline-specific vs unified architecture decision','Typhon / CompetencyAI competitive feature analysis needed','Skills vs competencies distinction by educational level'],
    },
    newFeatureFramework: {
      aiOpportunities: [
        { feature: 'PDF upload to skill hierarchy auto-generation', problem: 'Programs have existing skills checklists as PDFs — manual data entry to create system hierarchy', status: 'Q4 2026' },
        { feature: 'Smart evaluation scheduling', problem: 'Evaluation requests sent at wrong time — not triggered by relevant clinical encounters', status: 'Q4 2026' },
        { feature: 'Graduation readiness predictor', problem: 'Program directors cannot see which students are at risk of missing minimums until it is too late', status: 'Q4 2026' },
      ],
      designSystemComponents: ['Skill tree navigator', 'Procedure minimum progress ring', 'Deficiency filter panel', 'Evaluation request card', 'Multi-student batch grid (nursing)', 'Mobile sign-off screen'],
      microInteractions: ['Skill completion checkmark (satisfying — this is a high-stakes moment)', 'Red deficiency indicator that draws the eye', 'Pull-to-refresh for pending sign-offs'],
    },
    amPmPipeline: {
      enhancementRequests: [
        { request: 'Cross-rotation skill tracking — aggregate view', requestedBy: 'Multiple PA, PT, nursing programs', priority: 'critical', sessions: 6 },
        { request: 'Procedure minimum counter with deficiency filter', requestedBy: 'Dr. T, Touro PA program', priority: 'critical', sessions: 2 },
        { request: 'Student-initiated evaluation request', requestedBy: 'PA programs (USC passport model)', priority: 'high', sessions: 3 },
      ],
      pendingDecisions: ['Cohere August — working prototype needed for conference demo','Typhon / CompetencyAI competitive analysis before prototyping','20+ program interviews needed in Q2 before architecture is finalised'],
    },
    productDependencies: [
      { product: 'faas', dependency: 'Skill evaluation forms use FaaS rendering engine' },
      { product: 'learning-contracts', dependency: 'Social work competencies reference learning contract objectives' },
      { product: 'exam-management', dependency: 'Procedure minimum data layer shares patient log architecture' },
    ],
  },
  {
    id: 'learning-contracts', name: 'Learning Contracts', shortName: 'LC',
    description: 'Placement learning objectives — multi-site social work placements unsupported.',
    status: 'scoped', accentColor: '#db2777', insightCount: 2, criticalGaps: 2,
    primaryPersonas: ['student', 'scce'],
    priorityScore: 52, daysToDeadline: null, urgencyLevel: 'ok', sentimentScore: 40, granolaSessions: 3,
    keyQuote: 'We tried to merge learning contracts with evaluations before. It failed. They need to be separate but connected.',
    keyQuoteSource: 'Romit<>Vaibhav FaaS Review · Feb 27',
    hmwStatements: ['How might we create a learning contract that survives preceptor changes mid-placement?','How might we connect what a student committed to learning with how they are actually evaluated?'],
    dayInLife: {
      student: 'Starts 6-month social work placement → learning contract tied to specific placement record → preceptor changes at month 3 → contract breaks → student and new preceptor start from scratch',
      scce: 'Evaluates student at midterm → learning contract is in a separate PDF → cannot see what student committed to → evaluation disconnected from learning goals',
    },
    happyPath: 'Student creates learning contract at program level → survives across all placements → midterm evaluation shows contract goals alongside rating scales → preceptor change does not break continuity',
    competitors: ['eValue', 'Typhon', 'Excel', 'Watermark'],
    roadmapPhases: [
      { phase: 'Current', items: ['Architecture design for multi-semester scope', 'Social work LC-evaluation integration spec'] },
      { phase: 'Q2–Q3', items: ['Preceptor change mid-placement workflow', 'Role-based access design'] },
      { phase: 'Q4', items: ['Auto-benchmark objectives to accreditor standards', 'LC-skills checklist data bridge'] },
    ],
    gapsByDiscipline: {
      dev: ['Program-level entity decoupled from placement records','Preceptor change workflow without breaking contract continuity','Multi-semester, multi-site scope support'],
      ux: ['LC planning view integrated with evaluation view (not separate)','Preceptor handoff flow — who sees what, what transfers','Role-based editing: student initiates, preceptor and faculty approve'],
      ui: ['Social work nine-competency structure display','Side-by-side learning goals + evaluation ratings view','Contract version history and modification tracking'],
      product: ['LC scope: social work first vs all disciplines simultaneously','Separation from FaaS forms vs LC as a FaaS form type'],
    },
    newFeatureFramework: {
      aiOpportunities: [
        { feature: 'Auto-benchmark objectives to accreditor standards', problem: 'Students write vague learning goals that do not map to CSWE or ARC-PA competencies', status: 'Q4 2026' },
      ],
      designSystemComponents: ['LC planning canvas', 'Competency objective card', 'Approval workflow stepper', 'Side-by-side eval + contract view'],
      microInteractions: ['Goal completion checkmark linked to evaluation rating', 'Contract version diff view on modification'],
    },
    amPmPipeline: {
      enhancementRequests: [
        { request: 'Multi-semester LC that survives preceptor changes', requestedBy: 'Social work programs', priority: 'critical', sessions: 2 },
        { request: 'LC and evaluation side-by-side view', requestedBy: 'DCE feedback across multiple sessions', priority: 'high', sessions: 3 },
      ],
      pendingDecisions: ['Social work first or all disciplines','FaaS-embedded vs standalone LC architecture'],
    },
    productDependencies: [
      { product: 'faas', dependency: 'LC forms use FaaS form rendering infrastructure' },
      { product: 'skills-checklist', dependency: 'Social work competency LC maps directly to skills evaluation' },
    ],
  },
];

export const getProduct = (id: string) => PRODUCTS.find(p => p.id === id);
export const getProductsByUrgency = () => [...PRODUCTS].sort((a, b) => b.priorityScore - a.priorityScore);
