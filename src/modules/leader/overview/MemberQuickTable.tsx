import type { MemberCard } from '../../../shared/types/editor.types';
import { Badge } from '../../../shared/components/Badge';

const TIER_COLOR: Record<string, string> = {
  'xuất sắc': 'teal',
  'tốt': 'purple',
  'phát triển': 'amber',
  'cần hỗ trợ': 'red',
};

const SIGNAL_EMOJI: Record<string, string> = {
  red: '🔴', yellow: '🟡', green: '🟢',
};

interface Props {
  members: MemberCard[];
  onSelect: (member: MemberCard) => void;
}

export function MemberQuickTable({ members, onSelect }: Props) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#2a2a2a]">
        <h3 className="text-[#f4f4f5] font-semibold">Team Members</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2a2a2a]">
              {['Thành viên', 'Điểm tháng', 'Retention', 'CTR', 'Tier', 'Tín hiệu'].map(h => (
                <th key={h} className="text-left text-xs text-[#a1a1aa] font-medium px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr
                key={m.user_id}
                onClick={() => onSelect(m)}
                className="border-b border-[#2a2a2a] hover:bg-[#242424] cursor-pointer transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center text-[#0ea5e9] text-xs font-bold">
                      {m.avatar_initials}
                    </div>
                    <span className="text-[#f4f4f5] text-sm">{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#f4f4f5] text-sm">
                  {m.monthly_score != null ? m.monthly_score.toFixed(1) : '--'}<span className="text-[#a1a1aa]">/100</span>
                </td>
                <td className="px-4 py-3 text-[#f4f4f5] text-sm">
                  {m.avg_accuracy != null ? `${m.avg_accuracy.toFixed(1)}%` : '--'}
                </td>
                <td className="px-4 py-3 text-[#f4f4f5] text-sm">{m.videos_completed}</td>
                <td className="px-4 py-3">
                  {m.tier ? (
                    <Badge color={TIER_COLOR[m.tier] || 'gray'} label={m.tier} size="sm" />
                  ) : <span className="text-[#a1a1aa] text-xs">--</span>}
                </td>
                <td className="px-4 py-3 text-lg">
                  {m.signal_color ? SIGNAL_EMOJI[m.signal_color] : '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div className="text-center text-[#a1a1aa] py-8 text-sm">Chưa có thành viên nào</div>
        )}
      </div>
    </div>
  );
}
