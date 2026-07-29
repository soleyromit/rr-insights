// views/products/spec/SpecFooter.tsx — the dead-end guard for spec pages
// (v18). Every deep spec page routes back to its product hub and to the
// evidence that justifies it.
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { getProduct } from '../../../data/products';
import { hrefInsights, hrefProduct } from '../../../lib/links';
import { productFacts } from '../../../lib/selectors';
import { QueryLink } from '../../../components/story/QueryLink';

export function SpecFooter({ productId, extra }: { productId: string; extra?: React.ReactNode }) {
  const p = getProduct(productId);
  const f = productFacts(productId);
  return (
    <HStack gap={4} vAlign="center" wrap="wrap">
      <Link href={hrefProduct(productId)} isStandalone>
        ← {p?.name ?? productId} hub · {f.n} insights
      </Link>
      <QueryLink
        href={hrefInsights({ product: productId, severity: 'critical' })}
        count={f.critical}
        label="critical findings"
      />
      {extra}
    </HStack>
  );
}
