// components/ui/Figure.tsx — shared figure chrome for all chart surfaces.
// Chart discipline (SKILL §7 / DESIGN.md): the caption names the decision the chart supports.
// a11y: the figure is a labelled img region; the caption doubles as its accessible description.
export function Figure({ title, caption, ariaLabel, children }: {
  title: string; caption: string; ariaLabel?: string; children: React.ReactNode;
}) {
  return (
    <figure role="img" aria-label={ariaLabel ?? `${title}. ${caption}`}
      style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px 12px', margin: 0 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 10 }}>{title}</div>
      {children}
      <figcaption style={{ fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.45, marginTop: 8, borderTop: '1px solid var(--bg3)', paddingTop: 8 }}>{caption}</figcaption>
    </figure>
  );
}

// Page masthead — serif title, serif lede, mono provenance byline BELOW (no eyebrow kickers).
export function Masthead({ title, lede, byline, compact }: {
  title: string; lede: string; byline?: string; compact?: boolean;
}) {
  return (
    <div style={{ borderBottom: '2px solid var(--text)', paddingBottom: 18, marginBottom: 22 }}>
      <h1 className="rr-serif" style={{ fontSize: compact ? 26 : 34, color: 'var(--text)', lineHeight: 1.1, marginBottom: 8 }}>{title}</h1>
      <p className="serif" style={{ fontSize: 14.5, color: 'var(--text2)', maxWidth: 620, lineHeight: 1.55 }}>{lede}</p>
      {byline && <div className="mono" style={{ fontSize: 10.5, color: 'var(--text2)', marginTop: 10 }}>{byline}</div>}
    </div>
  );
}
