import { useState, useEffect } from 'react';

type Priority = 'high' | 'medium' | 'low';

interface PersonalTask {
  id: string;
  title: string;
  priority: Priority;
  deadline: string;
  done: boolean;
  cr: string;
}

const LS_KEY = 'nl2_personal_tasks';

function loadTasks(): PersonalTask[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [
    { id: 'p1', title: 'Review quy trình SOP mới', priority: 'high', deadline: new Date(Date.now() + 86400000).toISOString(), done: false, cr: new Date().toISOString() },
    { id: 'p2', title: 'Họp team hàng tuần', priority: 'medium', deadline: new Date(Date.now() + 2 * 86400000).toISOString(), done: false, cr: new Date().toISOString() },
    { id: 'p3', title: 'Update checklist approval', priority: 'low', deadline: new Date(Date.now() + 5 * 86400000).toISOString(), done: true, cr: new Date().toISOString() },
  ];
}

const PRIORITY_COLORS: Record<Priority, string> = {
  high: 'var(--red)',
  medium: 'var(--amber)',
  low: 'var(--teal)',
};
const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

interface CreateModalProps { onClose: () => void; onAdd: (t: PersonalTask) => void; }

function CreateModal({ onClose, onAdd }: CreateModalProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      id: 'p' + Date.now(),
      title: title.trim(),
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
      done: false,
      cr: new Date().toISOString(),
    });
    onClose();
  };

  const s: React.CSSProperties = { width: '100%', padding: '7px 10px', borderRadius: 6, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: 12, outline: 'none' };
  const l: React.CSSProperties = { fontSize: 10, color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 22, width: 360, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--t1)', marginBottom: 14 }}>+ Tạo task cá nhân</div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label style={l}>Tiêu đề</label>
            <input style={s} value={title} onChange={e => setTitle(e.target.value)} placeholder="Tên task..." required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            <div>
              <label style={l}>Ưu tiên</label>
              <select style={s} value={priority} onChange={e => setPriority(e.target.value as Priority)}>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
            <div>
              <label style={l}>Deadline</label>
              <input type="date" style={s} value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '7px 14px', borderRadius: 6, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 12, cursor: 'pointer' }}>Hủy</button>
            <button type="submit" style={{ padding: '7px 14px', borderRadius: 6, background: 'var(--blue)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Tạo task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';

export function MyTasksPage() {
  const [tasks, setTasks] = useState<PersonalTask[]>(loadTasks);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const sorted = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    const po: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
    return po[a.priority] - po[b.priority];
  });

  const toggleDone = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addTask = (t: PersonalTask) => {
    setTasks(prev => [...prev, t]);
  };

  const fmtDl = (iso: string) => {
    const d = new Date(iso);
    const diffDays = Math.round((d.getTime() - Date.now()) / 86400000);
    if (diffDays < 0) return 'Quá hạn';
    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Ngày mai';
    return `${d.getDate()}/${d.getMonth() + 1}`;
  };

  const pending = tasks.filter(t => !t.done).length;

  return (
    <div style={{ maxWidth: 600 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--t1)' }}>Nhiệm vụ cá nhân</div>
        {pending > 0 && <span style={{ background: 'var(--blue)', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99 }}>{pending}</span>}
        <button
          onClick={() => setShowCreate(true)}
          style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 6, background: 'var(--blue)', border: 'none', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
        >
          + Tạo task
        </button>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--t3)', fontSize: 13 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
          <div>Chưa có task nào. Tạo task mới nhé!</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sorted.map(task => {
            const dlStr = fmtDl(task.deadline);
            const isOverdue = dlStr === 'Quá hạn';
            return (
              <div key={task.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 8,
                background: 'var(--bg2)', border: '1px solid var(--b1)',
                opacity: task.done ? 0.55 : 1,
              }}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                  style={{ width: 15, height: 15, accentColor: 'var(--teal)', flexShrink: 0, cursor: 'pointer' }}
                />
                <span style={{
                  flex: 1, fontSize: 12, fontWeight: 500,
                  color: task.done ? 'var(--t3)' : 'var(--t1)',
                  textDecoration: task.done ? 'line-through' : 'none',
                }}>
                  {task.title}
                </span>
                <span style={{
                  fontSize: 9, padding: '2px 7px', borderRadius: 4,
                  background: `${PRIORITY_COLORS[task.priority]}22`,
                  color: PRIORITY_COLORS[task.priority],
                  fontWeight: 700, flexShrink: 0,
                }}>
                  {PRIORITY_LABELS[task.priority]}
                </span>
                <span style={{ fontSize: 10, color: isOverdue ? 'var(--red)' : 'var(--t3)', flexShrink: 0, fontWeight: isOverdue ? 700 : 400 }}>
                  {dlStr}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: 14, padding: '0 2px', flexShrink: 0 }}
                  title="Xóa"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onAdd={addTask} />}
    </div>
  );
}
