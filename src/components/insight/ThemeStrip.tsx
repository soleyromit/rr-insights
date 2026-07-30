// components/insight/ThemeStrip.tsx — "what are the themes in this product",
// computed live, every count links to the query that produces it (link contract).
import { HStack } from '@astryxdesign/core/HStack';
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { THEMES } from '../../data/themes';
import { insightsWhere } from '../../lib/selectors';
import { hrefInsights } from '../../lib/links';

export function ThemeStrip({ productId }: { productId: string }) {
  const groups = THEMES.map((t) => ({ t, n: insightsWhere({ product: productId, theme: t.id }).length }))
    .filter((g) => g.n > 0)
    .sort((a, b) => b.n - a.n);
  if (!groups.length) return null;
  return (
    <VStack gap={2}>
      <Text type="label" color="secondary">
        Themes in this product
      </Text>
      <HStack gap={1.5} wrap="wrap">
        {groups.map(({ t, n }) => (
          <Link key={t.id} href={hrefInsights({ product: productId, theme: t.id })}>
            <Token label={`${t.title} · ${n}`} />
          </Link>
        ))}
      </HStack>
    </VStack>
  );
}
