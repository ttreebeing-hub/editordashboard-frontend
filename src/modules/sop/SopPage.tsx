import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { StepNav } from './StepNav';
import { StepB1 } from './steps/StepB1';
import { StepB2 } from './steps/StepB2';
import { StepB3 } from './steps/StepB3';
import { StepB4 } from './steps/StepB4';
import { StepB5 } from './steps/StepB5';
import { StepB6 } from './steps/StepB6';
import { PageLoader } from '../../shared/components/LoadingSpinner';
import { EmptyState } from '../../shared/components/EmptyState';
import { sopApi } from './sop.api';
import { ClipboardList } from 'lucide-react';

export function SopPage() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: session, isLoading, error } = useQuery({
    queryKey: ['sop-session', sessionId || 'active'],
    queryFn: () => sessionId ? sopApi.getSession(sessionId) : sopApi.getActiveSession(),
  });

  const [activeStep, setActiveStep] = useState<number | null>(null);

  if (isLoading) return <PageLoader />;

  if (!session) {
    return (
      <EmptyState
        icon={<ClipboardList />}
        title="Không có session SOP đang hoạt động"
        description="Nhận task từ Pool để bắt đầu quy trình SOP"
      />
    );
  }

  const currentStep = activeStep ?? session.current_step ?? 1;
  const completedSteps = session.steps?.filter(s => s.is_completed).map(s => s.step_number) || [];

  const handleStepComplete = () => {
    qc.invalidateQueries({ queryKey: ['sop-session'] });
    const next = currentStep + 1;
    if (next <= 6) setActiveStep(next);
  };

  const stepProps = { session, onComplete: handleStepComplete };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepB1 {...stepProps} />;
      case 2: return <StepB2 {...stepProps} />;
      case 3: return <StepB3 {...stepProps} />;
      case 4: return <StepB4 {...stepProps} />;
      case 5: return <StepB5 {...stepProps} />;
      case 6: return <StepB6 {...stepProps} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StepNav
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={setActiveStep}
      />
      <div className="mt-6">
        {renderStep()}
      </div>
    </div>
  );
}
