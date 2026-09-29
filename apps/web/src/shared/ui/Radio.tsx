import { forwardRef, useId } from "react";
import { cn } from "@/shared/lib/cn";

export interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: React.ReactNode;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, id, className, ...props },
  ref,
) {
  const generatedId = useId();
  const radioId = id ?? generatedId;

  return (
    <label
      htmlFor={radioId}
      className="inline-flex cursor-pointer items-center gap-2"
    >
      <span className="border-border has-checked:border-ink relative flex size-5 shrink-0 items-center justify-center rounded-full border">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          className={cn(
            "peer absolute inset-0 size-5 cursor-pointer opacity-0",
            className,
          )}
          {...props}
        />
        <span className="bg-ink hidden size-2.5 rounded-full peer-checked:block" />
      </span>
      {label && <span className="text-body">{label}</span>}
    </label>
  );
});
