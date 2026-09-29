"use client";

import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  className?: string;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "border-border flex h-12 w-[120px] items-center justify-between border",
        className,
      )}
    >
      <button
        type="button"
        aria-label="Kurangi jumlah"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="disabled:text-disabled flex h-full w-10 items-center justify-center"
      >
        <Icon name="remove" size={20} />
      </button>
      <span className="tabular text-body">{value}</span>
      <button
        type="button"
        aria-label="Tambah jumlah"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="disabled:text-disabled flex h-full w-10 items-center justify-center"
      >
        <Icon name="add" size={20} />
      </button>
    </div>
  );
}
