import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant';
interface Message { role: Role; content: string; timestamp: Date; }
type ScopeId = 'all' | 'exam-management' | 'faas' | 'course-eval' | 'skills-checklist' | 'learning-contracts' | 'personas' | 'competitive';

const SCOPES: { id: ScopeId; label: string; color: string }[] = [
  { id: 'all',               label: 'All products',       color: '#E31C79' },
  { id: 'exam-management',   label: 'Exam Management',    color: '#7C3AED' },
  { id: 'faas',              label: 'FaaS 2.0',           color: '#0891B2' },
  { id: 'course-eval',       label: 'Course & Eval',      color: '#059669' },
  { id: 'skills-checklist',  label: 'Skills Checklist',   color: '#D97706' },
  { id: 'learning-contracts',label: 'Learning Contracts', color: '#EF4444' },
  { id: 'personas',          label: 'Personas',           color: '#6366F1' },
  { id: 'competitive',       label: 'Competitive',        color: '#14B8A6' },
  { id: 'exactone',          label: 'ExxatOne',           color: '#F59E0B' },
  { id: 'accessibility',     label: 'Accessibility',      color: '#6366F1' },
];

const SUGGESTED: { label: string; prompt: string; scope: ScopeId }[] = [
  { label: 'Biggest gaps right now',     prompt: 'What are the most critical UX gaps across all 5 Exxat products, ranked by impact and grounded in specific stakeholder quotes?', scope: 'all' },
  { label: 'Exam Management vs ExamSoft',prompt: 'Compare Exxat Exam Management against ExamSoft feature-by-feature. Where are we ahead, behind, and what is our Year 1 competitive strategy?', scope: 'exam-management' },
  { label: 'FaaS Q2 scope',              prompt: 'What is in scope for FaaS 2.0 Q2? Who are the target users, what are the 3 most important features, and what did Akshit and Prasanjit say specifically?', scope: 'faas' },
  { label: 'PA program differentiator',  prompt: 'What is the PA student performance dashboard feature, why does Vishaka say it is a competitive differentiator vs Influx, and what data does it need?', scope: 'exam-management' },
  { label: 'Skills Checklist domains',   prompt: 'Explain the 5 different domain models for Skills Checklist (PA, Nursing, Rad Tech, CVT, Social Work). What makes each one unique and what is the hardest design challenge?', scope: 'skills-checklist' },
  { label: 'Arun 3-year vision',         prompt: 'Summarize Arun\'s 3-year product vision for Exam Management. What does Year 1, Year 2, and Year 3 look like? What is the AI strategy?', scope: 'exam-management' },
  { label: 'SCCE persona frictions',     prompt: 'What are the biggest UX frictions for the SCCE (Site Coordinator of Clinical Education) persona across all Exxat products? Cite specific sessions.', scope: 'personas' },
  { label: 'Course eval PCE strategy',   prompt: 'Why is post-course evaluation a market opportunity for Exxat? Who are the competitors, what is the integration strategy, and how does monetization work?', scope: 'course-eval' },
];

// ── System prompt builder ─────────────────────────────────────────────────────
function buildSystemPrompt(scope: ScopeId): string {
  const base = `You are Romit Soley's dedicated design intelligence assistant inside rr-insights, his private research platform at Exxat (Healthcare SaaS, Clinical Education).

You have deep knowledge of:
- All 5 Exxat products: Exam Management, FaaS 2.0, Course & Faculty Evaluation, Skills Checklist, Learning Contracts
- All stakeholder sessions: Ed Razenbach (PA program, ExamSoft power user), Dr. Vicky Mody (Blackboard comparison), Vishaka/David/Mohil (product team), Aarti & Kunal (exec), Arun Gautam (engineering lead), Prasanjit (FaaS domain expert), Akshit (PM Q2 requirements), Harsha (compliance), Nipun (junior PM), Dr. T Touro (clinical team)
- Competitive landscape: ExamSoft, D2L BrightSpace, Canvas, Blackboard Ultra, CoreEval, Blue, SmartEval, Anthology, Typhon, CompetencyAI, Influx
- Accreditation bodies: CAPTE, ACOTE, ARC-PA, CCNE, CSWE, CAAHEP
- Personas: Student, DCE, SCCE, Program Director, Faculty, Admin, Site Coordinator, Program Director, CRNA/FNP/PNP students
- ExxatOne platform (adjacent to Prism): ExxatOne Student (placement onboarding + compliance), ExxatOne School (placement pipeline: Plan→Place→Monitor→Review)
- Business context: KKR investment, $300M→$1B TAM target, Rule of 40, clinical education consolidates to 1-3 players, ExamSoft NPS 1/5
- Revenue model: ExxatOne only generates revenue when students pay for accepted placements — payment is the ONLY revenue trigger
- Accessibility architecture: platform-embedded only (LockDown browser blocks external tools), Pearson Education (GRE/SAT/TOEFL) is reference model, ACR required for UNF pilot
- D2L accommodation finding: 7 students × 10 quizzes = 70 manual setups in D2L. Exxat program-level accommodation profile = 1 setup
- React front-end FINAL decision: made Day 2 Marriott (Mar 3). AI-first everywhere — cannot retrofit AI later
- UNF pilot: July 2026, Australia North Rhoda college, annual graduation exam, MCQ, V0 accessibility required
- Design system: MagicPatterns is current build env; Figma/Himanshu design system exists but early draft

RESPONSE RULES:
1. Always cite the specific Granola session by name + date when referencing stakeholder quotes
2. Use actual verbatim quotes when they add specificity (e.g. Ed: "I use z scores rather than raw scores because a raw 412 in EM isn't the same as 382 in women's health")
3. Structure responses with clear headers when answering multi-part questions
4. For design decisions: always state the decision, the rationale, and the tradeoff
5. For gaps: always state severity (P0/P1/P2), source, and impact
6. Keep responses focused and actionable — Romit is a solo designer at a startup, not writing academic papers
7. For visual output requests: describe exactly what visualization to build (chart type, axes, data, color coding)
8. Never say "I don't know" — synthesize from what you do know and flag what needs more research
9. Romit's role: sole Product Designer II, reports to Arun, collaborates with Vishaka/Nipun/Himanshu

FORMAT:
- Use **bold** for key terms, quotes, and important decisions
- Use bullet lists for gaps, features, stories
- Use > blockquotes for verbatim stakeholder quotes
- Keep responses scannable — design intelligence, not wall of text`;

  const scopeAddendum: Partial<Record<ScopeId, string>> = {
    'exam-management': '\n\nFOCUS SCOPE: Exam Management only. Key context: Apr 17 UNF pilot, 87 students, Year 1 = beat LMS. PA program (Ed Razenbach) is primary external validator. Student side built at nt3rr3hj1s64irx5fydbvz, admin side at mnirdwczw9xbbzyuveee4g.',
    'faas': '\n\nFOCUS SCOPE: FaaS 2.0 only. Key context: 17k forms, 95k tickets, NPS 2/5. Q2 Phase 1 = internal only. Template-first. 80-85% forms are incremental edits. 12 control types, 3 Critical.',
    'course-eval': '\n\nFOCUS SCOPE: Course & Faculty Evaluation + PCE. Key context: LMS platforms don\'t do post-course eval. 9 survey types. Paid feature. Entry point = survey module not course pages.',
    'skills-checklist': '\n\nFOCUS SCOPE: Skills Checklist. Key context: Jan 2027 launch. 5 domain models (PA/Nursing/RadTech/CVT/SocialWork). Student program-level entity. Same backend, domain-specific UIs.',
    'learning-contracts': '\n\nFOCUS SCOPE: Learning Contracts. Key context: 2 types (rotation + remediation). Social work most complex model (EPAS 9×5=45 items). Prior merge with evaluations FAILED.',
    'personas': '\n\nFOCUS SCOPE: Personas. Focus on cross-product signals, shared frictions, and platform-level patterns.',
    'competitive': '\n\nFOCUS SCOPE: Competitive intelligence. Key competitors: ExamSoft (Year 2 target), D2L/Canvas/Blackboard (Year 1 benchmark), CoreEval/Blue/SmartEval (course eval), Typhon/CompetencyAI (skills).',
    'exactone': '\n\nFOCUS SCOPE: ExxatOne platform (Student + School). Revenue model: only when students pay for placements. Key design problems: payment hierarchy buried in left panel, Uber/Airbnb ecosystem model needed, Plan→Place→Monitor→Review pipeline.',
    'accessibility': '\n\nFOCUS SCOPE: Accessibility in Exam Management. Platform-embedded only. V0: magnification/high contrast/extra time (UNF pilot July). V1: OSK/TTS/WCAG 2.1 AA. Reference: Pearson Education (GRE/SAT/TOEFL). D2L baseline: 70 manual setups for 7 students.',
  };

  return base + (scopeAddendum[scope] || '');
}

// ── Markdown renderer (simple, no deps) ──────────────────────────────────────
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      nodes.push(<h2 key={i} style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', margin: '16px 0 6px', borderBottom: '1px solid var(--border)', paddingBottom: 4 }}>{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      nodes.push(<h3 key={i} style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', margin: '12px 0 4px' }}>{line.slice(4)}</h3>);
    } else if (line.startsWith('> ')) {
      nodes.push(
        <blockquote key={i} style={{ margin: '8px 0', paddingLeft: 12, borderLeft: '3px solid var(--brand)', background: 'rgba(227,28,121,0.05)', borderRadius: '0 6px 6px 0', padding: '8px 12px' }}>
          <span style={{ fontSize: 13, color: 'var(--text2)', fontStyle: 'italic' }}>{line.slice(2)}</span>
        </blockquote>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} style={{ margin: '6px 0', paddingLeft: 0, listStyle: 'none' }}>
          {items.map((item, j) => (
            <li key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 3 }}>
              <span style={{ color: 'var(--brand)', flexShrink: 0, marginTop: 2 }}>•</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>') }} />
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} style={{ margin: '6px 0', paddingLeft: 0, listStyle: 'none' }}>
          {items.map((item, j) => (
            <li key={j} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 3 }}>
              <span style={{ color: 'var(--brand)', flexShrink: 0, fontWeight: 700, fontFamily: 'monospace', minWidth: 16 }}>{j + 1}.</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>') }} />
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.trim() === '') {
      nodes.push(<div key={i} style={{ height: 6 }} />);
    } else if (line.trim()) {
      nodes.push(
        <p key={i} style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, margin: '4px 0' }}
          dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text)">$1</strong>').replace(/`(.+?)`/g, '<code style="font-family:monospace;background:var(--surface3);padding:1px 4px;border-radius:3px;font-size:12px;color:var(--text)">$1</code>') }} />
      );
    }
    i++;
  }
  return nodes;
}

// ── Main component ────────────────────────────────────────────────────────────
export function AskClaudeView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState<ScopeId>('all');
  const [scopeOpen, setScopeOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentScope = SCOPES.find(s => s.id === scope)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      // Calls /api/claude — a Cloudflare Pages Function that proxies to Anthropic.
      // The API key lives server-side in Cloudflare env vars; it never reaches the browser.
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          system: buildSystemPrompt(scope),
          messages: history,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text().catch(() => '');
        throw new Error(`API ${res.status}: ${errBody.slice(0, 200)}`);
      }
      const data = await res.json();
      const reply = data.content?.find((b: any) => b.type === 'text')?.text ?? 'No response.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `**Could not reach Claude.**\n\n\`${err}\`\n\n**Setup checklist:**\n- Deployed to Cloudflare Pages (not GitHub Pages)?\n- \`ANTHROPIC_API_KEY\` set in Cloudflare Pages → Settings → Environment variables?\n- \`functions/api/claude.js\` present in the repo root?`,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>

      {/* ── Header ── */}
      <div style={{ padding: '20px 28px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <Sparkles style={{ width: 18, height: 18, color: 'var(--brand)' }} />
              <h1 className="rr-serif" style={{ fontSize: 22, color: 'var(--text)', letterSpacing: '-0.02em' }}>Ask Claude</h1>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.5 }}>
              Ask anything about your research — stakeholder quotes, product gaps, competitive positioning, design decisions. Answers are grounded in your Granola sessions.
            </p>
          </div>

          {/* Scope picker */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setScopeOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
                borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: `${currentScope.color}12`,
                color: currentScope.color,
                border: `1px solid ${currentScope.color}30`,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: currentScope.color, flexShrink: 0 }} />
              {currentScope.label}
              <ChevronDown style={{ width: 12, height: 12, transform: scopeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
            {scopeOpen && (
              <div style={{
                position: 'absolute', top: '110%', right: 0, zIndex: 99,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, overflow: 'hidden', width: 200,
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              }}>
                {SCOPES.map(s => (
                  <button key={s.id} onClick={() => { setScope(s.id); setScopeOpen(false); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 14px', fontSize: 13, cursor: 'pointer', textAlign: 'left',
                      background: scope === s.id ? `${s.color}10` : 'transparent',
                      color: scope === s.id ? s.color : 'var(--text2)',
                      border: 'none', fontWeight: scope === s.id ? 600 : 400,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Setup required banner — shows on GitHub Pages where /api/claude doesn't exist */}
        {messages.length === 0 && (
          <div style={{
            padding: '10px 16px', marginBottom: 12, borderRadius: 10,
            background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
            fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6,
          }}>
            <strong style={{ color: '#D97706' }}>Setup required for Ask Claude:</strong>
            {' '}Deploy to <strong>Cloudflare Pages</strong> and set{' '}
            <code style={{ fontFamily: 'monospace', background: 'var(--surface-secondary)', padding: '1px 4px', borderRadius: 3 }}>
              ANTHROPIC_API_KEY
            </code>
            {' '}as an environment variable. See <strong>DEPLOY.md</strong> in the repo. GitHub Pages does not support server-side functions.
          </div>
        )}

        {/* Suggested prompts — only when no messages */}
        {messages.length === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
            {SUGGESTED.slice(0, 6).map((s, i) => (
              <button key={i}
                onClick={() => sendMessage(s.prompt)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px',
                  borderRadius: 10, border: '1px solid var(--border)',
                  background: 'var(--surface)', cursor: 'pointer', textAlign: 'left',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--brand)'; e.currentTarget.style.background = 'rgba(227,28,121,0.04)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}
              >
                <Sparkles style={{ width: 13, height: 13, color: 'var(--brand)', marginTop: 1, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{s.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 28px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, marginBottom: 20,
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
          }}>
            {/* Avatar */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
              background: msg.role === 'user' ? 'var(--brand)' : 'var(--surface)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
              color: msg.role === 'user' ? 'white' : 'var(--brand)',
            }}>
              {msg.role === 'user' ? 'R' : '✦'}
            </div>

            {/* Bubble */}
            <div style={{
              maxWidth: '80%',
              background: msg.role === 'user' ? 'var(--brand)' : 'var(--surface)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
              padding: '12px 16px',
            }}>
              {msg.role === 'user'
                ? <p style={{ fontSize: 13, color: 'white', margin: 0, lineHeight: 1.6 }}>{msg.content}</p>
                : <div>{renderMarkdown(msg.content)}</div>}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: 'var(--brand)' }}>✦</div>
            <div style={{ padding: '12px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px 14px 14px 14px' }}>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center', height: 20 }}>
                {[0, 1, 2].map(j => (
                  <div key={j} style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--brand)',
                    animation: `pulse 1.2s ease-in-out ${j * 0.2}s infinite`,
                    opacity: 0.6,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ── */}
      <div style={{ padding: '12px 28px 20px', flexShrink: 0, borderTop: '1px solid var(--border)' }}>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])}
            style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text3)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 10, padding: 0 }}>
            <RotateCcw style={{ width: 11, height: 11 }} /> New conversation
          </button>
        )}
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-end',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '10px 12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Ask about ${currentScope.label.toLowerCase()}… (Enter to send, Shift+Enter for newline)`}
            rows={1}
            style={{
              flex: 1, resize: 'none', background: 'transparent', border: 'none', outline: 'none',
              fontSize: 13, color: 'var(--text)', lineHeight: 1.6,
              maxHeight: 120, overflowY: 'auto', fontFamily: 'inherit',
            }}
            onInput={e => {
              const el = e.currentTarget;
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              width: 32, height: 32, borderRadius: 8, border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              background: input.trim() && !loading ? 'var(--brand)' : 'var(--border2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              transition: 'background 0.15s',
            }}
          >
            <Send style={{ width: 14, height: 14, color: 'white' }} />
          </button>
        </div>
        <p style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, textAlign: 'center' }}>
          Powered by Claude Sonnet · Context: your Granola sessions + product knowledge base
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
