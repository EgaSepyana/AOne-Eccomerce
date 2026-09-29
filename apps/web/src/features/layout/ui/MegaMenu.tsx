"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { useCategories } from "@/entities/category";
import type { Gender } from "@/entities/product";
import { gsap } from "@/shared/lib/gsap";
import { EASE, prefersReducedMotion } from "@/shared/lib/motion";

export interface MegaMenuProps {
  gender: Gender;
  open: boolean;
}

export function MegaMenu({ gender, open }: MegaMenuProps) {
  const { data: categories } = useCategories(gender);
  const panelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = panelRef.current;
      if (!el) return;

      if (prefersReducedMotion()) {
        gsap.set(el, { height: open ? "auto" : 0, opacity: open ? 1 : 0 });
        return;
      }

      if (open) {
        gsap.set(el, { height: "auto" });
        const autoHeight = el.offsetHeight;
        gsap.fromTo(
          el,
          { height: 0, opacity: 0 },
          { height: autoHeight, opacity: 1, duration: 0.25, ease: EASE },
        );
      } else {
        gsap.to(el, { height: 0, opacity: 0, duration: 0.25, ease: EASE });
      }
    },
    { dependencies: [open] },
  );

  if (!categories || categories.length === 0) return null;

  return (
    <div
      ref={panelRef}
      className="border-border absolute inset-x-0 top-full z-50 overflow-hidden border-t bg-white shadow-overlay"
      style={{ height: 0, opacity: 0 }}
      role="menu"
      aria-label={`Kategori ${gender}`}
    >
      <div className="mx-auto grid max-w-[1440px] grid-cols-[1fr_320px] gap-10 px-10 py-8">
        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/c/${gender}/${category.slug}`}
              role="menuitem"
              className="text-body text-ink hover:text-muted"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <Link
          href={`/c/${gender}`}
          className="bg-subtle relative block aspect-[4/3] overflow-hidden"
        >
          {categories[0] && (
            <Image
              src={categories[0].image}
              alt={`Koleksi ${gender}`}
              fill
              sizes="320px"
              className="object-cover"
            />
          )}
        </Link>
      </div>
    </div>
  );
}
