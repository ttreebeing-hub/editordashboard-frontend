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
      { to: '/pipeline', label: 'Pipeline SOP', icon: '◈' },
    ]
  },
  {
    label: 'Quản lý',
    items: [
      { to: '/approve', label: 'Duyệt video', icon: '✓', badgeKey: 'pend' as const, badgeColor: '#C62828' },
      { to: '/kpi', label: 'KPI & Báo cáo', icon: '◎' },
      { to: '/team', label: 'Editor Team', icon: '◉' },
    ]
  },
  {
    label: 'Cá nhân',
    items: [
      { to: '/mytasks', label: 'Nhiệm vụ cá nhân', icon: '☑' },
    ]
  }
];

export function Sidebar() {
  const { role, setRole } = useRoleStore();
  const { tasks } = useTaskStore();
  const [showRolePicker, setShowRolePicker] = useState(false);

  const pendCount = tasks.filter(t => t.pend && t.step !== 'Done').length;
  const activeCount = tasks.filter(t => t.step !== 'Done' && t.step !== 'Reject').length;

  const badges: Record<string, number> = {
    pend: pendCount,
    active: activeCount,
  };

  return (
    <>
      <aside style={{
        width: 220,
        minWidth: 220,
        height: '100vh',
        background: 'var(--bg2)',
        borderRight: '1px solid var(--b1)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--b1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--navy)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--b2)',
            }}>
              <span style={{ color: '#fff', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 12 }}>NL</span>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--t1)' }}>NhiLe Holding</div>
              <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 1 }}>Editor Operations</div>
            </div>
          </div>
        </div>

        {/* Role pill */}
        <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--b1)' }}>
          <button
            onClick={() => setShowRolePicker(true)}
            style={{
              width: '100%',
              padding: '6px 10px',
              borderRadius: 6,
              background: 'var(--s2)',
              border: '1px solid var(--b1)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              color: 'var(--t2)',
              fontSize: 11,
            }}
          >
            <span>{ROLES[role].i}</span>
            <span style={{ fontWeight: 500 }}>{ROLES[role].l}</span>
            <span style={{ marginLeft: 'auto', fontSize: 9 }}>▾</span>
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 8px' }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 16 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                color: 'var(--t3)', textTransform: 'uppercase',
                padding: '0 8px', marginBottom: 4,
              }}>
                {group.label}
              </div>
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '7px 10px',
                    borderRadius: 6,
                    marginBottom: 2,
                    fontSize: 12,
                    fontWeight: 500,
                    color: isActive ? 'var(--rc)' : 'var(--t2)',
                    background: isActive ? 'var(--rc2)' : 'transparent',
                    borderLeft: isActive ? '2px solid var(--rc)' : '2px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                  })}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {'badgeKey' in item && item.badgeKey && badges[item.badgeKey] > 0 && (
                    <span style={{
                      background: item.badgeColor || 'var(--blue)',
                      color: '#fff', fontSize: 9, fontWeight: 700,
                      padding: '1px 5px', borderRadius: 99,
                      minWidth: 16, textAlign: 'center',
                    }}>
                      {badges[item.badgeKey]}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '10px 12px', borderTop: '1px solid var(--b1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--navy)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13,
            }}>
              {ROLES[role].i}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--t1)' }}>
                {ROLES[role].l === 'Operation' ? 'Admin' : ROLES[role].l}
              </div>
              <div style={{ fontSize: 9, color: 'var(--t3)' }}>NhiLe Holding</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Role picker modal */}
      {showRolePicker && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setShowRolePicker(false)}
        >
          <div
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--b1)',
              borderRadius: 12,
              padding: 20,
              minWidth: 240,
            }}
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
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: 6,
                  borderRadius: 8,
                  border: role === key ? `1px solid ${val.c}` : '1px solid var(--b1)',
                  background: role === key ? `${val.c}22` : 'var(--s1)',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10,
                  color: role === key ? val.c : 'var(--t2)',
                  fontSize: 12,
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
