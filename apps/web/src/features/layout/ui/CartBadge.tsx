"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/shared/lib/gsap";
import { prefersReducedMotion } from "@/shared/lib/motion";

export function CartBadge({ count }: { count: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(count);
  const isFirstRender = useRef(true);

  useGSAP(() => {
    if (!ref.current) return;
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else if (count > prevCount.current && !prefersReducedMotion()) {
      gsap.fromTo(
        ref.current,
        { scale: 1 },
        { scale: 1.2, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" },
      );
    }
    prevCount.current = count;
  }, [count]);

  if (count === 0) return null;

  return (
    <span
      ref={ref}
      className="bg-ink absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white"
    >
      {count}
    </span>
  );
}
