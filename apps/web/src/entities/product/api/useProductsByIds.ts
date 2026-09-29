"use client";

import { useQueries } from "@tanstack/react-query";
import { repositories } from "@/services";
import type { Product } from "../model/types";

export function useProductsByIds(ids: string[]): { products: Product[]; isLoading: boolean } {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["product-by-id", id],
      queryFn: () => repositories.product.getById(id),
    })),
  });

  const isLoading = results.some((r) => r.isLoading);
  const products = results.map((r) => r.data).filter((p): p is Product => !!p);

  return { products, isLoading };
}
