import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BottomSheet } from '../../shared/components/BottomSheet';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { Textarea } from '../../shared/components/ui/Textarea';
import { Select } from '../../shared/components/ui/Select';
import { Label } from '../../shared/components/ui/Label';
import { useToast } from '../../shared/hooks/useToast';
import { poolApi } from './pool.api';
import type { Channel, VideoType, Priority } from '../../shared/types/editor.types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CHANNEL_OPTIONS = [
  { value: 'nhiLe_holding', label: 'NhiLe Holding' },
  { value: 'spice_and_nice', label: 'Spice & Nice' },
  { value: 'ms_nhi', label: 'Ms. Nhi' },
  { value: 'nhiLe_team', label: 'NhiLe Team' },
  { value: 'nedu', label: 'NEDU' },
  { value: 'other', label: 'Khác' },
];

const VIDEO_TYPE_OPTIONS = [
  { value: 'long_16_9', label: 'Video dài (16:9)' },
  { value: 'short_9_16', label: 'Short (9:16)' },
];

const PRIORITY_OPTIONS = [
  { value: 'urgent', label: '🔴 Khẩn cấp' },
  { value: 'priority', label: '🟡 Ưu tiên' },
  { value: 'normal', label: '⚪ Thường' },
];

export function CreateTaskModal({ open, onClose }: Props) {
  const toast = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    title: '',
    channel: 'nhiLe_holding' as Channel,
    video_type: 'long_16_9' as VideoType,
    priority: 'normal' as Priority,
    deadline: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: () => poolApi.createTask({
      ...form,
      deadline: form.deadline || null,
      notes: form.notes || null,
    }),
    onSuccess: () => {
      toast.success('Tạo task thành công!');
      qc.invalidateQueries({ queryKey: ['pool-tasks'] });
      onClose();
      resetForm();
    },
    onError: (err) => {
      toast.error(`Tạo task thất bại: ${err instanceof Error ? err.message : 'Lỗi không xác định'}`);
    },
  });

  const resetForm = () => {
    setForm({ title: '', channel: 'nhiLe_holding', video_type: 'long_16_9', priority: 'normal', deadline: '', notes: '' });
    setErrors({});
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = 'Tiêu đề không được để trống';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Tạo task mới">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Tiêu đề video *</Label>
          <Input
            id="title"
            placeholder="Nhập tiêu đề hoặc mô tả ngắn..."
            value={form.title}
            onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
            error={errors.title}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Kênh</Label>
            <Select
              value={form.channel}
              onChange={(v) => setForm(p => ({ ...p, channel: v as Channel }))}
              options={CHANNEL_OPTIONS}
            />
          </div>
          <div>
            <Label>Loại video</Label>
            <Select
              value={form.video_type}
              onChange={(v) => setForm(p => ({ ...p, video_type: v as VideoType }))}
              options={VIDEO_TYPE_OPTIONS}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Mức ưu tiên</Label>
            <Select
              value={form.priority}
              onChange={(v) => setForm(p => ({ ...p, priority: v as Priority }))}
              options={PRIORITY_OPTIONS}
            />
          </div>
          <div>
            <Label>Deadline</Label>
            <Input
              type="datetime-local"
              value={form.deadline}
              onChange={(e) => setForm(p => ({ ...p, deadline: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label>Ghi chú (tuỳ chọn)</Label>
          <Textarea
            placeholder="Thêm ghi chú, yêu cầu đặc biệt..."
            rows={3}
            value={form.notes}
            onChange={(e) => setForm(p => ({ ...p, notes: e.target.value }))}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Huỷ
          </Button>
          <Button type="submit" className="flex-1" loading={mutation.isPending}>
            Tạo task
          </Button>
        </div>
      </form>
    </BottomSheet>
  );
}
