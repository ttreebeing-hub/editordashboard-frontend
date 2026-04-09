import { clsx } from 'clsx';
import { Sparkles, AlertCircle, Clock } from 'lucide-react';
import { LoadingSpinner } from '../../shared/components/LoadingSpinner';
import type { AiAssistResponse } from '../../shared/types/editor.types';

type AiState = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';

interface Props {
  state: AiState;
  data?: AiAssistResponse;
  error?: string;
}

export function AiAssistPanel({ state, data, error }: Props) {
  if (state === 'idle') return null;

  return (
    <div
      className={clsx(
        'mt-3 rounded-xl border overflow-hidden transition-all duration-300',
        'animate-in slide-in-from-bottom fade-in',
        state === 'loading' && 'border-[#0ea5e9]/20 bg-[#0ea5e9]/5',
        state === 'success' && 'border-[#0ea5e9]/30 bg-[#0ea5e9]/5',
        state === 'error' && 'border-[#ef4444]/30 bg-[#ef4444]/5',
        state === 'rate-limited' && 'border-[#f59e0b]/30 bg-[#f59e0b]/5',
      )}
    >
      {state === 'loading' && (
        <div className="flex items-center gap-3 p-4">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-[#0ea5e9]">AI đang phân tích...</span>
        </div>
      )}

      {state === 'rate-limited' && (
        <div className="flex items-center gap-3 p-4">
          <Clock size={16} className="text-[#f59e0b] flex-shrink-0" />
          <span className="text-sm text-[#f59e0b]">
            Vui lòng đợi 30 giây trước khi nhờ AI tiếp
          </span>
        </div>
      )}

      {state === 'error' && (
        <div className="flex items-center gap-3 p-4">
          <AlertCircle size={16} className="text-[#ef4444] flex-shrink-0" />
          <span className="text-sm text-[#ef4444]">
            {error || 'Không thể kết nối AI. Thử lại sau.'}
          </span>
        </div>
      )}

      {state === 'success' && data && (
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#0ea5e9]" />
            <span className="text-xs font-semibold text-[#0ea5e9] uppercase tracking-wider">
              Phân tích AI
            </span>
          </div>

          <p className="text-sm text-[#f4f4f5] leading-relaxed">{data.analysis}</p>

          {data.deeperQuestions.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[#a1a1aa] mb-2">Câu hỏi suy ngẫm thêm:</p>
              <ul className="space-y-1.5">
                {data.deeperQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#f4f4f5]">
                    <span className="text-[#0ea5e9] font-mono text-xs mt-0.5 flex-shrink-0">
                      {i + 1}.
                    </span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
