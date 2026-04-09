import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

export function Dialog({ open, onClose, children }: DialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', handler);
      return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
    } else {
      document.body.style.overflow = '';
    }
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      {children}
    </div>
  );
}

export function DialogContent({ children, className }: DialogContentProps) {
  return (
    <div
      className={clsx(
        'relative bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto',
        'animate-in zoom-in-95 fade-in duration-200',
        className
      )}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a]">
      {children}
      {onClose && (
        <button onClick={onClose} className="text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors p-1 rounded">
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={clsx('font-semibold text-[#f4f4f5]', className)}>{children}</h2>;
}

export function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('flex items-center justify-end gap-3 px-6 py-4 border-t border-[#2a2a2a]', className)}>
      {children}
    </div>
  );
}
