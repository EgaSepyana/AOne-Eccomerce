import { Icon } from "./Icon";
import { cn } from "@/shared/lib/cn";

export interface RatingProps {
  value: number;
  count?: number;
  className?: string;
}

export function Rating({ value, count, className }: RatingProps) {
  return (
    <span
      className={cn(
        "text-caption text-ink inline-flex items-center gap-1",
        className,
      )}
    >
      <Icon name="star" size={20} className="!text-[14px]" />
      <span className="tabular font-medium">{value.toFixed(1)}</span>
      {typeof count === "number" && (
        <span className="text-muted">({count})</span>
      )}
    </span>
  );
}
