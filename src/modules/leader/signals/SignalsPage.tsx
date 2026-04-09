import { useQuery } from '@tanstack/react-query';
import { leaderApi } from '../leader.api';
import { SignalRow } from './SignalRow';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';
import type { EditorSignal } from '../../../shared/types/editor.types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

function SignalSection({
  color, emoji, title, signals,
}: { color: string; emoji: string; title: string; signals: EditorSignal[] }) {
  const [open, setOpen] = useState(signals.length > 0);
  if (signals.length === 0) return null;

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#242424] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{emoji}</span>
          <span className="font-semibold text-[#f4f4f5]">{title}</span>
          <span className="text-sm text-[#a1a1aa]">({signals.length})</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#a1a1aa] transition-transform ${open ? '' : '-rotate-90'}`} />
      </button>
      {open && (
        <div className="px-5 pb-2">
          {signals.map(s => <SignalRow key={s.id} signal={s} />)}
        </div>
      )}
    </div>
  );
}

export function SignalsPage() {
  const { data: signals = [], isLoading } = useQuery({
    queryKey: ['leader-signals'],
    queryFn: leaderApi.getSignals,
    staleTime: 60_000,
  });

  const red = signals.filter(s => s.signal_color === 'red');
  const yellow = signals.filter(s => s.signal_color === 'yellow');
  const green = signals.filter(s => s.signal_color === 'green');

  if (isLoading) return <LoadingSpinner label="Đang tải tín hiệu..." />;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold text-[#f4f4f5]">Signal Alerts</h1>

      {signals.length === 0 && (
        <div className="text-center text-[#a1a1aa] py-16 text-sm">
          Không có tín hiệu nào. Team đang hoạt động tốt! 🎉
        </div>
      )}

      <SignalSection color="red" emoji="🔴" title="Cần xử lý ngay" signals={red} />
      <SignalSection color="yellow" emoji="🟡" title="Cần theo dõi" signals={yellow} />
      <SignalSection color="green" emoji="🟢" title="Hiệu suất tốt" signals={green} />
    </div>
  );
}
