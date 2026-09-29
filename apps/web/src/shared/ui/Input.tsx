import { forwardRef, useId } from "react";
import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-caption text-ink font-medium">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={!!error}
        className={cn(
          "border-border text-body text-ink placeholder:text-muted focus-visible:border-ink h-12 border bg-white px-4 focus-visible:outline-none",
          error && "border-ink border-[1.5px]",
          className,
        )}
        {...props}
      />
      {error && (
        <span className="text-caption text-ink flex items-center gap-1">
          <Icon name="error" size={20} className="!text-[14px]" />
          {error}
        </span>
      )}
    </div>
  );
});
