// lib/format.ts — display formatters for data-layer strings. The data keeps
// its raw conventions ("Aarti<>Kunal<>Romit", ISO dates); the UI never shows them.

/** Collaboration separator "<>" in source/speaker strings renders as " / ". */
export function formatSource(s: string): string {
  return s.split('<>').join(' / ');
}

/** ISO day ("2026-03-24") → "Mar 24, 2026". Anything unparseable passes through. */
export function formatDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
