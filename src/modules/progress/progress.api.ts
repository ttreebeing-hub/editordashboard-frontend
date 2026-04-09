import { apiGet, apiPost } from '../../shared/config/api-client';
import type { EditorMonthlyScore, AccuracyResult, MindsetScores } from '../../shared/types/editor.types';

export interface StreakData { current_streak: number; longest_streak: number; last_active: string; }
export interface AccuracyHistory { date: string; retention_accuracy: number | null; ctr_accuracy: number | null; overall_accuracy: number | null; }
export interface MindsetTimelineEntry { session_id: string; step: number; question: string; answer: string; created_at: string; }

export const progressApi = {
  getStreak: () => apiGet<StreakData>('/progress/streak'),
  getMonthlyScores: () => apiGet<EditorMonthlyScore[]>('/progress/monthly-scores'),
  getAccuracyHistory: () => apiGet<AccuracyHistory[]>('/progress/accuracy-history'),
  getMindsetTimeline: () => apiGet<MindsetTimelineEntry[]>('/progress/mindset-timeline'),
  submitMindsetSelfEval: (scores: MindsetScores) => apiPost<void>('/progress/mindset-eval', scores),
};
