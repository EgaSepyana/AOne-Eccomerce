import { cn } from "@/shared/lib/cn";

export interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export function ProgressBar({ value, max = 100, className }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn("bg-subtle h-1 w-full", className)}
    >
      <div
        className="bg-ink duration-slow ease-aone h-full transition-[width]"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
