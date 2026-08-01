// views/products/PortalView.tsx — Workspace Portal build-status page.
// Portal has no Granola-sourced research (internal tool, not a researched
// product), so this page shows only what's built — no gaps-from-research
// section, unlike the 5 researched products' spec pages.
import { VStack } from '@astryxdesign/core/VStack';
import { Text } from '@astryxdesign/core/Text';
import { PageHeader } from '../../components/ui/PageHeader';
import { BuildStatus } from '../../components/build-status/BuildStatus';
import { INTERNAL_TOOLS } from '../../data/internalTools';

const TOOL_ID = 'portal';

export function PortalView() {
  const tool = INTERNAL_TOOLS.find((t) => t.id === TOOL_ID);

  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title={tool?.name ?? 'Workspace Portal'}
        lede={tool?.description}
        meta={tool ? `Internal tool — ${tool.owner} · Users: ${tool.users}` : undefined}
      />
      <Text type="supporting" color="secondary" as="p">
        This page tracks what's actually shipped, synced automatically from
        exxat-admin-workspace. Portal has no Granola-sourced research corpus,
        so there's no gaps-from-research section here — just build status.
      </Text>
      <BuildStatus productId={TOOL_ID} />
    </VStack>
  );
}
