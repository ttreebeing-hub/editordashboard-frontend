import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Textarea } from '../../shared/components/ui/Textarea';
import { Button } from '../../shared/components/ui/Button';
import { useToast } from '../../shared/hooks/useToast';
import { lessonsApi } from './lessons.api';
import { clsx } from 'clsx';
import type { LessonType } from '../../shared/types/editor.types';

const TYPES: { value: LessonType; label: string; color: string }[] = [
  { value: 'technique', label: 'Kỹ thuật', color: '#0ea5e9' },
  { value: 'mindset', label: 'Mindset', color: '#a855f7' },
  { value: 'process', label: 'Quy trình', color: '#22c55e' },
];

export function LessonForm() {
  const [content, setContent] = useState('');
  const [type, setType] = useState<LessonType>('technique');
  const toast = useToast();
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => lessonsApi.create({ type, content }),
    onSuccess: () => {
      toast.success('Đã lưu bài học!');
      setContent('');
      qc.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (err) => toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
      <h3 className="text-sm font-semibold text-[#f4f4f5]">Ghi lại bài học mới</h3>

      {/* Type toggle */}
      <div className="flex gap-2">
        {TYPES.map(t => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={clsx(
              'flex-1 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border',
              type === t.value
                ? 'text-white'
                : 'bg-transparent text-[#a1a1aa] border-[#2a2a2a] hover:border-[#3a3a3a]'
            )}
            style={type === t.value ? { backgroundColor: t.color, borderColor: t.color } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Textarea
        placeholder={
          type === 'technique' ? 'Kỹ thuật mới tôi học được hôm nay...' :
          type === 'mindset' ? 'Insight về mindset tôi nhận ra...' :
          'Cải tiến quy trình tôi muốn áp dụng...'
        }
        rows={4}
        value={content}
        onChange={e => setContent(e.target.value)}
      />

      <Button
        onClick={() => mutation.mutate()}
        disabled={!content.trim() || mutation.isPending}
        loading={mutation.isPending}
        className="w-full"
      >
        Lưu bài học
      </Button>
    </div>
  );
}
