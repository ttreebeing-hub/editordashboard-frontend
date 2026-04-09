import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChecklistItem } from '../ChecklistItem';
import { MindsetInput } from '../MindsetInput';
import { AiAssistPanel } from '../AiAssistPanel';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { useToast } from '../../../shared/hooks/useToast';
import { sopApi } from '../sop.api';
import { SOP_CHECKLISTS, SOP_MINDSET_QUESTIONS } from '../../../constants/sop-checklists';
import type { EditorVideoSession, SopChecklistItem, AiAssistResponse } from '../../../shared/types/editor.types';

interface Props { session: EditorVideoSession; onComplete: () => void; }
type AiState = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';

export function StepB5({ session, onComplete }: Props) {
  const toast = useToast();
  const step = session.steps?.find(s => s.step_number === 5);
  const defaultChecklist: SopChecklistItem[] = SOP_CHECKLISTS[5].map(item => ({ ...item, checked: false, checked_at: null }));
  const [checklist, setChecklist] = useState<SopChecklistItem[]>(step?.checklist_json?.length ? step.checklist_json : defaultChecklist);
  const [mindset, setMindset] = useState(step?.mindset_answer || '');
  const [retention, setRetention] = useState('');
  const [ctr, setCtr] = useState('');
  const [dropPoint, setDropPoint] = useState('');
  const [editorNote, setEditorNote] = useState('');
  const [predictionSaved, setPredictionSaved] = useState(false);
  const [aiState, setAiState] = useState<AiState>('idle');
  const [aiData, setAiData] = useState<AiAssistResponse | undefined>();
  const [aiError, setAiError] = useState('');

  const saveMutation = useMutation({
    mutationFn: () => sopApi.updateStep(session.id, 5, { mindset_answer: mindset, checklist_json: checklist }),
    onError: (err) => toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  const predictionMutation = useMutation({
    mutationFn: () => sopApi.savePrediction(session.id, {
      retention_predicted: Number(retention),
      ctr_predicted: Number(ctr),
      drop_point_predicted: dropPoint ? Number(dropPoint) : null,
      editor_note: editorNote || null,
    }),
    onSuccess: () => { toast.success('Đã lưu dự đoán!'); setPredictionSaved(true); },
    onError: (err) => toast.error(`Lưu dự đoán thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  const handleChecklist = (id: string, checked: boolean) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked, checked_at: checked ? new Date().toISOString() : null } : item));
  };

  const handleAiAssist = async () => {
    setAiState('loading');
    try {
      const result = await sopApi.aiAssist({ step: 5, question: SOP_MINDSET_QUESTIONS[5], editorAnswer: mindset, videoContext: { channel: session.task?.channel || 'other', videoType: session.task?.video_type || 'long_16_9', taskTitle: session.task?.title || '' } });
      setAiData(result); setAiState('success');
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) setAiState('rate-limited');
      else { setAiError(err instanceof Error ? err.message : 'Lỗi'); setAiState('error'); }
    }
  };

  const canSavePrediction = retention && ctr && Number(retention) > 0 && Number(ctr) > 0;
  const canAdvance = predictionSaved;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Checklist kiểm tra cuối</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          {checklist.map(item => <ChecklistItem key={item.id} id={item.id} label={item.label} checked={item.checked} onChange={handleChecklist} />)}
        </div>
      </div>

      {/* Prediction */}
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-3">Dự đoán chỉ số</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Retention dự đoán (%)</Label>
              <Input type="number" min={0} max={100} value={retention} onChange={e => setRetention(e.target.value)} placeholder="45" disabled={predictionSaved} />
            </div>
            <div>
              <Label>CTR dự đoán (%)</Label>
              <Input type="number" min={0} max={100} value={ctr} onChange={e => setCtr(e.target.value)} placeholder="8" disabled={predictionSaved} />
            </div>
          </div>
          <div>
            <Label>Điểm drop (giây) — tuỳ chọn</Label>
            <Input type="number" min={0} value={dropPoint} onChange={e => setDropPoint(e.target.value)} placeholder="120" disabled={predictionSaved} />
          </div>
          <div>
            <Label>Ghi chú của editor</Label>
            <Textarea rows={2} value={editorNote} onChange={e => setEditorNote(e.target.value)} placeholder="Hook mạnh, khán giả mục tiêu 25-35 tuổi..." disabled={predictionSaved} />
          </div>
          {!predictionSaved ? (
            <Button onClick={() => predictionMutation.mutate()} disabled={!canSavePrediction} loading={predictionMutation.isPending} className="w-full">
              Lưu dự đoán
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-[#22c55e] text-sm">
              <span>✓</span> Đã lưu dự đoán
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Mindset</h3>
        <MindsetInput question={SOP_MINDSET_QUESTIONS[5]} value={mindset} onChange={setMindset} onAiAssist={handleAiAssist} aiLoading={aiState === 'loading'} />
        <AiAssistPanel state={aiState} data={aiData} error={aiError} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} className="flex-1">Lưu nháp</Button>
        <Button onClick={async () => { await saveMutation.mutateAsync(); onComplete(); }} disabled={!canAdvance} loading={saveMutation.isPending} className="flex-1">Sang B6 →</Button>
      </div>
      {!canAdvance && <p className="text-xs text-[#a1a1aa] text-center">Cần lưu dự đoán trước khi sang B6</p>}
    </div>
  );
}
