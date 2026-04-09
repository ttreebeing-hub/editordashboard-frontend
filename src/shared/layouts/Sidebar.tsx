import { NavLink, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutDashboard, Inbox, BookOpen, TrendingUp, BarChart2,
  Users, Video, AlertTriangle, ClipboardList, LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRoleView } from '../hooks/useRoleView';
import { supabase } from '../config/supabase';

interface NavItem { label: string; to: string; icon: React.ReactNode; }

const MEMBER_NAV: NavItem[] = [
  { label: 'Pool', to: '/pool', icon: <Inbox size={18} /> },
  { label: 'SOP', to: '/sop', icon: <ClipboardList size={18} /> },
  { label: 'Bài học', to: '/lessons', icon: <BookOpen size={18} /> },
  { label: 'Tiến trình', to: '/progress', icon: <TrendingUp size={18} /> },
  { label: 'Dashboard', to: '/dashboard', icon: <LayoutDashboard size={18} /> },
];

const LEADER_NAV: NavItem[] = [
  { label: 'Tổng quan', to: '/overview', icon: <BarChart2 size={18} /> },
  { label: 'Team', to: '/team', icon: <Users size={18} /> },
  { label: 'Videos', to: '/videos', icon: <Video size={18} /> },
  { label: 'Tín hiệu', to: '/signals', icon: <AlertTriangle size={18} /> },
  { label: 'Đánh giá', to: '/eval', icon: <ClipboardList size={18} /> },
];

export function Sidebar() {
  const { user } = useAuth();
  const { viewMode, canSwitchToLeader, switchToMember, switchToLeader } = useRoleView(user?.role);
  const navigate = useNavigate();

  const navItems = viewMode === 'leader' ? LEADER_NAV : MEMBER_NAV;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-[#0f0f0f] border-r border-[#2a2a2a] flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0ea5e9] flex items-center justify-center">
            <span className="text-white font-bold text-xs">EO</span>
          </div>
          <span className="font-semibold text-[#f4f4f5] text-sm">Editor OS</span>
        </div>
        <p className="text-[10px] text-[#a1a1aa] mt-0.5 ml-9">NhiLe Holding</p>
      </div>

      {/* Role Switcher */}
      {canSwitchToLeader && (
        <div className="px-3 py-3 border-b border-[#2a2a2a]">
          <div className="flex gap-1 bg-[#1a1a1a] p-1 rounded-lg">
            <button
              onClick={switchToLeader}
              className={clsx(
                'flex-1 text-xs py-1.5 px-2 rounded-md transition-all duration-150 font-medium',
                viewMode === 'leader'
                  ? 'bg-[#0ea5e9] text-white'
                  : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
              )}
            >
              Leader
            </button>
            <button
              onClick={switchToMember}
              className={clsx(
                'flex-1 text-xs py-1.5 px-2 rounded-md transition-all duration-150 font-medium',
                viewMode === 'member'
                  ? 'bg-[#0ea5e9] text-white'
                  : 'text-[#a1a1aa] hover:text-[#f4f4f5]'
              )}
            >
              Member
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group',
                  isActive
                    ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]'
                    : 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1a1a1a]'
                )
              }
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User */}
      <div className="px-3 py-3 border-t border-[#2a2a2a]">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-[#0ea5e9]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#0ea5e9] text-xs font-semibold">
              {user?.avatar_initials || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#f4f4f5] truncate">{user?.name || 'Editor'}</p>
            <p className="text-[10px] text-[#a1a1aa] truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-[#a1a1aa] hover:text-[#ef4444] transition-colors p-1"
            title="Đăng xuất"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
