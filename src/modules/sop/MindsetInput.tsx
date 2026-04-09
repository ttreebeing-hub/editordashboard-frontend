import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Textarea } from '../../shared/components/ui/Textarea';
import { Button } from '../../shared/components/ui/Button';

interface Props {
  question: string;
  value: string;
  onChange: (v: string) => void;
  onAiAssist: () => void;
  aiLoading?: boolean;
  disabled?: boolean;
}

export function MindsetInput({ question, value, onChange, onAiAssist, aiLoading, disabled }: Props) {
  return (
    <div className="space-y-3">
      <div className="p-3 bg-[#0ea5e9]/5 border border-[#0ea5e9]/20 rounded-lg">
        <p className="text-sm text-[#0ea5e9] font-medium leading-relaxed">
          ✦ {question}
        </p>
      </div>
      <Textarea
        placeholder="Chia sẻ suy nghĩ của bạn... AI sẽ phân tích và gợi ý khi bạn nhấn nút bên dưới."
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={!value.trim() || aiLoading || disabled}
        loading={aiLoading}
        onClick={onAiAssist}
        className="gap-2"
      >
        <Sparkles size={14} className="text-[#0ea5e9]" />
        Nhờ AI phân tích
      </Button>
    </div>
  );
}
