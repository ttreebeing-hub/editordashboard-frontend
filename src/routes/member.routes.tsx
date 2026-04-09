import { Route } from 'react-router-dom';
import { PoolPage } from '../modules/pool/PoolPage';
import { SopPage } from '../modules/sop/SopPage';
import { LessonsPage } from '../modules/lessons/LessonsPage';
import { ProgressPage } from '../modules/progress/ProgressPage';
import { AnalyticsPage } from '../modules/analytics/AnalyticsPage';
import { MemberDashboardPage } from '../modules/member-dashboard/MemberDashboardPage';

export const memberRoutes = (
  <>
    <Route path="/pool" element={<PoolPage />} />
    <Route path="/sop" element={<SopPage />} />
    <Route path="/sop/:sessionId" element={<SopPage />} />
    <Route path="/lessons" element={<LessonsPage />} />
    <Route path="/progress" element={<ProgressPage />} />
    <Route path="/analytics" element={<AnalyticsPage />} />
    <Route path="/dashboard" element={<MemberDashboardPage />} />
  </>
);
