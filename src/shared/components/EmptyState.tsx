import { clsx } from 'clsx';

interface Props {
  icon?: React.ReactNode | React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, actionButton, className }: Props) {
  const IconEl = icon as React.ElementType;
  const isComponent = typeof icon === 'function';
  return (
    <div className={clsx('flex flex-col items-center justify-center py-16 px-4 text-center', className)}>
      {icon && (
        <div className="mb-4 text-[#a1a1aa] opacity-50">
          {isComponent ? <IconEl className="w-12 h-12" /> : icon}
        </div>
      )}
      <p className="text-[#f4f4f5] font-medium mb-1">{title}</p>
      {description && (
        <p className="text-[#a1a1aa] text-sm max-w-xs">{description}</p>
      )}
      {(action || actionButton) && <div className="mt-4">{action ?? actionButton}</div>}
    </div>
  );
}
