"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/shared/ui";
import type { ProductImage } from "../model/types";
import { Lightbox } from "./Lightbox";

export interface ProductGalleryProps {
  images: ProductImage[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mobileIndex, setMobileIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setMobileIndex(index);
  }

  return (
    <>
      {/* Mobile: swipe carousel */}
      <div className="relative sm:hidden">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto"
        >
          {images.map((image, i) => (
            <button
              key={image.src + i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              className="bg-subtle relative aspect-[3/4] w-full shrink-0 snap-start"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={i === 0}
                sizes="100vw"
                className="object-cover"
              />
              {image.modelInfo && (
                <span className="text-caption text-ink absolute bottom-3 left-3 bg-white/85 px-2 py-1">
                  {image.modelInfo}
                </span>
              )}
            </button>
          ))}
        </div>
        <span className="text-caption text-ink absolute right-3 bottom-3 bg-white/85 px-2 py-1">
          {mobileIndex + 1}/{images.length}
        </span>
      </div>

      {/* Desktop: 2-column grid */}
      <div className="hidden grid-cols-2 gap-2 sm:grid">
        {images.map((image, i) => (
          <button
            key={image.src + i}
            type="button"
            onClick={() => setLightboxIndex(i)}
            className="bg-subtle relative aspect-[3/4] cursor-zoom-in"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={i < 2}
              sizes="(min-width: 1024px) 30vw, 45vw"
              className="object-cover"
            />
            {image.modelInfo && (
              <span className="text-caption text-ink absolute bottom-3 left-3 bg-white/85 px-2 py-1">
                {image.modelInfo}
              </span>
            )}
            {i === 0 && (
              <span className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-white">
                <Icon name="zoom_in" size={22} />
              </span>
            )}
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
