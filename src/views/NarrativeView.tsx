// @ts-nocheck
// NarrativeView.tsx — The intelligence layer. Not a data dump.
// Connects signals into arguments. Dots get connected here.
// Structure: 5 Arguments, each with Evidence → Implication → Design Response

import { INSIGHTS } from '../data/insights';

interface Props { onNav?: (view: string) => void; }

// ─── THE FIVE ARGUMENTS ──────────────────────────────────────────────────────
// Each argument is a claim that can be defended with evidence from Granola sessions,
// NPS data, user interviews, and competitive analysis.

const ARGUMENTS = [
  {
    id: 'arg-01',
    number: '01',
    claim: 'Exxat is losing students before they can help them.',
    subclaim: 'A -47.5 NPS from 1,282 students is not a product problem. It is a trust problem. Students who cannot trust the platform do not use it — and when they stop using it, the clinical data that programs need for accreditation disappears with them.',
    color: '#dc2626',
    accentBg: 'rgba(220,38,38,0.05)',
    borderColor: 'rgba(220,38,38,0.15)',
    sources: [
      { label: 'NPS 2025 · Student cohort (n=1,282)', stat: '-47.5', statLabel: 'Student NPS', context: 'Largest response group. Worst-scoring persona.' },
      { label: 'NPS 2025 · Verbatim analysis', stat: '218', statLabel: 'Nav complaints', context: '"Cannot find hour tracking." "Features in confusing locations." Most common theme across all negative responses.' },
      { label: 'Justin user interview · Mar 30', stat: '3rd', statLabel: 'Spreadsheet built', context: 'Student built their 3rd external tracking spreadsheet this semester. PT Fall 2025 tracker: 60 assignments, all manually maintained.' },
    ],
    evidence: [
      'Student NPS of -47.5 with 1,282 responses. 65% are detractors. Only 18% promoters.',
      '80-90% of students build external spreadsheets because the platform does not surface their progress in one place.',
      'Justin (PT student) prefers Google Classroom and uses Better Canvas extension to work around Canvas — Exxat is competing with a student\'s willingness to install workarounds.',
      '"This is so confusing." "It is difficult to navigate." These are not edge cases in the NPS data. They are the mode.',
      'Compliance false positives — status showing a requirement as missing after it was cleared — appear in 98 verbatim responses. This is not a bug. It is an anxiety trigger at the moment students are most vulnerable.',
    ],
    implication: 'Student trust is the foundation that clinical education data is built on. A student who does not trust the submission confirmation will screenshot it as personal proof. A student who cannot find their placement schedule will email the DCE directly. Every workaround a student builds is a data gap in the program\'s accreditation record.',
    designResponse: 'The first screen after login must answer three questions without a single click: What is due today? What did I submit this week? Am I on track? Every student-facing surface must replace anxiety with confirmation. Status indicators must be real-time and unambiguous. The moment of submission must feel final.',
    navTarget: 'nps',
    navLabel: 'Full NPS analysis',
  },
  {
    id: 'arg-02',
    number: '02',
    claim: 'Faculty are the platform\'s highest-leverage user — and its most dissatisfied.',
    subclaim: 'Faculty NPS of -49.1 is worse than students. Faculty are power users. They understand software. That Exxat fails them harder than it fails students is the clearest signal the platform has a structural architecture problem, not just a usability one.',
    color: '#b45309',
    accentBg: 'rgba(180,83,9,0.05)',
    borderColor: 'rgba(180,83,9,0.15)',
    sources: [
      { label: 'NPS 2025 · Faculty cohort (n=108)', stat: '-49.1', statLabel: 'Faculty NPS', context: 'Worse than student NPS. Power users who understand software are more dissatisfied than the students they teach.' },
      { label: 'Canvas demo with Carol · Apr 13', stat: '200+', statLabel: 'Unfiled questions', context: 'Faculty in Canvas end up with 200+ questions in an unfiled bank because the tool has no organizational affordance. No sort, no filter. Must read every question to find one.' },
      { label: 'ExamSoft report review · Apr 3', stat: '6 levels', statLabel: 'Category depth needed', context: 'Some accreditation standards (MPJE, NCLEX-RN) exceed 3 hierarchy levels. Current tools cap at 3. Faculty manually flatten deep standards trees.' },
    ],
    evidence: [
      'Faculty NPS -49.1 (n=108). "Not very intuitive, difficult to locate settings." "Format is not really user friendly to education needs." "Using it today for the first time, cannot rate properly." — all from NPS verbatim.',
      'ExamSoft retention at every site is driven by three anchors: curriculum mapping established, faculty training built over years, strong item analytics. These are not features. They are switching costs built from faculty time.',
      'Faculty split confirmed across Granola sessions: power users want Bloom taxonomy + learning objective cross-referencing. Research-first faculty want zero overhead. The same interface cannot serve both without progressive disclosure.',
      'Canvas has no synchronized exam start code — faculty cannot start all students simultaneously for in-person exams. No bulk accommodation upload — each student adjusted one at a time. Exxat has the opportunity to solve both.',
      'Carol (Iowa PA program) runs 90% of didactic assessments in Canvas. The exam management market is not won by ExamSoft — it is won by whoever serves the faculty who are still in Canvas.',
    ],
    implication: 'Faculty who are dissatisfied do not leave — they stay and build workarounds. They maintain Excel spreadsheets of curriculum maps. They email questions across campuses. They create course shells named "Biochemistry Bank" to fake a question repository. Every workaround is institutional knowledge trapped outside the platform.',
    designResponse: 'Faculty need two interfaces, not one. A fast path for the research-first faculty who want to create an exam in 4 clicks. An advanced path for the power user who needs Bloom taxonomy mapping, version history, and point biserial analytics. Progressive disclosure is the architecture. The advanced path must never slow down the fast path.',
    navTarget: 'exam-management',
    navLabel: 'Exam Management design',
  },
  {
    id: 'arg-03',
    number: '03',
    claim: 'ExamSoft is beatable, but only if Exxat designs for the moment faculty switch — not the moment they are already committed.',
    subclaim: 'ExamSoft retention is not about features. It is about sunk cost. Curriculum mapping established. Training built over years. Item analytics trusted. Exxat must make the switching cost disappear — not compete feature-for-feature with an incumbent that has a 10-year head start.',
    color: '#6d5ed4',
    accentBg: 'rgba(109,94,212,0.05)',
    borderColor: 'rgba(109,94,212,0.15)',
    sources: [
      { label: 'ExamSoft report review · Apr 3', stat: '3', statLabel: 'Retention anchors', context: 'Curriculum mapping established. Faculty training built over years. Strong item analytics. These are the three things Exxat must dissolve, not match.' },
      { label: 'Arun<>Romit Vision · Mar 24', stat: 'Anti-AI', statLabel: 'ExamSoft position', context: 'ExamSoft is publicly positioning as anti-AI. This is Exxat\'s strategic opening. The faculty who feel constrained by ExamSoft\'s limitations are the ones to win first.' },
      { label: 'ExamSoft enterprise (Apr 3)', stat: 'Regression', statLabel: 'QB removal', context: 'ExamSoft enterprise removed the dedicated question bank section. Everything is a course shell. Faculty create a course named "Biochemistry Bank" to distinguish it. This is a UX regression Exxat can exploit.' },
    ],
    evidence: [
      'ExamSoft enterprise removed the dedicated question bank. Faculty create course shells named "Bank" to compensate. This is not a minor inconvenience — it is a data architecture failure that Exxat can win against by default.',
      'Trey (pharmacy P2, ExamSoft user): cannot highlight or interact with attached diagrams. Calculator lacks logarithmic functions. No cross-assessment analytics. No time-to-answer data. These are gaps in the current market leader.',
      'ExamSoft is publicly anti-AI. Every faculty member who uses ChatGPT to generate exam questions (confirmed by Vishaka: widespread at TechSAG conference) is a person whose workflow ExamSoft is actively ignoring.',
      'The ExamSoft category hierarchy supports 6 levels. The Exxat spec was capping at 3. Until this session. Now confirmed: 6 minimum. One more place where matching the incumbent is table stakes.',
      'Canvas analytics: no cross-semester question performance tracking. Question statistics do not transfer when copying courses. Carol (Iowa PA) uses ExamSoft only for item analytics — because Canvas cannot do it. Exxat needs to make this decision unnecessary.',
    ],
    implication: 'The faculty who will switch to Exxat first are not the ones happy with ExamSoft. They are the ones who feel constrained by it — the faculty using ChatGPT for question generation that ExamSoft ignores, the faculty at multi-campus programs where ExamSoft\'s folder-based architecture creates manual overhead, and the faculty at programs with deep accreditation standards trees that ExamSoft\'s 3-level cap cannot accommodate.',
    designResponse: 'Design for the switcher, not the loyalist. The switcher needs: import from ExamSoft in three clicks, AI that does what ChatGPT does but inside the platform, a question bank organized by standards not by folders, and analytics that cross semesters. Build the ExamSoft import first. Make the switching cost zero.',
    navTarget: 'competitive',
    navLabel: 'Competitive analysis',
  },
  {
    id: 'arg-04',
    number: '04',
    claim: 'Course evaluations are the lowest-friction product Exxat could ship — and the highest-ROI competitive displacement.',
    subclaim: 'Touro runs 7 survey types outside Exxat. Anthology\'s dominant interface fails to show all instructors on the initial screen. The current market is not sophisticated. A well-designed PCE module with AI sentiment analysis would be the most differentiated evaluation product in clinical healthcare education.',
    color: '#0d9488',
    accentBg: 'rgba(13,148,136,0.05)',
    borderColor: 'rgba(13,148,136,0.15)',
    sources: [
      { label: 'PCE demo with Trey · Apr 23', stat: 'Missing', statLabel: 'Dr. Wu from grid', context: 'Anthology fails to show all instructors on the initial survey screen. Dr. Wu appears later in the flow — students do not know he needs to be evaluated. This is the primary Anthology UX failure.' },
      { label: 'PCE workflow design · Apr 21', stat: 'Q3 2026', statLabel: 'Production target', context: 'Design begins June 1. Development June-August. Production September — before Cohere conference. Monthly iterations.' },
      { label: 'Touro ExamSoft meeting · Mar 11', stat: '7 types', statLabel: 'Surveys outside Exxat', context: 'Faculty peer review, didactic eval, orientation, end-of-didactic, clinical eval, exit survey, graduate survey — all running in Blue/Canvas. These are the surveys Exxat should own.' },
    ],
    evidence: [
      'Anthology (Trey demo): Dr. Wu does not appear on the initial instructor grid — students miss evaluating him entirely. Role context (course coordinator vs instructor) is not labeled — students do not know what they are evaluating. These are fundamental UX failures in the market leader.',
      'Survey completion is gamed: grade release leverage creates situations where some students see grades early and lose motivation to complete. Daily email reminders cause alert fatigue. The behavioral economics of evaluation completion are not being addressed by any current tool.',
      'Competitors (Explorance Blue, Watermark, Anthology) all do basic mathematics — median, mode, response rate. Zero AI sentiment analysis. Zero automatic categorization of improvement signals vs compliment signals. The differentiation opportunity is real and uncontested.',
      'PCE must live in a separate journey from the 1000+ general surveys currently in Exxat. High-stakes evaluation buried in a list of food quality and event feedback surveys is a signal failure before anyone fills in a single answer.',
      'Three-tier evaluation model is confirmed: course content + course director + course instructor. Same person can appear in two roles with separate question sets. This structural clarity alone is an improvement over Anthology.',
    ],
    implication: 'The PCE opportunity is not about building a better survey tool. It is about building the platform that owns the clinical education feedback loop — the data that connects what students learned in the classroom to how faculty performed to how programs should change. That data currently lives in spreadsheets, in Blue, in Qualtrics, and in email. Exxat can own it.',
    designResponse: 'The distribution flow is the highest-design-investment surface. Every instructor must be visible on the initial survey screen with their role labeled. Anonymous completion tracking (who submitted, not what they said) enables bonus points without breaking anonymity. AI sentiment analysis surfaces as "common themes" not "AI insights" — per Aarti\'s constraint. The analytics dashboard is the product, not the survey form.',
    navTarget: 'course-eval',
    navLabel: 'Course Eval product view',
  },
  {
    id: 'arg-05',
    number: '05',
    claim: 'The same three words appear in NPS data, Granola sessions, and user interviews. They are not complaints. They are a design brief.',
    subclaim: 'Navigation. Findability. Cognitive load. These words appear in feedback from students, faculty, admins, and SCCEs across every product. This is not a theming exercise. It is a platform-level architecture failure that requires a platform-level design response.',
    color: '#e87ab5',
    accentBg: 'rgba(232,122,181,0.05)',
    borderColor: 'rgba(232,122,181,0.15)',
    sources: [
      { label: 'NPS 2025 · Verbatim analysis', stat: '218', statLabel: 'Nav complaints', context: 'Navigation/findability is the single most common negative theme across all 581 negative verbatims analyzed.' },
      { label: 'Justin user interview · Mar 30', stat: 'Extension', statLabel: 'Better Canvas installed', context: 'Student installed a Chrome extension to add a progress wheel and organized assignment view to Canvas. This is the UX gap Exxat must close without requiring a browser extension.' },
      { label: 'SKILL.md platform signals', stat: '7', statLabel: 'Platform-level signals', context: 'Cognitive overload, reporting deficit, AI opportunity, manual config debt, multi-campus fragmentation, standalone skills gap, mobile gap — all appear in 3+ products.' },
    ],
    evidence: [
      '"Many features are in confusing locations and could be more accessible from the dashboard." — NPS verbatim.',
      '"It is hard to navigate from your mobile device." — NPS verbatim. Mobile is not an edge case for SCCEs doing clinical supervision in hospital hallways.',
      '"Courses are hard to find. Students are hard to find." — Admin NPS verbatim. The admin who cannot find a student is the same admin who must certify that student\'s compliance record.',
      'Justin uses Better Canvas extension because Canvas\'s default view does not show him what is due. He built his own progress tracking system in Excel. The platform he would describe as good UX is one where he does not need either workaround.',
      'The Touro "monster grid" — a triple-digit-column Excel file synthesizing three data systems — is an admin\'s attempt to answer a question the platform cannot: how is this program performing across all its students, courses, and clinical sites at once?',
    ],
    implication: 'Navigation is not a sidebar problem or a search problem. It is a mental model problem. Users do not know where they are in the platform because the platform does not know who they are in the moment they arrive. A student arriving before a rotation needs a different interface than a student who just completed one. An admin in compliance review mode needs different affordances than an admin setting up a new placement.',
    designResponse: 'Context-aware home screens. The platform should know — from recent activity, from role, from calendar proximity to rotation dates — what the user is likely doing today. Surface that task first. Reduce everything else. This is not personalization for its own sake. It is a navigation architecture decision: the home screen is the navigation, not a separate nav structure the user must learn.',
    navTarget: 'themes',
    navLabel: 'Platform themes view',
  },
];

// ─── CONNECTIVE TISSUE: THE THROUGH-LINE ─────────────────────────────────────
const THROUGH_LINE = {
  headline: 'One platform. Five products. One missing ingredient.',
  body: 'Every argument above traces back to the same gap: the platform collects clinical education data but does not synthesize it into intelligence. Students build spreadsheets because the platform cannot answer their most basic questions. Faculty stay on ExamSoft because their curriculum mapping lives there. Program directors run 7 surveys outside Exxat because it cannot connect evaluation data to accreditation requirements. The opportunity is not to build more features. It is to build the intelligence layer that makes the data the platform already has answer the questions its users already have.',
};

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export function NarrativeView({ onNav }: Props) {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px 80px' }}>

      {/* MASTHEAD */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span>Research Intelligence</span>
          <span style={{ width: 24, height: 1, background: 'var(--border2)', display: 'inline-block' }} />
          <span>35 Granola sessions · NPS 2025 · 3 user interviews</span>
        </div>
        <h1 style={{
          fontFamily: 'DM Serif Display, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 38,
          fontWeight: 400,
          color: 'var(--text)',
          lineHeight: 1.2,
          marginBottom: 16,
          letterSpacing: '-0.01em',
        }}>
          Five arguments about why Exxat's next design decisions matter more than they appear.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 640 }}>
          This is not a summary of research sessions. It is a reading of what the sessions mean together — the pattern that becomes visible only when 35 Granola sessions, 1,282 NPS responses, and three user interviews are placed next to each other and read as a single document.
        </p>
      </div>

      {/* THROUGH-LINE PULLQUOTE */}
      <div style={{
        borderLeft: '3px solid var(--accent)',
        paddingLeft: 20,
        marginBottom: 52,
        background: 'rgba(109,94,212,0.03)',
        borderRadius: '0 8px 8px 0',
        padding: '16px 20px',
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          The through-line
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', lineHeight: 1.5, marginBottom: 8 }}>
          {THROUGH_LINE.headline}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
          {THROUGH_LINE.body}
        </div>
      </div>

      {/* TABLE OF CLAIMS */}
      <div style={{ marginBottom: 52 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>
          Five arguments
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {ARGUMENTS.map((arg, idx) => (
            <a
              key={arg.id}
              href={`#${arg.id}`}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '12px 0',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                borderTop: idx === 0 ? '1px solid var(--border)' : 'none',
              }}
            >
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 10, color: arg.color, fontWeight: 700,
                minWidth: 24, paddingTop: 2,
              }}>{arg.number}</span>
              <span style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, flex: 1 }}>{arg.claim}</span>
              <span style={{ fontSize: 10, color: 'var(--text3)', paddingTop: 3, flexShrink: 0 }}>↓</span>
            </a>
          ))}
        </div>
      </div>

      {/* ARGUMENTS */}
      {ARGUMENTS.map((arg) => (
        <div key={arg.id} id={arg.id} style={{ marginBottom: 64 }}>

          {/* Argument header */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 11, fontWeight: 700,
                color: arg.color,
                background: arg.accentBg,
                border: `1px solid ${arg.borderColor}`,
                borderRadius: 4,
                padding: '3px 8px',
              }}>
                {arg.number}
              </span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <h2 style={{
              fontFamily: 'DM Serif Display, Georgia, serif',
              fontStyle: 'italic',
              fontSize: 24,
              fontWeight: 400,
              color: 'var(--text)',
              lineHeight: 1.3,
              marginBottom: 10,
              letterSpacing: '-0.01em',
            }}>
              {arg.claim}
            </h2>

            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
              {arg.subclaim}
            </p>
          </div>

          {/* Source stats row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            marginBottom: 24,
            padding: '16px',
            background: arg.accentBg,
            border: `1px solid ${arg.borderColor}`,
            borderRadius: 10,
          }}>
            {arg.sources.map((src, i) => (
              <div key={i} style={{ borderRight: i < 2 ? `1px solid ${arg.borderColor}` : 'none', paddingRight: i < 2 ? 16 : 0 }}>
                <div style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 22, fontWeight: 700,
                  color: arg.color, lineHeight: 1, marginBottom: 3,
                }}>
                  {src.stat}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: arg.color, marginBottom: 4, opacity: 0.8 }}>
                  {src.statLabel}
                </div>
                <div style={{ fontSize: 9, color: 'var(--text3)', lineHeight: 1.5, marginBottom: 4 }}>
                  {src.context}
                </div>
                <div style={{ fontSize: 8, color: 'var(--text3)', fontStyle: 'italic', opacity: 0.7 }}>
                  {src.label}
                </div>
              </div>
            ))}
          </div>

          {/* Evidence */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 10 }}>
              Evidence
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {arg.evidence.map((e, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, padding: '9px 0',
                  borderBottom: i < arg.evidence.length - 1 ? '1px solid var(--border)' : 'none',
                  alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: arg.color, flexShrink: 0, marginTop: 6,
                  }} />
                  <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65, margin: 0 }}>
                    {e}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Implication + Design Response */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{
              padding: '14px 16px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 8 }}>
                What this means
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>
                {arg.implication}
              </p>
            </div>
            <div style={{
              padding: '14px 16px',
              background: arg.accentBg,
              border: `1px solid ${arg.borderColor}`,
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: arg.color, marginBottom: 8 }}>
                Design response
              </div>
              <p style={{ fontSize: 12, color: 'var(--text)', lineHeight: 1.7, margin: 0 }}>
                {arg.designResponse}
              </p>
            </div>
          </div>

          {/* Go deeper link */}
          {onNav && (
            <div style={{ marginTop: 12, textAlign: 'right' }}>
              <button
                onClick={() => onNav(arg.navTarget)}
                style={{
                  fontSize: 11, fontWeight: 600, color: arg.color,
                  background: 'none', border: 'none', cursor: 'pointer',
                  letterSpacing: '0.04em',
                  padding: 0,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                {arg.navLabel} →
              </button>
            </div>
          )}
        </div>
      ))}

      {/* CLOSING: THE QUESTION THIS RAISES */}
      <div style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(109,94,212,0.06) 0%, rgba(13,148,136,0.06) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        marginTop: 20,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
          The question this raises
        </div>
        <div style={{
          fontFamily: 'DM Serif Display, Georgia, serif',
          fontStyle: 'italic',
          fontSize: 20,
          color: 'var(--text)',
          lineHeight: 1.45,
          marginBottom: 14,
        }}>
          What would Exxat look like if the platform knew what each user was doing today, and designed every surface around that answer?
        </div>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, margin: 0 }}>
          Every argument above is solvable. The nav complaints, the spreadsheet dependency, the ExamSoft retention, the PCE displacement opportunity, the faculty NPS — each has a clear design response. The question is sequencing. Which surfaces, built in which order, eliminate the most friction for the most users in the least time. That sequencing decision is what the next phase of design work must answer.
        </p>
      </div>

    </div>
  );
}
