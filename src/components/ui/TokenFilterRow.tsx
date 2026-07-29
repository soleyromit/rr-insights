// components/ui/TokenFilterRow.tsx — the shared chip filter row (v19).
// Pages pair this with useParamState instead of hand-rolling setParams logic.
import { HStack } from '@astryxdesign/core/HStack';
import { Token } from '@astryxdesign/core/Token';

export interface TokenFilterOption {
  key: string;
  label: string;
  count?: number;
}

export interface TokenFilterRowProps {
  options: TokenFilterOption[];
  value?: string;
  onChange: (v?: string) => void;
  allLabel?: string;
}

export function TokenFilterRow({ options, value, onChange, allLabel = 'All' }: TokenFilterRowProps) {
  return (
    <HStack gap={1.5} vAlign="center" wrap="wrap">
      <Token
        label={allLabel}
        color={value === undefined ? 'blue' : 'default'}
        onClick={() => onChange(undefined)}
      />
      {options.map((o) => (
        <Token
          key={o.key}
          label={o.count !== undefined ? `${o.label} · ${o.count}` : o.label}
          color={value === o.key ? 'blue' : 'default'}
          onClick={() => onChange(o.key)}
        />
      ))}
    </HStack>
  );
}
