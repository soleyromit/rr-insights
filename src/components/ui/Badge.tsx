const VARIANTS: Record<string, string> = {
  gap:       'badge badge-gap',
  theme:     'badge badge-theme',
  opportunity:'badge badge-opp',
  persona:   'badge badge-persona',
  ai:        'badge badge-ai',
  platform:  'badge badge-platform',
  new:       'badge badge-new',
  architecture:'badge badge-theme',
};

export function Badge({ children, variant = 'theme' }: { children: React.ReactNode; variant?: string }) {
  return <span className={VARIANTS[variant] || 'badge badge-theme'}>{children}</span>;
}
