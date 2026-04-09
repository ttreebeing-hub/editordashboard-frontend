import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import type { EditorMonthlyScore } from '../../shared/types/editor.types';

interface Props { data: EditorMonthlyScore; }

interface BarProps { label: string; score: number; max: number; color: string; }

function ScoreBar({ label, score, max, color }: BarProps) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#a1a1aa]">{label}</span>
        <span className="text-[#f4f4f5] font-medium">{score.toFixed(1)}/{max}</span>
      </div>
      <div className="h-2 bg-[#242424] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function MonthlyScore({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Điểm tháng {data.year_month}</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-[#f4f4f5]">{data.total_score.toFixed(0)}</p>
            <p className="text-xs text-[#a1a1aa]">/ 100 điểm</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <ScoreBar label="SOP (40đ)" score={data.sop_score} max={40} color="#0ea5e9" />
        <ScoreBar label="Mindset (30đ)" score={data.mindset_score} max={30} color="#a855f7" />
        <ScoreBar label="Độ chính xác (30đ)" score={data.accuracy_score} max={30} color="#22c55e" />
        <div className="flex gap-4 pt-1 border-t border-[#2a2a2a] text-xs text-[#a1a1aa]">
          <span>{data.videos_completed} video hoàn thành</span>
          <span>{data.lessons_count} bài học</span>
        </div>
      </CardContent>
    </Card>
  );
}
