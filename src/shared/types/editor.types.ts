export type Channel = 'nhiLe_holding' | 'spice_and_nice' | 'ms_nhi' | 'nhiLe_team' | 'nedu' | 'other';
export type VideoType = 'long_16_9' | 'short_9_16';
export type Priority = 'urgent' | 'priority' | 'normal';
export type TaskStatus = 'open' | 'claimed' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'cancelled';
export type SessionStatus = 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'completed' | 'abandoned';
export type LessonType = 'technique' | 'mindset' | 'process';
export type SignalColor = 'red' | 'yellow' | 'green';
export type UserRole = 'editor' | 'manager' | 'admin' | 'owner';

export interface EditorTask {
  id: string;
  title: string;
  channel: Channel;
  video_type: VideoType;
  priority: Priority;
  deadline: string | null;
  status: TaskStatus;
  assigned_to: string | null;
  created_by: string;
  notes: string | null;
  revision_count: number;
  created_at: string;
  deleted_at: string | null;
  assigned_to_name?: string;
  created_by_name?: string;
}

export interface SopChecklistItem {
  id: string;
  label: string;
  checked: boolean;
  checked_at: string | null;
}

export interface SopFileItem {
  name: string;
  url: string;
  type: 'raw' | 'brief' | 'ref';
}

export interface SopExportSpec {
  resolution: '1920x1080' | '1080x1920';
  duration_sec: number;
  file_name: string;
  file_reviewed: boolean;
}

export interface EditorSopStep {
  id: string;
  session_id: string;
  step_number: number;
  mindset_answer: string | null;
  checklist_json: SopChecklistItem[];
  files_json: SopFileItem[];
  export_spec_json: SopExportSpec | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface EditorVideoSession {
  id: string;
  task_id: string;
  assigned_to: string;
  current_step: number;
  status: SessionStatus;
  youtube_url: string | null;
  published_at: string | null;
  submitted_at: string | null;
  revision_count: number;
  created_at: string;
  completed_at: string | null;
  task?: EditorTask;
  steps?: EditorSopStep[];
}

export interface EditorPrediction {
  id: string;
  session_id: string;
  retention_predicted: number;
  ctr_predicted: number;
  drop_point_predicted: number | null;
  editor_note: string | null;
  created_at: string;
}

export interface EditorActualMetrics {
  id: string;
  session_id: string;
  youtube_video_id: string;
  retention_actual: number | null;
  ctr_actual: number | null;
  drop_point_actual: number | null;
  view_count: number | null;
  synced_at: string;
}

export interface EditorLesson {
  id: string;
  created_by: string;
  session_id: string | null;
  type: LessonType;
  content: string;
  created_at: string;
  deleted_at: string | null;
}

export interface EditorMonthlyScore {
  id: string;
  editor_id: string;
  year_month: string;
  sop_score: number;
  mindset_score: number;
  accuracy_score: number;
  total_score: number;
  videos_completed: number;
  lessons_count: number;
  calculated_at: string;
}

export interface EditorSignal {
  id: string;
  editor_id: string;
  signal_color: SignalColor;
  signal_type: string;
  detail_json: Record<string, unknown>;
  computed_at: string;
  resolved_at: string | null;
  editor_name?: string;
}

export interface MindsetScores {
  product_thinking: number;
  audience_focus: number;
  proactive_suggest: number;
  owner_mindset: number;
}

export interface AiAssistRequest {
  step: number;
  question: string;
  editorAnswer: string;
  videoContext: {
    channel: Channel;
    videoType: VideoType;
    taskTitle: string;
  };
}

export interface AiAssistResponse {
  analysis: string;
  deeperQuestions: string[];
}

export interface AiTitleRequest {
  channel: Channel;
  videoType: VideoType;
  mindsetAnswers: Record<string, string>;
  editorDescription: string;
}

export interface AiTitleResponse {
  titles: [string, string, string];
  description: string;
  hashtags: string[];
}

export interface TeamKpiOverview {
  videos_in_progress: number;
  videos_completed_this_week: number;
  avg_accuracy_team: number | null;
  lessons_count_this_month: number;
  alerts_count: { red: number; yellow: number; green: number };
  computed_at: string;
}

export interface MemberCard {
  user_id: string;
  name: string;
  role: string;
  avatar_initials: string;
  tier: 'xuất sắc' | 'tốt' | 'phát triển' | 'cần hỗ trợ' | null;
  signal_color: SignalColor | null;
  monthly_score: number | null;
  videos_completed: number;
  avg_accuracy: number | null;
  current_task_title: string | null;
  current_step: number | null;
}

export interface AccuracyResult {
  retention_accuracy: number | null;
  ctr_accuracy: number | null;
  overall_accuracy: number | null;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar_initials: string;
}
