import { clsx } from 'clsx';
import { Check, Lock } from 'lucide-react';

interface Props {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

const STEPS = [
  { num: 1, label: 'B1', full: 'Tiếp nhận' },
  { num: 2, label: 'B2', full: 'Dựng thô' },
  { num: 3, label: 'B3', full: 'Hoàn thiện' },
  { num: 4, label: 'B4', full: 'Xuất file' },
  { num: 5, label: 'B5', full: 'Kiểm tra' },
  { num: 6, label: 'B6', full: 'Nộp bài' },
];

export function StepNav({ currentStep, completedSteps, onStepClick }: Props) {
  return (
    <div className="sticky top-[57px] z-10 bg-[#0f0f0f]/95 backdrop-blur-md border-b border-[#2a2a2a] -mx-4 lg:-mx-6 px-4 lg:px-6 py-3">
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STEPS.map((step, idx) => {
          const isDone = completedSteps.includes(step.num);
          const isActive = currentStep === step.num;
          const isLocked = step.num > currentStep && !isDone;

          return (
            <div key={step.num} className="flex items-center">
              <button
                onClick={() => !isLocked && onStepClick(step.num)}
                disabled={isLocked}
                className={clsx(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex-shrink-0',
                  'disabled:cursor-not-allowed',
                  isActive && 'bg-[#0ea5e9] text-white',
                  isDone && !isActive && 'bg-[#22c55e]/10 text-[#22c55e] hover:bg-[#22c55e]/20',
                  isLocked && 'text-[#a1a1aa]/40',
                  !isActive && !isDone && !isLocked && 'text-[#a1a1aa] hover:text-[#f4f4f5] hover:bg-[#1a1a1a]'
                )}
              >
                <span
                  className={clsx(
                    'w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0',
                    isActive && 'bg-white/20',
                    isDone && !isActive && 'bg-[#22c55e]/20',
                    isLocked && 'bg-[#2a2a2a]',
                  )}
                >
                  {isDone ? <Check size={10} strokeWidth={3} /> : isLocked ? <Lock size={10} /> : step.num}
                </span>
                <span className="hidden sm:inline">{step.full}</span>
                <span className="sm:hidden">{step.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div
                  className={clsx(
                    'w-6 h-px mx-1 flex-shrink-0',
                    completedSteps.includes(step.num) ? 'bg-[#22c55e]/40' : 'bg-[#2a2a2a]'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
