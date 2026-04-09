import { apiGet, apiPost, apiDelete } from '../../shared/config/api-client';
import type { EditorLesson, LessonType } from '../../shared/types/editor.types';

export const lessonsApi = {
  list: (type?: LessonType) => {
    const params = type ? `?type=${type}` : '';
    return apiGet<EditorLesson[]>(`/lessons${params}`);
  },
  create: (data: { type: LessonType; content: string; session_id?: string | null }) =>
    apiPost<EditorLesson>('/lessons', data),
  delete: (id: string) =>
    apiDelete<void>(`/lessons/${id}`),
};
