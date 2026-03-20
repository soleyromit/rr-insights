import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { OverviewView } from './views/OverviewView';
import { ExamManagementView } from './views/products/ExamManagementView';
import { ProductViewShell } from './views/products/ProductViewShell';
import { PersonaMapView } from './views/PersonaMapView';
import { ThemesView } from './views/ThemesView';
import { RoadmapView } from './views/RoadmapView';
import { PortfolioView } from './views/PortfolioView';
import { StakeholderView } from './views/StakeholderView';
import type { ProductId } from './types';

// ─────────────────────────────────────────────
//  App — main router
//
//  ADDING A NEW PRODUCT:
//  1. Add ProductId to types/index.ts
//  2. Add entry to data/products.ts
//  3. Add insights to data/insights.ts
//  4. Either:
//     a) Copy ExamManagementView.tsx for a full deep-dive
//     b) ProductViewShell auto-handles with insights + roadmap tabs
//  5. No routing changes needed — App router auto-picks up new products
//     via the PRODUCT_IDS set below.
// ─────────────────────────────────────────────

const PRODUCT_IDS: Set<ProductId> = new Set([
'exam-management',
'faas',
'course-eval',
'skills-checklist',
'learning-contracts']
);

// Map of fully built-out product views (vs ProductViewShell)
const FULL_PRODUCT_VIEWS: Set<ProductId> = new Set(['exam-management']);

type ViewId = string;

export function App() {
  const [activeView, setActiveView] = useState<ViewId>('overview');

  function handleNav(view: ViewId) {
    setActiveView(view);
    // Scroll content area to top on navigation
    const content = document.getElementById('main-content');
    if (content) content.scrollTop = 0;
  }

  function renderView() {
    // Overview
    if (activeView === 'overview') return <OverviewView onNav={handleNav} />;

    // Product views
    if (PRODUCT_IDS.has(activeView as ProductId)) {
      if (FULL_PRODUCT_VIEWS.has(activeView as ProductId)) {
        return <ExamManagementView />;
      }
      return <ProductViewShell productId={activeView as ProductId} />;
    }

    // Intelligence views
    if (activeView === 'personas') return <PersonaMapView />;
    if (activeView === 'themes') return <ThemesView />;
    if (activeView === 'roadmap') return <RoadmapView />;

    // Portfolio views
    if (activeView === 'portfolio') return <PortfolioView />;
    if (activeView === 'stakeholder') return <StakeholderView />;

    // Fallback
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--text3)] text-[13px]">
        View "{activeView}" not found.
      </div>);

  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <Sidebar activeView={activeView} onNav={handleNav} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar activeView={activeView} onNav={handleNav} />
        <div
          id="main-content"
          className="flex-1 overflow-y-auto flex flex-col">
          
          {renderView()}
        </div>
      </div>
    </div>);

}