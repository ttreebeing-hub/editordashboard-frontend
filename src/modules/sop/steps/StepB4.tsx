import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChecklistItem } from '../ChecklistItem';
import { MindsetInput } from '../MindsetInput';
import { AiAssistPanel } from '../AiAssistPanel';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { Select } from '../../../shared/components/ui/Select';
import { useToast } from '../../../shared/hooks/useToast';
import { sopApi } from '../sop.api';
import { SOP_CHECKLISTS, SOP_MINDSET_QUESTIONS } from '../../../constants/sop-checklists';
import type { EditorVideoSession, SopChecklistItem, SopExportSpec, AiAssistResponse } from '../../../shared/types/editor.types';

interface Props { session: EditorVideoSession; onComplete: () => void; }
type AiState = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';

export function StepB4({ session, onComplete }: Props) {
  const toast = useToast();
  const step = session.steps?.find(s => s.step_number === 4);
  const defaultChecklist: SopChecklistItem[] = SOP_CHECKLISTS[4].map(item => ({ ...item, checked: false, checked_at: null }));
  const [checklist, setChecklist] = useState<SopChecklistItem[]>(step?.checklist_json?.length ? step.checklist_json : defaultChecklist);
  const [mindset, setMindset] = useState(step?.mindset_answer || '');
  const [exportSpec, setExportSpec] = useState<SopExportSpec>(step?.export_spec_json || {
    resolution: session.task?.video_type === 'short_9_16' ? '1080x1920' : '1920x1080',
    duration_sec: 0, file_name: '', file_reviewed: false,
  });
  const [aiState, setAiState] = useState<AiState>('idle');
  const [aiData, setAiData] = useState<AiAssistResponse | undefined>();
  const [aiError, setAiError] = useState('');

  const saveMutation = useMutation({
    mutationFn: () => sopApi.updateStep(session.id, 4, { mindset_answer: mindset, checklist_json: checklist, export_spec_json: exportSpec }),
    onError: (err) => toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  const handleChecklist = (id: string, checked: boolean) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked, checked_at: checked ? new Date().toISOString() : null } : item));
    if (id === 'b4_2' && checked) setExportSpec(prev => ({ ...prev, file_reviewed: true }));
  };

  const handleAiAssist = async () => {
    setAiState('loading');
    try {
      const result = await sopApi.aiAssist({ step: 4, question: SOP_MINDSET_QUESTIONS[4], editorAnswer: mindset, videoContext: { channel: session.task?.channel || 'other', videoType: session.task?.video_type || 'long_16_9', taskTitle: session.task?.title || '' } });
      setAiData(result); setAiState('success');
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) setAiState('rate-limited');
      else { setAiError(err instanceof Error ? err.message : 'Lỗi'); setAiState('error'); }
    }
  };

  const reviewedChecked = checklist.find(c => c.id === 'b4_2')?.checked;
  const specFilled = exportSpec.file_name && exportSpec.duration_sec > 0;
  const canAdvance = reviewedChecked && specFilled;

  return (
    <div className="space-y-6">
      {/* Export spec */}
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-3">Thông tin xuất file</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Resolution</Label>
              <Select value={exportSpec.resolution} onChange={(v) => setExportSpec(prev => ({ ...prev, resolution: v as SopExportSpec['resolution'] }))} options={[{ value: '1920x1080', label: '1920×1080 (16:9)' }, { value: '1080x1920', label: '1080×1920 (9:16)' }]} />
            </div>
            <div>
              <Label>Thời lượng (giây)</Label>
              <Input type="number" min={0} value={exportSpec.duration_sec || ''} onChange={e => setExportSpec(prev => ({ ...prev, duration_sec: Number(e.target.value) }))} placeholder="320" />
            </div>
          </div>
          <div>
            <Label>Tên file xuất</Label>
            <Input value={exportSpec.file_name} onChange={e => setExportSpec(prev => ({ ...prev, file_name: e.target.value }))} placeholder="video_name_v1.mp4" className="font-mono text-xs" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Checklist xuất file</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          {checklist.map(item => <ChecklistItem key={item.id} id={item.id} label={item.label} checked={item.checked} onChange={handleChecklist} />)}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Mindset</h3>
        <MindsetInput question={SOP_MINDSET_QUESTIONS[4]} value={mindset} onChange={setMindset} onAiAssist={handleAiAssist} aiLoading={aiState === 'loading'} />
        <AiAssistPanel state={aiState} data={aiData} error={aiError} />
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} className="flex-1">Lưu nháp</Button>
        <Button onClick={async () => { await saveMutation.mutateAsync(); onComplete(); }} disabled={!canAdvance} loading={saveMutation.isPending} className="flex-1">Sang B5 →</Button>
      </div>
      {!canAdvance && <p className="text-xs text-[#a1a1aa] text-center">Điền thông tin file và đánh dấu đã xem lại 100%</p>}
    </div>
  );
}
