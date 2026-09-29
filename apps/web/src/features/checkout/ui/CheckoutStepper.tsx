import { cn } from "@/shared/lib/cn";
import type { CheckoutStep } from "../model/useCheckoutStore";

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "pengiriman", label: "Pengiriman" },
  { id: "pembayaran", label: "Pembayaran" },
  { id: "review", label: "Review" },
];

export function CheckoutStepper({ current }: { current: CheckoutStep }) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-3">
      {STEPS.map((step, index) => {
        const done = index < currentIndex;
        const isCurrent = index === currentIndex;
        const active = done || isCurrent;

        return (
          <div key={step.id} className="flex items-center gap-3">
            <span
              className={cn(
                "text-small flex size-7 items-center justify-center rounded-full border-[1.5px] font-bold",
                active
                  ? "border-ink bg-ink text-white"
                  : "border-border text-disabled bg-white",
              )}
            >
              {done ? "✓" : index + 1}
            </span>
            <span
              className={cn(
                "text-body",
                isCurrent
                  ? "text-ink font-bold"
                  : active
                    ? "text-ink"
                    : "text-muted",
              )}
            >
              {step.label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="bg-border h-px w-12" />
            )}
          </div>
        );
      })}
    </div>
  );
}
