import type { MemberDashboardSummary } from './member-dashboard.api';

function AccuracyStatus({ accuracy }: { accuracy: number | null }) {
  if (accuracy == null) return <span className="text-[#a1a1aa] text-xs">--</span>;
  if (accuracy >= 94) return <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Đúng</span>;
  if (accuracy >= 80) return <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Gần đúng</span>;
  return <span className="text-xs font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">Sai</span>;
}

interface Props {
  videos: MemberDashboardSummary['recent_videos'];
}

export function RecentVideosTable({ videos }: Props) {
  if (videos.length === 0) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-[#f4f4f5] font-semibold mb-3">Video gần đây</h3>
        <p className="text-[#a1a1aa] text-sm text-center py-4">
          Chưa có video nào — nhận task đầu tiên để bắt đầu!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#2a2a2a]">
        <h3 className="text-[#f4f4f5] font-semibold">5 Video gần nhất</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['EP', 'Retention TT', 'CTR TT', 'Dự đoán'].map(h => (
                <th key={h} className="text-left text-xs text-[#a1a1aa] font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {videos.map(v => (
              <tr key={v.session_id} className="border-b border-[#2a2a2a] hover:bg-[#242424]">
                <td className="px-4 py-3 text-[#f4f4f5] max-w-[200px] truncate">{v.task_title}</td>
                <td className="px-4 py-3 text-[#f4f4f5]">
                  {v.retention_actual != null ? `${v.retention_actual}%` : '--'}
                </td>
                <td className="px-4 py-3 text-[#f4f4f5]">
                  {v.ctr_actual != null ? `${v.ctr_actual}%` : '--'}
                </td>
                <td className="px-4 py-3">
                  <AccuracyStatus accuracy={v.accuracy.overall_accuracy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
