import { clsx } from 'clsx';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function LoadingSpinner({ size = 'md', className, label }: Props) {
  const sizeClass = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }[size];

  return (
    <div className={clsx('flex flex-col items-center justify-center gap-2', className)}>
      <div
        className={clsx(
          sizeClass,
          'rounded-full border-[#2a2a2a] border-t-[#0ea5e9] animate-spin'
        )}
      />
      {label && <p className="text-[#a1a1aa] text-sm">{label}</p>}
    </div>
  );
}

export function PageLoader({ label = 'Đang tải...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[300px]">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
}
