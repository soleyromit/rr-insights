import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { Theme } from '@astryxdesign/core/theme';
import { LinkProvider } from '@astryxdesign/core/Link';
import { neutralTheme } from '@astryxdesign/theme-neutral/built';
import { RouterLinkAdapter } from './app/RouterLink';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/theme-neutral/theme.css';
import '@astryxdesign/charts/charts.css';
import { App } from './App';
import './index.css';

// Legacy deep-link shim: pre-router #dd= hashes become /signals?dd= inside the hash route.
if (/^#dd=/.test(window.location.hash)) {
  window.location.replace(
    window.location.pathname + '#/signals?dd=' + encodeURIComponent(window.location.hash.slice(4))
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Theme theme={neutralTheme}>
        <LinkProvider component={RouterLinkAdapter}>
          <App />
        </LinkProvider>
      </Theme>
    </HashRouter>
  </StrictMode>
);
