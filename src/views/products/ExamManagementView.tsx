// views/products/ExamManagementView.tsx — Exam Management spec archive shell
// (v18 Astryx). The 1,800-line tab monolith is decomposed into five section
// components under ./exam/, switched by a URL-synced ?section= param. The
// insight feed lives on the product hub, not here.
import { VStack } from '@astryxdesign/core/VStack';
import { HStack } from '@astryxdesign/core/HStack';
import { Link } from '@astryxdesign/core/Link';
import { Badge } from '@astryxdesign/core/Badge';
import { PageHeader } from '../../components/ui/PageHeader';
import { SectionTabs, useSection } from './spec/SectionTabs';
import { SpecFooter } from './spec/SpecFooter';
import { getProduct } from '../../data/products';
import { Architecture } from './exam/Architecture';
import { Builder } from './exam/Builder';
import { Accessibility } from './exam/Accessibility';
import { Analytics } from './exam/Analytics';
import { Decisions } from './exam/Decisions';

const PRODUCT_ID = 'exam-management';

const SECTIONS = [
  { id: 'architecture', label: 'Architecture' },
  { id: 'builder', label: 'Builder + Stories' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'decisions', label: 'Decisions + Gaps' },
];

export function ExamManagementView() {
  const [section, setSection] = useSection(SECTIONS, 'architecture');
  const p = getProduct(PRODUCT_ID);

  return (
    <VStack gap={5} padding={6} maxWidth={1160}>
      <PageHeader
        title="Exam Management — spec archive"
        lede={p?.description ?? ''}
        meta="Jan 20 2027 MVP (hard target) · Sep 2026 Cohere demo · CAAHEP / CAPTE / ARC-PA · personas: Student, DCE/Faculty, Admin, Program Director"
        actions={
          <HStack gap={3} vAlign="center" wrap="wrap">
            <Badge variant="warning" label="pre-audit deep dive" />
            <Link href="https://project-precious-cranberry-828.magicpatterns.app" isStandalone>
              University UI ↗
            </Link>
            <Link href="https://project-student-exam-accessibility.magicpatterns.app" isStandalone>
              Student UI ↗
            </Link>
          </HStack>
        }
      />

      <SectionTabs sections={SECTIONS} value={section} onChange={setSection} />

      {section === 'architecture' && <Architecture />}
      {section === 'builder' && <Builder />}
      {section === 'accessibility' && <Accessibility />}
      {section === 'analytics' && <Analytics />}
      {section === 'decisions' && <Decisions />}

      <SpecFooter
        productId={PRODUCT_ID}
        extra={
          <>
            <Link href="/products/exam-management/audit" isStandalone>
              Admin design audit →
            </Link>
            <Link href="/products/exam-management/ia" isStandalone>
              Navigation IA →
            </Link>
          </>
        }
      />
    </VStack>
  );
}
