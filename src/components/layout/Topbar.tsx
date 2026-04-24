import { SearchIcon, ExternalLinkIcon } from 'lucide-react';
import { VERSION_HISTORY } from '../../data/personas';

type ViewId = string;
interface Props { activeView: ViewId; onNav: (v: ViewId) => void; }

const LABELS: Record<string, string> = {
  overview: 'Overview', whiteboard: 'Whiteboard artifacts', competitive: 'Competitive analysis',
  changelog: 'Changelog', 'exam-management': 'Exam Management', faas: 'FaaS 2.0',
  'course-eval': 'Course & Faculty Eval', 'skills-checklist': 'Skills Checklist',
  'learning-contracts': 'Learning Contracts', personas: 'Persona map',
  themes: 'Theme clusters', roadmap: 'Roadmap', portfolio: 'Staff signal', stakeholder: 'Stakeholder deck',
  narrative: 'Connect the Dots — 5 Arguments',
};

export function Topbar({ activeView }: Props) {
  const v = VERSION_HISTORY[0];
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b" style={{ background: '#fff', borderColor: 'var(--border)' }}>
      <div className="flex items-center gap-2" style={{ fontSize: 14 }}>
        <span style={{ color: 'var(--text3)' }}>rr-insights</span>
        <span style={{ color: 'var(--text3)' }}>/</span>
        <span style={{ fontWeight: 500, color: 'var(--text)' }}>{LABELS[activeView] ?? activeView}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-text"
          style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text3)', minWidth: 200, fontSize: 13 }}>
          <SearchIcon size={13} /><span>Search insights…</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'var(--bg3)' }}>⌘K</span>
        </div>
        <span className="version-badge"><span style={{ color: '#6d5ed4' }}>●</span>{v.version} · {v.date}</span>
        <a href="https://soleyromit.github.io/rr-insights/" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 transition-colors" style={{ color: 'var(--text3)', fontSize: 13 }}>
          <ExternalLinkIcon size={12} />Live site
        </a>
      </div>
    </div>
  );
}
