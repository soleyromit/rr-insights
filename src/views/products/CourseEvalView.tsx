// views/products/CourseEvalView.tsx — Course & Faculty Eval (PCE) spec shell
// (v19). The 477-line monolith is decomposed into six section components
// under ./pce/, mirroring ./exam/. The header chips carry the hero fact —
// PCE is the hottest product in the corpus — and the orienting figure charts
// the live evidence volume from the real corpus.
import { VStack } from '@astryxdesign/core/VStack';
import { Fig } from '../../components/charts/Fig';
import { VolumeChart } from '../../components/charts/VolumeChart';
import { SpecPageHeader } from './spec/SpecPageHeader';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { SpecFooter } from './spec/SpecFooter';
import { insightsWhere, productFacts } from '../../lib/selectors';
import { monthlyVolume } from '../../lib/series';
import { hrefInsights } from '../../lib/links';
import { PRODUCTS } from '../../data/products';
import { Overview } from './pce/Overview';
import { Instruments } from './pce/Instruments';
import { Stakeholders } from './pce/Stakeholders';
import { Questions } from './pce/Questions';
import { Strategy } from './pce/Strategy';
import { Build } from './pce/Build';
import { DelayDrivers } from './pce/DelayDrivers';
import { BuildStatus } from '../../components/build-status/BuildStatus';

const PRODUCT_ID = 'course-eval';

const SECTIONS = [
  { id: 'overview', label: 'Overview + gaps' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'stakeholders', label: 'Stakeholders' },
  { id: 'questions', label: 'Open questions' },
  { id: 'strategy', label: 'North star' },
  { id: 'build', label: 'Build plan' },
  { id: 'delay-drivers', label: 'Delay Drivers' },
  { id: 'build-status', label: 'Build Status' },
];

export function CourseEvalView() {
  const [section, setSection] = useSection(SECTIONS, 'overview');
  const all = insightsWhere({ product: PRODUCT_ID });
  const facts = productFacts(PRODUCT_ID);
  const volume = monthlyVolume(all);
  // Computed, not asserted: is PCE actually the hottest product this month?
  const hottest = PRODUCTS.every((p) => p.id === PRODUCT_ID || productFacts(p.id).last30d <= facts.last30d);

  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <SpecPageHeader
        title="Course & Faculty Eval — spec archive"
        productId={PRODUCT_ID}
        claim="PCE is where evidence lands right now — the hottest workstream in the corpus, racing a Sep 15 beta as a premium tile inside the surveys module, built on FaaS."
        meta="Two instruments (post-course eval + faculty survey) · 24-question ledger, 23 answered · Apr 10 leadership demo · May 2026 engineering handoff · 103 warm programs"
        orienting={
          <Fig
            title="Evidence volume — Course Eval"
            n={all.length}
            caption={`Computed from the live corpus: ${facts.last30d} of ${all.length} insights arrived in the last 30 days${hottest ? ' — the highest 30-day intake of any product.' : '.'}`}
            link={{
              href: hrefInsights({ product: PRODUCT_ID, sort: 'newest' }),
              count: facts.last30d,
              label: 'findings from the last 30 days, newest first',
            }}
          >
            <VolumeChart data={volume} height={220} />
          </Fig>
        }
      />
      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />
      {section === 'overview' && <Overview />}
      {section === 'instruments' && <Instruments />}
      {section === 'stakeholders' && <Stakeholders />}
      {section === 'questions' && <Questions />}
      {section === 'strategy' && <Strategy />}
      {section === 'build' && <Build />}
      {section === 'delay-drivers' && <DelayDrivers />}
      {section === 'build-status' && <BuildStatus productId={PRODUCT_ID} />}
      <SpecFooter productId={PRODUCT_ID} />
    </VStack>
  );
}
