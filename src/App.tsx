import { Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Shell } from './app/Shell';
import { ROUTES, VIEW_PATH } from './app/routes';
import { EmptyState } from '@astryxdesign/core/EmptyState';

/** Old-style paths (`/exam-management`, `/themes`, …) redirect to their new home. */
function LegacyRedirect() {
  const { pathname } = useLocation();
  const target = VIEW_PATH[pathname.replace(/^\//, '')];
  if (target) return <Navigate to={target} replace />;
  return <EmptyState title="View not found" description="This page does not exist in the repository." />;
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

  return (
    <Shell>
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
    </Shell>
  );
}
