import React from 'react';
import { clsx } from 'clsx';

interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
}

export function Slider({ value, onChange, min = 0, max = 100, step = 1, disabled, className }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={clsx('relative flex items-center', className)}>
      <div className="relative w-full h-2 bg-[#242424] rounded-full">
        <div
          className="absolute h-full bg-[#0ea5e9] rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full h-2 opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      <div
        className="absolute w-4 h-4 bg-[#0ea5e9] rounded-full border-2 border-[#0f0f0f] shadow pointer-events-none"
        style={{ left: `calc(${pct}% - 8px)` }}
      />
    </div>
  );
}
