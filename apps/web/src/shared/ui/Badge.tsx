import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";

const badgeVariants = cva(
  "inline-block px-1.5 py-1 text-caption font-bold uppercase",
  {
    variants: {
      variant: {
        new: "bg-white text-ink",
        sale: "bg-ink text-white",
        stock: "border border-border bg-white text-muted",
      },
    },
    defaultVariants: {
      variant: "new",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
