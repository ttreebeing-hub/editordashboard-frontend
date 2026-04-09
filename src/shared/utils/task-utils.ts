import type { Task } from '../types/editor.types';

export function fmtDeadline(iso: string): string {
  const h = (new Date(iso).getTime() - Date.now()) / 3600000;
  if (h < 0) return 'Quá hạn';
  if (h < 1) return `⚡${Math.round(h * 60)}p`;
  if (h < 4) return `⚡${Math.round(h)}h`;
  if (h < 24) return `${Math.round(h)}h còn`;
  return `${Math.round(h / 24)}d còn`;
}

export function isUrgent(iso: string): boolean {
  return (new Date(iso).getTime() - Date.now()) / 3600000 < 12;
}

export function getStats(tasks: Task[]) {
  const done = tasks.filter(t => t.step === 'Done').length;
  const rej = tasks.filter(t => t.step === 'Reject').length;
  const pend = tasks.filter(t => t.pend && t.step !== 'Done').length;
  const active = tasks.filter(t => t.step !== 'Done' && t.step !== 'Reject').length;
  const total = tasks.length;
  const cr = total ? Math.round(done / total * 100) : 0;
  const ar = (done + rej) ? Math.round(done / (done + rej) * 100) : 0;
  const rr = (done + rej) ? Math.round(rej / (done + rej) * 100) : 0;
  return { done, rej, pend, active, total, cr, ar, rr };
}
