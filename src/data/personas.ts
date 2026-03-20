// ─────────────────────────────────────────────
//  data/personas.ts
// ─────────────────────────────────────────────
import type { PersonaMeta } from '../types';

export const PERSONAS: PersonaMeta[] = [
{
  id: 'student',
  name: 'Student',
  role: 'Clinical program enrollee · Test-taker · Competency earner',
  avatarInitials: 'St',
  avatarColor: 'rgba(139,127,245,0.2)'
},
{
  id: 'dce',
  name: 'DCE / Faculty',
  role: 'Director of Clinical Education · Question author · Admin',
  avatarInitials: 'DC',
  avatarColor: 'rgba(46,196,160,0.2)'
},
{
  id: 'scce',
  name: 'SCCE',
  role: 'Site Coordinator of Clinical Education · Preceptor',
  avatarInitials: 'SC',
  avatarColor: 'rgba(245,166,35,0.2)'
},
{
  id: 'program-director',
  name: 'Program Director',
  role: 'Accreditation owner · Executive stakeholder · Cohort lead',
  avatarInitials: 'PD',
  avatarColor: 'rgba(120,170,245,0.2)'
}];


// ─────────────────────────────────────────────
//  data/roadmap.ts
// ─────────────────────────────────────────────
import type { TimelineItem } from '../types';

export const EXAM_TIMELINE: TimelineItem[] = [
{ title: 'April 17 demo', date: 'Apr 17, 2026', description: 'Student + admin + faculty prototypes. Question bank entry points. Accessibility V0.', color: '#8b7ff5', status: 'active' },
{ title: 'May — Architecture review', date: 'May 2026', description: 'Role-based access. No AI yet. Q-bank architecture locked.', color: '#2ec4a0', status: 'upcoming' },
{ title: 'July — UNF pilot', date: 'Jul 2026', description: 'Annual graduation exam. Accessibility must be complete. MCQ format.', color: '#f5a623', status: 'upcoming' },
{ title: 'AI sprint', date: 'Jul–Aug 2026', description: 'Bloom\'s tagging, question gen, PANCE predictor. Live before Cohere.', color: '#8b7ff5', status: 'upcoming' },
{ title: 'ExamSoft-competitive launch', date: 'Nov–Dec 2026', description: 'Full AI + security posture. Cannot launch half-baked.', color: '#e8604a', status: 'upcoming' }];


export const PLATFORM_SIGNALS = [
{ label: 'AI opportunity layer', count: 5, color: '#2ec4a0', isNew: true },
{ label: 'Multi-campus fragmentation', count: 3, color: '#f5a623', isNew: true },
{ label: 'Reporting deficit', count: 3, color: '#e8604a', isNew: false },
{ label: 'Cognitive overload', count: 3, color: '#8b7ff5', isNew: false },
{ label: 'Standalone skills entity', count: 2, color: '#e87ab5', isNew: true },
{ label: 'Mobile gap (SCCE)', count: 2, color: '#78aaf5', isNew: false }];