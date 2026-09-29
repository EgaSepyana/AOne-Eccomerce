"use client";

import Link from "next/link";
import { useRef } from "react";
import { Icon } from "@/shared/ui";
import type { Product } from "../model/types";
import { ProductCard } from "./ProductCard";

export interface ProductCarouselProps {
  title: string;
  products: Product[];
  seeAllHref?: string;
  wishlistedIds?: Set<string>;
  onToggleWishlist?: (productId: string) => void;
}

export function ProductCarousel({
  title,
  products,
  seeAllHref,
  wishlistedIds,
  onToggleWishlist,
}: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    scrollerRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="flex flex-col gap-8 px-4 lg:px-10">
      <div className="flex items-center gap-4">
        <h2 className="text-h2 text-ink lg:text-h2-lg flex-1 font-bold">
          {title}
        </h2>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-small font-medium underline underline-offset-4"
          >
            Lihat semua
          </Link>
        )}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            aria-label="Sebelumnya"
            onClick={() => scrollBy(-1)}
            className="bg-subtle flex size-10 items-center justify-center rounded-full"
          >
            <Icon name="chevron_left" size={22} />
          </button>
          <button
            type="button"
            aria-label="Berikutnya"
            onClick={() => scrollBy(1)}
            className="bg-subtle flex size-10 items-center justify-center rounded-full"
          >
            <Icon name="chevron_right" size={22} />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:-mr-10 [&>*]:snap-start"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistedIds?.has(product.id)}
            onToggleWishlist={onToggleWishlist}
            className="w-[42vw] shrink-0 sm:w-[30vw] lg:w-[calc((100%-104px)/4.3)]"
          />
        ))}
      </div>
    </section>
  );
}
