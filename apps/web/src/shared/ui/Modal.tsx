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

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
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
      if (!panel || !backdrop || !open) return;

      if (prefersReducedMotion()) {
        gsap.set(panel, { scale: 1, opacity: 1 });
        gsap.set(backdrop, { opacity: 1 });
        return;
      }

      gsap.fromTo(
        panel,
        { scale: 0.98, opacity: 0 },
        { scale: 1, opacity: 1, duration: DUR.base, ease: EASE },
      );
      gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: DUR.base, ease: EASE },
      );
    },
    { scope: rootRef, dependencies: [open] },
  );

  if (!open || !mounted) return null;

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={backdropRef}
        onClick={onClose}
        className="bg-ink/40 absolute inset-0"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "shadow-overlay relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white",
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
        {children}
      </div>
    </div>,
    document.body,
  );
}
