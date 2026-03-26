import { VERSION_HISTORY } from '../data/personas';

const FILE_COLORS: Record<string, string> = {
  'ExamManagementView': '#6d5ed4',
  'insights': '#2ec4a0',
  'products': '#e8604a',
  'personas': '#f5a623',
  'voices': '#78aaf5',
  'workflows': '#2ec4a0',
  'sync': '#4caf7d',
  'CLAUDE': '#f5a623',
};

function fileColor(f: string): string {
  for (const [key, color] of Object.entries(FILE_COLORS)) {
    if (f.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return '#888';
}

export function ChangelogView() {
  return (
    <div className="flex-1 overflow-y-auto" style={{ background: 'var(--bg)' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 24px 48px' }}>

        <p className="eyebrow mb-2">Changelog</p>
        <h1 className="serif text-[22px] font-medium mb-1" style={{ color: 'var(--text)' }}>
          Release history
        </h1>
        <p className="text-[13px] mb-8" style={{ color: 'var(--text3)' }}>
          Every version pushed to <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>soleyromit.github.io/rr-insights</span> by Claude.
        </p>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 11, top: 8, bottom: 8,
            width: 1, background: 'var(--border)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {VERSION_HISTORY.map((entry, i) => (
              <div key={entry.version} style={{ display: 'flex', gap: 24 }}>
                {/* Dot */}
                <div style={{ flexShrink: 0, paddingTop: 2 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: i === 0 ? '#6d5ed4' : 'var(--bg2)',
                    border: `2px solid ${i === 0 ? '#6d5ed4' : 'var(--border2)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1, position: 'relative',
                  }}>
                    {i === 0 && (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
                    <span style={{
                      fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700,
                      color: i === 0 ? '#6d5ed4' : 'var(--text)',
                    }}>
                      {entry.version}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text3)' }}>{entry.date}</span>
                    {i === 0 && (
                      <span style={{
                        fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                        background: 'rgba(109,94,212,0.1)', color: '#6d5ed4',
                        padding: '2px 7px', borderRadius: 10,
                      }}>
                        Latest
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 10 }}>
                    {entry.summary}
                  </p>

                  {/* Stats row */}
                  <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{entry.insightCount}</span> insights
                    </span>
                    {entry.sessionsAdded > 0 && (
                      <span style={{ fontSize: 11, color: 'var(--text3)' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>+{entry.sessionsAdded}</span> sessions
                      </span>
                    )}
                  </div>

                  {/* Changed files */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {entry.changedFiles.map(f => (
                      <span key={f} style={{
                        fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
                        padding: '2px 8px', borderRadius: 4,
                        background: `${fileColor(f)}15`,
                        color: fileColor(f),
                        border: `1px solid ${fileColor(f)}30`,
                      }}>
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 40, padding: '14px 18px',
          background: 'var(--bg2)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', fontSize: 11, color: 'var(--text3)',
        }}>
          Pushed directly by Claude via <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>ghp_</span> PAT → GitHub Actions → GitHub Pages. Zero manual steps.
        </div>
      </div>
    </div>
  );
}
