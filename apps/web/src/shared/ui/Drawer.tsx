"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { cn } from "@/shared/lib/cn";
import { useFocusTrap } from "@/shared/hooks/useFocusTrap";
import { useMounted } from "@/shared/hooks/useMounted";
import { gsap } from "@/shared/lib/gsap";
import { DUR, EASE, prefersReducedMotion } from "@/shared/lib/motion";
import { Icon } from "./Icon";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const sideClasses = {
  left: "left-0 top-0 h-full w-full max-w-sm -translate-x-full",
  right: "right-0 top-0 h-full w-full max-w-sm translate-x-full",
  bottom: "bottom-0 left-0 w-full max-h-[85vh] translate-y-full",
};

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  className,
}: DrawerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  useFocusTrap(panelRef, open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useGSAP(
    () => {
      const panel = panelRef.current;
      const backdrop = backdropRef.current;
      if (!panel || !backdrop) return;

      if (prefersReducedMotion()) {
        gsap.set(panel, { x: 0, y: 0 });
        gsap.set(backdrop, { opacity: open ? 1 : 0 });
        return;
      }

      const axis = side === "bottom" ? "y" : "x";
      if (open) {
        gsap.set(panel, { [axis]: side === "left" ? "-100%" : "100%" });
        gsap.to(panel, { [axis]: 0, duration: DUR.base, ease: EASE });
        gsap.fromTo(
          backdrop,
          { opacity: 0 },
          { opacity: 1, duration: DUR.base, ease: EASE },
        );
      } else {
        gsap.to(panel, {
          [axis]: side === "left" ? "-100%" : "100%",
          duration: DUR.fast,
          ease: EASE,
        });
        gsap.to(backdrop, { opacity: 0, duration: DUR.fast, ease: EASE });
      }
    },
    { scope: rootRef, dependencies: [open, side] },
  );

  if (!mounted) return null;

  return createPortal(
    <div
      ref={rootRef}
      className={cn("fixed inset-0 z-50", !open && "pointer-events-none")}
      aria-hidden={!open}
      inert={!open || undefined}
    >
      <div
        ref={backdropRef}
        onClick={onClose}
        className="bg-ink/40 absolute inset-0 opacity-0"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "shadow-overlay absolute flex flex-col bg-white",
          sideClasses[side],
          className,
        )}
      >
        {title && (
          <div className="border-border flex items-center justify-between border-b p-4">
            <h2 className="text-h3 font-bold">{title}</h2>
            <button type="button" aria-label="Tutup" onClick={onClose}>
              <Icon name="close" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
