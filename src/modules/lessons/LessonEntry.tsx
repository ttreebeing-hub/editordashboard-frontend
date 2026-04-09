import { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { LessonTypeBadge } from '../../shared/components/Badge';
import type { EditorLesson } from '../../shared/types/editor.types';

function relativeTime(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  if (days < 7) return `${days} ngày trước`;
  return new Date(date).toLocaleDateString('vi-VN');
}

interface Props {
  lesson: EditorLesson;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

const TRUNCATE_CHARS = 60;

export function LessonEntry({ lesson, onDelete, deleting }: Props) {
  const [expanded, setExpanded] = useState(false);
  const needsTruncate = lesson.content.length > TRUNCATE_CHARS;
  const displayText = expanded || !needsTruncate
    ? lesson.content
    : lesson.content.slice(0, TRUNCATE_CHARS) + '...';

  return (
    <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl space-y-2">
      <div className="flex items-center gap-2">
        <LessonTypeBadge type={lesson.type} />
        <span className="text-xs text-[#a1a1aa] ml-auto">{relativeTime(lesson.created_at)}</span>
        <button
          onClick={() => onDelete(lesson.id)}
          disabled={deleting}
          className="text-[#a1a1aa] hover:text-[#ef4444] transition-colors disabled:opacity-50"
        >
          <Trash2 size={14} />
        </button>
      </div>
      <p className="text-sm text-[#f4f4f5] leading-relaxed whitespace-pre-wrap">{displayText}</p>
      {needsTruncate && (
        <button
          onClick={() => setExpanded(e => !e)}
          className="flex items-center gap-1 text-xs text-[#0ea5e9] hover:underline"
        >
          {expanded ? <><ChevronUp size={12} /> Thu gọn</> : <><ChevronDown size={12} /> Xem thêm</>}
        </button>
      )}
    </div>
  );
}
