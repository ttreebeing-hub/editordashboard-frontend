import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChecklistItem } from '../ChecklistItem';
import { MindsetInput } from '../MindsetInput';
import { AiAssistPanel } from '../AiAssistPanel';
import { Button } from '../../../shared/components/ui/Button';
import { useToast } from '../../../shared/hooks/useToast';
import { sopApi } from '../sop.api';
import { SOP_CHECKLISTS, SOP_MINDSET_QUESTIONS } from '../../../constants/sop-checklists';
import type { EditorVideoSession, SopChecklistItem, AiAssistResponse } from '../../../shared/types/editor.types';

interface Props { session: EditorVideoSession; onComplete: () => void; }
type AiState = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';

export function StepB3({ session, onComplete }: Props) {
  const toast = useToast();
  const step = session.steps?.find(s => s.step_number === 3);
  const defaultChecklist: SopChecklistItem[] = SOP_CHECKLISTS[3].map(item => ({ ...item, checked: false, checked_at: null }));
  const [checklist, setChecklist] = useState<SopChecklistItem[]>(step?.checklist_json?.length ? step.checklist_json : defaultChecklist);
  const [mindset, setMindset] = useState(step?.mindset_answer || '');
  const [aiState, setAiState] = useState<AiState>('idle');
  const [aiData, setAiData] = useState<AiAssistResponse | undefined>();
  const [aiError, setAiError] = useState('');

  const saveMutation = useMutation({
    mutationFn: () => sopApi.updateStep(session.id, 3, { mindset_answer: mindset, checklist_json: checklist }),
    onError: (err) => toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  const handleChecklist = (id: string, checked: boolean) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked, checked_at: checked ? new Date().toISOString() : null } : item));
  };

  const handleAiAssist = async () => {
    setAiState('loading');
    try {
      const result = await sopApi.aiAssist({ step: 3, question: SOP_MINDSET_QUESTIONS[3], editorAnswer: mindset, videoContext: { channel: session.task?.channel || 'other', videoType: session.task?.video_type || 'long_16_9', taskTitle: session.task?.title || '' } });
      setAiData(result); setAiState('success');
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) setAiState('rate-limited');
      else { setAiError(err instanceof Error ? err.message : 'Lỗi'); setAiState('error'); }
    }
  };

  const allChecked = checklist.every(c => c.checked);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Checklist hoàn thiện video</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          {checklist.map(item => <ChecklistItem key={item.id} id={item.id} label={item.label} checked={item.checked} onChange={handleChecklist} />)}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Mindset — Trải nghiệm người xem</h3>
        <MindsetInput question={SOP_MINDSET_QUESTIONS[3]} value={mindset} onChange={setMindset} onAiAssist={handleAiAssist} aiLoading={aiState === 'loading'} />
        <AiAssistPanel state={aiState} data={aiData} error={aiError} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} className="flex-1">Lưu nháp</Button>
        <Button onClick={async () => { await saveMutation.mutateAsync(); onComplete(); }} disabled={!allChecked} loading={saveMutation.isPending} className="flex-1">Sang B4 →</Button>
      </div>
    </div>
  );
}
