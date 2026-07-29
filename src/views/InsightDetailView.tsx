// views/InsightDetailView.tsx — canonical page per insight (v18). The atom of
// the repository finally has a URL; ?from= renders a return affordance.
import { useParams, useSearchParams } from 'react-router-dom';
import { VStack } from '@astryxdesign/core/VStack';
import { Link } from '@astryxdesign/core/Link';
import { EmptyState } from '@astryxdesign/core/EmptyState';
import { InsightDoc } from '../components/insight/InsightDoc';
import { insightById } from '../lib/selectors';

export function InsightDetailView() {
  const { insightId } = useParams();
  const [params] = useSearchParams();
  const from = params.get('from');
  const insight = insightId ? insightById(insightId) : undefined;

  if (!insight) {
    return (
      <EmptyState
        title="Insight not found"
        description={`No insight with id "${insightId}" exists in the corpus.`}
      />
    );
  }

  return (
    <VStack gap={4} padding={6}>
      {from && (
        <Link href={from === 'overview' ? '/' : `/${from}`} isStandalone>
          ← Back to {from}
        </Link>
      )}
      <InsightDoc insight={insight} />
    </VStack>
  );
}
