import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export function Input({ className, error, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={clsx(
          'w-full px-3 py-2 bg-[#242424] border border-[#2a2a2a] rounded-lg text-[#f4f4f5]',
          'placeholder-[#a1a1aa] text-sm',
          'focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30',
          'transition-colors duration-150',
          error && 'border-[#ef4444]',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#ef4444]">{error}</p>}
    </div>
  );
}
