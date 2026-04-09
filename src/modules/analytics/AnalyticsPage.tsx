import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from './analytics.api';
import { PredictionVsActual } from './PredictionVsActual';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import { BarChart2 } from 'lucide-react';

export function AnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics-sessions'],
    queryFn: () => analyticsApi.getSessions({ limit: 20 }),
    staleTime: 60_000,
  });

  if (isLoading) return <LoadingSpinner label="Đang tải analytics..." />;

  const sessions = data?.sessions ?? [];

  if (sessions.length === 0) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-[#0ea5e9]/10 flex items-center justify-center mx-auto mb-4">
            <BarChart2 className="w-8 h-8 text-[#0ea5e9]" />
          </div>
          <h2 className="text-xl font-bold text-[#f4f4f5] mb-3">Analytics</h2>
          <p className="text-[#a1a1aa] text-sm">
            Tính năng analytics sẽ có sau khi YouTube data được sync và có đủ dữ liệu thực tế.
          </p>
          <p className="text-xs text-[#a1a1aa] mt-3">Phase 2 — Đang phát triển</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-xl font-bold text-[#f4f4f5]">Analytics — Dự đoán vs Thực tế</h1>
      <PredictionVsActual sessions={sessions} />
    </div>
  );
}
