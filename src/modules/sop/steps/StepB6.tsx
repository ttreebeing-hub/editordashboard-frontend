import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChecklistItem } from '../ChecklistItem';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Textarea } from '../../../shared/components/ui/Textarea';
import { Label } from '../../../shared/components/ui/Label';
import { useToast } from '../../../shared/hooks/useToast';
import { sopApi } from '../sop.api';
import { SOP_CHECKLISTS } from '../../../constants/sop-checklists';
import type { EditorVideoSession, SopChecklistItem } from '../../../shared/types/editor.types';

interface Props { session: EditorVideoSession; onComplete: () => void; }

export function StepB6({ session, onComplete }: Props) {
  const toast = useToast();
  const step = session.steps?.find(s => s.step_number === 6);
  const defaultChecklist: SopChecklistItem[] = SOP_CHECKLISTS[6].map(item => ({ ...item, checked: false, checked_at: null }));
  const [checklist, setChecklist] = useState<SopChecklistItem[]>(step?.checklist_json?.length ? step.checklist_json : defaultChecklist);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [reflection, setReflection] = useState({
    what_learned: '',
    what_to_improve: '',
    mindset_note: '',
  });

  const saveMutation = useMutation({
    mutationFn: () => sopApi.updateStep(session.id, 6, { checklist_json: checklist }),
    onError: (err) => toast.error(`Lưu thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  const submitMutation = useMutation({
    mutationFn: () => sopApi.submitSession(session.id, reflection),
    onSuccess: () => { toast.success('Nộp bài thành công! 🎉'); onComplete(); },
    onError: (err) => toast.error(`Nộp bài thất bại: ${err instanceof Error ? err.message : 'Lỗi'}`),
  });

  const handleChecklist = (id: string, checked: boolean) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked, checked_at: checked ? new Date().toISOString() : null } : item));
  };

  const reflectionValid =
    reflection.what_learned.trim().length >= 20 &&
    reflection.what_to_improve.trim().length >= 20 &&
    reflection.mindset_note.trim().length >= 20;

  const allChecked = checklist.every(c => c.checked);
  const canSubmit = allChecked && reflectionValid;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-2">Checklist nộp bài</h3>
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl overflow-hidden">
          {checklist.map(item => <ChecklistItem key={item.id} id={item.id} label={item.label} checked={item.checked} onChange={handleChecklist} />)}
        </div>
      </div>

      {/* Links */}
      <div className="space-y-3">
        <div>
          <Label>YouTube URL</Label>
          <Input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtu.be/..." />
        </div>
        <div>
          <Label>Google Drive link</Label>
          <Input value={driveLink} onChange={e => setDriveLink(e.target.value)} placeholder="https://drive.google.com/..." />
        </div>
      </div>

      {/* Self-reflection */}
      <div>
        <h3 className="text-sm font-semibold text-[#f4f4f5] mb-3">Tự đánh giá sau video</h3>
        <div className="space-y-3">
          <div>
            <Label>Bạn học được gì từ video này? (tối thiểu 20 ký tự)</Label>
            <Textarea
              rows={3}
              value={reflection.what_learned}
              onChange={e => setReflection(p => ({ ...p, what_learned: e.target.value }))}
              placeholder="Tôi học được rằng..."
            />
            <p className={`text-xs mt-1 ${reflection.what_learned.length >= 20 ? 'text-[#22c55e]' : 'text-[#a1a1aa]'}`}>
              {reflection.what_learned.length}/20 ký tự tối thiểu
            </p>
          </div>
          <div>
            <Label>Lần sau bạn sẽ làm gì khác? (tối thiểu 20 ký tự)</Label>
            <Textarea
              rows={3}
              value={reflection.what_to_improve}
              onChange={e => setReflection(p => ({ ...p, what_to_improve: e.target.value }))}
              placeholder="Lần sau tôi sẽ..."
            />
            <p className={`text-xs mt-1 ${reflection.what_to_improve.length >= 20 ? 'text-[#22c55e]' : 'text-[#a1a1aa]'}`}>
              {reflection.what_to_improve.length}/20 ký tự tối thiểu
            </p>
          </div>
          <div>
            <Label>Mindset của bạn khi làm video này? (tối thiểu 20 ký tự)</Label>
            <Textarea
              rows={3}
              value={reflection.mindset_note}
              onChange={e => setReflection(p => ({ ...p, mindset_note: e.target.value }))}
              placeholder="Trong quá trình làm, tôi cảm thấy..."
            />
            <p className={`text-xs mt-1 ${reflection.mindset_note.length >= 20 ? 'text-[#22c55e]' : 'text-[#a1a1aa]'}`}>
              {reflection.mindset_note.length}/20 ký tự tối thiểu
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="secondary" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending} className="flex-1">Lưu nháp</Button>
        <Button
          onClick={() => submitMutation.mutate()}
          disabled={!canSubmit}
          loading={submitMutation.isPending}
          className="flex-1 bg-[#22c55e] hover:bg-[#16a34a]"
        >
          Nộp bài 🎉
        </Button>
      </div>
      {!canSubmit && <p className="text-xs text-[#a1a1aa] text-center">Hoàn thành checklist và tự đánh giá đầy đủ để nộp</p>}
    </div>
  );
}
