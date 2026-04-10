import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useRoleStore } from '../stores/roleStore';
import { useTaskStore } from '../stores/taskStore';
import { ROLES } from '../../constants/app-config';
import type { AppRole } from '../types/editor.types';

const NAV_GROUPS = [
  {
    label: 'Tổng quan',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
    ],
  },
  {
    label: 'Công việc',
    items: [
      { to: '/pipeline', label: 'Pipeline SOP', icon: '◈' },
      { to: '/approve', label: 'Duyệt video', icon: '✓', badgeKey: 'review' as const, badgeColor: '#ef4444' },
      { to: '/team', label: 'Editor Team', icon: '◉' },
    ],
  },
  {
    label: 'Cá nhân',
    items: [
      { to: '/onboard', label: 'Onboard & Phát triển', icon: '🌱', badgeKey: 'grad' as const, badgeColor: '#f59e0b' },
    ],
  },
];

const USER_INFO: Record<AppRole, { initials: string; name: string; roleLabel: string; avatarBg: string }> = {
  editor:   { initials: 'PD', name: 'Phạm Thị D',       roleLabel: 'Editor · Ngày 23',  avatarBg: 'linear-gradient(135deg,#7c2d12,#f59e0b)' },
  coleader: { initials: 'TM', name: 'Trần Văn Minh',    roleLabel: 'Co-Leader · QC',    avatarBg: 'linear-gradient(135deg,#4c1d95,#a855f7)' },
  leader:   { initials: 'NL', name: 'Nguyễn Thị Nhi',  roleLabel: 'Leader',            avatarBg: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)' },
  operation:{ initials: 'LA', name: 'Lê Thị An',        roleLabel: 'Ops',               avatarBg: 'linear-gradient(135deg,#065f46,#14b8a6)' },
};

export function Sidebar() {
  const { role, setRole } = useRoleStore();
  const { tasks } = useTaskStore();
  const [showRolePicker, setShowRolePicker] = useState(false);

  const reviewBadge = tasks.filter(t => t.pend && t.step !== 'Done').length;
  const gradBadge = (() => {
    try {
      const g = JSON.parse(localStorage.getItem('nl2_graduation') || '{}');
      if (g.attempted) return 0;
      const daysLeft = 90 - 87; // Demo: Day 87
      return daysLeft <= 7 ? 1 : 0;
    } catch { return 0; }
  })();
  const badges: Record<string, number> = { review: reviewBadge, grad: gradBadge };

  const user = USER_INFO[role] ?? USER_INFO.editor;

  return (
    <>
      <aside style={{
        width: 210, minWidth: 210, height: '100vh',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--b1)',
        display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '16px 14px 13px', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'linear-gradient(135deg, #1e3a5f, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11 }}>NL</span>
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 12, color: 'var(--t1)' }}>NhiLe Holding</div>
            <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 1 }}>Editor OS</div>
          </div>
        </div>

        {/* User section */}
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--b1)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%',
            background: user.avatarBg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, color: '#fff', fontWeight: 700, flexShrink: 0,
          }}>
            {user.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)' }}>{user.name}</div>
            <div style={{ fontSize: 9, color: 'var(--t3)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
              {user.roleLabel}
            </div>
          </div>
          {/* Role switcher icon */}
          <button
            onClick={() => setShowRolePicker(true)}
            title="Đổi vai trò"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--t3)', fontSize: 13, padding: 2 }}
          >
            ⇄
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                color: 'var(--t3)', textTransform: 'uppercase',
                padding: '0 8px', marginBottom: 3,
              }}>
                {group.label}
              </div>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 9px', borderRadius: 6, marginBottom: 1,
                    fontSize: 12, fontWeight: 500,
                    color: isActive ? 'var(--accent)' : 'var(--t2)',
                    background: isActive ? 'var(--accent2)' : 'transparent',
                    borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    textDecoration: 'none', transition: 'all 0.15s',
                  })}
                >
                  <span style={{ fontSize: 13, width: 16, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {'badgeKey' in item && item.badgeKey && badges[item.badgeKey] > 0 && (
                    <span style={{
                      background: item.badgeColor || 'var(--red)',
                      color: '#fff', fontSize: 8, fontWeight: 700,
                      padding: '1px 5px', borderRadius: 99, minWidth: 14, textAlign: 'center',
                    }}>
                      {badges[item.badgeKey]}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      {/* Role picker modal */}
      {showRolePicker && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowRolePicker(false)}
        >
          <div
            style={{ background: 'var(--bg3)', border: '1px solid var(--b2)', borderRadius: 14, padding: 20, minWidth: 240, animation: 'popIn 0.2s ease' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', marginBottom: 12 }}>
              Chọn vai trò
            </div>
            {(Object.entries(ROLES) as [AppRole, typeof ROLES[AppRole]][]).map(([key, val]) => (
              <button
                key={key}
                onClick={() => { setRole(key); setShowRolePicker(false); }}
                style={{
                  width: '100%', padding: '10px 12px', marginBottom: 6,
                  borderRadius: 8,
                  border: role === key ? `1px solid ${val.c}` : '1px solid var(--b1)',
                  background: role === key ? `${val.c}22` : 'var(--s1)',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                  color: role === key ? val.c : 'var(--t2)', fontSize: 12,
                }}
              >
                <span style={{ fontSize: 16 }}>{val.i}</span>
                <span style={{ fontWeight: 600 }}>{val.l}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
