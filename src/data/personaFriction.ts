// data/personaFriction.ts — hand-curated persona × product friction matrix (from research synthesis).
// Rendered by the Persona Atlas heat grid; severity drives fill, cross names the platform signal.
import type { PersonaId, ProductId } from '../types';

export const PERSONA_PRODUCT_FRICTION: Record<PersonaId, Partial<Record<ProductId, {severity: 'critical' | 'high' | 'medium' | 'na';text: string;cross?: string;ai?: string;}>>> = {
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
