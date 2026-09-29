"use client";

import { useId, useState } from "react";
import { cn } from "@/shared/lib/cn";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const tooltipId = useId();

  return (
    <span
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      <span aria-describedby={tooltipId}>{children}</span>
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          className="bg-ink text-caption absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 px-2 py-1 whitespace-nowrap text-white"
        >
          {content}
        </span>
      )}
    </span>
  );
}
