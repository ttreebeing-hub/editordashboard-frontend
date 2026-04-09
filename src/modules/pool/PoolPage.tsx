import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Inbox } from 'lucide-react';
import { clsx } from 'clsx';
import { TaskCard } from './TaskCard';
import { CreateTaskModal } from './CreateTaskModal';
import { EmptyState } from '../../shared/components/EmptyState';
import { PageLoader } from '../../shared/components/LoadingSpinner';
import { useToast } from '../../shared/hooks/useToast';
import { poolApi } from './pool.api';
import type { EditorTask, Priority } from '../../shared/types/editor.types';

type FilterType = 'all' | Priority;

const FILTERS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'urgent', label: '🔴 Khẩn' },
  { value: 'priority', label: '🟡 Ưu tiên' },
  { value: 'normal', label: '⚪ Thường' },
];

export function PoolPage() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const toast = useToast();
  const qc = useQueryClient();

  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['pool-tasks', filter],
    queryFn: () => poolApi.listTasks(filter === 'all' ? undefined : filter),
  });

  const claimMutation = useMutation({
    mutationFn: (taskId: string) => poolApi.claimTask(taskId),
    onMutate: (taskId) => setClaimingId(taskId),
    onSuccess: () => {
      toast.success('Đã nhận task thành công!');
      qc.invalidateQueries({ queryKey: ['pool-tasks'] });
    },
    onError: (err) => {
      toast.error(`Nhận task thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`);
    },
    onSettled: () => setClaimingId(null),
  });

  if (isLoading) return <PageLoader />;

  if (error) return (
    <div className="p-6 bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-xl text-[#ef4444] text-sm">
      Không thể tải dữ liệu: {error instanceof Error ? error.message : 'Lỗi không xác định'}
    </div>
  );

  const taskList: EditorTask[] = tasks || [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Filter pills */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={clsx(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
              filter === f.value
                ? 'bg-[#0ea5e9] text-white'
                : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#a1a1aa] hover:text-[#f4f4f5] hover:border-[#3a3a3a]'
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-[#a1a1aa]">
          <span className="text-[#f4f4f5] font-medium">{taskList.length}</span> task trong pool
        </p>
      </div>

      {/* Task list */}
      {taskList.length === 0 ? (
        <EmptyState
          icon={<Inbox />}
          title="Không có task nào trong pool"
          description="Bấm + để tạo task mới cho team"
        />
      ) : (
        <div className="space-y-3">
          {taskList.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClaim={(t) => claimMutation.mutate(t.id)}
              claiming={claimingId === task.id}
            />
          ))}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setCreateOpen(true)}
        className="fixed bottom-24 right-6 lg:bottom-8 w-14 h-14 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-full shadow-lg shadow-[#0ea5e9]/25 flex items-center justify-center transition-all duration-150 active:scale-95"
        title="Tạo task mới"
      >
        <Plus size={24} />
      </button>

      <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
