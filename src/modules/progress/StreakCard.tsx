import { Card, CardContent } from '../../shared/components/ui/Card';
import type { StreakData } from './progress.api';

interface Props { data: StreakData; }

export function StreakCard({ data }: Props) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[#a1a1aa] mb-1">Streak hiện tại</p>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔥</span>
              <span className="text-3xl font-bold text-[#f4f4f5]">{data.current_streak}</span>
              <span className="text-[#a1a1aa] text-sm">ngày liên tiếp</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#a1a1aa]">Kỷ lục</p>
            <p className="text-lg font-semibold text-[#f59e0b]">{data.longest_streak} ngày</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
