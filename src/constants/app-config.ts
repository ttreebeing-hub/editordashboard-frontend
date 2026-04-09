import type { TaskChannel, TaskStep, AppRole } from '../shared/types/editor.types';

export const CHANNELS: Record<TaskChannel, { n: string; c: string }> = {
  nhile: { n: 'NhiLe', c: '#2E86AB' },
  msni: { n: 'Ms. Nhi', c: '#7B2D8B' },
  spice: { n: 'Spice & Nice', c: '#E07B39' },
  nhileteam: { n: 'NhiLe Team', c: '#00838F' },
  nedu: { n: 'Nedu', c: '#2E7D32' },
};

export const STEPS: TaskStep[] = ['AI Process', 'Cut', 'Edit', 'Export', 'Review', 'Done', 'Reject'];
export const STEP_COLORS: string[] = ['#00838F','#1B3A6B','#E07B39','#F57F17','#C62828','#2E7D32','#444'];

export const ROLES: Record<AppRole, { l: string; i: string; c: string }> = {
  operation: { l: 'Operation', i: '⚙️', c: '#1B3A6B' },
  leader: { l: 'Leader', i: '🎯', c: '#2E86AB' },
  coleader: { l: 'Co-Leader', i: '🤝', c: '#00838F' },
  editor: { l: 'Editor', i: '🌱', c: '#E07B39' },
};
