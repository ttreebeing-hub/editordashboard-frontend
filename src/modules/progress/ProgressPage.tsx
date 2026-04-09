import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { StreakCard } from './StreakCard';
import { AccuracyChart } from './AccuracyChart';
import { MonthlyScore } from './MonthlyScore';
import { MindsetTimeline } from './MindsetTimeline';
import { Card, CardHeader, CardTitle, CardContent } from '../../shared/components/ui/Card';
import { Slider } from '../../shared/components/ui/Slider';
import { Button } from '../../shared/components/ui/Button';
import { PageLoader } from '../../shared/components/LoadingSpinner';
import { useToast } from '../../shared/hooks/useToast';
import { progressApi } from './progress.api';
import type { MindsetScores } from '../../shared/types/editor.types';

const MINDSET_LABELS: { key: keyof MindsetScores; label: string; desc: string }[] = [
  { key: 'product_thinking', label: 'Tư duy sản phẩm', desc: 'Nghĩ về chất lượng và trải nghiệm khán giả' },
  { key: 'audience_focus', label: 'Tập trung khán giả', desc: 'Luôn nghĩ đến người xem' },
  { key: 'proactive_suggest', label: 'Chủ động đề xuất', desc: 'Tự đưa ra ý tưởng, không chờ được nói' },
  { key: 'owner_mindset', label: 'Mindset chủ nhân', desc: 'Coi video như sản phẩm của mình' },
];

export function ProgressPage() {
  const toast = useToast();
  const [evalSubmitted, setEvalSubmitted] = useState(false);
  const [scores, setScores] = useState<MindsetScores>({
    product_thinking: 3,
    audience_focus: 3,
    proactive_suggest: 3,
    owner_mindset: 3,
  });

  const { data: streak, isLoading: loadStreak } = useQuery({ queryKey: ['streak'], queryFn: progressApi.getStreak });
  const { data: monthlyScores, isLoading: loadMonthly } = useQuery({ queryKey: ['monthly-scores'], queryFn: progressApi.getMonthlyScores });
  const { data: accuracyHistory, isLoading: loadAccuracy } = useQuery({ queryKey: ['accuracy-history'], queryFn: progressApi.getAccuracyHistory });
  const { data: mindsetTimeline, isLoading: loadMindset } = useQuery({ queryKey: ['mindset-timeline'], queryFn: progressApi.getMindsetTimeline });

  const evalMutation = useMutation({
    mutationFn: () => progressApi.submitMindsetSelfEval(scores),
    onSuccess: () => { toast.success('Đã lưu tự đánh giá!'); setEvalSubmitted(true); },
    onError: (err) => toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  if (loadStreak || loadMonthly || loadAccuracy || loadMindset) return <PageLoader />;

  const latestMonthly = monthlyScores?.[0];

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {streak && <StreakCard data={streak} />}
      {latestMonthly && <MonthlyScore data={latestMonthly} />}
      {accuracyHistory && accuracyHistory.length > 0 && <AccuracyChart data={accuracyHistory} />}

      {/* Mindset Self-eval */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tự đánh giá mindset tháng này</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {MINDSET_LABELS.map(({ key, label, desc }) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-baseline">
                <div>
                  <p className="text-sm font-medium text-[#f4f4f5]">{label}</p>
                  <p className="text-xs text-[#a1a1aa]">{desc}</p>
                </div>
                <span className="text-xl font-bold text-[#0ea5e9] ml-2">{scores[key]}</span>
              </div>
              <Slider
                value={scores[key]}
                onChange={(v) => setScores(p => ({ ...p, [key]: v }))}
                min={1}
                max={5}
                step={1}
                disabled={evalSubmitted}
              />
              <div className="flex justify-between text-xs text-[#a1a1aa]">
                <span>1 — Chưa ổn</span>
                <span>5 — Xuất sắc</span>
              </div>
            </div>
          ))}
          {!evalSubmitted ? (
            <Button onClick={() => evalMutation.mutate()} loading={evalMutation.isPending} className="w-full">
              Lưu tự đánh giá
            </Button>
          ) : (
            <div className="text-center text-[#22c55e] text-sm py-2">✓ Đã lưu tự đánh giá tháng này</div>
          )}
        </CardContent>
      </Card>

      {mindsetTimeline && mindsetTimeline.length > 0 && <MindsetTimeline data={mindsetTimeline} />}
    </div>
  );
}
