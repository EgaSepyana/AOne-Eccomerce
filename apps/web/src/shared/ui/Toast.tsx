"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { useUIStore, type ToastItem } from "@/shared/model/useUIStore";
import { useMounted } from "@/shared/hooks/useMounted";
import { gsap } from "@/shared/lib/gsap";
import { DUR, EASE, prefersReducedMotion } from "@/shared/lib/motion";

function ToastCard({ toast }: { toast: ToastItem }) {
  const dismissToast = useUIStore((s) => s.dismissToast);
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (el && !prefersReducedMotion()) {
        gsap.fromTo(
          el,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: DUR.base, ease: EASE },
        );
      }
    },
    { scope: ref },
  );

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, dismissToast]);

  return (
    <div
      ref={ref}
      role="status"
      aria-live="polite"
      className="bg-ink text-small shadow-overlay flex items-center gap-3 px-4 py-3 text-white"
    >
      <span>{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          onClick={toast.action.onClick}
          className="font-bold underline underline-offset-2"
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
}

export function ToastViewport() {
  const toasts = useUIStore((s) => s.toasts);
  const mounted = useMounted();

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} />
      ))}
    </div>,
    document.body,
  );
}
