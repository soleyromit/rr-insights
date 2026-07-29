// views/products/spec/SpecOutline.tsx — TOC for long spec pages (v19).
// Pair with SpecSection's anchorId: pages with ≥5 sections render this above
// the section stack so the reader can see the whole argument before scrolling.
import { Outline } from '@astryxdesign/core/Outline';

export interface SpecOutlineItem {
  id: string;
  label: string;
}

export function SpecOutline({ items }: { items: SpecOutlineItem[] }) {
  return (
    <Outline
      items={items.map((s) => ({ id: s.id, label: s.label, level: 2 }))}
      density="compact"
      label="Spec sections"
    />
  );
}
