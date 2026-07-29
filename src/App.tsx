import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ROUTES, VIEW_PATH } from './app/routes';

// Reverse of VIEW_PATH for nav highlighting; first (canonical) id wins.
const PATH_VIEW: Record<string, string> = {};
for (const [id, path] of Object.entries(VIEW_PATH)) {
  if (!(path in PATH_VIEW)) PATH_VIEW[path] = id;
}

/** Old-style paths (`/exam-management`, `/themes`, …) redirect to their new home. */
function LegacyRedirect() {
  const { pathname } = useLocation();
  const target = VIEW_PATH[pathname.replace(/^\//, '')];
  if (target) return <Navigate to={target} replace />;
  return (
    <div style={{ color: 'var(--text3)', fontSize: 15, display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      View not found.
    </div>
  );
}

export function App() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Compat for legacy views that still call onNav(viewId).
  const onNav = (viewId: string) => navigate(VIEW_PATH[viewId] ?? viewId);

  useEffect(() => {
    const el = document.getElementById('main-content');
    if (el) el.scrollTop = 0;
  }, [pathname]);

  const activeView = PATH_VIEW[pathname] ?? pathname.replace(/^\//, '');

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)' }}>
      <Sidebar activeView={activeView} onNav={onNav} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar activeView={activeView} onNav={onNav} />
        <div id="main-content" className="flex-1 overflow-y-auto">
          <Suspense fallback={null}>
            <Routes>
              {ROUTES.map((r) => {
                const C = r.component;
                return (
                  <Route
                    key={r.path}
                    path={r.path}
                    element={
                      <C
                        {...(r.productId && !r.path.includes('/spec') && !r.path.includes('/audit') && !r.path.includes('/ia')
                          ? { productId: r.productId }
                          : {})}
                        {...(r.needsOnNav ? { onNav } : {})}
                      />
                    }
                  />
                );
              })}
              <Route path="*" element={<LegacyRedirect />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
