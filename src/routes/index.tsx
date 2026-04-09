import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppLayout } from '../shared/layouts/AppLayout';
import { useAuth } from '../shared/hooks/useAuth';
import { PageLoader } from '../shared/components/LoadingSpinner';
import { memberRoutes } from './member.routes';
import { leaderRoutes } from './leader.routes';
import { LoginPage } from '../modules/auth/LoginPage';
import { AuthCallbackPage } from '../modules/auth/AuthCallbackPage';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;
  if (!session) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        element={
          <AuthGuard>
            <AppLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Navigate to="/pool" replace />} />
        {memberRoutes}
        {leaderRoutes}
        <Route path="*" element={<Navigate to="/pool" replace />} />
      </Route>
    </Routes>
  );
}
