import { apiRequest } from '../../shared/config/api-client';
import type { EditorMonthlyScore, AccuracyResult } from '../../shared/types/editor.types';

export interface DashboardData {
  streak_days: number;
  monthly_scores: EditorMonthlyScore[];
  accuracy_history: {
    session_id: string;
    video_title: string;
    overall_accuracy: number;
    computed_at: string;
  }[];
  mindset_timeline: {
    session_id: string;
    step_number: number;
    mindset_answer: string;
    created_at: string;
  }[];
}

export interface MemberDashboardSummary {
  avg_retention: number | null;
  avg_ctr: number | null;
  monthly_score: number | null;
  monthly_score_prev: number | null;
  recent_videos: {
    session_id: string;
    task_title: string;
    retention_actual: number | null;
    ctr_actual: number | null;
    accuracy: AccuracyResult;
  }[];
}

export const memberDashboardApi = {
  getProgress: () => apiRequest<DashboardData>('/progress/me'),
  getMonthlySummary: () => apiRequest<MemberDashboardSummary>('/progress/me'),
};
