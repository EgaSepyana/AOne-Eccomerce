"use client";

import { useRef } from "react";
import { cn } from "@/shared/lib/cn";
import { gsap } from "@/shared/lib/gsap";
import { DUR } from "@/shared/lib/motion";

export interface SizeOption {
  label: string;
  stock: number;
}

export interface SizeSelectorProps {
  sizes: SizeOption[];
  selected?: string;
  onSelect?: (label: string) => void;
  onSelectSoldOut?: (label: string) => void;
  size?: "sm" | "lg";
  wrap?: boolean;
  className?: string;
}

export function SizeSelector({
  sizes,
  selected,
  onSelect,
  onSelectSoldOut,
  size = "sm",
  wrap = false,
  className,
}: SizeSelectorProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      role="radiogroup"
      className={cn(
        wrap ? "flex flex-wrap gap-2" : "grid grid-cols-4 gap-2",
        className,
      )}
    >
      {sizes.map((sizeOption) => {
        const soldOut = sizeOption.stock === 0;
        return (
          <button
            key={sizeOption.label}
            type="button"
            role="radio"
            aria-checked={selected === sizeOption.label}
            onClick={() =>
              soldOut
                ? onSelectSoldOut?.(sizeOption.label)
                : onSelect?.(sizeOption.label)
            }
            className={cn(
              "border-border text-body relative flex items-center justify-center border",
              size === "sm" ? "h-10 w-12" : "h-11 w-14",
              selected === sizeOption.label && "border-ink bg-ink text-white",
              soldOut && "text-disabled",
            )}
          >
            {sizeOption.label}
            {soldOut && (
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top right, transparent calc(50% - 1px), var(--color-disabled) calc(50% - 1px), var(--color-disabled) calc(50% + 1px), transparent calc(50% + 1px))",
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export function shakeElement(el: HTMLElement) {
  gsap.fromTo(
    el,
    { x: 0 },
    {
      x: 4,
      duration: DUR.fast,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut",
      clearProps: "x",
    },
  );
}
