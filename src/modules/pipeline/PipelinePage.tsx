import { useState } from 'react';
import { useTaskStore } from '../../shared/stores/taskStore';
import { CHANNELS, STEPS, STEP_COLORS } from '../../constants/app-config';
import { fmtDeadline, isUrgent } from '../../shared/utils/task-utils';
import type { Task, TaskChannel, TaskType, TaskStep } from '../../shared/types/editor.types';

interface CreateModalProps { onClose: () => void; }

function CreateModal({ onClose }: CreateModalProps) {
  const { addTask } = useTaskStore();
  const [form, setForm] = useState({ name: '', ch: 'nhile' as TaskChannel, type: 'short' as TaskType, ed: '', dl: '', src: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addTask({
      id: 't' + Date.now(), name: form.name, ch: form.ch, type: form.type,
      ed: form.ed, step: 'AI Process', pend: false,
      dl: form.dl ? new Date(form.dl).toISOString() : new Date(Date.now() + 86400000).toISOString(),
      src: form.src, cr: new Date().toISOString(),
    });
    onClose();
  };

  const s: React.CSSProperties = { width: '100%', padding: '7px 10px', borderRadius: 6, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--t1)', fontSize: 12, outline: 'none' };
  const l: React.CSSProperties = { fontSize: 10, color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 22, width: 380, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--t1)', marginBottom: 14 }}>+ Thêm video vào pipeline</div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 10 }}>
            <label style={l}>Tên video</label>
            <input style={s} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Tên video..." required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div><label style={l}>Kênh</label>
              <select style={s} value={form.ch} onChange={e => setForm(p => ({ ...p, ch: e.target.value as TaskChannel }))}>
                {Object.entries(CHANNELS).map(([k, v]) => <option key={k} value={k}>{v.n}</option>)}
              </select></div>
            <div><label style={l}>Loại</label>
              <select style={s} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as TaskType }))}>
                <option value="short">Short</option><option value="long">Long</option>
              </select></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div><label style={l}>Editor</label>
              <input style={s} value={form.ed} onChange={e => setForm(p => ({ ...p, ed: e.target.value }))} placeholder="Tên editor..." /></div>
            <div><label style={l}>Deadline</label>
              <input type="datetime-local" style={s} value={form.dl} onChange={e => setForm(p => ({ ...p, dl: e.target.value }))} /></div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={l}>Drive Link</label>
            <input style={s} value={form.src} onChange={e => setForm(p => ({ ...p, src: e.target.value }))} placeholder="https://drive.google.com/..." />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '7px 14px', borderRadius: 6, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 12, cursor: 'pointer' }}>Hủy</button>
            <button type="submit" style={{ padding: '7px 14px', borderRadius: 6, background: 'var(--blue)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Tạo</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskCard({ task, onStepChange }: { task: Task; onStepChange: (id: string, step: TaskStep) => void }) {
  const ch = CHANNELS[task.ch];
  const urgent = isUrgent(task.dl);

  return (
    <div style={{
      background: 'var(--bg3)', borderRadius: 8, padding: '10px 12px',
      border: '1px solid var(--b1)',
      borderLeft: urgent ? '3px solid var(--red)' : '3px solid transparent',
      marginBottom: 6, cursor: 'default',
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)', marginBottom: 6, lineHeight: 1.3 }}>{task.name}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 3, background: `${ch.c}22`, color: ch.c, fontWeight: 600 }}>{ch.n}</span>
        <span style={{ fontSize: 9, color: 'var(--t3)' }}>{task.type === 'short' ? '✂️' : '🎬'}</span>
        {task.ed && <span style={{ fontSize: 9, color: 'var(--t3)' }}>{task.ed}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
        <span style={{ fontSize: 9, color: urgent ? 'var(--red)' : 'var(--t3)', fontWeight: urgent ? 700 : 400 }}>{fmtDeadline(task.dl)}</span>
        <select
          value={task.step}
          onChange={e => onStepChange(task.id, e.target.value as TaskStep)}
          style={{ fontSize: 9, background: 'var(--s1)', border: '1px solid var(--b2)', color: 'var(--t2)', borderRadius: 3, padding: '1px 4px', cursor: 'pointer', outline: 'none' }}
          onClick={e => e.stopPropagation()}
        >
          {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
    </div>
  );
}

export function PipelinePage() {
  const { tasks, updateTaskStep, addTask } = useTaskStore();
  const [chFilter, setChFilter] = useState<TaskChannel | 'all'>('all');
  const [showCreate, setShowCreate] = useState(false);

  const filtered = chFilter === 'all' ? tasks : tasks.filter(t => t.ch === chFilter);
  const channelKeys = Object.keys(CHANNELS) as TaskChannel[];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => setChFilter('all')}
          style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: '1px solid', borderColor: chFilter === 'all' ? 'var(--blue)' : 'var(--b1)', background: chFilter === 'all' ? 'rgba(46,134,171,.15)' : 'var(--s1)', color: chFilter === 'all' ? 'var(--blue)' : 'var(--t2)' }}
        >
          Tất cả ({tasks.length})
        </button>
        {channelKeys.map(ch => {
          const info = CHANNELS[ch];
          const count = tasks.filter(t => t.ch === ch).length;
          const active = chFilter === ch;
          return (
            <button key={ch} onClick={() => setChFilter(ch)}
              style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', border: `1px solid ${active ? info.c : 'var(--b1)'}`, background: active ? `${info.c}22` : 'var(--s1)', color: active ? info.c : 'var(--t2)' }}
            >
              {info.n} ({count})
            </button>
          );
        })}
        <button
          onClick={() => setShowCreate(true)}
          style={{ marginLeft: 'auto', padding: '5px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: 'var(--blue)', border: 'none', color: '#fff', cursor: 'pointer' }}
        >
          + Thêm video
        </button>
      </div>

      {/* Kanban board */}
      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10 }}>
        {STEPS.map((step, idx) => {
          const colTasks = filtered.filter(t => t.step === step);
          return (
            <div key={step} style={{ minWidth: 190, maxWidth: 190, flexShrink: 0 }}>
              {/* Column header */}
              <div style={{
                padding: '8px 10px', borderRadius: '8px 8px 0 0',
                background: `${STEP_COLORS[idx]}18`,
                border: `1px solid ${STEP_COLORS[idx]}33`,
                borderBottom: 'none',
                display: 'flex', alignItems: 'center', gap: 6, marginBottom: 0,
              }}>
                <span style={{
                  background: STEP_COLORS[idx], color: '#fff',
                  borderRadius: 99, width: 20, height: 20,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 700, flexShrink: 0,
                }}>{colTasks.length}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: STEP_COLORS[idx] }}>{step}</span>
              </div>
              {/* Column body */}
              <div style={{
                minHeight: 200, padding: '8px 6px',
                background: 'var(--bg2)',
                border: `1px solid ${STEP_COLORS[idx]}22`,
                borderRadius: '0 0 8px 8px',
              }}>
                {colTasks.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--t3)', fontSize: 10, padding: '20px 0' }}>Trống</div>
                ) : (
                  colTasks.map(t => (
                    <TaskCard key={t.id} task={t} onStepChange={updateTaskStep} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
