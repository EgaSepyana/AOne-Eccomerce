import { useInfiniteQuery } from "@tanstack/react-query";
import { repositories } from "@/services";
import { queryKeys } from "@/shared/lib/query-keys";
import type { ProductQuery } from "../model/types";

const PAGE_SIZE = 24;

export function useProductList(query: Omit<ProductQuery, "page" | "pageSize">) {
  return useInfiniteQuery({
    queryKey: queryKeys.products.list({ ...query }),
    queryFn: ({ pageParam }) =>
      repositories.product.list({
        ...query,
        page: pageParam,
        pageSize: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, p) => sum + p.items.length, 0);
      return loaded < lastPage.total ? allPages.length + 1 : undefined;
    },
  });
}

export { PAGE_SIZE };
