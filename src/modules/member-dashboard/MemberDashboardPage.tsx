import { useQuery } from '@tanstack/react-query';
import { memberDashboardApi } from './member-dashboard.api';
import { KpiCards } from './KpiCards';
import { ScoreBreakdownChart } from './ScoreBreakdownChart';
import { RecentVideosTable } from './RecentVideosTable';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { EmptyState } from '../../shared/components/EmptyState';
import { LayoutDashboard } from 'lucide-react';

export function MemberDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['member-progress'],
    queryFn: memberDashboardApi.getProgress,
    staleTime: 60_000,
  });

  if (isLoading) return <LoadingSpinner label="Đang tải dashboard..." />;

  const latestScore = data?.monthly_scores?.[0] ?? null;
  const prevScore = data?.monthly_scores?.[1] ?? null;
  const scoreDelta = latestScore && prevScore
    ? latestScore.total_score - prevScore.total_score
    : null;

  // Calculate avg retention/ctr from accuracy history
  const accuracyHistory = data?.accuracy_history ?? [];
  const avgAccuracy = accuracyHistory.length > 0
    ? accuracyHistory.reduce((sum, h) => sum + h.overall_accuracy, 0) / accuracyHistory.length
    : null;

  if (!data || (accuracyHistory.length === 0 && !latestScore)) {
    return (
      <div className="p-6">
        <EmptyState
          icon={LayoutDashboard}
          title="Dashboard trống"
          description="Chưa có video nào — nhận task đầu tiên để bắt đầu!"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-bold text-[#f4f4f5]">Dashboard cá nhân</h1>

      <KpiCards
        avgRetention={avgAccuracy}
        avgCtr={null}
        monthlyScore={latestScore?.total_score ?? null}
        monthlyScoreDelta={scoreDelta}
      />

      <ScoreBreakdownChart score={latestScore} />

      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-[#f4f4f5] font-semibold mb-2">Self-prediction accuracy</h3>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-[#0ea5e9]">
            {avgAccuracy != null ? `${avgAccuracy.toFixed(1)}%` : '--'}
          </span>
          <p className="text-xs text-[#a1a1aa]">
            Độ chính xác dự đoán trung bình. Đúng ≥94% | Gần đúng 80-93% | Sai &lt;80%
          </p>
        </div>
      </div>

      <RecentVideosTable
        videos={accuracyHistory.slice(0, 5).map(h => ({
          session_id: h.session_id,
          task_title: h.video_title,
          retention_actual: h.overall_accuracy,
          ctr_actual: null,
          accuracy: { overall_accuracy: h.overall_accuracy, retention_accuracy: null, ctr_accuracy: null },
        }))}
      />
    </div>
  );
}
