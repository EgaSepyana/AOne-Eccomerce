"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/shared/lib/gsap";
import { DUR, prefersReducedMotion } from "@/shared/lib/motion";

export function useProductGridAnimation(itemIds: string[]) {
  const gridRef = useRef<HTMLDivElement>(null);
  const prevIds = useRef<string[]>([]);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid || prefersReducedMotion()) {
        prevIds.current = itemIds;
        return;
      }

      const children = Array.from(grid.children) as HTMLElement[];
      const isAppend =
        itemIds.length > prevIds.current.length &&
        prevIds.current.every((id, i) => itemIds[i] === id);

      const targets = isAppend ? children.slice(prevIds.current.length) : children;

      if (targets.length > 0) {
        gsap.fromTo(
          targets,
          { opacity: 0 },
          { opacity: 1, duration: isAppend ? DUR.base : 0.15, ease: "power1.out" },
        );
      }

      prevIds.current = itemIds;
    },
    { scope: gridRef, dependencies: [itemIds] },
  );

  return gridRef;
}
