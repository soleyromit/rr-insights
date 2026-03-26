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
import { ThemesView } from './views/ThemesView';
import { RoadmapView } from './views/RoadmapView';
import { PortfolioView } from './views/PortfolioView';
import { StakeholderView } from './views/StakeholderView';
import { AskClaudeView } from './views/AskClaudeView';
import { ExxatOneView } from './views/products/ExxatOneView';
import { ExamAdminAuditView } from './views/products/ExamAdminAuditView';
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
    if (activeView === 'whiteboard')       return <WhiteboardView />;
    if (activeView === 'competitive')      return <CompetitiveView />;
    if (activeView === 'changelog')        return <ChangelogView />;
    if (activeView === 'personas')         return <PersonaMapView />;
    if (activeView === 'themes')           return <ThemesView />;
    if (activeView === 'roadmap')          return <RoadmapView />;
    if (activeView === 'portfolio')        return <PortfolioView />;
    if (activeView === 'stakeholder')      return <StakeholderView />;
    if (activeView === 'ask-claude')       return <AskClaudeView />;
    if (activeView === 'exactone')         return <ExxatOneView />;
    if (activeView === 'exam-audit')        return <ExamAdminAuditView />;
    // Product deep-dives — each now has its own dedicated view
    if (activeView === 'exam-management')  return <ExamManagementView />;
    if (activeView === 'faas')             return <FaaSView />;
    if (activeView === 'course-eval')      return <CourseEvalView />;
    if (activeView === 'skills-checklist') return <SkillsChecklistView />;
    if (activeView === 'learning-contracts') return <LearningContractsView />;
    return <div style={{color:'var(--text3)',fontSize:14,display:'flex',flex:1,alignItems:'center',justifyContent:'center'}}>View not found.</div>;
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
