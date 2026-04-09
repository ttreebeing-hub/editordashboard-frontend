import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Calendar } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { leaderApi } from '../leader.api';
import { Badge } from '../../../shared/components/Badge';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import { useToast } from '../../../shared/hooks/useToast';
import type { MemberCard } from '../../../shared/types/editor.types';

const TIER_COLOR: Record<string, string> = {
  'xuất sắc': 'teal', 'tốt': 'purple', 'phát triển': 'amber', 'cần hỗ trợ': 'red',
};

interface Props {
  memberId: string;
  member: MemberCard;
  onClose: () => void;
}

export function MemberDrawer({ memberId, member, onClose }: Props) {
  const toast = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['leader-member-detail', memberId],
    queryFn: () => leaderApi.getMemberDetail(memberId),
  });

  const action1on1 = useMutation({
    mutationFn: () => leaderApi.logMemberAction(memberId, '1on1_scheduled'),
    onSuccess: () => toast.success('Đã lên lịch 1:1'),
    onError: () => toast.warn('Không thể lưu hành động'),
  });

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full bg-[#1a1a1a] border-l border-[#2a2a2a] z-50
          w-full md:w-[420px] overflow-y-auto
          animate-[slideInRight_280ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#1a1a1a] border-b border-[#2a2a2a] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9] font-bold text-sm">
              {member.avatar_initials}
            </div>
            <div>
              <p className="font-semibold text-[#f4f4f5]">{member.name}</p>
              <p className="text-xs text-[#a1a1aa]">{member.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Tier */}
          {member.tier && (
            <Badge color={TIER_COLOR[member.tier] || 'gray'} label={member.tier} size="md" />
          )}

          {isLoading ? (
            <LoadingSpinner label="Đang tải chi tiết..." />
          ) : data ? (
            <>
              {/* KPI Grid */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Avg Retention', value: data.member.avg_accuracy != null ? `${data.member.avg_accuracy.toFixed(1)}%` : '--' },
                  { label: 'Videos', value: data.member.videos_completed },
                  { label: 'Điểm tháng', value: data.member.monthly_score != null ? data.member.monthly_score.toFixed(0) : '--' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-[#242424] rounded-lg p-3 text-center">
                    <p className="text-[#f4f4f5] font-bold">{value}</p>
                    <p className="text-[#a1a1aa] text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>

              {/* Accuracy mini chart */}
              {data.accuracy_chart.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#f4f4f5] mb-3">Accuracy gần đây</h4>
                  <ResponsiveContainer width="100%" height={100}>
                    <LineChart data={data.accuracy_chart}>
                      <XAxis hide />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#242424', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }}
                        formatter={(v: number) => [`${v.toFixed(1)}%`, 'Accuracy']}
                      />
                      <Line
                        type="monotone" dataKey="overall_accuracy"
                        stroke="#0ea5e9" strokeWidth={2} dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Recent videos */}
              {data.recent_sessions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#f4f4f5] mb-3">5 video gần nhất</h4>
                  <div className="space-y-2">
                    {data.recent_sessions.map(s => (
                      <div key={s.id} className="bg-[#242424] rounded-lg px-3 py-2 flex items-center justify-between">
                        <p className="text-sm text-[#f4f4f5] truncate flex-1">{s.task?.title || 'Video'}</p>
                        <span className="text-xs text-[#a1a1aa] ml-2 shrink-0">
                          Bước {s.current_step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mindset self eval */}
              {data.mindset_self_eval && (
                <div>
                  <h4 className="text-sm font-semibold text-[#f4f4f5] mb-3">Tự đánh giá mindset</h4>
                  <div className="space-y-2">
                    {Object.entries(data.mindset_self_eval).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-xs text-[#a1a1aa] capitalize">{key.replace(/_/g, ' ')}</span>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(n => (
                            <div key={n} className={`w-4 h-2 rounded-sm ${n <= val ? 'bg-[#0ea5e9]' : 'bg-[#2a2a2a]'}`} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <button
                onClick={() => action1on1.mutate()}
                disabled={action1on1.isPending}
                className="w-full flex items-center justify-center gap-2 bg-[#0ea5e9]/10 border border-[#0ea5e9]/30 text-[#0ea5e9] rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-[#0ea5e9]/20 transition-colors disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                {action1on1.isPending ? 'Đang lưu...' : 'Lên lịch 1:1'}
              </button>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
