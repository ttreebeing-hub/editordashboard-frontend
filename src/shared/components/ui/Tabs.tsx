import React, { createContext, useContext, useState } from 'react';
import { clsx } from 'clsx';

const TabsCtx = createContext<{ value: string; onChange: (v: string) => void } | null>(null);

export function Tabs({ value: controlledValue, onValueChange, defaultValue, children, className }: {
  value?: string;
  onValueChange?: (v: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = useState(defaultValue || '');
  const value = controlledValue !== undefined ? controlledValue : internal;
  const onChange = onValueChange || setInternal;

  return (
    <TabsCtx.Provider value={{ value, onChange }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('flex gap-1 bg-[#242424] p-1 rounded-lg', className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx.onChange(value)}
      className={clsx(
        'flex-1 px-3 py-1.5 text-sm rounded-md transition-all duration-150 font-medium',
        active
          ? 'bg-[#1a1a1a] text-[#f4f4f5] shadow-sm'
          : 'text-[#a1a1aa] hover:text-[#f4f4f5]',
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}
