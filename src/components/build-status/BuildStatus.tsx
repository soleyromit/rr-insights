// components/build-status/BuildStatus.tsx — per-product Build Status
// section. Renders what exxat-admin-workspace has actually shipped,
// grouped by feature area, filterable by persona. Populated by the
// build-status-sync automation — empty until the first automated run.
import { useState } from 'react';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Card } from '@astryxdesign/core/Card';
import { Text } from '@astryxdesign/core/Text';
import { Heading } from '@astryxdesign/core/Heading';
import { Token } from '@astryxdesign/core/Token';
import { Link } from '@astryxdesign/core/Link';
import { TokenFilterRow } from '../ui/TokenFilterRow';
import { buildStatusForProduct } from '../../lib/selectors';
import { PERSONAS } from '../../data/personas';
import { BuildStatusPill } from './BuildStatusPill';
import type { BuildStatusEntry, BuildStatusProductId, PersonaId } from '../../types';

export function BuildStatus({ productId }: { productId: BuildStatusProductId }) {
  const [personaFilter, setPersonaFilter] = useState<string | undefined>(undefined);
  const entries = buildStatusForProduct(productId);

  if (entries.length === 0) {
    return (
      <Card variant="muted" padding={4}>
        <Text type="body" color="secondary">
          Not yet synced — no build-status data recorded for this product yet.
        </Text>
      </Card>
    );
  }

  const personasPresent = [...new Set(entries.flatMap((e) => e.personaIds))];
  const visible = personaFilter
    ? entries.filter((e) => e.personaIds.includes(personaFilter as PersonaId))
    : entries;

  const grouped = new Map<string, BuildStatusEntry[]>();
  for (const e of visible) {
    const list = grouped.get(e.featureArea) ?? [];
    list.push(e);
    grouped.set(e.featureArea, list);
  }

  return (
    <VStack gap={4}>
      {personasPresent.length > 0 && (
        <TokenFilterRow
          allLabel="All personas"
          value={personaFilter}
          onChange={setPersonaFilter}
          options={personasPresent.map((pid) => ({
            key: pid,
            label: PERSONAS.find((p) => p.id === pid)?.name ?? pid,
          }))}
        />
      )}

      {visible.length === 0 && (
        <Text type="body" color="secondary">
          Nothing built for this persona yet.
        </Text>
      )}

      {[...grouped.entries()].map(([featureArea, featureEntries]) => (
        <VStack key={featureArea} gap={2}>
          <Heading level={3}>{featureArea}</Heading>
          {featureEntries.map((entry) => (
            <Card key={entry.id} padding={4}>
              <VStack gap={2}>
                <HStack gap={2} vAlign="center" wrap="wrap">
                  <BuildStatusPill status={entry.status} confidence={entry.confidence} />
                  {entry.personaIds.map((pid) => (
                    <Token key={pid} label={PERSONAS.find((p) => p.id === pid)?.name ?? pid} color="purple" />
                  ))}
                </HStack>
                <Text type="body" as="p">{entry.summary}</Text>
                <Text type="supporting" color="secondary" as="p">User flow: {entry.userFlow}</Text>
                <Text type="supporting" color="secondary" as="p">Logic: {entry.functionalLogic}</Text>
                {entry.evidence.length > 0 && (
                  <HStack gap={2} wrap="wrap">
                    {entry.evidence.map((ev, idx) => (
                      <Link
                        key={idx}
                        href={`https://github.com/soleyromit/exxat-admin-workspace/blob/${ev.commit}/${ev.file}`}
                        isStandalone
                      >
                        {ev.file} @ {ev.commit.slice(0, 7)}
                      </Link>
                    ))}
                  </HStack>
                )}
                <Text type="supporting" color="secondary">Last checked {entry.lastCheckedAt}</Text>
              </VStack>
            </Card>
          ))}
        </VStack>
      ))}
    </VStack>
  );
}
