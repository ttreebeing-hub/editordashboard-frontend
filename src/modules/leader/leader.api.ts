import { apiRequest } from '../../shared/config/api-client';
import type {
  TeamKpiOverview, MemberCard, EditorVideoSession,
  EditorSignal, AccuracyResult, MindsetScores, EditorMonthlyScore,
} from '../../shared/types/editor.types';

export interface VideoTrackingItem {
  session_id: string;
  task: { id: string; title: string; channel: string; video_type: string; priority: string; deadline: string | null };
  assigned_to_name: string;
  current_step: number;
  status: string;
  deadline: string | null;
  days_remaining: number | null;
  revision_count: number;
  checklist_completion_pct: number;
}

export interface MemberDetail {
  member: MemberCard;
  recent_sessions: EditorVideoSession[];
  accuracy_chart: { session_id: string; overall_accuracy: number; created_at: string }[];
  mindset_timeline: { step_number: number; answer: string; created_at: string }[];
  mindset_self_eval: MindsetScores | null;
  monthly_scores: EditorMonthlyScore[];
}

export const leaderApi = {
  getDashboard: () => apiRequest<TeamKpiOverview>('/leader/dashboard'),

  getMembers: () =>
    apiRequest<{ members: MemberCard[] }>('/leader/members').then(r => r.members),

  getMemberDetail: (memberId: string) =>
    apiRequest<MemberDetail>(`/leader/members/${memberId}`),

  logMemberAction: (memberId: string, action_type: string, note?: string) =>
    apiRequest<{ logged: boolean }>(`/leader/members/${memberId}/actions`, {
      method: 'POST',
      body: JSON.stringify({ action_type, note }),
    }),

  getVideos: (params?: { status?: string; channel?: string; page?: number; limit?: number }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return apiRequest<{ videos: VideoTrackingItem[]; total: number }>(`/leader/videos${q ? '?' + q : ''}`);
  },

  getSignals: () =>
    apiRequest<{ signals: EditorSignal[] }>('/leader/signals').then(r => r.signals),

  createQuarterlyEval: (data: {
    editor_id: string; eval_year: number; eval_quarter: number;
    ctr_score: number; retention_score: number; checkpoint_score: number;
    revision_score: number; improvement_score: number; peer_score: number;
  }) => apiRequest<{ eval: unknown; calculatedTier: string }>('/leader/quarterly-evals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getQuarterlyEvals: (memberId: string) =>
    apiRequest<{ evals: unknown[] }>(`/leader/quarterly-evals/${memberId}`),

  triggerYoutubeSync: (channel_id?: string) =>
    apiRequest<{ syncJobId: string; estimatedCompletionSeconds: number }>('/leader/youtube-sync', {
      method: 'POST',
      body: JSON.stringify({ channel_id }),
    }),
};
