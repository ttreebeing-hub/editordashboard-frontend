import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import type { AppRole } from '../types/editor.types';

interface RoleState {
  role: AppRole;
  setRole: (r: AppRole) => void;
}

const RoleContext = createContext<RoleState>({
  role: 'operation',
  setRole: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<AppRole>(() => {
    return (localStorage.getItem('nl2_role') as AppRole) || 'operation';
  });

  const setRole = (r: AppRole) => {
    setRoleState(r);
    localStorage.setItem('nl2_role', r);
  };

  useEffect(() => {
    const colors: Record<AppRole, { rc: string; rc2: string }> = {
      operation: { rc: '#1B3A6B', rc2: 'rgba(27,58,107,.15)' },
      leader: { rc: '#2E86AB', rc2: 'rgba(46,134,171,.15)' },
      coleader: { rc: '#00838F', rc2: 'rgba(0,131,143,.15)' },
      editor: { rc: '#E07B39', rc2: 'rgba(224,123,57,.15)' },
    };
    document.documentElement.style.setProperty('--rc', colors[role].rc);
    document.documentElement.style.setProperty('--rc2', colors[role].rc2);
  }, [role]);

  return createElement(RoleContext.Provider, { value: { role, setRole } }, children);
}

export function useRoleStore() {
  return useContext(RoleContext);
}
