// data/pceDelayDrivers.ts — PCE Delay Drivers dataset (v19.15).
// The thesis, stated once so every number below reads against it: PCE has
// been called out for delay twice (Jun 3, Aug 12). The record — a live
// SharePoint tracker, Outlook, Teams, and this corpus's own Aug 24 sync —
// points the other way: churn and review latency on the reviewer's side,
// not design throughput. Re-pulled fresh Aug 26, 2026, not copied from the
// earlier standalone report this page is built to replace (Aug 19, 2026).
// Two things from that earlier report are carried forward rather than
// re-derived, and labeled as such: the Jun 3/Jul 7/Aug 12/Aug 18 timeline
// entries and the Aug 17-19 chat thread — GitHub is unavailable this
// session (MCP auth failure) so the 76+ change-request floor is carried
// forward too. Everything else — the tracker, the Aug 19 email reconfirm,
// and the full 20-occurrence attendance ledger — was read live today.

export type Verification = 'carried-forward' | 'reverified' | 'new';

export interface DelayTimelineEvent {
  date: string;
  isoDate: string;
  tag: 'callout' | 'admission' | 'confirmed' | 'new' | 'context';
  title: string;
  quote: string;
  source: string;
  verification: Verification;
}

export const DELAY_TIMELINE: DelayTimelineEvent[] = [
  {
    date: 'Jun 3', isoDate: '2026-06-03', tag: 'callout',
    title: '"Design velocity too slow" — callout #1',
    quote: '"0.5–1 screen/week — too slow"',
    source: 'Prior PCE delay-tracking report, Aug 19 2026',
    verification: 'carried-forward',
  },
  {
    date: 'Jul 7', isoDate: '2026-07-07', tag: 'admission',
    title: 'Review chain restructured',
    quote: '"Multiple stakeholders had been slowing design delivery"',
    source: "Leadership's own record, via the Aug 19 report",
    verification: 'carried-forward',
  },
  {
    date: 'Aug 12', isoDate: '2026-08-12', tag: 'callout',
    title: '"Deliveries flagged too slow" — callout #2',
    quote: 'Same note: "PMs adding requirements post-delivery"',
    source: 'Prior PCE delay-tracking report, Aug 19 2026',
    verification: 'carried-forward',
  },
  {
    date: 'Aug 18', isoDate: '2026-08-18', tag: 'admission',
    title: 'Reviewer admits no spec check',
    quote: '"I have not been able to review the design against the spec. But can you please take another look at the dashboard... I feel we can enhance the UX."',
    source: 'Vishal Karuparthi · Teams, 16:17',
    verification: 'carried-forward',
  },
  {
    date: 'Aug 19', isoDate: '2026-08-19', tag: 'confirmed',
    title: 'Full 9-case dashboard rewrite arrives',
    quote: '"UI feedback on Dashboard" shared with Monil Pokar + Romit Soley — a 9-case, section-by-section rewrite of the dashboard walkthrough held 3 hours earlier.',
    source: 'Vishal Karuparthi · Outlook share notification, 12:38pm — re-confirmed via Outlook search, Aug 26',
    verification: 'reverified',
  },
  {
    date: 'Aug 24', isoDate: '2026-08-24', tag: 'confirmed',
    title: "Romit's delay-tracking dashboard reaches Himanshu and Arun",
    quote: 'Himanshu (Prism design lead) independently confirms the identical redesign-cycle / review-latency shape from his own team\'s manual tracking. Arun, shown a summary: "The goal is for us to be able to get along and work, not justify on either party side... it should not even be necessary to do this sort of a thing."',
    source: 'Office Hour — Design System · Aug 24 (414e5c37); 1:1 with Arun · Aug 24 (1429c8c8) — see ins-process-aug24-01',
    verification: 'reverified',
  },
  {
    date: 'Aug 26', isoDate: '2026-08-26', tag: 'new',
    title: 'Tracker + calendar re-pull, today',
    quote: 'Create Survey/Distribution and Create Template — the two features the Aug 19 report flagged as most severely blocked (54d and 16d) — now show Design Freeze. Dashboard – Term Card is now the single worst performer (10% overall, still design-blocked, ETA Aug 31). The full 20-occurrence sync-attendance ledger was read individually via Microsoft Graph: Vishal Karuparthi has accepted 40% of syncs since May 12, against Monil Pokar\'s 95%.',
    source: 'PCE Project Tracker.xlsx + Outlook calendar, read live via Microsoft Graph — today',
    verification: 'new',
  },
];

export interface FeatureStatusRow extends Record<string, unknown> {
  id: string;
  feature: string;
  trackerRow: string;
  designStatus: string;
  designEta: string;
  backend: string;
  frontend: string;
  overallPct: number;
  flag: 'on-track' | 'awaiting-designs' | 'to-be-groomed' | 'open';
  note: string;
}

// Project Summary sheet, PCE Project Tracker.xlsx — read live Aug 26, 2026.
export const FEATURE_STATUS: FeatureStatusRow[] = [
  { id: 'create-survey', feature: 'Create Survey / Distribution', trackerRow: '#2 Schedule and Distribute Survey', designStatus: 'Freeze', designEta: '8/15/2026', backend: 'v1 Done', frontend: 'v1 Done', overallPct: 70, flag: 'on-track', note: 'On track — unblocked since the 54-day review cycle the Aug 19 report flagged.' },
  { id: 'manage-surveys', feature: 'Manage Surveys', trackerRow: '#3 Manage Surveys', designStatus: 'Freeze', designEta: '8/15/2026', backend: 'To be picked', frontend: 'To be picked', overallPct: 60, flag: 'awaiting-designs', note: 'Design frozen, but engineering has not started — awaiting designs on the build side, not the design side.' },
  { id: 'dashboard', feature: 'Dashboard – Term Card', trackerRow: '#8 Dashboard - Term Card', designStatus: 'In Design', designEta: '8/31/2026', backend: 'To be Groomed', frontend: 'Awaiting Designs', overallPct: 10, flag: 'awaiting-designs', note: 'Worst performer on the tracker — reopened Aug 17, still blocked, 5 days to its own ETA.' },
  { id: 'create-template', feature: 'Create Template', trackerRow: '#1 Create and view Template', designStatus: 'Freeze', designEta: '—', backend: 'v1 Done', frontend: 'v1 Done', overallPct: 90, flag: 'on-track', note: 'On track, "No Action Needed" — unblocked since the 16-day layout dispute the Aug 19 report flagged.' },
  { id: 'analytics', feature: 'Analytics', trackerRow: '#5 Single Survey Analytics', designStatus: 'In Design', designEta: '8/28/2026', backend: 'v1 Done', frontend: 'Awaiting Designs', overallPct: 70, flag: 'awaiting-designs', note: '"UI changes to be made" — backend complete, frontend still waiting on design.' },
  { id: 'common-setup', feature: 'Setup / Common Settings', trackerRow: '#9 Common Setup', designStatus: 'Pick Next', designEta: '9/2/2026', backend: 'To be Groomed', frontend: 'To be Groomed', overallPct: 40, flag: 'to-be-groomed', note: 'Not yet started on either side.' },
  { id: 'directory-terms', feature: 'Directory – Terms', trackerRow: '#10 Directory - Terms', designStatus: 'NA', designEta: '—', backend: 'To be Groomed', frontend: '—', overallPct: 10, flag: 'open', note: 'Open — no design status recorded yet.' },
];

export interface EscalationPoint { key: string; label: string; hint: string; value: number }

// T129 (Create Survey / Distribution) blocked-directive count, cross-corroborated
// by both the Aug 19 report and, independently, Himanshu's own tracking on
// Aug 24 (ins-process-aug24-01) — the same escalation, seen from two sides.
export const T129_ESCALATION: EscalationPoint[] = [
  { key: 'jul24', label: 'Jul 24', hint: 'flagged P0', value: 0 },
  { key: 'aug10', label: 'Aug 10', hint: 'still blocked', value: 18 },
  { key: 'aug17', label: 'Aug 17', hint: 'still blocked — 27-day recurring back-and-forth (ins-process-aug24-01)', value: 27 },
];

export interface DeadlineRow extends Record<string, unknown> {
  id: string;
  feature: string;
  designStatus: string;
  stale: boolean;
}

// All 5 rows still carry the identical handwritten note, unchanged since it
// was written: "Vishal to work with Romit to close designs by 20th Aug."
// Today is Aug 26 — 6 days overdue. `stale` marks rows whose design status
// has actually moved on (Freeze) while the tracker's note has not.
export const DEADLINE_ROWS: DeadlineRow[] = [
  { id: 'dl-2', feature: 'Schedule and Distribute Survey', designStatus: 'Freeze', stale: true },
  { id: 'dl-3', feature: 'Manage Surveys', designStatus: 'Freeze', stale: true },
  { id: 'dl-8', feature: 'Dashboard – Term Card', designStatus: 'In Design', stale: false },
  { id: 'dl-9', feature: 'Common Setup', designStatus: 'Pick Next', stale: false },
  { id: 'dl-10', feature: 'Directory – Terms', designStatus: 'NA', stale: false },
];

export const CHANGE_REQUEST_FLOOR = {
  count: '76+',
  note: 'The same floor figure produced independently twice — the Aug 19 report and, five days later, Himanshu\'s own Aug 24 tracking (ins-process-aug24-01) — using the same MS365/GitHub-scan method both times. Not re-run this session: the GitHub MCP connector is unavailable (auth failure), so this is carried forward, not re-derived.',
};

export interface AttendanceRow extends Record<string, unknown> {
  key: string;
  person: string;
  role: string;
  accepted: number;
  declined: number;
  noResponse: number;
  total: number;
}

// Every "Course Eval sync up" occurrence (organizer: Romit Soley) from its
// first instance to today, read individually via Microsoft Graph, Aug 26 —
// not sampled, not estimated. 20 of 20 occurrences, May 12 -> Aug 25, 2026.
export const ATTENDANCE: AttendanceRow[] = [
  { key: 'vishal', person: 'Vishal Karuparthi', role: 'required reviewer', accepted: 8, declined: 1, noResponse: 11, total: 20 },
  { key: 'monil', person: 'Monil Pokar', role: 'PM', accepted: 19, declined: 1, noResponse: 0, total: 20 },
];
export const ATTENDANCE_NOTE = 'Vishal: 8 accepted, 1 declined, 11 no-response, of 20. Monil: 19 accepted, 1 declined, of 20 — same series, same cadence, same two required attendees. This is a reviewer-specific pattern, not a general PM-side one.';

export interface ChatMessage {
  who: string;
  ts: string;
  text: string;
  mine: boolean;
  /** Chat sender role for ChatMessage: Romit is 'user', Vishal is 'assistant', meeting/email context notes are 'system'. */
  sender: 'user' | 'assistant' | 'system';
  channel?: string;
}

// The Aug 17-19 exchange, verbatim — carried forward from the Aug 19 report
// (not re-pulled live this session; Teams chat-message search hit Microsoft
// Graph rate limits before this specific thread could be re-fetched).
export const CHAT_THREAD: ChatMessage[] = [
  { who: 'Vishal Karuparthi', ts: '2026-08-17T13:52:00Z', text: "let's connect when you are available to go over the dashboard", mine: false, sender: 'assistant', channel: 'Teams' },
  { who: 'Course Eval sync', ts: '2026-08-18T09:30:00Z', text: "I'll collate the feedback offline, I'll share a document with you.", mine: false, sender: 'system' },
  { who: 'Vishal Karuparthi', ts: '2026-08-18T16:17:00Z', text: 'I have not been able to review the design against the spec. But can you please take another look at the dashboard... I feel we can enhance the UX.', mine: false, sender: 'assistant', channel: 'Teams' },
  { who: 'Romit Soley', ts: '2026-08-18T16:22:00Z', text: 'I have designed the dashboard following documentation which was previously approved. If we want to update the design, I would require clarification on why it isn\'t working out.', mine: true, sender: 'user', channel: 'Teams' },
  { who: 'Course Eval sync', ts: '2026-08-19T09:29:00Z', text: 'Dashboard walkthrough, Kanban layout, 5 term-card cases discussed. Next step assigned: "Build and deploy dashboard designs by evening" — same day.', mine: false, sender: 'system' },
  { who: 'Vishal Karuparthi', ts: '2026-08-19T12:38:00Z', text: 'Shares "UI feedback on Dashboard" — a 9-case, section-by-section rewrite of the dashboard just discussed 3 hours earlier. (Reconfirmed live via Outlook, Aug 26 — exact timestamp match.)', mine: false, sender: 'assistant', channel: 'Email' },
  { who: 'Vishal Karuparthi', ts: '2026-08-19T12:39:00Z', text: 'here is the feedback on dashboard design... We should connect to discuss this. Can we meet now?', mine: false, sender: 'assistant', channel: 'Teams' },
  { who: 'Vishal Karuparthi', ts: '2026-08-19T12:43:00Z', text: 'please give me a call when you come online. We need to discuss the dashboard feedback.', mine: false, sender: 'assistant', channel: 'Teams' },
];

export const CLOSING_NOTE = {
  reverifiedToday: 'The Aug 19 dashboard-rewrite share notification (exact timestamp match); the full 20-occurrence attendance ledger (individually read, not sampled); the tracker\'s current per-feature status and the Aug 20 deadline\'s unresolved state; Aug 24\'s delay-tracking-dashboard session, from this corpus\'s own sync.',
  carriedForward: 'The Jun 3 / Jul 7 / Aug 12 / Aug 18 timeline entries and the Aug 17-19 chat thread, sourced from the Aug 19 report and not independently re-pulled this session; the 76+ change-request floor (GitHub MCP connector unavailable this session — auth failure).',
  gaps: 'A third "too slow" callout since Aug 12 could not be confirmed or ruled out — Teams chat search hit Microsoft Graph rate limits (429) before completing. 9 of 13 tracker sheets were not read (resource-read budget exhausted) — a change-request log, if one exists there, was not independently retrieved. Per-feature "blocked-since" day counts beyond T129 (the Aug 19 report\'s 25d/16d/14d+ figures) cannot be recomputed from the tracker alone — it has no blocked-since date field.',
};
