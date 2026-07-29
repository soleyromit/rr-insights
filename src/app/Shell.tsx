// app/Shell.tsx — the Astryx application frame (v18): AppShell + SideNav from
// the route registry, TopNav with breadcrumbs + search, and a ⌘K command
// palette over the whole corpus. Replaces the old Sidebar/Topbar pair and the
// decoy search box.
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppShell } from '@astryxdesign/core/AppShell';
import { SideNav, SideNavHeading, SideNavItem, SideNavSection } from '@astryxdesign/core/SideNav';
import { TopNav } from '@astryxdesign/core/TopNav';
import { Breadcrumbs, BreadcrumbItem } from '@astryxdesign/core/Breadcrumbs';
import { Button } from '@astryxdesign/core/Button';
import { Icon } from '@astryxdesign/core/Icon';
import { Badge } from '@astryxdesign/core/Badge';

import { Text } from '@astryxdesign/core/Text';
import { CommandPalette } from '@astryxdesign/core/CommandPalette';
import { createStaticSource } from '@astryxdesign/core/Typeahead';
import { ROUTES, SECTION_LABELS, routeForPath } from './routes';
import type { NavSection } from './routes';
import { paletteItems } from '../lib/search';
import type { PaletteItem } from '../lib/search';
import { VERSION, LAST_UPDATED } from '../data/version';

const NAV_SECTIONS: NavSection[] = ['home', 'explore', 'products', 'story', 'library'];

function isSelected(pathname: string, path: string): boolean {
  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}

function crumbsFor(pathname: string): { label: string; href?: string }[] {
  const route = routeForPath(pathname);
  if (pathname === '/') return [{ label: 'Overview' }];
  const crumbs: { label: string; href?: string }[] = [{ label: 'rr-insights', href: '/' }];
  const segs = pathname.split('/').filter(Boolean);
  let acc = '';
  for (const seg of segs) {
    acc += `/${seg}`;
    const r = routeForPath(acc);
    const last = acc === pathname;
    crumbs.push({
      label: r?.label ?? (last && !route ? seg : seg.replace(/-/g, ' ')),
      href: last ? undefined : r ? acc : undefined,
    });
  }
  return crumbs;
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const source = useMemo(() => createStaticSource(paletteItems()), []);
  const itemHref = useMemo(() => {
    const m = new Map<string, string>();
    for (const it of paletteItems()) m.set(it.id, it.auxiliaryData!.href);
    return m;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const crumbs = crumbsFor(pathname);

  return (
    <>
      <AppShell
        height="fill"
        contentPadding={0}
        variant="elevated"
        topNav={
          <TopNav
            label="Breadcrumb navigation"
            startContent={
              <Breadcrumbs>
                {crumbs.map((c, i) => (
                  <BreadcrumbItem key={i} href={c.href} isCurrent={i === crumbs.length - 1}>
                    {c.label}
                  </BreadcrumbItem>
                ))}
              </Breadcrumbs>
            }
            endContent={
              <>
                <Button
                  label="Search"
                  variant="secondary"
                  size="sm"
                  icon={<Icon icon="search" />}
                  tooltip="Search everything (⌘K)"
                  onClick={() => setPaletteOpen(true)}
                />
                <Badge>{`v${VERSION} · ${LAST_UPDATED}`}</Badge>
              </>
            }
          />
        }
        sideNav={
          <SideNav
            header={<SideNavHeading heading="Insight Hub" subheading="rr-insights" headingHref="/" />}
            collapsible
          >
            {NAV_SECTIONS.map((section) => {
              const items = ROUTES.filter((r) => r.section === section);
              if (!items.length) return null;
              const body = items.map((r) => (
                <SideNavItem
                  key={r.path}
                  label={r.label}
                  href={r.path}
                  isSelected={isSelected(pathname, r.path)}
                />
              ));
              if (section === 'home') return body;
              return (
                <SideNavSection key={section} title={SECTION_LABELS[section]}>
                  {body}
                </SideNavSection>
              );
            })}
          </SideNav>
        }
      >
        <div id="main-content" style={{ height: '100%', overflowY: 'auto' }}>
          {children}
        </div>
      </AppShell>
      <CommandPalette
        isOpen={paletteOpen}
        onOpenChange={setPaletteOpen}
        searchSource={source}
        label="Search the research repository"
        onValueChange={(id) => {
          const href = itemHref.get(id);
          if (href) {
            navigate(href);
            setPaletteOpen(false);
          }
        }}
        renderItem={(item: PaletteItem) => (
          <>
            <Text type="body" style={{ flex: 1 }}>
              {item.label}
            </Text>
            {item.auxiliaryData?.hint && <Text type="meta">{item.auxiliaryData.hint}</Text>}
          </>
        )}
      />
    </>
  );
}
