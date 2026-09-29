"use client";

import { ProductCarousel, type ProductCarouselProps } from "@/entities/product";
import { useWishlistStore } from "../model/useWishlistStore";

export function WishlistProductCarousel(
  props: Omit<ProductCarouselProps, "wishlistedIds" | "onToggleWishlist">,
) {
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <ProductCarousel
      {...props}
      wishlistedIds={new Set(ids)}
      onToggleWishlist={toggle}
    />
  );
}
