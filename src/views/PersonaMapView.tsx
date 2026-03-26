// ─────────────────────────────────────────────
//  views/PersonaMapView.tsx
// ─────────────────────────────────────────────
import { PRODUCTS } from '../data/products';
import { INSIGHTS } from '../data/insights';
import { PERSONAS } from '../data/personas';
import { Card, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import type { PersonaId, ProductId } from '../types';

const PERSONA_PRODUCT_FRICTION: Record<PersonaId, Partial<Record<ProductId, {severity: 'critical' | 'high' | 'medium' | 'na';text: string;cross?: string;ai?: string;}>>> = {
  student: {
    'exam-management': { severity: 'critical', text: 'No annotation (highlight/cross-out). Accessibility blocked by lockdown browser. UNF pilot July deadline.', cross: 'Overload', ai: 'AI: rationale post-submit' },
    faas: { severity: 'critical', text: 'No mid-save, opaque status. PDF split. Patient Log migration adds new surface.', cross: 'Overload' },
    'course-eval': { severity: 'high', text: 'Blue/Canvas dependency. Response rate below 60% accreditation threshold. Questions renumber on update.' },
    'skills-checklist': { severity: 'critical', text: 'Skills trapped in placements. "Have I done this skill across all rotations?" unanswerable. 80-90% build external docs.', cross: 'Overload', ai: 'AI: grad readiness' },
    'learning-contracts': { severity: 'high', text: 'Static objectives, no mid-cycle nudge. Social work: multi-semester scope mismatch.' }
  },
  dce: {
    'exam-management': { severity: 'critical', text: 'Multi-campus print→email→re-upload. Manual Bloom\'s tagging. No async review threads.', cross: 'Power user split', ai: 'AI: tag on import, blueprint gen' },
    faas: { severity: 'critical', text: '17k forms, no governance. Global settings break program configs. Preceptor intake now in FaaS.', cross: 'Power user split' },
    'course-eval': { severity: 'high', text: 'Dedicated module planned. Multi-instructor hybrid forms required.', ai: 'AI: theme extraction' },
    'skills-checklist': { severity: 'high', text: 'No dashboard across students per site. Batch evaluation UI needed: rows=students, cols=skills.' },
    'learning-contracts': { severity: 'high', text: 'Templates not linked to accreditor frameworks. No co-edit. Social work LC-eval integration gap.' }
  },
  scce: {
    'exam-management': { severity: 'na', text: 'Not a primary user.' },
    faas: { severity: 'critical', text: 'Infrequent login = relearning every time. CPI/FWPE mobile-only context. Preceptor intake adds burden.', cross: 'Mobile gap' },
    'course-eval': { severity: 'medium', text: 'No prior eval context when completing new one. OSCE multi-station not supported.' },
    'skills-checklist': { severity: 'critical', text: 'Competency verify on mobile, no tap-complete. Signature friction. Account recovery issues from infrequent login.', cross: 'Mobile gap', ai: 'AI: smart scheduling' },
    'learning-contracts': { severity: 'high', text: 'Co-signs at start, never re-engaged mid-cycle. Preceptor change mid-placement (social work) = no workflow.' }
  },
  'program-director': {
    'exam-management': { severity: 'high', text: 'No NCCPA blueprint alignment. PACRAT/PAEA/ExamSoft data in 3 systems. Monster Grid = triple-digit Excel.', cross: 'Reporting deficit', ai: 'AI: PANCE predictor' },
    faas: { severity: 'critical', text: 'NPS 2/5. No self-serve accreditation reports. PDF split. 95k tickets = systemic failure.', cross: 'Reporting deficit' },
    'course-eval': { severity: 'high', text: '7 survey types at Touro outside Exxat. 8-16% grad survey response rate. New module is strategic recovery.', cross: 'Reporting deficit', ai: 'AI: narrative synthesis' },
    'skills-checklist': { severity: 'medium', text: 'Procedure minimums tracking (3x per type, ARC-PA). "Show me the reds" filter. Overflow/catch-up rotation.' },
    'learning-contracts': { severity: 'medium', text: 'ARC-PA mandates competency evidence. Gaps only surface at self-study. 9 areas need demonstrable tracking.' }
  }
};

const SEV_STYLE: Record<string, string> = {
  critical: 'text-[#e8604a] bg-[rgba(232,96,74,0.12)]',
  high: 'text-[#f5a623] bg-[rgba(245,166,35,0.12)]',
  medium: 'text-[#4caf7d] bg-[rgba(76,175,125,0.10)]',
  na: 'text-[#5c5a57] bg-[var(--bg3)]'
};

export function PersonaMapView() {
  return (
    <div className="p-5 overflow-y-auto flex-1">
      <h1 className="rr-serif text-[24px] tracking-tight text-[var(--text)] mb-1">Cross-Product Persona Challenge Map</h1>
      <p className="text-[11px] text-[var(--text3)] mb-4">Updated with 39 Granola sessions · 6 platform-level signals · Click any cell for detail</p>

      <div className="flex gap-2 mb-4 flex-wrap">
        {[
        { label: 'Cognitive overload · 3 products', color: '#8b7ff5' },
        { label: 'Reporting deficit · 3 products', color: '#e8604a' },
        { label: 'Mobile gap · 2 products', color: '#78aaf5' },
        { label: 'AI opportunity · 5 products', color: '#2ec4a0', isNew: true },
        { label: 'Multi-campus fragmentation', color: '#f5a623', isNew: true },
        { label: 'Standalone skills entity', color: '#e87ab5', isNew: true }].
        map((s) =>
        <div key={s.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] border border-[rgba(139,127,245,0.2)] bg-[rgba(139,127,245,0.06)] text-[var(--accent)]" style={s.isNew ? { borderColor: 'rgba(46,196,160,0.3)', background: 'rgba(46,196,160,0.06)', color: '#2ec4a0' } : {}}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
            {s.label}
            {s.isNew && <span className="text-[10px] px-1 py-0.5 rounded bg-[rgba(46,196,160,0.15)] font-mono">New</span>}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[11px]" style={{ minWidth: 800 }}>
          <thead>
            <tr className="bg-[var(--bg3)]">
              <th className="px-3 py-2 text-left text-[11px] uppercase tracking-[0.07em] text-[var(--text3)] font-semibold w-[140px]">Persona</th>
              {PRODUCTS.map((p) =>
              <th key={p.id} className="px-3 py-2 text-left text-[11px] uppercase tracking-[0.07em] text-[var(--text3)] font-semibold border-l border-[var(--border)]">
                  {p.shortName}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {PERSONAS.map((persona) =>
            <tr key={persona.id} className="border-t border-[var(--border)] hover:bg-[rgba(255,255,255,0.01)] transition-colors">
                <td className="px-3 py-3 align-top border-r border-[var(--border)]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0" style={{ background: persona.avatarColor }}>
                      {persona.avatarInitials}
                    </div>
                    <div className="text-[11px] font-medium text-[var(--text)]">{persona.name}</div>
                  </div>
                  <div className="text-[11px] text-[var(--text3)] leading-[1.3]">{persona.role}</div>
                </td>
                {PRODUCTS.map((product) => {
                const cell = PERSONA_PRODUCT_FRICTION[persona.id]?.[product.id];
                if (!cell) return <td key={product.id} className="px-3 py-3 border-l border-[var(--border)] text-[var(--text3)] text-[10px]">—</td>;
                return (
                  <td key={product.id} className="px-3 py-3 border-l border-[var(--border)] align-top">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${SEV_STYLE[cell.severity]} inline-block mb-1.5`}>
                        {cell.severity.charAt(0).toUpperCase() + cell.severity.slice(1)}
                      </span>
                      <p className="text-[10px] text-[var(--text2)] leading-[1.4] mb-1">{cell.text}</p>
                      {cell.cross &&
                    <div className="text-[11px] px-1.5 py-0.5 rounded bg-[rgba(139,127,245,0.1)] text-[var(--accent)] inline-block mr-1">⬦ {cell.cross}</div>
                    }
                      {cell.ai &&
                    <div className="text-[11px] px-1.5 py-0.5 rounded bg-[rgba(76,175,125,0.1)] text-[#4caf7d] inline-block">✦ {cell.ai}</div>
                    }
                    </td>);

              })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>);

}