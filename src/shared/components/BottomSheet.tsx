import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onClose, title, children, className }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Sheet */}
      <div
        className={clsx(
          'relative bg-[#1a1a1a] border-t border-[#2a2a2a] rounded-t-2xl',
          'max-h-[90vh] overflow-y-auto',
          'animate-in slide-in-from-bottom duration-300',
          className
        )}
      >
        <div className="sticky top-0 bg-[#1a1a1a] z-10 flex items-center justify-between px-5 py-4 border-b border-[#2a2a2a]">
          {title && <h2 className="font-semibold text-[#f4f4f5]">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto text-[#a1a1aa] hover:text-[#f4f4f5] transition-colors p-1 rounded"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
