import { cva } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";
import { formatRupiah } from "@/shared/lib/format";

const priceVariants = cva("tabular font-bold text-ink", {
  variants: {
    size: {
      normal: "text-price lg:text-body-lg",
      large: "text-price-lg lg:text-price-lg-d",
    },
  },
  defaultVariants: { size: "normal" },
});

export interface PriceProps {
  amount: number;
  compareAtAmount?: number;
  size?: "normal" | "large";
  className?: string;
}

export function Price({
  amount,
  compareAtAmount,
  size = "normal",
  className,
}: PriceProps) {
  const hasDiscount = !!compareAtAmount && compareAtAmount > amount;
  const discountPercent = hasDiscount
    ? Math.round((1 - amount / compareAtAmount) * 100)
    : 0;

  return (
    <span
      className={cn("inline-flex flex-wrap items-baseline gap-2", className)}
    >
      <span className={priceVariants({ size })}>{formatRupiah(amount)}</span>
      {hasDiscount && (
        <>
          <span className="tabular text-small text-muted line-through">
            {formatRupiah(compareAtAmount)}
          </span>
          <span className="bg-ink text-caption px-1.5 py-0.5 font-bold text-white">
            -{discountPercent}%
          </span>
        </>
      )}
    </span>
  );
}
