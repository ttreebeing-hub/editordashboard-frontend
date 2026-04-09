import { useMutation } from '@tanstack/react-query';
import { leaderApi } from '../leader.api';
import { useToast } from '../../../shared/hooks/useToast';
import type { EditorSignal } from '../../../shared/types/editor.types';

const TYPE_LABEL: Record<string, string> = {
  low_accuracy: 'Accuracy thấp liên tục',
  deadline_risk: 'Nguy cơ trễ deadline',
  high_performance: 'Hiệu suất xuất sắc',
  revision_high: 'Nhiều lần revision',
};

const ACTIONS: Record<string, { label: string; action: string }[]> = {
  red: [{ label: 'Xử lý', action: 'intervention' }, { label: '1:1 ngay', action: '1on1_scheduled' }],
  yellow: [{ label: 'Theo dõi', action: 'intervention' }],
  green: [{ label: 'Bắt đầu pipeline', action: 'pipeline_started' }],
};

interface Props {
  signal: EditorSignal;
}

export function SignalRow({ signal }: Props) {
  const toast = useToast();

  const action = useMutation({
    mutationFn: (action_type: string) => leaderApi.logMemberAction(signal.editor_id, action_type),
    onSuccess: () => toast.success('Đã ghi nhận hành động'),
    onError: () => toast.warn('Không thể ghi nhận'),
  });

  const actions = ACTIONS[signal.signal_color] || [];

  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-[#2a2a2a] last:border-0">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-[#f4f4f5]">
            {TYPE_LABEL[signal.signal_type] || signal.signal_type}
          </span>
        </div>
        {signal.editor_name && (
          <p className="text-xs text-[#a1a1aa]">{signal.editor_name}</p>
        )}
        {signal.detail_json && Object.keys(signal.detail_json).length > 0 && (
          <p className="text-xs text-[#a1a1aa] mt-1">
            {JSON.stringify(signal.detail_json)}
          </p>
        )}
      </div>
      <div className="flex gap-2 shrink-0">
        {actions.map(a => (
          <button
            key={a.action}
            onClick={() => action.mutate(a.action)}
            disabled={action.isPending}
            className="text-xs px-3 py-1.5 bg-[#242424] border border-[#2a2a2a] text-[#f4f4f5] rounded-lg hover:border-[#0ea5e9]/40 hover:text-[#0ea5e9] transition-colors disabled:opacity-50"
          >
            {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}
