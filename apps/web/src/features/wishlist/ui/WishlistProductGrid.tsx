"use client";

import { ProductGrid, type ProductGridProps } from "@/entities/product";
import { useWishlistStore } from "../model/useWishlistStore";

export function WishlistProductGrid(
  props: Omit<ProductGridProps, "wishlistedIds" | "onToggleWishlist">,
) {
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <ProductGrid
      {...props}
      wishlistedIds={new Set(ids)}
      onToggleWishlist={toggle}
    />
  );
}
