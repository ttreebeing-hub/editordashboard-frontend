import type { AnalyticsSession } from './analytics.api';

function AccuracyBadge({ accuracy }: { accuracy: number | null }) {
  if (accuracy == null) return <span className="text-[#a1a1aa] text-xs">--</span>;
  if (accuracy >= 94) return <span className="text-green-400 text-xs font-medium">✓ Đúng ({accuracy.toFixed(0)}%)</span>;
  if (accuracy >= 80) return <span className="text-amber-400 text-xs font-medium">~ Gần đúng ({accuracy.toFixed(0)}%)</span>;
  return <span className="text-red-400 text-xs font-medium">✗ Sai ({accuracy.toFixed(0)}%)</span>;
}

interface Props {
  sessions: AnalyticsSession[];
}

export function PredictionVsActual({ sessions }: Props) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#2a2a2a]">
        <h3 className="text-[#f4f4f5] font-semibold">Dự đoán vs Thực tế</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Video', 'Retention dự đoán', 'Retention thực tế', 'CTR dự đoán', 'CTR thực tế', 'Độ chính xác'].map(h => (
                <th key={h} className="text-left text-xs text-[#a1a1aa] font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sessions.map(s => (
              <tr key={s.session_id} className="border-b border-[#2a2a2a] hover:bg-[#242424]">
                <td className="px-4 py-3 text-[#f4f4f5] max-w-[180px] truncate">{s.task_title}</td>
                <td className="px-4 py-3 text-[#a1a1aa]">{s.prediction.retention_predicted}%</td>
                <td className="px-4 py-3 text-[#f4f4f5]">
                  {s.actual.retention_actual != null ? `${s.actual.retention_actual}%` : '--'}
                </td>
                <td className="px-4 py-3 text-[#a1a1aa]">{s.prediction.ctr_predicted}%</td>
                <td className="px-4 py-3 text-[#f4f4f5]">
                  {s.actual.ctr_actual != null ? `${s.actual.ctr_actual}%` : '--'}
                </td>
                <td className="px-4 py-3">
                  <AccuracyBadge accuracy={s.accuracy.overall_accuracy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {sessions.length === 0 && (
          <div className="text-center text-[#a1a1aa] py-8 text-sm">Chưa có dữ liệu analytics</div>
        )}
      </div>
    </div>
  );
}
