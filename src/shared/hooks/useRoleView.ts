import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../types/editor.types';

type ViewMode = 'member' | 'leader';

const STORAGE_KEY = 'editor_os_view_mode';

function getLeaderRoles(): UserRole[] {
  return ['manager', 'admin', 'owner'];
}

export function useRoleView(userRole: UserRole | undefined) {
  const navigate = useNavigate();
  const canSwitchToLeader = userRole ? getLeaderRoles().includes(userRole) : false;

  const getDefaultView = (): ViewMode => {
    const stored = localStorage.getItem(STORAGE_KEY) as ViewMode | null;
    if (stored === 'member' || stored === 'leader') return stored;
    return canSwitchToLeader ? 'leader' : 'member';
  };

  const [viewMode, setViewMode] = useState<ViewMode>(getDefaultView);

  const switchToMember = useCallback(() => {
    setViewMode('member');
    localStorage.setItem(STORAGE_KEY, 'member');
    navigate('/pool');
  }, [navigate]);

  const switchToLeader = useCallback(() => {
    if (!canSwitchToLeader) return;
    setViewMode('leader');
    localStorage.setItem(STORAGE_KEY, 'leader');
    navigate('/overview');
  }, [canSwitchToLeader, navigate]);

  return { viewMode, canSwitchToLeader, switchToMember, switchToLeader };
}
