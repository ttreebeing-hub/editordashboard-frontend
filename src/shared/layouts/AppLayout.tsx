import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useTaskStore } from '../stores/taskStore';
import type { Task, TaskChannel, TaskType, TaskStep } from '../types/editor.types';
import { CHANNELS, STEPS } from '../../constants/app-config';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/pipeline': 'Pipeline SOP',
  '/approve': 'Duyệt video',
  '/kpi': 'KPI & Báo cáo',
  '/team': 'Editor Team',
  '/mytasks': 'Nhiệm vụ cá nhân',
  '/onboard': 'Onboard & Phát triển',
};

function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] || 'Editor OS';
}

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  return now;
}

interface CreateModalProps {
  onClose: () => void;
}

function CreateTaskModal({ onClose }: CreateModalProps) {
  const { addTask } = useTaskStore();
  const [form, setForm] = useState({
    name: '',
    ch: 'nhile' as TaskChannel,
    type: 'short' as TaskType,
    ed: '',
    step: 'AI Process' as TaskStep,
    dl: '',
    src: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const task: Task = {
      id: 't' + Date.now(),
      name: form.name,
      ch: form.ch,
      type: form.type,
      ed: form.ed,
      step: form.step,
      pend: false,
      dl: form.dl ? new Date(form.dl).toISOString() : new Date(Date.now() + 86400000).toISOString(),
      src: form.src,
      cr: new Date().toISOString(),
    };
    addTask(task);
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '8px 10px', borderRadius: 6,
    background: 'var(--s1)', border: '1px solid var(--b1)',
    color: 'var(--t1)', fontSize: 12, outline: 'none',
  };
  const labelStyle: React.CSSProperties = { fontSize: 10, color: 'var(--t3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, display: 'block' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: 'var(--bg3)', border: '1px solid var(--b1)', borderRadius: 12, padding: 24, width: 400, maxWidth: '90vw' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--t1)', marginBottom: 16 }}>Thêm video mới</div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Tên video</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Tên video..." required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Kênh</label>
              <select style={inputStyle} value={form.ch} onChange={e => setForm(p => ({ ...p, ch: e.target.value as TaskChannel }))}>
                {Object.entries(CHANNELS).map(([k, v]) => <option key={k} value={k}>{v.n}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Loại</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as TaskType }))}>
                <option value="short">Short</option>
                <option value="long">Long</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={labelStyle}>Editor</label>
              <input style={inputStyle} value={form.ed} onChange={e => setForm(p => ({ ...p, ed: e.target.value }))} placeholder="Tên editor..." />
            </div>
            <div>
              <label style={labelStyle}>Bước</label>
              <select style={inputStyle} value={form.step} onChange={e => setForm(p => ({ ...p, step: e.target.value as TaskStep }))}>
                {STEPS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Deadline</label>
              <input type="datetime-local" style={inputStyle} value={form.dl} onChange={e => setForm(p => ({ ...p, dl: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Drive Link</label>
              <input style={inputStyle} value={form.src} onChange={e => setForm(p => ({ ...p, src: e.target.value }))} placeholder="https://drive.google.com/..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--s1)', border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 12, cursor: 'pointer' }}>Hủy</button>
            <button type="submit" style={{ padding: '8px 16px', borderRadius: 6, background: 'var(--blue)', border: 'none', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Tạo video</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React from 'react';

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const now = useNow();
  const title = getPageTitle(location.pathname);
  const [showCreate, setShowCreate] = useState(false);

  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 52,
          flexShrink: 0,
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--b1)',
          display: 'flex', alignItems: 'center',
          padding: '0 20px',
          gap: 12,
        }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--t1)', flex: 1 }}>{title}</span>
          <span style={{ fontSize: 11, color: 'var(--t3)' }}>{dateStr}</span>
          <button
            onClick={() => setShowCreate(true)}
            style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--s2)', border: '1px solid var(--b1)', color: 'var(--t2)', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
          >
            + Thêm video
          </button>
          <button
            onClick={() => navigate('/mytasks')}
            style={{ padding: '6px 12px', borderRadius: 6, background: 'var(--blue)', border: 'none', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
          >
            Tạo task
          </button>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          <Outlet />
        </main>
      </div>
      {showCreate && <CreateTaskModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
