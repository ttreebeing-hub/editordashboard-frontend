import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: number | null;
  color?: string;
}

function Delta({ delta }: { delta: number | null | undefined }) {
  if (delta == null) return null;
  if (delta > 0) return <span className="flex items-center gap-0.5 text-green-400 text-xs"><TrendingUp className="w-3 h-3" />+{delta.toFixed(1)}</span>;
  if (delta < 0) return <span className="flex items-center gap-0.5 text-red-400 text-xs"><TrendingDown className="w-3 h-3" />{delta.toFixed(1)}</span>;
  return <span className="flex items-center gap-0.5 text-[#a1a1aa] text-xs"><Minus className="w-3 h-3" />0</span>;
}

function KpiCard({ label, value, unit = '', delta, color = 'text-[#0ea5e9]' }: KpiCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-5">
      <p className="text-[#a1a1aa] text-sm mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <span className={`text-2xl font-bold ${color}`}>{value}</span>
          {unit && <span className="text-[#a1a1aa] text-sm ml-1">{unit}</span>}
        </div>
        <Delta delta={delta} />
      </div>
    </div>
  );
}

interface Props {
  avgRetention: number | null;
  avgCtr: number | null;
  monthlyScore: number | null;
  monthlyScoreDelta?: number | null;
}

export function KpiCards({ avgRetention, avgCtr, monthlyScore, monthlyScoreDelta }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <KpiCard
        label="Avg Retention"
        value={avgRetention != null ? avgRetention.toFixed(1) : '--'}
        unit="%"
        color="text-[#0ea5e9]"
      />
      <KpiCard
        label="Avg CTR"
        value={avgCtr != null ? avgCtr.toFixed(2) : '--'}
        unit="%"
        color="text-purple-400"
      />
      <KpiCard
        label="Điểm tháng này"
        value={monthlyScore != null ? monthlyScore.toFixed(1) : '--'}
        unit="/ 100"
        delta={monthlyScoreDelta}
        color="text-teal-400"
      />
    </div>
  );
}
