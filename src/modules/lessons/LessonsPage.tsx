import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { LessonForm } from './LessonForm';
import { LessonEntry } from './LessonEntry';
import { EmptyState } from '../../shared/components/EmptyState';
import { PageLoader } from '../../shared/components/LoadingSpinner';
import { useToast } from '../../shared/hooks/useToast';
import { lessonsApi } from './lessons.api';
import type { LessonType } from '../../shared/types/editor.types';

type Filter = 'all' | LessonType;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'technique', label: 'Kỹ thuật' },
  { value: 'mindset', label: 'Mindset' },
  { value: 'process', label: 'Quy trình' },
];

export function LessonsPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const toast = useToast();
  const qc = useQueryClient();

  const { data: lessons, isLoading } = useQuery({
    queryKey: ['lessons', filter],
    queryFn: () => lessonsApi.list(filter === 'all' ? undefined : filter),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => lessonsApi.delete(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      toast.success('Đã xoá bài học');
      qc.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (err) => toast.error(`Xoá thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
    onSettled: () => setDeletingId(null),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <LessonForm />

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-[#2a2a2a]">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'flex-1 py-1.5 text-sm rounded-lg transition-all duration-150 font-medium',
              filter === f.value
                ? 'bg-[#0ea5e9] text-white'
                : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {isLoading ? (
        <PageLoader />
      ) : !lessons?.length ? (
        <EmptyState
          icon={<BookOpen />}
          title="Chưa có bài học nào"
          description="Hãy ghi lại điều bạn học được hôm nay"
        />
      ) : (
        <div className="space-y-3">
          {lessons.map(lesson => (
            <LessonEntry
              key={lesson.id}
              lesson={lesson}
              onDelete={(id) => deleteMutation.mutate(id)}
              deleting={deletingId === lesson.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
