"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/shared/lib/gsap";
import { DUR, EASE, prefersReducedMotion } from "@/shared/lib/motion";
import { Button, Icon } from "@/shared/ui";
import { cn } from "@/shared/lib/cn";
import type { HeroSlide } from "../model/types";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const scope = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (paused || prefersReducedMotion() || slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  useGSAP(
    () => {
      if (!contentRef.current) return;
      const items = contentRef.current.children;
      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: DUR.slow, ease: EASE, stagger: 0.08 },
      );
    },
    { scope, dependencies: [] },
  );

  useGSAP(
    () => {
      const images = Array.from(imageRefs.current.entries());
      if (prefersReducedMotion()) {
        images.forEach(([i, el]) => gsap.set(el, { opacity: i === index ? 1 : 0 }));
        return;
      }
      images.forEach(([i, el]) => {
        gsap.to(el, { opacity: i === index ? 1 : 0, duration: DUR.slow, ease: EASE });
      });
    },
    { scope, dependencies: [index] },
  );

  const slide = slides[index];
  if (!slide) return null;

  return (
    <section
      ref={scope}
      className="bg-ink relative aspect-[21/9] min-h-[360px] w-full overflow-hidden sm:min-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Kampanye utama"
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          ref={(el) => {
            if (el) imageRefs.current.set(i, el);
          }}
          className="absolute inset-0"
          style={{ opacity: i === index ? 1 : 0 }}
          aria-hidden={i !== index}
        >
          <Image
            src={s.imageMobile}
            alt={s.headline}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover sm:hidden"
          />
          <Image
            src={s.image}
            alt={s.headline}
            fill
            priority={i === 0}
            sizes="100vw"
            className="hidden object-cover sm:block"
          />
        </div>
      ))}
      <div className="from-ink/70 absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent" />
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:left-10 sm:max-w-[560px] sm:gap-4 sm:p-0 sm:pb-14"
      >
        <span className="text-small font-medium tracking-[0.08em] text-white uppercase">
          {slide.label}
        </span>
        <h1 className="text-h1 sm:text-display-lg font-bold text-balance text-white">
          {slide.headline}
        </h1>
        <p className="text-body text-white">{slide.subheadline}</p>
        <Link href={slide.ctaHref} className="mt-2 self-start">
          <Button className="text-ink bg-white hover:bg-subtle">
            {slide.ctaLabel}
          </Button>
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="absolute right-4 bottom-4 hidden items-center gap-3 sm:right-10 sm:bottom-14 sm:flex">
          <div
            className="flex items-center gap-3"
            role="tablist"
            aria-label="Pilih slide"
          >
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={cn("bg-muted h-0.5 w-6", i === index && "bg-white")}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label={paused ? "Lanjutkan" : "Jeda"}
            onClick={() => setPaused((p) => !p)}
            className="border-muted ml-2 flex size-10 items-center justify-center rounded-full border text-white"
          >
            <Icon name={paused ? "play_arrow" : "pause"} size={20} />
          </button>
        </div>
      )}
    </section>
  );
}
