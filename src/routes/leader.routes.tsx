import { Route } from 'react-router-dom';
import { OverviewPage } from '../modules/leader/overview/OverviewPage';
import { TeamPage } from '../modules/leader/team/TeamPage';
import { VideosPage } from '../modules/leader/videos/VideosPage';
import { SignalsPage } from '../modules/leader/signals/SignalsPage';
import { EvalPage } from '../modules/leader/eval/EvalPage';

export const leaderRoutes = (
  <>
    <Route path="/overview" element={<OverviewPage />} />
    <Route path="/team" element={<TeamPage />} />
    <Route path="/videos" element={<VideosPage />} />
    <Route path="/signals" element={<SignalsPage />} />
    <Route path="/eval" element={<EvalPage />} />
  </>
);
