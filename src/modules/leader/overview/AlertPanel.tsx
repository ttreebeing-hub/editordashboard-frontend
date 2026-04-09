import { AlertTriangle } from 'lucide-react';
import type { EditorSignal } from '../../../shared/types/editor.types';

const SIGNAL_CONFIG = {
  red: { emoji: '🔴', label: 'Cần xử lý ngay', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
  yellow: { emoji: '🟡', label: 'Cần theo dõi', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  green: { emoji: '🟢', label: 'Hiệu suất tốt', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
};

const TYPE_LABEL: Record<string, string> = {
  low_accuracy: 'Accuracy thấp',
  deadline_risk: 'Nguy cơ trễ deadline',
  high_performance: 'Hiệu suất cao',
  revision_high: 'Nhiều lần revision',
};

interface Props {
  signals: EditorSignal[];
}

export function AlertPanel({ signals }: Props) {
  const top3 = signals.slice(0, 3);

  if (top3.length === 0) {
    return (
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
        <h3 className="text-[#f4f4f5] font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          Tín hiệu nổi bật
        </h3>
        <p className="text-[#a1a1aa] text-sm text-center py-4">Không có tín hiệu cảnh báo nào</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <h3 className="text-[#f4f4f5] font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400" />
        Tín hiệu nổi bật
      </h3>
      <div className="space-y-3">
        {top3.map(signal => {
          const cfg = SIGNAL_CONFIG[signal.signal_color];
          return (
            <div key={signal.id} className={`${cfg.bg} border ${cfg.border} rounded-lg p-3`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm font-medium ${cfg.text}`}>
                      {cfg.emoji} {TYPE_LABEL[signal.signal_type] || signal.signal_type}
                    </span>
                  </div>
                  {signal.editor_name && (
                    <p className="text-xs text-[#a1a1aa]">{signal.editor_name}</p>
                  )}
                </div>
                <span className="text-xs text-[#a1a1aa] whitespace-nowrap">
                  {new Date(signal.computed_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
