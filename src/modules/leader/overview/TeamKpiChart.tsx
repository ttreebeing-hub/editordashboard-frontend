import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Mock data for now — replace with real data from API
const mockData = [
  { week: 'Tuần 1', retention: 62, ctr: 4.2 },
  { week: 'Tuần 2', retention: 58, ctr: 3.8 },
  { week: 'Tuần 3', retention: 71, ctr: 5.1 },
  { week: 'Tuần 4', retention: 65, ctr: 4.7 },
  { week: 'Tuần 5', retention: 74, ctr: 5.3 },
  { week: 'Tuần 6', retention: 68, ctr: 4.9 },
];

export function TeamKpiChart() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <h3 className="text-[#f4f4f5] font-semibold mb-4">Retention & CTR 6 tuần gần nhất</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mockData} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis dataKey="week" tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#a1a1aa', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#242424', border: '1px solid #2a2a2a', borderRadius: 8 }}
            labelStyle={{ color: '#f4f4f5' }}
          />
          <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
          <Bar dataKey="retention" name="Retention %" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
          <Bar dataKey="ctr" name="CTR %" fill="#a855f7" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
