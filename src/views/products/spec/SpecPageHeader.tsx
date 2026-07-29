// views/products/spec/SpecPageHeader.tsx — the one spec-page masthead (v19).
// Row 1 title+actions, row 2 the CLAIM (never provenance — that goes in meta),
// row 3 live corpus facts as QueryLinks + staleness, then exactly one
// orienting figure: the page's claim as a visual.
import { VStack } from '@astryxdesign/core/VStack';
import { PageHeader } from '../../../components/ui/PageHeader';
import { StalenessMeter } from '../../../components/story/StalenessMeter';
import { productFacts } from '../../../lib/selectors';
import { hrefInsights } from '../../../lib/links';
import { formatDay } from '../../../lib/format';
import { CORPUS_ANCHOR } from '../../../lib/selectors';

export interface SpecPageHeaderProps {
  title: string;
  /** One argumentative sentence — the page's claim, not its provenance. */
  claim: string;
  /** Provenance and context (sessions, dates, personas). */
  meta?: string;
  productId: string;
  actions?: React.ReactNode;
  /** Exactly one orienting Fig, 200–280px — the claim as a visual. */
  orienting?: React.ReactNode;
}

export function SpecPageHeader({ title, claim, meta, productId, actions, orienting }: SpecPageHeaderProps) {
  const f = productFacts(productId);
  const since30 = new Date(new Date(CORPUS_ANCHOR).getTime() - 30 * 86400000)
    .toISOString()
    .slice(0, 10);
  return (
    <VStack gap={4}>
      <PageHeader
        title={title}
        lede={claim}
        meta={meta}
        actions={actions}
        facts={[
          { value: String(f.n), label: 'insights', href: hrefInsights({ product: productId }) },
          {
            value: String(f.critical),
            label: 'critical',
            href: hrefInsights({ product: productId, severity: 'critical' }),
          },
          {
            value: String(f.last30d),
            label: 'in last 30d',
            href: hrefInsights({ product: productId, since: since30, sort: 'newest' }),
          },
          ...(f.newestDate
            ? [
                {
                  value: formatDay(f.newestDate),
                  label: 'newest',
                  href: hrefInsights({ product: productId, sort: 'newest' }),
                },
              ]
            : []),
        ]}
        factsEnd={<StalenessMeter newestDate={f.newestDate} staleDays={f.staleDays} />}
      />
      {orienting}
    </VStack>
  );
}
