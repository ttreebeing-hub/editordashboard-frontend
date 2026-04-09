import type {
  EditorTask, EditorVideoSession, EditorLesson,
  EditorMonthlyScore, EditorSignal, MemberCard, TeamKpiOverview,
} from '../shared/types/editor.types';

export const MOCK_TASKS: EditorTask[] = [
  {
    id: 't1', title: 'EP.47 — Cách xây dựng thói quen buổi sáng', channel: 'nhiLe_holding',
    video_type: 'long_16_9', priority: 'urgent', deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    status: 'open', assigned_to: null, created_by: 'u1', notes: 'Cần hook mạnh 5 giây đầu',
    revision_count: 0, created_at: new Date().toISOString(), deleted_at: null,
    created_by_name: 'Nguyễn Leader',
  },
  {
    id: 't2', title: 'Short — Mẹo nấu ăn nhanh 3 phút', channel: 'spice_and_nice',
    video_type: 'short_9_16', priority: 'priority', deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'open', assigned_to: null, created_by: 'u1', notes: null,
    revision_count: 0, created_at: new Date().toISOString(), deleted_at: null,
    created_by_name: 'Nguyễn Leader',
  },
  {
    id: 't3', title: 'EP.12 — Học IELTS từ con số 0 như thế nào?', channel: 'nedu',
    video_type: 'long_16_9', priority: 'normal', deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    status: 'open', assigned_to: null, created_by: 'u1', notes: 'Ref video đã gửi qua Drive',
    revision_count: 0, created_at: new Date().toISOString(), deleted_at: null,
    created_by_name: 'Nguyễn Leader',
  },
  {
    id: 't4', title: 'Vlog tháng 4 — Behind the scenes NhiLe Team', channel: 'nhiLe_team',
    video_type: 'long_16_9', priority: 'normal', deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: 'claimed', assigned_to: 'mock-user-id', created_by: 'u1', notes: null,
    revision_count: 1, created_at: new Date().toISOString(), deleted_at: null,
    assigned_to_name: 'Editor',
    created_by_name: 'Nguyễn Leader',
  },
];

export const MOCK_SESSION: EditorVideoSession = {
  id: 's1', task_id: 't4', assigned_to: 'mock-user-id', current_step: 2,
  status: 'in_progress', youtube_url: null, published_at: null,
  submitted_at: null, revision_count: 1,
  created_at: new Date(Date.now() - 86400000 * 2).toISOString(), completed_at: null,
  task: MOCK_TASKS[3],
  steps: [
    { id: 'ss1', session_id: 's1', step_number: 1, mindset_answer: 'Khán giả là các bạn trẻ 20-28 tuổi muốn theo dõi hành trình team xây dựng kênh YouTube. Mục tiêu là tạo sự kết nối và inspire họ.', checklist_json: [{ id: 'b1_1', label: 'Đã đọc brief và hiểu yêu cầu', checked: true, checked_at: new Date().toISOString() }, { id: 'b1_2', label: 'Đã nhận đủ raw footage', checked: true, checked_at: new Date().toISOString() }, { id: 'b1_3', label: 'Đã tải reference video về', checked: true, checked_at: new Date().toISOString() }], files_json: [{ name: 'raw_footage_april.mp4', url: 'https://drive.google.com/...', type: 'raw' }], export_spec_json: null, is_completed: true, completed_at: new Date().toISOString(), created_at: new Date().toISOString() },
    { id: 'ss2', session_id: 's1', step_number: 2, mindset_answer: '', checklist_json: [{ id: 'b2_1', label: 'Kiểm tra âm thanh background', checked: false, checked_at: null }, { id: 'b2_2', label: 'Loại bỏ tiếng ồn', checked: false, checked_at: null }, { id: 'b2_3', label: 'Sync âm thanh với hình', checked: false, checked_at: null }, { id: 'b2_4', label: 'Volume normalize', checked: false, checked_at: null }, { id: 'b2_5', label: 'Cấu trúc video đúng outline', checked: false, checked_at: null }], files_json: [], export_spec_json: null, is_completed: false, completed_at: null, created_at: new Date().toISOString() },
  ],
};

export const MOCK_LESSONS: EditorLesson[] = [
  { id: 'l1', created_by: 'mock-user-id', session_id: 's1', type: 'technique', content: 'Hook 5 giây đầu cần có visual mạnh + câu hỏi mở để giữ người xem. Không dùng intro dài quá 3 giây.', created_at: new Date(Date.now() - 86400000 * 1).toISOString(), deleted_at: null },
  { id: 'l2', created_by: 'mock-user-id', session_id: null, type: 'mindset', content: 'Luôn tự hỏi "Khán giả rút ra được gì từ video này?" trước khi bắt đầu cắt. Tư duy sản phẩm, không phải thợ cắt.', created_at: new Date(Date.now() - 86400000 * 3).toISOString(), deleted_at: null },
  { id: 'l3', created_by: 'mock-user-id', session_id: null, type: 'process', content: 'Export lúc nào cũng xem lại 100% trên màn hình full trước khi gửi. Phát hiện lỗi nhỏ tiết kiệm 1 lần revision.', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), deleted_at: null },
  { id: 'l4', created_by: 'mock-user-id', session_id: null, type: 'technique', content: 'Nhạc nền nên ở -18dB so với giọng nói. Dùng EQ để cut tần số 200-400Hz của nhạc để tránh muddy với giọng.', created_at: new Date(Date.now() - 86400000 * 7).toISOString(), deleted_at: null },
];

export const MOCK_MONTHLY_SCORES: EditorMonthlyScore[] = [
  { id: 'ms1', editor_id: 'mock-user-id', year_month: '2026-04', sop_score: 32, mindset_score: 24, accuracy_score: 21, total_score: 77, videos_completed: 8, lessons_count: 4, calculated_at: new Date().toISOString() },
  { id: 'ms2', editor_id: 'mock-user-id', year_month: '2026-03', sop_score: 28, mindset_score: 20, accuracy_score: 18, total_score: 66, videos_completed: 6, lessons_count: 3, calculated_at: new Date().toISOString() },
  { id: 'ms3', editor_id: 'mock-user-id', year_month: '2026-02', sop_score: 25, mindset_score: 18, accuracy_score: 15, total_score: 58, videos_completed: 5, lessons_count: 2, calculated_at: new Date().toISOString() },
];

export const MOCK_ACCURACY_HISTORY = [
  { session_id: 's_old1', video_title: 'EP.44 — Bí quyết đọc sách hiệu quả', overall_accuracy: 91, computed_at: new Date(Date.now() - 86400000 * 14).toISOString() },
  { session_id: 's_old2', video_title: 'EP.45 — 5 thói quen buổi tối', overall_accuracy: 78, computed_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { session_id: 's_old3', video_title: 'Short — Review sách atomic habits', overall_accuracy: 95, computed_at: new Date(Date.now() - 86400000 * 7).toISOString() },
  { session_id: 's_old4', video_title: 'EP.46 — Cách quản lý thời gian', overall_accuracy: 88, computed_at: new Date(Date.now() - 86400000 * 3).toISOString() },
];

export const MOCK_MEMBERS: MemberCard[] = [
  { user_id: 'u2', name: 'Trần Minh Khoa', role: 'editor', avatar_initials: 'MK', tier: 'xuất sắc', signal_color: 'green', monthly_score: 88, videos_completed: 10, avg_accuracy: 94, current_task_title: 'EP.48 — Leadership mindset', current_step: 3 },
  { user_id: 'u3', name: 'Lê Thị Hương', role: 'editor', avatar_initials: 'TH', tier: 'tốt', signal_color: 'green', monthly_score: 75, videos_completed: 8, avg_accuracy: 87, current_task_title: 'Short — Cooking tips', current_step: 4 },
  { user_id: 'u4', name: 'Phạm Quốc Huy', role: 'editor', avatar_initials: 'QH', tier: 'phát triển', signal_color: 'yellow', monthly_score: 61, videos_completed: 6, avg_accuracy: 72, current_task_title: 'EP.12 — IELTS từ con số 0', current_step: 2 },
  { user_id: 'u5', name: 'Ngô Bảo Châu', role: 'editor', avatar_initials: 'BC', tier: 'cần hỗ trợ', signal_color: 'red', monthly_score: 44, videos_completed: 4, avg_accuracy: 65, current_task_title: null, current_step: null },
];

export const MOCK_TEAM_KPI: TeamKpiOverview = {
  videos_in_progress: 6,
  videos_completed_this_week: 4,
  avg_accuracy_team: 83.5,
  lessons_count_this_month: 14,
  alerts_count: { red: 1, yellow: 2, green: 3 },
  computed_at: new Date().toISOString(),
};

export const MOCK_SIGNALS: EditorSignal[] = [
  { id: 'sig1', editor_id: 'u5', signal_color: 'red', signal_type: 'low_accuracy', detail_json: { accuracy: 65, consecutive_videos: 3 }, computed_at: new Date().toISOString(), resolved_at: null, editor_name: 'Ngô Bảo Châu' },
  { id: 'sig2', editor_id: 'u4', signal_color: 'yellow', signal_type: 'revision_high', detail_json: { revision_count: 3 }, computed_at: new Date().toISOString(), resolved_at: null, editor_name: 'Phạm Quốc Huy' },
  { id: 'sig3', editor_id: 'u4', signal_color: 'yellow', signal_type: 'deadline_risk', detail_json: { days_remaining: 0.5 }, computed_at: new Date().toISOString(), resolved_at: null, editor_name: 'Phạm Quốc Huy' },
  { id: 'sig4', editor_id: 'u2', signal_color: 'green', signal_type: 'high_performance', detail_json: { accuracy: 94, streak: 7 }, computed_at: new Date().toISOString(), resolved_at: null, editor_name: 'Trần Minh Khoa' },
];
