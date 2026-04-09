import type { VideoTrackingItem } from '../leader.api';
import { Badge } from '../../../shared/components/Badge';
import { useToast } from '../../../shared/hooks/useToast';
import { useMutation } from '@tanstack/react-query';
import { leaderApi } from '../leader.api';

const STEP_LABELS: Record<number, string> = {
  1: 'B1 Nhận', 2: 'B2 Cắt', 3: 'B3 Hậu', 4: 'B4 Xuất', 5: 'B5 Check', 6: 'B6 Upload',
};

const STEP_COLOR: Record<number, string> = {
  1: 'bg-[#a1a1aa]/20 text-[#a1a1aa]', 2: 'bg-blue-500/20 text-blue-400',
  3: 'bg-purple-500/20 text-purple-400', 4: 'bg-amber-500/20 text-amber-400',
  5: 'bg-orange-500/20 text-orange-400', 6: 'bg-teal-500/20 text-teal-400',
};

function getStatusLabel(item: VideoTrackingItem) {
  if (item.days_remaining == null) return { label: 'Không deadline', color: 'gray' };
  if (item.status === 'submitted') return { label: 'Chờ duyệt', color: 'amber' };
  if (item.days_remaining < 0) return { label: 'Trễ hạn', color: 'red' };
  if (item.days_remaining <= 1) return { label: 'Gấp!', color: 'red' };
  return { label: 'Đúng hạn', color: 'green' };
}

interface Props {
  items: VideoTrackingItem[];
}

export function VideoTrackingTable({ items }: Props) {
  const toast = useToast();

  const remind = useMutation({
    mutationFn: (memberId: string) => leaderApi.logMemberAction(memberId, 'intervention', 'Nhắc nhở deadline'),
    onSuccess: () => toast.success('Đã nhắc nhở'),
    onError: () => toast.warn('Không thể gửi nhắc nhở'),
  });

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Video', 'Editor', 'Bước', 'Checklist', 'Revision', 'Trạng thái', 'Hành động'].map(h => (
                <th key={h} className="text-left text-xs text-[#a1a1aa] font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              const status = getStatusLabel(item);
              const isUrgent = (item.days_remaining != null && item.days_remaining < 1) || item.revision_count >= 3;

              return (
                <tr
                  key={item.session_id}
                  className={`border-b border-[#2a2a2a] transition-colors ${isUrgent ? 'bg-red-500/5' : 'hover:bg-[#242424]'}`}
                >
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-[#f4f4f5] font-medium truncate">{item.task.title}</p>
                    <p className="text-xs text-[#a1a1aa] mt-0.5">{item.task.channel}</p>
                  </td>
                  <td className="px-4 py-3 text-[#f4f4f5]">{item.assigned_to_name}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${STEP_COLOR[item.current_step] || 'bg-[#2a2a2a] text-[#a1a1aa]'}`}>
                      {STEP_LABELS[item.current_step] || `B${item.current_step}`}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden w-16">
                        <div
                          className="h-full bg-[#0ea5e9] rounded-full transition-all"
                          style={{ width: `${item.checklist_completion_pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#a1a1aa]">{item.checklist_completion_pct}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-bold ${item.revision_count >= 3 ? 'text-red-400' : 'text-[#f4f4f5]'}`}>
                      {item.revision_count}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge color={status.color} label={status.label} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remind.mutate(item.task.id)}
                      className="text-xs text-[#0ea5e9] hover:underline"
                    >
                      Nhắc nhở
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && (
          <div className="text-center text-[#a1a1aa] py-8 text-sm">Không có video nào</div>
        )}
      </div>
    </div>
  );
}
