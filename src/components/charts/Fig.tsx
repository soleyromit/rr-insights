// components/charts/Fig.tsx — figure chrome (v18; v19.5 adds the two universal
// chart contracts from ins-ds-jul-01: PNG + raw-data export on every figure,
// and an optional summary → expandable-detail slot).
import { useRef, useState } from 'react';
import { Card } from '@astryxdesign/core/Card';
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Text } from '@astryxdesign/core/Text';
import { Badge } from '@astryxdesign/core/Badge';
import { Button } from '@astryxdesign/core/Button';
import { QueryLink } from '../story/QueryLink';

export interface FigProps {
  title: string;
  caption?: string;
  actions?: React.ReactNode;
  /** Sample size shown as an "n = x" badge — the derived+annotated rule lives here. */
  n?: number;
  /** Sparse-data / methodology annotation, e.g. "May–Sep '25 tail: 3 insights total". */
  note?: string;
  /** Footer door into the query behind the figure. */
  link?: { href: string; count: number | string; label: string };
  /** Raw rows behind the figure — enables the CSV download (chart contract #1). */
  exportData?: Record<string, unknown>[];
  /** Filename stem for downloads; defaults from the title. */
  exportName?: string;
  /** Expandable full-detail content under the summary chart (chart contract #2). */
  detail?: React.ReactNode;
  detailLabel?: string;
  children: React.ReactNode;
}

const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'figure';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows: Record<string, unknown>[]): string {
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const cell = (v: unknown) => {
    const s = v === undefined || v === null ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [keys.join(','), ...rows.map((r) => keys.map((k) => cell(r[k])).join(','))].join('\n');
}

export function Fig({
  title, caption, actions, n, note, link, exportData, exportName, detail, detailLabel, children,
}: FigProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const [showDetail, setShowDetail] = useState(false);
  const name = exportName ?? slug(title);

  const downloadPng = () => {
    const svg = plotRef.current?.querySelector('svg');
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, rect.width * scale);
      canvas.height = Math.max(1, rect.height * scale);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const surface = getComputedStyle(document.body).backgroundColor || '#ffffff';
      ctx.fillStyle = surface;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => blob && downloadBlob(blob, `${name}.png`));
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`;
  };

  const downloadCsv = () => {
    if (!exportData?.length) return;
    downloadBlob(new Blob([toCsv(exportData)], { type: 'text/csv' }), `${name}.csv`);
  };

  return (
    <Card padding={4}>
      <VStack gap={3}>
        <HStack gap={2} vAlign="center" hAlign="between">
          <HStack gap={2} vAlign="center">
            <Text type="label" color="secondary">
              {title}
            </Text>
            {n !== undefined && <Badge variant="neutral" label={`n = ${n}`} />}
          </HStack>
          <HStack gap={1.5} vAlign="center">
            {actions}
            <Button label="PNG" variant="ghost" size="sm" onClick={downloadPng} />
            {exportData && exportData.length > 0 && (
              <Button label="CSV" variant="ghost" size="sm" onClick={downloadCsv} />
            )}
            {detail && (
              <Button
                label={showDetail ? 'Hide detail' : (detailLabel ?? 'Detail')}
                variant="ghost"
                size="sm"
                onClick={() => setShowDetail((s) => !s)}
              />
            )}
          </HStack>
        </HStack>
        <div ref={plotRef} role="img" aria-label={caption ? `${title}. ${caption}` : title}>
          {children}
        </div>
        {detail && showDetail && <VStack gap={2}>{detail}</VStack>}
        {caption && (
          <Text type="supporting" as="p">
            {caption}
          </Text>
        )}
        {note && (
          <Text type="supporting" as="p" color="secondary">
            {note}
          </Text>
        )}
        {link && <QueryLink href={link.href} count={link.count} label={link.label} />}
      </VStack>
    </Card>
  );
}
