// views/products/spec/SectionTabs.tsx — URL-synced section tabs for spec
// pages (v18). Section state lives in ?section= so every tab is a shareable
// URL, per the InsightIndexView filter contract.
import { useSearchParams } from 'react-router-dom';
import { TabList, Tab } from '@astryxdesign/core/TabList';

export interface SectionDef {
  id: string;
  label: string;
}

export function useSection(sections: SectionDef[], fallback: string): [string, (id: string) => void] {
  const [params, setParams] = useSearchParams();
  const raw = params.get('section');
  const section = sections.some((s) => s.id === raw) ? (raw as string) : fallback;
  const setSection = (id: string) =>
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (id === fallback) p.delete('section');
        else p.set('section', id);
        return p;
      },
      { replace: true }
    );
  return [section, setSection];
}

export function SectionTabs({
  sections,
  value,
  onChange,
}: {
  sections: SectionDef[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <TabList value={value} onChange={onChange} size="md" hasDivider>
      {sections.map((s) => (
        <Tab key={s.id} value={s.id} label={s.label} />
      ))}
    </TabList>
  );
}
