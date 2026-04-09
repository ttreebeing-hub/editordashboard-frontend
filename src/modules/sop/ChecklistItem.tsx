import { clsx } from 'clsx';
import { Check } from 'lucide-react';

interface Props {
  id: string;
  label: string;
  checked: boolean;
  onChange: (id: string, checked: boolean) => void;
  disabled?: boolean;
}

export function ChecklistItem({ id, label, checked, onChange, disabled }: Props) {
  return (
    <label
      htmlFor={id}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-150',
        'hover:bg-[#242424]',
        checked && 'bg-[#0ea5e9]/5',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <div
        className={clsx(
          'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-150',
          checked
            ? 'bg-[#0ea5e9] border-[#0ea5e9]'
            : 'border-[#2a2a2a] bg-transparent'
        )}
      >
        {checked && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(id, e.target.checked)}
      />
      <span
        className={clsx(
          'text-sm',
          checked ? 'text-[#a1a1aa] line-through' : 'text-[#f4f4f5]'
        )}
      >
        {label}
      </span>
    </label>
  );
}
