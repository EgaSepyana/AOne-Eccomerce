import { forwardRef, useId } from "react";
import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, id, className, ...props }, ref) {
    const generatedId = useId();
    const checkboxId = id ?? generatedId;

    return (
      <label
        htmlFor={checkboxId}
        className="inline-flex cursor-pointer items-center gap-2"
      >
        <span className="group border-border has-checked:border-ink has-checked:bg-ink relative flex size-5 shrink-0 items-center justify-center border">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              "peer absolute inset-0 size-5 cursor-pointer opacity-0",
              className,
            )}
            {...props}
          />
          <Icon
            name="check"
            size={16}
            className="hidden !text-[14px] text-white peer-checked:block"
          />
        </span>
        {label && <span className="text-body">{label}</span>}
      </label>
    );
  },
);
