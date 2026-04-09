import React, { createContext, useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

export type ToastType = 'success' | 'warn' | 'info' | 'error';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  success: (msg: string) => void;
  warn: (msg: string) => void;
  info: (msg: string) => void;
  error: (msg: string) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (timers.current.has(id)) {
      clearTimeout(timers.current.get(id));
      timers.current.delete(id);
    }
  }, []);

  const add = useCallback((message: string, type: ToastType) => {
    const id = `toast-${++idCounter}`;
    setToasts(prev => {
      const next = [...prev, { id, message, type }];
      return next.slice(-5);
    });
    const timer = setTimeout(() => dismiss(id), 2800);
    timers.current.set(id, timer);
  }, [dismiss]);

  const value: ToastContextValue = {
    success: (msg) => add(msg, 'success'),
    warn: (msg) => add(msg, 'warn'),
    info: (msg) => add(msg, 'info'),
    error: (msg) => add(msg, 'error'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none"
        aria-live="polite"
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border min-w-[280px] max-w-[380px]',
              'bg-[#1a1a1a] text-[#f4f4f5] text-sm shadow-xl',
              'animate-in slide-in-from-right-4 fade-in duration-200',
              {
                'border-[#0ea5e9]': toast.type === 'success' || toast.type === 'info',
                'border-[#f59e0b]': toast.type === 'warn',
                'border-[#ef4444]': toast.type === 'error',
              }
            )}
          >
            <div
              className={clsx('w-1.5 self-stretch rounded-full flex-shrink-0', {
                'bg-[#0ea5e9]': toast.type === 'success' || toast.type === 'info',
                'bg-[#f59e0b]': toast.type === 'warn',
                'bg-[#ef4444]': toast.type === 'error',
              })}
            />
            <span className="flex-1 leading-relaxed">{toast.message}</span>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
