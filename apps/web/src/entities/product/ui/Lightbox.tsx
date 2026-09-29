"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import { useMounted } from "@/shared/hooks/useMounted";
import { gsap } from "@/shared/lib/gsap";
import { DUR, EASE, prefersReducedMotion } from "@/shared/lib/motion";
import { Icon } from "@/shared/ui";
import type { ProductImage } from "../model/types";

export interface LightboxProps {
  images: ProductImage[];
  initialIndex: number;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const mounted = useMounted();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, onClose]);

  useGSAP(
    () => {
      const el = rootRef.current;
      if (!el || prefersReducedMotion()) return;
      gsap.fromTo(
        el,
        { scale: 0.98, opacity: 0 },
        { scale: 1, opacity: 1, duration: DUR.base, ease: EASE },
      );
    },
    { scope: rootRef },
  );

  if (!mounted) return null;

  const image = images[index];
  if (!image) return null;

  return createPortal(
    <div ref={rootRef} className="fixed inset-0 z-[100] flex flex-col bg-white">
      <div className="border-border flex h-16 items-center justify-between border-b px-4">
        <span className="text-body text-muted">
          {index + 1}/{images.length}
        </span>
        <button type="button" aria-label="Tutup" onClick={onClose}>
          <Icon name="close" size={24} />
        </button>
      </div>
      <div className="relative flex-1">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Sebelumnya"
              onClick={() =>
                setIndex((i) => (i - 1 + images.length) % images.length)
              }
              className="shadow-overlay absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white"
            >
              <Icon name="chevron_left" />
            </button>
            <button
              type="button"
              aria-label="Berikutnya"
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              className="shadow-overlay absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white"
            >
              <Icon name="chevron_right" />
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
