import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/layouts/AppLayout';
import { DashboardPage } from '../modules/dashboard/DashboardPage';
import { PipelinePage } from '../modules/pipeline/PipelinePage';
import { ApprovePage } from '../modules/approve/ApprovePage';
import { KpiPage } from '../modules/kpi/KpiPage';
import { TeamPage } from '../modules/team/TeamPage';
import { MyTasksPage } from '../modules/mytasks/MyTasksPage';
import { OnboardPage } from '../modules/onboard/OnboardPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/pipeline" element={<PipelinePage />} />
        <Route path="/approve" element={<ApprovePage />} />
        <Route path="/kpi" element={<KpiPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/mytasks" element={<MyTasksPage />} />
        <Route path="/onboard" element={<OnboardPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
