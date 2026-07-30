// data/stakeholders.ts — internal stakeholder registry (v19.6).
// The corpus's four personas are research SUBJECTS (users). These are the
// decision-makers and domain voices INSIDE the product organization whose
// words drive the corpus. Curated identity + authority (each line traceable to
// corpus insights); membership is computed live by name-matching over insight
// text/source/quote — no hand-maintained counts.
import type { ProductId } from '../types';

export type StakeholderGroup = 'leadership' | 'product' | 'design-eng' | 'domain-sme';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  group: StakeholderGroup;
  /** Regex fragments (word-boundary wrapped at match time) that identify this
   * person in insight text / source / pullQuoteSource. */
  matchers: string[];
  /** Primary q= search term for the cross-reference link. */
  searchTerm: string;
  productIds: ProductId[];
  /** What they decide — evidenced in the corpus (see authorityRefs). */
  authority: string;
  authorityRefs: string[]; // insight ids backing the authority claim
  /** What their voice means for the product. */
  meansForProduct: string;
}

export const STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'aarti',
    name: 'Aarti',
    role: 'Executive sponsor (CEO)',
    group: 'leadership',
    matchers: ['aarti', 'arti'],
    searchTerm: 'Aarti',
    productIds: ['exam-management', 'course-eval', 'faas'],
    authority: 'Final sign-off gate. Stepped back from day-to-day Jul 6 — approvals now flow through PMs and Yash, with 6-week check-ins.',
    authorityRefs: ['ins-em-gap-32', 'ins-em-jun-05'],
    meansForProduct:
      'Her mandates are non-negotiables, not preferences: full accessibility scope from day one, offline exam download, red reserved for errors, 400% zoom. When a design conflicts with an Aarti mandate, the design changes.',
  },
  {
    id: 'arun',
    name: 'Arun',
    role: 'CTO · product vision',
    group: 'leadership',
    matchers: ['arun'],
    searchTerm: 'Arun',
    productIds: ['exam-management', 'faas', 'course-eval', 'skills-checklist', 'learning-contracts'],
    authority: 'Owns the 3-year competitive roadmap and every architecture mandate (optional foreign keys, backend constraints). Sets operating principles: speed as proxy for skill, consensus before escalation.',
    authorityRefs: ['ins-exam-arun-01', 'ins-em-gap-16', 'ins-arun-jul-02'],
    meansForProduct:
      'The AI design constraint comes from him: everywhere it helps, never in the way — admin side only, faculty time saved as the metric. Every AI feature is judged against his principle, not against competitors.',
  },
  {
    id: 'kunal',
    name: 'Kunal',
    role: 'COO · experience decisions',
    group: 'leadership',
    matchers: ['kunal'],
    searchTerm: 'Kunal',
    productIds: ['exam-management'],
    authority: 'COO-level UX rulings on the exam experience — submit-button visibility timing, QB filter behavior — recorded as decisions, not suggestions.',
    authorityRefs: ['ins-em-gap-07', 'ins-em-jun-03'],
    meansForProduct:
      'His decisions are safety framing: an accidental submission in a timed clinical exam is a student crisis, so visibility timing is policy, "not subject to redesign without explicit sign-off."',
  },
  {
    id: 'vishaka',
    name: 'Vishaka',
    role: 'Senior product authority',
    group: 'product',
    matchers: ['vishaka', 'vishakha'],
    searchTerm: 'Vishaka',
    productIds: ['exam-management', 'course-eval', 'skills-checklist'],
    authority: 'The daily decision-maker — Arun named her the day-to-day authority. QB access model, question versioning rule, categories-vs-tags naming, dashboard reviews all closed with her.',
    authorityRefs: ['ins-em-gap-13', 'ins-em-may-08', 'ins-em-gap-19'],
    meansForProduct:
      'Design reviews route through her first; her approval is the "aligned" gate in the decision pipeline. If a spec has not been through Vishaka, it is a proposal, not a plan.',
  },
  {
    id: 'nipun',
    name: 'Nipun',
    role: 'PM · Exam Management',
    group: 'product',
    matchers: ['nipun'],
    searchTerm: 'Nipun',
    productIds: ['exam-management'],
    authority: 'Proposes and specs — QB architecture sessions, two-tier navigation, Zendesk-style smart views. Junior PM per Arun: can spec, cannot make final product decisions.',
    authorityRefs: ['ins-em-gap-13', 'ins-em-gap-18', 'ia-arch-006'],
    meansForProduct:
      'The richest source of QB mental models (assessment-first landing, smart views, draft/private states). Treat his specs as strong hypotheses that still need the Vishaka gate.',
  },
  {
    id: 'vishal',
    name: 'Vishal',
    role: 'Senior PM · process',
    group: 'product',
    matchers: ['vishal'],
    searchTerm: 'Vishal',
    productIds: ['exam-management', 'course-eval'],
    authority: 'Joined ~Apr 20 to close the process gap: stakeholder alignment, approval cadence, scope discipline. Confirmed the combined step-1/2 survey flow and the course-landing simplification.',
    authorityRefs: ['ins-process-003', 'ins-ce-jun-06', 'ins-em-jun-01'],
    meansForProduct:
      'The structural answer to the rework pattern (designs overridden, dev idle). His cadence decisions determine when design work is safe to start.',
  },
  {
    id: 'monil',
    name: 'Monil',
    role: 'PM · Post-Course Evaluation',
    group: 'product',
    matchers: ['monil', 'mohil'],
    searchTerm: 'Monil',
    productIds: ['course-eval'],
    authority: 'Owns PCE: the 3-layer architecture (setup → distribution → analytics), the max-2-templates rule, the no-AI-branding differentiation strategy.',
    authorityRefs: ['ins-ce-monil-01', 'ins-ce-monil-02', 'pce-monil-002'],
    meansForProduct:
      '"The dashboard is the meat of the entire project" — his framing makes analytics the PCE demo hook and the build priority, not the survey builder.',
  },
  {
    id: 'akshit',
    name: 'Akshit',
    role: 'Platform owner · FaaS self-service',
    group: 'product',
    matchers: ['akshit'],
    searchTerm: 'Akshit',
    productIds: ['faas'],
    authority: 'Owns FaaS Q2/Q3 self-service rollout and holds the usage data: 80–85% incremental edits, 90% template starts, 2–3% from scratch.',
    authorityRefs: ['ins-faas-akshit-01', 'faas-q2-scope-001'],
    meansForProduct:
      'His numbers killed the blank-canvas entry point: template-first is a data-backed decision, and Phase 1 is deliberately designed for internal technical users, not university admins.',
  },
  {
    id: 'david',
    name: 'David',
    role: 'Clinical education SME (faculty voice)',
    group: 'domain-sme',
    matchers: ['david'],
    searchTerm: 'David',
    productIds: ['course-eval', 'exam-management'],
    authority: 'The domain conscience in the room — not a decision-maker, but the reality check: "this is very much a database feel", the Marquette didactic-questions pain, PCE evaluatee roles, template-builder usability findings.',
    authorityRefs: ['ins-em-gap-03', 'ins-ce-gap-25', 'ins-ce-jul28-02'],
    meansForProduct:
      'When David is confused in a role-play, real faculty will be too — his usability findings (default-toggle confusion, missed faculty-role step) convert directly into design changes before launch.',
  },
  {
    id: 'himanshu',
    name: 'Himanshu',
    role: 'Design system owner',
    group: 'design-eng',
    matchers: ['himanshu'],
    searchTerm: 'Himanshu',
    productIds: ['exam-management', 'course-eval', 'faas'],
    authority: 'Owns the design system (v0.28: 500% zoom, high contrast, AI agents) and its governance cadence; component gaps route through him.',
    authorityRefs: ['ins-ds-jun-01', 'ins-ds-himanshu-01'],
    meansForProduct:
      'The DS is collaborative, not mandated ("if you don\'t like it, don\'t use it" — Arun), so convergence with Himanshu is a relationship, and the ExamSoft-One control inventory (85 → 200) is the shared completeness metric.',
  },
  {
    id: 'darshan',
    name: 'Darshan',
    role: 'Lead engineer · React rebuild',
    group: 'design-eng',
    matchers: ['darshan'],
    searchTerm: 'Darshan',
    productIds: ['exam-management'],
    authority: 'Builds the current sprint; his DB-schema questions (course as optional FK) surface the architecture decisions leadership then rules on.',
    authorityRefs: ['ins-em-gap-16', 'em-standup-003'],
    meansForProduct:
      'Design must stay exactly one sprint ahead of him — when specs are late, six developers idle (the May 8 crisis). He is the deadline the design pipeline is measured against.',
  },
  {
    id: 'harsha',
    name: 'Harsha',
    role: 'FaaS compliance SME (internal ops)',
    group: 'domain-sme',
    matchers: ['harsha'],
    searchTerm: 'Harsha',
    productIds: ['faas'],
    authority: 'Runs the manual configuration layer the product should replace — hand-typed tags, no preview, three-system fragmentation. Named the headless-FaaS requirement.',
    authorityRefs: ['ins-faas-004', 'ins-faas-gap-20', 'ins-faas-gap-22'],
    meansForProduct:
      'His workflow IS the config-debt theme: every hour of his manual QA is a requirement the self-service product must absorb. The form simulator exists as a recommendation because of his 2–3-month error-discovery lag.',
  },
  {
    id: 'prasanjit',
    name: 'Prasanjit',
    role: 'Patient Log SME (internal ops)',
    group: 'domain-sme',
    matchers: ['prasanjit'],
    searchTerm: 'Prasanjit',
    productIds: ['faas'],
    authority: 'Owns patient-log domain knowledge: CRNA 4-level hierarchies, matrix time-pickers, the color-coding regression, per-discipline complexity tiers.',
    authorityRefs: ['ins-faas-pras-01', 'faas-pras-domain-001', 'pras-f005'],
    meansForProduct:
      'His complexity-tier map (PA simple → CRNA advanced) is the progressive-disclosure spec for FaaS: one engine, three experience tiers — and the restore-color-coding regression fix is on the decision board because of him.',
  },
  {
    id: 'pratiksha',
    name: 'Pratiksha',
    role: 'Site assessment SME (internal ops)',
    group: 'domain-sme',
    matchers: ['pratiksha'],
    searchTerm: 'Pratiksha',
    productIds: ['faas'],
    authority: 'Owns site-assessment configuration reality: the PDF-split accreditation blocker, low self-service adoption (Pendo-verified), the preceptor intake form.',
    authorityRefs: ['ins-faas-001', 'ins-faas-gap-02', 'ins-faas-gap-04'],
    meansForProduct:
      'Her adoption data reframes self-service: the front-end exists but clients still file tickets — so the design problem is trust and simplicity, not feature absence.',
  },
];

export const STAKEHOLDER_GROUP_META: Record<StakeholderGroup, { label: string; meaning: string }> = {
  leadership: { label: 'Leadership', meaning: 'Mandates and vision — their statements are constraints' },
  product: { label: 'Product', meaning: 'Specs, scope, and the approval pipeline' },
  'design-eng': { label: 'Design & Engineering', meaning: 'The build reality design must serve' },
  'domain-sme': { label: 'Domain SMEs', meaning: 'The ground truth — workflows and users as they actually are' },
};

const byId = new Map(STAKEHOLDERS.map((s) => [s.id, s]));
export const getStakeholder = (id: string) => byId.get(id);

/** Word-boundary matcher over an insight's text+source+quote haystack. */
export function stakeholderMatches(s: Stakeholder, hay: string): boolean {
  return s.matchers.some((m) => new RegExp(`\\b${m}\\b`, 'i').test(hay));
}
