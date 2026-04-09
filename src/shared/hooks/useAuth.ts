import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { User } from '../types/editor.types';
import type { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? '',
        name: (session.user.user_metadata?.name as string) || session.user.email?.split('@')[0] || 'User',
        role: (session.user.user_metadata?.role as User['role']) || 'editor',
        avatar_initials: getInitials(
          (session.user.user_metadata?.name as string) || session.user.email || 'U'
        ),
      }
    : null;

  return { session, user, loading };
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
