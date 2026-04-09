import { http, HttpResponse } from 'msw';
import {
  MOCK_TASKS, MOCK_SESSION, MOCK_LESSONS, MOCK_MONTHLY_SCORES,
  MOCK_ACCURACY_HISTORY, MOCK_MEMBERS, MOCK_TEAM_KPI, MOCK_SIGNALS,
} from './data';

const API = 'http://localhost:8080/api';

export const handlers = [
  // ── Tasks ────────────────────────────────────────────────
  http.get(`${API}/tasks`, () =>
    HttpResponse.json({ tasks: MOCK_TASKS, total: MOCK_TASKS.length, page: 1, limit: 20 })
  ),
  http.get(`${API}/tasks/mine`, () =>
    HttpResponse.json({ tasks: MOCK_TASKS.filter(t => t.assigned_to === 'mock-user-id') })
  ),
  http.post(`${API}/tasks`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    const task = { ...body, id: `t${Date.now()}`, status: 'open', revision_count: 0, created_by: 'mock-user-id', created_at: new Date().toISOString(), deleted_at: null };
    return HttpResponse.json({ task }, { status: 201 });
  }),
  http.patch(`${API}/tasks/:taskId/claim`, ({ params }) =>
    HttpResponse.json({ task: { ...MOCK_TASKS.find(t => t.id === params.taskId), status: 'claimed', assigned_to: 'mock-user-id' }, session: { id: 's1', current_step: 1 } })
  ),
  http.patch(`${API}/tasks/:taskId`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    const task = { ...MOCK_TASKS.find(t => t.id === params.taskId), ...body };
    return HttpResponse.json({ task });
  }),

  // ── SOP ──────────────────────────────────────────────────
  http.get(`${API}/sop/sessions/:sessionId`, ({ params }) =>
    HttpResponse.json({ session: { ...MOCK_SESSION, id: params.sessionId } })
  ),
  http.patch(`${API}/sop/sessions/:sessionId/steps/:stepNumber`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ step: { ...body, is_completed: body.is_completed ?? false }, nextStep: typeof body.is_completed === 'boolean' && body.is_completed ? 3 : null, gateStatus: { passed: true } });
  }),
  http.post(`${API}/sop/sessions/:sessionId/prediction`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ prediction: { id: `p${Date.now()}`, session_id: 's1', ...body, created_at: new Date().toISOString() }, cannotEditWarning: true });
  }),
  http.get(`${API}/sop/sessions/:sessionId/prediction`, () =>
    HttpResponse.json({ prediction: null })
  ),
  http.post(`${API}/sop/sessions/:sessionId/reflection`, () =>
    HttpResponse.json({ reflectionId: `r${Date.now()}`, savedAt: new Date().toISOString() })
  ),
  http.post(`${API}/sop/sessions/:sessionId/submit`, () =>
    HttpResponse.json({ submittedAt: new Date().toISOString(), sessionStatus: 'submitted' })
  ),
  http.post(`${API}/sop/ai-assist`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      analysis: `Câu trả lời của bạn cho thấy bạn đã hiểu rõ đối tượng khán giả. Tuy nhiên, hãy cụ thể hóa thêm về "nỗi đau" (pain point) mà video này giải quyết cho họ.`,
      deeperQuestions: [
        `Khán giả của video này đang gặp phải vấn đề gì cụ thể mà họ chưa tìm được giải pháp?`,
        `Sau 30 giây xem video, cảm xúc nào bạn muốn khán giả cảm thấy?`,
      ],
    });
  }),
  http.post(`${API}/sop/ai-title`, () =>
    HttpResponse.json({
      titles: ['5 Bí quyết xây dựng thói quen buổi sáng của người thành công', 'Tại sao 90% người thất bại với routine sáng? Và cách sửa', 'Routine sáng thay đổi cuộc đời tôi trong 30 ngày'],
      description: 'Khám phá 5 bí quyết xây dựng thói quen buổi sáng hiệu quả từ những người thành công. Video chia sẻ góc nhìn thực tế, không lý thuyết suông.',
      hashtags: ['#thiQuenBuoiSang', '#productive', '#NhiLeHolding', '#phatTrienBanThan', '#routine'],
    })
  ),

  // ── SOP QC ───────────────────────────────────────────────
  http.post(`${API}/sop/sessions/:sessionId/qc-decision`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ sessionStatus: body.decision, revisionCount: 0 });
  }),

  // ── Lessons ──────────────────────────────────────────────
  http.get(`${API}/lessons`, () =>
    HttpResponse.json({ lessons: MOCK_LESSONS, total: MOCK_LESSONS.length })
  ),
  http.get(`${API}/lessons/recent`, () =>
    HttpResponse.json({ lessons: MOCK_LESSONS.slice(0, 3) })
  ),
  http.post(`${API}/lessons`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ lesson: { id: `l${Date.now()}`, created_by: 'mock-user-id', session_id: null, ...body, created_at: new Date().toISOString(), deleted_at: null } }, { status: 201 });
  }),
  http.patch(`${API}/lessons/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ lesson: { ...MOCK_LESSONS.find(l => l.id === params.id), ...body } });
  }),
  http.delete(`${API}/lessons/:id`, () =>
    HttpResponse.json({ deleted: true })
  ),

  // ── Progress ─────────────────────────────────────────────
  http.get(`${API}/progress/me`, () =>
    HttpResponse.json({ streak_days: 7, monthly_scores: MOCK_MONTHLY_SCORES, accuracy_history: MOCK_ACCURACY_HISTORY, mindset_timeline: [] })
  ),
  http.get(`${API}/progress/monthly-score`, () =>
    HttpResponse.json({ score: MOCK_MONTHLY_SCORES[0] })
  ),

  // ── Analytics ────────────────────────────────────────────
  http.get(`${API}/analytics/sessions`, () =>
    HttpResponse.json({
      sessions: MOCK_ACCURACY_HISTORY.map(h => ({
        session_id: h.session_id, task_title: h.video_title,
        prediction: { id: `p_${h.session_id}`, session_id: h.session_id, retention_predicted: 68, ctr_predicted: 4.5, drop_point_predicted: 35, editor_note: null, created_at: h.computed_at },
        actual: { id: `a_${h.session_id}`, session_id: h.session_id, youtube_video_id: 'abc123', retention_actual: 71, ctr_actual: 4.8, drop_point_actual: 38, view_count: 12400, synced_at: h.computed_at },
        accuracy: { retention_accuracy: h.overall_accuracy, ctr_accuracy: h.overall_accuracy - 2, overall_accuracy: h.overall_accuracy },
      })),
      total: MOCK_ACCURACY_HISTORY.length,
    })
  ),
  http.get(`${API}/analytics/accuracy-trend`, () =>
    HttpResponse.json({ trend: MOCK_MONTHLY_SCORES.map(s => ({ year_month: s.year_month, avg_accuracy: s.accuracy_score * 3 })) })
  ),

  // ── Me ───────────────────────────────────────────────────
  http.get(`${API}/me`, () =>
    HttpResponse.json({ user: { id: 'mock-user-id', name: 'Editor', email: 'editor@nhiLe.vn', role: 'editor', avatar_initials: 'ED' } })
  ),
  http.post(`${API}/me/mindset`, () =>
    HttpResponse.json({ mindsetScoreId: `ms${Date.now()}`, isLockedForQuarter: true })
  ),
  http.get(`${API}/me/mindset`, () =>
    HttpResponse.json({ scores: [], current_quarter_locked: false })
  ),

  // ── Leader ───────────────────────────────────────────────
  http.get(`${API}/leader/dashboard`, () =>
    HttpResponse.json(MOCK_TEAM_KPI)
  ),
  http.get(`${API}/leader/members`, () =>
    HttpResponse.json({ members: MOCK_MEMBERS })
  ),
  http.get(`${API}/leader/members/:memberId`, ({ params }) => {
    const member = MOCK_MEMBERS.find(m => m.user_id === params.memberId) || MOCK_MEMBERS[0];
    return HttpResponse.json({ member, recent_sessions: [MOCK_SESSION], accuracy_chart: MOCK_ACCURACY_HISTORY.map(h => ({ session_id: h.session_id, overall_accuracy: h.overall_accuracy, created_at: h.computed_at })), mindset_timeline: [], mindset_self_eval: { product_thinking: 4, audience_focus: 3, proactive_suggest: 4, owner_mindset: 3 }, monthly_scores: MOCK_MONTHLY_SCORES });
  }),
  http.post(`${API}/leader/members/:memberId/actions`, () =>
    HttpResponse.json({ logged: true })
  ),
  http.get(`${API}/leader/videos`, () =>
    HttpResponse.json({
      videos: MOCK_TASKS.filter(t => t.status !== 'open').map(t => ({
        session_id: `s_${t.id}`, task: t, assigned_to_name: 'Editor',
        current_step: 2, status: t.status, deadline: t.deadline,
        days_remaining: t.deadline ? Math.ceil((new Date(t.deadline).getTime() - Date.now()) / 86400000) : null,
        revision_count: t.revision_count, checklist_completion_pct: 40,
      })),
      total: 1,
    })
  ),
  http.get(`${API}/leader/signals`, () =>
    HttpResponse.json({ signals: MOCK_SIGNALS })
  ),
  http.post(`${API}/leader/quarterly-evals`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ eval: { id: `e${Date.now()}`, ...body }, calculatedTier: 'tốt' });
  }),
  http.get(`${API}/leader/quarterly-evals/:memberId`, () =>
    HttpResponse.json({ evals: [] })
  ),
  http.post(`${API}/leader/youtube-sync`, () =>
    HttpResponse.json({ syncJobId: `job_${Date.now()}`, estimatedCompletionSeconds: 30 })
  ),
];
