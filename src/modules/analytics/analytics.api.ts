import { apiRequest } from '../../shared/config/api-client';
import type { EditorPrediction, EditorActualMetrics, AccuracyResult } from '../../shared/types/editor.types';

export interface AnalyticsSession {
  session_id: string;
  task_title: string;
  prediction: EditorPrediction;
  actual: EditorActualMetrics;
  accuracy: AccuracyResult;
}

export const analyticsApi = {
  getSessions: (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ sessions: AnalyticsSession[]; total: number }>(`/analytics/sessions${q ? '?' + q : ''}`);
  },

  getSessionDetail: (sessionId: string) =>
    apiRequest<{ prediction: EditorPrediction; actual: EditorActualMetrics; accuracy: AccuracyResult }>(
      `/analytics/sessions/${sessionId}`
    ),

  getAccuracyTrend: () =>
    apiRequest<{ trend: { year_month: string; avg_accuracy: number }[] }>('/analytics/accuracy-trend'),
};
