import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Updated to match renamed repo: x-rr-insights
  base: '/x-rr-insights/',
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});