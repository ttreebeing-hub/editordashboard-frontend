import { useState } from 'react';
import { useTaskStore } from '../../shared/stores/taskStore';
import { CHANNELS } from '../../constants/app-config';
import { fmtDeadline, isUrgent } from '../../shared/utils/task-utils';
import type { Task } from '../../shared/types/editor.types';

const CHECKLIST = [
  'Chất lượng hình ảnh đạt tiêu chuẩn Singapore Way',
  'Âm thanh rõ ràng, không nhiễu, level đúng',
  'Hook 5 giây đầu đủ mạnh và đúng format',
  'Transition và cut đúng nhịp, không giật',
  'Caption/subtitle đúng, không lỗi chính tả',
];

interface CheckModalProps {
  task: Task;
  onApprove: () => void;
  onClose: () => void;
}

function CheckModal({ task, onApprove, onClose }: CheckModalProps) {
  const [checked, setChecked] = useState<boolean[]>(new Array(CHECKLIST.length).fill(false));
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState('');
  const { rejectTask } = useTaskStore();
  const allChecked = checked.every(Boolean);

  const handleReject = () => {
    if (!reason.trim()) return;
    rejectTask(task.id);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 24, width: 420, maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--t1)', marginBottom: 4 }}>
          {rejectMode ? '⛔ Từ chối video' : '✅ Duyệt video'}
        </div>
        <div style={{ fontSize: 11, color: 'var(--t3)', marginBottom: 16 }}>{task.name}</div>

        {!rejectMode ? (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t2)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Singapore Way Checklist
            </div>
            {CHECKLIST.map((item, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checked[i]}
                  onChange={e => {
                    const next = [...checked];
                    next[i] = e.target.checked;
                    setChecked(next);
                  }}
                  style={{ marginTop: 2, accentColor: 'var(--teal)', width: 14, height: 14 }}
                />
                <span style={{ fontSize: 12, color: checked[i] ? 'var(--t2)' : 'var(--t1)', textDecoration: checked[i] ? 'line-through' : 'none' }}>{item}</span>
              </label>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectMode(true)} style={{ padding: '7px 14px', borderRadius: 6, background: 'rgba(198,40,40,.15)', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Từ chối</button>
              <button
                onClick={allChecked ? onApprove : undefined}
                disabled={!allChecked}
                style={{ padding: '7px 14px', borderRadius: 6, background: allChecked ? 'var(--green)' : 'var(--s2)', border: 'none', color: allChecked ? '#fff' : 'var(--t3)', fontSize: 12, cursor: allChecked ? 'pointer' : 'not-allowed', fontWeight: 600 }}
              >
                {allChecked ? 'Duyệt ✓' : `Tick đủ ${checked.filter(Boolean).length}/${CHECKLIST.length}`}
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 11, color: 'var(--t2)', marginBottom: 8 }}>Lý do từ chối:</div>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows={4}
              placeholder="Nhập lý do từ chối..."
              style={{ width: '100%', padding: '8px 10px', borderRadius: 6, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: 12, outline: 'none', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setRejectMode(false)} style={{ padding: '7px 14px', borderRadius: 6, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 12, cursor: 'pointer' }}>Quay lại</button>
              <button onClick={handleReject} disabled={!reason.trim()} style={{ padding: '7px 14px', borderRadius: 6, background: reason.trim() ? 'var(--red)' : 'var(--s2)', border: 'none', color: reason.trim() ? '#fff' : 'var(--t3)', fontSize: 12, fontWeight: 600, cursor: reason.trim() ? 'pointer' : 'not-allowed' }}>Xác nhận từ chối</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function ApprovePage() {
  const { tasks, approveTask, rejectTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const pendingTasks = tasks.filter(t => t.pend && t.step !== 'Done');

  const handleApprove = (task: Task) => {
    approveTask(task.id);
    setSelectedTask(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--t1)' }}>Video chờ duyệt</div>
        <span style={{ background: 'var(--red)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>{pendingTasks.length}</span>
      </div>

      {pendingTasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--t3)', fontSize: 13 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
          <div>Không có video nào chờ duyệt</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pendingTasks.map(task => {
            const ch = CHANNELS[task.ch];
            const urgent = isUrgent(task.dl);
            return (
              <div key={task.id} style={{
                background: 'var(--bg2)', borderRadius: 10,
                border: '1px solid var(--b1)',
                borderLeft: urgent ? '3px solid var(--red)' : '3px solid var(--b1)',
                padding: '12px 16px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 20 }}>{task.type === 'short' ? '✂️' : '🎬'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--t1)', marginBottom: 4 }}>{task.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: `${ch.c}22`, color: ch.c, fontWeight: 600 }}>{ch.n}</span>
                    {task.ed && <span style={{ fontSize: 10, color: 'var(--t3)' }}>👤 {task.ed}</span>}
                    <span style={{ fontSize: 10, color: urgent ? 'var(--red)' : 'var(--t3)', fontWeight: urgent ? 700 : 400 }}>⏰ {fmtDeadline(task.dl)}</span>
                    <span style={{ fontSize: 10, color: 'var(--t3)' }}>Step: {task.step}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  {task.src && (
                    <a href={task.src} target="_blank" rel="noopener noreferrer"
                      style={{ padding: '6px 10px', borderRadius: 6, background: 'var(--s2)', border: '1px solid var(--b1)', color: 'var(--blue)', fontSize: 11, textDecoration: 'none', fontWeight: 600 }}>
                      🔗 Link
                    </a>
                  )}
                  <button onClick={() => rejectTask(task.id)} style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(198,40,40,.12)', border: '1px solid var(--red)', color: 'var(--red)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Từ chối</button>
                  <button onClick={() => setSelectedTask(task)} style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--teal)', border: 'none', color: '#fff', fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>Duyệt ✓</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTask && (
        <CheckModal
          task={selectedTask}
          onApprove={() => handleApprove(selectedTask)}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
