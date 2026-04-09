import React from 'react';
import { clsx } from 'clsx';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label
      className={clsx('block text-xs font-medium text-[#a1a1aa] mb-1', className)}
      {...props}
    >
      {children}
    </label>
  );
}
