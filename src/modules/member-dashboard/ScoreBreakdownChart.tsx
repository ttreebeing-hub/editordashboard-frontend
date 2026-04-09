import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { EditorMonthlyScore } from '../../shared/types/editor.types';

interface Props {
  score: EditorMonthlyScore | null;
}

export function ScoreBreakdownChart({ score }: Props) {
  const data = [
    { name: 'Hiệu suất video', value: score?.sop_score ?? 0, max: 40, fill: '#0ea5e9' },
    { name: 'Chất lượng quy trình', value: score?.mindset_score ?? 0, max: 30, fill: '#a855f7' },
    { name: 'Mindset & Hành vi', value: score?.accuracy_score ?? 0, max: 30, fill: '#14b8a6' },
  ];

  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#f4f4f5] font-semibold">Phân tích điểm tháng</h3>
        {score && (
          <span className="text-2xl font-bold text-teal-400">
            {score.total_score.toFixed(0)}<span className="text-sm text-[#a1a1aa] font-normal">/100</span>
          </span>
        )}
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} layout="vertical" barSize={16}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" horizontal={false} />
          <XAxis type="number" domain={[0, 40]} tick={{ fill: '#a1a1aa', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#a1a1aa', fontSize: 11 }} width={130} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#242424', border: '1px solid #2a2a2a', borderRadius: 8, fontSize: 12 }}
            formatter={(v: number, _, props) => [`${v} / ${props.payload.max}`, props.payload.name]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
