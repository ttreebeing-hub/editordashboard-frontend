import { apiGet, apiPost, apiPatch } from '../../shared/config/api-client';
import type { EditorTask, Priority, Channel, VideoType } from '../../shared/types/editor.types';

export interface CreateTaskPayload {
  title: string;
  channel: Channel;
  video_type: VideoType;
  priority: Priority;
  deadline: string | null;
  notes: string | null;
}

export const poolApi = {
  listTasks: (priority?: Priority) => {
    const params = priority ? `?priority=${priority}` : '';
    return apiGet<EditorTask[]>(`/tasks/pool${params}`);
  },

  createTask: (payload: CreateTaskPayload) =>
    apiPost<EditorTask>('/tasks', payload),

  claimTask: (taskId: string) =>
    apiPatch<EditorTask>(`/tasks/${taskId}/claim`, {}),
};
