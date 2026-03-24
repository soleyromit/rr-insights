export function CompetitiveView() {
  return <div className="flex-1 p-6 overflow-y-auto" style={{background:'var(--bg)'}}>
    <div style={{maxWidth:900,margin:'0 auto'}}>
      <p className="eyebrow mb-2">CompetitiveView</p>
      <h1 className="serif text-[22px] font-medium mb-4" style={{color:'var(--text)'}}>Coming in next sync</h1>
      <p style={{color:'var(--text2)'}}>This view is populated from Granola sessions. Sync to populate.</p>
    </div>
  </div>;
}
