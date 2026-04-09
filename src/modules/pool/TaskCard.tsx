import { clsx } from 'clsx';
import { Clock, User, RefreshCw } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../../shared/components/Badge';
import { Button } from '../../shared/components/ui/Button';
import type { EditorTask } from '../../shared/types/editor.types';

const CHANNEL_LABELS: Record<string, string> = {
  nhiLe_holding: 'NhiLe Holding',
  spice_and_nice: 'Spice & Nice',
  ms_nhi: 'Ms. Nhi',
  nhiLe_team: 'NhiLe Team',
  nedu: 'NEDU',
  other: 'Khác',
};

const VIDEO_TYPE_LABELS: Record<string, string> = {
  long_16_9: 'Dài (16:9)',
  short_9_16: 'Short (9:16)',
};

function getDeadlineInfo(deadline: string | null): { label: string; urgent: boolean } {
  if (!deadline) return { label: 'Không có deadline', urgent: false };
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (diff < 0) return { label: 'Đã quá hạn', urgent: true };
  if (hours < 24) return { label: `Còn ${hours}h`, urgent: true };
  return { label: `Còn ${days} ngày`, urgent: false };
}

interface Props {
  task: EditorTask;
  onClaim?: (task: EditorTask) => void;
  claiming?: boolean;
}

export function TaskCard({ task, onClaim, claiming }: Props) {
  const { label: deadlineLabel, urgent } = getDeadlineInfo(task.deadline);

  return (
    <div
      className={clsx(
        'bg-[#1a1a1a] border rounded-xl p-4 space-y-3 transition-all duration-150',
        urgent ? 'border-[#ef4444]/40 hover:border-[#ef4444]/60' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#f4f4f5] text-sm leading-tight line-clamp-2">
            {task.title}
          </h3>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#242424] text-[#a1a1aa]">
              {CHANNEL_LABELS[task.channel] || task.channel}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#242424] text-[#a1a1aa]">
              {VIDEO_TYPE_LABELS[task.video_type] || task.video_type}
            </span>
          </div>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-[#a1a1aa]">
        <span
          className={clsx('flex items-center gap-1', urgent && 'text-[#ef4444]')}
        >
          <Clock size={12} />
          {deadlineLabel}
        </span>

        {task.assigned_to_name && (
          <span className="flex items-center gap-1">
            <User size={12} />
            {task.assigned_to_name}
          </span>
        )}

        {task.revision_count > 0 && (
          <span className="flex items-center gap-1 text-[#f59e0b]">
            <RefreshCw size={12} />
            {task.revision_count} revision
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <StatusBadge status={task.status} />
        {task.status === 'open' && onClaim && (
          <Button
            size="sm"
            onClick={() => onClaim(task)}
            loading={claiming}
          >
            Nhận task
          </Button>
        )}
      </div>

      {/* Notes */}
      {task.notes && (
        <p className="text-xs text-[#a1a1aa] bg-[#242424] rounded-lg px-3 py-2 line-clamp-2">
          {task.notes}
        </p>
      )}
    </div>
  );
}
