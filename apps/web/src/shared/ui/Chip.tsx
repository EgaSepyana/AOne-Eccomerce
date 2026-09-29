import { cn } from "@/shared/lib/cn";
import { Icon } from "./Icon";

export interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  className?: string;
}

export function Chip({
  children,
  active,
  onRemove,
  onClick,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "border-border text-small inline-flex h-9 items-center gap-1.5 border px-3",
        active && "border-ink bg-ink text-white",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          aria-label="Hapus filter"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Icon name="close" size={20} className="!text-[16px]" />
        </button>
      )}
    </span>
  );
}
