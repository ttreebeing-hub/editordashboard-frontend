import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../shared/layouts/AppLayout';
import { memberRoutes } from './member.routes';
import { leaderRoutes } from './leader.routes';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/pool" replace />} />
        {memberRoutes}
        {leaderRoutes}
        <Route path="*" element={<Navigate to="/pool" replace />} />
      </Route>
    </Routes>
  );
}
