import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import type { AccuracyHistory } from './progress.api';

interface Props { data: AccuracyHistory[]; }

export function AccuracyChart({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Độ chính xác dự đoán theo thời gian</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
            <XAxis dataKey="date" tick={{ fill: '#a1a1aa', fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
            <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '8px' }}
              labelStyle={{ color: '#f4f4f5' }}
              formatter={(value: number, name: string) => [
                `${value?.toFixed(1)}%`,
                name === 'retention_accuracy' ? 'Retention' : name === 'ctr_accuracy' ? 'CTR' : 'Tổng'
              ]}
            />
            <Legend formatter={(v) => v === 'retention_accuracy' ? 'Retention' : v === 'ctr_accuracy' ? 'CTR' : 'Tổng'} />
            <Line type="monotone" dataKey="retention_accuracy" stroke="#0ea5e9" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="ctr_accuracy" stroke="#a855f7" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="overall_accuracy" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
