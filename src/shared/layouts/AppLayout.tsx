import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/pipeline': 'Pipeline SOP',
  '/approve': 'Duyệt video',
  '/kpi': 'KPI & Báo cáo',
  '/team': 'Editor Team',
  '/mytasks': 'Nhiệm vụ cá nhân',
  '/onboard': 'Onboard & Phát triển',
};

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function AppLayout() {
  const location = useLocation();
  const now = useNow();
  const title = PAGE_TITLES[location.pathname] || 'Editor OS';
  const dateStr = now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 50, flexShrink: 0,
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--b1)',
          display: 'flex', alignItems: 'center',
          padding: '0 18px', gap: 10,
        }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 14, color: 'var(--t1)', flex: 1 }}>{title}</span>
          <span style={{ fontSize: 10, color: 'var(--t3)' }}>{dateStr}</span>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 18 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
