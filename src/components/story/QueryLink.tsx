// components/story/QueryLink.tsx — a link that always carries the count/claim it
// expands (v19). There is deliberately no children prop: a context-free "→" link
// is unrepresentable with this API, which is the point.
import { Link } from '@astryxdesign/core/Link';

export interface QueryLinkProps {
  href: string;
  /** The number (or short figure like "27 in 30d") the link expands. */
  count: number | string;
  /** What the count counts, e.g. "critical findings". Rendered after the count. */
  label: string;
  isStandalone?: boolean;
}

export function QueryLink({ href, count, label, isStandalone = true }: QueryLinkProps) {
  return (
    <Link href={href} isStandalone={isStandalone}>
      {`${count} ${label} →`}
    </Link>
  );
}
