"use client";

import { cn } from "@/shared/lib/cn";

export interface SwatchProps {
  hex: string;
  name: string;
  size?: "sm" | "lg";
  selected?: boolean;
  soldOut?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Swatch({
  hex,
  name,
  size = "sm",
  selected = false,
  soldOut = false,
  onClick,
  className,
}: SwatchProps) {
  const dimension = size === "sm" ? "w-[14px] h-[14px]" : "size-8";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={name}
      aria-pressed={selected}
      className={cn(
        "border-border relative shrink-0 rounded-full border",
        dimension,
        selected && "shadow-[0_0_0_2px_#fff,0_0_0_3.5px_#111]",
        className,
      )}
      style={{ backgroundColor: hex }}
    >
      {soldOut && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(to top right, transparent calc(50% - 1px), var(--color-muted) calc(50% - 1px), var(--color-muted) calc(50% + 1px), transparent calc(50% + 1px))",
          }}
        />
      )}
    </button>
  );
}

export interface SwatchGroupProps {
  colors: { id: string; name: string; hex: string; soldOut?: boolean }[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  max?: number;
  size?: "sm" | "lg";
  className?: string;
}

export function SwatchGroup({
  colors,
  selectedId,
  onSelect,
  max = 4,
  size = "sm",
  className,
}: SwatchGroupProps) {
  const visible = colors.slice(0, max);
  const remaining = colors.length - visible.length;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      {visible.map((color) => (
        <Swatch
          key={color.id}
          hex={color.hex}
          name={color.name}
          size={size}
          soldOut={color.soldOut}
          selected={color.id === selectedId}
          onClick={() => onSelect?.(color.id)}
        />
      ))}
      {remaining > 0 && (
        <span className="text-caption text-muted">+{remaining}</span>
      )}
    </div>
  );
}
