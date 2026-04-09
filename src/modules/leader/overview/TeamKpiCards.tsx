import { TrendingUp, TrendingDown, Video, BookOpen } from 'lucide-react';
import type { TeamKpiOverview } from '../../../shared/types/editor.types';

interface Props {
  data: TeamKpiOverview;
}

function KpiCard({ label, value, unit = '', icon: Icon, color = 'text-blue-400' }: {
  label: string; value: string | number; unit?: string; icon: React.ElementType; color?: string;
}) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[#a1a1aa] text-sm">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-bold text-[#f4f4f5]">
        {value}<span className="text-base font-normal text-[#a1a1aa] ml-1">{unit}</span>
      </div>
    </div>
  );
}

export function TeamKpiCards({ data }: Props) {
  const { alerts_count } = data;
  const totalAlerts = alerts_count.red + alerts_count.yellow;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Video đang xử lý"
        value={data.videos_in_progress}
        unit="video"
        icon={Video}
        color="text-sky-400"
      />
      <KpiCard
        label="Hoàn thành tuần này"
        value={data.videos_completed_this_week}
        unit="video"
        icon={TrendingUp}
        color="text-green-400"
      />
      <KpiCard
        label="Accuracy TB team"
        value={data.avg_accuracy_team != null ? data.avg_accuracy_team.toFixed(1) : '--'}
        unit="%"
        icon={TrendingDown}
        color="text-purple-400"
      />
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[#a1a1aa] text-sm">Tín hiệu cảnh báo</span>
          <BookOpen className="w-5 h-5 text-amber-400" />
        </div>
        <div className="flex gap-3">
          <span className="text-red-400 font-bold text-lg">🔴 {alerts_count.red}</span>
          <span className="text-yellow-400 font-bold text-lg">🟡 {alerts_count.yellow}</span>
          <span className="text-green-400 font-bold text-lg">🟢 {alerts_count.green}</span>
        </div>
        {totalAlerts > 0 && (
          <p className="text-xs text-amber-400 mt-2">{totalAlerts} cần xem xét</p>
        )}
      </div>
    </div>
  );
}
