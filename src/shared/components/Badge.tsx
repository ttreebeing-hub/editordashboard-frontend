import { clsx } from 'clsx';
import type { Priority, TaskStatus, SignalColor, LessonType } from '../types/editor.types';

const NAMED_COLORS: Record<string, string> = {
  teal: '#14b8a6', purple: '#a855f7', amber: '#f59e0b', red: '#ef4444',
  green: '#22c55e', blue: '#3b82f6', gray: '#a1a1aa',
};

interface BadgeProps {
  children?: React.ReactNode;
  label?: string;
  variant?: 'default' | 'outline';
  color?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, label, variant = 'default', color, size = 'sm', className }: BadgeProps) {
  const resolvedColor = color ? (NAMED_COLORS[color] || color) : undefined;
  const sizeClass = size === 'md' ? 'px-2.5 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded font-medium',
        sizeClass,
        variant === 'outline' ? 'border bg-transparent' : '',
        className
      )}
      style={resolvedColor ? { backgroundColor: resolvedColor + '22', color: resolvedColor, borderColor: resolvedColor + '44', border: '1px solid' } : undefined}
    >
      {label ?? children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const map: Record<Priority, { label: string; color: string }> = {
    urgent: { label: 'Khẩn', color: '#ef4444' },
    priority: { label: 'Ưu tiên', color: '#f59e0b' },
    normal: { label: 'Thường', color: '#a1a1aa' },
  };
  const { label, color } = map[priority];
  return <Badge color={color}>{label}</Badge>;
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  const map: Record<TaskStatus, { label: string; color: string }> = {
    open: { label: 'Mở', color: '#0ea5e9' },
    claimed: { label: 'Đã nhận', color: '#a855f7' },
    in_progress: { label: 'Đang làm', color: '#f59e0b' },
    submitted: { label: 'Đã nộp', color: '#0ea5e9' },
    approved: { label: 'Đã duyệt', color: '#22c55e' },
    rejected: { label: 'Bị từ chối', color: '#ef4444' },
    completed: { label: 'Hoàn thành', color: '#22c55e' },
    cancelled: { label: 'Đã hủy', color: '#a1a1aa' },
  };
  const { label, color } = map[status];
  return <Badge color={color}>{label}</Badge>;
}

export function SignalDot({ color }: { color: SignalColor }) {
  const colorMap: Record<SignalColor, string> = {
    red: '#ef4444',
    yellow: '#f59e0b',
    green: '#22c55e',
  };
  return (
    <span
      className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: colorMap[color] }}
    />
  );
}

export function TierBadge({ tier }: { tier: string | null }) {
  if (!tier) return null;
  const map: Record<string, { color: string }> = {
    'xuất sắc': { color: '#0ea5e9' },
    'tốt': { color: '#a855f7' },
    'phát triển': { color: '#f59e0b' },
    'cần hỗ trợ': { color: '#ef4444' },
  };
  const { color } = map[tier] || { color: '#a1a1aa' };
  return <Badge color={color}>{tier}</Badge>;
}

export function LessonTypeBadge({ type }: { type: LessonType }) {
  const map: Record<LessonType, { label: string; color: string }> = {
    technique: { label: 'Kỹ thuật', color: '#0ea5e9' },
    mindset: { label: 'Mindset', color: '#a855f7' },
    process: { label: 'Quy trình', color: '#22c55e' },
  };
  const { label, color } = map[type];
  return <Badge color={color}>{label}</Badge>;
}
