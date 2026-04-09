import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';

const PAGE_TITLES: Record<string, string> = {
  '/pool': 'Task Pool',
  '/sop': 'Quy trình SOP',
  '/lessons': 'Bài học',
  '/progress': 'Tiến trình',
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/overview': 'Tổng quan team',
  '/team': 'Thành viên',
  '/videos': 'Video tracking',
  '/signals': 'Tín hiệu',
  '/eval': 'Đánh giá quý',
};

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/sop/')) return 'Quy trình SOP';
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

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit', minute: '2-digit',
});

export function AppLayout() {
  const location = useLocation();
  const now = useNow();
  const title = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f4f4f5] font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="lg:ml-[220px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#2a2a2a] px-5 py-3 flex items-center justify-between">
          <h1 className="font-semibold text-[#f4f4f5] text-base">{title}</h1>
          <div className="text-right">
            <p className="text-xs text-[#a1a1aa] font-mono">{timeFormatter.format(now)}</p>
            <p className="text-[10px] text-[#a1a1aa] capitalize">{dateFormatter.format(now)}</p>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 px-4 lg:px-6 py-5 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
}
