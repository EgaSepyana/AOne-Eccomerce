"use client";

import { useProductsByIds } from "@/entities/product";
import { useWishlistStore } from "../model/useWishlistStore";

export function useWishlistProducts() {
  const ids = useWishlistStore((s) => s.ids);
  return useProductsByIds(ids);
}
