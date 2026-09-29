import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import { queryKeys } from "@/shared/lib/query-keys";
import type { ProductQuery } from "../model/types";

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: queryKeys.products.list({ ...query }),
    queryFn: () => repositories.product.list(query),
    placeholderData: keepPreviousData,
  });
}
