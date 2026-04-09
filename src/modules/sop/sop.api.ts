import { apiGet, apiPost, apiPatch } from '../../shared/config/api-client';
import type {
  EditorVideoSession, EditorSopStep, EditorPrediction,
  SopChecklistItem, SopFileItem, SopExportSpec, AiAssistRequest, AiAssistResponse
} from '../../shared/types/editor.types';

export const sopApi = {
  getSession: (sessionId: string) =>
    apiGet<EditorVideoSession>(`/sessions/${sessionId}`),

  getActiveSession: () =>
    apiGet<EditorVideoSession | null>('/sessions/active'),

  updateStep: (sessionId: string, step: number, data: {
    mindset_answer?: string;
    checklist_json?: SopChecklistItem[];
    files_json?: SopFileItem[];
    export_spec_json?: SopExportSpec | null;
    is_completed?: boolean;
  }) =>
    apiPatch<EditorSopStep>(`/sessions/${sessionId}/steps/${step}`, data),

  advanceStep: (sessionId: string, nextStep: number) =>
    apiPatch<EditorVideoSession>(`/sessions/${sessionId}/advance`, { next_step: nextStep }),

  savePrediction: (sessionId: string, data: {
    retention_predicted: number;
    ctr_predicted: number;
    drop_point_predicted?: number | null;
    editor_note?: string | null;
  }) =>
    apiPost<EditorPrediction>(`/sessions/${sessionId}/prediction`, data),

  submitSession: (sessionId: string, reflection: {
    what_learned: string;
    what_to_improve: string;
    mindset_note: string;
  }) =>
    apiPost<EditorVideoSession>(`/sessions/${sessionId}/submit`, reflection),

  aiAssist: (data: AiAssistRequest) =>
    apiPost<AiAssistResponse>('/sop/ai-assist', data),
};
