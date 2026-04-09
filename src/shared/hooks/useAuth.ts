import type { User } from '../types/editor.types';

interface AuthState {
  user: User;
  loading: false;
}

// Auth tắt — dùng mock user mặc định
const MOCK_USER: User = {
  id: 'mock-user-id',
  email: 'editor@nhiLe.vn',
  name: 'Editor',
  role: 'editor',
  avatar_initials: 'ED',
};

export function useAuth(): AuthState {
  return { user: MOCK_USER, loading: false };
}
