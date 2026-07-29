// views/products/spec/SpecFooter.tsx — the dead-end guard for spec pages
// (v18). Every deep spec page routes back to its product hub and to the
// evidence that justifies it.
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { getProduct } from '../../../data/products';
import { hrefInsights, hrefProduct } from '../../../lib/links';

export function SpecFooter({ productId, extra }: { productId: string; extra?: React.ReactNode }) {
  const p = getProduct(productId);
  return (
    <HStack gap={4} vAlign="center" wrap="wrap">
      <Link href={hrefProduct(productId)} isStandalone>
        ← {p?.name ?? productId} hub
      </Link>
      <Link href={hrefInsights({ product: productId })} isStandalone>
        Evidence: all tagged insights →
      </Link>
      {extra}
    </HStack>
  );
}
