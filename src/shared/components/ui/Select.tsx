import React from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

interface Option { value: string; label: string; }

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({ value, onChange, options, placeholder, className, disabled }: SelectProps) {
  return (
    <div className={clsx('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={clsx(
          'w-full appearance-none px-3 py-2 pr-8 bg-[#242424] border border-[#2a2a2a] rounded-lg',
          'text-[#f4f4f5] text-sm',
          'focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9]/30',
          'transition-colors duration-150 cursor-pointer',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none" />
    </div>
  );
}
