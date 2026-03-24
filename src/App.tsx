import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { OverviewView } from './views/OverviewView';
import { WhiteboardView } from './views/WhiteboardView';
import { CompetitiveView } from './views/CompetitiveView';
import { ChangelogView } from './views/ChangelogView';
import { ExamManagementView } from './views/products/ExamManagementView';
import { ProductViewShell } from './views/products/ProductViewShell';
import { PersonaMapView } from './views/PersonaMapView';
import { ThemesView } from './views/ThemesView';
import { RoadmapView } from './views/RoadmapView';
import { PortfolioView } from './views/PortfolioView';
import { StakeholderView } from './views/StakeholderView';
import type { ProductId } from './types';

const PRODUCT_IDS = new Set<ProductId>(['exam-management','faas','course-eval','skills-checklist','learning-contracts']);
const FULL_VIEWS = new Set<ProductId>(['exam-management']);
type ViewId = string;

export function App() {
  const [activeView, setActiveView] = useState<ViewId>('overview');
  function handleNav(view: ViewId) {
    setActiveView(view);
    const el = document.getElementById('main-content');
    if (el) el.scrollTop = 0;
  }
  function renderView() {
    if (activeView === 'overview')    return <OverviewView onNav={handleNav} />;
    if (activeView === 'whiteboard')  return <WhiteboardView />;
    if (activeView === 'competitive') return <CompetitiveView />;
    if (activeView === 'changelog')   return <ChangelogView />;
    if (activeView === 'personas')    return <PersonaMapView />;
    if (activeView === 'themes')      return <ThemesView />;
    if (activeView === 'roadmap')     return <RoadmapView />;
    if (activeView === 'portfolio')   return <PortfolioView />;
    if (activeView === 'stakeholder') return <StakeholderView />;
    if (PRODUCT_IDS.has(activeView as ProductId)) {
      if (FULL_VIEWS.has(activeView as ProductId)) return <ExamManagementView />;
      return <ProductViewShell productId={activeView as ProductId} />;
    }
    return <div className="flex-1 flex items-center justify-center" style={{color:'var(--text3)',fontSize:14}}>View not found.</div>;
  }
  return (
    <div className="flex h-screen overflow-hidden" style={{background:'var(--bg)'}}>
      <Sidebar activeView={activeView} onNav={handleNav} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar activeView={activeView} onNav={handleNav} />
        <div id="main-content" className="flex-1 overflow-y-auto">{renderView()}</div>
      </div>
    </div>
  );
}
