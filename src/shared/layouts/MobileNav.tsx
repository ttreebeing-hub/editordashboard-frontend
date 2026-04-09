import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  Inbox, BookOpen, TrendingUp, LayoutDashboard, ClipboardList,
  BarChart2, Users, Video, AlertTriangle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRoleView } from '../hooks/useRoleView';

const MEMBER_NAV = [
  { label: 'Pool', to: '/pool', icon: <Inbox size={20} /> },
  { label: 'SOP', to: '/sop', icon: <ClipboardList size={20} /> },
  { label: 'Bài học', to: '/lessons', icon: <BookOpen size={20} /> },
  { label: 'Tiến trình', to: '/progress', icon: <TrendingUp size={20} /> },
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={20} /> },
];

const LEADER_NAV = [
  { label: 'Tổng quan', to: '/overview', icon: <BarChart2 size={20} /> },
  { label: 'Team', to: '/team', icon: <Users size={20} /> },
  { label: 'Videos', to: '/videos', icon: <Video size={20} /> },
  { label: 'Tín hiệu', to: '/signals', icon: <AlertTriangle size={20} /> },
  { label: 'Đánh giá', to: '/eval', icon: <ClipboardList size={20} /> },
];

export function MobileNav() {
  const { user } = useAuth();
  const { viewMode } = useRoleView(user?.role);
  const navItems = viewMode === 'leader' ? LEADER_NAV : MEMBER_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-[#2a2a2a] z-30 lg:hidden">
      <div className="flex">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                isActive ? 'text-[#0ea5e9]' : 'text-[#a1a1aa]'
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
