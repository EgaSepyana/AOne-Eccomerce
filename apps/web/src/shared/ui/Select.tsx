import { forwardRef, useId } from "react";
import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, id, className, children, ...props }, ref) {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-caption text-ink font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={cn(
              "border-border text-body text-ink focus-visible:border-ink h-12 w-full appearance-none border bg-white px-4 pr-10 focus-visible:outline-none",
              error && "border-ink border-[1.5px]",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          <Icon
            name="expand_more"
            size={20}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
          />
        </div>
        {error && (
          <span className="text-caption text-ink flex items-center gap-1">
            <Icon name="error" size={20} className="!text-[14px]" />
            {error}
          </span>
        )}
      </div>
    );
  },
);
