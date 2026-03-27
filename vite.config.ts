import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/rr-insights/',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor splits
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/recharts') || id.includes('node_modules/victory-vendor')) {
            return 'recharts';
          }
          if (id.includes('node_modules/d3') || id.includes('node_modules/@observablehq')) {
            return 'd3-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
          // App code splits — heavy views into their own chunks
          if (id.includes('ExamManagementView')) return 'view-exam';
          if (id.includes('FaaSView') || id.includes('CourseEvalView')) return 'view-forms';
          if (id.includes('AnalyticsView') || id.includes('CompetitiveView')) return 'view-analytics';
          if (id.includes('SkillsChecklistView') || id.includes('LearningContractsView') || id.includes('ExxatOneView')) return 'view-products';
          if (id.includes('PersonaMapView') || id.includes('RoadmapView') || id.includes('StakeholderView') || id.includes('PortfolioView')) return 'view-strategy';
        },
      },
    },
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __COMMIT_SHA__:  JSON.stringify(process.env.GITHUB_SHA?.slice(0, 7) ?? 'local'),
  },
});
