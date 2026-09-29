"use client";

import { useProductsByIds, type Product } from "@/entities/product";
import { useRecentStore } from "../model/useRecentStore";

export function useRecentlyViewedProducts(excludeProductId?: string): Product[] {
  const ids = useRecentStore((s) => s.recentlyViewed).filter((id) => id !== excludeProductId);
  const { products } = useProductsByIds(ids);
  return products;
}
