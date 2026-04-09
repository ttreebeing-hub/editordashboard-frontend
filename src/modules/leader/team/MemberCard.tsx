import type { MemberCard as MemberCardType } from '../../../shared/types/editor.types';
import { Badge } from '../../../shared/components/Badge';

const TIER_COLOR: Record<string, string> = {
  'xuất sắc': 'teal',
  'tốt': 'purple',
  'phát triển': 'amber',
  'cần hỗ trợ': 'red',
};

const TIER_AVATAR_BG: Record<string, string> = {
  'xuất sắc': 'bg-teal-500/20 text-teal-400',
  'tốt': 'bg-purple-500/20 text-purple-400',
  'phát triển': 'bg-amber-500/20 text-amber-400',
  'cần hỗ trợ': 'bg-red-500/20 text-red-400',
};

const SIGNAL_DOT: Record<string, string> = {
  red: 'bg-red-500',
  yellow: 'bg-yellow-400',
  green: 'bg-green-500',
};

interface Props {
  member: MemberCardType;
  onClick: () => void;
}

export function MemberCard({ member, onClick }: Props) {
  const avatarClass = member.tier ? (TIER_AVATAR_BG[member.tier] || 'bg-[#0ea5e9]/20 text-[#0ea5e9]') : 'bg-[#0ea5e9]/20 text-[#0ea5e9]';

  return (
    <div
      onClick={onClick}
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5 cursor-pointer hover:-translate-y-px hover:border-[#0ea5e9]/40 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`relative w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarClass}`}>
            {member.avatar_initials}
            {member.signal_color && (
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#1a1a1a] ${SIGNAL_DOT[member.signal_color]}`} />
            )}
          </div>
          <div>
            <p className="text-[#f4f4f5] font-semibold text-sm">{member.name}</p>
            <p className="text-[#a1a1aa] text-xs">{member.role}</p>
          </div>
        </div>
        {member.tier && (
          <Badge color={TIER_COLOR[member.tier] || 'gray'} label={member.tier} size="sm" />
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <p className="text-[#f4f4f5] font-bold text-base">
            {member.avg_accuracy != null ? `${member.avg_accuracy.toFixed(0)}%` : '--'}
          </p>
          <p className="text-[#a1a1aa] text-xs mt-0.5">Accuracy</p>
        </div>
        <div className="text-center border-x border-[#2a2a2a]">
          <p className="text-[#f4f4f5] font-bold text-base">{member.videos_completed}</p>
          <p className="text-[#a1a1aa] text-xs mt-0.5">Video</p>
        </div>
        <div className="text-center">
          <p className="text-[#f4f4f5] font-bold text-base">
            {member.monthly_score != null ? member.monthly_score.toFixed(0) : '--'}
          </p>
          <p className="text-[#a1a1aa] text-xs mt-0.5">Điểm tháng</p>
        </div>
      </div>

      {member.current_task_title && (
        <div className="bg-[#242424] rounded-lg px-3 py-2">
          <p className="text-xs text-[#a1a1aa]">
            Bước {member.current_step} — <span className="text-[#f4f4f5]">{member.current_task_title}</span>
          </p>
        </div>
      )}
    </div>
  );
}
