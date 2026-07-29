import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/rr-insights/',
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/@astryxdesign/charts') || id.includes('node_modules/d3')) {
            return 'astryx-charts';
          }
          if (id.includes('node_modules/@astryxdesign')) {
            return 'astryx';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide';
          }
          // Route-level splitting is handled by React.lazy in src/app/routes.tsx.
        },
      },
    },
  },
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __COMMIT_SHA__: JSON.stringify(process.env.GITHUB_SHA?.slice(0, 7) ?? 'local'),
  },
});
