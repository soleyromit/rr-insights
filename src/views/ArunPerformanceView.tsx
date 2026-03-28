// @ts-nocheck
// Source: Offer of Appointment — Kunal Vaishnav / Exxat Inc · Mar 15, 2026
// Evaluator: Arun Gautam · Role: Product Designer II · Day 12 on seat
import { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Legend, ReferenceLine } from 'recharts';

const CRITERIA = [
  { id:'ui-design', shortLabel:'UI Design', weight:22, score:68, status:'in-progress',
    offerText:'Designing user interface components, workflows, and interaction patterns for assigned features within Exxat\'s software platform.',
    arunSignal:'Speed over design system compliance right now. The exam taker UI has no equivalent in current products — whatever you build becomes the design system. Bi-weekly check-ins on design progress.',
    arunSource:'Arun · Mar 24, 2026',
    evidence:['32 question layout variants designed — 9 question types for Exam Management','Accessibility toolbar designed: zoom (100–400%), TTS, STT, on-screen keyboard, high-contrast','Question navigator: 2×2 flag model (flag is attribute, not category — Aarti/Kunal session)','Submit button timing: always present, prominence increases only at final 5–10 min','Accommodation profile system: program-level, named profiles, CSV import from disability services','Publish gate: blocks publish if alt text missing or accommodation profiles unset','PA Dashboard layout: NCCPA radar, EOR line chart, PACKRAT gauges, procedure minimums tracker'],
    gaps:['Magic Patterns prototypes not yet built — architecture defined but no interactive artifact','Student exam flow: zero shippable prototype for April 17 demo','Admin question bank UI: Smart Views, filter table, question editor — not started in MP','FaaS Phase 1 self-service (CI team): not designed','PCE distribution + analytics dashboard: not designed'],
    actions:[{what:'QB navigation + scoped views in Magic Patterns',by:'Apr 3'},{what:'Student exam flow: question card + navigator + accessibility toolbar',by:'Apr 7'},{what:'Admin accommodation profiles + publish gate',by:'Apr 12'},{what:'April 17 demo: 3 complete prototype flows (student + admin + faculty)',by:'Apr 17'}] },

  { id:'wireframes', shortLabel:'Prototypes', weight:20, score:55, status:'at-risk',
    offerText:'Creating wireframes, mockups, and interactive prototypes to support product development and usability improvements.',
    arunSignal:'Design must stay exactly one sprint ahead of engineering at all times. Two senior engineers joining April 1 — design needs to be ready before they start. April 17 demo must have working prototypes, not static screens.',
    arunSource:'Exam Management Standup · Mar 26 + Arun · Mar 24',
    evidence:['Question grouping HTML demo — clinical vignette pairing UX (interactive)','Assessment builder prototype: marks weightage, section management, bulk edit modal','rr-insights data visualization platform built and deployed (React + Recharts + D3)','QB V10.html and assessment-builder.html prototypes exist in migration pack','Stakeholder Day 1+2 architecture validated through working HTML prototypes'],
    gaps:['No Magic Patterns prototype for any Exam Management screen — critical gap','Student exam experience: zero interactive prototype ahead of Apr 17','Faculty QB: no MP artifact for engineering handoff','Skills Checklist: Q2 scope only — no prototype started','PCE analytics + distribution: no prototype scope started'],
    actions:[{what:'Student exam flow: question card + navigator + accessibility toolbar in MP',by:'Apr 7'},{what:'Faculty QB: Smart Views sidebar + question table + filter bar in MP',by:'Apr 7'},{what:'Admin: accommodation profiles + publish gate in MP',by:'Apr 12'},{what:'All 3 prototypes demo-ready with shareable Figma/MP links',by:'Apr 15'}] },

  { id:'requirements', shortLabel:'Requirements → Design', weight:18, score:84, status:'strong',
    offerText:'Translating product requirements and user stories into clear, user-centered interface designs.',
    arunSignal:'Wear the PM hat. Push beyond what is in the PRDs. Identify where AI strategy and long-term roadmap are absent from current docs. Every design artifact should contain product strategy, not just screens.',
    arunSource:'Arun · Mar 24, 2026',
    evidence:['Translated Day 1+2 stakeholder sessions into flat pool + Smart Views architecture','Converted Arun 3-year vision into Year 1/2/3 product phases with explicit differentiators','NPS 2025 data (-47.5 student) → 5 design levers with frequency counts from 835 negative responses','PA Dashboard: Ed Razenbach Excel PANCE model (R²=0.66–0.84) → platform feature specification','FaaS compliance session (Harsha) → 3-system fragmentation architectural brief','Prasanjit session → domain complexity tiers: PA vs CRNA vs SLP = 3 distinct design patterns','Monil PCE → AI differentiation stack (sentiment → SWOT) formalized as product requirement','Exam standup → role-based access: 4 roles × permission matrix fully documented'],
    gaps:['QB feature spec still too high-level for engineering handoff (Nipun confirmed Mar 27)','Skills Checklist Q2 requirements: prototype-first approach not started','FaaS Phase 1 (CI team): requirements received from Akshit but design not started'],
    actions:[{what:'Deliver detailed QB feature spec to Nipun — screen-level not system-level',by:'Apr 4'},{what:'FaaS Phase 1 internal design brief — 3 core CI team workflows',by:'Apr 18'},{what:'Skills Q2 requirements doc with persona flows and scope boundary',by:'May 15'}] },

  { id:'collaboration', shortLabel:'PM + Eng Collaboration', weight:16, score:78, status:'on-track',
    offerText:'Collaborating with product managers and engineering teams to ensure designs align with product requirements and technical constraints.',
    arunSignal:'Design system with Himanshu: speed over strict standardization. Family resemblance across products. Lightweight check-ins. If shared component not ready or does not fit — build what is needed.',
    arunSource:'Arun · Mar 24, 2026',
    evidence:['Nipun kickoff (Mar 27): QB architecture aligned, role definitions scoped, sprint structure confirmed','React rebuild decision aligned with engineering: e1 pilot frozen, React confirmed for admin + student','Himanshu DS evaluated: WCAG accessibility gaps identified and documented for handoff','Sprint cadence confirmed: 2 sprints/month, design 1 sprint ahead of Darshan build','Monil (PCE): distribution workflow + AI differentiation aligned through introduction session','Akshit (FaaS Q2): scope confirmed, Ankit dependencies flagged and tracked','Prasanjit (FaaS patient log): complex control types documented for engineering reference'],
    gaps:['Himanshu accessibility checklist not yet formally delivered — promised but pending','No formal design handoff artifact exists yet — all design is still in research phase','Tuesday 90-min Aarti demo slot not yet established as recurring','Thursday weekly Nipun + Arun + Vishaka not yet confirmed as recurring'],
    actions:[{what:'Deliver WCAG accessibility checklist + gap list to Himanshu',by:'Apr 10'},{what:'Confirm Tuesday 90-min Aarti demo slot as recurring calendar block',by:'Apr 1'},{what:'First formal design handoff package for QB to Nipun (MP file + spec doc)',by:'Apr 10'}] },

  { id:'design-reviews', shortLabel:'Design Reviews + Specs', weight:10, score:62, status:'at-risk',
    offerText:'Participating in design reviews and supporting implementation by providing design specifications and clarifying design intent during development.',
    arunSignal:'Bi-weekly check-ins with Arun established. Detailed specs needed — current docs are too high-level for engineering handoff. Tuesday 90-min with Aarti for updates and demos.',
    arunSource:'Exam Management Standup · Mar 26 + Arun · Mar 24',
    evidence:['Bi-weekly Arun check-in established (first: Mar 24)','Exam Management standup (Mar 26): sprint structure, React rebuild scope, entry points confirmed','Accessibility deep-dive (Mar 20) with Aarti + Kunal: 5 design decisions documented and published','PA Dashboard session (Mar 17): scope and deliverables confirmed with Aarti + Vishaka'],
    gaps:['No formal design review has been conducted — all sessions are still scoping/discovery','No design specification document written for any screen','No redline annotation or handoff annotation exists for any component','Thursday weekly (Nipun + Arun + Vishaka) not confirmed as recurring'],
    actions:[{what:'First redline annotation spec: accessibility toolbar component states',by:'Apr 7'},{what:'QB screen spec: annotated states, edge cases, empty states per screen',by:'Apr 10'},{what:'Confirm Thursday weekly recurring slot with Nipun + Arun + Vishaka',by:'Apr 1'}] },

  { id:'usability', shortLabel:'Usability + Feedback', weight:8, score:86, status:'strong',
    offerText:'Evaluating product usability through feedback from users and internal stakeholders to improve overall user experience.',
    arunSignal:'Core success metric: how much faculty time did AI save? Measure what delightful experience looks like. Who is having a great day? Who is having a poor day? What role did Exxat play?',
    arunSource:'Arun · Mar 24 + rr-insights SKILL.md whiteboard principles',
    evidence:['NPS 2025: 1,494 responses analyzed — student -47.5, faculty -49.1, admin -4.8','Bimodal score distribution identified: hate-or-tolerate pattern, near zero delight','5 top detractor themes extracted from 835 negative textual responses with frequency counts','Nursing-first leverage identified: 47% of volume = highest NPS recovery potential','Approve (+87.5) as benchmark: managed service model = quality bar for FaaS self-service','Ed Razenbach: PANCE predictor accuracy (within 1% of actual scores) = usability benchmark','8+ distinct user profiles synthesized across stakeholder and Granola sessions'],
    gaps:['Pendo behavioral data not yet integrated — attitudinal only, no usage frequency data','No formal usability test conducted yet — prototype-gated','SCCE persona: only 8 NPS responses — insufficient for reliable design decisions'],
    actions:[{what:'Request Pendo access from Arun — behavioral data completes the research picture',by:'Apr 7'},{what:'Schedule 1 SCCE user interview before May sprint',by:'Apr 20'},{what:'Define usability test plan for Apr 17 demo prototype (task completion + error rate)',by:'Apr 15'}] },

  { id:'accessibility', shortLabel:'Accessibility + Compliance', weight:6, score:91, status:'strong',
    offerText:'Incorporating accessibility and compliance considerations, including healthcare education regulations such as HIPAA, FERPA, and ADA, when designing product interfaces and workflows.',
    arunSignal:'Accessibility is not a checkbox. It is the hardest design challenge in the exam product. Pearson model: all features platform-embedded. Program-level accommodation profiles are first-to-market.',
    arunSource:'Aarti + Kunal + Arun accessibility session · Mar 20, 2026',
    evidence:['WCAG 2.1 AA feature map: magnification (1.4.4), TTS, STT, on-screen keyboard, high-contrast (1.4.3), alt text (1.1.1)','Accommodation profile system: program-level (first-to-market vs ExamSoft per-exam model)','Publish gate: blocks publish if alt text missing or profiles unset for flagged students','Pearson benchmark: all features platform-embedded, no external tools allowed (lockdown security)','WCAG gaps in Himanshu DS identified: voice narration, on-screen keyboard, color blindness audit','HIPAA, FERPA, ADA compliance mapped across all 5 products in rr-insights data layer','CAAHEP, CAPTE, ACOTE accreditation requirements linked to accessibility design decisions'],
    gaps:['Himanshu accessibility checklist not yet formally delivered as a specification','Color blindness simulation pass on exam screens pending','FaaS HIPAA compliance annotations not yet added to form design mockups'],
    actions:[{what:'Formal WCAG 2.1 AA checklist delivered to Himanshu DS team as a spec',by:'Apr 10'},{what:'Color blindness simulation: Deuteranopia + Protanopia on all exam screens',by:'Apr 14'},{what:'FERPA data handling annotation on FaaS compliance form mockups',by:'May 1'}] },
];

const OVERALL_SCORE = Math.round(CRITERIA.reduce((s,c) => s + c.score*(c.weight/100), 0));
const STATUS_CFG = {
  'strong':       {label:'Strong',       color:'#16a34a', bg:'rgba(22,163,74,0.08)'},
  'on-track':     {label:'On Track',     color:'#0d9488', bg:'rgba(13,148,136,0.08)'},
  'in-progress':  {label:'In Progress',  color:'#d97706', bg:'rgba(217,119,6,0.08)'},
  'at-risk':      {label:'At Risk',      color:'#dc2626', bg:'rgba(220,38,38,0.08)'},
};
const SC = (s) => s>=85?'#16a34a':s>=70?'#d97706':'#dc2626';
const CS = {fontSize:10, fill:'#6b7280'};

const radarData = CRITERIA.map(c=>({subject:c.shortLabel, Romit:c.score, Target:85}));
const barData   = [...CRITERIA].sort((a,b)=>b.score-a.score);

const velocityData = [
  {week:'W1 Mar16–22', sessions:4, insights:12, artifacts:1},
  {week:'W2 Mar23–27', sessions:9, insights:28, artifacts:5},
];

const MILESTONES = [
  {date:'Mar 16',  label:'Start date — Day 1',                          type:'start',   done:true},
  {date:'Mar 17',  label:'PA Dashboard session (Aarti + Vishaka)',       type:'session', done:true},
  {date:'Mar 20',  label:'Accessibility deep-dive (Aarti + Kunal)',      type:'session', done:true},
  {date:'Mar 24',  label:'Arun 3-year vision session',                   type:'session', done:true},
  {date:'Mar 25',  label:'Prasanjit patient log + Akshit FaaS Q2',       type:'session', done:true},
  {date:'Mar 26',  label:'Exam Mgmt standup + Monil PCE intro',          type:'session', done:true},
  {date:'Mar 27',  label:'Nipun QB kickoff — architecture aligned',      type:'session', done:true},
  {date:'Apr 1',   label:'2 senior engineers join React rebuild',        type:'milestone',done:false},
  {date:'Apr 3',   label:'QB navigation + scoped views in Magic Patterns',type:'design', done:false},
  {date:'Apr 7',   label:'Student exam flow prototype',                  type:'design',  done:false},
  {date:'Apr 10',  label:'Accessibility checklist → Himanshu DS',        type:'design',  done:false},
  {date:'Apr 12',  label:'Admin tools prototype',                        type:'design',  done:false},
  {date:'Apr 15',  label:'All 3 flows demo-ready + shareable links',     type:'design',  done:false},
  {date:'Apr 17',  label:'🔥 DEMO — student + admin + faculty',          type:'deadline',done:false},
  {date:'May',     label:'AI blueprint + PANCE predictor V1',            type:'milestone',done:false},
  {date:'Aug',     label:'🔥 Cohere — ExamSoft competitive',             type:'deadline',done:false},
  {date:'Nov–Dec', label:'Full ExamSoft-competitive launch',             type:'deadline',done:false},
];
const TC = {start:'#6d5ed4',session:'#0d9488',milestone:'#d97706',design:'#3b82f6',deadline:'#dc2626'};

function Pill({status}) {
  const c = STATUS_CFG[status]||STATUS_CFG['in-progress'];
  return <span className="text-[9px] font-semibold mono px-2 py-0.5 rounded-full" style={{background:c.bg,color:c.color}}>{c.label}</span>;
}

function Card({c, expanded, onToggle}) {
  const cfg = STATUS_CFG[c.status];
  return (
    <div className="rounded-xl border overflow-hidden" style={{borderColor:'var(--border)',borderLeft:`4px solid ${cfg.color}`}}>
      <button onClick={onToggle} className="w-full text-left" style={{background:'var(--bg2)'}}>
        <div className="px-4 py-3 flex items-start gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{background:`${SC(c.score)}15`,border:`2px solid ${SC(c.score)}`}}>
            <span className="text-[13px] font-bold" style={{color:SC(c.score)}}>{c.score}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[14px] font-semibold" style={{color:'var(--text)'}}>{c.shortLabel}</span>
              <Pill status={c.status}/>
              <span className="text-[10px] mono" style={{color:'var(--text3)'}}>weight {c.weight}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{background:'var(--border)'}}>
              <div className="h-1.5 rounded-full" style={{width:`${c.score}%`,background:SC(c.score)}}/>
            </div>
            <div className="mt-1.5 text-[11px] leading-[1.4] line-clamp-1" style={{color:'var(--text3)'}}>{c.offerText}</div>
          </div>
          <span className="text-[11px] flex-shrink-0 pt-3" style={{color:'var(--text3)'}}>{expanded?'▲':'▼'}</span>
        </div>
      </button>
      {expanded && (
        <div className="px-4 pb-5 pt-2 space-y-4" style={{background:'var(--bg)'}}>
          <div className="p-3 rounded-lg border text-[12px] leading-[1.55]" style={{borderColor:'var(--border)',color:'var(--text2)',background:'var(--bg2)'}}>
            <div className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{color:'var(--text3)'}}>Offer letter requirement (Kunal Vaishnav · Mar 15, 2026)</div>
            {c.offerText}
          </div>
          <div className="p-3 rounded-lg border-l-2 italic text-[12px] leading-[1.55]" style={{borderColor:'#6d5ed4',background:'rgba(109,94,212,0.04)',color:'var(--text2)'}}>
            <div className="text-[9px] not-italic font-semibold uppercase tracking-widest mb-1" style={{color:'#6d5ed4'}}>Arun signal — {c.arunSource}</div>
            "{c.arunSignal}"
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{color:'#16a34a'}}>Evidence — what Romit has done ({c.evidence.length})</div>
              <ul className="space-y-1.5">
                {c.evidence.map((e,i)=>(
                  <li key={i} className="flex gap-2 text-[12px] leading-[1.4]" style={{color:'var(--text2)'}}>
                    <span style={{color:'#16a34a',flexShrink:0}}>✓</span><span>{e}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{color:'#dc2626'}}>Gaps remaining ({c.gaps.length})</div>
              <ul className="space-y-1.5 mb-4">
                {c.gaps.map((g,i)=>(
                  <li key={i} className="flex gap-2 text-[12px] leading-[1.4]" style={{color:'var(--text2)'}}>
                    <span style={{color:'#dc2626',flexShrink:0}}>◯</span><span>{g}</span>
                  </li>
                ))}
              </ul>
              <div className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{color:'#0d9488'}}>Action plan</div>
              <ul className="space-y-1.5">
                {c.actions.map((a,i)=>(
                  <li key={i} className="flex gap-2 text-[12px] leading-[1.4]" style={{color:'var(--text2)'}}>
                    <span style={{color:'#0d9488',flexShrink:0}}>→</span>
                    <span className="flex-1">{a.what}</span>
                    <span className="mono text-[10px] flex-shrink-0" style={{color:'#dc2626'}}>{a.by}</span>
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
  const toggle = id => setExp(p=>p===id?null:id);
  const counts = {strong:0,'on-track':0,'in-progress':0,'at-risk':0};
  CRITERIA.forEach(c=>counts[c.status]++);

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[24px] font-semibold mb-1" style={{fontFamily:'DM Serif Display, Georgia, serif',color:'var(--text)'}}>
            Arun Performance Tracker
          </h1>
          <p className="text-[13px]" style={{color:'var(--text3)',maxWidth:620}}>
            7 criteria from the official offer letter (Kunal Vaishnav · Mar 15, 2026) mapped to Arun Gautam's session signals, Granola evidence, and gaps. Day 12 on seat. Evidence-based — not self-assessed.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap text-[11px] mono">
          <span className="px-3 py-1.5 rounded-full border" style={{borderColor:'var(--border)',color:'var(--text3)'}}>Start: Mar 16, 2026</span>
          <span className="px-3 py-1.5 rounded-full border" style={{borderColor:'var(--border)',color:'var(--text3)'}}>Reports to: Arun Gautam</span>
          <span className="px-3 py-1.5 rounded-full" style={{background:'#6d5ed415',color:'#6d5ed4'}}>Day 12 on seat</span>
        </div>
      </div>

      {/* OVERALL */}
      <div className="p-5 rounded-2xl border" style={{background:'var(--bg2)',borderColor:'var(--border)'}}>
        <div className="flex items-center gap-8 flex-wrap">
          <div>
            <div className="text-[10px] uppercase tracking-widest mb-1" style={{color:'var(--text3)'}}>Weighted performance score</div>
            <div className="flex items-end gap-1.5">
              <span className="text-[56px] font-bold leading-none" style={{color:SC(OVERALL_SCORE)}}>{OVERALL_SCORE}</span>
              <span className="text-[20px] mb-1.5" style={{color:'var(--text3)'}}>/100</span>
            </div>
            <div className="text-[12px] mt-1" style={{color:'var(--text2)',maxWidth:280}}>
              Research + accessibility are strong. Prototype velocity is the primary risk to April 17 demo.
            </div>
          </div>
          <div className="flex gap-6">
            {[['Strong','strong','#16a34a'],['On Track','on-track','#0d9488'],['In Progress','in-progress','#d97706'],['At Risk','at-risk','#dc2626']].map(([l,k,c])=>(
              <div key={k} className="text-center">
                <div className="text-[30px] font-bold leading-none" style={{color:c}}>{counts[k]}</div>
                <div className="text-[10px] mono mt-1" style={{color:'var(--text3)'}}>{l}</div>
              </div>
            ))}
          </div>
          <div className="flex-1 min-w-[240px] space-y-1.5">
            {CRITERIA.map(c=>(
              <div key={c.id} className="flex items-center gap-2">
                <div className="w-[110px] min-w-[110px] text-[10px] truncate" style={{color:'var(--text3)'}}>{c.shortLabel}</div>
                <div className="flex-1 h-2 rounded-full" style={{background:'var(--border)'}}>
                  <div className="h-2 rounded-full" style={{width:`${c.score}%`,background:SC(c.score)}}/>
                </div>
                <span className="mono text-[10px] w-6 text-right" style={{color:SC(c.score)}}>{c.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border" style={{background:'var(--bg2)',borderColor:'var(--border)'}}>
          <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{color:'var(--text3)'}}>Coverage vs target (85) — by offer letter criterion</div>
          <div className="text-[10px] mb-3" style={{color:'var(--text3)'}}>Dashed red = Arun's expected standard at 3 months on seat.</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)"/>
              <PolarAngleAxis dataKey="subject" tick={{fontSize:9,fill:'#6b7280'}}/>
              <Radar name="Romit (Day 12)" dataKey="Romit" stroke="#6d5ed4" fill="#6d5ed4" fillOpacity={0.25}/>
              <Radar name="Target (85)" dataKey="Target" stroke="#dc2626" fill="none" strokeDasharray="4 2"/>
              <Legend iconSize={8} wrapperStyle={{fontSize:10}}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-xl border" style={{background:'var(--bg2)',borderColor:'var(--border)'}}>
          <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{color:'var(--text3)'}}>Score ranked — all 7 offer letter criteria</div>
          <div className="text-[10px] mb-3" style={{color:'var(--text3)'}}>Dashed = 85 target. Green = strong. Amber = developing. Red = at risk.</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} layout="vertical" margin={{left:90,right:20}}>
              <CartesianGrid horizontal={false} stroke="var(--border)"/>
              <XAxis type="number" domain={[0,100]} tick={CS}/>
              <YAxis type="category" dataKey="shortLabel" tick={{fontSize:9,fill:'#6b7280'}} width={90}/>
              <Tooltip contentStyle={{fontSize:11,background:'var(--bg2)',border:'1px solid var(--border)'}}
                formatter={(v,_,p)=>[`${v}/100 · weight ${p.payload.weight}%`,p.payload.shortLabel]}/>
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
        <div className="p-4 rounded-xl border" style={{background:'var(--bg2)',borderColor:'var(--border)'}}>
          <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{color:'var(--text3)'}}>Research velocity — first 12 days</div>
          <div className="text-[10px] mb-3" style={{color:'var(--text3)'}}>Sessions attended, insights extracted, artifacts produced. Week 2 shows acceleration.</div>
          <ResponsiveContainer width="100%" height={130}>
            <LineChart data={velocityData}>
              <CartesianGrid stroke="var(--border)"/>
              <XAxis dataKey="week" tick={{fontSize:9,fill:'#6b7280'}}/>
              <YAxis tick={CS}/>
              <Tooltip contentStyle={{fontSize:11,background:'var(--bg2)',border:'1px solid var(--border)'}}/>
              <Line type="monotone" dataKey="sessions" stroke="#6d5ed4" dot strokeWidth={2} name="Sessions"/>
              <Line type="monotone" dataKey="insights" stroke="#0d9488" dot strokeWidth={2} name="Insights"/>
              <Line type="monotone" dataKey="artifacts" stroke="#d97706" dot strokeWidth={2} name="Artifacts"/>
              <Legend iconSize={8} wrapperStyle={{fontSize:10}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="p-4 rounded-xl border" style={{background:'rgba(220,38,38,0.03)',borderColor:'rgba(220,38,38,0.2)'}}>
          <div className="text-[10px] uppercase tracking-widest font-semibold mb-0.5" style={{color:'#dc2626'}}>Why this role matters — NPS 2025 baseline</div>
          <div className="text-[10px] mb-3" style={{color:'var(--text3)'}}>Source: 1,494 responses. This is the starting line. Romit's design work is the plan to move these numbers.</div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[{l:'Student NPS',v:'-47.5',sub:'1,282 responses',note:'65% detractors',c:'#dc2626'},{l:'Faculty NPS',v:'-49.1',sub:'108 responses',note:'Worst segment',c:'#dc2626'},{l:'Admin NPS',v:'-4.8',sub:'104 responses',note:'Best segment',c:'#d97706'}].map(m=>(
              <div key={m.l} className="p-3 rounded-lg text-center" style={{background:'var(--bg2)'}}>
                <div className="text-[9px] uppercase tracking-widest" style={{color:'var(--text3)'}}>{m.l}</div>
                <div className="text-[24px] font-bold leading-none my-1" style={{color:m.c}}>{m.v}</div>
                <div className="text-[9px] mono" style={{color:'var(--text3)'}}>{m.sub}</div>
                <div className="text-[9px] mt-0.5" style={{color:'var(--text2)'}}>{m.note}</div>
              </div>
            ))}
          </div>
          <div className="text-[11px] leading-[1.5]" style={{color:'var(--text2)'}}>
            Top 5 detractors: navigation · mobile clocking · preceptor form length · login friction · compliance false positives. Nursing = 47% of volume — highest NPS leverage.
          </div>
        </div>
      </div>

      {/* CRITERIA DETAIL */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-[14px] font-semibold" style={{color:'var(--text)'}}>
            7 Criteria — offer letter responsibilities → evidence → gaps → actions
          </div>
          <div className="text-[11px]" style={{color:'var(--text3)'}}>Click to expand</div>
        </div>
        <div className="space-y-2">
          {CRITERIA.map(c=><Card key={c.id} c={c} expanded={exp===c.id} onToggle={()=>toggle(c.id)}/>)}
        </div>
      </div>

      {/* MILESTONE TIMELINE */}
      <div className="p-5 rounded-2xl border" style={{background:'var(--bg2)',borderColor:'var(--border)'}}>
        <div className="text-[10px] uppercase tracking-widest mb-3" style={{color:'var(--text3)'}}>Design milestone timeline</div>
        <div className="grid grid-cols-2 gap-x-8">
          <div>
            <div className="text-[10px] mono font-semibold mb-2 pb-1 border-b" style={{color:'#16a34a',borderColor:'var(--border)'}}>Completed · Day 1–12</div>
            {MILESTONES.filter(m=>m.done).map(m=>(
              <div key={m.date+m.label} className="flex items-start gap-2.5 py-1.5 border-b last:border-0" style={{borderColor:'var(--border)'}}>
                <span className="mono text-[10px] w-14 flex-shrink-0 pt-0.5" style={{color:'var(--text3)'}}>{m.date}</span>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{background:TC[m.type],opacity:0.6}}/>
                <span className="text-[12px]" style={{color:'var(--text2)',opacity:0.7}}>{m.label}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] mono font-semibold mb-2 pb-1 border-b" style={{color:'#dc2626',borderColor:'var(--border)'}}>Upcoming — next 3 weeks critical</div>
            {MILESTONES.filter(m=>!m.done).map(m=>(
              <div key={m.date+m.label} className="flex items-start gap-2.5 py-1.5 border-b last:border-0" style={{borderColor:'var(--border)'}}>
                <span className="mono text-[10px] w-14 flex-shrink-0 pt-0.5" style={{color:'var(--text3)'}}>{m.date}</span>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 border-2" style={{borderColor:TC[m.type],background:'transparent'}}/>
                <div className="flex-1 flex items-start justify-between gap-2">
                  <span className="text-[12px]" style={{color:'var(--text)'}}>{m.label}</span>
                  <span className="text-[9px] mono px-1.5 py-0.5 rounded flex-shrink-0" style={{background:`${TC[m.type]}15`,color:TC[m.type]}}>{m.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MANDATE */}
      <div className="p-5 rounded-2xl border" style={{background:'rgba(109,94,212,0.04)',borderColor:'rgba(109,94,212,0.2)'}}>
        <div className="text-[10px] uppercase tracking-widest mb-3" style={{color:'#6d5ed4'}}>What closing the gap looks like — the 3-week mandate to Apr 17</div>
        <div className="grid grid-cols-3 gap-4 text-[12px]" style={{color:'var(--text2)'}}>
          <div><div className="font-semibold mb-1" style={{color:'var(--text)'}}>Apr 1–7: Ship prototypes</div>QB navigation and student exam flow in Magic Patterns. These two screens unblock the engineers joining Apr 1 and demonstrate the offer letter's core "wireframes and interactive prototypes" requirement directly.</div>
          <div><div className="font-semibold mb-1" style={{color:'var(--text)'}}>Apr 7–12: Admin tools + spec</div>Accommodation profiles, publish gate, QB filter table. Plus the first formal design spec with annotated states — this is the "design specifications and clarifying design intent" requirement that has zero artifacts yet.</div>
          <div><div className="font-semibold mb-1" style={{color:'var(--text)'}}>Apr 12–17: Demo-ready</div>All 3 flows linked and demo-ready. Research depth and accessibility strength become visible as design output — not just slide decks. This is what Arun needs to show Aarti and Vishaka on Apr 17.</div>
        </div>
      </div>

      <div className="text-center text-[11px] mono pb-4" style={{color:'var(--text3)'}}>
        rr-insights · Arun Performance Tracker · Offer letter: Kunal Vaishnav Mar 15, 2026 · 13 Granola sessions · NPS 2025: 1,494 responses · Mar 28, 2026
      </div>
    </div>
  );
}
