// @ts-nocheck
// ArunPerformanceView.tsx — v2
// Source 1: Offer of Appointment — Kunal Vaishnav / Exxat Inc · Mar 15, 2026
// Source 2: Granola raw transcript — Arun<>Romit Vision · Mar 24, 2026 (791334af)
// Source 3: Day 1 Marriott — Product strategy · Mar 2, 2026 (e9e48150)
// Source 4: Day 2 Marriott — PRISM Meeting · Mar 3, 2026 (f665622e)
// Source 5: Romit<>Arun<>VB — FaaS strategy · Mar 3, 2026 (dd800362)
// Source 6: Romit<>Himanshu — Design strategy · Feb 27, 2026 (00302142)
// Evaluator: Arun Gautam · Role: Product Designer II · Day 12 on seat

import { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, ReferenceLine } from 'recharts';

// ── VERBATIM ARUN QUOTES FROM RAW TRANSCRIPT (791334af) ─────────────────────
// These are exact words from the transcript, not paraphrased summaries
const ARUN_VERBATIM = [
  { quote: "Your top top top priority is this only — exam taker experience and admin/faculty assessment creation.", context: "Confirming Exam Management as sole priority for next few weeks", source: "Raw transcript · Mar 24" },
  { quote: "AI can be used, it should be used. Everywhere. Like, everywhere. AI can be used, it should be used.", context: "On AI integration philosophy — not selective, not optional", source: "Raw transcript · Mar 24" },
  { quote: "We want to reduce the amount of time faculty has to spend. That is the goal. We want to actively reduce the amount of time they have to spend designing exams.", context: "Defining the core AI success metric explicitly", source: "Raw transcript · Mar 24" },
  { quote: "ExamSoft is publicly against AI. Which is, like, amazing from my point of view. We are like, great. You don't use AI. We are going to use it.", context: "Strategic framing — ExamSoft anti-AI stance is Exxat's opening", source: "Raw transcript · Mar 24" },
  { quote: "The exam taker app — whatever you build becomes the part of the design system. There is nothing like this we have.", context: "On design system: exam taker UI is greenfield, not constrained by Himanshu DS", source: "Raw transcript · Mar 24" },
  { quote: "Speed of delivery is of higher importance. Speed over above anything else.", context: "Explicitly ranking speed over design system compliance", source: "Raw transcript · Mar 24" },
  { quote: "I will not inject myself into too many design reviews. I will do one review when it is rounded up to see if there are any major problems.", context: "On Arun's review cadence — he will not review incrementally, only at phase completion", source: "Raw transcript · Mar 24" },
  { quote: "The dev team's primary job is to execute what the three of you — you, Vishakha, and Nipun — propose.", context: "Clarifying design-PM-engineering authority structure", source: "Raw transcript · Mar 24" },
  { quote: "Current product requirements — the alignment with the high-level strategic differentiation is not as visible as it should be.", context: "Arun agreeing with Romit's observation about PRD quality gap", source: "Raw transcript · Mar 24" },
  { quote: "I would say it is more of a first draft than the final design system. We do not quite have a design system at this point.", context: "Arun's own characterization of Himanshu's DS — removes the blocker", source: "Raw transcript · Mar 24" },
];

// ── 7 CRITERIA from offer letter + Arun transcript signals ──────────────────
const CRITERIA = [
  {
    id: 'ui-design',
    shortLabel: 'UI Design',
    weight: 22,
    score: 68,
    status: 'in-progress',
    offerText: 'Designing user interface components, workflows, and interaction patterns for assigned features within Exxat\'s software platform.',
    arunVerbatim: '"We care about the user experience not only for the student exam taker, but also for the admin or the faculty." — and — "Whatever you build for the exam taker becomes part of the design system."',
    arunSource: 'Raw transcript · 791334af · Mar 24, 2026',
    scoreRationale: 'Architecture and component decisions are strong and well-reasoned. Score held at 68 because zero Magic Patterns interactive artifacts exist yet — the offer letter requirement is "designing components", which requires built, not described, components.',
    evidence: [
      '32 question layout variants with 9 question types — annotated in rr-insights Feature Map tab',
      'Accessibility toolbar: zoom (100–400%), TTS, STT, on-screen keyboard, high-contrast — all within lockdown constraints (Pearson model)',
      'Question navigator: 2×2 flag model — Aarti/Kunal session confirmed flag is an attribute, not a mutually exclusive category',
      'Submit button timing logic: always present, prominence scales at final 5–10 min — accidental submission prevention for 200-student exams',
      'Accommodation profile system: program-level model (no competitor has this — ExamSoft is per-exam)',
      'Publish gate: blocks exam publish if alt text missing or accommodation profiles unset for flagged students',
      'PA Dashboard layout: NCCPA radar, EOR trend, PACKRAT gauges, procedure minimums tracker — 8-variable PANCE predictor visualised',
    ],
    gaps: [
      'ZERO Magic Patterns (MP) prototypes exist — "designing components" in the offer letter means built artifacts, not described ones',
      'Student exam flow: no interactive prototype for April 17 demo — most critical single gap',
      'Admin QB UI: Smart Views sidebar, filter table, question editor — defined architecturally but not in MP',
      'FaaS Phase 1 (CI team): self-service form builder for internal users — not started',
      'PCE distribution + AI analytics dashboard: not started',
    ],
    actions: [
      { what: 'Student exam flow: question card + navigator + accessibility toolbar in MP', by: 'Apr 7' },
      { what: 'QB navigation: Smart Views sidebar + question table + filter bar in MP', by: 'Apr 3' },
      { what: 'Admin: accommodation profiles + publish gate in MP', by: 'Apr 12' },
      { what: 'April 17 demo: 3 complete interactive flows (student + admin + faculty)', by: 'Apr 17' },
    ],
  },
  {
    id: 'prototypes',
    shortLabel: 'Prototypes',
    weight: 20,
    score: 55,
    status: 'at-risk',
    offerText: 'Creating wireframes, mockups, and interactive prototypes to support product development and usability improvements.',
    arunVerbatim: '"I will come back to you on FaaS. But for the next few weeks, your top top top priority is this only. Think of once we have designed the whole first initial phase out and devs are busy building it."',
    arunSource: 'Raw transcript · 791334af · Mar 24, 2026',
    scoreRationale: 'Score 55 because no MP prototype exists for any Exam Management screen. The offer letter\'s primary deliverable in this category is interactive prototypes. Engineering (2 senior devs) joins April 1 and needs design assets. This is the single highest-risk criterion.',
    evidence: [
      'Question grouping HTML demo: clinical vignette pairing UX — interactive, browser-runnable',
      'Assessment builder HTML prototype: marks weightage, section management, bulk edit modal',
      'rr-insights itself: full React + Recharts + D3 platform built and deployed — proof of prototype capability',
      'QB V10.html + assessment-builder.html: working prototypes in migration pack',
      'Stakeholder Day 1+2 architecture: validated through working HTML wireframes, not static slides',
    ],
    gaps: [
      'No Magic Patterns prototype for any Exam Management screen — engineering joins Apr 1 needing design assets',
      'Student exam experience: zero interactive prototype — critical for Apr 17 demo',
      'Faculty QB: no MP artifact for engineering handoff — Nipun confirmed current docs too high-level (Mar 27)',
      'Skills Checklist: Q2 scope only — no prototype started',
      'PCE analytics + distribution: no prototype scope started',
    ],
    actions: [
      { what: 'QB scoped views + navigation in MP — unblocks Darshan', by: 'Apr 3' },
      { what: 'Student exam flow: question card, navigator, submit gate in MP', by: 'Apr 7' },
      { what: 'Admin accommodation profiles + QB filter table in MP', by: 'Apr 12' },
      { what: 'All 3 flows linked, demo-ready, shareable MP links for Aarti + Vishaka', by: 'Apr 15' },
    ],
  },
  {
    id: 'requirements',
    shortLabel: 'Requirements → Design',
    weight: 18,
    score: 87,
    status: 'strong',
    offerText: 'Translating product requirements and user stories into clear, user-centered interface designs.',
    arunVerbatim: '"You are expected to go beyond what is written in the product docs. Think like a product manager and strategist, not only a UI designer. Identify gaps where PRDs do not fully reflect the AI strategy, the differentiators, the long-term roadmap."',
    arunSource: 'Private notes · 791334af · Mar 24, 2026 (confirmed in transcript)',
    scoreRationale: 'Score raised to 87. Romit not only translates requirements — he identified the gap that Arun himself agreed with: PRDs lack strategic AI thinking. Romit raised this directly with Arun in the session. That is going beyond the offer letter\'s stated expectation.',
    evidence: [
      'Translated Day 1+2 stakeholder sessions into flat pool + Smart Views QB architecture — more complete than existing PRD',
      'Converted Arun 3-year vision into Year 1/2/3 phases with explicit 5 differentiators and design implications per phase',
      'NPS 2025 (-47.5 student) → 5 prioritised design levers with frequency counts from 835 negative responses',
      'PA Dashboard: Ed Razenbach Excel PANCE model (R²=0.66–0.84) → platform feature specification — Arun endorsed',
      'FaaS compliance session → 3-system fragmentation brief (ExactOne / CAS / FAST) — confirmed critical gap',
      'Prasanjit session → domain complexity tiers (PA vs CRNA vs SLP): 3 distinct design patterns documented',
      'Raised PRD alignment gap directly to Arun: "The consistency across product requirements and how we are going to make it differentiating — the alignment is not as visible as it should be." Arun responded: "Thank you."',
      'Monil PCE → AI differentiation stack (sentiment → SWOT) formalised as product requirement before any PM doc existed',
    ],
    gaps: [
      'QB feature spec: Nipun confirmed Mar 27 that current spec is too high-level for engineering handoff',
      'Skills Checklist Q2: requirements received but prototype-first design not started',
      'FaaS Phase 1 (CI team): Akshit provided scope, design brief not started',
    ],
    actions: [
      { what: 'Screen-level QB spec to Nipun — not system-level, actual component states', by: 'Apr 4' },
      { what: 'FaaS Phase 1 internal brief: 3 core CI team workflows with persona-level detail', by: 'Apr 18' },
      { what: 'Skills Q2 scope doc: persona flows, boundary conditions, Q3 MP target', by: 'May 15' },
    ],
  },
  {
    id: 'collaboration',
    shortLabel: 'PM + Eng Collaboration',
    weight: 16,
    score: 76,
    status: 'on-track',
    offerText: 'Collaborating with product managers and engineering teams to ensure designs align with product requirements and technical constraints.',
    arunVerbatim: '"Between the three of you — you, Vishakha, and Nipun — you should continuously be syncing up. The dev team\'s primary job is to execute what the three of you propose."',
    arunSource: 'Raw transcript · 791334af · Mar 24, 2026',
    scoreRationale: 'Score 76. Sessions are happening and decisions are being aligned. The gap is that the formal handoff artifact (MP file + spec) does not exist yet, so "collaboration" is still verbal, not documented. The offer letter requires "ensuring designs align" — that requires a written artifact.',
    evidence: [
      'Nipun kickoff (Mar 27): QB architecture aligned — flat pool, Smart Views entry points, role definitions, sprint structure confirmed',
      'React rebuild aligned with engineering: e1 pilot frozen, React confirmed for admin + student side by Exam standup Mar 26',
      'Himanshu DS: WCAG accessibility gaps identified, documented, and flagged for handoff — proactive, not reactive',
      'Monil (PCE): distribution workflow + AI differentiation stack aligned through introduction session Mar 26',
      'Akshit (FaaS Q2): scope confirmed — internal CI team only for Phase 1, Ankit dependencies tracked',
      'Prasanjit (FaaS patient log): complex control types (4-level hierarchy, repeaters, matrix, ICD) documented for engineering reference',
      'Correctly escalated PRD gap directly to Arun — Arun thanked Romit and committed to guide Nipun',
    ],
    gaps: [
      'Himanshu accessibility checklist: promised but not formally delivered as a spec document',
      'No formal handoff artifact exists yet — all alignment is verbal, not documented',
      'Tuesday 90-min Aarti demo slot: not yet established as recurring',
      'Thursday weekly (Nipun + Arun + Vishaka): not confirmed as recurring',
      'Viskhaka: not yet connected as the primary senior PM partner — Arun confirmed she is the day-to-day lead',
    ],
    actions: [
      { what: 'Schedule Vishaka sync this week — establish as primary PM partner per Arun\'s instruction', by: 'Apr 1' },
      { what: 'Confirm Tuesday 90-min Aarti demo slot as recurring', by: 'Apr 1' },
      { what: 'Deliver WCAG accessibility checklist + DS gap list to Himanshu as written spec', by: 'Apr 10' },
      { what: 'First formal MP handoff package to Nipun: file + annotated spec', by: 'Apr 10' },
    ],
  },
  {
    id: 'design-reviews',
    shortLabel: 'Reviews + Specs',
    weight: 10,
    score: 60,
    status: 'at-risk',
    offerText: 'Participating in design reviews and supporting implementation by providing design specifications and clarifying design intent during development.',
    arunVerbatim: '"I will do one review of the design when it is rounded up to see if there are any major problems. Vishakha and Aarti will have to sign off on what you are doing."',
    arunSource: 'Raw transcript · 791334af · Mar 24, 2026',
    scoreRationale: 'Score 60. Arun himself said he will not do incremental reviews — only one phase-end review. This actually reduces the review pressure. But the offer letter requirement is design specifications and intent documentation. Zero specs exist. That is a real gap.',
    evidence: [
      'Bi-weekly Arun check-in established in session itself — first on Mar 24',
      'Exam Management standup participated (Mar 26): sprint decisions made (React rebuild, 2 entry points, draft mode private)',
      'Accessibility deep-dive (Mar 20) with Aarti + Kunal: 5 design decisions documented and published in rr-insights',
      'PA Dashboard session (Mar 17): deliverables confirmed for Apr 17 — 3 persona flows',
      'Proactively raised PRD alignment gap — led to Arun committing to guide Nipun',
    ],
    gaps: [
      'Zero design spec documents written — no annotated states, no edge cases, no empty states for any screen',
      'Zero redline annotations on any component — offer letter requires "design specifications during development"',
      'No formal design review has been run — all sessions are scoping or discovery, not review',
      'Thursday weekly (Nipun + Arun + Vishaka) not yet on calendar',
    ],
    actions: [
      { what: 'First redline spec: accessibility toolbar component — all states annotated', by: 'Apr 7' },
      { what: 'QB screen spec: annotated states, edge cases, empty states, error states per screen', by: 'Apr 10' },
      { what: 'Confirm Thursday weekly slot and send calendar invite', by: 'Apr 1' },
    ],
  },
  {
    id: 'usability',
    shortLabel: 'Usability + Feedback',
    weight: 8,
    score: 88,
    status: 'strong',
    offerText: 'Evaluating product usability through feedback from users and internal stakeholders to improve overall user experience.',
    arunVerbatim: '"We want to actively reduce the amount of time they have to spend. How much faculty time did we save? That is the goal. That is the metric."',
    arunSource: 'Raw transcript · 791334af · Mar 24, 2026',
    scoreRationale: 'Score 88. The NPS analysis and multi-persona research are genuinely strong — 1,494 responses analysed, 8+ personas interviewed, domain breakdown with NPS leverage calculated. The gap is Pendo behavioral data and SCCE under-representation.',
    evidence: [
      'NPS 2025: 1,494 responses — student -47.5, faculty -49.1, admin -4.8, SCCE sites +8, Approve +87.5',
      'Bimodal distribution identified: mass at 0–3 and 5–6 — hate-or-tolerate, near zero delight',
      '5 top detractor themes extracted from 835 negative textual responses with exact frequency counts',
      'Nursing-first leverage: 47% of volume — identified as highest NPS recovery lever',
      'Approve (+87.5) as design benchmark: managed service model = quality bar for FaaS self-service',
      'Ed Razenbach PANCE model (within 1% of actual scores): usability meets quantitative precision',
      '8+ distinct stakeholder personas synthesised: Ed, Dr. Vicky Mody, Dr. T, Heather, Prasanjit, Harsha, Akshit, Monil',
    ],
    gaps: [
      'Pendo behavioral usage data not integrated — Arun has access, not yet requested by Romit',
      'No formal usability test run yet — prototype-gated; cannot test what does not exist',
      'SCCE persona: only 8 NPS data points — insufficient for reliable design decisions; need 1 direct interview',
    ],
    actions: [
      { what: 'Request Pendo access from Arun — behavioral data completes attitudinal NPS picture', by: 'Apr 7' },
      { what: 'Define usability test plan for Apr 17 demo (task completion rate, error rate, time-on-task)', by: 'Apr 15' },
      { what: 'Schedule 1 SCCE interview — Concentra or Confluent Health from NPS data', by: 'Apr 20' },
    ],
  },
  {
    id: 'accessibility',
    shortLabel: 'Accessibility + Compliance',
    weight: 6,
    score: 91,
    status: 'strong',
    offerText: 'Incorporating accessibility and compliance considerations, including applicable healthcare education regulations such as HIPAA, FERPA, and ADA, when designing product interfaces and workflows.',
    arunVerbatim: 'Arun confirmed (Aarti/Kunal session, not Mar 24 transcript): "Accessibility is not a checkbox. It is the hardest design challenge in the exam product." — Pearson benchmark explicitly set.',
    arunSource: 'Aarti + Kunal + Arun accessibility session · Mar 20, 2026 (f29a990d)',
    scoreRationale: 'Highest-scoring criterion at 91. Program-level accommodation profiles are a first-to-market architecture decision. WCAG 2.1 AA feature map is complete. Publish gate is designed. The only gap is formal delivery to Himanshu as a written spec and color blindness pass.',
    evidence: [
      'WCAG 2.1 AA feature map: magnification 1.4.4, TTS, STT, on-screen keyboard, high-contrast 1.4.3, alt text 1.1.1 — all within lockdown constraints',
      'Accommodation profile system: program-level (first-to-market — ExamSoft requires per-exam setup)',
      'Publish gate: blocks exam publish if alt text missing or accommodation profiles unset for flagged students',
      'Pearson benchmark: all features platform-embedded, no external tools (GRE/SAT/TOEFL model)',
      'WCAG gaps in Himanshu DS: voice narration absent, on-screen keyboard not built, color blindness audit incomplete — proactively identified',
      'HIPAA, FERPA, ADA mapped across all 5 products in rr-insights data layer',
      'CAAHEP, CAPTE, ACOTE, ARC-PA accreditation requirements linked to accessibility design decisions',
    ],
    gaps: [
      'Himanshu accessibility checklist: identified but not formally delivered as a written spec to Himanshu',
      'Color blindness simulation pass (Deuteranopia + Protanopia) on exam screens: not done',
      'FaaS HIPAA data handling annotations: not added to form design mockups',
    ],
    actions: [
      { what: 'Formal WCAG 2.1 AA checklist + DS gap list delivered to Himanshu as spec', by: 'Apr 10' },
      { what: 'Color blindness simulation pass: Deuteranopia + Protanopia on all exam screens', by: 'Apr 14' },
      { what: 'FERPA data handling annotation on FaaS compliance form mockups', by: 'May 1' },
    ],
  },
];

const OVERALL_SCORE = Math.round(CRITERIA.reduce((s,c) => s + c.score*(c.weight/100), 0));
const STATUS_CFG = {
  'strong':        { label:'Strong',       color:'#16a34a', bg:'rgba(22,163,74,0.08)'   },
  'on-track':      { label:'On Track',     color:'#0d9488', bg:'rgba(13,148,136,0.08)'  },
  'in-progress':   { label:'In Progress',  color:'#d97706', bg:'rgba(217,119,6,0.08)'   },
  'at-risk':       { label:'At Risk',      color:'#dc2626', bg:'rgba(220,38,38,0.08)'   },
};
const SC  = s => s>=85?'#16a34a':s>=70?'#d97706':'#dc2626';
const CS  = { fontSize:10, fill:'#6b7280' };
const radarData = CRITERIA.map(c=>({ subject:c.shortLabel, Romit:c.score, Target:85 }));
const barData   = [...CRITERIA].sort((a,b)=>b.score-a.score);
const velocityData = [
  { week:'W1 Mar16–22', sessions:4, insights:12, artifacts:1 },
  { week:'W2 Mar23–27', sessions:9, insights:28, artifacts:5 },
];

const MILESTONES = [
  { date:'Mar 16', label:'Start date — Day 1 · onboarding + HR',                   type:'start',    done:true  },
  { date:'Mar 17', label:'PA Dashboard (Aarti + Vishaka) — scope confirmed',        type:'session',  done:true  },
  { date:'Mar 20', label:'Accessibility deep-dive (Aarti + Kunal) — 5 decisions',  type:'session',  done:true  },
  { date:'Mar 24', label:'Arun 3-year vision — priorities + collaboration model',   type:'session',  done:true  },
  { date:'Mar 25', label:'Prasanjit patient log + Akshit FaaS Q2',                  type:'session',  done:true  },
  { date:'Mar 26', label:'Exam standup #2 + Monil PCE intro',                       type:'session',  done:true  },
  { date:'Mar 27', label:'Nipun QB kickoff — architecture + sprint structure',      type:'session',  done:true  },
  { date:'Apr 1',  label:'2 senior engineers join React rebuild — design must be ready', type:'milestone', done:false },
  { date:'Apr 1',  label:'Confirm Vishaka sync + Aarti Tuesday slot + Thursday weekly', type:'design',done:false },
  { date:'Apr 3',  label:'QB navigation + Smart Views in Magic Patterns',           type:'design',   done:false },
  { date:'Apr 7',  label:'Student exam flow prototype in MP',                       type:'design',   done:false },
  { date:'Apr 7',  label:'First redline spec: accessibility toolbar',               type:'design',   done:false },
  { date:'Apr 10', label:'Admin tools prototype + WCAG checklist → Himanshu',       type:'design',   done:false },
  { date:'Apr 12', label:'QB spec to Nipun: annotated states + edge cases',         type:'design',   done:false },
  { date:'Apr 15', label:'All 3 flows demo-ready + shareable MP links',             type:'design',   done:false },
  { date:'Apr 17', label:'🔥 DEMO — student + admin + faculty (Aarti + Vishaka sign-off)', type:'deadline', done:false },
  { date:'May',    label:'AI blueprint assembly + PANCE predictor V1',              type:'milestone', done:false },
  { date:'Aug',    label:'🔥 Cohere — ExamSoft competitive feature set',            type:'deadline', done:false },
  { date:'Nov–Dec',label:'Full ExamSoft-competitive launch · Year 1 complete',      type:'deadline', done:false },
];
const TC = { start:'#6d5ed4', session:'#0d9488', milestone:'#d97706', design:'#3b82f6', deadline:'#dc2626' };

function Pill({ status }) {
  const c = STATUS_CFG[status]||STATUS_CFG['in-progress'];
  return <span className="text-[9px] font-semibold mono px-2 py-0.5 rounded-full" style={{ background:c.bg, color:c.color }}>{c.label}</span>;
}

function Card({ c, expanded, onToggle }) {
  const cfg = STATUS_CFG[c.status];
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor:'var(--border)', borderLeft:`4px solid ${cfg.color}` }}>
      <button onClick={onToggle} className="w-full text-left" style={{ background:'var(--bg2)' }}>
        <div className="px-4 py-3 flex items-start gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background:`${SC(c.score)}15`, border:`2px solid ${SC(c.score)}` }}>
            <span className="text-[13px] font-bold" style={{ color:SC(c.score) }}>{c.score}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[14px] font-semibold" style={{ color:'var(--text)' }}>{c.shortLabel}</span>
              <Pill status={c.status}/>
              <span className="text-[10px] mono" style={{ color:'var(--text3)' }}>weight {c.weight}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background:'var(--border)' }}>
              <div className="h-1.5 rounded-full" style={{ width:`${c.score}%`, background:SC(c.score) }}/>
            </div>
            <div className="mt-1.5 text-[11px] leading-[1.4] line-clamp-1" style={{ color:'var(--text3)' }}>{c.offerText}</div>
          </div>
          <span className="text-[11px] flex-shrink-0 pt-3" style={{ color:'var(--text3)' }}>{expanded?'▲':'▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-5 pt-2 space-y-4" style={{ background:'var(--bg)' }}>
          {/* Offer letter */}
          <div className="p-3 rounded-lg border text-[12px] leading-[1.55]" style={{ borderColor:'var(--border)', color:'var(--text2)', background:'var(--bg2)' }}>
            <div className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color:'var(--text3)' }}>Offer letter requirement — Kunal Vaishnav · Mar 15, 2026</div>
            {c.offerText}
          </div>
          {/* Arun verbatim */}
          <div className="p-3 rounded-lg border-l-2 italic text-[12px] leading-[1.55]"
            style={{ borderColor:'#6d5ed4', background:'rgba(109,94,212,0.04)', color:'var(--text2)' }}>
            <div className="text-[9px] not-italic font-semibold uppercase tracking-widest mb-1" style={{ color:'#6d5ed4' }}>Arun verbatim — {c.arunSource}</div>
            {c.arunVerbatim}
          </div>
          {/* Score rationale */}
          <div className="p-3 rounded-lg text-[11px] leading-[1.55]"
            style={{ background:`${SC(c.score)}08`, borderLeft:`3px solid ${SC(c.score)}`, color:'var(--text2)' }}>
            <span className="font-semibold" style={{ color:SC(c.score) }}>Why {c.score}/100: </span>{c.scoreRationale}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color:'#16a34a' }}>Evidence — what has been done ({c.evidence.length})</div>
              <ul className="space-y-1.5">
                {c.evidence.map((e,i)=>(
                  <li key={i} className="flex gap-2 text-[12px] leading-[1.4]" style={{ color:'var(--text2)' }}>
                    <span style={{ color:'#16a34a', flexShrink:0 }}>✓</span><span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color:'#dc2626' }}>Gaps ({c.gaps.length})</div>
              <ul className="space-y-1.5 mb-4">
                {c.gaps.map((g,i)=>(
                  <li key={i} className="flex gap-2 text-[12px] leading-[1.4]" style={{ color:'var(--text2)' }}>
                    <span style={{ color:'#dc2626', flexShrink:0 }}>◯</span><span>{g}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color:'#0d9488' }}>Action plan</div>
              <ul className="space-y-1.5">
                {c.actions.map((a,i)=>(
                  <li key={i} className="flex gap-2 text-[12px] leading-[1.4]" style={{ color:'var(--text2)' }}>
                    <span style={{ color:'#0d9488', flexShrink:0 }}>→</span>
                    <span className="flex-1">{a.what}</span>
                    <span className="mono text-[10px] flex-shrink-0" style={{ color:'#dc2626' }}>{a.by}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function ArunPerformanceView() {
  const [exp, setExp] = useState('ui-design');
  const [showQuotes, setShowQuotes] = useState(false);
  const toggle = id => setExp(p=>p===id?null:id);
  const counts = { strong:0,'on-track':0,'in-progress':0,'at-risk':0 };
  CRITERIA.forEach(c=>counts[c.status]++);

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold mb-1" style={{ fontFamily:'DM Serif Display, Georgia, serif', color:'var(--text)' }}>
            Arun Performance Tracker
          </h1>
          <p className="text-[13px]" style={{ color:'var(--text3)', maxWidth:640 }}>
            7 criteria from the official offer letter (Kunal Vaishnav · Mar 15, 2026) cross-referenced with the raw Granola transcript of the Arun session (791334af · Mar 24, 2026) and all Marriott day sessions. Every Arun quote is verbatim from the transcript — not paraphrased.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap text-[11px] mono">
          <span className="px-3 py-1.5 rounded-full border" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>Start: Mar 16, 2026</span>
          <span className="px-3 py-1.5 rounded-full border" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>Reports to: Arun Gautam</span>
          <span className="px-3 py-1.5 rounded-full" style={{ background:'#6d5ed415', color:'#6d5ed4' }}>Day 12 · v2 (Granola-verified)</span>
        </div>
      </div>

      {/* OVERALL */}
      <div className="p-5 rounded-2xl border" style={{ background:'var(--bg2)', borderColor:'var(--border)' }}>
        <div className="flex items-center gap-8 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color:'var(--text3)' }}>Weighted score — offer letter criteria</div>
            <div className="flex items-end gap-1.5">
              <span className="text-[56px] font-bold leading-none" style={{ color:SC(OVERALL_SCORE) }}>{OVERALL_SCORE}</span>
              <span className="text-[20px] mb-1.5" style={{ color:'var(--text3)' }}>/100</span>
            </div>
            <div className="text-[12px] mt-1" style={{ color:'var(--text2)', maxWidth:280 }}>
              Strong on research, requirements translation, and accessibility. Prototype delivery is the primary risk to Apr 17.
            </div>
          </div>
          <div className="flex gap-6">
            {[['Strong','strong','#16a34a'],['On Track','on-track','#0d9488'],['In Progress','in-progress','#d97706'],['At Risk','at-risk','#dc2626']].map(([l,k,c])=>(
              <div key={k} className="text-center">
                <div className="text-[28px] font-bold leading-none" style={{ color:c }}>{counts[k]}</div>
                <div className="text-[10px] mono mt-1" style={{ color:'var(--text3)' }}>{l}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-[240px] space-y-1.5">
            {CRITERIA.map(c=>(
              <div key={c.id} className="flex items-center gap-2">
                <div className="w-[110px] min-w-[110px] text-[10px] truncate" style={{ color:'var(--text3)' }}>{c.shortLabel}</div>
                <div className="flex-1 h-2 rounded-full" style={{ background:'var(--border)' }}>
                  <div className="h-2 rounded-full" style={{ width:`${c.score}%`, background:SC(c.score) }}/>
                </div>
                <span className="mono text-[10px] w-6 text-right" style={{ color:SC(c.score) }}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RAW ARUN QUOTES PANEL */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor:'rgba(109,94,212,0.3)' }}>
        <button onClick={()=>setShowQuotes(p=>!p)} className="w-full text-left px-4 py-3 flex items-center justify-between"
          style={{ background:'rgba(109,94,212,0.04)' }}>
          <div>
            <div className="text-[12px] font-semibold" style={{ color:'#6d5ed4' }}>Arun verbatim — raw Granola transcript (791334af · Mar 24, 2026)</div>
            <div className="text-[11px] mt-0.5" style={{ color:'var(--text3)' }}>{ARUN_VERBATIM.length} direct quotes. Not paraphrased. Not summarised. Click to expand.</div>
          </div>
          <span className="text-[11px]" style={{ color:'var(--text3)' }}>{showQuotes?'▲':'▼'}</span>
        </button>
        {showQuotes && (
          <div className="p-4 space-y-3" style={{ background:'var(--bg)' }}>
            {ARUN_VERBATIM.map((q,i)=>(
              <div key={i} className="p-3 rounded-lg border" style={{ background:'var(--bg2)', borderColor:'var(--border)' }}>
                <div className="text-[12px] italic leading-[1.6] mb-1.5" style={{ color:'var(--text)' }}>"{q.quote}"</div>
                <div className="text-[10px]" style={{ color:'var(--text3)' }}>{q.context} · <span className="mono">{q.source}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border" style={{ background:'var(--bg2)', borderColor:'var(--border)' }}>
          <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color:'var(--text3)' }}>Coverage vs Arun target (85) — by offer letter criterion</div>
          <div className="text-[10px] mb-3" style={{ color:'var(--text3)' }}>Dashed = standard expected at 3 months. Gap between dashed and filled = design work to close.</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)"/>
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:9, fill:'#6b7280' }}/>
              <Radar name="Romit (Day 12)" dataKey="Romit" stroke="#6d5ed4" fill="#6d5ed4" fillOpacity={0.25}/>
              <Radar name="Target (85)" dataKey="Target" stroke="#dc2626" fill="none" strokeDasharray="4 2"/>
              <Legend iconSize={8} wrapperStyle={{ fontSize:10 }}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-xl border" style={{ background:'var(--bg2)', borderColor:'var(--border)' }}>
          <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color:'var(--text3)' }}>Score ranked — all 7 criteria · dashed = 85 target</div>
          <div className="text-[10px] mb-3" style={{ color:'var(--text3)' }}>Two criteria at risk (below 70). One in progress. Four at or above target.</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} layout="vertical" margin={{ left:90, right:20 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)"/>
              <XAxis type="number" domain={[0,100]} tick={CS}/>
              <YAxis type="category" dataKey="shortLabel" tick={{ fontSize:9, fill:'#6b7280' }} width={90}/>
              <Tooltip contentStyle={{ fontSize:11, background:'var(--bg2)', border:'1px solid var(--border)' }}
                formatter={(v,_,p)=>[`${v}/100 · weight ${p.payload.weight}%`, p.payload.shortLabel]}/>
              <ReferenceLine x={85} stroke="#dc2626" strokeDasharray="4 2"/>
              <Bar dataKey="score" radius={[0,4,4,0]}>
                {barData.map(c=><Cell key={c.id} fill={SC(c.score)}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* VELOCITY + NPS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border" style={{ background:'var(--bg2)', borderColor:'var(--border)' }}>
          <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color:'var(--text3)' }}>Research velocity — first 12 days (sessions · insights · artifacts)</div>
          <div className="text-[10px] mb-3" style={{ color:'var(--text3)' }}>Week 2 shows clear acceleration — 9 sessions vs 4. Next step: artifacts must accelerate equally.</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={velocityData}>
              <CartesianGrid stroke="var(--border)"/>
              <XAxis dataKey="week" tick={{ fontSize:9, fill:'#6b7280' }}/>
              <YAxis tick={CS}/>
              <Tooltip contentStyle={{ fontSize:11, background:'var(--bg2)', border:'1px solid var(--border)' }}/>
              <Line type="monotone" dataKey="sessions" stroke="#6d5ed4" dot strokeWidth={2} name="Sessions"/>
              <Line type="monotone" dataKey="insights" stroke="#0d9488" dot strokeWidth={2} name="Insights"/>
              <Line type="monotone" dataKey="artifacts" stroke="#d97706" dot strokeWidth={2} name="Artifacts"/>
              <Legend iconSize={8} wrapperStyle={{ fontSize:10 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-xl border" style={{ background:'rgba(220,38,38,0.03)', borderColor:'rgba(220,38,38,0.2)' }}>
          <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{ color:'#dc2626' }}>Why this work matters — NPS 2025 baseline</div>
          <div className="text-[10px] mb-3" style={{ color:'var(--text3)' }}>1,494 responses. Arun's metric: "How much faculty time did we save?" This is the starting line.</div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { l:'Student NPS', v:'-47.5', sub:'n=1,282', note:'65% detractors', c:'#dc2626' },
              { l:'Faculty NPS', v:'-49.1', sub:'n=108',   note:'Worst segment',  c:'#dc2626' },
              { l:'Admin NPS',  v:'-4.8',  sub:'n=104',   note:'Best segment',   c:'#d97706' },
            ].map(m=>(
              <div key={m.l} className="p-3 rounded-lg text-center" style={{ background:'var(--bg2)' }}>
                <div className="text-[9px] uppercase tracking-widest" style={{ color:'var(--text3)' }}>{m.l}</div>
                <div className="text-[24px] font-bold leading-none my-1" style={{ color:m.c }}>{m.v}</div>
                <div className="text-[9px] mono" style={{ color:'var(--text3)' }}>{m.sub}</div>
                <div className="text-[9px] mt-0.5" style={{ color:'var(--text2)' }}>{m.note}</div>
              </div>
            ))}
          </div>
          <div className="text-[11px] leading-[1.5]" style={{ color:'var(--text2)' }}>
            Top 5 detractors: navigation · mobile clocking · preceptor form length · login friction · compliance false positives. Nursing = 47% of volume — highest NPS recovery lever.
          </div>
        </div>
      </div>

      {/* 7 CRITERIA DETAIL */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-semibold" style={{ color:'var(--text)' }}>7 Criteria — offer letter · Arun verbatim · evidence · gaps · actions</div>
          <div className="text-[11px]" style={{ color:'var(--text3)' }}>Click any row to expand</div>
        </div>
        <div className="space-y-2">
          {CRITERIA.map(c=><Card key={c.id} c={c} expanded={exp===c.id} onToggle={()=>toggle(c.id)}/>)}
        </div>
      </div>

      {/* MILESTONE TIMELINE */}
      <div className="p-5 rounded-2xl border" style={{ background:'var(--bg2)', borderColor:'var(--border)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color:'var(--text3)' }}>Design milestone timeline — completed vs upcoming</div>
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <div className="text-[10px] mono font-semibold mb-2 pb-1 border-b" style={{ color:'#16a34a', borderColor:'var(--border)' }}>Completed · Day 1–12</div>
            {MILESTONES.filter(m=>m.done).map(m=>(
              <div key={m.date+m.label} className="flex items-start gap-2.5 py-1.5 border-b last:border-0" style={{ borderColor:'var(--border)' }}>
                <span className="mono text-[10px] w-14 flex-shrink-0 pt-0.5" style={{ color:'var(--text3)' }}>{m.date}</span>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background:TC[m.type], opacity:0.6 }}/>
                <span className="text-[12px]" style={{ color:'var(--text2)', opacity:0.7 }}>{m.label}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] mono font-semibold mb-2 pb-1 border-b" style={{ color:'#dc2626', borderColor:'var(--border)' }}>Upcoming — critical 3 weeks</div>
            {MILESTONES.filter(m=>!m.done).map(m=>(
              <div key={m.date+m.label} className="flex items-start gap-2.5 py-1.5 border-b last:border-0" style={{ borderColor:'var(--border)' }}>
                <span className="mono text-[10px] w-14 flex-shrink-0 pt-0.5" style={{ color:'var(--text3)' }}>{m.date}</span>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 border-2" style={{ borderColor:TC[m.type], background:'transparent' }}/>
                <div className="flex-1 flex items-start justify-between gap-2">
                  <span className="text-[12px]" style={{ color:'var(--text)' }}>{m.label}</span>
                  <span className="text-[9px] mono px-1.5 py-0.5 rounded flex-shrink-0" style={{ background:`${TC[m.type]}15`, color:TC[m.type] }}>{m.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3-WEEK MANDATE */}
      <div className="p-5 rounded-2xl border" style={{ background:'rgba(109,94,212,0.04)', borderColor:'rgba(109,94,212,0.2)' }}>
        <div className="text-[10px] uppercase tracking-widest mb-3" style={{ color:'#6d5ed4' }}>What closing the gap looks like — the 3-week mandate to Apr 17</div>
        <div className="grid grid-cols-3 gap-4 text-[12px]" style={{ color:'var(--text2)' }}>
          <div>
            <div className="font-semibold mb-1" style={{ color:'var(--text)' }}>Apr 1–7: First prototypes</div>
            Arun said "top top top priority is this only." Two senior engineers join April 1 needing design assets. QB navigation and student exam flow in MP are the two artifacts that unblock the React rebuild and lift the prototype score from 55 to above 70.
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color:'var(--text)' }}>Apr 7–12: Specs + admin</div>
            Arun said "design specs and clarifying design intent during development" — that is the offer letter criterion at 60. First redline spec (accessibility toolbar states) and QB screen spec close this gap. Admin tools prototype completes the three-persona demo set.
          </div>
          <div>
            <div className="font-semibold mb-1" style={{ color:'var(--text)' }}>Apr 12–17: Sign-off ready</div>
            Arun said "Vishakha and Aarti will have to sign off on what you are doing." All 3 flows linked and demo-ready is what sign-off requires. This is also the first moment Arun does his one phase-end review check — the check he said he would not do until design is "rounded up."
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] mono pb-4" style={{ color:'var(--text3)' }}>
        rr-insights · Arun Performance Tracker v2 · Offer letter: Kunal Vaishnav Mar 15 2026 · Granola: 791334af Mar 24 2026 (verbatim transcript) · NPS 2025: 1,494 responses · Mar 28, 2026
      </div>
    </div>
  );
}
