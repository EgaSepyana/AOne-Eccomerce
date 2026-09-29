import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

export interface StepperStep {
  label: string;
  id: string;
}

export interface StepperProps {
  steps: StepperStep[];
  currentStepId: string;
  onStepClick?: (id: string) => void;
  className?: string;
}

export function Stepper({
  steps,
  currentStepId,
  onStepClick,
  className,
}: StepperProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <ol className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const clickable = isCompleted && onStepClick;

        return (
          <li key={step.id} className="flex items-center gap-2">
            {index > 0 && (
              <Icon name="chevron_right" size={20} className="text-border" />
            )}
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(step.id)}
              aria-current={isCurrent ? "step" : undefined}
              className={cn(
                "text-small font-bold uppercase",
                isCurrent ? "text-ink" : "text-muted",
                clickable && "underline underline-offset-2",
              )}
            >
              {step.label}
            </button>
          </li>
        );
      })}
    </ol>
  );
}
