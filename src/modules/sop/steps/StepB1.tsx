import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Upload, Link, FileText, X } from 'lucide-react';
import { ChecklistItem } from '../ChecklistItem';
import { MindsetInput } from '../MindsetInput';
import { AiAssistPanel } from '../AiAssistPanel';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Label } from '../../../shared/components/ui/Label';
import { useToast } from '../../../shared/hooks/useToast';
import { sopApi } from '../sop.api';
import { SOP_CHECKLISTS, SOP_MINDSET_QUESTIONS } from '../../../constants/sop-checklists';
import type { EditorVideoSession, SopChecklistItem, SopFileItem, AiAssistResponse } from '../../../shared/types/editor.types';

interface Props {
  session: EditorVideoSession;
  onComplete: () => void;
}

type AiState = 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';

export function StepB1({ session, onComplete }: Props) {
  const toast = useToast();
  const step = session.steps?.find(s => s.step_number === 1);

  const defaultChecklist: SopChecklistItem[] = SOP_CHECKLISTS[1].map(item => ({
    ...item, checked: false, checked_at: null
  }));

  const [checklist, setChecklist] = useState<SopChecklistItem[]>(
    step?.checklist_json?.length ? step.checklist_json : defaultChecklist
  );
  const [files, setFiles] = useState<SopFileItem[]>(step?.files_json || []);
  const [mindset, setMindset] = useState(step?.mindset_answer || '');
  const [newFileUrl, setNewFileUrl] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<SopFileItem['type']>('raw');
  const [aiState, setAiState] = useState<AiState>('idle');
  const [aiData, setAiData] = useState<AiAssistResponse | undefined>();
  const [aiError, setAiError] = useState('');

  const saveMutation = useMutation({
    mutationFn: () => sopApi.updateStep(session.id, 1, {
      mindset_answer: mindset,
      checklist_json: checklist,
      files_json: files,
    }),
    onError: (err) => toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  const handleChecklist = (id: string, checked: boolean) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked, checked_at: checked ? new Date().toISOString() : null } : item
    ));
  };

  const addFile = () => {
    if (!newFileUrl.trim()) return;
    setFiles(prev => [...prev, {
      name: newFileName || newFileUrl,
      url: newFileUrl,
      type: newFileType,
    }]);
    setNewFileUrl('');
    setNewFileName('');
  };

  const removeFile = (idx: number) => setFiles(prev => prev.filter((_, i) => i !== idx));

  const handleAiAssist = async () => {
    setAiState('loading');
    setAiError('');
    try {
      const result = await sopApi.aiAssist({
        step: 1,
        question: SOP_MINDSET_QUESTIONS[1],
        editorAnswer: mindset,
        videoContext: {
          channel: session.task?.channel || 'other',
          videoType: session.task?.video_type || 'long_16_9',
          taskTitle: session.task?.title || '',
        },
      });
      setAiData(result);
      setAiState('success');
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) {
        setAiState('rate-limited');
      } else {
        setAiError(err instanceof Error ? err.message : 'Lỗi không xác định');
        setAiState('error');
      }
    }
  };

  const canAdvance = files.length > 0 || checklist.some(c => c.id === 'b1_2' && c.checked);

  const handleNext = async () => {
    await saveMutation.mutateAsync();
    onComplete();
  };

  const FILE_TYPE_LABELS = { raw: 'Raw footage', brief: 'Brief', ref: 'Reference' };

  return (
    <div className="space-y-6">
      {/* Task info */}
      {session.task && (
        <div className="p-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl">
          <p className="text-xs text-[#a1a1aa] mb-1">Video đang làm</p>
          <h2 className="font-semibold text-[#f4f4f5]">{session.task.title}</h2>
        </div>
      )}

      {/* Checklist */}
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Checklist tiếp nhận</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          {checklist.map(item => (
            <ChecklistItem
              key={item.id}
              id={item.id}
              label={item.label}
              checked={item.checked}
              onChange={handleChecklist}
            />
          ))}
        </div>
      </div>

      {/* Files */}
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">File đính kèm</h3>
        {files.length > 0 && (
          <div className="space-y-2 mb-3">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
                <FileText size={14} className="text-[#a1a1aa] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#f4f4f5] truncate">{f.name}</p>
                  <p className="text-xs text-[#a1a1aa]">{FILE_TYPE_LABELS[f.type]}</p>
                </div>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-[#0ea5e9] text-xs">Mở</a>
                <button onClick={() => removeFile(i)} className="text-[#a1a1aa] hover:text-[#ef4444]">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input placeholder="URL file (Drive, Dropbox...)" value={newFileUrl} onChange={e => setNewFileUrl(e.target.value)} />
          </div>
          <select
            value={newFileType}
            onChange={e => setNewFileType(e.target.value as SopFileItem['type'])}
            className="px-2 py-2 bg-[#242424] border border-[#2a2a2a] rounded-lg text-[#f4f4f5] text-sm"
          >
            <option value="raw">Raw</option>
            <option value="brief">Brief</option>
            <option value="ref">Ref</option>
          </select>
          <Button size="sm" variant="secondary" onClick={addFile} disabled={!newFileUrl.trim()}>
            <Link size={14} />
          </Button>
        </div>
      </div>

      {/* Mindset */}
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Mindset — Tư duy trước khi làm</h3>
        <MindsetInput
          question={SOP_MINDSET_QUESTIONS[1]}
          value={mindset}
          onChange={setMindset}
          onAiAssist={handleAiAssist}
          aiLoading={aiState === 'loading'}
        />
        <AiAssistPanel state={aiState} data={aiData} error={aiError} />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} className="flex-1">
          Lưu nháp
        </Button>
        <Button onClick={handleNext} disabled={!canAdvance} loading={saveMutation.isPending} className="flex-1">
          Sang B2 →
        </Button>
      </div>
      {!canAdvance && (
        <p className="text-xs text-[#a1a1aa] text-center">
          Cần đính kèm ít nhất 1 file để tiếp tục
        </p>
      )}
    </div>
  );
}
