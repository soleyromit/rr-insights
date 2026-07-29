// @ts-nocheck
import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { OverviewView } from './views/OverviewView';
import { WhiteboardView } from './views/WhiteboardView';
import { CompetitiveView } from './views/CompetitiveView';
import { ChangelogView } from './views/ChangelogView';
import { ExamManagementView } from './views/products/ExamManagementView';
import { FaaSView } from './views/products/FaaSView';
import { CourseEvalView } from './views/products/CourseEvalView';
import { SkillsChecklistView } from './views/products/SkillsChecklistView';
import { LearningContractsView } from './views/products/LearningContractsView';
import { PersonaMapView } from './views/PersonaMapView';
import { SignalsView } from './views/SignalsView';
import { RoadmapView } from './views/RoadmapView';
import { PortfolioView } from './views/PortfolioView';
import { StakeholderView } from './views/StakeholderView';
import { KnowledgeGraphView } from './views/KnowledgeGraphView';
import { ExxatOneView } from './views/products/ExxatOneView';
import { ExamAdminAuditView } from './views/products/ExamAdminAuditView';
import { AnalyticsView } from './views/AnalyticsView';
import { ArunPerformanceView } from './views/ArunPerformanceView';
import { NPSView } from './views/NPSView';
import { NarrativeView } from './views/NarrativeView';
import { ProductPage } from './views/products/ProductPage';
import type { ProductId } from './types';

const PRODUCT_IDS = new Set<ProductId>(['exam-management','faas','course-eval','skills-checklist','learning-contracts']);
type ViewId = string;

export function App() {
  const [activeView, setActiveView] = useState<ViewId>('overview');
  function handleNav(view: ViewId) {
    setActiveView(view);
    const el = document.getElementById('main-content');
    if (el) el.scrollTop = 0;
  }
  function renderView() {
    if (activeView === 'overview')         return <OverviewView onNav={handleNav} />;
    if (activeView === 'whiteboard')       return <WhiteboardView onNav={handleNav} />;
    if (activeView === 'competitive')      return <CompetitiveView />;
    if (activeView === 'changelog')        return <ChangelogView />;
    if (activeView === 'personas')         return <PersonaMapView />;
    if (activeView === 'signals')          return <SignalsView />;
    if (activeView === 'themes')           return <SignalsView />; // legacy route → Signals
    if (activeView === 'roadmap')          return <RoadmapView />;
    if (activeView === 'portfolio')        return <PortfolioView />;
    if (activeView === 'stakeholder')      return <StakeholderView />;
    if (activeView === 'exactone')         return <ExxatOneView />;
    if (activeView === 'knowledge-graph') return <KnowledgeGraphView />;
    if (activeView === 'exam-audit')        return <ExamAdminAuditView />;
    if (activeView === 'analytics')         return <AnalyticsView />;
    if (activeView === 'arun-performance') return <ArunPerformanceView />;
    if (activeView === 'nps')              return <NPSView />;
    if (activeView === 'narrative')        return <NarrativeView onNav={handleNav} />;
    if (activeView === 'nav-ia')           return <ExamManagementView initialTab="nav-ia" />;
    // Product pages — four-act contextual template (P4); pre-audit deep specs preserved on -spec routes
    if (PRODUCT_IDS.has(activeView as ProductId)) return <ProductPage productId={activeView} onNav={handleNav} />;
    if (activeView === 'exam-spec')        return <ExamManagementView />;
    if (activeView === 'faas-spec')        return <FaaSView />;
    if (activeView === 'course-eval-spec') return <CourseEvalView />;
    if (activeView === 'skills-spec')      return <SkillsChecklistView />;
    if (activeView === 'lc-spec')          return <LearningContractsView />;
    return <div style={{color:'var(--text3)',fontSize: 15,display:'flex',flex:1,alignItems:'center',justifyContent:'center'}}>View not found.</div>;
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
