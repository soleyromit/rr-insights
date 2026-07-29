// components/ui/sev.tsx — severity presentation helpers (v18). The single
// mapping from the taxonomy's severity levels onto Astryx status variants;
// status colors are reserved for severity and never reused as series colors.
import { StatusDot } from '@astryxdesign/core/StatusDot';
import { Badge } from '@astryxdesign/core/Badge';
import type { SeverityLevel } from '../../types';

type DotVariant = 'success' | 'warning' | 'error' | 'accent' | 'neutral';
type BadgeVariant = 'neutral' | 'info' | 'success' | 'warning' | 'error';

const DOT: Partial<Record<SeverityLevel, DotVariant>> = {
  critical: 'error',
  high: 'warning',
  medium: 'accent',
  low: 'neutral',
};

const BADGE: Partial<Record<SeverityLevel, BadgeVariant>> = {
  critical: 'error',
  high: 'warning',
  medium: 'info',
  low: 'neutral',
};

export function SevDot({ severity }: { severity?: SeverityLevel }) {
  const v = (severity && DOT[severity]) || 'neutral';
  return <StatusDot variant={v} label={severity ?? 'unrated'} tooltip={`Severity: ${severity ?? 'unrated'}`} />;
}

export function SevBadge({ severity }: { severity?: SeverityLevel }) {
  const v = (severity && BADGE[severity]) || 'neutral';
  return <Badge variant={v} label={severity ?? 'unrated'} />;
}
