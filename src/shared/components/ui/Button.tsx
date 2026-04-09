import React from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-150',
        'focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/40',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-[#0ea5e9] text-white hover:bg-[#0284c7] active:scale-[0.98]': variant === 'primary',
          'bg-[#242424] text-[#f4f4f5] hover:bg-[#2a2a2a] border border-[#2a2a2a]': variant === 'secondary',
          'bg-transparent text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#242424]': variant === 'ghost',
          'bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 border border-[#ef4444]/30': variant === 'danger',
          'bg-transparent border border-[#2a2a2a] text-[#f4f4f5] hover:bg-[#242424]': variant === 'outline',
          'text-xs px-2.5 py-1.5': size === 'sm',
          'text-sm px-4 py-2': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
