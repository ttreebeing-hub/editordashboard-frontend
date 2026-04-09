import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import type { MindsetTimelineEntry } from './progress.api';

interface Props { data: MindsetTimelineEntry[]; }

function groupByMonth(entries: MindsetTimelineEntry[]) {
  const groups: Record<string, MindsetTimelineEntry[]> = {};
  for (const entry of entries) {
    const month = entry.created_at.slice(0, 7);
    if (!groups[month]) groups[month] = [];
    groups[month].push(entry);
  }
  return groups;
}

export function MindsetTimeline({ data }: Props) {
  const groups = groupByMonth(data);
  const months = Object.keys(groups).sort().reverse();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Lịch sử mindset</CardTitle>
      </CardHeader>
      <CardContent>
        {months.length === 0 ? (
          <p className="text-sm text-[#a1a1aa]">Chưa có dữ liệu mindset</p>
        ) : (
          <div className="space-y-5">
            {months.map(month => (
              <div key={month}>
                <p className="text-xs font-semibold text-[#0ea5e9] mb-2">{month}</p>
                <div className="space-y-2 pl-3 border-l border-[#2a2a2a]">
                  {groups[month].map((entry, i) => (
                    <div key={i} className="space-y-1">
                      <p className="text-xs text-[#a1a1aa]">B{entry.step} — {entry.question.slice(0, 50)}...</p>
                      <p className="text-sm text-[#f4f4f5] leading-relaxed">{entry.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
