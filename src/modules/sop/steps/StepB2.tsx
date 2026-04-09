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

interface Props {
  session: EditorVideoSession;
  onComplete: () => void;
}

type AiState = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';

export function StepB2({ session, onComplete }: Props) {
  const toast = useToast();
  const step = session.steps?.find(s => s.step_number === 2);

  const defaultChecklist: SopChecklistItem[] = SOP_CHECKLISTS[2].map(item => ({
    ...item, checked: false, checked_at: null
  }));

  const [checklist, setChecklist] = useState<SopChecklistItem[]>(
    step?.checklist_json?.length ? step.checklist_json : defaultChecklist
  );
  const [mindset, setMindset] = useState(step?.mindset_answer || '');
  const [aiState, setAiState] = useState<AiState>('idle');
  const [aiData, setAiData] = useState<AiAssistResponse | undefined>();
  const [aiError, setAiError] = useState('');

  const saveMutation = useMutation({
    mutationFn: () => sopApi.updateStep(session.id, 2, {
      mindset_answer: mindset,
      checklist_json: checklist,
    }),
    onError: (err) => toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  const handleChecklist = (id: string, checked: boolean) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked, checked_at: checked ? new Date().toISOString() : null } : item
    ));
  };

  const handleAiAssist = async () => {
    setAiState('loading');
    try {
      const result = await sopApi.aiAssist({
        step: 2, question: SOP_MINDSET_QUESTIONS[2], editorAnswer: mindset,
        videoContext: { channel: session.task?.channel || 'other', videoType: session.task?.video_type || 'long_16_9', taskTitle: session.task?.title || '' },
      });
      setAiData(result);
      setAiState('success');
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) setAiState('rate-limited');
      else { setAiError(err instanceof Error ? err.message : 'Lỗi'); setAiState('error'); }
    }
  };

  const allChecked = checklist.every(c => c.checked);

  const handleNext = async () => {
    await saveMutation.mutateAsync();
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Checklist dựng thô</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          {checklist.map(item => (
            <ChecklistItem key={item.id} id={item.id} label={item.label} checked={item.checked} onChange={handleChecklist} />
          ))}
        </div>
        {!allChecked && (
          <p className="text-xs text-[#a1a1aa] mt-2">
            Hoàn thành tất cả {checklist.filter(c => !c.checked).length} mục còn lại để sang bước tiếp theo
          </p>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Mindset — Cấu trúc câu chuyện</h3>
        <MindsetInput question={SOP_MINDSET_QUESTIONS[2]} value={mindset} onChange={setMindset} onAiAssist={handleAiAssist} aiLoading={aiState === 'loading'} />
        <AiAssistPanel state={aiState} data={aiData} error={aiError} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} className="flex-1">Lưu nháp</Button>
        <Button onClick={handleNext} disabled={!allChecked} loading={saveMutation.isPending} className="flex-1">Sang B3 →</Button>
      </div>
    </div>
  );
}
