import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-button font-bold uppercase tracking-[0.04em] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-2 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-ink text-white hover:bg-ink-hover disabled:bg-border disabled:text-disabled",
        secondary:
          "border border-ink bg-white text-ink hover:bg-subtle disabled:border-border disabled:text-disabled",
        link: "text-ink underline underline-offset-2 normal-case font-normal tracking-normal disabled:text-disabled",
        icon: "rounded-full bg-white text-ink hover:bg-subtle disabled:text-disabled",
      },
      size: {
        md: "h-12 px-6",
        lg: "h-13 px-8",
      },
    },
    compoundVariants: [
      { variant: "icon", size: "md", class: "h-10 w-10 px-0" },
      { variant: "icon", size: "lg", class: "h-11 w-11 px-0" },
      { variant: "link", size: "md", class: "h-auto px-0" },
      { variant: "link", size: "lg", class: "h-auto px-0" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Icon name="progress_activity" className="animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
